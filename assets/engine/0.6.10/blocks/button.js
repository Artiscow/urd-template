/**
 * Kjerneblokk: knapp. Lenker til en side i sideregisteret (page) eller
 * ekstern URL (href). page slås opp i ctx.site.pages ved render.
 */
import { isSafeHref } from '../nav-model.js';

// Seed-regelen (ADR-0012): ta() kalles kun i defaults() ved innsetting i preview, aldri på modulnivå.
import { ta } from '../i18n.js';

export const buttonBlock = {
  version: 1,
  label: 'Knapp',
  labelKey: 'blocks.button',
  defaults: () => ({ label: ta('seed.readMore'), page: null, href: null, style: 'primary' }),
  migrations: {},
  /**
   * @param {HTMLElement} el
   * @param {{label: string, page: string|null, href: string|null, style: string}} props
   * @param {{site: object}} ctx
   */
  render(el, props, ctx) {
    const a = document.createElement('a');
    a.className = `urd-button urd-button-${props.style}`;
    a.textContent = props.label;
    if (props.page) {
      const target = ctx.site.pages.find((p) => p.id === props.page);
      a.href = target ? target.path : '#';
      if (!target) console.warn(`Urd: knappen peker på ukjent side '${props.page}'`);
    } else {
      // Delt vokter (nav/footer + interne stier/anker): en utrygg href (javascript:/data:) skal aldri bli en levende lenke hos besøkende.
      a.href = isSafeHref(props.href) ? props.href : '#';
      if (props.href && !isSafeHref(props.href)) console.warn(`Urd: knappen har utrygg lenke '${props.href}'`);
    }
    el.appendChild(a);
  },
};
