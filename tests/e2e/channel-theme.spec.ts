import { test, expect, type Page, type TestInfo } from '@playwright/test';

const THEMES = ['light', 'dark'] as const;
const ROUTES = [
	{ path: '/', locale: 'en' },
	{ path: '/es/', locale: 'es' },
] as const;
const VIEWPORTS = [
	{ name: 'desktop', width: 1440, height: 1000 },
	{ name: 'mobile', width: 390, height: 844 },
] as const;

async function applyTheme(page: Page, theme: (typeof THEMES)[number]) {
	await page.addInitScript(selectedTheme => {
		localStorage.setItem('sandovaldavid-theme', selectedTheme);
	}, theme);
}

async function waitForVisualAssets(page: Page) {
	await page.evaluate(async () => {
		await document.fonts.ready;
		await Promise.all(
			Array.from(document.images).map(
				image =>
					new Promise<void>(resolve => {
						if (image.complete) {
							resolve();
							return;
						}
						image.addEventListener('load', () => resolve(), { once: true });
						image.addEventListener('error', () => resolve(), { once: true });
					})
			)
		);
	});
}

async function attachScreenshot(
	page: Page,
	testInfo: TestInfo,
	name: string,
	options: { fullPage?: boolean } = { fullPage: true }
) {
	const body = await page.screenshot(options);
	await testInfo.attach(name, { body, contentType: 'image/png' });
}

async function readContrastRatio(page: Page, selector: string) {
	return page
		.locator(selector)
		.first()
		.evaluate(element => {
			const parseRgb = (value: string) => {
				const channels = value
					.match(/[\d.]+/g)
					?.slice(0, 3)
					.map(Number);
				if (!channels || channels.length !== 3) throw new Error(`Unsupported color: ${value}`);
				return channels.map(channel => channel / 255);
			};
			const luminance = (channels: number[]) => {
				const linear = channels.map(channel =>
					channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
				);
				return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
			};

			const style = window.getComputedStyle(element);
			const foreground = luminance(parseRgb(style.color));
			const background = luminance(parseRgb(style.backgroundColor));
			const lighter = Math.max(foreground, background);
			const darker = Math.min(foreground, background);
			return (lighter + 0.05) / (darker + 0.05);
		});
}

test.describe('Link Hub Compact channel theme', () => {
	for (const route of ROUTES) {
		for (const theme of THEMES) {
			for (const viewport of VIEWPORTS) {
				test(`${route.locale} ${theme} ${viewport.name} preserves identity and contrast`, async ({
					page,
				}, testInfo) => {
					await page.setViewportSize({ width: viewport.width, height: viewport.height });
					await applyTheme(page, theme);
					await page.goto(route.path, { waitUntil: 'domcontentloaded' });
					await waitForVisualAssets(page);

					await expect(page.locator('html')).toHaveAttribute('lang', route.locale);
					await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
					await expect(page.locator('h1#hero-heading')).toBeVisible();
					await expect(page.locator('[role="img"][aria-label*="Profile photo"]')).toBeVisible();

					const tokenContract = await page.evaluate(() => {
						const root = getComputedStyle(document.documentElement);
						return {
							canvas: root.getPropertyValue('--channel-background-canvas').trim(),
							surface: root.getPropertyValue('--channel-surface-default').trim(),
							content: root.getPropertyValue('--channel-content-default').trim(),
							accent: root.getPropertyValue('--channel-accent-primary').trim(),
							focus: root.getPropertyValue('--focus-ring').trim(),
						};
					});
					expect(Object.values(tokenContract).every(Boolean)).toBe(true);

					const overflow = await page.evaluate(() => ({
						scrollWidth: document.documentElement.scrollWidth,
						clientWidth: document.documentElement.clientWidth,
					}));
					expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth + 1);

					const primaryButton = page.locator('.button-primary').first();
					await expect(primaryButton).toBeVisible();
					expect(await readContrastRatio(page, '.button-primary')).toBeGreaterThanOrEqual(4.5);

					const themeToggle = page.locator('.theme-toggle');
					await themeToggle.focus();
					const focus = await themeToggle.evaluate(element => {
						const style = getComputedStyle(element);
						return {
							width: style.outlineWidth,
							style: style.outlineStyle,
							color: style.outlineColor,
						};
					});
					expect(focus.width).not.toBe('0px');
					expect(focus.style).not.toBe('none');
					expect(focus.color).not.toBe('rgba(0, 0, 0, 0)');

					await attachScreenshot(page, testInfo, `after-${route.locale}-${theme}-${viewport.name}`);

					const baselineUrl = process.env.BASELINE_URL;
					if (baselineUrl) {
						const baselinePage = await page.context().newPage();
						await baselinePage.setViewportSize({ width: viewport.width, height: viewport.height });
						await applyTheme(baselinePage, theme);
						await baselinePage.goto(new URL(route.path, baselineUrl).href, {
							waitUntil: 'domcontentloaded',
						});
						await waitForVisualAssets(baselinePage);
						await attachScreenshot(
							baselinePage,
							testInfo,
							`before-${route.locale}-${theme}-${viewport.name}`
						);
						await baselinePage.close();
					}
				});
			}
		}
	}
});
