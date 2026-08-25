import type { CtaDefinition } from '@shared/model/cta';
import { siteConfig } from './site.config';

export const getCtaButtons = (contactSubject: string): CtaDefinition[] => [
	{
		id: 'portfolio',
		icon: 'briefcase',
		href: siteConfig.portfolioUrl,
		variant: 'primary',
		external: true,
		conversionEvent: 'portfolio_opened',
	},
	{
		id: 'projects',
		icon: 'rocket',
		href: '#featured-projects-title',
		variant: 'primary',
		external: false,
		conversionEvent: 'featured_projects_viewed',
	},
	{
		id: 'github',
		icon: 'github',
		href: siteConfig.githubUrl,
		variant: 'secondary',
		external: true,
		conversionEvent: 'github_opened',
	},
	{
		id: 'contact',
		icon: 'email',
		href: `mailto:${siteConfig.email}?subject=${encodeURIComponent(contactSubject)}`,
		variant: 'secondary',
		external: false,
		conversionEvent: 'contact_clicked',
	},
];
