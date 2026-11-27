/**
 * The site's «Back to top» button (`site.layout.toTop`): toTopOf reads its settings, and renderToTop draws or updates the one button the page has.
 * Notes: docs/engine-notes/totop.md (Urd repository).
 */
import { t } from './i18n.js';
import { resolveColor } from './theme.js';
import { iconSvg, ICON_LIBRARY } from './icons.js';
import { isSafeImage } from './nav-model.js';

/** The designs, the first the standard: a circle, a rounded square, a pill with words, a ring and the words alone. */
export const TOTOP_DESIGNS = ['circle', 'square', 'pill', 'ring', 'words'];

/** The designs drawn in a shape: the owner's own (`shape`), or without one the design's own outline with the waves of `waves` and `count`. */
export const TOTOP_SHAPED = ['circle', 'square', 'ring'];

/** The designs that show words, which may be the owner's own. */
export const TOTOP_WORDED = ['pill', 'words'];

/** The sizes, the first the standard, as the button's height in px; the phone takes its own or the desktop's. */
export const TOTOP_SIZES = { m: 44, l: 56, xl: 68, xxl: 84 };

/** How the words alone answer the mouse, as the menu's links do, the standard first: the colour, an underline, a pill, a lift, or a lift with a glow. */
export const TOTOP_HOVERS = ['standard', 'underline', 'pill', 'liftPlain', 'lift'];

/** How the words alone answer a touch on a phone, as the menu's links do (nav.style.mobile.press); none is the standard. */
export const TOTOP_PRESSES = ['tint', 'underline', 'shrink'];

/** The line under the words alone, the second the standard. */
export const TOTOP_LINES = ['none', 'solid', 'dashed', 'dotted', 'double'];

/** The line's thickness in px. */
export const TOTOP_LINE_WIDTH = { min: 1, max: 4, step: 1, standard: 1 };

/** The colours the owner can set, each where the design shows it: the background, the ring, the arrow, the words, the line, and the hover's or the touch's effect. */
export const TOTOP_COLOURS = ['bg', 'ring', 'arrow', 'words', 'line', 'effect'];

/** How far the page is scrolled before the button shows: a little (400 px), one screen, or always. */
export const TOTOP_AFTER = ['little', 'screen', 'always'];

/** The waves slider (0 for a smooth edge) and how many waves the edge has. */
export const TOTOP_WAVES = { min: 0, max: 100, step: 1 };
export const TOTOP_COUNT = { min: 4, max: 16, step: 1, standard: 10 };

/** The longest words the button takes. */
export const TOTOP_TEXT_MAX = 40;

/** The longest character of its own the button takes in place of the arrow (an emoji of several code points included). */
export const TOTOP_GLYPH_MAX = 8;

/** The size of the arrow or the button's own mark, in percent of its size in the design. */
export const TOTOP_ICON_SIZE = { min: 50, max: 200, step: 5, standard: 100 };

/** How a picture of the owner's own fills a shaped design, the first the standard: inside the button's edge, at the mark's size, or the whole button. */
export const TOTOP_FILLS = ['edge', 'whole'];

const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
const colourOf = (value) => (typeof value === 'string' && value.trim() ? value.trim() : null);

/**
 * The button's settings as they apply, each read from `site.layout.toTop` or its standard.
 * @param {object|null|undefined} site site.json
 * @param {typeof import('./shape-model.js')|null} [shapes] The shape model, which reads the owner's own shape; without it the design's own outline stands
 * @returns {{show: boolean, design: string, place: 'corner'|'content', side: 'left'|'right', size: string, phoneSize: string|null, colors: Record<string, string|null>, after: string, phone: boolean, text: string, waves: number, count: number, hover: string, press: string|null, line: string, lineWidth: number, glyph: string, icon: string|null, image: string|null, iconSize: number, fill: string, over: {icon: string|null, glyph: string}|null, shape: ReturnType<typeof import('./shape-model.js').shapeOf>|null}}
 */
export function toTopOf(site, shapes = null) {
  const raw = site?.layout?.toTop && typeof site.layout.toTop === 'object' ? site.layout.toTop : {};
  const waves = Number(raw.waves);
  // An emptied amount reads as the standard, not as the fewest waves.
  const count = raw.count == null || raw.count === '' ? NaN : Math.round(Number(raw.count));
  const lineWidth = Math.round(Number(raw.lineWidth));
  const iconSize = Math.round(Number(raw.iconSize) / TOTOP_ICON_SIZE.step) * TOTOP_ICON_SIZE.step;
  return {
    show: raw.show !== false,
    design: TOTOP_DESIGNS.includes(raw.design) ? raw.design : TOTOP_DESIGNS[0],
    place: raw.place === 'content' ? 'content' : 'corner',
    side: raw.side === 'left' ? 'left' : 'right',
    size: Object.hasOwn(TOTOP_SIZES, raw.size) ? raw.size : 'm',
    phoneSize: Object.hasOwn(TOTOP_SIZES, raw.phoneSize) ? raw.phoneSize : null,
    colors: Object.fromEntries(TOTOP_COLOURS.map((key) => [key, colourOf(raw.colors?.[key])])),
    after: TOTOP_AFTER.includes(raw.after) ? raw.after : TOTOP_AFTER[0],
    phone: raw.phone !== false,
    text: typeof raw.text === 'string' ? raw.text.trim().slice(0, TOTOP_TEXT_MAX) : '',
    waves: Number.isFinite(waves) ? clamp(Math.round(waves), TOTOP_WAVES.min, TOTOP_WAVES.max) : 0,
    count: Number.isFinite(count) ? clamp(count, TOTOP_COUNT.min, TOTOP_COUNT.max) : TOTOP_COUNT.standard,
    hover: TOTOP_HOVERS.includes(raw.hover) ? raw.hover : TOTOP_HOVERS[0],
    press: TOTOP_PRESSES.includes(raw.press) ? raw.press : null,
    line: TOTOP_LINES.includes(raw.line) ? raw.line : 'solid',
    lineWidth: Number.isFinite(lineWidth) ? clamp(lineWidth, TOTOP_LINE_WIDTH.min, TOTOP_LINE_WIDTH.max) : TOTOP_LINE_WIDTH.standard,
    glyph: typeof raw.glyph === 'string' ? [...raw.glyph.trim()].slice(0, TOTOP_GLYPH_MAX).join('') : '',
    icon: typeof raw.icon === 'string' && Object.hasOwn(ICON_LIBRARY, raw.icon) ? raw.icon : null,
    image: isSafeImage(raw.image) ? raw.image : null,
    iconSize: raw.iconSize != null && raw.iconSize !== '' && Number.isFinite(iconSize) ? clamp(iconSize, TOTOP_ICON_SIZE.min, TOTOP_ICON_SIZE.max) : TOTOP_ICON_SIZE.standard,
    fill: TOTOP_FILLS.includes(raw.fill) ? raw.fill : TOTOP_FILLS[0],
    over: raw.over && typeof raw.over === 'object' && !Array.isArray(raw.over) ? {
      icon: typeof raw.over.icon === 'string' && Object.hasOwn(ICON_LIBRARY, raw.over.icon) ? raw.over.icon : null,
      glyph: typeof raw.over.glyph === 'string' ? [...raw.over.glyph.trim()].slice(0, TOTOP_GLYPH_MAX).join('') : '',
    } : null,
    shape: shapes && raw.shape && typeof raw.shape === 'object' && !Array.isArray(raw.shape) ? shapes.shapeOf(raw.shape) : null,
  };
}

/**
 * The shape a shaped design shows, as a shape's values: the owner's own, or else the nearest to the design's own outline with its waves.
 * @param {ReturnType<typeof toTopOf>} set
 * @param {typeof import('./shape-model.js')} shapes The shape model
 * @returns {ReturnType<typeof import('./shape-model.js').shapeOf>}
 */
export function toTopShapeOf(set, shapes) {
  if (set.shape) return set.shape;
  const share = set.waves / 100;
  const waves = share ? { waves: Math.round(68 * share ** 0.8), count: set.count, sharp: Math.round(100 * share * share) } : {};
  return shapes.shapeOf(set.design === 'square' ? (share ? { square: 33, ...waves } : { sides: 4, corners: 55, turn: 45 }) : waves);
}

/** How far inside the box the ring's outline stands, so its line is drawn whole. */
const RING_MARGIN = 4;

/**
 * A shaped design's outline as an SVG path in the 100 by 100 box, and where its mark stands: the owner's shape, else the design's; `whole` widens the ring's.
 * @param {ReturnType<typeof toTopOf>} set
 * @param {boolean} [whole]
 * @param {typeof import('./shape-model.js')|null} [shapes] The shape model, which draws the owner's own shape
 * @returns {{d: string, mark: [number, number]}}
 */
export function toTopOutline(set, whole = false, shapes = null) {
  const ring = set.design === 'ring' && !whole;
  if (!set.shape || !shapes) return { d: toTopShape(ring || set.design !== 'ring' ? set.design : 'circle', set.waves, set.count), mark: [50, 50] };
  const pts = shapes.shapeOutline(set.shape, ring ? RING_MARGIN : 0);
  return { d: shapes.outlinePath(pts), mark: set.shape.icon ?? shapes.outlineMiddle(pts) };
}

/**
 * Whether the button's own picture covers the whole of a shaped design.
 * @param {ReturnType<typeof toTopOf>} set
 * @returns {boolean}
 */
export function toTopFillsWhole(set) {
  return TOTOP_SHAPED.includes(set.design) && Boolean(set.image) && set.fill === 'whole';
}

/**
 * The outline a shaped design's mark is cut to, as a CSS image in a 100 by 100 box, the whole button's under a picture filling it; null for the pill and words.
 * @param {ReturnType<typeof toTopOf>} set
 * @param {typeof import('./shape-model.js')|null} [shapes] The shape model, which draws the owner's own shape
 * @returns {string|null}
 */
export function toTopClip(set, shapes = null) {
  if (!TOTOP_SHAPED.includes(set.design)) return null;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="${toTopOutline(set, toTopFillsWhole(set), shapes).d}"/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

/**
 * The button's mark: its own picture, drawn icon or character, or the arrow; a picture that fails to load gives way to what would stand without it.
 * @param {ReturnType<typeof toTopOf>} set
 * @returns {HTMLElement}
 */
function markOf(set) {
  const mark = document.createElement('span');
  mark.className = 'urd-totop-mark';
  if (set.image) {
    const img = document.createElement('img');
    img.alt = '';
    img.decoding = 'async';
    img.addEventListener('error', () => {
      mark.closest('.urd-totop')?.classList.remove('urd-totop-whole');
      mark.parentElement?.querySelector(':scope > .urd-totop-over')?.remove();
      mark.replaceWith(markOf({ ...set, image: null }));
    }, { once: true });
    img.src = set.image;
    mark.classList.add('urd-totop-own');
    mark.appendChild(img);
  } else if (set.icon) {
    mark.innerHTML = iconSvg(set.icon);
  } else if (set.glyph) {
    // The button is named by its words or its label, never by the character's own name.
    mark.classList.add('urd-totop-glyph');
    mark.setAttribute('aria-hidden', 'true');
    mark.textContent = set.glyph;
  } else {
    mark.innerHTML = ARROW;
  }
  return mark;
}

/**
 * A shaped design's outline as an SVG path in a 100 by 100 box: a circle or rounded square, its edge turned into `count` waves by `waves` (0 to 100).
 * @param {string} design 'circle', 'square' or 'ring'
 * @param {number} [waves]
 * @param {number} [count]
 * @returns {string}
 */
export function toTopShape(design, waves = 0, count = TOTOP_COUNT.standard) {
  const square = design === 'square';
  const share = clamp(Number(waves) || 0, TOTOP_WAVES.min, TOTOP_WAVES.max) / TOTOP_WAVES.max;
  const n = clamp(Math.round(Number(count) || TOTOP_COUNT.standard), TOTOP_COUNT.min, TOTOP_COUNT.max);
  const R = design === 'ring' ? 46 : 50;
  if (share === 0) {
    if (square) return 'M 24 0 H 76 A 24 24 0 0 1 100 24 V 76 A 24 24 0 0 1 76 100 H 24 A 24 24 0 0 1 0 76 V 24 A 24 24 0 0 1 24 0 Z';
    return `M 50 ${50 - R} A ${R} ${R} 0 1 1 50 ${50 + R} A ${R} ${R} 0 1 1 50 ${50 - R} Z`;
  }
  // The depth of the waves, and how narrow their crests are: a crest's share of the edge falls as the slider goes on.
  const depth = 0.34 * share ** 0.8;
  const sharp = 1 + 7 * share * share;
  const steps = 48 * n;
  const points = [];
  for (let i = 0; i < steps; i++) {
    const a = (i / steps) * Math.PI * 2;
    const base = square ? 1 / (Math.abs(Math.cos(a)) ** 4 + Math.abs(Math.sin(a)) ** 4) ** 0.25 : 1;
    const crest = ((1 + Math.cos(n * a)) / 2) ** sharp;
    const r = R * base * (1 - depth * (1 - crest));
    // A crest at the top: the angle is measured from straight up.
    const x = 50 + r * Math.sin(a);
    const y = 50 - r * Math.cos(a);
    points.push(`${x.toFixed(2)} ${y.toFixed(2)}`);
  }
  return `M ${points.join(' L ')} Z`;
}

/** The arrow the button shows in place of an icon of its own. */
const ARROW = '<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';

/** The one button the page has, and what stops its scroll listener when the page is drawn anew without it. */
let button = null;
let listening = null;

/**
 * Draws the page's «Back to top» button, or updates the one standing, as `site.layout.toTop` sets it; none where it is turned off.
 * @param {object} site site.json
 * @param {HTMLElement} [host] Where the button stands (the page's body)
 */
export function renderToTop(site, host = document.body, shapes = null) {
  const set = toTopOf(site, shapes);
  if (!set.show) {
    button?.remove();
    button = null;
    listening?.abort();
    listening = null;
    return;
  }
  if (!button || !button.isConnected) {
    button = document.createElement('button');
    button.type = 'button';
    button.addEventListener('click', () => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    });
    host.appendChild(button);
  }
  const shaped = TOTOP_SHAPED.includes(set.design);
  const worded = TOTOP_WORDED.includes(set.design);
  // The words alone answer the mouse and a touch as the menu's links do, and stand on a line of their own.
  const words = set.design === 'words';
  button.className = [
    'urd-totop', `urd-totop-${set.design}`,
    set.side === 'left' ? 'urd-totop-left' : '',
    set.place === 'content' ? 'urd-totop-content' : '',
    set.phone ? '' : 'urd-totop-nophone',
    words ? `urd-totop-hover-${set.hover}` : '',
    words && set.press ? `urd-totop-press-${set.press}` : '',
    words ? `urd-totop-line-${set.line}` : '',
    toTopFillsWhole(set) ? 'urd-totop-whole' : '',
  ].filter(Boolean).join(' ');
  button.style.setProperty('--urd-totop-h', `${TOTOP_SIZES[set.size]}px`);
  if (set.phoneSize) button.style.setProperty('--urd-totop-h-phone', `${TOTOP_SIZES[set.phoneSize]}px`);
  else button.style.removeProperty('--urd-totop-h-phone');
  button.style.setProperty('--urd-totop-line-w', `${set.lineWidth}px`);
  if (set.iconSize !== TOTOP_ICON_SIZE.standard) button.style.setProperty('--urd-totop-mark-scale', String(set.iconSize / 100));
  else button.style.removeProperty('--urd-totop-mark-scale');
  const clip = toTopClip(set, shapes);
  if (clip) button.style.setProperty('--urd-totop-clip', clip);
  else button.style.removeProperty('--urd-totop-clip');
  // The mark stands at the shape's own middle, or where the owner put it, as a share of the button from its middle.
  const outline = TOTOP_SHAPED.includes(set.design) ? toTopOutline(set, false, shapes) : null;
  for (const [name, at] of [['x', outline?.mark[0]], ['y', outline?.mark[1]]]) {
    if (outline && Math.abs(at - 50) > 0.05) button.style.setProperty(`--urd-totop-mark-${name}`, `${(at - 50).toFixed(1)}%`);
    else button.style.removeProperty(`--urd-totop-mark-${name}`);
  }
  for (const key of TOTOP_COLOURS) {
    if (set.colors[key]) button.style.setProperty(`--urd-totop-${key}`, resolveColor(set.colors[key]));
    else button.style.removeProperty(`--urd-totop-${key}`);
  }
  // The words a visitor reads are the button's name, so a screen reader says what the eye sees; a button of no words is named in full.
  const shownWords = set.text || t('nav.toTop');
  if (worded) {
    button.removeAttribute('aria-label');
    button.removeAttribute('title');
  } else {
    button.setAttribute('aria-label', t('nav.toTopFull'));
    button.title = t('nav.toTop');
  }
  const shape = shaped ? `<svg class="urd-totop-shape" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path d="${outline.d}"/></svg>` : '';
  // The mark and the words stand in a label of their own, which the line under the words alone runs along, whatever the hover does to the button.
  button.innerHTML = `${shape}<span class="urd-totop-label"></span>`;
  const label = button.querySelector('.urd-totop-label');
  label.appendChild(markOf(set));
  // A mark over a picture that fills the whole button: the arrow, or a drawn icon or a character in its place.
  if (toTopFillsWhole(set) && set.over) {
    const over = markOf({ ...set, image: null, icon: set.over.icon, glyph: set.over.glyph });
    over.classList.add('urd-totop-over');
    label.appendChild(over);
  }
  if (worded) {
    const span = document.createElement('span');
    span.className = 'urd-totop-text';
    span.textContent = shownWords;
    label.appendChild(span);
  }
  // Shown after the scrolling chosen: a little, one screen, or at once.
  listening?.abort();
  listening = new AbortController();
  const shown = () => {
    if (set.after === 'always') {
      button?.classList.add('visible');
      return;
    }
    const past = set.after === 'screen' ? window.innerHeight : 400;
    button?.classList.toggle('visible', window.scrollY > past);
  };
  window.addEventListener('scroll', shown, { passive: true, signal: listening.signal });
  window.addEventListener('resize', shown, { passive: true, signal: listening.signal });
  // The first look waits for the next frame, so the scroll position is read once the page is laid out, not while it is being drawn.
  requestAnimationFrame(shown);
}
