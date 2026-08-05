/**
 * Sticky blokker («fest ved scrolling»): DOM-delen. Tilstanden regnes av
 * den rene stickyState (sticky-model.js); her måles dokumentet og
 * modusen påføres. Festingen er JS-basert position:fixed, ikke CSS
 * sticky: sticky kan aldri stikke ut av sin egen container, og
 * until-modellen (hold festet forbi egen seksjon) krever fritt tak.
 *
 * I editorens preview er festing KUN aktiv i Ren visning
 * (body.urd-chrome-off): med chrome på ville fixed slåss med
 * dra-redigeringens frame-oppdateringer. Hos besøkende alltid aktiv.
 * Mobilvisningen er dokumentflyt og har aldri festing.
 *
 * Festing er posisjonering uten transitions, så prefers-reduced-motion
 * krever ingen særbehandling.
 */
import { stickyState } from './sticky-model.js';

/** Under navens 100002 og editor-chromen, over vanlig innhold. */
const FIXED_Z = '900';

let wired = false;
let ticking = false;

/** Kobles én gang fra boot(); scroll/resize er rAF-throttlet. */
export function initSticky() {
  if (wired) return;
  wired = true;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      applySticky();
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  applySticky();
}

/** Kalles etter re-render og ved bytte av Ren visning (urd-chrome). */
export function refreshSticky() {
  if (wired) applySticky();
}

function restore(el, base) {
  el.classList.remove('urd-sticky-fixed');
  el.style.position = '';
  el.style.left = base.left;
  el.style.width = base.width;
  el.style.top = base.top;
  el.style.zIndex = base.z;
}

function applySticky() {
  const els = document.querySelectorAll('.urd-sticky-able');
  if (!els.length) return;
  const body = document.body;
  const editing = body.classList.contains('urd-preview') && !body.classList.contains('urd-chrome-off');
  const inactive = editing || body.classList.contains('urd-mobile');
  const scrollY = window.scrollY;

  for (const el of els) {
    // Utgangsverdiene stashes FØR første modifikasjon; re-render lager
    // et ferskt element med frame-verdiene, så basen er alltid ren.
    const base = el._urdStickyBase ??= {
      y: parseFloat(el.style.top) || 0,
      top: el.style.top,
      left: el.style.left,
      width: el.style.width,
      z: el.style.zIndex,
    };
    const section = el.closest('.urd-section');
    if (inactive || !section) {
      restore(el, base);
      continue;
    }
    // En transformert seksjonsforfar ville gjort fixed relativ til seg
    // selv (containing block); da er festing meningsløs - stå stille.
    if (getComputedStyle(section).transform !== 'none') {
      restore(el, base);
      continue;
    }

    const sectionRect = section.getBoundingClientRect();
    const sectionTop = sectionRect.top + scrollY;
    let limitBottom = sectionRect.bottom + scrollY;
    const untilId = el.dataset.stickyUntil;
    if (untilId) {
      const untilEl = document.querySelector(`.urd-section[data-section-id="${CSS.escape(untilId)}"]`);
      // Slettet/ukjent until-seksjon degraderer til egen seksjons grense.
      if (untilEl) limitBottom = untilEl.getBoundingClientRect().bottom + scrollY;
    }

    const state = stickyState(scrollY, {
      sectionTop,
      blockY: base.y,
      blockH: el.offsetHeight,
      limitBottom,
      offset: Number(el.dataset.stickyOffset) || 0,
    });

    if (state.mode === 'fixed') {
      // left/width regnes fra seksjonsrekten hver frame (tåler resize);
      // rotasjon og høyde røres aldri.
      const leftPx = sectionRect.left + sectionRect.width * ((parseFloat(base.left) || 0) / 100);
      const widthPx = sectionRect.width * ((parseFloat(base.width) || 0) / 100);
      el.classList.add('urd-sticky-fixed');
      el.style.position = 'fixed';
      el.style.top = `${state.top}px`;
      el.style.left = `${leftPx}px`;
      el.style.width = `${widthPx}px`;
      el.style.zIndex = FIXED_Z;
    } else if (state.mode === 'parked') {
      restore(el, base);
      el.style.top = `${state.y}px`;
    } else {
      restore(el, base);
    }
  }
}
