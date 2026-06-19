export const siteConfig = {
	// Brand identity — single source of truth for handle/name used across all data files
	handle: 'sandovaldavid',
	name: 'sandovaldavid - Hub Digital',
	shortName: 'sandovaldavid',
	email: 'contact@sandovaldavid.com',
	twitterHandle: '@sandovaldavid',

	url: 'https://linktree.sandovaldavid.com',
	themeColor: '#3C81F1',
	calendlyUrl: 'https://calendly.com/sandovaldavid/30min',
	// PUBLIC_ vars are embedded in the build (visible in HTML — not a secret)
	fbAppId: import.meta.env.PUBLIC_FB_APP_ID ?? '',
	defaultLocale: 'en' as const,
	locales: ['en', 'es'] as const,
} as const;
