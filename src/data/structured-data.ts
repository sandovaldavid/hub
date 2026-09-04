import { profile } from './profile';
import { siteConfig } from './site.config';
import type { Lang } from '@shared/i18n';

interface ProfilePageStructuredDataInput {
	title: string;
	description: string;
	lang: Lang;
	canonicalUrl: string;
	imageUrl: string;
	imageAlt: string;
	portraitAlt: string;
}

const schemaLanguageByLocale = {
	en: 'en-US',
	es: 'es-PE',
} as const;

const PORTRAIT_IMAGE_DIMENSIONS = { width: 1254, height: 1254 } as const;

export function getProfilePageStructuredData({
	title,
	description,
	lang,
	canonicalUrl,
	imageUrl,
	imageAlt,
	portraitAlt,
}: ProfilePageStructuredDataInput) {
	const pageId = `${canonicalUrl}#profile-page`;
	const personId = new URL('#person', siteConfig.portfolioUrl).href;
	const imageId = `${canonicalUrl}#primary-image`;
	const portraitImageId = `${canonicalUrl}#person-image`;
	const portraitUrl = new URL(profile.avatar.url, siteConfig.url).href;

	return {
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'ProfilePage',
				'@id': pageId,
				url: canonicalUrl,
				name: title,
				description,
				inLanguage: schemaLanguageByLocale[lang],
				mainEntity: { '@id': personId },
				primaryImageOfPage: { '@id': imageId },
			},
			{
				'@type': 'Person',
				'@id': personId,
				name: profile.name,
				url: siteConfig.portfolioUrl,
				mainEntityOfPage: { '@id': pageId },
				image: { '@id': portraitImageId },
				email: `mailto:${siteConfig.email}`,
				jobTitle: 'Software Engineer',
				knowsLanguage: [
					{ '@type': 'Language', name: 'English', alternateName: 'en' },
					{ '@type': 'Language', name: 'Spanish', alternateName: 'es' },
				],
				sameAs: [...siteConfig.sameAs],
			},
			{
				'@type': 'ImageObject',
				'@id': imageId,
				url: imageUrl,
				contentUrl: imageUrl,
				caption: imageAlt,
				width: siteConfig.socialPreview.width,
				height: siteConfig.socialPreview.height,
			},
			{
				'@type': 'ImageObject',
				'@id': portraitImageId,
				url: portraitUrl,
				contentUrl: portraitUrl,
				caption: portraitAlt,
				width: PORTRAIT_IMAGE_DIMENSIONS.width,
				height: PORTRAIT_IMAGE_DIMENSIONS.height,
			},
		],
	};
}
