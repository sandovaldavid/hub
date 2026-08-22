import { describe, expect, test } from 'bun:test';
import { URL } from 'node:url';
import { siteConfig } from '../../src/data/site.config';

const SECRET_QUERY_KEYS = new Set([
	'token',
	'api_key',
	'apikey',
	'secret',
	'password',
	'key',
]);

function collectPublicUrlFields(config) {
	const fields = [
		['url', config.url],
		['portfolioUrl', config.portfolioUrl],
		['githubUrl', config.githubUrl],
		['resume.en', config.resume.en],
		['resume.es', config.resume.es],
	];

	for (const [key, value] of Object.entries(config.socialUrls)) {
		fields.push([`socialUrls.${key}`, value]);
	}

	config.sameAs.forEach((value, index) => fields.push([`sameAs[${index}]`, value]));

	return fields;
}

function parsePublicUrl(field, value) {
	try {
		return new URL(value);
	} catch (error) {
		throw new Error(`${field}: invalid public URL`, { cause: error });
	}
}

describe('public privacy contract', () => {
	test('uses the approved email domain', () => {
		expect(siteConfig.email, 'email').toMatch(/@sandovaldavid\.com$/);
	});

	test('exposes only approved social URL keys', () => {
		expect(Object.keys(siteConfig.socialUrls).sort(), 'socialUrls keys').toEqual([
			'instagram',
			'linkedin',
			'twitter',
		]);
	});

	test('keeps every public URL on https', () => {
		for (const [field, value] of collectPublicUrlFields(siteConfig)) {
			expect(parsePublicUrl(field, value).protocol, field).toBe('https:');
		}
	});

	test('prohibits phone and private WhatsApp endpoints', () => {
		for (const [field, value] of collectPublicUrlFields(siteConfig)) {
			const url = parsePublicUrl(field, value);
			expect(url.protocol, field).not.toBe('tel:');
			expect(value, field).not.toMatch(/wa\.me|whatsapp/i);
		}
	});

	test('carries no secret-shaped query keys', () => {
		for (const [field, value] of collectPublicUrlFields(siteConfig)) {
			const url = parsePublicUrl(field, value);
			for (const key of url.searchParams.keys()) {
				expect(
					SECRET_QUERY_KEYS.has(key.toLowerCase()),
					`${field} query key "${key}"`
				).toBe(false);
			}
		}
	});
});
