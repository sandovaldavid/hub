import { defineConfig, devices } from '@playwright/test';

const isCi = Boolean(process.env.CI);
const isGitHubActions = process.env.GITHUB_ACTIONS === 'true';

function getWorkerOverride(value: string | undefined): number | undefined {
	if (!value) return undefined;

	const workers = Number(value);
	if (!Number.isInteger(workers) || workers < 1) {
		throw new Error(`PLAYWRIGHT_WORKERS must be a positive integer, received: ${value}`);
	}

	return workers;
}

const workerOverride = getWorkerOverride(process.env.PLAYWRIGHT_WORKERS);
const workers = workerOverride ?? (isGitHubActions ? 2 : undefined);
const testServerUrl = isCi ? 'http://localhost:4322' : 'http://localhost:4321';

export default defineConfig({
	testDir: './tests/e2e',
	fullyParallel: true,
	forbidOnly: isCi,
	retries: isGitHubActions ? 2 : 0,
	workers,
	reporter: 'html',
	use: {
		baseURL: testServerUrl,
		trace: 'on-first-retry',
	},
	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] },
		},
		// Hosted GitHub Actions installs Chromium only. The complete local gate runs
		// inside the repository DevContainer, where Chromium, WebKit and Firefox are
		// installed and verified. `GITHUB_ACTIONS` must remain the browser-project gate:
		// `validate:local:inside` also sets `CI=1` to exercise the production preview.
		...(isGitHubActions
			? []
			: [
					{ name: 'Mobile Safari', use: { ...devices['iPhone 14'] } },
					{ name: 'firefox', use: { ...devices['Desktop Firefox'] } },
				]),
	],
	webServer: {
		command: isCi ? 'bun run preview:test' : 'bun run dev',
		url: testServerUrl,
		reuseExistingServer: !isCi,
		timeout: 60_000,
	},
});
