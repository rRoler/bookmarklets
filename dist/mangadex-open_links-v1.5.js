/*!
 * Licensed under MIT: https://github.com/rRoler/bookmarklets/raw/main/LICENSE
 * Third party licenses: https://github.com/rRoler/bookmarklets/raw/main/dist/mangadex-open_links-v1.5.dependencies.txt
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
function parseStorage(key) {
  const value = localStorage.getItem(key);
  if (value) return JSON.parse(value);
}
function createUrl$1(base) {
  let path = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '/';
  let query = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  const url = new URL(base);
  url.pathname = path;
  for (const key in query) {
    const value = query[key];
    if (Array.isArray(value)) {
      for (const item of value) url.searchParams.append(key, item);
    } else url.searchParams.set(key, value.toString());
  }
  return url;
}

const baseUrl = 'https://api.mangadex.org';
const pageInfo = {
  titleId: getMatch(window.location.pathname, /\/title\/(?:edit\/)?([-0-9a-f]{20,})/, 1),
  isDraft: /draft=true/.test(window.location.search)
};
const getAuthToken = () => parseStorage('oidc.user:https://auth.mangadex.org/realms/mangadex:mangadex-frontend-stable') || parseStorage('oidc.user:https://auth.mangadex.org/realms/mangadex:mangadex-frontend-canary');
const createUrl = (path, query) => createUrl$1(baseUrl, path, query);
function getManga() {
  let id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : pageInfo.titleId;
  let isDraft = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : pageInfo.isDraft;
  const authToken = getAuthToken();
  return new Promise((resolve, reject) => fetch(createUrl(`/manga${isDraft ? '/draft/' : '/'}${id}`), {
    headers: {
      Authorization: isDraft ? `${authToken.token_type} ${authToken.access_token}` : ''
    }
  }).then(rsp => resolve(rsp.json())).catch(reject));
}

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
  getManga().then(titleInfo => {
    const websites = {
      al: 'https://anilist.co/manga/',
      ap: 'https://www.anime-planet.com/manga/',
      kt: 'https://kitsu.io/manga/',
      mu: /[A-Za-z]/.test(titleInfo.data.attributes.links.mu) ? 'https://www.mangaupdates.com/series/' : 'https://www.mangaupdates.com/series.html?id=',
      mal: 'https://myanimelist.net/manga/',
      nu: 'https://www.novelupdates.com/series/',
      bw: 'https://bookwalker.jp/',
      amz: '',
      ebj: '',
      cdj: ''
    };
    for (const website in titleInfo.data.attributes.links) {
      const websiteUrl = websites[website] || '';
      const link = websiteUrl + titleInfo.data.attributes.links[website];
      window.open(link, '_blank', 'noopener,noreferrer');
    }
  });
}, {
  titlePage: true
});})();
