/**
 * The calendar block's retro designs (milestone 0.7.19.23): looks from a past of paper, boards and screens, each a renderer over the block's ui helpers (fields, static texts, buttons; see makeUi in calendar.js) with its own rules and colour set in base.css under its own class names.
 * A design's theme words are drawn through ui.tx like any text: the block swaps in the design's own words where it has them (calThemeTexts in calendar-designs.js), and a design that rewrites calendar data asks ui.rewrite first.
 * Loaded by the block on the first render of a block that uses one of them, never in the visitor closure.
 */
import { dates } from '../i18n.js';
import { daysBetween, isMultiDay } from '../calendar-format.js';

const dayOf = (occ) => new Date(occ.start);
const two = (n) => String(n).padStart(2, '0');

/** The events after the featured one, as the block's nextCount and laterCount say (the same slice as the «Coming up» designs). */
const laterOf = (occs, props, ics) => occs.slice(ics.nextCount(props.nextCount), ics.nextCount(props.nextCount) + ics.laterCount(props.laterCount));

/**
 * «Add to calendar» as a button on the event's box: it opens the event's card, where the ways to add it stand (this one event to Google or as a file, or the whole calendar).
 * Null on a cancelled event, and when the owner left «Add to calendar» out of the card (showAdd).
 */
function addButton(occ, props, ui, box, className) {
  if (occ.cancelled || props.showAdd === false) return null;
  const button = ui.el('button', className);
  button.type = 'button';
  button.appendChild(ui.tx('addEvent'));
  button.addEventListener('click', (event) => {
    event.stopPropagation();
    box.click();
  });
  return button;
}

/** A «date · title · time» row for the events after the featured one, struck when cancelled. */
function laterRow(occ, ui, className) {
  const d = dayOf(occ);
  const row = ui.tint(ui.el('div', className), occ);
  row.append(ui.field('strong', 'date', ui.dayMonth(d), `${className}-date`, d), ui.field('span', 'title', occ.title, `${className}-title`), ui.field('span', 'time', ui.timeText(occ), `${className}-time`, occ));
  return row;
}

/**
 * R1 Tear-off pad: a paper pad under the month's bar, the day huge over its weekday, the next event on the page with its countdown, time and place, excerpt and buttons, and the events after it as dashed rows; the torn pages show as a stack at the bottom edge.
 * The countdown's words are the design's own («Today in {n} days», the theme word inDays).
 */
export function pad(host, occs, props, ics, ui) {
  const [hero] = occs;
  const d = dayOf(hero);
  const title = ui.field('strong', 'title', hero.title, 'urd-cal-pad-title');
  const page = ui.tint(ui.el('div', 'urd-cal-pad'), hero, title);
  const head = ui.el('div', 'urd-cal-pad-head');
  head.append(ui.field('span', 'date', dates().months[d.getMonth()], 'urd-cal-pad-month', d), ui.field('span', 'date', String(d.getFullYear()), 'urd-cal-pad-year', d));
  const day = ui.el('div', 'urd-cal-pad-day');
  day.append(ui.field('strong', 'number', String(d.getDate()), 'urd-cal-pad-num', d), ui.field('span', 'date', dates().weekdays[(d.getDay() + 6) % 7], 'urd-cal-pad-wd', d));
  const body = ui.el('div', 'urd-cal-pad-body');
  body.append(ui.el('span', 'urd-cal-pad-in', ui.countdown(hero)), title);
  const meta = ui.meta(hero, { date: false });
  if (meta) {
    meta.classList.add('urd-cal-pad-when');
    body.appendChild(meta);
  }
  const excerpt = ui.excerpt(hero.description, 220);
  if (excerpt && ui.descriptionIn !== 'card') {
    const text = ui.field('p', 'description', excerpt, 'urd-cal-pad-text');
    const href = ui.href(hero);
    if (href) {
      const more = ui.link('urd-cal-pad-more', 'moreInfo', href, '');
      more.target = '_blank';
      more.rel = 'noopener';
      text.append(document.createTextNode(' '), more);
    }
    body.appendChild(text);
  }
  const buttons = ui.el('div', 'urd-cal-pad-buttons');
  const signup = ui.signup(hero);
  if (signup) {
    signup.classList.add('urd-cal-pad-signup');
    buttons.appendChild(signup);
  }
  const add = addButton(hero, props, ui, page, 'urd-cal-pad-add');
  if (add) buttons.appendChild(add);
  if (buttons.childElementCount) body.appendChild(buttons);
  const later = laterOf(occs, props, ics);
  if (later.length) {
    const list = ui.el('div', 'urd-cal-pad-later');
    for (const occ of later) list.appendChild(laterRow(occ, ui, 'urd-cal-pad-row'));
    body.appendChild(list);
  }
  page.append(head, day, body);
  host.appendChild(page);
}

/**
 * R2 Index cards: typewritten cards on lined paper, each a little askew, numbered in their head with the category beside, the event as «Date:», «Time:» and «Place:» lines with the sign-up or «Open to everyone» and «Repeats» as lines of the same kind, the excerpt under them, and a stamp across a cancelled event.
 * The line words and the number are the design's own (the theme words cardNo, colDate, colTime, colPlace, signup, openToAll and recurring).
 */
export function index(host, occs, props, ics, ui) {
  const box = ui.el('div', 'urd-cal-index');
  const line = (key, content) => {
    const row = ui.el('div', 'urd-cal-index-line');
    row.append(ui.tx(key, 'urd-cal-index-key'), document.createTextNode(' '), content);
    return row;
  };
  occs.forEach((occ, i) => {
    const d = dayOf(occ);
    const card = ui.tint(ui.el('article', `urd-cal-index-card urd-cal-index-tilt-${i % 4}`), occ);
    const head = ui.el('div', 'urd-cal-index-head');
    head.appendChild(ui.el('span', 'urd-cal-index-no', ui.tx('cardNo', null, { n: two(ui.offset + i + 1) })));
    if (occ.category) head.appendChild(ui.field('span', 'category', occ.category, 'urd-cal-index-cat'));
    const body = ui.el('div', 'urd-cal-index-body');
    body.appendChild(ui.field('strong', 'title', occ.title, 'urd-cal-index-title'));
    body.appendChild(line('colDate', ui.field('span', 'date', `${ui.dayMonth(d)} (${dates().weekdaysShort[(d.getDay() + 6) % 7]})`, null, d)));
    // The time line is left out of a cancelled event: its stamp says what the time would.
    if (!occ.cancelled && ui.hasTime(occ)) body.appendChild(line('colTime', ui.field('span', 'time', ui.time(occ), null, occ)));
    if (occ.location) body.appendChild(line('colPlace', ui.field('span', 'place', occ.location)));
    const signup = ui.signup(occ) ?? ui.openToAll(occ);
    if (signup) body.appendChild(signup);
    const recurring = ui.recurring(occ);
    if (recurring) body.appendChild(recurring);
    const excerpt = ui.excerpt(occ.description, 160);
    if (excerpt && ui.descriptionIn !== 'card') {
      const text = ui.field('p', 'description', excerpt, 'urd-cal-index-text');
      const href = ui.href(occ);
      if (href) {
        const more = ui.link('urd-cal-index-more', 'moreInfo', href, '');
        more.target = '_blank';
        more.rel = 'noopener';
        text.append(document.createTextNode(' '), more);
      }
      body.appendChild(text);
    }
    card.append(head, body);
    if (occ.cancelled) card.appendChild(ui.el('span', 'urd-cal-index-stamp', ui.tx('cancelled')));
    box.appendChild(card);
  });
  host.appendChild(box);
}

/** The departure board's columns: the head text of each and its width in flap cells. */
const DEP_COLS = [['colDate', 5], ['colTime', 5], ['colEvent', 19], ['colPlace', 9], ['colStatus', 6]];

/** Text cut to a column's cells, as a board with fixed flaps cuts it; the whole text when the design draws without rewriting. */
const cut = (text, n, rewrite) => (rewrite && text.length > n ? text.slice(0, n).trimEnd() : text);

/** A run of n flap cells holding one text (the tiles are the style sheet's); `className` adds the small size or a tone. */
function cells(ui, n, content, className) {
  const run = ui.el('span', className ? `urd-cal-dep-cells ${className}` : 'urd-cal-dep-cells', content);
  run.style.setProperty('--n', String(n));
  return run;
}

/** The date as the board writes it: 04.10 with rewriting, else the language's day and month. */
const depDate = (d, ui) => (ui.rewrite ? `${two(d.getDate())}.${two(d.getMonth() + 1)}` : ui.dayMonth(d));

/** The time as the board writes it: the all-day word, the start alone with rewriting, else the event's time. */
const depTime = (occ, ui) => (occ.allDay ? ui.tx('allDay') : ui.rewrite ? document.createTextNode(ui.startClock(occ)) : ui.time(occ));

/**
 * An event's status on the board: the sign-up word with a sign-up to show (amber), else «open to everyone» where the design says it, else nothing; a cancelled event says so in the alert colour.
 * @returns {{node: Node|null, tone: string}}
 */
function statusOf(occ, props, ui) {
  if (occ.cancelled) return { node: ui.tx('cancelled'), tone: 'urd-cal-dep-alert' };
  if (occ.signup && props.showSignup === true) return { node: ui.tx('signup'), tone: 'urd-cal-dep-amber' };
  return { node: ui.openToAll(occ), tone: '' };
}

/** The board's head: the heading and the time it was updated. */
function depHead(ui) {
  const now = ui.today();
  const stamp = `${depDate(now, ui)} ${ui.startClock({ start: now.getTime() })}`;
  const head = ui.el('div', 'urd-cal-dep-head');
  head.append(ui.tx('now', 'urd-cal-dep-title'), ui.tx('updated', 'urd-cal-dep-updated', { time: stamp }));
  return head;
}

/** The board's foot: the subscribe links, where there is a source, and the hint. */
function depFoot(ui) {
  const foot = ui.el('div', 'urd-cal-dep-foot');
  const subscribe = ui.subscribe();
  if (subscribe) foot.appendChild(subscribe);
  foot.appendChild(ui.tx('rowHint', 'urd-cal-dep-hint'));
  return foot;
}

/** The first event's excerpt with its link, for the boards that carry one; null without. */
function depExcerpt(occ, ui) {
  const excerpt = ui.excerpt(occ.description, 220);
  if (!excerpt || ui.descriptionIn === 'card') return null;
  const text = ui.field('p', 'description', excerpt, 'urd-cal-dep-text');
  const href = ui.href(occ);
  if (href) {
    const more = ui.link('urd-cal-dep-more', 'moreInfo', href, '');
    more.target = '_blank';
    more.rel = 'noopener';
    text.append(document.createTextNode(' '), more);
  }
  return text;
}

/**
 * R3 Departure board: a dark board of split-flap rows under an amber heading and the time it was updated, the columns headed Date, Time, Event, Place and Status, each row the event's start as 04.10 and 18:00, its title and place cut to the flaps and set in capitals by the style sheet, and its status (the sign-up, open to everyone, or cancelled in the alert colour); the first row carries the excerpt. With rewriting off the rows hold the calendar's own text whole, wrapping as it must.
 * The heading, the status words and the subscribe link are the design's own (the theme words now, signup, openToAll and subscribe).
 */
export function departures(host, occs, props, ics, ui) {
  const rewrite = ui.rewrite;
  const board = ui.el('div', rewrite ? 'urd-cal-dep' : 'urd-cal-dep urd-cal-dep-plain');
  const cols = ui.el('div', 'urd-cal-dep-cols');
  for (const [key, n] of DEP_COLS) cols.appendChild(cells(ui, n, ui.tx(key), 'urd-cal-dep-col'));
  // The column heads stand in the rows' grid, so without rewriting they share its columns.
  const rows = ui.el('div', 'urd-cal-dep-rows');
  rows.appendChild(cols);
  occs.forEach((occ, i) => {
    const d = dayOf(occ);
    const title = ui.field('span', 'title', cut(occ.title, DEP_COLS[2][1], rewrite));
    const row = ui.tint(ui.el('div', 'urd-cal-dep-row'), occ, title);
    const status = statusOf(occ, props, ui);
    row.append(
      cells(ui, DEP_COLS[0][1], ui.field('span', 'date', depDate(d, ui), null, d)),
      cells(ui, DEP_COLS[1][1], ui.field('span', 'time', depTime(occ, ui), null, occ)),
      cells(ui, DEP_COLS[2][1], title),
      cells(ui, DEP_COLS[3][1], occ.location ? ui.field('span', 'place', cut(occ.location, DEP_COLS[3][1], rewrite)) : null),
      cells(ui, DEP_COLS[4][1], status.node, status.tone),
    );
    rows.appendChild(row);
    // The first row carries its excerpt, with the link on.
    const text = i === 0 ? depExcerpt(occ, ui) : null;
    if (text) rows.appendChild(text);
  });
  board.append(depHead(ui), rows, depFoot(ui));
  host.appendChild(board);
}

/* ---------- The departure board on a phone: two phone designs of its own (CAL_PHONE_DESIGNS), neither scrolling sideways ---------- */

/** The compact board: each event as two rows of small flaps, the date, time and status on the first, the title on the second, the place as text under. */
export function depRows(host, occs, props, ics, ui) {
  const board = ui.el('div', `urd-cal-dep urd-cal-dep-compact${ui.rewrite ? '' : ' urd-cal-dep-plain'}`);
  const cols = ui.el('div', 'urd-cal-dep-cols');
  for (const [key, n] of [['colDate', 5], ['colTime', 5], ['colStatus', 6]]) cols.appendChild(cells(ui, n, ui.tx(key), 'urd-cal-dep-col urd-cal-dep-small'));
  const rows = ui.el('div', 'urd-cal-dep-rows');
  rows.appendChild(cols);
  occs.forEach((occ, i) => {
    const d = dayOf(occ);
    const title = ui.field('span', 'title', cut(occ.title, 20, ui.rewrite));
    const event = ui.tint(ui.el('article', 'urd-cal-dep-event'), occ, title);
    const status = statusOf(occ, props, ui);
    const row = ui.el('div', 'urd-cal-dep-row');
    row.append(cells(ui, 5, ui.field('span', 'date', depDate(d, ui), null, d), 'urd-cal-dep-small'), cells(ui, 5, ui.field('span', 'time', depTime(occ, ui), null, occ), 'urd-cal-dep-small'), cells(ui, 6, status.node, `urd-cal-dep-small ${status.tone}`));
    event.append(row, cells(ui, 20, title, 'urd-cal-dep-small'));
    if (occ.location) event.appendChild(ui.field('span', 'place', occ.location, 'urd-cal-dep-place'));
    const text = i === 0 ? depExcerpt(occ, ui) : null;
    if (text) event.appendChild(text);
    rows.appendChild(event);
  });
  board.append(depHead(ui), rows, depFoot(ui));
  host.appendChild(board);
}

/** The strip: one flap strip per event with the date, time and status, the title on the condensed face and the place as text under it. */
export function depStrip(host, occs, props, ics, ui) {
  const board = ui.el('div', `urd-cal-dep urd-cal-dep-strip${ui.rewrite ? '' : ' urd-cal-dep-plain'}`);
  const cols = ui.el('div', 'urd-cal-dep-cols');
  for (const [key, n] of [['colDate', 5], ['colTime', 5], ['colStatus', 6]]) cols.appendChild(cells(ui, n, ui.tx(key), 'urd-cal-dep-col'));
  const rows = ui.el('div', 'urd-cal-dep-rows');
  rows.appendChild(cols);
  occs.forEach((occ, i) => {
    const d = dayOf(occ);
    const title = ui.field('strong', 'title', occ.title, 'urd-cal-dep-name');
    const event = ui.tint(ui.el('article', 'urd-cal-dep-event'), occ, title);
    const status = statusOf(occ, props, ui);
    const row = ui.el('div', 'urd-cal-dep-row');
    row.append(cells(ui, 5, ui.field('span', 'date', depDate(d, ui), null, d)), cells(ui, 5, ui.field('span', 'time', depTime(occ, ui), null, occ)), cells(ui, 6, status.node, status.tone));
    event.append(row, title);
    if (occ.location) event.appendChild(ui.field('span', 'place', occ.location, 'urd-cal-dep-place'));
    const text = i === 0 ? depExcerpt(occ, ui) : null;
    if (text) event.appendChild(text);
    rows.appendChild(event);
  });
  board.append(depHead(ui), rows, depFoot(ui));
  host.appendChild(board);
}

/** Words laid in lines of at most n letters, a word longer than a line cut across lines. */
function wrapWords(text, n) {
  const lines = [];
  let line = '';
  for (const word of String(text).split(/\s+/).filter(Boolean)) {
    let rest = word;
    while (rest.length > n) {
      if (line) lines.push(line);
      lines.push(rest.slice(0, n));
      rest = rest.slice(n);
      line = '';
    }
    if (!line) line = rest;
    else if (line.length + 1 + rest.length <= n) line += ` ${rest}`;
    else {
      lines.push(line);
      line = rest;
    }
  }
  if (line) lines.push(line);
  return lines;
}

/**
 * R4 Cinema marquee: a cinema's letter board in a red frame between two rows of bulbs, «Now showing» over the next event in large letters with its countdown, the date, time and place on one line beside the sign-up, the excerpt, and «Coming soon» over the events after it as rows of date, title and time.
 * The heading words and the sign-up are the design's own (the theme words now, later and signup); the capitals are the style sheet's.
 */
export function marquee(host, occs, props, ics, ui) {
  const [hero] = occs;
  const title = ui.field('strong', 'title', hero.title, 'urd-cal-mq-title');
  const sign = ui.el('div', 'urd-cal-mq');
  const board = ui.tint(ui.el('div', 'urd-cal-mq-board'), hero, title);
  const head = ui.el('div', 'urd-cal-mq-head');
  head.append(ui.tx('now', 'urd-cal-mq-now'), ui.el('span', 'urd-cal-mq-in', ui.countdown(hero)));
  board.append(head, title);
  const line = ui.el('div', 'urd-cal-mq-line');
  const meta = ui.meta(hero);
  if (meta) {
    meta.classList.add('urd-cal-mq-when');
    line.appendChild(meta);
  }
  const signup = ui.signup(hero);
  if (signup) {
    signup.classList.add('urd-cal-mq-signup');
    line.appendChild(signup);
  }
  if (line.childElementCount) board.appendChild(line);
  const excerpt = ui.excerpt(hero.description, 220);
  if (excerpt && ui.descriptionIn !== 'card') {
    const text = ui.field('p', 'description', excerpt, 'urd-cal-mq-text');
    const href = ui.href(hero);
    if (href) {
      const more = ui.link('urd-cal-mq-more', 'moreInfo', href, '');
      more.target = '_blank';
      more.rel = 'noopener';
      text.append(document.createTextNode(' '), more);
    }
    board.appendChild(text);
  }
  const later = laterOf(occs, props, ics);
  if (later.length) {
    board.appendChild(ui.tx('later', 'urd-cal-mq-soon'));
    const rows = ui.el('div', 'urd-cal-mq-rows');
    for (const occ of later) {
      const d = dayOf(occ);
      const name = ui.field('span', 'title', occ.title, 'urd-cal-mq-row-title');
      const row = ui.tint(ui.el('div', 'urd-cal-mq-row'), occ, name);
      row.append(ui.field('span', 'date', `${dates().weekdaysShort[(d.getDay() + 6) % 7]} ${ui.dayMonth(d)}`, 'urd-cal-mq-row-date', d), name, ui.field('span', 'time', ui.time(occ), 'urd-cal-mq-row-time', occ));
      rows.appendChild(row);
    }
    board.appendChild(rows);
  }
  sign.appendChild(board);
  host.appendChild(sign);
}

/** The marquee on a phone: the letter board in its red frame as a list, «Now showing» with the countdown over a row per event (its date and time, title and place, the first with its excerpt and sign-up), and the subscribe link at the foot. */
export function marqueeRows(host, occs, props, ics, ui) {
  const box = ui.el('div', 'urd-cal-mqp');
  const head = ui.el('div', 'urd-cal-mqp-head');
  head.append(ui.tx('now', 'urd-cal-mqp-now'), ui.el('span', 'urd-cal-mqp-in', ui.countdown(occs[0])));
  box.appendChild(head);
  occs.forEach((occ, i) => {
    const title = ui.field('strong', 'title', occ.title, 'urd-cal-mqp-title');
    const row = ui.tint(ui.el('article', 'urd-cal-mqp-row'), occ, title);
    const when = ui.meta(occ, { place: false });
    if (when) {
      when.classList.add('urd-cal-mqp-when');
      row.appendChild(when);
    }
    row.appendChild(title);
    if (occ.location) row.appendChild(ui.field('span', 'place', occ.location, 'urd-cal-mqp-place'));
    if (i === 0) {
      const excerpt = ui.excerpt(occ.description, 160);
      if (excerpt && ui.descriptionIn !== 'card') row.appendChild(ui.field('p', 'description', excerpt, 'urd-cal-mqp-text'));
      const signup = ui.signup(occ);
      if (signup) {
        signup.classList.add('urd-cal-mqp-signup');
        row.appendChild(signup);
      }
    }
    box.appendChild(row);
  });
  const subscribe = ui.subscribe();
  if (subscribe) {
    subscribe.classList.add('urd-cal-mqp-foot');
    box.appendChild(subscribe);
  }
  host.appendChild(box);
}

/* ---------- R5 Receipt ---------- */

/** The time on a receipt's row: the board's (the all-day word, the start alone) with rewriting, else the event's own; a cancellation is the status line's to say. */
const rcTime = (occ, ui) => (ui.rewrite ? depTime(occ, ui) : ui.time(occ.cancelled ? { ...occ, cancelled: false } : occ));

/** The days an event covers as the receipt's card writes them with rewriting: 17.10, 17.-18.10 within a month and 30.10-02.11 across one. */
function rcDays(occ) {
  const d = dayOf(occ);
  const day = `${two(d.getDate())}.${two(d.getMonth() + 1)}`;
  if (!isMultiDay(occ)) return day;
  const end = new Date(occ.end);
  const last = `${two(end.getDate())}.${two(end.getMonth() + 1)}`;
  return end.getMonth() === d.getMonth() ? `${two(d.getDate())}.-${last}` : `${day}-${last}`;
}

/** The line under a row: the place and the status words (the sign-up, a repeat, a cancellation), between dots; null with none of them. */
function rcSub(occ, ui) {
  const parts = [];
  if (occ.location) parts.push(ui.field('span', 'place', occ.location, 'urd-cal-rc-place'));
  if (occ.cancelled) parts.push(ui.tx('cancelled'));
  for (const part of [ui.signup(occ), ui.recurring(occ)]) if (part) parts.push(part);
  if (!parts.length) return null;
  const sub = ui.el('div', 'urd-cal-rc-sub');
  parts.forEach((part, i) => {
    if (i) sub.appendChild(document.createTextNode(' · '));
    sub.appendChild(part);
  });
  return sub;
}

/** The first event's excerpt with its link, under its row; null without. */
function rcExcerpt(occ, ui) {
  const excerpt = ui.excerpt(occ.description, 120);
  if (!excerpt || ui.descriptionIn === 'card') return null;
  const text = ui.field('p', 'description', excerpt, 'urd-cal-rc-text');
  const href = ui.href(occ);
  if (href) {
    const more = ui.link('urd-cal-rc-more', 'moreInfo', href, '');
    more.target = '_blank';
    more.rel = 'noopener';
    text.append(document.createTextNode(' '), more);
  }
  return text;
}

/** The receipt's rows: per event the date, the title and the time in the columns the rows share with the dot leader between them (base.css), the place and status under them, and the first event's excerpt under that. */
function rcRows(occs, ui) {
  const rows = ui.el('div', 'urd-cal-rc-rows');
  occs.forEach((occ, i) => {
    const d = dayOf(occ);
    const event = ui.tint(ui.el('div', 'urd-cal-rc-event'), occ);
    event.append(
      ui.field('span', 'date', depDate(d, ui), 'urd-cal-rc-date', d),
      ui.field('span', 'title', occ.title, 'urd-cal-rc-title'),
      ui.field('span', 'time', rcTime(occ, ui), 'urd-cal-rc-time', occ),
    );
    const sub = rcSub(occ, ui);
    if (sub) event.appendChild(sub);
    const text = i === 0 && !ui.rest ? rcExcerpt(occ, ui) : null;
    if (text) event.appendChild(text);
    rows.appendChild(event);
  });
  return rows;
}

/** A totals line: its words at the left and its value at the right, as a till prints them. */
function rcTotal(ui, words, value) {
  const line = ui.el('div', 'urd-cal-rc-total');
  line.append(words, ui.el('span', 'urd-cal-rc-value', value));
  return line;
}

/** The days to the next event: the number and the word for days in the receipt's own words («Next in ... 3 days»), the countdown in the neutral ones («Next ... In 3 days»). */
function rcNextIn(occ, ui) {
  if (ui.opt.wordChoice === 'neutral') return ui.countdown(occ);
  const n = Math.max(0, daysBetween(ui.today().getTime(), occ.start));
  const value = ui.el('span');
  value.append(document.createTextNode(`${n} `), ui.tx('unitDays', null, { n }));
  return value;
}

/**
 * R5 Receipt: a till receipt on paper with a torn bottom edge, in a monospace face: the heading over the period and the venue, the events as rows of date, title, dot leader and time with the place and status under each and the first one's excerpt, the totals (the number of events, the days to the next one and the admission in large type), and the barcode that is the subscribe link over the thanks. In the fold the receipt goes on with the rows alone.
 * The heading, the totals' words, the sign-up and the subscribe link are the design's own (the theme words program, countLabel, nextShort, signup and subscribe); the period, the venue, the admission and the thanks are content lines the owner can remove. With rewriting on the date is 04.10, the time the start alone, and the title and excerpt are set in capitals and the title cut to its row by the style sheet; off, the rows hold the calendar's own text.
 */
export function receipt(host, occs, props, ics, ui) {
  const paper = ui.el('div', ui.rewrite ? 'urd-cal-rc' : 'urd-cal-rc urd-cal-rc-plain');
  if (ui.rest) {
    paper.classList.add('urd-cal-rc-rest');
    paper.appendChild(rcRows(occs, ui));
    host.appendChild(paper);
    return;
  }
  const head = ui.el('div', 'urd-cal-rc-head');
  head.appendChild(ui.tx('program', 'urd-cal-rc-program'));
  for (const key of ['period', 'venue']) {
    const line = ui.line(ui.el('span', 'urd-cal-rc-headline'), key);
    if (line) head.appendChild(line);
  }
  const totals = ui.el('div', 'urd-cal-rc-totals');
  totals.appendChild(rcTotal(ui, ui.tx('countLabel'), document.createTextNode(String(ui.total))));
  const next = ui.all.find((occ) => !occ.cancelled);
  if (next) totals.appendChild(rcTotal(ui, ui.tx('nextShort'), rcNextIn(next, ui)));
  // The admission is two content lines, its words and its price, and goes when both are emptied.
  const entry = ui.el('div', 'urd-cal-rc-total urd-cal-rc-entry');
  const words = ui.line(ui.el('span'), 'admission', { carry: true });
  const price = ui.line(ui.el('span', 'urd-cal-rc-value'), 'admissionPrice', { carry: true });
  for (const part of [words, price]) if (part) entry.appendChild(part);
  if (ui.group(entry)) totals.appendChild(entry);
  // The foot holds the barcode and the thanks; without a barcode it goes with the thanks line.
  const foot = ui.el('div', 'urd-cal-rc-foot');
  const subscribe = ui.subscribe();
  if (subscribe) {
    subscribe.classList.add('urd-cal-rc-code');
    foot.appendChild(subscribe);
  }
  const thanks = ui.line(ui.el('span', 'urd-cal-rc-thanks'), 'thanks', { carry: !subscribe });
  if (thanks) foot.appendChild(thanks);
  paper.append(head, rcRows(occs, ui), totals);
  if (subscribe || ui.group(foot)) paper.appendChild(foot);
  host.appendChild(paper);
}

/**
 * R6 Seventies poster: a rounded cream poster with a sunrise of arcs at its top, the heading in a rounded face over a spaced line, and a mustard panel holding one cream pill per event (the day over the short month in a round badge, orange, mustard and brown in turn, the title with the time and place under it, the first event's excerpt, and the sign-up at the pill's end), with the subscribe link under the panel.
 * The heading, the sign-up and the subscribe link are the design's own (the theme words now, signup and subscribe), and the line under the heading is content the owner can rewrite or remove (`period`).
 * The rest of a folded list is drawn as a panel on a poster of its own, the badges' turn carried on.
 */
export function seventies(host, occs, props, ics, ui) {
  const poster = ui.el('div', ui.rest ? 'urd-cal-sv urd-cal-sv-rest' : 'urd-cal-sv');
  if (!ui.rest) {
    poster.appendChild(ui.tx('now', 'urd-cal-sv-head'));
    const period = ui.line(ui.el('p', 'urd-cal-sv-period'), 'period');
    if (period) poster.appendChild(period);
  }
  const panel = ui.el('div', 'urd-cal-sv-panel');
  occs.forEach((occ, i) => {
    const d = dayOf(occ);
    const row = ui.tint(ui.el('article', `urd-cal-sv-row urd-cal-sv-tone-${(ui.offset + i) % 3}`), occ);
    const badge = ui.el('span', 'urd-cal-sv-badge');
    badge.append(ui.field('strong', 'number', String(d.getDate()), 'urd-cal-sv-day', d), ui.field('span', 'date', dates().monthsShort[d.getMonth()], 'urd-cal-sv-mon', d));
    // The text and the sign-up share a line while there is room, and the sign-up goes under the text when there is not.
    const main = ui.el('div', 'urd-cal-sv-main');
    const body = ui.el('div', 'urd-cal-sv-body');
    body.appendChild(ui.field('strong', 'title', occ.title, 'urd-cal-sv-title'));
    const when = ui.el('span', 'urd-cal-sv-when');
    when.appendChild(ui.field('span', 'time', ui.time(occ), null, occ));
    if (occ.location) when.append(document.createTextNode(' · '), ui.field('span', 'place', occ.location));
    body.appendChild(when);
    const excerpt = i === 0 && !ui.rest ? ui.excerpt(occ.description, 160) : '';
    if (excerpt && ui.descriptionIn !== 'card') {
      const text = ui.field('p', 'description', excerpt, 'urd-cal-sv-text');
      const href = ui.href(occ);
      if (href) {
        const more = ui.link('urd-cal-sv-more', 'moreInfo', href, '');
        more.target = '_blank';
        more.rel = 'noopener';
        text.append(document.createTextNode(' '), more);
      }
      body.appendChild(text);
    }
    main.appendChild(body);
    const signup = ui.signup(occ);
    if (signup) {
      signup.classList.add('urd-cal-sv-signup');
      main.appendChild(signup);
    }
    row.append(badge, main);
    panel.appendChild(row);
  });
  poster.appendChild(panel);
  const subscribe = ui.rest ? null : ui.subscribe();
  if (subscribe) {
    subscribe.classList.add('urd-cal-sv-foot');
    poster.appendChild(subscribe);
  }
  host.appendChild(poster);
}

/** An Art deco row: the day in gold over its month, the title with its time and place under it, and the countdown at the right; the first row of the list carries the excerpt. */
function decoRow(occ, ui, first) {
  const d = dayOf(occ);
  const title = ui.field('strong', 'title', occ.title, 'urd-cal-deco-title');
  const row = ui.tint(ui.el('div', 'urd-cal-deco-row'), occ, title);
  const date = ui.el('div', 'urd-cal-deco-date');
  date.append(ui.field('strong', 'number', String(d.getDate()), 'urd-cal-deco-day', d), ui.field('span', 'date', dates().monthsShort[d.getMonth()], 'urd-cal-deco-month', d));
  const body = ui.el('div', 'urd-cal-deco-body');
  const meta = ui.el('span', 'urd-cal-deco-meta');
  meta.appendChild(ui.field('span', 'time', ui.timeText(occ), null, occ));
  if (occ.location) meta.appendChild(ui.field('span', 'place', occ.location));
  body.append(title, meta);
  const excerpt = first ? ui.excerpt(occ.description, 160) : '';
  if (excerpt && ui.descriptionIn !== 'card') {
    const text = ui.field('p', 'description', excerpt, 'urd-cal-deco-text');
    const href = ui.href(occ);
    if (href) {
      const more = ui.link('urd-cal-deco-more', 'moreInfo', href, '');
      more.target = '_blank';
      more.rel = 'noopener';
      text.append(document.createTextNode(' '), more);
    }
    body.appendChild(text);
  }
  row.append(date, body, ui.el('span', 'urd-cal-deco-in', occ.cancelled ? null : ui.countdown(occ)));
  return row;
}

/**
 * R7 Art deco: a programme in a gold double frame on black, a sunburst over the heading and the season line under it, the events as rows of the day in gold, the title with its time and place, and the countdown, the first with its excerpt; the first event's sign-up and the subscribe links stand at the foot.
 * The heading and the sign-up are the design's own words (the theme words now and signup), the season line is the shared period text (`period`, content the owner can rewrite or remove), and the capitals are the style sheet's.
 * The events a list folds away are drawn as rows alone, without the heading and the foot.
 */
export function deco(host, occs, props, ics, ui) {
  const box = ui.el('div', ui.rest ? 'urd-cal-deco urd-cal-deco-rest' : 'urd-cal-deco');
  const frame = ui.el('div', 'urd-cal-deco-frame');
  if (!ui.rest) {
    frame.appendChild(ui.tx('now', 'urd-cal-deco-heading'));
    const season = ui.line(ui.el('p', 'urd-cal-deco-season'), 'period');
    if (season) frame.appendChild(season);
  }
  const rows = ui.el('div', 'urd-cal-deco-rows');
  occs.forEach((occ, i) => rows.appendChild(decoRow(occ, ui, i === 0 && !ui.rest)));
  frame.appendChild(rows);
  if (!ui.rest) {
    const foot = ui.el('div', 'urd-cal-deco-foot');
    const signup = ui.signup(occs[0]);
    if (signup) {
      signup.classList.add('urd-cal-deco-signup');
      foot.appendChild(signup);
    }
    const subscribe = ui.subscribe();
    if (subscribe) foot.append(...subscribe.children);
    if (foot.childElementCount) frame.appendChild(foot);
  }
  box.appendChild(frame);
  host.appendChild(box);
}

/** An Art deco ornament on the card: a line drawing in the gold, hidden from a screen reader. */
function decoSvg(className, viewBox, d) {
  const NS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', viewBox);
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('class', className);
  const path = document.createElementNS(NS, 'path');
  path.setAttribute('d', d);
  svg.appendChild(path);
  return svg;
}

/** The card's corner piece: a quarter fan with three rays from the corner. */
const DECO_CORNER = 'M2 2 L36 2 A34 34 0 0 1 2 36 Z M2 2 L30 14 M2 2 L22 22 M2 2 L14 30';

/** The fan over the card's date: eleven rays from the middle of its foot, fourteen degrees apart. */
const DECO_FAN = Array.from({ length: 11 }, (_, i) => {
  const a = ((i - 5) * 14 * Math.PI) / 180;
  return `M60 34 L${(60 + 30 * Math.sin(a)).toFixed(1)} ${(34 - 30 * Math.cos(a)).toFixed(1)}`;
}).join(' ');

/* ---------- The card dresses (`cards` in the design list) ---------- */

/** The card's parts, each a decorator the block runs on the event's card after it is built (ui.dressCard), in the common words. */
export const cards = {
  /** R4 Cinema marquee's own card: a cinema ticket, the date, title and facts on its face and the stub down its right side with the day standing; the bulbs over it and the tear line under it are base.css's. */
  marquee(dialog, occ, ui) {
    const d = dayOf(occ);
    const ticket = ui.el('div', 'urd-cal-mq-cardticket');
    const face = ui.el('div', 'urd-cal-mq-cardface');
    const stub = ui.el('span', 'urd-cal-mq-cardstub');
    stub.setAttribute('aria-hidden', 'true');
    stub.append(ui.el('strong', null, String(d.getDate())), ui.el('span', null, dates().monthsShort[d.getMonth()]));
    const parts = ['.urd-cal-dialog-date', '.urd-cal-dialog-title', '.urd-cal-dialog-facts'].map((selector) => dialog.querySelector(selector)).filter(Boolean);
    if (!parts.length) return;
    parts[0].before(ticket);
    face.append(...parts);
    ticket.append(face, stub);
  },
  /**
   * R5 Receipt's own card: the receipt's number over the title (the event's place in the calendar's list, the theme word cardNo), the facts as dot-leader lines with the date first and the category last, named as the receipt's columns, and the thanks at its foot; the torn edge and the capitals are base.css's, the capitals of the calendar's data only with rewriting.
   */
  receipt(dialog, occ, ui) {
    if (!ui.rewrite) dialog.classList.add('urd-cal-rc-own');
    const title = dialog.querySelector('.urd-cal-dialog-title');
    const place = ui.all.indexOf(occ);
    if (title && place >= 0) title.before(ui.el('span', 'urd-cal-rc-cardno', ui.tx('cardNo', null, { n: String(place + 1).padStart(3, '0') })));
    const facts = dialog.querySelector('.urd-cal-dialog-facts');
    if (facts) {
      const d = dayOf(occ);
      const term = (key) => ui.el('dt', null, ui.tx(key));
      // The time is always the first fact, and the place the one whose value leads to the map.
      facts.querySelector('dt')?.replaceChildren(ui.tx('colTime'));
      facts.querySelector('dd > .urd-cal-f-place, dd > .urd-cal-place-link')?.parentElement.previousElementSibling?.replaceChildren(ui.tx('colPlace'));
      facts.prepend(term('colDate'), ui.el('dd', null, ui.field('span', 'date', ui.rewrite ? rcDays(occ) : ui.dateLine(d, true), null, d)));
      dialog.querySelector('.urd-cal-dialog-date')?.remove();
      const meta = dialog.querySelector('.urd-cal-dialog-meta');
      const chip = meta?.querySelector('.urd-cal-chip');
      if (chip) {
        facts.append(term('colCategory'), ui.el('dd', null, chip));
        if (!meta.childElementCount) meta.remove();
      }
      // Each fact on a line of its own, the dots between its name and its value drawn by the style sheet.
      for (const dt of [...facts.querySelectorAll(':scope > dt')]) {
        const line = ui.el('div', 'urd-cal-rc-fact');
        const dd = dt.nextElementSibling;
        dt.before(line);
        line.append(dt, dd);
      }
    }
    const thanks = ui.line(ui.el('p', 'urd-cal-rc-cardthanks'), 'thanks');
    if (thanks) dialog.appendChild(thanks);
  },
  /** R6 Seventies poster's own card: a band of stripes across its top with the event's calendar as its label, the row of matches under the band and the halftone strip at the foot drawn by the style sheet. */
  seventies(dialog, occ, ui) {
    const band = ui.el('div', 'urd-cal-sv-cardband');
    const chip = dialog.querySelector('.urd-cal-dialog-meta .urd-cal-chip');
    if (chip) {
      const meta = chip.parentElement;
      band.appendChild(chip);
      if (!meta.childElementCount) meta.remove();
    }
    dialog.insertBefore(band, dialog.querySelector('.urd-cal-dialog-date'));
  },
  /** R7 Art deco's own card: a fan piece in each corner of the gold double frame, a fan of thin rays over the date, and a rule with a diamond under the title; the frame is base.css's. */
  deco(dialog, occ, ui) {
    dialog.append(...['tl', 'tr', 'bl', 'br'].map((corner) => decoSvg(`urd-cal-deco-corner urd-cal-deco-corner-${corner}`, '0 0 38 38', DECO_CORNER)));
    dialog.querySelector('.urd-cal-dialog-date')?.before(decoSvg('urd-cal-deco-cardfan', '0 0 120 34', DECO_FAN));
    const rule = ui.el('span', 'urd-cal-deco-cardrule');
    rule.setAttribute('aria-hidden', 'true');
    rule.appendChild(ui.el('i'));
    dialog.querySelector('.urd-cal-dialog-title')?.after(rule);
  },
  /** The board row on top: the date, time and status as flaps over the date line, the facts labelled as the board's columns by the style sheet. */
  depHead(dialog, occ, ui, props) {
    const d = dayOf(occ);
    const status = statusOf(occ, props, ui);
    const row = ui.el('div', `urd-cal-dep-cardrow${ui.rewrite ? '' : ' urd-cal-dep-plain'}`);
    row.append(cells(ui, 5, ui.field('span', 'date', depDate(d, ui), null, d)), cells(ui, 5, ui.field('span', 'time', depTime(occ, ui), null, occ)), cells(ui, 6, status.node, status.tone));
    dialog.insertBefore(row, dialog.querySelector('.urd-cal-dialog-date'));
  },
  /** The title on the flaps, a line of seventeen at a time, and the status among the facts. */
  depTitle(dialog, occ, ui, props) {
    const title = dialog.querySelector('.urd-cal-dialog-title');
    if (title) {
      const lines = wrapWords(occ.title, 17);
      title.replaceChildren(...lines.map((line, i) => cells(ui, 17, document.createTextNode(i < lines.length - 1 ? `${line} ` : line))));
      title.classList.add('urd-cal-dep-cardtitle');
    }
    const facts = dialog.querySelector('.urd-cal-dialog-facts');
    const status = statusOf(occ, props, ui);
    if (facts && status.node) {
      const dt = ui.el('dt');
      dt.appendChild(ui.tx('colStatus'));
      const dd = ui.el('dd');
      dd.appendChild(cells(ui, 6, status.node, `urd-cal-dep-small ${status.tone}`));
      facts.append(dt, dd);
    }
  },
  /** The screen: the date in a band across the top, the status flaps beside the title, the actions as tiles by the style sheet. */
  depScreen(dialog, occ, ui, props) {
    const date = dialog.querySelector('.urd-cal-dialog-date');
    if (date) {
      const band = ui.el('div', 'urd-cal-dep-cardband');
      dialog.insertBefore(band, dialog.firstChild);
      band.appendChild(date);
    }
    const title = dialog.querySelector('.urd-cal-dialog-title');
    const status = statusOf(occ, props, ui);
    if (title && status.node) {
      const top = ui.el('div', 'urd-cal-dep-cardtop');
      title.replaceWith(top);
      top.append(title, cells(ui, 6, status.node, `urd-cal-dep-small ${status.tone}`));
    }
  },
};
