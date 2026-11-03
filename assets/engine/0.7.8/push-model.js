/**
 * Content push on the desktop canvas (ADR-0024). Blocks are placed
 * absolutely with pixel frames, so a block whose content grows taller than
 * its frame (wrapped text, a longer feed) would draw over the blocks
 * beneath. This model moves the blocks below instead, with the rules the
 * Wix Editor publishes for its free canvas: only vertical position and size
 * count, a gap of PUSH_GAP_MAX px or less is preserved, a larger gap stays
 * until it would fall under PUSH_GAP_MIN px, a block whose top sits above the
 * grown block's vertical middle is a deliberate overlap and stays, and a move
 * cascades to the blocks below the moved block. Every block below moves, not
 * only the nearest one (the Fluid Engine reading of the same rule).
 *
 * Pure: render.js measures the growth and writes the shifts; nothing here
 * touches the DOM or the stored frames.
 */

/** A gap this small or smaller is preserved: the lower block moves the whole growth. */
export const PUSH_GAP_MAX = 70;
/** A larger gap absorbs the growth until this much is left. */
export const PUSH_GAP_MIN = 10;
/** The air left under the lowest block when the push raises a section's height. */
export const PUSH_SECTION_PAD = 24;

/**
 * The block types whose height follows their content (ADR-0025): the box is
 * drawn at the content's height, also when that is less than the frame, and
 * the editor fits the frame to the content after an edit of the block. Every
 * other type keeps the height of its frame, and text is at least as tall as
 * its words.
 */
export const FOLLOWS_CONTENT = new Set(['audio', 'calendar', 'cart', 'checkout', 'collection', 'contact', 'countdown', 'faq', 'form', 'product', 'quote', 'share', 'stats', 'table', 'timeline']);

/**
 * Whether a block's height follows its content (ADR-0025): one of the types
 * above, unless the block has been given its own height (`height.mode`).
 * @param {{type?: string, height?: {mode?: string}}} block
 * @returns {boolean}
 */
export function followsContent(block) {
  return FOLLOWS_CONTENT.has(block?.type) && block.height?.mode !== 'own';
}

/**
 * The block types that follow their content and fetch it (a feed, a
 * collection), so their height on the phone is unknown until the content is
 * drawn. The editor measures each at the phone width after an edit and
 * stores it as `mobileHeight` (0.7.21.7); the loading state stands at it on
 * the phone, so the first load of a session does not jump.
 */
export const FETCHES_CONTENT = new Set(['calendar', 'collection', 'product']);

/**
 * The height in px the loading state of a block stands at on the phone: the
 * stored `mobileHeight` of a block that fetches its content, else 0 (its
 * loading state's own height).
 * @param {{type?: string, mobileHeight?: number}} block
 * @returns {number}
 */
export function mobileLoadingHeight(block) {
  if (!block || !FETCHES_CONTENT.has(block.type)) return 0;
  const h = Number(block.mobileHeight);
  return Number.isFinite(h) && h > 0 ? Math.round(h) : 0;
}

/**
 * The block types that can use the height of a box taller than their content
 * (ADR-0025 decision 3, «stretch»): the figure and the countdown's units fill
 * the box, and a quote's card does. The calendar stretches too, by design:
 * the plain list and card views spread their rows and cards (blocks/calendar.js).
 */
export const STRETCHES = new Set(['countdown', 'quote', 'stats']);

/**
 * How a block with its own height places its content in the box (ADR-0025
 * decision 3): `top` (the default, also for a block that follows its
 * content), `middle`, `bottom` or `stretch`.
 * @param {{height?: {mode?: string, align?: string}}} block
 * @returns {'top'|'middle'|'bottom'|'stretch'}
 */
export function heightAlign(block) {
  const align = block?.height?.mode === 'own' ? block.height.align : null;
  return ['middle', 'bottom', 'stretch'].includes(align) ? align : 'top';
}

/**
 * The block types that lay themselves out by their own width (ADR-0025
 * decision 7): the ones with columns, cards or a layout that changes when the
 * box is narrow. Their box is a size container (`urd-block` in base.css), so
 * a drag narrower shows the narrow layout while it is dragged, and a block in
 * a narrow column of a wide page uses its narrow layout as on a phone.
 */
export const FOLLOWS_WIDTH = new Set(['calendar', 'collection', 'gallery', 'product', 'stats', 'table', 'timeline']);

/**
 * Whether a block lays itself out by its own width (ADR-0025).
 * @param {{type?: string}} block
 * @returns {boolean}
 */
export function followsWidth(block) {
  return FOLLOWS_WIDTH.has(block?.type);
}

/** The floor of a block's shrink (block.fitMin), a share of the design size: 0.01 to 1, default 0.6. */
export function clampFitMin(value) {
  const n = Number(value);
  return Number.isFinite(n) ? Math.min(1, Math.max(0.01, n)) : 0.6;
}

/**
 * The block types whose content cannot wrap: their frame already follows
 * the canvas in percent, so their shrink is a floor on the frame's width
 * (fitFloorPx) instead of a zoom of the content. The editor keeps the same
 * list for its option labels.
 */
export const FIT_BY_WIDTH = new Set(['image', 'video', 'shape', 'icon']);

/**
 * The block types whose size is their frame: a picture, a video, a shape, an
 * icon and a map are as large as the box the owner dragged, so a scale of
 * their content would only crop or blur it. Every other type takes «Size».
 */
export const SIZE_BY_FRAME = new Set(['image', 'video', 'shape', 'icon', 'map']);

/** The bounds of a block's size: the whole block, text included, drawn smaller or larger than it is, in steps of `step`. */
export const SIZE = { min: 0.4, max: 2, step: 0.05 };

/**
 * The bounds the owner may give the base text of a sized block, in px, and
 * the page's own base text, 16 px (base.css sets no root size).
 */
export const SIZE_TEXT = { min: 6, max: 200, base: 16 };

/**
 * The scale a type's content is drawn at when its size is 1 (ADR-0025
 * decision 6): the calendar's designs at a dense 14 px base for the page's
 * 16 px, the base of dense widgets. Every other type is drawn as it is.
 */
export const TYPE_SCALE = new Map([['calendar', 0.875]]);

/**
 * A block's size as a factor (ADR-0025 decision 6): the owner's `size`
 * inside the sizes the block may take (sizeRange), else 1. The frame-sized
 * types are always 1.
 * @param {{type?: string, size?: number}} block
 * @returns {number}
 */
export function blockSize(block) {
  if (!block || SIZE_BY_FRAME.has(block.type)) return 1;
  const size = Number(block.size);
  if (!Number.isFinite(size) || size <= 0) return 1;
  const { min, max } = sizeRange(block);
  return Math.round(Math.min(max, Math.max(min, size)) * 100) / 100;
}

/**
 * The scale a block's content is drawn at: its size times its type's scale
 * (TYPE_SCALE). The frame follows the size alone.
 * @param {{type?: string, size?: number}} block
 * @returns {number}
 */
export function drawnScale(block) {
  return Math.round(blockSize(block) * (TYPE_SCALE.get(block?.type) ?? 1) * 10000) / 10000;
}

/**
 * The base text of a block in px at size 1: a text block's own size, else
 * the page's (SIZE_TEXT.base) at its type's scale.
 * @param {{type?: string, props?: {size?: number}}} block
 * @returns {number}
 */
export function baseTextPx(block) {
  const own = Number(block?.props?.size);
  if (block?.type === 'text' && Number.isFinite(own) && own > 0) return own;
  return SIZE_TEXT.base * (TYPE_SCALE.get(block?.type) ?? 1);
}

/**
 * The sizes a block may take (ADR-0025 decision 6): inside SIZE, and where
 * the owner bounds its base text (sizeBounds), only as far as the base text
 * stays inside, in whole steps. The size scales everything alike, so these
 * are where the slider stops. Size 1 is always inside, so a block whose text
 * is already past a bound keeps its size as drawn.
 * @param {{type?: string, props?: {size?: number}, sizeMin?: number, sizeMax?: number}} block
 * @returns {{min: number, max: number}}
 */
export function sizeRange(block) {
  const base = baseTextPx(block);
  const { min, max } = sizeBounds(block);
  const step = Math.round(SIZE.step * 100);
  const lo = Math.ceil(Math.max(SIZE.min * 100, min === null ? 0 : (min / base) * 100) / step - 1e-9) * step;
  const hi = Math.floor(Math.min(SIZE.max * 100, max === null ? Infinity : (max / base) * 100) / step + 1e-9) * step;
  return { min: Math.min(100, lo) / 100, max: Math.max(100, hi) / 100 };
}

/**
 * The smallest and largest size in px the owner lets the base text of a
 * sized block take (block.sizeMin, block.sizeMax), inside SIZE_TEXT and
 * never crossed: a largest size under the smallest is raised to it. A bound
 * not set is null, and the text follows the size.
 * @param {{sizeMin?: number, sizeMax?: number}} block
 * @returns {{min: number|null, max: number|null}}
 */
export function sizeBounds(block) {
  const px = (value) => {
    const n = Number(value);
    return Number.isFinite(n) && n > 0 ? Math.min(SIZE_TEXT.max, Math.max(SIZE_TEXT.min, Math.round(n))) : null;
  };
  const min = px(block?.sizeMin);
  const max = px(block?.sizeMax);
  return { min, max: min !== null && max !== null ? Math.max(min, max) : max };
}

/**
 * The smallest width in px a block set to shrink may take, for the types in FIT_BY_WIDTH: its share of its section's design width times the floor.
 * 0 (no floor) for every other block, for a block without the field, and where the section has no design width (a full-width site or section), where nothing has a design size.
 * @param {{type?: string, fit?: string, fitMin?: number, frames?: {desktop?: {w?: number}}}} block
 * @param {number} designWidth The width in px the section's canvas has at the design width (render.js `_urdDesignW`, the editor's designWidth)
 * @returns {number}
 */
export function fitFloorPx(block, designWidth) {
  if (!block || block.fit !== 'shrink' || !FIT_BY_WIDTH.has(block.type)) return 0;
  const width = designWidth;
  const w = Number(block.frames?.desktop?.w);
  if (typeof width !== 'number' || !(width > 0) || !Number.isFinite(w) || w <= 0) return 0;
  return Math.round((w / 100) * width * clampFitMin(block.fitMin));
}

/**
 * The shift for each block below the blocks that grew.
 * @param {Array<{id: string, y: number, h: number, x?: number, grow?: number}>} items
 *   Frames in design px with the measured extra height in `grow` (0 or more).
 * @param {{gapMax?: number, gapMin?: number}} [opts]
 * @returns {{shifts: Map<string, number>, bottom: number}} The shift per id
 *   (only ids that move) and the lowest edge after the growth and the shifts.
 */
export function pushLayout(items, opts = {}) {
  const gapMax = opts.gapMax ?? PUSH_GAP_MAX;
  const gapMin = opts.gapMin ?? PUSH_GAP_MIN;
  const list = items
    .filter((it) => it && Number.isFinite(it.y) && Number.isFinite(it.h))
    .map((it) => ({ ...it, grow: Math.max(0, Number(it.grow) || 0) }))
    .sort((a, b) => (a.y - b.y) || ((a.x ?? 0) - (b.x ?? 0)));
  const shift = new Map(list.map((it) => [it.id, 0]));
  let bottom = -Infinity;

  for (const a of list) {
    // A block's own shift is growth for the blocks below it: the cascade.
    const delta = shift.get(a.id) + a.grow;
    bottom = Math.max(bottom, a.y + shift.get(a.id) + a.h + a.grow);
    if (delta <= 0) continue;
    const middle = a.y + a.h / 2;
    const b0 = a.y + a.h;
    for (const b of list) {
      if (b === a || b.y < middle) continue;
      const gap = Math.max(0, b.y - b0);
      const move = gap <= gapMax ? delta : Math.max(0, delta - (gap - gapMin));
      if (move > shift.get(b.id)) shift.set(b.id, move);
    }
  }

  const shifts = new Map();
  for (const [id, value] of shift) if (value > 0) shifts.set(id, value);
  return { shifts, bottom: Number.isFinite(bottom) ? bottom : 0 };
}

/**
 * A frame fitted to its content is an edit of the design (ADR-0025 decision
 * 5), so the data takes over what the push pass drew before the fit: a
 * taller frame moves the blocks below by the push rules, exactly as far as
 * the pass had shifted them. A shorter frame moves nothing, since the push
 * moves blocks down only. A section's own height is never written by a fit:
 * it is the owner's, and a block moved past it lies over the section below.
 * @param {Array<{id: string, frames?: {desktop?: {x?: number, y: number, h: number}}}>} blocks The section's blocks
 * @param {string} id The block whose frame is fitted
 * @param {number} h The fitted height in px
 * @returns {Map<string, number>} The new y of each block that moves
 */
export function fitMoves(blocks, id, h) {
  return fitMovesAll(blocks, new Map([[id, h]]));
}

/**
 * The same for several frames at once (the blocks under one gesture, settled
 * to the boxes the push pass draws for them): each block's growth counts as
 * the pass counted it, so the moves are the ones the pass drew with all of
 * them grown.
 * @param {Array<{id: string, frames?: {desktop?: {x?: number, y: number, h: number}}}>} blocks The section's blocks
 * @param {Map<string, number>} fits Block id to its fitted height in px
 * @returns {Map<string, number>}
 */
export function fitMovesAll(blocks, fits) {
  const items = [];
  for (const block of blocks ?? []) {
    const frame = block?.frames?.desktop;
    if (!frame || !Number.isFinite(frame.y) || !Number.isFinite(frame.h)) continue;
    const h = fits?.get(block.id);
    const grow = Number.isFinite(h) ? Math.max(0, h - frame.h) : 0;
    items.push({ id: block.id, x: frame.x ?? 0, y: frame.y, h: frame.h, grow });
  }
  const moves = new Map();
  if (!items.some((it) => it.grow > 0)) return moves;
  const { shifts } = pushLayout(items);
  for (const it of items) {
    const shift = shifts.get(it.id) ?? 0;
    if (shift) moves.set(it.id, it.y + shift);
  }
  return moves;
}

/**
 * The frames typing gives a section (ADR-0024 decision 4): the text block takes the height its words need, rounded up to the grid step, never less than it had before the typing began, and the blocks below stand where the push rules move them from where they stood then.
 * Measured from the frames before the typing, not from the last keystroke's, so words deleted give back the room they took and the blocks below return with them.
 * @param {Array<{id: string, frames?: {desktop?: {x?: number, y: number, h: number}}}>} before The section's blocks as they stood before the typing
 * @param {string} id The text block
 * @param {number} needed The height its words need now, in px
 * @param {number} [step] The grid step a grown height is rounded up to
 * @returns {Map<string, object>} The desktop frame of every block with one
 */
export function typedFrames(before, id, needed, step = 1) {
  const frames = new Map();
  const own = (before ?? []).find((b) => b?.id === id)?.frames?.desktop;
  if (!own) return frames;
  const h = needed > own.h ? Math.ceil(needed / step) * step : own.h;
  const moves = fitMoves(before, id, h);
  for (const block of before) {
    const frame = block?.frames?.desktop;
    if (!frame) continue;
    if (block.id === id) frames.set(block.id, { ...frame, h });
    else frames.set(block.id, moves.has(block.id) ? { ...frame, y: moves.get(block.id) } : { ...frame });
  }
  return frames;
}
