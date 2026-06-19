import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
	testDir: './tests/e2e',
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: 'html',
	use: {
		baseURL: 'http://localhost:4321',
		trace: 'on-first-retry',
	},
	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] },
		},
		// webkit not installed on CI runners — only run locally
		...(process.env.CI
			? []
			: [{ name: 'Mobile Safari', use: { ...devices['iPhone 14'] } }]),
	],
	webServer: {
		command: 'bun run preview',
		url: 'http://localhost:4321',
		reuseExistingServer: !process.env.CI,
		timeout: 60_000,
	},
});
