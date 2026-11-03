/**
 * The render loop: page → sections → background layers + blocks.
 *
 * All data is lifted via migrate.lift() before rendering. Unknown types and
 * render errors yield neutral placeholders (blocks) or are skipped
 * (background layers are decorative) - the page never crashes on bad data.
 *
 * Two viewports (opts.viewport):
 *  - 'desktop': absolute positioning from frames.desktop.
 *  - 'mobile': the row grid (ADR-0019), one path for all sections. Blocks
 *    without frames.mobile are auto-placed in reading order (stackOrder);
 *    blocks with row in frames.mobile are pinned to explicit row tracks.
 *    hideMobile blocks are omitted, text and auto-growing blocks get
 *    natural height, and the section height follows from the grid.
 */
import { lift, MOBILE_ROW, MOBILE_GAP } from './migrate.js';
import { pushLayout, clampFitMin, fitFloorPx, followsContent, followsWidth, heightAlign, FIT_BY_WIDTH, PUSH_SECTION_PAD, drawnScale, mobileLoadingHeight } from './push-model.js';
import { applyAnimation, applyCardAnimation } from './animations/core.js';
import { applySectionTheme, resolveColor } from './theme.js';
import { sectionDivider, dividerSvg } from './divider-model.js';
import { refreshSticky } from './sticky.js';
import { t } from './i18n.js';
import { isAnchorName } from './nav-model.js';

/**
 * Draws the background layers (color/gradient/glow/grain/image/slideshow)
 * into host as `div.urd-bg-layer` elements, bottom-up. Shared by sections
 * (render.js), nav (nav.js) and footer (footer.js) - the same layer model
 * everywhere. Each layer is lifted via lift() before render; unknown types
 * and render errors are skipped with a warning (backgrounds are decorative,
 * they never topple the page).
 * @param {HTMLElement} host The element the layers are built into
 * @param {{layers?: Array<{type: string, version?: number, props?: object}>}} [background]
 */
export function renderBackgroundLayers(host, background) {
  const Urd = window.Urd;
  for (const layer of background?.layers ?? []) {
    const el = document.createElement('div');
    el.className = 'urd-bg-layer';
    const lifted = lift(layer, Urd.backgrounds.get(layer.type));
    if (!lifted.ok) {
      console.warn(`Urd: skipping background layer '${layer.type}' (${lifted.placeholder})`);
      continue;
    }
    try {
      Urd.backgrounds.get(layer.type).render(el, lifted.props);
      host.appendChild(el);
    } catch (err) {
      console.warn(`Urd: background layer '${layer.type}' failed to render`, err);
    }
  }
}

/**
 * Translates a frame to CSS positioning.
 * Pure function (no DOM), tested in tests/render.test.mjs.
 *
 * Frames are in PHYSICAL units: x/w as a percentage of the
 * section width (flows with the screen), y/h in px. The grid is only a
 * snapping tool while editing and never affects placement.
 *
 * @param {{x: number, y: number, w: number, h: number, z?: number, rot?: number}} frame
 * @returns {{left: string, top: string, width: string, height: string, zIndex: string, transform: string}}
 */
/**
 * Writes the site's layout tokens on the root element (ADR-0018). The canvas
 * in every section reads them, so one write governs the whole page.
 *
 * Lives here rather than in its own module on purpose: new engine modules
 * are pulled into the static import closure, which the modulepreload test
 * forces into every HTML shell.
 *
 * @param {object} site site.json (lifted)
 * @param {HTMLElement} [root] The element the tokens are set on
 */
export function applySiteLayout(site, root = document.documentElement) {
  const width = site?.layout?.contentWidth ?? 1440;
  // The gutter is a PERCENTAGE OF THE VIEWPORT WIDTH (vw), not pixels: it only
  // acts in the band where the width does not bind yet, and there the
  // breathing room should follow the screen.
  const gutter = site?.layout?.gutter ?? 6;
  root.style.setProperty('--urd-canvas-w', width === 'full' ? '100%' : `${width}px`);
  root.style.setProperty('--urd-canvas-gutter-desktop', `${Number(gutter) || 0}vw`);
}

/**
 * Raises the section's min-height so content down to `bottom` px (in content
 * surface coordinates) fits. Used by auto-growing blocks. The section is
 * content-box with the nav clearance as padding (base.css), so both the
 * computed min-height and `bottom` are pure content heights, and the
 * inline value stays a plain length (the compatibility surface plugin
 * copies rely on, see SCHEMA.md).
 * @param {HTMLElement} sectionEl The section element
 * @param {number} bottom The content's bottom edge in px
 */
export function growSectionTo(sectionEl, bottom) {
  const current = Number.parseFloat(getComputedStyle(sectionEl).minHeight) || 0;
  if (bottom > current) sectionEl.style.minHeight = `${bottom}px`;
}

/**
 * Whether the browser answers container queries: a block that follows its own
 * width (followsWidth) then lays itself out by its box (ADR-0025 decision 7),
 * and without them by the window, as the page's phone view.
 */
export const WIDTH_QUERIES = typeof CSS !== 'undefined' && typeof CSS.supports === 'function' && CSS.supports('container-type', 'inline-size');

/* ---------- Content push on the desktop canvas (ADR-0024) ---------- */

/** Sections with a push pass, so a suspension can reset them all. */
const pushHosts = new Set();
let pushSuspended = 0;

/**
 * Measures every block against its frame and moves the blocks below a block
 * whose content grew (pure rules in push-model.js). The shifts live only on
 * the elements (style.top and data-urd-shift), never in the frames; the
 * section grows when the pushed content needs more than its design height,
 * and returns to it when the growth is gone. A pinned block keeps its stash
 * up to date instead of its inline top, so a release lands right.
 * @param {HTMLElement} host The section element
 */
function applyPush(host) {
  if (!host.isConnected) {
    pushHosts.delete(host);
    host._urdPushRo?.disconnect();
    return;
  }
  const section = host._urdPushSection;
  const canvas = host.querySelector(':scope > .urd-canvas');
  if (!section || !canvas) return;
  // While editing has the push suspended, every block stays where the
  // last pass put it: the drag draws its block with the block's own shift
  // (pushShiftOf), and the resume pushes again from the new frames.
  if (pushSuspended) return;
  const items = [];
  for (const el of canvas.querySelectorAll(':scope > .urd-block')) {
    const block = section.blocks.find((b) => b.id === el.dataset.blockId);
    const frame = block?.frames?.desktop;
    if (!frame) continue;
    // The box follows its content down to the design height and never
    // below it: taller content grows it, content that fits again (a wider
    // window, a text set to shrink) gives the design height back. Measured
    // with the box at the design height, since the content's min-height
    // follows the box. A block whose height follows its content (ADR-0025)
    // is drawn at the content's own height, also below the design height,
    // while the blocks below keep their places, since the push moves blocks
    // down only.
    el.style.height = `${frame.h}px`;
    fitContent(el, frame.h, block);
    const measure = () => (followsContent(block) ? hugHeight(el) : 0) || Math.max(frame.h, Math.round(contentHeight(el)));
    const needed = measure();
    // The editor's own parts (the adders, the placeholders of empty fields)
    // are drawn but never push: the growth is the content a visitor sees, so
    // the editor's section heights are the published page's.
    const seen = el.querySelector(EDITOR_ONLY) ? asVisitor(el, measure) : needed;
    if (needed !== frame.h) el.style.height = `${needed}px`;
    const grow = Math.max(0, seen - frame.h);
    // The drawn box is kept, so a redraw between passes (a drag, the arrow
    // keys, align) can put it back instead of the design height. The shift
    // is kept the same way, below.
    if (needed !== frame.h) el.dataset.urdDrawn = String(needed);
    else delete el.dataset.urdDrawn;
    items.push({ id: el.dataset.blockId, x: frame.x, y: frame.y, h: frame.h, grow, el });
  }
  // The growth is kept for the drag's live pass (pushPreview).
  host._urdPushGrow = new Map(items.map((it) => [it.id, it.grow]));
  writePush(host, items);
}

/**
 * Writes the shifts and the section height for a set of measured items.
 * @param {HTMLElement} host The section element
 * @param {Array<{id: string, x: number, y: number, h: number, grow: number, el: HTMLElement}>} items
 * @param {Set<string>} [skipBox] Ids left out of the section height (blocks under the pointer)
 */
function writePush(host, items, skipBox) {
  const { shifts } = pushLayout(items);
  // The section's own height, the line a block has to stay inside to have a
  // say in it. A block placed past it lies across the sections below instead
  // of stretching the one it belongs to; a section with no height of its own
  // still follows every block. The height is the owner's: in the editor the
  // growth never raises it, and a block that outgrows it lies over the
  // section below, where the owner sees it; on the published page the
  // growth raises it, so a visitor's content never lies over the next
  // section (ADR-0025 decision 8).
  host.style.minHeight = host.dataset.urdMinHeight ?? '';
  const designPx = Number.parseFloat(getComputedStyle(host).minHeight) || 0;
  const held = host._urdPushPreview && Boolean(host._urdPushSection?.size?.minHeight);
  const inside = (it) => !held && (designPx <= 0 || it.y + it.h <= designPx);
  let grew = false;
  let bottom = 0;
  for (const it of items) {
    const shift = shifts.get(it.id) ?? 0;
    // A block being dragged is drawn where the pointer holds it, but it does
    // not decide how tall the section is, so the section it is leaving keeps
    // its height and the drop target stays uncovered.
    if (!skipBox?.has(it.id) && inside(it)) {
      grew = grew || it.grow > 0;
      bottom = Math.max(bottom, it.y + shift + it.h + it.grow);
    }
    const top = `${it.y + shift}px`;
    if (shift) it.el.dataset.urdShift = String(shift);
    else delete it.el.dataset.urdShift;
    if (it.el._urdStickyBase) {
      it.el._urdStickyBase.top = top;
      it.el._urdStickyBase.y = it.y + shift;
      continue;
    }
    if (it.el.style.top !== top) it.el.style.top = top;
  }
  if (grew && bottom + PUSH_SECTION_PAD > designPx) host.style.minHeight = `${Math.round(bottom + PUSH_SECTION_PAD)}px`;
}

/**
 * The push as it will be after a drag ends, drawn live during the drag:
 * the growth measured by the last pass is kept, the frames of the blocks
 * being dragged come from `frames` (block id to frame), and every block's
 * top is written as the pass would write it, so the release changes
 * nothing the owner has not already seen. A block whose content changes
 * height under the drag (one that follows its content, dragged narrower)
 * brings its growth as it is now in `grown`. The blocks being moved are left
 * out of the section height by default; a resize keeps its block in it, so a
 * section that follows its blocks follows the resize.
 * @param {HTMLElement} host The section element
 * @param {Map<string, {x: number, y: number, w: number, h: number}>} frames
 * @param {Map<string, number>} [grown] Block id to its growth past its frame, in px
 * @param {Set<string>} [skip] Ids left out of the section height
 */
export function pushPreview(host, frames, grown, skip = new Set(frames.keys())) {
  const section = host?._urdPushSection;
  const canvas = host?.querySelector(':scope > .urd-canvas');
  const grow = host?._urdPushGrow;
  if (!section || !canvas || !grow) return;
  const items = [];
  for (const el of canvas.querySelectorAll(':scope > .urd-block')) {
    const id = el.dataset.blockId;
    const frame = frames.get(id) ?? section.blocks.find((b) => b.id === id)?.frames?.desktop;
    if (!frame) continue;
    items.push({ id, x: frame.x, y: frame.y, h: frame.h, grow: grown?.get(id) ?? grow.get(id) ?? 0, el });
  }
  writePush(host, items, skip);
}

/**
 * New frames for blocks that are already drawn, put in place without
 * drawing the section again, so a caret in the block's text stays where it
 * is (the editor's fit of a frame to its content, ADR-0025). The frames go
 * into the section the push pass holds, the one the editing layer reads too,
 * and the pass draws the heights and the places from them.
 * @param {HTMLElement} host The section element
 * @param {Object<string, {x: number, y: number, w: number, h: number}>} frames Block id to desktop frame
 */
export function updateFrames(host, frames) {
  const section = host?._urdPushSection;
  if (!section || !frames) return;
  for (const block of section.blocks) {
    const frame = frames[block.id];
    if (frame && block.frames) block.frames.desktop = frame;
  }
  syncSectionHeight(host);
  schedulePush(host);
}

/**
 * The content's zoom on the desktop: the block's drawn scale (ADR-0025
 * decision 6, block.size times its type's scale, drawnScale) times its fit
 * below the design width (ADR-0024, block.fit).
 * «Shrink» follows the canvas in proportion: the zoom is the canvas width
 * over the design width, down to the block's floor (block.fitMin, a share
 * of the design size), so the content keeps its lines and nothing is
 * measured; under the floor the box is narrower than the content and it
 * wraps like any other. «Both» zooms only as much as the frame needs and
 * lets the content wrap: the largest zoom from 1 down to the floor at which
 * the content fits the design height is found by bisection; content that
 * fits at full size is left alone, and content that does not fit at the
 * floor keeps the floor, wraps, and is pushed like any other. A block
 * without the field (wrap), or of a type that shrinks by its frame instead,
 * is drawn at its drawn scale alone, so a switch back needs no re-render. The
 * bisection measures with the box at the design height and the content's
 * min-height off, since the content otherwise fills the box.
 * @param {HTMLElement} el The block element
 * @param {number} designH The frame's design height in px
 * @param {object} block The block data
 */
function fitContent(el, designH, block) {
  const child = contentChild(el);
  if (!child) return;
  const size = drawnScale(block);
  // The width-floor types (image, video, shape, icon) shrink by their frame
  // (fitFloorPx), never by a zoom of the content.
  if ((block.fit !== 'shrink' && block.fit !== 'both') || FIT_BY_WIDTH.has(block.type)) {
    applyZoom(child, size);
    return;
  }
  const floor = clampFitMin(block.fitMin);
  if (block.fit === 'shrink') {
    applyZoom(child, Math.max(floor, canvasRatio(el)) * size);
    return;
  }
  const minHeight = child.style.minHeight;
  child.style.minHeight = '0';
  const fitsAt = (z) => {
    applyZoom(child, z * size);
    return child.scrollHeight * z * size <= designH + 1;
  };
  if (!fitsAt(1) && fitsAt(floor)) {
    let lo = floor;
    let hi = 1;
    for (let i = 0; i < 8; i++) {
      const mid = (lo + hi) / 2;
      if (fitsAt(mid)) lo = mid;
      else hi = mid;
    }
    fitsAt(Math.round(lo * 1000) / 1000);
  }
  child.style.minHeight = minHeight;
}

/**
 * How much narrower than its design width the block's canvas is: 1 at the
 * design width and above, and where nothing has a design size (a
 * full-width site or section, renderSection).
 * @param {HTMLElement} el The block element
 * @returns {number}
 */
function canvasRatio(el) {
  const canvas = el.closest('.urd-canvas');
  const designW = canvas?._urdDesignW;
  if (!canvas || !(designW > 0)) return 1;
  return Math.min(1, canvas.clientWidth / designW);
}

/** The block's content: its first child that is not editing chrome. */
function contentChild(el) {
  return [...el.children].find((c) => !c.matches(BLOCK_CHROME));
}

/**
 * Draws the content at a zoom: everything in it, text included, scales
 * alike, so the content keeps its lines at any size. A bound the owner
 * gives the base text stops the size there (sizeRange); the shrink below
 * the design width multiplies it.
 * @param {HTMLElement} child The content element
 * @param {number} zoom The drawn scale times the shrink
 */
function applyZoom(child, zoom) {
  const z = Math.round(zoom * 1000) / 1000;
  child.style.zoom = z === 1 ? '' : String(z);
}

/** The editing chrome inside a block never counts as content, and neither
 *  does a dialog, which is drawn over the page and never in the block. */
const BLOCK_CHROME = '.urd-anchor, .urd-edit-toolbar, .urd-edit-resize, .urd-edit-rotate, .urd-edit-stop, .urd-edit-readout, .urd-sticky-badge, .urd-mobile-pin, .urd-hint-chip, .urd-hint-card, .urd-cal-note, .urd-block-ruler, dialog';

/**
 * The height the block's content needs, in the block's own px. Measured on
 * the content children, not on the block, so the editing handles that hang
 * below the box never count; a zoomed child (a text set to shrink) is
 * converted from its own zoom to the block's.
 * @param {HTMLElement} el The block element
 * @returns {number}
 */
export function contentHeight(el) {
  return childrenHeight(el);
}

/** The tallest content child's scroll height, in the block's own px. */
function childrenHeight(el) {
  const z = el.currentCSSZoom ?? 1;
  let needed = 0;
  for (const child of el.children) {
    if (child.matches(BLOCK_CHROME)) continue;
    needed = Math.max(needed, child.scrollHeight * ((child.currentCSSZoom ?? 1) / z));
  }
  return needed;
}

/**
 * The height a block's content takes when the box leaves it its own, in the
 * block's px (ADR-0025). The box is set to auto for the measure, so content
 * that fills its box (a height or a min-height of 100 %) comes back to the
 * height it needs, and the box gets its height back after. The box's own
 * height covers content stacked in several children, and each child's scroll
 * height covers content that overflows it. Demo content is measured too: the
 * editor fits a frame to what the preview shows.
 * @param {HTMLElement} el The block element
 * @returns {number} 0 when there is nothing to measure
 */
export function naturalHeight(el) {
  const height = el.style.height;
  el.style.height = 'auto';
  const needed = Math.max(el.offsetHeight, childrenHeight(el));
  el.style.height = height;
  return Math.round(needed);
}

/**
 * The height the open `<details>` of a block add beyond their summaries, in
 * the block's px: an FAQ answer or a calendar's fold that a visitor has
 * unfolded is view state, never the design.
 * @param {HTMLElement} el The block element
 * @returns {number}
 */
function unfoldedHeight(el) {
  const z = el.currentCSSZoom ?? 1;
  let unfolded = 0;
  for (const details of el.querySelectorAll('details[open]')) {
    // A fold inside an open fold is part of the outer one's height.
    if (details.parentElement?.closest('details[open]')) continue;
    const box = getComputedStyle(details);
    const edges = ['paddingTop', 'paddingBottom', 'borderTopWidth', 'borderBottomWidth'].reduce((sum, key) => sum + (Number.parseFloat(box[key]) || 0), 0);
    const closed = (details.querySelector(':scope > summary')?.offsetHeight ?? 0) + edges;
    unfolded += Math.max(0, details.offsetHeight - closed) * ((details.currentCSSZoom ?? 1) / z);
  }
  return unfolded;
}

/**
 * The editor's own parts inside a block: the image adders, the «+ Product» card, the placeholders of empty fields and the hints of a calendar's removed or empty lines.
 * They are drawn in the preview but are never part of the page, so the push and the fit measure a block without them.
 * base.css hides the same list under `.urd-fit-measure`, and a test holds the two equal.
 */
export const EDITOR_ONLY = '.urd-collection-image-adder, .urd-product-adder, .urd-collection-placeholder:empty, .urd-cal-gone';

/**
 * Runs a measure of a block as a visitor sees it: with the editor's own
 * parts hidden for the length of the call, when the block holds any.
 * @template T
 * @param {HTMLElement} el The block element
 * @param {() => T} measure
 * @returns {T}
 */
function asVisitor(el, measure) {
  if (el.classList.contains('urd-fit-measure') || !el.querySelector(EDITOR_ONLY)) return measure();
  el.classList.add('urd-fit-measure');
  try {
    return measure();
  } finally {
    el.classList.remove('urd-fit-measure');
  }
}

/**
 * A block's heights as a visitor sees it, without the editor's own parts
 * (ADR-0025): `natural` with what a visitor has unfolded, the growth the
 * push answers; and `resting` without it, the height the editor's fit and a
 * settled gesture write into the frame.
 * @param {HTMLElement} el The block element
 * @returns {{natural: number, resting: number}} 0 when there is nothing to measure
 */
export function visitorHeights(el) {
  return asVisitor(el, () => {
    const natural = naturalHeight(el);
    const rest = Math.round(natural - unfoldedHeight(el));
    return { natural, resting: rest > 0 ? rest : natural };
  });
}

/**
 * Whether a block that follows its content is drawn at it: a block still
 * loading its content (`aria-busy`) holds the frame's height so the page
 * does not jump when the content arrives.
 * @param {HTMLElement} el The block element
 * @returns {boolean}
 */
export function drawsAtContent(el) {
  return !el.querySelector('[aria-busy="true"]');
}

/**
 * The height a block that follows its content is drawn at, or 0 to keep its
 * frame's: while it is not drawn at its content (drawsAtContent), and when
 * it has nothing to show, so the box can still be found and selected.
 * @param {HTMLElement} el The block element
 * @returns {number}
 */
export function hugHeight(el) {
  return drawsAtContent(el) ? naturalHeight(el) : 0;
}

/**
 * Writes a section's design height for the push pass from the section data:
 * its own height, or the blocks' extent when it has none, the way
 * renderSection writes it. Called after frames change without a redraw.
 * @param {HTMLElement} host The section element
 */
export function syncSectionHeight(host) {
  const section = host?._urdPushSection;
  if (!section) return;
  const bottom = Math.max(0, ...section.blocks.map((b) => b.frames?.desktop).filter(Boolean).map((f) => f.y + f.h));
  host.dataset.urdMinHeight = sectionMinHeight(section, bottom);
}

/** One pass per frame per section, however many observations arrive. */
function schedulePush(host) {
  if (host._urdPushRaf) return;
  host._urdPushRaf = requestAnimationFrame(() => {
    host._urdPushRaf = 0;
    applyPush(host);
  });
}

/**
 * Wires the push pass for a freshly rendered desktop section: a first pass
 * after the blocks' own measurements (they queue their frames before this
 * one), and a ResizeObserver on every block and its content for fonts,
 * images, feeds and width changes. The observer runs the pass synchronously:
 * its notifications are delivered after layout and before paint, so a text
 * that wrapped at the new width is fitted and pushed before the frame is
 * drawn. The pass is deterministic, so a second delivery in the same frame
 * finds the same sizes and the loop ends. Hosts that left the document (a
 * page switch in the preview) are dropped here with their observers.
 * @param {HTMLElement} host The section element
 * @param {object} section The section data
 */
function wirePush(host, section, preview) {
  for (const old of pushHosts) {
    if (!old.isConnected) {
      old._urdPushRo?.disconnect();
      pushHosts.delete(old);
    }
  }
  host._urdPushRo?.disconnect();
  host._urdPushSection = section;
  host._urdPushPreview = Boolean(preview);
  pushHosts.add(host);
  const ro = new ResizeObserver(() => {
    if (host._urdPushRaf) {
      cancelAnimationFrame(host._urdPushRaf);
      host._urdPushRaf = 0;
    }
    applyPush(host);
  });
  for (const el of host.querySelectorAll(':scope > .urd-canvas > .urd-block')) {
    // A block that follows its content is watched through its content alone:
    // the pass writes its box at every change of the content, and a box the
    // observer watches, resized inside its own callback, would come back as
    // a notification it cannot deliver in the same frame.
    if (el.dataset.urdHeight === 'content') {
      for (const child of el.children) if (!child.matches(BLOCK_CHROME)) ro.observe(child);
      continue;
    }
    ro.observe(el);
    if (el.firstElementChild) ro.observe(el.firstElementChild);
  }
  host._urdPushRo = ro;
  schedulePush(host);
}

/**
 * Editing that writes geometry is starting: the push pass stands still, so
 * every block stays where the owner sees it, pushed or not, and nothing
 * jumps when a drag begins. The drag draws its own block with the block's
 * shift on top of the frame (pushShiftOf), and the frame it writes stays
 * free of the shift. Paired with resumePush, which pushes again from the
 * new frames.
 */
export function suspendPush() {
  pushSuspended += 1;
}

/**
 * The push shift a block is drawn with, in px (0 without a push): the
 * distance between its frame's y and its drawn top.
 * @param {HTMLElement} el The block element
 * @returns {number}
 */
export function pushShiftOf(el) {
  return Number.parseFloat(el?.dataset?.urdShift ?? '0') || 0;
}

/**
 * The height the last push pass drew a block at, or 0 when that was its
 * frame's: taller when the content grew past the frame, and shorter for a
 * block that follows its content (ADR-0025). A redraw between passes draws
 * this instead of the frame's height.
 * @param {HTMLElement} el
 * @returns {number}
 */
export function pushDrawnOf(el) {
  return Number.parseFloat(el?.dataset?.urdDrawn ?? '0') || 0;
}

/**
 * The growth past its frame the last push pass measured for a block, in px,
 * as a visitor sees it; 0 when its content fits.
 * @param {HTMLElement} host The section element
 * @param {string} id The block id
 * @returns {number}
 */
export function pushGrowthOf(host, id) {
  return host?._urdPushGrow?.get(id) ?? 0;
}

/** Editing done: measure and push again. */
export function resumePush() {
  if (pushSuspended > 0) pushSuspended -= 1;
  if (pushSuspended === 0) for (const host of pushHosts) schedulePush(host);
}

/**
 * The inline min-height of a desktop section: the stored size, or the
 * blocks' extent when the section has none. Always a plain CSS length,
 * never a calc(): plugin copies parse it with parseFloat.
 * @param {object} section The section data
 * @param {number} maxBottomPx The lowest block edge in px
 * @returns {string}
 */
export function sectionMinHeight(section, maxBottomPx) {
  return section.size?.minHeight ?? `${maxBottomPx}px`;
}

export function applyFrameCss(el, frame, floorPx = 0) {
  Object.assign(el.style, frameToCss(frame, floorPx));
  // The rotation as a custom property too, so the editing chrome can turn
  // itself back upright. A custom property cannot go through the style map
  // frameToCss returns, since Object.assign does not reach them.
  el.style.setProperty('--urd-block-rot', `${frame.rot || 0}deg`);
}

export function frameToCss(frame, floorPx = 0) {
  // A width floor (a block set to shrink, fitFloorPx in push-model.js): the
  // frame never gets narrower than the floor, and is capped at the canvas's
  // right edge so it never overhangs into the gutter.
  const width = floorPx > 0
    ? `min(max(${frame.w}%, ${floorPx}px), calc(100% - ${frame.x}%))`
    : `${frame.w}%`;
  return {
    left: `${frame.x}%`,
    top: `${frame.y}px`,
    width,
    height: `${frame.h}px`,
    zIndex: String(frame.z ?? 1),
    transform: frame.rot ? `rotate(${frame.rot}deg)` : '',
  };
}

/**
 * The reading order in the mobile row grid: sorted by desktop y, then x;
 * blocks with hideMobile are omitted. Pinned blocks (frames.mobile with row)
 * are INCLUDED, in the same reading order: auto-placement skips them, but
 * the DOM order carries the read-aloud order. Pure function, tested.
 *
 * @param {Array<object>} blocks The section's blocks
 * @returns {Array<object>} The blocks to render on mobile, in order
 */
export function stackOrder(blocks) {
  // mobileOrder (additive field) overrides the sort key and is read on the same scale as desktop y.
  // Presets use it to keep cards together (icon + box) instead of the y sort splitting the cards into bands; blocks without the field sort by desktop y.
  const key = (block) => block.mobileOrder ?? block.frames.desktop.y;
  return blocks
    .filter((block) => !block.hideMobile && block.frames?.desktop)
    .slice()
    .sort((a, b) => (key(a) - key(b)) || (a.frames.desktop.x - b.frames.desktop.x));
}

/**
 * New mobileOrder key for moving a block one step up or down in the
 * mobile reading order. Pure function, tested.
 *
 * The key is placed BETWEEN the neighbours' keys (midpoint), so no other
 * blocks need new keys. Only flowing blocks participate: pinned ones have
 * an explicit row and sit outside the flow order. Returns null when the
 * block already sits at the end (or does not flow).
 *
 * @param {Array<object>} blocks The section's blocks
 * @param {string} blockId The block to move
 * @param {number} dir -1 = earlier, 1 = later
 * @returns {number|null} New mobileOrder, or null when moving is impossible
 */
export function reorderMobileKey(blocks, blockId, dir) {
  const flow = stackOrder(blocks).filter((b) => !Number.isFinite(b.frames.mobile?.row));
  const i = flow.findIndex((b) => b.id === blockId);
  const j = i + dir;
  if (i < 0 || j < 0 || j >= flow.length) return null;
  const key = (b) => b.mobileOrder ?? b.frames.desktop.y;
  const target = key(flow[j]);
  const beyond = flow[j + dir] ? key(flow[j + dir]) : null;
  const next = beyond === null ? target + dir * 16 : (target + beyond) / 2;
  // Equal neighbour keys give a midpoint that moves nothing (the order is
  // then decided by the x tiebreak); place the key a notch past instead.
  const nudged = next === target ? target + dir * 0.01 : next;
  return Math.round(nudged * 100) / 100;
}

/**
 * Whether a block's height on the phone follows its content in the row grid:
 * text always, and a type that says so with `autoGrow` on its definition,
 * either a flag or a function of the block's props (a gallery grows in its
 * grid views and keeps its frame's height as a ribbon).
 * @param {{type?: string, props?: object}} block
 * @param {{autoGrow?: boolean|((props: object) => boolean)}|undefined} def
 * @returns {boolean}
 */
export function autoGrows(block, def) {
  if (block?.type === 'text') return true;
  return typeof def?.autoGrow === 'function' ? Boolean(def.autoGrow(block.props ?? {})) : Boolean(def?.autoGrow);
}

/**
 * Translates a mobile placement to CSS for the row grid (ADR-0019).
 * Pure function (no DOM), tested in tests/render.test.mjs.
 *
 * `placement` is the block's frames.mobile: null means the block follows
 * desktop entirely, an object without `row` overrides only the fields it
 * contains (the block still flows), and an object with `row` pins the block
 * to explicit row tracks. The rows are minmax(MOBILE_ROW, auto) and grow
 * with the content, so a row position is a position in the composition, not
 * a frozen pixel distance.
 *
 * @param {{x?: number, w?: number, row?: number, rows?: number, z?: number, rot?: number}|null} placement
 * @param {{x: number, y: number, w: number, h: number, z?: number, rot?: number}} desktop The block's desktop frame
 * @param {{autoGrow?: boolean}} [opts] autoGrow: text and data blocks with natural height
 * @returns {object} Style map for Object.assign(el.style, ...)
 */
export function mobilePlacementToCss(placement, desktop, opts = {}) {
  const css = {};
  // z and rot both fall back to the desktop frame: the placement
  // overrides only the fields it actually contains.
  const rot = placement?.rot ?? desktop.rot;
  if (rot) css.transform = `rotate(${rot}deg)`;
  const z = placement?.z ?? desktop.z;
  if (z != null) css.zIndex = String(z);

  if (Number.isFinite(placement?.row)) {
    // Pinned: explicit row tracks. Without rows the span is derived from
    // the desktop height. Height is not set: the element stretches to its
    // tracks (grid stretch), and when the content grows, the tracks grow too.
    const rows = Number.isFinite(placement.rows)
      ? placement.rows
      : Math.max(1, Math.ceil(desktop.h / MOBILE_ROW));
    css.gridRow = `${placement.row} / span ${rows}`;
    css.width = `${placement.w ?? desktop.w}%`;
    css.marginLeft = `${placement.x ?? desktop.x}%`;
    css.justifySelf = 'start';
    return css;
  }

  // Flowing: auto-placed. Partial overrides apply only to the fields
  // actually present in the placement.
  if (placement?.w != null) css.width = `${placement.w}%`;
  if (placement?.x != null) {
    css.marginLeft = `${placement.x}%`;
    css.justifySelf = 'start';
  }
  if (!opts.autoGrow) {
    // Fixed height from desktop; the span accommodates margin-bottom
    // (MOBILE_GAP from base.css), so the row tracks stay MOBILE_ROW px and
    // are never inflated.
    css.height = `${desktop.h}px`;
    css.gridRow = `auto / span ${Math.max(1, Math.ceil((desktop.h + MOBILE_GAP) / MOBILE_ROW))}`;
  }
  return css;
}

/**
 * Renders a whole page into root. Each section gets its own <section>
 * element, so renderSection can rerender a single section alone later.
 *
 * @param {object} page Page file (content/pages/*.json), already parsed
 * @param {object} site site.json
 * @param {HTMLElement} root
 * @param {{preview?: boolean, viewport?: 'desktop'|'mobile'}} [opts]
 */
export function renderPage(page, site, root, opts = {}) {
  root.replaceChildren();
  for (const section of page.sections) {
    const host = document.createElement('section');
    root.appendChild(host);
    renderSection(section, site, host, opts);
  }
  // The "+ New section" bars between sections (preview only).
  if (opts.preview) window.UrdPreviewEdit?.enhancePage(root, page, site);
  // Sticky blocks are remeasured (a re-render may have changed heights/fields).
  refreshSticky();
}

/**
 * The spots of a section a link can land on, beyond the section's own id: the section's name, each drawn block's name, and on a phone the ids and names of the blocks hidden there, which land on the section's top instead.
 * Each spot names the section or block it stands for (`of`).
 * Names that do not follow the naming rule are left out.
 * @param {object} section
 * @param {'desktop'|'mobile'} viewport
 * @returns {{section: Array<{id: string, of: string}>, blocks: Map<string, Array<{id: string, of: string}>>}} The spots drawn at the section's top, and the names per drawn block
 */
export function anchorTargets(section, viewport) {
  const top = isAnchorName(section.anchor) ? [{ id: section.anchor, of: section.id }] : [];
  const blocks = new Map();
  for (const block of section.blocks ?? []) {
    if (typeof block.id !== 'string' || !block.id) continue;
    const names = isAnchorName(block.anchor) ? [{ id: block.anchor, of: block.id }] : [];
    if (viewport === 'mobile' && block.hideMobile) top.push({ id: block.id, of: block.id }, ...names);
    else blocks.set(block.id, names);
  }
  return { section: top, blocks };
}

/**
 * Draws a spot a link can land on as a zero-size marker at the top of `host`; a name records the section or block it names (data-spot), so urd.js can show the name in the address.
 * An id already on the page is left where it is, so the first spot to claim a name keeps it.
 * @param {HTMLElement} host
 * @param {{id: string, of: string}} spot
 */
function placeSpot(host, { id, of }) {
  if (document.getElementById(id)) return;
  const marker = document.createElement('span');
  marker.className = 'urd-anchor';
  marker.id = id;
  if (of !== id) marker.dataset.spot = of;
  host.appendChild(marker);
}

/** A drawn block carries its stable id, and its name as a marker at its top that moves with it. */
function placeBlockSpots(el, block, names = []) {
  if (!document.getElementById(block.id)) el.id = block.id;
  for (const spot of names) placeSpot(el, spot);
}

/**
 * Renders (or rerenders) a single section - the basis for incremental preview.
 *
 * @param {object} section Section data
 * @param {object} site site.json
 * @param {HTMLElement} host The section element (cleared and rebuilt)
 * @param {{preview?: boolean, viewport?: 'desktop'|'mobile'}} [opts]
 */
export function renderSection(section, site, host, opts = {}) {
  const Urd = window.Urd;
  const grid = section.grid ?? site.grid;
  const viewport = opts.viewport ?? 'desktop';
  const ctx = { site, section, grid, viewport, preview: Boolean(opts.preview) };

  host.className = 'urd-section';
  host.dataset.sectionId = section.id;
  // The DOM id makes the section a spot a link lands on by its id (#<section-id>); a name, when it has one, is a marker drawn further down.
  // The jump itself is shaped by base.css and followed by urd.js.
  if (typeof section.id === 'string' && section.id) host.id = section.id;
  const spots = anchorTargets(section, viewport);
  // Ready-made section theme (role set, additive field): overrides the section's
  // color tokens on host, the blocks inherit them. Resets on Standard/absence.
  applySectionTheme(host, section.theme);
  host.replaceChildren();

  renderBackgroundLayers(host, section.background);

  // The shape dividers: over the background, under the content.
  for (const edge of ['top', 'bottom']) {
    const divider = sectionDivider(section.divider?.[edge]);
    if (!divider) continue;
    const el = document.createElement('div');
    el.className = `urd-divider urd-divider-${edge}${divider.flip ? ' urd-divider-flip' : ''}`;
    el.style.setProperty('--urd-divider-h', `${divider.height}px`);
    // A token is the page's own colour (the base copy), so a divider in a themed section still shows against it.
    el.style.color = section.theme && /^[a-z][a-z0-9-]*$/.test(divider.color)
      ? `var(--urd-base-${divider.color}, var(--urd-color-${divider.color}))`
      : resolveColor(divider.color);
    el.innerHTML = dividerSvg(divider);
    host.appendChild(el);
  }

  // The content surface (ADR-0018): the section is full window width and owns
  // the background, the canvas binds the content to the design width and
  // centers it. Block x/w are percentages OF THIS, not of the window, so the
  // layout stops growing with the screen. The width is set in CSS (base.css),
  // not here, so the editor can MEASURE it instead of computing it.
  const canvas = document.createElement('div');
  canvas.className = 'urd-canvas';
  // Per-section override: 'full' unbinds the content from the design width, inside the site's side margin (heroes, dividers), and a CSS length gives this section a width of its own.
  const secWidth = section.size?.maxWidth;
  if (secWidth) canvas.style.setProperty('--urd-canvas-w', secWidth === 'full' ? '100%' : secWidth);
  // The width the canvas has at the design width, for the proportional
  // shrink (fitContent): the site's content width, or the section's own px
  // width when that is narrower; none on a full-width site or section, or a
  // section width that is not in px, where nothing has a design size. The
  // editor's designWidth() computes the same.
  const siteW = typeof site.layout?.contentWidth === 'number' ? site.layout.contentWidth : 0;
  const secPx = typeof secWidth === 'string' && /^\d+(\.\d+)?px$/.test(secWidth) ? parseFloat(secWidth) : 0;
  canvas._urdDesignW = !secWidth ? siteW : secPx ? (siteW ? Math.min(secPx, siteW) : secPx) : 0;
  host.appendChild(canvas);

  if (viewport === 'mobile') {
    // The mobile row grid (ADR-0019): one path for all sections. Untouched
    // blocks are auto-placed in reading order, pinned ones get explicit
    // row tracks, and the minmax rows let the content grow without JS.
    const flow = document.createElement('div');
    flow.className = 'urd-flow';
    // On the page before its blocks are drawn, so a spot's id is checked against the section's own blocks too.
    canvas.appendChild(flow);
    for (const block of stackOrder(section.blocks)) {
      const el = document.createElement('div');
      const pinned = Number.isFinite(block.frames.mobile?.row);
      el.className = pinned ? 'urd-block urd-block-pinned' : 'urd-block urd-block-flow';
      el.dataset.blockId = block.id;
      // The decor mark is read by the stagger animation (decor is ornament
      // and must not delay the content wave).
      if (block.decor) el.dataset.decor = '1';
      // Auto-growing blocks (text, and def.autoGrow: faq/gallery/collection
      // and plugin blocks with content of their own) get natural height: a
      // fixed desktop height would clip taller mobile content.
      const autoGrow = autoGrows(block, Urd.blocks.get(block.type));
      Object.assign(el.style, mobilePlacementToCss(block.frames.mobile, block.frames.desktop, { autoGrow }));
      // A block with columns or cards lays itself out by its own width (base.css),
      // and a block with its own height places its content in the box.
      if (followsWidth(block)) el.dataset.urdWidth = 'own';
      const align = heightAlign(block);
      if (align !== 'top') el.dataset.urdAlign = align;
      // A block that fetches its content stands at the height the editor
      // measured at the phone width while it loads (0.7.21.7, base.css).
      // The reserve stands inside the content, which the block's drawn
      // scale zooms, so it is written in the content's own px.
      const loadingH = mobileLoadingHeight(block);
      if (loadingH) el.style.setProperty('--urd-loading-h', `${Math.round(loadingH / drawnScale(block))}px`);
      // Screen docking applies on mobile too: sticky.js docks the block
      // against its own measured size. Scroll pinning is desktop-only
      // (the row grid is document flow), so that mode is not marked here.
      if (block.sticky && typeof block.sticky.offset === 'number' && block.sticky.mode === 'screen') {
        el.classList.add('urd-sticky-able');
        el.dataset.stickyOffset = String(block.sticky.offset);
        el.dataset.stickyMode = 'screen';
        el.dataset.stickyDock = block.sticky.dock ?? 'bottom-right';
        el.dataset.stickyGroup = block.sticky.group ?? '';
      }
      renderBlock(Urd, el, block, ctx);
      // The block's drawn scale applies on the phone too (ADR-0025
      // decision 6); the shrink does not, since the row grid wraps.
      const sized = drawnScale(block) !== 1 ? contentChild(el) : null;
      if (sized) applyZoom(sized, drawnScale(block));
      flow.appendChild(el);
      if (typeof block.id === 'string' && block.id) placeBlockSpots(el, block, spots.blocks.get(block.id));
    }
    host.style.minHeight = 'auto';
  } else {
    // Desktop: absolute positioning from desktop frames.
    let maxBottomPx = 0;
    for (const block of section.blocks) {
      // A block without a desktop frame (hand-edited/broken data) is skipped instead of toppling the whole section.
      if (!block.frames?.desktop) {
        console.warn(`Urd: block '${block.id ?? block.type}' is missing frames.desktop - skipped`);
        continue;
      }
      const el = document.createElement('div');
      el.className = 'urd-block';
      el.dataset.blockId = block.id;
      // The decor mark is read by the stagger animation (decor is ornament
      // and must not delay the content wave); the mobile flow filters on
      // the field itself.
      if (block.decor) el.dataset.decor = '1';
      const frame = block.frames.desktop;
      applyFrameCss(el, frame, fitFloorPx(block, canvas._urdDesignW));
      // The push pass draws this block at its content's height (ADR-0025),
      // and the editing layer stops a drag of its height at the content. A
      // block with its own height places its content in the box (base.css),
      // and a block with columns or cards lays itself out by its own width.
      if (followsContent(block)) el.dataset.urdHeight = 'content';
      const align = heightAlign(block);
      if (align !== 'top') el.dataset.urdAlign = align;
      if (followsWidth(block)) el.dataset.urdWidth = 'own';
      // Sticky ("pin on scroll", additive field): only marking here; the
      // pinning itself is done by sticky.js on scroll. The mobile branch
      // above marks screen docking only (scroll pinning belongs to
      // absolute layout).
      if (block.sticky && typeof block.sticky.offset === 'number') {
        el.classList.add('urd-sticky-able');
        el.dataset.stickyOffset = String(block.sticky.offset);
        el.dataset.stickyUntil = block.sticky.until ?? '';
        // Additive fields: mode ('screen' docks to the window), dock point
        // and group id (blocks with the same id are pinned together).
        el.dataset.stickyMode = block.sticky.mode ?? 'scroll';
        el.dataset.stickyDock = block.sticky.dock ?? 'bottom-right';
        el.dataset.stickyGroup = block.sticky.group ?? '';
      }
      maxBottomPx = Math.max(maxBottomPx, frame.y + frame.h);
      renderBlock(Urd, el, block, ctx);
      canvas.appendChild(el);
      if (typeof block.id === 'string' && block.id) placeBlockSpots(el, block, spots.blocks.get(block.id));
    }

    // The section height belongs to the user: blocks may deliberately hang
    // past the edge (sections never clip). Without a set height, the
    // blocks' extent is used. The nav clearance is the section's padding
    // (base.css), so the content surface keeps this height when pushed down.
    host.style.minHeight = sectionMinHeight(section, maxBottomPx);
    host.dataset.urdMinHeight = host.style.minHeight;
    wirePush(host, section, ctx.preview);
  }

  // The section's name, and on a phone the blocks hidden there, land on the section's top.
  for (const spot of spots.section) placeSpot(host, spot);

  // Optional section animation (additive field). The entrance animation
  // (animation) and the pointer effect (hover, additive field) are
  // independent and can be combined.
  renderAnimation(Urd, host, section.animation, ctx);
  renderAnimation(Urd, host, section.hover, ctx);

  // Mobile attention: editorial marking, preview only (visitors
  // ignore the flag, see docs/SCHEMA.md#mobile-review).
  if (ctx.preview && section.responsive?.mobile?.attention?.needed) {
    host.classList.add('urd-attention');
  }

  // In preview mode the editing layer (drag/resize/delete) is attached
  // after every render. Set by urd.js; never present for visitors.
  if (ctx.preview) window.UrdPreviewEdit?.enhanceSection(host, section, grid);
  // Sticky blocks are remeasured (incremental rerender of a single section).
  refreshSticky();
}

/** Shared block rendering with migration and placeholder fallback. */
function renderBlock(Urd, el, block, ctx) {
  const def = Urd.blocks.get(block.type);
  const lifted = lift(block, def);
  if (lifted.ok) {
    try {
      def.render(el, lifted.props, ctx);
      // Entrance animation and pointer effect are independent fields and
      // can be combined. Cardwise blocks (animPerCard) spread the fields
      // onto their cards themselves via renderCardAnimations once the cards
      // are fetched; the marker is set synchronously here: the section
      // stagger picks its targets in the same task, before the cards and
      // their classes exist.
      if (!def.animPerCard) {
        renderAnimation(Urd, el, block.animation, ctx);
        renderAnimation(Urd, el, block.hover, ctx);
      } else if (block.animation?.type || block.hover?.type) {
        el.classList.add('urd-anim-cardwise');
      }
    } catch (err) {
      console.warn(`Urd: block '${block.type}' failed to render`, err);
      renderPlaceholder(el, block.type);
    }
  } else {
    renderPlaceholder(el, block.type);
  }
}

/**
 * Cardwise animation for blocks with the animPerCard flag: the block's
 * animation and hover fields are spread onto the cards instead of the
 * block element. The cards only exist after data fetching, so the block
 * calls this itself once they are built; without cards the block can pass
 * itself as the only target, so the fields never sit dead. The registry is
 * read from window.Urd (set by urd.js before the first render; a direct
 * import would create a cycle).
 */
export function renderCardAnimations(el, cards, block, ctx) {
  if (!window.Urd) return;
  for (const animation of [block?.animation, block?.hover]) {
    renderAnimation(window.Urd, el, animation, ctx,
      (target, type, props, def, c) => applyCardAnimation(target, cards, type, props, def, c));
  }
}

/**
 * Optional animation on a block/section. An unknown or failing animation
 * shows the content unanimated - animation is decor and never topples the
 * page. The apply parameter lets the cardwise path share the lifting and
 * guarding here.
 */
function renderAnimation(Urd, el, animation, ctx, apply = applyAnimation) {
  if (!animation?.type) return;
  const def = Urd.animations.get(animation.type);
  const lifted = lift(animation, def);
  if (!lifted.ok) return;
  try {
    apply(el, animation.type, lifted.props, def, ctx);
  } catch (err) {
    console.warn(`Urd: animation '${animation.type}' failed`, err);
  }
}

/**
 * Neutral placeholder for unknown/failing blocks. The data behind it is
 * untouched; this is display only (see promise 2 and ADR-0005).
 * @param {HTMLElement} el
 * @param {string} type
 */
function renderPlaceholder(el, type) {
  el.classList.add('urd-placeholder');
  el.textContent = type;
  el.title = t('render.missingPlugin', { type });
}
