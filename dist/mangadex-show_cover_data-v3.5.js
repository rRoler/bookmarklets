/*!
 * Licensed under MIT: https://github.com/rRoler/bookmarklets/raw/main/LICENSE
 * Third party licenses: https://github.com/rRoler/bookmarklets/raw/main/dist/mangadex-show_cover_data-v3.5.dependencies.txt
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
function splitArray(array) {
  let chunkSize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 100;
  const arrayCopy = [...array];
  const resArray = [];
  while (arrayCopy.length) resArray.push(arrayCopy.splice(0, chunkSize));
  return resArray;
}
function createSVG(options) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  if (options.svg.attributes) setAttribute(svg, options.svg.attributes);
  if (options.svg.styles) setStyle(svg, options.svg.styles);
  for (const pathOptions of options.paths) {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    if (pathOptions.attributes) setAttribute(path, pathOptions.attributes);
    if (pathOptions.styles) setStyle(path, pathOptions.styles);
    svg.append(path);
  }
  return svg;
}
function setStyle(element, styles) {
  for (const style in styles) element.style.setProperty(style, styles[style]);
}
function setAttribute(element, attributes) {
  for (const attribute in attributes) element.setAttribute(attribute, attributes[attribute]);
}
function createUrl$1(base) {
  let path = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '/';
  let query = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
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
function getMangaList(_ref) {
  let {
    ids,
    includes = [],
    contentRating = [],
    offset = 0,
    limit = 100
  } = _ref;
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
function getCoverList(_ref2) {
  let {
    mangaIds,
    order = {},
    includes = [],
    offset = 0,
    limit = 100
  } = _ref2;
  return new Promise((resolve, reject) => {
    const query = {
      offset: offset,
      limit: limit,
      'manga[]': mangaIds,
      'includes[]': includes
    };
    if (order?.volume) query['order[volume]'] = order.volume;
    fetch(createUrl('/cover', query)).then(rsp => resolve(rsp.json())).catch(reject);
  });
}

let componentColors = {
  text: '#000',
  primary: '#b5e853',
  background: '#fff',
  accent: '#3c3c3c'
};
function setComponentColors(colors) {
  componentColors = {
    ...componentColors,
    ...colors
  };
}
class BaseComponent {
  constructor() {
    this.element = document.createElement('div');
  }
  add = () => document.body.appendChild(this.element);
  remove = () => this.element.remove();
}

const mdComponentColors = {
  color: 'rgb(var(--md-color))',
  primary: 'rgb(var(--md-primary))',
  background: 'rgb(var(--md-background))',
  accent: 'rgb(var(--md-accent))',
  accent20: 'rgb(var(--md-accent-20))'
};
const useComponents = () => setComponentColors({
  text: mdComponentColors.color,
  primary: mdComponentColors.primary,
  background: mdComponentColors.background,
  accent: mdComponentColors.accent
});
const roleColors = {
  ROLE_BANNED: 'rgb(0, 0, 0)',
  ROLE_ADMIN: 'rgb(155, 89, 182)',
  ROLE_DEVELOPER: 'rgb(255, 110, 233)',
  ROLE_DESIGNER: 'rgb(254, 110, 171)',
  ROLE_GLOBAL_MODERATOR: 'rgb(233, 30, 99)',
  ROLE_FORUM_MODERATOR: 'rgb(233, 30, 99)',
  ROLE_PUBLIC_RELATIONS: 'rgb(230, 126, 34)',
  ROLE_STAFF: 'rgb(233, 30, 99)',
  ROLE_VIP: 'rgb(241, 196, 15)',
  ROLE_POWER_UPLOADER: 'rgb(46, 204, 113)',
  ROLE_CONTRIBUTOR: 'rgb(32, 102, 148)',
  ROLE_GROUP_LEADER: 'rgb(52, 152, 219)',
  ROLE_MD_AT_HOME: 'rgb(26, 121, 57)',
  ROLE_GROUP_MEMBER: 'rgb(250, 250, 250)',
  ROLE_MEMBER: 'rgb(250, 250, 250)',
  ROLE_USER: 'rgb(250, 250, 250)',
  ROLE_GUEST: 'rgb(250, 250, 250)',
  ROLE_UNVERIFIED: 'rgb(250, 250, 250)'
};
const getUserRoleColor = roles => {
  for (const role in roleColors) {
    if (roles.includes(role)) return roleColors[role];
  }
  return roleColors.ROLE_USER;
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

var name = "heroicons";

console.debug(name, 'included');
const outlineIconOptions = {
  svg: {
    attributes: {
      fill: 'none',
      viewBox: '0 0 24 24',
      'stroke-width': '1.5',
      stroke: 'currentColor'
    },
    styles: {
      width: '1.5rem',
      height: '1.5rem'
    }
  },
  paths: [{
    attributes: {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round'
    }
  }]
};
const miniIconOptions = {
  svg: {
    attributes: {
      fill: 'currentColor',
      viewBox: '0 0 20 20'
    },
    styles: {
      width: '1.25rem',
      height: '1.25rem'
    }
  },
  paths: [{
    attributes: {
      'fill-rule': 'evenodd',
      'clip-rule': 'evenodd'
    }
  }]
};

/***
 * <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
 *   <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
 * </svg>
 **/
const informationCircleOutline = () => {
  const options = outlineIconOptions;
  options.paths[0].attributes.d = 'M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z';
  return createSVG(options);
};

/***
 * <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
 *   <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clip-rule="evenodd" />
 * </svg>
 **/
const informationCircleMini = () => {
  const options = miniIconOptions;
  options.paths[0].attributes.d = 'M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z';
  return createSVG(options);
};

class SimpleProgressBar extends BaseComponent {
  constructor() {
    let initialPercentage = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    super();
    const background = document.createElement('div');
    setStyle(background, {
      'z-index': '1000',
      position: 'fixed',
      bottom: '0',
      left: '0',
      width: '100%',
      height: '24px',
      'background-color': componentColors.accent,
      cursor: 'pointer'
    });
    const progress = document.createElement('div');
    setStyle(progress, {
      height: '100%',
      'background-color': componentColors.primary,
      transition: 'width 200ms'
    });
    this.bar = progress;
    this.update(initialPercentage);
    background.append(progress);
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
  useComponents();
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
    if (!/\/covers\/+[-0-9a-f]{20,}\/+[-0-9a-f]{20,}[^/]+(?:[?#].*)?$/.test(imageSource) || element.classList.contains('banner-image') || element.parentElement?.classList.contains('banner-bg')) return;
    const mangaId = getMatch(imageSource, /[-0-9a-f]{20,}/);
    const coverFileName = getMatch(imageSource, /([-0-9a-f]{20,}\.[^/.]*)\.[0-9]+\.[^/.?#]*([?#].*)?$/, 1) || getMatch(imageSource, /[-0-9a-f]{20,}\.[^/.]*?$/);
    if (!mangaId || !coverFileName) return;
    const addCoverFileName = fileNames => {
      fileNames.has(mangaId) ? fileNames.get(mangaId)?.add(coverFileName) : fileNames.set(mangaId, new Set([coverFileName]));
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
    const skippedCoversSize = skippedCoverFileNames.get(mangaId)?.size || 0;
    if (fileNames.size + skippedCoversSize > 1 || pageInfo.titleId) mangaIdsForQuery.cover.push(mangaId);else mangaIdsForQuery.manga.push(mangaId);
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
    document.body.append(coverImagesContainer);
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
      coverImagesContainer.append(fullSizeImage);
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
    const showAllInformation = function (event) {
      let show = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      const showInformation = element => setStyle(element, {
        display: show ? 'flex' : 'none'
      });
      event.stopPropagation();
      event.preventDefault();
      if (event.shiftKey) document.querySelectorAll('.cover-data-bookmarklet-information').forEach(element => showInformation(element));else showInformation(informationElement);
    };
    const user = cover.relationships.find(relationship => relationship.type === 'user' && relationship.id !== 'f8cc4f8a-e596-4618-ab05-ef6572980bbf');
    const information = {
      size: `${fullSizeImageWidth}x${fullSizeImageHeight}`,
      version: `Version ${cover.attributes.version}`,
      description: cover.attributes.description || undefined,
      createdAt: `Created at ${new Date(cover.attributes.createdAt).toLocaleString('en-US', {
        hour12: false
      })}`,
      updatedAt: `Updated at ${new Date(cover.attributes.updatedAt).toLocaleString('en-US', {
        hour12: false
      })}`,
      user: user?.attributes?.username,
      id: `Cover ID ${cover.id}`
    };
    const informationShowElement = document.createElement('span');
    setStyle(informationShowElement, {
      position: 'absolute',
      top: '0',
      'z-index': '1'
    });
    const informationShowElementContent = document.createElement('span');
    setStyle(informationShowElementContent, {
      width: 'fit-content',
      display: 'flex',
      gap: '0.1rem',
      'align-items': 'center'
    });
    informationShowElementContent.addEventListener('click', showAllInformation);
    informationShowElement.append(informationShowElementContent);
    const informationShowElementText = document.createElement('span');
    informationShowElementText.innerText = information.size;
    setStyle(informationShowElementText, {
      'padding-top': '1px'
    });
    informationShowElementContent.append(informationShowElementText);
    const informationElement = document.createElement('span');
    informationElement.classList.add('cover-data-bookmarklet-information');
    setStyle(informationElement, {
      display: 'none',
      position: 'absolute',
      width: '100%',
      height: '100%',
      padding: '0.4rem',
      gap: '0.2rem',
      overflow: 'auto',
      'flex-wrap': 'wrap',
      'align-content': 'baseline',
      'background-color': mdComponentColors.accent,
      'z-index': '2'
    });
    informationElement.addEventListener('click', e => showAllInformation(e, false));
    const informationItemElements = {};
    for (const info in information) {
      const value = information[info];
      if (!value) {
        delete information[info];
        continue;
      }
      informationItemElements[info] = document.createElement('small');
      informationItemElements[info].innerText = value;
      informationItemElements[info].setAttribute('title', value);
      setStyle(informationItemElements[info], {
        height: 'fit-content',
        'max-width': '100%',
        'flex-grow': '1',
        'text-align': 'center',
        'background-color': mdComponentColors.accent20,
        padding: '0.2rem 0.4rem',
        'border-radius': '0.25rem'
      });
      informationElement.append(informationItemElements[info]);
    }
    informationShowElementContent.setAttribute('title', Object.values(information).join('\n'));
    if (informationItemElements.description) {
      setStyle(informationItemElements.description, {
        width: '100%',
        border: `1px solid ${mdComponentColors.primary}`
      });
    }
    if (informationItemElements.user) {
      const roleColor = getUserRoleColor(user.attributes.roles);
      setStyle(informationItemElements.user, {
        width: '100%',
        color: roleColor,
        border: `1px solid ${roleColor}`,
        'background-color': roleColor.replace(')', ',0.1)')
      });
      informationItemElements.user.addEventListener('click', event => {
        event.stopPropagation();
        event.preventDefault();
        window.open(`/user/${user.id}`, '_blank');
      });
    }
    informationItemElements.id.innerText = 'Copy Cover ID';
    informationItemElements.id.addEventListener('click', event => {
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
    if (element instanceof HTMLImageElement) {
      setStyle(informationShowElement, {
        padding: '0.2rem 0.4rem 0.5rem',
        color: '#fff',
        left: '0',
        width: '100%',
        background: 'linear-gradient(0deg,transparent,rgba(0,0,0,0.8))',
        'border-top-right-radius': '0.25rem',
        'border-top-left-radius': '0.25rem'
      });
      if (information.description) informationShowElementContent.append(informationCircleOutline());
      setStyle(informationElement, {
        'border-radius': '0.25rem'
      });
      element.parentElement?.append(informationShowElement, informationElement);
    } else {
      setStyle(informationShowElement, {
        padding: '0 0.2rem',
        'background-color': mdComponentColors.accent,
        'border-bottom-left-radius': '4px',
        'border-bottom-right-radius': '4px'
      });
      setStyle(informationShowElementText, {
        'max-height': '1.5rem'
      });
      if (information.description) informationShowElementContent.append(informationCircleMini());
      element.append(informationShowElement, informationElement);
    }
  }
  function getAllCoverData() {
    const covers = [];
    async function awaitAllCoverData() {
      for (const endpoint in mangaIdsForQuery) {
        const isCoverEndpoint = endpoint === 'cover';
        const mangaIdsForQuerySplit = splitArray(mangaIdsForQuery[endpoint]);
        for (const ids of mangaIdsForQuerySplit) {
          const rsp = await getCoverData(ids, isCoverEndpoint);
          if (isCoverEndpoint) {
            covers.push(...rsp.data);
            for (let i = rsp.limit; i < rsp.total; i += rsp.limit) {
              const rsp = await getCoverData(ids, isCoverEndpoint, i);
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
    return new Promise((resolve, reject) => awaitAllCoverData().then(resolve).catch(reject));
  }
  function getCoverData(ids, isCoverEndpoint) {
    let offset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    return new Promise((resolve, reject) => {
      if (offset > maxRequestOffset) return reject(new Error(`Offset is bigger than ${maxRequestOffset}!`));
      if (isCoverEndpoint) getCoverList({
        mangaIds: ids,
        order: {
          volume: 'asc'
        },
        includes: ['user'],
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
