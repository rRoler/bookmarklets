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

function waitForElement(querySelectors: string): Promise<Node> {
	let element = document.body.querySelector(querySelectors);
	return new Promise((resolve) => {
		if (element) return resolve(element);

		const observer = new MutationObserver(() => {
			element = document.body.querySelector(querySelectors);
			if (element) {
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

function waitForNoElement(querySelectors: string): Promise<void> {
	let element = document.body.querySelector(querySelectors);
	return new Promise((resolve) => {
		if (!element) return resolve();

		const observer = new MutationObserver(() => {
			element = document.body.querySelector(querySelectors);
			if (!element) {
				resolve();
				observer.disconnect();
			}
		});

		observer.observe(document.body, {
			childList: true,
			subtree: true,
		});
	});
}

export { getMatch, splitArray, waitForElement, waitForNoElement };
