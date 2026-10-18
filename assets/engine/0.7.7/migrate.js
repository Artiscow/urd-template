/**
 * Stepwise version lifting - Urd's core invariant (see docs/adr/0005).
 *
 * All data (blocks, background layers, animations, sections) carries
 * `version`, and every type definition states `version` + `migrations`
 * where migrations[n] lifts exactly v(n) → v(n+1) as a pure function
 * (props in, props out).
 *
 * Lifting happens in memory at load time - the files on disk are written
 * only at the next publish. On an unknown type or a missing migration,
 * data is NEVER dropped: the entry is marked as a placeholder and the
 * original is kept.
 */

/**
 * Lifts one data entry to the definition's current version.
 *
 * @param {{type?: string, version: number, props: object}} data
 *   Entry from a content file (not mutated).
 * @param {{version: number, migrations?: Record<number, (props: object) => object>}|undefined} def
 *   Type definition from the registry, or undefined if the type is unknown.
 * @returns {{ok: boolean, version: number, props: object, placeholder?: string}}
 *   ok=true with lifted props, or ok=false with a `placeholder` reason and
 *   the original props untouched ('unknown-type' | 'missing-migration' | 'newer-than-engine').
 */
export function lift(data, def) {
  if (!def) {
    return { ok: false, version: data.version, props: data.props, placeholder: 'unknown-type' };
  }
  // A missing/invalid version (hand-edited or truncated data) is treated
  // as v1, never as current: without this the while loop skips all the
  // migrations (undefined < n is false) and the old format is read as new.
  const from = Number.isInteger(data.version) ? data.version : 1;
  if (from > def.version) {
    // The content was written by a newer engine - rendered as a
    // placeholder, never misread or downgraded.
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

import { liftFooterSocial } from './links-model.js';
import { fitMoves, SIZE, SIZE_BY_FRAME } from './push-model.js';

/** Current version of the page file format (content/pages/*.json). */
export const PAGE_SCHEMA_VERSION = 7;

/**
 * The row height of the mobile row grid (ADR-0019), in px. A model
 * constant on par with the breakpoint: never tied to grid.size, which is a
 * snapping tool for desktop.
 */
export const MOBILE_ROW = 8;

/** Vertical spacing between flow blocks in the mobile row grid, in px. */
export const MOBILE_GAP = 16;

/** Current version of the site.json format. */
export const SITE_SCHEMA_VERSION = 5;

/**
 * File-level migrations. Each function lifts exactly one version and
 * receives the whole page file (cloned) + site.json as context.
 */

/** The flow's top padding in the old mobile format: materialization
 *  measured y from the top of the surface, that is including the padding,
 *  so it is subtracted before the row index is computed. */
const V1_FLOW_PAD = 24;

/** attention.reason tokens were Norwegian in v1; data contracts use
 *  English identifiers. */
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
 * Lifts a block's frames.mobile from the v1 shape (a full frame
 * {x, y, w, h}) to the row-grid placement (ADR-0019). A placement already
 * in the new shape (without y/h) is returned untouched, and a byte-equal
 * copy of the desktop frame yields null: that was materialization's
 * fallback for blocks outside the flow, never a hand-placed position.
 * Used by the page migration AND by template insertion
 * (templates-model.js), which inserts stored payloads outside the page lift.
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
 * Core block types were Norwegian before v3; data contracts use English
 * identifiers (ADR-0021). Plugin-owned types (kalender, kart, skjema) are
 * deliberately absent: old plugin folders in user repos keep defining the
 * old ids forever, so those are resolved through registry aliases instead.
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
 * Core section preset ids renamed in v4 (ADR-0021). Plugin preset ids
 * (hva-skjer, finn-oss, kontaktskjema) are deliberately absent; they resolve
 * through registry aliases like the plugin block types.
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
 * Renames contract tokens (block types, background layer types and section
 * theme roles) in place. Accepts a section-like object ({blocks, background,
 * theme}) or a bare block array. Used by pageMigrations[2] and by template
 * insertion (templates-model), which inserts stored payloads outside the
 * page lift.
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
 * The gap and the «Larger map» line under a map's iframe before v5, in px: the
 * 6 px gap of `.urd-map` and a line of text at 0.82 em (base.css).
 */
const MAP_LINK_PX = 26;

/**
 * A block's stored size as the steps up to page v7 read it: inside SIZE,
 * else 1, and always 1 for the frame-sized types. The steps keep their
 * own reading, apart from blockSize, so they lift data the same way
 * whatever the bounds a block's text gives its size today.
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
 * The calendar's own size (`props.scale`, 0.7.20.1 to 0.7.21.4) becomes the
 * block-level `size` every block type takes (ADR-0025 decision 6), inside
 * its bounds; a size of 1 leaves no field.
 * Used by the page migration AND by template insertion (templates-model.js),
 * which inserts stored payloads outside the page lift.
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
 * Lifts the map blocks of one section from the height setting the map had
 * before page v5 (`props.height`, the iframe's own height) to the frame
 * (ADR-0025 decision 2: the map's box decides, and the iframe fills it). The
 * frame takes the height the map showed, the iframe with the line under it or
 * the frame when that was taller, and the blocks below follow as for a fit
 * (fitMoves), so nothing moves on screen. The legacy id `kart` resolves to
 * the map block and is lifted the same way.
 * Used by the page migration AND by template insertion (templates-model.js),
 * which inserts stored payloads outside the page lift.
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
 * Lifts the gallery blocks of one section from the band height the ribbon
 * view had before page v7 (`props.bandHeight`, 80-400 px a row, 160 when
 * absent) to the frame (ADR-0025 decision 2: the gallery's box decides, and
 * the band fills it). The frame takes the height the band showed, its rows
 * and the gap between them at the block's size: a shorter frame grows to it
 * and the blocks below follow as for a fit (fitMoves), and a taller one
 * shrinks to it and moves nothing, so the band keeps its look. Every view
 * drops the field.
 * Used by the page migration AND by template insertion (templates-model.js),
 * which inserts stored payloads outside the page lift. A payload of unknown
 * age is lifted only where it carries the field; `old` lifts every ribbon
 * gallery, for data known to be from before page v7.
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

const pageMigrations = {
  // 1 -> 2 (synced mobile model, ADR-0019): frames.mobile changes shape
  // from a full frame {x,y,w,h} to a partial row-grid placement
  // {x,w,row,rows}, the section mode 'manual' is retired, and decor blocks
  // get the new hideMobile field that takes over mobile hiding. Pre-v1 the
  // visual change (row quantization ±8 px) is accepted (ADR-0005).
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
  // 2 -> 3 (ADR-0021): core block and background layer types renamed from
  // Norwegian to English contract identifiers.
  2: (page) => {
    for (const section of page.sections ?? []) liftContractTokens(section);
    return page;
  },
  // 3 -> 4 (ADR-0021): core section preset ids renamed. liftContractTokens
  // covers presets too, so a v2 page gets them in the first step and this
  // step is its no-op second pass; pages written at exactly v3 need it.
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
};

const siteMigrations = {
  // 1 -> 2 (bound content width, ADR-0018): the content is bound by a
  // design width instead of following the window width. The default is
  // written in explicitly instead of being derived at read time, so the
  // engine and the editor can never arrive at different values. Pre-v1 the
  // visual change is accepted (ADR-0005).
  1: (site) => ({ ...site, layout: site.layout ?? { contentWidth: 1440, gutter: 6 } }),
  // 2 -> 3: the page gutter changed from pixels to a PERCENTAGE OF THE
  // WINDOW WIDTH. The old value cannot be converted meaningfully (24 px is
  // not a fixed share of anything), so all are set to the default. Pre-v1
  // the small visual change is accepted (ADR-0005).
  2: (site) => ({ ...site, layout: { ...(site.layout ?? { contentWidth: 1440 }), gutter: 6 } }),
  // 3 -> 4: nav.style.inset (the bar's contents line up with the content
  // edge) became the default. As with the bound content width the old
  // default is written in explicitly, so a site built before the change
  // keeps the menu it was built with. Sites that set the field keep it.
  3: (site) => (site.nav && site.nav.style?.inset === undefined
    ? { ...site, nav: { ...site.nav, style: { ...(site.nav.style ?? {}), inset: false } } }
    : site),
  // 4 -> 5: the footer's social links became the site's links (site.links),
  // drawn by the footer, the menu's tools and the share block.
  4: (site) => liftFooterSocial(site),
};

/**
 * Lifts site.json to the current schemaVersion. Same rules as
 * liftPageFile: stepwise, never destructive, the original is never mutated.
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
 * Lifts a page file to the current schemaVersion. Stepwise and never
 * destructive: if a migration step is missing (or the file is NEWER than
 * the engine), it is returned untouched instead of being misread.
 *
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
