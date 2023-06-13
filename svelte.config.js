import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [
		preprocess({
			postcss: true,
		}),
	],
	kit: {
		appDir: 'app',
		paths: {
			base: '/static',
			relative: false,
		},
		adapter: adapter({
			pages: 'dist',
			assets: 'dist',
		}),
	},
};

export default config;
