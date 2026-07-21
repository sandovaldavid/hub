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
			numberOfRuns: 3,
			settings: {
				...(isDesktop ? { preset: 'desktop' } : {}),
				chromeFlags: '--no-sandbox --disable-dev-shm-usage',
				throttlingMethod: 'devtools',
			},
		},
		assert: {
			assertions: {
				'categories:performance': ['error', { minScore: 0.9 }],
				'categories:accessibility': ['error', { minScore: 0.95 }],
				'categories:best-practices': ['error', { minScore: 0.95 }],
				'categories:seo': ['error', { minScore: 0.95 }],
				'first-contentful-paint': ['error', { maxNumericValue: 3000 }],
				'largest-contentful-paint': ['error', { maxNumericValue: 4000 }],
				'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
				'total-blocking-time': ['error', { maxNumericValue: 200 }],
				'speed-index': ['error', { maxNumericValue: 3000 }],
				'total-byte-weight': ['error', { maxNumericValue: 500000 }],
			},
		},
		upload: {
			target: 'temporary-public-storage',
		},
	},
};
