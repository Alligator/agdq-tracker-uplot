<script lang="ts">
  import "uplot/dist/uPlot.min.css";
  import cssVars from 'svelte-css-vars';
  import { ENTRY_DONATIONS, ENTRY_TS, ENTRY_VIEWERS, GAME_RUNNERS, GAME_TS } from "./types";
  import type { Stats, StatGame } from './types';
  import Layout from "./components/Layout.svelte";
  import ListItem from "./components/ListItem.svelte";
  import Chart from "./Chart.svelte";
  import About from './About.svelte';
  import { darkTheme, lightTheme } from './theme';
  import Switch from "./components/Switch.svelte";
  import config from './config';
  import createSelectedGame from './stores/selected-game';

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
  let stats: Stats = null;
  const selectedGame = createSelectedGame();

  async function fetchData(): Promise<Stats> {
    const res = await fetch(config.statsFilePath);
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

<main use:cssVars="{theme}">
  {#if showAbout}
    <About title="About" onClose={() => { showAbout = false }}>
      <svelte:fragment slot="content">
        <p>GDQ stats by <a href="https://alligatr.co.uk">alligator</a>.</p>
        <ul>
          <li>
            <a href="https://irc.alligatr.co.uk/agdq-comparison-uplot/">Marathon comparison chart</a>
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
              <h1>{config.marathonName}</h1>
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
            <h1>{config.marathonName}</h1>
            <span class="link" on:click={() => { showAbout = true }}>about</span>
          </div>
          <Switch label="Dark theme" on:click={onThemeSelect} checked={useDarkTheme} />
        </div>
        <ListItem
          active={$selectedGame.index === null}
          on:click={() => onSelect(null)}
        >
          <svelte:fragment slot="title">All games</svelte:fragment>
        </ListItem>
        {#each data.games as game, i}
        <ListItem
          active={$selectedGame.index === i}
          on:click={() => onSelect(i)}
        >
          <svelte:fragment slot="title">{game[1]}</svelte:fragment>
          <svelte:fragment slot="subtitle">{game[3]}</svelte:fragment>
          {#if $selectedGame.index === i}
          <div style="font-size: var(--text-small); margin-top: var(--padding-1); line-height: 1.5">
            Runner(s):
            <strong style="color: var(--color-fg-bright)">
              {stats.games[$selectedGame.index][GAME_RUNNERS]}
            </strong>
            {#if $selectedGame.status !== 'not started'}
              <br />
              Duration:
              <strong style="color: var(--color-fg-bright)">
                {$selectedGame.duration}
              </strong>
              <br />
              Donations during:
              <strong style="color: mediumseagreen">
                {$selectedGame.donationChanges}
              </strong>
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
        {#if !stats.viewers || stats.viewers.length === 0}
          <p style="padding: var(--padding-1); color: var(--color-fg-dim)">This marathon hasn't started yet.</p>
        {:else if $selectedGame.status === 'not started'}
          <p style="padding: var(--padding-1); color: var(--color-fg-dim)">This game hasn't started yet.</p>
        {:else}
          <Chart
            theme={theme}
            series={$selectedGame.chartSeries}
            games={data.games}
            gameName={$selectedGame.index ? stats.games[$selectedGame.index][1] : null}
            showLines={$selectedGame.index === null}
            onDoubleClick={onChartDoubleClick}
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
</style>
