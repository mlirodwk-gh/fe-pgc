import { useState } from 'react';
import { consentCategories } from './data/consentCategories';
import { useConsent } from './hooks/useConsent';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { UserConsentManager } from './components/UserConsentManager';

function App() {

  const [currentView, setCurrentView] = useState<'home' | 'privacy' | 'user-consent'>('home');
  const {
    consent,
    consentExpiry,
    records,
    isSubmitting,
    lastSubmissionError,
    saveConsent,
    clearSubmissionError,
  } = useConsent();

  if (currentView === 'privacy') {
    return <PrivacyPolicy onBack={() => setCurrentView('home')} />;
  }

  if (currentView === 'user-consent') {
    return (
      <UserConsentManager
        categories={consentCategories}
        currentConsent={consent}
        currentExpiry={consentExpiry}
        records={records}
        isSubmitting={isSubmitting}
        lastSubmissionError={lastSubmissionError}
        onSaveConsent={saveConsent}
        onClearSubmissionError={clearSubmissionError}
        onBack={() => setCurrentView('home')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Plataforma de Gestión de Consentimiento Financiero
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Gestione sus autorizaciones de tratamiento de datos para productos financieros
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <button
            onClick={() => setCurrentView('user-consent')}
            className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 text-left group"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Gestionar Autorizaciones
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              Visualice y modifique sus autorizaciones de tratamiento de datos para productos financieros
            </p>
          </button>

          <button
            onClick={() => setCurrentView('privacy')}
            className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 text-left group"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-colors">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Política de Privacidad
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              Consulte nuestra política completa de tratamiento de datos personales
            </p>
          </button>
        </div>

        <div className="mt-16 text-center">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Información Importante
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Sus datos personales son procesados de acuerdo con la normativa colombiana de protección de datos. 
              Puede ejercer sus derechos de acceso, rectificación, actualización y supresión en cualquier momento.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;