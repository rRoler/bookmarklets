/*!
 * Licensed under MIT: https://raw.githubusercontent.com/rRoler/bookmarklets/main/LICENSE
 * Third party licenses: https://raw.githubusercontent.com/rRoler/bookmarklets/main/dist/mangadex/shorten_links.dependencies.txt
 */

(function(){function newBookmarklet$1(websiteRegex, code) {
  if (!new RegExp(websiteRegex).test(window.location.hostname)) return alert('Bookmarklet executed on a wrong website!');
  code();
}
function getMatch(string, regex, index = 0) {
  const regexMatches = string.match(regex);
  if (regexMatches && regexMatches[index]) return regexMatches[index];
}
function parseStorage(key) {
  const value = localStorage.getItem(key);
  if (value) return JSON.parse(value);
}

const titleId = getMatch(window.location.pathname, /\/title\/+([-0-9a-f]{20,})/, 1) || getMatch(window.location.pathname, /\/title\/edit\/+([-0-9a-f]{20,})/, 1);
const newBookmarklet = (code, settings = {}) => {
  newBookmarklet$1('^mangadex.org|canary.mangadex.dev', () => {
    const isCreatePage = settings.createPage && /\/create\//.test(window.location.pathname);
    if (settings.titlePage && !titleId && !isCreatePage) return alert('This is not a title page!');
    if (settings.editPage && !/\/edit\//.test(window.location.pathname) && !isCreatePage) return alert('This is not an edit page!');
    code();
  });
};
parseStorage('oidc.user:https://auth.mangadex.org/realms/mangadex:mangadex-frontend-stable') || parseStorage('oidc.user:https://auth.mangadex.org/realms/mangadex:mangadex-frontend-canary');

newBookmarklet(() => {
  const inputs = [];
  const getLinks = divIndex => {
    var _document$querySelect;
    return (_document$querySelect = document.querySelectorAll('div.input-container')[divIndex]) === null || _document$querySelect === void 0 ? void 0 : _document$querySelect.querySelectorAll('input.inline-input').forEach(input => {
      inputs.push(input);
    });
  };
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
