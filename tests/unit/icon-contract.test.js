import { describe, expect, test } from 'bun:test';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = join(dirname(fileURLToPath(import.meta.url)), '../..');
const read = path => readFile(join(repositoryRoot, path), 'utf8');

describe('shared iconography contract', () => {
	test('uses the approved cross-channel technology marks', async () => {
		const [csharp, astro, postgresql] = await Promise.all([
			read('src/shared/assets/tech-icons/csharp.svg'),
			read('src/shared/assets/tech-icons/astro.svg'),
			read('src/shared/assets/tech-icons/postgresql.svg'),
		]);

		expect(csharp).toContain('viewBox="0 0 72 72"');
		expect(csharp).toContain('stop-color="#927BE5"');
		expect(csharp).toContain('stop-color="#512BD4"');
		expect(astro).toContain('viewBox="0 0 256 366"');
		expect(astro).toContain('fill="light-dark(#17191E, #fff)"');
		expect(astro).toContain('fill="#FF5D01"');
		expect(postgresql).toContain('viewBox="0 0 256 264"');
		expect(postgresql).toContain('fill="#336791"');
	});

	test('uses one shared geometry for recurring UI glyphs', async () => {
		const [sun, moon, system, briefcase, email, link, share] = await Promise.all([
			read('src/shared/assets/theme-icons/sun.svg'),
			read('src/shared/assets/theme-icons/moon.svg'),
			read('src/shared/assets/theme-icons/system.svg'),
			read('src/shared/assets/cta-icons/briefcase.svg'),
			read('src/shared/assets/cta-icons/email.svg'),
			read('src/shared/assets/link.svg'),
			read('src/shared/assets/share-icon.svg'),
		]);

		for (const icon of [sun, moon, system, briefcase, email, link, share]) {
			expect(icon).toContain('viewBox="0 0 24 24"');
			expect(icon).toContain('currentColor');
		}

		expect(sun).toContain('M12 12m-4 0a4 4 0 1 0 8 0');
		expect(moon).toContain('a7.5 7.5 0 0 0 7.92 12.446');
		expect(system).toContain('M3 5a1 1 0 0 1 1 -1h16');
		expect(briefcase).toContain('M3 13a20 20 0 0 0 18 0');
		expect(email).toContain('M3 8L8.44992 11.6333');
		expect(link).toContain('M10 13a5 5 0 0 0 7.54.54');
		expect(share).toContain('m8.6 10.5 6.8-4');
	});

	test('uses Logo v2 Micro 24 as the owned Portfolio destination', async () => {
		const [portfolio, socialGrid, ctaData, ctaModel, ctaButtons, footer, socialLinks] =
			await Promise.all([
				read('src/shared/assets/owned-destination/portfolio.svg'),
				read('src/widgets/social-grid/ui/SocialGrid.astro'),
				read('src/data/cta.ts'),
				read('src/shared/model/cta.ts'),
				read('src/widgets/cta-section/ui/CTAButtons.astro'),
				read('src/widgets/site-footer/ui/SiteFooter.astro'),
				read('src/data/social-links.ts'),
			]);

		expect(portfolio).toContain('viewBox="0 0 24 24"');
		expect(portfolio).toContain('M12.436 2.38594');
		expect(portfolio).toContain('light-dark(#172554, #ffffff)');
		expect(portfolio).toContain('light-dark(#1D4ED8, #0080FF)');
		expect(portfolio).toContain('fill="#00D8FF"');

		expect(socialGrid).toContain(
			"PortfolioIcon from '@shared/assets/owned-destination/portfolio.svg'"
		);
		expect(socialGrid).not.toContain('social-platform/website.svg');
		expect(ctaData).toContain("id: 'portfolio'");
		expect(ctaData).toContain("id: 'resume'");
		expect(ctaModel).toContain("export type CtaIcon = 'portfolio' | 'briefcase';");
		expect(ctaButtons).toContain(
			"PortfolioIcon from '@shared/assets/owned-destination/portfolio.svg?raw'"
		);
		expect(ctaButtons).toContain("BriefcaseIcon from '@shared/assets/cta-icons/briefcase.svg?raw'");
		expect(footer).toContain(
			"PortfolioIcon from '@shared/assets/owned-destination/portfolio.svg?raw'"
		);
		expect(socialLinks).toContain("label: 'Portfolio'");
	});
});
