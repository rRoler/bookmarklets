/*!
 * Licensed under MIT: https://raw.githubusercontent.com/rRoler/Bookmarklets/main/LICENSE
 * Third party licenses: https://raw.githubusercontent.com/rRoler/Bookmarklets/main/dist/mangadex/search_missing_links.dependencies.txt
 */

void function(){const checkSite = () => /mangadex\..*/.test(window.location.hostname);

function getMatch(string, regex, index = 0) {
  const regexMatches = string.match(regex);
  if (regexMatches && regexMatches[index]) return regexMatches[index];
}

bookmarklet();
function bookmarklet() {
  if (!checkSite()) return;
  const websites = {
    al: 'https://anilist.co/search/manga?search=',
    ap: 'https://www.anime-planet.com/manga/all?name=',
    bw: 'https://bookwalker.jp/search/?qcat=2&word=',
    kt: 'https://kitsu.io/manga?subtype=manga&text=',
    mu: 'https://www.mangaupdates.com/search.html?search=',
    amz: 'https://www.amazon.co.jp/s?rh=n:466280&k=',
    cdj: 'https://www.cdjapan.co.jp/searchuni?term.media_format=BOOK&q=',
    ebj: 'https://ebookjapan.yahoo.co.jp/search/?keyword=',
    mal: 'https://myanimelist.net/manga.php?type=manga&keyword='
  };
  if (/\/create\/title/.test(window.location.pathname)) {
    const title = prompt('Enter a title to search for');
    if (!title) return;
    for (const website in websites) {
      window.open(websites[website] + title, '_blank', 'noopener,noreferrer');
    }
    return;
  }
  const mangaId = getMatch(window.location.pathname, /\/title\/edit\/+([-0-9a-f]{20,})/, 1);
  const draftId = getMatch(window.location.pathname, /\/(draft\/+[-0-9a-f]{20,})\/edit/, 1);
  const titleId = mangaId || draftId;
  if (!titleId) return alert('This is not a title edit page!');
  const getToken = key => {
    const token = localStorage.getItem(key);
    if (token) return JSON.parse(token);
  };
  const authTokens = getToken('oidc.user:https://auth.mangadex.org/realms/mangadex:mangadex-frontend-stable') || getToken('oidc.user:https://auth.mangadex.org/realms/mangadex:mangadex-frontend-canary');
  fetch(`https://api.mangadex.org/manga/${titleId}`, {
    headers: {
      Authorization: draftId ? `${authTokens.token_type} ${authTokens.access_token}` : ''
    }
  }).then(rsp => rsp.json()).then(rsp => {
    const originalLang = rsp.data.attributes.originalLanguage;
    let originalTitle = undefined;
    try {
      originalTitle = rsp.data.attributes.altTitles.find(title => title[originalLang]);
    } catch (e) {
      console.debug('No alt titles found');
    }
    let title = originalTitle ? originalTitle[originalLang] : rsp.data.attributes.title.en || '';
    title = prompt('Enter a title to search for', title);
    if (!title) return;
    for (const website in websites) {
      if (!rsp.data.attributes.links[website]) window.open(websites[website] + title, '_blank', 'noopener,noreferrer');
    }
  }).catch(e => {
    console.error(e);
    alert('Failed to fetch title info!');
  });
}}();
