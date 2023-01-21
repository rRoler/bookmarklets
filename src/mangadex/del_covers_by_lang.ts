import * as mangadex from './shared';

bookmarklet();

function bookmarklet(): void {
	if (!mangadex.checkSite()) return;

	const deleteLanguage = prompt('Language name:', 'Japanese');
	if (!deleteLanguage) return;
	const deletedCovers: Array<HTMLDivElement> = [];
	document.querySelectorAll('div.page-sizer').forEach((element): void => {
		const parent = element.parentElement;
		if (!parent) return;
		const close = parent.querySelector('.close');
		const language = parent.querySelector('.placeholder-text.with-label');
		if (!close || !language) return;
		if (
			deleteLanguage
				.toLowerCase()
				.includes(
					(language as HTMLDivElement).innerText
						.toLowerCase()
						.replaceAll(' ', '')
				)
		) {
			close.dispatchEvent(new MouseEvent('click'));
			deletedCovers.push(element as HTMLDivElement);
		}
	});
	if (deletedCovers.length > 0) console.log('Deleted covers:', deletedCovers);
	else alert('No covers in given language found!');
}
