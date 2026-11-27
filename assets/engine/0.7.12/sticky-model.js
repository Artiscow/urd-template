/**
 * Pure, DOM-free logic for sticky blocks: whether a block stays, pins or parks at its release limit, and the geometry of groups and screen docks.
 * Notes: docs/engine-notes/sticky-model.md (Urd repository).
 */

/**
 * The bounding box of a group of pinned blocks: the group pins and releases as one unit, each member keeping its place inside the box.
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
 * Screen docking: places the box at one of nine anchor points in the window; the margin applies only to the edges it docks to, and centered axes ignore it.
 * @param {string} dock 'top-left' … 'bottom-right' (vertical-horizontal)
 * @param {number} margin distance from the docked edges in px
 * @param {{w: number, h: number}} box the box measurements in px
 * @param {{w: number, h: number, inset?: {top?: number, left?: number, right?: number}}} view The window in px, and the menu's band, which the docks lie inside
 * @returns {{left: number, top: number}} position in px from the window's left/top
 */
export function dockPosition(dock, margin, box, view) {
  const [vert, horz] = String(dock || 'bottom-right').split('-');
  const m = Number.isFinite(margin) ? margin : 0;
  const inset = viewInset(view);
  // If the box is larger than the window, the top/left edge wins: centering is then meaningless, and the content must not be pushed off screen.
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
 * The dock key nearest a box dropped in the window: its center picks a cell in a three-by-three grid, keyed as the schema's dock enum (middle row 'middle').
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
export function stickyState(scrollY, m) {
  // Invalid or too-early limit (above the block's natural place): pinning makes no sense, the block always stays where it is.
  const parkY = m.limitBottom - m.sectionTop - m.blockH;
  if (parkY < m.blockY) return { mode: 'static' };

  // The block has not reached the pin point yet.
  if (m.sectionTop + m.blockY - scrollY >= m.offset) return { mode: 'static' };

  // Pinned, as long as there is room between the window top and the release limit.
  if (m.offset + m.blockH <= m.limitBottom - scrollY) return { mode: 'fixed', top: m.offset };

  // The release limit is passed: the block is left behind at the limit.
  return { mode: 'parked', y: parkY };
}

/**
 * Whether a block pins while scrolling on the phone: scroll mode, `sticky.phone` true and a numeric `offset`; docking to the screen needs no `phone`.
 * @param {object|null|undefined} sticky The block's `sticky`
 * @returns {boolean}
 */
export function pinsOnPhone(sticky) {
  return Boolean(sticky) && sticky.phone === true && (sticky.mode ?? 'scroll') === 'scroll' && typeof sticky.offset === 'number';
}

/**
 * The holder of a group pinned on the phone: it spans the group's slots from the highest top to the lowest foot, with each block's offset from the holder's top.
 * @param {Array<{top: number, h: number}>} slots The slots' tops in the row grid and the blocks' heights, in reading order
 * @returns {{top: number, height: number, tops: number[]}}
 */
export function stuckBox(slots) {
  if (!slots.length) return { top: 0, height: 0, tops: [] };
  const top = Math.min(...slots.map((slot) => slot.top));
  const bottom = Math.max(...slots.map((slot) => slot.top + slot.h));
  return { top: Math.round(top), height: Math.round(bottom - top), tops: slots.map((slot) => Math.round(slot.top - top)) };
}

/**
 * The `sticky` that speaks for each pinning group on the phone: its first block the phone shows, in section order; a block without a group speaks for itself.
 * @param {Array<{id: string, sticky?: object|null, hideMobile?: boolean}>} blocks The section's blocks, in the section's order
 * @returns {Map<string, object>} The lead's `sticky` by group key (`sticky.group`, or `solo-<id>`)
 */
export function stickyLeads(blocks) {
  const leads = new Map();
  for (const block of blocks ?? []) {
    if (!block?.sticky || block.hideMobile) continue;
    const key = block.sticky.group || `solo-${block.id}`;
    if (!leads.has(key)) leads.set(key, block.sticky);
  }
  return leads;
}
