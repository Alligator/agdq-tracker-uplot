<script lang="ts">
  import "uplot/dist/uPlot.min.css";
  import cssVars from 'svelte-css-vars';
  import { GAME_RUNNERS } from "./types";
  import type { Stats, StatGame } from './types';
  import Layout from "./components/Layout.svelte";
  import ListItem from "./components/ListItem.svelte";
  import Chart from "./Chart.svelte";
  import About from './About.svelte';
  import { darkTheme, lightTheme } from './theme';
  import Switch from "./components/Switch.svelte";
  import createSelectedGame from './stores/selected-game';
  import { marathonConfig } from "./config";
  import { getLocalTimezone, timezones } from './utils';

  let useDarkTheme = window.localStorage.getItem('theme') === 'dark';
  let theme: typeof darkTheme | typeof lightTheme;
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

  let path: string;
  if (window.location.pathname.endsWith('/')) {
    path = window.location.pathname.split('/').at(-2);
  } else {
    path = window.location.pathname.split('/').at(-1);
  }

  const params = new URLSearchParams(window.location.search);
  let tz = params.get('tz');
  if (typeof timezones[tz] === 'undefined') {
    tz = getLocalTimezone();
  }

  let showAbout = false;
  let stats: Stats = null;
  const selectedGame = createSelectedGame();

  async function fetchData(): Promise<Stats> {
    const res = await fetch(`${path}.json`);
    if (!res.ok) {
      throw new Error(res.status.toString());
    }
    stats = (await res.json()) as Stats;
    selectedGame.setGame(stats, null);

    return stats;
  }

  function onSelect(gameIndex: number | null) {
    selectedGame.setGame(stats, gameIndex);
  }

  function onChartDoubleClick(clickedGame: StatGame) {
    if ($selectedGame.index === null) {
      selectedGame.setGame(stats, stats.games.findIndex((game) => game[0] === clickedGame[0]));
    } else {
      selectedGame.setGame(stats, null);
    }
  }

  function onThemeSelect(evt) {
    useDarkTheme = evt.target.checked;
  }

  let resetZoom;
  function resetChartZoom() {
    if ($selectedGame.index === null) {
      resetZoom();
    } else {
      selectedGame.setGame(stats, null);
    }
  }

  const promise = fetchData();
</script>

<svelte:head>
  {#await promise}
    <title>alligator's gdq stats</title>
  {:then data}
    <title>{data.marathon_name} | alligator's gdq stats</title>
  {/await}
</svelte:head>

<main use:cssVars="{theme}">
  {#if showAbout}
    <About title="About" onClose={() => { showAbout = false }}>
      <svelte:fragment slot="content">
        <p>Made with ☕ by <a href="https://alligatr.co.uk">alligator</a>.</p>
        <ul>
          <li>
            <a href="{marathonConfig[stats.marathon_type].comparisonLink}">Marathon comparison chart</a>
          </li>
          <li>
            <a href="https://gdq.alligatr.co.uk/">Trackers for previous marathons</a>
          </li>
          <li>
            <a href="https://github.com/Alligator/agdq-tracker-uplot">Source code for this page</a>
          </li>
          <li>
            <a href="https://github.com/Alligator/agdq-tracker">Source code for the data fetching script</a>
          </li>
        </ul>
        <p>Special thanks to UA for giving the tracker JSON output and to the GDQ staff for keeping the schedule up to date during marathons.</p>
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
              <h1>Loading</h1>
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
            <h1>{stats.marathon_name}</h1>
            <button class="link" on:click={() => { showAbout = true }}>about</button>
          </div>
          <Switch label="Dark theme" on:click={onThemeSelect} checked={useDarkTheme} />
        </div>
        <ListItem
          active={$selectedGame.index === null}
          onClick={() => onSelect(null)}
        >
          <svelte:fragment slot="title">All games</svelte:fragment>
        </ListItem>
        {#each data.games as game, i}
        <ListItem
          active={$selectedGame.index === i}
          showSubtitle={game.length > 3}
          onClick={() => onSelect(i)}
          dim={$selectedGame.index !== i && game[0] > new Date().getTime() / 1000}
        >
          <svelte:fragment slot="title">{game[1]}</svelte:fragment>
          <svelte:fragment slot="subtitle">{game[3]}</svelte:fragment>
          {#if $selectedGame.index === i}
          <div style="font-size: var(--text-small); margin-top: var(--padding-1); line-height: 1.5; display: flex; flex-direction: column;">
            {#if stats.games[$selectedGame.index][GAME_RUNNERS]}
              <div>
                Runner(s):
                <strong style="color: var(--color-fg-bright)">
                  {stats.games[$selectedGame.index][GAME_RUNNERS]}
                </strong>
              </div>
            {/if}
            {#if $selectedGame.status !== 'not started'}
              <div>
                Duration:
                <strong style="color: var(--color-fg-bright)">
                  {$selectedGame.duration}
                </strong>
              </div>
              <div>
                Donations during:
                <strong style="color: mediumseagreen">
                  {$selectedGame.donationChanges}
                </strong>
              </div>
            {/if}
          </div>
          {/if}
        </ListItem>
        {/each}
      </div>
      <div slot="content" style="height: 100%; display: flex; flex-direction: column;">
        <div style="display:flex; justify-content: space-between; align-items: center;">
          <div style="padding: var(--padding-1)">
            <h2>{$selectedGame.index === null ? 'All Games' : stats.games[$selectedGame.index][1]}</h2>
            <span style="font-size: var(--text-small)">
              Click and drag to zoom in, double click to reset. Double click when zoomed out to select/deselect a specific game.
            </span>
          </div>
          <button
            type="button"
            style="flex-shrink: 0"
            on:click={resetChartZoom}
          >
            Reset zoom
          </button>
        </div>
        {#if !stats.viewers || stats.viewers.length < 2}
          <p style="padding: var(--padding-1); color: var(--color-fg-dim)">This marathon hasn't started yet.</p>
        {:else if $selectedGame.status === 'not started'}
          <p style="padding: var(--padding-1); color: var(--color-fg-dim)">This game hasn't started yet.</p>
        {:else}
          <Chart
            theme={theme}
            viewersColor={marathonConfig[stats.marathon_type].viewersColor}
            donationsColor={marathonConfig[stats.marathon_type].donationsColor}
            series={$selectedGame.chartSeries}
            games={data.games}
            gameName={$selectedGame.index ? stats.games[$selectedGame.index][1] : null}
            showLines={$selectedGame.index === null}
            onDoubleClick={onChartDoubleClick}
            tz={tz}
            bind:resetZoom
          />
        {/if}
      </div>
    </Layout>
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
  button.link {
    /* button overrides */
    background-color: inherit;
    color: inherit;
    border: none;
    display: block;
    text-align: left;
    font-family: inherit;
    font-size: inherit;
    padding: 0;
    margin: 0;

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
</style>
