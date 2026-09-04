import { describe, expect, test } from 'bun:test';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = join(dirname(fileURLToPath(import.meta.url)), '../..');
const read = path => readFile(join(repositoryRoot, path), 'utf8');

describe('theme-aware icon color contract', () => {
	test('uses the canonical mail glyph for the contact action and inherits button color', async () => {
		const [emailIcon, contactCta, workRouteCard] = await Promise.all([
			read('src/shared/assets/cta-icons/email.svg'),
			read('src/widgets/contact-cta/ui/ContactCTA.astro'),
			read('src/widgets/cta-section/ui/WorkRouteCard.astro'),
		]);

		expect(emailIcon).toContain('viewBox="0 0 24 24"');
		expect(emailIcon).toContain('stroke="currentColor"');
		expect(emailIcon).not.toMatch(/#fff(?:fff)?\b|\bwhite\b/i);
		expect(contactCta).toContain('actionIcon="email"');
		expect(contactCta).not.toContain('@shared/assets/sent.svg');
		expect(workRouteCard).toContain("EmailIcon from '@shared/assets/cta-icons/email.svg?raw'");
		expect(workRouteCard).toContain('work-route-card__action button-secondary');
		expect(workRouteCard).toContain('email: EmailIcon');
	});
});
