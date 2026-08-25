import { describe, expect, test } from 'bun:test';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('Navigation and i18n control contracts (#90, #91)', () => {
	test('ShareButton and ThemeToggle receive localized attributes', async () => {
		const shareContent = await readFile(
			join(repositoryRoot, 'src/features/share-button/ui/ShareButton.astro'),
			'utf8'
		);
		const themeContent = await readFile(
			join(repositoryRoot, 'src/features/theme-toggle/ui/ThemeToggle.astro'),
			'utf8'
		);

		expect(shareContent).toContain('useTranslations');
		expect(shareContent).toContain('data-share-label-webshare');
		expect(shareContent).toContain('data-share-label-clipboard');
		expect(shareContent).toContain('data-share-text');
		expect(themeContent).toContain('useTranslations');
		expect(themeContent).toContain('data-label-light');
		expect(themeContent).toContain('data-label-dark');
	});

	test('LanguageToggle keeps accessible naming and visual tooltip text independent', async () => {
		const [component, styles] = await Promise.all([
			readFile(
				join(repositoryRoot, 'src/features/language-toggle/ui/LanguageToggle.astro'),
				'utf8'
			),
			readFile(
				join(repositoryRoot, 'src/features/language-toggle/ui/LanguageToggle.css'),
				'utf8'
			),
		]);

		expect(component).toContain('useTranslations');
		expect(component).toContain("t('nav.switchLanguage')");
		expect(component).toContain('data-tooltip={switchDescription}');
		expect(component).toContain('data-conversion-event="language_changed"');
		expect(component).toContain('data-conversion-position="navigation"');
		expect(component).toContain('targetLang.toUpperCase()');
		expect(component).not.toContain('aria-label={switchDescription}');
		expect(styles).toContain('content: attr(data-tooltip)');
		expect(styles).not.toContain('content: attr(aria-label)');
	});

	test('HeroCard exposes primary resume CTA across all viewports', async () => {
		const heroAstro = await readFile(
			join(repositoryRoot, 'src/widgets/hero-section/ui/HeroCard.astro'),
			'utf8'
		);
		const heroCss = await readFile(
			join(repositoryRoot, 'src/widgets/hero-section/ui/HeroCard.css'),
			'utf8'
		);

		expect(heroAstro).not.toContain('hero-card__primary-action--mobile-only');
		expect(heroCss).not.toContain('hero-card__primary-action--mobile-only');
	});
});
