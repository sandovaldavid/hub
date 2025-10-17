import { profile } from './profile';
import { socialLinks } from './social-links';

export const ctaButtons = [
	{
		id: 'business',
		icon: 'rocket',
		title: '¿Necesitas una Solución para tu Negocio?',
		description: 'Desarrolla tu proyecto web profesional',
		href: `https://calendly.com/devsandoval/30min`,
		variant: 'primary' as const,
		external: false,
	},
	{
		id: 'learning',
		icon: 'chat',
		title: 'Aprende y Crece como Developer',
		description: 'Consejos y recursos para developers',
		href: socialLinks[3].url,
		variant: 'secondary' as const,
		external: true,
	},
];
