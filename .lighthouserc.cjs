const { chromium } = require('@playwright/test');

const isDesktop = process.env.LHCI_PROFILE === 'desktop';
const chromePath = process.env.CHROME_PATH || chromium.executablePath();

module.exports = {
	ci: {
		collect: {
			chromePath,
			startServerCommand: 'bun run preview',
			startServerReadyPattern: 'Local',
			startServerReadyTimeout: 30000,
			url: ['http://localhost:4321', 'http://localhost:4321/es/'],
			numberOfRuns: 1,
			settings: {
				...(isDesktop ? { preset: 'desktop' } : {}),
				chromeFlags: '--no-sandbox --disable-dev-shm-usage',
				throttlingMethod: 'devtools',
			},
		},
		assert: {
			assertions: {
				// Performance is unreliable in CI (low-resource runners); keep as warning
				'categories:performance': ['warn', { minScore: 0.8 }],
				'categories:accessibility': ['error', { minScore: 0.95 }],
				'categories:best-practices': ['error', { minScore: 0.9 }],
				'categories:seo': ['error', { minScore: 0.9 }],
			},
		},
		upload: {
			target: 'temporary-public-storage',
		},
	},
};
