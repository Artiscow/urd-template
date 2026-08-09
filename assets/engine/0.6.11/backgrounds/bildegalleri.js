/**
 * Bakgrunnslag: bildegalleri. Blar gjennom flere bilder med myk krysstoning
 * (hero-galleri). Med ett bilde, eller når den besøkende foretrekker
 * redusert bevegelse, degraderer laget til et statisk bildelag.
 *
 * Krysstoningen bruker to stablede barn (.urd-bg-slide) som bytter på å
 * være synlige; neste bilde forhåndslastes FØR toningen starter, så det
 * aldri tones inn mot et halvlastet bilde. Timeren rydder seg selv når
 * laget forsvinner fra DOM (re-render-churn i preview).
 */
import { canAutoplay, normalizeInterval, stepIndex } from '../galleri-model.js';
import { bgSize, bgPosition } from './image.js';

export const bildegalleriLayer = {
  version: 1,
  label: 'Bildegalleri',
  labelKey: 'bgLayer.bildegalleri',
  defaults: () => ({ images: [], fit: 'cover', interval: 6, fade: 1.5, opacity: 1, blur: 0 }),
  migrations: {},
  /**
   * @param {HTMLElement} el
   * @param {{images: Array<{src: string, x?: number, y?: number}>, fit: 'cover'|'contain',
   *          interval?: number, fade?: number, opacity?: number, blur?: number}} props
   */
  render(el, props) {
    const images = (props.images ?? []).filter((img) => img?.src);
    if (!images.length) return;

    el.classList.add('urd-bg-galleri');
    el.style.opacity = String(props.opacity ?? 1);
    // Litt overskalering ved blur, så kantene ikke "blør" transparent
    // (samme triks som bildelaget).
    if (props.blur > 0) {
      el.style.filter = `blur(${props.blur}px)`;
      el.style.inset = `-${props.blur * 2}px`;
    }
    const fade = Math.max(0, Number(props.fade) || 0);
    el.style.setProperty('--urd-bgg-fade', `${fade}s`);

    const paint = (slide, img) => {
      slide.style.backgroundImage = `url("${img.src}")`;
      slide.style.backgroundSize = bgSize(props.fit);
      slide.style.backgroundRepeat = 'no-repeat';
      slide.style.backgroundPosition = bgPosition(img.x, img.y);
    };

    // Samme lastevern som bildelaget: hold laget usynlig til første bilde
    // er ferdig lastet, så det aldri dukker opp stripevis.
    const probe = new Image();
    probe.src = images[0].src;
    if (!probe.complete) {
      el.style.visibility = 'hidden';
      const show = () => { el.style.visibility = ''; };
      probe.addEventListener('load', show, { once: true });
      probe.addEventListener('error', show, { once: true });
    }

    const first = document.createElement('div');
    first.className = 'urd-bg-slide on';
    paint(first, images[0]);
    el.appendChild(first);

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!canAutoplay({ count: images.length, reducedMotion: reduced })) return;

    const other = document.createElement('div');
    other.className = 'urd-bg-slide';
    el.appendChild(other);

    let index = 0;
    let front = first;
    // Toningen må rekke å bli ferdig før neste bytte.
    const ms = Math.max(normalizeInterval(props.interval, { fallback: 6 }), fade + 0.5) * 1000;
    const timerId = setInterval(() => {
      if (!el.isConnected) {
        clearInterval(timerId);
        return;
      }
      if (document.hidden) return;
      const nextIndex = stepIndex(index, 1, images.length);
      const next = new Image();
      next.src = images[nextIndex].src;
      const swap = () => {
        if (!el.isConnected) return;
        const back = front === first ? other : first;
        paint(back, images[nextIndex]);
        back.classList.add('on');
        front.classList.remove('on');
        front = back;
        index = nextIndex;
      };
      if (next.complete) {
        swap();
      } else {
        next.addEventListener('load', swap, { once: true });
        // Et ødelagt bilde hoppes over, så rulleringen ikke står fast på det.
        next.addEventListener('error', () => { index = nextIndex; }, { once: true });
      }
    }, ms);
  },
};
