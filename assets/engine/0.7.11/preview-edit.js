/**
 * The editing layer for preview mode: drag, resize (with grid snapping) and
 * delete directly in the real page inside the editor's iframe.
 *
 * Loaded ONLY in preview mode (dynamic import in urd.js) - visitors never
 * load this file. Changes are reported to the editor, which owns the
 * draft:
 *   page → editor: { type: 'urd-move',   sectionId, blockId, frame, frameKey, coalesce?, groupKey? }  (frameKey 'mobile': frame is a row-grid placement, ADR-0019)
 *                  { type: 'urd-move-block-section', fromSectionId, toSectionId, blockId, frame, groupKey? }  (a block dropped in another section; groupKey joins the settle's moves in the source)
 *                  { type: 'urd-delete', sectionId, blockId | blockIds }  (blockIds: multi-selection in one undo step)
 *                  { type: 'urd-add-section', index, section }
 *                  { type: 'urd-move-section', sectionId, dir }
 *                  { type: 'urd-delete-section', sectionId }
 *                  { type: 'urd-duplicate-section', sectionId }
 *                  { type: 'urd-clipboard', clipboard, cut }  (a copy or a cut: the editor keeps it and hands it to the next page the preview loads)
 *                  urd-edit from a text block carries `caret`: the characters into the text where the change began, kept with the undo step
 *                  { type: 'urd-paste-section', afterId, section }  (the clipboard's section with fresh ids, below afterId, or last without one)
 *                  { type: 'urd-section-phone-room', sectionId, side, px }  (a seam's grip in the phone view: the room above ('top') or below ('bottom') the section's blocks on the phone, 0.7.3.26)
 *                  { type: 'urd-section-size', sectionId, minHeight, moves? }  (moves: a section the seam grip changed at its top moves all its blocks in the same undo step)
 *                  { type: 'urd-mobile-reset', sectionId, blockId? }  (reset mobile overrides; without blockId, the whole section)
 *                  { type: 'urd-edit-on-phone', sectionId }  (a section showing its phone layout in the desktop view, its words too narrow at this width: its bar's «Edit on the phone»)
 *                  { type: 'urd-phone-order', sectionId, blockId, change, coalesce? }  (a block moved one place in the phone's reading order, the change phone-moves.js settles it into: exceptions, stacks, the custom order or blocks taken out of the rule's columns; also a block taken out of its group, or the group undone, from the block's menu, and a set grouped or its groups undone from the phone's set bar, the menu or the keys; coalesce from the keys, a burst one undo step)
 *                  { type: 'urd-phone-layout', sectionId, change, preset?, follow? }  (a preset of «Phone layout» on the phone view's section bar: its cells and order, phone-layouts.js, `preset` its id, which asks for «Same height» after it; «Same width» there; or «Same height», the heights its lines are measured to, `follow` where they follow a preset as part of its step; or the phone's set bar's alignment, its cells, and the layer order of the blocks pinned on the phone, its `layers`)
 *                  { type: 'urd-hover-block', blockId }  (the block under the mouse, null for none: its row in the Phone panel's list is lit)
 *                  { type: 'urd-attention-cards', cards: [{ sectionId, rect }] }  (the sections that need a phone review in the phone view, where each stands in the canvas, for the editor to draw their cards beside the phone; sent when they change)
 *                  { type: 'urd-new-fitted', sectionId, blockId, w, h }  (a new block's box fitted to what it draws, the answer to urd-fit-new, once, as the block is shown: the fitted width in percent and height in px, or null for both where it was not fitted, add-fit.js)
 *                  { type: 'urd-phone-unpin', sectionId, blockId }  (a block pinned on the phone unpinned, from its bar or its menu: back into the phone's order, its cells kept, phone-moves.js unpinned)
 *                  { type: 'urd-phone-seen', sectionIds }  (the sections standing in the phone view's window, at least half of them or half the window, for the editor's phone check before publishing; sent as a section is drawn, and as a scroll changes the sections in sight)
 *                  { type: 'urd-too-narrow', screen }  (a drag, the key carry or a handle greys its block as too narrow for its words, ADR-0034: 'phone' or 'desktop' while it is greyed, null once it is not)
 *                  { type: 'urd-block-flag', sectionId, blockId, decor?, hideMobile?, hideDesktop? }
 *                  { type: 'urd-block-style', sectionId, blockId, fields }  (a pasted style's block-level fields: animation, hover, size and the phone's own, height, fit; null clears one)
 *                  { type: 'urd-section-menu', sectionId, rect }  (open the section's settings in the editor's floating menu: the gear on its bar and «Settings» in its right-click menu)
 *                  { type: 'urd-menu-area', area }  (1, 2 or 3 on a selected block: the editor's menu shows that area)
 *                  { type: 'urd-toggle-grid' }  (G on the page: the editor shows or hides the grid)
 *                  { type: 'urd-block-menu', sectionId, blockId, rect, group? }  (open the block menu in the editor; `group` opens one of its groups)
 *                  { type: 'urd-block-design', sectionId, blockId, phone? }  (open the design picker for a block with designs, from its toolbar; `phone` from the phone view, for its design on a phone)
 *                  { type: 'urd-block-bar', blockId, rect?, tools?, set? }  (in the phone view, the selected block's box in the canvas and its bar's tools, the tools only when they changed, each `disabled` where it greys, for the editor to draw the bar beside the phone; `set` true while they are a set's bar and the box the set's, 0.7.36.3; blockId null when no block's bar stands, 0.7.3.19.2)
 *                  { type: 'urd-section-bar', sectionId, rect?, tools? }  (the same for the section the mouse was last over, or put at work: its bar beside the phone, 0.7.3.23)
 *                  { type: 'urd-nav-bar', on, rect? }  (in the phone view, where the site's menu stands in the canvas while the mouse was last over it or it was last pressed: the editor draws the menu's size bar beside the phone, 0.7.3.25; on false takes it away)
 *                  { type: 'urd-ctx-menu', label, rows, at, editor, rest }  (in the phone view, a menu's rows for the editor to draw: at the point `at`, or under the ⋮ of the editor's bar `editor` names, 'block' or 'section'; `rest` leaves the focus where it is)
 *                  { type: 'urd-ctx-close' }, { type: 'urd-ctx-hold' }, { type: 'urd-ctx-hover', over }  (the phone view's menu closed by the page, a menu a rest opened held by a press on its ⋮, and the pointer on or off a ⋮ of the page's that opened one)
 */
import { applyFrameCss, mobilePlacementToCss, placeStuck, autoGrows, suspendPush, resumePush, pushShiftOf, pushDrawnOf, pushGrowthOf, pushPreview, hugHeight, contentHeight, drawsAtContent, visitorHeights, syncSectionHeight, drawnWidth, renderSection } from './render.js';
import { followsContent, fitMovesAll, FIT_BY_WIDTH, PHONE_DESIGNS, PHONE_WORDS, phoneWordsOf, forcesReadable, NARROW_PX, DRAWS_NOTHING, READABLE_PX } from './push-model.js';
import { MOBILE_ROW, PHONE_COLUMNS, phoneCells, phoneHeight, phoneRoomOf } from './migrate.js';
import { makeId } from './sections/presets.js';
import { cloneSectionForInsert, cloneBlocksForInsert } from './templates-model.js';
import { blocksClipboard, sectionClipboard, readClipboard, pastedSection } from './clipboard-model.js';
import { loadSearchLanguages, searchLanguagesReady, searchItemsAny } from './search-langs.js';
import { applicableLayouts, layoutFrames } from './section-layouts.js';
import { phoneLayouts, phoneLayoutChange, phoneLayoutSketch, phoneSameWidths } from './phone-layouts.js';
import { presetThumb } from './preset-thumb.js';
import { embedUrl } from './blocks/video.js';
import { calendarExamples, toggleCalendarExamples } from './blocks/calendar.js';
import { stackOrder, phoneSetupOf } from './phone-order.js';
import { phoneStep, hasPhonePlace, phoneTree, phoneDropAt, phoneAfterLine, phoneDropChange, phoneStackOf, phoneChangeApplied, phoneKeyDrops, leastWordsCols, phoneHeightSnap, phoneTooNarrow, phoneUngroup, phoneGroup, phoneUngroupAll, phoneAlignCells } from './phone-moves.js';
import { closeColorPicker } from './color-picker.js';
import { attachHint } from './hint.js';
import { closeDropdowns } from './dropdown.js';
import { clampSize, stepSize, LINE_HEIGHTS, stepIndent, matchFontStack } from './text-typo.js';
import { TEXT_BLOCKS, unwrap, stripDescendantProp, applyWholeStyle } from './text-whole.js';
import { frameAtPoint, toolbarAnchor, menuFit, shiftInto, flyoutFit } from './place.js';
import { seamDrag, phoneSeamDrag } from './section-size.js';
import { snapTolerance, edgeSnap, gapSnap, alignedLines, lockAxis, gridLookOf, gridLine } from './snap-model.js';
import { blocksInRect, alignMoves, distributeMoves, groupDelta } from './selection.js';
import { suspendSticky, resumeSticky, dockInset } from './sticky.js';
import { PALETTE_GROUPS, PALETTE_KINDS, EXTRA_GROUP_PICTURES, shopOn, recentKinds, rememberKind } from './block-palette.js';
import { styleOf, pasteStyle } from './block-style.js';
import { BLOCK_DESIGNS } from './block-designs.js';
import { pluginBlockDesigns } from './plugins.js';
import { nearestDock } from './sticky-model.js';
import { layerChanges, phoneLayerChanges } from './layer-order.js';
import { isAnchorName, resolveLink, linkAttrs, LINK_RELS } from './nav-model.js';
import { pathTo, nodeAt } from './caret-path.js';
// This module is loaded dynamically by urd.js AFTER the admin dictionary
// is loaded (initAdminLocale), so ta() is safe even at module level here.
import { ta, adminLang } from './i18n.js';
import { barTools, SECTION_TOOLS, BAR_CHOICES, TOOL_FORMS, AREA_LOOKS, BAR_ICONS } from './bar-tools.js';
import { textDesign } from './doc-look.js';
import { addedFloor, narrowestWidth, fittedFrame, pluginFits, DRAWS_LATE } from './add-fit.js';

/**
 * The event's target as an Element. The editing chrome draws its icons as
 * inline SVG, and an SVGElement is not an HTMLElement, so the guards that
 * ask which piece of chrome was hit are reached from inside an icon too.
 * @param {Event} event
 * @returns {Element | null}
 */
function eventTarget(event) {
  return event.target instanceof Element ? event.target : null;
}

/** The text a block lets the owner type in on the canvas, whichever editing mode it asked for. */
const EDITABLE_TEXT = '[contenteditable="true"], [contenteditable="plaintext-only"]';

/**
 * Writes in a block's words where a press was (x, y in the page's px), as a press released without a drag on a block not yet selected asks: the words the press began on (`pressed`), else those under it, else the block's first, take the focus, and the caret stands at the press through the standard caret at a point (caretPositionFromPoint), or at the end of the words where the browser has no such thing.
 * @param {HTMLElement} el The block element
 * @param {number} x
 * @param {number} y
 * @param {Element|null} [pressed]
 */
function writeAt(el, x, y, pressed = null) {
  const under = pressed?.isConnected && el.contains(pressed) ? pressed : document.elementFromPoint(x, y)?.closest(EDITABLE_TEXT);
  const field = under && el.contains(under) ? under : el.querySelector(EDITABLE_TEXT);
  if (!field) return;
  field.focus({ preventScroll: true });
  const range = document.createRange();
  const at = typeof document.caretPositionFromPoint === 'function' ? document.caretPositionFromPoint(x, y) : null;
  if (at && field.contains(at.offsetNode)) range.setStart(at.offsetNode, at.offset);
  else {
    range.selectNodeContents(field);
    range.collapse(false);
  }
  range.collapse(true);
  const selection = window.getSelection();
  selection?.removeAllRanges();
  selection?.addRange(range);
}

/** The layer order: puts the block in front of the section's other blocks or behind them all (the toolbar's arrows, the right-click menu and the keys; layer-order.js). */
function bumpBlockZ(host, section, block, el, dir) {
  const changes = layerChanges(section.blocks, block.id, dir);
  for (const other of section.blocks) {
    if (!changes.has(other.id)) continue;
    const frame = { ...other.frames.desktop, z: changes.get(other.id) };
    other.frames.desktop = frame;
    const node = other.id === block.id ? el : host.querySelector(`[data-block-id="${other.id}"]`);
    node?.style.setProperty('z-index', String(frame.z));
    // groupKey collects the whole reordering into ONE undo step in the editor.
    post({ type: 'urd-move', sectionId: section.id, blockId: other.id, frame, coalesce: true, groupKey: `z-${block.id}` });
  }
}

/** The layer order on the phone: the pinned blocks among `ids` put in front of the section's other pinned blocks there, or behind them all (layer-order.js phoneLayerChanges), the desktop's order left as it is; one undo step. */
function bumpPhoneZ(section, ids, dir) {
  const layers = Object.fromEntries(phoneLayerChanges(section.blocks, ids, dir));
  if (Object.keys(layers).length) post({ type: 'urd-phone-layout', sectionId: section.id, change: { layers } });
}

/** The set made one stack on the phone (phone-moves.js phoneGroup), one undo step; the set stays selected. */
function groupOnPhone(section, ids) {
  const change = phoneGroup(section.blocks, phoneSetupOf(section), ids);
  if (change) post({ type: 'urd-phone-order', sectionId: section.id, blockId: ids[0], change });
}

/** The groups the set, or the selected block, stands in on the phone taken apart whole (phoneUngroupAll), one undo step. */
function ungroupOnPhone(section, ids) {
  const change = phoneUngroupAll(section.blocks, phoneSetupOf(section), ids);
  if (change) post({ type: 'urd-phone-order', sectionId: section.id, blockId: ids[0], change });
}

/** The set's blocks in cells moved to one side of the phone's row, each keeping its width (phoneAlignCells), one undo step. */
function alignOnPhone(section, ids, side) {
  const change = phoneAlignCells(section.blocks, phoneSetupOf(section), ids, side);
  if (change) post({ type: 'urd-phone-layout', sectionId: section.id, change });
}

/** Whether a block has designs to choose among: the calendar's, a core block's in the catalogue (block-designs.js), or a plugin block's (the design contract). */
function hasDesigns(block) {
  if (block.type === 'calendar' || BLOCK_DESIGNS[block.type]) return true;
  const def = window.Urd.blocks.get(block.type);
  return Boolean(def?.fromPlugin && pluginBlockDesigns(def, ta));
}

/** The design picker in the editor, for the block (the toolbar's design button beside the gear); `phone` asks for the design it draws on a phone (the phone view's button). */
function openBlockDesign(el, section, block, phone = false) {
  // The small window (Urd settings «Design button on the bar», the default) opens the design beside the block as a small panel of its pictures, as the bar's tools open their groups; the full window, and a phone design always, open the picker.
  if (!phone && barChoice(BAR_CHOICES.design) === 'small') {
    openBlockTool(el, section, block, 'look:design', ta('lbl.design'), 'design');
    return;
  }
  selectBlock(el);
  post({ type: 'urd-block-design', sectionId: section.id, blockId: block.id, ...(phone ? { phone: true } : {}) });
}

const GEAR_SVG = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3.2"/><path d="M19 12a7 7 0 0 0-.1-1.2l2-1.5-2-3.4-2.3 1a7 7 0 0 0-2-1.2L14.2 3h-4l-.4 2.7a7 7 0 0 0-2 1.2l-2.3-1-2 3.4 2 1.5a7 7 0 0 0 0 2.4l-2 1.5 2 3.4 2.3-1a7 7 0 0 0 2 1.2l.4 2.7h4l.4-2.7a7 7 0 0 0 2-1.2l2.3 1 2-3.4-2-1.5c.06-.4.1-.8.1-1.2z"/></svg>';

/** The toolbar's design button: the block's designs one press away, in the picker or in a small panel as Urd settings «Design button on the bar» asks; in the phone view its design on a phone. */
function designButton(el, section, block, phone) {
  const btn = document.createElement('button');
  btn.className = 'urd-edit-design';
  btn.dataset.cap = ta('canvas.cap.design');
  btn.innerHTML = BAR_ICONS.design;
  btn.title = ta(phone ? 'canvas.blockPhoneDesign' : 'canvas.blockDesign');
  btn.setAttribute('aria-label', btn.title);
  // Without the stop, pointerdown would bubble to the document's selection listener, which can draw the section again before the click (the same guard as the gear).
  btn.addEventListener('pointerdown', (event) => event.stopPropagation());
  btn.addEventListener('click', () => openBlockDesign(el, section, block, phone));
  return opensMenu(btn);
}

/**
 * The bar on a block and on a section, in the form Urd settings «Toolbar» chooses (ADR-0030, kept in the shared localStorage and read at every draw):
 * `groups` (the default) every group of the block's menu as a tool (bar-tools.js), each opening that group alone in a small panel, and ⋮; `full` every action on the bar; `panels` a word for the main act, then tools that each open a small panel of their group in the editor, and ⋮;
 * `short` the block's own one-press acts and the gear, with ⋮ opening the right-click menu that holds the rest.
 */
/** A choice of the bar as stored in the shared localStorage (BAR_CHOICES in bar-tools.js), its first option where none is stored or storage is closed. */
function barChoice({ key, options }) {
  try {
    const v = localStorage.getItem(key);
    return options.includes(v) ? v : options[0];
  } catch {
    return options[0];
  }
}
const barForm = () => barChoice(BAR_CHOICES.form);
/** Whether the gear stands on a bar whose tools open the settings themselves (Urd settings «Settings gear on the bar», on by default). */
const barGear = () => barChoice(BAR_CHOICES.gear) === 'on';
/** Whether the phone button (shown or hidden on phones) stands on a bar that leaves it to the right-click menu (Urd settings «Phone button on the bar», shown by default). */
const barPhone = () => barChoice(BAR_CHOICES.phone) === 'on';
/** How large the bar is drawn (Urd settings «Toolbar size»): its class, which base.css sizes the bar by. */
const barSize = () => barChoice(BAR_CHOICES.size);
/** Whether the phone view's bars and their menus are drawn by the editor beside the phone (Urd settings «Bars in the phone view»: beside the phone, or both, where the page keeps its own bars as well), or stand on the page alone as on the desktop, as they do by default. */
const phoneBars = () => isMobile() && barChoice(BAR_CHOICES.place) !== 'canvas';

/**
 * The bar's look (Urd settings «Toolbar look», kept in the shared localStorage and read at every draw): the class `urd-bar-<look>` on the toolbar, which base.css draws.
 * The area looks set the tools apart by Content, Style and Placement, so they hold only for the bar of tools; another form takes the plain look in their place.
 */
function barLook(form = barForm()) {
  const v = barChoice(BAR_CHOICES.look);
  return !TOOL_FORMS.includes(form) && AREA_LOOKS[v] ? AREA_LOOKS[v] : v;
}

/**
 * The tools of a bar whose tools belong to the menu's areas, placed in it: in a cluster of their area where the look sets the areas apart, else in a row.
 * Returns the function that places one tool by its area.
 */
function toolPlacer(barBody, look) {
  const clustered = look === 'areas' || look === 'capsule-areas';
  const clusters = new Map();
  return (btn, area) => {
    if (!clustered) { barBody.appendChild(btn); return; }
    if (!clusters.has(area)) {
      const cluster = document.createElement('span');
      cluster.className = `urd-bar-cluster urd-bar-${area}`;
      clusters.set(area, cluster);
      barBody.appendChild(cluster);
    }
    clusters.get(area).appendChild(btn);
  };
}

/** The calendar's example events: a calendar with three events in it. */
const EXAMPLES_SVG = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/><circle cx="8" cy="15" r="0.9" fill="currentColor"/><circle cx="12" cy="15" r="0.9" fill="currentColor"/><circle cx="16" cy="15" r="0.9" fill="currentColor"/></svg>';

const MORE_SVG = '<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>';

/** A bar button: its drawing or its words, its tooltip and name, and what a press does; the pointerdown stops, so the document's selection listener never draws the section anew under the press. */
function barButton(content, title, run, className = '', cap = '') {
  const btn = document.createElement('button');
  btn.type = 'button';
  if (className) btn.className = className;
  if (cap) btn.dataset.cap = cap;
  if (content.startsWith('<svg')) btn.innerHTML = content;
  else btn.textContent = content;
  btn.title = title;
  btn.setAttribute('aria-label', title);
  btn.addEventListener('pointerdown', (event) => event.stopPropagation());
  btn.addEventListener('click', run);
  return btn;
}

/**
 * The ⋮ of the shorter bars: the right-click menu of the block or the section, opened under it.
 * A mouse resting on it, with no button held, opens the menu without taking the focus or changing the selection, and the menu closes a moment after the mouse leaves the ⋮ and the menu, or at Escape (showContextMenu); a press opens it with the block or the section selected and the focus on its first item, keeps a menu the rest opened the same way, and closes one it opened.
 * It carries no tooltip, since it opens on a rest; its name stands in its aria-label.
 */
function moreButton(open) {
  const btn = barButton(MORE_SVG, ta('canvas.bar.more'), () => {
    clearTimeout(restTimer);
    // In the phone view the menu stands in the editor (showPhoneMenu): a press holds a menu a rest opened, and closes one it opened.
    if (phoneMenu?.from?.button === btn) {
      if (phoneMenu.from.rest) holdPhoneMenu();
      else closeContextMenu(false);
      return;
    }
    if (contextMenu?.from?.button === btn) {
      if (contextMenu.from.rest) {
        const { menu } = contextMenu;
        contextMenu.from.rest = false;
        contextMenu.from.select?.();
        menu.querySelector('[role="menuitem"]')?.focus();
      } else closeContextMenu();
      return;
    }
    const r = btn.getBoundingClientRect();
    open(r.left, r.bottom + 4, { button: btn, rest: false });
  }, 'urd-edit-more', ta('canvas.cap.more'));
  btn.removeAttribute('title');
  btn.setAttribute('aria-haspopup', 'menu');
  // The ⋮ of a bar the editor draws in the phone view opens the menu from there, by a press or a rest, under that bar's ⋮ (pressPhoneBar).
  btn._urdMenu = (rest, bar = 'block') => open(0, 0, { button: btn, rest, editor: bar });
  let restTimer = 0;
  btn.addEventListener('pointerenter', (event) => {
    if (event.pointerType !== 'mouse' || event.buttons) return;
    if (phoneMenu?.from?.button === btn) {
      post({ type: 'urd-ctx-hover', over: true });
      return;
    }
    if (contextMenu?.from?.button === btn) {
      contextMenu.hover.button = true;
      contextMenu.stay();
      return;
    }
    clearTimeout(restTimer);
    restTimer = setTimeout(() => {
      if (!btn.isConnected || contextMenu?.from?.button === btn || phoneMenu?.from?.button === btn) return;
      const r = btn.getBoundingClientRect();
      open(r.left, r.bottom + 4, { button: btn, rest: true });
    }, 180);
  });
  btn.addEventListener('pointerleave', (event) => {
    if (event.pointerType !== 'mouse') return;
    clearTimeout(restTimer);
    if (phoneMenu?.from?.button === btn) post({ type: 'urd-ctx-hover', over: false });
    if (contextMenu?.from?.button !== btn) return;
    contextMenu.hover.button = false;
    contextMenu.leaveSoon();
  });
  return btn;
}

/** A button of the bar that opens the editor's menu or one of its small windows: a press on it leaves the menu standing open to the editor, which opens the tool's group inside it or closes it as the press asks (the editor's state/preview.svelte.js). */
const opensMenu = (btn) => {
  btn.dataset.opensMenu = '';
  return btn;
};

/** A tool of the bar with small panels: the editor opens the block's or the section's menu beside it narrowed to one group (`only`). */
function openBlockTool(el, section, block, only, title = '', icon = '') {
  selectBlock(el);
  const r = el.getBoundingClientRect();
  post({ type: 'urd-block-menu', sectionId: section.id, blockId: block.id, only, title, icon, rect: { left: r.left, top: r.top, right: r.right, bottom: r.bottom } });
}

/** The toolbar's gear: the block's menu in the editor, opened at the block. */
function menuButton(el, section, block) {
  const btn = document.createElement('button');
  btn.dataset.cap = ta('canvas.cap.settings');
  btn.innerHTML = GEAR_SVG;
  btn.title = ta('canvas.blockMenu');
  // Without the stop, pointerdown would bubble to the document's selection
  // listener, which can trigger a re-render (section activation) BEFORE click
  // fires - and then the button is swapped out mid-click (the same guard as
  // the handles).
  btn.addEventListener('pointerdown', (event) => event.stopPropagation());
  btn.addEventListener('click', () => openBlockSettings(el, section, block));
  return opensMenu(btn);
}

/** The block menu in the editor, opened at the block (the toolbar's gear and the right-click menu's «Settings»). */
function openBlockSettings(el, section, block) {
  selectBlock(el);
  const r = el.getBoundingClientRect();
  post({ type: 'urd-block-menu', sectionId: section.id, blockId: block.id, rect: { left: r.left, top: r.top, right: r.right, bottom: r.bottom } });
}

/* The style clipboard (block-style.js): one copied look for the session,
   pasted onto a block of the same type whole, onto another type as the
   shared fields. */
let styleClipboard = null;

function copyBlockStyle(block) {
  styleClipboard = styleOf(block);
}

function pasteBlockStyle(section, block) {
  if (!styleClipboard) return;
  const next = pasteStyle(block, styleClipboard);
  if (next.props) {
    block.props = next.props;
    post({ type: 'urd-edit', sectionId: section.id, blockId: block.id, props: block.props, rerender: true });
  }
  post({ type: 'urd-block-style', sectionId: section.id, blockId: block.id, fields: next.shared });
}

/* The right-click menu (0.7.20.8, proposal N on the Design canvas): a narrow
   menu at the pointer, or at the block or section when opened from the
   keyboard (the context-menu key or Shift+F10). On a block it has «Settings»
   first and the block's actions after it, on a section's surface the
   section's actions, each with its key where it has one. One menu at a
   time; Escape closes it and gives the focus back to where it was opened.
   The APG menu pattern: role="menu", the arrow keys walk the items, Home
   and End jump. */
let contextMenu = null;

function closeContextMenu(returnFocus = true) {
  if (phoneMenu) {
    phoneMenu = null;
    post({ type: 'urd-ctx-close' });
  }
  if (!contextMenu) return;
  const { el, menu, cleanup } = contextMenu;
  contextMenu = null;
  cleanup();
  menu.remove();
  if (returnFocus && el.isConnected) {
    if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
    el.focus({ preventScroll: true });
  }
}

/*
 * The phone view's bar and menus, drawn by the editor over the stage beside the phone (0.7.3.19.2, editor/src/lib/CanvasBar.svelte), free of the page's edges and clear of the page.
 * The page keeps the selected block's bar, unseen (base.css), and tells the editor once a frame where the block stands and what its tools show (urd-block-bar); a press there presses the tool here (pressPhoneBar), so every tool acts as on the page.
 * A menu, the right-click one or a ⋮'s, is handed to the editor as its rows (urd-ctx-menu), and a row chosen there runs here (runPhoneMenu).
 */

/** The menu the editor shows for the phone view: its block or section, each row's action by its place, and the ⋮ that opened it as showContextMenu takes it. */
let phoneMenu = null;

/** The phone view's menu: its rows to the editor, at the point it was opened at, or under the editor's ⋮ where that opened it; a rest leaves the focus where it is. */
function showPhoneMenu(el, x, y, label, build, from) {
  const rows = [];
  const runs = [];
  const item = (text, key, run, opts = {}) => {
    const row = { text, key: key || '', run: runs.length, disabled: Boolean(opts.disabled), danger: Boolean(opts.danger), arm: opts.arm ?? '', first: false };
    rows.push(row);
    runs.push(run);
    // The callers mark the first row as the page's menu does (urd-ctx-first): the row Enter would take.
    return { classList: { add: (name) => { if (name === 'urd-ctx-first') row.first = true; } } };
  };
  const sep = () => rows.push({ sep: true });
  build(item, sep);
  phoneMenu = { el, runs, from };
  post({ type: 'urd-ctx-menu', label, rows, at: { x, y }, editor: from?.editor || false, rest: Boolean(from?.rest) });
  if (phoneMenuWired) return;
  // A scroll of the page, a press elsewhere on it and Escape close the editor's menu, as they close the page's own.
  phoneMenuWired = true;
  window.addEventListener('scroll', () => { if (phoneMenu) closeContextMenu(false); }, { passive: true, capture: true });
  document.addEventListener('pointerdown', (event) => {
    if (phoneMenu && !(event.target instanceof Node && phoneMenu.from?.button?.contains(event.target))) closeContextMenu(false);
  }, true);
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || !phoneMenu) return;
    event.preventDefault();
    event.stopPropagation();
    closeContextMenu(false);
  }, true);
}

/** Whether the page's own ways to close the editor's menu are set. */
let phoneMenuWired = false;

/** A menu a rest opened, pressed on its ⋮: it stays, with the focus on its first row, and the block or section it belongs to is selected. */
function holdPhoneMenu() {
  if (!phoneMenu?.from?.rest) return;
  phoneMenu.from.rest = false;
  phoneMenu.from.select?.();
  post({ type: 'urd-ctx-hold' });
}

/** A row of the phone view's menu chosen in the editor (urd-ctx-run): its action runs, and the menu is gone. */
export function runPhoneMenu(index) {
  const run = phoneMenu?.runs[index];
  phoneMenu = null;
  run?.();
}

/** The editor closed the phone view's menu without a choice (urd-ctx-closed); closed with a key, the focus goes back to the block or section it was opened on, as the page's own menu gives it back. */
export function phoneMenuClosed(focus = false) {
  const el = phoneMenu?.el;
  phoneMenu = null;
  if (!focus || !el?.isConnected) return;
  if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
  el.focus({ preventScroll: true });
}

/** The tools of a bar the editor draws in the phone view: a block's every tool but ⠿, whose drag the block's own surface gives there, or with a set the set bar's count and buttons (phoneSetBar); a section's every button, and its link name. */
const phoneBarTools = (el, kind = 'block') => (kind === 'section'
  ? [...el.querySelectorAll(':scope > .urd-section-toolbar :is(button, .urd-anchor-tag)')]
  : multiIds.size > 1 && phoneSetBar ? [...phoneSetBar._urd.body.querySelectorAll(':scope > :is(button, .urd-multi-count)')]
    : [...el.querySelectorAll(':scope > .urd-edit-toolbar .urd-bar-body button')].filter((b) => !b.classList.contains('urd-edit-move')));

/** A tool as the editor draws it: its drawing or its words, its name and tooltip, whether it is pressed (null for a tool with no such state), removes, is the ⋮ or the help chip, whether it opens the editor's menu, which a second press closes, whether it opens a pop-up of the page's own (the block menu, the layout picker, the hidden blocks), which a second press closes too, whether it is the section's link name or a set's count, words to read rather than a tool, and whether it is greyed. */
const toolOf = (btn) => ({
  html: btn.innerHTML.trim().startsWith('<svg') ? btn.innerHTML : '',
  text: btn.innerHTML.trim().startsWith('<svg') ? '' : btn.textContent.trim(),
  label: btn.getAttribute('aria-label') || btn.title || '',
  tip: btn.title || '',
  pressed: btn.hasAttribute('aria-pressed') ? btn.getAttribute('aria-pressed') === 'true' : null,
  danger: btn.classList.contains('urd-edit-delete') || btn.classList.contains('urd-sec-delete'),
  more: Boolean(btn._urdMenu),
  help: btn.classList.contains('urd-hint-chip'),
  opensMenu: btn.hasAttribute('data-opens-menu'),
  pagePop: btn.matches('.urd-sec-add-block, .urd-layout-btn, .urd-hidden-chip'),
  tag: btn.classList.contains('urd-anchor-tag') || btn.classList.contains('urd-multi-count'),
  disabled: Boolean(btn.disabled),
});

/** Each bar on the page as watched for changes, and how many it has had, so the editor is sent its tools again only when they change. */
const phoneBarWatch = { block: { bar: null, version: 0, observer: null }, section: { bar: null, version: 0, observer: null } };

/** The number of changes a bar has had since it was first watched, counted by a MutationObserver. */
function barVersion(kind, bar) {
  const watch = phoneBarWatch[kind];
  if (watch.bar !== bar) {
    watch.observer ??= new MutationObserver(() => { watch.version += 1; });
    watch.observer.disconnect();
    watch.observer.observe(bar, { subtree: true, childList: true, attributes: true, characterData: true });
    watch.bar = bar;
    watch.version += 1;
  }
  return watch.version;
}

/** The section whose bar the editor draws in the phone view: the last one the mouse was over on the page, kept while the mouse is off the page so its bar can be reached, or the section last put at work. */
let phoneBarSectionId = null;

let phoneBarFrame = 0;
/** What the editor was last told of each bar: its block or section and its bar as drawn, and its box. */
const phoneBarTold = { block: '', section: '' };
const phoneBarBox = { block: '', section: '' };

/** The box round a set's blocks as they stand in the window. */
function setBox(els) {
  const rects = els.map((el) => el.getBoundingClientRect());
  const left = Math.min(...rects.map((r) => r.left));
  const top = Math.min(...rects.map((r) => r.top));
  const right = Math.max(...rects.map((r) => r.right));
  const bottom = Math.max(...rects.map((r) => r.bottom));
  return { left, top, right, bottom, width: right - left, height: bottom - top };
}

/**
 * Tells the editor of one bar where its block or section stands in the canvas and what the bar holds, the tools only when they changed, or that none stands; true while it stands, or is only out of sight for the moment.
 * A set's bar is told as the block's, its box the set's, and marked as a set's (`set`).
 * @param {'block'|'section'} kind
 * @param {Element|null} el The selected block, or the section
 * @param {Element|null} bar Its bar on the page
 * @param {boolean} held The block is dragged, its bar out of the way
 * @param {Element[]|null} [set] The set's blocks, where the bar is the set's
 */
function tellPhoneBar(kind, el, bar, held = false, set = null) {
  const type = kind === 'section' ? 'urd-section-bar' : 'urd-block-bar';
  const key = kind === 'section' ? 'sectionId' : 'blockId';
  const id = kind === 'section' ? el?.dataset.sectionId : el?.dataset.blockId;
  const box = set ? setBox(set) : el?.getBoundingClientRect();
  const seen = box && (box.width || box.height) && box.bottom > 0 && box.top < window.innerHeight;
  if (!el || !bar || !seen || held) {
    if (phoneBarTold[kind]) post({ type, [key]: null });
    phoneBarTold[kind] = '';
    phoneBarBox[kind] = '';
    return Boolean(el);
  }
  const told = `${id}\n${barVersion(kind, bar)}`;
  const rect = { left: Math.round(box.left), top: Math.round(box.top), right: Math.round(box.right), bottom: Math.round(box.bottom) };
  const boxText = `${rect.left},${rect.top},${rect.right},${rect.bottom}`;
  if (told !== phoneBarTold[kind] || boxText !== phoneBarBox[kind]) {
    post({ type, [key]: id, rect, ...(told !== phoneBarTold[kind] ? { tools: phoneBarTools(el, kind).map(toolOf), set: Boolean(set) } : {}) });
    phoneBarTold[kind] = told;
    phoneBarBox[kind] = boxText;
  }
  return true;
}

/**
 * Tells the editor, once a frame in the phone view, of the two bars it draws beside the phone (urd-block-bar, urd-section-bar): the selected block's, gone while the block is dragged or scrolled out of the phone's window, and the set's bar in its place while a set stands (phoneSetBar); and the section's (phoneBarSectionId); both gone in the Clean view.
 * Run as the selection changes, the mouse goes over a section and a section is drawn; it stops itself when nothing is left to tell.
 */
export function watchPhoneBar() {
  if (phoneBarFrame) return;
  const tick = () => {
    phoneBarFrame = 0;
    const on = phoneBars() && !document.body.classList.contains('urd-chrome-off');
    const set = on && multiIds.size > 1 && phoneSetBar?.classList.contains('visible') ? selectedEls() : [];
    const block = on && selectedBlockId && (multiIds.size <= 1 || set.length > 1)
      ? document.querySelector(`.urd-block.urd-selected[data-block-id="${CSS.escape(selectedBlockId)}"]`)
      : null;
    const section = on
      ? (phoneBarSectionId ? document.querySelector(`.urd-section[data-section-id="${CSS.escape(phoneBarSectionId)}"]`) : null) ?? document.querySelector('.urd-section-active')
      : null;
    const blockOn = set.length > 1
      ? tellPhoneBar('block', block, phoneSetBar._urd.body, false, set)
      : tellPhoneBar('block', block, block?.querySelector(':scope > .urd-edit-toolbar') ?? null, Boolean(block?.classList.contains('urd-hold-drag')));
    const sectionOn = tellPhoneBar('section', section, section?.querySelector(':scope > .urd-section-toolbar') ?? null);
    if (blockOn || sectionOn) phoneBarFrame = requestAnimationFrame(tick);
  };
  phoneBarFrame = requestAnimationFrame(tick);
}

/** Whether the editor draws the menu's size bar beside the phone: in the phone view the mouse was last over the site's menu on the page, or the menu was last pressed there. */
let navBarOn = false;
let navBarFrame = 0;
let navBarTold = '';

/** Tells the editor, once a frame while the menu's size bar stands, where the site's menu stands in the canvas (urd-nav-bar), and once that it stands no more: outside the phone view, in the Clean view, or with no menu on the page. */
function watchNavBar() {
  if (navBarFrame) return;
  const tick = () => {
    navBarFrame = 0;
    const nav = navBarOn && isMobile() && !document.body.classList.contains('urd-chrome-off') ? document.querySelector('.urd-nav') : null;
    const box = nav?.getBoundingClientRect();
    if (!box || !(box.width || box.height)) {
      navBarOn = false;
      if (navBarTold) post({ type: 'urd-nav-bar', on: false });
      navBarTold = '';
      return;
    }
    const rect = { left: Math.round(box.left), top: Math.round(box.top), right: Math.round(box.right), bottom: Math.round(box.bottom) };
    const told = `${rect.left},${rect.top},${rect.right},${rect.bottom}`;
    if (told !== navBarTold) post({ type: 'urd-nav-bar', on: true, rect });
    navBarTold = told;
    navBarFrame = requestAnimationFrame(tick);
  };
  navBarFrame = requestAnimationFrame(tick);
}

/** The pointer on the site's menu brings its size bar, and on anything else of the page takes it away; off the page it stays, so the bar can be reached. */
function navBarAt(event) {
  if (!isMobile()) return;
  const on = Boolean(eventTarget(event)?.closest('.urd-nav'));
  if (on === navBarOn) return;
  navBarOn = on;
  watchNavBar();
}
document.addEventListener('pointerover', (event) => {
  if (event.pointerType === 'mouse') navBarAt(event);
});
document.addEventListener('pointerdown', navBarAt);

// In the phone view the section the mouse goes over is the one whose bar the editor draws.
document.addEventListener('pointerover', (event) => {
  // A menu standing keeps the bar it hangs from, and the section its rows act on.
  if (event.pointerType !== 'mouse' || !phoneBars() || phoneMenu) return;
  const id = eventTarget(event)?.closest('.urd-section')?.dataset.sectionId;
  if (!id || id === phoneBarSectionId) return;
  phoneBarSectionId = id;
  watchPhoneBar();
});

/**
 * A press on a tool of a bar the editor draws in the phone view (urd-bar-press): the tool at that place on the selected block's bar, or the section's, is pressed as on the page; the ⋮ opens its menu in the editor, by a rest without the focus.
 * @param {'block'|'section'} kind
 * @param {string} id The block's or the section's id
 * @param {number} index
 * @param {boolean} [rest]
 */
export function pressPhoneBar(kind, id, index, rest = false) {
  if (typeof id !== 'string' || !phoneBars() || !Number.isInteger(index)) return;
  const el = kind === 'section'
    ? document.querySelector(`.urd-section[data-section-id="${CSS.escape(id)}"]`)
    : document.querySelector(`.urd-block.urd-selected[data-block-id="${CSS.escape(id)}"]`);
  const tool = el ? phoneBarTools(el, kind)[index] : null;
  if (!tool) return;
  if (tool._urdMenu) {
    if (phoneMenu?.from?.button === tool) {
      if (phoneMenu.from.rest && !rest) holdPhoneMenu();
      return;
    }
    tool._urdMenu(rest, kind);
  } else tool.click();
}

/** A section's settings opened from the editor's own lists (urd-section-settings: the Phone panel's section), as its gear opens them. */
export function openSectionSettingsById(sectionId) {
  const host = typeof sectionId === 'string' ? document.querySelector(`.urd-section[data-section-id="${CSS.escape(sectionId)}"]`) : null;
  if (host?._urdSection) openSectionSettings(host, host._urdSection);
}

/**
 * Shows a menu at (x, y) for `el`, filled by `build(item, sep)`. An item
 * with `arm` asks for a second press, the way the section bar's deletion does (armedButton).
 * `from` is the bar's ⋮ that opened it, if one did (moreButton): a press on it is no press outside, and with `rest`, opened by a mouse resting on the ⋮, the menu leaves the focus where it is and closes a moment after the mouse leaves the ⋮ and the menu.
 */
function showContextMenu(el, x, y, label, build, from = null) {
  if (phoneBars()) {
    showPhoneMenu(el, x, y, label, build, from);
    return;
  }
  closeContextMenu(false);
  const menu = document.createElement('div');
  menu.className = 'urd-ctx';
  menu.setAttribute('role', 'menu');
  menu.setAttribute('aria-label', label);
  const item = (text, key, run, opts = {}) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = `urd-ctx-item${opts.danger ? ' urd-ctx-danger' : ''}`;
    b.setAttribute('role', 'menuitem');
    b.tabIndex = -1;
    // A deletion draws the bin before its words, on the dark red every deletion stands on (base.css).
    if (opts.danger) b.insertAdjacentHTML('beforeend', BIN_SVG);
    const span = document.createElement('span');
    span.textContent = text;
    b.appendChild(span);
    if (key) {
      const kbd = document.createElement('kbd');
      kbd.textContent = key;
      b.appendChild(kbd);
    }
    if (opts.disabled) b.setAttribute('aria-disabled', 'true');
    let armed = false;
    b.addEventListener('click', () => {
      if (opts.disabled) return;
      if (opts.arm && !armed) {
        armed = true;
        b.classList.add('urd-ctx-armed');
        span.textContent = opts.arm;
        return;
      }
      closeContextMenu(false);
      run();
    });
    menu.appendChild(b);
    return b;
  };
  const sep = () => {
    const d = document.createElement('div');
    d.className = 'urd-ctx-sep';
    d.setAttribute('role', 'separator');
    menu.appendChild(d);
  };
  build(item, sep);

  // Keyboard inside the menu: the arrows walk the items and wrap, Home and End jump, Escape closes.
  const items = () => [...menu.querySelectorAll('[role="menuitem"]')];
  const focusAt = (i) => { const list = items(); list[(i + list.length) % list.length]?.focus(); };
  menu.addEventListener('keydown', (event) => {
    const list = items();
    const i = list.indexOf(document.activeElement);
    if (event.key === 'ArrowDown') { event.preventDefault(); focusAt(i + 1); }
    else if (event.key === 'ArrowUp') { event.preventDefault(); focusAt(i - 1); }
    else if (event.key === 'Home') { event.preventDefault(); focusAt(0); }
    else if (event.key === 'End') { event.preventDefault(); focusAt(-1); }
    else if (event.key === 'Escape' || event.key === 'Tab') { event.preventDefault(); closeContextMenu(); }
    event.stopPropagation();
  });
  // A press outside, a scroll of the page, a window the owner leaves or
  // resizes: all close the menu. The listeners are set after the frame the
  // menu opens in, since opening it can redraw the section under the pointer.
  const outside = (event) => { if (!menu.contains(event.target) && !from?.button.contains(event.target)) closeContextMenu(false); };
  // A menu a rest opened holds no focus, so Escape anywhere on the page closes it, before the page's own keys see the press.
  const onEscape = (event) => {
    if (event.key !== 'Escape' || !contextMenu?.from?.rest || contextMenu.menu !== menu) return;
    event.preventDefault();
    event.stopPropagation();
    closeContextMenu(false);
  };
  // Opened by a rest: the mouse on the ⋮ or on the menu keeps it, and a moment after it has left both, the menu closes.
  const hover = { button: Boolean(from?.rest), menu: false };
  let leaveTimer = 0;
  const stay = () => clearTimeout(leaveTimer);
  const leaveSoon = () => {
    clearTimeout(leaveTimer);
    leaveTimer = setTimeout(() => {
      if (contextMenu?.menu === menu && contextMenu.from?.rest && !hover.button && !hover.menu) closeContextMenu(false);
    }, 280);
  };
  menu.addEventListener('pointerenter', (event) => {
    if (event.pointerType !== 'mouse') return;
    hover.menu = true;
    stay();
  });
  menu.addEventListener('pointerleave', (event) => {
    if (event.pointerType !== 'mouse') return;
    hover.menu = false;
    leaveSoon();
  });
  const onScroll = () => closeContextMenu(false);
  let wired = false;
  const frame = requestAnimationFrame(() => {
    wired = true;
    document.addEventListener('pointerdown', outside, true);
    document.addEventListener('keydown', onEscape, true);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('blur', onScroll);
    window.addEventListener('resize', onScroll);
  });
  const cleanup = () => {
    cancelAnimationFrame(frame);
    clearTimeout(leaveTimer);
    if (!wired) return;
    document.removeEventListener('pointerdown', outside, true);
    document.removeEventListener('keydown', onEscape, true);
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('blur', onScroll);
    window.removeEventListener('resize', onScroll);
  };
  // Measured once in the page as drawn, at the chrome's scale, then kept inside the window.
  menu.style.left = '0px';
  menu.style.top = '0px';
  document.body.appendChild(menu);
  const { width: w, height: h } = menu.getBoundingClientRect();
  menu.style.left = `${Math.max(4, Math.min(x, window.innerWidth - w - 4))}px`;
  menu.style.top = `${Math.max(4, Math.min(y, window.innerHeight - h - 4))}px`;
  contextMenu = { el, menu, cleanup, from, hover, stay, leaveSoon };
  if (!from?.rest) focusAt(0);
}

/**
 * A menu item's keys where they act: the canvas's keys for the blocks and the sections are the desktop view's, so in the phone view an item stands without them.
 * @param {string} key
 */
const keysHere = (key) => (isMobile() ? '' : key);

/** The block's menu: «Settings» first, then the block's actions; `from` as showContextMenu takes it. The phone view has the same menu, its layer order the phone's own among the blocks pinned there (bumpPhoneZ), greyed where it moves nothing. A block in a group of the phone's order (phoneTree) is taken out of it, and the groups are undone, from either view. A set's blocks are grouped in the phone view, where a set's member keeps the set, which the grouping and the layer order act on; on the desktop the menu holds one block, so the grouping stands greyed there. Each is greyed where it acts on nothing. A block is pinned on the phone in the phone view, where it stands, and unpinned from either view. */
function openContextMenu(el, x, y, from = null) {
  const ctx = el._urdCtx;
  if (!ctx || document.body.classList.contains('urd-chrome-off')) return;
  const { host, section, block } = ctx;
  const phone = isMobile();
  const keep = phone && multiIds.size > 1 && multiIds.has(block.id);
  const set = keep ? [...multiIds] : [block.id];
  // A menu a rest opened leaves the selection as it stands, until a press on the ⋮ keeps it (moreButton).
  const select = () => selectBlock(el, { keepMulti: keep });
  if (from?.rest) from.select = select;
  else select();
  showContextMenu(el, x, y, ta('canvas.ctx.label'), (item, sep) => {
    item(ta('canvas.ctx.settings'), 'Enter', () => openBlockSettings(el, section, block)).classList.add('urd-ctx-first');
    sep();
    item(ta('canvas.ctx.cut'), keysHere('Ctrl+X'), () => copyBlocks(section, [block.id], true));
    item(ta('canvas.ctx.copy'), keysHere('Ctrl+C'), () => copyBlocks(section, [block.id]));
    item(ta('canvas.ctx.duplicate'), keysHere('Ctrl+D'), () => duplicateBlock(section, block));
    sep();
    item(ta('canvas.ctx.copyStyle'), keysHere('Ctrl+Alt+C'), () => copyBlockStyle(block));
    item(ta('canvas.ctx.pasteStyle'), keysHere('Ctrl+Alt+V'), () => pasteBlockStyle(section, block), { disabled: !styleClipboard });
    sep();
    item(ta('canvas.ctx.toFront'), 'Ctrl+Shift+↑', () => (phone ? bumpPhoneZ(section, set, 1) : bumpBlockZ(host, section, block, el, 1)), { disabled: phone && !phoneLayerChanges(section.blocks, set, 1).size });
    item(ta('canvas.ctx.toBack'), 'Ctrl+Shift+↓', () => (phone ? bumpPhoneZ(section, set, -1) : bumpBlockZ(host, section, block, el, -1)), { disabled: phone && !phoneLayerChanges(section.blocks, set, -1).size });
    item(ta(block.hideMobile ? 'canvas.ctx.showMobile' : 'canvas.ctx.hideMobile'), '', () => {
      block.hideMobile = !block.hideMobile;
      post({ type: 'urd-block-flag', sectionId: section.id, blockId: block.id, hideMobile: block.hideMobile });
    });
    const setup = phoneSetupOf(section);
    const grouped = phoneTree(section.blocks, setup).some((node) => node.children?.some((c) => c.id === block.id));
    const takeOut = () => {
      const change = phoneUngroup(section.blocks, setup, block.id, false);
      if (change) post({ type: 'urd-phone-order', sectionId: section.id, blockId: block.id, change });
    };
    // The keys for grouping are the phone view's (Ctrl+G and Ctrl+Shift+G), so the desktop view's items stand without them.
    item(ta('canvas.ctx.groupPhone'), phone ? 'Ctrl+G' : '', () => groupOnPhone(section, set), { disabled: !phoneGroup(section.blocks, setup, set) });
    item(ta('canvas.ctx.takeOutPhone'), '', takeOut, { disabled: !grouped });
    item(ta('canvas.ctx.ungroupPhone'), phone ? 'Ctrl+Shift+G' : '', () => ungroupOnPhone(section, set), { disabled: !phoneUngroupAll(section.blocks, setup, set) });
    // Pinned on the phone where it stands, which only the phone view measures, or unpinned from either view.
    if (Number.isFinite(block.frames?.mobile?.row)) item(ta('canvas.ctx.unpinPhone'), '', () => post({ type: 'urd-phone-unpin', sectionId: section.id, blockId: block.id }));
    else item(ta('canvas.ctx.pinPhone'), '', () => el._urdPinOnPhone?.(), { disabled: !phone || block.hideMobile || !el._urdPinOnPhone });
    item(ta('canvas.ctx.saveTemplate'), '', () => post({ type: 'urd-save-template', kind: 'blocks', blocks: [JSON.parse(JSON.stringify(block))] }));
    sep();
    item(ta('canvas.ctx.delete'), keysHere('Delete'), () => {
      post({ type: 'urd-delete', sectionId: section.id, blockId: block.id });
      selectBlock(null);
    }, { danger: true });
  }, from);
}

/** The Nav panel's folds by their `data-fold`, with their titles, in the panel's order. */
const NAV_FOLDS = [
  ['items', 'group.menuItems'], ['logo', 'group.logo'], ['layout', 'group.navLayoutSize'], ['colours', 'group.navColoursFrame'],
  ['mobile', 'group.mobile'], ['scroll', 'group.navScrollPages'], ['tools', 'group.tools'], ['announcement', 'group.announcement'],
];

/** The part of the site's menu a right click landed on, as the Nav panel's fold that holds its settings and, for a tool, its card in the Tools fold; the bar itself has no fold of its own. */
function navPartAt(target) {
  if (target.closest('.urd-nav-announce')) return { fold: 'announcement' };
  for (const [selector, part] of [['.urd-nav-launcher-wrap', 'launcher'], ['.urd-nav-cart', 'cart'], ['.urd-nav-theme', 'theme'], ['.urd-nav-links', 'links']]) {
    if (target.closest(selector)) return { fold: 'tools', part };
  }
  if (target.closest('.urd-nav-tools')) return { fold: 'tools' };
  if (target.closest('.urd-nav-logo')) return { fold: 'logo' };
  if (target.closest('.urd-nav-burger')) return { fold: 'mobile' };
  if (target.closest('.urd-nav-list')) return { fold: 'items' };
  return { fold: null };
}

/** The site's menu's own menu: the settings of the part under the pointer, and each of the Nav panel's folds, opened there. In the phone view the bar, its logo and its list lead to the fold of the menu on the phone, which holds their settings for the phone. */
function openNavContextMenu(nav, target, x, y) {
  if (document.body.classList.contains('urd-chrome-off')) return;
  selectBlock(null);
  const at = navPartAt(target);
  const here = isMobile() && (!at.fold || at.fold === 'logo' || at.fold === 'items') ? { fold: 'mobile' } : at;
  const open = (fold, part = null) => post({ type: 'urd-open-panel', panel: 'nav', fold, part });
  showContextMenu(nav, x, y, ta('canvas.ctx.navLabel'), (item, sep) => {
    item(ta('canvas.ctx.settings'), 'Enter', () => open(here.fold, here.part)).classList.add('urd-ctx-first');
    sep();
    for (const [fold, title] of NAV_FOLDS) item(ta(title), '', () => open(fold));
  });
}

/** The section's menu, on its empty surface: a new block at the point, the clipboard, the section's settings and its own actions. The phone view has the same menu, a new block or pasted blocks standing on the phone only, greyed where an item acts on the desktop alone: a new section from the adder the phone view does not draw, and the height fitted to the desktop's blocks. */
function openSectionContextMenu(host, x, y, from = null) {
  if (document.body.classList.contains('urd-chrome-off')) return;
  const section = host._urdSection;
  if (!section) return;
  const phone = isMobile();
  // A section showing its phone layout in the desktop view (render.js urd-handoff) takes no blocks and keeps its desktop height there: those rows are greyed.
  const handoff = host.classList.contains('urd-handoff');
  const select = () => {
    selectBlock(null);
    markActiveVisual(host);
  };
  if (from?.rest) from.select = select;
  else select();
  // The «+ New section» bar below this section opens the preset choices.
  const adderBelow = () => {
    let n = host.nextElementSibling;
    while (n && !n.classList.contains('urd-add-section')) n = n.nextElementSibling;
    return n?.querySelector('button') ?? null;
  };
  showContextMenu(host, x, y, ta('canvas.ctx.sectionLabel'), (item, sep) => {
    // Opened from the section's bar the editor draws beside the phone, «here» is the section's top, as the bar stands there; otherwise the point the menu was opened at.
    const here = from?.editor ? null : { x, y };
    item(ta('canvas.ctx.newBlockHere'), keysHere('/'), () => (here ? openBlockMenuAt(host, here.x, here.y) : openBlockMenuAt(host)), { disabled: handoff }).classList.add('urd-ctx-first');
    // One clipboard: blocks paste at this section, a section lands below it.
    if (clipboard?.kind === 'section') item(ta('canvas.ctx.pasteSection'), keysHere('Ctrl+V'), () => pasteSection(host));
    else item(ta('canvas.ctx.paste'), keysHere('Ctrl+V'), () => pasteClipboard(clipboard, { ...here, host }), { disabled: handoff || !clipboard?.blocks?.length });
    sep();
    // The section's settings, in the floating menu as the gear on its bar opens them.
    item(ta('canvas.ctx.sectionSettings'), '', () => openSectionSettings(host, section));
    item(ta('canvas.ctx.newSectionBelow'), '', () => adderBelow()?.click(), { disabled: phone || !adderBelow() });
    item(ta('canvas.ctx.sectionUp'), '', () => post({ type: 'urd-move-section', sectionId: section.id, dir: -1 }));
    item(ta('canvas.ctx.sectionDown'), '', () => post({ type: 'urd-move-section', sectionId: section.id, dir: 1 }));
    if (host._urdGrid || phone) item(ta('canvas.fitHeight'), '', () => fitSectionHeight(host, section, host._urdGrid), { disabled: phone || handoff });
    sep();
    item(ta('canvas.ctx.cutSection'), keysHere('Ctrl+X'), () => copySection(host, true));
    item(ta('canvas.ctx.copySection'), keysHere('Ctrl+C'), () => copySection(host));
    item(ta('canvas.ctx.duplicateSection'), '', () => post({ type: 'urd-duplicate-section', sectionId: section.id }));
    item(ta('canvas.ctx.saveSection'), '', () => post({ type: 'urd-save-template', kind: 'section', section: JSON.parse(JSON.stringify(section)) }));
    sep();
    item(ta('canvas.ctx.deleteSection'), '', () => deleteSection(section.id), { danger: true, arm: ta('canvas.ctx.pressAgain') });
  }, from);
}

/* A right click opens the menu at the pointer: on a block the block's, on a
   section's empty surface the section's; the browser's own stays off the
   editing surface, except in text that held the caret before the press
   (spelling, paste): the press itself moves the focus into the text, so
   what had the focus is read on the way down. */
let activeBeforePress = null;
document.addEventListener('pointerdown', () => { activeBeforePress = document.activeElement; }, true);

/* The block under the mouse, told to the editor as it changes (urd-hover-block), so its row in the Phone panel's list is lit; null as the mouse leaves the blocks or the canvas. */
let hoverBlockId = null;
const tellHover = (id) => {
  if (id === hoverBlockId) return;
  hoverBlockId = id;
  post({ type: 'urd-hover-block', blockId: id });
};
document.addEventListener('pointerover', (event) => {
  if (event.pointerType !== 'mouse') return;
  tellHover(eventTarget(event)?.closest('.urd-block[data-block-id]')?.dataset.blockId ?? null);
});
document.documentElement.addEventListener('pointerleave', (event) => {
  if (event.pointerType === 'mouse') tellHover(null);
});
document.addEventListener('contextmenu', (event) => {
  const target = eventTarget(event);
  if (!target || document.body.classList.contains('urd-chrome-off')) return;
  const el = target.closest('.urd-block.urd-editable');
  if (el) {
    const text = target.closest(EDITABLE_TEXT);
    if (text && activeBeforePress && text.contains(activeBeforePress)) return;
    event.preventDefault();
    openContextMenu(el, event.clientX, event.clientY);
    return;
  }
  // The announcement strip may stand outside the menu (above the page or the content), and belongs to it all the same.
  const nav = target.closest('#urd-nav, .urd-nav-announce');
  if (nav && !target.closest('.urd-ctx, input, textarea, [contenteditable]')) {
    event.preventDefault();
    openNavContextMenu(nav, target, event.clientX, event.clientY);
    return;
  }
  const host = target.closest('.urd-section');
  if (!host || target.closest('.urd-block, .urd-add-block, .urd-add-section, .urd-section-toolbar, .urd-hint-chip, .urd-hint-card, .urd-ctx, input, textarea, [contenteditable]')) return;
  event.preventDefault();
  openSectionContextMenu(host, event.clientX, event.clientY);
});

/**
 * Draws a desktop frame on its block with the push shift the block is
 * shown with (ADR-0024): the frame is the data, the shift is display only,
 * so a drag keeps the block where the owner grabbed it.
 * @param {HTMLElement} el The block element
 * @param {{x: number, y: number, w: number, h: number}} frame The desktop frame
 */
function drawFrame(el, frame) {
  applyFrameCss(el, frame);
  const shift = pushShiftOf(el);
  if (shift) el.style.top = `${frame.y + shift}px`;
  const shown = shownHeight(el, frame.h);
  if (shown !== frame.h) el.style.height = `${shown}px`;
  // A block moved or resized keeps its bar inside the canvas as it goes.
  el._urdKeepBar?.();
}

/**
 * The height of the box the owner sees for a frame of height h: frameToCss
 * writes the design height, while the box shown is the one the last push
 * pass drew: grown past the frame by its content, unless a resize has made
 * the frame the taller of the two, or at its content's height for a block
 * that follows its content (ADR-0025).
 * @param {HTMLElement} el The block element
 * @param {number} h The frame's height
 * @returns {number}
 */
function shownHeight(el, h) {
  const drawn = pushDrawnOf(el);
  return drawn > h || (drawn && el.dataset.urdHeight === 'content') ? drawn : h;
}

/**
 * Settles the frames of the blocks under a gesture to the boxes the push
 * pass draws for them (ADR-0025): a block that follows its content takes its
 * content's height at rest as a visitor sees it, and any other block whose
 * content grew past its frame takes that growth. The data then says what the
 * pass drew: the blocks below move exactly as far as they are already drawn
 * (fitMovesAll), so nothing changes on screen, and the gesture places a
 * block whose frame is its box, which never stretches the section it is
 * dragged in. The section's own height is the owner's and is never written
 * by a settle. Only growth is settled; a block drawn shorter than its frame
 * keeps it until an edit fits it. Written into the section the push pass and
 * this layer hold: the gesture sends the settled frames with its own
 * (postSettled), or calls `undo` when it changes nothing.
 * @param {HTMLElement} host The section element
 * @param {object} section The section data
 * @param {Iterable<string>} ids The blocks under the gesture
 * @returns {{ids: string[], grown: Map<string, number>, undo: () => void} | null}
 *   The blocks whose frames changed, the growth the settled blocks still
 *   show (an unfolded FAQ answer), and the way back
 */
function settleFrames(host, section, ids) {
  const canvas = canvasOf(host);
  const fits = new Map();
  const grown = new Map();
  for (const id of ids) {
    const block = section.blocks.find((b) => b.id === id);
    const frame = block?.frames?.desktop;
    const el = canvas.querySelector(`:scope > .urd-block[data-block-id="${CSS.escape(id)}"]`);
    // A block set to shrink keeps the frame its zoom is measured against.
    if (!frame || !el || block.fit === 'shrink') continue;
    if (followsContent(block)) {
      if (!drawsAtContent(el)) continue;
      const { natural, resting } = visitorHeights(el);
      if (resting > frame.h) {
        fits.set(id, resting);
        grown.set(id, Math.max(0, natural - resting));
      }
    } else {
      const grow = pushGrowthOf(host, id);
      if (grow > 0) {
        fits.set(id, frame.h + grow);
        grown.set(id, 0);
      }
    }
  }
  if (!fits.size) return null;
  // Each block as wide as the pass draws it, so the moves are the pass's.
  const widths = new Map();
  for (const block of section.blocks) {
    const frame = block?.frames?.desktop;
    const el = frame ? canvas.querySelector(`:scope > .urd-block[data-block-id="${CSS.escape(block.id)}"]`) : null;
    if (el) widths.set(block.id, drawnWidth(el, canvas, frame));
  }
  const moves = fitMovesAll(section.blocks, fits, widths);
  const before = new Map();
  const written = new Map();
  for (const block of section.blocks) {
    const h = fits.get(block.id);
    const y = moves.get(block.id);
    if (h === undefined && y === undefined) continue;
    before.set(block.id, block.frames.desktop);
    block.frames.desktop = { ...block.frames.desktop, ...(h === undefined ? {} : { h }), ...(y === undefined ? {} : { y }) };
    written.set(block.id, block.frames.desktop);
  }
  syncSectionHeight(host);
  return {
    ids: [...written.keys()],
    grown,
    undo() {
      for (const [id, frame] of before) {
        const block = section.blocks.find((b) => b.id === id);
        // A fit that landed during the gesture (urd-frames) wins over the settle.
        if (block && block.frames.desktop === written.get(id)) block.frames.desktop = frame;
      }
      syncSectionHeight(host);
    },
  };
}

/**
 * Sends the frames a settle wrote (settleFrames) to the editor, beside the
 * ones the gesture sends itself, in the gesture's undo step.
 * @param {object} section The section data
 * @param {ReturnType<typeof settleFrames>} settle
 * @param {string[]} own The ids the gesture sends itself
 * @param {string} groupKey The gesture's undo step
 */
function postSettled(section, settle, own, groupKey) {
  for (const id of settle?.ids ?? []) {
    if (own.includes(id)) continue;
    const frame = section.blocks.find((b) => b.id === id)?.frames?.desktop;
    if (frame) post({ type: 'urd-move', sectionId: section.id, blockId: id, frame, frameKey: 'desktop', coalesce: true, groupKey });
  }
}

/**
 * The content surface of a section (ADR-0018). Block x/w are percentages OF
 * THIS surface, not of the section, so everything that converts pixels to
 * percent (drag, resize, arrow keys, marquee, materializing mobile frames)
 * must measure here.
 *
 * We MEASURE the surface instead of computing the min() expression from
 * site.layout: if the editor computes it itself, it can arrive at a
 * different width than the engine, and then blocks drift by themselves.
 * The fallback to the section covers older DOM not yet re-rendered.
 *
 * The section's OWN geometry (height, top, bottom) is still read from host:
 * the background and section height are full-width and not part of the
 * surface.
 *
 * @param {HTMLElement} host The section element
 * @returns {HTMLElement}
 */
function canvasOf(host) {
  return host.querySelector(':scope > .urd-canvas') ?? host;
}

/**
 * The nav clearance for the section (0 except for the first section under
 * an out-of-flow menu, see base.css): how far the content surface is pushed
 * down. Measured as the canvas offset, so the height drags can work in pure
 * content heights (the same numbers as size.minHeight in the data).
 */
function sectionClearance(host) {
  const canvas = host.querySelector(':scope > .urd-canvas');
  if (!canvas) return 0;
  return Math.max(0, Math.round(canvas.getBoundingClientRect().top - host.getBoundingClientRect().top));
}

/** The section's inline minHeight as render.js writes it: a plain length in
 *  content height, the nav clearance being the section's padding (base.css).
 *  Written to the element and to its dataset copy alike, since the push pass
 *  (render.js) restores the dataset value on every measurement. */
function setMinHeight(host, px) {
  host.style.minHeight = `${px}px`;
  host.dataset.urdMinHeight = host.style.minHeight;
}

/** Mobile view? The engine sets the body class from the breakpoint. */
const isMobile = () => document.body.classList.contains('urd-mobile');

/** How far the pointer pulls a block that follows its content up or down before the mark at its edge shows (ADR-0025). */
const STOP_MARK_PX = 6;

/** How far above and below the box where a dragged block will land on the phone the result shown holds, in px: the gaps the preview opens beside it. */
const LANDING_NEAR_PX = 24;

/** The narrowest a text block can be dragged on the desktop while its section forces readable text (ADR-0034), in px. */
const READABLE_MIN_PX = READABLE_PX;

/** The blocks greyed as too narrow for their words just now, and the screen whose «Force readable text» greys them. */
let squeezed = [];
let squeezedOn = null;

/**
 * Greys the block a drag or a handle would make narrower than «Force readable text» lets its words be (ADR-0034), the block being dragged, and takes the look off the ones no longer among them; none takes it off all.
 * The editor is told as the look comes and goes, and says why in its notice line (urd-too-narrow).
 * @param {HTMLElement[]} els
 * @param {'phone'|'desktop'} [screen]
 */
function showTooNarrow(els, screen = 'phone') {
  for (const old of squeezed) if (!els.includes(old)) old.classList.remove('urd-readable-blocked');
  for (const el of els) el.classList.add('urd-readable-blocked');
  squeezed = els;
  const on = els.length ? screen : null;
  if (on !== squeezedOn) {
    squeezedOn = on;
    post({ type: 'urd-too-narrow', screen: on });
  }
}

/**
 * The size readout beside the resize handle while a block is dragged: the
 * width in percent of the content surface and the height in px, as they
 * change, so what stands on release is what was shown (ADR-0025 decision 7).
 * @param {HTMLElement} el The block element
 * @returns {{show(w: number, h: number): void, remove(): void}}
 */
function sizeReadout(el) {
  const chip = document.createElement('div');
  chip.className = 'urd-edit-readout';
  chip.hidden = true;
  el.appendChild(chip);
  return {
    show(w, h) {
      chip.hidden = false;
      chip.textContent = `${Math.round(w * 10) / 10} % × ${Math.round(h)} px`;
    },
    remove() {
      chip.remove();
    },
  };
}

/** The template drafts from the editor (the urd-templates message): {id, name, kind, section?, blocks?}.
 *  The editor owns the list; here it feeds the My templates tab in "+ New section". */
let templates = [];
export function setTemplates(list) {
  templates = Array.isArray(list) ? list : [];
}

/** The category choice in the preset gallery is remembered per session
 *  (category sidebar). */
let presetCategory = 'all';

/** Display names for the layouts (keys in the core languages). */
const LAYOUT_LABEL_KEYS = {
  'stack-center': 'canvas.layout.stackCenter',
  'stack-left': 'canvas.layout.stackLeft',
  'split-media-right': 'canvas.layout.splitMediaRight',
  'split-media-left': 'canvas.layout.splitMediaLeft',
  'two-columns': 'canvas.layout.twoColumns',
  'hero-top': 'canvas.layout.heroTop',
};

/** One layout card per applicable variant: a thumbnail from the section's
 *  OWN blocks with the variant's frames; a click posts urd-apply-layout
 *  (ONE undo step in the editor) and calls done(). */
function buildLayoutCards(section, grid, done) {
  const cards = [];
  for (const id of applicableLayouts(section.blocks)) {
    const result = layoutFrames(id, section.blocks, grid);
    if (!result) continue;
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'urd-layout-card';
    try {
      const clone = structuredClone(section);
      for (const { blockId, frame } of result.frames) {
        const b = clone.blocks.find((x) => x.id === blockId);
        if (b) b.frames.desktop = { ...b.frames.desktop, ...frame };
      }
      clone.size = { ...clone.size, minHeight: result.minHeight };
      const thumb = document.createElement('span');
      thumb.className = 'urd-layout-thumb';
      thumb.insertAdjacentHTML('afterbegin', presetThumb(clone));
      card.appendChild(thumb);
    } catch { /* text-only card without a thumbnail */ }
    const name = document.createElement('span');
    name.className = 'urd-layout-name';
    name.textContent = ta(LAYOUT_LABEL_KEYS[id] ?? id);
    card.appendChild(name);
    card.addEventListener('click', () => {
      post({ type: 'urd-apply-layout', sectionId: section.id, frames: result.frames, minHeight: result.minHeight });
      done();
    });
    cards.push(card);
  }
  return cards;
}

/** The phone layout presets' names (phone-layouts.js). */
const PHONE_LAYOUT_LABEL_KEYS = {
  'two-per-line': 'canvas.phoneLayout.twoPerLine',
  pairs: 'canvas.phoneLayout.pairs',
  alternate: 'canvas.phoneLayout.alternate',
  'wide-two': 'canvas.phoneLayout.wideTwo',
  'big-two': 'canvas.phoneLayout.bigTwo',
  'one-column': 'canvas.phoneLayout.oneColumn',
};

/**
 * «Same height» on the phone (0.7.3.27): on each line of the section that holds more than one cell, every cell's last block is given the height that brings its bottom level with the line's lowest, measured as the section stands in the phone view; a block that grows with its words keeps growing past it.
 * @param {string} sectionId
 * @returns {{heights: Record<string, number>}|null} The change, null where every line already stands level or the section is not drawn for the phone
 */
function phoneSameHeights(sectionId) {
  if (!isMobile()) return null;
  const flow = document.querySelector(`.urd-section[data-section-id="${CSS.escape(sectionId)}"] .urd-flow`);
  if (!flow) return null;
  /** The cells and the blocks across the row that flow on a line, each with its last block and where its content ends. */
  const items = [...flow.children].map((el) => {
    const last = el.classList.contains('urd-cell') ? [...el.querySelectorAll(':scope > .urd-block')].at(-1) : el.classList.contains('urd-block-flow') ? el : null;
    if (!last || !last.dataset.blockId) return null;
    return { top: Math.round(el.getBoundingClientRect().top), last, bottom: last.getBoundingClientRect().bottom };
  }).filter(Boolean);
  const lines = new Map();
  for (const item of items) {
    if (!lines.has(item.top)) lines.set(item.top, []);
    lines.get(item.top).push(item);
  }
  const heights = {};
  for (const line of lines.values()) {
    if (line.length < 2) continue;
    const lowest = Math.max(...line.map((item) => item.bottom));
    for (const item of line) {
      const short = lowest - item.bottom;
      if (short >= 1) heights[item.last.dataset.blockId] = Math.round(item.last.getBoundingClientRect().height + short);
    }
  }
  return Object.keys(heights).length ? { heights } : null;
}

/**
 * «Same height» asked for by the editor (the urd-phone-same-height message: the button in the section's phone settings, and after a preset): measured once the section stands drawn anew, and posted as urd-phone-layout; `follow` marks heights that belong to the preset's step.
 * @param {string} sectionId
 * @param {boolean} [follow]
 */
export function matchPhoneHeights(sectionId, follow = false) {
  requestAnimationFrame(() => requestAnimationFrame(() => {
    const change = phoneSameHeights(sectionId);
    if (change) post({ type: 'urd-phone-layout', sectionId, change, ...(follow ? { follow: true } : {}) });
  }));
}

/** The two cards after the presets on the phone's layout strip: «Same height» and «Same width», each drawn as what it does to two blocks side by side, in the presets' own marks. */
function phoneMatchCards(section, done) {
  const card = (key, cells, act) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'urd-layout-card';
    const thumb = document.createElement('span');
    thumb.className = 'urd-layout-thumb urd-phone-sketch';
    thumb.setAttribute('aria-hidden', 'true');
    for (const { col, marks } of cells) {
      const part = document.createElement('span');
      part.style.gridColumn = `${col} / span 4`;
      for (const [mark, height] of marks) {
        const line = document.createElement('i');
        line.className = `urd-sketch-${mark}`;
        if (height) line.style.height = `${height}px`;
        part.appendChild(line);
      }
      thumb.appendChild(part);
    }
    const name = document.createElement('span');
    name.className = 'urd-layout-name';
    name.textContent = ta(key);
    button.title = ta(`tip.${key}`);
    button.append(thumb, name);
    button.addEventListener('click', () => {
      act();
      done();
    });
    return button;
  };
  return [
    card('canvas.phoneSameHeight', [{ col: 1, marks: [['pic', 24]] }, { col: 5, marks: [['pic', 24]] }], () => {
      const change = phoneSameHeights(section.id);
      if (change) post({ type: 'urd-phone-layout', sectionId: section.id, change });
    }),
    card('canvas.phoneSameWidth', [{ col: 1, marks: [['pic', 0]] }, { col: 5, marks: [['head', 0], ['text', 0], ['text', 0]] }], () => {
      const change = phoneSameWidths(section);
      if (change) post({ type: 'urd-phone-layout', sectionId: section.id, change });
    }),
  ];
}

/** One card per phone layout preset (phone-layouts.js), the ones that fit the section first: each drawn small with the section's own blocks in the eight cell columns; one that does not fit stands greyed; the site's own layouts after Urd's, by their names; then «Same height» and «Same width» (phoneMatchCards). A press posts urd-phone-layout (ONE undo step in the editor) and calls done(). */
function buildPhoneLayoutCards(section, done) {
  return [...phoneLayouts(section.blocks, phoneSetupOf(section), siteNow?.phoneLayouts).map(({ id, fits, own }) => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'urd-layout-card';
    const thumb = document.createElement('span');
    thumb.className = 'urd-layout-thumb urd-phone-sketch';
    thumb.setAttribute('aria-hidden', 'true');
    for (const cell of phoneLayoutSketch(section, own ?? id)) {
      const part = document.createElement('span');
      part.style.gridColumn = `${cell.col} / span ${cell.cols}`;
      for (const mark of cell.marks) {
        const line = document.createElement('i');
        line.className = `urd-sketch-${mark}`;
        part.appendChild(line);
      }
      thumb.appendChild(part);
    }
    const name = document.createElement('span');
    name.className = 'urd-layout-name';
    name.textContent = own ? (own.name || ta('phone.ownLayout.unnamed')) : ta(PHONE_LAYOUT_LABEL_KEYS[id] ?? id);
    card.append(thumb, name);
    card.disabled = !fits;
    card.addEventListener('click', () => {
      const change = phoneLayoutChange(section.blocks, phoneSetupOf(section), own ?? id);
      if (change) post({ type: 'urd-phone-layout', sectionId: section.id, change, preset: id });
      done();
    });
    return card;
  }), ...phoneMatchCards(section, done)];
}

/**
 * The "Change layout" picker: a strip above the section (default) or a
 * gallery menu, following the personal preference in the Urd settings
 * (urd-layout-picker in shared localStorage; read on every open, so
 * switching works without a reload). Both stick to the screen within the
 * section and close on another button click, a choice, an outside click
 * and Escape. The cards are the desktop's layouts (buildLayoutCards) or the
 * phone's presets (buildPhoneLayoutCards), given as `cardsFor(done)`.
 */
/** The open layout picker's way to close, for a press in the editor (closeMenus). */
let closeLayoutPicker = null;

function toggleLayoutPicker(host, cardsFor, titleKey = 'canvas.layoutTitle') {
  const existing = host.querySelector('.urd-layout-strip, .urd-layout-menu');
  document.querySelectorAll('.urd-layout-strip, .urd-layout-menu').forEach((el) => el.remove());
  if (existing) return;

  const asMenu = localStorage.getItem('urd-layout-picker') === 'menu';
  const picker = document.createElement('div');
  const outside = (event) => {
    // The button itself toggles; without this exception the capture
    // listener would remove the picker before the click, and the toggle
    // would rebuild it.
    if (picker.contains(event.target) || event.target.closest?.('.urd-layout-btn')) return;
    cleanup();
  };
  const onKey = (event) => {
    if (event.key === 'Escape') cleanup();
  };
  function cleanup() {
    document.removeEventListener('pointerdown', outside, true);
    document.removeEventListener('keydown', onKey, true);
    picker.remove();
    if (closeLayoutPicker === cleanup) closeLayoutPicker = null;
  }
  closeLayoutPicker = cleanup;

  const cards = cardsFor(cleanup);
  if (asMenu) {
    picker.className = 'urd-layout-menu';
    const head = document.createElement('div');
    head.className = 'urd-preset-head';
    const title = document.createElement('span');
    title.textContent = ta(titleKey);
    const close = document.createElement('button');
    close.type = 'button';
    close.className = 'urd-layout-close';
    close.innerHTML = CROSS_SVG;
    close.title = ta('confirm.cancel');
    close.addEventListener('click', cleanup);
    head.append(title, close);
    const grid2 = document.createElement('div');
    grid2.className = 'urd-layout-grid';
    grid2.append(...cards);
    picker.append(head, grid2);
  } else {
    picker.className = 'urd-layout-strip';
    picker.append(...cards);
  }
  // The section toolbar's own height, which the picker's offsets clear at any scale (base.css).
  const toolbar = host.querySelector(':scope > .urd-section-toolbar');
  if (toolbar?.offsetHeight) picker.style.setProperty('--urd-picker-clear', `${toolbar.offsetHeight}px`);
  // Before the canvas, so it sticks from the section's top: in the phone view the canvas stands in the flow, and the picker lies over it rather than pushing it down.
  host.insertBefore(picker, host.querySelector(':scope > .urd-canvas'));
  if (isMobile()) picker.style.marginBottom = `${-(picker.offsetHeight + (parseFloat(getComputedStyle(picker).marginTop) || 0))}px`;
  setTimeout(() => {
    document.addEventListener('pointerdown', outside, true);
    document.addEventListener('keydown', onKey, true);
  }, 0);
}

/** Last pointer position on the canvas: the slash command opens the block menu there. */
let lastPointer = null;
document.addEventListener('pointermove', (event) => {
  lastPointer = { x: event.clientX, y: event.clientY };
  raiseSmallestUnder(event.clientX, event.clientY);
}, { passive: true });

/**
 * The block raised under the pointer is the smallest one there, not the topmost, so a small block lying over a larger one can be reached.
 * A block whose own bar or handles stand topmost under the pointer stays raised: its bar stands outside its box, over the block above or below it, and stays reachable there.
 * The class stands where :hover would in base.css; a block that is not under the pointer loses it, and the Clean view raises nothing.
 */
let raisedEl = null;
let raiseFrame = 0;
function raiseSmallestUnder(x, y) {
  if (raiseFrame) return;
  raiseFrame = requestAnimationFrame(() => {
    raiseFrame = 0;
    let best = null;
    if (!document.body.classList.contains('urd-chrome-off')) {
      const hits = document.elementsFromPoint(x, y);
      const chrome = hits[0] instanceof Element ? hits[0].closest('.urd-edit-toolbar, .urd-edit-resize, .urd-edit-rotate') : null;
      best = chrome?.closest('.urd-editable') ?? null;
      let bestArea = Infinity;
      for (const n of best ? [] : hits) {
        if (!(n instanceof HTMLElement) || !n.classList.contains('urd-editable')) continue;
        const area = n.offsetWidth * n.offsetHeight;
        if (area < bestArea) {
          bestArea = area;
          best = n;
        }
      }
    }
    if (best === raisedEl) return;
    raisedEl?.classList.remove('urd-hover-top');
    raisedEl = best;
    best?.classList.add('urd-hover-top');
  });
}

/**
 * Open a section's + New block menu, shared by double-click and slash: with
 * a point, the block lands there (_urdAt) and the menu sits at the pointer;
 * without one it opens at its place under the section toolbar. The search
 * field is reset and focused.
 * In the phone view the point is the block's place in the phone's order (_urdPhone).
 */
function openBlockMenuAt(host, clientX = null, clientY = null) {
  const wrap = host.querySelector('.urd-add-block');
  const menu = wrap?.querySelector('.urd-add-block-menu');
  if (!wrap || !menu) return;
  const rect = host.getBoundingClientRect();
  // The block's landing point is a percentage of the CONTENT SURFACE, while
  // the menu itself is a child of the section and is positioned against it.
  // Two different frames.
  const canvasRect = canvasOf(host).getBoundingClientRect();
  // In the phone view the block stands on the phone only, landing at the point as a block let go there does; without a point, first in the section.
  menu._urdPhone = isMobile() ? phoneAdd(clientX != null ? phoneDropAtPoint(host, host._urdSection, clientX, clientY) : phoneDropFirst(host)) : {};
  if (clientX != null) {
    menu._urdAt = isMobile() ? null : {
      x: Math.round(((clientX - canvasRect.left) / canvasRect.width) * 10000) / 100,
      y: Math.round(clientY - canvasRect.top),
    };
    wrap.style.left = `${Math.round(clientX - rect.left)}px`;
    wrap.style.top = `${Math.round(clientY - rect.top)}px`;
    wrap.style.right = 'auto';
    // At the pointer the menu stands above the section's chrome, whatever the pointer's hover (the CSS on .urd-at-pointer).
    wrap.classList.add('urd-at-pointer');
  } else {
    menu._urdAt = null;
  }
  menu._urdPrepare?.();
  menu.classList.add('open');
  menu._urdSearchFocus?.();
  fitBlockMenu(menu);
}

/**
 * Keeps an open block menu inside the screen (menuFit and shiftInto in place.js): it hangs down from its place, the pointer or the toolbar's «New block», turns upwards when the room below is too small and there is more above, and is held to the room it has, where its list scrolls inside.
 * It hangs to the left of its anchor, and to the right where that would pass the screen's left edge.
 * Run again whenever a fold inside the menu changes its height.
 * @param {HTMLElement} menu The .urd-add-block-menu element
 */
function fitBlockMenu(menu) {
  menu.classList.remove('urd-menu-up');
  menu.style.maxHeight = '';
  menu.style.left = '';
  menu.style.right = '';
  menu.style.translate = '';
  const anchor = menu.parentElement.getBoundingClientRect();
  let box = menu.getBoundingClientRect();
  // The menu is drawn at the chrome's scale (urd-zoom): screen px are turned back into its own px.
  const scale = menu.offsetHeight ? box.height / menu.offsetHeight : 1;
  const fit = menuFit({ anchorTop: anchor.top, anchorBottom: anchor.bottom, gap: box.top - anchor.bottom, height: box.height, viewport: window.innerHeight, min: 160 * scale });
  if (fit.up) menu.classList.add('urd-menu-up');
  if (fit.room != null) menu.style.maxHeight = `${Math.floor(fit.room / scale)}px`;
  if (box.left < 8) {
    menu.style.left = '0';
    menu.style.right = 'auto';
    box = menu.getBoundingClientRect();
  }
  const shift = shiftInto(box.left, box.width, window.innerWidth);
  if (shift) menu.style.translate = `${Math.round(shift / scale)}px 0`;
  menu._urdFitFlyout?.();
}

/**
 * Places the slim block menu's side panel beside the group row that opened it (flyoutFit in place.js): on the menu's right, or its left where the right has no room, level with the row and kept on the screen.
 * The side form shows its blocks inside the menu, so there the panel's own placement is cleared.
 * @param {HTMLElement} menu The .urd-add-block-menu element
 * @param {HTMLElement} pane The side panel
 * @param {HTMLElement|null} row The group row it belongs to
 */
function fitFlyout(menu, pane, row) {
  pane.style.top = '';
  pane.style.maxHeight = '';
  menu.classList.remove('urd-abm-flip');
  if (!row || !menu.classList.contains('urd-abm-slim') || !pane.classList.contains('open')) return;
  const box = menu.getBoundingClientRect();
  const scale = menu.offsetWidth ? box.width / menu.offsetWidth : 1;
  const own = pane.getBoundingClientRect();
  const fit = flyoutFit({
    menuLeft: box.left, menuRight: box.right,
    // The panel's first row stands level with the group's row: the panel's padding is taken off.
    rowTop: row.getBoundingClientRect().top - 8 * scale,
    width: own.width, height: own.height,
    viewportW: window.innerWidth, viewportH: window.innerHeight, gap: 6 * scale,
  });
  menu.classList.toggle('urd-abm-flip', fit.left);
  pane.style.top = `${Math.round((fit.top - box.top) / scale)}px`;
  if (fit.room != null) pane.style.maxHeight = `${Math.floor(fit.room / scale)}px`;
}

/** Closes open menus (preset gallery, block menu). Also called via urd-close-menus when the owner clicks in the admin panels, which the iframe's own click listeners never see. */
let collapseOpenPresetMenu = null;
/** The text toolbar's way to write the link editor's answer on the selection it kept (initTextToolbar). */
let textLinkApply = null;

/**
 * The link editor's answer for the text being edited (urd-link-apply): the link in the link shape, or null to take the link away.
 * @param {object|null} link
 * @param {Array<{id: string, path: string}>} pages The page register, for the link's address now
 */
export function applyTextLink(link, pages) {
  textLinkApply?.(link, pages);
}

/**
 * Draws again while the owner types in a field of a block without taking the field from them: the field drawn anew gets the text it held, which can be newer than the draft the redraw was made from, and the caret or the selection where it stood, and its own input listener runs, so the editor gets the text and the frames the field stands at.
 * The field is found by its block and its place among the block's fields, and only while the block keeps as many fields; a field drawn after its data arrives (a collection entry) is waited for over a few frames, until the owner presses elsewhere or the focus moves.
 * A redraw while the preview does not have the focus (a change from the editor's panels) draws the data as it comes.
 * @param {() => void} paint
 */
export function keepTyping(paint) {
  const field = document.activeElement;
  const block = field instanceof HTMLElement && field.isContentEditable && document.hasFocus()
    ? field.closest('.urd-block[data-block-id]')
    : null;
  const fields = block ? [...block.querySelectorAll(EDITABLE_TEXT)] : [];
  const index = fields.indexOf(field);
  if (index < 0) {
    paint();
    return;
  }
  const blockId = block.dataset.blockId;
  const html = field.innerHTML;
  const selection = window.getSelection();
  const range = selection?.rangeCount ? selection.getRangeAt(0) : null;
  const caret = range && field.contains(range.startContainer) && field.contains(range.endContainer)
    ? { start: pathTo(field, range.startContainer), startOffset: range.startOffset, end: pathTo(field, range.endContainer), endOffset: range.endOffset }
    : null;
  paint();
  let frames = 0;
  let pressed = false;
  const press = () => { pressed = true; };
  window.addEventListener('pointerdown', press, { capture: true, once: true });
  const restore = () => {
    const focus = document.activeElement;
    if (pressed || !document.hasFocus() || (focus && focus !== document.body && focus !== field)) {
      window.removeEventListener('pointerdown', press, { capture: true });
      return;
    }
    const again = document.querySelector(`.urd-block[data-block-id="${CSS.escape(blockId)}"]`);
    const all = again ? again.querySelectorAll(EDITABLE_TEXT) : [];
    const next = all.length === fields.length ? all[index] : null;
    if (!next && again && all.length === 0 && ++frames < 12) {
      requestAnimationFrame(restore);
      return;
    }
    window.removeEventListener('pointerdown', press, { capture: true });
    if (!next || next === field) return;
    if (next.innerHTML !== html) next.innerHTML = html;
    next.focus({ preventScroll: true });
    const at = document.createRange();
    const start = caret && nodeAt(next, caret.start);
    const end = caret && nodeAt(next, caret.end);
    try {
      if (!start || !end) throw new RangeError('no caret');
      at.setStart(start, caret.startOffset);
      at.setEnd(end, caret.endOffset);
    } catch {
      at.selectNodeContents(next);
      at.collapse(false);
    }
    selection.removeAllRanges();
    selection.addRange(at);
    next.dispatchEvent(new Event('input', { bubbles: true }));
  };
  restore();
}

export function closeMenus() {
  collapseOpenPresetMenu?.();
  collapseOpenPresetMenu = null;
  closeColorPicker();
  closeDropdowns();
  document.querySelectorAll('.urd-add-block-menu.open').forEach((m) => {
    const wrap = m.closest('.urd-add-block');
    if (wrap) resetBlockAdder(wrap);
  });
  // The layout picker and the list of hidden blocks a section's bar opens.
  closeLayoutPicker?.();
  document.querySelectorAll('.urd-hidden-list').forEach((list) => list.remove());
}

/**
 * Attaches editing handles to all blocks in a rendered section.
 * Called by render.js after every (re)render in preview mode.
 *
 * @param {HTMLElement} host The section element
 * @param {object} section Section data
 * @param {{columns: number, rowHeight: number}} grid Effective grid
 */
export function enhanceSection(host, section, grid) {
  host._urdGrid = grid;
  // Where the phone view's bars stand, read at every drawing as the bar's other choices are: base.css leaves the page's own bars unseen while the editor draws them beside the phone.
  // With the bars in both places the page keeps its own in sight.
  document.body.classList.toggle('urd-bars-beside', barChoice(BAR_CHOICES.place) === 'beside');
  // The section's data on its element, for the right-click menu on its surface.
  host._urdSection = section;
  // A section showing its phone layout in the desktop view, since its words would be too narrow at this width (render.js urd-handoff, ADR-0034), is shown and not edited: its canvas takes no press, and its bar opens it in the phone view.
  if (host.classList.contains('urd-handoff')) {
    host.querySelector(':scope > .urd-canvas')?.setAttribute('inert', '');
    // A selection in it ends, so the editor's menu never writes a desktop frame from the phone layout's measure.
    if (multiSectionId === section.id) clearMulti();
    if (selectedBlockId && section.blocks.some((b) => b.id === selectedBlockId)) selectBlock(null);
    if (section.id === activeSectionId) host.classList.add('urd-section-active');
    addHandoffBar(host, section);
    return;
  }
  for (const el of host.querySelectorAll('.urd-block')) {
    const block = section.blocks.find((b) => b.id === el.dataset.blockId);
    if (block) enhanceBlock(el, block, section, grid, host);
  }
  // In the phone view each block wears its place in the reading order, a block placed by its own exception in amber (phone-order.js).
  if (isMobile()) {
    const setup = phoneSetupOf(section);
    stackOrder(section.blocks, setup).forEach((block, i) => {
      const el = host.querySelector(`.urd-block[data-block-id="${CSS.escape(block.id)}"]`);
      if (!el) return;
      el.querySelector(':scope > .urd-phone-num')?.remove();
      const num = document.createElement('span');
      num.className = hasPhonePlace(block, section.blocks, setup) ? 'urd-phone-num urd-phone-num-own' : 'urd-phone-num';
      num.textContent = String(i + 1);
      num.setAttribute('aria-hidden', 'true');
      el.appendChild(num);
    });
  }
  // The active section and the selection must survive re-renders (e.g.
  // changes from the Properties panel, which re-renders the whole section).
  if (section.id === activeSectionId) host.classList.add('urd-section-active');
  if (selectedBlockId) {
    host.querySelector(`.urd-block[data-block-id="${selectedBlockId}"]`)?.classList.add('urd-selected');
  }
  // Likewise the multi-selection (including a freshly pasted selection,
  // where the ids were set BEFORE the re-render found the elements).
  if (multiIds.size && host.dataset.sectionId === multiSectionId) {
    for (const id of multiIds) {
      host.querySelector(`.urd-block[data-block-id="${CSS.escape(id)}"]`)?.classList.add('urd-multi-selected');
    }
    updateMultiToolbar();
  }
  addSectionToolbar(host, section, grid);
  // The block menu, in both views: a block added in the phone view stands on the phone only (phoneAdd).
  addBlockAdder(host, section, grid);
  // A section or a selected block drawn anew in the phone view: the editor's bars are told their new tools.
  if (isMobile()) watchPhoneBar();
  // Persistent grid display (the grid menu in the editor is open) must
  // survive re-renders of the section.
  if (gridOverlaysOn) showGridOverlay(host, grid, restingGridLook()).classList.add('urd-grid-persistent');
  // Likewise the guide lines (a re-render removes the overlay elements).
  if (guideOverlaysOn) addGuideOverlays(host);
}

/**
 * The units on the phone (phone-moves.js phoneTree: a block alone, or a stack's or a column's blocks), each with its box in the row grid as drawn, from the row grid's corner: where a drag can land, and where a block added at a point lands.
 * A unit of several blocks carries each one's height, so a drop above or below lands on the block under the pointer.
 * @param {HTMLElement} host The section
 * @param {object} section
 * @param {HTMLElement} flowEl The row grid
 * @param {string|null} [without] The dragged block, left out
 * @param {Map<string, {left: number, top: number, width: number, height: number}>|null} [placed] Where the preview shows the blocks
 */
function phoneUnitBoxes(host, section, flowEl, without = null, placed = null) {
  const out = [];
  /** A block's box: where the preview shows it, else where it stands. */
  const boxOf = (ids) => {
    if (!placed) return phoneBoxOf(host, flowEl, ids);
    const rects = ids.map((id) => placed.get(id)).filter(Boolean);
    if (!rects.length) return phoneBoxOf(host, flowEl, ids);
    return { left: Math.min(...rects.map((r) => r.left)), top: Math.min(...rects.map((r) => r.top)), right: Math.max(...rects.map((r) => r.left + r.width)), bottom: Math.max(...rects.map((r) => r.top + r.height)) };
  };
  for (const node of phoneTree(section.blocks, phoneSetupOf(section))) {
    const ids = (node.children ? node.children.map((c) => c.id) : [node.id]).filter((id) => id !== without);
    const box = boxOf(ids);
    if (!box) continue;
    const members = ids.length > 1 ? ids.map((id) => ({ id, ...boxOf([id]) })).filter((m) => Number.isFinite(m.top)) : null;
    out.push({ id: ids[0], ...box, ...(members ? { members } : {}) });
  }
  return out;
}

/** The box that blocks stand in on the phone together, from the row grid's corner: each block's own, or its slot's where it is pinned; null where none of them is drawn. */
function phoneBoxOf(host, flowEl, ids) {
  const fr = flowEl.getBoundingClientRect();
  const rects = ids.map((id) => {
    const b = host.querySelector(`.urd-block[data-block-id="${CSS.escape(id)}"]`);
    return (b?._urdStickSlot?.isConnected ? b._urdStickSlot : b)?.getBoundingClientRect() ?? null;
  }).filter((r) => r && r.height > 0);
  if (!rects.length) return null;
  return {
    left: Math.min(...rects.map((r) => r.left)) - fr.left,
    top: Math.min(...rects.map((r) => r.top)) - fr.top,
    right: Math.max(...rects.map((r) => r.right)) - fr.left,
    bottom: Math.max(...rects.map((r) => r.bottom)) - fr.top,
  };
}

/**
 * Where a block added at a point of a section in the phone view lands (0.7.3.17): the drop a block let go there makes (phoneDropAt), with where the point stands across the row, in columns; null in a section with nothing on the phone.
 * With `between`, a point over a block lands after its line, as a block from the Blocks panel does in the middle of the view.
 * @param {HTMLElement} host
 * @param {object} section
 * @param {number} clientX
 * @param {number} clientY
 * @param {boolean} [between]
 */
function phoneDropAtPoint(host, section, clientX, clientY, between = false) {
  const flowEl = canvasOf(host).querySelector(':scope > .urd-flow');
  if (!flowEl || !section) return null;
  const fr = flowEl.getBoundingClientRect();
  const x = clientX - fr.left;
  const boxes = phoneUnitBoxes(host, section, flowEl);
  const found = phoneDropAt(boxes, x, clientY - fr.top, null);
  if (!found) return null;
  const drop = { ...found, x: (x - fr.width * 0.05) / ((fr.width * 0.9) / PHONE_COLUMNS) };
  if (drop.pos === 'before' || drop.pos === 'after') return drop;
  if (between && !drop.free) return phoneAfterLine(boxes, drop.of);
  // Beside a block or into its column, the new block is tried in the section as the last of it: where it finds no room, as in the gutter between two halves, or would stand narrower than words read well under «Force readable text» (ADR-0034), it lands after the line.
  const probe = { id: 'urd-new-probe', hideDesktop: true, frames: { desktop: { x: 0, y: Number.MAX_SAFE_INTEGER, w: 100, h: 1 }, mobile: null } };
  const cells = phoneDropChange([...section.blocks, probe], phoneSetupOf(section), probe.id, drop)?.cells;
  const narrow = Boolean(cells?.[probe.id]) && forcesReadable(section, 'mobile') && cells[probe.id].cols < leastWordsCols(window.innerWidth);
  return !cells || narrow ? phoneAfterLine(boxes, drop.of) : drop;
}

/** Where a block from the Blocks panel lands in the phone view: in the middle of the section's part in view, between its lines. */
function phoneDropMid(host) {
  const r = host.getBoundingClientRect();
  return phoneDropAtPoint(host, host._urdSection, r.left + r.width / 2, (Math.max(r.top, 0) + Math.min(r.bottom, window.innerHeight)) / 2, true);
}

/** Where a block from the section bar's «New block» lands in the phone view: first in the section, under the bar. */
function phoneDropFirst(host) {
  const flowEl = canvasOf(host).querySelector(':scope > .urd-flow');
  const first = flowEl && host._urdSection ? phoneUnitBoxes(host, host._urdSection, flowEl)[0] : null;
  return first ? { pos: 'before', of: first.id } : null;
}

/** The phone's place for blocks added in the phone view, as the messages that add them carry it (`phone`): they stand on the phone only, landing where `drop` asks; nothing in the desktop view. */
const phoneAdd = (drop) => (isMobile() ? { phone: { drop: drop ?? null } } : {});

/**
 * Places a new block from the editor's palette in the middle of the user's
 * view: in the active section, otherwise the section closest to the middle
 * of the viewport. The iframe knows where the user has scrolled; the
 * editor does not.
 */
export function placeBlock(block, root) {
  // A section showing its phone layout in the desktop view (render.js urd-handoff) takes no block there.
  let host = root.querySelector('.urd-section-active:not(.urd-handoff)');
  if (!host) {
    let best = null;
    let bestDist = Infinity;
    for (const el of root.querySelectorAll('.urd-section:not(.urd-handoff)')) {
      const r = el.getBoundingClientRect();
      if (r.bottom <= 0 || r.top >= window.innerHeight) continue;
      const dist = Math.abs(r.top + r.height / 2 - window.innerHeight / 2);
      if (dist < bestDist) { best = el; bestDist = dist; }
    }
    host = best ?? root.querySelector('.urd-section:not(.urd-handoff)');
  }
  if (!host) return;

  if (isMobile()) {
    // In the phone view the block stands on the phone only, in the middle of the view.
    post({ type: 'urd-add-block', sectionId: host.dataset.sectionId, block, fit: true, ...phoneAdd(phoneDropMid(host)) });
  } else {
    const rect = host.getBoundingClientRect();
    const visibleTop = Math.max(0, -rect.top);
    const visibleBottom = Math.max(visibleTop, Math.min(rect.height, window.innerHeight - rect.top));
    const frame = block.frames.desktop;
    frame.y = Math.max(8, Math.round((visibleTop + visibleBottom) / 2 - frame.h / 2));
    frame.x = Math.round(((100 - frame.w) / 2) * 100) / 100;
    post({ type: 'urd-add-block', sectionId: host.dataset.sectionId, block, fit: true });
  }
  // The new block is selected immediately (same pattern as duplicate):
  // the re-render after urd-add-block reads selectedBlockId, the editor
  // follows via urd-select-block, and Ctrl+D/arrow keys work without an
  // extra click first.
  document.querySelectorAll('.urd-block.urd-selected').forEach((b) => b.classList.remove('urd-selected'));
  selectedBlockId = block.id;
  post({ type: 'urd-select-block', sectionId: host.dataset.sectionId, blockId: block.id });
}

/**
 * Replays an entrance animation (demo when the editor changes it): snap
 * back to the start state without a transition, then glide in again.
 * Stagger hosts have the effect classes on their CHILDREN (each with its
 * own offset delay), so there the whole group is replayed.
 */
export function demoAnimation(el) {
  if (!el) return;
  const ENTRANCE = ['urd-anim-fade-in', 'urd-anim-slide-up', 'urd-anim-zoom-in'];
  // If the element carries an entrance class itself, it is played; otherwise
  // it is a group host (stagger/per-card) and the entrance-classed
  // descendants are played.
  const targets = ENTRANCE.some((c) => el.classList.contains(c))
    ? [el]
    : [...el.querySelectorAll(ENTRANCE.map((c) => `.${c}`).join(', '))];
  if (!targets.length) return;
  for (const t of targets) {
    t.style.transition = 'none';
    t.classList.remove('urd-anim-in');
  }
  void el.offsetWidth; // force a reflow so the start state actually applies
  for (const t of targets) t.style.transition = '';
  requestAnimationFrame(() => targets.forEach((t) => t.classList.add('urd-anim-in')));
}

/** Whether persistent grid display is on (controlled by the editor's grid menu). */
let gridOverlaysOn = false;

/** How the grid is drawn, as the editor keeps it in the browser (`urd-grid-look`, snap-model.js GRID_LOOKS); read where it is drawn, so a change shows at the next drawing. */
function gridLook() {
  try {
    return gridLookOf(localStorage.getItem('urd-grid-look'));
  } catch {
    return gridLookOf(null);
  }
}

/** The grid at rest: its lines or its dots, or, for the grid drawn only in a drag, the content's quarters as columns. */
const restingGridLook = () => (gridLook() === 'drag' ? 'columns' : gridLook());

/** The grid in a drag: its dots where they are chosen, else its lines. */
const draggingGridLook = () => (gridLook() === 'dots' ? 'dots' : 'lines');

/**
 * Toggles the grid display in all sections. Used while the grid menu in
 * the editor is open, so setting changes are seen immediately.
 */
export function toggleGridOverlays(visible, page, site) {
  gridOverlaysOn = visible;
  document.querySelectorAll('.urd-grid-persistent').forEach((el) => el.remove());
  if (!visible || !page || !site) return;
  // A section showing its phone layout in the desktop view has no desktop grid to show.
  for (const host of document.querySelectorAll('.urd-section:not(.urd-handoff)')) {
    const section = page.sections.find((s) => s.id === host.dataset.sectionId);
    if (!section) continue;
    showGridOverlay(host, section.grid ?? site.grid, restingGridLook()).classList.add('urd-grid-persistent');
  }
}

/** Whether the guide lines are on (controlled by the editor's top bar button). */
let guideOverlaysOn = false;

/**
 * Always-visible guide lines for the whole page: the content surface's quarters (25 %, the midline, 75 %), each with its share written at its top, as lines in the accent, or, where the grid is drawn as dots, as ticks on the section's edges with a faint line between.
 * Drawn in the content surface, the same lines the drag snaps to.
 * Editor chrome only: hidden in Clean view and never present for visitors.
 */
export function toggleGuideOverlays(visible) {
  guideOverlaysOn = visible;
  document.querySelectorAll('.urd-page-guide').forEach((el) => el.remove());
  if (!visible) return;
  document.querySelectorAll('.urd-section:not(.urd-handoff)').forEach((host) => addGuideOverlays(host));
}

function addGuideOverlays(host) {
  const surface = canvasOf(host);
  const ticks = gridLook() === 'dots';
  const share = new Intl.NumberFormat(adminLang(), { style: 'percent' });
  for (const at of [0.25, 0.5, 0.75]) {
    const line = document.createElement('div');
    line.className = `urd-page-guide urd-page-guide-v${ticks ? ' urd-page-guide-ticks' : ''}`;
    line.style.left = `${at * 100}%`;
    const label = document.createElement('span');
    label.className = 'urd-page-guide-share';
    label.textContent = share.format(at);
    line.appendChild(label);
    surface.appendChild(line);
  }
}

/**
 * Shared height drag: moves the section's bottom edge (size.minHeight),
 * snapped to the grid. Used by the handle at the section's bottom edge AND
 * by the "+ New section" bar (which sits on the same boundary). Stored in
 * px (a re-render can still grow the section if the blocks need more, see
 * render.js).
 *
 * The drag only starts after a small threshold, so target can also be a
 * clickable button; opts.onDragged is then called (before the button's
 * click), so the click can be suppressed.
 */
/**
 * Direction-indicating cursor during section height drags: arrow down when
 * dragging down, arrow up when dragging up (the CSS classes in base.css
 * override everything with !important, since the cursor otherwise follows
 * the element beneath it). Small threshold against jitter; the direction
 * is kept until it actually reverses.
 */
function dragCursor() {
  let lastY = null;
  return {
    move(clientY) {
      if (lastY === null) {
        lastY = clientY;
        return;
      }
      if (Math.abs(clientY - lastY) < 2) return;
      const down = clientY > lastY;
      lastY = clientY;
      document.documentElement.classList.toggle('urd-drag-down', down);
      document.documentElement.classList.toggle('urd-drag-up', !down);
    },
    clear() {
      document.documentElement.classList.remove('urd-drag-down', 'urd-drag-up');
    },
  };
}

/**
 * "+ New block" in the section (shown on hover): a click opens a menu of all block kinds, in the groups and the order the Blocks panel shares (block-palette.js), and the choice is reported to the editor, which builds the block and puts it in this exact section.
 */

/**
 * Closes a "+ New block" menu and resets where a double click or the toolbar
 * put it: the menu back at its place under the toolbar, its edge clamping removed.
 */
function resetBlockAdder(wrap) {
  wrap.classList.remove('urd-at-pointer');
  wrap.style.left = '';
  wrap.style.top = '';
  wrap.style.right = '';
  const menu = wrap.querySelector('.urd-add-block-menu');
  if (menu) {
    menu.classList.remove('open', 'urd-menu-up');
    menu.style.left = '';
    menu.style.right = '';
    menu.style.maxHeight = '';
    menu.style.translate = '';
  }
}

/** The «+ New block» menu's form from the Urd settings (urd-add-block-menu in the shared localStorage, read on every open like the layout picker's): the slim list, or the groups on the side. */
function blockMenuSlim() {
  try {
    return localStorage.getItem('urd-add-block-menu') === 'slim';
  } catch {
    return false;
  }
}

/** The kinds added last from the canvas menu, newest first (urd-recent-blocks, a convenience kept by this browser alone). */
function readRecentKinds() {
  try {
    return recentKinds(JSON.parse(localStorage.getItem('urd-recent-blocks') ?? '[]'));
  } catch {
    return [];
  }
}

function noteRecentKind(kind) {
  try {
    localStorage.setItem('urd-recent-blocks', JSON.stringify(rememberKind(readRecentKinds(), kind)));
  } catch {
    // Without storage the menu simply lists no recent blocks.
  }
}

/**
 * A fold's own button in the block menu: the label followed by a drawn
 * caret that turns over while the fold is open (the FAQ block's chevron
 * pattern). The open state is a class, so the label survives the toggle.
 * @param {string} label The fold's name
 * @returns {HTMLButtonElement}
 */
function foldToggle(label) {
  const button = document.createElement('button');
  button.className = 'urd-add-block-shapes-toggle';
  button.textContent = `${label} `;
  const caret = document.createElement('span');
  caret.className = 'urd-fold-caret';
  caret.innerHTML = CARET_SVG;
  button.appendChild(caret);
  return button;
}

/** A click anywhere outside an open block menu closes it. One document
 *  listener for the whole page, wired the first time a menu is built. */
let blockMenuOutsideWired = false;
function wireBlockMenuOutsideClose() {
  if (blockMenuOutsideWired) return;
  blockMenuOutsideWired = true;
  document.addEventListener('pointerdown', (event) => {
    for (const menu of document.querySelectorAll('.urd-add-block-menu.open')) {
      const wrap = menu.closest('.urd-add-block');
      // The section toolbar's own «New block» opens and closes its section's menu itself; another section's closes this one.
      if (event.target instanceof Element && event.target.closest('.urd-sec-add-block') && event.target.closest('.urd-section') === wrap?.closest('.urd-section')) continue;
      if (wrap && event.target instanceof Node && !wrap.contains(event.target)) resetBlockAdder(wrap);
    }
  }, true);
}

/** Whether the shop's blocks stand in the «+ New block» menu and the shop's templates in «+ New section» (block-palette.js shopOn); urd.js hands in the site's settings and whether a product catalogue stands among the collection drafts, and each menu reads the value as it opens. */
let shopBlocksOn = true;
export function setShopOn(siteSettings, hasProducts) {
  shopBlocksOn = shopOn(siteSettings, hasProducts);
}

function addBlockAdder(host, section, grid) {
  wireBlockMenuOutsideClose();
  const wrap = document.createElement('div');
  wrap.className = 'urd-add-block';

  const menu = document.createElement('div');
  menu.className = 'urd-add-block-menu';
  // The click point (section-relative: x in %, y in px) is set when the
  // menu opens via DOUBLE-CLICK on the section surface; the block then
  // lands there. Opened from the section toolbar's «New block», the point is
  // null and the editor centers the block.
  menu._urdAt = null;
  menu._urdPhone = {};

  // The block search (flat hit list). Everything added to the menu is
  // registered in searchables with its visible label and a run that clicks
  // the REAL button, so hits and menu can never diverge.
  const searchables = [];
  const searchWrap = document.createElement('div');
  searchWrap.className = 'urd-block-search';
  searchWrap.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>';
  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.placeholder = ta('canvas.searchBlocks');
  searchWrap.appendChild(searchInput);
  const hits = document.createElement('div');
  hits.className = 'urd-block-hits';
  menu.append(searchWrap, hits);

  // The arrow keys walk a marked row through the menu: the hits while a search is running, the menu's own rows before that (a closed group or fold hides its own).
  // The step is geometric rather than DOM order, since the groups' list and the blocks stand side by side.
  let pickEl = null;
  const pickables = () => [...menu.querySelectorAll('button')].filter((b) => b.offsetParent !== null);
  const clearPick = () => {
    pickEl?.classList.remove('urd-pick-active');
    pickEl = null;
  };
  const setPick = (el) => {
    clearPick();
    pickEl = el;
    el.classList.add('urd-pick-active');
    el.scrollIntoView({ block: 'nearest' });
    // A group's row walked to shows its blocks, so the walk can step on into them.
    if (el.classList.contains('urd-abm-tab')) showGroup(el.dataset.group);
  };
  const movePick = (dx, dy) => {
    const list = pickables();
    if (!list.length) return;
    if (!pickEl || !list.includes(pickEl)) {
      setPick(dx + dy < 0 ? list[list.length - 1] : list[0]);
      return;
    }
    const from = pickEl.getBoundingClientRect();
    const fx = from.left + from.width / 2;
    const fy = from.top + from.height / 2;
    let best = null;
    let bestScore = Infinity;
    for (const b of list) {
      if (b === pickEl) continue;
      const r = b.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      // Only rows lying in the direction of travel, and of those the nearest,
      // counting the sideways distance double so the walk keeps to its column.
      const along = dy ? (cy - fy) * dy : (cx - fx) * dx;
      if (along <= 1) continue;
      const across = dy ? Math.abs(cx - fx) : Math.abs(cy - fy);
      const score = along + across * 2;
      if (score < bestScore) {
        bestScore = score;
        best = b;
      }
    }
    if (best) setPick(best);
  };
  const ARROW_STEPS = { ArrowDown: [0, 1], ArrowUp: [0, -1], ArrowRight: [1, 0], ArrowLeft: [-1, 0] };

  // Set while the other languages load, so the hits are drawn again once when they are in.
  let langsWaiting = false;
  const renderHits = () => {
    clearPick();
    const query = searchInput.value;
    if (!query.trim()) {
      menu.classList.remove('urd-searching');
      hits.replaceChildren();
      return;
    }
    menu.classList.add('urd-searching');
    hits.replaceChildren();
    const all = searchables.filter((s) => !s.shop || shopBlocksOn).concat(menu._urdTemplateSearchables ?? []);
    // The other languages load on the first query, and the hits are drawn again when they are in (search-langs.js).
    if (!searchLanguagesReady() && !langsWaiting) {
      langsWaiting = true;
      loadSearchLanguages().then(() => {
        langsWaiting = false;
        if (searchInput.isConnected && searchInput.value.trim()) renderHits();
      });
    }
    // A group's name searches with its rows: «Shop» finds the shop's kinds, and a plugin fold's name its views.
    const found = searchItemsAny(all, query, (item) => (item.group ? `${item.label} ${item.group}` : item.label));
    if (!found.length) {
      const empty = document.createElement('div');
      empty.className = 'urd-search-empty';
      empty.textContent = ta('canvas.searchEmpty');
      hits.appendChild(empty);
      return;
    }
    for (const item of found) {
      const b = document.createElement('button');
      if (item.kind) b.innerHTML = PALETTE_KINDS[item.kind]?.picture ?? '';
      const name = document.createElement('span');
      name.textContent = item.label;
      b.appendChild(name);
      b.addEventListener('click', item.run);
      hits.appendChild(b);
    }
    // The first hit is marked from the first letter, so the row Enter takes is the row the eye sees.
    setPick(hits.querySelector('button'));
  };
  searchInput.addEventListener('input', renderHits);
  // The keys are read on the whole menu, so they hold wherever in it the focus stands.
  // The arrows walk the menu, Enter takes the walked row and otherwise the first hit (the slash flow: "/", type, Enter), and Escape closes.
  // Every key is stopped at the menu, so the canvas shortcuts never see it.
  // Left and right move the caret in the field until the walk has started with up or down.
  menu.addEventListener('keydown', (event) => {
    const inField = event.target === searchInput;
    const step = ARROW_STEPS[event.key];
    if (step && (step[1] !== 0 || pickEl || !inField)) {
      event.preventDefault();
      movePick(step[0], step[1]);
    } else if (event.key === 'Enter' && (inField || pickEl)) {
      event.preventDefault();
      (pickEl ?? hits.querySelector('button'))?.click();
    } else if (event.key === 'Escape') {
      resetBlockAdder(wrap);
    }
    event.stopPropagation();
  });
  menu._urdSearchReset = () => {
    searchInput.value = '';
    renderHits();
  };
  menu._urdSearchFocus = () => searchInput.focus();

  // The menu's body in both forms: the groups' list and the chosen group's blocks (block-palette.js), with the plugins' blocks and the saved block groups as two more groups.
  // Groups on the side, the default, is a box of fixed size with the list at the left and the blocks beside it.
  // The slim form (the Urd settings) is the list alone under the blocks added last, and a group's blocks open in a panel beside the menu.
  const recent = document.createElement('div');
  recent.className = 'urd-abm-recent';
  const body = document.createElement('div');
  body.className = 'urd-abm-body';
  const rail = document.createElement('div');
  rail.className = 'urd-abm-rail';
  const pane = document.createElement('div');
  pane.className = 'urd-abm-pane';
  body.append(rail, pane);
  menu.append(recent, body);

  const groups = new Map();
  let shownGroup = PALETTE_GROUPS[0].id;
  let hoverTimer = 0;
  const showGroup = (id) => {
    const group = groups.get(id);
    if (!group || group.tab.hidden) return;
    shownGroup = id;
    for (const [key, g] of groups) {
      g.tab.classList.toggle('on', key === id);
      g.panel.classList.toggle('open', key === id);
    }
    pane.classList.add('open');
    pane.scrollTop = 0;
    fitFlyout(menu, pane, group.tab);
  };
  menu._urdFitFlyout = () => fitFlyout(menu, pane, groups.get(shownGroup)?.tab ?? null);
  const addGroup = (id, label, picture) => {
    const tab = document.createElement('button');
    tab.type = 'button';
    tab.className = 'urd-abm-tab';
    tab.dataset.group = id;
    tab.innerHTML = picture;
    const name = document.createElement('span');
    name.textContent = label;
    const chevron = document.createElement('span');
    chevron.className = 'urd-abm-chevron';
    chevron.innerHTML = CHEVRON_SVG;
    tab.append(name, chevron);
    // A click marks the row for the arrow keys and gives the focus back to the search field, so the keys and the typing go on from there.
    tab.addEventListener('click', () => {
      setPick(tab);
      searchInput.focus({ preventScroll: true });
    });
    // In the slim form a mouse resting on a group opens it; once a panel is open the change waits a moment, so a pointer crossing the other rows on its way into the panel leaves it be.
    // Touch and the keyboard open a group with the click (the pointerType guard: a tap fires pointerenter too).
    tab.addEventListener('pointerenter', (event) => {
      if (event.pointerType !== 'mouse' || !menu.classList.contains('urd-abm-slim')) return;
      clearTimeout(hoverTimer);
      hoverTimer = setTimeout(() => showGroup(id), pane.classList.contains('open') ? 150 : 0);
    });
    tab.addEventListener('pointerleave', () => clearTimeout(hoverTimer));
    rail.appendChild(tab);
    const panel = document.createElement('div');
    panel.className = 'urd-abm-group';
    const heading = document.createElement('div');
    heading.className = 'urd-add-block-group';
    heading.textContent = label;
    const items = document.createElement('div');
    items.className = 'urd-abm-items';
    panel.append(heading, items);
    pane.appendChild(panel);
    groups.set(id, { tab, panel });
    return items;
  };

  // A kind's row: its picture, then its name. An entry from pictures opens the file picker on the click itself and sends the files with the request; the calendar's designs ask the editor for its design picker.
  const kindButtons = new Map();
  const kindButton = (parent, kind, label, group, shop = false) => {
    const def = PALETTE_KINDS[kind];
    const b = document.createElement('button');
    b.type = 'button';
    b.innerHTML = def.picture;
    const name = document.createElement('span');
    name.textContent = label;
    b.appendChild(name);
    if (def.tipKey) b.title = ta(def.tipKey);
    b.addEventListener('click', () => {
      const at = menu._urdAt ?? undefined;
      // The recent list holds the kinds added in one press: a kind from pictures counts once pictures are chosen, and an entry that opens a picker never counts.
      if (!def.files && !def.action) noteRecentKind(kind);
      if (def.files) {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.multiple = def.files === 'many';
        input.addEventListener('change', () => {
          const files = [...(input.files ?? [])];
          if (!files.length) return;
          noteRecentKind(kind);
          post({ type: 'urd-request-block', sectionId: section.id, kind: def.block ?? kind, at, files, ...menu._urdPhone });
        }, { once: true });
        input.click();
      } else if (def.action === 'designs') {
        post({ type: 'urd-calendar-designs', sectionId: section.id, at, ...menu._urdPhone });
      } else {
        post({ type: 'urd-request-block', sectionId: section.id, kind, at, ...menu._urdPhone });
      }
      resetBlockAdder(wrap);
    });
    parent.appendChild(b);
    kindButtons.set(kind, b);
    searchables.push({ label, group, kind, run: () => b.click(), ...(shop ? { shop } : {}) });
  };
  // Every group is built; the shop's stands in the menu while the gate is on, read as the menu opens (_urdPrepare).
  for (const group of PALETTE_GROUPS) {
    const items = addGroup(group.id, ta(group.labelKey), PALETTE_KINDS[group.icon].picture);
    for (const kind of group.kinds) kindButton(items, kind, ta(PALETTE_KINDS[kind].labelKey), ta(group.labelKey), group.id === 'shop');
  }

  // The slim form's first rows: the kinds added last from this menu, each running its own row in the groups.
  const refreshRecent = () => {
    recent.replaceChildren();
    // A shop kind added before the gate closed stays out of the row while it is closed.
    const kinds = readRecentKinds().filter((kind) => kindButtons.has(kind) && (shopBlocksOn || !PALETTE_GROUPS.find((g) => g.id === 'shop')?.kinds.includes(kind)));
    if (!kinds.length) return;
    const heading = document.createElement('div');
    heading.className = 'urd-add-block-group';
    heading.textContent = ta('canvas.recent');
    recent.appendChild(heading);
    for (const kind of kinds) {
      const b = document.createElement('button');
      b.type = 'button';
      b.innerHTML = PALETTE_KINDS[kind].picture;
      const name = document.createElement('span');
      name.textContent = ta(PALETTE_KINDS[kind].labelKey);
      b.appendChild(name);
      b.addEventListener('click', () => kindButtons.get(kind)?.click());
      recent.appendChild(b);
    }
  };

  // Plugin blocks: their own group after the built-ins.
  // The preview has the registries (and thus defaults), so the block is built here and sent complete.
  const pluginTypes = window.Urd.blocks.ids().filter((type) => window.Urd.blocks.get(type)?.fromPlugin);
  const pluginItems = pluginTypes.length ? addGroup('plugins', ta('panel.plugins'), EXTRA_GROUP_PICTURES.plugins) : null;
  for (const type of pluginTypes) {
    const def = window.Urd.blocks.get(type);
    const title = typeof def.fromPlugin === 'string' ? ta('tip.blocks.fromPlugin', { plugin: def.fromPlugin }) : ta('tip.blocks.fromPluginGeneric');
    const buildAndPost = (extraProps = {}) => {
      // Opened via double-click: the plugin block lands on the click point
      // (the same pure placement the editor uses for core blocks).
      const w = 50;
      const h = 260;
      const pos = menu._urdAt
        ? frameAtPoint({ x: menu._urdAt.x, y: menu._urdAt.y, w, h, grid })
        : { x: 25, y: 40 };
      post({
        type: 'urd-add-block',
        sectionId: section.id,
        fit: true,
        ...menu._urdPhone,
        block: {
          id: makeId('blk'),
          type,
          version: def.version ?? 1,
          props: { ...(def.defaults ? def.defaults() : {}), ...extraProps },
          animation: null,
          frames: { desktop: { x: pos.x, y: pos.y, w, h, z: 1, rot: 0 }, mobile: null },
        },
      });
      resetBlockAdder(wrap);
    };
    // Blocks with variants (e.g. the calendar's views) get a fold-out menu like Shapes.
    const defLabel = def.labelKey ? ta(def.labelKey) : (def.label ?? type);
    if (Array.isArray(def.variants) && def.variants.length) {
      const toggle = foldToggle(defLabel);
      toggle.title = title;
      const sub = document.createElement('div');
      sub.className = 'urd-add-block-shapes';
      for (const variant of def.variants) {
        const b = document.createElement('button');
        const variantLabel = variant.labelKey ? ta(variant.labelKey) : variant.label;
        b.textContent = variantLabel;
        b.addEventListener('click', () => buildAndPost(variant.props ?? {}));
        sub.appendChild(b);
        // In the hit list the fold is flattened: "Calendar: Month" as its own row.
        searchables.push({ label: `${defLabel}: ${variantLabel}`, run: () => b.click() });
      }
      toggle.addEventListener('click', () => {
        const open = sub.classList.toggle('open');
        toggle.classList.toggle('open', open);
        fitBlockMenu(menu);
      });
      pluginItems.append(toggle, sub);
      continue;
    }
    const b = document.createElement('button');
    b.textContent = defLabel;
    b.title = title;
    b.addEventListener('click', () => buildAndPost());
    pluginItems.appendChild(b);
    searchables.push({ label: defLabel, run: () => b.click() });
  }
  // My templates (block groups, the snippets model): saved groups in the SAME menu as the blocks, as the last group.
  // The content is built on every open, so the list is always fresh (saving/deleting happens without the section re-rendering), and the group is left out while there are none.
  const templateItems = addGroup('templates', ta('canvas.tabMyTemplates'), EXTRA_GROUP_PICTURES.templates);
  menu._urdRefreshTemplates = () => {
    templateItems.replaceChildren();
    menu._urdTemplateSearchables = [];
    const groupTemplates = templates.filter((m) => m.kind === 'blocks' && Array.isArray(m.blocks));
    groups.get('templates').tab.hidden = !groupTemplates.length;
    for (const tpl of groupTemplates) {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = tpl.name;
      b.title = ta('canvas.insertGroup');
      b.addEventListener('click', () => {
        // Opened via double-click: the group lands with its top-left corner
        // on the click point; otherwise the stored positions are kept
        // (clamping only).
        insertBlocksTemplate(tpl, section.id, menu._urdAt, menu._urdPhone);
        resetBlockAdder(wrap);
      });
      templateItems.appendChild(b);
      menu._urdTemplateSearchables.push({ label: tpl.name, run: () => b.click() });
    }
  };
  // Every open reads the form from the Urd settings, so a change there needs no reload.
  // The side form shows the group last chosen (the first while there is none), and the slim form opens with its panel closed.
  menu._urdPrepare = () => {
    clearTimeout(hoverTimer);
    const slim = blockMenuSlim();
    menu.classList.toggle('urd-abm-slim', slim);
    menu._urdRefreshTemplates();
    const shopGroup = groups.get('shop');
    if (shopGroup) shopGroup.tab.hidden = shopGroup.panel.hidden = !shopBlocksOn;
    refreshRecent();
    menu._urdSearchReset?.();
    pane.classList.remove('open');
    for (const g of groups.values()) {
      g.tab.classList.remove('on');
      g.panel.classList.remove('open');
    }
    if (!slim) showGroup(groups.get(shownGroup)?.tab.hidden === false ? shownGroup : PALETTE_GROUPS[0].id);
  };
  // enhanceSection runs after EVERY re-render on the same host element: the listeners are added only once and look up the current menu at event time, otherwise one listener piles up per re-render.
  if (!host._urdAdderLeaveWired) {
    host._urdAdderLeaveWired = true;
    // The menu does NOT close when the pointer leaves the section: it stays
    // until a click outside (outside-pointerdown) or a block is chosen.
    // No mouseleave closing.
    // Double-click on empty section surface opens the menu AT THE POINTER,
    // and the block lands on the click point ("+ new block where you
    // click"). Never inside blocks (double-click is word selection/image
    // editor there) or on editing handles.
    host.addEventListener('dblclick', (event) => {
      const target = event.target instanceof Element ? event.target : null;
      if (!target) return;
      if (target.closest('.urd-block, .urd-add-block, .urd-add-section, .urd-section-toolbar, .urd-hint-chip, .urd-hint-card')) return;
      openBlockMenuAt(host, event.clientX, event.clientY);
    });
  }

  wrap.append(menu);
  host.appendChild(wrap);
}

/**
 * The grip on the seam between two sections (BACKLOG 535 and 539, the Section Seams canvas, look A): a pill on the line that only grows, the section above as it is dragged down and the section below at its top as it is dragged up, and a tab above and a tab below it that each shrink the section they stand in, stopping where that section's content ends unless Alt is held (seamDrag in section-size.js). The tabs stand while the pointer is on the grip.
 * The first seam has only a section below and the last only one above, so they carry one tab. Ctrl or Cmd gives a free height, and Escape puts the seam back where the drag began.
 * A section that changes at its top takes its blocks with it and the page scrolls by as much, so the content stands still and the dragged edge follows the pointer.
 * The whole drag is one urd-section-size, for the section that changed; the arrow keys on a part move it one grid step (Shift: 1 px), and the part keeps the focus through the page's redraw, found again by its seam's place (`index`) and its kind.
 * @param {number} index Where the seam stands among the page's seams
 * @param {{host: HTMLElement, section: object, grid: object} | null} above
 * @param {{host: HTMLElement, section: object, grid: object} | null} below
 */
function seamGrip(index, above, below) {
  const grip = document.createElement('div');
  grip.className = 'urd-seam-grip';
  const part = (kind, className, icon, tip) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = className;
    btn.dataset.seam = kind;
    btn.title = ta(tip);
    btn.setAttribute('aria-label', ta(tip));
    btn.innerHTML = icon;
    wireSeamDrag(btn, kind, above, below, grip, index);
    return btn;
  };
  if (above) grip.append(part('shrinkAbove', 'urd-seam-tab urd-seam-up', SEAM_UP_SVG, 'canvas.seam.shrinkAbove'));
  grip.append(part('grow', 'urd-seam-pill', GRIP_SVG, above && below ? 'canvas.seam.grow' : above ? 'canvas.seam.growAbove' : 'canvas.seam.growBelow'));
  if (below) grip.append(part('shrinkBelow', 'urd-seam-tab urd-seam-down', SEAM_DOWN_SVG, 'canvas.seam.shrinkBelow'));
  const readout = document.createElement('span');
  readout.className = 'urd-seam-readout';
  readout.hidden = true;
  grip.append(readout);
  return grip;
}

/** Whether a block is docked to the screen (sticky.js), floating over every section and standing in none. */
const dockedToScreen = (block) => block.sticky?.mode === 'screen';

/** A section's state as a seam drag begins, read from the section as it is drawn now (the data and grid enhanceSection keeps on its element, since one section can be drawn again without the page): its height in content px, its blocks with their desktop y and their drawn top, where its content ends and starts, and its own inline height to restore.
 *  The content is measured where each block stands in the section, its frame and the push pass's shift with its drawn height; a block docked to the screen is left out. Called with sticky.js and the push pass suspended, so every block stands at its place in the section. */
function seamSide(side) {
  // A section showing its phone layout in the desktop view (render.js urd-handoff) keeps its desktop height: the seam acts as if it stood alone on its other side.
  if (!side || side.host.classList.contains('urd-handoff')) return null;
  const section = side.host._urdSection ?? side.section;
  const grid = side.host._urdGrid ?? side.grid;
  const blocks = [...canvasOf(side.host).querySelectorAll(':scope > .urd-block')].map((el) => {
    const block = section.blocks.find((b) => b.id === el.dataset.blockId);
    return block?.frames?.desktop ? { el, block, y: block.frames.desktop.y, top: el.style.top } : null;
  }).filter(Boolean);
  const placed = blocks.filter((p) => !dockedToScreen(p.block));
  const contentBottom = Math.round(Math.max(0, ...placed.map((p) => p.y + pushShiftOf(p.el) + p.el.offsetHeight)));
  return {
    host: side.host, section, grid,
    heightPx: side.host.getBoundingClientRect().height - sectionClearance(side.host),
    contentBottom, blocks, blockYs: placed.map((p) => p.y),
    minHeight: side.host.style.minHeight, minHeightData: side.host.dataset.urdMinHeight,
  };
}

/** The line where a shrink meets the content, drawn in the section it shrinks while the drag lasts. */
function seamFloor(host) {
  const line = document.createElement('div');
  line.className = 'urd-seam-floor';
  host.appendChild(line);
  return line;
}

function wireSeamDrag(btn, part, above, below, grip, index) {
  const readout = () => grip.querySelector('.urd-seam-readout');
  /** A section's own inline height as the drag found it. */
  const restore = (s) => {
    s.host.style.minHeight = s.minHeight;
    if (s.minHeightData === undefined) delete s.host.dataset.urdMinHeight;
    else s.host.dataset.urdMinHeight = s.minHeightData;
  };
  /** Applies a result from the start: the section that changes takes it, the other stands as the drag found it, and only the section below's blocks move, as it changes at its top. */
  const apply = (a, b, r, scrollY) => {
    if (a) {
      if (r.side === 'above') setMinHeight(a.host, r.heightPx);
      else restore(a);
    }
    if (b) {
      if (r.side === 'below') setMinHeight(b.host, r.heightPx);
      else restore(b);
      for (const p of b.blocks) p.el.style.top = r.side === 'below' && r.dy ? `${(Number.parseFloat(p.top) || p.y) + r.dy}px` : p.top;
    }
    // The section below changed at its top: the page scrolls by as much, so its content stands still.
    window.scrollTo({ top: Math.max(0, scrollY + (r.side === 'below' ? r.dy : 0)), behavior: 'instant' });
  };
  /** What the grip says: the height of the section above, or the space at the top of the section below (its height where it holds no block of its own). */
  const words = (r, b) => {
    if (r.side === 'above' || (r.side === 'below' && !b.blockYs.length)) return ta('canvas.seam.height', { n: String(Math.round(r.heightPx)) });
    if (r.side === 'below') return ta('canvas.seam.space', { n: String(Math.round(Math.min(...b.blockYs) + r.dy)) });
    return '';
  };
  /** Writes what the drag ended on: the section's height, and for the section below its blocks' new y in the same undo step. */
  const commit = (a, b, r) => {
    const side = r.side === 'above' ? a : r.side === 'below' ? b : null;
    if (!side || Math.abs(r.heightPx - side.heightPx) < 1) return;
    const minHeight = `${Math.round(r.heightPx)}px`;
    side.section.size = { ...side.section.size, minHeight };
    if (r.side === 'below' && r.dy) {
      for (const p of b.blocks) p.block.frames.desktop = { ...p.block.frames.desktop, y: p.y + r.dy };
      post({ type: 'urd-section-size', sectionId: side.section.id, minHeight, moves: b.blocks.map((p) => ({ blockId: p.block.id, dy: r.dy })) });
    } else {
      post({ type: 'urd-section-size', sectionId: side.section.id, minHeight });
    }
  };
  const model = (a, b, dyPointer, ev) => seamDrag({
    part,
    dyPointer,
    above: a,
    below: b && { heightPx: b.heightPx, blockYs: b.blockYs },
    grid: (part === 'shrinkBelow' || (part === 'grow' && dyPointer < 0) ? b : a)?.grid ?? (a ?? b)?.grid ?? { size: 8 },
    free: ev.ctrlKey || ev.metaKey,
    past: ev.altKey,
  });

  btn.addEventListener('pointerdown', (event) => {
    if (event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();
    btn.setPointerCapture(event.pointerId);
    // The part takes the focus, so Escape reaches this page while the drag lasts.
    btn.focus({ preventScroll: true });
    // Every block stands at its place in the section while the drag lasts, as for a block's own drag.
    suspendSticky();
    suspendPush();
    const startY = event.clientY;
    const scrollY = window.scrollY;
    const a = seamSide(above);
    const b = seamSide(below);
    const cursor = dragCursor();
    // The line the shrink stops at, in the section it shrinks.
    const floor = part === 'shrinkAbove' && a ? seamFloor(a.host) : part === 'shrinkBelow' && b ? seamFloor(b.host) : null;
    const floorAt = (r) => {
      if (!floor) return;
      const clear = sectionClearance((part === 'shrinkAbove' ? a : b).host);
      if (part === 'shrinkBelow' && !b.blockYs.length) return;
      const y = part === 'shrinkAbove' ? a.contentBottom : Math.min(...b.blockYs) + r.dy;
      floor.style.top = `${clear + y}px`;
      floor.classList.toggle('urd-seam-past', r.overlaps);
    };
    let result = { side: null, heightPx: 0, dy: 0, stopped: false, overlaps: false };
    let moved = false;
    grip.classList.add('urd-seam-active');
    btn.classList.add('urd-seam-on');

    const onMove = (ev) => {
      if (!moved && Math.abs(ev.clientY - startY) < 4) return;
      moved = true;
      cursor.move(ev.clientY);
      result = model(a, b, ev.clientY - startY, ev);
      apply(a, b, result, scrollY);
      floorAt(result);
      const shown = readout();
      shown.hidden = !result.side;
      shown.textContent = [words(result, b), result.overlaps ? ta('canvas.seam.overlaps') : result.stopped ? ta('canvas.seam.stopped') : ''].filter(Boolean).join(' · ');
    };
    const done = () => {
      btn.removeEventListener('pointermove', onMove);
      btn.removeEventListener('pointerup', onUp);
      btn.removeEventListener('pointercancel', cancel);
      btn.removeEventListener('lostpointercapture', onUp);
      window.removeEventListener('keydown', onKey, true);
      cursor.clear();
      floor?.remove();
      readout().hidden = true;
      grip.classList.remove('urd-seam-active');
      btn.classList.remove('urd-seam-on');
    };
    const settle = () => {
      resumeSticky();
      resumePush();
    };
    const onUp = () => {
      done();
      if (moved) commit(a, b, result);
      settle();
    };
    // Escape, or a drag the browser takes away, puts the seam back where it began.
    const cancel = () => {
      done();
      apply(a, b, { side: null, heightPx: 0, dy: 0 }, scrollY);
      settle();
    };
    const onKey = (ev) => {
      if (ev.key !== 'Escape') return;
      ev.preventDefault();
      ev.stopPropagation();
      cancel();
    };
    btn.addEventListener('pointermove', onMove);
    btn.addEventListener('pointerup', onUp);
    btn.addEventListener('pointercancel', cancel);
    btn.addEventListener('lostpointercapture', onUp);
    window.addEventListener('keydown', onKey, true);
  });

  // The arrow keys move the part one grid step, Shift one pixel, as one change each; they go no further, so a selected block stays where it is.
  btn.addEventListener('keydown', (event) => {
    if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;
    event.preventDefault();
    event.stopPropagation();
    suspendSticky();
    suspendPush();
    const a = seamSide(above);
    const b = seamSide(below);
    const step = event.shiftKey ? 1 : ((part === 'shrinkBelow' || (part === 'grow' && event.key === 'ArrowUp') ? b : a)?.grid?.size || 8);
    const dy = event.key === 'ArrowDown' ? step : -step;
    const r = model(a, b, dy, { ctrlKey: event.shiftKey, metaKey: false, altKey: event.altKey });
    apply(a, b, r, window.scrollY);
    commit(a, b, r);
    resumeSticky();
    resumePush();
    // The page is drawn anew as the change comes back, with new seams: the same part takes the focus again once it stands.
    setTimeout(() => document.querySelectorAll('.urd-add-section')[index]?.querySelector(`[data-seam="${part}"]`)?.focus({ preventScroll: true }), 150);
  });
}

/**
 * A seam in the phone view (0.7.3.26), drawn and dragged as the desktop's seam is (seamGrip): a pill on the line that grows, the room below the section above's blocks as it is dragged down and the room above the section below's as it is dragged up, and a tab above and a tab below it that each shrink the room in the section they stand in (phoneSeamDrag in section-size.js). The first seam has only a section below and the last only one above, so they carry one tab.
 * The room is the phone's own (size.mobilePadTop and mobilePadBottom, phoneRoomOf in migrate.js), with no upper bound, in steps of 4 px, Shift for 1; the flows' padding follows the pointer, and the release writes one urd-section-phone-room. Escape puts it back, and the arrow keys move a part a step at a time.
 * The line follows the pointer either way: where the room above the section below changes, the page scrolls by as much, so the section below's blocks stand still and the line moves, as the desktop's seam does.
 * @param {number} index Where the seam stands among the page's seams
 * @param {HTMLElement|null} aboveHost The section above, with its data
 * @param {object|null} aboveSection
 * @param {HTMLElement|null} belowHost The section below, with its data
 * @param {object|null} belowSection
 */
function phoneSeam(index, aboveHost, aboveSection, belowHost, belowSection) {
  const bar = document.createElement('div');
  bar.className = 'urd-add-section urd-phone-seam';
  const grip = document.createElement('div');
  grip.className = 'urd-seam-grip';
  const above = aboveHost ? { host: aboveHost, section: aboveSection } : null;
  const below = belowHost ? { host: belowHost, section: belowSection } : null;
  const part = (kind, cls, svg, label) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = cls;
    btn.dataset.seam = kind;
    btn.setAttribute('aria-label', ta(label));
    btn.title = ta(label);
    btn.innerHTML = svg;
    wirePhoneRoom(btn, kind, above, below, grip, index);
    return btn;
  };
  if (above) grip.append(part('shrinkAbove', 'urd-seam-tab urd-seam-up', SEAM_UP_SVG, 'canvas.phoneSeam.shrinkAbove'));
  grip.append(part('grow', 'urd-seam-pill', GRIP_SVG, above && below ? 'canvas.phoneSeam.grow' : above ? 'canvas.phoneSeam.growAbove' : 'canvas.phoneSeam.growBelow'));
  if (below) grip.append(part('shrinkBelow', 'urd-seam-tab urd-seam-down', SEAM_DOWN_SVG, 'canvas.phoneSeam.shrinkBelow'));
  const readout = document.createElement('span');
  readout.className = 'urd-seam-readout';
  readout.hidden = true;
  grip.append(readout);
  bar.append(grip);
  return bar;
}

/** A part of a phone seam's grip: its drag and its keys set the room of the section above or below it (phoneSeam, phoneSeamDrag). */
function wirePhoneRoom(btn, part, above, below, grip, index) {
  /** A side's section as drawn now, its flow, its room and the padding the room stands in. */
  const sideOf = (s, key) => {
    if (!s) return null;
    const section = s.host._urdSection ?? s.section;
    const flow = s.host.querySelector('.urd-flow');
    const prop = key === 'top' ? 'paddingTop' : 'paddingBottom';
    return { section, flow, key, prop, room: phoneRoomOf(section)[key], was: flow?.style[prop] ?? '' };
  };
  const show = (px) => {
    const shown = grip.querySelector('.urd-seam-readout');
    if (!shown) return;
    shown.hidden = px === null;
    if (px !== null) shown.textContent = ta('canvas.phoneSeam.room', { n: String(px) });
  };
  /** Draws a result from the drag's start: the side that changes takes its room, the other stands as the drag found it; a change above the section below's blocks scrolls the page by as much, so they stand still under the pointer's line. */
  const apply = (a, b, r, scrollY) => {
    for (const [side, name] of [[a, 'above'], [b, 'below']]) {
      if (!side?.flow) continue;
      side.flow.style[side.prop] = r.side === name ? `${r.room}px` : side.was;
    }
    window.scrollTo({ top: Math.max(0, scrollY + (r.side === 'below' && b ? r.room - b.room : 0)), behavior: 'instant' });
  };
  const model = (a, b, dy, fine) => phoneSeamDrag({ part, dy, above: a?.room ?? null, below: b?.room ?? null, fine });
  /** Writes what the drag ended on: the room of the side that changed. */
  const commit = (a, b, r) => {
    const side = r.side === 'above' ? a : r.side === 'below' ? b : null;
    if (!side || r.room === side.room) return;
    post({ type: 'urd-section-phone-room', sectionId: side.section.id, side: side.key, px: r.room });
  };

  btn.addEventListener('pointerdown', (event) => {
    if (event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();
    btn.setPointerCapture(event.pointerId);
    btn.focus({ preventScroll: true });
    const startY = event.clientY;
    const scrollY = window.scrollY;
    const a = sideOf(above, 'bottom');
    const b = sideOf(below, 'top');
    // Every pinned block stands at its place in the section while the drag lasts, as for the desktop's seams.
    suspendSticky();
    let result = { side: null, room: 0 };
    let moved = false;
    const cursor = dragCursor();
    grip.classList.add('urd-seam-active');
    btn.classList.add('urd-seam-on');
    const onMove = (ev) => {
      if (!moved && Math.abs(ev.clientY - startY) < 4) return;
      moved = true;
      cursor.move(ev.clientY);
      result = model(a, b, ev.clientY - startY, ev.shiftKey);
      apply(a, b, result, scrollY);
      show(result.side ? result.room : null);
    };
    const done = () => {
      btn.removeEventListener('pointermove', onMove);
      btn.removeEventListener('pointerup', onUp);
      btn.removeEventListener('pointercancel', cancel);
      btn.removeEventListener('lostpointercapture', onUp);
      window.removeEventListener('keydown', onKey, true);
      cursor.clear();
      show(null);
      grip.classList.remove('urd-seam-active');
      btn.classList.remove('urd-seam-on');
      resumeSticky();
    };
    const onUp = () => {
      done();
      if (moved) commit(a, b, result);
    };
    // Escape, or a drag the browser takes away, puts the room back where it began.
    const cancel = () => {
      done();
      apply(a, b, { side: null, room: 0 }, scrollY);
    };
    const onKey = (ev) => {
      if (ev.key !== 'Escape') return;
      ev.preventDefault();
      ev.stopPropagation();
      cancel();
    };
    btn.addEventListener('pointermove', onMove);
    btn.addEventListener('pointerup', onUp);
    btn.addEventListener('pointercancel', cancel);
    btn.addEventListener('lostpointercapture', onUp);
    window.addEventListener('keydown', onKey, true);
  });

  // The arrow keys move the part a step, Shift a pixel, as one change each, as a drag of that length would; the part takes the focus again once the page stands anew.
  btn.addEventListener('keydown', (event) => {
    if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;
    event.preventDefault();
    event.stopPropagation();
    const step = event.shiftKey ? 1 : 4;
    const a = sideOf(above, 'bottom');
    const b = sideOf(below, 'top');
    const r = model(a, b, event.key === 'ArrowDown' ? step : -step, true);
    apply(a, b, r, window.scrollY);
    commit(a, b, r);
    setTimeout(() => document.querySelectorAll('.urd-phone-seam')[index]?.querySelector(`[data-seam="${part}"]`)?.focus({ preventScroll: true }), 150);
  });
}

/**
 * Adds "+ New section" bars between (and around) the sections. Called by
 * render.js after every full page render in preview mode.
 *
 * @param {HTMLElement} root The page's root element
 * @param {object} page Page data (for the section count)
 * @param {object} site site.json (the grid for dragging on the section boundary)
 */
/** The site the page was last drawn with, for a section drawn out of sight while a block is dragged on the phone (flowDrag's preview). */
let siteNow = null;

export function enhancePage(root, page, site) {
  siteNow = site;
  initTextToolbar();
  root.querySelectorAll('.urd-add-section').forEach((el) => el.remove());
  const hosts = [...root.querySelectorAll(':scope > .urd-section')];
  // The phone view builds no structure: its seams carry only the grip of the room above and below the sections' blocks (phoneSeam).
  if (isMobile()) {
    hosts.forEach((el, i) => root.insertBefore(phoneSeam(i, hosts[i - 1] ?? null, page.sections[i - 1] ?? null, el, page.sections[i]), el));
    if (hosts.length) root.appendChild(phoneSeam(hosts.length, hosts.at(-1), page.sections.at(-1), null, null));
    return;
  }
  // The bar sits on the seam between two sections and holds the seam's grip (seamGrip) and the gallery of section templates.
  const above = (i) => (i > 0 ? {
    host: hosts[i - 1],
    section: page.sections[i - 1],
    grid: page.sections[i - 1]?.grid ?? site.grid,
  } : null);
  const below = (i) => (i < hosts.length ? {
    host: hosts[i],
    section: page.sections[i],
    grid: page.sections[i]?.grid ?? site.grid,
  } : null);
  hosts.forEach((el, i) => root.insertBefore(makeSectionAdder(i, above(i), below(i)), el));
  root.appendChild(makeSectionAdder(hosts.length, above(hosts.length), null));
}

/**
 * Opens the "+ New section" gallery toward the side of its bar that has room in the view, and holds it to that room, so it stays inside the frame as a category switch grows it.
 * The side is chosen on the tallest the gallery can be (its CSS cap): downward when that fits below, upward when it does not and there is more room above, never upward from a bar with no section above it.
 * The gallery stands 8 px off its bar and keeps 8 px from the frame's edge; the cap is read in the gallery's own units and drawn at the chrome scale.
 */
function placePresetMenu(bar, menu) {
  const scale = Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--urd-chrome-scale')) || 1;
  const cap = Number.parseFloat(getComputedStyle(menu).maxHeight) || 460;
  const barY = bar.getBoundingClientRect().top;
  const below = window.innerHeight - barY - 16;
  const above = barY - 16;
  const up = cap * scale > below && above > below && Boolean(bar.previousElementSibling);
  menu.classList.toggle('urd-preset-up', up);
  const room = up ? above : below;
  menu.style.maxHeight = `${Math.max(160, Math.floor(Math.min(cap, room / scale)))}px`;
}

/** The "+ New section" bar on a seam: the seam's grip stands in the middle of the line (seamGrip), and its
 *  chip shows the preset choices from the registry, pressed by the section toolbar's «New section» above
 *  it (openSectionGalleryBelow) and standing on its own only on an empty page. */
function makeSectionAdder(index, above = null, below = null) {
  const bar = document.createElement('div');
  bar.className = 'urd-add-section';

  const collapse = () => {
    bar.classList.remove('open');
    bar.replaceChildren(...[openBtn, grip].filter(Boolean));
  };

  const openBtn = document.createElement('button');
  openBtn.className = 'urd-add-section-chip';
  openBtn.textContent = ta('canvas.newSection');
  const grip = above || below ? seamGrip(index, above, below) : null;
  openBtn.addEventListener('click', () => {
    bar.classList.add('open');
    bar.replaceChildren();

    // The preset gallery in category-sidebar form: a narrow category list
    // on the left (All, the core groups, Plugins, My templates), a grid
    // with search on the right. The groups keep the registry's order;
    // presets without a group land under "Other".
    const menu = document.createElement('div');
    menu.className = 'urd-preset-menu';

    // The sources are collected ONCE at opening: core groups keyed by the
    // group STRING (display via groupKey - the plugin contract), plugin
    // presets and plugin-provided templates (kind section, via the re-id
    // rule) in their own group.
    const groups = new Map();
    const pluginDefs = [];
    for (const id of window.Urd.sections.ids()) {
      const def = window.Urd.sections.get(id);
      // A shop template stands in the gallery while the shop's blocks do; a section made only by its page template never does.
      if (def.shop && !shopBlocksOn) continue;
      if (def.pageOnly) continue;
      if (def.fromPlugin) {
        pluginDefs.push(def);
        continue;
      }
      const group = def.group ?? '';
      if (!groups.has(group)) groups.set(group, { labelKey: def.groupKey ?? null, defs: [] });
      groups.get(group).defs.push(def);
    }
    for (const id of window.Urd.templates?.ids?.() ?? []) {
      const tpl = window.Urd.templates.get(id);
      if (tpl?.kind !== 'section' || !tpl.section) continue;
      pluginDefs.push({ label: tpl.name ?? id, fromPlugin: tpl.fromPlugin, create: () => cloneSectionForInsert(tpl.section, makeId) });
    }
    if (pluginDefs.length) groups.set('__plugins', { labelKey: 'panel.plugins', defs: pluginDefs });
    const groupLabel = (name, labelKey) => (labelKey ? ta(labelKey) : (name || ta('canvas.groupOther')));

    // The category colors: each group gets a fixed color step derived from
    // the admin accent in base.css (--urd-category-1..5, cyclic with more
    // groups); My templates always has step 5. The color is set as
    // --urd-category-color on cards, headings and category buttons.
    const TEMPLATE_CAT = 5;
    const categoryFor = new Map([...groups.keys()].map((name, i) => [name, (i % 5) + 1]));
    const setCategory = (el, category) => el.style.setProperty('--urd-category-color', `var(--urd-category-${category})`);
    const makeDot = () => {
      const dot = document.createElement('span');
      dot.className = 'urd-preset-dot';
      return dot;
    };

    // The category rail: All + the groups + My templates (the relevance
    // rule: an empty plugin group does not exist in groups and therefore
    // gets no button).
    const rail = document.createElement('div');
    rail.className = 'urd-preset-rail';
    const railTitle = document.createElement('span');
    railTitle.className = 'urd-preset-rail-title';
    railTitle.textContent = ta('canvas.newSectionTitle');
    rail.appendChild(railTitle);

    const main = document.createElement('div');
    main.className = 'urd-preset-main';
    const top = document.createElement('div');
    top.className = 'urd-preset-top';
    const search = document.createElement('input');
    search.type = 'text';
    search.className = 'urd-preset-search';
    search.placeholder = ta('canvas.searchSections');
    search.title = ta('canvas.searchSections');
    const cancel = document.createElement('button');
    cancel.type = 'button';
    cancel.className = 'urd-preset-close';
    cancel.innerHTML = CROSS_SVG;
    cancel.title = ta('confirm.cancel');
    cancel.addEventListener('click', collapse);
    top.append(search, cancel);
    const content = document.createElement('div');
    content.className = 'urd-preset-content';
    main.append(top, content);
    menu.append(rail, main);

    /** Preset card in the grid: thumbnail + name, the hint as a tooltip.
     *  A throwing plugin preset must never topple the menu: a text card
     *  without a sketch instead. */
    const buildCard = (def, category) => {
      const choice = document.createElement('button');
      choice.type = 'button';
      choice.className = 'urd-preset-card';
      setCategory(choice, category);
      if (def.hintKey || def.hint) choice.title = def.hintKey ? ta(def.hintKey) : def.hint;
      try {
        const thumb = document.createElement('span');
        thumb.className = 'urd-preset-thumb';
        thumb.insertAdjacentHTML('afterbegin', presetThumb(def.create()));
        choice.appendChild(thumb);
      } catch { /* text-only card without a thumbnail */ }
      const label = document.createElement('span');
      label.className = 'urd-preset-label';
      label.textContent = def.labelKey ? ta(def.labelKey) : def.label;
      choice.appendChild(label);
      choice.addEventListener('click', () => {
        post({ type: 'urd-add-section', index, section: def.create() });
        // The re-render removes the menu from the DOM: clean up the document listener now instead of at the next stray click.
        cleanupOutside();
      });
      return choice;
    };

    const buildGrid = (entries) => {
      const grid = document.createElement('div');
      grid.className = 'urd-preset-grid';
      for (const { def, category } of entries) grid.appendChild(buildCard(def, category));
      return grid;
    };

    // My templates: a grid with a large thumbnail, name and delete button.
    // Insertion goes via cloneSectionForInsert (the re-id rule in
    // SCHEMA.md): new ids every time, so the same template can be inserted
    // multiple times.
    const renderTemplates = () => {
      const list = templates.filter((m) => m.kind === 'section' && m.section);
      if (!list.length) {
        const empty = document.createElement('div');
        empty.className = 'urd-template-empty';
        empty.textContent = ta('canvas.templatesEmpty');
        content.appendChild(empty);
        return;
      }
      const grid = document.createElement('div');
      grid.className = 'urd-template-grid';
      for (const tpl of list) {
        const card = document.createElement('div');
        card.className = 'urd-template-card';
        const pick = document.createElement('button');
        pick.type = 'button';
        pick.className = 'urd-template-pick';
        try {
          const thumb = document.createElement('span');
          thumb.className = 'urd-template-thumb';
          thumb.insertAdjacentHTML('afterbegin', presetThumb(tpl.section));
          pick.appendChild(thumb);
        } catch { /* text-only card without a thumbnail */ }
        const nameEl = document.createElement('span');
        nameEl.className = 'urd-template-name';
        nameEl.textContent = tpl.name;
        pick.appendChild(nameEl);
        pick.addEventListener('click', () => {
          post({ type: 'urd-add-section', index, section: cloneSectionForInsert(tpl.section, makeId) });
          cleanupOutside();
        });
        const del = document.createElement('button');
        del.type = 'button';
        del.className = 'urd-template-delete';
        del.innerHTML = BIN_SVG;
        del.title = ta('canvas.deleteTemplate');
        del.addEventListener('click', (event) => {
          // The editor owns the confirmation and deletion; the menu closes
          // so the list is fresh the next time it opens.
          event.stopPropagation();
          post({ type: 'urd-delete-template', id: tpl.id });
          cleanupOutside();
          collapse();
        });
        setCategory(card, TEMPLATE_CAT);
        card.append(pick, del);
        grid.appendChild(card);
      }
      content.appendChild(grid);
    };

    // The search always spans all categories (a flat, ranked hit list like
    // the block menu's) and matches the visible labels.
    const searchables = [];
    for (const [name, { defs }] of groups) {
      for (const def of defs) searchables.push({ label: def.labelKey ? ta(def.labelKey) : def.label, def, category: categoryFor.get(name) });
    }
    const templateDef = (tpl) => ({ label: tpl.name, create: () => cloneSectionForInsert(tpl.section, makeId) });

    // Set while the other languages load, so the grid is drawn again once when they are in.
    let langsWaiting = false;
    const renderContent = () => {
      content.replaceChildren();
      const query = search.value.trim();
      if (query) {
        const all = [...searchables,
          ...templates.filter((m) => m.kind === 'section' && m.section).map((m) => ({ label: m.name, def: templateDef(m), category: TEMPLATE_CAT }))];
        // The other languages load on the first query, and the grid is drawn again when they are in (search-langs.js).
        if (!searchLanguagesReady() && !langsWaiting) {
          langsWaiting = true;
          loadSearchLanguages().then(() => {
            langsWaiting = false;
            if (search.isConnected && search.value.trim()) renderContent();
          });
        }
        const found = searchItemsAny(all, query, (item) => item.label);
        if (!found.length) {
          const empty = document.createElement('div');
          empty.className = 'urd-template-empty';
          empty.textContent = ta('canvas.searchEmpty');
          content.appendChild(empty);
          return;
        }
        content.appendChild(buildGrid(found));
        return;
      }
      if (presetCategory === 'templates') {
        renderTemplates();
        return;
      }
      for (const [name, { labelKey, defs }] of groups) {
        if (presetCategory !== 'all' && presetCategory !== name) continue;
        const category = categoryFor.get(name);
        // A single chosen category needs no heading above itself.
        if (presetCategory === 'all') {
          const heading = document.createElement('div');
          heading.className = 'urd-preset-group';
          setCategory(heading, category);
          heading.append(makeDot(), document.createTextNode(groupLabel(name, labelKey)));
          content.appendChild(heading);
        }
        content.appendChild(buildGrid(defs.map((def) => ({ def, category }))));
      }
    };

    // The category buttons; the choice is remembered per session. An
    // active search wins over the category until the field is cleared.
    const railButtons = new Map();
    const addRailButton = (id, label, category) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      if (id === 'all') btn.classList.add('urd-preset-rail-all');
      if (id === 'templates') btn.classList.add('urd-preset-rail-templates');
      if (category) setCategory(btn, category);
      btn.append(makeDot(), document.createTextNode(label));
      btn.addEventListener('click', () => {
        presetCategory = id;
        search.value = '';
        applyCategory();
      });
      railButtons.set(id, btn);
      rail.appendChild(btn);
    };
    addRailButton('all', ta('canvas.groupAll'), 1);
    for (const [name, { labelKey }] of groups) addRailButton(name, groupLabel(name, labelKey), categoryFor.get(name));
    addRailButton('templates', ta('canvas.tabMyTemplates'), TEMPLATE_CAT);
    if (!railButtons.has(presetCategory)) presetCategory = 'all';

    const applyCategory = () => {
      for (const [id, btn] of railButtons) btn.classList.toggle('on', id === presetCategory);
      renderContent();
    };
    search.addEventListener('input', renderContent);
    search.addEventListener('keydown', (event) => {
      // Enter inserts the first hit; Escape closes (like the block menu).
      if (event.key === 'Enter') content.querySelector('.urd-preset-card, .urd-template-pick')?.click();
      if (event.key === 'Escape') {
        cleanupOutside();
        collapse();
      }
      event.stopPropagation();
    });
    applyCategory();
    // Escape closes the gallery from anywhere inside it, a category button as well as the search.
    menu.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') return;
      cleanupOutside();
      collapse();
    });
    bar.appendChild(menu);
    placePresetMenu(bar, menu);
    search.focus({ preventScroll: true });

    // A click outside the menu closes it, the same expectation as elsewhere
    // in the editor. The listener is cleaned up on close and on preset
    // choice.
    const outside = (event) => {
      if (!menu.contains(event.target)) {
        cleanupOutside();
        collapse();
      }
    };
    function cleanupOutside() {
      document.removeEventListener('pointerdown', outside, true);
    }
    setTimeout(() => document.addEventListener('pointerdown', outside, true), 0);
    collapseOpenPresetMenu = () => {
      cleanupOutside();
      collapse();
    };
  });

  collapse();
  return bar;
}

/**
 * The tools of a text field written in place: the editor draws their bar over the canvas (editor/src/lib/TextToolbar.svelte), beside the phone or above the block, free of the canvas's edges, and the editing stays here, on the text and its selection.
 * While a text field is being written, its block's place and the selection's state (the level, the font, the size, the marks pressed, the colour and the highlight) go to the editor as urd-text-state, and the bar's commands come back as urd-text-cmd (textCommand): each is applied on the selection kept here, through contenteditable (execCommand) or the text's own markup, and the input event it fires saves it in the draft through text.js, as typing does.
 * A command leaves the focus where it is, so a picker in the editor stays open while its colour is tried live; the editor asks for the focus back where the owner goes on typing.
 */
let textToolbarReady = false;
/** The text tools' command, set once they are ready (urd-text-cmd). */
let textCommandRun = null;
/** The end of the writing of a text, set once the tools are ready (urd-text-end: a press in the editor outside its text bar). */
let textEditEnd = null;

/**
 * A command of the editor's text bar on the text being written (urd-text-cmd).
 * @param {string} cmd
 * @param {*} [value]
 * @param {boolean} [focus] The text takes the focus back, for the owner to go on typing
 */
export function textCommand(cmd, value, focus = false) {
  textCommandRun?.(cmd, value, focus);
}

/** The writing of the text being written ended from the editor (urd-text-end). */
export function endTextEditing() {
  textEditEnd?.();
}

/** The commands whose state the selection holds as pressed or not (document.queryCommandState). */
const TEXT_MARKS = ['bold', 'italic', 'underline', 'strikeThrough', 'superscript', 'subscript', 'justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull', 'insertUnorderedList', 'insertOrderedList'];

function initTextToolbar() {
  if (textToolbarReady) return;
  textToolbarReady = true;

  const exec = (name, value = null) => document.execCommand(name, false, value);

  // The selection in the text being written, kept as it changes: the editor's bar takes the focus or the pointer, and its commands are applied where the selection stood.
  let savedRange = null;
  const saveSelection = () => {
    const sel = document.getSelection();
    savedRange = sel && sel.rangeCount ? sel.getRangeAt(0).cloneRange() : null;
  };
  const restoreSelection = () => {
    if (!savedRange) return;
    const sel = document.getSelection();
    sel.removeAllRanges();
    sel.addRange(savedRange);
  };

  // --- Sentinel normalization: one technique for all inline styles on the
  // SELECTION (size, font, letter spacing). execCommand('fontName') does
  // the range surgery (splits partially selected text nodes, spans
  // multiple paragraphs); afterwards the markers are swapped for clean
  // spans. styleWithCSS is never touched, so themeify (font[color])
  // survives. ---
  const SENTINEL = 'urd-marker';

  // The markers: font[face] (the default without styleWithCSS) OR a span
  // with font-family set to the sentinel (some browsers, e.g. Firefox).
  const collectMarkers = () => {
    const out = [...activeText.querySelectorAll(`font[face="${SENTINEL}"]`)];
    for (const el of activeText.querySelectorAll('span[style]')) {
      if (el.style.fontFamily.replace(/["']/g, '') === SENTINEL) out.push(el);
    }
    return out;
  };
  const reselect = (nodes) => {
    const valid = nodes.filter((n) => n && n.isConnected);
    if (!valid.length) return;
    const range = document.createRange();
    range.setStartBefore(valid[0]);
    range.setEndAfter(valid[valid.length - 1]);
    const sel = document.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  };
  // Collapsed caret: expand to the word the caret sits in (like Word),
  // never with an invisible character in the stored HTML.
  const expandToWord = () => {
    const sel = document.getSelection();
    if (!sel || !sel.rangeCount || !sel.isCollapsed) return;
    const range = sel.getRangeAt(0);
    const node = range.startContainer;
    if (node.nodeType !== 3) return;
    const text = node.textContent;
    let start = range.startOffset;
    let end = range.startOffset;
    while (start > 0 && /\S/.test(text[start - 1])) start--;
    while (end < text.length && /\S/.test(text[end])) end++;
    if (start === end) return;
    const r = document.createRange();
    r.setStart(node, start);
    r.setEnd(node, end);
    sel.removeAllRanges();
    sel.addRange(r);
  };
  // Set a fixed inline value (value null/'' = remove the style, "Inherit") on the selection.
  const applyInlineStyle = (prop, value) => {
    if (!activeText) return;
    expandToWord();
    exec('fontName', SENTINEL);
    const markers = collectMarkers();
    if (!markers.length) return;
    const made = [];
    for (const marker of markers) {
      const span = document.createElement('span');
      if (value != null && value !== '') span.style[prop] = value;
      while (marker.firstChild) span.appendChild(marker.firstChild);
      stripDescendantProp(span, prop);
      if (span.getAttribute('style')) {
        marker.replaceWith(span);
        made.push(span);
      } else {
        const kids = [...span.childNodes];
        marker.replaceWith(...kids);
        made.push(...kids);
      }
    }
    reselect(made);
    activeText.dispatchEvent(new Event('input', { bubbles: true }));
  };
  // Size per run (A-up/A-down and ±1px): each text run is stepped from ITS
  // own computed size, so mixed selections are preserved. Works directly
  // on the text nodes (not via a fontName marker, which merges neighboring
  // runs).
  const applySizeStep = (read) => {
    if (!activeText) return;
    expandToWord();
    const sel = document.getSelection();
    if (!sel || !sel.rangeCount) return;
    const range = sel.getRangeAt(0);
    if (range.collapsed) return;
    // Split the text nodes at the selection boundaries, so the runs align on nodes.
    if (range.startContainer.nodeType === 3 && range.startOffset > 0) {
      const after = range.startContainer.splitText(range.startOffset);
      range.setStart(after, 0);
    }
    if (range.endContainer.nodeType === 3 && range.endOffset < range.endContainer.length) {
      range.endContainer.splitText(range.endOffset);
    }
    sel.removeAllRanges();
    sel.addRange(range);
    const runs = [];
    const walker = document.createTreeWalker(activeText, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      if (node.textContent && sel.containsNode(node, false)) runs.push(node);
    }
    if (!runs.length) return;
    const made = [];
    for (const tn of runs) {
      const parent = tn.parentElement;
      const next = read(parseFloat(getComputedStyle(parent).fontSize));
      // Is the run the ENTIRE content of a size span? Update it in place,
      // so repeated stepping does not stack new spans.
      if (parent.tagName === 'SPAN' && parent.childNodes.length === 1 && parent.style.fontSize) {
        parent.style.fontSize = `${next}px`;
        made.push(parent);
      } else {
        const span = document.createElement('span');
        span.style.fontSize = `${next}px`;
        parent.insertBefore(span, tn);
        span.appendChild(tn);
        made.push(span);
      }
    }
    reselect(made);
    activeText.dispatchEvent(new Event('input', { bubbles: true }));
  };

  // Block-level operations (line height, indent): affect the paragraphs in
  // the selection, not individual words.
  const BLOCK_SEL = TEXT_BLOCKS;
  const blocksInRange = () => {
    const sel = document.getSelection();
    if (!sel || !sel.rangeCount || !activeText) return [];
    const range = sel.getRangeAt(0);
    const leaf = (list) => list.filter((el) => !list.some((o) => o !== el && el.contains(o)));
    let hits = leaf([...activeText.querySelectorAll(BLOCK_SEL)].filter((el) => range.intersectsNode(el)));
    if (!hits.length) {
      // Only bare text nodes directly in the field: normalize to one paragraph first.
      exec('formatBlock', 'p');
      hits = leaf([...activeText.querySelectorAll(BLOCK_SEL)].filter((el) => range.intersectsNode(el)));
    }
    return hits;
  };
  const setLineHeight = (value) => {
    if (!activeText) return;
    for (const el of blocksInRange()) {
      el.style.lineHeight = value;
      if (el.getAttribute('style') === '') el.removeAttribute('style');
    }
    activeText.dispatchEvent(new Event('input', { bubbles: true }));
  };
  const applyIndent = (dir) => {
    if (!activeText) return;
    const hits = blocksInRange();
    // Pure lists: let the browser create/tear down levels (correct ul nesting).
    if (hits.length && hits.every((el) => el.tagName === 'LI')) {
      exec(dir > 0 ? 'indent' : 'outdent');
      return;
    }
    for (const el of hits) {
      if (el.tagName === 'LI') continue;
      el.style.marginLeft = stepIndent(el.style.marginLeft, dir);
      if (el.getAttribute('style') === '') el.removeAttribute('style');
    }
    activeText.dispatchEvent(new Event('input', { bubbles: true }));
  };
  // Quote is a toggle: where the caret stands in a quote, it becomes a paragraph again.
  const toggleQuote = () => {
    let inQuote = false;
    try { inQuote = (document.queryCommandValue('formatBlock') || '').toLowerCase() === 'blockquote'; } catch { /* noop */ }
    exec('formatBlock', inQuote ? 'p' : 'blockquote');
  };
  // Clear formatting: the marks, the links and the paragraphs' own spacing and indent, all the words left as plain paragraphs.
  const clearFormatting = () => {
    exec('removeFormat');
    exec('unlink');
    exec('formatBlock', 'p');
    // removeFormat does not touch block-level style: reset the paragraphs too.
    for (const el of blocksInRange()) {
      el.style.lineHeight = '';
      el.style.marginLeft = '';
      if (el.getAttribute('style') === '') el.removeAttribute('style');
    }
    activeText.dispatchEvent(new Event('input', { bubbles: true }));
  };

  // A link: the editor's link editor opens over the admin (urd-link-edit), and its answer comes back as urd-link-apply (applyTextLink), which writes it on the selection kept here.
  // A link to a page or a spot on it keeps the page and the spot beside its address (data-urd-page, data-urd-target), which the text's render reads again, so the link follows a change of the page's address.
  /** The link being edited, or null for a new one on the selection. */
  let editedLink = null;
  /** The text and its block a link was asked for: the focus goes to the editor's link editor meanwhile, so its answer is written where it was asked for.
      The text's place among its block's texts and the words chosen as paths into it (caret-path.js) find both again on a text drawn anew meanwhile. */
  let linkField = null;
  let linkBlockId = null;
  let linkFieldIndex = -1;
  let linkWords = null;
  function editLink() {
    // Words that stand inside a link or a button already (the calendar's words) take no link of their own.
    if (!activeText || activeText.closest('a, button')) return;
    saveSelection();
    const sel = document.getSelection();
    const node = sel?.anchorNode instanceof Element ? sel.anchorNode : sel?.anchorNode?.parentElement;
    const a = node?.closest('a');
    // The link is edited when the caret stands in it or the words chosen lie inside it; words that run past it get a link of their own.
    const within = sel && sel.rangeCount && (sel.isCollapsed || a?.contains(sel.getRangeAt(0).commonAncestorContainer));
    editedLink = a && activeText.contains(a) && within ? a : null;
    const value = editedLink ? {
      ...(editedLink.dataset.urdPage ? { page: editedLink.dataset.urdPage } : {}),
      ...(editedLink.dataset.urdTarget ? { target: editedLink.dataset.urdTarget } : {}),
      ...(editedLink.dataset.urdPage || editedLink.dataset.urdTarget ? {} : { href: editedLink.getAttribute('href') ?? '' }),
      ...(editedLink.target === '_blank' ? { newTab: true } : {}),
      ...(editedLink.hasAttribute('download') ? { download: true } : {}),
      rel: LINK_RELS.filter((word) => editedLink.relList.contains(word)),
    } : null;
    linkField = activeText;
    linkBlockId = activeBlockId;
    const fields = [...(activeText.closest('.urd-block')?.querySelectorAll(EDITABLE_TEXT) ?? [])];
    linkFieldIndex = fields.indexOf(activeText);
    const range = savedRange;
    linkWords = range && activeText.contains(range.startContainer) && activeText.contains(range.endContainer)
      ? { start: pathTo(activeText, range.startContainer), startOffset: range.startOffset, end: pathTo(activeText, range.endContainer), endOffset: range.endOffset, inLink: Boolean(editedLink) }
      : null;
    post({ type: 'urd-link-edit', value, text: editedLink ? '' : (sel?.toString() ?? '').trim() });
  }

  /** Puts a link (the link shape) on an anchor: its address now, a new tab, the rel words, a file to save, and the page and the spot it stands for. */
  const setTextLink = (a, link, pages) => {
    const attrs = linkAttrs(resolveLink(link, pages));
    a.setAttribute('href', attrs.href);
    if (attrs.target) a.setAttribute('target', attrs.target); else a.removeAttribute('target');
    if (attrs.rel) a.setAttribute('rel', attrs.rel); else a.removeAttribute('rel');
    if (attrs.download !== undefined) a.setAttribute('download', ''); else a.removeAttribute('download');
    if (link.page) a.dataset.urdPage = link.page; else delete a.dataset.urdPage;
    if (link.target) a.dataset.urdTarget = link.target; else delete a.dataset.urdTarget;
  };

  /** The text the link was asked for, or, where it was drawn anew meanwhile, the text in its place in its block with the words chosen again in it and the link they stood in; null where they cannot be found, and the answer is then left. */
  const linkTarget = () => {
    if (linkField?.isConnected) return linkField;
    const fields = linkBlockId ? document.querySelector(`.urd-block[data-block-id="${linkBlockId}"]`)?.querySelectorAll(EDITABLE_TEXT) : null;
    const field = fields?.[linkFieldIndex] ?? null;
    if (!field || !linkWords) return null;
    const start = nodeAt(field, linkWords.start);
    const end = nodeAt(field, linkWords.end);
    if (!start || !end) return null;
    const range = document.createRange();
    try {
      range.setStart(start, linkWords.startOffset);
      range.setEnd(end, linkWords.endOffset);
    } catch {
      return null;
    }
    savedRange = range;
    const startEl = start instanceof Element ? start : start.parentElement;
    editedLink = linkWords.inLink ? startEl?.closest('a') ?? null : null;
    return field;
  };

  textLinkApply = (link, pages) => {
    // The text the link was asked for, which takes the focus back.
    const field = linkTarget();
    linkField = null;
    if (!field) {
      editedLink = null;
      return;
    }
    activeText = field;
    activeBlockId = linkBlockId;
    activeText.focus({ preventScroll: true });
    restoreSelection();
    if (!link) {
      if (editedLink?.isConnected) editedLink.replaceWith(...editedLink.childNodes);
      else exec('unlink');
    } else if (editedLink?.isConnected) {
      setTextLink(editedLink, link, pages);
    } else {
      const sel = document.getSelection();
      const marker = '#urd-link-new';
      if (sel && !sel.isCollapsed) {
        exec('createLink', marker);
      } else {
        // No words chosen: the link is written with words of its own: the page's title for a page, the spot's name for a spot on this page, else the address without its scheme and query.
        const words = document.createElement('span');
        const page = link.page ? pages.find((p) => p.id === link.page) : null;
        const spotName = !page && link.target ? document.querySelector(`.urd-anchor[data-spot="${CSS.escape(link.target)}"]`)?.id : null;
        words.textContent = page?.title ?? spotName ?? resolveLink(link, pages).href.replace(/^(?:https?:\/\/|mailto:|tel:)/i, '').replace(/\?.*$/, '');
        exec('insertHTML', `<a href="${marker}">${words.innerHTML}</a>`);
      }
      for (const a of activeText.querySelectorAll(`a[href="${marker}"]`)) setTextLink(a, link, pages);
    }
    editedLink = null;
    // The change is posted as typing is.
    activeText.dispatchEvent(new Event('input', { bubbles: true }));
    saveSelection();
    report();
  };

  // The theme color commands: execCommand can only write a FIXED color;
  // afterwards it is swapped for var(--urd-color-<token>) in the field, so
  // the content follows theme switches. execCommand normalizes colors
  // differently (hex/rgb), so matching happens in rgb form. Custom colors
  // deliberately remain detached hex.
  //
  // A token is resolved through a rendered probe, never read as the raw
  // variable text: with a dark variant the variable holds light-dark(...),
  // which only the computed style turns into the concrete rgb color.
  const tokenColor = (token) => {
    const probe = document.createElement('span');
    probe.style.color = `var(--urd-color-${token})`;
    (activeText ?? document.body).appendChild(probe);
    const value = getComputedStyle(probe).color;
    probe.remove();
    return value;
  };
  const normColor = (value) => {
    if (!value) return '';
    const v = String(value).trim().toLowerCase();
    const hex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/.exec(v);
    if (!hex) return v.replace(/\s+/g, ' ');
    let h = hex[1];
    if (h.length === 3) h = [...h].map((c) => c + c).join('');
    const n = parseInt(h, 16);
    return `rgb(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255})`;
  };
  const themeify = (token, styleProp) => {
    if (!activeText) return;
    const target = normColor(tokenColor(token));
    if (!target) return;
    for (const el of activeText.querySelectorAll('[style], font[color]')) {
      if (styleProp === 'color' && el.tagName === 'FONT' && normColor(el.getAttribute('color')) === target) {
        el.removeAttribute('color');
        el.style.color = `var(--urd-color-${token})`;
        continue;
      }
      if (normColor(el.style[styleProp]) === target) {
        el.style[styleProp] = `var(--urd-color-${token})`;
      }
    }
    // The swap happens outside execCommand: dispatch input ourselves, so the draft is saved.
    activeText.dispatchEvent(new Event('input', { bubbles: true }));
  };
  /** A colour on the selection: a theme colour by its name, which the words keep as the theme's (themeify), or a colour of its own as #rrggbb; the highlight's empty colour takes the highlight away. */
  const setColour = (styleProp, value) => {
    const cmd = styleProp === 'color' ? 'foreColor' : 'hiliteColor';
    if (!value) {
      if (cmd === 'hiliteColor') exec(cmd, 'transparent');
      return;
    }
    if (/^#[0-9a-f]{3,8}$/i.test(value)) {
      exec(cmd, value);
      return;
    }
    if (!/^[a-z][a-z0-9-]*$/i.test(value)) return;
    exec(cmd, tokenColor(value));
    themeify(value, styleProp);
  };

  /** The editor's bar's commands, by name: each on the selection kept here. */
  const COMMANDS = {
    level: (value) => { if (['p', 'h1', 'h2', 'h3'].includes(value)) exec('formatBlock', value); },
    font: (value) => applyInlineStyle('fontFamily', value || null),
    size: (value) => {
      if (value === '' || value == null) { applyInlineStyle('fontSize', null); return; }
      const px = clampSize(Number(value));
      if (px != null) applyInlineStyle('fontSize', `${px}px`);
    },
    sizeStep: (value) => applySizeStep((cur) => stepSize(cur, Math.sign(Number(value)) || 1)),
    mark: (value) => { if (TEXT_MARKS.includes(value)) exec(value); },
    indent: (value) => applyIndent(Math.sign(Number(value)) || 1),
    quote: () => toggleQuote(),
    colour: (value) => setColour('color', value),
    highlight: (value) => setColour('backgroundColor', value),
    lineHeight: (value) => setLineHeight(LINE_HEIGHTS.some(([v]) => v === value) ? value : ''),
    letterSpacing: (value) => applyInlineStyle('letterSpacing', value === '' || value == null || !Number.isFinite(Number(value)) ? null : `${Number(value)}px`),
    glyph: (value) => { if (typeof value === 'string' && value) exec('insertText', value); },
    link: () => editLink(),
    unlink: () => { exec('unlink'); activeText.dispatchEvent(new Event('input', { bubbles: true })); },
    clear: () => clearFormatting(),
  };

  textCommandRun = (cmd, value, focus) => {
    if (activeBlockId && (!activeText || !activeText.isConnected)) {
      activeText = document.querySelector(`.urd-block[data-block-id="${activeBlockId}"] .urd-text[contenteditable="true"]`);
    }
    const run = COMMANDS[cmd];
    if (!activeText || !run) return;
    // The selection as it stood is held through the focus, whose own focusin saves the caret wherever the browser put it.
    const kept = savedRange;
    if (focus) activeText.focus({ preventScroll: true });
    savedRange = kept;
    restoreSelection();
    run(value);
    saveSelection();
    report();
  };

  // Ctrl+B, Ctrl+I and Ctrl+U (⌘ on a Mac) are the bar's bold, italic and underline, so the keys and the bar make the same text.
  const MARK_KEYS = { b: 'bold', i: 'italic', u: 'underline' };
  document.addEventListener('keydown', (event) => {
    if (!activeText || !(event.target instanceof Node) || !activeText.contains(event.target)) return;
    if (!(event.ctrlKey || event.metaKey) || event.altKey || event.shiftKey) return;
    const mark = MARK_KEYS[event.key.toLowerCase()];
    if (!mark) return;
    event.preventDefault();
    exec(mark);
    report();
  });

  // Ctrl+K (⌘K) opens the link editor on the selection, and Ctrl+Shift+K takes the link away.
  document.addEventListener('keydown', (event) => {
    if (!activeText || !(event.target instanceof Node) || !activeText.contains(event.target)) return;
    if (!(event.ctrlKey || event.metaKey) || event.altKey || event.key.toLowerCase() !== 'k') return;
    event.preventDefault();
    if (!event.shiftKey) {
      editLink();
      return;
    }
    exec('unlink');
    activeText.dispatchEvent(new Event('input', { bubbles: true }));
  });

  // The text being written, and its block's id: a change of its props (the text style, the Properties panel) draws the section again and swaps the element, so it is found again by the id. Cleared on a deliberate end, so the tools let go.
  let activeText = null;
  let activeBlockId = null;

  /** The size the selection holds: the one where the caret stands, or the one every selected run shares; null for none or a mix. */
  const styledAncestor = (node) => {
    const el = node?.nodeType === 3 ? node.parentElement : node;
    return el instanceof HTMLElement && activeText.contains(el) ? el : null;
  };
  const selectionSize = () => {
    const sel = document.getSelection();
    if (!sel || !sel.rangeCount) return null;
    const range = sel.getRangeAt(0);
    if (range.collapsed) {
      const el = styledAncestor(range.startContainer);
      return el ? Math.round(parseFloat(getComputedStyle(el).fontSize)) : null;
    }
    // Every SELECTED text run is measured, not the selection's ends, which can point at a container after a reselect and read the field's base size.
    const sizes = new Set();
    const walker = document.createTreeWalker(activeText, NodeFilter.SHOW_TEXT);
    let n;
    while ((n = walker.nextNode())) {
      if (n.textContent && n.parentElement && sel.containsNode(n, true)) {
        sizes.add(Math.round(parseFloat(getComputedStyle(n.parentElement).fontSize)));
      }
    }
    return sizes.size === 1 ? [...sizes][0] : null;
  };
  const selectionFamily = () => {
    let el = styledAncestor(document.getSelection()?.anchorNode);
    while (el && el !== activeText) {
      if (el.style?.fontFamily) return el.style.fontFamily;
      if (el.tagName === 'FONT' && el.getAttribute('face')) return el.getAttribute('face');
      el = el.parentElement;
    }
    return '';
  };
  /** A computed colour as #rrggbb, or #rrggbbaa with an alpha; null for a see-through one. */
  const hexOfComputed = (value) => {
    const m = /^rgba?\(\s*(\d{1,3})[\s,]+(\d{1,3})[\s,]+(\d{1,3})(?:\s*[,/]\s*([\d.]+)(%?))?\s*\)$/.exec(String(value).trim());
    if (!m) return null;
    const alpha = m[4] === undefined ? 1 : Number(m[4]) / (m[5] ? 100 : 1);
    if (!(alpha > 0)) return null;
    const hex = '#' + [m[1], m[2], m[3]].map((n) => Math.min(255, Number(n)).toString(16).padStart(2, '0')).join('');
    return alpha >= 0.995 ? hex : hex + Math.round(alpha * 255).toString(16).padStart(2, '0');
  };
  /**
   * The colour and the highlight of the words where the selection starts (the first selected letters, or where the caret stands): a theme colour by its name where the words keep the theme's (themeify), else the colour as a code.
   * The highlight is the nearest one inside the text, null where the words have none.
   */
  const selectionColours = () => {
    const sel = document.getSelection();
    if (!sel || !sel.rangeCount) return { colour: null, highlight: null };
    const range = sel.getRangeAt(0);
    let el = null;
    if (range.collapsed) {
      el = styledAncestor(range.startContainer);
    } else {
      const walker = document.createTreeWalker(activeText, NodeFilter.SHOW_TEXT);
      let n;
      while ((n = walker.nextNode())) {
        const before = n === range.startContainer && range.startOffset >= n.length;
        const after = n === range.endContainer && range.endOffset === 0;
        if (n.textContent.trim() && !before && !after && sel.containsNode(n, true)) {
          el = styledAncestor(n);
          break;
        }
      }
    }
    if (!el) return { colour: null, highlight: null };
    const own = (prop) => {
      for (let x = el; x && x !== activeText; x = x.parentElement) {
        const set = (x.style?.[prop] || (prop === 'color' && x.tagName === 'FONT' ? x.getAttribute('color') : '') || '').trim();
        if (!set) continue;
        const token = /^var\(--urd-color-([a-z][a-z0-9-]*)\)$/i.exec(set);
        return token ? { token: token[1] } : { el: x };
      }
      return null;
    };
    const colourSet = own('color');
    const colour = colourSet?.token ?? hexOfComputed(getComputedStyle(el).color);
    const highlightSet = own('backgroundColor');
    const highlight = highlightSet ? highlightSet.token ?? hexOfComputed(getComputedStyle(highlightSet.el).backgroundColor) : null;
    return { colour, highlight };
  };
  /** The state the bar shows: the level and the quote where the caret stands, the marks pressed, the size, the font and the colours the selection holds, and whether the words can take a link. */
  const textState = () => {
    let level = 'p';
    let quote = false;
    try {
      const value = (document.queryCommandValue('formatBlock') || 'p').toLowerCase();
      level = ['h1', 'h2', 'h3'].includes(value) ? value : 'p';
      quote = value === 'blockquote';
    } catch { /* some browsers refuse before the first command */ }
    const marks = {};
    for (const cmd of TEXT_MARKS) {
      try { marks[cmd] = document.queryCommandState(cmd); } catch { marks[cmd] = false; }
    }
    return { level, quote, marks, size: selectionSize(), font: matchFontStack(selectionFamily()) || '', ...selectionColours(), linkable: !activeText.closest('a, button') };
  };

  /** Whether the editor's bar stands for a text now, so its end is told once. */
  let reported = false;
  let reportFrame = 0;
  /**
   * Tells the editor where the text being written stands and what its selection holds (urd-text-state), once a frame: its block's box in the canvas, above the block's own bar where that stands over it, so the editor's bar can stand clear of both; an empty message when no text is being written.
   */
  function report() {
    if (reportFrame) return;
    reportFrame = requestAnimationFrame(() => {
      reportFrame = 0;
      if (activeBlockId && (!activeText || !activeText.isConnected)) {
        activeText = document.querySelector(`.urd-block[data-block-id="${activeBlockId}"] .urd-text[contenteditable="true"]`);
      }
      const block = activeText?.isConnected ? activeText.closest('.urd-block') ?? activeText : null;
      const box = block?.getBoundingClientRect();
      if (!block || !box || (!box.width && !box.height) || document.body.classList.contains('urd-chrome-off')) {
        if (reported) post({ type: 'urd-text-state', blockId: null });
        reported = false;
        return;
      }
      // The block's own bar where it stands over the block; in the phone view the editor draws it, and the page's stands unseen.
      const chrome = block.querySelector(':scope > .urd-edit-toolbar');
      const chromeTop = chrome?.getClientRects().length && !chrome.classList.contains('urd-toolbar-under') ? chrome.getBoundingClientRect().top : box.top;
      reported = true;
      post({
        type: 'urd-text-state',
        blockId: activeBlockId,
        rect: { left: box.left, top: Math.min(box.top, chromeTop), right: box.right, bottom: box.bottom },
        state: textState(),
      });
    });
  }

  /** The text's writing ended: it lets go of the focus and the tools of their text. */
  const endWriting = () => {
    if (!activeText) return;
    activeText.blur();
    activeText = null;
    activeBlockId = null;
    savedRange = null;
    report();
  };
  textEditEnd = endWriting;

  document.addEventListener('focusin', (event) => {
    const target = event.target instanceof HTMLElement
      ? event.target.closest('.urd-text[contenteditable="true"]')
      : null;
    if (!target) return;
    if (target !== activeText) {
      activeText = target;
      activeBlockId = target.closest('.urd-block')?.dataset.blockId ?? null;
    }
    saveSelection();
    report();
  });
  // A font or a size for the whole text, from the block's menu (urd-text-style): written on every leaf paragraph and list item of the field, and taken off the runs inside, so the whole text reads alike (text-whole.js); null takes the theme's value back.
  document.addEventListener('urd-text-style', (event) => {
    const field = event.target instanceof HTMLElement ? event.target.closest('.urd-text[contenteditable="true"]') : null;
    const style = event.detail;
    if (!field || !style || typeof style !== 'object') return;
    activeText = field;
    activeBlockId = field.closest('.urd-block')?.dataset.blockId ?? null;
    applyWholeStyle(field, style);
    field.dispatchEvent(new Event('input', { bubbles: true }));
    report();
  });
  document.addEventListener('focusout', () => {
    // Wait a beat: the focus may be on its way to the colour picker's fields. Focus gone out of the canvas's document (the editor's text bar and its fields) keeps the writing, which the editor ends itself (urd-text-end).
    requestAnimationFrame(() => {
      if (!document.hasFocus()) return;
      const el = document.activeElement;
      if (el instanceof HTMLElement && el.closest('.urd-text[contenteditable="true"], .urd-cp')) return;
      // Was the field SWAPPED OUT by a re-render (typography/panel change), not abandoned by the user?
      // Then report reconnects via the block id instead of ending the writing.
      if (activeText && !activeText.isConnected && activeBlockId) {
        report();
        return;
      }
      activeText = null;
      activeBlockId = null;
      report();
    });
  });
  // A press anywhere in the canvas outside the field ends the writing.
  // The surface drag in preview swallows mousedown (preventDefault), so the text field never loses focus by itself; it is therefore ended explicitly here.
  // Presses in the color picker, the image editor or another text field must NOT end it (they handle themselves).
  document.addEventListener('pointerdown', (event) => {
    if (!activeText) return;
    const target = event.target instanceof Element ? event.target : null;
    if (!target || activeText.contains(target)) return;
    if (target.closest('.urd-text[contenteditable="true"], .urd-cp, .urd-imged, .urd-dd-menu')) return;
    endWriting();
  }, true);
  document.addEventListener('selectionchange', () => {
    // Only when the selection actually sits in the active field: it is kept for the bar's commands, and the bar shows what it holds.
    const sel = document.getSelection();
    if (activeText && sel?.anchorNode && activeText.contains(sel.anchorNode)) {
      saveSelection();
      report();
    }
  });
  window.addEventListener('scroll', () => { if (activeText) report(); }, { passive: true, capture: true });
  window.addEventListener('resize', () => { if (activeText) report(); });
}

/** The section's height brought to its blocks, one grid step under the lowest, from its bar or its right-click menu. */
function fitSectionHeight(host, section, grid) {
  const maxBottom = Math.max(0, ...section.blocks.filter((b) => !b.hideDesktop).map((b) => b.frames.desktop.y + b.frames.desktop.h));
  const px = Math.max(grid.size * 3, maxBottom + grid.size);
  const minHeight = `${px}px`;
  section.size = { ...section.size, minHeight };
  setMinHeight(host, px);
  post({ type: 'urd-section-size', sectionId: section.id, minHeight });
}

/** A tool of the section's bar with small panels: the editor opens the section's menu beside it narrowed to one group. */
function openSectionTool(host, section, only, title = '', icon = '') {
  markActiveVisual(host);
  const r = host.getBoundingClientRect();
  post({ type: 'urd-section-menu', sectionId: section.id, only, title, icon, rect: { left: r.left, top: r.top, right: r.right, bottom: r.bottom } });
}

/** Toolbar at the section's top right. Desktop: move up/down, fit height,
 *  delete. Mobile: reviewed (✓) and back to auto (↺). */
function addSectionToolbar(host, section, grid) {
  const bar = document.createElement('div');
  bar.className = `urd-section-toolbar urd-bar-size-${barSize()}`;
  // The form of the bar (barForm): the shorter ones keep the section's own additions and its layout, and leave the rest to the right-click menu under ⋮.
  const form = barForm();

  const mk = (label, title, onClick) => {
    const btn = document.createElement('button');
    if (label.startsWith('<svg')) btn.innerHTML = label; else btn.textContent = label;
    btn.title = title;
    btn.addEventListener('click', onClick);
    bar.appendChild(btn);
  };

  // The section's name for links, so the owner sees which spot a link lands on.
  if (isAnchorName(section.anchor)) {
    const tag = document.createElement('span');
    tag.className = 'urd-anchor-tag';
    tag.textContent = `#${section.anchor}`;
    tag.title = ta('tip.anchorTag');
    bar.appendChild(tag);
  }

  // The sections that need a phone review are reported to the editor, which draws their cards beside the phone (reportAttention), and the sections in sight as seen again, since one drawn anew may have changed (reportSeen).
  seenSent = '';
  scheduleAttention();
  if (isMobile()) {
    // Reset is shown only when the section actually has mobile overrides.
    if (section.blocks.some((b) => b.frames?.mobile)) {
      const reset = document.createElement('button');
      reset.innerHTML = RESET_SVG;
      reset.title = ta('canvas.mobileReset');
      reset.addEventListener('click', () => post({ type: 'urd-mobile-reset', sectionId: section.id }));
      bar.appendChild(reset);
    }
    // «Phone layout»: the presets that fill the phone's cells with the section's blocks, in the picker «Change layout» opens on the desktop.
    const phoneLayoutBtn = document.createElement('button');
    phoneLayoutBtn.className = 'urd-layout-btn';
    phoneLayoutBtn.title = ta('canvas.phoneLayout');
    phoneLayoutBtn.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="6" y="2.5" width="12" height="19" rx="2"/><path d="M6 9h12M12 9v8M6 17h12"/></svg>';
    phoneLayoutBtn.addEventListener('click', () => toggleLayoutPicker(host, (done) => buildPhoneLayoutCards(section, done), 'canvas.phoneLayoutTitle'));
    bar.appendChild(phoneLayoutBtn);
    // Hidden blocks are otherwise invisible in the mobile view: the chip
    // makes them rediscoverable, with an eye button per block that shows
    // it again.
    hiddenChip(host, bar, section, 'hideMobile');
  } else {
    // The blocks shown on phones only, likewise, so the desktop finds them again.
    hiddenChip(host, bar, section, 'hideDesktop');
    // Extensible presets: a "+ card/row/person" button that adds the NEXT item to the section.
    // The factory (def.item) lives in the preset definition; the section remains a generic container.
    const def = section.preset ? window.Urd.sections.get(section.preset) : null;
    if (def?.item) {
      const itemLabel = def.itemLabelKey ? ta(def.itemLabelKey) : (def.itemLabel ?? ta('canvas.itemFallback'));
      mk(`+ ${itemLabel}`, ta('canvas.addItemTitle', { label: itemLabel }), (event) => {
        // Disable until the section re-renders: a double-click before the round trip would put two items in the same slot.
        event.target.disabled = true;
        const next = def.item(section);
        post({ type: 'urd-add-blocks', sectionId: section.id, blocks: next.blocks, minBottom: next.bottom, moves: next.moves ?? [] });
        // Select and scroll to the new item after the re-render: a new
        // EMPTY frame is identical to its neighbors, so without this the
        // click looks dead.
        setTimeout(() => {
          const el = document.querySelector(`.urd-block[data-block-id="${next.blocks[0].id}"]`);
          if (!el) return;
          selectBlock(el);
          // 'nearest' instead of 'center': minimal movement, so the plus button stays in view during repeated additions.
          el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 150);
      });
    }
    if (form === 'full') {
      mk(ORDER_UP_SVG, ta('canvas.sectionUp'), () => post({ type: 'urd-move-section', sectionId: section.id, dir: -1 }));
      mk(ORDER_DOWN_SVG, ta('canvas.sectionDown'), () => post({ type: 'urd-move-section', sectionId: section.id, dir: 1 }));
      mk(DUPLICATE_SVG, ta('canvas.duplicateSection'), () => post({ type: 'urd-duplicate-section', sectionId: section.id }));
      mk(FIT_HEIGHT_SVG, ta('canvas.fitHeight'), () => fitSectionHeight(host, section, grid));
    }
    // "Change layout": only when the section has something to change
    // (the relevance rule: at least two movable blocks).
    if (applicableLayouts(section.blocks).length) {
      const layoutBtn = document.createElement('button');
      layoutBtn.className = 'urd-layout-btn';
      layoutBtn.title = ta('canvas.changeLayout');
      layoutBtn.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="7" height="18" rx="1"/><rect x="14" y="3" width="7" height="8" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>';
      layoutBtn.addEventListener('click', () => toggleLayoutPicker(host, (done) => buildLayoutCards(section, grid, done)));
      bar.appendChild(layoutBtn);
    }
    if (form === 'panels') bar.appendChild(opensMenu(barButton(BAR_ICONS.motion, ta('group.motion'), () => openSectionTool(host, section, 'motion', '', 'motion'))));
    // Every group a tool: each group of the section's menu, which the right-click menu under ⋮ follows with the rest.
    if (form === 'groups') {
      for (const tool of SECTION_TOOLS) {
        const label = ta(tool.labelKey);
        bar.appendChild(opensMenu(barButton(BAR_ICONS[tool.icon] ?? BAR_ICONS.pencil, label, () => openSectionTool(host, section, tool.only, label, tool.icon), '', label)));
      }
    }
    // "Save as template": a nameless snapshot to the editor, which names
    // and stores the draft. Re-id happens only at insertion, never here.
    const save = document.createElement('button');
    save.className = 'urd-save-template';
    save.title = ta('canvas.saveTemplate');
    save.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/><path d="M12 7v6M9 10h6"/></svg>';
    save.addEventListener('click', () => {
      post({ type: 'urd-save-template', kind: 'section', section: JSON.parse(JSON.stringify(section)) });
    });
    if (form === 'full') bar.appendChild(save);
  }
  // The gear: the section's settings in the floating menu, beside the section; in both views, since the settings hold in both.
  const gear = document.createElement('button');
  gear.innerHTML = GEAR_SVG;
  gear.title = ta('canvas.ctx.sectionSettings');
  gear.setAttribute('aria-label', gear.title);
  // The same guard as the block's gear: a pointerdown reaching the document's selection listener would draw the section anew before the click.
  gear.addEventListener('pointerdown', (event) => event.stopPropagation());
  gear.addEventListener('click', () => openSectionSettings(host, section));
  opensMenu(gear);
  // With small panels the gear is the word for the settings; with every group a tool, the groups and ⋮ hold the settings, and the gear stands in the phone view or where «Settings gear on the bar» asks for it.
  if (form === 'panels') {
    gear.textContent = ta('canvas.ctx.settings');
    gear.className = 'urd-edit-lead';
  }
  if (form !== 'groups' || isMobile() || barGear()) bar.appendChild(gear);
  if (!isMobile() && form === 'full') {
    const del = armedButton(BIN_SVG, ta('canvas.deleteSection'), () => deleteSection(section.id));
    del.classList.add('urd-sec-delete');
    bar.appendChild(del);
  }
  else bar.appendChild(moreButton((x, y, from) => openSectionContextMenu(host, x, y, from)));
  // New block and New section, together at the bar's right end: a block in this section, and a section below it; the phone view adds blocks for the phone only and draws no adder for sections.
  const adds = document.createElement('span');
  adds.className = 'urd-sec-adds';
  const addBlock = document.createElement('button');
  addBlock.className = 'urd-sec-add-block';
  addBlock.innerHTML = ADD_BLOCK_SVG;
  addBlock.title = ta(isMobile() ? 'canvas.addBlockPhone' : 'canvas.addBlock');
  addBlock.setAttribute('aria-label', addBlock.title);
  addBlock.addEventListener('click', () => toggleBlockMenuFrom(host, addBlock));
  adds.append(addBlock);
  if (!isMobile()) {
    const sec = document.createElement('button');
    sec.className = 'urd-sec-add-section';
    sec.innerHTML = ADD_SECTION_SVG;
    sec.title = ta('canvas.addSection');
    sec.setAttribute('aria-label', sec.title);
    sec.addEventListener('click', () => openSectionGalleryBelow(host));
    adds.append(sec);
  }
  bar.appendChild(adds);

  // Before the canvas, so it stands at the section's top on the phone as well, where the canvas is in flow.
  if (bar.childElementCount) host.insertBefore(bar, host.querySelector(':scope > .urd-canvas'));
}

/**
 * The bar of a section showing its phone layout in the desktop view (render.js urd-handoff): what it shows and why, the way to edit it in the phone view, and the section's settings and its menu, which hold in both views.
 * @param {HTMLElement} host
 * @param {object} section
 */
function addHandoffBar(host, section) {
  const bar = document.createElement('div');
  bar.className = `urd-section-toolbar urd-handoff-bar urd-bar-size-${barSize()}`;
  const mark = document.createElement('span');
  mark.className = 'urd-handoff-mark';
  mark.innerHTML = HANDOFF_SVG;
  mark.append(ta('canvas.handoff'));
  bar.appendChild(mark);
  attachHint(bar, { title: ta('canvas.handoff'), lines: [ta('canvas.handoffWhy', { n: host.dataset.urdHandoff ?? '' }), ta('canvas.handoffEdit')] });
  const edit = document.createElement('button');
  edit.type = 'button';
  edit.className = 'urd-handoff-edit';
  edit.textContent = ta('canvas.editOnPhone');
  // The section is the one at work as the phone view opens, as a press on it would make it.
  edit.addEventListener('click', () => {
    setActiveSection(section.id);
    post({ type: 'urd-edit-on-phone', sectionId: section.id });
  });
  bar.appendChild(edit);
  const gear = document.createElement('button');
  gear.innerHTML = GEAR_SVG;
  gear.title = ta('canvas.ctx.sectionSettings');
  gear.setAttribute('aria-label', gear.title);
  gear.addEventListener('pointerdown', (event) => event.stopPropagation());
  gear.addEventListener('click', () => openSectionSettings(host, section));
  bar.appendChild(opensMenu(gear));
  bar.appendChild(moreButton((x, y, from) => openSectionContextMenu(host, x, y, from)));
  host.insertBefore(bar, host.querySelector(':scope > .urd-canvas'));
}

/** The phone the bar of a section showing its phone layout wears. */
const HANDOFF_SVG = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M10.5 18.2h3"/></svg>';

/** «New block» on the section toolbar: the block menu opens under the button, its block centred in the section as it is chosen; a second press closes it. */
function toggleBlockMenuFrom(host, btn) {
  const wrap = host.querySelector(':scope > .urd-add-block');
  const menu = wrap?.querySelector('.urd-add-block-menu');
  if (!wrap || !menu) return;
  if (menu.classList.contains('open')) {
    resetBlockAdder(wrap);
    return;
  }
  // Another section's block menu closes as this one opens, the press coming from a bar beside the phone that reaches no page press.
  document.querySelectorAll('.urd-add-block-menu.open').forEach((m) => {
    const other = m.closest('.urd-add-block');
    if (other && other !== wrap) resetBlockAdder(other);
  });
  const rect = host.getBoundingClientRect();
  // From the section's bar the editor draws beside the phone, the page's own button is unseen: the menu hangs from the section's top right where it is in sight.
  const at = btn.getClientRects().length ? btn.getBoundingClientRect() : { right: rect.right - 8, bottom: Math.max(rect.top, 0) + 8 };
  menu._urdAt = null;
  menu._urdPhone = isMobile() ? phoneAdd(phoneDropFirst(host)) : {};
  wrap.style.left = `${Math.round(at.right - rect.left)}px`;
  wrap.style.top = `${Math.round(at.bottom - rect.top + 6)}px`;
  wrap.style.right = 'auto';
  wrap.classList.add('urd-at-pointer');
  menu._urdPrepare?.();
  menu.classList.add('open');
  menu._urdSearchFocus?.();
  fitBlockMenu(menu);
}

/** «New section» on the section toolbar: the seam under the section comes into view and opens its gallery, so the section chosen lands below this one. */
function openSectionGalleryBelow(host) {
  const bar = host.nextElementSibling;
  if (!bar?.classList.contains('urd-add-section')) return;
  bar.scrollIntoView({ block: 'center', behavior: 'instant' });
  bar.querySelector(':scope > .urd-add-section-chip')?.click();
}

/**
 * A button that acts at its second press, as the right-click menu's deletion does: the first press arms it, red, its tooltip asking for the second.
 * A mouse leaving the button, or the focus leaving it, disarms it; a touch lifts before its click, so a lifted finger never disarms what it is about to press.
 */
function armedButton(svg, title, run) {
  const btn = document.createElement('button');
  btn.innerHTML = svg;
  btn.title = title;
  btn.setAttribute('aria-label', title);
  let armed = false;
  const disarm = () => {
    armed = false;
    btn.classList.remove('urd-armed');
    btn.title = title;
    btn.setAttribute('aria-label', title);
  };
  btn.addEventListener('click', () => {
    if (!armed) {
      armed = true;
      btn.classList.add('urd-armed');
      btn.title = ta('canvas.ctx.pressAgain');
      btn.setAttribute('aria-label', btn.title);
      return;
    }
    disarm();
    run();
  });
  btn.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') disarm(); });
  btn.addEventListener('blur', disarm);
  return btn;
}

/** The section's settings in the editor's floating menu, opened beside the section (its bar's gear and its right-click menu's «Settings»). */
function openSectionSettings(host, section) {
  markActiveVisual(host);
  const r = host.getBoundingClientRect();
  post({ type: 'urd-section-menu', sectionId: section.id, rect: { left: r.left, top: r.top, right: r.right, bottom: r.bottom } });
}

/** The cards last reported, so the editor hears of them only when they change. */
let attentionSent = '';
let attentionFrame = 0;

/** Reports what the phone view shows once in the next frame, however many sections are drawn in it: the sections that need a phone review, and those seen. */
function scheduleAttention() {
  if (attentionFrame) return;
  attentionFrame = requestAnimationFrame(() => {
    attentionFrame = 0;
    reportAttention();
    reportSeen();
  });
}

/** The sections last reported as seen, so a scroll that shows the same ones sends nothing; emptied when a section is drawn. */
let seenSent = '';

/**
 * The sections standing in the phone view's window, at least half of a section or half the window (`urd-phone-seen`), for the editor's phone check before publishing (lib/phone-check.js), which takes them as looked at on the phone as they stand now.
 * Sent when the sections in sight change and when a section is drawn, since one drawn anew in sight is seen again; none in the desktop view.
 */
function reportSeen() {
  if (!isMobile()) return;
  const h = window.innerHeight;
  const seen = [...document.querySelectorAll('.urd-section[data-section-id]')].filter((host) => {
    const r = host.getBoundingClientRect();
    const shown = Math.min(r.bottom, h) - Math.max(r.top, 0);
    return shown > 0 && shown >= Math.min(r.height, h) / 2;
  }).map((host) => host.dataset.sectionId);
  const sent = seen.join(' ');
  if (!seen.length || sent === seenSent) return;
  seenSent = sent;
  post({ type: 'urd-phone-seen', sectionIds: seen });
}

/**
 * The sections that need a phone review in the phone view (`urd-attention`, ADR-0019 decision 5), with where each stands in the canvas, for the editor to draw their cards beside the phone (urd-attention-cards); none in the desktop view, and none scrolled out of sight.
 * The editor reads what happened and when from its own draft, and its «Reviewed» takes the mark away (urd-attention).
 */
export function reportAttention() {
  const cards = isMobile() ? [...document.querySelectorAll('[data-section-id].urd-attention')].map((host) => {
    const r = host.getBoundingClientRect();
    return { sectionId: host.dataset.sectionId, rect: { left: Math.round(r.left), top: Math.round(r.top), right: Math.round(r.right), bottom: Math.round(r.bottom) } };
  }).filter((card) => card.rect.bottom > 0 && card.rect.top < window.innerHeight) : [];
  const sent = JSON.stringify(cards);
  if (sent === attentionSent) return;
  attentionSent = sent;
  post({ type: 'urd-attention-cards', cards });
}

window.addEventListener('scroll', scheduleAttention, { passive: true, capture: true });
window.addEventListener('resize', scheduleAttention);

/**
 * The chip on a section's bar for the blocks the view does not draw: those hidden on phones in the phone view (`hideMobile`), those shown on phones only on the desktop (`hideDesktop`); a press lists them.
 * @param {HTMLElement} host The section
 * @param {HTMLElement} bar Its bar
 * @param {object} section
 * @param {'hideMobile'|'hideDesktop'} flag
 */
function hiddenChip(host, bar, section, flag) {
  const hidden = section.blocks.filter((b) => b[flag]);
  if (!hidden.length) return;
  const chip = document.createElement('button');
  chip.className = 'urd-hidden-chip';
  chip.textContent = ta(flag === 'hideMobile' ? 'canvas.hiddenCount' : 'canvas.phoneOnlyCount', { n: hidden.length });
  chip.title = ta(flag === 'hideMobile' ? 'canvas.hiddenList' : 'canvas.phoneOnlyList');
  chip.addEventListener('click', () => {
    const open = host.querySelector(':scope > .urd-hidden-list');
    if (open) { open.remove(); return; }
    host.appendChild(buildHiddenList(section, hidden, flag));
  });
  bar.appendChild(chip);
}

/**
 * The list of the blocks a view does not draw (hiddenChip):
 * a type label + an eye button that shows the block in this view again.
 */
function buildHiddenList(section, hidden, flag = 'hideMobile') {
  const EYE_SVG = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6z"/><circle cx="12" cy="12" r="2.6"/></svg>';
  const list = document.createElement('div');
  list.className = 'urd-hidden-list';
  for (const block of hidden) {
    const row = document.createElement('div');
    const def = window.Urd.blocks.get(block.type);
    const name = document.createElement('span');
    name.textContent = def?.labelKey ? ta(def.labelKey) : (def?.label ?? block.type);
    row.appendChild(name);
    const show = document.createElement('button');
    show.innerHTML = EYE_SVG;
    show.title = ta(flag === 'hideMobile' ? 'canvas.showBlock' : 'canvas.showOnDesktop');
    show.addEventListener('click', () => {
      block[flag] = false;
      post({ type: 'urd-block-flag', sectionId: section.id, blockId: block.id, [flag]: false });
    });
    row.appendChild(show);
    list.appendChild(row);
  }
  return list;
}

// The same rule for the rest of the editing chrome: a cross, the drag grip,
// the rotate handle, the fit-height button and the folds' caret are drawn,
// never characters.
const CROSS_SVG = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
/** Every deletion on the canvas draws a bin, as the admin's do (the editor's ICONS.bin), never the cross that closes things; the selection's bar draws the same lines at its own size. */
const BIN_PATHS = '<path d="M3 6h18"/><path d="M8.5 6V3h7v3"/><path d="M5.5 6l1 15h11l1-15"/><path d="M10 10.5v6M14 10.5v6"/>';
const BIN_SVG = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${BIN_PATHS}</svg>`;
/** The layer order's arrows: to the front, to the back. */
const Z_FRONT_SVG = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4h14"/><path d="M12 20V9"/><path d="M7 13l5-5 5 5"/></svg>';
const Z_BACK_SVG = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 20h14"/><path d="M12 4v11"/><path d="M7 11l5 5 5-5"/></svg>';
const GRIP_SVG = '<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="9" cy="6" r="1.7"/><circle cx="15" cy="6" r="1.7"/><circle cx="9" cy="12" r="1.7"/><circle cx="15" cy="12" r="1.7"/><circle cx="9" cy="18" r="1.7"/><circle cx="15" cy="18" r="1.7"/></svg>';
const ROTATE_SVG = '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 4v6h-6"/><path d="M20.5 13a8.5 8.5 0 1 1-2-5.5L21 10"/></svg>';
const FIT_HEIGHT_SVG = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12"/><path d="M6 10l6 6 6-6"/><path d="M4 21h16"/></svg>';
const DUPLICATE_SVG = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h9"/></svg>';
const CARET_SVG = '<svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.5 6l4.5 4.5L12.5 6"/></svg>';
/** The slim block menu's arrow on a group's row, pointing to the side its panel opens on. */
const CHEVRON_SVG = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>';

// Drawn icons for the mobile buttons (ADR-0009: never glyphs/emoji in
// chrome): reset (counterclockwise arrow), arrow up/down (order) and a
// check mark.
const RESET_SVG = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4v6h6"/><path d="M3.5 13a8.5 8.5 0 1 0 2-5.5L3 10"/></svg>';
const ORDER_UP_SVG = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20V4"/><path d="M5 11l7-7 7 7"/></svg>';
const ORDER_DOWN_SVG = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v16"/><path d="M5 13l7 7 7-7"/></svg>';
/** The section toolbar's adds: a block in the section, and a section below it. */
const ADD_BLOCK_SVG = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M12 8v8M8 12h8"/></svg>';
const ADD_SECTION_SVG = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="8" rx="1.5"/><path d="M12 14v7M8.5 17.5h7"/></svg>';
/** The seam grip's tabs: the one above the line shrinks the section above, the one below the section below (seamGrip). */
const SEAM_UP_SVG = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 15l6-6 6 6"/></svg>';
const SEAM_DOWN_SVG = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';

/**
 * The row index (1-based) at a y offset from the row grid's content top.
 * The track list holds the ACTUAL row heights (grown tracks are taller
 * than MOBILE_ROW); past the last track the grid continues in MOBILE_ROW
 * steps.
 */
function rowAtOffset(tracks, y) {
  let sum = 0;
  for (let i = 0; i < tracks.length; i++) {
    sum += tracks[i];
    if (y < sum) return i + 1;
  }
  return tracks.length + 1 + Math.max(0, Math.floor((y - sum) / MOBILE_ROW));
}

/** How long a press stands still on the selected block's words on the phone before it chooses words as it moves, instead of dragging the block (moveToDrag). */
const HOLD_TO_SELECT_MS = 400;

/**
 * The row (1-based) whose top edge lies nearest a y offset from the row grid's content top: where a block dragged on the rows lands, before a grown row while its top is over that row's upper half and after it over its lower half, the room under a block being its row's.
 * Past the last track the grid continues in MOBILE_ROW steps.
 */
function rowNearOffset(tracks, y) {
  let top = 0;
  for (let i = 0; i < tracks.length; i++) {
    if (y < top + tracks[i] / 2) return i + 1;
    top += tracks[i];
  }
  return tracks.length + 1 + Math.max(0, Math.round((y - top) / MOBILE_ROW));
}

function post(msg) {
  window.parent?.postMessage(msg, location.origin);
}

// The editable texts typed in since they took the focus: their own undo is the browser's, which holds that typing.
const typedIn = new WeakSet();
const editableRoot = (node) => (node instanceof HTMLElement ? node.closest('[contenteditable]:not([contenteditable="false"])') : null);
document.addEventListener('input', (event) => {
  const root = editableRoot(event.target);
  if (root) typedIn.add(root);
}, true);
document.addEventListener('focusin', (event) => {
  const root = editableRoot(event.target);
  if (root) typedIn.delete(root);
}, true);

// Ctrl+Z / Ctrl+Shift+Z inside the iframe is forwarded to the editor,
// which owns the history - UNLESS focus sits in editable text typed in
// since it took the focus (there the browser's own text undo applies;
// urd-edit keeps the draft in sync). A text the caret was only put back
// in, by an undo or a click, has no typing of its own to undo.
window.addEventListener('keydown', (event) => {
  if (!(event.ctrlKey || event.metaKey)) return;
  const key = event.key.toLowerCase();
  if (key !== 'z' && key !== 'y') return;
  const target = event.target;
  if (target instanceof HTMLElement && target.isContentEditable && typedIn.has(editableRoot(target))) return;
  event.preventDefault();
  post({ type: 'urd-undo', redo: key === 'y' || event.shiftKey });
});

// Selection: clicking a block gives it lasting focus (the handles stay
// visible, see base.css). Clicking outside all blocks deselects. The
// selection survives re-renders via the id.
let selectedBlockId = null;

/**
 * Multi-selection: a set of blocks in ONE section (ids + the section they
 * live in). selectedBlockId is always the primary block of the set. The
 * set is built with shift-click or marquee (dragging on empty surface),
 * and is treated as one unit for drag, arrow keys, deletion and
 * Ctrl+C/D/V.
 */
let multiIds = new Set();
let multiSectionId = null;

/** The section the owner last pressed on (markActiveVisual), by id, so the mark survives the section being drawn again. */
let activeSectionId = null;

/** The section chosen as a section, by a press on its bare surface or a paste, which Ctrl+C and Ctrl+X take whole; a press on a block chooses the block instead. */
let chosenSectionId = null;

/** The clipboard for Ctrl+C, Ctrl+X and Ctrl+V (clipboard-model.js): blocks
 *  with their source section, or a whole section. Each copy goes to the
 *  editor too, which hands it back to the next page the preview loads
 *  (setClipboard), so a copy pastes on another page. */
let clipboard = null;

/** The section the editor selected itself (the urd-active-section message: a new, duplicated or pasted section): active and chosen here, and marked once it is drawn. */
export function setActiveSection(sectionId) {
  activeSectionId = typeof sectionId === 'string' ? sectionId : null;
  chosenSectionId = activeSectionId;
  const host = activeSectionId ? document.querySelector(`.urd-section[data-section-id="${CSS.escape(activeSectionId)}"]`) : null;
  document.querySelectorAll('.urd-section-active').forEach((s) => {
    if (s !== host) s.classList.remove('urd-section-active');
  });
  host?.classList.add('urd-section-active');
}

/**
 * The caret put back in a block's text after an undo (the urd-caret message): the text takes the focus with the caret at that many characters in, or at its end where the text is shorter now.
 * @param {string} blockId
 * @param {number} offset Characters from the text's start
 */
export function placeCaret(blockId, offset) {
  const field = document.querySelector(`.urd-block[data-block-id="${CSS.escape(blockId)}"] .urd-text[contenteditable="true"]`);
  if (!field || !Number.isFinite(offset)) return;
  const walker = document.createTreeWalker(field, NodeFilter.SHOW_TEXT);
  let left = Math.max(0, offset);
  let node = walker.nextNode();
  while (node && left > node.length) {
    left -= node.length;
    node = walker.nextNode();
  }
  const range = document.createRange();
  if (node) range.setStart(node, left);
  else range.selectNodeContents(field);
  range.collapse(!!node);
  field.focus({ preventScroll: true });
  const selection = document.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
}

/** The editor's clipboard for a page just loaded (the urd-clipboard message), checked before it is used. */
export function setClipboard(value) {
  clipboard = readClipboard(value);
}

/** A copy or a cut onto the clipboard, and to the editor, which keeps it and tells the owner. */
function holdClipboard(clip, cut) {
  clipboard = clip;
  post({ type: 'urd-clipboard', clipboard: clip, cut });
}

/** Blocks of a section onto the clipboard; a cut deletes them in the same undo step as one deletion. */
function copyBlocks(section, ids, cut = false) {
  const clip = blocksClipboard(section, ids);
  if (!clip) return;
  holdClipboard(clip, cut);
  if (!cut) return;
  const blockIds = clip.blocks.map((b) => b.id);
  post(blockIds.length > 1
    ? { type: 'urd-delete', sectionId: section.id, blockIds }
    : { type: 'urd-delete', sectionId: section.id, blockId: blockIds[0] });
  selectBlock(null);
}

/** A whole section onto the clipboard; a cut deletes it. */
function copySection(host, cut = false) {
  const clip = sectionClipboard(host?._urdSection);
  if (!clip) return;
  holdClipboard(clip, cut);
  if (cut) deleteSection(clip.section.id);
}

/** A section deleted: the page forgets it as the active and the chosen one, as the editor does, so an undo brings it back unmarked. */
function deleteSection(sectionId) {
  if (activeSectionId === sectionId) activeSectionId = null;
  if (chosenSectionId === sectionId) chosenSectionId = null;
  post({ type: 'urd-delete-section', sectionId });
}

/** The section across the middle of the view, else the first one partly in it. */
function sectionInView() {
  const hosts = [...document.querySelectorAll('.urd-section')];
  const mid = window.innerHeight / 2;
  return hosts.find((h) => { const r = h.getBoundingClientRect(); return r.top <= mid && r.bottom >= mid; })
    ?? hosts.find((h) => { const r = h.getBoundingClientRect(); return r.bottom > 0 && r.top < window.innerHeight; })
    ?? null;
}

/** The clipboard's section on this page with fresh ids: below the section given, else the selected one, else the one in view; the editor selects it. */
function pasteSection(afterHost = null) {
  const section = pastedSection(clipboard, makeId);
  if (!section) return;
  const after = afterHost ?? document.querySelector('.urd-section-active') ?? sectionInView();
  selectBlock(null);
  // The pasted section is the active and chosen one once it is drawn, as the editor selects it.
  activeSectionId = section.id;
  chosenSectionId = section.id;
  post({ type: 'urd-paste-section', afterId: after?.dataset.sectionId ?? null, section });
}

/** Text the owner has selected on the page, which Ctrl+C copies the browser's own way. */
function textSelected() {
  const selection = document.getSelection();
  return Boolean(selection && !selection.isCollapsed && selection.toString().trim());
}

function selectedEls() {
  if (!multiIds.size) return [];
  return [...multiIds]
    .map((id) => document.querySelector(`.urd-block[data-block-id="${CSS.escape(id)}"]`))
    .filter(Boolean);
}

function applyMultiClasses() {
  document.querySelectorAll('.urd-block.urd-multi-selected').forEach((el) => {
    if (!multiIds.has(el.dataset.blockId)) el.classList.remove('urd-multi-selected');
  });
  for (const el of selectedEls()) el.classList.add('urd-multi-selected');
  updateMultiToolbar();
}

function clearMulti() {
  if (!multiIds.size) return;
  multiIds = new Set();
  multiSectionId = null;
  applyMultiClasses();
}

/** Shift-click: add/remove the block in the set (within one section). */
function toggleMulti(el) {
  const id = el.dataset.blockId;
  const sec = el.closest('.urd-section')?.dataset.sectionId ?? null;
  if (multiSectionId && multiSectionId !== sec) clearMulti();
  multiSectionId = sec;
  // The starting point is the already selected block (same section).
  if (!multiIds.size && selectedBlockId && selectedBlockId !== id) {
    const cur = document.querySelector(`.urd-block[data-block-id="${CSS.escape(selectedBlockId)}"]`);
    if (cur?.closest('.urd-section')?.dataset.sectionId === sec) multiIds.add(selectedBlockId);
  }
  if (multiIds.has(id)) {
    multiIds.delete(id);
    // The primary block remains one still part of the set.
    const rest = selectedEls();
    selectBlock(rest[0] ?? null, { keepMulti: true });
  } else {
    multiIds.add(id);
    selectBlock(el, { keepMulti: true });
  }
  if (multiIds.size < 2) clearMulti();
  applyMultiClasses();
}

function selectBlock(el, opts = {}) {
  if (!opts.keepMulti) clearMulti();
  const previous = selectedBlockId;
  // A block lifted with the keys on the phone goes back when the selection leaves it.
  document.querySelectorAll('.urd-block.urd-selected').forEach((b) => {
    if (b !== el) b._urdCarry?.cancel();
  });
  selectedBlockId = el?.dataset.blockId ?? null;
  document.querySelectorAll('.urd-block.urd-selected').forEach((b) => {
    if (b !== el) b.classList.remove('urd-selected');
  });
  el?.classList.add('urd-selected');
  // The bar shows with the selection, and is kept inside the canvas once it is drawn; in the phone view the editor draws it (watchPhoneBar).
  el?._urdKeepBar?.();
  watchPhoneBar();
  // The selected block takes the keyboard focus, so the keys on a selected block (the arrows, Delete, 1, 2 and 3, Shift+F10) work right after the click: the press that selects prevents its default, which would have moved the focus into the frame.
  // Text with the caret keeps it, and a block picked in the editor's own lists leaves the focus in the list (opts.keepFocus).
  if (el && !opts.keepFocus && !el.contains(document.activeElement)) {
    if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
    el.focus({ preventScroll: true });
  }
  if (previous !== selectedBlockId) {
    post({
      type: 'urd-select-block',
      sectionId: el?.closest('.urd-section')?.dataset.sectionId ?? null,
      blockId: selectedBlockId,
    });
  }
}

// Internal navigation in preview goes via the editor (which switches page
// and keeps the dropdown in sync); external links open in a new tab
// instead of pulling the iframe out of editing mode. Links INSIDE blocks
// (buttons, images, text links) never trigger while editing: the click
// selects the block. In the Clean view, which shows the page as visitors
// see it, every link is followed.
// A click the link's own handler has cancelled (a mobile menu item that
// opens its submenu) navigates nowhere, as on the published page.
document.addEventListener('click', (event) => {
  if (event.defaultPrevented) return;
  const a = eventTarget(event)?.closest('a[href]') ?? null;
  if (!a) return;
  // The event in full is a dialog over the page: its links work as on the
  // published page (a new tab, a file to save).
  if (a.closest('.urd-cal-dialog')) return;
  // In the Clean view every link in a block is followed, as on the published
  // page; while editing, a links block's row works once its block is
  // selected (the first click selects, the next follows, the cart button's
  // model), and every other link in a block waits for «View page».
  const chromeOff = document.body.classList.contains('urd-chrome-off');
  const linksRow = a.classList.contains('urd-share-button') && (chromeOff || a.closest('.urd-block')?.classList.contains('urd-selected'));
  // A basket's drawer is opened on purpose, so its «Go to checkout» switches the editor to that page, as the menu basket's does.
  const cartDrawer = Boolean(a.closest('.urd-cart-dialog'));
  // A document's contents jump to their parts in the preview too, without changing the preview's address; the page's scroll padding keeps the part clear of the menu.
  const docPart = a.closest('.urd-doc-toc, .urd-doc-fold') ? document.getElementById((a.getAttribute('href') ?? '').slice(1)) : null;
  if (docPart) {
    event.preventDefault();
    docPart.scrollIntoView({ block: 'start' });
    return;
  }
  if (a.closest('.urd-block') && !chromeOff && !linksRow && !cartDrawer) {
    event.preventDefault();
    return;
  }
  const href = a.getAttribute('href');
  if (!href || href.startsWith('#')) return;
  // A file to save is the browser's, as on the published page.
  if (a.hasAttribute('download')) return;
  let url;
  try {
    url = new URL(href, location.href);
  } catch {
    // An address the browser cannot read leads nowhere.
    event.preventDefault();
    return;
  }
  // A link to another site that opens in a tab of its own is left to the
  // browser; only a link to a page of this site goes through the editor.
  if ((chromeOff || linksRow) && url.origin !== location.origin && a.target === '_blank') return;
  event.preventDefault();
  // A page of this site goes through the editor; a file of the site (a PDF under media/) and another site open in a tab of their own.
  if (url.origin === location.origin && !/\.[a-z0-9]{2,5}$/i.test(url.pathname)) {
    post({ type: 'urd-navigate', path: url.pathname, hash: url.hash });
  } else {
    window.open(url, '_blank', 'noopener');
  }
});

// Keyboard on a selected block/set: arrow keys move (grid steps;
// Shift = 1 px), Delete deletes, Esc deselects, Ctrl+C, Ctrl+X and Ctrl+V
// copy, cut and paste with the layout preserved (a selected section with no
// block is copied whole), Ctrl+D duplicates. Never when focus
// sits in text/fields. In the phone view the arrows go to phoneArrow, and
// Ctrl+G and Ctrl+Shift+G group and ungroup the set on phones.
// A dialog on the page keeps its own arrows, and the clean view moves nothing.
window.addEventListener('keydown', (event) => {
  const target = event.target;
  if (target instanceof HTMLElement
    && (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))) return;
  const ctrl = event.ctrlKey || event.metaKey;

  // Ctrl+V needs no selection: paste where the active section is.
  if (ctrl && !event.altKey && event.key.toLowerCase() === 'v') {
    if (isMobile() || !clipboard) return;
    event.preventDefault();
    pasteClipboard();
    return;
  }

  // Set deletion needs no single-block anchor (a marquee can be left
  // without one after group operations). Deletion is structural work and
  // belongs to the desktop view, like the other shortcuts.
  if ((event.key === 'Delete' || event.key === 'Backspace') && multiIds.size > 1) {
    if (isMobile()) return;
    event.preventDefault();
    deleteSelection();
    return;
  }

  // G asks the editor to show or hide the grid, as the top bar's Grid button does; a dialog on the page keeps the key.
  if (String(event.key ?? '').toLowerCase() === 'g' && !ctrl && !event.altKey && !(target instanceof Element && target.closest('dialog, [role="dialog"]'))) {
    event.preventDefault();
    post({ type: 'urd-toggle-grid' });
    return;
  }

  // «?» asks the editor for its shortcut sheet, which lists every key here and in the panels; a dialog on the page (a calendar event, the basket) keeps the key.
  if (event.key === '?' && !ctrl && !event.altKey && !(target instanceof Element && target.closest('dialog, [role="dialog"]'))) {
    event.preventDefault();
    post({ type: 'urd-shortcuts' });
    return;
  }

  // Ctrl/⌘+K outside a text asks the editor for its command palette, and Ctrl+Shift+P where a browser keeps Ctrl+K for itself; in a text Ctrl+K is the toolbar's link key, and a dialog on the page keeps the keys.
  const paletteKey = (!event.shiftKey && event.key.toLowerCase() === 'k') || (event.shiftKey && event.key.toLowerCase() === 'p');
  if (ctrl && !event.altKey && paletteKey
    && !(target instanceof HTMLElement && (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) || target.closest('dialog, [role="dialog"]')))) {
    event.preventDefault();
    post({ type: 'urd-palette' });
    return;
  }

  // Ctrl/⌘+S asks the editor to save the ticked drafts, in place of the browser's saving of the page; a dialog on the page keeps the key.
  if (ctrl && !event.altKey && !event.shiftKey && event.key.toLowerCase() === 's' && !(target instanceof Element && target.closest('dialog, [role="dialog"]'))) {
    event.preventDefault();
    post({ type: 'urd-save-key' });
    return;
  }

  // Slash command: "/" opens the + New block menu with the search field
  // focused, in the active section (otherwise the section under the
  // pointer); if the pointer sits in the section, the block lands at the
  // pointer point.
  if (event.key === '/' && !ctrl && !event.altKey) {
    if (isMobile() || document.body.classList.contains('urd-chrome-off')) return;
    const active = document.querySelector('.urd-section-active');
    const under = lastPointer
      ? document.elementFromPoint(lastPointer.x, lastPointer.y)?.closest?.('.urd-section') ?? null
      : null;
    const host = active ?? under ?? document.querySelector('.urd-section');
    if (!host) return;
    event.preventDefault();
    closeMenus();
    if (lastPointer && host === under) openBlockMenuAt(host, lastPointer.x, lastPointer.y);
    else openBlockMenuAt(host);
    return;
  }

  if (!selectedBlockId) {
    // Ctrl+C and Ctrl+X: a set left without a single block, else the section chosen as a section.
    if (ctrl && !event.altKey && !event.shiftKey && ['c', 'x'].includes(event.key.toLowerCase())) {
      const cut = event.key.toLowerCase() === 'x';
      const setCtx = multiIds.size > 1 ? selectedEls()[0]?._urdCtx : null;
      const chosen = chosenSectionId ? document.querySelector(`.urd-section[data-section-id="${CSS.escape(chosenSectionId)}"]`) : null;
      if (isMobile() || (!setCtx && (!chosen || textSelected()))) return;
      event.preventDefault();
      if (setCtx) copySelection(setCtx, cut);
      else copySection(chosen, cut);
      return;
    }
    // The section's menu from the keyboard, on the active section, in either view.
    if (event.key === 'ContextMenu' || (event.shiftKey && event.key === 'F10')) {
      const active = document.querySelector('.urd-section-active');
      if (!active) return;
      event.preventDefault();
      const r = active.getBoundingClientRect();
      openSectionContextMenu(active, r.left + 16, Math.max(16, r.top + 16));
    }
    return;
  }

  const el = document.querySelector(`.urd-block[data-block-id="${selectedBlockId}"]`);
  // A block lifted with the keys on the phone lands on Enter and goes back on Escape.
  if (el?._urdCarry && (event.key === 'Enter' || event.key === 'Escape')) {
    event.preventDefault();
    if (event.key === 'Enter') el._urdCarry.land(); else el._urdCarry.cancel();
    return;
  }
  if (event.key === 'Escape') {
    selectBlock(null);
    return;
  }

  const ctx = el?._urdCtx;
  if (!ctx) return;

  // The element menu's areas from the canvas: 1, 2 and 3 on a selected block
  // choose Content, Style and Placement in the editor's menu (0.7.20.9).
  if (['1', '2', '3'].includes(event.key) && !ctrl && !event.altKey) {
    event.preventDefault();
    post({ type: 'urd-menu-area', area: ['content', 'style', 'placement'][Number(event.key) - 1] });
    return;
  }

  // The right-click menu from the keyboard: the context-menu key, or Shift+F10, in either view.
  if (event.key === 'ContextMenu' || (event.shiftKey && event.key === 'F10')) {
    event.preventDefault();
    const r = el.getBoundingClientRect();
    openContextMenu(el, r.left + 8, r.top + 8);
    return;
  }

  // The style clipboard: Ctrl+Alt+C copies the block's look, Ctrl+Alt+V pastes it.
  if (ctrl && event.altKey && event.key.toLowerCase() === 'c') {
    if (isMobile()) return;
    event.preventDefault();
    copyBlockStyle(ctx.block);
    return;
  }
  if (ctrl && event.altKey && event.key.toLowerCase() === 'v') {
    if (isMobile()) return;
    event.preventDefault();
    pasteBlockStyle(ctx.section, ctx.block);
    return;
  }

  // The set, or the selected block alone, that the phone view's grouping and layer order act on.
  const phoneSet = multiIds.size > 1 ? [...multiIds] : [selectedBlockId];

  // z-order from the keyboard: Ctrl+Shift+Up to the front, Ctrl+Shift+Down to the back; on the phone among the blocks pinned there (bumpPhoneZ).
  if (ctrl && event.shiftKey && (event.key === 'ArrowUp' || event.key === 'ArrowDown')) {
    event.preventDefault();
    if (isMobile()) bumpPhoneZ(ctx.section, phoneSet, event.key === 'ArrowUp' ? 1 : -1);
    else bumpBlockZ(ctx.host, ctx.section, ctx.block, el, event.key === 'ArrowUp' ? 1 : -1);
    return;
  }

  // Grouping on the phone: Ctrl+G makes the set one stack, Ctrl+Shift+G takes apart the groups the set, or the selected block, stands in.
  if (ctrl && !event.altKey && String(event.key ?? '').toLowerCase() === 'g') {
    if (!isMobile() || document.body.classList.contains('urd-chrome-off')) return;
    event.preventDefault();
    if (event.shiftKey) ungroupOnPhone(ctx.section, phoneSet);
    else groupOnPhone(ctx.section, phoneSet);
    return;
  }

  if (ctrl && !event.altKey && !event.shiftKey && ['c', 'x'].includes(event.key.toLowerCase())) {
    if (isMobile()) return;
    event.preventDefault();
    copySelection(ctx, event.key.toLowerCase() === 'x');
    return;
  }

  if (ctrl && event.key.toLowerCase() === 'd') {
    if (isMobile()) return;
    event.preventDefault();
    if (multiIds.size > 1) duplicateSelection(ctx);
    else duplicateBlock(ctx.section, ctx.block);
    return;
  }

  if (event.key === 'Delete' || event.key === 'Backspace') {
    if (isMobile()) return;
    event.preventDefault();
    post({ type: 'urd-delete', sectionId: ctx.section.id, blockId: selectedBlockId });
    selectBlock(null);
    return;
  }

  const dirs = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
  const dir = dirs[event.key];
  if (!dir) return;
  if ((target instanceof Element && target.closest('dialog, [role="dialog"]')) || document.body.classList.contains('urd-chrome-off')) return;
  if (isMobile()) {
    phoneArrow(event, ctx, el, dir);
    return;
  }
  event.preventDefault();

  const stepPx = event.shiftKey ? 1 : ctx.grid.size;
  const pctPerPx = 100 / canvasOf(ctx.host).clientWidth;
  const r1 = (v) => Math.round(v * 10) / 10;

  if (multiIds.size > 1) {
    // The whole set moves by the same delta, clamped so the group stays
    // within the width; a burst of presses becomes one undo step.
    // The axis NOT being moved is never touched (rounding an untouched
    // x/y would leave an invisible change keeping the draft dirty).
    const parts = selectedEls().map((e) => ({ el: e, ctx: e._urdCtx })).filter((p) => p.ctx);
    suspendSticky();
    suspendPush();
    // The frames are settled to their boxes first (settleFrames), so the
    // keys place what the owner sees.
    const settle = settleFrames(ctx.host, ctx.section, parts.map((p) => p.ctx.block.id));
    const d = dir[0] ? groupDelta(parts.map((p) => p.ctx.block.frames.desktop), r1(dir[0] * stepPx * pctPerPx), 0) : { dx: 0 };
    postSettled(ctx.section, settle, parts.map((p) => p.ctx.block.id), 'multi-arrow');
    for (const [i, p] of parts.entries()) {
      const frame = { ...p.ctx.block.frames.desktop };
      if (dir[0]) frame.x = r1(frame.x + d.dx);
      if (dir[1]) frame.y = frame.y + dir[1] * stepPx;
      p.ctx.block.frames.desktop = frame;
      drawFrame(p.el, frame);
      post({ type: 'urd-move', sectionId: p.ctx.section.id, blockId: p.ctx.block.id, frame, frameKey: 'desktop', coalesce: true, groupKey: 'multi-arrow' });
    }
    resumeSticky();
    resumePush();
    updateMultiToolbar();
    return;
  }

  suspendSticky();
  suspendPush();
  const settle = settleFrames(ctx.host, ctx.section, [ctx.block.id]);
  const frame = { ...ctx.block.frames.desktop };
  if (dir[0]) frame.x = clamp(r1(frame.x + dir[0] * stepPx * pctPerPx), 0, r1(100 - frame.w));
  if (dir[1]) frame.y = Math.max(yFloor(ctx.host), frame.y + dir[1] * stepPx);
  ctx.block.frames.desktop = frame;
  drawFrame(el, frame);
  resumeSticky();
  resumePush();
  // coalesce: a burst of arrow-key presses becomes one undo step, the
  // settled frames included (their groupKey is the block's own key).
  postSettled(ctx.section, settle, [ctx.block.id], ctx.block.id);
  post({ type: 'urd-move', sectionId: ctx.section.id, blockId: selectedBlockId, frame, frameKey: 'desktop', coalesce: true });
});

/**
 * A flowing block moved one place in the phone's reading order (phone-moves.js phoneStep): the change is written into the section here, so a burst of presses reckons from where the last one left it, and posted to the editor.
 * @param {object} section
 * @param {object} block
 * @param {number} dir -1 earlier, 1 later
 * @param {boolean} coalesce From the keys: a burst is one undo step
 */
function stepPhone(section, block, dir, coalesce) {
  const change = phoneStep(section.blocks, phoneSetupOf(section), block.id, dir);
  if (!change) return;
  for (const [id, place] of Object.entries(change.places)) {
    const other = section.blocks.find((b) => b.id === id);
    if (!other) continue;
    if (place) other.phonePlace = place; else delete other.phonePlace;
  }
  if (change.stacks?.length) section.phoneStacks = change.stacks;
  else if (change.stacks) delete section.phoneStacks;
  if (change.list) section.phoneList = change.list;
  post({ type: 'urd-phone-order', sectionId: section.id, blockId: block.id, change, coalesce });
}

/**
 * The arrows in the phone view: Alt with Up or Down moves a block that flows in the row grid one step in the reading order, as the bar's buttons do; the arrows move a block placed by hand in the row grid, Up and Down one row and Left and Right one per cent of the width.
 * A burst of presses is one undo step.
 * @param {KeyboardEvent} event
 * @param {{ section: object, block: object }} ctx
 * @param {HTMLElement} el The block's element
 * @param {number[]} dir The arrow's step, [x, y]
 */
function phoneArrow(event, ctx, el, dir) {
  // A set is a desktop tool: one carried into the phone view moves nothing here.
  if (multiIds.size > 1) return;
  const { section, block } = ctx;
  const placed = block.frames.mobile;
  if (!Number.isFinite(placed?.row)) {
    // Alt with an arrow lifts a flowing block (phoneCarry), and the arrows then walk where it will land; a lifted block takes the arrows alone.
    if (!el._urdCarry && !event.altKey) return;
    event.preventDefault();
    (el._urdCarry ?? el._urdLift?.())?.step(dir);
    return;
  }
  event.preventDefault();
  const r2 = (v) => Math.round(v * 100) / 100;
  const w = placed.w ?? block.frames.desktop.w;
  const placement = { ...placed };
  const cells = phoneCells(placed);
  if (dir[1]) placement.row = Math.max(1, placed.row + dir[1]);
  // In cells, Left and Right move the block a column; else one per cent of the width.
  if (dir[0] && cells) placement.col = clamp(cells.col + dir[0], 1, PHONE_COLUMNS - cells.cols + 1);
  else if (dir[0]) placement.x = clamp(r2((placed.x ?? block.frames.desktop.x) + dir[0]), 0, r2(100 - w));
  if (placement.row === placed.row && placement.x === placed.x && placement.col === placed.col) return;
  block.frames.mobile = placement;
  const css = mobilePlacementToCss(placement, block.frames.desktop, { autoGrow: autoGrows(block, window.Urd.blocks.get(block.type)) });
  // A block pinned on the phone stands over the grid, its slot in its place (render.js stickOnPhone): the slot takes the rows, and the block follows it.
  const slot = el._urdStickSlot;
  if (slot?.isConnected) {
    Object.assign(slot.style, { gridRow: css.gridRow, gridColumn: css.gridColumn ?? '', width: css.width, marginLeft: css.marginLeft, marginRight: css.marginRight ?? '' });
    Object.assign(el.style, { width: css.width, marginLeft: css.marginLeft });
    placeStuck(el);
  } else {
    Object.assign(el.style, css);
  }
  post({ type: 'urd-move', sectionId: section.id, blockId: block.id, frame: placement, frameKey: 'mobile', coalesce: true, groupKey: `nudge-mobile-${block.id}` });
}

// Active section: the editor's palette puts new blocks in the last
// clicked section, marked with an accent line at the left edge.
//
// markActiveVisual sets ONLY the class (the palette hint). markActive
// additionally posts urd-select-section, which makes the editor show the
// SECTION's properties - that must only happen when the bare section
// surface is clicked, never when a block or a block handle is touched
// (then the block's own urd-select-block carries the section context, and
// Properties stays on the block).
function markActiveVisual(host) {
  activeSectionId = host?.dataset.sectionId ?? null;
  // The section put at work is the one whose bar the editor draws in the phone view.
  if (host) {
    phoneBarSectionId = activeSectionId;
    watchPhoneBar();
  }
  if (activeSectionId !== chosenSectionId) chosenSectionId = null;
  document.querySelectorAll('.urd-section-active').forEach((s) => {
    if (s !== host) s.classList.remove('urd-section-active');
  });
  if (host) host.classList.add('urd-section-active');
}
function markActive(host) {
  markActiveVisual(host);
  chosenSectionId = host?.dataset.sectionId ?? null;
  if (host) post({ type: 'urd-select-section', sectionId: host.dataset.sectionId });
}

document.addEventListener('pointerdown', (event) => {
  // Clean view has no editing: a click there is a visitor's click, and must
  // not select anything behind the hidden panels.
  if (document.body.classList.contains('urd-chrome-off')) return;
  const target = eventTarget(event);
  // Clicks in the multi toolbar must never change the set it acts on.
  if (target?.closest('.urd-multi-toolbar')) return;
  // A calendar's card lies over the page outside its block, and its words are rewritten there.
  // A press in it keeps the calendar selected.
  if (target?.closest('.urd-cal-dialog')) return;
  const blockEl = target?.closest('.urd-block') ?? null;
  if (blockEl && event.shiftKey) {
    toggleMulti(blockEl);
  } else if (blockEl && multiIds.size > 1 && multiIds.has(blockEl.dataset.blockId)) {
    // Clicking a member keeps the set (group drag), but makes the block
    // primary.
    selectBlock(blockEl, { keepMulti: true });
  } else {
    selectBlock(blockEl);
  }
  // Clicking a block must not post a section choice (Properties stays on
  // the block); only the bare section surface switches to the section's
  // properties.
  const host = target?.closest('.urd-section');
  // A right press marks the section visually only: the activation would
  // redraw it before the browser's contextmenu event, which then lands on
  // the detached node and never reaches the menu's listener.
  if (blockEl) chosenSectionId = null;
  if (blockEl || event.button === 2) markActiveVisual(host);
  else markActive(host);
});

// Marquee: dragging on empty section surface draws a selection frame, and
// every block it overlaps becomes the set (a click without a drag remains
// a click; the set is limited to the section the drag started in).
// In the phone view the blocks stand in the row grid and its cells, so each is measured where it is drawn.
document.addEventListener('pointerdown', (event) => {
  if (event.button !== 0 || event.shiftKey) return;
  if (document.body.classList.contains('urd-chrome-off')) return;
  const target = eventTarget(event);
  const host = target?.closest('.urd-section');
  // A section showing its phone layout in the desktop view (render.js urd-handoff) has no blocks to gather there.
  if (!host || host.classList.contains('urd-handoff')) return;
  if (target.closest('.urd-block, .urd-add-block, .urd-add-section, .urd-section-toolbar, .urd-hint-chip, .urd-hint-card, .urd-multi-toolbar')) return;

  // The marquee rectangle and hit detection are measured against the
  // content surface: the blocks' offsetLeft/offsetTop are relative to it
  // (it is their offsetParent), so both sides of the comparison must
  // share the same frame.
  const canvas = canvasOf(host);
  const startRect = canvas.getBoundingClientRect();
  const start = { x: event.clientX - startRect.left, y: event.clientY - startRect.top };
  let rectEl = null;

  const onMove = (ev) => {
    const hostRect = canvas.getBoundingClientRect();
    const cur = { x: ev.clientX - hostRect.left, y: ev.clientY - hostRect.top };
    if (!rectEl) {
      if (Math.abs(cur.x - start.x) + Math.abs(cur.y - start.y) < 6) return;
      rectEl = document.createElement('div');
      rectEl.className = 'urd-marquee';
      canvas.appendChild(rectEl);
      document.body.classList.add('urd-marqueeing');
      document.getSelection()?.removeAllRanges();
    }
    const rect = {
      left: Math.min(start.x, cur.x),
      top: Math.min(start.y, cur.y),
      right: Math.max(start.x, cur.x),
      bottom: Math.max(start.y, cur.y),
    };
    rectEl.style.left = `${rect.left}px`;
    rectEl.style.top = `${rect.top}px`;
    rectEl.style.width = `${rect.right - rect.left}px`;
    rectEl.style.height = `${rect.bottom - rect.top}px`;
    const blocks = isMobile()
      ? [...canvas.querySelectorAll('.urd-block[data-block-id]')].map((el) => {
        const r = el.getBoundingClientRect();
        return { id: el.dataset.blockId, left: r.left - hostRect.left, top: r.top - hostRect.top, right: r.right - hostRect.left, bottom: r.bottom - hostRect.top };
      })
      : [...canvas.querySelectorAll(':scope > .urd-block')].map((el) => ({
        id: el.dataset.blockId,
        left: el.offsetLeft,
        top: el.offsetTop,
        right: el.offsetLeft + el.offsetWidth,
        bottom: el.offsetTop + el.offsetHeight,
      }));
    multiSectionId = host.dataset.sectionId;
    multiIds = new Set(blocksInRect(rect, blocks));
    applyMultiClasses();
  };
  const onUp = () => {
    document.removeEventListener('pointermove', onMove);
    document.removeEventListener('pointerup', onUp);
    document.removeEventListener('pointercancel', onUp);
    document.body.classList.remove('urd-marqueeing');
    if (!rectEl) return;
    rectEl.remove();
    if (multiIds.size < 2) {
      const single = selectedEls()[0] ?? null;
      clearMulti();
      selectBlock(single);
      return;
    }
    selectBlock(selectedEls()[0], { keepMulti: true });
    updateMultiToolbar();
  };
  document.addEventListener('pointermove', onMove);
  document.addEventListener('pointerup', onUp);
  // A drag the browser takes for a scroll or a pan ends the frame as a release does.
  document.addEventListener('pointercancel', onUp);
});

/**
 * The floor for a block's y in its section. The first section has nothing
 * above it but the menu, so a block there never goes under the menu, where it
 * is drawn behind it and cannot be taken hold of; in any other section a block
 * may hang above the top and lie over the section before it (ADR-0025
 * decision 8), as the group drag and the transfer at a drop already allow.
 */
function yFloor(host) {
  return document.querySelector('.urd-section') === host ? 0 : -Infinity;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/* ---------- Multi-selection: toolbar, copy/paste ---------- */

/** Deletes the whole set as ONE undo step (shared by the Delete key and
 *  the toolbar's delete button). */
function deleteSelection() {
  const ctx = selectedEls()[0]?._urdCtx;
  const sectionId = multiSectionId ?? ctx?.section?.id;
  if (!sectionId || multiIds.size < 2) return;
  post({ type: 'urd-delete', sectionId, blockIds: [...multiIds] });
  selectBlock(null);
}

/** Floating toolbar above the set: align/distribute + count. */
let multiBar = null;

function buildMultiBar() {
  multiBar = document.createElement('div');
  multiBar.className = 'urd-multi-toolbar';
  // Clicks in the toolbar must not bubble to the document's selection listener.
  multiBar.addEventListener('pointerdown', (event) => event.stopPropagation());

  const count = document.createElement('span');
  count.className = 'urd-multi-count';
  multiBar.appendChild(count);
  multiBar._urdCount = count;

  const svg = (body) => `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">${body}</svg>`;
  const btn = (html, title, run) => {
    const b = document.createElement('button');
    b.innerHTML = html;
    b.title = title;
    b.addEventListener('click', run);
    multiBar.appendChild(b);
    return b;
  };
  btn(svg('<path d="M4 3v18"/><rect x="7" y="6" width="10" height="4"/><rect x="7" y="14" width="14" height="4"/>'), ta('canvas.alignLeft'), () => applyAlign('left'));
  btn(svg('<path d="M12 3v18"/><rect x="7" y="6" width="10" height="4"/><rect x="4" y="14" width="16" height="4"/>'), ta('canvas.alignCenterH'), () => applyAlign('center'));
  btn(svg('<path d="M20 3v18"/><rect x="7" y="6" width="10" height="4"/><rect x="3" y="14" width="14" height="4"/>'), ta('canvas.alignRight'), () => applyAlign('right'));
  btn(svg('<path d="M3 4h18"/><rect x="6" y="7" width="4" height="10"/><rect x="14" y="7" width="4" height="14"/>'), ta('canvas.alignTop'), () => applyAlign('top'));
  btn(svg('<path d="M3 12h18"/><rect x="6" y="7" width="4" height="10"/><rect x="14" y="4" width="4" height="16"/>'), ta('canvas.alignMiddleV'), () => applyAlign('middle'));
  btn(svg('<path d="M3 20h18"/><rect x="6" y="7" width="4" height="10"/><rect x="14" y="3" width="4" height="14"/>'), ta('canvas.alignBottom'), () => applyAlign('bottom'));
  const distH = btn(svg('<path d="M3 3v18M21 3v18"/><rect x="7" y="9" width="3" height="6"/><rect x="14" y="9" width="3" height="6"/>'), ta('canvas.distributeH'), () => applyDistribute('x'));
  const distV = btn(svg('<path d="M3 3h18M3 21h18"/><rect x="9" y="7" width="6" height="3"/><rect x="9" y="14" width="6" height="3"/>'), ta('canvas.distributeV'), () => applyDistribute('y'));
  multiBar._urdDist = [distH, distV];
  // "Save group as template" (the snippets model): the whole set is saved
  // as a reusable block group; naming and storage happen in the editor
  // (urd-save-template), and the group appears in the block menus.
  const saveGroup = btn(svg('<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/><path d="M12 7v6M9 10h6"/>'), ta('canvas.saveGroup'), () => {
    const blocks = selectedEls().map((el) => el._urdCtx?.block).filter(Boolean);
    if (blocks.length < 2) return;
    post({ type: 'urd-save-template', kind: 'blocks', blocks: JSON.parse(JSON.stringify(blocks)) });
  });
  saveGroup.classList.add('urd-multi-save');
  // "Pin the group": the whole set gets the same group id and is pinned
  // as ONE unit, so the blocks keep their relative placement instead of
  // all piling up at the top of the window. If the set is already pinned
  // as a group, the button unpins it.
  btn(svg('<path d="M12 17v5"/><path d="M9 3h6l-1 6 3 3v2H7v-2l3-3z"/>'), ta('canvas.stickyGroup'), () => {
    const blocks = selectedEls().map((el) => el._urdCtx?.block).filter(Boolean);
    if (blocks.length < 2) return;
    const grouped = blocks.every((b) => b.sticky?.group);
    post({
      type: 'urd-sticky-group',
      sectionId: multiSectionId,
      blockIds: blocks.map((b) => b.id),
      on: !grouped,
    });
  });
  // The drag handle: grab the whole set and drag it together (its own
  // button next to the trash icon); recorded as ONE undo step on release.
  const grip = document.createElement('button');
  grip.className = 'urd-multi-drag';
  grip.title = ta('canvas.dragSelected');
  grip.innerHTML = '<svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><g fill="currentColor"><circle cx="3" cy="3.5" r="1.4"/><circle cx="7" cy="3.5" r="1.4"/><circle cx="11" cy="3.5" r="1.4"/><circle cx="3" cy="10.5" r="1.4"/><circle cx="7" cy="10.5" r="1.4"/><circle cx="11" cy="10.5" r="1.4"/></g></svg>';
  grip.addEventListener('pointerdown', startSelectionDrag);
  multiBar.appendChild(grip);
  const del = btn(svg(BIN_PATHS), ta('canvas.deleteSelected'), deleteSelection);
  del.classList.add('urd-multi-delete');
  document.body.appendChild(multiBar);
}

/** Drag the whole set together from the toolbar handle: a live view
 *  during the drag (clamped by groupDelta so the group stays in the
 *  section), recorded as ONE undo step on release. Cancel restores
 *  everything. */
function startSelectionDrag(event) {
  // The isPrimary guard: a second finger on the handle must not start a
  // competing drag with its own listeners fighting over the delta.
  if (event.button !== 0 || !event.isPrimary) return;
  let items = selectionItems();
  const host = selectedEls()[0]?.closest('.urd-section');
  const section = selectedEls()[0]?._urdCtx?.section;
  if (!host || !section || items.length < 2) return;
  event.preventDefault();
  event.stopPropagation();
  const handle = event.currentTarget;
  handle.setPointerCapture(event.pointerId);
  // As with the single drag: pinned blocks are released back to their real
  // place before the drag writes geometry on them, and the push stands
  // still so the pushed blocks stay where they are seen.
  suspendSticky();
  suspendPush();

  const width = canvasOf(host).getBoundingClientRect().width;
  const startX = event.clientX;
  const startY = event.clientY;
  const r2 = (v) => Math.round(v * 100) / 100;
  let delta = { dx: 0, dy: 0 };
  // The set's frames are settled to their boxes at the first move
  // (settleFrames), as for a single drag.
  let settle = null;
  let settled = false;

  const apply = (frameFor) => {
    const frames = new Map();
    for (const it of items) {
      const el = document.querySelector(`.urd-block[data-block-id="${CSS.escape(it.id)}"]`);
      const frame = frameFor(it);
      if (el) drawFrame(el, frame);
      frames.set(it.id, frame);
    }
    // The push as it will be after release, drawn live.
    pushPreview(host, frames, settle?.grown);
    // The toolbar follows the set, so the handle stays under the pointer the whole way.
    updateMultiToolbar();
  };
  const move = (e) => {
    if (!settled) {
      settled = true;
      settle = settleFrames(host, section, items.map((it) => it.id));
      if (settle) items = selectionItems();
    }
    delta = groupDelta(items, ((e.clientX - startX) / width) * 100, e.clientY - startY);
    apply((it) => ({ ...it, x: it.x + delta.dx, y: it.y + delta.dy }));
  };
  const finish = (commit) => {
    handle.removeEventListener('pointermove', move);
    handle.removeEventListener('pointerup', up);
    handle.removeEventListener('pointercancel', cancel);
    const moved = commit && (delta.dx || delta.dy);
    if (!moved && settle) {
      settle.undo();
      items = selectionItems();
    }
    resumeSticky();
    resumePush();
    if (moved) {
      applySelectionMoves(items.map((it) => ({ id: it.id, x: r2(it.x + delta.dx), y: it.y + delta.dy })), settle);
    } else {
      apply((it) => it);
    }
  };
  const up = () => finish(true);
  const cancel = () => finish(false);
  handle.addEventListener('pointermove', move);
  handle.addEventListener('pointerup', up);
  handle.addEventListener('pointercancel', cancel);
}

/**
 * The set bar of the phone view (0.7.36.3): the count, «Group» and «Ungroup» on phones, the blocks in cells to the left, the middle or the right of their row, and the pinned blocks' layer order there; a button with nothing to act on is greyed (updatePhoneSetBar).
 * Its tools stand in a row of their own, which the editor watches when it draws the bar beside the phone (watchPhoneBar), so the bar's place is no change of its tools.
 */
let phoneSetBar = null;

/** A row of the phone's cells, dashed, with a block at the left edge, in the middle or at the right edge, for the set bar's alignment. */
const rowSideSvg = (x) => `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><rect x="2" y="6" width="20" height="12" rx="1.5" stroke-dasharray="2.5 2.5"/><rect x="${x}" y="9" width="7" height="6" rx="1" fill="currentColor"/></svg>`;
const GROUP_SVG = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2.5" y="2.5" width="19" height="19" rx="2" stroke-dasharray="3 3"/><rect x="7" y="6.5" width="10" height="4.5" rx="1"/><rect x="7" y="13" width="10" height="4.5" rx="1"/></svg>';
const UNGROUP_SVG = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="10" height="5" rx="1"/><rect x="11" y="15" width="10" height="5" rx="1"/><path d="M17 4h4v4M3 16v4h4"/></svg>';

function buildPhoneSetBar() {
  phoneSetBar = document.createElement('div');
  phoneSetBar.className = 'urd-multi-toolbar urd-phone-set';
  phoneSetBar.setAttribute('role', 'toolbar');
  phoneSetBar.setAttribute('aria-label', ta('canvas.setTools'));
  // Presses in the bar must not reach the document's selection listener.
  phoneSetBar.addEventListener('pointerdown', (event) => event.stopPropagation());
  const body = document.createElement('div');
  body.className = 'urd-phone-set-body';
  phoneSetBar.appendChild(body);
  const count = document.createElement('span');
  count.className = 'urd-multi-count';
  body.appendChild(count);
  const btn = (html, label, run) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.innerHTML = html;
    b.title = label;
    b.setAttribute('aria-label', label);
    b.addEventListener('click', () => {
      const section = selectedEls()[0]?._urdCtx?.section;
      if (section && multiIds.size > 1) run(section, [...multiIds]);
    });
    body.appendChild(b);
    return b;
  };
  phoneSetBar._urd = {
    body,
    count,
    group: btn(GROUP_SVG, ta('canvas.phoneSet.group'), groupOnPhone),
    ungroup: btn(UNGROUP_SVG, ta('canvas.phoneSet.ungroup'), ungroupOnPhone),
    left: btn(rowSideSvg(4), ta('canvas.phoneSet.left'), (section, ids) => alignOnPhone(section, ids, 'left')),
    middle: btn(rowSideSvg(8.5), ta('canvas.phoneSet.middle'), (section, ids) => alignOnPhone(section, ids, 'middle')),
    right: btn(rowSideSvg(13), ta('canvas.phoneSet.right'), (section, ids) => alignOnPhone(section, ids, 'right')),
    front: btn(Z_FRONT_SVG, ta('canvas.ctx.toFront'), (section, ids) => bumpPhoneZ(section, ids, 1)),
    back: btn(Z_BACK_SVG, ta('canvas.ctx.toBack'), (section, ids) => bumpPhoneZ(section, ids, -1)),
  };
  document.body.appendChild(phoneSetBar);
}

/** The phone's set bar for the set as it stands: its count, each button greyed where it would act on nothing, and its place above the set. */
function updatePhoneSetBar() {
  const els = selectedEls();
  const section = els[0]?._urdCtx?.section;
  if (els.length < 2 || !section) {
    phoneSetBar?.classList.remove('visible');
    return;
  }
  if (!phoneSetBar) buildPhoneSetBar();
  const bar = phoneSetBar._urd;
  const ids = [...multiIds];
  const setup = phoneSetupOf(section);
  // Only a change is written, so the editor's copy of the bar is sent its tools again only then.
  const text = ta('canvas.selectedCount', { n: els.length });
  if (bar.count.textContent !== text) bar.count.textContent = text;
  const grey = (b, off) => {
    if (b.disabled !== off) b.disabled = off;
  };
  grey(bar.group, !phoneGroup(section.blocks, setup, ids));
  grey(bar.ungroup, !phoneUngroupAll(section.blocks, setup, ids));
  for (const side of ['left', 'middle', 'right']) grey(bar[side], !phoneAlignCells(section.blocks, setup, ids, side));
  grey(bar.front, !phoneLayerChanges(section.blocks, ids, 1).size);
  grey(bar.back, !phoneLayerChanges(section.blocks, ids, -1).size);
  if (!phoneSetBar.classList.contains('visible')) phoneSetBar.classList.add('visible');
  placeAbove(phoneSetBar, els);
}

/** A set's bar above the set, centred on it and kept inside the window. */
function placeAbove(bar, els) {
  const rects = els.map((el) => el.getBoundingClientRect());
  const left = Math.min(...rects.map((r) => r.left));
  const right = Math.max(...rects.map((r) => r.right));
  const top = Math.min(...rects.map((r) => r.top));
  const x = clamp((left + right) / 2 - bar.offsetWidth / 2, 8, window.innerWidth - bar.offsetWidth - 8);
  const y = Math.max(8, top - bar.offsetHeight - 10);
  bar.style.left = `${x}px`;
  bar.style.top = `${y}px`;
}

/** The set's bar: the desktop's, or the phone's in the phone view (updatePhoneSetBar), whose copy beside the phone the editor is told of. */
function updateMultiToolbar() {
  const on = multiIds.size >= 2 && !document.body.classList.contains('urd-chrome-off');
  const phone = isMobile();
  if (!on || phone) multiBar?.classList.remove('visible');
  if (!on || !phone) phoneSetBar?.classList.remove('visible');
  if (phone) watchPhoneBar();
  if (!on) return;
  if (phone) {
    updatePhoneSetBar();
    return;
  }
  if (!multiBar) buildMultiBar();
  const els = selectedEls();
  if (els.length < 2) {
    multiBar.classList.remove('visible');
    return;
  }
  multiBar._urdCount.textContent = ta('canvas.selectedCount', { n: els.length });
  // The distribute buttons require at least three blocks (settings only when relevant).
  for (const b of multiBar._urdDist) b.style.display = els.length >= 3 ? '' : 'none';
  multiBar.classList.add('visible');
  placeAbove(multiBar, els);
}

// The toolbar follows the set on scroll/resize (fixed positioning).
// On a scroll the phone's set bar only moves: its buttons are weighed when the set or the page changes (updatePhoneSetBar).
window.addEventListener('scroll', () => {
  if (multiIds.size < 2) return;
  if (isMobile() && phoneSetBar?.classList.contains('visible')) placeAbove(phoneSetBar, selectedEls());
  else updateMultiToolbar();
}, { passive: true, capture: true });
window.addEventListener('resize', () => { if (multiIds.size > 1) updateMultiToolbar(); });

/** The set's frames as plain items for align/distribute. */
function selectionItems() {
  return selectedEls()
    .map((el) => {
      const block = el._urdCtx?.block;
      return block ? { id: block.id, ...block.frames.desktop } : null;
    })
    .filter(Boolean);
}

/** Record a list of moves as ONE undo step (shared groupKey), with the
 *  frames a settle wrote before them (settleFrames). */
function applySelectionMoves(moves, settle = null) {
  if (!moves.length) {
    settle?.undo();
    return;
  }
  // Writes geometry straight onto the elements without a re-render, so
  // the pinning must let go first (otherwise the next pin is measured
  // against the old place).
  suspendSticky();
  suspendPush();
  const key = makeId('malign');
  const section = selectedEls()[0]?._urdCtx?.section;
  if (section) postSettled(section, settle, moves.map((m) => m.id), key);
  for (const move of moves) {
    const el = document.querySelector(`.urd-block[data-block-id="${CSS.escape(move.id)}"]`);
    const ctx = el?._urdCtx;
    if (!ctx) continue;
    const frame = { ...ctx.block.frames.desktop };
    if (typeof move.x === 'number') frame.x = move.x;
    if (typeof move.y === 'number') frame.y = move.y;
    ctx.block.frames.desktop = frame;
    drawFrame(el, frame);
    post({ type: 'urd-move', sectionId: ctx.section.id, blockId: move.id, frame, frameKey: 'desktop', coalesce: true, groupKey: key });
  }
  resumeSticky();
  resumePush();
  updateMultiToolbar();
}

/** Settles the set's frames to their boxes (settleFrames), so align and
 *  distribute work on the bottoms and middles the owner sees. */
function settleSelection() {
  const ctx = selectedEls()[0]?._urdCtx;
  if (!ctx) return null;
  return settleFrames(ctx.host, ctx.section, selectedEls().map((el) => el._urdCtx?.block?.id).filter(Boolean));
}

function applyAlign(mode) {
  const settle = settleSelection();
  applySelectionMoves(alignMoves(selectionItems(), mode), settle);
}

function applyDistribute(axis) {
  const settle = settleSelection();
  applySelectionMoves(distributeMoves(selectionItems(), axis), settle);
}

/** Ctrl+C and Ctrl+X: the set (or the single selected block) to the clipboard. */
function copySelection(ctx, cut = false) {
  copyBlocks(ctx.section, multiIds.size > 1 ? [...multiIds] : [selectedBlockId], cut);
}

/**
 * Ctrl+V: paste the clipboard with the internal layout preserved - all
 * blocks get the SAME offset (slightly down/right, clamped by groupDelta
 * so the whole group stays within the section). The target is the active
 * section, otherwise the source section, otherwise the section in view,
 * otherwise the first. Sent together as urd-add-blocks = ONE undo step,
 * and the new set is selected. A section on the clipboard lands below the
 * active section instead (pasteSection).
 * From a section's menu (`point`) the blocks go into that section, and in the phone view land at the point the menu was opened at.
 */
function pasteClipboard(source = clipboard, point = null) {
  if (source?.kind === 'section') {
    pasteSection();
    return;
  }
  if (!source?.blocks?.length) return;
  const sourceHost = source.sectionId ? document.querySelector(`.urd-section[data-section-id="${CSS.escape(source.sectionId)}"]`) : null;
  // A section showing its phone layout in the desktop view (render.js urd-handoff) takes no blocks there.
  const usable = (el) => (el && !el.classList.contains('urd-handoff') ? el : null);
  const host = point?.host ? usable(point.host)
    : usable(document.querySelector('.urd-section-active')) ?? usable(sourceHost) ?? usable(sectionInView()) ?? document.querySelector('.urd-section:not(.urd-handoff)');
  if (!host) return;
  const sectionId = host.dataset.sectionId;
  const r2 = (v) => Math.round(v * 100) / 100;
  const frames = source.blocks.map((b) => b.frames.desktop);
  const { dx, dy } = groupDelta(frames, 2, 16);
  const ids = new Map();
  const blocks = source.blocks.map((b) => {
    const copy = JSON.parse(JSON.stringify(b));
    copy.id = makeId('blk');
    ids.set(b.id, copy.id);
    // A name belongs to one spot on the page, so the copy arrives without it.
    delete copy.anchor;
    copy.frames.desktop = { ...copy.frames.desktop, x: r2(copy.frames.desktop.x + dx), y: copy.frames.desktop.y + dy };
    return copy;
  });
  // A copy's place in the phone order follows a block copied with it; one naming another block stays in its own section and is dropped in another.
  for (const copy of blocks) {
    const side = typeof copy.phonePlace?.before === 'string' ? 'before' : typeof copy.phonePlace?.after === 'string' ? 'after' : null;
    if (side && ids.has(copy.phonePlace[side])) copy.phonePlace = { [side]: ids.get(copy.phonePlace[side]) };
    else if (copy.phonePlace && (!side || source.sectionId !== sectionId)) delete copy.phonePlace;
  }
  const minBottom = Math.max(...blocks.map((b) => b.frames.desktop.y + b.frames.desktop.h));
  // In the phone view the blocks stand on the phone only, from the point the section's menu was opened at, first in the section from its bar beside the phone, else last.
  const drop = !isMobile() || !point?.host ? null
    : Number.isFinite(point.x) ? phoneDropAtPoint(host, host._urdSection, point.x, point.y) : phoneDropFirst(host);
  post({ type: 'urd-add-blocks', sectionId, blocks, minBottom, moves: [], ...phoneAdd(drop) });
  // The next paste continues from the pasted content (no stacking on top of each other).
  if (source === clipboard) clipboard = { kind: 'blocks', sectionId, blocks: JSON.parse(JSON.stringify(blocks)) };
  // The pasted content becomes the new set: the re-render after
  // urd-add-blocks reads multiIds/selectedBlockId (enhanceSection), and
  // the editor follows.
  document.querySelectorAll('.urd-block.urd-selected, .urd-block.urd-multi-selected')
    .forEach((b) => b.classList.remove('urd-selected', 'urd-multi-selected'));
  multiSectionId = sectionId;
  multiIds = blocks.length > 1 ? new Set(blocks.map((b) => b.id)) : new Set();
  selectedBlockId = blocks[0].id;
  post({ type: 'urd-select-block', sectionId, blockId: selectedBlockId });
}

/**
 * Insert a block-group template into a section: re-id + anchor/clamp via the template model (the re-id rule in SCHEMA.md), ONE undo step via urd-add-blocks, and the inserted content becomes the new set (the same tail as pasteClipboard).
 * anchor = {x in %, y in px} or null; `phone` is the place in the phone view (phoneAdd).
 */
function insertBlocksTemplate(tpl, sectionId, anchor, phone = {}) {
  const { blocks, minBottom } = cloneBlocksForInsert(tpl.blocks, makeId, { anchor });
  post({ type: 'urd-add-blocks', sectionId, blocks, minBottom, moves: [], ...phone });
  document.querySelectorAll('.urd-block.urd-selected, .urd-block.urd-multi-selected')
    .forEach((b) => b.classList.remove('urd-selected', 'urd-multi-selected'));
  multiSectionId = sectionId;
  multiIds = blocks.length > 1 ? new Set(blocks.map((b) => b.id)) : new Set();
  selectedBlockId = blocks[0].id;
  post({ type: 'urd-select-block', sectionId, blockId: selectedBlockId });
}

/** The Blocks panel's My templates group (urd-insert-template): insert into the active section (otherwise the first) with stored positions, clamping only; a section showing its phone layout on the desktop (urd-handoff) is edited in the phone view and takes none, as placeBlock does. */
export function insertTemplate(id) {
  const tpl = templates.find((m) => m.id === id && m.kind === 'blocks' && Array.isArray(m.blocks));
  const host = document.querySelector('.urd-section-active:not(.urd-handoff)') ?? document.querySelector('.urd-section:not(.urd-handoff)');
  if (!tpl || !host) return;
  insertBlocksTemplate(tpl, host.dataset.sectionId, null, phoneAdd(isMobile() ? phoneDropMid(host) : null));
}

/** Ctrl+D with a multi-selection: duplicate the set (via the paste flow). */
function duplicateSelection(ctx) {
  const ids = [...multiIds];
  const blocks = ctx.section.blocks.filter((b) => ids.includes(b.id));
  pasteClipboard({ sectionId: ctx.section.id, blocks: JSON.parse(JSON.stringify(blocks)) });
}

/**
 * Select a block by id (the bridge: the editor just built the block
 * itself, e.g. from the + New block menu, and the preview does not know
 * the id until the section is re-rendered). Called AFTER the re-render.
 * A block `picked` in the editor's own lists (the Phone panel's order) is
 * brought into view, and the focus stays in the list.
 * A block in a section showing its phone layout on the desktop (urd-handoff) is not selected there: that section is edited in the phone view.
 */
export function selectById(blockId, picked = false) {
  const el = document.querySelector(`.urd-section:not(.urd-handoff) .urd-block[data-block-id="${CSS.escape(blockId)}"]`);
  if (!el) return;
  selectBlock(el, { keepFocus: picked });
  if (picked) el.scrollIntoView({ block: 'nearest', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
}

/** The blocks just added that wait for their box fitted to what they draw, by id: their section and the width they were added at, in percent (fitNewBlock). */
const pendingNewFits = new Map();

/** The editing chrome inside a block, which never counts in what it draws. */
const FIT_CHROME = '.urd-edit-toolbar, .urd-edit-resize, .urd-edit-rotate, .urd-edit-readout, .urd-hint-chip, .urd-hint-card, .urd-anchor, .urd-sticky-badge, .urd-mobile-pin, .urd-phone-words';

/** How far the block's content spills past the boxes that hold it, in px, the editing chrome left out: past its own box, by what stands in it, and past every box inside it. */
function spill(el) {
  const box = el.getBoundingClientRect();
  let sum = 0;
  for (const child of el.children) {
    if (child.matches(FIT_CHROME)) continue;
    const r = child.getBoundingClientRect();
    if (r.width > 0) sum += Math.max(0, r.right - box.right) + Math.max(0, box.left - r.left);
  }
  for (const node of el.querySelectorAll('*')) {
    if (node.closest(FIT_CHROME)) continue;
    sum += Math.max(0, node.scrollWidth - node.clientWidth);
  }
  return sum;
}

/** The lines the block's words stand on, every text counted, the editing chrome left out. */
function lineCount(el) {
  let lines = 0;
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    if (!node.textContent.trim() || node.parentElement?.closest(FIT_CHROME)) continue;
    const range = document.createRange();
    range.selectNodeContents(node);
    lines += new Set([...range.getClientRects()].filter((r) => r.width > 0).map((r) => Math.round(r.top))).size;
  }
  return lines;
}

/**
 * A block's box fitted to what it draws, at the width it was added at (`startPx`): the narrowest width at which its words stand on no more lines, nothing in it spills sideways and it grows no taller (a grid of cards that would lose a column), no narrower than `floor`, and the height its content needs there, both in px; null where it draws nothing yet.
 * Content that only gets smaller as the block narrows (a number sized by the block's width) shrinks with it until its words wrap. The block is measured as a visitor sees it (urd-fit-measure, visitorHeights), and stands at its own width again after.
 * @param {HTMLElement} el The block element
 * @param {number} startPx
 * @param {number} floor
 * @returns {{w: number, h: number}|null}
 */
function fittedSize(el, startPx, floor) {
  const keep = el.style.width;
  const asVisitor = !el.classList.contains('urd-fit-measure');
  if (asVisitor) el.classList.add('urd-fit-measure');
  const at = (w) => {
    el.style.width = `${w}px`;
    return { h: visitorHeights(el).resting, lines: lineCount(el), over: spill(el) };
  };
  try {
    const start = at(Math.round(startPx));
    if (!start.h) return null;
    const changes = (w) => {
      const m = at(w);
      return m.lines > start.lines || m.over > start.over + 1 || m.h > start.h + 1;
    };
    const w = narrowestWidth(floor, startPx, changes);
    return { w, h: at(w).h };
  } finally {
    el.style.width = keep;
    if (asVisitor) el.classList.remove('urd-fit-measure');
  }
}

/**
 * A new block fitted to what it draws (the urd-fit-new message, add-fit.js), which the editor sends before the section that holds it: the block is drawn hidden, fitted before the screen shows it, and shown at its fitted size, so it never changes size once it is seen (beginNewFit).
 * @param {string} sectionId
 * @param {string} blockId
 * @param {number} startW The width it was added at, in percent of the canvas
 */
export function fitNewBlock(sectionId, blockId, startW) {
  pendingNewFits.set(blockId, { sectionId, startW });
  const el = document.querySelector(`.urd-block[data-block-id="${CSS.escape(blockId)}"]`);
  if (el?._urdCtx && !isMobile()) beginNewFit(el, el._urdCtx.block);
}

/** The time between two measures of a plugin's block, whose content may arrive late without saying so, in ms. */
const NEW_FIT_STEP = 120;

/** The measures a plugin's block is given before it is shown as it stands, and the time a block that says when it has drawn (DRAWS_LATE) is waited for, about four seconds. */
const NEW_FIT_TRIES = 33;
const NEW_FIT_WAIT = NEW_FIT_STEP * NEW_FIT_TRIES;

/**
 * Fits a block just added as it is drawn: hidden until fitted, and measured before the next paint; a block that draws its content later (DRAWS_LATE) before the paint after it says it has drawn (urd-drawn), and a plugin's block that asks to be fitted (pluginFits), whose content may arrive late without saying so, once two measures in a row agree and nothing in it is loading.
 * A calendar fitted below NARROW_PX turns to its narrow layouts in place, so it stays hidden two frames more and is measured again in them. The fitted frame is drawn on the block (drawFrame), put in the page's copy of the section, the block shown, and the fit sent to the editor (urd-new-fitted), with no size where none is taken, so the editor finishes the add either way; a block drawn again meanwhile carries on in its new element.
 * @param {HTMLElement} el The block element
 * @param {object} block The block's data
 */
function beginNewFit(el, block) {
  const pending = pendingNewFits.get(block.id);
  if (!pending) return;
  el.style.visibility = 'hidden';
  const def = window.Urd.blocks.get(block.type);
  const polls = !DRAWS_LATE.has(block.type) && Boolean(def?.fromPlugin);
  let last = '';
  let tries = 0;
  const host = () => el.closest('.urd-section');
  const widthOf = () => (host() ? canvasOf(host()).clientWidth : 0);
  const measureAt = (px, width) => fittedSize(el, px, addedFloor(block, (pending.startW / 100) * width));
  /** The fitted frame on the block and in the page's copy, its width rounded up so the words never wrap one line more. */
  const put = (fit, width) => {
    const frame = fittedFrame(block.frames.desktop, Math.ceil((fit.w / width) * 10000) / 100, fit.h);
    block.frames.desktop = frame;
    drawFrame(el, frame);
    if (host()) syncSectionHeight(host());
    return frame;
  };
  const show = (frame) => {
    pendingNewFits.delete(block.id);
    el.style.visibility = '';
    post({ type: 'urd-new-fitted', sectionId: pending.sectionId, blockId: block.id, w: frame?.w ?? null, h: frame?.h ?? null });
  };
  const finish = (fit, width) => {
    if (!fit || !block.frames?.desktop) {
      show(null);
      return;
    }
    const frame = put(fit, width);
    const startPx = (pending.startW / 100) * width;
    if (block.type !== 'calendar' || startPx < NARROW_PX || fit.w >= NARROW_PX) {
      show(frame);
      return;
    }
    // The calendar redraws its narrow layouts in the frame after its ruler hears the width: measured again in them, from the width it now stands at.
    requestAnimationFrame(() => requestAnimationFrame(() => {
      if (!el.isConnected || pendingNewFits.get(block.id) !== pending) return;
      try {
        const again = measureAt(fit.w, widthOf());
        show(again ? put(again, widthOf()) : frame);
      } catch {
        show(frame);
      }
    }));
  };
  const step = () => {
    if (!el.isConnected || pendingNewFits.get(block.id) !== pending) return;
    try {
      const width = widthOf();
      const fit = width && !el.querySelector('[aria-busy="true"]') ? measureAt((pending.startW / 100) * width, width) : null;
      const said = fit ? `${fit.w}x${fit.h}` : '';
      tries += 1;
      if ((fit && (!polls || said === last)) || tries >= NEW_FIT_TRIES) {
        finish(fit, width);
        return;
      }
      last = said;
      setTimeout(step, NEW_FIT_STEP);
    } catch {
      // A block that cannot be measured is shown as it was added.
      show(null);
    }
  };
  if (!pluginFits(def)) {
    show(null);
    return;
  }
  if (!DRAWS_LATE.has(block.type)) {
    requestAnimationFrame(step);
    return;
  }
  // Measured in the frame after the block says it has drawn, or, where it never says so, as it stands after the wait.
  const late = setTimeout(() => requestAnimationFrame(() => {
    tries = NEW_FIT_TRIES;
    step();
  }), NEW_FIT_WAIT);
  el.addEventListener('urd-drawn', () => {
    clearTimeout(late);
    requestAnimationFrame(step);
  }, { once: true });
}

/**
 * The blocks a row under the pointer in the editor's lists stands for, lit on the canvas (the urd-light message: the Phone panel's order, a stack lighting all of its blocks), or the section a heading of the order's column stands for; an empty list and no section take the light away.
 * @param {string[]} ids
 * @param {string} [sectionId]
 */
export function lightBlocks(ids, sectionId) {
  document.querySelectorAll('.urd-block.urd-lit, .urd-section.urd-lit').forEach((el) => el.classList.remove('urd-lit'));
  if (typeof sectionId === 'string') document.querySelector(`.urd-section[data-section-id="${CSS.escape(sectionId)}"]`)?.classList.add('urd-lit');
  for (const id of ids) {
    if (typeof id === 'string') document.querySelector(`.urd-block[data-block-id="${CSS.escape(id)}"]`)?.classList.add('urd-lit');
  }
}

/**
 * Pins a block on the phone where it stands now (the urd-phone-pin message: the Phone panel's row menu), as its bar's pin does; nothing for a block that does not flow in the phone view.
 * @param {string} blockId
 */
export function pinOnPhoneAt(blockId) {
  if (typeof blockId === 'string') document.querySelector(`.urd-block[data-block-id="${CSS.escape(blockId)}"]`)?._urdPinOnPhone?.();
}

/** Nothing selected (the urd-deselect message: a press on the editor's stage around the canvas): no block, no set of blocks and no section at work. */
export function deselectAll() {
  selectBlock(null);
  markActiveVisual(null);
}

/** Duplicate the selected block (the bridge: «Duplicate» in the element menu, and Ctrl+D with focus in the admin panels, which the editor sends from the desktop view only); in the phone view the copy stands on the phone only (duplicateBlock). */
export function duplicateSelected() {
  if (!selectedBlockId) return;
  const ctx = document.querySelector(`.urd-block[data-block-id="${selectedBlockId}"]`)?._urdCtx;
  if (ctx) duplicateBlock(ctx.section, ctx.block);
}

/** The drop right after the line a block stands on in the phone view (phoneAfterLine), or null where it is not drawn there. */
function phoneDropAfter(section, blockId) {
  const host = document.querySelector(`.urd-section[data-section-id="${CSS.escape(section.id)}"]`);
  const flowEl = host && canvasOf(host).querySelector(':scope > .urd-flow');
  return flowEl ? phoneAfterLine(phoneUnitBoxes(host, section, flowEl), blockId) : null;
}

/** Duplicate a block: a copy with a new id, slightly offset, in the same section. */
function duplicateBlock(section, block) {
  const copy = JSON.parse(JSON.stringify(block));
  copy.id = makeId('blk');
  // A name belongs to one spot on the page, so the duplicate arrives without it.
  delete copy.anchor;
  const f = copy.frames.desktop;
  copy.frames.desktop = {
    ...f,
    x: clamp(Math.round((f.x + 2) * 100) / 100, 0, Math.max(0, Math.round((100 - f.w) * 100) / 100)),
    y: f.y + 16,
  };
  // In the phone view the copy stands on the phone only, right after the line its block stands on.
  post({ type: 'urd-add-block', sectionId: section.id, block: copy, ...phoneAdd(isMobile() ? phoneDropAfter(section, block.id) : null) });
  // The duplicate becomes the selected block: the re-render after
  // urd-add-block selects it (enhanceSection reads selectedBlockId), and
  // the editor follows via urd-select-block so the Properties panel shows
  // the copy.
  document.querySelectorAll('.urd-block.urd-selected').forEach((b) => b.classList.remove('urd-selected'));
  selectedBlockId = copy.id;
  post({ type: 'urd-select-block', sectionId: section.id, blockId: copy.id });
}

/**
 * Visible grid overlay in the section while dragging/resizing, so the snapping has something visible to snap against.
 * The lines, the dots or the columns are drawn with CSS gradients at the exact cell size (base.css, by `look`), the cells counted out from the content's middle.
 * @param {HTMLElement} host
 * @param {{size: number}} grid
 * @param {'lines'|'dots'|'columns'} look
 */
function showGridOverlay(host, grid, look) {
  const overlay = document.createElement('div');
  overlay.className = 'urd-grid-overlay';
  overlay.dataset.look = look;
  overlay.style.setProperty('--urd-grid', `${grid.size}px`);
  // In the content surface, not in the section: the snapping is relative
  // to the surface, so the cells must start where the blocks start.
  canvasOf(host).appendChild(overlay);
  return overlay;
}

function enhanceBlock(el, block, section, grid, host) {
  el.classList.add('urd-editable');
  if (block.id === selectedBlockId) el.classList.add('urd-selected');
  if (block.decor) el.classList.add('urd-decor');
  // The keyboard handler (arrow keys/Delete) needs the block's context.
  el._urdCtx = { block, section, grid, host };
  // A block just added waits, hidden, for its box fitted to what it draws (fitNewBlock).
  if (pendingNewFits.has(block.id) && !isMobile()) beginNewFit(el, block);

  const mobile = isMobile();

  const toolbar = document.createElement('div');
  toolbar.className = `urd-edit-toolbar urd-bar-${barLook()} urd-bar-size-${barSize()}`;
  /** The bar itself, which a look frames: the toolbar around it keeps the invisible bridge down to the block. */
  const barBody = document.createElement('div');
  barBody.className = 'urd-bar-body';
  toolbar.appendChild(barBody);
  // The toolbar sits above the block; at the top of the page or right
  // below the menu there is no visible room there (above the document top
  // or behind the menu). Then it flips below the block. Measured against
  // the VIEWPORT when the pointer hits the block (and on selection): the
  // position is changed by both dragging and scrolling, which never
  // re-render.
  const updateToolbarSide = () => {
    const cs = getComputedStyle(document.documentElement);
    const navH = Number.parseFloat(cs.getPropertyValue('--urd-nav-h-base'))
      || Number.parseFloat(cs.getPropertyValue('--urd-nav-h')) || 0;
    const scale = Number.parseFloat(cs.getPropertyValue('--urd-chrome-scale')) || 1;
    const under = el.getBoundingClientRect().top < navH + 34 * scale;
    toolbar.classList.toggle('urd-toolbar-under', under);
    placeToolbar(under);
  };
  // An upright bar that would run past the canvas's right edge is moved left by what runs over, once it is drawn (shiftInto in place.js), so every tool stays in reach; the move is in the block's own px, the block's own scale taken out.
  const keepToolbarIn = () => {
    toolbar.style.translate = '';
    if (!toolbar.isConnected || Number.parseFloat(el.style.getPropertyValue('--urd-block-rot'))) return;
    const box = toolbar.getBoundingClientRect();
    if (!box.width) return;
    const shift = shiftInto(box.left, box.width, document.documentElement.clientWidth);
    if (shift >= 0) return;
    const zoom = el.getBoundingClientRect().width / el.offsetWidth || 1;
    toolbar.style.translate = `${shift / zoom}px 0`;
  };
  // The block carries its bar's keeping, for selectBlock to ask for once the block is selected and its bar shows.
  el._urdKeepBar = () => requestAnimationFrame(keepToolbarIn);
  // On a rotated block the toolbar is anchored at the block's bounding box
  // on the screen (toolbarAnchor), clear of the content, and turns itself
  // upright there; unrotated, base.css places it at the block's own edge.
  const placeToolbar = (under = toolbar.classList.contains('urd-toolbar-under')) => {
    const rot = Number.parseFloat(el.style.getPropertyValue('--urd-block-rot')) || 0;
    // A shift kept from an upright bar is never carried onto a turned one; an upright bar is kept inside the canvas anew once drawn.
    toolbar.style.translate = '';
    if (!rot) {
      toolbar.style.left = '';
      toolbar.style.top = '';
      toolbar.style.bottom = '';
      requestAnimationFrame(keepToolbarIn);
      return;
    }
    const { left, top } = toolbarAnchor(el.offsetWidth, el.offsetHeight, rot, under);
    toolbar.style.left = `${left}px`;
    // Above, the toolbar hangs from its bottom edge; under, from its top.
    toolbar.style.top = under ? `${top}px` : 'auto';
    toolbar.style.bottom = under ? 'auto' : `${el.offsetHeight - top}px`;
  };
  updateToolbarSide();
  el.addEventListener('pointerenter', updateToolbarSide);

  // The image editor is the admin's (PictureEditor.svelte): the block asks it to open, with its frame's shape as drawn here, so the editor's crop window has the frame's real proportions.
  const askPictureEditor = (kind) => {
    const box = (kind === 'cover' ? el.querySelector('.urd-cover') : el.querySelector('.urd-image-frame')) ?? el;
    post({ type: 'urd-picture-edit', kind, sectionId: section.id, blockId: block.id, frameRatio: box.offsetHeight ? box.offsetWidth / box.offsetHeight : 0, frameWidth: box.offsetWidth, frameHeight: box.offsetHeight });
  };
  // Only where a cover is drawn: an embed with a link the video block can play, asked about before it loads.
  const coverEditable = block.type === 'video' && block.props.source !== 'file' && block.props.askFirst !== false && Boolean(embedUrl(block.props.url));
  if (block.type === 'image') {
    el.addEventListener('dblclick', (event) => {
      event.preventDefault();
      askPictureEditor('image');
    });
  }

  /** A calendar's example events on and off (blocks/calendar.js): pressed while they stand in for its own; the tooltip tells why it has none of its own where its feed failed, read again each time the calendar is drawn, since the feed answers after the bar is. */
  const exampleButton = () => {
    const btn = barButton(EXAMPLES_SVG, '', () => {
      toggleCalendarExamples(block.id);
      sync();
    }, 'urd-edit-examples', ta('canvas.cap.examples'));
    const sync = () => {
      const state = calendarExamples(block.id);
      const on = Boolean(state?.examples);
      const title = [ta(on ? 'calendar.hideExample' : 'calendar.showExample'), state?.reason].filter(Boolean).join('\n');
      btn.title = title;
      btn.setAttribute('aria-label', title);
      btn.setAttribute('aria-pressed', String(on));
    };
    sync();
    const onShown = () => {
      if (btn.isConnected) sync();
      else el.removeEventListener('urd-cal-shown', onShown);
    };
    el.addEventListener('urd-cal-shown', onShown);
    return btn;
  };
  const moveHandle = document.createElement('button');
  moveHandle.className = 'urd-edit-move';
  moveHandle.innerHTML = GRIP_SVG;
  // A block that flows on the phone is dragged into the phone's order and cells (flowDrag), and says so.
  const flowsOnPhone = mobile && !Number.isFinite(block.frames.mobile?.row);
  moveHandle.title = ta(flowsOnPhone ? 'canvas.dragPhone' : 'canvas.dragMove');
  moveHandle.dataset.cap = ta('canvas.cap.move');
  barBody.appendChild(moveHandle);
  const MOBILE_PIN_SVG = '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 17v5"/><path d="M9 3h6l-1 6 3 3v2H7v-2l3-3z"/></svg>';
  // The pin crossed out: unpin.
  const MOBILE_UNPIN_SVG = '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 17v5"/><path d="M9 3h6l-1 6 3 3v2H7v-2l3-3z"/><path d="M3 3l18 18"/></svg>';

  // In the phone view the pin stands first after ⠿, in the same place on every block: on a block that flows, the pin, which pins it where it stands now (it then keeps that spot and leaves the phone's order, ADR-0019); on a pinned block, the crossed pin, which unpins it back into the phone's order with its cells kept (urd-phone-unpin).
  if (mobile) {
    const pinned = !flowsOnPhone;
    const pinBtn = document.createElement('button');
    pinBtn.innerHTML = pinned ? MOBILE_UNPIN_SVG : MOBILE_PIN_SVG;
    pinBtn.title = ta(pinned ? 'canvas.unpinOnPhone' : 'canvas.pinOnPhone');
    pinBtn.dataset.cap = ta(pinned ? 'canvas.cap.unpin' : 'canvas.cap.pin');
    pinBtn.addEventListener('click', () => {
      if (pinned) post({ type: 'urd-phone-unpin', sectionId: section.id, blockId: block.id });
      else pinOnPhone();
    });
    barBody.appendChild(pinBtn);
  }

  // Flowing mobile block: arrows that move it in the reading order (stepPhone: its exception, its stack or the custom order). Pinned blocks do not take part in the flow.
  if (flowsOnPhone) {
    for (const [svg, dir, key] of [[ORDER_UP_SVG, -1, 'canvas.orderUp'], [ORDER_DOWN_SVG, 1, 'canvas.orderDown']]) {
      const btn = document.createElement('button');
      btn.innerHTML = svg;
      btn.title = ta(key);
      btn.dataset.cap = ta(dir < 0 ? 'canvas.cap.earlier' : 'canvas.cap.later');
      btn.addEventListener('click', () => stepPhone(section, block, dir, false));
      barBody.appendChild(btn);
    }
  }
  // The pin as the block's menu and the Phone panel reach it (pinOnPhoneAt): only a block that flows in the phone view, which measures where it stands.
  el._urdPinOnPhone = flowsOnPhone ? pinOnPhone : null;

  // A block pinned on the phone carries the pin mark; a block placed for the phone that still flows (its cells, its height) carries none, and a ↺ on its bar resets ONLY this block's override (back in sync with desktop).
  if (mobile && !flowsOnPhone) {
    const pin = document.createElement('div');
    pin.className = 'urd-mobile-pin';
    pin.innerHTML = MOBILE_PIN_SVG;
    pin.title = ta('canvas.mobilePinned');
    el.appendChild(pin);
  }
  if (flowsOnPhone && block.frames.mobile) {
    const resetBtn = document.createElement('button');
    resetBtn.innerHTML = RESET_SVG;
    resetBtn.title = ta('canvas.mobileResetBlock');
    resetBtn.dataset.cap = ta('canvas.cap.reset');
    resetBtn.addEventListener('click', () => {
      post({ type: 'urd-mobile-reset', sectionId: section.id, blockId: block.id });
    });
    barBody.appendChild(resetBtn);
  }

  // A block with words of its own on the phone (ADR-0033): a mark in the phone view, beside the pin of a block pinned there, standing from the first word typed there, since the typing draws nothing again.
  if (mobile && PHONE_WORDS[block.type]) {
    const markWords = () => {
      if (el.querySelector(':scope > .urd-phone-words')) return;
      const words = document.createElement('div');
      words.className = 'urd-phone-words';
      words.classList.toggle('urd-phone-words-beside', !flowsOnPhone);
      words.innerHTML = '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M5 7h14M5 12h14M5 17h9"/></svg>';
      words.title = ta('canvas.phoneWords');
      el.appendChild(words);
    };
    if (Object.keys(phoneWordsOf(block.type, block.phoneProps)).length) markWords();
    el.addEventListener('input', markWords);
  }

  /** The block's bin: it deletes the block at a press, and undo brings it back; on every form of the bar, in both views, before ⋮ (ADR-0019). */
  const deleteButton = () => {
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'urd-edit-delete';
    deleteBtn.dataset.cap = ta('canvas.cap.delete');
    deleteBtn.innerHTML = BIN_SVG;
    deleteBtn.title = ta('canvas.deleteBlock');
    deleteBtn.addEventListener('click', () => {
      post({ type: 'urd-delete', sectionId: section.id, blockId: block.id });
      // Without deselecting, a phantom selection of the deleted block would survive in the module state.
      selectBlock(null);
    });
    return deleteBtn;
  };

  // In the phone view the block's design on a phone and its menu are one press away too: the design button opens the design it draws on a phone where it has one (the calendar's phone view, PHONE_DESIGNS), its design otherwise, and the gear its menu.
  if (mobile) {
    if (hasDesigns(block)) barBody.appendChild(designButton(el, section, block, block.type === 'calendar' || Boolean(PHONE_DESIGNS[block.type])));
    if (block.type === 'calendar') barBody.appendChild(exampleButton());
    // With small panels the gear is the word for the settings, as the desktop bar's first word is for a block without its own editor.
    if (TOOL_FORMS.includes(barForm())) barBody.appendChild(opensMenu(barButton(ta('canvas.ctx.settings'), ta('canvas.blockMenu'), () => openBlockSettings(el, section, block), 'urd-edit-lead')));
    else barBody.appendChild(menuButton(el, section, block));
    barBody.appendChild(deleteButton());
    // The right-click menu under ⋮, as on the desktop's shorter bars: the way to it by touch.
    barBody.appendChild(moreButton((x, y, from) => openContextMenu(el, x, y, from)));
  }

  const form = barForm();
  // Mobile visibility: phone = the block is shown on mobile, crossed-out
  // phone = it is hidden (hideMobile). The icon IS the state (a drawn
  // SVG, not emoji); the tooltip explains the click. The full bar draws it,
  // and the shorter bars where «Phone button on the bar» asks for it.
  const PHONE_SVG = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M10.5 18.2h3"/></svg>';
  const PHONE_OFF_SVG = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M10.5 18.2h3"/><path d="M3.5 3.5l17 17"/></svg>';
  const phoneButton = () => {
    const hideBtn = document.createElement('button');
    hideBtn.className = 'urd-edit-decor';
    hideBtn.dataset.cap = ta('canvas.cap.phone');
    const syncHide = () => {
      hideBtn.innerHTML = block.hideMobile ? PHONE_OFF_SVG : PHONE_SVG;
      hideBtn.title = block.hideMobile
        ? ta('canvas.hideMobileOn')
        : ta('canvas.hideMobileOff');
      hideBtn.classList.toggle('on', Boolean(block.hideMobile));
    };
    syncHide();
    hideBtn.addEventListener('click', () => {
      block.hideMobile = !block.hideMobile;
      syncHide();
      post({ type: 'urd-block-flag', sectionId: section.id, blockId: block.id, hideMobile: block.hideMobile });
    });
    return hideBtn;
  };
  /** The image or cover editor, one press away. */
  const imageButton = () => {
    const imgBtn = document.createElement('button');
    imgBtn.className = 'urd-edit-image';
    imgBtn.dataset.cap = ta('canvas.cap.image');
    imgBtn.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3l4 4L8 20l-5 1 1-5L17 3z"/></svg>';
    imgBtn.title = ta(coverEditable ? 'canvas.editCover' : 'canvas.editImage');
    imgBtn.addEventListener('click', () => askPictureEditor(coverEditable ? 'cover' : 'image'));
    return imgBtn;
  };
  const bumpZ = (dir) => bumpBlockZ(host, section, block, el, dir);
  // The layer order and the phone button stand on the desktop's full bar; the phone view's bar is layout, its bin and its menus.
  if (!mobile && form === 'full') {
    const frontBtn = document.createElement('button');
    frontBtn.innerHTML = Z_FRONT_SVG;
    frontBtn.title = ta('canvas.zFront');
    frontBtn.dataset.cap = ta('canvas.cap.front');
    frontBtn.addEventListener('click', () => bumpZ(1));
    barBody.appendChild(frontBtn);

    const backBtn = document.createElement('button');
    backBtn.innerHTML = Z_BACK_SVG;
    backBtn.title = ta('canvas.zBack');
    backBtn.dataset.cap = ta('canvas.cap.back');
    backBtn.addEventListener('click', () => bumpZ(-1));
    barBody.appendChild(backBtn);

    barBody.appendChild(phoneButton());

    const DUP_SVG = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h9"/></svg>';
    if (block.type === 'image' || coverEditable) barBody.appendChild(imageButton());
    if (block.type === 'calendar') barBody.appendChild(exampleButton());

    const dupBtn = document.createElement('button');
    dupBtn.innerHTML = DUP_SVG;
    dupBtn.title = ta('canvas.duplicate');
    dupBtn.dataset.cap = ta('canvas.cap.copy');
    dupBtn.addEventListener('click', () => duplicateBlock(section, block));
    barBody.appendChild(dupBtn);

    // Block menu: all the block settings in a floating menu by the block
    // (the calendar pattern). The menu itself lives in the editor (the
    // same controls as Properties); only the position is reported here.
    // The design picker one press away, beside the gear, on a block that has designs.
    if (hasDesigns(block)) barBody.appendChild(designButton(el, section, block, false));
    barBody.appendChild(menuButton(el, section, block));
    barBody.appendChild(deleteButton());
  }

  // The shorter bars: the acts the full bar holds besides these stand in the right-click menu under ⋮.
  if (!mobile && form !== 'full') {
    // With small panels the bar starts with a word for the block's main act: the image or cover editor, or its settings; a text is written where it stands, at a press on its words, so it needs no word of its own.
    const picture = block.type === 'image' || coverEditable;
    const leadIsSettings = form === 'panels' && !picture;
    if (form === 'panels') {
      const word = picture ? ta(coverEditable ? 'canvas.bar.editCover' : 'canvas.bar.editImage') : ta('canvas.ctx.settings');
      const tip = picture ? ta(coverEditable ? 'canvas.editCover' : 'canvas.editImage') : ta('canvas.blockMenu');
      const run = picture ? () => askPictureEditor(coverEditable ? 'cover' : 'image') : () => openBlockSettings(el, section, block);
      // The word «Settings» opens the block's menu and closes it at a second press, as the gear does.
      const lead = barButton(word, tip, run, 'urd-edit-lead');
      barBody.appendChild(picture ? lead : opensMenu(lead));
    }
    // Every group a tool: the word for the picture's own editor where it has one, then a tool for each group of its menu, which the right-click menu under ⋮ follows with the rest.
    if (form === 'groups' && picture) {
      const word = ta(coverEditable ? 'canvas.bar.editCover' : 'canvas.bar.editImage');
      barBody.appendChild(barButton(word, ta(coverEditable ? 'canvas.editCover' : 'canvas.editImage'), () => askPictureEditor(coverEditable ? 'cover' : 'image'), 'urd-edit-lead'));
    }
    const place = toolPlacer(barBody, barLook(form));
    if (form === 'short' && picture) barBody.appendChild(imageButton());
    if (block.type === 'calendar') place(exampleButton(), 'content');
    if (form === 'groups') {
      for (const tool of barTools(block.type, { designs: hasDesigns(block), block })) {
        const label = ta(tool.labelKey);
        place(tool.design ? designButton(el, section, block, false)
          : opensMenu(barButton(BAR_ICONS[tool.icon] ?? BAR_ICONS.pencil, label, () => openBlockTool(el, section, block, tool.only, label, tool.icon), '', label)), tool.area);
      }
    } else if (hasDesigns(block)) place(designButton(el, section, block, false), 'style');
    if (form === 'panels') {
      if (!DRAWS_NOTHING.has(block.type)) place(opensMenu(barButton(BAR_ICONS.motion, ta('group.motion'), () => openBlockTool(el, section, block, 'motion', '', 'motion'), '', ta('group.motion'))), 'style');
      place(opensMenu(barButton(BAR_ICONS.arrange, ta('props.tabPlacement'), () => openBlockTool(el, section, block, 'placement', '', 'arrange'), '', ta('props.tabPlacement'))), 'placement');
    }
    // The phone button on the shorter bars where «Phone button on the bar» asks for it, before the gear.
    if (barPhone()) barBody.appendChild(phoneButton());
    // The gear stands on the short bar, and on the bar of tools where nothing else opens the settings (not after the word «Settings», not where every group is a tool), or wherever «Settings gear on the bar» asks for it.
    if (form === 'short' || (form === 'panels' && !leadIsSettings) || barGear()) barBody.appendChild(menuButton(el, section, block));
    barBody.appendChild(deleteButton());
    barBody.appendChild(moreButton((x, y, from) => openContextMenu(el, x, y, from)));
  }
  // The block's help chip, drawn before its bar, is the bar's last tool, as one drawn after it is (attachHint in hint.js).
  const hintChip = el.querySelector(':scope > .urd-hint-chip');
  if (hintChip) barBody.appendChild(hintChip);
  el.appendChild(toolbar);

  const resizeHandle = document.createElement('div');
  resizeHandle.className = 'urd-edit-resize';
  resizeHandle.dataset.edge = 'se';
  // The handle of a block that follows its content changes its width only
  // (ADR-0025), and says so; on a block whose size is its frame it says that
  // Shift keeps the ratio.
  resizeHandle.title = flowsOnPhone ? ta('canvas.dragPhoneSize')
    : mobile ? ta(FIT_BY_WIDTH.has(block.type) ? 'canvas.dragResizeRatio' : 'canvas.dragResize')
    : followsContent(block) ? ta('canvas.dragResizeWidth')
    : FIT_BY_WIDTH.has(block.type) ? ta('canvas.dragResizeRatio') : ta('canvas.dragResize');
  el.appendChild(resizeHandle);
  // The other edges and corners take the same drag with the opposite edge held still, on the desktop frame.
  // On the desktop a block that follows its content gets the left and right edges only, since its height is the content's; on the phone every block has all of them, its width and height there its own, words never cut off (0.7.3.18).
  const edgeHandles = [];
  {
    const edges = mobile || !followsContent(block) ? ['n', 's', 'e', 'w', 'ne', 'sw', 'nw'] : ['e', 'w'];
    for (const edge of edges) {
      const h = document.createElement('div');
      h.className = 'urd-edit-resize';
      h.dataset.edge = edge;
      // An edge handle moves one axis, so it says nothing of the ratio Shift keeps on a corner; on the phone each says what it sets there.
      h.title = flowsOnPhone ? ta(edge.length === 2 ? 'canvas.dragPhoneSize' : edge === 'e' || edge === 'w' ? 'canvas.dragPhoneWidth' : 'canvas.dragPhoneHeight')
        : mobile ? (edge.length === 2 ? resizeHandle.title : ta('canvas.dragResize'))
        : followsContent(block) || edge.length === 2 ? resizeHandle.title : ta('canvas.dragResize');
      el.appendChild(h);
      edgeHandles.push(h);
    }
  }

  // Pinning is otherwise invisible until you scroll: a pin in the corner
  // shows that the block has "Pin on scroll" enabled. On mobile only
  // screen docking applies, so the pin follows that boundary.
  if (block.sticky && (!mobile || block.sticky.mode === 'screen')) {
    const PIN_SVG = '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 17v5"/><path d="M9 3h6l-1 6 3 3v2H7v-2l3-3z"/></svg>';
    const pin = document.createElement('div');
    pin.className = 'urd-sticky-badge';
    pin.innerHTML = PIN_SVG;
    pin.title = ta('lbl.sticky');
    el.appendChild(pin);
  }

  wireDrag(moveHandle, 'move');
  wireDrag(resizeHandle, 'resize');
  for (const h of edgeHandles) wireDrag(h, 'resize', { edge: { x: h.dataset.edge.includes('w') ? -1 : h.dataset.edge.includes('e') ? 1 : 0, y: h.dataset.edge.includes('n') ? -1 : h.dataset.edge.includes('s') ? 1 : 0 } });
  // The whole block surface can also be dragged directly (⠿ remains). A
  // threshold keeps clicks as clicks; editable text and handles are
  // exempt.
  wireDrag(el, 'move', { surface: true });
  // Links/images must never start the browser's own drag behavior.
  el.addEventListener('dragstart', (event) => event.preventDefault());

  // Rotation handle (desktop only: rot lives in the desktop frame).
  // Dragged around the block's center; snaps to 15° steps, Shift gives a
  // free angle.
  if (!mobile) {
    const rotHandle = document.createElement('div');
    rotHandle.className = 'urd-edit-rotate';
    rotHandle.innerHTML = ROTATE_SVG;
    rotHandle.title = ta('canvas.dragRotate');
    el.appendChild(rotHandle);

    rotHandle.addEventListener('pointerdown', (event) => {
      event.preventDefault();
      event.stopPropagation();
      markActiveVisual(host);
      selectBlock(el, { keepMulti: multiIds.has(block.id) });
      rotHandle.setPointerCapture(event.pointerId);
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const angleAt = (ev) => (Math.atan2(ev.clientY - cy, ev.clientX - cx) * 180) / Math.PI;
      const startAngle = angleAt(event);
      const orig = block.frames.desktop.rot ?? 0;
      let rot = orig;

      const onMove = (ev) => {
        rot = orig + (angleAt(ev) - startAngle);
        rot = ev.shiftKey ? Math.round(rot) : Math.round(rot / 15) * 15;
        if (rot > 180) rot -= 360;
        if (rot < -180) rot += 360;
        el.style.transform = rot ? `rotate(${rot}deg)` : '';
        el.style.setProperty('--urd-block-rot', `${rot}deg`);
        placeToolbar();
      };
      const onUp = () => {
        rotHandle.removeEventListener('pointermove', onMove);
        rotHandle.removeEventListener('pointerup', onUp);
        if (rot === orig) return;
        const frame = { ...block.frames.desktop, rot };
        block.frames.desktop = frame;
        post({ type: 'urd-move', sectionId: section.id, blockId: block.id, frame, frameKey: 'desktop' });
      };
      rotHandle.addEventListener('pointermove', onMove);
      rotHandle.addEventListener('pointerup', onUp);
    });
  }

  /** The other units on the phone, without the dragged block: where a drag can land (phoneUnitBoxes). */
  function unitBoxes(flowEl, placed = null) {
    return phoneUnitBoxes(host, section, flowEl, block.id, placed);
  }

  /** The box that blocks stand in on the phone together (phoneBoxOf). */
  function boxOnPhone(flowEl, ids) {
    return phoneBoxOf(host, flowEl, ids);
  }

  /** The phone's eight cell columns drawn over the row grid while a block is dragged or sized there, and the mark of where it lands. */
  function phoneDragMarks(flowEl) {
    const cells = document.createElement('div');
    cells.className = 'urd-phone-cells';
    cells.setAttribute('aria-hidden', 'true');
    const land = document.createElement('div');
    land.className = 'urd-phone-land';
    land.hidden = true;
    land.setAttribute('aria-hidden', 'true');
    flowEl.append(cells, land);
    return { cells, land, remove: () => { cells.remove(); land.remove(); } };
  }

  /**
   * The block out of the row grid into free positioning at its place on the screen, a hold of its size left where it stood (its slot, where it is pinned while the page scrolls), so the grid keeps its layout while the block is dragged and the place it left reads as its own.
   * @returns {{at: {left: number, top: number, w: number, h: number}, hold: HTMLElement}}
   */
  function liftOnPhone(flowEl, handle, event) {
    const slot = el._urdStickSlot?.isConnected ? el._urdStickSlot : null;
    const from = (slot ?? el).getBoundingClientRect();
    let hold = slot;
    if (!hold) {
      const cs = getComputedStyle(el);
      hold = document.createElement('div');
      hold.className = 'urd-phone-hold';
      hold.setAttribute('aria-hidden', 'true');
      Object.assign(hold.style, {
        gridColumnStart: cs.gridColumnStart,
        gridColumnEnd: cs.gridColumnEnd,
        gridRowStart: cs.gridRowStart,
        gridRowEnd: cs.gridRowEnd,
        justifySelf: cs.justifySelf,
        width: `${from.width}px`,
        height: `${from.height}px`,
        marginTop: cs.marginTop,
        marginRight: cs.marginRight,
        marginBottom: cs.marginBottom,
        marginLeft: cs.marginLeft,
      });
      el.replaceWith(hold);
    }
    flowEl.appendChild(el);
    try {
      handle.setPointerCapture(event.pointerId);
    } catch { /* the pointer is gone: the drag ends as it would */ }
    const fr = flowEl.getBoundingClientRect();
    const at = { left: from.left - fr.left, top: from.top - fr.top, w: from.width, h: from.height };
    Object.assign(el.style, { position: 'absolute', left: `${at.left}px`, top: `${at.top}px`, width: `${at.w}px`, height: `${at.h}px`, gridColumn: '', marginLeft: '0px', marginRight: '0px', zIndex: '100001', opacity: '0.85' });
    return { at, hold };
  }

  /**
   * The section shown as a drop on the phone would leave it, while the dragged block is held over a place (flowDrag): the section drawn out of sight with the change written in (phoneChangeApplied), each block's place there measured, and the shown blocks gliding to those places by transform, the dragged block's place a dashed box; the place the block left keeps its room unmarked.
   * A change of none puts every block back where it stood; the end takes the box away, the section then drawn again from the draft.
   * A block sized in place (`lifted` false, its handles) glides to its own new size and place with the others, and has no dashed box.
   * @returns {{show: (change: object|null) => void, placed: () => Map<string, object>|null, mine: () => object|null, end: () => void}}
   */
  function phonePreview(flowEl, hold, { lifted = true } = {}) {
    const motion = !matchMedia('(prefers-reduced-motion: reduce)').matches;
    // The blocks glide to their places; a width is taken at once, so a block's place is measured at the width it will have.
    const ease = motion ? 'transform 180ms ease' : 'none';
    /** The blocks moved, each with the inline style it had, and the flow's own least height. */
    const moved = new Map();
    let flowMin = null;
    let shownKey = '';
    let landing = null;
    /** The outline round a stack the block joins. */
    let stackMark = null;
    /** A block's place in its flow as laid out, its moves by transform left out. */
    const laidOut = (node) => {
      let x = 0;
      let y = 0;
      for (let n = node; n && n !== flowEl; n = n.offsetParent) {
        x += n.offsetLeft;
        y += n.offsetTop;
      }
      return { x, y };
    };
    /** Where the preview shows each block, by id, in the flow's px; null while the section stands as it is. */
    let placed = null;
    let mine = null;
    const back = () => {
      placed = null;
      mine = null;
      for (const [node, was] of moved) {
        node.style.transition = ease;
        node.style.transform = was.transform;
        node.style.width = was.width;
        node.style.height = was.height;
        node.style.minHeight = was.minHeight;
      }
      if (flowMin !== null) Object.assign(flowEl.style, flowMin);
      landing?.remove();
      landing = null;
      stackMark?.remove();
      stackMark = null;
      hold?.classList.remove('urd-phone-hold-quiet');
    };
    const show = (change) => {
      const key = change ? JSON.stringify(change) : '';
      if (key === shownKey) return;
      shownKey = key;
      if (!change || !siteNow) {
        back();
        return;
      }
      const wrap = document.createElement('div');
      wrap.setAttribute('aria-hidden', 'true');
      wrap.inert = true;
      Object.assign(wrap.style, { position: 'absolute', left: `${host.offsetLeft}px`, top: `${host.offsetTop}px`, width: `${host.offsetWidth}px`, visibility: 'hidden', pointerEvents: 'none' });
      const ghost = document.createElement('section');
      wrap.appendChild(ghost);
      host.after(wrap);
      try {
        renderSection(phoneChangeApplied(section, change), siteNow, ghost, { viewport: 'mobile', measure: true });
        const gFlow = ghost.querySelector('.urd-flow');
        if (!gFlow) return;
        const gf = gFlow.getBoundingClientRect();
        const target = (id) => {
          const r = gFlow.querySelector(`.urd-block[data-block-id="${CSS.escape(id)}"]`)?.getBoundingClientRect();
          return r && (r.width || r.height) ? { left: r.left - gf.left, top: r.top - gf.top, width: r.width, height: r.height } : null;
        };
        // Every block takes its width first, then each is measured where the grid lays it out at those widths, its rows at their own heights, then moved there.
        if (flowMin === null) flowMin = { minHeight: flowEl.style.minHeight, alignContent: flowEl.style.alignContent };
        flowEl.style.alignContent = 'start';
        const plan = [];
        placed = new Map();
        for (const node of flowEl.querySelectorAll('.urd-block')) {
          if ((lifted && node === el) || !node.offsetParent) continue;
          const t = target(node.dataset.blockId);
          if (!t) continue;
          placed.set(node.dataset.blockId, t);
          if (!moved.has(node)) moved.set(node, { transform: node.style.transform, width: node.style.width, height: node.style.height, minHeight: node.style.minHeight, transition: node.style.transition });
          node.style.transition = ease;
          node.style.width = `${t.width}px`;
          // A block whose height the change sets stands at it, its own least height let go for the while; it is measured at its own height first, so a change that keeps the height shown keeps it.
          Object.assign(node.style, { height: moved.get(node).height, minHeight: moved.get(node).minHeight });
          if (Math.abs(t.height - node.offsetHeight) > 1) Object.assign(node.style, { height: `${t.height}px`, minHeight: '0px' });
          plan.push([node, t]);
        }
        for (const [node, t] of plan) {
          const base = laidOut(node);
          node.style.transform = `translate(${t.left - base.x}px, ${t.top - base.y}px) ${moved.get(node).transform}`.trim();
        }
        // The section keeps room for the layout shown, its rows at their own heights rather than stretched to that room.
        flowEl.style.minHeight = `${Math.max(gFlow.offsetHeight, flowEl.offsetHeight)}px`;
        mine = lifted ? target(block.id) : null;
        if (!mine) return;
        if (!landing) {
          landing = document.createElement('div');
          landing.className = 'urd-phone-landing';
          landing.setAttribute('aria-hidden', 'true');
          flowEl.appendChild(landing);
        }
        Object.assign(landing.style, { left: `${mine.left}px`, top: `${mine.top}px`, width: `${mine.width}px`, height: `${mine.height}px` });
        hold?.classList.add('urd-phone-hold-quiet');
        // A stack the block joins is outlined round its blocks and the landing, since a stack across the row looks as blocks one after another.
        const stackIds = (change.stacks ?? []).find((ids) => ids.includes(block.id));
        const parts = stackIds ? [mine, ...stackIds.filter((id) => id !== block.id).map((id) => placed.get(id)).filter(Boolean)] : [];
        if (parts.length > 1) {
          if (!stackMark) {
            stackMark = document.createElement('div');
            stackMark.className = 'urd-phone-stackmark';
            stackMark.setAttribute('aria-hidden', 'true');
            flowEl.appendChild(stackMark);
          }
          const left = Math.min(...parts.map((r) => r.left));
          const top = Math.min(...parts.map((r) => r.top));
          Object.assign(stackMark.style, { left: `${left}px`, top: `${top}px`, width: `${Math.max(...parts.map((r) => r.left + r.width)) - left}px`, height: `${Math.max(...parts.map((r) => r.top + r.height)) - top}px` });
        } else {
          stackMark?.remove();
          stackMark = null;
        }
      } finally {
        wrap.remove();
      }
    };
    return {
      show,
      /** Where the preview shows the blocks, or null while the section stands as it is. */
      placed: () => placed,
      /** Where the preview shows the dragged block, in the flow's px, or null. */
      mine: () => (mine ? { left: mine.left, top: mine.top, right: mine.left + mine.width, bottom: mine.top + mine.height } : null),
      end: () => {
        landing?.remove();
        landing = null;
        stackMark?.remove();
        stackMark = null;
        // The blocks take their own transitions back once they have glided home, so a hover's own transition is theirs again.
        setTimeout(() => {
          for (const [node, was] of moved) node.style.transition = was.transition;
        }, motion ? 200 : 0);
      },
    };
  }

  /** Whether a phone change would draw words narrower than the section's «Force readable text» lets them be (ADR-0034, phoneTooNarrow). */
  function squeezes(change) {
    if (!forcesReadable(section, 'mobile')) return false;
    const words = [...host.querySelectorAll('.urd-block[data-urd-words="1"]')].map((b) => b.dataset.blockId);
    return phoneTooNarrow(section.blocks, change, words, leastWordsCols(window.innerWidth)).length > 0;
  }

  /**
   * A flowing block lifted with the keys on the phone (Alt with an arrow): the arrows walk where it will land through the places phoneKeyDrops lists, Up and Down along the order, Left and Right beside the place's unit, and the block glides to each place in the landing's dashed outline while the others make room (phonePreview). Enter lands it as a release does, and Escape, a press anywhere or the selection leaving the block puts everything back.
   */
  function phoneCarry() {
    const flowEl = canvasOf(host).querySelector(':scope > .urd-flow');
    if (!flowEl || el._urdCarry) return el._urdCarry ?? null;
    const setup = phoneSetupOf(section);
    const { drops, home } = phoneKeyDrops(section.blocks, setup, block.id);
    if (!drops.length) return null;
    const marks = phoneDragMarks(flowEl);
    marks.land.remove();
    const view = phonePreview(flowEl, null, { lifted: false });
    el.classList.add('urd-phone-carried');
    let at = home;
    let side = null;
    let change = null;
    const changeAt = (drop) => phoneDropChange(section.blocks, setup, block.id, drop);
    const show = () => {
      const drop = side ? { pos: side, of: drops[at].of } : drops[at];
      change = changeAt(drop);
      // A place that would squeeze words under «Force readable text» greys the lifted block and lands nothing (ADR-0034).
      const blocked = Boolean(change) && squeezes(change);
      showTooNarrow(blocked ? [el] : []);
      if (blocked) change = null;
      view.show(change);
    };
    const end = () => {
      view.end();
      marks.remove();
      el.classList.remove('urd-phone-carried');
      showTooNarrow([]);
      document.removeEventListener('pointerdown', cancel, true);
      delete el._urdCarry;
    };
    const cancel = () => {
      view.show(null);
      end();
    };
    const carry = {
      /** One step: Up and Down to the next place along the order whose outcome differs, Left and Right beside the place's unit. */
      step(dir) {
        if (dir[0]) {
          side = side === (dir[0] < 0 ? 'left' : 'right') ? null : dir[0] < 0 ? 'left' : 'right';
          show();
          return;
        }
        side = null;
        const was = change ? JSON.stringify(change) : '';
        let next = at;
        do {
          next += dir[1];
          if (next < 0 || next >= drops.length) return;
        } while ((changeAt(drops[next]) ? JSON.stringify(changeAt(drops[next])) : '') === was);
        at = next;
        show();
      },
      land() {
        const done = change;
        end();
        if (done) post({ type: 'urd-phone-order', sectionId: section.id, blockId: block.id, change: done });
        else post({ type: 'urd-redraw-section', sectionId: section.id });
      },
      cancel,
    };
    el._urdCarry = carry;
    document.addEventListener('pointerdown', cancel, true);
    return carry;
  }
  el._urdLift = phoneCarry;

  /**
   * A flowing block dragged on the phone canvas (0.7.3.15): it follows the pointer over the section, the eight cell columns shown, the section showing as it goes where the block would land (the preview, the other blocks gliding to their places), and lands where phoneDropAt reads the pointer over the other units: before or after one, or the line of units it stands in, across the row, beside one in the columns free there, or above or below one in its column as a stack (phoneDropChange), the change posted as one undo step; over its own place it lands nowhere.
   * The landing place is marked as the drag goes: a line before or after a line of units, the columns it will take beside a unit, or the half of a block it goes above or below in that block's column.
   */
  function flowDrag(handle, event, opts = {}) {
    const flowEl = canvasOf(host).querySelector(':scope > .urd-flow');
    if (!flowEl) return;
    const start = { x: event.clientX, y: event.clientY };
    const threshold = opts.surface ? 4 : 0;
    let started = false;
    let at = null;
    let marks = null;
    let boxes = [];
    let hold = null;
    let drop = null;
    /** The section as the drop would leave it, shown while the block is held over a place, and the change it shows. */
    let view = null;
    let change = null;
    /** The block's own place as the drag began, in the flow's px. */
    let own = null;
    const begin = () => {
      started = true;
      const lifted = liftOnPhone(flowEl, handle, event);
      at = lifted.at;
      hold = lifted.hold;
      marks = phoneDragMarks(flowEl);
      boxes = unitBoxes(flowEl);
      const fr = flowEl.getBoundingClientRect();
      const r = hold.getBoundingClientRect();
      own = { left: r.left - fr.left, top: r.top - fr.top, right: r.right - fr.left, bottom: r.bottom - fr.top };
      view = phonePreview(flowEl, hold);
    };
    if (threshold === 0) begin();
    const showLand = () => {
      // While the section shows the drop's outcome, its dashed box says where the block lands.
      if (change) {
        marks.land.hidden = true;
        return;
      }
      const box = drop && boxes.find((b) => b.id === drop.of);
      // Beside a unit the mark stands on the columns the block will take there (phoneDropChange), level with the unit; a drop that changes nothing has none.
      const beside = box && (drop.pos === 'left' || drop.pos === 'right')
        ? phoneDropChange(section.blocks, phoneSetupOf(section), block.id, drop)?.cells?.[block.id] ?? null
        : null;
      marks.land.hidden = !box || ((drop.pos === 'left' || drop.pos === 'right') && !beside);
      if (marks.land.hidden) return;
      const fw = flowEl.clientWidth;
      const colW = (fw * 0.9) / PHONE_COLUMNS;
      const place = drop.pos === 'before' ? { kind: 'line', left: fw * 0.05, top: drop.at - 4, width: fw * 0.9, height: 3 }
        : drop.pos === 'after' ? { kind: 'line', left: fw * 0.05, top: drop.at + 1, width: fw * 0.9, height: 3 }
        : beside ? { kind: 'cell', left: fw * 0.05 + (beside.col - 1) * colW, top: box.top, width: beside.cols * colW, height: box.bottom - box.top }
        : (() => {
          // Above or below a block alone across the row: the line before or after it, its column being the row.
          if (!box.members && box.right - box.left >= fw * 0.85) {
            return { kind: 'line', left: fw * 0.05, top: drop.pos === 'above' ? box.top - 4 : box.bottom + 1, width: fw * 0.9, height: 3 };
          }
          // Above or below: the half of the block under the pointer that the dragged block takes, in the unit's columns.
          const span = box.members?.find((m) => m.id === drop.member) ?? box;
          const mid = (span.top + span.bottom) / 2;
          return drop.pos === 'above'
            ? { kind: 'cell', left: box.left, top: span.top, width: box.right - box.left, height: mid - span.top }
            : { kind: 'cell', left: box.left, top: mid, width: box.right - box.left, height: span.bottom - mid };
        })();
      marks.land.dataset.kind = place.kind;
      Object.assign(marks.land.style, { left: `${place.left}px`, top: `${place.top}px`, width: `${place.width}px`, height: `${place.height}px` });
    };
    const onMove = (ev) => {
      if (!started) {
        if (Math.abs(ev.clientX - start.x) + Math.abs(ev.clientY - start.y) < threshold) return;
        begin();
      }
      el.style.left = `${clamp(at.left + ev.clientX - start.x, 0, Math.max(0, flowEl.clientWidth - at.w))}px`;
      el.style.top = `${Math.max(0, at.top + ev.clientY - start.y)}px`;
      const fr = flowEl.getBoundingClientRect();
      // The drop is read on the units where the preview shows them, so what is seen is what is aimed at; over the box where the block will land, and the gaps the preview opens right above and below it, the result stands as it is. Any other gap is read on the units as the drag began, since the preview opens gaps of its own as the blocks make room, and a reading in one of those would move the blocks again.
      const x = ev.clientX - fr.left;
      const y = ev.clientY - fr.top;
      const within = (b) => b && x >= b.left && x <= b.right && y >= b.top && y <= b.bottom;
      const placed = view?.placed() ?? null;
      const units = placed ? unitBoxes(flowEl, placed) : boxes;
      const mine = view?.mine() ?? null;
      const near = mine && { ...mine, top: mine.top - LANDING_NEAR_PX, bottom: mine.bottom + LANDING_NEAR_PX };
      if (within(near) && !units.some(within)) drop = null;
      else {
        drop = units.some(within) ? phoneDropAt(units, x, y, null) : phoneDropAt(boxes, x, y, own);
        // Where the pointer stands across the row, in columns from its left edge, for a block placed at it (phoneDropChange), and whether Alt asks for any column.
        if (drop) Object.assign(drop, { x: (x - fr.width * 0.05) / ((fr.width * 0.9) / PHONE_COLUMNS), fine: ev.altKey });
        // Back over its own place, or nearer to it than to any block, the section stands as it is and a release moves nothing.
        change = drop ? phoneDropChange(section.blocks, phoneSetupOf(section), block.id, drop) : null;
        // A drop that would squeeze words under «Force readable text» (ADR-0034) greys the dragged block, shows no result and moves nothing.
        const blocked = Boolean(change) && squeezes(change);
        showTooNarrow(blocked ? [el] : []);
        if (blocked) {
          change = null;
          drop = null;
        }
        view?.show(change);
      }
      showLand();
    };
    const finish = () => {
      handle.removeEventListener('pointermove', onMove);
      handle.removeEventListener('pointerup', onUp);
      handle.removeEventListener('pointercancel', cancel);
      document.removeEventListener('keydown', onEscape, true);
      marks?.remove();
      showTooNarrow([]);
      view?.end();
      el.classList.remove('urd-hold-drag');
    };
    // A cancelled drag, or Escape in the middle of it, posts nothing: the section is drawn again as it stands.
    const cancel = () => {
      finish();
      if (started) post({ type: 'urd-redraw-section', sectionId: section.id });
    };
    const onEscape = (ev) => {
      if (ev.key !== 'Escape') return;
      ev.preventDefault();
      ev.stopPropagation();
      cancel();
    };
    // The release lands the block as the section shows it.
    const onUp = () => {
      finish();
      if (!started) return;
      if (change) post({ type: 'urd-phone-order', sectionId: section.id, blockId: block.id, change });
      else post({ type: 'urd-redraw-section', sectionId: section.id });
    };
    handle.addEventListener('pointermove', onMove);
    handle.addEventListener('pointerup', onUp);
    handle.addEventListener('pointercancel', cancel);
    document.addEventListener('keydown', onEscape, true);
  }

  /**
   * A press on the words of the selected block on the phone that moves drags it into the phone's order and cells (flowDrag), as a press on any other block does: the words let go of the selection the press began, and choose none while the block is dragged.
   * A click puts the caret, as the text's own; a press held still first (HOLD_TO_SELECT_MS) chooses words as it moves, as a long press does on a phone.
   */
  function moveToDrag(down) {
    const start = { x: down.clientX, y: down.clientY };
    const stop = () => {
      clearTimeout(timer);
      el.removeEventListener('pointermove', moved);
      el.removeEventListener('pointerup', stop);
      el.removeEventListener('pointercancel', stop);
    };
    const moved = (ev) => {
      if (Math.hypot(ev.clientX - start.x, ev.clientY - start.y) <= 4) return;
      stop();
      el.classList.add('urd-hold-drag');
      document.getSelection()?.removeAllRanges();
      if (document.activeElement instanceof HTMLElement && el.contains(document.activeElement)) document.activeElement.blur();
      flowDrag(el, down);
    };
    const timer = setTimeout(stop, HOLD_TO_SELECT_MS);
    el.addEventListener('pointermove', moved);
    el.addEventListener('pointerup', stop);
    el.addEventListener('pointercancel', stop);
  }

  /**
   * A flowing block's handles on the phone (ADR-0019), by the edge they are dragged by; the desktop keeps its own size.
   * The left and right edges set its width in the cells with the other edge held still, snapping to the row's quarters or to any of the eight columns with Alt; a block in a stack sizes its whole stack, which shares one cell, and a cell holding words goes no narrower than the words floor lets it stand.
   * The top and bottom edges set its own height on the phone in the row grid's steps, snapping to the bottom of a block or stack beside it on its line («Same height»), and a corner sets both, the height once the pointer has moved a step up or down. A block with words stops at its words' height, where it follows them again.
   * @param {HTMLElement} handle
   * @param {PointerEvent} event
   * @param {{x: number, y: number}} [edge] The edge dragged, -1, 0 or 1 across and down; the bottom-right corner by default
   */
  function cellResize(handle, event, edge = { x: 1, y: 1 }) {
    const flowEl = canvasOf(host).querySelector(':scope > .urd-flow');
    if (!flowEl) return;
    const own = phoneCells(block.frames.mobile);
    const stack = phoneStackOf(section.blocks, phoneSetupOf(section), block.id);
    const head = stack ? section.blocks.find((b) => b.id === stack[0]) : null;
    const cells = (head ? phoneCells(head.frames.mobile) : own) ?? { col: 1, cols: PHONE_COLUMNS };
    const end = cells.col + cells.cols - 1;
    const marks = phoneDragMarks(flowEl);
    const ids = stack ?? [block.id];
    const box = boxOnPhone(flowEl, ids) ?? { top: 0, bottom: 0 };
    // A cell holding words goes no narrower than the words floor lets it stand at this width (base.css), so the handle never shows a width the floor would not draw.
    const words = ids.some((id) => host.querySelector(`.urd-block[data-block-id="${CSS.escape(id)}"]`)?.dataset.urdWords === '1');
    const least = words && forcesReadable(section, 'mobile') ? leastWordsCols(window.innerWidth) : 1;
    /** The blocks the width sizes, greyed while the pointer pushes them past the floor. */
    const sized = ids.map((id) => host.querySelector(`.urd-block[data-block-id="${CSS.escape(id)}"]`)).filter(Boolean);
    // The block's own box and the height its words need where it has words, read as the drag begins.
    const start = { x: event.clientX, y: event.clientY };
    const flowAt = flowEl.getBoundingClientRect();
    // A block pinned while the page scrolls is measured at its slot, its place in the grid.
    const blockAt = (el._urdStickSlot?.isConnected ? el._urdStickSlot : el).getBoundingClientRect();
    const startH = blockAt.height;
    const grows = el.dataset.urdWords === '1';
    const wordsH = grows ? Math.round(contentHeight(el)) : 0;
    const before = phoneHeight(block.frames.mobile);
    /** The block's top in the flow and the blocks and stacks beside it on its line, where the preview shows them once a width has moved it, else where it stands. */
    let top = blockAt.top - flowAt.top;
    const besideOf = (placed) => unitBoxes(flowEl, placed).filter((unit) => !ids.includes(unit.id) && unit.top < top + startH && unit.bottom > top);
    let beside = besideOf(null);
    const label = document.createElement('span');
    marks.land.appendChild(label);
    let col = cells.col;
    let cols = cells.cols;
    /** The height the drag gives: undefined while it has not touched the height, null where the block follows its words again. */
    let height;
    let same = false;
    // Pulled under its words, a block with words shows the desktop's stop for as long as the pointer pulls on.
    let stopMark = null;
    if (grows && edge.y) {
      stopMark = document.createElement('div');
      stopMark.className = 'urd-edit-stop';
      stopMark.hidden = true;
      const why = document.createElement('span');
      why.textContent = ta('canvas.followsContent');
      stopMark.appendChild(why);
      el.appendChild(stopMark);
    }
    // The section shows the size as it goes: the block and the blocks around it glide to where it puts them.
    const view = phonePreview(flowEl, null, { lifted: false });
    const sizeChange = () => {
      const widthMoved = col !== cells.col || cols !== cells.cols;
      const heightMoved = height !== undefined && height !== before;
      if (!widthMoved && !heightMoved) return null;
      return {
        places: {},
        ...(widthMoved ? { cells: Object.fromEntries(ids.map((id) => [id, cols >= PHONE_COLUMNS ? null : { col, cols }])) } : {}),
        ...(heightMoved ? { heights: { [block.id]: height } } : {}),
      };
    };
    const show = () => {
      const fw = flowEl.clientWidth;
      const colW = (fw * 0.9) / PHONE_COLUMNS;
      const parts = [];
      if (edge.x) parts.push([2, 4, 6, PHONE_COLUMNS].includes(cols) ? ta(`opt.phoneWidth.${cols}`) : `${cols}/${PHONE_COLUMNS}`);
      // A block that follows its words again says so on the tag, unless the stop under it says it already.
      if (height === null && (!stopMark || stopMark.hidden)) parts.push(ta('canvas.followsContent'));
      else if (height) parts.push(same ? ta('canvas.sameHeight') : `${Math.round(height)} px`);
      label.textContent = parts.join(' · ');
      label.hidden = !parts.length;
      marks.land.hidden = false;
      marks.land.dataset.kind = 'cell';
      // A width alone marks the cell the whole stack shares; a height marks the block's own box.
      const shown = height === undefined ? null : height ?? wordsH;
      const marked = shown === null ? box : { top, bottom: top + shown };
      Object.assign(marks.land.style, { left: `${fw * 0.05 + (col - 1) * colW}px`, top: `${marked.top}px`, width: `${cols * colW}px`, height: `${marked.bottom - marked.top}px` });
    };
    try {
      handle.setPointerCapture(event.pointerId);
    } catch { /* the pointer is gone */ }
    show();
    const onMove = (ev) => {
      const fr = flowEl.getBoundingClientRect();
      const colW = (fr.width * 0.9) / PHONE_COLUMNS;
      // The edge dragged, in columns from the row's left: on the quarters' lines, or on any column's with Alt.
      const at = (ev.clientX - (fr.left + fr.width * 0.05)) / colW;
      const line = ev.altKey ? Math.round(at) : Math.round(at / 2) * 2;
      if (edge.x > 0) {
        const room = PHONE_COLUMNS - cells.col + 1;
        cols = clamp(line - (cells.col - 1), Math.min(least, room), room);
        showTooNarrow(least > 1 && line - (cells.col - 1) < least ? sized : []);
      } else if (edge.x < 0) {
        col = clamp(line + 1, 1, end - Math.min(least, end) + 1);
        cols = end - col + 1;
        showTooNarrow(least > 1 && end - line < least ? sized : []);
      }
      const dy = ev.clientY - start.y;
      const shown = view.placed()?.get(block.id);
      if (shown && Math.abs(shown.top - top) > 1) {
        top = shown.top;
        beside = besideOf(view.placed());
      }
      if (edge.y && (height !== undefined || !edge.x || Math.abs(dy) >= MOBILE_ROW)) {
        const pulled = startH + edge.y * dy;
        const snap = phoneHeightSnap(pulled, top, beside, MOBILE_ROW);
        if (grows && snap.height <= wordsH + 1) {
          height = null;
          same = false;
        } else {
          height = Math.max(grows ? wordsH : MOBILE_ROW * 3, snap.height);
          same = snap.same;
        }
        if (stopMark) stopMark.hidden = !(pulled < wordsH - STOP_MARK_PX);
      }
      show();
      view.show(sizeChange());
    };
    const finish = () => {
      handle.removeEventListener('pointermove', onMove);
      handle.removeEventListener('pointerup', onUp);
      handle.removeEventListener('pointercancel', cancel);
      document.removeEventListener('keydown', onEscape, true);
      marks.remove();
      stopMark?.remove();
      showTooNarrow([]);
      view.end();
    };
    // Escape in the middle of it, or a cancelled pointer, keeps the size as it was.
    const cancel = () => {
      view.show(null);
      finish();
    };
    const onEscape = (ev) => {
      if (ev.key !== 'Escape') return;
      ev.preventDefault();
      ev.stopPropagation();
      cancel();
    };
    const onUp = () => {
      const change = sizeChange();
      if (!change) view.show(null);
      finish();
      if (change) post({ type: 'urd-phone-order', sectionId: section.id, blockId: block.id, change });
    };
    handle.addEventListener('pointermove', onMove);
    handle.addEventListener('pointerup', onUp);
    handle.addEventListener('pointercancel', cancel);
    document.addEventListener('keydown', onEscape, true);
  }

  /**
   * The block pinned to rows of its own on the phone where it stands now, as a drag on its rows would pin it: from its row in the grid's tracks, in its cells where it stands in some (ADR-0019 decision 2), else at its width and left edge in percent.
   * A block that follows its words spans the tracks that hold it, its own line among them; any other spans its height in rows, since a pinned block is as tall as its rows.
   */
  function pinOnPhone() {
    const flowEl = canvasOf(host).querySelector(':scope > .urd-flow');
    if (!flowEl) return;
    const canvas = canvasOf(host);
    const fr = flowEl.getBoundingClientRect();
    const rect = (el._urdStickSlot?.isConnected ? el._urdStickSlot : el).getBoundingClientRect();
    const padTop = parseFloat(getComputedStyle(flowEl).paddingTop) || 0;
    const tracks = getComputedStyle(flowEl).gridTemplateRows.split(' ').map(parseFloat).filter(Number.isFinite);
    const r2 = (v) => Math.round(v * 100) / 100;
    const old = block.frames.mobile;
    const cells = phoneCells(old);
    // Its row is the track it stands in, read a pixel inside its top edge, which lies on that track's start.
    const row = rowAtOffset(tracks, rect.top - fr.top - padTop + 1);
    let rows = Math.max(1, Math.round(rect.height / MOBILE_ROW));
    if (autoGrows(block, window.Urd.blocks.get(block.type))) {
      let held = 0;
      rows = 0;
      for (let i = row - 1; held < rect.height - 1 && i < tracks.length; i += 1, rows += 1) held += tracks[i];
      if (held < rect.height - 1) rows += Math.ceil((rect.height - held) / MOBILE_ROW);
      rows = Math.max(1, rows);
    }
    const w = r2((rect.width / canvas.clientWidth) * 100);
    const placement = cells
      ? { col: cells.col, cols: cells.cols, row, rows }
      : { x: clamp(r2(((rect.left - fr.left) / canvas.clientWidth) * 100), 0, r2(100 - w)), w, row, rows };
    if (Number.isFinite(old?.z)) placement.z = old.z;
    if (old?.rot) placement.rot = old.rot;
    post({ type: 'urd-move', sectionId: section.id, blockId: block.id, frame: placement, frameKey: 'mobile' });
    // A move is written without drawing the section again, so the section is sent again from the draft: the block then stands pinned, and drags on its rows.
    post({ type: 'urd-redraw-section', sectionId: section.id });
  }

  /**
   * Mobile drag: pins ONE block to the row grid (ADR-0019). During the
   * drag the element is positioned absolutely in the flow surface, so the
   * rest of the grid reflows around it and shows the layout the block is
   * being pinned into. On release the placement is converted to row
   * tracks via the actual track heights (grown tracks are taller than
   * MOBILE_ROW), the DOM is converted in place and the editor records it
   * via urd-move with frameKey 'mobile'.
   */
  function mobileDrag(handle, event, kind, opts = {}) {
    const canvas = canvasOf(host);
    const flowEl = canvas.querySelector(':scope > .urd-flow');
    if (!flowEl) return;
    const flowRect = flowEl.getBoundingClientRect();
    const padTop = parseFloat(getComputedStyle(flowEl).paddingTop) || 0;
    // A block pinned on the phone is measured at its slot, its own place in the grid, wherever it stands pinned.
    const startRect = (el._urdStickSlot?.isConnected ? el._urdStickSlot : el).getBoundingClientRect();

    const start = { x: event.clientX, y: event.clientY };
    const orig = {
      left: startRect.left - flowRect.left,
      top: startRect.top - flowRect.top,
      w: startRect.width,
      h: startRect.height,
    };
    let current = { ...orig };
    // A surface drag only starts after a small threshold, so clicks remain clicks.
    const threshold = opts.surface ? 4 : 0;
    let started = false;
    // Every edge and corner sizes the block on its rows with the opposite edge held still (0.7.3.18).
    // A block that follows its content stands at least as tall as its content needs (ADR-0025): a pull under it is stopped at the content's edge with the same mark as on the desktop, and a pull past it gives it rows of its own.
    const edge = kind === 'resize' ? (opts.edge ?? { x: 1, y: 1 }) : { x: 0, y: 0 };
    const hug = kind === 'resize' && followsContent(block);
    const contentH = hug ? Math.round(contentHeight(el)) : 0;
    // Shift keeps the ratio of a block whose size is its frame (FIT_BY_WIDTH).
    const ratio = kind === 'resize' && FIT_BY_WIDTH.has(block.type) && orig.w > 0 ? orig.h / orig.w : 0;
    let stop = null;
    let readout = null;
    /** Whether the block was pinned on the phone, so it is drawn back over the grid from its new place once the drag ends. */
    let restick = false;
    /** The line across the flow at the row the block will be pinned into, drawn while it is moved; the tracks are read once the block is out of the grid. */
    let rowLine = null;
    let rowTracks = [];
    const rowLineTop = (row) => {
      let top = padTop;
      for (let i = 0; i < row - 1; i++) top += i < rowTracks.length ? rowTracks[i] : MOBILE_ROW;
      return top;
    };

    const begin = () => {
      started = true;
      // A block pinned on the phone comes back from over the grid (render.js stickOnPhone), and its slot leaves, so the grid shows the layout it is placed into.
      // Moving the block lets go of the pointer its handle held, so the handle takes it again.
      // A block standing in a cell with others (render.js, phoneCellCss) comes out of the cell the same way, and the section is drawn again as it lands.
      const cell = el.parentElement?.classList.contains('urd-cell') ? el.parentElement : null;
      // A block pinned in cells leaves its columns, so it moves over the whole row, and the section is drawn again as it lands.
      if (el.style.gridColumn) {
        restick = true;
        Object.assign(el.style, { gridColumn: '', marginLeft: '', marginRight: '' });
      }
      if (el._urdStickSlot || cell) {
        restick = true;
        el._urdStickSlot?.remove();
        el._urdStickSlot = null;
        flowEl.appendChild(el);
        if (cell && !cell.children.length) cell.remove();
        try {
          handle.setPointerCapture(event.pointerId);
        } catch { /* the pointer is gone: the drag ends as it would */ }
      }
      // Out of the grid and into free positioning; the grid reflows.
      el.style.position = 'absolute';
      el.style.left = `${orig.left}px`;
      el.style.top = `${orig.top}px`;
      el.style.width = `${orig.w}px`;
      if (kind === 'resize') {
        if (hug) el.style.minHeight = `${orig.h}px`;
        else el.style.height = `${orig.h}px`;
      }
      el.style.marginLeft = '0';
      el.style.zIndex = '100001';
      if (kind === 'move') {
        rowTracks = getComputedStyle(flowEl).gridTemplateRows.split(' ').map(parseFloat).filter(Number.isFinite);
        rowLine = document.createElement('div');
        rowLine.className = 'urd-row-line';
        rowLine.style.top = `${rowLineTop(rowNearOffset(rowTracks, orig.top - padTop))}px`;
        flowEl.appendChild(rowLine);
      }
      if (kind === 'resize') {
        readout = sizeReadout(el);
        if (hug) {
          stop = document.createElement('div');
          stop.className = 'urd-edit-stop';
          stop.hidden = true;
          const label = document.createElement('span');
          label.textContent = ta('canvas.followsContent');
          stop.appendChild(label);
          el.appendChild(stop);
        }
      }
    };
    if (threshold === 0) begin();

    const onMove = (ev) => {
      if (!started) {
        if (Math.abs(ev.clientX - start.x) + Math.abs(ev.clientY - start.y) < threshold) return;
        begin();
      }
      const dx = ev.clientX - start.x;
      const dy = ev.clientY - start.y;
      if (kind === 'move') {
        current = {
          ...orig,
          left: clamp(orig.left + dx, 0, Math.max(0, canvas.clientWidth - orig.w)),
          top: Math.max(0, orig.top + dy),
        };
        el.style.left = `${current.left}px`;
        el.style.top = `${current.top}px`;
        if (rowLine) rowLine.style.top = `${rowLineTop(rowNearOffset(rowTracks, current.top - padTop))}px`;
      } else {
        const w = edge.x === 0 ? orig.w : clamp(orig.w + edge.x * dx, 24, edge.x < 0 ? orig.left + orig.w : canvas.clientWidth - orig.left);
        const left = edge.x < 0 ? orig.left + orig.w - w : orig.left;
        const pulled = edge.y === 0 ? orig.h : ratio && ev.shiftKey && edge.x ? Math.round(w * ratio) : orig.h + edge.y * dy;
        const h = Math.max(MOBILE_ROW, hug ? Math.max(contentH, pulled) : pulled);
        const top = edge.y < 0 ? Math.max(0, orig.top + orig.h - h) : orig.top;
        current = { ...orig, left, top, w, h };
        Object.assign(el.style, { left: `${left}px`, top: `${top}px`, width: `${w}px` });
        if (hug) {
          el.style.minHeight = h > contentH ? `${h}px` : '';
          stop.hidden = !(edge.y && pulled < contentH - STOP_MARK_PX);
        } else {
          el.style.height = `${h}px`;
        }
        readout.show((w / canvas.clientWidth) * 100, hug ? el.getBoundingClientRect().height : h);
      }
    };

    const finish = () => {
      handle.removeEventListener('pointermove', onMove);
      handle.removeEventListener('pointerup', onUp);
      handle.removeEventListener('pointercancel', cancel);
      stop?.remove();
      readout?.remove();
      rowLine?.remove();
    };
    // A cancelled drag of a block on its rows draws the section again, which puts the block back in its place, over the grid with its slot where it is pinned while the page scrolls.
    const cancel = () => {
      finish();
      if (restick || started) post({ type: 'urd-redraw-section', sectionId: section.id });
    };

    const onUp = () => {
      finish();
      if (!started) return;

      // The row index is read against the track heights WITHOUT the block
      // (it is absolutely positioned now), which is exactly the grid it is
      // being pinned into.
      const tracks = getComputedStyle(flowEl).gridTemplateRows
        .split(' ').map(parseFloat).filter(Number.isFinite);
      const rect = el.getBoundingClientRect();
      const r2 = (v) => Math.round(v * 100) / 100;
      const wPct = r2((rect.width / canvas.clientWidth) * 100);
      const old = block.frames.mobile;
      const placement = {
        x: clamp(r2((current.left / canvas.clientWidth) * 100), 0, r2(100 - wPct)),
        w: wPct,
        row: rowNearOffset(tracks, current.top - padTop),
        rows: Math.max(1, Math.round(rect.height / MOBILE_ROW)),
      };
      if (Number.isFinite(old?.z)) placement.z = old.z;
      if (old?.rot) placement.rot = old.rot;
      block.frames.mobile = placement;

      // Convert the DOM back into the grid with the new placement.
      el.style.position = '';
      el.style.left = '';
      el.style.top = '';
      el.style.width = '';
      el.style.height = '';
      el.style.minHeight = '';
      el.style.marginLeft = '';
      el.style.zIndex = '';
      el.classList.remove('urd-block-flow');
      el.classList.add('urd-block-pinned');
      const autoGrow = autoGrows(block, window.Urd.blocks.get(block.type));
      Object.assign(el.style, mobilePlacementToCss(placement, block.frames.desktop, { autoGrow }));

      post({ type: 'urd-move', sectionId: section.id, blockId: block.id, frame: placement, frameKey: 'mobile' });
      if (restick) post({ type: 'urd-redraw-section', sectionId: section.id });
    };

    handle.addEventListener('pointermove', onMove);
    handle.addEventListener('pointerup', onUp);
    handle.addEventListener('pointercancel', cancel);
  }

  /**
   * Shared drag logic for moving and resizing. Pixels are translated to
   * grid units and rounded continuously, so the block snaps visibly while
   * dragging. On release the new frame is reported to the editor.
   */
  function wireDrag(handle, kind, opts = {}) {
    // The words the last press on the desktop began on, in a block not yet selected: released without a drag, the press writes there at once (writeAt).
    let pressedText = null;
    handle.addEventListener('pointerdown', (event) => {
      if (opts.surface) {
        // In the Clean view a press is the published page's: no block is selected or dragged, so a link, a calendar's event, a document's fold and a links row answer as they do for a visitor, and the texts are plain text (urd.js).
        if (document.body.classList.contains('urd-chrome-off')) return;
        const target = eventTarget(event);
        // Editable text is only exempt when the block is ALREADY selected (then the text is being edited).
        // An unselected block drags freely from the text too: a click without a drag selects it and writes where it was pressed (writeAt).
        // Every block's own editable text counts: the rich text block's, and the plain-text cells, numbers, quotes and events the other blocks mark with plaintext-only.
        // On the phone a press that moves on those words drags a flowing block all the same (moveToDrag), and the text keeps its click, and its words are chosen by a press held still first.
        if (target?.closest(EDITABLE_TEXT) && selectedBlockId === block.id && multiIds.size <= 1) {
          if (mobile && !Number.isFinite(block.frames.mobile?.row) && event.button === 0) moveToDrag(event);
          return;
        }
        // The cart button follows the text block's two-step model: selected
        // block = native click (the drawer opens), unselected block =
        // surface drag and selection.
        if (target?.closest('.urd-cart-button, .urd-share-button') && selectedBlockId === block.id && multiIds.size <= 1) return;
        // A product card of the selected block follows the same two steps: its click opens the product's entry in the Collections panel (blocks/product.js).
        if (!mobile && target?.closest('.urd-product-card') && selectedBlockId === block.id && multiIds.size <= 1) return;
        // An event of the selected calendar keeps its click while editing, where the card's words are rewritten.
        // The Year wheel's months are buttons drawn in SVG and follow the same two steps: a click picks the month.
        // An unselected calendar drags from its events and months too.
        const calendarPress = target?.closest('.urd-cal-event, .urd-cal-wheel-seg, .urd-cal-wheel-month');
        if (calendarPress && selectedBlockId === block.id && multiIds.size <= 1) return;
        // A document's contents are its navigation: a press on an entry jumps to its part at once, the block selected or not (the click below).
        if (target?.closest('.urd-doc-toc a, .urd-doc-fold a')) return;
        // A document's fold-outs (the privacy page's questions, the contents folded into one row) follow the same two steps: a press on the selected block's row opens it.
        const foldPress = target?.closest('.urd-doc-part > summary, .urd-doc-fold > summary');
        if (foldPress && selectedBlockId === block.id && multiIds.size <= 1) return;
        // The plugin config panels are guarded by class name, the old
        // reference plugin names included: plugin copies in user repos
        // keep them forever (see the compatibility surface in SCHEMA.md).
        if (target?.closest('.urd-edit-toolbar, .urd-edit-resize, .urd-edit-rotate, button:not(.urd-cart-button), input, select, textarea, dialog, .urd-collection-editable, .urd-collection-image-edit, .urd-faq-q, .urd-cal-config, .urd-form-config, .urd-kal-config, .urd-skjema-config, .urd-kart-config')) return;
        pressedText = !mobile && event.button === 0 && !event.shiftKey && !(multiIds.size > 1 && multiIds.has(block.id)) ? target?.closest(EDITABLE_TEXT) ?? null : null;
        event.preventDefault();
      } else {
        pressedText = null;
        event.preventDefault();
        event.stopPropagation();
        markActiveVisual(host);
        // Grabbing ⠿/resize on a set member must not collapse the set.
        selectBlock(el, { keepMulti: multiIds.has(block.id) });
      }
      handle.setPointerCapture(event.pointerId);

      // Screen-docked block: the drag moves the DOCKING, not the frame.
      // The block follows the pointer as fixed, and on release the
      // nearest of the nine anchor points is chosen from where it lands
      // (nearestDock). A regular drag would release the pinning
      // (suspendSticky) and teleport the block back to the section the
      // moment the grab started.
      if (kind === 'move' && el.classList.contains('urd-sticky-fixed') && el.dataset.stickyMode === 'screen') {
        const threshold = opts.surface ? 4 : 0;
        let started = threshold === 0;
        let holds = false;
        const hold = () => { if (!holds) { holds = true; suspendSticky({ keep: el }); } };
        const drop = () => { if (holds) { holds = false; resumeSticky(); } };
        if (started) hold();
        const start = { x: event.clientX, y: event.clientY };
        const orig = { left: parseFloat(el.style.left) || 0, top: parseFloat(el.style.top) || 0 };
        const onDockMove = (ev) => {
          if (!started) {
            if (Math.abs(ev.clientX - start.x) + Math.abs(ev.clientY - start.y) < threshold) return;
            started = true;
            hold();
          }
          el.style.left = `${orig.left + (ev.clientX - start.x)}px`;
          el.style.top = `${orig.top + (ev.clientY - start.y)}px`;
        };
        const finishDock = (commit) => {
          handle.removeEventListener('pointermove', onDockMove);
          handle.removeEventListener('pointerup', onDockUp);
          handle.removeEventListener('pointercancel', onDockCancel);
          if (commit && started) {
            const rect = el.getBoundingClientRect();
            // The same view as the pinning docks against, so a drop under the menu's band docks below it.
            const dock = nearestDock(
              { left: rect.left, top: rect.top, w: rect.width, h: rect.height },
              { w: document.documentElement.clientWidth, h: window.innerHeight, inset: dockInset() },
            );
            // The dock group comes along: applySticky reads the leader's
            // dock, and published data must say the same for every member.
            const groupId = el.dataset.stickyGroup;
            const members = groupId
              ? [...document.querySelectorAll(`.urd-sticky-able[data-sticky-group="${CSS.escape(groupId)}"]`)]
              : [el];
            for (const m of members) {
              if (m.dataset.stickyDock === dock) continue;
              m.dataset.stickyDock = dock;
              const sid = m.closest('.urd-section')?.dataset.sectionId;
              if (sid && m.dataset.blockId) {
                post({ type: 'urd-sticky-dock', sectionId: sid, blockId: m.dataset.blockId, dock });
              }
            }
            if (block.sticky) block.sticky = { ...block.sticky, dock };
          }
          // Resume last: then the group docks against the new point.
          drop();
        };
        const onDockUp = () => finishDock(true);
        const onDockCancel = () => finishDock(false);
        handle.addEventListener('pointermove', onDockMove);
        handle.addEventListener('pointerup', onDockUp);
        handle.addEventListener('pointercancel', onDockCancel);
        return;
      }

      // Mobile has its own drag mechanics (ADR-0019): a flowing block is dragged into the phone's order and cells, its handles setting its width in the cells and its height there; a block pinned to rows of its own moves and is sized on its rows.
      if (mobile) {
        if (Number.isFinite(block.frames.mobile?.row)) mobileDrag(handle, event, kind, opts);
        else if (kind === 'move') flowDrag(handle, event, opts);
        else cellResize(handle, event, opts.edge);
        return;
      }
      const frameKey = 'desktop';

      // A surface drag only starts after a small threshold, so clicks
      // (selection, caret) remain clicks.
      const threshold = opts.surface ? 4 : 0;
      let started = threshold === 0;
      // Pinned blocks are released back to their real place before the
      // drag writes geometry. A pure click (threshold not passed)
      // suspends nothing. The pair must be exact: an unmatched resume
      // would cut short the suspension of another drag in progress.
      let holdsSticky = false;
      const holdSticky = () => { if (!holdsSticky) { holdsSticky = true; suspendSticky(); suspendPush(); } };
      const dropSticky = () => { if (holdsSticky) { holdsSticky = false; resumeSticky(); resumePush(); } };
      if (started) holdSticky();

      const start = { x: event.clientX, y: event.clientY };
      let orig = { ...(block.frames[frameKey] ?? block.frames.desktop) };
      // Which edges the resize moves: the corner handle both, an edge handle one, with the opposite edge held still, so a pull on the left or top moves the block's origin as well as its size.
      const edge = kind === 'resize' ? (opts.edge ?? { x: 1, y: 1 }) : { x: 0, y: 0 };
      // A block that follows its content keeps its height under the resize
      // handle (ADR-0025): the box follows the content at the width being
      // dragged, and a pull up or down is stopped at the content's edge,
      // with a mark there for as long as the pointer is held.
      const hug = kind === 'resize' && followsContent(block);
      let stop = null;
      if (hug) {
        stop = document.createElement('div');
        stop.className = 'urd-edit-stop';
        stop.hidden = true;
        const label = document.createElement('span');
        label.textContent = ta('canvas.followsContent');
        stop.appendChild(label);
        el.appendChild(stop);
      }
      // The size readout beside the handle, and Shift keeping the ratio of a
      // block whose size is its frame (FIT_BY_WIDTH): the width drives, and
      // the height follows it in the design's px.
      const readout = kind === 'resize' ? sizeReadout(el) : null;
      const ratio = kind === 'resize' && FIT_BY_WIDTH.has(block.type) && orig.w > 0 ? orig.h / orig.w : 0;
      // Group drag: if the block is part of a multi-selection, the rest
      // follow (same delta, clamped so the whole group stays within the
      // width).
      const canvas = canvasOf(host);
      const groupParts = (kind === 'move' && multiIds.size > 1 && multiIds.has(block.id))
        ? [...canvas.querySelectorAll(':scope > .urd-block')]
            .filter((o) => o !== el && multiIds.has(o.dataset.blockId))
            .map((o) => {
              const b = section.blocks.find((x) => x.id === o.dataset.blockId);
              return b ? { el: o, block: b, orig: { ...b.frames.desktop } } : null;
            })
            .filter(Boolean)
        : [];
      const groupKey = groupParts.length ? makeId('mdrag') : null;
      // The frames under the drag are settled to the boxes the push pass
      // draws when the drag begins (settleFrames), so the block is placed by
      // the box the owner sees and the section line holds still.
      let settle = null;
      let settled = false;
      const settleOnce = () => {
        settled = true;
        settle = settleFrames(host, section, [block.id, ...groupParts.map((g) => g.block.id)]);
        if (!settle) return;
        orig = { ...block.frames.desktop };
        for (const g of groupParts) g.orig = { ...g.block.frames.desktop };
      };
      // Frames are physical (x/w in %, y/h in px); the grid controls ONLY
      // what we snap against: square cells of grid.size px. Snapping off
      // gives free placement (0.1% / 1 px precision).
      const pctPerPx = 100 / canvas.clientWidth;
      const colStep = grid.size * pctPerPx;
      const readableText = kind === 'resize' && block.type === 'text' && textDesign(block.props?.design) === 'plain' && forcesReadable(section, 'desktop');
      const r2 = (v) => Math.round(v * 100) / 100;
      const yMin = yFloor(host);
      // The grid: on this section, and under a move on every other section
      // too, since a block released wholly outside its own section moves there.
      const overlays = [showGridOverlay(host, grid, draggingGridLook())];
      if (kind === 'move') {
        for (const other of document.querySelectorAll('.urd-section')) {
          if (other !== host) overlays.push(showGridOverlay(other, other._urdGrid ?? grid, draggingGridLook()));
        }
      }
      let current = orig;

      // A block carried to the top or bottom edge of the view scrolls the
      // page under it, so a block can be moved past what is on screen. The
      // scrolled distance counts as pointer travel, so the block stays under
      // the pointer while the page moves; the pass runs once per frame while
      // the pointer rests in the edge band, and stops at the page's ends.
      const EDGE_PX = 48;
      let scrolled = 0;
      let lastEv = null;
      let edgeFrame = 0;
      const stopEdgeScroll = () => {
        if (edgeFrame) cancelAnimationFrame(edgeFrame);
        edgeFrame = 0;
      };
      const edgeScroll = () => {
        edgeFrame = 0;
        if (!lastEv) return;
        const y = lastEv.clientY;
        const h = window.innerHeight;
        const step = y < EDGE_PX ? -Math.ceil((EDGE_PX - y) / 3) : y > h - EDGE_PX ? Math.ceil((y - (h - EDGE_PX)) / 3) : 0;
        if (!step) return;
        const before = window.scrollY;
        window.scrollBy({ top: step, behavior: 'instant' });
        const moved = window.scrollY - before;
        if (!moved) return;
        scrolled += moved;
        onMove(lastEv);
      };

      // Smart guides (snap-model.js): the neighbours' edges and centres, the content surface's quarters and midline, and the gaps the neighbours keep between them, as snap lines, within a distance that follows the preview's zoom.
      // The targets come from the section the block came from and the section it is held over, measured in this canvas's px, and the lines are drawn here, where they may run into that section.
      // A line between the block and a neighbour spans the two; a line of the content surface reaches a little past the block, with its share; an equal gap is a band with its size.
      const tol = snapTolerance(getComputedStyle(document.documentElement).getPropertyValue('--urd-chrome-scale'));
      const guideEls = [];
      const clearGuides = () => {
        for (const g of guideEls) g.remove();
        guideEls.length = 0;
      };
      let targetHost = host;
      /** The section drawn as the drop target, while the block is held wholly outside its own over it. */
      let markedTarget = null;
      let targets = { xs: [], ys: [], boxes: [] };
      const collectTargets = () => {
        const xs = [];
        const ys = [];
        const boxes = [];
        const here = canvas.getBoundingClientRect();
        for (const sectionHost of new Set([host, targetHost])) {
          const c = canvasOf(sectionHost);
          const cr = c.getBoundingClientRect();
          const ox = cr.left - here.left;
          const oy = cr.top - here.top;
          const secTop = sectionHost.getBoundingClientRect().top - here.top;
          const secBottom = secTop + sectionHost.offsetHeight;
          // The surface's own lines, its midlines preferred among them (edgeSnap): centring wins where a quarter line lies as near.
          for (const share of [0.25, 0.5, 0.75]) xs.push({ at: ox + c.clientWidth * share, from: secTop, to: secBottom, surface: true, share, prefer: share === 0.5 });
          ys.push({ at: oy + c.clientHeight / 2, from: ox, to: ox + c.clientWidth, surface: true, share: 0.5, prefer: true });
          for (const other of c.querySelectorAll(':scope > .urd-block')) {
            if (other === el || groupParts.some((g) => g.el === other)) continue;
            // Measured as drawn, push shift included: the guides compare what is shown.
            const left = ox + other.offsetLeft;
            const top = oy + other.offsetTop;
            const w = other.offsetWidth;
            const h = other.offsetHeight;
            for (const at of [left, left + w / 2, left + w]) xs.push({ at, from: top, to: top + h });
            for (const at of [top, top + h / 2, top + h]) ys.push({ at, from: left, to: left + w });
            boxes.push({ left, top, right: left + w, bottom: top + h });
          }
        }
        targets = { xs, ys, boxes };
      };
      collectTargets();
      const shareText = new Intl.NumberFormat(adminLang(), { style: 'percent' });
      /** A snap line from `from` to `to`, with a dot at each end, and where it is a line of the content its share in a label past its end. */
      const drawLine = (axis, at, from, to, share) => {
        const g = document.createElement('div');
        g.className = `urd-smart-guide urd-smart-guide-${axis}`;
        if (axis === 'v') {
          g.style.left = `${at}px`;
          g.style.top = `${from}px`;
          g.style.height = `${to - from}px`;
        } else {
          g.style.top = `${at}px`;
          g.style.left = `${from}px`;
          g.style.width = `${to - from}px`;
        }
        if (share !== undefined) {
          const label = document.createElement('span');
          label.className = 'urd-smart-guide-share';
          label.textContent = shareText.format(share);
          g.appendChild(label);
        }
        canvas.appendChild(g);
        guideEls.push(g);
      };
      const drawGap = (axis, from, to, across) => {
        const g = document.createElement('div');
        g.className = `urd-smart-gap urd-smart-gap-${axis}`;
        if (axis === 'v') {
          g.style.left = `${from}px`;
          g.style.width = `${to - from}px`;
          g.style.top = `${across.from}px`;
          g.style.height = `${across.to - across.from}px`;
        } else {
          g.style.top = `${from}px`;
          g.style.height = `${to - from}px`;
          g.style.left = `${across.from}px`;
          g.style.width = `${across.to - across.from}px`;
        }
        const label = document.createElement('span');
        label.textContent = String(Math.round(to - from));
        g.appendChild(label);
        canvas.appendChild(g);
        guideEls.push(g);
      };
      /**
       * Moves current onto the nearest snap line or equal gap and draws it, with every other line the box then stands on.
       * The lines are found from where the pointer holds the block (`raw`), before the grid: a line the grid's steps never land on, such as the middle of a block whose half-width is no whole number of steps, can still be reached, and an axis with no line within reach keeps the grid's place.
       * @param {{x: number, y: number}} raw The frame's x (percent) and y (px) under the pointer, unsnapped
       */
      const applyGuides = (raw) => {
        clearGuides();
        if (kind !== 'move') return;
        const cw = canvas.clientWidth;
        const wPx = (current.w / 100) * cw;
        // The box as shown, which the lines are drawn against.
        const hPx = shownHeight(el, current.h);
        const shift = pushShiftOf(el);
        const leftPx = (raw.x / 100) * cw;
        const topPx = raw.y + shift;
        const box = { left: leftPx, top: topPx, right: leftPx + wPx, bottom: topPx + hPx };
        const besideX = targets.boxes.filter((b) => b.bottom > box.top && b.top < box.bottom).map((b) => ({ start: b.left, end: b.right }));
        const besideY = targets.boxes.filter((b) => b.right > box.left && b.left < box.right).map((b) => ({ start: b.top, end: b.bottom }));
        // A line wins over a gap on each axis.
        const ex = edgeSnap(leftPx, wPx, targets.xs, tol);
        const gx = ex ? null : gapSnap(leftPx, wPx, besideX, tol);
        const ey = edgeSnap(topPx, hPx, targets.ys, tol);
        const gy = ey ? null : gapSnap(topPx, hPx, besideY, tol);
        if (ex || gx) current = { ...current, x: clamp(r2(((leftPx + (ex?.d ?? gx.d)) * 100) / cw), 0, r2(100 - current.w)) };
        if (ey || gy) current = { ...current, y: Math.max(yMin, raw.y + (ey?.d ?? gy.d)) };
        const left = (current.x / 100) * cw;
        const top = current.y + shift;
        const snapped = { left, top, right: left + wPx, bottom: top + hPx };
        // The reach of a content line past the block, in the page's px: the chrome's 16 screen px at every zoom.
        const reach = 16 * (Number(getComputedStyle(document.documentElement).getPropertyValue('--urd-chrome-scale')) || 1);
        if (ex) for (const line of alignedLines(left, wPx, targets.xs)) {
          if (line.share !== undefined) drawLine('v', line.at, snapped.top - reach, snapped.bottom + reach, line.share);
          else drawLine('v', line.at, Math.min(snapped.top, line.from), Math.max(snapped.bottom, line.to));
        }
        if (gx) for (const gap of gx.gaps) drawGap('v', gap.from, gap.to, { from: snapped.top, to: snapped.bottom });
        if (ey) for (const line of alignedLines(top, hPx, targets.ys)) {
          if (line.share !== undefined) drawLine('h', line.at, snapped.left - reach, snapped.right + reach, line.share);
          else drawLine('h', line.at, Math.min(snapped.left, line.from), Math.max(snapped.right, line.to));
        }
        if (gy) for (const gap of gy.gaps) drawGap('h', gap.from, gap.to, { from: snapped.left, to: snapped.right });
      };

      const onMove = (ev) => {
        if (!started) {
          if (Math.abs(ev.clientX - start.x) + Math.abs(ev.clientY - start.y) < threshold) return;
          started = true;
          holdSticky();
        }
        if (!settled) settleOnce();
        // Ctrl or Cmd held = the grid and the guides off for this drag (0.1 %
        // / 1 px); otherwise grid.snap decides. Shift holds a move to one
        // axis, and on a resize of a block whose size is its frame it keeps
        // the ratio.
        const keepRatio = Boolean(ratio) && ev.shiftKey;
        const free = grid.snap === false || ev.ctrlKey || ev.metaKey;
        // A width is whole cells, and a position a line of the grid, the lines counted out from the content's middle (snap-model.js gridLine), so a block of an even number of cells can stand centred.
        const snapPct = free ? (v) => Math.round(v * 10) / 10 : (v) => r2(Math.round(v / colStep) * colStep);
        const snapX = free ? snapPct : (v) => r2(gridLine(v, colStep));
        const snapPx = free ? Math.round : (v) => Math.round(v / grid.size) * grid.size;
        let dxPx = ev.clientX - start.x;
        let dyPx = ev.clientY - start.y + (kind === 'move' ? scrolled : 0);
        if (kind === 'move') {
          lastEv = ev;
          if (!edgeFrame) edgeFrame = requestAnimationFrame(edgeScroll);
        }
        if (kind === 'move' && ev.shiftKey) ({ dx: dxPx, dy: dyPx } = lockAxis(dxPx, dyPx));
        const dx = dxPx * pctPerPx;
        const dy = dyPx;
        // The section the block is held over gives its lines too, from the
        // moment the block's centre enters it.
        if (kind === 'move') {
          const rect = el.getBoundingClientRect();
          const under = document.elementsFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2)
            .find((n) => n instanceof HTMLElement && n.classList.contains('urd-section')) ?? host;
          if (under !== targetHost) {
            targetHost = under;
            collectTargets();
          }
        }
        // The width grows with a pull outward on the edge dragged, up to the section's far edge on the right and the block's own right edge on the left, so the origin never crosses zero.
        const wMax = edge.x < 0 ? r2(orig.x + orig.w) : r2(100 - orig.x);
        // A text stops where its lines would get narrower than they read well while its section forces readable text (ADR-0034), and greys while it is pushed past; one already narrower stops where it stands.
        const wFloor = readableText ? Math.max(r2(colStep), Math.min(r2(READABLE_MIN_PX * pctPerPx), orig.w)) : r2(colStep);
        const wanted = snapPct(orig.w + edge.x * dx);
        if (readableText) showTooNarrow(edge.x !== 0 && wanted < wFloor ? [el] : [], 'desktop');
        const w = edge.x === 0 || (hug && Math.abs(ev.clientX - start.x) < STOP_MARK_PX) ? orig.w : clamp(wanted, wFloor, wMax);
        // The top edge of a block drawn at least as tall as its words stops at the words, as the drawn box does, so the block never walks down.
        const hMin = edge.y < 0 && autoGrows(block, window.Urd.blocks.get(block.type)) ? Math.max(4, Math.round(contentHeight(el))) : 4;
        const hFrom = (hv) => Math.max(hMin, hv);
        const h = edge.y === 0 || hug ? orig.h : keepRatio ? hFrom(Math.round(w * ratio)) : hFrom(snapPx(orig.h + edge.y * dy));
        // The top edge pulled: the origin follows the new height, held at the floor.
        const yTop = edge.y < 0 ? Math.max(yMin, orig.y + orig.h - h) : orig.y;
        current = kind === 'move'
          ? {
              ...orig,
              x: clamp(snapX(orig.x + dx), 0, r2(100 - orig.w)),
              // y is open downwards, and upwards too except in the first
              // section (yFloor): a block may hang above its section's top,
              // just as below the bottom.
              y: Math.max(yMin, snapPx(orig.y + dy)),
            }
          : {
              ...orig,
              x: edge.x < 0 ? r2(orig.x + orig.w - w) : orig.x,
              y: yTop,
              // A pull straight up or down on a block that follows its content
              // leaves its width as it is, unsnapped, so the release changes nothing.
              w,
              h: edge.y < 0 ? orig.y + orig.h - yTop : h,
            };
        // Free = the smart guides are off too.
        if (!free) applyGuides({ x: clamp(orig.x + dx, 0, r2(100 - orig.w)), y: Math.max(yMin, orig.y + dy) });
        else clearGuides();
        const frames = new Map([[block.id, current]]);
        if (groupParts.length) {
          // The delta is clamped against the group's combined width
          // limits; y is unbounded as in a single drag (blocks may hang
          // outside).
          const d = groupDelta([orig, ...groupParts.map((g) => g.orig)], current.x - orig.x, 0);
          const dyPx = current.y - orig.y;
          current = { ...current, x: r2(orig.x + d.dx) };
          frames.set(block.id, current);
          for (const g of groupParts) {
            const frame = { ...g.orig, x: r2(g.orig.x + d.dx), y: g.orig.y + dyPx };
            drawFrame(g.el, frame);
            frames.set(g.block.id, frame);
          }
          updateMultiToolbar();
        }
        drawFrame(el, current);
        // The section the block will move to is drawn as the drop target while
        // the block, as now drawn, is held wholly outside its own section over
        // another: the same test the release makes (ADR-0025 decision 8).
        if (kind === 'move') {
          const drawn = el.getBoundingClientRect();
          const own = host.getBoundingClientRect();
          const wholeOut = drawn.bottom <= own.top || drawn.top >= own.bottom;
          const over = wholeOut ? document.elementsFromPoint(drawn.left + drawn.width / 2, drawn.top + drawn.height / 2)
            .find((n) => n instanceof HTMLElement && n.classList.contains('urd-section')) ?? null : null;
          const dropTarget = over && over !== host ? over : null;
          if (dropTarget !== markedTarget) {
            markedTarget?.classList.remove('urd-drop-target');
            markedTarget = dropTarget;
            markedTarget?.classList.add('urd-drop-target');
          }
        }
        let grown = settle?.grown;
        if (hug) {
          // Drawn with the editor's own parts, pushing as a visitor sees it.
          const live = hugHeight(el);
          if (live) el.style.height = `${live}px`;
          const seen = live ? visitorHeights(el).natural : 0;
          grown = new Map([...(settle?.grown ?? []), [block.id, Math.max(0, (seen || current.h) - current.h)]]);
          stop.hidden = Math.abs(dy) < STOP_MARK_PX;
        }
        // The readout shows the box as drawn: the dragged height, or the
        // content's own for a block that follows it.
        readout?.show(current.w, hug ? parseFloat(el.style.height) || current.h : current.h);
        // The push as it will be after release, drawn live: the block is
        // shown where it lands, and the blocks it pushes move with it. A
        // moved block is left out of the section height; a resized one is
        // not, so content that grows under the drag raises the section now
        // as it will on release.
        pushPreview(host, frames, grown, kind === 'move' ? undefined : new Set());
      };

      // Aborted drag (the browser takes over the pointer, or the element
      // is swapped out mid-drag): clean up and release the pinning,
      // otherwise it would stay suspended for the rest of the session.
      const onCancel = () => {
        stopEdgeScroll();
        handle.removeEventListener('pointermove', onMove);
        handle.removeEventListener('pointerup', onUp);
        handle.removeEventListener('pointercancel', onCancel);
        document.removeEventListener('keydown', onEscape, true);
        for (const o of overlays) o.remove();
        clearGuides();
        markedTarget?.classList.remove('urd-drop-target');
        stop?.remove();
        readout?.remove();
        showTooNarrow([]);
        settle?.undo();
        dropSticky();
      };

      // Escape in the middle of the gesture: the blocks go back to where they stood, the push is drawn from the section as it is, and nothing is posted, so no undo step is left behind.
      const onEscape = (event) => {
        if (event.key !== 'Escape') return;
        event.preventDefault();
        event.stopPropagation();
        onCancel();
        drawFrame(el, block.frames[frameKey] ?? orig);
        for (const g of groupParts) drawFrame(g.el, g.block.frames.desktop);
        pushPreview(host, new Map());
        if (groupParts.length) updateMultiToolbar();
      };

      const onUp = () => {
        stopEdgeScroll();
        handle.removeEventListener('pointermove', onMove);
        handle.removeEventListener('pointerup', onUp);
        handle.removeEventListener('pointercancel', onCancel);
        document.removeEventListener('keydown', onEscape, true);
        for (const o of overlays) o.remove();
        clearGuides();
        markedTarget?.classList.remove('urd-drop-target');
        stop?.remove();
        readout?.remove();
        showTooNarrow([]);
        // A fit can land while a block that follows its content is dragged
        // (urd-frames writes into the same block): its height is the fit's,
        // never the one the drag began with.
        if (followsContent(block)) current = { ...current, h: block.frames.desktop.h };
        // A gesture that changes nothing leaves the frames as they were,
        // settled or not. Re-pins from the block's NEW base values.
        const unchanged = !started || (current.x === orig.x && current.y === orig.y && current.w === orig.w && current.h === orig.h);
        if (unchanged) settle?.undo();
        dropSticky();
        if (unchanged) {
          // A press on a block's words that never became a drag writes there: the block is selected by the press, and the caret stands where it was.
          if (!started && pressedText) writeAt(el, start.x, start.y, pressedText);
          return;
        }

        // Group drag: record the whole set as ONE undo step (shared
        // groupKey) and skip section transfer (the set lives in one
        // section). Each member's frame is its own as it stands now, so a
        // fit that landed during the drag is kept.
        if (groupParts.length) {
          const dx = r2(current.x - orig.x);
          const dyPx = current.y - orig.y;
          const own = [block.id, ...groupParts.map((g) => g.block.id)];
          postSettled(section, settle, own, groupKey);
          block.frames.desktop = current;
          post({ type: 'urd-move', sectionId: section.id, blockId: block.id, frame: current, frameKey: 'desktop', coalesce: true, groupKey });
          for (const g of groupParts) {
            const frame = { ...g.block.frames.desktop, x: r2(g.orig.x + dx), y: g.orig.y + dyPx };
            g.block.frames.desktop = frame;
            post({ type: 'urd-move', sectionId: section.id, blockId: g.block.id, frame, frameKey: 'desktop', coalesce: true, groupKey });
          }
          return;
        }
        // A settled drag is one undo step with the frames it settled.
        const placeKey = settle ? makeId('place') : null;

        // A block released with its whole box outside the section it came
        // from moves to the section under its centre: grid and ownership
        // follow the section it actually sits in. A block that still
        // overlaps its own section stays and lies over the neighbour, as a
        // block placed past the edge does (ADR-0025 decision 8).
        if (kind === 'move') {
          const rect = el.getBoundingClientRect();
          const own = host.getBoundingClientRect();
          const left = rect.bottom <= own.top || rect.top >= own.bottom;
          const target = left ? document
            .elementsFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2)
            .find((n) => n instanceof HTMLElement && n.classList.contains('urd-section')) : null;
          if (target && target.dataset.sectionId !== section.id) {
            // Against the target's content surface, not its outer box: block
            // y is relative to the canvas, which a menu out of the flow
            // pushes down. Carried across from the source canvas rather than
            // measured off the element, whose box is the rotated block's
            // bounding box and starts above the frame.
            const tTop = canvasOf(target).getBoundingClientRect().top;
            const sTop = canvas.getBoundingClientRect().top;
            const frame = { ...current, y: Math.max(0, Math.round(sTop + current.y - tTop)) };
            postSettled(section, settle, [block.id], placeKey);
            post({
              type: 'urd-move-block-section',
              fromSectionId: section.id,
              toSectionId: target.dataset.sectionId,
              blockId: block.id,
              frame,
              ...(placeKey ? { groupKey: placeKey } : {}),
            });
            return;
          }
        }

        block.frames[frameKey] = current;
        if (placeKey) {
          postSettled(section, settle, [block.id], placeKey);
          post({ type: 'urd-move', sectionId: section.id, blockId: block.id, frame: current, frameKey, coalesce: true, groupKey: placeKey });
        } else {
          post({ type: 'urd-move', sectionId: section.id, blockId: block.id, frame: current, frameKey });
        }
      };

      handle.addEventListener('pointermove', onMove);
      handle.addEventListener('pointerup', onUp);
      handle.addEventListener('pointercancel', onCancel);
      document.addEventListener('keydown', onEscape, true);
    });
  }
}
