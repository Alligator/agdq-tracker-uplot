  // const colors = ['#e45649', '#e06c75','#50a14f', '#98c379','#c18401', '#e5c07b','#0184bc', '#61afef','#a626a4', '#c678dd','#0997b3', '#56b6c2'];
  const colors = [
    // fg for the latest marathon
    'var(--color-fg)',

    // kinda orange?
    '#fe9929',
    '#ec7014',
    '#cc4c02',

    // green
    '#69c8a3',
    '#3ca276',
    '#297760',

    // purple
    '#8c96c6',
    '#8c6bb1',
    '#88419d',

    // blue
    '#6baed6',
    '#4292c6',
    '#2171b5',

    // grey
    '#bdbdbd',
    '#969696',
    '#737373',
  ];

  export function marathonColor(marathonIndex: number): string {
    return colors[marathonIndex % colors.length];
  }