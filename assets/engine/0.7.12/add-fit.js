/**
 * A new block's box fitted to what it draws: the narrowest width at which its content wraps no more, and the height it needs there.
 * Pure; tests/add-fit.test.mjs.
 */
import { NARROW_PX, PHONE_DESIGNS } from './push-model.js';

/** The kinds whose box is what they draw, which keep the size they are added at. */
export const KEEPS_ADDED_SIZE = new Set(['image', 'video', 'map', 'shape', 'gallery', 'collection', 'product', 'ribbon', 'form', 'checkout', 'audio', 'spacer']);

/**
 * Whether a new block's box is fitted to what it draws: every kind but those whose box is what they draw, a text in a box among them.
 * @param {{type?: string, props?: object}} block
 * @returns {boolean}
 */
export function fitsWhenAdded(block) {
  if (!block?.type || KEEPS_ADDED_SIZE.has(block.type)) return false;
  return !(block.type === 'text' && block.props?.box);
}

/** The kinds that draw their content after the block stands and send `urd-drawn` on the block, which a new block's fit waits for. */
export const DRAWS_LATE = new Set(['calendar', 'privacy']);

/** The narrowest a fitted text stands, in px: room for the words typed into it, which the desktop's readable floor holds too (ADR-0034). */
export const TEXT_FLOOR = 140;

/** The narrowest any other fitted block stands, in px, so its box can still be found and taken hold of. */
export const BLOCK_FLOOR = 24;

/**
 * The narrowest a new block may be fitted to, in px: a text's floor or a grip's, and NARROW_PX for a block with a phone design added at that width or wider.
 * @param {{type?: string}} block
 * @param {number} [startPx] The width it was added at
 * @returns {number}
 */
export function addedFloor(block, startPx = 0) {
  const floor = block?.type === 'text' ? TEXT_FLOOR : BLOCK_FLOOR;
  return PHONE_DESIGNS[block?.type] && startPx >= NARROW_PX ? Math.max(floor, NARROW_PX) : floor;
}

/**
 * Whether a block type's definition lets it be fitted as it is added: a core type's always, a plugin's only with `fitWhenAdded: true`.
 * @param {{fromPlugin?: unknown, fitWhenAdded?: boolean}|null|undefined} def The block type's definition
 * @returns {boolean}
 */
export function pluginFits(def) {
  return !def?.fromPlugin || def.fitWhenAdded === true;
}

/**
 * The narrowest whole width between `lo` and `hi` at which `changes(width)` is false, found by halving; `changes(hi)` is taken as false.
 * @param {number} lo The narrowest width allowed
 * @param {number} hi The width the block is added at
 * @param {(width: number) => boolean} changes Whether the content at that width wraps more or spills, compared with `hi`
 * @returns {number}
 */
export function narrowestWidth(lo, hi, changes) {
  const top = Math.round(hi);
  let bad = Math.min(Math.round(lo), top);
  if (!changes(bad)) return bad;
  let good = top;
  while (good - bad > 1) {
    const mid = Math.floor((good + bad) / 2);
    if (changes(mid)) bad = mid;
    else good = mid;
  }
  return good;
}

/**
 * A frame fitted to a new width and height, its horizontal centre kept where the block was put, its top where it stood, and kept inside the canvas.
 * @param {{x: number, w: number, h: number}} frame The desktop frame, x and w in percent of the canvas
 * @param {number} w The fitted width, in percent
 * @param {number} h The fitted height, in px
 * @returns {{x: number, w: number, h: number}}
 */
export function fittedFrame(frame, w, h) {
  const width = Math.round(Math.min(w, 100) * 100) / 100;
  const x = Math.round(Math.max(0, Math.min(100 - width, frame.x + (frame.w - width) / 2)) * 100) / 100;
  return { ...frame, x, w: width, h: Math.max(1, Math.round(h)) };
}
