import rollup from './rollup.config.mjs';
import bookmarkletsConfig from './bookmarklets.config.mjs';

const config = {
	dist_folder: 'dev',
	bookmarklets: getAllBookmarklets(),
};

function getAllBookmarklets() {
	const bookmarklets = [];
	const config = bookmarkletsConfig();
	for (const website in config) {
		for (const bookmarklet in config[website].bookmarklets) {
			bookmarklets.push(config[website].bookmarklets[bookmarklet]);
		}
	}
	return bookmarklets;
}

export default rollup(config);
