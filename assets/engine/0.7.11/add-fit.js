/**
 * A new block's box fitted to what it draws, as it is added from «+ New block», the Blocks panel or the palette: the preview measures the block (fitNewBlock in preview-edit.js), the narrowest width at which its content wraps no more and spills nowhere, and the height its content needs there; the editor writes it into the frame as part of adding the block (state/blocks.svelte.js).
 * A block whose box is what it draws keeps the size it is added at, and a pasted or duplicated block keeps its own.
 * Pure, node-tested (tests/add-fit.test.mjs); outside the visitor closure, loaded by the preview's editing layer and bundled by the editor.
 */
import { NARROW_PX, PHONE_DESIGNS } from './push-model.js';

/** The kinds whose box is what they draw, a picture, a film, a map, a shape, a grid of pictures or cards, a moving band, a form and its fields, a player, a space, which keep the size they are added at. */
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

/** The kinds that draw their content after the block stands, a calendar once its design is loaded and the privacy page once it has read the pages, and say so with the event `urd-drawn` on the block, which a new block's fit waits for. */
export const DRAWS_LATE = new Set(['calendar', 'privacy']);

/** The narrowest a fitted text stands, in px: room for the words typed into it, which the desktop's readable floor holds too (ADR-0034). */
export const TEXT_FLOOR = 140;

/** The narrowest any other fitted block stands, in px, so its box can still be found and taken hold of. */
export const BLOCK_FLOOR = 24;

/**
 * The narrowest a new block may be fitted to, in px: a text's floor or a grip's; and a block with a phone design (PHONE_DESIGNS) added at NARROW_PX or wider is never fitted below it, since it would then be drawn again in that design, by the editor, after it is shown. A calendar, which turns narrow in place, is measured again in its narrow layout instead (preview-edit.js beginNewFit).
 * @param {{type?: string}} block
 * @param {number} [startPx] The width it was added at
 * @returns {number}
 */
export function addedFloor(block, startPx = 0) {
  const floor = block?.type === 'text' ? TEXT_FLOOR : BLOCK_FLOOR;
  return PHONE_DESIGNS[block?.type] && startPx >= NARROW_PX ? Math.max(floor, NARROW_PX) : floor;
}

/**
 * Whether a plugin's block is fitted as it is added: only where its definition asks for it (`fitWhenAdded: true`, template/plugins/README.md), since a plugin may draw a loading state that says nothing of the content to come.
 * @param {{fromPlugin?: unknown, fitWhenAdded?: boolean}|null|undefined} def The block type's definition
 * @returns {boolean}
 */
export function pluginFits(def) {
  return !def?.fromPlugin || def.fitWhenAdded === true;
}

/**
 * The narrowest whole width between `lo` and `hi` at which `changes(width)` is false, found by halving; `changes(hi)` is taken as false, and a content that changes at every width narrower than `hi` keeps `hi`.
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
