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
		await expect(page.locator('a[href="#main-content"]')).toBeFocused();
		await page.keyboard.press('Enter');
		await expect(page.locator('#main-content')).toBeFocused();
	});

	test('keyboard navigation starts with skip link and floating controls', async ({ page }) => {
		await page.goto('/');
		for (const selector of [
			'a[href="#main-content"]',
			'#share-button',
			'.language-toggle',
			'#theme-toggle',
		]) {
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
		await expect(page.locator('#theme-toggle')).toHaveAccessibleName('Use system preference');
		await expect(page.locator('.language-toggle')).toHaveAccessibleName('Cambiar idioma a español');

		await page.goto('/es/');
		await expect(page.locator('#share-button')).toHaveAccessibleName('Copiar link al portapapeles');
		await expect(page.locator('#theme-toggle')).toHaveAccessibleName(
			'Usar preferencia del sistema'
		);
		await expect(page.locator('.language-toggle')).toHaveAccessibleName(
			'Switch language to English'
		);
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
			await expectVisibleFocus(page, 'a[href="#main-content"]');
		});
	}
});
