/*!
 * Licensed under MIT: https://github.com/rRoler/bookmarklets/raw/main/LICENSE
 * Third party licenses: https://github.com/rRoler/bookmarklets/raw/main/dist/mangadex-del_covers_by_lang.dependencies.txt
 */

(() => {function newBookmarklet$1(websiteRegex, code) {
  if (!new RegExp(websiteRegex).test(window.location.hostname)) return alert('Bookmarklet executed on the wrong website!');
  code();
}
function getMatch(string, regex, index = 0) {
  const regexMatches = string.match(regex);
  if (regexMatches && regexMatches[index]) return regexMatches[index];
}

const pageInfo = {
  titleId: getMatch(window.location.pathname, /\/title\/(?:edit\/)?([-0-9a-f]{20,})/, 1),
  isDraft: /draft=true/.test(window.location.search)
};

const newBookmarklet = (code, settings = {}) => {
  newBookmarklet$1('^mangadex.org|canary.mangadex.dev', () => {
    const isCreatePage = settings.createPage && /\/create\//.test(window.location.pathname);
    const noticePart = 'You can execute this bookmarklet only on ';
    if (settings.titlePage && !pageInfo.titleId && !isCreatePage) return alert(noticePart + 'a title page!');
    if (settings.editPage && !/\/edit\//.test(window.location.pathname) && !isCreatePage) return alert(noticePart + 'an edit page!');
    code();
  });
};

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
