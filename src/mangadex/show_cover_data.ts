import * as mangadex from './mangadex';
import * as utils from '../utils';
import * as icons from '../components/icons';
import * as Api from './types/api';
import SimpleProgressBar from '../components/progress_bars';

mangadex.newBookmarklet(() => {
	mangadex.useComponents();

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
			element.classList.contains('banner-image') ||
			element.parentElement?.classList.contains('banner-bg')
		)
			return;
		const mangaId = utils.getMatch(imageSource, /[-0-9a-f]{20,}/);
		const coverFileName =
			utils.getMatch(
				imageSource,
				/([-0-9a-f]{20,}\.[^/.]*)\.[0-9]+\.[^/.?#]*([?#].*)?$/,
				1,
			) || utils.getMatch(imageSource, /[-0-9a-f]{20,}\.[^/.]*?$/);
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
		if (fileNames.size + skippedCoversSize > 1 || mangadex.api.pageInfo.titleId)
			mangaIdsForQuery.cover.push(mangaId);
		else mangaIdsForQuery.manga.push(mangaId);
	});

	getAllCoverData()
		.then((covers) => {
			let addedCoverData = 0;
			let failedCoverData = 0;

			const coverImagesContainer = document.createElement('div');
			utils.setStyle(coverImagesContainer, {
				width: 'fit-content',
				height: 'fit-content',
				opacity: '0',
				position: 'absolute',
				top: '-10000px',
				'z-index': '-10000',
				'pointer-events': 'none',
			});
			document.body.append(coverImagesContainer);

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
				coverImagesContainer.append(fullSizeImage);

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

		const showAllInformation = (event: MouseEvent, show = true) => {
			const showInformation = (element: HTMLSpanElement) =>
				utils.setStyle(element, { display: show ? 'flex' : 'none' });

			event.stopPropagation();
			event.preventDefault();
			if (event.shiftKey)
				document
					.querySelectorAll('.cover-data-bookmarklet-information')
					.forEach((element) => showInformation(element as HTMLSpanElement));
			else showInformation(informationElement);
		};

		const user = cover.relationships.find(
			(relationship) =>
				relationship.type === 'user' &&
				relationship.id !== 'f8cc4f8a-e596-4618-ab05-ef6572980bbf',
		) as Api.UserType | undefined;

		const information = {
			size: `${fullSizeImageWidth}x${fullSizeImageHeight}`,
			version: `Version ${cover.attributes.version}`,
			description: cover.attributes.description || undefined,
			createdAt: `Created at ${new Date(
				cover.attributes.createdAt,
			).toLocaleString('en-US', { hour12: false })}`,
			updatedAt: `Updated at ${new Date(
				cover.attributes.updatedAt,
			).toLocaleString('en-US', { hour12: false })}`,
			user: user?.attributes?.username,
			id: `Cover ID ${cover.id}`,
		};

		const informationShowElement = document.createElement('span');
		utils.setStyle(informationShowElement, {
			position: 'absolute',
			top: '0',
			'z-index': '1',
		});

		const informationShowElementContent = document.createElement('span');
		utils.setStyle(informationShowElementContent, {
			width: 'fit-content',
			display: 'flex',
			gap: '0.1rem',
			'align-items': 'center',
		});
		informationShowElementContent.addEventListener('click', showAllInformation);
		informationShowElement.append(informationShowElementContent);

		const informationShowElementText = document.createElement('span');
		informationShowElementText.innerText = information.size;
		utils.setStyle(informationShowElementText, { 'padding-top': '1px' });
		informationShowElementContent.append(informationShowElementText);

		const informationElement = document.createElement('span');
		informationElement.classList.add('cover-data-bookmarklet-information');
		utils.setStyle(informationElement, {
			display: 'none',
			position: 'absolute',
			width: '100%',
			height: '100%',
			padding: '0.4rem',
			gap: '0.2rem',
			overflow: 'auto',
			'flex-wrap': 'wrap',
			'align-content': 'baseline',
			'background-color': mangadex.mdComponentColors.accent,
			'z-index': '2',
		});
		informationElement.addEventListener('click', (e) =>
			showAllInformation(e, false),
		);

		const informationItemElements: Record<string, HTMLSpanElement> = {};

		for (const info in information) {
			const value = information[info as keyof typeof information] as string;
			if (!value) {
				delete information[info as keyof typeof information];
				continue;
			}
			informationItemElements[info] = document.createElement('small');
			informationItemElements[info].innerText = value;
			informationItemElements[info].setAttribute('title', value);
			utils.setStyle(informationItemElements[info], {
				height: 'fit-content',
				'max-width': '100%',
				'flex-grow': '1',
				'text-align': 'center',
				'background-color': mangadex.mdComponentColors.accent20,
				padding: '0.2rem 0.4rem',
				'border-radius': '0.25rem',
			});
			informationElement.append(informationItemElements[info]);
		}

		informationShowElementContent.setAttribute(
			'title',
			Object.values(information).join('\n'),
		);

		if (informationItemElements.description) {
			utils.setStyle(informationItemElements.description, {
				width: '100%',
				border: `1px solid ${mangadex.mdComponentColors.primary}`,
			});
		}

		if (informationItemElements.user) {
			const roleColor = mangadex.getUserRoleColor(user!.attributes!.roles);
			utils.setStyle(informationItemElements.user, {
				width: '100%',
				color: roleColor,
				border: `1px solid ${roleColor}`,
				'background-color': roleColor.replace(')', ',0.1)'),
			});
			informationItemElements.user.addEventListener('click', (event) => {
				event.stopPropagation();
				event.preventDefault();

				window.open(`/user/${user!.id}`, '_blank');
			});
		}

		informationItemElements.id.innerText = 'Copy Cover ID';
		informationItemElements.id.addEventListener('click', (event) => {
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

		if (element instanceof HTMLImageElement) {
			utils.setStyle(informationShowElement, {
				padding: '0.2rem 0.4rem 0.5rem',
				color: '#fff',
				left: '0',
				width: '100%',
				background: 'linear-gradient(0deg,transparent,rgba(0,0,0,0.8))',
				'border-top-right-radius': '0.25rem',
				'border-top-left-radius': '0.25rem',
			});

			if (information.description)
				informationShowElementContent.append(icons.informationCircleOutline());

			utils.setStyle(informationElement, { 'border-radius': '0.25rem' });

			element.parentElement?.append(informationShowElement, informationElement);
		} else {
			utils.setStyle(informationShowElement, {
				padding: '0 0.2rem',
				'background-color': mangadex.mdComponentColors.accent,
				'border-bottom-left-radius': '4px',
				'border-bottom-right-radius': '4px',
			});

			utils.setStyle(informationShowElementText, { 'max-height': '1.5rem' });

			if (information.description)
				informationShowElementContent.append(icons.informationCircleMini());

			element.append(informationShowElement, informationElement);
		}
	}

	function getAllCoverData(): Promise<Api.CoverListResponse['data']> {
		const covers: Array<Api.CoverType> = [];
		async function awaitAllCoverData() {
			for (const endpoint in mangaIdsForQuery) {
				const isCoverEndpoint = endpoint === 'cover';
				const mangaIdsForQuerySplit = utils.splitArray(
					mangaIdsForQuery[endpoint],
				);
				for (const ids of mangaIdsForQuerySplit) {
					const rsp = await getCoverData(ids as Array<string>, isCoverEndpoint);

					if (isCoverEndpoint) {
						covers.push(...(rsp.data as Api.CoverListResponse['data']));
						for (let i = rsp.limit; i < rsp.total; i += rsp.limit) {
							const rsp = await getCoverData(
								ids as Array<string>,
								isCoverEndpoint,
								i,
							);
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

		return new Promise((resolve, reject) =>
			awaitAllCoverData().then(resolve).catch(reject),
		);
	}

	function getCoverData(
		ids: Array<string>,
		isCoverEndpoint: boolean,
		offset = 0,
	): Promise<Api.MangaListResponse | Api.CoverListResponse> {
		return new Promise((resolve, reject) => {
			if (offset > maxRequestOffset)
				return reject(new Error(`Offset is bigger than ${maxRequestOffset}!`));

			if (isCoverEndpoint)
				mangadex.api
					.getCoverList({
						mangaIds: ids,
						order: {
							volume: 'asc',
						},
						includes: ['user'],
						offset: offset,
						limit: requestLimit,
					})
					.then(resolve)
					.catch(reject);
			else
				mangadex.api
					.getMangaList({
						ids: ids,
						includes: ['cover_art'],
						contentRating: ['safe', 'suggestive', 'erotica', 'pornographic'],
						offset: offset,
						limit: requestLimit,
					})
					.then(resolve)
					.catch(reject);
		});
	}
});
