import { describe, expect, test } from 'bun:test';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('Featured project layout hierarchy (#95)', () => {
	test('FeaturedProjectSection centers 2-card project layout at wide viewports (#95)', async () => {
		const css = await readFile(
			join(repositoryRoot, 'src/widgets/featured-project-section/ui/FeaturedProjectSection.css'),
			'utf8'
		);

		expect(css).toContain("[data-project-count='2']");
		expect(css).toContain('xl:grid-cols-2');
		expect(css).toContain('xl:mx-auto');
	});
});
