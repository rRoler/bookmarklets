import * as BM from '../shared';
import * as Api from './types/api';

const titleId =
	BM.getMatch(window.location.pathname, /\/title\/+([-0-9a-f]{20,})/, 1) ||
	BM.getMatch(window.location.pathname, /\/title\/edit\/+([-0-9a-f]{20,})/, 1);
const isDraft = /\?draft=true/.test(window.location.search);

const newBookmarklet = (
	code: VoidFunction,
	settings: { titlePage?: boolean; editPage?: boolean } = {}
): void => {
	BM.newBookmarklet('mangadex.org|canary.mangadex.dev', () => {
		if (settings.titlePage && !titleId)
			return alert('This is not a title page!');
		if (settings.editPage && !/\/edit\//.test(window.location.pathname))
			return alert('This is not an edit page!');
		code();
	});
};

const authTokens =
	BM.parseStorage(
		'oidc.user:https://auth.mangadex.org/realms/mangadex:mangadex-frontend-stable'
	) ||
	BM.parseStorage(
		'oidc.user:https://auth.mangadex.org/realms/mangadex:mangadex-frontend-canary'
	);

function fetchTitleInfo(): Promise<Api.MangaResponse> {
	return new Promise((resolve, reject) =>
		fetch(
			`https://api.mangadex.org/manga${isDraft ? '/draft/' : '/'}${titleId}`,
			{
				headers: {
					Authorization: isDraft
						? `${authTokens.token_type} ${authTokens.access_token}`
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
