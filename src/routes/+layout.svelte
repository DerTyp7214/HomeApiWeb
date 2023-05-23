<script lang="ts">
  import PlusIcon from 'svelte-material-icons/Plus.svelte'
  import GitHubIcon from 'svelte-material-icons/Github.svelte'
  import TwitterIcon from 'svelte-material-icons/Twitter.svelte'

  import {
    connectWebSocket,
    getLights,
    getPlugs,
    addHueBridge,
    initHueBridge,
    deleteHueBridge,
    logout,
    getProfilePicture,
  } from '../api'
  import LightElement from '../components/+lightElement.svelte'
  import PlugElement from '../components/+plugElement.svelte'
  import CustomButton from '../components/+customButton.svelte'
  import type { User } from '../types'
  import {
    Avatar,
    DarkMode,
    Dropdown,
    DropdownDivider,
    DropdownHeader,
    DropdownItem,
    Footer,
    FooterCopyright,
    FooterIcon,
    FooterLink,
    FooterLinkGroup,
    NavBrand,
    NavHamburger,
    NavLi,
    NavUl,
    Navbar,
    SpeedDial,
    SpeedDialButton,
  } from 'flowbite-svelte'
  import Settings from '../components/+settings.svelte'
  import { bridgeStore, lightsStore, plugsStore, userStore } from '../stores'
  import AddHue from '../components/+addHue.svelte'

  let lights: { [key: string]: Light } = {}
  let plugs: { [key: string]: Plug } = {}

  export let user: User

  let settingsOpen = false
  let addHueOpen = false

  lightsStore.subscribe((value) => {
    lights = {}
    value.forEach((light) => {
      lights[light.id] = light
    })
  })

  plugsStore.subscribe((value) => {
    plugs = {}
    value.forEach((plug) => {
      plugs[plug.id] = plug
    })
  })

  bridgeStore.subscribe((value) => {
    if (value) {
      loadDevices()
    }
  })

  async function loadDevices() {
    const lightsData = await getLights()
    lightsStore.set(lightsData)

    const plugsData = await getPlugs()
    plugsStore.set(plugsData)
  }

  const ws = connectWebSocket()

  ws.addEventListener('message', (event) => {
    const { type, data } = JSON.parse(event.data)

    if (!data) {
      loadDevices()
      return
    }

    switch (type) {
      case 'light':
        lights[data.id] = data
        break
      case 'plug':
        plugs[data.id] = data
        break
    }
  })

  getProfilePicture().then((picture) => {
    const profilePicture = URL.createObjectURL(picture)
    userStore.update((user) => ({ ...user, profilePicture }))
  })

  async function addHue() {
    const ip = prompt(
      'Enter the IP of your Hue Bridge, press the button and click OK'
    )
    const config = await addHueBridge(ip).catch(() => null)

    if (config) {
      const init = await initHueBridge(config.id)
        .then(() => true)
        .catch(() => false)

      if (init) {
        loadDevices()
        return
      } else {
        await deleteHueBridge(config.id)
      }
    }
    alert('Something went wrong')
  }

  loadDevices()
</script>

<div class="fixed w-full p-4 top-0 left-0 z-30">
  <Navbar
    let:hidden
    let:toggle
    rounded
    navClass="p-3 !bg-white/80 dark:!bg-gray-700/80 backdrop-blur-md"
    navDivClass="mx-auto flex flex-wrap justify-between items-center container"
  >
    <NavBrand href="/" class="text-xl font-normal">
      <img src="/vite.svg" alt="logo" class="h-8 w-8 inline-block me-2" />
      <span class="text-primary font-bold">Home</span>Api
    </NavBrand>
    <div class="flex items-center md:order-2">
      <DarkMode
        btnClass="text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-500 rounded-lg text-sm p-2.5 mr-2"
      />
      <Avatar id="avatar-menu" class="cursor-pointer overflow-hidden">
        {#if user.profilePicture}
          <img
            src={user.profilePicture}
            alt="profile"
            class="w-full h-full pointer-events-none"
          />
        {:else}
          <svg
            class="text-gray-400 bg-gray-100 dark:bg-gray-600 rounded-full"
            fill="currentColor"
            viewBox="0 0 16 16"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M8 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
              clip-rule="evenodd"
            />
          </svg>
        {/if}
      </Avatar>
      <NavHamburger
        on:click={toggle}
        class1="w-full md:flex md:w-auto md:order-1"
      />
    </div>
    <Dropdown placement="bottom" triggeredBy="#avatar-menu" color="navbar">
      <DropdownHeader divider={false}>
        <spin class="block text-sm">{user.username}</spin>
        <span class="block truncate text-sm font-medium">{user.email}</span>
      </DropdownHeader>
      <DropdownDivider
        divClass="my-1 h-px bg-gray-200/80 dark:bg-gray-700/40"
      />
      <DropdownItem on:click={() => (settingsOpen = true)}>
        Settings
      </DropdownItem>
      <DropdownDivider
        divClass="my-1 h-px bg-gray-200/80 dark:bg-gray-700/40"
      />
      <DropdownItem on:click={logout}>Logout</DropdownItem>
    </Dropdown>
    <NavUl {hidden}>
      <NavLi href="/static/" active={true}>Home</NavLi>
      <NavLi href="/static/about">About</NavLi>
    </NavUl>
  </Navbar>
</div>

<div class="p-4 h-full flex flex-col overflow-auto layout-content">
  <div class="flex-grow mt-24 relative z-0">
    <div class="flex justify-between">
      <div class="flex space-x-2">
        <CustomButton click={loadDevices}>Reload</CustomButton>
      </div>
    </div>
    <h1 class="text-2xl font-bold mt-5">Lights</h1>
    <div class="inline-flex flex-wrap justify-start mt-3">
      {#each Object.entries(lights) as [_, light]}
        <LightElement {light} />
      {/each}
    </div>

    <h1 class="text-2xl font-bold mt-5">Plugs</h1>
    <div class="inline-flex justify-around mt-3">
      {#each Object.entries(plugs) as [_, plug]}
        <PlugElement {plug} />
      {/each}
    </div>

    <SpeedDial defaultClass="absolute right-6 bottom-6" color="primary">
      <SpeedDialButton name="Add&nbsp;Hue" on:click={() => (addHueOpen = true)}>
        <PlusIcon class="w-6 h-6" />
      </SpeedDialButton>
      <SpeedDialButton name="Add&nbsp;Wled">
        <PlusIcon class="w-6 h-6" />
      </SpeedDialButton>
    </SpeedDial>
  </div>

  <Footer footerType="socialmedia" class="rounded-lg">
    <div class="sm:flex sm:items-center sm:justify-end">
      <FooterLinkGroup
        ulClass="flex flex-wrap items-center mb-6 text-sm text-gray-500 sm:mb-0 dark:text-gray-400"
      >
        <FooterLink href="https://github.com/DerTyp7214/HomeApi">
          HomeApi
        </FooterLink>
        <FooterLink href="https://github.com/DerTyp7214/HomeApiWeb">
          HomeApiWeb
        </FooterLink>
        <FooterLink href="https://github.com/DerTyp7214/HomeApiPython">
          HomeApiPython
        </FooterLink>
        <FooterLink href="https://github.com/DerTyp7214/HomeApiRust">
          HomeApiRust
        </FooterLink>
      </FooterLinkGroup>
    </div>
    <hr class="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
    <div class="sm:flex sm:items-center sm:justify-between">
      <FooterCopyright
        href="https://github.com/DerTyp7214"
        by="DerTyp7214"
        year={2023}
      />
      <div class="flex mt-4 space-x-6 sm:justify-center sm:mt-0">
        <FooterIcon
          href="https://github.com/DerTyp7214"
          class="text-gray-400 hover:text-gray-900"
        >
          <GitHubIcon class="w-5 h-5" />
        </FooterIcon>
        <FooterIcon
          href="https://twitter.com/DerTyp7214"
          class="text-gray-400 hover:text-gray-900"
        >
          <TwitterIcon class="w-5 h-5" />
        </FooterIcon>
      </div>
    </div>
  </Footer>
</div>

<Settings bind:open={settingsOpen} />
<AddHue bind:open={addHueOpen} />
