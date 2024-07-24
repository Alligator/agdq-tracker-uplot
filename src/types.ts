export type StatGame = [startTimestamp: number, name: string, runner: string, category: string];
export const GAME_TS = 0;
export const GAME_NAME = 1;
export const GAME_RUNNERS = 2;

export type StatEntry = [timestamp: number, viewers: number, donations: number];
export const ENTRY_TS = 0;
export const ENTRY_VIEWERS = 1;
export const ENTRY_DONATIONS = 2;

export type MarathonType = 'gdq' | 'ff' | 'gdqx';

export interface Stats {
  marathon_name: string;
  marathon_type: MarathonType;
  games: StatGame[];
  viewers: StatEntry[];
}

export type ChartSeries = [number[], number[], number[]];

export interface CompStats {
  name: string;
  ts: number[];
  viewers: number[][];
  donations: number[][];
  marathons: string[];
  meta: {
    max_donations: number;
    max_viewers: number;
    max_viewers_ts: number;
    max_viewers_game: string;
  }[],
}
