import React, { useState } from 'react';
import { ArrowLeft, Save, Shield, Eye, CheckCircle, XCircle, Calendar, User, AlertCircle, Loader } from 'lucide-react';
import { ConsentCategory, ConsentRecord } from '../types/consent';

interface UserConsentManagerProps {
  categories: ConsentCategory[];
  currentConsent: Record<string, boolean>;
  currentExpiry: Record<string, Date | null>;
  records: ConsentRecord[];
  isSubmitting?: boolean;
  lastSubmissionError?: string | null;
  onSaveConsent: (consents: Record<string, boolean>, expiry?: Record<string, Date | null>) => Promise<void>;
  onClearSubmissionError?: () => void;
  onBack: () => void;
}

const categoryIcons = {
  creditos_comerciales: Shield,
  creditos_consumo: Eye,
  creditos_vivienda: Shield,
  operaciones_financieras: Eye,
  instrumentos_deuda: Shield,
  creditos_contingentes: Eye,
  lineas_credito: Shield,
};

export const UserConsentManager: React.FC<UserConsentManagerProps> = ({
  categories,
  currentConsent,
  currentExpiry,
  records,
  onSaveConsent,
  isSubmitting = false,
  lastSubmissionError,
  onClearSubmissionError,
  onBack,
}) => {
  const [preferences, setPreferences] = useState<Record<string, boolean>>(currentConsent);
  const [expiryDates, setExpiryDates] = useState<Record<string, Date | null>>(currentExpiry);
  const [hasChanges, setHasChanges] = useState(false);

  const handleToggle = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    if (category?.required) return;

    const newValue = !preferences[categoryId];
    const newPreferences = {
      ...preferences,
      [categoryId]: newValue,
    };
    
    let newExpiryDates = { ...expiryDates };
    if (newValue && !expiryDates[categoryId]) {
      // If enabling and no expiry date set, set default to 1 year
      const defaultExpiry = new Date();
      defaultExpiry.setFullYear(defaultExpiry.getFullYear() + 1);
      newExpiryDates[categoryId] = defaultExpiry;
    } else if (!newValue) {
      // If disabling, clear expiry date
      newExpiryDates[categoryId] = null;
    }
    
    setPreferences(newPreferences);
    setExpiryDates(newExpiryDates);
    setHasChanges(
      JSON.stringify(newPreferences) !== JSON.stringify(currentConsent) ||
      JSON.stringify(newExpiryDates) !== JSON.stringify(currentExpiry)
    );
  };
  
  const handleExpiryChange = (categoryId: string, date: string) => {
    const newExpiryDates = {
      ...expiryDates,
      [categoryId]: date ? new Date(date) : null,
    };
    
    setExpiryDates(newExpiryDates);
    setHasChanges(
      JSON.stringify(preferences) !== JSON.stringify(currentConsent) ||
      JSON.stringify(newExpiryDates) !== JSON.stringify(currentExpiry)
    );
  };

  const handleSave = async () => {
    if (onClearSubmissionError) {
      onClearSubmissionError();
    }
    await onSaveConsent(preferences, expiryDates);
    setHasChanges(false);
  };

  const handleReset = () => {
    setPreferences(currentConsent);
    setExpiryDates(currentExpiry);
    setHasChanges(false);
  };

  // Get user's latest record for display
  const latestRecord = records[0];
  const userRecords = records.slice(0, 5); // Show last 5 records

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
              <User className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Mis Autorizaciones de Tratamiento de Datos
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  Gestione sus autorizaciones para el tratamiento de datos en productos financieros
                </p>
              </div>
            </div>
            
            {latestRecord && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    Última actualización: {new Date(latestRecord.timestamp).toLocaleString('es-ES')}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-8">
          {/* Current Consent Status */}
          <section className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              Estado Actual de Autorizaciones
            </h2>
            
            <div className="space-y-4">
              {categories.map((category) => {
                const Icon = categoryIcons[category.id as keyof typeof categoryIcons] || Shield;
                const isEnabled = preferences[category.id];
                const hasChanged = preferences[category.id] !== currentConsent[category.id] ||
                  JSON.stringify(expiryDates[category.id]) !== JSON.stringify(currentExpiry[category.id]);
                const expiryDate = expiryDates[category.id];
                const isExpired = expiryDate && expiryDate < new Date();
                const wasAutoDisabled = !isEnabled && currentConsent[category.id] && isExpired;

                return (
                  <div
                    key={category.id}
                    className={`border rounded-lg p-6 transition-all duration-200 ${
                      hasChanged 
                        ? 'border-blue-300 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/10' 
                        : isExpired || wasAutoDisabled
                        ? 'border-orange-300 dark:border-orange-600 bg-orange-50 dark:bg-orange-900/10'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <Icon className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {category.name}
                            </h3>
                            {category.required && (
                              <span className="px-3 py-1 text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full">
                                Obligatoria
                              </span>
                            )}
                            {hasChanged && (
                              <span className="px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
                                Modificado
                              </span>
                            )}
                            {wasAutoDisabled && (
                              <span className="px-3 py-1 text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full">
                                Auto-desactivado
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                            {category.description}
                          </p>
                          
                          {wasAutoDisabled && (
                            <div className="mb-4 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                              <p className="text-sm text-orange-800 dark:text-orange-200">
                                <strong>Autorización expirada:</strong> Esta autorización fue desactivada automáticamente 
                                porque superó su fecha de vigencia. Puede reactivarla estableciendo una nueva fecha.
                              </p>
                            </div>
                          )}
                          
                          {isEnabled && (
                            <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Fecha de vigencia:
                              </label>
                              <input
                                type="date"
                                value={expiryDate ? expiryDate.toISOString().split('T')[0] : ''}
                                onChange={(e) => handleExpiryChange(category.id, e.target.value)}
                                min={new Date().toISOString().split('T')[0]}
                                className="text-sm px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white w-full"
                              />
                              {expiryDate && (
                                <div className="mt-2 flex items-center gap-2">
                                  {isExpired ? (
                                    <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
                                      <XCircle className="h-4 w-4" />
                                      <span className="text-sm font-medium">
                                        Expiró el {expiryDate.toLocaleDateString('es-ES')}
                                      </span>
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                                      <CheckCircle className="h-4 w-4" />
                                      <span className="text-sm">
                                        Válido hasta {expiryDate.toLocaleDateString('es-ES')}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                          
                          <div className="flex items-center gap-2 text-sm">
                            {isEnabled ? (
                              <div className={`flex items-center gap-2 ${
                                isExpired 
                                  ? 'text-red-700 dark:text-red-300' 
                                  : 'text-green-700 dark:text-green-300'
                              }`}>
                                <CheckCircle className="h-4 w-4" />
                                <span className="font-medium">
                                  {isExpired ? 'Autorización Expirada' : 'Autorizado'}
                                </span>
                              </div>
                            ) : wasAutoDisabled ? (
                              <div className="flex items-center gap-2 text-orange-700 dark:text-orange-300">
                                <XCircle className="h-4 w-4" />
                                <span className="font-medium">Desactivado por expiración</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
                                <XCircle className="h-4 w-4" />
                                <span className="font-medium">No autorizado</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="ml-6">
                        <button
                          onClick={() => handleToggle(category.id)}
                          disabled={category.required}
                          className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                            isEnabled
                              ? 'bg-blue-600'
                              : 'bg-gray-200 dark:bg-gray-700'
                          } ${
                            category.required
                              ? 'opacity-50 cursor-not-allowed'
                              : 'cursor-pointer hover:bg-blue-700'
                          }`}
                        >
                          <span
                            className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-200 ${
                              isEnabled ? 'translate-x-7' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {hasChanges && (
              <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <p className="text-yellow-800 dark:text-yellow-200 text-sm mb-4">
                  Tiene cambios sin guardar en sus autorizaciones. Recuerde guardar los cambios para que sean efectivos.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={handleSave}
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader className="h-4 w-4 animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Guardar Cambios
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleReset}
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium transition-colors"
                  >
                    Descartar Cambios
                  </button>
                </div>
              </div>
            )}

            {lastSubmissionError && (
              <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex items-center gap-2 text-red-800 dark:text-red-200">
                  <AlertCircle className="h-4 w-4" />
                  <p className="text-sm font-medium">Error al enviar consentimiento</p>
                </div>
                <p className="text-red-700 dark:text-red-300 text-sm mt-1">
                  {lastSubmissionError}
                </p>
                <p className="text-red-600 dark:text-red-400 text-xs mt-2">
                  Los cambios se han guardado localmente, pero no se pudieron sincronizar con el servidor.
                </p>
              </div>
            )}
          </section>

          {/* Consent History */}
          <section className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              Historial de Autorizaciones
            </h2>
            
            {userRecords.length > 0 ? (
              <div className="space-y-4">
                {userRecords.map((record, index) => (
                  <div
                    key={record.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {new Date(record.timestamp).toLocaleString('es-ES')}
                        </span>
                        {index === 0 && (
                          <span className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded">
                            Actual
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                        {record.id}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                      {Object.entries(record.consents).map(([categoryId, authorized]) => {
                        const category = categories.find(c => c.id === categoryId);
                        return (
                          <div
                            key={categoryId}
                            className={`px-3 py-2 rounded text-xs font-medium ${
                              authorized
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                                : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                            }`}
                          >
                            {category?.name || categoryId}: {authorized ? '✓' : '✗'}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No hay registros de autorizaciones disponibles</p>
              </div>
            )}
          </section>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={onBack}
            className="px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors duration-200"
          >
            Volver al Panel Principal
          </button>
        </div>
      </div>
    </div>
  );
};