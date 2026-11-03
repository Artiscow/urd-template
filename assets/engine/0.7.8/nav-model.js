/**
 * Pure nav logic: classifying menu items, page-register lookups and
 * appearance computation. No DOM - the module is node-importable and
 * covered by tests/nav.test.mjs; the DOM building lives in nav.js.
 */

import { resolveColor } from './theme.js';

// Safe image source: only known image shapes (a base64 data URL for
// unpublished uploads, a site-relative path to media/, or the site's own
// picture route for a shared folder, which is the one place a query string is
// allowed and which never serves anything but an image from a checked host)
// are let into img.src and CSS url(); everything else (external hosts,
// characters that break url("…")) is ignored. Anchored regex on purpose -
// CodeQL recognizes it as a barrier. Shared guard for the favicon, nav logo
// and background, footer logo, icon block and the image layer.
const SAFE_IMAGE_RE = /^(?:data:image\/[\w.+-]+;base64,[A-Za-z0-9+/=]+|\/api\/photo\?[^\s"'<>\\]{1,2048}|\/(?!\/)[\w%./-]*)$/;

/** @param {unknown} src @returns {boolean} */
export function isSafeImage(src) {
  return typeof src === 'string' && SAFE_IMAGE_RE.test(src);
}

// Safe link URL for nav/footer links (item.href): only http(s), mailto and
// tel, like the footer social links. javascript:/data: and everything else
// is rejected, so an untouched href can never become an active URL.
// Anchored regex on purpose - CodeQL recognizes it as a barrier. Internal
// pages are linked via `page`, not href.
const SAFE_URL_RE = /^(?:https?:\/\/|mailto:|tel:)[^\s]+$/i;

/** @param {unknown} url @returns {boolean} */
export function isSafeUrl(url) {
  return typeof url === 'string' && SAFE_URL_RE.test(url.trim());
}

// Safe block href (button/image/collection/gallery): in addition to the
// external schemes above, site-internal paths ('/...', never
// protocol-relative '//...') and anchors ('#...') are accepted, as the
// collection schema documents for entry.href. Backslash is rejected in the
// path branch: browsers normalize '\' to '/' in http(s) URLs, so '/\evil.no'
// would otherwise become protocol-relative anyway. Anchored regex on
// purpose - CodeQL recognizes it as a barrier.
const SAFE_INTERNAL_RE = /^(?:\/(?![/\\])[^\s\\]*|#[^\s]*)$/;

/** @param {unknown} url @returns {boolean} */
export function isSafeHref(url) {
  return isSafeUrl(url) || (typeof url === 'string' && SAFE_INTERNAL_RE.test(url.trim()));
}

/** The words an owner may add to a link's rel; they count only for a link that leaves the site. */
export const LINK_RELS = ['nofollow', 'sponsored'];

// A link's `target`: the id of a section or block (or a name), the page schema's id shape.
// Anchored regex on purpose - CodeQL recognizes it as a barrier.
const LINK_TARGET_RE = /^[a-z0-9][a-z0-9-]{0,80}$/;

/**
 * Resolves one link, in the shape every host stores beside its own fields (additive from 0.7.27.3): `page` (a page id in the register), `target` (the id of a section or block on that page, or on this page when there is no `page`), `href` (an address: http(s), mailto, tel, or a path or a fragment of the site, through the safe-URL gate), `newTab` (open in a new tab), `rel` (a list of 'nofollow' and 'sponsored', which count only for a link that leaves the site) and `download` (save the file rather than open it, additive from 0.7.27.9, which counts only for a path on the site).
 * `page` wins over `href`, so the link follows a change of the page's address, and `target` holds the spot's id, so it follows a rename of the spot; the address shows the spot's name once the visitor has landed (urd.js).
 * An unknown page or an address that fails the gate gives '#' and the missing flag (the hosts log the warning - this module has no side effects).
 * `newTab`, `rel` and `download` appear only when set.
 * @param {{page?: string, target?: string, href?: string, newTab?: boolean, rel?: string[], download?: boolean}} link
 * @param {Array<{id: string, path: string}>} [pages] The page register (site.pages)
 * @returns {{href: string, external: boolean, missing: boolean, newTab?: true, rel?: string[], download?: true}}
 */
export function resolveLink(link, pages = []) {
  const extra = link?.newTab === true ? { newTab: true } : {};
  const fragment = typeof link?.target === 'string' && LINK_TARGET_RE.test(link.target) ? `#${link.target}` : '';
  if (link?.page) {
    // The page's own path passes the same gate: a register edited by hand never makes a link leave the site.
    const page = pages.find((p) => p.id === link.page);
    if (!page || !isSafeHref(page.path)) return { href: '#', external: false, missing: true };
    return { href: `${page.path}${fragment}`, external: false, missing: false, ...extra };
  }
  const href = typeof link?.href === 'string' ? link.href.trim() : '';
  if (!href && fragment) return { href: fragment, external: false, missing: false, ...extra };
  if (isSafeUrl(href)) {
    const rel = /^https?:\/\//i.test(href) && Array.isArray(link.rel) ? LINK_RELS.filter((word) => link.rel.includes(word)) : [];
    return { href, external: true, missing: false, ...extra, ...(rel.length ? { rel } : {}) };
  }
  if (isSafeHref(href)) {
    // A browser saves only a file from the site's own origin, so the wish counts for a path and nothing else.
    const save = link.download === true && href.startsWith('/') ? { download: true } : {};
    return { href, external: false, missing: false, ...extra, ...save };
  }
  return { href: '#', external: false, missing: true };
}

/**
 * The attributes a resolved link puts on its element: its address, a new tab, the rel words, and `download` for a file to save.
 * A link that leaves the site (http(s), mailto, tel) gets the host's own words (the menu's noopener, the footer's noopener noreferrer), a new tab gets noopener, and the owner's words come last.
 * @param {{href: string, external?: boolean, newTab?: boolean, rel?: string[], download?: boolean}} link A resolveLink result
 * @param {string[]} [external] The host's rel words for a link that leaves the site
 * @returns {{href: string, target?: string, rel?: string, download?: string}}
 */
export function linkAttrs(link, external = ['noopener']) {
  const rel = new Set([...(link.external ? external : []), ...(link.newTab ? ['noopener'] : []), ...(link.rel ?? [])]);
  return {
    href: link.href,
    ...(link.newTab ? { target: '_blank' } : {}),
    ...(rel.size ? { rel: [...rel].join(' ') } : {}),
    ...(link.download ? { download: '' } : {}),
  };
}

/**
 * Resolves a menu item against the page register through resolveLink: the item's label with the link's address, its flags, and a new tab and rel words when set.
 * An unknown page or unsafe href yields '#' with the missing flag.
 * @param {{label: string, page?: string, target?: string, href?: string, newTab?: boolean, rel?: string[]}} item
 * @param {Array<{id: string, path: string}>} pages The page register (site.pages)
 * @returns {{label: string, href: string, external: boolean, missing: boolean, newTab?: true, rel?: string[]}}
 */
export function resolveItem(item, pages) {
  return { label: item.label, ...resolveLink(item, pages) };
}

/**
 * Builds the menu model nav.js renders from. Each item gets a `kind`:
 * 'link' (plain link), 'split' (own target plus submenu: link plus arrow
 * button) or 'toggle' (submenu only: the whole item is the opener). The
 * submenu has two levels (additive from 0.7.13.21): a child may carry
 * children of its own, and anything deeper is ignored defensively. Every
 * item carries its `description` (one line under the label, '' without
 * one), and a top-level item its `look` ('button' for a call to action
 * drawn as a button, '' for a plain item).
 * @param {{nav: {items?: Array<object>}, pages?: Array<object>}} site
 * @returns {Array<{label: string, href: string, external: boolean, missing: boolean, kind: string, children: Array<object>, description: string, look: string}>}
 */
export function navItems(site) {
  const pages = site.pages ?? [];
  const model = (item, depth) => {
    const children = depth < 2 && Array.isArray(item.children)
      ? item.children.map((child) => model(child, depth + 1))
      : [];
    const hasTarget = !!(item.page || item.href || item.target);
    const kind = children.length === 0 ? 'link' : hasTarget ? 'split' : 'toggle';
    // A toggle item has no link of its own - resolveItem would flag it as
    // missing, so openers are modeled without an href.
    const own = kind === 'toggle'
      ? { label: item.label, href: '', external: false, missing: false }
      : resolveItem(item, pages);
    const description = typeof item.description === 'string' ? item.description.trim() : '';
    const look = depth === 0 && item.look === 'button' ? 'button' : '';
    return { ...own, kind, children, description, look };
  };
  return (site.nav.items ?? []).map((item) => model(item, 0));
}

/** The burger's drawings (nav.style.burger.icon); the first is the default, and `none` leaves the word to stand alone. */
export const BURGER_ICONS = ['lines', 'handle', 'dots', 'grid', 'none'];

/**
 * The burger as it is drawn (nav.style.burger, additive from 0.7.13.21): the icon id, whether the word stands beside it, and the owner's own word ('' for the translated default, which is nav.js's business).
 * An unknown icon gives the lines, and so does `none` without the word, so the button never stands empty.
 * @param {{burger?: {icon?: string, showLabel?: boolean, label?: string}}} [style] nav.style
 * @returns {{icon: string, showLabel: boolean, label: string}}
 */
export function burgerModel(style = {}) {
  const b = style?.burger;
  const showLabel = b?.showLabel === true;
  let icon = BURGER_ICONS.includes(b?.icon) ? b.icon : 'lines';
  if (icon === 'none' && !showLabel) icon = 'lines';
  return { icon, showLabel, label: showLabel && typeof b?.label === 'string' ? b.label.trim() : '' };
}

/**
 * Whether the menu stays off a page (nav.hideOn, additive from 0.7.13.21): the page ids the owner listed, read the way footer.js reads footer.hideOn.
 * @param {{hideOn?: string[]}} [nav] site.nav
 * @param {string} [pageId] The page being rendered
 * @returns {boolean}
 */
export function navHidden(nav, pageId) {
  return !!pageId && Array.isArray(nav?.hideOn) && nav.hideOn.includes(pageId);
}

/** How the menu stands on a page it is kept off (nav.hideMode); the first is the default. */
export const HIDE_MODES = ['hidden', 'hover', 'ghost', 'tab'];

/**
 * The way the menu is reached on a page listed in nav.hideOn (additive from 0.7.13.21): `hidden` (nothing), `hover` (the pointer at the top edge slides it in), `ghost` (the pointer at the top edge shows it faint, and it turns solid when the pointer rests on it) or `tab` (a pull tab at the top edge at all times).
 * Touch has no hover, so nav.js draws the tab for `hover` and `ghost` there too.
 * @param {{hideMode?: string}} [nav] site.nav
 * @returns {'hidden' | 'hover' | 'ghost' | 'tab'}
 */
export function hideMode(nav) {
  return HIDE_MODES.includes(nav?.hideMode) ? nav.hideMode : 'hidden';
}

/**
 * The pull tab as drawn (nav.tab, additive from 0.7.13.21): the owner's own mark (an uploaded image, else an icon id), word and colours, or the default tab (the burger lines in the menu's surface) when none is set.
 * The word and the colours are '' when unset; `custom` says whether any field is set.
 * @param {{tab?: {icon?: string, image?: string, label?: string, color?: string, textColor?: string}}} [nav] site.nav
 * @returns {{custom: boolean, icon: string, image: string, label: string, bg: string, color: string}}
 */
export function tabModel(nav) {
  const t = nav?.tab && typeof nav.tab === 'object' ? nav.tab : {};
  const out = {
    icon: typeof t.icon === 'string' ? t.icon : '',
    image: isSafeImage(t.image) ? t.image : '',
    label: typeof t.label === 'string' ? t.label.trim() : '',
    bg: t.color ? resolveColor(t.color) : '',
    color: t.textColor ? resolveColor(t.textColor) : '',
  };
  return { custom: Object.values(out).some(Boolean), ...out };
}

/**
 * Whether the submenu is laid out in columns (nav.style.subColumns above 1) or as the flyout: there a second level stands as a headed group under its item rather than as a panel beside it.
 * @param {{subStyle?: string, subColumns?: number}} [style] nav.style
 * @returns {boolean}
 */
export function subGrouped(style = {}) {
  return style?.subStyle === 'flyout' || Math.round(Number(style?.subColumns)) >= 2;
}

/** The launcher's three designs; grid is the default. */
export const LAUNCHER_VIEWS = ['grid', 'list', 'cover'];

/**
 * The tools in the cluster, in the order they stand unless the owner says
 * otherwise. The burger is not among them: it is the mobile menu's opener
 * and always ends the cluster.
 */
export const TOOL_IDS = ['launcher', 'cart', 'theme', 'links'];

/**
 * The cluster's order (nav.style.tools.order, additive since v0.7): the
 * owner's own order first, then whatever is left in the default order, so a
 * list that names one tool or an unknown one still yields every tool once.
 * @param {{tools?: {order?: Array<string>}}} [style] nav.style
 * @returns {Array<string>} Every id in TOOL_IDS, in drawing order
 */
export function toolOrder(style = {}) {
  const wanted = Array.isArray(style.tools?.order) ? style.tools.order : [];
  const out = [];
  for (const id of wanted) if (TOOL_IDS.includes(id) && !out.includes(id)) out.push(id);
  for (const id of TOOL_IDS) if (!out.includes(id)) out.push(id);
  return out;
}

/** Shortcuts in the mobile menu before «show more» takes the rest. */
export const LAUNCHER_MAX_BOUNDS = { min: 1, max: 24, dflt: 6 };

/**
 * @param {unknown} value
 * @returns {number} The value inside the bounds, or the default
 */
export function clampLauncherMax(value) {
  const { min, max, dflt } = LAUNCHER_MAX_BOUNDS;
  if (typeof value !== 'number' || !Number.isFinite(value)) return dflt;
  return Math.min(max, Math.max(min, Math.round(value)));
}

/** The launcher's sizes (nav.launcher.size): one choice that scales the panel, the marks and the names together. */
export const LAUNCHER_SIZES = { sm: 0.85, md: 1, lg: 1.2, xl: 1.4 };

/** The bounds of the launcher's own px values, each of which replaces its part of the size. */
export const LAUNCHER_BOUNDS = { width: { min: 160, max: 640 }, iconSize: { min: 16, max: 96 }, textSize: { min: 10, max: 24 } };

/** A px value within its bounds, or null when there is none. */
const launcherPx = (value, { min, max }) => (typeof value === 'number' && Number.isFinite(value) ? Math.min(max, Math.max(min, Math.round(value))) : null);

/**
 * The link launcher (nav.launcher, additive since v0.7): the shortcuts behind
 * the launcher button in the tool cluster, and the same shortcuts as a
 * section inside the mobile menu. null unless the button is shown; every
 * row is drawn, and a row whose target fails the menu links' guard gets '#'
 * and the missing flag, so the tile stands and goes nowhere, the way an
 * unknown page does in the menu. A row's mark is an uploaded image or an id from the
 * icon library; nav.js draws it, and neither leaves the tile with its label
 * alone. `view` is the design on the desktop and `mobileView` the one in
 * the mobile menu (omitted = the same design as the desktop). `title` is
 * empty when the heading is off, and the custom heading otherwise; the
 * translated default word is nav.js's business, not this module's.
 * @param {object} [launcher] site.nav.launcher
 * @param {Array<{id: string, path: string}>} [pages] The page register, for a row that links a page
 * @returns {{links: Array<object>, view: string, mobileView: string, mobileMax: number, title: string, titleShow: boolean, longNames: 'cut'|'wrap', size: string, width: number|null, iconSize: number|null, textSize: number|null, icon: string, image: string} | null}
 */
export function launcherModel(launcher, pages = []) {
  if (launcher?.show !== true) return null;
  const rows = Array.isArray(launcher.links) ? launcher.links : [];
  // Every row the owner has added is drawn: the launcher stands as soon as it
  // is switched on, and a row whose target is not a usable link gets '#' with
  // the missing flag, exactly as a menu item pointing at an unknown page does.
  const links = rows.map((row) => ({
    label: typeof row?.label === 'string' ? row.label.trim() : '',
    ...resolveLink(row, pages),
    icon: typeof row?.icon === 'string' ? row.icon : '',
    image: isSafeImage(row?.image) ? row.image : '',
  }));
  const view = LAUNCHER_VIEWS.includes(launcher.view) ? launcher.view : 'grid';
  return {
    links,
    view,
    mobileView: LAUNCHER_VIEWS.includes(launcher.mobileView) ? launcher.mobileView : view,
    // How many shortcuts the mobile menu shows before the rest fold into
    // «show more»: the panel on the desktop simply scrolls, but the mobile
    // menu is the page's own list and must not grow without end.
    mobileMax: clampLauncherMax(launcher.mobileMax),
    titleShow: launcher.showTitle !== false,
    // A name too long for its tile is cut with an ellipsis, or folded onto more lines.
    longNames: launcher.longNames === 'wrap' ? 'wrap' : 'cut',
    // The size of the panel, the marks and the names together, and each of them on its own.
    size: Object.hasOwn(LAUNCHER_SIZES, launcher.size) ? launcher.size : 'md',
    width: launcherPx(launcher.width, LAUNCHER_BOUNDS.width),
    iconSize: launcherPx(launcher.iconSize, LAUNCHER_BOUNDS.iconSize),
    textSize: launcherPx(launcher.textSize, LAUNCHER_BOUNDS.textSize),
    title: typeof launcher.title === 'string' ? launcher.title.trim() : '',
    icon: typeof launcher.icon === 'string' ? launcher.icon : '',
    image: isSafeImage(launcher.image) ? launcher.image : '',
  };
}

/**
 * The CSS custom properties that size the launcher's panel and tiles: the size's scale, and a px value for each part the owner set on its own (base.css reads them, the scale where a part has none).
 * @param {{size: string, width: number|null, iconSize: number|null, textSize: number|null}} model From launcherModel
 * @returns {Record<string, string>}
 */
export function launcherVars(model) {
  const vars = { '--urd-launcher-s': String(LAUNCHER_SIZES[model.size] ?? 1) };
  if (model.width) vars['--urd-launcher-w'] = `${model.width}px`;
  if (model.iconSize) vars['--urd-launcher-icon'] = `${model.iconSize}px`;
  if (model.textSize) vars['--urd-launcher-text'] = `${model.textSize}px`;
  return vars;
}

/**
 * Scroll behavior for the menu (nav.scroll, additive since v0.6): pure
 * state computation, the DOM part lives in nav.js. 'shrink' = compact
 * after some scrolling; 'hide' = hidden on scroll down, shown on scroll up.
 * Near the top (below TOP_ZONE) the menu is always normal and visible.
 * The state flips on the distance travelled, not on the direction of a
 * single frame: `anchor` is the turning point the travel is measured from,
 * and the function returns the next one, so the caller only carries it.
 * While the menu is visible the anchor follows the page up, and while it is
 * hidden it follows the page down, so the distance is always measured from
 * the furthest point in the current direction. `scrolled` says whether the
 * page has left the top zone, whatever the mode: the transparent-at-top
 * surface (nav.style.atTop) reads it.
 * `hold` keeps a hiding menu in view while a jump to a spot on the page runs, so the spot lands under it, and the travel is measured from where the jump ends.
 * @param {string|undefined} mode nav.scroll ('shrink' | 'hide' | undefined)
 * @param {number} anchor The scrollY the travel is measured from
 * @param {number} y Current scrollY
 * @param {boolean} prevHidden Whether the menu was hidden
 * @param {{shrinkAt?: number, hold?: boolean}} [options]
 * @returns {{compact: boolean, hidden: boolean, scrolled: boolean, anchor: number}}
 */
export function navScrollState(mode, anchor, y, prevHidden, { shrinkAt, hold = false } = {}) {
  const TOP_ZONE = 80;
  // Asymmetric on purpose. Hiding asks for a deliberate scroll down, so the
  // menu does not leave at the first notch; showing it again answers a short
  // scroll up, so it is there the moment it is wanted.
  const HIDE_TRAVEL = 96;
  const SHOW_TRAVEL = 16;
  const scrolled = y > TOP_ZONE;
  // How far down the shrink starts is its own distance (nav.style.shrinkAt);
  // the top zone is what the clear surface and the hide read.
  const shrinkZone = clampNum(shrinkAt, NAV_SIZE_BOUNDS.shrinkAt) ?? TOP_ZONE;
  if (mode === 'shrink') return { compact: y > shrinkZone, hidden: false, scrolled, anchor: y };
  if (mode !== 'hide') return { compact: false, hidden: false, scrolled, anchor: y };
  if (!scrolled || hold) return { compact: false, hidden: false, scrolled, anchor: y };
  if (prevHidden) {
    if (y >= anchor) return { compact: false, hidden: true, scrolled, anchor: y };
    if (anchor - y >= SHOW_TRAVEL) return { compact: false, hidden: false, scrolled, anchor: y };
    return { compact: false, hidden: true, scrolled, anchor };
  }
  if (y <= anchor) return { compact: false, hidden: false, scrolled, anchor: y };
  if (y - anchor >= HIDE_TRAVEL) return { compact: false, hidden: true, scrolled, anchor: y };
  return { compact: false, hidden: false, scrolled, anchor };
}

/**
 * The room a jump to a spot on the page leaves above the spot, so it lands under a menu that stays on screen: a sticky top bar's own height, nothing for a menu that scrolls away with the page, and for the side column only a strip fixed across the page above it. nav.js writes it to `--urd-scroll-clear`, which base.css gives the page as its `scroll-padding-top`.
 * @param {{sticky: boolean, side: boolean, height: number, pageStrip?: number}} menu
 * @returns {number} Whole pixels, never negative
 */
export function scrollClear({ sticky, side, height, pageStrip = 0 }) {
  const px = side ? pageStrip : sticky ? height : 0;
  return Number.isFinite(px) && px > 0 ? Math.round(px) : 0;
}

// A name an owner gives a section or a block, so a link can point at it (`/kaker#priser`): lower-case letters, digits and inner hyphens, at most 40 characters, never one of the prefixes the engine's own ids use.
// Anchored regex on purpose - CodeQL recognizes it as a barrier.
const ANCHOR_NAME_RE = /^(?!(?:urd|sec|blk)-)[a-z0-9](?:[a-z0-9-]{0,38}[a-z0-9])?$/;

/** @param {unknown} name @returns {boolean} */
export function isAnchorName(name) {
  return typeof name === 'string' && ANCHOR_NAME_RE.test(name);
}

/**
 * The element id a URL fragment names: `#priser` gives `priser`, and a percent-encoded fragment is decoded the way the browser reads it.
 * An empty fragment names nothing.
 * @param {unknown} hash location.hash or a link's fragment
 * @returns {string|null}
 */
export function hashTarget(hash) {
  if (typeof hash !== 'string') return null;
  const raw = hash.startsWith('#') ? hash.slice(1) : hash;
  if (!raw) return null;
  try {
    return decodeURIComponent(raw) || null;
  } catch {
    // A malformed escape is read as it is written.
    return raw;
  }
}

/**
 * A link to a spot on the page the visitor is on: the same origin and query, and the same path with or without a trailing slash, since the site serves a page at both.
 * `inPlace` says whether the browser follows it without loading the page again, which it does only when the path is written exactly as the address bar has it.
 * Anything else gives null.
 * @param {string} href The link's address, absolute or relative to `here`
 * @param {{href: string}} here The current location
 * @returns {{hash: string, inPlace: boolean}|null} The fragment with its '#'
 */
export function samePageHash(href, here) {
  let url;
  let base;
  try {
    base = new URL(here.href);
    url = new URL(href, base);
  } catch {
    return null;
  }
  const page = (path) => (path.length > 1 ? path.replace(/\/$/, '') : path);
  if (url.origin !== base.origin || url.search !== base.search || page(url.pathname) !== page(base.pathname)) return null;
  if (url.hash.length < 2) return null;
  return { hash: url.hash, inPlace: url.pathname === base.pathname };
}

/**
 * Whether the engine jumps to the address's fragment once the page has rendered.
 * The page is drawn after the browser has looked for the spot, so a visit with a fragment jumps there.
 * A return through the history and a reload keep the place the browser restores, and so does a page that has already left the top.
 * @param {{hash: string, navigationType?: string, scrollY: number}} arrival
 * @returns {boolean}
 */
export function jumpOnArrival({ hash, navigationType, scrollY }) {
  if (!hashTarget(hash) || navigationType === 'back_forward' || navigationType === 'reload') return false;
  return !(scrollY > 1);
}

/** The nav fields the mobile breakpoint may override (nav.style.mobile). */
const MOBILE_STYLE_KEYS = ['size', 'inset', 'tools', 'border'];

/**
 * The nav as it applies at the current breakpoint (additive since v0.7):
 * the keys present in nav.style.mobile replace the desktop values they
 * name, and nothing else changes. Everything downstream (navClasses,
 * hostClasses, navSizeVars) then reads one resolved nav, so the pure
 * functions never need to know about breakpoints.
 *
 * The choice is made here rather than with a CSS class for the reason
 * ADR-0023 gives: urd-nav-mobile is also set by desktop content folding, so
 * a class can never be the source of truth for what applies. `layout` and
 * `overlay` sit in the same bag although they are not style fields, since
 * nav.style.mobile is where the mobile overrides live.
 *
 * @param {object} nav site.nav
 * @param {{mobile?: boolean}} [state] Whether the mobile breakpoint matches
 * @returns {object} The nav to render from
 */
export function effectiveNav(nav, { mobile = false } = {}) {
  const m = nav?.style?.mobile;
  if (!mobile || !m || typeof m !== 'object') return nav;
  const style = { ...nav.style };
  for (const key of MOBILE_STYLE_KEYS) {
    if (m[key] !== undefined) style[key] = m[key];
  }
  const out = { ...nav, style };
  if (m.layout !== undefined) out.layout = m.layout;
  if (m.overlay !== undefined) out.overlay = m.overlay;
  return out;
}

/**
 * The CSS classes on the nav element. Variant (floating pill) and hover
 * style (additive since v0.6) yield extra classes only when they deviate
 * from the default, so existing sites render unchanged.
 * @param {{nav: {layout?: string, variant?: string, style?: {hover?: string}}}} site
 * @returns {string}
 */
/** The floating variants (pill, square, tab) share the base class urd-nav-var-floating. */
function isFloating(variant) {
  return variant === 'floating' || variant === 'floating-square' || variant === 'floating-tab';
}

/**
 * How the submenus open on a mouse device: hover opens and closes them
 * (`hover`, the default), hover opens them and only a click, another item
 * or a click outside closes them (`stay`), or the pointer does nothing and
 * only a click opens and closes them (`click`). Touch never gets hover in
 * any mode. Pure function; an unknown value reads as the default.
 * @param {object} style nav.style
 * @returns {{hoverOpens: boolean, hoverCloses: boolean}}
 */
export function subOpenMode(style = {}) {
  const mode = style?.subOpen;
  if (mode === 'click') return { hoverOpens: false, hoverCloses: false };
  if (mode === 'stay') return { hoverOpens: true, hoverCloses: false };
  return { hoverOpens: true, hoverCloses: true };
}

/**
 * How the burger opens the menu (nav.style.mobileMenu, additive since v0.7):
 * `dropdown` is the panel below the bar, `sheet` the full-screen dialog.
 * Anything else falls back to the dropdown.
 * @param {{mobileMenu?: string}} [style]
 * @returns {'dropdown' | 'sheet'}
 */
export function mobileMenuMode(style = {}) {
  return style?.mobileMenu === 'sheet' ? 'sheet' : 'dropdown';
}

/**
 * How submenus start in the mobile menu (nav.style.mobileSubs, additive
 * since v0.7): `collapsed` (a tap anywhere on the item opens it, the item
 * never navigates, and its own page is listed first in the submenu) or
 * `expanded` (every submenu open from the start, the item is a plain link).
 * Anything else falls back to collapsed.
 * @param {{mobileSubs?: string}} [style]
 * @returns {'collapsed' | 'expanded'}
 */
export function mobileSubMode(style = {}) {
  return style?.mobileSubs === 'expanded' ? 'expanded' : 'collapsed';
}

/** The submenus in the side column (nav.style.sideSubs): accordions, or open from the start. */
export function sideSubMode(style = {}) {
  return style?.sideSubs === 'expanded' ? 'expanded' : 'collapsed';
}

/** The tool cluster's alignments in the side column (nav.style.tools.align); the default is center. */
export const TOOLS_ALIGNS = ['start', 'center', 'end', 'spread'];

/** The sheet's entrances (nav.style.sheetMotion); the first is the default. */
export const SHEET_MOTIONS = ['top', 'bottom', 'left', 'right', 'fade', 'none'];

/**
 * Where the full-screen sheet comes from when it opens: a slide from one of
 * the four edges, a fade, or none (it simply appears). Anything else gives
 * the slide from the top.
 * @param {{sheetMotion?: string}} [style]
 * @returns {'top' | 'bottom' | 'left' | 'right' | 'fade' | 'none'}
 */
export function sheetMotion(style = {}) {
  const m = style?.sheetMotion;
  return SHEET_MOTIONS.includes(m) ? m : 'top';
}

export function navClasses(site) {
  let classes = `urd-nav urd-nav-${site.nav.layout ?? 'right'}`;
  const variant = site.nav.variant;
  if (isFloating(variant)) {
    classes += ' urd-nav-var-floating';
    // The square variant is the pill without rounded corners.
    if (variant === 'floating-square') classes += ' urd-nav-square';
    // The tab variant hangs down: square top, only the bottom corners rounded.
    if (variant === 'floating-tab') classes += ' urd-nav-tab';
    // Glow is an opt-in for the pill (off by default).
    if (site.nav.style?.glow) classes += ' urd-nav-glow';
    // Space above the pill is the default; topGap: false puts it flush at the top.
    if (site.nav.style?.topGap === false) classes += ' urd-nav-flush';
  }
  const hover = site.nav.style?.hover;
  if (hover && hover !== 'standard') classes += ` urd-nav-hover-${hover}`;
  // Size (additive since v0.6): md is the default and yields no class.
  // The values are allowlisted - class names must never be built from free strings.
  const size = site.nav.style?.size;
  if (['sm', 'lg', 'xl'].includes(size)) classes += ` urd-nav-size-${size}`;
  // Text alignment of the items in the side column (default left).
  const salign = site.nav.style?.sideAlign;
  if (['center', 'right'].includes(salign)) classes += ` urd-nav-salign-${salign}`;
  // Vertical placement of the menu list in the column (default top). Its
  // own field, not nav.layout: layout is the top bar's concept.
  const splace = site.nav.style?.sidePlacement;
  if (['middle', 'bottom'].includes(splace)) classes += ` urd-nav-splace-${splace}`;
  // Submenu design (default is the card style).
  const sub = site.nav.style?.subStyle;
  if (['flat', 'pills', 'lines', 'flyout'].includes(sub)) classes += ` urd-nav-sub-${sub}`;
  // A second submenu level stands as a headed group in a column layout or the flyout (additive from 0.7.13.21).
  if (subGrouped(site.nav.style)) classes += ' urd-nav-sub-grouped';
  // Inset (additive since v0.7, ADR-0023, the default since schemaVersion 4):
  // the bar's contents line up with the content edge while the background
  // keeps the full width. Only the top bar can be inset; the pill has its
  // own width and the column none.
  const isBar = !isFloating(variant) && variant !== 'side-left' && variant !== 'side-right';
  if (site.nav.style?.inset !== false && isBar) classes += ' urd-nav-inset';
  // The logo image follows the scroll shrink (additive since v0.7).
  if (site.nav.style?.shrinkLogo === true) classes += ' urd-nav-shrink-logo';
  // Border and shadow (additive since v0.7): the side the border sits on
  // and the shadow strength are allowlisted classes; the border's width and
  // colour are variables set by nav.js. The column draws no border, and the
  // pill has its glow instead of a shadow.
  const isSide = variant === 'side-left' || variant === 'side-right';
  const borderSide = site.nav.style?.border?.side;
  if (['bottom', 'top', 'both', 'all'].includes(borderSide) && !isSide) classes += ` urd-nav-border-${borderSide}`;
  const shadow = site.nav.style?.shadow;
  if (['soft', 'strong'].includes(shadow) && isBar) classes += ` urd-nav-shadow-${shadow}`;
  // The tool cluster's side (additive since v0.7): end is the default and
  // yields no class.
  if (site.nav.style?.tools?.side === 'start') classes += ' urd-nav-tools-start';
  return classes;
}

/**
 * The announcement bar above the menu (nav.announcement, additive since
 * v0.7): null unless `show` is true and there is text, otherwise the
 * finished values. The link is a page from the register (`page`) or a
 * free `href` through the same guard as menu links; `sticky` defaults to
 * true (the bar follows the menu), false lets it scroll away while the menu
 * stays; `dismiss` (default true) adds a cross for the visitor. `bg` and `color` are
 * resolved theme tokens or raw colours, empty when the CSS defaults (the
 * accent and its text colour) apply.
 * @param {{show?: boolean, text?: string, page?: string, href?: string, sticky?: boolean, dismiss?: boolean, color?: string, textColor?: string}} [announcement]
 * @param {Array<{id: string, path: string}>} [pages] The page register (site.pages)
 * @returns {{text: string, href: string | null, sticky: boolean, dismiss: boolean, bg: string, color: string} | null}
 */
export function announcementModel(announcement, pages = []) {
  const text = typeof announcement?.text === 'string' ? announcement.text.trim() : '';
  if (announcement?.show !== true || !text) return null;
  // The strip is a link only when its target resolves: an unknown page or a failing address leaves it as plain text.
  const link = resolveLink(announcement, pages);
  return {
    text,
    href: link.missing ? null : link.href,
    link: link.missing ? null : link,
    sticky: announcement.sticky !== false,
    dismiss: announcement.dismiss !== false,
    // Whether the strip slides out with the menu under «hide on scroll».
    // Off by default: the message stays while the bar gets out of the way.
    followNav: announcement.followNav === true,
    // Where the strip sits with a side column (nav.js honours it for the
    // side variants only): in the column, above the whole page, or above
    // the content beside the column.
    place: ['page', 'content'].includes(announcement.place) ? announcement.place : 'nav',
    bg: announcement.color ? resolveColor(announcement.color) : '',
    color: announcement.textColor ? resolveColor(announcement.textColor) : '',
  };
}

/**
 * The border's width in px (nav.style.border.width), clamped to 1-8;
 * anything invalid yields 1.
 */
export function clampBorderWidth(width) {
  const n = Number(width);
  if (!Number.isFinite(n)) return 1;
  return Math.min(8, Math.max(1, Math.round(n)));
}

/**
 * The bounds of the size fields (nav.style.*, nav.logo.*), shared with the
 * schema and the editor's nav-size module (a parity test ties them together).
 */
export const NAV_SIZE_BOUNDS = {
  padY: [0, 64],
  textSize: [12, 28],
  padX: [0, 80],
  gap: [0, 64],
  pillWidth: [480, 1920],
  shrinkTo: [0.3, 0.8],
  shrinkAt: [0, 400],
  shrinkMs: [0, 1200],
  logoSize: [12, 128],
  radius: [0, 64],
};

/** A number clamped to [min, max] with the given decimals; undefined when the value is not a number. */
function clampNum(value, [min, max], decimals = 0) {
  if (value == null || value === '') return undefined;
  const n = Number(value);
  if (!Number.isFinite(n)) return undefined;
  const f = 10 ** decimals;
  return Math.min(max, Math.max(min, Math.round(n * f) / f));
}

/**
 * The inline size values for the nav element (ADR-0023): custom properties
 * the CSS reads with today's look as the fallback, the menu font size and
 * the logo image height. The mobile overrides (nav.style.mobile and
 * nav.logo.mobileSize) are chosen here from the breakpoint state at render
 * time: the burger class is also set by content folding on desktop, and a
 * class rule can never beat an inline value, so the choice belongs in JS.
 * An empty style yields empty vars.
 * @param {object} [style] nav.style
 * @param {object} [logo] nav.logo
 * @param {{mobile?: boolean}} [state] Whether the mobile breakpoint matches
 * @returns {{vars: Record<string, string>, logoSize: number}}
 */
export function navSizeVars(style = {}, logo = {}, { mobile = false } = {}) {
  const s = style ?? {};
  const m = mobile && s.mobile && typeof s.mobile === 'object' ? s.mobile : {};
  const vars = {};
  const padY = clampNum(m.padY ?? s.padY, NAV_SIZE_BOUNDS.padY);
  if (padY !== undefined) vars['--urd-nav-pad-y'] = `${padY}px`;
  const padX = clampNum(s.padX, NAV_SIZE_BOUNDS.padX);
  if (padX !== undefined) vars['--urd-nav-pad-x'] = `${padX}px`;
  const gap = clampNum(s.gap, NAV_SIZE_BOUNDS.gap);
  if (gap !== undefined) vars['--urd-nav-gap'] = `${gap}px`;
  // The pill width applies above the breakpoint only: on a phone the pill
  // keeps the full width minus its air, as without the field.
  if (!mobile) {
    if (s.pillWidth === 'content') {
      vars['--urd-nav-pill-w'] = 'min(var(--urd-canvas-w, 100%), calc(100% - 2 * var(--urd-canvas-gutter-desktop, 0px)))';
    } else {
      const w = clampNum(s.pillWidth, NAV_SIZE_BOUNDS.pillWidth);
      if (w !== undefined) vars['--urd-nav-pill-w'] = `${w}px`;
    }
  }
  const shrinkTo = clampNum(s.shrinkTo, NAV_SIZE_BOUNDS.shrinkTo, 2);
  if (shrinkTo !== undefined) vars['--urd-nav-shrink-to'] = String(shrinkTo);
  const shrinkMs = clampNum(s.shrinkMs, NAV_SIZE_BOUNDS.shrinkMs);
  if (shrinkMs !== undefined) vars['--urd-nav-shrink-ms'] = `${shrinkMs}ms`;
  // The floating menu's corner rounding; the CSS reads it only on the
  // floating variants, with each variant's preset as the fallback.
  const radius = clampNum(s.radius, NAV_SIZE_BOUNDS.radius);
  if (radius !== undefined) vars['--urd-nav-radius'] = `${radius}px`;
  // The text size is a variable rather than an inline font-size, so the
  // scroll shrink can scale it the way it scales the padding.
  const textSize = clampNum(m.textSize ?? s.textSize, NAV_SIZE_BOUNDS.textSize);
  if (textSize !== undefined) vars['--urd-nav-text-size'] = `${textSize}px`;
  const l = logo ?? {};
  const logoSize = clampNum(mobile ? (l.mobileSize ?? l.size) : l.size, NAV_SIZE_BOUNDS.logoSize) ?? 32;
  return { vars, logoSize };
}

/**
 * Classes for the HOST (the header element) and body, derived from the
 * variant: floating takes the host out of the flow; the side variant turns
 * it into a fixed column and gives body content padding on the same side.
 * The transparent-at-top surface (nav.style.atTop 'clear', additive from
 * v0.7) is a host class for the bar and the floating menu, never the
 * column: the CSS hides the surface until the host also carries
 * urd-nav-scrolled, which nav.js toggles from the scroll state.
 * @param {{nav: {variant?: string, overlay?: boolean, style?: {atTop?: string}}}} site
 * @returns {{host: string[], body: string[]}}
 */
export function hostClasses(site) {
  const v = site.nav.variant;
  const style = site.nav.style ?? {};
  const clear = style.atTop === 'clear' ? ['urd-nav-clear'] : [];
  if (isFloating(v)) return { host: ['urd-nav-float', ...clear], body: [] };
  if (v === 'side-left' || v === 'side-right') {
    // The column's own choices (additive from v0.7): submenus open from the
    // start, the arrow on them, and the tool cluster's alignment.
    const column = [];
    if (sideSubMode(style) === 'expanded') column.push('urd-nav-side-subs-open');
    if (style.sideSubArrow === true) column.push('urd-nav-side-sub-arrow');
    if (TOOLS_ALIGNS.includes(style.tools?.align)) column.push(`urd-nav-tools-align-${style.tools.align}`);
    return v === 'side-left'
      ? { host: ['urd-nav-side-host', 'urd-nav-side-host-left', ...column], body: ['urd-side-left'] }
      : { host: ['urd-nav-side-host', 'urd-nav-side-host-right', ...column], body: ['urd-side-right'] };
  }
  // Overlay only applies to the full-width bar: the host is taken out of the
  // flow so the top section slides up under the menu. Floating/side already
  // sit outside.
  if (site.nav.overlay) return { host: ['urd-nav-overlay', ...clear], body: [] };
  return { host: clear, body: [] };
}

/**
 * Computes the appearance overrides from nav.style: `bg` is the finished
 * background value for --urd-nav-bg (submenus and the mobile panel reuse
 * the var), `blur: false` turns the blur off, `color` is the text color.
 * With `image` (additive since v0.6) the background becomes the image
 * with the color/opacity as a veil on top. An empty object = the CSS
 * defaults apply.
 * @param {{bg?: string, bgOpacity?: number, blur?: boolean, textColor?: string, image?: string}} [style]
 * @returns {{bg?: string, blur?: boolean, color?: string}}
 */
export function navSurface(style = {}) {
  const out = {};
  const hasVeil = style.bg || style.bgOpacity != null;
  if (isSafeImage(style.image)) {
    // The veil is repeated as a gradient layer over the image; without
    // explicit choices the default surface is used (surface at 85 %), so
    // the text always has a background to sit on.
    const color = resolveColor(style.bg ?? 'surface');
    const cover = veil(style);
    const layers = [`linear-gradient(${cover}, ${cover})`];
    // Image strength (0..1, default 1): a weaker image is toned toward the
    // background color with its own layer under the veil - CSS cannot set
    // opacity on a single background layer.
    const strength = style.imageOpacity ?? 1;
    if (strength < 1) {
      const fade = `color-mix(in srgb, ${color} ${Math.round((1 - strength) * 100)}%, transparent)`;
      layers.push(`linear-gradient(${fade}, ${fade})`);
    }
    // Crop position (0..100, default 50 centered): the height is what
    // matters in the low wide bar, the width in the tall narrow side
    // column - both are exposed, so the choice works in every variant.
    const x = Math.min(100, Math.max(0, style.imageX ?? 50));
    const y = Math.min(100, Math.max(0, style.imageY ?? 50));
    layers.push(`url("${style.image}") ${x}% ${y}% / cover`);
    out.bg = layers.join(', ');
  } else if (hasVeil) {
    out.bg = veil(style);
  }
  if (style.blur === false) out.blur = false;
  else if (style.blur === true) out.blur = true;
  if (style.textColor) out.color = resolveColor(style.textColor);
  return out;
}

/** The veil alone (the color with opacity), without the image layers. */
function veil(style) {
  const color = resolveColor(style.bg ?? 'surface');
  const pct = Math.round((style.bgOpacity ?? 0.85) * 100);
  return `color-mix(in srgb, ${color} ${pct}%, transparent)`;
}

/**
 * The background for the submenu and the mobile panel (--urd-nav-sub-bg):
 * by default ONLY the veil, never the background image - the image comes
 * along only when the owner turns on nav.style.subImage. Undefined = the
 * CSS default applies.
 * @param {{bg?: string, bgOpacity?: number, image?: string, subImage?: boolean}} [style]
 * @returns {string|undefined}
 */
export function navSubSurface(style = {}) {
  if (isSafeImage(style.image) && style.subImage === true) {
    return navSurface(style).bg;
  }
  if (style.bg || style.bgOpacity != null) return veil(style);
  return undefined;
}

/**
 * Flattens the layer stack's COLOR layers into one veil for the submenu
 * and the mobile panel, so the dropdown follows the bar's tone when the
 * nav has a layer background. Image and gradient layers are kept out, the
 * same principle as subImage: the submenu never gets the image. Layers are
 * drawn in list order (first at the back), so each color layer is mixed
 * over the previous ones. Null = no color layers, the CSS default applies.
 * @param {Array<{type?: string, props?: {value?: string, opacity?: number}}>} [layers]
 * @returns {string|null}
 */
export function navLayerVeil(layers) {
  let mix = null;
  for (const layer of Array.isArray(layers) ? layers : []) {
    if (layer?.type !== 'color') continue;
    const pct = Math.round(Math.min(1, Math.max(0, layer.props?.opacity ?? 1)) * 100);
    if (pct === 0) continue;
    const color = resolveColor(layer.props?.value ?? 'bg');
    mix = `color-mix(in srgb, ${color} ${pct}%, ${mix ?? 'transparent'})`;
  }
  return mix;
}

/**
 * The side column's width in px (nav.style.width), clamped to sensible
 * bounds; anything invalid yields the default width 250.
 * @param {number|string|undefined} width
 * @returns {number}
 */
export function clampSideWidth(width) {
  const n = Number(width);
  if (!Number.isFinite(n)) return 250;
  return Math.min(400, Math.max(180, Math.round(n)));
}
