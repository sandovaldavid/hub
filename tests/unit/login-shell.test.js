import { afterEach, describe, expect, test } from 'bun:test';
import { chmod, mkdir, mkdtemp, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const repositoryRoot = join(dirname(fileURLToPath(import.meta.url)), '../..');
const verifier = join(repositoryRoot, '.devcontainer/scripts/verify-login-shell.sh');
const temporaryDirectories = [];

const createExecutable = async path => {
	await writeFile(path, '#!/usr/bin/env sh\nexit 0\n');
	await chmod(path, 0o755);
};

const createTemporaryRoot = async () => {
	const root = await mkdtemp(join(tmpdir(), 'linktree-login-shell-'));
	temporaryDirectories.push(root);
	return root;
};

afterEach(async () => {
	await Promise.all(temporaryDirectories.splice(0).map(path => rm(path, { recursive: true })));
});

describe('DevContainer login shell verification', () => {
	test('accepts equivalent /bin/zsh and /usr/bin/zsh paths', async () => {
		const root = await createTemporaryRoot();
		const realBin = join(root, 'real');
		const binDir = join(root, 'bin');
		const usrBinDir = join(root, 'usr/bin');
		const canonicalZsh = join(realBin, 'zsh');
		const loginShell = join(binDir, 'zsh');
		const discoveredZsh = join(usrBinDir, 'zsh');

		await mkdir(realBin, { recursive: true });
		await mkdir(binDir, { recursive: true });
		await mkdir(usrBinDir, { recursive: true });
		await createExecutable(canonicalZsh);
		await symlink(canonicalZsh, loginShell);
		await symlink(canonicalZsh, discoveredZsh);

		const result = spawnSync('bash', [verifier, loginShell, discoveredZsh], {
			encoding: 'utf8',
		});

		expect(result.status).toBe(0);
		expect(result.stderr).toBe('');
		expect(result.stdout).toContain('Login shell verified');
		expect(result.stdout).toContain(canonicalZsh);
	});

	test('rejects a real non-Zsh login shell with actionable diagnostics', async () => {
		const root = await createTemporaryRoot();
		const binDir = join(root, 'bin');
		const bashPath = join(binDir, 'bash');
		const zshPath = join(binDir, 'zsh');

		await mkdir(binDir, { recursive: true });
		await createExecutable(bashPath);
		await createExecutable(zshPath);

		const result = spawnSync('bash', [verifier, bashPath, zshPath], {
			encoding: 'utf8',
		});

		expect(result.status).toBe(1);
		expect(result.stderr).toContain('does not use Zsh as its login shell');
		expect(result.stderr).toContain(`observed login shell: ${bashPath}`);
		expect(result.stderr).toContain(`expected Zsh binary: ${zshPath}`);
	});
});
