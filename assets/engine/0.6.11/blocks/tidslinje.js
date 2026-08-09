/**
 * Kjerneblokk: tidslinje. En vertikal liste av hendelser (år/tittel/tekst)
 * langs en tegnet linje med markører - ren CSS (ADR-0011), ingen JS-animasjon.
 * To varianter: «venstre» (linjen til venstre, innholdet til høyre) og
 * «veksler» (linjen i midten, kortene annenhver side; trenger blokkbredde).
 * Vertikal og breddeinvariant, så v0.7-breddegrepet ikke rører den.
 *
 * I editoren er tekstene direkte redigerbare (klikk-og-skriv som FAQ);
 * rekkefølge og antall styres fra Egenskaper-panelet. Autovekst melder KUN
 * høyde (urd-grow), aldri hele framen.
 */
// Kun kalt i preview (etter at admin-ordboka er lastet): aldri på modulnivå.
import { ta } from '../i18n.js';

const SAFE_HEX = /^#[0-9a-fA-F]{3,8}$/;
const SAFE_TOKEN = /^[a-z][a-z0-9-]*$/;

/** Fargeprop → trygg CSS-verdi: validert hex eller tematoken; ellers null. */
export function accentCss(value) {
  if (typeof value !== 'string') return null;
  if (SAFE_HEX.test(value)) return value;
  if (SAFE_TOKEN.test(value)) return `var(--urd-color-${value})`;
  return null;
}

export const tidslinjeBlock = {
  version: 1,
  autoGrow: true,
  label: 'Tidslinje',
  labelKey: 'blocks.tidslinje',
  // Seed-regelen (ADR-0012): ta() kalles kun her ved innsetting i preview.
  defaults: () => ({
    items: [
      { year: '2019', title: ta('seed.tidslinje.t1'), text: ta('seed.tidslinje.text') },
      { year: '2022', title: ta('seed.tidslinje.t2'), text: ta('seed.tidslinje.text') },
      { year: '2026', title: ta('seed.tidslinje.t3'), text: ta('seed.tidslinje.text') },
    ],
    variant: 'venstre',
    marker: 'fylt',
    accent: null,
  }),
  migrations: {},
  /**
   * @param {HTMLElement} el
   * @param {{items: Array<{year: string, title: string, text: string}>, variant?: string, marker?: string, accent?: string|null}} props
   * @param {object} ctx Render-kontekst
   */
  render(el, props, ctx) {
    const host = document.createElement('ol');
    host.className = `urd-tidslinje urd-tidslinje-${props.variant === 'veksler' ? 'veksler' : 'venstre'}`;
    if (props.marker === 'ring') host.classList.add('urd-tidslinje-ring');
    // Aksentfargen kun som validert hex/tematoken; ellers temaets aksent.
    const accent = accentCss(props.accent);
    if (accent) host.style.setProperty('--urd-tl-accent', accent);
    el.appendChild(host);
    const post = (msg) => window.parent?.postMessage(msg, location.origin);
    const editable = Boolean(ctx.preview) && ctx.viewport !== 'mobile';

    /** Leser gjeldende tekster ut av DOM-en og melder hele items-listen. */
    const postItems = () => {
      const items = [...host.querySelectorAll('.urd-tl-item')].map((item) => ({
        year: item.querySelector('.urd-tl-year')?.textContent ?? '',
        title: item.querySelector('.urd-tl-title')?.textContent ?? '',
        text: item.querySelector('.urd-tl-text')?.textContent ?? '',
      }));
      post({
        type: 'urd-edit',
        sectionId: ctx.section.id,
        blockId: el.dataset.blockId,
        props: { ...props, items },
      });
    };

    for (const entry of props.items ?? []) {
      const item = document.createElement('li');
      item.className = 'urd-tl-item';
      const fields = [
        ['urd-tl-year', entry.year],
        ['urd-tl-title', entry.title],
        ['urd-tl-text', entry.text],
      ];
      for (const [cls, value] of fields) {
        const node = document.createElement('div');
        node.className = cls;
        node.textContent = value ?? '';
        if (editable) {
          // Klikk-og-skriv: alle feltene er ren tekst (som FAQ-spørsmålet).
          try {
            node.contentEditable = 'plaintext-only';
          } catch {
            node.contentEditable = 'true';
          }
          node.addEventListener('input', postItems);
        }
        item.appendChild(node);
      }
      host.appendChild(item);
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
