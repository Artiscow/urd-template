/**
 * Core block: button.
 * One link (resolveLink in nav-model.js): a page in the page registry (page), a spot on it (target), or an address (href), with a new tab and rel words; page is looked up in ctx.site.pages at render time.
 */
import { resolveLink, linkAttrs } from '../nav-model.js';
import { resolveColor } from '../theme.js';

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
   * @param {{label: string, page: string|null, target?: string, href: string|null, newTab?: boolean, rel?: string[], style: string, bg?: string, color?: string, borderColor?: string, hoverBg?: string}} props
   * @param {{site: object}} ctx
   */
  render(el, props, ctx) {
    const a = document.createElement('a');
    a.className = `urd-button urd-button-${props.style}`;
    a.textContent = props.label;
    // The owner's colours over the design's, each a theme name or an own colour: the fill, the words, the outline and the fill under the pointer. One left empty follows the design and the theme.
    const own = { '--urd-btn-bg': props.bg, '--urd-btn-text': props.color, '--urd-btn-border': props.borderColor, '--urd-btn-hover': props.hoverBg };
    for (const [name, value] of Object.entries(own)) if (typeof value === 'string' && value) a.style.setProperty(name, resolveColor(value));
    if (typeof props.borderColor === 'string' && props.borderColor) a.classList.add('urd-button-own-border');
    if (typeof props.hoverBg === 'string' && props.hoverBg) a.classList.add('urd-button-own-hover');
    // An unknown page or an unsafe address (javascript:/data:) never becomes a live link for visitors.
    const link = resolveLink(props, ctx.site.pages ?? []);
    if (link.missing && (props.page || props.href)) console.warn(`Urd: the button's link goes nowhere ('${props.page || props.href}')`);
    Object.assign(a, linkAttrs(link));
    el.appendChild(a);
  },
};
