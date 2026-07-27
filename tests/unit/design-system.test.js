import { describe, expect, test } from 'bun:test';
import { readdir, readFile } from 'node:fs/promises';
import { dirname, extname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = join(dirname(fileURLToPath(import.meta.url)), '../..');
const sourceRoot = join(repositoryRoot, 'src');
const globalStylesPath = join(sourceRoot, 'app/styles/global.css');
const siteConfigPath = join(sourceRoot, 'data/site.config.ts');
const socialStylesPath = 'src/entities/social-link/ui/SocialButton.css';

const requiredChannelTokens = [
	'--channel-background-canvas',
	'--channel-surface-default',
	'--channel-surface-highlight',
	'--channel-content-strong',
	'--channel-content-default',
	'--channel-content-muted',
	'--channel-edge-default',
	'--channel-accent-primary',
	'--channel-accent-secondary',
	'--channel-status-online',
	'--channel-font-display',
	'--channel-font-heading',
	'--channel-font-body',
	'--channel-font-technical',
];

const requiredComponentTokens = [
	'--button-primary-background',
	'--button-primary-background-hover',
	'--button-primary-content',
	'--button-secondary-background',
	'--button-secondary-content',
	'--focus-ring',
	'--badge-brand-background',
	'--badge-brand-content',
	'--badge-success-background',
	'--badge-warning-background',
	'--control-background',
	'--control-edge',
	'--card-background',
	'--card-edge',
	'--avatar-background',
	'--status-online-background',
];

const canonicalPrimitives = {
	'--color-primary-50': 'oklch(97.318% 0.01305 251.56)',
	'--color-primary-100': 'oklch(94.544% 0.02585 248.10)',
	'--color-primary-200': 'oklch(88.896% 0.05659 241.17)',
	'--color-primary-300': 'oklch(80.049% 0.10523 240.14)',
	'--color-primary-400-light': 'oklch(62.308% 0.18801 259.81)',
	'--color-primary-400-dark': 'oklch(81.362% 0.14541 217.11)',
	'--color-primary-500-light': 'oklch(50.992% 0.20091 260.06)',
	'--color-primary-500-dark': 'oklch(72.084% 0.16317 239.29)',
	'--color-primary-600-light': 'oklch(45.378% 0.21747 262.45)',
	'--color-primary-600-dark': 'oklch(61.517% 0.21082 256.10)',
	'--color-primary-700': 'oklch(48.820% 0.21717 264.38)',
	'--color-primary-800': 'oklch(42.445% 0.18087 265.64)',
	'--color-primary-900': 'oklch(37.906% 0.13776 265.52)',
	'--color-primary-950': 'oklch(28.226% 0.08745 267.94)',
	'--color-neutral-50': 'oklch(98.817% 0.00411 271.37)',
	'--color-neutral-100': 'oklch(95.938% 0.01081 256.70)',
	'--color-neutral-200': 'oklch(92.876% 0.01262 255.51)',
	'--color-neutral-300': 'oklch(86.898% 0.01985 252.89)',
	'--color-neutral-400': 'oklch(71.067% 0.03511 256.79)',
	'--color-neutral-500': 'oklch(55.439% 0.04072 257.42)',
	'--color-neutral-600': 'oklch(44.553% 0.03745 257.28)',
	'--color-neutral-700': 'oklch(37.170% 0.03916 257.29)',
	'--color-neutral-800': 'oklch(27.950% 0.03685 260.03)',
	'--color-neutral-900': 'oklch(20.768% 0.03982 265.75)',
	'--color-neutral-950': 'oklch(10.543% 0.01489 255.89)',
	'--color-success-500': 'oklch(80.987% 0.21415 151.77)',
	'--color-success-900': 'oklch(42.539% 0.11588 144.31)',
	'--color-warning-500': 'oklch(84.417% 0.17216 84.93)',
	'--color-warning-900': 'oklch(70.757% 0.19745 46.46)',
	'--color-error-500': 'oklch(63.747% 0.24894 20.73)',
	'--color-error-900': 'oklch(50.164% 0.18868 27.48)',
	'--color-base-white': 'oklch(100% 0 0)',
	'--color-base-background-light': 'oklch(97.799% 0.00622 255.47)',
	'--color-base-surface-highlight-light': 'oklch(94.778% 0.01616 262.75)',
	'--color-base-surface-dark': 'oklch(15.939% 0.01573 266.59)',
	'--color-base-surface-highlight-dark': 'oklch(22.235% 0.02948 263.69)',
	'--color-base-content-strong-dark': 'oklch(96.826% 0.00685 247.90)',
	'--color-base-status-success-text-light': 'oklch(43.180% 0.08647 166.91)',
	'--color-base-status-success-text-dark': 'oklch(77.294% 0.15349 163.22)',
};

const approvedPlatformLiterals = new Set([
	'#833ab4',
	'#fd1d1d',
	'#f77737',
	'#0866ff',
	'#0062e0',
	'#19afff',
	'#0077b5',
	'#00a0dc',
	'#ff0000',
	'#ff1000',
	'#ff4444',
	'#ee1d52',
	'#ffffff',
]);

async function collectStyleBearingFiles(directory) {
	const entries = await readdir(directory, { withFileTypes: true });
	const files = [];

	for (const entry of entries) {
		const absolutePath = join(directory, entry.name);
		if (entry.isDirectory()) {
			files.push(...(await collectStyleBearingFiles(absolutePath)));
			continue;
		}

		if (['.astro', '.css', '.ts', '.js'].includes(extname(entry.name))) {
			files.push(absolutePath);
		}
	}

	return files;
}

function getModeBlock(css, mode) {
	const startMarker = mode === 'light' ? ":root,\n[data-theme='light'] {" : "[data-theme='dark'] {";
	const start = css.indexOf(startMarker);
	expect(start).toBeGreaterThanOrEqual(0);

	const bodyStart = start + startMarker.length;
	const end = css.indexOf('\n}', bodyStart);
	expect(end).toBeGreaterThan(bodyStart);
	return css.slice(bodyStart, end);
}

function readDeclarations(css) {
	const declarations = new Map();
	for (const match of css.matchAll(/(--[\w-]+):\s*([^;]+);/g)) {
		declarations.set(match[1], match[2].replace(/\s+/g, ' ').trim());
	}
	return declarations;
}

function resolveToken(token, modeDeclarations, globalDeclarations, seen = new Set()) {
	if (seen.has(token)) {
		throw new Error(`Circular token reference: ${[...seen, token].join(' -> ')}`);
	}
	seen.add(token);

	const value = modeDeclarations.get(token) ?? globalDeclarations.get(token);
	if (!value) throw new Error(`Missing token: ${token}`);

	const variableReference = value.match(/^var\((--[\w-]+)\)$/);
	if (variableReference) {
		return resolveToken(variableReference[1], modeDeclarations, globalDeclarations, seen);
	}

	return value;
}

function parseOklch(value) {
	const match = value.match(
		/^oklch\(\s*([\d.]+)%\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+)(%)?)?\s*\)$/
	);
	if (!match) throw new Error(`Expected an OKLCH color, received: ${value}`);

	return {
		lightness: Number(match[1]) / 100,
		chroma: Number(match[2]),
		hue: Number(match[3]),
		alpha: match[4] ? Number(match[4]) / (match[5] ? 100 : 1) : 1,
	};
}

function expectEquivalentOklch(actualValue, expectedValue) {
	const actual = parseOklch(actualValue);
	const expected = parseOklch(expectedValue);

	for (const channel of ['lightness', 'chroma', 'hue', 'alpha']) {
		expect(actual[channel]).toBeCloseTo(expected[channel], 6);
	}
}

function oklchToLinearSrgb(value) {
	const { lightness, chroma, hue: hueDegrees } = parseOklch(value);
	const hue = (hueDegrees * Math.PI) / 180;
	const a = chroma * Math.cos(hue);
	const b = chroma * Math.sin(hue);

	const lPrime = lightness + 0.3963377774 * a + 0.2158037573 * b;
	const mPrime = lightness - 0.1055613458 * a - 0.0638541728 * b;
	const sPrime = lightness - 0.0894841775 * a - 1.291485548 * b;

	const l = lPrime ** 3;
	const m = mPrime ** 3;
	const s = sPrime ** 3;

	return [
		4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
		-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
		-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
	].map(channel => Math.min(1, Math.max(0, channel)));
}

function relativeLuminance(value) {
	const [red, green, blue] = oklchToLinearSrgb(value);
	return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function contrastRatio(foreground, background) {
	const foregroundLuminance = relativeLuminance(foreground);
	const backgroundLuminance = relativeLuminance(background);
	const lighter = Math.max(foregroundLuminance, backgroundLuminance);
	const darker = Math.min(foregroundLuminance, backgroundLuminance);
	return (lighter + 0.05) / (darker + 0.05);
}

describe('Link Hub design-system contract', () => {
	test('uses the approved Figma OKLCH primitives and alias hierarchy', async () => {
		const [css, siteConfig] = await Promise.all([
			readFile(globalStylesPath, 'utf8'),
			readFile(siteConfigPath, 'utf8'),
		]);
		const declarations = readDeclarations(css);

		for (const token of [...requiredChannelTokens, ...requiredComponentTokens]) {
			expect(css).toContain(token);
		}

		for (const [token, expectedValue] of Object.entries(canonicalPrimitives)) {
			const actualValue = declarations.get(token);
			if (!actualValue) throw new Error(`${token} must be declared`);
			expectEquivalentOklch(actualValue, expectedValue);
		}

		expect(declarations.get('--color-primary-500')).toBe(
			'light-dark(var(--color-primary-500-light), var(--color-primary-500-dark))'
		);
		expect(css).toContain('--channel-accent-primary: var(--color-primary-500-light);');
		expect(css).toContain('--channel-accent-secondary: var(--color-primary-400-light);');
		expect(css).toContain('--channel-accent-primary: var(--color-primary-500-dark);');
		expect(css).toContain('--channel-accent-secondary: var(--color-primary-400-dark);');
		expect(siteConfig).toContain("themeColor: '#0a5cd6'");
		expect(css).not.toMatch(/--color-brand-(?:blue|cyan)-/);
		expect(css).not.toMatch(/#[0-9a-fA-F]{6}\b/);
		expect(css).not.toMatch(/phosphor|#00ff88/i);
		expect(getModeBlock(css, 'light')).not.toContain('oklch(');
		expect(getModeBlock(css, 'dark')).not.toContain('oklch(');
	});

	test('keeps Link Hub Compact within its typography and effect permissions', async () => {
		const css = await readFile(globalStylesPath, 'utf8');

		expect(css).toMatch(/--channel-font-display:\s*'JetBrains Mono Variable'/);
		expect(css).toMatch(/--channel-font-heading:\s*'JetBrains Mono Variable'/);
		expect(css).toMatch(/--channel-font-body:\s*'Inter Variable'/);
		expect(css).toMatch(/--channel-font-technical:\s*'JetBrains Mono Variable'/);
		expect(css).not.toMatch(/Press Start 2P|VT323|Share Tech Mono|Silkscreen|Google Sans Code/);
		expect(css).toContain('--shadow-retro-xs');
		expect(css).toContain('--shadow-retro-sm');
		expect(css).not.toMatch(/--shadow-retro-(?:md|lg|xl|2xl|3xl)|shadow-glow|glitch|scanline/i);
	});

	test('prevents component bypass of semantic, channel and component roles', async () => {
		const files = await collectStyleBearingFiles(sourceRoot);
		const violations = [];

		for (const absolutePath of files) {
			if (absolutePath === globalStylesPath) continue;

			const repositoryPath = relative(repositoryRoot, absolutePath).replaceAll('\\', '/');
			const content = await readFile(absolutePath, 'utf8');
			const directUtilityPattern =
				/(?:bg|text|border|ring|from|via|to|outline|fill|stroke)-(?:primary|accent|neutral|success|warning|error|gray|sky)-\d{2,3}/g;
			const directVariablePattern = /--color-(?:primary|success|warning|error)-[\w-]+/g;
			const directNeutralVariablePattern = /--color-neutral-\d{2,3}/g;

			for (const match of content.matchAll(directUtilityPattern)) {
				violations.push(`${repositoryPath}: ${match[0]}`);
			}
			for (const match of content.matchAll(directVariablePattern)) {
				violations.push(`${repositoryPath}: ${match[0]}`);
			}
			if (repositoryPath !== socialStylesPath) {
				for (const match of content.matchAll(directNeutralVariablePattern)) {
					violations.push(`${repositoryPath}: ${match[0]}`);
				}
			}
			if (content.includes('oklch(')) {
				violations.push(`${repositoryPath}: direct OKLCH literal`);
			}
		}

		expect(violations).toEqual([]);
	});

	test('allows raw style literals only for documented external platform identities', async () => {
		const files = await collectStyleBearingFiles(sourceRoot);
		const violations = [];

		for (const absolutePath of files) {
			if (
				absolutePath === globalStylesPath ||
				!['.astro', '.css'].includes(extname(absolutePath))
			) {
				continue;
			}

			const repositoryPath = relative(repositoryRoot, absolutePath).replaceAll('\\', '/');
			const content = await readFile(absolutePath, 'utf8');
			const literals = content.match(/#[0-9a-fA-F]{6}\b/g) ?? [];

			for (const literal of literals) {
				const normalized = literal.toLowerCase();
				if (repositoryPath !== socialStylesPath || !approvedPlatformLiterals.has(normalized)) {
					violations.push(`${repositoryPath}: ${literal}`);
				}
			}
		}

		expect(violations).toEqual([]);
	});

	test('maintains WCAG AA contrast for core text, focus and primary actions', async () => {
		const css = await readFile(globalStylesPath, 'utf8');
		const globalDeclarations = readDeclarations(css);

		for (const mode of ['light', 'dark']) {
			const modeDeclarations = readDeclarations(getModeBlock(css, mode));
			const pairs = [
				['--channel-content-default', '--channel-background-canvas'],
				['--channel-content-muted', '--channel-background-canvas'],
				['--channel-accent-primary', '--channel-background-canvas'],
				['--focus-ring', '--channel-background-canvas'],
				['--button-primary-content', '--button-primary-background'],
				['--button-primary-content', '--button-primary-background-hover'],
			];

			for (const [foregroundToken, backgroundToken] of pairs) {
				const foreground = resolveToken(foregroundToken, modeDeclarations, globalDeclarations);
				const background = resolveToken(backgroundToken, modeDeclarations, globalDeclarations);
				const ratio = contrastRatio(foreground, background);

				if (ratio < 4.5) {
					throw new Error(
						`${mode}: ${foregroundToken} on ${backgroundToken} has ${ratio.toFixed(2)}:1 contrast`
					);
				}

				expect(ratio).toBeGreaterThanOrEqual(4.5);
			}
		}
	});
});
