<script lang="ts">
	import DeleteIcon from 'svelte-material-icons/DeleteOutline.svelte';
	import AlertIcon from 'svelte-material-icons/AlertCircleOutline.svelte';

	import { fade } from 'svelte/transition';
	import { deleteHueBridge, getHueBridges, initHueBridge } from '$lib/api';
	import LoadingButton from '$lib/components/LoadingButton.svelte';
	import { bridgeStore, userStore as user } from '$lib/stores';
	import { Toast, popup, storePopup, toastStore } from '@skeletonlabs/skeleton';

	let inputValue = '';
	let bridges: HueBridge[] = [];
	let loading = false;
	let bridgeToDelete: HueBridge | undefined;

	$: filteredBridges = bridges.filter((bridge) => {
		if (inputValue.trim() === '') return true;
		if (inputValue.startsWith('ip:')) {
			const ip = inputValue.split(':')[1];
			return ip && bridge.ip.toLowerCase().includes(ip.toLowerCase());
		}
		if (inputValue.startsWith('id:')) {
			const id = inputValue.split(':')[1];
			return id && bridge.id.toLowerCase().includes(id.toLowerCase());
		}
		return (
			bridge.ip.toLowerCase().includes(inputValue.toLowerCase()) ||
			bridge.id.toLowerCase().includes(inputValue.toLowerCase())
		);
	});

	async function loadBridges() {
		if (loading) return;
		loading = true;
		const bridgesResponse = await getHueBridges().catch(() => null);

		if (bridgesResponse) {
			bridges = bridgesResponse;
			bridgeStore.set(bridgesResponse);
		}

		loading = false;
	}

	async function deleteBridge(id?: string) {
		if (loading || !id) return;
		loading = true;
		await deleteHueBridge(id).catch(() => {});
		const bridgesResponse = await getHueBridges().catch(() => null);

		bridgeToDelete = undefined;

		if (bridgesResponse) {
			bridges = bridgesResponse;
			bridgeStore.set(bridgesResponse);
		}

		loading = false;
	}

	async function initBridge(id: string) {
		loading = true;
		const init = await initHueBridge(id).catch((error) => error);

		if (init.username) {
			loading = false;
			await loadBridges();
		} else if (init.message) {
			toastStore.trigger({
				background: 'bg-red-500',
				message: init.message,
			});
		}
		loading = false;
	}

	loadBridges();
</script>

{#if $user}
	<div class="flex h-full w-full flex-col justify-start" id="hue-bridges">
		<input
			type="text"
			class="input w-full max-w-sm p-2 pl-4"
			title="Search"
			placeholder="Search (ip:<ip> or id:<id>)"
			bind:value={inputValue}
		/>
		<div class="table-container mt-4">
			<table class="table-hover table">
				<thead>
					<tr>
						<th>Bridge Id</th>
						<th>Ip</th>
						<th>User Key</th>
						<th />
					</tr>
				</thead>
				<tbody>
					{#each filteredBridges as bridge, i}
						<tr>
							<td>{bridge.id}</td>
							<td>{bridge.ip}</td>
							<td>
								{#if bridge.user}
									{bridge.user}
								{:else}
									<LoadingButton
										buttonClass="bg-primary-500 text-white dark:text-black rounded-full p-2 px-4 transition-colors hover:bg-primary-600 dark:bg-primary-400 dark:hover:bg-primary-300"
										{loading}
										asyncFunction={async () => await initBridge(bridge.id)}
									>
										Initialize
									</LoadingButton>
								{/if}
							</td>
							<td class="h-8 w-8">
								<button
									class="a-icon"
									on:click={() => (bridgeToDelete = bridge)}
								>
									<DeleteIcon size="18px" />
								</button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
{/if}

{#if bridgeToDelete}
	<aside
		class="variant-soft-error alert absolute bottom-8 right-8"
		transition:fade|local={{ duration: 200 }}
	>
		<AlertIcon />

		<div class="alert-message">
			<h3 class="h3">Delete HueBridge</h3>
			<p>Are you sure you want to delete this bridge? ({bridgeToDelete.id})</p>
		</div>
		<div class="alert-actions">
			<LoadingButton
				buttonClass="rounded-full bg-surface-100 p-4 py-2 transition-colors hover:bg-surface-200 dark:bg-surface-900 dark:hover:bg-surface-800"
				asyncFunction={async () => await deleteBridge(bridgeToDelete?.id)}
			>
				Delete
			</LoadingButton>
			<button
				class="rounded-full bg-surface-100 p-4 py-2 transition-colors hover:bg-surface-200 dark:bg-surface-900 dark:hover:bg-surface-800"
				on:click={() => (bridgeToDelete = undefined)}
			>
				Cancel
			</button>
		</div>
	</aside>
{/if}

<Toast />
