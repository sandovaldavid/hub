import { describe, expect, test } from 'bun:test';
import { isWebShareSupported } from '../../src/features/share-button/lib/share-utils.ts';

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
