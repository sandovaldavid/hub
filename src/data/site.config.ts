export const siteConfig = {
	// Brand identity — single source of truth for handle/name used across all data files
	handle: 'sandovaldavid',
	name: 'David Sandoval - Software Engineer',
	shortName: 'sandovaldavid',
	email: 'contact@sandovaldavid.com',
	recruiterEmailSubject: 'Software engineering opportunity',
	twitterHandle: '@sandovaldavid',

	url: 'https://linktree.sandovaldavid.com',
	portfolioUrl: 'https://sandovaldavid.com',
	githubUrl: 'https://github.com/sandovaldavid',
	socialUrls: {
		linkedin: 'https://www.linkedin.com/in/jdavidsandovals',
		youtube: 'https://youtube.com/@sandovaldavid',
		twitter: 'https://twitter.com/sandovaldavid',
		instagram: 'https://instagram.com/sandovaldavid',
		tiktok: 'https://tiktok.com/@sandovaldavid',
		facebook: 'https://facebook.com/sandovaldavid',
	},
	resume: {
		en: 'https://sandovaldavid.com/resume/david-sandoval-resume.pdf',
		es: 'https://sandovaldavid.com/resume/david-sandoval-resume-es.pdf',
	},
	themeColor: '#3C81F1',
	// PUBLIC_ vars are embedded in the build (visible in HTML — not a secret)
	fbAppId: import.meta.env.PUBLIC_FB_APP_ID ?? '',
	defaultLocale: 'en' as const,
	locales: ['en', 'es'] as const,
} as const;
