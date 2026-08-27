import { expect, test } from '@playwright/test';

for (const route of [
	{
		path: '/',
		heading: 'Featured projects',
		problem: 'Problem',
		contribution: 'My contribution',
		outcome: 'Outcome',
		kiokuTitle: 'Kioku · Persistent memory for AI agents',
		yukidokeTitle: 'Yukidoke · Household finance platform',
		ociTitle: 'OCI ARM Hunter · Oracle Cloud capacity automation',
		projectSite: 'Project site',
		caseStudy: 'View case study',
		caseStudyUrl: 'https://sandovaldavid.com/projects/yukidoke',
		privateProject: 'Private project',
	},
	{
		path: '/es/',
		heading: 'Proyectos destacados',
		problem: 'Problema',
		contribution: 'Mi contribución',
		outcome: 'Resultado',
		kiokuTitle: 'Kioku · Memoria persistente para agentes de IA',
		yukidokeTitle: 'Yukidoke · Plataforma financiera para hogares',
		ociTitle: 'OCI ARM Hunter · Automatización de capacidad en Oracle Cloud',
		projectSite: 'Sitio del proyecto',
		caseStudy: 'Ver caso de estudio',
		caseStudyUrl: 'https://sandovaldavid.com/es/projects/yukidoke',
		privateProject: 'Proyecto privado',
	},
]) {
	test.describe(`featured projects for ${route.path}`, () => {
		test.beforeEach(async ({ page }) => {
			await page.goto(route.path);
		});

		test('shows the three selected projects, without turning the Hub into a second portfolio', async ({
			page,
		}) => {
			const sectionHeading = page.locator('#featured-projects-title');
			await expect(sectionHeading).toBeVisible();
			await expect(sectionHeading).toHaveText(route.heading);

			const cards = page.locator('.featured-project-card');
			await expect(cards).toHaveCount(3);
			await expect(cards.first()).toContainText(route.problem);
			await expect(cards.first()).toContainText(route.contribution);
			await expect(cards.first()).toContainText(route.outcome);
		});

		test('routes public work to useful destinations while preserving private-project boundaries', async ({
			page,
		}) => {
			const cardFor = (title: string) =>
				page.locator('.featured-project-card').filter({
					has: page.getByRole('heading', { name: title, exact: true }),
				});

			const kiokuCard = cardFor(route.kiokuTitle);
			const yukidokeCard = cardFor(route.yukidokeTitle);
			const ociCard = cardFor(route.ociTitle);

			await expect(kiokuCard.getByRole('link', { name: route.projectSite })).toHaveAttribute(
				'href',
				'https://kioku.sandovaldavid.com'
			);
			await expect(kiokuCard.getByRole('link', { name: /Repository|Repositorio/ })).toHaveAttribute(
				'href',
				'https://github.com/sandovaldavid/kioku'
			);

			await expect(ociCard.getByRole('link', { name: route.projectSite })).toHaveAttribute(
				'href',
				'https://oci.sandovaldavid.com'
			);
			await expect(ociCard.getByRole('link', { name: /Repository|Repositorio/ })).toHaveAttribute(
				'href',
				'https://github.com/sandovaldavid/oci-arm-hunter'
			);

			await expect(yukidokeCard.getByText(route.privateProject, { exact: true })).toBeVisible();
			await expect(yukidokeCard.getByRole('link', { name: route.caseStudy })).toHaveAttribute(
				'href',
				route.caseStudyUrl
			);
			await expect(yukidokeCard.getByRole('link', { name: /Repository|Repositorio/ })).toHaveCount(
				0
			);
			await expect(yukidokeCard.getByRole('link', { name: route.projectSite })).toHaveCount(0);
		});
	});
}
