import { writable } from 'svelte/store';
import type { Readable } from 'svelte/store';
import { ChartSeries, ENTRY_DONATIONS, ENTRY_TS, ENTRY_VIEWERS, GAME_TS, Stats } from '../types';

enum GameStatus {
  NotStarted = 'not started',
  InProgress = 'in progress',
  Done = 'done',
};

interface SelectedGame {
  index: number;
  status: GameStatus;
  chartSeries: ChartSeries;
  duration?: string;
  donationChanges?: string;
}

function createSelectedGame() {
  const { subscribe, update } = writable<SelectedGame | null>(null);
  let noGameSeriesCache: ChartSeries = null;

  function setGame(stats: Stats, gameIndex: number) {
    update((selectedGame) => {
      if (!stats) {
        return selectedGame;
      }

      if (gameIndex === null) {
        // no game selected
        if (noGameSeriesCache === null) {
          noGameSeriesCache = [[], [], []];
          stats.viewers.map((entry) => {
            noGameSeriesCache[0].push(entry[ENTRY_TS]);
            noGameSeriesCache[1].push(entry[ENTRY_VIEWERS] || null);
            noGameSeriesCache[2].push(entry[ENTRY_DONATIONS]);
          });
        }

        return {
          index: null,
          status: GameStatus.InProgress,
          chartSeries: noGameSeriesCache,
        };
      }

      let status = GameStatus.InProgress;
      let duration = '';
      let donationChanges = '';
      let chartSeries: ChartSeries = [[], [], []];

      const game = stats.games[gameIndex];
      const nextGame = stats.games[gameIndex + 1];
      const nextGameTime = nextGame ? nextGame[GAME_TS] : Infinity;

      // bail out early if the game hasn't started
      const latestTs = stats.viewers[stats.viewers.length - 1][ENTRY_TS];
      if (game[GAME_TS] > latestTs) {
        return {
          index: gameIndex,
          status: GameStatus.NotStarted,
          chartSeries: chartSeries,
          donationChanges: null,
          duration: null,
        };
      }

      let startDonationTotal = 0;
      let startTimestamp = 0;
      let endIndex = 0;
      let inGame = false;

      for (let i = 0; i < stats.viewers.length; i++) {
        if (stats.viewers[i][ENTRY_TS] >= game[GAME_TS] && !inGame) {
          inGame = true;
          startDonationTotal = stats.viewers[i][ENTRY_DONATIONS];
          startTimestamp = stats.viewers[i][ENTRY_TS];
        }

        if (inGame) {
          chartSeries[0].push(stats.viewers[i][ENTRY_TS]);
          chartSeries[1].push(stats.viewers[i][ENTRY_VIEWERS] || null);
          chartSeries[2].push(stats.viewers[i][ENTRY_DONATIONS]);
          endIndex = i;
        }

        if (stats.viewers[i][ENTRY_TS] > nextGameTime && inGame) {
          status = GameStatus.Done;
          break;
        }
      }

      const donations = stats.viewers[endIndex][ENTRY_DONATIONS] - startDonationTotal;
      donationChanges = Math.round(donations).toLocaleString();

      const timeDiff = stats.viewers[endIndex][ENTRY_TS] - startTimestamp;
      const mins = Math.floor((timeDiff / 60) % 60);
      const hours = Math.floor(timeDiff / 60 / 60);

      if (hours >= 1) {
        duration = `${hours} hour${hours === 1 ? '' : 's'} ${mins} minute${mins === 1 ? '' : 's'}`;
      } else {
        duration = `${mins} minutes`;
      }

      if (status === GameStatus.InProgress) {
        duration += ' and counting';
      }

      return {
        index: gameIndex,
        status,
        chartSeries,
        duration,
        donationChanges
      };
    });
  }

  return {
    subscribe,
    setGame,
  };
}

export default createSelectedGame;
