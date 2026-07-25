import type { Lang } from '@shared/i18n';
import { siteConfig } from './site.config';

export const getCtaButtons = (_lang: Lang) => [
	{
		id: 'portfolio',
		icon: 'briefcase',
		title: 'View Portfolio',
		description: 'Explore selected projects, experience and engineering case studies.',
		href: siteConfig.portfolioUrl,
		variant: 'primary' as const,
		external: true,
	},
	{
		id: 'projects',
		icon: 'rocket',
		title: 'View Featured Projects',
		description: 'Review selected engineering cases and outcomes on this page.',
		href: '#featured-projects-title',
		variant: 'primary' as const,
		external: false,
	},
	{
		id: 'contact',
		icon: 'email',
		title: 'Contact Me',
		description: 'Get in touch about software engineering opportunities and collaborations.',
		href: `mailto:${siteConfig.email}?subject=${encodeURIComponent(siteConfig.recruiterEmailSubject)}`,
		variant: 'secondary' as const,
		external: false,
	},
];
