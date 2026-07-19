import { expect, test } from '@playwright/test';

for (const route of [
	{
		path: '/',
		heading: 'Featured projects',
		problem: 'Problem',
		contribution: 'My contribution',
		outcome: 'Outcome',
		privateRepository: 'Private repository',
	},
	{
		path: '/es/',
		heading: 'Proyectos destacados',
		problem: 'Problema',
		contribution: 'Mi contribución',
		outcome: 'Resultado',
		privateRepository: 'Repositorio privado',
	},
]) {
	test.describe(`featured projects for ${route.path}`, () => {
		test.beforeEach(async ({ page }) => {
			await page.goto(route.path);
		});

		test('shows no more than three evidence-based projects', async ({ page }) => {
			await expect(page.getByRole('heading', { name: route.heading })).toBeVisible();

			const cards = page.locator('.weekly-project-card');
			await expect(cards).toHaveCount(3);
			await expect(cards.first()).toContainText(route.problem);
			await expect(cards.first()).toContainText(route.contribution);
			await expect(cards.first()).toContainText(route.outcome);
		});

		test('exposes valid links and explicit unavailable states', async ({ page }) => {
			await expect(
				page.getByRole('link', { name: /Kioku|Repository|Repositorio/ }).first()
			).toHaveAttribute('href', 'https://github.com/sandovaldavid/kioku');
			await expect(page.getByText(route.privateRepository, { exact: true })).toBeVisible();
			await expect(page.getByRole('link', { name: /Live demo|Demo/ })).toHaveAttribute(
				'href',
				'https://linktree.sandovaldavid.com'
			);
		});
	});
}
