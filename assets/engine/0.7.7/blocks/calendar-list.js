/**
 * The calendar block's list designs (milestone 0.7.19): six looks on the list view, each a renderer over the block's ui helpers (fields, static texts, buttons; see makeUi in calendar.js) with its own rules in base.css under its own class names.
 * The data is the limited, filtered list the block hands every view.
 * Loaded by the block on the first render of a block that uses one of them, never in the visitor closure.
 */
import { dates } from '../i18n.js';

const two = (n) => String(n).padStart(2, '0');
const dayOf = (occ) => new Date(occ.start);
const monthShort = (d) => dates().monthsShort[d.getMonth()];
const weekdayShort = (d) => dates().weekdaysShort[(d.getDay() + 6) % 7];
const weekday = (d) => dates().weekdays[(d.getDay() + 6) % 7];

/** The meta line with the weekday in front of the time and the place (the date number stands elsewhere). */
function weekdayMeta(occ, ui) {
  const line = ui.meta(occ, { date: false }) ?? ui.el('div', 'urd-cal-meta');
  if (line.childNodes.length) line.prepend(document.createTextNode(' · '));
  line.prepend(ui.field('span', 'date', weekdayShort(dayOf(occ)), null, occ));
  return line;
}

/** The first line of the description, cut short, as the description field; null when there is none. */
function excerptNode(occ, ui, className) {
  const excerpt = ui.excerpt(occ.description);
  return excerpt ? ui.field('p', 'description', excerpt, className) : null;
}

/** 01 Timeline: a vertical rail with a dot per event, the date to the left and the event to the right. */
export function timeline(host, occs, props, ics, ui) {
  const grid = ui.el('div', 'urd-cal-tl');
  occs.forEach((occ, i) => {
    const d = dayOf(occ);
    const when = ui.el('div', 'urd-cal-tl-when');
    when.append(ui.field('strong', 'number', ui.dayMonth(d), null, d), ui.field('span', 'date', weekday(d), null, d));
    const rail = ui.el('div', 'urd-cal-tl-rail');
    const dot = ui.color(ui.el('span', 'urd-cal-tl-dot'), occ);
    if (i === 0) dot.classList.add('urd-cal-tl-dot-first');
    rail.appendChild(dot);
    const body = ui.tint(ui.el('div', 'urd-cal-tl-body'), occ);
    body.appendChild(ui.field('strong', 'title', occ.title, 'urd-cal-tl-title'));
    const meta = ui.meta(occ, { date: false });
    if (meta) body.appendChild(meta);
    const foot = ui.el('div', 'urd-cal-tl-foot');
    const signup = ui.signup(occ);
    if (signup) foot.appendChild(signup);
    const chip = ui.chip(occ);
    if (chip) foot.appendChild(chip);
    if (foot.children.length) body.appendChild(foot);
    grid.append(when, rail, body);
  });
  host.appendChild(grid);
}

/** 05 Table: one row per event with the date, the time, the event, the place and the sign-up in columns. */
export function table(host, occs, props, ics, ui) {
  const tbl = ui.el('table', 'urd-cal-table');
  const head = ui.el('thead');
  const headRow = ui.el('tr');
  // The time and the place are columns the owner can leave out.
  const showTime = ui.opt.colTime !== false;
  const showPlace = ui.opt.colPlace !== false;
  for (const key of ['colDate', showTime && 'colTime', 'colEvent', showPlace && 'colPlace'].filter(Boolean)) {
    const th = ui.el('th');
    th.appendChild(ui.tx(key));
    headRow.appendChild(th);
  }
  headRow.appendChild(ui.el('th'));
  head.appendChild(headRow);
  const body = ui.el('tbody');
  for (const occ of occs) {
    const d = dayOf(occ);
    const row = ui.tint(ui.el('tr'), occ);
    const date = ui.el('td', 'urd-cal-table-date');
    date.appendChild(ui.field('strong', 'date', ui.dateLine(d), null, d));
    const time = ui.el('td');
    time.appendChild(ui.field('span', 'time', ui.time(occ), null, occ));
    const event = ui.el('td');
    event.appendChild(ui.field('strong', 'title', occ.title));
    const chip = ui.chip(occ);
    if (chip) event.appendChild(chip);
    const place = ui.el('td');
    if (occ.location) place.appendChild(ui.field('span', 'place', occ.location));
    const act = ui.el('td', 'urd-cal-table-act');
    const signup = ui.signup(occ);
    if (signup) act.appendChild(signup);
    row.append(...[date, showTime && time, event, showPlace && place, act].filter(Boolean));
    body.appendChild(row);
  }
  tbl.append(head, body);
  const wrap = ui.el('div', 'urd-cal-table-wrap');
  wrap.appendChild(tbl);
  host.appendChild(wrap);
}

/** 07 Programme booklet: a printed programme on paper, the events under their month in columns with a large day number. */
export function booklet(host, occs, props, ics, ui) {
  const groups = ics.groupByMonth(occs);
  const months = dates().months;
  const paper = ui.el('div', 'urd-cal-booklet');
  const head = ui.el('div', 'urd-cal-booklet-head');
  const title = ui.el('h3', 'urd-cal-booklet-title');
  title.appendChild(ui.tx('program'));
  const first = groups[0];
  const last = groups[groups.length - 1];
  // The span of months in the language's order: «October 2026», «October · December 2026», or with both years when it crosses one.
  let span = '';
  if (first === last) span = ui.monthYear(first.year, first.month);
  else if (first) span = ui.monthRange(first.year === last.year ? months[first.month] : ui.monthYear(first.year, first.month), ui.monthYear(last.year, last.month));
  head.append(title, ui.field('span', 'date', span, 'urd-cal-booklet-span'));
  // The heading stands once, over the first rows; the fold continues the same paper.
  if (!ui.rest) paper.appendChild(head);
  const cols = ui.el('div', 'urd-cal-booklet-cols');
  for (const group of groups) {
    const col = ui.el('section', 'urd-cal-booklet-month');
    col.appendChild(ui.el('h4', 'urd-cal-booklet-mname', months[group.month]));
    for (const occ of group.items) {
      const row = ui.tint(ui.el('div', 'urd-cal-booklet-row'), occ);
      row.appendChild(ui.field('strong', 'number', String(dayOf(occ).getDate()), 'urd-cal-booklet-day', occ));
      const body = ui.el('div', 'urd-cal-booklet-body');
      body.append(ui.field('strong', 'title', occ.title, 'urd-cal-booklet-name'), weekdayMeta(occ, ui));
      const text = ui.descriptionIn === 'card' ? null : excerptNode(occ, ui, 'urd-cal-booklet-text');
      if (text) body.appendChild(text);
      const signup = ui.signup(occ);
      if (signup) body.appendChild(signup);
      row.appendChild(body);
      col.appendChild(row);
    }
    cols.appendChild(col);
  }
  paper.appendChild(cols);
  host.appendChild(paper);
}

/** 10 Numbered programme: the events counted 01, 02, 03 with a rule between the rows and the count at the top. */
export function numbered(host, occs, props, ics, ui) {
  const wrap = ui.el('div', 'urd-cal-numbered');
  // The count is of the whole list, and the numbers run on through the fold.
  if (!ui.rest) wrap.appendChild(ui.el('span', 'urd-cal-numbered-count', ui.tx('count', null, { n: ui.total || occs.length })));
  occs.forEach((occ, i) => {
    const row = ui.tint(ui.el('div', 'urd-cal-numbered-row'), occ);
    row.appendChild(ui.field('span', 'number', ui.opt.pad === false ? String(ui.offset + i + 1) : two(ui.offset + i + 1), 'urd-cal-numbered-n'));
    const body = ui.el('div', 'urd-cal-numbered-body');
    body.appendChild(ui.field('strong', 'title', occ.title, 'urd-cal-numbered-title'));
    const meta = ui.meta(occ);
    if (meta) body.appendChild(meta);
    // The sign-up takes the side column; a chip stands there only when there is none.
    const side = ui.el('div', 'urd-cal-numbered-side');
    const signup = ui.signup(occ);
    const chip = signup ? null : ui.chip(occ);
    if (signup) side.appendChild(signup);
    else if (chip) side.appendChild(chip);
    row.append(body, side);
    wrap.appendChild(row);
  });
  host.appendChild(wrap);
}

/** A5 List on navy: ApeironLF's rows on navy with the day in gold, the category outlined and the title in the heading face. */
export function apList(host, occs, props, ics, ui) {
  const list = ui.el('div', 'urd-cal-ap');
  for (const occ of occs) {
    const d = dayOf(occ);
    const row = ui.tint(ui.el('article', 'urd-cal-ap-row'), occ);
    const when = ui.el('div', 'urd-cal-ap-when');
    when.append(ui.field('strong', 'number', two(d.getDate()), null, d), ui.field('span', 'date', monthShort(d), null, d));
    const body = ui.el('div', 'urd-cal-ap-body');
    const top = ui.el('div', 'urd-cal-ap-top');
    const chip = ui.chip(occ);
    if (chip) top.appendChild(chip);
    top.appendChild(weekdayMeta(occ, ui));
    const rec = ui.recurring(occ);
    if (rec) top.appendChild(rec);
    body.append(top, ui.field('strong', 'title', occ.title, 'urd-cal-ap-title'));
    row.append(when, body);
    const signup = ui.signup(occ);
    if (signup) row.appendChild(signup);
    list.appendChild(row);
  }
  host.appendChild(list);
}

/** M2 Glass: frosted cards over three soft colour blobs, the day large in each card. */
export function glass(host, occs, props, ics, ui) {
  if (!ui.rest) for (const n of ['a', 'b', 'c']) host.appendChild(ui.el('i', `urd-cal-glass-blob urd-cal-glass-blob-${n}`));
  const list = ui.el('div', 'urd-cal-glass-list');
  for (const occ of occs) {
    const d = dayOf(occ);
    const card = ui.tint(ui.el('article', 'urd-cal-glass-card'), occ);
    const when = ui.el('div', 'urd-cal-glass-when');
    when.append(ui.field('strong', 'number', String(d.getDate()), null, d), ui.field('span', 'date', monthShort(d), null, d));
    const body = ui.el('div', 'urd-cal-glass-body');
    body.appendChild(ui.field('strong', 'title', occ.title, 'urd-cal-glass-title'));
    const meta = ui.meta(occ, { date: false });
    if (meta) body.appendChild(meta);
    card.append(when, body);
    const chip = ui.chip(occ);
    if (chip) card.appendChild(chip);
    const signup = ui.signup(occ);
    if (signup) card.appendChild(signup);
    list.appendChild(card);
  }
  host.appendChild(list);
}

/* ---------- The cards of their own (`ownCard` in the design list), each run on the event's card by the block (ui.dressCard) ---------- */

export const cards = {
  /** 07 Programme booklet: a page out of the booklet, «Program» over a rule at its top; the binding and the staples are base.css's. */
  booklet(dialog, occ, ui) {
    const head = ui.el('div', 'urd-cal-bk-cardhead');
    head.appendChild(ui.tx('program'));
    const close = dialog.querySelector('.urd-cal-dialog-close');
    if (close) close.after(head);
    else dialog.prepend(head);
  },
};
