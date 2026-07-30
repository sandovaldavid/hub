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
		expect(siteConfig).toContain("name: 'David Sandoval — Professional Link Hub'");
		expect(siteConfig).not.toContain('contact@sandovaldavid.com');
		expect(security).toContain('[hello@sandovaldavid.com](mailto:hello@sandovaldavid.com)');
		expect(security).not.toContain('contact@sandovaldavid.com');
	});

	test('publishes only approved social destinations through structured data', async () => {
		const [siteConfig, socialLinks, structuredData, layout] = await Promise.all([
			read('src/data/site.config.ts'),
			read('src/data/social-links.ts'),
			read('src/data/structured-data.ts'),
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
		expect(structuredData).toContain('sameAs: [...siteConfig.sameAs]');
		expect(structuredData).toContain('url: siteConfig.portfolioUrl');
		expect(layout).toContain('getProfilePageStructuredData');
		expect(layout).not.toContain('siteConfig.socialUrls.');
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

	test('tech stack leads with the verified current professional core', async () => {
		const skills = await read('src/data/skills.ts');

		expect(skills).toContain("id: 'dotnet'");
		expect(skills).toContain("id: 'csharp'");

		const dotnetIndex = skills.indexOf("id: 'dotnet'");
		const csharpIndex = skills.indexOf("id: 'csharp'");
		const reactIndex = skills.indexOf("id: 'react'");

		expect(dotnetIndex).toBeGreaterThan(-1);
		expect(reactIndex).toBeGreaterThan(-1);
		expect(dotnetIndex).toBeLessThan(reactIndex);
		expect(csharpIndex).toBeLessThan(reactIndex);
	});

	test('does not claim consulting is actively available before the launch gate', async () => {
		const [en, es] = await Promise.all([
			read('src/shared/i18n/locales/en.json'),
			read('src/shared/i18n/locales/es.json'),
		]);

		expect(en).not.toMatch(/consulting and product discovery are available/i);
		expect(es).not.toMatch(/consultor[ií]a.*est[aá]n disponibles/i);
	});

	test('does not claim unrestricted regional work-mode availability', async () => {
		const [en, es] = await Promise.all([
			read('src/shared/i18n/locales/en.json'),
			read('src/shared/i18n/locales/es.json'),
		]);

		expect(en).not.toMatch(/Europe\s*&\s*Latin America/i);
		expect(es).not.toMatch(/Europa\s*y\s*Latinoam[eé]rica/i);
	});

	test('keeps Yukidoke API and Web lifecycle states separate', async () => {
		const projects = await read('src/data/weekly-project.ts');

		expect(projects).toMatch(/API v1 complete.*Web in active beta/);
		expect(projects).not.toMatch(/status:\s*'Private product in development'/);
	});

	test('separates Kioku stable release from active development', async () => {
		const projects = await read('src/data/weekly-project.ts');

		expect(projects).toMatch(/Stable v2\.3\.0.*active development/);
	});

	test('drops the Hub self-card from featured projects', async () => {
		const projects = await read('src/data/weekly-project.ts');

		expect(projects).not.toContain("id: 'hub'");
	});

	test('removes the legacy calendly conversion event', async () => {
		const [conversion, ctaButtons] = await Promise.all([
			read('src/shared/analytics/conversion.ts'),
			read('src/widgets/cta-section/ui/CTAButtons.astro'),
		]);

		expect(conversion).not.toContain('calendly_opened');
		expect(ctaButtons).not.toContain('calendly');
		expect(ctaButtons).not.toContain('CalendarIcon');
	});
});
