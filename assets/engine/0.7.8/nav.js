/**
 * Builds the navigation from site.json - the page register (site.pages) and
 * the nav data (site.nav). Nothing is hardcoded: nav items with `page` look
 * up their path in the page register; items with `href` are external links.
 *
 * Submenus follow the WAI-ARIA "disclosure navigation" pattern (not
 * menubar): real buttons with aria-expanded/aria-controls, natural Tab
 * order and no role="menu". An item with both its own target and a submenu
 * renders as a link plus its own arrow button, so the page stays reachable.
 * The submenu has two levels: a child's own submenu opens beside the panel,
 * or stands as a headed group under the child when the submenu is laid out
 * in columns or as the flyout. The mobile menu (the burger) is a non-modal
 * disclosure of the same list, styled by body.urd-mobile (the breakpoint is
 * set in urd.js from site.json), or with nav.style.mobileMenu 'sheet' a
 * full-screen native <dialog> the list moves into while it is open
 * (ADR-0011: top layer, focus trap, Escape and the scroll lock come from the
 * browser). The menu stays off the pages listed in nav.hideOn: gone, or
 * tucked above the top edge and reached by the pointer at the edge, a faint
 * ghost there, or a pull tab (nav.hideMode).
 */

import { navItems, navClasses, navSurface, navSubSurface, navLayerVeil, hostClasses, clampSideWidth, clampBorderWidth, navScrollState, scrollClear, resolveLink, linkAttrs, navSizeVars, effectiveNav, subOpenMode, mobileMenuMode, mobileSubMode, sheetMotion, announcementModel, launcherModel, launcherVars, toolOrder, isSafeImage, burgerModel, navHidden, hideMode, tabModel, subGrouped } from './nav-model.js';
import { themeMode, toggleThemeMode, resolveColor } from './theme.js';
import { renderBackgroundLayers } from './render.js';
import { readCart, cartCount, onCartChange } from './shop.js';
import { createCartDrawer } from './blocks/cart.js';
import { iconSvg } from './icons.js';
import { siteLinks, linkIconHtml, leavesSite } from './links-model.js';
import { t, ta } from './i18n.js';

/** How long the submenu stays open after the pointer leaves the item. */
const HOVER_CLOSE_DELAY = 250;

// renderNav runs again for every site draft from the editor; the controller
// detaches the previous render's listeners (including those on document) so
// there is never more than one active set.
let navController = null;

// The current render's scroll-state pass, so a switch between the editor's
// views can apply the top-zone state at once instead of at the next scroll.
let navScrollRefresh = null;

/** Recomputes the scroll classes (compact, hidden, scrolled) for the current render. */
export function refreshNavScroll() {
  navScrollRefresh?.();
}

/** Until when a jump to a spot on the page holds a hiding menu in view (performance.now()). */
let jumpHoldUntil = 0;

/**
 * Holds a menu that hides on scroll in view while a jump to a spot on the page runs, so the spot lands under the bar rather than under the gap it leaves; the menu then hides again only after a scroll down from where the jump ended.
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

// Side column on narrow windows: below 900px the menu renders as a REGULAR
// top bar (effective variant bar) with horizontal items; the burger only
// appears at the mobile breakpoint, as for the bar variant. A separate
// break edge independent of the mobile breakpoint AND of the editor's
// viewport choice, so it also works in the preview's desktop mode.
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
const GRID = svg('<g fill="currentColor" stroke="none"><circle cx="6" cy="6" r="1.6"/><circle cx="12" cy="6" r="1.6"/><circle cx="18" cy="6" r="1.6"/><circle cx="6" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="18" cy="12" r="1.6"/><circle cx="6" cy="18" r="1.6"/><circle cx="12" cy="18" r="1.6"/><circle cx="18" cy="18" r="1.6"/></g>');

/** The launcher button's anchor name; one launcher per page, so one name. */
const LAUNCHER_ANCHOR = '--urd-nav-launcher';

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

/**
 * @param {object} site site.json, already parsed
 * @param {HTMLElement} host Element the navigation is built into
 * @param {string} [pageId] The page being rendered; the menu stays off the pages listed in nav.hideOn
 */
export function renderNav(site, host, pageId) {
  navController?.abort();
  navController = new AbortController();
  const signal = navController.signal;
  navScrollRefresh = null;
  lastRender = { site, host, pageId };

  host.replaceChildren();
  // A strip placed outside the nav host by the previous render leaves with it.
  document.getElementById('urd-announce')?.remove();
  // A page the menu stays off (nav.hideOn): with hideMode hidden the host is hidden with its classes and clearances cleared, so the page starts at the top with nothing parked above it.
  // The other modes tuck the menu above the top edge as a fixed bar (tuckNav below), where the page starts at the top the same way.
  const tucked = navHidden(site.nav, pageId) ? hideMode(site.nav) : 'hidden';
  if (navHidden(site.nav, pageId) && tucked === 'hidden') {
    host.style.display = 'none';
    host.classList.remove(...HOST_CLASSES, 'urd-nav-sticky', 'urd-nav-announce-scroll', 'urd-nav-announce-keep', 'urd-nav-scroll', 'urd-nav-compact', 'urd-nav-hidden', 'urd-nav-scrolled');
    document.body.classList.remove('urd-side-left', 'urd-side-right');
    document.body.style.removeProperty('--urd-nav-side-width');
    for (const name of ROOT_VARS) document.documentElement.style.setProperty(name, '0px');
    return;
  }
  host.style.removeProperty('display');

  // Narrow windows: the side variant renders as a regular top bar
  // (effective variant bar); the breakpoint listener above re-renders on
  // crossing. At the mobile breakpoint the overrides in nav.style.mobile
  // replace the desktop values they name (effectiveNav), so the appearance
  // is computed from one resolved nav.
  // A tucked menu is always a plain top bar, out of the flow and without the scroll behaviours and the clear top: the modes below the bar's variant have no meaning above the edge.
  const isTucked = tucked !== 'hidden';
  const wantsSide = !isTucked && (site.nav.variant === 'side-left' || site.nav.variant === 'side-right');
  // The site's own breakpoint; the listener and the burger class are wired
  // further down, where the nav element exists.
  const mobileMq = window.matchMedia(`(max-width: ${site.breakpoints?.mobile ?? 640}px)`);
  const baseNav = isTucked
    ? { ...site.nav, variant: 'bar', overlay: false, sticky: true, scroll: undefined, style: { ...(site.nav.style ?? {}), atTop: undefined } }
    : wantsSide && narrowMq.matches ? { ...site.nav, variant: 'bar' } : site.nav;
  const effSite = { ...site, nav: effectiveNav(baseNav, { mobile: mobileMq.matches }) };

  // The announcement bar (nav.announcement, additive since v0.7): a strip
  // above the menu inside the host. It follows the menu by default; with
  // sticky false the host's sticky top is raised by the strip's height
  // (--urd-announce-h, measured below), so the strip scrolls away and the
  // menu sticks alone. Hosts out of the flow (floating, overlay) are fixed
  // and keep the strip with the menu regardless.
  // A dismissed strip stays away as long as the message is the same
  // (localStorage keyed by the text). The preview reads and writes the same
  // key as the published page, so the editor shows what the visitor gets;
  // the Announcement panel has a control that clears it again.
  const announce = announcementModel(site.nav.announcement, site.pages);
  const dismissKey = announce ? dismissKeyFor(announce.text) : '';
  let dismissed = false;
  if (announce?.dismiss) {
    try { dismissed = localStorage.getItem(dismissKey) === '1'; } catch { dismissed = false; }
  }
  let announceEl = null;
  if (announce && !dismissed) {
    announceEl = document.createElement('div');
    announceEl.className = 'urd-nav-announce';
    const inner = document.createElement(announce.link ? 'a' : 'span');
    inner.className = 'urd-nav-announce-text';
    inner.textContent = announce.text;
    if (announce.link) Object.assign(inner, linkAttrs(announce.link));
    if (announce.bg) announceEl.style.setProperty('--urd-announce-bg', announce.bg);
    if (announce.color) announceEl.style.setProperty('--urd-announce-text', announce.color);
    announceEl.appendChild(inner);
    if (announce.dismiss) {
      const cross = document.createElement('button');
      cross.type = 'button';
      cross.className = 'urd-nav-announce-close';
      cross.setAttribute('aria-label', t('nav.dismissAnnouncement'));
      cross.innerHTML = CROSS;
      cross.addEventListener('click', () => {
        try { localStorage.setItem(dismissKey, '1'); } catch { /* storage may be unavailable */ }
        announceEl.remove();
        announceEl = null;
        setNavH();
      }, { signal });
      announceEl.appendChild(cross);
    }
    // The side column honours the chosen place: the strip in the column
    // (its top), fixed across the whole page above column and content, or
    // in the flow above the content beside the column. The other variants
    // always carry it inside the host.
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
      host.appendChild(announceEl);
    }
    // A document rendered ahead of its use (a prerender on link hover, or one
    // kept in the back-forward cache) built the strip before the visitor
    // could dismiss it elsewhere: the key is read again when it comes on
    // screen, and the strip leaves with it.
    if (announce.dismiss) {
      const recheckDismiss = () => {
        let gone = false;
        try { gone = localStorage.getItem(dismissKey) === '1'; } catch { gone = false; }
        if (!gone || !announceEl) return;
        announceEl.remove();
        announceEl = null;
        setNavH();
      };
      if (document.prerendering) document.addEventListener('prerenderingchange', recheckDismiss, { once: true, signal });
      window.addEventListener('pageshow', (event) => { if (event.persisted) recheckDismiss(); }, { signal });
    }
  }
  // Whether the strip actually scrolls away: the host must be in the flow
  // and sticky (a fixed host, floating, overlaid or the side column, keeps
  // the strip; a host that is not sticky scrolls away as a whole).
  const announceScrolls = !!announce && !announce.sticky && site.nav.sticky !== false
    && !hostClasses(effSite).host.some((cls) => cls === 'urd-nav-float' || cls === 'urd-nav-overlay' || cls === 'urd-nav-side-host');
  host.classList.toggle('urd-nav-announce-scroll', announceScrolls);

  const nav = document.createElement('nav');
  // layout (additive since v0.5): where the menu items sit; the logo is
  // always first and doubles as the "Home" button.
  nav.className = navClasses(effSite);
  // The burger follows the ACTUAL width via its own class on the nav: in
  // preview the editor's viewport choice owns body.urd-mobile (and with it
  // the structure tools), but the menu alone must still go mobile when the
  // window is narrower than the mobile breakpoint. For visitors,
  // body.urd-mobile is set at the same threshold; the double coverage in
  // the CSS is harmless.
  mobileMq.addEventListener('change', () => renderNav(lastRender.site, lastRender.host, lastRender.pageId), { signal });
  if (mobileMq.matches) nav.classList.add('urd-nav-mobile');
  // Sticky menu (the default): sticky must sit on the HOST (the header
  // element), not on the nav - a sticky element can never leave its parent,
  // and the parent here is exactly as tall as the nav.
  host.classList.toggle('urd-nav-sticky', effSite.nav.sticky !== false);
  // The variant drives the host and body: floating takes the host out of
  // the flow (the hero starts behind the pill), the side variant turns the
  // host into a fixed column and gives body content padding. All classes
  // are toggled on every render, so a variant switch in the editor never
  // leaves leftovers.
  const hc = hostClasses(effSite);
  if (isTucked) hc.host.push('urd-nav-tuck', `urd-nav-tuck-${tucked}`);
  for (const cls of HOST_CLASSES) {
    host.classList.toggle(cls, hc.host.includes(cls));
  }
  for (const cls of ['urd-side-left', 'urd-side-right']) {
    document.body.classList.toggle(cls, hc.body.includes(cls));
  }
  // The side column's width: set on body so both the column and the
  // content padding read the same value.
  const isSide = hc.body.length > 0;
  if (isSide) {
    document.body.style.setProperty('--urd-nav-side-width', `${clampSideWidth(site.nav.style?.width)}px`);
  } else {
    document.body.style.removeProperty('--urd-nav-side-width');
  }

  // Scroll behavior (nav.scroll, additive since v0.6): 'shrink' shrinks the
  // menu after some scrolling, 'hide' hides it on scroll down and shows it
  // on scroll up. The state is computed by pure navScrollState; only
  // meaningful for a sticky top bar (not the side variant, not sticky off).
  // The behavior runs in every view, the editor's preview included, so the
  // owner sees what the visitor gets; it is off only while the mobile panel
  // is open. The editing chrome parks against --urd-nav-h-base rather than
  // the shrinking height (setNavH below). The listener is rAF-throttled,
  // passive and aborted with the rest of the render's listeners.
  const scrollMode = effSite.nav.scroll;
  const wantsScroll = (scrollMode === 'shrink' || scrollMode === 'hide')
    && !isSide && effSite.nav.sticky !== false;
  // A strip that does not follow the menu out (announcement.followNav false,
  // the default): the slide moves from the host to the menu, so the strip
  // keeps its place while the bar passes behind it.
  host.classList.toggle('urd-nav-announce-keep',
    !!announceEl && host.contains(announceEl) && wantsScroll && scrollMode === 'hide' && !announce.followNav);
  // Transparent at the top (nav.style.atTop 'clear', additive since v0.7):
  // the host class comes from hostClasses, the surface appears once the
  // page has left the top zone (urd-nav-scrolled). Independent of sticky:
  // a menu that scrolls away is only ever seen in the top zone.
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
      // With the mobile panel open the menu keeps its full size, stays
      // visible and draws its surface, so the panel has something to hang
      // from.
      const state = menuOpen
        ? { compact: false, hidden: false, scrolled: true, anchor: y }
        : navScrollState(wantsScroll ? scrollMode : undefined, anchor, y, hidden,
          { shrinkAt: effSite.nav.style?.shrinkAt, hold: performance.now() < jumpHoldUntil });
      // The turning point the travel is measured from; navScrollState owns
      // where it goes, the render only carries it between frames.
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

  // Appearance (nav.style, additive since v0.5): background color with
  // opacity, blur behind, and its own text color. The background is set as
  // a CSS var so submenus and the mobile panel inherit the same surface;
  // without style the CSS default applies.
  const surface = navSurface(site.nav.style);
  // Full layer-based background (additive since v0.6, shared with sections
  // and the footer): a backdrop behind the nav content with the same layer
  // stack as sections. When present it takes over the surface, and the
  // plain veil/image path is skipped.
  const navBg = site.nav.style?.background;
  const hasNavBgLayers = Array.isArray(navBg?.layers) && navBg.layers.length > 0;
  if (hasNavBgLayers) {
    const backdrop = document.createElement('div');
    backdrop.className = 'urd-nav-bg';
    renderBackgroundLayers(backdrop, navBg);
    nav.appendChild(backdrop);
    // The layers define the surface: the nav element's own background is
    // made transparent (blur/frosted glass still works through it).
    nav.style.setProperty('--urd-nav-bg', 'transparent');
    // The submenu and mobile panel inherit the color layers as one flattened
    // veil, so the dropdown follows the bar's tone instead of the default veil.
    const layerVeil = navLayerVeil(navBg.layers);
    if (layerVeil) nav.style.setProperty('--urd-nav-sub-bg', layerVeil);
  } else if (surface.bg) {
    nav.style.setProperty('--urd-nav-bg', surface.bg);
  }
  // Blur is driven via a custom property (inherits to submenus and the mobile
  // panel; backdrop-filter itself does not inherit, so inherit in the CSS
  // would stop at the li).
  if (surface.blur === false) nav.style.setProperty('--urd-nav-blur', 'none');
  if (surface.color) nav.style.color = surface.color;
  // The submenu and mobile panel get their own surface: by default only the
  // color veil, never the background image (subImage turns the image on).
  // With a layer background, submenu/mobile keep the veil default (the layer
  // stack applies to the main bar).
  const subBg = navSubSurface(site.nav.style);
  if (subBg && !hasNavBgLayers) nav.style.setProperty('--urd-nav-sub-bg', subBg);
  // Hover colors (additive since v0.6): the effect color (underline/pill
  // surface/glow) and the text color on hover; without a choice the accent
  // color applies.
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
  // The pill items' own color (subStyle pills); without a choice the
  // submenu surface is used.
  if (site.nav.style?.subPillColor) {
    nav.style.setProperty('--urd-nav-sub-pill', resolveColor(site.nav.style.subPillColor));
  }
  // Submenu columns (n x n): the items are laid out in a grid with the chosen column count.
  const subCols = Math.round(Number(site.nav.style?.subColumns));
  if (subCols >= 2) nav.style.setProperty('--urd-nav-sub-cols', String(Math.min(4, subCols)));
  // Size (additive since v0.7, ADR-0023): thickness, side padding, item
  // gap, text size, pill width and the shrink factor and its duration as
  // inline custom properties the CSS reads with today's look as the
  // fallback. The mobile overrides are chosen from the breakpoint here
  // (pure navSizeVars), and the breakpoint listener above re-renders on
  // crossing.
  const size = navSizeVars(effSite.nav.style, site.nav.logo, { mobile: mobileMq.matches });
  for (const [name, value] of Object.entries(size.vars)) nav.style.setProperty(name, value);
  // Border (additive since v0.7): the side is a class from navClasses; the
  // width and colour are variables with a hairline in the text colour as
  // the default.
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
    // The height is set via a base variable, not inline height: the CSS
    // derives the drawn size from it (the scroll shrink can scale it) and
    // its calibration (a negative block margin scaling with the size) keeps
    // the bar height constant regardless of image height - the image fills
    // out, the bar never grows. The mobile size is chosen by navSizeVars.
    img.style.setProperty('--urd-logo-base', `${size.logoSize}px`);
    if (logoDef.radius) img.style.borderRadius = `${logoDef.radius}px`;
    return img;
  };
  // The logo text can be styled independently of the theme (additive fields
  // since v0.5); the default is the theme's heading font in bold.
  const logoText = () => {
    const span = document.createElement('span');
    span.textContent = logoDef.value || site.site.title;
    if (logoDef.font) span.style.fontFamily = logoDef.font;
    if (logoDef.textSize) span.style.fontSize = `${logoDef.textSize}px`;
    if (logoDef.bold === false) span.style.fontWeight = '400';
    if (logoDef.italic) span.style.fontStyle = 'italic';
    return span;
  };

  // An unsafe image source falls back to the logo text (same guard as the
  // nav background and the favicon), so the menu never lacks a brand mark.
  if (logoDef.type === 'image' && isSafeImage(logoDef.value)) {
    logo.appendChild(logoImg(logoDef.value));
  } else if (logoDef.type === 'both' && isSafeImage(logoDef.image)) {
    // Image plus text, in the chosen order.
    if ((logoDef.order ?? 'image-first') === 'image-first') {
      logo.append(logoImg(logoDef.image), logoText());
    } else {
      logo.append(logoText(), logoImg(logoDef.image));
    }
  } else {
    logo.appendChild(logoText());
  }
  nav.appendChild(logo);

  // The tool cluster at the far right: the launcher, the cart and the
  // light/dark toggle in the owner's own order (nav.style.tools.order), then
  // the burger, which is the mobile menu's opener and always ends the row.
  // An empty cluster is hidden in CSS (:empty).
  const tools = document.createElement('span');
  tools.className = 'urd-nav-tools';
  /** @type {Record<string, HTMLElement|null>} The built tools, by id */
  const toolEls = { launcher: null, cart: null, theme: null, links: null };

  // The link launcher (nav.launcher): the shortcuts behind a launcher button.
  // The button is the desktop opener; on mobile the same shortcuts are a
  // section at the foot of the menu list, which travels into the full-screen
  // sheet with the list.
  const launcher = launcherModel(site.nav?.launcher, site.pages ?? []);
  const launcherWrap = launcher ? buildLauncher(launcher, signal) : null;
  if (launcherWrap) toolEls.launcher = launcherWrap.el;
  // A shortcut whose target is not a usable link still gets its tile, but the
  // tile goes nowhere: say so, the way an unknown page in the menu is reported.
  const broken = launcher?.links.filter((link) => link.missing).length ?? 0;
  if (broken) console.warn(`Urd: ${broken} launcher shortcut(s) have no usable target`);

  // The cart in the menu (the shop, additive nav.cart): a button with a
  // count badge that opens the same cart drawer as the cart block.
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
    const drawer = createCartDrawer({ href: checkoutLink.missing ? '' : checkoutLink.href, currency: cartCfg.currency || 'kr' });
    nav.appendChild(drawer.dialog);
    const paintCart = () => {
      const count = cartCount(readCart());
      cartBadge.textContent = String(count);
      cartBadge.hidden = count === 0;
    };
    paintCart();
    onCartChange(nav, () => {
      paintCart();
      drawer.refresh();
    });
    cartBtn.addEventListener('click', () => drawer.open(), { signal });
    toolEls.cart = cartBtn;
  }

  // The light/dark button: there when the theme has an alt counterpart to
  // switch to, unless the owner has taken it out of the cluster.
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

  // The site's links (links-model.js) as icons in the cluster, when the
  // owner switched the tool on.
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

  // The burger (only visible in mobile view via CSS). With the dropdown it
  // is a non-modal disclosure of the menu list - no focus trap or scroll
  // lock, the panel scrolls itself. With the sheet it opens a modal dialog
  // that the list moves into (and back out of on close), so the same list
  // with its submenu accordions serves both. The drawing and the word
  // beside it are the owner's choice (nav.style.burger); a visible word is
  // the button's name.
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
  // The burger ends the row, except when the cluster stands at the start,
  // where it takes the outer edge so it sits leftmost on mobile.
  if (effSite.nav.style?.tools?.side === 'start' && !isSide) tools.prepend(burger);
  else tools.appendChild(burger);
  // A cluster with nothing but the burger takes no room on desktop.
  tools.classList.toggle('urd-nav-tools-none', !Object.values(toolEls).some(Boolean));

  const list = document.createElement('ul');
  list.className = 'urd-nav-list';
  list.id = 'urd-nav-menu';

  const sheet = mobileMenuMode(site.nav.style) === 'sheet'
    ? buildSheet(nav, { list, tools, burger, logo: site.nav.style?.sheetLogo === true ? logo : null, announce: () => (site.nav.style?.sheetAnnounce === true ? announceEl : null), withTheme: site.nav.style?.sheetTheme === true, withCart: site.nav.style?.sheetCart === true, labels: site.nav.style?.sheetToolLabels === true, motion: sheetMotion(site.nav.style), surface: navSurface(site.nav.style?.sheet ?? {}) }, signal)
    : null;
  // The announcement comes back to the host on close, so the clearance the
  // guard in setNavH held is measured again. Registered after buildSheet's
  // own close listener, which is what puts the strip back.
  if (sheet) sheet.dialog.addEventListener('close', () => setNavH(), { signal });
  const isMobileOpen = () => (sheet ? sheet.dialog.open : nav.classList.contains('urd-nav-open'));
  // The mobile state as the CSS sees it: the breakpoint, content folding, or
  // the editor's viewport choice in the preview (body.urd-mobile).
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
    // The top-zone surface follows the panel: a bar that is clear at the top
    // draws its surface while the panel hangs from it.
    navScrollRefresh?.();
  };
  if (sheet) sheet.dialog.addEventListener('close', () => burger.setAttribute('aria-expanded', 'false'), { signal });
  burger.addEventListener('click', () => {
    setMobileOpen(!isMobileOpen());
  }, { signal });

  /** Every opener with its submenu, at both levels, in document order (a parent before its children). */
  const subs = [];
  const setOpen = (entry, open) => {
    entry.li.classList.toggle('open', open);
    entry.button.setAttribute('aria-expanded', String(open));
    // A closing submenu takes its own open second level with it, so the panel never reopens with a stale inner level; a headed group stays as it is.
    if (!open) {
      for (const inner of subs) {
        if (inner !== entry && entry.li.contains(inner.li) && inner.li.classList.contains('open') && !isFixed(inner)) setOpen(inner, false);
      }
    }
  };
  // The column can keep every submenu open from the start (nav.style.sideSubs);
  // without the arrow (nav.style.sideSubArrow) nothing closes them.
  const columnExpanded = hc.host.includes('urd-nav-side-subs-open');
  const columnFixedOpen = columnExpanded && !hc.host.includes('urd-nav-side-sub-arrow');
  // A child's own submenu stands as a headed group when the submenu is laid
  // out in columns or as the flyout (navClasses sets the class the CSS reads).
  const grouped = subGrouped(site.nav.style);
  /** Whether an opener stands open with nothing to close it: the column with every submenu open and no arrow, or a headed group. Only outside the mobile menu, where every submenu is an accordion. */
  const isFixed = (entry) => (columnFixedOpen || entry.grouped) && !isMobileState();
  /** A fixed opener leaves the tab order and reads as a heading, not as an expanded button that cannot collapse; the state follows the mobile fold, so it is applied again when the bar folds or unfolds. */
  const applyFixed = () => {
    for (const entry of subs) {
      const fixed = isFixed(entry);
      entry.button.tabIndex = fixed ? -1 : 0;
      if (fixed) entry.button.setAttribute('aria-disabled', 'true');
      else entry.button.removeAttribute('aria-disabled');
      if (fixed) setOpen(entry, true);
    }
  };
  const closeAll = (except) => {
    for (const entry of subs) {
      // The openers above the one kept stay open: closing a parent would take the panel from under the pointer.
      if (entry === except || (except && entry.li.contains(except.li)) || isFixed(entry)) continue;
      setOpen(entry, false);
    }
  };

  // Hover only opens on devices with a real pointer - touch must never get
  // hover states that take an extra tap to dismiss. nav.style.subOpen
  // decides whether hover opens at all and whether leaving closes
  // (subOpenMode); click always works.
  // In the side column the submenus are accordions in the flow: there,
  // hover opens but never closes per item - closing would shorten the
  // column under the pointer and cause misclicks. The accordions close
  // only when the pointer leaves the whole menu.
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
   * One menu item as a list row, its submenu built the same way one level
   * down. `path` is the item's place in the menu and names the submenu.
   * @param {object} item From navItems
   * @param {number} depth 0 in the bar, 1 and 2 in the submenus
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

    // Item with a submenu: 'split' = link plus its own arrow button (the
    // page stays reachable); 'toggle' = one button carries both the title
    // and the arrow.
    li.classList.add('urd-nav-has-sub');
    const subId = `urd-nav-sub-${path}`;
    const button = document.createElement('button');
    button.type = 'button';
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-controls', subId);

    if (item.kind === 'split') {
      const link = makeLink(item);
      // Collapsed submenus on mobile: the whole item opens the submenu
      // instead of navigating (the menu is for touch, and a tap that
      // navigates never shows the submenu); the item's own page is the
      // first submenu entry instead. Expanded submenus are already visible,
      // so there the item stays a plain link.
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

    const entry = { li, button, grouped: grouped && depth > 0 };
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
      // The accordion closes the others, except in the expanded mobile mode
      // where every submenu stands on its own.
      if (!expandedSubs()) closeAll(entry);
      setOpen(entry, open);
    }, { signal });

    if (mouseHover && !columnExpanded && !entry.grouped) {
      // Real mouse only: on hybrid devices (laptop with touchscreen) a tap
      // fires both pointerenter and click, and without the guard the
      // submenu would open on enter and close again on click. The mobile
      // menu is built for touch: hover never opens or closes there.
      let closeTimer = null;
      li.addEventListener('pointerenter', (event) => {
        if (event.pointerType !== 'mouse' || isMobileState()) return;
        clearTimeout(closeTimer);
        // In the column, other accordions stay open: closing moves the items
        // under the pointer. Closing happens collectively when the menu is left.
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

    // Tabbing out of the item closes the submenu - focus must never leave
    // an open menu behind.
    li.addEventListener('focusout', (event) => {
      if (expandedSubs() || isFixed(entry)) return;
      if (!li.contains(event.relatedTarget)) setOpen(entry, false);
    }, { signal });

    return li;
  };

  navItems(site).forEach((item, index) => list.appendChild(buildItem(item, 0, String(index))));
  applyFixed();
  if (columnExpanded && !isMobileState()) for (const entry of subs) setOpen(entry, true);

  // The launcher's shortcuts inside the mobile menu: a section at the foot
  // of the list (hidden on desktop, where the button carries them), so it
  // travels into the full-screen sheet with the list. The menu must not grow
  // without end, so only the first mobileMax stand there; the rest sit in a
  // native <details> that opens in place (ADR-0011).
  if (launcher) {
    const row = document.createElement('li');
    row.className = 'urd-nav-launcher-row';
    for (const [name, value] of Object.entries(launcherVars(launcher))) row.style.setProperty(name, value);
    const title = launcherTitle(launcher);
    if (title) row.appendChild(title);
    const max = launcher.mobileMax;
    row.appendChild(launcherTiles(launcher.links.slice(0, max), launcher.mobileView, launcher.longNames));
    if (launcher.links.length > max) {
      const more = document.createElement('details');
      more.className = 'urd-nav-launcher-more';
      const summary = document.createElement('summary');
      summary.innerHTML = `<span class="urd-nav-launcher-more-open">${t('nav.launcherMore')}</span>`
        + `<span class="urd-nav-launcher-more-shut">${t('nav.launcherLess')}</span>`;
      more.append(summary, launcherTiles(launcher.links.slice(max), launcher.mobileView, launcher.longNames));
      row.appendChild(more);
    }
    list.appendChild(row);
  }

  // A link in the dropdown panel or an open submenu closes them, so a link to a spot on this page, which never leaves the page, shows the spot rather than the menu.
  // A link whose own handler cancelled it (the item that opens its submenu on a phone) leaves them open.
  // The sheet closes on its own.
  list.addEventListener('click', (event) => {
    if (event.defaultPrevented || !event.target.closest('a[href]')) return;
    if (!expandedSubs()) closeAll();
    if (!sheet && nav.classList.contains('urd-nav-open')) setMobileOpen(false);
  }, { signal });

  nav.appendChild(list);
  nav.appendChild(tools);
  host.appendChild(nav);
  // The menu height while it is not shrunk, kept across the scroll shrink.
  let navHBase = 0;
  // Measured at once, so the first paint already has the menu's clearance;
  // the observer below keeps it current.
  setNavH();

  // The measured menu height as a CSS var on the root element: the nav
  // clearance in base.css (menu out of the flow) and the chrome parking in
  // preview read it. The distance is measured from the host's top to the
  // nav's bottom edge (offsetTop includes the pill's top gap and a sticky
  // announcement); an announcement that scrolls away is left out, since the
  // menu alone is what stays. The column variant takes no top height.
  // --urd-nav-h-base holds the unshrunk height: the editing chrome parks
  // against that one, so the section handles stand still while the scroll
  // shrink runs under them.
  function setNavH() {
    // While the full-screen menu is open the strip has moved into it and the
    // host is short; the page behind keeps the clearance it had before the
    // menu opened, and the close puts it back.
    if (sheet?.dialog.open) return;
    // Above the edge the menu takes no room: the page starts at the top and a jump lands there too.
    if (isTucked) {
      for (const name of ROOT_VARS) document.documentElement.style.setProperty(name, '0px');
      host.style.setProperty('--urd-announce-h', `${announceEl?.offsetHeight ?? 0}px`);
      return;
    }
    const announceH = announceEl?.offsetHeight ?? 0;
    const scrolledAway = announceScrolls ? announceH : 0;
    // A strip fixed across the whole page: the column starts and the body
    // is padded below it (base.css reads the variable on the root), and it
    // is the column's only top clearance.
    const pageH = announceEl?.classList.contains('urd-announce-page') ? announceH : 0;
    const h = isSide ? pageH : nav.offsetTop + nav.offsetHeight - scrolledAway;
    document.documentElement.style.setProperty('--urd-nav-h', `${h}px`);
    // A render that starts mid-page measures the menu already shrunk; that
    // first measurement stands until an unshrunk one arrives.
    if (!navHBase || !host.classList.contains('urd-nav-compact')) navHBase = h;
    document.documentElement.style.setProperty('--urd-nav-h-base', `${navHBase}px`);
    host.style.setProperty('--urd-announce-h', `${announceH}px`);
    // The two heights on the root as well, for a background that keeps its
    // pictures out from under the strip or the menu: the strip's own, and
    // the menu's own below it. A strip inside the column or beside the
    // content stands over no section, so the root reads it as nothing.
    document.documentElement.style.setProperty('--urd-announce-h', `${isSide ? pageH : announceH}px`);
    document.documentElement.style.setProperty('--urd-nav-own-h', `${isSide ? 0 : Math.max(0, nav.offsetTop + nav.offsetHeight - announceH)}px`);
    document.documentElement.style.setProperty('--urd-announce-page-h', `${pageH}px`);
    setScrollClear();
  }

  // The room a jump to a spot leaves above it, which base.css gives the page as scroll-padding-top.
  // Unlike --urd-nav-h it follows the scroll shrink, so a spot reached mid-page lands right under the compact menu.
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

  // Content-aware folding: menu items never wrap (nowrap in base.css), so
  // when the items no longer fit in the width, the whole list folds to the
  // burger via the same class as the mobile breakpoint. The unfolded full
  // width is remembered (foldNeeds), because after folding the list is
  // hidden and cannot be measured: unfolding happens only once the bar is
  // wider than the need, and then measures again in case the need has grown.
  let foldNeeds = 0;
  const evalFold = () => {
    if (isSide || mobileMq.matches) return;
    if (!nav.classList.contains('urd-nav-mobile')) {
      if (nav.scrollWidth > nav.clientWidth + 1) {
        foldNeeds = nav.scrollWidth;
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
        // The bar is back: the submenus the expanded mobile mode opened
        // close with the panel, and the headed groups stand open again.
        setMobileOpen(false);
        closeAll();
        applyFixed();
      }
    }
  };

  // A ResizeObserver on the nav (not the host: a host out of the flow has
  // no height of its own to observe) catches window width, font loading and
  // scroll shrink; it always delivers a first measurement on observe.
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

  // The column's hover closing: all accordions close together when the
  // pointer leaves the whole menu; re-entering within the delay cancels
  // the closing.
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

  // The side column's width is adjusted by dragging its inner edge (preview
  // only, like section heights). Live update via the CSS var; on release
  // the width is reported to the editor, which owns the draft (urd-nav-width).
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

  // A tucked menu (nav.hideMode on a page in nav.hideOn) stands above the
  // top edge and comes in by the pointer at the edge, a ghost there, or the
  // pull tab; keyboard focus inside brings it in whatever the mode.
  const tuck = isTucked ? tuckNav(host, nav, tucked, site, signal) : null;

  // Escape closes the nearest open layer and returns focus to the button
  // that opened it, so keyboard users land where they were. An open
  // accordion inside the sheet closes alone: the cancelled keydown keeps
  // the dialog's own Escape handling from closing the sheet as well.
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
      openSub.button.focus();
    } else if (!sheet && nav.classList.contains('urd-nav-open')) {
      setMobileOpen(false);
      burger.focus();
    }
  }, { signal });

  // A click outside the nav closes the submenus, the launcher and the
  // mobile panel. Submenus that stand open by choice (the expanded column)
  // keep standing.
  document.addEventListener('pointerdown', (event) => {
    if (host.contains(event.target)) return;
    if (!expandedSubs()) closeAll();
    launcherWrap?.close();
    setMobileOpen(false);
    tuck?.hide();
  }, { signal });
}

/**
 * The menu above the top edge of a page it is kept off (nav.hideMode): the
 * host is fixed and translated out of view (base.css), and the mode decides
 * what brings it in. `hover`: the pointer within TUCK_EDGE of the top, and
 * it leaves TUCK_LEAVE after the pointer has left the bar. `ghost`: the
 * pointer at the edge shows the bar faint (urd-nav-peek), and it turns
 * solid once the pointer has rested on it for GHOST_SETTLE or clicked it.
 * `tab`: a pull tab hangs below the edge at all times and toggles the bar;
 * the pointer resting on the tab brings it in too. Touch has no hover, so
 * the tab is drawn for every mode there (ADR-0011: the menu stays
 * reachable). Focus inside the bar brings it in in every mode, and focus
 * leaving it lets it go.
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

  // The pull tab: the owner's own mark, word and colours, or the burger
  // lines in the menu's surface. Drawn for the tab mode, and on a device
  // without hover for the other modes as well.
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
  // Keyboard: focus inside brings the bar in, focus leaving lets it go, and
  // Escape puts it away from the tab as well as from the bar (the bar's own
  // Escape handling, which closes an open submenu first, has cancelled the key then).
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
 * The full-screen mobile menu: a native <dialog> inside the nav with a close
 * button, that the menu list moves into on open and back to its place before
 * the tool cluster on close (the list keeps its id, so the burger's
 * aria-controls stays valid). With `logo` the logo moves along into the
 * head, with `withTheme` and `withCart` the theme button and the cart move
 * into a foot; all return to the bar on close, in their original order. A link click and a
 * backdrop click close it; Escape, the focus trap, the focus return to the
 * burger and the scroll lock (body:has(dialog:modal) in base.css) are
 * native. `motion` is the allowlisted entrance from sheetMotion, drawn by
 * base.css. `surface` is the sheet's own surface (nav.style.sheet through
 * navSurface); without choices the sheet follows the bar's veil and blur.
 * `labels` shows the tool buttons' text beside the icons in the foot.
 */
function buildSheet(nav, { list, tools, burger, logo, announce, withTheme, withCart, labels, motion, surface }, signal) {
  const dialog = document.createElement('dialog');
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
  if (withTheme || withCart) dialog.appendChild(foot);
  // Light dismiss: a click on the ::backdrop hits the dialog element itself.
  // A link click closes too, unless the link's own handler cancelled it (an
  // item with a submenu opens it instead of navigating).
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog || (event.target.closest('a[href]') && !event.defaultPrevented)) dialog.close();
  }, { signal });
  // Touch scrolling stays inside the sheet: the page behind ignores the
  // overflow lock on some touch browsers, so a touch move outside the
  // sheet's own scroll area is cancelled while the sheet is open. The
  // listener lives only while the sheet is open (it must be non-passive,
  // which costs every scroll it is attached for), and a dialog opened on
  // top of the sheet, the cart drawer, scrolls on its own.
  let touchLock = null;
  const lockTouch = () => {
    touchLock = new AbortController();
    document.addEventListener('touchmove', (event) => {
      if (event.target instanceof Element && event.target.closest('.urd-nav-sheet-body, dialog:not(.urd-nav-sheet)')) return;
      event.preventDefault();
    }, { passive: false, signal: touchLock.signal });
  };
  signal.addEventListener('abort', () => touchLock?.abort());
  const toolSelector = [withCart && '.urd-nav-cart', withTheme && '.urd-nav-theme'].filter(Boolean).join(', ');
  const toolButtons = () => (toolSelector ? [...tools.querySelectorAll(toolSelector)] : []);
  let logoNext = null;
  // Where the announcement came from, so it goes back there on close. The
  // strip is read through a getter: the cross inside the sheet removes it,
  // and a removed strip must not be put back.
  let announceHome = null;
  // Each tool's place in the cluster, so it returns to it. Restored last
  // to first: a tool's next sibling may be another moved tool, which is
  // back in place by then.
  let toolHomes = [];
  dialog.addEventListener('close', () => {
    touchLock?.abort();
    touchLock = null;
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
  }, { signal });
  nav.appendChild(dialog);
  const show = () => {
    if (logo) {
      logoNext = logo.nextSibling;
      head.insertBefore(logo, close);
    }
    // Above the head rather than in it: the head is a right-aligned row for
    // the cross, while the strip is a full-width band.
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
    dialog.showModal();
  };
  return { dialog, show };
}

/**
 * The launcher's shortcuts as one list of tiles. The markup is the same for
 * all three designs (`view`: grid, list or cover) - the class on the list
 * decides the shape, so the desktop panel and the mobile section can carry
 * different designs from the same builder. A tile's mark is the uploaded
 * image when there is one, otherwise the drawn icon, and a tile with
 * neither stands with its label alone.
 * A name too long for its tile is cut with an ellipsis, the whole name then in the tile's tooltip, or folded onto more lines (`longNames`).
 * @param {Array<{label: string, href: string, external: boolean, icon: string, image: string}>} links
 * @param {string} view One of LAUNCHER_VIEWS
 * @param {'cut'|'wrap'} [longNames]
 * @returns {HTMLUListElement}
 */
function launcherTiles(links, view, longNames = 'cut') {
  const ul = document.createElement('ul');
  ul.className = `urd-nav-launcher-grid urd-nav-launcher-view-${view} urd-nav-launcher-names-${longNames}`;
  for (const link of links) {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.className = 'urd-nav-launcher-link';
    Object.assign(a, linkAttrs(link));
    // A target that is not a usable link points at '#': the tile is there,
    // drawn as the unfinished row it is.
    if (link.missing) a.classList.add('urd-nav-launcher-missing');
    const drawn = link.image ? '' : iconSvg(link.icon);
    if (link.image || drawn) {
      const mark = document.createElement('span');
      mark.className = 'urd-nav-launcher-icon';
      if (link.image) {
        a.classList.add('urd-nav-launcher-photo');
        const img = document.createElement('img');
        img.src = link.image;
        img.alt = '';
        mark.appendChild(img);
      } else {
        mark.innerHTML = drawn;
      }
      a.appendChild(mark);
    } else {
      a.classList.add('urd-nav-launcher-bare');
    }
    const label = document.createElement('span');
    label.className = 'urd-nav-launcher-name';
    label.textContent = link.label;
    if (longNames === 'cut' && link.label) a.title = link.label;
    a.appendChild(label);
    li.appendChild(a);
    ul.appendChild(li);
  }
  return ul;
}

/**
 * The heading above the tiles: the owner's own words, or the translated
 * default. Off with showTitle false.
 * @param {{titleShow: boolean, title: string}} model
 * @returns {HTMLSpanElement|null}
 */
function launcherTitle(model) {
  if (!model.titleShow) return null;
  const title = document.createElement('span');
  title.className = 'urd-nav-launcher-title';
  title.textContent = model.title || t('nav.launcher');
  return title;
}

/**
 * The link launcher's opener (nav.launcher): a drawn grid button in the tool
 * cluster with the link grid under it. With the Popover API and anchor
 * positioning the grid opens in the top layer, placed by CSS under the
 * button with the browser flipping it away from the viewport edge;
 * otherwise it is the submenu's disclosure pattern, a box positioned
 * against the wrapper inside the nav (ADR-0011). The gate is the stricter
 * feature, the same one the editor's floating menus use (anchored.js): a
 * popover's containing block is the viewport, so without anchoring there is
 * nothing to place the grid against, and anchoring without fallbacks would
 * let it run off a narrow screen. That module belongs to the editor layer
 * and stays out of the visitor's import closure, so the check stands here.
 * @param {Array<object>} links The model from launcherLinks
 * @param {AbortSignal} signal
 * @returns {{el: HTMLElement, btn: HTMLButtonElement, isOpen: () => boolean, close: () => void}}
 */
function buildLauncher(model, signal) {
  const wrap = document.createElement('span');
  wrap.className = 'urd-nav-launcher-wrap';
  const btn = document.createElement('button');
  btn.className = 'urd-nav-launcher-btn';
  btn.type = 'button';
  const name = model.title || t('nav.launcher');
  btn.setAttribute('aria-label', name);
  // The owner's own mark comes first, then a chosen icon, and the nine dots
  // are what stands there until one of them is set.
  btn.innerHTML = model.image ? '' : (iconSvg(model.icon) || GRID);
  const label = document.createElement('span');
  label.className = 'urd-nav-tool-label';
  label.textContent = name;
  btn.appendChild(label);
  if (model.image) {
    const img = document.createElement('img');
    img.className = 'urd-nav-launcher-btn-img';
    img.src = model.image;
    img.alt = '';
    btn.prepend(img);
  }
  const grid = document.createElement('div');
  grid.className = 'urd-nav-launcher';
  grid.id = 'urd-nav-launcher';
  for (const [name, value] of Object.entries(launcherVars(model))) grid.style.setProperty(name, value);
  const title = launcherTitle(model);
  if (title) grid.appendChild(title);
  grid.appendChild(launcherTiles(model.links, model.view, model.longNames));
  btn.setAttribute('aria-controls', grid.id);
  btn.setAttribute('aria-expanded', 'false');
  wrap.append(btn, grid);

  const native = 'popover' in HTMLElement.prototype
    && CSS.supports('anchor-name: --urd')
    && CSS.supports('position-try-fallbacks: flip-block');
  if (native) {
    btn.style.setProperty('anchor-name', LAUNCHER_ANCHOR);
    btn.setAttribute('popovertarget', grid.id);
    grid.popover = 'auto';
    grid.style.setProperty('position-anchor', LAUNCHER_ANCHOR);
    // Light dismiss, Escape and the focus return are the browser's; the
    // expanded state is the one thing the popover does not tell assistive
    // technology by itself.
    grid.addEventListener('toggle', (event) => {
      btn.setAttribute('aria-expanded', String(event.newState === 'open'));
    }, { signal });
    // Escape belongs to the browser here, so the grid reports itself closed
    // to the nav's own Escape handling.
    const hide = () => { if (grid.matches(':popover-open')) grid.hidePopover(); };
    closeOnLink(grid, hide, signal);
    return { el: wrap, btn, isOpen: () => false, close: hide };
  }

  const close = () => {
    wrap.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
  };
  btn.addEventListener('click', () => {
    const open = !wrap.classList.contains('open');
    wrap.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
  }, { signal });
  // Tabbing out of the grid closes it - focus must never leave an open
  // layer behind. A press on the grid's own padding or heading moves focus
  // to the body without leaving the grid, so a press inside is let through.
  let pressing = false;
  wrap.addEventListener('pointerdown', () => { pressing = true; }, { signal });
  for (const type of ['pointerup', 'pointercancel']) {
    document.addEventListener(type, () => { pressing = false; }, { signal });
  }
  wrap.addEventListener('focusout', (event) => {
    if (pressing) return;
    if (!wrap.contains(event.relatedTarget)) close();
  }, { signal });
  closeOnLink(grid, close, signal);
  return { el: wrap, btn, isOpen: () => wrap.classList.contains('open'), close };
}

/** A shortcut followed from the launcher's grid closes it, so a shortcut to a spot on this page shows the spot. */
function closeOnLink(grid, close, signal) {
  grid.addEventListener('click', (event) => {
    if (!event.defaultPrevented && event.target.closest('a[href]')) close();
  }, { signal });
}
