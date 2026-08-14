import { expect, test } from '@playwright/test';

const locales = [
	{ path: '/', alt: 'Portrait of David Sandoval' },
	{ path: '/es/', alt: 'Retrato de David Sandoval' },
] as const;

const viewports = [
	{ width: 390, height: 844 },
	{ width: 834, height: 1112 },
	{ width: 1440, height: 1000 },
] as const;

for (const locale of locales) {
	test(`${locale.path} keeps approved portrait across target viewports`, async ({ page }) => {
		for (const viewport of viewports) {
			await page.setViewportSize(viewport);
			await page.goto(locale.path);

			const portrait = page.getByRole('img', { name: locale.alt, exact: true });
			await expect(portrait).toBeVisible();

			const image = portrait.locator('img');
			await expect(image).toHaveAttribute('src', '/profile/perfil.webp');
			await expect(image).toHaveAttribute('loading', 'eager');
			await expect(image).toHaveAttribute('fetchpriority', 'high');

			const box = await portrait.boundingBox();
			expect(box).not.toBeNull();
			expect(Math.abs((box?.width ?? 0) - (box?.height ?? 0))).toBeLessThanOrEqual(1);

			const imageState = await image.evaluate((element: HTMLImageElement) => ({
				complete: element.complete,
				naturalWidth: element.naturalWidth,
				naturalHeight: element.naturalHeight,
				objectFit: getComputedStyle(element).objectFit,
			}));
			expect(imageState.complete).toBe(true);
			expect(imageState.naturalWidth).toBeGreaterThan(0);
			expect(imageState.naturalHeight).toBeGreaterThan(0);
			expect(imageState.objectFit).toBe('cover');

			const hasHorizontalOverflow = await page.evaluate(
				() => document.documentElement.scrollWidth > document.documentElement.clientWidth
			);
			expect(hasHorizontalOverflow).toBe(false);
		}
	});
}

test('portrait remains present with reduced motion enabled', async ({ page }) => {
	await page.emulateMedia({ reducedMotion: 'reduce', colorScheme: 'dark' });
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto('/');

	const portrait = page.getByRole('img', { name: 'Portrait of David Sandoval', exact: true });
	await expect(portrait).toBeVisible();
});
