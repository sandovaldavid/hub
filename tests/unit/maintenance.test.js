import { describe, expect, test } from 'bun:test';
import { readFile, readdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = join(dirname(fileURLToPath(import.meta.url)), '../..');
const read = path => readFile(join(repositoryRoot, path), 'utf8');

const dependabot = await read('.github/dependabot.yml');
const ciWorkflow = await read('.github/workflows/ci.yml');
const deployDevelopWorkflow = await read('.github/workflows/cd-develop.yml');
const deployProductionWorkflow = await read('.github/workflows/cd-production.yml');
const maintenanceWorkflow = await read('.github/workflows/maintenance.yml');
const releaseWorkflow = await read('.github/workflows/release-please.yml');
const securityPolicy = await read('SECURITY.md');
const operationsGuide = await read('docs/operations.md');
const packageJson = JSON.parse(await read('package.json'));
const siteConfig = await read('src/data/site.config.ts');
const socialLinks = await read('src/data/social-links.ts');
const weeklyProjects = await read('src/data/weekly-project.ts');

const workflowFiles = await readdir(join(repositoryRoot, '.github/workflows'));
const workflowContents = await Promise.all(
	workflowFiles.map(file => read(`.github/workflows/${file}`))
);

describe('maintenance and security contract', () => {
	test('groups dependency updates onto develop with bounded PR volume', () => {
		expect(dependabot).toContain('package-ecosystem: npm');
		expect(dependabot).toContain('package-ecosystem: github-actions');
		expect(dependabot).toContain('package-ecosystem: devcontainers');
		expect(dependabot.match(/target-branch: develop/g)).toHaveLength(3);
		expect(dependabot).toContain('routine-dependencies:');
		expect(dependabot).toContain('major-dependencies:');
		expect(dependabot).toContain('open-pull-requests-limit: 2');
		expect(dependabot.match(/open-pull-requests-limit: 1/g)).toHaveLength(2);
	});

	test('runs link validation in CI and on a recurring schedule', () => {
		expect(packageJson.scripts['check:links']).toBe('node scripts/check-links.mjs');
		expect(packageJson.scripts['validate:quality']).toContain('bun run check:links');
		expect(ciWorkflow).toContain('name: Link check');
		expect(ciWorkflow).toContain('run: bun run check:links');
		expect(maintenanceWorkflow).toContain("cron: '0 14 * * 1'");
		expect(maintenanceWorkflow).toContain('workflow_dispatch:');
		expect(maintenanceWorkflow).toContain('run: node scripts/check-links.mjs');
	});

	test('skips deployment and release workflows for non-runtime changes', () => {
		for (const workflow of [deployDevelopWorkflow, deployProductionWorkflow, releaseWorkflow]) {
			expect(workflow).toContain('paths-ignore:');
			expect(workflow).toContain("'.agents/**'");
			expect(workflow).toContain("'.vscode/**'");
			expect(workflow).toContain("'.vercel/**'");
			expect(workflow).toContain("'docs/**'");
			expect(workflow).toContain("'**.md'");
		}
	});

	test('provides a private security channel and avoids public disclosure instructions', () => {
		expect(securityPolicy).toContain('hello@sandovaldavid.com');
		expect(securityPolicy).toContain('Do not open a public issue');
		expect(securityPolicy).toContain('Coordinated disclosure');
		expect(securityPolicy).toContain('current production version on `main`');
	});

	test('keeps the current CodeQL and license decisions in the operations runbook', () => {
		expect(workflowFiles.some(file => /codeql/iu.test(file))).toBe(false);
		expect(workflowContents.some(content => /github\/codeql-action/iu.test(content))).toBe(false);
		expect(operationsGuide).toContain('CodeQL is intentionally not configured');
		expect(operationsGuide).toContain('Re-evaluate that decision');
		expect(operationsGuide).toContain('no `LICENSE` file');
	});

	test('centralizes approved public social URLs and does not expose the historical private repository', () => {
		expect(siteConfig).toContain('socialUrls:');
		expect(siteConfig).not.toContain('calendlyUrl');
		expect(socialLinks).toContain('siteConfig.socialUrls.linkedin');
		expect(socialLinks).toContain('siteConfig.socialUrls.twitter');
		expect(socialLinks).toContain('siteConfig.socialUrls.instagram');
		expect(socialLinks).not.toMatch(/siteConfig\.socialUrls\.(?:facebook|youtube|tiktok)/);
		expect(weeklyProjects).not.toContain("githubUrl: 'https://github.com/sandovaldavid/linktree'");
	});
});
