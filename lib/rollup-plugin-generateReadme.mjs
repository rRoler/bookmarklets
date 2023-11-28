import fs from 'fs';
import fsExtra from 'fs-extra';

function generate(
	options = {
		bookmarkletId: '',
		config: { dist_folder: 'dist', bookmarklets: [] },
		generate: true,
	},
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

			const specialCharacters = [
				'%',
				'"',
				'<',
				'>',
				'#',
				'@',
				' ',
				'\\&',
				'\\?',
				'{',
				'}',
			];

			const urlEncode = (code) =>
				code.replace(
					new RegExp(specialCharacters.join('|'), 'g'),
					encodeURIComponent,
				);

			options.config.bookmarklets.forEach((bookmarklet) => {
				const isLastBookmarklet = options.bookmarkletId === bookmarklet.id;
				const getCode = () => {
					const removeBannerRegex = /^\/\*!.*\*\/\n/s;
					if (!isLastBookmarklet)
						return urlEncode(
							fs.readFileSync(
								`${options.config.dist_folder}/${bookmarklet.id}-v${bookmarklet.version}.min.js`,
								'utf-8',
							),
						)
							.replace(removeBannerRegex, '')
							.trim();
					return urlEncode(code).replace(removeBannerRegex, '').trim();
				};
				const headerName = `[${bookmarklet.website.name}] ${bookmarklet.name}`;
				const headerId = getHeaderId(headerName);

				if (!tableOfContentsForWebsite[bookmarklet.website.id])
					tableOfContentsForWebsite[bookmarklet.website.id] = '';
				if (!bookmarkletsForWebsite[bookmarklet.website.id])
					bookmarkletsForWebsite[bookmarklet.website.id] = {
						websiteInfo: bookmarklet.website,
						bookmarkletsInfo: '',
					};

				tableOfContentsForWebsite[bookmarklet.website.id] +=
					`	- [${bookmarklet.name} v${bookmarklet.version}](#${headerId})\n`;

				bookmarkletsForWebsite[bookmarklet.website.id].bookmarkletsInfo +=
					`<h6 id="${headerId}"></h6>\n\n` +
					`> ## <a href="${getCode()}">${headerName} v${
						bookmarklet.version
					}</a><br>\n` +
					`> ${bookmarklet.description}<br><br>\n` +
					`> [![Bookmarklet Code]](${bookmarklet.bookmarklet_code}) [![Source Code]](${bookmarklet.source_code})\n\n`;
			});

			for (const websiteId in bookmarkletsForWebsite) {
				tableOfContents +=
					`- [${
						bookmarkletsForWebsite[websiteId].websiteInfo.name
					}](#${getHeaderId(
						bookmarkletsForWebsite[websiteId].websiteInfo.name,
					)})\n` + tableOfContentsForWebsite[websiteId];
				bookmarkletsInfo +=
					`# [${bookmarkletsForWebsite[websiteId].websiteInfo.name}](${bookmarkletsForWebsite[websiteId].websiteInfo.url})\n` +
					bookmarkletsForWebsite[websiteId].bookmarkletsInfo +
					'***\n';
			}

			tableOfContents += '\n';

			fsExtra.outputFileSync(
				'README.md',
				images + tableOfContents + bookmarkletsInfo + usefulLinks,
			);
			console.log('README.md successfully generated.');
		},
	};
}
export default generate;
