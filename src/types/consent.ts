export interface ConsentCategory {
  id: string;
  name: string;
  description: string;
  required: boolean;
  enabled: boolean;
  cookies: Cookie[];
}

export interface Cookie {
  id: string;
  name: string;
  domain: string;
  purpose: string;
  expiry: string;
  type: 'necessary' | 'analytics' | 'marketing' | 'preferences';
}

export interface ConsentRecord {
  id: string;
  userId: string;
  timestamp: Date;
  consents: Record<string, boolean>;
  consentExpiry: Record<string, Date | null>;
  ipAddress: string;
  userAgent: string;
}

export interface ConsentSettings {
  bannerTitle: string;
  bannerDescription: string;
  acceptAllText: string;
  rejectAllText: string;
  customizeText: string;
  privacyPolicyUrl: string;
  position: 'bottom' | 'top' | 'center';
  theme: 'light' | 'dark';
}