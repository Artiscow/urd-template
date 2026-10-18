/**
 * Core block: calendar.
 * A subscribable event calendar built from iCal feeds (Google Calendar, Nextcloud, Outlook and others), following the ApeironLF design requirements.
 * Fetching ALWAYS goes through the site's own feed proxy (/api/ics): feed hosts send no CORS, and the site's CSP allows connect-src 'self' only.
 * Locally, without functions, the preview shows demo data and visitors get a quiet empty state.
 *
 * Views: list (date-badge rows), cards, month, agenda (compact rows under their month) and next (a card for the next one to three events, with more listed under «Later»).
 * The sources are merged, and the same event from two calendars is shown once.
 * A source can carry a name and a colour: the name is then the category of everything in that calendar (the chip, and the filter), and the colour tints its chips and date badges.
 * A view with nothing to show draws a visible empty state, with the owner's own words and icon when set.
 * Conventions: "Category: Title" gives category chips with a filter, and a signup link in the description becomes a button.
 *
 * The look is a design (calendar-designs.js): the plain one draws every view on the theme's colours, and every design exposes its colour slots, an optional edge stripe on its boxes, the sign-up and subscribe buttons as switches, and a style per event field, all set in the Style tab.
 * Every word a design draws that is not the calendar's own (the labels, the buttons, the words of a time and of a countdown, the texts with a number in them) is rewritten by clicking it in the preview, with the text toolbar, and stored as HTML under `texts`.
 * The parser (ics.js) and the design model are loaded on the first render, never in the visitor closure.
 * The sources, the view and the count are edited in the Properties panel; the help chip (ADR-0008) explains the conventions.
 */
// t() for visitor texts (the site language), ta() for the editor chrome (the admin language), dates() for month and weekday names, tp() for plurals; never called at module level.
import { t, ta, tp, pluralForm, themeString, taApiError, dates, adminLocaleReady } from '../i18n.js';
import { iconSvg } from '../icons.js';
import { resolveColor, inkOn } from '../theme.js';
import { stripActiveContent, safeHtmlFragment, plainLines } from '../sanitize.js';
import { WIDTH_QUERIES } from '../render.js';

/** An element with its class and its content: a text, or a node such as a text the owner rewrites. */
const el2 = (tag, className, content) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (content instanceof Node) node.appendChild(content);
  else if (content != null) node.textContent = content;
  return node;
};

/* ---------- Fetching (proxy + short-lived cache) ---------- */

const CACHE_TTL = 10 * 60 * 1000;

async function fetchSource(url) {
  const key = `urd-cal-cache:${url}`;
  try {
    const cached = JSON.parse(sessionStorage.getItem(key) ?? 'null');
    if (cached && Date.now() - cached.t < CACHE_TTL) return cached.text;
  } catch { /* a corrupt cache entry is ignored */ }
  const res = await fetch(`/api/ics?url=${encodeURIComponent(url)}`);
  if (!res.ok) {
    const detail = taApiError(await res.json().catch(() => null));
    throw new Error(detail ?? ta('calendar.feedStatus', { status: res.status }));
  }
  const text = await res.text();
  try { sessionStorage.setItem(key, JSON.stringify({ t: Date.now(), text })); } catch { /* a full store is fine */ }
  return text;
}

/** All sources (resolved, ics.resolveSources) → sorted occurrences with category and signup link. */
async function loadOccurrences(ics, cf, sources, limit, view, from, zone, meetingHosts, to = undefined) {
  const errors = [];
  const events = [];
  let feedZone = null;
  await Promise.all(sources.map(async (entry) => {
    const url = ics.normalizeSourceUrl(entry.url);
    if (!url) { errors.push(ta('calendar.unknownSource', { source: entry.url })); return; }
    try {
      // Every event remembers the source it came from (expandEvents keeps it on the occurrence): its name and colours, and from the site's registry its words, page, organizer and whether it stands in the filter.
      const feed = ics.parseIcs(await fetchSource(url));
      feedZone ??= feed.timezone;
      for (const event of feed.events) events.push({ ...event, source: entry });
    } catch (error) {
      errors.push(`${url}: ${error.message}`);
    }
  }));
  // The window follows the view: a year design wants the whole year, a month, week or day design its own span.
  const wide = ['year', 'month', 'week', 'day'].includes(view) || from < ics.windowStart('list');
  const expanded = ics.expandEvents(events, { from, to, max: wide ? 600 : Math.max(limit * 4, 120) })
    .map((occ) => {
      // A named calendar is the category; otherwise the feed's own first category, and last «Category: Title» in the event itself.
      const source = occ.source ?? null;
      const named = source?.name || occ.categories?.[0];
      // A calendar kept out of the filter gives its events no category and leaves their titles whole: no chip, and no place in the chip row or a legend.
      const split = source && !source.inFilter ? { category: '', title: occ.summary } : named ? { category: named, title: occ.summary } : ics.splitCategory(occ.summary);
      return {
        ...occ, ...split, color: source?.color || '', colors: source?.colors ?? null,
        calendar: source?.name || '', calendarDescription: source?.description || '', calendarLink: source?.link || '', calendarOrganizer: source?.organizer || '',
        signup: ics.signupLinkOf(occ, meetingHosts), image: occ.image || ics.findImageLink(occ.description),
      };
    });
  // The sources are one calendar to the visitor: an event that stands in two of them is shown once.
  // With a zone set for the site, every time is moved to that zone's clock; `real` keeps the moment itself for the countdowns.
  // An all-day event is a date, the same on every clock, and is left as it is.
  const placed = zone ? expanded.map((occ) => (occ.allDay ? occ : { ...occ, real: occ.start, start: cf.shiftToZone(occ.start, zone), end: cf.shiftToZone(occ.end, zone) })) : expanded;
  return { occurrences: ics.dedupeOccurrences(placed), errors, feedZone };
}

/* ---------- Demo data (preview only, when no sources or feed) ---------- */

/** A drawn picture for the sample data: hills under a sun, as an inline SVG the preview may load from itself. */
const DEMO_IMAGE = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450"><rect width="800" height="450" fill="#bfe3dd"/><circle cx="610" cy="130" r="64" fill="#f6d77a"/><path d="M0 330 L170 200 L300 300 L450 150 L640 310 L800 220 L800 450 L0 450Z" fill="#3f8f80"/><path d="M0 380 L220 290 L420 370 L620 300 L800 360 L800 450 L0 450Z" fill="#256b5f"/></svg>')}`;

/** The sample calendars' colours, one per calendar, so the sample shows how coloured calendars look. */
const DEMO_COLORS = { demoCat1: '#2f80ed', demoCat2: '#e0632c', demoCat3: '#2e9e5b' };

function demoOccurrences() {
  const day = 24 * 3600 * 1000;
  const base = Date.now();
  const cat = (key) => ({ category: t(`calendar.${key}`), color: DEMO_COLORS[key] });
  // The sample events carry what a real feed can: an end, a description with a link, a picture, a sign-up, a meeting link, a repeat and a cancellation.
  return [
    { start: base + 3 * day, end: base + 3 * day + 2 * 3600 * 1000, allDay: false, title: t('calendar.demoTitle1'), ...cat('demoCat1'), location: t('calendar.demoLoc1'), signup: null, description: `${t('calendar.demoDesc2')} https://meet.jit.si/urd-example`, hasEnd: true, demo: true },
    { start: base + 10 * day, end: base + 10 * day + 3600 * 1000, allDay: false, title: t('calendar.demoTitle2'), ...cat('demoCat2'), location: t('calendar.demoLoc1'), signup: null, description: t('calendar.demoDesc3'), recurring: true, demo: true },
    { start: base + 17 * day, end: base + 18 * day, allDay: true, title: t('calendar.demoTitle3'), ...cat('demoCat3'), location: t('calendar.demoLoc2'), signup: 'https://example.org/signup', description: `${t('calendar.demoDesc4')} https://example.org/signup`, demo: true },
    { start: base + day, end: base + day + 90 * 60 * 1000, allDay: false, title: t('calendar.demoTitle4'), ...cat('demoCat1'), location: t('calendar.demoLoc1'), signup: 'https://example.org/signup', description: `${t('calendar.demoDesc1')} https://example.org/training`, image: DEMO_IMAGE, hasEnd: true, demo: true },
    { start: base - 9 * day, end: base - 9 * day + 3600 * 1000, allDay: false, title: t('calendar.demoTitle2'), ...cat('demoCat2'), location: t('calendar.demoLoc1'), signup: null, description: t('calendar.demoDesc3'), recurring: true, hasEnd: true, demo: true },
    { start: base + 5 * day, end: base + 5 * day, allDay: true, title: t('calendar.demoTitle5'), ...cat('demoCat2'), location: t('calendar.demoLoc2'), signup: null, description: '', cancelled: true, demo: true },
  ].sort((a, b) => a.start - b.start);
}

/* ---------- Formatting ---------- */

/**
 * A node in a calendar's own colour, so its chip, badge and stripe follow the calendar, with the text colour that reads on it.
 * The registry's extra colours, when set, replace the derived ones: the text on the colour, the event's box and the chip.
 */
function paintColor(node, colour, colors = null) {
  if (!colour) return node;
  node.style.setProperty('--urd-cal-color', resolveColor(colour));
  const ink = colors?.text ? resolveColor(colors.text) : inkOn(colour);
  if (ink) node.style.setProperty('--urd-cal-color-text', ink);
  if (colors?.box) node.style.setProperty('--urd-cal-color-bg', resolveColor(colors.box));
  if (colors?.chip) node.style.setProperty('--urd-cal-chip-color', resolveColor(colors.chip));
  return node;
}

function tintNode(node, occ, mark = node) {
  paintColor(node, occ.color, occ.colors);
  // A cancelled event's box is marked, so its title is struck in every design.
  if (occ.cancelled) mark.classList.add('urd-cal-cancelled');
  return node;
}

function badgeNode(occ, ui) {
  const start = new Date(occ.start);
  const badge = tintNode(el2('div', 'urd-collection-badge'), occ);
  badge.append(ui.field('strong', 'number', String(start.getDate()), null, start), ui.field('span', 'date', dates().monthsShort[start.getMonth()], null, start));
  return badge;
}

function chipNode(category, color, ui, colors = null) {
  if (!category) return null;
  return paintColor(ui.field('span', 'category', category, 'urd-cal-chip'), color, colors);
}

/**
 * The event's picture through the site's own picture route (the CSP allows pictures from the site itself only, and the route checks the host against the picture allowlist); null when the event has none.
 */
function imageUrl(occ, width = 800) {
  if (!occ.image) return null;
  // The sample data's own drawing is loaded as it is; a feed's picture always goes through the route.
  if (occ.demo && occ.image.startsWith('data:image/svg+xml,')) return occ.image;
  return `/api/photo?p=u&u=${encodeURIComponent(occ.image)}&w=${width}`;
}

/* ---------- The design's helpers (fields, static texts, buttons) ---------- */

/** The text each drawn word stands for: its key, the values it was drawn with and its plural form. */
const TEXTS = new WeakMap();

/**
 * The helpers a draw hands its view.
 * `field` builds an element for an event field (title, date, time, place, description, category, number) carrying the owner's style for that field; `meta` is the date, time and place line as such fields.
 * `tx` is a word the design draws (a label, a button's words, the words of a time or a countdown, a text with a number in it) that the owner rewrites by clicking it in the preview, where the text toolbar attaches to it as to a text block; `retx` draws it again with new values (a ticking countdown); `line` and `group` hold the content a design ships with (CAL_CONTENT_TEXTS), which the owner can remove.
 * `notice` makes the announcement's box: its text stops after a few lines, and a text that does not fit opens the announcement in full in a card.
 * `signup` is the sign-up button when the block shows them; `recurring` is the mark on an event that repeats, `program` the link to the whole programme when the block has an address for it, and `openToAll` the words on an event without a sign-up.
 * `time`, `timeText` and `countdown` are nodes with the words in them; `timeString` and `metaString` are the same as plain text, for a tooltip or a screen reader.
 * `dayMonth`, `dateLine`, `weekdayDay`, `monthYear`, `monthRange` and `percent` write dates and shares in the order and form of the site's language.
 * `filter` is the category filter for a design that draws its own, and `offset`, `total` and `rest` tell a list design where in the whole list its rows stand when the block folds the rest.
 * `opt` holds the design's own settings (calOptions), and `descriptionIn` says whether a design with room draws the description in its rows or leaves it to the card (calDescription).
 * Every edit posts the whole props with the text under its slot in `texts`, so the editor's draft stays the owner of the words.
 */
function makeUi(cd, cf, ics, maps, links, el, host, props, ctx, sources, zone) {
  const lang = ctx.site?.site?.lang;
  const clock12 = cf.calClock12(props);
  const weekStart = cf.calWeekStart(props, lang);
  const editable = Boolean(ctx.preview) && ctx.viewport !== 'mobile';
  // The keys of a day grid belong to the visitor: with the editing handles on in the preview they are left alone.
  const keysOn = () => !ctx.preview || document.body.classList.contains('urd-chrome-off');
  const clean = () => document.body.classList.contains('urd-chrome-off');
  const rewritten = { ...(props.texts ?? {}) };
  // The coordinates a feed gives a place (GEO), by the place's text, so every link to that place leads to the same point.
  const places = new Map();
  const post = (msg) => window.parent?.postMessage(msg, location.origin);
  const field = (tag, key, content, className, when) => {
    const node = el2(tag, className ? `${className} urd-cal-f-${key}` : `urd-cal-f-${key}`);
    // A description keeps its addresses as links, and a place leads to the map (or to itself, when it is an address).
    if (key === 'description' && typeof content === 'string' && content) linkedText(node, content);
    else if (key === 'place' && typeof content === 'string' && content) node.appendChild(placeLink(content, maps, maps.mapService(ctx.site), places.get(content)));
    else if (content instanceof Node) node.appendChild(content);
    else if (content != null) node.textContent = content;
    // A date or a time with the day or the event behind it (`when`) is written as a `<time>` a machine can read.
    const stamp = when != null && content ? cf.dateTimeAttr(when, key === 'time') : null;
    if (stamp) {
      const time = el2('time');
      time.append(...node.childNodes);
      time.dateTime = stamp;
      node.replaceChildren(time);
    }
    Object.assign(node.style, cd.calFieldCss(props.fieldStyle?.[key]));
    return node;
  };

  /* The words the design draws, and the owner's own words for them. */

  const params = (key) => cd.CAL_TEXT_PARAMS[key] ?? [];
  const formOf = (key, values) => (cd.CAL_PLURAL_TEXTS.includes(key) ? pluralForm(cd.CAL_TEXTS[key], Number(values?.n ?? 0)).form : null);
  // The texts the design has words of its own for, while the owner keeps its word choice (calThemeTexts); a design drawn as the phone view brings its own (withDesign).
  // The event's card is the block's, not the design's: the texts drawn inside plainWords take the common words, and keep them when painted again.
  let wordsDesign = cd.calDesign(props.design).id;
  let themed = new Set(cd.calThemeTexts(props));
  let plainScope = false;
  /** The dictionary's words for a text in the site language, with its placeholders left in: the design's own words where it has them (themeString), else the common ones. */
  const defaultWords = (key, form, plain = false) => {
    const base = cd.CAL_TEXTS[key];
    if (!base) return '';
    if (!plain && themed.has(key)) return themeString(cd.calThemeKey(wordsDesign, key), base, form);
    return t(form ? `${base}.${form}` : base);
  };
  /** A value in a text: a whole of its own, which the owner's words keep and a tick updates in place. */
  const valueNode = (name, values) => {
    const span = el2('span', 'urd-cal-n', String(values?.[name] ?? ''));
    span.dataset.p = name;
    if (editable) span.contentEditable = 'false';
    return span;
  };
  /** The placeholders in the drawn words replaced by their values. */
  const fillValues = (node, key, values) => {
    const names = params(key);
    if (!names.length) return;
    const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
    const found = [];
    while (walker.nextNode()) if (!walker.currentNode.parentElement?.closest('.urd-cal-n')) found.push(walker.currentNode);
    for (const text of found) {
      const parts = cd.calSplitTokens(text.data, names);
      if (parts.some((part) => typeof part !== 'string')) text.replaceWith(...parts.map((part) => (typeof part === 'string' ? part : valueNode(part.name, values))));
    }
  };
  /** The words as stored: every value back to its placeholder, and nothing editable left in them. */
  const serialize = (node, key) => {
    const copy = node.cloneNode(true);
    for (const value of copy.querySelectorAll('.urd-cal-n')) value.replaceWith(params(key).includes(value.dataset.p) ? `{${value.dataset.p}}` : value.textContent);
    for (const part of copy.querySelectorAll('[contenteditable]')) part.removeAttribute('contenteditable');
    return copy.innerHTML.replace(/\u200b/g, '');
  };
  /** An empty text's hint in the editor: a removed line's default words, or the prompt of a text that has no words of its own. */
  const hintFor = (node, key, form, plain) => {
    const hint = cd.CAL_HINT_TEXTS[key];
    if (hint) adminLocaleReady.then(() => { node.dataset.placeholder = ta(hint); });
    else node.dataset.placeholder = defaultWords(key, form, plain).replace(/\{([a-z]+)\}/gi, '').trim();
  };
  /** The line and the group a content text stands in follow its words: gone when it is empty. */
  const markLine = (node, blank) => {
    const box = node.closest('.urd-cal-line');
    if (box) box.classList.toggle('urd-cal-gone', blank);
    const around = node.closest('.urd-cal-group');
    if (around) around.classList.toggle('urd-cal-gone', ![...around.querySelectorAll('.urd-cal-carry')].some((n) => !n.classList.contains('urd-cal-gone')));
  };
  // The words drawn in this render, so a text rewritten where it stands is drawn anew wherever else it stands (the announcement on the calendar and in its card).
  const drawn = new Set();
  // The announcement's check of whether its text is cut, run again when words are rewritten.
  const measures = new Set();
  const paintText = (node, key, values) => {
    const form = formOf(key, values);
    const own = cd.calTextValue(rewritten, key, form);
    const plain = TEXTS.get(node)?.plain ?? plainScope;
    TEXTS.set(node, { key, values, form, plain });
    if (editable) node.dataset.calText = cd.calTextSlot(key, form);
    const blank = own === false || (own === null && Boolean(cd.CAL_HINT_TEXTS[key]));
    node.classList.toggle('urd-cal-blank', blank);
    if (blank) {
      node.replaceChildren();
      if (editable) hintFor(node, key, form, plain);
      return;
    }
    if (own) {
      node.innerHTML = own;
      // Visitor protection: executable code is always stripped on render.
      stripActiveContent(node);
    } else {
      node.textContent = defaultWords(key, form, plain);
    }
    fillValues(node, key, values);
  };
  const tx = (key, className, values = null) => {
    const node = el2('span', className ? `urd-cal-tx ${className}` : 'urd-cal-tx');
    paintText(node, key, values);
    if (editable) {
      drawn.add(node);
      // The text toolbar attaches to .urd-text fields; a click in the words edits them and never reaches the button or link around them.
      // In the Clean view the words are plain text and the link around them works (urd.js switches this with the handles).
      node.classList.add('urd-text');
      node.contentEditable = clean() ? 'false' : 'true';
      // The words stop the press, so a link around them is never followed.
      // A fold's summary follows the block's two-step model: the press that selects the block leaves the fold, the next press opens or closes it and goes into the words, and the presses after that edit the words until they lose focus.
      let selectedBefore = false;
      let editing = false;
      node.addEventListener('pointerdown', () => { selectedBefore = el.classList.contains('urd-selected'); });
      node.addEventListener('blur', () => { editing = false; });
      node.addEventListener('click', (event) => {
        if (clean()) return;
        event.stopPropagation();
        if (node.closest('a[href]')) event.preventDefault();
        if (!node.closest('summary')) return;
        if (!selectedBefore || editing) event.preventDefault();
        else editing = true;
      });
      node.addEventListener('input', () => {
        const { form } = TEXTS.get(node);
        const slot = cd.calTextSlot(key, form);
        const html = serialize(node, key);
        const blank = cd.calBlankHtml(html);
        // The texts rewritten since this render are kept together: the editor stores what it is sent and does not render again.
        // An emptied content line is removed; any other emptied text goes back to the dictionary's words.
        if (blank && cd.CAL_CONTENT_TEXTS.includes(key)) rewritten[slot] = false;
        else if (blank) delete rewritten[slot];
        else rewritten[slot] = html;
        node.classList.toggle('urd-cal-blank', blank);
        if (blank) hintFor(node, key, form, TEXTS.get(node)?.plain);
        markLine(node, blank);
        for (const other of drawn) {
          if (!other.isConnected) {
            drawn.delete(other);
            continue;
          }
          const state = TEXTS.get(other);
          if (other === node || state.key !== key || cd.calTextSlot(key, state.form) !== slot || other.contains(document.activeElement)) continue;
          paintText(other, key, state.values);
          markLine(other, other.classList.contains('urd-cal-blank'));
        }
        for (const measure of measures) measure();
        post({
          type: 'urd-edit',
          sectionId: ctx.section.id,
          blockId: el.dataset.blockId,
          props: { ...props, texts: { ...rewritten } },
        });
      });
    }
    return node;
  };
  /** A text drawn again with new values: in place, or only its values while the owner is writing in it. */
  const retx = (node, values) => {
    const state = TEXTS.get(node);
    if (!state) return;
    if (node.contains(document.activeElement)) {
      state.values = values;
      for (const value of node.querySelectorAll('.urd-cal-n')) value.textContent = String(values?.[value.dataset.p] ?? '');
      return;
    }
    paintText(node, state.key, values);
  };
  /**
   * A content line (CAL_CONTENT_TEXTS) in its box: the box with the words in it, or for a visitor null when the owner removed the line or it has no words.
   * In the editor an empty line stays as a faint hint, marked `urd-cal-gone` so the Clean view and the fit leave it out.
   * `carry` marks a line whose words make the group around it worth drawing.
   */
  const line = (box, key, { carry = false, className } = {}) => {
    const words = tx(key, className);
    const blank = words.classList.contains('urd-cal-blank');
    if (blank && !editable) return null;
    box.appendChild(words);
    box.classList.add('urd-cal-line');
    box.classList.toggle('urd-cal-gone', blank);
    if (carry) box.classList.add('urd-cal-carry');
    return box;
  };
  /** A box of content lines: for a visitor null when none of its carrying lines is left, in the editor marked gone the same way. */
  const group = (box) => {
    box.classList.add('urd-cal-group');
    const carries = [...box.querySelectorAll('.urd-cal-carry')];
    if (!editable) return carries.length ? box : null;
    box.classList.toggle('urd-cal-gone', !carries.some((n) => !n.classList.contains('urd-cal-gone')));
    return box;
  };

  /**
   * The announcement's box, built from its lines: null for a visitor when none of its own words is left (`group`).
   * Its text stops after the design's number of lines, and a text that does not fit gets «Read it all» and opens the announcement in full in a card, as an event does.
   * With the editing handles on, a press on the cut text of the selected calendar opens the card, where the whole text is written; the other words are written where they stand.
   */
  const notice = (box, { title, text, href }) => {
    if (!group(box)) return null;
    if (title) title.classList.add('urd-cal-notice-title');
    if (!text) return box;
    text.classList.add('urd-cal-clamp');
    const more = el2('span', 'urd-cal-notice-more');
    more.appendChild(tx('readWhole'));
    more.hidden = true;
    text.after(more);
    let cut = false;
    // The text is cut when it stands taller without the clamp: the lines a clamp hides are not counted in its scroll height in every engine.
    const measure = () => {
      if (!box.isConnected) return;
      const shown = text.clientHeight;
      text.style.setProperty('-webkit-line-clamp', 'none');
      const whole = text.clientHeight;
      text.style.removeProperty('-webkit-line-clamp');
      cut = whole > shown + 1;
      more.hidden = !cut;
      box.classList.toggle('urd-cal-event', cut);
      if (cut) {
        box.tabIndex = 0;
        box.setAttribute('aria-haspopup', 'dialog');
      } else {
        box.removeAttribute('tabindex');
        box.removeAttribute('aria-haspopup');
      }
    };
    // The calendar may be drawn before it is put on the page: the watch ends when the box leaves the page, not before it is on it.
    let placed = false;
    const watch = new ResizeObserver(() => {
      if (box.isConnected) {
        placed = true;
        measure();
      } else if (placed) {
        watch.disconnect();
        measures.delete(measure);
      }
    });
    watch.observe(text);
    // Words rewritten elsewhere (in the card) can change how much of the text fits without changing its height.
    measures.add(measure);
    // Whether the calendar was selected before this press: the press itself selects it.
    let selected = false;
    const editing = () => ctx.preview && !clean();
    /** True when a press on this target opens the card: the cut text or the box around the words, never a link, and while editing only on the selected calendar. */
    const opens = (target) => {
      if (!cut || target.closest('a, button, input')) return false;
      if (!editing()) return true;
      if (!selected) return false;
      const words = target.closest('[contenteditable="true"]');
      return !words || text.contains(words);
    };
    box.addEventListener('pointerdown', () => { selected = el.classList.contains('urd-selected'); }, true);
    // The cut text is not put into editing by the press that opens its card.
    box.addEventListener('mousedown', (event) => { if (editing() && opens(event.target)) event.preventDefault(); }, true);
    box.addEventListener('click', (event) => {
      if (!opens(event.target)) return;
      event.preventDefault();
      event.stopPropagation();
      showNoticeDialog(box, ui, href);
    }, true);
    box.addEventListener('keydown', (event) => {
      if ((event.key !== 'Enter' && event.key !== ' ') || event.target !== box || !cut) return;
      selected = el.classList.contains('urd-selected');
      if (editing() && !selected) return;
      event.preventDefault();
      event.stopPropagation();
      showNoticeDialog(box, ui, href);
    });
    return box;
  };

  /* Dates, times and shares, in the order and form of the site's language. */

  const weekdayOf = (date, long) => (long ? dates().weekdays : dates().weekdaysShort)[(date.getDay() + 6) % 7];
  const monthOf = (date, long) => (long ? dates().months : dates().monthsShort)[date.getMonth()];
  const dayMonth = (date, long = false) => t('calendar.dayMonth', { d: date.getDate(), m: monthOf(date, long) });
  const dateLine = (date, long = false) => t('calendar.dateLine', { wd: weekdayOf(date, long), d: date.getDate(), m: monthOf(date, long) });
  const weekdayDay = (date, long = false) => t('calendar.weekdayDay', { wd: weekdayOf(date, long), d: date.getDate() });
  const monthYear = (year, month) => t('calendar.monthYear', { m: dates().months[month], y: year });
  const monthRange = (from, to) => t('calendar.monthRange', { from, to });
  const percent = (fraction) => cf.formatPercent(fraction, lang);
  /** The first line of a description cut to a length, never inside a word or an address. */
  const excerpt = (description, max = 140) => excerptOf(description, max);
  /** The event's last day as «6. okt», for an event that ends on a later day than it starts. */
  const endDate = (occ) => dayMonth(new Date(occ.end));
  const clockRange = (occ) => {
    const { from, to } = cf.timeRange(occ, clock12, lang);
    if (cf.isMultiDay(occ)) return t('calendar.timeRange', { from, to: to ? t('calendar.dayTime', { date: endDate(occ), time: to }) : endDate(occ) });
    return to ? t('calendar.timeRange', { from, to }) : from;
  };
  /**
   * The event's time as it is written: «18:00-21:00» with its end, «all day», «until 6 Oct» for a span of days, and «Cancelled» for a cancelled event.
   * The clock is 24 hours unless the block is set to 12; the words are texts the owner rewrites.
   */
  const time = (occ) => {
    if (occ.cancelled) return tx('cancelled');
    if (occ.allDay) return cf.isMultiDay(occ) ? tx('until', null, { date: endDate(occ) }) : tx('allDay');
    return document.createTextNode(clockRange(occ));
  };
  /** The clock time an event starts at, alone («18:00», or «6 pm» on a 12-hour clock), for a design that writes the start by itself. */
  const startClock = (occ) => cf.timeRange(occ, clock12, lang).from;
  /** The time with the language's word before a clock time («kl. 18:00»). */
  const timeText = (occ) => (occ.cancelled || occ.allDay ? time(occ) : tx('timeAt', null, { time: clockRange(occ) }));
  /** The time with its word as plain text, for a tooltip or a screen reader. */
  const timeString = (occ) => {
    if (occ.cancelled) return t('calendar.cancelled');
    if (occ.allDay) return cf.isMultiDay(occ) ? t('calendar.until', { date: endDate(occ) }) : t('calendar.allDay');
    return t('calendar.timeAt', { time: clockRange(occ) });
  };
  /** True when the event has something to write where the time stands: a clock time, a later last day, or its cancellation. */
  const hasTime = (occ) => !occ.allDay || occ.cancelled || cf.isMultiDay(occ);
  /** The date, time and place as one line of plain text: a tooltip. */
  const metaString = (occ) => [dateLine(new Date(occ.start)), hasTime(occ) ? timeString(occ) : '', occ.location ?? ''].filter(Boolean).join(' · ');
  /** «Today!», «Tomorrow» or «In N days» for an event, counted in calendar days on the clock the times are shown in. */
  const countdown = (occ) => {
    const days = Math.max(0, cf.daysBetween(ui.today().getTime(), occ.start));
    // Dedicated keys instead of Intl.RelativeTimeFormat: the exclaiming today wording is kept, and ICU has no North Sami (it would fall back to a bare number).
    if (days === 0) return tx('today');
    return days === 1 ? tx('tomorrow') : tx('inDays', null, { n: days });
  };
  const meta = (occ, { date = true, place = true } = {}) => {
    const start = new Date(occ.start);
    const parts = [];
    if (date) parts.push(field('span', 'date', dateLine(start), null, start));
    if (hasTime(occ)) parts.push(field('span', 'time', timeText(occ), null, occ));
    if (place && occ.location) parts.push(field('span', 'place', occ.location));
    if (!parts.length) return null;
    const row = el2('div', 'urd-cal-meta');
    parts.forEach((part, i) => {
      if (i) row.appendChild(document.createTextNode(' · '));
      row.appendChild(part);
    });
    return row;
  };
  /** A link around words the owner rewrites: with the editing handles on, a press goes into the words and the link is never followed or dragged; in the Clean view it works as published. */
  const editLink = (a) => {
    if (!editable) return a;
    a.draggable = false;
    a.addEventListener('click', (event) => { if (!clean()) event.preventDefault(); });
    return a;
  };
  /** A link whose words are a text the owner rewrites. */
  const link = (className, key, href, title) => {
    const a = el2('a', className);
    a.href = href;
    a.title = title;
    a.appendChild(tx(key));
    return editLink(a);
  };
  const signup = (occ) => {
    if (!occ.signup || occ.cancelled || props.showSignup !== true) return null;
    const a = link('urd-cal-signup', 'signup', occ.signup, ui.hosted(t('calendar.signupTitle'), occ.signup));
    a.target = '_blank';
    a.rel = 'noopener';
    return a;
  };
  const chip = (occ) => chipNode(occ.category, occ.color, ui, occ.colors);
  /**
   * The event's box: tinted by its calendar, and opening the event in full at a click or Enter.
   * A click on a link, a button or a text being edited is left to that element.
   * With the editing handles on in the preview, the first press selects the calendar and a press on an event of the selected calendar opens its card, where the card's words are rewritten too.
   * A box that holds the rows of other events (a «Coming up» card) passes its event's own words as `mark`, so a cancellation strikes them alone.
   */
  const tint = (node, occ, mark = node) => {
    tintNode(node, occ, mark);
    if (node.closest?.('a, button') || /^(A|BUTTON)$/.test(node.tagName)) return node;
    node.classList.add('urd-cal-event');
    node.tabIndex = 0;
    node.setAttribute('aria-haspopup', 'dialog');
    // Whether the calendar was selected before this press: the press itself selects it.
    let selected = false;
    node.addEventListener('pointerdown', () => { selected = el.classList.contains('urd-selected'); });
    const open = (event) => {
      if (event.target.closest('a, button, input, [contenteditable="true"]')) return;
      if (ctx.preview && !clean() && !selected) return;
      event.stopPropagation();
      openEvent(occ, node);
    };
    node.addEventListener('click', open);
    node.addEventListener('keydown', (event) => {
      if ((event.key !== 'Enter' && event.key !== ' ') || event.target !== node) return;
      event.preventDefault();
      selected = el.classList.contains('urd-selected');
      open(event);
    });
    return node;
  };
  /** The texts drawn while fn runs take the common words, never the design's own: the event's card. */
  const plainWords = (fn) => {
    plainScope = true;
    try {
      return fn();
    } finally {
      plainScope = false;
    }
  };
  /** The texts drawn while fn runs take another design's own words and options: a design drawn as the block's phone view. */
  const withDesign = (id, fn) => {
    const was = { wordsDesign, themed, opt: ui.opt };
    wordsDesign = id;
    themed = new Set(cd.calThemeTexts({ ...props, design: id }));
    ui.opt = cd.calOptions({ ...props, design: id });
    try {
      return fn();
    } finally {
      ({ wordsDesign, themed } = was);
      ui.opt = was.opt;
    }
  };
  /** The texts drawn while fn runs take the design's own words again: the design's own parts of the card (its dress). */
  const themedWords = (fn) => {
    const was = plainScope;
    plainScope = false;
    try {
      return fn();
    } finally {
      plainScope = was;
    }
  };
  /** The event in full, in a native dialog over the page (ADR-0011), in the common words. */
  const openEvent = (occ, from) => plainWords(() => showEventDialog(occ, from, ics, ui, props));
  /** The mark on an event that repeats, with words the owner can rewrite, shown only with `showRecurring`; null on a single event. */
  const recurring = (occ) => {
    if (!occ.recurring || props.showRecurring !== true) return null;
    const mark = el2('span', 'urd-cal-rec');
    mark.appendChild(tx('recurring'));
    return mark;
  };
  /** The link to the whole programme; null when the block has no address or the design draws none. */
  const program = (className) => {
    const to = cd.calProgramHref(props);
    if (!to) return null;
    const a = link(className ? `urd-cal-program ${className}` : 'urd-cal-program', 'wholeProgram', to, '');
    // An address on another site opens in a new tab; a page of this site in the same one.
    if (/^https?:\/\//i.test(to)) {
      a.target = '_blank';
      a.rel = 'noopener';
    }
    return a;
  };
  /** «Open to everyone» on an event without a sign-up, for a design that writes it; null when switched off. */
  const openToAll = (occ) => {
    if (occ.signup || props.showOpen === false || !cd.calDesign(props.design).open) return null;
    return tx('openToAll', 'urd-cal-open');
  };
  /** The subscribe buttons, for a design that places them itself; null when they are off or there is no source. */
  const subscribe = () => (props.showSubscribe !== false && sources.some((source) => source.subscribable) ? subscribeRow(ics, sources, ui) : null);
  /** The event's own page: the address the feed gives it, else its sign-up link; null without either. */
  const href = (occ) => (typeof occ.url === 'string' && /^https?:\/\//i.test(occ.url) ? occ.url : occ.signup || null);
  const ui = { el: el2, tint, field, meta, tx, retx, line, group, notice, link, editLink, signup, chip, recurring, program, openToAll, subscribe, href, countdown, image: imageUrl, themedWords, withDesign, all: [], offset: 0, total: 0, rest: false, filter: null, opt: cd.calOptions(props), descriptionIn: cd.calDescription(props), time, timeText, timeString, startClock, metaString, hasTime, excerpt, sources,
    dayMonth, dateLine, weekdayDay, monthYear, monthRange, percent,
    /** The week as the site's language lays it out: the empty cells before the first of a month, the weekday names in order, and the first day of a week. */
    lead: (first) => cf.leadDays(first, weekStart),
    dows: () => cf.orderWeekdays(dates().weekdaysShort, weekStart),
    weekStartOf: (ms) => cf.startOfWeek(ms, weekStart),
    /** Now, on the clock the times are shown in. */
    today: () => new Date(zone ? cf.shiftToZone(Date.now(), zone) : Date.now()),
    /** True when the calendar is narrow (drawCalendar), and a design with seven columns draws its phone layout. */
    phone: false,
    /** True when the design shows a span (a week, month, day or year) rather than what is coming. */
    spanView: SPAN_VIEWS.includes(cd.calView(props)),
    /** True when a design that rewrites calendar data may do so (calRewrites); off, the design draws the calendar's own text. */
    rewrite: cd.calRewrites(props),
    /** A label that names the week, month or day shown: a change of it is read out by a screen reader. */
    live: (node) => {
      node.setAttribute('aria-live', 'polite');
      node.setAttribute('aria-atomic', 'true');
      return node;
    },
    /** A day cell's name for a screen reader: the date and the number of events on it. */
    dayLabel: (node, date, count) => {
      if (node.tagName !== 'BUTTON') node.setAttribute('role', 'group');
      node.setAttribute('aria-label', `${dateLine(date, true)}, ${tp('calendar.count', count)}`);
      return node;
    },
    dayGrid: (grid, selector, opts) => dayGrid(grid, selector, opts, keysOn),
    keepFocus: (grid) => { const state = GRIDS.get(grid); if (state) Object.assign(state, { want: 'current', focus: true }); },
    phoneDays: (grid, panel, year, month, occs, cellClass) => phoneDays(ui, grid, panel, year, month, occs, cellClass),
    places,
    /** An event's colour on a node that is no event box of its own (a dot): tinted, never opened. */
    color: (node, occ) => tintNode(node, occ),
    /** An hour on a plan's axis on the block's clock: «13», or «1 pm» on a 12-hour clock as the language writes it. */
    hourLabel: (hour) => cf.formatHour(hour, clock12, lang),
    /** The site's own meeting hosts (site.meetingHosts), beside the services known by their host. */
    meetingHosts: links.meetingHostList(ctx.site?.site?.meetingHosts),
    /** A button's tooltip with the host it leads to, so a visitor sees where a press goes. */
    hosted: (words, address) => {
      const host = links.linkHost(address);
      return host ? (words ? `${words} (${host})` : host) : words;
    },
    mapUrl: (place, geo) => maps.mapSearchUrl(place, maps.mapService(ctx.site), geo) };
  return ui;
}

/* ---------- The event in full ---------- */

/** A place as a link: to the map as a search for its words, or to itself when the place is an address. */
function placeLink(place, maps, service, geo) {
  const a = el2('a', 'urd-cal-place-link', place);
  a.href = /^https?:\/\/\S+$/i.test(place.trim()) ? place.trim() : maps.mapSearchUrl(place, service, geo);
  a.target = '_blank';
  a.rel = 'noopener';
  return a;
}

/** The first line of a description with words in it, as plain text when the feed writes it as rich text, cut at a word boundary near `max` and never inside an address. */
function excerptOf(description, max) {
  const line = plainLines(description).split('\n').map((part) => part.trim()).find(Boolean) ?? '';
  if (line.length <= max) return line;
  let cut = line.lastIndexOf(' ', max);
  if (cut < max * 0.5) cut = max;
  // An address that straddles the cut is kept whole.
  for (const m of line.matchAll(/https?:\/\/[^\s<>"')\]]+/gi)) {
    if (m.index < cut && m.index + m[0].length > cut) cut = m.index + m[0].length;
  }
  return cut >= line.length ? line : `${line.slice(0, cut).trimEnd()} …`;
}

/** Plain text with its addresses as links and its line breaks kept. */
function linkedText(node, text) {
  const parts = String(text).split(/(https?:\/\/[^\s<>"')\]]+)/gi);
  parts.forEach((part, i) => {
    if (i % 2) {
      const address = part.replace(/[.,;:!?]+$/, '');
      const a = el2('a', null, address);
      a.href = address;
      a.target = '_blank';
      a.rel = 'noopener';
      node.append(a, part.slice(address.length));
      return;
    }
    part.split('\n').forEach((line, n) => {
      if (n) node.appendChild(document.createElement('br'));
      if (line) node.appendChild(document.createTextNode(line));
    });
  });
}

/** The feed's description: markup from the feed with everything active stripped, or plain text with its links. */
function descriptionNode(description, ui) {
  const box = ui.field('div', 'description', '', 'urd-cal-dialog-text');
  if (/<[a-z][^>]*>/i.test(description)) {
    // A feed's HTML is somebody else's markup: only what the allowlist keeps is drawn.
    box.appendChild(safeHtmlFragment(description));
  } else {
    linkedText(box, description);
  }
  return box;
}

/**
 * The card wears the card design the block names (calCardDress, written on the block as `data-card-set`, `data-card-classes` and `data-card-colours`): the set it is drawn in, the card classes (`urd-cal-dlg-<design>`, where a design overrides its set's variables for the card, and a lent card design's own), and the owner's colour slots copied from the block when the card is the calendar's own design's or the neutral one, so base.css draws it in the right colours although it lies in the page.
 */
function dressDialog(dialog, from) {
  const host = from?.closest?.('.urd-cal');
  if (!host) return;
  const set = host.dataset.cardSet ?? [...host.classList].find((name) => name.startsWith('urd-cal-set-'))?.slice('urd-cal-set-'.length);
  if (set) dialog.classList.add(`urd-cal-set-${set}`);
  for (const name of (host.dataset.cardClasses ?? '').split(' ').filter(Boolean)) dialog.classList.add(name);
  if (host.dataset.cardColours === 'off') return;
  for (const name of host.style) if (name.startsWith('--urd-cal-s-') || name === '--urd-cal-accent-text') dialog.style.setProperty(name, host.style.getPropertyValue(name));
}

/** The open cards, each with the event or announcement it was opened from. */
const OPEN_CARDS = new Map();

/** Closes a card whose event is no longer on the page: its calendar has been drawn again under it. */
function closeOrphanCards() {
  for (const [dialog, from] of OPEN_CARDS) {
    if (!from?.isConnected) dialog.close();
  }
}

/** A card's close button. */
function closeButton(dialog) {
  const close = el2('button', 'urd-cal-dialog-close');
  close.type = 'button';
  close.setAttribute('aria-label', t('calendar.close'));
  close.innerHTML = iconSvg('cross') || '';
  if (!close.firstChild) close.textContent = '×';
  close.addEventListener('click', () => dialog.close('escape'));
  return close;
}

function showEventDialog(occ, from, ics, ui, props) {
  const dialog = el2('dialog', 'urd-cal-dialog');
  dressDialog(dialog, from);
  const close = closeButton(dialog);
  const start = new Date(occ.start);
  const when = ui.field('span', 'date', ui.dateLine(start, true), 'urd-cal-dialog-date', start);
  const title = ui.field('h3', 'title', occ.title, 'urd-cal-dialog-title');
  title.id = `urd-cal-dlg-${Math.random().toString(36).slice(2, 10)}`;
  dialog.setAttribute('aria-labelledby', title.id);
  if (occ.cancelled) title.classList.add('urd-cal-cancelled');
  dialog.append(close, when, title);
  const facts = el2('dl', 'urd-cal-dialog-facts');
  const fact = (key, value) => {
    const term = el2('dt');
    term.appendChild(ui.tx(key));
    const def = el2('dd');
    def.appendChild(value);
    facts.append(term, def);
  };
  fact('when', ui.field('span', 'time', ui.timeText(occ)));
  if (!occ.location && occ.geo) {
    // Coordinates without a place in words: the map itself is the place.
    const onMap = ui.link('urd-cal-place-link', 'onMap', ui.mapUrl('', occ.geo), '');
    onMap.target = '_blank';
    onMap.rel = 'noopener';
    fact('where', onMap);
  }
  if (occ.location) {
    fact('where', ui.field('span', 'place', occ.location));
  }
  // The calendar's organizer from the site's registry.
  if (occ.calendarOrganizer) fact('organizer', el2('span', 'urd-cal-dialog-organizer', occ.calendarOrganizer));
  dialog.appendChild(facts);
  const meta = el2('div', 'urd-cal-dialog-meta');
  const chip = ui.chip(occ);
  if (chip) meta.appendChild(chip);
  const rec = ui.recurring(occ);
  if (rec) meta.appendChild(rec);
  if (meta.children.length) dialog.appendChild(meta);
  const src = ui.image(occ, 1000);
  if (src) {
    const img = document.createElement('img');
    img.className = 'urd-cal-dialog-img';
    img.alt = '';
    img.addEventListener('error', () => img.remove());
    img.src = src;
    dialog.appendChild(img);
  }
  // The feed's HTML description when it has one, else the plain one.
  if (occ.descriptionHtml || occ.description) dialog.appendChild(descriptionNode(occ.descriptionHtml || occ.description, ui));
  // The calendar's own words and page, from the site's registry.
  if (occ.calendarDescription || occ.calendarLink) {
    const about = el2('div', 'urd-cal-dialog-source');
    if (occ.calendarDescription) about.appendChild(el2('p', 'urd-cal-dialog-source-text', occ.calendarDescription));
    if (occ.calendarLink) {
      const more = el2('a', 'urd-cal-dialog-link');
      more.href = occ.calendarLink;
      more.target = '_blank';
      more.rel = 'noopener';
      more.appendChild(ui.tx('moreAbout', null, { name: occ.calendar || occ.calendarOrganizer || '' }));
      about.appendChild(ui.editLink(more));
    }
    dialog.appendChild(about);
  }
  const actions = el2('div', 'urd-cal-dialog-actions');
  // The card shows the sign-up when the block does («Show sign-up button»).
  if (occ.signup && !occ.cancelled && props.showSignup === true) {
    const signup = ui.link('urd-cal-dialog-primary', 'signup', occ.signup, ui.hosted(t('calendar.signupTitle'), occ.signup));
    signup.target = '_blank';
    signup.rel = 'noopener';
    actions.appendChild(signup);
  }
  const meeting = occ.cancelled ? null : ics.meetingLinkOf(occ, ui.meetingHosts);
  if (meeting) {
    const join = ui.link('urd-cal-dialog-primary', 'join', meeting, ui.hosted('', meeting));
    join.target = '_blank';
    join.rel = 'noopener';
    actions.appendChild(join);
  }
  // «Add to calendar» is left out of a cancelled event's card, and of every card when the owner switched it off (showAdd).
  if (!occ.cancelled && props.showAdd !== false) {
    // The moment itself, when the times are shown on the site's own clock.
    const shift = occ.real != null ? occ.start - occ.real : 0;
    const real = { ...occ, start: occ.start - shift, end: Number.isFinite(occ.end) ? occ.end - shift : occ.end };
    // «Add to calendar» opens the ways to do it: this one event (to Google, or as a file for the other calendar apps), or the whole calendar (a subscription, and its iCal address to copy).
    const add = el2('details', 'urd-cal-dialog-add');
    const summary = el2('summary', 'urd-cal-dialog-link');
    summary.appendChild(ui.tx('addEvent'));
    const choices = el2('div', 'urd-cal-dialog-choices');
    const one = el2('span', 'urd-cal-dialog-choice-label');
    one.appendChild(ui.tx('addOne'));
    const google = ui.link('urd-cal-dialog-link', 'addGoogle', ics.googleEventUrl(real), '');
    google.target = '_blank';
    google.rel = 'noopener';
    const file = ui.link('urd-cal-dialog-link', 'addFile', URL.createObjectURL(new Blob([ics.eventIcs(real)], { type: 'text/calendar' })), '');
    file.download = `${String(occ.title || 'event').replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '').slice(0, 60) || 'event'}.ics`;
    choices.append(one, google, file);
    // The whole calendar is offered with the block's subscribe button on, as on the calendar itself.
    const feeds = props.showSubscribe === false ? [] : ui.sources.filter((source) => source.subscribable).map((source) => ics.subscribeLinks(source.url)).filter(Boolean);
    if (feeds.length) {
      const whole = el2('span', 'urd-cal-dialog-choice-label');
      whole.appendChild(ui.tx('addWhole'));
      choices.appendChild(whole);
      for (const links of feeds) {
        choices.appendChild(ui.link('urd-cal-dialog-link', 'subscribe', links.webcal, t('calendar.subscribeTitle')));
        // The calendar's own address, to paste into a calendar app by hand.
        const row = el2('label', 'urd-cal-dialog-address');
        row.appendChild(ui.tx('icalAddress'));
        const field = el2('input');
        field.type = 'text';
        field.readOnly = true;
        field.value = links.webcal.replace(/^webcal:/, 'https:');
        field.addEventListener('focus', () => field.select());
        row.appendChild(field);
        choices.appendChild(row);
      }
    }
    add.append(summary, choices);
    actions.appendChild(add);
    dialog.addEventListener('close', () => URL.revokeObjectURL(file.href));
  }
  dialog.appendChild(actions);
  // The card design the block wears, when a module lends it (calCardDesign): its decorator adds its own parts to the card.
  ui.dressCard?.(dialog, occ);
  openCard(dialog, from);
}

/** The announcement in full: its label, title and whole text, and the link to its address, in a card like an event's. */
function showNoticeDialog(from, ui, href) {
  const dialog = el2('dialog', 'urd-cal-dialog urd-cal-dialog-notice');
  dressDialog(dialog, from);
  dialog.appendChild(closeButton(dialog));
  const label = ui.line(el2('span', 'urd-cal-dialog-date'), 'noticeLabel');
  const title = ui.line(el2('h3', 'urd-cal-dialog-title'), 'noticeTitle');
  const text = ui.line(el2('div', 'urd-cal-dialog-text'), 'noticeText');
  for (const part of [label, title, text]) if (part) dialog.appendChild(part);
  if (title) {
    title.id = `urd-cal-dlg-${Math.random().toString(36).slice(2, 10)}`;
    dialog.setAttribute('aria-labelledby', title.id);
  } else {
    dialog.setAttribute('aria-label', t('calendar.noticeLabel'));
  }
  if (href) {
    const actions = el2('div', 'urd-cal-dialog-actions');
    actions.appendChild(ui.link('urd-cal-dialog-primary', 'moreInfo', href, ''));
    dialog.appendChild(actions);
  }
  openCard(dialog, from);
}

/**
 * Opens a card over the calendar it was opened from (`from`, the event or the announcement), and gives the focus back to it when the card closes.
 */
function openCard(dialog, from) {
  // The card lies over its calendar and leaves the page alone (a dialog that is not modal): the page scrolls under it, and Escape or a press anywhere outside it closes it.
  // One card is open at a time.
  for (const other of document.querySelectorAll('dialog.urd-cal-dialog[open]')) other.close();
  const watch = new AbortController();
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    event.preventDefault();
    dialog.close('escape');
  }, { signal: watch.signal });
  // The editor's text toolbar, colour picker and menus lie outside the card and work on its words.
  document.addEventListener('pointerdown', (event) => {
    if (dialog.contains(event.target) || event.target.closest?.('.urd-text-toolbar, .urd-cp, .urd-dd-menu')) return;
    dialog.close();
  }, { capture: true, signal: watch.signal });
  OPEN_CARDS.set(dialog, from);
  dialog.addEventListener('close', () => {
    OPEN_CARDS.delete(dialog);
    watch.abort();
    // The focus goes back to what opened the card when the card held it or Escape closed it; a press elsewhere keeps what it pressed.
    const back = dialog.returnValue === 'escape' || dialog.contains(document.activeElement);
    dialog.remove();
    if (back && from?.isConnected) from.focus({ preventScroll: true });
  });
  // The card is given a place in the part of the page that is in view before it opens, so opening it (which moves the focus into it) never scrolls the page.
  dialog.style.left = `${window.scrollX + 8}px`;
  dialog.style.top = `${window.scrollY + 8}px`;
  document.body.appendChild(dialog);
  dialog.show();
  placeOverCalendar(dialog, from);
}

/**
 * Lays the card over the calendar it belongs to, centred on the part of the calendar that is in view: at its own width and as tall as its content, so it may reach past the calendar's edges (a card never scrolls inside itself), never wider than the window and never over the navigation bar; a card taller than the window starts under the bar and the page scrolls.
 * It is placed on the page, so it scrolls away with its calendar, and placed again when the window changes or its own content unfolds.
 * The card is drawn at the calendar's own zoom (the block's drawn scale, render.js applyZoom), so it follows the size the owner gave the block. Its place is measured where it lands and set right from there (placeAt), so it lands where it should however the browser applies the zoom to its offsets.
 * The calendar is shaded behind it; the rest of the page is left as it is.
 */
const CARD_MAX_W = 460;

/** Moves a positioned element so its box lands at (left, top) in the window: written, measured, and set right by what it missed, a few times at most. */
function placeAt(node, left, top, scale) {
  for (let i = 0; i < 3; i++) {
    const rect = node.getBoundingClientRect();
    const dx = left - rect.left;
    const dy = top - rect.top;
    if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) return;
    node.style.left = `${(parseFloat(node.style.left) || 0) + dx / scale}px`;
    node.style.top = `${(parseFloat(node.style.top) || 0) + dy / scale}px`;
  }
}

function placeOverCalendar(dialog, from) {
  const host = from?.closest?.('.urd-cal');
  if (!host) return;
  const shade = el2('i', 'urd-cal-shade');
  host.appendChild(shade);
  const place = () => {
    const box = host.getBoundingClientRect();
    const zoom = parseFloat(host.style.zoom) || 1;
    dialog.style.zoom = zoom === 1 ? '' : String(zoom);
    // The navigation bar's height, when it stays at the top of the window.
    const nav = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--urd-nav-h')) || 0;
    const roof = nav + 8;
    const floor = window.innerHeight - 8;
    // The card's own width at the calendar's size, never wider than the window.
    const cssWidth = Math.min(CARD_MAX_W, (window.innerWidth - 16) / zoom);
    dialog.style.width = `${cssWidth}px`;
    const rect = dialog.getBoundingClientRect();
    // How far the card moves on the screen for one CSS pixel of its place.
    const scale = rect.width / cssWidth || zoom;
    // The centre of the part of the calendar in view, or of the whole calendar when none of it is.
    const shownTop = Math.max(roof, box.top);
    const shownBottom = Math.min(floor, box.bottom);
    const centreY = shownBottom > shownTop ? (shownTop + shownBottom) / 2 : box.top + box.height / 2;
    const left = Math.max(8, Math.min(window.innerWidth - rect.width - 8, box.left + (box.width - rect.width) / 2));
    const top = rect.height > floor - roof ? roof : Math.max(roof, Math.min(floor - rect.height, centreY - rect.height / 2));
    placeAt(dialog, left, top, scale);
  };
  const watch = new AbortController();
  window.addEventListener('resize', place, { signal: watch.signal });
  dialog.addEventListener('toggle', place, { capture: true, signal: watch.signal });
  dialog.addEventListener('close', () => {
    watch.abort();
    shade.remove();
  });
  place();
}

/* ---------- Views ---------- */

function renderList(host, occs, props, ics, ui) {
  const list = el2('div', 'urd-collection-list');
  for (const occ of occs) {
    const row = ui.tint(el2('article', 'urd-collection-row'), occ);
    row.appendChild(badgeNode(occ, ui));
    const body = el2('div', 'urd-collection-body');
    const titleRow = el2('div', 'urd-cal-titlerow');
    titleRow.appendChild(ui.field('strong', 'title', occ.title, 'urd-collection-title'));
    const chip = chipNode(occ.category, occ.color, ui, occ.colors);
    if (chip) titleRow.appendChild(chip);
    body.appendChild(titleRow);
    const meta = ui.meta(occ);
    if (meta) body.appendChild(meta);
    const signup = ui.signup(occ);
    if (signup) body.appendChild(signup);
    row.appendChild(body);
    list.appendChild(row);
  }
  host.appendChild(list);
}

function renderCards(host, occs, props, ics, ui) {
  const grid = el2('div', 'urd-collection-cards');
  for (const occ of occs) {
    const card = ui.tint(el2('article', 'urd-collection-card'), occ);
    const top = el2('div', 'urd-cal-titlerow');
    const when = ui.meta(occ);
    if (when) {
      when.className = 'urd-collection-date';
      top.appendChild(when);
    }
    const chip = chipNode(occ.category, occ.color, ui, occ.colors);
    if (chip) top.appendChild(chip);
    card.appendChild(top);
    card.appendChild(ui.field('strong', 'title', occ.title, 'urd-collection-title'));
    const excerpt = ui.descriptionIn === 'card' ? '' : ui.excerpt(occ.description);
    if (excerpt) card.appendChild(ui.field('div', 'description', excerpt, 'urd-collection-text'));
    const signup = ui.signup(occ);
    if (signup) card.appendChild(signup);
    grid.appendChild(card);
  }
  host.appendChild(grid);
}

/** One featured event in the «next» card: badge, title, when and where, the countdown and the signup. */
function nextRow(occ, ui) {
  const row = ui.tint(el2('div', 'urd-cal-next-row'), occ);
  row.appendChild(badgeNode(occ, ui));
  const body = el2('div', null);
  const titleRow = el2('div', 'urd-cal-titlerow');
  titleRow.appendChild(ui.field('strong', 'title', occ.title, 'urd-cal-next-title'));
  const chip = chipNode(occ.category, occ.color, ui, occ.colors);
  if (chip) titleRow.appendChild(chip);
  body.appendChild(titleRow);
  const meta = ui.meta(occ);
  if (meta) body.appendChild(meta);
  body.appendChild(el2('div', 'urd-cal-next-count', ui.countdown(occ)));
  const signup = ui.signup(occ);
  if (signup) body.appendChild(signup);
  row.appendChild(body);
  return row;
}

/**
 * The «next» card: the next one to three events in full (props.nextCount), and as many more as props.laterCount says as one-line rows under «Later».
 */
function renderNext(host, occs, props, ics, ui) {
  if (!occs.length) return;
  const count = ics.nextCount(props.nextCount);
  const panel = el2('div', 'urd-cal-next');
  // One event is «the next event»; several are what is on right now.
  const label = el2('div', 'urd-cal-next-label');
  label.appendChild(ui.tx(count > 1 ? 'now' : 'next'));
  panel.appendChild(label);
  for (const occ of occs.slice(0, count)) panel.appendChild(nextRow(occ, ui));
  const later = occs.slice(count, count + ics.laterCount(props.laterCount));
  if (later.length) {
    const laterLabel = el2('div', 'urd-cal-next-label urd-cal-later-label');
    laterLabel.appendChild(ui.tx('later'));
    panel.appendChild(laterLabel);
    const list = el2('ul', 'urd-cal-later');
    for (const occ of later) {
      const item = ui.tint(el2('li', null), occ);
      const when = ui.meta(occ, { place: false });
      if (when) {
        when.className = 'urd-cal-later-when';
        item.appendChild(when);
      }
      item.appendChild(ui.field('span', 'title', occ.title, 'urd-cal-later-title'));
      list.appendChild(item);
    }
    panel.appendChild(list);
  }
  host.appendChild(panel);
}

/** The agenda: compact rows under their month, for a programme that is read rather than browsed. */
function renderAgenda(host, occs, props, ics, ui) {
  const wrap = el2('div', 'urd-cal-agenda');
  for (const group of ics.groupByMonth(occs)) {
    wrap.appendChild(el2('h4', 'urd-cal-agenda-month', ui.monthYear(group.year, group.month)));
    const list = el2('ul', 'urd-cal-agenda-list');
    for (const occ of group.items) {
      const start = new Date(occ.start);
      const item = ui.tint(el2('li', 'urd-cal-agenda-row'), occ);
      const day = el2('span', 'urd-cal-agenda-day');
      day.append(ui.field('strong', 'number', String(start.getDate()), null, start), ui.field('span', 'date', dates().weekdaysShort[(start.getDay() + 6) % 7], null, start));
      const body = el2('span', 'urd-cal-agenda-body');
      const titleRow = el2('span', 'urd-cal-titlerow');
      titleRow.appendChild(ui.field('strong', 'title', occ.title));
      const chip = chipNode(occ.category, occ.color, ui, occ.colors);
      if (chip) titleRow.appendChild(chip);
      body.appendChild(titleRow);
      const where = ui.meta(occ, { date: false });
      if (where) body.appendChild(where);
      const signup = ui.signup(occ);
      if (signup) body.appendChild(signup);
      item.append(day, body);
      list.appendChild(item);
    }
    wrap.appendChild(list);
  }
  host.appendChild(wrap);
}

/**
 * The empty state: an icon and a line of text, in every view.
 * The words are the owner's (props.emptyText) or the translated default; the icon is an id from the icon library (props.emptyIcon), the calendar when none is set and nothing at all for 'none'.
 */
function emptyNode(props) {
  const box = el2('div', 'urd-cal-empty');
  const icon = props.emptyIcon === 'none' ? null : (iconSvg(props.emptyIcon) || iconSvg('calendar'));
  if (icon) {
    const mark = el2('span', 'urd-cal-empty-icon');
    mark.setAttribute('aria-hidden', 'true');
    mark.innerHTML = icon;
    box.appendChild(mark);
  }
  const words = typeof props.emptyText === 'string' ? props.emptyText.trim() : '';
  box.appendChild(el2('p', 'urd-cal-empty-text', words || t('calendar.empty')));
  return box;
}

/**
 * ApeironLF's empty state, for the designs that declare it: a pill with a kicker and a heading, the owner's line and icon in a dashed box, and the subscribe buttons under it.
 */
function emptyApNode(props, ui) {
  const wrap = el2('div', 'urd-cal-apempty');
  const pill = el2('div', 'urd-cal-apempty-pill');
  for (const [key, className] of [['emptyKicker', 'urd-cal-apempty-kicker'], ['emptyTitle', 'urd-cal-apempty-title']]) {
    const part = ui.line(el2('span', className), key, { carry: true });
    if (part) pill.appendChild(part);
  }
  if (ui.group(pill)) wrap.appendChild(pill);
  wrap.appendChild(emptyNode(props));
  return wrap;
}

function renderMonth(host, occs, props, ics, ui) {
  const now = ui.today();
  let shown = { y: now.getFullYear(), mo: now.getMonth() };

  const wrap = el2('div', 'urd-cal-month');
  const head = el2('div', 'urd-cal-month-head');
  const prev = el2('button', 'urd-cal-nav', '‹');
  prev.type = 'button';
  prev.setAttribute('aria-label', t('calendar.prevMonth'));
  const label = ui.live(el2('strong', null, ''));
  const next = el2('button', 'urd-cal-nav', '›');
  next.type = 'button';
  next.setAttribute('aria-label', t('calendar.nextMonth'));
  head.append(prev, label, next);
  const grid = el2('div', 'urd-cal-grid');
  wrap.append(head, grid);
  // On the phone a day is a button with dots, and its events are listed under the grid.
  const panel = ui.phone ? el2('div', 'urd-cal-daylist') : null;
  if (panel) wrap.appendChild(panel);

  const move = (dir) => {
    shown = shown.mo + dir < 0 ? { y: shown.y - 1, mo: 11 } : shown.mo + dir > 11 ? { y: shown.y + 1, mo: 0 } : { ...shown, mo: shown.mo + dir };
    paint();
  };
  const paint = () => {
    label.textContent = ui.monthYear(shown.y, shown.mo);
    grid.replaceChildren();
    for (const day of ui.dows()) grid.appendChild(el2('div', 'urd-cal-dow', day));
    const first = new Date(shown.y, shown.mo, 1);
    const lead = ui.lead(first);
    const dim = new Date(shown.y, shown.mo + 1, 0).getDate();
    const today = ui.today();
    for (let i = 0; i < lead; i++) grid.appendChild(el2('div', 'urd-cal-day urd-cal-day-empty'));
    if (panel) {
      ui.phoneDays(grid, panel, shown.y, shown.mo, occs, 'urd-cal-day');
      ui.dayGrid(grid, '.urd-cal-pday', { page: move, current: '[aria-pressed="true"]' });
      return;
    }
    for (let d = 1; d <= dim; d++) {
      const cell = el2('div', 'urd-cal-day');
      if (d === today.getDate() && shown.mo === today.getMonth() && shown.y === today.getFullYear()) {
        cell.classList.add('urd-cal-today');
      }
      cell.appendChild(el2('span', 'urd-cal-daynum', String(d)));
      const todays = occs.filter((occ) => {
        const s = new Date(occ.start);
        return s.getFullYear() === shown.y && s.getMonth() === shown.mo && s.getDate() === d;
      });
      for (const occ of todays.slice(0, 3)) {
        const pill = ui.tint(ui.field('div', 'title', occ.title, 'urd-cal-pill'), occ);
        pill.title = `${occ.title}\n${ui.metaString(occ)}`;
        cell.appendChild(pill);
      }
      if (todays.length > 3) cell.appendChild(el2('div', 'urd-cal-more', ui.tx('moreN', null, { n: todays.length - 3 })));
      ui.dayLabel(cell, new Date(shown.y, shown.mo, d), todays.length);
      grid.appendChild(cell);
    }
    ui.dayGrid(grid, '.urd-cal-day:not(.urd-cal-day-empty)', { page: move, current: '.urd-cal-today' });
  };
  prev.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  paint();
  host.appendChild(wrap);
}

/**
 * The phone design (calPhoneDesign): one stacked agenda for a design that cannot be read on a phone, drawn in the design's set.
 * A design that shows a span (a year) lists what is coming, counted by the block's max count, since its whole span is loaded.
 */
function renderPhoneAgenda(host, occs, props, ics, ui) {
  const wrap = el2('div', 'urd-cal-pa');
  let list = occs;
  if (!ui.rest && ui.spanView) {
    const soon = ui.today().getTime() - 6 * 3600 * 1000;
    list = occs.filter((occ) => (occ.end ?? occ.start) >= soon).slice(0, Math.max(1, Number(props.limit) || 6));
  }
  if (!ui.rest) {
    const head = el2('div', 'urd-cal-pa-head');
    head.appendChild(ui.tx('swUpcoming', 'urd-cal-pa-title'));
    if (list[0]) head.appendChild(el2('span', 'urd-cal-pa-next', ui.countdown(list[0])));
    wrap.appendChild(head);
  }
  for (const occ of list) {
    const row = ui.tint(el2('article', 'urd-cal-pa-row'), occ);
    const when = ui.meta(occ, { place: false });
    if (when) {
      when.className = 'urd-cal-pa-when';
      row.appendChild(when);
    }
    row.appendChild(ui.field('strong', 'title', occ.title, 'urd-cal-pa-name'));
    if (occ.location) row.appendChild(ui.field('span', 'place', occ.location, 'urd-cal-pa-place'));
    const signup = ui.signup(occ);
    if (signup) row.appendChild(signup);
    wrap.appendChild(row);
  }
  host.appendChild(wrap);
}

const VIEWS = { list: renderList, cards: renderCards, month: renderMonth, next: renderNext, agenda: renderAgenda };

/* ---------- Subscribe and category filter ---------- */

/** The subscribe buttons for the sources that can be subscribed to (a registry calendar can be kept out). */
function subscribeRow(ics, sources, ui) {
  const row = el2('div', 'urd-cal-subscribe');
  const open = sources.filter((source) => source.subscribable);
  for (const source of open) {
    const links = ics.subscribeLinks(source.url);
    if (!links) continue;
    row.appendChild(ui.link('urd-cal-sub-btn', open.length > 1 ? 'subscribeMulti' : 'subscribe', links.webcal, t('calendar.subscribeTitle')));
    if (links.google) {
      const google = ui.link('urd-cal-sub-btn', 'addGoogle', links.google, t('calendar.addGoogleTitle'));
      google.target = '_blank';
      google.rel = 'noopener';
      row.appendChild(google);
    }
  }
  return row.children.length ? row : null;
}

function categoryRow(occs, active, onpick, ui) {
  const categories = [...new Set(occs.map((occ) => occ.category).filter(Boolean))];
  if (categories.length < 2) return null;
  const sampleOf = (category) => occs.find((occ) => occ.category === category && occ.color);
  const describedAs = (category) => occs.find((occ) => occ.category === category && occ.calendarDescription)?.calendarDescription ?? '';
  const row = el2('div', 'urd-cal-chips');
  row.setAttribute('role', 'group');
  row.setAttribute('aria-label', t('calendar.categoriesLabel'));
  const all = el2('button', 'urd-cal-chipbtn');
  all.type = 'button';
  all.appendChild(ui.tx('all'));
  all.dataset.calKey = 'category';
  all.setAttribute('aria-pressed', active ? 'false' : 'true');
  if (!active) all.classList.add('selected');
  all.addEventListener('click', () => onpick(null));
  row.appendChild(all);
  for (const category of categories) {
    const btn = el2('button', 'urd-cal-chipbtn');
    btn.type = 'button';
    btn.appendChild(ui.field('span', 'category', category));
    const sample = sampleOf(category);
    paintColor(btn, sample?.color ?? '', sample?.colors);
    // The registry's description of the calendar, as the chip's tooltip.
    const description = describedAs(category);
    if (description) btn.title = description;
    btn.dataset.calKey = `category-${category}`;
    btn.setAttribute('aria-pressed', active === category ? 'true' : 'false');
    if (active === category) btn.classList.add('selected');
    btn.addEventListener('click', () => onpick(category));
    row.appendChild(btn);
  }
  return row;
}

/**
 * The fold for the events beyond the max count: a native details element whose summary counts them, with the same design drawing the rest inside it, so the whole list is in the page.
 */
function foldNode(render, rest, total, props, ics, ui) {
  const fold = el2('details', 'urd-cal-fold');
  fold.appendChild(el2('summary', 'urd-cal-fold-summary', ui.tx('showAll', null, { n: total, m: rest.length })));
  const body = el2('div', 'urd-cal-fold-body');
  ui.offset = total - rest.length;
  ui.rest = true;
  render(body, rest, props, ics, ui);
  ui.offset = 0;
  ui.rest = false;
  fold.appendChild(body);
  return fold;
}

const SEARCH_WAIT = 200;

/**
 * The search field: one node for the life of the block, so the words and the caret stay while the calendar is redrawn under it.
 * On a phone the field is folded behind a button with the search icon, and opens when the button is pressed; it stays open while it holds words.
 */
function searchField(onsearch) {
  const row = el2('div', 'urd-cal-searchrow');
  const open = el2('button', 'urd-cal-searchbtn');
  open.type = 'button';
  open.setAttribute('aria-label', t('calendar.search'));
  open.setAttribute('aria-expanded', 'false');
  open.innerHTML = iconSvg('search') || '';
  const input = el2('input', 'urd-cal-search');
  input.type = 'search';
  input.placeholder = t('calendar.search');
  input.setAttribute('aria-label', t('calendar.search'));
  open.addEventListener('click', () => {
    const shown = row.classList.toggle('urd-cal-search-open');
    open.setAttribute('aria-expanded', shown ? 'true' : 'false');
    if (shown) input.focus({ preventScroll: true });
  });
  row.appendChild(open);
  // The number of matches, read out by a screen reader after a search.
  const status = el2('span', 'urd-cal-loading-text');
  status.setAttribute('role', 'status');
  let timer = 0;
  input.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      // The redraw takes the field off the page for a moment: the focus is given back only when the field had it.
      const had = document.activeElement === input;
      const count = onsearch(input.value.trim());
      status.textContent = input.value.trim() ? tp('calendar.count', count) : '';
      if (had) input.focus({ preventScroll: true });
    }, SEARCH_WAIT);
  });
  row.append(input, status);
  return row;
}

const EARLIER_MAX = 50;

/** The events that are over, the latest first, folded under «Earlier» with their count; a row opens the event in full. */
function earlierNode(past, ui) {
  const fold = el2('details', 'urd-cal-fold urd-cal-earlier');
  fold.appendChild(el2('summary', 'urd-cal-fold-summary', ui.tx('earlier', null, { n: past.length })));
  const body = el2('div', 'urd-cal-earlier-rows');
  for (const occ of past.slice(0, EARLIER_MAX)) {
    const start = new Date(occ.start);
    const row = ui.tint(el2('div', 'urd-cal-earlier-row'), occ);
    row.appendChild(ui.field('span', 'date', ui.dayMonth(start), 'urd-cal-earlier-date', start));
    row.appendChild(ui.field('strong', 'title', occ.title));
    if (occ.location) row.appendChild(ui.field('span', 'place', occ.location, 'urd-cal-earlier-place'));
    body.appendChild(row);
  }
  fold.appendChild(body);
  return fold;
}

/** The view switcher: the block's own design, the week and the month, as a row of pressed buttons. */
const SWITCH_MODES = [['own', 'swUpcoming'], ['week', 'swWeek'], ['month', 'swMonth']];

function switchRow(mode, onpick, ui) {
  const row = el2('div', 'urd-cal-switch');
  row.setAttribute('role', 'group');
  row.setAttribute('aria-label', t('calendar.viewsLabel'));
  for (const [id, key] of SWITCH_MODES) {
    const btn = el2('button', 'urd-cal-switch-btn');
    btn.type = 'button';
    btn.setAttribute('aria-pressed', mode === id ? 'true' : 'false');
    btn.dataset.calKey = `view-${id}`;
    btn.appendChild(ui.tx(key));
    btn.addEventListener('click', () => onpick(id));
    row.appendChild(btn);
  }
  return row;
}

/* ---------- A day grid on the keyboard ---------- */

const GRIDS = new WeakMap();

/** One day holds the grid's tab stop, and the events inside it with it. */
function setStop(days, target) {
  for (const day of days) {
    const on = day === target;
    day.tabIndex = on ? 0 : -1;
    for (const event of day.querySelectorAll('.urd-cal-event')) event.tabIndex = on ? 0 : -1;
  }
}

/**
 * A day grid as one tab stop, called after every paint of the grid.
 * The arrow keys move between the days (up and down to the day above and below on the screen), Home and End to the ends of the row, and PageUp and PageDown to the span before and after (`page`, the design's own move through its weeks or months); an arrow past the first or the last day pages too.
 * Tab from a day goes through that day's events and out of the grid.
 * The tab stop starts on the day `current` matches, else the first.
 */
function dayGrid(grid, selector, { page = null, current = null } = {}, keysOn = () => true) {
  let state = GRIDS.get(grid);
  if (!state) {
    state = { want: null, focus: false };
    GRIDS.set(grid, state);
    const daysOf = () => [...grid.querySelectorAll(state.selector)];
    grid.addEventListener('focusin', (event) => {
      const day = event.target.closest?.(state.selector);
      if (day && grid.contains(day)) setStop(daysOf(), day);
    });
    grid.addEventListener('keydown', (event) => {
      if (!keysOn() || !event.target.matches?.(state.selector)) return;
      const days = daysOf();
      const i = days.indexOf(event.target);
      const box = event.target.getBoundingClientRect();
      const boxes = days.map((day) => day.getBoundingClientRect());
      const sameRow = days.filter((_, n) => Math.abs(boxes[n].top - box.top) < 2);
      // The day straight above or below: the nearest row in that direction, and in it the day nearest sideways.
      const vertical = (dir) => {
        const rows = boxes.map((b, n) => ({ b, n })).filter(({ b }) => (dir < 0 ? b.top < box.top - 2 : b.top > box.top + 2));
        if (!rows.length) return null;
        const near = rows.reduce((best, row) => (Math.abs(row.b.top - box.top) < Math.abs(best.b.top - box.top) ? row : best));
        const inRow = rows.filter((row) => Math.abs(row.b.top - near.b.top) < 2);
        return days[inRow.reduce((best, row) => (Math.abs(row.b.left - box.left) < Math.abs(best.b.left - box.left) ? row : best)).n];
      };
      const turn = (dir, want) => {
        if (!state.page) return;
        Object.assign(state, { want, focus: true });
        state.page(dir);
      };
      let to = null;
      if (event.key === 'ArrowLeft') to = days[i - 1] ?? (() => turn(-1, 'last'));
      else if (event.key === 'ArrowRight') to = days[i + 1] ?? (() => turn(1, 0));
      else if (event.key === 'ArrowUp') to = vertical(-1) ?? (() => turn(-1, 'last'));
      else if (event.key === 'ArrowDown') to = vertical(1) ?? (() => turn(1, 0));
      else if (event.key === 'Home') to = sameRow[0];
      else if (event.key === 'End') to = sameRow[sameRow.length - 1];
      else if (event.key === 'PageUp') to = () => turn(-1, i);
      else if (event.key === 'PageDown') to = () => turn(1, i);
      else return;
      event.preventDefault();
      if (typeof to === 'function') to();
      else to.focus();
    });
  }
  Object.assign(state, { selector, page });
  const days = [...grid.querySelectorAll(selector)];
  if (!days.length) return;
  let at = state.want === 'last' ? days.length - 1 : Number.isInteger(state.want) ? Math.min(state.want, days.length - 1) : current ? days.findIndex((day) => day.matches(current)) : 0;
  if (at < 0) at = 0;
  setStop(days, days[at]);
  if (state.focus) days[at].focus();
  Object.assign(state, { want: null, focus: false });
}

/* ---------- Structured data ---------- */

/**
 * The events a published calendar shows, written into <head> as JSON-LD (schema.org `Event`), one script per block.
 * It carries the mark seo.js clears at every page render, so a page left takes its events with it.
 */
function writeEventData(el, occs, ics, ctx, meetingHosts) {
  const id = el.dataset.blockId ?? '';
  for (const old of document.head.querySelectorAll('script[data-urd-cal]')) {
    if (old.dataset.urdCal === id) old.remove();
  }
  const site = { pageUrl: location.origin + location.pathname, organizer: ctx.site?.site?.title ?? '', meetingHosts };
  // A calendar with an organizer of its own in the site's registry names it, with its page, in place of the site.
  const events = occs.slice(0, PRINT_MAX).map((occ) => ics.eventJsonLd(occ, occ.calendarOrganizer
    ? { ...site, organizer: occ.calendarOrganizer, organizerUrl: occ.calendarLink || '' }
    : site)).filter(Boolean);
  if (!events.length) return;
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.dataset.urdSeo = '1';
  script.dataset.urdCal = id;
  script.textContent = JSON.stringify(events);
  document.head.appendChild(script);
}

/* ---------- The printed list ---------- */

const PRINT_MAX = 40;
/** The views that show a span of time, not a count of what is coming. */
const SPAN_VIEWS = ['month', 'week', 'day', 'year'];
/** How far back «Earlier» reaches. */
const EARLIER_DAYS = 90;

/** The events as a plain list, drawn for the printed page only (base.css shows it in print and hides the design). */
function printList(occs, ui) {
  const list = el2('ul', 'urd-cal-print');
  for (const occ of occs.slice(0, PRINT_MAX)) {
    const start = new Date(occ.start);
    const item = el2('li');
    item.appendChild(ui.field('span', 'date', ui.dateLine(start, true), null, start));
    if (ui.hasTime(occ)) item.append(' ', ui.field('span', 'time', ui.timeText(occ), null, occ));
    item.append(' ', el2('strong', null, occ.title));
    if (occ.location) item.append(' · ', el2('span', null, occ.location));
    // The printed list is black on white: the owner's field styles are for the screen; and its words, the owner's included, are printed, never edited.
    for (const field of item.querySelectorAll('[style]')) field.removeAttribute('style');
    for (const words of item.querySelectorAll('.urd-text')) {
      words.removeAttribute('contenteditable');
      words.classList.remove('urd-text');
    }
    list.appendChild(item);
  }
  return list;
}

/* ---------- The month on the phone ---------- */

const DAY_MS = 24 * 3600 * 1000;
const DOTS_MAX = 4;

/**
 * The days of a month as the phone draws them: every day a button with its number and a dot per event, and the picked day's events listed in the panel under the grid.
 * Today is picked first, else the month's first day with an event.
 * The day buttons are appended to the grid after its lead cells.
 */
function phoneDays(ui, grid, panel, year, month, occs, cellClass) {
  const today = ui.today();
  const dim = new Date(year, month + 1, 0).getDate();
  // A day's events: an all-day event covers its last day too, and a day is a calendar day, whatever its length in hours.
  const eventsOf = (d) => {
    const from = new Date(year, month, d).getTime();
    const to = new Date(year, month, d + 1).getTime();
    return occs.filter((occ) => occ.start < to && (occ.allDay ? new Date(new Date(occ.end ?? occ.start).setHours(24, 0, 0, 0)).getTime() : Math.max(occ.end ?? occ.start, occ.start + 1)) > from);
  };
  const buttons = [];
  const pick = (d) => {
    buttons.forEach((btn, i) => btn.setAttribute('aria-pressed', i + 1 === d ? 'true' : 'false'));
    const date = new Date(year, month, d);
    const list = el2('div', 'urd-cal-daylist-rows');
    for (const occ of eventsOf(d)) {
      const row = ui.tint(el2('div', 'urd-cal-daylist-row'), occ);
      if (ui.hasTime(occ)) row.appendChild(ui.field('span', 'time', ui.time(occ), 'urd-cal-daylist-time', occ));
      row.appendChild(ui.field('strong', 'title', occ.title));
      if (occ.location) row.appendChild(ui.field('span', 'place', occ.location, 'urd-cal-daylist-place'));
      list.appendChild(row);
    }
    if (!list.children.length) list.appendChild(el2('p', 'urd-cal-daylist-none', ui.tx('dayNone')));
    panel.replaceChildren(
      ui.field('strong', 'date', ui.dateLine(date, true), 'urd-cal-daylist-head', date),
      list,
    );
  };
  let first = 0;
  for (let d = 1; d <= dim; d++) {
    const events = eventsOf(d);
    const btn = el2('button', `${cellClass} urd-cal-pday`);
    btn.type = 'button';
    btn.setAttribute('aria-pressed', 'false');
    btn.setAttribute('aria-label', `${ui.dayMonth(new Date(year, month, d), true)}, ${tp('calendar.count', events.length)}`);
    if (d === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
      btn.classList.add('urd-cal-pday-today');
      first = d;
    }
    btn.appendChild(el2('i', 'urd-cal-pday-num', String(d)));
    const dots = el2('span', 'urd-cal-dots');
    for (const occ of events.slice(0, DOTS_MAX)) dots.appendChild(tintNode(el2('i'), occ));
    btn.appendChild(dots);
    if (events.length && !first) first = d;
    btn.addEventListener('click', () => pick(d));
    buttons.push(btn);
    grid.appendChild(btn);
  }
  if (first) pick(first);
  else panel.replaceChildren();
}

/* ---------- Loading ---------- */

/** The height the calendar last had in this viewport, kept for the session so the loading state can stand at it. */
const heightKey = (el, ctx) => `urd-cal-h:${el.dataset.blockId ?? ''}:${ctx.viewport === 'mobile' ? 'm' : 'd'}`;

/**
 * The loading state: quiet bars at the height the calendar will have, with the word for a screen reader.
 * The height the session saw is the closest; without it the phone takes the height the editor measured there (`--urd-loading-h`, base.css).
 */
function loadingNode(el, ctx) {
  const box = el2('div', 'urd-cal-loading');
  box.setAttribute('role', 'status');
  box.appendChild(el2('span', 'urd-cal-loading-text', t('calendar.loading')));
  for (let i = 0; i < 4; i++) box.appendChild(el2('i'));
  try {
    const known = Number(sessionStorage.getItem(heightKey(el, ctx)));
    if (known > 0) box.style.minHeight = `${known}px`;
  } catch { /* without the store the loading state stands at its own height */ }
  return box;
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

// The editor's block menu lists the designs, so the preview loads the design model up front; a visitor loads it with the first calendar on a page.
if (typeof location !== 'undefined' && new URLSearchParams(location.search).has('preview')) {
  import('../calendar-designs.js').then(keepDesignVariants, () => {});
}

/* ---------- The block ---------- */

/** The width in px below which a calendar draws its narrow layouts (drawCalendar): the width at which seven columns stop being readable, the same as the week strip's own container query in base.css. */
const NARROW_PX = 540;

function renderCalendar(el, props, ctx) {
  closeOrphanCards();
  const host = el2('div', 'urd-cal');
  el.appendChild(host);
  // The ruler the calendar reads its own width from (drawCalendar).
  const ruler = el2('div', 'urd-block-ruler');
  ruler.setAttribute('aria-hidden', 'true');
  el.appendChild(ruler);
  // A calendar with a feed, an address of its own or a reference to the site's registry, stands in its loading state until the events are drawn.
  if ((props.sources ?? []).some((source) => (typeof source === 'string' ? source.trim() : source && (source.url || source.calendar)))) {
    host.setAttribute('aria-busy', 'true');
    host.appendChild(loadingNode(el, ctx));
  }
  // The parser and the design model are loaded together, on the first render, and a design's renderer module with them (literal paths, so the modules stay out of the visitor closure and the preload list).
  const DESIGN_MODULES = { list: () => import('./calendar-list.js'), cards: () => import('./calendar-cards.js'), time: () => import('./calendar-time.js'), next: () => import('./calendar-next.js'), more: () => import('./calendar-more.js'), retro: () => import('./calendar-retro.js') };
  Promise.all([import('../ics.js'), import('../calendar-designs.js'), import('../calendar-format.js'), import('../map-links.js'), import('../meeting-links.js')]).then(async ([ics, cd, cf, maps, links]) => {
    const design = cd.calDesign(props.design);
    const mod = design.module ? await DESIGN_MODULES[design.module]?.() : null;
    // The view switcher draws the week with the week strip, so its module comes along.
    const weekMod = cd.calSwitcher(props) ? await DESIGN_MODULES.time() : null;
    // The phone design the block draws on a phone (calPhoneView) and the card design its card wears (calCardDesign), when they are a module's own.
    const lent = async (def) => (!def.module ? null : def.module === design.module ? mod : await DESIGN_MODULES[def.module]?.());
    const phoneMod = await lent(cd.calPhoneDesignDef(cd.calPhoneView(props), props));
    const cardMod = await lent(cd.calCardDesignDef(cd.calCardDesign(props)));
    if (host.isConnected) drawCalendar(ics, cd, cf, maps, links, mod, weekMod, phoneMod, cardMod, el, host, props, ctx);
  }).catch((error) => {
    // A module that did not load, or a design that threw: the loading state gives way to the empty state.
    console.warn('Urd: the calendar could not be drawn', error);
    if (!host.isConnected) return;
    host.removeAttribute('aria-busy');
    host.replaceChildren(emptyNode(props));
  });
}

function drawCalendar(ics, cd, cf, maps, links, mod, weekMod, phoneMod, cardMod, el, host, props, ctx) {
  // The site's own time zone, when set: every visitor sees the times on that zone's clock.
  const siteZone = ctx.site?.site?.timeZone;
  const zone = cf.zoneValid(siteZone) ? siteZone.trim() : null;
  // The sources with the site's registry resolved into them: the addresses, names, colours and the registry's words.
  const sources = ics.resolveSources(props.sources, ctx.site?.site?.calendars);
  let activeCategory = null;
  let query = '';
  let shown = null;
  const search = props.showSearch === true ? searchField((words) => {
    query = words;
    if (shown) draw(shown.occurrences, shown.note);
    return ui.total;
  }) : null;
  // The view switcher's mode: the block's own design until the visitor picks the week or the month.
  const switcher = Boolean(weekMod);
  let mode = 'own';
  // The design: its class, the owner's colour slots and the edge stripe on the host.
  const design = cd.calDesign(props.design);
  const view = cd.calView(props);
  host.className = `urd-cal urd-cal-d-${design.id} urd-cal-set-${design.set}`;
  // The size of the finding tools (the switcher, the chips, the search and the week's and month's arrows): small, normal or large.
  if (props.toolsSize === 's' || props.toolsSize === 'l') host.classList.add(`urd-cal-tools-${props.toolsSize}`);
  for (const [name, value] of Object.entries(cd.calSlotVars(design, props.colors))) host.style.setProperty(name, value);
  // The text on the calendar's accent follows the accent the owner picked.
  const accentInk = props.colors?.accent ? inkOn(props.colors.accent) : null;
  if (accentInk) host.style.setProperty('--urd-cal-accent-text', accentInk);
  const stripe = cd.calStripe(design, props.stripe);
  host.classList.toggle('urd-cal-stripes', stripe.show);
  if (stripe.color) host.style.setProperty('--urd-cal-stripe', stripe.color);
  // The phone design (calPhoneView) and the card design (calCardDesign) the block wears, each as a class of its own; the card's dress is written for the card (dressDialog).
  const phoneView = cd.calPhoneView(props);
  const phoneDef = cd.calPhoneDesignDef(phoneView, props);
  host.classList.add(`urd-cal-pv-${phoneView}`);
  const card = cd.calCardDesign(props);
  const cardDress = cd.calCardDress(props);
  host.classList.add(`urd-cal-card-${card}`);
  host.dataset.cardSet = cardDress.set;
  host.dataset.cardClasses = cardDress.classes.join(' ');
  host.dataset.cardColours = cardDress.ownColours ? 'on' : 'off';
  const ui = makeUi(cd, cf, ics, maps, links, el, host, props, ctx, sources, zone);
  if (cardMod?.cards?.[card]) ui.dressCard = (dialog, occ) => ui.themedWords(() => cardMod.cards[card](dialog, occ, ui, props));
  // A calendar narrower than NARROW_PX draws its narrow layouts: the designs
  // with seven columns lay their days under each other, and the months show
  // dots that open the day. Where container queries exist the calendar asks
  // its own width (ADR-0025), so a calendar in a narrow column of a wide page
  // is narrow too and a drag passes through both layouts; else the window
  // decides, as the page's phone view.
  // The width counts as the content has it: the block's drawn scale zooms the content (render.js applyZoom) and the frame follows the size, so a calendar drawn smaller has the room it had and keeps its layout.
  const ruler = el.querySelector(':scope > .urd-block-ruler');
  const isNarrow = () => (WIDTH_QUERIES && ruler ? ruler.clientWidth / (parseFloat(host.style.zoom) || 1) < NARROW_PX : ctx.viewport === 'mobile');
  const setNarrow = (narrow) => {
    ui.phone = narrow;
    host.classList.toggle('urd-cal-phone', narrow);
  };
  setNarrow(isNarrow());
  if (WIDTH_QUERIES && ruler) {
    // The ruler hears the width alone, and the calendar is drawn again in the
    // next frame rather than inside the observer, where a change of its height
    // would come back to the push pass as a notification it cannot deliver.
    let frame = 0;
    const watch = new ResizeObserver(() => {
      if (!host.isConnected) {
        watch.disconnect();
        return;
      }
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const narrow = isNarrow();
        if (!host.isConnected || narrow === ui.phone) return;
        setNarrow(narrow);
        if (shown) draw(shown.occurrences, shown.note);
      });
    });
    watch.observe(ruler);
  }
  let feedZone = null;
  // The design's own settings as classes, for the ones the style sheet draws.
  for (const [key, value] of Object.entries(ui.opt)) {
    if (typeof value === 'boolean') host.classList.add(`urd-cal-o-${key}-${value ? 'on' : 'off'}`);
    else if (typeof value === 'string') host.classList.add(`urd-cal-o-${key}-${value}`);
  }

  const draw = (occurrences, note) => {
    shown = { occurrences, note };
    for (const occ of occurrences) if (occ.geo && occ.location) ui.places.set(occ.location, occ.geo);
    host.removeAttribute('aria-busy');
    // A press on the view switcher or a category redraws the calendar: the focus goes back to the button that was pressed.
    const focused = host.contains(document.activeElement) ? document.activeElement.dataset.calKey : null;
    host.replaceChildren();
    closeOrphanCards();
    if (ctx.preview && ctx.viewport !== 'mobile') {
      // Help chip (ADR-0008): the sources, the conventions and the subscribe buttons need explaining.
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
    // With the switcher on, the window reaches back to the start of the week and the month; the block's own design still shows what is coming.
    const own = mode === 'own';
    const soon = ui.today().getTime() - 6 * 3600 * 1000;
    // Cancelled events are shown as cancelled unless the owner has hidden them.
    const kept = props.showCancelled === false ? occurrences.filter((occ) => !occ.cancelled) : occurrences;
    // The visitor's own narrowing: the words searched for, the place and the category.
    const narrowed = kept.filter((occ) => ics.matchesSearch(occ, query) && (!activeCategory || occ.category === activeCategory));
    // A design that counts out what is coming shows nothing that is over; a week, month, day or year shows its whole span.
    const comingOnly = own && !SPAN_VIEWS.includes(view);
    const filtered = comingOnly ? narrowed.filter((occ) => (occ.end ?? occ.start) >= soon) : narrowed;
    const past = comingOnly && props.showEarlier === true ? narrowed.filter((occ) => (occ.end ?? occ.start) < soon).reverse() : [];
    // The max count applies to list, cards and agenda; the month, week, day and year views show their span and next has its own two counts.
    const limit = Math.max(1, props.limit ?? 6);
    const limited = !own || ['next', ...SPAN_VIEWS].includes(view)
      ? filtered
      : filtered.slice(0, limit);
    // A list folds the events beyond the max count instead of dropping them.
    const folds = own && cd.calFolds(props) && filtered.length > limit;
    // The switcher and the search stand on one row, so a phone shows the search as a button beside the switcher.
    const tools = el2('div', 'urd-cal-tools');
    if (switcher) {
      tools.appendChild(switchRow(mode, (picked) => {
        mode = picked;
        draw(occurrences, note);
      }, ui));
    }
    if (search) tools.appendChild(search);
    if (tools.children.length) host.appendChild(tools);
    // The calendar filter, when the owner switched it on; a design with switches of its own (ownFilter), the block's or the one behind the switcher's button, draws no chip row.
    const shownDesign = own ? design : cd.calDesign(cd.calSwitcherViews(props)[mode]);
    const chips = props.showCategories !== true || shownDesign.ownFilter ? null : categoryRow(occurrences, activeCategory, (category) => {
      activeCategory = category;
      draw(occurrences, note);
    }, ui);
    if (chips) host.appendChild(chips);
    // The whole filtered list, for a design that draws more than the rows (the bento's month dots).
    ui.all = filtered;
    ui.total = folds ? filtered.length : limited.length;
    // The category filter, for a design that draws it itself (ownFilter).
    ui.filter = {
      names: [...new Set(occurrences.map((occ) => occ.category).filter(Boolean))],
      active: activeCategory,
      pick: (category) => {
        activeCategory = category;
        draw(occurrences, note);
      },
    };
    // On a phone the block is marked for its phone design, when that is not the design itself.
    const phoneDesign = ui.phone && phoneView !== design.id;
    host.classList.toggle('urd-cal-phone-design', phoneDesign);
    if (mode === 'week' || mode === 'month') {
      // The design behind the button (calSwitcherViews) is drawn in a box of its own that carries its class and its options, so its style sheet rules and settings apply inside the block's own set.
      const chosen = cd.calSwitcherViews(props)[mode];
      const box = el2('div', `urd-cal-swview urd-cal-d-${chosen}`);
      const opt = ui.opt;
      ui.opt = cd.calOptions({ ...props, design: chosen });
      for (const [key, value] of Object.entries(ui.opt)) box.classList.add(`urd-cal-o-${key}-${typeof value === 'boolean' ? (value ? 'on' : 'off') : value}`);
      host.appendChild(box);
      (chosen === 'month' ? renderMonth : weekMod[chosen])(box, limited, props, ics, ui);
      ui.opt = opt;
    } else if (!limited.length && (query || activeCategory) && kept.length) {
      // Events there are, but none the visitor's search or filter leaves.
      // A design with a filter of its own is drawn even so, so the visitor can choose again.
      if (design.ownFilter) (mod?.[design.id] ?? renderList)(host, limited, props, ics, ui);
      host.appendChild(el2('p', 'urd-cal-nomatch', ui.tx('noMatch')));
    } else if (!limited.length) {
      host.appendChild(design.empty === 'ap' ? emptyApNode(props, ui) : emptyNode(props));
    } else {
      if (phoneDesign && phoneDef.look) {
        // On a phone another design, or a phone design a design lends, is drawn in a box of its own that carries that design's set, its class (for a design drawn as itself) and its options, with its words.
        // The owner's colours on this calendar belong to its own design: the box clears them, so the other design is drawn in its own.
        const look = cd.calDesign(phoneDef.look);
        const box = el2('div', `urd-cal-pd urd-cal-set-${look.set}${phoneDef.desktop ? ` urd-cal-d-${look.id}` : ''}`);
        if (look.id !== design.id) for (const name of host.style) if (name.startsWith('--urd-cal-s-') || name === '--urd-cal-accent-text') box.style.setProperty(name, 'initial');
        for (const [key, value] of Object.entries(cd.calOptions({ ...props, design: look.id }))) box.classList.add(`urd-cal-o-${key}-${typeof value === 'boolean' ? (value ? 'on' : 'off') : value}`);
        host.appendChild(box);
        const render = phoneDef.desktop ? (phoneMod?.[look.id] ?? VIEWS[look.view ?? view] ?? renderList) : phoneMod?.[phoneDef.id] ?? renderPhoneAgenda;
        ui.withDesign(look.id, () => {
          render(box, limited, props, ics, ui);
          if (folds) box.appendChild(foldNode(render, filtered.slice(limit), filtered.length, props, ics, ui));
        });
      } else {
        // The design itself, or on a phone the neutral list the block draws in its own set.
        const render = phoneDesign ? renderPhoneAgenda : (mod?.[design.id] ?? VIEWS[view] ?? renderList);
        render(host, limited, props, ics, ui);
        if (folds) host.appendChild(foldNode(render, filtered.slice(limit), filtered.length, props, ics, ui));
      }
    }
    if (past.length) host.appendChild(earlierNode(past, ui));
    // A design that places the subscribe buttons itself (ownSubscribe) gets no row under it; on a phone the phone design decides.
    const ownSubscribe = phoneDesign ? phoneDef.ownSubscribe === true : design.ownSubscribe;
    if (!ownSubscribe || !limited.length || !own) {
      const row = ui.subscribe();
      if (row) host.appendChild(row);
    }
    // The zone the times are shown in, named when it is not the visitor's own: the site's zone when one is set, else the visitor's when the feed is kept in another.
    const nowMs = Date.now();
    let zoneLine = null;
    if (zone && cf.zoneDiffers(zone, nowMs)) zoneLine = ui.tx('zoneOf', null, { zone: cf.zoneName(zone, nowMs, ctx.site?.site?.lang) });
    else if (!zone && cf.zoneValid(feedZone) && cf.zoneDiffers(feedZone, nowMs)) zoneLine = ui.tx('zoneYours', null, { zone: cf.zoneName(null, nowMs, ctx.site?.site?.lang) });
    if (zoneLine && limited.length) host.appendChild(el2('p', 'urd-cal-zone', zoneLine));
    // The printed page gets the events as a plain list: the ones the design counts out, else what is coming.
    const listed = own && !['next', ...SPAN_VIEWS].includes(view) ? limited : filtered.filter((occ) => (occ.end ?? occ.start) >= soon);
    if (listed.length) host.appendChild(printList(listed, ui));
    // Search engines get the same events as structured data, on the published page and from a real feed only.
    if (!ctx.preview && sources.length) writeEventData(el, props.structuredData === false ? [] : listed, ics, ctx, ui.meetingHosts);
    if (focused) [...host.querySelectorAll('[data-cal-key]')].find((node) => node.dataset.calKey === focused)?.focus({ preventScroll: true });
    // The note is editing chrome on the block, not content: it hangs below the block (base.css) and the push pass skips it, so it never makes the block taller in the preview than on the published page.
    el.querySelector(':scope > .urd-cal-note')?.remove();
    if (note) el.appendChild(el2('p', 'urd-cal-note', note));
  };

  if (!sources.length) {
    // Demo data exists only in the preview, where the block follows it as it follows a feed, so the owner sees the whole design; visitors see the empty state, as for a calendar with nothing coming up.
    // A block whose only sources point at calendars no longer in the registry says so in its note.
    if (ctx.preview) adminLocaleReady.then(() => {
      if (host.isConnected) draw(demoOccurrences(), ta((props.sources ?? []).some((source) => source && typeof source === 'object' && 'calendar' in source) ? 'calendar.unknownCalendar' : 'calendar.demoNote'));
    });
    else draw([], null);
    return;
  }

  // The switcher needs the week and the month from their start, whichever is the earlier.
  // The week begins on the day the site's language starts it on, which can be the day before Monday.
  const weekFrom = Math.min(ics.windowStart('week'), ui.weekStartOf(Date.now()));
  // A year design with another month at the top reads a season: twelve months from that month, through the season's end.
  const season = view === 'year' ? ics.seasonRange(ics.seasonTop(ui.opt.firstMonth, ui.today()), ui.today().getTime()) : null;
  const viewFrom = switcher ? Math.min(weekFrom, ics.windowStart('month')) : view === 'week' ? weekFrom : season ? season.from : ics.windowStart(view);
  const from = props.showEarlier === true ? Math.min(viewFrom, Date.now() - EARLIER_DAYS * 24 * 3600 * 1000) : viewFrom;
  loadOccurrences(ics, cf, sources, Math.max(1, props.limit ?? 6), view, from, zone, ui.meetingHosts, season && !switcher ? season.to : undefined).then(({ occurrences, errors, feedZone: fz }) => {
    if (!host.isConnected) return;
    feedZone = fz;
    if (!occurrences.length && errors.length) {
      // Visitors get a quiet empty state; the preview gets the error.
      draw([], ctx.preview ? ta('calendar.feedFailed', { error: errors[0] }) : null);
      return;
    }
    draw(occurrences, ctx.preview && errors.length ? ta('calendar.sourceFailed', { error: errors[0] }) : null);
    try { sessionStorage.setItem(heightKey(el, ctx), String(Math.round(host.offsetHeight))); } catch { /* a full store is fine */ }
  }).catch((error) => {
    // A feed the block could not make sense of: visitors get the quiet empty state, the preview the reason.
    console.warn('Urd: the calendar feed could not be read', error);
    if (host.isConnected) draw([], ctx.preview ? ta('calendar.feedFailed', { error: error?.message ?? String(error) }) : null);
  });
}

export const calendarBlock = {
  version: 1,
  // Natural height in the mobile row grid; on the desktop the push pass owns the box.
  autoGrow: true,
  label: 'Calendar',
  labelKey: 'blocks.calendar',
  // A new calendar starts quiet: the category filter and the subscribe and sign-up buttons are switched on by the owner.
  defaults: () => ({ sources: [], view: 'list', limit: 6, showCategories: false, showSubscribe: false, showSignup: false }),
  // One variant per view and one per design: the preview's block menu lists them as «Calendar: Month», «Calendar: Week strip» and the like.
  get variants() {
    return [...VIEW_NAMES.map(([view, labelKey]) => ({ label: view, labelKey, props: { view } })), ...designVariants];
  },
  migrations: {},
  render: renderCalendar,
};
