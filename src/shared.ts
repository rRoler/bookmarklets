function saveAs(file: string | Blob, filename: string): void {
	const isBlob = typeof file === 'object';
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
	const asinMatches = string.match(regex);
	if (!asinMatches || !asinMatches[index]) return undefined;
	return asinMatches[index];
}

export { saveAs, getMatch };
