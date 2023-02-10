import * as BM from '../shared';
import * as amazon from './shared';
import * as fflate from 'fflate';
import * as fileSaver from 'file-saver';
import SimpleProgressBar from '../components/progress_bars';

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
			fileSaver.saveAs(getCoverUrl(asin), `${asin}.jpg`);
		});
	}
	function zipCovers(asins: Array<string | undefined>): void {
		const progressBar = new SimpleProgressBar();
		progressBar.addToDocument();

		let zippedFiles = 0;
		const chunks: Uint8Array[] = [];
		const zip = new fflate.Zip(
			(err: fflate.FlateError | null, chunk: Uint8Array, final: boolean) => {
				progressBar.update((zippedFiles / asins.length) * 100);
				if (err) {
					progressBar.removeFromDocument();
					alert('Failed to zip covers!');
				} else chunks.push(chunk);
				if (final) {
					progressBar.removeFromDocument();
					fileSaver.saveAs(
						new Blob(chunks, { type: 'application/zip' }),
						'covers.zip'
					);
				}
			}
		);

		asins.forEach(async (asin) => {
			if (asin) {
				const coverUrl = getCoverUrl(asin);
				await zipCover(coverUrl, asin);
			}
			if (++zippedFiles >= asins.length) zip.end();
		});

		function zipCover(coverUrl: string, asin: string): Promise<void> {
			return new Promise((resolve) => {
				const reader = new FileReader();
				reader.onload = (event) => {
					if (!event.target) return;
					const data = new Uint8Array(event.target.result as ArrayBuffer);
					const file = new fflate.ZipPassThrough(`${asin}.jpg`);

					zip.add(file);
					file.push(data, true);
					resolve();
				};

				fetch(coverUrl)
					.then((rsp) => rsp.blob())
					.then((blob) => {
						try {
							reader.readAsArrayBuffer(blob);
						} catch (e) {
							progressBar.removeFromDocument();
							console.error('Failed to zip cover!', e);
						}
					})
					.catch((e) => {
						progressBar.removeFromDocument();
						console.error('Failed to fetch cover!', e);
					});
			});
		}
	}
}
