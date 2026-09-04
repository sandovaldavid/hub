import { siteConfig } from './site.config';
import type { CtaDefinition } from '@shared/model/cta';
import type { Lang } from '@shared/i18n';

export const getCtaButtons = (lang: Lang): CtaDefinition[] => [
	{
		id: 'resume',
		icon: 'briefcase',
		href: siteConfig.resume[lang],
		variant: 'secondary',
		external: true,
		conversionEvent: 'resume_downloaded',
	},
];
