import { describe, expect, test } from 'bun:test';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = join(dirname(fileURLToPath(import.meta.url)), '../..');
const read = path => readFile(join(repositoryRoot, path), 'utf8');

describe('shared iconography contract', () => {
	test('uses the approved cross-channel technology marks', async () => {
		const [csharp, astro, postgresql] = await Promise.all([
			read('src/shared/assets/tech-icons/csharp.svg'),
			read('src/shared/assets/tech-icons/astro.svg'),
			read('src/shared/assets/tech-icons/postgresql.svg'),
		]);

		expect(csharp).toContain('viewBox="0 0 72 72"');
		expect(csharp).toContain('stop-color="#927BE5"');
		expect(csharp).toContain('stop-color="#512BD4"');
		expect(astro).toContain('viewBox="0 0 256 366"');
		expect(astro).toContain('fill="#FF5D01"');
		expect(postgresql).toContain('viewBox="0 0 256 264"');
		expect(postgresql).toContain('fill="#336791"');
	});

	test('uses one shared geometry for recurring UI glyphs', async () => {
		const [sun, moon, system, briefcase, email, link, share] = await Promise.all([
			read('src/shared/assets/theme-icons/sun.svg'),
			read('src/shared/assets/theme-icons/moon.svg'),
			read('src/shared/assets/theme-icons/system.svg'),
			read('src/shared/assets/cta-icons/briefcase.svg'),
			read('src/shared/assets/cta-icons/email.svg'),
			read('src/shared/assets/link.svg'),
			read('src/shared/assets/share-icon.svg'),
		]);

		for (const icon of [sun, moon, system, briefcase, email, link, share]) {
			expect(icon).toContain('viewBox="0 0 24 24"');
			expect(icon).toContain('currentColor');
		}

		expect(sun).toContain('M12 12m-4 0a4 4 0 1 0 8 0');
		expect(moon).toContain('a7.5 7.5 0 0 0 7.92 12.446');
		expect(system).toContain('M3 5a1 1 0 0 1 1 -1h16');
		expect(briefcase).toContain('M3 13a20 20 0 0 0 18 0');
		expect(email).toContain('M3 8L8.44992 11.6333');
		expect(link).toContain('M10 13a5 5 0 0 0 7.54.54');
		expect(share).toContain('m8.6 10.5 6.8-4');
	});
});
