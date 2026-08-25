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

		expect(english.profile.tagline).toBe('Backend-oriented Software Engineer · .NET, C# & Angular');
		expect(spanish.profile.tagline).toBe(
			'Ingeniero de Software orientado a backend · .NET, C# y Angular'
		);
		expect(english.profile.bio).toMatch(/complex problems.*business context.*validation/i);
		expect(spanish.profile.bio).toMatch(/problemas complejos.*contexto de negocio.*validación/i);
		expect(english.cta.description).toMatch(/portfolio.*public engineering evidence.*GitHub/i);
		expect(spanish.cta.description).toMatch(/portafolio.*evidencia técnica pública.*GitHub/i);
		expect(english.contact.heading).toBe('Contact');
		expect(spanish.contact.heading).toBe('Contacto');
		expect(english.contact.title).not.toMatch(/consult/i);
		expect(spanish.contact.title).not.toMatch(/consult/i);
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

	test('bounds Yukidoke wording to architecture intent rather than demonstrated scale', () => {
		const english = getFeaturedProjects('en').find(project => project.id === 'yukidoke');
		const spanish = getFeaturedProjects('es').find(project => project.id === 'yukidoke');

		expect(english).toBeDefined();
		expect(spanish).toBeDefined();
		expect(`${english?.contribution} ${english?.outcome}`).not.toMatch(/scalable|multi-user/i);
		expect(`${spanish?.contribution} ${spanish?.outcome}`).not.toMatch(/escalable|multiusuario/i);
		expect(english?.outcome).toMatch(/explicit domain boundaries/i);
		expect(spanish?.outcome).toMatch(/límites de dominio explícitos/i);
	});
});
