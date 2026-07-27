/**
 * SEO Model - Complete metadata for search engines and social media
 * Covers Open Graph, Twitter Cards, and standard meta tags
 */

export interface SEOProps {
	//  Primary Meta Tags
	/** Page title */
	title: string;

	/** Meta description */
	description: string;

	/** Content author name */
	author: string;

	/** Application name for PWA */
	applicationName?: string;

	/** Short title for Apple home screen */
	appleMobileWebAppTitle?: string;

	//  Theme & Branding
	/** Browser theme color (hex format: #RRGGBB) */
	themeColor: string;

	//  Open Graph (Facebook, LinkedIn, etc.)
	/** OG type: website, article, profile, etc. */
	ogType?: string;

	/** Main Open Graph image URL */
	ogImage: string;

	/** Alt text for OG image */
	ogImageAlt?: string;

	/** Secure HTTPS URL for OG image */
	ogImageSecureUrl?: string;

	/** OG image MIME type (image/png, image/jpeg, etc.) */
	ogImageType?: string;

	/** Intrinsic Open Graph image width in pixels */
	ogImageWidth?: number;

	/** Intrinsic Open Graph image height in pixels */
	ogImageHeight?: number;

	/** Site name for Open Graph */
	ogSiteName?: string;

	/** Facebook App ID for insights */
	fbAppId?: string;

	/** Locale for content (es_PE, en_US, etc.) */
	ogLocale?: string;

	//  Twitter Card
	/** Twitter card type: summary, summary_large_image, app, player */
	twitterCard?: string;

	/** Twitter username (@username) */
	twitterSite?: string;

	/** Twitter creator username */
	twitterCreator?: string;

	/** Alt text for Twitter image */
	twitterImageAlt?: string;

	/** Custom label for Twitter card CTA (shown in Slack) */
	twitterLabel1?: string;

	/** Custom data for Twitter card CTA (shown in Slack) */
	twitterData1?: string;

	//  SEO & Indexing
	/** Canonical URL - prevents duplicate content issues */
	canonicalUrl?: string;

	/** Robots directive: index/noindex, follow/nofollow */
	robots?: string;

	/** Specific directive for Googlebot */
	googlebot?: string;

	//  Keywords
	keywords?: string[];

	//  Language
	/** HTML lang attribute */
	lang?: 'en' | 'es';
}
