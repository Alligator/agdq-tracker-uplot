export type StatGame = [startTimestamp: number, name: string, runner: string];
export type StatEntry = [timestamp: number, viewers: number, donations: number];
export interface Stats {
  games: StatGame[];
  viewers: StatEntry[];
}