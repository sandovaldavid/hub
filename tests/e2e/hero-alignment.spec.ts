import { expect, test } from '@playwright/test';

const routes = ['/', '/es/'] as const;

for (const route of routes) {
	test.describe(`hero alignment for ${route}`, () => {
		test('keeps the desktop identity and social surfaces proportional', async ({ page }) => {
			await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce' });
			await page.setViewportSize({ width: 1280, height: 720 });
			await page.goto(route);

			const profilePanel = page.locator('[data-layout-panel="profile"]');
			const socialPanel = page.locator('[data-layout-panel="social"]');
			const [profileBox, socialBox] = await Promise.all([
				profilePanel.boundingBox(),
				socialPanel.boundingBox(),
			]);

			expect(profileBox).not.toBeNull();
			expect(socialBox).not.toBeNull();
			expect(Math.abs((profileBox?.y ?? 0) - (socialBox?.y ?? 0))).toBeLessThanOrEqual(2);
			expect(Math.abs((profileBox?.height ?? 0) - (socialBox?.height ?? 0))).toBeLessThanOrEqual(
				2
			);
			expect(profileBox?.height ?? 0).toBeLessThanOrEqual(240);

			const avatar = page.locator('.hero-card__avatar-wrapper .avatar-size-3xl');
			const avatarBox = await avatar.boundingBox();
			expect(avatarBox).not.toBeNull();
			expect(avatarBox?.width ?? 0).toBeGreaterThanOrEqual(96);
			expect(avatarBox?.height ?? 0).toBeGreaterThanOrEqual(96);
			await expect(page.locator('.hero-card__username')).toHaveCount(0);
			await expect(page.locator('.hero-card__primary-action--mobile-only')).toBeHidden();
		});

		test('aligns the mobile identity, snapshot and social sections to one content rail', async ({
			page,
		}) => {
			await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce' });
			await page.setViewportSize({ width: 390, height: 844 });
			await page.goto(route);

			const profilePanel = page.locator('[data-layout-panel="profile"]');
			const snapshotPanel = page.locator('[data-layout-panel="profile-snapshot"]');
			const socialPanel = page.locator('[data-layout-panel="social"]');
			const [profileBox, snapshotBox, socialBox] = await Promise.all([
				profilePanel.boundingBox(),
				snapshotPanel.boundingBox(),
				socialPanel.boundingBox(),
			]);

			expect(profileBox).not.toBeNull();
			expect(snapshotBox).not.toBeNull();
			expect(socialBox).not.toBeNull();
			expect(Math.abs((profileBox?.x ?? 0) - (snapshotBox?.x ?? 0))).toBeLessThanOrEqual(2);
			expect(Math.abs((profileBox?.x ?? 0) - (socialBox?.x ?? 0))).toBeLessThanOrEqual(2);
			expect(Math.abs((profileBox?.width ?? 0) - (snapshotBox?.width ?? 0))).toBeLessThanOrEqual(
				2
			);
			expect(Math.abs((profileBox?.width ?? 0) - (socialBox?.width ?? 0))).toBeLessThanOrEqual(2);

			const profileStyles = await profilePanel.evaluate(element => {
				const styles = getComputedStyle(element);
				return {
					backgroundColor: styles.backgroundColor,
					borderRadius: Number.parseFloat(styles.borderTopLeftRadius),
				};
			});
			expect(profileStyles.borderRadius).toBeGreaterThanOrEqual(16);
			expect(profileStyles.backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
			await expect(page.locator('.hero-card__username')).toHaveCount(0);
			await expect(page.locator('.hero-card__primary-action--mobile-only')).toBeVisible();

			const availability = page.locator(
				'.hero-card__identity--compact .hero-card__availability'
			);
			const availabilityStyles = await availability.evaluate(element => {
				const styles = getComputedStyle(element);
				return {
					justifyContent: styles.justifyContent,
					textAlign: styles.textAlign,
				};
			});
			expect(availabilityStyles.justifyContent).toBe('center');
			expect(availabilityStyles.textAlign).toBe('center');
		});
	});
}
