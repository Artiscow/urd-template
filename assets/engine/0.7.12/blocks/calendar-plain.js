/**
 * The calendar block's plain views: the list, the cards, «Coming up», the agenda and the month, and the phone's stacked agenda, over the block's ui helpers.
 * Notes: docs/engine-notes/blocks/calendar-plain.md (Urd repository).
 */
import { t, dates } from '../i18n.js';

function badgeNode(occ, ui) {
  const start = new Date(occ.start);
  const badge = ui.color(ui.el('div', 'urd-collection-badge'), occ);
  badge.append(ui.field('strong', 'number', String(start.getDate()), null, start), ui.field('span', 'date', dates().monthsShort[start.getMonth()], null, start));
  return badge;
}

function renderList(host, occs, props, ics, ui) {
  const list = ui.el('div', 'urd-collection-list');
  for (const occ of occs) {
    const row = ui.tint(ui.el('article', 'urd-collection-row'), occ);
    row.appendChild(badgeNode(occ, ui));
    const body = ui.el('div', 'urd-collection-body');
    const titleRow = ui.el('div', 'urd-cal-titlerow');
    titleRow.appendChild(ui.field('strong', 'title', occ.title, 'urd-collection-title'));
    const chip = ui.chip(occ);
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
  const grid = ui.el('div', 'urd-collection-cards');
  for (const occ of occs) {
    const card = ui.tint(ui.el('article', 'urd-collection-card'), occ);
    const top = ui.el('div', 'urd-cal-titlerow');
    const when = ui.meta(occ);
    if (when) {
      when.className = 'urd-collection-date';
      top.appendChild(when);
    }
    const chip = ui.chip(occ);
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
  const row = ui.tint(ui.el('div', 'urd-cal-next-row'), occ);
  row.appendChild(badgeNode(occ, ui));
  const body = ui.el('div', null);
  const titleRow = ui.el('div', 'urd-cal-titlerow');
  titleRow.appendChild(ui.field('strong', 'title', occ.title, 'urd-cal-next-title'));
  const chip = ui.chip(occ);
  if (chip) titleRow.appendChild(chip);
  body.appendChild(titleRow);
  const meta = ui.meta(occ);
  if (meta) body.appendChild(meta);
  body.appendChild(ui.el('div', 'urd-cal-next-count', ui.countdown(occ)));
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
  const panel = ui.el('div', 'urd-cal-next');
  // One event is «the next event»; several are what is on right now.
  const label = ui.el('div', 'urd-cal-next-label');
  label.appendChild(ui.tx(count > 1 ? 'now' : 'next'));
  panel.appendChild(label);
  for (const occ of occs.slice(0, count)) panel.appendChild(nextRow(occ, ui));
  const later = occs.slice(count, count + ics.laterCount(props.laterCount));
  if (later.length) {
    const laterLabel = ui.el('div', 'urd-cal-next-label urd-cal-later-label');
    laterLabel.appendChild(ui.tx('later'));
    panel.appendChild(laterLabel);
    const list = ui.el('ul', 'urd-cal-later');
    for (const occ of later) {
      const item = ui.tint(ui.el('li', null), occ);
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
  const wrap = ui.el('div', 'urd-cal-agenda');
  for (const group of ics.groupByMonth(occs)) {
    wrap.appendChild(ui.el('h4', 'urd-cal-agenda-month', ui.monthYear(group.year, group.month)));
    const list = ui.el('ul', 'urd-cal-agenda-list');
    for (const occ of group.items) {
      const start = new Date(occ.start);
      const item = ui.tint(ui.el('li', 'urd-cal-agenda-row'), occ);
      const day = ui.el('span', 'urd-cal-agenda-day');
      day.append(ui.field('strong', 'number', String(start.getDate()), null, start), ui.field('span', 'date', dates().weekdaysShort[(start.getDay() + 6) % 7], null, start));
      const body = ui.el('span', 'urd-cal-agenda-body');
      const titleRow = ui.el('span', 'urd-cal-titlerow');
      titleRow.appendChild(ui.field('strong', 'title', occ.title));
      const chip = ui.chip(occ);
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

function renderMonth(host, occs, props, ics, ui) {
  const now = ui.today();
  let shown = { y: now.getFullYear(), mo: now.getMonth() };

  const wrap = ui.el('div', 'urd-cal-month');
  const head = ui.el('div', 'urd-cal-month-head');
  const prev = ui.el('button', 'urd-cal-nav', '‹');
  prev.type = 'button';
  prev.setAttribute('aria-label', t('calendar.prevMonth'));
  const label = ui.live(ui.el('strong', null, ''));
  const next = ui.el('button', 'urd-cal-nav', '›');
  next.type = 'button';
  next.setAttribute('aria-label', t('calendar.nextMonth'));
  head.append(prev, label, next);
  const grid = ui.el('div', 'urd-cal-grid');
  wrap.append(head, grid);
  // On the phone a day is a button with dots, and its events are listed under the grid.
  const panel = ui.phone ? ui.el('div', 'urd-cal-daylist') : null;
  if (panel) wrap.appendChild(panel);

  const move = (dir) => {
    shown = shown.mo + dir < 0 ? { y: shown.y - 1, mo: 11 } : shown.mo + dir > 11 ? { y: shown.y + 1, mo: 0 } : { ...shown, mo: shown.mo + dir };
    paint();
  };
  const paint = () => {
    label.textContent = ui.monthYear(shown.y, shown.mo);
    grid.replaceChildren();
    for (const day of ui.dows()) grid.appendChild(ui.el('div', 'urd-cal-dow', day));
    const first = new Date(shown.y, shown.mo, 1);
    const lead = ui.lead(first);
    const dim = new Date(shown.y, shown.mo + 1, 0).getDate();
    const today = ui.today();
    for (let i = 0; i < lead; i++) grid.appendChild(ui.el('div', 'urd-cal-day urd-cal-day-empty'));
    if (panel) {
      ui.phoneDays(grid, panel, shown.y, shown.mo, occs, 'urd-cal-day');
      ui.dayGrid(grid, '.urd-cal-pday', { page: move, current: '[aria-pressed="true"]' });
      return;
    }
    for (let d = 1; d <= dim; d++) {
      const cell = ui.el('div', 'urd-cal-day');
      if (d === today.getDate() && shown.mo === today.getMonth() && shown.y === today.getFullYear()) {
        cell.classList.add('urd-cal-today');
      }
      cell.appendChild(ui.el('span', 'urd-cal-daynum', String(d)));
      const todays = occs.filter((occ) => {
        const s = new Date(occ.start);
        return s.getFullYear() === shown.y && s.getMonth() === shown.mo && s.getDate() === d;
      });
      for (const occ of todays.slice(0, 3)) {
        const pill = ui.tint(ui.field('div', 'title', occ.title, 'urd-cal-pill'), occ);
        pill.title = `${occ.title}\n${ui.metaString(occ)}`;
        cell.appendChild(pill);
      }
      if (todays.length > 3) cell.appendChild(ui.el('div', 'urd-cal-more', ui.tx('moreN', null, { n: todays.length - 3 })));
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
 * The phone design: one stacked agenda in the design's set for a design that cannot be read on a phone; a span design lists what is coming.
 */
function renderPhoneAgenda(host, occs, props, ics, ui) {
  const wrap = ui.el('div', 'urd-cal-pa');
  let list = occs;
  if (!ui.rest && ui.spanView) {
    const soon = ui.today().getTime() - 6 * 3600 * 1000;
    list = occs.filter((occ) => (occ.end ?? occ.start) >= soon).slice(0, Math.max(1, Number(props.limit) || 6));
  }
  if (!ui.rest) {
    const head = ui.el('div', 'urd-cal-pa-head');
    head.appendChild(ui.tx('swUpcoming', 'urd-cal-pa-title'));
    if (list[0]) head.appendChild(ui.el('span', 'urd-cal-pa-next', ui.countdown(list[0])));
    wrap.appendChild(head);
  }
  for (const occ of list) {
    const row = ui.tint(ui.el('article', 'urd-cal-pa-row'), occ);
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

/** The plain views by name, as the block's view and the switcher's month name them. */
export const VIEWS = { list: renderList, cards: renderCards, month: renderMonth, next: renderNext, agenda: renderAgenda };

/** The phone's stacked agenda, by the name the block asks for it under. */
export const phoneAgenda = renderPhoneAgenda;
