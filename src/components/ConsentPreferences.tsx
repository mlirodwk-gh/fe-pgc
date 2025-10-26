import React, { useState } from 'react';
import { X, Save, Shield, BarChart3, Target, Settings as SettingsIcon } from 'lucide-react';
import { ConsentCategory } from '../types/consent';

interface ConsentPreferencesProps {
  categories: ConsentCategory[];
  onSave: (consents: Record<string, boolean>) => void;
  onClose: () => void;
  onShowPrivacyPolicy?: () => void;
}

const categoryIcons = {
  creditos_comerciales: Shield,
  creditos_consumo: BarChart3,
  creditos_vivienda: SettingsIcon,
  operaciones_financieras: Target,
  instrumentos_deuda: Shield,
  creditos_contingentes: BarChart3,
  lineas_credito: SettingsIcon,
};

export const ConsentPreferences: React.FC<ConsentPreferencesProps> = ({
  categories,
  onSave,
  onClose,
  onShowPrivacyPolicy,
}) => {
  const [preferences, setPreferences] = useState<Record<string, boolean>>(() => {
    return categories.reduce((acc, category) => {
      acc[category.id] = category.required || category.enabled;
      return acc;
    }, {} as Record<string, boolean>);
  });
  
  const [expiryDates, setExpiryDates] = useState<Record<string, Date | null>>(() => {
    const defaultExpiry = new Date();
    defaultExpiry.setFullYear(defaultExpiry.getFullYear() + 1);
    
    return categories.reduce((acc, category) => {
      acc[category.id] = category.required || category.enabled ? defaultExpiry : null;
      return acc;
    }, {} as Record<string, Date | null>);
  });

  const handleToggle = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    if (category?.required) return;

    const newValue = !preferences[categoryId];
    setPreferences(prev => ({
      ...prev,
      [categoryId]: newValue,
    }));
    
    // If enabling, set default expiry date; if disabling, clear expiry
    if (newValue) {
      const defaultExpiry = new Date();
      defaultExpiry.setFullYear(defaultExpiry.getFullYear() + 1);
      setExpiryDates(prev => ({
        ...prev,
        [categoryId]: defaultExpiry,
      }));
    } else {
      setExpiryDates(prev => ({
        ...prev,
        [categoryId]: null,
      }));
    }
  };
  
  const handleExpiryChange = (categoryId: string, date: string) => {
    setExpiryDates(prev => ({
      ...prev,
      [categoryId]: date ? new Date(date) : null,
    }));
  };

  const handleSave = () => {
    onSave(preferences, expiryDates);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Preferencias de Tratamiento de Datos Financieros
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[70vh]">
          <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm">
            Seleccione los productos financieros para los cuales autoriza el tratamiento de sus datos personales. 
            Puede modificar estas autorizaciones en cualquier momento. Para más información, consulte nuestra{' '}
            {onShowPrivacyPolicy && (
              <button 
                onClick={onShowPrivacyPolicy}
                className="text-blue-600 hover:underline font-medium"
              >
                Política de Tratamiento de Datos
              </button>
            )}.
          </p>

          <div className="space-y-4">
            {categories.map((category) => {
              const Icon = categoryIcons[category.id as keyof typeof categoryIcons] || Shield;
              const isEnabled = preferences[category.id];

              return (
                <div
                  key={category.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <Icon className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {category.name}
                          </h3>
                          {category.required && (
                            <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded">
                              Requerida
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                          {category.description}
                        </p>
                        
                        {isEnabled && (
                          <div className="mb-3">
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Fecha de vigencia:
                            </label>
                            <input
                              type="date"
                              value={expiryDates[category.id] ? expiryDates[category.id]!.toISOString().split('T')[0] : ''}
                              onChange={(e) => handleExpiryChange(category.id, e.target.value)}
                              min={new Date().toISOString().split('T')[0]}
                              className="text-xs px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                            {expiryDates[category.id] && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                Expira: {expiryDates[category.id]!.toLocaleDateString('es-ES')}
                              </p>
                            )}
                          </div>
                        )}
                        
                        <details className="group">
                          <summary className="text-sm text-blue-600 hover:text-blue-700 cursor-pointer mb-2">
                            Ver datos procesados ({category.cookies.length})
                          </summary>
                          <div className="bg-gray-50 dark:bg-gray-800 rounded-md p-3 space-y-2">
                            {category.cookies.map((cookie) => (
                              <div key={cookie.id} className="text-xs">
                                <div className="flex justify-between items-start">
                                  <span className="font-mono text-gray-900 dark:text-white">
                                    {cookie.name}
                                  </span>
                                  <span className="text-gray-500 dark:text-gray-400">
                                    {cookie.expiry}
                                  </span>
                                </div>
                                <div className="text-gray-600 dark:text-gray-300 mt-1">
                                  {cookie.purpose}
                                </div>
                              </div>
                            ))}
                          </div>
                        </details>
                      </div>
                    </div>
                    <div className="ml-4">
                      <button
                        onClick={() => handleToggle(category.id)}
                        disabled={category.required}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                          isEnabled
                            ? 'bg-blue-600'
                            : 'bg-gray-200 dark:bg-gray-700'
                        } ${
                          category.required
                            ? 'opacity-50 cursor-not-allowed'
                            : 'cursor-pointer'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                            isEnabled ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <Save className="h-4 w-4" />
            Guardar Preferencias
          </button>
        </div>
      </div>
    </div>
  );
};