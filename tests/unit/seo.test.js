import { describe, expect, test } from 'bun:test';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getSEO } from '../../src/data/seo.ts';
import { getProfilePageStructuredData } from '../../src/data/structured-data.ts';

const repositoryRoot = join(dirname(fileURLToPath(import.meta.url)), '../..');
const read = path => readFile(join(repositoryRoot, path), 'utf8');
const readJson = async path => JSON.parse(await read(path));

describe('human-first SEO contract', () => {
	test('keeps localized metadata name-first, durable and semantically aligned', async () => {
		const [english, spanish, seoData, layout] = await Promise.all([
			readJson('src/shared/i18n/locales/en.json'),
			readJson('src/shared/i18n/locales/es.json'),
			read('src/data/seo.ts'),
			read('src/app/layouts/Layout.astro'),
		]);

		expect(english.seo.title).toBe('David Sandoval | Software Engineer');
		expect(spanish.seo.title).toBe('David Sandoval | Ingeniero de Software');
		expect(Object.keys(english.seo).sort()).toEqual(Object.keys(spanish.seo).sort());

		for (const seo of [english.seo, spanish.seo]) {
			const metadataCopy = [
				seo.title,
				seo.description,
				seo.socialDescription,
				seo.ogImageAlt,
				seo.twitterImageAlt,
				seo.twitterLabel1,
				seo.twitterData1,
			].join(' ');

			expect(metadataCopy).toContain('David Sandoval');
			expect(metadataCopy).not.toMatch(/Angular|\.NET|TypeScript/i);
			expect(metadataCopy).not.toMatch(/senior|lead|founder|certified|expert/i);
			expect(metadataCopy).not.toMatch(/evidence|evidencia|unconfirmed|no confirmada/i);
			expect(seo).not.toHaveProperty('keywords');
		}

		expect(english.seo.description).toMatch(
			/David Sandoval.*Software Engineer.*maintainable backend systems.*reliable APIs.*developer tooling/i
		);
		expect(spanish.seo.description).toMatch(
			/David Sandoval.*Ingeniero de Software.*enfoque backend.*frontend.*sistemas mantenibles.*APIs.*herramientas para desarrolladores/i
		);
		expect(english.seo.socialDescription).toMatch(
			/^I'm David Sandoval, a Software Engineer.*backend focus.*frontend experience/i
		);
		expect(spanish.seo.socialDescription).toMatch(
			/^Soy David Sandoval, Ingeniero de Software.*enfoque backend.*frontend/i
		);
		expect(seoData).toContain('socialDescription: t.socialDescription');
		expect(seoData).not.toContain('keywords:');
		expect(seoData).not.toContain('googlebot:');
		expect(layout).toContain('<meta name="description" content={description} />');
		expect(layout).toContain('<meta property="og:description" content={socialDescription} />');
		expect(layout).toContain('<meta name="twitter:description" content={socialDescription} />');
		expect(layout).not.toContain('meta name="keywords"');
		expect(layout).not.toContain('meta name="googlebot"');
		expect(layout).not.toContain('meta name="title"');
	});

	test('models a localized ProfilePage around one canonical Person and portrait', async () => {
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
			readFile(join(repositoryRoot, 'public/og/og_dark.png')),
			read('src/data/site.config.ts'),
			read('src/data/seo.ts'),
			read('src/app/layouts/Layout.astro'),
		]);

		expect(preview.subarray(0, 8).toString('hex')).toBe('89504e470d0a1a0a');
		expect(preview.readUInt32BE(16)).toBe(1200);
		expect(preview.readUInt32BE(20)).toBe(630);
		expect(siteConfig).toContain("path: '/og/og_dark.png'");
		expect(siteConfig).toContain("type: 'image/png'");
		expect(siteConfig).toContain('width: 1200');
		expect(siteConfig).toContain('height: 630');
		expect(seoData).toContain('ogImageWidth: siteConfig.socialPreview.width');
		expect(seoData).toContain('ogImageHeight: siteConfig.socialPreview.height');
		expect(layout).toContain('meta property="og:image:width"');
		expect(layout).toContain('meta property="og:image:height"');
	});

	test('preserves canonical sitemap and robots infrastructure with localized alternates', async () => {
		const [astroConfig, robotsRoute, layout] = await Promise.all([
			read('astro.config.mjs'),
			read('src/pages/robots.txt.ts'),
			read('src/app/layouts/Layout.astro'),
		]);

		expect(astroConfig).toContain("site: 'https://hub.sandovaldavid.com'");
		expect(astroConfig).toContain("defaultLocale: 'en'");
		expect(astroConfig).toContain("en: 'en-US'");
		expect(astroConfig).toContain("es: 'es-PE'");
		expect(astroConfig).toContain('/\\/404\\/?$/');
		expect(robotsRoute).toContain("new URL('sitemap-index.xml', site)");
		expect(robotsRoute).toContain('User-agent: *');
		expect(robotsRoute).toContain('Allow: /');
		expect(layout).toContain(
			"const sitemapUrl = new URL('/sitemap-index.xml', siteConfig.url).href;"
		);
		expect(layout).toContain('<link rel="sitemap" href={sitemapUrl} />');
		expect(layout).toContain('hreflang="x-default"');
	});

	test('keeps custom 404 pages out of the canonical identity graph', async () => {
		const [notFound, layout] = await Promise.all([
			read('src/pages/404.astro'),
			read('src/app/layouts/Layout.astro'),
		]);

		expect(notFound).toContain("robots: 'noindex, follow'");
		expect(notFound).toContain('emitCanonical={false}');
		expect(notFound).toContain('emitStructuredData={false}');
		expect(notFound).toContain('showShare={false}');
		expect(notFound).toContain('socialDescription:');
		expect(layout).toContain('emitCanonical?: boolean');
		expect(layout).toContain('emitStructuredData?: boolean');
		expect(layout).toContain(
			'{emitCanonical && <link rel="canonical" href={finalCanonicalUrl} />}'
		);
		expect(layout).toContain('{jsonLd && <script is:inline type="application/ld+json"');
	});

	test('points Person.image at the portrait, not at the page social preview', () => {
		const graph = getProfilePageStructuredData({
			title: 'Title',
			description: 'Description',
			lang: 'en',
			canonicalUrl: 'https://hub.sandovaldavid.com/',
			imageUrl: 'https://hub.sandovaldavid.com/og/og_dark.png',
			imageAlt: 'social preview alt',
			portraitAlt: 'portrait alt',
		})['@graph'];

		const nodeById = Object.fromEntries(graph.map(node => [node['@id'], node]));
		const page = graph.find(node => node['@type'] === 'ProfilePage');
		const person = graph.find(node => node['@type'] === 'Person');

		// The two images are deliberately different nodes: the page's primary
		// image is the 1200x630 social card, the person's is David's portrait.
		expect(person.image['@id']).not.toBe(page.primaryImageOfPage['@id']);

		const portrait = nodeById[person.image['@id']];
		expect(portrait.url).toBe('https://hub.sandovaldavid.com/profile/perfil.webp');
		expect(portrait.contentUrl).toBe(portrait.url);
		expect(portrait.caption).toBe('portrait alt');
		expect(portrait.width).toBe(portrait.height);

		const socialPreview = nodeById[page.primaryImageOfPage['@id']];
		expect(socialPreview.url).toBe('https://hub.sandovaldavid.com/og/og_dark.png');
		expect(socialPreview.width).not.toBe(socialPreview.height);
	});

	test('returns social copy separately without restoring legacy keywords', () => {
		for (const lang of ['en', 'es']) {
			const seo = getSEO(lang);
			expect(seo).toHaveProperty('socialDescription');
			expect(seo.socialDescription).not.toBe(seo.description);
			expect(seo).not.toHaveProperty('keywords');
		}
	});

	test('keeps SEO implementation ownership discoverable without a historical audit document', async () => {
		const architecture = await read('docs/architecture.md');

		expect(architecture).toContain('src/data/seo.ts');
		expect(architecture).toContain('src/data/structured-data.ts');
		expect(architecture).toContain('src/shared/i18n/locales/*.json');
		expect(architecture).toContain('src/data/site.config.ts');
		// #140 moved the public docs from naming the maintainer's private
		// history/rationale system directly to a generic boundary statement
		// (also reflected in AGENTS.md's "Public repository boundary"
		// section) — this still protects the same intent: no SEO rationale
		// is expected to live only in an inaccessible private system.
		expect(architecture).toContain('without access to private planning systems');
	});
});
