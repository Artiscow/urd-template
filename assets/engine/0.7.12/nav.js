/**
 * Builds the navigation from site.json's page register and nav data: the bar, its disclosure submenus and the phone menu behind the burger.
 * Notes: docs/engine-notes/nav.md (Urd repository).
 */

import { navItems, navClasses, navSurface, navSubSurface, navLayerVeil, hostClasses, clampSideWidth, clampBorderWidth, navScrollState, scrollClear, resolveLink, linkAttrs, navSizeVars, logoParts, effectiveNav, subOpenMode, mobileMenuMode, mobileSubMode, phoneMenuModel, sheetMotion, announcementModel, launcherModel, toolOrder, isSafeImage, burgerModel, navHidden, hideMode, tabModel, subGrouped, keepsSheet, subsAfterRender } from './nav-model.js';
import { themeMode, toggleThemeMode, resolveColor } from './theme.js';
import { renderBackgroundLayers } from './render.js';
import { feature } from './features.js';
import { iconSvg } from './icons.js';
import { loadBlockSheet } from './core-types.js';
import { siteLinks, linkIconHtml, leavesSite } from './links-model.js';
import { t, ta } from './i18n.js';

/** How long the submenu stays open after the pointer leaves the item. */
const HOVER_CLOSE_DELAY = 250;

// Detaches the previous render's listeners, those on document included, since renderNav runs again for every site draft from the editor.
let navController = null;

// The current render's phone menu as the next render reads it, so a menu open in the editor's preview stays open through a change of a setting.
let readMenu = null;

// The current render's scroll-state pass, so a switch between the editor's views can apply the top-zone state at once instead of at the next scroll.
let navScrollRefresh = null;

/** Recomputes the scroll classes (compact, hidden, scrolled) for the current render. */
export function refreshNavScroll() {
  navScrollRefresh?.();
}

/** Until when a jump to a spot on the page holds a hiding menu in view (performance.now()). */
let jumpHoldUntil = 0;

/**
 * Holds a menu that hides on scroll in view while a jump to a spot on the page runs, so the spot lands under the bar.
 * @param {number} [ms] How long the jump may take
 */
export function holdNavForJump(ms = 1200) {
  jumpHoldUntil = Math.max(jumpHoldUntil, performance.now() + ms);
  navScrollRefresh?.();
}

/** The storage key a dismissed strip is remembered under, keyed by the message. */
const dismissKeyFor = (text) => `urd-announce-dismissed:${text}`;

/** Forgets the dismissal of the site's announcement, so the strip returns at the next render. */
export function clearAnnounceDismissal(site) {
  const announce = announcementModel(site?.nav?.announcement, site?.pages);
  if (!announce) return;
  try { localStorage.removeItem(dismissKeyFor(announce.text)); } catch { /* storage may be unavailable */ }
}

// Below 900px the side column renders as a regular top bar, an edge independent of the mobile breakpoint and the editor's viewport choice.
const narrowMq = window.matchMedia('(max-width: 900px)');
let lastRender = null;
narrowMq.addEventListener('change', () => {
  const variant = lastRender?.site.nav.variant;
  if (variant === 'side-left' || variant === 'side-right') {
    renderNav(lastRender.site, lastRender.host, lastRender.pageId);
  }
});

const svg = (path) =>
  `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${path}</svg>`;
const CHEVRON = svg('<path d="M6 9l6 6 6-6"/>');
/** The burger's drawings, by the id burgerModel gives; `none` leaves the word to stand alone. */
const BURGER_SVGS = {
  lines: svg('<path d="M4 6h16M4 12h16M4 18h16"/>'),
  handle: svg('<path d="M4 9h16M4 15h16"/>'),
  dots: svg('<g fill="currentColor" stroke="none"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></g>'),
  grid: svg('<g fill="currentColor" stroke="none"><circle cx="6" cy="6" r="1.6"/><circle cx="12" cy="6" r="1.6"/><circle cx="18" cy="6" r="1.6"/><circle cx="6" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="18" cy="12" r="1.6"/><circle cx="6" cy="18" r="1.6"/><circle cx="12" cy="18" r="1.6"/><circle cx="18" cy="18" r="1.6"/></g>'),
  none: '',
};
const SUN = svg('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>');
const MOON = svg('<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>');
const CROSS = svg('<path d="M6 6l12 12M18 6L6 18"/>');

/** Every class a render may put on the host; all are taken off before a render decides which apply. */
const HOST_CLASSES = ['urd-nav-float', 'urd-nav-overlay', 'urd-nav-side-host', 'urd-nav-side-host-left', 'urd-nav-side-host-right', 'urd-nav-clear',
  'urd-nav-side-subs-open', 'urd-nav-side-sub-arrow', 'urd-nav-tools-align-start', 'urd-nav-tools-align-center', 'urd-nav-tools-align-end', 'urd-nav-tools-align-spread',
  'urd-nav-tuck', 'urd-nav-tuck-hover', 'urd-nav-tuck-ghost', 'urd-nav-tuck-tab', 'urd-nav-peek', 'urd-nav-shown'];

/** How close to the top edge the pointer must be, in px, for a tucked menu to answer. */
const TUCK_EDGE = 24;
/** How long the pointer rests on the ghost before it turns solid, and how long the menu stays after the pointer has left. */
const GHOST_SETTLE = 350;
const TUCK_LEAVE = 300;

/** The measured clearances a render writes on the root element. */
const ROOT_VARS = ['--urd-nav-h', '--urd-nav-h-base', '--urd-announce-h', '--urd-nav-own-h', '--urd-announce-page-h', '--urd-scroll-clear'];

/** Whether the visitor has closed the strip with this text. */
function dismissedNow(key) {
  try { return localStorage.getItem(key) === '1'; } catch { return false; }
}

/**
 * The announcement strip: words or link, colours, closing cross; closed here, or elsewhere while this page was prerendered or cached, it leaves and calls onGone.
 * @param {object} announce announcementModel's result
 * @param {AbortSignal} signal The render's listeners
 * @param {() => void} onGone Called after the strip has left
 */
function stripElement(announce, signal, onGone) {
  const key = dismissKeyFor(announce.text);
  const el = document.createElement('div');
  el.className = 'urd-nav-announce';
  const inner = document.createElement(announce.link ? 'a' : 'span');
  inner.className = 'urd-nav-announce-text';
  inner.textContent = announce.text;
  if (announce.link) Object.assign(inner, linkAttrs(announce.link));
  if (announce.bg) el.style.setProperty('--urd-announce-bg', announce.bg);
  if (announce.color) el.style.setProperty('--urd-announce-text', announce.color);
  el.appendChild(inner);
  if (!announce.dismiss) return el;
  const leave = () => {
    if (!el.isConnected) return;
    el.remove();
    onGone();
  };
  const cross = document.createElement('button');
  cross.type = 'button';
  cross.className = 'urd-nav-announce-close';
  cross.setAttribute('aria-label', t('nav.dismissAnnouncement'));
  cross.innerHTML = CROSS;
  cross.addEventListener('click', () => {
    try { localStorage.setItem(key, '1'); } catch { /* storage may be unavailable */ }
    leave();
  }, { signal });
  el.appendChild(cross);
  const recheck = () => { if (dismissedNow(key)) leave(); };
  if (document.prerendering) document.addEventListener('prerenderingchange', recheck, { once: true, signal });
  window.addEventListener('pageshow', (event) => { if (event.persisted) recheck(); }, { signal });
  return el;
}

/** The strip on a page the menu is hidden from while the strip is not: alone at the top of the page, in the flow before the content. */
function placeStripAlone(el) {
  el.id = 'urd-announce';
  el.classList.add('urd-announce-content');
  const root = document.getElementById('urd-root');
  if (root) root.before(el); else document.body.prepend(el);
}

/**
 * @param {object} site site.json, already parsed
 * @param {HTMLElement} host Element the navigation is built into
 * @param {string} [pageId] The page being rendered; the menu stays off the pages listed in nav.hideOn, the strip off those in nav.announcement.hideOn
 */
export function renderNav(site, host, pageId) {
  const was = readMenu?.() ?? null;
  readMenu = null;
  navController?.abort();
  navController = new AbortController();
  const signal = navController.signal;
  navScrollRefresh = null;
  lastRender = { site, host, pageId };
  // The site's own breakpoint; the listener and the burger class are wired further down, where the nav element exists.
  const mobileMq = window.matchMedia(`(max-width: ${site.breakpoints?.mobile ?? 640}px)`);

  // An open full-screen menu stays open through the render, its dialog and bar kept, while this render wants it too and the phone state holds.
  const keep = keepsSheet({
    sheetOpen: Boolean(was?.sheet?.open),
    sameHost: was?.nav.parentNode === host,
    mode: mobileMenuMode(site.nav.style),
    phoneState: mobileMq.matches || document.body.classList.contains('urd-mobile') || Boolean(was?.folded),
  });
  const keptNav = keep ? was.nav : null;
  const keptSheet = keep ? was.sheet : null;
  // The host is emptied but for a kept bar, which in turn keeps only its open dialog; the bar's own style is written again below.
  for (const child of [...host.childNodes]) if (child !== keptNav) child.remove();
  if (keptNav) {
    for (const child of [...keptNav.childNodes]) if (child !== keptSheet) child.remove();
    keptNav.removeAttribute('style');
  }
  // A strip placed outside the nav host by the previous render leaves with it.
  document.getElementById('urd-announce')?.remove();
  // On a page the menu stays off (nav.hideOn), hideMode hidden hides the host and clears its classes and clearances; the other modes tuck it above the top edge.
  const tucked = navHidden(site.nav, pageId) ? hideMode(site.nav) : 'hidden';
  if (navHidden(site.nav, pageId) && tucked === 'hidden') {
    if (keptNav) {
      keptSheet.close();
      keptNav.remove();
    }
    host.style.display = 'none';
    host.classList.remove(...HOST_CLASSES, 'urd-nav-sticky', 'urd-nav-announce-scroll', 'urd-nav-announce-keep', 'urd-nav-scroll', 'urd-nav-compact', 'urd-nav-hidden', 'urd-nav-scrolled');
    document.body.classList.remove('urd-side-left', 'urd-side-right');
    document.body.style.removeProperty('--urd-nav-side-width');
    for (const name of ROOT_VARS) document.documentElement.style.setProperty(name, '0px');
    // The strip has a list of its own: on a page it is not kept off, it stands alone at the top.
    const alone = announcementModel(site.nav.announcement, site.pages, pageId);
    if (alone && !(alone.dismiss && dismissedNow(dismissKeyFor(alone.text)))) placeStripAlone(stripElement(alone, signal, () => {}));
    return;
  }
  host.style.removeProperty('display');

  // A tucked menu is a plain top bar, the side column a top bar on narrow windows, and the phone's nav.style.mobile overrides apply at the breakpoint.
  const isTucked = tucked !== 'hidden';
  const wantsSide = !isTucked && (site.nav.variant === 'side-left' || site.nav.variant === 'side-right');
  const baseNav = isTucked
    ? { ...site.nav, variant: 'bar', overlay: false, sticky: true, scroll: undefined, style: { ...(site.nav.style ?? {}), atTop: undefined } }
    : wantsSide && narrowMq.matches ? { ...site.nav, variant: 'bar' } : site.nav;
  const effSite = { ...site, nav: effectiveNav(baseNav, { mobile: mobileMq.matches }) };

  // The announcement strip above the menu (nav.announcement); a dismissed one stays away while the message is the same, kept in localStorage by its text.
  const announce = announcementModel(site.nav.announcement, site.pages, pageId);
  let announceEl = null;
  if (announce && !(announce.dismiss && dismissedNow(dismissKeyFor(announce.text)))) {
    announceEl = stripElement(announce, signal, () => {
      announceEl = null;
      setNavH();
    });
    // The side column places the strip in the column, fixed across the page, or above the content beside it; the other variants carry it inside the host.
    const place = wantsSide && !narrowMq.matches ? announce.place : 'nav';
    if (place === 'page') {
      announceEl.id = 'urd-announce';
      announceEl.classList.add('urd-announce-page');
      document.body.prepend(announceEl);
    } else if (place === 'content') {
      announceEl.id = 'urd-announce';
      announceEl.classList.add('urd-announce-content');
      const root = document.getElementById('urd-root');
      if (root) root.before(announceEl); else document.body.prepend(announceEl);
    } else {
      // Before a kept bar, where a new bar would follow it.
      host.insertBefore(announceEl, keptNav);
    }
  }
  // Whether the strip scrolls away: it is not sticky, and the host is sticky and in the flow, not floating, overlaid or the side column.
  const announceScrolls = !!announce && !announce.sticky && site.nav.sticky !== false
    && !hostClasses(effSite).host.some((cls) => cls === 'urd-nav-float' || cls === 'urd-nav-overlay' || cls === 'urd-nav-side-host');
  host.classList.toggle('urd-nav-announce-scroll', announceScrolls);

  const nav = keptNav ?? document.createElement('nav');
  // layout: where the menu items sit; the logo, where it is shown, is first and doubles as the "Home" button.
  nav.className = navClasses(effSite, { mobile: mobileMq.matches });
  // The burger follows the actual width through the nav's own class, since in the preview the editor's viewport choice owns body.urd-mobile.
  mobileMq.addEventListener('change', () => renderNav(lastRender.site, lastRender.host, lastRender.pageId), { signal });
  if (mobileMq.matches) nav.classList.add('urd-nav-mobile');
  // Sticky (the default) sits on the host, not the nav: a sticky element never leaves its parent, and that parent is exactly as tall as the nav.
  host.classList.toggle('urd-nav-sticky', effSite.nav.sticky !== false);
  // The variant drives the host and body classes, floating out of the flow and the side column fixed with body padding, all toggled on every render.
  const hc = hostClasses(effSite);
  if (isTucked) hc.host.push('urd-nav-tuck', `urd-nav-tuck-${tucked}`);
  for (const cls of HOST_CLASSES) {
    host.classList.toggle(cls, hc.host.includes(cls));
  }
  for (const cls of ['urd-side-left', 'urd-side-right']) {
    document.body.classList.toggle(cls, hc.body.includes(cls));
  }
  // The side column's width: set on body so both the column and the content padding read the same value.
  const isSide = hc.body.length > 0;
  if (isSide) {
    document.body.style.setProperty('--urd-nav-side-width', `${clampSideWidth(site.nav.style?.width)}px`);
  } else {
    document.body.style.removeProperty('--urd-nav-side-width');
  }
  // Whether the bar is folded to the burger by its content (evalFold below); a bar the previous render folded stays folded until it is measured again.
  let contentFolded = Boolean(was?.folded && !isSide && !mobileMq.matches);
  if (contentFolded) nav.classList.add('urd-nav-mobile');

  // Scroll behaviour (nav.scroll): 'shrink' shrinks the menu after some scrolling, 'hide' hides it going down and shows it going up; for a sticky top bar only.
  const scrollMode = effSite.nav.scroll;
  const wantsScroll = (scrollMode === 'shrink' || scrollMode === 'hide')
    && !isSide && effSite.nav.sticky !== false;
  // A strip that does not follow the menu out (announcement.followNav false) keeps its place while the hiding bar passes behind it.
  host.classList.toggle('urd-nav-announce-keep',
    !!announceEl && host.contains(announceEl) && wantsScroll && scrollMode === 'hide' && !announce.followNav);
  // Transparent at the top (nav.style.atTop 'clear'): the surface appears once the page has left the top zone (urd-nav-scrolled), sticky or not.
  const clearTop = host.classList.contains('urd-nav-clear');
  host.classList.toggle('urd-nav-scroll', wantsScroll);
  if (!wantsScroll && !clearTop) {
    host.classList.remove('urd-nav-compact', 'urd-nav-hidden', 'urd-nav-scrolled');
  } else {
    let anchor = window.scrollY;
    let hidden = false;
    let ticking = false;
    const applyScroll = () => {
      const menuOpen = nav.classList.contains('urd-nav-open');
      const y = window.scrollY;
      // With the mobile panel open the menu keeps its full size, stays visible and draws its surface, so the panel has something to hang from.
      const state = menuOpen
        ? { compact: false, hidden: false, scrolled: true, anchor: y }
        : navScrollState(wantsScroll ? scrollMode : undefined, anchor, y, hidden,
          { shrinkAt: effSite.nav.style?.shrinkAt, hold: performance.now() < jumpHoldUntil });
      // The turning point the travel is measured from; navScrollState owns where it goes, the render only carries it between frames.
      anchor = state.anchor;
      hidden = state.hidden;
      host.classList.toggle('urd-nav-compact', state.compact);
      host.classList.toggle('urd-nav-hidden', state.hidden);
      host.classList.toggle('urd-nav-scrolled', state.scrolled);
    };
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        applyScroll();
      });
    }, { passive: true, signal });
    navScrollRefresh = applyScroll;
    applyScroll();
  }

  // Appearance (nav.style): background colour with opacity, blur and text colour, the background set as a CSS variable.
  const surface = navSurface(site.nav.style);
  // A layer background (nav.style.background) is drawn behind the nav content with the sections' layer stack, and takes over the surface.
  const navBg = site.nav.style?.background;
  const hasNavBgLayers = Array.isArray(navBg?.layers) && navBg.layers.length > 0;
  if (hasNavBgLayers) {
    const backdrop = document.createElement('div');
    backdrop.className = 'urd-nav-bg';
    renderBackgroundLayers(backdrop, navBg);
    nav.insertBefore(backdrop, keptSheet);
    // The layers define the surface: the nav element's own background is made transparent (blur/frosted glass still works through it).
    nav.style.setProperty('--urd-nav-bg', 'transparent');
    // The submenu and mobile panel inherit the color layers as one flattened veil, so the dropdown follows the bar's tone instead of the default veil.
    const layerVeil = navLayerVeil(navBg.layers);
    if (layerVeil) nav.style.setProperty('--urd-nav-sub-bg', layerVeil);
  } else if (surface.bg) {
    nav.style.setProperty('--urd-nav-bg', surface.bg);
  }
  // Blur runs through a custom property, which inherits to the submenus and phone panel where backdrop-filter does not.
  if (surface.blur === false) nav.style.setProperty('--urd-nav-blur', 'none');
  if (surface.color) nav.style.color = surface.color;
  // The submenu and phone panel get their own surface, the colour veil without the image unless subImage is on; a layer background skips it.
  const subBg = navSubSurface(site.nav.style);
  if (subBg && !hasNavBgLayers) nav.style.setProperty('--urd-nav-sub-bg', subBg);
  // Hover colors: the effect color (underline/pill surface/glow) and the text color on hover; without a choice the accent color applies.
  if (site.nav.style?.hoverColor) {
    nav.style.setProperty('--urd-nav-hover', resolveColor(site.nav.style.hoverColor));
  }
  if (site.nav.style?.hoverTextColor) {
    nav.style.setProperty('--urd-nav-hover-text', resolveColor(site.nav.style.hoverTextColor));
  }
  // Glow strength for the lift-with-glow hover style (0..1, default 0.6):
  // set as a finished percentage, so the CSS color-mix can use the value directly.
  const glowStrength = Number(site.nav.style?.hoverGlow);
  if (Number.isFinite(glowStrength)) {
    nav.style.setProperty('--urd-nav-hover-glow', `${Math.round(Math.min(1, Math.max(0, glowStrength)) * 100)}%`);
  }
  // The pill items' own color (subStyle pills); without a choice the submenu surface is used.
  if (site.nav.style?.subPillColor) {
    nav.style.setProperty('--urd-nav-sub-pill', resolveColor(site.nav.style.subPillColor));
  }
  // Submenu columns (n x n): the items are laid out in a grid with the chosen column count.
  const subCols = Math.round(Number(site.nav.style?.subColumns));
  if (subCols >= 2) nav.style.setProperty('--urd-nav-sub-cols', String(Math.min(4, subCols)));
  // Size (ADR-0023): thickness, padding, gap, text size, pill width and shrink as custom properties from navSizeVars, the phone's values chosen at the breakpoint.
  const size = navSizeVars(effSite.nav.style, site.nav.logo, { mobile: mobileMq.matches });
  for (const [name, value] of Object.entries(size.vars)) nav.style.setProperty(name, value);
  // Border: the side is a class from navClasses; the width and colour are variables with a hairline in the text colour as the default.
  const border = effSite.nav.style?.border;
  if (border && typeof border === 'object') {
    nav.style.setProperty('--urd-nav-border-w', `${clampBorderWidth(border.width)}px`);
    if (border.color) nav.style.setProperty('--urd-nav-border-c', resolveColor(border.color));
  }

  const logoDef = site.nav.logo ?? { type: 'text', value: site.site.title };
  const logo = document.createElement('a');
  logo.className = 'urd-nav-logo';
  logo.href = '/';
  logo.title = t('nav.toFront');

  const logoImg = (src) => {
    const img = document.createElement('img');
    img.src = src;
    img.alt = site.site.title;
    // The logo's height goes in a base variable the CSS draws from, so the scroll shrink can scale it and the bar never grows with the image.
    img.style.setProperty('--urd-logo-base', `${size.logoSize}px`);
    if (logoDef.radius) img.style.borderRadius = `${logoDef.radius}px`;
    return img;
  };
  // The logo text can be styled independently of the theme; the default is the theme's heading font in bold.
  const logoText = () => {
    const span = document.createElement('span');
    span.textContent = logoDef.value || site.site.title;
    if (logoDef.font) span.style.fontFamily = logoDef.font;
    if (size.logoTextSize) span.style.fontSize = `${size.logoTextSize}px`;
    if (logoDef.bold === false) span.style.fontWeight = '400';
    if (logoDef.italic) span.style.fontStyle = 'italic';
    return span;
  };

  // An unsafe image source falls back to the logo text (same guard as the nav background and the favicon), so the menu never lacks a brand mark.
  if (logoDef.type === 'image' && isSafeImage(logoDef.value)) {
    logo.appendChild(logoImg(logoDef.value));
  } else if (logoDef.type === 'both' && isSafeImage(logoDef.image)) {
    // Image plus text, in the chosen order; on the phone the one of them the owner chose, where one is chosen (nav.logo.mobileParts).
    const parts = logoParts(logoDef, { mobile: mobileMq.matches });
    if (parts === 'image') {
      logo.appendChild(logoImg(logoDef.image));
    } else if (parts === 'text') {
      logo.appendChild(logoText());
    } else if ((logoDef.order ?? 'image-first') === 'image-first') {
      logo.append(logoImg(logoDef.image), logoText());
    } else {
      logo.append(logoText(), logoImg(logoDef.image));
    }
  } else {
    logo.appendChild(logoText());
  }
  // The logo stands in the bar unless nav.logo.show is false, placed ahead of a kept full-screen menu, where a new one would follow it.
  const showLogo = logoDef.show !== false;
  if (showLogo) nav.insertBefore(logo, keptSheet);
  nav.classList.toggle('urd-nav-no-logo', !showLogo);

  // The tool cluster: its tools in the owner's order (nav.style.tools.order), and the burger, the phone menu's opener.
  const tools = document.createElement('span');
  tools.className = 'urd-nav-tools';
  /** @type {Record<string, HTMLElement|null>} The built tools, by id */
  const toolEls = { launcher: null, cart: null, theme: null, links: null };

  // The link launcher (nav.launcher): a button opens its shortcuts on desktop, and on the phone they are a section at the foot of the menu list.
  const launcher = launcherModel(site.nav?.launcher, site.pages ?? []);
  // Its code and sheet come with the site that shows it (nav-launcher.js, features.js); without them the menu stands without the launcher.
  const launcherPart = feature('launcher');
  const launcherWrap = launcher && launcherPart ? launcherPart.buildLauncher(launcher, signal) : null;
  if (launcherWrap) toolEls.launcher = launcherWrap.el;
  // A shortcut whose target is not a usable link still gets its tile, but the tile goes nowhere: say so, the way an unknown page in the menu is reported.
  const broken = launcher?.links.filter((link) => link.missing).length ?? 0;
  if (broken) console.warn(`Urd: ${broken} launcher shortcut(s) have no usable target`);

  // The cart in the menu (the shop, additive nav.cart): a button with a count badge that opens the same cart drawer as the cart block.
  if (site.nav?.cart?.show) {
    const cartCfg = site.nav.cart;
    const cartBtn = document.createElement('button');
    cartBtn.className = 'urd-nav-cart';
    cartBtn.type = 'button';
    cartBtn.setAttribute('aria-label', t('shop.cart'));
    cartBtn.innerHTML = `${iconSvg('cart') ?? ''}<span class="urd-nav-tool-label">${t('shop.cart')}</span>`;
    const cartBadge = document.createElement('span');
    cartBadge.className = 'urd-nav-cart-badge';
    cartBadge.hidden = true;
    cartBtn.appendChild(cartBadge);
    // The checkout page: a page in the register (cart.page) or a path (cart.href).
    const checkoutLink = resolveLink(cartCfg, site.pages ?? []);
    // The basket's drawer is the cart block's, loaded with its sheet only when a nav with a basket is drawn; a press while it loads opens it as it comes.
    let drawer = null;
    const drawerReady = Promise.all([import('./blocks/cart.js'), loadBlockSheet('cart')]).then(([{ createCartDrawer }]) => {
      if (!cartBtn.isConnected) return null;
      drawer = createCartDrawer({ href: checkoutLink.missing ? '' : checkoutLink.href, currency: cartCfg.currency || 'kr' });
      nav.insertBefore(drawer.dialog, keptSheet?.parentNode === nav ? keptSheet : null);
      return drawer;
    }, () => null);
    const shop = feature('shop');
    const paintCart = () => {
      const count = shop ? shop.cartCount(shop.readCart()) : 0;
      cartBadge.textContent = String(count);
      cartBadge.hidden = count === 0;
    };
    paintCart();
    // Tied to the button, which leaves the page with its render, and the listener with it; the bar itself can stay through a render.
    shop?.onCartChange(cartBtn, () => {
      paintCart();
      drawer?.refresh();
    });
    // Without its drawer (the module could not be loaded) the basket opens the checkout page.
    cartBtn.addEventListener('click', () => {
      drawerReady.then((ready) => {
        if (ready) ready.open();
        else if (!checkoutLink.missing && checkoutLink.href) location.assign(checkoutLink.href);
      });
    }, { signal });
    toolEls.cart = cartBtn;
  }

  // The light/dark button: there when the theme has an alt counterpart to switch to, unless the owner has taken it out of the cluster.
  if (site.theme?.alt?.tokens && site.nav.style?.tools?.theme !== false) {
    const themeBtn = document.createElement('button');
    themeBtn.className = 'urd-nav-theme';
    themeBtn.type = 'button';
    const paintToggle = () => {
      const dark = themeMode() === 'dark';
      // The icon shows the mode you SWITCH TO (the convention people know).
      const label = dark ? t('nav.toLightTheme') : t('nav.toDarkTheme');
      themeBtn.innerHTML = `${dark ? SUN : MOON}<span class="urd-nav-tool-label">${label}</span>`;
      themeBtn.setAttribute('aria-label', label);
    };
    paintToggle();
    themeBtn.addEventListener('click', () => {
      toggleThemeMode(site.theme);
      paintToggle();
    }, { signal });
    toolEls.theme = themeBtn;
  }

  // The site's links (links-model.js) as icons in the cluster, when the owner switched the tool on.
  if (site.nav?.style?.tools?.links === true) {
    const links = siteLinks(site);
    if (links.length) {
      const wrap = document.createElement('span');
      wrap.className = 'urd-nav-links';
      for (const link of links) {
        const a = document.createElement('a');
        a.className = 'urd-nav-link';
        a.href = link.url;
        a.rel = 'noopener noreferrer';
        if (leavesSite(link.url)) a.target = '_blank';
        a.setAttribute('aria-label', link.label);
        a.title = link.label;
        a.innerHTML = `${linkIconHtml(link)}<span class="urd-nav-tool-label"></span>`;
        a.querySelector('.urd-nav-tool-label').textContent = link.label;
        wrap.appendChild(a);
      }
      toolEls.links = wrap;
    }
  }

  for (const id of toolOrder(site.nav.style)) {
    if (toolEls[id]) tools.appendChild(toolEls[id]);
  }

  // The burger opens the menu list as a non-modal dropdown, or the full-screen sheet the list moves into; its drawing and word come from nav.style.burger.
  const burgerLook = burgerModel(site.nav.style);
  const burgerName = burgerLook.label || t('nav.menu');
  const burger = document.createElement('button');
  burger.className = 'urd-nav-burger';
  burger.type = 'button';
  burger.setAttribute('aria-expanded', 'false');
  burger.setAttribute('aria-controls', 'urd-nav-menu');
  burger.setAttribute('aria-label', burgerName);
  burger.innerHTML = BURGER_SVGS[burgerLook.icon];
  if (burgerLook.showLabel) {
    const word = document.createElement('span');
    word.className = 'urd-nav-burger-label';
    word.textContent = burgerName;
    burger.appendChild(word);
  }
  // The burger ends the row, except when the cluster stands at the start, where it takes the outer edge so it sits leftmost on mobile.
  if (effSite.nav.style?.tools?.side === 'start' && !isSide) tools.prepend(burger);
  else tools.appendChild(burger);
  // A cluster with nothing but the burger takes no room on desktop.
  tools.classList.toggle('urd-nav-tools-none', !Object.values(toolEls).some(Boolean));

  const list = document.createElement('ul');
  list.className = 'urd-nav-list';
  list.id = 'urd-nav-menu';

  // The phone menu's own look: where its text stands, the submenu arrow, and whether the bar keeps its tools beside the full-screen menu.
  const phoneMenu = phoneMenuModel(site.nav.style);
  const sheet = mobileMenuMode(site.nav.style) === 'sheet'
    ? buildSheet(nav, { list, tools, burger, logo: showLogo && site.nav.style?.sheetLogo === true ? logo : null, announce: () => (site.nav.style?.sheetAnnounce === true ? announceEl : null), withTheme: site.nav.style?.sheetTheme === true, withCart: site.nav.style?.sheetCart === true, barTools: phoneMenu.barTools, labels: site.nav.style?.sheetToolLabels === true, motion: sheetMotion(site.nav.style), surface: navSurface(site.nav.style?.sheet ?? {}), kept: keptSheet }, signal)
    : null;
  // On the sheet's close the strip is back in the host, so setNavH measures the clearance again; this runs after buildSheet's own close listener.
  if (sheet) sheet.dialog.addEventListener('close', () => setNavH(), { signal });
  const isMobileOpen = () => (sheet ? sheet.dialog.open : nav.classList.contains('urd-nav-open'));
  // The mobile state as the CSS sees it: the breakpoint, content folding, or the editor's viewport choice in the preview (body.urd-mobile).
  const isMobileState = () => mobileMq.matches || nav.classList.contains('urd-nav-mobile') || document.body.classList.contains('urd-mobile');
  const subMode = mobileSubMode(site.nav.style);
  const expandedSubs = () => (subMode === 'expanded' && isMobileState()) || (hc.host.includes('urd-nav-side-subs-open') && !isMobileState());
  const setMobileOpen = (open) => {
    if (sheet) {
      if (open && !sheet.dialog.open) sheet.show();
      else if (!open && sheet.dialog.open) sheet.dialog.close();
    } else {
      nav.classList.toggle('urd-nav-open', open);
    }
    burger.setAttribute('aria-expanded', String(open));
    // Every submenu starts open in the expanded mode.
    if (open && expandedSubs()) for (const entry of subs) setOpen(entry, true);
    // The top-zone surface follows the panel: a bar that is clear at the top draws its surface while the panel hangs from it.
    navScrollRefresh?.();
  };
  if (sheet) sheet.dialog.addEventListener('close', () => burger.setAttribute('aria-expanded', 'false'), { signal });
  burger.addEventListener('click', () => {
    setMobileOpen(!isMobileOpen());
  }, { signal });

  /** Every opener with its submenu, at every level, in document order (a parent before its children). */
  const subs = [];
  const setOpen = (entry, open) => {
    entry.li.classList.toggle('open', open);
    entry.button.setAttribute('aria-expanded', String(open));
    markLink(entry);
    // A closing submenu takes its open inner levels with it, so the panel never reopens with a stale inner level; a headed group stays as it is.
    if (!open) {
      for (const inner of subs) {
        if (inner !== entry && entry.li.contains(inner.li) && inner.li.classList.contains('open') && !isFixed(inner)) setOpen(inner, false);
      }
    }
  };
  // The column can keep every submenu open from the start (nav.style.sideSubs); without the arrow (nav.style.sideSubArrow) nothing closes them.
  const columnExpanded = hc.host.includes('urd-nav-side-subs-open');
  const columnFixedOpen = columnExpanded && !hc.host.includes('urd-nav-side-sub-arrow');
  // A child's own submenu stands as a headed group when the submenu is laid out in columns or as the flyout (navClasses sets the class the CSS reads).
  const grouped = subGrouped(site.nav.style);
  /** Whether an opener stands open with nothing to close it: off the phone a headed group or the open column without arrows; on the phone, all open without arrows. */
  const isFixed = (entry) => (isMobileState() ? subMode === 'expanded' && !phoneMenu.arrow : columnFixedOpen || entry.grouped);
  /** On a phone with submenus that start closed, a split item's own link carries its opener's state; elsewhere the link only leads to its page. */
  const markLink = (entry) => {
    if (!entry.link) return;
    if (subMode === 'collapsed' && isMobileState()) {
      entry.link.setAttribute('aria-expanded', String(entry.li.classList.contains('open')));
      entry.link.setAttribute('aria-controls', entry.button.getAttribute('aria-controls'));
    } else {
      entry.link.removeAttribute('aria-expanded');
      entry.link.removeAttribute('aria-controls');
    }
  };
  /** A fixed opener leaves the tab order and reads as a heading, not a button that cannot collapse; it is applied again as the bar folds or unfolds. */
  const applyFixed = () => {
    for (const entry of subs) {
      const fixed = isFixed(entry);
      entry.button.tabIndex = fixed ? -1 : 0;
      if (fixed) entry.button.setAttribute('aria-disabled', 'true');
      else entry.button.removeAttribute('aria-disabled');
      if (fixed) setOpen(entry, true);
      markLink(entry);
    }
  };
  const closeAll = (except) => {
    for (const entry of subs) {
      // The openers above the one kept stay open: closing a parent would take the panel from under the pointer.
      if (entry === except || (except && entry.li.contains(except.li)) || isFixed(entry)) continue;
      setOpen(entry, false);
    }
  };

  // Hover opens submenus only with a real pointer, as nav.style.subOpen allows, and click always works; in the side column hover never closes a single item.
  const isColumn = hc.host.includes('urd-nav-side-host');
  const { hoverOpens, hoverCloses } = subOpenMode(site.nav.style);
  const mouseHover = hoverOpens && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /** The item's words inside its link or opener: the label alone, or the label over its one-line description. */
  const fillLabel = (el, item) => {
    if (!item.description) {
      el.textContent = item.label;
      return;
    }
    const label = document.createElement('span');
    label.className = 'urd-nav-label';
    label.textContent = item.label;
    const desc = document.createElement('span');
    desc.className = 'urd-nav-desc';
    desc.textContent = item.description;
    el.append(label, desc);
  };
  const makeLink = (target) => {
    const a = document.createElement('a');
    Object.assign(a, linkAttrs(target));
    fillLabel(a, target);
    return a;
  };

  /**
   * One menu item as a list row, its submenu built the same way one level down.
   * `path` is the item's place in the menu and names the submenu.
   * @param {object} item From navItems
   * @param {number} depth 0 in the bar, 1 to 3 in the submenus
   * @param {string} path
   * @returns {HTMLLIElement}
   */
  const buildItem = (item, depth, path) => {
    if (item.missing && !item.external) {
      console.warn(`Urd: nav item points to unknown page (${item.label})`);
    }
    const li = document.createElement('li');
    // A call to action drawn as a button, in the bar and in the mobile menu alike.
    if (item.look === 'button') li.className = 'urd-nav-btn';

    if (item.kind === 'link') {
      li.appendChild(makeLink(item));
      return li;
    }

    // Item with a submenu: 'split' = link plus its own arrow button (the page stays reachable); 'toggle' = one button carries both the title and the arrow.
    li.classList.add('urd-nav-has-sub');
    const subId = `urd-nav-sub-${path}`;
    const button = document.createElement('button');
    button.type = 'button';
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-controls', subId);

    let link = null;
    if (item.kind === 'split') {
      link = makeLink(item);
      // With collapsed submenus on the phone, the item's own link opens its submenu, and the item's page stands first in the submenu instead.
      if (subMode === 'collapsed') {
        link.addEventListener('click', (event) => {
          if (!isMobileState()) return;
          event.preventDefault();
          button.click();
        }, { signal });
      }
      li.appendChild(link);
      button.className = 'urd-nav-caret';
      button.setAttribute('aria-label', t('nav.submenuFor', { label: item.label }));
      button.innerHTML = CHEVRON;
    } else {
      button.className = 'urd-nav-toggle';
      const title = document.createElement('span');
      fillLabel(title, item);
      button.appendChild(title);
      button.insertAdjacentHTML('beforeend', CHEVRON);
    }
    li.appendChild(button);

    const entry = { li, button, link, grouped: grouped && depth > 0 };
    subs.push(entry);

    const sub = document.createElement('ul');
    sub.className = 'urd-nav-sub';
    sub.id = subId;
    if (subMode === 'collapsed' && item.kind === 'split') {
      const selfLi = document.createElement('li');
      selfLi.className = 'urd-nav-sub-self';
      selfLi.appendChild(makeLink(item));
      sub.appendChild(selfLi);
    }
    item.children.forEach((child, j) => sub.appendChild(buildItem(child, depth + 1, `${path}-${j}`)));
    li.appendChild(sub);

    button.addEventListener('click', () => {
      if (isFixed(entry)) return;
      const open = !li.classList.contains('open');
      // The accordion closes the others, except in the expanded mobile mode where every submenu stands on its own.
      if (!expandedSubs()) closeAll(entry);
      setOpen(entry, open);
    }, { signal });

    if (mouseHover && !columnExpanded && !entry.grouped) {
      // Real mouse only, so a tap on a hybrid device never opens on enter and closes on click; hover never opens or closes the mobile menu.
      let closeTimer = null;
      li.addEventListener('pointerenter', (event) => {
        if (event.pointerType !== 'mouse' || isMobileState()) return;
        clearTimeout(closeTimer);
        // In the column, other accordions stay open: closing moves the items under the pointer.
        // Closing happens collectively when the menu is left.
        if (!isColumn) closeAll(entry);
        setOpen(entry, true);
      }, { signal });
      if (!isColumn && hoverCloses) {
        li.addEventListener('pointerleave', (event) => {
          if (event.pointerType !== 'mouse' || isMobileState()) return;
          clearTimeout(closeTimer);
          closeTimer = setTimeout(() => setOpen(entry, false), HOVER_CLOSE_DELAY);
        }, { signal });
      }
    }

    // Tabbing out of the item closes the submenu - focus must never leave an open menu behind.
    li.addEventListener('focusout', (event) => {
      if (expandedSubs() || isFixed(entry)) return;
      if (!li.contains(event.relatedTarget)) setOpen(entry, false);
    }, { signal });

    return li;
  };

  navItems(site).forEach((item, index) => list.appendChild(buildItem(item, 0, String(index))));
  applyFixed();
  if (columnExpanded && !isMobileState()) for (const entry of subs) setOpen(entry, true);

  // The launcher's shortcuts as a section at the foot of the phone menu list (launcherRow in nav-launcher.js).
  if (launcher && launcherPart) list.appendChild(launcherPart.launcherRow(launcher));

  // A link in the dropdown panel or an open submenu closes them, so a spot on this page shows; a cancelled link leaves them open, and the sheet closes itself.
  list.addEventListener('click', (event) => {
    if (event.defaultPrevented || !event.target.closest('a[href]')) return;
    if (!expandedSubs()) closeAll();
    if (!sheet && nav.classList.contains('urd-nav-open')) setMobileOpen(false);
  }, { signal });

  nav.appendChild(list);
  nav.appendChild(tools);
  // A kept bar is in the host already; moving it would close the dialog inside it.
  if (nav.parentNode !== host) host.appendChild(nav);
  // The menu height while it is not shrunk, kept across the scroll shrink.
  let navHBase = 0;
  // Measured at once, so the first paint already has the menu's clearance; the observer below keeps it current.
  setNavH();

  // The phone menu comes back as the previous render left it while the phone state holds: open, its submenus and its scroll; else a kept sheet closes.
  if (was?.open && isMobileState()) {
    if (sheet?.kept) sheet.fill();
    setMobileOpen(true);
    // The submenus that were open open again (subsAfterRender); where every submenu starts open in both renders, one closed by hand stays closed.
    const idOf = (entry) => entry.button.getAttribute('aria-controls');
    const again = new Map(subsAfterRender(subs.filter((entry) => !isFixed(entry)).map(idOf), was, expandedSubs()));
    for (const entry of subs) if (again.has(idOf(entry))) setOpen(entry, again.get(idOf(entry)));
    (sheet ? sheet.body : list).scrollTop = was.scroll;
    // Focus that stood in the old contents left with them: the new close button takes it, only while the page has the focus, never from the editor around the preview.
    if (sheet?.kept && was.focusInside && document.hasFocus()) sheet.closeButton.focus();
  } else if (sheet?.kept) {
    sheet.dialog.close();
  }

  // Writes the menu's measured height on the root as --urd-nav-h, from the host's top to the nav's bottom, and the unshrunk height as --urd-nav-h-base.
  function setNavH() {
    // While the full-screen menu is open the strip stands in it and the host is short, so the page behind keeps the clearance it had.
    if (sheet?.dialog.open) return;
    // Above the edge the menu takes no room: the page starts at the top and a jump lands there too.
    if (isTucked) {
      for (const name of ROOT_VARS) document.documentElement.style.setProperty(name, '0px');
      host.style.setProperty('--urd-announce-h', `${announceEl?.offsetHeight ?? 0}px`);
      return;
    }
    const announceH = announceEl?.offsetHeight ?? 0;
    const scrolledAway = announceScrolls ? announceH : 0;
    // A strip fixed across the whole page: the column starts and the body is padded below it, and it is the column's only top clearance.
    const pageH = announceEl?.classList.contains('urd-announce-page') ? announceH : 0;
    const h = isSide ? pageH : nav.offsetTop + nav.offsetHeight - scrolledAway;
    document.documentElement.style.setProperty('--urd-nav-h', `${h}px`);
    // A render that starts mid-page measures the menu already shrunk; that first measurement stands until an unshrunk one arrives.
    if (!navHBase || !host.classList.contains('urd-nav-compact')) navHBase = h;
    document.documentElement.style.setProperty('--urd-nav-h-base', `${navHBase}px`);
    host.style.setProperty('--urd-announce-h', `${announceH}px`);
    // The strip's and the menu's own heights on the root, for backgrounds that keep clear of them; a strip in the column or beside the content counts as nothing.
    document.documentElement.style.setProperty('--urd-announce-h', `${isSide ? pageH : announceH}px`);
    document.documentElement.style.setProperty('--urd-nav-own-h', `${isSide ? 0 : Math.max(0, nav.offsetTop + nav.offsetHeight - announceH)}px`);
    document.documentElement.style.setProperty('--urd-announce-page-h', `${pageH}px`);
    setScrollClear();
  }

  // The room a jump to a spot leaves above it, scroll-padding-top in base.css; unlike --urd-nav-h-base it follows the scroll shrink.
  function setScrollClear() {
    if (sheet?.dialog.open || isTucked) return;
    // Written only when it changes: the observer reports every frame of the shrink.
    const announceH = announceEl?.offsetHeight ?? 0;
    const pageStrip = announceEl?.classList.contains('urd-announce-page') ? announceH : 0;
    const height = nav.offsetTop + nav.offsetHeight - (announceScrolls ? announceH : 0);
    const clear = `${scrollClear({ sticky: effSite.nav.sticky !== false, side: isSide, height, pageStrip })}px`;
    if (document.documentElement.style.getPropertyValue('--urd-scroll-clear') !== clear) {
      document.documentElement.style.setProperty('--urd-scroll-clear', clear);
    }
  }

  // Content-aware folding: items that do not fit the width fold the list to the burger, and it unfolds once the bar is wider than the remembered width (foldNeeds).
  let foldNeeds = 0;
  // The bar is measured again when the full-screen menu closes: while it is open, the list stands in the dialog and the bar would measure as fitting.
  const evalFold = () => {
    if (isSide || mobileMq.matches || sheet?.dialog.open) return;
    if (!nav.classList.contains('urd-nav-mobile')) {
      if (nav.scrollWidth > nav.clientWidth + 1) {
        foldNeeds = nav.scrollWidth;
        contentFolded = true;
        nav.classList.add('urd-nav-mobile');
        // The headed groups are accordions in the folded menu.
        applyFixed();
        if (!expandedSubs()) closeAll();
      }
    } else if (nav.clientWidth > foldNeeds + 8) {
      nav.classList.remove('urd-nav-mobile');
      if (nav.scrollWidth > nav.clientWidth + 1) {
        foldNeeds = nav.scrollWidth;
        nav.classList.add('urd-nav-mobile');
      } else {
        // The bar is back: the submenus the expanded mobile mode opened close with the panel, and the headed groups stand open again.
        contentFolded = false;
        setMobileOpen(false);
        closeAll();
        applyFixed();
      }
    }
  };
  if (sheet) sheet.dialog.addEventListener('close', () => evalFold(), { signal });

  // A ResizeObserver on the nav, not the host, catches window width, font loading and the scroll shrink, and measures once on observe.
  const navRo = new ResizeObserver(() => {
    setNavH();
    evalFold();
  });
  navRo.observe(nav);
  if (announceEl) navRo.observe(announceEl);
  // The shrink changes the menu's padding, which its content box never shows.
  const clearRo = new ResizeObserver(setScrollClear);
  clearRo.observe(nav, { box: 'border-box' });
  signal.addEventListener('abort', () => {
    navRo.disconnect();
    clearRo.disconnect();
  });

  // The column's hover closing: all accordions close together when the pointer leaves the whole menu; re-entering within the delay cancels the closing.
  if (isColumn && mouseHover && hoverCloses && !columnExpanded) {
    let columnTimer = null;
    nav.addEventListener('pointerenter', (event) => {
      if (event.pointerType !== 'mouse') return;
      clearTimeout(columnTimer);
    }, { signal });
    nav.addEventListener('pointerleave', (event) => {
      if (event.pointerType !== 'mouse') return;
      clearTimeout(columnTimer);
      columnTimer = setTimeout(() => closeAll(), HOVER_CLOSE_DELAY);
    }, { signal });
  }

  // In the preview a drag on the side column's inner edge sets its width live, and the release posts it to the editor (urd-nav-width).
  if (isSide && document.body.classList.contains('urd-preview')) {
    const grip = document.createElement('div');
    grip.className = 'urd-nav-side-resize';
    grip.title = ta('tip.nav.colResize');
    const rightSide = hc.host.includes('urd-nav-side-host-right');
    grip.addEventListener('pointerdown', (event) => {
      event.preventDefault();
      grip.setPointerCapture(event.pointerId);
      const startX = event.clientX;
      const startW = clampSideWidth(site.nav.style?.width);
      let width = startW;
      const onMove = (ev) => {
        const delta = rightSide ? startX - ev.clientX : ev.clientX - startX;
        width = clampSideWidth(startW + delta);
        document.body.style.setProperty('--urd-nav-side-width', `${width}px`);
      };
      const onUp = () => {
        grip.removeEventListener('pointermove', onMove);
        grip.removeEventListener('pointerup', onUp);
        if (width !== startW) window.parent?.postMessage({ type: 'urd-nav-width', width }, location.origin);
      };
      grip.addEventListener('pointermove', onMove, { signal });
      grip.addEventListener('pointerup', onUp, { signal });
    }, { signal });
    host.appendChild(grip);
  }

  // A tucked menu (nav.hideMode) stands above the top edge and comes in by the pointer at the edge, a ghost or the pull tab, and by keyboard focus.
  const tuck = isTucked ? tuckNav(host, nav, tucked, site, signal) : null;

  // Escape closes the nearest open layer and returns focus to its opener; an accordion in the sheet closes alone, its cancelled key keeping the sheet open.
  nav.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    // The innermost open submenu around the focus closes first; a fixed one has nothing to close.
    const openSubs = expandedSubs() ? [] : subs.filter((entry) => entry.li.classList.contains('open') && !isFixed(entry));
    const openSub = openSubs.filter((entry) => entry.li.contains(document.activeElement)).pop() ?? openSubs[0];
    if (launcherWrap?.isOpen()) {
      event.preventDefault();
      launcherWrap.close();
      launcherWrap.btn.focus();
    } else if (openSub) {
      event.preventDefault();
      setOpen(openSub, false);
      // Without the arrow on the phone a split item's link is its opener.
      (isMobileState() && !phoneMenu.arrow && openSub.link ? openSub.link : openSub.button).focus();
    } else if (!sheet && nav.classList.contains('urd-nav-open')) {
      setMobileOpen(false);
      burger.focus();
    }
  }, { signal });

  // A click outside the nav closes the submenus, the launcher and the mobile panel.
  // Submenus that stand open by choice (the expanded column) keep standing.
  document.addEventListener('pointerdown', (event) => {
    if (host.contains(event.target)) return;
    if (!expandedSubs()) closeAll();
    launcherWrap?.close();
    setMobileOpen(false);
    tuck?.hide();
  }, { signal });

  readMenu = () => ({
    nav,
    sheet: sheet?.dialog ?? null,
    open: isMobileOpen(),
    folded: contentFolded,
    expanded: expandedSubs(),
    subs: subs.filter((entry) => entry.li.classList.contains('open')).map((entry) => entry.button.getAttribute('aria-controls')),
    scroll: (sheet?.dialog.open ? sheet.body : list).scrollTop,
    focusInside: Boolean(sheet?.dialog.open && sheet.dialog.contains(document.activeElement) && document.activeElement !== sheet.dialog),
  });
}

/**
 * The menu above the top edge of a page it is kept off: by nav.hideMode the pointer at the edge, a faint ghost or a pull tab brings it in, and so does focus.
 * @param {HTMLElement} host
 * @param {HTMLElement} nav
 * @param {'hover' | 'ghost' | 'tab'} mode
 * @param {object} site
 * @param {AbortSignal} signal
 * @returns {{isShown: () => boolean, hide: () => void, tab: HTMLButtonElement | null}}
 */
function tuckNav(host, nav, mode, site, signal) {
  const canHover = window.matchMedia('(hover: hover)').matches;
  let leaveTimer = null;
  let settleTimer = null;
  const isShown = () => host.classList.contains('urd-nav-shown');
  const show = () => {
    clearTimeout(leaveTimer);
    clearTimeout(settleTimer);
    host.classList.add('urd-nav-shown');
    host.classList.remove('urd-nav-peek');
    tab?.setAttribute('aria-expanded', 'true');
  };
  const hide = () => {
    clearTimeout(leaveTimer);
    clearTimeout(settleTimer);
    host.classList.remove('urd-nav-shown', 'urd-nav-peek');
    tab?.setAttribute('aria-expanded', 'false');
  };
  const leaveLater = () => {
    clearTimeout(leaveTimer);
    leaveTimer = setTimeout(hide, TUCK_LEAVE);
  };

  // The pull tab, with the owner's own mark, word and colours or the burger lines; drawn for the tab mode, and for every mode on a device without hover.
  let tab = null;
  if (mode === 'tab' || !canHover) {
    const look = tabModel(site.nav);
    tab = document.createElement('button');
    tab.type = 'button';
    tab.className = `urd-nav-tab${look.custom ? ' urd-nav-tab-own' : ''}`;
    tab.setAttribute('aria-expanded', 'false');
    tab.setAttribute('aria-controls', host.id || 'urd-nav');
    const name = look.label || t('nav.menu');
    tab.setAttribute('aria-label', name);
    if (look.image) {
      const img = document.createElement('img');
      img.src = look.image;
      img.alt = '';
      tab.appendChild(img);
    } else {
      tab.innerHTML = (look.icon && iconSvg(look.icon)) || BURGER_SVGS.lines;
    }
    if (look.label) {
      const word = document.createElement('span');
      word.className = 'urd-nav-tab-label';
      word.textContent = look.label;
      tab.appendChild(word);
    }
    if (look.bg) tab.style.setProperty('--urd-nav-tab-bg', look.bg);
    if (look.color) tab.style.setProperty('--urd-nav-tab-color', look.color);
    tab.addEventListener('click', () => {
      if (isShown()) hide(); else show();
    }, { signal });
    if (canHover) {
      tab.addEventListener('pointerenter', (event) => {
        if (event.pointerType === 'mouse') show();
      }, { signal });
    }
    host.appendChild(tab);
  }

  if (canHover) {
    // The edge: a pointer there brings the bar in (hover) or shows the ghost.
    let ticking = false;
    document.addEventListener('pointermove', (event) => {
      if (event.pointerType !== 'mouse' || ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const atEdge = event.clientY <= TUCK_EDGE;
        if (isShown()) {
          // The bar stays while the pointer is on it; the host's own leave handles the rest.
          return;
        }
        if (mode === 'hover' && atEdge) show();
        else if (mode === 'ghost') host.classList.toggle('urd-nav-peek', atEdge || (host.classList.contains('urd-nav-peek') && event.clientY <= nav.offsetHeight));
      });
    }, { passive: true, signal });
    host.addEventListener('pointerenter', (event) => {
      if (event.pointerType !== 'mouse') return;
      clearTimeout(leaveTimer);
      if (mode === 'ghost' && !isShown()) {
        clearTimeout(settleTimer);
        settleTimer = setTimeout(show, GHOST_SETTLE);
      }
    }, { signal });
    host.addEventListener('pointerleave', (event) => {
      if (event.pointerType !== 'mouse') return;
      clearTimeout(settleTimer);
      if (isShown()) leaveLater();
      else host.classList.remove('urd-nav-peek');
    }, { signal });
    if (mode === 'ghost') {
      host.addEventListener('click', () => { if (!isShown()) show(); }, { signal });
    }
  }
  // Focus inside brings the bar in and focus leaving lets it go; Escape puts it away unless the bar's own Escape handling has taken the key.
  host.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || event.defaultPrevented || !isShown()) return;
    event.preventDefault();
    hide();
    tab?.focus();
  }, { signal });
  // The tab is the opener: focus on it opens nothing, its click does.
  host.addEventListener('focusin', (event) => {
    if (!tab?.contains(event.target)) show();
  }, { signal });
  host.addEventListener('focusout', (event) => {
    if (!host.contains(event.relatedTarget)) leaveLater();
  }, { signal });
  return { isShown, hide, tab };
}

/**
 * The full-screen phone menu: a native <dialog> in the nav that the menu list and the chosen logo and tools move into on open and back out of on close.
 */
function buildSheet(nav, { list, tools, burger, logo, announce, withTheme, withCart, barTools = true, labels, motion, surface, kept = null }, signal) {
  const dialog = kept ?? document.createElement('dialog');
  if (kept) {
    kept.replaceChildren();
    kept.removeAttribute('style');
  }
  dialog.className = `urd-nav-sheet urd-nav-sheet-from-${motion}${labels ? ' urd-nav-sheet-labels' : ''}`;
  if (surface.bg) dialog.style.setProperty('--urd-nav-sheet-bg', surface.bg);
  if (surface.blur === false) dialog.style.setProperty('--urd-nav-sheet-blur', 'none');
  else if (surface.blur === true) dialog.style.setProperty('--urd-nav-sheet-blur', 'blur(12px)');
  if (surface.color) dialog.style.color = surface.color;
  const head = document.createElement('div');
  head.className = 'urd-nav-sheet-head';
  const close = document.createElement('button');
  close.className = 'urd-nav-sheet-close';
  close.type = 'button';
  close.setAttribute('aria-label', t('nav.closeMenu'));
  close.innerHTML = CROSS;
  close.addEventListener('click', () => dialog.close(), { signal });
  head.appendChild(close);
  dialog.appendChild(head);
  const body = document.createElement('div');
  body.className = 'urd-nav-sheet-body';
  dialog.appendChild(body);
  const foot = document.createElement('div');
  foot.className = 'urd-nav-sheet-foot';
  if (withTheme || withCart || !barTools) dialog.appendChild(foot);
  // Light dismiss: a click on the backdrop or on a link closes the sheet, unless the link's own handler cancelled it.
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog || (event.target.closest('a[href]') && !event.defaultPrevented)) dialog.close();
  }, { signal });
  // While the sheet is open, a touch move outside both its scroll area and any dialog on top of it is cancelled, so touch scrolling stays in the sheet.
  let touchLock = null;
  const lockTouch = () => {
    touchLock = new AbortController();
    document.addEventListener('touchmove', (event) => {
      if (event.target instanceof Element && event.target.closest('.urd-nav-sheet-body, dialog:not(.urd-nav-sheet)')) return;
      event.preventDefault();
    }, { passive: false, signal: touchLock.signal });
  };
  signal.addEventListener('abort', () => touchLock?.abort());
  const toolSelector = [(withCart || !barTools) && '.urd-nav-cart', (withTheme || !barTools) && '.urd-nav-theme', !barTools && '.urd-nav-links'].filter(Boolean).join(', ');
  const toolButtons = () => (toolSelector ? [...tools.querySelectorAll(toolSelector)] : []);
  // Whether this render's parts stand in the dialog, so a close puts back only what was moved.
  let filled = false;
  let logoNext = null;
  // Where the announcement came from, so it goes back there on close; it is read through a getter, since the cross in the sheet can remove it.
  let announceHome = null;
  // Each tool's place in the cluster, so it returns to it.
  // Restored last to first: a tool's next sibling may be another moved tool, which is back in place by then.
  let toolHomes = [];
  dialog.addEventListener('close', () => {
    touchLock?.abort();
    touchLock = null;
    if (!filled) return;
    filled = false;
    nav.insertBefore(list, tools);
    if (logo) nav.insertBefore(logo, logoNext);
    const strip = announce?.();
    if (strip && announceHome) announceHome.parent.insertBefore(strip, announceHome.next);
    announceHome = null;
    for (const { btn, next } of toolHomes.reverse()) {
      // No next sibling: the tool ended the cluster, and does again.
      if (!next) tools.appendChild(btn);
      else tools.insertBefore(btn, next.parentNode === tools ? next : null);
    }
    toolHomes = [];
    // Focus left in the closed dialog or on the page, as when a kept dialog's opener was replaced, goes to this burger while the page has the focus.
    const lost = !document.activeElement || document.activeElement === document.body || dialog.contains(document.activeElement);
    if (document.hasFocus() && lost) burger.focus();
  }, { signal });
  if (!kept) nav.appendChild(dialog);
  const fill = () => {
    filled = true;
    if (logo) {
      logoNext = logo.nextSibling;
      head.insertBefore(logo, close);
    }
    // Above the head rather than in it: the head is a right-aligned row for the cross, while the strip is a full-width band.
    const strip = announce?.();
    if (strip?.parentNode) {
      announceHome = { parent: strip.parentNode, next: strip.nextSibling };
      dialog.prepend(strip);
    }
    body.appendChild(list);
    for (const btn of toolButtons()) {
      toolHomes.push({ btn, next: btn.nextSibling });
      foot.appendChild(btn);
    }
    lockTouch();
  };
  const show = () => {
    fill();
    dialog.showModal();
  };
  return { dialog, body, closeButton: close, show, fill, kept: Boolean(kept) };
}

