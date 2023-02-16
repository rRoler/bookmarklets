/*!
 * Licensed under MIT: https://raw.githubusercontent.com/rRoler/bookmarklets/main/LICENSE
 * Third party licenses: https://raw.githubusercontent.com/rRoler/bookmarklets/main/dist/mangadex/shorten_links.dependencies.txt
 */

void function(){const checkSite = () => /mangadex\..*/.test(window.location.hostname);

function getMatch(string, regex, index = 0) {
  const regexMatches = string.match(regex);
  if (regexMatches && regexMatches[index]) return regexMatches[index];
}

bookmarklet();
function bookmarklet() {
  if (!checkSite()) return;
  const inputs = [];
  const getLinks = divIndex => {
    var _document$querySelect;
    return (_document$querySelect = document.querySelectorAll('div.input-container')[divIndex]) === null || _document$querySelect === void 0 ? void 0 : _document$querySelect.querySelectorAll('input.inline-input').forEach(input => {
      inputs.push(input);
    });
  };
  getLinks(3);
  getLinks(5);
  const changedLinks = {};
  inputs.forEach(element => {
    const link = element.value;
    let shortLink = link;
    const getRegex = regex => new RegExp(`https?://${regex}`);
    const numIdRegex = '[0-9]+';
    const numAndLetterIdRegex = '[A-Za-z0-9-]+';
    const asinRegex = '[A-Z0-9]{10}';
    const regexes = [`(anilist.co/manga/)(${numIdRegex})`, `(www.anime-planet.com/manga/)(${numAndLetterIdRegex})`, `(kitsu.io/manga/)(${numIdRegex})`, `(kitsu.io/manga/)(${numAndLetterIdRegex})`, `(www.mangaupdates.com/series/)(${numAndLetterIdRegex})`, `(myanimelist.net/manga/)(${numIdRegex})`, `(www.novelupdates.com/series/)(${numAndLetterIdRegex})`, `(bookwalker.jp/series/)(${numIdRegex}/list)`, `(bookwalker.jp/series/)(${numIdRegex})`, `(www.amazon[a-z.]+/).*(dp/${asinRegex})`, `(www.amazon[a-z.]+/).*(gp/product/${asinRegex})`, `(www.amazon[a-z.]+/gp/product).*(/${asinRegex})`, `(ebookjapan.yahoo.co.jp/books/)(${numIdRegex})`, `(www.cdjapan.co.jp/product/)(NEOBK-${numIdRegex})`];
    for (const index in regexes) {
      const regex = regexes[index];
      const websiteUrl = getMatch(link, getRegex(regex), 1);
      const id = getMatch(link, getRegex(regex), 2);
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
  if (Object.keys(changedLinks).length <= 0) return alert('No links changed!');
  console.log('Changed links:', changedLinks);
}}();
