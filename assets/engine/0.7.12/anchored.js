/**
 * The native branch for the editor's floating menus (ADR-0011): a popover in the top layer, placed against its button by CSS anchor positioning.
 */

/**
 * Whether the browser has popovers, anchor names and position-try fallbacks; without all three the menus take the JS branch.
 * @param {object} [win] The window (injectable for tests)
 * @returns {boolean}
 */
export function nativeAnchoring(win = globalThis) {
  const proto = win?.HTMLElement?.prototype;
  const css = win?.CSS;
  return !!(proto && 'popover' in proto && typeof proto.showPopover === 'function'
    && typeof css?.supports === 'function'
    && css.supports('anchor-name: --urd')
    && css.supports('position-try-fallbacks: flip-block'));
}

let seq = 0;

/**
 * A unique anchor name per menu instance.
 * @param {string} [prefix]
 * @returns {string} A dashed-ident, e.g. --urd-pop-3
 */
export function anchorName(prefix = 'urd-pop') {
  seq += 1;
  return `--${prefix}-${seq}`;
}

/**
 * Names the pane a picker stands in (a panel body or the floating block menu) the anchor --urd-pane while the picker is open.
 * @param {Element|null} el The picker's root element
 * @param {boolean} open
 */
export function namePane(el, open) {
  const pane = el?.closest?.('.panel-body, .block-menu-body');
  if (!pane) return;
  if (open) pane.style.setProperty('anchor-name', '--urd-pane');
  else pane.style.removeProperty('anchor-name');
}
