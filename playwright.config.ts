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
		// webkit and firefox are not installed on CI runners — local-only (#98)
		...(process.env.CI
			? []
			: [
					{ name: 'Mobile Safari', use: { ...devices['iPhone 14'] } },
					{ name: 'firefox', use: { ...devices['Desktop Firefox'] } },
				]),
	],
	webServer: {
		command: process.env.CI ? 'bun run preview' : 'bun run dev',
		url: 'http://localhost:4321',
		reuseExistingServer: !process.env.CI,
		timeout: 60_000,
	},
});
