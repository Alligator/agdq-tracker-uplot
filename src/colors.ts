  // const colors = ['#e45649', '#e06c75','#50a14f', '#98c379','#c18401', '#e5c07b','#0184bc', '#61afef','#a626a4', '#c678dd','#0997b3', '#56b6c2'];
  const colors = [
    // fg for the latest marathon
    'var(--color-fg)',

    // 12-bit rainbow
    '#938',
    '#a45',
    '#c66',
    '#e94',
    '#ca0',
    '#8c4',
    '#4d8',
    '#2cb',
    '#0bc',
    '#09c',
    '#36b',
    '#75a',

    // everything else is grey
    '#a99',
    '#8a8',
    '#77a',
  ];

  export function marathonColor(marathonIndex: number): string {
    if (marathonIndex < colors.length) {
      return colors[marathonIndex];
    }
    return colors[colors.length - 1];
  }