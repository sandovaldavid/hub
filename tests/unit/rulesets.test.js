import { describe, expect, test } from 'bun:test';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = join(dirname(fileURLToPath(import.meta.url)), '../..');
const developRuleset = JSON.parse(
	await readFile(join(repositoryRoot, '.github/rulesets/develop.json'), 'utf8')
);
const mainRuleset = JSON.parse(
	await readFile(join(repositoryRoot, '.github/rulesets/main.json'), 'utf8')
);
const ciWorkflow = await readFile(join(repositoryRoot, '.github/workflows/ci.yml'), 'utf8');
const branchWorkflow = await readFile(
	join(repositoryRoot, '.github/workflows/check-pr-branch.yml'),
	'utf8'
);
const managementScript = await readFile(
	join(repositoryRoot, 'scripts/manage-rulesets.mjs'),
	'utf8'
);
const packageJson = JSON.parse(await readFile(join(repositoryRoot, 'package.json'), 'utf8'));

const rulesets = [developRuleset, mainRuleset];

function findRule(ruleset, type) {
	return ruleset.rules.find(rule => rule.type === type);
}

function requiredContexts(ruleset) {
	return findRule(ruleset, 'required_status_checks').parameters.required_status_checks.map(
		check => check.context
	);
}

describe('branch ruleset contract', () => {
	test('targets develop and main with active branch rulesets', () => {
		expect(developRuleset.target).toBe('branch');
		expect(developRuleset.enforcement).toBe('active');
		expect(developRuleset.conditions.ref_name.include).toEqual(['refs/heads/develop']);
		expect(mainRuleset.target).toBe('branch');
		expect(mainRuleset.enforcement).toBe('active');
		expect(mainRuleset.conditions.ref_name.include).toEqual(['refs/heads/main']);
	});

	test('blocks deletion and force pushes without forbidding merge commits', () => {
		for (const ruleset of rulesets) {
			const types = ruleset.rules.map(rule => rule.type);
			expect(types).toContain('deletion');
			expect(types).toContain('non_fast_forward');
			expect(types).not.toContain('required_linear_history');
		}
	});

	test('requires pull requests without impossible solo-maintainer approvals', () => {
		for (const ruleset of rulesets) {
			const parameters = findRule(ruleset, 'pull_request').parameters;
			expect(parameters.allowed_merge_methods).toEqual(['squash', 'merge']);
			expect(parameters.required_approving_review_count).toBe(0);
			expect(parameters.require_last_push_approval).toBe(false);
			expect(parameters.require_code_owner_review).toBe(false);
			expect(parameters.required_review_thread_resolution).toBe(true);
		}
	});

	test('limits the owner emergency bypass to audited pull requests', () => {
		for (const ruleset of rulesets) {
			expect(ruleset.bypass_actors).toEqual([
				{
					actor_id: 102970701,
					actor_type: 'User',
					bypass_mode: 'pull_request',
				},
			]);
		}
	});

	test('requires the stable functional CI contexts and excludes report publication', () => {
		const functionalContexts = ['CI / Quality', 'CI / E2E', 'CI / Lighthouse'];

		for (const ruleset of rulesets) {
			const contexts = requiredContexts(ruleset);
			for (const context of functionalContexts) {
				expect(contexts).toContain(context);
			}
			expect(contexts).not.toContain('CI / Playwright report availability');
			expect(
				findRule(ruleset, 'required_status_checks').parameters.strict_required_status_checks_policy
			).toBe(true);
		}

		expect(ciWorkflow).toContain('name: CI');
		expect(ciWorkflow).toContain('name: Quality');
		expect(ciWorkflow).toContain('name: E2E');
		expect(ciWorkflow).toContain('name: Lighthouse');
	});

	test('requires the main source-branch policy without applying it to develop', () => {
		expect(requiredContexts(mainRuleset)).toContain('Check PR Branch / check-source-branch');
		expect(requiredContexts(developRuleset)).not.toContain('Check PR Branch / check-source-branch');
		expect(branchWorkflow).toContain('name: Check PR Branch');
		expect(branchWorkflow).toContain('name: check-source-branch');
		expect(branchWorkflow).toContain('branches: [main]');
	});

	test('provides guarded plan, stage, apply, and verification commands', () => {
		expect(managementScript).toContain("new Set(['plan', 'stage', 'apply', 'verify'])");
		expect(managementScript).toContain('X-GitHub-Api-Version: ${API_VERSION}');
		expect(managementScript).toContain('repos/${repository}/rulesets');
		expect(managementScript).toContain('--confirm-active');
		expect(packageJson.scripts['rulesets:plan']).toBe('node scripts/manage-rulesets.mjs plan');
		expect(packageJson.scripts['rulesets:stage']).toBe('node scripts/manage-rulesets.mjs stage');
		expect(packageJson.scripts['rulesets:apply']).toBe('node scripts/manage-rulesets.mjs apply');
		expect(packageJson.scripts['rulesets:verify']).toBe('node scripts/manage-rulesets.mjs verify');
	});
});
