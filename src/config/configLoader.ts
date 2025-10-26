/**
 * Cargador de configuración para el web service
 * Lee las propiedades desde el archivo webservice.properties
 */

export interface WebServiceConfig {
  baseUrl: string;
  apiKey: string;
  clientVersion: string;
  timeout: number;
  maxRetries: number;
  retryInterval: number;
  enabled: boolean;
  ipServiceUrl: string;
  endpoints: {
    saveUserCns: string;
    getUserCns: string;
    delete: string;
  };
  logging: {
    enabled: boolean;
    level: string;
  };
  headers: {
    contentType: string;
    userAgent: string;
  };
  environment: string;
  debug: boolean;
}

class ConfigLoader {
  private config: WebServiceConfig | null = null;
  private configPromise: Promise<WebServiceConfig> | null = null;

  /**
   * Carga la configuración desde el archivo de propiedades
   */
  private async loadConfig(): Promise<WebServiceConfig> {
    try {
      // En un entorno real, esto se cargaría desde el servidor o variables de entorno
      // Para este ejemplo, usamos una configuración por defecto
      const defaultConfig: WebServiceConfig = {
        baseUrl: '',
        apiKey: '',
        clientVersion: '1.0.0',
        timeout: 5000,
        maxRetries: 3,
        retryInterval: 1000,
        enabled: true,
        ipServiceUrl: '',
        endpoints: {
          saveUserCns: '/bffpgc/v1/save_user_cns',
          getUserCns: '/bffpgc/v1/get_user_cns',
          delete: '',
        },
        logging: {
          enabled: true,
          level: 'info',
        },
        headers: {
          contentType: 'application/json',
          userAgent: 'fe-pgc/1.0.0',
        },
        environment: 'development',
        debug: true,
      };

      // En producción, aquí se leería el archivo de propiedades
      // o se obtendrían las variables de entorno
      const envConfig = this.loadFromEnvironment();
      this.config = { ...defaultConfig, ...envConfig };

      if (this.config.logging.enabled && this.config.debug) {
        console.log('Configuración del web service cargada:', {
          baseUrl: this.config.baseUrl,
          clientVersion: this.config.clientVersion,
          environment: this.config.environment,
          enabled: this.config.enabled,
        });
      }

      return this.config;
    } catch (error) {
      console.error('Error cargando configuración del web service:', error);
      throw new Error('No se pudo cargar la configuración del web service');
    }
  }

  /**
   * Carga configuración desde variables de entorno
   */
  private loadFromEnvironment(): Partial<WebServiceConfig> {
    const envConfig: Partial<WebServiceConfig> = {};

    // Variables de entorno que pueden sobrescribir la configuración
    if (import.meta.env.VITE_WEBSERVICE_BASE_URL) {
      envConfig.baseUrl = import.meta.env.VITE_WEBSERVICE_BASE_URL;
    }

    if (import.meta.env.VITE_WEBSERVICE_API_KEY) {
      envConfig.apiKey = import.meta.env.VITE_WEBSERVICE_API_KEY;
    }

    if (import.meta.env.VITE_WEBSERVICE_ENABLED) {
      envConfig.enabled = import.meta.env.VITE_WEBSERVICE_ENABLED === 'true';
    }

    if (import.meta.env.VITE_WEBSERVICE_ENVIRONMENT) {
      envConfig.environment = import.meta.env.VITE_WEBSERVICE_ENVIRONMENT;
    }

    if (import.meta.env.VITE_WEBSERVICE_DEBUG) {
      envConfig.debug = import.meta.env.VITE_WEBSERVICE_DEBUG === 'true';
    }

    return envConfig;
  }

  /**
   * Obtiene la configuración (carga si es necesario)
   */
  public async getConfig(): Promise<WebServiceConfig> {
    if (this.config) {
      return this.config;
    }

    if (!this.configPromise) {
      this.configPromise = this.loadConfig();
    }

    return this.configPromise;
  }

  /**
   * Recarga la configuración
   */
  public async reloadConfig(): Promise<WebServiceConfig> {
    this.config = null;
    this.configPromise = null;
    return this.getConfig();
  }

  /**
   * Obtiene un valor específico de la configuración
   */
  public async getConfigValue<K extends keyof WebServiceConfig>(
    key: K
  ): Promise<WebServiceConfig[K]> {
    const config = await this.getConfig();
    return config[key];
  }

  /**
   * Verifica si el web service está habilitado
   */
  public async isEnabled(): Promise<boolean> {
    const config = await this.getConfig();
    return config.enabled;
  }

  /**
   * Obtiene la URL completa para un endpoint específico
   */
  public async getEndpointUrl(endpoint: keyof WebServiceConfig['endpoints']): Promise<string> {
    const config = await this.getConfig();
    return `${config.baseUrl}${config.endpoints[endpoint]}`;
  }
}

export const configLoader = new ConfigLoader();