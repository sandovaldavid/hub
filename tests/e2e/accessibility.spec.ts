import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const AXE_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

async function prepareAccessibilityScan(page: Page, path: string, theme: 'light' | 'dark') {
	await page.addInitScript(selectedTheme => {
		localStorage.setItem('sandovaldavid-theme', selectedTheme);
	}, theme);
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await page.goto(path);
	await page.addStyleTag({
		content: `
			*, *::before, *::after {
				animation-delay: 0s !important;
				animation-duration: 0s !important;
				transition-delay: 0s !important;
				transition-duration: 0s !important;
			}
		`,
	});
	await page.evaluate(() => document.fonts.ready);
	await page.waitForLoadState('networkidle');
}

async function analyzeAccessibility(page: Page, browserName: string) {
	const builder = new AxeBuilder({ page }).withTags(AXE_TAGS);
	if (browserName === 'webkit') {
		builder.disableRules(['color-contrast']);
	}
	return builder.analyze();
}

test.describe('Accessibility — WCAG 2.1 AA', () => {
	test('light mode has no violations', async ({ page, browserName }) => {
		await prepareAccessibilityScan(page, '/', 'light');
		const results = await analyzeAccessibility(page, browserName);
		expect(results.violations).toEqual([]);
	});

	test('dark mode has no violations', async ({ page, browserName }) => {
		await prepareAccessibilityScan(page, '/', 'dark');
		const results = await analyzeAccessibility(page, browserName);
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

	test('Spanish page (/es/) has no violations', async ({ page, browserName }) => {
		await prepareAccessibilityScan(page, '/es/', 'light');
		const results = await analyzeAccessibility(page, browserName);
		expect(results.violations).toEqual([]);
	});

	test('prefers-contrast: more has no violations and strengthens focus outline (#92)', async ({
		page,
		browserName,
	}) => {
		await page.emulateMedia({ contrast: 'more' });
		await prepareAccessibilityScan(page, '/', 'light');
		const results = await analyzeAccessibility(page, browserName);
		expect(results.violations).toEqual([]);

		const button = page.locator('button:visible').first();
		await button.focus();
		const outlineWidth = await button.evaluate(el => window.getComputedStyle(el).outlineWidth);
		expect(outlineWidth).toBe('4px');
	});

	test('forced-colors: active preserves visible focus and control borders (#92)', async ({
		page,
		browserName,
	}) => {
		test.skip(browserName !== 'chromium', 'forced-colors emulation is only supported in Chromium');
		await page.emulateMedia({ forcedColors: 'active' });
		await prepareAccessibilityScan(page, '/', 'light');

		const button = page.locator('button:visible').first();
		await button.focus();
		const outline = await button.evaluate(el => {
			const style = window.getComputedStyle(el);
			return { color: style.outlineColor, width: style.outlineWidth };
		});
		expect(outline.width).not.toBe('0px');
		expect(outline.color).not.toBe('');
	});
});
