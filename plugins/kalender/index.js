/**
 * Kalender-referansepluginen (v0.6 M3): abonnerbar arrangementskalender fra
 * iCal-feeder (Google Calendar, Nextcloud, Outlook m.fl.), bygget etter
 * ApeironLF-designkravene. Dette er også REFERANSEN for plugin-forfattere:
 * manifest med provides, blokk med versjon/migrering, seksjonspreset,
 * egen CSS via én style-tag, og redigering i preview via urd-edit.
 *
 * Henting går ALLTID via sidens egen feed-proxy (/api/ics): feed-verter
 * sender ikke CORS, og sidens CSP tillater kun connect-src 'self', så
 * pluginen trenger ingen CSP-unntak. Lokalt uten functions vises
 * eksempeldata i forhåndsvisningen og en rolig tomtilstand hos besøkende.
 *
 * Visninger: liste (dato-badge-rader), kort, måned og «neste» (panel for
 * neste arrangement). Konvensjoner: «Kategori: Tittel» gir kategori-chips
 * med filter, og en påmeldingslenke i beskrivelsen blir en knapp.
 */
import {
  parseIcs, expandEvents, splitCategory, findSignupLink,
  normalizeSourceUrl, subscribeLinks,
} from './ics.js';
// Flerspråk (ADR-0012): t() for besøkende-tekster (site-språket), ta() for
// editor-chromen (admin-språket), dates() for måneds-/ukedagsnavn og tp()
// for flertall. Ordboka (locales/) lastes av plugin-lasteren FØR register()
// - t/ta kalles kun i render-/fabrikk-kropper, aldri på modulnivå.
import { t, ta, tp, taApiError, dates } from '/assets/urd/i18n.js';

const el2 = (tag, className, textContent) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (textContent != null) node.textContent = textContent;
  return node;
};

/* ---------- Henting (proxy + kort mellomlager) ---------- */

const CACHE_TTL = 10 * 60 * 1000;

async function fetchSource(url) {
  const key = `urd-kal-cache:${url}`;
  try {
    const cached = JSON.parse(sessionStorage.getItem(key) ?? 'null');
    if (cached && Date.now() - cached.t < CACHE_TTL) return cached.text;
  } catch { /* korrupt mellomlager ignoreres */ }
  const res = await fetch(`/api/ics?url=${encodeURIComponent(url)}`);
  if (!res.ok) {
    const detail = taApiError(await res.json().catch(() => null));
    throw new Error(detail ?? ta('kalender.edit.feedStatus', { status: res.status }));
  }
  const text = await res.text();
  try { sessionStorage.setItem(key, JSON.stringify({ t: Date.now(), text })); } catch { /* fullt lager er greit */ }
  return text;
}

/** Alle kilder → sorterte forekomster med kategori og påmeldingslenke. */
async function loadOccurrences(sources, limit) {
  const errors = [];
  const events = [];
  await Promise.all(sources.map(async (source) => {
    const url = normalizeSourceUrl(source);
    if (!url) { errors.push(ta('kalender.edit.unknownSource', { source })); return; }
    try {
      events.push(...parseIcs(await fetchSource(url)).events);
    } catch (error) {
      errors.push(`${url}: ${error.message}`);
    }
  }));
  const occurrences = expandEvents(events, { from: Date.now() - 6 * 3600 * 1000, max: Math.max(limit * 4, 120) })
    .map((occ) => {
      const { category, title } = splitCategory(occ.summary);
      return { ...occ, category, title, signup: findSignupLink(occ.description) };
    });
  return { occurrences, errors };
}

/* ---------- Eksempeldata (kun forhåndsvisning uten kilder/feed) ---------- */

function demoOccurrences() {
  const day = 24 * 3600 * 1000;
  const base = Date.now();
  return [
    { start: base + 3 * day, end: base + 3 * day + 2 * 3600 * 1000, allDay: false, title: ta('kalender.edit.demoTitle1'), category: ta('kalender.edit.demoCat1'), location: ta('kalender.edit.demoLoc1'), signup: null, description: '' },
    { start: base + 10 * day, end: base + 10 * day + 3600 * 1000, allDay: false, title: ta('kalender.edit.demoTitle2'), category: ta('kalender.edit.demoCat2'), location: ta('kalender.edit.demoLoc1'), signup: null, description: '' },
    { start: base + 17 * day, end: base + 17 * day, allDay: true, title: ta('kalender.edit.demoTitle3'), category: ta('kalender.edit.demoCat3'), location: ta('kalender.edit.demoLoc2'), signup: null, description: '' },
  ];
}

/* ---------- Formatering ---------- */

const two = (n) => String(n).padStart(2, '0');

function metaLine(occ) {
  const start = new Date(occ.start);
  const d = dates();
  const parts = [t('kalender.dateLine', {
    wd: d.weekdaysShort[(start.getDay() + 6) % 7],
    d: start.getDate(),
    m: d.monthsShort[start.getMonth()],
  })];
  if (!occ.allDay) parts.push(t('kalender.timeAt', { time: `${two(start.getHours())}:${two(start.getMinutes())}` }));
  if (occ.location) parts.push(occ.location);
  return parts.join(' · ');
}

function badgeNode(occ) {
  const start = new Date(occ.start);
  const badge = el2('div', 'urd-samling-badge');
  badge.append(el2('strong', null, String(start.getDate())), el2('span', null, dates().monthsShort[start.getMonth()]));
  return badge;
}

function chipNode(category) {
  return category ? el2('span', 'urd-kal-chip', category) : null;
}

function signupNode(occ) {
  if (!occ.signup) return null;
  const a = el2('a', 'urd-kal-signup', t('kalender.signup'));
  a.href = occ.signup;
  a.target = '_blank';
  a.rel = 'noopener';
  a.title = t('kalender.signupTitle');
  return a;
}

/* ---------- Visninger ---------- */

function renderList(host, occs) {
  const list = el2('div', 'urd-samling-list');
  for (const occ of occs) {
    const row = el2('article', 'urd-samling-row');
    row.appendChild(badgeNode(occ));
    const body = el2('div', 'urd-samling-body');
    const titleRow = el2('div', 'urd-kal-titlerow');
    titleRow.appendChild(el2('strong', 'urd-samling-title', occ.title));
    const chip = chipNode(occ.category);
    if (chip) titleRow.appendChild(chip);
    body.appendChild(titleRow);
    body.appendChild(el2('div', 'urd-kal-meta', metaLine(occ)));
    const signup = signupNode(occ);
    if (signup) body.appendChild(signup);
    row.appendChild(body);
    list.appendChild(row);
  }
  host.appendChild(list);
}

function renderCards(host, occs) {
  const grid = el2('div', 'urd-samling-cards');
  for (const occ of occs) {
    const card = el2('article', 'urd-samling-card');
    const top = el2('div', 'urd-kal-titlerow');
    top.appendChild(el2('span', 'urd-samling-date', metaLine(occ)));
    const chip = chipNode(occ.category);
    if (chip) top.appendChild(chip);
    card.appendChild(top);
    card.appendChild(el2('strong', 'urd-samling-title', occ.title));
    const excerpt = String(occ.description ?? '').split('\n')[0].slice(0, 140);
    if (excerpt) card.appendChild(el2('div', 'urd-samling-text', excerpt));
    const signup = signupNode(occ);
    if (signup) card.appendChild(signup);
    grid.appendChild(card);
  }
  host.appendChild(grid);
}

function renderNext(host, occs) {
  const occ = occs[0];
  if (!occ) return;
  const panel = el2('div', 'urd-kal-next');
  panel.appendChild(el2('div', 'urd-kal-next-label', t('kalender.next')));
  const row = el2('div', 'urd-kal-next-row');
  row.appendChild(badgeNode(occ));
  const body = el2('div', null);
  const titleRow = el2('div', 'urd-kal-titlerow');
  titleRow.appendChild(el2('strong', 'urd-kal-next-title', occ.title));
  const chip = chipNode(occ.category);
  if (chip) titleRow.appendChild(chip);
  body.appendChild(titleRow);
  body.appendChild(el2('div', 'urd-kal-meta', metaLine(occ)));
  const days = Math.max(0, Math.round((occ.start - Date.now()) / (24 * 3600 * 1000)));
  // Egne nøkler i stedet for Intl.RelativeTimeFormat: «I dag!»-stilen
  // beholdes, og nordsamisk mangler i ICU (ville falt til rått tall).
  body.appendChild(el2('div', 'urd-kal-next-count', days === 0 ? t('kalender.today') : days === 1 ? t('kalender.tomorrow') : tp('kalender.inDays', days)));
  const signup = signupNode(occ);
  if (signup) body.appendChild(signup);
  row.appendChild(body);
  panel.appendChild(row);
  host.appendChild(panel);
}

function renderMonth(host, occs) {
  const now = new Date();
  let shown = { y: now.getFullYear(), mo: now.getMonth() };

  const wrap = el2('div', 'urd-kal-month');
  const head = el2('div', 'urd-kal-month-head');
  const prev = el2('button', 'urd-kal-nav', '‹');
  prev.type = 'button';
  prev.setAttribute('aria-label', t('kalender.prevMonth'));
  const label = el2('strong', null, '');
  const next = el2('button', 'urd-kal-nav', '›');
  next.type = 'button';
  next.setAttribute('aria-label', t('kalender.nextMonth'));
  head.append(prev, label, next);
  const grid = el2('div', 'urd-kal-grid');
  wrap.append(head, grid);

  const paint = () => {
    label.textContent = `${dates().months[shown.mo]} ${shown.y}`;
    grid.replaceChildren();
    for (const day of dates().weekdaysShort) grid.appendChild(el2('div', 'urd-kal-dow', day));
    const first = new Date(shown.y, shown.mo, 1);
    const lead = (first.getDay() + 6) % 7;
    const dim = new Date(shown.y, shown.mo + 1, 0).getDate();
    const today = new Date();
    for (let i = 0; i < lead; i++) grid.appendChild(el2('div', 'urd-kal-day urd-kal-day-tom'));
    for (let d = 1; d <= dim; d++) {
      const cell = el2('div', 'urd-kal-day');
      if (d === today.getDate() && shown.mo === today.getMonth() && shown.y === today.getFullYear()) {
        cell.classList.add('urd-kal-idag');
      }
      cell.appendChild(el2('span', 'urd-kal-daynum', String(d)));
      const todays = occs.filter((occ) => {
        const s = new Date(occ.start);
        return s.getFullYear() === shown.y && s.getMonth() === shown.mo && s.getDate() === d;
      });
      for (const occ of todays.slice(0, 3)) {
        const pill = el2('div', 'urd-kal-pill', occ.title);
        pill.title = `${occ.title}\n${metaLine(occ)}`;
        cell.appendChild(pill);
      }
      if (todays.length > 3) cell.appendChild(el2('div', 'urd-kal-more', t('kalender.more', { n: todays.length - 3 })));
      grid.appendChild(cell);
    }
  };
  prev.addEventListener('click', () => { shown = shown.mo ? { ...shown, mo: shown.mo - 1 } : { y: shown.y - 1, mo: 11 }; paint(); });
  next.addEventListener('click', () => { shown = shown.mo < 11 ? { ...shown, mo: shown.mo + 1 } : { y: shown.y + 1, mo: 0 }; paint(); });
  paint();
  host.appendChild(wrap);
}

const VIEWS = { list: renderList, cards: renderCards, month: renderMonth, next: renderNext };

/* ---------- Abonner og kategori-filter ---------- */

function subscribeRow(sources) {
  const row = el2('div', 'urd-kal-subscribe');
  for (const source of sources) {
    const links = subscribeLinks(source);
    if (!links) continue;
    const webcal = el2('a', 'urd-kal-sub-btn', sources.length > 1 ? t('kalender.subscribeMulti') : t('kalender.subscribe'));
    webcal.href = links.webcal;
    webcal.title = t('kalender.subscribeTitle');
    row.appendChild(webcal);
    if (links.google) {
      const google = el2('a', 'urd-kal-sub-btn', t('kalender.addGoogle'));
      google.href = links.google;
      google.target = '_blank';
      google.rel = 'noopener';
      google.title = t('kalender.addGoogleTitle');
      row.appendChild(google);
    }
  }
  return row.children.length ? row : null;
}

function categoryRow(occs, active, onpick) {
  const categories = [...new Set(occs.map((occ) => occ.category).filter(Boolean))];
  if (categories.length < 2) return null;
  const row = el2('div', 'urd-kal-chips');
  const all = el2('button', 'urd-kal-chipbtn', t('kalender.all'));
  all.type = 'button';
  if (!active) all.classList.add('valgt');
  all.addEventListener('click', () => onpick(null));
  row.appendChild(all);
  for (const category of categories) {
    const btn = el2('button', 'urd-kal-chipbtn', category);
    btn.type = 'button';
    if (active === category) btn.classList.add('valgt');
    btn.addEventListener('click', () => onpick(category));
    row.appendChild(btn);
  }
  return row;
}

/* ---------- Kildepanel i forhåndsvisningen ---------- */

function post(msg) {
  window.parent?.postMessage(msg, location.origin);
}

/** Visning-id + etikett-NØKKEL (ta-oppslag ved bruk; aldri på modulnivå). */
const VIEW_NAMES = [['list', 'kalender.edit.viewList'], ['cards', 'kalender.edit.viewCards'], ['month', 'kalender.edit.viewMonth'], ['next', 'kalender.edit.viewNext']];

function configPanel(el, props, ctx) {
  const gear = el2('button', 'urd-kal-gear urd-cfg-toggle', `⚙ ${ta('kalender.edit.sources')}`);
  gear.type = 'button';
  gear.title = ta('kalender.edit.gearTitle');
  const panel = el2('div', 'urd-kal-config');

  const label = (text) => el2('label', 'urd-kal-config-label', text);
  const sources = document.createElement('textarea');
  sources.rows = 3;
  sources.placeholder = ta('kalender.edit.sourcesPh');
  sources.value = (props.sources ?? []).join('\n');

  // Visning: temastyrte segmentknapper (native select-popuper følger OS-temaet
  // og blir uleselige i mørke paneler).
  let chosenView = props.view ?? 'list';
  const viewSeg = el2('div', 'urd-kal-seg');
  const viewButtons = [];
  for (const [value, nameKey] of VIEW_NAMES) {
    const b = el2('button', null, ta(nameKey));
    b.type = 'button';
    if (value === chosenView) b.classList.add('valgt');
    b.addEventListener('click', () => {
      chosenView = value;
      for (const other of viewButtons) other.classList.remove('valgt');
      b.classList.add('valgt');
      syncLimitRow();
    });
    viewButtons.push(b);
    viewSeg.appendChild(b);
  }

  // Maks antall gjelder kun liste og kort; måned viser måneden og «neste» viser ett.
  const limitLabel = label(ta('lbl.maxCount'));
  const limit = document.createElement('input');
  limit.type = 'number';
  limit.min = '1';
  limit.max = '50';
  limit.value = String(props.limit ?? 6);
  const syncLimitRow = () => {
    const relevant = chosenView === 'list' || chosenView === 'cards';
    limitLabel.style.display = relevant ? '' : 'none';
    limit.style.display = relevant ? '' : 'none';
  };
  syncLimitRow();

  const check = (text, checked) => {
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.checked = checked;
    const wrap = el2('label', 'urd-kal-config-check');
    wrap.append(input, document.createTextNode(` ${text}`));
    return [wrap, input];
  };
  const [categoriesLabel, categories] = check(ta('kalender.edit.showCategories'), props.showCategories !== false);
  const [subscribeLabel, subscribe] = check(ta('kalender.edit.showSubscribe'), props.showSubscribe !== false);

  const apply = el2('button', 'urd-kal-apply', ta('common.apply'));
  apply.type = 'button';
  apply.addEventListener('click', () => {
    const nextProps = {
      sources: sources.value.split('\n').map((s) => s.trim()).filter(Boolean),
      view: chosenView,
      limit: Math.max(1, Math.min(50, Number(limit.value) || 6)),
      showCategories: categories.checked,
      showSubscribe: subscribe.checked,
    };
    post({ type: 'urd-edit', sectionId: ctx.section.id, blockId: el.dataset.blockId, props: nextProps, rerender: true });
    close();
  });

  panel.append(
    label(ta('kalender.edit.sources')), sources,
    label(ta('lbl.view')), viewSeg,
    limitLabel, limit,
    categoriesLabel, subscribeLabel, apply,
  );

  // Klikk utenfor panelet lukker det (klikk i panelet eller på knappen gjør ikke).
  const onOutside = (event) => {
    if (!panel.isConnected) { close(); return; }
    if (panel.contains(event.target) || event.target === gear) return;
    close();
  };
  function close() {
    panel.classList.remove('vis');
    document.removeEventListener('pointerdown', onOutside, true);
  }
  gear.addEventListener('click', (event) => {
    event.stopPropagation();
    if (panel.classList.toggle('vis')) {
      setTimeout(() => document.addEventListener('pointerdown', onOutside, true), 0);
    } else {
      close();
    }
  });
  return [gear, panel];
}

/* ---------- Autovekst (samme mønster som samling-blokken) ---------- */

function autoGrow(el, host, ctx) {
  const needed = host.scrollHeight;
  if (Math.abs(needed - el.clientHeight) > 8 && ctx.viewport !== 'mobile') {
    el.style.height = `${needed}px`;
    const sectionEl = el.closest('.urd-section');
    if (sectionEl) {
      const bottom = el.offsetTop + needed + 24;
      const current = Number.parseFloat(sectionEl.style.minHeight) || 0;
      if (bottom > current) sectionEl.style.minHeight = `${bottom}px`;
    }
    if (ctx.preview) {
      const block = ctx.section?.blocks?.find((b) => b.id === el.dataset.blockId);
      if (block && block.frames.desktop.h !== needed) {
        block.frames.desktop = { ...block.frames.desktop, h: needed };
        // KUN høyden meldes (urd-grow), aldri hele framen: ellers ville en
        // dratt blokk teleporteres tilbake til snapshotets gamle x/y.
        post({ type: 'urd-grow', sectionId: ctx.section.id, blockId: el.dataset.blockId, h: needed });
      }
    }
  }
}

/* ---------- Plugin-CSS: én style-tag, temafølgende tokens ---------- */

const KAL_CSS = `
.urd-kal { width: 100%; display: grid; gap: 12px; position: relative; }
.urd-kal-titlerow { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.urd-kal-meta { font-size: 0.85em; opacity: 0.7; }
.urd-kal-chip { font-size: 0.72em; padding: 2px 8px; border-radius: 999px;
  background: color-mix(in srgb, var(--urd-color-accent) 18%, transparent);
  border: 1px solid color-mix(in srgb, var(--urd-color-accent) 45%, transparent); }
.urd-kal-signup { display: inline-block; margin-top: 4px; font-size: 0.85em; font-weight: 600;
  color: var(--urd-color-accent); text-decoration: none; }
.urd-kal-signup:hover { text-decoration: underline; }
.urd-kal-chips { display: flex; gap: 6px; flex-wrap: wrap; }
.urd-kal-chipbtn { font: inherit; font-size: 0.78em; padding: 3px 10px; border-radius: 999px; cursor: pointer;
  color: inherit; background: transparent;
  border: 1px solid color-mix(in srgb, var(--urd-color-text) 25%, transparent); }
.urd-kal-chipbtn.valgt { background: var(--urd-color-accent); border-color: var(--urd-color-accent); color: #fff; }
.urd-kal-subscribe { display: flex; gap: 8px; flex-wrap: wrap; }
.urd-kal-sub-btn { font-size: 0.82em; padding: 5px 12px; border-radius: var(--urd-radius-sm);
  color: inherit; text-decoration: none;
  border: 1px solid color-mix(in srgb, var(--urd-color-text) 25%, transparent);
  background: var(--urd-color-surface); }
.urd-kal-sub-btn:hover { border-color: var(--urd-color-accent); }
.urd-kal-next { padding: 16px; border-radius: var(--urd-radius-md); background: var(--urd-color-surface);
  border: 1px solid color-mix(in srgb, var(--urd-color-text) 12%, transparent); }
.urd-kal-next-label { font-size: 0.72em; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
  opacity: 0.6; margin-bottom: 10px; }
.urd-kal-next-row { display: flex; gap: 14px; align-items: flex-start; }
.urd-kal-next-title { font-size: 1.15em; font-family: var(--urd-font-heading); }
.urd-kal-next-count { margin-top: 4px; font-size: 0.85em; font-weight: 600; color: var(--urd-color-accent); }
.urd-kal-month { display: grid; gap: 8px; }
.urd-kal-month-head { display: flex; align-items: center; justify-content: space-between; }
.urd-kal-nav { font: inherit; width: 30px; height: 30px; border-radius: 50%; cursor: pointer; color: inherit;
  background: var(--urd-color-surface); border: 1px solid color-mix(in srgb, var(--urd-color-text) 20%, transparent); }
.urd-kal-nav:hover { border-color: var(--urd-color-accent); }
.urd-kal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 3px; }
.urd-kal-dow { font-size: 0.7em; text-transform: uppercase; opacity: 0.55; text-align: center; padding: 2px 0; }
.urd-kal-day { min-height: 64px; padding: 4px; border-radius: var(--urd-radius-sm);
  background: color-mix(in srgb, var(--urd-color-surface) 70%, transparent);
  border: 1px solid color-mix(in srgb, var(--urd-color-text) 8%, transparent);
  display: grid; gap: 2px; align-content: start; }
.urd-kal-day-tom { background: transparent; border-color: transparent; }
.urd-kal-idag { border-color: var(--urd-color-accent); }
.urd-kal-daynum { font-size: 0.72em; opacity: 0.6; }
.urd-kal-pill { font-size: 0.68em; line-height: 1.25; padding: 2px 5px; border-radius: 4px;
  background: color-mix(in srgb, var(--urd-color-accent) 22%, transparent);
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.urd-kal-more { font-size: 0.66em; opacity: 0.6; }
.urd-kal-empty { opacity: 0.65; font-size: 0.9em; }
.urd-kal-note { font-size: 0.75em; opacity: 0.55; }
.urd-kal-tools { position: absolute; top: -32px; right: -6px; z-index: 5;
  display: flex; gap: 4px; align-items: center;
  /* Usynlig bro ned til blokk-kanten, så hover overlever veien opp */
  padding-bottom: 8px; }
.urd-kal-tools .urd-hint-chip { position: static; }
/* Config-bryteren er skjult: innstillingene åpnes fra blokkens Egenskaper
   (urd-cfg-toggle klikkes via urd-open-block-config). */
.urd-kal-gear { display: none; }
.urd-block:hover .urd-kal-gear, .urd-kal-gear:focus-visible,
.urd-kal:has(.urd-kal-config.vis) .urd-kal-gear { opacity: 0.92; pointer-events: auto; }
.urd-kal-config { position: absolute; top: 24px; right: 0; z-index: 6; width: min(340px, 90%);
  display: none; gap: 6px; padding: 12px; border-radius: 10px; background: #151a23; color: #e8eaf0;
  border: 1px solid rgb(255 255 255 / 18%); box-shadow: 0 12px 36px rgb(0 0 0 / 55%);
  font: 12px/1.4 system-ui, sans-serif; }
.urd-kal-config.vis { display: grid; }
.urd-kal-config-label { font-size: 10px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; opacity: 0.55; }
.urd-kal-config textarea, .urd-kal-config select, .urd-kal-config input[type='number'] {
  font: 12px/1.4 system-ui, sans-serif; color: inherit; background: rgb(255 255 255 / 6%);
  border: 1px solid rgb(255 255 255 / 20%); border-radius: 6px; padding: 5px 7px; min-width: 0; color-scheme: dark; }
.urd-kal-config-check { display: flex; align-items: center; gap: 6px; font-size: 12px; }
.urd-kal-seg { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 3px;
  padding: 2px; background: rgb(255 255 255 / 6%);
  border: 1px solid rgb(255 255 255 / 20%); border-radius: 6px; }
.urd-kal-seg button { font: 11px/1.2 system-ui, sans-serif; color: inherit; background: transparent;
  border: 0; border-radius: 4px; padding: 5px 4px; cursor: pointer; white-space: nowrap; }
.urd-kal-seg button:hover { background: rgb(255 255 255 / 10%); }
.urd-kal-seg button.valgt { background: #7c5cff; color: #fff; }
.urd-kal-apply { font: 600 12px/1 system-ui, sans-serif; padding: 7px 0; border-radius: 6px; cursor: pointer;
  color: #fff; background: #7c5cff; border: 0; }
body.urd-chrome-off .urd-kal-gear, body.urd-chrome-off .urd-kal-config { display: none !important; }
`;

function injectCss() {
  if (document.getElementById('urd-kalender-css')) return;
  const style = document.createElement('style');
  style.id = 'urd-kalender-css';
  style.textContent = KAL_CSS;
  document.head.appendChild(style);
}

/* ---------- Blokken ---------- */

function renderCalendar(el, props, ctx) {
  injectCss();
  const host = el2('div', 'urd-kal');
  el.appendChild(host);

  const sources = (props.sources ?? []).filter(Boolean);
  let activeCategory = null;

  const draw = (occurrences, note) => {
    host.replaceChildren();
    if (ctx.preview && ctx.viewport !== 'mobile') {
      const [gear, panel] = configPanel(el, props, ctx);
      // «?» og «⚙ Kilder» i samme rad øverst til høyre, klar av rotasjonshåndtaket.
      const tools = el2('div', 'urd-kal-tools');
      tools.appendChild(gear);
      host.append(tools, panel);
      // Hjelpechipen (ADR-0008): blokker med spesialfunksjoner forklarer seg selv.
      import('/assets/urd/hint.js').then(({ attachHint }) => {
        if (!host.isConnected || host.querySelector('.urd-hint-chip')) return;
        const chip = attachHint(tools, {
          title: ta('kalender.edit.hintTitle'),
          lines: [
            ta('kalender.edit.hint1'),
            ta('kalender.edit.hint2'),
            ta('kalender.edit.hint3'),
            ta('kalender.edit.hint4'),
            ta('kalender.edit.hint5'),
            ta('kalender.edit.hint6'),
            ta('kalender.edit.hint7'),
          ],
        });
        // «?» først, så «⚙ Kilder».
        tools.insertBefore(chip, tools.firstChild);
      });
    }
    const filtered = activeCategory
      ? occurrences.filter((occ) => occ.category === activeCategory)
      : occurrences;
    // Maks antall gjelder liste og kort; måneden viser sin måned og «neste» viser ett.
    const limited = (props.view === 'month' || props.view === 'next')
      ? filtered
      : filtered.slice(0, Math.max(1, props.limit ?? 6));
    const chips = props.showCategories === false ? null : categoryRow(occurrences, activeCategory, (category) => {
      activeCategory = category;
      draw(occurrences, note);
    });
    if (chips) host.appendChild(chips);
    if (!limited.length) {
      host.appendChild(el2('div', 'urd-kal-empty', t('kalender.empty')));
    } else {
      (VIEWS[props.view] ?? renderList)(host, limited);
    }
    if (props.showSubscribe !== false && sources.length) {
      const row = subscribeRow(sources);
      if (row) host.appendChild(row);
    }
    if (note) host.appendChild(el2('p', 'urd-kal-note', note));
    autoGrow(el, host, ctx);
  };

  if (!sources.length) {
    if (ctx.preview) {
      draw(demoOccurrences(), ta('kalender.edit.demoNote'));
    }
    return;
  }

  if (ctx.preview) draw([], null);
  loadOccurrences(sources, Math.max(1, props.limit ?? 6)).then(({ occurrences, errors }) => {
    if (!host.isConnected) return;
    if (!occurrences.length && errors.length) {
      // Besøkende får rolig tomtilstand; forhåndsvisningen får feilen.
      draw([], ctx.preview ? ta('kalender.edit.feedFailed', { error: errors[0] }) : null);
      return;
    }
    draw(occurrences, ctx.preview && errors.length ? ta('kalender.edit.sourceFailed', { error: errors[0] }) : null);
  });
}

/* ---------- «Hva skjer»-preset ---------- */

const presetId = () => {
  const bytes = crypto.getRandomValues(new Uint8Array(4));
  return 'blk-' + [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('');
};

function hvaSkjerSection() {
  return {
    id: 'sec-' + presetId().slice(4),
    version: 1,
    preset: 'hva-skjer',
    size: { minHeight: '520px' },
    grid: null,
    background: { version: 1, layers: [{ type: 'color', version: 1, props: { color: 'bg', opacity: 1 } }] },
    blocks: [
      {
        id: presetId(),
        type: 'text',
        version: 1,
        props: { html: ta('kalender.edit.seedTitle'), align: 'left', box: false },
        animation: null,
        frames: { desktop: { x: 6, y: 40, w: 60, h: 70, z: 1, rot: 0 }, mobile: null },
      },
      {
        id: presetId(),
        type: 'kalender',
        version: 1,
        props: { sources: [], view: 'list', limit: 5, showCategories: true, showSubscribe: true },
        animation: null,
        frames: { desktop: { x: 6, y: 130, w: 88, h: 320, z: 2, rot: 0 }, mobile: null },
      },
    ],
    responsive: { mobile: { mode: 'auto', attention: null } },
  };
}

/* ---------- Registrering ---------- */

/** @param {typeof window.Urd} Urd */
export function register(Urd) {
  Urd.blocks.define('kalender', {
    version: 1,
    autoGrow: true,
    label: 'Kalender',
    labelKey: 'kalender.edit.blockLabel',
    defaults: () => ({ sources: [], view: 'list', limit: 6, showCategories: true, showSubscribe: true }),
    // Foldemenyen i blokkmenyene: én variant per visning (generisk variants-felt).
    // labelKey løses av konsumentene (iframe-siden har plugin-ordboka).
    variants: VIEW_NAMES.map(([view, labelKey]) => ({ label: view, labelKey, props: { view } })),
    migrations: {},
    render: renderCalendar,
  });

  Urd.sections.define('hva-skjer', {
    label: 'Hva skjer',
    labelKey: 'kalender.edit.presetLabel',
    group: 'Kort og lister',
    hint: 'Arrangementsliste fra en abonnerbar kalender (iCal/Google)',
    hintKey: 'kalender.edit.presetHint',
    create: hvaSkjerSection,
  });
}
