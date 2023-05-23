<script lang="ts">
  import CameraIcon from 'svelte-material-icons/Camera.svelte'

  import { Avatar, Spinner, ButtonGroup, Button } from 'flowbite-svelte'
  import { setProfilePicture } from '../api'
  import { userStore } from '../stores'
  import { filePicker } from '../utils'

  let user: User

  userStore.subscribe((value) => {
    user = value
  })

  let tempImage: File = null

  let loading = false

  $: changingProfilePicture = tempImage !== null

  $: profilePicture = tempImage
    ? URL.createObjectURL(tempImage)
    : user.profilePicture

  $: if (!open) {
    tempImage = null
  }

  async function changeProfilePicture() {
    loading = true
    const file = await filePicker('image/png,image/jpeg').catch(() => null)
    tempImage = file
    loading = false
  }

  function resetProfilePicture() {
    tempImage = null
  }

  async function saveProfilePicture() {
    const response = await setProfilePicture(tempImage)

    if (response) userStore.update((value) => ({ ...value, profilePicture }))

    tempImage = null
  }
</script>

<div class="flex flex-col w-32 ml-auto mr-10 justify-center items-center">
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div
    class="cursor-pointer rounded-full relative group"
    on:click={changeProfilePicture}
  >
    <Avatar src={profilePicture} class="w-28 h-28 t-10" />
    {#if loading}
      <div
        class="absolute top-0 left-0 rounded-full bg-black/40 w-full h-full flex items-center justify-center"
      >
        <Spinner class="w-24 h-24" color="yellow" />
      </div>
    {:else}
      <div
        class="absolute top-0 left-0 flex items-center justify-center rounded-full w-full h-full group-hover:backdrop-blur-[2px] group-hover:bg-black/40 transition-all duration-300 border-0 group-hover:border-2"
      >
        <CameraIcon
          class="w-12 h-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          color="white"
        />
      </div>
    {/if}
  </div>
  <ButtonGroup>
    <Button
      class="mt-5"
      variant="secondary"
      disabled={!changingProfilePicture}
      on:click={resetProfilePicture}
    >
      Reset
    </Button>
    <Button
      class="mt-5"
      variant="secondary"
      disabled={!changingProfilePicture}
      on:click={saveProfilePicture}
    >
      Save
    </Button>
  </ButtonGroup>
</div>
