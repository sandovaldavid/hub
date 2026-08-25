import { describe, expect, test } from 'bun:test';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = join(dirname(fileURLToPath(import.meta.url)), '../..');
const read = path => readFile(join(repositoryRoot, path), 'utf8');
const readJson = async path => JSON.parse(await read(path));

describe('browser test infrastructure contract', () => {
	test('separates GitHub Actions parallelism from generic CI behavior', async () => {
		const [config, workflow] = await Promise.all([
			read('playwright.config.ts'),
			read('.github/workflows/ci.yml'),
		]);

		expect(config).toContain("const isGitHubActions = process.env.GITHUB_ACTIONS === 'true';");
		expect(config).toContain(
			'const workerOverride = getWorkerOverride(process.env.PLAYWRIGHT_WORKERS);'
		);
		expect(config).toContain(
			'const workers = workerOverride ?? (isGitHubActions ? 2 : undefined);'
		);
		expect(config).toContain('retries: isGitHubActions ? 2 : 0');
		expect(config).not.toContain('workers: process.env.CI ? 1 : undefined');
		expect(workflow).toMatch(/e2e:[\s\S]*?PLAYWRIGHT_WORKERS: 2/);
	});

	test('keeps complete local browser validation inside the repository DevContainer', async () => {
		const [packageJson, runner, devcontainer, dockerfile] = await Promise.all([
			readJson('package.json'),
			read('scripts/run-local-validation.mjs'),
			readJson('.devcontainer/devcontainer.json'),
			read('.devcontainer/Dockerfile'),
		]);

		expect(packageJson.scripts['validate:local']).toBe('bun scripts/run-local-validation.mjs');
		expect(packageJson.scripts['validate:local:inside']).toContain('CI=1 bun run test:e2e');
		expect(runner).toContain("process.env.DEVCONTAINER === 'true'");
		expect(runner).toContain("['up', '--workspace-folder', repositoryRoot]");
		expect(runner).toContain("['exec', '--workspace-folder', repositoryRoot, ...remoteCommand]");
		expect(devcontainer.runArgs).toContain('--ipc=host');
		expect(dockerfile).toContain('install --with-deps chromium webkit firefox');
	});

	test('preserves Lighthouse build context when validation starts from a Git worktree', async () => {
		const runner = await read('scripts/run-local-validation.mjs');

		expect(runner).toContain("spawnSync('git', ['rev-parse', 'HEAD']");
		expect(runner).toContain('LHCI_BUILD_CONTEXT__CURRENT_HASH');
		expect(runner).toContain(
			'remoteEnvironment.push(`LHCI_BUILD_CONTEXT__CURRENT_HASH=${currentHash}`)'
		);
		expect(runner).toContain(
			"['env', ...remoteEnvironment, 'bun', 'run', 'validate:local:inside']"
		);
	});

	test('isolates production-preview browser validation from the development port', async () => {
		const [packageJson, config, lighthouse] = await Promise.all([
			readJson('package.json'),
			read('playwright.config.ts'),
			read('.lighthouserc.cjs'),
		]);

		expect(packageJson.scripts['preview:test']).toContain('--port 4322');
		expect(config).toContain(
			"const testServerUrl = isCi ? 'http://localhost:4322' : 'http://localhost:4321';"
		);
		expect(config).toContain("command: isCi ? 'bun run preview:test' : 'bun run dev'");
		expect(lighthouse).toContain("startServerCommand: 'bun run preview:test'");
		expect(lighthouse).toContain("url: ['http://localhost:4322', 'http://localhost:4322/es/']");
	});
});
