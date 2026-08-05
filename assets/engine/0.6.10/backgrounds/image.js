/**
 * Bakgrunnslag: bilde. Viser en fil fra media/ (eller en data-URL for
 * upubliserte opplastinger i utkast; publisering materialiserer den til
 * en fil, samme flyt som bildeblokken).
 *
 * Posisjon og størrelse styres CSS-native via `background-position` og
 * `background-size` på et indre `.urd-bg-image`-element (samme modell som
 * bildegalleri-laget), IKKE via transform. Transform brukes kun til parallax.
 *
 * Felt (alle additive med trygge standarder):
 * - fit: 'cover' (fyll+beskjær), 'egen' (background-size %, breddrelativ - krymper
 *   OG forstørrer, beskjæres ikke av seksjonshøyden), 'contain' (vis hele), 'repeat'.
 * - x/y (0..1, 0.5 = sentrert): fokuspunkt via background-position-prosent. Punktet
 *   holder seg synlig uansett seksjonsformat, uten tomrom.
 * - size (brøk, 1 = 100% av bredden): kun i 'egen'-modus.
 * - blur (px): stemningsbakgrunn bak tekst. opacity (0..1). parallax (0..1): laget
 *   henger etter ved scroll. bleed: la parallaksen flyte inn i naboseksjonene.
 */

/** Maks vertikal reisevei (andel av vindushøyden) et parallax-lag får ved full
 *  styrke. Kraftig, siden fri-plasserings-bildet (skala + posisjon) ikke MÅ fylle
 *  seksjonen: det forskyves rent uten overskann/zoom, så utslaget kan være stort. */
const MAX_SHIFT = 0.4;

/**
 * background-position-strengen for et fokuspunkt (0.5/0.5 = sentrert). Ren
 * funksjon (node-testet). Samme mapping som bildegalleri-laget.
 * @param {number} x Fokus vannrett 0..1
 * @param {number} y Fokus loddrett 0..1
 * @returns {string}
 */
export function bgPosition(x, y) {
  return `${(x ?? 0.5) * 100}% ${(y ?? 0.5) * 100}%`;
}

/**
 * background-size-verdien. Fri-plasserings-modellen (`vanlig`/`flislegg`) bruker en
 * breddrelativ SKALA (`{size*100}%`, høyde = auto beholder forholdet), så brukeren
 * setter størrelsen selv. `cover`/`contain` beholdes som nøkkelord (bildegalleri-
 * laget og bakoverkompat). Ren funksjon (node-testet).
 * @param {'vanlig'|'flislegg'|'cover'|'contain'|'egen'|'repeat'} fit
 * @param {number} [size] Skala som brøk (1 = 100% av seksjonsbredden)
 * @returns {string}
 */
export function bgSize(fit, size) {
  if (fit === 'contain') return 'contain';
  if (fit === 'cover') return 'cover';
  // vanlig / flislegg / egen / repeat / annet -> breddrelativ skala
  return `${Math.max(0, size ?? 1) * 100}%`;
}

/**
 * clip-path for et lag ut fra bleed-retningen. Sidene klippes ALLTID ved kanten
 * (ingen vannrett bleed → ingen sidescroll); topp/bunn åpnes på bleed-siden så et
 * parallax-lag kan flyte inn i naboseksjonen. Ren funksjon (node-testet).
 * @param {'none'|'up'|'down'|'both'} [bleed]
 * @returns {string}
 */
export function bleedClip(bleed) {
  const o = '-9999px';
  if (bleed === 'up') return `inset(${o} 0 0 0)`;
  if (bleed === 'down') return `inset(0 0 ${o} 0)`;
  if (bleed === 'both') return `inset(${o} 0 ${o} 0)`;
  return 'inset(0)';
}

/**
 * Vertikal overskann (px) for et parallax-lag: nøyaktig reiseveien laget trenger
 * for å forskyves uten å avsløre kanter. Proporsjonal med styrken, så en lav
 * styrke gir minimal forstørring. Tak mot seksjonshøyden. Ren funksjon (node-testet).
 * @param {number} sectionH Seksjonens høyde
 * @param {number} viewportH Vindushøyde
 * @param {number} speed Styrke 0..1
 * @returns {number}
 */
export function parallaxPad(sectionH, viewportH, speed, capFrac = 0.18) {
  const travel = Math.max(0, Math.min(1, speed)) * MAX_SHIFT * viewportH;
  return Math.round(Math.min(travel, capFrac * sectionH));
}

/**
 * translateY (px) for et parallax-lag: seksjonens senter målt mot viewport-
 * senteret, ganget med styrken, klemt til [-pad, pad] så det aldri forskyves
 * utenfor overskannet. Ren funksjon (node-testet).
 * @param {number} rectTop Seksjonens top i viewport-koordinater
 * @param {number} sectionH Seksjonens høyde
 * @param {number} viewportH Vindushøyde
 * @param {number} speed Styrke 0..1
 * @param {number} pad Overskann i px (grensen for forskyvningen)
 * @returns {number}
 */
export function parallaxOffset(rectTop, sectionH, viewportH, speed, pad) {
  const sectionMid = rectTop + sectionH / 2;
  const raw = (viewportH / 2 - sectionMid) * Math.max(0, Math.min(1, speed)) * MAX_SHIFT;
  const lim = pad ?? parallaxPad(sectionH, viewportH, speed);
  // `|| 0` normaliserer -0 til +0.
  return Math.max(-lim, Math.min(lim, raw)) || 0;
}

// Aktive parallax-lag: ÉN modulnivå scroll-/resize-lytter forskyver dem via
// rAF. Frakoblede lag (etter re-render) lukes ut når apply returnerer false.
const parallaxAppliers = new Set();
let parallaxListening = false;
let parallaxRaf = 0;
function pumpParallax() {
  parallaxRaf = 0;
  for (const fn of [...parallaxAppliers]) if (!fn()) parallaxAppliers.delete(fn);
}
function scheduleParallax() {
  if (!parallaxRaf) parallaxRaf = requestAnimationFrame(pumpParallax);
}
function registerParallax(apply) {
  parallaxAppliers.add(apply);
  apply();
  if (parallaxListening || typeof window === 'undefined') return;
  parallaxListening = true;
  window.addEventListener('scroll', scheduleParallax, { passive: true });
  window.addEventListener('resize', scheduleParallax, { passive: true });
}

/**
 * Fester parallax på bilde-elementet: én rAF-drevet lytter forskyver det ved
 * scroll via `translateY`. Overskannet (top/bottom) hindrer at forskyvningen
 * avslører kanter; det er minst `blurMargin` (uskarphetens rand) og vokser til
 * parallax-reiseveien. AV på mobil og ved prefers-reduced-motion (da står laget
 * stille, kun uskarphetens rand beholdes).
 * Fyllmodus (cover/flislegg) MÅ overskanne (fyller seksjonen, så en gap ved kanten
 * er uakseptabel; overskann på flis koster ingen zoom, på cover en liten). Den
 * frie modellen (vanlig/egen/contain) viser bildet med luft rundt, så der trengs
 * INGEN overskann: bildet forskyves rent, uten zoom, og hele styrke-området merkes.
 * @param {HTMLElement} img Bilde-elementet
 * @param {number} speed Styrke 0..1
 * @param {number} blurMargin Uskarphetens rand i px (0 uten blur)
 * @param {'vanlig'|'flislegg'|'cover'|'egen'|'contain'|'repeat'} fit
 */
function mountParallax(img, speed, blurMargin, fit) {
  const fills = fit === 'cover' || fit === 'flislegg' || fit === 'repeat';
  const section = img.closest('.urd-section') ?? img.parentElement?.closest('.urd-section') ?? img.parentElement;
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  img.style.willChange = 'transform';
  const setInset = (v) => { img.style.top = `-${v}px`; img.style.bottom = `-${v}px`; };
  const apply = () => {
    if (!img.isConnected) return false;
    if (reduce || document.body.classList.contains('urd-mobile')) {
      setInset(blurMargin);
      img.style.transform = '';
      return true;
    }
    const rect = (section ?? img).getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    // `limit` klemmer bevegelsen (dy). Fyllmodus har et stramt tak (overskannet =
    // motsatt zoom); den frie modellen kan bevege seg mye mer (ingen overskann).
    const limit = parallaxPad(rect.height, vh, speed, fills ? 0.18 : 0.6);
    setInset(fills ? Math.max(blurMargin, limit) : blurMargin);
    const dy = parallaxOffset(rect.top, rect.height, vh, speed, limit);
    img.style.transform = `translateY(${dy.toFixed(1)}px)`;
    return true;
  };
  registerParallax(apply);
  // `renderBackgroundLayers` legger laget i DOM ETTER render(), så den første
  // apply-en over kjører før seksjonen er målbar (overskann = 0). Kjør på nytt
  // når laget er koblet og målt, ellers «vokser» bildet først ved neste scroll.
  if (typeof requestAnimationFrame === 'function') {
    requestAnimationFrame(() => requestAnimationFrame(apply));
  }
}

/**
 * Støtter nettleseren scroll-drevne animasjoner? Da driver kompositoren
 * parallaksen via `animation-timeline: view()` (CSS), og vi slipper både
 * scroll-lytteren og rAF-pumpen (mountParallaxCss). Ellers faller vi tilbake
 * til den rAF-drevne mountParallax. Gates også i CSS med `@supports`.
 */
function supportsScrollTimeline() {
  return typeof CSS !== 'undefined' && typeof CSS.supports === 'function'
    && CSS.supports('animation-timeline', 'view()');
}

// CSS-parallax: reiseveien (--urd-px-shift) og overskannet (top/bottom) settes
// én gang og ved RESIZE, aldri ved scroll. Selve forskyvningen scrubbes av
// view()-tidslinjen i base.css på kompositor-tråden. Delt resize-lytter med
// samme opprydning som rAF-fallbacken: frakoblede lag lukes ut når måle-
// funksjonen returnerer false.
const parallaxMeasurers = new Set();
let measureBound = false;
let measureRaf = 0;
function pumpMeasure() {
  measureRaf = 0;
  for (const fn of [...parallaxMeasurers]) if (!fn()) parallaxMeasurers.delete(fn);
}
function scheduleMeasure() {
  if (!measureRaf && typeof requestAnimationFrame === 'function') measureRaf = requestAnimationFrame(pumpMeasure);
}
function registerMeasure(measure) {
  parallaxMeasurers.add(measure);
  measure();
  if (measureBound || typeof window === 'undefined') return;
  measureBound = true;
  window.addEventListener('resize', scheduleMeasure, { passive: true });
}

/**
 * Fester CSS-parallax på bilde-elementet: reiseveien og overskannet regnes ut
 * fra seksjonshøyden og vindushøyden (samme parallaxPad-formel som mountParallax),
 * men forskyvningen scrubbes av `animation-timeline: view()` i CSS - ingen scroll-
 * lytter, ingen rAF pr. bilde. Stille på mobil / ved redusert bevegelse (CSS
 * setter da animation:none; her holdes overskannet til uskarphetens rand så laget
 * står rent i sluttilstand).
 * @param {HTMLElement} img Bilde-elementet
 * @param {number} speed Styrke 0..1
 * @param {number} blurMargin Uskarphetens rand i px (0 uten blur)
 * @param {'vanlig'|'flislegg'|'cover'|'egen'|'contain'|'repeat'} fit
 */
function mountParallaxCss(img, speed, blurMargin, fit) {
  const fills = fit === 'cover' || fit === 'flislegg' || fit === 'repeat';
  const section = img.closest('.urd-section') ?? img.parentElement?.closest('.urd-section') ?? img.parentElement;
  img.style.willChange = 'transform';
  img.classList.add('urd-parallax-css');
  const measure = () => {
    if (!img.isConnected) return false;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const still = reduce || document.body.classList.contains('urd-mobile');
    const rect = (section ?? img).getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    // Reisevei = parallaxPad (fyll: stramt tak; fri: stort tak). Overskann kun i
    // fyllmodus når laget faktisk beveger seg; ellers holder uskarphetens rand.
    const shift = parallaxPad(rect.height, vh, speed, fills ? 0.18 : 0.6);
    const inset = (fills && !still) ? Math.max(blurMargin, shift) : blurMargin;
    img.style.setProperty('--urd-px-shift', `${shift}px`);
    img.style.top = `-${inset}px`;
    img.style.bottom = `-${inset}px`;
    return true;
  };
  registerMeasure(measure);
  // Samme grunn som mountParallax: laget legges i DOM etter render(), så første
  // måling må skje når seksjonen faktisk er målbar.
  if (typeof requestAnimationFrame === 'function') {
    requestAnimationFrame(() => requestAnimationFrame(measure));
  }
}

export const imageLayer = {
  version: 1,
  label: 'Bilde',
  labelKey: 'bgLayer.image',
  defaults: () => ({ src: '', fit: 'vanlig', x: 0.5, y: 0.5, size: 1, opacity: 1, blur: 0, parallax: 0, bleed: 'none' }),
  migrations: {},
  /**
   * @param {HTMLElement} el
   * @param {{src: string, fit?: 'cover'|'egen'|'contain'|'repeat', x?: number, y?: number, size?: number, opacity?: number, blur?: number, parallax?: number, bleed?: 'none'|'up'|'down'|'both'}} props
   */
  render(el, props) {
    if (!props.src) return;
    el.style.opacity = String(props.opacity ?? 1);
    // Klipping: retnings-clip-path styrt av bleed (inset(0) = klipp til seksjonen).
    el.style.clipPath = bleedClip(props.bleed);
    // Bleed NED/BEGGE: seksjonen under kommer senere i DOM og maler bakgrunnen sin
    // oppå det som flyter ned. Løft laget til z-index 1 så det maler OVER neste
    // seksjons bakgrunn (men fortsatt under innholdet dens, som ligger på z>=1
    // senere i treet). Bleed OPP maler allerede over forrige seksjon (tre-rekkefølge).
    el.style.zIndex = (props.bleed === 'down' || props.bleed === 'both') ? '1' : '';

    const img = document.createElement('div');
    img.className = 'urd-bg-image';
    img.style.position = 'absolute';
    img.style.left = '0';
    img.style.right = '0';
    img.style.top = '0';
    img.style.bottom = '0';
    const tile = props.fit === 'flislegg' || props.fit === 'repeat';
    img.style.backgroundImage = `url("${props.src}")`;
    img.style.backgroundSize = bgSize(props.fit, props.size);
    img.style.backgroundRepeat = tile ? 'repeat' : 'no-repeat';
    // Plassering via background-position. Bildet er (som regel) MINDRE enn
    // seksjonen, så 0/100 % = kant-i-kant venstre/høyre (intuitivt), og x/y kan gå
    // UNDER 0 / OVER 1 for å legge motivet delvis eller helt utenfor kanten.
    img.style.backgroundPosition = bgPosition(props.x, props.y);
    // Uskarphet: strekk bildet bittelitt utover kanten (klippes av laget) så den
    // transparente randen blur() lager havner utenfor. Ingen forsettlig zoom.
    let blurMargin = 0;
    if (props.blur > 0) {
      img.style.filter = `blur(${props.blur}px)`;
      blurMargin = Math.ceil(props.blur);
      img.style.left = `-${blurMargin}px`;
      img.style.right = `-${blurMargin}px`;
      img.style.top = `-${blurMargin}px`;
      img.style.bottom = `-${blurMargin}px`;
    }

    // Samme lastevern som bildeblokken: laget holdes usynlig til bildet er
    // ferdig lastet, så det aldri dukker opp stripevis.
    const probe = new Image();
    probe.src = props.src;
    if (!probe.complete) {
      el.style.visibility = 'hidden';
      const show = () => { el.style.visibility = ''; };
      probe.addEventListener('load', show, { once: true });
      probe.addEventListener('error', show, { once: true });
    }

    el.appendChild(img);
    // Parallax (additivt fra v0.6): laget henger etter ved scroll. Moderne
    // nettlesere driver det med scroll-drevet CSS (kompositor-tråd, ingen scroll-
    // lytter); eldre faller tilbake til den rAF-drevne varianten.
    if (props.parallax > 0) {
      const fit = props.fit ?? 'cover';
      if (supportsScrollTimeline()) mountParallaxCss(img, props.parallax, blurMargin, fit);
      else mountParallax(img, props.parallax, blurMargin, fit);
    }
  },
};
