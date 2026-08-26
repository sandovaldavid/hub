import { describe, expect, test } from 'bun:test';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = join(dirname(fileURLToPath(import.meta.url)), '../..');
const read = path => readFile(join(repositoryRoot, path), 'utf8');
const readJson = async path => JSON.parse(await read(path));

describe('release delivery hardening contracts', () => {
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

	test('registers the validated deployment ref without reconciling branch history', async () => {
		const workflow = await read('.github/workflows/cd.yml');

		expect(workflow).toMatch(
			/github\.rest\.repos\.createDeployment\(\{[\s\S]*?required_contexts: \[\],[\s\S]*?auto_merge: false,/
		);
	});

	test('keeps the deploy toolchain explicitly versioned', async () => {
		const workflow = await read('.github/workflows/cd.yml');

		expect(workflow).toContain('BUN_VERSION: 1.3.14');
		expect(workflow).toContain('NODE_VERSION: 22.19.0');
		expect(workflow).toMatch(/VERCEL_CLI_VERSION: \d+\.\d+\.\d+/);
		expect(workflow).not.toContain('vercel@latest');
	});

	test('keeps dependency advisory checks explicit but outside the deterministic quality gate', async () => {
		const [packageJson, ci, securityAudit] = await Promise.all([
			readJson('package.json'),
			read('.github/workflows/ci.yml'),
			read('.github/workflows/security-audit.yml'),
		]);

		expect(packageJson.scripts['audit:deps']).toBe('bun audit');
		expect(packageJson.scripts['validate:quality']).not.toContain('audit:deps');
		expect(packageJson.scripts['validate:quality']).not.toMatch(/\bbun audit\b/);
		expect(ci).not.toContain('audit:deps');
		expect(securityAudit).toContain('name: Security Audit');
		expect(securityAudit).toContain('branches: [develop, main]');
		expect(securityAudit).toContain('run: bun run audit:deps');
	});

	// `release-as` forces the next release to a fixed version and keeps doing so
	// until it is removed. It is valid while main still records an older release,
	// but once a Release Please PR has prepared package.json and the manifest at
	// the forced target, the pin has completed its job and must be removed in that
	// same release PR before merge. Otherwise future release calculation and the
	// footer version can remain frozen on the one-time override.
	test('requires a one-time release-as override to be removed by the target release PR', async () => {
		const [config, manifest, packageJson] = await Promise.all([
			readJson('release-please-config.json'),
			readJson('.release-please-manifest.json'),
			readJson('package.json'),
		]);

		const pinnedVersion = config.packages['.']['release-as'];
		if (!pinnedVersion) return;

		expect(
			pinnedVersion,
			`release-as is still pinned to ${pinnedVersion}, which the release PR has already prepared. Remove the override inside the release PR before merge so conventional commits drive the next version.`
		).not.toBe(manifest['.']);
		expect(pinnedVersion).not.toBe(packageJson.version);
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
