<script lang="ts">
  import { onMount } from "svelte";
  import uPlot from "uplot";
  import type { Options } from "uplot";
  import { GAME_NAME, GAME_TS } from "./Stats";
  import type { StatGame } from "./Stats";

  export let series: [
    timestamps: number[],
    viewersSeries: number[],
    donationsSeries: number[]
  ];
  export let games: StatGame[] | null = null;
  export let gameName: string = null;
  $: renderChart(series, games);

  let chartEl: HTMLDivElement;

  function renderChart(series, games) {
    if (!chartEl) {
      return;
    }
    chartEl.innerHTML = "";
    const valueFormatter = (self, rawValue: number) =>
      rawValue ? "$" + uPlot.fmtNum(Math.round(rawValue)) : rawValue;
    const opts: Options = {
      id: "chart1",
      width: chartEl.getBoundingClientRect().width,
      height: 500,
      padding: [10, 10, 0, 0],
      legend: {
        show: false,
      },
      plugins: [tooltipsPlugin({ valueFormatter })],
      series: [
        {
          value: "{WWW} {HH}:{mm} {aa}",
        },
        {
          label: "Viewers",
          stroke: "#cC2E65",
          width: 2,
          paths: uPlot.paths.spline(),
          scale: "viewers",
          spanGaps: false,
          points: { show: false },
        },
        {
          label: "Donations",
          stroke: "#7939ce",
          width: 2,
          scale: "donations",
          paths: uPlot.paths.spline(),
          value: valueFormatter,
          points: { show: false },
        },
      ],
      axes: [
        {
          space: 100,
          stroke: "#705060",
          values: "{WWW} {HH}:{mm} {aa}",
        },
        {
          size: 100,
          space: 50,
          scale: "donations",
          stroke: "#705060",
          values: (self, ticks) =>
            ticks.map((tick) => valueFormatter(self, tick)),
        },
      ],
    };

    const plot = new uPlot(opts, series, chartEl);
  }

  onMount(() => renderChart(series, games));

  function tooltipsPlugin(opts) {
    function init(u, opts, data) {
      let over = u.over;

      let tooltip = (u.cursorTooltip = document.createElement("div"));
      tooltip.className = "tooltip";
      tooltip.style.pointerEvents = "none";
      tooltip.style.position = "absolute";
      tooltip.style.background = "rgba(231, 228, 234, 0.95)";
      tooltip.style.boxShadow = "0px 2px 6px rgba(0, 0, 0, 0.1)";
      tooltip.style.borderRadius = "8px";
      tooltip.style.padding = "4px 8px 8px 8px";
      tooltip.style.width = "220px";
      tooltip.style.display = "none";
      over.appendChild(tooltip);

      over.addEventListener("mouseleave", () => {
        if (!u.cursor._lock) {
          tooltip.style.display = "none";
        }
      });

      over.addEventListener("mouseenter", () => {
        tooltip.style.display = null;
      });
    }

    function setCursor(u) {
      const { idx, left, top } = u.cursor;
      if (typeof idx !== "number") {
        u.cursorTooltip.style.display = "none";
        return;
      }

      u.cursorTooltip.style.left = `${left + 10}px`;
      u.cursorTooltip.style.top = `${top + 10}px`;

      const ts = u.series[0].value(u.series[0], u.data[0][idx]);
      const viewers = u.series[1].value(u.series[1], u.data[1][idx]);
      const viewerColor = u.series[1].stroke();
      const donations = u.series[2].value(u.series[2], u.data[2][idx]);
      const donationColor = u.series[2].stroke();

      let gameHtml = "";
      if (gameName) {
        gameHtml = `
        <div style="min-width: 100px; padding-right: 6px;">
          <span style="color: var(--fg-light-dim); font-size: 10pt;">game</span>
          <div style="margin-bottom: -4px; font-weight: bold;">${gameName}</div>
        </div>`;
      } else if (games != null) {
        let foundGame = games[0];
        for (let i = 0; i < games.length; i++) {
          if (games[i][GAME_TS] < u.data[0][idx]) {
            foundGame = games[i];
          }
        }
        gameHtml = `
        <div style="min-width: 100px; padding-right: 6px;">
          <span style="color: var(--fg-light-dim); font-size: 10pt;">game</span>
          <div style="margin-bottom: -4px; font-weight: bold;">${foundGame[GAME_NAME]}</div>
        </div>`;
      }

      u.cursorTooltip.innerHTML = `
      <div style="padding: 4px;font-weight: bold; font-size: 10pt; text-align: center;">${ts.toUpperCase()}</div>
      <div style="display: flex;">
        <div style="min-width: 100px; padding-right: 6px; margin-bottom: 6px;">
          <span style="color: var(--fg-light-dim); font-size: 10pt;">viewers</span>
          <div style="margin-bottom: -4px; font-weight: bold; color: ${viewerColor}">${viewers}</div>
        </div>
        <div style="min-width: 100px; margin-bottom: 6px;">
          <span style="color: var(--fg-light-dim); font-size: 10pt;">donation total</span>
          <div style="margin-bottom: -4px; font-weight: bold; color: ${donationColor}">${donations}</div>
        </div>
      </div>
        ${gameHtml}`;
    }

    return {
      hooks: {
        init,
        setCursor,
      },
    };
  }
</script>

<div bind:this={chartEl} />
