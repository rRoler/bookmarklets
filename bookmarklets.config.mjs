const bookmarklets = {
	mangadex: {
		name: 'MangaDex',
		url: 'https://mangadex.org',
		bookmarklets: {
			show_cover_data: {
				version: '1',
				name: 'Show MangaDex Cover Data',
				description:
					'Display cover sizes and descriptions on MangaDex. Descriptions are shown on hover (if they exist).',
			},
			del_covers_by_lang: {
				version: '1',
				name: 'Delete MangaDex Covers by Language',
				description:
					'Requires the title edit and cover delete permissions. Removes all covers in a given language from the title edit page.',
			},
		},
	},
	amazon: {
		name: 'Amazon',
		url: 'https://www.amazon.com',
		bookmarklets: {
			download_covers: {
				version: '1',
				name: 'Download Amazon Covers',
				description:
					'Download covers from Amazon. Mainly for Amazon Japan but should work on most kindle group or single book pages even on Global.',
			},
		},
	},
	bookwalker: {
		name: 'BookWalker',
		url: 'https://bookwalker.jp',
		bookmarklets: {
			download_covers: {
				version: '1',
				name: 'Download BookWalker Covers',
				description:
					"Download covers from BookWalker. Downloading is limited because of CORS. It's recommended to use the [BookWalker UserScript](https://github.com/rRoler/UserScripts/blob/master/Public/tampermonkey/bookwalker.js) instead.",
			},
		},
	},
};

function bookmarkletsConfig() {
	for (const website in bookmarklets) {
		for (const bookmarklet in bookmarklets[website].bookmarklets) {
			bookmarklets[website].id = website;
			bookmarklets[website].bookmarklets[bookmarklet].website =
				bookmarklets[website];
			bookmarklets[website].bookmarklets[
				bookmarklet
			].id = `${website}/${bookmarklet}`;
			bookmarklets[website].bookmarklets[bookmarklet].author = 'Roler';
			bookmarklets[website].bookmarklets[
				bookmarklet
			].source_code = `https://github.com/rRoler/Bookmarklets/blob/main/src/${website}/${bookmarklet}.ts`;
			bookmarklets[website].bookmarklets[
				bookmarklet
			].bookmarklet_code = `https://github.com/rRoler/Bookmarklets/blob/main/dist/${website}/${bookmarklet}.min.js`;
		}
	}

	return bookmarklets;
}

export default bookmarkletsConfig;
