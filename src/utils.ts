import Color from 'color'

export const RGBToHEX = ([r, g, b]: number[]) => {
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
}

export const changeLightnessOfRgb = (rgb: number[], amount: number) => {
  const color = Color.rgb(rgb)
  return color.lightness(amount * 100).hex()
}

export const filePicker = async (accept: string): Promise<File> => {
  return new Promise<File>((resolve, reject) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = accept
    input.onchange = () => {
      resolve(input.files[0])
    }
    input.oncancel = () => {
      reject(null)
    }
    input.click()
  })
}
