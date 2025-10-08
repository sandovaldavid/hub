import type { Profile } from '../../../entities/profile';

export interface HeroCardProps {
  profile: Profile;
  variant?: 'default' | 'compact';
}
