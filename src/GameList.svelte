<script lang="ts">
import Chart from "./Chart.svelte";
import Panel from "./components/Panel.svelte";
import type { StatGame, Stats } from "./Stats";

export let stats: Stats;
// let games = stats.games;
// $: games.sort((a, b) => a[0] - b[0]); // sort by timestamp

let gameIndex: number;
let chartSeries;

function onGameClick(game: StatGame, idx: number) {
	gameIndex = idx;
  const nextGame = stats.games[idx + 1];
  const nextGameTime = nextGame ? nextGame[0] : Infinity;
	chartSeries = [[], [], []];

  let inGame = false;
  for (let i = 0; i < stats.viewers.length; i++) {
    if (stats.viewers[i][0] >= game[0] && !inGame) {
      inGame = true;
    }

    if (inGame) {
      chartSeries[0].push(stats.viewers[i][0]);
      chartSeries[1].push(stats.viewers[i][1] || null);
      chartSeries[2].push(stats.viewers[i][2]);
    }

    if (stats.viewers[i][0] > nextGameTime && inGame) {
      break;
    }
  }
  chartSeries = chartSeries;
}
</script>

<Panel title="Per game">
  <section>
    <div class="games">
      {#each stats.games as game, i}
      <div class="game" class:active={i === gameIndex} role="button" on:click={() => onGameClick(game, i)}>
        <div class="name">{game[1]}</div>
        <div class="runner">{game[2]}</div>
      </div>
      {/each}
    </div>
    <div style="flex-grow: 1">
      {#if typeof gameIndex !== 'undefined'}
      <Chart series={chartSeries} gameName={stats.games[gameIndex][1]} />
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
    max-height: 500px;
    width: 200px;
    overflow-y: auto;
  }
  .game {
    padding-bottom: var(--padding-2);
    cursor: pointer;
  }
  .game.active > .name,
  .game:hover > .name {
    font-weight: 600;
  }
  .game > .runner {
    font-size: var(--text-small);
  }
</style>