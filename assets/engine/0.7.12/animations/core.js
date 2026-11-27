/**
 * Core animations: version+migrate registry types, applied as `.urd-anim-*` classes (CSS in base.css); entrances play when scrolled into view.
 * Notes: docs/engine-notes/animations/core.md (Urd repository).
 */

const entranceDefaults = () => ({ duration: 600, delay: 0 });

/*
 * Default step time (ms) between the targets in group entrances: the stagger default and per-card animation (applyCardAnimation) share the same rhythm.
 */
const STAGGER_STEP = 90;

export const coreAnimations = {
  'fade-in': { version: 1, label: 'Fade in', labelKey: 'anim.fadeIn', entrance: true, defaults: entranceDefaults, migrations: {} },
  'slide-up': { version: 1, label: 'Slide up', labelKey: 'anim.slideUp', entrance: true, defaults: entranceDefaults, migrations: {} },
  'zoom-in': { version: 1, label: 'Zoom in', labelKey: 'anim.zoomIn', entrance: true, defaults: entranceDefaults, migrations: {} },
  'hover-lift': { version: 1, label: 'Lift on pointer', labelKey: 'anim.hoverLift', entrance: false, defaults: () => ({}), migrations: {} },
  // Stagger, a section-level group entrance: releases the section's card blocks staggered by `pattern` from one shared trigger, after a base `delay`.
  stagger: {
    version: 1, label: 'Stagger (card group)', labelKey: 'anim.stagger', entrance: true, group: true,
    defaults: () => ({ duration: 600, delay: 0, step: STAGGER_STEP, effect: 'slide-up', pattern: 'sequence' }),
    migrations: {},
  },
};

const STAGGER_EFFECTS = ['fade-in', 'slide-up', 'zoom-in'];

/**
 * A block's pointer effect: its own `hover`, else its section's `blocksHover`, unless the block is decor, has `hover: false` or keeps one in `animation`.
 * @param {object} block
 * @param {object|null|undefined} section
 * @param {(type: string) => boolean} isPointer Whether an animation type is a pointer effect rather than an entrance
 * @returns {object|null}
 */
export function pointerEffectOf(block, section, isPointer) {
  if (block?.hover?.type) return block.hover;
  if (block?.hover === false) return null;
  if (block?.animation?.type && isPointer(block.animation.type)) return null;
  if (block?.decor) return null;
  return section?.blocksHover?.type ? section.blocksHover : null;
}

/**
 * The block's `animation` on this screen: null for an entrance switched off on the phone (`entranceMobile: false`), while a pointer effect stays.
 * @param {object} block
 * @param {'desktop'|'mobile'|undefined} viewport
 * @param {(type: string) => boolean} isPointer Whether an animation type is a pointer effect rather than an entrance
 * @returns {object|null}
 */
export function entranceOf(block, viewport, isPointer) {
  const animation = block?.animation;
  if (!animation?.type) return null;
  if (viewport === 'mobile' && block.entranceMobile === false && !isPointer(animation.type)) return null;
  return animation;
}

/**
 * Delays (ms) for the column and row stagger: positions are clustered with a tolerance, and the wave moves along by ascending position.
 * @param {number[]} positions x or y position in px per card (same order as the cards)
 * @param {number} step Step time in ms
 * @param {number} [tolerance] Max px distance counted as the same cluster
 * @returns {number[]}
 */
export function staggerColumnDelays(positions, step, tolerance = 24) {
  const sorted = [...new Set(positions)].sort((a, b) => a - b);
  const clusterOf = new Map();
  let cluster = -1;
  let prev = null;
  for (const p of sorted) {
    if (prev === null || p - prev > tolerance) cluster += 1;
    clusterOf.set(p, cluster);
    prev = p;
  }
  return positions.map((p) => clusterOf.get(p) * step);
}

/**
 * Delays (ms) for the center stagger, by card index: the middle card (or middle pair) goes first, then the wave moves outwards symmetrically.
 * @param {number} count Number of cards
 * @param {number} step Step time in ms
 * @returns {number[]}
 */
export function staggerCenterDelays(count, step) {
  const mid = (count - 1) / 2;
  return Array.from({ length: count }, (_, i) => Math.floor(Math.abs(i - mid)) * step);
}

/** Shared observer: adds .urd-anim-in the first time the element is visible. */
let observer = null;
// Group entrances (stagger/per-card): the host is observed, but the TARGETS are released.
const staggerGroups = new WeakMap();

/**
 * Releases a group entrance's targets: at once in the preview and with reduced motion, else together the first time the host is visible.
 * @returns {boolean} true when the targets actually wait for visibility
 */
function releaseGroup(host, targets, ctx) {
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  if (ctx.preview || reduced) {
    targets.forEach((el) => el.classList.add('urd-anim-in'));
    return false;
  }
  staggerGroups.set(host, targets);
  entranceObserver().observe(host);
  return true;
}

/**
 * The shared observer: adds `urd-anim-in` once an element is visible, at load too, so its entrance plays; a group host's targets get it instead.
 */
function entranceObserver() {
  observer ??= new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      // An element much taller than the viewport never reaches 15 % visible, so it triggers once its visible part covers half the viewport or more.
      const tall = entry.rootBounds && entry.intersectionRect.height >= entry.rootBounds.height * 0.5;
      if (entry.intersectionRatio < 0.15 && !tall) continue;
      const el = entry.target;
      observer.unobserve(el);
      // Stagger host: release the CHILDREN (each with its staggered delay), not the host.
      const group = staggerGroups.get(el);
      if (group) group.forEach((child) => child.classList.add('urd-anim-in'));
      else el.classList.add('urd-anim-in');
    }
  }, { threshold: [0.05, 0.1, 0.15] });
  return observer;
}

/**
 * Stagger: gives the section's card blocks an entrance effect and a delay by `pattern`, and releases them as one group (`releaseGroup`).
 */
function applyStagger(host, props, ctx) {
  const effect = STAGGER_EFFECTS.includes(props.effect) ? props.effect : 'slide-up';
  const step = Number.isFinite(props.step) ? Math.max(0, props.step) : STAGGER_STEP;
  const base = Number.isFinite(props.delay) ? Math.max(0, props.delay) : 0;
  host.classList.add('urd-anim-stagger');
  // The card blocks: the section's `.urd-block`s except decor, spaces and those with their own entrance (`data-urd-entrance`); a pointer effect is no entrance.
  const targets = [...host.querySelectorAll('.urd-block')]
    .filter((el) => !el.dataset.urdEntrance && !el.dataset.decor && !el.classList.contains('urd-spacer'));
  if (!targets.length) return;
  const delays = props.pattern === 'columns'
    ? staggerColumnDelays(targets.map((el) => el.offsetLeft), step)
    : props.pattern === 'rows'
      ? staggerColumnDelays(targets.map((el) => el.offsetTop), step)
      : props.pattern === 'center'
        ? staggerCenterDelays(targets.length, step)
        : targets.map((_, i) => i * step);
  targets.forEach((el, i) => {
    el.classList.add(`urd-anim-${effect}`);
    if (props.duration != null) el.style.setProperty('--urd-anim-duration', `${props.duration}ms`);
    el.style.setProperty('--urd-anim-delay', `${base + delays[i]}ms`);
  });
  releaseGroup(host, targets, ctx);
}

/**
 * Hooks an already version-lifted animation onto an element; on a rotated block the inline transform wins, and only the opacity part plays.
 * @param {HTMLElement} el
 * @param {string} type Animation type (key in the registry)
 * @param {{duration?: number, delay?: number}} props Lifted props
 * @param {{entrance?: boolean}} def The type definition
 * @param {{preview?: boolean}} [ctx] Render context
 */
export function applyAnimation(el, type, props, def, ctx = {}) {
  // Group animation (stagger): animates the children, not the element itself.
  if (def.group) {
    applyStagger(el, props, ctx);
    return;
  }
  el.classList.add(`urd-anim-${type}`);
  if (props.duration != null) el.style.setProperty('--urd-anim-duration', `${props.duration}ms`);
  if (props.delay != null) el.style.setProperty('--urd-anim-delay', `${props.delay}ms`);
  if (!def.entrance) return;

  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  if (ctx.preview || reduced) {
    el.classList.add('urd-anim-in');
    return;
  }
  entranceObserver().observe(el);
}

/**
 * Per-card animation (`animPerCard`): the entrance plays per card, staggered by index from one shared trigger; a pointer effect goes on each card.
 * @param {HTMLElement} el The block element (the trigger)
 * @param {HTMLElement[]} cards The card elements in order
 * @param {string} type Animation type (key in the registry)
 * @param {{duration?: number, delay?: number}} props Lifted props
 * @param {{entrance?: boolean, group?: boolean}} def The type definition
 * @param {{preview?: boolean}} [ctx] Render context
 */
export function applyCardAnimation(el, cards, type, props, def, ctx = {}) {
  // Stagger is section level and makes no sense per card.
  if (def.group || !cards.length) return;
  if (!def.entrance) {
    for (const card of cards) applyAnimation(card, type, props, def, ctx);
    return;
  }
  const base = Math.max(0, Number(props.delay) || 0);
  cards.forEach((card, i) => {
    card.classList.add(`urd-anim-${type}`);
    if (props.duration != null) card.style.setProperty('--urd-anim-duration', `${props.duration}ms`);
    card.style.setProperty('--urd-anim-delay', `${base + i * STAGGER_STEP}ms`);
  });
  if (releaseGroup(el, cards, ctx)) {
    // After the entrance each card's delay is cleared, so the pointer effect's transition in base.css does not inherit the card's staggered start.
    for (const card of cards) {
      const clearDelay = (event) => {
        if (event.target !== card || event.propertyName !== 'opacity') return;
        card.style.removeProperty('--urd-anim-delay');
        card.removeEventListener('transitionend', clearDelay);
      };
      card.addEventListener('transitionend', clearDelay);
    }
  }
}
