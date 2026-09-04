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

test('Yukidoke presents privacy as metadata instead of a disabled-looking action', async ({ page }) => {
	await page.setViewportSize({ width: 1440, height: 1000 });
	await page.goto('/');

	const card = page.locator('[data-project-id="yukidoke"]');
	const caseStudy = card.locator('a[href="https://sandovaldavid.com/projects/yukidoke"]');
	const privacyBadge = card.locator('.featured-project-card__privacy-badge');
	const actions = card.locator('.featured-project-card__actions');

	await expect(caseStudy).toBeVisible();
	await expect(caseStudy).toHaveAttribute('data-conversion-position', 'project');
	await expect(privacyBadge).toBeVisible();
	await expect(privacyBadge).toHaveText('Private project');
	await expect(card.locator('.featured-project-card__availability')).toHaveCount(0);
	await expect(actions).toHaveAttribute('data-action-count', '1');
	await expect(actions.locator('> *')).toHaveCount(1);

	const placement = await card.evaluate(element => {
		const heading = element.querySelector('.featured-project-card__heading');
		const badge = element.querySelector('.featured-project-card__privacy-badge');
		const actionsElement = element.querySelector('.featured-project-card__actions');
		if (!(heading instanceof HTMLElement) || !(badge instanceof HTMLElement)) {
			throw new Error('Yukidoke privacy metadata contract is incomplete');
		}
		return {
			badgeInsideHeading: heading.contains(badge),
			badgeInsideActions: actionsElement?.contains(badge) ?? false,
		};
	});

	expect(placement.badgeInsideHeading).toBe(true);
	expect(placement.badgeInsideActions).toBe(false);
});
