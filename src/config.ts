import type { MarathonType } from "./types";

type MarathonConstants = {
  donationsColor: string;
  viewersColor: string;
  ytViewersColor: string;
  comparisonLink?: string;
};

const defaults: MarathonConstants = {
  donationsColor:'#d6b567',
  viewersColor: 'rgb(165, 131, 235)',
  ytViewersColor: '#CA636D',
  comparisonLink: '/comp/gdq',
};

const marathonConfig: Record<MarathonType, MarathonConstants> = {
  gdq: {
    ...defaults,
    comparisonLink: '/comp/gdq',
  },
  ff: {
    ...defaults,
    comparisonLink: '/comp/ff',
  },
  gdqx: {
    ...defaults,
    comparisonLink: '/comp/gdqx',
  },
  btb: {
    ...defaults,
  },
  gdqueer: {
    ...defaults,
  },
};

export { marathonConfig };
