import { describe, expect, test } from 'bun:test';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getFaviconPath, THEME_FAVICON_PATHS } from '../../src/entities/theme/lib/theme-assets.ts';

const repositoryRoot = join(dirname(fileURLToPath(import.meta.url)), '../..');
const read = path => readFile(join(repositoryRoot, path), 'utf8');

describe('theme favicon contract', () => {
	test('keeps Logo v2 favicons and removes retired V1 logo sources', async () => {
		const [darkFavicon, lightFavicon] = await Promise.all([
			read('public/favicon.dark.svg'),
			read('public/favicon.light.svg'),
		]);

		expect(darkFavicon).not.toBe(lightFavicon);
		expect(existsSync(join(repositoryRoot, 'public/favicon.svg'))).toBe(false);
		expect(existsSync(join(repositoryRoot, 'public/logo/sandovaldavid.svg'))).toBe(false);
		expect(existsSync(join(repositoryRoot, 'public/logo/sandovaldavid.light.svg'))).toBe(false);
	});

	test('uses one effective-theme mapping for favicon updates', async () => {
		const [layout, themeManager, themeAssets] = await Promise.all([
			read('src/app/layouts/Layout.astro'),
			read('src/entities/theme/lib/theme-manager.ts'),
			read('src/entities/theme/lib/theme-assets.ts'),
		]);

		expect(THEME_FAVICON_PATHS).toEqual({
			light: '/favicon.light.svg',
			dark: '/favicon.dark.svg',
		});
		expect(getFaviconPath('light')).toBe('/favicon.light.svg');
		expect(getFaviconPath('dark')).toBe('/favicon.dark.svg');
		expect(layout.match(/rel="icon"/g)).toHaveLength(1);
		expect(layout).toContain('id="site-favicon"');
		expect(layout).toContain('href="/favicon.dark.svg"');
		expect(layout).not.toContain('href="/favicon.svg"');
		expect(themeManager).toContain('THEME_FAVICON_PATHS');
		expect(themeManager).toContain('updateFavicon(effectiveTheme)');
		expect(themeAssets).toContain("light: '/favicon.light.svg'");
		expect(themeAssets).toContain("dark: '/favicon.dark.svg'");
	});
});
