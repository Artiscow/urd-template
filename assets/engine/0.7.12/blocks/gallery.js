/**
 * Core block: gallery, one block with six views (grid, carousel, slides, ribbon, mosaic and polaroid), its tiles drawn with the image block's style.
 * Notes: docs/engine-notes/blocks/gallery.md (Urd repository).
 */
import { applyImageStyle } from './image.js';
import { growSectionTo, WIDTH_QUERIES } from '../render.js';
import {
  stepIndex, canAutoplay, normalizeInterval, gridColumns, galleryView, GRID_VIEWS, mosaicRowHeight, mosaicWall, polaroidTilts,
  slidesRun,
} from '../gallery-model.js';
import { resolveColor, inkOn } from '../theme.js';
import { loadBlockSheet } from '../core-types.js';
import { resolveLink, linkAttrs } from '../nav-model.js';
// ta/adminLocaleReady: only called in preview (after the admin dictionary is loaded), never at module level.
import { t, ta, adminLocaleReady } from '../i18n.js';

const post = (msg) => window.parent?.postMessage(msg, location.origin);

const el2 = (tag, className, textContent) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (textContent != null) node.textContent = textContent;
  return node;
};

const chromeOff = () => document.body.classList.contains('urd-chrome-off');
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

async function openLightboxAt(images, index) {
  const { openLightbox } = await import('../lightbox.js');
  openLightbox(images, index);
}

/** The image editor for one tile is the admin's (PictureEditor.svelte): the tile asks it to open on props.images[index], with the tile's shape as drawn here. */
function openTileEditor(tile, index, ctx, blockEl) {
  post({ type: 'urd-picture-edit', kind: 'gallery', sectionId: ctx.section.id, blockId: blockEl.dataset.blockId, index, frameRatio: tile.offsetHeight ? tile.offsetWidth / tile.offsetHeight : 0, frameWidth: tile.offsetWidth, frameHeight: tile.offsetHeight });
}

/** One tile: a clipping frame and an img with the shared image style, in a link (a), a button or a plain span, by what the click does. */
function makeTile(props, index, ctx, blockEl) {
  const img = props.images[index];
  // One link per picture (resolveLink): one that goes nowhere gives a tile without a link (the lightbox takes over).
  const link = img.page || img.href || img.target ? resolveLink(img, ctx.site?.pages ?? []) : null;
  const asLink = Boolean(link) && !link.missing && !ctx.preview;
  const clickable = ctx.preview || props.lightbox;
  const tile = el2(asLink ? 'a' : clickable ? 'button' : 'span', 'urd-gallery-tile');
  if (asLink) Object.assign(tile, linkAttrs(link));
  if (tile.tagName === 'BUTTON') tile.type = 'button';
  // Its picture's place in the list, so the editor's menu finds the tile it opens the image editor for.
  tile.dataset.index = String(index);

  const image = document.createElement('img');
  image.src = img.src;
  image.loading = 'lazy';
  image.draggable = false;
  // The same load guard as the image block: show the image complete, never in strips.
  if (!image.complete) {
    image.style.visibility = 'hidden';
    image.addEventListener('load', () => { image.style.visibility = ''; }, { once: true });
    image.addEventListener('error', () => { image.style.visibility = ''; }, { once: true });
  }
  tile.appendChild(image);
  // A ribbon's tile is as wide as its picture, so a turned picture gives it the turned picture's ratio.
  applyImageStyle(tile, { ...(img.style ?? {}), alt: img.alt, radius: props.radius }, { ratioFromPicture: galleryView(props.view) === 'ribbon' });

  if (ctx.preview) {
    // Chrome on: the image editor. Clean view: the lightbox, as for visitors.
    // The decision is made on click, so the Clean view switch needs no re-render.
    tile.classList.add('urd-gallery-edit');
    tile.title = ta('canvas.editImage');
    tile.addEventListener('click', (event) => {
      event.preventDefault();
      if (chromeOff()) {
        if (props.lightbox) openLightboxAt(props.images, index);
        return;
      }
      openTileEditor(tile, index, ctx, blockEl);
    });
  } else if (!asLink && props.lightbox) {
    tile.addEventListener('click', () => openLightboxAt(props.images, index));
  }
  return tile;
}

/**
 * The column counts of the grid views, wide and narrow; a narrow block takes the narrow count through a container query in gallery.css.
 * @returns {{wide: number, narrow: number}}
 */
function columnCounts(host, props, ctx) {
  const wide = gridColumns(props.columns, props.images.length, WIDTH_QUERIES ? 'desktop' : ctx.viewport);
  const narrow = gridColumns(props.columns, props.images.length, 'mobile');
  host.style.setProperty('--urd-gallery-cols', String(wide));
  host.style.setProperty('--urd-gallery-cols-narrow', String(narrow));
  return { wide, narrow };
}

/**
 * The element a grid view lays its tiles out in, so the columns follow the width the content is laid out in under a size.
 * @param {HTMLElement} host The gallery
 * @returns {HTMLElement}
 */
function tilesIn(host) {
  const tiles = el2('div', 'urd-gallery-tiles');
  host.appendChild(tiles);
  return tiles;
}

function renderGrid(host, props, ctx, blockEl) {
  host.classList.add('urd-gallery-grid');
  columnCounts(host, props, ctx);
  host.style.setProperty('--urd-gallery-gap', `${Number(props.gap) || 0}px`);
  const tiles = tilesIn(host);
  props.images.forEach((_, i) => tiles.appendChild(makeTile(props, i, ctx, blockEl)));
}

function navButton(dir, label, onclick) {
  const btn = el2('button', `urd-gallery-nav urd-gallery-${dir}`);
  btn.type = 'button';
  btn.title = label;
  btn.setAttribute('aria-label', label);
  btn.innerHTML = dir === 'prev'
    ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>'
    : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg>';
  btn.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    onclick();
  });
  return btn;
}

function renderCarousel(host, props, ctx, blockEl) {
  host.classList.add('urd-gallery-carousel');
  const track = el2('div', 'urd-gallery-track');
  props.images.forEach((_, i) => track.appendChild(makeTile(props, i, ctx, blockEl)));
  host.appendChild(track);
  if (props.images.length > 1) {
    const behavior = reducedMotion() ? 'auto' : 'smooth';
    host.appendChild(navButton('prev', t('gallery.prevImages'), () => track.scrollBy({ left: -track.clientWidth * 0.8, behavior })));
    host.appendChild(navButton('next', t('gallery.nextImages'), () => track.scrollBy({ left: track.clientWidth * 0.8, behavior })));
  }
}

/** The slideshows the visitor has stopped, by block id: a pause or a step by hand lasts, through a re-render too. */
const STOPPED_SLIDES = new Set();

/** The slides' pause and play marks, drawn as the ribbon's and the calendar's are. */
const PAUSE_ICON = '<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor"/><rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor"/></svg>';
const PLAY_ICON = '<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z" fill="currentColor"/></svg>';

function renderSlides(host, props, ctx, blockEl) {
  host.classList.add('urd-gallery-slides');
  const count = props.images.length;
  const keyOf = () => blockEl?.dataset.blockId ?? host.closest('[data-block-id]')?.dataset.blockId ?? '';
  // The pointer over the show or focus inside it holds the timer while it stays (the APG carousel pattern).
  let held = false;
  const slides = props.images.map((_, i) => {
    const slide = el2('div', 'urd-gallery-slide');
    slide.appendChild(makeTile(props, i, ctx, blockEl));
    host.appendChild(slide);
    return slide;
  });
  const dots = [];
  let current = 0;

  const show = (i) => {
    current = i;
    slides.forEach((slide, j) => slide.classList.toggle('on', j === i));
    dots.forEach((dot, j) => dot.classList.toggle('on', j === i));
  };

  // Self-cleaning timer: the host disappears from the DOM on every re-render in preview, and the interval has to die with it (otherwise one stacks up per render).
  let timerId = 0;
  const startTimer = () => {
    clearInterval(timerId);
    if (!canAutoplay({ count, reducedMotion: reducedMotion() })) return;
    timerId = setInterval(() => {
      if (!host.isConnected) {
        clearInterval(timerId);
        return;
      }
      if (document.hidden) return;
      // In preview the slide advances only in Clean view: while editing, nothing should move under the pointer.
      if (ctx.preview && !chromeOff()) return;
      if (!slidesRun({ count, reducedMotion: reducedMotion(), stopped: STOPPED_SLIDES.has(keyOf()), held })) return;
      show(stepIndex(current, 1, count));
    }, normalizeInterval(props.interval) * 1000);
  };
  // The pause that stays (WCAG 2.2.2, the APG carousel's rotation control): a step by hand stops the timer for good as well, and the button plays it again.
  const pauseButton = el2('button', 'urd-gallery-nav urd-gallery-pause');
  pauseButton.type = 'button';
  const paintPause = () => {
    const stopped = STOPPED_SLIDES.has(keyOf());
    pauseButton.setAttribute('aria-pressed', String(stopped));
    pauseButton.setAttribute('aria-label', t(stopped ? 'gallery.play' : 'gallery.pause'));
    pauseButton.title = pauseButton.getAttribute('aria-label');
    pauseButton.innerHTML = stopped ? PLAY_ICON : PAUSE_ICON;
  };
  const stop = (on) => {
    if (on) STOPPED_SLIDES.add(keyOf());
    else STOPPED_SLIDES.delete(keyOf());
    paintPause();
  };
  pauseButton.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    stop(!STOPPED_SLIDES.has(keyOf()));
  });
  const manual = (delta) => {
    show(stepIndex(current, delta, count));
    stop(true);
  };

  if (count > 1) {
    host.appendChild(navButton('prev', t('gallery.prevImage'), () => manual(-1)));
    host.appendChild(navButton('next', t('gallery.nextImage'), () => manual(1)));
    if (canAutoplay({ count, reducedMotion: reducedMotion() })) {
      paintPause();
      requestAnimationFrame(paintPause);
      host.appendChild(pauseButton);
      host.addEventListener('pointerenter', (event) => { if (event.pointerType === 'mouse') held = true; });
      host.addEventListener('pointerleave', () => { held = false; });
      host.addEventListener('focusin', () => { held = true; });
      host.addEventListener('focusout', (event) => { held = host.contains(event.relatedTarget); });
    }
    const dotRow = el2('div', 'urd-gallery-dots');
    props.images.forEach((_, i) => {
      const dot = el2('button', 'urd-gallery-dot urd-gallery-nav');
      dot.type = 'button';
      dot.setAttribute('aria-label', t('gallery.imageN', { n: i + 1 }));
      dot.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        show(i);
        stop(true);
      });
      dots.push(dot);
      dotRow.appendChild(dot);
    });
    host.appendChild(dotRow);
  }
  show(0);
  startTimer();
}

/** The ribbon view's own module (blocks/gallery-ribbon.js) once it is in. */
let ribbonPart = null;
/** Its loading, asked for once. */
let ribbonLoading = null;

/**
 * Loads what the ribbon view draws with: its module, the ribbon block's band and sheet, and the ribbon model, in one wave.
 * @returns {Promise<object>} blocks/gallery-ribbon.js
 */
export function loadRibbonView() {
  ribbonLoading ??= Promise.all([import('./gallery-ribbon.js'), import('./ribbon.js'), import('../ribbon-model.js'), loadBlockSheet('ribbon')]).then(([module]) => (ribbonPart = module));
  return ribbonLoading;
}

/** Readies a gallery before the page is drawn (CORE_BLOCK_READY): the ribbon view's module where it draws the ribbon on either screen. */
export const prepareGallery = (props) => ([props.view, props.phoneDesign].some((view) => galleryView(view) === 'ribbon') ? loadRibbonView() : null);

/** The ribbon view, drawn at once where it was readied before the page was drawn, else as it comes. */
function renderRibbonView(host, props, ctx, blockEl) {
  if (ribbonPart) ribbonPart.renderRibbon(host, props, ctx, blockEl, makeTile);
  else loadRibbonView().then((part) => { if (host.isConnected) part.renderRibbon(host, props, ctx, blockEl, makeTile); }, () => {});
}

/**
 * The mosaic view: tiles in varied spans dealt by the seed and placed by the pure mosaicWall, a full rectangle with rows of one height.
 */
function renderMosaic(host, props, ctx, blockEl) {
  host.classList.add('urd-gallery-wall');
  const { wide, narrow } = columnCounts(host, props, ctx);
  host.style.setProperty('--urd-gallery-gap', `${Number(props.gap) || 0}px`);
  host.style.setProperty('--urd-gallery-row', `${mosaicRowHeight(props.rowHeight)}px`);
  // Two walls from the same seed, one per column count: gallery.css places each tile by the one that fits the block's width.
  const walls = { '': mosaicWall(props.images.length, props.seed, wide), '-narrow': mosaicWall(props.images.length, props.seed, narrow) };
  const tiles = tilesIn(host);
  props.images.forEach((_, i) => {
    const tile = makeTile(props, i, ctx, blockEl);
    for (const [suffix, wall] of Object.entries(walls)) {
      const place = wall.tiles[i];
      tile.style.setProperty(`--urd-tile-col${suffix}`, `${place.col + 1} / span ${place.cols}`);
      tile.style.setProperty(`--urd-tile-row${suffix}`, `${place.row + 1} / span ${place.rows}`);
    }
    tiles.appendChild(tile);
  });
}

/**
 * The polaroid view: every picture in a card with a wider foot, leaning by its own throw of the seed, with the image text in the foot under `captions`.
 */
function renderPolaroid(host, props, ctx, blockEl) {
  host.classList.add('urd-gallery-cards');
  columnCounts(host, props, ctx);
  host.style.setProperty('--urd-gallery-gap', `${Number(props.gap) || 0}px`);
  // The card is white with dark ink until the owner picks a colour; then the words take the colour that reads on that card.
  if (props.frameColor) {
    host.classList.add('urd-gallery-cards-own');
    host.style.setProperty('--urd-polaroid-color', resolveColor(props.frameColor));
    const ink = inkOn(props.frameColor);
    if (ink) host.style.setProperty('--urd-polaroid-ink', ink);
  }
  const tilts = polaroidTilts(props.images.length, props.seed, props.tilt);
  const tiles = tilesIn(host);
  props.images.forEach((img, i) => {
    const card = el2('figure', 'urd-gallery-card');
    card.style.setProperty('--urd-card-tilt', `${tilts[i]}deg`);
    card.appendChild(makeTile(props, i, ctx, blockEl));
    const words = props.captions === true && typeof img.alt === 'string' ? img.alt.trim() : '';
    if (words) card.appendChild(el2('figcaption', 'urd-gallery-caption', words));
    else card.classList.add('urd-gallery-card-plain');
    tiles.appendChild(card);
  });
}

const VIEWS = {
  grid: renderGrid, carousel: renderCarousel, slides: renderSlides, ribbon: renderRibbonView,
  mosaic: renderMosaic, polaroid: renderPolaroid,
};

export const galleryBlock = {
  version: 1,
  // The grid views grow with their pictures on the phone; the ribbon keeps the height of its frame there too, since the band fills the box.
  autoGrow: (props) => galleryView(props?.view) !== 'ribbon',
  label: 'Gallery',
  labelKey: 'blocks.gallery',
  defaults: () => ({
    images: [], view: 'grid', columns: 3, gap: 12, radius: 'md', lightbox: true, interval: 5, width: 'canvas',
  }),
  migrations: {},
  /**
   * @param {HTMLElement} el
   * @param {{images: Array<{src: string, alt?: string, href?: string|null, style?: object}>,
   *          view: 'grid'|'carousel'|'slides'|'ribbon'|'mosaic'|'polaroid', columns: number, gap: number,
   *          speed?: number, direction?: 'left'|'right', pauseOnHover?: boolean,
   *          rows?: number, fade?: boolean,
   *          rowHeight?: number, seed?: number, tilt?: number, frameColor?: string, captions?: boolean,
   *          radius: string|null, lightbox: boolean, interval: number}} props
   * @param {object} ctx
   */
  render(el, props, ctx) {
    if (!props.images?.length) {
      if (ctx.preview) el.appendChild(el2('div', 'urd-gallery-empty', ta('canvas.galleryEmpty')));
      return;
    }
    const host = el2('div', 'urd-gallery');
    el.appendChild(host);
    const view = galleryView(props.view);
    VIEWS[view](host, props, ctx, el);

    // The help chip (ADR-0008): the block has special functions and explains itself.
    if (ctx.preview && ctx.viewport !== 'mobile') {
      // adminLocaleReady: the first render can happen before boot has loaded the dictionary.
      Promise.all([import('../hint.js'), adminLocaleReady]).then(([{ attachHint }]) => {
        if (!el.isConnected || el.querySelector('.urd-hint-chip')) return;
        attachHint(el, {
          title: ta('hintGallery.title'),
          lines: [
            ta('hintGallery.l1'),
            ta('hintGallery.l2'),
            ta('hintGallery.l3'),
            ta('hintGallery.l4'),
          ],
        });
      });
    }

    // Auto-grow for the grid views: the height follows the number of images, measured once the block is in the DOM, since render runs before appendChild.
    if (GRID_VIEWS.includes(view) && ctx.viewport !== 'mobile') requestAnimationFrame(() => {
      if (!el.isConnected) return;
      const needed = host.scrollHeight;
      if (Math.abs(needed - el.clientHeight) > 8) {
        el.style.height = `${needed}px`;
        const sectionEl = el.closest('.urd-section');
        if (sectionEl) growSectionTo(sectionEl, el.offsetTop + needed + 24);
      }
    });
  },
};
