import { expect, test } from '@playwright/test';

test('serves missing routes as a human-first noindex 404', async ({ page }) => {
	const response = await page.goto('/this-route-does-not-exist');

	expect(response?.status()).toBe(404);
	await expect(page).toHaveTitle('Page not found | David Sandoval');
	await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, follow');
	await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
	await expect(page.locator('link[rel="alternate"]')).toHaveCount(0);
	await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(0);
	await expect(page.getByText('404', { exact: true })).toBeVisible();
	await expect(page.getByRole('heading', { level: 1, name: 'Page not found' })).toBeVisible();
	await expect(page.getByText('Página no encontrada', { exact: true })).toBeVisible();
	await expect(page.getByRole('link', { name: 'Go to homepage' })).toHaveAttribute('href', '/');
	await expect(page.getByRole('link', { name: 'Go back' })).toHaveAttribute('href', '/');
	await expect(page.getByRole('link', { name: 'Ir al inicio en español' })).toHaveAttribute(
		'href',
		'/es/'
	);

	const layout = await page.evaluate(() => {
		const main = document.querySelector<HTMLElement>('#main-content');
		const content = document.querySelector<HTMLElement>('[data-not-found-content]');
		const footer = document.querySelector<HTMLElement>('#site-footer');

		if (!main || !content || !footer) return null;

		const mainRect = main.getBoundingClientRect();
		const contentRect = content.getBoundingClientRect();
		const footerRect = footer.getBoundingClientRect();
		const scrollY = window.scrollY;

		return {
			viewportHeight: window.innerHeight,
			documentHeight: document.documentElement.scrollHeight,
			footerBottom: footerRect.bottom + scrollY,
			mainCenter: mainRect.top + scrollY + mainRect.height / 2,
			contentCenter: contentRect.top + scrollY + contentRect.height / 2,
			contentFitsMain: contentRect.height <= mainRect.height,
		};
	});

	expect(layout).not.toBeNull();
	if (!layout) return;

	expect(Math.abs(layout.footerBottom - layout.documentHeight)).toBeLessThanOrEqual(2);
	if (layout.documentHeight <= layout.viewportHeight + 2) {
		expect(Math.abs(layout.footerBottom - layout.viewportHeight)).toBeLessThanOrEqual(2);
	}

	if (layout.contentFitsMain) {
		expect(Math.abs(layout.contentCenter - layout.mainCenter)).toBeLessThanOrEqual(2);
	}
});
