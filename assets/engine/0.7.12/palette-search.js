/**
 * The block search and the element menu's search: plain matching against the labels the menus show, ignoring case and diacritics.
 */

/** Comparable form: lower case without diacritical marks. */
export function normalize(str) {
  return String(str ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

/**
 * Ranking for the hit list: 0 the label starts with the query, 1 a word in it does, 2 it holds the query, -1 a miss.
 * An empty query ranks 2.
 */
export function rankLabel(label, query) {
  const q = normalize(query).trim();
  const l = normalize(label);
  if (!q) return 2;
  if (l.startsWith(q)) return 0;
  if (l.split(/[^a-z0-9]+/).some((word) => word.startsWith(q))) return 1;
  if (l.includes(q)) return 2;
  return -1;
}

/** True when the label matches the query (an empty query matches everything). */
export function matchLabel(label, query) {
  return rankLabel(label, query) >= 0;
}

/**
 * True when every word of the query occurs in the text, in any order; an empty query matches everything.
 */
export function matchWords(text, query) {
  const t = normalize(text);
  return normalize(query).split(/\s+/).filter(Boolean).every((word) => t.includes(word));
}

/**
 * Filters and ranks a list of entries against the query: best rank first, equal ranks in list order.
 * @param {Array<object>} items
 * @param {string} query
 * @param {(item: object) => string} getLabel
 */
export function searchItems(items, query, getLabel) {
  return items
    .map((item, i) => ({ item, i, rank: rankLabel(getLabel(item), query) }))
    .filter((x) => x.rank >= 0)
    .sort((a, b) => (a.rank - b.rank) || (a.i - b.i))
    .map((x) => x.item);
}
