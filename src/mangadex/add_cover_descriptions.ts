import * as mangadex from './shared';
import * as BM from '../shared';

bookmarklet().catch(console.error);

async function bookmarklet(): Promise<void> {
	if (!mangadex.checkSite()) return;

	const description = prompt('Enter a description:', 'BookWalker');
	if (!description) return;
	const changedDescriptions: Array<HTMLDivElement> = [];
	const elements = Array.from(document.querySelectorAll('div.page-sizer'));
	for (const index in elements) {
		const element = elements[index];

		if (
			/blob:https?:\/\/.*mangadex.*\/+[-0-9a-f]{20,}/.test(
				(
					element.querySelector('.page') as HTMLDivElement
				).style.getPropertyValue('background-image')
			)
		) {
			const edit = element.parentElement?.querySelector('.volume-edit');
			edit?.dispatchEvent(new MouseEvent('click'));
			const changed = await setDescription();
			if (changed) changedDescriptions.push(element as HTMLDivElement);
		}
	}
	if (changedDescriptions.length <= 0)
		return alert('No newly added covers with empty descriptions found!');
	console.log('Changed descriptions:', changedDescriptions);

	function setDescription(): Promise<boolean> {
		return new Promise((resolve) => {
			const selectors = 'textarea[placeholder="Cover Description"]';
			BM.waitForElement(selectors).then((element) => {
				let changed = true;
				const save =
					element.parentElement?.parentElement?.parentElement?.parentElement?.querySelector(
						'button.primary'
					);
				if (!(element as HTMLTextAreaElement).value)
					(element as HTMLTextAreaElement).value = description as string;
				else changed = false;
				element.dispatchEvent(new InputEvent('input'));
				save?.dispatchEvent(new MouseEvent('click'));
				BM.waitForNoElement(selectors).then(() => resolve(changed));
			});
		});
	}
}
