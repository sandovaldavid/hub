import { describe, expect, test } from 'bun:test';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { skills, coreSkills, toolingSkills } from '../../src/data/skills';

const repositoryRoot = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('Core engineering stack and layout hierarchy (#93, #95, #97, #112)', () => {
	test('skills catalog separates core engineering stack from tooling (#93, #112)', () => {
		const skillIds = skills.map(s => s.id);
		const coreIds = coreSkills.map(s => s.id);
		const toolingIds = toolingSkills.map(s => s.id);

		expect(skillIds).toContain('dotnet');
		expect(skillIds).toContain('csharp');
		expect(skillIds).toContain('angular');
		expect(skillIds).toContain('postgresql');
		expect(skillIds).toContain('sqlserver');
		expect(skillIds).toContain('mongodb');
		expect(skillIds).toContain('astro');
		expect(skillIds).toContain('githubactions');

		// First 3 items lead with .NET, C# and Angular in coreSkills
		expect(coreIds.slice(0, 3)).toEqual(['dotnet', 'csharp', 'angular']);
		expect(coreIds).toHaveLength(7);
		expect(toolingIds).toHaveLength(6);
		expect(coreSkills.every(s => s.tier === 'core')).toBe(true);
		expect(toolingSkills.every(s => s.tier === 'tooling')).toBe(true);
	});

	test('WeeklyProjectSection centers 2-card project layout at wide viewports (#95)', async () => {
		const css = await readFile(
			join(repositoryRoot, 'src/widgets/weekly-project-section/ui/WeeklyProjectSection.css'),
			'utf8'
		);

		expect(css).toContain("[data-project-count='2']");
		expect(css).toContain('xl:grid-cols-2');
		expect(css).toContain('xl:mx-auto');
	});

	test('ContactCTA frames consulting offer as in-preparation (#97)', async () => {
		const enJson = JSON.parse(
			await readFile(join(repositoryRoot, 'src/shared/i18n/locales/en.json'), 'utf8')
		);
		const esJson = JSON.parse(
			await readFile(join(repositoryRoot, 'src/shared/i18n/locales/es.json'), 'utf8')
		);

		expect(enJson.contact.title).toContain('in preparation');
		expect(esJson.contact.title).toContain('en preparación');
	});
});
