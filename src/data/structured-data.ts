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
}

const schemaLanguageByLocale = {
	en: 'en-US',
	es: 'es-PE',
} as const;

export function getProfilePageStructuredData({
	title,
	description,
	lang,
	canonicalUrl,
	imageUrl,
	imageAlt,
}: ProfilePageStructuredDataInput) {
	const pageId = `${canonicalUrl}#profile-page`;
	const personId = new URL('#person', siteConfig.portfolioUrl).href;
	const imageId = `${canonicalUrl}#primary-image`;

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
				image: { '@id': imageId },
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
		],
	};
}
