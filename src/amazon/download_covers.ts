import * as BM from '../shared';
import * as amazon from './shared';
import * as fflate from 'fflate';
import * as fileSaver from 'file-saver';
import SimpleProgressBar from '../components/progress_bars';

amazon.newBookmarklet(() => {
	const zipAmount = 4;
	const books = document.querySelectorAll('.itemImageLink');
	const getAsin = (url: string): string | undefined =>
		BM.getMatch(url, /(?:[/dp]|$)([A-Z0-9]{10})/, 1);
	const getCoverUrl = (asin: string): string =>
		`https://${window.location.hostname}/images/P/${asin}.01.MAIN._SCRM_.jpg`;
	const getCover = (coverUrl: string): Promise<Blob> => {
		const fetchCover = (url: string): Promise<Blob> =>
			new Promise((resolve, reject) =>
				fetch(url)
					.then((rsp) => rsp.blob())
					.then((blob) => {
						if (blob.size < 1024) throw new Error('cover is smaller than 1 KB');
						resolve(blob);
					})
					.catch((e) => reject('Failed to fetch cover!\n' + e)),
			);

		return new Promise((resolve, reject) => {
			fetchCover(coverUrl)
				.then(resolve)
				.catch((e) => {
					const fallbackImage: HTMLImageElement | null =
						document.querySelector('img#igImage') ||
						document.querySelector('img#imgBlkFront') ||
						document.querySelector('img#ebooksImgBlkFront');
					if (fallbackImage) {
						const regex =
							/(https?:\/\/.*\/images\/[A-Z]\/[A-Za-z0-9+-]+).*(\.[a-z]+)/;
						const imageSource = BM.getMatch(fallbackImage.src, regex, 1);
						const imageExtension = BM.getMatch(fallbackImage.src, regex, 2);
						if (imageSource && imageExtension)
							return fetchCover(imageSource + imageExtension)
								.then(resolve)
								.catch(reject);
					}
					reject(e);
				});
		});
	};
	let errors = 0;
	const reportError = (error: Error | string) => {
		console.error(error);
		if (++errors === 1) alert(error);
	};

	if (books.length > 0) {
		const asins = Array.from(books).map((book) =>
			getAsin((book as HTMLAnchorElement).href),
		) as Array<string | undefined>;
		if (
			books.length > zipAmount &&
			confirm(
				`Since you're downloading more than ${zipAmount} covers, would you like to zip them?`,
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
			getCover(getCoverUrl(asin))
				.then((blob) => fileSaver.saveAs(blob, `${asin}.jpg`))
				.catch(reportError);
		});
	}
	function zipCovers(asins: Array<string | undefined>): void {
		const progressBar = new SimpleProgressBar();
		progressBar.add();

		let zippedFiles = 0;
		const chunks: Uint8Array[] = [];
		const zip = new fflate.Zip(
			(err: fflate.FlateError | null, chunk: Uint8Array, final: boolean) => {
				progressBar.update((zippedFiles / asins.length) * 100);
				if (err) {
					reportError('Failed to zip covers!\n' + err);
					progressBar.remove();
				} else chunks.push(chunk);
				if (final) {
					fileSaver.saveAs(
						new Blob(chunks, { type: 'application/zip' }),
						'covers.zip',
					);
					progressBar.remove();
				}
			},
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

				getCover(coverUrl)
					.then((blob) => {
						try {
							reader.readAsArrayBuffer(blob);
						} catch (e) {
							throw new Error('Failed to zip cover!\n' + e);
						}
					})
					.catch((e) => {
						reportError(e);
						progressBar.remove();
					});
			});
		}
	}
});
