export class Theme {
      text = '#cecece'
      background = '#1b1c1d'
}

export const row = (gap = '10px') => `display: flex; flex-direction: row; gap: ${gap};`
export const column = (gap = '10px') => `display: flex; flex-direction: column; gap: ${gap};`