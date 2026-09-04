import { expect, test } from '@playwright/test';

const siteUrl = 'https://hub.sandovaldavid.com';
const portfolioUrl = 'https://sandovaldavid.com';
const socialPreviewUrl = `${siteUrl}/og/og-meta.png`;
const profileImageUrl = `${siteUrl}/profile/perfil.webp`;
const expectedSameAs = [
	'https://www.linkedin.com/in/jdsandovals',
	'https://github.com/sandovaldavid',
	'https://www.instagram.com/david.sandovals',
	'https://x.com/davidsandoval_s',
	'https://www.youtube.com/@davidsandoval.s',
	'https://www.tiktok.com/@davidsandoval.s',
];

const routes = [
	{
		path: '/',
		lang: 'en',
		schemaLanguage: 'en-US',
		locale: 'en_US',
		alternateLocale: 'es_PE',
		title: 'David Sandoval | Software Engineer',
		description:
			'David Sandoval is a backend-oriented Software Engineer with hands-on frontend experience. Explore his portfolio, GitHub, resume, and professional contact links.',
		socialDescription:
			'David Sandoval — Software Engineer focused on backend systems, with hands-on frontend experience. Portfolio, GitHub, resume, and contact.',
		imageAlt: 'David Sandoval — Software Engineer',
		twitterLabel: 'Professional focus',
		twitterData: 'Backend systems · Frontend experience',
		portraitAlt: 'Portrait of David Sandoval',
	},
	{
		path: '/es/',
		lang: 'es',
		schemaLanguage: 'es-PE',
		locale: 'es_PE',
		alternateLocale: 'en_US',
		title: 'David Sandoval | Ingeniero de Software',
		description:
			'David Sandoval es Ingeniero de Software orientado a backend, con experiencia práctica en frontend. Revisa su portafolio, GitHub, CV y canales de contacto profesional.',
		socialDescription:
			'David Sandoval — Ingeniero de Software orientado a backend, con experiencia práctica en frontend. Portafolio, GitHub, CV y contacto.',
		imageAlt: 'David Sandoval — Ingeniero de Software',
		twitterLabel: 'Enfoque profesional',
		portraitAlt: 'Retrato de David Sandoval',
		twitterData: 'Backend · Experiencia frontend',
	},
] as const;

for (const route of routes) {
	test.describe(`SEO metadata for ${route.path}`, () => {
		test.beforeEach(async ({ page }) => {
			await page.goto(route.path);
		});

		test('uses exact localized human-first metadata', async ({ page }) => {
			await expect(page.locator('html')).toHaveAttribute('lang', route.lang);
			await expect(page).toHaveTitle(route.title);
			await expect(page.locator('meta[name="title"]')).toHaveCount(0);
			await expect(page.locator('meta[name="description"]')).toHaveAttribute(
				'content',
				route.description
			);
			await expect(page.locator('meta[name="author"]')).toHaveAttribute(
				'content',
				'David Sandoval'
			);
			await expect(page.locator('meta[name="application-name"]')).toHaveAttribute(
				'content',
				'David Sandoval'
			);
			await expect(page.locator('meta[name="apple-mobile-web-app-title"]')).toHaveAttribute(
				'content',
				'David Sandoval'
			);
			await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'index, follow');
			await expect(page.locator('meta[name="googlebot"]')).toHaveCount(0);
			await expect(page.locator('meta[name="keywords"]')).toHaveCount(0);
		});

		test('publishes canonical, reciprocal hreflang and sitemap URLs', async ({ page }) => {
			const canonical = route.path === '/' ? `${siteUrl}/` : `${siteUrl}/es/`;
			await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', canonical);
			await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', canonical);
			await expect(page.locator('meta[name="twitter:url"]')).toHaveAttribute('content', canonical);
			await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute(
				'href',
				`${siteUrl}/`
			);
			await expect(page.locator('link[rel="alternate"][hreflang="es"]')).toHaveAttribute(
				'href',
				`${siteUrl}/es/`
			);
			await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveAttribute(
				'href',
				`${siteUrl}/`
			);
			const sitemapUrl = await page
				.locator('link[rel="sitemap"]')
				.evaluate(element => (element as HTMLLinkElement).href);
			expect(sitemapUrl).toBe(`${siteUrl}/sitemap-index.xml`);
		});

		test('keeps Open Graph and Twitter metadata semantically aligned', async ({ page }) => {
			await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'profile');
			await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
				'content',
				route.title
			);
			await expect(page.locator('meta[property="og:description"]')).toHaveAttribute(
				'content',
				route.socialDescription
			);
			await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
				'content',
				socialPreviewUrl
			);
			await expect(page.locator('meta[property="og:image:secure_url"]')).toHaveAttribute(
				'content',
				socialPreviewUrl
			);
			await expect(page.locator('meta[property="og:image:type"]')).toHaveAttribute(
				'content',
				'image/png'
			);
			await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute(
				'content',
				'1200'
			);
			await expect(page.locator('meta[property="og:image:height"]')).toHaveAttribute(
				'content',
				'630'
			);
			await expect(page.locator('meta[property="og:image:alt"]')).toHaveAttribute(
				'content',
				route.imageAlt
			);
			await expect(page.locator('meta[property="og:site_name"]')).toHaveAttribute(
				'content',
				'David Sandoval'
			);
			await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute(
				'content',
				route.locale
			);
			await expect(page.locator('meta[property="og:locale:alternate"]')).toHaveAttribute(
				'content',
				route.alternateLocale
			);

			await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
				'content',
				'summary_large_image'
			);
			await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute(
				'content',
				route.title
			);
			await expect(page.locator('meta[name="twitter:description"]')).toHaveAttribute(
				'content',
				route.socialDescription
			);
			await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute(
				'content',
				socialPreviewUrl
			);
			await expect(page.locator('meta[name="twitter:site"]')).toHaveAttribute(
				'content',
				'@davidsandoval_s'
			);
			await expect(page.locator('meta[name="twitter:creator"]')).toHaveAttribute(
				'content',
				'@davidsandoval_s'
			);
			await expect(page.locator('meta[name="twitter:image:alt"]')).toHaveAttribute(
				'content',
				route.imageAlt
			);
			await expect(page.locator('meta[name="twitter:label1"]')).toHaveAttribute(
				'content',
				route.twitterLabel
			);
			await expect(page.locator('meta[name="twitter:data1"]')).toHaveAttribute(
				'content',
				route.twitterData
			);
		});

		test('models the localized page around one canonical Person', async ({ page }) => {
			const canonical = route.path === '/' ? `${siteUrl}/` : `${siteUrl}/es/`;
			const pageId = `${canonical}#profile-page`;
			const imageId = `${canonical}#primary-image`;
			const portraitId = `${canonical}#person-image`;
			const personId = `${portfolioUrl}/#person`;
			const structuredData = await page
				.locator('script[type="application/ld+json"]')
				.evaluate(element => JSON.parse(element.textContent ?? '{}'));
			const graph = structuredData['@graph'] as Array<Record<string, unknown>>;
			const profilePage = graph.find(node => node['@type'] === 'ProfilePage');
			const person = graph.find(node => node['@type'] === 'Person');
			const image = graph.find(node => node['@id'] === imageId);
			const portrait = graph.find(node => node['@id'] === portraitId);

			expect(structuredData['@context']).toBe('https://schema.org');
			expect(profilePage).toMatchObject({
				'@id': pageId,
				url: canonical,
				name: route.title,
				description: route.description,
				inLanguage: route.schemaLanguage,
				mainEntity: { '@id': personId },
				primaryImageOfPage: { '@id': imageId },
			});
			expect(person).toMatchObject({
				'@id': personId,
				name: 'David Sandoval',
				url: portfolioUrl,
				mainEntityOfPage: { '@id': pageId },
				image: { '@id': portraitId },
				email: 'mailto:hello@sandovaldavid.com',
				jobTitle: 'Software Engineer',
				sameAs: expectedSameAs,
			});
			expect(person?.contactPoint).toBeUndefined();
			expect(image).toMatchObject({
				'@id': imageId,
				url: socialPreviewUrl,
				contentUrl: socialPreviewUrl,
				caption: route.imageAlt,
				width: 1200,
				height: 630,
			});
			// Person.image is a separate node: the portrait of David, not the
			// 1200x630 social card the page uses as primaryImageOfPage.
			expect(portrait).toMatchObject({
				'@id': portraitId,
				url: profileImageUrl,
				contentUrl: profileImageUrl,
				caption: route.portraitAlt,
				width: 1254,
				height: 1254,
			});
			expect(portrait?.['@id']).not.toBe(image?.['@id']);
		});

		test('renders one visible descriptive h1', async ({ page }) => {
			const headings = page.getByRole('heading', { level: 1 });
			await expect(headings).toHaveCount(1);
			await expect(headings).toBeVisible();
			await expect(headings).toContainText('David Sandoval');
		});
	});
}

test('serves the declared social preview asset', async ({ request }) => {
	const response = await request.get('/og/og-meta.png');
	expect(response.ok()).toBe(true);
	expect(response.headers()['content-type']).toContain('image/png');
	expect((await response.body()).byteLength).toBeGreaterThan(0);
});

test('serves robots.txt with the canonical sitemap', async ({ request }) => {
	const response = await request.get('/robots.txt');
	expect(response.ok()).toBe(true);
	expect(await response.text()).toBe(
		`User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap-index.xml\n`
	);
});

test('publishes localized sitemap alternates and excludes the 404 page', async ({ request }) => {
	const sitemapIndex = await request.get('/sitemap-index.xml');
	expect(sitemapIndex.ok()).toBe(true);

	const indexText = await sitemapIndex.text();
	const sitemapUrl = indexText.match(/<loc>([^<]+)<\/loc>/)?.[1];
	expect(sitemapUrl).toBeTruthy();

	const sitemapPath = new URL(sitemapUrl ?? `${siteUrl}/sitemap-0.xml`).pathname;
	const sitemapResponse = await request.get(sitemapPath);
	expect(sitemapResponse.ok()).toBe(true);

	const sitemap = await sitemapResponse.text();
	expect(sitemap).toContain(`hreflang="en-US" href="${siteUrl}/"`);
	expect(sitemap).toContain(`hreflang="es-PE" href="${siteUrl}/es/"`);
	expect(sitemap).not.toMatch(/\/404\/?</);
});
