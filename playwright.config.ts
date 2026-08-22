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
		// webkit and firefox are not installed on CI runners — local-only (#98).
		// `GITHUB_ACTIONS` (set only by Actions itself) is the right gate here, not the
		// generic `CI` — `validate:local` also sets `CI=1` (for the preview server and
		// deterministic retries/workers below), and that script's whole point is to run
		// every locally-capable browser, including inside a container with webkit/firefox
		// installed. Only hosted Actions runners actually lack those binaries.
		...(process.env.GITHUB_ACTIONS
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
