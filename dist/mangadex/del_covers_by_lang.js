/*!
 * Licensed under MIT: https://raw.githubusercontent.com/rRoler/bookmarklets/main/LICENSE
 * Third party licenses: https://raw.githubusercontent.com/rRoler/bookmarklets/main/dist/mangadex/del_covers_by_lang.dependencies.txt
 */

void function(){const checkSite = () => /mangadex\..*/.test(window.location.hostname);

bookmarklet();
function bookmarklet() {
  if (!checkSite()) return;
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
  if (deletedCovers.length > 0) console.log('Deleted covers:', deletedCovers);else alert('No covers in given language found!');
}}();
