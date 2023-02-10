class SimpleProgressBar {
	element: HTMLDivElement;
	bar: HTMLDivElement;

	constructor(initialPercentage = 0) {
		const background = document.createElement('div');
		background.style.setProperty('z-index', '1000');
		background.style.setProperty('position', 'fixed');
		background.style.setProperty('bottom', '0');
		background.style.setProperty('left', '0');
		background.style.setProperty('width', '100%');
		background.style.setProperty('height', '24px');
		background.style.setProperty('background-color', '#3c3c3c');
		const progress = document.createElement('div');
		progress.style.setProperty('height', '100%');
		progress.style.setProperty('background-color', '#b5e853');
		progress.style.setProperty('transition', 'width 200ms');
		this.bar = progress;
		this.update(initialPercentage);
		background.appendChild(progress);
		this.element = background;
	}

	update(percentage: number): void {
		const currentPercentageRounded = Math.ceil(
			parseInt(this.bar.style.getPropertyValue('width'))
		);
		const percentageRounded = Math.ceil(percentage);
		if (percentageRounded >= 100) this.removeFromDocument();
		else if (
			currentPercentageRounded !== percentageRounded &&
			percentageRounded >= 0
		)
			this.bar.style.setProperty('width', `${percentageRounded}%`);
	}

	addToDocument = (): HTMLDivElement =>
		document.documentElement.appendChild(this.element);

	removeFromDocument = (): void => this.element.remove();
}

export default SimpleProgressBar;
