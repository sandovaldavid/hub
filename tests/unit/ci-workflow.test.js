import { describe, expect, test } from 'bun:test';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = join(dirname(fileURLToPath(import.meta.url)), '../..');
const workflow = await readFile(join(repositoryRoot, '.github/workflows/ci.yml'), 'utf8');
const packageJson = JSON.parse(await readFile(join(repositoryRoot, 'package.json'), 'utf8'));

describe('CI workflow contract', () => {
	test('publishes stable functional check names for branch rulesets', () => {
		expect(workflow).toContain('name: Quality');
		expect(workflow).toContain('name: E2E');
		expect(workflow).toContain('name: Lighthouse');
	});

	test('cancels obsolete executions for the same pull request or ref', () => {
		expect(workflow).toContain('concurrency:');
		expect(workflow).toContain('cancel-in-progress: true');
		expect(workflow).toContain('github.event.pull_request.number || github.ref');
	});

	test('builds once and reuses the production artifact', () => {
		expect(workflow.match(/run: bun run build/g)).toHaveLength(1);
		expect(workflow).toContain('BUILD_ARTIFACT_NAME: astro-dist');
		expect(workflow).toContain('name: ${{ env.BUILD_ARTIFACT_NAME }}');
		expect(workflow.match(/Download production build/g)).toHaveLength(2);
	});

	test('keeps E2E results separate from report publication', () => {
		expect(workflow).toContain('name: Playwright report availability');
		expect(workflow).toContain('Use `CI / E2E` for the functional test result.');
		expect(workflow).not.toContain('context":"Playwright Report"');
		expect(workflow).not.toContain('continue-on-error: true');
	});

	test('uploads a generated report after failure but not after cancellation', () => {
		expect(workflow).toContain('if: ${{ !cancelled() }}');
		expect(workflow).toContain(
			"!cancelled() && steps.detect_report.outputs.available == 'true'"
		);
		expect(workflow).toContain(
			"!cancelled() && needs.e2e.outputs.report_available == 'true'"
		);
		expect(workflow).not.toContain('if: always()');
	});

	test('defines a local validation equivalent and both Lighthouse profiles', () => {
		expect(packageJson.scripts['validate:quality']).toContain('bunx astro check');
		expect(packageJson.scripts['validate:local']).toContain('CI=1 bun run test:e2e');
		expect(packageJson.scripts['test:lighthouse']).toContain('test:lighthouse:mobile');
		expect(packageJson.scripts['test:lighthouse']).toContain('test:lighthouse:desktop');
	});
});
