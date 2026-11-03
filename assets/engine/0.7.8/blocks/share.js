/**
 * Core block: a row of links with icons (type id `share`, the share buttons
 * it was until 0.7.0.52). The site's links from the Site panel, with the
 * block's own after them, each an ordinary `<a>` with the link's name, drawn
 * with the icon library's SVGs or the owner's own image. Nothing is loaded
 * from anywhere (never a vendor SDK).
 */
// Only called in preview (after the admin dictionary has loaded): never at module level.
import { ta, adminLocaleReady } from '../i18n.js';
import { blockLinks, linkIconHtml, leavesSite } from '../links-model.js';

export const shareBlock = {
  version: 2,
  // Natural height in the mobile row grid (the links wrap on narrow screens).
  autoGrow: true,
  label: 'Links',
  labelKey: 'blocks.share',
  defaults: () => ({
    useSite: true,
    hidden: [],
    links: [],
    variant: 'icons',
    size: 38,
    color: '',
  }),
  migrations: {
    // 1 -> 2: the share buttons (services for the page's address) became the
    // links row. A block that showed the site's links keeps them, one that
    // held its own list keeps that; the share services are dropped, since the
    // block no longer shares a page.
    1: ({ mode, services, source, links, ...rest }) => ({
      ...rest,
      useSite: source !== 'own',
      links: Array.isArray(links) ? links : [],
    }),
  },
  /**
   * @param {HTMLElement} el
   * @param {{useSite?: boolean, hidden?: string[], links?: object[], variant?: string, size?: number, color?: string}} props
   * @param {object} ctx Render context
   */
  render(el, props, ctx) {
    const host = document.createElement('div');
    host.className = `urd-share${props.variant === 'labels' ? ' urd-share-labels' : ''}`;
    const size = Math.min(64, Math.max(24, Number(props.size) || 38));
    host.style.setProperty('--urd-share-size', `${size}px`);
    // The colour is validated as hex or theme token; anything else gives the accent colour.
    const color = String(props.color ?? '');
    if (/^#[0-9a-fA-F]{3,8}$/.test(color)) host.style.setProperty('--urd-share-color', color);
    else if (/^[a-z][a-z0-9-]*$/.test(color)) host.style.setProperty('--urd-share-color', `var(--urd-color-${color})`);
    el.appendChild(host);
    const editable = Boolean(ctx.preview) && ctx.viewport !== 'mobile';

    const links = blockLinks(props, ctx.site);
    for (const link of links) {
      const a = document.createElement('a');
      a.className = 'urd-share-button';
      a.href = link.url;
      a.rel = 'noopener noreferrer';
      if (leavesSite(link.url)) a.target = '_blank';
      // The drawn SVG is the engine's own, and an own image has passed the
      // image guard and is quoted (linkIconHtml), so the markup is safe to set.
      a.innerHTML = `<span class="urd-share-icon">${linkIconHtml(link)}</span><span class="urd-share-name"></span>`;
      a.querySelector('.urd-share-name').textContent = link.label;
      a.title = link.label;
      a.setAttribute('aria-label', link.label);
      host.appendChild(a);
    }
    // Nothing to draw: the editor says so where the row would be; the published page shows nothing.
    if (!links.length && ctx.preview) {
      const empty = document.createElement('span');
      empty.className = 'urd-share-empty';
      empty.textContent = ta('canvas.linksEmpty');
      host.appendChild(empty);
    }

    if (editable) {
      // The help chip (ADR-0008): where the links come from, and that nothing is loaded.
      Promise.all([import('../hint.js'), adminLocaleReady]).then(([{ attachHint }]) => {
        if (!el.isConnected || el.querySelector('.urd-hint-chip')) return;
        attachHint(el, {
          title: ta('hintShare.title'),
          lines: [ta('hintShare.l1'), ta('hintShare.l2'), ta('hintShare.l3')],
        });
      });
    }
  },
};
