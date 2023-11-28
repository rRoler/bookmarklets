/*!
 * Licensed under MIT: https://github.com/rRoler/bookmarklets/raw/main/LICENSE
 * Third party licenses: https://github.com/rRoler/bookmarklets/raw/main/dist/mangadex-add_cover_descriptions-v2.2.dependencies.txt
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
function waitForElement(querySelectors) {
  let noElement = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
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

newBookmarklet(async () => {
  const defaultDescription = prompt('Enter a description:', 'Volume $volume Cover from BookWalker');
  if (!defaultDescription) return;
  const changedDescriptions = [];
  const elements = Array.from(document.querySelectorAll('div.page-sizer'));
  for (const element of elements) {
    if (/blob:https?:\/\/.*mangadex.*\/+[-0-9a-f]{20,}/.test(element.querySelector('.page').style.getPropertyValue('background-image'))) {
      const coverDescription = parseDescription(element, defaultDescription);
      const edit = element.parentElement?.querySelector('.volume-edit');
      edit?.dispatchEvent(new MouseEvent('click'));
      const changed = await setDescription(coverDescription);
      if (changed) changedDescriptions.push(element);
    }
  }
  if (changedDescriptions.length <= 0) return alert('No newly added covers with empty descriptions found!');
  console.log('Added descriptions:', changedDescriptions);
  function parseDescription(element, description) {
    const volumeElement = element.parentElement?.querySelector('.volume-num input');
    const volume = volumeElement?.value;
    const languageElement = element.parentElement?.querySelector('.md-select .md-select-inner-wrap .placeholder-text');
    const language = languageElement?.innerText;
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
        let changed = true;
        const save = element?.parentElement?.parentElement?.parentElement?.parentElement?.querySelector('button.primary');
        if (!element.value) element.value = description;else changed = false;
        element?.dispatchEvent(new InputEvent('input'));
        save?.dispatchEvent(new MouseEvent('click'));
        waitForElement(selectors, true).then(() => resolve(changed));
      });
    });
  }
}, {
  titlePage: true,
  editPage: true,
  createPage: true
});})();
