/**
 * Stepwise version lifting (ADR-0005): entries, page files and site.json are lifted in memory, and an unknown type or a missing step never drops data.
 * Notes: docs/engine-notes/migrate.md (Urd repository).
 */

/**
 * Lifts one data entry to the definition's current version.
 *
 * @param {{type?: string, version: number, props: object}} data
 *   Entry from a content file (not mutated).
 * @param {{version: number, migrations?: Record<number, (props: object) => object>}|undefined} def
 *   Type definition from the registry, or undefined if the type is unknown.
 * @returns {{ok: boolean, version: number, props: object, placeholder?: string}}
 *   ok with the lifted props, or not ok with a `placeholder` reason ('unknown-type', 'missing-migration', 'newer-than-engine') and the props untouched.
 */
export function lift(data, def) {
  if (!def) {
    return { ok: false, version: data.version, props: data.props, placeholder: 'unknown-type' };
  }
  // A missing or non-integer version (hand-edited or truncated data) counts as v1, never as current, so the old format goes through every migration.
  const from = Number.isInteger(data.version) ? data.version : 1;
  if (from > def.version) {
    // The content was written by a newer engine - rendered as a placeholder, never misread or downgraded.
    return { ok: false, version: from, props: data.props, placeholder: 'newer-than-engine' };
  }

  let version = from;
  let props = data.props;
  while (version < def.version) {
    const step = def.migrations && def.migrations[version];
    if (typeof step !== 'function') {
      return { ok: false, version: from, props: data.props, placeholder: 'missing-migration' };
    }
    props = step(structuredClone(props));
    version++;
  }
  return { ok: true, version, props };
}

/**
 * Lifts a block's phone words (ADR-0033): its props with them written in are lifted, and the word props that then differ from its lifted props are the phone's.
 * @param {{type?: string, version: number, props: object, phoneProps?: object}} block
 * @param {object|undefined} def The block's type definition
 * @param {object} liftedProps The block's own props, lifted (lift)
 * @returns {Record<string, string>} The phone's words, lifted; empty where it has none
 */
export function liftPhoneWords(block, def, liftedProps) {
  const words = phoneWordsOf(block?.type, block?.phoneProps);
  if (!Object.keys(words).length) return {};
  const lifted = lift({ ...block, props: { ...(block.props ?? {}), ...words } }, def);
  if (!lifted.ok) return {};
  const own = {};
  for (const key of PHONE_WORDS[block.type] ?? []) {
    if (typeof lifted.props[key] === 'string' && lifted.props[key] !== liftedProps?.[key]) own[key] = lifted.props[key];
  }
  return own;
}

import { liftFooterSocial } from './links-model.js';
import { fitMoves, SIZE, SIZE_BY_FRAME, PHONE_WORDS, phoneWordsOf } from './push-model.js';
import { TERMS_DESIGNS } from './doc-designs.js';

/** Current version of the page file format (content/pages/*.json). */
export const PAGE_SCHEMA_VERSION = 8;

/**
 * The row height of the mobile row grid (ADR-0019), in px: a model constant like the breakpoint, never tied to grid.size, the desktop's snapping tool.
 */
export const MOBILE_ROW = 8;

/** The cell columns of the phone's row grid (ADR-0019): eight between the row's outer edges, where a block across the full row stands (base.css .urd-flow). */
export const PHONE_COLUMNS = 8;

/**
 * A phone placement's cells, where it holds them: its first column and how many it spans, inside the eight; null for a block across the full row.
 * @param {{col?: number, cols?: number}|null} placement
 * @returns {{col: number, cols: number}|null}
 */
export function phoneCells(placement) {
  const col = placement?.col;
  const cols = placement?.cols;
  if (!Number.isInteger(col) || !Number.isInteger(cols) || col < 1 || cols < 1 || col + cols - 1 > PHONE_COLUMNS) return null;
  return cols === PHONE_COLUMNS ? null : { col, cols };
}

/**
 * A flowing block's own height on the phone (`height`, ADR-0019), in px; null where it has none above 0, and for a block pinned to rows.
 * @param {{height?: number, row?: number}|null} placement
 * @returns {number|null}
 */
export function phoneHeight(placement) {
  const height = placement?.height;
  if (Number.isFinite(placement?.row) || !Number.isFinite(height) || height <= 0) return null;
  return height;
}

/**
 * A flowing block's own room above it on the phone (`space`), in px, added to the space between blocks; 0 where it has none, and for a block pinned to rows.
 * @param {{space?: number, row?: number}|null} placement
 * @returns {number}
 */
export function phoneSpace(placement) {
  const space = placement?.space;
  if (Number.isFinite(placement?.row) || !Number.isFinite(space)) return 0;
  return Math.round(space);
}

/** Vertical spacing between flow blocks in the mobile row grid, in px: the standard, which the site's `layout.mobileGap` and a section's `size.mobileGap` replace. */
export const MOBILE_GAP = 16;

/** The largest spacing between flow blocks in the mobile row grid that a site or a section can set, in px. */
export const MOBILE_GAP_MAX = 96;

/**
 * The phone's space between a section's flowing blocks in px: `size.mobileGap`, else the site's `layout.mobileGap`, else MOBILE_GAP, within 0 to MOBILE_GAP_MAX.
 * @param {{size?: {mobileGap?: number}}|undefined} section
 * @param {{layout?: {mobileGap?: number}}|undefined} site
 * @returns {number}
 */
export function mobileGapOf(section, site) {
  const own = section?.size?.mobileGap;
  const shared = site?.layout?.mobileGap;
  const gap = Number.isFinite(own) ? own : Number.isFinite(shared) ? shared : MOBILE_GAP;
  return Math.max(0, Math.min(MOBILE_GAP_MAX, Math.round(gap)));
}

/** The standard room on the phone above a section's first block and below its last, in px; `size.mobilePadTop` and `size.mobilePadBottom` replace it. */
export const MOBILE_ROOM = 24;

/** How far the room's slider in the section's phone settings reaches, in px; a seam drags the room past it, and the slider then reaches as far as the room. */
export const MOBILE_ROOM_REACH = 240;

/**
 * The phone's room above a section's first block and below its last, in px: `size.mobilePadTop` and `size.mobilePadBottom`, else MOBILE_ROOM, never under 0.
 * @param {{size?: {mobilePadTop?: number, mobilePadBottom?: number}}|undefined} section
 * @returns {{top: number, bottom: number}}
 */
export function phoneRoomOf(section) {
  const of = (value) => (Number.isFinite(value) ? Math.max(0, Math.round(value)) : MOBILE_ROOM);
  return { top: of(section?.size?.mobilePadTop), bottom: of(section?.size?.mobilePadBottom) };
}

/** Current version of the site.json format. */
export const SITE_SCHEMA_VERSION = 6;

/**
 * The flow's top padding in the v1 mobile format, where y counted from the surface's top, padding included; it is subtracted before the row index is computed.
 */
const V1_FLOW_PAD = 24;

/**
 * attention.reason tokens were Norwegian in v1; data contracts use English identifiers.
 */
const V1_REASONS = {
  'oppsett-byttet': 'layout-changed',
  'blokk-endret': 'block-edited',
  'desktop-endret-etter-mobil': 'desktop-changed-after-mobile',
  'seksjonshøyde': 'section-height',
  'blokk-flyttet': 'block-moved',
  'blokk-slettet': 'block-deleted',
  'blokk-lagt-til': 'block-added',
};

/**
 * Lifts frames.mobile from the v1 frame {x, y, w, h} to a row-grid placement (ADR-0019); one without y and h is kept, one equal to the desktop frame gives null.
 */
export function liftMobileFrame(m, desktop) {
  if (!m || !('y' in m || 'h' in m)) return m ?? null;
  if (desktop && m.x === desktop.x && m.y === desktop.y && m.w === desktop.w && m.h === desktop.h) {
    return null;
  }
  const placement = { x: m.x, w: m.w };
  if (Number.isFinite(m.y)) {
    placement.row = Math.max(1, Math.round((m.y - V1_FLOW_PAD) / MOBILE_ROW) + 1);
    placement.rows = Number.isFinite(m.h) ? Math.max(1, Math.ceil(m.h / MOBILE_ROW)) : 1;
  }
  if (Number.isFinite(m.z) && m.z !== 1) placement.z = m.z;
  if (m.rot) placement.rot = m.rot;
  return placement;
}

/**
 * Core block types renamed from Norwegian in page v3 (ADR-0021); the old plugin ids kalender, kart and skjema resolve through registry aliases instead.
 */
export const V2_BLOCK_TYPES = {
  samling: 'collection',
  galleri: 'gallery',
  tidslinje: 'timeline',
  sitat: 'quote',
  statistikk: 'stats',
  tabell: 'table',
  deling: 'share',
  nedteller: 'countdown',
  produkt: 'product',
  handlekurv: 'cart',
  kasse: 'checkout',
};

/** Background layer types renamed in v3 (ADR-0021). */
export const V2_LAYER_TYPES = {
  bildegalleri: 'slideshow',
};

/** Section theme roles renamed in v3 (ADR-0021); see SECTION_THEMES in theme.js. */
export const V2_SECTION_THEMES = {
  flate: 'surface',
  aksent: 'accent',
  invers: 'inverse',
  dus: 'soft',
  dempet: 'muted',
  dyp: 'deep',
  uthevet: 'highlighted',
};

/**
 * Core section preset ids renamed in page v4 (ADR-0021); the old plugin presets hva-skjer, finn-oss and kontaktskjema resolve through registry aliases instead.
 */
export const V3_PRESET_IDS = {
  tom: 'blank',
  'hero-sentrert': 'hero-centered',
  bilder: 'images',
  galleri: 'gallery',
  kontakt: 'contact',
  funksjonskort: 'feature-cards',
  'funksjonskort-enkel': 'feature-cards-simple',
  nyheter: 'news',
  'nyheter-samling': 'news-collection',
  oppslagstavle: 'noticeboard',
  publikasjonsarkiv: 'publication-archive',
  arrangementer: 'events',
  tidslinje: 'timeline',
  steg: 'steps',
  hovedoppslag: 'lead-story',
  produkter: 'products',
  butikk: 'shop',
  'butikk-hero': 'shop-hero',
  'butikk-kategorier': 'shop-categories',
  'butikk-tillit': 'shop-trust',
  'butikk-utstilling': 'shop-showcase',
  kasse: 'checkout',
  sitat: 'quote',
  statistikk: 'stats',
  sponsorer: 'sponsors',
  medlemskap: 'membership',
};

/**
 * Renames contract tokens in place, in a section or a bare block array: block types, and a section's background layer types, theme role and preset id.
 */
export function liftContractTokens(target) {
  const blocks = Array.isArray(target) ? target : target.blocks ?? [];
  for (const block of blocks) {
    if (V2_BLOCK_TYPES[block.type]) block.type = V2_BLOCK_TYPES[block.type];
  }
  if (!Array.isArray(target)) {
    for (const layer of target.background?.layers ?? []) {
      if (V2_LAYER_TYPES[layer.type]) layer.type = V2_LAYER_TYPES[layer.type];
    }
    if (V2_SECTION_THEMES[target.theme]) target.theme = V2_SECTION_THEMES[target.theme];
    if (V3_PRESET_IDS[target.preset]) target.preset = V3_PRESET_IDS[target.preset];
  }
  return target;
}

/**
 * A text block in a document design becomes the terms block (page v8); a phone design stays only as a terms design on a terms block.
 * @param {{blocks?: object[]}|object[]} target
 */
export function liftTermsBlocks(target) {
  const blocks = Array.isArray(target) ? target : target.blocks ?? [];
  for (const block of blocks) {
    if (block.type !== 'text' || !block.props) continue;
    if (TERMS_DESIGNS.includes(block.props.design)) block.type = 'terms';
    const phone = block.props.phoneDesign;
    if (phone !== undefined && !(block.type === 'terms' && TERMS_DESIGNS.includes(phone))) delete block.props.phoneDesign;
  }
  return target;
}

/**
 * The gap and the «Larger map» line under a map's iframe before v5, in px: the 6 px gap of `.urd-map` and a line of text at 0.82 em (blocks/map.css).
 */
const MAP_LINK_PX = 26;

/**
 * The stored size the steps up to page v7 read, apart from blockSize: inside SIZE, 1 where not a number above 0, always 1 for the frame-sized types.
 * @param {{type?: string, size?: number}} block
 * @returns {number}
 */
function storedSize(block) {
  if (!block || SIZE_BY_FRAME.has(block.type)) return 1;
  const size = Number(block.size);
  if (!Number.isFinite(size) || size <= 0) return 1;
  return Math.round(Math.min(SIZE.max, Math.max(SIZE.min, size)) * 100) / 100;
}

/**
 * The calendar's own size (`props.scale`) becomes the block-level `size` (ADR-0025 decision 6), inside its bounds; a size of 1 leaves no field.
 * @param {{blocks?: Array<object>}} section The section (mutated)
 */
export function liftCalendarScale(section) {
  for (const block of section?.blocks ?? []) {
    if (block.type !== 'calendar' || !block.props || !('scale' in block.props)) continue;
    const size = storedSize({ type: 'calendar', size: block.props.scale });
    delete block.props.scale;
    if (size !== 1) block.size = size;
  }
}

/**
 * A section's map blocks (`kart` too) drop `props.height`, the desktop frame growing to that iframe height and the line under it; blocks below follow (fitMoves).
 * @param {{blocks?: Array<object>}} section The section (mutated)
 */
export function liftMapHeights(section) {
  for (const block of section?.blocks ?? []) {
    if ((block.type !== 'map' && block.type !== 'kart') || !Number.isFinite(block.props?.height)) continue;
    const frame = block.frames?.desktop;
    if (frame && Number.isFinite(frame.h)) {
      const shown = Math.max(frame.h, Math.round(block.props.height + MAP_LINK_PX));
      const moves = fitMoves(section.blocks, block.id, shown);
      frame.h = shown;
      for (const other of section.blocks) {
        const y = moves.get(other.id);
        if (Number.isFinite(y) && other.frames?.desktop) other.frames.desktop.y = y;
      }
    }
    delete block.props.height;
  }
}

/**
 * A section's galleries drop `props.bandHeight`, and a ribbon gallery's frame takes the height its band showed; `old` lifts ribbons without the field too.
 * @param {{blocks?: Array<object>}} section The section (mutated)
 * @param {boolean} [old] The data is from before page v7
 */
export function liftGalleryBands(section, old = false) {
  for (const block of section?.blocks ?? []) {
    if (block.type !== 'gallery' || !block.props) continue;
    const frame = block.frames?.desktop;
    if ((old || 'bandHeight' in block.props) && block.props.view === 'ribbon' && frame && Number.isFinite(frame.h)) {
      const band = Math.min(400, Math.max(80, Number(block.props.bandHeight) || 160));
      const rows = Number(block.props.rows) === 2 ? 2 : 1;
      const gap = Number(block.props.gap) || 0;
      const shown = Math.round((rows * band + (rows - 1) * gap) * storedSize(block));
      const moves = fitMoves(section.blocks, block.id, shown);
      frame.h = shown;
      for (const other of section.blocks) {
        const y = moves.get(other.id);
        if (Number.isFinite(y) && other.frames?.desktop) other.frames.desktop.y = y;
      }
    }
    delete block.props.bandHeight;
  }
}

/**
 * File-level migrations. Each function lifts exactly one version and receives the whole page file (cloned) + site.json as context.
 */
const pageMigrations = {
  // 1 -> 2 (ADR-0019): frames.mobile becomes a row-grid placement, 'manual' mode becomes 'auto', decor blocks get hideMobile, attention reasons get English ids.
  1: (page) => {
    for (const section of page.sections ?? []) {
      const mobile = section.responsive?.mobile;
      for (const block of section.blocks ?? []) {
        if (block.decor) block.hideMobile = true;
        if (block.frames?.mobile) {
          block.frames.mobile = liftMobileFrame(block.frames.mobile, block.frames.desktop);
        }
      }
      if (mobile?.mode === 'manual') mobile.mode = 'auto';
      const reason = mobile?.attention?.reason;
      if (reason && V1_REASONS[reason]) mobile.attention.reason = V1_REASONS[reason];
    }
    return page;
  },
  // 2 -> 3 (ADR-0021): core block and background layer types renamed from Norwegian to English contract identifiers.
  2: (page) => {
    for (const section of page.sections ?? []) liftContractTokens(section);
    return page;
  },
  // 3 -> 4 (ADR-0021): core section preset ids renamed; a v2 page gets them in the step before, so this pass is for pages written at v3.
  3: (page) => {
    for (const section of page.sections ?? []) liftContractTokens(section);
    return page;
  },
  // 4 -> 5 (ADR-0025): the map's height setting moves into the frame.
  4: (page) => {
    for (const section of page.sections ?? []) liftMapHeights(section);
    return page;
  },
  // 5 -> 6 (ADR-0025 decision 6): the calendar's own size becomes the block's.
  5: (page) => {
    for (const section of page.sections ?? []) liftCalendarScale(section);
    return page;
  },
  // 6 -> 7 (ADR-0025 decision 2): the gallery band's height moves into the frame.
  6: (page) => {
    for (const section of page.sections ?? []) liftGalleryBands(section, true);
    return page;
  },
  // 7 -> 8: a text block in a document design becomes the terms block.
  7: (page) => {
    for (const section of page.sections ?? []) liftTermsBlocks(section);
    return page;
  },
};

const siteMigrations = {
  // 1 -> 2 (bound content width, ADR-0018): a site without `layout` gets the default written in, so the engine and the editor never derive different values.
  1: (site) => ({ ...site, layout: site.layout ?? { contentWidth: 1440, gutter: 6 } }),
  // 2 -> 3: the page gutter goes from px to a percentage of the window width; a px value does not convert, so every site gets the default.
  2: (site) => ({ ...site, layout: { ...(site.layout ?? { contentWidth: 1440 }), gutter: 6 } }),
  // 3 -> 4: `nav.style.inset` is the default from v4, so a nav without the field gets the old default written in and keeps the menu it was built with.
  3: (site) => (site.nav && site.nav.style?.inset === undefined
    ? { ...site, nav: { ...site.nav, style: { ...(site.nav.style ?? {}), inset: false } } }
    : site),
  // 4 -> 5: the footer's social links became the site's links (site.links), drawn by the footer, the menu's tools and the share block.
  4: (site) => liftFooterSocial(site),
  // 5 -> 6: the announcement strip gets its own `hideOn`; where the menu is hidden outright, the menu's `hideOn` pages join the strip's (liftAnnouncementHideOn).
  5: (site) => liftAnnouncementHideOn(site),
};

/** The site migration 5 -> 6: unless the menu is reached from the edge (hideMode hover, ghost or tab), its `hideOn` pages join the announcement strip's own. */
export function liftAnnouncementHideOn(site) {
  const hide = Array.isArray(site?.nav?.hideOn) ? site.nav.hideOn : [];
  const announcement = site?.nav?.announcement;
  if (!hide.length || !announcement || typeof announcement !== 'object') return site;
  if (['hover', 'ghost', 'tab'].includes(site.nav.hideMode)) return site;
  const own = Array.isArray(announcement.hideOn) ? announcement.hideOn : [];
  return { ...site, nav: { ...site.nav, announcement: { ...announcement, hideOn: [...new Set([...own, ...hide])] } } };
}

/**
 * Lifts site.json to the current schemaVersion.
 * Same rules as liftPageFile: stepwise, never destructive, the original is never mutated.
 */
export function liftSiteFile(site) {
  let lifted = structuredClone(site);
  let version = lifted.schemaVersion ?? 1;
  while (version < SITE_SCHEMA_VERSION) {
    const step = siteMigrations[version];
    if (typeof step !== 'function') return site;
    lifted = step(lifted) ?? lifted;
    version++;
    lifted.schemaVersion = version;
  }
  return lifted;
}

/**
 * Lifts a page file to the current schemaVersion step by step; with a step missing, or a file newer than the engine, it comes back untouched.
 * @param {object} page Page file, already parsed
 * @param {object} site site.json (context for conversions)
 * @returns {object} Lifted copy (the original is never mutated)
 */
export function liftPageFile(page, site) {
  let lifted = structuredClone(page);
  let version = lifted.schemaVersion ?? 1;
  while (version < PAGE_SCHEMA_VERSION) {
    const step = pageMigrations[version];
    if (typeof step !== 'function') return page;
    lifted = step(lifted, site) ?? lifted;
    version++;
    lifted.schemaVersion = version;
  }
  return lifted;
}
