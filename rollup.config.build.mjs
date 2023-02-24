import rollup from './rollup.config.mjs';
import bookmarkletsConfig from './bookmarklets.config.mjs';

const config = {
	dist_folder: 'dist',
	bookmarklets: [
		bookmarkletsConfig.mangadex.bookmarklets.show_cover_data,
		bookmarkletsConfig.mangadex.bookmarklets.show_all_cover_descriptions,
		bookmarkletsConfig.mangadex.bookmarklets.add_cover_descriptions,
		bookmarkletsConfig.mangadex.bookmarklets.search_missing_links,
		bookmarkletsConfig.mangadex.bookmarklets.shorten_links,
		bookmarkletsConfig.mangadex.bookmarklets.open_links,
		bookmarkletsConfig.mangadex.bookmarklets.del_covers_by_lang,
		bookmarkletsConfig.amazon.bookmarklets.download_covers,
		bookmarkletsConfig.bookwalker.bookmarklets.download_covers,
	],
};

export default rollup(config, true);
