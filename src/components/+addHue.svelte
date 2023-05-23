<script lang="ts">
  import {
    Button,
    Checkbox,
    Input,
    Label,
    Modal,
    Spinner,
  } from 'flowbite-svelte'
  import {
    addHueBridge,
    deleteHueBridge,
    getHueBridges,
    initHueBridge,
  } from '../api'
  import { bridgeStore } from '../stores'
  import LoadingButton from './+loadingButton.svelte'

  let autimaticallyInitialize = true
  let errorMessage = ''
  let ip = ''

  export let open = false

  $: if (!open) {
    errorMessage = ''
    ip = ''
    autimaticallyInitialize = true
  }

  async function addBridge(event: Event) {
    event.preventDefault()

    errorMessage = ''

    const added = await addHueBridge(ip).catch(() => false)

    if (added.id && autimaticallyInitialize) {
      const init = await initHueBridge(added.id).catch(() => false)

      if (init.username) {
        const bridges = await getHueBridges()
        bridgeStore.set(bridges)

        open = false
      } else {
        await deleteHueBridge(added.id)
        errorMessage = init.message
        return
      }
    } else if (added.message) {
      errorMessage = added.message
      return
    }
    open = false
  }
</script>

<Modal id="form-modal" bind:open size="xs" autoclose={false} class="w-full">
  <form class="flex flex-col space-y-6" action="#">
    <h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">
      Add new Hue Bridge
    </h3>
    <Label class="space-y-2">
      <span>Hue Bridge Ip</span>
      <Input
        type="text"
        name="ip"
        placeholder="Hue Bridge Ip"
        required
        bind:value={ip}
      />
    </Label>
    <div class="flex items-start">
      <Checkbox bind:checked={autimaticallyInitialize}>
        Automatically initialize
      </Checkbox>
    </div>
    {#if errorMessage}
      <p class="text-red-500">{errorMessage}</p>
    {/if}
    <LoadingButton
      disabled={ip === ''}
      type="submit"
      buttonClass="w-full1"
      asyncFunction={addBridge}
    >
      Add Hue Bridge{' '}
    </LoadingButton>
  </form>
</Modal>
