import * as mangadex from './shared';
import * as BM from '../shared';
import * as Api from './types/api';
import SimpleProgressBar from '../components/progress_bars';

mangadex.newBookmarklet(() => {
	const maxCoverRetry = 4;
	const requestLimit = 100;
	const maxRequestOffset = 1000;
	const coverElements: Array<HTMLImageElement | HTMLDivElement> = [];
	const coverFileNames: Map<string, Set<string>> = new Map();
	const skippedCoverFileNames: Map<string, Set<string>> = new Map();
	const mangaIdsForQuery: Record<string, Array<string>> = {
		manga: [],
		cover: [],
	};
	const progressBar = new SimpleProgressBar();

	document.querySelectorAll('img, div').forEach((element) => {
		const imageSource =
			(element as HTMLImageElement).src ||
			(element as HTMLDivElement).style.getPropertyValue('background-image');
		if (
			!/\/covers\/+[-0-9a-f]{20,}\/+[-0-9a-f]{20,}[^/]+(?:[?#].*)?$/.test(
				imageSource,
			) ||
			element.classList.contains('banner-image')
		)
			return;
		const mangaId = BM.getMatch(imageSource, /[-0-9a-f]{20,}/);
		const coverFileName =
			BM.getMatch(
				imageSource,
				/([-0-9a-f]{20,}\.[^/.]*)\.[0-9]+\.[^/.?#]*([?#].*)?$/,
				1,
			) || BM.getMatch(imageSource, /[-0-9a-f]{20,}\.[^/.]*?$/);
		if (!mangaId || !coverFileName) return;
		const addCoverFileName = (fileNames: Map<string, Set<string>>): void => {
			fileNames.has(mangaId)
				? fileNames.get(mangaId)?.add(coverFileName)
				: fileNames.set(mangaId, new Set([coverFileName]));
		};
		if (element.getAttribute('cover-data-bookmarklet') === 'executed') {
			addCoverFileName(skippedCoverFileNames);
			return;
		}
		coverElements.push(element as HTMLImageElement | HTMLDivElement);
		element.setAttribute('cover-data-bookmarklet', 'executed');
		addCoverFileName(coverFileNames);
	});

	if (coverFileNames.size <= 0) {
		if (document.querySelector('[cover-data-bookmarklet="executed"]'))
			return alert(
				'No new covers were found on this page since the last time this bookmarklet was executed!',
			);
		return alert('No covers were found on this page!');
	}

	progressBar.add();

	coverFileNames.forEach((fileNames, mangaId) => {
		const skippedCoversSize = skippedCoverFileNames.get(mangaId)?.size || 0;
		if (fileNames.size + skippedCoversSize > 1)
			mangaIdsForQuery.cover.push(mangaId);
		else mangaIdsForQuery.manga.push(mangaId);
	});

	getAllCoverData()
		.then((covers) => {
			let addedCoverData = 0;
			let failedCoverData = 0;

			const coverImagesContainer = document.createElement('div');
			BM.setStyle(coverImagesContainer, {
				width: 'fit-content',
				height: 'fit-content',
				opacity: '0',
				position: 'absolute',
				top: '-10000px',
				'z-index': '-10000',
				'pointer-events': 'none',
			});
			document.body.appendChild(coverImagesContainer);

			coverElements.forEach((element) => {
				const imageSource =
					(element as HTMLImageElement).src ||
					(element as HTMLDivElement).style.getPropertyValue(
						'background-image',
					);
				let coverManga: Api.Relationship | undefined;
				const cover = covers.find((cover) => {
					coverManga = cover.relationships.find(
						(relationship) => relationship.type === 'manga',
					);
					if (
						coverManga &&
						new RegExp(`${coverManga.id}/${cover.attributes.fileName}`).test(
							imageSource,
						)
					)
						return cover;
				});

				if (!cover || !coverManga) {
					console.error(`Element changed primary cover image: ${element}`);
					++failedCoverData;
					reportFailed();
					return;
				}

				let coverRetry = 0;
				const coverUrl = `https://mangadex.org/covers/${coverManga.id}/${cover.attributes.fileName}`;
				const replacementCoverUrl =
					'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQIW2NgAAIAAAUAAR4f7BQAAAAASUVORK5CYII=';
				const fullSizeImage = new Image();
				fullSizeImage.setAttribute('cover-data-bookmarklet', 'executed');
				coverImagesContainer.appendChild(fullSizeImage);

				function reportFailed() {
					if (addedCoverData + failedCoverData >= coverElements.length) {
						progressBar.remove();
						if (failedCoverData > 0)
							alert(
								`${failedCoverData} cover images failed to load.\n\nReload the page and execute the bookmarklet again!`,
							);
					}
				}

				function fallbackMethod() {
					fullSizeImage.onerror = () => {
						console.error(`Cover image failed to load: ${coverUrl}`);
						++failedCoverData;
						reportFailed();
					};

					fullSizeImage.onload = () => {
						fullSizeImage.remove();
						if (coverImagesContainer.children.length <= 0)
							coverImagesContainer.remove();
						displayCoverData(
							element,
							fullSizeImage.naturalWidth,
							fullSizeImage.naturalHeight,
							cover!,
						);
						progressBar.update((++addedCoverData / coverElements.length) * 100);
						reportFailed();
					};
				}

				try {
					fullSizeImage.onerror = () => {
						console.warn(
							`Cover image failed to load: ${coverUrl}.\nRetrying...`,
						);
						fullSizeImage.removeAttribute('src');
						if (++coverRetry >= maxCoverRetry) fallbackMethod();
						fullSizeImage.setAttribute('src', coverUrl);
					};

					new ResizeObserver((_entries, observer) => {
						if (coverRetry >= maxCoverRetry) return observer.disconnect();

						const fullSizeImageWidth = fullSizeImage.naturalWidth;
						const fullSizeImageHeight = fullSizeImage.naturalHeight;
						if (fullSizeImageWidth > 0 && fullSizeImageHeight > 0) {
							observer.disconnect();
							fullSizeImage.remove();
							fullSizeImage.src = replacementCoverUrl;
							if (coverImagesContainer.children.length <= 0)
								coverImagesContainer.remove();
							displayCoverData(
								element,
								fullSizeImageWidth,
								fullSizeImageHeight,
								cover,
							);
							progressBar.update(
								(++addedCoverData / coverElements.length) * 100,
							);
							reportFailed();
						}
					}).observe(fullSizeImage);
				} catch (e) {
					fallbackMethod();
				}

				fullSizeImage.src = coverUrl;
			});
		})
		.catch((e) => {
			console.error(e);
			alert('Failed to fetch cover data!\n' + e.message);
		});

	function displayCoverData(
		element: HTMLImageElement | HTMLDivElement,
		fullSizeImageWidth: number,
		fullSizeImageHeight: number,
		cover: Api.CoverType,
	) {
		element.setAttribute('cover-data-cover-id', cover.id);
		const descriptionShowElement = document.createElement('span');
		const descriptionElement = document.createElement('span');
		const descriptionShowElementSvg = BM.createSVG({
			d: 'M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z',
		});
		descriptionElement.classList.add('cover-data-bookmarklet-description');
		if (cover.attributes.description) {
			const showDescriptions = (event: MouseEvent, show = true) => {
				const showDescription = (element: HTMLSpanElement) =>
					BM.setStyle(element, { display: show ? 'flex' : 'none' });

				event.stopPropagation();
				event.preventDefault();
				if (event.shiftKey)
					document
						.querySelectorAll('.cover-data-bookmarklet-description')
						.forEach((element) => showDescription(element as HTMLSpanElement));
				else showDescription(descriptionElement);
			};

			descriptionShowElement.setAttribute(
				'title',
				cover.attributes.description,
			);
			descriptionShowElementSvg.addEventListener('click', showDescriptions);
			descriptionShowElement.appendChild(descriptionShowElementSvg);
			const descriptionTextElement = document.createElement('span');
			descriptionTextElement.innerText = cover.attributes.description;
			BM.setStyle(descriptionTextElement, {
				'max-height': '100%',
				margin: '0.2rem',
				'text-align': 'center',
			});
			BM.setStyle(descriptionElement, {
				position: 'absolute',
				width: '100%',
				height: '100%',
				'overflow-y': 'auto',
				display: 'none',
				'align-items': 'center',
				'justify-content': 'center',
				'background-color': 'var(--md-accent)',
				'z-index': '4',
			});
			descriptionElement.addEventListener('click', (e) =>
				showDescriptions(e, false),
			);
			descriptionElement.appendChild(descriptionTextElement);
		}
		const sizeElement = document.createElement('span');
		const sizeElementText = document.createElement('span');
		const coverSize = `${fullSizeImageWidth}x${fullSizeImageHeight}`;
		sizeElementText.innerText = coverSize;
		sizeElementText.setAttribute('title', coverSize + '\n(click to copy id)');
		sizeElementText.addEventListener('click', (event) => {
			const copyId = (ids: string) => {
				navigator.clipboard
					.writeText(ids)
					.then(
						() => console.debug(`Copied cover ids: ${ids}`),
						() => console.error(`Failed to copy cover ids: ${ids}`),
					)
					.catch(console.error);
			};

			event.stopPropagation();
			event.preventDefault();

			if (event.shiftKey) {
				const coverIds: Array<string> = [];
				document
					.querySelectorAll('[cover-data-cover-id]')
					.forEach((element) => {
						const coverId = element.getAttribute('cover-data-cover-id');
						if (coverId && !coverIds.includes(coverId)) coverIds.push(coverId);
					});
				copyId(coverIds.join(' '));
			} else copyId(cover.id);
		});
		BM.setStyle(sizeElement, {
			position: 'absolute',
			top: '0',
		});
		sizeElement.appendChild(sizeElementText);
		const iconsElement = document.createElement('div');
		BM.setStyle(iconsElement, {
			display: 'flex',
			'flex-wrap': 'nowrap',
			gap: '0.2rem',
		});
		if (element instanceof HTMLImageElement) {
			BM.setStyle(sizeElement, {
				padding: '0.5rem 0.5rem 1rem',
				color: '#fff',
				left: '0',
				width: '100%',
				background: 'linear-gradient(0deg,transparent,rgba(0,0,0,0.8))',
				'border-top-right-radius': '0.25rem',
				'border-top-left-radius': '0.25rem',
			});
			BM.setStyle(iconsElement, {
				position: 'absolute',
				top: '0',
				right: '0',
				padding: '0.45rem 0.5rem',
				color: '#fff',
			});
			if (cover.attributes.description) {
				descriptionShowElementSvg.setAttribute('stroke-width', '1.5');
				BM.setStyle(descriptionShowElementSvg, {
					width: '1.5rem',
					height: '1.5rem',
				});
				BM.setStyle(descriptionElement, { 'border-radius': '0.25rem' });
				element.parentElement?.append(descriptionElement);
				iconsElement.appendChild(descriptionShowElement);
			}
			element.parentElement?.append(sizeElement, iconsElement);
		} else {
			BM.setStyle(sizeElement, {
				padding: '0 0.2rem',
				'background-color': 'var(--md-accent)',
				'border-bottom-left-radius': '4px',
				'border-bottom-right-radius': '4px',
			});
			element.appendChild(sizeElement);
			BM.setStyle(iconsElement, { 'margin-left': '0.2rem' });
			BM.setStyle(sizeElement, {
				display: 'flex',
				'flex-wrap': 'nowrap',
				'align-items': 'center',
			});
			if (cover.attributes.description) {
				descriptionShowElementSvg.setAttribute('stroke-width', '2');
				BM.setStyle(descriptionShowElementSvg, {
					width: '1.3rem',
					height: '1.3rem',
				});
				element.appendChild(descriptionElement);
				iconsElement.appendChild(descriptionShowElement);
			}
			sizeElement.appendChild(iconsElement);
			element.appendChild(sizeElement);
		}
	}

	function getAllCoverData(): Promise<Api.CoverListResponse['data']> {
		const covers: Array<Api.CoverType> = [];
		async function awaitAllCoverData() {
			for (const endpoint in mangaIdsForQuery) {
				const isCoverEndpoint = endpoint === 'cover';
				const mangaIdsForQuerySplit = BM.splitArray(mangaIdsForQuery[endpoint]);
				for (const ids of mangaIdsForQuerySplit) {
					const rsp = await getCoverData(ids as Array<string>, endpoint);

					if (isCoverEndpoint) {
						covers.push(...(rsp.data as Api.CoverListResponse['data']));
						for (let i = rsp.limit; i < rsp.total; i += rsp.limit) {
							const rsp = await getCoverData(ids as Array<string>, endpoint, i);
							covers.push(...(rsp.data as Api.CoverListResponse['data']));
						}
					} else {
						(rsp.data as Api.MangaListResponse['data']).forEach((manga) => {
							const cover = manga.relationships.find(
								(relationship) => relationship.type === 'cover_art',
							) as Api.CoverType | undefined;
							if (cover) {
								cover.relationships = [{ type: manga.type, id: manga.id }];
								covers.push(cover);
							}
						});
					}
				}
			}
			return covers;
		}

		return new Promise((resolve, reject) => {
			awaitAllCoverData().then(resolve).catch(reject);
		});
	}

	function getCoverData(
		ids: Array<string>,
		endpoint: string,
		offset = 0,
	): Promise<Api.MangaListResponse | Api.CoverListResponse> {
		return new Promise((resolve, reject) => {
			const isCoverEndpoint = endpoint === 'cover';
			const mangaIdsQuery = ids
				.map((id) => (isCoverEndpoint ? `manga[]=${id}` : `ids[]=${id}`))
				.join('&');
			let url = `https://api.mangadex.org/${endpoint}?${mangaIdsQuery}&includes[]=cover_art&limit=${requestLimit}&contentRating[]=safe&contentRating[]=suggestive&contentRating[]=erotica&contentRating[]=pornographic&offset=${offset}`;
			if (isCoverEndpoint)
				url = `https://api.mangadex.org/${endpoint}?order[volume]=asc&${mangaIdsQuery}&limit=${requestLimit}&offset=${offset}`;
			if (offset > maxRequestOffset)
				return reject(
					new Error(`Offset is bigger than ${maxRequestOffset}:\n ${url}`),
				);
			fetch(url)
				.then((rsp) => resolve(rsp.json()))
				.catch(reject);
		});
	}
});
