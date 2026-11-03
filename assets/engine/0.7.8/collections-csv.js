/**
 * CSV export and import for collections (feature map C12): pure logic without DOM,
 * tested in tests/collections-csv.test.mjs. The module is imported ONLY by the
 * editor (bundled there) and deliberately kept outside the visitor closure:
 * visitors never need it.
 *
 * The format is RFC 4180-like: fields holding the separator, a quote or a newline are wrapped in quotes ("" is an escaped quote), and the first row holds the column names.
 * A collection writes the columns its kind uses (columnsFor), with the list separator and the decimal mark of the admin's language (separatorFor) and a byte-order mark, so a spreadsheet opens it in columns and reads its letters; a file is read with either separator, found from its header row.
 * The list fields are separated by «|», the yes-and-no fields write «yes», the picture's style is a cell of compact JSON, and the colours' pictures stand by position beside their names, so an export imported again changes nothing.
 * A file is read as UTF-8, or as windows-1252 where it is not UTF-8, as a spreadsheet's plain CSV save on Windows writes it (decodeCsv); numbers read with the decimal mark the separator goes with, so an export imported again reads its own numbers.
 * An import is a plan before anything is stored (readCsv, importPlan): each row is matched to an entry by its id, checked cell by cell, and named new, changed, unchanged or not stored with its reason; a column the file lacks leaves its field as it stands, and an empty cell clears it.
 * An entry's link to a page or a spot on it is written as the address the page draws (resolveLink), and an address that names a page of the register is read back as that page and its spot.
 */

import { resolveLink } from './nav-model.js';

/** The columns of a products collection, in export order. */
const PRODUCT_COLUMNS = ['id', 'title', 'text', 'image', 'imageAlt', 'imageStyle', 'price', 'memberPrice', 'badge', 'sizes', 'colors', 'colorImages',
  'requireSize', 'requireColor', 'disableUntilChosen', 'quantity', 'quantityMin', 'quantityMax'];

/** The columns of the other kinds (news, notices, publications, custom): the date and the link the title follows. */
const DATED_COLUMNS = ['id', 'title', 'date', 'text', 'href', 'newTab', 'rel', 'download', 'image', 'imageAlt', 'imageStyle'];

/** Every column the import knows. */
const ALL_COLUMNS = [...new Set([...DATED_COLUMNS, ...PRODUCT_COLUMNS])];

/** The columns a kind of collection writes and reads. */
export function columnsFor(kind) {
  return kind === 'products' ? PRODUCT_COLUMNS : DATED_COLUMNS;
}

/** The yes-and-no columns, written «yes» or left empty. */
const YES_NO = ['newTab', 'download', 'requireSize', 'requireColor', 'disableUntilChosen', 'quantity'];
const YES = new Set(['yes', 'y', 'true', '1', 'x', 'ja', 'j', 'sant', 'evet', 'e']);
const NO = new Set(['no', 'n', 'false', '0', 'nei', 'usant', 'hayır', 'hayir']);

/** The rel words a link may carry (the schema's list). */
const REL_WORDS = ['nofollow', 'sponsored'];

/** The fields of an image style and the values each takes (the schema's imageStyle). */
const STYLE_FIELDS = {
  fit: ['cover', 'contain'],
  radius: ['sm', 'md'],
  shape: ['wide', 'square', 'portrait', 'circle'],
  zoom: [1, 3],
  x: [0, 1],
  y: [0, 1],
  brightness: [0, 2],
  contrast: [0, 2],
  saturate: [0, 2],
};

const ID_RE = /^[a-z0-9][a-z0-9-]*$/;

/**
 * The list separator of a language, as its spreadsheets write CSV: a semicolon where the decimal mark is a comma (Norwegian, Turkish, Swedish), else a comma.
 * @param {string} lang
 * @returns {',' | ';'}
 */
export function separatorFor(lang) {
  try {
    return new Intl.NumberFormat(lang || undefined).format(1.5).includes(',') ? ';' : ',';
  } catch {
    return ',';
  }
}

/** The separator a file is written with: the one of a comma, a semicolon and a tab its header row holds most of, outside quotes. */
export function detectSeparator(text) {
  const counts = { ',': 0, ';': 0, '\t': 0 };
  let quoted = false;
  for (const ch of String(text ?? '').replace(/^﻿/, '')) {
    if (ch === '"') quoted = !quoted;
    else if (!quoted && (ch === '\n' || ch === '\r')) break;
    else if (!quoted && ch in counts) counts[ch] += 1;
  }
  const best = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  return best[1] > 0 ? best[0] : ',';
}

function csvField(value, sep) {
  const text = String(value ?? '');
  return text.includes(sep) || /["\n\r]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

const yes = (on) => (on ? 'yes' : '');
const number = (n, decimal) => (typeof n === 'number' && Number.isFinite(n) ? String(n).replace('.', decimal) : '');

/**
 * One entry's cell for a column, as the export writes it (lists, numbers and yes-and-no become text).
 * @param {object} entry
 * @param {string} column
 * @param {Array<{id: string, path: string}>} [pages] The page register, for an entry that links a page
 * @param {'.'|','} [decimal] The decimal mark numbers are written with
 */
export function csvCell(entry, column, pages = [], decimal = '.') {
  const e = entry ?? {};
  switch (column) {
    case 'sizes': return (e.sizes ?? []).join('|');
    case 'colors': return (e.colors ?? []).map((c) => c.name).join('|');
    case 'colorImages': return (e.colors ?? []).some((c) => c.image) ? e.colors.map((c) => c.image ?? '').join('|') : '';
    case 'rel': return (e.rel ?? []).join('|');
    case 'imageStyle': return e.imageStyle && Object.keys(e.imageStyle).length ? JSON.stringify(e.imageStyle) : '';
    case 'quantity': return yes(e.quantity && typeof e.quantity === 'object');
    case 'quantityMin': return e.quantity?.min ?? '';
    case 'quantityMax': return e.quantity?.max ?? '';
    case 'price':
    case 'memberPrice': return number(e[column], decimal);
    case 'href': {
      if (!e.page) return e.href ?? '';
      const link = resolveLink(e, pages);
      // A page the register no longer has is written by its id, so the link comes back as it was.
      return link.missing ? `page:${e.page}${e.target ? `#${e.target}` : ''}` : link.href;
    }
    default:
      if (YES_NO.includes(column)) return yes(e[column] === true);
      return e[column] ?? '';
  }
}

/**
 * The collection's entries as CSV text: the header and one row per entry.
 * @param {Array<object>} entries
 * @param {Array<{id: string, path: string}>} [pages] The page register, for an entry that links a page
 * @param {{kind?: string, sep?: ','|';', bom?: boolean}} [options] The kind's columns (every column without one), the separator, and the byte-order mark a spreadsheet reads the letters by
 */
export function entriesToCsv(entries, pages = [], { kind, sep = ',', bom = false } = {}) {
  const columns = kind ? columnsFor(kind) : ALL_COLUMNS;
  const decimal = sep === ';' ? ',' : '.';
  const rows = [columns.join(sep)];
  for (const entry of entries ?? []) {
    rows.push(columns.map((column) => csvField(csvCell(entry, column, pages, decimal), sep)).join(sep));
  }
  return (bom ? '﻿' : '') + rows.join('\n') + '\n';
}

/** Raw CSV text → rows of cells (handles quotes and newlines inside fields, and a byte-order mark); empty rows (double newlines, a trailing line) are left out. */
export function parseCsv(text, sep = ',') {
  return parseCsvRows(text, sep).map((r) => r.cells);
}

/**
 * Raw CSV text → the rows with their cells and the row number a spreadsheet gives them, the first row being 1 and an empty row counting though it is left out, so a row named in the preview is the row the owner finds in the file.
 * @returns {Array<{row: number, cells: string[]}>}
 */
export function parseCsvRows(text, sep = ',') {
  const rows = [];
  let row = [];
  let cell = '';
  let quoted = false;
  let line = 1;
  const src = String(text ?? '').replace(/^﻿/, '');
  for (let i = 0; i < src.length; i += 1) {
    const ch = src[i];
    if (quoted) {
      if (ch === '"' && src[i + 1] === '"') { cell += '"'; i += 1; }
      else if (ch === '"') quoted = false;
      else cell += ch;
    } else if (ch === '"') {
      quoted = true;
    } else if (ch === sep) {
      row.push(cell);
      cell = '';
    } else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && src[i + 1] === '\n') i += 1;
      row.push(cell);
      rows.push({ row: line, cells: row });
      line += 1;
      row = [];
      cell = '';
    } else {
      cell += ch;
    }
  }
  if (cell !== '' || row.length) {
    row.push(cell);
    rows.push({ row: line, cells: row });
  }
  return rows.filter((r) => r.cells.some((c) => c.trim() !== ''));
}

const pad = (n) => String(n).padStart(2, '0');

/** A date cell as an ISO date: written 2026-11-02, or day first as a spreadsheet in the admin's languages writes it (02.11.2026, 02/11/2026); null for anything else or a day that does not exist. */
export function readDate(raw) {
  const t = String(raw ?? '').trim();
  let m = t.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  let y;
  let mo;
  let d;
  if (m) [y, mo, d] = [m[1], m[2], m[3]].map(Number);
  else if ((m = t.match(/^(\d{1,2})[./](\d{1,2})[./](\d{4})$/))) [d, mo, y] = [m[1], m[2], m[3]].map(Number);
  else return null;
  const date = new Date(Date.UTC(y, mo - 1, d));
  if (date.getUTCFullYear() !== y || date.getUTCMonth() !== mo - 1 || date.getUTCDate() !== d) return null;
  return `${y}-${pad(mo)}-${pad(d)}`;
}

/**
 * A number cell as a number, with spaces between thousands: 1200.50, 1 200,50, 1.200,50 or 1,200.50; NaN for anything else.
 * A mark followed by three digits alone (1,125 or 1.125) is a thousand or a decimal by the file's own decimal mark, the one its separator goes with, as the export writes it.
 * @param {string} raw
 * @param {'.'|','} [decimal] The file's decimal mark
 */
export function readNumber(raw, decimal = '.') {
  let s = String(raw ?? '').replace(/[\s  ]/g, '');
  const thousands = decimal === ',' ? '.' : ',';
  const grouped = decimal === ',' ? /^\d{1,3}(\.\d{3})+(,\d+)?$/ : /^\d{1,3}(,\d{3})+(\.\d+)?$/;
  if (grouped.test(s)) s = s.split(thousands).join('');
  else if (/^\d+[.,]\d+$/.test(s) && !/^\d+[.,]\d{3}$/.test(s)) s = s.replace(/[.,]/, decimal);
  if (decimal === ',') s = s.replace(',', '.');
  return /^\d+(\.\d+)?$/.test(s) ? Number(s) : NaN;
}

/**
 * A file's text: UTF-8, or windows-1252 where the bytes are not UTF-8, as a spreadsheet's plain CSV save on Windows writes them.
 * @param {ArrayBuffer} buffer
 * @returns {string}
 */
export function decodeCsv(buffer) {
  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(buffer);
  } catch {
    return new TextDecoder('windows-1252').decode(buffer);
  }
}

const splitList = (value) => String(value ?? '').split('|').map((s) => s.trim()).filter(Boolean);
const isPicture = (value) => value.startsWith('/media/') || value.startsWith('data:image/');

/** An image style cell: compact JSON whose fields and values are the ones the image editor sets; null when it is not. */
function readStyle(raw) {
  let value;
  try { value = JSON.parse(raw); } catch { return null; }
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const style = {};
  for (const [key, v] of Object.entries(value)) {
    const rule = STYLE_FIELDS[key];
    if (!rule) return null;
    if (typeof rule[0] === 'string') {
      if (!rule.includes(v)) return null;
    } else if (typeof v !== 'number' || v < rule[0] || v > rule[1]) {
      return null;
    }
    style[key] = v;
  }
  return style;
}

/**
 * Reads one row's cells into the fields they set, checked: `set` holds a field's new value, `null` clears it; the first cell that does not read gives the row's problem.
 * @returns {{set: object, problem: {key: string, column?: string, value?: string}|null}}
 */
function readRow(cells, columns, pages, decimal) {
  const set = {};
  const has = (column) => columns.includes(column);
  const cell = (column) => String(cells[column] ?? '').trim();
  const fail = (key, column, value) => ({ set, problem: { key, ...(column ? { column } : {}), ...(value !== undefined ? { value } : {}) } });

  const title = cell('title');
  if (!title) return fail('noTitle', 'title');
  set.title = title;

  for (const column of ['text', 'imageAlt', 'badge']) {
    if (has(column)) set[column] = cell(column) || null;
  }
  if (has('date')) {
    const raw = cell('date');
    if (!raw) set.date = null;
    else {
      const date = readDate(raw);
      if (!date) return fail('date', 'date', raw);
      set.date = date;
    }
  }
  for (const column of ['price', 'memberPrice']) {
    if (!has(column)) continue;
    const raw = cell(column);
    if (!raw) { set[column] = null; continue; }
    const n = readNumber(raw, decimal);
    if (!Number.isFinite(n)) return fail('number', column, raw);
    set[column] = n;
  }
  for (const column of YES_NO) {
    if (!has(column) || column === 'quantity') continue;
    const raw = cell(column).toLowerCase();
    if (!raw || NO.has(raw)) set[column] = null;
    else if (YES.has(raw)) set[column] = true;
    else return fail('yesNo', column, cell(column));
  }
  if (has('image')) {
    const raw = cell('image');
    if (raw && !isPicture(raw)) return fail('image', 'image', raw);
    set.image = raw || null;
  }
  if (has('imageStyle')) {
    const raw = cell('imageStyle');
    if (!raw) set.imageStyle = null;
    else {
      const style = readStyle(raw);
      if (!style) return fail('style', 'imageStyle', raw);
      set.imageStyle = Object.keys(style).length ? style : null;
    }
  }
  if (has('sizes')) {
    const sizes = splitList(cell('sizes'));
    set.sizes = sizes.length ? sizes : null;
  }
  if (has('colors') || has('colorImages')) {
    const images = has('colorImages') ? String(cells.colorImages ?? '').split('|').map((s) => s.trim()) : null;
    for (const image of images ?? []) {
      if (image && !isPicture(image)) return fail('image', 'colorImages', image);
    }
    set.colors = { names: has('colors') ? splitList(cell('colors')) : null, images };
  }
  if (has('rel')) {
    const words = splitList(cell('rel')).map((w) => w.toLowerCase());
    for (const word of words) if (!REL_WORDS.includes(word)) return fail('rel', 'rel', word);
    set.rel = words.length ? [...new Set(words)] : null;
  }
  if (has('href')) {
    const raw = cell('href');
    set.page = null;
    set.target = null;
    set.href = raw || null;
    // A page by its id (as the export writes a page the register no longer has) is that page and its spot.
    const byId = raw.match(/^page:([a-z0-9][a-z0-9-]*)(?:#([a-z0-9][a-z0-9-]{0,80}))?$/);
    if (byId) {
      set.href = null;
      set.page = byId[1];
      if (byId[2]) set.target = byId[2];
    }
    // An address that names a page of the register (as the export writes a page link) is that page and its spot.
    if (raw.startsWith('/')) {
      const [path, hash = ''] = raw.split('#');
      const page = pages.find((p) => p.path === (path.length > 1 ? path.replace(/\/$/, '') : path));
      if (page && (!hash || /^[a-z0-9][a-z0-9-]{0,80}$/.test(hash))) {
        set.href = null;
        set.page = page.id;
        if (hash) set.target = hash;
      }
    }
  }
  if (has('quantity') || has('quantityMin') || has('quantityMax')) {
    const q = {};
    if (has('quantity')) {
      const raw = cell('quantity').toLowerCase();
      if (!raw || NO.has(raw)) q.on = false;
      else if (YES.has(raw)) q.on = true;
      else return fail('yesNo', 'quantity', cell('quantity'));
    }
    for (const [column, key] of [['quantityMin', 'min'], ['quantityMax', 'max']]) {
      if (!has(column)) continue;
      const raw = cell(column);
      if (!raw) { q[key] = null; continue; }
      const n = Number(raw);
      if (!Number.isInteger(n) || n < 1 || n > 99) return fail('quantity', column, raw);
      q[key] = n;
    }
    set.quantity = q;
  }
  return { set, problem: null };
}

/**
 * Reads a CSV file for a collection: its separator, its columns (those of another kind and unknown ones set aside), and each row's fields, checked.
 * A row is numbered as a spreadsheet numbers it, the header being row 1 and an empty row counting.
 * @param {string} text
 * @param {string} kind The collection's kind
 * @param {Array<{id: string, path: string}>} [pages] The page register, for an address that names a page
 * @returns {{sep: string, columns: string[], ignored: string[], rows: Array<{row: number, id: string, cells: object, set: object, problem: object|null}>}|null} null without a title column or rows
 */
export function readCsv(text, kind, pages = []) {
  const sep = detectSeparator(text);
  const table = parseCsvRows(text, sep);
  if (table.length < 2) return null;
  const header = table[0].cells.map((name) => name.trim());
  if (!header.includes('title')) return null;
  const own = columnsFor(kind);
  const columns = own.filter((c) => header.includes(c));
  const ignored = header.filter((name) => name && !own.includes(name));
  const rows = table.slice(1).map(({ row, cells }) => {
    const byName = {};
    header.forEach((name, j) => { if (own.includes(name)) byName[name] = cells[j] ?? ''; });
    const { set, problem } = readRow(byName, columns, pages, sep === ';' ? ',' : '.');
    return { row, id: String(byName.id ?? '').trim(), cells: byName, set, problem };
  });
  return { sep, columns, ignored, rows };
}

/** The fields the import compares and the preview names, one per column group. */
const PLAN_FIELDS = ['title', 'date', 'text', 'link', 'image', 'imageAlt', 'imageStyle', 'price', 'memberPrice', 'badge', 'sizes', 'colors',
  'requireSize', 'requireColor', 'disableUntilChosen', 'quantity'];

const LINK_FIELDS = ['page', 'target', 'href', 'newTab', 'rel', 'download'];

/** The value a plan field compares, from an entry. */
function fieldOf(entry, field) {
  if (field === 'link') return LINK_FIELDS.map((f) => entry[f] ?? null);
  return entry[field] ?? null;
}

const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

/** An entry with a row's fields set over it; a field set to null is taken away. */
function withRow(entry, set) {
  const out = structuredClone(entry);
  for (const [field, value] of Object.entries(set)) {
    if (field === 'colors') {
      const before = out.colors ?? [];
      const names = value.names ?? before.map((c) => c.name);
      // Without a colorImages column a colour keeps the picture it had under its name.
      const colors = names.map((name, i) => {
        const image = value.images ? value.images[i] : before.find((c) => c.name === name)?.image;
        return image ? { name, image } : { name };
      });
      if (colors.length) out.colors = colors;
      else delete out.colors;
    } else if (field === 'quantity') {
      const was = out.quantity && typeof out.quantity === 'object' ? out.quantity : null;
      const on = value.on ?? (was !== null || value.min != null || value.max != null);
      if (!on) { delete out.quantity; continue; }
      const q = { ...(was ?? {}) };
      for (const key of ['min', 'max']) {
        if (value[key] === null) delete q[key];
        else if (value[key] !== undefined) q[key] = value[key];
      }
      out.quantity = q;
    } else if (value === null) {
      delete out[field];
    } else {
      out[field] = Array.isArray(value) ? [...value] : value && typeof value === 'object' ? { ...value } : value;
    }
  }
  return out;
}

/**
 * What an import will do, before anything is stored: each row matched to an entry by its id and named, and the entries the collection will hold.
 * A row with a problem is not stored; a row whose id is already taken by an earlier row of the file is not either; a row without an id, or with an id no entry has, is new.
 * @param {Array<object>} existing The collection's entries
 * @param {Array<{row: number, id: string, set: object, problem: object|null}>} rows From readCsv
 * @param {{matched?: 'update'|'skip', missing?: 'keep'|'remove'}} [options] What rows that match an entry do, and what becomes of the entries the file does not name
 * @param {(prefix: string) => string} [makeId] The id a new entry gets where its row has none it can keep
 * @returns {{items: Array<{status: string, row?: number, id: string, entry: object, before?: object, changes?: string[], problem?: object}>, counts: object, entries: object[]}}
 */
export function importPlan(existing, rows, { matched = 'update', missing = 'keep' } = {}, makeId = (prefix) => `${prefix}-new`) {
  const list = existing ?? [];
  const byId = new Map(list.map((e) => [e.id, e]));
  const named = new Set();
  const items = [];
  const updated = new Map();
  const added = [];
  const taken = new Set(list.map((e) => e.id));
  for (const r of rows ?? []) {
    if (r.problem) {
      // A refused row still names its entry, so the entry is neither changed nor counted as missing from the file.
      if (r.id) named.add(r.id);
      items.push({ status: 'refused', row: r.row, id: r.id, entry: { title: r.cells?.title ?? '' }, cells: r.cells, problem: r.problem });
      continue;
    }
    if (r.id && named.has(r.id)) {
      items.push({ status: 'refused', row: r.row, id: r.id, entry: { title: r.set.title }, cells: r.cells, problem: { key: 'repeatedId', column: 'id', value: r.id } });
      continue;
    }
    if (r.id) named.add(r.id);
    const before = r.id ? byId.get(r.id) : null;
    if (before) {
      const after = withRow(before, r.set);
      const changes = PLAN_FIELDS.filter((f) => !same(fieldOf(before, f), fieldOf(after, f)));
      if (!changes.length) items.push({ status: 'same', row: r.row, id: r.id, entry: before });
      else if (matched === 'skip') items.push({ status: 'skipped', row: r.row, id: r.id, entry: before, after, changes });
      else {
        items.push({ status: 'changed', row: r.row, id: r.id, entry: after, before, changes });
        updated.set(r.id, after);
      }
      continue;
    }
    const id = r.id && ID_RE.test(r.id) && !taken.has(r.id) ? r.id : makeId('entry');
    taken.add(id);
    const entry = withRow({ id }, r.set);
    added.push(entry);
    items.push({ status: 'new', row: r.row, id, entry });
  }
  for (const e of list) {
    if (!named.has(e.id)) items.push({ status: 'missing', id: e.id, entry: e });
  }
  const entries = [
    ...list.filter((e) => named.has(e.id) || missing !== 'remove').map((e) => updated.get(e.id) ?? e),
    ...added,
  ];
  const counts = { refused: 0, new: 0, changed: 0, skipped: 0, same: 0, missing: 0 };
  for (const item of items) counts[item.status] += 1;
  return { items, counts, entries };
}
