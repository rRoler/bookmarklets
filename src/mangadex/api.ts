import * as utils from '../utils';
import * as Api from './types/api';

const baseUrl = 'https://api.mangadex.org';
const pageInfo = {
	titleId: utils.getMatch(
		window.location.pathname,
		/\/title\/(?:edit\/)?([-0-9a-f]{20,})/,
		1,
	),
	isDraft: /draft=true/.test(window.location.search),
};

const getAuthToken: () => Api.AuthToken = () =>
	utils.parseStorage(
		'oidc.user:https://auth.mangadex.org/realms/mangadex:mangadex-frontend-stable',
	) ||
	utils.parseStorage(
		'oidc.user:https://auth.mangadex.org/realms/mangadex:mangadex-frontend-canary',
	);

const createUrl = (
	path: string,
	query?: Record<string, string | number | Array<string>>,
) => utils.createUrl(baseUrl, path, query);

function getManga(
	id = pageInfo.titleId,
	isDraft = pageInfo.isDraft,
): Promise<Api.MangaResponse> {
	const authToken = getAuthToken();

	return new Promise((resolve, reject) =>
		fetch(createUrl(`/manga${isDraft ? '/draft/' : '/'}${id}`), {
			headers: {
				Authorization: isDraft
					? `${authToken.token_type} ${authToken.access_token}`
					: '',
			},
		})
			.then((rsp) => resolve(rsp.json()))
			.catch(reject),
	);
}

function getMangaList({
	ids,
	includes = [],
	contentRating = [],
	offset = 0,
	limit = 100,
}: Api.GetMangaList): Promise<Api.MangaListResponse> {
	return new Promise((resolve, reject) => {
		fetch(
			createUrl('/manga', {
				offset: offset,
				limit: limit,
				'includes[]': includes,
				'contentRating[]': contentRating,
				'ids[]': ids,
			}),
		)
			.then((rsp) => resolve(rsp.json()))
			.catch(reject);
	});
}

function getCoverList({
	mangaIds,
	order = {},
	includes = [],
	offset = 0,
	limit = 100,
}: Api.GetCoverList): Promise<Api.CoverListResponse> {
	return new Promise((resolve, reject) => {
		const query: Record<string, string | number | Array<string>> = {
			offset: offset,
			limit: limit,
			'manga[]': mangaIds,
			'includes[]': includes,
		};
		if (order?.volume) query['order[volume]'] = order.volume;

		fetch(createUrl('/cover', query))
			.then((rsp) => resolve(rsp.json()))
			.catch(reject);
	});
}

export { pageInfo, getManga, getMangaList, getCoverList };
