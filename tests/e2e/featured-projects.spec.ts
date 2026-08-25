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
		privateRepository: 'Repo privado',
	},
]) {
	test.describe(`featured projects for ${route.path}`, () => {
		test.beforeEach(async ({ page }) => {
			await page.goto(route.path);
		});

		test('shows only evidence-based projects, without the Hub self-card', async ({ page }) => {
			const sectionHeading = page.locator('#featured-projects-title');
			await expect(sectionHeading).toBeVisible();
			await expect(sectionHeading).toHaveText(route.heading);

			const cards = page.locator('.featured-project-card');
			await expect(cards).toHaveCount(2);
			await expect(cards.first()).toContainText(route.problem);
			await expect(cards.first()).toContainText(route.contribution);
			await expect(cards.first()).toContainText(route.outcome);
		});

		test('exposes valid links and explicit unavailable states', async ({ page }) => {
			const cardFor = (title: string) =>
				page.locator('.featured-project-card').filter({
					has: page.getByRole('heading', { name: title, exact: true }),
				});

			const kiokuCard = cardFor(route.kiokuTitle);
			const yukidokeCard = cardFor(route.yukidokeTitle);

			await expect(kiokuCard.getByRole('link', { name: /Repository|Repositorio/ })).toHaveAttribute(
				'href',
				'https://github.com/sandovaldavid/kioku'
			);
			await expect(yukidokeCard.getByText(route.privateRepository, { exact: true })).toBeVisible();
		});
	});
}
