// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
	site: 'https://hub.sandovaldavid.com',
	/*
	 * The Identity Core declares JetBrains Mono for display/headings/technical
	 * and Inter for reading. Astro downloads both from Fontsource at build time
	 * and serves them from this origin, so the declared typography is what every
	 * visitor actually renders instead of an OS-dependent fallback — and no
	 * third-party font CDN is contacted at runtime.
	 *
	 * The `@font-face` family names match the second entry of each stack in
	 * global.css ('Inter', 'JetBrains Mono'), so the channel font tokens resolve
	 * to the downloaded faces without restating them here.
	 *
	 * Weights cover 400-800, the range the components actually use.
	 */
	fonts: [
		{
			name: 'Inter',
			cssVariable: '--font-inter',
			provider: fontProviders.fontsource(),
			weights: ['400 800'],
			styles: ['normal'],
			subsets: ['latin'],
			fallbacks: ['system-ui', 'sans-serif'],
		},
		{
			name: 'JetBrains Mono',
			cssVariable: '--font-jetbrains-mono',
			provider: fontProviders.fontsource(),
			weights: ['400 800'],
			styles: ['normal'],
			subsets: ['latin'],
			fallbacks: ['monospace'],
		},
	],
	i18n: {
		defaultLocale: 'en',
		locales: ['en', 'es'],
		routing: {
			prefixDefaultLocale: false,
		},
	},
	integrations: [
		sitemap({
			i18n: {
				defaultLocale: 'en',
				locales: {
					en: 'en-US',
					es: 'es-PE',
				},
			},
			serialize(item) {
				return /\/404\/?$/.test(item.url) ? undefined : item;
			},
		}),
	],
	vite: {
		plugins: [tailwindcss()],
	},
});
