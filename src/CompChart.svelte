<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import type { Options } from "uplot";
  import uPlot from "uplot";
  import { marathonColor } from "./colors";
  import type { Theme } from "./theme";
  import { fmtMarathonName, getTzOffset, is12h, offsetTimestamp } from "./utils";

  export let timestamps: number[];
  export let data: number[][];
  export let marathons: string[];
  export let enabledMarathons: boolean[];
  export let theme: Theme;
  export let format: 'viewers' | 'donations';
  export let tz: string;

  $: renderChart(timestamps, data, marathons, enabledMarathons, theme);

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
  onDestroy(() => {
    resizeObserver.disconnect();
  });

  export function resetZoom() {
    uplot.setData(uplot.data, true);
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

  function renderChart(
    timestamps: number[],
    data: number[][],
    marathons: string[],
    enabledMarathons: boolean[],
    theme: Theme,
  ) {
    if (!chartEl) {
      return;
    }

    const filteredData = data.filter((_, i) => enabledMarathons[i]);
    filteredData.reverse();
    const series = [timestamps, ...filteredData];

    const textColor = theme['color-fg'];
    const tzOffset = getTzOffset(tz);

    chartEl.innerHTML = "";
    let valueFormatter = (self, rawValue: number) => rawValue ? "$" + uPlot.fmtNum(Math.round(rawValue)) : rawValue;
    let tickFormatter = (self, ticks) => ticks.map((tick) => '$' + fmtMoney(tick));
    
    if (format === 'viewers') {
      valueFormatter = (self, rawValue: number) => rawValue ? uPlot.fmtNum(Math.round(rawValue)) : rawValue;
      tickFormatter = (self, ticks) => ticks.map(uPlot.fmtNum);
    }

    const seriesOpts = marathons
      .map((name, i): uPlot.Series => ({
        label: fmtMarathonName(name),
        stroke: i === 0 ? theme['color-fg'] : marathonColor(i),
        width: i === 0 ? 2.5 : 1.5,
        paths: uPlot.paths.spline(),
        value: valueFormatter,
        spanGaps: false,
      }))
      .filter((_, i) => enabledMarathons[i]);

    seriesOpts.reverse();

    const opts: Options = {
      id: "chart1",
      width: chartEl.getBoundingClientRect().width,
      height: chartEl.getBoundingClientRect().height,
      plugins: [tooltipsPlugin({ valueFormatter })],
      padding: [30, 10, 0, 0],
      tzDate: ts => offsetTimestamp(ts, tzOffset),
      legend: {
        show: false,
      },
      series: [
        {
          value: is12h(tz)
            ? `{WWW} {h}:{mm} {AA} (${tz})`
            : `{WWW} {HH}:{mm} (${tz})`,
        },
        ...seriesOpts,
      ],
      axes: [
        {
          space: 100,
          stroke: textColor,
          font: '12px Inter',
          values: "{WWW} {HH}:{mm} {aa}",
          grid: { stroke: theme['color-fg-dimmer'], width: 1 },
          ticks: { stroke: theme['color-fg-dim'] },
          // scale: 'donations',
        },
        {
          size: 85,
          space: 50,
          font: '12px Inter',
          stroke: textColor,
          grid: { stroke: theme['color-fg-dimmer'], width: 1 },
          ticks: { stroke: theme['color-fg-dim'] },
          values: tickFormatter,
        },
      ],
    };

    uplot = new uPlot(opts, series as uPlot.AlignedData, chartEl);
  }

  onMount(() => renderChart(timestamps, data, marathons, enabledMarathons, theme));

  function tooltipsPlugin(opts) {
    function init(u, opts, data) {
      let over = u.over;

      let tooltip = u.cursorTooltip = document.createElement('div');
      tooltip.className = 'tooltip';
      tooltip.style.pointerEvents = 'none';
      tooltip.style.position = 'absolute';
      tooltip.style.background = theme['color-bg-dim'];
      tooltip.style.boxShadow = "0px 2px 6px rgba(0, 0, 0, 0.1)";
      tooltip.style.borderRadius = "4px";
      tooltip.style.padding = "4px 8px 8px 8px";
      tooltip.style.display = 'none';
      over.appendChild(tooltip);

      over.addEventListener("mouseleave", () => {
        if (!u.cursor._lock) {
          tooltip.style.display = 'none';
        }
      });

      over.addEventListener("mouseenter", () => {
        tooltip.style.display = null;
      });
    }

    function setCursor(u) {
      const { idx, left, top } = u.cursor;
      u.cursorTooltip.style.display = null;
      u.cursorTooltip.style.left = `${left + 10}px`;
      u.cursorTooltip.style.top = `${top + 10}px`;

      const boundingRect = u.over.getBoundingClientRect();
      const overLeft = boundingRect.left;
      if ((left + 10 + 170 + overLeft) > window.innerWidth) {
        u.cursorTooltip.style.left = `${left - 10 - 170}px`;
      }

      const overTop = boundingRect.top;
      if ((top + 240 + overTop) > window.innerHeight) {
        u.cursorTooltip.style.top = `${top - 240}px`;
      }

      const values = [];
      u.series.forEach((series, i) => {
        if (i === 0)
          return;

        if (series.show) {
          const val = u.data[i][idx]
          values.push({ series, val });
        }
      });

      values.sort((a, b) => b.val - a.val);

      const ts = u.series[0].value(u, u.data[0][idx], 0, idx);
      const tooltipContent = [ts];
      values.forEach(({ series, val }) => {
        const formattedVal = val ? opts.valueFormatter(val, val) : 'N/A';
        const highlight = series.width === 3;
        tooltipContent.push(
          `<div style="display: flex;"><div style="color: ${series._stroke}; font-weight: bold; min-width: 10ex;">` +
            `${series.label}:` +
          `</div> ${formattedVal}</div>`);
      });

      u.cursorTooltip.innerHTML = tooltipContent.join('');
    }

    return {
      hooks: {
        init,
        setCursor,
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