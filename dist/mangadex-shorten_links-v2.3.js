/*!
 * Licensed under MIT: https://github.com/rRoler/bookmarklets/raw/main/LICENSE
 * Third party licenses: https://github.com/rRoler/bookmarklets/raw/main/dist/mangadex-shorten_links-v2.3.dependencies.txt
 */

(() => {function newBookmarklet$1(websiteRegex, code) {
  if (!new RegExp(websiteRegex).test(window.location.hostname)) return alert('Bookmarklet executed on the wrong website!');
  code();
}
function getMatch(string, regex) {
  let index = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  const regexMatches = string.match(regex);
  if (regexMatches && regexMatches[index]) return regexMatches[index];
}

const pageInfo = {
  titleId: getMatch(window.location.pathname, /\/title\/(?:edit\/)?([-0-9a-f]{20,})/, 1),
  isDraft: /draft=true/.test(window.location.search)
};

const newBookmarklet = function (code) {
  let settings = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  newBookmarklet$1('^mangadex.org|canary.mangadex.dev', () => {
    const isCreatePage = settings.createPage && /\/create\//.test(window.location.pathname);
    const noticePart = 'You can execute this bookmarklet only on ';
    if (settings.titlePage && !pageInfo.titleId && !isCreatePage) return alert(noticePart + 'a title page!');
    if (settings.editPage && !/\/edit\//.test(window.location.pathname) && !isCreatePage) return alert(noticePart + 'an edit page!');
    code();
  });
};

newBookmarklet(() => {
  const inputs = [];
  const getLinks = divIndex => document.querySelectorAll('div.input-container')[divIndex]?.querySelectorAll('input.inline-input').forEach(input => {
    inputs.push(input);
  });
  getLinks(3);
  getLinks(4);
  getLinks(5);
  const changedLinks = {};
  inputs.forEach(element => {
    const link = element.value;
    let shortLink = link;
    const numIdRegex = '[0-9]+';
    const numAndLetterIdRegex = '[A-Za-z0-9-%]+';
    const asinRegex = '[A-Z0-9]{10}';
    const regexes = [`(anilist.co/manga/)(${numIdRegex})`, `(www.anime-planet.com/manga/)(${numAndLetterIdRegex})`, `(kitsu.io/manga/)(${numAndLetterIdRegex})`, `(www.mangaupdates.com/series/)(${numAndLetterIdRegex})`, `(myanimelist.net/manga/)(${numIdRegex})`, `(bookwalker.jp/series/)(${numIdRegex}(?:/list)?)`, `(bookwalker.jp/)(${numAndLetterIdRegex})`, `(www.amazon[a-z.]+/).*((?:dp/|gp/product/|kindle-dbs/product/)${asinRegex})`, `(www.amazon[a-z.]+/gp/product).*(/${asinRegex})`, `(ebookjapan.yahoo.co.jp/books/)(${numIdRegex})`, `(www.cdjapan.co.jp/product/)(NEOBK-${numIdRegex})`, '(.*/)(.*)/$'];
    for (const regexPattern of regexes) {
      const regex = new RegExp(`(?:https?://${regexPattern}.*)$`);
      const websiteUrl = getMatch(link, regex, 1);
      const id = getMatch(link, regex, 2);
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
}, {
  titlePage: true,
  editPage: true,
  createPage: true
});})();
