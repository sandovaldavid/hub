import { describe, expect, test } from 'bun:test';
import {
	getShareData,
	isWebShareSupported,
} from '../../src/features/share-button/lib/share-utils.ts';

describe('share capability detection', () => {
	test('accepts native share even when canShare is not exposed', () => {
		const capability = {
			share: async () => {},
		};

		expect(isWebShareSupported(capability)).toBe(true);
	});

	test('rejects missing or non-callable share implementations', () => {
		expect(isWebShareSupported(null)).toBe(false);
		expect(isWebShareSupported({ share: undefined })).toBe(false);
	});
});

describe('share payload', () => {
	test('shares only the page URL so receivers can unfurl social metadata', () => {
		const data = getShareData('https://hub.sandovaldavid.com/es/');

		expect(data).toEqual({ url: 'https://hub.sandovaldavid.com/es/' });
		expect(Object.keys(data)).toEqual(['url']);
	});
});
