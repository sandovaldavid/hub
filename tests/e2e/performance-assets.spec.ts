import { expect, test } from '@playwright/test';

for (const path of ['/', '/es/']) {
	test.describe(`performance assets for ${path}`, () => {
		test.beforeEach(async ({ page }) => {
			await page.goto(path);
		});

		test('does not request external font stylesheets', async ({ page }) => {
			await expect(page.locator('link[href*="fonts.googleapis.com"]')).toHaveCount(0);
			await expect(page.locator('link[href*="fonts.gstatic.com"]')).toHaveCount(0);
		});

		test('visible images declare intrinsic dimensions', async ({ page }) => {
			const images = page.locator('img:visible');
			const count = await images.count();
			expect(count).toBeGreaterThan(0);

			for (let index = 0; index < count; index++) {
				const image = images.nth(index);
				await expect(image).toHaveAttribute('width', /^[1-9]\d*$/);
				await expect(image).toHaveAttribute('height', /^[1-9]\d*$/);
			}
		});

		test('prioritizes only the above-the-fold profile image', async ({ page }) => {
			const highPriorityImages = page.locator('img[fetchpriority="high"]');
			await expect(highPriorityImages).toHaveCount(1);
			await expect(highPriorityImages).toHaveAttribute('loading', 'eager');
		});
	});
}
