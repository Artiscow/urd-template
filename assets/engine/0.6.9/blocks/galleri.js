/**
 * Kjerneblokk: galleri. Én blokk med tre visninger (Squarespace-modellen:
 * visningen er en prop, ikke egne blokktyper): rutenett (grid), karusell
 * (carousel, sidescroll med snap) og lysbilde (slides, ett bilde om gangen
 * med automatisk fremrykk).
 *
 * Bildene bor i props.images med samme ikke-destruktive stilvokabular som
 * bildeblokken (style: fit/x/y/zoom/filtre); flisene rendres med den delte
 * applyImageStyle. Hos besøkende åpner klikk lightboxen (props.lightbox);
 * i preview åpner klikk bildeeditoren, og i Ren visning lightboxen, så
 * eieren får prøvd den før publisering. Lenke (href) vinner alltid over
 * lightbox.
 *
 * Lysbilde-timeren er motorens første setInterval: den rydder seg selv når
 * verten forsvinner fra DOM (re-render-churn), står stille ved redusert
 * bevegelse, i skjulte faner, og i preview med redigeringschrome på.
 */
import { applyImageStyle } from './image.js';
import { stepIndex, canAutoplay, normalizeInterval, gridColumns } from '../galleri-model.js';
import { isSafeHref } from '../nav-model.js';
// ta/adminLocaleReady: kun kallt i preview (etter at admin-ordboka er lastet), aldri på modulnivå.
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

/** Bildeeditoren for én flis: adapteren leser/skriver props.images[index] og
 *  melder hele props til editoren (som eier utkastet). Fjern sletter flisen. */
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

/** Én flis: ramme som klipper + img med den delte bildestilen. Elementet
 *  velges etter hva klikket skal gjøre: lenke (a), klikkbar (button) eller ren pynt (span). */
function makeTile(props, index, ctx, blockEl) {
  const img = props.images[index];
  // Delt vokter (nav/footer + interne stier/anker): utrygg href gir flis uten lenke (lightbox tar over).
  const asLink = Boolean(img.href) && isSafeHref(img.href) && !ctx.preview;
  const clickable = ctx.preview || props.lightbox;
  const tile = el2(asLink ? 'a' : clickable ? 'button' : 'span', 'urd-galleri-tile');
  if (asLink) tile.href = img.href;
  if (tile.tagName === 'BUTTON') tile.type = 'button';

  const image = document.createElement('img');
  image.src = img.src;
  image.loading = 'lazy';
  image.draggable = false;
  // Samme lastevern som bildeblokken: vis bildet komplett, aldri stripevis.
  if (!image.complete) {
    image.style.visibility = 'hidden';
    image.addEventListener('load', () => { image.style.visibility = ''; }, { once: true });
    image.addEventListener('error', () => { image.style.visibility = ''; }, { once: true });
  }
  tile.appendChild(image);
  applyImageStyle(tile, { ...(img.style ?? {}), alt: img.alt, radius: props.radius });

  if (ctx.preview) {
    // Chrome på: bildeeditoren. Ren visning: lightboxen, som hos besøkende.
    // Avgjørelsen tas ved klikk, så Ren visning-bryteren ikke trenger re-render.
    tile.classList.add('urd-galleri-edit');
    tile.title = 'Klikk for å redigere bildet';
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

function renderGrid(host, props, ctx, blockEl) {
  host.classList.add('urd-galleri-grid');
  host.style.setProperty('--urd-galleri-cols', String(gridColumns(props.columns, props.images.length, ctx.viewport)));
  host.style.setProperty('--urd-galleri-gap', `${Number(props.gap) || 0}px`);
  props.images.forEach((_, i) => host.appendChild(makeTile(props, i, ctx, blockEl)));
}

function navButton(dir, label, onclick) {
  const btn = el2('button', `urd-galleri-nav urd-galleri-${dir}`);
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
  host.classList.add('urd-galleri-carousel');
  const track = el2('div', 'urd-galleri-track');
  props.images.forEach((_, i) => track.appendChild(makeTile(props, i, ctx, blockEl)));
  host.appendChild(track);
  if (props.images.length > 1) {
    const behavior = reducedMotion() ? 'auto' : 'smooth';
    host.appendChild(navButton('prev', t('gallery.prevImages'), () => track.scrollBy({ left: -track.clientWidth * 0.8, behavior })));
    host.appendChild(navButton('next', t('gallery.nextImages'), () => track.scrollBy({ left: track.clientWidth * 0.8, behavior })));
  }
}

function renderSlides(host, props, ctx, blockEl) {
  host.classList.add('urd-galleri-slides');
  const count = props.images.length;
  const slides = props.images.map((_, i) => {
    const slide = el2('div', 'urd-galleri-slide');
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

  // Selvryddende timer: verten forsvinner fra DOM ved hver re-render i
  // preview, og da må intervallet dø med den (ellers stables ett per render).
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
      // I preview rykker lysbildet kun frem i Ren visning: mens man
      // redigerer skal ingenting bevege seg under pekeren.
      if (ctx.preview && !chromeOff()) return;
      show(stepIndex(current, 1, count));
    }, normalizeInterval(props.interval) * 1000);
  };
  const manual = (delta) => {
    show(stepIndex(current, delta, count));
    startTimer();
  };

  if (count > 1) {
    host.appendChild(navButton('prev', t('gallery.prevImage'), () => manual(-1)));
    host.appendChild(navButton('next', t('gallery.nextImage'), () => manual(1)));
    const dotRow = el2('div', 'urd-galleri-dots');
    props.images.forEach((_, i) => {
      const dot = el2('button', 'urd-galleri-dot urd-galleri-nav');
      dot.type = 'button';
      dot.setAttribute('aria-label', t('gallery.imageN', { n: i + 1 }));
      dot.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        show(i);
        startTimer();
      });
      dots.push(dot);
      dotRow.appendChild(dot);
    });
    host.appendChild(dotRow);
  }
  show(0);
  startTimer();
}

const VIEWS = { grid: renderGrid, carousel: renderCarousel, slides: renderSlides };

export const galleriBlock = {
  version: 1,
  label: 'Galleri',
  labelKey: 'blocks.galleri',
  defaults: () => ({
    images: [], view: 'grid', columns: 3, gap: 12, radius: 'md', lightbox: true, interval: 5,
  }),
  migrations: {},
  /**
   * @param {HTMLElement} el
   * @param {{images: Array<{src: string, alt?: string, href?: string|null, style?: object}>,
   *          view: 'grid'|'carousel'|'slides', columns: number, gap: number,
   *          radius: string|null, lightbox: boolean, interval: number}} props
   * @param {object} ctx
   */
  render(el, props, ctx) {
    if (!props.images?.length) {
      if (ctx.preview) el.appendChild(el2('div', 'urd-galleri-empty', 'Legg til bilder i Egenskaper'));
      return;
    }
    const host = el2('div', 'urd-galleri');
    el.appendChild(host);
    (VIEWS[props.view] ?? renderGrid)(host, props, ctx, el);

    // Hjelpechipen (ADR-0008): blokken har spesialfunksjoner og forklarer seg selv.
    if (ctx.preview && ctx.viewport !== 'mobile') {
      // adminLocaleReady: første render kan skje før ordboka er lastet i boot.
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

    // Autovekst for rutenettet: radhøyden følger antall bilder, så rammen
    // følger innholdet (samme mønster som samling-blokken). Målingen må
    // vente til blokken står i DOM: render kalles før appendChild.
    if (props.view === 'grid' && ctx.viewport !== 'mobile') requestAnimationFrame(() => {
      if (!el.isConnected) return;
      const needed = host.scrollHeight;
      if (Math.abs(needed - el.clientHeight) > 8) {
        el.style.height = `${needed}px`;
        const sectionEl = el.closest('.urd-section');
        if (sectionEl) {
          const bottom = el.offsetTop + needed + 24;
          const current = Number.parseFloat(sectionEl.style.minHeight) || 0;
          if (bottom > current) sectionEl.style.minHeight = `${bottom}px`;
        }
        if (ctx.preview) {
          const block = ctx.section?.blocks?.find((b) => b.id === el.dataset.blockId);
          if (block && block.frames.desktop.h !== needed) {
            block.frames.desktop = { ...block.frames.desktop, h: needed };
            // KUN høyden meldes (urd-grow), aldri hele framen: ellers ville en
            // dratt blokk teleporteres tilbake til snapshotets gamle x/y.
            post({ type: 'urd-grow', sectionId: ctx.section.id, blockId: el.dataset.blockId, h: needed });
          }
        }
      }
    });
  },
};
