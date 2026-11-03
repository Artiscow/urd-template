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

/**
 * How a menu that hangs from an anchor (the canvas's «+ New block») fits the screen: down from the anchor while it fits there, otherwise to the side of the anchor with more room, held to that room so it scrolls inside instead of running past the edge.
 * Every value is in screen px.
 * @param {{ anchorTop: number, anchorBottom: number, gap: number, height: number, viewport: number, margin?: number, min?: number }} p
 *   gap is the space between the anchor and the menu, viewport the screen's height, min the least height the menu is held to
 * @returns {{ up: boolean, room: number|null }} up: hang above the anchor; room: the height to hold the menu to, null when it fits whole
 */
export function menuFit(p) {
  const margin = p.margin ?? 8;
  const below = p.viewport - margin - (p.anchorBottom + p.gap);
  const above = p.anchorTop - p.gap - margin;
  if (p.height <= below) return { up: false, room: null };
  const up = above > below;
  const room = up ? above : below;
  return { up, room: p.height <= room ? null : Math.max(p.min ?? 0, room) };
}

/**
 * The sideways move that keeps a box inside the screen: positive to the right, negative to the left, 0 when it fits.
 * A box wider than the screen keeps its left edge in view.
 * @param {number} left The box's left edge on the screen
 * @param {number} width The box's width
 * @param {number} viewport The screen's width
 * @param {number} [margin]
 * @returns {number}
 */
export function shiftInto(left, width, viewport, margin = 8) {
  if (left < margin) return margin - left;
  const over = left + width - (viewport - margin);
  return over > 0 ? Math.max(margin - left, -over) : 0;
}

/**
 * Where a side panel beside a menu opens (the slim «+ New block» menu's group): on the menu's right while it fits there, on the left when it does not and the left has more room; its top level with the row that opened it, moved up so its bottom stays on the screen, but never above the screen's top.
 * Every value is in screen px.
 * @param {{ menuLeft: number, menuRight: number, rowTop: number, width: number, height: number, viewportW: number, viewportH: number, gap: number, margin?: number }} p
 * @returns {{ left: boolean, top: number, room: number|null }} left: open on the menu's left; top: the panel's top; room: the height to hold the panel to, null when it fits whole
 */
export function flyoutFit(p) {
  const margin = p.margin ?? 8;
  const rightRoom = p.viewportW - margin - (p.menuRight + p.gap);
  const leftRoom = p.menuLeft - p.gap - margin;
  const left = p.width > rightRoom && leftRoom > rightRoom;
  const tall = p.viewportH - 2 * margin;
  const height = Math.min(p.height, tall);
  const top = Math.max(margin, Math.min(p.rowTop, p.viewportH - margin - height));
  return { left, top, room: p.height > tall ? tall : null };
}
