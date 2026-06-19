import { test, expect } from '@playwright/test';

test.describe('Theme toggle', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
	});

	test('theme toggle button is visible', async ({ page }) => {
		const toggle = page.locator('[data-theme-toggle], button[aria-label*="mode"], button[aria-label*="modo"]').first();
		await expect(toggle).toBeVisible();
	});

	test('toggling theme adds dark class to html element', async ({ page }) => {
		const html = page.locator('html');
		const initialClass = await html.getAttribute('class');

		const toggle = page.locator('[data-theme-toggle], button[aria-label*="mode"], button[aria-label*="modo"]').first();
		await toggle.click();

		const newClass = await html.getAttribute('class');
		expect(newClass).not.toBe(initialClass);
	});

	test('theme preference persists in localStorage', async ({ page }) => {
		const toggle = page.locator('[data-theme-toggle], button[aria-label*="mode"], button[aria-label*="modo"]').first();
		await toggle.click();

		const stored = await page.evaluate(() => localStorage.getItem('theme'));
		expect(stored).not.toBeNull();
		expect(['light', 'dark', 'system']).toContain(stored);
	});

	test('no FOUC — html has theme class before first paint', async ({ page }) => {
		// The inline script in <head> should set the theme class before hydration
		const html = page.locator('html');
		const classAttr = await html.getAttribute('class');
		// Should have either 'light' or 'dark' class set by the init script
		expect(classAttr).toMatch(/light|dark/);
	});
});
