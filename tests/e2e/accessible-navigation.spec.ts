import { expect, test, type Page } from '@playwright/test';

async function expectVisibleFocus(page: Page, selector: string) {
	const element = page.locator(selector);
	await element.focus();
	await expect(element).toBeFocused();
	const outlineWidth = await element.evaluate(node => window.getComputedStyle(node).outlineWidth);
	expect(outlineWidth).not.toBe('0px');
}

test.describe('Accessible motion and navigation', () => {
	test('reduced motion keeps animated content visible without animation', async ({ page }) => {
		await page.emulateMedia({ reducedMotion: 'reduce' });
		await page.goto('/');

		const sections = page.locator('.bento-item');
		expect(await sections.count()).toBeGreaterThan(0);

		for (let index = 0; index < (await sections.count()); index++) {
			const section = sections.nth(index);
			await expect(section).toBeVisible();
			const styles = await section.evaluate(node => {
				const computed = window.getComputedStyle(node);
				return {
					animationName: computed.animationName,
					opacity: computed.opacity,
					transform: computed.transform,
				};
			});
			expect(styles.animationName).toBe('none');
			expect(styles.opacity).toBe('1');
			expect(styles.transform).toBe('none');
		}
	});

	test('skip link moves keyboard focus to main content', async ({ page }) => {
		await page.goto('/');
		await page.keyboard.press('Tab');
		await expect(page.locator('.skip-link')).toBeFocused();
		await page.keyboard.press('Enter');
		await expect(page.locator('#main-content')).toBeFocused();
	});

	test('keyboard navigation starts with skip link and floating controls', async ({ page }) => {
		await page.goto('/');
		for (const selector of ['.skip-link', '#share-button', '.language-toggle', '#theme-toggle']) {
			await page.keyboard.press('Tab');
			await expect(page.locator(selector)).toBeFocused();
		}
	});

	test('floating controls expose accessible names', async ({ page }) => {
		await page.goto('/');
		await expect(page.locator('#share-button')).toHaveAccessibleName(/.+/);
		await expect(page.locator('.language-toggle')).toHaveAccessibleName(/.+/);
		await expect(page.locator('#theme-toggle')).toHaveAccessibleName(/.+/);
	});

	test('floating controls expose localized accessible names for EN and ES (#98)', async ({
		page,
	}) => {
		// ShareButton's client script replaces the SSR aria-label with the Web Share
		// or clipboard variant once it detects API support; headless browsers fall
		// back to the clipboard label.
		await page.goto('/');
		await expect(page.locator('#share-button')).toHaveAccessibleName('Copy link to clipboard');
		await expect(page.locator('#theme-toggle')).toHaveAccessibleName('Switch to light mode');
		await expect(page.locator('#theme-toggle')).toHaveAccessibleDescription(
			'Current theme: System'
		);
		// WCAG 2.5.3 Label in Name: the visible "ES" must be part of the accessible
		// name, so the name is the visible code plus the hidden description.
		await expect(page.locator('.language-toggle')).toHaveAccessibleName(
			'ES Switch language to Spanish'
		);

		await page.goto('/es/');
		await expect(page.locator('#share-button')).toHaveAccessibleName(
			'Copiar enlace al portapapeles'
		);
		await expect(page.locator('#theme-toggle')).toHaveAccessibleName('Cambiar a modo claro');
		await expect(page.locator('#theme-toggle')).toHaveAccessibleDescription('Tema actual: Sistema');
		await expect(page.locator('.language-toggle')).toHaveAccessibleName(
			'EN Cambiar idioma a inglés'
		);
	});

	for (const { route, copied, shared, error, webShareLabel } of [
		{
			route: '/',
			copied: 'Link copied!',
			shared: 'Link shared!',
			error: "Couldn't share the link. Copy it from your browser's address bar.",
			webShareLabel: 'Share site using system menu',
		},
		{
			route: '/es/',
			copied: '¡Enlace copiado!',
			shared: '¡Enlace compartido!',
			error: 'No se pudo compartir el enlace. Cópialo desde la barra de direcciones.',
			webShareLabel: 'Compartir sitio usando el menú del sistema',
		},
	]) {
		for (const succeeds of [true, false]) {
			test(`${route} announces ${succeeds ? 'copy success' : 'copy failure'}`, async ({ page }) => {
				if (!succeeds) await page.setViewportSize({ width: 320, height: 640 });
				await page.addInitScript(success => {
					Object.defineProperty(navigator, 'share', { configurable: true, value: undefined });
					Object.defineProperty(navigator, 'clipboard', {
						configurable: true,
						value: {
							writeText: async (url: string) => {
								if (!success) throw new Error('Clipboard denied');
								sessionStorage.setItem('lastCopied', url);
							},
						},
					});
				}, succeeds);
				await page.goto(route);

				const share = page.locator('#share-button');
				await share.focus();
				await page.keyboard.press('Enter');
				const message = succeeds ? copied : error;
				await expect(page.getByRole('status')).toHaveText(message);
				await expect(page.locator('#share-feedback')).toHaveText(message);
				await expect(page.locator('#share-feedback')).toHaveClass(
					/share-button__feedback--visible/
				);
				const overflow = await page.locator('html').evaluate(el => el.scrollWidth - el.clientWidth);
				expect(overflow).toBeLessThanOrEqual(0);
				await expect(share).toBeFocused();
				await expect(share).toBeEnabled();
				if (succeeds) {
					const copiedUrl = await page.evaluate(() => sessionStorage.getItem('lastCopied'));
					expect(copiedUrl).toBe(page.url());
				} else {
					for (const scaled of [false, true]) {
						if (scaled) {
							await page.setViewportSize({ width: 375, height: 800 });
							await page.addStyleTag({ content: 'html { font-size: 200% !important; }' });
							await page.keyboard.press('Enter');
							await expect(page.getByRole('status')).toHaveText(error);
						}
						const control = await share.boundingBox();
						const messageBox = await page.locator('#share-feedback').boundingBox();
						expect(messageBox!.y).toBeGreaterThanOrEqual(control!.y + control!.height - 1);
						const overflow = await page
							.locator('html')
							.evaluate(el => el.scrollWidth - el.clientWidth);
						expect(overflow).toBeLessThanOrEqual(0);
					}
				}
			});
		}

		for (const outcome of ['shared', 'cancelled', 'fallback', 'failed'] as const) {
			test(`${route} handles native share ${outcome}`, async ({ page }) => {
				await page.addInitScript(mode => {
					Object.defineProperty(navigator, 'canShare', { configurable: true, value: undefined });
					Object.defineProperty(navigator, 'share', {
						configurable: true,
						value: async () => {
							if (mode === 'cancelled') throw new DOMException('Cancelled', 'AbortError');
							if (mode !== 'shared') throw new Error('Native share unavailable');
						},
					});
					Object.defineProperty(navigator, 'clipboard', {
						configurable: true,
						value: {
							writeText: async (url: string) => {
								sessionStorage.setItem('lastCopied', url);
								if (mode === 'failed') throw new Error('Clipboard denied');
							},
						},
					});
				}, outcome);
				await page.goto(route);
				const share = page.locator('#share-button');
				await expect(share).toHaveAccessibleName(webShareLabel);
				await share.focus();
				await page.keyboard.press('Enter');
				await expect(share).toBeEnabled();
				await expect(share).toBeFocused();
				const copiedUrl = await page.evaluate(() => sessionStorage.getItem('lastCopied'));
				expect(copiedUrl).toBe(outcome === 'shared' || outcome === 'cancelled' ? null : page.url());
				if (outcome === 'cancelled') {
					await expect(page.getByRole('status')).toBeEmpty();
					await expect(page.locator('#share-feedback')).not.toHaveClass(
						/share-button__feedback--visible/
					);
				} else {
					const message = outcome === 'shared' ? shared : outcome === 'fallback' ? copied : error;
					await expect(page.getByRole('status')).toHaveText(message);
					await expect(page.locator('#share-feedback')).toHaveText(message);
				}
			});
		}
	}

	test('language toggle tooltip renders localized visual text instead of an empty shell', async ({
		page,
	}) => {
		for (const { route, tooltip } of [
			{ route: '/', tooltip: 'Switch language to Spanish' },
			{ route: '/es/', tooltip: 'Cambiar idioma a inglés' },
		]) {
			await page.goto(route);
			const tooltipElement = page.locator('.language-toggle__tooltip');
			await expect(tooltipElement).toHaveText(tooltip);
			await expect(tooltipElement).toHaveAttribute('aria-hidden', 'true');
		}
	});

	for (const theme of ['light', 'dark']) {
		test(`${theme} theme exposes visible focus`, async ({ page }) => {
			await page.goto('/');
			await page.evaluate(selectedTheme => {
				document.documentElement.dataset.theme = selectedTheme;
			}, theme);
			await expectVisibleFocus(page, '#share-button');
			await expectVisibleFocus(page, '.language-toggle');
			await expectVisibleFocus(page, '#theme-toggle');
			await expectVisibleFocus(page, '.skip-link');
		});
	}
});
