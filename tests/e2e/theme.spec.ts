import { test, expect, type Page } from '@playwright/test';

const THEME_STORAGE_KEY = 'sandovaldavid-theme';
const FAVICON_PATHS = {
	light: '/favicon.light.svg',
	dark: '/favicon.dark.svg',
} as const;

const routes = [
	{ path: '/', locale: 'en' },
	{ path: '/es/', locale: 'es' },
] as const;

const initialStates = [
	{ preference: 'light', colorScheme: 'dark', effective: 'light' },
	{ preference: 'dark', colorScheme: 'light', effective: 'dark' },
	{ preference: 'system', colorScheme: 'light', effective: 'light' },
	{ preference: 'system', colorScheme: 'dark', effective: 'dark' },
] as const;

type ThemePreference = (typeof initialStates)[number]['preference'];

async function setThemePreference(page: Page, preference: ThemePreference) {
	await page.addInitScript(({ key, value }) => localStorage.setItem(key, value), {
		key: THEME_STORAGE_KEY,
		value: preference,
	});
}

test.describe('Theme toggle', () => {
	test('theme toggle button is visible', async ({ page }) => {
		await page.goto('/');
		await expect(page.locator('#theme-toggle')).toBeVisible();
	});

	test('toggling theme changes data-theme attribute on html element', async ({ page }) => {
		// Set a known start state so the cycle result is predictable
		await setThemePreference(page, 'light');
		await page.goto('/');

		const html = page.locator('html');
		await page.locator('#theme-toggle').click();

		const newTheme = await html.getAttribute('data-theme');
		// light → dark after one click
		expect(newTheme).toBe('dark');
	});

	test('theme preference persists in localStorage', async ({ page }) => {
		await page.goto('/');
		await page.locator('#theme-toggle').click();

		const stored = await page.evaluate(
			(key: string) => localStorage.getItem(key),
			THEME_STORAGE_KEY
		);
		expect(stored).not.toBeNull();
		expect(['light', 'dark', 'system']).toContain(stored);
	});

	test('no FOUC — html has data-theme attribute before first paint', async ({ page }) => {
		await page.goto('/');
		const html = page.locator('html');
		const themeAttr = await html.getAttribute('data-theme');
		expect(themeAttr).toMatch(/^(light|dark)$/);
	});

	for (const route of routes) {
		for (const state of initialStates) {
			test(`${route.locale} ${state.preference} resolves favicon for ${state.colorScheme}`, async ({
				page,
			}) => {
				await page.emulateMedia({ colorScheme: state.colorScheme });
				await setThemePreference(page, state.preference);
				await page.goto(route.path);

				await expect(page.locator('html')).toHaveAttribute('lang', route.locale);
				await expect(page.locator('html')).toHaveAttribute('data-theme', state.effective);
				await expect(page.locator('#site-favicon')).toHaveAttribute(
					'href',
					FAVICON_PATHS[state.effective]
				);
			});
		}
	}

	test('updates favicon on toggle without navigation', async ({ page }) => {
		await setThemePreference(page, 'light');
		await page.goto('/');
		await expect(page.locator('#site-favicon')).toHaveAttribute('href', FAVICON_PATHS.light);

		let navigations = 0;
		page.on('framenavigated', frame => {
			if (frame === page.mainFrame()) navigations += 1;
		});

		await page.locator('#theme-toggle').click();
		await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
		await expect(page.locator('#site-favicon')).toHaveAttribute('href', FAVICON_PATHS.dark);
		expect(navigations).toBe(0);
	});

	test('updates favicon when the system preference changes in system mode', async ({ page }) => {
		await page.emulateMedia({ colorScheme: 'light' });
		await setThemePreference(page, 'system');
		await page.goto('/es/');

		await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
		await expect(page.locator('#site-favicon')).toHaveAttribute('href', FAVICON_PATHS.light);

		await page.emulateMedia({ colorScheme: 'dark' });
		await expect.poll(() => page.locator('html').getAttribute('data-theme')).toBe('dark');
		await expect
			.poll(() => page.locator('#site-favicon').getAttribute('href'))
			.toBe(FAVICON_PATHS.dark);

		await page.locator('#theme-toggle').click();
		await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
		await expect(page.locator('#site-favicon')).toHaveAttribute('href', FAVICON_PATHS.light);

		await page.emulateMedia({ colorScheme: 'dark' });
		await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
		await expect(page.locator('#site-favicon')).toHaveAttribute('href', FAVICON_PATHS.light);
	});
});
