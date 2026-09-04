import { test, expect, type Page } from '@playwright/test';

async function expectProfileMetadata(page: Page, expectedGroups: string[][]) {
	const metadataItems = page.locator('.profile-snapshot__metadata-item');
	await expect(metadataItems).toHaveCount(expectedGroups.length);

	for (let itemIndex = 0; itemIndex < expectedGroups.length; itemIndex++) {
		const expectedParts = expectedGroups[itemIndex];
		const parts = metadataItems
			.nth(itemIndex)
			.locator('dd > span:not(.profile-snapshot__separator)');
		await expect(parts).toHaveCount(expectedParts.length);

		for (let partIndex = 0; partIndex < expectedParts.length; partIndex++) {
			await expect(parts.nth(partIndex)).toHaveText(expectedParts[partIndex]);
		}
	}

	const separators = page.locator('.profile-snapshot__separator');
	await expect(separators).toHaveCount(5);
	for (let index = 0; index < 5; index++) {
		await expect(separators.nth(index)).toHaveText('·');
		await expect(separators.nth(index)).toHaveAttribute('aria-hidden', 'true');
	}
}

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

	test('renders the compact recognition and routing sections', async ({ page }) => {
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
		await expect(page.getByRole('heading', { level: 2, name: 'About' })).toBeVisible();
		await expect(page.getByRole('heading', { level: 2, name: 'Work & contact' })).toBeVisible();
		await expect(page.getByRole('heading', { level: 2, name: 'Featured projects' })).toBeVisible();
		await expect(page.getByRole('heading', { level: 3, name: 'Portfolio' })).toBeVisible();
		await expect(page.getByRole('heading', { level: 3, name: 'Resume' })).toBeVisible();
		await expect(page.getByRole('heading', { level: 3, name: "Let's talk" })).toBeVisible();
		await expect(page.locator('.work-route-card__title')).toHaveCount(3);
	});

	test('hero exposes clear positioning and routes first to the portfolio', async ({ page }) => {
		await page.setViewportSize({ width: 1280, height: 720 });
		await page.goto('/');

		await expect(page.getByRole('heading', { level: 1, name: 'David Sandoval' })).toBeVisible();
		await expect(page.getByText('Software Engineer · Backend-focused')).toBeVisible();
		await expect(page.getByText('Open to software engineering opportunities')).toBeVisible();
		await expectProfileMetadata(page, [
			['Piura, Peru', 'UTC-5'],
			['English', 'Spanish'],
			['Remote', 'Peru'],
		]);
		await expect(
			page.getByText(
				"I'm a Software Engineer focused on backend development, with hands-on frontend experience. I work mainly with .NET/C# and Angular/TypeScript across APIs, integrations, data access, and frontend features."
			)
		).toBeVisible();

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

	test('keeps professional profiles visually primary and restores verified Instagram routing', async ({
		page,
	}) => {
		await page.goto('/');

		const socialItems = page.locator('.social-grid__item');
		await expect(socialItems).toHaveCount(6);
		await expect(page.locator('.social-grid__item--wide')).toHaveCount(0);
		await expect(page.locator('.social-button[href="https://sandovaldavid.com"]')).toHaveCount(0);
		await expect(
			page.locator('.social-button[href="https://www.linkedin.com/in/jdsandovals"]')
		).toHaveCount(1);
		await expect(
			page.locator('.social-button[href="https://github.com/sandovaldavid"]')
		).toHaveCount(1);
		await expect(
			page.locator('.social-button[href="https://www.instagram.com/david.sandovals"]')
		).toHaveCount(1);
		await expect(socialItems.filter({ hasText: 'LinkedIn' })).toHaveAttribute(
			'data-priority',
			'primary'
		);
		await expect(socialItems.filter({ hasText: 'GitHub' })).toHaveAttribute(
			'data-priority',
			'primary'
		);
		await expect(socialItems.filter({ hasText: 'Instagram' })).toHaveAttribute(
			'data-priority',
			'secondary'
		);

		const externalLinks = page.locator('main a[target="_blank"]');
		const count = await externalLinks.count();
		expect(count).toBeGreaterThan(0);
		for (let index = 0; index < count; index++) {
			await expect(externalLinks.nth(index)).toHaveAttribute('rel', /noopener/);
		}
	});

	test('keeps Work & contact focused on portfolio, resume and email with button-only interactions', async ({
		page,
	}) => {
		await page.goto('/');

		const routeCards = page.locator('[data-work-route-card]');
		await expect(routeCards).toHaveCount(3);
		await expect(page.locator('a[data-work-route-card]')).toHaveCount(0);

		const primaryActions = page.locator(
			'.work-route-card__action[data-conversion-position="primary-cta"]'
		);
		await expect(primaryActions).toHaveCount(2);

		const portfolio = primaryActions.filter({ hasText: 'View portfolio' });
		await expect(portfolio).toHaveCount(1);
		await expect(portfolio).toHaveAttribute('href', 'https://sandovaldavid.com');
		await expect(portfolio).toHaveAttribute('data-conversion-event', 'portfolio_opened');

		const resume = primaryActions.filter({ hasText: 'Download resume' });
		await expect(resume).toHaveAttribute(
			'href',
			'https://sandovaldavid.com/resume/david-sandoval-resume.pdf'
		);
		await expect(resume).toHaveAttribute('data-conversion-event', 'resume_downloaded');
		await expect(
			page.locator('.work-route-card__action[href="#featured-projects-title"]')
		).toHaveCount(0);
		await expect(
			page.locator('.work-route-card__action[href="https://github.com/sandovaldavid"]')
		).toHaveCount(0);
		await expect(page.locator('.work-route-card__action[href^="mailto:"]')).toHaveCount(1);

		for (let index = 0; index < 3; index++) {
			await expect(routeCards.nth(index).locator(':scope > .work-route-card__action')).toHaveCount(
				1
			);
		}
	});

	test('share, language and theme controls remain available in the page layout', async ({
		page,
	}) => {
		await page.goto('/');
		await expect(page.locator('[data-layout-section="global-controls"]')).toBeVisible();
		await expect(page.locator('#share-button')).toBeVisible();
		await expect(page.locator('.language-toggle')).toBeVisible();
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
		await expect(page.getByText('Ingeniero de Software · Orientado a backend')).toBeVisible();
		await expect(
			page.getByText('Disponible para oportunidades en ingeniería de software')
		).toBeVisible();
		await expectProfileMetadata(page, [
			['Piura, Perú', 'UTC-5'],
			['Inglés', 'Español'],
			['Remoto', 'Perú'],
		]);
		await expect(
			page.getByText(
				'Soy Ingeniero de Software orientado a backend, con experiencia práctica en frontend. Trabajo principalmente con .NET/C# y Angular/TypeScript en APIs, integraciones, acceso a datos y funcionalidades frontend.'
			)
		).toBeVisible();
		await expect(page.getByRole('heading', { level: 2, name: 'Sobre mí' })).toBeVisible();
		await expect(page.getByRole('heading', { level: 2, name: 'Trabajo y contacto' })).toBeVisible();
		await expect(
			page.getByRole('heading', { level: 2, name: 'Proyectos destacados' })
		).toBeVisible();
		await expect(page.getByRole('heading', { level: 3, name: 'Portafolio' })).toBeVisible();
		await expect(page.getByRole('heading', { level: 3, name: 'CV' })).toBeVisible();
		await expect(page.getByRole('heading', { level: 3, name: 'Conversemos' })).toBeVisible();
		await expect(page.locator('[aria-labelledby="skills-heading"]')).toHaveCount(0);

		const portfolioLink = page.locator(
			'.hero-card__primary-action[href="https://sandovaldavid.com"]'
		);
		await expect(portfolioLink).toHaveText('Ver portafolio');
		await expect(portfolioLink).toHaveAttribute('data-conversion-event', 'portfolio_opened');

		const primaryActions = page.locator(
			'.work-route-card__action[data-conversion-position="primary-cta"]'
		);
		await expect(primaryActions).toHaveCount(2);
		const portfolio = primaryActions.filter({ hasText: 'Ver portafolio' });
		await expect(portfolio).toHaveAttribute('href', 'https://sandovaldavid.com');
		await expect(portfolio).toHaveAttribute('data-conversion-event', 'portfolio_opened');
		const resume = primaryActions.filter({ hasText: 'Descargar CV' });
		await expect(resume).toHaveAttribute(
			'href',
			'https://sandovaldavid.com/resume/david-sandoval-resume-es.pdf'
		);
		await expect(resume).toHaveAttribute('data-conversion-event', 'resume_downloaded');
		await expect(page.locator('[data-work-route-card]')).toHaveCount(3);
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
