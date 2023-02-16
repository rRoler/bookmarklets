/*!
 * Licensed under MIT: https://raw.githubusercontent.com/rRoler/bookmarklets/main/LICENSE
 * Third party licenses: https://raw.githubusercontent.com/rRoler/bookmarklets/main/dist/mangadex/show_all_cover_descriptions.dependencies.txt
 */

void function(){const checkSite = () => /mangadex\..*/.test(window.location.hostname);

bookmarklet();
function bookmarklet() {
  if (!checkSite()) return;
  const showDescriptionButtons = document.querySelectorAll('.cover-data-bookmarklet-show-description');
  if (showDescriptionButtons.length <= 0) return alert('No covers with a description found!');
  showDescriptionButtons.forEach(element => element.dispatchEvent(new MouseEvent('click')));
}}();
