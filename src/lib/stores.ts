import { localStorageStore } from '@skeletonlabs/skeleton';
import { writable, type Writable } from 'svelte/store';

export const userStore: Writable<User | undefined> = writable(undefined);
export const lightsStore: Writable<Light[]> = localStorageStore('lights', []);
export const plugsStore: Writable<Plug[]> = localStorageStore('plugs', []);
export const bridgeStore: Writable<HueBridge[]> = localStorageStore(
	'bridges',
	[]
);

export const pageThemeStore: Writable<ThemeName> = localStorageStore(
	'pageTheme',
	'skeleton'
);
