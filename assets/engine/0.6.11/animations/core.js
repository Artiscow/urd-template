/**
 * Kjerneanimasjoner. Registertyper med samme version+migrate-kontrakt som
 * blokker og bakgrunnslag (docs/SKJEMA.md): en Urd-oppdatering kan endre
 * en animasjons props trygt via migrations.
 *
 * Inngangsanimasjonene (fade-in, slide-up, zoom-in) spilles når elementet
 * scrolles inn hos besøkende (IntersectionObserver). I editorens preview
 * vises SLUTT-tilstanden: redigering skal ikke utløse evige avspillinger.
 * prefers-reduced-motion respekteres (CSS-en i base.css nuller også ut).
 *
 * All CSS ligger i base.css (.urd-anim-*): definisjonene her setter kun
 * klasser og varighet/forsinkelse som CSS-variabler.
 */

const entranceDefaults = () => ({ duration: 600, delay: 0 });

export const coreAnimations = {
  'fade-in': { version: 1, label: 'Ton inn', labelKey: 'anim.fadeIn', entrance: true, defaults: entranceDefaults, migrations: {} },
  'slide-up': { version: 1, label: 'Gli opp', labelKey: 'anim.slideUp', entrance: true, defaults: entranceDefaults, migrations: {} },
  'zoom-in': { version: 1, label: 'Zoom inn', labelKey: 'anim.zoomIn', entrance: true, defaults: entranceDefaults, migrations: {} },
  'hover-lift': { version: 1, label: 'Løft ved peker', labelKey: 'anim.hoverLift', entrance: false, defaults: () => ({}), migrations: {} },
  // Stagger er en GRUPPE-inngangsanimasjon (kun seksjonsnivå): den animerer
  // ikke seksjonen selv, men slipper seksjonens kort-blokker inn forskjøvet fra
  // ÉN felles trigger. pattern: 'sequence' (ett trinn per kort), 'columns'/
  // 'rows' (kort på samme x/y kommer samtidig, bølgen skyves bortover) eller
  // 'center' (utover fra midten av rekka). delay er felles grunnforsinkelse
  // (additiv fra 0.6.6.4.6, eldre data mangler feltet og leses som 0).
  stagger: {
    version: 1, label: 'Stagger (kortgruppe)', labelKey: 'anim.stagger', entrance: true, group: true,
    defaults: () => ({ duration: 600, delay: 0, step: 90, effect: 'slide-up', pattern: 'sequence' }),
    migrations: {},
  },
};

const STAGGER_EFFECTS = ['fade-in', 'slide-up', 'zoom-in'];

/**
 * Forsinkelser (ms) for kolonne-/radvis stagger: posisjoner klynges med
 * toleranse (kort som er nesten på linje regnes som samme kolonne/rad; de
 * gamle 8px-bøttene delte dem), og bølgen skyves bortover stigende posisjon.
 * Ren funksjon (node-testet).
 * @param {number[]} positions x- eller y-posisjon i px per kort (samme rekkefølge som kortene)
 * @param {number} step Trinn-tid i ms
 * @param {number} [tolerance] Maks px-avstand som regnes som samme klynge
 * @returns {number[]}
 */
export function staggerColumnDelays(positions, step, tolerance = 24) {
  const sorted = [...new Set(positions)].sort((a, b) => a - b);
  const clusterOf = new Map();
  let cluster = -1;
  let prev = null;
  for (const p of sorted) {
    if (prev === null || p - prev > tolerance) cluster += 1;
    clusterOf.set(p, cluster);
    prev = p;
  }
  return positions.map((p) => clusterOf.get(p) * step);
}

/**
 * Forsinkelser (ms) for «fra midten»-stagger: midtkortet (eller midtparet ved
 * partall) slippes først, så bølger rekka utover symmetrisk. Indeksbasert
 * (kortenes rekkefølge i seksjonen). Ren funksjon (node-testet).
 * @param {number} count Antall kort
 * @param {number} step Trinn-tid i ms
 * @returns {number[]}
 */
export function staggerCenterDelays(count, step) {
  const mid = (count - 1) / 2;
  return Array.from({ length: count }, (_, i) => Math.floor(Math.abs(i - mid)) * step);
}

/** Delt observer: legger på .urd-anim-in første gang elementet er synlig. */
let observer = null;
// Seksjoner med stagger: verten observeres, men det er BARNA som slippes.
const staggerGroups = new WeakMap();

/**
 * Inngangsanimasjonen spilles når elementet blir synlig - også hvis det er
 * synlig alt ved innlasting (da tones/glir det inn like etter at siden vises,
 * som «Ton inn» skal). IntersectionObserver-callbacken kjører først etter at
 * starttilstanden (opacity 0 fra CSS) er malt, så overgangen spiller rent.
 * Elementer man scroller til senere spiller når de kommer inn i viewporten.
 * (I editorens preview vises SLUTT-tilstanden umiddelbart - se applyAnimation
 * - så observeren er kun aktiv hos besøkende og på publisert side.)
 */
function entranceObserver() {
  observer ??= new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      // Elementer som er mye høyere enn viewporten (høye seksjoner) når aldri 15 % synlig andel.
      // Da utløses i stedet på at synlig del dekker over halve viewporten, så innholdet ikke blir stående på opacity 0 for alltid.
      const tall = entry.rootBounds && entry.intersectionRect.height >= entry.rootBounds.height * 0.5;
      if (entry.intersectionRatio < 0.15 && !tall) continue;
      const el = entry.target;
      observer.unobserve(el);
      // Stagger-vert: slipp BARNA (hvert med sin forskjøvne delay), ikke verten.
      const group = staggerGroups.get(el);
      if (group) group.forEach((child) => child.classList.add('urd-anim-in'));
      else el.classList.add('urd-anim-in');
    }
  }, { threshold: [0.05, 0.1, 0.15] });
  return observer;
}

/**
 * Stagger (gruppe): finn seksjonens kort-blokker (uten egen animasjon), gi dem
 * inngangseffekt + forskjøvet delay etter mønster, og slipp dem samlet fra
 * seksjonens synlighet. I preview/reduced-motion vises slutt-tilstanden straks.
 */
function applyStagger(host, props, ctx) {
  const effect = STAGGER_EFFECTS.includes(props.effect) ? props.effect : 'slide-up';
  const step = Number.isFinite(props.step) ? Math.max(0, props.step) : 90;
  const base = Number.isFinite(props.delay) ? Math.max(0, props.delay) : 0;
  host.classList.add('urd-anim-stagger');
  // Kort-blokkene: alle .urd-block i seksjonen som ikke alt har egen
  // animasjon. Dekor-blokker unntas (som i mobil-stablingen): de er pynt og
  // skal ikke forsinke innholdsbølgen.
  const targets = [...host.querySelectorAll('.urd-block')]
    .filter((el) => !/\burd-anim-/.test(el.className) && !el.dataset.decor);
  if (!targets.length) return;
  const delays = props.pattern === 'columns'
    ? staggerColumnDelays(targets.map((el) => el.offsetLeft), step)
    : props.pattern === 'rows'
      ? staggerColumnDelays(targets.map((el) => el.offsetTop), step)
      : props.pattern === 'center'
        ? staggerCenterDelays(targets.length, step)
        : targets.map((_, i) => i * step);
  targets.forEach((el, i) => {
    el.classList.add(`urd-anim-${effect}`);
    if (props.duration != null) el.style.setProperty('--urd-anim-duration', `${props.duration}ms`);
    el.style.setProperty('--urd-anim-delay', `${base + delays[i]}ms`);
  });

  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  if (ctx.preview || reduced) {
    targets.forEach((el) => el.classList.add('urd-anim-in'));
    return;
  }
  staggerGroups.set(host, targets);
  entranceObserver().observe(host);
}

/**
 * Kobler en (allerede versjonsløftet) animasjon på et element.
 * Merk: blokker med rotasjon har inline transform som vinner over
 * animasjonsklassenes transform - da spilles kun opacity-delen.
 *
 * @param {HTMLElement} el
 * @param {string} type Animasjonstype (nøkkel i registeret)
 * @param {{duration?: number, delay?: number}} props Løftede props
 * @param {{entrance?: boolean}} def Typedefinisjonen
 * @param {{preview?: boolean}} [ctx] Render-kontekst
 */
export function applyAnimation(el, type, props, def, ctx = {}) {
  // Gruppe-animasjon (stagger): animerer barna, ikke elementet selv.
  if (def.group) {
    applyStagger(el, props, ctx);
    return;
  }
  el.classList.add(`urd-anim-${type}`);
  if (props.duration != null) el.style.setProperty('--urd-anim-duration', `${props.duration}ms`);
  if (props.delay != null) el.style.setProperty('--urd-anim-delay', `${props.delay}ms`);
  if (!def.entrance) return;

  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  if (ctx.preview || reduced) {
    el.classList.add('urd-anim-in');
    return;
  }
  entranceObserver().observe(el);
}
