/**
 * The calendar block's designs: the pure model behind the Design picker and the Style tab, and the renderer's look-up, free of the DOM and of ta().
 * Notes: docs/engine-notes/calendar-designs.md (Urd repository).
 */

import { isSafeHref, resolveLink } from './nav-model.js';

/** The data views a design can stand on; `null` on a design means the block's own `view`. */
export const CAL_VIEWS = ['list', 'cards', 'month', 'agenda', 'next', 'week', 'day', 'year'];

/** The event fields whose look the owner can set per block (the Style tab's field styles). */
export const CAL_FIELDS = ['title', 'date', 'time', 'place', 'description', 'category', 'number'];

/**
 * Every word a design draws that is not calendar data, by the site dictionary key it falls back to; the owner's rewrites stand in `props.texts`.
 */
export const CAL_TEXTS = {
  next: 'calendar.next',
  now: 'calendar.now',
  later: 'calendar.later',
  all: 'calendar.all',
  signup: 'calendar.signup',
  subscribe: 'calendar.subscribe',
  subscribeMulti: 'calendar.subscribeMulti',
  addGoogle: 'calendar.addGoogle',
  colDate: 'calendar.colDate',
  colTime: 'calendar.colTime',
  colEvent: 'calendar.colEvent',
  colPlace: 'calendar.colPlace',
  program: 'calendar.program',
  nextShort: 'calendar.nextShort',
  thisMonth: 'calendar.thisMonth',
  todayBtn: 'calendar.todayBtn',
  wheel: 'calendar.wheel',
  wholeYear: 'calendar.wholeYear',
  fewer: 'calendar.fewer',
  more: 'calendar.moreLegend',
  pickDay: 'calendar.pickDay',
  then: 'calendar.then',
  unitDays: 'calendar.unitDays',
  unitHours: 'calendar.unitHours',
  unitMin: 'calendar.unitMin',
  browse: 'calendar.browse',
  untilStart: 'calendar.untilStart',
  wholeProgram: 'calendar.wholeProgram',
  noticeLabel: 'calendar.noticeLabel',
  noticeTitle: null,
  noticeText: null,
  moreInfo: 'calendar.moreInfo',
  readWhole: 'calendar.readWhole',
  series: 'calendar.series',
  when: 'calendar.when',
  where: 'calendar.where',
  forWhom: 'calendar.forWhom',
  openAll: 'calendar.openAll',
  allDates: 'calendar.allDates',
  emptyKicker: 'calendar.emptyKicker',
  emptyTitle: 'calendar.emptyTitle',
  swUpcoming: 'calendar.swUpcoming',
  swWeek: 'calendar.swWeek',
  swMonth: 'calendar.swMonth',
  recurring: 'calendar.recurring',
  organizer: 'calendar.organizer',
  moreAbout: 'calendar.moreAbout',
  openToAll: 'calendar.openToAll',
  join: 'calendar.join',
  addEvent: 'calendar.addEvent',
  addOne: 'calendar.addOne',
  addFile: 'calendar.addFile',
  addWhole: 'calendar.addWhole',
  icalAddress: 'calendar.icalAddress',
  onMap: 'calendar.onMap',
  moreN: 'calendar.more',
  count: 'calendar.count',
  todayCount: 'calendar.todayCount',
  nextN: 'calendar.nextN',
  today: 'calendar.today',
  tomorrow: 'calendar.tomorrow',
  inDays: 'calendar.inDays',
  cancelled: 'calendar.cancelled',
  allDay: 'calendar.allDay',
  until: 'calendar.until',
  timeAt: 'calendar.timeAt',
  countdownClock: 'calendar.countdownClock',
  weekN: 'calendar.weekN',
  range: 'calendar.range',
  earlier: 'calendar.earlier',
  showAll: 'calendar.showAll',
  showFewer: 'calendar.showFewer',
  noMatch: 'calendar.noMatch',
  dayNone: 'calendar.dayNone',
  monthNone: 'calendar.monthNone',
  unnamed: 'calendar.unnamed',
  zoneOf: 'calendar.zoneOf',
  zoneYours: 'calendar.zoneYours',
  cardNo: 'calendar.cardNo',
  updated: 'calendar.updated',
  colStatus: 'calendar.colStatus',
  rowHint: 'calendar.rowHint',
  countLabel: 'calendar.countLabel',
  colCategory: 'calendar.colCategory',
  period: 'calendar.period',
  venue: 'calendar.venue',
  admission: 'calendar.admission',
  admissionPrice: 'calendar.admissionPrice',
  thanks: 'calendar.thanks',
};

/** The texts with plural forms: the dictionary holds one key per form, and the owner's words are stored per form. */
export const CAL_PLURAL_TEXTS = ['count', 'todayCount', 'nextN', 'inDays', 'unitDays', 'unitHours', 'unitMin'];

/**
 * The texts that are content a design ships with; one the owner empties is stored as `false` and never drawn for a visitor.
 */
export const CAL_CONTENT_TEXTS = ['noticeLabel', 'noticeTitle', 'noticeText', 'emptyKicker', 'emptyTitle', 'series', 'forWhom', 'openAll', 'period', 'venue', 'admission', 'admissionPrice', 'thanks'];

/** The admin dictionary's hint for a text without words of its own, shown in the editor only. */
export const CAL_HINT_TEXTS = { noticeTitle: 'calendar.noticeTitleHint', noticeText: 'calendar.noticeTextHint' };

/** The placeholders a text may hold, by text: each stands for a value the design fills in (a number, a date, a time, a zone). */
export const CAL_TEXT_PARAMS = {
  moreAbout: ['name'],
  earlier: ['n'],
  showAll: ['n', 'm'],
  count: ['n'],
  moreN: ['n'],
  weekN: ['n'],
  todayCount: ['n'],
  nextN: ['n'],
  inDays: ['n'],
  until: ['date'],
  timeAt: ['time'],
  countdownClock: ['d', 'h', 'm'],
  range: ['from', 'to'],
  zoneOf: ['zone'],
  zoneYours: ['zone'],
  cardNo: ['n'],
  updated: ['time'],
};

/** The texts of the ApeironLF empty state (the designs with `empty: 'ap'`). */
const AP_EMPTY_TEXTS = ['emptyKicker', 'emptyTitle'];

/** The texts of the announcement note, for the designs that declare `notice`. */
const NOTICE_TEXTS = ['noticeLabel', 'noticeTitle', 'noticeText', 'readWhole', 'moreInfo'];

/** The texts of the event in full (the dialog a click on an event opens), in every design. */
const EVENT_TEXTS = ['when', 'where', 'organizer', 'moreAbout', 'join', 'addEvent', 'addOne', 'addFile', 'addWhole', 'icalAddress', 'onMap', 'recurring'];

/** The words of an event's time and of its countdown, wherever a design writes them. */
const TIME_TEXTS = ['cancelled', 'allDay', 'until', 'timeAt', 'today', 'tomorrow', 'inDays'];

/** The words the block draws around a design: the place filter, the search, the folds, the zone line, and the view switcher's week and month. */
const BLOCK_TEXTS = ['noMatch', 'earlier', 'showAll', 'showFewer', 'zoneOf', 'zoneYours', 'weekN', 'range', 'moreN', 'dayNone'];

/** The texts every design with chips, sign-up and subscribe buttons shows. */
const COMMON_TEXTS = ['all', 'signup', 'subscribe', 'subscribeMulti', 'addGoogle', 'swUpcoming', 'swWeek', 'swMonth', ...BLOCK_TEXTS, ...TIME_TEXTS, ...EVENT_TEXTS];

/**
 * The design families the picker groups by, in its order; the label key is `calendar.family.<id>`.
 */
export const CAL_FAMILIES = ['modern', 'next', 'ap', 'retro'];

/**
 * The dictionary key of a design's own theme word for a text, which the block draws in place of the common word.
 */
export function calThemeKey(designId, key) {
  return `calendar.theme.${designId}.${key}`;
}

/** The texts the block draws with the design's own words: the design's theme words while the owner keeps the design's word choice, else none. */
export function calThemeTexts(props) {
  const design = calDesign(props?.design);
  return calOptions(props).wordChoice === 'neutral' ? [] : (design.theme ?? []);
}

/**
 * True when a design that rewrites calendar data may do so: the shared option `rewrite`, on unless the owner switched it off.
 */
export function calRewrites(props) {
  return calOptions(props).rewrite !== false;
}

/** The designs by family, in the families' order: every design once, the plain design first in its family. */
export function calDesignFamilies() {
  return CAL_FAMILIES.map((family) => ({ family, labelKey: `calendar.family.${family}`, designs: CAL_DESIGNS.filter((d) => d.family === family) })).filter((f) => f.designs.length);
}

/**
 * How a design behaves on a phone: `fits` reads as it is, `flows` stacks its columns, and `switch` draws a phone design instead (calPhoneView).
 */
export const CAL_PHONE_MODES = ['fits', 'flows', 'switch'];

/**
 * The phone designs of their own: the neutral list the block draws itself (`agenda`), and the lists designs lend from their modules.
 * @type {Array<{id: string, labelKey: string, family: string, module?: string, home?: string, ownSubscribe?: boolean}>}
 */
export const CAL_PHONE_DESIGNS = [
  { id: 'agenda', labelKey: 'calendar.phone.agenda', family: 'neutral' },
  { id: 'depRows', labelKey: 'calendar.phone.depRows', family: 'retro', module: 'retro', home: 'departures', ownSubscribe: true },
  { id: 'depStrip', labelKey: 'calendar.phone.depStrip', family: 'retro', module: 'retro', home: 'departures', ownSubscribe: true },
  { id: 'marqueeRows', labelKey: 'calendar.phone.marqueeRows', family: 'retro', module: 'retro', home: 'marquee', ownSubscribe: true },
];

/** The views whose designs a block of another view can draw on a phone: the ones that list what is coming. */
const PHONE_ANY_VIEWS = ['list', 'cards', 'agenda', 'next'];

/** A design as an entry in the phone or card list: drawn as itself, in its own set, with its own options and words (`look` is the design whose look it is). */
const asEntry = (design) => ({ id: design.id, labelKey: design.labelKey, family: design.family, module: design.module, set: design.set, view: design.view, ownSubscribe: design.ownSubscribe === true, desktop: true, look: design.id });

/**
 * The phone designs a block can choose from: the neutral list, every design that reads on a phone and fits the block's view, and the ones designs lend.
 * @returns {Array<{id: string, labelKey: string, family: string, module?: string, set?: string, view?: string|null, home?: string, look?: string, ownSubscribe?: boolean, desktop?: boolean}>}
 */
export function calPhoneCandidates(props) {
  const view = calView(props);
  const designs = CAL_DESIGNS.filter((d) => d.phone !== 'switch' && (d.view === null || PHONE_ANY_VIEWS.includes(d.view) || d.view === view)).map(asEntry);
  const lent = CAL_PHONE_DESIGNS.slice(1).map((d) => ({ ...d, look: d.home }));
  return [CAL_PHONE_DESIGNS[0], ...designs, ...lent];
}

/** The phone design for an id among the block's candidates; the one the block draws (calPhoneView) for anything unknown. */
export function calPhoneDesignDef(id, props) {
  const candidates = calPhoneCandidates(props);
  return candidates.find((d) => d.id === id) ?? candidates.find((d) => d.id === calPhoneView(props)) ?? candidates[0];
}

/** A list of designs by family in the picker's order: the neutral ones, the shared cards, then the design families. */
function byFamily(list) {
  return ['neutral', 'sets', ...CAL_FAMILIES].map((family) => ({ family, labelKey: `calendar.family.${family}`, designs: list.filter((d) => d.family === family) })).filter((f) => f.designs.length);
}

/** The block's phone designs by family, in the picker's order (the neutral ones first). */
export function calPhoneFamilies(props) {
  return byFamily(calPhoneCandidates(props));
}

/**
 * The phone design a block draws: the owner's `phoneView` among its candidates, else the design's `phoneDefault`, else the design itself or the neutral list.
 * @returns {string} An id among calPhoneCandidates
 */
export function calPhoneView(props) {
  const design = calDesign(props?.design);
  const fallback = design.phoneDefault ?? (design.phone === 'switch' ? 'agenda' : design.id);
  const stored = props?.phoneView === 'self' || (!props?.phoneView && props?.phoneDesign === false) ? design.id : props?.phoneView;
  if (stored && calPhoneCandidates(props).some((d) => d.id === stored)) return stored;
  return fallback;
}

/**
 * The card designs of their own: the neutral card in the calendar's own set, and the decorators designs lend under their module's `cards`.
 * @type {Array<{id: string, labelKey: string, family: string, module?: string, home?: string}>}
 */
export const CAL_CARD_DESIGNS = [
  { id: 'neutral', labelKey: 'calendar.cardDesign.neutral', family: 'neutral' },
  { id: 'depHead', labelKey: 'calendar.cardDesign.depHead', family: 'retro', module: 'retro', home: 'departures' },
  { id: 'depTitle', labelKey: 'calendar.cardDesign.depTitle', family: 'retro', module: 'retro', home: 'departures' },
  { id: 'depScreen', labelKey: 'calendar.cardDesign.depScreen', family: 'retro', module: 'retro', home: 'departures' },
];

/**
 * The cards shared by colour set: one for each set that two or more designs without a card of their own share (`set-<set>`, family `sets`).
 */
function setCards() {
  const bySet = new Map();
  for (const design of CAL_DESIGNS.filter((d) => !d.ownCard)) bySet.set(design.set, [...(bySet.get(design.set) ?? []), design]);
  return [...bySet].filter(([, designs]) => designs.length > 1).map(([set, designs]) => ({ id: `set-${set}`, labelKey: `calendar.cardSet.${set}`, family: 'sets', set, setCard: true, designs: designs.map((d) => d.id) }));
}

/** The set card a design without a card of its own wears, when its set is shared; null else. */
function setCardOf(design) {
  return design.ownCard ? null : setCards().find((card) => card.set === design.set) ?? null;
}

/**
 * The card designs a block can choose from: the neutral card, the shared set cards, every design's own card and the cards designs lend.
 * @returns {Array<{id: string, labelKey: string, family: string, module?: string, set?: string, home?: string, look?: string, desktop?: boolean, setCard?: boolean, designs?: string[]}>}
 */
export function calCardCandidates() {
  const shared = setCards();
  const own = CAL_DESIGNS.filter((d) => d.ownCard || !shared.some((card) => card.set === d.set)).map((d) => ({ ...asEntry(d), module: d.ownCard ? d.module : undefined }));
  const lent = CAL_CARD_DESIGNS.slice(1).map((d) => ({ ...d, look: d.home, set: calDesign(d.home).set }));
  return [CAL_CARD_DESIGNS[0], ...shared, ...own, ...lent];
}

/** The card design for an id; the neutral card for anything unknown. */
export function calCardDesignDef(id) {
  const candidates = calCardCandidates();
  return candidates.find((d) => d.id === id) ?? candidates[0];
}

/** The card designs by family, in the picker's order (the neutral one first, the shared ones next). */
export function calCardFamilies() {
  return byFamily(calCardCandidates());
}

/**
 * The card design a block's card wears: the owner's `card` when listed, else the design's `cardDefault`, else its own card or its set's.
 * @returns {string} An id among calCardCandidates
 */
export function calCardDesign(props) {
  const candidates = calCardCandidates();
  const stored = props?.card;
  if (stored && candidates.some((d) => d.id === stored)) return stored;
  const storedDesign = stored && CAL_DESIGNS.find((d) => d.id === stored);
  if (storedDesign) return setCardOf(storedDesign)?.id ?? storedDesign.id;
  const design = calDesign(props?.design);
  return design.cardDefault ?? setCardOf(design)?.id ?? design.id;
}

/**
 * How the card wears its design: the set it is drawn in, its card classes, and whether the owner's calendar colours reach it.
 * @returns {{set: string, classes: string[], ownColours: boolean}}
 */
export function calCardDress(props) {
  const design = calDesign(props?.design);
  const id = calCardDesign(props);
  if (id === 'neutral') return { set: design.set, classes: [], ownColours: true };
  const def = calCardDesignDef(id);
  if (def.setCard) return { set: def.set, classes: [], ownColours: design.set === def.set };
  const look = calDesign(def.look);
  return { set: look.set, classes: def.desktop ? [`urd-cal-dlg-${look.id}`] : [`urd-cal-dlg-${look.id}`, `urd-cal-dlg-${id}`], ownColours: look.id === design.id };
}

/** A colour slot: the label key is `calendar.slot.<key>`, the section groups the pickers in the panel. */
const slot = (key, section = 'colors') => ({ key, labelKey: `calendar.slot.${key}`, section });

/**
 * The designs, in the order the picker lists them, each with its view, renderer module, colour slots, texts, colour set and flags.
 * @type {Array<{id: string, labelKey: string, view: string|null, module?: string, family: string, phone: string, stripe: boolean, theme?: string[], rewrites?: boolean, limit?: number, slots: Array<{key: string, labelKey: string, section: string}>, texts: string[]}>}
 */
export const CAL_DESIGNS = [
  {
    id: 'plain',
    labelKey: 'calendar.design.plain',
    set: 'theme',
    family: 'modern',
    phone: 'fits',
    view: null,
    stripe: false,
    slots: [slot('accent'), slot('surface'), slot('line'), slot('chip')],
    texts: ['next', 'now', 'later', ...COMMON_TEXTS],
  },
  {
    id: 'timeline',
    labelKey: 'calendar.design.timeline',
    set: 'theme',
    family: 'modern',
    phone: 'fits',
    view: 'list',
    module: 'list',
    stripe: false,
    slots: [slot('accent'), slot('dot'), slot('line'), slot('chip')],
    texts: COMMON_TEXTS,
  },
  {
    id: 'table',
    labelKey: 'calendar.design.table',
    set: 'theme',
    family: 'modern',
    phone: 'switch',
    view: 'list',
    module: 'list',
    stripe: false,
    slots: [slot('accent'), slot('head'), slot('headText'), slot('zebra'), slot('line'), slot('chip')],
    texts: ['colDate', 'colTime', 'colEvent', 'colPlace', ...COMMON_TEXTS],
  },
  {
    id: 'booklet',
    labelKey: 'calendar.design.booklet',
    ownCard: true,
    set: 'poster',
    family: 'modern',
    phone: 'fits',
    excerpt: true,
    view: 'list',
    module: 'list',
    stripe: false,
    slots: [slot('accent'), slot('surface'), slot('rule'), slot('chip')],
    texts: ['program', ...COMMON_TEXTS],
  },
  {
    id: 'numbered',
    labelKey: 'calendar.design.numbered',
    set: 'poster',
    family: 'modern',
    phone: 'fits',
    view: 'list',
    module: 'list',
    stripe: false,
    slots: [slot('accent'), slot('number'), slot('line'), slot('chip')],
    texts: ['count', ...COMMON_TEXTS],
  },
  {
    id: 'apList',
    labelKey: 'calendar.design.apList',
    set: 'apNavy',
    family: 'ap',
    phone: 'fits',
    empty: 'ap',
    view: 'list',
    module: 'list',
    stripe: false,
    slots: [slot('row'), slot('text'), slot('gold'), slot('line'), slot('rec')],
    texts: [...AP_EMPTY_TEXTS, ...COMMON_TEXTS],
  },
  {
    id: 'glass',
    labelKey: 'calendar.design.glass',
    ownCard: true,
    set: 'lightGlass',
    family: 'modern',
    phone: 'fits',
    view: 'list',
    module: 'list',
    stripe: false,
    slots: [slot('ground'), slot('text'), slot('glass', 'glass'), slot('glassLine', 'glass'), slot('chip', 'glass'), slot('blobA', 'blobs'), slot('blobB', 'blobs'), slot('blobC', 'blobs')],
    texts: COMMON_TEXTS,
  },
  {
    id: 'posters',
    labelKey: 'calendar.design.posters',
    ownCard: true,
    set: 'poster',
    family: 'modern',
    phone: 'flows',
    view: 'cards',
    module: 'cards',
    stripe: false,
    program: true,
    slots: [slot('accent'), slot('surface'), slot('line'), slot('posterA', 'posters'), slot('posterAText', 'posters'), slot('posterB', 'posters'), slot('posterBText', 'posters'), slot('posterC', 'posters'), slot('posterCText', 'posters')],
    texts: ['wholeProgram', ...COMMON_TEXTS],
  },
  {
    id: 'tickets',
    labelKey: 'calendar.design.tickets',
    ownCard: true,
    set: 'theme',
    family: 'modern',
    phone: 'flows',
    view: 'cards',
    module: 'cards',
    stripe: false,
    program: true,
    open: true,
    slots: [slot('accent'), slot('surface'), slot('line'), slot('stub', 'stub'), slot('stubText', 'stub')],
    texts: ['wholeProgram', 'openToAll', ...COMMON_TEXTS],
  },
  {
    id: 'carousel',
    labelKey: 'calendar.design.carousel',
    set: 'theme',
    family: 'modern',
    phone: 'fits',
    view: 'cards',
    module: 'cards',
    stripe: false,
    slots: [slot('accent'), slot('surface'), slot('line'), slot('chip'), slot('card', 'first'), slot('cardText', 'first')],
    texts: COMMON_TEXTS,
  },
  {
    id: 'photo',
    labelKey: 'calendar.design.photo',
    set: 'theme',
    family: 'modern',
    phone: 'flows',
    view: 'cards',
    module: 'cards',
    stripe: false,
    slots: [slot('accent'), slot('surface'), slot('line'), slot('placeholder'), slot('badge', 'onPicture'), slot('badgeText', 'onPicture'), slot('chip', 'onPicture')],
    texts: COMMON_TEXTS,
  },
  {
    id: 'apGrid',
    labelKey: 'calendar.design.apGrid',
    set: 'apCream',
    family: 'ap',
    phone: 'flows',
    empty: 'ap',
    view: 'cards',
    module: 'cards',
    stripe: false,
    slots: [slot('head'), slot('card'), slot('text'), slot('gold'), slot('rec')],
    texts: [...AP_EMPTY_TEXTS, ...COMMON_TEXTS],
  },
  {
    id: 'bento',
    labelKey: 'calendar.design.bento',
    set: 'bento',
    family: 'modern',
    phone: 'flows',
    view: 'cards',
    module: 'cards',
    stripe: false,
    ownSubscribe: true,
    slots: [slot('accent'), slot('soft'), slot('tile'), slot('line'), slot('hero', 'hero'), slot('heroText', 'hero')],
    texts: ['nextShort', 'thisMonth', ...COMMON_TEXTS],
  },
  {
    id: 'weekStrip',
    labelKey: 'calendar.design.weekStrip',
    set: 'theme',
    family: 'modern',
    phone: 'flows',
    view: 'week',
    module: 'time',
    stripe: false,
    slots: [slot('accent'), slot('surface'), slot('line'), slot('todayBg'), slot('pill'), slot('pillText')],
    texts: COMMON_TEXTS,
  },
  {
    id: 'weekPlan',
    labelKey: 'calendar.design.weekPlan',
    set: 'theme',
    family: 'modern',
    phone: 'flows',
    view: 'week',
    module: 'time',
    stripe: true,
    slots: [slot('accent'), slot('surface'), slot('line'), slot('todayBg'), slot('event')],
    texts: ['todayBtn', ...COMMON_TEXTS],
  },
  {
    id: 'layers',
    labelKey: 'calendar.design.layers',
    set: 'theme',
    family: 'modern',
    phone: 'flows',
    view: 'week',
    module: 'time',
    stripe: false,
    ownFilter: true,
    slots: [slot('accent'), slot('surface'), slot('line'), slot('todayBg')],
    texts: ['unnamed', ...COMMON_TEXTS],
  },
  {
    id: 'sidepanel',
    labelKey: 'calendar.design.sidepanel',
    set: 'theme',
    family: 'modern',
    phone: 'flows',
    view: 'month',
    module: 'time',
    stripe: false,
    slots: [slot('accent'), slot('surface'), slot('panel'), slot('line'), slot('todayBg'), slot('selected'), slot('chip')],
    texts: COMMON_TEXTS,
  },
  {
    id: 'apMonth',
    labelKey: 'calendar.design.apMonth',
    set: 'apCream',
    family: 'ap',
    phone: 'flows',
    empty: 'ap',
    view: 'month',
    module: 'time',
    stripe: false,
    slots: [slot('card'), slot('text'), slot('gold'), slot('goldDark'), slot('grid'), slot('pill')],
    texts: [...AP_EMPTY_TEXTS, ...COMMON_TEXTS],
  },
  {
    id: 'dayPlan',
    labelKey: 'calendar.design.dayPlan',
    set: 'theme',
    family: 'modern',
    phone: 'fits',
    view: 'day',
    module: 'time',
    stripe: true,
    slots: [slot('accent'), slot('surface'), slot('line'), slot('past'), slot('event')],
    texts: ['todayBtn', 'todayCount', 'count', ...COMMON_TEXTS],
  },
  {
    id: 'yearWheel',
    labelKey: 'calendar.design.yearWheel',
    set: 'theme',
    family: 'modern',
    phone: 'fits',
    view: 'year',
    module: 'time',
    stripe: false,
    slots: [slot('accent'), slot('surface'), slot('line'), slot('ring', 'wheel'), slot('past', 'wheel'), slot('dot', 'wheel'), slot('dotOff', 'wheel')],
    texts: ['wheel', 'count', 'monthNone', ...COMMON_TEXTS],
  },
  {
    id: 'heatmap',
    labelKey: 'calendar.design.heatmap',
    set: 'theme',
    family: 'modern',
    phone: 'switch',
    view: 'year',
    module: 'time',
    stripe: false,
    slots: [slot('surface'), slot('panel'), slot('line'), slot('cell0', 'scale'), slot('cell1', 'scale'), slot('cell2', 'scale'), slot('cell3', 'scale'), slot('today', 'scale')],
    texts: ['wholeYear', 'fewer', 'more', 'pickDay', 'count', ...COMMON_TEXTS],
  },
  {
    id: 'billboard',
    labelKey: 'calendar.design.billboard',
    ownCard: true,
    set: 'board',
    family: 'next',
    phone: 'fits',
    view: 'next',
    module: 'next',
    stripe: false,
    ownSubscribe: true,
    program: true,
    slots: [slot('bg'), slot('text'), slot('label'), slot('pulse'), slot('tile', 'countdown'), slot('tileText', 'countdown'), slot('button', 'buttons'), slot('buttonText', 'buttons')],
    texts: ['now', 'then', 'unitDays', 'unitHours', 'unitMin', 'wholeProgram', ...COMMON_TEXTS],
  },
  {
    id: 'stacked',
    labelKey: 'calendar.design.stacked',
    set: 'theme',
    family: 'next',
    phone: 'fits',
    view: 'next',
    module: 'next',
    stripe: false,
    slots: [slot('accent'), slot('surface'), slot('line'), slot('card', 'cards'), slot('cardText', 'cards'), slot('cardMid', 'cards'), slot('cardBack', 'cards'), slot('badge', 'cards'), slot('badgeText', 'cards')],
    texts: ['now', 'browse', 'nextN', ...COMMON_TEXTS],
  },
  {
    id: 'noticeboard',
    labelKey: 'calendar.design.noticeboard',
    ownCard: true,
    set: 'cork',
    family: 'next',
    phone: 'fits',
    view: 'next',
    module: 'next',
    stripe: false,
    notice: true,
    slots: [slot('board'), slot('boardText'), slot('note', 'notes'), slot('noteText', 'notes'), slot('noteLabel', 'notes'), slot('noteAlt', 'notes'), slot('noteAltText', 'notes'), slot('pin', 'notes'), slot('pinAlt', 'notes'), slot('button', 'buttons'), slot('buttonText', 'buttons'), slot('strip', 'later'), slot('stripText', 'later')],
    texts: ['now', 'next', 'later', ...NOTICE_TEXTS, ...COMMON_TEXTS],
  },
  {
    id: 'split',
    labelKey: 'calendar.design.split',
    set: 'theme',
    family: 'next',
    phone: 'fits',
    excerpt: true,
    view: 'next',
    module: 'next',
    stripe: false,
    slots: [slot('accent'), slot('surface'), slot('line'), slot('chip'), slot('panel', 'panel'), slot('panelText', 'panel'), slot('button', 'buttons'), slot('buttonText', 'buttons'), slot('laterBg', 'later')],
    texts: ['now', 'later', ...COMMON_TEXTS],
  },
  {
    id: 'band',
    labelKey: 'calendar.design.band',
    set: 'theme',
    family: 'next',
    phone: 'fits',
    view: 'next',
    module: 'next',
    stripe: false,
    slots: [slot('band', 'band'), slot('bandText', 'band'), slot('dot', 'band'), slot('tag', 'band'), slot('tagText', 'band')],
    texts: ['now', ...COMMON_TEXTS],
  },
  {
    id: 'oneLine',
    labelKey: 'calendar.design.oneLine',
    set: 'theme',
    family: 'next',
    phone: 'fits',
    view: 'next',
    module: 'next',
    stripe: true,
    slots: [slot('accent'), slot('surface'), slot('line'), slot('ring'), slot('button', 'buttons'), slot('buttonText', 'buttons')],
    texts: ['now', 'later', ...COMMON_TEXTS],
  },
  {
    id: 'ring',
    labelKey: 'calendar.design.ring',
    set: 'theme',
    family: 'next',
    phone: 'fits',
    view: 'next',
    module: 'next',
    stripe: false,
    slots: [slot('surface'), slot('line'), slot('chip'), slot('accent', 'ring'), slot('track', 'ring')],
    texts: ['now', 'unitDays', 'unitHours', ...COMMON_TEXTS],
  },
  {
    id: 'darkGlass',
    labelKey: 'calendar.design.darkGlass',
    ownCard: true,
    set: 'darkGlass',
    family: 'next',
    phone: 'fits',
    view: 'next',
    module: 'next',
    stripe: false,
    ownSubscribe: true,
    slots: [slot('ground'), slot('text'), slot('label'), slot('edge', 'glass'), slot('glass', 'glass'), slot('track', 'glass'), slot('blobA', 'blobs'), slot('blobB', 'blobs'), slot('button', 'buttons'), slot('buttonText', 'buttons')],
    texts: ['now', 'then', 'untilStart', 'countdownClock', ...COMMON_TEXTS],
  },
  {
    id: 'nextBento',
    labelKey: 'calendar.design.nextBento',
    set: 'bento',
    family: 'next',
    phone: 'fits',
    view: 'next',
    module: 'next',
    stripe: false,
    ownSubscribe: true,
    program: true,
    slots: [slot('accent'), slot('accentText'), slot('soft'), slot('tile'), slot('line')],
    texts: ['now', 'wholeProgram', 'count', ...COMMON_TEXTS],
  },
  {
    id: 'apNow',
    labelKey: 'calendar.design.apNow',
    set: 'apCream',
    family: 'ap',
    phone: 'fits',
    view: 'next',
    module: 'more',
    stripe: false,
    notice: true,
    noticeBand: true,
    empty: 'ap',
    slots: [slot('head'), slot('card'), slot('text'), slot('panel'), slot('panelText'), slot('gold'), slot('goldDark'), slot('alert', 'alert'), slot('alertText', 'alert')],
    texts: ['now', 'next', 'later', ...NOTICE_TEXTS, ...AP_EMPTY_TEXTS, ...COMMON_TEXTS],
  },
  {
    id: 'apNavy',
    labelKey: 'calendar.design.apNavy',
    set: 'apNavy',
    family: 'ap',
    phone: 'fits',
    view: 'next',
    module: 'more',
    stripe: false,
    empty: 'ap',
    slots: [slot('ground'), slot('text'), slot('tile'), slot('line'), slot('gold'), slot('goldDark'), slot('card', 'first'), slot('cardText', 'first')],
    texts: ['now', 'later', 'moreInfo', 'nextN', ...AP_EMPTY_TEXTS, ...COMMON_TEXTS],
  },
  {
    id: 'apSeries',
    labelKey: 'calendar.design.apSeries',
    set: 'apCream',
    family: 'ap',
    phone: 'fits',
    excerpt: true,
    view: 'list',
    module: 'more',
    stripe: false,
    notice: true,
    empty: 'ap',
    slots: [slot('card'), slot('row'), slot('text'), slot('title'), slot('gold'), slot('goldDark'), slot('line')],
    texts: ['series', 'forWhom', 'openAll', 'allDates', ...NOTICE_TEXTS, ...AP_EMPTY_TEXTS, ...COMMON_TEXTS],
  },
  {
    id: 'pad',
    labelKey: 'calendar.design.pad',
    ownCard: true,
    set: 'pad',
    family: 'retro',
    phone: 'fits',
    excerpt: true,
    view: 'next',
    module: 'retro',
    stripe: false,
    theme: ['inDays'],
    slots: [slot('paper'), slot('head'), slot('ink'), slot('rule'), slot('edge')],
    texts: ['addEvent', 'moreInfo', ...COMMON_TEXTS],
  },
  {
    id: 'index',
    labelKey: 'calendar.design.index',
    ownCard: true,
    limit: 4,
    set: 'index',
    family: 'retro',
    phone: 'flows',
    excerpt: true,
    view: 'cards',
    module: 'retro',
    stripe: false,
    open: true,
    theme: ['cardNo', 'colDate', 'colTime', 'colPlace', 'signup', 'openToAll', 'recurring'],
    slots: [slot('card'), slot('rule'), slot('line'), slot('ink')],
    texts: ['cardNo', 'colDate', 'colTime', 'colPlace', 'openToAll', 'moreInfo', ...COMMON_TEXTS],
  },
  {
    id: 'departures',
    labelKey: 'calendar.design.departures',
    ownCard: true,
    set: 'departures',
    family: 'retro',
    phone: 'switch',
    excerpt: true,
    view: 'list',
    module: 'retro',
    stripe: false,
    open: true,
    ownSubscribe: true,
    rewrites: true,
    phoneDefault: 'depStrip',
    cardDefault: 'depHead',
    theme: ['now', 'signup', 'openToAll', 'subscribe'],
    slots: [slot('board'), slot('flap'), slot('text'), slot('amber'), slot('cancelled')],
    texts: ['now', 'updated', 'colDate', 'colTime', 'colEvent', 'colPlace', 'colStatus', 'rowHint', 'openToAll', 'moreInfo', ...COMMON_TEXTS],
  },
  {
    id: 'marquee',
    ownCard: true,
    labelKey: 'calendar.design.marquee',
    set: 'marquee',
    family: 'retro',
    phone: 'switch',
    excerpt: true,
    view: 'next',
    module: 'retro',
    stripe: false,
    phoneDefault: 'marqueeRows',
    theme: ['now', 'later', 'signup'],
    slots: [slot('frame'), slot('bulb'), slot('board'), slot('ink')],
    texts: ['now', 'later', 'moreInfo', ...COMMON_TEXTS],
  },
  {
    id: 'receipt',
    ownCard: true,
    labelKey: 'calendar.design.receipt',
    set: 'receipt',
    family: 'retro',
    phone: 'fits',
    excerpt: true,
    view: 'list',
    module: 'retro',
    stripe: false,
    ownSubscribe: true,
    rewrites: true,
    theme: ['program', 'period', 'countLabel', 'nextShort', 'signup', 'subscribe', 'cardNo'],
    slots: [slot('paper'), slot('ink')],
    texts: ['program', 'period', 'venue', 'countLabel', 'nextShort', 'unitDays', 'admission', 'admissionPrice', 'thanks', 'cardNo', 'colDate', 'colTime', 'colPlace', 'colCategory', 'moreInfo', ...COMMON_TEXTS],
  },
  {
    id: 'seventies',
    ownCard: true,
    labelKey: 'calendar.design.seventies',
    set: 'seventies',
    family: 'retro',
    phone: 'fits',
    excerpt: true,
    view: 'list',
    module: 'retro',
    stripe: false,
    ownSubscribe: true,
    theme: ['now', 'period', 'signup', 'subscribe'],
    slots: [slot('cream'), slot('orange'), slot('brown'), slot('mustard')],
    texts: ['now', 'period', 'moreInfo', ...COMMON_TEXTS],
  },
  {
    id: 'deco',
    labelKey: 'calendar.design.deco',
    ownCard: true,
    set: 'deco',
    family: 'retro',
    phone: 'fits',
    excerpt: true,
    view: 'list',
    module: 'retro',
    stripe: false,
    ownSubscribe: true,
    theme: ['now', 'signup'],
    slots: [slot('bg'), slot('gold'), slot('cream')],
    texts: ['now', 'period', 'moreInfo', ...COMMON_TEXTS],
  },
  {
    id: 'mobileAgenda',
    labelKey: 'calendar.design.mobileAgenda',
    set: 'agendaDark',
    family: 'modern',
    phone: 'fits',
    view: 'agenda',
    module: 'more',
    stripe: true,
    ownFilter: true,
    slots: [slot('ground'), slot('text'), slot('card'), slot('edge'), slot('accent'), slot('chip')],
    texts: ['todayBtn', ...COMMON_TEXTS],
  },
];

/**
 * The settings that belong to one design each, stored under the block's `options`: a choice, a switch or an hour, each with its default and label key.
 */
const choice = (key, values, def, when) => ({ key, kind: 'choice', values, def, labelKey: `calendar.opt.${key}`, ...(when ? { when } : {}) });
const toggle = (key, def) => ({ key, kind: 'switch', def, labelKey: `calendar.opt.${key}` });
/** An option with a «?» text of its own in the admin dictionary (`tip.calendar.opt.<key>`). */
const tipped = (def) => ({ ...def, tipKey: `tip.calendar.opt.${def.key}` });
const hour = (key) => ({ key, kind: 'hour', def: null, labelKey: `calendar.opt.${key}` });
const MONTHS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'];

export const CAL_OPTIONS = {
  sidepanel: [choice('panelSide', ['right', 'left', 'under'], 'right')],
  weekPlan: [hour('hourFrom'), hour('hourTo'), toggle('weekend', false)],
  dayPlan: [hour('hourFrom'), hour('hourTo'), toggle('weekend', false)],
  table: [toggle('colTime', true), toggle('colPlace', true), toggle('zebra', true)],
  posters: [choice('columns', ['auto', '2', '3', '4'], 'auto')],
  photo: [choice('columns', ['auto', '2', '3', '4'], 'auto')],
  // The month at the top of the wheel: one of the twelve, or `now` for the month the visitor is in.
  yearWheel: [choice('firstMonth', [...MONTHS, 'now'], '0')],
  numbered: [toggle('pad', true)],
  band: [tipped(choice('reach', ['content', 'canvas', 'page'], 'content')), toggle('roll', true), choice('pause', ['button', 'touch'], 'button', { roll: true })],
  index: [choice('columns', ['auto', '2', '3', '4'], 'auto')],
};

/**
 * The options a design's traits give it, listed after its own: the word choice for theme words and the rewriting switch.
 */
export const CAL_SHARED_OPTIONS = {
  theme: tipped(choice('wordChoice', ['theme', 'neutral'], 'theme')),
  rewrites: tipped(toggle('rewrite', true)),
};

/**
 * The colour sets: every design belongs to one, and the card, the switcher, the finding tools and the phone view are drawn per set (`urd-cal-set-<id>`).
 */
export const CAL_SETS = ['theme', 'apCream', 'apNavy', 'agendaDark', 'board', 'darkGlass', 'cork', 'poster', 'bento', 'lightGlass', 'pad', 'index', 'departures', 'marquee', 'receipt', 'seventies', 'deco'];

/** The designs a switcher button can stand behind: the week strip and the week designs, the plain month and the month designs. */
export const CAL_SWITCH_WEEKS = ['weekStrip', 'weekPlan', 'layers'];
export const CAL_SWITCH_MONTHS = ['month', 'sidepanel', 'apMonth'];

/**
 * The designs behind the switcher's Week and Month buttons: the owner's `switcherViews` when valid, else the week strip and the month of the block's set.
 * @returns {{week: string, month: string}}
 */
export function calSwitcherViews(props) {
  const design = calDesign(props?.design);
  const chosen = props?.switcherViews ?? {};
  const week = CAL_SWITCH_WEEKS.includes(chosen.week) ? chosen.week : 'weekStrip';
  const month = CAL_SWITCH_MONTHS.includes(chosen.month) ? chosen.month : (design.set === 'apCream' || design.set === 'apNavy' ? 'apMonth' : 'month');
  return { week, month };
}

/**
 * Where the description is drawn: in the event's own row (`rows`) or only in the card that opens at a press (`card`).
 */
export function calDescription(props) {
  if (props?.description === 'card' || props?.description === 'rows') return props.description;
  return props?.options?.description === false ? 'card' : 'rows';
}

/** True when the block's rows have room for the description: a design that draws an excerpt (`excerpt`), or the plain design in the cards view. */
export function calHasExcerpt(props) {
  const design = calDesign(props?.design);
  return design.excerpt === true || (design.id === 'plain' && calView(props) === 'cards');
}

/** The option definitions of a design: its own, then the shared ones its traits give it; an empty list for a design without settings. */
export function calOptionDefs(designId) {
  const design = calDesign(designId);
  const own = CAL_OPTIONS[design.id] ?? [];
  const shared = [];
  if (design.theme?.length) shared.push(CAL_SHARED_OPTIONS.theme);
  if (design.rewrites) shared.push(CAL_SHARED_OPTIONS.rewrites);
  return shared.length ? [...own, ...shared] : own;
}

/**
 * The design's options as the block draws them: the owner's valid value for each, else its default; other designs' options are left out.
 * @returns {Record<string, string|boolean|number|null>}
 */
export function calOptions(props) {
  const stored = props?.options ?? {};
  const out = {};
  for (const def of calOptionDefs(props?.design)) {
    const value = stored[def.key];
    if (def.kind === 'choice') out[def.key] = def.values.includes(value) ? value : def.def;
    else if (def.kind === 'switch') out[def.key] = typeof value === 'boolean' ? value : def.def;
    else out[def.key] = Number.isInteger(value) && value >= 0 && value <= 24 ? value : null;
  }
  return out;
}

/**
 * Whether an option matters with the design's other options as they are (its `when`), so the editor shows it.
 * @param {{when?: Record<string, unknown>}} def
 * @param {Record<string, unknown>} opt The design's options as calOptions gives them
 * @returns {boolean}
 */
export function calOptionShown(def, opt) {
  return !def.when || Object.entries(def.when).every(([key, value]) => opt?.[key] === value);
}

/** The renderer modules a design can name (the block maps each to a literal import). */
export const CAL_MODULES = ['list', 'cards', 'time', 'next', 'more', 'retro'];

/** The design for an id; the plain one for anything unknown. */
export function calDesign(id) {
  return CAL_DESIGNS.find((d) => d.id === id) ?? CAL_DESIGNS[0];
}

/** The data view a block draws: the design's own, else the block's `view`, else the list. */
export function calView(props) {
  const own = calDesign(props?.design).view;
  if (own) return own;
  return CAL_VIEWS.includes(props?.view) ? props.view : 'list';
}

/** The number of events a calendar starts with: the design's own where it has one (Index cards: four), else eight in the agenda and six elsewhere. */
export function calLimitStart(props) {
  return calDesign(props?.design).limit ?? (calView(props) === 'agenda' ? 8 : 6);
}

/** The views that can carry the in-block view switcher: the ones that list what is coming. */
export const CAL_SWITCH_VIEWS = ['list', 'cards', 'agenda', 'next'];

/**
 * True when the block shows the view switcher: switched on (`switcher: true`) on a view that lists what is coming.
 */
export function calSwitcher(props) {
  return props?.switcher === true && CAL_SWITCH_VIEWS.includes(calView(props));
}

/**
 * True when a list view folds the events beyond its max count under «Show all» (`showMore`, on unless switched off).
 */
export function calFolds(props) {
  return props?.showMore !== false && calView(props) === 'list' && calDesign(props?.design).module !== 'more';
}

/**
 * The address of the whole programme for a design that links to it, through the shared safe-URL gate; null when there is none.
 */
export function calProgramHref(props) {
  if (!calDesign(props?.design).program) return null;
  const href = typeof props?.programHref === 'string' ? props.programHref.trim() : '';
  return isSafeHref(href) ? href : null;
}

/**
 * The link the announcement goes to (`props.notice`), resolved by resolveLink, or null when it has none or it goes nowhere.
 * @param {object} props The block's props
 * @param {Array<{id: string, path: string}>} [pages] The page register
 * @returns {ReturnType<typeof resolveLink>|null}
 */
export function calNoticeLink(props, pages = []) {
  const notice = props?.notice;
  if (!notice || !(notice.page || notice.href || notice.target)) return null;
  const link = resolveLink(notice, pages);
  return link.missing ? null : link;
}

/**
 * The address the announcement links to, or '' when it has none or it goes nowhere (calNoticeLink).
 * @param {object} props The block's props
 * @param {Array<{id: string, path: string}>} [pages] The page register
 * @returns {string}
 */
export function calNoticeHref(props, pages = []) {
  return calNoticeLink(props, pages)?.href ?? '';
}

/** The picker's groups: the designs by the view they stand on, the plain one first and alone. */
export function calDesignGroups() {
  const groups = [{ view: null, designs: CAL_DESIGNS.filter((d) => d.view === null) }];
  for (const view of CAL_VIEWS) {
    const designs = CAL_DESIGNS.filter((d) => d.view === view);
    if (designs.length) groups.push({ view, designs });
  }
  return groups;
}

const SAFE_HEX = /^#(?:[0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;
const SAFE_TOKEN = /^[a-z][a-z0-9-]*$/;

/** A colour as CSS: a hex value as it is, a theme token as its variable, anything else null. */
export function calColorCss(value) {
  if (typeof value !== 'string') return null;
  if (SAFE_HEX.test(value)) return value;
  if (SAFE_TOKEN.test(value)) return `var(--urd-color-${value})`;
  return null;
}

/**
 * The CSS variables for the owner's colour overrides: `--urd-cal-s-<slot>` for every slot holding a valid colour; an unset slot follows the theme.
 * @returns {Record<string, string>}
 */
export function calSlotVars(design, colors) {
  const out = {};
  for (const { key } of design.slots) {
    const css = calColorCss(colors?.[key]);
    if (css) out[`--urd-cal-s-${key}`] = css;
  }
  return out;
}

/** True when the block draws a phone design on a phone rather than the design itself (calPhoneView). */
export function calPhoneDesign(props) {
  return calPhoneView(props) !== calDesign(props?.design).id;
}

/**
 * The edge stripe on the design's boxes: on or off, and the owner's colour as CSS; without one it takes the event's calendar colour, else the accent.
 * @returns {{show: boolean, color: string|null}}
 */
export function calStripe(design, stripe) {
  const show = typeof stripe?.show === 'boolean' ? stripe.show : design.stripe;
  return { show, color: show ? calColorCss(stripe?.color) : null };
}

/** The bounds for a field's size in px, the same as the text toolbar's (text-typo.js). */
export const CAL_SIZE = { min: 8, max: 120 };
const SAFE_FAMILY = /^[\w\s,'"-]{1,80}$/;

/**
 * Inline style for one event field from the owner's settings: font, size, bold, italic, underline and colour, only the set and valid parts.
 * @param {{font?: string, size?: number, bold?: boolean, italic?: boolean, underline?: boolean, color?: string}|undefined} style
 * @returns {Record<string, string>} camelCase style properties
 */
export function calFieldCss(style) {
  const s = style ?? {};
  const css = {};
  if (typeof s.font === 'string' && SAFE_FAMILY.test(s.font)) css.fontFamily = s.font;
  const size = Math.round(Number(s.size));
  if (Number.isFinite(size) && size >= CAL_SIZE.min && size <= CAL_SIZE.max) css.fontSize = `${size}px`;
  if (s.bold === true) css.fontWeight = '700';
  else if (s.bold === false) css.fontWeight = '400';
  if (s.italic === true) css.fontStyle = 'italic';
  if (s.underline === true) css.textDecoration = 'underline';
  const color = calColorCss(s.color);
  if (color) css.color = color;
  return css;
}

/** The slot a text's words are stored under: the plural form after the key for a text with plural forms («count.other»), else the key. */
export function calTextSlot(key, form) {
  return form && CAL_PLURAL_TEXTS.includes(key) ? `${key}.${form}` : key;
}

const BLANK_HTML = /^(?:\s|&nbsp;|&#160;|<[^<>]*>)*$/i;

/** True when stored HTML holds no words: nothing, spaces, non-breaking spaces or tags alone, which is what an emptied editable text leaves. */
export function calBlankHtml(html) {
  return typeof html !== 'string' || BLANK_HTML.test(html);
}

/**
 * The owner's words for a text: their HTML, `false` for a removed content line, or null when the dictionary's words apply.
 */
export function calTextValue(texts, key, form) {
  const slots = form && CAL_PLURAL_TEXTS.includes(key) ? [calTextSlot(key, form), key] : [key];
  for (const slot of slots) {
    const value = texts?.[slot];
    if (value === false) {
      if (CAL_CONTENT_TEXTS.includes(key)) return false;
    } else if (!calBlankHtml(value)) {
      return value;
    }
  }
  return null;
}

/**
 * A text cut at its placeholders: the plain stretches as strings and each placeholder of `names` as `{name}`; other placeholders stay text.
 * @returns {Array<string|{name: string}>}
 */
export function calSplitTokens(text, names) {
  const str = String(text ?? '');
  const out = [];
  let last = 0;
  for (const m of str.matchAll(/\{([a-z]+)\}/gi)) {
    if (!names.includes(m[1])) continue;
    if (m.index > last) out.push(str.slice(last, m.index));
    out.push({ name: m[1] });
    last = m.index + m[0].length;
  }
  if (last < str.length) out.push(str.slice(last));
  return out;
}

/**
 * True when the owner has rewritten or removed at least one of the design's texts; the words of a text without words of its own never count.
 */
export function calHasTextOverrides(design, texts) {
  return Object.keys(texts ?? {}).some((slot) => {
    const key = slot.split('.')[0];
    if (!design.texts.includes(key) || CAL_HINT_TEXTS[key]) return false;
    return texts[slot] === false ? CAL_CONTENT_TEXTS.includes(key) : !calBlankHtml(texts[slot]);
  });
}

/** The texts after «Reset the texts»: the default words, keeping the owner's words in the texts that have none of their own; undefined when nothing is kept. */
export function calResetTexts(texts) {
  const kept = {};
  for (const key of Object.keys(CAL_HINT_TEXTS)) {
    if (!calBlankHtml(texts?.[key])) kept[key] = texts[key];
  }
  return Object.keys(kept).length ? kept : undefined;
}
