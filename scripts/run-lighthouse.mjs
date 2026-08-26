import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { fileURLToPath } from 'node:url';
import { setTimeout as delay } from 'node:timers/promises';
import { chromium } from '@playwright/test';
import * as chromeLauncher from 'chrome-launcher';
import lighthouse from 'lighthouse';
import desktopConfig from 'lighthouse/core/config/desktop-config.js';

const PROFILE = process.argv[2] ?? 'mobile';
const SUPPORTED_PROFILES = new Set(['mobile', 'desktop']);
const PREVIEW_ORIGIN = 'http://localhost:4322';
const URLS = [PREVIEW_ORIGIN, `${PREVIEW_ORIGIN}/es/`];
const RUNS_PER_URL = 3;
const SERVER_READY_TIMEOUT_MS = 30_000;
const ASTRO_CLI_PATH = fileURLToPath(new URL('../node_modules/astro/astro.js', import.meta.url));

const categoryThresholds = [
	{ id: 'performance', minScore: 0.9 },
	{ id: 'accessibility', minScore: 0.95 },
	{ id: 'best-practices', minScore: 0.95 },
	{ id: 'seo', minScore: 0.95 },
];

const auditThresholds = [
	{ id: 'first-contentful-paint', maxNumericValue: 3_000, unit: 'ms' },
	{ id: 'largest-contentful-paint', maxNumericValue: 4_000, unit: 'ms' },
	{ id: 'cumulative-layout-shift', maxNumericValue: 0.1, unit: '' },
	{ id: 'total-blocking-time', maxNumericValue: 200, unit: 'ms' },
	{ id: 'speed-index', maxNumericValue: 3_000, unit: 'ms' },
	{ id: 'total-byte-weight', maxNumericValue: 500_000, unit: 'bytes' },
];

if (!SUPPORTED_PROFILES.has(PROFILE)) {
	console.error(`Unsupported Lighthouse profile: ${PROFILE}. Use "mobile" or "desktop".`);
	process.exit(2);
}

const chromePath = process.env.CHROME_PATH || chromium.executablePath();

function createLighthouseConfig(profile) {
	if (profile === 'desktop') {
		return {
			...desktopConfig,
			settings: {
				...desktopConfig.settings,
				throttlingMethod: 'devtools',
			},
		};
	}

	return {
		extends: 'lighthouse:default',
		settings: {
			throttlingMethod: 'devtools',
		},
	};
}

async function waitForServer(url, timeoutMs) {
	const deadline = Date.now() + timeoutMs;

	while (Date.now() < deadline) {
		try {
			const response = await fetch(url, { redirect: 'manual' });
			if (response.status < 500) return;
		} catch {
			// The preview process may still be binding its port.
		}

		await delay(250);
	}

	throw new Error(`Preview server did not become ready within ${timeoutMs}ms at ${url}`);
}

async function startPreviewServer() {
	const server = spawn(
		process.execPath,
		[ASTRO_CLI_PATH, 'preview', '--host', '0.0.0.0', '--port', '4322'],
		{
			env: process.env,
			stdio: ['ignore', 'inherit', 'inherit'],
		}
	);

	const earlyExit = new Promise((_, reject) => {
		server.once('exit', (code, signal) => {
			reject(
				new Error(
					`Preview server exited before becoming ready (code=${code ?? 'null'}, signal=${signal ?? 'null'})`
				)
			);
		});
	});

	await Promise.race([waitForServer(PREVIEW_ORIGIN, SERVER_READY_TIMEOUT_MS), earlyExit]);
	return server;
}

async function stopPreviewServer(server) {
	if (!server || server.exitCode !== null) return;

	server.kill('SIGTERM');
	await Promise.race([once(server, 'exit'), delay(5_000)]);

	if (server.exitCode === null) {
		server.kill('SIGKILL');
		await once(server, 'exit');
	}
}

function getCategoryValues(lhrs, categoryId) {
	return lhrs.map((lhr, index) => {
		const score = lhr.categories[categoryId]?.score;
		if (typeof score !== 'number' || !Number.isFinite(score)) {
			throw new Error(`Run ${index + 1} did not produce category score "${categoryId}"`);
		}
		return score;
	});
}

function getAuditValues(lhrs, auditId) {
	return lhrs.map((lhr, index) => {
		const value = lhr.audits[auditId]?.numericValue;
		if (typeof value !== 'number' || !Number.isFinite(value)) {
			throw new Error(`Run ${index + 1} did not produce numeric audit "${auditId}"`);
		}
		return value;
	});
}

function formatNumber(value) {
	if (Math.abs(value) >= 1_000) return Math.round(value).toLocaleString('en-US');
	return Number(value.toFixed(3)).toString();
}

function evaluateThresholds(url, lhrs) {
	const failures = [];
	console.log(`\nLighthouse ${PROFILE}: ${url}`);
	console.log(`Aggregation: optimistic across ${RUNS_PER_URL} runs`);

	for (const threshold of categoryThresholds) {
		const values = getCategoryValues(lhrs, threshold.id);
		// LHCI's default `optimistic` aggregation takes the maximum value for minScore assertions.
		const actual = Math.max(...values);
		const passed = actual >= threshold.minScore;
		console.log(
			`${passed ? 'PASS' : 'FAIL'} category:${threshold.id} >= ${threshold.minScore.toFixed(2)} | runs=[${values
				.map(value => value.toFixed(3))
				.join(', ')}] | optimistic=${actual.toFixed(3)}`
		);
		if (!passed) {
			failures.push(
				`${url} category:${threshold.id} expected >= ${threshold.minScore}, got ${actual}`
			);
		}
	}

	for (const threshold of auditThresholds) {
		const values = getAuditValues(lhrs, threshold.id);
		// LHCI's default `optimistic` aggregation takes the minimum value for maxNumericValue assertions.
		const actual = Math.min(...values);
		const passed = actual <= threshold.maxNumericValue;
		const unit = threshold.unit ? ` ${threshold.unit}` : '';
		console.log(
			`${passed ? 'PASS' : 'FAIL'} ${threshold.id} <= ${formatNumber(threshold.maxNumericValue)}${unit} | runs=[${values
				.map(formatNumber)
				.join(', ')}] | optimistic=${formatNumber(actual)}${unit}`
		);
		if (!passed) {
			failures.push(
				`${url} ${threshold.id} expected <= ${threshold.maxNumericValue}${unit}, got ${actual}${unit}`
			);
		}
	}

	return failures;
}

async function collectLighthouseRuns(chromePort, url) {
	const lhrs = [];
	const config = createLighthouseConfig(PROFILE);

	for (let run = 1; run <= RUNS_PER_URL; run += 1) {
		console.log(`\n[${PROFILE}] ${url} — run ${run}/${RUNS_PER_URL}`);
		const result = await lighthouse(
			url,
			{
				port: chromePort,
				output: 'json',
				logLevel: 'error',
			},
			config
		);

		if (!result?.lhr) {
			throw new Error(`Lighthouse did not return an LHR for ${url} run ${run}`);
		}

		lhrs.push(result.lhr);
	}

	return lhrs;
}

async function main() {
	let previewServer;
	let chrome;

	try {
		previewServer = await startPreviewServer();
		chrome = await chromeLauncher.launch({
			chromePath,
			chromeFlags: ['--headless', '--no-sandbox', '--disable-dev-shm-usage'],
		});

		const failures = [];
		for (const url of URLS) {
			const lhrs = await collectLighthouseRuns(chrome.port, url);
			failures.push(...evaluateThresholds(url, lhrs));
		}

		if (failures.length > 0) {
			console.error(`\nLighthouse ${PROFILE} gate failed:`);
			for (const failure of failures) console.error(`- ${failure}`);
			process.exitCode = 1;
			return;
		}

		console.log(`\nLighthouse ${PROFILE} gate passed for ${URLS.length} routes.`);
	} finally {
		if (chrome) chrome.kill();
		await stopPreviewServer(previewServer);
	}
}

await main();
