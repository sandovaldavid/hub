import { describe, expect, test } from 'bun:test';
import {
	checkExternalUrl,
	classifyHttpStatus,
	extractExternalUrls,
	extractMarkdownTargets,
	shouldIgnoreExternalUrl,
} from '../../scripts/check-links.mjs';

describe('link checker', () => {
	test('extracts repository and external targets without markdown titles', () => {
		const content = [
			'[Docs](docs/maintenance.md)',
			'[Production](https://linktree.sandovaldavid.com "Live site")',
			'https://sandovaldavid.com/resume/david-sandoval-resume.pdf',
		].join('\n');

		expect(extractMarkdownTargets(content)).toEqual([
			'docs/maintenance.md',
			'https://linktree.sandovaldavid.com',
		]);
		expect(extractExternalUrls(content)).toContain('https://linktree.sandovaldavid.com');
		expect(extractExternalUrls(content)).toContain(
			'https://sandovaldavid.com/resume/david-sandoval-resume.pdf'
		);
	});

	test('distinguishes healthy, transient, and definitive HTTP results', () => {
		expect(classifyHttpStatus(200)).toBe('ok');
		expect(classifyHttpStatus(308)).toBe('ok');
		expect(classifyHttpStatus(403)).toBe('transient');
		expect(classifyHttpStatus(429)).toBe('transient');
		expect(classifyHttpStatus(503)).toBe('transient');
		expect(classifyHttpStatus(999)).toBe('transient');
		expect(classifyHttpStatus(404)).toBe('broken');
		expect(classifyHttpStatus(410)).toBe('broken');
	});

	test('ignores templates, local servers, and documented generated URLs', () => {
		const ignored = [
			{
				pattern: '^https://sandovaldavid\\.github\\.io/linktree/playwright-report/',
				reason: 'Generated report.',
			},
		];

		expect(shouldIgnoreExternalUrl('https://example.com/${path}', ignored)).toBe(true);
		expect(shouldIgnoreExternalUrl('http://localhost:4321', ignored)).toBe(true);
		expect(
			shouldIgnoreExternalUrl(
				'https://sandovaldavid.github.io/linktree/playwright-report/123/',
				ignored
			)
		).toBe(true);
		expect(shouldIgnoreExternalUrl('https://sandovaldavid.com', ignored)).toBe(false);
	});

	test('falls back from a rejected HEAD request to a successful ranged GET', async () => {
		const methods = [];
		const result = await checkExternalUrl('https://example.com', {
			fetchImpl: async (_url, options) => {
				methods.push(options.method);
				return new Response(null, { status: options.method === 'HEAD' ? 405 : 200 });
			},
			retries: 0,
		});

		expect(methods).toEqual(['HEAD', 'GET']);
		expect(result.state).toBe('ok');
		expect(result.status).toBe(200);
	});

	test('fails only after a definitive broken response persists across retries', async () => {
		const result = await checkExternalUrl('https://example.com/missing', {
			fetchImpl: async () => new Response(null, { status: 404 }),
			retries: 1,
			retryDelayMs: 0,
		});

		expect(result.state).toBe('broken');
		expect(result.status).toBe(404);
		expect(result.attempts).toBe(2);
	});

	test('reports repeated network failures as transient warnings', async () => {
		const result = await checkExternalUrl('https://example.com', {
			fetchImpl: async () => {
				throw new Error('temporary DNS failure');
			},
			retries: 1,
			retryDelayMs: 0,
		});

		expect(result.state).toBe('transient');
		expect(result.error).toContain('temporary DNS failure');
		expect(result.attempts).toBe(2);
	});
});
