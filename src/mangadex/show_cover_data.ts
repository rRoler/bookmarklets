import * as mangadex from './shared';
import * as BM from '../shared';
import * as Api from './types/api';
import SimpleProgressBar from '../components/progress_bars';

mangadex.newBookmarklet(() => {
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
				imageSource
			) ||
			element.classList.contains('banner-image')
		)
			return;
		const mangaId = BM.getMatch(imageSource, /[-0-9a-f]{20,}/);
		const coverFileName =
			BM.getMatch(
				imageSource,
				/([-0-9a-f]{20,}\.[^/.]*)\.[0-9]+\.[^/.?#]*([?#].*)?$/,
				1
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
				'No new covers were found on this page since the last time this bookmarklet was executed!'
			);
		return alert('No covers were found on this page!');
	}

	progressBar.addToDocument();

	coverFileNames.forEach((fileNames, mangaId) => {
		const skippedCoversSize = skippedCoverFileNames.get(mangaId)?.size || 0;
		if (fileNames.size + skippedCoversSize > 1)
			mangaIdsForQuery.cover.push(mangaId);
		else mangaIdsForQuery.manga.push(mangaId);
	});

	getAllCoverData()
		.then((covers) => {
			let addedCoverData = 0;
			const coverImagesContainer = document.createElement('div');
			coverImagesContainer.style.setProperty('opacity', '0');
			coverImagesContainer.style.setProperty('position', 'absolute');
			coverImagesContainer.style.setProperty('top', '-10000px');
			coverImagesContainer.style.setProperty('z-index', '-10000');
			coverImagesContainer.style.setProperty('pointer-events', 'none');
			document.body.appendChild(coverImagesContainer);
			coverElements.forEach((element) => {
				const imageSource =
					(element as HTMLImageElement).src ||
					(element as HTMLDivElement).style.getPropertyValue(
						'background-image'
					);
				covers.forEach((cover) => {
					const coverManga = cover.relationships.find(
						(relationship) => relationship.type === 'manga'
					);
					if (!coverManga) return;
					if (
						new RegExp(`${coverManga.id}/${cover.attributes.fileName}`).test(
							imageSource
						)
					) {
						const fullSizeImage = new Image();
						coverImagesContainer.appendChild(fullSizeImage);

						try {
							new ResizeObserver((entries, observer) => {
								const fullSizeImageWidth = fullSizeImage.naturalWidth;
								const fullSizeImageHeight = fullSizeImage.naturalHeight;
								if (fullSizeImageWidth > 0 && fullSizeImageHeight > 0) {
									observer.disconnect();
									fullSizeImage.remove();
									fullSizeImage.src =
										'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQIW2NgAAIAAAUAAR4f7BQAAAAASUVORK5CYII=';
									if (coverImagesContainer.children.length <= 0)
										coverImagesContainer.remove();
									displayCoverData(
										element,
										fullSizeImageWidth,
										fullSizeImageHeight,
										cover
									);
									progressBar.update(
										(++addedCoverData / coverElements.length) * 100
									);
								}
							}).observe(fullSizeImage);
						} catch (e) {
							fullSizeImage.onload = () => {
								fullSizeImage.remove();
								if (coverImagesContainer.children.length <= 0)
									coverImagesContainer.remove();
								displayCoverData(
									element,
									fullSizeImage.naturalWidth,
									fullSizeImage.naturalHeight,
									cover
								);
								progressBar.update(
									(++addedCoverData / coverElements.length) * 100
								);
							};
						}

						fullSizeImage.src = `https://mangadex.org/covers/${coverManga.id}/${cover.attributes.fileName}`;
					}
				});
			});
		})
		.catch((e) => {
			console.error(e);
			alert('Failed to fetch cover data!');
		});

	function displayCoverData(
		element: HTMLImageElement | HTMLDivElement,
		fullSizeImageWidth: number,
		fullSizeImageHeight: number,
		cover: Api.CoverType
	) {
		const descriptionShowElement = document.createElement('span');
		const descriptionElement = document.createElement('span');
		const descriptionShowElementSvg = BM.createSVG({
			d: 'M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z',
		});
		descriptionElement.classList.add('cover-data-bookmarklet-description');
		const idCopyElement = document.createElement('span');
		idCopyElement.setAttribute('cover-data-cover-id', cover.id);
		idCopyElement.setAttribute('title', 'Copy Cover ID');
		const idCopyElementSvg = BM.createSVG({
			d: 'M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5A3.375 3.375 0 006.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0015 2.25h-1.5a2.251 2.251 0 00-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 00-9-9z',
		});
		idCopyElementSvg.addEventListener('click', (event) => {
			const copyId = (ids: string) => {
				navigator.clipboard
					.writeText(ids)
					.then(
						() => console.debug(`Copied cover ids: ${ids}`),
						() => console.error(`Failed to copy cover ids: ${ids}`)
					)
					.catch(console.error);
			};

			event.stopPropagation();
			event.preventDefault();

			if (event.shiftKey) {
				const coverIds: Array<string> = [];
				document
					.querySelectorAll('span[cover-data-cover-id]')
					.forEach((element) => {
						const coverId = element.getAttribute('cover-data-cover-id');
						if (coverId) coverIds.push(coverId);
					});
				copyId(coverIds.join(' '));
			} else copyId(cover.id);
		});
		idCopyElement.appendChild(idCopyElementSvg);
		if (cover.attributes.description) {
			const showDescriptions = (event: MouseEvent, show = true) => {
				const showDescription = (element: HTMLSpanElement) =>
					element.style.setProperty('display', show ? 'flex' : 'none');

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
				cover.attributes.description
			);
			descriptionShowElementSvg.addEventListener('click', showDescriptions);
			descriptionShowElement.appendChild(descriptionShowElementSvg);
			const descriptionTextElement = document.createElement('span');
			descriptionTextElement.innerText = cover.attributes.description;
			descriptionTextElement.style.setProperty('max-height', '100%');
			descriptionTextElement.style.setProperty('margin', '0.2rem');
			descriptionTextElement.style.setProperty('text-align', 'center');
			descriptionElement.style.setProperty('position', 'absolute');
			descriptionElement.style.setProperty('width', '100%');
			descriptionElement.style.setProperty('height', '100%');
			descriptionElement.style.setProperty('overflow-y', 'auto');
			descriptionElement.style.setProperty('display', 'none');
			descriptionElement.style.setProperty('align-items', 'center');
			descriptionElement.style.setProperty('justify-content', 'center');
			descriptionElement.style.setProperty(
				'background-color',
				'var(--md-accent)'
			);
			descriptionElement.style.setProperty('z-index', '4');
			descriptionElement.addEventListener('click', (e) =>
				showDescriptions(e, false)
			);
			descriptionElement.appendChild(descriptionTextElement);
		}
		const sizeElement = document.createElement('span');
		const sizeElementText = document.createElement('span');
		const coverSize = `${fullSizeImageWidth}x${fullSizeImageHeight}`;
		sizeElementText.innerText = coverSize;
		sizeElementText.setAttribute('title', coverSize);
		sizeElement.style.setProperty('position', 'absolute');
		sizeElement.style.setProperty('top', '0');
		sizeElement.appendChild(sizeElementText);
		const iconsElement = document.createElement('div');
		iconsElement.style.setProperty('display', 'flex');
		iconsElement.style.setProperty('flex-wrap', 'nowrap');
		iconsElement.style.setProperty('gap', '0.2rem');
		if (element instanceof HTMLImageElement) {
			sizeElement.style.setProperty('padding', '0.5rem 0.5rem 1rem');
			sizeElement.style.setProperty('color', '#fff');
			sizeElement.style.setProperty('left', '0');
			sizeElement.style.setProperty('width', '100%');
			sizeElement.style.setProperty(
				'background',
				'linear-gradient(0deg,transparent,rgba(0,0,0,0.8))'
			);
			sizeElement.style.setProperty('border-top-right-radius', '0.25rem');
			sizeElement.style.setProperty('border-top-left-radius', '0.25rem');
			iconsElement.style.setProperty('position', 'absolute');
			iconsElement.style.setProperty('top', '0');
			iconsElement.style.setProperty('right', '0');
			iconsElement.style.setProperty('padding', '0.45rem 0.5rem');
			iconsElement.style.setProperty('color', '#fff');
			if (cover.attributes.description) {
				descriptionShowElementSvg.setAttribute('stroke-width', '1.5');
				descriptionShowElementSvg.style.setProperty('width', '1.5rem');
				descriptionShowElementSvg.style.setProperty('height', '1.5rem');
				descriptionElement.style.setProperty('border-radius', '0.25rem');
				element.parentElement?.append(descriptionElement);
				iconsElement.appendChild(descriptionShowElement);
			}
			idCopyElementSvg.setAttribute('stroke-width', '1.5');
			idCopyElementSvg.style.setProperty('width', '1.5rem');
			idCopyElementSvg.style.setProperty('height', '1.5rem');
			iconsElement.appendChild(idCopyElement);
			element.parentElement?.append(sizeElement, iconsElement);
		} else {
			sizeElement.style.setProperty('padding', '0 0.2rem');
			sizeElement.style.setProperty('background-color', 'var(--md-accent)');
			sizeElement.style.setProperty('border-bottom-left-radius', '4px');
			sizeElement.style.setProperty('border-bottom-right-radius', '4px');
			element.appendChild(sizeElement);
			iconsElement.style.setProperty('margin-left', '0.2rem');
			sizeElement.style.setProperty('display', 'flex');
			sizeElement.style.setProperty('flex-wrap', 'nowrap');
			sizeElement.style.setProperty('align-items', 'center');
			if (cover.attributes.description) {
				descriptionShowElementSvg.setAttribute('stroke-width', '2');
				descriptionShowElementSvg.style.setProperty('width', '1.3rem');
				descriptionShowElementSvg.style.setProperty('height', '1.3rem');
				element.appendChild(descriptionElement);
				iconsElement.appendChild(descriptionShowElement);
			}
			idCopyElementSvg.setAttribute('stroke-width', '2');
			idCopyElementSvg.style.setProperty('width', '1.3rem');
			idCopyElementSvg.style.setProperty('height', '1.3rem');
			iconsElement.appendChild(idCopyElement);
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
								(relationship) => relationship.type === 'cover_art'
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
		offset = 0
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
					new Error(`Offset is bigger than ${maxRequestOffset}:\n ${url}`)
				);
			fetch(url)
				.then((rsp) => resolve(rsp.json()))
				.catch(reject);
		});
	}
});
