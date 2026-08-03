import { describe, expect, test } from 'bun:test';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('Passive surface and affordance separation (#96)', () => {
	test('passive container cards use solid surfaces without backdrop blur', async () => {
		const profileSnapshotCss = await readFile(
			join(repositoryRoot, 'src/widgets/hero-section/ui/ProfileSnapshot.css'),
			'utf8'
		);
		const skillsAstro = await readFile(
			join(repositoryRoot, 'src/widgets/skills-section/ui/SkillsSection.astro'),
			'utf8'
		);
		const contactAstro = await readFile(
			join(repositoryRoot, 'src/widgets/contact-cta/ui/ContactCTA.astro'),
			'utf8'
		);

		expect(profileSnapshotCss).not.toContain('backdrop-blur');
		expect(skillsAstro).not.toContain('backdrop-blur');
		expect(contactAstro).not.toContain('backdrop-blur');
	});
});
