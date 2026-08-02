import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';

export default defineConfig(
	{
		ignores: ['dist/', '.astro/', 'node_modules/', 'playwright-report/', 'test-results/'],
	},
	js.configs.recommended,
	...tseslint.configs.recommended,
	{
		rules: {
			'@typescript-eslint/no-unused-vars': [
				'error',
				{ argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
			],
			'@typescript-eslint/no-explicit-any': 'warn',
		},
	},
	// Repository scripts and Bun unit tests run in Node with the Fetch API available.
	{
		files: ['scripts/**/*.{js,mjs,cjs}', 'tests/unit/**/*.js'],
		languageOptions: {
			globals: {
				AbortSignal: 'readonly',
				Response: 'readonly',
				URL: 'readonly',
				console: 'readonly',
				fetch: 'readonly',
				process: 'readonly',
				setTimeout: 'readonly',
			},
		},
	},
	// CJS config files in root (Lighthouse, etc.) legitimately use require/module.
	{
		files: ['.lighthouserc.js', '*.cjs'],
		languageOptions: {
			sourceType: 'commonjs',
			globals: {
				module: 'writable',
				require: 'readonly',
				__dirname: 'readonly',
				process: 'readonly',
			},
		},
		rules: {
			'@typescript-eslint/no-require-imports': 'off',
		},
	},
	...astro.configs.recommended,
	...astro.configs['jsx-a11y-recommended']
);
