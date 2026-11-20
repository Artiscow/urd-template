/**
 * The presets that suggest a section's layout on the phone (0.7.3.14), in the editor only: pure, node-tested (tests/phone-layouts.test.mjs).
 * A preset fills the phone's eight cell columns with the section's units in the phone's order, a block alone or a stack (phone-moves.js phoneTree), as a starting point the owner changes freely afterwards.
 * Its change writes the cells of each unit's blocks (`frames.mobile.col` and `cols`), and for «Alternate sides» the order that puts the picture first on every other line, since a block later in the order never stands left of an earlier one on its line.
 */
import { phoneTree, settle, flowing } from './phone-moves.js';
import { phoneSetupOf, phoneParts, stackOrder } from './phone-order.js';
import { phoneCells, phoneHeight, PHONE_COLUMNS } from './migrate.js';
import { pinsOnPhone, stickyLeads } from './sticky-model.js';

/** The presets, in the order they stand where none fits better. */
export const PHONE_LAYOUTS = ['two-per-line', 'pairs', 'alternate', 'wide-two', 'big-two', 'one-column'];

/**
 * The rows an owner's own layout is made of (site.phoneLayouts, additive from 0.7.3.28), each a part of the phone's two columns: one cell across the row, two halves, a tall half on the left beside two stacked on the right, or two stacked on the left beside a tall half on the right.
 */
export const PHONE_ROWS = ['full', 'two', 'big-left', 'big-right'];

/** The block types that are words: a text beside a picture reads as a pair. */
const WORD_TYPES = new Set(['text', 'terms', 'button', 'faq', 'timeline', 'quote', 'stats', 'table']);
/** The block types that are pictures. */
const PICTURE_TYPES = new Set(['image', 'video', 'gallery']);

const LEFT = { col: 1, cols: 4 };
const RIGHT = { col: 5, cols: 4 };

/** Each row's cells in reading order, one per unit: the tall half is read first, then the halves stacked beside it. */
const ROW_CELLS = { full: [null], two: [LEFT, RIGHT], 'big-left': [LEFT, RIGHT, RIGHT], 'big-right': [LEFT, LEFT, RIGHT] };

/**
 * An own layout as kept for the site, cleaned: its id, its name, and its rows of PHONE_ROWS, at least one; null for anything that is no layout.
 * Pure, tested.
 * @param {unknown} layout
 * @returns {{id: string, name: string, rows: string[]}|null}
 */
export function ownLayoutOf(layout) {
  if (!layout || typeof layout !== 'object' || typeof layout.id !== 'string' || !layout.id) return null;
  const rows = Array.isArray(layout.rows) ? layout.rows.filter((row) => PHONE_ROWS.includes(row)) : [];
  if (!rows.length) return null;
  return { id: layout.id, name: typeof layout.name === 'string' ? layout.name : '', rows };
}

/** Each unit's cells under an own layout: its rows' cells one after another, from the first row again once the last is filled. */
function ownCells(units, layout) {
  const pattern = layout.rows.flatMap((row) => ROW_CELLS[row]);
  return units.map((_, i) => pattern[i % pattern.length]);
}

/**
 * A block's mark in the pictures of the phone's order and layout: a picture, a heading, a button, a space, or text.
 * @param {{type: string, props?: object}} block
 * @returns {'pic'|'btn'|'head'|'space'|'text'}
 */
export function phoneMark(block) {
  if (block.type === 'spacer') return 'space';
  if (['image', 'gallery', 'video', 'map', 'calendar', 'collection', 'product'].includes(block.type)) return 'pic';
  if (block.type === 'button') return 'btn';
  return /^\s*<h[1-6]/i.test(String(block.props?.html ?? '')) ? 'head' : 'text';
}

/** The setup from a rule alone or a whole setup. */
const setupFrom = (setup) => (setup && typeof setup === 'object' ? { list: null, stacks: [], ...setup } : { rule: setup ?? 'top', list: null, stacks: [] });

/** The section's units on the phone, each with its blocks and what it is: a picture, words, or else. */
function unitsOf(blocks, setup) {
  const byId = new Map(blocks.map((b) => [b.id, b]));
  return phoneTree(blocks, setup).map((node) => {
    const members = (node.children ? node.children.map((c) => c.id) : [node.id]).map((id) => byId.get(id)).filter(Boolean);
    const kind = members.every((b) => PICTURE_TYPES.has(b.type)) ? 'picture'
      : members.some((b) => WORD_TYPES.has(b.type)) ? 'words' : 'other';
    return { ids: members.map((b) => b.id), blocks: members, kind };
  });
}

/** The units that read as a pair, a picture and words next to each other, by the index of the first; each unit in one pair at most. */
function pairsOf(units) {
  const out = [];
  for (let i = 0; i + 1 < units.length; i += 1) {
    const kinds = [units[i].kind, units[i + 1].kind];
    if (kinds.includes('picture') && kinds.includes('words')) {
      out.push(i);
      i += 1;
    }
  }
  return out;
}

/**
 * Whether a layout of the site's own fits the section: one of two units or more, since a single unit has nothing to stand beside.
 * @param {object[]} blocks The section's blocks
 * @param {string|object} setup The section's rule, or its setup (phoneSetupOf)
 * @returns {boolean}
 */
export function ownLayoutFits(blocks, setup) {
  return unitsOf(blocks, setupFrom(setup)).length >= 2;
}

/**
 * The presets for a section, the ones that fit first and the best of those first, each saying whether it fits; one that does not fit is shown greyed, never left out. The site's own layouts follow Urd's, in the order they were kept, each fitting a section of two units or more (ownLayoutFits), and a layout whose id stands twice is offered once, the first kept.
 * @param {object[]} blocks The section's blocks
 * @param {string|object} setup The section's rule, or its setup (phoneSetupOf)
 * @param {unknown[]} [own] The site's own layouts (site.phoneLayouts)
 * @returns {Array<{id: string, fits: boolean, own?: {id: string, name: string, rows: string[]}}>} An own layout's entry carries the layout, which phoneLayoutChange and phoneLayoutSketch take in place of an id
 */
export function phoneLayouts(blocks, setup, own = []) {
  const units = unitsOf(blocks, setupFrom(setup));
  const pairs = pairsOf(units).length;
  const cards = units.filter((u) => u.ids.length > 1).length;
  const celled = blocks.some((b) => flowing(b) && !b.hideMobile && phoneCells(b.frames?.mobile));
  const fits = {
    'two-per-line': units.length >= 2,
    pairs: pairs >= 1,
    alternate: pairs >= 2,
    'wide-two': units.length >= 3,
    'big-two': units.length >= 3 && units[0].kind === 'picture',
    'one-column': celled,
  };
  // Cards of several blocks read two to a line first; pictures with their words pair up first.
  const score = {
    'two-per-line': cards >= 2 && cards >= units.length / 2 ? 6 : 3,
    alternate: pairs >= 2 ? 5 : 0,
    pairs: pairs >= 1 ? 4 : 0,
    'big-two': 2.5,
    'wide-two': 2,
    'one-column': 1,
  };
  const fitting = PHONE_LAYOUTS.filter((id) => fits[id]).sort((a, b) => score[b] - score[a]);
  const ids = new Set();
  const owned = (Array.isArray(own) ? own : []).map(ownLayoutOf).filter((layout) => {
    if (!layout || ids.has(layout.id)) return false;
    ids.add(layout.id);
    return true;
  }).map((layout) => ({ id: `own:${layout.id}`, fits: units.length >= 2, own: layout }));
  return [...fitting.map((id) => ({ id, fits: true })), ...PHONE_LAYOUTS.filter((id) => !fits[id]).map((id) => ({ id, fits: false })), ...owned];
}

/**
 * Each unit's cells under a preset, in the units' order; for «Pairs» and «Alternate sides» the pairs instead, whose cells are given by where they stand once read the other way round where asked (`flip`).
 * @returns {{cells: Array<{col: number, cols: number}|null>, flip: number[], pairs: number[]}}
 */
function plan(units, id) {
  const cells = units.map(() => null);
  const flip = [];
  const pairs = [];
  if (id === 'two-per-line') units.forEach((_, i) => { cells[i] = i % 2 ? RIGHT : LEFT; });
  if (id === 'wide-two') units.forEach((_, i) => { cells[i] = i % 3 === 0 ? null : i % 3 === 1 ? LEFT : RIGHT; });
  if (id === 'big-two' && units.length >= 3) {
    cells[0] = LEFT;
    cells[1] = RIGHT;
    cells[2] = RIGHT;
  }
  if (id === 'pairs' || id === 'alternate') {
    pairsOf(units).forEach((i, k) => {
      pairs.push(i);
      // Every other pair reads its picture first, so it stands on the left; the first reads its words first.
      if (id === 'alternate' && (units[i].kind === 'picture') !== (k % 2 === 1)) flip.push(i);
    });
  }
  return { cells, flip, pairs };
}

/** The blocks and setup with a change written in, as the editor writes it. */
function written(blocks, setup, change) {
  const next = blocks.map((b) => {
    if (!(b.id in (change.places ?? {}))) return b;
    const copy = { ...b };
    if (change.places[b.id]) copy.phonePlace = change.places[b.id]; else delete copy.phonePlace;
    return copy;
  });
  return { blocks: next, setup: { ...setup, ...(change.stacks ? { stacks: change.stacks } : {}), ...(change.list ? { list: change.list } : {}) } };
}

/**
 * A preset's change for a section: the cells of every block of every unit (null for the full row), and for «Alternate sides» the exceptions, stacks or custom order that read every other pair the other way round.
 * @param {object[]} blocks The section's blocks
 * @param {string|object} rawSetup The section's rule, or its setup (phoneSetupOf)
 * @param {string|object} id A preset of PHONE_LAYOUTS, or an own layout (ownLayoutOf), whose rows fill the units' cells in turn
 * A preset is a fresh start: it also takes away the own phone heights of the blocks it places (`heights`), which «Same height» and an earlier preset left, so the heights a preset asks for after it are measured anew.
 * @returns {{cells: Record<string, {col: number, cols: number}|null>, heights?: Record<string, null>, places?: Record<string, object|null>, stacks?: string[][], list?: string[]}|null} The change, a block's cells null for the full row (where a width set by hand stays); null where the press would change nothing
 */
export function phoneLayoutChange(blocks, rawSetup, id) {
  const own = typeof id === 'object' ? ownLayoutOf(id) : null;
  if (!own && !PHONE_LAYOUTS.includes(id)) return null;
  const setup = setupFrom(rawSetup);
  const units = unitsOf(blocks, setup);
  const { cells, flip, pairs } = own ? { cells: ownCells(units, own), flip: [], pairs: [] } : plan(units, id);
  const change = { cells: {} };
  // Each pair to flip: its second unit moved before its first, one move at a time on the order as the moves before it left it.
  let work = { blocks, setup };
  for (const i of flip) {
    const [first, second] = [units[i], units[i + 1]];
    const tree = phoneTree(work.blocks, work.setup);
    const now = tree.map((node) => (node.children ? node.children.map((c) => c.id) : [node.id]));
    const a = now.findIndex((u) => u.includes(first.ids[0]));
    const b = now.findIndex((u) => u.includes(second.ids[0]));
    if (a < 0 || b < 0) continue;
    const want = now.filter((_, k) => k !== b);
    want.splice(want.indexOf(now[a]), 0, now[b]);
    const step = settle(work.blocks, work.setup, tree, want, now[b]);
    if (!step) continue;
    change.places = { ...change.places, ...step.places };
    if (step.stacks) change.stacks = step.stacks;
    if (step.list) change.list = step.list;
    work = written(work.blocks, work.setup, step);
  }
  // A pair stands side by side where its two units stand next to each other once the moves are made, the one read first on the left; a pair that could not be read the other way round stands as it reads.
  if (pairs.length) {
    const final = phoneTree(work.blocks, work.setup).map((node) => (node.children ? node.children.map((c) => c.id) : [node.id]));
    const at = (unit) => final.findIndex((ids) => ids.includes(unit.ids[0]));
    for (const i of pairs) {
      const [a, b] = [at(units[i]), at(units[i + 1])];
      if (Math.abs(a - b) !== 1) continue;
      cells[a < b ? i : i + 1] = LEFT;
      cells[a < b ? i + 1 : i] = RIGHT;
    }
  }
  units.forEach((unit, i) => { for (const bid of unit.ids) change.cells[bid] = cells[i] ? { ...cells[i] } : null; });
  const byId = new Map(blocks.map((b) => [b.id, b]));
  const heighted = Object.keys(change.cells).filter((bid) => phoneHeight(byId.get(bid)?.frames?.mobile));
  if (heighted.length) change.heights = Object.fromEntries(heighted.map((bid) => [bid, null]));
  // A press that changes nothing is none.
  const sameCells = Object.entries(change.cells).every(([bid, want]) => {
    const now = phoneCells(byId.get(bid)?.frames?.mobile);
    return want ? now?.col === want.col && now?.cols === want.cols : !now;
  });
  const placed = Object.entries(change.places ?? {}).some(([bid, place]) => JSON.stringify(place ?? null) !== JSON.stringify(byId.get(bid)?.phonePlace ?? null));
  return sameCells && !placed && !heighted.length && !change.stacks && !change.list ? null : change;
}

/**
 * The section's lines on the phone, as the row grid draws them (render.js): the flowing blocks in the phone's order, those one after another in the same cells standing in one cell (a stack in its first block's cells), each cell placed on the line it fits after the one before it and on the next where it does not; a block across the row stands on a line of its own. A block pinned on the phone while the page scrolls stands in its own cells through its slot, apart from the blocks before and after it; a block pinned to rows, and a block hidden on phones, stands on no line.
 * Pure, tested.
 * @param {object} section The section, its blocks and its phone order
 * @returns {Array<Array<{ids: string[], col: number, cols: number}>>} Each line's cells, left to right; a block across the row as a line of one cell of the full row
 */
export function phoneLines(section) {
  const blocks = section?.blocks ?? [];
  const parts = phoneParts(blocks, phoneSetupOf(section));
  const byId = new Map(blocks.map((b) => [b.id, b]));
  const head = new Map(parts.stacks.flatMap((ids) => ids.map((id) => [id, byId.get(ids[0])])));
  const leads = stickyLeads(blocks);
  const items = [];
  let open = null;
  for (const block of parts.order) {
    if (!flowing(block) || block.hideMobile) continue;
    const lead = head.get(block.id);
    const cells = lead && lead !== block && flowing(lead) ? phoneCells(lead.frames?.mobile) : phoneCells(block.frames?.mobile);
    // Pinned while the page scrolls on the phone: its slot is a grid item of its own in its cells.
    if (block.sticky && pinsOnPhone(leads.get(block.sticky.group || `solo-${block.id}`))) {
      open = null;
      items.push(cells ? { ids: [block.id], col: cells.col, cols: cells.cols } : { ids: [block.id], col: 1, cols: PHONE_COLUMNS, row: true });
      continue;
    }
    if (cells && open && open.col === cells.col && open.cols === cells.cols) {
      open.ids.push(block.id);
      continue;
    }
    open = cells ? { ids: [block.id], col: cells.col, cols: cells.cols } : null;
    items.push(open ?? { ids: [block.id], col: 1, cols: PHONE_COLUMNS, row: true });
  }
  const lines = [];
  let line = null;
  let next = 1;
  for (const item of items) {
    if (item.row || !line || item.col < next) {
      line = [];
      lines.push(line);
    }
    line.push({ ids: item.ids, col: item.col, cols: item.cols });
    next = item.row ? PHONE_COLUMNS + 1 : item.col + item.cols;
  }
  return lines;
}

/**
 * «Same width»: the cells on each line of the phone that holds more than one share the line's span, from its first cell's left edge to its last cell's right, as evenly as the eight columns allow, the columns left over going to the first cells, left to right without gaps.
 * Pure, tested.
 * @param {object} section The section, its blocks and its phone order
 * @returns {{cells: Record<string, {col: number, cols: number}>}|null} The change, every block of a cell given the cell's new columns; null where every line already stands so
 */
export function phoneSameWidths(section) {
  const change = { cells: {} };
  let moved = false;
  for (const line of phoneLines(section)) {
    if (line.length < 2) continue;
    const first = line[0].col;
    const span = line.at(-1).col + line.at(-1).cols - first;
    const base = Math.floor(span / line.length);
    const extra = span - base * line.length;
    let col = first;
    line.forEach((cell, i) => {
      const cols = base + (i < extra ? 1 : 0);
      if (cols !== cell.cols || col !== cell.col) moved = true;
      for (const id of cell.ids) change.cells[id] = { col, cols };
      col += cols;
    });
  }
  return moved ? change : null;
}

/**
 * A preset drawn small: the section's blocks after its change, a cell per run of blocks in the same cells, each with its blocks' marks, at most `max` blocks; a preset that changes nothing draws the section as it stands.
 * @param {object} section The section, its blocks and its phone order
 * @param {string|object} id A preset of PHONE_LAYOUTS, or an own layout (ownLayoutOf)
 * @param {number} [max]
 * @returns {Array<{col: number, cols: number, marks: string[]}>}
 */
export function phoneLayoutSketch(section, id, max = 9) {
  const setup = phoneSetupOf(section);
  const blocks = section?.blocks ?? [];
  const change = phoneLayoutChange(blocks, setup, id) ?? { cells: {} };
  const next = written(blocks, setup, change);
  const out = [];
  // Each flowing block in the order the change leaves, in its own cells as the page draws it: those one after another in the same cells under each other in one cell.
  for (const block of stackOrder(next.blocks, next.setup).filter(flowing).slice(0, max)) {
    const cells = block.id in change.cells ? change.cells[block.id] : phoneCells(block.frames?.mobile);
    const { col, cols } = cells ?? { col: 1, cols: 8 };
    const last = out[out.length - 1];
    if (last && last.col === col && last.cols === cols && cols < 8) last.marks.push(phoneMark(block));
    else out.push({ col, cols, marks: [phoneMark(block)] });
  }
  return out;
}
