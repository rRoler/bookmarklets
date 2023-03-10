import * as mangadex from './shared';
import * as BM from '../shared';

mangadex.newBookmarklet(
	() => {
		const inputs: Array<HTMLInputElement> = [];
		const getLinks = (divIndex: number) =>
			document
				.querySelectorAll('div.input-container')
				[divIndex]?.querySelectorAll('input.inline-input')
				.forEach((input) => {
					inputs.push(input as HTMLInputElement);
				});
		getLinks(3);
		getLinks(5);

		const changedLinks: Record<string, string> = {};
		inputs.forEach((element) => {
			const link = element.value;
			let shortLink = link;
			const getRegex = (regex: RegExp | string) =>
				new RegExp(`https?://${regex}`);
			const numIdRegex = '[0-9]+';
			const numAndLetterIdRegex = '[A-Za-z0-9-]+';
			const asinRegex = '[A-Z0-9]{10}';
			const regexes: Array<RegExp | string> = [
				`(anilist.co/manga/)(${numIdRegex})`,
				`(www.anime-planet.com/manga/)(${numAndLetterIdRegex})`,
				`(kitsu.io/manga/)(${numIdRegex})`,
				`(kitsu.io/manga/)(${numAndLetterIdRegex})`,
				`(www.mangaupdates.com/series/)(${numAndLetterIdRegex})`,
				`(myanimelist.net/manga/)(${numIdRegex})`,
				`(www.novelupdates.com/series/)(${numAndLetterIdRegex})`,
				`(bookwalker.jp/series/)(${numIdRegex}/list)`,
				`(bookwalker.jp/series/)(${numIdRegex})`,
				`(www.amazon[a-z.]+/).*(dp/${asinRegex})`,
				`(www.amazon[a-z.]+/).*(gp/product/${asinRegex})`,
				`(www.amazon[a-z.]+/gp/product).*(/${asinRegex})`,
				`(ebookjapan.yahoo.co.jp/books/)(${numIdRegex})`,
				`(www.cdjapan.co.jp/product/)(NEOBK-${numIdRegex})`,
			];
			for (const regexPattern of regexes) {
				const regex = getRegex(regexPattern);
				const websiteUrl = BM.getMatch(link, regex, 1);
				const id = BM.getMatch(link, regex, 2);
				if (websiteUrl && id) {
					shortLink = `https://${websiteUrl}${id}`;
					break;
				}
			}
			if (shortLink === link) return;
			element.value = shortLink;
			element.dispatchEvent(new InputEvent('input'));
			changedLinks[link] = shortLink;
		});
		if (Object.keys(changedLinks).length <= 0)
			return alert('No links changed!');
		console.log('Changed links:', changedLinks);
	},
	{ titlePage: true, editPage: true }
);
