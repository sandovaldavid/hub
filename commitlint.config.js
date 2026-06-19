/** @type {import('@commitlint/types').UserConfig} */
export default {
	extends: ['@commitlint/config-conventional'],
	rules: {
		'type-enum': [
			2,
			'always',
			['feat', 'fix', 'perf', 'refactor', 'style', 'docs', 'test', 'ci', 'chore', 'revert'],
		],
		'subject-case': [2, 'never', ['sentence-case', 'start-case', 'pascal-case', 'upper-case']],
		'header-max-length': [2, 'always', 100],
		'body-max-line-length': [2, 'always', 100],
	},
};
