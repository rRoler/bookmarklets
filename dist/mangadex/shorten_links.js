/*!
 * Licensed under MIT: https://raw.githubusercontent.com/rRoler/bookmarklets/main/LICENSE
 * Third party licenses: https://raw.githubusercontent.com/rRoler/bookmarklets/main/dist/mangadex/shorten_links.dependencies.txt
 */

void function(){const checkSite = () => /mangadex\..*/.test(window.location.hostname);

/* Replaced with file-saver
function saveAs(file: string | Blob, filename: string): void {
	const isBlob = file instanceof Blob;
	const url = isBlob ? URL.createObjectURL(file) : file;
	const link = document.createElement('a');
	link.href = url;
	link.download = filename;
	link.target = '_blank';
	link.rel = 'noopener noreferrer';
	link.dispatchEvent(new MouseEvent('click'));
	if (isBlob) URL.revokeObjectURL(url);
}*/

function getMatch(string, regex, index = 0) {
  const regexMatches = string.match(regex);
  if (regexMatches && regexMatches[index]) return regexMatches[index];
}

bookmarklet();
function bookmarklet() {
  if (!checkSite()) return;
  const inputs = [];
  const getLinks = divIndex => document.querySelectorAll('div.input-container')[divIndex].querySelectorAll('input.inline-input').forEach(input => {
    inputs.push(input);
  });
  getLinks(3);
  getLinks(5);
  const changedLinks = {};
  inputs.forEach(element => {
    const link = element.value;
    let shortLink = link;
    const getRegex = regex => new RegExp(`https?://${regex}`);
    const regexes = ['(anilist.co/manga/)([0-9]+)', '(www.anime-planet.com/manga/)([a-z0-9-]+)', '(bookwalker.jp/series/)([0-9]+/list)', '(bookwalker.jp/series/)([0-9]+)', '(kitsu.io/manga/)([0-9]+)', '(kitsu.io/manga/)([a-z0-9-]+)', '(www.mangaupdates.com/series/)([a-z0-9]{7})', '(www.novelupdates.com/series/)([a-z0-9-]+)', '(www.amazon[a-z.]+/).*(dp/[A-Z0-9]{10})', '(www.amazon[a-z.]+/).*(gp/product/[A-Z0-9]{10})', '(www.amazon[a-z.]+/gp/product).*(/[A-Z0-9]{10})', '(www.cdjapan.co.jp/product/)(NEOBK-[0-9]+)', '(ebookjapan.yahoo.co.jp/books/)([0-9]+)', '(myanimelist.net/manga/)([0-9]+)'];
    for (const index in regexes) {
      const regex = regexes[index];
      const websiteUrl = getMatch(link, getRegex(regex), 1);
      const id = getMatch(link, getRegex(regex), 2);
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
  if (Object.keys(changedLinks).length > 0) console.log('Changed links:', changedLinks);else alert('No links changed!');
}}();
