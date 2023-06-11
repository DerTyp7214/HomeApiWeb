<script lang="ts">
	import SettingsIcon from 'svelte-material-icons/Cog.svelte';
	import HomeIcon from 'svelte-material-icons/Home.svelte';
	import BackIcon from 'svelte-material-icons/ArrowLeft.svelte';
	import PaletteIcon from 'svelte-material-icons/Palette.svelte';

	import {
		AppBar,
		Avatar,
		LightSwitch,
		popup,
		type PopupSettings,
	} from '@skeletonlabs/skeleton';
	import { pageThemeStore, userStore as user } from '$lib/stores';
	import { getProfilePicture, logout } from '$lib/api';
	import { setTheme, themeNames } from '$lib/utils';

	export let title: string = 'Dashboard';
	export let homeBtn: boolean = false;
	export let backIfAvailable: boolean = false;

	$: document.title = `${title} - HomeApi`;

	$: backBtn = window.history.length > 1 && backIfAvailable;

	const popupUser: PopupSettings = {
		event: 'click',
		target: 'popupUser',
		placement: 'top-end',
	};

	const popupTheme: PopupSettings = {
		event: 'click',
		target: 'popupTheme',
		placement: 'top-end',
	};

	getProfilePicture().then((picture) => {
		const profilePicture = URL.createObjectURL(picture);
		user.update((user) => ({ ...user!!, profilePicture }));
	});
</script>

{#if $user}
	<AppBar
		gridColumns="grid-cols-3"
		slotDefault="place-self-center"
		slotTrail="place-content-end"
		class="container-round m-2"
	>
		<svelte:fragment slot="lead">
			<a class="flex flex-row items-center" href="/">
				<img src="/favicon.png" class="mr-5 h-8 w-8" alt="Icon" />
				<span class="h4 mr-5"><span class="font-bold">Home</span>Api</span>
				{#if backBtn}
					<button
						class="a-icon hidden sm:inline"
						on:click|preventDefault={() => window.history.back()}
					>
						<BackIcon class="h-5 w-5" />
					</button>
				{:else if homeBtn}
					<a href="/" class="a-icon hidden sm:inline">
						<HomeIcon class="h-5 w-5" />
					</a>
				{:else}
					<br />
				{/if}
			</a>
		</svelte:fragment>
		<span class="hidden sm:inline">{title}</span>
		<svelte:fragment slot="trail">
			<div class="flex flex-row items-center">
				<div class="a-icon mr-2 cursor-pointer" use:popup={popupTheme}>
					<PaletteIcon class="h-5 w-5" />
				</div>
				<div data-popup="popupTheme" class="card mt-3 w-72 p-4 shadow-xl">
					<ul>
						<li class="flex flex-row justify-between font-bold">
							Mode <LightSwitch />
						</li>
						<li class="mb-5 mt-5 border-b border-surface-700-200-token" />
						{#each themeNames as themeName}
							<li>
								<button
									class="btn my-1 ml-2 mr-2 w-full justify-start transition-colors {$pageThemeStore ===
									themeName
										? 'bg-primary-active-token'
										: 'hover:bg-primary-500/50 hover:text-on-primary-token'}"
									on:click={() => setTheme(themeName)}
								>
									{themeName
										.split('-')
										.map((word) =>
											word[0] ? word[0].toUpperCase() + word.slice(1) : ''
										)
										.join(' ')}
								</button>
							</li>{/each}
					</ul>
				</div>
				<div use:popup={popupUser}>
					<Avatar
						class="h-8 w-8 cursor-pointer select-none"
						src={$user.profilePicture ?? ''}
						initials={$user.username.substring(0, 2)}
					/>
				</div>
				<div data-popup="popupUser" class="card mt-3 w-72 p-4 shadow-xl">
					<ul>
						<li class="flex flex-row items-center justify-between">
							<span class="text-lg font-bold">{$user.username}</span>
							<a class="a-icon cursor-pointer" href="/settings">
								<SettingsIcon />
							</a>
						</li>
						<li>
							<a
								class="text-base font-bold underline"
								href="mailto:{$user.email}">{$user.email}</a
							>
						</li>
						<li>
							<button
								class="mt-2 rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-700"
								on:click={logout}
							>
								Logout
							</button>
						</li>
					</ul>
				</div>
			</div>
		</svelte:fragment>
	</AppBar>
{/if}
