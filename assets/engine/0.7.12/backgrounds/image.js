/**
 * Background layer: an image from media/ (or a draft's data URL), placed and sized by CSS on an inner element, with a finish, parallax, bleed and motion.
 * Notes: docs/engine-notes/backgrounds/image.md (Urd repository).
 */

import { isSafeImage } from '../nav-model.js';
import { pictureStyle, pictureFilter, placeholderPhoto } from '../picture.js';

/** Maximum vertical travel of a parallax layer at full strength, as a fraction of the viewport height. */
const MAX_SHIFT = 0.4;

/** How the layer moves on its own, beside the parallax. */
export const BG_MOTIONS = ['none', 'kenburns', 'drift'];

/** Seconds for one cycle of that motion. */
export const BG_MOTION_TIME = { min: 6, max: 60, dflt: 20 };

/**
 * The motion, with stillness for anything unknown, so an unusable value can never become a class name.
 * Pure function (node-tested).
 * @param {unknown} motion
 * @returns {'none'|'kenburns'|'drift'}
 */
export function bgMotion(motion) {
  return BG_MOTIONS.includes(motion) ? motion : 'none';
}

/**
 * Seconds for one cycle, inside the bounds. Pure function (node-tested).
 * @param {unknown} seconds
 * @returns {number}
 */
export function normalizeMotionSpeed(seconds) {
  const { min, max, dflt } = BG_MOTION_TIME;
  const n = Number(seconds);
  if (!Number.isFinite(n) || n <= 0) return dflt;
  return Math.min(max, Math.max(min, n));
}

/**
 * The background-position string for a focal point (0.5/0.5 = centered).
 * Pure function (node-tested).
 * Same mapping as the image gallery layer.
 * @param {number} x Focal point, horizontal 0..1
 * @param {number} y Focal point, vertical 0..1
 * @returns {string}
 */
export function bgPosition(x, y) {
  return `${(x ?? 0.5) * 100}% ${(y ?? 0.5) * 100}%`;
}

/**
 * The background-size value: a width-relative scale for the free-placement fits, `cover` and `contain` as keywords. Pure function (node-tested).
 * @param {'plain'|'tile'|'cover'|'contain'|'custom'|'repeat'} fit
 * @param {number} [size] Scale as a fraction (1 = 100% of the section width)
 * @returns {string}
 */
export function bgSize(fit, size) {
  if (fit === 'contain') return 'contain';
  if (fit === 'cover') return 'cover';
  // plain / tile / custom / repeat / other -> width-relative scale
  return `${Math.max(0, size ?? 1) * 100}%`;
}

/**
 * clip-path for a layer from the bleed direction: the sides always clipped, top or bottom open on the bleed side. Pure function (node-tested).
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
 * Vertical overscan (px) for a parallax layer: the travel it needs at its strength, capped against the section height. Pure function (node-tested).
 * @param {number} sectionH The section height
 * @param {number} viewportH Viewport height
 * @param {number} speed Strength 0..1
 * @returns {number}
 */
export function parallaxPad(sectionH, viewportH, speed, capFrac = 0.18) {
  const travel = Math.max(0, Math.min(1, speed)) * MAX_SHIFT * viewportH;
  return Math.round(Math.min(travel, capFrac * sectionH));
}

/**
 * translateY (px) for a parallax layer: the section center against the viewport center, times the strength, clamped to the overscan. Pure (node-tested).
 * @param {number} rectTop The section top in viewport coordinates
 * @param {number} sectionH The section height
 * @param {number} viewportH Viewport height
 * @param {number} speed Strength 0..1
 * @param {number} pad Overscan in px (the limit for the shift)
 * @returns {number}
 */
export function parallaxOffset(rectTop, sectionH, viewportH, speed, pad) {
  const sectionMid = rectTop + sectionH / 2;
  const raw = (viewportH / 2 - sectionMid) * Math.max(0, Math.min(1, speed)) * MAX_SHIFT;
  const lim = pad ?? parallaxPad(sectionH, viewportH, speed);
  // `|| 0` normalizes -0 to +0.
  return Math.max(-lim, Math.min(lim, raw)) || 0;
}

// Active parallax layers, shifted via rAF by one module-level scroll and resize listener; a detached layer is dropped when apply returns false.
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
 * Attaches rAF-driven parallax to the image element via `translateY`, overscanning the fill modes; it stands still on mobile and with reduced motion.
 * @param {HTMLElement} img The image element
 * @param {number} speed Strength 0..1
 * @param {number} blurMargin The blur fringe in px (0 without blur)
 * @param {'plain'|'tile'|'cover'|'custom'|'contain'|'repeat'} fit
 */
function mountParallax(img, speed, blurMargin, fit) {
  const fills = fit === 'cover' || fit === 'tile' || fit === 'repeat';
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
    // `limit` clamps the movement (dy).
    // Fill modes have a tight cap (the overscan = inverse zoom); the free model can move much further (no overscan).
    const limit = parallaxPad(rect.height, vh, speed, fills ? 0.18 : 0.6);
    setInset(fills ? Math.max(blurMargin, limit) : blurMargin);
    const dy = parallaxOffset(rect.top, rect.height, vh, speed, limit);
    img.style.transform = `translateY(${dy.toFixed(1)}px)`;
    return true;
  };
  registerParallax(apply);
  // Applies again once the layer is in the DOM and measurable, since the first apply runs before the section has a size.
  if (typeof requestAnimationFrame === 'function') {
    requestAnimationFrame(() => requestAnimationFrame(apply));
  }
}

/**
 * Whether the browser supports scroll-driven animations, so CSS (`animation-timeline: view()`) drives the parallax instead of the rAF fallback.
 */
function supportsScrollTimeline() {
  return typeof CSS !== 'undefined' && typeof CSS.supports === 'function'
    && CSS.supports('animation-timeline', 'view()');
}

// CSS parallax: the travel and overscan are measured once and on resize, never on scroll; a detached layer is dropped when its measure returns false.
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
 * Attaches CSS parallax: the travel and overscan measured here, the shift scrubbed by `animation-timeline: view()`; still on mobile and with reduced motion.
 * @param {HTMLElement} img The image element
 * @param {number} speed Strength 0..1
 * @param {number} blurMargin The blur fringe in px (0 without blur)
 * @param {'plain'|'tile'|'cover'|'custom'|'contain'|'repeat'} fit
 */
function mountParallaxCss(img, speed, blurMargin, fit) {
  const fills = fit === 'cover' || fit === 'tile' || fit === 'repeat';
  const section = img.closest('.urd-section') ?? img.parentElement?.closest('.urd-section') ?? img.parentElement;
  img.style.willChange = 'transform';
  img.classList.add('urd-parallax-css');
  const measure = () => {
    if (!img.isConnected) return false;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const still = reduce || document.body.classList.contains('urd-mobile');
    const rect = (section ?? img).getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    // Travel = parallaxPad (fill: tight cap; free: large cap).
    // Overscan only in fill mode when the layer actually moves; otherwise the blur fringe is enough.
    const shift = parallaxPad(rect.height, vh, speed, fills ? 0.18 : 0.6);
    const inset = (fills && !still) ? Math.max(blurMargin, shift) : blurMargin;
    img.style.setProperty('--urd-px-shift', `${shift}px`);
    img.style.top = `-${inset}px`;
    img.style.bottom = `-${inset}px`;
    return true;
  };
  registerMeasure(measure);
  // Same reason as mountParallax: the layer is put in the DOM after render(), so the first measurement must happen when the section is actually measurable.
  if (typeof requestAnimationFrame === 'function') {
    requestAnimationFrame(() => requestAnimationFrame(measure));
  }
}

export const imageLayer = {
  version: 3,
  label: 'Image',
  labelKey: 'bgLayer.image',
  // Its picture can wait until its section comes near (renderBackgroundLayers).
  pictures: true,
  defaults: () => ({
    src: '', fit: 'plain', x: 0.5, y: 0.5, size: 1, opacity: 1, blur: 0,
    parallax: 0, bleed: 'none', motion: 'none', motionSpeed: BG_MOTION_TIME.dflt,
  }),
  migrations: {
    // 1 -> 2 (ADR-0021): Norwegian fit values renamed to English.
    1: (props) => ({
      ...props,
      fit: props.fit === 'vanlig' ? 'plain' : props.fit === 'flislegg' ? 'tile' : props.fit === 'egen' ? 'custom' : props.fit,
    }),
    // 2 -> 3: motion of its own beside the parallax; the defaults stand first and the stored props last, so a motion already chosen is kept.
    2: (props) => ({ motion: 'none', motionSpeed: BG_MOTION_TIME.dflt, ...props }),
  },
  /**
   * @param {HTMLElement} el
   * @param {{src: string, fit?: 'plain'|'tile'|'cover'|'custom'|'contain'|'repeat', x?: number, y?: number, size?: number, opacity?: number, blur?: number, parallax?: number, bleed?: 'none'|'up'|'down'|'both', motion?: 'none'|'kenburns'|'drift', motionSpeed?: number}} props
   * @param {{first?: boolean}} [options] `first`: the layer stands in the page's first section (renderBackgroundLayers)
   */
  render(el, props, options) {
    // The source passes the shared isSafeImage guard before CSS url(); with no picture yet, a drawn example shows in the editor alone.
    const demo = !isSafeImage(props.src);
    if (demo) el.classList.add('urd-bg-demo');
    const src = demo ? placeholderPhoto(0) : props.src;
    el.style.opacity = String(props.opacity ?? 1);
    // Clipping: a directional clip-path driven by bleed (inset(0) = clip to the section).
    el.style.clipPath = bleedClip(props.bleed);
    // Bleed down or both lifts the layer to z-index 1, so it paints over the next section's background but under its content.
    el.style.zIndex = (props.bleed === 'down' || props.bleed === 'both') ? '1' : '';

    const img = document.createElement('div');
    img.className = 'urd-bg-image';
    img.style.position = 'absolute';
    img.style.left = '0';
    img.style.right = '0';
    img.style.top = '0';
    img.style.bottom = '0';
    // Motion and parallax both drive `transform`, so a moving layer paints on an element of its own inside the parallax carrier.
    const motion = bgMotion(props.motion);
    const paint = motion === 'none' ? img : document.createElement('div');
    if (paint !== img) {
      paint.className = `urd-bg-motion urd-bg-motion-${motion}`;
      paint.style.position = 'absolute';
      paint.style.left = '0';
      paint.style.right = '0';
      paint.style.top = '0';
      paint.style.bottom = '0';
      paint.style.animationDuration = `${normalizeMotionSpeed(props.motionSpeed)}s`;
      img.appendChild(paint);
    }
    const tile = props.fit === 'tile' || props.fit === 'repeat';
    paint.style.backgroundImage = `url("${src}")`;
    paint.style.backgroundSize = bgSize(props.fit, props.size);
    paint.style.backgroundRepeat = tile ? 'repeat' : 'no-repeat';
    // Placement via background-position: 0 and 100 % are flush with the edges, and x or y past 0..1 puts the subject partly outside.
    paint.style.backgroundPosition = bgPosition(props.x, props.y);
    // The finish (a look and the adjustments) and the blur go in one filter; with blur the image is stretched a touch past the clipped edge.
    const finish = pictureFilter(pictureStyle({ look: props.look, brightness: props.brightness, contrast: props.contrast, saturate: props.saturate, blur: props.blur }));
    if (finish) paint.style.filter = finish;
    let blurMargin = 0;
    if (props.blur > 0) {
      blurMargin = Math.ceil(props.blur);
      paint.style.left = `-${blurMargin}px`;
      paint.style.right = `-${blurMargin}px`;
      paint.style.top = `-${blurMargin}px`;
      paint.style.bottom = `-${blurMargin}px`;
    }

    // The layer stays invisible until the image has loaded; in a page's first section the probe asks for the picture ahead of the rest.
    const probe = new Image();
    if (options?.first) probe.setAttribute('fetchpriority', 'high');
    probe.src = src;
    if (!probe.complete) {
      el.style.visibility = 'hidden';
      const show = () => { el.style.visibility = ''; };
      probe.addEventListener('load', show, { once: true });
      probe.addEventListener('error', show, { once: true });
    }

    el.appendChild(img);
    // Parallax: the layer lags behind on scroll.
    if (props.parallax > 0) mountLayerParallax(img, props.parallax, paint === img ? blurMargin : 0, props.fit ?? 'cover');
  },
};

/**
 * Hooks parallax onto an image or video layer: scroll-driven CSS where the browser has it, else the rAF-driven fallback.
 * @param {HTMLElement} el The layer element
 * @param {number} speed Strength 0..1
 * @param {number} blurMargin The blur fringe in px (0 without blur)
 * @param {'plain'|'tile'|'cover'|'custom'|'contain'|'repeat'} fit
 */
export function mountLayerParallax(el, speed, blurMargin, fit) {
  if (supportsScrollTimeline()) mountParallaxCss(el, speed, blurMargin, fit);
  else mountParallax(el, speed, blurMargin, fit);
}
