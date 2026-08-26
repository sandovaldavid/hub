import { describe, expect, test } from 'bun:test';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = join(dirname(fileURLToPath(import.meta.url)), '../..');
const read = path => readFile(join(repositoryRoot, path), 'utf8');
const readJson = async path => JSON.parse(await read(path));

function requiredContexts(ruleset) {
	const requiredChecksRule = ruleset.rules.find(rule => rule.type === 'required_status_checks');
	return requiredChecksRule.parameters.required_status_checks.map(check => check.context);
}

describe('GitHub ruleset synchronization contract', () => {
	test('uses the check-run names emitted by the current workflows', async () => {
		const [developRuleset, mainRuleset, ciWorkflow, branchWorkflow] = await Promise.all([
			readJson('.github/rulesets/develop.json'),
			readJson('.github/rulesets/main.json'),
			read('.github/workflows/ci.yml'),
			read('.github/workflows/check-pr-branch.yml'),
		]);

		expect(requiredContexts(developRuleset)).toEqual(['Quality', 'E2E', 'Lighthouse']);
		expect(requiredContexts(mainRuleset)).toEqual([
			'Quality',
			'E2E',
			'Lighthouse',
			'check-source-branch',
		]);

		expect(ciWorkflow).toMatch(/\n  quality:\n    name: Quality\n/);
		expect(ciWorkflow).toMatch(/\n  e2e:\n    name: E2E\n/);
		expect(ciWorkflow).toMatch(/\n  lighthouse:\n    name: Lighthouse\n/);
		expect(branchWorkflow).toMatch(/\n  check-source-branch:\n    name: check-source-branch\n/);

		for (const context of [...requiredContexts(developRuleset), ...requiredContexts(mainRuleset)]) {
			expect(context).not.toMatch(/^CI \/ /);
			expect(context).not.toMatch(/^Check PR Branch \/ /);
		}
	});
});
