/*!
 * Licensed under MIT: https://github.com/rRoler/bookmarklets/raw/main/LICENSE
 * Third party licenses: https://github.com/rRoler/bookmarklets/raw/main/dist/mangadex-add_cover_descriptions.dependencies.txt
 */

(() => {function newBookmarklet$1(websiteRegex, code) {
  if (!new RegExp(websiteRegex).test(window.location.hostname)) return alert('Bookmarklet executed on the wrong website!');
  code();
}
function getMatch(string, regex, index = 0) {
  const regexMatches = string.match(regex);
  if (regexMatches && regexMatches[index]) return regexMatches[index];
}
function waitForElement(querySelectors, noElement = false) {
  let element = document.body.querySelector(querySelectors);
  return new Promise(resolve => {
    if (noElement ? !element : element) return resolve(element);
    const observer = new MutationObserver(() => {
      element = document.body.querySelector(querySelectors);
      if (noElement ? !element : element) {
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

newBookmarklet(async () => {
  const defaultDescription = prompt('Enter a description:', 'Volume $volume Cover from BookWalker');
  if (!defaultDescription) return;
  const changedDescriptions = [];
  const elements = Array.from(document.querySelectorAll('div.page-sizer'));
  for (const element of elements) {
    if (/blob:https?:\/\/.*mangadex.*\/+[-0-9a-f]{20,}/.test(element.querySelector('.page').style.getPropertyValue('background-image'))) {
      var _element$parentElemen;
      const coverDescription = parseDescription(element, defaultDescription);
      const edit = (_element$parentElemen = element.parentElement) === null || _element$parentElemen === void 0 ? void 0 : _element$parentElemen.querySelector('.volume-edit');
      edit === null || edit === void 0 || edit.dispatchEvent(new MouseEvent('click'));
      const changed = await setDescription(coverDescription);
      if (changed) changedDescriptions.push(element);
    }
  }
  if (changedDescriptions.length <= 0) return alert('No newly added covers with empty descriptions found!');
  console.log('Added descriptions:', changedDescriptions);
  function parseDescription(element, description) {
    var _element$parentElemen2, _element$parentElemen3;
    const volumeElement = (_element$parentElemen2 = element.parentElement) === null || _element$parentElemen2 === void 0 ? void 0 : _element$parentElemen2.querySelector('.volume-num input');
    const volume = volumeElement === null || volumeElement === void 0 ? void 0 : volumeElement.value;
    const languageElement = (_element$parentElemen3 = element.parentElement) === null || _element$parentElemen3 === void 0 ? void 0 : _element$parentElemen3.querySelector('.md-select .md-select-inner-wrap .placeholder-text');
    const language = languageElement === null || languageElement === void 0 ? void 0 : languageElement.innerText;
    const masks = {
      volume: volume || 'No Volume',
      language: language || 'No Language',
      nl: '\n'
    };
    for (const mask in masks) {
      const maskValue = masks[mask];
      if (maskValue) {
        description = description.replaceAll(`$${mask}`, maskValue);
      }
    }
    return description;
  }
  function setDescription(description) {
    return new Promise(resolve => {
      const selectors = '.md-modal__box .md-textarea__input';
      waitForElement(selectors).then(element => {
        var _element$parentElemen4;
        let changed = true;
        const save = element === null || element === void 0 || (_element$parentElemen4 = element.parentElement) === null || _element$parentElemen4 === void 0 || (_element$parentElemen4 = _element$parentElemen4.parentElement) === null || _element$parentElemen4 === void 0 || (_element$parentElemen4 = _element$parentElemen4.parentElement) === null || _element$parentElemen4 === void 0 || (_element$parentElemen4 = _element$parentElemen4.parentElement) === null || _element$parentElemen4 === void 0 ? void 0 : _element$parentElemen4.querySelector('button.primary');
        if (!element.value) element.value = description;else changed = false;
        element === null || element === void 0 || element.dispatchEvent(new InputEvent('input'));
        save === null || save === void 0 || save.dispatchEvent(new MouseEvent('click'));
        waitForElement(selectors, true).then(() => resolve(changed));
      });
    });
  }
}, {
  titlePage: true,
  editPage: true,
  createPage: true
});})();
