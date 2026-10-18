/**
 * The help chip (ADR-0008): every block/section/element with SPECIAL features
 * has a «?» chip in the preview that opens a persistent help card explaining
 * all of them. The card stays up until you click outside or press Escape, so
 * it can be read at leisure.
 *
 * Used by core blocks AND plugins (the same rule for both):
 *   import { attachHint } from '/assets/urd/hint.js';
 *   attachHint(hostElement, { title: 'Calendar', lines: ['…', '…'] });
 *
 * Preview layer only: call it only when ctx.preview is true. Chip and card are
 * hidden in Clean view (chrome-off) and never exist for visitors.
 */

// The module is loaded dynamically in preview only, after the admin dictionary
// is loaded (the call sites await adminLocaleReady), so ta() is safe here.
import { ta } from './i18n.js';

let openCard = null;
let teardown = null;

/* Self-contained styling (the same pattern as plugin CSS): the chip is a small
   circle shown ONLY while the pointer is over the block, like the source button.
   It sits left of the rotate handle and above it in the stack, so the handle
   neither covers the chip nor takes the pointer from it, and it counter-scales
   and counter-rotates like the rest of the block chrome. */
const HINT_CSS = `
.urd-hint-chip {
  position: absolute; top: -32px; z-index: 1001;
  right: calc(18px * var(--urd-chrome-scale, 1));
  transform: rotate(calc(-1 * var(--urd-block-rot, 0deg))) scale(var(--urd-chrome-scale, 1));
  transform-origin: bottom right;
  width: 32px; height: 32px;
  display: inline-flex; align-items: center; justify-content: center;
  padding: 0; border-radius: 50%;
  /* A transparent border is an invisible bridge down to the block edge, so hover survives the trip up */
  border: 6px solid transparent;
  background: color-mix(in srgb, var(--urd-admin-accent, #5f6a75) 80%, black);
  background-clip: padding-box;
  color: #fff; font: 700 12px/1 system-ui, sans-serif; cursor: pointer;
  opacity: 0; pointer-events: none; transition: opacity 0.15s;
}
.urd-block:hover .urd-hint-chip,
.urd-hint-chip:focus-visible {
  opacity: 0.92; pointer-events: auto;
}
.urd-hint-card {
  position: fixed; z-index: 100003; width: 300px;
  /* The card is admin chrome, not part of the page being built: it keeps the
     admin's size at any preview zoom (the text toolbar's and the image
     editor's counter-scale) and takes the admin's colours, which the editor
     reports as --urd-admin-* (urd-admin-theme in urd.js). The anchor is set by
     JS in viewport coordinates, so the origin is that corner. */
  transform: scale(var(--urd-chrome-scale, 1));
  transform-origin: top left;
  padding: 12px 14px; border-radius: 10px;
  background: var(--urd-admin-surface, #151a23);
  color: var(--urd-admin-text, #e8eaf0);
  border: 1px solid color-mix(in srgb, currentColor 22%, transparent);
  box-shadow: 0 12px 36px rgb(0 0 0 / 55%);
  font: 12px/1.5 system-ui, sans-serif;
}
.urd-hint-card ul { margin: 8px 0 0; padding-left: 16px; display: grid; gap: 5px; }
body.urd-chrome-off .urd-hint-chip,
body.urd-chrome-off .urd-hint-card { display: none !important; }
`;

function injectCss() {
  if (document.getElementById('urd-hint-css')) return;
  const style = document.createElement('style');
  style.id = 'urd-hint-css';
  style.textContent = HINT_CSS;
  document.head.appendChild(style);
}

export function closeHint() {
  teardown?.();
  openCard?.remove();
  openCard = null;
  teardown = null;
}

/**
 * @param {HTMLElement} host The element the chip is added to (should have position: relative/absolute)
 * @param {{ title: string, lines: string[] }} spec Title plus one line per feature
 * @returns {HTMLButtonElement} the chip (for custom positioning when needed)
 */
export function attachHint(host, { title, lines = [] }) {
  injectCss();
  const chip = document.createElement('button');
  chip.type = 'button';
  chip.className = 'urd-hint-chip';
  chip.textContent = '?';
  chip.title = ta('hint.how', { title });

  chip.addEventListener('click', (event) => {
    event.stopPropagation();
    if (openCard) {
      closeHint();
      return;
    }
    const card = document.createElement('div');
    card.className = 'urd-hint-card';
    const head = document.createElement('strong');
    head.textContent = title;
    card.appendChild(head);
    const list = document.createElement('ul');
    for (const line of lines) {
      const item = document.createElement('li');
      item.textContent = line;
      list.appendChild(item);
    }
    card.appendChild(list);
    document.body.appendChild(card);
    openCard = card;

    const rect = chip.getBoundingClientRect();
    // The DRAWN size, which the counter-scale decides: offsetWidth and
    // offsetHeight never see a transform.
    const scale = Number.parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue('--urd-chrome-scale'),
    ) || 1;
    const w = 300 * scale;
    const h = card.offsetHeight * scale;
    card.style.left = `${Math.max(8, Math.min(rect.left, window.innerWidth - w - 8))}px`;
    // Preferably below the chip; otherwise above, always inside the viewport.
    let top = rect.bottom + 8;
    if (top + h > window.innerHeight - 8) {
      top = Math.max(8, rect.top - h - 8);
    }
    card.style.top = `${top}px`;

    const onDown = (ev) => {
      if (!card.contains(ev.target) && ev.target !== chip) closeHint();
    };
    const onKey = (ev) => {
      if (ev.key === 'Escape') closeHint();
    };
    setTimeout(() => {
      document.addEventListener('pointerdown', onDown, true);
      document.addEventListener('keydown', onKey, true);
    }, 0);
    teardown = () => {
      document.removeEventListener('pointerdown', onDown, true);
      document.removeEventListener('keydown', onKey, true);
    };
  });

  host.appendChild(chip);
  return chip;
}
