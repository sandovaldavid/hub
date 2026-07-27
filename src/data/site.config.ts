export const siteConfig = {
	// Public identity registry — approved values shared by SEO, content and contact surfaces.
	handle: 'sandovaldavid',
	name: 'David Sandoval - Software Engineer',
	shortName: 'sandovaldavid',
	email: 'hello@sandovaldavid.com',
	recruiterEmailSubject: 'Software engineering opportunity',
	twitterHandle: '@jdsandoval_',

	url: 'https://hub.sandovaldavid.com',
	portfolioUrl: 'https://sandovaldavid.com',
	githubUrl: 'https://github.com/sandovaldavid',
	socialUrls: {
		linkedin: 'https://www.linkedin.com/in/jdsandovals',
		twitter: 'https://x.com/jdsandoval_',
		instagram: 'https://www.instagram.com/jdsandovals',
	},
	resume: {
		en: 'https://sandovaldavid.com/resume/david-sandoval-resume.pdf',
		es: 'https://sandovaldavid.com/resume/david-sandoval-resume-es.pdf',
	},
	// Browser metadata uses the approved sRGB/HEX reference for color/primary/500-light.
	themeColor: '#0a5cd6',
	// PUBLIC_ vars are embedded in the build (visible in HTML — not a secret)
	fbAppId: import.meta.env.PUBLIC_FB_APP_ID ?? '',
	defaultLocale: 'en' as const,
	locales: ['en', 'es'] as const,
} as const;
