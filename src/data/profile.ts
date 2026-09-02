import type { Profile } from '@entities/profile/model/types';
import { siteConfig } from './site.config';

// tagline, bio and the route-specific avatar label are intentionally absent here.
// Locale-specific strings are applied via useTranslations() from @shared/i18n.
export const profile: Profile = {
	name: siteConfig.name,
	avatar: {
		url: '/profile/perfil.webp',
		alt: siteConfig.name,
	},
	logo: {
		url: '/logo/logo-v2-micro-dark-24.svg',
	},
	contact: {
		email: siteConfig.email,
	},
};
