const baseVars = {
  'color-bg': '#f0f0f0',
  'color-bg-dimbright': '#e8e8e8',
  'color-bg-bright': '#d8d8d8',
  'color-bg-dim': '#e8e8e8',
  'color-bg-dimmer': '#a0a0a0',
  'color-bg-faded': 'rgba(160, 160, 160, 0.75)',

  'color-fg': '#303030',
  'color-fg-subtle': '#909090',
  'color-fg-bright': '#101010',
  'color-fg-dim': '#b0b0b0',
  'color-fg-dimmer': '#d0d0d0',

  'color-switch-bg': '#a0a0a0',
  'color-switch-fg': '#f0f0f0',
  'color-link': '#5465FD',
  'color-chart-selection': 'rgba(160, 160, 160, 0.25)',
};

const darkVars = {
  'color-bg': '#303030',
  'color-bg-dimbright': '#373737',
  'color-bg-bright': '#505050',
  'color-bg-dim': '#202020',
  'color-bg-dimmer': '#101010',
  'color-bg-faded': 'rgba(16, 16, 16, 0.9)',

  'color-fg': '#e0e0e0',
  'aolor-fg-subtle': '#a0a0a0',
  'color-fg-bright': '#f5f5f5',
  'color-fg-dim': '#606060',
  'color-fg-dimmer': '#505050',

  'color-switch-bg': '#505050',
  'color-switch-fg': '#e0e0e0',
  'color-link': '#74a5FD',
};

export type Theme = typeof baseVars;
export const lightTheme = { ... baseVars };
export const darkTheme = { ...baseVars, ...darkVars };