/**
 * Search in every language (0.7.10.5): a word typed in any of the admin's built-in languages finds the labels the menus show in the current one, so «kalender» finds «Calendar» in an English menu and «calendar» finds «Kalender» in a Norwegian one.
 * The searches still match the words the menus show (palette-search.js); this module adds, for each word typed, the labels it stands for in the admin language.
 * A word stands for a label when, in some language, the label's string has a word that starts with it, or holds it inside a compound once the word is five letters long («farge» in «Tekstfarge»).
 * Only short strings count as labels; the words of a sentence (a tooltip, a hint) would find too much.
 * A label found this way matches the menu's text only where it starts a word there, and a label shorter than four letters only as a whole word, so «Mål» found for «size» does not match inside «Normal»; a label of one or two letters is not used.
 * The admin dictionaries are loaded on the first search, from the absolute paths initAdminLocale uses, so a language already loaded is not fetched again.
 * The core is pure (buildIndex, makeLanguageSearch) and node-tested with plain dictionaries; the menus use the bound functions below.
 */
import { SUPPORTED_LANGS, ta } from './i18n.js';
import { normalize, rankLabel, matchWords } from './palette-search.js';

/** A string longer than this is a sentence, not a label. */
const LABEL_MAX = 48;
/** A typed word shorter than this finds nothing in other languages. */
const TERM_MIN = 3;
/** From this length a typed word is also found inside a compound word. */
const COMPOUND_MIN = 5;
/** A label found through another language that is shorter than this is not used. */
const LABEL_MIN = 3;
/** A label found through another language that is shorter than this matches only as a whole word. */
const WHOLE_BELOW = 4;

/**
 * The index: per key, its label strings in every language, normalised.
 * Strings with a {var} placeholder are left out, since their words are partly not there.
 * @param {Array<Record<string, string>>} dicts
 * @returns {Array<{key: string, texts: string[]}>}
 */
export function buildIndex(dicts) {
  const byKey = new Map();
  for (const dict of dicts) {
    for (const [key, value] of Object.entries(dict ?? {})) {
      if (typeof value !== 'string' || value.length > LABEL_MAX || value.includes('{')) continue;
      const text = normalize(value).trim();
      if (!text) continue;
      if (!byKey.has(key)) byKey.set(key, new Set());
      byKey.get(key).add(text);
    }
  }
  return [...byKey].map(([key, texts]) => ({ key, texts: [...texts] }));
}

/** Whether a label string holds the typed word: a word in it starts with the term, or, for a longer term, the string holds it. */
function holds(text, term) {
  if (term.length >= COMPOUND_MIN && text.includes(term)) return true;
  return text.split(/[^\p{L}\p{N}]+/u).some((word) => word.startsWith(term));
}

const WORD_CHAR = /[\p{L}\p{N}]/u;

/**
 * Where a label found through another language stands in a menu's text, both normalised: 0 at the start of the text, 1 at the start of a later word, -1 nowhere.
 * A label shorter than WHOLE_BELOW must also end where a word ends.
 */
function atWord(text, label) {
  const whole = label.length < WHOLE_BELOW;
  for (let i = text.indexOf(label); i >= 0; i = text.indexOf(label, i + 1)) {
    const end = i + label.length;
    if ((i === 0 || !WORD_CHAR.test(text[i - 1])) && (!whole || end >= text.length || !WORD_CHAR.test(text[end]))) return i === 0 ? 0 : 1;
  }
  return -1;
}

/**
 * The search functions over an index, with the labels read in the current language.
 * @param {Array<{key: string, texts: string[]}>} index
 * @param {(key: string) => string} current The key's string in the admin language
 */
export function makeLanguageSearch(index, current) {
  const cache = new Map();

  /** The labels in the current language that a typed term stands for, normalised. */
  const labelsFor = (term) => {
    const t = normalize(term).trim();
    if (t.length < TERM_MIN) return [];
    if (cache.has(t)) return cache.get(t);
    const out = new Set();
    for (const { key, texts } of index) {
      if (!texts.some((text) => holds(text, t))) continue;
      const label = current(key);
      if (label && label !== key) out.add(normalize(label).trim());
    }
    const list = [...out].filter((label) => label.length >= LABEL_MIN);
    cache.set(t, list);
    return list;
  };

  /**
   * Whether the text matches the query: every word found in it as typed (matchWords), the whole query standing for a label it holds at a word, or, word by word, each word found as typed or through a label it stands for.
   * @param {string} text
   * @param {string} query
   */
  const matchAny = (text, query) => {
    if (matchWords(text, query)) return true;
    const t = normalize(text);
    if (labelsFor(query).some((label) => atWord(t, label) >= 0)) return true;
    const words = normalize(query).split(/\s+/).filter(Boolean);
    return words.length > 1 && words.every((word) => t.includes(word) || labelsFor(word).some((label) => atWord(t, label) >= 0));
  };

  /**
   * The rank of a label for the query (palette-search.js rankLabel): a hit as typed ranks first (0 to 2), a hit through another language after it (3 at the label's start, 4 at a later word), -1 is a miss.
   * @param {string} label
   * @param {string} query
   */
  const rankAny = (label, query) => {
    const direct = rankLabel(label, query);
    if (direct >= 0 || !normalize(query).trim()) return direct;
    let best = -1;
    const l = normalize(label);
    for (const alt of labelsFor(query)) {
      const r = atWord(l, alt);
      if (r >= 0 && (best < 0 || r < best)) best = r;
    }
    return best >= 0 ? 3 + best : -1;
  };

  /**
   * Filter and rank a list against the query, as searchItems in palette-search.js does, with the hits through other languages after the hits as typed.
   * @param {Array<object>} items
   * @param {string} query
   * @param {(item: object) => string} getLabel
   */
  const searchItemsAny = (items, query, getLabel) => items
    .map((item, i) => ({ item, i, rank: rankAny(getLabel(item), query) }))
    .filter((x) => x.rank >= 0)
    .sort((a, b) => (a.rank - b.rank) || (a.i - b.i))
    .map((x) => x.item);

  return { labelsFor, matchAny, rankAny, searchItemsAny };
}

/* ---------- The runtime: the dictionaries loaded once, the functions bound to the admin language ---------- */

let search = makeLanguageSearch([], ta);
let loading = null;
let ready = false;

/**
 * Loads every built-in admin dictionary once and builds the index; a language that fails to load is left out.
 * @returns {Promise<void>}
 */
export function loadSearchLanguages() {
  loading ??= Promise.all(SUPPORTED_LANGS.map(async (code) => {
    try {
      return (await import(/* @vite-ignore */ `/assets/urd/locales/admin/${code}.js`)).default.strings;
    } catch {
      return null;
    }
  })).then((dicts) => {
    search = makeLanguageSearch(buildIndex(dicts.filter(Boolean)), ta);
    ready = true;
  });
  return loading;
}

/** Whether the other languages are loaded; until then the searches match as typed. */
export function searchLanguagesReady() { return ready; }

/** matchWords across the languages (see makeLanguageSearch). */
export function matchAny(text, query) { return search.matchAny(text, query); }

/** searchItems across the languages (see makeLanguageSearch). */
export function searchItemsAny(items, query, getLabel) { return search.searchItemsAny(items, query, getLabel); }
