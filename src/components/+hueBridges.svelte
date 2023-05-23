<script lang="ts">
  import DeleteIcon from 'svelte-material-icons/DeleteOutline.svelte'
  import AlertIcon from 'svelte-material-icons/AlertCircleOutline.svelte'

  import {
    Button,
    Modal,
    Popover,
    TableBody,
    TableBodyCell,
    TableBodyRow,
    TableHead,
    TableHeadCell,
    TableSearch,
  } from 'flowbite-svelte'
  import { deleteHueBridge, getHueBridges, initHueBridge } from '../api'
  import { bridgeStore } from '../stores'
  import LoadingButton from './+loadingButton.svelte'

  let inputValue = ''
  let bridges: HueBridge[] = []
  let loading = false
  let confirmDeleteModalOpen = false
  let bridgeToDelete: HueBridge = null

  let initErrors: { [key: string]: string } = {}

  $: filteredBridges = bridges.filter((bridge) => {
    if (inputValue.trim() === '') return true
    if (inputValue.startsWith('ip:')) {
      const ip = inputValue.split(':')[1]
      return bridge.ip.toLowerCase().includes(ip.toLowerCase())
    }
    if (inputValue.startsWith('id:')) {
      const id = inputValue.split(':')[1]
      return bridge.id.toLowerCase().includes(id.toLowerCase())
    }
    return (
      bridge.ip.toLowerCase().includes(inputValue.toLowerCase()) ||
      bridge.id.toLowerCase().includes(inputValue.toLowerCase())
    )
  })

  async function loadBridges() {
    if (loading) return
    loading = true
    const bridgesResponse = await getHueBridges().catch(() => null)

    if (bridgesResponse) {
      bridges = bridgesResponse
      bridgeStore.set(bridgesResponse)
    }

    loading = false
  }

  loadBridges()

  async function deleteBridge(id: string) {
    if (loading) return
    loading = true
    await deleteHueBridge(id).catch(() => {})
    const bridgesResponse = await getHueBridges().catch(() => null)

    if (bridgesResponse) {
      bridges = bridgesResponse
      bridgeStore.set(bridgesResponse)
    }

    loading = false
  }

  async function initBridge(id: string) {
    loading = true
    delete initErrors[id]
    const init = await initHueBridge(id).catch(() => false)

    if (init.username) {
      loading = false
      await loadBridges()
    } else if (init.message) {
      initErrors[id] = init.message
    }
    loading = false
  }
</script>

<TableSearch
  color="green"
  divClass="relative overflow-x-auto sm:rounded-lg customTable"
  placeholder="Search (ip:<ip> or id:<id>)"
  bind:inputValue
>
  <TableHead>
    <TableHeadCell>Bridge Id</TableHeadCell>
    <TableHeadCell>Ip</TableHeadCell>
    <TableHeadCell>User Key</TableHeadCell>
    <TableHeadCell />
  </TableHead>
  <TableBody tableBodyClass="divide-y">
    {#each filteredBridges as bridge}
      <TableBodyRow>
        <TableBodyCell>{bridge.id}</TableBodyCell>
        <TableBodyCell>{bridge.ip}</TableBodyCell>
        <TableBodyCell>
          {#if bridge.user}
            {bridge.user}
          {:else}
            <LoadingButton
              id="init-{bridge.id}"
              color={initErrors[bridge.id] ? 'red' : 'dark'}
              disabled={loading}
              asyncFunction={async () => await initBridge(bridge.id)}
            >
              Initialize
            </LoadingButton>
            {#if initErrors[bridge.id]}
              <Popover open>{initErrors[bridge.id]}</Popover>
            {/if}
          {/if}
        </TableBodyCell>
        <TableBodyCell tdClass="p-0">
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <div
            on:click={() => {
              bridgeToDelete = bridge
              confirmDeleteModalOpen = true
            }}
            class="cursor-pointer hover:bg-white/20 w-8 h-8 flex items-center justify-center rounded-md"
          >
            <DeleteIcon size="18px" />
          </div>
        </TableBodyCell>
      </TableBodyRow>
    {/each}
  </TableBody>
</TableSearch>

<Modal
  id="hue-confirm-delete-popup-modal"
  bind:open={confirmDeleteModalOpen}
  size="xs"
  autoclose
>
  <div class="text-center">
    <AlertIcon size="3.5rem" class="mx-auto mb-4" />
    <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
      Are you sure you want to delete this Bridge?
    </h3>
    <Button
      color="red"
      class="mr-2"
      on:click={() => deleteBridge(bridgeToDelete.id)}>Yes, I'm sure</Button
    >
    <Button color="alternative">No, cancel</Button>
  </div>
</Modal>
