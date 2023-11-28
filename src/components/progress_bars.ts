import BaseComponent, { componentColors } from './base_component';
import * as utils from '../utils';

class SimpleProgressBar extends BaseComponent {
	bar: HTMLDivElement;

	constructor(initialPercentage = 0) {
		super();
		const background = document.createElement('div');
		utils.setStyle(background, {
			'z-index': '1000',
			position: 'fixed',
			bottom: '0',
			left: '0',
			width: '100%',
			height: '24px',
			'background-color': componentColors.accent,
			cursor: 'pointer',
		});
		const progress = document.createElement('div');
		utils.setStyle(progress, {
			height: '100%',
			'background-color': componentColors.primary,
			transition: 'width 200ms',
		});
		this.bar = progress;
		this.update(initialPercentage);
		background.append(progress);
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
			utils.setStyle(this.bar, {
				width: `${percentageRounded}%`,
			});
	}
}

export default SimpleProgressBar;
