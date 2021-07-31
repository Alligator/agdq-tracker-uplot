export type StatGame = [startTimestamp: number, name: string, runner: string, category: string];
export const GAME_TS = 0;
export const GAME_NAME = 1;
export const GAME_RUNNERS = 2;

export type StatEntry = [timestamp: number, viewers: number, donations: number];
export const ENTRY_TS = 0;
export const ENTRY_VIEWERS = 1;
export const ENTRY_DONATIONS = 2;

export interface Stats {
  games: StatGame[];
  viewers: StatEntry[];
}