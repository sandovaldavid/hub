import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';
import jsxA11y from 'eslint-plugin-jsx-a11y';

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
	// jsx-a11y only for .ts/.js — astro files use eslint-plugin-astro's own a11y rules
	{
		files: ['**/*.{ts,tsx,js,jsx}'],
		plugins: { 'jsx-a11y': jsxA11y },
		rules: { ...jsxA11y.configs.recommended.rules },
	},
	...astro.configs.recommended,
	...astro.configs['jsx-a11y-recommended']
);
