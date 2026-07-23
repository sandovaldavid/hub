import type { SocialLink, SocialLinkPriority } from '@entities/social-link';
import { siteConfig } from './site.config';

const h = siteConfig.handle;

export const socialLinks: SocialLink[] = [
	{
		id: 'website',
		platform: 'website',
		label: 'Portfolio',
		url: siteConfig.portfolioUrl,
		username: `${h}.com`,
		priority: 'primary',
		audience: ['recruiter', 'client'],
		analyticsId: 'social_portfolio_opened',
		classBrand: 'social-button--website',
		classIcon: 'social-button__icon--website',
	},
	{
		id: 'linkedin',
		platform: 'linkedin',
		label: 'LinkedIn',
		url: 'https://www.linkedin.com/in/jdavidsandoval',
		username: '@jdavidsandoval',
		priority: 'primary',
		audience: ['recruiter', 'client'],
		analyticsId: 'social_linkedin_opened',
		classBrand: 'social-button--linkedin',
		classIcon: 'social-button__icon--linkedin',
	},
	{
		id: 'github',
		platform: 'github',
		label: 'GitHub',
		url: siteConfig.githubUrl,
		username: `@${h}`,
		priority: 'primary',
		audience: ['recruiter', 'community'],
		analyticsId: 'social_github_opened',
		classBrand: 'social-button--github',
		classIcon: 'social-button__icon--github',
	},
	{
		id: 'youtube',
		platform: 'youtube',
		label: 'YouTube',
		url: `https://youtube.com/@${h}`,
		username: `@${h}`,
		priority: 'secondary',
		audience: ['community'],
		analyticsId: 'social_youtube_opened',
		classBrand: 'social-button--youtube',
		classIcon: 'social-button__icon--youtube',
	},
	{
		id: 'twitter',
		platform: 'twitter',
		label: 'X / Twitter',
		url: `https://twitter.com/${h}`,
		username: `@${h}`,
		priority: 'secondary',
		audience: ['community'],
		analyticsId: 'social_x_opened',
		classBrand: 'social-button--x',
		classIcon: 'social-button__icon--x',
	},
	{
		id: 'instagram',
		platform: 'instagram',
		label: 'Instagram',
		url: `https://instagram.com/${h}`,
		username: `@${h}`,
		priority: 'footer',
		audience: ['community'],
		analyticsId: 'social_instagram_opened',
		classBrand: 'social-button--instagram',
		classIcon: 'social-button__icon--instagram',
	},
	{
		id: 'tiktok',
		platform: 'tiktok',
		label: 'TikTok',
		url: `https://tiktok.com/@${h}`,
		username: `@${h}`,
		priority: 'footer',
		audience: ['community'],
		analyticsId: 'social_tiktok_opened',
		classBrand: 'social-button--tiktok',
		classIcon: 'social-button__icon--tiktok',
	},
	{
		id: 'facebook',
		platform: 'facebook',
		label: 'Facebook',
		url: `https://facebook.com/${h}`,
		username: `@${h}`,
		priority: 'footer',
		audience: ['community'],
		analyticsId: 'social_facebook_opened',
		classBrand: 'social-button--facebook',
		classIcon: 'social-button__icon--facebook',
	},
];

export const getRequiredSocialLink = (id: SocialLink['id']): SocialLink => {
	const link = socialLinks.find(item => item.id === id);

	if (!link) {
		throw new Error(`Required social link "${id}" is not configured.`);
	}

	return link;
};

export const getSocialLinksByPriority = (priority: SocialLinkPriority) =>
	socialLinks.filter(link => link.priority === priority);

export const getPrimarySocialLinks = () => getSocialLinksByPriority('primary');
