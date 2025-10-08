import type { SocialLink } from '../../../entities/social-link';

export interface SocialGridProps {
  links: SocialLink[];
  showOnlyPrimary?: boolean;
  variant?: 'default' | 'compact';
}
