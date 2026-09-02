import { describe, expect, test } from 'bun:test';
import {
	getPrimarySocialLinks,
	getRequiredSocialLink,
	getSocialLinksByPriority,
	socialLinks,
} from '../../src/data/social-links';

describe('social link configuration', () => {
	test('resolves a link by id regardless of array position', () => {
		const youtube = getRequiredSocialLink('youtube');

		expect(youtube.id).toBe('youtube');
		expect(youtube.url).toContain('youtube.com');
		expect(socialLinks.indexOf(youtube)).toBeGreaterThanOrEqual(0);
	});

	test('throws a clear error when a required link is missing', () => {
		expect(() => getRequiredSocialLink('missing-link')).toThrow(
			'Required social link "missing-link" is not configured.'
		);
	});

	test('keeps the primary category focused and ordered', () => {
		const primary = getPrimarySocialLinks();

		expect(primary.map(link => link.id)).toEqual(['website', 'linkedin', 'github']);
		expect(primary.length).toBeLessThanOrEqual(5);
	});

	test('keeps profile labels aligned with their public profile slugs', () => {
		for (const id of ['linkedin', 'twitter', 'youtube', 'tiktok']) {
			const link = getRequiredSocialLink(id);
			const slug = new URL(link.url).pathname.split('/').filter(Boolean).at(-1);
			const normalizedSlug = slug?.startsWith('@') ? slug : `@${slug}`;

			expect(link.username).toBe(normalizedSlug);
		}
	});

	test('publishes the approved professional social panel and keeps pending channels out', () => {
		expect(getSocialLinksByPriority('secondary').map(link => link.id)).toEqual([
			'twitter',
			'youtube',
			'tiktok',
		]);
		expect(getSocialLinksByPriority('footer').map(link => link.id)).toEqual([]);
		expect(socialLinks.some(link => ['instagram', 'facebook'].includes(link.id))).toBe(false);
	});

	test('uses the migrated X handle and professional creator handles', () => {
		expect(getRequiredSocialLink('twitter')).toMatchObject({
		url: 'https://x.com/davidsandoval_s',
		username: '@davidsandoval_s',
	});
	for (const id of ['youtube', 'tiktok']) {
		expect(getRequiredSocialLink(id).username).toBe('@davidsandoval.s');
	}
	});

	test('defines audience and analytics metadata for every link', () => {
		for (const link of socialLinks) {
			expect(link.audience.length).toBeGreaterThan(0);
			expect(link.analyticsId).toMatch(/^social_/);
		}
	});
});
