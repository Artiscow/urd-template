/**
 * Background layer: image gallery. One set of pictures, uploaded or read from
 * a shared folder, drawn in one of four layouts: frames floating over the
 * section (ApeironLF's hero style D, the default), one picture filling the
 * section with a cross-fade to the next, rolling bands (style A) or a mosaic
 * wall (style B). On top of the layout every picture wears a shape (cut with
 * clip-path), a look (what surrounds it: a shadow, a polaroid card, borders,
 * tape, a stamp edge and more) and a tone (a filter on the picture itself),
 * three choices that combine freely. Each layout takes the motions it can
 * carry: frames drift diagonally or straight up, breathe (Ken Burns),
 * cross-fade to the next picture one frame at a time, or bounce off the edges;
 * a filling picture breathes or drifts; a band rolls by itself.
 *
 * Every picture is three boxes: the box (placed and moved), the skin (the
 * visible surface, clipped to the shape and carrying the look) and the face
 * (the picture, clipped to the shape too and carrying the tone). A look that
 * sets the face in shows the skin around it, so a border follows any shape.
 *
 * The scatter, the mosaic spans and the order of the pictures are all drawn
 * from one seed (gallery-layout.js, photo-source.js): the owner's fixed one,
 * or the visit's, so «random» is new on every page load and still while the
 * page is open. The motions are CSS animations on the frames; the only script
 * that runs afterwards is the picture swap at the foot of a fade, and the band
 * needs no measuring at all since its period is a setting.
 *
 * With no pictures the layer draws its frames around drawn example pictures,
 * which base.css shows only inside the editor, so the whole layout can be set
 * up before the photos arrive.
 */
import { canAutoplay, normalizeInterval, stepIndex } from '../gallery-model.js';
import { isSafeImage } from '../nav-model.js';
import { bgSize, bgPosition, bgMotion, normalizeMotionSpeed } from './image.js';
import { resolveColor } from '../theme.js';
import {
  galleryStyle, styleMotion, galleryMoves, frameSize, clampRadius, normalizeMotionTime,
  normalizePictureTime, bandRows, layoutSeed, photoLayout, mosaicSpans, placeholderPhoto,
  placeholderPhotos, galleryShape, galleryLook, galleryTone, frameAspect, frameColor,
  MOTION_TIME, PICTURE_TIME, FRAME_SPREAD, FRAME_TILT, FRAME_RADIUS, FRAME_COUNT,
} from '../gallery-layout.js';
import { picturesFor, drawWithFolder, photoWidth, photoSrcAt, seedForVisit, FOLDER_MAX } from '../photo-source.js';

/** The fields version 2 added, all additive. */
const V2_FIELDS = {
  source: 'upload', folder: '', order: 'random', folderMax: FOLDER_MAX.dflt,
  style: 'floating', motion: 'drift', motionSpeed: MOTION_TIME.dflt, interval: PICTURE_TIME.dflt, fade: 1.5,
  count: FRAME_COUNT.dflt, seed: 0, size: null, spread: FRAME_SPREAD.dflt, tilt: FRAME_TILT.dflt,
  radius: FRAME_RADIUS.dflt, rows: 2, direction: 'left', underNav: true, underAnnounce: false, repeat: false,
  shape: 'rect', look: 'shadow', tone: 'natural', frameColor: '',
};

export const slideshowLayer = {
  version: 2,
  label: 'Image gallery',
  labelKey: 'bgLayer.slideshow',
  defaults: () => ({ images: [], fit: 'cover', opacity: 0.85, blur: 0, ...V2_FIELDS }),
  migrations: {
    // 1 -> 2: the styles, the motions and pictures from a shared folder. The
    // defaults stand FIRST and the stored props last, for the reason the image
    // layer's 2 -> 3 step gives: the editor writes into layer props without
    // lifting them, so a layer still stored as version 1 can already carry a
    // choice that the lift must not overwrite. A version 1 layer was the
    // filling cross-fade, so that is the style it keeps, with the interval
    // and the opacity a version 1 layer had when it stored none.
    1: (props) => ({ ...V2_FIELDS, style: 'fill', motion: 'none', interval: 6, opacity: 1, ...props }),
  },
  /**
   * @param {HTMLElement} el
   * @param {{images: Array<{src: string, x?: number, y?: number}>, fit?: 'cover'|'contain',
   *          opacity?: number, blur?: number, source?: 'upload'|'folder', folder?: string,
   *          order?: 'name'|'newest'|'random', folderMax?: number,
   *          style?: 'floating'|'fill'|'band'|'mosaic', shape?: string, look?: string, tone?: string,
   *          motion?: 'none'|'drift'|'rise'|'kenburns'|'crossfade'|'bounce', motionSpeed?: number,
   *          interval?: number, fade?: number, count?: number, seed?: number, size?: number|null,
   *          spread?: number, tilt?: number, radius?: number, rows?: number,
   *          direction?: 'left'|'right', underNav?: boolean, underAnnounce?: boolean, repeat?: boolean, frameColor?: string}} props
   */
  render(el, props) {
    drawWithFolder(el, props, draw);
  },
};

const el2 = (tag, className) => {
  const node = document.createElement(tag);
  node.className = className;
  return node;
};

/** The layer itself, from the pictures that are in hand at this moment. */
function draw(el, props) {
  const style = galleryStyle(props.style);
  // The sources go straight into CSS url(), so they pass the same guard as the image layer.
  const images = picturesFor(props).filter((img) => isSafeImage(img?.src));
  const shape = galleryShape(props.shape);
  const look = galleryLook(props.look);
  el.classList.add('urd-bg-slideshow', `urd-gallery-${style}`, `urd-gallery-tone-${galleryTone(props.tone)}`);
  // The shape and the look are the host's classes; base.css carries them down
  // to every skin and face, so a band tile and a floating frame wear the same.
  if (style !== 'fill') el.classList.add(`urd-gallery-shape-${shape}`, `urd-gallery-look-${look}`);
  el.style.setProperty('--urd-frame-radius', `${clampRadius(props.radius)}px`);
  if (!images.length) el.classList.add('urd-bg-demo');
  el.style.opacity = String(props.opacity ?? 0.85);
  const colour = frameColor(look, props.frameColor);
  if (colour) el.style.setProperty('--urd-frame-color', resolveColor(colour));
  // The area the pictures may use: the whole section, or the section without
  // the announcement strip and the menu bar at its top, whose heights nav.js
  // measures onto the root. The layer's own box is moved down by that much,
  // so the scatter, the travel and the bounce all work inside the smaller
  // area and no picture is ever cut at a bar's edge. The offset is CSS, so a
  // bar that changes height moves the area without a re-render.
  // The announcement's part is kept out unless the layer says otherwise (the
  // default is off), the menu's is used unless the layer says otherwise (on).
  // The menu sits below the strip, so keeping the menu out keeps the strip
  // out with it, whatever the strip's own switch says.
  const kept = props.underNav === false
    ? ['var(--urd-announce-h, 0px)', 'var(--urd-nav-own-h, 0px)']
    : props.underAnnounce !== true ? ['var(--urd-announce-h, 0px)'] : [];
  const areaTop = kept.length ? `calc(${kept.join(' + ')})` : '';
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  const motion = styleMotion(style, props.motion);
  const ctx = {
    el, props, style, images, motion, shape, look,
    aspect: frameAspect(shape, look),
    moves: galleryMoves({ style, motion, reducedMotion: reduced }),
    reduced,
    seed: layoutSeed(props.seed, seedForVisit()),
    time: normalizeMotionTime(props.motionSpeed),
    dwell: normalizePictureTime(props.interval),
    dpr: window.devicePixelRatio || 1,
  };
  STYLES[style](ctx);
  // After the style has drawn, since the fill's blur sets the layer's inset.
  if (areaTop) el.style.top = style === 'fill' && props.blur > 0 ? `calc(${areaTop} - ${props.blur * 2}px)` : areaTop;
}

/**
 * Paints one picture on a face: the one at `index`, asked for at the width
 * the face needs, or a drawn example when the frame is empty.
 */
function paint(face, images, index, width, slot) {
  const img = images[index];
  face.style.backgroundImage = `url("${img ? photoSrcAt(img.src, width) : placeholderPhoto(slot)}")`;
  face.style.backgroundPosition = img ? bgPosition(img.x, img.y) : '';
}

/* ---------- Fill: one picture, cross-fading to the next ---------- */

function renderFill({ el, props, images, motion, reduced, dpr, dwell }) {
  const demo = !images.length;
  // Three drawn example pictures, so the cross-fade can be seen while it is
  // being set up.
  const list = demo ? placeholderPhotos(3) : images;
  // A slide covers the section, which spans the window: that is the width to ask for.
  const width = photoWidth(window.innerWidth, dpr);
  if (props.blur > 0) {
    el.style.filter = `blur(${props.blur}px)`;
    el.style.inset = `-${props.blur * 2}px`;
  }
  const fade = Math.max(0, Number(props.fade) || 0);
  el.style.setProperty('--urd-bgg-fade', `${fade}s`);

  // The fill keeps the image layer's motion classes: the cross-fade animates
  // `opacity` and the motion `transform`, so the two never collide.
  const fillMotion = bgMotion(motion === 'drift' ? 'drift' : motion === 'kenburns' ? 'kenburns' : 'none');
  const makeSlide = (on) => {
    const div = el2('div', on ? 'urd-bg-slide on' : 'urd-bg-slide');
    if (fillMotion !== 'none') {
      div.classList.add('urd-bg-motion', `urd-bg-motion-${fillMotion}`);
      div.style.animationDuration = `${normalizeMotionSpeed(props.motionSpeed)}s`;
    }
    return div;
  };
  const paintSlide = (slide, img) => {
    slide.style.backgroundImage = `url("${demo ? img.src : photoSrcAt(img.src, width)}")`;
    // An example picture is tiled at its own size rather than stretched over
    // the section, so it reads as a picture and not as a giant glyph.
    slide.style.backgroundSize = demo ? '240px auto' : bgSize(props.fit);
    slide.style.backgroundRepeat = demo ? 'repeat' : 'no-repeat';
    slide.style.backgroundPosition = demo ? '' : bgPosition(img.x, img.y);
  };

  // Same load guard as the image layer: keep the layer invisible until the first
  // image has finished loading, so it never appears in stripes.
  const probe = new Image();
  probe.src = demo ? list[0].src : photoSrcAt(list[0].src, width);
  if (!probe.complete) {
    el.style.visibility = 'hidden';
    const show = () => { el.style.visibility = ''; };
    probe.addEventListener('load', show, { once: true });
    probe.addEventListener('error', show, { once: true });
  }

  const first = makeSlide(true);
  paintSlide(first, list[0]);
  el.appendChild(first);

  if (!canAutoplay({ count: list.length, reducedMotion: reduced })) return;

  const other = makeSlide(false);
  el.appendChild(other);

  let index = 0;
  let front = first;
  // The fade must have time to finish before the next swap.
  const ms = Math.max(normalizeInterval(dwell, { fallback: PICTURE_TIME.dflt }), fade + 0.5) * 1000;
  const timerId = setInterval(() => {
    // The timer dies with the slides it drives: a folder answer redraws the
    // layer while the layer element itself stays in the DOM.
    if (!first.isConnected) {
      clearInterval(timerId);
      return;
    }
    if (document.hidden) return;
    const nextIndex = stepIndex(index, 1, list.length);
    const next = new Image();
    next.src = demo ? list[nextIndex].src : photoSrcAt(list[nextIndex].src, width);
    const swap = () => {
      if (!first.isConnected) return;
      const back = front === first ? other : first;
      paintSlide(back, list[nextIndex]);
      back.classList.add('on');
      front.classList.remove('on');
      front = back;
      index = nextIndex;
    };
    if (next.complete) {
      swap();
    } else {
      next.addEventListener('load', swap, { once: true });
      // A broken image is skipped, so the rotation does not get stuck on it.
      next.addEventListener('error', () => { index = nextIndex; }, { once: true });
    }
  }, ms);
}

/**
 * A picture's skin and face inside a box, the chain every layout draws: the
 * shape and the look come down from the host through CSS.
 */
function dress(box, images, index, width, slot) {
  const skin = el2('div', 'urd-gallery-skin');
  const face = el2('div', 'urd-gallery-face');
  paint(face, images, index, width, slot);
  skin.appendChild(face);
  box.appendChild(skin);
  return { skin, face };
}

/* ---------- Frames: the floating layout ---------- */

/**
 * The travel of a drifting frame, in container units so it spans the section
 * whatever its size: it starts fully outside one edge and ends fully outside
 * the opposite one, so the jump back at the end of a cycle is never seen.
 * A frame's centre sits at x/y per cent of the section, so -x cqw brings it
 * to the left edge and a further 60 % of its own width takes it out of sight.
 */
function travel(place, motion) {
  const { x, y, heading } = place;
  if (motion === 'rise') {
    return { tx0: '0px', ty0: `calc(${100 - y}cqh + 60%)`, tx1: '0px', ty1: `calc(${-y}cqh - 60%)` };
  }
  const rightwards = heading < 0.5;
  const downwards = (heading * 2) % 1 < 0.5;
  const left = `calc(${-x}cqw - 60%)`;
  const right = `calc(${100 - x}cqw + 60%)`;
  const above = `calc(${-y}cqh - 60%)`;
  const below = `calc(${100 - y}cqh + 60%)`;
  return {
    tx0: rightwards ? left : right, tx1: rightwards ? right : left,
    ty0: downwards ? above : below, ty1: downwards ? below : above,
  };
}

/**
 * Gives a frame its motion. `frame` is the positioned box, `skin` the visible
 * picture box inside it, `face` the picture: the travel and the fade ride on
 * the box, the bounce's second axis on the skin, and the breathing on the face,
 * so no two of them ever share a transform.
 */
function animate({ frame, skin, face }, place, i, ctx) {
  const { motion, moves, time } = ctx;
  if (!moves) return;
  const phase = `-${(place.phase * time).toFixed(2)}s`;
  if (motion === 'drift' || motion === 'rise') {
    frame.classList.add('urd-gallery-travel');
    const t = travel(place, motion);
    frame.style.setProperty('--tx0', t.tx0);
    frame.style.setProperty('--ty0', t.ty0);
    frame.style.setProperty('--tx1', t.tx1);
    frame.style.setProperty('--ty1', t.ty1);
    frame.style.animationDuration = `${time}s`;
    frame.style.animationDelay = phase;
  } else if (motion === 'kenburns') {
    frame.classList.add('urd-gallery-kenburns');
    frame.style.animationDuration = `${time}s`;
    frame.style.animationDelay = phase;
  } else if (motion === 'bounce') {
    // Two axes with two periods, so the path never repeats soon: the box goes
    // across, the skin goes up and down.
    frame.style.left = '0';
    frame.style.top = '0';
    frame.style.translate = '0 0';
    frame.classList.add('urd-gallery-bounce-x');
    skin.classList.add('urd-gallery-bounce-y');
    const across = time * (0.8 + place.heading * 0.4);
    const down = time * (0.5 + place.phase * 0.35);
    frame.style.animationDuration = `${across.toFixed(2)}s`;
    frame.style.animationDelay = `-${(place.phase * across).toFixed(2)}s`;
    skin.style.animationDuration = `${down.toFixed(2)}s`;
    skin.style.animationDelay = `-${(place.heading * down).toFixed(2)}s`;
  }
}

/**
 * The cross-fade: every frame fades in and out on its own cycle, spread evenly
 * around the clock, and at the foot of each cycle, when it is invisible, it
 * comes back as a new picture, and where `relocate` is given (the floating
 * layout) in a new place too. The picture is the one that has waited longest
 * among those no frame is showing, so the whole folder goes round in turn; if
 * every picture is on show, the one that has waited longest apart from its
 * own, so a frame never fades back in with what it faded out with unless
 * there is only one picture.
 * @param {Array<object>} frames The frames, each with its box, face, index and place
 * @param {object} ctx
 * @param {(i: number, gen: number, others: Array<object>) => object} [relocate] A fresh place for frame i
 */
function mountFades(frames, ctx, relocate) {
  const { images, moves, dwell, motion } = ctx;
  if (motion !== 'crossfade' || !moves) return;
  const n = frames.length;
  const shown = frames.map((f) => f.index);
  // When each picture was last put on show; the first showing counts as now.
  const lastShown = images.map((_, index) => (shown.includes(index) ? 0 : -1));
  let tick = 0;
  const nextFor = (i) => {
    if (images.length < 2) return -1;
    const waited = (index) => lastShown[index];
    const free = images.map((_, index) => index).filter((index) => !shown.includes(index));
    const pool = free.length ? free : images.map((_, index) => index).filter((index) => index !== shown[i]);
    return pool.reduce((best, index) => (waited(index) < waited(best) ? index : best), pool[0]);
  };
  let gen = 0;
  frames.forEach((f, i) => {
    f.frame.classList.add('urd-gallery-fade');
    f.frame.style.animationDuration = `${dwell}s`;
    const offset = ((i / n) + f.phase * 0.3) % 1;
    f.frame.style.animationDelay = `-${(offset * dwell).toFixed(2)}s`;
    f.frame.addEventListener('animationiteration', () => {
      if (!f.frame.isConnected) return;
      const index = nextFor(i);
      if (index >= 0) {
        paint(f.face, images, index, f.width, i);
        shown[i] = index;
        lastShown[index] = ++tick;
      }
      if (relocate) {
        gen += 1;
        placeFrame(f, relocate(i, gen, frames.filter((o) => o !== f)));
      }
    });
  });
}

/**
 * Puts a frame where a placement says, and remembers where that is. The
 * centre is held at least half a frame (and a little more, for the lean)
 * from every edge of the area, so a frame at the rim of the scatter stands
 * wholly inside the area rather than hanging half over its edge and being cut
 * there, which would read as a picture behind the menu or past the section.
 */
function placeFrame(f, place) {
  const halfW = (place.w / 2) * 1.15;
  const halfH = (place.w / f.aspect / 2) * 1.15;
  f.frame.style.left = `clamp(${halfW.toFixed(1)}px, ${place.x}%, calc(100% - ${halfW.toFixed(1)}px))`;
  f.frame.style.top = `clamp(${halfH.toFixed(1)}px, ${place.y}%, calc(100% - ${halfH.toFixed(1)}px))`;
  f.frame.style.width = `${place.w}px`;
  f.frame.style.rotate = `${place.rot}deg`;
  f.x = place.x;
  f.y = place.y;
}

function renderFrames(ctx) {
  const { el, props, style, images, seed, aspect, dpr } = ctx;
  const opts = {
    count: props.count, seed, size: props.size, spread: props.spread, tilt: props.tilt, style, repeat: props.repeat === true,
  };
  const places = photoLayout(images, opts);
  const frames = places.map((place, i) => {
    const frame = el2('div', 'urd-gallery-box urd-gallery-frame' + (place.index < 0 ? ' urd-gallery-frame-empty' : ''));
    frame.style.aspectRatio = String(aspect);
    const width = photoWidth(place.w, dpr);
    const { skin, face } = dress(frame, images, place.index, width, i);
    el.appendChild(frame);
    const f = { frame, skin, face, width, aspect, index: place.index, phase: place.phase };
    placeFrame(f, place);
    animate(f, place, i, ctx);
    return f;
  });
  // A fresh place for a frame that has faded out: a new throw of the whole
  // scatter, and of six such throws the one that lands farthest from the
  // frames still showing, so the frame does not come back on top of one.
  const relocate = (i, gen, others) => {
    let best = null;
    let bestGap = -1;
    for (let k = 0; k < 6; k += 1) {
      const cand = photoLayout(images, { ...opts, seed: `${seed}:${gen * 6 + k}` })[i];
      const gap = Math.min(999, ...others.map((o) => Math.hypot(o.x - cand.x, o.y - cand.y)));
      if (gap > bestGap) {
        bestGap = gap;
        best = cand;
      }
    }
    return best;
  };
  mountFades(frames, ctx, relocate);
}

/* ---------- Band: rolling rows ---------- */

function renderBand(ctx) {
  const { el, props, images, moves, time, aspect, dpr } = ctx;
  const rows = bandRows(props.rows);
  const height = frameSize(props.size, 'band');
  el.style.setProperty('--urd-band-h', `${height}px`);
  // A band with nothing in it still rolls a row of example pictures.
  const count = images.length || 8;
  const width = photoWidth(height * aspect, dpr);
  for (let row = 0; row < rows; row += 1) {
    const band = el2('div', 'urd-gallery-band-row');
    if (!moves) band.classList.add('urd-ribbon-still');
    const track = el2('div', 'urd-ribbon-track');
    // The second row runs against the first, whichever way the first goes.
    if ((props.direction === 'right') !== (row === 1)) track.classList.add('urd-ribbon-right');
    track.style.setProperty('--urd-ribbon-ms', `${time * 1000}ms`);
    // A row starts part way along, so two rows never line up.
    if (row === 1) track.style.animationDelay = `-${(time / 3).toFixed(1)}s`;
    const fill = (run) => {
      for (let i = 0; i < count; i += 1) {
        const tile = el2('div', 'urd-gallery-box urd-gallery-band-tile' + (images.length ? '' : ' urd-gallery-frame-empty'));
        tile.style.aspectRatio = String(aspect);
        dress(tile, images, images.length ? i : -1, width, i);
        run.appendChild(tile);
      }
    };
    const run = el2('div', 'urd-ribbon-run');
    fill(run);
    // The copy makes the loop seamless and is hidden from readers.
    const copy = el2('div', 'urd-ribbon-run');
    copy.setAttribute('aria-hidden', 'true');
    fill(copy);
    track.append(run, copy);
    band.appendChild(track);
    el.appendChild(band);
  }
}

/* ---------- Mosaic: a wall of tiles ---------- */

function renderMosaic(ctx) {
  const { el, props, images, seed, dpr, motion, moves, time } = ctx;
  const spans = mosaicSpans(props.count, seed, images.length, props.repeat === true);
  el.style.setProperty('--urd-mosaic-row', `${frameSize(props.size, 'mosaic')}px`);
  const width = photoWidth(frameSize(props.size, 'mosaic') * 2.2, dpr);
  const tiles = spans.map((span, i) => {
    const tile = el2('div', 'urd-gallery-box urd-gallery-tile' + (images.length ? '' : ' urd-gallery-frame-empty'));
    tile.style.gridColumn = `span ${span.cols}`;
    tile.style.gridRow = `span ${span.rows}`;
    const index = images.length ? i % images.length : -1;
    const { face } = dress(tile, images, index, width, i);
    el.appendChild(tile);
    if (moves && motion === 'kenburns') {
      face.classList.add('urd-gallery-kenburns');
      face.style.animationDuration = `${time}s`;
      face.style.animationDelay = `-${(span.phase * time).toFixed(2)}s`;
    }
    return { frame: tile, skin: tile, face, width, index, phase: span.phase };
  });
  mountFades(tiles, ctx);
}

const STYLES = { fill: renderFill, floating: renderFrames, band: renderBand, mosaic: renderMosaic };
