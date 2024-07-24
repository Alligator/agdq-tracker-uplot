import type { MarathonType } from "./types";

type MarathonConstants = {
  donationsColor: string;
  viewersColor: string;
  comparisonLink: string;
};

const marathonConfig: Record<MarathonType, MarathonConstants> = {
  gdq: {
    donationsColor: '#D4674A',
    viewersColor: '#489FB0',
    comparisonLink: '/comp/gdq',
  },
  ff: {
    donationsColor:'#d6b567',
    viewersColor:'#f29373',
    comparisonLink: '/comp/ff',
  },
  gdqx: {
    donationsColor: 'rgb(221, 165, 49)',
    viewersColor: '#489FB0',
    comparisonLink: '/comp/gdqx',
  }
};

export { marathonConfig };
