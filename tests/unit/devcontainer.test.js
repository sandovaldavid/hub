import { describe, expect, test } from 'bun:test';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = join(dirname(fileURLToPath(import.meta.url)), '../..');
const read = path => readFile(join(repositoryRoot, path), 'utf8');

const devcontainer = JSON.parse(await read('.devcontainer/devcontainer.json'));
const dockerfile = await read('.devcontainer/Dockerfile');
const postCreateScript = await read('.devcontainer/scripts/post-create.sh');
const postStartScript = await read('.devcontainer/scripts/post-start.sh');
const verifyEnvScript = await read('.devcontainer/scripts/verify-env.sh');
const configureShellScript = await read('.devcontainer/scripts/configure-shell.sh');
const configureSigningScript = await read(
	'.devcontainer/scripts/configure-git-ssh-signing.sh'
);
const zshConfig = await read('.devcontainer/config/shell.zsh');
const bashConfig = await read('.devcontainer/config/shell.bash');
const starshipConfig = await read('.devcontainer/config/starship.toml');
const packageJson = JSON.parse(await read('package.json'));
const prettierIgnore = await read('.prettierignore');

const commonUtilsFeature = 'ghcr.io/devcontainers/features/common-utils:2.5.9';
const githubCliFeature = 'ghcr.io/devcontainers/features/github-cli:1.1.0';

describe('DevContainer contract', () => {
	test('isolates Linux dependencies and shell history from the Fedora bind mount', () => {
		expect(devcontainer.workspaceFolder).toBe('/workspace');
		expect(devcontainer.workspaceMount).toContain('target=/workspace,type=bind');
		expect(devcontainer.mounts).toContain(
			'source=linktree-node-modules-v1,target=/workspace/node_modules,type=volume'
		);
		expect(devcontainer.mounts).toContain(
			'source=devcontainer-${localWorkspaceFolderBasename}-zsh-history,target=/commandhistory,type=volume'
		);
		expect(devcontainer.containerEnv.ZSH_HISTORY_FILE).toBe('/commandhistory/.zsh_history');
		expect(postCreateScript).toContain('sudo chown -R "${owner}" "${deps}"');
		expect(postCreateScript).toContain('"${deps}/.vite"');
		expect(postCreateScript).toContain('"${workspace}/.astro"');
		expect(postCreateScript).toContain('bun ci');
		expect(postCreateScript).not.toContain('bun install --frozen-lockfile');
	});

	test('finishes the frozen install before VS Code activates workspace tooling', () => {
		expect(devcontainer.waitFor).toBe('postCreateCommand');
		expect(devcontainer.postCreateCommand).toBe('bash .devcontainer/scripts/post-create.sh');
		expect(devcontainer.customizations.vscode.settings['js/ts.tsdk.path']).toBe(
			'./node_modules/typescript/lib'
		);
		expect(
			devcontainer.customizations.vscode.settings['js/ts.tsdk.promptToUseWorkspaceVersion']
		).toBe(true);
		expect(packageJson.packageManager).toBe('bun@1.3.14');
	});

	test('uses the non-root user with container-safe browser runtime flags', () => {
		expect(devcontainer.remoteUser).toBe('node');
		expect(devcontainer.updateRemoteUserUID).toBe(true);
		expect(devcontainer.init).toBe(true);
		expect(devcontainer.runArgs).toContain('--ipc=host');
		expect(devcontainer.runArgs).toContain('--security-opt');
		expect(devcontainer.runArgs).toContain('label=disable');
		expect(devcontainer.containerEnv.DEVCONTAINER).toBe('true');
	});

	test('pins the base image, Features, Bun and Playwright browsers', () => {
		expect(devcontainer.build.args.NODE_VARIANT).toBe('24-trixie');
		expect(devcontainer.build.args.BUN_VERSION).toBe('1.3.14');
		expect(devcontainer.build.args.PLAYWRIGHT_VERSION).toBe('1.61.0');
		expect(devcontainer.features[commonUtilsFeature]).toBeDefined();
		expect(devcontainer.features[commonUtilsFeature].username).toBe('node');
		expect(devcontainer.features[commonUtilsFeature].installZsh).toBe(true);
		expect(devcontainer.features[githubCliFeature]).toBeDefined();
		expect(dockerfile).toContain(
			'FROM mcr.microsoft.com/devcontainers/typescript-node:5-${NODE_VARIANT}'
		);
		expect(dockerfile).not.toContain('playwright:v');
		expect(dockerfile).not.toContain('groupadd');
		expect(dockerfile).not.toContain('useradd');
		expect(dockerfile).toContain('BUN_INSTALL=/home/node/.bun');
		expect(dockerfile).toContain('install --with-deps chromium webkit');
		expect(packageJson.devDependencies['@playwright/test']).toBe('^1.61.0');
	});

	test('verifies Bun, Playwright, Chromium, WebKit and the shell toolchain', () => {
		expect(devcontainer.postStartCommand).toBe('bash .devcontainer/scripts/post-start.sh');
		expect(verifyEnvScript).toContain('installed_bun_version="$(bun --version)"');
		expect(verifyEnvScript).toContain(
			'installed_playwright_version="$(bun x playwright --version | awk'
		);
		expect(verifyEnvScript).toContain('for browser in chromium webkit; do');
		expect(verifyEnvScript).toContain('installed_starship_version');
		expect(verifyEnvScript).toContain('installed_eza_version');
		expect(verifyEnvScript).toContain('bun x playwright install --list');
		expect(postCreateScript).not.toContain('playwright install chromium');
		expect(postCreateScript).not.toContain('bunx ');
	});

	test('installs a pinned Starship, eza and Zsh configuration idempotently', () => {
		expect(configureShellScript).toContain(
			'STARSHIP_VERSION="${STARSHIP_VERSION:-v1.26.0}"'
		);
		expect(configureShellScript).toContain('EZA_VERSION="${EZA_VERSION:-0.23.5}"');
		expect(configureShellScript).toContain('sha256sum --check --status');
		expect(configureShellScript).toContain('# >>> devcontainer-shell >>>');
		expect(zshConfig).toContain('HISTFILE="${ZSH_HISTORY_FILE:-$HOME/.zsh_history}"');
		expect(zshConfig).toContain('zsh-autosuggestions-0.7.1');
		expect(zshConfig).toContain('starship init zsh');
		expect(bashConfig).toContain('starship init bash');
		expect(starshipConfig).toContain(
			'"$schema" = "https://starship.rs/config-schema.json"'
		);
	});

	test('forwards Git SSH signing without copying private keys into the container', () => {
		expect(configureSigningScript).toContain('ssh-add -L');
		expect(configureSigningScript).toContain('namespaces="git"');
		expect(configureSigningScript).toContain('user.signingKey');
		expect(configureSigningScript).not.toMatch(/BEGIN (OPENSSH|PRIVATE) KEY/);
		expect(postCreateScript).toContain(
			'bash .devcontainer/scripts/configure-git-ssh-signing.sh'
		);
		expect(postStartScript).toContain(
			'bash .devcontainer/scripts/configure-git-ssh-signing.sh'
		);
	});

	test('keeps Playwright reports writable and exposes the HTML report explicitly', () => {
		expect(postStartScript).toContain('"${workspace}/playwright-report"');
		expect(postStartScript).toContain('"${workspace}/test-results"');
		expect(postStartScript).toContain(
			'sudo chown -R "${owner}" "${report_directories[@]}"'
		);
		expect(devcontainer.forwardPorts).toContain(9323);
		expect(devcontainer.portsAttributes['9323'].protocol).toBe('http');
		expect(packageJson.scripts['test:e2e:show-report']).toBe(
			'playwright show-report --host 0.0.0.0 --port 9323'
		);
	});

	test('rejects identity drift between the host bind mount and the remote user', () => {
		expect(postStartScript).toContain('workspace_uid="$(stat -c');
		expect(postStartScript).toContain('Development container identity mismatch.');
		expect(postStartScript).toContain('Repository root is not writable');
		expect(postStartScript).toContain('bash .devcontainer/scripts/verify-env.sh');
	});

	test('excludes the generated Dev Container lockfile from Prettier formatting', () => {
		expect(prettierIgnore).toContain('.devcontainer/devcontainer-lock.json');
	});
});
