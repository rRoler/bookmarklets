import rollup from './rollup.config.mjs';
import bookmarkletsConfig from './bookmarklets.config.mjs';

const config = {
	dist_folder: 'dist',
	bookmarklets: [
		bookmarkletsConfig().amazon.bookmarklets.download_covers,
		bookmarkletsConfig().bookwalker.bookmarklets.download_covers,
		bookmarkletsConfig().mangadex.bookmarklets.show_cover_data,
		bookmarkletsConfig().mangadex.bookmarklets.del_covers_by_lang,
	],
};

export default rollup(config, true);
