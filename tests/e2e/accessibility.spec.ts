import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const AXE_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

async function prepareAccessibilityScan(
	page: Page,
	path: string,
	theme: 'light' | 'dark' | 'system',
	colorScheme?: 'light' | 'dark'
) {
	if (theme !== 'system') {
		await page.addInitScript(selectedTheme => {
			localStorage.setItem('sandovaldavid-theme', selectedTheme);
		}, theme);
	}
	await page.emulateMedia({ reducedMotion: 'reduce', colorScheme });
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
		const skipLink = page.locator('.skip-link');
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

	test('Spanish page (/es/) in light mode has no violations', async ({ page, browserName }) => {
		await prepareAccessibilityScan(page, '/es/', 'light');
		const results = await analyzeAccessibility(page, browserName);
		expect(results.violations).toEqual([]);
	});

	test('Spanish page (/es/) in dark mode has no violations', async ({ page, browserName }) => {
		await prepareAccessibilityScan(page, '/es/', 'dark');
		const results = await analyzeAccessibility(page, browserName);
		expect(results.violations).toEqual([]);
	});

	test('system theme resolving to light has no violations (#98)', async ({ page, browserName }) => {
		await prepareAccessibilityScan(page, '/', 'system', 'light');
		await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
		const results = await analyzeAccessibility(page, browserName);
		expect(results.violations).toEqual([]);
	});

	test('system theme resolving to dark has no violations (#98)', async ({ page, browserName }) => {
		await prepareAccessibilityScan(page, '/', 'system', 'dark');
		await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
		const results = await analyzeAccessibility(page, browserName);
		expect(results.violations).toEqual([]);
	});

	test('WebKit color-contrast substitute for core text and controls (#98)', async ({
		page,
		browserName,
	}) => {
		test.skip(
			browserName !== 'webkit',
			'documented substitute for the disabled axe color-contrast rule on WebKit'
		);
		await prepareAccessibilityScan(page, '/', 'light');

		function relativeLuminanceFromSrgb([r, g, b]: number[]) {
			const channel = (value: number) => {
				const srgb = value / 255;
				return srgb <= 0.03928 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4;
			};
			return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
		}

		function relativeLuminanceFromOklch(lightness: number, chroma: number, hueDegrees: number) {
			const hue = (hueDegrees * Math.PI) / 180;
			const a = chroma * Math.cos(hue);
			const b = chroma * Math.sin(hue);
			const lPrime = lightness + 0.3963377774 * a + 0.2158037573 * b;
			const mPrime = lightness - 0.1055613458 * a - 0.0638541728 * b;
			const sPrime = lightness - 0.0894841775 * a - 1.291485548 * b;
			const clamp = (value: number) => Math.min(1, Math.max(0, value));
			const l = clamp(lPrime ** 3);
			const m = clamp(mPrime ** 3);
			const s = clamp(sPrime ** 3);
			const red = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
			const green = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
			const blue = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;
			return relativeLuminanceFromSrgb([clamp(red) * 255, clamp(green) * 255, clamp(blue) * 255]);
		}

		function relativeLuminance(value: string): number {
			const rgbMatch = value.match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)/);
			if (rgbMatch) {
				return relativeLuminanceFromSrgb([
					Number(rgbMatch[1]),
					Number(rgbMatch[2]),
					Number(rgbMatch[3]),
				]);
			}
			const oklchMatch = value.match(/oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)/);
			if (oklchMatch) {
				return relativeLuminanceFromOklch(
					Number(oklchMatch[1]),
					Number(oklchMatch[2]),
					Number(oklchMatch[3])
				);
			}
			throw new Error(`Expected an rgb() or oklch() color, received: ${value}`);
		}

		const pairs = [
			{ text: page.locator('h1').first(), background: page.locator('body') },
			{
				text: page.locator('button:visible').first(),
				background: page.locator('button:visible').first(),
			},
		];

		for (const { text, background } of pairs) {
			const [color, backgroundColor] = await Promise.all([
				text.evaluate(el => window.getComputedStyle(el).color),
				background.evaluate(el => window.getComputedStyle(el).backgroundColor),
			]);
			const foregroundLuminance = relativeLuminance(color);
			const backgroundLuminance = relativeLuminance(backgroundColor);
			const lighter = Math.max(foregroundLuminance, backgroundLuminance);
			const darker = Math.min(foregroundLuminance, backgroundLuminance);
			const ratio = (lighter + 0.05) / (darker + 0.05);
			expect(ratio).toBeGreaterThanOrEqual(4.5);
		}
	});

	test('LanguageToggle navigates between EN and ES routes', async ({ page }) => {
		await page.goto('/');
		const toggleToEs = page.locator('.language-toggle');
		await expect(toggleToEs).toBeVisible();
		await expect(toggleToEs).toHaveText('ES');
		await toggleToEs.click();
		await page.waitForURL('**/es/**');

		const toggleToEn = page.locator('.language-toggle');
		await expect(toggleToEn).toBeVisible();
		await expect(toggleToEn).toHaveText('EN');
		await toggleToEn.click();
		await page.waitForURL('**/');
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
