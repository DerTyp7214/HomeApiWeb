<script lang="ts">
	import PlusIcon from 'svelte-material-icons/Plus.svelte';
	import RefreshIcon from 'svelte-material-icons/Refresh.svelte';

	import SmartDevice from '$lib/components/SmartDevice.svelte';
	import { connectWebSocket, getLights, getPlugs } from '$lib/api';
	import { bridgeStore, lightsStore, plugsStore } from '$lib/stores';
	import LoadingButton from './LoadingButton.svelte';
	import {
		ListBox,
		ListBoxItem,
		popup,
		type ModalSettings,
		type PopupSettings,
		modalStore,
		Modal,
		type ModalComponent,
	} from '@skeletonlabs/skeleton';
	import AddHueModal from './AddHueModal.svelte';

	let comboboxValue: string = '';
	let errorMessage: string = '';

	$: {
		if (comboboxValue.length > 0) comboboxValue = '';
	}

	let lights: { [key: string]: Light } = {};
	let plugs: { [key: string]: Plug } = {};

	lightsStore.subscribe((value) => {
		lights = {};
		value.forEach((light: Light) => {
			lights[light.id] = light;
		});
	});
	plugsStore.subscribe((value) => {
		plugs = {};
		value.forEach((plug: Plug) => {
			plugs[plug.id] = plug;
		});
	});
	bridgeStore.subscribe(() => {
		loadDevices();
	});

	const popupCombobox: PopupSettings = {
		event: 'focus-click',
		target: 'popupCombobox',
		placement: 'top',
		closeQuery: '.listbox-item',
	};

	const modalComponentRegistry: Record<string, ModalComponent> = {
		addHueModal: { ref: AddHueModal },
	};

	const modal: ModalSettings = {
		type: 'component',
		title: 'Add Bridge',
		body: '',
		buttonTextSubmit: 'Add',
		value: { errorMessage },
		component: 'addHueModal',
	};

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

<LoadingButton
	class="fab absolute right-8 top-8 !p-3"
	asyncFunction={loadDevices}
>
	<RefreshIcon size="18px" />
</LoadingButton>

<button class="fab absolute bottom-8 right-8" use:popup={popupCombobox}>
	<PlusIcon size="24px" />
</button>

<div class="card w-48 py-2 shadow-xl overflow-hidden" data-popup="popupCombobox">
	<ListBox rounded="rounded-none">
		<!--<ListBoxItem bind:group={comboboxValue} name="medium" value="wled">
			W-Led
		</ListBoxItem>-->
		<ListBoxItem
			bind:group={comboboxValue}
			name="medium"
			value="hue-bridge"
			on:click={() => modalStore.trigger(modal)}
		>
			Hue Bridge
		</ListBoxItem>
	</ListBox>
	<div class="arrow bg-surface-100-800-token" />
</div>

<Modal components={modalComponentRegistry} />
