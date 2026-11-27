/**
 * Theme-driven dropdown for the canvas and plugins (ADR-0009), with its own style tag.
 * Its menu is a popover where anchored.js allows, else placed by measuring.
 */
import { nativeAnchoring, anchorName } from './anchored.js';

// The caret, sized in em to follow the button's text size.
const CARET_SVG = '<svg viewBox="0 0 16 16" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.5 6l4.5 4.5L12.5 6"/></svg>';

let openMenu = null;
let teardown = null;

const DD_CSS = `
.urd-dd { position: relative; display: inline-flex; }
.urd-dd-btn {
  display: inline-flex; align-items: center; gap: 6px;
  font: 12px/1.2 system-ui, sans-serif; color: inherit;
  background: color-mix(in srgb, currentColor 6%, transparent); border: 1px solid color-mix(in srgb, currentColor 20%, transparent);
  border-radius: 5px; padding: 4px 8px; cursor: pointer; white-space: nowrap;
}
.urd-dd-btn:hover { background: color-mix(in srgb, currentColor 12%, transparent); }
.urd-dd-caret { display: inline-flex; font-size: 9px; opacity: 0.65; }
/* The menu is chrome: zoom keeps it at the admin's size at any preview zoom (--urd-chrome-scale).
   Since zoom scales its box, the anchoring and the flip below measure the size it is drawn at. */
.urd-dd-menu {
  position: fixed; z-index: 100004; min-width: 120px; max-height: 300px; overflow-y: auto;
  zoom: var(--urd-chrome-scale, 1);
  display: grid; gap: 2px; padding: 5px;
  background: var(--urd-admin-surface, #151a23); color: var(--urd-admin-text, #e8eaf0);
  border: 1px solid color-mix(in srgb, var(--urd-admin-text, #e8eaf0) 18%, transparent); border-radius: 8px;
  box-shadow: 0 12px 36px rgb(0 0 0 / 55%);
  font: 12px/1.3 system-ui, sans-serif;
}
.urd-dd-menu button {
  font: inherit; color: inherit; text-align: left; background: transparent;
  border: 0; border-radius: 5px; padding: 5px 8px; cursor: pointer; white-space: nowrap;
}
.urd-dd-menu button:hover { background: color-mix(in srgb, var(--urd-admin-text, #e8eaf0) 10%, transparent); }
.urd-dd-menu button.selected {
  background: color-mix(in srgb, var(--urd-admin-accent, #5f6a75) 18%, transparent);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--urd-admin-accent, #5f6a75) 75%, var(--urd-admin-text, #e8eaf0));
}
.urd-dd-sample { margin-left: 0.5em; opacity: 0.8; }
body.urd-chrome-off .urd-dd, body.urd-chrome-off .urd-dd-menu { display: none !important; }
@supports (anchor-name: --a) {
  .urd-dd-menu[popover] { inset: auto; margin: 6px 0 0; position-area: block-end span-inline-end; }
  .urd-dd-menu[popover]:not(:popover-open) { display: none; }
  @supports (position-try-fallbacks: flip-block) {
    .urd-dd-menu[popover] { position-try-fallbacks: flip-block, flip-inline, flip-block flip-inline; }
  }
}
`;

function injectCss() {
  if (document.getElementById('urd-dd-css')) return;
  const style = document.createElement('style');
  style.id = 'urd-dd-css';
  style.textContent = DD_CSS;
  document.head.appendChild(style);
}

export function closeDropdowns() {
  teardown?.();
  if (openMenu?.popover) openMenu.hidePopover();
  else openMenu?.remove();
  openMenu = null;
  teardown = null;
}

/**
 * A dropdown that leaves the focus where it is; an option's fourth entry is a face `{ font, sample? }` its label is drawn in.
 * @param {{ value?: string, options: Array<[string, string, unknown?, {font: string, sample?: string}?]>, onchange: (value: string) => void, title?: string }} spec
 * @returns {{ el: HTMLElement, set: (value: string) => void }}
 */
export function createDropdown({ value = null, options = [], onchange, title = '' }) {
  injectCss();
  let current = value;

  const root = document.createElement('span');
  root.className = 'urd-dd';
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'urd-dd-btn';
  if (title) btn.title = title;
  const labelEl = document.createElement('span');
  const caret = document.createElement('span');
  caret.className = 'urd-dd-caret';
  caret.innerHTML = CARET_SVG;
  btn.append(labelEl, caret);
  root.appendChild(btn);

  /** Writes an option's label into a node, in its face when it has one. */
  const drawLabel = (node, label, face) => {
    node.replaceChildren();
    if (typeof face?.font !== 'string') {
      node.textContent = label ?? '';
    } else if (face.sample) {
      const sample = document.createElement('span');
      sample.className = 'urd-dd-sample';
      sample.style.fontFamily = face.font;
      sample.setAttribute('aria-hidden', 'true');
      sample.textContent = face.sample;
      node.append(label ?? '', sample);
    } else {
      const named = document.createElement('span');
      named.style.fontFamily = face.font;
      named.textContent = label ?? '';
      node.append(named);
    }
  };
  const set = (v) => {
    current = v;
    const option = options.find(([ov]) => `${ov ?? ''}` === `${v ?? ''}`);
    drawLabel(labelEl, option?.[1] ?? '', option?.[3]);
  };
  set(value ?? options[0]?.[0]);

  // Focus stays where it is (the text selection survives the choice).
  root.addEventListener('mousedown', (event) => event.preventDefault());

  const fillMenu = (menu) => {
    menu.replaceChildren();
    for (const [v, label, , face] of options) {
      const choice = document.createElement('button');
      choice.type = 'button';
      drawLabel(choice, label, face);
      if (`${v ?? ''}` === `${current ?? ''}`) choice.classList.add('selected');
      choice.addEventListener('click', () => {
        closeDropdowns();
        set(v);
        onchange?.(v);
      });
      menu.appendChild(choice);
    }
  };

  if (nativeAnchoring()) {
    // The menu lives in the root and opens in the top layer; the toggle event fills it on every open.
    const name = anchorName('urd-dd');
    btn.style.setProperty('anchor-name', name);
    btn.setAttribute('popovertarget', name.slice(2));
    const menu = document.createElement('div');
    menu.className = 'urd-dd-menu';
    // An engine that cannot report the zoom draws the menu unscaled.
    if (!('currentCSSZoom' in menu)) menu.style.zoom = '1';
    menu.id = name.slice(2);
    menu.popover = 'auto';
    menu.style.setProperty('position-anchor', name);
    menu.addEventListener('toggle', (event) => {
      if (event.newState === 'open') {
        fillMenu(menu);
        openMenu = menu;
      } else if (openMenu === menu) {
        openMenu = null;
      }
    });
    root.appendChild(menu);
    return { el: root, set };
  }

  btn.addEventListener('click', () => {
    if (openMenu) {
      closeDropdowns();
      return;
    }
    const menu = document.createElement('div');
    menu.className = 'urd-dd-menu';
    fillMenu(menu);
    // The focus guard must cover the menu itself too (it lives in body, outside root).
    menu.addEventListener('mousedown', (event) => event.preventDefault());
    document.body.appendChild(menu);
    openMenu = menu;

    // The menu's zoom multiplies its own coordinates, so they are written in its units.
    // An engine that cannot report the zoom draws the menu unscaled.
    if (!('currentCSSZoom' in menu)) menu.style.zoom = '1';
    const zoom = menu.currentCSSZoom || 1;
    const rect = btn.getBoundingClientRect();
    const box = menu.getBoundingClientRect();
    const below = rect.bottom + 6 + box.height <= window.innerHeight - 8;
    const left = Math.max(8, Math.min(rect.left, window.innerWidth - box.width - 8));
    const top = below ? rect.bottom + 6 : Math.max(8, rect.top - box.height - 6);
    menu.style.left = `${left / zoom}px`;
    menu.style.top = `${top / zoom}px`;

    const onDown = (event) => {
      if (!menu.contains(event.target) && event.target !== btn) closeDropdowns();
    };
    const onKey = (event) => {
      if (event.key === 'Escape') closeDropdowns();
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

  return { el: root, set };
}
