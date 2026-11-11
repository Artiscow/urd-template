/**
 * The layer order of a section's blocks (0.7.30.6): a block put in front of all the others, or behind them all.
 * The canvas's toolbar, its right-click menu, its keys and the element menu all move a block this way.
 * Pure: it returns the z of each block that changes, by id, and changes nothing itself.
 */

const zOf = (block) => block.frames?.desktop?.z ?? 1;

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
