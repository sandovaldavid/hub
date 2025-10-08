/**
 * Profile Entity - FSD Layer: entities/profile
 * Personal profile information and branding
 */

export interface Profile {
  name: string;
  displayName: string;
  tagline: string;
  bio: string;
  location: string;
  timezone: string;
  languages: string[];
  avatar: {
    url: string;
    alt: string;
  };
  logo: {
    url: string;
    alt: string;
  };
  contact: {
    email: string;
    phone?: string;
    whatsapp?: string;
  };
  availability: {
    status: 'available' | 'busy' | 'unavailable';
    message?: string;
  };
}
