/**
 * The engine's entry point: the global Urd registries, the boot that finds, lifts and draws the page, and the preview's bridge to the editor.
 * Notes: docs/engine-notes/urd.md (Urd repository).
 */
import { createRegistry } from './registry.js';
import { liftPageFile, liftSiteFile, PAGE_SCHEMA_VERSION } from './migrate.js';
import { applyTheme, onlyColoursChanged, sameData } from './theme.js';
import { applySiteLayout, renderPage, renderSection, visitorHeights, updateFrames } from './render.js';
import { loadStylesheet } from './sheets.js';
import { renderNav, refreshNavScroll, clearAnnounceDismissal, holdNavForJump } from './nav.js';
import { isSafeImage, hashTarget, samePageHash, jumpOnArrival } from './nav-model.js';
import { loadCoreTypes, reserveCoreTypes, prepareBlocks, pageBlocks, READY_WAIT_MS } from './core-types.js';
import { loadPlugins, loadPluginList, applyPluginSiteLocales, pluginBlockDesigns, pageTypes, needsPlugins, engineVersionOf } from './plugins.js';
import { feature, loadFeatures, reserveCoreAnimations, siteFeatures, pageFeatures } from './features.js';
import { applyHeadMeta, mountAnalytics, pageTitle } from './seo.js';
import { readPrefetched, revalidateFile, wirePrefetch, sessionStore } from './prefetch.js';
import { t, ta, initSiteLocale, initAdminLocale, requestedLang, siteLang } from './i18n.js';

/** Hands the preview module the shop gate of «+ New block» and «+ New section»: the site's own settings and whether the collection drafts hold a product catalogue. */
function refreshShopGate(site) {
  window.UrdPreviewEdit?.setShopOn?.(site?.site, Boolean(feature('collections')?.draftHasKind('products')));
}

/** The commands plugins registered (Urd.commands), named for the editor's palette: the label from its key when it has one. */
function postCommands() {
  const commands = Urd.commands.ids().map((id) => {
    const def = Urd.commands.get(id);
    return { id, label: def?.labelKey ? ta(def.labelKey) : (def?.label ?? id) };
  });
  window.parent?.postMessage({ type: 'urd-commands', commands }, location.origin);
}

export const Urd = {
  blocks: createRegistry('blocks'),
  sections: createRegistry('sections'),
  backgrounds: createRegistry('backgrounds'),
  animations: createRegistry('animations'),
  // Plugin-provided templates (same def shape as the template files: {name, kind, section|blocks}); the section gallery merges kind section into the plugin group.
  templates: createRegistry('templates'),
  // Commands for the editor's palette (Ctrl/⌘+K): a plugin defines `{ label, labelKey?, run }`, and a chosen one runs here, where the plugin's code lives.
  commands: createRegistry('commands'),
};

// Legacy alias (ADR-0021): plugins written before the rename register through Urd.maler; both names refer to the same registry forever.
Urd.maler = Urd.templates;

// Globally available for plugins (register(Urd)) and the editor's preview bridge.
window.Urd = Urd;

function registerCore() {
  // The core block, background and animation ids are reserved now, each defined as a page asks for it (core-types.js, features.js, ADR-0036).
  reserveCoreTypes(Urd);
  reserveCoreAnimations(Urd);
  // Old plugin contract ids resolve to the renamed ones (ADR-0021), as pages may carry them; a plugin that defines an old id itself wins over the alias.
  Urd.blocks.alias('kalender', 'calendar');
  Urd.blocks.alias('kart', 'map');
  Urd.blocks.alias('skjema', 'form');
  Urd.sections.alias('hva-skjer', 'whats-on');
  Urd.sections.alias('finn-oss', 'find-us');
  Urd.sections.alias('kontaktskjema', 'contact-form');
}

/**
 * The engine version for the plugins' requiresEngine check: the name of this module's folder, else urd.json's `engine`, else '0.0.0'.
 */
async function engineVersion() {
  const folder = engineVersionOf(import.meta.url);
  if (folder) return folder;
  try {
    return (await (await fetch('/urd.json')).json()).engine ?? '0.0.0';
  } catch {
    return '0.0.0';
  }
}

/** The jump being followed now: a newer jump, or the visitor's own scrolling, ends it. */
let jumpControl = null;

/**
 * Follows a jump to this id, holding the menu in view and the spot below as sizes settle; a press, wheel, key, `ms` or the visitor's scroll once landed ends it.
 * @param {string} id
 * @param {number} ms
 * @param {number} [offset] How far past the element's top the window stands, in px
 */
function followJump(id, ms, offset = 0) {
  jumpControl?.abort();
  const control = new AbortController();
  jumpControl = control;
  const { signal } = control;
  let landed = false;
  let waiting = false;
  let own = false;
  let timer = 0;
  const align = () => {
    landed = true;
    waiting = false;
    const el = document.getElementById(id);
    if (!el) return;
    const top = spotTop(el) + offset;
    if (Math.abs(top - window.scrollY) <= 2) return;
    const y = window.scrollY;
    window.scrollTo({ top, behavior: 'instant' });
    own = window.scrollY !== y;
  };
  const later = () => {
    clearTimeout(timer);
    timer = setTimeout(align, 150);
  };
  holdNavForJump();
  window.addEventListener('scroll', () => {
    if (landed && !own) {
      control.abort();
      return;
    }
    own = false;
    holdNavForJump(400);
    if (waiting) later();
  }, { passive: true, signal });
  // The observer reports every element once as it starts, which checks the landing.
  const observer = new ResizeObserver(() => {
    waiting = true;
    later();
  });
  observer.observe(document.documentElement);
  const menu = document.querySelector('#urd-nav > nav');
  if (menu) observer.observe(menu, { box: 'border-box' });
  signal.addEventListener('abort', () => {
    observer.disconnect();
    clearTimeout(timer);
  });
  for (const type of ['wheel', 'touchstart', 'keydown', 'pointerdown']) {
    window.addEventListener(type, () => control.abort(), { capture: true, passive: true, once: true, signal });
  }
  setTimeout(() => control.abort(), ms);
}

/**
 * Scrolls at once to the element with this id, below a menu that stays on screen or `offset` px past it, and follows the jump while the page settles.
 * @param {string|null} id
 * @param {number} [offset]
 * @returns {boolean} Whether the element was there
 */
function jumpTo(id, offset = 0) {
  const el = id ? document.getElementById(id) : null;
  if (!el) return false;
  followJump(id, 4000, offset);
  window.scrollTo({ top: spotTop(el) + offset, behavior: 'instant' });
  return true;
}

/**
 * The scroll position that puts an element's top, as laid out without an entrance animation's transforms, right below the page's scroll-padding-top.
 * @param {HTMLElement} el
 * @returns {number}
 */
function spotTop(el) {
  let top = 0;
  for (let node = el; node; node = node.offsetParent) top += node.offsetTop;
  const clear = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
  return Math.max(0, top - clear);
}

/**
 * The name of the spot a section's or block's id stands for, when it has one (the marker render.js draws with data-spot), else null.
 * @param {string} id
 * @returns {string|null}
 */
function spotName(id) {
  return document.querySelector(`.urd-anchor[data-spot="${CSS.escape(id)}"]`)?.id ?? null;
}

/**
 * Follows a plain left click's jump to a spot on this page; for a named spot, or a link whose path has another trailing slash, the engine makes the jump itself.
 */
function wireJumps() {
  document.addEventListener('click', (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const link = event.target instanceof Element ? event.target.closest('a[href]') : null;
    if (!link || (link.target && link.target !== '_self') || link.hasAttribute('download')) return;
    const spot = samePageHash(link.getAttribute('href'), location);
    const linked = spot ? hashTarget(spot.hash) : null;
    if (!linked || !document.getElementById(linked)) return;
    const id = spotName(linked) ?? linked;
    followJump(id, 2500);
    if (spot.inPlace && id === linked) return;
    event.preventDefault();
    if (location.hash !== `#${id}`) location.hash = id;
    else window.scrollTo({ top: spotTop(document.getElementById(id)), behavior: 'auto' });
  });
}

/**
 * The arrival jump to the address's fragment, made once the page is drawn where jumpOnArrival allows it; a prerendered page jumps when it is shown.
 */
function arriveAtSpot() {
  const jump = () => {
    // Without a spot in the address there is nothing to jump to, and the scroll position is not read.
    if (!location.hash) return;
    const navigationType = performance.getEntriesByType?.('navigation')?.[0]?.type;
    if (!jumpOnArrival({ hash: location.hash, navigationType, scrollY: window.scrollY })) return;
    // A link holds the spot's id: the address shows the spot's name, in the same history entry.
    const linked = hashTarget(location.hash);
    const name = linked ? spotName(linked) : null;
    if (name) history.replaceState(history.state, '', `#${name}`);
    jumpTo(name ?? linked);
  };
  if (document.prerendering) document.addEventListener('prerenderingchange', jump, { once: true });
  else jump();
}

/**
 * Cross-document View Transitions (ADR-0011): an arriving page's transition is held under the `urd-arriving` class until the first render ends it as a cut.
 */
let arrival = null;
let firstRenderDone = false;
function wireArrivalHold() {
  window.addEventListener('pagereveal', (event) => {
    if (!event.viewTransition || firstRenderDone) return;
    arrival = event.viewTransition;
    document.documentElement.classList.add('urd-arriving');
    arrival.finished.finally(() => {
      document.documentElement.classList.remove('urd-arriving');
      arrival = null;
    });
  });
}
export function endArrivalHold() {
  firstRenderDone = true;
  arrival?.skipTransition();
}

/**
 * The site icon (favicon) from site.json: overrides the default icon in index.html.
 * Additive field; without an icon the Urd mark is kept.
 */
function applyFavicon(href) {
  // Only known icon shapes (data:image base64 or a site-relative path); shared guard with the nav logo, the footer logo and the image layers.
  if (!isSafeImage(href)) return;
  let link = document.querySelector('link[rel="icon"]');
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);
  }
  link.href = href;
}

/**
 * Finds the URL's page in the register: ?page=<id>, then the path, else the first page even if hidden; a hidden page is found by id or path only in the preview.
 * @param {object} site
 * @param {boolean} [preview]
 */
function resolvePage(site, preview = false) {
  const pages = preview ? site.pages : site.pages.filter((p) => !p.hidden);
  const params = new URLSearchParams(location.search);
  const wanted = params.get('page');
  if (wanted) {
    const byId = pages.find((p) => p.id === wanted);
    if (byId) return byId;
  }
  const path = location.pathname.replace(/\/$/, '') || '/';
  return pages.find((p) => p.path === path) ?? site.pages[0];
}

/** This browser's editor drafts (drafts.js); with `look`, a saved draft handed to this tab stands over them; null where storage is closed. */
async function loadDrafts(look = false, lookId = null) {
  try {
    const { readDrafts, overlayDrafts, receiveLook } = await import('./drafts.js');
    const own = readDrafts(localStorage);
    if (!look) return own;
    receiveLook(lookId, localStorage, sessionStorage);
    return overlayDrafts(readDrafts(sessionStorage), own);
  } catch {
    return null;
  }
}

/** The draft view's mark, so the owner never takes the page for the published one. */
function markDraftView() {
  const mark = document.createElement('p');
  mark.className = 'urd-draft-view';
  mark.setAttribute('role', 'note');
  mark.textContent = t('draft.view');
  document.body.appendChild(mark);
}

/** The spell check the editor asked for on the texts; the clean view turns it off while it lasts. */
let spellcheckOn = true;

/**
 * The Clean view makes the texts written in place plain, their kind kept in data-urd-editable and given back as it ends; a text drawn meanwhile turns plain too.
 */
let cleanWatcher = null;
function cleanTexts(on) {
  const plain = () => {
    for (const node of document.body.querySelectorAll('[contenteditable="true"], [contenteditable="plaintext-only"]')) {
      node.dataset.urdEditable = node.getAttribute('contenteditable');
      node.setAttribute('contenteditable', 'false');
    }
  };
  cleanWatcher?.disconnect();
  cleanWatcher = null;
  if (on) {
    if (document.activeElement instanceof HTMLElement && document.activeElement.isContentEditable) document.activeElement.blur();
    plain();
    // Only an element that comes is read again (a ticking countdown changes its text alone); the attribute set here is not watched, so the pass never calls itself.
    cleanWatcher = new MutationObserver((records) => {
      if (records.some((record) => [...record.addedNodes].some((node) => node.nodeType === Node.ELEMENT_NODE))) plain();
    });
    cleanWatcher.observe(document.body, { childList: true, subtree: true });
    return;
  }
  for (const node of document.body.querySelectorAll('[data-urd-editable]')) {
    node.setAttribute('contenteditable', node.dataset.urdEditable);
    delete node.dataset.urdEditable;
  }
}

/** How many types the plugins have defined (a language pack defines none); the engine's own, which the preview defines as they come in, are not counted. */
const definedCount = () => ['blocks', 'sections', 'backgrounds', 'animations', 'templates', 'commands'].reduce((n, kind) => n + Urd[kind].ids().filter((id) => !Urd[kind].isReserved(id)).length, 0);

/**
 * Attaches the editor's message listener in preview mode, in the draw queue's order; `state` is shared with boot, so every message works on the same data.
 * @param {object} state
 * @param {object} opts
 * @param {typeof import('./preview-queue.js')} queue
 */
function enablePreview(state, opts, queue) {
  const root = opts.root;
  const vp = () => ({ preview: true, viewport: state.viewport });

  /* Language switches run one at a time, each reading the draft's language as it runs; langOutOfSync stays true while one is in flight. */
  let langQueue = Promise.resolve();
  let langPending = 0;
  const langOutOfSync = () => langPending > 0 || requestedLang(state.site.site?.lang) !== siteLang();
  function syncSiteLocale() {
    langPending++;
    langQueue = langQueue.then(async () => {
      try {
        if (requestedLang(state.site.site?.lang) !== siteLang()) {
          document.documentElement.lang = await initSiteLocale(state.site.site?.lang);
          await applyPluginSiteLocales();
        }
      } finally {
        langPending--;
      }
    });
    return langQueue;
  }
  /**
   * Keeps the scroll position across a full rerender, restored two frames later, as the document collapses while the data blocks measure.
   */
  const keepScroll = (fn) => {
    const y = window.scrollY;
    fn();
    // A jump being followed owns the scroll position, and the restore is never animated.
    requestAnimationFrame(() => requestAnimationFrame(() => {
      if (jumpControl && !jumpControl.signal.aborted) return;
      window.scrollTo({ top: y, behavior: 'instant' });
    }));
  };
  /** A redraw that keeps the field the owner is typing in (keepTyping), once the editing module has loaded. */
  const typing = (paint) => (window.UrdPreviewEdit?.keepTyping ?? ((fn) => fn()))(paint);
  /** The ribbon motion demo's timer: a new press restarts the six seconds. */
  let motionDemoTimer = 0;
  /** The measures waiting per block for the editor's fit of its frame (urd-fit-block). */
  const fitTimers = new Map();

  /** The plugin list last sent, loaded and drawn; the start's answer waits for it. */
  let pluginsIn = Promise.resolve();
  /** Whether every type, part and feature is in, which the background load asked for once (rest) brings. */
  let allIn = false;
  let restAsked = false;
  const rest = () => {
    if (restAsked) return;
    restAsked = true;
    queue.loadEverything(Urd).then(() => { allIn = true; });
  };

  /** One message from the editor, or the preview's own redraw, handled in its turn. */
  const handle = (msg) => {
    // Pinning is wired once its module is in, which a page opened without a pinned block loads only as one comes.
    feature('sticky')?.initSticky();
    if (msg === queue.REDRAW) {
      if (state.page) keepScroll(() => typing(() => renderPage(state.page, state.site, root, vp())));
      return;
    }
    // A `startup` view, site or page that matches what the preview already holds is skipped, so the page does not flicker as the editor opens.
    if (msg?.startup === true && ((msg.type === 'urd-viewport' && msg.mode === state.viewport) || (msg.type === 'urd-site' && !msg.page && sameData(msg.site, state.site)) || (msg.type === 'urd-preview-full' && sameData(msg.page, state.page)))) return;
    if (msg?.type === 'urd-preview' && msg.section) {
      const host = root.querySelector(`[data-section-id="${msg.section.id}"]`);
      if (host) typing(() => renderSection(msg.section, state.site, host, vp()));
      const i = state.page.sections.findIndex((s) => s.id === msg.section.id);
      if (i >= 0) state.page.sections[i] = msg.section;
    } else if (msg?.type === 'urd-preview-full' && msg.page) {
      // A page without sections draws empty, as in boot(); the same page again (an undo, a redo) keeps the scroll position, a switch to another page does not.
      const samePage = msg.page?.meta?.id === state.page?.meta?.id;
      state.page = msg.page;
      if (!Array.isArray(state.page.sections)) state.page.sections = [];
      // The tab title follows the page's search title and name as they are edited.
      document.title = pageTitle(state.site, state.page, state.site.pages?.find((p) => p.id === state.page.meta?.id));
      const paint = () => renderPage(state.page, state.site, root, vp());
      if (samePage) keepScroll(() => typing(paint)); else paint();
      // Page switch in the editor: the footer and the menu can have per-page visibility (hideOn).
      if (opts.footer) feature('footer')?.renderFooter(state.site, opts.footer, state.page?.meta?.id);
      if (!samePage && opts.nav) renderNav(state.site, opts.nav, state.page?.meta?.id);
    } else if (msg?.type === 'urd-spellcheck') {
      // The browser's spell check on the editable texts, which the body's attribute governs for every text under it.
      spellcheckOn = msg.on !== false;
      document.body.spellcheck = spellcheckOn && !document.body.classList.contains('urd-chrome-off');
    } else if (msg?.type === 'urd-chrome') {
      // Clean view: hide/show the editing handles (CSS only, see base.css), and no spell marks, since nothing is being written.
      document.body.classList.toggle('urd-chrome-off', !msg.visible);
      document.body.spellcheck = spellcheckOn && msg.visible;
      // Every text written in place is plain text in the Clean view, as on the published page: no caret, no focus frame, and the links and buttons around it work.
      cleanTexts(!msg.visible);
      // The pinning and the menu's scroll state follow the switch at once, not first at the next scroll.
      feature('sticky')?.refreshSticky();
      refreshNavScroll();
      // The bar the editor draws for a selected block in the phone view goes and comes back with the handles.
      window.UrdPreviewEdit?.watchPhoneBar?.();
    } else if (msg?.type === 'urd-fit-block' && msg.blockId) {
      // Measures the height a block that follows its content needs (ADR-0025) three times, as a design or feed can draw late; a newer request replaces those waiting.
      for (const timer of fitTimers.get(msg.blockId) ?? []) clearTimeout(timer);
      const measure = () => {
        const el = root.querySelector(`.urd-block[data-block-id="${CSS.escape(msg.blockId)}"]`);
        // A block in a section showing its phone layout on the desktop (render.js urd-handoff) stands in a phone cell, which is no measure of its desktop frame.
        if (!el || el.closest('.urd-handoff') || el.querySelector('[aria-busy="true"]')) return;
        // Measured as a visitor sees the block at rest: the adders and the placeholders of empty fields are the editor's own and never part of the design's height.
        const h = visitorHeights(el).resting;
        if (h > 0) window.parent?.postMessage({ type: 'urd-grow', sectionId: msg.sectionId, blockId: msg.blockId, h, fit: true, seq: msg.seq ?? 0 }, location.origin);
      };
      fitTimers.set(msg.blockId, [500, 1800, 5000].map((wait) => setTimeout(measure, wait)));
    } else if (msg?.type === 'urd-fit-new' && msg.blockId && Number.isFinite(msg.w)) {
      // A block just added from «+ New block», the Blocks panel or the palette: its box is fitted to what it draws (add-fit.js).
      window.UrdPreviewEdit?.fitNewBlock?.(msg.sectionId, msg.blockId, msg.w);
    } else if (msg?.type === 'urd-frames' && msg.sectionId && msg.frames) {
      // Frames the editor fitted to their content are put in place without drawing the section again, so a caret in the block stays where it is.
      const host = root.querySelector(`[data-section-id="${CSS.escape(msg.sectionId)}"]`);
      if (host) updateFrames(host, msg.frames);
    } else if (msg?.type === 'urd-announce-reset') {
      // The Announcement panel: forget the dismissal, so the strip returns in the preview and for this browser on the published page.
      clearAnnounceDismissal(state.site);
      if (opts.nav) renderNav(state.site, opts.nav, state.page?.meta?.id);
    } else if (msg?.type === 'urd-demo-motion') {
      // The ribbons stand still while the editing chrome is on; this rolls them for a few seconds as a demo, except under reduced motion.
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.body.classList.add('urd-motion-demo');
        clearTimeout(motionDemoTimer);
        motionDemoTimer = setTimeout(() => document.body.classList.remove('urd-motion-demo'), 6000);
      }
    } else if (msg?.type === 'urd-show-grid') {
      // The grid menu in the editor is open: show the grid in all sections.
      window.UrdPreviewEdit?.toggleGridOverlays(msg.visible, state.page, state.site);
    } else if (msg?.type === 'urd-admin-theme' && msg.colors) {
      // The admin colour theme, set as `--urd-admin-*` variables that only the editor's chrome in the preview reads, never the page's own content.
      for (const key of ['bg', 'surface', 'accent', 'text', 'accent-text']) {
        if (typeof msg.colors[key] === 'string') {
          document.documentElement.style.setProperty(`--urd-admin-${key}`, msg.colors[key]);
        }
      }
    } else if (msg?.type === 'urd-show-guides') {
      // The guide button in the editor: center and width guides on/off.
      window.UrdPreviewEdit?.toggleGuideOverlays(msg.visible);
    } else if (msg?.type === 'urd-place-block' && msg.block) {
      // The palette: find a placement in the middle of the viewport and report back.
      window.UrdPreviewEdit?.placeBlock(msg.block, root);
    } else if (msg?.type === 'urd-demo-anim' && msg.sectionId) {
      // The editor changed an animation: play it once as a demo.
      const host = root.querySelector(`[data-section-id="${msg.sectionId}"]`);
      const el = msg.blockId ? host?.querySelector(`[data-block-id="${msg.blockId}"]`) : host;
      window.UrdPreviewEdit?.demoAnimation(el);
    } else if (msg?.type === 'urd-open-block-config' && msg.blockId) {
      // The plugin block's settings open from Properties: click the hidden config toggle in the block.
      root.querySelector(`[data-block-id="${msg.blockId}"] .urd-cfg-toggle`)?.click();
    } else if (msg?.type === 'urd-text-style' && msg.blockId) {
      // A style for the whole text from the text's menu: the field takes focus, which brings the text toolbar, and gets the style as an `urd-text-style` event.
      const field = root.querySelector(`[data-block-id="${CSS.escape(msg.blockId)}"] .urd-text[contenteditable="true"]`);
      if (field) {
        field.scrollIntoView({ block: 'center', behavior: 'instant' });
        field.focus({ preventScroll: true });
        if (msg.style && typeof msg.style === 'object') field.dispatchEvent(new CustomEvent('urd-text-style', { detail: msg.style, bubbles: true }));
      }
    } else if (msg?.type === 'urd-attention' && msg.sectionId) {
      // A section flagged for the phone's review, or cleared: marked live and in the page the preview holds, so a redraw keeps the mark.
      const needed = msg.needed !== false;
      const held = state.page?.sections?.find((s) => s.id === msg.sectionId);
      if (held) {
        const mobile = held.responsive?.mobile ?? { mode: 'auto' };
        held.responsive = { ...(held.responsive ?? {}), mobile: { ...mobile, attention: needed ? { ...(mobile.attention ?? {}), needed: true } : null } };
      }
      root.querySelector(`[data-section-id="${msg.sectionId}"]`)
        ?.classList.toggle('urd-attention', needed);
      window.UrdPreviewEdit?.reportAttention?.();
    } else if (msg?.type === 'urd-scroll-section' && msg.sectionId) {
      // A section the editor brings into view (its attention badge, phone check, Phone panel, palette, Drafts window or shop links): a jump, followed as it settles.
      jumpTo(msg.sectionId);
    } else if (msg?.type === 'urd-scroll-to' && typeof msg.sectionId === 'string') {
      // A reload of the editor: the canvas comes back to where it was scrolled, by the section at its top and the offset past it (the editor's lib/reload-place.js).
      jumpTo(msg.sectionId, Math.max(0, Number(msg.offset) || 0));
    } else if (msg?.type === 'urd-link-apply') {
      // The link editor's answer for the text being edited: written on the selection the text toolbar kept.
      window.UrdPreviewEdit?.applyTextLink(msg.link ?? null, state.site.pages ?? []);
    } else if (msg?.type === 'urd-scroll-anchor' && typeof msg.hash === 'string') {
      // A link in the preview to a spot on a page: the editor sends it once that page stands, and the preview jumps there as the published page does on arrival.
      jumpTo(hashTarget(msg.hash));
    } else if (msg?.type === 'urd-collections' && msg.collections) {
      // Collection drafts from the editor stand in for the server files; only the sections with collection blocks are drawn again, keeping the scroll position.
      feature('collections')?.setCollectionsDraft(msg.collections);
      refreshShopGate(state.site);
      const usesCollections = (b) => Boolean(Urd.blocks.get(b.type)?.usesCollections);
      typing(() => {
        for (const section of state.page.sections ?? []) {
          if (!Array.isArray(section.blocks) || !section.blocks.some(usesCollections)) continue;
          const host = root.querySelector(`[data-section-id="${section.id}"]`);
          if (host) renderSection(section, state.site, host, vp());
        }
      });
    } else if (msg?.type === 'urd-templates') {
      // The template drafts from the editor: shown in the My templates tab in "+ New section".
      window.UrdPreviewEdit?.setTemplates?.(msg.templates);
    } else if (msg?.type === 'urd-insert-template') {
      // The Blocks panel's My templates: insert the block group template into the active section.
      window.UrdPreviewEdit?.insertTemplate?.(msg.id);
    } else if (msg?.type === 'urd-close-menus') {
      // The owner clicked in the admin panels: close open menus (preset gallery, block menu).
      window.UrdPreviewEdit?.closeMenus();
    } else if (msg?.type === 'urd-caret' && typeof msg.blockId === 'string') {
      // An undo of typing: the caret back where the typing began, in the text as it now stands.
      window.UrdPreviewEdit?.placeCaret?.(msg.blockId, Number(msg.offset));
    } else if (msg?.type === 'urd-active-section') {
      // A section the editor selected itself (new, duplicated or pasted): the page marks it as the active one.
      window.UrdPreviewEdit?.setActiveSection?.(msg.sectionId ?? null);
    } else if (msg?.type === 'urd-clipboard') {
      // The editor's clipboard for the page just loaded: a copy made on another page pastes here.
      window.UrdPreviewEdit?.setClipboard?.(msg.clipboard ?? null);
    } else if (msg?.type === 'urd-duplicate') {
      // Ctrl+D with focus in the admin panels: duplicate the selected block in the preview.
      window.UrdPreviewEdit?.duplicateSelected();
    } else if (msg?.type === 'urd-select' && msg.blockId) {
      // The editor built a block itself (the + New block menu), or one was picked in its lists (the Phone panel's order, `picked`): select it.
      window.UrdPreviewEdit?.selectById(msg.blockId, msg.picked === true);
    } else if (msg?.type === 'urd-text-cmd' && typeof msg.cmd === 'string') {
      // A command of the editor's text bar on the text being written.
      window.UrdPreviewEdit?.textCommand?.(msg.cmd, msg.value, msg.focus === true);
    } else if (msg?.type === 'urd-text-end') {
      // A press in the editor outside its text bar: the writing ends.
      window.UrdPreviewEdit?.endTextEditing?.();
    } else if (msg?.type === 'urd-deselect') {
      // A press on the editor's stage around the canvas: nothing stays selected.
      window.UrdPreviewEdit?.deselectAll?.();
    } else if (msg?.type === 'urd-bar-press' && typeof msg.id === 'string' && Number.isInteger(msg.index)) {
      // A tool of a bar the editor draws in the phone view, the block's or the section's, pressed there.
      window.UrdPreviewEdit?.pressPhoneBar(msg.bar === 'section' ? 'section' : 'block', msg.id, msg.index, msg.rest === true);
    } else if (msg?.type === 'urd-section-settings' && typeof msg.sectionId === 'string') {
      // A section's settings asked for from the editor's own lists (the Phone panel), opened as its gear opens them.
      window.UrdPreviewEdit?.openSectionSettingsById(msg.sectionId);
    } else if (msg?.type === 'urd-ctx-run' && Number.isInteger(msg.index)) {
      // A row of the phone view's menu, chosen where the editor draws it.
      window.UrdPreviewEdit?.runPhoneMenu(msg.index);
    } else if (msg?.type === 'urd-ctx-closed') {
      window.UrdPreviewEdit?.phoneMenuClosed(msg.focus === true);
    } else if (msg?.type === 'urd-block-words' && msg.sectionId && msg.blockId) {
      // A block's desktop and phone words (ADR-0033) as the editor keeps them go into the page's copy without a redraw, so a later drawing reads them.
      const held = state.page?.sections?.find((s) => s.id === msg.sectionId)?.blocks?.find((b) => b.id === msg.blockId);
      if (held) {
        if (msg.props && typeof msg.props === 'object') held.props = msg.props;
        if (msg.phoneProps && typeof msg.phoneProps === 'object') held.phoneProps = msg.phoneProps;
        else delete held.phoneProps;
      }
    } else if (msg?.type === 'urd-phone-same-height' && typeof msg.sectionId === 'string') {
      // «Same height» from the section's phone settings, and after a preset: the section's lines measured and posted back.
      window.UrdPreviewEdit?.matchPhoneHeights?.(msg.sectionId, msg.follow === true);
    } else if (msg?.type === 'urd-phone-pin' && typeof msg.blockId === 'string') {
      // The Phone panel's row menu: the block pinned on the phone where it stands now.
      window.UrdPreviewEdit?.pinOnPhoneAt?.(msg.blockId);
    } else if (msg?.type === 'urd-ask-picture' && typeof msg.blockId === 'string') {
      // «Open the image editor» in the block's menu: the editor opens as a press on the picture opens it, measured as drawn.
      window.UrdPreviewEdit?.askPictureAt?.(msg.sectionId, msg.blockId, msg.kind === 'cover' ? 'cover' : 'image');
    } else if (msg?.type === 'urd-light' && Array.isArray(msg.ids)) {
      // A row under the pointer in the editor's lists (the Phone panel's order) lights its block, or its stack's blocks.
      window.UrdPreviewEdit?.lightBlocks?.(msg.ids, msg.sectionId);
    } else if (msg?.type === 'urd-startup-done') {
      // The start is drawn: the answer waits for its language, and its plugins where the page draws their type or language; then the rest of the engine comes in.
      const needed = langOutOfSync() || needsPlugins(pageTypes(state.page, state.site.nav, state.site.footer), Urd);
      Promise.all([langQueue, needed ? pluginsIn : null].map((step) => step?.catch(() => {}))).then(() => requestAnimationFrame(() => requestAnimationFrame(() => {
        window.parent?.postMessage({ type: 'urd-shown', round: msg.round ?? null }, location.origin);
        rest();
      })));
    } else if (msg?.type === 'urd-plugins') {
      // The editor's plugin draft: load the enabled plugins (the files are already in the repo) and rerender, so plugins work in the preview BEFORE publishing.
      const before = definedCount();
      pluginsIn = loadPluginList(Urd, state.engine, msg.enabled).then(async () => {
        // The list may have contained a LANGUAGE PACK: if the draft's language was unknown when the site draft arrived (or at boot), it is loaded now.
        const language = langOutOfSync();
        if (language) await syncSiteLocale();
        // The page is drawn again only where a plugin defined something it may draw, or brought its language; a language pack for another language changes nothing drawn.
        if (language || definedCount() !== before) renderPage(state.page, state.site, root, vp());
        // Report the plugin blocks back (type, label, defaults), so the Blocks panel in admin can show them in its own "From plugins" section.
        const blocks = [];
        for (const type of Urd.blocks.ids()) {
          const def = Urd.blocks.get(type);
          if (!def?.fromPlugin) continue;
          // Plugin labels are resolved here, where the plugin dictionary lives, and sent as finished strings, since the admin window's dictionary has no plugin keys.
          blocks.push({
            type,
            label: def.labelKey ? ta(def.labelKey) : (def.label ?? type),
            version: def.version ?? 1,
            plugin: def.fromPlugin,
            defaults: def.defaults ? def.defaults() : {},
            variants: Array.isArray(def.variants)
              ? def.variants.map((v) => ({ label: v.labelKey ? ta(v.labelKey) : v.label, props: v.props ?? {} }))
              : [],
            // The field contract (additive): a def with `fields` gets its settings in the Properties panel, their labels resolved here as the block's are.
            fields: Array.isArray(def.fields)
              ? def.fields.map((f) => ({
                  key: f.key,
                  type: f.type,
                  label: f.labelKey ? ta(f.labelKey) : (f.label ?? f.key),
                  ...(f.hintKey || f.hint ? { hint: f.hintKey ? ta(f.hintKey) : f.hint } : {}),
                  placeholder: f.placeholderKey ? ta(f.placeholderKey) : (f.placeholder ?? ''),
                  ...(f.min !== undefined ? { min: f.min } : {}),
                  ...(f.max !== undefined ? { max: f.max } : {}),
                  ...(f.step !== undefined ? { step: f.step } : {}),
                  ...(Array.isArray(f.options)
                    ? { options: f.options.map((o) => ({ value: o.value, label: o.labelKey ? ta(o.labelKey) : (o.label ?? String(o.value)) })) }
                    : {}),
                }))
              : [],
            // The design contract (additive): a def with `designs` gets the design picker in its menu, its labels resolved here too.
            designs: pluginBlockDesigns(def, ta),
          });
        }
        window.parent?.postMessage({ type: 'urd-plugin-blocks', blocks }, location.origin);
        postCommands();
      });
    } else if (msg?.type === 'urd-run-command' && typeof msg.id === 'string') {
      // A command chosen in the editor's palette: it runs here, where the plugin registered it.
      const def = Urd.commands.get(msg.id);
      if (typeof def?.run === 'function') def.run({ Urd, page: state.page, site: state.site });
    } else if (msg?.type === 'urd-zoom') {
      // The editing handles keep their screen size under the canvas zoom: `--urd-chrome-scale` is set to 1/zoom, with no redraw.
      const z = Number(msg.scale);
      document.documentElement.style.setProperty(
        '--urd-chrome-scale',
        Number.isFinite(z) && z > 0 ? String(1 / z) : '1',
      );
    } else if (msg?.type === 'urd-viewport' && (msg.mode === 'desktop' || msg.mode === 'mobile')) {
      // The preview follows the editor's view choice, never the iframe width:
      // a narrow admin window must not flip the preview to mobile and hide the structure tools.
      state.viewport = msg.mode;
      document.body.classList.toggle('urd-mobile', state.viewport === 'mobile');
      renderPage(state.page, state.site, root, vp());
      // The menu follows the view as well: a phone menu left open closes on the desktop, and its submenus take the view's own form.
      if (opts.nav) renderNav(state.site, opts.nav, state.page?.meta?.id);
    } else if (msg?.type === 'urd-site' && msg.site && !msg.page && onlyColoursChanged(state.site, msg.site)) {
      // A change of the theme's colours alone applies the theme's CSS without a redraw, and goes into the site the nav holds for its light and dark toggle.
      state.site.theme = msg.site.theme;
      applyTheme(state.site.theme);
    } else if (msg?.type === 'urd-site' && msg.site) {
      // A site draft from the editor redraws everything that depends on site.json, its missing parts given empty defaults as in boot().
      state.site = msg.site;
      state.site.site ??= { title: '', lang: 'no' };
      state.site.pages ??= [];
      state.site.theme ??= { version: 1, tokens: {} };
      state.site.nav ??= { version: 1, items: [] };
      // The open page sent with the site, where one change moved both (an undo, the end of a look, a discard, a page renamed), is drawn in the same pass.
      if (msg.page) {
        state.page = msg.page;
        if (!Array.isArray(state.page.sections)) state.page.sections = [];
      }
      refreshShopGate(state.site);
      // The tab title follows the draft's title format and site title.
      document.title = pageTitle(state.site, state.page, state.site.pages.find((p) => p.id === state.page?.meta?.id));
      const rerender = () => keepScroll(() => typing(() => {
        applyTheme(state.site.theme);
        applySiteLayout(state.site);
        applyFavicon(state.site.site?.icon);
        if (opts.nav) renderNav(state.site, opts.nav, state.page?.meta?.id);
        if (opts.footer) feature('footer')?.renderFooter(state.site, opts.footer, state.page?.meta?.id);
        feature('totop')?.renderToTop(state.site, document.body, feature('shape'));
        renderPage(state.page, state.site, root, vp());
      }));
      // A changed site.lang reloads the visitor locale and the plugin texts (syncSiteLocale) and then redraws, so the preview shows the draft's language.
      if (langOutOfSync()) {
        syncSiteLocale().then(rerender);
      } else {
        rerender();
      }
    }
  };

  // Until every type, part and feature is in, a message that draws loads what it draws first, and the messages after it wait in turn (preview-queue.js).
  const pending = (msg) => {
    if (allIn) return null;
    const drawn = queue.drawnBy(msg, state);
    return drawn ? queue.loadDrawn(Urd, drawn, msg?.type === 'urd-viewport' ? msg.mode : state.viewport) : null;
  };
  const take = queue.drawQueue(handle, pending);

  // The bars' choices in the Urd settings (BAR_CHOICES in bar-tools.js) stand in the storage the editor shares, so a change there draws the page anew.
  window.addEventListener('storage', (event) => {
    if (['urd-block-toolbar', 'urd-toolbar-look', 'urd-toolbar-gear', 'urd-toolbar-phone', 'urd-toolbar-size', 'urd-toolbar-design', 'urd-toolbar-phone-place'].includes(event.key)) take(queue.REDRAW);
  });

  window.addEventListener('message', (event) => {
    // Only the editor on the same site, and only through the frame it holds: a window the page opened shares the origin but is not the editor.
    if (event.origin !== location.origin || event.source !== window.parent) return;
    take(event.data);
  });

  // Tell the editor the listener is attached: drafts sent before this point would be lost (the iframe load happens before boot finishes).
  window.parent?.postMessage({ type: 'urd-ready' }, location.origin);
  // The rest comes as the editor's start is drawn (urd-startup-done), or, for a frame that sends none, at an idle time a moment after ready.
  setTimeout(() => (typeof window.requestIdleCallback === 'function' ? window.requestIdleCallback(rest, { timeout: 1000 }) : rest()), START_WAIT_MS);
}

/** How long after ready a preview whose editor sends no start (the design picker's, the phone fit's) waits before it loads the rest of the engine. */
const START_WAIT_MS = 2500;

/**
 * Asks for a background's image layer pictures ahead of its drawing, as such a layer stays hidden until its picture is in; resolves decoded or at READY_WAIT_MS.
 * @param {object|undefined} background
 * @returns {Promise<void>}
 */
function askLayerPictures(background) {
  const asked = [];
  for (const layer of Array.isArray(background?.layers) ? background.layers : []) {
    if (layer?.type !== 'image' || !isSafeImage(layer.props?.src)) continue;
    const img = new Image();
    img.setAttribute('fetchpriority', 'high');
    img.src = layer.props.src;
    asked.push(img.decode().catch(() => {}));
  }
  if (!asked.length) return Promise.resolve();
  return Promise.race([Promise.all(asked), new Promise((resolve) => setTimeout(resolve, READY_WAIT_MS))]).then(() => {});
}

/**
 * Boots the engine.
 * @param {{root: HTMLElement, nav?: HTMLElement}} opts
 */
export async function boot(opts) {
  registerCore();
  // Wired ahead of the first await, so the listener is in place as the arriving page's pagereveal fires; inert in the preview, which switches pages by message.
  wireArrivalHold();

  // The engine version, read from this module's own folder (engineVersion), is awaited right before the plugins load; site.json goes first.
  const enginePromise = engineVersion();

  // The served texts and ETags, kept so a parked, prerendered or restored page can recheck them against the server (recheck below).
  const served = { site: null, page: null };
  const params = new URLSearchParams(location.search);
  const preview = params.get('preview') === '1';
  // In the preview alone, the editing layer, its draw queue, preview.css and the admin language (ADR-0012) are asked for as the boot starts, beside the site.
  const editing = preview ? Promise.all([import('./preview-edit.js'), import('./preview-queue.js'), loadStylesheet(new URL('./preview.css', import.meta.url).href), initAdminLocale()]) : null;
  // The rejection is consumed here; the failure is handled where the promise is awaited.
  editing?.catch(() => {});
  // The draft view (?draft=1) draws this browser's editor drafts as a visitor's page, ?draft=look a saved draft; the preview reads them too, beside site.json.
  const draftMode = preview ? null : params.get('draft');
  const draftsRead = preview || draftMode === '1' || draftMode === 'look' ? loadDrafts(draftMode === 'look', params.get('look')) : null;
  const siteRes = await fetch('/content/site.json');
  const siteText = await siteRes.text();
  served.site = { text: siteText, etag: siteRes.headers.get('etag') };
  const drafts = draftsRead ? await draftsRead : null;
  // The site as stored, or its draft, before its own lift: liftPageFile receives it as the page lift's context.
  const rawSite = drafts?.site ?? JSON.parse(siteText);
  const site = liftSiteFile(rawSite);
  // The engine tolerates a truncated site.json: missing parts get empty defaults instead of a crash (the page never dies from bad data).
  site.site ??= { title: '', lang: 'no' };
  site.pages ??= [];
  site.theme ??= { version: 1, tokens: {} };
  site.nav ??= { version: 1, items: [] };
  // The visitor language (ADR-0012): site.lang sets the engine's own texts and date names and the document's lang attribute, ahead of the first render.
  document.documentElement.lang = await initSiteLocale(site.site.lang);
  applyTheme(site.theme);
  applySiteLayout(site);
  applyFavicon(site.site.icon);
  // An empty page register (hand-edited site.json) gives an empty page, not a crash.
  const entry = resolvePage(site, preview) ?? { id: 'empty', title: '', file: 'content/pages/missing.json' };
  // The preview and the draft view take the page's draft where one is kept; the preview then receives its pages by message.
  const draftPage = drafts?.page(entry.id) ?? null;
  // A visitor takes a page file parked by the previous page's prefetch (prefetch.js) as it is, rechecked against the server after the first render.
  const parked = preview || drafts ? null : readPrefetched(entry.file, sessionStore());
  // Otherwise the page file's fetch starts here, as it depends only on the register, and runs alongside the plugin loading.
  const pagePromise = draftPage
    ? Promise.resolve({ page: draftPage, text: null, etag: null })
    : parked
    ? Promise.resolve(parked)
    : fetch(`/${entry.file}`).then(async (res) => {
        const text = await res.text();
        return { page: JSON.parse(text), text, etag: res.headers.get('etag') };
      });
  // The rejection is consumed here; the failure is handled where the page file is lifted (pageLifted).
  pagePromise.catch(() => {});
  const engine = await enginePromise;
  // The plugins: in the preview the urd-plugins message loads them; for a visitor they load beside the page, awaited only for a type no core module defines.
  const pluginsLoaded = preview ? Promise.resolve() : loadPlugins(Urd, engine).catch(() => {});

  // A visitor's viewport follows the mobile breakpoint, the preview's starts on desktop for the editor to set; both body classes are set ahead of the menu.
  const mq = window.matchMedia(`(max-width: ${site.breakpoints?.mobile ?? 640}px)`);
  const viewport = preview ? 'desktop' : (mq.matches ? 'mobile' : 'desktop');
  document.body.classList.toggle('urd-mobile', viewport === 'mobile');
  if (preview) document.body.classList.add('urd-preview');

  // The page file is lifted to the current format in memory as it arrives; a page file that cannot be loaded gives an empty page, never a crash.
  const pageLifted = pagePromise.then((loaded) => {
    const lifted = liftPageFile(loaded.page, rawSite);
    served.page = { text: loaded.text, etag: loaded.etag };
    return lifted;
  }).catch(() => {
    console.warn(`Urd: could not load page file '${entry.file}' - rendering an empty page`);
    return { schemaVersion: PAGE_SCHEMA_VERSION, meta: { id: entry.id, title: entry.title }, sections: [] };
  });
  // The site's features (features.js) are asked for beside the page file; a visitor's footer is awaited only as the footer joins the page.
  const siteHeld = siteFeatures(site, entry.id);
  const siteLoaded = loadFeatures(Urd, [...siteHeld].filter((name) => name !== 'footer'));
  const footerLoaded = loadFeatures(Urd, siteHeld.has('footer') ? ['footer'] : []);
  // The menu's, footer's and page's types are asked for as soon as each is known, the preview's as a visitor's; the rest come once it is ready (enablePreview).
  loadCoreTypes(Urd, pageTypes(site.footer));
  const presets = preview ? import('./sections/presets.js').then(({ registerSectionPresets }) => registerSectionPresets(Urd)) : null;
  const navTypes = loadCoreTypes(Urd, pageTypes(site.nav));
  // With the page file read, its types, its blocks' readying and the first section's pictures are asked for together, so menu, page and background draw as one.
  const pageReady = pageLifted.then((lifted) => {
    if (!Array.isArray(lifted.sections)) lifted.sections = [];
    const readied = prepareBlocks(pageBlocks(lifted, site.footer), { site, preview, viewport });
    const pictures = preview ? null : askLayerPictures(lifted.sections[0]?.background);
    const features = loadFeatures(Urd, [...pageFeatures(lifted, site), ...(preview || drafts ? ['collections'] : [])]);
    const previewParts = preview ? Promise.all([footerLoaded, presets]) : null;
    return Promise.all([loadCoreTypes(Urd, pageTypes(lifted, site.footer)), readied, pictures, siteLoaded, features, previewParts]).then(() => lifted);
  });
  await navTypes;
  if (!preview && needsPlugins(pageTypes(site.nav), Urd)) await pluginsLoaded;
  // The shared footer is created here as an element of its own, and joins the document after the main content once the page is drawn (below).
  opts.footer = document.createElement('footer');
  opts.footer.id = 'urd-footer';

  const page = await pageReady;
  if (!preview && needsPlugins(pageTypes(page, site.footer), Urd)) await pluginsLoaded;
  if (drafts) feature('collections')?.setCollectionsDraft(drafts.collections);
  document.title = pageTitle(site, page, entry);
  // SEO metadata (description, canonical, og: fields, JSON-LD) is set only outside the preview, and the analytics mounted only where no drafts were read.
  if (!preview) {
    applyHeadMeta(site, page, location.origin, location.pathname, entry, feature('contact'));
    if (!drafts) mountAnalytics(site);
  }
  // The footer is drawn with the page id (per-page hideOn): in the preview at once, for a visitor as it joins the document.
  const drawFooter = () => {
    const footer = feature('footer');
    if (footer) footer.renderFooter(site, opts.footer, page.meta?.id ?? entry.id);
    else opts.footer.style.display = 'none';
  };
  if (preview) drawFooter();

  let queue = null;
  if (preview) {
    [window.UrdPreviewEdit, queue] = await editing;
    refreshShopGate(site);
  }

  const state = { page, site, engine, viewport };

  // The menu, given the page id for nav.hideOn, «Back to top» (totop.js) and the page are drawn in one task, so they stand in the same frame.
  if (opts.nav) renderNav(site, opts.nav, entry.id);
  feature('totop')?.renderToTop(site, document.body, feature('shape'));
  renderPage(state.page, state.site, opts.root, { preview, viewport: state.viewport, arriving: true });
  // A visitor's footer joins once no block on the page is busy fetching its content, or after FOOTER_WAIT_MS (whenSettled); the preview's joins at once.
  if (preview) opts.root.insertAdjacentElement('afterend', opts.footer);
  else {
    footerLoaded.then(() => {
      const footer = feature('footer');
      return footer?.whenSettled(opts.root, footer.FOOTER_WAIT_MS);
    }).then(() => {
      opts.root.insertAdjacentElement('afterend', opts.footer);
      drawFooter();
    });
  }
  // The page stands: a held page transition ends here as a cut.
  endArrivalHold();
  // Sticky blocks ("pin on scroll"): one scroll listener for the whole page.
  feature('sticky')?.initSticky();
  wireJumps();
  if (!preview) arriveAtSpot();
  if (!preview && drafts && (drafts.site || draftPage || Object.keys(drafts.collections).length)) markDraftView();

  if (!preview) {
    mq.addEventListener('change', (event) => {
      state.viewport = event.matches ? 'mobile' : 'desktop';
      document.body.classList.toggle('urd-mobile', state.viewport === 'mobile');
      renderPage(state.page, state.site, opts.root, { preview, viewport: state.viewport });
      feature('sticky')?.refreshSticky();
    });
    // Intent prefetch of the next page (hover, press, focus on internal links).
    wirePrefetch(site);

    // A newer page file is drawn in place, keeping the scroll position and pinning the sticky blocks again.
    const applyFreshPage = async (fresh) => {
      served.page = { text: fresh.text, etag: fresh.etag };
      const freshPage = liftPageFile(fresh.page, rawSite);
      if (!Array.isArray(freshPage.sections)) freshPage.sections = [];
      // A newer page waits for its types' modules, and for the plugins where it needs them, as the first drawing does; until then a redraw draws the page shown.
      const freshReadied = prepareBlocks(pageBlocks(freshPage, site.footer), { site, preview, viewport: state.viewport });
      await Promise.all([loadCoreTypes(Urd, pageTypes(freshPage, site.footer)), loadFeatures(Urd, pageFeatures(freshPage, site))]);
      if (needsPlugins(pageTypes(freshPage, site.footer), Urd)) await pluginsLoaded;
      await freshReadied;
      state.page = freshPage;
      document.title = pageTitle(site, state.page, entry);
      applyHeadMeta(site, state.page, location.origin, location.pathname, entry, feature('contact'));
      const y = window.scrollY;
      renderPage(state.page, state.site, opts.root, { preview, viewport: state.viewport });
      requestAnimationFrame(() => requestAnimationFrame(() => {
        window.scrollTo(0, y);
        feature('sticky')?.initSticky();
        feature('sticky')?.refreshSticky();
      }));
    };
    // Rechecks a parked, prerendered or restored page against the server, one check at a time: a changed site.json reloads, a changed page file redraws.
    let checking = null;
    let queuedSite = false;
    const recheck = ({ site: checkSite }) => {
      // A site check arriving mid-flight runs after the current one, so the stronger request is never dropped.
      if (checking) { queuedSite ||= checkSite; return checking; }
      checking = (async () => {
        if (checkSite) {
          const freshSite = await revalidateFile('content/site.json', served.site.etag, { text: served.site.text });
          if (freshSite) { location.reload(); return; }
        }
        const fresh = await revalidateFile(entry.file, served.page?.etag ?? null, { text: served.page?.text ?? null });
        if (fresh) await applyFreshPage(fresh);
      })().catch(() => {}).finally(() => {
        checking = null;
        if (queuedSite) { queuedSite = false; recheck({ site: true }); }
      });
      return checking;
    };
    // A parked page checks now, a prerendered one at activation and a restored one as it is shown; the draft view reloads on a return from the back-forward cache.
    if (drafts) {
      window.addEventListener('pageshow', (event) => {
        if (event.persisted) location.reload();
      });
    } else {
      if (parked && !document.prerendering) recheck({ site: false });
      if (document.prerendering) {
        document.addEventListener('prerenderingchange', () => recheck({ site: true }), { once: true });
      }
      window.addEventListener('pageshow', (event) => {
        if (event.persisted) recheck({ site: true });
      });
    }
  }

  if (preview) enablePreview(state, opts, queue);
}
