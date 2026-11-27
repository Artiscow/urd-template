/**
 * Core block: calendar.
 * An event calendar built from iCal feeds through the site's feed proxy (/api/ics), drawn in the view and design the owner picks.
 * Notes: docs/engine-notes/blocks/calendar.md (Urd repository).
 */
// t() for visitor texts, ta() for the editor chrome, dates() for month and weekday names, tp() for plurals; never called at module level.
import { t, ta, tp, pluralForm, themeString, dates } from '../i18n.js';
import { iconSvg } from '../icons.js';
import { resolveColor, inkOn } from '../theme.js';
import { setRichHtml, plainLines } from '../sanitize.js';
import { WIDTH_QUERIES } from '../render.js';
import { NARROW_PX } from '../push-model.js';
import { linkAttrs } from '../nav-model.js';
import { fetchSource, takeReadied, DESIGN_MODULES, partsIn, designsIn, calendarParts, loadDesign, designModules } from './calendar-load.js';

/** An element with its class and its content: a text, or a node such as a text the owner rewrites. */
const el2 = (tag, className, content) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (content instanceof Node) node.appendChild(content);
  else if (content != null) node.textContent = content;
  return node;
};

/** All sources (resolved, ics.resolveSources) → sorted occurrences with category and signup link. */
/**
 * @param {Map<string, Promise<string>>|null} [early] The feeds the calendar asked for with its modules (renderCalendar), by address: each is taken once, so a redraw reads the session's copy
 */
async function loadOccurrences(ics, cf, sources, limit, view, from, zone, meetingHosts, to = undefined, early = null) {
  const errors = [];
  const events = [];
  let feedZone = null;
  await Promise.all(sources.map(async (entry) => {
    const url = ics.normalizeSourceUrl(entry.url);
    if (!url) { errors.push(ta('calendar.unknownSource', { source: entry.url })); return; }
    try {
      // Every event keeps the source it came from: its name and colours, and from the site's registry its words, page, organizer and place in the filter.
      const readied = takeReadied(url);
      const asked = early?.get(url) ?? readied;
      early?.delete(url);
      const feed = ics.parseIcs(await (asked ?? fetchSource(url)));
      feedZone ??= feed.timezone;
      for (const event of feed.events) events.push({ ...event, source: entry });
    } catch (error) {
      errors.push(`${url}: ${error.message}`);
    }
  }));
  // The window follows the view: a year design wants the whole year, a month, week or day design its own span.
  const wide = ['year', 'month', 'week', 'day'].includes(view) || from < ics.windowStart('list');
  // Over the cap the coming occurrences are kept first, so a year of history never pushes the coming months out.
  const expanded = ics.expandEvents(events, { from, to, max: wide ? 900 : Math.max(limit * 4, 120), near: Date.now() })
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
  // An event in two sources is shown once, and a timed event moves to the site's zone, `real` keeping the moment for the countdowns.
  const placed = zone ? expanded.map((occ) => (occ.allDay ? occ : { ...occ, real: occ.start, start: cf.shiftToZone(occ.start, zone), end: cf.shiftToZone(occ.end, zone) })) : expanded;
  return { occurrences: ics.dedupeOccurrences(placed), errors, feedZone };
}

/* ---------- Demo data (preview only, when no sources or feed) ---------- */

/** A drawn picture for the sample data: hills under a sun, as an inline SVG the preview may load from itself. */
const DEMO_IMAGE = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450"><rect width="800" height="450" fill="#bfe3dd"/><circle cx="610" cy="130" r="64" fill="#f6d77a"/><path d="M0 330 L170 200 L300 300 L450 150 L640 310 L800 220 L800 450 L0 450Z" fill="#3f8f80"/><path d="M0 380 L220 290 L420 370 L620 300 L800 360 L800 450 L0 450Z" fill="#256b5f"/></svg>')}`;

/** The sample calendars' colours, one per calendar, so the sample shows how coloured calendars look. */
const DEMO_COLORS = { demoCat1: '#2f80ed', demoCat2: '#e0632c', demoCat3: '#2e9e5b' };

/** The last drawing of each calendar, by block id: its box, the settings it was drawn with, and whether it was the drawing that waits for the feeds. */
const LAST_DRAWN = new Map();

/** Keeps a calendar's drawing as its last, and lets go of those that have left the page. */
function rememberDrawing(blockId, host, props, waiting) {
  for (const [id, last] of LAST_DRAWN) if (!last.host.isConnected) LAST_DRAWN.delete(id);
  if (blockId) LAST_DRAWN.set(blockId, { host, props: JSON.stringify(props), waiting });
}

/**
 * Fills a calendar drawn again with a copy of its last drawing while its settings are the same, until its own drawing replaces it.
 * @returns {boolean} Whether there was one to copy
 */
function copyLastDrawing(host, el, props, measure = false) {
  const id = el.dataset.blockId ?? '';
  const last = LAST_DRAWN.get(id);
  if (!last || last.props !== JSON.stringify(props)) return false;
  host.className = last.host.className;
  host.style.cssText = last.host.style.cssText;
  for (const child of last.host.children) {
    const copy = child.cloneNode(true);
    copy.inert = true;
    host.appendChild(copy);
  }
  host.dataset.calCopy = last.waiting ? 'wait' : '';
  // The copy is the calendar's drawing now, so a redraw before its own is in copies it in turn; a copy drawn only to be measured leaves the drawing where it stands.
  if (!measure) LAST_DRAWN.set(id, { ...last, host });
  return true;
}

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
 * A node in its calendar's own colour with the text colour that reads on it; the registry's extra colours replace the derived ones when set.
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

function chipNode(category, color, ui, colors = null) {
  if (!category) return null;
  return paintColor(ui.field('span', 'category', category, 'urd-cal-chip'), color, colors);
}

/**
 * The event's picture through the site's own picture route, which checks the host against the allowlist; null when the event has none.
 */
function imageUrl(occ, width = 800) {
  if (!occ.image) return null;
  // The sample data's own drawing is loaded as it is; a feed's picture always goes through the route.
  if (occ.demo && occ.image.startsWith('data:image/svg+xml,')) return occ.image;
  return `/api/photo?p=u&u=${encodeURIComponent(occ.image)}&w=${width}`;
}

/* ---------- The design's helpers (fields, static texts, buttons) ---------- */

/** The preview's editing of a calendar (calendar-edit.js), attached as it loads with the preview's editing layer; null on a visitor's page. */
let editing = null;

/**
 * Attaches the preview's editing: the words written in place, their hints, the help chip, the example events and the block menu's variants.
 * @param {object} api
 */
export function attachEditing(api) {
  editing = api;
}

/** The text each drawn word stands for: its key, the values it was drawn with and its plural form. */
const TEXTS = new WeakMap();

/**
 * The helpers a draw hands its view: the event fields, the design's words the owner rewrites in the preview (`tx`), buttons, times, dates and options.
 */
function makeUi(cd, cf, ics, maps, links, el, host, props, ctx, sources, zone) {
  const lang = ctx.site?.site?.lang;
  const clock12 = cf.calClock12(props);
  // The first day of the week asks the browser's locale data, which costs on its first use, so it is worked out only where a week is drawn.
  let weekStartDay = null;
  const weekStart = () => (weekStartDay ??= cf.calWeekStart(props, lang));
  const editable = Boolean(ctx.preview && editing) && ctx.viewport !== 'mobile';
  // The keys of a day grid belong to the visitor: with the editing handles on in the preview they are left alone.
  const keysOn = () => !ctx.preview || document.body.classList.contains('urd-chrome-off');
  const clean = () => document.body.classList.contains('urd-chrome-off');
  const rewritten = { ...(props.texts ?? {}) };
  // The coordinates a feed gives a place (GEO), by the place's text, so every link to that place leads to the same point.
  const places = new Map();
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
  // The design whose own words the texts take while the owner keeps its word choice (calThemeTexts); the event's card takes the common words.
  let wordsDesign = cd.calDesign(props.design).id;
  let themed = new Set(cd.calThemeTexts(props));
  let plainScope = false;
  /** The dictionary's words for a text in the site language, placeholders left in: the design's own where it has them, else the common ones. */
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
      if (editable) editing.hintFor(node, key, form, plain, env);
      return;
    }
    if (own) {
      // The own words rebuilt from the rich-text allowlist (sanitize.js), a link to a page with the page's address now.
      setRichHtml(node, own, ctx.site?.pages ?? []);
    } else {
      node.textContent = defaultWords(key, form, plain);
    }
    fillValues(node, key, values);
  };
  // What the preview's editing (calendar-edit.js) works on, its words drawn in this render among it.
  const env = editable ? { TEXTS, rewritten, measures, paintText, defaultWords, params, el, ctx, props, cd, clean, drawn: new Set() } : null;
  const tx = (key, className, values = null) => {
    const node = el2('span', className ? `urd-cal-tx ${className}` : 'urd-cal-tx');
    paintText(node, key, values);
    if (editable) editing.wireText(node, key, env);
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
   * A content line (CAL_CONTENT_TEXTS) in its box, or null for a visitor when it is removed or empty; the editor keeps an empty one as a faint hint.
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
   * The announcement's box, null for a visitor without words of its own; its text stops after the design's lines and opens in full in a card.
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
      withCard((card) => card.showNoticeDialog(box, ui, href), box);
    }, true);
    box.addEventListener('keydown', (event) => {
      if ((event.key !== 'Enter' && event.key !== ' ') || event.target !== box || !cut) return;
      selected = el.classList.contains('urd-selected');
      if (editing() && !selected) return;
      event.preventDefault();
      event.stopPropagation();
      withCard((card) => card.showNoticeDialog(box, ui, href), box);
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
   * The event's time as written («18:00-21:00», «all day», «until 6 Oct», «Cancelled»), on a 24-hour clock unless the block asks for 12.
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
  /** A link around words the owner rewrites: with the editing handles on a press edits the words, and in the Clean view the link works as published. */
  const editLink = (a) => {
    if (!editable) return a;
    a.draggable = false;
    a.addEventListener('click', (event) => { if (!clean()) event.preventDefault(); });
    return a;
  };
  /** The announcement's link (calNoticeLink), and what puts it on an anchor: its address, a new tab and the rel words. */
  const noticeLink = cd.calNoticeLink(props, ctx.site?.pages ?? []);
  const noticeOn = (a) => (noticeLink ? Object.assign(a, linkAttrs(noticeLink)) : a);
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
   * The event's box, tinted by its calendar, opens the event in full at a click or Enter; a click on a link, a button or edited text is left to it.
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
  const openEvent = (occ, from) => withCard((card) => plainWords(() => card.showEventDialog(occ, from, ics, ui, props)), from);
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
  const ui = { el: el2, linkedText, tint, field, meta, tx, retx, line, group, notice, link, editLink, signup, chip, recurring, program, openToAll, subscribe, href, noticeHref: noticeLink?.href ?? '', noticeOn, countdown, image: imageUrl, themedWords, withDesign, all: [], offset: 0, total: 0, rest: false, filter: null, opt: cd.calOptions(props), descriptionIn: cd.calDescription(props), time, timeText, timeString, startClock, metaString, hasTime, excerpt, sources,
    dayMonth, dateLine, weekdayDay, monthYear, monthRange, percent,
    /** The week as the site's language lays it out: the empty cells before the first of a month, the weekday names in order, and the first day of a week. */
    lead: (first) => cf.leadDays(first, weekStart()),
    dows: () => cf.orderWeekdays(dates().weekdaysShort, weekStart()),
    weekStartOf: (ms) => cf.startOfWeek(ms, weekStart()),
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

/** The first line of a description with words in it, as plain text, cut at a word boundary near `max` and never inside an address. */
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

/** The event card's code (calendar-card.js), once it is in: loaded when the page is idle, or at the first press that opens a card. */
let cardModule = null;
let cardAsked = null;
export const loadCard = () => (cardAsked ??= import('./calendar-card.js').then((mod) => (cardModule = mod), (error) => {
  cardAsked = null;
  throw error;
}));

/** Opens a card with the card's code: at once where it is in, else once it comes, while what opened the card is still on the page. */
function withCard(open, from) {
  if (cardModule) {
    open(cardModule);
    return;
  }
  loadCard().then((card) => {
    if (from?.isConnected) open(card);
  }, (error) => console.warn('Urd: the card could not be opened', error));
}

/** Loads the card's code once the page is idle (a timer where the browser has no idle callback), so a press finds it in. */
let cardSoon = false;
function cardWhenIdle() {
  if (cardSoon) return;
  cardSoon = true;
  const go = () => loadCard().catch(() => {});
  if (typeof requestIdleCallback === 'function') requestIdleCallback(go, { timeout: 3000 });
  else setTimeout(go, 1500);
}

/** Closes a card whose event is gone from the page; with the card's code not in, no card is open. */
function closeOrphanCards() {
  cardModule?.closeOrphanCards();
}

/* ---------- Views ---------- */

/**
 * The empty state in every view: an icon and a line of text, the owner's own (emptyText, emptyIcon) or the translated default and the calendar icon.
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
 * ApeironLF's empty state, for the designs that declare it: a pill with a kicker and a heading, the owner's line and icon, and the subscribe buttons.
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
 * The fold for the events beyond the max count: a native details element whose summary counts them, the same design drawing the rest inside it.
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
 * The search field, one node for the block's life so its words and caret stay through a redraw; on a phone it folds behind a search button.
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
 * Makes a day grid one tab stop: the arrow keys, Home, End, PageUp and PageDown move between the days, and Tab goes through the day's events and out.
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
 * Writes the events a published calendar shows into <head> as JSON-LD (schema.org Event), one script per block, marked so seo.js clears it.
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

/** The events as a plain list, drawn for the printed page only (calendar.css shows it in print and hides the design). */
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
 * The days of a month as the phone draws them: a button per day with a dot per event, and the picked day's events in the panel under the grid.
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

/** Whether the rules every calendar draws with (calendar.css) are in: the drawing that waits hides its sample words with them. */
let sheetIn = false;

/* ---------- The block ---------- */


function renderCalendar(el, props, ctx) {
  closeOrphanCards();
  cardWhenIdle();
  editing?.shown(el.dataset.blockId ?? '', null);
  const host = el2('div', 'urd-cal');
  el.appendChild(host);
  // The ruler the calendar reads its own width from (drawCalendar).
  const ruler = el2('div', 'urd-block-ruler');
  ruler.setAttribute('aria-hidden', 'true');
  el.appendChild(ruler);
  // A calendar with a feed, an address of its own or a reference to the site's registry, stands in its loading state until the events are drawn.
  if ((props.sources ?? []).some((source) => (typeof source === 'string' ? source.trim() : source && (source.url || source.calendar)))) host.setAttribute('aria-busy', 'true');
  if (!copyLastDrawing(host, el, props, ctx.measure) && host.hasAttribute('aria-busy')) host.appendChild(loadingNode(el, ctx));
  // A calendar whose code is all in (prepareCalendar in calendar-load.js) is drawn in the same task as the page, taking the feeds its readying asked for.
  const ready = partsIn ? designModules(partsIn[1], props) : null;
  const inAlready = Boolean(ready?.every((name) => !name || designsIn.has(name)));
  // Otherwise the feeds are asked for as soon as the parser is in, beside the other modules; a copy drawn only to be measured asks for none.
  const early = new Map();
  if (!inAlready && host.hasAttribute('aria-busy') && !ctx.measure) {
    import('../ics.js').then((ics) => {
      if (!host.isConnected) return;
      for (const entry of ics.resolveSources(props.sources, ctx.site?.site?.calendars)) {
        const url = ics.normalizeSourceUrl(entry.url);
        if (!url || early.has(url)) continue;
        const asked = fetchSource(url);
        asked.catch(() => {});
        early.set(url, asked);
      }
    }, () => {});
  }
  const draw = ([ics, cd, cf, maps, links, sheet], [mod, weekMod, phoneMod, cardMod, plainMod]) => {
    sheetIn = sheet;
    if (host.isConnected) drawCalendar(ics, cd, cf, maps, links, mod, weekMod, phoneMod, cardMod, plainMod, el, host, props, ctx, early);
  };
  const undrawn = (error) => {
    // A module that did not load, or a design that threw: the loading state gives way to the empty state.
    console.warn('Urd: the calendar could not be drawn', error);
    if (!host.isConnected) return;
    host.removeAttribute('aria-busy');
    host.classList.remove('urd-cal-wait');
    delete host.dataset.calCopy;
    host.style.removeProperty('height');
    host.style.removeProperty('overflow');
    host.replaceChildren(emptyNode(props));
  };
  if (inAlready) {
    queueMicrotask(() => {
      try {
        draw(partsIn, ready.map((name) => (name ? designsIn.get(name) : null)));
      } catch (error) {
        undrawn(error);
      }
    });
    return;
  }
  // Otherwise the parser and the design model are loaded together, and the renderer modules the calendar draws with in one wave after them.
  calendarParts().then(async (parts) => {
    const modules = await Promise.all(designModules(parts[1], props).map((name) => (name ? loadDesign(name) ?? null : null)));
    draw(parts, modules);
  }).catch(undrawn);
}

function drawCalendar(ics, cd, cf, maps, links, mod, weekMod, phoneMod, cardMod, plainMod, el, host, props, ctx, early = null) {
  // The site's own time zone, when set: every visitor sees the times on that zone's clock.
  const siteZone = ctx.site?.site?.timeZone;
  const zone = cf.zoneValid(siteZone) ? siteZone.trim() : null;
  // The sources with the site's registry resolved into them: the addresses, names, colours and the registry's words.
  const sources = ics.resolveSources(props.sources, ctx.site?.site?.calendars);
  let activeCategory = null;
  let query = '';
  let shown = null;
  // The drawing that waits for the feeds (wait, below): the calendar in its own design with the sample events, veiled.
  let waiting = false;
  let settled = false;
  const search = props.showSearch === true ? searchField((words) => {
    query = words;
    if (shown) draw(shown);
    return ui.total;
  }) : null;
  // The view switcher's mode: the block's own design until the visitor picks the week or the month.
  const switcher = Boolean(weekMod);
  let mode = 'own';
  // The design: its class, the owner's colour slots and the edge stripe on the host.
  const design = cd.calDesign(props.design);
  const view = cd.calView(props);
  host.className = `urd-cal urd-cal-d-${design.id} urd-cal-set-${design.set}`;
  // A copy of the drawing that waits keeps its words hidden until the calendar's own drawing replaces it.
  if (host.dataset.calCopy === 'wait') host.classList.add('urd-cal-wait');
  // The size of the finding tools (the switcher, the chips, the search and the week's and month's arrows): small, normal or large.
  if (props.toolsSize === 's' || props.toolsSize === 'l') host.classList.add(`urd-cal-tools-${props.toolsSize}`);
  for (const [name, value] of Object.entries(cd.calSlotVars(design, props.colors))) host.style.setProperty(name, value);
  // The text on the calendar's accent follows the accent the owner picked.
  const accentInk = props.colors?.accent ? inkOn(props.colors.accent) : null;
  if (accentInk) host.style.setProperty('--urd-cal-accent-text', accentInk);
  const stripe = cd.calStripe(design, props.stripe);
  host.classList.toggle('urd-cal-stripes', stripe.show);
  if (stripe.color) host.style.setProperty('--urd-cal-stripe', stripe.color);
  // The phone design (calPhoneView) and the card design (calCardDesign) the block wears, each as a class of its own.
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
  // A calendar narrower than NARROW_PX draws its narrow layouts, by its own width where container queries exist (ADR-0025), else by the window's.
  const ruler = el.querySelector(':scope > .urd-block-ruler');
  const isNarrow = () => (WIDTH_QUERIES && ruler ? ruler.clientWidth / (parseFloat(host.style.zoom) || 1) < NARROW_PX : ctx.viewport === 'mobile');
  const setNarrow = (narrow) => {
    ui.phone = narrow;
    host.classList.toggle('urd-cal-phone', narrow);
  };
  setNarrow(isNarrow());
  if (WIDTH_QUERIES && ruler) {
    // The ruler hears the width alone, and the calendar is drawn again in the next frame, outside the observer.
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
        if (shown) draw(shown);
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

  // The plain views (calendar-plain.js) by name; a calendar that finds them not yet in asks for them and draws again once they are.
  let plainAsked = false;
  const plain = (name) => {
    if (plainMod) return name === 'phoneAgenda' ? plainMod.phoneAgenda : plainMod.VIEWS[name];
    if (!plainAsked) {
      plainAsked = true;
      loadDesign('plain').then((loaded) => {
        plainMod = loaded;
        if (shown && host.isConnected) draw(shown);
      }, () => {});
    }
    return () => {};
  };
  const draw = (occurrences) => {
    shown = occurrences;
    for (const occ of occurrences) if (occ.geo && occ.location) ui.places.set(occ.location, occ.geo);
    if (!waiting) host.removeAttribute('aria-busy');
    // A press on the view switcher or a category redraws the calendar: the focus goes back to the button that was pressed.
    const focused = host.contains(document.activeElement) ? document.activeElement.dataset.calKey : null;
    host.replaceChildren();
    closeOrphanCards();
    // Help chip (ADR-0008) in the preview (calendar-edit.js).
    if (ctx.preview && ctx.viewport !== 'mobile') editing?.helpChip(el);
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
        draw(occurrences);
      }, ui));
    }
    if (search) tools.appendChild(search);
    if (tools.children.length) host.appendChild(tools);
    // The calendar filter when the owner switched it on; a design with switches of its own (ownFilter) draws no chip row.
    const shownDesign = own ? design : cd.calDesign(cd.calSwitcherViews(props)[mode]);
    const chips = props.showCategories !== true || shownDesign.ownFilter ? null : categoryRow(occurrences, activeCategory, (category) => {
      activeCategory = category;
      draw(occurrences);
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
        draw(occurrences);
      },
    };
    // On a phone the block is marked for its phone design, when that is not the design itself.
    const phoneDesign = ui.phone && phoneView !== design.id;
    host.classList.toggle('urd-cal-phone-design', phoneDesign);
    if (mode === 'week' || mode === 'month') {
      // The design behind the switcher's button (calSwitcherViews) is drawn in a box of its own with its class and options, so its rules and settings apply.
      const chosen = cd.calSwitcherViews(props)[mode];
      const box = el2('div', `urd-cal-swview urd-cal-d-${chosen}`);
      const opt = ui.opt;
      ui.opt = cd.calOptions({ ...props, design: chosen });
      for (const [key, value] of Object.entries(ui.opt)) box.classList.add(`urd-cal-o-${key}-${typeof value === 'boolean' ? (value ? 'on' : 'off') : value}`);
      host.appendChild(box);
      (chosen === 'month' ? plain('month') : weekMod[chosen])(box, limited, props, ics, ui);
      ui.opt = opt;
    } else if (!limited.length && (query || activeCategory) && kept.length) {
      // Events there are, but none the visitor's search or filter leaves.
      // A design with a filter of its own is drawn even so, so the visitor can choose again.
      if (design.ownFilter) (mod?.[design.id] ?? plain('list'))(host, limited, props, ics, ui);
      host.appendChild(el2('p', 'urd-cal-nomatch', ui.tx('noMatch')));
    } else if (!limited.length) {
      host.appendChild(design.empty === 'ap' ? emptyApNode(props, ui) : emptyNode(props));
    } else {
      if (phoneDesign && phoneDef.look) {
        // On a phone another design is drawn in a box of its own with its set, class, options and words, the owner's colours cleared so it wears its own.
        const look = cd.calDesign(phoneDef.look);
        const box = el2('div', `urd-cal-pd urd-cal-set-${look.set}${phoneDef.desktop ? ` urd-cal-d-${look.id}` : ''}`);
        if (look.id !== design.id) for (const name of host.style) if (name.startsWith('--urd-cal-s-') || name === '--urd-cal-accent-text') box.style.setProperty(name, 'initial');
        for (const [key, value] of Object.entries(cd.calOptions({ ...props, design: look.id }))) box.classList.add(`urd-cal-o-${key}-${typeof value === 'boolean' ? (value ? 'on' : 'off') : value}`);
        host.appendChild(box);
        const render = phoneDef.desktop ? (phoneMod?.[look.id] ?? plain(look.view ?? view) ?? plain('list')) : phoneMod?.[phoneDef.id] ?? plain('phoneAgenda');
        ui.withDesign(look.id, () => {
          render(box, limited, props, ics, ui);
          if (folds) box.appendChild(foldNode(render, filtered.slice(limit), filtered.length, props, ics, ui));
        });
      } else {
        // The design itself, or on a phone the neutral list the block draws in its own set.
        const render = phoneDesign ? plain('phoneAgenda') : (mod?.[design.id] ?? plain(view) ?? plain('list'));
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
    if (!ctx.preview && sources.length && !waiting) writeEventData(el, props.structuredData === false ? [] : listed, ics, ctx, ui.meetingHosts);
    if (focused) [...host.querySelectorAll('[data-cal-key]')].find((node) => node.dataset.calKey === focused)?.focus({ preventScroll: true });
    // The waiting drawing stands behind the loading note, out of reach of the pointer, the keys and a screen reader, which hears the note.
    if (waiting) {
      for (const child of host.children) child.inert = true;
      const note = el2('p', 'urd-cal-wait-note', t('calendar.loadingEvents'));
      note.setAttribute('role', 'status');
      host.appendChild(note);
    }
  };

  // In the editor the example events stand in while no connected calendar answers or by the session's choice on the bar's button; visitors see their own.
  const key = el.dataset.blockId ?? '';
  const settle = (occurrences, reason = null, sample = !sources.length) => {
    settled = true;
    waiting = false;
    host.classList.remove('urd-cal-wait');
    delete host.dataset.calCopy;
    host.style.removeProperty('height');
    host.style.removeProperty('overflow');
    const examples = ctx.preview && (editing ? editing.examples(key, sample) : sample);
    draw(examples ? demoOccurrences() : occurrences);
    if (!ctx.measure) rememberDrawing(key, host, props, false);
    if (!ctx.preview) return;
    editing?.shown(key, { host, examples, reason, redraw: () => { if (host.isConnected) settle(occurrences, reason, sample); } });
    // Tells the bar's button what the calendar shows (exampleButton), and a new calendar's fit that it stands (urd-drawn, add-fit.js).
    el.dispatchEvent(new CustomEvent('urd-cal-shown'));
    el.dispatchEvent(new CustomEvent('urd-drawn'));
  };
  const failed = (error) => settle([], () => ta('calendar.feedFailed', { error }), true);

  if (!sources.length) {
    // A block whose only sources point at calendars missing from the registry says so in the button's tooltip.
    const unknown = (props.sources ?? []).some((source) => source && typeof source === 'object' && 'calendar' in source);
    settle([], unknown ? () => ta('calendar.unknownCalendar') : null);
    return;
  }

  // The switcher needs the week and the month from their start, whichever is earlier; the week begins on the day the site's language starts it on.
  const weekFrom = switcher || view === 'week' ? Math.min(ics.windowStart('week'), ui.weekStartOf(Date.now())) : 0;
  // A year design with another month at the top reads a season: twelve months from that month, through the season's end.
  const season = view === 'year' ? ics.seasonRange(ics.seasonTop(ui.opt.firstMonth, ui.today()), ui.today().getTime()) : null;
  const viewFrom = switcher ? Math.min(weekFrom, ics.windowStart('month')) : view === 'week' ? weekFrom : season ? season.from : ics.windowStart(view);
  // A month, week or day view pages back through its periods, so it loads the year before its own period too, with the forward window kept as it is.
  const pagesBack = ['month', 'week', 'day'].includes(view) || switcher;
  const from = Math.min(pagesBack ? viewFrom - 365 * 24 * 3600 * 1000 : viewFrom, props.showEarlier === true ? Date.now() - EARLIER_DAYS * 24 * 3600 * 1000 : viewFrom);
  const to = season && !switcher ? season.to : pagesBack ? Date.now() + 400 * 24 * 3600 * 1000 : undefined;
  // While the feeds are on the way the calendar stands in its own design with the sample events, their words hidden under a loading note.
  if (!ctx.measure && !('calCopy' in host.dataset)) {
    requestAnimationFrame(() => {
      if (settled || !sheetIn || !host.isConnected) return;
      const held = host.offsetHeight;
      waiting = true;
      host.classList.add('urd-cal-wait');
      if (held) {
        host.style.height = `${held}px`;
        host.style.overflow = 'hidden';
      }
      draw(demoOccurrences());
      rememberDrawing(key, host, props, true);
    });
  }
  loadOccurrences(ics, cf, sources, Math.max(1, props.limit ?? 6), view, from, zone, ui.meetingHosts, to, early).then(({ occurrences, errors, feedZone: fz }) => {
    if (!host.isConnected) return;
    feedZone = fz;
    if (!occurrences.length && errors.length) {
      failed(errors[0]);
      return;
    }
    settle(occurrences, errors.length ? () => ta('calendar.sourceFailed', { error: errors[0] }) : null);
    try { sessionStorage.setItem(heightKey(el, ctx), String(Math.round(host.offsetHeight))); } catch { /* a full store is fine */ }
  }).catch((error) => {
    // A feed the block could not make sense of: visitors get the quiet empty state, the editor the reason.
    console.warn('Urd: the calendar feed could not be read', error);
    if (!host.isConnected) return;
    failed(error?.message ?? String(error));
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
    return editing ? editing.variants() : [];
  },
  migrations: {},
  render: renderCalendar,
};
