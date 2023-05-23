<script lang="ts">
  import HideIcon from 'svelte-material-icons/EyeOff.svelte'
  import ShowIcon from 'svelte-material-icons/Eye.svelte'

  import { checkApiUrl, me, login, signup } from './api'
  import Layout from './routes/+layout.svelte'
  import { userStore } from './stores'
  import {
    Button,
    DarkMode,
    Helper,
    Input,
    Label,
    P,
    Span,
  } from 'flowbite-svelte'

  let connected = false
  let error = false

  let authorized = false
  let unauthorized = false

  let doSignup = false
  let showPassword = false
  let errorMessage: string = null

  let user: User

  userStore.subscribe((value) => {
    user = value
  })

  checkApiUrl()
    .then(() => {
      connected = true
    })
    .catch(() => {
      error = true
    })

  me()
    .then(() => {
      unauthorized = false
      authorized = true
    })
    .catch(() => {
      authorized = false
      unauthorized = true
    })

  function submitLogin(event: SubmitEvent) {
    const form = event.target as HTMLFormElement
    const email = form.email.value
    const password = form.password.value

    login(email, password)
      .then(() => {
        unauthorized = false
        authorized = true
        errorMessage = null
      })
      .catch(() => {
        authorized = false
        unauthorized = true
        errorMessage = 'Wrong email or password'
      })
  }

  function submitSignup(event: SubmitEvent) {
    const form = event.target as HTMLFormElement
    const username = form.username.value
    const email = form.email.value
    const password = form.password.value

    signup(username, email, password)
      .then(() => {
        authorized = true
        unauthorized = false
        errorMessage = null
      })
      .catch(() => {
        authorized = false
        unauthorized = true
        errorMessage = 'Wrong email or password'
      })
  }
</script>

<main class="h-full w-full">
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
        <Input
          class="w-10/12 lg:w-1/2 2xl:w-1/3 m-2"
          name="username"
          color={errorMessage ? 'red' : 'base'}
          placeholder="Username"
        />
        <Input
          class="w-10/12 lg:w-1/2 2xl:w-1/3 m-2"
          name="email"
          color={errorMessage ? 'red' : 'base'}
          id="email"
          type="email"
          placeholder="Email"
        />
        <div class="w-10/12 lg:w-1/2 2xl:w-1/3 m-2">
          <Input
            name="password"
            id="password"
            placeholder="Password"
            color={errorMessage ? 'red' : 'base'}
            type={showPassword ? 'text' : 'password'}
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
        <Button
          class="w-10/12 lg:w-1/2 2xl:w-1/3 m-2"
          type="submit"
          variant="primary"
        >
          Signup
        </Button>
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
        <Button
          color="primary"
          type="submit"
          class="w-10/12 lg:w-1/2 2xl:w-1/3 m-2"
        >
          Login
        </Button>
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
    {#if connected}
      <div class="h-full">
        <Layout {user} />
      </div>
    {:else if error}
      <h1 class="text-2xl font-bold">Error</h1>
    {:else}
      <h1 class="text-2xl font-bold">Loading...</h1>
    {/if}
  {:else}
    <h1 class="text-2xl font-bold">Something went wrong!</h1>
  {/if}
</main>

<style global>
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>
