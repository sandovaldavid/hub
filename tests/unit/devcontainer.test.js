import { describe, expect, test } from 'bun:test';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = join(dirname(fileURLToPath(import.meta.url)), '../..');
const devcontainer = JSON.parse(
	await readFile(join(repositoryRoot, '.devcontainer/devcontainer.json'), 'utf8')
);
const dockerfile = await readFile(join(repositoryRoot, '.devcontainer/Dockerfile'), 'utf8');
const postCreateScript = await readFile(
	join(repositoryRoot, '.devcontainer/post-create.sh'),
	'utf8'
);
const packageJson = JSON.parse(await readFile(join(repositoryRoot, 'package.json'), 'utf8'));

describe('DevContainer contract', () => {
	test('isolates Linux dependencies from the Fedora bind mount', () => {
		expect(devcontainer.workspaceFolder).toBe('/workspace');
		expect(devcontainer.mounts).toContain(
			'source=${localWorkspaceFolderBasename}-node_modules,target=${containerWorkspaceFolder}/node_modules,type=volume'
		);
		expect(devcontainer.postCreateCommand).toBe('bash .devcontainer/post-create.sh');
		expect(postCreateScript).toContain('rm -rf node_modules/.bin');
		expect(postCreateScript).toContain('bun install --frozen-lockfile');
	});

	test('finishes dependency setup before VS Code activates workspace tooling', () => {
		expect(devcontainer.waitFor).toBe('postCreateCommand');
		expect(devcontainer.customizations.vscode.settings['typescript.tsdk']).toBe(
			'node_modules/typescript/lib'
		);
	});

	test('uses the non-root development user and recommended Chromium runtime flags', () => {
		expect(devcontainer.remoteUser).toBe('vscode');
		expect(devcontainer.runArgs).toContain('--init');
		expect(devcontainer.runArgs).toContain('--ipc=host');
	});

	test('reuses browsers from the version-matched Playwright image', () => {
		const expectedVersion = devcontainer.build.args.PLAYWRIGHT_VERSION;

		expect(dockerfile).toContain(
			`FROM mcr.microsoft.com/playwright:v${expectedVersion}-noble`
		);
		expect(devcontainer.containerEnv.PLAYWRIGHT_BROWSERS_PATH).toBe('/ms-playwright');
		expect(packageJson.devDependencies['@playwright/test']).toBe(`^${expectedVersion}`);
		expect(postCreateScript).not.toContain('playwright install chromium');
		expect(postCreateScript).toContain('bun x playwright install --list');
		expect(postCreateScript).not.toContain('bunx ');
	});
});