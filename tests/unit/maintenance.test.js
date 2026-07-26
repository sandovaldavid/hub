import { describe, expect, test } from 'bun:test';
import { readFile, readdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = join(dirname(fileURLToPath(import.meta.url)), '../..');
const read = path => readFile(join(repositoryRoot, path), 'utf8');

const dependabot = await read('.github/dependabot.yml');
const ciWorkflow = await read('.github/workflows/ci.yml');
const maintenanceWorkflow = await read('.github/workflows/maintenance.yml');
const securityPolicy = await read('SECURITY.md');
const maintenanceGuide = await read('docs/maintenance.md');
const linkConfig = JSON.parse(await read('config/link-check.json'));
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
		expect(dependabot).toContain('github-actions:');
		expect(dependabot).toContain('devcontainer-features:');
		expect(dependabot).toContain('open-pull-requests-limit: 2');
		expect(dependabot.match(/open-pull-requests-limit: 1/g)).toHaveLength(2);
	});

	test('runs link validation in the required quality context and on a weekly schedule', () => {
		expect(packageJson.scripts['check:links']).toBe('node scripts/check-links.mjs');
		expect(packageJson.scripts['validate:quality']).toContain('bun run check:links');
		expect(ciWorkflow).toContain('name: Link check');
		expect(ciWorkflow).toContain('run: bun run check:links');
		expect(maintenanceWorkflow).toContain("cron: '0 14 * * 1'");
		expect(maintenanceWorkflow).toContain('workflow_dispatch:');
		expect(maintenanceWorkflow).toContain('run: node scripts/check-links.mjs');
	});

	test('documents every ignored external URL with a reason', () => {
		for (const entry of linkConfig.ignoredExternalUrls) {
			expect(entry.pattern.trim().length).toBeGreaterThan(0);
			expect(entry.reason.trim().length).toBeGreaterThan(0);
		}
	});

	test('provides a private security channel and avoids public disclosure instructions', () => {
		expect(securityPolicy).toContain('hello@sandovaldavid.com');
		expect(securityPolicy).not.toContain('contact@sandovaldavid.com');
		expect(securityPolicy).toContain('Do not open a public issue');
		expect(securityPolicy).toContain('Coordinated disclosure');
		expect(securityPolicy).toContain('current production version on `main`');
	});

	test('does not add CodeQL without a documented change in risk profile', () => {
		expect(workflowFiles.some(file => /codeql/iu.test(file))).toBe(false);
		expect(workflowContents.some(content => /github\/codeql-action/iu.test(content))).toBe(false);
		expect(maintenanceGuide).toContain('CodeQL is intentionally not added');
		expect(maintenanceGuide).toContain('Re-evaluate CodeQL');
	});

	test('records the no-license posture and a recurring content review', () => {
		expect(maintenanceGuide).toContain('## License and notice posture');
		expect(maintenanceGuide).toContain('no `LICENSE` file');
		expect(maintenanceGuide).toContain('### Monthly content review');
		expect(maintenanceGuide).toContain('### Quarterly engineering review');
	});

	test('centralizes approved public social URLs and does not expose the private linktree repository', () => {
		expect(siteConfig).toContain('socialUrls:');
		expect(siteConfig).not.toContain('calendlyUrl');
		expect(socialLinks).toContain('siteConfig.socialUrls.linkedin');
		expect(socialLinks).toContain('siteConfig.socialUrls.twitter');
		expect(socialLinks).toContain('siteConfig.socialUrls.instagram');
		expect(socialLinks).not.toMatch(/siteConfig\.socialUrls\.(?:facebook|youtube|tiktok)/);
		expect(weeklyProjects).not.toContain("githubUrl: 'https://github.com/sandovaldavid/linktree'");
	});
});
