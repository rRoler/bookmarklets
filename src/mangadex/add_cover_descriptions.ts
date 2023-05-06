import * as mangadex from './shared';
import * as BM from '../shared';

mangadex.newBookmarklet(
	async () => {
		const defaultDescription = prompt(
			'Enter a description:',
			'Volume $volume Cover from BookWalker'
		);
		if (!defaultDescription) return;
		const changedDescriptions: Array<HTMLDivElement> = [];
		const elements = Array.from(document.querySelectorAll('div.page-sizer'));
		for (const element of elements) {
			if (
				/blob:https?:\/\/.*mangadex.*\/+[-0-9a-f]{20,}/.test(
					(
						element.querySelector('.page') as HTMLDivElement
					).style.getPropertyValue('background-image')
				)
			) {
				const coverDescription = parseDescription(
					element as HTMLDivElement,
					defaultDescription
				);
				const edit = element.parentElement?.querySelector('.volume-edit');
				edit?.dispatchEvent(new MouseEvent('click'));
				const changed = await setDescription(coverDescription);
				if (changed) changedDescriptions.push(element as HTMLDivElement);
			}
		}
		if (changedDescriptions.length <= 0)
			return alert('No newly added covers with empty descriptions found!');
		console.log('Changed descriptions:', changedDescriptions);

		function parseDescription(
			element: HTMLDivElement,
			description: string
		): string {
			const volumeElement = element.parentElement?.querySelector(
				'.volume-num input'
			) as HTMLInputElement;
			const volume = volumeElement?.value;
			const languageElement = element.parentElement?.querySelector(
				'.md-select .md-select-inner-wrap .placeholder-text'
			) as HTMLDivElement;
			const language = languageElement?.innerText;

			const masks: Record<string, string> = {
				volume: volume || 'No Volume',
				language: language || 'No Language',
				nl: '\n',
			};

			for (const mask in masks) {
				const maskValue = masks[mask];
				if (maskValue) {
					description = description.replaceAll(`$${mask}`, maskValue);
				}
			}
			return description;
		}

		function setDescription(description: string): Promise<boolean> {
			return new Promise((resolve) => {
				const selectors = 'textarea[placeholder="Cover Description"]';
				BM.waitForElement(selectors).then((element) => {
					let changed = true;
					const save =
						element.parentElement?.parentElement?.parentElement?.parentElement?.querySelector(
							'button.primary'
						);
					if (!(element as HTMLTextAreaElement).value)
						(element as HTMLTextAreaElement).value = description;
					else changed = false;
					element.dispatchEvent(new InputEvent('input'));
					save?.dispatchEvent(new MouseEvent('click'));
					BM.waitForNoElement(selectors).then(() => resolve(changed));
				});
			});
		}
	},
	{ titlePage: true, editPage: true, createPage: true }
);
