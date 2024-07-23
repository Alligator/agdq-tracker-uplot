import { MarathonType, Stats } from "./types";

type MarathonConstants = {
  donationsColor: string;
  viewersColor: string;
  comparisonLink: string;
};

const marathonConfig: Record<MarathonType, MarathonConstants> = {
  gdq: {
    donationsColor: '#D4674A',
    viewersColor: '#489FB0',
    comparisonLink: '/comparison/',
  },
  ff: {
    donationsColor:'#d6b567',
    viewersColor:'#f29373',
    comparisonLink: '/ff-comparison/',
  },
  gdqx: {
    donationsColor: "",
    viewersColor: "",
    comparisonLink: ""
  }
};

export { marathonConfig };
