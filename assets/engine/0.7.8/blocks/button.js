/**
 * Core block: button.
 * One link (resolveLink in nav-model.js): a page in the page registry (page), a spot on it (target), or an address (href), with a new tab and rel words; page is looked up in ctx.site.pages at render time.
 */
import { resolveLink, linkAttrs } from '../nav-model.js';

// Seed rule (ADR-0012): ta() is called only in defaults(), on insertion in preview, never at module level.
import { ta } from '../i18n.js';

export const buttonBlock = {
  version: 1,
  label: 'Button',
  labelKey: 'blocks.button',
  defaults: () => ({ label: ta('seed.readMore'), page: null, href: null, style: 'primary' }),
  migrations: {},
  /**
   * @param {HTMLElement} el
   * @param {{label: string, page: string|null, target?: string, href: string|null, newTab?: boolean, rel?: string[], style: string}} props
   * @param {{site: object}} ctx
   */
  render(el, props, ctx) {
    const a = document.createElement('a');
    a.className = `urd-button urd-button-${props.style}`;
    a.textContent = props.label;
    // An unknown page or an unsafe address (javascript:/data:) never becomes a live link for visitors.
    const link = resolveLink(props, ctx.site.pages ?? []);
    if (link.missing && (props.page || props.href)) console.warn(`Urd: the button's link goes nowhere ('${props.page || props.href}')`);
    Object.assign(a, linkAttrs(link));
    el.appendChild(a);
  },
};
