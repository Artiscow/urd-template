/**
 * Render-løkka: side → seksjoner → bakgrunnslag + blokker.
 *
 * All data løftes via migrate.lift() før rendering. Ukjente typer og
 * render-feil gir nøytrale plassholdere (blokker) eller hoppes over
 * (bakgrunnslag er dekorative) - siden krasjer aldri av dårlig data.
 *
 * To viewporter (opts.viewport):
 *  - 'desktop': absolutt posisjonering fra frames.desktop.
 *  - 'mobile' med responsive.mobile.mode 'auto': blokkene rendres som
 *    vanlig dokumentflyt i én kolonne, sortert i leserekkefølge
 *    (stackOrder); dekor-blokker utelates. Tekst får naturlig høyde.
 *  - 'mobile' med mode 'manual': absolutt fra frames.mobile (en null
 *    der faller tilbake til desktop-framen), og seksjonshøyden beregnes
 *    fra nederste mobil-frame.
 */
import { lift } from './migrate.js';
import { applyAnimation } from './animations/core.js';
import { applySectionTheme } from './theme.js';
import { refreshSticky } from './sticky.js';
import { t } from './i18n.js';

/**
 * Tegner bakgrunnslagene (color/gradient/glow/grain/image/bildegalleri) inn i
 * host som `div.urd-bg-layer`-elementer, nedenfra og opp. Delt av seksjoner
 * (render.js), nav (nav.js) og footer (footer.js) - samme lagmodell overalt.
 * Hvert lag løftes via lift() før render; ukjente typer og render-feil hoppes
 * over med en advarsel (bakgrunner er dekorative, de velter aldri siden).
 * @param {HTMLElement} host Elementet lagene bygges inn i
 * @param {{layers?: Array<{type: string, version?: number, props?: object}>}} [background]
 */
export function renderBackgroundLayers(host, background) {
  const Urd = window.Urd;
  for (const layer of background?.layers ?? []) {
    const el = document.createElement('div');
    el.className = 'urd-bg-layer';
    const lifted = lift(layer, Urd.backgrounds.get(layer.type));
    if (!lifted.ok) {
      console.warn(`Urd: hopper over bakgrunnslag '${layer.type}' (${lifted.placeholder})`);
      continue;
    }
    try {
      Urd.backgrounds.get(layer.type).render(el, lifted.props);
      host.appendChild(el);
    } catch (err) {
      console.warn(`Urd: bakgrunnslag '${layer.type}' feilet under render`, err);
    }
  }
}

/**
 * Oversetter en frame til CSS-posisjonering.
 * Ren funksjon (ingen DOM), testet i tests/render.test.mjs.
 *
 * Frames er i FYSISKE enheter: x/w i prosent av
 * seksjonsbredden (flyter med skjermen), y/h i px. Gridet er kun et
 * snappeverktøy ved redigering og påvirker aldri plasseringen.
 *
 * @param {{x: number, y: number, w: number, h: number, z?: number, rot?: number}} frame
 * @returns {{left: string, top: string, width: string, height: string, zIndex: string, transform: string}}
 */
export function frameToCss(frame) {
  return {
    left: `${frame.x}%`,
    top: `${frame.y}px`,
    width: `${frame.w}%`,
    height: `${frame.h}px`,
    zIndex: String(frame.z ?? 1),
    transform: frame.rot ? `rotate(${frame.rot}deg)` : '',
  };
}

/**
 * Leserekkefølgen for auto-avledet mobil-stabling: sortert på desktop-y,
 * deretter x; dekor-blokker utelates. Ren funksjon, testet.
 *
 * @param {Array<object>} blocks Seksjonens blokker
 * @returns {Array<object>} Blokkene som skal stables, i rekkefølge
 */
export function stackOrder(blocks) {
  // mobileOrder (additivt felt) overstyrer sorteringsnøkkelen og tolkes på samme skala som desktop-y.
  // Presetene bruker det til å holde kort samlet (ikon + boks) i stedet for at y-sorteringen splitter kortene i bånd; blokker uten feltet sorterer som før.
  const key = (block) => block.mobileOrder ?? block.frames.desktop.y;
  return blocks
    .filter((block) => !block.decor && block.frames?.desktop)
    .slice()
    .sort((a, b) => (key(a) - key(b)) || (a.frames.desktop.x - b.frames.desktop.x));
}

/**
 * Render en hel side inn i root. Hver seksjon får sitt eget <section>-
 * element, slik at renderSection kan rerendre én seksjon alene senere.
 *
 * @param {object} page Sidefil (content/pages/*.json), allerede parset
 * @param {object} site site.json
 * @param {HTMLElement} root
 * @param {{preview?: boolean, viewport?: 'desktop'|'mobile'}} [opts]
 */
export function renderPage(page, site, root, opts = {}) {
  root.replaceChildren();
  for (const section of page.sections) {
    const host = document.createElement('section');
    root.appendChild(host);
    renderSection(section, site, host, opts);
  }
  // «+ Ny seksjon»-barene mellom seksjonene (kun i preview).
  if (opts.preview) window.UrdPreviewEdit?.enhancePage(root, page, site);
  // Sticky blokker måles på nytt (re-render kan ha endret høyder/felt).
  refreshSticky();
}

/**
 * Render (eller rerender) én seksjon - grunnlaget for inkrementell preview.
 *
 * @param {object} section Seksjonsdata
 * @param {object} site site.json
 * @param {HTMLElement} host Seksjonselementet (tømmes og bygges på nytt)
 * @param {{preview?: boolean, viewport?: 'desktop'|'mobile'}} [opts]
 */
export function renderSection(section, site, host, opts = {}) {
  const Urd = window.Urd;
  const grid = section.grid ?? site.grid;
  const viewport = opts.viewport ?? 'desktop';
  const ctx = { site, section, grid, viewport, preview: Boolean(opts.preview) };

  host.className = 'urd-section';
  host.dataset.sectionId = section.id;
  // DOM-id gjør seksjonen til ankermål (#<seksjons-id> fra footer-kolonner,
  // menypunkter og blokk-lenker); myk ankerscroll kommer fra base.css.
  if (typeof section.id === 'string' && section.id) host.id = section.id;
  // Ferdig seksjonstema (rollesett, additivt fra v0.6): overstyrer seksjonens
  // fargetokens på host, blokkene arver dem. Nullstiller ved Standard/fravær.
  applySectionTheme(host, section.theme);
  host.replaceChildren();

  renderBackgroundLayers(host, section.background);

  const mode = section.responsive?.mobile?.mode ?? 'auto';

  if (viewport === 'mobile' && mode !== 'manual') {
    // Auto-avledet: vanlig flyt i én kolonne, tekst får naturlig høyde.
    const flow = document.createElement('div');
    flow.className = 'urd-flow';
    for (const block of stackOrder(section.blocks)) {
      const el = document.createElement('div');
      el.className = 'urd-block urd-block-flow';
      el.dataset.blockId = block.id;
      if (block.type !== 'text') el.style.height = `${block.frames.desktop.h}px`;
      if (block.frames.desktop.rot) el.style.transform = `rotate(${block.frames.desktop.rot}deg)`;
      renderBlock(Urd, el, block, ctx);
      flow.appendChild(el);
    }
    host.appendChild(flow);
    host.style.minHeight = 'auto';
  } else {
    // Absolutt posisjonering: desktop-frames, eller mobil-frames i
    // manuell modus (null faller tilbake til desktop-framen).
    let maxBottomPx = 0;
    for (const block of section.blocks) {
      // En blokk uten desktop-frame (håndredigert/ødelagt data) hoppes over i stedet for å velte hele seksjonen.
      if (!block.frames?.desktop) {
        console.warn(`Urd: blokk '${block.id ?? block.type}' mangler frames.desktop - hoppes over`);
        continue;
      }
      const el = document.createElement('div');
      el.className = 'urd-block';
      el.dataset.blockId = block.id;
      const frame = viewport === 'mobile'
        ? (block.frames.mobile ?? block.frames.desktop)
        : block.frames.desktop;
      Object.assign(el.style, frameToCss(frame));
      // Sticky («fest ved scrolling», additivt felt): kun merking her;
      // selve festingen gjør sticky.js ved scroll. Kun desktop - mobil-
      // visningen er dokumentflyt og ignorerer feltet.
      if (viewport !== 'mobile' && block.sticky && typeof block.sticky.offset === 'number') {
        el.classList.add('urd-sticky-able');
        el.dataset.stickyOffset = String(block.sticky.offset);
        el.dataset.stickyUntil = block.sticky.until ?? '';
      }
      maxBottomPx = Math.max(maxBottomPx, frame.y + frame.h);
      renderBlock(Urd, el, block, ctx);
      host.appendChild(el);
    }

    if (viewport === 'mobile') {
      // Mobil manuell: høyden følger nederste mobil-frame (ren funksjon
      // av lagrede data - identisk i editor og produksjon).
      host.style.minHeight = `${maxBottomPx}px`;
    } else {
      // Seksjonshøyden er brukerens: blokker kan bevisst henge utover
      // kanten (seksjoner klipper aldri). Uten satt høyde brukes
      // blokkenes utstrekning.
      host.style.minHeight = section.size?.minHeight ?? `${maxBottomPx}px`;
    }
  }

  // Valgfri seksjonsanimasjon (additivt felt fra v0.5). Inn-animasjonen
  // (animation) og pekereffekten (hover, additivt felt fra v0.6) er
  // uavhengige og kan kombineres.
  renderAnimation(Urd, host, section.animation, ctx);
  renderAnimation(Urd, host, section.hover, ctx);

  // Mobil-tilsyn: redaksjonell markering, kun i preview (besøkende
  // ignorerer flagget, se docs/SKJEMA.md#mobil-tilsyn).
  if (ctx.preview && section.responsive?.mobile?.attention?.needed) {
    host.classList.add('urd-attention');
  }

  // I preview-modus kobles editeringslaget (dra/resize/slett) på etter
  // hver rendering. Satt av urd.js; finnes aldri hos besøkende.
  if (ctx.preview) window.UrdPreviewEdit?.enhanceSection(host, section, grid);
  // Sticky blokker måles på nytt (inkrementell rerender av én seksjon).
  refreshSticky();
}

/** Felles blokk-rendering med migrering og plassholder-fallback. */
function renderBlock(Urd, el, block, ctx) {
  const lifted = lift(block, Urd.blocks.get(block.type));
  if (lifted.ok) {
    try {
      Urd.blocks.get(block.type).render(el, lifted.props, ctx);
      // Inn-animasjon og pekereffekt er uavhengige felt og kan kombineres.
      renderAnimation(Urd, el, block.animation, ctx);
      renderAnimation(Urd, el, block.hover, ctx);
    } catch (err) {
      console.warn(`Urd: blokk '${block.type}' feilet under render`, err);
      renderPlaceholder(el, block.type);
    }
  } else {
    renderPlaceholder(el, block.type);
  }
}

/**
 * Valgfri animasjon på blokk/seksjon. Ukjent eller feilende animasjon
 * viser innholdet uanimert - animasjon er dekor og velter aldri siden.
 */
function renderAnimation(Urd, el, animation, ctx) {
  if (!animation?.type) return;
  const def = Urd.animations.get(animation.type);
  const lifted = lift(animation, def);
  if (!lifted.ok) return;
  try {
    applyAnimation(el, animation.type, lifted.props, def, ctx);
  } catch (err) {
    console.warn(`Urd: animasjonen '${animation.type}' feilet`, err);
  }
}

/**
 * Nøytral plassholder for ukjente/feilende blokker. Dataene bak er
 * urørt; dette er kun visning (se løfte 2 og ADR-0005).
 * @param {HTMLElement} el
 * @param {string} type
 */
function renderPlaceholder(el, type) {
  el.classList.add('urd-placeholder');
  el.textContent = type;
  el.title = t('render.missingPlugin', { type });
}
