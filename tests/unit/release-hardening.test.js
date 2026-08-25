import { describe, expect, test } from 'bun:test';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = join(dirname(fileURLToPath(import.meta.url)), '../..');
const read = path => readFile(join(repositoryRoot, path), 'utf8');
const readJson = async path => JSON.parse(await read(path));

describe('pre-v2 delivery hardening contracts', () => {
	test('keeps immutable caching limited to fingerprinted Astro assets', async () => {
		const vercel = await readJson('vercel.json');
		const immutableRules = vercel.headers.filter(rule =>
			rule.headers.some(
				header => header.key === 'Cache-Control' && header.value.includes('immutable')
			)
		);

		expect(immutableRules).toHaveLength(1);
		expect(immutableRules[0].source).toBe('/_astro/(.*)');
		expect(immutableRules[0].headers).toContainEqual({
			key: 'Cache-Control',
			value: 'public, max-age=31536000, immutable',
		});

		const broadStableAssetRule = vercel.headers.find(rule =>
			/(webp|png|svg|ico)/.test(rule.source)
		);
		expect(broadStableAssetRule).toBeUndefined();
	});

	test('does not publish the deprecated X-XSS-Protection response header', async () => {
		const vercel = await readJson('vercel.json');
		const securityHeaders = vercel.headers.flatMap(rule => rule.headers);

		expect(securityHeaders.some(header => header.key === 'X-XSS-Protection')).toBe(false);
	});

	test('publishes GitHub deployment evidence through fail-closed API calls', async () => {
		const workflow = await read('.github/workflows/cd.yml');

		expect(workflow).toContain('github.rest.repos.createDeployment({');
		expect(workflow).toContain('github.rest.repos.createDeploymentStatus({');
		expect(workflow).toContain('github.rest.repos.createCommitStatus({');
		expect(workflow).toContain("throw new Error('GitHub did not return a valid deployment id')");
		expect(workflow).not.toMatch(/\bcurl\b/);
		expect(workflow).not.toContain('| jq');
	});

	test('keeps the deploy toolchain explicitly versioned', async () => {
		const workflow = await read('.github/workflows/cd.yml');

		expect(workflow).toContain('BUN_VERSION: 1.3.14');
		expect(workflow).toContain('NODE_VERSION: 22.19.0');
		expect(workflow).toMatch(/VERCEL_CLI_VERSION: \d+\.\d+\.\d+/);
		expect(workflow).not.toContain('vercel@latest');
	});

	test('pins the workspace Chrome DevTools MCP instead of tracking latest', async () => {
		const mcp = await readJson('.vscode/mcp.json');
		const args = mcp.servers['chrome-devtools'].args;
		const packageArg = args.find(arg => arg.startsWith('chrome-devtools-mcp@'));

		expect(args).toContain('-y');
		expect(packageArg).toMatch(/^chrome-devtools-mcp@\d+\.\d+\.\d+$/);
		expect(packageArg).not.toContain('@latest');
	});
});
