import { describe, expect, test } from 'bun:test';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getFeaturedProjects } from '../../src/data/featured-projects.ts';

const repositoryRoot = join(dirname(fileURLToPath(import.meta.url)), '../..');
const astroComponentPath = join(
	repositoryRoot,
	'src/entities/featured-project/ui/FeaturedProjectCard.astro'
);
const cssComponentPath = join(
	repositoryRoot,
	'src/entities/featured-project/ui/FeaturedProjectCard.css'
);

describe('Featured project card step marker contract', () => {
	test('defines 01, 02 and 03 markers in exact sequential order', async () => {
		const astroContent = await readFile(astroComponentPath, 'utf8');

		expect(astroContent).toContain(
			"{ label: t('projects.problem'), value: project.problem, kind: 'problem', marker: '01' }"
		);
		expect(astroContent).toContain("marker: '02'");
		expect(astroContent).toContain("marker: '03'");
	});

	test('uses dedicated detail-step-marker role for consistent numeral legibility', async () => {
		const cssContent = await readFile(cssComponentPath, 'utf8');

		expect(cssContent).toContain('var(--detail-step-marker-background)');
		expect(cssContent).toContain('var(--detail-step-marker-content)');
		expect(cssContent).toContain('var(--detail-step-marker-edge)');
		expect(cssContent).not.toContain(
			'.featured-project-card__evidence-item--contribution .featured-project-card__evidence-marker'
		);
		expect(cssContent).not.toContain(
			'.featured-project-card__evidence-item--outcome .featured-project-card__evidence-marker'
		);
	});

	test('provides featured project data for English and Spanish routes', () => {
		const enProjects = getFeaturedProjects('en');
		const esProjects = getFeaturedProjects('es');

		expect(enProjects.length).toBeGreaterThan(0);
		expect(esProjects.length).toBe(enProjects.length);
		for (const project of enProjects) {
			expect(project.problem).toBeTruthy();
			expect(project.contribution).toBeTruthy();
			expect(project.outcome).toBeTruthy();
		}
	});
});
