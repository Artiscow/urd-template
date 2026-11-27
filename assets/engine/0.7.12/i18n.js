/**
 * The multilingual core (ADR-0012): t() for visitor texts and ta() for the admin, each over the bokmål base; dates, plurals and relative time through Intl.
 * Notes: docs/engine-notes/i18n.md (Urd repository).
 */
import nb from './locales/site/nb.js';

/** The languages that ship with Urd; the parity test keeps the files in sync.
 *  More languages can be added as language-pack plugins (language-packs.js). */
export const SUPPORTED_LANGS = ['nb', 'nn', 'en-GB', 'se', 'tr'];

/**
 * The shape of a language code (nb, se, en-GB): a code of this shape the engine lacks may be a language pack's; requestedLang reads anything else as bokmål.
 */
export const LANG_CODE_RE = /^[a-z]{2,3}(?:-[A-Za-z0-9]{2,8})*$/;

/* The tags that mean each built-in language, ISO 639-1 and -3 alike, so 'nob' reads as bokmål and never as a pack's; sma and smj read as Northern Sami. */
const LANG_TAGS = {
  nb: ['no', 'nor', 'nb', 'nob'],
  nn: ['nn', 'nno'],
  se: ['se', 'sme', 'smj', 'sma'],
  tr: ['tr', 'tur'],
  'en-GB': ['en', 'eng'],
};

/**
 * Matches a language tag (site.lang, navigator.language) against the built-in languages, whole or with subtags ('nb-NO' is bokmål, 'nbx' is not); else null.
 * @param {unknown} raw
 * @returns {string|null}
 */
export function matchLang(raw) {
  const v = String(raw ?? '').trim().toLowerCase();
  for (const [lang, tags] of Object.entries(LANG_TAGS)) {
    if (tags.some((tag) => v === tag || v.startsWith(`${tag}-`))) return lang;
  }
  return null;
}

/**
 * Is the code one of Urd's built-in languages?
 * Language packs (language-packs.js) can never override them: a plugin must not be able to hijack bokmål.
 */
export function isBuiltinLang(code) {
  return SUPPORTED_LANGS.includes(String(code ?? ''));
}

/**
 * Validates a plugin manifest's `languages` list as schema/plugin.schema.json does: a valid code not built in, an own name, and `site`, `admin` or both.
 * @param {unknown} list
 * @returns {string[]} Error messages; empty list = valid.
 */
export function validateLanguages(list) {
  const errors = [];
  if (!Array.isArray(list)) return ['languages must be a list'];
  for (const entry of list) {
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
      errors.push('languages: every entry must be an object');
      continue;
    }
    const code = String(entry.code ?? '');
    if (!LANG_CODE_RE.test(code)) errors.push(`languages: '${code}' is not a valid language code`);
    else if (isBuiltinLang(code)) errors.push(`languages: '${code}' is built into Urd and cannot be overridden`);
    if (typeof entry.name !== 'string' || !entry.name.trim()) errors.push(`languages/${code}: name is missing (the language's own name)`);
    for (const kind of ['site', 'admin']) {
      if (entry[kind] !== undefined && typeof entry[kind] !== 'boolean') errors.push(`languages/${code}: ${kind} must be a boolean`);
    }
    if (entry.site !== true && entry.admin !== true) errors.push(`languages/${code}: must cover site, admin or both`);
  }
  return errors;
}

/**
 * The language a value ASKS for: a built-in match first, otherwise a code that may belong to a language pack (kept as-is), otherwise bokmål.
 * @param {unknown} raw
 * @returns {string}
 */
export function requestedLang(raw) {
  const hit = matchLang(raw);
  if (hit) return hit;
  const v = String(raw ?? '').trim();
  return LANG_CODE_RE.test(v) ? v : 'nb';
}

/**
 * Fetches a language pack's site or admin strings through language-packs.js, imported at runtime by its absolute path; null when that fails.
 * @param {string} code
 * @param {'site'|'admin'} kind
 * @returns {Promise<Record<string, string>|null>}
 */
async function loadPack(code, kind) {
  try {
    const mod = await import(/* @vite-ignore */ '/assets/urd/language-packs.js');
    return await mod.loadPackStrings(code, kind);
  } catch {
    return null;
  }
}

// `own` holds the site language's strings alone, without the bokmål base, for look-ups that ask whether it has a word of its own (themeString, siteTextLang).
const site = { lang: 'nb', dict: { ...nb.strings }, own: nb.strings, dates: null };
const admin = { lang: 'nb', dict: {} };

/** {var} interpolation: simple and predictable, no ICU syntax. */
function format(str, params) {
  if (!params) return str;
  let out = str;
  for (const [k, v] of Object.entries(params)) out = out.replaceAll(`{${k}}`, String(v));
  return out;
}

/** Visitor text (follows site.lang). */
export function t(key, params) {
  return format(site.dict[key] ?? key, params);
}

/** Admin text (follows the admin language). */
export function ta(key, params) {
  return format(admin.dict[key] ?? key, params);
}

/**
 * The plural form a count takes in the visitor language and its key: the Intl.PluralRules category, or 'other' when that category has no key and `other` has one.
 */
export function pluralForm(baseKey, n) {
  let cat = 'other';
  try { cat = new Intl.PluralRules(site.lang).select(n); } catch { /* unknown language: other */ }
  const form = site.dict[`${baseKey}.${cat}`] !== undefined || site.dict[`${baseKey}.other`] === undefined ? cat : 'other';
  return { form, key: `${baseKey}.${form}` };
}

/**
 * A design's words for a text, placeholders left in: the theme key, then the common key, in the site's own language, then in bokmål; a form's key before `other`.
 * @param {string} themeKey The design's own key
 * @param {string} baseKey The common key the text falls back to
 * @param {string|null} [form] The plural form (pluralForm), for a text with forms
 * @returns {string}
 */
export function themeString(themeKey, baseKey, form) {
  const keysOf = (key) => (form ? [`${key}.${form}`, `${key}.other`] : [key]);
  for (const dict of [site.own, nb.strings]) {
    for (const key of [...keysOf(themeKey), ...keysOf(baseKey)]) {
      if (dict[key] !== undefined) return dict[key];
    }
  }
  return baseKey;
}

/**
 * The language a site text is written in: the site's own where its own dictionary has the key, else bokmål; for words formatted beside the text by Intl.
 * @param {string} key
 */
export function siteTextLang(key) {
  return site.own[key] !== undefined ? site.lang : 'nb';
}

/**
 * Plural lookup: the key of the count's plural form (pluralForm).
 * The count is always available as {n}.
 */
export function tp(baseKey, n, params) {
  const { key } = pluralForm(baseKey, n);
  return format(site.dict[key] ?? key, { ...params, n });
}

/**
 * Translates a functions error response: its `code` as `api.<code>`, filled with the response's own fields, else its `error` text, else null.
 */
export function taApiError(data) {
  const key = `api.${data?.code}`;
  if (data?.code && admin.dict[key] !== undefined) return format(admin.dict[key], data);
  return data?.error ?? null;
}

export function siteLang() { return site.lang; }
export function adminLang() { return admin.lang; }

/** Plugins add their visitor strings here (keys prefixed with the plugin id). */
export function addSiteDict(strings) { Object.assign(site.dict, strings ?? {}); }
/** Plugins and the admin locale files add admin strings here. */
export function addAdminDict(strings) { Object.assign(admin.dict, strings ?? {}); }

/**
 * Loads the visitor language, a built-in language's file or a language pack's strings, by runtime import; bokmål when it fails. Returns the language in use.
 */
export async function initSiteLocale(rawLang) {
  const lang = requestedLang(rawLang);
  let strings = null;
  if (lang !== 'nb') {
    if (isBuiltinLang(lang)) {
      try {
        strings = (await import(/* @vite-ignore */ `./locales/site/${lang}.js`)).default.strings;
      } catch { /* missing language file: the bokmål base stays */ }
    } else {
      strings = await loadPack(lang, 'site');
    }
  }
  // The dictionary is swapped in one go once the strings are in hand: a fresh copy of the bokmål base with the language's strings on top.
  site.lang = lang === 'nb' || strings ? lang : 'nb';
  site.dict = { ...nb.strings, ...(strings ?? {}) };
  site.own = strings ?? nb.strings;
  site.dates = null;
  return site.lang;
}

/**
 * The admin language: a choice stored in localStorage 'urd-admin-lang', even a pack's code, else the first device language matching a built-in one, else English.
 */
export function detectAdminLang() {
  let stored = null;
  try { stored = localStorage.getItem('urd-admin-lang'); } catch { /* private mode */ }
  if (stored) return requestedLang(stored);
  for (const cand of navigator.languages ?? [navigator.language]) {
    const hit = matchLang(cand);
    if (hit) return hit;
  }
  return 'en-GB';
}

/**
 * `adminLocaleReady` resolves with the admin language once initAdminLocale has run; preview chrome drawn before then waits on it before calling ta().
 */
let adminLocaleReadyResolve;
export const adminLocaleReady = new Promise((resolve) => { adminLocaleReadyResolve = resolve; });

/**
 * Loads the admin dictionary by runtime import: the chosen language, built in or a language pack's, over the bokmål base; a pack that fails leaves bokmål.
 */
export async function initAdminLocale(lang = detectAdminLang()) {
  const load = (code) => import(/* @vite-ignore */ `/assets/urd/locales/admin/${code}.js`).then((m) => m.default.strings, () => null);
  admin.lang = requestedLang(lang);
  const builtin = isBuiltinLang(admin.lang);
  const ownWords = !builtin ? loadPack(admin.lang, 'admin') : admin.lang !== 'nb' ? load(admin.lang) : null;
  const [base, own] = await Promise.all([load('nb'), ownWords]);
  // Without a dictionary the keys are shown; the app must never die from this.
  if (base) Object.assign(admin.dict, base);
  if (own) Object.assign(admin.dict, own);
  else if (!builtin) admin.lang = 'nb';
  adminLocaleReadyResolve(admin.lang);
  return admin.lang;
}

/* Date names from Intl for a language, weekdays from Monday and short names without a closing period; the bokmål tables where Intl lacks the language. */
function buildDates(lang) {
  try {
    if (!Intl.DateTimeFormat.supportedLocalesOf([lang]).length) return nb.dates;
    const fmt = (opts) => new Intl.DateTimeFormat(lang, opts);
    const strip = (s) => s.replace(/\.$/, '');
    const months = [];
    const monthsShort = [];
    for (let m = 0; m < 12; m++) {
      const d = new Date(Date.UTC(2026, m, 15, 12));
      months.push(fmt({ month: 'long', timeZone: 'UTC' }).format(d));
      monthsShort.push(strip(fmt({ month: 'short', timeZone: 'UTC' }).format(d)));
    }
    const weekdays = [];
    const weekdaysShort = [];
    for (let i = 0; i < 7; i++) {
      // January 5, 2026 is a Monday.
      const d = new Date(Date.UTC(2026, 0, 5 + i, 12));
      weekdays.push(fmt({ weekday: 'long', timeZone: 'UTC' }).format(d));
      weekdaysShort.push(strip(fmt({ weekday: 'short', timeZone: 'UTC' }).format(d)));
    }
    return { months, monthsShort, weekdays, weekdaysShort };
  } catch {
    return nb.dates;
  }
}

/** @returns {{months: string[], monthsShort: string[], weekdays: string[], weekdaysShort: string[]}} */
export function dates() {
  site.dates ??= buildDates(site.lang);
  return site.dates;
}

/** Relative day count («om 3 døgn»/«3 jándora maŋŋilit»); fallback = the raw number. */
export function relativeDays(days) {
  try {
    return new Intl.RelativeTimeFormat(site.lang, { numeric: 'auto' }).format(days, 'day');
  } catch {
    return String(days);
  }
}
