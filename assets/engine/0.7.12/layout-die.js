/**
 * The seeded die the gallery block's framed views and the photo layer throw: the same seed always gives the same throws.
 * Notes: docs/engine-notes/layout-die.md (Urd repository).
 */

/** Maximum lean, in degrees either way. */
export const FRAME_TILT = { min: 0, max: 15, dflt: 5 };

/**
 * djb2, the same hash the media file names use (imageTools.js), written out here so a page loads no image pipeline for it.
 * @param {unknown} text
 * @returns {number} Unsigned 32-bit
 */
export function hash32(text) {
  const s = String(text);
  let hash = 5381;
  for (let i = 0; i < s.length; i++) hash = ((hash << 5) + hash + s.charCodeAt(i)) >>> 0;
  return hash;
}

/** A fraction in [0, 1) from the seed and a field name: one throw of the die, its bits spread so neighbouring keys land far apart. */
export function roll(seed, key) {
  let h = hash32(`${seed}:${key}`);
  h ^= h >>> 15;
  h = Math.imul(h, 0x2c1b3c6d) >>> 0;
  h ^= h >>> 12;
  h = Math.imul(h, 0x297a2d39) >>> 0;
  h ^= h >>> 15;
  return (h >>> 0) / 4294967296;
}

/** Rounded to two decimals, so the CSS the layer writes stays readable. */
export const round2 = (n) => Math.round(n * 100) / 100;

/** A number inside its bounds, with the default for anything unusable; an absent value is unset, never zero. */
export function clamp(value, { min, max, dflt }) {
  if (value === undefined || value === null || value === '') return dflt;
  const n = Number(value);
  if (!Number.isFinite(n)) return dflt;
  return Math.min(max, Math.max(min, n));
}

export function clampTilt(tilt) {
  return clamp(tilt, FRAME_TILT);
}

/**
 * One frame's lean in degrees within plus or minus `tilt`, the same for the same seed and index; the scatter and the polaroid view share it.
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
 * One tile's span on the mosaic wall: most tiles one cell, some two wide, some two high, a few both.
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
