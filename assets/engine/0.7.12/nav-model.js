/**
 * Pure nav logic: menu items, page-register lookups and appearance values, without the DOM; nav.js builds the DOM from them.
 * Notes: docs/engine-notes/nav-model.md (Urd repository).
 */

import { resolveColor } from './theme.js';

// Safe image source for img.src and CSS url(): a base64 image data URL, a site path or `/api/photo`; anchored, so CodeQL reads it as a barrier.
const SAFE_IMAGE_RE = /^(?:data:image\/[\w.+-]+;base64,[A-Za-z0-9+/=]+|\/api\/photo\?[^\s"'<>\\]{1,2048}|\/(?!\/)[\w%./-]*)$/;

/** @param {unknown} src @returns {boolean} */
export function isSafeImage(src) {
  return typeof src === 'string' && SAFE_IMAGE_RE.test(src);
}

// Safe nav and footer link URL: only http(s), mailto and tel, so a javascript: href never turns active; anchored, so CodeQL reads it as a barrier.
const SAFE_URL_RE = /^(?:https?:\/\/|mailto:|tel:)[^\s]+$/i;

/** @param {unknown} url @returns {boolean} */
export function isSafeUrl(url) {
  return typeof url === 'string' && SAFE_URL_RE.test(url.trim());
}

// Safe block href: the schemes above plus site paths ('/...', never '//' or a backslash) and anchors ('#...'); anchored, so CodeQL reads it as a barrier.
const SAFE_INTERNAL_RE = /^(?:\/(?![/\\])[^\s\\]*|#[^\s]*)$/;

/** @param {unknown} url @returns {boolean} */
export function isSafeHref(url) {
  return isSafeUrl(url) || (typeof url === 'string' && SAFE_INTERNAL_RE.test(url.trim()));
}

/** The words an owner may add to a link's rel; they count only for an http(s) link. */
export const LINK_RELS = ['nofollow', 'sponsored'];

// A link's `target`: the id of a section or block (or a name), the page schema's id shape.
// Anchored regex on purpose - CodeQL recognizes it as a barrier.
const LINK_TARGET_RE = /^[a-z0-9][a-z0-9-]{0,80}$/;

/**
 * Resolves a link: `page` wins over `href`, `target` adds a spot to that page or alone names one here; an unknown page or unsafe href gives '#' with `missing`.
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
 * A resolved link's attributes: `href`, `target` and noopener for a new tab, `download`, and `rel` with the host's external words first, the owner's last.
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
 * A menu item resolved through resolveLink: its label beside the link's address and flags, '#' with `missing` for an unknown page or unsafe href.
 * @param {{label: string, page?: string, target?: string, href?: string, newTab?: boolean, rel?: string[]}} item
 * @param {Array<{id: string, path: string}>} pages The page register (site.pages)
 * @returns {{label: string, href: string, external: boolean, missing: boolean, newTab?: true, rel?: string[]}}
 */
export function resolveItem(item, pages) {
  return { label: item.label, ...resolveLink(item, pages) };
}

/** How many submenu levels stand under the bar: the menu is four levels deep in all (ADR-0010). */
export const NAV_DEPTH = 3;

/**
 * The menu model nav.js renders: each item's `kind` ('link', 'split' for link and submenu, 'toggle' for an opener), its `description` and top-level `look`.
 * @param {{nav: {items?: Array<object>}, pages?: Array<object>}} site
 * @returns {Array<{label: string, href: string, external: boolean, missing: boolean, kind: string, children: Array<object>, description: string, look: string}>}
 */
export function navItems(site) {
  // The bar's items and three submenu levels under them; anything deeper is left out.
  const pages = site.pages ?? [];
  // A hidden page is not published: an item to one is left out, or stays a plain opener while its submenu still holds items.
  const hidden = new Set(pages.filter((p) => p.hidden).map((p) => p.id));
  const toHidden = (item) => !!item.page && hidden.has(item.page);
  const model = (item, depth) => {
    const children = depth < NAV_DEPTH && Array.isArray(item.children)
      ? item.children.map((child) => model(child, depth + 1)).filter(Boolean)
      : [];
    if (toHidden(item)) {
      if (!children.length) return null;
      const { page: _page, target: _target, ...opener } = item;
      item = opener;
    }
    const hasTarget = !!(item.page || item.href || item.target);
    const kind = children.length === 0 ? 'link' : hasTarget ? 'split' : 'toggle';
    // A toggle item has no link of its own - resolveItem would flag it as missing, so openers are modeled without an href.
    const own = kind === 'toggle'
      ? { label: item.label, href: '', external: false, missing: false }
      : resolveItem(item, pages);
    const description = typeof item.description === 'string' ? item.description.trim() : '';
    const look = depth === 0 && item.look === 'button' ? 'button' : '';
    return { ...own, kind, children, description, look };
  };
  return (site.nav.items ?? []).map((item) => model(item, 0)).filter(Boolean);
}

/** The burger's drawings (nav.style.burger.icon); the first is the default, and `none` leaves the word to stand alone. */
export const BURGER_ICONS = ['lines', 'handle', 'dots', 'grid', 'none'];

/**
 * The burger as drawn (nav.style.burger): icon, word shown or not, and the owner's word; an unknown icon, or `none` without the word, gives the lines.
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
 * Whether the menu stays off a page (nav.hideOn): the page ids the owner listed, read the way footer.js reads footer.hideOn.
 * @param {{hideOn?: string[]}} [nav] site.nav
 * @param {string} [pageId] The page being rendered
 * @returns {boolean}
 */
export function navHidden(nav, pageId) {
  return !!pageId && Array.isArray(nav?.hideOn) && nav.hideOn.includes(pageId);
}

/**
 * Whether the announcement strip stays off a page: the strip's own nav.announcement.hideOn lists its id.
 * @param {{hideOn?: string[]}} [announcement] site.nav.announcement
 * @param {string} [pageId]
 */
export function announcementHidden(announcement, pageId) {
  return !!pageId && Array.isArray(announcement?.hideOn) && announcement.hideOn.includes(pageId);
}

/** How the menu stands on a page it is kept off (nav.hideMode); the first is the default. */
export const HIDE_MODES = ['hidden', 'hover', 'ghost', 'tab'];

/**
 * How the menu is reached on a page in nav.hideOn: `hidden`, `hover` (slides in at the top edge), `ghost` (shows faint there) or `tab` (a pull tab).
 * @param {{hideMode?: string}} [nav] site.nav
 * @returns {'hidden' | 'hover' | 'ghost' | 'tab'}
 */
export function hideMode(nav) {
  return HIDE_MODES.includes(nav?.hideMode) ? nav.hideMode : 'hidden';
}

/**
 * The pull tab as drawn (nav.tab): the owner's image or icon, word and colours ('' where unset), with `custom` true when any field is set.
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
 * Whether the submenu levels below the first stand as headed groups under their items: with columns (nav.style.subColumns above 1) or the flyout.
 * @param {{subStyle?: string, subColumns?: number}} [style] nav.style
 * @returns {boolean}
 */
export function subGrouped(style = {}) {
  return style?.subStyle === 'flyout' || Math.round(Number(style?.subColumns)) >= 2;
}

/** The launcher's three designs; grid is the default. */
export const LAUNCHER_VIEWS = ['grid', 'list', 'cover'];

/**
 * The cluster's tools in their default order; the burger, the phone menu's opener, is not among them.
 */
export const TOOL_IDS = ['launcher', 'cart', 'theme', 'links'];

/**
 * The cluster's order (nav.style.tools.order): the owner's order first, then the rest in the default order, every tool exactly once.
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
 * The link launcher (nav.launcher), null unless shown: its rows resolved like menu links, `view` on the desktop and `mobileView` in the mobile menu.
 * @param {object} [launcher] site.nav.launcher
 * @param {Array<{id: string, path: string}>} [pages] The page register, for a row that links a page
 * @returns {{links: Array<object>, view: string, mobileView: string, mobileMax: number, title: string, titleShow: boolean, longNames: 'cut'|'wrap', size: string, width: number|null, iconSize: number|null, textSize: number|null, icon: string, image: string} | null}
 */
export function launcherModel(launcher, pages = []) {
  if (launcher?.show !== true) return null;
  const rows = Array.isArray(launcher.links) ? launcher.links : [];
  // Every row is drawn; one whose target is not a usable link gets '#' with the missing flag, like a menu item to an unknown page.
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
    // How many shortcuts the mobile menu shows, the rest folded into «show more»; the desktop panel scrolls instead.
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
 * The CSS custom properties that size the launcher: the size's scale, and a px value for each part the owner set on its own.
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
 * Menu scroll state (nav.scroll): 'shrink' compacts after scrolling, 'hide' flips on the travel from `anchor` and returns the next one; `hold` keeps it in view.
 * @param {string|undefined} mode nav.scroll ('shrink' | 'hide' | undefined)
 * @param {number} anchor The scrollY the travel is measured from
 * @param {number} y Current scrollY
 * @param {boolean} prevHidden Whether the menu was hidden
 * @param {{shrinkAt?: number, hold?: boolean}} [options]
 * @returns {{compact: boolean, hidden: boolean, scrolled: boolean, anchor: number}}
 */
export function navScrollState(mode, anchor, y, prevHidden, { shrinkAt, hold = false } = {}) {
  const TOP_ZONE = 80;
  // Asymmetric: hiding takes a deliberate scroll down, while a short scroll up shows the menu again.
  const HIDE_TRAVEL = 96;
  const SHOW_TRAVEL = 16;
  const scrolled = y > TOP_ZONE;
  // How far down the shrink starts is its own distance (nav.style.shrinkAt); the top zone is what the clear surface and the hide read.
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
 * The room a jump leaves above its spot (`--urd-scroll-clear`): a sticky bar's height, none for a menu that scrolls, a fixed page strip for a side column.
 * @param {{sticky: boolean, side: boolean, height: number, pageStrip?: number}} menu
 * @returns {number} Whole pixels, never negative
 */
export function scrollClear({ sticky, side, height, pageStrip = 0 }) {
  const px = side ? pageStrip : sticky ? height : 0;
  return Number.isFinite(px) && px > 0 ? Math.round(px) : 0;
}

// A section's or block's own name: lower-case letters, digits and inner hyphens, at most 40, no engine id prefix; anchored, so CodeQL reads it as a barrier.
const ANCHOR_NAME_RE = /^(?!(?:urd|sec|blk)-)[a-z0-9](?:[a-z0-9-]{0,38}[a-z0-9])?$/;

/** @param {unknown} name @returns {boolean} */
export function isAnchorName(name) {
  return typeof name === 'string' && ANCHOR_NAME_RE.test(name);
}

/**
 * The element id a URL fragment names, percent-decoded the way the browser reads it; an empty fragment names nothing.
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
 * A link to a spot on this page (same origin, query and path, trailing slash aside): its hash, and `inPlace` when the path matches exactly; else null.
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
 * Whether the engine jumps to the address's fragment once the page has rendered: not on a history return or reload, nor once the page has left the top.
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
 * The nav at the current breakpoint: nav.style.mobile's size, inset, tools, border, layout and overlay in place of the desktop values, as one resolved nav.
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

/** The floating variants (pill, square, tab) share the base class urd-nav-var-floating. */
function isFloating(variant) {
  return variant === 'floating' || variant === 'floating-square' || variant === 'floating-tab';
}

/**
 * How submenus open on a mouse: `hover` opens and closes, `stay` opens on hover and closes on a click, `click` only by click; unknown reads as `hover`.
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
 * How the burger opens the menu: `dropdown`, the panel below the bar, or `sheet`, the full-screen dialog; anything else gives `dropdown`.
 * @param {{mobileMenu?: string}} [style]
 * @returns {'dropdown' | 'sheet'}
 */
export function mobileMenuMode(style = {}) {
  return style?.mobileMenu === 'sheet' ? 'sheet' : 'dropdown';
}

/**
 * How submenus start in the mobile menu: `collapsed` (a tap on the item opens it, its page listed first) or `expanded` (all open, the item a plain link).
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

/** The phone menu's text alignments (nav.style.mobileAlign); the first is the default. */
export const MOBILE_ALIGNS = ['left', 'center', 'right'];

/**
 * The phone menu's look: text alignment (left by default), the submenu arrow (shown), and the bar's tools beside the full-screen menu (kept).
 * @param {{mobileAlign?: string, mobileSubArrow?: boolean, sheetBarTools?: boolean, mobileMenu?: string}} [style]
 * @returns {{align: 'left'|'center'|'right', arrow: boolean, barTools: boolean}}
 */
export function phoneMenuModel(style = {}) {
  return {
    align: MOBILE_ALIGNS.includes(style?.mobileAlign) ? style.mobileAlign : 'left',
    arrow: style?.mobileSubArrow !== false,
    // The tools leave the bar only for the full-screen menu, which has a foot to take them.
    barTools: !(mobileMenuMode(style) === 'sheet' && style?.sheetBarTools === false),
  };
}

/** The tool cluster's alignments in the side column (nav.style.tools.align); the default is center. */
export const TOOLS_ALIGNS = ['start', 'center', 'end', 'spread'];

/** The sheet's entrances (nav.style.sheetMotion); the first is the default. */
export const SHEET_MOTIONS = ['top', 'bottom', 'left', 'right', 'fade', 'none'];

/**
 * Where the full-screen sheet enters from: a slide from one of the four edges, a fade, or none; anything else slides from the top.
 * @param {{sheetMotion?: string}} [style]
 * @returns {'top' | 'bottom' | 'left' | 'right' | 'fade' | 'none'}
 */
export function sheetMotion(style = {}) {
  const m = style?.sheetMotion;
  return SHEET_MOTIONS.includes(m) ? m : 'top';
}

/**
 * The nav element's CSS classes: a variant and a hover style add them off the default, the phone's own (nav.style.mobile) only when `mobile` is true.
 * @param {{nav: {layout?: string, variant?: string, style?: {hover?: string, mobile?: object}}}} site
 * @param {{mobile?: boolean}} [state] `mobile`: the mobile breakpoint matches
 * @returns {string}
 */
export function navClasses(site, { mobile = false } = {}) {
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
  // Size: md is the default and yields no class.
  // The values are allowlisted - class names must never be built from free strings.
  const size = site.nav.style?.size;
  if (['sm', 'lg', 'xl'].includes(size)) classes += ` urd-nav-size-${size}`;
  // Text alignment of the items in the side column (default left).
  const salign = site.nav.style?.sideAlign;
  if (['center', 'right'].includes(salign)) classes += ` urd-nav-salign-${salign}`;
  // Vertical placement of the menu list in the column (default top).
  // Its own field, not nav.layout: layout is the top bar's concept.
  const splace = site.nav.style?.sidePlacement;
  if (['middle', 'bottom'].includes(splace)) classes += ` urd-nav-splace-${splace}`;
  // Submenu design (default is the card style).
  const sub = site.nav.style?.subStyle;
  if (['flat', 'pills', 'lines', 'flyout'].includes(sub)) classes += ` urd-nav-sub-${sub}`;
  // A second submenu level stands as a headed group in a column layout or the flyout.
  if (subGrouped(site.nav.style)) classes += ' urd-nav-sub-grouped';
  // Inset (ADR-0023): the top bar's contents line up with the content edge while its background keeps the full width.
  const isBar = !isFloating(variant) && variant !== 'side-left' && variant !== 'side-right';
  if (site.nav.style?.inset !== false && isBar) classes += ' urd-nav-inset';
  // The logo image follows the scroll shrink.
  if (site.nav.style?.shrinkLogo === true) classes += ' urd-nav-shrink-logo';
  // Border and shadow as allowlisted classes: the column draws no border, and the pill has its glow instead of a shadow.
  const isSide = variant === 'side-left' || variant === 'side-right';
  const borderSide = site.nav.style?.border?.side;
  if (['bottom', 'top', 'both', 'all'].includes(borderSide) && !isSide) classes += ` urd-nav-border-${borderSide}`;
  const shadow = site.nav.style?.shadow;
  if (['soft', 'strong'].includes(shadow) && isBar) classes += ` urd-nav-shadow-${shadow}`;
  // The tool cluster's side: end is the default and yields no class.
  if (site.nav.style?.tools?.side === 'start') classes += ' urd-nav-tools-start';
  // The phone's own: allowlisted, and only at the mobile breakpoint. The logo's place counts only for a bar that shows a logo.
  const phone = mobile && site.nav.style?.mobile && typeof site.nav.style.mobile === 'object' ? site.nav.style.mobile : {};
  if (phone.logo === 'center' && site.nav.logo?.show !== false) classes += ' urd-nav-logo-center';
  if (phone.logo === 'hidden') classes += ' urd-nav-logo-off';
  if (NAV_PRESSES.includes(phone.press)) classes += ` urd-nav-press-${phone.press}`;
  // The phone's placement of the burger and its buttons: right after the logo or in the middle beside it; the edge, the default, needs no class.
  if (['left', 'center'].includes(phone.layout)) classes += ` urd-nav-mplace-${phone.layout}`;
  // The phone menu's look, set at every width since the preview's phone view is not the breakpoint; the CSS reads it only in the phone state.
  const phoneMenu = phoneMenuModel(site.nav.style);
  if (phoneMenu.align !== 'left') classes += ` urd-nav-malign-${phoneMenu.align}`;
  if (!phoneMenu.arrow) classes += ' urd-nav-msub-arrow-off';
  if (!phoneMenu.barTools) classes += ' urd-nav-sheet-bar-bare';
  return classes;
}

/**
 * The announcement bar (nav.announcement): null when not shown, without text or on a page its hideOn lists; else its text, link, `sticky`, `dismiss` and colours.
 * @param {{show?: boolean, text?: string, page?: string, href?: string, sticky?: boolean, dismiss?: boolean, color?: string, textColor?: string}} [announcement]
 * @param {Array<{id: string, path: string}>} [pages] The page register (site.pages)
 * @param {string|null} [pageId] The page being rendered
 * @returns {{text: string, href: string | null, sticky: boolean, dismiss: boolean, bg: string, color: string} | null}
 */
export function announcementModel(announcement, pages = [], pageId = null) {
  const text = typeof announcement?.text === 'string' ? announcement.text.trim() : '';
  if (announcement?.show !== true || !text || announcementHidden(announcement, pageId)) return null;
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
    // Where the strip sits with a side column: in the column, above the whole page, or above the content beside the column.
    place: ['page', 'content'].includes(announcement.place) ? announcement.place : 'nav',
    bg: announcement.color ? resolveColor(announcement.color) : '',
    color: announcement.textColor ? resolveColor(announcement.textColor) : '',
  };
}

/**
 * The border's width in px (nav.style.border.width), clamped to 1-8; anything invalid yields 1.
 */
export function clampBorderWidth(width) {
  const n = Number(width);
  if (!Number.isFinite(n)) return 1;
  return Math.min(8, Math.max(1, Math.round(n)));
}

/**
 * The bounds of the size fields (nav.style.*, nav.logo.*), shared with the schema and the editor's nav-size module (a parity test ties them together).
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
  logoTextSize: [8, 96],
  radius: [0, 64],
};

/** How a menu link answers a touch on the phone (nav.style.mobile.press): a fill in the hover colour, a line under it, or a slightly smaller link. */
export const NAV_PRESSES = ['tint', 'underline', 'shrink'];

/** Where the logo can stand in the phone's bar besides its start (nav.style.mobile.logo): in the middle, or out of the bar. */
export const NAV_PHONE_LOGOS = ['center', 'hidden'];

/**
 * What of a logo with both a picture and words is drawn: both, or on the phone the one nav.logo.mobileParts names.
 * @param {object} [logo] nav.logo
 * @param {{mobile?: boolean}} [state] Whether the mobile breakpoint matches
 * @returns {'both'|'image'|'text'}
 */
export function logoParts(logo = {}, { mobile = false } = {}) {
  const parts = logo?.mobileParts;
  return mobile && (parts === 'image' || parts === 'text') ? parts : 'both';
}

/** A number clamped to [min, max] with the given decimals; undefined when the value is not a number. */
function clampNum(value, [min, max], decimals = 0) {
  if (value == null || value === '') return undefined;
  const n = Number(value);
  if (!Number.isFinite(n)) return undefined;
  const f = 10 ** decimals;
  return Math.min(max, Math.max(min, Math.round(n * f) / f));
}

/**
 * The nav's inline size values (ADR-0023): CSS custom properties and the logo image height, the mobile overrides chosen here from the breakpoint state.
 * @param {object} [style] nav.style
 * @param {object} [logo] nav.logo
 * @param {{mobile?: boolean}} [state] Whether the mobile breakpoint matches
 * @returns {{vars: Record<string, string>, logoSize: number, logoTextSize: number|undefined}} logoTextSize is the size of the logo's words where they have one of their own
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
  // The pill width applies above the breakpoint only: on a phone the pill keeps the full width minus its air, as without the field.
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
  // The floating menu's corner rounding; the CSS reads it only on the floating variants, with each variant's preset as the fallback.
  const radius = clampNum(s.radius, NAV_SIZE_BOUNDS.radius);
  if (radius !== undefined) vars['--urd-nav-radius'] = `${radius}px`;
  // The text size is a variable rather than an inline font-size, so the scroll shrink can scale it the way it scales the padding.
  const textSize = clampNum(m.textSize ?? s.textSize, NAV_SIZE_BOUNDS.textSize);
  if (textSize !== undefined) vars['--urd-nav-text-size'] = `${textSize}px`;
  const l = logo ?? {};
  const logoSize = clampNum(mobile ? (l.mobileSize ?? l.size) : l.size, NAV_SIZE_BOUNDS.logoSize) ?? 32;
  const logoTextSize = clampNum(mobile ? (l.mobileTextSize ?? l.textSize) : l.textSize, NAV_SIZE_BOUNDS.logoTextSize, 2);
  return { vars, logoSize, logoTextSize };
}

/**
 * Host (header) and body classes by variant: floating leaves the flow, a side variant is a fixed column padding the body; atTop 'clear' skips the column.
 * @param {{nav: {variant?: string, overlay?: boolean, style?: {atTop?: string}}}} site
 * @returns {{host: string[], body: string[]}}
 */
export function hostClasses(site) {
  const v = site.nav.variant;
  const style = site.nav.style ?? {};
  const clear = style.atTop === 'clear' ? ['urd-nav-clear'] : [];
  if (isFloating(v)) return { host: ['urd-nav-float', ...clear], body: [] };
  if (v === 'side-left' || v === 'side-right') {
    // The column's own choices: submenus open from the start, the arrow on them, and the tool cluster's alignment.
    const column = [];
    if (sideSubMode(style) === 'expanded') column.push('urd-nav-side-subs-open');
    if (style.sideSubArrow === true) column.push('urd-nav-side-sub-arrow');
    if (TOOLS_ALIGNS.includes(style.tools?.align)) column.push(`urd-nav-tools-align-${style.tools.align}`);
    return v === 'side-left'
      ? { host: ['urd-nav-side-host', 'urd-nav-side-host-left', ...column], body: ['urd-side-left'] }
      : { host: ['urd-nav-side-host', 'urd-nav-side-host-right', ...column], body: ['urd-side-right'] };
  }
  // Overlay only applies to the full-width bar: the host is taken out of the flow so the top section slides up under the menu.
  // Floating/side already sit outside.
  if (site.nav.overlay) return { host: ['urd-nav-overlay', ...clear], body: [] };
  return { host: clear, body: [] };
}

/**
 * Appearance overrides from nav.style: `bg` for --urd-nav-bg (an image under its veil when set), `blur` and the text `color`; {} keeps the CSS defaults.
 * @param {{bg?: string, bgOpacity?: number, blur?: boolean, textColor?: string, image?: string}} [style]
 * @returns {{bg?: string, blur?: boolean, color?: string}}
 */
export function navSurface(style = {}) {
  const out = {};
  const hasVeil = style.bg || style.bgOpacity != null;
  if (isSafeImage(style.image)) {
    // The veil is a gradient layer over the image, the surface at 85 % by default, so the text always has a background.
    const color = resolveColor(style.bg ?? 'surface');
    const cover = veil(style);
    const layers = [`linear-gradient(${cover}, ${cover})`];
    // Image strength (0..1, default 1): a weaker image is toned toward the background colour by a layer under the veil; CSS cannot fade one background layer.
    const strength = style.imageOpacity ?? 1;
    if (strength < 1) {
      const fade = `color-mix(in srgb, ${color} ${Math.round((1 - strength) * 100)}%, transparent)`;
      layers.push(`linear-gradient(${fade}, ${fade})`);
    }
    // Crop position (0..100, default 50): both axes are exposed, so the choice works in the wide bar and the tall column alike.
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
 * The submenu and mobile panel background (--urd-nav-sub-bg): the veil alone, the image only with nav.style.subImage; undefined leaves the CSS default.
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
 * The layer stack's colour layers mixed in list order into one veil for the submenu and mobile panel, image and gradient layers left out; null without any.
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
 * Whether an open full-screen phone menu is kept through a render: it was open, its bar is in the same host, the sheet is wanted and the phone state holds.
 * @param {{sheetOpen: boolean, sameHost: boolean, mode: string, phoneState: boolean}} at
 * @returns {boolean}
 */
export function keepsSheet({ sheetOpen, sameHost, mode, phoneState }) {
  return Boolean(sheetOpen && sameHost && mode === 'sheet' && phoneState);
}

/**
 * Submenus to set after a render, as `[id, open]`: open ones reopen, and while every one starts open in both renders, one closed by hand stays closed.
 * @param {string[]} ids The submenus this render holds that open and close
 * @param {{subs?: string[], expanded?: boolean}|null} was What the previous render left: the submenus open, and whether every one stood open from the start
 * @param {boolean} expandedNow Whether every submenu stands open from the start in this render
 * @returns {Array<[string, boolean]>}
 */
export function subsAfterRender(ids, was, expandedNow) {
  const open = new Set(was?.subs ?? []);
  return ids.filter((id) => open.has(id) || (Boolean(was?.expanded) && expandedNow)).map((id) => [id, open.has(id)]);
}

/**
 * The side column's width in px (nav.style.width), clamped to sensible bounds; anything invalid yields the default width 250.
 * @param {number|string|undefined} width
 * @returns {number}
 */
export function clampSideWidth(width) {
  const n = Number(width);
  if (!Number.isFinite(n)) return 250;
  return Math.min(400, Math.max(180, Math.round(n)));
}
