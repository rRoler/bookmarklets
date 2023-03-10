/*!
 * Licensed under MIT: https://raw.githubusercontent.com/rRoler/bookmarklets/main/LICENSE
 * Third party licenses: https://raw.githubusercontent.com/rRoler/bookmarklets/main/dist/mangadex/search_missing_links.dependencies.txt
 */

void function(){function newBookmarklet$1(websiteRegex, code) {
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
    if (settings.titlePage && !titleId) return alert('This is not a title page!');
    if (settings.editPage && !/\/edit\//.test(window.location.pathname)) return alert('This is not an edit page!');
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
  const websites = {
    al: 'https://anilist.co/search/manga?search=',
    ap: 'https://www.anime-planet.com/manga/all?name=',
    kt: 'https://kitsu.io/manga?subtype=manga&text=',
    mu: 'https://www.mangaupdates.com/search.html?search=',
    mal: 'https://myanimelist.net/manga.php?q=',
    nu: 'https://www.novelupdates.com/?s=',
    bw: 'https://bookwalker.jp/search/?qcat=2&word=',
    amz: 'https://www.amazon.co.jp/s?rh=n:466280&k=',
    ebj: 'https://ebookjapan.yahoo.co.jp/search/?keyword=',
    cdj: 'https://www.cdjapan.co.jp/searchuni?term.media_format=BOOK&q='
  };
  if (/\/create\/title/.test(window.location.pathname)) {
    const title = prompt('Enter a title to search for');
    if (!title) return;
    for (const website in websites) window.open(websites[website] + title, '_blank', 'noopener,noreferrer');
    return;
  }
  fetchTitleInfo().then(titleInfo => {
    const missingWebsites = Object.keys(websites).filter(website => !titleInfo.data.attributes.links[website]);
    if (missingWebsites.length <= 0) return alert('All links are already added!');
    const originalLang = titleInfo.data.attributes.originalLanguage;
    let originalTitle = undefined;
    try {
      originalTitle = titleInfo.data.attributes.altTitles.find(title => title[originalLang]);
    } catch (e) {
      console.debug('No alt titles found');
    }
    let title = originalTitle ? originalTitle[originalLang] : titleInfo.data.attributes.title.en || '';
    title = prompt('Enter a title to search for', title);
    if (!title) return;
    missingWebsites.forEach(website => window.open(websites[website] + title, '_blank', 'noopener,noreferrer'));
  });
}, {
  titlePage: true
});}();
