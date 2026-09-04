import { describe, expect, test } from 'bun:test';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getCtaButtons } from '../../src/data/cta.ts';
import { profile } from '../../src/data/profile.ts';
import { siteConfig } from '../../src/data/site.config.ts';
import { getFeaturedProjects } from '../../src/data/featured-projects.ts';

const repositoryRoot = join(dirname(fileURLToPath(import.meta.url)), '../..');
const readJson = async path => JSON.parse(await readFile(join(repositoryRoot, path), 'utf8'));

describe('Hub messaging alignment contract', () => {
	test('keeps David as the public identity instead of branding the Hub as a separate entity', () => {
		expect(profile.name).toBe(siteConfig.name);
		expect(siteConfig.name).toBe('David Sandoval');
		expect(siteConfig.shortName).toBe('David Sandoval');
	});

	test('keeps canonical positioning aligned while allowing market-specific EN and ES copy', async () => {
		const [english, spanish] = await Promise.all([
			readJson('src/shared/i18n/locales/en.json'),
			readJson('src/shared/i18n/locales/es.json'),
		]);

		expect(english.profile.tagline).toBe('Software Engineer · Backend-focused');
		expect(spanish.profile.tagline).toBe('Ingeniero de Software · Enfoque backend');
		expect(english.profile.tagline).not.toMatch(/\.NET|C#|Angular/i);
		expect(spanish.profile.tagline).not.toMatch(/\.NET|C#|Angular/i);

		expect(english.profile.bio).toBe(
			'I work mainly on backend systems and also have hands-on frontend experience.'
		);
		expect(spanish.profile.bio).toBe(
			'Trabajo principalmente en backend y también tengo experiencia práctica en frontend.'
		);
		expect(english.profile.bio).not.toMatch(
			/reliable systems|structured problem solving|evidence-driven|complex problems|engineering excellence|debugging.*integration.*validation/i
		);
		expect(spanish.profile.bio).not.toMatch(
			/sistemas confiables|resolución estructurada|evidencia|problemas complejos|excelencia.*ingeniería|depuración.*integración.*validación/i
		);

		expect(english.profile.location).toBe('Piura, Peru · UTC-5');
		expect(spanish.profile.location).toBe('Piura, Perú · UTC-5');
		expect(english.profile.snapshotHeading).toBe('About');
		expect(spanish.profile.snapshotHeading).toBe('Sobre mí');
		expect(english.cta.heading).toBe('Work & contact');
		expect(spanish.cta.heading).toBe('Trabajo y contacto');
		expect(english.cta.description).toMatch(/résumé.*email/i);
		expect(spanish.cta.description).toMatch(/CV.*escríbeme/i);
		expect(english.cta.description).not.toMatch(/start with my portfolio/i);
		expect(spanish.cta.description).not.toMatch(/empieza por mi portafolio/i);
		expect(english.contact.heading).toBe('Contact');
		expect(spanish.contact.heading).toBe('Contacto');
		expect(english.page.mainLabel).toBe('David Sandoval professional profile');
		expect(spanish.page.mainLabel).toBe('Perfil profesional de David Sandoval');
		expect(english.seo.ogImageAlt).toBe('David Sandoval — Software Engineer');
		expect(spanish.seo.ogImageAlt).toBe('David Sandoval — Ingeniero de Software');

		const publicMessaging = JSON.stringify({
			english: {
				profile: english.profile,
				cta: english.cta,
				projects: english.projects,
				seo: english.seo,
				share: english.share,
			},
			spanish: {
				profile: spanish.profile,
				cta: spanish.cta,
				projects: spanish.projects,
				seo: spanish.seo,
				share: spanish.share,
			},
		});
		expect(publicMessaging).not.toMatch(
			/public engineering evidence|pending evidence|production unconfirmed|claim not verified|not visible to recruiter|evidencia técnica pública|evidencia pendiente|producción no confirmada|brand architecture|arquitectura de marca/i
		);
	});

	test('keeps the central CTA route focused on the localized résumé', () => {
		for (const lang of ['en', 'es']) {
			const buttons = getCtaButtons(lang);
			expect(buttons.map(button => button.id)).toEqual(['resume']);
			expect(buttons.filter(button => button.variant === 'primary')).toHaveLength(0);
			expect(buttons.find(button => button.id === 'resume')?.variant).toBe('secondary');
			expect(buttons.find(button => button.id === 'resume')?.href).toBe(siteConfig.resume[lang]);
		}
	});

	test('keeps CTA route metadata separate from localized public copy', () => {
		for (const lang of ['en', 'es']) {
			for (const button of getCtaButtons(lang)) {
				expect(button).not.toHaveProperty('title');
				expect(button).not.toHaveProperty('description');
				expect(button.id).toBeTruthy();
				expect(button.href).toBeTruthy();
				expect(button.conversionEvent).toBeTruthy();
			}
		}
	});

	test('keeps localized profile facts owned solely by the i18n catalog, not duplicated in profile.ts', () => {
		for (const field of ['displayName', 'location', 'timezone', 'languages']) {
			expect(profile).not.toHaveProperty(field);
		}
		expect(profile.logo).not.toHaveProperty('alt');
	});

	test('keeps the selected project set purposeful, compact and complementary', () => {
		const englishProjects = getFeaturedProjects('en');
		const spanishProjects = getFeaturedProjects('es');
		const expectedProjectIds = ['kioku', 'yukidoke', 'oci-arm-hunter'];

		expect(englishProjects.map(project => project.id)).toEqual(expectedProjectIds);
		expect(spanishProjects.map(project => project.id)).toEqual(expectedProjectIds);

		for (const project of [...englishProjects, ...spanishProjects]) {
			expect(project.summary.length).toBeGreaterThan(40);
			expect(project.summary.length).toBeLessThan(230);
			expect(project).not.toHaveProperty('problem');
			expect(project).not.toHaveProperty('contribution');
			expect(project).not.toHaveProperty('outcome');
			expect(project).not.toHaveProperty('technologies');
			expect(project).not.toHaveProperty('status');
		}
	});

	test('keeps recruiter-facing project copy about the projects instead of David positioning', () => {
		for (const lang of ['en', 'es']) {
			for (const project of getFeaturedProjects(lang)) {
				const publicCopy = `${project.title} ${project.summary}`;
				expect(publicCopy).not.toMatch(
					/production unconfirmed|pending evidence|real-stack release evidence|claim not verified|not visible to recruiter|producción no confirmada|evidencia pendiente|evidencia final real-stack|release-ready|production-ready|lista para release|lista para producción|demonstrates|showcases|highlights my ability|this project demonstrates|demuestra|demuestra mi capacidad/i
				);
			}
		}
	});

	test('keeps Kioku routing public and durable without lifecycle copy', () => {
		const englishKioku = getFeaturedProjects('en').find(project => project.id === 'kioku');
		const spanishKioku = getFeaturedProjects('es').find(project => project.id === 'kioku');

		expect(englishKioku?.summary).toMatch(/local-first.*\.NET MCP server.*AI-agent sessions/i);
		expect(spanishKioku?.summary).toMatch(/MCP.*local-first.*\.NET.*agentes de IA/i);
		expect(englishKioku?.projectUrl).toBe('https://kioku.sandovaldavid.com');
		expect(englishKioku?.githubUrl).toBe('https://github.com/sandovaldavid/kioku');
		expect(englishKioku?.projectAvailability).toBe('public');
		expect(englishKioku?.repositoryAvailability).toBe('public');
	});

	test('keeps Yukidoke private while routing readers to localized public case studies', () => {
		const englishYukidoke = getFeaturedProjects('en').find(project => project.id === 'yukidoke');
		const spanishYukidoke = getFeaturedProjects('es').find(project => project.id === 'yukidoke');

		expect(englishYukidoke?.title).toBe('Yukidoke · Household finance platform');
		expect(spanishYukidoke?.title).toBe('Yukidoke · Plataforma financiera para hogares');
		expect(englishYukidoke?.summary).toBe(
			'A private household finance app with a .NET backend and Angular frontend.'
		);
		expect(spanishYukidoke?.summary).toBe(
			'Una aplicación privada de finanzas para hogares con backend .NET y frontend Angular.'
		);
		expect(englishYukidoke?.summary).not.toMatch(
			/v1 complete|release-ready|production-ready|scalable|multi-user/i
		);
		expect(spanishYukidoke?.summary).not.toMatch(
			/v1 completa|lista para release|lista para producción|escalable|multiusuario/i
		);
		expect(englishYukidoke?.projectAvailability).toBe('unavailable');
		expect(spanishYukidoke?.projectAvailability).toBe('unavailable');
		expect(englishYukidoke?.repositoryAvailability).toBe('private');
		expect(spanishYukidoke?.repositoryAvailability).toBe('private');
		expect(englishYukidoke?.projectUrl).toBeUndefined();
		expect(englishYukidoke?.githubUrl).toBeUndefined();
		expect(englishYukidoke?.caseStudyUrl).toBe('https://sandovaldavid.com/projects/yukidoke');
		expect(spanishYukidoke?.caseStudyUrl).toBe('https://sandovaldavid.com/es/projects/yukidoke');
	});

	test('keeps OCI ARM Hunter bounded to its public automation', () => {
		const englishOci = getFeaturedProjects('en').find(project => project.id === 'oci-arm-hunter');
		const spanishOci = getFeaturedProjects('es').find(project => project.id === 'oci-arm-hunter');

		expect(englishOci?.title).toBe('OCI ARM Hunter · Oracle Cloud capacity automation');
		expect(spanishOci?.title).toBe('OCI ARM Hunter · Automatización de capacidad en Oracle Cloud');
		expect(englishOci?.summary).toBe(
			'A Bash and OCI CLI tool that retries ARM instance creation across Oracle Cloud Availability Domains.'
		);
		expect(spanishOci?.summary).toBe(
			'Una herramienta en Bash y OCI CLI que reintenta la creación de instancias ARM entre Availability Domains de Oracle Cloud.'
		);
		expect(englishOci?.summary).not.toMatch(
			/guaranteed capacity|guaranteed provisioning|SLA|fleet|adoption/i
		);
		expect(spanishOci?.summary).not.toMatch(
			/capacidad garantizada|aprovisionamiento garantizado|SLA|flota|adopción/i
		);
		expect(englishOci?.projectUrl).toBe('https://oci.sandovaldavid.com');
		expect(englishOci?.githubUrl).toBe('https://github.com/sandovaldavid/oci-arm-hunter');
		expect(englishOci?.projectAvailability).toBe('public');
		expect(englishOci?.repositoryAvailability).toBe('public');
	});
});
