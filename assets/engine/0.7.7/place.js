/**
 * Pure placement logic for new blocks: adding a block puts it WHERE the
 * owner clicked in the section, not at a fixed spot. Kept DOM-free so the
 * maths can be contract-tested (tests/place.test.mjs).
 */

/**
 * Centres a w×h frame on a click point, clamped inside the section and
 * snapped to the grid. x/w are percentages of the section width, y/h/grid
 * in px (the same physical units as frames elsewhere, see docs/SCHEMA.md).
 *
 * @param {{ x: number, y: number, w: number, h: number, grid: { size: number, snap?: boolean }, snap?: boolean }} p
 *   x/y is the click point (section-relative); p.snap === false gives free placement.
 * @returns {{ x: number, y: number }}
 */
export function frameAtPoint(p) {
  const r2 = (v) => Math.round(v * 100) / 100;
  const maxX = Math.max(0, r2(100 - p.w));
  const x = Math.min(maxX, Math.max(0, r2(p.x - p.w / 2)));
  let y = Math.max(0, p.y - p.h / 2);
  const free = p.snap === false || p.grid?.snap === false;
  const size = p.grid?.size || 8;
  y = free ? Math.round(y) : Math.round(y / size) * size;
  return { x, y: Math.max(0, y) };
}

/**
 * Where a rotated block's toolbar is anchored, in the block's own unrotated
 * box: the corner of the block's bounding box on the screen (top left, or
 * bottom left when the toolbar is flipped under the block), carried back
 * through the rotation. The toolbar is a child of the rotated block and
 * turns itself upright (base.css), so anchoring it at the block's own
 * corner would lay it over the content whenever that corner is not the
 * block's highest point. Rotation is about the box's centre, clockwise for
 * a positive angle, as CSS `rotate()` draws it.
 * @param {number} w The block's width in px
 * @param {number} h The block's height in px
 * @param {number} rotDeg The rotation in degrees
 * @param {boolean} under The toolbar flipped under the block
 * @returns {{left: number, top: number}} The anchor from the block's top left corner, in px
 */
export function toolbarAnchor(w, h, rotDeg, under) {
  const t = (rotDeg * Math.PI) / 180;
  const c = Math.cos(t);
  const s = Math.sin(t);
  const bw = w * Math.abs(c) + h * Math.abs(s);
  const bh = w * Math.abs(s) + h * Math.abs(c);
  // The bounding box's corner relative to the centre, on the screen.
  const a = -bw / 2;
  const b = under ? bh / 2 : -bh / 2;
  // The inverse rotation takes it back into the block's own box.
  const r2 = (v) => Math.round(v * 100) / 100;
  return { left: r2(w / 2 + a * c + b * s), top: r2(h / 2 - a * s + b * c) };
}
