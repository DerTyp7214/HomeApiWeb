<script lang="ts">
	import { ProgressRadial } from '@skeletonlabs/skeleton';
	import type { HTMLButtonAttributes } from 'svelte/elements/index';

	export let asyncFunction: (event: Event) => Promise<any> = async () => {};
	export let id: string | undefined = undefined;
	export let disabled: boolean = false;
	export let loading: boolean = false;
	export let color: ElementColor = 'primary';
	export let type: HTMLButtonAttributes['type'] = 'button';

	let buttonClass = $$props.class;

	async function run(event: Event) {
		loading = true;
		await asyncFunction?.(event).catch(() => null);
		loading = false;
	}
</script>

<button
	{id}
	{color}
	{type}
	class={buttonClass}
	disabled={loading || disabled}
	on:click={run}
>
	<div class="relative">
		<div class={loading ? 'opacity-0' : 'opacity-100'}>
			<slot />
		</div>
		{#if loading}
			<div
				class="absolute left-1/2 top-1/2 flex h-5 w-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
			>
				<ProgressRadial
					class="h-5 w-5 !fill-black !text-black/20 dark:!fill-white dark:!text-white/20"
				/>
			</div>
		{/if}
	</div>
</button>
