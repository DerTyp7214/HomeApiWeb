<script lang="ts">
	import { setLight, setPlug } from '$lib/api';
	import { changeLightnessOfRgb, lerpColor } from '$lib/utils';

	export let device: Light | Plug;

	$: isLight = device.hasOwnProperty('color') ? true : false;

	$: color = device.on
		? isLight
			? (() => {
					const light = device as Light;

					return changeLightnessOfRgb(light.color[0], 0.35);
			  })()
			: 'green'
		: '#000000';

	async function onClick() {
		const { id, on } = device;

		if (isLight) {
			await setLight(id, { on: !on });
		} else {
			await setPlug(id, { on: !on });
		}

		device.on = !on;
	}

	$: lerpFactor = device.on ? 0.8 : 0.25;
</script>

<button
	style="--color: {color}; --color-dark: {lerpColor(
		color,
		'#1d1f24',
		lerpFactor + 0.05
	)}; --color-light: {lerpColor(color, 'white', lerpFactor)}"
	id="smart-device"
	on:click={onClick}
>
	<div
		color="none"
		class="card m-2 h-32 w-32 cursor-pointer border-black transition-transform duration-150 hover:scale-110 dark:border-white"
	>
		<div
			class="flex h-full w-full select-none flex-col items-center justify-center"
		>
			<h5 class="text-lg font-bold">
				{device.name}
			</h5>
			<h5 class="text-lg">
				{device.on ? 'ON' : 'OFF'}
			</h5>
		</div>
	</div>
</button>
