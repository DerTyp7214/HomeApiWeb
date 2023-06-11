<script lang="ts">
	import GitHubIcon from 'svelte-material-icons/Github.svelte';
	import TwitterIcon from 'svelte-material-icons/Twitter.svelte';
</script>

<div
	class="container-round bg-surface-200-700-token m-2 flex flex-col gap-2 p-3"
>
	<div class="sm:flex sm:items-center sm:justify-between">
		<div class="flex justify-center text-base text-gray-500 dark:text-gray-400">
			© 2023&nbsp;<a href="https://github.com/DerTyp7214">DerTyp7214</a>, All
			rights reserved.
		</div>
		<div
			class="mt-4 flex space-x-6 text-gray-500 dark:text-gray-400 sm:mt-0 sm:justify-center"
		>
			<div class="flex space-x-6">
				<a
					href="https://github.com/DerTyp7214"
					class="transition-all hover:text-gray-900 hover:dark:text-gray-100"
				>
					<GitHubIcon class="h-5 w-5" />
				</a>
				<a
					href="https://twitter.com/DerTyp7214"
					class="transition-all hover:text-gray-900 hover:dark:text-gray-100"
				>
					<TwitterIcon class="h-5 w-5" />
				</a>
			</div>
		</div>
	</div>
</div>
