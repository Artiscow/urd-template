/**
 * Pure logic for the grip on the seam between two sections (preview-edit.js
 * seamGrip): a pill on the line that only grows, the section above as it is
 * dragged down and the section below at its top as it is dragged up, and a
 * tab above and a tab below that each shrink the section they stand in.
 * One drag that crosses its starting point switches which section grows.
 * A shrink stops where the section's content ends: the section above at its
 * lowest element, the section below where its topmost element meets its top
 * edge. With `past` (Alt held) it goes on to the minimum height, and the
 * content hangs over the next section.
 * A section that grows or shrinks at its TOP takes its blocks with it (block
 * y is measured from the section top), so the content stays visually still.
 * The other section never changes. DOM-free so the clamps can be
 * contract-tested (tests/section-size.test.mjs).
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
 * }} p `dyPointer` is how far the pointer has been dragged, > 0 down; `above` is the section over the seam with where its lowest element ends, and `below` the one under it with every block's desktop y; `free` (Ctrl or Cmd) leaves the grid's steps, and `past` (Alt) lets a shrink pass the content.
 * @returns {{ side: 'above' | 'below' | null, heightPx: number, dy: number, stopped: boolean, overlaps: boolean }}
 *   `side` is the section that changes (null: none), `heightPx` its new height, `dy` how far its blocks move (the section below only), `stopped` that a shrink met the content, and `overlaps` that the content now hangs over the next section.
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
