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

				const main = page.locator('#main-content');
				await expect(main).toBeVisible();

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
				const [profilePanelBox, socialPanelBox] = await Promise.all([
					profilePanel.boundingBox(),
					socialPanel.boundingBox(),
				]);
				expect(profilePanelBox).not.toBeNull();
				expect(socialPanelBox).not.toBeNull();
				expect(
					Math.abs((profilePanelBox?.y ?? 0) - (socialPanelBox?.y ?? 0))
				).toBeLessThanOrEqual(2);
				expect(
					Math.abs((profilePanelBox?.height ?? 0) - (socialPanelBox?.height ?? 0))
				).toBeLessThanOrEqual(2);
				await expect(page.locator('#social-heading')).toBeVisible();

				const socialItems = page.locator('.social-grid__item');
				await expect(socialItems).toHaveCount(5);
				await expect(page.locator('.social-grid__item--wide')).toHaveCount(1);
				await expect(socialItems.last()).toHaveAttribute('data-social-wide', 'true');

				const socialBoxes = await socialItems.evaluateAll(elements =>
					elements.map(element => {
						const box = element.getBoundingClientRect();
						return { height: box.height, width: box.width };
					})
				);
				const socialHeights = socialBoxes.map(box => box.height);
				expect(Math.max(...socialHeights) - Math.min(...socialHeights)).toBeLessThanOrEqual(2);
				expect(Math.max(...socialHeights)).toBeLessThanOrEqual(112);
				expect(socialBoxes.at(-1)?.width ?? 0).toBeGreaterThan(socialBoxes[0].width * 1.8);

				const primaryActions = page.locator('[data-layout-column="primary-actions"]');
				const contact = page.locator('[data-layout-column="contact"]');
				const [primaryBox, contactBox] = await Promise.all([
					primaryActions.boundingBox(),
					contact.boundingBox(),
				]);
				expect(primaryBox).not.toBeNull();
				expect(contactBox).not.toBeNull();
				expect(Math.abs((primaryBox?.y ?? 0) - (contactBox?.y ?? 0))).toBeLessThanOrEqual(2);
				expect(Math.abs((primaryBox?.height ?? 0) - (contactBox?.height ?? 0))).toBeLessThanOrEqual(
					2
				);

				const actionRowCount = await page
					.locator('.cta-buttons--vertical .cta-buttons__link')
					.evaluateAll(elements => {
						const rows = elements.map(element => Math.round(element.getBoundingClientRect().top));
						return new Set(rows).size;
					});
				expect(actionRowCount).toBe(2);

				const projectCards = page.locator('[data-project-card]');
				await expect(projectCards).toHaveCount(3);
				await expect(page.locator('[data-project-evidence]')).toHaveCount(9);
				const projectRowCount = await projectCards.evaluateAll(elements => {
					const rows = elements.map(element => Math.round(element.getBoundingClientRect().top));
					return new Set(rows).size;
				});
				expect(projectRowCount).toBe(viewport.width < 1280 ? 2 : 1);

				const projectRadii = await projectCards.evaluateAll(elements =>
					elements.map(element => Number.parseFloat(getComputedStyle(element).borderTopLeftRadius))
				);
				expect(projectRadii.every(radius => radius >= 16)).toBe(true);

				const skillRowCount = await page.locator('[data-skill-item]').evaluateAll(elements => {
					const rowPositions = elements.map(element =>
						Math.round(element.getBoundingClientRect().top)
					);
					return new Set(rowPositions).size;
				});
				expect(skillRowCount).toBeGreaterThan(1);
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

			const metadataItems = page.locator('.hero-card__metadata-item');
			await expect(metadataItems).toHaveCount(3);
			const metadataBoxes = await metadataItems.evaluateAll(elements =>
				elements.map(element => {
					const box = element.getBoundingClientRect();
					return { y: box.y, width: box.width };
				})
			);
			expect(Math.abs(metadataBoxes[0].y - metadataBoxes[1].y)).toBeLessThanOrEqual(2);
			expect(metadataBoxes[2].y).toBeGreaterThan(metadataBoxes[0].y);
			expect(metadataBoxes[2].width).toBeGreaterThan(metadataBoxes[0].width * 1.8);

			const socialWidths = await page.locator('.social-grid__item').evaluateAll(elements =>
				elements.map(element => element.getBoundingClientRect().width)
			);
			expect(Math.max(...socialWidths) - Math.min(...socialWidths)).toBeLessThanOrEqual(2);

			const mobileActionRows = await page
				.locator('.cta-buttons--vertical .cta-buttons__link')
				.evaluateAll(elements => {
					const rows = elements.map(element => Math.round(element.getBoundingClientRect().top));
					return new Set(rows).size;
				});
			expect(mobileActionRows).toBe(4);

			const projectCards = page.locator('[data-project-card]');
			await expect(projectCards).toHaveCount(3);
			await expect(page.locator('[data-project-evidence]')).toHaveCount(9);
			const projectIndexes = await page.locator('.weekly-project-card__index').allTextContents();
			expect(projectIndexes.map(index => index.slice(-2))).toEqual(['01', '02', '03']);

			const mobileProjectRows = await projectCards.evaluateAll(elements => {
				const rows = elements.map(element => Math.round(element.getBoundingClientRect().top));
				return new Set(rows).size;
			});
			expect(mobileProjectRows).toBe(3);

			const projectActionRows = await projectCards.evaluateAll(cards =>
				cards.map(card => {
					const actions = Array.from(
						card.querySelectorAll<HTMLElement>('.weekly-project-card__actions > *')
					);
					const rows = actions.map(action => Math.round(action.getBoundingClientRect().top));
					return new Set(rows).size;
				})
			);
			expect(projectActionRows).toEqual([1, 1, 1]);

			const firstSkillRowCount = await page.locator('[data-skill-item]').evaluateAll(elements => {
				const firstTop = Math.round(elements[0].getBoundingClientRect().top);
				return elements.filter(
					element => Math.abs(Math.round(element.getBoundingClientRect().top) - firstTop) <= 2
				).length;
			});
			expect(firstSkillRowCount).toBe(4);
		});
	});
}
