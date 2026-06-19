import type { SEOProps } from '@app/models/seo.model';
import { profile } from './profile';
import { siteConfig } from './site.config';
import type { Lang } from '@shared/i18n';
import en from '../shared/i18n/locales/en.json';
import es from '../shared/i18n/locales/es.json';

const seoLocales = { en, es };

export function getSEO(lang: Lang = 'en'): SEOProps {
	const t = seoLocales[lang].seo;

	return {
		// Primary Meta Tags
		title: t.title,
		description: t.description,
		author: profile.name,
		applicationName: siteConfig.name,
		appleMobileWebAppTitle: siteConfig.shortName,

		// Theme & Branding
		themeColor: siteConfig.themeColor,

		// Open Graph
		ogType: 'website',
		ogImage: '/og/og-image.png',
		ogImageAlt: t.ogImageAlt,
		ogImageSecureUrl: `${siteConfig.url}/og/og-image.png`,
		ogImageType: 'image/png',
		ogSiteName: siteConfig.name,
		fbAppId: siteConfig.fbAppId,
		ogLocale: t.ogLocale,

		// Twitter Card
		twitterCard: 'summary_large_image',
		twitterSite: '@dev_sandoval',
		twitterCreator: '@dev_sandoval',
		twitterImageAlt: t.twitterImageAlt,
		twitterLabel1: t.twitterLabel1,
		twitterData1: t.twitterData1,

		// SEO & Indexing
		robots: 'index, follow',
		googlebot: 'index, follow',

		// Keywords
		keywords: t.keywords as string[],

		// Language
		lang,
	};
}

// Keep a static export for backward compatibility — defaults to English
export const SEO = getSEO('en');
