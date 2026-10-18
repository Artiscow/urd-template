/**
 * Background layer: pattern.
 * A small drawn tile repeated over the section, in one colour: dots, a grid, stripes and the like, the pattern overlays of the other builders, made here with inline SVG and no image files.
 *
 * The tile is not painted in its colour.
 * The layer paints its whole box with the colour (so a theme token follows the theme, which a colour written into an SVG image never could) and the pattern is the MASK that lets it through.
 * The mask is one SVG as large as the layer, holding the tile as an SVG <pattern>: the size is the pattern's own cell and the rotation its patternTransform, so a turned pattern needs no oversized, rotated element.
 * Inverted, the figures are cut out of a full surface instead.
 *
 * ADR-0011 gating: without mask support the layer would be a flat sheet of colour over the section, so there it draws nothing.
 */
import { resolveColor } from '../theme.js';

/** The tiles on offer; dots is the one an unknown value falls back to. */
export const BG_PATTERNS = ['dots', 'grid', 'diagonal', 'checks', 'waves', 'zigzag', 'plus', 'triangles'];

/** The tile's side in px. */
export const PATTERN_SIZE = { min: 8, max: 160, dflt: 28 };

/** The default strength: a pattern is a texture, not a picture. */
export const PATTERN_OPACITY = 0.12;

/**
 * The tiles, drawn on a 24 x 24 cell that repeats without a seam: what leaves one edge enters at the opposite one.
 */
const TILES = {
  dots: '<circle cx="12" cy="12" r="3"/>',
  grid: '<rect width="24" height="1.6"/><rect width="1.6" height="24"/>',
  diagonal: '<path d="M-6 6L6 -6M0 24L24 0M18 30L30 18" fill="none" stroke="#000" stroke-width="4"/>',
  checks: '<rect width="12" height="12"/><rect x="12" y="12" width="12" height="12"/>',
  waves: '<path d="M0 12Q6 4 12 12T24 12" fill="none" stroke="#000" stroke-width="2.4"/>',
  zigzag: '<path d="M0 16L6 8L12 16L18 8L24 16" fill="none" stroke="#000" stroke-width="2.4"/>',
  plus: '<path d="M12 7V17M7 12H17" fill="none" stroke="#000" stroke-width="2.4" stroke-linecap="round"/>',
  triangles: '<path d="M0 24L12 4L24 24Z"/>',
};

/** The pattern, with dots for anything unknown. */
export function bgPattern(pattern) {
  return BG_PATTERNS.includes(pattern) ? pattern : 'dots';
}

/** The tile's side in px, inside the bounds. */
export function patternSize(size) {
  const n = Number(size);
  if (!Number.isFinite(n) || n <= 0) return PATTERN_SIZE.dflt;
  return Math.min(PATTERN_SIZE.max, Math.max(PATTERN_SIZE.min, Math.round(n)));
}

/** The turn in whole degrees, 0 to 359; anything unusable is no turn. */
export function patternRotation(rotation) {
  const n = Number(rotation);
  if (!Number.isFinite(n)) return 0;
  return ((Math.round(n) % 360) + 360) % 360;
}

/** The strength, 0 to 1, with the default for a missing or unusable value. */
export function patternOpacity(opacity) {
  const n = Number(opacity);
  if (opacity === undefined || opacity === null || opacity === '' || !Number.isFinite(n)) return PATTERN_OPACITY;
  return Math.min(1, Math.max(0, n));
}

/**
 * The mask as an SVG document: the tile as a <pattern> over the whole box, or cut out of it.
 * Pure, and every value in it comes from the allowlist and the clamps above, never from the stored props as written.
 * @param {{pattern?: string, size?: number, rotation?: number, invert?: boolean}} props
 * @returns {string}
 */
export function patternSvg(props = {}) {
  const size = patternSize(props.size);
  const turn = patternRotation(props.rotation);
  const tile = TILES[bgPattern(props.pattern)];
  const pattern = `<pattern id="p" width="${size}" height="${size}" patternUnits="userSpaceOnUse"`
    + `${turn ? ` patternTransform="rotate(${turn})"` : ''}><g transform="scale(${size / 24})">${tile}</g></pattern>`;
  const fill = '<rect width="100%" height="100%" fill="url(#p)"/>';
  // Inverted: a luminance mask inside the SVG, white where the colour shows and the figures in black where it does not.
  const body = props.invert === true
    ? `<mask id="m"><rect width="100%" height="100%" fill="#fff"/>${fill}</mask><rect width="100%" height="100%" mask="url(#m)"/>`
    : fill;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs>${pattern}</defs>${body}</svg>`;
}

/** Whether the browser can mask an element with an image. */
const canMask = () => typeof CSS !== 'undefined' && typeof CSS.supports === 'function'
  && (CSS.supports('mask-image', 'none') || CSS.supports('-webkit-mask-image', 'none'));

export const patternLayer = {
  version: 1,
  label: 'Pattern',
  labelKey: 'bgLayer.pattern',
  defaults: () => ({ pattern: 'dots', color: 'text', size: PATTERN_SIZE.dflt, opacity: PATTERN_OPACITY, rotation: 0, invert: false }),
  migrations: {},
  /**
   * @param {HTMLElement} el
   * @param {{pattern?: string, color?: string, size?: number, opacity?: number, rotation?: number, invert?: boolean}} props
   */
  render(el, props) {
    if (!canMask()) return;
    const uri = `url("data:image/svg+xml,${encodeURIComponent(patternSvg(props))}")`;
    el.style.backgroundColor = resolveColor(props.color ?? 'text');
    el.style.opacity = String(patternOpacity(props.opacity));
    for (const prefix of ['webkitMask', 'mask']) {
      el.style[`${prefix}Image`] = uri;
      el.style[`${prefix}Size`] = '100% 100%';
      el.style[`${prefix}Repeat`] = 'no-repeat';
    }
  },
};
