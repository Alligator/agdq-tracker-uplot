export interface TrackerConfig {
  marathonName: string;
  statsFilePath: string;
  donationsColor: string;
  viewersColor: string;
}

const config: TrackerConfig = {
  marathonName: 'SGDQ 2022',
  statsFilePath: 'sgdq22.json',
  donationsColor: '#D4674A',
  viewersColor: '#489FB0',
};

export default config;
