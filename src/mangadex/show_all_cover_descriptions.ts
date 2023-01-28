import * as mangadex from './shared';

bookmarklet();

function bookmarklet(): void {
	if (!mangadex.checkSite()) return;

	document
		.querySelectorAll('.cover-data-bookmarklet-show-description')
		.forEach((element) => element.dispatchEvent(new MouseEvent('click')));
}
