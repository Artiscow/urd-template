/**
 * Core block: calendar. A subscribable event calendar built from iCal feeds
 * (Google Calendar, Nextcloud, Outlook and others), following the ApeironLF
 * design requirements. Fetching ALWAYS goes through the site's own feed proxy
 * (/api/ics): feed hosts send no CORS, and the site's CSP allows connect-src
 * 'self' only. Locally, without functions, the preview shows demo data and
 * visitors get a quiet empty state.
 *
 * Views: list (date-badge rows), cards, month and next (a panel for the next
 * event). Conventions: "Category: Title" gives category chips with a filter,
 * and a signup link in the description becomes a button. The parser
 * (ics.js) is loaded on the first render, never in the visitor closure. The
 * sources, the view and the count are edited in the Properties panel; the
 * help chip (ADR-0008) explains the conventions.
 */
// t() for visitor texts (the site language), ta() for the editor chrome
// (the admin language), dates() for month and weekday names, tp() for
// plurals; never called at module level.
import { t, ta, tp, taApiError, dates, adminLocaleReady } from '../i18n.js';

const el2 = (tag, className, textContent) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (textContent != null) node.textContent = textContent;
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

/** All sources → sorted occurrences with category and signup link. */
async function loadOccurrences(ics, sources, limit) {
  const errors = [];
  const events = [];
  await Promise.all(sources.map(async (source) => {
    const url = ics.normalizeSourceUrl(source);
    if (!url) { errors.push(ta('calendar.unknownSource', { source })); return; }
    try {
      events.push(...ics.parseIcs(await fetchSource(url)).events);
    } catch (error) {
      errors.push(`${url}: ${error.message}`);
    }
  }));
  const occurrences = ics.expandEvents(events, { from: Date.now() - 6 * 3600 * 1000, max: Math.max(limit * 4, 120) })
    .map((occ) => {
      const { category, title } = ics.splitCategory(occ.summary);
      return { ...occ, category, title, signup: ics.findSignupLink(occ.description) };
    });
  return { occurrences, errors };
}

/* ---------- Demo data (preview only, when no sources or feed) ---------- */

function demoOccurrences() {
  const day = 24 * 3600 * 1000;
  const base = Date.now();
  return [
    { start: base + 3 * day, end: base + 3 * day + 2 * 3600 * 1000, allDay: false, title: ta('calendar.demoTitle1'), category: ta('calendar.demoCat1'), location: ta('calendar.demoLoc1'), signup: null, description: '' },
    { start: base + 10 * day, end: base + 10 * day + 3600 * 1000, allDay: false, title: ta('calendar.demoTitle2'), category: ta('calendar.demoCat2'), location: ta('calendar.demoLoc1'), signup: null, description: '' },
    { start: base + 17 * day, end: base + 17 * day, allDay: true, title: ta('calendar.demoTitle3'), category: ta('calendar.demoCat3'), location: ta('calendar.demoLoc2'), signup: null, description: '' },
  ];
}

/* ---------- Formatting ---------- */

const two = (n) => String(n).padStart(2, '0');

function metaLine(occ) {
  const start = new Date(occ.start);
  const d = dates();
  const parts = [t('calendar.dateLine', {
    wd: d.weekdaysShort[(start.getDay() + 6) % 7],
    d: start.getDate(),
    m: d.monthsShort[start.getMonth()],
  })];
  if (!occ.allDay) parts.push(t('calendar.timeAt', { time: `${two(start.getHours())}:${two(start.getMinutes())}` }));
  if (occ.location) parts.push(occ.location);
  return parts.join(' · ');
}

function badgeNode(occ) {
  const start = new Date(occ.start);
  const badge = el2('div', 'urd-collection-badge');
  badge.append(el2('strong', null, String(start.getDate())), el2('span', null, dates().monthsShort[start.getMonth()]));
  return badge;
}

function chipNode(category) {
  return category ? el2('span', 'urd-cal-chip', category) : null;
}

function signupNode(occ) {
  if (!occ.signup) return null;
  const a = el2('a', 'urd-cal-signup', t('calendar.signup'));
  a.href = occ.signup;
  a.target = '_blank';
  a.rel = 'noopener';
  a.title = t('calendar.signupTitle');
  return a;
}

/* ---------- Views ---------- */

function renderList(host, occs) {
  const list = el2('div', 'urd-collection-list');
  for (const occ of occs) {
    const row = el2('article', 'urd-collection-row');
    row.appendChild(badgeNode(occ));
    const body = el2('div', 'urd-collection-body');
    const titleRow = el2('div', 'urd-cal-titlerow');
    titleRow.appendChild(el2('strong', 'urd-collection-title', occ.title));
    const chip = chipNode(occ.category);
    if (chip) titleRow.appendChild(chip);
    body.appendChild(titleRow);
    body.appendChild(el2('div', 'urd-cal-meta', metaLine(occ)));
    const signup = signupNode(occ);
    if (signup) body.appendChild(signup);
    row.appendChild(body);
    list.appendChild(row);
  }
  host.appendChild(list);
}

function renderCards(host, occs) {
  const grid = el2('div', 'urd-collection-cards');
  for (const occ of occs) {
    const card = el2('article', 'urd-collection-card');
    const top = el2('div', 'urd-cal-titlerow');
    top.appendChild(el2('span', 'urd-collection-date', metaLine(occ)));
    const chip = chipNode(occ.category);
    if (chip) top.appendChild(chip);
    card.appendChild(top);
    card.appendChild(el2('strong', 'urd-collection-title', occ.title));
    const excerpt = String(occ.description ?? '').split('\n')[0].slice(0, 140);
    if (excerpt) card.appendChild(el2('div', 'urd-collection-text', excerpt));
    const signup = signupNode(occ);
    if (signup) card.appendChild(signup);
    grid.appendChild(card);
  }
  host.appendChild(grid);
}

function renderNext(host, occs) {
  const occ = occs[0];
  if (!occ) return;
  const panel = el2('div', 'urd-cal-next');
  panel.appendChild(el2('div', 'urd-cal-next-label', t('calendar.next')));
  const row = el2('div', 'urd-cal-next-row');
  row.appendChild(badgeNode(occ));
  const body = el2('div', null);
  const titleRow = el2('div', 'urd-cal-titlerow');
  titleRow.appendChild(el2('strong', 'urd-cal-next-title', occ.title));
  const chip = chipNode(occ.category);
  if (chip) titleRow.appendChild(chip);
  body.appendChild(titleRow);
  body.appendChild(el2('div', 'urd-cal-meta', metaLine(occ)));
  const days = Math.max(0, Math.round((occ.start - Date.now()) / (24 * 3600 * 1000)));
  // Dedicated keys instead of Intl.RelativeTimeFormat: the exclaiming
  // today wording is kept, and ICU has no North Sami (it would fall back to
  // a bare number).
  body.appendChild(el2('div', 'urd-cal-next-count', days === 0 ? t('calendar.today') : days === 1 ? t('calendar.tomorrow') : tp('calendar.inDays', days)));
  const signup = signupNode(occ);
  if (signup) body.appendChild(signup);
  row.appendChild(body);
  panel.appendChild(row);
  host.appendChild(panel);
}

function renderMonth(host, occs) {
  const now = new Date();
  let shown = { y: now.getFullYear(), mo: now.getMonth() };

  const wrap = el2('div', 'urd-cal-month');
  const head = el2('div', 'urd-cal-month-head');
  const prev = el2('button', 'urd-cal-nav', '‹');
  prev.type = 'button';
  prev.setAttribute('aria-label', t('calendar.prevMonth'));
  const label = el2('strong', null, '');
  const next = el2('button', 'urd-cal-nav', '›');
  next.type = 'button';
  next.setAttribute('aria-label', t('calendar.nextMonth'));
  head.append(prev, label, next);
  const grid = el2('div', 'urd-cal-grid');
  wrap.append(head, grid);

  const paint = () => {
    label.textContent = `${dates().months[shown.mo]} ${shown.y}`;
    grid.replaceChildren();
    for (const day of dates().weekdaysShort) grid.appendChild(el2('div', 'urd-cal-dow', day));
    const first = new Date(shown.y, shown.mo, 1);
    const lead = (first.getDay() + 6) % 7;
    const dim = new Date(shown.y, shown.mo + 1, 0).getDate();
    const today = new Date();
    for (let i = 0; i < lead; i++) grid.appendChild(el2('div', 'urd-cal-day urd-cal-day-empty'));
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
        const pill = el2('div', 'urd-cal-pill', occ.title);
        pill.title = `${occ.title}\n${metaLine(occ)}`;
        cell.appendChild(pill);
      }
      if (todays.length > 3) cell.appendChild(el2('div', 'urd-cal-more', t('calendar.more', { n: todays.length - 3 })));
      grid.appendChild(cell);
    }
  };
  prev.addEventListener('click', () => { shown = shown.mo ? { ...shown, mo: shown.mo - 1 } : { y: shown.y - 1, mo: 11 }; paint(); });
  next.addEventListener('click', () => { shown = shown.mo < 11 ? { ...shown, mo: shown.mo + 1 } : { y: shown.y + 1, mo: 0 }; paint(); });
  paint();
  host.appendChild(wrap);
}

const VIEWS = { list: renderList, cards: renderCards, month: renderMonth, next: renderNext };

/* ---------- Subscribe and category filter ---------- */

function subscribeRow(ics, sources) {
  const row = el2('div', 'urd-cal-subscribe');
  for (const source of sources) {
    const links = ics.subscribeLinks(source);
    if (!links) continue;
    const webcal = el2('a', 'urd-cal-sub-btn', sources.length > 1 ? t('calendar.subscribeMulti') : t('calendar.subscribe'));
    webcal.href = links.webcal;
    webcal.title = t('calendar.subscribeTitle');
    row.appendChild(webcal);
    if (links.google) {
      const google = el2('a', 'urd-cal-sub-btn', t('calendar.addGoogle'));
      google.href = links.google;
      google.target = '_blank';
      google.rel = 'noopener';
      google.title = t('calendar.addGoogleTitle');
      row.appendChild(google);
    }
  }
  return row.children.length ? row : null;
}

function categoryRow(occs, active, onpick) {
  const categories = [...new Set(occs.map((occ) => occ.category).filter(Boolean))];
  if (categories.length < 2) return null;
  const row = el2('div', 'urd-cal-chips');
  const all = el2('button', 'urd-cal-chipbtn', t('calendar.all'));
  all.type = 'button';
  if (!active) all.classList.add('selected');
  all.addEventListener('click', () => onpick(null));
  row.appendChild(all);
  for (const category of categories) {
    const btn = el2('button', 'urd-cal-chipbtn', category);
    btn.type = 'button';
    if (active === category) btn.classList.add('selected');
    btn.addEventListener('click', () => onpick(category));
    row.appendChild(btn);
  }
  return row;
}

/* ---------- The views' names (the variants in the block menus) ---------- */

/** View id + label KEY (looked up with ta at use time; never at module level). */
const VIEW_NAMES = [['list', 'calendar.viewList'], ['cards', 'calendar.viewCards'], ['month', 'calendar.viewMonth'], ['next', 'calendar.viewNext']];

/* ---------- The block ---------- */

function renderCalendar(el, props, ctx) {
  const host = el2('div', 'urd-cal');
  el.appendChild(host);
  import('../ics.js').then((ics) => {
    if (host.isConnected) drawCalendar(ics, el, host, props, ctx);
  });
}

function drawCalendar(ics, el, host, props, ctx) {
  const sources = (props.sources ?? []).filter(Boolean);
  let activeCategory = null;

  const draw = (occurrences, note) => {
    host.replaceChildren();
    if (ctx.preview && ctx.viewport !== 'mobile') {
      // Help chip (ADR-0008): the sources, the conventions and the subscribe buttons need explaining.
      Promise.all([import('../hint.js'), adminLocaleReady]).then(([{ attachHint }]) => {
        if (!el.isConnected || el.querySelector('.urd-hint-chip')) return;
        attachHint(el, {
          title: ta('hintCalendar.title'),
          lines: [
            ta('hintCalendar.l1'), ta('hintCalendar.l2'), ta('hintCalendar.l3'), ta('hintCalendar.l4'),
            ta('hintCalendar.l5'), ta('hintCalendar.l6'), ta('hintCalendar.l7'),
          ],
        });
      });
    }
    const filtered = activeCategory
      ? occurrences.filter((occ) => occ.category === activeCategory)
      : occurrences;
    // The max count applies to list and cards; month shows its month and next shows one.
    const limited = (props.view === 'month' || props.view === 'next')
      ? filtered
      : filtered.slice(0, Math.max(1, props.limit ?? 6));
    const chips = props.showCategories === false ? null : categoryRow(occurrences, activeCategory, (category) => {
      activeCategory = category;
      draw(occurrences, note);
    });
    if (chips) host.appendChild(chips);
    if (!limited.length) {
      host.appendChild(el2('div', 'urd-cal-empty', t('calendar.empty')));
    } else {
      (VIEWS[props.view] ?? renderList)(host, limited);
    }
    if (props.showSubscribe !== false && sources.length) {
      const row = subscribeRow(ics, sources);
      if (row) host.appendChild(row);
    }
    // The note is editing chrome on the block, not content: it hangs below
    // the block (base.css) and the push pass skips it, so it never makes the
    // block taller in the preview than on the published page.
    el.querySelector(':scope > .urd-cal-note')?.remove();
    if (note) el.appendChild(el2('p', 'urd-cal-note', note));
  };

  if (!sources.length) {
    // Demo data exists only in the preview, so it must not change the
    // block's height there: the published page shows the empty state at the
    // frame's height, and a taller demo would push the neighbours in the
    // preview alone. The block is marked so the push pass measures no
    // growth (render.js contentHeight), and the demo is clipped to the frame.
    if (ctx.preview) adminLocaleReady.then(() => {
      if (!host.isConnected) return;
      el.dataset.urdDemo = '1';
      host.style.maxHeight = '100%';
      host.style.overflow = 'hidden';
      draw(demoOccurrences(), ta('calendar.demoNote'));
    });
    return;
  }
  delete el.dataset.urdDemo;
  host.style.maxHeight = '';
  host.style.overflow = '';

  if (ctx.preview) draw([], null);
  loadOccurrences(ics, sources, Math.max(1, props.limit ?? 6)).then(({ occurrences, errors }) => {
    if (!host.isConnected) return;
    if (!occurrences.length && errors.length) {
      // Visitors get a quiet empty state; the preview gets the error.
      draw([], ctx.preview ? ta('calendar.feedFailed', { error: errors[0] }) : null);
      return;
    }
    draw(occurrences, ctx.preview && errors.length ? ta('calendar.sourceFailed', { error: errors[0] }) : null);
  });
}

export const calendarBlock = {
  version: 1,
  // Natural height in the mobile row grid; on the desktop the push pass owns the box.
  autoGrow: true,
  label: 'Calendar',
  labelKey: 'blocks.calendar',
  defaults: () => ({ sources: [], view: 'list', limit: 6, showCategories: true, showSubscribe: true }),
  // One variant per view: the editor's palette and the preview's block menu
  // list them as «Calendar: Month» and the like.
  variants: VIEW_NAMES.map(([view, labelKey]) => ({ label: view, labelKey, props: { view } })),
  migrations: {},
  render: renderCalendar,
};
