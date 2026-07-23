import console from 'node:console';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, extname, join, normalize, relative, resolve } from 'node:path';
import process from 'node:process';

const root = resolve(process.cwd(), 'src');
const supportedExtensions = new Set(['.ts', '.tsx', '.js', '.mjs', '.astro']);
const aliasRoots = {
	'@': root,
	'@app': join(root, 'app'),
	'@shared': join(root, 'shared'),
	'@entities': join(root, 'entities'),
	'@features': join(root, 'features'),
	'@widgets': join(root, 'widgets'),
	'@pages': join(root, 'pages'),
	'@data': join(root, 'data'),
};
const removedBarrels = new Set([
	'@entities/theme',
	'@features/share-button',
	'@features/theme-toggle',
]);
const importPattern = /(?:import|export)\s+(?:type\s+)?(?:[^'";]+?\s+from\s+)?['"]([^'"]+)['"]/g;

function walk(directory) {
	return readdirSync(directory).flatMap(entry => {
		const path = join(directory, entry);
		return statSync(path).isDirectory() ? walk(path) : [path];
	});
}

function resolveImport(sourceFile, specifier) {
	if (specifier.startsWith('.') || specifier.startsWith('/')) {
		return resolveCandidate(resolve(dirname(sourceFile), specifier));
	}
	const alias = Object.keys(aliasRoots)
		.sort((left, right) => right.length - left.length)
		.find(key => specifier === key || specifier.startsWith(`${key}/`));
	if (!alias) return undefined;
	const suffix = specifier.slice(alias.length).replace(/^\//, '');
	return resolveCandidate(join(aliasRoots[alias], suffix));
}

function resolveCandidate(candidate) {
	const candidates = [
		candidate,
		...Array.from(supportedExtensions, extension => `${candidate}${extension}`),
		...Array.from(supportedExtensions, extension => join(candidate, `index${extension}`)),
	];
	return candidates.find(path => existsSync(path) && statSync(path).isFile());
}

const files = walk(root).filter(path => supportedExtensions.has(extname(path)));
const graph = new Map(files.map(path => [normalize(path), []]));
const violations = [];

for (const file of files) {
	const source = readFileSync(file, 'utf8');
	for (const match of source.matchAll(importPattern)) {
		const specifier = match[1];
		if (removedBarrels.has(specifier)) {
			violations.push(`${relative(root, file)} imports removed barrel ${specifier}`);
		}
		const target = resolveImport(file, specifier);
		if (target && graph.has(normalize(target))) graph.get(normalize(file)).push(normalize(target));
	}
}

const visiting = new Set();
const visited = new Set();
const stack = [];

function visit(file) {
	if (visiting.has(file)) {
		const start = stack.indexOf(file);
		const cycle = [...stack.slice(start), file].map(path => relative(root, path)).join(' -> ');
		violations.push(`circular import: ${cycle}`);
		return;
	}
	if (visited.has(file)) return;
	visiting.add(file);
	stack.push(file);
	for (const dependency of graph.get(file) ?? []) visit(dependency);
	stack.pop();
	visiting.delete(file);
	visited.add(file);
}

for (const file of graph.keys()) visit(file);

if (violations.length > 0) {
	console.error('Architecture validation failed:\n');
	for (const violation of [...new Set(violations)].sort()) console.error(`- ${violation}`);
	process.exit(1);
}

console.log(`Architecture validation passed for ${files.length} source files.`);
