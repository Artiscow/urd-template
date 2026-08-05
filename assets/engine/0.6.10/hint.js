/**
 * Hjelpechipen (ADR-0008): alle blokker/seksjoner/elementer med SPESIELLE
 * funksjoner skal ha en «?»-chip i forhåndsvisningen som åpner et vedvarende
 * hjelpekort med alle funksjonene forklart. Kortet blir stående til man
 * klikker utenfor eller trykker Escape, så det kan leses i ro.
 *
 * Brukes av kjerneblokker OG plugins (samme regel for begge):
 *   import { attachHint } from '/assets/urd/hint.js';
 *   attachHint(vertselement, { title: 'Kalender', lines: ['…', '…'] });
 *
 * Kun i preview-laget: kall den bare når ctx.preview er sann. Chip og kort
 * skjules i Ren visning (chrome-off) og hos besøkende finnes de aldri.
 */

// Modulen lastes kun dynamisk i preview, etter at admin-ordboka er lastet
// (kallstedene venter på adminLocaleReady), så ta() er trygg her.
import { ta } from './i18n.js';

let openCard = null;
let teardown = null;

/* Selvforsynt stil (samme mønster som plugin-CSS): chipen er en liten sirkel
   som KUN vises når pekeren er over blokken, akkurat som kildeknappen. */
const HINT_CSS = `
.urd-hint-chip {
  position: absolute; top: -32px; right: -6px; z-index: 5;
  width: 32px; height: 32px;
  display: inline-flex; align-items: center; justify-content: center;
  padding: 0; border-radius: 50%;
  /* Gjennomsiktig kant = usynlig bro ned til blokk-kanten, så hover overlever veien opp */
  border: 6px solid transparent;
  background: color-mix(in srgb, var(--urd-admin-accent, #5f6a75) 80%, black);
  background-clip: padding-box;
  color: #fff; font: 700 12px/1 system-ui, sans-serif; cursor: pointer;
  opacity: 0; pointer-events: none; transition: opacity 0.15s;
}
.urd-block:hover .urd-hint-chip,
.urd-hint-chip:focus-visible {
  opacity: 0.92; pointer-events: auto;
}
.urd-hint-card {
  position: fixed; z-index: 100003; width: 300px;
  padding: 12px 14px; border-radius: 10px;
  background: #151a23; color: #e8eaf0;
  border: 1px solid rgb(255 255 255 / 18%);
  box-shadow: 0 12px 36px rgb(0 0 0 / 55%);
  font: 12px/1.5 system-ui, sans-serif;
}
.urd-hint-card ul { margin: 8px 0 0; padding-left: 16px; display: grid; gap: 5px; }
body.urd-chrome-off .urd-hint-chip,
body.urd-chrome-off .urd-hint-card { display: none !important; }
`;

function injectCss() {
  if (document.getElementById('urd-hint-css')) return;
  const style = document.createElement('style');
  style.id = 'urd-hint-css';
  style.textContent = HINT_CSS;
  document.head.appendChild(style);
}

export function closeHint() {
  teardown?.();
  openCard?.remove();
  openCard = null;
  teardown = null;
}

/**
 * @param {HTMLElement} host Elementet chipen legges i (bør ha position: relative/absolute)
 * @param {{ title: string, lines: string[] }} spec Tittel + én linje per funksjon
 * @returns {HTMLButtonElement} chipen (for egen posisjonering ved behov)
 */
export function attachHint(host, { title, lines = [] }) {
  injectCss();
  const chip = document.createElement('button');
  chip.type = 'button';
  chip.className = 'urd-hint-chip';
  chip.textContent = '?';
  chip.title = ta('hint.how', { title });

  chip.addEventListener('click', (event) => {
    event.stopPropagation();
    if (openCard) {
      closeHint();
      return;
    }
    const card = document.createElement('div');
    card.className = 'urd-hint-card';
    const head = document.createElement('strong');
    head.textContent = title;
    card.appendChild(head);
    const list = document.createElement('ul');
    for (const line of lines) {
      const item = document.createElement('li');
      item.textContent = line;
      list.appendChild(item);
    }
    card.appendChild(list);
    document.body.appendChild(card);
    openCard = card;

    const rect = chip.getBoundingClientRect();
    const W = 300;
    card.style.left = `${Math.max(8, Math.min(rect.left, window.innerWidth - W - 8))}px`;
    // Helst under chipen; ellers over, alltid innenfor viewporten.
    let top = rect.bottom + 8;
    if (top + card.offsetHeight > window.innerHeight - 8) {
      top = Math.max(8, rect.top - card.offsetHeight - 8);
    }
    card.style.top = `${top}px`;

    const onDown = (ev) => {
      if (!card.contains(ev.target) && ev.target !== chip) closeHint();
    };
    const onKey = (ev) => {
      if (ev.key === 'Escape') closeHint();
    };
    setTimeout(() => {
      document.addEventListener('pointerdown', onDown, true);
      document.addEventListener('keydown', onKey, true);
    }, 0);
    teardown = () => {
      document.removeEventListener('pointerdown', onDown, true);
      document.removeEventListener('keydown', onKey, true);
    };
  });

  host.appendChild(chip);
  return chip;
}
