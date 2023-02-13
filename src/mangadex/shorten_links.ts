import * as mangadex from './shared';
import * as BM from '../shared';

bookmarklet();

function bookmarklet(): void {
	if (!mangadex.checkSite()) return;

	const inputs: Array<HTMLInputElement> = [];
	const getLinks = (divIndex: number) =>
		document
			.querySelectorAll('div.input-container')
			[divIndex].querySelectorAll('input.inline-input')
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
		const regexes: Array<RegExp | string> = [
			'(anilist.co/manga/)([0-9]+)',
			'(www.anime-planet.com/manga/)([a-z0-9-]+)',
			'(bookwalker.jp/series/)([0-9]+/list)',
			'(bookwalker.jp/series/)([0-9]+)',
			'(kitsu.io/manga/)([0-9]+)',
			'(kitsu.io/manga/)([a-z0-9-]+)',
			'(www.mangaupdates.com/series/)([a-z0-9]{7})',
			'(www.novelupdates.com/series/)([a-z0-9-]+)',
			'(www.amazon[a-z.]+/).*(dp/[A-Z0-9]{10})',
			'(www.amazon[a-z.]+/).*(gp/product/[A-Z0-9]{10})',
			'(www.amazon[a-z.]+/gp/product).*(/[A-Z0-9]{10})',
			'(www.cdjapan.co.jp/product/)(NEOBK-[0-9]+)',
			'(ebookjapan.yahoo.co.jp/books/)([0-9]+)',
			'(myanimelist.net/manga/)([0-9]+)',
		];
		for (const index in regexes) {
			const regex = regexes[index];
			const websiteUrl = BM.getMatch(link, getRegex(regex), 1);
			const id = BM.getMatch(link, getRegex(regex), 2);
			if (websiteUrl && id) {
				shortLink = 'https://' + websiteUrl + id;
				break;
			}
		}
		if (shortLink === link) return;
		element.value = shortLink;
		element.dispatchEvent(new InputEvent('input'));
		changedLinks[link] = shortLink;
	});
	if (Object.keys(changedLinks).length > 0)
		console.log('Changed links:', changedLinks);
	else alert('No links changed!');
}
