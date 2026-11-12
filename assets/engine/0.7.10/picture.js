/**
 * One drawing for every picture (0.7.29.1): the settings the image editor
 * writes, drawn the same wherever a picture stands (the image block, the
 * gallery's pictures, collection and product cards, the video's cover and
 * the lightbox). Every setting is drawn by the page and never changes the
 * file, and an absent setting is neutral, so a picture stored before the
 * settings existed draws as it always has.
 *
 * The settings: the focus point (`x`, `y`, 0..1) and `zoom` (1..4) towards
 * it; the turn: `rotate` in quarter turns, `flipX` and `flipY`, `straighten`
 * (degrees, -15..15); the `look`, one of the slideshow layer's tones;
 * `brightness`, `contrast` and `saturate` (0..2) and `blur` (px, 0..20); and
 * an `overlay` in a site colour (`{ color, strength }`); and with the duotone
 * look, its two colours (`duotone: { dark, light }`).
 */
import { GALLERY_TONES } from './gallery-layout.js';
import { resolveColor } from './theme.js';

/** The looks a picture can have: the slideshow layer's tones, `natural` the picture as it is. */
export const PICTURE_LOOKS = GALLERY_TONES;

/**
 * Each look as a CSS filter, the same values base.css gives the slideshow's
 * tones (`.urd-gallery-tone-*`, a test holds the two equal). Duotone and
 * vintage add a layer over the picture as well (`.urd-pic-look-*` in base.css).
 */
export const LOOK_FILTERS = {
  natural: '',
  mono: 'grayscale(1)',
  sepia: 'sepia(0.8)',
  vintage: 'sepia(0.45) contrast(1.05) saturate(0.9)',
  faded: 'contrast(0.85) saturate(0.75) brightness(1.08)',
  warm: 'sepia(0.3) saturate(1.25)',
  cool: 'saturate(0.9) hue-rotate(-14deg) contrast(1.05)',
  duotone: 'grayscale(1) contrast(1.1)',
  punchy: 'contrast(1.25) saturate(1.25)',
  noir: 'grayscale(1) contrast(1.45) brightness(0.9)',
  dim: 'brightness(0.55)',
  pop: 'saturate(1.9) contrast(1.1)',
};

/** The looks that lay a layer over the picture beside their filter. */
const LAYERED_LOOKS = new Set(['vintage']);

/** The duotone's colours when none are chosen: the shadows black, the highlights in the accent. */
export const DUOTONE_DEFAULT = Object.freeze({ dark: '#000000', light: 'accent' });

/** The bounds of each setting, which the editor's controls share. */
export const PICTURE_BOUNDS = {
  zoom: { min: 1, max: 4 },
  straighten: { min: -15, max: 15 },
  brightness: { min: 0, max: 2 },
  contrast: { min: 0, max: 2 },
  saturate: { min: 0, max: 2 },
  blur: { min: 0, max: 20 },
};

/** A site colour token or a hex colour: what an overlay may be drawn in. */
const OVERLAY_COLOR_RE = /^(?:[a-z][a-z0-9-]*|#[0-9a-f]{3}|#[0-9a-f]{6})$/i;

const within = (value, min, max, fallback) => {
  const n = Number(value);
  return value != null && value !== '' && Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback;
};

/**
 * A picture's settings as the drawing reads them: each one within its bounds,
 * an absent or broken one neutral. Pure.
 * @param {object} [raw] The stored settings (an image block's props, a gallery picture's `style`, an entry's `imageStyle`, a video's `coverStyle`)
 * @returns {{x: number, y: number, zoom: number, rotate: 0|90|180|270, flipX: boolean, flipY: boolean, straighten: number, look: string, brightness: number, contrast: number, saturate: number, blur: number, overlay: {color: string, strength: number}|null, duotone: {dark: string, light: string}}}
 */
export function pictureStyle(raw) {
  const s = raw && typeof raw === 'object' ? raw : {};
  const quarter = Number(s.rotate);
  const overlay = s.overlay && typeof s.overlay === 'object' && typeof s.overlay.color === 'string' && OVERLAY_COLOR_RE.test(s.overlay.color)
    ? { color: s.overlay.color, strength: within(s.overlay.strength, 0, 1, 0.35) }
    : null;
  return {
    x: within(s.x, 0, 1, 0.5),
    y: within(s.y, 0, 1, 0.5),
    zoom: within(s.zoom, PICTURE_BOUNDS.zoom.min, PICTURE_BOUNDS.zoom.max, 1),
    rotate: [90, 180, 270].includes(quarter) ? quarter : 0,
    flipX: s.flipX === true,
    flipY: s.flipY === true,
    straighten: within(s.straighten, PICTURE_BOUNDS.straighten.min, PICTURE_BOUNDS.straighten.max, 0),
    look: PICTURE_LOOKS.includes(s.look) ? s.look : 'natural',
    brightness: within(s.brightness, 0, 2, 1),
    contrast: within(s.contrast, 0, 2, 1),
    saturate: within(s.saturate, 0, 2, 1),
    blur: within(s.blur, 0, 20, 0),
    overlay: overlay && overlay.strength > 0 ? overlay : null,
    duotone: {
      dark: typeof s.duotone?.dark === 'string' && OVERLAY_COLOR_RE.test(s.duotone.dark) ? s.duotone.dark : DUOTONE_DEFAULT.dark,
      light: typeof s.duotone?.light === 'string' && OVERLAY_COLOR_RE.test(s.duotone.light) ? s.duotone.light : DUOTONE_DEFAULT.light,
    },
  };
}

/**
 * The CSS filter for a picture: its look first, then the adjustments in the
 * order they have always been written, then the blur. `dim` darkens on top
 * (the video's cover draws its picture at 0.7 so the words on it read).
 * A duotone given its gradient map (`duotone`, duotoneFilterUrl) maps the
 * adjusted picture's light to its two colours before the blur; without one
 * it falls back to the grey of its look. Pure.
 * @param {ReturnType<typeof pictureStyle>} style
 * @param {{dim?: number, duotone?: string}} [options]
 * @returns {string}
 */
export function pictureFilter(style, { dim = 1, duotone = '' } = {}) {
  const brightness = Math.round(style.brightness * dim * 1000) / 1000;
  const mapped = style.look === 'duotone' && duotone;
  return [
    mapped ? '' : LOOK_FILTERS[style.look] ?? '',
    brightness !== 1 ? `brightness(${brightness})` : '',
    style.contrast !== 1 ? `contrast(${style.contrast})` : '',
    style.saturate !== 1 ? `saturate(${style.saturate})` : '',
    mapped ? duotone : '',
    style.blur > 0 ? `blur(${style.blur}px)` : '',
  ].filter(Boolean).join(' ');
}

/**
 * A colour as its red, green and blue (0..255): a hex colour or the
 * `rgb()` a browser computes. Null for anything else. Pure.
 * @param {string} value
 * @returns {[number, number, number]|null}
 */
export function parseColor(value) {
  const text = String(value ?? '').trim().toLowerCase();
  const hex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/.exec(text);
  if (hex) {
    const h = hex[1].length === 3 ? [...hex[1]].map((c) => c + c).join('') : hex[1];
    return [0, 2, 4].map((i) => Number.parseInt(h.slice(i, i + 2), 16));
  }
  const rgb = /^rgba?\(\s*(\d+(?:\.\d+)?)[\s,]+(\d+(?:\.\d+)?)[\s,]+(\d+(?:\.\d+)?)/.exec(text);
  return rgb ? [rgb[1], rgb[2], rgb[3]].map((n) => Math.round(Math.min(255, Number(n)))) : null;
}

/**
 * A duotone's gradient map as the three channels' tables: each channel runs
 * from the dark colour's value at black to the light colour's at white,
 * whichever is the lighter, so any pair maps the picture's light between
 * them. Pure.
 * @param {[number, number, number]} dark
 * @param {[number, number, number]} light
 * @returns {[string, string, string]} The red, green and blue tableValues
 */
export function duotoneTables(dark, light) {
  const unit = (v) => Math.round((v / 255) * 1000) / 1000;
  return [0, 1, 2].map((i) => `${unit(dark[i])} ${unit(light[i])}`);
}

const SVG_NS = 'http://www.w3.org/2000/svg';

/**
 * The duotone's SVG filter for a pair of colours, made once per document in
 * a hidden `#urd-duotones` and shared by every picture with that pair: the
 * picture's light (its luminance) mapped from the dark colour to the light
 * one. Returns the CSS `url()` that draws it.
 * @param {[number, number, number]} dark
 * @param {[number, number, number]} light
 * @param {Document} [doc]
 * @returns {string}
 */
export function duotoneFilterUrl(dark, light, doc = document) {
  const id = `urd-duo-${dark.join('-')}-${light.join('-')}`;
  if (!doc.getElementById(id)) {
    let host = doc.getElementById('urd-duotones');
    if (!host) {
      host = doc.createElementNS(SVG_NS, 'svg');
      host.id = 'urd-duotones';
      host.setAttribute('aria-hidden', 'true');
      host.setAttribute('focusable', 'false');
      host.setAttribute('width', '0');
      host.setAttribute('height', '0');
      host.style.position = 'absolute';
      doc.body.appendChild(host);
    }
    const filter = doc.createElementNS(SVG_NS, 'filter');
    filter.id = id;
    filter.setAttribute('color-interpolation-filters', 'sRGB');
    const luminance = doc.createElementNS(SVG_NS, 'feColorMatrix');
    luminance.setAttribute('type', 'matrix');
    luminance.setAttribute('values', '0.2126 0.7152 0.0722 0 0 0.2126 0.7152 0.0722 0 0 0.2126 0.7152 0.0722 0 0 0 0 0 1 0');
    const ramp = doc.createElementNS(SVG_NS, 'feComponentTransfer');
    const tables = duotoneTables(dark, light);
    for (const [i, channel] of ['feFuncR', 'feFuncG', 'feFuncB'].entries()) {
      const fn = doc.createElementNS(SVG_NS, channel);
      fn.setAttribute('type', 'table');
      fn.setAttribute('tableValues', tables[i]);
      ramp.appendChild(fn);
    }
    filter.append(luminance, ramp);
    host.appendChild(filter);
  }
  return `url(#${id})`;
}

/**
 * A duotone colour as its red, green and blue where it is drawn: a hex
 * colour as it is, a site colour as the place computes it (a section with
 * its own colours, the light or dark mode).
 * @param {string} value
 * @param {Element} near Where the colour is drawn
 */
function colorAt(value, near) {
  const direct = parseColor(value);
  if (direct) return direct;
  const doc = near.ownerDocument;
  const probe = doc.createElement('span');
  probe.style.display = 'none';
  probe.style.color = resolveColor(value);
  near.appendChild(probe);
  const computed = doc.defaultView.getComputedStyle(probe).color;
  probe.remove();
  return parseColor(computed);
}

/**
 * The CSS url of a picture's duotone where it is drawn, or '' for another look or colours that cannot be read.
 * @param {ReturnType<typeof pictureStyle>} style
 * @param {Element} near
 * @returns {string}
 */
export function duotoneAt(style, near) {
  if (style.look !== 'duotone' || !near?.ownerDocument) return '';
  const dark = colorAt(style.duotone.dark, near);
  const light = colorAt(style.duotone.light, near);
  return dark && light ? duotoneFilterUrl(dark, light, near.ownerDocument) : '';
}

/** The frames drawn with a duotone, drawn again when the page's colours change (the light or dark mode), so a site colour follows. */
const duotoneFrames = new Set();
let watchingColours = false;

function watchColours() {
  if (watchingColours || typeof window === 'undefined') return;
  watchingColours = true;
  const redraw = () => {
    for (const frame of duotoneFrames) {
      if (!frame.isConnected) duotoneFrames.delete(frame);
      else frame._urdPicRedraw?.();
    }
  };
  new MutationObserver(redraw).observe(document.documentElement, { attributes: true, attributeFilter: ['data-urd-theme', 'style', 'class'] });
  window.matchMedia?.('(prefers-color-scheme: dark)').addEventListener?.('change', redraw);
}

/**
 * How much a picture straightened by `deg` degrees is drawn larger, so its
 * frame has no empty corners: enough for a frame up to 2.4 times as wide as
 * it is tall, or as tall as it is wide (21:9 and 9:16 included). Pure.
 * @param {number} deg
 * @returns {number}
 */
export function straightenScale(deg) {
  const r = (Math.abs(deg) * Math.PI) / 180;
  return Math.round((Math.cos(r) + 2.4 * Math.sin(r)) * 10000) / 10000;
}

/**
 * The turn as a CSS transform, or null for a picture that is not turned:
 * the quarter turns and the straightening as one rotation, the flips as a
 * mirror, and the straightening's scale. `quarter` says the turned picture
 * lies across its frame, so the drawing swaps its width and height. Pure.
 * @param {ReturnType<typeof pictureStyle>} style
 * @returns {{transform: string, quarter: boolean}|null}
 */
export function pictureTurn(style) {
  if (!style.rotate && !style.flipX && !style.flipY && !style.straighten) return null;
  const angle = style.rotate + style.straighten;
  const grow = straightenScale(style.straighten);
  const sx = (style.flipX ? -1 : 1) * grow;
  const sy = (style.flipY ? -1 : 1) * grow;
  const parts = [];
  if (angle) parts.push(`rotate(${angle}deg)`);
  if (sx !== 1 || sy !== 1) parts.push(`scale(${sx}, ${sy})`);
  return { transform: parts.join(' '), quarter: style.rotate === 90 || style.rotate === 270 };
}

/**
 * Draws a picture's settings onto its frame and its image: the focus point,
 * the zoom, the filter, the turn, the look's layer and the overlay. A picture
 * with no turn keeps the markup it has always had (the image straight in its
 * frame); a turned one is wrapped in `.urd-pic-turn`, which the turn rotates
 * and mirrors, and which lies across the frame for a quarter turn.
 * @param {HTMLElement} frame The box that clips the picture
 * @param {HTMLImageElement} img
 * @param {object} raw The stored settings (pictureStyle), with `fit` beside them
 * @param {{dim?: number, ratioFromPicture?: boolean}} [options]
 *   dim: darken on top (the video's cover); ratioFromPicture: the frame takes its height from the picture (a gallery's grid), so a quarter turn gives it the turned picture's ratio
 */
export function drawPicture(frame, img, raw, { dim = 1, ratioFromPicture = false } = {}) {
  const style = pictureStyle(raw);
  const focus = `${style.x * 100}% ${style.y * 100}%`;
  img.style.objectFit = raw?.fit === 'contain' ? 'contain' : 'cover';
  img.style.objectPosition = focus;
  // Zoom crops in towards the focal point; the frame clips the rest.
  img.style.transform = style.zoom !== 1 ? `scale(${style.zoom})` : '';
  img.style.transformOrigin = focus;
  // The duotone's gradient map, made from its colours as this place draws them; the frame is drawn again when the page's colours change.
  const duotone = duotoneAt(style, frame);
  if (style.look === 'duotone') {
    frame._urdPicRedraw = () => drawPicture(frame, frame.querySelector('img') ?? img, raw, { dim, ratioFromPicture });
    duotoneFrames.add(frame);
    watchColours();
    // A frame drawn before it stands on the page has no colours to read yet: it is drawn again once it does.
    if (!frame.isConnected && typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(() => { if (frame.isConnected) frame._urdPicRedraw?.(); });
    }
  } else {
    duotoneFrames.delete(frame);
  }
  img.style.filter = pictureFilter(style, { dim, duotone });

  const turn = pictureTurn(style);
  let wrap = img.parentElement?.classList.contains('urd-pic-turn') ? img.parentElement : null;
  if (turn) {
    if (!wrap) {
      wrap = document.createElement('span');
      wrap.className = 'urd-pic-turn';
      img.replaceWith(wrap);
      wrap.appendChild(img);
    }
    wrap.style.transform = turn.transform;
  } else if (wrap) {
    wrap.replaceWith(img);
  }
  frame.classList.toggle('urd-pic-turned', Boolean(turn));
  frame.classList.toggle('urd-pic-quarter', Boolean(turn?.quarter));
  // A frame whose height comes from its picture takes the turned picture's ratio once the picture's own size is known.
  if (ratioFromPicture) {
    const setRatio = () => {
      frame.style.aspectRatio = turn?.quarter && img.naturalWidth ? `${img.naturalHeight} / ${img.naturalWidth}` : turn && img.naturalWidth ? `${img.naturalWidth} / ${img.naturalHeight}` : '';
    };
    if (img.complete) setRatio();
    else img.addEventListener('load', setRatio, { once: true });
  }

  for (const look of LAYERED_LOOKS) frame.classList.toggle(`urd-pic-look-${look}`, style.look === look);
  frame.classList.toggle('urd-pic-overlaid', Boolean(style.overlay));
  if (style.overlay) {
    frame.style.setProperty('--urd-pic-overlay', resolveColor(style.overlay.color));
    frame.style.setProperty('--urd-pic-overlay-strength', String(style.overlay.strength));
  } else {
    frame.style.removeProperty('--urd-pic-overlay');
    frame.style.removeProperty('--urd-pic-overlay-strength');
  }
}
