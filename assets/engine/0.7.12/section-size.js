/**
 * The grip on the seam between two sections (seamGrip in preview-edit.js): its pill grows a section, its tabs shrink one, a shrink stopping at the content.
 */

/**
 * @param {{
 *   part: 'grow' | 'shrinkAbove' | 'shrinkBelow',
 *   dyPointer: number,
 *   above?: { heightPx: number, contentBottom: number } | null,
 *   below?: { heightPx: number, blockYs: number[] } | null,
 *   grid: { size: number, snap?: boolean },
 *   free?: boolean,
 *   past?: boolean
 * }} p `dyPointer` is the drag, > 0 down; `above` gives its content's end, `below` its blocks' y; `free` (Ctrl, Cmd) leaves the grid; `past` (Alt) passes the content.
 * @returns {{ side: 'above' | 'below' | null, heightPx: number, dy: number, stopped: boolean, overlaps: boolean }}
 *   `side` the section that changes, `heightPx` its new height, `dy` how far its blocks move, `stopped` a shrink met the content, `overlaps` the content hangs over.
 */
export function seamDrag(p) {
  const size = p.grid?.size || 8;
  const min = size * 3;
  const free = p.free || p.grid?.snap === false;
  const d = free ? Math.round(p.dyPointer) : Math.round(p.dyPointer / size) * size;
  const none = { side: null, heightPx: 0, dy: 0, stopped: false, overlaps: false };

  if (p.part === 'grow') {
    if (d > 0 && p.above) return { ...none, side: 'above', heightPx: p.above.heightPx + d };
    if (d < 0 && p.below) return { ...none, side: 'below', heightPx: p.below.heightPx - d, dy: -d };
    return none;
  }

  if (p.part === 'shrinkAbove' && p.above) {
    const want = Math.max(0, -d);
    const floor = p.past ? min : Math.max(min, p.above.contentBottom);
    const room = Math.max(0, p.above.heightPx - floor);
    const took = Math.min(want, room);
    const heightPx = p.above.heightPx - took;
    return { ...none, side: 'above', heightPx, stopped: want > room, overlaps: heightPx < p.above.contentBottom };
  }

  if (p.part === 'shrinkBelow' && p.below) {
    const want = Math.max(0, d);
    const topY = p.below.blockYs.length ? Math.min(...p.below.blockYs) : Infinity;
    const heightRoom = Math.max(0, p.below.heightPx - min);
    // Without Alt the topmost block stops at the top edge; one already hanging above it leaves no room.
    const room = p.past ? heightRoom : Math.min(heightRoom, Math.max(0, topY));
    const took = Math.min(want, room);
    // || 0 normalizes -0 (clamped to a standstill) to 0.
    return { ...none, side: 'below', heightPx: p.below.heightPx - took, dy: -took || 0, stopped: want > room, overlaps: topY - took < 0 };
  }

  return none;
}

/**
 * A seam dragged in the phone view: the pill grows the room by the line and each tab shrinks its side's, down to none, in steps of 4 px (1 px with `fine`).
 * @param {{part: 'grow'|'shrinkAbove'|'shrinkBelow', dy: number, above: number|null, below: number|null, fine?: boolean}} p `above` and `below` the rooms as the drag found them (the section above's below its blocks, the section below's above them), null where there is no such section
 * @returns {{side: 'above'|'below'|null, room: number}} Which section's room changes, and to what; side null where nothing changes
 */
export function phoneSeamDrag({ part, dy, above, below, fine = false }) {
  const snap = (value) => Math.max(0, fine ? Math.round(value) : Math.round(value / 4) * 4);
  if (part === 'grow') {
    if (dy > 0 && above !== null) return { side: 'above', room: snap(above + dy) };
    if (dy < 0 && below !== null) return { side: 'below', room: snap(below - dy) };
    return { side: null, room: 0 };
  }
  if (part === 'shrinkAbove' && above !== null) return { side: 'above', room: Math.min(above, snap(above + Math.min(0, dy))) };
  if (part === 'shrinkBelow' && below !== null) return { side: 'below', room: Math.min(below, snap(below - Math.max(0, dy))) };
  return { side: null, room: 0 };
}
