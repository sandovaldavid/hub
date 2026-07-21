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
const zshrc = await readFile(join(repositoryRoot, '.devcontainer/zshrc'), 'utf8');
const poshTheme = JSON.parse(
	await readFile(join(repositoryRoot, '.devcontainer/oh-my-posh.omp.json'), 'utf8')
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

		expect(dockerfile).toContain(`ARG PLAYWRIGHT_VERSION=${expectedVersion}`);
		expect(dockerfile).toContain('FROM mcr.microsoft.com/playwright:v${PLAYWRIGHT_VERSION}-noble');
		expect(devcontainer.containerEnv.PLAYWRIGHT_BROWSERS_PATH).toBe('/ms-playwright');
		expect(packageJson.devDependencies['@playwright/test']).toBe(`^${expectedVersion}`);
		expect(postCreateScript).not.toContain('playwright install chromium');
		expect(postCreateScript).toContain('bun x playwright install --list');
		expect(postCreateScript).not.toContain('bunx ');
	});

	test('uses Zsh and a pinned Oh My Posh prompt without host font dependencies', () => {
		const expectedVersion = devcontainer.build.args.OH_MY_POSH_VERSION;
		const vscodeSettings = devcontainer.customizations.vscode.settings;

		expect(dockerfile).toContain('apt-get install -y --no-install-recommends sudo curl wget zsh');
		expect(dockerfile).toContain(`ARG OH_MY_POSH_VERSION=${expectedVersion}`);
		expect(dockerfile).toContain('--shell /usr/bin/zsh');
		expect(vscodeSettings['terminal.integrated.defaultProfile.linux']).toBe('zsh');
		expect(vscodeSettings['terminal.integrated.profiles.linux'].zsh.path).toBe('/usr/bin/zsh');
		expect(devcontainer.containerEnv.TERM).toBe('xterm-256color');
		expect(postCreateScript).toContain('oh-my-posh print primary');
		expect(postCreateScript).toContain('source /workspace/.devcontainer/zshrc');
		expect(zshrc).toContain('oh-my-posh init zsh --strict');
		expect(poshTheme.version).toBe(4);
		expect(JSON.stringify(poshTheme)).not.toMatch(/[\uE000-\uF8FF]/u);
	});
});
