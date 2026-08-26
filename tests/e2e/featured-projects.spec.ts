import { expect, test } from '@playwright/test';

for (const route of [
	{
		path: '/',
		heading: 'Featured projects',
		problem: 'Problem',
		contribution: 'My contribution',
		outcome: 'Outcome',
		kiokuTitle: 'Kioku · Persistent memory for AI agents',
		yukidokeTitle: 'Yukidoke · Household personal-finance product',
		ociTitle: 'OCI ARM Hunter · Oracle Cloud capacity automation',
		projectSite: 'Project site',
		projectUnavailable: 'No public project site',
		privateRepository: 'Private repo',
	},
	{
		path: '/es/',
		heading: 'Proyectos destacados',
		problem: 'Problema',
		contribution: 'Mi contribución',
		outcome: 'Resultado',
		kiokuTitle: 'Kioku · Memoria persistente para agentes de IA',
		yukidokeTitle: 'Yukidoke · Producto de finanzas personales para hogares',
		ociTitle: 'OCI ARM Hunter · Automatización de capacidad en Oracle Cloud',
		projectSite: 'Sitio del proyecto',
		projectUnavailable: 'Sin sitio público del proyecto',
		privateRepository: 'Repo privado',
	},
]) {
	test.describe(`featured projects for ${route.path}`, () => {
		test.beforeEach(async ({ page }) => {
			await page.goto(route.path);
		});

		test('shows the three selected evidence-based projects, without the Hub self-card', async ({
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

		test('exposes public project evidence and explicit private states', async ({ page }) => {
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

			await expect(yukidokeCard.getByText(route.projectUnavailable, { exact: true })).toBeVisible();
			await expect(yukidokeCard.getByText(route.privateRepository, { exact: true })).toBeVisible();
		});
	});
}
