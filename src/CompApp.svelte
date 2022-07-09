<script lang="ts">
  import cssVars from 'svelte-css-vars';
  import "uplot/dist/uPlot.min.css";
  import About from './About.svelte';
import { marathonColor } from './colors';
  import CompChart from "./CompChart.svelte";
  import Layout from "./components/Layout.svelte";
  import ListItem from "./components/ListItem.svelte";
  import Switch from "./components/Switch.svelte";
  import { darkTheme,lightTheme } from './theme';
  import type { CompStats } from "./types";
import { fmtMarathonName, fmtMoney, fmtTimestamp } from './utils';

  let useDarkTheme = window.localStorage.getItem('theme') === 'dark';
  let theme;
  $: {
    if (!window.localStorage.getItem('theme')) {
      // no saved theme, try to detect
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        useDarkTheme = true;
      }
    }
    theme = useDarkTheme ? { ...darkTheme } : { ...lightTheme };
    window.localStorage.setItem('theme', useDarkTheme ? 'dark' : 'light');
    document.body.style.backgroundColor = theme['color-bg'];
  }

  let showAbout = false;
  let showStats = false;
  let stats: CompStats = null;
  let marathonColorMap: Record<string, string> = {};

  let enabledMarathons: boolean[];
  if (window.localStorage.getItem('enabledMarathons')) {
    try {
      enabledMarathons = JSON.parse(window.localStorage.getItem('enabledMarathons')) as boolean[];
    } catch(e) {
      // intentional
    }
  }
  $: window.localStorage.setItem('enabledMarathons', JSON.stringify(enabledMarathons));

  async function fetchData(): Promise<CompStats> {
    const res = await fetch('output.json');
    if (!res.ok) {
      throw new Error(res.status.toString());
    }
    stats = (await res.json()) as CompStats;
    if (!enabledMarathons || stats.marathons.length !== enabledMarathons.length) {
      enabledMarathons = new Array(stats.marathons.length).fill(true);
    }

    stats.marathons.forEach((marathon, i) => {
      marathonColorMap[marathon] = marathonColor(i);
    });
    return stats;
  }

  function onSelect(marathonIndex: number | null) {
    if (marathonIndex == null) {
      const allEnabled = enabledMarathons.every(x => x);
      if (allEnabled) {
        enabledMarathons = enabledMarathons.map(() => false);
      } else {
        enabledMarathons = enabledMarathons.map(() => true);
      }
    } else {
      enabledMarathons[marathonIndex] = !enabledMarathons[marathonIndex];
    }
  }

  function onThemeSelect(evt) {
    useDarkTheme = evt.target.checked;
  }

  let resetZoom;

  const promise = fetchData();
</script>

<main use:cssVars="{theme}">
  {#if showAbout}
    <About title="About" onClose={() => { showAbout = false }}>
      <svelte:fragment slot="content">
        <p>GDQ comparison by <a href="https://alligatr.co.uk">alligator</a>.</p>
        <ul>
          <li>
            <a href="https://gdq.alligatr.co.uk/">All my GDQ stuff</a>
          </li>
          <li>
            <a href="https://github.com/Alligator/agdq-tracker-uplot">Source code for this page</a>
          </li>
        </ul>
        <p>
          UI powered by <a href="https://svelte.dev/">Svelte</a> and <a href="https://leeoniya.github.io/uPlot/">uPlot</a>.
        </p>
      </svelte:fragment>
    </About>
  {/if}

  {#await promise}
      <Layout>
        <div slot="aside">
          <div class="aside-header">
            <div>
              <h1>GDQ Comparison</h1>
              <span class="link" on:click={() => { showAbout = true }}>about</span>
            </div>
            <Switch label="Dark theme" on:click={onThemeSelect} checked={useDarkTheme} />
          </div>
          {#each new Array(10) as i}
          <ListItem>
            <div slot="title" class="skeleton" style="width: 20ex"></div>
            <div slot="subtitle" class="skeleton" style="width: 15ex"></div>
          </ListItem>
          {/each}
        </div>
        <div slot="content">
          <div style="padding: var(--padding-1)">
            <div class="skeleton" style="width: 20ex"></div>
          </div>
        </div>
      </Layout>
  {:then data}
    <Layout>
      <div slot="aside">
        <div class="aside-header">
          <div>
            <h1>GDQ Comparison</h1>
            <span class="link" on:click={() => { showAbout = true }}>about</span>
          </div>
          <Switch label="Dark theme" on:click={onThemeSelect} checked={useDarkTheme} />
        </div>
        {#each data.marathons as marathon, i}
        <ListItem
          on:click={() => onSelect(i)}
        >
          <div slot="title" style="display: flex; align-items: center; justify-content: space-between;">
            <span style="color: {marathonColor(i)}">
              {fmtMarathonName(marathon)}
            </span>
            <Switch
              label=""
              checked={enabledMarathons[i]}
              on:click={() => onSelect(i)}
            />
          </div>
          <!-- <div slot="subtitle" style="font-size: var(--text-small); line-height: 1.5">
            Donation total:
            <strong style="color: var(--color-fg-bright)">
              ${Math.round(stats.donations[data.marathons.length - i - 1].reduce((acc, val) => Math.max(acc, val), 0)).toLocaleString()}
            </strong>
          </div> -->
        </ListItem>
        {/each}
        <ListItem
          active={null}
          on:click={() => onSelect(null)}
        >
          <span style="color: var(--color-link);">
          <!-- <button
            slot="title"
            type="button"
            style="flex-shrink: 0"
            on:click={() => onSelect(null)}
          > -->
            Show/Hide all
          </span>
          <!-- </button> -->
        </ListItem>
        <ListItem
          active={null}
          on:click={() => { showStats = true; }}
        >
          <span style="color: var(--color-link);">
            More stats
          </span>
        </ListItem>
      </div>
      <div slot="content" style="height: 100%; display: flex; flex-direction: column;">
        <div style="display:flex; justify-content: space-between; align-items: center;">
          <div style="padding: var(--padding-1)">
            <!-- <h2>{$selectedGame.index === null ? 'All Games' : stats.games[$selectedGame.index][1]}</h2> -->
            <span style="font-size: var(--text-small)">
              Click and drag to zoom in, double click to reset. Double click when zoomed out to select/deselect a specific game.
            </span>
          </div>
          <button
            type="button"
            style="flex-shrink: 0"
            on:click={resetZoom}
          >
            Reset zoom
          </button>
        </div>
        {#if enabledMarathons.some(x => x)}
        <CompChart
          theme={theme}
          timestamps={data.ts}
          donationsSeries={data.donations}
          marathons={data.marathons}
          enabledMarathons={enabledMarathons}
          bind:resetZoom
        />
        {:else}
        <p style="padding: var(--padding-1); color: var(--color-fg-dim)">Select at least one marathon.</p>
        {/if}
      </div>
    </Layout>

    {#if showStats}
      <About big title="More stats" onClose={() => { showStats = false }}>
        <div style="padding: var(--padding-2)" slot="content">
          <table>
            <thead>
              <tr>
                <th>Marathon</th>
                <th>Donation total</th>
                <th>Peak viewers</th>
                <th>at</th>
                <th>while playing</th>
              </tr>
            </thead>
            <tbody>
              {#each data.marathons as marathon, i}
              <tr>
                <td style="color: {marathonColor(i)};">
                  <strong>{fmtMarathonName(marathon)}</strong>
                </td>
                <td>{fmtMoney(data.meta[i].max_donations)}</td>
                <td>{data.meta[i].max_viewers.toLocaleString()}</td>
                <td>{fmtTimestamp(data.meta[i].max_viewers_ts)}</td>
                <td>{data.meta[i].max_viewers_game}</td>
              </tr>
              {/each}
              <tr></tr>
            </tbody>
          </table>
        </div>
      </About>
    {/if}
  {:catch error}
    error: {error.message}
  {/await}
</main>

<style>
  main {
    height: 100vh;
    max-height: 100vh;
    display: flex;
    flex-direction: column;
    font-size: var(--text-medium);
    background: var(--color-bg);
    color: var(--color-fg);
  }

  :global(a), :global(a:visited) {
    color: var(--color-link);
  }
  .link {
    color: var(--color-link);
    cursor: pointer;
  }

  :global(button) {
    background-color: var(--color-bg-bright);
    color: var(--color-fg);
    padding: var(--padding-1) var(--padding-2);
    margin-right: var(--padding-1);
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .skeleton {
    height: 1em;
    margin-bottom: 2px;
    background-color: var(--color-fg-dim);
    animation: pulse .5s linear alternate infinite;
    border-radius: 4px;
  }
  @keyframes pulse {
    from { opacity: 0.5 }
    to { opacity: 0.75 }
  }

  .aside-header {
    padding: var(--padding-1);
    font-size: var(--text-small);
    /* border-bottom: 1px solid var(--color-fg-dim); */
    box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.1);
    background-color: var(--color-bg);
    position: sticky;
    top: 0;
    display: flex;
    justify-content: space-between;
  }
  .aside-header h1 {
    margin: 0;
  }

  table {
    border-collapse: collapse;
    width: 100%;
  }
  th {
    text-align: left;
    border-bottom: 2px solid var(--color-fg-dimmer);
    color: var(--color-fg-subtle);
  }
  th, td {
    padding: var(--padding-2);
  }
  td {
    border-top: 1px solid var(--color-fg-dimmer);
  }

  tr:hover > td {
    background-color: var(--color-bg-dimbright);
  }

  /* tbody tr:nth-child(odd) {
    background-color: var(--color-bg-dimbright);
  } */
</style>
