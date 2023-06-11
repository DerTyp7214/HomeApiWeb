import Color from 'color';

export const RGBToHEX = ([r, g, b]: [number, number, number]) => {
	return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

export const changeLightnessOfRgb = (rgb: number[], amount: number) => {
	const color = Color.rgb(rgb);
	return color.lightness(amount * 100).hex();
};

export const lerpColor = (a: string, b: string, weight: number) => {
	const colorA = Color(a);
	const colorB = Color(b);
	return colorA.mix(colorB, weight).hexa();
};

export const filePicker = async (accept: string): Promise<File> => {
	return new Promise<File>((resolve, reject) => {
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = accept;
		input.onchange = () => {
			if (!input.files || !input.files[0]) {
				reject(null);
				return;
			}
			resolve(input.files[0]);
		};
		input.oncancel = () => {
			reject(null);
		};
		input.click();
	});
};
