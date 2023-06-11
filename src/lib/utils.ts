import crimsonTheme from '@skeletonlabs/skeleton/themes/theme-crimson.css?inline';
import goldNouveauTheme from '@skeletonlabs/skeleton/themes/theme-gold-nouveau.css?inline';
import hamlindigoTheme from '@skeletonlabs/skeleton/themes/theme-hamlindigo.css?inline';
import modernTheme from '@skeletonlabs/skeleton/themes/theme-modern.css?inline';
import rocketTheme from '@skeletonlabs/skeleton/themes/theme-rocket.css?inline';
import saharaTheme from '@skeletonlabs/skeleton/themes/theme-sahara.css?inline';
import seafoamTheme from '@skeletonlabs/skeleton/themes/theme-seafoam.css?inline';
import skeletonTheme from '@skeletonlabs/skeleton/themes/theme-skeleton.css?inline';
import vintageTheme from '@skeletonlabs/skeleton/themes/theme-vintage.css?inline';
import Color from 'color';
import { pageThemeStore } from './stores';

const pageThemes: Record<ThemeName, string> = {
	skeleton: skeletonTheme,
	modern: modernTheme,
	rocket: rocketTheme,
	seafoam: seafoamTheme,
	vintage: vintageTheme,
	sahara: saharaTheme,
	hamlindigo: hamlindigoTheme,
	'gold-nouveau': goldNouveauTheme,
	crimson: crimsonTheme,
};

export const themeNames: ThemeName[] = [
	'skeleton',
	'modern',
	'rocket',
	'seafoam',
	'vintage',
	'sahara',
	'hamlindigo',
	'gold-nouveau',
	'crimson',
];

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

export const capitalize = (str?: string) => {
	if (!str) return '';
	return str.charAt(0).toUpperCase() + str.slice(1);
};

export const injectStyles = (styles: string, id: string) => {
	const existing = document.getElementById(id);
	if (existing) existing.remove();
	const style = document.createElement('style');
	style.id = id;
	style.innerHTML = styles;
	document.head.appendChild(style);
};

export const setTheme = (themeName: ThemeName) => {
	const theme = pageThemes[themeName];
	injectStyles(theme, 'main-theme');
	pageThemeStore.set(themeName);
};
