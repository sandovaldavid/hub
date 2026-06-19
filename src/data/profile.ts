import type { Profile } from '@entities/profile';

// tagline, bio, availability.message are intentionally absent here.
// They are locale-specific strings — get them via useTranslations() from @shared/i18n.
export const profile: Profile = {
	name: 'David Sandoval Salvador',
	displayName: 'DevSandoval',
	location: 'Peru',
	timezone: 'America/Lima',
	languages: ['Español', 'English'],
	avatar: {
		url: '/profile/retrato-giblin.webp',
		alt: 'DevSandoval profile photo',
	},
	logo: {
		url: '/logo/devsandoval.svg',
		alt: 'DevSandoval brand logo',
	},
	contact: {
		email: 'contact@devsandoval.com',
		whatsapp: '+51 901 148 564',
	},
	availability: {
		status: 'available',
	},
};
