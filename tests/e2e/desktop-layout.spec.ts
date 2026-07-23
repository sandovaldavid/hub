import { expect, test } from '@playwright/test';

const routes = ['/', '/es/'] as const;
const desktopViewports = [
	{ width: 1024, height: 768 },
	{ width: 1280, height: 720 },
	{ width: 1920, height: 1080 },
] as const;

for (const route of routes) {
	test.describe(`desktop layout for ${route}`, () => {
		test('keeps hierarchy balanced without horizontal overflow', async ({ page }) => {
			await page.emulateMedia({ reducedMotion: 'reduce' });

			for (const viewport of desktopViewports) {
				await page.setViewportSize(viewport);
				await page.goto(route);

				const main = page.locator('#main-content');
				await expect(main).toBeVisible();

				const overflow = await page.locator('html').evaluate(element => ({
					clientWidth: element.clientWidth,
					scrollWidth: element.scrollWidth,
				}));
				expect(
					overflow.scrollWidth,
					`${route} must not overflow horizontally at ${viewport.width}px`
				).toBeLessThanOrEqual(overflow.clientWidth);

				const socialItems = page.locator('.social-grid__item');
				await expect(socialItems).toHaveCount(5);
				const socialBoxes = await socialItems.evaluateAll(elements =>
					elements.map(element => {
						const box = element.getBoundingClientRect();
						return { height: box.height, width: box.width };
					})
				);
				const socialHeights = socialBoxes.map(box => box.height);
				expect(Math.max(...socialHeights) - Math.min(...socialHeights)).toBeLessThanOrEqual(2);
				expect(socialBoxes.at(-1)?.width ?? 0).toBeGreaterThan(socialBoxes[0].width * 1.8);

				const primaryActions = page.locator('[data-layout-column="primary-actions"]');
				const contact = page.locator('[data-layout-column="contact"]');
				const [primaryBox, contactBox] = await Promise.all([
					primaryActions.boundingBox(),
					contact.boundingBox(),
				]);
				expect(primaryBox).not.toBeNull();
				expect(contactBox).not.toBeNull();
				expect(Math.abs((primaryBox?.y ?? 0) - (contactBox?.y ?? 0))).toBeLessThanOrEqual(2);
				expect(Math.abs((primaryBox?.height ?? 0) - (contactBox?.height ?? 0))).toBeLessThanOrEqual(
					2
				);

				const skillRowCount = await page.locator('[data-skill-item]').evaluateAll(elements => {
					const rowPositions = elements.map(element =>
						Math.round(element.getBoundingClientRect().top)
					);
					return new Set(rowPositions).size;
				});
				expect(skillRowCount).toBeGreaterThan(1);
			}
		});
	});
}
