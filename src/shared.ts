function newBookmarklet(
	websiteRegex: string | RegExp,
	code: VoidFunction
): void {
	if (!new RegExp(websiteRegex).test(window.location.hostname))
		return alert('Bookmarklet executed on a wrong website!');
	code();
}

function getMatch(
	string: string,
	regex: RegExp,
	index = 0
): string | undefined {
	const regexMatches = string.match(regex);
	if (regexMatches && regexMatches[index]) return regexMatches[index];
}

function splitArray(
	array: Array<unknown>,
	chunkSize = 100
): Array<Array<unknown>> {
	const arrayCopy = [...array];
	const resArray = [];
	while (arrayCopy.length) resArray.push(arrayCopy.splice(0, chunkSize));
	return resArray;
}

function waitForElement(
	querySelectors: string,
	noElement = false
): Promise<Element | null> {
	let element = document.body.querySelector(querySelectors);
	return new Promise((resolve) => {
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
			subtree: true,
		});
	});
}

function parseStorage(key: string) {
	const value = localStorage.getItem(key);
	if (value) return JSON.parse(value);
}

function createSVG({
	fill = 'none',
	viewBox = '0 0 24 24',
	stroke = 'currentColor',
	strokeLinecap = 'round',
	strokeLinejoin = 'round',
	d = '',
}) {
	const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
	svg.setAttribute('fill', fill);
	svg.setAttribute('viewBox', viewBox);
	svg.setAttribute('stroke', stroke);
	const svgPath = document.createElementNS(
		'http://www.w3.org/2000/svg',
		'path'
	);
	svgPath.setAttribute('stroke-linecap', strokeLinecap);
	svgPath.setAttribute('stroke-linejoin', strokeLinejoin);
	svgPath.setAttribute('d', d);
	svg.appendChild(svgPath);
	return svg;
}

export {
	newBookmarklet,
	getMatch,
	splitArray,
	waitForElement,
	parseStorage,
	createSVG,
};
