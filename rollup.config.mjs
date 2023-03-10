import nodePolyfills from 'rollup-plugin-polyfill-node';
import json from '@rollup/plugin-json';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';
import license from 'rollup-plugin-license';
import bookmarklet from './lib/rollup-plugin-bookmarklet.js';
import generateReadme from './lib/rollup-plugin-generateReadme.mjs';
import fs from 'fs-extra';

const repositoryRawUrl =
	'https://raw.githubusercontent.com/rRoler/bookmarklets/main';

function rollup(bookmarkletsConfig, readme = false) {
	const extensions = ['.ts', '.tsx', '.mjs', '.js', '.jsx'];
	const config = [];
	bookmarkletsConfig.bookmarklets.forEach((bookmarkletConfig, index) => {
		const src_file = `src/${bookmarkletConfig.id}.ts`;
		const dep_file = `${bookmarkletsConfig.dist_folder}/${bookmarkletConfig.id}.dependencies.txt`;
		fs.ensureFile(src_file);

		const babelConfig = {
			extensions,
			babelHelpers: 'bundled',
			include: ['src/**/*'],
		};
		const configs = [
			{
				input: src_file,
				output: [
					{
						file: `${bookmarkletsConfig.dist_folder}/${bookmarkletConfig.id}.js`,
						format: 'es',
					},
				],
				plugins: [
					json(),
					resolve({ extensions }),
					commonjs(),
					nodePolyfills(),
					babel(babelConfig),
					bookmarklet({
						iife: true,
						prefix: false,
						urlEncode: false,
					}),
					license({
						sourcemap: true,
						cwd: process.cwd(),
						banner: {
							commentStyle: 'ignored',
							content:
								`Licensed under MIT: ${repositoryRawUrl}/LICENSE\n` +
								`Third party licenses: ${repositoryRawUrl}/${dep_file}`,
						},
						thirdParty: {
							includePrivate: true,
							output: {
								file: dep_file,
								encoding: 'utf-8',
							},
						},
					}),
				],
			},
			{
				input: src_file,
				output: [
					{
						file: `${bookmarkletsConfig.dist_folder}/${bookmarkletConfig.id}.min.js`,
						format: 'es',
					},
				],
				plugins: [
					json(),
					resolve({ extensions }),
					commonjs(),
					nodePolyfills(),
					babel(babelConfig),
					terser({
						compress: {
							ecma: 2015,
							negate_iife: false,
						},
						format: {
							ecma: 2015,
							comments: false,
						},
					}),
					bookmarklet(),
					generateReadme({
						bookmarkletId: bookmarkletConfig.id,
						config: bookmarkletsConfig,
						generate:
							index + 1 >= bookmarkletsConfig.bookmarklets.length && readme,
					}),
				],
			},
		];

		configs.forEach((conf) => config.push(conf));
	});
	return config;
}
export default rollup;
