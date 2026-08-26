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

	test('forwards only explicit runtime knobs into DevContainer validation', async () => {
		const runner = await read('scripts/run-local-validation.mjs');

		expect(runner).toContain('process.env.PLAYWRIGHT_WORKERS');
		expect(runner).toContain(
			'remoteEnvironment.push(`PLAYWRIGHT_WORKERS=${process.env.PLAYWRIGHT_WORKERS}`)'
		);
		expect(runner).toContain(
			"['env', ...remoteEnvironment, 'bun', 'run', 'validate:local:inside']"
		);
		expect(runner).not.toContain('LHCI_BUILD_CONTEXT__CURRENT_HASH');
		expect(runner).not.toContain('getCurrentGitHash');
	});

	test('isolates production-preview browser validation from the development port', async () => {
		const [packageJson, config, lighthouse] = await Promise.all([
			readJson('package.json'),
			read('playwright.config.ts'),
			read('scripts/run-lighthouse.mjs'),
		]);

		expect(packageJson.scripts['preview:test']).toContain('--port 4322');
		expect(config).toContain(
			"const testServerUrl = isCi ? 'http://localhost:4322' : 'http://localhost:4321';"
		);
		expect(config).toContain("command: isCi ? 'bun run preview:test' : 'bun run dev'");
		expect(lighthouse).toContain("const PREVIEW_ORIGIN = 'http://localhost:4322';");
		expect(lighthouse).toContain('const URLS = [PREVIEW_ORIGIN, `${PREVIEW_ORIGIN}/es/`];');
		expect(lighthouse).toContain(
			"const ASTRO_CLI_PATH = fileURLToPath(new URL('../node_modules/astro/astro.js', import.meta.url));"
		);
		expect(lighthouse).toContain(
			"[ASTRO_CLI_PATH, 'preview', '--host', '0.0.0.0', '--port', '4322']"
		);
		expect(lighthouse).not.toContain("spawn('bun', ['run', 'preview:test'], {");
	});
});
