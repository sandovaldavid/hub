// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
	site: 'https://hub.sandovaldavid.com',
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
