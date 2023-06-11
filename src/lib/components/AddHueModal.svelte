<script lang="ts">
	export let parent: any;

	import { modalStore } from '@skeletonlabs/skeleton';
	import LoadingButton from './LoadingButton.svelte';
	import {
		addHueBridge,
		deleteHueBridge,
		getHueBridges,
		initHueBridge,
	} from '$lib/api';
	import { bridgeStore } from '$lib/stores';

	let hostname: string = '';
	let autimaticallyInitialize: boolean = false;

	let username: string | undefined;
	let errorMessage: string = '';

	function onFormSubmit() {
		if ($modalStore && $modalStore[0]?.response)
			$modalStore[0].response({
				hostname,
				autimaticallyInitialize,
				username,
			});
	}

	const cBase = 'card p-4 w-modal shadow-xl space-y-4';
	const cHeader = 'text-2xl font-bold';
	const cForm =
		'border border-surface-500 p-4 space-y-4 rounded-container-token';

	async function addBridge(
		hostname: string,
		autimaticallyInitialize: boolean
	): Promise<boolean> {
		errorMessage = '';

		const added = await addHueBridge(hostname).catch((error) => error);

		if (added.id && autimaticallyInitialize) {
			const init = await initHueBridge(added.id).catch(() => false);

			if (init.username) {
				const bridges = await getHueBridges();
				bridgeStore.set(bridges);

				return true;
			} else {
				await deleteHueBridge(added.id);
				errorMessage = init.message;
				return false;
			}
		} else if (added.message) {
			errorMessage = added.message;
			console.log(added.message);
			return false;
		}
		return true;
	}

	async function submit() {
		const added = await addBridge(hostname, autimaticallyInitialize);
		if (added) modalStore.close();
		onFormSubmit();
	}
</script>

{#if $modalStore[0]}
	<div class="modal-example-form {cBase}">
		<header class={cHeader}>{$modalStore[0].title ?? '(title missing)'}</header>
		<article>{$modalStore[0].body ?? '(body missing)'}</article>

		<form class="modal-form {cForm}">
			<input
				class="input p-2 pl-4"
				type="text"
				bind:value={hostname}
				placeholder="Hue Bridge Ip"
				required
			/>
			<label class="flex flex-row items-center space-x-2">
				<input
					class="input ml-2 mr-2 w-auto"
					type="checkbox"
					bind:checked={autimaticallyInitialize}
				/>
				<span>Automatically Initialize</span>
			</label>
			{#if errorMessage}
				<div class="text-red-500">{errorMessage}</div>
			{/if}
		</form>
		<!-- prettier-ignore -->
		<footer class="modal-footer {parent.regionFooter}">
        <button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>{parent.buttonTextCancel}</button>
        <LoadingButton
			disabled={hostname.trim().length === 0}
			buttonClass="btn {parent.buttonPositive}"
			asyncFunction={submit}>
			{parent.buttonTextSubmit ?? 'Submit Form'}
		</LoadingButton>
    </footer>
	</div>
{/if}
