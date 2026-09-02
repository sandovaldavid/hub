import { describe, expect, test } from 'bun:test';
import {
	getPrimarySocialLinks,
	getRequiredSocialLink,
	getSocialLinksByPriority,
	socialLinks,
} from '../../src/data/social-links';

describe('social link configuration', () => {
	test('resolves a link by id regardless of array position', () => {
		const instagram = getRequiredSocialLink('instagram');

		expect(instagram.id).toBe('instagram');
		expect(instagram.url).toContain('instagram.com');
		expect(socialLinks.indexOf(instagram)).toBeGreaterThanOrEqual(0);
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

	test('keeps the LinkedIn label aligned with its public profile slug', () => {
		const linkedin = getRequiredSocialLink('linkedin');
		const slug = new URL(linkedin.url).pathname.split('/').filter(Boolean).at(-1);

		expect(linkedin.username).toBe(`@${slug}`);
	});

	test('keeps only currently approved community networks outside the primary tier', () => {
		expect(getSocialLinksByPriority('secondary').map(link => link.id)).toEqual([]);
		expect(getSocialLinksByPriority('footer').map(link => link.id)).toEqual(['instagram']);
		expect(
			socialLinks.some(link => ['twitter', 'youtube', 'tiktok', 'facebook'].includes(link.id))
		).toBe(false);
	});

	test('defines audience and analytics metadata for every link', () => {
		for (const link of socialLinks) {
			expect(link.audience.length).toBeGreaterThan(0);
			expect(link.analyticsId).toMatch(/^social_/);
		}
	});
});
