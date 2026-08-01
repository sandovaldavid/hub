import { describe, expect, test } from 'bun:test';
import { access, readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = join(dirname(fileURLToPath(import.meta.url)), '../..');
const readme = await readFile(join(repositoryRoot, 'README.md'), 'utf8');
const packageJson = JSON.parse(await readFile(join(repositoryRoot, 'package.json'), 'utf8'));
const astroConfig = await readFile(join(repositoryRoot, 'astro.config.mjs'), 'utf8');
const siteConfig = await readFile(join(repositoryRoot, 'src/data/site.config.ts'), 'utf8');
const layout = await readFile(join(repositoryRoot, 'src/app/layouts/Layout.astro'), 'utf8');

const productionUrl = 'https://hub.sandovaldavid.com';
const previewPath = join(repositoryRoot, 'public/og/og-image.png');

describe('README contract', () => {
	test('states the product purpose and production destination in the opening block', () => {
		const openingBlock = readme.split('\n').slice(0, 12).join('\n');

		expect(openingBlock).toContain('Professional Link Hub');
		expect(openingBlock).toContain('recruiters, clients and collaborators');
		expect(openingBlock).toContain(productionUrl);
		expect(astroConfig).toContain(`site: '${productionUrl}'`);
		expect(siteConfig).toContain(`url: '${productionUrl}'`);
	});

	test('links a versioned visual preview to production', async () => {
		await access(previewPath);

		expect(readme).toContain('[![Current production preview](public/og/og-image.png)]');
		expect(readme).toContain(`](${productionUrl})`);
	});

	test('does not make absolute accessibility, performance, or CI claims', () => {
		const forbiddenClaims = [
			'Fully compliant with WCAG 2.1 AA',
			'Performance & Quality Assured',
			'complete CI/CD pipeline',
			'guaranteed performance',
		];

		for (const claim of forbiddenClaims) {
			expect(readme).not.toContain(claim);
		}

		expect(readme).toContain('targets WCAG 2.1 AA practices');
		expect(readme).toContain('does not claim formal conformance certification');
		expect(readme).toContain('is **not** treated as successful validation');
	});

	test('explains the Astro decision and the browser JavaScript boundary', () => {
		expect(readme).toContain('## Why Astro');
		expect(readme).toContain('without hydrating React, Vue or Svelte islands');
		expect(readme).toContain('src/features/theme-toggle');
		expect(readme).toContain('src/features/share-button');
		expect(readme).toContain('src/shared/analytics/conversion.ts');
		expect(layout).toContain('getThemeInitScript');
		expect(layout).toContain('initConversionAnalytics');
		expect(layout).toContain('<Analytics />');
	});

	test('documents commands that exist in package.json', () => {
		const documentedCommands = [
			'dev',
			'build',
			'check:architecture',
			'check:links',
			'format:check',
			'lint',
			'test:unit',
			'test:e2e',
			'test:e2e:show-report',
			'test:lighthouse',
			'validate:quality',
			'validate:local',
			'rulesets:plan',
			'rulesets:verify',
		];

		for (const command of documentedCommands) {
			expect(packageJson.scripts[command]).toBeDefined();
			expect(readme).toContain(`\`bun run ${command}\``);
		}
	});

	test('documents the slim repository documentation surface and historical alias', () => {
		expect(readme).toContain('docs/architecture.md');
		expect(readme).toContain('docs/operations.md');
		expect(readme).toContain('historically named `linktree`');
		expect(readme).toContain(
			'Decisions, alternatives, audits, notes, plans and historical handoffs belong in Cortex-L7'
		);
	});

	test('describes rulesets as desired state until live enforcement is verified', () => {
		expect(readme).toContain('Desired rulesets are versioned');
		expect(readme).toContain('live enforcement must be verified in GitHub');
		expect(readme).not.toContain('rulesets are active');
	});
});
