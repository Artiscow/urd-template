/**
 * The calendar block's month, week, day and year designs (milestone 0.7.19): eight looks that each show a span of time rather than a count of events, every one a renderer over the block's ui helpers (fields, static texts, buttons; see makeUi in calendar.js) with its own rules in base.css under its own class names.
 * The data is `ui.all`, the whole filtered window the block loaded for the view (ics.js windowStart), so a design can move through its weeks or months on its own.
 * Loaded by the block on the first render of a block that uses one of them, never in the visitor closure.
 */
import { t, tp, dates } from '../i18n.js';
import { resolveColor } from '../theme.js';

const dayOf = (occ) => new Date(occ.start);
const weekdayShort = (d) => dates().weekdaysShort[(d.getDay() + 6) % 7];
const weekday = (d) => dates().weekdays[(d.getDay() + 6) % 7];
const sameDay = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

/** 00:00 of the day after the day a time falls on: a calendar day, whatever its length in hours. */
const nextDayStart = (ms) => {
  const d = new Date(ms);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1).getTime();
};

/** Where an event stops covering days: the day after its last day for an all-day event (its end is the start of the last day), else its end, a moment at least. */
const coverEnd = (occ) => (occ.allDay ? nextDayStart(occ.end ?? occ.start) : Math.max(occ.end ?? occ.start, occ.start + 1));

/** The events that touch a day: a start on it, or a span over it. */
function onDay(occs, day) {
  const from = startOfDay(day).getTime();
  const to = nextDayStart(from);
  return occs.filter((occ) => occ.start < to && coverEnd(occ) > from);
}

/** The ISO week a week shown falls in, read from its fourth day, so a week that starts on a Sunday is named by the Monday to Saturday it holds. */
const weekNumber = (ics, week) => ics.isoWeek(week[3].getTime());

/** A round navigation button with an arrow glyph and its label for the screen reader. */
function navButton(ui, dir, label) {
  const btn = ui.el('button', 'urd-cal-nav', dir < 0 ? '‹' : '›');
  btn.type = 'button';
  btn.setAttribute('aria-label', label);
  return btn;
}

/** «5 Oct to 11 Oct» for a span of days, as words the owner rewrites. */
function rangeNode(ui, from, to) {
  return ui.tx('range', null, { from: ui.dayMonth(from), to: ui.dayMonth(to) });
}

/** The pill for an event in a week or month cell: the time and the title, tinted with the calendar colour. */
function pillNode(occ, ui, className) {
  const pill = ui.tint(ui.el('div', className), occ);
  // A space between the time and the title, so a narrow pill can break the line there.
  if (ui.hasTime(occ)) pill.append(ui.field('span', 'time', ui.time(occ), 'urd-cal-pill-time', occ), ' ');
  pill.appendChild(ui.field('span', 'title', occ.title));
  pill.title = `${occ.title}${occ.location ? ` · ${occ.location}` : ''}`;
  return pill;
}

/** The seven days of a week from its first day. */
function weekDays(weekFirst) {
  return Array.from({ length: 7 }, (_, i) => new Date(weekFirst.getFullYear(), weekFirst.getMonth(), weekFirst.getDate() + i));
}

/** 04 Week strip: seven day columns with a pill per event, the week number above and arrows to move through the weeks. */
export function weekStrip(host, occs, props, ics, ui) {
  const today = ui.today();
  let weekFirst = new Date(ui.weekStartOf(today.getTime()));
  const wrap = ui.el('div', 'urd-cal-wstrip');
  const head = ui.el('div', 'urd-cal-wstrip-head');
  const prev = navButton(ui, -1, t('calendar.prevWeek'));
  const next = navButton(ui, 1, t('calendar.nextWeek'));
  const label = ui.live(ui.el('div', 'urd-cal-wstrip-label'));
  const weekNo = ui.el('strong', null);
  const range = ui.el('span', null);
  label.append(weekNo, range);
  head.append(prev, label, next);
  const grid = ui.el('div', 'urd-cal-wstrip-grid');
  wrap.append(head, grid);
  const paint = () => {
    const days = weekDays(weekFirst);
    weekNo.replaceChildren(ui.tx('weekN', null, { n: weekNumber(ics, days) }));
    range.replaceChildren(rangeNode(ui, days[0], days[6]));
    grid.replaceChildren();
    for (const day of days) {
      const col = ui.el('div', 'urd-cal-wstrip-day');
      if (sameDay(day, today)) col.classList.add('urd-cal-wstrip-today');
      col.append(ui.field('span', 'date', weekdayShort(day), 'urd-cal-wstrip-wd', day), ui.field('strong', 'number', String(day.getDate()), 'urd-cal-wstrip-num', day));
      const todays = onDay(ui.all, day);
      for (const occ of todays) col.appendChild(pillNode(occ, ui, 'urd-cal-wstrip-pill'));
      ui.dayLabel(col, day, todays.length);
      grid.appendChild(col);
    }
    ui.dayGrid(grid, '.urd-cal-wstrip-day', { page: move, current: '.urd-cal-wstrip-today' });
  };
  const move = (dir) => { weekFirst = new Date(weekFirst.getFullYear(), weekFirst.getMonth(), weekFirst.getDate() + 7 * dir); paint(); };
  prev.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  paint();
  host.appendChild(wrap);
}

/**
 * The hours a plan shows: from the earliest event (at most 8) to past the latest (at least 18).
 * The owner's own first and last hour replace the 8 and the 18; an event outside them still widens the span.
 */
function hourSpan(occs, opt = {}) {
  let from = Number.isInteger(opt.hourFrom) ? Math.min(opt.hourFrom, 23) : 8;
  let to = Number.isInteger(opt.hourTo) ? opt.hourTo : 18;
  for (const occ of occs) {
    if (occ.allDay) continue;
    const d = dayOf(occ);
    from = Math.min(from, d.getHours());
    // An event that ends on a later day runs the plan to midnight.
    const end = occ.end > occ.start ? new Date(occ.end) : null;
    const endHour = !end ? d.getHours() + 1 : sameDay(end, d) ? end.getHours() + (end.getMinutes() ? 1 : 0) : 24;
    to = Math.max(to, endHour);
  }
  return { from, to: Math.min(24, Math.max(to, from + 4)) };
}

/** A timed event as a block in an hour cell, its height from its length. */
function planBlock(occ, ui) {
  const block = ui.tint(ui.el('div', 'urd-cal-plan-event'), occ);
  block.appendChild(ui.field('strong', 'title', occ.title));
  const when = ui.el('span', 'urd-cal-plan-when');
  when.appendChild(ui.field('span', 'time', ui.time(occ), null, occ));
  if (occ.location) {
    when.appendChild(document.createTextNode(' · '));
    when.appendChild(ui.field('span', 'place', occ.location));
  }
  block.appendChild(when);
  const hours = occ.end ? Math.max(1, Math.min(6, (occ.end - occ.start) / 3600000)) : 1;
  block.style.setProperty('--urd-cal-plan-span', String(hours));
  const signup = ui.signup(occ);
  if (signup) block.appendChild(signup);
  return block;
}

/** M3 Week plan: an hour grid over seven days, timed events as blocks in their hour, all-day ones in a row above. */
export function weekPlan(host, occs, props, ics, ui) {
  const today = ui.today();
  let weekFirst = new Date(ui.weekStartOf(today.getTime()));
  const wrap = ui.el('div', 'urd-cal-wplan');
  const head = ui.el('div', 'urd-cal-wplan-head');
  const prev = navButton(ui, -1, t('calendar.prevWeek'));
  const next = navButton(ui, 1, t('calendar.nextWeek'));
  const range = ui.live(ui.el('strong', 'urd-cal-wplan-range'));
  const todayBtn = ui.el('button', 'urd-cal-wplan-today');
  todayBtn.type = 'button';
  todayBtn.appendChild(ui.tx('todayBtn'));
  const left = ui.el('div', 'urd-cal-wplan-nav');
  left.append(prev, next, range);
  head.append(left, todayBtn);
  const days = ui.el('div', 'urd-cal-wplan-days');
  const grid = ui.el('div', 'urd-cal-wplan-grid');
  wrap.append(head, days, grid);
  const paint = () => {
    const week = weekDays(weekFirst);
    range.replaceChildren(rangeNode(ui, week[0], week[6]));
    days.replaceChildren(ui.el('span'));
    for (const day of week) {
      const cell = ui.el('div', 'urd-cal-wplan-day');
      if (sameDay(day, today)) cell.classList.add('urd-cal-wplan-istoday');
      cell.append(ui.field('span', 'date', weekdayShort(day), null, day), ui.field('strong', 'number', String(day.getDate()), null, day));
      days.appendChild(cell);
    }
    const inWeek = ui.all.filter((occ) => occ.start < nextDayStart(week[6].getTime()) && coverEnd(occ) > week[0].getTime());
    if (ui.phone) {
      // The phone's week: the days under each other, each with its events in the order of the clock.
      days.hidden = true;
      grid.className = 'urd-cal-wplan-stack';
      grid.replaceChildren();
      for (const day of week) {
        const row = ui.el('div', 'urd-cal-wplan-prow');
        const name = ui.el('div', 'urd-cal-wplan-pday');
        if (sameDay(day, today)) row.classList.add('urd-cal-wplan-istoday');
        name.append(ui.field('span', 'date', weekdayShort(day), null, day), ui.field('strong', 'number', String(day.getDate()), null, day));
        const list = ui.el('div', 'urd-cal-wplan-plist');
        for (const occ of onDay(inWeek, day)) list.appendChild(occ.allDay ? pillNode(occ, ui, 'urd-cal-wplan-pill') : planBlock(occ, ui));
        row.append(name, list);
        grid.appendChild(row);
      }
      return;
    }
    const { from, to } = hourSpan(inWeek, ui.opt);
    grid.replaceChildren();
    grid.style.setProperty('--urd-cal-plan-rows', String(to - from));
    const allDay = inWeek.filter((occ) => occ.allDay);
    if (allDay.length) {
      grid.appendChild(ui.el('span', 'urd-cal-wplan-hour'));
      for (const day of week) {
        const cell = ui.el('div', 'urd-cal-wplan-cell urd-cal-wplan-allday');
        if (sameDay(day, today)) cell.classList.add('urd-cal-wplan-istoday');
        for (const occ of allDay.filter((o) => onDay([o], day).length)) cell.appendChild(pillNode(occ, ui, 'urd-cal-wplan-pill'));
        grid.appendChild(cell);
      }
    }
    for (let hour = from; hour < to; hour++) {
      grid.appendChild(ui.el('span', 'urd-cal-wplan-hour', ui.hourLabel(hour)));
      for (const day of week) {
        const cell = ui.el('div', 'urd-cal-wplan-cell');
        if (sameDay(day, today)) cell.classList.add('urd-cal-wplan-istoday');
        if (day.getDay() === 0 || day.getDay() === 6) cell.classList.add('urd-cal-plan-weekend');
        for (const occ of inWeek) {
          const d = dayOf(occ);
          if (!occ.allDay && sameDay(d, day) && d.getHours() === hour) cell.appendChild(planBlock(occ, ui));
        }
        grid.appendChild(cell);
      }
    }
  };
  const move = (dir) => { weekFirst = new Date(weekFirst.getFullYear(), weekFirst.getMonth(), weekFirst.getDate() + 7 * dir); paint(); };
  prev.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  todayBtn.addEventListener('click', () => { weekFirst = new Date(ui.weekStartOf(today.getTime())); paint(); });
  paint();
  host.appendChild(wrap);
}

/** F4 Calendar layers: one row per calendar with a switch in the head, the events as bars over the week's days. */
export function layers(host, occs, props, ics, ui) {
  const today = ui.today();
  let weekFirst = new Date(ui.weekStartOf(today.getTime()));
  const names = [...new Set(ui.all.map((occ) => occ.category || ''))];
  const colourOf = (name) => ui.all.find((occ) => (occ.category || '') === name && occ.color)?.color ?? '';
  const hidden = new Set();
  const wrap = ui.el('div', 'urd-cal-layers');
  const head = ui.el('div', 'urd-cal-layers-head');
  const nav = ui.el('div', 'urd-cal-layers-nav');
  const prev = navButton(ui, -1, t('calendar.prevWeek'));
  const next = navButton(ui, 1, t('calendar.nextWeek'));
  const label = ui.live(ui.el('strong', 'urd-cal-layers-label'));
  nav.append(prev, next, label);
  const switches = ui.el('div', 'urd-cal-layers-switches');
  head.append(nav, switches);
  const grid = ui.el('div', 'urd-cal-layers-grid');
  wrap.append(head, grid);
  const paint = () => {
    const week = weekDays(weekFirst);
    label.replaceChildren(ui.tx('weekN', null, { n: weekNumber(ics, week) }), ' · ', rangeNode(ui, week[0], week[6]));
    grid.replaceChildren(ui.el('span', 'urd-cal-layers-corner'));
    for (const day of week) {
      const cell = ui.el('span', 'urd-cal-layers-dow');
      if (sameDay(day, today)) cell.classList.add('urd-cal-layers-istoday');
      cell.append(ui.field('span', 'date', ui.weekdayDay(day), null, day));
      grid.appendChild(cell);
    }
    const weekStart = week[0].getTime();
    const weekEnd = nextDayStart(week[6].getTime());
    // The column a time falls in: the day of the week it is on, counted in calendar days.
    const column = (ms) => week.findIndex((day, n) => ms < (n < 6 ? week[n + 1].getTime() : weekEnd));
    for (const name of names) {
      if (hidden.has(name)) continue;
      const colour = colourOf(name);
      const rowLabel = ui.el('div', 'urd-cal-layers-name');
      const swatch = ui.el('i', 'urd-cal-layers-swatch');
      if (colour) swatch.style.setProperty('--urd-cal-color', resolveColor(colour));
      rowLabel.append(swatch, ui.field('span', 'category', name || ui.tx('unnamed')));
      const lane = ui.el('div', 'urd-cal-layers-lane');
      const todayIndex = week.findIndex((day) => sameDay(day, today));
      if (todayIndex >= 0) lane.style.setProperty('--urd-cal-layers-today', String(todayIndex));
      for (const occ of ui.all) {
        if ((occ.category || '') !== name) continue;
        const end = Math.min(coverEnd(occ), weekEnd);
        if (end <= weekStart || occ.start >= weekEnd) continue;
        const first = occ.start < weekStart ? 0 : column(occ.start);
        const last = column(end - 1);
        const bar = ui.tint(ui.el('div', 'urd-cal-layers-bar'), occ);
        bar.style.setProperty('--urd-cal-bar-from', String(Math.max(0, first)));
        bar.style.setProperty('--urd-cal-bar-span', String(Math.max(1, last - Math.max(0, first) + 1)));
        // The bar's day in words, shown where the day columns are not (the phone).
        const from = Math.max(0, first);
        bar.appendChild(ui.field('span', 'date', last > from ? ui.tx('range', null, { from: ui.weekdayDay(week[from]), to: ui.weekdayDay(week[last]) }) : ui.weekdayDay(week[from]), 'urd-cal-layers-day', week[from]));
        bar.appendChild(ui.field('span', 'title', occ.title));
        if (ui.hasTime(occ)) bar.append(' ', ui.field('span', 'time', ui.time(occ), null, occ));
        bar.title = `${occ.title}${occ.location ? ` · ${occ.location}` : ''}`;
        lane.appendChild(bar);
      }
      grid.append(rowLabel, lane);
    }
  };
  for (const name of names) {
    const sw = ui.el('button', 'urd-cal-layers-switch');
    sw.type = 'button';
    sw.setAttribute('aria-pressed', 'true');
    sw.setAttribute('aria-label', t('calendar.showCalendar', { name: name || t('calendar.unnamed') }));
    const knob = ui.el('i', 'urd-cal-layers-knob');
    const colour = colourOf(name);
    if (colour) knob.style.setProperty('--urd-cal-color', resolveColor(colour));
    sw.append(knob, ui.field('span', 'category', name || ui.tx('unnamed')));
    sw.addEventListener('click', () => {
      if (hidden.has(name)) hidden.delete(name);
      else hidden.add(name);
      sw.setAttribute('aria-pressed', hidden.has(name) ? 'false' : 'true');
      paint();
    });
    switches.appendChild(sw);
  }
  const move = (dir) => { weekFirst = new Date(weekFirst.getFullYear(), weekFirst.getMonth(), weekFirst.getDate() + 7 * dir); paint(); };
  prev.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  paint();
  host.appendChild(wrap);
}

/** The month head with arrows, shared by the two month designs. */
function monthHead(ui, onmove) {
  const head = ui.el('div', 'urd-cal-mhead');
  const prev = navButton(ui, -1, t('calendar.prevMonth'));
  const next = navButton(ui, 1, t('calendar.nextMonth'));
  const label = ui.live(ui.el('strong', 'urd-cal-mhead-label'));
  prev.addEventListener('click', () => onmove(-1));
  next.addEventListener('click', () => onmove(1));
  return { head, prev, next, label };
}

/** F1 Month with side panel: the month's days with chips, a chosen day, and a panel with that day's events and the calendars. */
export function sidepanel(host, occs, props, ics, ui) {
  const today = ui.today();
  let shown = { y: today.getFullYear(), m: today.getMonth() };
  let chosen = startOfDay(today);
  const wrap = ui.el('div', 'urd-cal-side');
  const main = ui.el('div', 'urd-cal-side-main');
  const move = (dir) => {
    shown = shown.m + dir < 0 ? { y: shown.y - 1, m: 11 } : shown.m + dir > 11 ? { y: shown.y + 1, m: 0 } : { ...shown, m: shown.m + dir };
    const first = ui.all.map(dayOf).find((d) => d.getFullYear() === shown.y && d.getMonth() === shown.m);
    chosen = first ? startOfDay(first) : new Date(shown.y, shown.m, 1);
    paint();
  };
  const { head, prev, next, label } = monthHead(ui, move);
  head.append(label, ui.el('span', 'urd-cal-mhead-nav'));
  head.lastChild.append(prev, next);
  const dows = ui.el('div', 'urd-cal-side-dows');
  for (const day of ui.dows()) dows.appendChild(ui.el('span', null, day));
  const grid = ui.el('div', 'urd-cal-side-grid');
  main.append(head, dows, grid);
  const panel = ui.el('aside', 'urd-cal-side-panel');
  wrap.append(main, panel);
  const paintPanel = () => {
    panel.replaceChildren();
    const headP = ui.live(ui.el('div', 'urd-cal-side-chosen'));
    headP.append(ui.field('span', 'date', weekday(chosen), null, chosen), ui.field('strong', 'number', ui.dayMonth(chosen, true), null, chosen));
    panel.appendChild(headP);
    const list = ui.el('div', 'urd-cal-side-list');
    for (const occ of onDay(ui.all, chosen)) {
      const card = ui.tint(ui.el('div', 'urd-cal-side-card'), occ);
      card.appendChild(ui.field('strong', 'title', occ.title));
      const meta = ui.meta(occ, { date: false });
      if (meta) card.appendChild(meta);
      const signup = ui.signup(occ);
      if (signup) card.appendChild(signup);
      list.appendChild(card);
    }
    if (!list.children.length) list.appendChild(ui.el('p', 'urd-cal-side-none', ui.tx('dayNone')));
    panel.appendChild(list);
    // The key to the calendars' colours: with the calendar filter on, and only when a calendar has a colour of its own (the sources' colour setting).
    const names = props.showCategories === true && ui.all.some((occ) => occ.color) ? [...new Set(ui.all.map((occ) => occ.category).filter(Boolean))] : [];
    if (names.length) {
      const legend = ui.el('div', 'urd-cal-side-legend');
      for (const name of names) {
        const row = ui.el('span', 'urd-cal-side-key');
        const sw = ui.el('i');
        const colour = ui.all.find((occ) => occ.category === name && occ.color)?.color;
        if (colour) sw.style.setProperty('--urd-cal-color', resolveColor(colour));
        row.append(sw, ui.field('span', 'category', name));
        legend.appendChild(row);
      }
      panel.appendChild(legend);
    }
  };
  const paint = () => {
    label.textContent = ui.monthYear(shown.y, shown.m);
    grid.replaceChildren();
    const first = new Date(shown.y, shown.m, 1);
    const lead = ui.lead(first);
    const dim = new Date(shown.y, shown.m + 1, 0).getDate();
    const prevDim = new Date(shown.y, shown.m, 0).getDate();
    const cells = [];
    for (let i = lead - 1; i >= 0; i--) cells.push({ date: new Date(shown.y, shown.m - 1, prevDim - i), out: true });
    for (let d = 1; d <= dim; d++) cells.push({ date: new Date(shown.y, shown.m, d), out: false });
    while (cells.length % 7) cells.push({ date: new Date(shown.y, shown.m + 1, cells.length - lead - dim + 1), out: true });
    for (const { date, out } of cells) {
      const cell = ui.el('button', 'urd-cal-side-day');
      cell.type = 'button';
      if (out) cell.classList.add('urd-cal-side-out');
      if (sameDay(date, today)) cell.classList.add('urd-cal-side-today');
      if (sameDay(date, chosen)) cell.classList.add('urd-cal-side-picked');
      cell.appendChild(ui.el('span', 'urd-cal-side-num', String(date.getDate())));
      const todays = onDay(ui.all, date);
      for (const occ of todays.slice(0, 2)) {
        const chip = ui.tint(ui.el('span', 'urd-cal-side-chip'), occ);
        chip.appendChild(ui.field('span', 'title', occ.title));
        cell.appendChild(chip);
      }
      if (todays.length > 2) cell.appendChild(ui.el('span', 'urd-cal-side-more', ui.tx('moreN', null, { n: todays.length - 2 })));
      cell.addEventListener('click', () => {
        chosen = startOfDay(date);
        if (out) {
          shown = { y: date.getFullYear(), m: date.getMonth() };
          ui.keepFocus(grid);
          paint();
        } else {
          const was = grid.querySelector('.urd-cal-side-picked');
          was?.classList.remove('urd-cal-side-picked');
          was?.setAttribute('aria-pressed', 'false');
          cell.classList.add('urd-cal-side-picked');
          cell.setAttribute('aria-pressed', 'true');
          paintPanel();
        }
      });
      ui.dayLabel(cell, date, todays.length);
      cell.setAttribute('aria-pressed', sameDay(date, chosen) ? 'true' : 'false');
      grid.appendChild(cell);
    }
    ui.dayGrid(grid, '.urd-cal-side-day', { page: move, current: '.urd-cal-side-picked' });
    paintPanel();
  };
  paint();
  host.appendChild(wrap);
}

/** A7 Overview on cream: ApeironLF's month on cream with a gold top rule, the pills with a gold line and the time in dark gold. */
export function apMonth(host, occs, props, ics, ui) {
  const today = ui.today();
  let shown = { y: today.getFullYear(), m: today.getMonth() };
  const wrap = ui.el('div', 'urd-cal-apm');
  const move = (dir) => {
    shown = shown.m + dir < 0 ? { y: shown.y - 1, m: 11 } : shown.m + dir > 11 ? { y: shown.y + 1, m: 0 } : { ...shown, m: shown.m + dir };
    paint();
  };
  const { head, prev, next, label } = monthHead(ui, move);
  head.append(prev, label, next);
  const dows = ui.el('div', 'urd-cal-apm-dows');
  for (const day of ui.dows()) dows.appendChild(ui.el('span', null, day));
  const grid = ui.el('div', 'urd-cal-apm-grid');
  wrap.append(head, dows, grid);
  // On the phone a day is a button with dots, and its events are listed under the grid.
  const panel = ui.phone ? ui.el('div', 'urd-cal-daylist') : null;
  if (panel) wrap.appendChild(panel);
  const paint = () => {
    const first = new Date(shown.y, shown.m, 1);
    label.textContent = ui.monthYear(shown.y, shown.m);
    grid.replaceChildren();
    const lead = ui.lead(first);
    const dim = new Date(shown.y, shown.m + 1, 0).getDate();
    for (let i = 0; i < lead; i++) grid.appendChild(ui.el('span', 'urd-cal-apm-day urd-cal-apm-out'));
    if (panel) ui.phoneDays(grid, panel, shown.y, shown.m, ui.all, 'urd-cal-apm-day');
    for (let d = 1; !panel && d <= dim; d++) {
      const date = new Date(shown.y, shown.m, d);
      const cell = ui.el('div', 'urd-cal-apm-day');
      const num = ui.el('i', 'urd-cal-apm-num', String(d));
      if (sameDay(date, today)) num.classList.add('urd-cal-apm-today');
      cell.appendChild(num);
      const todays = onDay(ui.all, date);
      for (const occ of todays.slice(0, 3)) cell.appendChild(pillNode(occ, ui, 'urd-cal-apm-pill'));
      ui.dayLabel(cell, date, todays.length);
      if (sameDay(date, today)) cell.classList.add('urd-cal-apm-istoday');
      grid.appendChild(cell);
    }
    ui.dayGrid(grid, panel ? '.urd-cal-pday' : '.urd-cal-apm-day:not(.urd-cal-apm-out)', { page: move, current: panel ? '[aria-pressed="true"]' : '.urd-cal-apm-istoday' });
    const total = lead + dim;
    for (let i = total; i % 7; i++) grid.appendChild(ui.el('span', 'urd-cal-apm-day urd-cal-apm-out'));
  };
  paint();
  host.appendChild(wrap);
}

/** F2 Day plan: one day's hours with the events as blocks, a week strip to pick the day, the now line and the past shaded. */
export function dayPlan(host, occs, props, ics, ui) {
  const today = ui.today();
  let day = startOfDay(today);
  const wrap = ui.el('div', 'urd-cal-dplan');
  const head = ui.el('div', 'urd-cal-dplan-head');
  const headText = ui.el('div');
  const kicker = ui.el('span', 'urd-cal-dplan-kicker');
  const title = ui.live(ui.el('strong', 'urd-cal-dplan-title'));
  headText.append(kicker, title);
  const count = ui.el('span', 'urd-cal-dplan-count');
  head.append(headText, count);
  const strip = ui.el('div', 'urd-cal-dplan-strip');
  const grid = ui.el('div', 'urd-cal-dplan-grid');
  wrap.append(head, strip, grid);
  const paint = () => {
    const isToday = sameDay(day, today);
    kicker.replaceChildren();
    if (isToday) kicker.appendChild(ui.tx('todayBtn'));
    else kicker.appendChild(ui.field('span', 'date', weekdayShort(day), null, day));
    title.replaceChildren(ui.field('span', 'date', ui.dateLine(day, true), null, day));
    const todays = onDay(ui.all, day);
    // «N today» for today, else the day's count.
    count.replaceChildren(ui.tx(isToday ? 'todayCount' : 'count', null, { n: todays.length }));
    strip.replaceChildren();
    for (let i = -2; i <= 4; i++) {
      const d = new Date(day.getFullYear(), day.getMonth(), day.getDate() + i);
      const btn = ui.el('button', 'urd-cal-dplan-pick');
      btn.type = 'button';
      if (i === 0) btn.classList.add('urd-cal-dplan-picked');
      if (sameDay(d, today)) btn.classList.add('urd-cal-dplan-istoday');
      btn.append(ui.field('span', 'date', weekdayShort(d), null, d), ui.field('strong', 'number', String(d.getDate()), null, d));
      btn.setAttribute('aria-label', ui.dateLine(d, true));
      btn.setAttribute('aria-pressed', i === 0 ? 'true' : 'false');
      btn.addEventListener('click', () => { day = startOfDay(d); ui.keepFocus(strip); paint(); });
      strip.appendChild(btn);
    }
    ui.dayGrid(strip, '.urd-cal-dplan-pick', { current: '.urd-cal-dplan-picked' });
    // An event that began on an earlier day is under way when the day starts: it stands in the row above the hours.
    const begun = (occ) => !occ.allDay && sameDay(dayOf(occ), day);
    const { from, to } = hourSpan(todays.filter(begun), ui.opt);
    grid.replaceChildren();
    grid.classList.toggle('urd-cal-dplan-istoday', isToday);
    grid.classList.toggle('urd-cal-plan-weekend', day.getDay() === 0 || day.getDay() === 6);
    const allDay = todays.filter((occ) => !begun(occ));
    if (allDay.length) {
      grid.appendChild(ui.el('span', 'urd-cal-dplan-hour'));
      const cell = ui.el('div', 'urd-cal-dplan-cell urd-cal-dplan-allday');
      for (const occ of allDay) cell.appendChild(pillNode(occ, ui, 'urd-cal-dplan-pill'));
      grid.appendChild(cell);
    }
    const nowHour = today.getHours() + today.getMinutes() / 60;
    for (let hour = from; hour < to; hour++) {
      grid.appendChild(ui.el('span', 'urd-cal-dplan-hour', ui.hourLabel(hour)));
      const cell = ui.el('div', 'urd-cal-dplan-cell');
      if (isToday && hour + 1 <= nowHour) cell.classList.add('urd-cal-dplan-past');
      if (isToday && nowHour >= hour && nowHour < hour + 1) {
        const line = ui.el('i', 'urd-cal-dplan-now');
        line.style.top = `${(nowHour - hour) * 100}%`;
        cell.appendChild(line);
      }
      for (const occ of todays) {
        if (begun(occ) && dayOf(occ).getHours() === hour) cell.appendChild(planBlock(occ, ui));
      }
      grid.appendChild(cell);
    }
  };
  paint();
  host.appendChild(wrap);
}

const SVG = 'http://www.w3.org/2000/svg';
const svgEl = (tag, attrs) => {
  const node = document.createElementNS(SVG, tag);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, String(v));
  return node;
};
/** A point on a circle: angle 0 at twelve o'clock, clockwise. */
const polar = (cx, cy, r, angle) => [cx + r * Math.sin(angle), cy - r * Math.cos(angle)];
/** An arc path on a ring between two angles (radians, clockwise from twelve). */
function arcPath(cx, cy, r, a0, a1) {
  const [x0, y0] = polar(cx, cy, r, a0);
  const [x1, y1] = polar(cx, cy, r, a1);
  return `M ${x0.toFixed(2)} ${y0.toFixed(2)} A ${r} ${r} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`;
}

/** 08 Year wheel: twelve months on a ring, a dot per event, the past months dimmed and the current one in the accent; a list for the picked month. */
export function yearWheel(host, occs, props, ics, ui) {
  const today = ui.today();
  let picked = today.getMonth();
  // The month at the top of the wheel is the owner's choice, and the wheel reads the season that starts there and holds today:
  // with August at the top, August this year to July next year. A month's place is counted from the top.
  const firstMonth = ics.seasonTop(ui.opt.firstMonth, today);
  const season = ics.seasonRange(firstMonth, today.getTime());
  const first = new Date(season.from).getFullYear();
  const label = firstMonth === 0 ? String(first) : `${first}/${String((first + 1) % 100).padStart(2, '0')}`;
  const place = (m) => (m - firstMonth + 12) % 12;
  const wrap = ui.el('div', 'urd-cal-wheel');
  const figure = ui.el('div', 'urd-cal-wheel-figure');
  const size = 440;
  const c = size / 2;
  const r = 178;
  const svg = svgEl('svg', { viewBox: `0 0 ${size} ${size}`, role: 'group', 'aria-label': label, class: 'urd-cal-wheel-svg' });
  const months = dates().monthsShort;
  const inYear = ui.all.filter((occ) => {
    const day = dayOf(occ).getTime();
    return day >= season.from && day < season.to;
  });
  const segments = [];
  for (let m = 0; m < 12; m++) {
    const a0 = (place(m) / 12) * 2 * Math.PI + 0.012;
    const a1 = ((place(m) + 1) / 12) * 2 * Math.PI - 0.012;
    const seg = svgEl('path', { d: arcPath(c, c, r, a0, a1), class: 'urd-cal-wheel-seg', fill: 'none', 'stroke-width': 40, role: 'button', tabindex: 0 });
    if (place(m) < place(today.getMonth())) seg.classList.add('urd-cal-wheel-past');
    if (m === today.getMonth()) seg.classList.add('urd-cal-wheel-now');
    seg.setAttribute('aria-label', dates().months[m]);
    seg.setAttribute('aria-pressed', m === picked ? 'true' : 'false');
    const pick = () => {
      picked = m;
      paintList();
      for (const [i, s] of segments.entries()) {
        s.classList.toggle('urd-cal-wheel-picked', i === picked);
        s.setAttribute('aria-pressed', i === picked ? 'true' : 'false');
      }
    };
    seg.addEventListener('click', pick);
    seg.addEventListener('keydown', (event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); pick(); } });
    svg.appendChild(seg);
    segments.push(seg);
    const [lx, ly] = polar(c, c, r + 42, (place(m) + 0.5) / 12 * 2 * Math.PI);
    // The month's name picks the month too; the ring segment is the button a screen reader and the keyboard reach.
    const text = svgEl('text', { x: lx.toFixed(1), y: (ly + 4).toFixed(1), class: 'urd-cal-wheel-month', 'text-anchor': 'middle', 'aria-hidden': 'true' });
    text.textContent = months[m];
    text.addEventListener('click', pick);
    svg.appendChild(text);
  }
  for (const occ of inYear) {
    const d = dayOf(occ);
    const dim = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    const angle = ((place(d.getMonth()) + (d.getDate() - 0.5) / dim) / 12) * 2 * Math.PI;
    const [x, y] = polar(c, c, r, angle);
    const dot = svgEl('circle', { cx: x.toFixed(1), cy: y.toFixed(1), r: 7, class: occ.start < today.getTime() ? 'urd-cal-wheel-dot urd-cal-wheel-dot-off' : 'urd-cal-wheel-dot', 'aria-hidden': 'true' });
    if (occ.color) dot.style.setProperty('--urd-cal-color', resolveColor(occ.color));
    svg.appendChild(dot);
  }
  const centre = ui.el('div', 'urd-cal-wheel-centre');
  const kicker = ui.el('span', 'urd-cal-wheel-kicker');
  kicker.appendChild(ui.tx('wheel'));
  centre.append(kicker, ui.field('strong', 'number', label, 'urd-cal-wheel-year'), ui.el('span', 'urd-cal-wheel-total', ui.tx('count', null, { n: inYear.length })));
  figure.append(svg, centre);
  const side = ui.el('div', 'urd-cal-wheel-side');
  const sideLabel = ui.el('span', 'urd-cal-wheel-label');
  const list = ui.el('div', 'urd-cal-wheel-list');
  const hint = ui.el('span', 'urd-cal-wheel-hint');
  hint.appendChild(ui.tx('pickMonth'));
  side.append(sideLabel, list, hint);
  const paintList = () => {
    sideLabel.textContent = dates().months[picked];
    list.replaceChildren();
    for (const occ of inYear.filter((o) => dayOf(o).getMonth() === picked)) {
      const d = dayOf(occ);
      const card = ui.tint(ui.el('div', 'urd-cal-wheel-card'), occ);
      const line = ui.el('strong');
      line.append(ui.field('span', 'date', ui.dayMonth(d), null, d), document.createTextNode(' · '), ui.field('span', 'title', occ.title));
      card.appendChild(line);
      const meta = ui.meta(occ, { date: false });
      if (meta) card.appendChild(meta);
      list.appendChild(card);
    }
    if (!list.children.length) list.appendChild(ui.el('p', 'urd-cal-wheel-none', ui.tx('monthNone')));
  };
  segments[picked].classList.add('urd-cal-wheel-picked');
  paintList();
  wrap.append(figure, side);
  host.appendChild(wrap);
}

/** F3 Heat map: the year as twelve small months, every day a cell shaded by its count, with a readout for the day under the pointer. */
export function heatmap(host, occs, props, ics, ui) {
  const today = ui.today();
  const year = today.getFullYear();
  const inYear = ui.all.filter((occ) => dayOf(occ).getFullYear() === year);
  const counts = new Map();
  for (const occ of inYear) {
    const d = dayOf(occ);
    const key = `${d.getMonth()}-${d.getDate()}`;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  const wrap = ui.el('div', 'urd-cal-heat');
  const head = ui.el('div', 'urd-cal-heat-head');
  const left = ui.el('div');
  const kicker = ui.el('span', 'urd-cal-heat-kicker');
  kicker.appendChild(ui.tx('wholeYear'));
  const total = document.createDocumentFragment();
  total.append(String(year), ' · ', ui.tx('count', null, { n: inYear.length }));
  left.append(kicker, ui.field('strong', 'number', total, 'urd-cal-heat-title'));
  const legend = ui.el('div', 'urd-cal-heat-legend');
  legend.appendChild(ui.tx('fewer'));
  for (let level = 0; level <= 3; level++) legend.appendChild(ui.el('i', `urd-cal-heat-cell urd-cal-heat-l${level}`));
  legend.appendChild(ui.tx('more'));
  head.append(left, legend);
  const months = ui.el('div', 'urd-cal-heat-months');
  const readout = ui.live(ui.el('div', 'urd-cal-heat-readout'));
  const readDate = ui.el('strong');
  const readText = ui.el('span');
  readout.append(readDate, readText);
  const show = (date) => {
    const todays = date ? onDay(inYear, date) : [];
    readDate.textContent = date ? ui.dateLine(date, true) : '';
    readText.replaceChildren();
    if (!date) readText.appendChild(ui.tx('pickDay'));
    else if (!todays.length) readText.appendChild(ui.tx('dayNone'));
    else {
      readText.append(ui.tx('count', null, { n: todays.length }), ': ');
      todays.forEach((occ, i) => {
        if (i) readText.appendChild(document.createTextNode(', '));
        readText.appendChild(ui.field('span', 'title', occ.title));
      });
    }
  };
  for (let m = 0; m < 12; m++) {
    const box = ui.el('div', 'urd-cal-heat-month');
    box.appendChild(ui.el('span', 'urd-cal-heat-mname', dates().months[m]));
    const grid = ui.el('div', 'urd-cal-heat-grid');
    const first = new Date(year, m, 1);
    const lead = ui.lead(first);
    const dim = new Date(year, m + 1, 0).getDate();
    for (let i = 0; i < lead; i++) grid.appendChild(ui.el('i', 'urd-cal-heat-cell urd-cal-heat-blank'));
    for (let d = 1; d <= dim; d++) {
      const n = counts.get(`${m}-${d}`) ?? 0;
      const level = n === 0 ? 0 : n === 1 ? 1 : n === 2 ? 2 : 3;
      const cell = ui.el('i', `urd-cal-heat-cell urd-cal-heat-l${level}`);
      const date = new Date(year, m, d);
      if (sameDay(date, today)) cell.classList.add('urd-cal-heat-today');
      cell.setAttribute('role', 'img');
      cell.setAttribute('aria-label', `${ui.dayMonth(date)}: ${tp('calendar.count', n)}`);
      cell.addEventListener('pointerenter', () => show(date));
      cell.addEventListener('focus', () => show(date));
      grid.appendChild(cell);
    }
    box.appendChild(grid);
    months.appendChild(box);
  }
  ui.dayGrid(months, '.urd-cal-heat-cell:not(.urd-cal-heat-blank)', { current: '.urd-cal-heat-today' });
  months.addEventListener('pointerleave', () => show(null));
  show(null);
  wrap.append(head, months, readout);
  host.appendChild(wrap);
}
