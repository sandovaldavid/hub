import type { SocialLink, SocialLinkPriority } from '../../../entities/social-link';

export interface SocialGridProps {
	links: SocialLink[];
	priorities?: SocialLinkPriority[];
	variant?: 'default' | 'compact';
}
