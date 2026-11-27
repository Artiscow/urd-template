/**
 * Content push on the desktop canvas (ADR-0024): a block grown taller than its frame moves the blocks below. Pure: nothing here touches the DOM or stored frames.
 * Notes: docs/engine-notes/push-model.md (Urd repository).
 */

/** A gap this small or smaller is preserved: the lower block moves the whole growth. */
export const PUSH_GAP_MAX = 70;
/** A larger gap absorbs the growth until this much is left. */
export const PUSH_GAP_MIN = 10;
/** The air left under the lowest block when the push raises a section's height. */
export const PUSH_SECTION_PAD = 24;

/**
 * The block types whose height follows their content (ADR-0025): drawn at the content's height, even under the frame's; the editor fits the frame after an edit.
 */
export const FOLLOWS_CONTENT = new Set(['audio', 'calendar', 'cart', 'checkout', 'collection', 'contact', 'countdown', 'faq', 'form', 'privacy', 'product', 'quote', 'share', 'stats', 'table', 'timeline']);

/** The shapes a video can be given, width:height: widescreen, classic, square, vertical, cinema and portrait. Without one the video fills its frame. */
export const VIDEO_ASPECTS = ['16:9', '4:3', '1:1', '9:16', '21:9', '4:5'];

/** The shapes an image block can be given in the image editor: its picture's own, and the common ratios. Without one the picture fills its frame. */
export const IMAGE_ASPECTS = ['original', '1:1', '4:3', '3:2', '16:9', '9:16', '4:5'];

/** Every ratio a shape can name, width:height. */
const RATIOS = new Set([...VIDEO_ASPECTS, ...IMAGE_ASPECTS.filter((a) => a !== 'original')]);

/**
 * A shape as its width divided by its height, or null for none (the video fills its frame) and for a picture's own shape, which only the picture knows.
 * @param {unknown} aspect
 * @returns {number|null}
 */
export function aspectRatio(aspect) {
  if (!RATIOS.has(aspect)) return null;
  const [w, h] = aspect.split(':').map(Number);
  return w / h;
}

/**
 * Whether a block keeps a shape (ADR-0025): a video given one, or an image block with a picture given one; its height follows its width.
 * @param {{type?: string, props?: {aspect?: unknown, src?: unknown}}} block
 * @returns {boolean}
 */
export function keepsShape(block) {
  if (block?.type === 'video') return VIDEO_ASPECTS.includes(block.props?.aspect);
  if (block?.type === 'image') return IMAGE_ASPECTS.includes(block.props?.aspect) && Boolean(block.props?.src);
  return false;
}

/**
 * The frame height of a block that keeps a shape, for a content surface of the given width: its width there over the shape.
 * @param {{type?: string, props?: {aspect?: unknown}, frames?: {desktop?: {w?: number}}}} block
 * @param {number} surfacePx The content surface's width in px
 * @returns {number} 0 for a block without a shape, with the picture's own shape (the preview measures it), or without a width to measure by
 */
export function shapeHeight(block, surfacePx) {
  const w = Number(block?.frames?.desktop?.w);
  const ratio = keepsShape(block) ? aspectRatio(block.props.aspect) : null;
  if (!ratio || !(surfacePx > 0) || !(w > 0)) return 0;
  return Math.max(1, Math.round(((w / 100) * surfacePx) / ratio));
}

/**
 * Whether a block's height follows its content (ADR-0025): one that keeps a shape or folds into questions, or a FOLLOWS_CONTENT type without `height.mode` 'own'.
 * @param {{type?: string, height?: {mode?: string}, props?: object}} block
 * @returns {boolean}
 */
export function followsContent(block) {
  return keepsShape(block) || foldsIntoQuestions(block) || (FOLLOWS_CONTENT.has(block?.type) && block.height?.mode !== 'own');
}

/**
 * Whether a terms or text block is in the questions design (doc-look.js): its rows fold out, the first open, so its height is the rows' as drawn.
 * @param {{type?: string, props?: object}} block
 * @returns {boolean}
 */
export function foldsIntoQuestions(block) {
  return (block?.type === 'terms' || block?.type === 'text') && block.props?.design === 'questions';
}

/**
 * The block types with a phone design (`phoneDesign`), drawn while the block is narrow by its own width (NARROW_PX), each by the prop its design is kept in.
 */
export const PHONE_DESIGNS = { gallery: 'view', collection: 'view', contact: 'design', stats: 'variant', privacy: 'design', terms: 'design' };

/* Each such block's design ids, the ones a phone design may name: the blocks' own catalogues hold the same (tests/block-designs.test.mjs holds them equal). */
const PHONE_DESIGN_IDS = {
  gallery: ['grid', 'carousel', 'slides', 'ribbon', 'mosaic', 'polaroid'],
  collection: ['cards', 'list', 'archive'],
  contact: ['lines', 'icons', 'card', 'tiles', 'facts', 'buttons', 'map', 'strip', 'poster', 'roles', 'qr'],
  stats: ['plain', 'cards', 'band'],
  privacy: ['long', 'contents', 'glance', 'questions', 'ledger', 'ledger-cards'],
  terms: ['long', 'contents', 'glance', 'questions', 'clauses'],
};

/** The design ids a block's phone design may name (its own designs), empty for a block without phone designs. */
export function phoneDesignIds(type) {
  return PHONE_DESIGN_IDS[type] ?? [];
}

/** The width in px below which a block is narrow: where seven columns stop being readable, the calendar's narrow layouts and the phone designs alike. */
export const NARROW_PX = 540;

/**
 * Whether a block draws a phone design of its own: a block that has phone designs, with one of its own designs chosen.
 * @param {string} type
 * @param {object} props
 */
export function hasPhoneDesign(type, props) {
  return phoneDesignIds(type).includes(props?.phoneDesign);
}

/**
 * The props a block is drawn with at its width: its phone design in its design's place while it is narrow, its own props otherwise.
 * @param {string} type
 * @param {object} props
 * @param {boolean} narrow
 * @returns {object}
 */
export function propsForWidth(type, props, narrow) {
  if (!narrow || !hasPhoneDesign(type, props)) return props;
  return { ...props, [PHONE_DESIGNS[type]]: props.phoneDesign };
}

/**
 * A block as it is drawn at its width: its phone design in its design's place while narrow, so the rules that read the design read the one drawn.
 * @param {{type?: string, props?: object}} block
 * @param {boolean} narrow
 */
export function drawnBlock(block, narrow) {
  return narrow && hasPhoneDesign(block?.type, block?.props) ? { ...block, props: propsForWidth(block.type, block.props, true) } : block;
}

/**
 * Whether a section forces readable text on a screen (ADR-0034): on unless its flag for that screen, `size.readablePhone` or `size.readableDesktop`, is false.
 * @param {object|null|undefined} section
 * @param {'desktop'|'mobile'} viewport
 * @returns {boolean}
 */
export function forcesReadable(section, viewport) {
  return section?.size?.[viewport === 'mobile' ? 'readablePhone' : 'readableDesktop'] !== false;
}

/** The narrowest width in px a block with words reads well at (ADR-0034): the phone's floor (base.css), a text's width-handle stop and phoneHandoff's line. */
export const READABLE_PX = 140;

/** The screen a design is reckoned at, as the editor's standard screen and the design picker's preview reckon a block (block-designs.js designPreviewFrame). */
const HANDOFF_DESIGN_PX = 1440;

/**
 * The widest window above the phone breakpoint at which a section shows its phone layout, as a text in it would fall under READABLE_PX (ADR-0034); else 0.
 * @param {object} section
 * @param {object} site site.json: `layout.contentWidth`, `layout.gutter` (vw) and `breakpoints.mobile`
 * @param {(block: object) => boolean} hasWords Whether a block's words are measured (render.js: a text block in its plain design)
 * @param {number} [scrollbar] The width the page's scrollbar takes, in px
 * @param {number} [aside] The width a side menu's column takes beside the page, in px
 * @returns {number} The window width in px at and under which the section shows its phone layout, or 0
 */
export function phoneHandoff(section, site, hasWords, scrollbar = 0, aside = 0) {
  if (!forcesReadable(section, 'desktop')) return 0;
  const gutter = Number(site?.layout?.gutter ?? 6);
  const share = 1 - (2 * (Number.isFinite(gutter) ? gutter : 6)) / 100;
  if (!(share > 0)) return 0;
  const own = section?.size?.maxWidth;
  const ownPx = typeof own === 'string' && /^\d+(\.\d+)?px$/.test(own) ? parseFloat(own) : 0;
  if (own && own !== 'full' && !ownPx) return 0;
  const siteWidth = site?.layout?.contentWidth ?? HANDOFF_DESIGN_PX;
  const bound = own === 'full' ? 0 : ownPx || (typeof siteWidth === 'number' ? siteWidth : 0);
  const side = Math.max(0, Number(aside) || 0);
  const atDesign = HANDOFF_DESIGN_PX * share - side;
  const design = bound ? Math.min(bound, atDesign) : atDesign;
  const bar = Math.max(0, Number(scrollbar) || 0);
  let widest = 0;
  for (const block of section?.blocks ?? []) {
    const w = Number(block?.frames?.desktop?.w);
    if (block?.hideDesktop || !(w > 0) || !hasWords(block)) continue;
    if ((w / 100) * design < READABLE_PX) continue;
    const floor = bound && (block.fit === 'shrink' || block.fit === 'both') ? READABLE_PX * clampFitMin(block.fitMin) : READABLE_PX;
    // The window at which the canvas leaves the block its floor: under it, the words stand narrower.
    const edge = (floor / (w / 100) + bar + side) / share;
    widest = Math.max(widest, Math.ceil(edge) - 1);
  }
  const breakpoint = Number(site?.breakpoints?.mobile ?? 640);
  return widest > breakpoint ? widest : 0;
}

/**
 * The props, by block type, that hold the words the phone can have of its own (`phoneProps`, additive, ADR-0033), drawn there in the desktop's place.
 */
export const PHONE_WORDS = { text: ['html'], quote: ['text', 'attribution', 'role'], stats: ['label'], audio: ['title'], countdown: ['doneText'] };

/**
 * A block's own words on the phone: the keys of its `phoneProps` that hold words for its type, as strings; empty where it has none.
 * @param {string} type
 * @param {object|null|undefined} phoneProps
 * @returns {Record<string, string>}
 */
export function phoneWordsOf(type, phoneProps) {
  const out = {};
  for (const key of PHONE_WORDS[type] ?? []) {
    if (typeof phoneProps?.[key] === 'string') out[key] = phoneProps[key];
  }
  return out;
}

/**
 * The props a block is drawn with in a viewport: on the phone its own words in the desktop's place, everywhere else its props as they are.
 * @param {{type?: string, props?: object, phoneProps?: object}} block
 * @param {object} props The block's props, lifted
 * @param {'desktop'|'mobile'} viewport
 * @returns {object}
 */
export function propsForViewport(block, props, viewport) {
  if (viewport !== 'mobile') return props;
  const words = phoneWordsOf(block?.type, block?.phoneProps);
  return Object.keys(words).length ? { ...props, ...words } : props;
}

/**
 * The phone's own words after typing in the phone view: the typed words that differ from the desktop's, the rest left as they were; null where none differs.
 * @param {string} type
 * @param {object} props The block's own props, the desktop's words
 * @param {object|null|undefined} phoneProps The phone's words as they stand
 * @param {object} typed The props as the phone view hands them back, its words in them
 * @returns {Record<string, string>|null}
 */
export function phoneWordsChange(type, props, phoneProps, typed) {
  const next = phoneWordsOf(type, phoneProps);
  for (const key of PHONE_WORDS[type] ?? []) {
    if (typeof typed?.[key] !== 'string') continue;
    if (typed[key] === props?.[key]) delete next[key];
    else next[key] = typed[key];
  }
  return Object.keys(next).length ? next : null;
}

/**
 * The block types that follow their content and fetch it: their loading state on the phone stands at `mobileHeight`, the height the editor measured there.
 */
export const FETCHES_CONTENT = new Set(['calendar', 'collection', 'privacy', 'product']);

/**
 * The height in px a block's loading state stands at on the phone: a fetching block's stored `mobileHeight`, else 0 (the loading state's own height).
 * @param {{type?: string, mobileHeight?: number}} block
 * @returns {number}
 */
export function mobileLoadingHeight(block) {
  if (!block || !FETCHES_CONTENT.has(block.type)) return 0;
  const h = Number(block.mobileHeight);
  return Number.isFinite(h) && h > 0 ? Math.round(h) : 0;
}

/**
 * The block types that can fill a box taller than their content (ADR-0025 decision 3, `stretch`): a statistic's figure, the countdown's units and a quote's card.
 */
export const STRETCHES = new Set(['countdown', 'quote', 'stats']);

/**
 * How a block with its own height places its content in the box (ADR-0025 decision 3): `top` (the default), `middle`, `bottom` or `stretch`.
 * @param {{height?: {mode?: string, align?: string}}} block
 * @returns {'top'|'middle'|'bottom'|'stretch'}
 */
export function heightAlign(block) {
  const align = block?.height?.mode === 'own' ? block.height.align : null;
  return ['middle', 'bottom', 'stretch'].includes(align) ? align : 'top';
}

/**
 * The block types that lay themselves out by their own width (ADR-0025 decision 7): their box is a size container (`urd-block` in base.css).
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
 * The block types whose content cannot wrap: their shrink is a floor on the frame's width (fitFloorPx) instead of a zoom of the content.
 */
export const FIT_BY_WIDTH = new Set(['image', 'video', 'shape', 'icon']);

/**
 * The block types whose size is their frame, as large as the box the owner dragged: a picture, a video, a shape, an icon, a map and a space.
 */
export const SIZE_BY_FRAME = new Set(['image', 'video', 'shape', 'icon', 'map', 'spacer']);

/** The block types that draw nothing, a space: a choice of how their content meets a narrower screen, or of its motion, has nothing to act on. */
export const DRAWS_NOTHING = new Set(['spacer']);

/** The bounds of a block's size: the whole block, text included, drawn smaller or larger than it is, in steps of `step`. */
export const SIZE = { min: 0.4, max: 2, step: 0.05 };

/**
 * The bounds the owner may give the base text of a sized block, in px, and the page's own base text, 16 px (base.css sets no root size).
 */
export const SIZE_TEXT = { min: 6, max: 200, base: 16 };

/**
 * The scale a type's content is drawn at when its size is 1 (ADR-0025 decision 6): the calendar's at a dense 14 px base for the page's 16 px, others as they are.
 */
export const TYPE_SCALE = new Map([['calendar', 0.875]]);

/**
 * A block's size as a factor (ADR-0025 decision 6): the owner's `size` held within sizeRange, else 1. The frame-sized types are always 1.
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
 * A block as the phone draws it (ADR-0019 decision 1): its `phoneSize` as `size` where that lies inside SIZE; else, and for frame-sized types, the block itself.
 * @param {{type?: string, size?: number, phoneSize?: number}} block
 * @returns {object}
 */
export function phoneSized(block) {
  if (!block || SIZE_BY_FRAME.has(block.type)) return block;
  const own = Number(block.phoneSize);
  if (!Number.isFinite(own) || own < SIZE.min || own > SIZE.max) return block;
  return { ...block, size: own };
}

/**
 * The desktop frame as the phone takes its height from it (ADR-0019 decision 1): `h` scaled by the phone's own size over the desktop's, else the frame itself.
 * @param {{type?: string, size?: number, phoneSize?: number, frames?: {desktop?: {h: number}}}} block
 * @returns {object|undefined}
 */
export function phoneFrame(block) {
  const frame = block?.frames?.desktop;
  const sized = phoneSized(block);
  if (!frame || sized === block) return frame;
  const ratio = blockSize(sized) / blockSize(block);
  return ratio === 1 ? frame : { ...frame, h: Math.max(1, Math.round(frame.h * ratio)) };
}

/**
 * The scale a block's content is drawn at: its size times its type's scale (TYPE_SCALE).
 * The frame follows the size alone.
 * @param {{type?: string, size?: number}} block
 * @returns {number}
 */
export function drawnScale(block) {
  return Math.round(blockSize(block) * (TYPE_SCALE.get(block?.type) ?? 1) * 10000) / 10000;
}

/**
 * The base text of a block in px at size 1: a text's own size (a text block, the terms of sale), else the page's (SIZE_TEXT.base) at its type's scale.
 * @param {{type?: string, props?: {size?: number}}} block
 * @returns {number}
 */
export function baseTextPx(block) {
  const own = Number(block?.props?.size);
  if ((block?.type === 'text' || block?.type === 'terms') && Number.isFinite(own) && own > 0) return own;
  return SIZE_TEXT.base * (TYPE_SCALE.get(block?.type) ?? 1);
}

/**
 * The sizes a block may take (ADR-0025 decision 6): inside SIZE, in whole steps, as far as its base text stays within sizeBounds; size 1 is always inside.
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
 * The owner's bounds in px on a sized block's base text (`sizeMin`, `sizeMax`): inside SIZE_TEXT, the largest never under the smallest, null where unset.
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
 * The smallest width in px a FIT_BY_WIDTH block set to shrink may take: its share of the section's design width times its floor (fitMin); else 0.
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
 * Whether a block shrinks on a phone: one whose `fit` is 'shrink', but not a FIT_BY_WIDTH type nor the calendar, which draws its phone view there.
 * @param {{type?: string, fit?: string}} block
 * @returns {boolean}
 */
export function shrinksOnPhone(block) {
  return block?.fit === 'shrink' && !FIT_BY_WIDTH.has(block.type) && block.type !== 'calendar';
}

/**
 * The share a block that shrinks on a phone is drawn at there: its row-grid width over its width at the design width, between its floor (fitMin) and 1; else 1.
 * @param {{type?: string, fit?: string, fitMin?: number, frames?: {desktop?: {w?: number}}}} block
 * @param {number} width The block's width on the phone, in px
 * @param {number} designWidth The width in px the section's canvas has at the design width (render.js `_urdDesignW`)
 * @returns {number}
 */
export function phoneFitZoom(block, width, designWidth) {
  if (!shrinksOnPhone(block)) return 1;
  const w = Number(block.frames?.desktop?.w);
  if (!(width > 0) || typeof designWidth !== 'number' || !(designWidth > 0) || !Number.isFinite(w) || w <= 0) return 1;
  const ratio = width / ((w / 100) * designWidth);
  return Math.round(Math.max(clampFitMin(block.fitMin), Math.min(1, ratio)) * 1000) / 1000;
}

/**
 * One block pushes another only where they share more than this much of the width, in percent of the section; frames that only touch stand side by side.
 */
export const PUSH_ACROSS_MIN = 0.1;

/**
 * Whether block b shares block a's width, so a's growth reaches it (ADR-0024 decision 1); an item without a width (`w`) is taken to span the section.
 * @param {{x?: number, w?: number}} a
 * @param {{x?: number, w?: number}} b
 * @returns {boolean}
 */
function sharesWidth(a, b) {
  if (!Number.isFinite(a.w) || !Number.isFinite(b.w)) return true;
  const ax = a.x ?? 0;
  const bx = b.x ?? 0;
  return Math.min(ax + a.w, bx + b.w) - Math.max(ax, bx) > PUSH_ACROSS_MIN;
}

/**
 * The shift for each block below the blocks that grew, and under their width.
 * @param {Array<{id: string, y: number, h: number, x?: number, w?: number, grow?: number}>} items
 *   Frames in design px (`x` and `w` in percent) with the measured extra height in `grow` (0 or more).
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
      if (b === a || b.y < middle || !sharesWidth(a, b)) continue;
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
 * The new y of each block that a frame fitted to its content moves (ADR-0025 decision 5): a taller frame pushes the blocks below, a shorter one moves nothing.
 * @param {Array<{id: string, frames?: {desktop?: {x?: number, y: number, h: number}}}>} blocks The section's blocks
 * @param {string} id The block whose frame is fitted
 * @param {number} h The fitted height in px
 * @returns {Map<string, number>} The new y of each block that moves
 */
export function fitMoves(blocks, id, h) {
  return fitMovesAll(blocks, new Map([[id, h]]));
}

/**
 * The same for several frames at once: the moves the push pass draws with all of them grown, each block at its drawn width (`widths`) or else its frame's.
 * @param {Array<{id: string, frames?: {desktop?: {x?: number, y: number, h: number}}}>} blocks The section's blocks
 * @param {Map<string, number>} fits Block id to its fitted height in px
 * @param {Map<string, number>} [widths] Block id to its width as drawn, in percent of the canvas (render.js drawnWidth)
 * @returns {Map<string, number>}
 */
export function fitMovesAll(blocks, fits, widths) {
  const items = [];
  const phoneOnly = [];
  for (const block of blocks ?? []) {
    const frame = block?.frames?.desktop;
    if (!frame || !Number.isFinite(frame.y) || !Number.isFinite(frame.h)) continue;
    // A block shown on phones only takes no room on the desktop: it is pushed apart from the rest below.
    if (block.hideDesktop) {
      phoneOnly.push({ id: block.id, x: frame.x ?? 0, w: widths?.get(block.id) ?? frame.w, y: frame.y, h: 0, grow: 0 });
      continue;
    }
    const h = fits?.get(block.id);
    const grow = Number.isFinite(h) ? Math.max(0, h - frame.h) : 0;
    items.push({ id: block.id, x: frame.x ?? 0, w: widths?.get(block.id) ?? frame.w, y: frame.y, h: frame.h, grow });
  }
  const moves = new Map();
  if (!items.some((it) => it.grow > 0)) return moves;
  const { shifts } = pushLayout(items);
  for (const it of items) {
    const shift = shifts.get(it.id) ?? 0;
    if (shift) moves.set(it.id, it.y + shift);
  }
  // Each block shown on phones only moves as the blocks above it push it, so it keeps its place in the phone's reading order, and its own move pushes none of them.
  for (const it of phoneOnly) {
    const shift = pushLayout([...items, it]).shifts.get(it.id) ?? 0;
    if (shift) moves.set(it.id, it.y + shift);
  }
  return moves;
}

/**
 * The frames typing gives a section, from the frames before the typing (ADR-0024 decision 4): the text block grows to its words' height, pushing the blocks below.
 * @param {Array<{id: string, frames?: {desktop?: {x?: number, y: number, h: number}}}>} before The section's blocks as they stood before the typing
 * @param {string} id The text block
 * @param {number} needed The height its words need now, in px
 * @param {number} [step] The grid step a grown height is rounded up to
 * @param {Map<string, number>} [widths] Block id to its width as drawn, in percent of the canvas (fitMovesAll)
 * @returns {Map<string, object>} The desktop frame of every block with one
 */
export function typedFrames(before, id, needed, step = 1, widths) {
  const frames = new Map();
  const own = (before ?? []).find((b) => b?.id === id)?.frames?.desktop;
  if (!own) return frames;
  const h = needed > own.h ? Math.ceil(needed / step) * step : own.h;
  const moves = fitMovesAll(before, new Map([[id, h]]), widths);
  for (const block of before) {
    const frame = block?.frames?.desktop;
    if (!frame) continue;
    if (block.id === id) frames.set(block.id, { ...frame, h });
    else frames.set(block.id, moves.has(block.id) ? { ...frame, y: moves.get(block.id) } : { ...frame });
  }
  return frames;
}
