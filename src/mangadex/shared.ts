import * as BM from '../shared';
import * as Api from './types/api';

const titleId =
	BM.getMatch(window.location.pathname, /\/title\/+([-0-9a-f]{20,})/, 1) ||
	BM.getMatch(window.location.pathname, /\/title\/edit\/+([-0-9a-f]{20,})/, 1);
const isDraft = /draft=true/.test(window.location.search);

const newBookmarklet = (
	code: VoidFunction,
	settings: {
		titlePage?: boolean;
		createPage?: boolean;
		editPage?: boolean;
	} = {}
): void => {
	BM.newBookmarklet('^mangadex.org|canary.mangadex.dev', () => {
		const isCreatePage =
			settings.createPage && /\/create\//.test(window.location.pathname);

		if (settings.titlePage && !titleId && !isCreatePage)
			return alert('This is not a title page!');
		if (
			settings.editPage &&
			!/\/edit\//.test(window.location.pathname) &&
			!isCreatePage
		)
			return alert('This is not an edit page!');
		code();
	});
};

const getAuthToken = () =>
	BM.parseStorage(
		'oidc.user:https://auth.mangadex.org/realms/mangadex:mangadex-frontend-stable'
	) ||
	BM.parseStorage(
		'oidc.user:https://auth.mangadex.org/realms/mangadex:mangadex-frontend-canary'
	);

function fetchTitleInfo(): Promise<Api.MangaResponse> {
	const authToken = getAuthToken();
	return new Promise((resolve, reject) =>
		fetch(
			`https://api.mangadex.org/manga${isDraft ? '/draft/' : '/'}${titleId}`,
			{
				headers: {
					Authorization: isDraft
						? `${authToken.token_type} ${authToken.access_token}`
						: '',
				},
			}
		)
			.then((rsp) => resolve(rsp.json()))
			.catch((e) => {
				alert('Failed to fetch title info!');
				reject(e);
			})
	);
}

export { newBookmarklet, fetchTitleInfo };
