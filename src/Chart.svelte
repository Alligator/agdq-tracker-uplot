<script lang="ts">
  import { onMount } from "svelte";
  import uPlot from "uplot";
  import type { Options, Plugin } from "uplot";
  import { GAME_NAME, GAME_TS } from "./Stats";
  import type { StatGame } from "./Stats";
  import type { Theme } from "./theme";

  export let series: [
    timestamps: number[],
    viewersSeries: number[],
    donationsSeries: number[]
  ];
  export let games: StatGame[] | null = null;
  export let gameName: string = null;
  export let theme: Theme;
  export let showLines = true;
  export let onDoubleClick: (game: StatGame) => void;

  $: renderChart(series, games, theme);

  let chartEl: HTMLDivElement;
  let resizeObserver: ResizeObserver;
  let uplot: uPlot;
  $: {
    if (chartEl && !resizeObserver) {
      resizeObserver = new ResizeObserver(() => {
        uplot.setSize({
          width: chartEl.getBoundingClientRect().width,
          height: chartEl.getBoundingClientRect().height,
        });
      });

      resizeObserver.observe(chartEl);
    }
  }

  function fmtMoney(amt: number): string {
    let scaledAmt = amt;
    let suffix = '';

    if (amt >= 1_000_000) {
      suffix = 'M';
      scaledAmt /= 1_000_000;
    } else if (amt >= 1000) {
      suffix = 'K';
      scaledAmt /= 1000;
    }

    scaledAmt = Math.floor(scaledAmt * 100) / 100;
    return `${scaledAmt}${suffix}`;
  }

  function renderChart(series, games, theme: Theme) {
    if (!chartEl) {
      return;
    }

    const textColor = theme['color-fg'];
    const donationsColor = 'cornflowerblue';
    const viewersColor = 'peru';

    chartEl.innerHTML = "";
    const valueFormatter = (self, rawValue: number) =>
      rawValue ? "$" + uPlot.fmtNum(Math.round(rawValue)) : rawValue;
    const opts: Options = {
      id: "chart1",
      width: chartEl.getBoundingClientRect().width,
      height: chartEl.getBoundingClientRect().height,
      padding: [30, 10, 0, 0],
      legend: {
        show: false,
      },
      plugins: showLines
        ? [tooltipsPlugin({ valueFormatter }), gameLinePlugin()]
        : [tooltipsPlugin({ valueFormatter })],
      series: [
        {
          value: "{WWW} {HH}:{mm} {aa}",
        },
        {
          label: "Viewers",
          stroke: viewersColor,
          width: 1.5,
          scale: "viewers",
          spanGaps: false,
          points: { show: false },
        },
        {
          label: "Donations",
          stroke: donationsColor,
          width: 1.5,
          scale: "donations",
          value: valueFormatter,
          points: { show: false },
        },
      ],
      axes: [
        {
          space: 100,
          stroke: textColor,
          font: '12px Inter',
          values: "{WWW} {HH}:{mm} {aa}",
          grid: { show: false },
          ticks: { stroke: theme['color-fg-dim'] },
        },
        {
          size: 85,
          space: 50,
          scale: "donations",
          font: '12px Inter',
          stroke: textColor,
          grid: { show: false },
          ticks: { stroke: theme['color-fg-dim'] },
          values: (self, ticks) =>
            ticks.map((tick) => '$' + fmtMoney(tick)),
        },
      ],
    };

    uplot = new uPlot(opts, series, chartEl);
  }

  onMount(() => renderChart(series, games, theme));

  function tooltipsPlugin(opts) {
    let zoomed = false;
    let gameAtCursor:StatGame = null;
    function init(u, opts, data) {
      let over = u.over;

      let tooltip = (u.cursorTooltip = document.createElement("div"));
      tooltip.className = "tooltip";
      tooltip.style.pointerEvents = "none";
      tooltip.style.position = "absolute";
      tooltip.style.background = theme['color-bg-dim'];
      tooltip.style.boxShadow = "0px 2px 6px rgba(0, 0, 0, 0.1)";
      tooltip.style.borderRadius = "4px";
      tooltip.style.padding = "4px 8px 8px 8px";
      tooltip.style.width = "220px";
      tooltip.style.display = "none";
      over.appendChild(tooltip);

      over.addEventListener("mouseleave", () => {
        if (!u.cursor._lock) {
          tooltip.style.display = "none";
        }
      });

      over.addEventListener('dblclick', () => {
        // ignore double clicks for zooming out
        if (zoomed) {
          zoomed = false;
          return;
        }
        onDoubleClick(gameAtCursor);
      });
    }

    function setCursor(u) {
      const { idx, left, top } = u.cursor;

      if (typeof idx !== "number") {
        u.cursorTooltip.style.display = "none";
        return;
      }

      u.cursorTooltip.style.display = null;
      u.cursorTooltip.style.left = `${left + 10}px`;
      u.cursorTooltip.style.top = `${top + 10}px`;

      const boundingRect = u.over.getBoundingClientRect();
      const overLeft = boundingRect.left;
      if ((left + 10 + 240 + overLeft) > window.innerWidth) {
        u.cursorTooltip.style.left = `${left - 10 - 220}px`;
      }

      const overTop = boundingRect.top;
      if ((top + 140 + overTop) > window.innerHeight) {
        u.cursorTooltip.style.top = `${top - 140}px`;
      }

      const ts = u.series[0].value(u.series[0], u.data[0][idx]);
      const viewers = u.series[1].value(u.series[1], u.data[1][idx]);
      const viewerColor = u.series[1].stroke();
      const donations = u.series[2].value(u.series[2], u.data[2][idx]);
      const donationColor = u.series[2].stroke();

      let gameHtml = "";
      if (gameName) {
        gameHtml = `
        <div style="min-width: 100px; padding-right: 6px;">
          <span style="color: var(--fg-light-dim); font-size: 10pt;">Game</span>
          <div style="margin-bottom: -4px; font-weight: bold;">${gameName}</div>
        </div>`;
      } else if (games != null) {
        let foundGame = games[0];
        for (let i = 0; i < games.length; i++) {
          if (games[i][GAME_TS] < u.data[0][idx]) {
            foundGame = games[i];
          }
        }
        gameAtCursor = foundGame;
        gameHtml = `
        <div style="min-width: 100px; padding-right: 6px;">
          <span style="color: var(--fg-light-dim); font-size: 10pt;">Game</span>
          <div style="margin-bottom: -4px; font-weight: bold;">${foundGame[GAME_NAME]}</div>
        </div>`;
      }

      u.cursorTooltip.innerHTML = `
      <div style="padding: 4px;font-weight: bold; font-size: 8pt; text-align: center;">${ts.toUpperCase()}</div>
      <div style="display: flex;">
        <div style="min-width: 100px; padding-right: 6px; margin-bottom: 6px;">
          <span style="color: var(--fg-light-dim); font-size: 10pt;">Viewers</span>
          <div style="margin-bottom: -4px; font-weight: bold; color: ${viewerColor}">${viewers}</div>
        </div>
        <div style="min-width: 100px; margin-bottom: 6px;">
          <span style="color: var(--fg-light-dim); font-size: 10pt;">Donation Total</span>
          <div style="margin-bottom: -4px; font-weight: bold; color: ${donationColor}">${donations}</div>
        </div>
      </div>
        ${gameHtml}`;
    }

    return {
      hooks: {
        init,
        setCursor,
        setSelect: (u) => {
          if (u.select.left > 0) {
            zoomed = true;
          }
        },
      },
    };
  }

  function gameLinePlugin(): Plugin {
    function drawAxes(u: uPlot) {
      const [startIdx, endIdx] = u.series[0].idxs;
      if (endIdx - startIdx > 3000) {
        return;
      }

      // find the first game
      const startTs = u.data[0][startIdx];
      let gameIdx = -1;
      for (let i = 0; i < games.length; i++) {
        if (games[i][0] > startTs) {
          gameIdx = i;
          break;
        }
      }

      u.ctx.save();
      u.ctx.strokeStyle = theme['color-fg-dimmer'];
      u.ctx.lineWidth = 1;

      for (let i = startIdx; i < endIdx; i++) {
        if (u.data[0][i] > games[gameIdx][0]) {

          const x = u.valToPos(u.data[0][i], u.series[0].scale, true);
          u.ctx.beginPath();
          u.ctx.moveTo(x, u.bbox.top);
          u.ctx.lineTo(x, u.bbox.height + u.bbox.top);
          u.ctx.closePath();
          u.ctx.stroke();

          gameIdx++;
          if (gameIdx >= games.length) {
            break;
          }
        }
      }

      u.ctx.restore();
    }

    return {
      hooks: {
        drawAxes,
      },
    };
  }
</script>

<div class="chart" bind:this={chartEl} />

<style>
  :global(.uplot) {
    font-family: 'Inter', sans-serif !important;
  }
  :global(.u-select) {
    background: var(--color-chart-selection) !important;
  }
  .chart {
    height: 100%;
  }
</style>