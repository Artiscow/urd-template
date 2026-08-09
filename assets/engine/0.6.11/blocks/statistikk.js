/**
 * Kjerneblokk: statistikk/nøkkeltall. Ett tall med valgfritt prefiks/suffiks
 * og etikett under; tre blokker side om side gir talltrioen fra statistikk-
 * presetet. Merverdien over rene tekstblokker er tell-opp-animasjonen ved
 * første entré (IntersectionObserver, engangs): tallet teller fra null til
 * sluttverdien med tallformatet bevart. ADR-0011-gating: uten støtte, med
 * prefers-reduced-motion, og i redigeringsmodus står tallet i SLUTTILSTAND -
 * animasjonen er ren pynt og aldri et krav.
 */
// Kun kalt i preview (etter at admin-ordboka er lastet): aldri på modulnivå.
import { ta, adminLocaleReady } from '../i18n.js';

/**
 * Tolker visningsverdien som tall (ren, node-testbar): sifrene med valgfritt
 * desimalskille (komma eller punktum), gruppert med mellomrom eller tynne
 * mellomrom («4 800», «1 234,5»). Alt annet gir null (ingen animasjon).
 * @param {string} value Visningsverdien fra props
 * @returns {{num: number, decimals: number}|null}
 */
export function parseStatValue(value) {
  const text = String(value ?? '').trim();
  if (!/^\d[\d\s  ]*([.,]\d+)?$/.test(text)) return null;
  const clean = text.replace(/[\s  ]/g, '');
  const decimals = clean.includes(',') || clean.includes('.')
    ? clean.length - Math.max(clean.indexOf(','), clean.indexOf('.')) - 1
    : 0;
  return { num: Number.parseFloat(clean.replace(',', '.')), decimals };
}

/**
 * Formaterer et tall underveis i tellingen med SAMME form som målverdien:
 * like mange desimaler, samme desimalskille og samme gruppering.
 * @param {number} n Tallet som skal vises
 * @param {string} reference Målverdien slik den står i props
 * @param {number} decimals Antall desimaler fra parseStatValue
 * @returns {string}
 */
export function formatStatValue(n, reference, decimals) {
  const ref = String(reference ?? '');
  const comma = ref.includes(',');
  // Grupperingstegnet hentes fra målverdien selv (vanlig, hardt eller smalt
  // mellomrom), så formen aldri endres underveis i tellingen.
  const group = ref.match(/\d([\s  ])\d/)?.[1] ?? null;
  let text = n.toFixed(decimals);
  if (comma) text = text.replace('.', ',');
  if (group) {
    const sep = text.includes(',') ? ',' : '.';
    const [whole, frac] = decimals ? text.split(sep) : [text, null];
    const spaced = whole.replace(/\B(?=(\d{3})+(?!\d))/g, group);
    text = frac == null ? spaced : spaced + sep + frac;
  }
  return text;
}

export const statistikkBlock = {
  version: 1,
  autoGrow: true,
  label: 'Statistikk',
  labelKey: 'blocks.statistikk',
  // Seed-regelen (ADR-0012): ta() kalles kun her ved innsetting i preview.
  defaults: () => ({
    value: '4800',
    prefix: '',
    suffix: '+',
    label: ta('seed.statistikk.label'),
    countUp: true,
  }),
  migrations: {},
  /**
   * @param {HTMLElement} el
   * @param {{value: string, prefix?: string, suffix?: string, label?: string, countUp?: boolean}} props
   * @param {object} ctx Render-kontekst
   */
  render(el, props, ctx) {
    const host = document.createElement('div');
    host.className = 'urd-statistikk';
    el.appendChild(host);
    const post = (msg) => window.parent?.postMessage(msg, location.origin);
    const editable = Boolean(ctx.preview) && ctx.viewport !== 'mobile';

    const row = document.createElement('div');
    row.className = 'urd-stat-tall';
    const prefix = document.createElement('span');
    prefix.textContent = props.prefix ?? '';
    const value = document.createElement('span');
    value.className = 'urd-stat-verdi';
    value.textContent = props.value ?? '';
    const suffix = document.createElement('span');
    suffix.textContent = props.suffix ?? '';
    row.append(prefix, value, suffix);
    const label = document.createElement('div');
    label.className = 'urd-stat-label';
    label.textContent = props.label ?? '';
    host.append(row, label);

    if (editable) {
      // Klikk-og-skriv på verdien og etiketten; prefiks/suffiks bor i panelet.
      for (const [node, key] of [[value, 'value'], [label, 'label']]) {
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
      // Hjelpechipen (ADR-0008): tell-opp er en spesialfunksjon.
      Promise.all([import('../hint.js'), adminLocaleReady]).then(([{ attachHint }]) => {
        if (!el.isConnected || el.querySelector('.urd-hint-chip')) return;
        attachHint(el, {
          title: ta('hintStatistikk.title'),
          lines: [ta('hintStatistikk.l1'), ta('hintStatistikk.l2'), ta('hintStatistikk.l3')],
        });
      });
    }

    // Tell-opp ved første entré: kun hos besøkende, kun når verdien er et
    // tall, og aldri ved redusert bevegelse - ellers står sluttilstanden.
    const parsed = parseStatValue(props.value);
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    if (props.countUp !== false && parsed && parsed.num > 0 && !editable && !reduce
      && typeof IntersectionObserver === 'function') {
      const io = new IntersectionObserver((entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        const start = performance.now();
        const duration = 1200;
        const tick = (now) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - (1 - t) ** 3;
          value.textContent = formatStatValue(parsed.num * eased, props.value, parsed.decimals);
          if (t < 1) requestAnimationFrame(tick);
          else value.textContent = props.value;
        };
        requestAnimationFrame(tick);
      }, { threshold: 0.4 });
      io.observe(host);
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
