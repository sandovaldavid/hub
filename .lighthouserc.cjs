module.exports = {
	ci: {
		collect: {
			startServerCommand: 'bun run preview',
			url: ['http://localhost:4321', 'http://localhost:4321/es/'],
			numberOfRuns: 3,
			settings: {
				chromeFlags: '--no-sandbox --disable-dev-shm-usage',
			},
		},
		assert: {
			assertions: {
				'categories:performance': ['error', { minScore: 0.9 }],
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
