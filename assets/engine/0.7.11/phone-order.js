/**
 * The order of a section's blocks on the phone, in the row grid (ADR-0019): pure, node-tested (tests/phone-order.test.mjs).
 * The section's rule (`phoneOrder`) reads its blocks top first, by their top on the desktop (or the key `mobileOrder` a preset gives them), or column by column where blocks stand beside each other on the desktop, the left or the right column first.
 * A block's exception (`phonePlace`) puts it directly before or after another block, wherever the rule puts that one.
 * A stack (`phoneStacks`) holds blocks that read as one, standing where the first of them in the rule's order stands, its first block's exception moving it whole; a custom order (`phoneList`) holds the order as listed, a block missing from it joining where the rule and the exceptions put it.
 * A block the owner took out of the rule's columns (`phoneLoose`) reads where the rule puts it, on its own: the column it stands in on the desktop no longer holds it.
 * The editor's moves (the list, the arrows) are reckoned in phone-moves.js.
 */

/** The section's rules, the first the standard. */
export const PHONE_ORDERS = ['top', 'left', 'right'];

/** The section's rule, the standard where it has none or one this engine does not know. */
export function phoneOrderOf(section) {
  return PHONE_ORDERS.includes(section?.phoneOrder) ? section.phoneOrder : 'top';
}

/** A block's place in the rule's sort: the key a preset gives it, else its top on the desktop. */
const sortKey = (block) => block.mobileOrder ?? block.frames.desktop.y;

/** By the sort key, then from the left. */
const byKey = (a, b) => (sortKey(a) - sortKey(b)) || (a.frames.desktop.x - b.frames.desktop.x);

/** The most a band may stand below the one above it, in px, for the two to read as one grid: a card's parts stand closer than its rows of cards do. */
export const PHONE_JOIN_GAP = 24;

/** A list of block ids, or null where the value is none. */
const idList = (value) => (Array.isArray(value) ? value.filter((id) => typeof id === 'string') : null);

/**
 * A section's phone order whole: its rule, its custom order (null where it has none), its stacks, and the blocks taken out of the rule's columns.
 * @param {object} section
 * @returns {{rule: string, list: string[]|null, stacks: string[][], loose: string[]}}
 */
export function phoneSetupOf(section) {
  const stacks = Array.isArray(section?.phoneStacks) ? section.phoneStacks.map(idList).filter((ids) => ids && ids.length > 1) : [];
  return { rule: phoneOrderOf(section), list: idList(section?.phoneList), stacks, loose: idList(section?.phoneLoose) ?? [] };
}

/** The setup from a rule alone or a whole setup. */
const setupFrom = (setup) => (setup && typeof setup === 'object'
  ? { rule: PHONE_ORDERS.includes(setup.rule) ? setup.rule : 'top', list: setup.list ?? null, stacks: setup.stacks ?? [], loose: setup.loose ?? [] }
  : { rule: PHONE_ORDERS.includes(setup) ? setup : 'top', list: null, stacks: [], loose: [] });

/**
 * The blocks read column by column: a band holds the blocks whose heights overlap on the desktop, one after another; a column inside a band the blocks whose widths overlap there.
 * Bands close below each other (PHONE_JOIN_GAP) with columns that line up, one to one, stand as one grid, so a card of an icon over a text is one column even where the two do not overlap in height, while two rows of cards, or a zig-zag of text and picture, stay rows.
 * @param {object[]} blocks
 * @param {'left'|'right'} side Which column is read first
 * @returns {{order: object[], columns: string[][]}} The order, and the columns of two blocks or more in grids of two columns or more, by their ids
 */
function byColumns(blocks, side) {
  const top = (b) => b.frames.desktop.y;
  const bottom = (b) => b.frames.desktop.y + Math.max(0, b.frames.desktop.h);
  const left = (b) => b.frames.desktop.x;
  const right = (b) => b.frames.desktop.x + Math.max(0, b.frames.desktop.w);
  const bands = [];
  for (const block of blocks.slice().sort((a, b) => (top(a) - top(b)) || (left(a) - left(b)))) {
    const band = bands[bands.length - 1];
    if (band && top(block) < band.bottom) {
      band.blocks.push(block);
      band.bottom = Math.max(band.bottom, bottom(block));
    } else {
      bands.push({ blocks: [block], top: top(block), bottom: bottom(block) });
    }
  }
  /** A band's columns, left to right: its blocks joined wherever their widths overlap, a block across two columns joining them into one. */
  const columnsOf = (band) => {
    const columns = [];
    for (const block of band.blocks) {
      const touching = columns.filter((col) => left(block) < col.right && right(block) > col.left);
      const merged = { blocks: [block], left: left(block), right: right(block) };
      for (const col of touching) {
        merged.blocks.push(...col.blocks);
        merged.left = Math.min(merged.left, col.left);
        merged.right = Math.max(merged.right, col.right);
        columns.splice(columns.indexOf(col), 1);
      }
      columns.push(merged);
    }
    return columns.sort((a, b) => (a.left - b.left) || (a.right - b.right));
  };
  /** Whether two bands' columns line up one to one: as many, each overlapping the one in its place and no other. */
  const lineUp = (upper, lower) => upper.length > 1 && upper.length === lower.length
    && lower.every((col, i) => upper.every((other, j) => (col.left < other.right && col.right > other.left) === (i === j)));
  const grids = [];
  let last = null;
  let lastBottom = -Infinity;
  for (const band of bands) {
    const columns = columnsOf(band);
    const grid = grids[grids.length - 1];
    if (grid && last && band.top - lastBottom <= PHONE_JOIN_GAP && lineUp(last, columns)) {
      columns.forEach((col, i) => grid[i].blocks.push(...col.blocks));
    } else {
      grids.push(columns.map((col) => ({ ...col, blocks: [...col.blocks] })));
    }
    last = columns;
    lastBottom = band.bottom;
  }
  const order = [];
  const stacked = [];
  for (const grid of grids) {
    const columns = side === 'right' ? grid.slice().reverse() : grid;
    for (const col of columns) {
      col.blocks.sort(byKey);
      order.push(...col.blocks);
      if (grid.length > 1 && col.blocks.length > 1) stacked.push(col.blocks.map((b) => b.id));
    }
  }
  return { order, columns: stacked };
}

/**
 * A block's exception, where it names a block of the same order other than itself.
 * @param {object} block
 * @param {Set<string>} ids The ids in the order
 * @returns {{side: 'before'|'after', of: string}|null}
 */
function placeOf(block, ids) {
  const place = block.phonePlace;
  const side = typeof place?.before === 'string' ? 'before' : typeof place?.after === 'string' ? 'after' : null;
  const of = side ? place[side] : null;
  return side && of !== block.id && ids.has(of) ? { side, of } : null;
}

/**
 * The rule's order with each exception moved before or after its block.
 * Blocks placed against the same block keep the rule's order among themselves; a block placed against one that is placed itself follows it there; a ring of exceptions keeps the rule's places.
 * @param {object[]} base The rule's order
 * @returns {{list: object[], placed: Set<string>}} The order, and the blocks whose exception holds in it
 */
function withExceptions(base) {
  const ids = new Set(base.map((b) => b.id));
  const moved = base.filter((b) => placeOf(b, ids));
  const placed = new Set();
  if (!moved.length) return { list: base, placed };
  const list = base.filter((b) => !placeOf(b, ids));
  /** The last block placed after each block, so the next one placed after it follows that one. */
  const lastAfter = new Map();
  let pending = moved;
  while (pending.length) {
    const waiting = [];
    for (const block of pending) {
      const { side, of } = placeOf(block, ids);
      const at = list.findIndex((b) => b.id === of);
      if (at < 0) {
        waiting.push(block);
        continue;
      }
      if (side === 'before') {
        list.splice(at, 0, block);
      } else {
        // After the block's last follower, and past that one's own followers in turn, so a block placed after a follower stays directly after it.
        let tail = lastAfter.get(of);
        while (tail && lastAfter.has(tail.id)) tail = lastAfter.get(tail.id);
        list.splice((tail ? list.indexOf(tail) : at) + 1, 0, block);
        lastAfter.set(of, block);
      }
      placed.add(block.id);
    }
    if (waiting.length === pending.length) {
      // A ring: each stands where the rule puts it, after the nearest block before it in the rule's order.
      for (const block of waiting) {
        const before = base.slice(0, base.indexOf(block)).reverse().find((b) => list.includes(b));
        list.splice(before ? list.indexOf(before) + 1 : 0, 0, block);
      }
      break;
    }
    pending = waiting;
  }
  return { list, placed };
}

/**
 * The blocks the phone shows in the rule's order, before the exceptions, and the rule's columns.
 * A block shown on phones only stands nowhere on the desktop, so it shapes no column: it joins the columns' order before the first block whose key is its own or greater.
 */
function ruleOrder(blocks, rule) {
  const shown = (blocks ?? []).filter((block) => !block.hideMobile && block.frames?.desktop);
  if (rule !== 'left' && rule !== 'right') return { order: shown.slice().sort(byKey), columns: [] };
  const { order, columns } = byColumns(shown.filter((block) => !block.hideDesktop), rule);
  for (const block of shown.filter((b) => b.hideDesktop).sort(byKey)) {
    const at = order.findIndex((b) => sortKey(b) >= sortKey(block));
    order.splice(at < 0 ? order.length : at, 0, block);
  }
  return { order, columns };
}

/**
 * The custom order: the listed units as listed, and each unit the list misses after the nearest unit before it in the order the rule and the exceptions give.
 * @param {object[]} units In the rule's order with the exceptions
 * @param {string[]} ids The list, by unit
 */
function listed(units, ids) {
  const byId = new Map(units.map((u) => [u.id, u]));
  const out = [];
  for (const id of ids) if (byId.has(id) && !out.includes(byId.get(id))) out.push(byId.get(id));
  units.forEach((unit, i) => {
    if (out.includes(unit)) return;
    const before = units.slice(0, i).reverse().find((u) => out.includes(u));
    out.splice(before ? out.indexOf(before) + 1 : 0, 0, unit);
  });
  return out;
}

/**
 * The phone order and what it is made of: the rule's order, the stacks as units, the exceptions, and the custom order.
 * Blocks placed by hand (frames.mobile with a row) are included, in the same order: auto-placement skips them, but the DOM order carries the read-aloud order.
 * @param {object[]} blocks The section's blocks
 * @param {string|{rule: string, list?: string[]|null, stacks?: string[][], loose?: string[]}} [setup] The section's rule, or its setup (phoneSetupOf)
 * @returns {{order: object[], placed: Set<string>, stacks: string[][], columns: string[][]}} The order; the blocks whose exception holds in it (a stack's first block for the stack); the stacks as they hold, each of two blocks or more; and the rule's columns, without the blocks taken out of them
 */
export function phoneParts(blocks, setup = 'top') {
  const { rule, list, stacks, loose } = setupFrom(setup);
  const out = new Set(loose);
  const { order: base, columns: ruled } = ruleOrder(blocks, rule);
  const columns = ruled.map((column) => column.filter((id) => !out.has(id))).filter((column) => column.length > 1);
  const byId = new Map(base.map((b) => [b.id, b]));
  /** Each stacked block's stack, by the stack's first block; a block in two stacks belongs to the first. */
  const unitOf = new Map();
  const held = [];
  for (const ids of stacks) {
    const members = [...new Set(ids)].filter((id) => byId.has(id) && !unitOf.has(id));
    if (members.length < 2) continue;
    for (const id of members) unitOf.set(id, members[0]);
    held.push(members);
  }
  const unitId = (id) => unitOf.get(id) ?? id;
  const membersOf = new Map(held.map((ids) => [ids[0], ids.map((id) => byId.get(id))]));
  /** An exception against a stacked block is against its stack. */
  const mapped = (place) => {
    const side = typeof place?.before === 'string' ? 'before' : typeof place?.after === 'string' ? 'after' : null;
    return side ? { [side]: unitId(place[side]) } : null;
  };
  const units = [];
  const seen = new Set();
  for (const block of base) {
    const id = unitId(block.id);
    if (seen.has(id)) continue;
    seen.add(id);
    units.push({ id, phonePlace: mapped(byId.get(id).phonePlace), members: membersOf.get(id) ?? [block] });
  }
  const done = withExceptions(units);
  const ordered = list ? listed(done.list, list.map(unitId)) : done.list;
  return { order: ordered.flatMap((u) => u.members), placed: list ? new Set() : done.placed, stacks: held, columns };
}

/**
 * The reading order in the row grid: the blocks the phone shows (not hidden there), by the section's rule, its stacks, each block's exception and its custom order.
 * @param {object[]} blocks The section's blocks
 * @param {string|object} [setup] The section's rule, or its setup (phoneSetupOf)
 * @returns {object[]}
 */
export function stackOrder(blocks, setup = 'top') {
  return phoneParts(blocks, setup).order;
}
