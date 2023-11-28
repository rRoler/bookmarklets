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

const repositoryUrl = 'https://github.com/rRoler/bookmarklets';

function rollup(bookmarkletsConfig, readme = false) {
	const extensions = ['.ts', '.tsx', '.mjs', '.js', '.jsx'];
	const config = [];
	bookmarkletsConfig.bookmarklets.forEach((bookmarkletConfig, index) => {
		const src_file = `src/${bookmarkletConfig.path}.ts`;
		const dest_filename = `${bookmarkletConfig.id}-v${bookmarkletConfig.version}`;
		const dep_file = `${bookmarkletsConfig.dist_folder}/${dest_filename}.dependencies.txt`;
		fs.ensureFile(src_file);

		const babelConfig = {
			extensions,
			babelHelpers: 'bundled',
			include: ['src/**/*'],
		};
		const licenseConfig = {
			sourcemap: true,
			cwd: process.cwd(),
			banner: {
				commentStyle: 'ignored',
				content:
					`Licensed under MIT: ${repositoryUrl}/raw/main/LICENSE\n` +
					`Third party licenses: ${repositoryUrl}/raw/main/${dep_file}`,
			},
		};
		const configs = [
			{
				input: src_file,
				output: [
					{
						file: `${bookmarkletsConfig.dist_folder}/${dest_filename}.js`,
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
						...licenseConfig,
						thirdParty: {
							includePrivate: true,
							allow: {
								test: '(MIT OR Apache-2.0)',
								failOnUnlicensed: true,
								failOnViolation: true,
							},
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
						file: `${bookmarkletsConfig.dist_folder}/${dest_filename}.min.js`,
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
						module: true,
						compress: {
							negate_iife: false,
						},
						format: {
							comments: false,
						},
					}),
					bookmarklet({
						iife: true,
						prefix: true,
						urlEncode: false,
					}),
					license(licenseConfig),
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
