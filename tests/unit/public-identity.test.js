import { describe, expect, test } from 'bun:test';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = join(dirname(fileURLToPath(import.meta.url)), '../..');
const read = path => readFile(join(repositoryRoot, path), 'utf8');

describe('public identity registry', () => {
	test('uses the approved canonical domain and contact address', async () => {
		const [astroConfig, siteConfig, shareUtils, readme, security, seoSpec] = await Promise.all([
			read('astro.config.mjs'),
			read('src/data/site.config.ts'),
			read('src/features/share-button/lib/share-utils.ts'),
			read('README.md'),
			read('SECURITY.md'),
			read('tests/e2e/seo.spec.ts'),
		]);

		for (const content of [astroConfig, siteConfig, shareUtils, readme, security, seoSpec]) {
			expect(content).toContain('https://hub.sandovaldavid.com');
			expect(content).not.toContain('https://linktree.sandovaldavid.com');
		}

		expect(siteConfig).toContain("email: 'hello@sandovaldavid.com'");
		expect(siteConfig).toContain("twitterHandle: '@jdsandoval_'");
		expect(siteConfig).not.toContain('contact@sandovaldavid.com');
		expect(security).toContain('[hello@sandovaldavid.com](mailto:hello@sandovaldavid.com)');
		expect(security).not.toContain('contact@sandovaldavid.com');
	});

	test('publishes only approved social destinations', async () => {
		const [siteConfig, socialLinks, layout] = await Promise.all([
			read('src/data/site.config.ts'),
			read('src/data/social-links.ts'),
			read('src/app/layouts/Layout.astro'),
		]);

		const approvedDestinations = [
			'https://github.com/sandovaldavid',
			'https://www.linkedin.com/in/jdsandovals',
			'https://x.com/jdsandoval_',
			'https://www.instagram.com/jdsandovals',
		];

		for (const destination of approvedDestinations) {
			expect(siteConfig).toContain(destination);
		}

		expect(socialLinks).toContain("username: '@jdsandovals'");
		expect(socialLinks).toContain("username: '@jdsandoval_'");
		expect(socialLinks).not.toMatch(/id: '(?:youtube|tiktok|facebook)'/);
		expect(layout).toContain('siteConfig.socialUrls.linkedin');
		expect(layout).toContain('siteConfig.socialUrls.twitter');
		expect(layout).toContain('siteConfig.socialUrls.instagram');
	});

	test('includes the portfolio in the professional and social links section', async () => {
		const [englishPage, spanishPage, socialLinks] = await Promise.all([
			read('src/pages/index.astro'),
			read('src/pages/es/index.astro'),
			read('src/data/social-links.ts'),
		]);

		expect(socialLinks).toContain("id: 'website'");
		expect(socialLinks).toContain('url: siteConfig.portfolioUrl');

		for (const page of [englishPage, spanishPage]) {
			expect(page).toContain(
				"const professionalSocialLinks = socialLinks.filter(link => link.priority !== 'footer');"
			);
			expect(page).toContain('links={professionalSocialLinks}');
			expect(page).not.toContain("link.id !== 'website'");
		}
	});

	test('keeps personal WhatsApp data out of the public profile', async () => {
		const profile = await read('src/data/profile.ts');

		expect(profile).not.toMatch(/whatsapp|901\s*148\s*564|\+51/i);
		expect(profile).toContain('email: siteConfig.email');
	});
});
