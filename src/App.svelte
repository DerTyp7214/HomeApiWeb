<script lang="ts">
  import HideIcon from 'svelte-material-icons/EyeOff.svelte'
  import ShowIcon from 'svelte-material-icons/Eye.svelte'

  import { checkApiUrl, me, login, signup } from './api'
  import Layout from './routes/+layout.svelte'
  import { userStore } from './stores'
  import { Button, DarkMode, Helper, Input } from 'flowbite-svelte'
  import LoadingButton from './components/+loadingButton.svelte'

  let connected = false
  let error = false

  let authorized = false
  let unauthorized = false

  let doSignup = false
  let showPassword = false
  let errorMessage: string = null

  let user: User

  let loading = true

  userStore.subscribe((value) => {
    user = value
  })

  checkApiUrl()
    .then(async () => {
      await me().catch(() => {
        userStore.set(null)
      })
      loading = false
      connected = true
    })
    .catch(() => {
      error = true
    })

  $: {
    if (user) {
      authorized = true
      unauthorized = false
      errorMessage = null
    } else {
      authorized = false
      unauthorized = true
    }
  }

  async function submitLogin(event: SubmitEvent) {
    loading = true

    const form = event.target as HTMLFormElement
    const email = form.email.value
    const password = form.password.value

    await login(email, password).catch((message: Error) => {
      userStore.set(null)
      errorMessage = message.message
    })

    loading = false
  }

  async function submitSignup(event: SubmitEvent) {
    loading = true

    const form = event.target as HTMLFormElement
    const username = form.username.value
    const email = form.email.value
    const password = form.password.value
    const password_confirmation = form.password_confirmation.value

    if (password !== password_confirmation) {
      errorMessage = 'Passwords do not match'
      return
    }

    await signup(username, email, password).catch((message: Error) => {
      userStore.set(null)
      errorMessage = message.message
    })

    loading = false
  }
</script>

<main class="h-full w-full">
  {#if connected}
    {#if unauthorized}
      <DarkMode
        btnClass="text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-500 rounded-lg text-sm p-2.5 mr-2 fixed top-8 right-8"
      />
      {#if doSignup}
        <form
          autocomplete="off"
          class="flex flex-col items-center justify-center w-full h-screen"
          on:submit|preventDefault={submitSignup}
        >
          <h1 class="text-2xl font-bold">Signup</h1>
          <div class="w-10/12 lg:w-1/2 2xl:w-1/3 m-2">
            <Input
              name="username"
              color={errorMessage ? 'red' : 'base'}
              placeholder="Username"
              required
            />
          </div>
          <div class="w-10/12 lg:w-1/2 2xl:w-1/3 m-2">
            <Input
              name="email"
              color={errorMessage ? 'red' : 'base'}
              id="email"
              type="email"
              placeholder="Email"
              required
            />
          </div>
          <div class="w-10/12 lg:w-1/2 2xl:w-1/3 m-2">
            <Input
              name="password"
              id="password"
              placeholder="Password"
              color={errorMessage ? 'red' : 'base'}
              type={showPassword ? 'text' : 'password'}
              required
            >
              <button
                slot="left"
                on:click={() => (showPassword = !showPassword)}
                type="button"
                class="pointer-events-auto"
              >
                {#if showPassword}
                  <HideIcon class="w-6 h-6 ml-1/2" />
                {:else}
                  <ShowIcon class="w-6 h-6 ml-1/2" />
                {/if}
              </button>
            </Input>
          </div>
          <div class="w-10/12 lg:w-1/2 2xl:w-1/3 m-2">
            <Input
              name="password_confirmation"
              id="password_confirmation"
              placeholder="Confirm password"
              color={errorMessage ? 'red' : 'base'}
              type={showPassword ? 'text' : 'password'}
              required
            >
              <button
                slot="left"
                on:click={() => (showPassword = !showPassword)}
                type="button"
                class="pointer-events-auto"
              >
                {#if showPassword}
                  <HideIcon class="w-6 h-6 ml-1/2" />
                {:else}
                  <ShowIcon class="w-6 h-6 ml-1/2" />
                {/if}
              </button>
            </Input>
          </div>
          {#if errorMessage}
            <Helper color="red">{errorMessage}</Helper>
          {/if}
          <LoadingButton
            buttonClass="w-10/12 lg:w-1/2 2xl:w-1/3 m-2"
            type="submit"
            color="primary"
            {loading}
          >
            Signup
          </LoadingButton>
          <Helper class="text-sm">
            Already have an account?{' '}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <span
              class="text-orange-400 cursor-pointer"
              on:click={() => (doSignup = false)}
            >
              Login
            </span>
          </Helper>
        </form>
      {:else}
        <form
          autocomplete="off"
          class="flex flex-col items-center justify-center w-full h-screen"
          on:submit|preventDefault={submitLogin}
        >
          <h1 class="text-2xl font-bold">Login</h1>
          <Input
            id="email"
            type="email"
            name="email"
            placeholder="Email"
            color={errorMessage ? 'red' : 'base'}
            defaultClass="w-10/12 lg:w-1/2 2xl:w-1/3 m-2"
            required
          />
          <div class="w-10/12 lg:w-1/2 2xl:w-1/3 m-2">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              color={errorMessage ? 'red' : 'base'}
              required
            >
              <button
                slot="left"
                type="button"
                on:click={() => (showPassword = !showPassword)}
                class="pointer-events-auto"
              >
                {#if showPassword}
                  <HideIcon class="w-6 h-6 ml-1/2" />
                {:else}
                  <ShowIcon class="w-6 h-6 ml-1/2" />
                {/if}
              </button>
            </Input>
          </div>
          {#if errorMessage}
            <Helper color="red">{errorMessage}</Helper>
          {/if}
          <LoadingButton
            color="primary"
            type="submit"
            buttonClass="w-10/12 lg:w-1/2 2xl:w-1/3 m-2"
            {loading}
          >
            Login
          </LoadingButton>
          <Helper class="text-sm">
            Don't have an account?{' '}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-missing-attribute -->
            <a
              class="text-orange-400 cursor-pointer"
              on:click={() => (doSignup = true)}
            >
              Signup
            </a>
          </Helper>
        </form>
      {/if}
    {:else if authorized}
      <div class="h-full">
        <Layout {user} />
      </div>
    {:else if error}
      <h1 class="text-2xl font-bold">Error</h1>
    {:else}
      <h1 class="text-2xl font-bold">Loading...</h1>
    {/if}
  {/if}
</main>

<style global>
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>
