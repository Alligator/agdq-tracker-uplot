<script lang="ts">
  import Chart from "./Chart.svelte";
  import Panel from "./components/Panel.svelte";
  import GameList from "./GameList.svelte";
  import { ENTRY_DONATIONS, ENTRY_TS, ENTRY_VIEWERS } from "./Stats";
  import type { Stats } from './Stats';
  import "uplot/dist/uPlot.min.css";

  let mainChartSeries: [number[], number[], number[]] = [[], [], []];

  async function fetchData(): Promise<Stats> {
    const res = await fetch("sgdq21.json");
    if (!res.ok) {
      throw new Error(res.status.toString());
    }
    const json = (await res.json()) as Stats;

    mainChartSeries = [[], [], []];
    json.viewers.map((entry) => {
      mainChartSeries[0].push(entry[ENTRY_TS]);
      mainChartSeries[1].push(entry[ENTRY_VIEWERS] || null);
      mainChartSeries[2].push(entry[ENTRY_DONATIONS]);
    });

    return json;
  }
  const promise = fetchData();
</script>

<main>
  <header>
    <h1>SGDQ 2021</h1>
  </header>
  {#await promise}
    loadin'
  {:then data}
    <Panel>
      <div class="panel">
        <h2>Viewers and donations</h2>
        <p>Click and drag to zoom, double click to reset.</p>
        <Chart series={mainChartSeries} games={data.games} />
      </div>
    </Panel>
    <GameList stats={data} />
  {:catch error}
    error: {error.message}
  {/await}
  <footer>stuff</footer>
</main>

<style>
  main {
    max-width: 960px;
    margin: 0 auto;
  }
  .panel {
    padding: var(--padding-2);
  }
</style>
