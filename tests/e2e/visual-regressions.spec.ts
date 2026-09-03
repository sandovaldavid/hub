import { expect, test } from '@playwright/test';

const THEMES = ['light', 'dark'] as const;

for (const theme of THEMES) {
	test(`${theme} keeps the Portfolio hover and Astro mark legible`, async ({ page }) => {
		await page.setViewportSize({ width: 1440, height: 1000 });
		await page.addInitScript(selectedTheme => {
			localStorage.setItem('sandovaldavid-theme', selectedTheme);
		}, theme);
		await page.goto('/');

		const astroPrimaryPath = page.locator('[data-skill-item][title="Astro"] svg path').first();
		await expect(astroPrimaryPath).toBeVisible();
		const astroFill = await astroPrimaryPath.evaluate(element => getComputedStyle(element).fill);
		expect(astroFill).toBe(theme === 'light' ? 'rgb(23, 25, 30)' : 'rgb(255, 255, 255)');

		const portfolioButton = page.locator('.social-button--website').first();
		await expect(portfolioButton).toBeVisible();
		await portfolioButton.hover();
		await page.waitForTimeout(250);

		const hoverContract = await portfolioButton.evaluate(element => {
			const label = element.querySelector('.social-button__label');
			const paths = element.querySelectorAll('.social-button__icon--website path');
			if (!label || paths.length === 0) throw new Error('Portfolio hover contract is incomplete');

			return {
				labelColor: getComputedStyle(label).color,
				pathFills: Array.from(paths, path => getComputedStyle(path).fill),
			};
		});

		expect(hoverContract.pathFills.every(fill => fill === hoverContract.labelColor)).toBe(true);
	});
}

test('Yukidoke aligns its case-study action with the private-project state', async ({ page }) => {
	await page.setViewportSize({ width: 1440, height: 1000 });
	await page.goto('/');

	const card = page.locator('[data-project-id="yukidoke"]');
	const caseStudy = card.locator('[data-conversion-position="case-study"]');
	const availability = card.locator('.featured-project-card__availability');
	await expect(caseStudy).toBeVisible();
	await expect(availability).toBeVisible();
	await expect(availability).not.toHaveClass(/featured-project-card__availability--wide/);

	const layout = await card.locator('.featured-project-card__actions').evaluate(element => {
		const caseStudyAction = element.querySelector('[data-conversion-position="case-study"]');
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
