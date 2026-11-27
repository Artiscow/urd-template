/**
 * Sticky blocks' DOM part: measures the page and pins blocks with position:fixed, while scrolling or docked to the screen, as sticky-model.js decides.
 * Notes: docs/engine-notes/sticky.md (Urd repository).
 */
import { stickyState, groupBox, dockPosition } from './sticky-model.js';

/** Below the menu and the editor chrome, above regular content. */
const FIXED_Z = '900';

let wired = false;
let ticking = false;
// A counter, not a flag: with two simultaneous drags (two fingers) the first release must not resume pinning while the second is still going.
let suspendDepth = 0;

/** Wired once from boot(); scroll/resize is rAF-throttled. */
export function initSticky() {
  if (wired) return;
  wired = true;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      applySticky();
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  // The menu's transitionend measures again: a shrinking menu (`nav.scroll: 'shrink'`) changes height in a transition that can end after the last scroll.
  document.addEventListener('transitionend', (e) => {
    if (e.target instanceof Element && e.target.id === 'urd-nav') onScroll();
  });
  applySticky();
}

/**
 * The band screen docks keep clear of: on top a sticky top bar's clearance, else the page-wide announcement's height; a side column's width on its side.
 * @param {boolean} mobile the phone view, where the column is a bar
 * @returns {{top: number, left: number, right: number}}
 */
export function dockInset(mobile = document.body.classList.contains('urd-mobile')) {
  const rootVar = (name) => parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name)) || 0;
  const nav = document.querySelector('header#urd-nav.urd-nav-sticky');
  const side = Boolean(nav) && !mobile && nav.classList.contains('urd-nav-side-host');
  const top = nav && !side ? (rootVar('--urd-nav-h') || nav.offsetHeight) : rootVar('--urd-announce-page-h');
  const width = side ? (parseFloat(getComputedStyle(document.body).getPropertyValue('--urd-nav-side-width')) || nav.offsetWidth) : 0;
  return {
    top,
    left: side && nav.classList.contains('urd-nav-side-host-left') ? width : 0,
    right: side && nav.classList.contains('urd-nav-side-host-right') ? width : 0,
  };
}

/** Called after a re-render and when toggling clean view (urd-chrome). */
export function refreshSticky() {
  if (wired) applySticky();
}

/**
 * Editing that writes geometry is starting: releases every pinned block to its true place, except `opts.keep`, which the dock drag moves while pinned.
 */
export function suspendSticky(opts = {}) {
  if (suspendDepth++ === 0) {
    for (const el of document.querySelectorAll('.urd-sticky-able')) {
      if (el !== opts.keep) release(el);
    }
  }
}

/** Editing done: measure again from the blocks' new base values. */
export function resumeSticky() {
  suspendDepth = Math.max(0, suspendDepth - 1);
  if (suspendDepth === 0 && wired) applySticky();
}

/** The block's own inline values, as render.js set them from the frame. */
function readGeom(el) {
  return {
    y: parseFloat(el.style.top) || 0,
    top: el.style.top,
    left: el.style.left,
    width: el.style.width,
    z: el.style.zIndex,
    // The mobile row grid places with margin-left (%); a percentage margin on a fixed element would shift the docking, so it is zeroed while pinned.
    ml: el.style.marginLeft,
  };
}

function restore(el, base) {
  el.classList.remove('urd-sticky-fixed');
  el.style.position = '';
  el.style.left = base.left;
  el.style.width = base.width;
  el.style.top = base.top;
  el.style.zIndex = base.z;
  el.style.marginLeft = base.ml ?? '';
}

/**
 * Puts the block back to its own values and forgets the stash: the stash exists only while the block is pinned, and a free block is read fresh.
 */
function release(el) {
  if (!el._urdStickyBase) return;
  restore(el, el._urdStickyBase);
  delete el._urdStickyBase;
}

function applySticky() {
  // Suspended (editing is writing geometry): the blocks are already released back to their true place, and measuring here would read values mid-write.
  if (suspendDepth > 0) return;
  const els = document.querySelectorAll('.urd-sticky-able');
  if (!els.length) return;
  const body = document.body;
  // On the phone, pinning while scrolling is render.js's (stickOnPhone), and only screen docking is this module's (render.js marks screen mode alone).
  const mobile = body.classList.contains('urd-mobile');
  const scrollY = window.scrollY;
  // The block pins below a sticky menu: the menu's top band (`dockInset`) is added to the chosen offset, and stays added while a hiding menu has slid away.
  const inset = dockInset(mobile);
  const navH = inset.top;

  // Blocks with the same sticky-group are pinned as ONE unit; the rest are groups of one member each, so the whole loop below has the same shape.
  const groups = new Map();
  for (const [i, el] of els.entries()) {
    const key = el.dataset.stickyGroup || `solo-${i}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(el);
  }

  for (const members of groups.values()) {
    const lead = members[0];
    const section = lead.closest('.urd-section');
    // A section showing its phone layout on a desktop page (render.js urd-handoff) pins as the phone does.
    const phone = mobile || Boolean(section?.classList.contains('urd-handoff'));
    // A transformed section ancestor would make fixed relative to itself (containing block); pinning is then meaningless - stand still.
    const blocked = !section || getComputedStyle(section).transform !== 'none'
      || (phone && lead.dataset.stickyMode !== 'screen');
    if (blocked) {
      for (const el of members) release(el);
      continue;
    }

    // Mobile screen docking: each block docks on its own against its own measured size (the row grid has no frames to compute group geometry from).
    if (phone) {
      const view = { w: document.documentElement.clientWidth, h: window.innerHeight, inset };
      for (const el of members) {
        const base = el._urdStickyBase ?? readGeom(el);
        const w = el.offsetWidth;
        const pos = dockPosition(el.dataset.stickyDock, Number(el.dataset.stickyOffset) || 0, { w, h: el.offsetHeight }, view);
        el._urdStickyBase ??= base;
        el.classList.add('urd-sticky-fixed');
        el.style.position = 'fixed';
        el.style.marginLeft = '0';
        el.style.width = `${w}px`;
        el.style.top = `${pos.top}px`;
        el.style.left = `${pos.left}px`;
        el.style.zIndex = String(Number(FIXED_Z) + (Number(base.z) || 0));
      }
      continue;
    }

    const sectionRect = section.getBoundingClientRect();
    // Two rects on purpose (ADR-0018): a block's left and width are percentages of the content surface, while the release limit is the section's top and bottom.
    const canvasRect = (section.querySelector(':scope > .urd-canvas') ?? section).getBoundingClientRect();
    // The canvas's offset inside the section: a block's `style.top` is canvas-relative, while the pin and release limits are section-relative.
    const canvasTop = canvasRect.top - sectionRect.top;
    // Geometry is read from the stash while the block is pinned (the inline values are then overwritten), otherwise fresh from the element.
    const geoms = new Map(members.map((el) => [el, el._urdStickyBase ?? readGeom(el)]));
    // The members' boxes in px for both modes: left and width are computed from the canvas rect every time, and rotation and height are never touched.
    const boxes = members.map((el) => ({
      el,
      x: canvasRect.left - sectionRect.left + canvasRect.width * ((parseFloat(geoms.get(el).left) || 0) / 100),
      y: geoms.get(el).y,
      w: canvasRect.width * ((parseFloat(geoms.get(el).width) || 0) / 100),
      h: el.offsetHeight,
    }));
    const box = groupBox(boxes);

    const place = (el, left, top) => {
      // Stashed only when the block actually pins: then the inline values are overwritten, and the originals must be remembered until release.
      el._urdStickyBase ??= geoms.get(el);
      el.classList.add('urd-sticky-fixed');
      el.style.position = 'fixed';
      el.style.top = `${top}px`;
      el.style.left = `${left}px`;
      // The group's internal stacking order must survive pinning, so the block's own z is added on top of the floor instead of being replaced by it.
      el.style.zIndex = String(Number(FIXED_Z) + (Number(geoms.get(el).z) || 0));
    };

    // Pin to screen: the group docks at a fixed point in the window and stays there regardless of scrolling.
    // The release limit does not apply here.
    if (lead.dataset.stickyMode === 'screen') {
      const view = { w: document.documentElement.clientWidth, h: window.innerHeight, inset };
      const pos = dockPosition(lead.dataset.stickyDock, Number(lead.dataset.stickyOffset) || 0, box, view);
      for (const b of boxes) {
        b.el.style.width = `${b.w}px`;
        place(b.el, pos.left + (b.x - box.x), pos.top + (b.y - box.y));
      }
      continue;
    }

    const sectionTop = sectionRect.top + scrollY;
    let limitBottom = sectionRect.bottom + scrollY;
    const untilId = lead.dataset.stickyUntil;
    if (untilId) {
      const untilEl = document.querySelector(`.urd-section[data-section-id="${CSS.escape(untilId)}"]`);
      // A deleted/unknown until section degrades to the block's own section limit.
      if (untilEl) limitBottom = untilEl.getBoundingClientRect().bottom + scrollY;
    }

    // The group is measured as one block: it pins when the top of the box reaches the offset, and the members keep their place inside the box.
    const state = stickyState(scrollY, {
      sectionTop,
      blockY: box.y + canvasTop,
      blockH: box.h,
      limitBottom,
      offset: (Number(lead.dataset.stickyOffset) || 0) + navH,
    });

    for (const b of boxes) {
      if (state.mode === 'fixed') {
        b.el.style.width = `${b.w}px`;
        place(b.el, sectionRect.left + b.x, state.top + (b.y - box.y));
      } else if (state.mode === 'parked') {
        // Parking overwrites `top`, so the stash stays as the block's own place; `state.y` is section-relative, `style.top` canvas-relative.
        b.el._urdStickyBase ??= geoms.get(b.el);
        restore(b.el, b.el._urdStickyBase);
        b.el.style.top = `${state.y - canvasTop + (b.y - box.y)}px`;
        // Parked beyond its own section (a later release section), the block keeps the pinned stacking, so it is not painted behind the blocks below.
        if (state.y + box.h > sectionRect.height) {
          b.el.style.zIndex = String(Number(FIXED_Z) + (Number(geoms.get(b.el).z) || 0));
        }
      } else {
        release(b.el);
      }
    }
  }
}
