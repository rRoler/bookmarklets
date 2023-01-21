import * as BM from '../shared';
import * as amazon from './shared';
import * as fflate from 'fflate';

bookmarklet();

function bookmarklet(): void {
	if (!amazon.checkSite()) return;

	const zipAmount = 4;
	const books = document.querySelectorAll('.itemImageLink');
	const getAsin = (url: string): string | undefined =>
		BM.getMatch(url, /(?:[/dp]|$)([A-Z0-9]{10})/, 1);
	const getCoverUrl = (asin: string): string =>
		`https://${window.location.hostname}/images/P/${asin}.01.MAIN._SCRM_.jpg`;

	if (books.length > 0) {
		const asins = Array.from(books).map((book) =>
			getAsin((book as HTMLAnchorElement).href)
		) as Array<string | undefined>;
		if (
			books.length > zipAmount &&
			confirm(
				`Since you're downloading more than ${zipAmount} covers, would you like to zip them?`
			)
		)
			return zipCovers(asins);
		saveCovers(asins);
		return;
	}
	const locationAsin = getAsin(window.location.href);
	if (!locationAsin) return alert('No covers found on this page!');
	saveCovers([locationAsin]);

	function saveCovers(asins: Array<string | undefined>): void | boolean {
		asins.forEach((asin) => {
			if (!asin) return;
			BM.saveAs(getCoverUrl(asin), `${asin}.jpg`);
		});
	}
	function zipCovers(asins: Array<string | undefined>): void {
		const chunks: Uint8Array[] = [];
		const zip = new fflate.Zip(
			(err: fflate.FlateError | null, chunk: Uint8Array, final: boolean) => {
				if (err) alert('Failed to zip covers!');
				else chunks.push(chunk);
				if (final) {
					BM.saveAs(
						new Blob(chunks, { type: 'application/zip' }),
						'covers.zip'
					);
				}
			}
		);

		asins.forEach((asin) => {
			if (!asin) return;
			const coverUrl = getCoverUrl(asin);
			zipCover(coverUrl, asin);
		});

		let pushedFiles = 0;
		function zipCover(coverUrl: string, asin: string) {
			const reader = new FileReader();
			reader.onload = (event) => {
				if (!event.target) return ++pushedFiles;
				const data = new Uint8Array(event.target.result as ArrayBuffer);
				const file = new fflate.ZipPassThrough(`${asin}.jpg`);

				zip.add(file);
				file.push(data, true);
				++pushedFiles;
				if (pushedFiles >= books.length) {
					zip.end();
				}
			};

			fetch(coverUrl)
				.then((rsp) => rsp.blob())
				.then((blob) => {
					try {
						reader.readAsArrayBuffer(blob);
					} catch (e) {
						console.error('Failed to zip cover!', e);
					}
				})
				.catch((e) => console.error('Failed to fetch cover!', e));
		}
	}
}
