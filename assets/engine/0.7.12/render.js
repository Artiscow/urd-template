/**
 * The render loop: sections, their background layers and their blocks, on either viewport; bad data never crashes the page.
 * Notes: docs/engine-notes/render.md (Urd repository).
 */
import { lift, liftPhoneWords, MOBILE_ROW, MOBILE_GAP, mobileGapOf, phoneRoomOf, PHONE_COLUMNS, phoneCells, phoneHeight, phoneSpace } from './migrate.js';
import { forcesReadable, phoneHandoff, pushLayout, clampFitMin, fitFloorPx, phoneFitZoom, shrinksOnPhone, followsContent, followsWidth, heightAlign, FIT_BY_WIDTH, PUSH_SECTION_PAD, drawnScale, phoneSized, phoneFrame, mobileLoadingHeight, hasPhoneDesign, propsForWidth, propsForViewport, drawnBlock, NARROW_PX } from './push-model.js';
import { applySectionTheme, resolveColor } from './theme.js';
import { stackOrder, phoneSetupOf, phoneParts } from './phone-order.js';
import { t } from './i18n.js';
import { isAnchorName } from './nav-model.js';
import { textDesign } from './doc-designs.js';
import { feature } from './features.js';

/**
 * Draws the background layers into host as div.urd-bg-layer, bottom-up; shared by sections, nav and footer, and an unknown or failing layer is skipped.
 * @param {HTMLElement} host The element the layers are built into
 * @param {{layers?: Array<{type: string, version?: number, props?: object}>}} [background]
 * @param {{later?: boolean, first?: boolean}} [options] `later`: a picture layer is drawn as its section nears the viewport; `first`: the page's first section, whose picture is fetched ahead of the rest
 */
export function renderBackgroundLayers(host, background, { later = false, first = false } = {}) {
  const Urd = window.Urd;
  for (const layer of background?.layers ?? []) {
    const el = document.createElement('div');
    el.className = 'urd-bg-layer';
    const def = Urd.backgrounds.get(layer.type);
    const lifted = lift(layer, def);
    if (!lifted.ok) {
      console.warn(`Urd: skipping background layer '${layer.type}' (${lifted.placeholder})`);
      continue;
    }
    const draw = () => {
      try {
        def.render(el, lifted.props, { first });
        return true;
      } catch (err) {
        console.warn(`Urd: background layer '${layer.type}' failed to render`, err);
        return false;
      }
    };
    if (later && def.pictures === true && typeof IntersectionObserver === 'function') {
      host.appendChild(el);
      const observer = new IntersectionObserver((entries) => {
        if (entries.some((entry) => entry.isIntersecting)) drawWaiting(el);
      }, { rootMargin: '100% 0px' });
      waitingLayers.set(el, () => {
        observer.disconnect();
        if (el.isConnected) draw();
      });
      observer.observe(el);
    } else if (draw()) {
      host.appendChild(el);
    }
  }
}

/** The picture layers waiting for their section to come near, each with what draws it. */
const waitingLayers = new Map();

/** Draws a waiting layer once, and lets go of the layers that have left the page. */
function drawWaiting(el) {
  const draw = waitingLayers.get(el);
  waitingLayers.delete(el);
  draw?.();
  for (const [other, drawOther] of waitingLayers) {
    if (!other.isConnected) {
      waitingLayers.delete(other);
      drawOther();
    }
  }
}

// A page printed holds every picture: the layers still waiting are drawn before the print is laid out.
if (typeof window !== 'undefined') window.addEventListener?.('beforeprint', () => { for (const el of [...waitingLayers.keys()]) drawWaiting(el); });

/**
 * Writes the site's layout tokens on the root element (ADR-0018); the canvas in every section reads them.
 * @param {object} site site.json (lifted)
 * @param {HTMLElement} [root] The element the tokens are set on
 */
export function applySiteLayout(site, root = document.documentElement) {
  const width = site?.layout?.contentWidth ?? 1440;
  // The gutter is a percentage of the viewport width (vw), not pixels.
  const gutter = site?.layout?.gutter ?? 6;
  root.style.setProperty('--urd-canvas-w', width === 'full' ? '100%' : `${width}px`);
  root.style.setProperty('--urd-canvas-gutter-desktop', `${Number(gutter) || 0}vw`);
}

/**
 * Raises the section's min-height so content down to `bottom` px fits, the inline value a plain length.
 * @param {HTMLElement} sectionEl The section element
 * @param {number} bottom The content's bottom edge in px
 */
export function growSectionTo(sectionEl, bottom) {
  const current = Number.parseFloat(getComputedStyle(sectionEl).minHeight) || 0;
  if (bottom > current) sectionEl.style.minHeight = `${bottom}px`;
}

/**
 * Whether the browser answers container queries, so a block that follows its own width lays itself out by its box.
 */
export const WIDTH_QUERIES = typeof CSS !== 'undefined' && typeof CSS.supports === 'function' && CSS.supports('container-type', 'inline-size');

/* ---------- Content push on the desktop canvas (ADR-0024) ---------- */

/** Sections with a push pass, so a suspension can reset them all. */
const pushHosts = new Set();
let pushSuspended = 0;

/**
 * A block's width across the canvas as drawn, in percent of the canvas, a width floor included.
 * @param {HTMLElement} el The block element
 * @param {HTMLElement} canvas The section's canvas
 * @param {{w: number}} frame The block's desktop frame
 * @returns {number}
 */
export function drawnWidth(el, canvas, frame, across = canvas.clientWidth) {
  return across && el.offsetWidth ? Math.max(frame.w, (el.offsetWidth / across) * 100) : frame.w;
}

/**
 * Measures every block against its frame and moves the blocks below one whose content grew (push-model.js); the shifts live on the elements only.
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
  // While editing has the push suspended, every block stays where the last pass put it.
  if (pushSuspended) return;
  const blocks = [];
  for (const el of canvas.querySelectorAll(':scope > .urd-block')) {
    // A block drawn in its phone design is measured by the design it draws (drawnBlock).
    const stored = section.blocks.find((b) => b.id === el.dataset.blockId);
    const block = el._urdPhone ? drawnBlock(stored, el._urdPhone.narrow) : stored;
    const frame = block?.frames?.desktop;
    if (frame) blocks.push({ el, block, frame });
  }
  // The pass reads and writes in phases, so most blocks' reads share one layout; the canvas's width is read first.
  const across = canvas.clientWidth;
  const ratio = canvasRatioAt(canvas, across);
  // The box follows its content down to the design height, never below; a block that follows its content is drawn at the content's own height.
  for (const { el, block, frame } of blocks) {
    el.style.height = `${frame.h}px`;
    fitContent(el, frame.h, block, ratio);
  }
  for (const it of blocks) {
    const { el, block, frame } = it;
    // An image block's picture fills its frame and never grows it: a zoomed or turned picture overflows its clipping frame, which is no content to make room for.
    const measure = () => (followsContent(block) ? hugHeight(el) : 0) || (block.type === 'image' ? frame.h : Math.max(frame.h, Math.round(contentHeight(el))));
    it.needed = measure();
    // The editor's own parts are drawn but never push, so the editor's section heights are the published page's.
    it.seen = el.querySelector(EDITOR_ONLY) ? asVisitor(el, measure) : it.needed;
    it.w = drawnWidth(el, canvas, frame, across);
  }
  const items = [];
  for (const { el, frame, needed, seen, w } of blocks) {
    if (needed !== frame.h) el.style.height = `${needed}px`;
    const grow = Math.max(0, seen - frame.h);
    // The drawn box is kept, so a redraw between passes can put it back; the shift is kept the same way.
    if (needed !== frame.h) el.dataset.urdDrawn = String(needed);
    else delete el.dataset.urdDrawn;
    items.push({ id: el.dataset.blockId, x: frame.x, w, y: frame.y, h: frame.h, grow, el });
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
  // The section's own height, which the growth raises on the published page and never in the editor (ADR-0025 decision 8).
  host.style.minHeight = host.dataset.urdMinHeight ?? '';
  // A section with no height of its own reaches the bottom of its blocks' frames as they stand now; between draws it only grows.
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
    // A block being dragged does not decide the section's height, so the section it leaves keeps its height.
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
 * The push as it will be after a drag ends, drawn live during the drag, so the release changes nothing the owner has not seen.
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
 * New frames for blocks already drawn, put in place without drawing the section again, so a caret stays where it is.
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
 * The content's zoom on the desktop: the block's drawn scale times its fit below the design width, «Shrink» in proportion and «Both» by bisection.
 * @param {HTMLElement} el The block element
 * @param {number} designH The frame's design height in px
 * @param {object} block The block data
 */
function fitContent(el, designH, block, ratio = canvasRatio(el)) {
  const child = contentChild(el);
  if (!child) return;
  const size = drawnScale(block);
  // The width-floor types (image, video, shape, icon) shrink by their frame (fitFloorPx), never by a zoom of the content.
  if ((block.fit !== 'shrink' && block.fit !== 'both') || FIT_BY_WIDTH.has(block.type)) {
    applyZoom(child, size);
    return;
  }
  const floor = clampFitMin(block.fitMin);
  if (block.fit === 'shrink') {
    applyZoom(child, Math.max(floor, ratio) * size);
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
 * How much narrower than its design width the block's canvas is: 1 at the design width and above, and where nothing has a design size.
 * @param {HTMLElement} el The block element
 * @returns {number}
 */
function canvasRatio(el) {
  const canvas = el.closest('.urd-canvas');
  return canvas ? canvasRatioAt(canvas, canvas.clientWidth) : 1;
}

/** canvasRatio for a canvas whose width is already read. */
function canvasRatioAt(canvas, across) {
  const designW = canvas?._urdDesignW;
  if (!canvas || !(designW > 0)) return 1;
  return Math.min(1, across / designW);
}

/** The block's content: its first child that is not editing chrome. */
function contentChild(el) {
  return [...el.children].find((c) => !c.matches(BLOCK_CHROME));
}

/**
 * Draws the content at a zoom, text included, so it keeps its lines at any size; an owner's bound on the base text stops it.
 * @param {HTMLElement} child The content element
 * @param {number} zoom The drawn scale times the shrink
 */
function applyZoom(child, zoom) {
  const z = Math.round(zoom * 1000) / 1000;
  child.style.zoom = z === 1 ? '' : String(z);
}

/**
 * Pins a group of blocks on the phone while the page scrolls: a holder in a layer as large as the grid sticks, each block keeping a slot.
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
const SLOT_PLACE = ['gridRow', 'gridColumn', 'width', 'marginTop', 'marginLeft', 'marginRight', 'justifySelf'];

/**
 * Brings the blocks pinned on the phone in a holder to their slots (stuckBox in sticky-model.js); exported for the editing layer.
 * @param {HTMLElement} holder The holder (`.urd-stick`), or a block in it
 */
export function placeStuck(holder) {
  const box = holder?.closest?.('.urd-stick');
  const els = box?._urdStuck?.filter((el) => el.parentElement === box && el._urdStickSlot?.isConnected);
  const pins = feature('sticky');
  if (!els?.length || !pins) return;
  for (const el of els) {
    // A block of fixed rows grows past them where its content needs it, as its rows grow in the grid.
    if (el._urdStickBase) {
      el.style.height = `${el._urdStickBase}px`;
      if (el.scrollHeight > el._urdStickBase) el.style.height = `${el.scrollHeight}px`;
    }
    el._urdStickSlot.style.height = `${el.offsetHeight}px`;
  }
  const placed = pins.stuckBox(els.map((el) => ({ top: el._urdStickSlot.offsetTop, h: el.offsetHeight })));
  box.style.marginTop = `${placed.top}px`;
  box.style.height = `${placed.height}px`;
  els.forEach((el, i) => {
    el.style.top = `${placed.tops[i]}px`;
    // A block in cells stands over its slot's own columns, measured from the grid's edge.
    const slot = el._urdStickSlot;
    if (slot.style.gridColumn) Object.assign(el.style, { left: `${slot.offsetLeft}px`, right: 'auto', width: `${slot.offsetWidth}px`, marginLeft: '0px', marginRight: '0px' });
  });
  // A release at a later section: the layer reaches down to that section's foot.
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

/* The row grids, the blocks pinned on the phone and the sections they are released at, watched so each holder is placed again in the next frame as sizes change. */
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
 * A block's zoom on the phone: its drawn scale, and for a block that shrinks there the share that keeps its lines (phoneFitZoom).
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

/* The phone blocks that shrink, each zoomed again in the next frame as its width changes; one observer for every block. */
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

/**
 * The editing chrome inside a block never counts as content, and neither does a dialog, which is drawn over the page and never in the block.
 */
export const BLOCK_CHROME = '.urd-anchor, .urd-edit-toolbar, .urd-edit-resize, .urd-edit-rotate, .urd-edit-stop, .urd-edit-readout, .urd-sticky-badge, .urd-mobile-pin, .urd-phone-words, .urd-hint-chip, .urd-hint-card, .urd-phone-num, .urd-block-ruler, dialog';

/**
 * The height the block's content needs, in the block's own px, measured on the content children.
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
 * The height a block's content takes when the box leaves it its own, in the block's px (ADR-0025); demo content is measured too.
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
 * The height the open `<details>` of a block add beyond their summaries, in the block's px: view state, never the design.
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
  // A text drawn as questions stands open in the editor, so what lies between one question's row and the next counts as unfolded.
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
 * The editor's own parts inside a block, which the push and the fit leave out; base.css hides the same list under `.urd-fit-measure`.
 */
export const EDITOR_ONLY = '.urd-collection-image-adder, .urd-product-adder, .urd-collection-placeholder:empty, .urd-cal-gone';

/**
 * Runs a measure of a block as a visitor sees it: with the editor's own parts hidden for the length of the call, when the block holds any.
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
 * A block's heights as a visitor sees it, without the editor's own parts: `natural` with what is unfolded, `resting` without it.
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
 * Whether a block that follows its content is drawn at it; one still loading holds the frame's height.
 * @param {HTMLElement} el The block element
 * @returns {boolean}
 */
export function drawsAtContent(el) {
  return !el.querySelector('[aria-busy="true"]');
}

/**
 * The height a block that follows its content is drawn at, or 0 to keep its frame's.
 * @param {HTMLElement} el The block element
 * @returns {number}
 */
export function hugHeight(el) {
  return drawsAtContent(el) ? naturalHeight(el) : 0;
}

/**
 * Writes a section's design height for the push pass from the section data, as renderSection does.
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
 * Runs the push pass again for the section a block stands in, for a block whose content took a new shape after it was drawn (blocks/text.js).
 * @param {HTMLElement} el The block element
 */
export function pushAgain(el) {
  const host = el.closest('.urd-section');
  if (host?._urdPushSection) schedulePush(host);
}

/**
 * Wires the push pass for a freshly drawn desktop section: a first pass, and a ResizeObserver on every block that runs it before paint.
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
    // A block that follows its content is watched through its content alone, since the pass writes its box at every change.
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
 * Editing that writes geometry is starting: the push pass stands still until resumePush pushes again from the new frames.
 */
export function suspendPush() {
  pushSuspended += 1;
}

/**
 * The push shift a block is drawn with, in px (0 without a push): the distance between its frame's y and its drawn top.
 * @param {HTMLElement} el The block element
 * @returns {number}
 */
export function pushShiftOf(el) {
  return Number.parseFloat(el?.dataset?.urdShift ?? '0') || 0;
}

/**
 * The height the last push pass drew a block at, or 0 when that was its frame's.
 * @param {HTMLElement} el
 * @returns {number}
 */
export function pushDrawnOf(el) {
  return Number.parseFloat(el?.dataset?.urdDrawn ?? '0') || 0;
}

/**
 * The growth past its frame the last push pass measured for a block, in px, as a visitor sees it; 0 when its content fits.
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
    // A block with a phone design that a gesture took across its width's line is drawn again after the gesture (watchPhoneDesign).
    requestAnimationFrame(() => {
      for (const host of pushHosts) for (const el of host.querySelectorAll('.urd-block')) if (el._urdPhone) redrawForWidth(el);
    });
  }
}

/**
 * The inline min-height of a desktop section: the stored size, or the blocks' extent; always a plain CSS length.
 * @param {object} section The section data
 * @param {number} maxBottomPx The lowest block edge in px
 * @returns {string}
 */
export function sectionMinHeight(section, maxBottomPx) {
  return section.size?.minHeight ?? `${maxBottomPx}px`;
}

export function applyFrameCss(el, frame, floorPx = 0) {
  Object.assign(el.style, frameToCss(frame, floorPx));
  // The rotation as a custom property too, so the editing chrome can turn itself back upright.
  el.style.setProperty('--urd-block-rot', `${frame.rot || 0}deg`);
}

/**
 * Translates a frame to CSS positioning.
 * @param {{x: number, y: number, w: number, h: number, z?: number, rot?: number}} frame
 * @returns {{left: string, top: string, width: string, height: string, zIndex: string, transform: string}}
 */
export function frameToCss(frame, floorPx = 0) {
  // A width floor: the frame never gets narrower than the floor, capped at the canvas's right edge.
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
 * Whether a block's height on the phone follows its content in the row grid: text, the terms of sale, and types that say so (autoGrow).
 * @param {{type?: string, props?: object}} block
 * @param {{autoGrow?: boolean|((props: object) => boolean)}|undefined} def
 * @returns {boolean}
 */
export function autoGrows(block, def) {
  if (block?.type === 'text' || block?.type === 'terms') return true;
  return typeof def?.autoGrow === 'function' ? Boolean(def.autoGrow(block.props ?? {})) : Boolean(def?.autoGrow);
}

/** Whether a block's words are measured by the desktop's «Force readable text» (ADR-0034 decision 3): a text block in its plain design. */
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
 * Watches the window width under which a section shows its phone layout, so it is drawn again as the window crosses it.
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
 * The place in the row grid of what stands in cells: its grid columns, and its inner edges half the space between blocks in.
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
 * Translates a mobile placement (frames.mobile) to CSS for the row grid (ADR-0019): followed, overridden, pinned to rows or in cells.
 * @param {{x?: number, w?: number, row?: number, rows?: number, col?: number, cols?: number, height?: number, space?: number, z?: number, rot?: number}|null} placement
 * @param {{x: number, y: number, w: number, h: number, z?: number, rot?: number}} desktop The block's desktop frame
 * @param {{autoGrow?: boolean, gap?: number, byWidth?: boolean, designWidth?: number}} [opts] autoGrow: a block of natural height; gap: the space under a flowing block in px; byWidth: a block sized by its frame, its percent of designWidth
 * @returns {object} Style map for Object.assign(el.style, ...)
 */
export function mobilePlacementToCss(placement, desktop, opts = {}) {
  const css = {};
  // z and rot both fall back to the desktop frame: the placement overrides only the fields it actually contains.
  const rot = placement?.rot ?? desktop.rot;
  if (rot) css.transform = `rotate(${rot}deg)`;
  const z = placement?.z ?? desktop.z;
  if (z != null) css.zIndex = String(z);

  const cells = phoneCells(placement);
  if (Number.isFinite(placement?.row)) {
    // Pinned: explicit row tracks; without `rows` the span is derived from the desktop height.
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

  // Flowing: auto-placed, partial overrides applying only to the fields present.
  // Its own room above it, taking no more than the gap.
  const gap = Number.isFinite(opts.gap) ? opts.gap : MOBILE_GAP;
  const space = Math.max(phoneSpace(placement), -gap);
  if (space) css.marginTop = `${space}px`;
  if (cells) {
    css.width = '100%';
  } else {
    if (placement?.w != null) css.width = `${placement.w}%`;
    if (placement?.x != null) {
      css.marginLeft = `${placement.x}%`;
      css.justifySelf = 'start';
    }
  }
  // The block's own height on the phone stands in the desktop height's place.
  const own = phoneHeight(placement);
  // A block whose size is its frame, in cells narrower than the row, keeps its desktop shape until it has a height of its own.
  const shape = !own && cells && opts.byWidth && opts.designWidth > 0 && desktop.w > 0 && desktop.h > 0
    ? (desktop.w / 100) * opts.designWidth / desktop.h : 0;
  if (shape) {
    css.aspectRatio = String(Math.round(shape * 1000) / 1000);
  } else if (opts.autoGrow && !(own && opts.byWidth)) {
    // Its content's height, or at least its own height on the phone; a picture or a film with a shape takes its own height whole.
    if (own) css.minHeight = `${own}px`;
  } else if (cells) {
    // In a cell the block is no grid item: its height, the cell growing to its blocks.
    css.height = `${own ?? desktop.h}px`;
  } else {
    // A fixed height: the span holds the block, its room above it and the gap under it, at most the standard gap.
    const height = own ?? desktop.h;
    css.height = `${height}px`;
    css.gridRow = `auto / span ${Math.max(1, Math.ceil((height + Math.min(gap, MOBILE_GAP) + space) / MOBILE_ROW))}`;
  }
  return css;
}

/**
 * Renders a whole page into root.
 * Each section gets its own <section> element, so renderSection can rerender a single section alone later.
 * @param {object} page Page file (content/pages/*.json), already parsed
 * @param {object} site site.json
 * @param {HTMLElement} root
 * @param {{preview?: boolean, viewport?: 'desktop'|'mobile'}} [opts]
 */
export function renderPage(page, site, root, opts = {}) {
  root.replaceChildren();
  // The scrollbar's width and the side menu's column are read once, before the sections are added, rather than by each section while the page grows.
  const gutter = window.innerWidth - document.documentElement.clientWidth;
  const side = sideColumn();
  page.sections.forEach((section, i) => {
    const host = document.createElement('section');
    root.appendChild(host);
    // The first section is the first screen: its pictures load at once and first (`first`).
    renderSection(section, site, host, { ...opts, first: i === 0, gutter, side });
  });
  // The "+ New section" bars between sections (preview only).
  if (opts.preview) window.UrdPreviewEdit?.enhancePage(root, page, site);
  // Sticky blocks are remeasured (a re-render may have changed heights/fields).
  feature('sticky')?.refreshSticky();
}

/**
 * The spots of a section a link can land on beyond its own id: its name, each drawn block's name, and the hidden blocks' ids and names.
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
 * Draws a spot a link can land on as a zero-size marker at the top of `host`; an id already on the page is left where it is.
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

/** The width a side menu's column takes beside the page, in px, as nav.js sets it; 0 without one. */
function sideColumn() {
  const body = document.body;
  if (!body.classList.contains('urd-side-left') && !body.classList.contains('urd-side-right')) return 0;
  return parseFloat(getComputedStyle(body).getPropertyValue('--urd-nav-side-width')) || 250;
}

/**
 * Renders a single section anew; one too narrow for its words on the desktop shows its phone layout (phoneHandoff, ADR-0034).
 *
 * @param {object} section Section data
 * @param {object} site site.json
 * @param {HTMLElement} host The section element (cleared and rebuilt)
 * @param {{preview?: boolean, viewport?: 'desktop'|'mobile', measure?: boolean}} [opts] `measure`: a copy drawn out of sight only to be measured, as the preview draws its blocks but without the editing layer or animations
 */
export function renderSection(section, site, host, opts = {}) {
  const Urd = window.Urd;
  const grid = section.grid ?? site.grid;
  const asked = opts.viewport ?? 'desktop';
  // A copy drawn to be measured keeps the view it is asked for.
  const handoff = asked === 'desktop' && !opts.measure ? phoneHandoff(section, site, measuredText, opts.gutter ?? window.innerWidth - document.documentElement.clientWidth, opts.side ?? sideColumn()) : 0;
  watchHandoff(host, handoff, () => {
    // In the editor the editor sends the section again, since what has been typed since it was drawn lives in its draft.
    if (opts.preview) window.parent?.postMessage({ type: 'urd-redraw-section', sectionId: section.id }, location.origin);
    else renderSection(section, site, host, { ...opts, gutter: undefined, side: undefined, arriving: false });
  });
  const viewport = handoff && window.matchMedia(`(max-width: ${handoff}px)`).matches ? 'mobile' : asked;
  // `handoff`: a section showing its phone layout on a desktop page keeps the desktop's measure on its texts.
  const ctx = { site, section, grid, viewport, handoff: viewport !== asked, preview: Boolean(opts.preview || opts.measure), measure: Boolean(opts.measure), first: Boolean(opts.first) };

  host.className = 'urd-section';
  host.dataset.sectionId = section.id;
  host.classList.toggle('urd-handoff', viewport !== asked);
  if (handoff) host.dataset.urdHandoff = String(handoff);
  else delete host.dataset.urdHandoff;
  // The DOM id makes the section a spot a link lands on by its id; a name is a marker drawn further down.
  if (typeof section.id === 'string' && section.id) host.id = section.id;
  const spots = anchorTargets(section, viewport);
  // Ready-made section theme (role set, additive field): overrides the section's color tokens on host, the blocks inherit them.
  // Resets on Standard/absence.
  applySectionTheme(host, section.theme);
  host.replaceChildren();

  // The pictures of a section below the first wait until it comes near; a later drawing draws them at once.
  renderBackgroundLayers(host, section.background, { later: Boolean(opts.arriving) && !opts.first && !ctx.preview, first: Boolean(opts.first) && !ctx.preview });

  // The shape dividers: over the background, under the content.
  const dividers = feature('divider');
  for (const edge of ['top', 'bottom']) {
    const divider = dividers?.sectionDivider(section.divider?.[edge]);
    if (!divider) continue;
    const el = document.createElement('div');
    el.className = `urd-divider urd-divider-${edge}${divider.flip ? ' urd-divider-flip' : ''}`;
    el.style.setProperty('--urd-divider-h', `${divider.height}px`);
    // A token is the page's own colour (the base copy), so a divider in a themed section still shows against it.
    el.style.color = section.theme && /^[a-z][a-z0-9-]*$/.test(divider.color)
      ? `var(--urd-base-${divider.color}, var(--urd-color-${divider.color}))`
      : resolveColor(divider.color);
    el.innerHTML = dividers.dividerSvg(divider);
    host.appendChild(el);
  }

  // The content surface (ADR-0018): the canvas binds the content to the design width; its width is set in base.css.
  const canvas = document.createElement('div');
  canvas.className = 'urd-canvas';
  // Per-section override: 'full' unbinds the content from the design width, and a CSS length gives the section a width of its own.
  const secWidth = section.size?.maxWidth;
  if (secWidth) canvas.style.setProperty('--urd-canvas-w', secWidth === 'full' ? '100%' : secWidth);
  // The width the canvas has at the design width, for the proportional shrink (fitContent); none where nothing has a design size.
  const siteW = typeof site.layout?.contentWidth === 'number' ? site.layout.contentWidth : 0;
  const secPx = typeof secWidth === 'string' && /^\d+(\.\d+)?px$/.test(secWidth) ? parseFloat(secWidth) : 0;
  canvas._urdDesignW = !secWidth ? siteW : secPx ? (siteW ? Math.min(secPx, siteW) : secPx) : 0;
  host.appendChild(canvas);

  if (viewport === 'mobile') {
    // The mobile row grid (ADR-0019): untouched blocks auto-placed in reading order, pinned ones on explicit row tracks.
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
    // The blocks pinned on the phone while the page scrolls, by their pinning group, the group's first block speaking for it.
    const pins = feature('sticky');
    const leads = pins?.stickyLeads(section.blocks);
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
      // The decor mark is read by the stagger animation (decor is ornament and must not delay the content wave).
      if (block.decor) el.dataset.decor = '1';
      const key = block.sticky?.group || `solo-${block.id}`;
      const sticks = Boolean(block.sticky) && Boolean(pins?.pinsOnPhone(leads.get(key)));
      // A flowing block in cells joins a cell with the blocks before it in the same cells, or opens one.
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
      // Auto-growing blocks get natural height on the phone, since a fixed desktop height would clip taller content.
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
      // A block with a phone design stands in the flow before it is drawn, so its own width says whether it draws that design.
      const phone = hasPhoneDesign(block.type, block.props);
      if (phone) into.appendChild(el);
      const narrow = phone && isNarrowBlock(el, block, ctx);
      const drawn = drawnBlock(block, narrow);
      if (drawn !== block) place(autoGrows(drawn, Urd.blocks.get(block.type)));
      // A cell, a block pinned in cells or the slot of a block pinned while scrolling, holding words, stands across the row where too narrow (the floor in base.css).
      if (drawsWords(drawn, Urd)) el.dataset.urdWords = '1';
      if (pinned && own) el.dataset.cols = String(own.cols);
      if (cell) syncCellWords(cell);
      else if (pinned && own) el.classList.toggle('urd-cell-words', el.dataset.urdWords === '1');

      // A block with columns or cards lays itself out by its own width (base.css), and a block with its own height places its content in the box.
      if (followsWidth(drawn)) el.dataset.urdWidth = 'own';
      const align = heightAlign(drawn);
      if (align !== 'top') el.dataset.urdAlign = align;
      // A block that fetches its content stands at the height the editor measured at the phone width while it loads.
      const loadingH = mobileLoadingHeight(block);
      if (loadingH) el.style.setProperty('--urd-loading-h', `${Math.round(loadingH / drawnScale(phoneSized(block)))}px`);
      // Screen docking applies on mobile too; pinning while scrolling is the row grid's own on the phone (stickOnPhone).
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
        el.style.marginTop = '';
        // A block placed by hand stretches to its rows in the grid; in the holder it takes their height itself (placeStuck).
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
      // The decor mark is read by the stagger animation (decor is ornament and must not delay the content wave); the mobile flow filters on the field itself.
      if (block.decor) el.dataset.decor = '1';
      const frame = block.frames.desktop;
      applyFrameCss(el, frame, fitFloorPx(block, canvas._urdDesignW));
      // A block with a phone design stands on the canvas before it is drawn, so its own width says whether it draws that design.
      const phone = hasPhoneDesign(block.type, block.props);
      if (phone) canvas.appendChild(el);
      const narrow = phone && isNarrowBlock(el, block, ctx);
      const drawn = drawnBlock(block, narrow);
      // The push pass draws this block at its content's height (ADR-0025), and the editing layer stops a drag of its height there.
      if (followsContent(drawn)) el.dataset.urdHeight = 'content';
      const align = heightAlign(drawn);
      if (align !== 'top') el.dataset.urdAlign = align;
      if (followsWidth(drawn)) el.dataset.urdWidth = 'own';
      // Sticky (pin on scroll): only marked here; sticky.js pins the block on scroll.
      if (block.sticky && typeof block.sticky.offset === 'number') {
        el.classList.add('urd-sticky-able');
        el.dataset.stickyOffset = String(block.sticky.offset);
        el.dataset.stickyUntil = block.sticky.until ?? '';
        // Additive fields: mode ('screen' docks to the window), dock point and group id (blocks with the same id are pinned together).
        el.dataset.stickyMode = block.sticky.mode ?? 'scroll';
        el.dataset.stickyDock = block.sticky.dock ?? 'bottom-right';
        el.dataset.stickyGroup = block.sticky.group ?? '';
      }
      maxBottomPx = Math.max(maxBottomPx, frame.y + frame.h);
      renderBlock(Urd, el, block, ctx, narrow);
      canvas.appendChild(el);
      if (typeof block.id === 'string' && block.id) placeBlockSpots(el, block, spots.blocks.get(block.id));
    }

    // The section's height is the user's, or the blocks' extent where it has none; blocks may hang past it, as sections never clip.
    host.style.minHeight = sectionMinHeight(section, maxBottomPx);
    host.dataset.urdMinHeight = host.style.minHeight;
    wirePush(host, section, ctx.preview);
  }

  // The section's name, and on a phone the blocks hidden there, land on the section's top.
  for (const spot of spots.section) placeSpot(host, spot);

  // Optional section animation; the entrance and the pointer effect are independent and can be combined.
  renderAnimation(Urd, host, section.animation, ctx);
  renderAnimation(Urd, host, section.hover, ctx);

  // Mobile attention: editorial marking, preview only (visitors ignore the flag, see docs/SCHEMA.md#mobile-review).
  if (ctx.preview && section.responsive?.mobile?.attention?.needed) {
    host.classList.add('urd-attention');
  }

  // In preview mode the editing layer (drag/resize/delete) is attached after every render.
  // Set by urd.js; never present for visitors.
  if (ctx.preview && !ctx.measure) window.UrdPreviewEdit?.enhanceSection(host, section, grid);
  // Sticky blocks are remeasured (incremental rerender of a single section).
  feature('sticky')?.refreshSticky();
}

/** Shared block rendering with migration and placeholder fallback. */
function renderBlock(Urd, el, block, ctx, measured = null) {
  const def = Urd.blocks.get(block.type);
  const lifted = lift(block, def);
  if (lifted.ok) {
    try {
      // A block with a phone design draws it while it is narrow; on the phone the block reads its own words where it has some (ADR-0033).
      const phoneProps = ctx.viewport === 'mobile' ? liftPhoneWords(block, def, lifted.props) : null;
      const props = propsForViewport({ ...block, phoneProps }, lifted.props, ctx.viewport);
      const phone = hasPhoneDesign(block.type, props);
      const narrow = phone && (measured ?? isNarrowBlock(el, block, ctx));
      // In the editor the block is told the words the phone holds of its own (`phoneWords`), so a field emptied there still stands to be written in (blocks/audio.js).
      const blockCtx = ctx.preview && phoneProps ? { ...ctx, phoneWords: phoneProps } : ctx;
      def.render(el, propsForWidth(block.type, props, narrow), blockCtx);
      if (phone) watchPhoneDesign(el, { def, type: block.type, props, block, ctx: blockCtx, narrow });
      // Entrance animation and pointer effect are independent; cardwise blocks spread them onto their cards themselves (renderCardAnimations).
      const anim = feature('animations');
      if (anim) {
        const isPointer = (type) => Urd.animations.get(type)?.entrance === false;
        const hover = anim.pointerEffectOf(block, ctx.section, isPointer);
        // The entrance on this screen: none on a phone where the block switches it off there (entranceOf).
        const entrance = anim.entranceOf(block, ctx.viewport, isPointer);
        // A block with an entrance of its own comes in by it, never with the section's stagger, and stands at once where its entrance is off.
        if (block.animation?.type && Urd.animations.get(block.animation.type)?.entrance) el.dataset.urdEntrance = '1';
        if (!def.animPerCard) {
          renderAnimation(Urd, el, entrance, ctx);
          renderAnimation(Urd, el, hover, ctx);
        } else if (entrance?.type || hover?.type) {
          el.classList.add('urd-anim-cardwise');
        }
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
 * Whether a block is narrow (NARROW_PX), by its own width as its content has it; a block narrow before counts as wide again only 16 px past the line.
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

/* The blocks drawn in a phone design or watched for one; one observer for every block, which draws again in the next frame. */
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
 * A watched block drawn again when its width has crossed the line: the editor is asked in the preview, the content made anew on the page.
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
      const { gridRow, gridColumn, justifySelf, marginTop, ...own } = css;
      Object.assign(slot.style, { gridRow: gridRow ?? '', gridColumn: gridColumn ?? '', justifySelf: justifySelf ?? '', width: css.width ?? '', marginTop: marginTop ?? '', marginLeft: css.marginLeft ?? '', marginRight: css.marginRight ?? '' });
      Object.assign(el.style, { ...own, marginTop: '' });
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
 * Cardwise animation: the block's animation and hover fields spread onto its cards, called by the block once the cards are built.
 */
export function renderCardAnimations(el, cards, block, ctx) {
  const anim = feature('animations');
  if (!window.Urd || !anim) return;
  const isPointer = (type) => window.Urd.animations.get(type)?.entrance === false;
  const hover = anim.pointerEffectOf(block, ctx?.section, isPointer);
  for (const animation of [anim.entranceOf(block, ctx?.viewport, isPointer), hover]) {
    renderAnimation(window.Urd, el, animation, ctx,
      (target, type, props, def, c) => anim.applyCardAnimation(target, cards, type, props, def, c));
  }
}

/**
 * Optional animation on a block or a section; an unknown or failing one, or one whose module is not in, shows the content unanimated.
 */
function renderAnimation(Urd, el, animation, ctx, apply = feature('animations')?.applyAnimation) {
  if (!animation?.type || ctx?.measure || !apply) return;
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
 * Neutral placeholder for unknown/failing blocks.
 * The data behind it is untouched; this is display only (see promise 2 and ADR-0005).
 * @param {HTMLElement} el
 * @param {string} type
 */
function renderPlaceholder(el, type) {
  el.classList.add('urd-placeholder');
  el.textContent = type;
  el.title = t('render.missingPlugin', { type });
}
