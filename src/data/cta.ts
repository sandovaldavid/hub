import { socialLinks } from './social-links';
import { siteConfig } from './site.config';

export const ctaButtons = [
	{
		id: 'business',
		icon: 'rocket',
		title: '¿Quieres digitalizar tu negocio sin estrés?',
		description:
			'Agenda una "Llamada de Descubrimiento" gratis. Entenderé tus metas y te daré un plan de acción claro, sin tecnicismos.',
		href: siteConfig.calendlyUrl,
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
