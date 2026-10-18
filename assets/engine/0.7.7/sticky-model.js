/**
 * Pure state logic for sticky blocks ("pin on scroll"): given the scroll
 * position and document measurements, decides whether the block stays in
 * its normal absolute position (static), pins at the window top (fixed)
 * or parks at the release limit (parked). The DOM work lives in
 * sticky.js; this module is DOM-free and contract-tested in
 * tests/sticky.test.mjs.
 *
 * Pinning is positioning, not animation (no transitions), so
 * prefers-reduced-motion needs no special handling here.
 */

/**
 * @param {number} scrollY
 * @param {{
 *   sectionTop: number,   // the section's top in document px
 *   blockY: number,       // the block's desktop y (section-relative px)
 *   blockH: number,       // the block's height in px
 *   limitBottom: number,  // the release limit in document px: the bottom of
 *                         // the until section, or the own section's bottom
 *                         // without until
 *   offset: number        // desired distance from the window top
 * }} m
 * @returns {{ mode: 'static' } | { mode: 'fixed', top: number } | { mode: 'parked', y: number }}
 *   parked.y is section-relative px (may exceed the section height when
 *   until points at a later section; sections never clip).
 */
/**
 * Bounding box for a group of pinned blocks. The group pins and releases
 * as ONE unit, and each member keeps its place inside the box, instead of
 * all of them piling up at the window top.
 * @param {Array<{x: number, y: number, w: number, h: number}>} items
 * @returns {{x: number, y: number, w: number, h: number}}
 */
export function groupBox(items) {
  const x = Math.min(...items.map((i) => i.x));
  const y = Math.min(...items.map((i) => i.y));
  const right = Math.max(...items.map((i) => i.x + i.w));
  const bottom = Math.max(...items.map((i) => i.y + i.h));
  return { x, y, w: right - x, h: bottom - y };
}

/**
 * Screen docking ("pin to screen"): the box is placed at one of nine anchor
 * points in the window and stays there regardless of scrolling. The margin
 * applies only to the edges the box docks to; center axes are centered and
 * ignore it.
 * @param {string} dock 'top-left' … 'bottom-right' (vertical-horizontal)
 * @param {number} margin distance from the docked edges in px
 * @param {{w: number, h: number}} box the box measurements in px
 * @param {{w: number, h: number, inset?: {top?: number, left?: number, right?: number}}} view the window
 *   measurements in px, and the menu's own band (a sticky top bar's height, a side column's width):
 *   the docks lie inside it, so a docked box is never drawn behind the menu
 * @returns {{left: number, top: number}} position in px from the window's left/top
 */
export function dockPosition(dock, margin, box, view) {
  const [vert, horz] = String(dock || 'bottom-right').split('-');
  const m = Number.isFinite(margin) ? margin : 0;
  const inset = viewInset(view);
  // If the box is larger than the window, the top/left edge wins: centering
  // is then meaningless, and the content must not be pushed off screen.
  const center = (available) => Math.max(0, available / 2);
  let top;
  if (vert === 'top') top = inset.top + m;
  else if (vert === 'bottom') top = Math.max(inset.top, view.h - box.h - m);
  else top = inset.top + center(view.h - inset.top - box.h);
  let left;
  if (horz === 'left') left = inset.left + m;
  else if (horz === 'right') left = Math.max(inset.left, view.w - inset.right - box.w - m);
  else left = inset.left + center(view.w - inset.left - inset.right - box.w);
  return { left, top };
}

/** The view's inset with every side a number. */
function viewInset(view) {
  const inset = view.inset ?? {};
  return { top: Math.max(0, inset.top || 0), left: Math.max(0, inset.left || 0), right: Math.max(0, inset.right || 0) };
}

/**
 * The nearest dock point for a box dropped in the window: the center point
 * decides in a three-way grid (left/center/right x top/middle/bottom).
 * The keys match the schema's dock enum (the middle row is 'middle').
 * Pure function, tested in tests/sticky.test.mjs.
 * @param {{left: number, top: number, w: number, h: number}} box the box in window px
 * @param {{w: number, h: number, inset?: {top?: number, left?: number, right?: number}}} view the window
 *   measurements in px, with the menu's band as in dockPosition: the thirds are of the free area
 * @returns {string} dock key ('top-left' … 'bottom-right')
 */
export function nearestDock(box, view) {
  const inset = viewInset(view);
  const cx = box.left + box.w / 2 - inset.left;
  const cy = box.top + box.h / 2 - inset.top;
  const w = view.w - inset.left - inset.right;
  const h = view.h - inset.top;
  const horz = cx < w / 3 ? 'left' : cx > (2 * w) / 3 ? 'right' : 'center';
  const vert = cy < h / 3 ? 'top' : cy > (2 * h) / 3 ? 'bottom' : 'middle';
  return `${vert}-${horz}`;
}

export function stickyState(scrollY, m) {
  // Invalid or too-early limit (above the block's natural place): pinning
  // makes no sense, the block always stays where it is.
  const parkY = m.limitBottom - m.sectionTop - m.blockH;
  if (parkY < m.blockY) return { mode: 'static' };

  // The block has not reached the pin point yet.
  if (m.sectionTop + m.blockY - scrollY >= m.offset) return { mode: 'static' };

  // Pinned, as long as there is room between the window top and the release limit.
  if (m.offset + m.blockH <= m.limitBottom - scrollY) return { mode: 'fixed', top: m.offset };

  // The release limit is passed: the block is left behind at the limit.
  return { mode: 'parked', y: parkY };
}
