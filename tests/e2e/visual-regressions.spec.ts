import { expect, test } from '@playwright/test';

const THEMES = ['light', 'dark'] as const;

for (const theme of THEMES) {
	test(`${theme} keeps the primary Portfolio route legible`, async ({ page }) => {
		await page.setViewportSize({ width: 1440, height: 1000 });
		await page.addInitScript(selectedTheme => {
			localStorage.setItem('sandovaldavid-theme', selectedTheme);
		}, theme);
		await page.goto('/');

		const portfolioAction = page.locator(
			'.hero-card__primary-action[href="https://sandovaldavid.com"]'
		);
		await expect(portfolioAction).toBeVisible();
		const styles = await portfolioAction.evaluate(element => {
			const computed = getComputedStyle(element);
			return {
				color: computed.color,
				backgroundColor: computed.backgroundColor,
			};
		});

		expect(styles.color).not.toBe(styles.backgroundColor);
		expect(styles.backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
	});
}

test('Yukidoke aligns its case-study route with the private-project state', async ({ page }) => {
	await page.setViewportSize({ width: 1440, height: 1000 });
	await page.goto('/');

	const card = page.locator('[data-project-id="yukidoke"]');
	const caseStudy = card.locator('a[href="https://sandovaldavid.com/projects/yukidoke"]');
	const availability = card.locator('.featured-project-card__availability');
	await expect(caseStudy).toBeVisible();
	await expect(caseStudy).toHaveAttribute('data-conversion-position', 'project');
	await expect(availability).toBeVisible();
	await expect(availability).not.toHaveClass(/featured-project-card__availability--wide/);

	const layout = await card.locator('.featured-project-card__actions').evaluate(element => {
		const caseStudyAction = element.querySelector(
			'a[href="https://sandovaldavid.com/projects/yukidoke"]'
		);
		const privateState = element.querySelector('.featured-project-card__availability');
		if (!(caseStudyAction instanceof HTMLElement) || !(privateState instanceof HTMLElement)) {
			throw new Error('Yukidoke action layout contract is incomplete');
		}

		const actionRect = caseStudyAction.getBoundingClientRect();
		const privateRect = privateState.getBoundingClientRect();
		return {
			topDelta: Math.abs(actionRect.top - privateRect.top),
			widthDelta: Math.abs(actionRect.width - privateRect.width),
		};
	});

	expect(layout.topDelta).toBeLessThanOrEqual(1);
	expect(layout.widthDelta).toBeLessThanOrEqual(1);
});
