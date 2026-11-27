/**
 * Section shape dividers (`section.divider`): a drawn edge at a section's top or bottom in the colour of what it meets there; pure and DOM-free.
 * Notes: docs/engine-notes/divider-model.md (Urd repository).
 */

/** The shapes on offer. */
export const DIVIDER_SHAPES = ['wave', 'tilt', 'curve', 'triangle', 'zigzag'];

/** The divider's height in px. */
export const DIVIDER_HEIGHT = { min: 16, max: 240, dflt: 64 };

/**
 * The filled outline of a bottom divider in a 1200 x 120 box, the colour rising from the foot into the section; base.css turns it upside down for a top divider.
 * @param {string} shape One of DIVIDER_SHAPES
 * @returns {string} SVG path data
 */
export function dividerPath(shape) {
  if (shape === 'tilt') return 'M0 120L1200 0V120Z';
  if (shape === 'curve') return 'M0 0C300 120 900 120 1200 0V120H0Z';
  if (shape === 'triangle') return 'M0 120L600 0L1200 120Z';
  if (shape === 'zigzag') {
    // Twenty-four teeth; the first and the last end on the foot.
    const teeth = 24;
    const step = 1200 / teeth;
    let d = 'M0 120';
    for (let i = 0; i < teeth; i += 1) d += `L${step * i + step / 2} 0L${step * (i + 1)} 120`;
    return `${d}Z`;
  }
  return 'M0 60C200 120 400 0 600 60S1000 120 1200 60V120H0Z';
}

/**
 * One edge's divider as drawn, or null for none: the shape, the height within bounds, the colour (the page background unless set), the mirror and invert flags.
 * @param {unknown} def section.divider.top or .bottom
 * @returns {{shape: string, height: number, color: string, flip: boolean, invert: boolean}|null}
 */
export function sectionDivider(def) {
  if (!def || typeof def !== 'object' || !DIVIDER_SHAPES.includes(def.shape)) return null;
  const n = Number(def.height);
  const height = Number.isFinite(n) && n > 0
    ? Math.min(DIVIDER_HEIGHT.max, Math.max(DIVIDER_HEIGHT.min, Math.round(n)))
    : DIVIDER_HEIGHT.dflt;
  return {
    shape: def.shape,
    height,
    color: typeof def.color === 'string' && def.color ? def.color : 'bg',
    flip: def.flip === true,
    invert: def.invert === true,
  };
}

/**
 * The divider as an SVG stretched to the section's width; inverted, the colour fills what the outline leaves open, upside down so it still stands on the foot.
 * @param {{shape: string, invert?: boolean}} divider From sectionDivider
 * @returns {string}
 */
export function dividerSvg(divider) {
  const outline = dividerPath(divider.shape);
  const path = divider.invert === true
    ? `<path fill-rule="evenodd" transform="translate(0 120) scale(1 -1)" d="M0 0H1200V120H0Z${outline}" fill="currentColor"/>`
    : `<path d="${outline}" fill="currentColor"/>`;
  return `<svg viewBox="0 0 1200 120" preserveAspectRatio="none" aria-hidden="true">${path}</svg>`;
}
