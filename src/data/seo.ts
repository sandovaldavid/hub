import type { SEOProps } from '@app/models/seo.model';
import { profile } from './profile';

export const SEO: SEOProps = {
	// Primary Meta Tags
	title: `${profile.displayName} | ${profile.tagline}`,
	description: profile.bio,
	author: profile.name,
	applicationName: 'DevSandoval - Hub Digital',
	appleMobileWebAppTitle: 'DevSandoval',

	//  Theme & Branding
	themeColor: '#3C81F1',

	//  Open Graph (Facebook, LinkedIn, Discord, etc.)
	ogType: 'website',
	ogImage: '/og/og-image.png',
	ogImageAlt: 'DevSandoval - Desarrollador Web creando soluciones con IA Práctica.',
	ogImageSecureUrl: 'https://devsandoval.me/og-image.',
	ogImageType: 'image/png',
	ogSiteName: 'DevSandoval - Hub Digital',
	fbAppId: '653751241146050',
	ogLocale: 'es_PE',

	//  Twitter Card
	twitterCard: 'summary_large_image',
	twitterSite: '@dev_sandoval',
	twitterCreator: '@dev_sandoval',
	twitterImageAlt:
		'DevSandoval - Desarrollador Web especializado en React, Next.js, Python, Astro y tecnologías de IA.',
	twitterLabel1: 'Especialidad',
	twitterData1: 'Soluciones Web con IA Práctica',

	//  SEO & Indexing
	robots: 'index, follow',
	googlebot: 'index, follow',

	//  Keywords
	keywords: [
		'DevSandoval',
		'David Sandoval Salvador',
		'Desarrollador Web',
		'Desarrollador de Software',
		'Inteligencia Artificial',
		'IA Práctica',
		'Machine Learning',
		'React',
		'Next.js',
		'Python',
		'Astro',
		'TypeScript',
		'Node.js',
		'Tailwind CSS',
		'Aplicaciones Web para Pymes',
		'Soluciones Digitales',
		'Automatización de Negocios',
		'Perú',
		'Piura',
	],

	//  Language
	lang: 'es',
};
