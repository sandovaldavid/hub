import { describe, expect, test } from 'bun:test';
import { readdir, readFile } from 'node:fs/promises';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = join(dirname(fileURLToPath(import.meta.url)), '../..');
const sourceRoot = join(repositoryRoot, 'src');

const collectStyleFiles = async directory => {
	const entries = await readdir(directory, { withFileTypes: true });
	const files = [];

	for (const entry of entries) {
		const path = join(directory, entry.name);
		if (entry.isDirectory()) {
			files.push(...(await collectStyleFiles(path)));
		} else if (entry.name.endsWith('.css') || entry.name.endsWith('.astro')) {
			files.push(path);
		}
	}

	return files;
};

describe('Passive surface and affordance separation (#96)', () => {
	test('source styles and components use solid surfaces without backdrop blur', async () => {
		const styleFiles = await collectStyleFiles(sourceRoot);
		const offenders = [];

		for (const file of styleFiles) {
			const source = await readFile(file, 'utf8');
			if (/backdrop-(?:blur|filter)/.test(source)) {
				offenders.push(relative(repositoryRoot, file));
			}
		}

		expect(styleFiles.length).toBeGreaterThan(0);
		expect(offenders).toEqual([]);
	});
});
