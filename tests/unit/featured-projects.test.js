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

describe('Featured project card compact-routing contract', () => {
	test('renders one concise project summary instead of mini case-study evidence blocks', async () => {
		const astroContent = await readFile(astroComponentPath, 'utf8');

		expect(astroContent).toContain('{project.summary}');
		expect(astroContent).toContain('featured-project-card__summary');
		expect(astroContent).not.toContain('data-project-evidence');
		expect(astroContent).not.toContain("t('projects.problem')");
		expect(astroContent).not.toContain("t('projects.contribution')");
		expect(astroContent).not.toContain("t('projects.outcome')");
		expect(astroContent).not.toContain('project.technologies');
		expect(astroContent).not.toContain('project.status');
	});

	test('keeps compact cards readable without technology or step-marker decoration', async () => {
		const cssContent = await readFile(cssComponentPath, 'utf8');

		expect(cssContent).toContain('.featured-project-card__summary');
		expect(cssContent).not.toContain('.featured-project-card__evidence');
		expect(cssContent).not.toContain('.featured-project-card__technologies');
		expect(cssContent).not.toContain('.featured-project-card__tech-badge');
		expect(cssContent).not.toContain('.featured-project-card__evidence-marker');
	});

	test('provides concise featured project data for English and Spanish routes', () => {
		const enProjects = getFeaturedProjects('en');
		const esProjects = getFeaturedProjects('es');

		expect(enProjects.length).toBe(3);
		expect(esProjects.length).toBe(enProjects.length);
		for (const project of [...enProjects, ...esProjects]) {
			expect(project.summary).toBeTruthy();
			expect(project.summary.length).toBeLessThan(230);
		}
	});
});
