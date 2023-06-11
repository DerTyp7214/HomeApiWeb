<script lang="ts">
	import { setProfilePicture } from '$lib/api';
	import { userStore as user } from '$lib/stores';
	import { filePicker } from '$lib/utils';
	import { Avatar, ProgressRadial } from '@skeletonlabs/skeleton';

	let tempImage: File | null = null;

	let loading = false;

	$: changingProfilePicture = tempImage !== null;

	$: profilePicture = tempImage
		? URL.createObjectURL(tempImage)
		: $user?.profilePicture;

	async function changeProfilePicture() {
		loading = true;
		tempImage = await filePicker('image/png,image/jpeg').catch(() => null);
		loading = false;
	}

	function resetProfilePicture() {
		tempImage = null;
	}

	async function saveProfilePicture() {
		if (tempImage) {
			const response = await setProfilePicture(tempImage);

			if (response) user.update((u) => ({ ...u!!, profilePicture }));

			tempImage = null;
		}
	}
</script>

{#if $user}
	<div class="flex h-full w-full flex-row justify-end lg:pr-5" id="profile">
		<div class="inline-flex flex-col items-center justify-center">
			<button
				on:click={changeProfilePicture}
				class="relative h-32 w-32 cursor-pointer overflow-hidden rounded-full"
			>
				<Avatar
					class="h-full w-full"
					src={profilePicture}
					initials={$user.username.substring(0, 2)}
				/>
				{#if loading}
					<div class="absolute left-0 top-0 h-full w-full bg-black/50" />
					<ProgressRadial
						meter="stroke-warning-500"
						track="stroke-warning-500/30"
						width="w-2/3"
						class="!absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
					/>
				{/if}
			</button>
			<div class="btn-group variant-ghost mt-4">
				<button
					disabled={!changingProfilePicture || loading}
					on:click={resetProfilePicture}
				>
					Reset
				</button>
				<button
					disabled={!changingProfilePicture || loading}
					on:click={saveProfilePicture}
				>
					Save
				</button>
			</div>
		</div>
	</div>
{/if}
