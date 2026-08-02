import { profile } from './profile';
import { siteConfig } from './site.config';
import type { Lang } from '@shared/i18n';
import en from '../shared/i18n/locales/en.json';
import es from '../shared/i18n/locales/es.json';

const seoLocales = { en, es };

export function getSEO(lang: Lang = 'en') {
	const t = seoLocales[lang].seo;
	const socialPreviewUrl = new URL(siteConfig.socialPreview.path, siteConfig.url).href;

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
		ogType: 'profile',
		ogImage: siteConfig.socialPreview.path,
		ogImageAlt: t.ogImageAlt,
		ogImageSecureUrl: socialPreviewUrl,
		ogImageType: siteConfig.socialPreview.type,
		ogImageWidth: siteConfig.socialPreview.width,
		ogImageHeight: siteConfig.socialPreview.height,
		ogSiteName: siteConfig.name,
		fbAppId: siteConfig.fbAppId,
		ogLocale: t.ogLocale,

		// Twitter Card
		twitterCard: 'summary_large_image',
		twitterSite: siteConfig.twitterHandle,
		twitterCreator: siteConfig.twitterHandle,
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

export type SEOProps = ReturnType<typeof getSEO>;
