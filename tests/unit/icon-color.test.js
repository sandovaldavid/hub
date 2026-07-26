import { describe, expect, test } from 'bun:test';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = join(dirname(fileURLToPath(import.meta.url)), '../..');
const read = path => readFile(join(repositoryRoot, path), 'utf8');

describe('theme-aware icon color contract', () => {
	test('makes the consulting send icon inherit the primary button content color', async () => {
		const [sentIcon, contactCta, buttonStyles] = await Promise.all([
			read('src/shared/assets/sent.svg'),
			read('src/widgets/contact-cta/ui/ContactCTA.astro'),
			read('src/shared/ui/Button.css'),
		]);

		expect(sentIcon).toContain('stroke="currentColor"');
		expect(sentIcon).not.toMatch(/#fff(?:fff)?\b|\bwhite\b/i);
		expect(contactCta).toContain('variant="primary"');
		expect(contactCta).toContain('<SentIcon class="h-4 w-4" aria-hidden="true" />');
		expect(buttonStyles).toContain('color: var(--button-primary-content);');
	});
});
