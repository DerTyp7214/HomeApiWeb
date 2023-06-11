<script lang="ts">
	import DrawerIcon from 'svelte-material-icons/Menu.svelte';
	import { drawerStore, type DrawerSettings } from '@skeletonlabs/skeleton';
	import { capitalize } from '$lib/utils';

	export let currentPage: string | undefined;

	export const drawerSettings: DrawerSettings = {
		id: 'settings-drawer',
		bgDrawer: 'bg-primary-50-900-token text-primary-900-50-token',
		bgBackdrop: 'bg-gradient',
		width: 'w-[280px] md:w-[480px]',
		padding: 'p-4',
		rounded: 'rounded-xl',
	};

	let contentWrapper: HTMLDivElement;

	$: {
		if (contentWrapper) {
			for (const page of contentWrapper.children) {
				if (page.id === currentPage) {
					page.classList.remove('hidden');
				} else {
					page.classList.add('hidden');
				}
			}
		}
	}
</script>

<header class="card-header flex flex-row items-center">
	<button class="a-icon" on:click={() => drawerStore.open(drawerSettings)}>
		<DrawerIcon class="h-5 w-5" />
	</button>
	<h3 class="h3 ml-2">{capitalize(currentPage)}</h3>
</header>

<section class="p-4">
	<div bind:this={contentWrapper}>
		<slot />
	</div>
</section>
