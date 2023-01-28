/*!
 * Licensed under MIT: https://raw.githubusercontent.com/rRoler/Bookmarklets/main/LICENSE
 * Third party licenses: https://raw.githubusercontent.com/rRoler/Bookmarklets/main/dist/mangadex/show_all_cover_descriptions.dependencies.txt
 */

void function(){const checkSite = () => /mangadex\..*/.test(window.location.hostname);

bookmarklet();
function bookmarklet() {
  if (!checkSite()) return;
  document.querySelectorAll('.cover-data-bookmarklet-show-description').forEach(element => element.dispatchEvent(new MouseEvent('click')));
}}();
