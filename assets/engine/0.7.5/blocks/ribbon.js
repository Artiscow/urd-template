/**
 * Core block: ribbon. A band of words that rolls across the page, the frieze
 * every builder has and none of them needs a library for. The band is up to
 * three stripes: a thin one above, the main one, and a thin one below. Each
 * stripe holds the words, the separator mark over and over, or nothing but
 * colour, so a plain rule above a rolling line is one block rather than three.
 *
 * The motion is the background loop layer's idiom (.urd-bg-loop-runner in
 * base.css): a stripe's track holds its content in two equal periods inside a
 * clipping row and is translated by half its width, so one period lands
 * exactly where the previous one started and the loop has no seam. A period
 * is as many copies as it takes to reach across the band (ribbonPeriods and
 * syncTrackCopies), and every copy but the first is aria-hidden, so the words
 * are read once. For `roll` the duration is the measured width of one period
 * divided by the speed (ribbonDuration), for `sway` the width of the one copy
 * that drifts out and back, and for `step` the item count times the dwell
 * (ribbonStepDuration), since a ticker is timed per word and not per pixel,
 * with keyframes measured per word (stepFrames). A ResizeObserver measures
 * again when the width changes.
 *
 * ADR-0011 gating: under prefers-reduced-motion the words stand as a static
 * row, and while the editing chrome is on the band stands still so the words
 * can be read and edited. The panel's «Play the motion» (urd-demo-motion) and
 * Clean view both show the real thing.
 */
import { growSectionTo } from '../render.js';
import {
  ribbonItems, ribbonDuration, ribbonStepDuration, ribbonPeriods, separatorMark, clampTilt, ribbonSize,
  ribbonMotion, ribbonWidth, ribbonMoves, mainMode, stripeMode, stripePlace, clampThickness, bandReach,
  ribbonPause,
} from '../ribbon-model.js';
import { resolveColor } from '../theme.js';
// ta/adminLocaleReady: only called in preview (after the admin dictionary is loaded), never at module level.
import { t, ta, adminLocaleReady } from '../i18n.js';

const post = (msg) => window.parent?.postMessage(msg, location.origin);
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** How many marks a mark stripe carries before the track is copied. */
const MARK_RUN = 16;

/** The drawn separators, on the same 24x24 grid as the icon library. */
const MARKS = {
  dot: '<circle cx="12" cy="12" r="3"/>',
  dash: '<rect x="3" y="10.6" width="18" height="2.8" rx="1.4"/>',
  slash: '<path d="M15.5 3.5L8.5 20.5" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" fill="none"/>',
  star: '<path d="M12 2.8l2.3 6.1 6.5.4-5 4.1 1.6 6.3-5.4-3.5-5.4 3.5 1.6-6.3-5-4.1 6.5-.4z"/>',
};

const markSvg = (id) =>
  `<svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" aria-hidden="true">${MARKS[id] ?? MARKS.dot}</svg>`;

/** A separator node, drawn or written. */
function sepNode(sep) {
  const mark = document.createElement('span');
  mark.className = 'urd-ribbon-sep';
  mark.setAttribute('aria-hidden', 'true');
  if (sep.kind === 'draw') mark.innerHTML = markSvg(sep.value);
  else mark.textContent = sep.value;
  return mark;
}

/**
 * One copy of a stripe's content. The separator sits after every item, so the
 * last one meets the first across the seam with the same spacing.
 * @param {string} mode text or marks
 * @param {Array<string>} items
 * @param {{kind: string, value: string}} sep
 * @param {boolean} editable Only the main stripe's first copy is typed in
 * @returns {HTMLDivElement}
 */
function buildRun(mode, items, sep, editable) {
  const run = document.createElement('div');
  run.className = 'urd-ribbon-run';
  if (mode === 'marks') {
    // A mark stripe is the separator over and over: a rule with rhythm.
    const mark = sep.kind === 'none' ? { kind: 'draw', value: 'dot' } : sep;
    for (let i = 0; i < MARK_RUN; i += 1) run.appendChild(sepNode(mark));
    return run;
  }
  items.forEach((text, index) => {
    const word = document.createElement('span');
    word.className = 'urd-ribbon-item';
    word.textContent = text;
    if (editable) word.dataset.ribbonIndex = String(index);
    run.appendChild(word);
    if (sep.kind !== 'none') run.appendChild(sepNode(sep));
  });
  return run;
}

/**
 * Lays a band out over its reach (ribbonWidth, bandReach): the content
 * surface or the window's full width, measured from the section and the
 * canvas, since vw would count the scrollbar too. The block's own box needs
 * nothing. The ancestors are looked up when called, after the block is in
 * the page.
 * @param {HTMLElement} host The band's element inside the block
 * @param {HTMLElement} el The block element
 * @param {string} [width] The block's `width`
 * @returns {HTMLElement|null} The section, to observe for a change of reach; null when nothing was laid out
 */
export function fitBandReach(host, el, width) {
  const mode = ribbonWidth(width);
  if (mode === 'content' || !el.isConnected) return null;
  const sectionEl = el.closest('.urd-section');
  const canvasEl = el.closest('.urd-canvas');
  if (!sectionEl || !canvasEl) return null;
  const reach = bandReach(mode, { sectionW: sectionEl.offsetWidth, canvasW: canvasEl.clientWidth, canvasLeft: canvasEl.offsetLeft, blockLeft: el.offsetLeft });
  host.style.width = `${reach.width}px`;
  host.style.marginLeft = `${reach.offset}px`;
  return sectionEl;
}

/**
 * The copies of a run that fill a track: two periods of `periods` copies each,
 * the first copy being the run itself. Without `build` a copy is a clone the
 * reader never meets (aria-hidden and inert, and stripped of the editing
 * hooks), so the words are read once. With `build` the caller makes each copy
 * itself, for content that carries listeners a clone would lose (the
 * gallery's tiles: their load guard and their click); such a copy answers the
 * pointer, and is kept out of the reading and tab order instead of inert.
 * @param {HTMLElement} track
 * @param {HTMLElement} run The first copy, built by the caller
 * @param {number} periods From ribbonPeriods
 * @param {() => HTMLElement} [build] Makes one more copy of the run
 */
export function syncTrackCopies(track, run, periods, build) {
  const wanted = periods * 2 - 1;
  if (track.children.length - 1 === wanted) return;
  while (track.children.length > 1) track.lastElementChild.remove();
  for (let i = 0; i < wanted; i += 1) {
    const copy = build ? build() : run.cloneNode(true);
    copy.setAttribute('aria-hidden', 'true');
    if (build) {
      for (const node of copy.querySelectorAll('a, button')) node.tabIndex = -1;
    } else {
      copy.inert = true;
      for (const node of copy.querySelectorAll('[contenteditable], [data-ribbon-index], [tabindex]')) {
        node.removeAttribute('contenteditable');
        node.removeAttribute('tabindex');
        delete node.dataset.ribbonIndex;
      }
    }
    track.appendChild(copy);
  }
}

let stepSeq = 0;

/**
 * The ticker's own keyframes: one stop per item at the item's measured left
 * edge, held with a step-end timing, so every jump lands on a word and not on
 * a fraction of the width. The frames cover one period of `periods` copies
 * and end a whole period in, where the next copy stands exactly as the first.
 * @param {HTMLElement} stripe Where the style element lives
 * @param {HTMLElement} run The first copy
 * @param {number} periods From ribbonPeriods
 * @param {number} runWidth The width of one copy, in px
 * @returns {string} The animation name
 */
function stepFrames(stripe, run, periods, runWidth) {
  const stops = [...run.querySelectorAll(':scope > .urd-ribbon-item')];
  const nodes = stops.length ? stops : [...run.children];
  if (!nodes.length) return 'urd-ribbon-roll';
  const offsets = nodes.map((node) => node.offsetLeft - run.offsetLeft);
  const total = nodes.length * periods;
  const frames = [];
  for (let j = 0; j < total; j += 1) {
    const x = offsets[j % nodes.length] + Math.floor(j / nodes.length) * runWidth;
    frames.push(`${((j / total) * 100).toFixed(3)}% { transform: translateX(${-x}px); }`);
  }
  frames.push(`100% { transform: translateX(${-runWidth * periods}px); }`);
  const name = `urd-ribbon-step-${(stepSeq += 1)}`;
  let style = stripe.querySelector(':scope > style');
  if (!style) {
    style = document.createElement('style');
    stripe.appendChild(style);
  }
  style.textContent = `@keyframes ${name} { ${frames.join(' ')} }`;
  return name;
}

/**
 * One stripe: a clipping row with a track that holds its content as many
 * times as the band needs (syncTrackCopies). A `plain` stripe is colour alone
 * and has no track to measure or move, and a swaying stripe drifts out and
 * back with its one copy.
 * @returns {{el: HTMLElement, measure: () => void, run: HTMLElement|null}}
 */
export const PAUSE_ICON = '<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor"/><rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor"/></svg>';
export const PLAY_ICON = '<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z" fill="currentColor"/></svg>';

/** The bands the visitor has paused, by block id: the choice outlives a re-render of the block. */
const PAUSED_BANDS = new Set();

/**
 * The band's pause (WCAG 2.2.2: moving content that lasts more than five
 * seconds needs a pause that stays). A real button with aria-pressed at the
 * band's right edge in the «button» form; in the «touch» form it is there for
 * the keyboard only, shown while it has focus, and a touch on the band pauses
 * it, a later tap on its empty space plays it again. The pointer over the band
 * and focus inside it hold it for as long as they stay (urd-ribbon-pausable in
 * base.css). Shared with the gallery's band view; the calendar's Band design
 * has its own (bandPause in calendar-next.js).
 * @param {HTMLElement} host The band's box: urd-ribbon-paused goes here, and the button into it
 * @param {'button'|'touch'} mode The form, from ribbonPause
 * @param {{pause: string, play: string}} keys The visitor dictionary keys for the two labels
 */
export function bandPauseControl(host, mode, keys) {
  // The block is in the page only after the render, so the id is read when it is needed.
  const keyOf = () => host.closest('[data-block-id]')?.dataset.blockId ?? '';
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'urd-ribbon-pause';
  const paint = () => {
    const paused = PAUSED_BANDS.has(keyOf());
    host.classList.toggle('urd-ribbon-paused', paused);
    button.setAttribute('aria-pressed', String(paused));
    button.setAttribute('aria-label', t(paused ? keys.play : keys.pause));
    button.title = button.getAttribute('aria-label');
    button.innerHTML = paused ? PLAY_ICON : PAUSE_ICON;
  };
  const set = (paused) => {
    if (paused) PAUSED_BANDS.add(keyOf());
    else PAUSED_BANDS.delete(keyOf());
    paint();
  };
  button.addEventListener('click', (event) => {
    event.stopPropagation();
    set(!PAUSED_BANDS.has(keyOf()));
  });
  if (mode === 'touch') {
    host.classList.add('urd-ribbon-touch');
    // The touch that pauses is not the tap that plays: only a later tap on the band's empty space does.
    let pausedByThisTouch = false;
    host.addEventListener('pointerdown', (event) => {
      if (button.contains(event.target)) return;
      pausedByThisTouch = event.pointerType === 'touch' && !PAUSED_BANDS.has(keyOf());
      if (pausedByThisTouch) set(true);
    });
    host.addEventListener('click', (event) => {
      if (pausedByThisTouch) pausedByThisTouch = false;
      else if (PAUSED_BANDS.has(keyOf()) && !event.target.closest('a, button, [contenteditable], .urd-gallery-tile')) set(false);
    });
  }
  paint();
  requestAnimationFrame(paint);
  host.appendChild(button);
  return button;
}

function buildStripe({ mode, items, sep, motion, still, props, editable, count, colour }) {
  const el = document.createElement('div');
  el.className = `urd-ribbon-stripe urd-ribbon-motion-${motion}`;
  // One colour serves both kinds of stripe: a plain one paints its surface
  // with currentColor, and a stripe with content inks its words and marks.
  if (colour) el.style.color = resolveColor(colour);
  if (props.fade !== false && motion !== 'none') el.classList.add('urd-ribbon-fade');
  if (props.pauseOnHover !== false && motion !== 'none') el.classList.add('urd-ribbon-pausable');
  if (still) el.classList.add('urd-ribbon-still');
  if (mode === 'plain') {
    el.classList.add('urd-ribbon-solid');
    return { el, measure: () => {}, run: null };
  }

  const track = document.createElement('div');
  track.className = 'urd-ribbon-track';
  if (props.direction === 'right') track.classList.add('urd-ribbon-right');
  const run = buildRun(mode, items, sep, editable);
  track.appendChild(run);
  const loops = motion === 'roll' || motion === 'step';
  // The ticker holds each stop until the next jump (stepFrames).
  if (motion === 'step') track.style.animationTimingFunction = 'step-end';
  el.appendChild(track);

  const measure = () => {
    if (motion === 'none') return;
    const runWidth = run.scrollWidth;
    if (!runWidth) return;
    let seconds;
    if (!loops) {
      seconds = ribbonDuration(runWidth, props.speed);
    } else {
      const periods = ribbonPeriods(runWidth, el.clientWidth);
      syncTrackCopies(track, run, periods);
      if (motion === 'step') {
        track.style.animationName = stepFrames(el, run, periods, runWidth);
        seconds = ribbonStepDuration(count * periods, props.dwell);
      } else {
        seconds = ribbonDuration(runWidth * periods, props.speed);
      }
    }
    track.style.setProperty('--urd-ribbon-ms', `${seconds * 1000}ms`);
  };
  return { el, measure, run };
}

export const ribbonBlock = {
  version: 1,
  autoGrow: true,
  label: 'Ribbon',
  labelKey: 'blocks.ribbon',
  // The seed rule (ADR-0012): ta() is called only here, on insertion in preview.
  defaults: () => ({
    items: [ta('seed.ribbonBlock.a'), ta('seed.ribbonBlock.b'), ta('seed.ribbonBlock.c')],
    sep: 'dot',
    motion: 'roll',
    width: 'canvas',
    main: 'text',
    above: 'none',
    below: 'none',
    stripePlace: 'stack',
    thickness: 8,
    speed: 60,
    dwell: 2.5,
    direction: 'left',
    pauseOnHover: true,
    pause: 'button',
    variant: 'band',
    size: 'md',
    caps: false,
    weight: 'normal',
    outline: false,
    tilt: 0,
    fade: true,
    gap: 40,
  }),
  migrations: {},
  /**
   * @param {HTMLElement} el
   * @param {object} props See defaults; every choice is allowlisted in ribbon-model.js
   * @param {object} ctx Render context
   */
  render(el, props, ctx) {
    const items = ribbonItems(props.items);
    const editable = Boolean(ctx.preview) && ctx.viewport !== 'mobile';
    const motion = ribbonMotion(props.motion);
    const main = mainMode(props.main);
    const above = stripeMode(props.above);
    const below = stripeMode(props.below);
    // Nothing to draw at all: no words, and no stripe that stands on its own.
    if (!items.length && main === 'text' && above === 'none' && below === 'none') {
      if (ctx.preview) {
        const empty = document.createElement('div');
        empty.className = 'urd-ribbon-empty';
        empty.textContent = ta('canvas.ribbonEmpty');
        el.appendChild(empty);
      }
      return;
    }

    const host = document.createElement('div');
    host.className = `urd-ribbon urd-ribbon-${props.variant === 'plain' ? 'plain' : 'band'}`
      + ` urd-ribbon-size-${ribbonSize(props.size)}`;
    if (props.caps === true) host.classList.add('urd-ribbon-caps');
    if (props.outline === true) host.classList.add('urd-ribbon-outline');
    if (props.weight === 'bold') host.classList.add('urd-ribbon-bold');
    const tilt = clampTilt(props.tilt);
    if (tilt) host.style.setProperty('--urd-ribbon-tilt', `${tilt}deg`);
    host.style.setProperty('--urd-ribbon-gap', `${Math.min(120, Math.max(8, Number(props.gap) || 40))}px`);
    host.style.setProperty('--urd-ribbon-thin', `${clampThickness(props.thickness)}px`);
    if (props.variant !== 'plain') host.style.background = resolveColor(props.bg || 'accent');
    const ink = resolveColor(props.color || (props.variant === 'plain' ? 'text' : 'accent-text'));
    host.style.color = ink;
    // The outline strokes with the resolved colour, never currentColor: an
    // outlined word has no fill, so currentColor would be transparent too.
    host.style.setProperty('--urd-ribbon-ink', ink);

    // The chrome's hold is a CSS rule on the body (base.css): Clean view never
    // re-renders, so a class decided here would stick. What is decided here is
    // only what cannot change without a new render.
    const reduced = reducedMotion();
    const stripes = [];
    // The thin stripes run against the main one, the way the gallery's second
    // row does: two bands going the same way read as one wide band.
    const opposed = { ...props, direction: props.direction === 'right' ? 'left' : 'right' };
    const sep = separatorMark(props.sep, props.sepText);
    const countFor = (mode) => (mode === 'marks' ? MARK_RUN : Math.max(1, items.length));
    const add = (mode, own, classes, canEdit, colour) => {
      if (mode === 'none') return;
      // Each stripe decides for itself whether it has something to move: a
      // stripe of marks rolls with no words at all.
      const count = countFor(mode);
      const stripe = buildStripe({
        mode, items, sep, motion, still: !ribbonMoves({ count, motion, reducedMotion: reduced }), props: own, editable: canEdit, count, colour,
      });
      stripe.el.classList.add(...classes);
      host.appendChild(stripe.el);
      stripes.push(stripe);
    };
    // On the edges the thin stripes lie on the band's own border instead of
    // taking a share of its height.
    if (stripePlace(props.stripePlace) === 'edge' && (above !== 'none' || below !== 'none')) host.classList.add('urd-ribbon-edges');
    add(above, opposed, ['urd-ribbon-thin', 'urd-ribbon-above'], false, props.aboveColor);
    add(main, props, ['urd-ribbon-main'], editable && main === 'text', null);
    add(below, opposed, ['urd-ribbon-thin', 'urd-ribbon-below'], false, props.belowColor);
    // The pause that stays, where something actually moves.
    if (host.querySelector('.urd-ribbon-stripe:not(.urd-ribbon-still) .urd-ribbon-track')) {
      bandPauseControl(host, ribbonPause(props.pause), { pause: 'ribbon.pause', play: 'ribbon.play' });
    }
    el.appendChild(host);

    // A band that reaches past its block (the content surface or the window)
    // is laid out in the frame below: render runs before the block is in the DOM.
    const wide = ribbonWidth(props.width) !== 'content';
    if (wide) host.classList.add('urd-ribbon-wide');
    const fitWide = () => fitBandReach(host, el, props.width);

    if (editable && main === 'text') {
      // Click-and-type on each word in the main stripe; the list and its order
      // live in the panel.
      const mainRun = host.querySelector('.urd-ribbon-main .urd-ribbon-run');
      for (const word of mainRun?.querySelectorAll('.urd-ribbon-item') ?? []) {
        try {
          word.contentEditable = 'plaintext-only';
        } catch {
          word.contentEditable = 'true';
        }
        word.addEventListener('input', () => {
          const next = [...mainRun.querySelectorAll('.urd-ribbon-item')].map((node) => node.textContent ?? '');
          post({
            type: 'urd-edit',
            sectionId: ctx.section.id,
            blockId: el.dataset.blockId,
            props: { ...props, items: next },
          });
        });
      }
    }
    if (editable) {
      // The help chip (ADR-0008): the band has special functions and explains itself.
      Promise.all([import('../hint.js'), adminLocaleReady]).then(([{ attachHint }]) => {
        if (!el.isConnected || el.querySelector('.urd-hint-chip')) return;
        attachHint(el, {
          title: ta('hintRibbon.title'),
          lines: [ta('hintRibbon.l1'), ta('hintRibbon.l2'), ta('hintRibbon.l3')],
        });
      });
    }

    // Everything that has to be measured waits for the frame after the block
    // has been put in the page: the width of each track, the reach of a
    // full-width band, and the height the block needs (auto-grow, where the
    // blocks below are moved by the push pass, ADR-0024).
    requestAnimationFrame(() => {
      if (!el.isConnected) return;
      for (const stripe of stripes) stripe.measure();
      fitWide();
      if (typeof ResizeObserver === 'function') {
        const ro = new ResizeObserver(() => {
          if (!host.isConnected) {
            ro.disconnect();
            return;
          }
          for (const stripe of stripes) stripe.measure();
          fitWide();
        });
        for (const stripe of stripes) {
          if (!stripe.run) continue;
          ro.observe(stripe.run);
          ro.observe(stripe.el);
        }
        const sectionEl = wide ? el.closest('.urd-section') : null;
        if (sectionEl) ro.observe(sectionEl);
      }
      const needed = host.offsetHeight;
      if (needed && Math.abs(needed - el.clientHeight) > 8 && ctx.viewport !== 'mobile') {
        el.style.height = `${needed}px`;
        const sectionEl = el.closest('.urd-section');
        if (sectionEl) growSectionTo(sectionEl, el.offsetTop + needed + 24);
      }
    });
  },
};
