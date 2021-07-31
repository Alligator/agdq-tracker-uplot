<script lang="ts">
  import "uplot/dist/uPlot.min.css";
  import cssVars from 'svelte-css-vars';
  import { ENTRY_DONATIONS, ENTRY_TS, ENTRY_VIEWERS, GAME_TS } from "./Stats";
  import type { Stats, StatGame } from './Stats';
  import Layout from "./components/Layout.svelte";
  import ListItem from "./components/ListItem.svelte";
  import Chart from "./Chart.svelte";
  import About from './About.svelte';
  import { darkTheme, lightTheme } from './theme';
  import Switch from "./components/Switch.svelte";

  let useDarkTheme = window.localStorage.getItem('theme') === 'dark';
  let theme;
  $: {
    theme = useDarkTheme ? { ...darkTheme } : { ...lightTheme };
    window.localStorage.setItem('theme', useDarkTheme ? 'dark' : 'light');
  }

  let showAbout = false;
  let stats: Stats = null;
  let selectedGameIndex: number | null = null;
  let chartSeries: [number[], number[], number[]] = [[], [], []];

  $: {
    chartSeries = [[], [], []];
    if (stats && selectedGameIndex === null) {
      stats.viewers.map((entry) => {
        chartSeries[0].push(entry[ENTRY_TS]);
        chartSeries[1].push(entry[ENTRY_VIEWERS] || null);
        chartSeries[2].push(entry[ENTRY_DONATIONS]);
      });
    } else if (stats) {
      const game = stats.games[selectedGameIndex];
      const nextGame = stats.games[selectedGameIndex + 1];
      const nextGameTime = nextGame ? nextGame[GAME_TS] : Infinity;
      let inGame = false;
      for (let i = 0; i < stats.viewers.length; i++) {
        if (stats.viewers[i][ENTRY_TS] >= game[GAME_TS] && !inGame) {
          inGame = true;
        }

        if (inGame) {
          chartSeries[0].push(stats.viewers[i][ENTRY_TS]);
          chartSeries[1].push(stats.viewers[i][ENTRY_VIEWERS] || null);
          chartSeries[2].push(stats.viewers[i][ENTRY_DONATIONS]);
        }

        if (stats.viewers[i][ENTRY_TS] > nextGameTime && inGame) {
          break;
        }
      }
    }
    chartSeries = chartSeries;
  }

  async function fetchData(): Promise<Stats> {
    const res = await fetch("sgdq21.json");
    if (!res.ok) {
      throw new Error(res.status.toString());
    }
    stats = (await res.json()) as Stats;

    return stats;
  }

  function onSelect(gameIndex: number | null) {
    selectedGameIndex = gameIndex;
  }

  function onChartDoubleClick(clickedGame: StatGame) {
    if (selectedGameIndex === null) {
      selectedGameIndex = stats.games.findIndex((game) => game[0] === clickedGame[0]);
    } else {
      selectedGameIndex = null;
    }
  }

  function onThemeSelect(evt) {
    useDarkTheme = evt.target.checked;
  }

  const promise = fetchData();
</script>

<main use:cssVars="{theme}">
  {#if showAbout}
    <About onClose={() => { showAbout = false }} />
  {/if}
  {#await promise}
    loadin'
  {:then data}
    <Layout>
      <div slot="aside">
        <div class="aside-header">
          <div>
            <h1>SGDQ 2021 Stats</h1>
            <span class="link" on:click={() => { showAbout = true }}>about</span>
          </div>
          <Switch label="Dark theme" on:click={onThemeSelect} checked={useDarkTheme} />
        </div>
        <ListItem
          title="All games"
          active={selectedGameIndex === null}
          on:click={() => onSelect(null)}
        />
        {#each data.games as game, i}
        <ListItem
          title={game[1]}
          subtitle={game[3]}
          active={selectedGameIndex === i}
          on:click={() => onSelect(i)}
        />
        {/each}
      </div>
      <div slot="content" style="height: 100%; display: flex; flex-direction: column;">
        <div style="padding: var(--padding-1)">
          <h2>{selectedGameIndex === null ? 'All Games' : stats.games[selectedGameIndex][1]}</h2>
          <span style="font-size: var(--text-small)">
            Click and drag to zoom in, double click to reset. Double click when zoomed out to select/deselect a specific game.
          </span>
        </div>
        <Chart
          slot="content"
          theme={theme}
          series={chartSeries}
          games={data.games}
          gameName={selectedGameIndex ? stats.games[selectedGameIndex][1] : null}
          onDoubleClick={onChartDoubleClick}
        />
      </div>
    </Layout>
  {:catch error}
    error: {error.message}
  {/await}
  <!-- <footer>stuff</footer> -->
</main>

<style>
  main {
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
