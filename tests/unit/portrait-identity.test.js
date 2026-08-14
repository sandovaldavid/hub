import { describe, expect, test } from 'bun:test';
import { Buffer } from 'node:buffer';
import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = join(dirname(fileURLToPath(import.meta.url)), '../..');
const approvedPortraitPath = join(repositoryRoot, 'public/profile/perfil.webp');
const illustratedPortraitPath = join(repositoryRoot, 'public/profile/retrato-giblin.webp');
const approvedPortfolioBlob = 'dfcf2ff042b1ebbb04fd45fac810d8c05796478d';

describe('Human-first portrait contract (#60)', () => {
	test('uses the approved real portrait and removes the unused illustration', async () => {
		const profileSource = await readFile(join(repositoryRoot, 'src/data/profile.ts'), 'utf8');

		expect(profileSource).toContain("url: '/profile/perfil.webp'");
		expect(profileSource).not.toContain("url: '/profile/retrato-giblin.webp'");
		expect(existsSync(approvedPortraitPath)).toBe(true);
		expect(existsSync(illustratedPortraitPath)).toBe(false);
	});

	test('keeps the exact approved portfolio portrait bytes', async () => {
		const portrait = await readFile(approvedPortraitPath);
		const blobHeader = Buffer.from(`blob ${portrait.length}\0`);
		const gitBlobSha = createHash('sha1').update(blobHeader).update(portrait).digest('hex');

		expect(portrait.subarray(0, 4).toString('ascii')).toBe('RIFF');
		expect(portrait.subarray(8, 12).toString('ascii')).toBe('WEBP');
		expect(gitBlobSha).toBe(approvedPortfolioBlob);
	});

	test('localizes a truthful portrait label for English and Spanish', async () => {
		const [en, es, hubPage, heroCard, profileAvatar] = await Promise.all([
			readFile(join(repositoryRoot, 'src/shared/i18n/locales/en.json'), 'utf8').then(JSON.parse),
			readFile(join(repositoryRoot, 'src/shared/i18n/locales/es.json'), 'utf8').then(JSON.parse),
			readFile(join(repositoryRoot, 'src/widgets/hub-page/HubPage.astro'), 'utf8'),
			readFile(join(repositoryRoot, 'src/widgets/hero-section/ui/HeroCard.astro'), 'utf8'),
			readFile(join(repositoryRoot, 'src/entities/profile/ui/ProfileAvatar.astro'), 'utf8'),
		]);

		expect(en.profile.avatarAlt).toBe('Portrait of David Sandoval');
		expect(es.profile.avatarAlt).toBe('Retrato de David Sandoval');
		expect(hubPage).toContain("alt: t('profile.avatarAlt')");
		expect(heroCard).not.toContain('Profile photo of');
		expect(profileAvatar).not.toContain('role="img" aria-label={alt}');
	});

	test('keeps the above-the-fold portrait eager, high priority and crop-safe', async () => {
		const [profileAvatar, avatar] = await Promise.all([
			readFile(join(repositoryRoot, 'src/entities/profile/ui/ProfileAvatar.astro'), 'utf8'),
			readFile(join(repositoryRoot, 'src/shared/ui/Avatar.astro'), 'utf8'),
		]);

		expect(profileAvatar).toContain('loading="eager"');
		expect(profileAvatar).toContain('fetchpriority="high"');
		expect(avatar).toContain('width={dimension}');
		expect(avatar).toContain('height={dimension}');
		expect(avatar).toContain('object-cover');
		expect(avatar).toContain("const roundedClasses = 'rounded-full'");
	});
});
