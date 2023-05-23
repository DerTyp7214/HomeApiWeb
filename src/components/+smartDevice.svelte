<script lang="ts">
  import { Card } from 'flowbite-svelte'
  import { changeLightnessOfRgb, lerpColor } from '../utils'

  export let device: Light | Plug

  $: color = device.hasOwnProperty('color')
    ? (() => {
        const light = device as Light

        return light.on ? changeLightnessOfRgb(light.color[0], 0.35) : '#000000'
      })()
    : 'green'
</script>

<div
  style="--color: {color}; --color-dark: {lerpColor(
    color,
    '#1d1f24',
    0.85
  )}; --color-light: {lerpColor(color, 'white', 0.8)}"
  id="smart-device"
>
  <Card color="none" class="w-32 h-32 m-2 border-black dark:border-white cursor-pointer hover:scale-110 transition-transform duration-150">
    <div class="flex items-center justify-center flex-col select-none w-full h-full">
      <h5 class="font-bold text-lg">
        {device.name}
      </h5>
      <h5 class="text-lg">
        {device.on ? 'ON' : 'OFF'}
      </h5>
    </div>
  </Card>
</div>
