import { expect, test } from '@playwright/test';

test('serves missing routes as a branded noindex 404', async ({ page }) => {
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
	await expect(page.getByRole('link', { name: 'Return to Hub' })).toHaveAttribute('href', '/');
	await expect(page.getByRole('link', { name: 'Go back' })).toHaveAttribute('href', '/');
	await expect(page.getByRole('link', { name: 'Ir al Hub en español' })).toHaveAttribute(
		'href',
		'/es/'
	);
});
