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
		expect(english.profile.bio).toMatch(
			/maintainable software.*backend focus.*frontend experience.*clear boundaries.*typed contracts.*validated delivery/i
		);
		expect(spanish.profile.bio).toMatch(
			/software mantenible.*backend.*frontend.*límites claros.*contratos tipados.*validación/i
		);
		expect(english.profile.location).toBe('Piura, Peru · UTC-5');
		expect(spanish.profile.location).toBe('Piura, Perú · UTC-5');
		expect(english.cta.description).toMatch(/portfolio.*selected projects.*public repositories/i);
		expect(spanish.cta.description).toMatch(
			/portafolio.*proyectos seleccionados.*repositorios públicos/i
		);
		expect(english.contact.heading).toBe('Contact');
		expect(spanish.contact.heading).toBe('Contacto');
		expect(english.contact.title).not.toMatch(/consult/i);
		expect(spanish.contact.title).not.toMatch(/consult/i);
		expect(english.skills.coreTitle).toBe('Current Engineering Stack');
		expect(spanish.skills.coreTitle).toBe('Stack actual de ingeniería');
		expect(english.projects.projectSite).toBe('Project site');
		expect(spanish.projects.projectSite).toBe('Sitio del proyecto');
		expect(english.projects.viewCaseStudy).toBe('View case study');
		expect(spanish.projects.viewCaseStudy).toBe('Ver caso de estudio');
		expect(english.projects.private).toBe('Private project');
		expect(spanish.projects.private).toBe('Proyecto privado');

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
			/public engineering evidence|pending evidence|production unconfirmed|claim not verified|not visible to recruiter|evidencia técnica pública|evidencia pendiente|producción no confirmada/i
		);
	});

	test('keeps CTA route metadata separate from localized public copy', () => {
		for (const button of getCtaButtons('Software engineering opportunity')) {
			expect(button).not.toHaveProperty('title');
			expect(button).not.toHaveProperty('description');
			expect(button.id).toBeTruthy();
			expect(button.href).toBeTruthy();
			expect(button.conversionEvent).toBeTruthy();
		}
	});

	test('keeps localized profile facts owned solely by the i18n catalog, not duplicated in profile.ts', () => {
		for (const field of ['displayName', 'location', 'timezone', 'languages']) {
			expect(profile).not.toHaveProperty(field);
		}
		expect(profile.logo).not.toHaveProperty('alt');
	});

	test('keeps the selected project set purposeful and complementary', () => {
		const englishProjects = getFeaturedProjects('en');
		const spanishProjects = getFeaturedProjects('es');
		const expectedProjectIds = ['kioku', 'yukidoke', 'oci-arm-hunter'];

		expect(englishProjects.map(project => project.id)).toEqual(expectedProjectIds);
		expect(spanishProjects.map(project => project.id)).toEqual(expectedProjectIds);
	});

	test('keeps recruiter-facing project copy free from internal audit language', () => {
		for (const lang of ['en', 'es']) {
			for (const project of getFeaturedProjects(lang)) {
				const publicCopy = [
					project.title,
					project.problem,
					project.contribution,
					project.outcome,
					project.status,
				].join(' ');
				expect(publicCopy).not.toMatch(
					/production unconfirmed|pending evidence|real-stack release evidence|claim not verified|not visible to recruiter|producción no confirmada|evidencia pendiente|evidencia final real-stack/i
				);
			}
		}
	});

	test('keeps Kioku wording durable while routing to its public project and repository', () => {
		const englishKioku = getFeaturedProjects('en').find(project => project.id === 'kioku');
		const spanishKioku = getFeaturedProjects('es').find(project => project.id === 'kioku');

		expect(englishKioku?.status).toBe('Released · active development');
		expect(spanishKioku?.status).toBe('Publicado · desarrollo activo');
		expect(englishKioku?.status).not.toMatch(/v\d+\.\d+\.\d+/i);
		expect(spanishKioku?.status).not.toMatch(/v\d+\.\d+\.\d+/i);
		expect(englishKioku?.outcome).toMatch(/versioned packages.*public documentation/i);
		expect(spanishKioku?.outcome).toMatch(/paquetes versionados.*documentación pública/i);
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
		expect(`${englishYukidoke?.contribution} ${englishYukidoke?.outcome}`).not.toMatch(
			/v1 complete|release-ready|production-ready|scalable|multi-user/i
		);
		expect(`${spanishYukidoke?.contribution} ${spanishYukidoke?.outcome}`).not.toMatch(
			/v1 completa|lista para release|lista para producción|escalable|multiusuario/i
		);
		expect(englishYukidoke?.status).toBe('Active development');
		expect(spanishYukidoke?.status).toBe('Desarrollo activo');
		expect(englishYukidoke?.projectAvailability).toBe('unavailable');
		expect(spanishYukidoke?.projectAvailability).toBe('unavailable');
		expect(englishYukidoke?.repositoryAvailability).toBe('private');
		expect(spanishYukidoke?.repositoryAvailability).toBe('private');
		expect(englishYukidoke?.projectUrl).toBeUndefined();
		expect(englishYukidoke?.githubUrl).toBeUndefined();
		expect(englishYukidoke?.caseStudyUrl).toBe('https://sandovaldavid.com/projects/yukidoke');
		expect(spanishYukidoke?.caseStudyUrl).toBe('https://sandovaldavid.com/es/projects/yukidoke');
	});

	test('keeps OCI ARM Hunter bounded to its released public automation', () => {
		const englishOci = getFeaturedProjects('en').find(project => project.id === 'oci-arm-hunter');
		const spanishOci = getFeaturedProjects('es').find(project => project.id === 'oci-arm-hunter');

		expect(englishOci?.title).toBe('OCI ARM Hunter · Oracle Cloud capacity automation');
		expect(spanishOci?.title).toBe('OCI ARM Hunter · Automatización de capacidad en Oracle Cloud');
		expect(englishOci?.status).toBe('Released');
		expect(spanishOci?.status).toBe('Publicado');
		expect(`${englishOci?.contribution} ${englishOci?.outcome}`).not.toMatch(
			/guaranteed capacity|guaranteed provisioning|SLA|fleet|adoption/i
		);
		expect(`${spanishOci?.contribution} ${spanishOci?.outcome}`).not.toMatch(
			/capacidad garantizada|aprovisionamiento garantizado|SLA|flota|adopción/i
		);
		expect(englishOci?.projectUrl).toBe('https://oci.sandovaldavid.com');
		expect(englishOci?.githubUrl).toBe('https://github.com/sandovaldavid/oci-arm-hunter');
		expect(englishOci?.projectAvailability).toBe('public');
		expect(englishOci?.repositoryAvailability).toBe('public');
	});
});
