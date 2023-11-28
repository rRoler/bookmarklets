function newBookmarklet(
	websiteRegex: string | RegExp,
	code: VoidFunction,
): void {
	if (!new RegExp(websiteRegex).test(window.location.hostname))
		return alert('Bookmarklet executed on the wrong website!');
	code();
}

function getMatch(
	string: string,
	regex: RegExp,
	index = 0,
): string | undefined {
	const regexMatches = string.match(regex);
	if (regexMatches && regexMatches[index]) return regexMatches[index];
}

function splitArray(
	array: Array<unknown>,
	chunkSize = 100,
): Array<Array<unknown>> {
	const arrayCopy = [...array];
	const resArray = [];
	while (arrayCopy.length) resArray.push(arrayCopy.splice(0, chunkSize));
	return resArray;
}

function waitForElement(
	querySelectors: string,
	noElement = false,
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

function createSVG(options: {
	svg: { attributes?: Record<string, string>; styles?: Record<string, string> };
	paths: Array<{
		attributes?: Record<string, string>;
		styles?: Record<string, string>;
	}>;
}) {
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

function setStyle(
	element: HTMLElement | SVGElement,
	styles: Record<string, string>,
) {
	for (const style in styles) element.style.setProperty(style, styles[style]);
}

function setAttribute(
	element: HTMLElement | SVGElement,
	attributes: Record<string, string>,
) {
	for (const attribute in attributes)
		element.setAttribute(attribute, attributes[attribute]);
}

function createUrl(
	base: string,
	path = '/',
	query: Record<string, string | number | Array<string>> = {},
) {
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

export {
	newBookmarklet,
	getMatch,
	splitArray,
	waitForElement,
	parseStorage,
	createSVG,
	setStyle,
	setAttribute,
	createUrl,
};
