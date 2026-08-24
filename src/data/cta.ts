import { siteConfig } from './site.config';

export const getCtaButtons = () => [
	{
		id: 'portfolio',
		icon: 'briefcase',
		href: siteConfig.portfolioUrl,
		variant: 'primary' as const,
		external: true,
	},
	{
		id: 'projects',
		icon: 'rocket',
		href: '#featured-projects-title',
		variant: 'primary' as const,
		external: false,
	},
	{
		id: 'github',
		icon: 'github',
		href: siteConfig.githubUrl,
		variant: 'secondary' as const,
		external: true,
	},
	{
		id: 'contact',
		icon: 'email',
		href: `mailto:${siteConfig.email}?subject=${encodeURIComponent(siteConfig.recruiterEmailSubject)}`,
		variant: 'secondary' as const,
		external: false,
	},
];
