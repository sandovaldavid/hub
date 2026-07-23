import type { Lang } from '@shared/i18n';
import { siteConfig } from './site.config';

export const getCtaButtons = (lang: Lang) => [
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
		id: 'resume',
		icon: 'file',
		title: 'Download Resume',
		description: 'Review my current experience, impact and technical background.',
		href: siteConfig.resume[lang],
		variant: 'primary' as const,
		external: true,
	},
	{
		id: 'github',
		icon: 'briefcase',
		title: 'View GitHub',
		description: 'Inspect the repositories, architecture decisions and products I am building.',
		href: siteConfig.githubUrl,
		variant: 'secondary' as const,
		external: true,
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
