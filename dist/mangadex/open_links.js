/*!
 * Licensed under MIT: https://raw.githubusercontent.com/rRoler/bookmarklets/main/LICENSE
 * Third party licenses: https://raw.githubusercontent.com/rRoler/bookmarklets/main/dist/mangadex/open_links.dependencies.txt
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
const isDraft = /\?draft=true/.test(window.location.search);
const newBookmarklet = (code, settings = {}) => {
  newBookmarklet$1('mangadex.org|canary.mangadex.dev', () => {
    const isCreatePage = settings.createPage && /\/create\//.test(window.location.pathname);
    if (settings.titlePage && !titleId && !isCreatePage) return alert('This is not a title page!');
    if (settings.editPage && !/\/edit\//.test(window.location.pathname) && !isCreatePage) return alert('This is not an edit page!');
    code();
  });
};
const authTokens = parseStorage('oidc.user:https://auth.mangadex.org/realms/mangadex:mangadex-frontend-stable') || parseStorage('oidc.user:https://auth.mangadex.org/realms/mangadex:mangadex-frontend-canary');
function fetchTitleInfo() {
  return new Promise((resolve, reject) => fetch(`https://api.mangadex.org/manga${isDraft ? '/draft/' : '/'}${titleId}`, {
    headers: {
      Authorization: isDraft ? `${authTokens.token_type} ${authTokens.access_token}` : ''
    }
  }).then(rsp => resolve(rsp.json())).catch(e => {
    alert('Failed to fetch title info!');
    reject(e);
  }));
}

newBookmarklet(() => {
  fetchTitleInfo().then(titleInfo => {
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
