/**
 * Content push on the desktop canvas (ADR-0024). Blocks are placed
 * absolutely with pixel frames, so a block whose content grows taller than
 * its frame (wrapped text, a longer feed) would draw over the blocks
 * beneath. This model moves the blocks below instead, with the rules the
 * Wix Editor publishes for its free canvas: a gap of PUSH_GAP_MAX px or less
 * is preserved, a larger gap stays until it would fall under PUSH_GAP_MIN px,
 * a block whose top sits above the grown block's vertical middle is a
 * deliberate overlap and stays, and a move cascades to the blocks below the
 * moved block. Every block below that shares some of the grown block's width
 * moves, not only the nearest one; a block beside it, in another column,
 * keeps its place.
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
export const FOLLOWS_CONTENT = new Set(['audio', 'calendar', 'cart', 'checkout', 'collection', 'contact', 'countdown', 'faq', 'form', 'privacy', 'product', 'quote', 'share', 'stats', 'table', 'timeline']);

/** The shapes a video can be given, width:height: widescreen first (YouTube's own), then classic, square, vertical (Shorts and reels), cinema and portrait. Without one the video fills its frame. */
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
 * Whether a block keeps a shape (ADR-0025): a video given one, or an image
 * block with a picture given one, is drawn at that shape at its own width,
 * so its height follows its width.
 * @param {{type?: string, props?: {aspect?: unknown, src?: unknown}}} block
 * @returns {boolean}
 */
export function keepsShape(block) {
  if (block?.type === 'video') return VIDEO_ASPECTS.includes(block.props?.aspect);
  if (block?.type === 'image') return IMAGE_ASPECTS.includes(block.props?.aspect) && Boolean(block.props?.src);
  return false;
}

/**
 * The frame height of a block that keeps a shape, for a content surface of
 * the given width: its width there over the shape. The editor fits the frame
 * with it at the design width, which the preview's own surface need not have.
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
 * Whether a block's height follows its content (ADR-0025): one of the types
 * above, unless the block has been given its own height (`height.mode`), or
 * a block that keeps a shape.
 * @param {{type?: string, height?: {mode?: string}, props?: object}} block
 * @returns {boolean}
 */
export function followsContent(block) {
  return keepsShape(block) || foldsIntoQuestions(block) || (FOLLOWS_CONTENT.has(block?.type) && block.height?.mode !== 'own');
}

/**
 * The terms of sale drawn as questions (doc-look.js), or a text block from before page v8 still in that design: its rows fold out, so its height is the closed rows', and an open part is view state, as an FAQ's answer is.
 * @param {{type?: string, props?: object}} block
 * @returns {boolean}
 */
export function foldsIntoQuestions(block) {
  return (block?.type === 'terms' || block?.type === 'text') && block.props?.design === 'questions';
}

/**
 * The blocks with a phone design: the design a block draws while it is narrow (`phoneDesign`, additive), by the prop its design is kept in, the way the calendar has its phone view.
 * Narrow is the block's own width, on a phone or in a narrow column of a wide page alike (ADR-0025): below NARROW_PX it draws its phone design, and it is drawn again when it crosses the line (render.js).
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
 * A block as it is drawn at its width: with its phone design in its design's place while narrow, so the rules that read the design (the height following the content, the growth in the phone's flow) read the one drawn.
 * @param {{type?: string, props?: object}} block
 * @param {boolean} narrow
 */
export function drawnBlock(block, narrow) {
  return narrow && hasPhoneDesign(block?.type, block?.props) ? { ...block, props: propsForWidth(block.type, block.props, true) } : block;
}

/**
 * Whether a section forces readable text on a screen (ADR-0034, «Force readable text»): on the phone a block with words is never drawn narrower than its words read well (the floor in base.css), and on the desktop a text's lines wrap at a measure. On unless the section's `size.readablePhone` or `size.readableDesktop` is false.
 * @param {object|null|undefined} section
 * @param {'desktop'|'mobile'} viewport
 * @returns {boolean}
 */
export function forcesReadable(section, viewport) {
  return section?.size?.[viewport === 'mobile' ? 'readablePhone' : 'readableDesktop'] !== false;
}

/** The narrowest a block with words reads well at, in px (ADR-0034): the phone's floor for words in cells (base.css), the stop of a text's width handle on the desktop, and the line under which a section shows its phone layout (phoneHandoff). */
export const READABLE_PX = 140;

/** The screen a design is reckoned at, as the editor's standard screen and the design picker's preview reckon a block (block-designs.js designPreviewFrame). */
const HANDOFF_DESIGN_PX = 1440;

/**
 * The widest window at which a section shows its phone layout above the phone breakpoint, since a text in it would stand narrower than READABLE_PX on the desktop canvas (ADR-0034); 0 where none would.
 * The texts are those the desktop's «Force readable text» measures and stops at the floor (render.js: a text block in its plain design); a short word on a button, a basket or a statistic reads well narrower, and a block that redraws itself by its width has a narrow design of its own.
 * The canvas is the window less the side margin on each side, up to its bound (base.css): the section's own px width, else the site's content width, none where either is full width. A text stands at its share of it and so falls under the floor below a window width of its own; the section takes the widest of its texts'.
 * A text already narrower than the floor at the design width, the canvas on a 1440 px screen, is the owner's choice and does not count, nor does one hidden on the desktop.
 * A text that shrinks below the design width instead of wrapping (ADR-0024 decision 6) keeps its lines down to its smallest scale (`fitMin`), so it falls under the floor only where its box is narrower than the floor at that scale; without a design size (a full-width canvas) it wraps as any other.
 * The page's scrollbar, where it takes room (`scrollbar-gutter: stable` in base.css), narrows the canvas by its width while the media query reads the window with it, and a side menu's column (`side-left`, `side-right`) by its own, at every window width and at the design width alike.
 * None where the section's desktop «Force readable text» is off, where its own width is in another unit than px (no width to reckon with), or where the width lies at or under the phone breakpoint, where the whole page shows its phone layout already.
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
 * The props that hold a block's words, by its type: the words the phone can have of its own (`phoneProps`, additive, ADR-0033), written in the phone view and drawn at phone width in the desktop's place: a text's words, a quote's with its name and role, a statistic's label, an audio player's title and a countdown's words for when the time is up.
 * A list of words (questions, events, rows) is not among them: its items would have to be matched one by one, and one added on the desktop would not reach the phone's copy. Nor is a statistic's number, which is the same fact on every screen.
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
 * The phone's own words after typing in the phone view: the typed words that differ from the desktop's, the rest left as they were; null where none differs, the block then reading the desktop's words again.
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
 * The block types that follow their content and fetch it (a feed, a
 * collection), so their height on the phone is unknown until the content is
 * drawn. The editor measures each at the phone width after an edit and
 * stores it as `mobileHeight` (0.7.21.7); the loading state stands at it on
 * the phone, so the first load of a session does not jump.
 */
export const FETCHES_CONTENT = new Set(['calendar', 'collection', 'privacy', 'product']);

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
 * icon, a map and a space are as large as the box the owner dragged, so a
 * scale of their content would only crop or blur it, or have nothing to
 * scale. Every other type takes «Size».
 */
export const SIZE_BY_FRAME = new Set(['image', 'video', 'shape', 'icon', 'map', 'spacer']);

/** The block types that draw nothing, a space: a choice of how their content meets a narrower screen, or of its motion, has nothing to act on. */
export const DRAWS_NOTHING = new Set(['spacer']);

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
 * A block as the phone draws it (ADR-0025 decision 6, ADR-0019 decision 1): with the phone's own size (`phoneSize`) in place of the desktop's, where it has one inside SIZE.
 * Without one, and for the frame-sized types, the block itself, so the phone follows the desktop's size.
 * The bounds of its base text (sizeMin, sizeMax) bound the phone's size as they bound the desktop's (blockSize).
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
 * The desktop frame as the phone takes its height from it (ADR-0019 decision 1): a block drawn at a size of the phone's own stands in a box whose height is scaled by that size against the desktop's, as the desktop's size scales the frame.
 * A block the phone draws at the desktop's size has the frame itself.
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
 * The scale a block's content is drawn at: its size times its type's scale
 * (TYPE_SCALE). The frame follows the size alone.
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
 * Whether a block shrinks on a phone (0.7.3.9): one set to «shrink», but not the types that shrink by their frame (FIT_BY_WIDTH) and not the calendar, which draws its phone view there (calPhoneView in calendar-designs.js).
 * «Both» wraps on the phone, since it fits a design height the row grid has not.
 * @param {{type?: string, fit?: string}} block
 * @returns {boolean}
 */
export function shrinksOnPhone(block) {
  return block?.fit === 'shrink' && !FIT_BY_WIDTH.has(block.type) && block.type !== 'calendar';
}

/**
 * The share a block that shrinks on a phone is drawn at there (shrinksOnPhone), which its drawn scale multiplies: its width in the row grid over its width at the design width, so its content keeps the lines it has there, never above 1 and never under its floor (fitMin).
 * 1 for every other block, and where nothing has a design width (a full-width site or section).
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
 * How much of the width two blocks must share, in percent of the section, for one to push the other: frames that only touch, or overlap by a rounding, stand side by side.
 */
export const PUSH_ACROSS_MIN = 0.1;

/**
 * Whether block b stands under block a's width, so a's growth reaches it (ADR-0024 decision 1): a block beside the grown one, in another column, keeps its place.
 * An item without a width (`x` and `w` in percent) is taken to span the section.
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
 * them grown. A block takes its width as drawn where one is given, as the
 * pass does for a picture a width floor draws wider than its frame on a
 * narrow canvas; without one, the frame's width stands.
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
 * The frames typing gives a section (ADR-0024 decision 4): the text block takes the height its words need, rounded up to the grid step, never less than it had before the typing began, and the blocks below stand where the push rules move them from where they stood then.
 * Measured from the frames before the typing, not from the last keystroke's, so words deleted give back the room they took and the blocks below return with them.
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
