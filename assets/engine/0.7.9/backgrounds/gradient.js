/**
 * Background layer: gradient. Linear or radial. The colors are stops: each
 * color sits at a position along the gradient (at, 0 to 100), with its own
 * opacity (alpha, 0 to 1, omitted means opaque). Two colors at one position
 * give a hard color edge. Optional animation per shape.
 *
 * Version 1 gave each color a share of the space instead, a weight that was
 * normalized at render time and painted in the middle of its band; the 1 -> 2
 * migration turns those band centers into positions, so a stored gradient
 * looks the same.
 */
import { resolveColor } from '../theme.js';

/** Valid animations per shape; anything else renders unanimated. */
const ANIMATIONS = {
  linear: ['pan', 'pan-loop', 'rotate'],
  radial: ['pulse', 'orbit'],
};

/** The seconds one round of each animation takes when the layer sets no `speed` (the durations base.css falls back to). */
export const GRAD_SPEED = { pan: 18, 'pan-loop': 30, rotate: 40, pulse: 7, orbit: 26 };

/** The bounds of the `speed` field, seconds per round. */
export const GRAD_SPEED_RANGE = { min: 3, max: 90 };

/** The layer's time per round in seconds: its own `speed` inside the bounds, else the animation's default. */
export function gradientSpeed(props, animation) {
  const own = Number(props?.speed);
  if (Number.isFinite(own) && own > 0) return Math.min(GRAD_SPEED_RANGE.max, Math.max(GRAD_SPEED_RANGE.min, own));
  return GRAD_SPEED[animation] ?? 18;
}

const DEFAULT_STOPS = [{ color: '#0b0e14', at: 0 }, { color: '#1a1030', at: 100 }];

const clampAt = (v) => Math.min(100, Math.max(0, Number(v)));
const r2 = (v) => Math.round(v * 100) / 100;

/**
 * The stops as the CSS reads them: in position order, each with its color,
 * position and opacity. A stop stored as a bare color string reads as that
 * color, a stop without a usable position stands where the list order puts
 * it (spread evenly), and the order among stops at one position is the list
 * order, so a hard edge keeps its two colors the way round they were given.
 * @param {Array<{color?: string, at?: number, alpha?: number}|string>|undefined} stops
 * @returns {Array<{color: string, at: number, alpha: number}>}
 */
export function stopPositions(stops) {
  const list = Array.isArray(stops) && stops.length ? stops : DEFAULT_STOPS;
  const last = Math.max(1, list.length - 1);
  return list
    .map((s, i) => {
      const stop = typeof s === 'string' ? { color: s } : (s ?? {});
      const at = Number.isFinite(Number(stop.at)) && stop.at !== null && stop.at !== '' ? clampAt(stop.at) : (i / last) * 100;
      const alpha = Number.isFinite(Number(stop.alpha)) && stop.alpha !== null && stop.alpha !== '' ? Math.min(1, Math.max(0, Number(stop.alpha))) : 1;
      return { color: stop.color ?? '#0b0e14', at: r2(at), alpha, i };
    })
    .sort((a, b) => a.at - b.at || a.i - b.i)
    .map(({ color, at, alpha }) => ({ color, at, alpha }));
}

/** A stop's color as painted: the theme token or hex, mixed towards transparent by its opacity. */
function paint(stop) {
  const color = resolveColor(stop.color);
  if (stop.alpha >= 1) return color;
  return `color-mix(in srgb, ${color} ${Math.round(stop.alpha * 100)}%, transparent)`;
}

/**
 * The widest color band as a share of the gradient (0..1): each color owns
 * the stretch from the midpoint to its neighbor on either side, the first
 * from 0 and the last to 100. The loop's period length reads it.
 */
function widestBand(list) {
  if (list.length < 2) return 1;
  let widest = 0;
  for (let i = 0; i < list.length; i++) {
    const from = i === 0 ? 0 : (list[i - 1].at + list[i].at) / 2;
    const to = i === list.length - 1 ? 100 : (list[i].at + list[i + 1].at) / 2;
    widest = Math.max(widest, to - from);
  }
  return widest / 100;
}

/**
 * The version 1 shares as positions: the center of each color's band, with
 * the shares read as weights that need not sum to 100 and a missing or zero
 * sum giving equal bands. A share of 0 lands the color on its neighbors'
 * boundary, which is where the hard edge stood.
 * @param {Array<{color?: string, share?: number}|string>|undefined} stops
 * @returns {Array<{color: string, at: number}>}
 */
export function sharesToPositions(stops) {
  const list = Array.isArray(stops) && stops.length ? stops : [{ color: '#0b0e14' }, { color: '#1a1030' }];
  const items = list.map((s) => (typeof s === 'string' ? { color: s } : (s ?? {})));
  const weights = items.map((s) => Math.max(0, Number(s.share) || 0));
  const sum = weights.reduce((a, b) => a + b, 0);
  const even = sum <= 0;
  const total = even ? items.length : sum;
  let cum = 0;
  return items.map((s, i) => {
    const w = even ? 1 : weights[i];
    const at = ((cum + w / 2) / total) * 100;
    cum += w;
    return { color: s.color ?? '#0b0e14', at: r2(at) };
  });
}

/** Circular cycle for one-way panning (the rainbow model): the last color
 *  glides back to the first, so the pattern reads 1 2 3 4 1 2 3 4 - never
 *  mirrored, and no color is visible twice at the same time (a color shows
 *  only once unless it has been added twice). The positions are percentages
 *  of ONE period. */
function cyclicCycle(list) {
  const shift = list[0]?.at ?? 0;
  return [
    ...list.map((s) => ({ color: s.color, alpha: s.alpha, at: r2(s.at - shift) })),
    { color: list[0]?.color ?? '#0b0e14', alpha: list[0]?.alpha ?? 1, at: 100 },
  ];
}

/**
 * The loop geometry (pure, node-testable): follows the angle the owner has set.
 * The period is the gradient line across the surface plus JUST enough for the
 * hidden part of the cycle to hold the widest color: no color can then be
 * split across the edges of the visible area (the rule that no color shows
 * twice), while the colors keep roughly the same size as in the static
 * gradient (with 7 equal colors the period is only 1/6 longer than the line,
 * never double). The shift is exactly one period along the axis - the pattern
 * is then identical at the end of the round, and the loop seamless for ANY
 * angle (CSS angle: 0 = upwards, 90 = to the right).
 *
 * @param {number} width Surface width in px
 * @param {number} height Surface height in px
 * @param {number} angleDeg The gradient angle
 * @param {number} [maxShare] The widest color band as a share of the gradient (0..1)
 * @returns {{period: number, dx: number, dy: number}} px, rounded to 2 decimals
 */
export function loopGeometry(width, height, angleDeg, maxShare = 0.5) {
  const rad = ((angleDeg % 360) * Math.PI) / 180;
  // || 0 normalizes -0 (floating-point noise at exact angles).
  const round = (v) => Math.round(v * 100) / 100 || 0;
  const line = Math.abs(width * Math.sin(rad)) + Math.abs(height * Math.cos(rad));
  // Clamped so an extremely dominant color cannot give an absurdly long
  // period (and never a division by zero).
  const share = Math.min(Math.max(maxShare, 0), 0.9);
  const period = line / (1 - share);
  return { period: round(period), dx: round(Math.sin(rad) * period), dy: round(-Math.cos(rad) * period) };
}

/**
 * The runner's gradient (pure): a repeating gradient with the cycle positions
 * converted to px of the period, so the pattern tiles seamlessly along the axis.
 */
export function loopGradientCss(stops, angleDeg, periodPx) {
  const css = stops
    .map((s) => `${paint({ color: s.color, alpha: s.alpha ?? 1 })} ${Math.round((s.at / 100) * periodPx * 100) / 100}px`)
    .join(', ');
  return `repeating-linear-gradient(${angleDeg}deg, ${css})`;
}

/**
 * Builds the whole render recipe as a pure function (node-testable): the
 * background CSS, extra style properties (kebab-case, including CSS vars)
 * and the animation class.
 *
 * @param {{kind?: string, stops: Array<{color: string, at?: number, alpha?: number}>, angle?: number, x?: number, y?: number, animation?: string, speed?: number, opacity?: number}} props
 * @returns {{background: string|null, className: string|null, styles: Record<string, string>, loop?: {angle: number, stops: Array<{color: string, at: number, alpha: number}>, maxShare: number}, runner?: {className: string, background: string, left?: string, top?: string}}}
 *   loop is set only for pan-loop: the gradient is then painted on a runner
 *   in px once the surface can be measured (see render), and background is
 *   null. runner is set for pan/orbit: the gradient is painted on a 200 %
 *   runner animated with transform (compositor) instead of background-position
 *   (a repaint per frame); background is null there too.
 */
export function gradientRender(props) {
  const kind = props.kind === 'radial' ? 'radial' : 'linear';
  const anim = (ANIMATIONS[kind] ?? []).includes(props.animation) ? props.animation : null;
  const list = stopPositions(props.stops);
  const cssStops = list.map((s) => `${paint(s)} ${s.at}%`).join(', ');

  const styles = {};
  // The time per round, read by every animation's CSS through the variable; the runners inherit it from the layer.
  if (anim && props.speed != null) styles['--urd-grad-time'] = `${gradientSpeed(props, anim)}s`;
  let background;
  if (kind === 'radial') {
    const x = Math.round((props.x ?? 0.5) * 100);
    const y = Math.round((props.y ?? 0.5) * 100);
    background = `radial-gradient(circle at ${x}% ${y}%, ${cssStops})`;
    if (anim === 'orbit') {
      // The runner is anchored (left/top) so the gradient center (x, y) sits at
      // the same point on the surface as when unanimated; the path swings the
      // runner ±2 % of its own size = 4 % of the surface (see urd-bg-orbit).
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
      // The runner model (see render): the pure recipe is the cycle, the angle
      // and the widest color band (which drives the period length); the px
      // measurements are set only once the surface can be measured.
      return {
        background: null,
        className: null,
        styles,
        loop: { angle, stops: cyclicCycle(list), maxShare: widestBand(list) },
      };
    }
    background = anim === 'rotate'
      ? `linear-gradient(calc(var(--urd-grad-spin, 0deg) + ${angle}deg), ${cssStops})`
      : `linear-gradient(${angle}deg, ${cssStops})`;
    if (anim === 'pan') {
      // The runner is 200 % in both axes; the glide to translate(-50%, -50%)
      // covers the same distance as a background-position travel 0 -> 100 %.
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

/* The loop runners must be re-measured when the window is resized (px
   measurements). ONE module-level listener; detached runners (after a
   re-render) are weeded out when apply returns false. */
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

/* The rotate animation interpolates a registered angle variable; without
   support it degrades to a static gradient (decoration never topples the page). */
let spinRegistered = false;
function registerSpin() {
  if (spinRegistered) return;
  spinRegistered = true;
  try {
    CSS.registerProperty({ name: '--urd-grad-spin', syntax: '<angle>', inherits: false, initialValue: '0deg' });
  } catch { /* anything but the first registration is uninteresting */ }
}

export const gradientLayer = {
  version: 2,
  label: 'Gradient',
  labelKey: 'bgLayer.gradient',
  defaults: () => ({
    kind: 'linear',
    stops: DEFAULT_STOPS.map((s) => ({ ...s })),
    angle: 160,
    x: 0.5,
    y: 0.5,
    animation: 'none',
    opacity: 1,
  }),
  migrations: {
    // 1 -> 2: the shares become positions at the band centers, so the gradient
    // keeps its look; the other props stand as stored.
    1: (props) => ({ ...props, stops: sharesToPositions(props?.stops) }),
  },
  /**
   * @param {HTMLElement} el
   * @param {{kind: string, stops: Array<{color: string, at: number, alpha?: number}>, angle: number, x: number, y: number, animation: string, opacity?: number}} props
   */
  render(el, props) {
    const r = gradientRender(props);
    el.style.opacity = String(props.opacity ?? 1);
    for (const [name, value] of Object.entries(r.styles)) el.style.setProperty(name, value);
    if (r.loop) {
      // One-way panning follows the owner's angle: a repeating gradient is
      // painted on an oversized runner in px, and the runner is shifted exactly
      // one period along the axis per round - seamless at any angle. The px
      // measurements require a laid-out surface, hence rAF + resize refresh.
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
      // Pan/orbit: the gradient is painted on a 200 % runner shifted with
      // transform on the compositor thread instead of background-position (a
      // repaint of the layer per frame). The host clips the runner, using the
      // same class as pan-loop.
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
