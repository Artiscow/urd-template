/**
 * Core block: gallery. One block with six views (the Squarespace model: the
 * view is a prop, not separate block types): grid, carousel (side scrolling with
 * snap), slides (one image at a time with automatic advance), ribbon (a rolling
 * band), mosaic (a wall of tiles in varied spans) and polaroid (framed cards
 * with a lean).
 *
 * The images live in props.images with the same non-destructive style vocabulary
 * as the image block (style: fit/x/y/zoom/filters); the tiles render with the
 * shared applyImageStyle. For visitors a click opens the lightbox (props.lightbox);
 * in preview a click opens the image editor, and in Clean view the lightbox, so
 * the owner gets to try it before publishing. A link (href) always wins over the
 * lightbox.
 *
 * The slide timer is the engine's first setInterval: it cleans itself up when the
 * host disappears from the DOM (re-render churn), stands still under reduced
 * motion, in hidden tabs, and in preview with the editing chrome on.
 */
import { applyImageStyle } from './image.js';
import { growSectionTo, WIDTH_QUERIES } from '../render.js';
import {
  stepIndex, canAutoplay, normalizeInterval, gridColumns, galleryView, GRID_VIEWS, mosaicRowHeight, mosaicWall, polaroidTilts,
  slidesRun,
} from '../gallery-model.js';
import { resolveColor, inkOn } from '../theme.js';
import { ribbonDuration, ribbonRows, ribbonPeriods, canRoll, ribbonWidth, ribbonPause } from '../ribbon-model.js';
import { syncTrackCopies, fitBandReach, bandPauseControl, PAUSE_ICON, PLAY_ICON } from './ribbon.js';
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

/** The image editor for one tile: the adapter reads and writes props.images[index]
 *  and posts the whole props to the editor (which owns the draft). Remove deletes the tile. */
async function openTileEditor(tile, props, index, ctx, blockEl) {
  const { openImageEditor } = await import('../image-editor.js');
  const img = props.images[index];
  openImageEditor(tile, {
    fields: ['image', 'remove', 'alt', 'fit', 'zoom', 'focus', 'filters'],
    get: (field) => {
      if (field === 'image') return img.src || null;
      if (field === 'alt') return img.alt ?? '';
      return (img.style ?? {})[field];
    },
    set: (field, value) => {
      let rerender = false;
      if (field === 'image') {
        if (value) img.src = value;
        else props.images.splice(index, 1);
        rerender = true;
      } else if (field === 'alt') {
        img.alt = value;
      } else {
        img.style = { ...(img.style ?? {}), [field]: value };
        applyImageStyle(tile, { ...img.style, alt: img.alt, radius: props.radius });
      }
      post({ type: 'urd-edit', sectionId: ctx.section.id, blockId: blockEl.dataset.blockId, props, rerender });
    },
  });
}

/** One tile: a clipping frame plus an img with the shared image style. The element
 *  is chosen by what the click should do: link (a), clickable (button) or pure decoration (span). */
function makeTile(props, index, ctx, blockEl) {
  const img = props.images[index];
  // One link per picture (resolveLink): one that goes nowhere gives a tile without a link (the lightbox takes over).
  const link = img.page || img.href || img.target ? resolveLink(img, ctx.site?.pages ?? []) : null;
  const asLink = Boolean(link) && !link.missing && !ctx.preview;
  const clickable = ctx.preview || props.lightbox;
  const tile = el2(asLink ? 'a' : clickable ? 'button' : 'span', 'urd-gallery-tile');
  if (asLink) Object.assign(tile, linkAttrs(link));
  if (tile.tagName === 'BUTTON') tile.type = 'button';

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
  applyImageStyle(tile, { ...(img.style ?? {}), alt: img.alt, radius: props.radius });

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
      openTileEditor(tile, props, index, ctx, blockEl);
    });
  } else if (!asLink && props.lightbox) {
    tile.addEventListener('click', () => openLightboxAt(props.images, index));
  }
  return tile;
}

/**
 * The column counts of the grid views, wide and narrow: a narrow block (its
 * own width, ADR-0025) takes the narrow count through a container query in
 * base.css. Without container queries the wide count is the window's, as the
 * page's phone view.
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
 * The element a grid view lays its tiles out in, inside the gallery: the
 * gallery itself is the width the narrow rules ask (base.css), so the
 * columns follow the width the content is laid out in under a size.
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

  // Self-cleaning timer: the host disappears from the DOM on every re-render in
  // preview, and the interval has to die with it (otherwise one stacks up per render).
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
      // In preview the slide advances only in Clean view: while editing, nothing
      // should move under the pointer.
      if (ctx.preview && !chromeOff()) return;
      if (!slidesRun({ count, reducedMotion: reducedMotion(), stopped: STOPPED_SLIDES.has(keyOf()), held })) return;
      show(stepIndex(current, 1, count));
    }, normalizeInterval(props.interval) * 1000);
  };
  // The pause that stays (WCAG 2.2.2, the APG carousel's rotation control): a
  // step by hand stops the timer for good as well, and the button plays it again.
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

/**
 * The ribbon view: the tiles roll past in a band, one row or two running
 * against each other. The band fills the block's box (ADR-0025 decision 2),
 * the rows share its height, and a tile is as tall as its row with the image
 * at its own aspect (base.css), so the owner sets the height by the frame.
 * The motion is the ribbon block's (ribbon-model.js and
 * the .urd-ribbon rules in base.css): each row's track holds the tiles in two
 * periods, each as wide as the band needs (syncTrackCopies), and is
 * translated by half its width, so the loop has no seam. Still under reduced
 * motion and while the editing chrome is on, and the pointer or the keyboard
 * holds it, so a tile can be clicked into the lightbox.
 */
function renderRibbon(host, props, ctx, blockEl) {
  host.classList.add('urd-gallery-ribbon');
  host.style.setProperty('--urd-gallery-gap', `${Number(props.gap) || 0}px`);
  const rows = ribbonRows(props.rows);
  // The editing chrome's hold is a CSS rule on the body (base.css), so Clean
  // view takes effect without a re-render.
  const still = !canRoll({ count: props.images.length, reducedMotion: reducedMotion() });

  for (let row = 0; row < rows; row += 1) {
    const band = el2('div', 'urd-ribbon-stripe urd-ribbon-motion-roll');
    if (props.fade !== false) band.classList.add('urd-ribbon-fade');
    if (props.pauseOnHover !== false) band.classList.add('urd-ribbon-pausable');
    if (still) band.classList.add('urd-ribbon-still');
    const track = el2('div', 'urd-ribbon-track');
    // The second row runs against the first, whichever way the first goes.
    const rightwards = (props.direction === 'right') !== (row === 1);
    if (rightwards) track.classList.add('urd-ribbon-right');
    // Every copy is built from the tiles' own factory, so each one carries
    // its load guard and its click into the lightbox.
    const buildRun = () => {
      const row = el2('div', 'urd-ribbon-run');
      props.images.forEach((_, i) => row.appendChild(makeTile(props, i, ctx, blockEl)));
      return row;
    };
    const run = buildRun();
    track.appendChild(run);
    band.appendChild(track);
    host.appendChild(band);

    const measure = () => {
      const width = run.scrollWidth;
      if (!width) return;
      const periods = ribbonPeriods(width, band.clientWidth);
      syncTrackCopies(track, run, periods, buildRun);
      track.style.setProperty('--urd-ribbon-ms', `${ribbonDuration(width * periods, props.speed) * 1000}ms`);
    };
    measure();
    if (typeof ResizeObserver === 'function') {
      const ro = new ResizeObserver(() => {
        if (!run.isConnected) {
          ro.disconnect();
          return;
        }
        measure();
      });
      ro.observe(run);
      ro.observe(band);
    }
  }
  // The pause that stays, where the band actually rolls.
  if (!still) bandPauseControl(host, ribbonPause(props.pause), { pause: 'ribbon.pause', play: 'ribbon.play' });
  // The band's reach (the content surface, the window, or the block's own
  // box) is laid out once the block is in the page, and again when the
  // section changes width.
  if (ribbonWidth(props.width) !== 'content') host.classList.add('urd-ribbon-wide');
  requestAnimationFrame(() => {
    const sectionEl = fitBandReach(host, blockEl, props.width);
    if (sectionEl && typeof ResizeObserver === 'function') {
      const ro = new ResizeObserver(() => {
        if (!host.isConnected) {
          ro.disconnect();
          return;
        }
        fitBandReach(host, blockEl, props.width);
      });
      ro.observe(sectionEl);
    }
  });
}

/**
 * The mosaic view: the grid's wall with tiles in varied spans, dealt by the
 * seed and placed by the pure mosaicWall, so the same pictures always build
 * the same wall and the panel's Shuffle builds another. The rows have one
 * height, and the wall is a full rectangle whatever the number of pictures.
 */
function renderMosaic(host, props, ctx, blockEl) {
  host.classList.add('urd-gallery-wall');
  const { wide, narrow } = columnCounts(host, props, ctx);
  host.style.setProperty('--urd-gallery-gap', `${Number(props.gap) || 0}px`);
  host.style.setProperty('--urd-gallery-row', `${mosaicRowHeight(props.rowHeight)}px`);
  // Two walls from the same seed, one per column count: base.css places each
  // tile by the one that fits the block's width.
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
 * The polaroid view: every picture set in a card with a wider foot, leaning
 * by its own throw of the seed (polaroidTilts). With `captions` the image
 * text is written in the foot. The card straightens under a real pointer
 * (base.css), and the tile inside keeps its click.
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
  grid: renderGrid, carousel: renderCarousel, slides: renderSlides, ribbon: renderRibbon,
  mosaic: renderMosaic, polaroid: renderPolaroid,
};

export const galleryBlock = {
  version: 1,
  // The grid views grow with their pictures on the phone; the ribbon keeps
  // the height of its frame there too, since the band fills the box.
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

    // Auto-grow for the views that are grids of tiles: the height follows the
    // number of images, so the frame follows the content (the same pattern as
    // the collection block). The measurement has to wait until the block is in
    // the DOM: render is called before appendChild.
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
