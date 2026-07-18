import { describe, expect, test } from 'bun:test';
import { getRequiredSocialLink, socialLinks } from '../../src/data/social-links';

describe('getRequiredSocialLink', () => {
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
});
