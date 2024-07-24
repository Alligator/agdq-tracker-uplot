# AGDQ Tracker Uplot

The frontend for my [GDQ tracker](https://gdq.alligatr.co.uk).

## Local development

This uses [pnpm](https://pnpm.io) for package management. The web framework is [Svelte](https://svelte.dev) and [Rollup](https://rollupjs.org) is used for bundling and running a dev server.

### Comparison

1. Run `pnpm i`
1. Run `pnpm run dev:comp`
1. Grab `comp.json` from [here](http://gdq.alligatr.co.uk/comparison/comp.json) and put it in `public/comp`
1. Visit `localhost:5001/gdq`

### Tracker

1. Run `pnpm i`
1. Run `pnpm run dev`
1. Grab a stats file from the [stats repo](https://github.com/alligator/agdq-stats) (e.g. [agdq24.json](https://raw.githubusercontent.com/Alligator/agdq-stats/master/agdq24.json)) and put it in `public/tracker`
1. Visit `localhost:5001/agdq24` or a path that matches the name of the stats file
