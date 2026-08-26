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

	test('keeps role, method and evidence-routing hierarchy equivalent in English and Spanish', async () => {
		const [english, spanish] = await Promise.all([
			readJson('src/shared/i18n/locales/en.json'),
			readJson('src/shared/i18n/locales/es.json'),
		]);

		expect(english.profile.tagline).toBe('Software Engineer · Backend-oriented');
		expect(spanish.profile.tagline).toBe('Ingeniero de Software · Orientado a backend');
		expect(english.profile.tagline).not.toMatch(/\.NET|C#|Angular/i);
		expect(spanish.profile.tagline).not.toMatch(/\.NET|C#|Angular/i);
		expect(english.profile.bio).toMatch(/complex problems.*business context.*validation/i);
		expect(spanish.profile.bio).toMatch(/problemas complejos.*contexto de negocio.*validación/i);
		expect(english.cta.description).toMatch(/portfolio.*public engineering evidence.*GitHub/i);
		expect(spanish.cta.description).toMatch(/portafolio.*evidencia técnica pública.*GitHub/i);
		expect(english.contact.heading).toBe('Contact');
		expect(spanish.contact.heading).toBe('Contacto');
		expect(english.contact.title).not.toMatch(/consult/i);
		expect(spanish.contact.title).not.toMatch(/consult/i);
		expect(english.skills.coreTitle).toBe('Current Engineering Stack');
		expect(spanish.skills.coreTitle).toBe('Stack actual de ingeniería');
		expect(english.projects.projectSite).toBe('Project site');
		expect(spanish.projects.projectSite).toBe('Sitio del proyecto');
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
		// Asserted on the exported object, not the source text: the contract is
		// "profile.ts does not carry these facts", which the value proves directly.
		for (const field of ['displayName', 'location', 'timezone', 'languages']) {
			expect(profile).not.toHaveProperty(field);
		}
		expect(profile.logo).not.toHaveProperty('alt');
	});

	test('keeps the selected project set evidence-bound and complementary', () => {
		const englishProjects = getFeaturedProjects('en');
		const spanishProjects = getFeaturedProjects('es');

		expect(englishProjects.map(project => project.id)).toEqual([
			'kioku',
			'yukidoke',
			'oci-arm-hunter',
		]);
		expect(spanishProjects.map(project => project.id)).toEqual([
			'kioku',
			'yukidoke',
			'oci-arm-hunter',
		]);
	});

	test('keeps Kioku wording durable while routing to public evidence', () => {
		const englishKioku = getFeaturedProjects('en').find(project => project.id === 'kioku');
		const spanishKioku = getFeaturedProjects('es').find(project => project.id === 'kioku');

		expect(englishKioku?.status).toBe('Stable release · active development');
		expect(spanishKioku?.status).toBe('Release estable · desarrollo activo');
		expect(englishKioku?.status).not.toMatch(/v\d+\.\d+\.\d+/i);
		expect(spanishKioku?.status).not.toMatch(/v\d+\.\d+\.\d+/i);
		expect(englishKioku?.projectUrl).toBe('https://kioku.sandovaldavid.com');
		expect(englishKioku?.githubUrl).toBe('https://github.com/sandovaldavid/kioku');
		expect(englishKioku?.projectAvailability).toBe('public');
		expect(englishKioku?.repositoryAvailability).toBe('public');
	});

	test('keeps Yukidoke current without claiming release or production readiness', () => {
		const englishYukidoke = getFeaturedProjects('en').find(project => project.id === 'yukidoke');
		const spanishYukidoke = getFeaturedProjects('es').find(project => project.id === 'yukidoke');

		expect(englishYukidoke?.title).toBe('Yukidoke · Household personal-finance product');
		expect(spanishYukidoke?.title).toBe('Yukidoke · Producto de finanzas personales para hogares');
		expect(`${englishYukidoke?.contribution} ${englishYukidoke?.outcome}`).not.toMatch(
			/v1 complete|release-ready|production-ready|scalable|multi-user/i
		);
		expect(`${spanishYukidoke?.contribution} ${spanishYukidoke?.outcome}`).not.toMatch(
			/v1 completa|lista para release|lista para producción|escalable|multiusuario/i
		);
		expect(englishYukidoke?.status).toMatch(/production unconfirmed/i);
		expect(spanishYukidoke?.status).toMatch(/producción no confirmada/i);
		expect(englishYukidoke?.projectAvailability).toBe('unavailable');
		expect(englishYukidoke?.repositoryAvailability).toBe('private');
	});

	test('keeps OCI ARM Hunter bounded to public automation evidence', () => {
		const englishOci = getFeaturedProjects('en').find(project => project.id === 'oci-arm-hunter');
		const spanishOci = getFeaturedProjects('es').find(project => project.id === 'oci-arm-hunter');

		expect(englishOci?.title).toBe('OCI ARM Hunter · Oracle Cloud capacity automation');
		expect(spanishOci?.title).toBe('OCI ARM Hunter · Automatización de capacidad en Oracle Cloud');
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
