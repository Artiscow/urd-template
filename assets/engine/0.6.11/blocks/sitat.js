/**
 * Kjerneblokk: sitat/testimonial. Semantisk <figure>/<blockquote> med
 * attribusjon i <figcaption> - det sitat-presetet (to tekstbokser) aldri
 * kunne gi. To varianter: «stor» (sentrert oppslag med anførselsglyf) og
 * «kort» (testimonial-kort med valgfritt portrett). Anførselsglyfen tegnes
 * i CSS (::before), aldri som innhold.
 *
 * I editoren er sitatet, navnet og rollen direkte redigerbare (klikk-og-
 * skriv); portrettet velges i Egenskaper-panelet. Autovekst melder KUN
 * høyde (urd-grow), aldri hele framen.
 */
// Kun kalt i preview (etter at admin-ordboka er lastet): aldri på modulnivå.
import { ta } from '../i18n.js';
import { accentCss } from './tidslinje.js';

export const sitatBlock = {
  version: 1,
  autoGrow: true,
  label: 'Sitat',
  labelKey: 'blocks.sitat',
  // Seed-regelen (ADR-0012): ta() kalles kun her ved innsetting i preview.
  defaults: () => ({
    text: ta('seed.sitat.text'),
    attribution: ta('seed.sitat.name'),
    role: ta('seed.sitat.role'),
    variant: 'stor',
    image: '',
    accent: null,
  }),
  migrations: {},
  /**
   * @param {HTMLElement} el
   * @param {{text: string, attribution: string, role: string, variant?: string, image?: string, accent?: string|null}} props
   * @param {object} ctx Render-kontekst
   */
  render(el, props, ctx) {
    const kort = props.variant === 'kort';
    const host = document.createElement('figure');
    host.className = `urd-sitat urd-sitat-${kort ? 'kort' : 'stor'}`;
    // Aksenten (glyf og portrettring) kun som validert hex/tematoken.
    const accent = accentCss(props.accent);
    if (accent) host.style.setProperty('--urd-sitat-accent', accent);
    el.appendChild(host);
    const post = (msg) => window.parent?.postMessage(msg, location.origin);
    const editable = Boolean(ctx.preview) && ctx.viewport !== 'mobile';

    if (kort && props.image) {
      const img = document.createElement('img');
      img.className = 'urd-sitat-portrett';
      img.alt = props.attribution ?? '';
      img.loading = 'lazy';
      img.decoding = 'async';
      img.src = props.image;
      host.appendChild(img);
    }

    const body = document.createElement('div');
    body.className = 'urd-sitat-body';
    const quote = document.createElement('blockquote');
    quote.className = 'urd-sitat-text';
    quote.textContent = props.text ?? '';
    const caption = document.createElement('figcaption');
    caption.className = 'urd-sitat-caption';
    const name = document.createElement('span');
    name.className = 'urd-sitat-name';
    name.textContent = props.attribution ?? '';
    const role = document.createElement('span');
    role.className = 'urd-sitat-role';
    role.textContent = props.role ?? '';
    caption.append(name, role);
    body.append(quote, caption);
    host.appendChild(body);

    if (editable) {
      // Klikk-og-skriv: alle tre feltene er ren tekst.
      for (const [node, key] of [[quote, 'text'], [name, 'attribution'], [role, 'role']]) {
        try {
          node.contentEditable = 'plaintext-only';
        } catch {
          node.contentEditable = 'true';
        }
        node.addEventListener('input', () => {
          post({
            type: 'urd-edit',
            sectionId: ctx.section.id,
            blockId: el.dataset.blockId,
            props: { ...props, [key]: node.textContent ?? '' },
          });
        });
      }
    }

    // Autovekst: rammen følger innholdshøyden. KUN høyden meldes (urd-grow).
    requestAnimationFrame(() => {
      if (!el.isConnected) return;
      const needed = host.scrollHeight;
      if (Math.abs(needed - el.clientHeight) > 8 && ctx.viewport !== 'mobile') {
        el.style.height = `${needed}px`;
        const sectionEl = el.closest('.urd-section');
        if (sectionEl) {
          const bottom = el.offsetTop + needed + 24;
          const current = Number.parseFloat(sectionEl.style.minHeight) || 0;
          if (bottom > current) sectionEl.style.minHeight = `${bottom}px`;
        }
        if (ctx.preview) {
          const block = ctx.section?.blocks?.find((b) => b.id === el.dataset.blockId);
          if (block && block.frames.desktop.h !== needed) {
            block.frames.desktop = { ...block.frames.desktop, h: needed };
            post({ type: 'urd-grow', sectionId: ctx.section.id, blockId: el.dataset.blockId, h: needed });
          }
        }
      }
    });
  },
};
