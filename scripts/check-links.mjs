import { access, readFile, readdir, stat } from 'node:fs/promises';
import { dirname, extname, relative, resolve, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const configPath = resolve(repositoryRoot, 'config/link-check.json');
const skippedDirectories = new Set([
	'.astro',
	'.git',
	'node_modules',
	'dist',
	'playwright-report',

	'test-results',
]);

const markdownLinkPattern = /!?\[[^\]]*\]\(([^)]+)\)/g;
const absoluteUrlPattern = /https?:\/\/[^\s<>"'`)\]}]+/g;

export const defaultTransientStatusCodes = new Set([401, 403, 408, 425, 429]);

const delay = milliseconds =>
	new Promise(resolveDelay => {
		setTimeout(resolveDelay, milliseconds);
	});

const stripTrailingPunctuation = value => value.replace(/[.,;:!?]+$/u, '');

const normalizeMarkdownTarget = rawTarget => {
	let target = rawTarget.trim();

	if (target.startsWith('<') && target.includes('>')) {
		target = target.slice(1, target.indexOf('>'));
	} else {
		target = target.split(/\s+["']/u, 1)[0];
	}

	return stripTrailingPunctuation(target.trim());
};

export const extractMarkdownTargets = content => {
	const targets = [];

	for (const match of content.matchAll(markdownLinkPattern)) {
		const target = normalizeMarkdownTarget(match[1]);
		if (target) {
			targets.push(target);
		}
	}

	return targets;
};

export const extractExternalUrls = content => {
	const urls = new Set();

	for (const target of extractMarkdownTargets(content)) {
		if (/^https?:\/\//u.test(target)) {
			urls.add(stripTrailingPunctuation(target));
		}
	}

	for (const match of content.matchAll(absoluteUrlPattern)) {
		urls.add(stripTrailingPunctuation(match[0]));
	}

	return [...urls];
};

export const classifyHttpStatus = (status, transientStatusCodes = defaultTransientStatusCodes) => {
	if (status >= 200 && status < 400) {
		return 'ok';
	}

	if (transientStatusCodes.has(status) || status >= 500) {
		return 'transient';
	}

	if (status >= 400 && status < 500) {
		return 'broken';
	}

	return 'transient';
};

export const shouldIgnoreExternalUrl = (url, ignoredExternalUrls = []) => {
	if (url.includes('${') || /[<>{}*]/u.test(url)) {
		return true;
	}

	const parsed = new URL(url);
	if (['localhost', '127.0.0.1', '0.0.0.0'].includes(parsed.hostname)) {
		return true;
	}

	return ignoredExternalUrls.some(entry => new RegExp(entry.pattern, 'u').test(url));
};

const readResponseStatus = async response => {
	await response.body?.cancel().catch(() => undefined);
	return response.status;
};

const requestUrl = async (url, fetchImpl, timeoutMs) => {
	const request = method =>
		fetchImpl(url, {
			method,
			redirect: 'follow',
			signal: AbortSignal.timeout(timeoutMs),
			headers: {
				accept: 'text/html,application/xhtml+xml,application/json;q=0.9,*/*;q=0.8',
				'user-agent': 'sandovaldavid-hub-link-check/1.0',
				...(method === 'GET' ? { range: 'bytes=0-0' } : {}),
			},
		});

	const headResponse = await request('HEAD');
	const headStatus = await readResponseStatus(headResponse);

	if (headStatus >= 200 && headStatus < 400) {
		return headStatus;
	}

	const getResponse = await request('GET');
	return readResponseStatus(getResponse);
};

export const checkExternalUrl = async (
	url,
	{
		fetchImpl = fetch,
		timeoutMs = 10_000,
		retries = 2,
		retryDelayMs = 750,
		transientStatusCodes = defaultTransientStatusCodes,
	} = {}
) => {
	let lastResult = {
		url,
		state: 'transient',
		status: null,
		attempts: 0,
		error: 'No request was made.',
	};

	for (let attempt = 0; attempt <= retries; attempt += 1) {
		try {
			const status = await requestUrl(url, fetchImpl, timeoutMs);
			const state = classifyHttpStatus(status, transientStatusCodes);
			lastResult = { url, state, status, attempts: attempt + 1, error: null };

			if (state === 'ok') {
				return lastResult;
			}
		} catch (error) {
			lastResult = {
				url,
				state: 'transient',
				status: null,
				attempts: attempt + 1,
				error: error instanceof Error ? error.message : String(error),
			};
		}

		if (attempt < retries) {
			await delay(retryDelayMs * (attempt + 1));
		}
	}

	return lastResult;
};

const listFiles = async (entry, extensions) => {
	const absoluteEntry = resolve(repositoryRoot, entry);
	const entryStats = await stat(absoluteEntry);

	if (entryStats.isFile()) {
		return extensions.has(extname(absoluteEntry)) ? [absoluteEntry] : [];
	}

	const files = [];
	for (const child of await readdir(absoluteEntry, { withFileTypes: true })) {
		if (child.isDirectory() && skippedDirectories.has(child.name)) {
			continue;
		}

		const childEntry = resolve(absoluteEntry, child.name);
		if (child.isDirectory()) {
			files.push(...(await listFiles(relative(repositoryRoot, childEntry), extensions)));
		} else if (child.isFile() && extensions.has(extname(child.name))) {
			files.push(childEntry);
		}
	}

	return files;
};

const expandConfiguredEntries = async (entries, extensions) => {
	const files = new Set();

	for (const entry of entries) {
		for (const file of await listFiles(entry, extensions)) {
			files.add(file);
		}
	}

	return [...files].sort();
};

const removeQueryAndFragment = target => target.split(/[?#]/u, 1)[0];

const pathExists = async targetPath => {
	try {
		await access(targetPath);
		return true;
	} catch {
		return false;
	}
};

const resolveSiteRouteCandidates = target => {
	const route = decodeURIComponent(removeQueryAndFragment(target));
	const normalizedRoute = route === '/' ? '' : route.replace(/^\//u, '').replace(/\/$/u, '');

	if (extname(normalizedRoute)) {
		return [resolve(repositoryRoot, 'public', normalizedRoute)];
	}

	return [
		resolve(repositoryRoot, 'src/pages', `${normalizedRoute || 'index'}.astro`),
		resolve(repositoryRoot, 'src/pages', normalizedRoute, 'index.astro'),
	];
};

const resolveRepositoryTargetCandidates = (sourceFile, target) => {
	const cleanTarget = decodeURIComponent(removeQueryAndFragment(target));
	const resolvedTarget = resolve(dirname(sourceFile), cleanTarget);

	if (!resolvedTarget.startsWith(`${repositoryRoot}${sep}`) && resolvedTarget !== repositoryRoot) {
		return [];
	}

	return [resolvedTarget];
};

const checkInternalLinks = async markdownFiles => {
	const broken = [];
	let checked = 0;

	for (const sourceFile of markdownFiles) {
		const content = await readFile(sourceFile, 'utf8');
		for (const target of extractMarkdownTargets(content)) {
			if (
				!target ||
				target.startsWith('#') ||
				/^(?:https?:|mailto:|tel:|data:|javascript:)/u.test(target)
			) {
				continue;
			}

			const candidates = target.startsWith('/')
				? resolveSiteRouteCandidates(target)
				: resolveRepositoryTargetCandidates(sourceFile, target);
			checked += 1;

			const existingCandidates = await Promise.all(candidates.map(pathExists));
			if (candidates.length === 0 || !existingCandidates.some(Boolean)) {
				broken.push({
					source: relative(repositoryRoot, sourceFile),
					target,
				});
			}
		}
	}

	return { checked, broken };
};

const mapWithConcurrency = async (items, concurrency, mapper) => {
	const results = new Array(items.length);
	let nextIndex = 0;

	const workers = Array.from({ length: Math.min(concurrency, items.length) }, async () => {
		while (nextIndex < items.length) {
			const index = nextIndex;
			nextIndex += 1;
			results[index] = await mapper(items[index], index);
		}
	});

	await Promise.all(workers);
	return results;
};

const loadConfiguration = async () => JSON.parse(await readFile(configPath, 'utf8'));

const collectExternalUrls = async (files, ignoredExternalUrls) => {
	const urls = new Set();

	for (const sourceFile of files) {
		const content = await readFile(sourceFile, 'utf8');
		for (const url of extractExternalUrls(content)) {
			try {
				if (!shouldIgnoreExternalUrl(url, ignoredExternalUrls)) {
					urls.add(new URL(url).href);
				}
			} catch {
				// Malformed URLs are reported by the tests that own the content source.
			}
		}
	}

	return [...urls].sort();
};

const printExternalResult = result => {
	const detail = result.status ? `HTTP ${result.status}` : result.error;
	const prefix = result.state === 'broken' ? '[error]' : '[warning]';
	console.error(`${prefix} ${result.url} — ${detail} after ${result.attempts} attempt(s)`);
};

const main = async () => {
	const config = await loadConfiguration();
	const extensions = new Set(config.extensions);
	let hasFailures = false;

	const markdownFiles = await expandConfiguredEntries(config.markdownSources, extensions);
	const internal = await checkInternalLinks(markdownFiles);
	console.log(`[links] internal: ${internal.checked} checked across ${markdownFiles.length} files`);
	for (const failure of internal.broken) {
		console.error(`[error] ${failure.source} -> ${failure.target}`);
	}
	hasFailures ||= internal.broken.length > 0;

	const externalFiles = await expandConfiguredEntries(config.externalSources, extensions);
	const urls = await collectExternalUrls(externalFiles, config.ignoredExternalUrls);
	const transientStatusCodes = new Set(config.transientStatusCodes);
	const results = await mapWithConcurrency(urls, config.concurrency, url =>
		checkExternalUrl(url, {
			timeoutMs: config.timeoutMs,
			retries: config.retries,
			retryDelayMs: config.retryDelayMs,
			transientStatusCodes,
		})
	);
	const broken = results.filter(result => result.state === 'broken');
	const transient = results.filter(result => result.state === 'transient');
	const ok = results.filter(result => result.state === 'ok');

	console.log(
		`[links] external: ${ok.length} healthy, ${transient.length} transient warning(s), ${broken.length} broken`
	);
	for (const result of [...broken, ...transient]) {
		printExternalResult(result);
	}
	hasFailures ||= broken.length > 0;

	if (hasFailures) {
		process.exitCode = 1;
	} else {
		console.log('[links] validation passed');
	}
};

const isMainModule =
	process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href;
if (isMainModule) {
	await main();
}
