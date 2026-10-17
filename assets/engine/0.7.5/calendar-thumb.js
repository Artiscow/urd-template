/**
 * Schematic SVG thumbnails of the calendar designs, for the design picker in the Properties panel.
 * Pure string building (no DOM), analogous to footer-thumb.js: every design in calendar-designs.js has a drawing here under its id, and an id without one takes the plain drawing.
 * The colours are fixed, so the picker reads the same in every theme.
 */
const BG = '#0e1512';
const ACC = '#2fd6b6';
const MUT = '#5c6b64';
const DIM = '#22302a';
const PAPER = '#e8efe9';
const INK = '#16221d';
const NAVY = '#1c2340';
const CREAM = '#f3ecd8';
const GOLD = '#d0a74a';

const op = (o) => (o < 1 ? ` opacity="${o}"` : '');
const r = (x, y, w, h, fill, o = 1, rx = 2) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}"${op(o)}/>`;
const c = (x, y, rad, fill, o = 1) => `<circle cx="${x}" cy="${y}" r="${rad}" fill="${fill}"${op(o)}/>`;
const l = (x1, y1, x2, y2, stroke, w = 1, o = 1) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${w}"${op(o)}/>`;
/** Rows of something: fn(y, i) for n rows from y0 with a step. */
const rows = (n, y0, step, fn) => Array.from({ length: n }, (_, i) => fn(y0 + i * step, i)).join('');
const wrap = (body, bg = BG) => `<svg viewBox="0 0 160 80" preserveAspectRatio="none" aria-hidden="true"><rect width="160" height="80" fill="${bg}"/>${body}</svg>`;

/** A small month of dots in a box: seven columns, the marked days in the accent. */
function dotMonth(x, y, w, h, marks, fill = MUT) {
  let s = '';
  const cw = w / 7;
  const rh = h / 4;
  for (let i = 0; i < 28; i++) {
    const cx = x + (i % 7) * cw + cw / 2;
    const cy = y + Math.floor(i / 7) * rh + rh / 2;
    s += c(cx, cy, 1.6, marks.includes(i) ? ACC : fill, marks.includes(i) ? 1 : 0.55);
  }
  return s;
}

const THUMBS = {
  plain: () => rows(3, 12, 20, (y) => r(14, y, 14, 14, DIM, 1, 3) + r(34, y + 2, 70, 4, MUT, 0.9) + r(34, y + 9, 46, 3, MUT, 0.5)),
  timeline: () => l(50, 10, 50, 70, MUT, 1.2, 0.7) + rows(3, 16, 22, (y, i) => r(18, y - 3, 24, 5, MUT, 0.9) + c(50, y, 3.4, i ? MUT : ACC) + r(60, y - 3, 62, 4, MUT, 0.9) + r(60, y + 4, 40, 3, MUT, 0.5)),
  table: () => r(12, 10, 136, 10, ACC, 1, 3) + rows(4, 26, 12, (y, i) => (i % 2 ? r(12, y - 3, 136, 12, DIM, 0.8, 0) : '') + r(16, y, 20, 3, MUT, 0.9) + r(44, y, 14, 3, MUT, 0.5) + r(66, y, 44, 3, MUT, 0.9) + r(118, y, 24, 3, MUT, 0.5)),
  booklet: () => r(12, 8, 136, 64, PAPER, 1, 2) + r(20, 14, 40, 7, INK) + l(20, 26, 140, 26, INK, 1.4) + [20, 84].map((x) => rows(3, 32, 12, (y) => r(x, y, 8, 8, ACC, 1, 1) + r(x + 12, y, 36, 3, INK, 0.85) + r(x + 12, y + 5, 26, 2.5, INK, 0.4))).join(''),
  numbered: () => rows(3, 12, 20, (y) => l(14, y - 3, 146, y - 3, MUT, 0.8, 0.6) + r(14, y, 14, 12, ACC, 1, 2) + r(36, y + 1, 64, 4, MUT, 0.9) + r(36, y + 8, 44, 3, MUT, 0.5) + r(120, y + 3, 24, 4, ACC, 0.7)),
  apList: () => rows(3, 10, 21, (y) => r(12, y, 136, 17, NAVY, 1, 2) + r(18, y + 4, 10, 9, GOLD, 1, 1) + l(34, y + 3, 34, y + 14, GOLD, 0.8, 0.5) + r(40, y + 4, 26, 3, GOLD, 0.8) + r(40, y + 10, 56, 3.5, CREAM, 0.9)),
  glass: () => c(30, 14, 34, '#ff8a65', 0.55) + c(132, 70, 36, '#7fd1c4', 0.55) + c(100, 10, 20, '#ffd36b', 0.4) + rows(3, 12, 20, (y) => r(14, y, 132, 15, '#ffffff', 0.32, 6) + r(20, y + 4, 9, 7, PAPER, 0.9, 1) + r(36, y + 4, 50, 3, PAPER, 0.9) + r(36, y + 9, 34, 2.5, PAPER, 0.5)),
  posters: () => r(12, 10, 62, 60, ACC, 1, 4) + r(20, 30, 18, 20, INK, 0.9, 2) + r(20, 56, 40, 4, INK, 0.8) + r(80, 10, 32, 28, PAPER, 1, 4) + r(86, 16, 10, 10, INK, 0.8, 1) + r(116, 10, 32, 28, '#bfe9df', 1, 4) + r(122, 16, 10, 10, INK, 0.8, 1) + r(80, 42, 32, 28, DIM, 1, 4) + r(86, 48, 10, 10, ACC, 1, 1) + r(116, 42, 32, 28, DIM, 0.5, 4),
  tickets: () => rows(3, 10, 21, (y) => r(12, y, 136, 17, DIM, 1, 4) + r(12, y, 30, 17, ACC, 1, 4) + r(20, y + 4, 12, 9, INK, 0.85, 1) + l(42, y + 1, 42, y + 16, BG, 1.6) + r(50, y + 4, 50, 3.5, MUT, 0.95) + r(50, y + 10, 34, 2.5, MUT, 0.55) + r(120, y + 5, 22, 7, ACC, 0.85)),
  carousel: () => [12, 50, 88, 126].map((x, i) => r(x, 14, 34, 54, i ? DIM : ACC, 1, 4) + r(x + 6, 22, 12, 14, i ? ACC : INK, 0.9, 1) + r(x + 6, 50, 22, 3, i ? MUT : INK, 0.9) + r(x + 6, 56, 14, 2.5, i ? MUT : INK, 0.5)).join(''),
  photo: () => [12, 60, 108].map((x) => r(x, 12, 40, 56, DIM, 1, 4) + r(x, 12, 40, 26, ACC, 0.45, 4) + r(x + 4, 16, 12, 6, PAPER, 0.95, 1) + r(x + 5, 44, 28, 3.5, MUT, 0.95) + r(x + 5, 51, 20, 2.5, MUT, 0.5) + r(x + 5, 58, 14, 5, ACC, 0.9)).join(''),
  apGrid: () => [12, 60, 108].map((x) => r(x, 12, 40, 56, CREAM, 1, 2) + r(x, 12, 40, 16, NAVY, 1, 2) + l(x, 28, x + 40, 28, GOLD, 1.4) + r(x + 4, 16, 8, 8, GOLD, 1, 1) + r(x + 22, 18, 14, 4, GOLD, 0.9) + r(x + 5, 36, 28, 4, NAVY, 0.9) + r(x + 5, 44, 18, 2.5, NAVY, 0.55) + r(x + 5, 52, 24, 2.5, NAVY, 0.4)).join(''),
  bento: () => r(12, 10, 66, 40, PAPER, 1, 6) + r(18, 14, 16, 5, ACC, 1, 2) + r(18, 28, 14, 14, INK, 0.9, 1) + r(36, 38, 34, 4, INK, 0.8) + r(82, 10, 31, 18, DIM, 1, 5) + r(117, 10, 31, 18, DIM, 1, 5) + r(82, 32, 66, 18, DIM, 1, 5) + dotMonth(86, 34, 58, 14, [9, 12, 19]) + r(12, 54, 31, 18, PAPER, 1, 5) + r(47, 54, 31, 18, ACC, 0.4, 5) + r(82, 54, 66, 18, DIM, 1, 5) + r(88, 60, 30, 4, MUT, 0.9),
  weekStrip: () => r(60, 8, 40, 5, MUT, 0.9) + Array.from({ length: 7 }, (_, i) => r(12 + i * 19.6, 20, 17, 50, i === 3 ? ACC : DIM, i === 3 ? 0.25 : 1, 3) + r(15 + i * 19.6, 24, 6, 5, MUT, 0.9, 1) + ([1, 3, 5].includes(i) ? r(14 + i * 19.6, 36, 13, 7, ACC, 1, 2) : '')).join(''),
  weekPlan: () => r(12, 8, 136, 64, DIM, 0.6, 3) + rows(4, 22, 12, (y) => l(12, y, 148, y, MUT, 0.6, 0.6)) + Array.from({ length: 7 }, (_, i) => l(30 + i * 17, 14, 30 + i * 17, 72, MUT, 0.6, 0.6)).join('') + r(82, 14, 16, 58, ACC, 0.14, 0) + r(49, 36, 13, 10, ACC, 0.9, 2) + r(83, 48, 13, 14, ACC, 0.9, 2) + r(117, 24, 13, 9, PAPER, 0.7, 2),
  layers: () => r(12, 8, 136, 64, DIM, 0.6, 3) + r(70, 12, 22, 6, ACC, 0.9, 3) + r(96, 12, 22, 6, PAPER, 0.7, 3) + r(122, 12, 22, 6, MUT, 0.6, 3) + rows(3, 26, 15, (y, i) => l(12, y - 2, 148, y - 2, MUT, 0.6, 0.6) + r(16, y + 3, 16, 3, MUT, 0.9) + r([44, 62, 100][i], y + 1, [46, 22, 40][i], 8, [ACC, PAPER, '#7fd1c4'][i], 0.9, 3)),
  sidepanel: () => r(12, 8, 136, 64, DIM, 0.6, 3) + dotMonth(18, 18, 76, 48, [5, 10, 17, 24]) + r(100, 8, 48, 64, DIM, 1, 3) + r(106, 14, 26, 5, PAPER, 0.9) + rows(2, 26, 16, (y) => r(106, y, 36, 12, BG, 1, 2) + l(106, y, 106, y + 12, ACC, 2) + r(111, y + 3, 24, 3, MUT, 0.9)),
  apMonth: () => r(12, 8, 136, 64, CREAM, 1, 2) + l(12, 8, 148, 8, GOLD, 2.4) + r(58, 13, 44, 5, NAVY, 0.9) + rows(4, 26, 12, (y) => l(12, y, 148, y, GOLD, 0.6, 0.5)) + Array.from({ length: 6 }, (_, i) => l(31.4 + i * 19.4, 26, 31.4 + i * 19.4, 72, GOLD, 0.6, 0.5)).join('') + r(54, 40, 14, 5, GOLD, 0.6, 0) + l(54, 40, 54, 45, GOLD, 2) + r(112, 52, 14, 5, GOLD, 0.6, 0) + l(112, 52, 112, 57, GOLD, 2) + c(98, 32, 3.4, GOLD),
  dayPlan: () => r(34, 6, 92, 68, DIM, 0.6, 5) + r(42, 12, 40, 5, PAPER, 0.9) + Array.from({ length: 7 }, (_, i) => r(42 + i * 11, 22, 8, 9, i === 2 ? ACC : DIM, 1, 2)).join('') + rows(4, 38, 9, (y) => l(34, y, 126, y, MUT, 0.6, 0.6)) + r(56, 39, 62, 7, PAPER, 0.5, 2) + r(56, 57, 62, 7, ACC, 0.5, 2) + l(48, 51, 126, 51, ACC, 1.4) + c(48, 51, 2.2, ACC),
  yearWheel: () => `<circle cx="46" cy="40" r="24" fill="none" stroke="${DIM}" stroke-width="9"/><circle cx="46" cy="40" r="24" fill="none" stroke="${MUT}" stroke-width="9" stroke-dasharray="100 151" transform="rotate(-90 46 40)"${op(0.8)}/><circle cx="46" cy="40" r="24" fill="none" stroke="${ACC}" stroke-width="9" stroke-dasharray="13 151" stroke-dashoffset="-100" transform="rotate(-90 46 40)"/>` + c(24, 32, 2, PAPER) + c(26, 50, 2, PAPER) + c(60, 60, 2, PAPER, 0.5) + r(38, 37, 16, 6, PAPER, 0.9) + r(88, 20, 20, 4, ACC) + rows(3, 30, 13, (y) => r(88, y, 56, 9, DIM, 1, 2) + r(92, y + 3, 34, 3, MUT, 0.9)),
  heatmap: () => r(12, 8, 136, 64, DIM, 0.6, 3) + Array.from({ length: 3 }, (_, m) => Array.from({ length: 28 }, (_2, i) => r(18 + m * 44 + (i % 7) * 5.4, 16 + Math.floor(i / 7) * 5.4, 4.2, 4.2, [3, 11, 16, 24].includes((i + m * 5) % 28) ? ACC : MUT, [3, 11, 16, 24].includes((i + m * 5) % 28) ? 1 : (i * 7 + m) % 5 === 0 ? 0.6 : 0.28, 1)).join('')).join('') + r(18, 46, 124, 9, BG, 0.8, 2) + r(22, 49, 30, 3, PAPER, 0.8),
  billboard: () => r(34, 6, 92, 68, INK, 1, 6) + c(42, 14, 2, ACC) + r(48, 12, 24, 4, ACC, 0.9) + r(42, 22, 60, 7, PAPER, 0.95) + [42, 70, 98].map((x) => r(x, 36, 22, 16, DIM, 1, 3) + r(x + 6, 40, 10, 7, PAPER, 0.9, 1)).join('') + r(42, 58, 78, 9, ACC, 1, 3),
  stacked: () => r(54, 10, 70, 44, DIM, 0.7, 5) + r(46, 16, 70, 44, DIM, 1, 5) + r(38, 22, 70, 44, PAPER, 1, 5) + r(44, 28, 22, 6, ACC, 1, 3) + r(44, 40, 44, 5, INK, 0.9) + r(44, 49, 30, 3, INK, 0.5) + r(44, 56, 20, 6, ACC, 1, 2),
  noticeboard: () => r(34, 6, 92, 68, '#8a5a3c', 1, 5) + r(42, 14, 64, 28, '#fff7cc', 1, 0) + c(74, 14, 3, '#d33a2c') + r(48, 22, 40, 5, INK, 0.9) + r(48, 31, 28, 3, INK, 0.5) + r(48, 46, 58, 20, '#d9ecff', 1, 0) + c(54, 46, 2.6, '#2f6fd6') + r(54, 53, 36, 4, INK, 0.85) + r(54, 60, 44, 2.5, INK, 0.45),
  split: () => r(16, 10, 128, 60, DIM, 1, 6) + r(16, 10, 44, 42, ACC, 1, 6) + r(24, 22, 20, 22, INK, 0.9, 2) + r(68, 16, 20, 5, MUT, 0.7, 2) + r(68, 26, 58, 6, PAPER, 0.95) + r(68, 36, 40, 3, MUT, 0.7) + l(16, 52, 144, 52, MUT, 0.6, 0.6) + r(24, 58, 60, 3, MUT, 0.8) + r(24, 64, 44, 2.5, MUT, 0.5),
  band: () => r(8, 30, 144, 20, ACC, 1, 0) + r(8, 30, 40, 20, INK, 1, 0) + c(16, 40, 2, ACC) + r(22, 38, 20, 4, PAPER, 0.9) + r(56, 38, 34, 4, INK, 0.85) + c(96, 40, 1.8, INK) + r(102, 38, 34, 4, INK, 0.85) + c(142, 40, 1.8, INK),
  oneLine: () => rows(3, 12, 20, (y, i) => r(12, y, 136, 15, DIM, i ? 0.7 : 1, 4) + l(12, y + 1, 12, y + 14, i ? MUT : ACC, 3) + c(22, y + 7.5, 2.4, i ? MUT : ACC) + r(30, y + 5.5, 20, 4, i ? MUT : ACC, 0.9) + r(56, y + 5.5, 54, 4, MUT, 0.9) + (i ? '' : r(124, y + 4, 18, 7, ACC, 1, 2))),
  ring: () => r(30, 6, 100, 68, DIM, 1, 8) + `<circle cx="58" cy="34" r="15" fill="none" stroke="${MUT}" stroke-width="5"${op(0.5)}/><circle cx="58" cy="34" r="15" fill="none" stroke="${ACC}" stroke-width="5" stroke-linecap="round" stroke-dasharray="70 94" transform="rotate(-90 58 34)"/>` + r(53, 31, 10, 6, PAPER, 0.9, 1) + r(82, 24, 38, 6, PAPER, 0.95) + r(82, 35, 28, 3, MUT, 0.8) + l(38, 56, 122, 56, MUT, 0.6, 0.6) + r(38, 61, 50, 3, MUT, 0.7) + r(38, 67, 40, 3, MUT, 0.5),
  darkGlass: () => r(34, 6, 92, 68, '#121216', 1, 7) + c(112, 16, 22, ACC, 0.45) + c(46, 68, 20, '#3fb8a4', 0.35) + c(42, 14, 2, ACC) + r(48, 12, 22, 4, ACC, 0.9) + r(42, 22, 56, 6, PAPER, 0.95) + r(42, 34, 76, 3, MUT, 0.6, 1.5) + r(42, 34, 60, 3, ACC, 1, 1.5) + r(42, 42, 36, 9, PAPER, 1, 3) + r(82, 42, 36, 9, PAPER, 0.18, 3) + r(42, 56, 76, 14, PAPER, 0.1, 3) + r(47, 61, 40, 3, PAPER, 0.7),
  nextBento: () => r(40, 8, 80, 26, ACC, 1, 6) + r(46, 13, 22, 4, INK, 0.8) + r(46, 23, 44, 5, INK, 0.9) + r(40, 38, 38, 16, DIM, 1, 5) + r(82, 38, 38, 16, DIM, 1, 5) + r(40, 58, 38, 16, PAPER, 1, 5) + r(82, 58, 38, 16, ACC, 0.4, 5) + r(46, 42, 8, 7, PAPER, 0.9, 1) + r(88, 42, 8, 7, PAPER, 0.9, 1) + r(46, 62, 8, 7, INK, 0.9, 1),
  apNow: () => r(40, 6, 80, 68, CREAM, 1, 5) + r(40, 6, 80, 12, NAVY, 1, 5) + c(47, 12, 1.8, GOLD) + r(52, 10, 22, 4, GOLD, 0.9) + r(46, 24, 14, 14, NAVY, 1, 2) + r(50, 28, 6, 6, GOLD, 1, 1) + r(66, 25, 44, 5, NAVY, 0.9) + r(66, 34, 32, 3, NAVY, 0.5) + r(40, 46, 80, 28, '#eae1c7', 1, 0) + l(48, 54, 48, 66, GOLD, 1) + c(48, 54, 1.8, GOLD) + c(48, 66, 1.8, GOLD) + r(54, 52, 40, 3.5, NAVY, 0.8) + r(54, 64, 34, 3.5, NAVY, 0.8),
  apNavy: () => r(40, 6, 80, 68, NAVY, 1, 5) + c(47, 13, 1.8, GOLD) + r(52, 11, 22, 4, GOLD, 0.9) + r(46, 20, 68, 22, CREAM, 1, 3) + r(51, 25, 8, 10, GOLD, 1, 1) + r(64, 25, 40, 5, NAVY, 0.9) + r(64, 34, 26, 3, NAVY, 0.5) + `<rect x="46" y="46" width="68" height="14" rx="3" fill="#262e4f" stroke="${GOLD}" stroke-width="0.8"/>` + r(51, 50, 7, 6, GOLD, 1, 1) + r(64, 51, 36, 4, CREAM, 0.85) + r(46, 66, 50, 3, CREAM, 0.6),
  apSeries: () => r(12, 8, 136, 64, '#f5efdd', 1, 2) + l(20, 17, 34, 17, GOLD, 1) + r(38, 15, 26, 3.5, GOLD, 0.9) + r(20, 24, 58, 8, '#7a1a1a') + r(20, 38, 64, 3, NAVY, 0.6) + r(20, 44, 52, 3, NAVY, 0.6) + [20, 46, 72].map((x) => r(x, 54, 12, 2.5, GOLD, 0.9) + r(x, 60, 20, 3.5, NAVY, 0.8)).join('') + l(100, 14, 100, 66, GOLD, 0.8, 0.6) + r(108, 18, 30, 8, '#7a1a1a', 0.85) + r(108, 32, 32, 2.5, NAVY, 0.5) + r(108, 38, 26, 2.5, NAVY, 0.5),
  // R1 Tear-off pad: the paper page with its red month bar, the day as a block of ink, and the dashed rows under the dotted rule.
  pad: () => r(34, 2, 92, 72, '#fbf7ee', 1, 2) + r(34, 2, 92, 9, '#c4302b', 1, 0) + r(82, 15, 5, 24, '#1d1b18', 1, 0) + r(70, 29, 18, 4, '#1d1b18', 1, 0) + l(72, 30, 83, 16, '#1d1b18', 4) + l(40, 44, 120, 44, '#cfc6b3', 1.2) + rows(3, 50, 8, (y) => r(40, y, 14, 3, '#c4302b', 0.9) + r(58, y, 40, 3, '#1d1b18', 0.8) + r(104, y, 16, 3, '#1d1b18', 0.45)) + r(36, 76, 88, 2, '#d9d0bd', 1, 0),
  // R2 Index cards: four askew cards with the rule under their heads and typewritten lines, a stamp across the last.
  index: () => [[12, 6], [84, 6], [12, 42], [84, 42]].map(([x, y], i) => r(x, y, 64, 32, '#fdfbf3', 1, 1) + l(x + 4, y + 9, x + 60, y + 9, '#c9483b', 1.2) + rows(3, y + 14, 6, (yy) => r(x + 4, yy, 44, 2, '#2a2622', 0.7)) + (i === 3 ? r(x + 40, y + 20, 18, 7, '#c9483b', 0.8, 0) : '')).join(''),
  // R3 Departure board: an amber heading over rows of flap cells on the dark board, the last row's status in the alert colour.
  departures: () => r(10, 4, 140, 72, '#111315', 1, 4) + r(16, 10, 44, 5, '#ffb000', 1, 1) + rows(4, 22, 12, (y, i) => [16, 42, 68, 110].map((x, j) => Array.from({ length: j === 2 ? 7 : 4 }, (_, k) => r(x + k * 5.5, y, 4.5, 8, '#23272c', 1, 1)).join('')).join('') + r(130, y + 2, 14, 4, i === 3 ? '#ff5a4f' : i === 1 ? '#ffb000' : '#f4f1e6', 0.9, 1)),
  // R4 Cinema marquee: the red frame with its two rows of bulbs, the board with a large title and rows under it.
  marquee: () => r(8, 4, 144, 72, '#7a1420', 1, 6) + Array.from({ length: 12 }, (_, i) => c(16 + i * 11.6, 9, 1.8, '#ffd76a') + c(16 + i * 11.6, 71, 1.8, '#ffd76a')).join('') + r(14, 14, 132, 52, '#f6f1e4', 1, 0) + r(20, 18, 40, 3, '#7a1420', 0.9, 0) + r(20, 25, 76, 8, '#17120f', 1, 0) + r(20, 37, 60, 3, '#17120f', 0.7, 0) + rows(3, 46, 6, (y) => r(20, y, 120, 2.5, '#17120f', 0.55, 0)),
  // R5 Receipt: the paper strip with its torn bottom edge, the centred head, the rows of date, title, dot leader and time between dashed rules, and the barcode.
  receipt: () => r(46, 2, 68, 70, '#fbfaf6', 1, 0) + `<polygon points="${Array.from({ length: 17 }, (_, i) => `${46 + i * 4},72 ${48 + i * 4},75.5`).join(' ')} 114,72" fill="#fbfaf6"/>` + r(64, 6, 32, 4, '#1b1b1b', 1, 0) + r(68, 12, 24, 2.5, '#1b1b1b', 0.6, 0) + [18, 46].map((y) => rows(16, 51, 4, (x) => r(x, y, 2.4, 0.8, '#1b1b1b', 1, 0))).join('') + rows(4, 22, 6, (y, i) => r(51, y, 8, 3, '#1b1b1b', 1, 0) + r(62, y, [28, 18, 24, 14][i], 3, '#1b1b1b', 0.85, 0) + rows(Math.floor((96 - 64 - [28, 18, 24, 14][i]) / 3), 64 + [28, 18, 24, 14][i] + 2, 3, (x) => r(x, y + 2, 1, 1, '#1b1b1b', 0.6, 0)) + r(100, y, 10, 3, '#1b1b1b', 1, 0)) + rows(2, 50, 5, (y) => r(51, y, 30, 2.5, '#1b1b1b', 0.7, 0) + r(102, y, 8, 2.5, '#1b1b1b', 0.7, 0)) + Array.from({ length: 22 }, (_, i) => r(52 + i * 2.6, 61, [1, 1.8, 0.8][i % 3], 7, '#1b1b1b', 1, 0)).join(''),
  // R6 Seventies poster: the cream poster with its sunrise of arcs, the orange heading, and the mustard panel of pills with round badges in turn orange, mustard and brown.
  seventies: () => r(34, 2, 92, 76, '#f6e7c8', 1, 8) + [[20, '#e0aa2a'], [17, '#f6e7c8'], [14, '#5a3320'], [11, '#e2711d'], [8, '#e0aa2a'], [5, '#f6e7c8']].map(([rad, fill]) => c(80, 24, rad, fill)).join('') + r(34, 24, 92, 4, '#f6e7c8', 1, 0) + r(60, 26, 40, 5, '#e2711d', 1, 2) + r(66, 33, 28, 2, '#5a3320', 0.6, 1) + r(40, 38, 80, 36, '#e0aa2a', 1, 7) + rows(3, 41, 11, (y, i) => r(43, y, 74, 9, '#f6e7c8', 1, 4.5) + c(48, y + 4.5, 3.4, ['#e2711d', '#e0aa2a', '#5a3320'][i]) + r(54, y + 2.2, 30, 2.6, '#5a3320', 0.9, 1) + r(54, y + 5.8, 20, 1.6, '#5a3320', 0.5, 1) + (i === 1 ? '' : r(103, y + 2.5, 11, 4, '#5a3320', 1, 2))),
  // R7 Art deco: the gold double frame on black, the sunburst over the heading and the season line, rows of the day in gold beside the title, and the two buttons at the foot.
  deco: () => r(14, 2, 132, 76, '#0e0e10', 1, 0) + [[16, 4, 128, 72], [18.5, 6.5, 123, 67], [82, 70, 16, 4]].map(([x, y, w, h]) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="#d4af6a" stroke-width="0.6"/>`).join('') + Array.from({ length: 15 }, (_, i) => (i - 7) * 12 * Math.PI / 180).map((a) => l(80, 20, 80 + 11 * Math.sin(a), 20 - 11 * Math.cos(a), '#d4af6a', 0.9)).join('') + r(62, 23, 36, 4, '#d4af6a', 1, 0) + r(69, 29.5, 22, 1.5, '#f3ead3', 0.7, 0) + rows(3, 34, 11, (y) => l(22, y, 138, y, '#d4af6a', 0.5) + r(26, y + 2.5, 8, 5, '#d4af6a', 1, 0) + l(38, y + 1.5, 38, y + 9.5, '#d4af6a', 0.5) + r(42, y + 3, 52, 3, '#f3ead3', 0.9, 0) + r(42, y + 7.5, 32, 1.5, '#f3ead3', 0.5, 0) + r(120, y + 4.5, 15, 1.8, '#d4af6a', 0.9, 0)) + l(22, 67, 138, 67, '#d4af6a', 0.5) + r(62, 70, 16, 4, '#d4af6a', 1, 0),
  mobileAgenda: () => r(50, 4, 60, 72, '#121216', 1, 8) + r(56, 10, 22, 4, PAPER, 0.9) + Array.from({ length: 7 }, (_, i) => r(56 + i * 7.1, 18, 5.6, 9, i === 2 ? ACC : DIM, 1, 2)).join('') + rows(3, 32, 14, (y) => r(56, y, 48, 11, '#1c1c22', 1, 3) + l(67, y + 2, 67, y + 9, ACC, 1.4) + r(58, y + 4, 6, 3, MUT, 0.8) + r(70, y + 3, 26, 3, PAPER, 0.85)),
};

/** The ids that have a drawing of their own. */
export const CAL_THUMB_IDS = Object.keys(THUMBS);

/**
 * The thumbnail for a calendar design.
 * @param {string} id A design id from calendar-designs.js
 * @returns {string} inline <svg>
 */
export function calendarThumb(id) {
  const draw = THUMBS[id] ?? THUMBS.plain;
  const light = ['booklet'].includes(id);
  return wrap(draw(), light ? '#1a2620' : BG);
}
