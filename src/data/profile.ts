import type { Profile } from '@entities/profile/model/types';
import { siteConfig } from './site.config';

// tagline, bio, availability.message are intentionally absent here.
// They are locale-specific strings — get them via useTranslations() from @shared/i18n.
export const profile: Profile = {
	name: 'David Sandoval Salvador',
	displayName: siteConfig.handle,
	location: 'Peru',
	timezone: 'America/Lima',
	languages: ['Español', 'English'],
	avatar: {
		url: '/profile/retrato-giblin.webp',
		alt: `${siteConfig.handle} profile photo`,
	},
	logo: {
		url: `/logo/${siteConfig.handle}.svg`,
		alt: `${siteConfig.handle} brand logo`,
	},
	contact: {
		email: siteConfig.email,
	},
	availability: {
		status: 'available',
	},
};
