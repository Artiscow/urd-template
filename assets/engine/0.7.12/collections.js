/**
 * Collections (the data block pattern, ADR-0007): fetching a collection, and DOM-free helpers that the collection block (blocks/collection.js) uses.
 * Notes: docs/engine-notes/collections.md (Urd repository).
 */
import { dates } from './i18n.js';

/**
 * Sorts entries newest date first (oldest when newestFirst is false); undated entries keep their order and come last. Never mutates the input.
 */
export function sortEntries(entries, newestFirst = true) {
  const dated = entries.filter((e) => e.date);
  const undated = entries.filter((e) => !e.date);
  dated.sort((a, b) => (newestFirst ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date)));
  return [...dated, ...undated];
}

/**
 * Groups entries by the year of their date, newest year first and each group newest first; undated entries form the last group, with year null.
 * @returns {Array<{year: string|null, entries: object[]}>}
 */
export function groupByYear(entries) {
  const groups = new Map();
  for (const entry of sortEntries(entries, true)) {
    const year = entry.date ? entry.date.slice(0, 4) : null;
    if (!groups.has(year)) groups.set(year, []);
    groups.get(year).push(entry);
  }
  return [...groups.entries()].map(([year, list]) => ({ year, entries: list }));
}

/**
 * Badge parts {day, month, year} from a YYYY-MM-DD date, the month's short name in the visitor's language; null for another shape or a month outside 1-12.
 */
export function dateBadge(date) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date ?? '');
  if (!m) return null;
  const monthIndex = Number(m[2]) - 1;
  if (monthIndex < 0 || monthIndex > 11) return null;
  return { day: String(Number(m[3])), month: dates().monthsShort[monthIndex], year: m[1] };
}

/** Draft override from the editor (the urd-collections message, or the drafts the draft view reads): id → collection data. */
let draftCollections = null;

export function setCollectionsDraft(collections) {
  draftCollections = collections;
  fetched.clear();
}

/**
 * Whether the editor's collection drafts hold a collection of a kind, as the shop gate reads it (block-palette.js shopOn): false before the drafts arrive.
 * @param {string} kind
 * @returns {boolean}
 */
export function draftHasKind(kind) {
  return Boolean(draftCollections) && Object.values(draftCollections).some((c) => c?.kind === kind);
}

/** Fetched collections are cached per page load (id → Promise<data|null>). */
const fetched = new Map();

/**
 * Fetches a collection: an editor draft wins (preview, draft view), else the server file; a missing or invalid file gives null, the block's empty state.
 */
export function getCollection(id) {
  if (draftCollections && Object.hasOwn(draftCollections, id)) {
    return Promise.resolve(draftCollections[id]);
  }
  if (!fetched.has(id)) {
    fetched.set(id, fetch(`/content/samlinger/${encodeURIComponent(id)}.json`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => (data && Array.isArray(data.entries) ? data : null))
      .catch(() => null));
  }
  return fetched.get(id);
}
