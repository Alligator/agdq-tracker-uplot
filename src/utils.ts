import uPlot from "uplot";

export function fmtMarathonName(name: string): string {
  return name.substring(0, 4).toUpperCase() + ` '` + name.substring(4, 6);
}

export function fmtMoney(amt: number): string {
  return '$' + Math.round(amt).toLocaleString();
}

const dateFormatter = uPlot.fmtDate('{WWW} {HH}:{mm} {aa}');
const tzOffset = new Date().getTimezoneOffset() * 60;
export function fmtTimestamp(ts: number): string {
  return dateFormatter(new Date((ts + tzOffset) * 1000));
}