/**
 * The preview's editing of the calendar: its words written in place, their hints, the help chip, the example events and the block menu's variants.
 */
import { ta, adminLocaleReady } from '../i18n.js';
import { attachEditing, loadCard } from './calendar.js';
import { calendarParts, loadDesign, DESIGN_MODULES } from './calendar-load.js';

/** The calendars whose bar turned the example events on or off, by block id; a calendar not listed shows them while it has no sources. */
const EXAMPLES = new Map();

/** What each calendar in the editor shows, by block id: its box, whether the example events stand in, why its feed gave none, and its redraw. */
const SHOWN = new Map();

/** What a calendar shows, for its bar's button: whether the example events stand in, and why its feed gave none; null until it is drawn. */
export function calendarExamples(blockId) {
  const state = SHOWN.get(blockId);
  return state ? { examples: state.examples, reason: state.reason?.() ?? null } : null;
}

/** The example events on or off for a calendar in the editor, for the session, and the calendar drawn again with them. */
export function toggleCalendarExamples(blockId) {
  const state = SHOWN.get(blockId);
  if (!state) return;
  EXAMPLES.set(blockId, !state.examples);
  state.redraw();
}

/* ---------- The views' names (the variants in the block menus) ---------- */

/** View id + label KEY (looked up with ta at use time; never at module level). */
const VIEW_NAMES = [['list', 'calendar.viewList'], ['cards', 'calendar.viewCards'], ['month', 'calendar.viewMonth'], ['next', 'calendar.viewNext'], ['agenda', 'calendar.viewAgenda']];

/* ---------- The designs in the block menu ---------- */

/** A variant per design beside the plain views: filled when the design model is loaded. */
let designVariants = [];

function keepDesignVariants(cd) {
  designVariants = cd.CAL_DESIGNS.filter((d) => d.id !== 'plain').map((d) => ({ label: d.id, labelKey: d.labelKey, props: { design: d.id, view: d.view } }));
}

/**
 * Loads what a calendar draws with, each design's renderer among it, so a calendar added in the editor draws at once.
 * @returns {Promise<void>}
 */
function warmCalendar() {
  return calendarParts().then(() => Promise.all([...Object.keys(DESIGN_MODULES).map(loadDesign), loadCard()])).then(() => {}, () => {});
}

// In the preview: the design model loads at once for the block menu, and what a calendar draws with once the editor is idle.
if (typeof location !== 'undefined' && new URLSearchParams(location.search).has('preview')) {
  import('../calendar-designs.js').then(keepDesignVariants, () => {});
  if (typeof requestIdleCallback === 'function') requestIdleCallback(() => warmCalendar(), { timeout: 3000 });
  else setTimeout(warmCalendar, 1500);
}

/* ---------- The words written in place ---------- */

/** Posts a message to the editor. */
const post = (msg) => window.parent?.postMessage(msg, location.origin);

/** The words as stored: every value back to its placeholder, and nothing editable left in them. */
function serialize(node, key, env) {
  const copy = node.cloneNode(true);
  for (const value of copy.querySelectorAll('.urd-cal-n')) value.replaceWith(env.params(key).includes(value.dataset.p) ? `{${value.dataset.p}}` : value.textContent);
  for (const part of copy.querySelectorAll('[contenteditable]')) part.removeAttribute('contenteditable');
  return copy.innerHTML.replace(/\u200b/g, '');
}

/** An empty text's hint in the editor: a removed line's default words, or the prompt of a text that has no words of its own. */
function hintFor(node, key, form, plain, env) {
  const hint = env.cd.CAL_HINT_TEXTS[key];
  if (hint) adminLocaleReady.then(() => { node.dataset.placeholder = ta(hint); });
  else node.dataset.placeholder = env.defaultWords(key, form, plain).replace(/\{([a-z]+)\}/gi, '').trim();
}

/** The line and the group a content text stands in follow its words: gone when it is empty. */
function markLine(node, blank) {
  const box = node.closest('.urd-cal-line');
  if (box) box.classList.toggle('urd-cal-gone', blank);
  const around = node.closest('.urd-cal-group');
  if (around) around.classList.toggle('urd-cal-gone', ![...around.querySelectorAll('.urd-cal-carry')].some((n) => !n.classList.contains('urd-cal-gone')));
}

/**
 * Makes a drawn word writable in place: each change posts the whole props, the words under their slot in `texts`.
 * `env` comes from makeUi in calendar.js.
 */
function wireText(node, key, env) {
  env.drawn.add(node);
  // The text toolbar attaches to .urd-text; a click in the words reaches no button or link around them, outside the Clean view.
  node.classList.add('urd-text');
  node.contentEditable = 'true';
  // On a fold's summary, the press that selects the block leaves the fold, and the next opens or closes it and goes into the words.
  let selectedBefore = false;
  let editing = false;
  node.addEventListener('pointerdown', () => { selectedBefore = env.el.classList.contains('urd-selected'); });
  node.addEventListener('blur', () => { editing = false; });
  node.addEventListener('click', (event) => {
    if (env.clean()) return;
    event.stopPropagation();
    if (node.closest('a[href]')) event.preventDefault();
    if (!node.closest('summary')) return;
    if (!selectedBefore || editing) event.preventDefault();
    else editing = true;
  });
  node.addEventListener('input', () => {
    const { form } = env.TEXTS.get(node);
    const slot = env.cd.calTextSlot(key, form);
    const html = serialize(node, key, env);
    const blank = env.cd.calBlankHtml(html);
    // The texts rewritten since this render are sent together.
    // An emptied content line is removed; another emptied text takes the dictionary's words.
    if (blank && env.cd.CAL_CONTENT_TEXTS.includes(key)) env.rewritten[slot] = false;
    else if (blank) delete env.rewritten[slot];
    else env.rewritten[slot] = html;
    node.classList.toggle('urd-cal-blank', blank);
    if (blank) hintFor(node, key, form, env.TEXTS.get(node)?.plain, env);
    markLine(node, blank);
    for (const other of env.drawn) {
      if (!other.isConnected) {
        env.drawn.delete(other);
        continue;
      }
      const state = env.TEXTS.get(other);
      if (other === node || state.key !== key || env.cd.calTextSlot(key, state.form) !== slot || other.contains(document.activeElement)) continue;
      env.paintText(other, key, state.values);
      markLine(other, other.classList.contains('urd-cal-blank'));
    }
    for (const measure of env.measures) measure();
    post({
      type: 'urd-edit',
      sectionId: env.ctx.section.id,
      blockId: env.el.dataset.blockId,
      props: { ...env.props, texts: { ...env.rewritten } },
    });
  });
}

/** The help chip on a calendar in the preview (ADR-0008): the sources, the conventions and the subscribe buttons need explaining. */
function helpChip(el) {
  Promise.all([import('../hint.js'), adminLocaleReady]).then(([{ attachHint }]) => {
    if (!el.isConnected || el.querySelector('.urd-hint-chip')) return;
    attachHint(el, {
      title: ta('hintCalendar.title'),
      lines: [
        ta('hintCalendar.l1'), ta('hintCalendar.l2'), ta('hintCalendar.l3'), ta('hintCalendar.l4'),
        ta('hintCalendar.l5'), ta('hintCalendar.l6'), ta('hintCalendar.l7'), ta('hintCalendar.l8'),
      ],
    });
  });
}

attachEditing({
  wireText,
  hintFor,
  helpChip,
  /** Whether a calendar shows the example events: the editor bar's choice for the session, else whether it has no sources. */
  examples: (key, sample) => EXAMPLES.get(key) ?? sample,
  /** What a calendar shows, kept for its bar's button; null forgets it. */
  shown: (key, state) => {
    if (!state) {
      SHOWN.delete(key);
      return;
    }
    // A calendar gone from the page (deleted, or drawn anew) leaves the list.
    for (const [id, kept] of SHOWN) if (!kept.host.isConnected) SHOWN.delete(id);
    SHOWN.set(key, state);
  },
  variants: () => [...VIEW_NAMES.map(([view, labelKey]) => ({ label: view, labelKey, props: { view } })), ...designVariants],
});
