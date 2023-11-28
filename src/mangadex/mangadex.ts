import * as utils from '../utils';
import * as api from './api';
import { setComponentColors } from '../components/base_component';

const mdComponentColors = {
	color: 'rgb(var(--md-color))',
	primary: 'rgb(var(--md-primary))',
	background: 'rgb(var(--md-background))',
	accent: 'rgb(var(--md-accent))',
	accent20: 'rgb(var(--md-accent-20))',
};

const useComponents = () =>
	setComponentColors({
		text: mdComponentColors.color,
		primary: mdComponentColors.primary,
		background: mdComponentColors.background,
		accent: mdComponentColors.accent,
	});

const roleColors = {
	ROLE_BANNED: 'rgb(0, 0, 0)',
	ROLE_ADMIN: 'rgb(155, 89, 182)',
	ROLE_DEVELOPER: 'rgb(255, 110, 233)',
	ROLE_DESIGNER: 'rgb(254, 110, 171)',
	ROLE_GLOBAL_MODERATOR: 'rgb(233, 30, 99)',
	ROLE_FORUM_MODERATOR: 'rgb(233, 30, 99)',
	ROLE_PUBLIC_RELATIONS: 'rgb(230, 126, 34)',
	ROLE_STAFF: 'rgb(233, 30, 99)',
	ROLE_VIP: 'rgb(241, 196, 15)',
	ROLE_POWER_UPLOADER: 'rgb(46, 204, 113)',
	ROLE_CONTRIBUTOR: 'rgb(32, 102, 148)',
	ROLE_GROUP_LEADER: 'rgb(52, 152, 219)',
	ROLE_MD_AT_HOME: 'rgb(26, 121, 57)',
	ROLE_GROUP_MEMBER: 'rgb(250, 250, 250)',
	ROLE_MEMBER: 'rgb(250, 250, 250)',
	ROLE_USER: 'rgb(250, 250, 250)',
	ROLE_GUEST: 'rgb(250, 250, 250)',
	ROLE_UNVERIFIED: 'rgb(250, 250, 250)',
};

const getUserRoleColor = (roles: Array<string>): string => {
	for (const role in roleColors) {
		if (roles.includes(role))
			return roleColors[role as keyof typeof roleColors];
	}
	return roleColors.ROLE_USER;
};

const newBookmarklet = (
	code: VoidFunction,
	settings: {
		titlePage?: boolean;
		createPage?: boolean;
		editPage?: boolean;
	} = {},
): void => {
	utils.newBookmarklet('^mangadex.org|canary.mangadex.dev', () => {
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

export {
	newBookmarklet,
	useComponents,
	getUserRoleColor,
	api,
	mdComponentColors,
	roleColors,
};
