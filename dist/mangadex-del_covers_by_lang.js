/*!
 * Licensed under MIT: https://github.com/rRoler/bookmarklets/raw/main/LICENSE
 * Third party licenses: https://github.com/rRoler/bookmarklets/raw/main/dist/mangadex-del_covers_by_lang.dependencies.txt
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
  const deleteLanguage = prompt('Language name:', 'Japanese');
  if (!deleteLanguage) return;
  const deletedCovers = [];
  document.querySelectorAll('div.page-sizer').forEach(element => {
    const parent = element.parentElement;
    if (!parent) return;
    const close = parent.querySelector('.close');
    const language = parent.querySelector('.placeholder-text.with-label');
    if (!close || !language) return;
    if (deleteLanguage.toLowerCase().replaceAll(' ', '').includes(language.innerText.toLowerCase().replaceAll(' ', ''))) {
      close.dispatchEvent(new MouseEvent('click'));
      deletedCovers.push(element);
    }
  });
  if (deletedCovers.length <= 0) return alert('No covers in given language found!');
  console.log('Deleted covers:', deletedCovers);
}, {
  titlePage: true,
  editPage: true,
  createPage: true
});})();
