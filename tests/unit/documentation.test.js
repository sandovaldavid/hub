import { describe, expect, test } from 'bun:test';
import { readdir, readFile } from 'node:fs/promises';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = join(dirname(fileURLToPath(import.meta.url)), '../..');
const docsRoot = join(repositoryRoot, 'docs');
const instructionsRoot = join(repositoryRoot, '.github/instructions');
const agentsRoot = join(repositoryRoot, '.github/agents');
const projectProfile = await readFile(join(repositoryRoot, '.agents/project-profile.yml'), 'utf8');

async function listFiles(directory) {
	const entries = await readdir(directory, { withFileTypes: true });
	const files = [];

	for (const entry of entries) {
		const path = join(directory, entry.name);
		if (entry.isDirectory()) {
			files.push(...(await listFiles(path)));
		} else {
			files.push(relative(repositoryRoot, path).replaceAll('\\', '/'));
		}
	}

	return files.sort();
}

describe('repository documentation boundary', () => {
	test('keeps required operational documentation in the repository', async () => {
		const files = await listFiles(docsRoot);

		expect(files).toContain('docs/architecture.md');
		expect(files).toContain('docs/operations.md');
		expect(files.every(path => path.endsWith('.md'))).toBe(true);
	});

	test('keeps decisions, audits, plans and handoffs out of repository docs', async () => {
		const files = await listFiles(docsRoot);
		const contents = await Promise.all(
			files.map(path => readFile(join(repositoryRoot, path), 'utf8'))
		);
		const documentation = contents.join('\n');

		expect(documentation).not.toMatch(
			/implementation plan|audit findings|alternatives considered/iu
		);
		expect(documentation).toContain('Cortex-L7');
	});

	test('keeps path instructions and custom agents explicitly bounded', async () => {
		expect(await listFiles(instructionsRoot)).toEqual([
			'.github/instructions/app.instructions.md',
			'.github/instructions/design-system.instructions.md',
			'.github/instructions/source.instructions.md',
		]);
		expect(await listFiles(agentsRoot)).toEqual(['.github/agents/hub-maintainer.agent.md']);
		expect(projectProfile).toContain('id: hub');
		expect(projectProfile).toContain('primary_agent: project-maintainer');
	});

	test('rejects generic portfolio and framework instruction drift', async () => {
		const files = [
			'.github/copilot-instructions.md',
			...(await listFiles(instructionsRoot)),
			...(await listFiles(agentsRoot)),
		];
		const contents = await Promise.all(
			files.map(path => readFile(join(repositoryRoot, path), 'utf8'))
		);
		const instructions = contents.join('\n');

		expect(instructions).not.toMatch(
			/devsandoval\.me|David Sandoval Portfolio|Full-stack developer|src\/pages\/about\.astro|src\/pages\/projects\/|contact-form|svelte\/store|@testing-library\/astro/iu
		);
		expect(instructions).toContain('hub.sandovaldavid.com');
		expect(instructions).toContain('Software Engineer');
		expect(instructions).toContain('check:architecture');
		expect(instructions).toContain('validate:local');
	});
});
