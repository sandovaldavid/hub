import { test, expect } from '@playwright/test';

test.describe('Home page', () => {
	test('loads with correct professional title', async ({ page }) => {
		await page.goto('/');
		await expect(page).toHaveTitle(/David Sandoval.*Software Engineer/);
	});

	test('has meta description', async ({ page }) => {
		await page.goto('/');
		const meta = page.locator('meta[name="description"]');
		await expect(meta).toHaveAttribute('content', /Software Engineer/);
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
		await expect(page.locator('[aria-labelledby="featured-projects-title"]')).toBeVisible();
		await expect(page.locator('[aria-labelledby="skills-heading"]')).toBeVisible();
	});

	test('uses a clear h1, h2 and h3 hierarchy', async ({ page }) => {
		await page.goto('/');

		await expect(
			page.getByRole('heading', { level: 1, name: 'David Sandoval Salvador' })
		).toHaveCount(1);
		await expect(
			page.getByRole('heading', { level: 2, name: 'Professional snapshot' })
		).toBeVisible();
		await expect(
			page.getByRole('heading', { level: 2, name: 'Explore my work and connect' })
		).toBeVisible();
		await expect(page.getByRole('heading', { level: 2, name: 'Featured projects' })).toBeVisible();
		await expect(
			page.getByRole('heading', { level: 2, name: 'Core engineering stack' })
		).toBeVisible();
		await expect(
			page.getByRole('heading', { level: 3, name: 'Need engineering consulting?' })
		).toBeVisible();
		await expect(page.locator('.cta-button-card__title')).toHaveCount(4);
		for (const heading of await page.locator('.cta-button-card__title').all()) {
			expect(await heading.evaluate(element => element.tagName)).toBe('H3');
		}
	});

	test('hero exposes clear positioning and a mobile-only resume action', async ({ page }) => {
		await page.setViewportSize({ width: 1280, height: 720 });
		await page.goto('/');
		await expect(
			page.getByRole('heading', { level: 1, name: 'David Sandoval Salvador' })
		).toBeVisible();
		await expect(page.getByText('Software Engineer · .NET, Angular & TypeScript')).toBeVisible();
		await expect(page.getByText('Open to remote software engineering roles')).toBeVisible();
		await expect(page.getByText('Remote · Europe & Latin America')).toBeVisible();
		await expect(page.locator('.hero-card__username')).toHaveCount(0);

		const resumeLink = page.locator(
			'.hero-card__primary-action[href$="david-sandoval-resume.pdf"]'
		);
		await expect(resumeLink).toBeAttached();
		await expect(resumeLink).toBeHidden();
		await expect(resumeLink).toHaveAttribute('target', '_blank');
		await expect(resumeLink).toHaveAttribute('rel', /noopener/);
		await expect(resumeLink).toHaveAttribute('data-conversion-event', 'resume_downloaded');

		await page.setViewportSize({ width: 390, height: 844 });
		await expect(resumeLink).toBeVisible();
	});

	test('social links have href and security attributes', async ({ page }) => {
		await page.goto('/');
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

	test('keeps professional actions intentional alongside social destinations', async ({ page }) => {
		await page.goto('/');

		const professionalLinks = [
			'.cta-buttons__link[href="https://sandovaldavid.com"]',
			'.hero-card__primary-action[href$="david-sandoval-resume.pdf"]',
			'.cta-buttons__link[href="#featured-projects-title"]',
			'.cta-buttons__link[href="https://github.com/sandovaldavid"]',
			'.cta-buttons__link[href^="mailto:"]',
			'.social-button[href="https://github.com/sandovaldavid"]',
		];

		for (const selector of professionalLinks) {
			await expect(page.locator(selector)).toHaveCount(1);
		}
		await expect(page.locator('.social-button[href="https://sandovaldavid.com"]')).toHaveCount(0);
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
	test('loads the Spanish professional page', async ({ page }) => {
		await page.goto('/es/');
		await expect(page).toHaveTitle(/David Sandoval.*Ingeniero de Software/);
		await expect(
			page.getByText('Ingeniero de Software · .NET, Angular y TypeScript')
		).toBeVisible();
		await expect(page.getByText('Disponible para roles remotos de ingeniería')).toBeVisible();
	});

	test('uses the localized heading hierarchy', async ({ page }) => {
		await page.goto('/es/');
		await expect(
			page.getByRole('heading', { level: 2, name: 'Resumen profesional' })
		).toBeVisible();
		await expect(
			page.getByRole('heading', { level: 2, name: 'Explora mi trabajo y conecta' })
		).toBeVisible();
		await expect(
			page.getByRole('heading', { level: 2, name: 'Proyectos destacados' })
		).toBeVisible();
		await expect(
			page.getByRole('heading', { level: 2, name: 'Stack principal de ingeniería' })
		).toBeVisible();
		await expect(
			page.getByRole('heading', { level: 3, name: '¿Necesitas consultoría de ingeniería?' })
		).toBeVisible();
	});

	test('html lang attribute is es', async ({ page }) => {
		await page.goto('/es/');
		const htmlEl = page.locator('html');
		await expect(htmlEl).toHaveAttribute('lang', 'es');
	});

	test('has a localized mobile-only resume action', async ({ page }) => {
		await page.setViewportSize({ width: 1280, height: 720 });
		await page.goto('/es/');
		const resumeLink = page.locator(
			'.hero-card__primary-action[href$="david-sandoval-resume-es.pdf"]'
		);
		await expect(resumeLink).toBeAttached();
		await expect(resumeLink).toBeHidden();
		await expect(resumeLink).toHaveAttribute('data-conversion-event', 'resume_downloaded');

		await page.setViewportSize({ width: 390, height: 844 });
		await expect(resumeLink).toBeVisible();
	});

	test('has hreflang alternate links', async ({ page }) => {
		await page.goto('/');
		const hreflangEn = page.locator('link[rel="alternate"][hreflang="en"]');
		const hreflangEs = page.locator('link[rel="alternate"][hreflang="es"]');
		await expect(hreflangEn).toBeAttached();
		await expect(hreflangEs).toBeAttached();
	});
});
