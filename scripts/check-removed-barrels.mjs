import { readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join, relative, resolve } from 'node:path';
import process from 'node:process';

const root = resolve(process.cwd(), 'src');
const sourceExtensions = new Set(['.ts', '.tsx', '.js', '.mjs', '.astro']);
const removedBarrels = ['@entities/theme', '@features/share-button', '@features/theme-toggle'];

function walk(directory) {
	return readdirSync(directory).flatMap(entry => {
		const path = join(directory, entry);
		return statSync(path).isDirectory() ? walk(path) : [path];
	});
}

const violations = [];
const files = walk(root).filter(path => sourceExtensions.has(extname(path)));

for (const file of files) {
	const source = readFileSync(file, 'utf8');
	for (const barrel of removedBarrels) {
		if (source.includes(`'${barrel}'`) || source.includes(`"${barrel}"`)) {
			violations.push(`${relative(root, file)} imports removed barrel ${barrel}`);
		}
	}
}

if (violations.length > 0) {
	console.error('Removed barrel validation failed:\n');
	for (const violation of violations.sort()) console.error(`- ${violation}`);
	process.exit(1);
}

console.log(`Removed barrel validation passed for ${files.length} source files.`);