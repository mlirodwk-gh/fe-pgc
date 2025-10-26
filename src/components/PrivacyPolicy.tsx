import React from 'react';
import { ArrowLeft, Shield, Eye, Lock, Users, FileText, AlertTriangle, Phone, Mail, MapPin } from 'lucide-react';

interface PrivacyPolicyProps {
  onBack: () => void;
}

export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al Panel Principal
          </button>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="h-8 w-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Política de Tratamiento de Datos Personales
              </h1>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-8">
              <p className="text-blue-800 dark:text-blue-200 text-sm">
                <strong>Última actualización:</strong> {new Date().toLocaleDateString('es-ES', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Sección 1: Introducción */}
          <section className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                1. Introducción y Alcance
              </h2>
            </div>
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                La presente Política de Tratamiento de Datos Personales establece los términos y condiciones 
                bajo los cuales <strong>Entidad Financiera S.A.</strong> (en adelante "la Entidad") recolecta, 
                almacena, usa, circula y suprime los datos personales de sus clientes, usuarios y terceros 
                relacionados con nuestros productos y servicios financieros.
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                Esta política se aplica a todos los productos financieros ofrecidos por la Entidad, incluyendo 
                pero no limitándose a créditos comerciales, créditos de consumo, créditos para vivienda, 
                operaciones financieras, instrumentos de deuda, créditos contingentes y líneas de crédito.
              </p>
            </div>
          </section>

          {/* Sección 2: Responsable del Tratamiento */}
          <section className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <Users className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                2. Responsable del Tratamiento
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Información de la Entidad</h3>
                <div className="space-y-2 text-gray-600 dark:text-gray-300">
                  <p><strong>Razón Social:</strong> Entidad Financiera S.A.</p>
                  <p><strong>NIT:</strong> 900.123.456-7</p>
                  <p><strong>Domicilio:</strong> Bogotá D.C., Colombia</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Datos de Contacto</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <MapPin className="h-4 w-4" />
                    <span>Carrera 7 # 71-21, Torre A, Piso 10</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <Phone className="h-4 w-4" />
                    <span>+57 (1) 123-4567</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <Mail className="h-4 w-4" />
                    <span>protecciondatos@entidadfinanciera.com</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Sección 3: Tipos de Datos */}
          <section className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <Eye className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                3. Tipos de Datos Personales Tratados
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Datos de Identificación</h3>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1">
                  <li>Nombres y apellidos completos</li>
                  <li>Número de identificación</li>
                  <li>Fecha y lugar de nacimiento</li>
                  <li>Nacionalidad y estado civil</li>
                  <li>Fotografía y firma</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Datos de Contacto</h3>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1">
                  <li>Dirección de residencia y correspondencia</li>
                  <li>Números telefónicos</li>
                  <li>Correo electrónico</li>
                  <li>Redes sociales</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Datos Financieros</h3>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1">
                  <li>Información de ingresos y patrimonio</li>
                  <li>Historial crediticio</li>
                  <li>Información bancaria</li>
                  <li>Declaraciones tributarias</li>
                  <li>Estados financieros</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Datos Comerciales</h3>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1">
                  <li>Actividad económica</li>
                  <li>Información laboral</li>
                  <li>Referencias comerciales</li>
                  <li>Historial de productos</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Sección 4: Finalidades */}
          <section className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <Lock className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                4. Finalidades del Tratamiento
              </h2>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Créditos Comerciales</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Evaluación crediticia, estructuración de operaciones comerciales, seguimiento de cartera, 
                  gestión de garantías y cumplimiento de obligaciones regulatorias para productos de crédito empresarial.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Créditos de Consumo</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Análisis de capacidad de pago, ofrecimiento de productos personalizados, gestión de cobranza, 
                  y mejoramiento continuo de servicios financieros para personas naturales.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Créditos para Vivienda</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Evaluación hipotecaria, valoración de inmuebles, estructuración de créditos de vivienda, 
                  seguimiento de construcción y administración de garantías inmobiliarias.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Operaciones Financieras</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Gestión de inversiones, asesoría financiera, administración de portafolios, 
                  análisis de riesgo y ofrecimiento de productos de ahorro e inversión.
                </p>
              </div>
            </div>
          </section>

          {/* Sección 5: Derechos */}
          <section className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                5. Derechos de los Titulares
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Derechos Fundamentales</h3>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                  <li><strong>Acceso:</strong> Conocer qué datos personales tenemos sobre usted</li>
                  <li><strong>Actualización:</strong> Solicitar la corrección de datos inexactos</li>
                  <li><strong>Rectificación:</strong> Modificar información incompleta o errónea</li>
                  <li><strong>Supresión:</strong> Solicitar la eliminación de sus datos cuando sea procedente</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Derechos Adicionales</h3>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                  <li><strong>Revocación:</strong> Retirar la autorización otorgada</li>
                  <li><strong>Oposición:</strong> Oponerse al tratamiento de sus datos</li>
                  <li><strong>Portabilidad:</strong> Obtener sus datos en formato estructurado</li>
                  <li><strong>Reclamo:</strong> Presentar quejas ante la autoridad competente</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Sección 6: Seguridad */}
          <section className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                6. Medidas de Seguridad
              </h2>
            </div>
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                La Entidad implementa medidas técnicas, humanas y administrativas necesarias para otorgar 
                seguridad a los registros evitando su adulteración, pérdida, consulta, uso o acceso no autorizado 
                o fraudulento, incluyendo:
              </p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                <li>Cifrado de datos en tránsito y en reposo</li>
                <li>Controles de acceso basados en roles</li>
                <li>Monitoreo continuo de sistemas</li>
                <li>Auditorías periódicas de seguridad</li>
                <li>Capacitación continua del personal</li>
                <li>Planes de continuidad del negocio</li>
              </ul>
            </div>
          </section>

          {/* Sección 7: Contacto */}
          <section className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <Mail className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                7. Canal de Atención
              </h2>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                Para ejercer sus derechos o realizar consultas sobre el tratamiento de sus datos personales:
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Mail className="h-4 w-4" />
                    <span>protecciondatos@entidadfinanciera.com</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Phone className="h-4 w-4" />
                    <span>Línea Nacional: 01-8000-123-456</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <MapPin className="h-4 w-4" />
                    <span>Oficina Principal: Carrera 7 # 71-21</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Horario de atención: Lunes a Viernes 8:00 AM - 5:00 PM
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={onBack}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200"
          >
            Volver al Panel Principal
          </button>
        </div>
      </div>
    </div>
  );
};