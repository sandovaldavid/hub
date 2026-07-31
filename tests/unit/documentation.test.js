import { describe, expect, test } from 'bun:test';
import { readdir, readFile } from 'node:fs/promises';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = join(dirname(fileURLToPath(import.meta.url)), '../..');
const docsRoot = join(repositoryRoot, 'docs');
const instructionsRoot = join(repositoryRoot, '.github/instructions');

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
	test('keeps docs limited to architecture and operations', async () => {
		expect(await listFiles(docsRoot)).toEqual([
			'docs/architecture.md',
			'docs/operations.md',
		]);
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

	test('keeps agent instructions limited to current repository contracts', async () => {
		expect(await listFiles(instructionsRoot)).toEqual([
			'.github/instructions/app.instructions.md',
			'.github/instructions/design-system.instructions.md',
			'.github/instructions/source.instructions.md',
		]);
	});

	test('rejects generic portfolio and framework instruction drift', async () => {
		const files = [
			'.github/copilot-instructions.md',
			...(await listFiles(instructionsRoot)),
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
