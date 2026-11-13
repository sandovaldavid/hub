import { describe, expect, test } from 'bun:test';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = join(dirname(fileURLToPath(import.meta.url)), '../..');
const read = path => readFile(join(repositoryRoot, path), 'utf8');
const readJson = async path => JSON.parse(await read(path));

describe('browser test infrastructure contract', () => {
	test('runs the required Browser gate for runtime changes on main', async () => {
		const workflow = await read('.github/workflows/ci.yml');
		const browserJob = workflow.match(/\n {2}browser:[\s\S]*$/)?.[0] ?? '';

		const jobIf = browserJob.match(/^ {4}if: (.+)$/m)?.[1];

		expect(jobIf).toBe("${{ needs.changes.outputs.runtime == 'true' }}");
		expect(browserJob).toContain('PLAYWRIGHT_WORKERS: 2');
		expect(browserJob).toContain(
			"LIGHTHOUSE_RUNS: ${{ github.event_name == 'pull_request' && '1' || '3' }}"
		);
		expect(browserJob).toContain('Run E2E tests');
		expect(browserJob).toContain('Run Lighthouse CI');
		expect(browserJob).not.toContain("github.ref_name == 'main'");
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
			"const ASTRO_CLI_PATH = fileURLToPath(new URL('../node_modules/.bin/astro', import.meta.url));"
		);
		expect(lighthouse).toContain(
			"spawn(ASTRO_CLI_PATH, ['preview', '--host', '0.0.0.0', '--port', '4322'], {"
		);
		expect(lighthouse).not.toContain("spawn('bun', ['run', 'preview:test'], {");
	});
});
