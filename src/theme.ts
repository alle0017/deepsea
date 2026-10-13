export class Theme {
      primary = '#333';
      secondary = '#111';
      accentPrimary = '#3e5869';
      accentSecondary = '#517084'
      text = '#cecece'
      background = '#444'
}

export const row = (gap = '10px') => `display: flex; flex-direction: row; gap: ${gap};`
export const column = (gap = '10px') => `display: flex; flex-direction: column; gap: ${gap};`