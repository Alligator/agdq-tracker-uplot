import uPlot from "uplot";

export function fmtMarathonName(name: string): string {
  const match = /([a-z]+)(\d\d)/.exec(name);
  let marathonName = match[1];
  switch (match[1]) {
    case 'flame': {
      marathonName = 'Flame Fatales';
      break;
    }
    case 'frost': {
      marathonName = 'Frost Fatales';
      break;
    }
    default:
      marathonName = marathonName.toUpperCase();
  }
  return `${marathonName} '${match[2]}`;
}

export function fmtMoney(amt: number): string {
  return '$' + Math.round(amt).toLocaleString();
}

const dateFormatter = uPlot.fmtDate('{WWW} {HH}:{mm} {aa}');
const tzOffset = new Date().getTimezoneOffset() * 60;
export function fmtTimestamp(ts: number): string {
  return dateFormatter(new Date((ts + tzOffset) * 1000));
}