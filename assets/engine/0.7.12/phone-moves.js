/**
 * The owner's moves in a section's phone order: the order as a tree one level deep (phoneTree), and a move settled into the section's data (settle).
 * Pure.
 */
import { phoneParts, phoneSetupOf } from './phone-order.js';
import { phoneCells, phoneSpace, PHONE_COLUMNS } from './migrate.js';

/** Whether a block flows in the row grid, rather than standing on rows placed by hand. */
export const flowing = (block) => !Number.isFinite(block.frames?.mobile?.row);

/**
 * A block's phone placement unpinned: back into the phone's order with its cells and turn (ADR-0019), its rows, x, w and z gone; null where nothing is left.
 * @param {object|null|undefined} placement The block's `frames.mobile`
 * @returns {object|null}
 */
export function unpinned(placement) {
  if (!placement) return null;
  const { row: _row, rows: _rows, x: _x, w: _w, z: _z, ...kept } = placement;
  return Object.keys(kept).length ? kept : null;
}

/** The block a block's exception names, or null. */
const anchorOf = (block) => (typeof block.phonePlace?.before === 'string' ? block.phonePlace.before : typeof block.phonePlace?.after === 'string' ? block.phonePlace.after : null);

/** The setup from a rule alone or a whole setup (phoneSetupOf). */
const setupFrom = (setup) => (setup && typeof setup === 'object' ? { list: null, stacks: [], loose: [], ...setup } : { rule: setup ?? 'top', list: null, stacks: [], loose: [] });

/** Two lists of ids alike. */
const same = (a, b) => a.length === b.length && a.every((id, i) => id === b[i]);

/**
 * The flowing blocks in the phone's order as a tree one level deep: a block alone, or a stack, `kind` 'stack' for the owner's or 'column' for the rule's.
 * @param {object[]} blocks The section's blocks
 * @param {string|object} setup The section's rule, or its setup (phoneSetupOf)
 * @returns {Array<{id: string, kind?: 'stack'|'column', children?: Array<{id: string}>}>}
 */
export function phoneTree(blocks, setup) {
  const parts = phoneParts(blocks, setup);
  const ids = parts.order.filter(flowing).map((b) => b.id);
  const stackOf = new Map();
  for (const stack of parts.stacks) for (const id of stack) stackOf.set(id, stack);
  const columnOf = new Map();
  parts.columns.forEach((column, k) => { for (const id of column) columnOf.set(id, k); });
  const nodes = [];
  for (let i = 0; i < ids.length;) {
    const stack = stackOf.get(ids[i]);
    const column = stack ? undefined : columnOf.get(ids[i]);
    const run = [];
    if (stack) while (i < ids.length && stackOf.get(ids[i]) === stack) run.push(ids[i++]);
    else if (column !== undefined) while (i < ids.length && !stackOf.has(ids[i]) && columnOf.get(ids[i]) === column) run.push(ids[i++]);
    else run.push(ids[i++]);
    nodes.push(run.length > 1 ? { id: `stack:${run[0]}`, kind: stack ? 'stack' : 'column', children: run.map((id) => ({ id })) } : { id: run[0] });
  }
  return nodes;
}

/** The tree's nodes as units of ids. */
const unitsOf = (tree) => tree.map((node) => (node.children ? node.children.map((c) => c.id) : [node.id]));

/**
 * The blocks whose exception leads to a unit, directly or through another such block, which move with it; a stack's block after its first leads nowhere.
 * @param {object[]} blocks
 * @param {string[]} unit
 * @param {string[][]} [stacks] The stacks as they hold
 * @returns {Set<string>}
 */
function followersOf(blocks, unit, stacks = []) {
  const inside = new Set(unit);
  const inert = new Set(stacks.flatMap((stack) => stack.slice(1)));
  const followers = new Set();
  let grew = true;
  while (grew) {
    grew = false;
    for (const block of blocks) {
      const of = anchorOf(block);
      if (!inert.has(block.id) && !inside.has(block.id) && !followers.has(block.id) && (inside.has(of) || followers.has(of))) {
        followers.add(block.id);
        grew = true;
      }
    }
  }
  return followers;
}

/** The blocks with each place in `places` set (a place of null taken away). */
function withPlaces(blocks, places) {
  return blocks.map((b) => {
    if (!(b.id in places)) return b;
    const next = { ...b };
    if (places[b.id]) next.phonePlace = places[b.id]; else delete next.phonePlace;
    return next;
  });
}

/** The flowing blocks' ids in the order a trial setup gives. */
const trialIds = (blocks, setup) => phoneParts(blocks, setup).order.filter(flowing).map((b) => b.id);

/**
 * A new order of the tree settled into the section's data: the stacks, and the custom order as listed or the exceptions that bring the moved unit there.
 * @param {object[]} blocks The section's blocks
 * @param {string|{rule: string, list: string[]|null, stacks: string[][]}} rawSetup The section's rule, or its setup (phoneSetupOf)
 * @param {Array<{id: string, kind?: string, children?: Array<{id: string}>}>} tree The order as it stands (phoneTree)
 * @param {string[][]} want The new order, as units of ids
 * @param {string[]} moved The ids the owner moved
 * @returns {{places: Record<string, object|null>, stacks?: string[][], list?: string[]}|null} The change, or null where no change gives that order, or the order would stay as it is
 */
export function settle(blocks, rawSetup, tree, want, moved) {
  const setup = setupFrom(rawSetup);
  const byId = new Map(blocks.map((b) => [b.id, b]));
  const now = unitsOf(tree).flat();
  const listed = new Set(now);
  const onPhone = new Set(phoneParts(blocks, setup).order.map((b) => b.id));
  const stored = (setup.stacks ?? []).map((stack) => stack.filter((id) => byId.has(id))).filter((stack) => stack.length > 1);
  // A column of the rule as the tree draws it, and as the rule reads it, the blocks the list does not show left out.
  const columns = new Set(tree.filter((n) => n.kind === 'column').map((n) => n.children.map((c) => c.id).join(' ')));
  const ruled = new Set(phoneParts(blocks, setup).columns.map((column) => column.filter((id) => listed.has(id)).join(' ')));
  /** The blocks of a stack the list does not show. */
  const unlisted = (stack) => stack.filter((id) => !listed.has(id));
  /** A unit with the unlisted blocks of the stacks it holds on to, each where it stood in its stack. */
  const withUnlisted = (unit) => {
    const out = [...unit];
    for (const stack of stored) {
      const shown = stack.filter((id) => listed.has(id));
      const owns = unit.some((id) => stack.includes(id) && !moved.includes(id)) || (shown.length > 0 && shown.every((id) => unit.includes(id)));
      if (!owns) continue;
      for (const id of unlisted(stack)) {
        const before = stack.slice(0, stack.indexOf(id)).reverse().find((other) => out.includes(other));
        out.splice(before ? out.indexOf(before) + 1 : 0, 0, id);
      }
    }
    return out;
  };
  const stacks = [];
  for (const unit of want) {
    // A column left as it stood, or in the rule's order with some of its blocks kept in place, is the rule's.
    if (columns.has(unit.join(' ')) && !unit.some((id) => moved.includes(id))) continue;
    if (ruled.has(unit.join(' ')) && !unit.every((id) => moved.includes(id))) continue;
    const full = withUnlisted(unit);
    if (full.length > 1) stacks.push(full);
  }
  for (const stack of stored) if (!stack.some((id) => listed.has(id))) stacks.push(stack);
  /** A stack's first block as the phone reads it: the first of it the phone shows. */
  const headOf = (stack) => stack.find((id) => onPhone.has(id)) ?? stack[0];
  /** The first blocks of the owner's stacks as they stood: each one's exception is its stack's. */
  const heads = new Set(tree.filter((n) => n.kind === 'stack').map((n) => n.children[0].id));
  const places = {};
  for (const stack of stacks) {
    const head = headOf(stack);
    const rest = stack.filter((id) => id !== head);
    const carried = rest.filter((id) => heads.has(id)).map((id) => byId.get(id)?.phonePlace).find(Boolean);
    for (const id of rest) if (byId.get(id)?.phonePlace) places[id] = null;
    if (!byId.get(head)?.phonePlace && carried) places[head] = carried;
  }
  const change = { places };
  if (!same(stacks.map((s) => s.join(' ')), stored.map((s) => s.join(' ')))) change.stacks = stacks;
  const flat = want.flat();
  /** The change, unless it leaves the order and the stacks as they are; a place taken from a block that has none is left out. */
  const done = (result, order) => {
    if (same(order, now) && !result.stacks) return null;
    for (const [id, place] of Object.entries(result.places)) if (place === null && !byId.get(id)?.phonePlace) delete result.places[id];
    return result;
  };
  if (setup.list) {
    change.list = flat;
    return done(change, flat);
  }
  const mover = want.find((unit) => unit.some((id) => moved.includes(id)));
  // A block placed against the moved unit lets go of it where the unit lands right beside it, past the block it names; the followers further off follow the unit.
  if (mover) {
    const pos = new Map(flat.map((id, i) => [id, i]));
    const current = new Map(withPlaces(blocks, places).map((b) => [b.id, b]));
    const followers = followersOf([...current.values()], mover, stacks);
    const at = want.indexOf(mover);
    const beside = [];
    for (let k = at - 1; k >= 0 && want[k].some((id) => followers.has(id)); k -= 1) beside.push(...want[k]);
    for (let k = at + 1; k < want.length && want[k].some((id) => followers.has(id)); k += 1) beside.push(...want[k]);
    for (const id of beside.filter((b) => followers.has(b))) {
      const place = current.get(id)?.phonePlace;
      const anchor = anchorOf(current.get(id));
      if (!pos.has(id) || !pos.has(anchor)) continue;
      if (typeof place.after === 'string' ? pos.get(id) < pos.get(anchor) : pos.get(id) > pos.get(anchor)) places[id] = null;
    }
  }
  const next = { ...setup, stacks };
  const placed = withPlaces(blocks, places);
  const first = trialIds(placed, next);
  if (same(first, flat)) return done(change, first);
  if (!mover) return null;
  const head = mover[0];
  const followers = followersOf(placed, mover, stacks);
  const outside = (ids) => ids.filter((id) => !mover.includes(id) && !followers.has(id));
  const rank = (ids) => outside(ids.slice(0, ids.indexOf(head))).length;
  // What is left of the stack the moved block came from keeps its place: as it stands, without its exception, or after the unit before or before the unit after.
  const origin = unitsOf(tree).find((unit) => unit.includes(moved[0])) ?? [];
  const left = want.find((unit) => unit !== mover && !unit.some((id) => moved.includes(id)) && unit.some((id) => origin.includes(id)) && unit.join(' ') !== origin.join(' '));
  const holds = [{}];
  if (left) {
    const others = want.filter((unit) => unit !== mover && unit !== left && !unit.some((id) => followers.has(id)));
    const at = want.indexOf(left);
    const before = want.slice(0, at).reverse().find((unit) => others.includes(unit));
    const after = want.slice(at + 1).find((unit) => others.includes(unit));
    if (byId.get(left[0])?.phonePlace) holds.push({ [left[0]]: null });
    if (before) holds.push({ [left[0]]: { after: before[0] } });
    if (after) holds.push({ [left[0]]: { before: after[0] } });
  }
  // The units nearest the moved one as it stood come first, each tried on the side it stands of the moved one's new place first.
  const from = now.indexOf(moved[0]);
  const at = want.indexOf(mover);
  const others = want.filter((unit) => unit !== mover && !unit.some((id) => followers.has(id)))
    .sort((a, b) => Math.abs(now.indexOf(a[0]) - from) - Math.abs(now.indexOf(b[0]) - from));
  const tries = [null, ...others.flatMap((unit) => (want.indexOf(unit) > at
    ? [{ before: unit[0] }, { after: unit[0] }]
    : [{ after: unit[0] }, { before: unit[0] }]))];
  let kept = null;
  for (const hold of holds) {
    for (const place of tries) {
      const trial = { ...places, ...hold, [head]: place };
      const order = trialIds(withPlaces(blocks, trial), next);
      if (same(order, flat)) return done({ ...change, places: trial }, order);
      if (!kept && same(outside(order), outside(flat)) && rank(order) === rank(flat)) kept = { places: trial, order };
    }
  }
  return kept ? done({ ...change, places: kept.places }, kept.order) : null;
}

/** A tree's node or a stack's member by its path, 'i' or 'i.j'. */
function nodeAt(tree, key) {
  const [i, j] = key.split('.').map(Number);
  return j === undefined ? tree[i] : tree[i]?.children?.[j];
}

/**
 * A row of the tree moved before or after a row, or into one as a stack; a block dragged out of a group leaves its rule's column (`loose`).
 * @param {object[]} blocks The section's blocks
 * @param {string|object} rawSetup The section's rule, or its setup (phoneSetupOf)
 * @param {string} key The dragged row, by its path in the tree
 * @param {{key: string, pos: 'before'|'after'|'into'}} drop
 * @returns {ReturnType<typeof settle>}
 */
export function phoneLand(blocks, rawSetup, key, drop) {
  const setup = setupFrom(rawSetup);
  const tree = phoneTree(blocks, setup);
  const units = unitsOf(tree);
  const [i, j] = key.split('.').map(Number);
  if (!units[i] || (j !== undefined && units[i][j] === undefined)) return null;
  const moving = j === undefined ? units[i] : [units[i][j]];
  const target = nodeAt(tree, drop.key);
  if (!target) return null;
  // A stack is found by a block of it that stays: its first may be the one that moves.
  const targetId = target.children ? target.children.map((c) => c.id).find((id) => !moving.includes(id)) : target.id;
  // The units without the dragged row; a stack it leaves keeps the rest.
  let rest = units.map((unit) => unit.filter((id) => !moving.includes(id))).filter((unit) => unit.length);
  const [ti, tj] = drop.key.split('.').map(Number);
  const host = rest.find((unit) => unit.includes(targetId));
  if (!host) return null;
  // Each block's column as the rule reads it, the blocks taken out of it included; and the blocks a column of the rule holds now.
  const whole = phoneParts(blocks, { ...setup, loose: [] }).columns;
  const ruled = new Set(phoneParts(blocks, setup).columns.flat());
  const inside = drop.pos === 'into' || tj !== undefined;
  const targetIds = target.children ? target.children.map((c) => c.id) : [target.id];
  const home = inside && moving.every((id) => whole.some((column) => column.includes(id) && targetIds.some((t) => t !== id && column.includes(t))));
  const leaves = j !== undefined && !(inside && ti === i) && moving.some((id) => ruled.has(id));
  if (drop.pos === 'into') {
    const column = home ? whole.find((c) => c.includes(moving[0])) : null;
    const into = (unit) => {
      const next = [...unit, ...moving];
      const back = column ? column.filter((id) => next.includes(id)) : [];
      return back.length === next.length ? back : next;
    };
    rest = rest.map((unit) => (unit === host ? into(unit) : unit));
  } else if (tj === undefined) {
    const at = rest.indexOf(host) + (drop.pos === 'after' ? 1 : 0);
    rest = [...rest.slice(0, at), moving, ...rest.slice(at)];
  } else {
    const member = units[ti][tj];
    const at = host.indexOf(member) + (drop.pos === 'after' ? 1 : 0);
    rest = rest.map((unit) => (unit === host ? [...unit.slice(0, at), ...moving, ...unit.slice(at)] : unit));
  }
  const loose = home ? setup.loose.filter((id) => !moving.includes(id)) : leaves ? [...new Set([...setup.loose, ...moving])] : setup.loose;
  if (loose.length === setup.loose.length) return settle(blocks, setup, tree, rest, moving);
  const looser = { ...setup, loose };
  // A block back in its column reads where the rule puts it there: its own exception goes.
  const freed = home ? blocks.map((b) => (moving.includes(b.id) && b.phonePlace ? { ...b, phonePlace: undefined } : b)) : blocks;
  const settled = settle(freed, looser, phoneTree(freed, looser), rest, moving) ?? { places: {} };
  const dropped = home ? Object.fromEntries(blocks.filter((b) => moving.includes(b.id) && b.phonePlace).map((b) => [b.id, null])) : {};
  return { ...settled, places: { ...dropped, ...settled.places }, loose };
}

/**
 * A group taken apart, as «Ungroup» asks: the whole group, or one block standing right after what is left of it; its blocks leave the rule's columns (`loose`).
 * @param {object[]} blocks The section's blocks
 * @param {string|object} rawSetup The section's rule, or its setup (phoneSetupOf)
 * @param {string} blockId A block of the group
 * @param {boolean} whole The whole group, or the block alone
 * @returns {{places: Record<string, object|null>, stacks?: string[][], list?: string[], loose?: string[]}|null} The change, or null where the block stands in no group
 */
export function phoneUngroup(blocks, rawSetup, blockId, whole) {
  const setup = setupFrom(rawSetup);
  const tree = phoneTree(blocks, setup);
  const i = tree.findIndex((node) => node.children?.some((c) => c.id === blockId));
  if (i < 0) return null;
  const ids = tree[i].children.map((c) => c.id);
  if (whole) {
    const ruled = new Set(phoneParts(blocks, setup).columns.flat());
    const loose = [...new Set([...setup.loose, ...ids.filter((id) => ruled.has(id))])];
    if (tree[i].kind === 'column') return { places: {}, loose };
    const stacks = setup.stacks.filter((stack) => !ids.every((id) => stack.includes(id)));
    return loose.length > setup.loose.length ? { places: {}, stacks, loose } : { places: {}, stacks };
  }
  return phoneLand(blocks, setup, `${i}.${ids.indexOf(blockId)}`, { key: String(i), pos: 'after' });
}

/**
 * A set's blocks made one stack on the phone, as «Group» and Ctrl+G ask, in reading order at the first one's place; the owner's stacks it touches join whole.
 * @param {object[]} blocks The section's blocks
 * @param {string|object} rawSetup The section's rule, or its setup (phoneSetupOf)
 * @param {Iterable<string>} ids The set
 * @returns {{places: Record<string, object|null>, stacks?: string[][], list?: string[], loose?: string[]}|null} null where the set touches fewer than two blocks or stacks
 */
export function phoneGroup(blocks, rawSetup, ids) {
  const setup = setupFrom(rawSetup);
  const wanted = new Set(ids);
  const columned = phoneTree(blocks, setup).filter((node) => node.kind === 'column').flatMap((node) => node.children.map((c) => c.id)).filter((id) => wanted.has(id));
  const looser = columned.length ? { ...setup, loose: [...new Set([...setup.loose, ...columned])] } : setup;
  const tree = phoneTree(blocks, looser);
  const units = unitsOf(tree);
  const touched = units.filter((unit) => unit.some((id) => wanted.has(id)));
  if (touched.length < 2) return null;
  const merged = touched.flat();
  const want = units.flatMap((unit) => (unit === touched[0] ? [merged] : touched.includes(unit) ? [] : [unit]));
  const change = settle(blocks, looser, tree, want, merged.filter((id) => !touched[0].includes(id)));
  if (!change) return null;
  return looser === setup ? change : { ...change, loose: looser.loose };
}

/**
 * The groups a set's blocks stand in taken apart whole, as «Ungroup» and Ctrl+Shift+G ask in the phone view (phoneUngroup).
 * @param {object[]} blocks The section's blocks
 * @param {string|object} rawSetup The section's rule, or its setup (phoneSetupOf)
 * @param {Iterable<string>} ids The set, or the selected block alone
 * @returns {{places: {}, stacks?: string[][], loose?: string[]}|null} null where none of the blocks stands in a group
 */
export function phoneUngroupAll(blocks, rawSetup, ids) {
  const start = setupFrom(rawSetup);
  let setup = start;
  for (const id of ids) {
    const change = phoneUngroup(blocks, setup, id, true);
    if (change) setup = { ...setup, ...(change.stacks ? { stacks: change.stacks } : {}), ...(change.loose ? { loose: change.loose } : {}) };
  }
  if (setup === start) return null;
  return { places: {}, ...(setup.stacks !== start.stacks ? { stacks: setup.stacks } : {}), ...(setup.loose !== start.loose ? { loose: setup.loose } : {}) };
}

/**
 * The cells that put a block of `cols` columns at the row's left edge, middle or right edge; an odd width's middle leans half a column left.
 * @param {number} cols
 * @param {'left'|'middle'|'right'} side
 * @returns {{col: number, cols: number}}
 */
export function phoneSideCells(cols, side) {
  const col = side === 'right' ? PHONE_COLUMNS + 1 - cols : side === 'middle' ? Math.floor((PHONE_COLUMNS - cols) / 2) + 1 : 1;
  return { col, cols };
}

/**
 * Whether a block of `cols` columns has a middle of the phone's row apart from its two edges: one of seven columns stands only at an edge.
 * @param {number} cols
 * @returns {boolean}
 */
export function phoneHasMiddle(cols) {
  return cols <= PHONE_COLUMNS - 2;
}

/**
 * A set's blocks in cells moved to one side of the phone's row, each keeping its width; a stack moves whole, and a block across the row, pinned or hidden stays.
 * @param {object[]} blocks The section's blocks
 * @param {string|object} rawSetup The section's rule, or its setup (phoneSetupOf)
 * @param {Iterable<string>} ids The set
 * @param {'left'|'middle'|'right'} side
 * @returns {{places: {}, cells: Record<string, {col: number, cols: number}>}|null} null where nothing moves
 */
export function phoneAlignCells(blocks, rawSetup, ids, side) {
  const parts = phoneParts(blocks, setupFrom(rawSetup));
  const shown = new Set(parts.order.filter(flowing).map((b) => b.id));
  const byId = new Map(blocks.map((b) => [b.id, b]));
  const cells = {};
  let moves = false;
  for (const id of ids) {
    if (!shown.has(id)) continue;
    // A stack stands in its first block's cells where that one flows (render.js), and its flowing blocks move together.
    const stack = parts.stacks.find((s) => s.includes(id));
    const members = stack && shown.has(stack[0]) ? stack.filter((m) => shown.has(m)) : [id];
    const now = phoneCellsOf(byId.get(members[0]));
    if (!now || (side === 'middle' && !phoneHasMiddle(now.cols))) continue;
    const next = phoneSideCells(now.cols, side);
    // The first block's cells are the ones drawn, so they alone tell whether the set moves.
    if (next.col !== now.col) moves = true;
    for (const member of members) cells[member] = next;
  }
  return moves ? { places: {}, cells } : null;
}

/**
 * A block moved one place in the phone's order: within its stack, else past the next block or stack, the blocks placed against it going along.
 * @param {object[]} blocks The section's blocks
 * @param {string|object} rawSetup The section's rule, or its setup (phoneSetupOf)
 * @param {string} blockId
 * @param {number} dir -1 earlier, 1 later
 * @returns {ReturnType<typeof settle>} null at the ends, or where no change gives the move
 */
export function phoneStep(blocks, rawSetup, blockId, dir) {
  const setup = setupFrom(rawSetup);
  const tree = phoneTree(blocks, setup).flatMap((node) => (node.kind === 'column' ? node.children.map((c) => ({ id: c.id })) : [node]));
  const units = unitsOf(tree);
  const unit = units.find((u) => u.includes(blockId));
  if (!unit) return null;
  const step = Math.sign(dir);
  if (unit.length > 1) {
    const k = unit.indexOf(blockId);
    if (k + step < 0 || k + step >= unit.length) return null;
    const inside = [...unit];
    [inside[k], inside[k + step]] = [inside[k + step], inside[k]];
    return settle(blocks, setup, tree, units.map((u) => (u === unit ? inside : u)), [blockId]);
  }
  const followers = setup.list ? new Set() : followersOf(blocks, unit, phoneParts(blocks, setup).stacks);
  const at = units.indexOf(unit);
  let next = at + step;
  while (units[next] && units[next].some((id) => followers.has(id))) next += step;
  // Where only blocks that follow it stand beyond it, it steps past the nearest of them, which lets go of it (settle).
  if (!units[next] && units[at + step]) next = at + step;
  if (!units[next]) return null;
  const rest = units.filter((u) => u !== unit);
  const to = rest.indexOf(units[next]) + (step > 0 ? 1 : 0);
  return settle(blocks, setup, tree, [...rest.slice(0, to), unit, ...rest.slice(to)], [blockId]);
}

/**
 * The exception on one side that keeps a block or the stack it heads where it stands: the nearest unit that moves nothing, else one keeping the others' order.
 * @param {object[]} blocks
 * @param {string|object} rawSetup The section's rule, or its setup (phoneSetupOf)
 * @param {string} blockId
 * @param {'before'|'after'} side
 * @returns {{before: string}|{after: string}|null}
 */
export function phonePlaceKeeping(blocks, rawSetup, blockId, side) {
  const setup = setupFrom(rawSetup);
  const units = unitsOf(phoneTree(blocks, setup).flatMap((node) => (node.kind === 'column' ? node.children.map((c) => ({ id: c.id })) : [node])));
  const unit = units.find((u) => u.includes(blockId));
  if (!unit || unit[0] !== blockId) return null;
  const now = units.flat();
  const followers = followersOf(blocks, unit, phoneParts(blocks, setup).stacks);
  const outside = (ids) => ids.filter((id) => !unit.includes(id) && !followers.has(id));
  const at = units.indexOf(unit);
  let fallback = null;
  const others = units.filter((u) => u !== unit && !u.some((id) => followers.has(id)))
    .sort((a, b) => Math.abs(units.indexOf(a) - at) - Math.abs(units.indexOf(b) - at));
  for (const other of others) {
    const place = { [side]: other[0] };
    const order = trialIds(withPlaces(blocks, { [blockId]: place }), setup);
    if (same(order, now)) return place;
    if (!fallback && same(outside(order), outside(now))) fallback = place;
  }
  return fallback;
}

/**
 * Whether a block's exception holds: it names another block the phone shows, forms no ring, and counts, with no custom order and the block not inside a stack.
 * @param {object} block
 * @param {object[]} blocks The section's blocks
 * @param {object} [setup] The section's setup (phoneSetupOf)
 * @returns {boolean}
 */
export function hasPhonePlace(block, blocks, setup = 'top') {
  return Boolean(block?.id) && phoneParts(blocks, setup).placed.has(block.id);
}

/**
 * The owner's stack a block stands in, as it holds, or null.
 * @param {object[]} blocks
 * @param {object} setup
 * @param {string} blockId
 * @returns {string[]|null}
 */
export function phoneStackOf(blocks, setup, blockId) {
  return phoneParts(blocks, setup).stacks.find((stack) => stack.includes(blockId)) ?? null;
}

/**
 * Where a block dragged on the phone canvas lands, from the pointer over the other units: beside, above or below a unit, before or after its line, or nowhere.
 * @param {Array<{id: string, left: number, top: number, right: number, bottom: number, members?: Array<{id: string, top: number, bottom: number}>}>} boxes The units' boxes, by their first block's id, a unit of several blocks with each block's height in it
 * @param {number} x
 * @param {number} y
 * @param {{left: number, top: number, right: number, bottom: number}|null} [own] The dragged block's own place
 * @returns {{pos: 'before'|'after'|'left'|'right'|'above'|'below'|'here', of?: string, member?: string, free?: boolean, at?: number}|null}
 */
export function phoneDropAt(boxes, x, y, own = null) {
  const within = (b) => x >= b.left && x <= b.right && y >= b.top && y <= b.bottom;
  const away = (b) => Math.hypot(x < b.left ? b.left - x : x > b.right ? x - b.right : 0, y < b.top ? b.top - y : y > b.bottom ? y - b.bottom : 0);
  if (!boxes.length || (own && within(own))) return null;
  const hit = boxes.find(within);
  let target = hit;
  let pos;
  if (hit) {
    // The block under the pointer, in a unit of several: its height is the one read.
    const member = hit.members?.find((m) => y >= m.top && y <= m.bottom)
      ?? hit.members?.reduce((best, m) => (Math.abs(y - (m.top + m.bottom) / 2) < Math.abs(y - (best.top + best.bottom) / 2) ? m : best));
    const span = member ?? hit;
    const fy = (y - span.top) / Math.max(1, span.bottom - span.top);
    const fx = (x - hit.left) / Math.max(1, hit.right - hit.left);
    // The outer thirds stand beside it; the middle third above or below the block under the pointer.
    if (fx < 1 / 3) return { pos: 'left', of: hit.id };
    if (fx > 2 / 3) return { pos: 'right', of: hit.id };
    return { pos: fy < 0.5 ? 'above' : 'below', of: hit.id, ...(member ? { member: member.id } : {}) };
  } else {
    // Off every unit but level with some: beside the nearest, in the room its line leaves, unless the block's own place stands nearer on that line.
    const level = boxes.filter((b) => y >= b.top && y <= b.bottom);
    target = (level.length ? level : boxes).reduce((best, b) => (away(b) < away(best) ? b : best));
    const ownLevel = Boolean(own) && y >= own.top && y <= own.bottom;
    if (level.length) {
      if (own && own.top < target.bottom && own.bottom > target.top && away(own) < away(target)) return ownLevel ? { pos: 'here' } : null;
      return { pos: x < target.left ? 'left' : 'right', of: target.id, free: true };
    }
    if (ownLevel) return { pos: 'here' };
    if (own && away(own) < away(target)) return null;
    pos = y < target.top ? 'before' : 'after';
  }
  const ends = lineOf(boxes, target);
  return pos === 'before'
    ? { pos, of: ends[0].id, at: Math.min(...ends.map((b) => b.top)) }
    : { pos, of: ends[ends.length - 1].id, at: Math.max(...ends.map((b) => b.bottom)) };
}

/** The units on a unit's line: those whose heights overlap its own, and those overlapping them in turn, in the order of `boxes`. */
function lineOf(boxes, target) {
  const line = new Set([target]);
  for (let grew = true; grew;) {
    grew = false;
    for (const b of boxes) {
      if (!line.has(b) && [...line].some((l) => b.top < l.bottom && b.bottom > l.top)) {
        line.add(b);
        grew = true;
      }
    }
  }
  return boxes.filter((b) => line.has(b));
}

/**
 * The drop right after the line a block's unit stands on: where a copy made in the phone view lands, and a block added over a block in the view.
 * @param {Array<{id: string, top: number, bottom: number, members?: Array<{id: string}>}>} boxes The units' boxes (phoneDropAt)
 * @param {string} id A block of the unit
 * @returns {{pos: 'after', of: string, at: number}|null} Null where no unit holds the block
 */
export function phoneAfterLine(boxes, id) {
  const target = boxes.find((b) => b.id === id || b.members?.some((m) => m.id === id));
  if (!target) return null;
  const ends = lineOf(boxes, target);
  return { pos: 'after', of: ends[ends.length - 1].id, at: Math.max(...ends.map((b) => b.bottom)) };
}

/**
 * Where a block stands across the row when placed at the pointer: centred on it, its first column on the quarters or any with `fine`, kept in the room.
 * @param {number} x The pointer across the row, in columns from the row's left edge (0 to 8)
 * @param {number} cols The block's width in columns
 * @param {number} from The room's first column
 * @param {number} to The room's last column
 * @param {boolean} [fine] Any column (Alt)
 * @returns {number} The block's first column
 */
export function placeAt(x, cols, from, to, fine = false) {
  const start = x - cols / 2;
  const col = (fine ? Math.round(start) : Math.round(start / 2) * 2) + 1;
  return Math.max(from, Math.min(col, to - cols + 1));
}

/**
 * The change a drop on the phone canvas makes: the dragged block moved in the order, and the cells it and the unit beside it get, by the Phone Drop Map.
 * @param {object[]} blocks The section's blocks
 * @param {string|object} rawSetup The section's rule, or its setup (phoneSetupOf)
 * @param {string} blockId The dragged block
 * @param {{pos: 'before'|'after'|'left'|'right'|'above'|'below'|'into'|'here', of?: string, member?: string, free?: boolean, x?: number, fine?: boolean}} drop
 * @returns {{places: Record<string, object|null>, stacks?: string[][], list?: string[], loose?: string[], cells: Record<string, {col: number, cols: number}|null>}|null} The change, or null where the drop changes nothing or its order cannot be had
 */
export function phoneDropChange(blocks, rawSetup, blockId, drop) {
  const setup = setupFrom(rawSetup);
  const tree = phoneTree(blocks, setup);
  const units = unitsOf(tree);
  const byId = new Map(blocks.map((b) => [b.id, b]));
  if (!drop || !units.some((u) => u.includes(blockId))) return null;
  drop = { ...drop };
  /** A unit's cells as the row grid draws them: its first block's, else the full row. */
  const cellsOf = (unit) => phoneCellsOf(byId.get(unit[0])) ?? { col: 1, cols: 8 };
  /** The room of a unit's line around it: its own columns and the free ones beside them, up to the units before and after it on that line, else the row's edges. */
  const roomOf = (list, i) => {
    const { col, cols } = cellsOf(list[i]);
    const end = col + cols - 1;
    const prev = list[i - 1] ? cellsOf(list[i - 1]) : null;
    const next = list[i + 1] ? cellsOf(list[i + 1]) : null;
    return { col, end, from: prev && prev.col + prev.cols - 1 < col ? prev.col + prev.cols : 1, to: next && next.col > end ? next.col - 1 : 8 };
  };
  const ownCells = phoneCellsOf(byId.get(blockId));
  const pointed = Number.isFinite(drop.x);
  // Along its own line: a block alone there moves to the pointer in the room its line leaves it, its order as it is.
  if (drop.pos === 'here') {
    const i = units.findIndex((u) => u.includes(blockId));
    if (units[i].length > 1 || !ownCells || !pointed) return null;
    const { from, to } = roomOf(units, i);
    const col = placeAt(drop.x, ownCells.cols, from, to, drop.fine);
    return col === ownCells.col ? null : { places: {}, cells: { [blockId]: { col, cols: ownCells.cols } } };
  }
  const rest = units.map((u) => u.filter((id) => id !== blockId)).filter((u) => u.length);
  const host = rest.find((u) => u.includes(drop.of));
  if (!host) return null;
  const cells = { [blockId]: null };
  const at = rest.indexOf(host);
  let pos = drop.pos;
  if (pos === 'left' || pos === 'right') {
    const { col, end, from, to } = roomOf(rest, at);
    if (drop.free) {
      // In the room beside the unit: its own width at the pointer, or the room's where its own does not fit.
      const room = pos === 'left' ? { from, to: col - 1 } : { from: end + 1, to };
      const width = room.to - room.from + 1;
      if (width < 1) return null;
      const cols = Math.min(ownCells?.cols ?? PHONE_COLUMNS, width);
      const start = pointed ? placeAt(drop.x, cols, room.from, room.to, drop.fine) : pos === 'left' ? room.to - cols + 1 : room.from;
      cells[blockId] = cols >= PHONE_COLUMNS ? null : { col: start, cols };
    } else {
      // The two share the line's room around the unit, half each, the block on the side it was dropped.
      const span = to - from + 1;
      if (span < 2) return null;
      const half = Math.floor(span / 2);
      cells[blockId] = pos === 'left' ? { col: from, cols: half } : { col: from + span - half, cols: half };
      for (const id of host) cells[id] = pos === 'left' ? { col: from + half, cols: span - half } : { col: from, cols: span - half };
    }
  }
  if (pos === 'into') pos = 'below';
  const stacked = pos === 'above' || pos === 'below';
  if (stacked) {
    const shared = cellsOf(host);
    cells[blockId] = shared.cols < 8 ? shared : null;
  }
  // In a gap: its own width, at the pointer.
  if ((pos === 'before' || pos === 'after') && ownCells) {
    cells[blockId] = { col: pointed ? placeAt(drop.x, ownCells.cols, 1, 8, drop.fine) : ownCells.col, cols: ownCells.cols };
  }
  /** The host with the dragged block in it, above or below the block named, else first or last. */
  const joined = () => {
    const k = drop.member && host.includes(drop.member) ? host.indexOf(drop.member) : pos === 'above' ? 0 : host.length - 1;
    const i = pos === 'above' ? k : k + 1;
    return [...host.slice(0, i), blockId, ...host.slice(i)];
  };
  const want = stacked ? rest.map((u) => (u === host ? joined() : u))
    : [...rest.slice(0, at + (pos === 'after' || pos === 'right' ? 1 : 0)), [blockId], ...rest.slice(at + (pos === 'after' || pos === 'right' ? 1 : 0))];
  // A block of a column of the rule landing apart from the column's other blocks leaves the column.
  const column = phoneParts(blocks, setup).columns.find((c) => c.includes(blockId));
  const leaves = Boolean(column) && !want.some((u) => u.includes(blockId) && u.some((id) => id !== blockId && column.includes(id)));
  const looser = leaves ? { ...setup, loose: [...setup.loose, blockId] } : setup;
  // The order the drop asks for: settled, or as it stands where the drop keeps it.
  const order = settle(blocks, looser, leaves ? phoneTree(blocks, looser) : tree, want, [blockId]) ?? (same(want.flat(), units.flat()) ? { places: {} } : null);
  if (!order) return null;
  const change = { ...order, cells, ...(leaves ? { loose: looser.loose } : {}) };
  const unchanged = Object.entries(cells).every(([id, cell]) => {
    const now = phoneCellsOf(byId.get(id));
    return cell ? now?.col === cell.col && now?.cols === cell.cols : !now;
  });
  return unchanged && !leaves && !Object.keys(order.places ?? {}).length && !order.stacks && !order.list ? null : change;
}

/** How far a flowing block is dragged over its own place before its room above it changes, in px: a click's jitter changes nothing. */
const SPACE_STILL_PX = 6;

/**
 * A flowing block's room above it on the phone after a drag of `moved` px over its own place, in steps of `step` px, never below minus the gap.
 * @param {{space?: number, row?: number}|null} placement The block's `frames.mobile`
 * @param {number} moved
 * @param {number} gap The section's space between blocks on the phone (mobileGapOf)
 * @param {number} [step]
 * @returns {number|null} The new room, or null where it stays as it is
 */
export function phoneSpaceDragged(placement, moved, gap, step = 4) {
  if (!Number.isFinite(moved) || Math.abs(moved) < SPACE_STILL_PX) return null;
  const was = phoneSpace(placement);
  const next = Math.max(-gap, Math.round((was + moved) / step) * step);
  return next === was ? null : next;
}

/**
 * The gap a block's room above it may take on the phone: the whole gap under a flowing block, none at the top, and under a pinned block up to meeting it.
 * @param {{gap: number, above: number, ownTop: number, space: number, pinned: boolean}} p
 *   above: the nearest block's bottom above, or -Infinity; ownTop: the block's top as drawn with its room `space`; pinned: whether that block is pinned
 * @returns {number} The gap in px, for phoneSpaceDragged
 */
export function phoneSpaceFloor({ gap, above, ownTop, space, pinned }) {
  if (!Number.isFinite(above)) return 0;
  return pinned ? Math.max(0, Math.min(gap, ownTop - above - space)) : gap;
}

/**
 * The span a flowing block dragged on the phone keeps its place in: between the nearest blocks above and below it in its columns.
 * @param {Array<{left: number, top: number, right: number, bottom: number}>} others The other blocks' boxes as the drag began
 * @param {{left: number, top: number, right: number, bottom: number}} own The block's own box as the drag began
 * @returns {{top: number, bottom: number}}
 */
export function phoneHomeSpan(others, own) {
  const over = others.filter((b) => b.right > own.left + 1 && b.left < own.right - 1);
  const above = over.filter((b) => b.bottom <= own.top + 1).map((b) => b.bottom);
  const below = over.filter((b) => b.top >= own.bottom - 1).map((b) => b.top);
  return { top: above.length ? Math.max(...above) : -Infinity, bottom: below.length ? Math.min(...below) : Infinity };
}

/**
 * A selected set's drop on the phone canvas: the dragged block lands as phoneDropChange lands it, and the set's other flowing blocks follow it in turn.
 * @param {object} section
 * @param {string} blockId The dragged block
 * @param {object|null} drop As phoneDropChange takes it
 * @param {string[]} followers The set's other flowing blocks, in the phone's reading order
 * @returns {object|null} The change, as phoneDropChange gives it, or null where the drop changes nothing
 */
export function phoneSetDropChange(section, blockId, drop, followers) {
  const lead = phoneDropChange(section.blocks, phoneSetupOf(section), blockId, drop);
  if (!drop || !followers.length || drop.pos === 'here') return lead;
  const stacked = drop.pos === 'above' || drop.pos === 'below' || drop.pos === 'into';
  let now = lead ? phoneChangeApplied(section, lead) : section;
  let prev = drop.pos === 'left' ? drop.of : blockId;
  for (const id of followers) {
    const step = phoneDropChange(now.blocks, phoneSetupOf(now), id, stacked ? { pos: 'below', of: prev, member: prev } : { pos: 'after', of: prev });
    if (step) now = phoneChangeApplied(now, step);
    prev = id;
  }
  return phoneChangeBetween(section, now);
}

/**
 * The change that takes a section to another state of its phone order: the places, stacks, custom order, loose blocks and flowing blocks' cells that differ.
 * @param {object} before
 * @param {object} after The same section with phone changes written in (phoneChangeApplied)
 * @returns {{places: Record<string, object|null>, cells: Record<string, {col: number, cols: number}|null>, stacks?: string[][], list?: string[], loose?: string[]}|null} Null where the two stand alike
 */
export function phoneChangeBetween(before, after) {
  const was = new Map(before.blocks.map((b) => [b.id, b]));
  const json = (value) => JSON.stringify(value ?? null);
  const change = { places: {}, cells: {} };
  for (const block of after.blocks) {
    const old = was.get(block.id);
    if (!old) continue;
    if (json(old.phonePlace) !== json(block.phonePlace)) change.places[block.id] = block.phonePlace ?? null;
    const cells = phoneCells(block.frames?.mobile) ?? null;
    if (flowing(block) && json(phoneCells(old.frames?.mobile)) !== json(cells)) change.cells[block.id] = cells;
  }
  if (json(before.phoneStacks ?? []) !== json(after.phoneStacks ?? [])) change.stacks = after.phoneStacks ?? [];
  if (json(before.phoneList) !== json(after.phoneList)) change.list = after.phoneList ?? [];
  if (json(before.phoneLoose ?? []) !== json(after.phoneLoose ?? [])) change.loose = after.phoneLoose ?? [];
  const empty = !Object.keys(change.places).length && !Object.keys(change.cells).length && !change.stacks && !change.list && !change.loose;
  return empty ? null : change;
}

/**
 * A section with a phone change written in as the editor writes it: places, stacks, order, cells, heights, rooms and pinned layers.
 * @param {object} section
 * @param {{places?: Record<string, object|null>, stacks?: string[][], list?: string[], loose?: string[], cells?: Record<string, {col: number, cols: number}|null>, heights?: Record<string, number|null>, spaces?: Record<string, number|null>, layers?: Record<string, number>}} change
 * @returns {object}
 */
export function phoneChangeApplied(section, change) {
  const ids = new Set((section?.blocks ?? []).map((b) => b.id));
  const blocks = (section?.blocks ?? []).map((b) => {
    let next = b;
    const own = () => (next === b ? (next = { ...b, frames: { ...b.frames } }) : next);
    if (change?.places && b.id in change.places) {
      const place = change.places[b.id];
      const side = typeof place?.before === 'string' ? 'before' : typeof place?.after === 'string' ? 'after' : null;
      own();
      if (side && place[side] !== b.id && ids.has(place[side])) next.phonePlace = { [side]: place[side] };
      else delete next.phonePlace;
    }
    if (change?.cells && b.id in change.cells && !Number.isFinite(b.frames?.mobile?.row)) {
      const cells = change.cells[b.id];
      const place = { ...(b.frames?.mobile ?? {}) };
      delete place.col;
      delete place.cols;
      if (Number.isInteger(cells?.col) && Number.isInteger(cells?.cols) && cells.cols < PHONE_COLUMNS && cells.col >= 1 && cells.col + cells.cols - 1 <= PHONE_COLUMNS) {
        delete place.x;
        delete place.w;
        Object.assign(place, { col: cells.col, cols: cells.cols });
      }
      own().frames.mobile = Object.keys(place).length ? place : null;
    }
    if (change?.heights && b.id in change.heights && !Number.isFinite(b.frames?.mobile?.row)) {
      const height = change.heights[b.id];
      const place = { ...(next.frames?.mobile ?? {}) };
      delete place.height;
      if (Number.isFinite(height) && height > 0) place.height = Math.round(height);
      own().frames.mobile = Object.keys(place).length ? place : null;
    }
    if (change?.spaces && b.id in change.spaces && !Number.isFinite(b.frames?.mobile?.row)) {
      const space = change.spaces[b.id];
      const place = { ...(next.frames?.mobile ?? {}) };
      delete place.space;
      if (Number.isFinite(space) && Math.round(space) !== 0) place.space = Math.round(space);
      own().frames.mobile = Object.keys(place).length ? place : null;
    }
    if (change?.layers && b.id in change.layers && Number.isFinite(b.frames?.mobile?.row) && Number.isInteger(change.layers[b.id]) && change.layers[b.id] >= 1) {
      own().frames.mobile = { ...next.frames.mobile, z: change.layers[b.id] };
    }
    return next;
  });
  const next = { ...section, blocks };
  if (Array.isArray(change?.stacks)) {
    const stacks = change.stacks.map((stack) => (Array.isArray(stack) ? [...new Set(stack)].filter((id) => ids.has(id)) : [])).filter((stack) => stack.length > 1);
    if (stacks.length) next.phoneStacks = stacks; else delete next.phoneStacks;
  }
  if (Array.isArray(change?.list)) next.phoneList = [...new Set(change.list)].filter((id) => ids.has(id));
  if (Array.isArray(change?.loose)) {
    const loose = [...new Set(change.loose)].filter((id) => ids.has(id));
    if (loose.length) next.phoneLoose = loose; else delete next.phoneLoose;
  }
  return next;
}

/**
 * The blocks with words a phone change would draw in fewer columns than they read well in (ADR-0034): only those the change gives cells, a pinned block never.
 * @param {object[]} blocks The section's blocks
 * @param {{cells?: Record<string, {col: number, cols: number}|null>}|null} change
 * @param {Iterable<string>} wordIds The blocks that hold words
 * @param {number} least The fewest columns words read well in (leastWordsCols)
 * @returns {string[]}
 */
export function phoneTooNarrow(blocks, change, wordIds, least) {
  if (!change) return [];
  const words = new Set(wordIds);
  return blocks.filter((block) => {
    if (!words.has(block.id) || Number.isFinite(block.frames?.mobile?.row) || !change.cells || !(block.id in change.cells)) return false;
    const cells = change.cells[block.id];
    return Boolean(cells) && cells.cols < least;
  }).map((block) => block.id);
}

/**
 * A height dragged on the phone, snapped to the row grid's steps or to the height that lines its bottom up with a unit beside it («Same height»).
 * @param {number} raw The height the pointer asks for, in px
 * @param {number} top The block's top in the flow, in px
 * @param {{top: number, bottom: number}[]} beside The boxes of the blocks and stacks on its line, in the flow's px
 * @param {number} [step] The row grid's step (MOBILE_ROW)
 * @param {number} [reach] How near the bottoms snap, in px
 * @returns {{height: number, same: boolean}}
 */
export function phoneHeightSnap(raw, top, beside, step = 8, reach = 6) {
  let best = null;
  for (const box of beside ?? []) {
    const height = box.bottom - top;
    if (height > 0 && Math.abs(height - raw) <= reach && (best === null || Math.abs(height - raw) < Math.abs(best - raw))) best = height;
  }
  if (best !== null) return { height: Math.round(best), same: true };
  return { height: Math.max(step, Math.round(raw / step) * step), same: false };
}

/**
 * The fewest phone columns a cell holding words can take at a window's width without the words floor in base.css drawing it across the row.
 * @param {number} width The window's width in px
 * @returns {number} 2 to 5
 */
export function leastWordsCols(width) {
  if (width > 657) return 2;
  if (width > 438) return 3;
  if (width > 328) return 4;
  return 5;
}

/**
 * The places a block walks through with the arrow keys on the phone canvas, each a drop as phoneDropAt reads it; `home` is the first where it already stands.
 * @param {object[]} blocks
 * @param {string|object} rawSetup
 * @param {string} blockId
 * @returns {{drops: Array<{pos: 'before'|'after'|'above'|'below', of: string, member?: string}>, home: number}}
 */
export function phoneKeyDrops(blocks, rawSetup, blockId) {
  const setup = setupFrom(rawSetup);
  const byId = new Map(blocks.map((b) => [b.id, b]));
  const drops = [];
  for (const unit of unitsOf(phoneTree(blocks, setup))) {
    const others = unit.filter((id) => id !== blockId);
    if (!others.length) continue;
    const of = others[0];
    // A unit across the row is walked past, before and after it; a unit in cells is joined, above and below it in its column.
    if (!phoneCellsOf(byId.get(of))) drops.push({ pos: 'before', of }, { pos: 'after', of });
    else drops.push({ pos: 'above', of, member: of }, { pos: 'below', of, member: others[others.length - 1] });
  }
  let home = drops.findIndex((drop) => phoneDropChange(blocks, setup, blockId, drop) === null);
  if (home < 0) home = 0;
  return { drops, home };
}

/** The room left below the desktop's lowest block for a block added in the phone view, in px. */
const ADDED_GAP = 24;

/**
 * A section with blocks added in the phone view: shown on phones only, their desktop frames below every block, the first at `drop` and the rest after it.
 * @param {object} section
 * @param {object[]} added The new blocks, in the order they are read
 * @param {object|null} [drop] Where the first lands (phoneDropChange)
 * @returns {object} The section with the blocks in it; the section given is left as it is
 */
export function phoneAdded(section, added, drop = null) {
  const blocks = section?.blocks ?? [];
  const frames = (list) => list.map((b) => b.frames?.desktop).filter(Boolean);
  const foot = Math.max(0, ...frames(blocks).map((f) => f.y + f.h));
  const top = Math.min(...frames(added).map((f) => f.y));
  const placed = added.map((block) => {
    const placement = block.frames?.mobile ?? null;
    const next = { ...block, hideDesktop: true, frames: { ...block.frames, mobile: Number.isFinite(placement?.row) ? unpinned(placement) : placement } };
    if (next.hideMobile) next.hideMobile = false;
    const frame = block.frames?.desktop;
    if (frame) next.frames.desktop = { ...frame, y: Math.round(foot + ADDED_GAP + frame.y - top) };
    return next;
  });
  let next = { ...section, blocks: [...blocks, ...placed] };
  let at = drop;
  for (const block of placed) {
    const change = at ? phoneDropChange(next.blocks, phoneSetupOf(next), block.id, at) : null;
    if (change) next = phoneChangeApplied(next, change);
    if (at) at = { pos: 'after', of: block.id };
  }
  return next;
}

/** A flowing block's cells (migrate.js phoneCells), or null. */
const phoneCellsOf = (block) => (block && flowing(block) ? phoneCells(block.frames?.mobile) : null);
