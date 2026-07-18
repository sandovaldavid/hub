import type { SocialLink } from '@entities/social-link';
import { siteConfig } from './site.config';

const h = siteConfig.handle;

export const socialLinks: SocialLink[] = [
	{
		id: 'website',
		platform: 'website',
		label: 'Portfolio',
		url: `https://${h}.com`,
		username: `${h}.com`,
		isPrimary: true,
		classBrand: 'social-button--website',
		classIcon: 'social-button__icon--website',
	},
	{
		id: 'linkedin',
		platform: 'linkedin',
		label: 'LinkedIn',
		url: `https://linkedin.com/in/${h}`,
		username: `@${h}`,
		isPrimary: true,
		classBrand: 'social-button--linkedin',
		classIcon: 'social-button__icon--linkedin',
	},
	{
		id: 'github',
		platform: 'github',
		label: 'GitHub',
		url: `https://github.com/${h}`,
		username: `@${h}`,
		isPrimary: true,
		classBrand: 'social-button--github',
		classIcon: 'social-button__icon--github',
	},
	{
		id: 'instagram',
		platform: 'instagram',
		label: 'Instagram',
		url: `https://instagram.com/${h}`,
		username: `@${h}`,
		isPrimary: true,
		classBrand: 'social-button--instagram',
		classIcon: 'social-button__icon--instagram',
	},
	{
		id: 'twitter',
		platform: 'twitter',
		label: 'X / Twitter',
		url: `https://twitter.com/${h}`,
		username: `@${h}`,
		isPrimary: true,
		classBrand: 'social-button--x',
		classIcon: 'social-button__icon--x',
	},
	{
		id: 'youtube',
		platform: 'youtube',
		label: 'YouTube',
		url: `https://youtube.com/@${h}`,
		username: `@${h}`,
		isPrimary: true,
		classBrand: 'social-button--youtube',
		classIcon: 'social-button__icon--youtube',
	},
	{
		id: 'facebook',
		platform: 'facebook',
		label: 'Facebook',
		url: `https://facebook.com/${h}`,
		username: `@${h}`,
		isPrimary: true,
		classBrand: 'social-button--facebook',
		classIcon: 'social-button__icon--facebook',
	},
	{
		id: 'tiktok',
		platform: 'tiktok',
		label: 'TikTok',
		url: `https://tiktok.com/@${h}`,
		username: `@${h}`,
		isPrimary: true,
		classBrand: 'social-button--tiktok',
		classIcon: 'social-button__icon--tiktok',
	},
];

export const getRequiredSocialLink = (id: SocialLink['id']): SocialLink => {
	const link = socialLinks.find(item => item.id === id);

	if (!link) {
		throw new Error(`Required social link "${id}" is not configured.`);
	}

	return link;
};

export const getPrimarySocialLinks = () => socialLinks.filter(link => link.isPrimary);
