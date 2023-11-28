let componentColors = {
	text: '#000',
	primary: '#b5e853',
	background: '#fff',
	accent: '#3c3c3c',
};

function setComponentColors(colors: {
	text?: string;
	primary?: string;
	background?: string;
	accent?: string;
}) {
	componentColors = {
		...componentColors,
		...colors,
	};
}

class BaseComponent {
	element: HTMLElement | SVGElement;

	constructor() {
		this.element = document.createElement('div');
	}

	add = () => document.body.appendChild(this.element);

	remove = (): void => this.element.remove();
}

export { BaseComponent as default, componentColors, setComponentColors };
