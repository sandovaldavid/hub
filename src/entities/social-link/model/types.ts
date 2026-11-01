import type { ConversionEvent } from '@shared/analytics/conversion';

export type SocialPlatform =
	'github' | 'linkedin' | 'twitter' | 'instagram' | 'youtube' | 'tiktok' | 'website';
export type SocialLinkPriority = 'primary' | 'secondary';

export interface SocialLink {
	id: string;
	platform: SocialPlatform;
	label: string;
	url: string;
	username: string;
	priority: SocialLinkPriority;
	analyticsId: string;
	conversionEvent?: ConversionEvent;
}
