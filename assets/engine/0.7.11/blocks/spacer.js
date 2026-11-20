/**
 * Core block: space (0.7.3.26.2). An empty block that makes room between two blocks of their own, as tall as its frame, and on the phone as tall as its own phone height where it has one: it draws nothing on the published page and is hidden from assistive technology there.
 * In the editor it is a faint hatched box with its height in px (base.css .urd-spacer), so it can be found, selected and resized as any other block.
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
