import { expect, test } from '@playwright/test';

for (const route of [
	{
		path: '/',
		heading: 'Featured projects',
		problem: 'Problem',
		contribution: 'My contribution',
		outcome: 'Outcome',
		kiokuTitle: 'Kioku · Persistent memory for AI agents',
		yukidokeTitle: 'Yukidoke · Financial health platform',
		hubTitle: 'Professional engineering hub',
		privateRepository: 'Private repo',
	},
	{
		path: '/es/',
		heading: 'Proyectos destacados',
		problem: 'Problema',
		contribution: 'Mi contribución',
		outcome: 'Resultado',
		kiokuTitle: 'Kioku · Memoria persistente para agentes de IA',
		yukidokeTitle: 'Yukidoke · Plataforma de salud financiera',
		hubTitle: 'Hub profesional de ingeniería',
		privateRepository: 'Repo privado',
	},
]) {
	test.describe(`featured projects for ${route.path}`, () => {
		test.beforeEach(async ({ page }) => {
			await page.goto(route.path);
		});

		test('shows no more than three evidence-based projects', async ({ page }) => {
			const sectionHeading = page.locator('#featured-projects-title');
			await expect(sectionHeading).toBeVisible();
			await expect(sectionHeading).toHaveText(route.heading);

			const cards = page.locator('.weekly-project-card');
			await expect(cards).toHaveCount(3);
			await expect(cards.first()).toContainText(route.problem);
			await expect(cards.first()).toContainText(route.contribution);
			await expect(cards.first()).toContainText(route.outcome);
		});

		test('exposes valid links and explicit unavailable states', async ({ page }) => {
			const cardFor = (title: string) =>
				page.locator('.weekly-project-card').filter({
					has: page.getByRole('heading', { name: title, exact: true }),
				});

			const kiokuCard = cardFor(route.kiokuTitle);
			const yukidokeCard = cardFor(route.yukidokeTitle);
			const hubCard = cardFor(route.hubTitle);

			await expect(kiokuCard.getByRole('link', { name: /Repository|Repositorio/ })).toHaveAttribute(
				'href',
				'https://github.com/sandovaldavid/kioku'
			);
			await expect(yukidokeCard.getByText(route.privateRepository, { exact: true })).toBeVisible();
			await expect(hubCard.getByText(route.privateRepository, { exact: true })).toBeVisible();
			await expect(hubCard.getByRole('link', { name: /Live demo|Demo/ })).toHaveAttribute(
				'href',
				'https://hub.sandovaldavid.com'
			);
		});
	});
}
