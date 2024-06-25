export interface TrackerConfig {
  marathonName: string;
  statsFilePath: string;
  donationsColor: string;
  viewersColor: string;
  compLink: string;
  compName: string;
}

const config: TrackerConfig = {
  marathonName: 'Frost Fatales 2024',
  statsFilePath: 'frost24.json',

  // gdq
  // compLink: 'https://gdq.alligatr.co.uk/comparison/',
  // compName: 'GDQ Comparison',
  // donationsColor: '#D4674A',
  // viewersColor: '#489FB0',

  // ff
  compLink: 'https://gdq.alligatr.co.uk/ff-comparison/',
  compName: 'FF Comparison',
  donationsColor:'#d6b567',
  viewersColor:'#f29373',
};

export default config;
