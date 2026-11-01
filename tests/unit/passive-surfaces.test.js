import { describe, expect, test } from 'bun:test';
import { readdir, readFile } from 'node:fs/promises';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = join(dirname(fileURLToPath(import.meta.url)), '../..');
const sourceRoot = join(repositoryRoot, 'src');

const collectCssFiles = async directory => {
	const entries = await readdir(directory, { withFileTypes: true });
	const files = [];

	for (const entry of entries) {
		const path = join(directory, entry.name);
		if (entry.isDirectory()) {
			files.push(...(await collectCssFiles(path)));
		} else if (entry.name.endsWith('.css')) {
			files.push(path);
		}
	}

	return files;
};

describe('Passive surface and affordance separation (#96)', () => {
	test('source stylesheets use solid surfaces without backdrop blur', async () => {
		const cssFiles = await collectCssFiles(sourceRoot);
		const offenders = [];

		for (const file of cssFiles) {
			const css = await readFile(file, 'utf8');
			if (/backdrop-(?:blur|filter)/.test(css)) {
				offenders.push(relative(repositoryRoot, file));
			}
		}

		expect(cssFiles.length).toBeGreaterThan(0);
		expect(offenders).toEqual([]);
	});
});
