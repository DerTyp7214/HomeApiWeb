import { sveltekit } from '@sveltejs/kit/vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {import('vite').UserConfig} */
const config = {
	resolve: {
		alias: {
			'$lib/*': resolve(__dirname, 'src/lib/*'),
			'$components/*': resolve(__dirname, 'src/lib/components/*'),
			'$stores/*': resolve(__dirname, 'src/lib/stores/*'),
			'$utils/*': resolve(__dirname, 'src/lib/utils/*'),
			'$types/*': resolve(__dirname, 'src/lib/types/*'),
			'$styles/*': resolve(__dirname, 'src/lib/styles/*'),
			'$assets/*': resolve(__dirname, 'src/lib/assets/*'),
			'$routes/*': resolve(__dirname, 'src/routes/*'),
			'$src/*': resolve(__dirname, 'src/*'),
		},
	},
	plugins: [sveltekit()],
};

export default config;
