/**
 * Multi-selection: marquee hits, align and distribute, and a group's offset on paste, on frame values (x/w in percent, y/h in px).
 * Pure and tested.
 */

/**
 * The blocks a marquee touches, in section px; a block partly inside counts.
 * @param {{ left: number, top: number, right: number, bottom: number }} rect
 * @param {Array<{ id: string, left: number, top: number, right: number, bottom: number }>} blocks
 * @returns {string[]}
 */
export function blocksInRect(rect, blocks) {
  return blocks
    .filter((b) => b.left < rect.right && b.right > rect.left && b.top < rect.bottom && b.bottom > rect.top)
    .map((b) => b.id);
}

/**
 * Aligns the selection inside its own bounding box: left, center and right by x/w, top, middle and bottom by y/h.
 * @param {Array<{ id: string, x: number, y: number, w: number, h: number }>} items
 * @param {'left'|'center'|'right'|'top'|'middle'|'bottom'} mode
 * @returns {Array<{ id: string, x?: number, y?: number }>} only the blocks that actually move
 */
export function alignMoves(items, mode) {
  if (items.length < 2) return [];
  const r2 = (v) => Math.round(v * 100) / 100;
  const horizontal = mode === 'left' || mode === 'center' || mode === 'right';
  const start = Math.min(...items.map((b) => (horizontal ? b.x : b.y)));
  const end = Math.max(...items.map((b) => (horizontal ? b.x + b.w : b.y + b.h)));
  const moves = [];
  for (const b of items) {
    const size = horizontal ? b.w : b.h;
    let pos;
    if (mode === 'left' || mode === 'top') pos = start;
    else if (mode === 'right' || mode === 'bottom') pos = end - size;
    else pos = start + (end - start) / 2 - size / 2;
    pos = horizontal ? r2(pos) : Math.round(pos);
    if (pos !== (horizontal ? b.x : b.y)) {
      moves.push(horizontal ? { id: b.id, x: pos } : { id: b.id, y: pos });
    }
  }
  return moves;
}

/**
 * Distributes three or more blocks evenly: the first and last stay put, and the gaps between them are made equal.
 * @param {Array<{ id: string, x: number, y: number, w: number, h: number }>} items
 * @param {'x'|'y'} axis
 * @returns {Array<{ id: string, x?: number, y?: number }>}
 */
export function distributeMoves(items, axis) {
  if (items.length < 3) return [];
  const r2 = (v) => Math.round(v * 100) / 100;
  const pos = (b) => (axis === 'x' ? b.x : b.y);
  const size = (b) => (axis === 'x' ? b.w : b.h);
  const sorted = [...items].sort((a, b) => pos(a) - pos(b));
  const first = sorted[0];
  const last = sorted[sorted.length - 1];
  const span = pos(last) + size(last) - pos(first);
  const total = sorted.reduce((sum, b) => sum + size(b), 0);
  const gap = (span - total) / (sorted.length - 1);
  const moves = [];
  let cursor = pos(first) + size(first) + gap;
  for (const b of sorted.slice(1, -1)) {
    const target = axis === 'x' ? r2(cursor) : Math.round(cursor);
    if (target !== pos(b)) moves.push(axis === 'x' ? { id: b.id, x: target } : { id: b.id, y: target });
    cursor += size(b) + gap;
  }
  return moves;
}

/**
 * Clamps a group's offset on paste or duplicate so the whole selection stays within the section's width and below its top, each block moved alike.
 * @param {Array<{ x: number, y: number, w: number, h: number }>} frames
 * @param {number} dx Wanted offset in % (may be clipped)
 * @param {number} dy Wanted offset in px (clipped against the top)
 * @returns {{ dx: number, dy: number }}
 */
export function groupDelta(frames, dx, dy) {
  if (!frames.length) return { dx: 0, dy: 0 };
  const r2 = (v) => Math.round(v * 100) / 100;
  const minX = Math.min(...frames.map((f) => f.x));
  const maxRight = Math.max(...frames.map((f) => f.x + f.w));
  const minY = Math.min(...frames.map((f) => f.y));
  const clampedDx = Math.min(Math.max(dx, -minX), Math.max(0, 100 - maxRight));
  const clampedDy = Math.max(dy, -Math.max(0, minY));
  return { dx: r2(clampedDx) || 0, dy: Math.round(clampedDy) || 0 };
}
