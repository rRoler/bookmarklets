const repositoryUrl = 'https://github.com/rRoler/bookmarklets/blob/main';
const bookmarklets = {
	mangadex: {
		name: 'MangaDex',
		url: 'https://mangadex.org',
		bookmarklets: {
			show_cover_data: {
				version: '2.2',
				name: 'Show Cover Data',
				description:
					'Display cover sizes and descriptions. If the cover description exists, an icon will be shown that can be clicked or hovered to display the description.',
			},
			show_all_cover_descriptions: {
				version: '1.2',
				name: 'Show All Cover Descriptions',
				description:
					'**Needs to be executed after the "Show MangaDex Cover Data" bookmarklet.** Shows all cover descriptions.',
			},
			add_cover_descriptions: {
				version: '1.1',
				name: 'Add Cover Descriptions',
				description:
					'Requires the title edit and cover edit permissions. Adds cover descriptions to all newly added covers with no description on the title edit page.',
			},
			search_missing_links: {
				version: '1.4',
				name: 'Search Missing Links',
				description:
					'Opens a new tab with a search for each missing tracking or retail link from a title page.',
			},
			shorten_links: {
				version: '1.4',
				name: 'Shorten Links',
				description:
					'Requires the title edit permissions. Makes tracking and retail links from a title edit page shorter/prettier.',
			},
			open_links: {
				version: '1',
				name: 'Open Links',
				description: 'Opens all links from a title page.',
			},
			del_covers_by_lang: {
				version: '1.2',
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
				version: '1.6',
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
				version: '1.2',
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
			bookmarklets[website].bookmarklets[
				bookmarklet
			].id = `${website}/${bookmarklet}`;
			bookmarklets[website].bookmarklets[bookmarklet].author = 'Roler';
			bookmarklets[website].bookmarklets[
				bookmarklet
			].source_code = `${repositoryUrl}/src/${website}/${bookmarklet}.ts`;
			bookmarklets[website].bookmarklets[
				bookmarklet
			].bookmarklet_code = `${repositoryUrl}/dist/${website}/${bookmarklet}.min.js`;
		}
	}

	return bookmarklets;
}

export default bookmarkletsConfig();
