import * as mangadex from './shared';

mangadex.newBookmarklet(
	() => {
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
					.replaceAll(' ', '')
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
		if (deletedCovers.length <= 0)
			return alert('No covers in given language found!');
		console.log('Deleted covers:', deletedCovers);
	},
	{ titlePage: true, editPage: true, createPage: true }
);
