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
	join(repositoryRoot, '.devcontainer/scripts/post-create.sh'),
	'utf8'
);
const postStartScript = await readFile(
	join(repositoryRoot, '.devcontainer/scripts/post-start.sh'),
	'utf8'
);
const verifyEnvScript = await readFile(
	join(repositoryRoot, '.devcontainer/scripts/verify-env.sh'),
	'utf8'
);
const zshrc = await readFile(join(repositoryRoot, '.devcontainer/zshrc'), 'utf8');
const poshTheme = JSON.parse(
	await readFile(join(repositoryRoot, '.devcontainer/oh-my-posh.omp.json'), 'utf8')
);
const packageJson = JSON.parse(await readFile(join(repositoryRoot, 'package.json'), 'utf8'));
const prettierIgnore = await readFile(join(repositoryRoot, '.prettierignore'), 'utf8');

describe('DevContainer contract', () => {
	test('isolates Linux dependencies from the Fedora bind mount', () => {
		expect(devcontainer.workspaceFolder).toBe('/workspace');
		expect(devcontainer.mounts).toContain(
			'source=linktree-node-modules-v1,target=/workspace/node_modules,type=volume'
		);
		expect(devcontainer.postCreateCommand).toBe('bash .devcontainer/scripts/post-create.sh');
		expect(postCreateScript).toContain('sudo chown -R "${owner}" "${deps}"');
		expect(postCreateScript).toContain('"${deps}/.vite"');
		expect(postCreateScript).toContain('"${workspace}/.astro"');
		expect(postCreateScript).toContain('bun ci');
		expect(postCreateScript).not.toMatch(/^[^#]*\bbun install --frozen-lockfile\b/m);
	});

	test('finishes dependency setup before VS Code activates workspace tooling', () => {
		expect(devcontainer.waitFor).toBe('postCreateCommand');
		expect(devcontainer.customizations.vscode.settings['typescript.tsdk']).toBe(
			'node_modules/typescript/lib'
		);
		expect(
			devcontainer.customizations.vscode.settings['typescript.enablePromptUseWorkspaceTsdk']
		).toBe(true);
	});

	test('uses the non-root development user and recommended Chromium runtime flags', () => {
		expect(devcontainer.remoteUser).toBe('node');
		expect(devcontainer.updateRemoteUserUID).toBe(true);
		expect(devcontainer.init).toBe(true);
		expect(devcontainer.runArgs).not.toContain('--init');
		expect(devcontainer.runArgs).toContain('--ipc=host');
	});

	test('installs tooling through Dev Container Features', () => {
		expect(devcontainer.features).toBeDefined();
		expect(devcontainer.features['ghcr.io/devcontainers/features/common-utils:2']).toBeDefined();
		expect(devcontainer.features['ghcr.io/devcontainers/features/common-utils:2'].installZsh).toBe(
			true
		);
		expect(devcontainer.features['ghcr.io/devcontainers/features/common-utils:2'].username).toBe(
			'node'
		);
		expect(devcontainer.features['ghcr.io/devcontainers/features/github-cli:1']).toBeDefined();
		expect(dockerfile).toContain(
			'FROM mcr.microsoft.com/devcontainers/javascript-node:1-${NODE_VARIANT}'
		);
		expect(dockerfile).not.toContain('playwright:v');
		expect(dockerfile).not.toContain('groupadd');
		expect(dockerfile).not.toContain('useradd');
		expect(dockerfile).toContain('BUN_INSTALL=/usr/local');
		expect(dockerfile).toContain('npx playwright install --with-deps chromium');
	});

	test('installs Chromium browsers during image build', () => {
		const expectedVersion = devcontainer.build.args.PLAYWRIGHT_VERSION;

		expect(dockerfile).toContain(`ARG PLAYWRIGHT_VERSION=${expectedVersion}`);
		expect(dockerfile).toContain('npx playwright install --with-deps chromium');
		expect(devcontainer.containerEnv.PLAYWRIGHT_BROWSERS_PATH).toBe('/ms-playwright');
		expect(packageJson.devDependencies['@playwright/test']).toBe(`^${expectedVersion}`);
		expect(postCreateScript).not.toContain('playwright install chromium');
		expect(postCreateScript).not.toContain('bunx ');
		expect(verifyEnvScript).toContain('bun x playwright install --list');
		expect(verifyEnvScript).toContain(
			'grep -q .; then\n\techo "[error] The Playwright image does not contain Chromium'
		);
	});

	test('verifies toolchain versions on every container start', () => {
		expect(devcontainer.postStartCommand).toBe('bash .devcontainer/scripts/post-start.sh');
		expect(postStartScript).toContain('bash .devcontainer/scripts/verify-env.sh');
		expect(verifyEnvScript).toContain('installed_bun_version="$(bun --version)"');
		expect(verifyEnvScript).toContain(
			'installed_playwright_version="$(bun x playwright --version | awk \'{print $2}\')"'
		);
		expect(verifyEnvScript).toContain('installed_posh_version="$(oh-my-posh version)"');
	});

	test('uses Zsh and a pinned Oh My Posh prompt without host font dependencies', () => {
		const expectedVersion = devcontainer.build.args.OH_MY_POSH_VERSION;
		const vscodeSettings = devcontainer.customizations.vscode.settings;

		expect(dockerfile).toContain(`ARG OH_MY_POSH_VERSION=${expectedVersion}`);
		expect(vscodeSettings['terminal.integrated.defaultProfile.linux']).toBe('zsh');
		expect(vscodeSettings['terminal.integrated.profiles.linux'].zsh.path).toBe('/usr/bin/zsh');
		expect(devcontainer.containerEnv.TERM).toBe('xterm-256color');
		expect(postCreateScript).toContain('oh-my-posh print primary');
		expect(postCreateScript).toContain('source /workspace/.devcontainer/zshrc');
		expect(zshrc).toContain('oh-my-posh init zsh --strict');
		expect(poshTheme.version).toBe(4);
		expect(JSON.stringify(poshTheme)).not.toMatch(/[\uE000-\uF8FF]/u);
	});

	test('excludes Dev Container lockfile from Prettier formatting', () => {
		expect(prettierIgnore).toContain('.devcontainer/devcontainer-lock.json');
	});
});
