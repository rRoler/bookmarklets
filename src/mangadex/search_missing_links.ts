import * as mangadex from './shared';
import * as Api from './types/api';

mangadex.newBookmarklet(
	() => {
		const websites: Api.LocalisedStringObject = {
			al: 'https://anilist.co/search/manga?search=',
			ap: 'https://www.anime-planet.com/manga/all?name=',
			kt: 'https://kitsu.io/manga?subtype=manga&text=',
			mu: 'https://www.mangaupdates.com/search.html?search=',
			mal: 'https://myanimelist.net/manga.php?q=',
			nu: 'https://www.novelupdates.com/?s=',
			bw: 'https://bookwalker.jp/search/?qcat=2&word=',
			amz: 'https://www.amazon.co.jp/s?rh=n:466280&k=',
			ebj: 'https://ebookjapan.yahoo.co.jp/search/?keyword=',
			cdj: 'https://www.cdjapan.co.jp/searchuni?term.media_format=BOOK&q=',
		};

		if (/\/create\/title/.test(window.location.pathname)) {
			const title = prompt('Enter a title to search for');
			if (!title) return;

			for (const website in websites)
				window.open(websites[website] + title, '_blank', 'noopener,noreferrer');
			return;
		}

		mangadex.fetchTitleInfo().then((titleInfo: Api.MangaResponse) => {
			const missingWebsites = Object.keys(websites).filter(
				(website) => !titleInfo.data.attributes.links[website]
			);
			if (missingWebsites.length <= 0)
				return alert('All links are already added!');

			const originalLang = titleInfo.data.attributes.originalLanguage;
			let originalTitle = undefined;
			try {
				originalTitle = titleInfo.data.attributes.altTitles.find(
					(title) => title[originalLang]
				);
			} catch (e) {
				console.debug('No alt titles found');
			}
			let title: string | null = originalTitle
				? originalTitle[originalLang]
				: titleInfo.data.attributes.title.en || '';
			title = prompt('Enter a title to search for', title);
			if (!title) return;

			missingWebsites.forEach((website) =>
				window.open(websites[website] + title, '_blank', 'noopener,noreferrer')
			);
		});
	},
	{ titlePage: true }
);
