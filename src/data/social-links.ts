import type { SocialLink, SocialLinkPriority } from '@entities/social-link/model/types';
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
		conversionEvent: 'portfolio_opened',
	},
	{
		id: 'linkedin',
		platform: 'linkedin',
		label: 'LinkedIn',
		url: siteConfig.socialUrls.linkedin,
		username: siteConfig.socialUsernames.linkedin,
		priority: 'primary',
		audience: ['recruiter', 'client'],
		analyticsId: 'social_linkedin_opened',
		conversionEvent: 'linkedin_opened',
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
		conversionEvent: 'github_opened',
	},
	{
		id: 'youtube',
		platform: 'youtube',
		label: 'YouTube',
		url: siteConfig.socialUrls.youtube,
		username: siteConfig.socialUsernames.youtube,
		priority: 'secondary',
		audience: ['community'],
		analyticsId: 'social_youtube_opened',
	},
	{
		id: 'tiktok',
		platform: 'tiktok',
		label: 'TikTok',
		url: siteConfig.socialUrls.tiktok,
		username: siteConfig.socialUsernames.tiktok,
		priority: 'secondary',
		audience: ['community'],
		analyticsId: 'social_tiktok_opened',
	},
	{
		id: 'instagram',
		platform: 'instagram',
		label: 'Instagram',
		url: siteConfig.socialUrls.instagram,
		username: siteConfig.socialUsernames.instagram,
		priority: 'secondary',
		audience: ['community'],
		analyticsId: 'social_instagram_opened',
	},
	{
		id: 'twitter',
		platform: 'twitter',
		label: 'X',
		url: siteConfig.socialUrls.twitter,
		username: siteConfig.socialUsernames.twitter,
		priority: 'secondary',
		audience: ['community'],
		analyticsId: 'social_x_opened',
	},
];

export const getRequiredSocialLink = (id: SocialLink['id']): SocialLink => {
	const link = socialLinks.find(item => item.id === id);
	if (!link) throw new Error(`Required social link "${id}" is not configured.`);
	return link;
};

export const getSocialLinksByPriority = (priority: SocialLinkPriority) =>
	socialLinks.filter(link => link.priority === priority);

export const getPrimarySocialLinks = () => getSocialLinksByPriority('primary');
