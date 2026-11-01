import { describe, expect, test } from 'bun:test';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = join(dirname(fileURLToPath(import.meta.url)), '../..');
const read = path => readFile(join(repositoryRoot, path), 'utf8');

describe('theme favicon contract', () => {
	test('keeps Logo v2 favicons and removes retired V1 logo sources', async () => {
		const [darkFavicon, lightFavicon] = await Promise.all([
			read('public/favicon.dark.svg'),
			read('public/favicon.light.svg'),
		]);

		expect(darkFavicon).not.toBe(lightFavicon);
		expect(existsSync(join(repositoryRoot, 'public/favicon.svg'))).toBe(false);
		expect(existsSync(join(repositoryRoot, 'public/logo/sandovaldavid.svg'))).toBe(false);
		expect(existsSync(join(repositoryRoot, 'public/logo/sandovaldavid.light.svg'))).toBe(false);
	});
});
