<script lang="ts">
	import '@skeletonlabs/skeleton/styles/skeleton.css';

	import '../app.css';

	import HideIcon from 'svelte-material-icons/EyeOff.svelte';
	import ShowIcon from 'svelte-material-icons/Eye.svelte';

	import {
		computePosition,
		autoUpdate,
		offset,
		shift,
		flip,
		arrow,
	} from '@floating-ui/dom';

	import {
		LightSwitch,
		ProgressRadial,
		storePopup,
	} from '@skeletonlabs/skeleton';

	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

	import {
		checkApiUrl,
		connectEventSource,
		disconnectEventSource,
		login,
		me,
		signup,
	} from '$lib/api';
	import { pageThemeStore, userStore } from '$lib/stores';
	import LoadingButton from '$lib/components/LoadingButton.svelte';
	import { setTheme } from '$lib/utils';

	let loading = true;
	let connected = false;
	let error = false;

	let doSignup = true;
	let showPassword = false;

	let authorized = false;
	let unauthorized = false;
	let errorMessage: string | null = null;

	setTheme($pageThemeStore);

	checkApiUrl()
		.then(async () => {
			await me().catch(() => {
				userStore.set(undefined);
			});
			connected = true;
			loading = false;
		})
		.catch(() => {
			error = true;
			loading = false;
		});

	$: {
		if ($userStore) {
			authorized = true;
			unauthorized = false;
			errorMessage = null;
		} else {
			authorized = false;
			unauthorized = true;
		}
	}

	$: {
		if (authorized) {
			connectEventSource();
		} else {
			disconnectEventSource();
		}
	}

	async function submitLogin(event: SubmitEvent) {
		loading = true;

		const form = event.target as HTMLFormElement;
		const email = form.email.value;
		const password = form.password.value;

		await login(email, password).catch((message: Error) => {
			userStore.set(undefined);
			errorMessage = message.message;
		});

		loading = false;
	}

	async function submitSignup(event: SubmitEvent) {
		loading = true;

		const form = event.target as HTMLFormElement;
		const username = form.username.value;
		const email = form.email.value;
		const password = form.password.value;
		const password_confirmation = form.password_confirmation.value;

		if (password !== password_confirmation) {
			errorMessage = 'Passwords do not match';
			return;
		}

		await signup(username, email, password).catch((message: Error) => {
			userStore.set(undefined);
			errorMessage = message.message;
		});

		loading = false;
	}
</script>

{#if connected}
	{#if unauthorized}
		<LightSwitch class="absolute right-8 top-8" />
		{#if doSignup}
			<form
				autocomplete="off"
				class="flex h-screen w-full flex-col items-center justify-center"
				on:submit|preventDefault={submitSignup}
			>
				<h1 class="mb-5 text-2xl font-bold">Signup</h1>
				<input
					class="input m-2 w-10/12 p-2 pl-4 outline-none lg:w-1/2 2xl:w-1/3 {errorMessage
						? 'input-error'
						: ''}"
					title="Username"
					type="text"
					name="username"
					placeholder="Username"
					required
				/>
				<input
					class="input m-2 w-10/12 p-2 pl-4 outline-none lg:w-1/2 2xl:w-1/3 {errorMessage
						? 'input-error'
						: ''}"
					title="Email"
					type="email"
					name="email"
					placeholder="Email"
					required
				/>
				<div
					class="input-group-divider input-group m-2 w-10/12 grid-cols-[auto_1fr] lg:w-1/2 2xl:w-1/3"
				>
					<button
						class="input-group-shim outline-none"
						on:click|preventDefault={() => (showPassword = !showPassword)}
					>
						{#if showPassword}
							<HideIcon />
						{:else}
							<ShowIcon />
						{/if}
					</button>
					<input
						class="p-2 outline-none {errorMessage ? 'input-error' : ''}"
						title="Password"
						type={showPassword ? 'text' : 'password'}
						name="password"
						placeholder="Password"
						required
					/>
				</div>
				<div
					class="input-group-divider input-group m-2 w-10/12 grid-cols-[auto_1fr] lg:w-1/2 2xl:w-1/3"
				>
					<button
						class="input-group-shim outline-none"
						on:click|preventDefault={() => (showPassword = !showPassword)}
					>
						{#if showPassword}
							<HideIcon />
						{:else}
							<ShowIcon />
						{/if}
					</button>
					<input
						class="p-2 outline-none {errorMessage ? 'input-error' : ''}"
						title="Password confirmation"
						type={showPassword ? 'text' : 'password'}
						name="password_confirmation"
						placeholder="Password confirmation"
						required
					/>
				</div>
				{#if errorMessage}
					<p class="text-red-500">{errorMessage}</p>
				{/if}
				<LoadingButton
					class="m-2 w-10/12 rounded-full bg-primary-500 p-2 font-bold text-white outline-none hover:bg-primary-600 lg:w-1/2 2xl:w-1/3"
					type="submit"
					{loading}
				>
					Signup
				</LoadingButton>
				<p class="text-gray-600 dark:text-gray-400">
					Already have an account?{' '}
					<button
						class="text-primary-500 hover:text-primary-600"
						on:click={() => (doSignup = false)}
					>
						Login
					</button>
				</p>
			</form>
		{:else}
			<form
				autocomplete="off"
				class="flex h-screen w-full flex-col items-center justify-center"
				on:submit|preventDefault={submitLogin}
			>
				<h1 class="mb-5 text-2xl font-bold">Login</h1>
				<input
					class="input m-2 w-10/12 p-2 pl-4 outline-none lg:w-1/2 2xl:w-1/3 {errorMessage
						? 'input-error'
						: ''}"
					title="Email"
					type="email"
					name="email"
					placeholder="Email"
					required
				/>
				<div
					class="input-group-divider input-group m-2 w-10/12 grid-cols-[auto_1fr] lg:w-1/2 2xl:w-1/3"
				>
					<button
						class="input-group-shim outline-none"
						on:click|preventDefault={() => (showPassword = !showPassword)}
					>
						{#if showPassword}
							<HideIcon />
						{:else}
							<ShowIcon />
						{/if}
					</button>
					<input
						class="p-2 outline-none {errorMessage ? 'input-error' : ''}"
						title="Password"
						type={showPassword ? 'text' : 'password'}
						name="password"
						placeholder="Password"
						required
					/>
				</div>
				{#if errorMessage}
					<p class="text-red-500">{errorMessage}</p>
				{/if}
				<LoadingButton
					class="m-2 w-10/12 rounded-full bg-primary-500 p-2 font-bold text-white outline-none hover:bg-primary-600 lg:w-1/2 2xl:w-1/3"
					type="submit"
					{loading}
				>
					Login
				</LoadingButton>
				<p class="text-gray-600 dark:text-gray-400">
					Don't have an account?{' '}
					<button
						class="text-primary-500 hover:text-primary-600"
						on:click={() => (doSignup = true)}
					>
						Signup
					</button>
				</p>
			</form>
		{/if}
	{:else if authorized}
		<slot />
	{:else if error}
		<h1 class="text-2xl font-bold">Error</h1>
		<p class="text-gray-400">{errorMessage}</p>
	{/if}
{:else if loading}
	<div class="flex h-full w-full items-center justify-center">
		<ProgressRadial value={undefined} />
	</div>
{/if}
