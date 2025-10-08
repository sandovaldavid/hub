/**
 * Social Link Entity - FSD Layer: entities/social-link
 * Social media platform links and profiles
 */

export type SocialPlatform = 
  | 'github' 
  | 'linkedin' 
  | 'twitter' 
  | 'instagram'
  | 'facebook'
  | 'youtube' 
  | 'tiktok'
  | 'website'
  | 'medium';


export interface SocialLink {
  id: string;
  platform: SocialPlatform;
  label: string;
  url: string;
  username: string;
  verified?: boolean;
  isPrimary: boolean;
  classBrand?: string;
  classIcon?: string;
}
