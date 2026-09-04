import { expect, test } from '@playwright/test';

const routes = ['/', '/es/'] as const;
const desktopViewports = [
	{ width: 1024, height: 768 },
	{ width: 1280, height: 720 },
	{ width: 1920, height: 1080 },
] as const;

for (const route of routes) {
	test.describe(`responsive layout for ${route}`, () => {
		test('keeps the desktop hierarchy balanced without horizontal overflow', async ({ page }) => {
			await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'reduce' });

			for (const viewport of desktopViewports) {
				await page.setViewportSize(viewport);
				await page.goto(route);

				const overflow = await page.locator('html').evaluate(element => ({
					clientWidth: element.clientWidth,
					scrollWidth: element.scrollWidth,
				}));
				expect(
					overflow.scrollWidth,
					`${route} must not overflow horizontally at ${viewport.width}px`
				).toBeLessThanOrEqual(overflow.clientWidth);

				const profilePanel = page.locator('[data-layout-panel="profile"]');
				const socialPanel = page.locator('[data-layout-panel="social"]');
				const snapshotPanel = page.locator('[data-layout-panel="profile-snapshot"]');
				const [profilePanelBox, socialPanelBox, snapshotPanelBox] = await Promise.all([
					profilePanel.boundingBox(),
					socialPanel.boundingBox(),
					snapshotPanel.boundingBox(),
				]);
				expect(profilePanelBox).not.toBeNull();
				expect(socialPanelBox).not.toBeNull();
				expect(snapshotPanelBox).not.toBeNull();
				expect(profilePanelBox?.height ?? 0).toBeLessThanOrEqual(300);
				expect(socialPanelBox?.height ?? 0).toBeLessThanOrEqual(320);

				const [shareBox, themeBox] = await Promise.all([
					page.locator('#share-button').boundingBox(),
					page.locator('#theme-toggle').boundingBox(),
				]);
				expect(shareBox).not.toBeNull();
				expect(themeBox).not.toBeNull();
				expect(Math.abs((shareBox?.x ?? 0) - (profilePanelBox?.x ?? 0))).toBeLessThanOrEqual(2);
				const themeRight = (themeBox?.x ?? 0) + (themeBox?.width ?? 0);
				const socialRight = (socialPanelBox?.x ?? 0) + (socialPanelBox?.width ?? 0);
				expect(Math.abs(themeRight - socialRight)).toBeLessThanOrEqual(2);
				expect((shareBox?.y ?? 0) + (shareBox?.height ?? 0)).toBeLessThanOrEqual(
					profilePanelBox?.y ?? 0
				);

				const avatar = page.locator('.hero-card__avatar-wrapper .avatar-size-5xl');
				const avatarBox = await avatar.boundingBox();
				expect(avatarBox).not.toBeNull();
				expect(avatarBox?.width ?? 0).toBeGreaterThanOrEqual(200);
				expect(avatarBox?.height ?? 0).toBeGreaterThanOrEqual(200);

				const identityActions = await page.locator('.hero-card__identity-actions').boundingBox();
				expect(identityActions).not.toBeNull();
				expect(identityActions?.width ?? 0).toBeLessThanOrEqual(550);

				const profileCenterY = (profilePanelBox?.y ?? 0) + (profilePanelBox?.height ?? 0) / 2;
				const socialCenterY = (socialPanelBox?.y ?? 0) + (socialPanelBox?.height ?? 0) / 2;
				expect(Math.abs(profileCenterY - socialCenterY)).toBeLessThanOrEqual(4);
				expect(snapshotPanelBox?.y ?? 0).toBeGreaterThan(
					Math.max(
						(profilePanelBox?.y ?? 0) + (profilePanelBox?.height ?? 0),
						(socialPanelBox?.y ?? 0) + (socialPanelBox?.height ?? 0)
					)
				);

				await expect(page.locator('#profile-snapshot-heading')).toBeVisible();
				await expect(page.locator('#social-heading')).toBeVisible();
				await expect(page.locator('#cta-heading')).toBeVisible();
				await expect(page.locator('#skills-heading')).toHaveCount(0);

				const snapshotMetadata = page.locator('.profile-snapshot__metadata-item');
				await expect(snapshotMetadata).toHaveCount(3);
				await expect(snapshotMetadata.locator('dt').first()).toHaveClass(/sr-only/);

				const socialItems = page.locator('.social-grid__item');
				await expect(socialItems).toHaveCount(6);
				await expect(page.locator('.social-grid__item--wide')).toHaveCount(0);
				const socialRowCount = await socialItems.evaluateAll(elements => {
					const rows = elements.map(element => Math.round(element.getBoundingClientRect().top));
					return new Set(rows).size;
				});
				expect(socialRowCount).toBe(3);

				const primaryActions = page.locator('[data-layout-column="primary-actions"]');
				const contact = page.locator('[data-layout-column="contact"]');
				const [primaryBox, contactBox] = await Promise.all([
					primaryActions.boundingBox(),
					contact.boundingBox(),
				]);
				expect(primaryBox).not.toBeNull();
				expect(contactBox).not.toBeNull();
				expect(Math.abs((primaryBox?.y ?? 0) - (contactBox?.y ?? 0))).toBeLessThanOrEqual(2);

				const primaryCtaLinks = page.locator('.cta-buttons--vertical .cta-buttons__link');
				await expect(primaryCtaLinks).toHaveCount(1);
				const actionRowCount = await primaryCtaLinks.evaluateAll(elements => {
					const rows = elements.map(element => Math.round(element.getBoundingClientRect().top));
					return new Set(rows).size;
				});
				expect(actionRowCount).toBe(1);

				const heroPortfolio = page.locator(
					'.hero-card__primary-action[data-conversion-item="portfolio"]'
				);
				await expect(heroPortfolio).toHaveCount(1);
				await expect(heroPortfolio).toBeVisible();
				await expect(heroPortfolio).toHaveAttribute('data-conversion-event', 'portfolio_opened');
				await expect(
					page.locator('.cta-buttons__link[data-conversion-item="portfolio"]')
				).toHaveCount(0);
				await expect(page.locator('.cta-buttons__link[data-conversion-item="resume"]')).toHaveCount(
					1
				);
				await expect(page.locator('[data-conversion-item="projects"]')).toHaveCount(0);

				const projectCards = page.locator('[data-project-card]');
				await expect(projectCards).toHaveCount(3);
				await expect(page.locator('[data-project-evidence]')).toHaveCount(0);
				await expect(page.locator('[data-skill-item]')).toHaveCount(0);
				const projectRowCount = await projectCards.evaluateAll(elements => {
					const rows = elements.map(element => Math.round(element.getBoundingClientRect().top));
					return new Set(rows).size;
				});
				expect(projectRowCount).toBe(viewport.width >= 1280 ? 1 : 2);

				const projectRadii = await projectCards.evaluateAll(elements =>
					elements.map(element => Number.parseFloat(getComputedStyle(element).borderTopLeftRadius))
				);
				expect(projectRadii.every(radius => radius >= 16)).toBe(true);
			}
		});

		test('keeps the iPhone 12 Pro layout compact and readable', async ({ page }) => {
			await page.emulateMedia({ reducedMotion: 'reduce' });
			await page.setViewportSize({ width: 390, height: 844 });
			await page.goto(route);

			const overflow = await page.locator('html').evaluate(element => ({
				clientWidth: element.clientWidth,
				scrollWidth: element.scrollWidth,
			}));
			expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth);

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
			expect(snapshotBox?.y ?? 0).toBeGreaterThan((profileBox?.y ?? 0) + (profileBox?.height ?? 0));
			expect(socialBox?.y ?? 0).toBeGreaterThan((snapshotBox?.y ?? 0) + (snapshotBox?.height ?? 0));
			await expect(page.locator('.hero-card__primary-action')).toBeVisible();

			const metadataItems = page.locator('.profile-snapshot__metadata-item');
			await expect(metadataItems).toHaveCount(3);

			const mobileSocialItems = page.locator('.social-grid__item');
			await expect(mobileSocialItems).toHaveCount(6);
			const mobileSocialRows = await mobileSocialItems.evaluateAll(elements => {
				const rows = elements.map(element => Math.round(element.getBoundingClientRect().top));
				return new Set(rows).size;
			});
			expect(mobileSocialRows).toBe(3);

			const mobileActionRows = await page
				.locator('.cta-buttons--vertical .cta-buttons__link')
				.evaluateAll(elements => {
					const rows = elements.map(element => Math.round(element.getBoundingClientRect().top));
					return new Set(rows).size;
				});
			expect(mobileActionRows).toBe(1);

			const projectCards = page.locator('[data-project-card]');
			await expect(projectCards).toHaveCount(3);
			await expect(page.locator('[data-project-evidence]')).toHaveCount(0);
			await expect(page.locator('.featured-project-card__index')).toHaveCount(0);
			await expect(page.locator('[data-skill-item]')).toHaveCount(0);

			const mobileProjectRows = await projectCards.evaluateAll(elements => {
				const rows = elements.map(element => Math.round(element.getBoundingClientRect().top));
				return new Set(rows).size;
			});
			expect(mobileProjectRows).toBe(3);

			const projectActionRows = await projectCards.evaluateAll(cards =>
				cards.map(card => {
					const actions = Array.from(
						card.querySelectorAll<HTMLElement>('.featured-project-card__actions > *')
					);
					const rows = actions.map(action => Math.round(action.getBoundingClientRect().top));
					return new Set(rows).size;
				})
			);
			expect(projectActionRows).toEqual([1, 1, 1]);
		});
	});
}
