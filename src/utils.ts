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

export function getLocalTimezone() {
  const formatter = Intl.DateTimeFormat('default', { timeZoneName: 'short' });
  const tzName = formatter.formatToParts(Date.now())
    .find(part => part.type === 'timeZoneName')
    return tzName.value;
}

export const timezones = {
  EST: -5, EDT: -4,
  CST: -6, CDT: -5,
  MST: -7, MDT: -6,
  PST: -8, PDT: -7,
  // any timezone not in here will use the system one
};

export function getTzOffset(tzName: string): number {
  return timezones[tzName] ?? (new Date().getTimezoneOffset() / 60 * -1);
}

// take unix timestamp, and return a Date, offset by the number of hours
export function offsetTimestamp(ts: number, offset: number): Date {
  // is this really the best way to do this?
  const tsUtc = (ts * 1000) + (new Date().getTimezoneOffset() * 6e4);
  return new Date(tsUtc + (offset * 3600000));
}

export function is12h(tzName: string) {
  if (typeof timezones[tzName] !== 'undefined') {
    // these are all 12h
    return true;
  }
  // check the local tz
  const formatter = Intl.DateTimeFormat('default', { hour: 'numeric' });
  return formatter.resolvedOptions().hour12;
}