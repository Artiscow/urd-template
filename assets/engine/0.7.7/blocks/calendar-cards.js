/**
 * The calendar block's card designs (milestone 0.7.19): six looks on the cards view, each a renderer over the block's ui helpers (fields, static texts, buttons; see makeUi in calendar.js) with its own rules in base.css under its own class names.
 * Loaded by the block on the first render of a block that uses one of them, never in the visitor closure.
 */
import { t, dates } from '../i18n.js';

const two = (n) => String(n).padStart(2, '0');
const dayOf = (occ) => new Date(occ.start);
const monthShort = (d) => dates().monthsShort[d.getMonth()];
const monthLong = (d) => dates().months[d.getMonth()];
const weekdayShort = (d) => dates().weekdaysShort[(d.getDay() + 6) % 7];
const weekday = (d) => dates().weekdays[(d.getDay() + 6) % 7];

/** 02 Poster wall: a wall of posters, the first one large, three poster colours in turn and a plain card as the fourth. */
export function posters(host, occs, props, ics, ui) {
  const wall = ui.el('div', 'urd-cal-posters');
  const tones = ['a', 'b', 'c', 'plain'];
  occs.forEach((occ, i) => {
    const d = dayOf(occ);
    const tone = i === 0 ? 'a' : tones[(i - 1) % 3 + 1];
    const card = ui.tint(ui.el('article', `urd-cal-poster urd-cal-poster-${tone}`), occ);
    if (i === 0) card.classList.add('urd-cal-poster-big');
    const top = ui.el('div', 'urd-cal-poster-top');
    if (occ.category) top.appendChild(ui.field('span', 'category', occ.category));
    if (occ.location) {
      if (top.childNodes.length) top.appendChild(document.createTextNode(' · '));
      top.appendChild(ui.field('span', 'place', occ.location));
    }
    const when = ui.el('div', 'urd-cal-poster-when');
    when.append(ui.field('strong', 'number', String(d.getDate()), null, d), ui.field('span', 'date', monthLong(d), null, d));
    const body = ui.el('div', 'urd-cal-poster-body');
    body.appendChild(ui.field('strong', 'title', occ.title, 'urd-cal-poster-title'));
    if (ui.hasTime(occ)) body.appendChild(ui.field('span', 'time', ui.timeText(occ), null, occ));
    const signup = ui.signup(occ);
    if (signup) body.appendChild(signup);
    card.append(top, when, body);
    wall.appendChild(card);
  });
  // The last tile leads to the whole programme, when the block has an address for it.
  const program = ui.program('urd-cal-poster urd-cal-poster-link');
  if (program) {
    program.appendChild(ui.el('span', 'urd-cal-poster-arrow', '→'));
    wall.appendChild(program);
  }
  host.appendChild(wall);
}

/** 03 Tickets: one ticket per event, the date and time on a torn-off stub, the sign-up at the right end. */
export function tickets(host, occs, props, ics, ui) {
  const list = ui.el('div', 'urd-cal-tickets');
  for (const occ of occs) {
    const d = dayOf(occ);
    const ticket = ui.tint(ui.el('article', 'urd-cal-ticket'), occ);
    const stub = ui.el('div', 'urd-cal-ticket-stub');
    stub.append(ui.field('strong', 'number', String(d.getDate()), null, d), ui.field('span', 'date', monthShort(d), null, d), ui.field('span', 'time', ui.timeText(occ), null, occ));
    const body = ui.el('div', 'urd-cal-ticket-body');
    const text = ui.el('div', 'urd-cal-ticket-text');
    text.appendChild(ui.field('strong', 'title', occ.title, 'urd-cal-ticket-title'));
    const meta = ui.el('div', 'urd-cal-meta');
    if (occ.location) meta.appendChild(ui.field('span', 'place', occ.location));
    if (occ.category) {
      if (meta.childNodes.length) meta.appendChild(document.createTextNode(' · '));
      meta.appendChild(ui.field('span', 'category', occ.category));
    }
    if (meta.childNodes.length) text.appendChild(meta);
    body.appendChild(text);
    const signup = ui.signup(occ);
    const open = signup ? null : ui.openToAll(occ);
    if (signup) body.appendChild(signup);
    else if (open) body.appendChild(open);
    ticket.append(stub, body);
    list.appendChild(ticket);
  }
  const program = ui.program('urd-cal-tickets-foot');
  if (program) list.appendChild(program);
  host.appendChild(list);
}

/** 06 Day carousel: tall day cards in a row that scrolls sideways with snap points and two arrow buttons. */
export function carousel(host, occs, props, ics, ui) {
  const wrap = ui.el('div', 'urd-cal-carousel');
  const nav = ui.el('div', 'urd-cal-carousel-nav');
  const prev = ui.el('button', 'urd-cal-nav', '‹');
  prev.type = 'button';
  prev.setAttribute('aria-label', t('calendar.scrollPrev'));
  const next = ui.el('button', 'urd-cal-nav', '›');
  next.type = 'button';
  next.setAttribute('aria-label', t('calendar.scrollNext'));
  nav.append(prev, next);
  const track = ui.el('div', 'urd-cal-carousel-track');
  occs.forEach((occ, i) => {
    const d = dayOf(occ);
    const card = ui.tint(ui.el('article', 'urd-cal-daycard'), occ);
    if (i === 0) card.classList.add('urd-cal-daycard-first');
    card.append(
      ui.field('span', 'date', weekday(d), 'urd-cal-daycard-wd', d),
      ui.field('strong', 'number', String(d.getDate()), 'urd-cal-daycard-day', d),
      ui.field('span', 'date', monthLong(d), 'urd-cal-daycard-month', d),
    );
    const body = ui.el('div', 'urd-cal-daycard-body');
    body.appendChild(ui.field('strong', 'title', occ.title, 'urd-cal-daycard-title'));
    const meta = ui.meta(occ, { date: false });
    if (meta) body.appendChild(meta);
    card.appendChild(body);
    const signup = ui.signup(occ);
    const chip = signup ? null : ui.chip(occ);
    if (signup) card.appendChild(signup);
    else if (chip) card.appendChild(chip);
    track.appendChild(card);
  });
  // One card at a time: the track scrolls by a card's width plus the gap.
  const step = () => (track.firstElementChild?.getBoundingClientRect().width ?? 220) + 14;
  prev.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
  next.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
  // A dot per card under the track: the one nearest the track's left edge is marked, and a dot scrolls to its card.
  const dots = ui.el('div', 'urd-cal-carousel-dots');
  const cards = [...track.children];
  cards.forEach((card, i) => {
    const dot = ui.el('button', 'urd-cal-carousel-dot');
    dot.type = 'button';
    dot.setAttribute('aria-label', occs[i].title);
    dot.addEventListener('click', () => track.scrollTo({ left: card.offsetLeft - track.offsetLeft, behavior: 'smooth' }));
    dots.appendChild(dot);
  });
  const mark = () => {
    const at = Math.round(track.scrollLeft / step());
    [...dots.children].forEach((dot, i) => {
      if (i === Math.min(at, cards.length - 1)) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
  };
  track.addEventListener('scroll', mark, { passive: true });
  mark();
  wrap.append(nav, track);
  if (cards.length > 1) wrap.appendChild(dots);
  host.appendChild(wrap);
}

/** 09 Picture cards: a picture from the event (an attachment or a picture link) with the date on it, the words under. */
export function photo(host, occs, props, ics, ui) {
  const grid = ui.el('div', 'urd-cal-photos');
  for (const occ of occs) {
    const d = dayOf(occ);
    const card = ui.tint(ui.el('article', 'urd-cal-photo'), occ);
    const band = ui.el('div', 'urd-cal-photo-band');
    const src = ui.image(occ);
    if (src) {
      const img = document.createElement('img');
      img.className = 'urd-cal-photo-img';
      img.alt = '';
      img.loading = 'lazy';
      img.decoding = 'async';
      // A picture the route refuses (a host not on the allowlist) leaves the plain band.
      img.addEventListener('error', () => img.remove());
      img.src = src;
      band.appendChild(img);
    }
    band.appendChild(ui.field('span', 'date', ui.dayMonth(d), 'urd-cal-photo-date', d));
    const chip = ui.chip(occ);
    if (chip) band.appendChild(chip);
    const body = ui.el('div', 'urd-cal-photo-body');
    body.appendChild(ui.field('strong', 'title', occ.title, 'urd-cal-photo-title'));
    const meta = ui.meta(occ, { date: false });
    if (meta) body.appendChild(meta);
    const signup = ui.signup(occ);
    if (signup) body.appendChild(signup);
    card.append(band, body);
    grid.appendChild(card);
  }
  host.appendChild(grid);
}

/** A6 Grid on cream: ApeironLF's cards on cream with a navy head, the day in gold and the category as a gold pill. */
export function apGrid(host, occs, props, ics, ui) {
  const grid = ui.el('div', 'urd-cal-apgrid');
  for (const occ of occs) {
    const d = dayOf(occ);
    const card = ui.tint(ui.el('article', 'urd-cal-apcard'), occ);
    const head = ui.el('div', 'urd-cal-apcard-head');
    const when = ui.el('span', 'urd-cal-apcard-when');
    when.append(ui.field('strong', 'number', two(d.getDate()), null, d), document.createTextNode(' '), ui.field('span', 'date', monthShort(d), null, d));
    head.appendChild(when);
    const chip = ui.chip(occ);
    if (chip) head.appendChild(chip);
    const rec = ui.recurring(occ);
    if (rec) head.appendChild(rec);
    const body = ui.el('div', 'urd-cal-apcard-body');
    body.appendChild(ui.field('strong', 'title', occ.title, 'urd-cal-apcard-title'));
    const when2 = ui.el('span', 'urd-cal-apcard-time');
    when2.appendChild(ui.field('span', 'date', weekdayShort(d), null, d));
    if (ui.hasTime(occ)) {
      when2.appendChild(document.createTextNode(' · '));
      when2.appendChild(ui.field('span', 'time', ui.time(occ), null, occ));
    }
    body.appendChild(when2);
    if (occ.location) body.appendChild(ui.field('span', 'place', occ.location, 'urd-cal-apcard-place'));
    const signup = ui.signup(occ);
    if (signup) body.appendChild(signup);
    card.append(head, body);
    grid.appendChild(card);
  }
  host.appendChild(grid);
}

/** The bento's mini month: the current month's days, the event days marked, today ringed. */
function miniMonth(ui) {
  const now = ui.today();
  const tile = ui.el('div', 'urd-cal-bento-tile urd-cal-bento-month');
  tile.appendChild(ui.el('span', 'urd-cal-bento-label', monthLong(now)));
  const grid = ui.el('div', 'urd-cal-bento-grid');
  const first = new Date(now.getFullYear(), now.getMonth(), 1);
  const lead = ui.lead(first);
  const dim = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const eventDays = new Set(ui.all
    .map((occ) => dayOf(occ))
    .filter((d) => d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth())
    .map((d) => d.getDate()));
  const firstEvent = ui.all.map((occ) => dayOf(occ)).find((d) => d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth());
  for (let i = 0; i < lead; i++) grid.appendChild(ui.el('span', 'urd-cal-bento-day urd-cal-bento-day-empty'));
  for (let day = 1; day <= dim; day++) {
    const cell = ui.el('span', 'urd-cal-bento-day');
    const mark = ui.el('i', null, String(day));
    if (day === now.getDate()) mark.classList.add('urd-cal-bento-today');
    else if (firstEvent && day === firstEvent.getDate()) mark.classList.add('urd-cal-bento-first');
    else if (eventDays.has(day)) mark.classList.add('urd-cal-bento-event');
    cell.appendChild(mark);
    grid.appendChild(cell);
  }
  tile.appendChild(grid);
  return tile;
}

/** A small bento tile for one event: the date line over the title and the time. */
function smallTile(occ, ui) {
  const d = dayOf(occ);
  const tile = ui.tint(ui.el('article', 'urd-cal-bento-tile urd-cal-bento-small'), occ);
  tile.appendChild(ui.field('span', 'date', ui.dateLine(d), 'urd-cal-bento-label', d));
  const body = ui.el('div');
  body.appendChild(ui.field('strong', 'title', occ.title, 'urd-cal-bento-title'));
  body.appendChild(ui.field('span', 'time', ui.timeText(occ), 'urd-cal-bento-sub', occ));
  tile.appendChild(body);
  return tile;
}

/** M1 Bento: a hero tile for the next event, small tiles, the month, a counter, the subscribe tile and a wide row. */
export function bento(host, occs, props, ics, ui) {
  const grid = ui.el('div', 'urd-cal-bento');
  const [hero, ...rest] = occs;
  const d = dayOf(hero);
  const heroTile = ui.tint(ui.el('article', 'urd-cal-bento-tile urd-cal-bento-hero'), hero);
  // The event's picture fills the hero tile, under a shade that keeps the words readable.
  const src = ui.image(hero, 1200);
  if (src) {
    const img = document.createElement('img');
    img.className = 'urd-cal-bento-hero-img';
    img.alt = '';
    img.decoding = 'async';
    // A picture the route refuses (a host not on the allowlist) leaves the plain tile.
    img.addEventListener('error', () => {
      img.remove();
      heroTile.classList.remove('urd-cal-bento-hero-pic');
    });
    img.src = src;
    heroTile.classList.add('urd-cal-bento-hero-pic');
    heroTile.appendChild(img);
  }
  const pill = ui.el('span', 'urd-cal-bento-pill');
  pill.appendChild(ui.tx('nextShort'));
  heroTile.append(pill, ui.el('span', 'urd-cal-bento-count', ui.countdown(hero)));
  const when = ui.el('div', 'urd-cal-bento-when');
  when.append(ui.field('strong', 'number', String(d.getDate()), null, d), ui.field('span', 'date', monthShort(d), null, d));
  heroTile.append(when, ui.field('strong', 'title', hero.title, 'urd-cal-bento-hero-title'));
  const meta = ui.meta(hero, { date: false });
  if (meta) heroTile.appendChild(meta);
  const signup = ui.signup(hero);
  if (signup) heroTile.appendChild(signup);
  grid.appendChild(heroTile);
  // Two small tiles beside the hero, then the month beside the counter and the subscribe tile.
  const smalls = rest.slice(0, 2);
  for (const occ of smalls) grid.appendChild(smallTile(occ, ui));
  grid.appendChild(miniMonth(ui));
  const now = ui.today();
  const inMonth = ui.all.filter((occ) => {
    const od = dayOf(occ);
    return od.getFullYear() === now.getFullYear() && od.getMonth() === now.getMonth();
  }).length;
  const counter = ui.el('div', 'urd-cal-bento-tile urd-cal-bento-counter');
  const label = ui.el('span', 'urd-cal-bento-label');
  label.appendChild(ui.tx('thisMonth'));
  counter.append(label, ui.field('strong', 'number', String(inMonth), 'urd-cal-bento-big'));
  grid.appendChild(counter);
  const sub = ui.subscribe();
  if (sub) {
    const tile = ui.el('div', 'urd-cal-bento-tile urd-cal-bento-subscribe');
    tile.appendChild(sub);
    grid.appendChild(tile);
  }
  // The rest as wide rows: the date, the words and the sign-up on one line.
  for (const occ of rest.slice(2)) {
    const od = dayOf(occ);
    const row = ui.tint(ui.el('article', 'urd-cal-bento-tile urd-cal-bento-row'), occ);
    const rw = ui.el('span', 'urd-cal-bento-row-when');
    rw.append(ui.field('strong', 'number', String(od.getDate()), null, od), ui.field('span', 'date', monthShort(od), null, od));
    const body = ui.el('div', 'urd-cal-bento-row-body');
    body.appendChild(ui.field('strong', 'title', occ.title, 'urd-cal-bento-title'));
    const rm = ui.meta(occ, { date: false });
    if (rm) body.appendChild(rm);
    row.append(rw, body);
    const rs = ui.signup(occ);
    if (rs) row.appendChild(rs);
    grid.appendChild(row);
  }
  host.appendChild(grid);
}

/* ---------- The cards of their own (`ownCard` in the design list), each run on the event's card by the block (ui.dressCard) ---------- */

/** The day of an event as a large number over its short month, for a card's own head; hidden from a screen reader, since the date line says the same in words. */
function cardDay(occ, ui, className, month = true) {
  const d = new Date(occ.start);
  const day = ui.el('span', className);
  day.setAttribute('aria-hidden', 'true');
  day.appendChild(ui.el('strong', null, String(d.getDate())));
  if (month) day.appendChild(ui.el('span', null, dates().monthsShort[d.getMonth()]));
  return day;
}

export const cards = {
  /** 03 Tickets: an admission ticket, the stub across the top with the day large beside the date line; the tear-off line above the buttons is base.css's. */
  tickets(dialog, occ, ui) {
    const stub = ui.el('div', 'urd-cal-tk-cardstub');
    stub.appendChild(cardDay(occ, ui, 'urd-cal-tk-cardday'));
    const date = dialog.querySelector('.urd-cal-dialog-date');
    if (date) {
      date.replaceWith(stub);
      stub.appendChild(date);
    } else {
      dialog.prepend(stub);
    }
  },
  /** 02 Poster wall: the card as a poster taped to the wall, the day large in the third poster colour over the date line. */
  posters(dialog, occ, ui) {
    dialog.querySelector('.urd-cal-dialog-date')?.before(cardDay(occ, ui, 'urd-cal-pw-cardday', false));
  },
};
