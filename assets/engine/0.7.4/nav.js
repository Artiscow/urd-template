/**
 * Builds the navigation from site.json - the page register (site.pages) and
 * the nav data (site.nav). Nothing is hardcoded: nav items with `page` look
 * up their path in the page register; items with `href` are external links.
 *
 * Submenus follow the WAI-ARIA "disclosure navigation" pattern (not
 * menubar): real buttons with aria-expanded/aria-controls, natural Tab
 * order and no role="menu". An item with both its own target and a submenu
 * renders as a link plus its own arrow button, so the page stays reachable.
 * The mobile menu (the burger) is a non-modal disclosure of the same list,
 * styled by body.urd-mobile (the breakpoint is set in urd.js from site.json),
 * or with nav.style.mobileMenu 'sheet' a full-screen native <dialog> the
 * list moves into while it is open (ADR-0011: top layer, focus trap, Escape
 * and the scroll lock come from the browser).
 */

import { navItems, navClasses, navSurface, navSubSurface, navLayerVeil, hostClasses, clampSideWidth, clampBorderWidth, navScrollState, navSizeVars, subOpenMode, mobileMenuMode, mobileSubMode, sheetMotion, announcementModel, isSafeImage } from './nav-model.js';
import { themeMode, toggleThemeMode, resolveColor } from './theme.js';
import { renderBackgroundLayers } from './render.js';
import { readCart, cartCount, onCartChange } from './shop.js';
import { createCartDrawer } from './blocks/cart.js';
import { iconSvg } from './icons.js';
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
    renderNav(lastRender.site, lastRender.host);
  }
});

const svg = (path) =>
  `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${path}</svg>`;
const CHEVRON = svg('<path d="M6 9l6 6 6-6"/>');
const BURGER = svg('<path d="M4 6h16M4 12h16M4 18h16"/>');
const SUN = svg('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>');
const MOON = svg('<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>');
const CROSS = svg('<path d="M6 6l12 12M18 6L6 18"/>');

/**
 * @param {object} site site.json, already parsed
 * @param {HTMLElement} host Element the navigation is built into
 */
export function renderNav(site, host) {
  navController?.abort();
  navController = new AbortController();
  const signal = navController.signal;
  navScrollRefresh = null;
  lastRender = { site, host };

  // Narrow windows: the side variant renders as a regular top bar
  // (effective variant bar); the breakpoint listener above re-renders on crossing.
  const wantsSide = site.nav.variant === 'side-left' || site.nav.variant === 'side-right';
  const effSite = wantsSide && narrowMq.matches
    ? { ...site, nav: { ...site.nav, variant: 'bar' } }
    : site;

  host.replaceChildren();
  // A strip placed outside the nav host by the previous render leaves with it.
  document.getElementById('urd-announce')?.remove();

  // The announcement bar (nav.announcement, additive since v0.7): a strip
  // above the menu inside the host. It follows the menu by default; with
  // sticky false the host's sticky top is raised by the strip's height
  // (--urd-announce-h, measured below), so the strip scrolls away and the
  // menu sticks alone. Hosts out of the flow (floating, overlay) are fixed
  // and keep the strip with the menu regardless.
  // A dismissed strip stays away for the visitor as long as the message is
  // the same (localStorage keyed by the text); the preview always shows it.
  const announce = announcementModel(site.nav.announcement, site.pages);
  const dismissKey = announce ? `urd-announce-dismissed:${announce.text}` : '';
  const inPreview = document.body.classList.contains('urd-preview');
  let dismissed = false;
  if (announce?.dismiss && !inPreview) {
    try { dismissed = localStorage.getItem(dismissKey) === '1'; } catch { dismissed = false; }
  }
  let announceEl = null;
  if (announce && !dismissed) {
    announceEl = document.createElement('div');
    announceEl.className = 'urd-nav-announce';
    const inner = document.createElement(announce.href ? 'a' : 'span');
    inner.className = 'urd-nav-announce-text';
    inner.textContent = announce.text;
    if (announce.href) {
      inner.href = announce.href;
      if (/^https?:/i.test(announce.href)) inner.rel = 'noopener';
    }
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
        if (!inPreview) {
          try { localStorage.setItem(dismissKey, '1'); } catch { /* storage may be unavailable */ }
        }
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
    if (announce.dismiss && !inPreview) {
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
  const mobileMq = window.matchMedia(`(max-width: ${site.breakpoints?.mobile ?? 640}px)`);
  mobileMq.addEventListener('change', () => renderNav(lastRender.site, lastRender.host), { signal });
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
  for (const cls of ['urd-nav-float', 'urd-nav-overlay', 'urd-nav-side-host', 'urd-nav-side-host-left', 'urd-nav-side-host-right', 'urd-nav-clear',
    'urd-nav-side-subs-open', 'urd-nav-side-sub-arrow', 'urd-nav-tools-align-start', 'urd-nav-tools-align-center', 'urd-nav-tools-align-end', 'urd-nav-tools-align-spread']) {
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
  // As with sticky blocks the behavior is inactive while editing (preview
  // with chrome on) - a menu that runs off during drag/scroll would fight
  // the editing - and always off while the mobile panel is open. The
  // listener is rAF-throttled, passive and aborted with the rest of the
  // render's listeners.
  const scrollMode = effSite.nav.scroll;
  const wantsScroll = (scrollMode === 'shrink' || scrollMode === 'hide')
    && !isSide && effSite.nav.sticky !== false;
  // Transparent at the top (nav.style.atTop 'clear', additive since v0.7):
  // the host class comes from hostClasses, the surface appears once the
  // page has left the top zone (urd-nav-scrolled). Independent of sticky:
  // a menu that scrolls away is only ever seen in the top zone.
  const clearTop = host.classList.contains('urd-nav-clear');
  host.classList.toggle('urd-nav-scroll', wantsScroll);
  if (!wantsScroll && !clearTop) {
    host.classList.remove('urd-nav-compact', 'urd-nav-hidden', 'urd-nav-scrolled');
  } else {
    let prevY = window.scrollY;
    let hidden = false;
    let ticking = false;
    const applyScroll = () => {
      const body = document.body;
      const editing = body.classList.contains('urd-preview') && !body.classList.contains('urd-chrome-off');
      const menuOpen = nav.classList.contains('urd-nav-open');
      const y = window.scrollY;
      // While editing the menu keeps its full size and stays visible, and
      // while the mobile panel is open its surface is drawn as well; the
      // top-zone state (the clear surface of atTop) follows the scroll
      // position in every view, so the owner sees it while editing.
      const state = editing || menuOpen
        ? { compact: false, hidden: false, scrolled: menuOpen || navScrollState(undefined, prevY, y, hidden).scrolled }
        : navScrollState(wantsScroll ? scrollMode : undefined, prevY, y, hidden);
      prevY = y;
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
  // gap, pill width and shrink factor as inline custom properties the CSS
  // reads with today's look as the fallback; the menu font size inline. The
  // mobile overrides are chosen from the breakpoint here (pure navSizeVars),
  // and the breakpoint listener above re-renders on crossing.
  const size = navSizeVars(site.nav.style, site.nav.logo, { mobile: mobileMq.matches });
  for (const [name, value] of Object.entries(size.vars)) nav.style.setProperty(name, value);
  if (size.font) nav.style.fontSize = size.font;
  // Border (additive since v0.7): the side is a class from navClasses; the
  // width and colour are variables with a hairline in the text colour as
  // the default.
  const border = site.nav.style?.border;
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

  // The tool cluster at the far right: the light/dark toggle (when the
  // theme has an alt counterpart) and the burger. An empty cluster is
  // hidden in CSS (:empty).
  const tools = document.createElement('span');
  tools.className = 'urd-nav-tools';

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
    const drawer = createCartDrawer({ href: cartCfg.href ?? '', currency: cartCfg.currency || 'kr' });
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
    tools.appendChild(cartBtn);
  }

  if (site.theme?.alt?.tokens) {
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
    tools.appendChild(themeBtn);
  }

  // The burger (only visible in mobile view via CSS). With the dropdown it
  // is a non-modal disclosure of the menu list - no focus trap or scroll
  // lock, the panel scrolls itself. With the sheet it opens a modal dialog
  // that the list moves into (and back out of on close), so the same list
  // with its submenu accordions serves both.
  const burger = document.createElement('button');
  burger.className = 'urd-nav-burger';
  burger.type = 'button';
  burger.setAttribute('aria-expanded', 'false');
  burger.setAttribute('aria-controls', 'urd-nav-menu');
  burger.setAttribute('aria-label', t('nav.menu'));
  burger.innerHTML = BURGER;
  tools.appendChild(burger);

  const list = document.createElement('ul');
  list.className = 'urd-nav-list';
  list.id = 'urd-nav-menu';

  const sheet = mobileMenuMode(site.nav.style) === 'sheet'
    ? buildSheet(nav, { list, tools, burger, logo: site.nav.style?.sheetLogo === true ? logo : null, withTheme: site.nav.style?.sheetTheme === true, withCart: site.nav.style?.sheetCart === true, labels: site.nav.style?.sheetToolLabels === true, motion: sheetMotion(site.nav.style), surface: navSurface(site.nav.style?.sheet ?? {}) }, signal)
    : null;
  const isMobileOpen = () => (sheet ? sheet.dialog.open : nav.classList.contains('urd-nav-open'));
  // The mobile state as the CSS sees it: the breakpoint, content folding, or
  // the editor's viewport choice in the preview (body.urd-mobile).
  const isMobileState = () => mobileMq.matches || nav.classList.contains('urd-nav-mobile') || document.body.classList.contains('urd-mobile');
  const subMode = mobileSubMode(site.nav.style);
  // The column can keep every submenu open from the start (nav.style.sideSubs);
  // without the arrow (nav.style.sideSubArrow) nothing closes them.
  const columnExpanded = hc.host.includes('urd-nav-side-subs-open');
  const columnFixedOpen = columnExpanded && !hc.host.includes('urd-nav-side-sub-arrow');
  const expandedSubs = () => (subMode === 'expanded' && isMobileState()) || (columnExpanded && !isMobileState());
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
  };
  if (sheet) sheet.dialog.addEventListener('close', () => burger.setAttribute('aria-expanded', 'false'), { signal });
  burger.addEventListener('click', () => {
    setMobileOpen(!isMobileOpen());
  }, { signal });

  /** All li elements with a submenu, for closeAll. */
  const subs = [];
  const setOpen = (entry, open) => {
    entry.li.classList.toggle('open', open);
    entry.button.setAttribute('aria-expanded', String(open));
  };
  const closeAll = (except) => {
    for (const entry of subs) if (entry !== except) setOpen(entry, false);
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

  const items = navItems(site);
  items.forEach((item, index) => {
    if (item.missing && !item.external) {
      console.warn(`Urd: nav item points to unknown page (${item.label})`);
    }
    const li = document.createElement('li');

    const makeLink = (target) => {
      const a = document.createElement('a');
      a.textContent = target.label;
      a.href = target.href;
      if (target.external) a.rel = 'noopener';
      return a;
    };

    if (item.kind === 'link') {
      li.appendChild(makeLink(item));
      list.appendChild(li);
      return;
    }

    // Item with a submenu: 'split' = link plus its own arrow button (the
    // page stays reachable); 'toggle' = one button carries both the title
    // and the arrow.
    li.className = 'urd-nav-has-sub';
    const subId = `urd-nav-sub-${index}`;
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
      title.textContent = item.label;
      button.appendChild(title);
      button.insertAdjacentHTML('beforeend', CHEVRON);
    }
    li.appendChild(button);

    const sub = document.createElement('ul');
    sub.className = 'urd-nav-sub';
    sub.id = subId;
    if (subMode === 'collapsed' && item.kind === 'split') {
      const selfLi = document.createElement('li');
      selfLi.className = 'urd-nav-sub-self';
      selfLi.appendChild(makeLink(item));
      sub.appendChild(selfLi);
    }
    for (const child of item.children) {
      if (child.missing && !child.external) {
        console.warn(`Urd: nav item points to unknown page (${child.label})`);
      }
      const childLi = document.createElement('li');
      childLi.appendChild(makeLink(child));
      sub.appendChild(childLi);
    }
    li.appendChild(sub);

    const entry = { li, button };
    subs.push(entry);

    button.addEventListener('click', () => {
      if (columnFixedOpen && !isMobileState()) return;
      const open = !li.classList.contains('open');
      // The accordion closes the others, except in the expanded mobile mode
      // where every submenu stands on its own.
      if (!expandedSubs()) closeAll(entry);
      setOpen(entry, open);
    }, { signal });

    if (mouseHover && !columnExpanded) {
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
      if (expandedSubs()) return;
      if (!li.contains(event.relatedTarget)) setOpen(entry, false);
    }, { signal });

    list.appendChild(li);
  });
  if (columnExpanded && !isMobileState()) for (const entry of subs) setOpen(entry, true);

  nav.appendChild(list);
  nav.appendChild(tools);
  host.appendChild(nav);
  // Measured at once, so the first paint already has the menu's clearance;
  // the observer below keeps it current.
  setNavH();

  // The measured menu height as a CSS var on the root element: the nav
  // clearance in base.css (menu out of the flow) and the chrome parking in
  // preview read it. The distance is measured from the host's top to the
  // nav's bottom edge (offsetTop includes the pill's top gap and a sticky
  // announcement); an announcement that scrolls away is left out, since the
  // menu alone is what stays. The column variant takes no top height.
  function setNavH() {
    const announceH = announceEl?.offsetHeight ?? 0;
    const scrolledAway = announceScrolls ? announceH : 0;
    const h = isSide ? 0 : nav.offsetTop + nav.offsetHeight - scrolledAway;
    document.documentElement.style.setProperty('--urd-nav-h', `${h}px`);
    host.style.setProperty('--urd-announce-h', `${announceH}px`);
    // A strip fixed across the whole page: the column starts and the body
    // is padded below it (base.css reads the variable on the root).
    const pageH = announceEl?.classList.contains('urd-announce-page') ? announceH : 0;
    document.documentElement.style.setProperty('--urd-announce-page-h', `${pageH}px`);
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
      }
    } else if (nav.clientWidth > foldNeeds + 8) {
      nav.classList.remove('urd-nav-mobile');
      if (nav.scrollWidth > nav.clientWidth + 1) {
        foldNeeds = nav.scrollWidth;
        nav.classList.add('urd-nav-mobile');
      } else {
        setMobileOpen(false);
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
  signal.addEventListener('abort', () => navRo.disconnect());

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

  // Escape closes the nearest open layer and returns focus to the button
  // that opened it, so keyboard users land where they were. An open
  // accordion inside the sheet closes alone: the cancelled keydown keeps
  // the dialog's own Escape handling from closing the sheet as well.
  nav.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    const openSub = expandedSubs() ? null : subs.find((entry) => entry.li.classList.contains('open'));
    if (openSub) {
      event.preventDefault();
      setOpen(openSub, false);
      openSub.button.focus();
    } else if (!sheet && nav.classList.contains('urd-nav-open')) {
      setMobileOpen(false);
      burger.focus();
    }
  }, { signal });

  // A click outside the nav closes both submenus and the mobile panel.
  document.addEventListener('pointerdown', (event) => {
    if (nav.contains(event.target)) return;
    closeAll();
    setMobileOpen(false);
  }, { signal });
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
function buildSheet(nav, { list, tools, burger, logo, withTheme, withCart, labels, motion, surface }, signal) {
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
  // sheet's own scroll area is cancelled while the sheet is open.
  document.addEventListener('touchmove', (event) => {
    if (!dialog.open) return;
    if (event.target instanceof Element && event.target.closest('.urd-nav-sheet-body')) return;
    event.preventDefault();
  }, { passive: false, signal });
  const toolSelector = [withCart && '.urd-nav-cart', withTheme && '.urd-nav-theme'].filter(Boolean).join(', ');
  const toolButtons = () => (toolSelector ? [...tools.querySelectorAll(toolSelector)] : []);
  let logoNext = null;
  dialog.addEventListener('close', () => {
    nav.insertBefore(list, tools);
    if (logo) nav.insertBefore(logo, logoNext);
    for (const btn of [...foot.children]) tools.insertBefore(btn, burger);
  }, { signal });
  nav.appendChild(dialog);
  const show = () => {
    if (logo) {
      logoNext = logo.nextSibling;
      head.insertBefore(logo, close);
    }
    body.appendChild(list);
    for (const btn of toolButtons()) foot.appendChild(btn);
    dialog.showModal();
  };
  return { dialog, show };
}
