<script lang="ts">
  import type { ButtonProps } from 'flowbite-svelte/dist/buttons/Button.svelte'
  import { Button, Spinner } from 'flowbite-svelte'
  import type { ButtonType } from 'flowbite-svelte/dist/types'

  export let asyncFunction: (event: Event) => Promise<any> = async () => {}
  export let id: string = null
  export let disabled: boolean = false
  export let loading: boolean = false
  export let color: ElementColor = "primary"
  export let type: ButtonType = null
  export let buttonProps: ButtonProps = {}
  export let buttonClass: string = ""

  async function run(event: Event) {
    loading = true
    await asyncFunction?.(event).catch(() => null)
    loading = false
  }
</script>

<Button
  {...buttonProps}
  {id}
  {color}
  {type}
  class={buttonClass}
  disabled={loading || disabled}
  on:click={run}
>
  <div class="relative">
    <div class={loading ? 'opacity-0' : 'opacity-100'}>
      <slot />
    </div>
    {#if loading}
      <div
        class="w-5 h-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
      >
        <Spinner
          class="!text-black/20 !fill-black dark:!text-white/20 dark:!fill-white"
          size="5"
        />
      </div>
    {/if}
  </div>
</Button>
