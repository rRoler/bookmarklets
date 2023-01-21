import fs from 'fs';
import fsExtra from 'fs-extra';

function generate(
	options = {
		bookmarkletId: '',
		config: { dist_folder: 'dist', bookmarklets: [] },
		generate: true,
	}
) {
	const name = 'generateReadme';
	if (!options.config || !options.generate) return { name: name };
	return {
		name: name,
		renderChunk: (code) => {
			console.log('Generating README.md...');
			let markdown =
				'### [What are bookmarklets?](https://en.wikipedia.org/wiki/Bookmarklet)\n' +
				'***\n';

			options.config.bookmarklets.forEach((bookmarklet) => {
				const getCode = () => {
					const rgx = /\n$/;
					if (options.bookmarkletId !== bookmarklet.id)
						return fs
							.readFileSync(
								`${options.config.dist_folder}/${bookmarklet.id}.min.js`,
								'utf-8'
							)
							.replace(rgx, '');
					return code.replace(rgx, '');
				};

				markdown +=
					`> # [${bookmarklet.name}](${getCode()})<br>\n` +
					`> **For website: [${bookmarklet.website.name}](${bookmarklet.website.url})**<br>\n` +
					// `> Author: ${bookmarklet.author}<br>\n` +
					`> Version: ${bookmarklet.version}<br>\n` +
					`> Description: ${bookmarklet.description}<br>\n` +
					`> [Bookmarklet Code](${bookmarklet.bookmarklet_code})<br>\n` +
					`> [Source Code](${bookmarklet.source_code})\n\n`;
			});

			markdown += '***';

			fsExtra.outputFileSync('README.md', markdown);
			console.log('README.md successfully generated.');
		},
	};
}
export default generate;
