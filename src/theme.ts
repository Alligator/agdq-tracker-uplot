const baseVars = {
  'text-medium': '12pt',
  'color-bg': '#f0f0f0',
  'color-bg-dim': '#e8e8e8',
  'color-bg-dimmer': '#a0a0a0',
  'color-bg-faded': 'rgba(160, 160, 160, 0.75)',
  'color-fg': '#303030',
  'color-fg-bright': '#101010',
  'color-fg-dim': '#b0b0b0',
  'color-switch-bg': '#a0a0a0',
  'color-switch-fg': '#f0f0f0',
  'color-link': 'cornflowerblue',
};

const darkVars = {
  'color-bg': '#303030',
  'color-bg-dim': '#282828',
  'color-bg-dimmer': '#101010',
  'color-bg-faded': 'rgba(16, 16, 16, 0.9)',
  'color-fg': '#e0e0e0',
  'color-fg-bright': '#f5f5f5',
  'color-fg-dim': '#606060',
  'color-switch-bg': '#505050',
  'color-switch-fg': '#e0e0e0',
  'color-link': 'cornflowerblue',
};

export type Theme = typeof baseVars;
export const lightTheme = { ... baseVars };
export const darkTheme = { ...baseVars, ...darkVars };