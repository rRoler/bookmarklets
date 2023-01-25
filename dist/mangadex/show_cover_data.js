/*!
 * Licensed under MIT: https://raw.githubusercontent.com/rRoler/Bookmarklets/main/LICENSE
 * Third party licenses: https://raw.githubusercontent.com/rRoler/Bookmarklets/main/dist/mangadex/show_cover_data.dependencies.txt
 */

void function(){const checkSite = () => /mangadex\..*/.test(window.location.hostname);

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

bookmarklet();
function bookmarklet() {
  if (!checkSite()) return;
  const requestLimit = 100;
  const maxRequestOffset = 1000;
  const coverElements = [];
  const coverFileNames = {};
  const mangaIdsForQuery = {
    manga: [],
    cover: []
  };
  document.querySelectorAll('img, div').forEach(element => {
    const imageSource = element.src || element.style.getPropertyValue('background-image');
    if (!/\/covers\/+[-0-9a-f]{20,}\/+[-0-9a-f]{20,}[^/]+(?:[?#].*)?$/.test(imageSource)) return;
    const mangaId = getMatch(imageSource, /[-0-9a-f]{20,}/);
    const coverFileName = getMatch(imageSource, /([-0-9a-f]{20,}\.[^/.]*)\.[0-9]+\.[^/.?#]*([?#].*)?$/, 1);
    if (!mangaId || !coverFileName) return;
    coverElements.push(element);
    if (!coverFileNames[mangaId]) coverFileNames[mangaId] = [];
    if (!coverFileNames[mangaId].includes(coverFileName)) coverFileNames[mangaId].push(coverFileName);
  });
  if (Object.keys(coverFileNames).length <= 0) return alert('No covers found on this page!');
  for (const manga in coverFileNames) {
    if (coverFileNames[manga].length > 1) mangaIdsForQuery.cover.push(manga);else mangaIdsForQuery.manga.push(manga);
  }
  getAllCoverData().then(covers => {
    coverElements.forEach(element => {
      const imageSource = element.src || element.style.getPropertyValue('background-image');
      covers.forEach(cover => {
        const coverManga = cover.relationships.find(relationship => relationship.type === 'manga');
        if (!coverManga) return;
        if (new RegExp(`${coverManga.id}/${cover.attributes.fileName}`).test(imageSource)) {
          const fullSizeImage = new Image();
          fullSizeImage.src = `https://mangadex.org/covers/${coverManga.id}/${cover.attributes.fileName}`;
          fullSizeImage.onload = () => {
            const descriptionShowElement = document.createElement('span');
            const descriptionElement = document.createElement('span');
            if (cover.attributes.description) {
              descriptionShowElement.setAttribute('title', cover.attributes.description);
              descriptionShowElement.style.setProperty('position', 'absolute');
              descriptionShowElement.addEventListener('click', e => {
                e.stopPropagation();
                e.preventDefault();
                descriptionElement.style.setProperty('display', descriptionElement.style.getPropertyValue('display') !== 'flex' ? 'flex' : 'none');
              });
              const descriptionShowElementSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
              descriptionShowElementSvg.setAttribute('fill', 'none');
              descriptionShowElementSvg.setAttribute('viewBox', '0 0 24 24');
              descriptionShowElementSvg.setAttribute('stroke-width', '1.5');
              descriptionShowElementSvg.setAttribute('stroke', 'currentColor');
              descriptionShowElementSvg.style.setProperty('width', '1.5rem');
              descriptionShowElementSvg.style.setProperty('height', '1.5rem');
              const descriptionShowElementPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
              descriptionShowElementPath.setAttribute('stroke-linecap', 'round');
              descriptionShowElementPath.setAttribute('stroke-linejoin', 'round');
              descriptionShowElementPath.setAttribute('d', 'M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z');
              descriptionShowElementSvg.appendChild(descriptionShowElementPath);
              descriptionShowElement.appendChild(descriptionShowElementSvg);
              const descriptionTextElement = document.createElement('span');
              descriptionTextElement.innerText = cover.attributes.description;
              descriptionTextElement.style.setProperty('margin', '1rem');
              descriptionTextElement.style.setProperty('text-align', 'center');
              descriptionElement.style.setProperty('position', 'absolute');
              descriptionElement.style.setProperty('width', '100%');
              descriptionElement.style.setProperty('height', '100%');
              descriptionElement.style.setProperty('overflow-y', 'auto');
              descriptionElement.style.setProperty('display', 'none');
              descriptionElement.style.setProperty('align-items', 'center');
              descriptionElement.style.setProperty('justify-content', 'center');
              descriptionElement.style.setProperty('background-color', 'var(--md-accent)');
              descriptionElement.appendChild(descriptionTextElement);
            }
            const sizeElement = document.createElement('span');
            const coverSize = `${fullSizeImage.width}x${fullSizeImage.height}`;
            sizeElement.innerText = coverSize;
            sizeElement.setAttribute('title', coverSize);
            sizeElement.style.setProperty('position', 'absolute');
            sizeElement.style.setProperty('top', '0');
            if (element instanceof HTMLImageElement) {
              descriptionShowElement.style.setProperty('top', '0');
              descriptionShowElement.style.setProperty('right', '0');
              descriptionShowElement.style.setProperty('padding', '0.5rem 0.5rem 1rem');
              sizeElement.style.setProperty('padding', '0.5rem 0.5rem 1rem');
              sizeElement.style.setProperty('color', '#fff');
              sizeElement.style.setProperty('left', '0');
              sizeElement.style.setProperty('width', '100%');
              sizeElement.style.setProperty('background', 'linear-gradient(0deg,transparent,rgba(0,0,0,0.8))');
              if (!element.parentElement) return;
              element.parentElement.appendChild(sizeElement);
              if (cover.attributes.description) element.parentElement.append(descriptionElement, descriptionShowElement);
              return;
            }
            descriptionShowElement.style.setProperty('bottom', '0');
            descriptionShowElement.style.setProperty('padding', '0.2rem 0.4rem');
            descriptionShowElement.style.setProperty('background-color', 'var(--md-accent)');
            descriptionShowElement.style.setProperty('border-top-left-radius', '4px');
            descriptionShowElement.style.setProperty('border-top-right-radius', '4px');
            sizeElement.style.setProperty('padding', '0 0.4rem 0.1rem');
            sizeElement.style.setProperty('background-color', 'var(--md-accent)');
            sizeElement.style.setProperty('border-bottom-left-radius', '4px');
            sizeElement.style.setProperty('border-bottom-right-radius', '4px');
            element.appendChild(sizeElement);
            if (cover.attributes.description) element.append(descriptionElement, descriptionShowElement);
          };
        }
      });
    });
  }).catch(e => {
    console.error(e);
    alert('Failed to fetch cover data!');
  });
  function getAllCoverData() {
    const covers = [];
    async function awaitAllCoverData() {
      for (const endpoint in mangaIdsForQuery) {
        const isCoverEndpoint = endpoint === 'cover';
        const mangaIdsForQuerySplit = splitArray(mangaIdsForQuery[endpoint]);
        for (const index in mangaIdsForQuerySplit) {
          const ids = mangaIdsForQuerySplit[index];
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
      fetch(url).then(rsp => {
        resolve(rsp.json());
      }).catch(reject);
    });
  }
}}();
