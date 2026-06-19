import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility — WCAG 2.1 AA', () => {
	test('light mode has no violations', async ({ page }) => {
		await page.goto('/');
		await page.evaluate(() => {
			document.documentElement.classList.remove('dark');
			document.documentElement.classList.add('light');
		});

		const results = await new AxeBuilder({ page })
			.withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
			.analyze();

		expect(results.violations).toEqual([]);
	});

	test('dark mode has no violations', async ({ page }) => {
		await page.goto('/');
		await page.evaluate(() => {
			document.documentElement.classList.remove('light');
			document.documentElement.classList.add('dark');
		});

		const results = await new AxeBuilder({ page })
			.withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
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
			.withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
			.analyze();

		expect(results.violations).toEqual([]);
	});
});
