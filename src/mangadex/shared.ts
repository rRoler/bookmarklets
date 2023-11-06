import * as BM from '../shared';
import * as api from './api';

const newBookmarklet = (
	code: VoidFunction,
	settings: {
		titlePage?: boolean;
		createPage?: boolean;
		editPage?: boolean;
	} = {},
): void => {
	BM.newBookmarklet('^mangadex.org|canary.mangadex.dev', () => {
		const isCreatePage =
			settings.createPage && /\/create\//.test(window.location.pathname);

		const noticePart = 'You can execute this bookmarklet only on ';
		if (settings.titlePage && !api.pageInfo.titleId && !isCreatePage)
			return alert(noticePart + 'a title page!');
		if (
			settings.editPage &&
			!/\/edit\//.test(window.location.pathname) &&
			!isCreatePage
		)
			return alert(noticePart + 'an edit page!');
		code();
	});
};

export { newBookmarklet, api };
