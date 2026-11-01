import { describe, expect, test } from 'bun:test';
import { normalizeSource } from '@shared/analytics/conversion.ts';

const currentHost = 'hub.sandovaldavid.com';

describe('referrer source classification', () => {
	test('uses exact and dot-boundary host matching', () => {
		expect(normalizeSource('https://www.google.com/search?q=hub', currentHost)).toBe('search');
		expect(normalizeSource('https://www.google.co.uk/', currentHost)).toBe('search');
		expect(normalizeSource('https://www.google.com.pe/', currentHost)).toBe('search');
		expect(normalizeSource('https://yahoo.es/', currentHost)).toBe('search');
		expect(normalizeSource('https://notgoogle.com/', currentHost)).toBe('referral');
		expect(normalizeSource('https://google.evil.com/', currentHost)).toBe('referral');
		expect(normalizeSource('https://google.com.evil.com/', currentHost)).toBe('referral');

		expect(normalizeSource('https://www.linkedin.com/in/jdsandovals', currentHost)).toBe('social');
		expect(normalizeSource('https://x.com/davidsandoval_s', currentHost)).toBe('social');
		expect(normalizeSource('https://netflix.com/', currentHost)).toBe('referral');
		expect(normalizeSource('https://notx.com/', currentHost)).toBe('referral');
		expect(normalizeSource('https://linkedin.evil.com/', currentHost)).toBe('referral');
	});

	test('keeps direct, internal and malformed referrers separate', () => {
		expect(normalizeSource('', currentHost)).toBe('direct');
		expect(normalizeSource('https://hub.sandovaldavid.com/es/', currentHost)).toBe('internal');
		expect(normalizeSource('https://hub.sandovaldavid.com./es/', currentHost)).toBe('internal');
		expect(normalizeSource('not a url', currentHost)).toBe('direct');
	});
});
