/**
 * The gallery block's ribbon view (blocks/gallery.js), loaded with the view: the tiles roll past in a band, as the ribbon block's items do.
 * Notes: docs/engine-notes/blocks/gallery-ribbon.md (Urd repository).
 */
import { ribbonDuration, ribbonRows, ribbonPeriods, canRoll, ribbonWidth, ribbonPause } from '../ribbon-model.js';
import { syncTrackCopies, fitBandReach, bandPauseControl } from './ribbon.js';

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** An element with a class. */
function el2(tag, className) {
  const el = document.createElement(tag);
  el.className = className;
  return el;
}

/**
 * The ribbon view: the tiles, made by the gallery's own factory (`makeTile`), roll past in a band, one row or two running against each other.
 * @param {HTMLElement} host The gallery's box
 * @param {object} props The gallery's props
 * @param {object} ctx Render context
 * @param {HTMLElement} blockEl The block element
 * @param {(props: object, index: number, ctx: object, blockEl: HTMLElement) => HTMLElement} makeTile
 */
export function renderRibbon(host, props, ctx, blockEl, makeTile) {
  host.classList.add('urd-gallery-ribbon');
  host.style.setProperty('--urd-gallery-gap', `${Number(props.gap) || 0}px`);
  const rows = ribbonRows(props.rows);
  // The editing chrome's hold is a CSS rule on the body (preview.css), so Clean view takes effect without a re-render.
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
    // Every copy is built from the tiles' own factory, so each one carries its load guard and its click into the lightbox.
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
  // The band's reach (the content surface, the window or the block's own box) is laid out once the block is in the page, and again as the section's width changes.
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
