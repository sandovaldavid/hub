import { spawnSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const isDevContainer = process.env.DEVCONTAINER === 'true';
const devcontainerExecutable = process.platform === 'win32' ? 'devcontainer.cmd' : 'devcontainer';

function run(command, args) {
	const result = spawnSync(command, args, {
		cwd: repositoryRoot,
		env: process.env,
		stdio: 'inherit',
	});

	if (result.error) {
		console.error(`[error] Failed to run ${command}: ${result.error.message}`);
		process.exit(1);
	}

	if (result.status !== 0) {
		process.exit(result.status ?? 1);
	}
}

function getCurrentGitHash() {
	const result = spawnSync('git', ['rev-parse', 'HEAD'], {
		cwd: repositoryRoot,
		env: process.env,
		encoding: 'utf8',
		stdio: ['ignore', 'pipe', 'ignore'],
	});

	if (result.error || result.status !== 0) return undefined;

	const hash = result.stdout.trim();
	return /^[0-9a-f]{40}$/i.test(hash) ? hash : undefined;
}

if (isDevContainer) {
	const currentHash = process.env.LHCI_BUILD_CONTEXT__CURRENT_HASH ?? getCurrentGitHash();
	if (currentHash) {
		process.env.LHCI_BUILD_CONTEXT__CURRENT_HASH = currentHash;
	}

	console.log('[info] Running complete validation inside the repository DevContainer.');
	run('bun', ['run', 'validate:local:inside']);
	process.exit(0);
}

const devcontainerProbe = spawnSync(devcontainerExecutable, ['--version'], {
	cwd: repositoryRoot,
	stdio: 'ignore',
});

if (devcontainerProbe.error?.code === 'ENOENT') {
	console.error('[error] Complete local validation requires the Dev Containers CLI.');
	console.error(
		'[hint] Install the Dev Containers CLI, or open this repository in its DevContainer and rerun `bun run validate:local`.'
	);
	process.exit(1);
}

if (devcontainerProbe.error || devcontainerProbe.status !== 0) {
	console.error('[error] The Dev Containers CLI is installed but could not be executed.');
	process.exit(1);
}

const currentHash = process.env.LHCI_BUILD_CONTEXT__CURRENT_HASH ?? getCurrentGitHash();
if (!currentHash) {
	console.warn(
		'[warning] Could not resolve the current Git SHA on the host; Lighthouse may omit local build-context metadata.'
	);
}

console.log('[info] Preparing the repository DevContainer for complete local validation.');
run(devcontainerExecutable, ['up', '--workspace-folder', repositoryRoot]);

const remoteEnvironment = [];
if (process.env.PLAYWRIGHT_WORKERS) {
	remoteEnvironment.push(`PLAYWRIGHT_WORKERS=${process.env.PLAYWRIGHT_WORKERS}`);
}
if (currentHash) {
	remoteEnvironment.push(`LHCI_BUILD_CONTEXT__CURRENT_HASH=${currentHash}`);
}

const remoteCommand = remoteEnvironment.length
	? ['env', ...remoteEnvironment, 'bun', 'run', 'validate:local:inside']
	: ['bun', 'run', 'validate:local:inside'];

console.log('[info] Running browser and Lighthouse validation inside the repository DevContainer.');
run(devcontainerExecutable, ['exec', '--workspace-folder', repositoryRoot, ...remoteCommand]);
