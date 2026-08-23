import type { Profile } from '@entities/profile/model/types';
import { siteConfig } from './site.config';

// tagline, bio and the route-specific avatar label are intentionally absent here.
// Locale-specific strings are applied via useTranslations() from @shared/i18n.
export const profile: Profile = {
	name: 'David Sandoval',
	displayName: siteConfig.handle,
	location: 'Peru',
	timezone: 'America/Lima',
	languages: ['Español', 'English'],
	avatar: {
		url: '/profile/perfil.webp',
		alt: 'David Sandoval',
	},
	logo: {
		url: `/logo/${siteConfig.handle}.svg`,
		alt: `${siteConfig.handle} brand logo`,
	},
	contact: {
		email: siteConfig.email,
	},
};
