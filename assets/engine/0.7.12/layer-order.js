/**
 * The layer order of a section's blocks: blocks put in front of the others or behind them all, on the desktop or the phone.
 * Pure: it returns each changed z by id.
 */

const zOf = (block) => block.frames?.desktop?.z ?? 1;

/** A block's layer on the phone: its own there, else the desktop's (render.js mobilePlacementToCss). */
const phoneZOf = (block) => block.frames?.mobile?.z ?? zOf(block);

/**
 * The phone's layer order (ADR-0019): the pinned blocks among `ids` put before or behind the other pinned blocks in their order; flowing blocks take no part.
 * @param {Array<{id: string, frames?: {desktop?: {z?: number}, mobile?: {row?: number, z?: number}|null}}>} blocks The section's blocks
 * @param {Iterable<string>} ids The blocks to move
 * @param {number} dir Above zero to the front, else to the back
 * @returns {Map<string, number>} The new phone z by block id, for each pinned block whose own z changes
 */
export function phoneLayerChanges(blocks, ids, dir) {
  const pinned = blocks.filter((b) => Number.isFinite(b.frames?.mobile?.row));
  const wanted = new Set(ids);
  const movers = pinned.filter((b) => wanted.has(b.id)).sort((a, b) => phoneZOf(a) - phoneZOf(b));
  const others = pinned.filter((b) => !wanted.has(b.id));
  const changes = new Map();
  const put = (block, z) => {
    if (block.frames.mobile.z !== z) changes.set(block.id, z);
  };
  if (!movers.length) return changes;
  const top = others.length ? Math.max(...others.map(phoneZOf)) : 0;
  const low = others.length ? Math.min(...others.map(phoneZOf)) : Infinity;
  // A set already in front of the others, or behind them, stays as it is.
  if (dir > 0 ? phoneZOf(movers[0]) > top : phoneZOf(movers[movers.length - 1]) < low) return changes;
  if (dir > 0) {
    movers.forEach((block, i) => put(block, top + 1 + i));
    return changes;
  }
  // A z never goes below 1: where another block stands that low, the others move up as many steps as it takes, in their order.
  const lift = Math.max(0, movers.length + 1 - low);
  if (lift) for (const block of others) put(block, phoneZOf(block) + lift);
  movers.forEach((block, i) => put(block, 1 + i));
  return changes;
}

/**
 * @param {Array<{id: string, frames?: {desktop?: {z?: number}}}>} blocks The section's blocks
 * @param {string} id The block to move
 * @param {number} dir Above zero to the front, else to the back
 * @returns {Map<string, number>} The new z by block id
 */
export function layerChanges(blocks, id, dir) {
  const others = blocks.filter((b) => b.id !== id);
  const zs = others.map(zOf);
  const changes = new Map();
  if (dir > 0) {
    changes.set(id, zs.length ? Math.max(...zs) + 1 : 1);
    return changes;
  }
  if (!zs.length || Math.min(...zs) > 1) {
    changes.set(id, 1);
    return changes;
  }
  // A z never goes below 1: with another block already there, the others move one step up and this one takes 1.
  for (const other of others) changes.set(other.id, zOf(other) + 1);
  changes.set(id, 1);
  return changes;
}
