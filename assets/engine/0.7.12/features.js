/**
 * The boot's own features, each with the modules it draws with (ADR-0036): a visitor's page loads the features its site and page hold, the preview all.
 * Notes: docs/engine-notes/features.md (Urd repository).
 */
import { pageTypes } from './plugins.js';
import { navHidden, hideMode } from './nav-model.js';
import { pageBlocks, beside } from './core-types.js';
import { loadEngineSheet } from './sheets.js';

/** The core animations' ids (animations/core.js), reserved as the engine's own before their module loads. */
export const CORE_ANIMATION_IDS = ['fade-in', 'slide-up', 'zoom-in', 'hover-lift', 'stagger'];

/** A feature's parts once its sheet is in too; a sheet that fails leaves the feature drawing without it. */
const withSheet = (main, sheet) => Promise.all([main, loadEngineSheet(sheet)]).then(([parts]) => parts);

/** The boot's features, each loading to the parts the engine draws it with. */
export const CORE_FEATURES = {
  shop: () => withSheet(import('./shop.js'), 'nav-cart.css'),
  launcher: () => withSheet(import('./nav-launcher.js'), 'nav-launcher.css'),
  contact: () => beside(import('./contact-model.js'), import('./contact-profiles.js'), import('./contact-checks.js')),
  footer: () => withSheet(Promise.all([import('./footer.js'), import('./footer-model.js')]).then(([view, model]) => ({ renderFooter: view.renderFooter, whenSettled: model.whenSettled, FOOTER_WAIT_MS: model.FOOTER_WAIT_MS })), 'footer.css'),
  sticky: () => Promise.all([import('./sticky.js'), import('./sticky-model.js')]).then(([pins, model]) => ({ ...model, ...pins })),
  animations: () => import('./animations/core.js'),
  divider: () => import('./divider-model.js'),
  totop: () => withSheet(import('./totop.js'), 'totop.css'),
  shape: () => import('./shape-model.js'),
  collections: () => import('./collections.js'),
};

/** Each feature's loading, by name, settled once its parts are in or it failed. */
const jobs = new Map();

/** Each loaded feature's parts, by name. */
const parts = new Map();

/** The definer each animation registry handed back when the core ids were reserved (reserveCoreAnimations). */
const DEFINERS = new WeakMap();

/**
 * A feature's parts once loaded; null while it is not, or when it could not be, so the page draws without it.
 * @param {keyof typeof CORE_FEATURES} name
 * @returns {any}
 */
export function feature(name) {
  return parts.get(name) ?? null;
}

/**
 * Reserves the core animations' ids as the engine's own, so no plugin can take one; they are defined as their module loads.
 * @param {typeof window.Urd} Urd
 */
export function reserveCoreAnimations(Urd) {
  DEFINERS.set(Urd.animations, Urd.animations.reserve(CORE_ANIMATION_IDS));
}

/**
 * Loads the features named, or every feature with `all`; settles once each is in or has failed, a failure warned and left out.
 * @param {typeof window.Urd} Urd
 * @param {Iterable<string>|null} names
 * @param {{all?: boolean}} [options]
 * @returns {Promise<void>}
 */
export async function loadFeatures(Urd, names, { all = false } = {}) {
  const asked = all ? Object.keys(CORE_FEATURES) : [...new Set(names ?? [])].filter((name) => Object.hasOwn(CORE_FEATURES, name));
  await Promise.all(asked.map((name) => {
    if (!jobs.has(name)) {
      jobs.set(name, CORE_FEATURES[name]().then((loaded) => { parts.set(name, loaded); }, (err) => {
        console.warn(`Urd: the feature '${name}' could not be loaded`, err);
      }));
    }
    return jobs.get(name);
  }));
  const animations = parts.get('animations');
  const define = DEFINERS.get(Urd.animations);
  if (animations && define) {
    for (const [id, def] of Object.entries(animations.coreAnimations)) if (!Urd.animations.ids().includes(id)) define(id, def);
  }
}

/**
 * Whether a value holds anything: a string with characters, a number, true, or a list or object holding one.
 * @param {unknown} value
 * @param {number} [depth]
 */
function holdsValue(value, depth = 0) {
  if (typeof value === 'string') return value !== '';
  if (typeof value === 'number') return Number.isFinite(value);
  if (value === true) return true;
  if (!value || typeof value !== 'object' || depth > 8) return false;
  return Object.values(value).some((child) => holdsValue(child, depth + 1));
}

/**
 * The features a site holds on a page: the menu's basket and launcher, contact details, the back-to-top button and its shape, the footer where it shows.
 * @param {object} site
 * @param {string|null} pageId
 * @returns {Set<string>}
 */
export function siteFeatures(site, pageId) {
  const held = new Set();
  // The menu's basket and launcher stand only where the menu is drawn: a page it is kept off in the hidden mode draws neither (nav.js).
  const menuDrawn = !(navHidden(site?.nav, pageId) && hideMode(site?.nav) === 'hidden');
  if (menuDrawn && site?.nav?.cart?.show) held.add('shop');
  if (menuDrawn && site?.nav?.launcher?.show === true) held.add('launcher');
  if (holdsValue(site?.site?.contact)) held.add('contact');
  const toTop = site?.layout?.toTop;
  if (!(toTop && typeof toTop === 'object' && toTop.show === false)) {
    held.add('totop');
    if (toTop?.shape && typeof toTop.shape === 'object' && !Array.isArray(toTop.shape)) held.add('shape');
  }
  const footer = site?.footer;
  if (footer?.show && !(pageId && Array.isArray(footer.hideOn) && footer.hideOn.includes(pageId))) held.add('footer');
  return held;
}

/**
 * The features a page holds with the site's menu and footer: animations, pinned blocks and section dividers.
 * @param {object} page
 * @param {object} site
 * @returns {Set<string>}
 */
export function pageFeatures(page, site) {
  const held = new Set();
  if (pageTypes(page, site?.nav, site?.footer).animations.size) held.add('animations');
  if (pageBlocks(page, site?.footer).some((block) => block.sticky)) held.add('sticky');
  const edges = (section) => [section?.divider?.top, section?.divider?.bottom];
  if ((Array.isArray(page?.sections) ? page.sections : []).some((section) => edges(section).some((edge) => typeof edge?.shape === 'string' && edge.shape))) held.add('divider');
  return held;
}
