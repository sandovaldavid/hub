import { expect, test } from '@playwright/test';

const siteUrl = 'https://hub.sandovaldavid.com';

for (const route of [
	{ path: '/', lang: 'en', locale: 'en_US', alternateLocale: 'es_PE', title: /Software Engineer/ },
	{
		path: '/es/',
		lang: 'es',
		locale: 'es_PE',
		alternateLocale: 'en_US',
		title: /Ingeniero de Software/,
	},
]) {
	test.describe(`SEO metadata for ${route.path}`, () => {
		test.beforeEach(async ({ page }) => {
			await page.goto(route.path);
		});

		test('uses consistent localized metadata', async ({ page }) => {
			await expect(page.locator('html')).toHaveAttribute('lang', route.lang);
			await expect(page).toHaveTitle(route.title);
			await expect(page.locator('meta[name="description"]')).toHaveAttribute(
				'content',
				route.title
			);
			await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
				'content',
				route.title
			);
			await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute(
				'content',
				route.title
			);
			await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute(
				'content',
				route.locale
			);
			await expect(page.locator('meta[property="og:locale:alternate"]')).toHaveAttribute(
				'content',
				route.alternateLocale
			);
		});

		test('publishes canonical and hreflang URLs', async ({ page }) => {
			const canonical = route.path === '/' ? `${siteUrl}/` : `${siteUrl}/es/`;
			await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', canonical);
			await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', canonical);
			await expect(page.locator('meta[name="twitter:url"]')).toHaveAttribute('content', canonical);
			await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute(
				'href',
				`${siteUrl}/`
			);
			await expect(page.locator('link[rel="alternate"][hreflang="es"]')).toHaveAttribute(
				'href',
				`${siteUrl}/es/`
			);
		});

		test('exposes valid professional Person structured data', async ({ page }) => {
			const structuredData = await page
				.locator('script[type="application/ld+json"]')
				.evaluate(element => JSON.parse(element.textContent ?? '{}'));

			expect(structuredData['@type']).toBe('Person');
			expect(structuredData.jobTitle).toBe('Software Engineer');
			expect(structuredData.email).toBe('mailto:hello@sandovaldavid.com');
			expect(structuredData.contactPoint).toBeUndefined();
			expect(structuredData.sameAs).toEqual(
				expect.arrayContaining([
					'https://sandovaldavid.com',
					'https://www.linkedin.com/in/jdsandovals',
					'https://github.com/sandovaldavid',
					'https://x.com/jdsandoval_',
					'https://www.instagram.com/jdsandovals',
				])
			);
			expect(structuredData.mainEntityOfPage).toBe(
				route.path === '/' ? `${siteUrl}/` : `${siteUrl}/es/`
			);
		});

		test('renders one visible descriptive h1', async ({ page }) => {
			const headings = page.getByRole('heading', { level: 1 });
			await expect(headings).toHaveCount(1);
			await expect(headings).toBeVisible();
			await expect(headings).toContainText('David Sandoval Salvador');
		});
	});
}
