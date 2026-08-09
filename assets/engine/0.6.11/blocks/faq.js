/**
 * Kjerneblokk: FAQ-akkordeon. Bygget på det native <details name>-elementet:
 * svaret foldes ut ved klikk på spørsmålsraden (summary), nettleseren eier
 * åpen/lukket-tilstanden, tastatur- og skjermleser-semantikken, og `name` gir
 * eksklusiv utfolding (ett åpent svar av gangen) uten JS. Finn-på-siden åpner
 * automatisk et treff. Myk utfolding via ::details-content der nettleseren
 * støtter det (base.css, bak @supports); ellers folder svaret ut momentant.
 *
 * Hos besøkende åpner klikk hvor som helst på summary-raden. I editoren er
 * tekstene direkte redigerbare, så der setter klikk på spørsmålsteksten
 * skrivemerket; kun pil-ikonet folder ut.
 *
 * Åpne/lukkede svar er visningstilstand, aldri innhold: blokkens lagrede høyde
 * er alltid den sammenfoldede (autovekst via urd-grow som de andre
 * datablokkene), og utfolding vokser kun visuelt.
 */
import { stripActiveContent } from '../sanitize.js';
import { boxStyleCss } from '../box-style.js';
// Kun kallt i preview (etter at admin-ordboka er lastet): aldri på modulnivå.
import { ta, adminLocaleReady } from '../i18n.js';

/**
 * Gruppenavnet for FAQ-elementene (ren, node-testbar). Uten `multi` deler alle
 * spørsmålene i blokken ett navn, som gir native eksklusiv utfolding (ett åpent
 * svar av gangen); med `multi` er navnet tomt så flere kan stå åpne. Navnet
 * bindes til blokk-id-en så to FAQ-blokker på samme side ikke slår hverandre av.
 *
 * @param {string} blockId Blokkens id
 * @param {boolean} multi Om flere svar kan stå åpne samtidig
 * @returns {string} name-attributtet, eller '' når det ikke skal settes
 */
export function groupName(blockId, multi) {
  return multi ? '' : `urd-faq-${blockId || 'x'}`;
}

const CHEVRON = '<svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.5 6l4.5 4.5L12.5 6"/></svg>';

export const faqBlock = {
  version: 1,
  autoGrow: true,
  label: 'FAQ',
  labelKey: 'blocks.faq',
  // Seed-regelen (ADR-0012): ta() kalles kun her ved innsetting i preview.
  defaults: () => ({
    items: [
      { q: ta('seed.faq.q1'), a: ta('seed.faq.answer') },
      { q: ta('seed.faq.q2'), a: ta('seed.faq.answer') },
      { q: ta('seed.faq.q3'), a: ta('seed.faq.answer') },
    ],
    multi: false,
  }),
  migrations: {},
  /**
   * @param {HTMLElement} el
   * @param {{items: Array<{q: string, a: string}>, multi?: boolean, boxStyle?: object}} props
   * @param {object} ctx Render-kontekst
   */
  render(el, props, ctx) {
    const host = document.createElement('div');
    host.className = 'urd-faq';
    el.appendChild(host);
    const post = (msg) => window.parent?.postMessage(msg, location.origin);
    const editable = Boolean(ctx.preview) && ctx.viewport !== 'mobile';

    /** Leser gjeldende tekster ut av DOM-en og melder hele items-listen. */
    const postItems = () => {
      const items = [...host.querySelectorAll('.urd-faq-item')].map((item) => ({
        q: item.querySelector('.urd-faq-q')?.textContent ?? '',
        a: item.querySelector('.urd-faq-a .urd-text')?.innerHTML ?? '',
      }));
      post({
        type: 'urd-edit',
        sectionId: ctx.section.id,
        blockId: el.dataset.blockId,
        props: { ...props, items },
      });
    };

    /** Visuell høyde: sammenfoldet basis + de åpne svarene. Kun visning, aldri
     *  bokført i utkastet (urd-grow melder alltid den sammenfoldede). Måler
     *  svarenes egen høyde, uavhengig av utfoldingsanimasjonen. */
    const adjustHeight = () => {
      const openHeights = [...host.querySelectorAll('.urd-faq-item[open] .urd-faq-a')]
        .reduce((sum, a) => sum + a.scrollHeight, 0);
      const needed = (el._urdFaqBase ?? host.scrollHeight) + openHeights;
      el.style.height = `${needed}px`;
      const sectionEl = el.closest('.urd-section');
      if (sectionEl) {
        const bottom = el.offsetTop + needed + 24;
        const current = Number.parseFloat(sectionEl.style.minHeight) || 0;
        if (bottom > current) sectionEl.style.minHeight = `${bottom}px`;
      }
    };

    const name = groupName(el.dataset.blockId, Boolean(props.multi));

    (props.items ?? []).forEach((entry) => {
      const item = document.createElement('details');
      item.className = 'urd-faq-item urd-text-box';
      if (name) item.name = name;
      Object.assign(item.style, boxStyleCss(props.boxStyle));

      const head = document.createElement('summary');
      head.className = 'urd-faq-head';
      const q = document.createElement('span');
      q.className = 'urd-faq-q';
      q.textContent = entry.q ?? '';
      // Pil-ikonet er dekorativt: summary er selve den native veksleren, så
      // ikonet skal ikke annonseres for seg (aria-hidden).
      const chevron = document.createElement('span');
      chevron.className = 'urd-faq-toggle';
      chevron.setAttribute('aria-hidden', 'true');
      chevron.innerHTML = CHEVRON;
      // Uten stopp ville pointerdown boble til blokkens dra-/markeringslyttere
      // (den gamle knappen var dekket av «button»-unntaket i preview-edit).
      // Stopper kun bobling, ikke standardhandlingen, så native toggle (click)
      // fortsatt fyrer.
      chevron.addEventListener('pointerdown', (event) => event.stopPropagation());
      head.append(q, chevron);

      const region = document.createElement('div');
      region.className = 'urd-faq-a';
      const answer = document.createElement('div');
      answer.className = 'urd-text';
      answer.innerHTML = entry.a ?? '';
      answer.querySelectorAll('.urd-edit-toolbar, .urd-edit-resize, .urd-edit-rotate, button').forEach((n) => n.remove());
      stripActiveContent(answer);
      region.appendChild(answer);
      item.append(head, region);
      host.appendChild(item);

      // Native <details> vokser/krymper selv; vi justerer kun blokkrammens
      // VISUELLE høyde (og seksjonens minHeight) så utfoldingen ikke klippes.
      item.addEventListener('toggle', adjustHeight);

      if (editable) {
        // Klikk-og-skriv som tekstblokken: spørsmålet er ren tekst, svaret rik
        // tekst (.urd-text[contenteditable] gir formateringslinjen).
        try {
          q.contentEditable = 'plaintext-only';
        } catch {
          q.contentEditable = 'true';
        }
        answer.contentEditable = 'true';
        q.addEventListener('input', postItems);
        answer.addEventListener('input', () => {
          postItems();
          adjustHeight();
        });
        // Klikk på spørsmålsteksten skal sette skrivemerket, ikke folde ut; kun
        // pil-ikonet veksler (native toggle på summary via chevron-klikket).
        head.addEventListener('click', (event) => {
          if (!chevron.contains(event.target)) event.preventDefault();
        });
        // Mellomrom/Enter mens spørsmålet redigeres skal skrives, ikke folde ut.
        q.addEventListener('keydown', (event) => {
          if (event.key === ' ' || event.key === 'Enter') event.stopPropagation();
        });
      }
    });

    if (editable) {
      // Hjelpechipen (ADR-0008): blokken har spesialfunksjoner og forklarer seg selv.
      // adminLocaleReady: første render kan skje før ordboka er lastet i boot.
      Promise.all([import('../hint.js'), adminLocaleReady]).then(([{ attachHint }]) => {
        if (!el.isConnected || el.querySelector('.urd-hint-chip')) return;
        attachHint(el, {
          title: ta('hintFaq.title'),
          lines: [
            ta('hintFaq.l1'),
            ta('hintFaq.l2'),
            ta('hintFaq.l3'),
            ta('hintFaq.l4'),
          ],
        });
      });
    }

    // Autovekst (som samling-blokken): rammen følger den sammenfoldede høyden.
    // Alle svar er lukket ved oppstart, så host.scrollHeight = sammenfoldet.
    // KUN høyden meldes (urd-grow), aldri hele framen.
    requestAnimationFrame(() => {
      if (!el.isConnected) return;
      el._urdFaqBase = host.scrollHeight;
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
