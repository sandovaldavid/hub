import { test, expect } from '@playwright/test';

test.describe('Home page', () => {
	test('loads with correct title', async ({ page }) => {
		await page.goto('/');
		await expect(page).toHaveTitle(/sandovaldavid/);
	});

	test('has meta description', async ({ page }) => {
		await page.goto('/');
		const meta = page.locator('meta[name="description"]');
		await expect(meta).toHaveAttribute('content', /.+/);
	});

	test('has Open Graph tags', async ({ page }) => {
		await page.goto('/');
		await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', /.+/);
		await expect(page.locator('meta[property="og:description"]')).toHaveAttribute('content', /.+/);
		await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /.+/);
	});

	test('renders main sections', async ({ page }) => {
		await page.goto('/');
		await expect(page.locator('main')).toBeVisible();
		await expect(page.locator('[aria-labelledby="hero-heading"]')).toBeVisible();
		await expect(page.locator('[aria-labelledby="social-heading"]')).toBeVisible();
		await expect(page.locator('[aria-labelledby="cta-heading"]')).toBeVisible();
		await expect(page.locator('[aria-labelledby="contact-heading"]')).toBeVisible();
		await expect(page.locator('[aria-labelledby="weekly-project-heading"]')).toBeVisible();
		await expect(page.locator('[aria-labelledby="skills-heading"]')).toBeVisible();
	});

	test('social links have href and security attributes', async ({ page }) => {
		await page.goto('/');
		// Scope to main to exclude Astro dev toolbar links injected by astro preview
		const externalLinks = page.locator('main a[target="_blank"]');
		const count = await externalLinks.count();
		expect(count).toBeGreaterThan(0);

		for (let i = 0; i < count; i++) {
			const link = externalLinks.nth(i);
			await expect(link).toHaveAttribute('href', /.+/);
			const rel = await link.getAttribute('rel');
			expect(rel).toContain('noopener');
		}
	});

	test('CTA links use semantic destinations and safe external attributes', async ({ page }) => {
		await page.goto('/');

		const calendlyLink = page.locator('a[href*="calendly.com"]');
		await expect(calendlyLink).toHaveAttribute('target', '_blank');
		await expect(calendlyLink).toHaveAttribute('rel', /noopener/);
		await expect(calendlyLink).toHaveAttribute('rel', /noreferrer/);

		const learningLink = page.locator('a[href*="instagram.com"]', {
			hasText: 'Aprende y Crece como Developer',
		});
		await expect(learningLink).toHaveAttribute('href', /instagram\.com/);
		await expect(learningLink).toHaveAttribute('target', '_blank');
		await expect(learningLink).toHaveAttribute('rel', /noopener/);
	});

	test('share button is present', async ({ page }) => {
		await page.goto('/');
		await expect(page.locator('#share-button')).toBeVisible();
	});

	test('theme toggle is present', async ({ page }) => {
		await page.goto('/');
		await expect(page.locator('#theme-toggle')).toBeVisible();
	});

	test('skip link is present and points to main content', async ({ page }) => {
		await page.goto('/');
		const skipLink = page.locator('a[href="#main-content"]');
		await expect(skipLink).toBeAttached();
	});

	test('all images have alt text', async ({ page }) => {
		await page.goto('/');
		const images = page.locator('img');
		const count = await images.count();
		for (let i = 0; i < count; i++) {
			const img = images.nth(i);
			const alt = await img.getAttribute('alt');
			expect(alt).not.toBeNull();
		}
	});
});

test.describe('Spanish version (/es/)', () => {
	test('loads the Spanish page', async ({ page }) => {
		await page.goto('/es/');
		await expect(page).toHaveTitle(/sandovaldavid/);
	});

	test('html lang attribute is es', async ({ page }) => {
		await page.goto('/es/');
		const htmlEl = page.locator('html');
		await expect(htmlEl).toHaveAttribute('lang', 'es');
	});

	test('has hreflang alternate links', async ({ page }) => {
		await page.goto('/');
		const hreflangEn = page.locator('link[rel="alternate"][hreflang="en"]');
		const hreflangEs = page.locator('link[rel="alternate"][hreflang="es"]');
		await expect(hreflangEn).toBeAttached();
		await expect(hreflangEs).toBeAttached();
	});
});
