<script lang="ts">
  import Chart from "./Chart.svelte";
  import Panel from "./components/Panel.svelte";
  import { ENTRY_DONATIONS, ENTRY_TS, ENTRY_VIEWERS, GAME_NAME, GAME_TS } from "./Stats";
  import type { Stats, StatGame } from './Stats';

  export let stats: Stats;
  // let games = stats.games;
  // $: games.sort((a, b) => a[0] - b[0]); // sort by timestamp

  let gameIndex: number;
  let chartSeries;

  function onGameClick(game: StatGame, idx: number) {
    gameIndex = idx;
    const nextGame = stats.games[idx + 1];
    const nextGameTime = nextGame ? nextGame[GAME_TS] : Infinity;
    chartSeries = [[], [], []];

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
    chartSeries = chartSeries;
  }
</script>

<Panel>
  <section>
    <div class="games">
      {#each stats.games as game, i}
        <div
          class="game"
          class:active={i === gameIndex}
          role="button"
          on:click={() => onGameClick(game, i)}
        >
          <div class="name">{game[1]}</div>
          <div class="runner">{game[2]}</div>
        </div>
      {/each}
    </div>
    <div class="game-graph">
      {#if typeof gameIndex !== "undefined"}
        <h2>{stats.games[gameIndex][GAME_NAME]}</h2>
        <Chart series={chartSeries} gameName={stats.games[gameIndex][GAME_NAME]} />
      {:else}
        No game selected
      {/if}
    </div>
  </section>
</Panel>

<style>
  section {
    display: flex;
  }
  .games {
    max-height: 530px;
    width: 200px;
    overflow-y: auto;
    background-color: var(--bg-light-dim);
    border-radius: 4px 0 0 4px;
    padding: var(--padding-2);
  }
  .game {
    padding-bottom: var(--padding-1);
    margin-bottom: var(--padding-1);
    border-bottom: 1px solid var(--fg-light-dimmer);
    cursor: pointer;
  }
  .game.active > .name,
  .game:hover > .name {
    font-weight: 600;
  }
  .game > .runner {
    font-size: var(--text-small);
  }
  .game-graph {
    flex-grow: 1;
    padding: var(--padding-2);
  }
</style>
