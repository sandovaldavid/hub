import { describe, expect, test } from 'bun:test';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
	getPrimarySocialLinks,
	getRequiredSocialLink,
	getSocialLinksByPriority,
	socialLinks,
} from '../../src/data/social-links';

const repositoryRoot = join(dirname(fileURLToPath(import.meta.url)), '../..');

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
		for (const id of ['linkedin', 'twitter', 'instagram', 'youtube', 'tiktok']) {
			const link = getRequiredSocialLink(id);
			const slug = new URL(link.url).pathname.split('/').filter(Boolean).at(-1);
			const normalizedSlug = slug?.startsWith('@') ? slug : `@${slug}`;

			expect(link.username).toBe(normalizedSlug);
		}
	});

	test('publishes only approved secondary channels', () => {
		const secondary = getSocialLinksByPriority('secondary').map(link => link.id);

		expect(secondary).toEqual(['youtube', 'tiktok', 'instagram', 'twitter']);
		expect(getSocialLinksByPriority('footer')).toHaveLength(0);
		expect(socialLinks.some(link => link.id === 'facebook')).toBe(false);
	});

	test('uses the migrated X handle and approved creator handles', () => {
		expect(getRequiredSocialLink('twitter')).toMatchObject({
			url: 'https://x.com/davidsandoval_s',
			username: '@davidsandoval_s',
		});
		expect(getRequiredSocialLink('instagram')).toMatchObject({
			url: 'https://www.instagram.com/david.sandovals',
			username: '@david.sandovals',
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

	test('ensures every active social platform has a brand class and hover styles', async () => {
		const [gridSource, stylesSource] = await Promise.all([
			readFile(join(repositoryRoot, 'src/widgets/social-grid/ui/SocialGrid.astro'), 'utf8'),
			readFile(join(repositoryRoot, 'src/entities/social-link/ui/SocialButton.css'), 'utf8'),
		]);

		const activePlatforms = new Set(socialLinks.map(link => link.platform));
		for (const platform of activePlatforms) {
			expect(gridSource).toContain(`${platform}: { brand: 'social-button--`);
		}

		for (const platformClass of [
			'social-button--website',
			'social-button--linkedin',
			'social-button--github',
			'social-button--x',
			'social-button--instagram',
			'social-button--youtube',
			'social-button--tiktok',
		]) {
			expect(stylesSource).toContain(`.${platformClass}`);
			expect(stylesSource).toContain(`.${platformClass}:hover`);
		}
	});
});
