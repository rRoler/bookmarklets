/*!
 * Licensed under MIT: https://raw.githubusercontent.com/rRoler/bookmarklets/main/LICENSE
 * Third party licenses: https://raw.githubusercontent.com/rRoler/bookmarklets/main/dist/mangadex/show_all_cover_descriptions.dependencies.txt
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
  newBookmarklet$1('mangadex.org|canary.mangadex.dev', () => {
    if (settings.titlePage && !titleId) return alert('This is not a title page!');
    if (settings.editPage && !/\/edit\//.test(window.location.pathname)) return alert('This is not an edit page!');
    code();
  });
};
parseStorage('oidc.user:https://auth.mangadex.org/realms/mangadex:mangadex-frontend-stable') || parseStorage('oidc.user:https://auth.mangadex.org/realms/mangadex:mangadex-frontend-canary');

newBookmarklet(() => {
  const showDescriptionButtons = document.querySelectorAll('.cover-data-bookmarklet-show-description');
  if (showDescriptionButtons.length <= 0) return alert('No covers with a description found!');
  showDescriptionButtons.forEach(element => element.dispatchEvent(new MouseEvent('click')));
});})();
