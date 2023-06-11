<script lang="ts">
	import DrawerIcon from 'svelte-material-icons/Menu.svelte';
	import { drawerStore, type DrawerSettings } from '@skeletonlabs/skeleton';

	export let currentPage: string | undefined;

	export const drawerSettings: DrawerSettings = {
		id: 'settings-drawer',
		bgDrawer: 'bg-purple-900 text-white',
		bgBackdrop:
			'bg-gradient-to-tr from-indigo-500/50 via-purple-500/50 to-pink-500/50',
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

<header class="card-header">
	<button class="a-icon" on:click={() => drawerStore.open(drawerSettings)}>
		<DrawerIcon class="h-5 w-5" />
	</button>
</header>

<section class="p-4">
	<div bind:this={contentWrapper}>
		<slot />
	</div>
</section>
