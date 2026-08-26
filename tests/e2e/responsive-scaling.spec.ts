import { expect, test } from '@playwright/test';

const routes = ['/', '/es/'] as const;

async function expectNoHorizontalOverflow(page: import('@playwright/test').Page, context: string) {
	const overflow = await page.locator('html').evaluate(element => ({
		clientWidth: element.clientWidth,
		scrollWidth: element.scrollWidth,
	}));
	expect(overflow.scrollWidth, context).toBeLessThanOrEqual(overflow.clientWidth);
}

for (const route of routes) {
	test.describe(`responsive scaling for ${route} (#98)`, () => {
		test('320px mobile width has no horizontal overflow', async ({ page }) => {
			await page.setViewportSize({ width: 320, height: 640 });
			await page.goto(route);
			await expect(page.locator('#main-content')).toBeVisible();
			await expectNoHorizontalOverflow(page, `${route} must not overflow horizontally at 320px`);
		});

		// WCAG 1.4.10 Reflow: 400% zoom on a 1280px viewport is equivalent to testing
		// at a 320px CSS viewport; 200% zoom on the same reference is equivalent to 640px.
		test('200% zoom equivalent viewport reflows without horizontal scroll', async ({ page }) => {
			await page.setViewportSize({ width: 640, height: 800 });
			await page.goto(route);
			await expect(page.locator('#main-content')).toBeVisible();
			await expectNoHorizontalOverflow(
				page,
				`${route} must reflow without horizontal scroll at 200% zoom (640px)`
			);
		});

		test('200% text scaling does not clip primary heading or controls', async ({ page }) => {
			await page.setViewportSize({ width: 1280, height: 720 });
			await page.goto(route);
			await page.addStyleTag({ content: 'html { font-size: 200% !important; }' });

			const h1 = page.locator('h1').first();
			await expect(h1).toBeVisible();
			const h1Overflow = await h1.evaluate(element => ({
				clientWidth: element.clientWidth,
				scrollWidth: element.scrollWidth,
				clientHeight: element.clientHeight,
				scrollHeight: element.scrollHeight,
			}));
			const SUBPIXEL_TOLERANCE = 3;
			expect(
				h1Overflow.scrollWidth,
				`${route} h1 must not clip horizontally at 200% text`
			).toBeLessThanOrEqual(h1Overflow.clientWidth + SUBPIXEL_TOLERANCE);
			expect(
				h1Overflow.scrollHeight,
				`${route} h1 must not clip vertically at 200% text`
			).toBeLessThanOrEqual(h1Overflow.clientHeight + SUBPIXEL_TOLERANCE);

			// ShareButton/ThemeToggle are icon-only (labels live in aria-label) and each
			// carries an absolutely-positioned tooltip child that is intentionally wider
			// than the trigger — only LanguageToggle renders real inline label text.
			const languageToggle = page.locator('.language-toggle');
			await expect(languageToggle).toBeVisible();
			const box = await languageToggle.evaluate(element => ({
				clientWidth: element.clientWidth,
				scrollWidth: element.scrollWidth,
			}));
			expect(
				box.scrollWidth,
				`${route} .language-toggle must not clip its label at 200% text`
			).toBeLessThanOrEqual(box.clientWidth + SUBPIXEL_TOLERANCE);
		});

		// Inter and JetBrains Mono are now self-hosted from this origin (see the
		// `fonts` block in astro.config.mjs), so the declared typography is what
		// visitors normally render. The fallback stack still has to hold: a font
		// request can fail, be blocked, or lose the race on a slow connection, and
		// astro:assets also inserts a metric-matched fallback ahead of the generic
		// family. This forces the generic stack and checks nothing clips (#98).
		test('fallback font stack does not clip heading or controls', async ({ page }) => {
			await page.setViewportSize({ width: 1280, height: 720 });
			await page.goto(route);
			await page.addStyleTag({
				content: `
					*, *::before, *::after { font-family: system-ui, sans-serif !important; }
				`,
			});

			const h1 = page.locator('h1').first();
			await expect(h1).toBeVisible();
			const h1Overflow = await h1.evaluate(element => ({
				clientWidth: element.clientWidth,
				scrollWidth: element.scrollWidth,
			}));
			expect(
				h1Overflow.scrollWidth,
				`${route} h1 must not clip under the fallback font stack`
			).toBeLessThanOrEqual(h1Overflow.clientWidth + 3);

			const languageToggle = page.locator('.language-toggle');
			await expect(languageToggle).toBeVisible();
			const box = await languageToggle.evaluate(element => ({
				clientWidth: element.clientWidth,
				scrollWidth: element.scrollWidth,
			}));
			expect(
				box.scrollWidth,
				`${route} .language-toggle must not clip under the fallback font stack`
			).toBeLessThanOrEqual(box.clientWidth + 3);
		});
	});
}
