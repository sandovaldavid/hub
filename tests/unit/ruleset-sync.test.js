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
		const [mainRuleset, ciWorkflow] = await Promise.all([
			readJson('.github/rulesets/main.json'),
			read('.github/workflows/ci.yml'),
		]);

		expect(requiredContexts(mainRuleset)).toEqual(['Quality', 'Browser']);

		expect(ciWorkflow).toMatch(/\n {2}quality:\n {4}name: Quality\n/);
		expect(ciWorkflow).toMatch(/\n {2}browser:\n {4}name: Browser\n/);

		for (const context of requiredContexts(mainRuleset)) {
			expect(context).not.toMatch(/^CI \/ /);
		}
	});
});
