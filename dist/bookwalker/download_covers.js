/*!
 * Licensed under MIT: https://raw.githubusercontent.com/rRoler/bookmarklets/main/LICENSE
 * Third party licenses: https://raw.githubusercontent.com/rRoler/bookmarklets/main/dist/bookwalker/download_covers.dependencies.txt
 */

void function(){const checkSite = () => /bookwalker.jp/.test(window.location.hostname);

function saveAs(file, filename) {
  const isBlob = file instanceof Blob;
  const url = isBlob ? URL.createObjectURL(file) : file;
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.dispatchEvent(new MouseEvent('click'));
  if (isBlob) URL.revokeObjectURL(url);
}
function getMatch(string, regex, index = 0) {
  const regexMatches = string.match(regex);
  if (regexMatches && regexMatches[index]) return regexMatches[index];
}

bookmarklet();
function bookmarklet() {
  if (!checkSite()) return;
  const confirmAmount = 4;
  let covers = document.querySelectorAll('img.lazy');
  if (/de([-0-9a-f]{20,}\/.*)?$/.test(window.location.pathname) || document.querySelector('#js-episode-list')) covers = document.querySelectorAll('meta[property="og:image"]');
  const getId = url => {
    const id = getMatch(url, /:\/\/[^/]*\/([0-9]+)\/[0-9a-zA-Z_]+(\.[^/.]*)$/, 1) || getMatch(url, /:\/\/[^/]*\/(\D+)([0-9]+)(\.[^/.]*)$/, 2);
    if (!id) return undefined;
    if (/:\/\/c.bookwalker.jp\/thumbnailImage_[0-9]+\.[^/.]*$/.test(url)) return parseInt(id) - 1;
    return parseInt(id.split('').reverse().join('')) - 1;
  };
  const getCoverUrl = id => `https://c.bookwalker.jp/coverImage_${id}.jpg`;
  const ids = Array.from(covers).map(cover => {
    return getId(cover.getAttribute('data-original') || cover.getAttribute('data-srcset') || cover.src || cover.content);
  });
  if (covers.length > confirmAmount && !confirm(`You are about to download more than ${confirmAmount} covers!`)) return;
  saveCovers(ids);
  function saveCovers(ids) {
    ids.forEach(id => {
      if (!id) return;
      saveAs(getCoverUrl(id), `${id}.jpg`);
    });
  }
}}();
