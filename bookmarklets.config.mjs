const repositoryUrl = 'https://github.com/rRoler/bookmarklets';
const bookmarklets = {
	mangadex: {
		name: 'MangaDex',
		url: 'https://mangadex.org',
		bookmarklets: {
			show_cover_data: {
				version: '3.6',
				name: 'Show Cover Data',
				description:
					'Display cover information.' +
					'<br>The cover size element can be clicked or hovered to show more cover information.' +
					'<br>If the cover description exists, an info icon will be shown beside the cover size element.' +
					'<br>Hold shift while clicking the cover size element to show information of all covers.' +
					'<br>Hold shift while clicking the cover information element to hide information of all covers.' +
					'<br>Hold shift while clicking the "Copy Cover ID" element to copy the IDs of all covers.',
			},
			add_cover_descriptions: {
				version: '2.3',
				name: 'Add Cover Descriptions',
				description:
					'Requires the title edit and cover edit permissions. Adds cover descriptions to all newly added covers with no description on the title edit page.' +
					'<br>$volume = cover volume number' +
					'<br>$language = cover language' +
					'<br>$nl = new line',
			},
			search_missing_links: {
				version: '2.1',
				name: 'Search Missing Links',
				description:
					'Opens a new tab with a search for each missing tracking or retail link from a title page.',
			},
			shorten_links: {
				version: '2.3',
				name: 'Shorten Links',
				description:
					'Requires the title edit permissions. Makes tracking, retail and some official site links from a title edit page shorter/prettier.',
			},
			open_links: {
				version: '1.5',
				name: 'Open Links',
				description: 'Opens all links from a title page.',
			},
			del_covers_by_lang: {
				version: '1.8',
				name: 'Delete Covers by Language',
				description:
					'Requires the title edit and cover delete permissions. Removes all covers in a given language from the title edit page.',
			},
		},
	},
	amazon: {
		name: 'Amazon',
		url: 'https://www.amazon.co.jp',
		bookmarklets: {
			download_covers: {
				version: '2.4',
				name: 'Download Covers',
				description:
					'Downloads covers. Mainly for Amazon Japan but should work on most kindle group or single book pages even on Global.',
			},
		},
	},
	bookwalker: {
		name: 'BookWalker',
		url: 'https://bookwalker.jp',
		bookmarklets: {
			download_covers: {
				version: '1.6',
				name: 'Download Covers',
				description:
					"Downloads covers. Downloading is limited because of CORS. It's recommended to use the [BookWalker UserScript](https://github.com/rRoler/UserScripts/blob/master/Public/tampermonkey/bookwalker.js) instead.",
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
			bookmarklets[website].bookmarklets[bookmarklet].path =
				`${website}/${bookmarklet}`;
			bookmarklets[website].bookmarklets[bookmarklet].id =
				`${website}-${bookmarklet}`;
			bookmarklets[website].bookmarklets[bookmarklet].author = 'Roler';
			bookmarklets[website].bookmarklets[bookmarklet].source_code =
				`${repositoryUrl}/blob/main/src/${bookmarklets[website].bookmarklets[bookmarklet].path}.ts`;
			bookmarklets[website].bookmarklets[bookmarklet].bookmarklet_code =
				`${repositoryUrl}/blob/main/dist/${bookmarklets[website].bookmarklets[bookmarklet].id}-v${bookmarklets[website].bookmarklets[bookmarklet].version}.min.js`;
		}
	}

	return bookmarklets;
}

export default bookmarkletsConfig();
