/**
 * Bakgrunnslag: gradient. Lineær eller radiell. Fargene er en LISTE i
 * rekkefølge (først til sist langs gradienten), og hver farge har en
 * andel plass (share): hvor stor del av gradienten den dekker. En farge
 * med plass 0 gir en hard fargekant. Valgfri animasjon per form.
 *
 * Andelene er vekter: de normaliseres ved rendering, så summen trenger
 * ikke være 100. Hver farge males i midten av sitt bånd; CSS-en strekker
 * første og siste farge ut til kantene.
 */
import { resolveColor } from '../theme.js';

/** Gyldige animasjoner per form; alt annet rendres uanimert. */
const ANIMATIONS = {
  linear: ['pan', 'pan-loop', 'rotate'],
  radial: ['pulse', 'orbit'],
};

/** Normaliserer andelene til fargeposisjoner (sentrum av hvert bånd, 0-100). */
function centers(stops) {
  const list = Array.isArray(stops) && stops.length ? stops : [{ color: '#0b0e14' }, { color: '#1a1030' }];
  const weights = list.map((s) => Math.max(0, Number(s?.share) || 0));
  const sum = weights.reduce((a, b) => a + b, 0);
  const even = sum <= 0;
  const total = even ? list.length : sum;
  let cum = 0;
  return list.map((s, i) => {
    const w = even ? 1 : weights[i];
    const at = ((cum + w / 2) / total) * 100;
    cum += w;
    return { color: s?.color ?? '#0b0e14', at: Math.round(at * 100) / 100 };
  });
}

/** Sirkulær syklus for én-veis panorering (regnbue-modellen, valgt
 *  24. juli 2026): siste farge glir tilbake til første, så mønsteret leses
 *  1 2 3 4 1 2 3 4 - aldri speilet, og ingen farge synes to ganger
 *  samtidig (fast regel: en farge vises kun én gang med mindre den er
 *  lagt til to ganger). Posisjonene er prosent av ÉN periode. */
function cyclicCycle(list) {
  const r2 = (v) => Math.round(v * 100) / 100;
  const shift = list[0]?.at ?? 0;
  return [
    ...list.map((s) => ({ color: s.color, at: r2(s.at - shift) })),
    { color: list[0]?.color ?? '#0b0e14', at: 100 },
  ];
}

/**
 * Loopens geometri (ren, node-testbar): følger vinkelen eieren har satt.
 * Perioden er gradientlinjen gjennom flaten pluss AKKURAT nok til at den
 * skjulte delen av syklusen rommer den største fargen: da kan ingen
 * farge splittes over synsfeltets kanter (regelen fra 24. juli 2026:
 * ingen farge vises to ganger), samtidig som fargene beholder omtrent
 * samme størrelse som i den statiske gradienten (med 7 like farger er
 * perioden bare 1/6 lengre enn linjen, aldri dobbel). Forskyvningen er
 * nøyaktig én periode langs aksen - da er mønsteret identisk ved rundens
 * slutt, og loopen sømløs for ENHVER vinkel (CSS-vinkel: 0 = oppover,
 * 90 = mot høyre).
 *
 * @param {number} width Flatens bredde i px
 * @param {number} height Flatens høyde i px
 * @param {number} angleDeg Gradientvinkelen
 * @param {number} [maxShare] Største fargens normaliserte andel (0..1)
 * @returns {{period: number, dx: number, dy: number}} px, avrundet til 2 desimaler
 */
export function loopGeometry(width, height, angleDeg, maxShare = 0.5) {
  const rad = ((angleDeg % 360) * Math.PI) / 180;
  // || 0 normaliserer -0 (flyttallsstøy ved rene vinkler).
  const r2 = (v) => Math.round(v * 100) / 100 || 0;
  const line = Math.abs(width * Math.sin(rad)) + Math.abs(height * Math.cos(rad));
  // Klemmes så en ekstremt dominant farge ikke gir en absurd lang
  // periode (og aldri deling på null).
  const share = Math.min(Math.max(maxShare, 0), 0.9);
  const period = line / (1 - share);
  return { period: r2(period), dx: r2(Math.sin(rad) * period), dy: r2(-Math.cos(rad) * period) };
}

/**
 * Løperens gradient (ren): gjentakende gradient med syklusens posisjoner
 * omregnet til px av perioden, så mønsteret fliser sømløst langs aksen.
 */
export function loopGradientCss(stops, angleDeg, periodPx) {
  const css = stops
    .map((s) => `${resolveColor(s.color)} ${Math.round((s.at / 100) * periodPx * 100) / 100}px`)
    .join(', ');
  return `repeating-linear-gradient(${angleDeg}deg, ${css})`;
}

/**
 * Bygger hele render-oppskriften som en ren funksjon (node-testbar):
 * background-CSS, ekstra style-egenskaper (kebab-case, inkl. CSS-vars)
 * og animasjonsklassen.
 *
 * @param {{kind?: string, stops: Array<{color: string, share?: number}>, angle?: number, x?: number, y?: number, animation?: string, opacity?: number}} props
 * @returns {{background: string|null, className: string|null, styles: Record<string, string>, loop?: {angle: number, stops: Array<{color: string, at: number}>}, runner?: {className: string, background: string, left?: string, top?: string}}}
 *   loop settes kun for pan-loop: da males gradienten på en løper i px
 *   når flaten kan måles (se render), og background er null. runner
 *   settes for pan/orbit: gradienten males på en 200 %-løper som
 *   animeres med transform (kompositor) i stedet for background-position
 *   (repaint per frame); background er null også da.
 */
export function gradientRender(props) {
  const kind = props.kind === 'radial' ? 'radial' : 'linear';
  const anim = (ANIMATIONS[kind] ?? []).includes(props.animation) ? props.animation : null;
  const list = centers(props.stops);
  const cssStops = list.map((s) => `${resolveColor(s.color)} ${s.at}%`).join(', ');

  const styles = {};
  let background;
  if (kind === 'radial') {
    const x = Math.round((props.x ?? 0.5) * 100);
    const y = Math.round((props.y ?? 0.5) * 100);
    background = `radial-gradient(circle at ${x}% ${y}%, ${cssStops})`;
    if (anim === 'orbit') {
      // Løperen forankres (left/top) så gradientens sentrum (x, y) står
      // på samme punkt i flaten som uanimert; banen svinger løperen
      // ±2 % av egen størrelse = 4 % av flaten (se urd-bg-orbit).
      return {
        background: null,
        className: null,
        styles,
        runner: { className: 'urd-bg-orbit-runner', background, left: `${-x}%`, top: `${-y}%` },
      };
    }
    if (anim === 'pulse') styles['--urd-bg-op'] = String(props.opacity ?? 1);
  } else {
    const angle = props.angle ?? 160;
    if (anim === 'pan-loop') {
      // Løper-modellen (se render): den rene oppskriften er syklusen,
      // vinkelen og største fargeandel (styrer periodelengden);
      // px-målene settes først når flaten kan måles.
      const weights = (props.stops ?? []).map((s) => Math.max(0, Number(s?.share) || 0));
      const sum = weights.reduce((a, b) => a + b, 0);
      const maxShare = sum > 0 ? Math.max(...weights) / sum : 1 / list.length;
      return {
        background: null,
        className: null,
        styles,
        loop: { angle, stops: cyclicCycle(list), maxShare },
      };
    }
    background = anim === 'rotate'
      ? `linear-gradient(calc(var(--urd-grad-spin, 0deg) + ${angle}deg), ${cssStops})`
      : `linear-gradient(${angle}deg, ${cssStops})`;
    if (anim === 'pan') {
      // Løperen er 200 % i begge ledd; glidningen til translate(-50%,
      // -50%) tilsvarer den gamle background-position-reisen 0 -> 100 %.
      return {
        background: null,
        className: null,
        styles,
        runner: { className: 'urd-bg-pan-runner', background },
      };
    }
  }

  const classNames = { rotate: 'urd-bg-rotate', pulse: 'urd-bg-pulse' };
  return { background, className: anim ? (classNames[anim] ?? null) : null, styles };
}

/* Loop-løperne må måles på nytt når vinduet endrer størrelse (px-mål).
   ÉN modulnivå-lytter; frakoblede løpere (etter re-render) lukes ut ved
   at apply returnerer false. */
const loopAppliers = new Set();
let loopListenerOn = false;
function registerLoopApply(apply) {
  loopAppliers.add(apply);
  if (loopListenerOn || typeof window === 'undefined') return;
  loopListenerOn = true;
  window.addEventListener('resize', () => {
    for (const fn of [...loopAppliers]) {
      if (!fn()) loopAppliers.delete(fn);
    }
  });
}

/* Roter-animasjonen interpolerer en registrert vinkel-variabel; uten
   støtte degraderer den til statisk gradient (dekor velter aldri siden). */
let spinRegistered = false;
function registerSpin() {
  if (spinRegistered) return;
  spinRegistered = true;
  try {
    CSS.registerProperty({ name: '--urd-grad-spin', syntax: '<angle>', inherits: false, initialValue: '0deg' });
  } catch { /* alt annet enn førstegangsregistrering er uinteressant */ }
}

export const gradientLayer = {
  version: 1,
  label: 'Gradient',
  labelKey: 'bgLayer.gradient',
  defaults: () => ({
    kind: 'linear',
    stops: [{ color: '#0b0e14', share: 50 }, { color: '#1a1030', share: 50 }],
    angle: 160,
    x: 0.5,
    y: 0.5,
    animation: 'none',
    opacity: 1,
  }),
  migrations: {},
  /**
   * @param {HTMLElement} el
   * @param {{kind: string, stops: Array<{color: string, share: number}>, angle: number, x: number, y: number, animation: string, opacity?: number}} props
   */
  render(el, props) {
    const r = gradientRender(props);
    el.style.opacity = String(props.opacity ?? 1);
    for (const [name, value] of Object.entries(r.styles)) el.style.setProperty(name, value);
    if (r.loop) {
      // Én-veis panorering følger eierens vinkel: en gjentakende gradient
      // males på en oversized løper i px, og løperen forskyves nøyaktig
      // én periode langs aksen per runde - sømløst for enhver vinkel.
      // Px-målene krever lagt-ut flate, derfor rAF + resize-oppfrisking.
      el.classList.add('urd-bg-loop-host');
      const runner = document.createElement('div');
      runner.className = 'urd-bg-loop-runner';
      el.appendChild(runner);
      const apply = () => {
        if (!el.isConnected) return false;
        const w = el.clientWidth;
        const h = el.clientHeight;
        if (w && h) {
          const geo = loopGeometry(w, h, r.loop.angle, r.loop.maxShare);
          runner.style.inset = `${-Math.ceil(geo.period)}px`;
          runner.style.background = loopGradientCss(r.loop.stops, r.loop.angle, geo.period);
          runner.style.setProperty('--urd-loop-dx', `${geo.dx}px`);
          runner.style.setProperty('--urd-loop-dy', `${geo.dy}px`);
        }
        return true;
      };
      requestAnimationFrame(apply);
      registerLoopApply(apply);
      return;
    }
    if (r.runner) {
      // Pan/orbit: gradienten males på en 200 %-løper som forskyves med
      // transform på kompositor-tråden i stedet for background-position
      // (repaint av laget per frame). Verten klipper løperen, samme
      // klasse som pan-loop bruker.
      el.classList.add('urd-bg-loop-host');
      const runner = document.createElement('div');
      runner.className = r.runner.className;
      runner.style.background = r.runner.background;
      if (r.runner.left != null) runner.style.left = r.runner.left;
      if (r.runner.top != null) runner.style.top = r.runner.top;
      el.appendChild(runner);
      return;
    }
    el.style.background = r.background;
    if (r.className) {
      el.classList.add(r.className);
      if (r.className === 'urd-bg-rotate') registerSpin();
    }
  },
};
