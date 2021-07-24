<script lang="ts">
import Chart from "./Chart.svelte";
import Panel from "./components/Panel.svelte";
import GameList from "./GameList.svelte";
import type { StatGame, Stats } from "./Stats";
import 'uplot/dist/uPlot.min.css';

let mainChartSeries: [number[], number[], number[]] = [[], [], []];

async function fetchData(): Promise<Stats> {
	const res = await fetch('sgdq21.json');
	if (!res.ok) {
		throw new Error(res.status.toString());
	}
	const json = await res.json() as Stats;

	mainChartSeries = [[], [], []];
	json.viewers.map((entry) => {
		mainChartSeries[0].push(entry[0]);
		mainChartSeries[1].push(entry[1] || null);
		mainChartSeries[2].push(entry[2]);
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
		<Panel title="Viewers and donations">
			<Chart series={mainChartSeries} games={data.games} />
		</Panel>
		<GameList stats={data} />
	{:catch error}
		error: {error.message}
	{/await}
	<footer>
		stuff
	</footer>
</main>

<style>
	main {
		max-width: 960px;
		margin: 0 auto;
	}
</style>