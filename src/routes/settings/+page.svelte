<script lang="ts">
	import {
		AppShell,
		drawerStore,
		Drawer,
		type DrawerSettings,
	} from '@skeletonlabs/skeleton';
	import { userStore as user } from '$lib/stores';

	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import Navigator from '$lib/components/Navigator.svelte';

	const pages = ['General', 'Security', 'Account', 'About', 'yeet'];

	let currentPage = window.location.hash.replace('#', '');
	currentPage =
		currentPage === '' ? pages[0]?.toLowerCase() ?? '' : currentPage;

	$: positionClasses = $drawerStore.open ? 'translate-x-[20%]' : '';

	let drawerSettings: DrawerSettings;
</script>

{#if $user}
	<Drawer {...drawerSettings}>
		<div class="flex flex-col">
			<h1 class="my-2 w-full text-center text-2xl font-bold">Settings</h1>
			{#each pages as page}
				<button
					class="my-1 ml-2 mr-2 rounded-full py-2 pl-5 text-left transition-colors {currentPage ===
					page.toLowerCase()
						? 'bg-primary-500'
						: 'hover:bg-primary-500/50'}"
					on:click={() => {
						window.location.hash = page.toLowerCase();
						currentPage = page.toLowerCase();
						drawerStore.close();
					}}
				>
					{page}
				</button>
			{/each}
		</div>
	</Drawer>
	<AppShell
		slotPageHeader="sticky top-0 z-10"
		class="transition-transform {positionClasses}"
	>
		<svelte:fragment slot="header">
			<Header title="Settings" homeBtn backIfAvailable />
		</svelte:fragment>
		<div class="h-full w-full p-4">
			<div
				class="card relative h-full w-full !bg-surface-200/50 dark:!bg-surface-800/50"
			>
				<Navigator {currentPage} bind:drawerSettings>
					<div id="general">
						<h1 class="text-2xl font-bold">General</h1>
						<p class="text-lg">General settings</p>
					</div>
					<div id="security">
						<h1 class="text-2xl font-bold">Security</h1>
						<p class="text-lg">Security settings</p>
					</div>
					<div id="account">
						<h1 class="text-2xl font-bold">Account</h1>
						<p class="text-lg">Account settings</p>
					</div>
					<div id="about">
						<h1 class="text-2xl font-bold">About</h1>
						<p class="text-lg">About settings</p>
					</div>
					<div id="yeet">
						<h1 class="text-2xl font-bold">Yeet</h1>
						<p class="text-lg">Yeet settings</p>
					</div>
				</Navigator>
			</div>
		</div>
		<svelte:fragment slot="pageFooter">
			<Footer />
		</svelte:fragment>
	</AppShell>
{/if}
