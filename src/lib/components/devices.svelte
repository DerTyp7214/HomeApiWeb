<script lang="ts">
	import SmartDevice from '$lib/components/SmartDevice.svelte';
	import { connectWebSocket, getLights, getPlugs } from '$lib/api';
	import { lightsStore, plugsStore } from '$lib/stores';
	import LoadingButton from './LoadingButton.svelte';

	let lights: { [key: string]: Light } = {};
	let plugs: { [key: string]: Plug } = {};

	$: {
		if ($lightsStore) {
			lights = {};
			$lightsStore.forEach((light: Light) => {
				lights[light.id] = light;
			});
		}
	}

	$: {
		if ($plugsStore) {
			plugs = {};
			$plugsStore.forEach((plug: Plug) => {
				plugs[plug.id] = plug;
			});
		}
	}

	const ws = connectWebSocket();

	ws.addEventListener('message', (event) => {
		const { type, data } = JSON.parse(event.data);

		if (!data) {
			loadDevices();
			return;
		}

		switch (type) {
			case 'light':
				lights[data.id] = data;
				break;
			case 'plug':
				plugs[data.id] = data;
				break;
		}
	});

	async function loadDevices() {
		const [lights, plugs] = await Promise.all([getLights(), getPlugs()]).catch(
			() => [[], []]
		);
		lightsStore.set(lights);
		plugsStore.set(plugs);
	}

	loadDevices();
</script>

<div class="flex justify-between">
	<div class="flex space-x-2">
		<LoadingButton
			asyncFunction={loadDevices}
			buttonClass="bg-secondary-500 p-2 rounded-lg"
			>Reload
		</LoadingButton>
	</div>
</div>
<h1 class="mt-5 text-2xl font-bold">Lights</h1>
<div class="mt-3 inline-flex flex-wrap justify-start">
	{#each Object.entries(lights) as [_, light]}
		<SmartDevice device={light} />
	{/each}
</div>

<h1 class="mt-5 text-2xl font-bold">Plugs</h1>
<div class="mt-3 inline-flex justify-around">
	{#each Object.entries(plugs) as [_, plug]}
		<SmartDevice device={plug} />
	{/each}
</div>
