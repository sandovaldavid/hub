import console from 'node:console';
import { spawnSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const API_VERSION = '2026-03-10';
const repositoryRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const rulesetPaths = [
	join(repositoryRoot, '.github/rulesets/develop.json'),
	join(repositoryRoot, '.github/rulesets/main.json'),
];
const supportedCommands = new Set(['plan', 'stage', 'apply', 'verify']);

function fail(message) {
	console.error(`[error] ${message}`);
	process.exit(1);
}

function runGh(args, input) {
	const result = spawnSync('gh', args, {
		encoding: 'utf8',
		input,
		stdio: ['pipe', 'pipe', 'pipe'],
	});

	if (result.error) {
		fail(`Unable to execute gh: ${result.error.message}`);
	}

	if (result.status !== 0) {
		const details = result.stderr.trim() || result.stdout.trim() || `exit code ${result.status}`;
		fail(`gh ${args.join(' ')} failed: ${details}`);
	}

	return result.stdout.trim();
}

function resolveRepository() {
	if (process.env.GITHUB_REPOSITORY) {
		return process.env.GITHUB_REPOSITORY;
	}

	return runGh(['repo', 'view', '--json', 'nameWithOwner', '--jq', '.nameWithOwner']);
}

function api(method, endpoint, body) {
	const args = [
		'api',
		'--method',
		method,
		'-H',
		'Accept: application/vnd.github+json',
		'-H',
		`X-GitHub-Api-Version: ${API_VERSION}`,
		endpoint,
	];

	if (body !== undefined) {
		args.push('--input', '-');
	}

	const output = runGh(args, body === undefined ? undefined : `${JSON.stringify(body)}\n`);
	return output ? JSON.parse(output) : null;
}

function projectToDesiredShape(actual, desired) {
	if (Array.isArray(desired)) {
		if (!Array.isArray(actual) || actual.length !== desired.length) {
			return actual;
		}

		return desired.map((item, index) => projectToDesiredShape(actual[index], item));
	}

	if (desired && typeof desired === 'object') {
		if (!actual || typeof actual !== 'object') {
			return actual;
		}

		return Object.fromEntries(
			Object.entries(desired).map(([key, value]) => [
				key,
				projectToDesiredShape(actual[key], value),
			])
		);
	}

	return actual;
}

function matchesDesired(actual, desired) {
	return JSON.stringify(projectToDesiredShape(actual, desired)) === JSON.stringify(desired);
}

async function loadDesiredRulesets() {
	return Promise.all(
		rulesetPaths.map(async path => {
			const content = await readFile(path, 'utf8');
			return JSON.parse(content);
		})
	);
}

const command = process.argv[2] ?? 'plan';
if (!supportedCommands.has(command)) {
	fail(`Unsupported command "${command}". Use plan, stage, apply, or verify.`);
}

if (command === 'stage' && !process.argv.includes('--confirm')) {
	fail('Staging modifies repository settings. Re-run with --confirm.');
}

if (command === 'apply' && !process.argv.includes('--confirm-active')) {
	fail(
		'Activating rulesets is blocking. Re-run with --confirm-active after hosted checks are available.'
	);
}

const repository = resolveRepository();
const desiredRulesets = await loadDesiredRulesets();
const summaries = api('GET', `repos/${repository}/rulesets?includes_parents=false`);
let hasDrift = false;

for (const configuredRuleset of desiredRulesets) {
	const desired =
		command === 'stage' ? { ...configuredRuleset, enforcement: 'disabled' } : configuredRuleset;
	const summary = summaries.find(item => item.name === desired.name);
	const current = summary ? api('GET', `repos/${repository}/rulesets/${summary.id}`) : null;
	const inSync = current ? matchesDesired(current, desired) : false;

	if (command === 'plan') {
		console.log(`${current ? (inSync ? '[ok]' : '[update]') : '[create]'} ${desired.name}`);
		continue;
	}

	if (command === 'verify') {
		if (!current) {
			console.error(`[missing] ${desired.name}`);
			hasDrift = true;
			continue;
		}

		if (!inSync) {
			console.error(`[drift] ${desired.name}`);
			hasDrift = true;
			continue;
		}

		console.log(`[ok] ${desired.name}`);
		continue;
	}

	if (inSync) {
		console.log(`[ok] ${desired.name}`);
		continue;
	}

	const updated = current
		? api('PUT', `repos/${repository}/rulesets/${summary.id}`, desired)
		: api('POST', `repos/${repository}/rulesets`, desired);

	if (!matchesDesired(updated, desired)) {
		fail(`${desired.name} was written but does not match the desired configuration.`);
	}

	console.log(`${current ? '[updated]' : '[created]'} ${desired.name} (${desired.enforcement})`);
}

if (command === 'verify' && hasDrift) {
	fail('Repository rulesets do not match the active desired state.');
}
