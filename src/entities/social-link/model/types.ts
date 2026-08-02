/**
 * Social Link Entity - FSD Layer: entities/social-link
 * Social media platform links and profiles
 */

export type SocialPlatform = 'github' | 'linkedin' | 'twitter' | 'instagram' | 'website';

export type SocialLinkPriority = 'primary' | 'secondary' | 'footer';
export type SocialLinkAudience = 'recruiter' | 'client' | 'community';

export interface SocialLink {
	id: string;
	platform: SocialPlatform;
	label: string;
	url: string;
	username: string;
	priority: SocialLinkPriority;
	audience: SocialLinkAudience[];
	analyticsId: string;
	classBrand?: string;
	classIcon?: string;
}
