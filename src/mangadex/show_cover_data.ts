import * as mangadex from './shared';
import * as BM from '../shared';

bookmarklet();

function bookmarklet(): void {
	if (!mangadex.checkSite()) return;

	const isTitlePage =
		/\/title\/+[-0-9a-f]{20,}/.test(window.location.pathname) ||
		/\/title\/edit\/+[-0-9a-f]{20,}/.test(window.location.pathname) ||
		/\/draft\/+[-0-9a-f]{20,}/.test(window.location.pathname);
	const requestLimit = 100;
	const coverElements: Array<HTMLImageElement | HTMLDivElement> = [];
	const mangaIds: string[] = [];

	document.querySelectorAll('img, div').forEach((element) => {
		const imageSource =
			(element as HTMLImageElement).src ||
			(element as HTMLDivElement).style.getPropertyValue('background-image');
		if (
			/\/covers\/+[-0-9a-f]{20,}\/+[-0-9a-f]{20,}[^/]+(?:[?#].*)?$/.test(
				imageSource
			)
		) {
			coverElements.push(element as HTMLImageElement | HTMLDivElement);
			const mangaId = BM.getMatch(imageSource, /[-0-9a-f]{20,}/, 0);
			if (mangaId && !mangaIds.includes(mangaId)) mangaIds.push(mangaId);
		}
	});
	if (!mangaIds || mangaIds.length <= 0)
		return alert('No covers found on this page!');
	const mangaIdsQuery = mangaIds
		.map((id) => (isTitlePage ? `manga[]=${id}` : `ids[]=${id}`))
		.join('&');

	getAllCoverData().then((covers) => {
		coverElements.forEach((element) => {
			const imageSource =
				(element as HTMLImageElement).src ||
				(element as HTMLDivElement).style.getPropertyValue('background-image');
			(covers as Array<Record<string, unknown>>).forEach((cover) => {
				const coverManga = (
					cover.relationships as Array<Record<string, unknown>>
				).find((relationship) => relationship.type === 'manga');
				if (!coverManga) return;
				if (
					new RegExp(
						`${coverManga.id}/${
							(cover.attributes as Record<string, unknown>).fileName
						}`
					).test(imageSource)
				) {
					const fullSizeImage = new Image();
					fullSizeImage.src = `https://mangadex.org/covers/${coverManga.id}/${
						(cover.attributes as Record<string, unknown>).fileName
					}`;
					fullSizeImage.onload = () => {
						if ((cover.attributes as Record<string, unknown>).description)
							element.setAttribute(
								'title',
								(cover.attributes as Record<string, unknown>)
									.description as string
							);
						const sizeElement = document.createElement('span');
						const coverSize = `${fullSizeImage.width}x${fullSizeImage.height}`;
						sizeElement.innerText = coverSize;
						sizeElement.setAttribute('title', coverSize);
						sizeElement.style.setProperty('position', 'absolute');
						sizeElement.style.setProperty('top', '0');
						if (element.tagName.toLowerCase() === 'img') {
							sizeElement.style.setProperty('padding', '0.5rem 0.5rem 1rem');
							sizeElement.style.setProperty('color', '#fff');
							sizeElement.style.setProperty('left', '0');
							sizeElement.style.setProperty('width', '100%');
							sizeElement.style.setProperty(
								'background',
								'linear-gradient(0deg,transparent,rgba(0,0,0,0.8))'
							);
							if (element.parentElement)
								element.parentElement.append(sizeElement);
						} else {
							sizeElement.style.setProperty('padding', '0 0.4rem 0.1rem');
							sizeElement.style.setProperty(
								'background-color',
								'var(--md-accent)'
							);
							sizeElement.style.setProperty('border-bottom-left-radius', '4px');
							sizeElement.style.setProperty(
								'border-bottom-right-radius',
								'4px'
							);
							element.append(sizeElement);
						}
					};
				}
			});
		});
	});

	function getAllCoverData() {
		return new Promise((resolve) => {
			const covers: Record<string, unknown>[] = [];
			getCoverData().then((rsp) => {
				if (!isTitlePage) {
					(rsp.data as Array<Record<string, unknown>>).forEach((manga) => {
						const cover = (
							manga.relationships as Array<Record<string, unknown>>
						).find((relationship) => relationship.type === 'cover_art');
						if (!cover) return;
						cover.relationships = [{ type: manga.type, id: manga.id }];
						covers.push(cover);
					});
					return resolve(covers);
				}
				covers.push(...(rsp.data as Array<Record<string, unknown>>));
				if (covers.length >= (rsp.total as number)) return resolve(covers);
				for (
					let i = requestLimit;
					i < (rsp.total as number);
					i += requestLimit
				) {
					getCoverData(i).then((rsp) => {
						covers.push(...(rsp.data as Array<Record<string, unknown>>));
						if (covers.length >= (rsp.total as number)) return resolve(covers);
					});
				}
			});
		});
	}

	function getCoverData(offset = 0): Promise<Record<string, unknown>> {
		return new Promise((resolve) => {
			let url = `https://api.mangadex.org/manga?${mangaIdsQuery}&includes[]=cover_art&limit=${requestLimit}&offset=${offset}`;
			if (isTitlePage)
				url = `https://api.mangadex.org/cover?order[volume]=asc&${mangaIdsQuery}&limit=${requestLimit}&offset=${offset}`;
			fetch(url)
				.then((rsp) => resolve(rsp.json()))
				.catch((e) => {
					console.error(e);
					alert('Failed to fetch cover data!');
				});
		});
	}
}
