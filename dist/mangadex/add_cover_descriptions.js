/*!
 * Licensed under MIT: https://raw.githubusercontent.com/rRoler/bookmarklets/main/LICENSE
 * Third party licenses: https://raw.githubusercontent.com/rRoler/bookmarklets/main/dist/mangadex/add_cover_descriptions.dependencies.txt
 */

void function(){function newBookmarklet$1(websiteRegex, code) {
  if (!new RegExp(websiteRegex).test(window.location.hostname)) return alert('Bookmarklet executed on a wrong website!');
  code();
}
function getMatch(string, regex, index = 0) {
  const regexMatches = string.match(regex);
  if (regexMatches && regexMatches[index]) return regexMatches[index];
}
function waitForElement(querySelectors) {
  let element = document.body.querySelector(querySelectors);
  return new Promise(resolve => {
    if (element) return resolve(element);
    const observer = new MutationObserver(() => {
      element = document.body.querySelector(querySelectors);
      if (element) {
        resolve(element);
        observer.disconnect();
      }
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  });
}
function waitForNoElement(querySelectors) {
  let element = document.body.querySelector(querySelectors);
  return new Promise(resolve => {
    if (!element) return resolve();
    const observer = new MutationObserver(() => {
      element = document.body.querySelector(querySelectors);
      if (!element) {
        resolve();
        observer.disconnect();
      }
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  });
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

newBookmarklet(async () => {
  const description = prompt('Enter a description:', 'BookWalker');
  if (!description) return;
  const changedDescriptions = [];
  const elements = Array.from(document.querySelectorAll('div.page-sizer'));
  for (const index in elements) {
    const element = elements[index];
    if (/blob:https?:\/\/.*mangadex.*\/+[-0-9a-f]{20,}/.test(element.querySelector('.page').style.getPropertyValue('background-image'))) {
      var _element$parentElemen;
      const edit = (_element$parentElemen = element.parentElement) === null || _element$parentElemen === void 0 ? void 0 : _element$parentElemen.querySelector('.volume-edit');
      edit === null || edit === void 0 ? void 0 : edit.dispatchEvent(new MouseEvent('click'));
      const changed = await setDescription();
      if (changed) changedDescriptions.push(element);
    }
  }
  if (changedDescriptions.length <= 0) return alert('No newly added covers with empty descriptions found!');
  console.log('Changed descriptions:', changedDescriptions);
  function setDescription() {
    return new Promise(resolve => {
      const selectors = 'textarea[placeholder="Cover Description"]';
      waitForElement(selectors).then(element => {
        var _element$parentElemen2, _element$parentElemen3, _element$parentElemen4, _element$parentElemen5;
        let changed = true;
        const save = (_element$parentElemen2 = element.parentElement) === null || _element$parentElemen2 === void 0 ? void 0 : (_element$parentElemen3 = _element$parentElemen2.parentElement) === null || _element$parentElemen3 === void 0 ? void 0 : (_element$parentElemen4 = _element$parentElemen3.parentElement) === null || _element$parentElemen4 === void 0 ? void 0 : (_element$parentElemen5 = _element$parentElemen4.parentElement) === null || _element$parentElemen5 === void 0 ? void 0 : _element$parentElemen5.querySelector('button.primary');
        if (!element.value) element.value = description;else changed = false;
        element.dispatchEvent(new InputEvent('input'));
        save === null || save === void 0 ? void 0 : save.dispatchEvent(new MouseEvent('click'));
        waitForNoElement(selectors).then(() => resolve(changed));
      });
    });
  }
}, {
  titlePage: true,
  editPage: true
});}();
