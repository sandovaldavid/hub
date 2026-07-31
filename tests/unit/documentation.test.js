import { describe, expect, test } from 'bun:test';
import { readdir, readFile } from 'node:fs/promises';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = join(dirname(fileURLToPath(import.meta.url)), '../..');
const docsRoot = join(repositoryRoot, 'docs');

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

		expect(documentation).not.toMatch(/implementation plan|audit findings|alternatives considered/iu);
		expect(documentation).toContain('Cortex-L7');
	});
});
