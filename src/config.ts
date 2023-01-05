export interface TrackerConfig {
  marathonName: string;
  statsFilePath: string;
  donationsColor: string;
  viewersColor: string;
}

const config: TrackerConfig = {
  marathonName: 'AGDQ 20223',
  statsFilePath: 'agdq23.json',
  donationsColor: '#D4674A',
  viewersColor: '#489FB0',
};

export default config;
