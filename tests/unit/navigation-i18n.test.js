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

	test('LanguageToggle component provides discoverable EN/ES switching', async () => {
		const langTogglePath = join(
			repositoryRoot,
			'src/features/language-toggle/ui/LanguageToggle.astro'
		);
		const content = await readFile(langTogglePath, 'utf8');

		expect(content).toContain('useTranslations');
		expect(content).toContain("t('nav.switchLanguage')");
		expect(content).toContain('data-conversion-event="language_changed"');
		expect(content).toContain('data-conversion-position="navigation"');
		expect(content).toContain('targetLang.toUpperCase()');
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
