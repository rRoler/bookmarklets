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
			const tableOfContentsForWebsite = {};
			const bookmarkletsForWebsite = {};
			let images =
				'[Bookmarklet Code]: https://img.shields.io/badge/Bookmarklet%20Code-b5e853?style=for-the-badge\n' +
				'[Source Code]: https://img.shields.io/badge/Source%20Code-3c3c3c?style=for-the-badge\n\n';
			let tableOfContents = '';
			let bookmarkletsInfo = '';
			let usefulLinks =
				'### [What are bookmarklets?](https://en.wikipedia.org/wiki/Bookmarklet)';

			const getHeaderId = (headerName) =>
				headerName
					.toLowerCase()
					.replaceAll(' ', '-')
					.replace(/[^a-z0-9\-]/g, '');

			options.config.bookmarklets.forEach((bookmarklet) => {
				const isLastBookmarklet = options.bookmarkletId === bookmarklet.id;
				const getCode = () => {
					const rgx = /\n$/;
					if (!isLastBookmarklet)
						return fs
							.readFileSync(
								`${options.config.dist_folder}/${bookmarklet.id}.min.js`,
								'utf-8'
							)
							.replace(rgx, '');
					return code.replace(rgx, '');
				};
				const contentsName = `${bookmarklet.name} v${bookmarklet.version}`;
				const headerName = `[${bookmarklet.website.name}] ${contentsName}`;
				const headerId = getHeaderId(headerName);

				if (!tableOfContentsForWebsite[bookmarklet.website.id])
					tableOfContentsForWebsite[bookmarklet.website.id] = '';
				if (!bookmarkletsForWebsite[bookmarklet.website.id])
					bookmarkletsForWebsite[bookmarklet.website.id] = {
						websiteInfo: bookmarklet.website,
						bookmarkletsInfo: '',
					};

				tableOfContentsForWebsite[
					bookmarklet.website.id
				] += `	- [${contentsName}](#${headerId})\n`;

				bookmarkletsForWebsite[bookmarklet.website.id].bookmarkletsInfo +=
					`> ## [${headerName}](${getCode()})<br>\n` +
					// `> **For website: [${bookmarklet.website.name}](${bookmarklet.website.url})**<br>\n` +
					// `> Author: ${bookmarklet.author}<br>\n` +
					// `> Version: ${bookmarklet.version}<br>\n` +
					// `> Description: ${bookmarklet.description}<br>\n` +
					`> ${bookmarklet.description}<br><br>\n` +
					`> [![Bookmarklet Code]](${bookmarklet.bookmarklet_code}) [![Source Code]](${bookmarklet.source_code})\n\n`;
			});

			for (const websiteId in bookmarkletsForWebsite) {
				tableOfContents +=
					`- [${
						bookmarkletsForWebsite[websiteId].websiteInfo.name
					}](#${getHeaderId(
						bookmarkletsForWebsite[websiteId].websiteInfo.name
					)})\n` + tableOfContentsForWebsite[websiteId];
				bookmarkletsInfo +=
					`# [${bookmarkletsForWebsite[websiteId].websiteInfo.name}](${bookmarkletsForWebsite[websiteId].websiteInfo.url})\n` +
					bookmarkletsForWebsite[websiteId].bookmarkletsInfo +
					'***\n';
			}

			tableOfContents += '\n';

			fsExtra.outputFileSync(
				'README.md',
				images + tableOfContents + bookmarkletsInfo + usefulLinks
			);
			console.log('README.md successfully generated.');
		},
	};
}
export default generate;
