import * as bookwalker from './shared';
import * as BM from '../shared';
import * as fileSaver from 'file-saver';

bookmarklet();

function bookmarklet(): void {
	if (!bookwalker.checkSite()) return;

	const confirmAmount = 4;
	let covers = document.querySelectorAll('img.lazy');
	if (
		/de([-0-9a-f]{20,}\/.*)?$/.test(window.location.pathname) ||
		document.querySelector('#js-episode-list')
	)
		covers = document.querySelectorAll('meta[property="og:image"]');
	const getId = (url: string): number | undefined => {
		const id =
			BM.getMatch(url, /:\/\/[^/]*\/([0-9]+)\/[0-9a-zA-Z_]+(\.[^/.]*)$/, 1) ||
			BM.getMatch(url, /:\/\/[^/]*\/(\D+)([0-9]+)(\.[^/.]*)$/, 2);
		if (!id) return undefined;
		if (/:\/\/c.bookwalker.jp\/thumbnailImage_[0-9]+\.[^/.]*$/.test(url))
			return parseInt(id) - 1;
		return parseInt(id.split('').reverse().join('')) - 1;
	};
	const getCoverUrl = (id: string): string =>
		`https://c.bookwalker.jp/coverImage_${id}.jpg`;

	const ids = Array.from(covers).map((cover) => {
		return getId(
			(cover as HTMLImageElement).getAttribute('data-original') ||
				(cover as HTMLImageElement).getAttribute('data-srcset') ||
				(cover as HTMLImageElement).src ||
				(cover as HTMLMetaElement).content
		);
	}) as Array<string | undefined>;

	if (
		covers.length > confirmAmount &&
		!confirm(`You are about to download more than ${confirmAmount} covers!`)
	)
		return;
	saveCovers(ids);

	function saveCovers(ids: Array<string | undefined>): void | boolean {
		ids.forEach((id) => {
			if (!id) return;
			fileSaver.saveAs(getCoverUrl(id), `${id}.jpg`);
		});
	}
}
