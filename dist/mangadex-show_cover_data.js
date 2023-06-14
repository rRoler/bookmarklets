/*!
 * Licensed under MIT: https://github.com/rRoler/bookmarklets/raw/main/LICENSE
 * Third party licenses: https://github.com/rRoler/bookmarklets/raw/main/dist/mangadex-show_cover_data.dependencies.txt
 */

(() => {function newBookmarklet$1(websiteRegex, code) {
  if (!new RegExp(websiteRegex).test(window.location.hostname)) return alert('Bookmarklet executed on a wrong website!');
  code();
}
function getMatch(string, regex, index = 0) {
  const regexMatches = string.match(regex);
  if (regexMatches && regexMatches[index]) return regexMatches[index];
}
function splitArray(array, chunkSize = 100) {
  const arrayCopy = [...array];
  const resArray = [];
  while (arrayCopy.length) resArray.push(arrayCopy.splice(0, chunkSize));
  return resArray;
}
function createSVG({
  fill = 'none',
  viewBox = '0 0 24 24',
  stroke = 'currentColor',
  strokeLinecap = 'round',
  strokeLinejoin = 'round',
  d = ''
}) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('fill', fill);
  svg.setAttribute('viewBox', viewBox);
  svg.setAttribute('stroke', stroke);
  const svgPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  svgPath.setAttribute('stroke-linecap', strokeLinecap);
  svgPath.setAttribute('stroke-linejoin', strokeLinejoin);
  svgPath.setAttribute('d', d);
  svg.appendChild(svgPath);
  return svg;
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

function _defineProperty(obj, key, value) {
  key = _toPropertyKey(key);
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _toPrimitive(input, hint) {
  if (typeof input !== "object" || input === null) return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== undefined) {
    var res = prim.call(input, hint || "default");
    if (typeof res !== "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}
function _toPropertyKey(arg) {
  var key = _toPrimitive(arg, "string");
  return typeof key === "symbol" ? key : String(key);
}

class SimpleProgressBar {
  constructor(initialPercentage = 0) {
    _defineProperty(this, "addToDocument", () => document.body.appendChild(this.element));
    _defineProperty(this, "removeFromDocument", () => this.element.remove());
    const background = document.createElement('div');
    background.style.setProperty('z-index', '1000');
    background.style.setProperty('position', 'fixed');
    background.style.setProperty('bottom', '0');
    background.style.setProperty('left', '0');
    background.style.setProperty('width', '100%');
    background.style.setProperty('height', '24px');
    background.style.setProperty('background-color', '#3c3c3c');
    background.style.setProperty('cursor', 'pointer');
    const progress = document.createElement('div');
    progress.style.setProperty('height', '100%');
    progress.style.setProperty('background-color', '#b5e853');
    progress.style.setProperty('transition', 'width 200ms');
    this.bar = progress;
    this.update(initialPercentage);
    background.appendChild(progress);
    background.addEventListener('click', this.removeFromDocument);
    this.element = background;
  }
  update(percentage) {
    const currentPercentageRounded = Math.ceil(parseInt(this.bar.style.getPropertyValue('width')));
    const percentageRounded = Math.ceil(percentage);
    if (percentageRounded >= 100) this.removeFromDocument();else if (currentPercentageRounded !== percentageRounded && percentageRounded >= 0) this.bar.style.setProperty('width', `${percentageRounded}%`);
  }
}

newBookmarklet(() => {
  const requestLimit = 100;
  const maxRequestOffset = 1000;
  const coverElements = [];
  const coverFileNames = new Map();
  const skippedCoverFileNames = new Map();
  const mangaIdsForQuery = {
    manga: [],
    cover: []
  };
  const progressBar = new SimpleProgressBar();
  document.querySelectorAll('img, div').forEach(element => {
    const imageSource = element.src || element.style.getPropertyValue('background-image');
    if (!/\/covers\/+[-0-9a-f]{20,}\/+[-0-9a-f]{20,}[^/]+(?:[?#].*)?$/.test(imageSource) || element.classList.contains('banner-image')) return;
    const mangaId = getMatch(imageSource, /[-0-9a-f]{20,}/);
    const coverFileName = getMatch(imageSource, /([-0-9a-f]{20,}\.[^/.]*)\.[0-9]+\.[^/.?#]*([?#].*)?$/, 1) || getMatch(imageSource, /[-0-9a-f]{20,}\.[^/.]*?$/);
    if (!mangaId || !coverFileName) return;
    const addCoverFileName = fileNames => {
      var _fileNames$get;
      fileNames.has(mangaId) ? (_fileNames$get = fileNames.get(mangaId)) === null || _fileNames$get === void 0 ? void 0 : _fileNames$get.add(coverFileName) : fileNames.set(mangaId, new Set([coverFileName]));
    };
    if (element.getAttribute('cover-data-bookmarklet') === 'executed') {
      addCoverFileName(skippedCoverFileNames);
      return;
    }
    coverElements.push(element);
    element.setAttribute('cover-data-bookmarklet', 'executed');
    addCoverFileName(coverFileNames);
  });
  if (coverFileNames.size <= 0) {
    if (document.querySelector('[cover-data-bookmarklet="executed"]')) return alert('No new covers were found on this page since the last time this bookmarklet was executed!');
    return alert('No covers were found on this page!');
  }
  progressBar.addToDocument();
  coverFileNames.forEach((fileNames, mangaId) => {
    var _skippedCoverFileName;
    const skippedCoversSize = ((_skippedCoverFileName = skippedCoverFileNames.get(mangaId)) === null || _skippedCoverFileName === void 0 ? void 0 : _skippedCoverFileName.size) || 0;
    if (fileNames.size + skippedCoversSize > 1) mangaIdsForQuery.cover.push(mangaId);else mangaIdsForQuery.manga.push(mangaId);
  });
  getAllCoverData().then(covers => {
    let addedCoverData = 0;
    const coverImagesContainer = document.createElement('div');
    coverImagesContainer.style.setProperty('width', 'fit-content');
    coverImagesContainer.style.setProperty('height', 'fit-content');
    coverImagesContainer.style.setProperty('opacity', '0');
    coverImagesContainer.style.setProperty('position', 'absolute');
    coverImagesContainer.style.setProperty('top', '-10000px');
    coverImagesContainer.style.setProperty('z-index', '-10000');
    coverImagesContainer.style.setProperty('pointer-events', 'none');
    document.body.appendChild(coverImagesContainer);
    coverElements.forEach(element => {
      const imageSource = element.src || element.style.getPropertyValue('background-image');
      covers.forEach(cover => {
        const coverManga = cover.relationships.find(relationship => relationship.type === 'manga');
        if (!coverManga) return;
        if (new RegExp(`${coverManga.id}/${cover.attributes.fileName}`).test(imageSource)) {
          const fullSizeImage = new Image();
          coverImagesContainer.appendChild(fullSizeImage);
          try {
            new ResizeObserver((entries, observer) => {
              const fullSizeImageWidth = fullSizeImage.naturalWidth;
              const fullSizeImageHeight = fullSizeImage.naturalHeight;
              if (fullSizeImageWidth > 0 && fullSizeImageHeight > 0) {
                observer.disconnect();
                fullSizeImage.remove();
                fullSizeImage.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQIW2NgAAIAAAUAAR4f7BQAAAAASUVORK5CYII=';
                if (coverImagesContainer.children.length <= 0) coverImagesContainer.remove();
                displayCoverData(element, fullSizeImageWidth, fullSizeImageHeight, cover);
                progressBar.update(++addedCoverData / coverElements.length * 100);
              }
            }).observe(fullSizeImage);
          } catch (e) {
            fullSizeImage.onload = () => {
              fullSizeImage.remove();
              if (coverImagesContainer.children.length <= 0) coverImagesContainer.remove();
              displayCoverData(element, fullSizeImage.naturalWidth, fullSizeImage.naturalHeight, cover);
              progressBar.update(++addedCoverData / coverElements.length * 100);
            };
          }
          fullSizeImage.src = `https://mangadex.org/covers/${coverManga.id}/${cover.attributes.fileName}`;
        }
      });
    });
  }).catch(e => {
    console.error(e);
    alert('Failed to fetch cover data!');
  });
  function displayCoverData(element, fullSizeImageWidth, fullSizeImageHeight, cover) {
    element.setAttribute('cover-data-cover-id', cover.id);
    const descriptionShowElement = document.createElement('span');
    const descriptionElement = document.createElement('span');
    const descriptionShowElementSvg = createSVG({
      d: 'M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z'
    });
    descriptionElement.classList.add('cover-data-bookmarklet-description');
    if (cover.attributes.description) {
      const showDescriptions = (event, show = true) => {
        const showDescription = element => element.style.setProperty('display', show ? 'flex' : 'none');
        event.stopPropagation();
        event.preventDefault();
        if (event.shiftKey) document.querySelectorAll('.cover-data-bookmarklet-description').forEach(element => showDescription(element));else showDescription(descriptionElement);
      };
      descriptionShowElement.setAttribute('title', cover.attributes.description);
      descriptionShowElementSvg.addEventListener('click', showDescriptions);
      descriptionShowElement.appendChild(descriptionShowElementSvg);
      const descriptionTextElement = document.createElement('span');
      descriptionTextElement.innerText = cover.attributes.description;
      descriptionTextElement.style.setProperty('max-height', '100%');
      descriptionTextElement.style.setProperty('margin', '0.2rem');
      descriptionTextElement.style.setProperty('text-align', 'center');
      descriptionElement.style.setProperty('position', 'absolute');
      descriptionElement.style.setProperty('width', '100%');
      descriptionElement.style.setProperty('height', '100%');
      descriptionElement.style.setProperty('overflow-y', 'auto');
      descriptionElement.style.setProperty('display', 'none');
      descriptionElement.style.setProperty('align-items', 'center');
      descriptionElement.style.setProperty('justify-content', 'center');
      descriptionElement.style.setProperty('background-color', 'var(--md-accent)');
      descriptionElement.style.setProperty('z-index', '4');
      descriptionElement.addEventListener('click', e => showDescriptions(e, false));
      descriptionElement.appendChild(descriptionTextElement);
    }
    const sizeElement = document.createElement('span');
    const sizeElementText = document.createElement('span');
    const coverSize = `${fullSizeImageWidth}x${fullSizeImageHeight}`;
    sizeElementText.innerText = coverSize;
    sizeElementText.setAttribute('title', coverSize + '\n(click to copy id)');
    sizeElementText.addEventListener('click', event => {
      const copyId = ids => {
        navigator.clipboard.writeText(ids).then(() => console.debug(`Copied cover ids: ${ids}`), () => console.error(`Failed to copy cover ids: ${ids}`)).catch(console.error);
      };
      event.stopPropagation();
      event.preventDefault();
      if (event.shiftKey) {
        const coverIds = [];
        document.querySelectorAll('[cover-data-cover-id]').forEach(element => {
          const coverId = element.getAttribute('cover-data-cover-id');
          if (coverId && !coverIds.includes(coverId)) coverIds.push(coverId);
        });
        copyId(coverIds.join(' '));
      } else copyId(cover.id);
    });
    sizeElement.style.setProperty('position', 'absolute');
    sizeElement.style.setProperty('top', '0');
    sizeElement.appendChild(sizeElementText);
    const iconsElement = document.createElement('div');
    iconsElement.style.setProperty('display', 'flex');
    iconsElement.style.setProperty('flex-wrap', 'nowrap');
    iconsElement.style.setProperty('gap', '0.2rem');
    if (element instanceof HTMLImageElement) {
      var _element$parentElemen2;
      sizeElement.style.setProperty('padding', '0.5rem 0.5rem 1rem');
      sizeElement.style.setProperty('color', '#fff');
      sizeElement.style.setProperty('left', '0');
      sizeElement.style.setProperty('width', '100%');
      sizeElement.style.setProperty('background', 'linear-gradient(0deg,transparent,rgba(0,0,0,0.8))');
      sizeElement.style.setProperty('border-top-right-radius', '0.25rem');
      sizeElement.style.setProperty('border-top-left-radius', '0.25rem');
      iconsElement.style.setProperty('position', 'absolute');
      iconsElement.style.setProperty('top', '0');
      iconsElement.style.setProperty('right', '0');
      iconsElement.style.setProperty('padding', '0.45rem 0.5rem');
      iconsElement.style.setProperty('color', '#fff');
      if (cover.attributes.description) {
        var _element$parentElemen;
        descriptionShowElementSvg.setAttribute('stroke-width', '1.5');
        descriptionShowElementSvg.style.setProperty('width', '1.5rem');
        descriptionShowElementSvg.style.setProperty('height', '1.5rem');
        descriptionElement.style.setProperty('border-radius', '0.25rem');
        (_element$parentElemen = element.parentElement) === null || _element$parentElemen === void 0 ? void 0 : _element$parentElemen.append(descriptionElement);
        iconsElement.appendChild(descriptionShowElement);
      }
      (_element$parentElemen2 = element.parentElement) === null || _element$parentElemen2 === void 0 ? void 0 : _element$parentElemen2.append(sizeElement, iconsElement);
    } else {
      sizeElement.style.setProperty('padding', '0 0.2rem');
      sizeElement.style.setProperty('background-color', 'var(--md-accent)');
      sizeElement.style.setProperty('border-bottom-left-radius', '4px');
      sizeElement.style.setProperty('border-bottom-right-radius', '4px');
      element.appendChild(sizeElement);
      iconsElement.style.setProperty('margin-left', '0.2rem');
      sizeElement.style.setProperty('display', 'flex');
      sizeElement.style.setProperty('flex-wrap', 'nowrap');
      sizeElement.style.setProperty('align-items', 'center');
      if (cover.attributes.description) {
        descriptionShowElementSvg.setAttribute('stroke-width', '2');
        descriptionShowElementSvg.style.setProperty('width', '1.3rem');
        descriptionShowElementSvg.style.setProperty('height', '1.3rem');
        element.appendChild(descriptionElement);
        iconsElement.appendChild(descriptionShowElement);
      }
      sizeElement.appendChild(iconsElement);
      element.appendChild(sizeElement);
    }
  }
  function getAllCoverData() {
    const covers = [];
    async function awaitAllCoverData() {
      for (const endpoint in mangaIdsForQuery) {
        const isCoverEndpoint = endpoint === 'cover';
        const mangaIdsForQuerySplit = splitArray(mangaIdsForQuery[endpoint]);
        for (const ids of mangaIdsForQuerySplit) {
          const rsp = await getCoverData(ids, endpoint);
          if (isCoverEndpoint) {
            covers.push(...rsp.data);
            for (let i = rsp.limit; i < rsp.total; i += rsp.limit) {
              const rsp = await getCoverData(ids, endpoint, i);
              covers.push(...rsp.data);
            }
          } else {
            rsp.data.forEach(manga => {
              const cover = manga.relationships.find(relationship => relationship.type === 'cover_art');
              if (cover) {
                cover.relationships = [{
                  type: manga.type,
                  id: manga.id
                }];
                covers.push(cover);
              }
            });
          }
        }
      }
      return covers;
    }
    return new Promise((resolve, reject) => {
      awaitAllCoverData().then(resolve).catch(reject);
    });
  }
  function getCoverData(ids, endpoint, offset = 0) {
    return new Promise((resolve, reject) => {
      const isCoverEndpoint = endpoint === 'cover';
      const mangaIdsQuery = ids.map(id => isCoverEndpoint ? `manga[]=${id}` : `ids[]=${id}`).join('&');
      let url = `https://api.mangadex.org/${endpoint}?${mangaIdsQuery}&includes[]=cover_art&limit=${requestLimit}&contentRating[]=safe&contentRating[]=suggestive&contentRating[]=erotica&contentRating[]=pornographic&offset=${offset}`;
      if (isCoverEndpoint) url = `https://api.mangadex.org/${endpoint}?order[volume]=asc&${mangaIdsQuery}&limit=${requestLimit}&offset=${offset}`;
      if (offset > maxRequestOffset) return reject(new Error(`Offset is bigger than ${maxRequestOffset}:\n ${url}`));
      fetch(url).then(rsp => resolve(rsp.json())).catch(reject);
    });
  }
});})();
