<script lang="ts">
  import { Card } from 'flowbite-svelte'
  import { changeLightnessOfRgb, lerpColor } from '../utils'
  import { setLight, setPlug } from '../api'

  export let device: Light | Plug

  $: isLight = device.hasOwnProperty('color') ? true : false

  $: color = device.on
    ? isLight
      ? (() => {
          const light = device as Light

          return changeLightnessOfRgb(light.color[0], 0.35)
        })()
      : 'green'
    : '#000000'

  async function onClick() {
    const { id, on } = device

    if (isLight) {
      await setLight(id, { on: !on })
    } else {
      await setPlug(id, { on: !on })
    }

    device.on = !on
  }

  $: lerpFactor = device.on ? 0.8 : 0.25
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
  style="--color: {color}; --color-dark: {lerpColor(
    color,
    '#1d1f24',
    lerpFactor + 0.05
  )}; --color-light: {lerpColor(color, 'white', lerpFactor)}"
  id="smart-device"
  on:click={onClick}
>
  <Card
    color="none"
    class="w-32 h-32 m-2 border-black dark:border-white cursor-pointer hover:scale-110 transition-transform duration-150"
  >
    <div
      class="flex items-center justify-center flex-col select-none w-full h-full"
    >
      <h5 class="font-bold text-lg">
        {device.name}
      </h5>
      <h5 class="text-lg">
        {device.on ? 'ON' : 'OFF'}
      </h5>
    </div>
  </Card>
</div>
