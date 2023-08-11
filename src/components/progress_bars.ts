import * as BM from '../shared';

class SimpleProgressBar {
	element: HTMLDivElement;
	bar: HTMLDivElement;

	constructor(initialPercentage = 0) {
		const background = document.createElement('div');
		BM.setStyle(background, {
			'z-index': '1000',
			position: 'fixed',
			bottom: '0',
			left: '0',
			width: '100%',
			height: '24px',
			'background-color': '#3c3c3c',
			cursor: 'pointer',
		});
		const progress = document.createElement('div');
		BM.setStyle(progress, {
			height: '100%',
			'background-color': '#b5e853',
			transition: 'width 200ms',
		});
		this.bar = progress;
		this.update(initialPercentage);
		background.appendChild(progress);
		background.addEventListener('click', this.remove);
		this.element = background;
	}

	update(percentage: number): void {
		const currentPercentageRounded = Math.ceil(
			parseInt(this.bar.style.getPropertyValue('width')),
		);
		const percentageRounded = Math.ceil(percentage);
		if (percentageRounded >= 100) this.remove();
		else if (
			currentPercentageRounded !== percentageRounded &&
			percentageRounded >= 0
		)
			BM.setStyle(this.bar, {
				width: `${percentageRounded}%`,
			});
	}

	add = (): HTMLDivElement => document.body.appendChild(this.element);

	remove = (): void => this.element.remove();
}

export default SimpleProgressBar;
