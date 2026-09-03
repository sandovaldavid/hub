import { siteConfig } from './site.config';
import type { CtaDefinition } from '@shared/model/cta';
import type { Lang } from '@shared/i18n';

export const getCtaButtons = (lang: Lang): CtaDefinition[] => [
	{
		id: 'portfolio',
		icon: 'portfolio',
		href: siteConfig.portfolioUrl,
		variant: 'primary',
		external: true,
		conversionEvent: 'portfolio_opened',
	},
	{
		id: 'resume',
		icon: 'briefcase',
		href: siteConfig.resume[lang],
		variant: 'secondary',
		external: true,
		conversionEvent: 'resume_downloaded',
	},
];
