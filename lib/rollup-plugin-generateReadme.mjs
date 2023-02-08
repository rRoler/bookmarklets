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
				'[Bookmarklet Code]: https://img.shields.io/badge/Bookmarklet%20Code-b5e853?style=for-the-badge\n' +
				'[Source Code]: https://img.shields.io/badge/Source%20Code-3c3c3c?style=for-the-badge\n' +
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
					`> # [${bookmarklet.name}](${getCode()}) v${
						bookmarklet.version
					}<br>\n` +
					`> **For website: [${bookmarklet.website.name}](${bookmarklet.website.url})**<br>\n` +
					// `> Author: ${bookmarklet.author}<br>\n` +
					// `> Version: ${bookmarklet.version}<br>\n` +
					`> Description: ${bookmarklet.description}<br>\n` +
					`> [![Bookmarklet Code]](${bookmarklet.bookmarklet_code}) [![Source Code]](${bookmarklet.source_code})\n\n`;
			});

			markdown +=
				'***\n' +
				'### [What are bookmarklets?](https://en.wikipedia.org/wiki/Bookmarklet)';

			fsExtra.outputFileSync('README.md', markdown);
			console.log('README.md successfully generated.');
		},
	};
}
export default generate;
