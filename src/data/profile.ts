import type { Profile } from '@entities/profile';

export const profile: Profile = {
	name: 'David Sandoval Salvador',
	displayName: 'DevSandoval',
	tagline: 'Construyo soluciones, comparto el proceso',
	bio: 'Desarrollador Web creando apps escalables e inteligentes. Apasionado por compartir conocimiento y construir en público.',
	location: 'Perú',
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
		message: 'Disponible para nuevos proyectos y colaboraciones.',
	},
};
