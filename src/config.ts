export interface TrackerConfig {
  marathonName: string;
  statsFilePath: string;
  donationsColor: string;
  viewersColor: string;
}

const config: TrackerConfig = {
  marathonName: 'SGDQ 2021',
  statsFilePath: 'sgdq21.json',
  donationsColor: 'cornflowerblue',
  viewersColor: 'peru',
};

export default config;