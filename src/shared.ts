function saveAs(file: string | Blob, filename: string): void {
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

export { saveAs, getMatch, splitArray };
