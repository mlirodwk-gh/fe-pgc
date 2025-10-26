import { configLoader, WebServiceConfig } from '../config/configLoader';

export interface ConsentSubmission {
  userId: string;
  timestamp: Date;
  consents: Record<string, boolean>;
  consentExpiry: Record<string, Date | null>;
  ipAddress: string;
  userAgent: string;
  source: 'user_action' | 'auto_expired';
}

export interface ConsentResponse {
  success: boolean;
  recordId?: string;
  message?: string;
  error?: string;
}

class ConsentService {
  private config: WebServiceConfig | null = null;

  constructor() {
    this.initializeConfig();
  }

  /**
   * Inicializa la configuración del servicio
   */
  private async initializeConfig(): Promise<void> {
    try {
      this.config = await configLoader.getConfig();
    } catch (error) {
      console.error('Error inicializando configuración del servicio:', error);
    }
  }

  /**
   * Obtiene la configuración, inicializándola si es necesario
   */
  private async getConfig(): Promise<WebServiceConfig> {
    if (!this.config) {
      this.config = await configLoader.getConfig();
    }
    return this.config;
  }

  /**
   * Realiza una petición HTTP con reintentos y timeout
   */
  private async makeRequest(
    url: string,
    options: RequestInit,
    retries: number = 0
  ): Promise<Response> {
    const config = await this.getConfig();
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), config.timeout);      
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      console.log(response)

      clearTimeout(timeoutId);
      if (!response.ok && retries < config.maxRetries) {
        if (config.logging.enabled && config.debug) {
          console.warn(`Reintentando petición (${retries + 1}/${config.maxRetries}):`, url);
        }
        await new Promise(resolve => setTimeout(resolve, config.retryInterval));
        return this.makeRequest(url, options, retries + 1);
      }
      
      return response;
    } catch (error) {
      if (retries < config.maxRetries) {
        if (config.logging.enabled && config.debug) {
          console.warn(`Error en petición, reintentando (${retries + 1}/${config.maxRetries}):`, error);
        }
        await new Promise(resolve => setTimeout(resolve, config.retryInterval));
        return this.makeRequest(url, options, retries + 1);
      }
      throw error;
    }
  }

  async saveUserConsents(submission: ConsentSubmission): Promise<ConsentResponse> {
    const config = await this.getConfig();
    
    if (!config.enabled) {
      if (config.logging.enabled) {
        console.log('Web service deshabilitado, omitiendo envío de consentimiento');
      }
      return {
        success: true,
        message: 'Consentimiento guardado localmente (web service deshabilitado)',
      };
    }

    try {
      const url = await configLoader.getEndpointUrl('saveUserCns');
      
      if (config.logging.enabled && config.debug) {
        console.log('Enviando consentimiento a:', url);
      }
      
      const response = await this.makeRequest(url, {
        method: 'POST',
        headers: {
          'Content-Type': config.headers.contentType,
          'Authorization': `Bearer ${config.apiKey}`,
          'X-Client-Version': config.clientVersion,
          'User-Agent': config.headers.userAgent,
        },
        body: JSON.stringify({
          ...submission,
          timestamp: submission.timestamp.toISOString(),
          consentExpiry: Object.entries(submission.consentExpiry).reduce((acc, [key, value]) => {
            acc[key] = value ? value.toISOString() : null;
            return acc;
          }, {} as Record<string, string | null>),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
           
      const data = await response.json();
      console.log(data)
  
      if (config.logging.enabled) {
        console.log('Consentimiento enviado exitosamente:', data.recordId);
      }
      
      return {
        success: true,
        recordId: data.recordId,
        message: data.message || 'Consentimiento registrado exitosamente',
      };
    } catch (error) {
      const config = await this.getConfig();
      if (config.logging.enabled) {
        console.error('Error enviando consentimiento:', error);
      }
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  }

  async getUserConsents(userId: string): Promise<ConsentSubmission[]> {
    const config = await this.getConfig();
    
    if (!config.enabled) {
      if (config.logging.enabled) {
        console.log('Web service deshabilitado, retornando historial vacío');
      }
      return [];
    }

    try {
      const baseUrl = await configLoader.getEndpointUrl('getUserCns');
      const url = `${baseUrl}/${userId}`;
      
      const response = await this.makeRequest(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'X-Client-Version': config.clientVersion,
          'User-Agent': config.headers.userAgent,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.records || [];
    } catch (error) {
      const config = await this.getConfig();
      if (config.logging.enabled) {
        console.error('Error obteniendo historial de consentimientos:', error);
      }
      return [];
    }
  }

  async deleteUserConsent(userId: string): Promise<ConsentResponse> {
    const config = await this.getConfig();
    
    if (!config.enabled) {
      if (config.logging.enabled) {
        console.log('Web service deshabilitado, omitiendo eliminación remota');
      }
      return {
        success: true,
        message: 'Datos eliminados localmente (web service deshabilitado)',
      };
    }

    try {
      const baseUrl = await configLoader.getEndpointUrl('delete');
      const url = `${baseUrl}/${userId}`;
      
      const response = await this.makeRequest(url, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'X-Client-Version': config.clientVersion,
          'User-Agent': config.headers.userAgent,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        message: data.message || 'Datos de usuario eliminados exitosamente',
      };
    } catch (error) {
      const config = await this.getConfig();
      if (config.logging.enabled) {
        console.error('Error eliminando consentimiento de usuario:', error);
      }
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  }

  /**
   * Obtiene la IP del cliente desde un servicio externo
   */
  async getClientIP(): Promise<string> {
    const config = await this.getConfig();
    
    try {
      const response = await this.makeRequest(config.ipServiceUrl, {
        method: 'GET',
      });
      
      const data = await response.json();
      return data.ip;
    } catch (error) {
      if (config.logging.enabled) {
        console.error('Error obteniendo IP del cliente:', error);
      }
      return '127.0.0.1'; // IP por defecto
    }
  }

  /**
   * Verifica el estado del web service
   */
  async checkServiceHealth(): Promise<boolean> {
    const config = await this.getConfig();
    
    if (!config.enabled) {
      return false;
    }

    try {
      const response = await this.makeRequest(`${config.baseUrl}/health`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'X-Client-Version': config.clientVersion,
        },
      });
      
      return response.ok;
    } catch (error) {
      if (config.logging.enabled) {
        console.error('Error verificando estado del servicio:', error);
      }
      return false;
    }
  }
}

export const consentService = new ConsentService();