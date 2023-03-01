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
			)
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
						fullSizeImage.src = `https://mangadex.org/covers/${coverManga.id}/${cover.attributes.fileName}`;
						fullSizeImage.onload = () => {
							const descriptionShowElement = document.createElement('span');
							const descriptionElement = document.createElement('span');
							const descriptionShowElementSvg = document.createElementNS(
								'http://www.w3.org/2000/svg',
								'svg'
							);
							if (cover.attributes.description) {
								descriptionShowElement.setAttribute(
									'title',
									cover.attributes.description
								);
								descriptionShowElementSvg.classList.add(
									'cover-data-bookmarklet-show-description'
								);
								descriptionShowElementSvg.setAttribute('fill', 'none');
								descriptionShowElementSvg.setAttribute('viewBox', '0 0 24 24');
								descriptionShowElementSvg.setAttribute(
									'stroke',
									'currentColor'
								);
								const descriptionShowElementPath = document.createElementNS(
									'http://www.w3.org/2000/svg',
									'path'
								);
								descriptionShowElementPath.setAttribute(
									'stroke-linecap',
									'round'
								);
								descriptionShowElementPath.setAttribute(
									'stroke-linejoin',
									'round'
								);
								descriptionShowElementPath.setAttribute(
									'd',
									'M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z'
								);
								descriptionShowElementSvg.appendChild(
									descriptionShowElementPath
								);
								descriptionShowElementSvg.addEventListener('click', (e) => {
									e.stopPropagation();
									e.preventDefault();
									descriptionElement.style.setProperty('display', 'flex');
								});
								descriptionShowElement.appendChild(descriptionShowElementSvg);
								const descriptionTextElement = document.createElement('span');
								descriptionTextElement.innerText = cover.attributes.description;
								descriptionTextElement.style.setProperty('max-height', '100%');
								descriptionTextElement.style.setProperty('margin', '0.2rem');
								descriptionTextElement.style.setProperty(
									'text-align',
									'center'
								);
								descriptionElement.style.setProperty('position', 'absolute');
								descriptionElement.style.setProperty('width', '100%');
								descriptionElement.style.setProperty('height', '100%');
								descriptionElement.style.setProperty('overflow-y', 'auto');
								descriptionElement.style.setProperty('display', 'none');
								descriptionElement.style.setProperty('align-items', 'center');
								descriptionElement.style.setProperty(
									'justify-content',
									'center'
								);
								descriptionElement.style.setProperty(
									'background-color',
									'var(--md-accent)'
								);
								descriptionElement.addEventListener('click', (e) => {
									e.stopPropagation();
									e.preventDefault();
									descriptionElement.style.setProperty('display', 'none');
								});
								descriptionElement.appendChild(descriptionTextElement);
							}
							const sizeElement = document.createElement('span');
							const sizeElementText = document.createElement('span');
							const coverSize = `${fullSizeImage.width}x${fullSizeImage.height}`;
							sizeElementText.innerText = coverSize;
							sizeElementText.setAttribute('title', coverSize);
							sizeElement.style.setProperty('position', 'absolute');
							sizeElement.style.setProperty('top', '0');
							sizeElement.appendChild(sizeElementText);
							if (element instanceof HTMLImageElement) {
								sizeElement.style.setProperty('padding', '0.5rem 0.5rem 1rem');
								sizeElement.style.setProperty('color', '#fff');
								sizeElement.style.setProperty('left', '0');
								sizeElement.style.setProperty('width', '100%');
								sizeElement.style.setProperty(
									'background',
									'linear-gradient(0deg,transparent,rgba(0,0,0,0.8))'
								);
								sizeElement.style.setProperty(
									'border-top-right-radius',
									'0.25rem'
								);
								sizeElement.style.setProperty(
									'border-top-left-radius',
									'0.25rem'
								);
								element.parentElement?.appendChild(sizeElement);
								if (cover.attributes.description) {
									descriptionShowElement.style.setProperty(
										'position',
										'absolute'
									);
									descriptionShowElement.style.setProperty('top', '0');
									descriptionShowElement.style.setProperty('right', '0');
									descriptionShowElement.style.setProperty(
										'padding',
										'0.45rem 0.5rem'
									);
									descriptionShowElement.style.setProperty('color', '#fff');
									descriptionShowElementSvg.setAttribute('stroke-width', '1.5');
									descriptionShowElementSvg.style.setProperty(
										'width',
										'1.5rem'
									);
									descriptionShowElementSvg.style.setProperty(
										'height',
										'1.5rem'
									);
									descriptionElement.style.setProperty(
										'border-radius',
										'0.25rem'
									);
									element.parentElement?.append(
										descriptionShowElement,
										descriptionElement
									);
								}
							} else {
								sizeElement.style.setProperty('padding', '0 0.2rem');
								sizeElement.style.setProperty(
									'background-color',
									'var(--md-accent)'
								);
								sizeElement.style.setProperty(
									'border-bottom-left-radius',
									'4px'
								);
								sizeElement.style.setProperty(
									'border-bottom-right-radius',
									'4px'
								);
								element.appendChild(sizeElement);
								if (cover.attributes.description) {
									sizeElement.style.setProperty('display', 'flex');
									sizeElement.style.setProperty('align-items', 'center');
									descriptionShowElement.style.setProperty(
										'margin-left',
										'0.2rem'
									);
									descriptionShowElementSvg.setAttribute('stroke-width', '2');
									descriptionShowElementSvg.style.setProperty(
										'width',
										'1.3rem'
									);
									descriptionShowElementSvg.style.setProperty(
										'height',
										'1.3rem'
									);
									sizeElement.appendChild(descriptionShowElement);
									element.appendChild(descriptionElement);
								}
							}
							progressBar.update(
								(++addedCoverData / coverElements.length) * 100
							);
						};
					}
				});
			});
		})
		.catch((e) => {
			console.error(e);
			alert('Failed to fetch cover data!');
		});

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
