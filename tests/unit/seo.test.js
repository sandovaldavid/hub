import { describe, expect, test } from 'bun:test';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = join(dirname(fileURLToPath(import.meta.url)), '../..');
const read = path => readFile(join(repositoryRoot, path), 'utf8');
const readJson = async path => JSON.parse(await read(path));

describe('human-first SEO contract', () => {
	test('keeps localized metadata name-first, durable and semantically aligned', async () => {
		const [english, spanish] = await Promise.all([
			readJson('src/shared/i18n/locales/en.json'),
			readJson('src/shared/i18n/locales/es.json'),
		]);

		expect(english.seo.title).toBe('David Sandoval | Software Engineer');
		expect(spanish.seo.title).toBe('David Sandoval | Ingeniero de Software');
		expect(Object.keys(english.seo).sort()).toEqual(Object.keys(spanish.seo).sort());
		expect(english.seo.keywords).toHaveLength(spanish.seo.keywords.length);

		for (const seo of [english.seo, spanish.seo]) {
			const metadataCopy = [
				seo.title,
				seo.description,
				seo.ogImageAlt,
				seo.twitterImageAlt,
				seo.twitterLabel1,
				seo.twitterData1,
				...seo.keywords,
			].join(' ');

			expect(metadataCopy).toContain('David Sandoval');
			expect(metadataCopy).not.toMatch(/Angular|\.NET|TypeScript/i);
			expect(metadataCopy).not.toMatch(/senior|lead|founder|certified|expert/i);
		}

		expect(english.seo.description).toMatch(/learns continuously/i);
		expect(spanish.seo.description).toMatch(/aprende continuamente/i);
		expect(english.seo.description).toMatch(/systems and products/i);
		expect(spanish.seo.description).toMatch(/sistemas y productos/i);
		expect(english.seo.description).toMatch(/documents decisions/i);
		expect(spanish.seo.description).toMatch(/documenta decisiones/i);
	});

	test('models a localized ProfilePage around one canonical Person', async () => {
		const [layout, structuredData, siteConfig] = await Promise.all([
			read('src/app/layouts/Layout.astro'),
			read('src/data/structured-data.ts'),
			read('src/data/site.config.ts'),
		]);

		expect(layout).toContain('getProfilePageStructuredData');
		expect(layout).not.toContain("'@type': 'Person'");
		expect(structuredData).toContain("'@type': 'ProfilePage'");
		expect(structuredData).toContain("'@type': 'Person'");
		expect(structuredData).toContain("'@type': 'ImageObject'");
		expect(structuredData).toContain("mainEntity: { '@id': personId }");
		expect(structuredData).toContain("mainEntityOfPage: { '@id': pageId }");
		expect(structuredData).toContain('sameAs: [...siteConfig.sameAs]');
		expect(siteConfig).toContain(
			'sameAs: [socialUrls.linkedin, githubUrl, socialUrls.twitter, socialUrls.instagram]'
		);
		expect(siteConfig).not.toMatch(/youtube|tiktok|facebook|whatsapp/i);
	});

	test('keeps social preview metadata synchronized with the PNG asset', async () => {
		const [preview, siteConfig, seoData, layout] = await Promise.all([
			readFile(join(repositoryRoot, 'public/og/og-image.png')),
			read('src/data/site.config.ts'),
			read('src/data/seo.ts'),
			read('src/app/layouts/Layout.astro'),
		]);

		expect(preview.subarray(0, 8).toString('hex')).toBe('89504e470d0a1a0a');
		expect(preview.readUInt32BE(16)).toBe(1200);
		expect(preview.readUInt32BE(20)).toBe(630);
		expect(siteConfig).toContain("path: '/og/og-image.png'");
		expect(siteConfig).toContain("type: 'image/png'");
		expect(siteConfig).toContain('width: 1200');
		expect(siteConfig).toContain('height: 630');
		expect(seoData).toContain('ogImageWidth: siteConfig.socialPreview.width');
		expect(seoData).toContain('ogImageHeight: siteConfig.socialPreview.height');
		expect(layout).toContain('meta property="og:image:width"');
		expect(layout).toContain('meta property="og:image:height"');
	});

	test('preserves canonical sitemap and robots infrastructure', async () => {
		const [astroConfig, robotsRoute, layout] = await Promise.all([
			read('astro.config.mjs'),
			read('src/pages/robots.txt.ts'),
			read('src/app/layouts/Layout.astro'),
		]);

		expect(astroConfig).toContain("site: 'https://hub.sandovaldavid.com'");
		expect(astroConfig).toContain('integrations: [sitemap()]');
		expect(robotsRoute).toContain("new URL('sitemap-index.xml', site)");
		expect(robotsRoute).toContain('User-agent: *');
		expect(robotsRoute).toContain('Allow: /');
		expect(layout).toContain(
			"const sitemapUrl = new URL('/sitemap-index.xml', siteConfig.url).href;"
		);
		expect(layout).toContain('<link rel="sitemap" href={sitemapUrl} />');
		expect(layout).toContain('hreflang="x-default"');
	});

	test('documents every audit classification and the selected alternatives', async () => {
		const audit = await read('docs/seo.md');

		for (const classification of ['Critical', 'High', 'Medium', 'Low', 'Strength', 'Unconfirmed']) {
			expect(audit).toContain(`| ${classification} |`);
		}

		expect(audit).toContain('### Link Hub');
		expect(audit).toContain('### Portfolio');
		expect(audit).toContain('### English title alternatives');
		expect(audit).toContain('### Spanish title alternatives');
		expect(audit).toContain('### English description alternatives');
		expect(audit).toContain('### Spanish description alternatives');
		expect(audit).toContain('ProfilePage (localized Hub URL)');
		expect(audit).toContain('Real platform crops and cache behavior remain manual evidence');
	});
});
