/**
 * Pure typography logic for the text toolbar: size steps with clamping, indent steps and font stack recognition.
 */
import { FONT_STACKS } from './fonts.js';

/** The bounds for font size on a selection, in px. */
export const SIZE_MIN = 8;
export const SIZE_MAX = 120;

/** Round and clamp to [SIZE_MIN, SIZE_MAX]; an invalid number gives null. */
export function clampSize(px) {
  const n = Math.round(Number(px));
  if (!Number.isFinite(n)) return null;
  return Math.min(SIZE_MAX, Math.max(SIZE_MIN, n));
}

/** One step up or down from an effective size (delta in px, fine adjustment). */
export function stepSize(px, delta) {
  return clampSize(Number(px) + Number(delta));
}

/**
 * The size ladder A-up and A-down jump through, small steps at the bottom and larger at the top; a size between rungs goes to the next rung.
 */
export const SIZE_LADDER = [8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 32, 40, 48, 64, 80, 96, 120];

/** The next rung up (dir 1) or down (dir -1) on the size ladder. */
export function ladderStep(px, dir) {
  const cur = Number(px);
  if (!Number.isFinite(cur)) return clampSize(px);
  if (dir > 0) {
    const next = SIZE_LADDER.find((s) => s > cur);
    return next ?? SIZE_MAX;
  }
  const below = SIZE_LADDER.filter((s) => s < cur);
  return below.length ? below[below.length - 1] : SIZE_MIN;
}

/**
 * The line height presets in the spacing menu: [CSS value, display name].
 * An empty value = inherit (removes the override from the paragraph).
 * @type {Array<[string, string]>}
 */
export const LINE_HEIGHTS = [
  ['', 'Inherit'],
  ['1', '1.0'],
  ['1.15', '1.15'],
  ['1.5', '1.5'],
  ['2', '2.0'],
];

/** The indent step and the ceiling, in em (relative steps follow the font size). */
export const INDENT_STEP_EM = 2;
export const INDENT_MAX_EM = 16;

/**
 * One indent step from a marginLeft value: an empty string at zero, and a value not in em stepped from 0.
 */
export function stepIndent(marginLeft, dir) {
  const m = /^(\d+(?:\.\d+)?)em$/.exec(String(marginLeft || '').trim());
  const cur = m ? Number(m[1]) : 0;
  const next = Math.min(INDENT_MAX_EM, Math.max(0, cur + dir * INDENT_STEP_EM));
  return next === 0 ? '' : `${next}em`;
}

/** The first font name in a CSS font stack, normalised (no quotes, lower case). */
export function firstFamily(css) {
  const first = String(css || '').split(',')[0].trim().replace(/^['"]|['"]$/g, '');
  return first.toLowerCase();
}

/**
 * The FONT_STACKS value whose first font name matches a computed font-family, else an empty string.
 */
export function matchFontStack(css) {
  const wanted = firstFamily(css);
  if (!wanted) return '';
  const hit = FONT_STACKS.find(([, stack]) => firstFamily(stack) === wanted);
  return hit ? hit[1] : '';
}
