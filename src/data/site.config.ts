export const siteConfig = {
	url: 'https://linktree.sandovaldavid.com',
	name: 'DevSandoval - Hub Digital',
	shortName: 'DevSandoval',
	themeColor: '#3C81F1',
	calendlyUrl: 'https://calendly.com/devsandoval/30min',
	// PUBLIC_ vars are embedded in the build (visible in HTML — not a secret)
	fbAppId: import.meta.env.PUBLIC_FB_APP_ID ?? '',
	defaultLocale: 'en' as const,
	locales: ['en', 'es'] as const,
} as const;
