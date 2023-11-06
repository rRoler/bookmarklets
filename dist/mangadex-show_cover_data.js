/*!
 * Licensed under MIT: https://github.com/rRoler/bookmarklets/raw/main/LICENSE
 * Third party licenses: https://github.com/rRoler/bookmarklets/raw/main/dist/mangadex-show_cover_data.dependencies.txt
 */

(() => {function newBookmarklet$1(websiteRegex, code) {
  if (!new RegExp(websiteRegex).test(window.location.hostname)) return alert('Bookmarklet executed on the wrong website!');
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
function setStyle(element, styles) {
  for (const style in styles) element.style.setProperty(style, styles[style]);
}
function createUrl$1(base, path = '/', query = {}) {
  const url = new URL(base);
  url.pathname = path;
  for (const key in query) {
    const value = query[key];
    if (Array.isArray(value)) {
      for (const item of value) url.searchParams.append(key, item);
    } else url.searchParams.set(key, value.toString());
  }
  return url;
}

const baseUrl = 'https://api.mangadex.org';
const pageInfo = {
  titleId: getMatch(window.location.pathname, /\/title\/(?:edit\/)?([-0-9a-f]{20,})/, 1),
  isDraft: /draft=true/.test(window.location.search)
};
const createUrl = (path, query) => createUrl$1(baseUrl, path, query);
function getMangaList({
  ids,
  includes = [],
  contentRating = [],
  offset = 0,
  limit = 100
}) {
  return new Promise((resolve, reject) => {
    fetch(createUrl('/manga', {
      offset: offset,
      limit: limit,
      'includes[]': includes,
      'contentRating[]': contentRating,
      'ids[]': ids
    })).then(rsp => resolve(rsp.json())).catch(reject);
  });
}
function getCoverList({
  mangaIds,
  order = {},
  offset = 0,
  limit = 100
}) {
  return new Promise((resolve, reject) => {
    const query = {
      offset: offset,
      limit: limit,
      'manga[]': mangaIds
    };
    if (order !== null && order !== void 0 && order.volume) query['order[volume]'] = order.volume;
    fetch(createUrl('/cover', query)).then(rsp => resolve(rsp.json())).catch(reject);
  });
}

const newBookmarklet = (code, settings = {}) => {
  newBookmarklet$1('^mangadex.org|canary.mangadex.dev', () => {
    const isCreatePage = settings.createPage && /\/create\//.test(window.location.pathname);
    const noticePart = 'You can execute this bookmarklet only on ';
    if (settings.titlePage && !pageInfo.titleId && !isCreatePage) return alert(noticePart + 'a title page!');
    if (settings.editPage && !/\/edit\//.test(window.location.pathname) && !isCreatePage) return alert(noticePart + 'an edit page!');
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
    _defineProperty(this, "add", () => document.body.appendChild(this.element));
    _defineProperty(this, "remove", () => this.element.remove());
    const background = document.createElement('div');
    setStyle(background, {
      'z-index': '1000',
      position: 'fixed',
      bottom: '0',
      left: '0',
      width: '100%',
      height: '24px',
      'background-color': '#3c3c3c',
      cursor: 'pointer'
    });
    const progress = document.createElement('div');
    setStyle(progress, {
      height: '100%',
      'background-color': '#b5e853',
      transition: 'width 200ms'
    });
    this.bar = progress;
    this.update(initialPercentage);
    background.appendChild(progress);
    background.addEventListener('click', this.remove);
    this.element = background;
  }
  update(percentage) {
    const currentPercentageRounded = Math.ceil(parseInt(this.bar.style.getPropertyValue('width')));
    const percentageRounded = Math.ceil(percentage);
    if (percentageRounded >= 100) this.remove();else if (currentPercentageRounded !== percentageRounded && percentageRounded >= 0) setStyle(this.bar, {
      width: `${percentageRounded}%`
    });
  }
}

newBookmarklet(() => {
  const maxCoverRetry = 4;
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
  progressBar.add();
  coverFileNames.forEach((fileNames, mangaId) => {
    var _skippedCoverFileName;
    const skippedCoversSize = ((_skippedCoverFileName = skippedCoverFileNames.get(mangaId)) === null || _skippedCoverFileName === void 0 ? void 0 : _skippedCoverFileName.size) || 0;
    if (fileNames.size + skippedCoversSize > 1) mangaIdsForQuery.cover.push(mangaId);else mangaIdsForQuery.manga.push(mangaId);
  });
  getAllCoverData().then(covers => {
    let addedCoverData = 0;
    let failedCoverData = 0;
    const coverImagesContainer = document.createElement('div');
    setStyle(coverImagesContainer, {
      width: 'fit-content',
      height: 'fit-content',
      opacity: '0',
      position: 'absolute',
      top: '-10000px',
      'z-index': '-10000',
      'pointer-events': 'none'
    });
    document.body.appendChild(coverImagesContainer);
    coverElements.forEach(element => {
      const imageSource = element.src || element.style.getPropertyValue('background-image');
      let coverManga;
      const cover = covers.find(cover => {
        coverManga = cover.relationships.find(relationship => relationship.type === 'manga');
        if (coverManga && new RegExp(`${coverManga.id}/${cover.attributes.fileName}`).test(imageSource)) return cover;
      });
      if (!cover || !coverManga) {
        console.error(`Element changed primary cover image: ${element}`);
        ++failedCoverData;
        reportFailed();
        return;
      }
      let coverRetry = 0;
      const coverUrl = `https://mangadex.org/covers/${coverManga.id}/${cover.attributes.fileName}`;
      const replacementCoverUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQIW2NgAAIAAAUAAR4f7BQAAAAASUVORK5CYII=';
      const fullSizeImage = new Image();
      fullSizeImage.setAttribute('cover-data-bookmarklet', 'executed');
      coverImagesContainer.appendChild(fullSizeImage);
      function reportFailed() {
        if (addedCoverData + failedCoverData >= coverElements.length) {
          progressBar.remove();
          if (failedCoverData > 0) alert(`${failedCoverData} cover images failed to load.\n\nReload the page and execute the bookmarklet again!`);
        }
      }
      function fallbackMethod() {
        fullSizeImage.onerror = () => {
          console.error(`Cover image failed to load: ${coverUrl}`);
          ++failedCoverData;
          reportFailed();
        };
        fullSizeImage.onload = () => {
          fullSizeImage.remove();
          if (coverImagesContainer.children.length <= 0) coverImagesContainer.remove();
          displayCoverData(element, fullSizeImage.naturalWidth, fullSizeImage.naturalHeight, cover);
          progressBar.update(++addedCoverData / coverElements.length * 100);
          reportFailed();
        };
      }
      try {
        fullSizeImage.onerror = () => {
          console.warn(`Cover image failed to load: ${coverUrl}.\nRetrying...`);
          fullSizeImage.removeAttribute('src');
          if (++coverRetry >= maxCoverRetry) fallbackMethod();
          fullSizeImage.setAttribute('src', coverUrl);
        };
        new ResizeObserver((_entries, observer) => {
          if (coverRetry >= maxCoverRetry) return observer.disconnect();
          const fullSizeImageWidth = fullSizeImage.naturalWidth;
          const fullSizeImageHeight = fullSizeImage.naturalHeight;
          if (fullSizeImageWidth > 0 && fullSizeImageHeight > 0) {
            observer.disconnect();
            fullSizeImage.remove();
            fullSizeImage.src = replacementCoverUrl;
            if (coverImagesContainer.children.length <= 0) coverImagesContainer.remove();
            displayCoverData(element, fullSizeImageWidth, fullSizeImageHeight, cover);
            progressBar.update(++addedCoverData / coverElements.length * 100);
            reportFailed();
          }
        }).observe(fullSizeImage);
      } catch (e) {
        fallbackMethod();
      }
      fullSizeImage.src = coverUrl;
    });
  }).catch(e => {
    console.error(e);
    alert('Failed to fetch cover data!\n' + e.message);
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
        const showDescription = element => setStyle(element, {
          display: show ? 'flex' : 'none'
        });
        event.stopPropagation();
        event.preventDefault();
        if (event.shiftKey) document.querySelectorAll('.cover-data-bookmarklet-description').forEach(element => showDescription(element));else showDescription(descriptionElement);
      };
      descriptionShowElement.setAttribute('title', cover.attributes.description);
      descriptionShowElementSvg.addEventListener('click', showDescriptions);
      descriptionShowElement.appendChild(descriptionShowElementSvg);
      const descriptionTextElement = document.createElement('span');
      descriptionTextElement.innerText = cover.attributes.description;
      setStyle(descriptionTextElement, {
        'max-height': '100%',
        margin: '0.2rem',
        'text-align': 'center'
      });
      setStyle(descriptionElement, {
        position: 'absolute',
        width: '100%',
        height: '100%',
        'overflow-y': 'auto',
        display: 'none',
        'align-items': 'center',
        'justify-content': 'center',
        'background-color': 'rgb(var(--md-accent))',
        'z-index': '4'
      });
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
    setStyle(sizeElement, {
      position: 'absolute',
      top: '0'
    });
    sizeElement.appendChild(sizeElementText);
    const iconsElement = document.createElement('div');
    setStyle(iconsElement, {
      display: 'flex',
      'flex-wrap': 'nowrap',
      gap: '0.2rem'
    });
    if (element instanceof HTMLImageElement) {
      var _element$parentElemen;
      setStyle(sizeElement, {
        padding: '0.5rem 0.5rem 1rem',
        color: '#fff',
        left: '0',
        width: '100%',
        background: 'linear-gradient(0deg,transparent,rgba(0,0,0,0.8))',
        'border-top-right-radius': '0.25rem',
        'border-top-left-radius': '0.25rem'
      });
      (_element$parentElemen = element.parentElement) === null || _element$parentElemen === void 0 || _element$parentElemen.appendChild(sizeElement);
      if (cover.attributes.description) {
        var _element$parentElemen2;
        setStyle(iconsElement, {
          position: 'absolute',
          top: '0',
          right: '0',
          padding: '0.45rem 0.5rem',
          color: '#fff'
        });
        setStyle(descriptionShowElementSvg, {
          width: '1.5rem',
          height: '1.5rem'
        });
        descriptionShowElementSvg.setAttribute('stroke-width', '1.5');
        setStyle(descriptionElement, {
          'border-radius': '0.25rem'
        });
        iconsElement.appendChild(descriptionShowElement);
        (_element$parentElemen2 = element.parentElement) === null || _element$parentElemen2 === void 0 || _element$parentElemen2.append(iconsElement, descriptionElement);
      }
    } else {
      setStyle(sizeElement, {
        padding: '0 0.2rem',
        'background-color': 'rgb(var(--md-accent))',
        'border-bottom-left-radius': '4px',
        'border-bottom-right-radius': '4px'
      });
      element.appendChild(sizeElement);
      setStyle(iconsElement, {
        'margin-left': '0.2rem'
      });
      setStyle(sizeElement, {
        display: 'flex',
        'flex-wrap': 'nowrap',
        'align-items': 'center'
      });
      if (cover.attributes.description) {
        descriptionShowElementSvg.setAttribute('stroke-width', '2');
        setStyle(descriptionShowElementSvg, {
          width: '1.3rem',
          height: '1.3rem'
        });
        element.appendChild(descriptionElement);
        iconsElement.appendChild(descriptionShowElement);
        sizeElement.appendChild(iconsElement);
      }
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
      if (offset > maxRequestOffset) return reject(new Error(`Offset is bigger than ${maxRequestOffset}!`));
      if (isCoverEndpoint) getCoverList({
        mangaIds: ids,
        order: {
          volume: 'asc'
        },
        offset: offset,
        limit: requestLimit
      }).then(resolve).catch(reject);else getMangaList({
        ids: ids,
        includes: ['cover_art'],
        contentRating: ['safe', 'suggestive', 'erotica', 'pornographic'],
        offset: offset,
        limit: requestLimit
      }).then(resolve).catch(reject);
    });
  }
});})();
