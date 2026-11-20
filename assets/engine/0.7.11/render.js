/**
 * The render loop: page → sections → background layers + blocks.
 *
 * All data is lifted via migrate.lift() before rendering. Unknown types and
 * render errors yield neutral placeholders (blocks) or are skipped
 * (background layers are decorative) - the page never crashes on bad data.
 *
 * Two viewports (opts.viewport):
 *  - 'desktop': absolute positioning from frames.desktop.
 *  - 'mobile': the row grid (ADR-0019), one path for all sections.
 *    Blocks without frames.mobile are auto-placed in reading order (stackOrder in phone-order.js, by the section's rule, its stacks, its blocks' exceptions and its custom order).
 *    Blocks with row in frames.mobile are pinned to explicit row tracks.
 *    hideMobile blocks are omitted, text and auto-growing blocks get natural height, and the section height follows from the grid.
 */
import { lift, liftPhoneWords, MOBILE_ROW, MOBILE_GAP, mobileGapOf, phoneRoomOf, PHONE_COLUMNS, phoneCells, phoneHeight } from './migrate.js';
import { forcesReadable, phoneHandoff, pushLayout, clampFitMin, fitFloorPx, phoneFitZoom, shrinksOnPhone, followsContent, followsWidth, heightAlign, FIT_BY_WIDTH, PUSH_SECTION_PAD, drawnScale, phoneSized, phoneFrame, mobileLoadingHeight, hasPhoneDesign, propsForWidth, propsForViewport, drawnBlock, NARROW_PX } from './push-model.js';
import { applyAnimation, applyCardAnimation, pointerEffectOf, entranceOf } from './animations/core.js';
import { applySectionTheme, resolveColor } from './theme.js';
import { sectionDivider, dividerSvg } from './divider-model.js';
import { refreshSticky } from './sticky.js';
import { pinsOnPhone, stuckBox, stickyLeads } from './sticky-model.js';
import { stackOrder, phoneSetupOf, phoneParts } from './phone-order.js';
import { t } from './i18n.js';
import { isAnchorName } from './nav-model.js';
import { textDesign } from './doc-look.js';

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
 * A block's width across the canvas as drawn, in percent of the canvas: a width floor draws a picture wider than its frame on a narrow canvas (frameToCss), and the push reads the width a visitor sees, never less than the frame's.
 * @param {HTMLElement} el The block element
 * @param {HTMLElement} canvas The section's canvas
 * @param {{w: number}} frame The block's desktop frame
 * @returns {number}
 */
export function drawnWidth(el, canvas, frame) {
  const across = canvas.clientWidth;
  return across && el.offsetWidth ? Math.max(frame.w, (el.offsetWidth / across) * 100) : frame.w;
}

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
    // A block drawn in its phone design is measured by the design it draws (drawnBlock).
    const stored = section.blocks.find((b) => b.id === el.dataset.blockId);
    const block = el._urdPhone ? drawnBlock(stored, el._urdPhone.narrow) : stored;
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
    // An image block's picture fills its frame and never grows it: a zoomed or turned picture overflows its clipping frame, which is no content to make room for.
    const measure = () => (followsContent(block) ? hugHeight(el) : 0) || (block.type === 'image' ? frame.h : Math.max(frame.h, Math.round(contentHeight(el))));
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
    items.push({ id: el.dataset.blockId, x: frame.x, w: drawnWidth(el, canvas, frame), y: frame.y, h: frame.h, grow, el });
  }
  // The growth is kept for the drag's live pass (pushPreview).
  host._urdPushGrow = new Map(items.map((it) => [it.id, it.grow]));
  writePush(host, items);
}

/**
 * Writes the shifts and the section height for a set of measured items.
 * @param {HTMLElement} host The section element
 * @param {Array<{id: string, x: number, w: number, y: number, h: number, grow: number, el: HTMLElement}>} items
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
  // A section with no height of its own reaches the bottom of its blocks' frames as they stand now, a frame a typed text has written since the section was drawn included; between draws it only grows, so the section a dragged block leaves keeps its height.
  const own = Boolean(host._urdPushSection?.size?.minHeight);
  const framesBottom = own ? 0 : Math.max(0, ...items.filter((it) => !skipBox?.has(it.id)).map((it) => it.y + it.h));
  if (framesBottom > (Number.parseFloat(host.style.minHeight) || 0)) host.style.minHeight = `${framesBottom}px`;
  const designPx = Number.parseFloat(getComputedStyle(host).minHeight) || 0;
  const held = host._urdPushPreview && own;
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
    items.push({ id, x: frame.x, w: drawnWidth(el, canvas, frame), y: frame.y, h: frame.h, grow: grown?.get(id) ?? grow.get(id) ?? 0, el });
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

/**
 * Pins a group of blocks on the phone while the page scrolls (`sticky.phone`, 0.7.3.10).
 * A grid item may stick only inside its own grid area, which in the row grid is the block's own rows, so the blocks stand in a holder over the whole grid instead: a layer as large as the grid, where the holder sticks below the menu (`--urd-scroll-clear`) at the group's offset and lets go where the section ends, natively.
 * With a release at a later section (`until`) the layer reaches down to that section's foot, over the sections between, so the holder lets go once it has passed.
 * Each block keeps a slot of its size in the grid, so the blocks around it keep their places, and stands in the holder where its slot stands in the grid (placeStuck), measured again as the blocks or the grid change size.
 * @param {HTMLElement} flow The section's row grid
 * @param {{offset: number, until?: string|null}} lead The group's first block's `sticky`
 * @param {HTMLElement[]} els The blocks, in reading order, each with its slot in the grid
 */
function stickOnPhone(flow, lead, els) {
  const layer = document.createElement('div');
  layer.className = 'urd-stick-layer';
  const holder = document.createElement('div');
  holder.className = 'urd-stick';
  holder.style.setProperty('--urd-stick-offset', `${Math.max(0, lead.offset)}px`);
  holder._urdUntil = typeof lead.until === 'string' && lead.until ? lead.until : null;
  holder.append(...els);
  layer.appendChild(holder);
  // Before the first block's slot, so the blocks keep their place in the reading order; the layer takes no place in the grid.
  flow.insertBefore(layer, els[0]._urdStickSlot ?? null);
  holder._urdStuck = els;
  placeStuck(holder);
  watchStuck(flow);
  for (const el of els) watchStuck(el);
}

/** The elements the pinning watch observes, each observed once. */
const stickWatched = new WeakSet();

function watchStuck(target) {
  if (!stickWatch || stickWatched.has(target)) return;
  stickWatched.add(target);
  stickWatch.observe(target);
}

/** The parts of a block's place in the row grid its slot takes over while the block is pinned on the phone (stickOnPhone). */
const SLOT_PLACE = ['gridRow', 'gridColumn', 'width', 'marginLeft', 'marginRight', 'justifySelf'];

/**
 * Brings the blocks pinned on the phone in a holder to their slots: each slot as tall as its block, the holder over the group's slots, and each block where its slot stands (stuckBox in sticky-model.js).
 * Exported for the editing layer, which moves a slot by the keys.
 * @param {HTMLElement} holder The holder (`.urd-stick`), or a block in it
 */
export function placeStuck(holder) {
  const box = holder?.closest?.('.urd-stick');
  const els = box?._urdStuck?.filter((el) => el.parentElement === box && el._urdStickSlot?.isConnected);
  if (!els?.length) return;
  for (const el of els) {
    // A block of fixed rows grows past them where its content needs it, as its rows grow in the grid.
    if (el._urdStickBase) {
      el.style.height = `${el._urdStickBase}px`;
      if (el.scrollHeight > el._urdStickBase) el.style.height = `${el.scrollHeight}px`;
    }
    el._urdStickSlot.style.height = `${el.offsetHeight}px`;
  }
  const placed = stuckBox(els.map((el) => ({ top: el._urdStickSlot.offsetTop, h: el.offsetHeight })));
  box.style.marginTop = `${placed.top}px`;
  box.style.height = `${placed.height}px`;
  els.forEach((el, i) => {
    el.style.top = `${placed.tops[i]}px`;
    // A block in cells stands over its slot's own columns, measured from the grid's edge.
    const slot = el._urdStickSlot;
    if (slot.style.gridColumn) Object.assign(el.style, { left: `${slot.offsetLeft}px`, right: 'auto', width: `${slot.offsetWidth}px`, marginLeft: '0px', marginRight: '0px' });
  });
  // A release at a later section: the layer reaches down to that section's foot, watched with the page's sections as they change size, since a section between moves it too.
  const layer = box.parentElement;
  const flow = layer?.parentElement;
  const until = box._urdUntil ? document.querySelector(`.urd-section[data-section-id="${CSS.escape(box._urdUntil)}"]`) : null;
  const reach = until && flow ? Math.round(until.getBoundingClientRect().bottom - flow.getBoundingClientRect().bottom) : 0;
  layer.style.bottom = reach > 0 ? `${-reach}px` : '';
  if (until) {
    watchStuck(until);
    if (until.parentElement) watchStuck(until.parentElement);
  }
}

/* The row grids holding blocks pinned on the phone, those blocks, and the sections they are released at with the page that holds the sections: a change of a block's size or of the grid's moves the slots, and a section's the foot the layer reaches, so each holder is placed again in the next frame. */
const stickWatch = typeof ResizeObserver === 'function' ? new ResizeObserver((entries) => {
  const holders = new Set();
  for (const entry of entries) {
    const target = entry.target;
    if (!target.isConnected) {
      stickWatch.unobserve(target);
      stickWatched.delete(target);
      continue;
    }
    const found = target.classList.contains('urd-flow') ? target.querySelectorAll(':scope > .urd-stick-layer > .urd-stick')
      : target.closest('.urd-stick') ? [target.closest('.urd-stick')] : document.querySelectorAll('.urd-stick');
    for (const holder of found) if (holder) holders.add(holder);
  }
  if (!holders.size) return;
  requestAnimationFrame(() => holders.forEach((holder) => placeStuck(holder)));
}) : null;

/**
 * A block's zoom on the phone: its drawn scale (ADR-0025 decision 6), and for a block that shrinks there (shrinksOnPhone in push-model.js) the share that keeps the lines it has at the design width (phoneFitZoom), read again as its width changes (a phone turned, the editor's phone made wider).
 * @param {HTMLElement} el The block element, standing in the row grid
 * @param {object} block
 * @param {number} designW The section's design width in px, 0 where the block has none to follow
 */
function zoomOnPhone(el, block, designW) {
  const child = contentChild(el);
  if (!child) return;
  // The phone draws the block at its own size where it has one (phoneSized), and its shrink follows that size.
  block = phoneSized(block);
  if (!shrinksOnPhone(block) || !(designW > 0)) {
    el._urdPhoneFit = null;
    const size = drawnScale(block);
    if (size !== 1) applyZoom(child, size);
    return;
  }
  el._urdPhoneFit = { block, designW, width: 0 };
  fitOnPhone(el);
  phoneFitWatch?.observe(el);
}

/** Zooms a phone block set to shrink to its width, when its width has changed since it was last zoomed. */
function fitOnPhone(el) {
  const fit = el._urdPhoneFit;
  const child = fit ? contentChild(el) : null;
  const width = el.clientWidth;
  if (!child || !(width > 0) || width === fit.width) return;
  fit.width = width;
  const zoom = phoneFitZoom(fit.block, width, fit.designW) * drawnScale(fit.block);
  applyZoom(child, zoom);
  // The loading reserve stands inside the zoomed content, so it is written in the content's own px.
  const loadingH = mobileLoadingHeight(fit.block);
  if (loadingH) el.style.setProperty('--urd-loading-h', `${Math.round(loadingH / zoom)}px`);
}

/* The phone blocks that shrink, each zoomed again in the next frame as its width changes; one observer for every block, and the zoom waits for the frame since it changes the block's height, which a zoom inside the notification would report back to it. */
const phoneFitWatch = typeof ResizeObserver === 'function' ? new ResizeObserver((entries) => {
  for (const entry of entries) {
    const el = entry.target;
    if (!el.isConnected) {
      phoneFitWatch.unobserve(el);
      continue;
    }
    if (el._urdPhoneFitFrame) continue;
    el._urdPhoneFitFrame = requestAnimationFrame(() => {
      el._urdPhoneFitFrame = 0;
      fitOnPhone(el);
    });
  }
}) : null;

/** The editing chrome inside a block never counts as content, and neither
 *  does a dialog, which is drawn over the page and never in the block. */
const BLOCK_CHROME = '.urd-anchor, .urd-edit-toolbar, .urd-edit-resize, .urd-edit-rotate, .urd-edit-stop, .urd-edit-readout, .urd-sticky-badge, .urd-mobile-pin, .urd-phone-words, .urd-hint-chip, .urd-hint-card, .urd-phone-num, .urd-block-ruler, dialog';

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
  const minHeight = el.style.minHeight;
  el.style.height = 'auto';
  el.style.minHeight = '';
  const needed = Math.max(el.offsetHeight, childrenHeight(el));
  el.style.height = height;
  el.style.minHeight = minHeight;
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
  // A text drawn as questions stands in the editor with every part open to be written in (blocks/text.js): what lies between one question's row and the next is an open part, as an unfolded fold's answer is.
  for (const text of el.querySelectorAll('.urd-text-doc[data-design="questions"] .urd-text')) {
    const rows = [...text.querySelectorAll(':scope > h2')];
    rows.forEach((row, i) => {
      const end = rows[i + 1]?.getBoundingClientRect().top ?? text.getBoundingClientRect().bottom;
      unfolded += Math.max(0, end - row.getBoundingClientRect().bottom) / z;
    });
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
  const bottom = Math.max(0, ...section.blocks.filter((b) => !b.hideDesktop).map((b) => b.frames?.desktop).filter(Boolean).map((f) => f.y + f.h));
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
 * A section drawn in its phone layout has no push pass: the row grid grows with its content.
 * @param {HTMLElement} host The section element
 */
function unwirePush(host) {
  host._urdPushRo?.disconnect();
  host._urdPushRo = null;
  if (host._urdPushRaf) cancelAnimationFrame(host._urdPushRaf);
  host._urdPushRaf = 0;
  pushHosts.delete(host);
  host._urdPushSection = null;
  delete host.dataset.urdMinHeight;
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
  if (pushSuspended === 0) {
    for (const host of pushHosts) schedulePush(host);
    // A block with a phone design that a gesture took across its width's line is drawn again once the gesture is over, in the frame after the gesture's own messages (watchPhoneDesign).
    requestAnimationFrame(() => {
      for (const host of pushHosts) for (const el of host.querySelectorAll('.urd-block')) if (el._urdPhone) redrawForWidth(el);
    });
  }
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
 * Whether a block's height on the phone follows its content in the row grid: text and the terms of sale always, and a type that says so with `autoGrow` on its definition, either a flag or a function of the block's props (a gallery grows in its grid views and keeps its frame's height as a ribbon).
 * @param {{type?: string, props?: object}} block
 * @param {{autoGrow?: boolean|((props: object) => boolean)}|undefined} def
 * @returns {boolean}
 */
export function autoGrows(block, def) {
  if (block?.type === 'text' || block?.type === 'terms') return true;
  return typeof def?.autoGrow === 'function' ? Boolean(def.autoGrow(block.props ?? {})) : Boolean(def?.autoGrow);
}

/** Whether a block's words are measured by the desktop's «Force readable text» (ADR-0034 decision 3): a text block in its plain design, whose width handle stops at the readable floor and whose section shows its phone layout under the width it would fall under it (phoneHandoff). */
function measuredText(block) {
  return block?.type === 'text' && textDesign(block.props?.design) === 'plain';
}

/** Whether a block draws words: one that grows with its content and is not sized by its frame, as the row grid marks it (`data-urd-words`). */
function drawsWords(block, Urd) {
  return !FIT_BY_WIDTH.has(block?.type) && autoGrows(block, Urd?.blocks?.get(block?.type));
}

/** The section elements that show their phone layout under a window width, each with what stops its watch. */
const handoffWatches = new Map();

/**
 * Watches the window width under which a section shows its phone layout, so it is drawn again as the window crosses it; a section drawn anew drops its earlier watch, and one no longer on the page drops its own.
 * @param {HTMLElement} host The section element
 * @param {number} width The width (phoneHandoff), or 0 for none
 * @param {() => void} redraw
 */
function watchHandoff(host, width, redraw) {
  handoffWatches.get(host)?.abort();
  handoffWatches.delete(host);
  for (const [el, watch] of handoffWatches) {
    if (el.isConnected) continue;
    watch.abort();
    handoffWatches.delete(el);
  }
  if (!width) return;
  const watch = new AbortController();
  handoffWatches.set(host, watch);
  window.matchMedia(`(max-width: ${width}px)`).addEventListener('change', () => {
    if (host.isConnected) redraw();
  }, { signal: watch.signal });
}

/** A cell holds words, and so stands across the row where too narrow (the floor in base.css), while any of its blocks draws words (`data-urd-words`). */
function syncCellWords(cell) {
  cell.classList.toggle('urd-cell-words', [...cell.children].some((child) => child.dataset.urdWords === '1'));
}

/** The phone's cells and a block's own height there (migrate.js), read here with the rest of the row grid. */
export { PHONE_COLUMNS, phoneCells, phoneHeight };

/**
 * The place in the row grid of what stands in cells: a cell of flowing blocks (render.js wraps the blocks one after another in the same cells in one, so they stand under each other and the next block in other cells shares their line), or a block pinned in cells.
 * Its grid columns, and its inner edges half the space between blocks in, so two cells side by side stand that space apart while the outer edges line up with a block across the full row.
 * The grid's first line is the row's outer edge (base.css), so cell column c starts at line c + 1.
 * @param {{col: number, cols: number}} cells
 * @returns {object} Style map
 */
export function phoneCellCss({ col, cols }) {
  const half = 'calc(var(--urd-mobile-gap, 16px) / 2)';
  return {
    gridColumn: `${col + 1} / span ${cols}`,
    width: 'auto',
    justifySelf: 'stretch',
    marginLeft: col > 1 ? half : '0px',
    marginRight: col + cols - 1 < PHONE_COLUMNS ? half : '0px',
  };
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
 * A placement with cells (`col` and `cols`, phoneCells) stands in those of
 * the eight cell columns: pinned, as a grid item of its own (phoneCellCss);
 * flowing, in its cell's whole width, the cell placed by render.js. A block
 * whose size is its frame keeps its desktop shape there, its height
 * following its width.
 * A flowing block's own height on the phone (`height`) takes the desktop
 * height's place: a least height for a block that grows with its content,
 * and the whole height for any other, a picture or a film then filling it.
 *
 * @param {{x?: number, w?: number, row?: number, rows?: number, col?: number, cols?: number, height?: number, z?: number, rot?: number}|null} placement
 * @param {{x: number, y: number, w: number, h: number, z?: number, rot?: number}} desktop The block's desktop frame
 * @param {{autoGrow?: boolean, gap?: number, byWidth?: boolean, designWidth?: number}} [opts] autoGrow: text and data blocks with natural height; gap: the space under a flowing block in px (mobileGapOf), MOBILE_GAP without it; byWidth: a block whose size is its frame (FIT_BY_WIDTH), with designWidth the width its desktop frame's percent is of
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

  const cells = phoneCells(placement);
  if (Number.isFinite(placement?.row)) {
    // Pinned: explicit row tracks. Without rows the span is derived from
    // the desktop height. Height is not set: the element stretches to its
    // tracks (grid stretch), and when the content grows, the tracks grow too.
    const rows = Number.isFinite(placement.rows)
      ? placement.rows
      : Math.max(1, Math.ceil(desktop.h / MOBILE_ROW));
    css.gridRow = `${placement.row} / span ${rows}`;
    if (cells) return Object.assign(css, phoneCellCss(cells));
    css.width = `${placement.w ?? desktop.w}%`;
    css.marginLeft = `${placement.x ?? desktop.x}%`;
    css.justifySelf = 'start';
    return css;
  }

  // Flowing: auto-placed. Partial overrides apply only to the fields
  // actually present in the placement. A block in cells stands in its cell's whole width (phoneCellCss places the cell).
  if (cells) {
    css.width = '100%';
  } else {
    if (placement?.w != null) css.width = `${placement.w}%`;
    if (placement?.x != null) {
      css.marginLeft = `${placement.x}%`;
      css.justifySelf = 'start';
    }
  }
  // The block's own height on the phone (`height`) stands in the desktop height's place: a block that grows with its content stands at least that tall, any other that tall.
  const own = phoneHeight(placement);
  // A block whose size is its frame, in cells narrower than the row: its desktop shape, the height following the cells' width and the row growing to it, until it has a height of its own, which the picture then fills.
  const shape = !own && cells && opts.byWidth && opts.designWidth > 0 && desktop.w > 0 && desktop.h > 0
    ? (desktop.w / 100) * opts.designWidth / desktop.h : 0;
  if (shape) {
    css.aspectRatio = String(Math.round(shape * 1000) / 1000);
  } else if (opts.autoGrow && !(own && opts.byWidth)) {
    // Its content's height, or at least its own height on the phone, the content growing it past; a picture or a film with a shape takes its own height whole, and fills it.
    if (own) css.minHeight = `${own}px`;
  } else if (cells) {
    // In a cell the block is no grid item: its height, the cell growing to its blocks.
    css.height = `${own ?? desktop.h}px`;
  } else {
    // A fixed height, the span holding the block and the gap under it (margin-bottom, `--urd-mobile-gap` in base.css).
    // The span holds the standard gap at most: a larger gap grows the row tracks, as a text block's margin does, so a block placed by hand below keeps its distance and no flowing block jumps past it.
    const gap = Math.min(Number.isFinite(opts.gap) ? opts.gap : MOBILE_GAP, MOBILE_GAP);
    const height = own ?? desktop.h;
    css.height = `${height}px`;
    css.gridRow = `auto / span ${Math.max(1, Math.ceil((height + gap) / MOBILE_ROW))}`;
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
 * The spots of a section a link can land on, beyond the section's own id: the section's name, each drawn block's name, and the ids and names of the blocks hidden on the screen (on a phone those hidden there, on the desktop those shown on phones only), which land on the section's top instead.
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
    if (viewport === 'mobile' ? block.hideMobile : block.hideDesktop) top.push({ id: block.id, of: block.id }, ...names);
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

/** The width a side menu's column takes beside the page, in px: the body's room for it (base.css `urd-side-left`, `urd-side-right`), as nav.js sets it; 0 without one. */
function sideColumn() {
  const body = document.body;
  if (!body.classList.contains('urd-side-left') && !body.classList.contains('urd-side-right')) return 0;
  return parseFloat(getComputedStyle(body).getPropertyValue('--urd-nav-side-width')) || 250;
}

/**
 * Renders (or rerenders) a single section - the basis for incremental preview.
 *
 * @param {object} section Section data
 * @param {object} site site.json
 * @param {HTMLElement} host The section element (cleared and rebuilt)
 * @param {{preview?: boolean, viewport?: 'desktop'|'mobile', measure?: boolean}} [opts] `measure`: a copy drawn out of sight only to be measured (the phone drag's preview in preview-edit.js), drawn as the preview draws its blocks, without the editing layer and without animations, so its blocks stand in their end state.
 * On the desktop a section whose words would stand narrower than they read well shows its phone layout under that window width (phoneHandoff, ADR-0034), marked `urd-handoff` with the width in `data-urd-handoff`, its texts keeping the desktop's measure, and is drawn again as the window crosses it.
 */
export function renderSection(section, site, host, opts = {}) {
  const Urd = window.Urd;
  const grid = section.grid ?? site.grid;
  const asked = opts.viewport ?? 'desktop';
  // A copy drawn to be measured keeps the view it is asked for.
  const handoff = asked === 'desktop' && !opts.measure ? phoneHandoff(section, site, measuredText, window.innerWidth - document.documentElement.clientWidth, sideColumn()) : 0;
  watchHandoff(host, handoff, () => {
    // In the editor the editor sends the section again, since what has been typed since it was drawn lives in its draft.
    if (opts.preview) window.parent?.postMessage({ type: 'urd-redraw-section', sectionId: section.id }, location.origin);
    else renderSection(section, site, host, opts);
  });
  const viewport = handoff && window.matchMedia(`(max-width: ${handoff}px)`).matches ? 'mobile' : asked;
  // `handoff`: a section showing its phone layout on a desktop page keeps the desktop's measure on its texts (blocks/text.js), its row being as wide as the desktop's canvas.
  const ctx = { site, section, grid, viewport, handoff: viewport !== asked, preview: Boolean(opts.preview || opts.measure), measure: Boolean(opts.measure) };

  host.className = 'urd-section';
  host.dataset.sectionId = section.id;
  host.classList.toggle('urd-handoff', viewport !== asked);
  if (handoff) host.dataset.urdHandoff = String(handoff);
  else delete host.dataset.urdHandoff;
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
    // The space between the flowing blocks: the section's own, the site's, or the standard.
    const gap = mobileGapOf(section, site);
    flow.style.setProperty('--urd-mobile-gap', `${gap}px`);
    // The room above the first block and below the last: the section's own, or the standard.
    const room = phoneRoomOf(section);
    flow.style.paddingBlock = `${room.top}px ${room.bottom}px`;
    // «Force readable text» off on the phone (ADR-0034): the floor for words in narrow cells is not drawn (base.css).
    if (!forcesReadable(section, 'mobile')) flow.dataset.urdFreeWords = '';
    // On the page before its blocks are drawn, so a spot's id is checked against the section's own blocks too.
    canvas.appendChild(flow);
    // The blocks pinned on the phone while the page scrolls, by their pinning group (each alone without one), the group's first block in the section's order speaking for it as on the desktop (stickyLeads).
    const leads = stickyLeads(section.blocks);
    const stuck = new Map();
    /** The cell the flowing blocks one after another in the same cells stand in, under each other, as one grid item (phoneCellCss). */
    let cell = null;
    // A stack stands in its first block's cells, whatever cells its other blocks hold, so it stays one.
    const parts = phoneParts(section.blocks, phoneSetupOf(section));
    const byId = new Map(section.blocks.map((b) => [b.id, b]));
    const stackHead = new Map(parts.stacks.flatMap((ids) => ids.map((id) => [id, byId.get(ids[0])])));
    for (const block of parts.order) {
      const el = document.createElement('div');
      const pinned = Number.isFinite(block.frames.mobile?.row);
      el.className = pinned ? 'urd-block urd-block-pinned' : 'urd-block urd-block-flow';
      el.dataset.blockId = block.id;
      // The decor mark is read by the stagger animation (decor is ornament
      // and must not delay the content wave).
      if (block.decor) el.dataset.decor = '1';
      const key = block.sticky?.group || `solo-${block.id}`;
      const sticks = Boolean(block.sticky) && pinsOnPhone(leads.get(key));
      // A flowing block in cells stands in a cell with the blocks before it in the same cells, or opens one; a block pinned on the phone while the page scrolls is a grid item of its own, through its slot.
      const own = phoneCells(block.frames.mobile);
      const head = stackHead.get(block.id);
      const cells = pinned ? null : head && head !== block && !Number.isFinite(head.frames.mobile?.row) ? phoneCells(head.frames.mobile) : own;
      if (cells && !sticks) {
        const name = `${cells.col}/${cells.cols}`;
        if (cell?.dataset.cells !== name) {
          cell = document.createElement('div');
          cell.className = 'urd-cell';
          cell.dataset.cells = name;
          cell.dataset.cols = String(cells.cols);
          Object.assign(cell.style, phoneCellCss(cells));
          flow.appendChild(cell);
        }
      } else {
        cell = null;
      }
      const into = cell ?? flow;
      // Auto-growing blocks (text, and def.autoGrow: faq/gallery/collection
      // and plugin blocks with content of their own) get natural height: a
      // fixed desktop height would clip taller mobile content.
      // A block in cells keeps its desktop shape there where its size is its frame, and a cell holding words narrower than they read well stands across the row (the floor in base.css).
      const placing = { gap, byWidth: FIT_BY_WIDTH.has(block.type), designWidth: canvas._urdDesignW };
      const placement = pinned || cells === own ? block.frames.mobile : { ...block.frames.mobile, ...(cells ?? { col: 1, cols: PHONE_COLUMNS }) };
      el._urdPhonePlace = placement;
      // A height of its own on the phone: a picture or a film with a shape fills it rather than keeping its shape (base.css).
      if (phoneHeight(placement)) el.dataset.urdPhoneH = '1';
      const place = (autoGrow) => {
        // The desktop frame with its height at the phone's own size, where the block has one.
        Object.assign(el.style, mobilePlacementToCss(placement, phoneFrame(block), { ...placing, autoGrow }));
        if (cells && sticks) Object.assign(el.style, phoneCellCss(cells));
      };
      place(autoGrows(block, Urd.blocks.get(block.type)));
      // A block with a phone design stands in the flow before it is drawn, so its own width says whether it draws that design (renderBlock), and its layout follows the design it draws.
      const phone = hasPhoneDesign(block.type, block.props);
      if (phone) into.appendChild(el);
      const narrow = phone && isNarrowBlock(el, block, ctx);
      const drawn = drawnBlock(block, narrow);
      if (drawn !== block) place(autoGrows(drawn, Urd.blocks.get(block.type)));
      // Words in cells: the cell, the block pinned in cells, or the slot of a block pinned while the page scrolls, stands across the row where too narrow (the floor in base.css).
      if (drawsWords(drawn, Urd)) el.dataset.urdWords = '1';
      if (pinned && own) el.dataset.cols = String(own.cols);
      if (cell) syncCellWords(cell);
      else if (pinned && own) el.classList.toggle('urd-cell-words', el.dataset.urdWords === '1');

      // A block with columns or cards lays itself out by its own width (base.css),
      // and a block with its own height places its content in the box.
      if (followsWidth(drawn)) el.dataset.urdWidth = 'own';
      const align = heightAlign(drawn);
      if (align !== 'top') el.dataset.urdAlign = align;
      // A block that fetches its content stands at the height the editor measured at the phone width while it loads (0.7.21.7, base.css).
      // The reserve stands inside the content, which the block's drawn scale zooms, so it is written in the content's own px; a block that shrinks on the phone writes it again at its zoom (fitOnPhone).
      const loadingH = mobileLoadingHeight(block);
      if (loadingH) el.style.setProperty('--urd-loading-h', `${Math.round(loadingH / drawnScale(phoneSized(block)))}px`);
      // Screen docking applies on mobile too: sticky.js docks the block against its own measured size.
      // Pinning while scrolling is the row grid's own on the phone (stickOnPhone), so it is not marked here.
      if (block.sticky && typeof block.sticky.offset === 'number' && block.sticky.mode === 'screen') {
        el.classList.add('urd-sticky-able');
        el.dataset.stickyOffset = String(block.sticky.offset);
        el.dataset.stickyMode = 'screen';
        el.dataset.stickyDock = block.sticky.dock ?? 'bottom-right';
        el.dataset.stickyGroup = block.sticky.group ?? '';
      }
      renderBlock(Urd, el, block, ctx, narrow);
      if (sticks) {
        // Pinned on the phone: a slot of its size keeps its place in the row grid, and the block stands in its group's holder over the grid (stickOnPhone).
        const slot = document.createElement('div');
        slot.className = pinned ? 'urd-stick-slot' : 'urd-stick-slot urd-stick-slot-flow';
        for (const prop of SLOT_PLACE) if (el.style[prop]) slot.style[prop] = el.style[prop];
        if (cells) {
          slot.dataset.cols = String(cells.cols);
          slot.classList.toggle('urd-cell-words', el.dataset.urdWords === '1');
        }
        el.style.gridRow = '';
        el.style.gridColumn = '';
        el.style.justifySelf = '';
        // A block placed by hand stretches to its rows in the grid, which grow with its content; in the holder it takes their height itself, and more where its content needs it (placeStuck).
        if (pinned && !el.style.height) {
          const rows = Number.isFinite(block.frames.mobile.rows) ? block.frames.mobile.rows : Math.max(1, Math.ceil(phoneFrame(block).h / MOBILE_ROW));
          if (autoGrows(block, Urd.blocks.get(block.type))) el.style.minHeight = `${rows * MOBILE_ROW}px`;
          else el._urdStickBase = rows * MOBILE_ROW;
        }
        flow.appendChild(slot);
        el._urdStickSlot = slot;
        if (!stuck.has(key)) stuck.set(key, { lead: leads.get(key), members: [] });
        stuck.get(key).members.push({ el, block, narrow });
      } else {
        into.appendChild(el);
        // The cell holds the block now, and so knows whether it holds words.
        if (cell) syncCellWords(cell);
        // A block drawing a phone design of its own has no design width to keep its lines from.
        zoomOnPhone(el, block, narrow ? 0 : canvas._urdDesignW);
      }
      if (typeof block.id === 'string' && block.id) placeBlockSpots(el, block, spots.blocks.get(block.id));
    }
    for (const { lead, members } of stuck.values()) {
      if (!members.length) continue;
      stickOnPhone(flow, lead, members.map((m) => m.el));
      for (const m of members) zoomOnPhone(m.el, m.block, m.narrow ? 0 : canvas._urdDesignW);
    }
    // A section drawn on the desktop before (one that has just shown its phone layout) leaves the push pass, which would give it its desktop height back.
    unwirePush(host);
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
      // A block shown on phones only is not drawn here; its frame keeps its place in the phone's reading order.
      if (block.hideDesktop) continue;
      const el = document.createElement('div');
      el.className = 'urd-block';
      el.dataset.blockId = block.id;
      // The decor mark is read by the stagger animation (decor is ornament
      // and must not delay the content wave); the mobile flow filters on
      // the field itself.
      if (block.decor) el.dataset.decor = '1';
      const frame = block.frames.desktop;
      applyFrameCss(el, frame, fitFloorPx(block, canvas._urdDesignW));
      // A block with a phone design stands on the canvas before it is drawn, so its own width says whether it draws that design (renderBlock), and its layout follows the design it draws.
      const phone = hasPhoneDesign(block.type, block.props);
      if (phone) canvas.appendChild(el);
      const narrow = phone && isNarrowBlock(el, block, ctx);
      const drawn = drawnBlock(block, narrow);
      // The push pass draws this block at its content's height (ADR-0025),
      // and the editing layer stops a drag of its height at the content. A
      // block with its own height places its content in the box (base.css),
      // and a block with columns or cards lays itself out by its own width.
      if (followsContent(drawn)) el.dataset.urdHeight = 'content';
      const align = heightAlign(drawn);
      if (align !== 'top') el.dataset.urdAlign = align;
      if (followsWidth(drawn)) el.dataset.urdWidth = 'own';
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
      renderBlock(Urd, el, block, ctx, narrow);
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
  if (ctx.preview && !ctx.measure) window.UrdPreviewEdit?.enhanceSection(host, section, grid);
  // Sticky blocks are remeasured (incremental rerender of a single section).
  refreshSticky();
}

/** Shared block rendering with migration and placeholder fallback. */
function renderBlock(Urd, el, block, ctx, measured = null) {
  const def = Urd.blocks.get(block.type);
  const lifted = lift(block, def);
  if (lifted.ok) {
    try {
      // A block with a phone design draws it while it is narrow (measured by the section's layout, which places the block first), and is drawn again when it crosses the line (watchPhoneDesign).
      // On the phone the block reads its own words where it has some (phoneProps, ADR-0033), in the desktop's place, lifted by its migrations as its props are.
      const phoneProps = ctx.viewport === 'mobile' ? liftPhoneWords(block, def, lifted.props) : null;
      const props = propsForViewport({ ...block, phoneProps }, lifted.props, ctx.viewport);
      const phone = hasPhoneDesign(block.type, props);
      const narrow = phone && (measured ?? isNarrowBlock(el, block, ctx));
      // In the editor the block is told the words the phone holds of its own (`phoneWords`), so a field emptied there still stands to be written in (blocks/audio.js).
      const blockCtx = ctx.preview && phoneProps ? { ...ctx, phoneWords: phoneProps } : ctx;
      def.render(el, propsForWidth(block.type, props, narrow), blockCtx);
      if (phone) watchPhoneDesign(el, { def, type: block.type, props, block, ctx: blockCtx, narrow });
      // Entrance animation and pointer effect are independent fields and
      // can be combined; the pointer effect is the block's own, else the one
      // its section gives every element (pointerEffectOf). Cardwise blocks
      // (animPerCard) spread the fields onto their cards themselves via
      // renderCardAnimations once the cards are fetched; the marker is set
      // synchronously here: the section stagger picks its targets in the
      // same task, before the cards and their classes exist.
      const isPointer = (type) => Urd.animations.get(type)?.entrance === false;
      const hover = pointerEffectOf(block, ctx.section, isPointer);
      // The entrance on this screen: none on a phone where the block switches it off there (entranceOf).
      const entrance = entranceOf(block, ctx.viewport, isPointer);
      // A block with an entrance of its own comes in by it, never with the section's stagger, and stands at once where its entrance is off.
      if (block.animation?.type && Urd.animations.get(block.animation.type)?.entrance) el.dataset.urdEntrance = '1';
      if (!def.animPerCard) {
        renderAnimation(Urd, el, entrance, ctx);
        renderAnimation(Urd, el, hover, ctx);
      } else if (entrance?.type || hover?.type) {
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
 * Whether a block is narrow (NARROW_PX): its own width as its content has it (the block's drawn scale zooms the content, so a block drawn smaller has the room it had; a block set to shrink has its width at the design width), read once it stands in a laid-out page; a block not yet laid out counts as narrow on a phone's page.
 * A block narrow before counts as wide again only 16 px past the line.
 * @param {HTMLElement} el
 * @param {object} block
 * @param {{viewport?: string}} ctx
 */
function isNarrowBlock(el, block, ctx, wasNarrow = false) {
  // A block set to shrink lays its content out at its width at the design width, and zooms it to fit; that width is its content's.
  const designW = el.parentElement?._urdDesignW;
  const frameW = block.frames?.desktop?.w;
  const width = block.fit === 'shrink' && designW && frameW && ctx.viewport !== 'mobile'
    ? (designW * frameW) / 100
    : el.clientWidth / (drawnScale(ctx.viewport === 'mobile' ? phoneSized(block) : block) || 1);
  if (!(width > 0)) return ctx.viewport === 'mobile';
  // Back from narrow only past a margin, so a block at the line does not flip as the page's scrollbar comes and goes.
  return width < NARROW_PX + (wasNarrow ? 16 : 0);
}

/* The blocks drawn in a phone design or watched for one, each with what it is drawn again from; one observer for every block, which hears the width and draws again in the next frame. */
const phoneWatch = typeof ResizeObserver === 'function' ? new ResizeObserver((entries) => {
  for (const entry of entries) {
    const el = entry.target;
    if (!el.isConnected) {
      phoneWatch.unobserve(el);
      continue;
    }
    if (el._urdPhoneFrame) continue;
    el._urdPhoneFrame = requestAnimationFrame(() => {
      el._urdPhoneFrame = 0;
      redrawForWidth(el);
    });
  }
}) : null;

/**
 * Watches a block with a phone design for its width, so it is drawn again when it crosses NARROW_PX: a drag, a window turned or a column narrowed.
 * @param {HTMLElement} el
 * @param {{def: object, type: string, props: object, block: object, ctx: object, narrow: boolean}} state
 */
function watchPhoneDesign(el, state) {
  el._urdPhone = state;
  phoneWatch?.observe(el);
}

/**
 * A watched block drawn again when its width has crossed the line.
 * In the editor's preview the editor is asked for the section (urd-redraw-section), since what the owner has typed since the section was drawn lives in the editor's draft; on the published page the block's content is made anew in the other design, its layout marks follow it, the editing handles are kept, and the content push is told of the new content.
 */
function redrawForWidth(el) {
  const state = el._urdPhone;
  // While a gesture holds the editing still, the block keeps its design; the gesture's end looks again (resumePush).
  if (!state || !el.isConnected || pushSuspended) return;
  const narrow = isNarrowBlock(el, state.block, state.ctx, state.narrow);
  if (narrow === state.narrow) return;
  state.narrow = narrow;
  if (state.ctx.preview) {
    window.parent?.postMessage({ type: 'urd-redraw-section', sectionId: state.ctx.section?.id }, location.origin);
    return;
  }
  const drawn = drawnBlock(state.block, narrow);
  if (state.ctx.viewport === 'mobile') {
    const canvas = el.closest('.urd-canvas');
    // The place the row grid gave the block: a stack's other blocks stand in its first block's cells.
    const placement = el._urdPhonePlace ?? state.block.frames.mobile;
    const css = mobilePlacementToCss(placement, state.block.frames.desktop, {
      autoGrow: autoGrows(drawn, state.def), gap: mobileGapOf(state.ctx.section, state.ctx.site),
      byWidth: FIT_BY_WIDTH.has(state.block.type), designWidth: canvas?._urdDesignW,
    });
    // A block in cells: a grid item of its own while it pins on the phone, else its cell is, and the cell's words floor follows the design it draws.
    const cells = Number.isFinite(placement?.row) ? null : phoneCells(placement);
    const cell = el.parentElement?.classList.contains('urd-cell') ? el.parentElement : null;
    if (cells && !cell) Object.assign(css, phoneCellCss(cells));
    if (autoGrows(drawn, state.def) && !FIT_BY_WIDTH.has(state.block.type)) el.dataset.urdWords = '1'; else delete el.dataset.urdWords;
    if (cell) syncCellWords(cell);
    else if (el._urdStickSlot?.dataset.cols) el._urdStickSlot.classList.toggle('urd-cell-words', el.dataset.urdWords === '1');
    else if (el.dataset.cols) el.classList.toggle('urd-cell-words', el.dataset.urdWords === '1');
    // A block pinned on the phone gives its place in the grid to its slot (stickOnPhone).
    const slot = el._urdStickSlot;
    if (slot?.isConnected) {
      const { gridRow, gridColumn, justifySelf, ...own } = css;
      Object.assign(slot.style, { gridRow: gridRow ?? '', gridColumn: gridColumn ?? '', justifySelf: justifySelf ?? '', width: css.width ?? '', marginLeft: css.marginLeft ?? '', marginRight: css.marginRight ?? '' });
      Object.assign(el.style, own);
    } else {
      Object.assign(el.style, css);
    }
  } else if (followsContent(drawn)) {
    el.dataset.urdHeight = 'content';
  } else {
    delete el.dataset.urdHeight;
  }
  const align = heightAlign(drawn);
  if (align !== 'top') el.dataset.urdAlign = align;
  else delete el.dataset.urdAlign;
  for (const child of [...el.children]) if (!child.matches(BLOCK_CHROME)) child.remove();
  try {
    state.def.render(el, propsForWidth(state.type, state.props, narrow), state.ctx);
  } catch (err) {
    console.warn(`Urd: block '${state.type}' failed to render`, err);
    renderPlaceholder(el, state.type);
  }
  if (state.ctx.viewport === 'mobile') {
    zoomOnPhone(el, state.block, narrow ? 0 : el.closest('.urd-canvas')?._urdDesignW ?? 0);
    if (el._urdStickSlot) placeStuck(el);
  } else {
    const sized = drawnScale(state.block) !== 1 ? contentChild(el) : null;
    if (sized) applyZoom(sized, drawnScale(state.block));
  }
  const host = el.closest('.urd-section');
  for (const child of el.children) if (!child.matches(BLOCK_CHROME)) host?._urdPushRo?.observe(child);
  if (host?._urdPushSection) schedulePush(host);
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
  const isPointer = (type) => window.Urd.animations.get(type)?.entrance === false;
  const hover = pointerEffectOf(block, ctx?.section, isPointer);
  for (const animation of [entranceOf(block, ctx?.viewport, isPointer), hover]) {
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
  if (!animation?.type || ctx?.measure) return;
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
