import { test, expect } from '@playwright/test';

test.describe('Theme toggle', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
	});

	test('theme toggle button is visible', async ({ page }) => {
		await expect(page.locator('#theme-toggle')).toBeVisible();
	});

	test('toggling theme changes data-theme attribute on html element', async ({ page }) => {
		// Set a known start state so the cycle result is predictable
		await page.evaluate(() => localStorage.setItem('sandovaldavid-theme', 'light'));
		await page.reload();

		const html = page.locator('html');
		await page.locator('#theme-toggle').click();

		const newTheme = await html.getAttribute('data-theme');
		// light → dark after one click
		expect(newTheme).toBe('dark');
	});

	test('theme preference persists in localStorage', async ({ page }) => {
		await page.locator('#theme-toggle').click();

		const stored = await page.evaluate(() => localStorage.getItem('sandovaldavid-theme'));
		expect(stored).not.toBeNull();
		expect(['light', 'dark', 'system']).toContain(stored);
	});

	test('no FOUC — html has data-theme attribute before first paint', async ({ page }) => {
		const html = page.locator('html');
		const themeAttr = await html.getAttribute('data-theme');
		expect(themeAttr).toMatch(/^(light|dark)$/);
	});
});
