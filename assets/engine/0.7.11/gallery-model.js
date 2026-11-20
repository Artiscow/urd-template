/**
 * Pure logic for the gallery block, the lightbox and the image gallery
 * background layer: index stepping, autoplay conditions, column maths, and the
 * mosaic spans and polaroid leans of the block's two framed views (dealt by
 * the same die as the background layer's, gallery-layout.js).
 * DOM-free, so all of it is tested with node --test (tests/gallery.test.mjs);
 * the DOM rendering is tested manually.
 */
import { mosaicSpan, frameTilt } from './gallery-layout.js';

/** The views the block can draw; grid is the one an unknown value falls back to. */
export const GALLERY_VIEWS = ['grid', 'carousel', 'slides', 'ribbon', 'mosaic', 'polaroid'];

/** The views that are grids of tiles: they share the columns, the gap and the auto-grow. */
export const GRID_VIEWS = ['grid', 'mosaic', 'polaroid'];

/** The mosaic's row height in px. */
export const MOSAIC_ROW = { min: 80, max: 400, dflt: 140 };

/** The polaroids' largest lean in degrees. */
export const POLAROID_TILT = { min: 0, max: 15, dflt: 4 };

/** The view, with the grid for anything unknown. */
export function galleryView(view) {
  return GALLERY_VIEWS.includes(view) ? view : 'grid';
}

/** The die a view deals from: a positive whole number, 1 for anything else. */
export function gallerySeed(seed) {
  const n = Number(seed);
  return Number.isFinite(n) && n >= 1 ? Math.floor(n) : 1;
}

/** The mosaic's row height inside its bounds, with the default for junk. */
export function mosaicRowHeight(height) {
  const n = Number(height);
  if (!Number.isFinite(n) || n <= 0) return MOSAIC_ROW.dflt;
  return Math.min(MOSAIC_ROW.max, Math.max(MOSAIC_ROW.min, Math.round(n)));
}

/**
 * One span per picture for the mosaic view. A wide tile never asks for more
 * columns than the wall has, so a one-column wall is a plain stack.
 * @param {number} count The number of pictures
 * @param {unknown} seed
 * @param {number} cols The wall's columns (from gridColumns)
 * @returns {Array<{cols: number, rows: number}>}
 */
export function tileSpans(count, seed, cols) {
  const n = Number.isFinite(count) && count > 0 ? Math.floor(count) : 0;
  const wall = Math.max(1, Math.floor(Number(cols) || 1));
  const die = gallerySeed(seed);
  return Array.from({ length: n }, (_, i) => {
    const span = mosaicSpan(die, i);
    return { cols: Math.min(span.cols, wall), rows: span.rows };
  });
}

/**
 * One packing of the spans: first-fit, row by row, then the cells left empty
 * are given to a neighbour. A hole takes the tile above when that tile stands
 * exactly over the run of empty cells, otherwise the tile on its left or
 * right when the cells beside that tile are empty for its whole height.
 * @param {Array<{cols: number, rows: number}>} spans
 * @param {number} wall The columns
 * @returns {{tiles: Array<{col: number, row: number, cols: number, rows: number}>, rows: number, full: boolean}}
 */
function packWall(spans, wall) {
  const tiles = spans.map((span) => ({ col: 0, row: 0, cols: span.cols, rows: span.rows }));
  /** @type {Array<Array<number>>} The tile index in every cell, -1 for an empty one */
  const cells = [];
  const at = (r, c) => (cells[r]?.[c] ?? -1);
  const claim = (r, c, i) => {
    while (cells.length <= r) cells.push(new Array(wall).fill(-1));
    cells[r][c] = i;
  };
  const fits = (r, c, w, h) => {
    if (c + w > wall) return false;
    for (let y = r; y < r + h; y += 1) for (let x = c; x < c + w; x += 1) if (at(y, x) !== -1) return false;
    return true;
  };
  tiles.forEach((tile, i) => {
    for (let r = 0; ; r += 1) {
      let placed = false;
      for (let c = 0; c < wall && !placed; c += 1) {
        if (!fits(r, c, tile.cols, tile.rows)) continue;
        tile.col = c;
        tile.row = r;
        for (let y = r; y < r + tile.rows; y += 1) for (let x = c; x < c + tile.cols; x += 1) claim(y, x, i);
        placed = true;
      }
      if (placed) break;
    }
  });
  const freeBeside = (tile, c) => {
    for (let y = tile.row; y < tile.row + tile.rows; y += 1) if (at(y, c) !== -1) return false;
    return true;
  };
  const widen = (index, c) => {
    const tile = tiles[index];
    for (let y = tile.row; y < tile.row + tile.rows; y += 1) claim(y, c, index);
    tile.col = Math.min(tile.col, c);
    tile.cols += 1;
  };
  let full = true;
  for (let r = 0; r < cells.length; r += 1) {
    for (let c = 0; c < wall; c += 1) {
      if (at(r, c) !== -1) continue;
      const above = at(r - 1, c);
      const up = above === -1 ? null : tiles[above];
      if (up && up.col === c && up.row + up.rows === r && fits(r, c, up.cols, 1)) {
        for (let x = c; x < c + up.cols; x += 1) claim(r, x, above);
        up.rows += 1;
        continue;
      }
      const left = at(r, c - 1);
      if (left !== -1 && tiles[left].row === r && freeBeside(tiles[left], c)) {
        widen(left, c);
        continue;
      }
      const right = at(r, c + 1);
      if (right !== -1 && tiles[right].row === r && tiles[right].col === c + 1 && freeBeside(tiles[right], c)) {
        widen(right, c);
        continue;
      }
      full = false;
    }
  }
  return { tiles, rows: cells.length, full };
}

/**
 * The mosaic wall with every tile in its place: the spans from tileSpans are
 * packed (packWall), and the wall is a full rectangle whatever the count. A
 * hole no neighbour can take is rare; then the last tile that is larger than
 * one cell is dealt as a single cell and the wall is packed again, which ends
 * at the latest with a wall of single cells, where the last row always fills.
 * The block draws from these positions rather than leaving the packing to
 * the browser, so the wall is the same everywhere and can be tested.
 * @param {number} count The number of pictures
 * @param {unknown} seed
 * @param {number} cols The wall's columns (from gridColumns)
 * @returns {{tiles: Array<{col: number, row: number, cols: number, rows: number}>, rows: number}}
 */
export function mosaicWall(count, seed, cols) {
  const wall = Math.max(1, Math.floor(Number(cols) || 1));
  const spans = tileSpans(count, seed, wall);
  for (;;) {
    const packed = packWall(spans, wall);
    if (packed.full) return { tiles: packed.tiles, rows: packed.rows };
    let last = spans.length - 1;
    while (last >= 0 && spans[last].cols === 1 && spans[last].rows === 1) last -= 1;
    if (last < 0) return { tiles: packed.tiles, rows: packed.rows };
    spans[last] = { cols: 1, rows: 1 };
  }
}

/**
 * One lean per picture for the polaroid view, in degrees inside plus or minus
 * `tilt`. A missing tilt is the default lean; 0 stands the cards straight.
 * @param {number} count
 * @param {unknown} seed
 * @param {unknown} tilt
 * @returns {Array<number>}
 */
export function polaroidTilts(count, seed, tilt) {
  const n = Number.isFinite(count) && count > 0 ? Math.floor(count) : 0;
  const raw = Number(tilt);
  const lean = tilt === undefined || tilt === null || tilt === '' || !Number.isFinite(raw)
    ? POLAROID_TILT.dflt
    : Math.min(POLAROID_TILT.max, Math.max(POLAROID_TILT.min, raw));
  const die = gallerySeed(seed);
  return Array.from({ length: n }, (_, i) => frameTilt(die, i, lean));
}

/** Next/previous index, wrapping in both directions. An empty list always gives 0. */
export function stepIndex(current, delta, count) {
  if (!Number.isFinite(count) || count < 1) return 0;
  const base = Number.isFinite(current) ? current : 0;
  return ((((base + delta) % count) + count) % count);
}

/** Whether automatic advance is allowed: never below two images, never with reduced motion. */
export function canAutoplay({ count = 0, reducedMotion = false } = {}) {
  return count >= 2 && !reducedMotion;
}

/**
 * Whether the slideshow's timer may advance right now: it needs the autoplay
 * at all, and neither a stop the visitor made (the pause button or a step by
 * hand, which lasts) nor a hold (the pointer over the show or focus inside it,
 * which lasts as long as it stays).
 */
export function slidesRun({ count = 0, reducedMotion = false, stopped = false, held = false } = {}) {
  return canAutoplay({ count, reducedMotion }) && !stopped && !held;
}

/** Seconds between changes, with a floor and a safe default for junk values. */
export function normalizeInterval(seconds, { min = 2, fallback = 5 } = {}) {
  const n = Number(seconds);
  if (!Number.isFinite(n) || n <= 0) return fallback;
  return Math.max(min, n);
}

/** Effective column count for the grid: 1..6, never more than the images, max 2 on mobile. */
export function gridColumns(columns, count, viewport) {
  const n = Number(columns);
  let cols = Number.isFinite(n) && n >= 1 ? Math.min(6, Math.round(n)) : 3;
  if (count > 0) cols = Math.min(cols, count);
  if (viewport === 'mobile') cols = Math.min(cols, 2);
  return Math.max(1, cols);
}
