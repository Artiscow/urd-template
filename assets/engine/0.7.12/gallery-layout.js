/**
 * Pure logic for the image gallery background layer: its styles and motions, the seeded layouts (the scatter, the mosaic spans) and the clamps around them.
 * Notes: docs/engine-notes/gallery-layout.md (Urd repository).
 */
import { ribbonRows } from './ribbon-model.js';
import { PICTURE_LOOKS, placeholderPhoto } from './picture.js';
import { hash32, roll, round2, clamp, FRAME_TILT, clampTilt, frameTilt, mosaicSpan } from './layout-die.js';

export { placeholderPhoto };
// The die's parts the photo layer's callers read beside the layer's own.
export { hash32, FRAME_TILT, clampTilt, frameTilt, mosaicSpan };

/**
 * How the pictures are laid out: frames floating over the section, one picture filling it, rolling bands, or a mosaic wall.
 */
export const GALLERY_STYLES = ['floating', 'fill', 'band', 'mosaic'];

/**
 * The outline of a picture, cut with clip-path or drawn with border-radius on the frame's skin and face alike; the regular shapes are square.
 */
export const GALLERY_SHAPES = [
  'rect', 'square', 'circle', 'oval', 'pill', 'arch', 'triangle', 'diamond',
  'hexagon', 'octagon', 'star', 'heart', 'blob', 'leaf', 'slant',
];

/**
 * What surrounds a picture: a shadow, nothing, a polaroid card, borders, a glow, tape, a pin, a stamp edge, film-strip edges, or a feathered edge.
 */
export const GALLERY_LOOKS = [
  'shadow', 'plain', 'polaroid', 'border', 'thick', 'dark', 'double', 'glow',
  'tape', 'pin', 'stamp', 'film', 'soft',
];

/** The finish on the picture itself, filters and a tint in the accent colour: the picture's own looks (picture.js). */
export const GALLERY_TONES = PICTURE_LOOKS;

/** The shapes that are as tall as they are wide, and the one that is taller. */
const SQUARE_SHAPES = ['square', 'circle', 'triangle', 'diamond', 'hexagon', 'octagon', 'star', 'heart'];

/**
 * How the pictures move: drift, rise, kenburns, crossfade or bounce, each style taking only some of them (STYLE_MOTIONS).
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
 * Frames shown at once, and never more than there are pictures: a folder of five gives five frames, not twenty with repeats.
 */
export const FRAME_COUNT = { min: 1, max: 20, dflt: 8 };

/**
 * Frame size in px: a floating frame's or a polaroid's width, a band's or a mosaic's row height; an unset size takes the style's (STYLE_SIZE).
 */
export const FRAME_SIZE = { min: 60, max: 400 };
export const STYLE_SIZE = { floating: 140, band: 156, mosaic: 140, fill: 0 };

/**
 * The colour each look draws with when the owner has picked none; a look not in the table has no colour to pick.
 */
export const LOOK_COLOR = { polaroid: '#ffffff', border: '#ffffff', thick: '#ffffff', double: '#ffffff', dark: '#161616', glow: 'accent' };

/** A floating frame's shape: a little wider than 4:3, the ApeironLF proportion. */
export const FRAME_ASPECT = 1.35;

/** How far from the middle the scatter reaches. */
export const FRAME_SPREAD = { min: 0, max: 1, dflt: 0.85 };

/** Corner rounding in px. */
export const FRAME_RADIUS = { min: 0, max: 48, dflt: 5 };

/** Seconds for one cycle of the motion. */
export const MOTION_TIME = { min: 0.5, max: 90, dflt: 30 };

/** Seconds a picture stands before the next takes its place. */
export const PICTURE_TIME = { min: 0.5, max: 90, dflt: 12 };

/** Columns in the mosaic wall. */
export const MOSAIC_COLS = 4;

/** Tiles in a mosaic wall: it starts with more than the frames, since a wall has to be filled. */
export const MOSAIC_COUNT = { min: 4, max: 20, dflt: 12 };

/**
 * Example pictures in the layer's own image shape, so a layer with nothing in it can still show what it does.
 * @param {number} count
 * @returns {Array<{src: string}>}
 */
export function placeholderPhotos(count) {
  return Array.from({ length: Math.max(1, Math.round(Number(count) || 0)) },
    (_, i) => ({ src: placeholderPhoto(i) }));
}

/** The style, with the floating frames for anything unknown. */
export function galleryStyle(style) {
  return GALLERY_STYLES.includes(style) ? style : 'floating';
}

/**
 * The motion a style runs: the one asked for when the style can take it, otherwise the style's own default.
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
 * Whether the pictures move at all: reduced motion always wins.
 * A band's motion is its roll, so it moves whatever the motion field says.
 */
export function galleryMoves({ style = 'floating', motion, reducedMotion = false } = {}) {
  if (reducedMotion) return false;
  return galleryStyle(style) === 'band' || styleMotion(style, motion) !== 'none';
}

/**
 * How many frames are drawn: the count inside its bounds, cut to the pictures there are (`available`) unless `repeat` pads them; with none it stands.
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
 * The colour a look draws with: the owner's when one is set, otherwise the look's own, and nothing for a look without a colour.
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
 * The proportion a frame takes for a shape and a look: square for the regular shapes, tall for the arch and a polaroid, FRAME_ASPECT for the rest.
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
 * The seed a layout is drawn from: the owner's fixed one when it is set, otherwise the visit's.
 * @param {unknown} seed The stored seed; 0 or absent means the visit's
 * @param {number} visit The seed drawn once per page load
 * @returns {number}
 */
export function layoutSeed(seed, visit) {
  const n = Number(seed);
  return Number.isFinite(n) && n > 0 ? Math.round(n) : (Number(visit) || 1);
}

/**
 * The scatter: one placement per frame in drawing order, its centre in per cent of the section, laid on a jittered grid dealt in a seeded order.
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
 * The mosaic wall: one span per tile on MOSAIC_COLS columns, most one cell, some two wide or two high, dealt by the seeded die. Pure.
 * @param {unknown} count
 * @param {unknown} seed
 * @returns {Array<{cols: number, rows: number, phase: number}>}
 */
export function mosaicSpans(count, seed, available, repeat = false) {
  const tiles = frameCount(count, 'mosaic', available, repeat);
  return Array.from({ length: tiles }, (_, i) => mosaicSpan(seed, i));
}

/**
 * The rows a mosaic needs to hold its spans, so the wall fills the section exactly instead of running past its foot.
 * Pure.
 * @param {Array<{cols: number, rows: number}>} spans
 * @param {number} [cols]
 * @returns {number}
 */
export function mosaicRows(spans, cols = MOSAIC_COLS) {
  const area = spans.reduce((sum, s) => sum + s.cols * s.rows, 0);
  return Math.max(1, Math.ceil(area / cols));
}
