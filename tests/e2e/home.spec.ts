import { test, expect } from '@playwright/test';

test.describe('Home page', () => {
	test('loads with correct professional title and metadata', async ({ page }) => {
		await page.goto('/');
		await expect(page).toHaveTitle(/David Sandoval.*Software Engineer/);
		await expect(page.locator('meta[name="description"]')).toHaveAttribute(
			'content',
			/Software Engineer/
		);
		await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
			'content',
			'David Sandoval | Software Engineer'
		);
		await expect(page.locator('meta[property="og:description"]')).toHaveAttribute(
			'content',
			/David Sandoval.*Software Engineer/
		);
		await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /.+/);
		await expect(page.locator('meta[property="og:image:alt"]')).toHaveAttribute(
			'content',
			'David Sandoval — Software Engineer'
		);
	});

	test('renders the compact recognition and routing sections without a visible stack catalog', async ({
		page,
	}) => {
		await page.goto('/');
		await expect(page.locator('main')).toBeVisible();
		await expect(page.locator('[aria-labelledby="hero-heading"]')).toBeVisible();
		await expect(page.locator('[aria-labelledby="social-heading"]')).toBeVisible();
		await expect(page.locator('[aria-labelledby="cta-heading"]')).toBeVisible();
		await expect(page.locator('[aria-labelledby="contact-heading"]')).toBeVisible();
		await expect(page.locator('[aria-labelledby="featured-projects-title"]')).toBeVisible();
		await expect(page.locator('[aria-labelledby="skills-heading"]')).toHaveCount(0);
		await expect(page.locator('[data-skill-item]')).toHaveCount(0);
	});

	test('uses a clear human-first heading hierarchy', async ({ page }) => {
		await page.goto('/');

		await expect(page.getByRole('heading', { level: 1, name: 'David Sandoval' })).toHaveCount(1);
		await expect(
			page.getByRole('heading', { level: 2, name: 'Professional snapshot' })
		).toBeVisible();
		await expect(page.getByRole('heading', { level: 2, name: 'Work & contact' })).toBeVisible();
		await expect(page.getByRole('heading', { level: 2, name: 'Featured projects' })).toBeVisible();
		await expect(page.getByRole('heading', { level: 3, name: "Let's talk" })).toBeVisible();
		await expect(page.locator('.cta-button-card__title')).toHaveCount(2);
	});

	test('hero exposes clear positioning and routes first to the portfolio', async ({ page }) => {
		await page.setViewportSize({ width: 1280, height: 720 });
		await page.goto('/');

		await expect(page.getByRole('heading', { level: 1, name: 'David Sandoval' })).toBeVisible();
		await expect(page.getByText('Software Engineer · Backend-focused')).toBeVisible();
		await expect(page.getByText('Open to remote software engineering opportunities')).toBeVisible();
		await expect(page.getByText('Piura, Peru · UTC-5')).toBeVisible();
		await expect(page.getByText('Remote · based in Peru')).toBeVisible();

		const portfolioLink = page.locator(
			'.hero-card__primary-action[href="https://sandovaldavid.com"]'
		);
		await expect(portfolioLink).toBeVisible();
		await expect(portfolioLink).toHaveText('View portfolio');
		await expect(portfolioLink).toHaveAttribute('target', '_blank');
		await expect(portfolioLink).toHaveAttribute('rel', /noopener/);
		await expect(portfolioLink).toHaveAttribute('data-conversion-event', 'portfolio_opened');
		await expect(portfolioLink).toHaveAttribute('data-conversion-item', 'portfolio');

		await page.setViewportSize({ width: 390, height: 844 });
		await expect(portfolioLink).toBeVisible();
	});

	test('keeps social channels distinct from primary work routing', async ({ page }) => {
		await page.goto('/');

		const socialItems = page.locator('.social-grid__item');
		await expect(socialItems).toHaveCount(5);
		await expect(page.locator('.social-button[href="https://sandovaldavid.com"]')).toHaveCount(0);
		await expect(page.locator('.social-button[href="https://www.linkedin.com/in/jdsandovals"]')).toHaveCount(
			1
		);
		await expect(page.locator('.social-button[href="https://github.com/sandovaldavid"]')).toHaveCount(
			1
		);

		const externalLinks = page.locator('main a[target="_blank"]');
		const count = await externalLinks.count();
		expect(count).toBeGreaterThan(0);
		for (let index = 0; index < count; index++) {
			await expect(externalLinks.nth(index)).toHaveAttribute('rel', /noopener/);
		}
	});

	test('keeps Portfolio primary, résumé secondary, and contact explicit', async ({ page }) => {
		await page.goto('/');

		const actionLinks = page.locator('.cta-buttons__link');
		await expect(actionLinks).toHaveCount(2);

		const portfolio = actionLinks.filter({ hasText: 'View portfolio' });
		const resume = actionLinks.filter({ hasText: 'Download résumé' });
		await expect(portfolio).toHaveAttribute('href', 'https://sandovaldavid.com');
		await expect(portfolio).toHaveAttribute('data-conversion-event', 'portfolio_opened');
		await expect(resume).toHaveAttribute(
			'href',
			'https://sandovaldavid.com/resume/david-sandoval-resume.pdf'
		);
		await expect(resume).toHaveAttribute('data-conversion-event', 'resume_downloaded');
		await expect(page.locator('.cta-buttons__link[href="#featured-projects-title"]')).toHaveCount(0);
		await expect(page.locator('.cta-buttons__link[href="https://github.com/sandovaldavid"]')).toHaveCount(
			0
		);
		await expect(page.locator('.cta-buttons__link[href^="mailto:"]')).toHaveCount(0);
		await expect(page.locator('[data-layout-column="contact"] a[href^="mailto:"]')).toHaveCount(1);
	});

	test('share, theme and skip navigation controls remain available', async ({ page }) => {
		await page.goto('/');
		await expect(page.locator('#share-button')).toBeVisible();
		await expect(page.locator('#theme-toggle')).toBeVisible();
		const skipLink = page.locator('.skip-link');
		await expect(skipLink).toBeAttached();
		await expect(skipLink).toHaveAttribute('href', '#main-content');
	});

	test('all images have alt text', async ({ page }) => {
		await page.goto('/');
		const images = page.locator('img');
		const count = await images.count();
		for (let index = 0; index < count; index++) {
			expect(await images.nth(index).getAttribute('alt')).not.toBeNull();
		}
	});
});

test.describe('Spanish version (/es/)', () => {
	test('loads natural Spanish positioning and routing', async ({ page }) => {
		await page.goto('/es/');
		await expect(page).toHaveTitle(/David Sandoval.*Ingeniero de Software/);
		await expect(page.getByText('Ingeniero de Software · Enfoque backend')).toBeVisible();
		await expect(
			page.getByText('Disponible para oportunidades remotas en ingeniería de software')
		).toBeVisible();
		await expect(page.getByText('Piura, Perú · UTC-5')).toBeVisible();
		await expect(page.getByRole('heading', { level: 2, name: 'Trabajo y contacto' })).toBeVisible();
		await expect(page.getByRole('heading', { level: 2, name: 'Proyectos destacados' })).toBeVisible();
		await expect(page.locator('[aria-labelledby="skills-heading"]')).toHaveCount(0);

		const portfolioLink = page.locator(
			'.hero-card__primary-action[href="https://sandovaldavid.com"]'
		);
		await expect(portfolioLink).toHaveText('Ver portafolio');
		await expect(portfolioLink).toHaveAttribute('data-conversion-event', 'portfolio_opened');

		const resume = page.locator('.cta-buttons__link').filter({ hasText: 'Descargar CV' });
		await expect(resume).toHaveAttribute(
			'href',
			'https://sandovaldavid.com/resume/david-sandoval-resume-es.pdf'
		);
		await expect(resume).toHaveAttribute('data-conversion-event', 'resume_downloaded');
	});

	test('uses localized semantics and hreflang', async ({ page }) => {
		await page.goto('/es/');
		await expect(page.locator('html')).toHaveAttribute('lang', 'es');
		await expect(page.locator('main')).toHaveAttribute(
			'aria-label',
			'Perfil profesional de David Sandoval'
		);

		await page.goto('/');
		await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toBeAttached();
		await expect(page.locator('link[rel="alternate"][hreflang="es"]')).toBeAttached();
	});
});
