export class Theme {
      text = '#cecece';
      background = '#1b1c1d';
      surface = '#111418';
      green = '#a3be8c';
      red = '#bf616a';
      orange = '#d08770';
      yellow = '#ebcb8b';
}

export const row = (gap = '10px') => `display: flex; flex-direction: row; gap: ${gap};`
export const column = (gap = '10px') => `display: flex; flex-direction: column; gap: ${gap};`