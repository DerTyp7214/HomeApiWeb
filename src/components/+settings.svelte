<script lang="ts">
  import {
    DropdownDivider,
    Heading,
    Modal,
    Sidebar,
    SidebarGroup,
    SidebarItem,
    SidebarWrapper,
  } from 'flowbite-svelte'
  import { userStore } from '../stores'
  import UserSettings from './+userSettings.svelte'
  import HueBridges from './+hueBridges.svelte'

  const items = ['UserSettings', 'HueBridges']

  let activeItem = items[0]

  let user: User

  userStore.subscribe((value) => {
    user = value
  })

  export let open: boolean = false

  $: if (!open) {
    activeItem = items[0]
  }
</script>

<Modal
  id="settingsModal"
  bind:open
  size="xl"
  outsideclose
  class="rounded-xl overflow-hidden ml-10 mr-10"
  backdropClasses="fixed inset-0 z-40 bg-gray-900 bg-opacity-50 dark:bg-opacity-80 backdrop-blur-sm"
>
  <Heading class="text-[40px] font-normal">Settings</Heading>
  <DropdownDivider />
  <div class="flex flex-row max-w-full w-[80vw] h-[40vh]">
    <Sidebar asideClass="w-64 customSidebar">
      <SidebarWrapper>
        <SidebarGroup>
          <SidebarItem
            label="User Settings"
            on:click={(event) => {
              event.stopPropagation()
              event.preventDefault()
              if (activeItem !== 'UserSettings') {
                activeItem = 'UserSettings'
              } else return
            }}
            active={activeItem === 'UserSettings'}
          />
          <SidebarItem
            label="Hue Bridges"
            on:click={(event) => {
              event.stopPropagation()
              event.preventDefault()
              if (activeItem !== 'HueBridges') {
                activeItem = 'HueBridges'
              } else return
            }}
            active={activeItem === 'HueBridges'}
          />
        </SidebarGroup>
      </SidebarWrapper>
    </Sidebar>
    <div class="flex-grow">
      {#if activeItem === 'UserSettings'}
        <UserSettings />
      {:else if activeItem === 'HueBridges'}
        <HueBridges />
      {/if}
    </div>
  </div>
</Modal>
