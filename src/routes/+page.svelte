<script lang="ts">
	import { AppShell } from '@skeletonlabs/skeleton';
	import { userStore as user } from '$lib/stores';

	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import Devices from '$lib/components/devices.svelte';
</script>

{#if $user}
	<AppShell slotPageHeader="sticky top-0 z-10">
		<svelte:fragment slot="header">
			<Header />
		</svelte:fragment>
		<div class="relative h-full w-full p-4">
			<Devices />
		</div>
		<svelte:fragment slot="pageFooter">
			<Footer />
		</svelte:fragment>
	</AppShell>
{/if}
