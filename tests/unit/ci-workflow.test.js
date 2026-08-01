import { describe, expect, test } from 'bun:test';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = join(dirname(fileURLToPath(import.meta.url)), '../..');
const workflow = await readFile(join(repositoryRoot, '.github/workflows/ci.yml'), 'utf8');
const lighthouseConfig = await readFile(join(repositoryRoot, '.lighthouserc.cjs'), 'utf8');
const playwrightConfig = await readFile(join(repositoryRoot, 'playwright.config.ts'), 'utf8');
const responsiveLayoutTest = await readFile(
	join(repositoryRoot, 'tests/e2e/desktop-layout.spec.ts'),
	'utf8'
);
const heroAlignmentTest = await readFile(
	join(repositoryRoot, 'tests/e2e/hero-alignment.spec.ts'),
	'utf8'
);
const ctaSource = await readFile(join(repositoryRoot, 'src/data/cta.ts'), 'utf8');
const ctaComponent = await readFile(
	join(repositoryRoot, 'src/widgets/cta-section/ui/CTAButtons.astro'),
	'utf8'
);
const heroComponent = await readFile(
	join(repositoryRoot, 'src/widgets/hero-section/ui/HeroCard.astro'),
	'utf8'
);
const heroStyles = await readFile(
	join(repositoryRoot, 'src/widgets/hero-section/ui/HeroCard.css'),
	'utf8'
);
const projectSection = await readFile(
	join(repositoryRoot, 'src/widgets/weekly-project-section/ui/WeeklyProjectSection.astro'),
	'utf8'
);
const projectSectionStyles = await readFile(
	join(repositoryRoot, 'src/widgets/weekly-project-section/ui/WeeklyProjectSection.css'),
	'utf8'
);
const packageJson = JSON.parse(await readFile(join(repositoryRoot, 'package.json'), 'utf8'));

describe('CI workflow contract', () => {
	test('skips heavy checks for non-runtime-only changes', () => {
		expect(workflow).toContain('name: Detect runtime changes');
		expect(workflow).toContain('.agents/*|.vscode/*|.vercel/*|docs/*|*.md|.gitignore');
		expect(workflow).toContain('git diff --name-only');
		expect(workflow).toContain('needs: changes');
		expect(workflow).toContain("if: ${{ needs.changes.outputs.runtime == 'true' }}");
	});

	test('caches Bun packages and Playwright browsers by lockfile', () => {
		expect(workflow).toContain('actions/cache@0057852bfaa89a56745cba8c7296529d2fc39830');
		expect(workflow).toContain('path: ~/.bun/install/cache');
		expect(workflow).toContain('path: ~/.cache/ms-playwright');
		expect(workflow).toContain("hashFiles('package.json', 'bun.lock')");
	});

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

	test('keeps functional results separate from report artifacts', () => {
		expect(workflow).toContain('name: Upload Playwright report');
		expect(workflow).not.toMatch(/^\s+publish[^:]*:/m);
		expect(workflow).not.toMatch(/uses: .*pages/u);
		expect(workflow).not.toContain('github.io');
		expect(workflow).not.toContain('contents: write');
		expect(workflow).not.toContain('continue-on-error: true');
		expect(workflow).not.toContain('LHCI_GITHUB_APP_TOKEN');
	});

	test('uploads a generated report after failure but not after cancellation', () => {
		expect(workflow).toContain('if: ${{ !cancelled() }}');
		expect(workflow).toContain("!cancelled() && steps.detect_report.outputs.available == 'true'");
		expect(workflow).not.toContain('report_available');
		expect(workflow).not.toContain('if: always()');
	});

	test('uses the canonical Bun executable command instead of the optional bunx alias', () => {
		expect(workflow).toContain('run: bun x astro check');
		expect(workflow).toContain('run: bun x playwright install --with-deps chromium');
		expect(workflow).not.toContain('bunx ');
		expect(packageJson.scripts['validate:quality']).toContain('bun x astro check');
		expect(packageJson.scripts['validate:quality']).not.toContain('bunx ');
	});

	test('runs link health inside the required quality context', () => {
		expect(workflow).toContain('name: Link check');
		expect(workflow).toContain('run: bun run check:links');
		expect(packageJson.scripts['validate:quality']).toContain('bun run check:links');
	});

	test('installs and resolves Chromium for E2E and Lighthouse', () => {
		expect(workflow.match(/run: bun x playwright install --with-deps chromium/g)).toHaveLength(2);
		expect(lighthouseConfig).toContain("const { chromium } = require('@playwright/test');");
		expect(lighthouseConfig).toContain('process.env.CHROME_PATH || chromium.executablePath()');
	});

	test('serves current source locally and the production build in CI', () => {
		expect(playwrightConfig).toContain(
			"command: process.env.CI ? 'bun run preview' : 'bun run dev'"
		);
		expect(packageJson.scripts['validate:local']).toContain('CI=1 bun run test:e2e');
	});

	test('covers the production layout across desktop and iPhone viewports', () => {
		expect(responsiveLayoutTest).toContain('iPhone 12 Pro');
		expect(responsiveLayoutTest).toContain('{ width: 390, height: 844 }');
		expect(responsiveLayoutTest).toContain('{ width: 1024, height: 768 }');
		expect(responsiveLayoutTest).toContain('{ width: 1280, height: 720 }');
		expect(responsiveLayoutTest).toContain('{ width: 1920, height: 1080 }');
		expect(responsiveLayoutTest).toContain('expect(actionRowCount).toBe(2)');
		expect(responsiveLayoutTest).toContain('expect(mobileSocialRows).toBe(2)');
		expect(responsiveLayoutTest).toContain('expect(firstSkillRowCount).toBe(4)');
	});

	test('keeps resume download unique while preserving the GitHub professional action', () => {
		expect(ctaSource).not.toContain("id: 'resume'");
		expect(ctaSource).toContain("id: 'github'");
		expect(ctaSource).toContain("id: 'projects'");
		expect(ctaSource).toContain("href: '#featured-projects-title'");
		expect(ctaComponent).toContain("projects: 'featured_projects_viewed'");
		expect(ctaComponent).toContain("github: 'github_opened'");
		expect(heroComponent).not.toContain('hero-card__username');
		expect(heroComponent).toContain("size={isCompact ? '3xl' : '4xl'}");
		expect(heroComponent).toContain('hero-card__primary-action--mobile-only');
		expect(heroStyles).toContain('.hero-card__primary-action--mobile-only');
		expect(responsiveLayoutTest).toContain('await expect(resumeAction).toBeHidden()');
		expect(heroAlignmentTest).toContain(
			"await expect(page.locator('.hero-card__primary-action--mobile-only')).toBeVisible()"
		);
	});

	test('gives the featured-project icon an explicit semantic theme color', () => {
		expect(projectSection).toContain('weekly-project-section__icon');
		expect(projectSectionStyles).toContain('color: var(--channel-accent-primary);');
		expect(projectSectionStyles).not.toMatch(/(?:dark:)?text-primary-\d{2,3}/);
		expect(responsiveLayoutTest).toContain("projectsIconColor).not.toBe('rgb(255, 255, 255)')");
	});

	test('aligns the Lighthouse engine and Node runtime with Chromium 149', () => {
		expect(packageJson.devDependencies.lighthouse).toBe('13.4.1');
		expect(packageJson.overrides.lighthouse).toBe('13.4.1');
		expect(packageJson.engines.node).toBe('>=22.19.0');
		expect(workflow).toContain('NODE_VERSION: 22.19.0');
		expect(workflow).toContain(
			'actions/setup-node@820762786026740c76f36085b0efc47a31fe5020 # v7.0.0'
		);
		expect(workflow).toContain('node-version: ${{ env.NODE_VERSION }}');
	});

	test('applies DevTools throttling for reproducible performance scores', () => {
		expect(lighthouseConfig).toContain("'categories:performance': ['error', { minScore: 0.9 }]");
		expect(lighthouseConfig).toContain("throttlingMethod: 'devtools'");
		expect(lighthouseConfig).toContain('numberOfRuns: 3');
	});

	test('defines a local validation equivalent and both Lighthouse profiles', () => {
		expect(packageJson.scripts['validate:local']).toContain('CI=1 bun run test:e2e');
		expect(packageJson.scripts['test:lighthouse']).toContain('test:lighthouse:mobile');
		expect(packageJson.scripts['test:lighthouse']).toContain('test:lighthouse:desktop');
	});
});
