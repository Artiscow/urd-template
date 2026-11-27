/**
 * The editor's stand-in for a blended picture (blocks/image.js `blend`): while the editing tools show, a copy under the block blends in its place.
 */
import { BLOCK_CHROME } from './render.js';

/** The blocks that blend, in the editor and on the page alike. */
const BLENDED = '.urd-block.urd-image-blend';

/** Each blended block's stand-in, with what it was last drawn from. */
const ghosts = new Map();
/** The blocks whose picture changed since their stand-in was drawn. */
const changed = new Set();
let watching = false;
let queued = false;

/** Whether a node is one of a block's editing tools, or stands inside one. */
const inChrome = (node, block) => {
  for (let n = node; n && n !== block; n = n.parentElement) if (n.matches?.(BLOCK_CHROME)) return true;
  return false;
};

/** Draws the stand-ins again at the next frame, once for any number of changes. */
function queue() {
  if (queued) return;
  queued = true;
  requestAnimationFrame(() => {
    queued = false;
    sync();
  });
}

/** Takes a block's stand-in away and lets the block draw its own picture and blend. */
function release(block) {
  ghosts.get(block)?.node.remove();
  ghosts.delete(block);
  changed.delete(block);
  block.classList.remove('urd-blend-ghosted');
}

/**
 * Gives every blended block its stand-in in its place and takes away the others' stand-ins.
 * It writes only what differs.
 */
function sync() {
  const on = !document.body.classList.contains('urd-chrome-off');
  const blocks = on ? [...document.querySelectorAll(BLENDED)] : [];
  for (const block of [...ghosts.keys()]) if (!blocks.includes(block)) release(block);
  for (const block of blocks) {
    let ghost = ghosts.get(block);
    if (!ghost) {
      const node = document.createElement('div');
      node.className = 'urd-blend-ghost';
      node.setAttribute('aria-hidden', 'true');
      // A copied link or field is never reached with the keys or the pointer.
      node.inert = true;
      ghost = { node, css: '' };
      ghosts.set(block, ghost);
      changed.add(block);
    }
    if (ghost.node.nextElementSibling !== block) block.before(ghost.node);
    if (!block.classList.contains('urd-blend-ghosted')) block.classList.add('urd-blend-ghosted');
    // The block's own box, layer, turn, blend and strength: the same on the desktop canvas, where the block is placed, and on the phone, where it flows.
    const css = `left:${block.offsetLeft}px;top:${block.offsetTop}px;width:${block.offsetWidth}px;height:${block.offsetHeight}px;`
      + `z-index:${getComputedStyle(block).zIndex};transform:${block.style.transform || 'none'};mix-blend-mode:${block.style.getPropertyValue('--urd-blend') || 'normal'};opacity:${block.style.getPropertyValue('--urd-blend-strength') || '1'};`;
    if (ghost.css !== css) {
      ghost.css = css;
      ghost.node.style.cssText = css;
    }
    if (changed.delete(block)) {
      const copies = [...block.children].filter((child) => !child.matches(BLOCK_CHROME)).map((child) => child.cloneNode(true));
      ghost.node.replaceChildren(...copies);
      // A picture still loading is hidden until it is whole (blocks/image.js); the copy has no such wait.
      for (const img of ghost.node.querySelectorAll('img')) img.style.visibility = '';
    }
  }
}

/**
 * Starts the stand-ins once: they follow every change to the page, the clean view and the window's size.
 */
export function watchBlends() {
  if (watching || typeof MutationObserver !== 'function') return;
  watching = true;
  new MutationObserver((records) => {
    let ours = true;
    for (const record of records) {
      const target = record.target.nodeType === 1 ? record.target : record.target.parentElement;
      // The stand-ins' own changes, and the guide lines drawn on every move of a drag, call for no other round.
      if (target?.closest('.urd-blend-ghost, .urd-guide-layer')) continue;
      ours = false;
      const block = target?.closest(BLENDED);
      // The block's picture changed when its content did: its own style and class only move it, and its tools are not its picture.
      if (block && !(record.type === 'attributes' && target === block) && !inChrome(target, block)) changed.add(block);
    }
    if (!ours) queue();
  }).observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ['class', 'style', 'src', 'alt'] });
  window.addEventListener('resize', queue);
  queue();
}
