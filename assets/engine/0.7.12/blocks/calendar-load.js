/**
 * What a calendar loads beyond its own drawing: its feeds, its parts, each design family's renderer, and the readying of them all before a page is drawn.
 * Notes: docs/engine-notes/blocks/calendar-load.md (Urd repository).
 */
import { ta, taApiError } from '../i18n.js';
import { loadStylesheet, placeInOrder } from '../sheets.js';
import { CALENDAR_FEED_MINUTES } from '../keep-minutes.js';

/* ---------- Fetching (proxy + short-lived cache) ---------- */

const CACHE_TTL = CALENDAR_FEED_MINUTES * 60 * 1000;

/** The feeds on their way, by address, so a calendar's readying and its drawing, or two calendars of one feed, share one request. */
const ASKING = new Map();

/**
 * A feed's text: the session's copy while it is fresh, else the request on its way for it, else a new one.
 * @param {string} url
 * @returns {Promise<string>}
 */
export async function fetchSource(url) {
  const key = `urd-cal-cache:${url}`;
  try {
    const cached = JSON.parse(sessionStorage.getItem(key) ?? 'null');
    if (cached && Date.now() - cached.t < CACHE_TTL) return cached.text;
    if (cached) sessionStorage.removeItem(key);
  } catch { /* a corrupt cache entry is ignored */ }
  if (!ASKING.has(url)) {
    const asking = askSource(url, key);
    ASKING.set(url, asking);
    asking.then(() => ASKING.delete(url), () => ASKING.delete(url));
  }
  return ASKING.get(url);
}

/** A feed fetched through the site's own route, kept for the minutes the privacy page names. */
async function askSource(url, key) {
  const res = await fetch(`/api/ics?url=${encodeURIComponent(url)}`);
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    // The route answers every failure in JSON: a 404 without it is the route itself missing, as on a local server, where the site's functions do not run.
    if (!body && res.status === 404) throw new Error(ta('calendar.noRoute'));
    throw new Error(taApiError(body) ?? ta('calendar.feedStatus', { status: res.status }));
  }
  const text = await res.text();
  try { sessionStorage.setItem(key, JSON.stringify({ t: Date.now(), text })); } catch { /* a full store is fine */ }
  return text;
}

/** The feeds a calendar's readying asked for, by address, each taken once by the first drawing that reads that feed. */
const READIED = new Map();

/**
 * The request a calendar's readying made for a feed, taken once; undefined where there is none.
 * @param {string} url
 * @returns {Promise<string>|undefined}
 */
export function takeReadied(url) {
  const asked = READIED.get(url);
  READIED.delete(url);
  return asked;
}

/* ---------- The parts and the renderers ---------- */

/** The calendar's sheets in the order their rules stand in: the shared one, then each design family's own, loaded with its renderer. */
const SHEETS = { calendar: './calendar.css', list: './calendar-list.css', cards: './calendar-cards.css', time: './calendar-time.css', retro: './calendar-retro.css', next: './calendar-next.css', more: './calendar-more.css' };

/** Loads one of the calendar's sheets in its place among the others, in the order SHEETS keeps, whatever order they come in. */
const loadSheet = (name) => loadStylesheet(new URL(SHEETS[name], import.meta.url).href, placeInOrder('calendar', Object.keys(SHEETS).indexOf(name)));

/** The renderer module of each design family, loaded when a calendar draws one, by literal paths outside the visitor closure and the preload list. */
export const DESIGN_MODULES = { plain: () => import('./calendar-plain.js'), list: () => import('./calendar-list.js'), cards: () => import('./calendar-cards.js'), time: () => import('./calendar-time.js'), next: () => import('./calendar-next.js'), more: () => import('./calendar-more.js'), retro: () => import('./calendar-retro.js') };

/** The parts once they are in, and the renderer modules loaded, by name, so a calendar whose code is all in draws in the page's own task. */
export let partsIn = null;
export const designsIn = new Map();

/** The parser, the design model, the formats, the links and calendar.css every calendar draws with, loaded together and kept once in. */
export const calendarParts = () => Promise.all([import('../ics.js'), import('../calendar-designs.js'), import('../calendar-format.js'), import('../map-links.js'), import('../meeting-links.js'), loadSheet('calendar')]).then((parts) => (partsIn = parts));

/** A renderer module by its name in DESIGN_MODULES, with its family's sheet, kept once both are in. */
export const loadDesign = (name) => (DESIGN_MODULES[name] ? Promise.all([DESIGN_MODULES[name](), SHEETS[name] ? loadSheet(name) : null]).then(([mod]) => {
  designsIn.set(name, mod);
  return mod;
}) : undefined);

/** The renderer modules a calendar draws with, by name: its design's, the switcher's week strip, and its phone's and its card's design where they have one. */
export const designModules = (cd, props) => [cd.calDesign(props.design).module, cd.calSwitcher(props) ? 'time' : null, cd.calPhoneDesignDef(cd.calPhoneView(props), props).module, cd.calCardDesignDef(cd.calCardDesign(props)).module, drawsPlain(cd, props) ? 'plain' : null];

/**
 * Whether a calendar draws with the plain views: a design without a renderer, the switcher's plain month, or on a phone the stacked agenda or a look without one.
 * @returns {boolean}
 */
function drawsPlain(cd, props) {
  const design = cd.calDesign(props.design);
  if (!design.module) return true;
  if (cd.calSwitcher(props) && cd.calSwitcherViews(props).month === 'month') return true;
  const phoneView = cd.calPhoneView(props);
  if (phoneView === design.id) return false;
  const phoneDef = cd.calPhoneDesignDef(phoneView, props);
  return !phoneDef.look || !phoneDef.module;
}

/**
 * Readies a calendar's parts, rules, renderers and feeds before the page is drawn, so it stands in its own design at once; the page never waits for a feed.
 * @param {object} props
 * @param {{site?: object}} ctx
 * @returns {Promise<void>}
 */
export async function prepareCalendar(props, ctx) {
  const [ics, cd] = await Promise.all([import('../ics.js'), import('../calendar-designs.js')]);
  for (const entry of ics.resolveSources(props.sources, ctx?.site?.site?.calendars)) {
    const url = ics.normalizeSourceUrl(entry.url);
    if (!url || READIED.has(url)) continue;
    const asked = fetchSource(url);
    asked.catch(() => {});
    READIED.set(url, asked);
  }
  // The rules and the renderers come in one wave, the parser and the design model having come with this module (CORE_BLOCK_READY in core-types.js).
  await Promise.all([calendarParts(), ...designModules(cd, props).map((name) => (name ? loadDesign(name) : null))]);
}
