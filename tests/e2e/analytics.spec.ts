import { expect, test } from '@playwright/test';

for (const route of ['/', '/es/']) {
	test.describe(`conversion analytics for ${route}`, () => {
		test.beforeEach(async ({ page }) => {
			await page.goto(route);
		});

		test('instruments every primary conversion CTA', async ({ page }) => {
			const expectedEvents = [
				'resume_downloaded',
				'portfolio_opened',
				'github_opened',
				'linkedin_opened',
				'project_opened',
				'contact_clicked',
			];

			for (const eventName of expectedEvents) {
				await expect(page.locator(`[data-conversion-event="${eventName}"]`).first()).toBeAttached();
			}
		});

		test('uses only allow-listed non-personal metadata', async ({ page }) => {
			const tracked = page.locator('[data-conversion-event]');
			expect(await tracked.count()).toBeGreaterThan(0);

			for (let index = 0; index < (await tracked.count()); index++) {
				const attributes = await tracked.nth(index).evaluate(element =>
					Array.from(element.attributes).reduce<Record<string, string>>((result, attribute) => {
						if (attribute.name.startsWith('data-conversion-')) result[attribute.name] = attribute.value;
						return result;
					}, {})
				);

				expect(Object.keys(attributes).sort()).toEqual(
					expect.arrayContaining(['data-conversion-event', 'data-conversion-position'])
				);
				const serialized = JSON.stringify(attributes);
				expect(serialized).not.toMatch(/mailto:|@|\+51|https?:\/\//i);
			}
		});

		test('does not intercept or block navigation', async ({ page }) => {
			const portfolio = page.locator('[data-conversion-event="portfolio_opened"]').first();
			await expect(portfolio).toHaveAttribute('target', '_blank');
			await expect(portfolio).toHaveAttribute('rel', /noopener/);
		});
	});
}
