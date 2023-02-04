import * as mangadex from './shared';
import * as BM from '../shared';
import * as Api from './types/api';

bookmarklet();

function bookmarklet(): void {
	if (!mangadex.checkSite()) return;

	const websites: Api.LocalisedStringObject = {
		al: 'https://anilist.co/search/manga?search=',
		ap: 'https://www.anime-planet.com/manga/all?name=',
		bw: 'https://bookwalker.jp/search/?qcat=2&word=',
		kt: 'https://kitsu.io/manga?subtype=manga&text=',
		mu: 'https://www.mangaupdates.com/search.html?search=',
		nu: 'https://www.novelupdates.com/?s=',
		amz: 'https://www.amazon.co.jp/s?rh=n:466280&k=',
		cdj: 'https://www.cdjapan.co.jp/searchuni?term.media_format=BOOK&q=',
		ebj: 'https://ebookjapan.yahoo.co.jp/search/?keyword=',
		mal: 'https://myanimelist.net/manga.php?q=',
	};

	if (/\/create\/title/.test(window.location.pathname)) {
		const title = prompt('Enter a title to search for');
		if (!title) return;

		for (const website in websites) {
			window.open(websites[website] + title, '_blank', 'noopener,noreferrer');
		}
		return;
	}

	const mangaId =
		BM.getMatch(window.location.pathname, /\/title\/+([-0-9a-f]{20,})/, 1) ||
		BM.getMatch(
			window.location.pathname,
			/\/title\/edit\/+([-0-9a-f]{20,})/,
			1
		);
	const draftId =
		BM.getMatch(window.location.href, /\/draft\/+([-0-9a-f]{20,})/, 1) ||
		BM.getMatch(window.location.href, /\/draft\/+([-0-9a-f]{20,})\/edit/, 1) ||
		BM.getMatch(
			window.location.href,
			/\/title\/+([-0-9a-f]{20,})\?draft=true/,
			1
		) ||
		BM.getMatch(
			window.location.href,
			/\/title\/edit\/+([-0-9a-f]{20,})\?draft=true/,
			1
		);
	const titleId = draftId || mangaId;

	if (!titleId) return alert('This is not a title page!');

	const getToken = (key: string) => {
		const token = localStorage.getItem(key);
		if (token) return JSON.parse(token);
	};
	const authTokens =
		getToken(
			'oidc.user:https://auth.mangadex.org/realms/mangadex:mangadex-frontend-stable'
		) ||
		getToken(
			'oidc.user:https://auth.mangadex.org/realms/mangadex:mangadex-frontend-canary'
		);
	fetch(
		`https://api.mangadex.org/manga${draftId ? '/draft/' : '/'}${titleId}`,
		{
			headers: {
				Authorization: draftId
					? `${authTokens.token_type} ${authTokens.access_token}`
					: '',
			},
		}
	)
		.then((rsp) => rsp.json())
		.then((rsp: Api.MangaResponse) => {
			if (
				JSON.stringify(Object.keys(websites)) ===
				JSON.stringify(Object.keys(rsp.data.attributes.links))
			)
				return alert('All links are already added!');

			const originalLang = rsp.data.attributes.originalLanguage;
			let originalTitle = undefined;
			try {
				originalTitle = rsp.data.attributes.altTitles.find(
					(title) => title[originalLang]
				);
			} catch (e) {
				console.debug('No alt titles found');
			}
			let title: string | null = originalTitle
				? originalTitle[originalLang]
				: rsp.data.attributes.title.en || '';
			title = prompt('Enter a title to search for', title);
			if (!title) return;

			for (const website in websites) {
				if (!rsp.data.attributes.links[website])
					window.open(
						websites[website] + title,
						'_blank',
						'noopener,noreferrer'
					);
			}
		})
		.catch((e) => {
			console.error(e);
			alert('Failed to fetch title info!');
		});
}