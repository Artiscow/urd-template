/**
 * Core block: space, an empty block as tall as its frame (or its own phone height) that draws nothing for visitors.
 * In the editor it is a faint hatched box.
 * Notes: docs/engine-notes/blocks/spacer.md (Urd repository).
 */

export const spacerBlock = {
  version: 1,
  label: 'Space',
  labelKey: 'blocks.spacer',
  defaults: () => ({}),
  migrations: {},
  /**
   * @param {HTMLElement} el
   * @param {object} props
   * @param {{preview?: boolean}} ctx
   */
  render(el, props, ctx) {
    el.classList.add('urd-spacer');
    // In the editor the block holds its bar and handles, which stay reachable.
    if (!ctx?.preview) {
      el.setAttribute('aria-hidden', 'true');
      return;
    }
    // The height as the box stands, read again as it changes size.
    const size = document.createElement('span');
    size.className = 'urd-spacer-size';
    el.appendChild(size);
    const tell = () => { size.textContent = `${Math.round(el.offsetHeight)} px`; };
    if (typeof ResizeObserver === 'function') new ResizeObserver(tell).observe(el);
    else tell();
  },
};
