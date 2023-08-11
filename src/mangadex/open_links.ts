import * as mangadex from './shared';
import * as Api from './types/api';

mangadex.newBookmarklet(
	() => {
		mangadex.fetchTitleInfo().then((titleInfo) => {
			const websites: Api.LocalisedStringObject = {
				al: 'https://anilist.co/manga/',
				ap: 'https://www.anime-planet.com/manga/',
				kt: 'https://kitsu.io/manga/',
				mu: /[A-Za-z]/.test(titleInfo.data.attributes.links.mu)
					? 'https://www.mangaupdates.com/series/'
					: 'https://www.mangaupdates.com/series.html?id=',
				mal: 'https://myanimelist.net/manga/',
				nu: 'https://www.novelupdates.com/series/',
				bw: 'https://bookwalker.jp/',
				amz: '',
				ebj: '',
				cdj: '',
			};

			for (const website in titleInfo.data.attributes.links) {
				const websiteUrl = websites[website] || '';
				const link = websiteUrl + titleInfo.data.attributes.links[website];
				window.open(link, '_blank', 'noopener,noreferrer');
			}
		});
	},
	{ titlePage: true },
);
