import { useState, useEffect } from 'react';
import { ConsentCategory, ConsentRecord } from '../types/consent';
import { consentService, ConsentSubmission } from '../services/consentService';

const CONSENT_STORAGE_KEY = 'cmp_consent';
const CONSENT_RECORDS_KEY = 'cmp_records';

export const useConsent = () => {
  const [consent, setConsent] = useState<Record<string, boolean>>({});
  const [consentExpiry, setConsentExpiry] = useState<Record<string, Date | null>>({});
  const [showBanner, setShowBanner] = useState(false);
  const [records, setRecords] = useState<ConsentRecord[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmissionError, setLastSubmissionError] = useState<string | null>(null);

  // Function to check and handle expired consents
  const checkAndHandleExpiredConsents = (
    currentConsent: Record<string, boolean>,
    currentExpiry: Record<string, Date | null>,
    currentRecords: ConsentRecord[]
  ) => {
    const now = new Date();
    let hasExpiredConsents = false;
    const updatedConsent = { ...currentConsent };
    const updatedExpiry = { ...currentExpiry };

    Object.entries(currentExpiry).forEach(([categoryId, expiryDate]) => {
      if (expiryDate && expiryDate < now && currentConsent[categoryId]) {
        // Consent has expired and is currently active, disable it
        updatedConsent[categoryId] = false;
        updatedExpiry[categoryId] = null;
        hasExpiredConsents = true;
        console.log(`Consent for ${categoryId} has expired and been automatically disabled`);
      }
    });

    if (hasExpiredConsents) {
      // Update state and localStorage
      setConsent(updatedConsent);
      setConsentExpiry(updatedExpiry);
      localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(updatedConsent));
      localStorage.setItem(CONSENT_STORAGE_KEY + '_expiry', JSON.stringify(updatedExpiry));

      // Create audit record for automatic expiration
      const record: ConsentRecord = {
        id: `record_${Date.now()}_expired`,
        userId: `user_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date(),
        consents: updatedConsent,
        consentExpiry: updatedExpiry,
        ipAddress: '192.168.1.1',
        userAgent: navigator.userAgent + ' [AUTO-EXPIRED]',
      };

      const updatedRecords = [record, ...currentRecords].slice(0, 100);

      // Enviar al web service la expiración automática
      submitToWebService(record, 'auto_expired');

      return { updatedConsent, updatedExpiry, hasExpiredConsents, newRecords: updatedRecords };
    }

    return { updatedConsent: currentConsent, updatedExpiry: currentExpiry, hasExpiredConsents, newRecords: currentRecords };
  };

  useEffect(() => {
    const savedConsent = localStorage.getItem(CONSENT_STORAGE_KEY);
    const savedExpiry = localStorage.getItem(CONSENT_STORAGE_KEY + '_expiry');
    const savedRecords = localStorage.getItem(CONSENT_RECORDS_KEY);
    
    let parsedConsent = {};
    let parsedExpiry = {};
    let parsedRecords: ConsentRecord[] = [];

    if (savedConsent) {
      parsedConsent = JSON.parse(savedConsent);
    } else {
      setShowBanner(true);
    }

    if (savedExpiry) {
      const rawExpiry = JSON.parse(savedExpiry);
      // Convert string dates back to Date objects
      parsedExpiry = Object.entries(rawExpiry).reduce((acc, [key, value]) => {
        acc[key] = value ? new Date(value as string) : null;
        return acc;
      }, {} as Record<string, Date | null>);
    }

    if (savedRecords) {
      parsedRecords = JSON.parse(savedRecords);
      setRecords(parsedRecords);
    }

    // Check for expired consents after loading data
    if (savedConsent && savedExpiry) {
      const { updatedConsent, updatedExpiry, hasExpiredConsents, newRecords } = checkAndHandleExpiredConsents(
        parsedConsent,
        parsedExpiry,
        parsedRecords
      );
      
      setConsent(updatedConsent);
      setConsentExpiry(updatedExpiry);
      setRecords(newRecords);
      
      if (hasExpiredConsents) {
        // Update localStorage if consents were automatically disabled
        localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(updatedConsent));
        localStorage.setItem(CONSENT_STORAGE_KEY + '_expiry', JSON.stringify(updatedExpiry));
        localStorage.setItem(CONSENT_RECORDS_KEY, JSON.stringify(newRecords));
        // Show banner to allow user to renew
        setShowBanner(true);
      } else {
        setShowBanner(false);
      }
    } else {
      setConsent(parsedConsent);
      setConsentExpiry(parsedExpiry);
      if (savedConsent) {
        setShowBanner(false);
      }
    }
  }, []);

  // Set up interval to check for expired consents periodically
  useEffect(() => {
    const checkInterval = setInterval(() => {
      const { updatedConsent, updatedExpiry, hasExpiredConsents, newRecords } = checkAndHandleExpiredConsents(
        consent,
        consentExpiry,
        records
      );
      
      if (hasExpiredConsents) {
        setConsent(updatedConsent);
        setConsentExpiry(updatedExpiry);
        setRecords(newRecords);
        localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(updatedConsent));
        localStorage.setItem(CONSENT_STORAGE_KEY + '_expiry', JSON.stringify(updatedExpiry));
        localStorage.setItem(CONSENT_RECORDS_KEY, JSON.stringify(newRecords));
      }
    }, 60000); // Check every minute

    return () => clearInterval(checkInterval);
  }, [consent, consentExpiry, records]);

  // Función para enviar datos al web service
  const submitToWebService = async (
    record: ConsentRecord, 
    source: 'user_action' | 'auto_expired' = 'user_action'
  ) => {
    setIsSubmitting(true);
    setLastSubmissionError(null);

    try {
      //const clientIP = await consentService.getClientIP();
      const clientIP = '127.0.0.1';

      const submission: ConsentSubmission = {
        userId: record.userId,
        timestamp: record.timestamp,
        consents: record.consents,
        consentExpiry: record.consentExpiry,
        ipAddress: clientIP,
        userAgent: record.userAgent,
        source,
      };

      const response = await consentService.saveUserConsents(submission);
      
      if (!response.success) {
        setLastSubmissionError(response.error || 'Error al enviar consentimiento');
        console.error('Failed to submit consent:', response.error);
      } else {
        console.log('Consent submitted successfully:', response.recordId);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setLastSubmissionError(errorMessage);
      console.error('Error submitting consent to web service:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const saveConsent = async (newConsent: Record<string, boolean>, newExpiry?: Record<string, Date | null>) => {
    setConsent(newConsent);
    if (newExpiry) {
      setConsentExpiry(newExpiry);
    }
    setShowBanner(false);
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(newConsent));
    if (newExpiry) {
      localStorage.setItem(CONSENT_STORAGE_KEY + '_expiry', JSON.stringify(newExpiry));
    }

    // Create audit record
    const record: ConsentRecord = {
      id: `record_${Date.now()}`,
      userId: `user_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      consents: newConsent,
      consentExpiry: newExpiry || consentExpiry,
      ipAddress: '192.168.1.1', // In production, get from server
      userAgent: navigator.userAgent,
    };

    const updatedRecords = [record, ...records].slice(0, 100); // Keep last 100 records
    setRecords(updatedRecords);
    localStorage.setItem(CONSENT_RECORDS_KEY, JSON.stringify(updatedRecords));

    // Enviar al web service
    await submitToWebService(record, 'user_action');
  };

  const resetConsent = () => {
    setConsent({});
    setConsentExpiry({});
    setShowBanner(true);
    localStorage.removeItem(CONSENT_STORAGE_KEY);
    localStorage.removeItem(CONSENT_STORAGE_KEY + '_expiry');
  };

  const deleteUserData = (userId: string) => {
    const filteredRecords = records.filter(record => record.userId !== userId);
    setRecords(filteredRecords);
    localStorage.setItem(CONSENT_RECORDS_KEY, JSON.stringify(filteredRecords));

    // Enviar solicitud de eliminación al web service
    consentService.deleteUserConsent(userId).then(response => {
      if (!response.success) {
        console.error('Failed to delete user data from web service:', response.error);
      }
    });
  };

  const acceptAll = (categories: ConsentCategory[]) => {
    const allConsent = categories.reduce((acc, category) => {
      acc[category.id] = true;
      return acc;
    }, {} as Record<string, boolean>);
    
    // Set default expiry to 1 year from now for all categories
    const defaultExpiry = categories.reduce((acc, category) => {
      const expiryDate = new Date();
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
      acc[category.id] = expiryDate;
      return acc;
    }, {} as Record<string, Date | null>);
    
    saveConsent(allConsent, defaultExpiry);
  };

  const rejectAll = (categories: ConsentCategory[]) => {
    const requiredOnly = categories.reduce((acc, category) => {
      acc[category.id] = category.required;
      return acc;
    }, {} as Record<string, boolean>);
    
    // Set expiry only for required categories
    const requiredExpiry = categories.reduce((acc, category) => {
      if (category.required) {
        const expiryDate = new Date();
        expiryDate.setFullYear(expiryDate.getFullYear() + 1);
        acc[category.id] = expiryDate;
      } else {
        acc[category.id] = null;
      }
      return acc;
    }, {} as Record<string, Date | null>);
    
    saveConsent(requiredOnly, requiredExpiry);
  };

  return {
    consent,
    consentExpiry,
    showBanner,
    records,
    isSubmitting,
    lastSubmissionError,
    saveConsent,
    resetConsent,
    deleteUserData,
    acceptAll,
    rejectAll,
    clearSubmissionError: () => setLastSubmissionError(null),
  };
};