/**
 * Pure logic for the ribbon, shared by the text marquee block and the gallery's ribbon view: one period of a doubled track, its duration computed from its width.
 * Notes: docs/engine-notes/ribbon-model.md (Urd repository).
 */

/** The drawn separators; anything else falls back to the dot. */
export const RIBBON_MARKS = ['dot', 'dash', 'slash', 'star'];

/** Every separator choice, the drawn ones plus the two open ones. */
export const RIBBON_SEPARATORS = [...RIBBON_MARKS, 'none', 'custom'];

/** Text size steps, the same four the menu uses. */
export const RIBBON_SIZES = ['sm', 'md', 'lg', 'xl'];

/**
 * How the band moves: `roll` the continuous marquee, `sway` back and forth, `step` one item at a time, and `none` standing still.
 */
export const RIBBON_MOTIONS = ['roll', 'sway', 'step', 'none'];

/**
 * How far the band reaches: `canvas` the content surface (a new band's default), `page` the window's full width, and `content` the block's own box.
 */
export const RIBBON_WIDTHS = ['canvas', 'page', 'content'];

/** The pause a visitor can count on (WCAG 2.2.2): a button at the band's edge, or a touch on the band with the button for the keyboard only. */
export const RIBBON_PAUSES = ['button', 'touch'];

/**
 * What the main stripe holds, never absent: `text` the words, `marks` the separator repeated, and `plain` an empty stripe of colour.
 */
export const RIBBON_MAIN_MODES = ['text', 'marks', 'plain'];
export const RIBBON_STRIPE_MODES = ['none', ...RIBBON_MAIN_MODES];

/**
 * Where the thin stripes sit: `stack` above and below the main one, sharing the band's height, or `edge` on the band's own top and bottom edges.
 */
export const RIBBON_STRIPE_PLACES = ['stack', 'edge'];

/** The thin stripes above and below, in px. */
export const RIBBON_THICKNESS = { min: 2, max: 40, dflt: 8 };

/** Seconds a word stands still before the ticker jumps to the next. */
export const RIBBON_DWELL = { min: 0.5, max: 10, dflt: 2.5 };

/** Speed in pixels per second. */
export const RIBBON_SPEED = { min: 10, max: 300, dflt: 60 };

/** How far the ribbon may lean, in degrees either way. */
export const RIBBON_TILT = 10;

/**
 * The items worth drawing: trimmed, and the empty ones dropped, so a row the owner has not filled in yet never leaves a hole in the band.
 * @param {unknown} items
 * @returns {Array<string>}
 */
export function ribbonItems(items) {
  return (Array.isArray(items) ? items : [])
    .map((text) => (typeof text === 'string' ? text.trim() : ''))
    .filter(Boolean);
}

/**
 * Pixels per second, inside the bounds and with a safe default for junk.
 * @param {unknown} value
 * @param {{min?: number, max?: number, fallback?: number}} [bounds]
 * @returns {number}
 */
export function normalizeSpeed(value, { min = RIBBON_SPEED.min, max = RIBBON_SPEED.max, fallback = RIBBON_SPEED.dflt } = {}) {
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) return fallback;
  return Math.min(max, Math.max(min, n));
}

/**
 * How many copies of the content one period holds: enough to reach across the band, capped so a hairline of content never builds hundreds.
 * @param {unknown} runWidth The width of ONE copy, in px
 * @param {unknown} bandWidth The visible width of the stripe, in px
 * @returns {number} Copies per period, at least 1
 */
export function ribbonPeriods(runWidth, bandWidth) {
  const run = Number(runWidth);
  const band = Number(bandWidth);
  if (!(run > 0) || !(band > 0)) return 1;
  return Math.min(64, Math.max(1, Math.ceil(band / run)));
}

/**
 * Seconds for one period, from the measured width of one copy of the track, with a floor so a short band never spins.
 * @param {unknown} trackWidth The width of ONE copy, in px
 * @param {unknown} speed Pixels per second
 * @param {{min?: number}} [opts]
 * @returns {number} Seconds
 */
export function ribbonDuration(trackWidth, speed, { min = 4 } = {}) {
  const width = Number(trackWidth);
  if (!Number.isFinite(width) || width <= 0) return min;
  return Math.max(min, width / normalizeSpeed(speed));
}

/**
 * What stands between two items: a drawn mark, the owner's own text, or nothing.
 * An own separator without text is nothing rather than a gap of spaces.
 * @param {unknown} sep
 * @param {unknown} sepText
 * @returns {{kind: 'draw'|'text'|'none', value: string}}
 */
export function separatorMark(sep, sepText) {
  if (sep === 'none') return { kind: 'none', value: '' };
  if (sep === 'custom') {
    const text = typeof sepText === 'string' ? sepText.trim() : '';
    return text ? { kind: 'text', value: text } : { kind: 'none', value: '' };
  }
  return { kind: 'draw', value: RIBBON_MARKS.includes(sep) ? sep : 'dot' };
}

/** One row, or two running against each other. */
export function ribbonRows(rows) {
  return Number(rows) === 2 ? 2 : 1;
}

/** The lean in degrees, inside the bounds; anything unusable is flat. */
export function clampTilt(deg) {
  const n = Number(deg);
  if (!Number.isFinite(n)) return 0;
  return Math.min(RIBBON_TILT, Math.max(-RIBBON_TILT, Math.round(n)));
}

/** The size step, with md for anything unknown. */
export function ribbonSize(size) {
  return RIBBON_SIZES.includes(size) ? size : 'md';
}

/** Whether the band should roll at all: never empty, never under reduced motion. */
export function canRoll({ count = 0, reducedMotion = false } = {}) {
  return count >= 1 && !reducedMotion;
}

/** The motion, with the continuous roll for anything unknown. */
export function ribbonMotion(motion) {
  return RIBBON_MOTIONS.includes(motion) ? motion : 'roll';
}

/** The band's reach (RIBBON_WIDTHS); anything else, an absent value included, is the block's own box. */
export function ribbonWidth(width) {
  return width === 'canvas' || width === 'page' ? width : 'content';
}

/** The pause form, with the button for anything unknown. */
export function ribbonPause(pause) {
  return RIBBON_PAUSES.includes(pause) ? pause : 'button';
}

/**
 * Where a band that reaches past its block is laid out, in px from the block's left edge: across the content surface or the section; null for its own box.
 * @param {'canvas'|'page'|'content'} width From ribbonWidth
 * @param {{sectionW: number, canvasW: number, canvasLeft: number, blockLeft: number}} m
 *   The section's and the canvas's widths, the canvas's left edge in the section, and the block's in the canvas
 * @returns {{width: number, offset: number}|null}
 */
export function bandReach(width, m) {
  if (width === 'page') return { width: m.sectionW, offset: -(m.blockLeft + m.canvasLeft) };
  if (width === 'canvas') return { width: m.canvasW, offset: -m.blockLeft };
  return null;
}

/**
 * Whether the band moves at all: the motion has to be one that moves, there has to be something to move, and reduced motion always wins.
 * @param {{count?: number, motion?: string, reducedMotion?: boolean}} [opts]
 * @returns {boolean}
 */
export function ribbonMoves({ count = 0, motion = 'roll', reducedMotion = false } = {}) {
  return ribbonMotion(motion) !== 'none' && canRoll({ count, reducedMotion });
}

/** What the main stripe holds; the words unless something else is asked for. */
export function mainMode(mode) {
  return RIBBON_MAIN_MODES.includes(mode) ? mode : 'text';
}

/** What a stripe above or below holds; nothing unless one is asked for. */
export function stripeMode(mode) {
  return RIBBON_STRIPE_MODES.includes(mode) ? mode : 'none';
}

/** The thin stripes' thickness in px, inside its bounds. */
export function clampThickness(px) {
  const { min, max, dflt } = RIBBON_THICKNESS;
  const n = Number(px);
  if (!Number.isFinite(n) || n <= 0) return dflt;
  return Math.min(max, Math.max(min, Math.round(n)));
}

/** Seconds per word for the ticker, inside its bounds. */
export function normalizeDwell(seconds) {
  const { min, max, dflt } = RIBBON_DWELL;
  const n = Number(seconds);
  if (!Number.isFinite(n) || n <= 0) return dflt;
  return Math.min(max, Math.max(min, n));
}

/**
 * One period for the ticker: every item stands still for its dwell before the next jump, so the duration follows the count, not the width.
 * @param {number} count Items in one copy of the track
 * @param {unknown} dwell Seconds per item
 * @returns {number} Seconds
 */
export function ribbonStepDuration(count, dwell) {
  const n = Number.isFinite(Number(count)) && Number(count) > 0 ? Math.round(Number(count)) : 1;
  return n * normalizeDwell(dwell);
}

/** Where the thin stripes sit; stacked unless the edges are asked for. */
export function stripePlace(place) {
  return place === 'edge' ? 'edge' : 'stack';
}
