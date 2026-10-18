/**
 * Pure logic for the image gallery background layer: the styles a gallery can
 * take, the motions each style allows, the deterministic layouts (the floating
 * scatter, the mosaic spans) and the clamps around them. DOM-free, so all of
 * it is tested with node --test (tests/gallery-layer.test.mjs); the DOM
 * building lives in backgrounds/slideshow.js.
 *
 * The layouts are DETERMINISTIC for a seed: the same seed gives the same
 * scatter in the panel, in the preview and on the published page. The seed
 * itself is either fixed by the owner (the Shuffle button) or drawn once per
 * page load, which is what makes «random on every visit» stable while the
 * page is open. Every throw of the die is a hash of the seed and a field name,
 * never a random number.
 */
import { ribbonRows } from './ribbon-model.js';

/**
 * How the pictures are laid out: scattered frames floating over the section,
 * one picture filling it with a cross-fade to the next, rolling bands, or a
 * mosaic wall. The letters ApeironLF uses: A band, B mosaic, D floating; its
 * C, the polaroids, is a LOOK here (below) that any layout can wear.
 */
export const GALLERY_STYLES = ['floating', 'fill', 'band', 'mosaic'];

/**
 * The outline of a picture: cut with clip-path or drawn with border-radius,
 * on the frame's skin and face alike so a framed picture keeps its shape. The
 * regular shapes are square, the rest keep the frame's own proportion.
 */
export const GALLERY_SHAPES = [
  'rect', 'square', 'circle', 'oval', 'pill', 'arch', 'triangle', 'diamond',
  'hexagon', 'octagon', 'star', 'heart', 'blob', 'leaf', 'slant',
];

/**
 * What surrounds a picture: a soft shadow, nothing, a polaroid card, thin or
 * thick or dark or doubled borders, a glow in the accent colour, a strip of
 * tape, a pin, a perforated stamp edge, film-strip edges, or a feathered
 * edge that fades out.
 */
export const GALLERY_LOOKS = [
  'shadow', 'plain', 'polaroid', 'border', 'thick', 'dark', 'double', 'glow',
  'tape', 'pin', 'stamp', 'film', 'soft',
];

/** The finish on the picture itself: filters, and a tint in the accent colour. */
export const GALLERY_TONES = [
  'natural', 'mono', 'sepia', 'vintage', 'faded', 'warm', 'cool', 'duotone',
  'punchy', 'noir', 'dim', 'pop',
];

/** The shapes that are as tall as they are wide, and the one that is taller. */
const SQUARE_SHAPES = ['square', 'circle', 'triangle', 'diamond', 'hexagon', 'octagon', 'star', 'heart'];

/**
 * How the pictures move. `drift` slides diagonally, `rise` straight up and
 * down, `kenburns` breathes in, `crossfade` swaps the pictures one frame at a
 * time, and `bounce` sends each frame across the section and back off the
 * edges. Not every style can take every motion: a band rolls by itself, and a
 * filling picture cannot bounce.
 */
export const GALLERY_MOTIONS = ['none', 'drift', 'rise', 'kenburns', 'crossfade', 'bounce'];

const STYLE_MOTIONS = {
  floating: GALLERY_MOTIONS,
  fill: ['none', 'drift', 'kenburns'],
  mosaic: ['none', 'crossfade', 'kenburns'],
  band: ['none'],
};

const STYLE_DEFAULT_MOTION = { floating: 'drift', fill: 'none', mosaic: 'crossfade', band: 'none' };

/**
 * Frames shown at once, and never more than there are pictures: a folder of
 * five gives five frames, not twenty with repeats.
 */
export const FRAME_COUNT = { min: 1, max: 20, dflt: 8 };

/**
 * Frame size in px: the width of a floating frame or a polaroid, the row
 * height of a band or a mosaic. Each style has its own default, the sizes
 * ApeironLF's hero gallery uses, and an unset size takes the style's.
 */
export const FRAME_SIZE = { min: 60, max: 400 };
export const STYLE_SIZE = { floating: 140, band: 156, mosaic: 140, fill: 0 };

/**
 * The colour a look draws with when the owner has not picked one: white
 * cards and borders, a dark border, and a glow in the accent colour. Looks
 * that are not in the table have no colour to pick.
 */
export const LOOK_COLOR = { polaroid: '#ffffff', border: '#ffffff', thick: '#ffffff', double: '#ffffff', dark: '#161616', glow: 'accent' };

/** A floating frame's shape: a little wider than 4:3, the ApeironLF proportion. */
export const FRAME_ASPECT = 1.35;

/** How far from the middle the scatter reaches. */
export const FRAME_SPREAD = { min: 0, max: 1, dflt: 0.85 };

/** Maximum lean, in degrees either way. */
export const FRAME_TILT = { min: 0, max: 15, dflt: 5 };

/** Corner rounding in px. */
export const FRAME_RADIUS = { min: 0, max: 48, dflt: 5 };

/** Seconds for one cycle of the motion. */
export const MOTION_TIME = { min: 0.5, max: 90, dflt: 30 };

/** Seconds a picture stands before the next takes its place. */
export const PICTURE_TIME = { min: 0.5, max: 90, dflt: 12 };

/** Columns in the mosaic wall, and the gap between its tiles. */
export const MOSAIC_COLS = 4;
export const MOSAIC_GAP = 10;

/** Tiles in a mosaic wall: it starts with more than the frames, since a wall has to be filled. */
export const MOSAIC_COUNT = { min: 4, max: 20, dflt: 12 };

/**
 * djb2, the same hash the media file names use (imageTools.js). Written out
 * here rather than imported: imageTools is outside the visitor import closure,
 * and pulling it in would put the whole image pipeline in every page.
 * @param {unknown} text
 * @returns {number} Unsigned 32-bit
 */
export function hash32(text) {
  const s = String(text);
  let hash = 5381;
  for (let i = 0; i < s.length; i++) hash = ((hash << 5) + hash + s.charCodeAt(i)) >>> 0;
  return hash;
}

/**
 * A fraction in [0, 1) from the seed and a field name: one throw of the die.
 *
 * The djb2 alone is not enough here. Neighbouring keys (`x1`, `x2`) hash to
 * neighbouring numbers, which would give frame after frame almost the same
 * throw and a scatter that reads as a pattern. The avalanche step below
 * spreads the bits, so two keys one character apart land nowhere near each
 * other.
 */
function roll(seed, key) {
  let h = hash32(`${seed}:${key}`);
  h ^= h >>> 15;
  h = Math.imul(h, 0x2c1b3c6d) >>> 0;
  h ^= h >>> 12;
  h = Math.imul(h, 0x297a2d39) >>> 0;
  h ^= h >>> 15;
  return (h >>> 0) / 4294967296;
}

/**
 * A drawn example picture as a data URL: what the layer looks like before the
 * owner has picked anything. Three variants, so a cross-fade and a drift are
 * actually visible while the settings are being tried out, and painted in
 * translucent grey so they read on a light and a dark background alike. A data
 * URL, which the site's `img-src 'self' data:` already covers.
 * @param {number} index
 * @returns {string}
 */
export function placeholderPhoto(index) {
  const n = Math.abs(Math.round(Number(index) || 0)) % 3;
  const ink = (a) => `rgba(128,128,128,${a})`;
  const sun = [64, 104, 150][n];
  const hills = [
    'M0 150 L60 96 L108 150 Z M84 150 L138 108 L180 150 Z',
    'M0 150 L44 110 L92 150 Z M70 150 L128 88 L180 150 Z',
    'M0 150 L72 84 L132 150 Z M110 150 L156 116 L180 150 Z',
  ][n];
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 150">'
    + `<rect width="180" height="150" fill="${ink(0.14 + n * 0.04)}"/>`
    + `<circle cx="${sun}" cy="44" r="15" fill="${ink(0.4)}"/>`
    + `<path d="${hills}" fill="${ink(0.45)}"/>`
    + '</svg>';
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

/**
 * Example pictures in the layer's own image shape, so a layer with nothing in
 * it can still show what it does.
 * @param {number} count
 * @returns {Array<{src: string}>}
 */
export function placeholderPhotos(count) {
  return Array.from({ length: Math.max(1, Math.round(Number(count) || 0)) },
    (_, i) => ({ src: placeholderPhoto(i) }));
}

/** Rounded to two decimals, so the CSS the layer writes stays readable. */
const round2 = (n) => Math.round(n * 100) / 100;

/**
 * A number inside its bounds, with the default for anything unusable. An
 * absent value (undefined, null or an empty field) is unset, not zero: the
 * panel writes an empty field while the owner is typing, and a spread of zero
 * is a legitimate setting that must not be reachable by accident.
 */
function clamp(value, { min, max, dflt }) {
  if (value === undefined || value === null || value === '') return dflt;
  const n = Number(value);
  if (!Number.isFinite(n)) return dflt;
  return Math.min(max, Math.max(min, n));
}

/** The style, with the floating frames for anything unknown. */
export function galleryStyle(style) {
  return GALLERY_STYLES.includes(style) ? style : 'floating';
}

/**
 * The motion a style will actually run: the one asked for when the style can
 * take it, otherwise the style's own default. So switching style never leaves
 * a motion behind that the new style has no animation for.
 * @param {unknown} style
 * @param {unknown} motion
 * @returns {string}
 */
export function styleMotion(style, motion) {
  const s = galleryStyle(style);
  return STYLE_MOTIONS[s].includes(motion) ? motion : STYLE_DEFAULT_MOTION[s];
}

/** The motions a style offers, for the panel's list. */
export function motionsFor(style) {
  return STYLE_MOTIONS[galleryStyle(style)];
}

/**
 * Whether the pictures move at all: reduced motion always wins. A band's
 * motion is its roll, so it moves whatever the motion field says.
 */
export function galleryMoves({ style = 'floating', motion, reducedMotion = false } = {}) {
  if (reducedMotion) return false;
  return galleryStyle(style) === 'band' || styleMotion(style, motion) !== 'none';
}

/**
 * How many frames are drawn: the count inside its bounds. With fewer pictures
 * than that (`available`) the owner chooses: `repeat` pads the frames with the
 * pictures over again, otherwise the frames stop at the pictures there are,
 * so a small folder is shown once over. With no pictures at all the count
 * stands, as example frames.
 */
export function frameCount(count, style, available, repeat = false) {
  const n = Math.round(clamp(count, galleryStyle(style) === 'mosaic' ? MOSAIC_COUNT : FRAME_COUNT));
  const have = Number(available);
  return !repeat && Number.isFinite(have) && have > 0 ? Math.min(n, have) : n;
}

/** The frame size in px for a style: the stored one inside its bounds, or the style's own. */
export function frameSize(size, style) {
  const dflt = STYLE_SIZE[galleryStyle(style)] || STYLE_SIZE.floating;
  return Math.round(clamp(size, { ...FRAME_SIZE, dflt }));
}

/** Whether a look has a colour to pick. */
export function colouredLook(look) {
  return galleryLook(look) in LOOK_COLOR;
}

/**
 * The colour a look draws with: the owner's when one is set (a theme token
 * or a raw colour, resolved by the layer), otherwise the look's own, and
 * nothing for a look that has no colour.
 * @param {unknown} look
 * @param {unknown} color
 * @returns {string}
 */
export function frameColor(look, color) {
  const own = LOOK_COLOR[galleryLook(look)] ?? '';
  return own && typeof color === 'string' && color.trim() ? color.trim() : own;
}

/** The shape, with the plain rectangle for anything unknown. */
export function galleryShape(shape) {
  return GALLERY_SHAPES.includes(shape) ? shape : 'rect';
}

/** The look, with the soft shadow for anything unknown. */
export function galleryLook(look) {
  return GALLERY_LOOKS.includes(look) ? look : 'shadow';
}

/** The tone, with the picture as it is for anything unknown. */
export function galleryTone(tone) {
  return GALLERY_TONES.includes(tone) ? tone : 'natural';
}

/**
 * The proportion a frame takes for a shape and a look: the regular shapes are
 * square, the arch stands tall, a polaroid card is taller than its picture,
 * and everything else keeps ApeironLF's frame.
 * @param {unknown} shape
 * @param {unknown} [look]
 * @returns {number} width divided by height
 */
export function frameAspect(shape, look) {
  if (galleryLook(look) === 'polaroid') return 0.84;
  const s = galleryShape(shape);
  if (SQUARE_SHAPES.includes(s)) return 1;
  if (s === 'arch') return 0.8;
  return FRAME_ASPECT;
}

/** Whether the corner rounding has anything to round: only the two square-cornered shapes. */
export function roundable(shape) {
  return ['rect', 'square'].includes(galleryShape(shape));
}

/** Seconds per picture, inside the bounds. */
export function normalizePictureTime(seconds) {
  return clamp(seconds, PICTURE_TIME);
}

export function clampSpread(spread) {
  return clamp(spread, FRAME_SPREAD);
}

export function clampTilt(tilt) {
  return clamp(tilt, FRAME_TILT);
}

export function clampRadius(radius) {
  return Math.round(clamp(radius, FRAME_RADIUS));
}

/** Seconds for one cycle, inside the bounds. */
export function normalizeMotionTime(seconds) {
  return clamp(seconds, MOTION_TIME);
}

/** The band rows: one, or two running against each other. */
export function bandRows(rows) {
  return ribbonRows(rows);
}

/**
 * The seed a layout is drawn from: the owner's fixed one when it is set, and
 * otherwise the visit's, so a layer left on «random» scatters afresh on every
 * page load and holds still while the page is open.
 * @param {unknown} seed The stored seed; 0 or absent means the visit's
 * @param {number} visit The seed drawn once per page load
 * @returns {number}
 */
export function layoutSeed(seed, visit) {
  const n = Number(seed);
  return Number.isFinite(n) && n > 0 ? Math.round(n) : (Number(visit) || 1);
}

/**
 * The scatter: one placement per frame, in the order they are drawn.
 *
 * `x`/`y` are the frame's CENTRE in per cent of the section, `w` its width in
 * px (the style's size, varied a fifth either way so the set is not uniform),
 * `rot` its lean in degrees, `phase` a fraction of the cycle (a negative
 * animation delay, so the frames never move in lockstep) and `heading` a
 * direction in turns for the motions that travel. `index` points back into the picture list,
 * so the caller can read that picture's focal point; it is -1 for an empty
 * frame. An empty picture list still yields placements: the layer draws them
 * as empty frames while it is being set up.
 *
 * The frames are laid on a jittered grid rather than on free coordinates, so
 * they cover the section instead of clumping; the cells are dealt out in a
 * seeded order, so the ones left empty when there are fewer frames than cells
 * are never the same corner every time.
 *
 * @param {unknown} images `[{src, x?, y?}]`
 * @param {{count?: number, seed?: unknown, size?: number, spread?: number, tilt?: number, style?: string, repeat?: boolean}} [opts]
 * @returns {Array<{src: string, index: number, x: number, y: number, w: number, rot: number, phase: number, heading: number}>}
 */
export function photoLayout(images, { count, seed, size, spread, tilt, style = 'floating', repeat = false } = {}) {
  const list = (Array.isArray(images) ? images : [])
    .filter((img) => img && typeof img.src === 'string' && img.src);
  const frames = frameCount(count, style, list.length, repeat);
  const width = frameSize(size, style);
  const reach = clampSpread(spread);
  const lean = clampTilt(tilt);
  const die = seed === undefined || seed === null || seed === '' ? 1 : seed;
  // A grid wider than it is tall: sections are wider than they are high.
  const cols = Math.ceil(Math.sqrt(frames * 1.6));
  const rows = Math.ceil(frames / cols);
  // The cells, dealt in a seeded order.
  const cells = Array.from({ length: cols * rows }, (_, i) => i)
    .map((cell) => ({ cell, at: roll(die, `cell${cell}`) }))
    .sort((a, b) => a.at - b.at)
    .map((c) => c.cell);
  const out = [];
  for (let i = 0; i < frames; i++) {
    const cell = cells[i];
    const cx = ((cell % cols) + 0.5) / cols + (roll(die, `x${i}`) - 0.5) * (0.9 / cols);
    const cy = (Math.floor(cell / cols) + 0.5) / rows + (roll(die, `y${i}`) - 0.5) * (0.9 / rows);
    out.push({
      src: list.length ? list[i % list.length].src : '',
      index: list.length ? i % list.length : -1,
      x: round2(50 + (cx - 0.5) * 100 * reach),
      y: round2(50 + (cy - 0.5) * 100 * reach),
      w: Math.round(width * (0.8 + roll(die, `w${i}`) * 0.4)),
      rot: frameTilt(die, i, lean),
      phase: round2(roll(die, `p${i}`)),
      heading: round2(roll(die, `h${i}`)),
    });
  }
  return out;
}

/**
 * One frame's lean in degrees, inside plus or minus `tilt`: the same throw
 * for the same seed and index, so a frame keeps its lean across renders. The
 * scatter and the gallery block's polaroid view share it. Pure.
 * @param {unknown} seed
 * @param {number} index
 * @param {unknown} tilt The largest lean, clamped by clampTilt
 * @returns {number}
 */
export function frameTilt(seed, index, tilt) {
  const die = seed === undefined || seed === null || seed === '' ? 1 : seed;
  return round2((roll(die, `r${index}`) - 0.5) * 2 * clampTilt(tilt));
}

/**
 * One tile's span on the mosaic wall: most tiles one cell, some two wide,
 * some two high, a few both. Pure; mosaicSpans deals a whole wall from it and
 * the gallery block one span per picture.
 * @param {unknown} seed
 * @param {number} index
 * @returns {{cols: number, rows: number, phase: number}}
 */
export function mosaicSpan(seed, index) {
  const die = seed === undefined || seed === null || seed === '' ? 1 : seed;
  const t = roll(die, `m${index}`);
  // Roughly a fifth of the tiles are wide, a fifth tall, one in ten both.
  return { cols: t < 0.3 ? 2 : 1, rows: t > 0.7 || t < 0.1 ? 2 : 1, phase: round2(roll(die, `mp${index}`)) };
}

/**
 * The mosaic wall: one span per tile on a grid of MOSAIC_COLS columns, most
 * tiles one cell, some two wide, some two high, a few both, dealt by the die so
 * the wall is never the same twice for two seeds. Pure.
 * @param {unknown} count
 * @param {unknown} seed
 * @returns {Array<{cols: number, rows: number, phase: number}>}
 */
export function mosaicSpans(count, seed, available, repeat = false) {
  const tiles = frameCount(count, 'mosaic', available, repeat);
  return Array.from({ length: tiles }, (_, i) => mosaicSpan(seed, i));
}

/**
 * The rows a mosaic needs to hold its spans, so the wall fills the section
 * exactly instead of running past its foot. Pure.
 * @param {Array<{cols: number, rows: number}>} spans
 * @param {number} [cols]
 * @returns {number}
 */
export function mosaicRows(spans, cols = MOSAIC_COLS) {
  const area = spans.reduce((sum, s) => sum + s.cols * s.rows, 0);
  return Math.max(1, Math.ceil(area / cols));
}
