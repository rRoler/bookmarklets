import * as mangadex from './shared';

mangadex.newBookmarklet(() => {
	const showDescriptionButtons = document.querySelectorAll(
		'.cover-data-bookmarklet-show-description'
	);

	if (showDescriptionButtons.length <= 0)
		return alert('No covers with a description found!');
	showDescriptionButtons.forEach((element) =>
		element.dispatchEvent(new MouseEvent('click'))
	);
});
