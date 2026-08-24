import packageJson from '../../package.json';

const portfolioUrl = 'https://sandovaldavid.com';
const githubUrl = 'https://github.com/sandovaldavid';
const socialUrls = {
	linkedin: 'https://www.linkedin.com/in/jdsandovals',
	twitter: 'https://x.com/jdsandoval_',
	instagram: 'https://www.instagram.com/jdsandovals',
} as const;

export const siteConfig = {
	// Public identity registry — approved values shared by SEO, content and contact surfaces.
	handle: 'sandovaldavid',
	name: 'David Sandoval',
	shortName: 'David Sandoval',
	email: 'hello@sandovaldavid.com',
	recruiterEmailSubject: 'Software engineering opportunity',
	twitterHandle: '@jdsandoval_',

	url: 'https://hub.sandovaldavid.com',
	portfolioUrl,
	githubUrl,
	socialUrls: socialUrls,
	// `portfolioUrl` identifies David's canonical website; `sameAs` lists approved profiles.
	sameAs: [socialUrls.linkedin, githubUrl, socialUrls.twitter, socialUrls.instagram],
	resume: {
		en: 'https://sandovaldavid.com/resume/david-sandoval-resume.pdf',
		es: 'https://sandovaldavid.com/resume/david-sandoval-resume-es.pdf',
	},
	socialPreview: {
		path: '/og/og_dark.png',
		type: 'image/png',
		width: 1200,
		height: 630,
	},
	// Browser metadata uses the approved sRGB/HEX reference for color/primary/500-light.
	themeColor: '#0a5cd6',
	// Read from package.json so the footer stays current with every release-please bump.
	version: packageJson.version,
	// PUBLIC_ vars are embedded in the build (visible in HTML — not a secret)
	fbAppId: import.meta.env.PUBLIC_FB_APP_ID ?? '',
} as const;
