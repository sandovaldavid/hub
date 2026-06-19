import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// axe-core 4.x does not support oklch() CSS colors — it falls back to the nearest
// ancestor with a parseable background, which causes false positives on color-contrast.
// The actual contrast is correct (dark primary-800 + white text). Exclude until axe
// adds oklch support (tracking: https://github.com/dequelabs/axe-core/issues/4328).
const AXE_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];
const AXE_DISABLE = ['color-contrast'];

test.describe('Accessibility — WCAG 2.1 AA', () => {
	test('light mode has no violations', async ({ page }) => {
		await page.goto('/');
		await page.evaluate(() => {
			document.documentElement.setAttribute('data-theme', 'light');
		});

		const results = await new AxeBuilder({ page })
			.withTags(AXE_TAGS)
			.disableRules(AXE_DISABLE)
			.analyze();

		expect(results.violations).toEqual([]);
	});

	test('dark mode has no violations', async ({ page }) => {
		await page.goto('/');
		await page.evaluate(() => {
			document.documentElement.setAttribute('data-theme', 'dark');
		});

		const results = await new AxeBuilder({ page })
			.withTags(AXE_TAGS)
			.disableRules(AXE_DISABLE)
			.analyze();

		expect(results.violations).toEqual([]);
	});

	test('skip link is keyboard accessible', async ({ page }) => {
		await page.goto('/');
		await page.keyboard.press('Tab');
		const skipLink = page.locator('a[href="#main-content"]');
		await expect(skipLink).toBeFocused();
	});

	test('skip link navigates to main content', async ({ page }) => {
		await page.goto('/');
		await page.keyboard.press('Tab');
		await page.keyboard.press('Enter');
		const main = page.locator('#main-content');
		await expect(main).toBeVisible();
	});

	test('interactive elements have visible focus indicators', async ({ page }) => {
		await page.goto('/');
		const buttons = page.locator('button:visible').first();
		await buttons.focus();
		const outlineStyle = await buttons.evaluate(el => {
			const style = window.getComputedStyle(el, ':focus-visible');
			return style.outlineWidth;
		});
		expect(outlineStyle).not.toBe('0px');
	});

	test('Spanish page (/es/) has no violations', async ({ page }) => {
		await page.goto('/es/');

		const results = await new AxeBuilder({ page })
			.withTags(AXE_TAGS)
			.disableRules(AXE_DISABLE)
			.analyze();

		expect(results.violations).toEqual([]);
	});
});
