import { expect, test } from '@playwright/test';

const siteUrl = 'https://hub.sandovaldavid.com';
const portfolioUrl = 'https://sandovaldavid.com';
const socialPreviewUrl = `${siteUrl}/og/og_dark.png`;
const expectedSameAs = [
	'https://www.linkedin.com/in/jdsandovals',
	'https://github.com/sandovaldavid',
	'https://x.com/jdsandoval_',
	'https://www.instagram.com/jdsandovals',
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
			'David Sandoval is a Software Engineer who learns continuously, builds maintainable systems and products, documents decisions, and shares evidence through his work.',
		imageAlt:
			'Portrait of David Sandoval with his name, Software Engineer role, and focus on maintainable systems, documented decisions, and engineering evidence.',
		twitterLabel: 'Professional focus',
		twitterData: 'Systems · Products · Evidence',
	},
	{
		path: '/es/',
		lang: 'es',
		schemaLanguage: 'es-PE',
		locale: 'es_PE',
		alternateLocale: 'en_US',
		title: 'David Sandoval | Ingeniero de Software',
		description:
			'David Sandoval es Ingeniero de Software: aprende continuamente, construye sistemas y productos mantenibles, documenta decisiones y comparte evidencia mediante su trabajo.',
		imageAlt:
			'Retrato de David Sandoval con su nombre, rol de Ingeniero de Software y enfoque en sistemas mantenibles, decisiones documentadas y evidencia de ingeniería.',
		twitterLabel: 'Enfoque profesional',
		twitterData: 'Sistemas · Productos · Evidencia',
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
			await expect(page.locator('meta[name="title"]')).toHaveAttribute('content', route.title);
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
			await expect(page.locator('meta[name="googlebot"]')).toHaveAttribute(
				'content',
				'index, follow'
			);

			const keywordContent = await page.locator('meta[name="keywords"]').getAttribute('content');
			expect(keywordContent).not.toBeNull();
			expect(keywordContent ?? '').not.toMatch(/Angular|\.NET|TypeScript/i);
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
				route.description
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
				route.description
			);
			await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute(
				'content',
				socialPreviewUrl
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
			const personId = `${portfolioUrl}/#person`;
			const structuredData = await page
				.locator('script[type="application/ld+json"]')
				.evaluate(element => JSON.parse(element.textContent ?? '{}'));
			const graph = structuredData['@graph'] as Array<Record<string, unknown>>;
			const profilePage = graph.find(node => node['@type'] === 'ProfilePage');
			const person = graph.find(node => node['@type'] === 'Person');
			const image = graph.find(node => node['@type'] === 'ImageObject');

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
				image: { '@id': imageId },
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
	const response = await request.get('/og/og_dark.png');
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
