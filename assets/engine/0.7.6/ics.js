/**
 * Dependency-free iCal parser and recurrence expander for the calendar block.
 * A PURE module (no DOM, no fetch): everything here is unit-testable in node, and blocks/calendar.js handles fetching and rendering.
 * Loaded dynamically by the block on the first render of a calendar, so it stays outside the visitor closure.
 *
 * The scope is the practical subset that club calendars use (Google Calendar, Outlook, Nextcloud): VEVENT with DTSTART/DTEND (UTC, TZID or all-day), RRULE with FREQ/INTERVAL/COUNT/UNTIL/BYDAY/BYMONTHDAY/BYMONTH/ BYSETPOS, RDATE, EXDATE and RECURRENCE-ID overrides.
 * Unknown properties are ignored quietly.
 *
 * Time zones are resolved with the Intl API (no tables): wall time in the zone is converted to UTC by estimating the offset, which is DST-correct.
 */

import { meetingLinkIn, isMeetingLink } from './meeting-links.js';

/** An address that ends in a picture file, with or without a query. */
const IMAGE_LINK = /\.(?:jpe?g|png|webp|gif|avif)(?:\?[^\s]*)?$/i;

/* ---------- Line and property parsing ---------- */

/** Unfolds continuation lines (RFC 5545: line break + space/tab). */
function unfold(text) {
  return String(text).replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/\n[ \t]/g, '');
}

/** One content line → { name, params, value }. A colon inside "..." belongs to the parameters. */
function parseLine(line) {
  let inQuotes = false;
  let split = -1;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') inQuotes = !inQuotes;
    else if (ch === ':' && !inQuotes) { split = i; break; }
  }
  if (split < 0) return null;
  const head = line.slice(0, split);
  const value = line.slice(split + 1);
  const [name, ...paramParts] = head.split(';');
  const params = {};
  for (const part of paramParts) {
    const eq = part.indexOf('=');
    if (eq < 0) continue;
    params[part.slice(0, eq).toUpperCase()] = part.slice(eq + 1).replace(/^"|"$/g, '');
  }
  return { name: name.toUpperCase(), params, value };
}

/** Text values: \n, \, \; and \\ are escaped in iCal. */
function unescapeText(value) {
  return String(value)
    .replace(/\\n/gi, '\n')
    .replace(/\\([,;\\])/g, '$1');
}

/* ---------- Date and time zone ---------- */

/** One formatter per zone name, made the first time the zone is met (null for a zone Intl does not know). */
const ZONE_FORMATTERS = new Map();

function zoneFormatter(timeZone) {
  if (!ZONE_FORMATTERS.has(timeZone)) {
    let formatter = null;
    try {
      formatter = new Intl.DateTimeFormat('en-US', {
        timeZone,
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
      });
    } catch { /* an unknown zone is read as local time */ }
    ZONE_FORMATTERS.set(timeZone, formatter);
  }
  return ZONE_FORMATTERS.get(timeZone);
}

/**
 * Wall time in an IANA zone → UTC ms.
 * The offset is estimated with Intl and adjusted once more, which catches DST transitions.
 * An unknown zone falls back to local time.
 */
function zonedToUtc(y, mo, d, h, mi, s, timeZone) {
  const formatter = zoneFormatter(timeZone);
  if (!formatter) return new Date(y, mo - 1, d, h, mi, s).getTime();
  const wallAsUtc = Date.UTC(y, mo - 1, d, h, mi, s);
  const readWall = (utcMs) => {
    const parts = {};
    for (const p of formatter.formatToParts(new Date(utcMs))) parts[p.type] = p.value;
    return Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day),
      Number(parts.hour) % 24, Number(parts.minute), Number(parts.second));
  };
  let utc = wallAsUtc - (readWall(wallAsUtc) - wallAsUtc);
  utc -= readWall(utc) - wallAsUtc;
  return utc;
}

/** Date value → { y, mo, d, h, mi, s, allDay, tzid } (wall time + zone), or null. */
function parseDateParts(value, params = {}) {
  const v = String(value).trim();
  let m = /^(\d{4})(\d{2})(\d{2})$/.exec(v);
  if (m || params.VALUE === 'DATE') {
    m = m ?? /^(\d{4})(\d{2})(\d{2})/.exec(v);
    if (!m) return null;
    return { y: +m[1], mo: +m[2], d: +m[3], h: 0, mi: 0, s: 0, allDay: true, tzid: null };
  }
  m = /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})(Z?)$/.exec(v);
  if (!m) return null;
  return {
    y: +m[1], mo: +m[2], d: +m[3], h: +m[4], mi: +m[5], s: +m[6],
    allDay: false,
    tzid: m[7] === 'Z' ? 'UTC' : (params.TZID ?? null),
  };
}

/** Wall-time parts → UTC ms. All-day is read as local midnight (rendered as a date). */
export function partsToMs(parts) {
  if (!parts) return NaN;
  const { y, mo, d, h, mi, s, tzid, allDay } = parts;
  if (allDay || !tzid) return new Date(y, mo - 1, d, h, mi, s).getTime();
  if (tzid === 'UTC') return Date.UTC(y, mo - 1, d, h, mi, s);
  return zonedToUtc(y, mo, d, h, mi, s, tzid);
}

/** Calendar arithmetic on wall-time parts (DST-safe: the clock time survives). */
function addDays(parts, days) {
  const base = new Date(Date.UTC(parts.y, parts.mo - 1, parts.d + days));
  return { ...parts, y: base.getUTCFullYear(), mo: base.getUTCMonth() + 1, d: base.getUTCDate() };
}

function addMonths(parts, months) {
  const total = parts.y * 12 + (parts.mo - 1) + months;
  return { ...parts, y: Math.floor(total / 12), mo: (total % 12) + 1 };
}

const weekday = (parts) => new Date(Date.UTC(parts.y, parts.mo - 1, parts.d)).getUTCDay();

const daysInMonth = (y, mo) => new Date(Date.UTC(y, mo, 0)).getUTCDate();

const BYDAY_CODES = { SU: 0, MO: 1, TU: 2, WE: 3, TH: 4, FR: 5, SA: 6 };

/* ---------- VEVENT parsing ---------- */

/**
 * Parses a whole iCal text.
 * The events are RAW events, one per VEVENT with its recurrences not expanded (see expandEvents); the timezone is the feed's own (X-WR-TIMEZONE).
 * @returns {{ name: string|null, timezone: string|null, events: object[] }}
 */
export function parseIcs(text) {
  const lines = unfold(text).split('\n');
  const events = [];
  let calendarName = null;
  let calendarZone = null;
  let current = null;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;
    if (line === 'BEGIN:VEVENT') {
      current = { exdates: [], rdates: [] };
      continue;
    }
    if (line === 'END:VEVENT') {
      if (current?.start) events.push(current);
      current = null;
      continue;
    }
    const prop = parseLine(line);
    if (!prop) continue;
    if (!current) {
      if (prop.name === 'X-WR-CALNAME') calendarName = unescapeText(prop.value).trim();
      if (prop.name === 'X-WR-TIMEZONE') calendarZone = prop.value.trim();
      continue;
    }
    switch (prop.name) {
      case 'UID': current.uid = prop.value.trim(); break;
      case 'SUMMARY': current.summary = unescapeText(prop.value).trim(); break;
      case 'DESCRIPTION': current.description = unescapeText(prop.value).trim(); break;
      case 'LOCATION': current.location = unescapeText(prop.value).trim(); break;
      // The feed's own categories: a list divided by commas, and the property may stand several times.
      case 'CATEGORIES':
        current.categories = [...(current.categories ?? []), ...prop.value.split(/(?<!\\),/).map((name) => unescapeText(name).trim()).filter(Boolean)];
        break;
      case 'URL': current.url = prop.value.trim(); break;
      // The first picture attached by address: its type says it is a picture, or its address ends in a picture file.
      // A file attached inline, and any other kind of file, is skipped.
      case 'ATTACH': {
        const address = prop.value.trim();
        const type = String(prop.params.FMTTYPE ?? '').toLowerCase();
        if (!current.image && /^https?:\/\//i.test(address) && (type ? type.startsWith('image/') : IMAGE_LINK.test(address))) current.image = address;
        break;
      }
      case 'STATUS': current.status = prop.value.trim().toUpperCase(); break;
      case 'DTSTART': current.start = parseDateParts(prop.value, prop.params); break;
      case 'DTEND': current.end = parseDateParts(prop.value, prop.params); break;
      case 'RRULE': current.rrule = parseRrule(prop.value); break;
      // Extra dates beside the rule; of a period («start/end») the start is the date.
      case 'RDATE':
        for (const part of prop.value.split(',')) {
          const parsed = parseDateParts(part.split('/')[0], prop.params);
          if (parsed) current.rdates.push(parsed);
        }
        break;
      // The meeting's own address: the standard property, else the field the large calendars write it in.
      case 'CONFERENCE':
      case 'X-GOOGLE-CONFERENCE':
      case 'X-MICROSOFT-SKYPETEAMSMEETINGURL':
      case 'X-MICROSOFT-ONLINEMEETINGEXTERNALLINK':
        if (!current.meeting && /^https:\/\/\S+$/i.test(prop.value.trim())) current.meeting = prop.value.trim();
        break;
      case 'GEO': {
        const parts = prop.value.split(';').map((part) => part.trim());
        const [lat, lon] = parts.map(Number);
        const whole = parts.length === 2 && parts.every((part) => part !== '');
        if (whole && Number.isFinite(lat) && Number.isFinite(lon) && Math.abs(lat) <= 90 && Math.abs(lon) <= 180 && (lat || lon)) current.geo = { lat, lon };
        break;
      }
      // The description as HTML, beside the plain one.
      case 'X-ALT-DESC': if (/html/i.test(prop.params.FMTTYPE ?? '')) current.html = unescapeText(prop.value).trim(); break;
      case 'RECURRENCE-ID': current.recurrenceId = parseDateParts(prop.value, prop.params); break;
      case 'EXDATE':
        for (const part of prop.value.split(',')) {
          const parsed = parseDateParts(part, prop.params);
          if (parsed) current.exdates.push(parsed);
        }
        break;
      default: break;
    }
  }
  return { name: calendarName, timezone: calendarZone, events };
}

/** A comma list of whole numbers that pass the test, in rising order, or null when none does. */
function intList(value, ok) {
  const list = String(value ?? '').split(',').map(Number).filter((n) => Number.isInteger(n) && ok(n));
  return list.length ? [...new Set(list)].sort((a, b) => a - b) : null;
}

/** A positive whole number from a rule part, up to a bound; null for anything else. */
function wholeNumber(value, max) {
  const n = Number(value);
  return Number.isInteger(n) && n >= 1 ? Math.min(n, max) : null;
}

function parseRrule(value) {
  const rule = {};
  for (const part of String(value).split(';')) {
    const eq = part.indexOf('=');
    if (eq < 0) continue;
    rule[part.slice(0, eq).toUpperCase()] = part.slice(eq + 1);
  }
  const freq = rule.FREQ?.toUpperCase();
  if (!['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'].includes(freq)) return null;
  const byday = rule.BYDAY
    ? rule.BYDAY.split(',').map((code) => {
      const m = /^([+-]?\d{1,2})?([A-Z]{2})$/.exec(code.trim().toUpperCase());
      return m && m[2] in BYDAY_CODES ? { ord: m[1] ? Number(m[1]) : 0, day: BYDAY_CODES[m[2]] } : null;
    }).filter(Boolean)
    : null;
  return {
    freq,
    interval: wholeNumber(rule.INTERVAL, 1000) ?? 1,
    count: rule.COUNT ? wholeNumber(rule.COUNT, 100000) ?? 1 : null,
    until: rule.UNTIL ? partsToMs(parseDateParts(rule.UNTIL)) : null,
    byday,
    // A negative day counts from the month's end (-1 is the last day).
    bymonthday: intList(rule.BYMONTHDAY, (n) => n !== 0 && Math.abs(n) <= 31),
    bymonth: intList(rule.BYMONTH, (n) => n >= 1 && n <= 12),
    bysetpos: intList(rule.BYSETPOS, (n) => n !== 0 && Math.abs(n) <= 366),
    // The day a week starts on (RFC 5545 WKST), Monday unless the rule names another.
    wkst: BYDAY_CODES[String(rule.WKST ?? '').toUpperCase()] ?? BYDAY_CODES.MO,
    // Week numbers and days of the year are not supported; a yearly rule with them keeps to the start's month.
    weekOrYearDays: Boolean(rule.BYWEEKNO || rule.BYYEARDAY),
  };
}

/* ---------- Expansion ---------- */

const DAY_MS = 24 * 3600 * 1000;

/** Whole periods of a rule from its start to a later moment, rounded down to the rule's interval. */
function periodsBefore(count, interval) {
  return Math.max(0, Math.floor(count / interval) * interval);
}

/**
 * Generates wall-time starts for a rule, from DTSTART onwards (sorted).
 * `skipTo` (a time) lets a rule without COUNT begin at the period before that time instead of at its start, so a rule that began years ago still reaches the window within the guard.
 */
function* ruleStarts(startParts, rule, skipTo = null) {
  const guard = 3000;
  let produced = 0;
  const startMs = partsToMs(startParts);
  const ahead = rule.count == null && Number.isFinite(skipTo) && skipTo > startMs ? skipTo : null;
  const aheadParts = ahead != null ? (() => { const d = new Date(ahead); return { y: d.getFullYear(), mo: d.getMonth() + 1 }; })() : null;
  // BYMONTH keeps the rule to the named months, and BYDAY a daily rule to the named weekdays.
  const inMonths = (parts) => !rule.bymonth || rule.bymonth.includes(parts.mo);
  if (rule.freq === 'DAILY') {
    const days = rule.byday?.length ? rule.byday.map((b) => b.day) : null;
    const first = ahead != null ? periodsBefore(Math.floor((ahead - startMs) / DAY_MS) - 1, rule.interval) : 0;
    for (let i = first, turns = 0; produced < guard && turns < guard * 12; i += rule.interval, turns++) {
      const candidate = addDays(startParts, i);
      if (!inMonths(candidate) || (days && !days.includes(weekday(candidate)))) continue;
      yield candidate;
      produced++;
    }
  } else if (rule.freq === 'WEEKLY') {
    // A week starts on the rule's WKST day, and its days are taken in that order, so the starts come out in date order.
    const fromWkst = (day) => (day - rule.wkst + 7) % 7;
    const days = [...new Set(rule.byday?.length ? rule.byday.map((b) => b.day) : [weekday(startParts)])].sort((a, b) => fromWkst(a) - fromWkst(b));
    // The weeks are counted from the one that holds the DTSTART day.
    const weekAnchor = addDays(startParts, -fromWkst(weekday(startParts)));
    const firstWeek = ahead != null ? periodsBefore(Math.floor((ahead - partsToMs(weekAnchor)) / (7 * DAY_MS)) - 1, rule.interval) : 0;
    for (let week = firstWeek, turns = 0; produced < guard && turns < guard * 2; week += rule.interval, turns++) {
      // BYSETPOS picks among the week's days the other parts leave, before the days ahead of DTSTART are dropped.
      const weekDays = days.map((day) => addDays(weekAnchor, week * 7 + fromWkst(day))).filter(inMonths);
      for (const candidate of setPositions(weekDays, rule.bysetpos)) {
        if (partsToMs(candidate) < partsToMs(startParts)) continue;
        yield candidate;
        produced++;
      }
    }
  } else if (rule.freq === 'MONTHLY') {
    const firstMonth = aheadParts ? periodsBefore((aheadParts.y - startParts.y) * 12 + (aheadParts.mo - startParts.mo) - 1, rule.interval) : 0;
    for (let i = firstMonth, turns = 0; produced < guard && turns < guard; i += rule.interval, turns++) {
      const month = addMonths(startParts, i);
      if (!inMonths(month)) continue;
      for (const candidate of setPositions(monthDays(month, startParts, rule).map((d) => ({ ...month, d })), rule.bysetpos)) {
        if (partsToMs(candidate) < partsToMs(startParts)) continue;
        yield candidate;
        produced++;
      }
    }
  } else if (rule.freq === 'YEARLY') {
    const spansYear = !rule.bymonth && !rule.weekOrYearDays && Boolean(rule.byday?.length || rule.bymonthday?.length);
    const firstYear = aheadParts ? periodsBefore(aheadParts.y - startParts.y - 1, rule.interval) : 0;
    for (let i = firstYear, turns = 0; produced < guard && turns < guard; i += rule.interval, turns++) {
      // The year's days: over the whole year when the rule names weekdays or month days without months,
      // else in each of the rule's months (or the start's own) the days the rule names.
      let year = [];
      if (spansYear) year = yearDays(startParts.y + i, startParts, rule);
      else {
        for (const mo of rule.bymonth ?? [startParts.mo]) {
          const month = { ...startParts, y: startParts.y + i, mo };
          for (const d of monthDays(month, startParts, rule)) year.push({ ...month, d });
        }
      }
      for (const candidate of setPositions(year, rule.bysetpos)) {
        if (partsToMs(candidate) < partsToMs(startParts)) continue;
        yield candidate;
        produced++;
      }
    }
  }
}

/**
 * The days of a month a rule names, in order: the nth (or nth from last) weekday of BYDAY, the days of BYMONTHDAY, else the day of the start.
 * A day the month does not have (the 31st, 29 February) is left out.
 */
function monthDays(month, startParts, rule) {
  const dim = daysInMonth(month.y, month.mo);
  let candidates = [];
  if (rule.byday?.length) {
    for (const { ord, day } of rule.byday) {
      // ord 0 means every such weekday of the month.
      const matches = [];
      for (let d = 1; d <= dim; d++) {
        if (weekday({ ...month, d }) === day) matches.push(d);
      }
      if (ord > 0 && matches[ord - 1]) candidates.push(matches[ord - 1]);
      else if (ord < 0 && matches[matches.length + ord] != null) candidates.push(matches[matches.length + ord]);
      else if (ord === 0) candidates.push(...matches);
    }
    if (rule.bymonthday?.length) {
      const named = rule.bymonthday.map((d) => (d < 0 ? dim + 1 + d : d));
      candidates = candidates.filter((d) => named.includes(d));
    }
  } else if (rule.bymonthday?.length) {
    candidates = rule.bymonthday.map((d) => (d < 0 ? dim + 1 + d : d)).filter((d) => d >= 1 && d <= dim);
  } else if (startParts.d <= dim) {
    candidates = [startParts.d];
  }
  return [...new Set(candidates)].sort((a, b) => a - b);
}

/**
 * The days of a year a yearly rule without BYMONTH names, in order (RFC 5545 §3.3.10): BYMONTHDAY in every month, with BYDAY
 * as a limit; else BYDAY over the whole year, where an ordinal counts from 1 January (-1 the year's last such weekday) and no
 * ordinal means every such weekday.
 */
function yearDays(y, startParts, rule) {
  if (rule.bymonthday?.length) {
    const days = [];
    for (let mo = 1; mo <= 12; mo++) {
      const month = { ...startParts, y, mo };
      for (const d of monthDays(month, startParts, rule)) days.push({ ...month, d });
    }
    return days;
  }
  const newYear = { ...startParts, y, mo: 1, d: 1 };
  const first = weekday(newYear);
  const length = Math.round((Date.UTC(y + 1, 0, 1) - Date.UTC(y, 0, 1)) / DAY_MS);
  const picked = new Set();
  for (const { ord, day } of rule.byday) {
    // The days of the year (0 is 1 January) that fall on this weekday.
    const matches = [];
    for (let n = (day - first + 7) % 7; n < length; n += 7) matches.push(n);
    if (ord > 0 && matches[ord - 1] != null) picked.add(matches[ord - 1]);
    else if (ord < 0 && matches[matches.length + ord] != null) picked.add(matches[matches.length + ord]);
    else if (ord === 0) matches.forEach((n) => picked.add(n));
  }
  return [...picked].sort((a, b) => a - b).map((n) => addDays(newYear, n));
}

/** BYSETPOS: of a period's days in order, the ones at the named positions (1 the first, -1 the last); without it, all of them. */
function setPositions(days, positions) {
  if (!positions) return days;
  const picked = positions.map((pos) => (pos > 0 ? days[pos - 1] : days[days.length + pos])).filter(Boolean);
  return [...new Set(picked)].sort((x, y) => partsToMs(x) - partsToMs(y));
}

/**
 * The length of an event: whole days for an all-day event (its last day counted from its first; DTEND is the day after the last), else in ms (an hour when the feed gives no end).
 */
function lengthOf(event) {
  if (event.start.allDay) {
    const days = event.end
      ? Math.round((Date.UTC(event.end.y, event.end.mo - 1, event.end.d) - Date.UTC(event.start.y, event.start.mo - 1, event.start.d)) / DAY_MS) - 1
      : 0;
    return { days: Math.max(0, days) };
  }
  return { ms: event.end ? Math.max(0, partsToMs(event.end) - partsToMs(event.start)) : 3600 * 1000 };
}

/** The end of an occurrence that starts at a time: the start of its last day for an all-day event, counted in calendar days so a change of clock cannot move it. */
function endAfter(startMs, length) {
  if (length.days == null) return startMs + length.ms;
  const d = new Date(startMs);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + length.days).getTime();
}

/**
 * Expands raw events into concrete occurrences inside a window.
 * A RECURRENCE-ID event overrides its base occurrence (of the rule or of an RDATE), EXDATE removes one, and STATUS:CANCELLED marks one `cancelled: true` (the block shows it as cancelled or hides it).
 * An occurrence of an event with a recurrence rule or extra dates carries `recurring: true`, and one whose event has a DTEND `hasEnd: true`.
 * The end of an all-day occurrence is the start of its last day.
 * The result is sorted by start.
 *
 * @param {object[]} events from parseIcs
 * @param {{ from?: Date|number, to?: Date|number, max?: number }} window
 * @returns {Array<{ uid, summary, description, location, categories: string[], url, image, meeting, geo, descriptionHtml, start: number, end: number, allDay: boolean, recurring: boolean, cancelled: boolean, hasEnd: boolean }>}
 */
export function expandEvents(events, { from = Date.now(), to, max = 300 } = {}) {
  const fromMs = Number(from);
  const toMs = to != null ? Number(to) : fromMs + 400 * DAY_MS;

  // Overrides: uid + the base occurrence's start → the replacement event.
  const overrides = new Map();
  for (const event of events) {
    if (event.uid && event.recurrenceId) {
      overrides.set(`${event.uid}@${partsToMs(event.recurrenceId)}`, event);
    }
  }

  const out = [];
  const push = (event, startMs, endMs, recurring = false) => {
    out.push({
      uid: event.uid ?? null,
      summary: event.summary ?? '',
      description: event.description ?? '',
      location: event.location ?? '',
      categories: event.categories ?? [],
      url: event.url ?? null,
      image: event.image ?? null,
      meeting: event.meeting ?? null,
      geo: event.geo ?? null,
      descriptionHtml: event.html ?? '',
      // The source the event came from (the block stamps it on the parsed event), kept on every occurrence.
      source: event.source ?? null,
      start: startMs,
      end: endMs,
      allDay: !!event.start.allDay,
      recurring,
      cancelled: event.status === 'CANCELLED',
      hasEnd: Boolean(event.end),
    });
  };

  for (const event of events) {
    if (event.recurrenceId) continue;
    const startMs = partsToMs(event.start);
    if (!Number.isFinite(startMs)) continue;
    const length = lengthOf(event);

    /** One occurrence at a time: replaced by its override when the feed has one, and kept when it touches the window. */
    const pushAt = (ms, recurring) => {
      const override = event.uid ? overrides.get(`${event.uid}@${ms}`) : null;
      if (override) {
        const oStart = partsToMs(override.start);
        if (!Number.isFinite(oStart)) return;
        const oEnd = endAfter(oStart, override.end ? lengthOf(override) : length);
        if (oEnd >= fromMs && oStart <= toMs) push({ ...event, ...override }, oStart, oEnd, recurring);
        return;
      }
      const end = endAfter(ms, length);
      if (end >= fromMs && ms <= toMs) push(event, ms, end, recurring);
    };

    const exdateMs = new Set(event.exdates.map(partsToMs));
    // RDATE: dates of their own, beside the start and the rule's dates.
    const extra = [...new Set((event.rdates ?? []).map(partsToMs))].filter((ms) => Number.isFinite(ms) && ms !== startMs && !exdateMs.has(ms));
    const seen = new Set();
    const pushExtra = () => {
      for (const ms of extra) {
        if (!seen.has(ms)) pushAt(ms, true);
      }
    };
    if (!event.rrule) {
      pushAt(startMs, extra.length > 0);
      pushExtra();
      continue;
    }

    let produced = 0;
    // A rule without COUNT may begin just before the window; the longest event a rule repeats is allowed for.
    const longest = length.days != null ? (length.days + 2) * DAY_MS : length.ms + DAY_MS;
    for (const parts of ruleStarts(event.start, event.rrule, fromMs - longest)) {
      const occurrenceMs = partsToMs(parts);
      if (event.rrule.until != null && occurrenceMs > event.rrule.until) break;
      produced++;
      if (event.rrule.count != null && produced > event.rrule.count) break;
      if (occurrenceMs > toMs) break;
      seen.add(occurrenceMs);
      if (exdateMs.has(occurrenceMs)) continue;
      pushAt(occurrenceMs, true);
      if (out.length >= max * 2) break;
    }
    pushExtra();
  }

  out.sort((a, b) => a.start - b.start);
  return out.slice(0, max);
}

/* ---------- Conventions (the ApeironLF patterns) ---------- */

/** "Category: Title" → { category, title }; without a colon prefix category is null. */
export function splitCategory(summary) {
  const m = /^([^:]{1,24}):\s+(.+)$/.exec(String(summary ?? '').trim());
  if (!m || /https?$/i.test(m[1])) return { category: null, title: String(summary ?? '').trim() };
  return { category: m[1].trim(), title: m[2].trim() };
}

/** A venue's name: the place up to its first comma («The hall, Storgata 1» is «The hall»); '' without a place. */
export function placeName(location) {
  return String(location ?? '').split(',')[0].trim();
}

/**
 * True when every word of a search stands in the event's title, place or description, whatever the case; an empty search matches every event.
 */
export function matchesSearch(occ, query) {
  const words = String(query ?? '').toLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length) return true;
  const text = `${occ?.title ?? occ?.summary ?? ''}\n${occ?.location ?? ''}\n${occ?.description ?? ''}`.toLowerCase();
  return words.every((word) => text.includes(word));
}

const SIGNUP_WORDS = /p[åa]meld|tilmeld|anmäl|sign\s?-?up|registr|register|rsvp|billett|biljett|ticket/i;
const ADDRESS = /https?:\/\/[^\s<>"')\]]+/gi;

/** The addresses on the lines of a description that speak of signing up, registering or tickets, in order. */
function signupLinksIn(description) {
  const links = [];
  for (const line of String(description ?? '').split('\n')) {
    if (!SIGNUP_WORDS.test(line)) continue;
    // Trailing punctuation belongs to the sentence, not to the link.
    for (const m of line.matchAll(ADDRESS)) links.push(m[0].replace(/[.,;:!?]+$/, ''));
  }
  return links;
}

/** The sign-up link a description names: the first address on a line that speaks of signing up, registering or tickets; null without such a line. */
export function findSignupLink(description) {
  return signupLinksIn(description)[0] ?? null;
}

/**
 * Where an event is signed up for: the link a line of the description names, else the event's own address (what an event service gives as its page).
 * A link to a picture or to a video meeting is never the sign-up, and a link that merely stands in the description is not one either.
 * @param {object} occ An occurrence with its description, address and meeting link
 * @param {string[]} [own] The site's own meeting hosts
 */
export function signupLinkOf(occ, own = []) {
  const page = typeof occ?.url === 'string' && /^https?:\/\//i.test(occ.url) ? occ.url : null;
  for (const address of [...signupLinksIn(occ?.description), page]) {
    if (address && !IMAGE_LINK.test(address) && address !== occ?.meeting && !isMeetingLink(address, own)) return address;
  }
  return null;
}

/** The Monday 00:00 (local time) of the week a time falls in. */
export function startOfWeek(ms) {
  const d = new Date(ms);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return d.getTime();
}

/** The ISO 8601 week number of a time (local date): the week with the year's first Thursday is week 1. */
export function isoWeek(ms) {
  const d = new Date(ms);
  const thursday = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 3 - ((d.getDay() + 6) % 7));
  const firstThursday = new Date(thursday.getFullYear(), 0, 4);
  const firstWeekStart = new Date(firstThursday.getFullYear(), 0, firstThursday.getDate() + 3 - ((firstThursday.getDay() + 6) % 7));
  return 1 + Math.round((thursday - firstWeekStart) / (7 * 24 * 3600 * 1000));
}

/**
 * The twelve months a year view shows: from the first day of `firstMonth` (0 is January) in the season that holds `now`, so with
 * August at the top a day in March belongs to the season that began the August before.
 * @param {number} [firstMonth] The month at the top, 0 to 11
 * @param {number} [now]
 * @returns {{from: number, to: number}} Local midnight of the season's first day, and of the next season's
 */
export function seasonRange(firstMonth = 0, now = Date.now()) {
  const d = new Date(now);
  const top = Number.isInteger(firstMonth) && firstMonth >= 0 && firstMonth <= 11 ? firstMonth : 0;
  const y = d.getFullYear() - (d.getMonth() < top ? 1 : 0);
  return { from: new Date(y, top, 1).getTime(), to: new Date(y + 1, top, 1).getTime() };
}

/**
 * The month a year design puts at the top, from its `firstMonth` option: a month number as text (0 is January), or `now` for
 * the month of `today`; January without the option.
 * @param {string|undefined} option
 * @param {Date} [today]
 * @returns {number}
 */
export function seasonTop(option, today = new Date()) {
  return option === 'now' ? today.getMonth() : Number(option) || 0;
}

/**
 * Where a view's window starts: the season for a year view (the calendar year unless `firstMonth` names another top month), the
 * month, the week or the day for those views, and six hours back for a list.
 */
export function windowStart(view, now = Date.now(), firstMonth = 0) {
  const d = new Date(now);
  if (view === 'year') return seasonRange(firstMonth, now).from;
  if (view === 'month') return new Date(d.getFullYear(), d.getMonth(), 1).getTime();
  if (view === 'week') return startOfWeek(now);
  if (view === 'day') return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  return now - 6 * 3600 * 1000;
}

/**
 * The first address in the texts that leads to a video meeting (the known services of meeting-links.js), or null.
 * @param {...string} texts The event's address, place and description
 */
export function findMeetingLink(...texts) {
  return meetingLinkIn(texts);
}

/**
 * The event's meeting link: the one the feed names in a field of its own, else the first found in its address, place and description.
 * @param {object} occ
 * @param {string[]} [own] The site's own meeting hosts
 */
export function meetingLinkOf(occ, own = []) {
  return occ?.meeting || meetingLinkIn([occ?.url, occ?.location, occ?.description], own);
}

const pad = (n) => String(n).padStart(2, '0');
const utcStamp = (ms) => {
  const d = new Date(ms);
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;
};
const dayStamp = (ms) => {
  const d = new Date(ms);
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
};
const escapeText = (text) => String(text ?? '').replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/([,;])/g, '\\$1');

/** The day after the day a time falls on, at 00:00 (local time). */
const nextDay = (ms) => {
  const d = new Date(ms);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1).getTime();
};

/** The start and the end of one occurrence as iCal stamps: dates for an all-day event (the end exclusive), UTC times otherwise. */
function stamps(occ) {
  const start = occ.start;
  const end = Number.isFinite(occ.end) && occ.end >= occ.start ? occ.end : occ.start;
  if (occ.allDay) return { start: dayStamp(start), end: dayStamp(nextDay(end)), date: true };
  return { start: utcStamp(start), end: utcStamp(end > start ? end : start + 3600 * 1000), date: false };
}

/**
 * One occurrence as an iCal file, for «Add to calendar»: a calendar with the one event, its title, place, description and address.
 * @param {{start: number, end?: number, allDay?: boolean, title?: string, summary?: string, location?: string, description?: string, url?: string, uid?: string}} occ
 */
export function eventIcs(occ) {
  const at = stamps(occ);
  const lines = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Urd//Calendar//EN', 'BEGIN:VEVENT',
    `UID:${escapeText(occ.uid || `${at.start}-${occ.title ?? occ.summary ?? ''}`)}@urd`,
    `DTSTAMP:${utcStamp(occ.start)}`,
    at.date ? `DTSTART;VALUE=DATE:${at.start}` : `DTSTART:${at.start}`,
    at.date ? `DTEND;VALUE=DATE:${at.end}` : `DTEND:${at.end}`,
    `SUMMARY:${escapeText(occ.title ?? occ.summary)}`,
  ];
  if (occ.location) lines.push(`LOCATION:${escapeText(occ.location)}`);
  if (occ.description) lines.push(`DESCRIPTION:${escapeText(occ.description)}`);
  if (occ.url) lines.push(`URL:${occ.url}`);
  lines.push('END:VEVENT', 'END:VCALENDAR');
  return `${lines.join('\r\n')}\r\n`;
}

/** The address that opens one occurrence as a new event in Google Calendar. */
export function googleEventUrl(occ) {
  const at = stamps(occ);
  const params = new URLSearchParams({ action: 'TEMPLATE', text: occ.title ?? occ.summary ?? '', dates: `${at.start}/${at.end}` });
  if (occ.location) params.set('location', occ.location);
  if (occ.description) params.set('details', occ.description);
  return `https://calendar.google.com/calendar/render?${params}`;
}

const isoDate = (ms) => {
  const d = new Date(ms);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

/**
 * One occurrence as a schema.org `Event` for the page's JSON-LD: the name, the start and the end (the days alone for an all-day event, its last day as the end), the place with its address or the meeting link, and whether it is cancelled and held online.
 * `real` is the true moment of an occurrence whose start is shown on another zone's clock.
 * @param {object} occ An occurrence from expandEvents, with its title
 * @param {{pageUrl?: string, organizer?: string, organizerUrl?: string, meetingHosts?: string[]}} [site] The page the event is shown on, the organizer (the site's name, or the calendar's own organizer with its page) and the site's own meeting hosts
 * @returns {object|null} null without a name or a start
 */
export function eventJsonLd(occ, { pageUrl = '', organizer = '', organizerUrl = '', meetingHosts = [] } = {}) {
  const name = String(occ?.title ?? occ?.summary ?? '').trim();
  if (!name || !Number.isFinite(occ?.start)) return null;
  const shift = occ.start - (occ.real ?? occ.start);
  const data = { '@context': 'https://schema.org', '@type': 'Event', name };
  if (occ.allDay) {
    data.startDate = isoDate(occ.start);
    if (occ.end > occ.start) data.endDate = isoDate(occ.end);
  } else {
    data.startDate = new Date(occ.start - shift).toISOString();
    if (occ.hasEnd && occ.end > occ.start) data.endDate = new Date(occ.end - shift).toISOString();
  }
  data.eventStatus = `https://schema.org/${occ.cancelled ? 'EventCancelled' : 'EventScheduled'}`;
  const meeting = meetingLinkOf(occ, meetingHosts);
  // A place that is only an address on the web is no place to go to.
  const place = String(occ.location ?? '').trim();
  const physical = place && !/^https?:\/\//i.test(place) ? { '@type': 'Place', name: place, address: place } : null;
  const online = meeting ? { '@type': 'VirtualLocation', url: meeting } : null;
  data.eventAttendanceMode = `https://schema.org/${physical && online ? 'MixedEventAttendanceMode' : online ? 'OnlineEventAttendanceMode' : 'OfflineEventAttendanceMode'}`;
  if (physical && online) data.location = [physical, online];
  else if (physical || online) data.location = physical ?? online;
  const text = String(occ.description ?? '').trim();
  if (text) data.description = text.length > 500 ? `${text.slice(0, 499)}…` : text;
  if (typeof occ.image === 'string' && /^https?:\/\//i.test(occ.image)) data.image = occ.image;
  const own = typeof occ.url === 'string' && /^https?:\/\//i.test(occ.url) ? occ.url : pageUrl;
  if (own) data.url = own;
  if (organizer) {
    const url = organizerUrl || (pageUrl ? new URL('/', pageUrl).href : '');
    data.organizer = { '@type': 'Organization', name: organizer, ...(url ? { url } : {}) };
  }
  return data;
}

/** The first picture address in the description (a link ending in an image file), or null. */
export function findImageLink(description) {
  for (const m of String(description ?? '').matchAll(ADDRESS)) {
    const address = m[0].replace(/[.,;:!]+$/, '');
    if (IMAGE_LINK.test(address)) return address;
  }
  return null;
}

/**
 * A Nextcloud calendar's share link as the address of its iCal file.
 * The link the share dialog gives opens a web page (`/apps/calendar/p/<token>`, or `/embed/` for the embedding link), and the calendar's public address answers with the file only with `?export` behind it; both become `/remote.php/dav/public-calendars/<token>?export`, on a server at the root of its host or in a folder.
 * Any other address is returned as it is.
 */
function nextcloudExport(address) {
  let url;
  try { url = new URL(address); } catch { return address; }
  const page = /^(.*?)(?:\/index\.php)?\/apps\/calendar\/(?:p|embed)\/([A-Za-z0-9_-]+)(?:\/.*)?$/.exec(url.pathname);
  if (page) return `${url.origin}${page[1]}/remote.php/dav/public-calendars/${page[2]}?export`;
  const dav = /^(.*\/remote\.php\/dav\/public-calendars\/[A-Za-z0-9_-]+)\/?$/.exec(url.pathname);
  if (dav && !url.searchParams.has('export')) return `${url.origin}${dav[1]}?export`;
  return address;
}

/**
 * Normalizes a source the way the owner writes it: webcal:// → https://, https is kept, http is lifted to https, and a bare Google calendar id (someone@gmail.com / ...@group.calendar.google.com) becomes its public ICS address.
 * An unknown form gives null.
 */
export function normalizeSourceUrl(input) {
  const raw = String(input ?? '').trim();
  if (!raw) return null;
  if (/^webcal:\/\//i.test(raw)) return nextcloudExport('https://' + raw.slice('webcal://'.length));
  if (/^https:\/\//i.test(raw)) return nextcloudExport(raw);
  if (/^http:\/\//i.test(raw)) return nextcloudExport('https://' + raw.slice('http://'.length));
  if (/^[^\s/]+@[^\s/]+$/.test(raw)) {
    return `https://calendar.google.com/calendar/ical/${encodeURIComponent(raw)}/public/basic.ics`;
  }
  return null;
}

/**
 * A source as the block reads it: the address alone, or an object with an address, a name and a colour.
 * A named calendar is a category of its own (its events wear the name as their chip, whatever their titles say), and a colour tints that calendar's chips and date badges.
 * Pure.
 * @param {unknown} source A string, or `{ url, name?, color? }`
 * @returns {{url: string, name: string, color: string}}
 */
export function sourceEntry(source) {
  if (source && typeof source === 'object') {
    return {
      url: String(source.url ?? '').trim(),
      name: typeof source.name === 'string' ? source.name.trim() : '',
      color: typeof source.color === 'string' ? source.color.trim() : '',
    };
  }
  return { url: String(source ?? '').trim(), name: '', color: '' };
}

/**
 * A calendar of the site's registry (site.calendars) as the block reads it: every field trimmed, the colours gathered, the two switches true unless false.
 * Pure.
 * @param {unknown} calendar A registry entry `{ id, url, name?, color?, colorText?, colorBox?, colorChip?, description?, link?, organizer?, subscribable?, inFilter? }`
 * @returns {object|null} null without an id or an address
 */
export function calendarEntry(calendar) {
  if (!calendar || typeof calendar !== 'object') return null;
  const str = (value) => (typeof value === 'string' ? value.trim() : '');
  const id = str(calendar.id);
  const url = str(calendar.url);
  if (!id || !url) return null;
  // The calendar's page is drawn as a link: only a web address is kept (the anchored pattern is the guard).
  const link = str(calendar.link);
  return {
    id,
    url,
    name: str(calendar.name),
    color: str(calendar.color),
    colors: { text: str(calendar.colorText), box: str(calendar.colorBox), chip: str(calendar.colorChip) },
    description: str(calendar.description),
    link: /^https?:\/\//i.test(link) ? link : '',
    organizer: str(calendar.organizer),
    subscribable: calendar.subscribable !== false,
    inFilter: calendar.inFilter !== false,
  };
}

/**
 * The block's sources as the calendar reads them: an address of its own (a string or `{ url, name, color }`) as it is, a reference `{ calendar: id }` looked up in the site's registry.
 * A reference to a calendar that is not there and an entry without an address are dropped, and the same calendar twice is one source.
 * Pure.
 * @param {unknown} sources The block's `sources`
 * @param {unknown} calendars The site's `site.calendars`
 * @returns {Array<ReturnType<typeof calendarEntry>>}
 */
export function resolveSources(sources, calendars) {
  const registry = new Map((Array.isArray(calendars) ? calendars : []).map(calendarEntry).filter(Boolean).map((entry) => [entry.id, entry]));
  const out = [];
  const seen = new Set();
  for (const source of Array.isArray(sources) ? sources : []) {
    if (source && typeof source === 'object' && 'calendar' in source) {
      const entry = registry.get(String(source.calendar ?? '').trim());
      if (!entry || seen.has(entry.id)) continue;
      seen.add(entry.id);
      out.push(entry);
      continue;
    }
    const own = sourceEntry(source);
    if (!own.url) continue;
    out.push({ ...own, id: '', colors: { text: '', box: '', chip: '' }, description: '', link: '', organizer: '', subscribable: true, inFilter: true });
  }
  return out;
}

/** Subscribe links for a source: webcal always; Google calendars also get "add to Google". */
export function subscribeLinks(url) {
  const normalized = normalizeSourceUrl(url);
  if (!normalized) return null;
  const links = { webcal: 'webcal://' + normalized.slice('https://'.length), google: null };
  const m = /^https:\/\/calendar\.google\.com\/calendar\/ical\/([^/]+)\//.exec(normalized);
  if (m) links.google = `https://calendar.google.com/calendar/r?cid=${m[1]}`;
  return links;
}

/* ---------- The calendar block's view logic (pure) ---------- */

/** How many events the «next» card holds: 1 to 3, one for anything else. */
export const NEXT_COUNT = { min: 1, max: 3, dflt: 1 };

/** How many more the card lists under «Later»: 0 to 10, none for anything else. */
export const LATER_COUNT = { min: 0, max: 10, dflt: 0 };

/** The events in the «next» card, inside the bounds. */
export function nextCount(count) {
  const n = Number(count);
  if (!Number.isFinite(n)) return NEXT_COUNT.dflt;
  return Math.min(NEXT_COUNT.max, Math.max(NEXT_COUNT.min, Math.round(n)));
}

/** The events under «Later», inside the bounds. */
export function laterCount(count) {
  const n = Number(count);
  if (!Number.isFinite(n)) return LATER_COUNT.dflt;
  return Math.min(LATER_COUNT.max, Math.max(LATER_COUNT.min, Math.round(n)));
}

/**
 * The same event from two calendars is one event: occurrences that start at the same time under the same title (case and outer spaces aside) are merged into the first of them, which takes over a signup link or a location the later copy has and it lacks.
 * The order is kept.
 * @param {Array<object>} occurrences With `start` and `title` (or `summary`)
 * @returns {Array<object>}
 */
export function dedupeOccurrences(occurrences) {
  const seen = new Map();
  const out = [];
  for (const occ of Array.isArray(occurrences) ? occurrences : []) {
    const key = `${occ.start}|${String(occ.title ?? occ.summary ?? '').trim().toLowerCase()}`;
    const first = seen.get(key);
    if (!first) {
      const copy = { ...occ };
      seen.set(key, copy);
      out.push(copy);
      continue;
    }
    if (!first.signup && occ.signup) first.signup = occ.signup;
    if (!first.location && occ.location) first.location = occ.location;
    if (!first.category && occ.category) first.category = occ.category;
  }
  return out;
}

/**
 * Occurrences under their month, in the order given, for the agenda view.
 * @param {Array<{start: number}>} occurrences Sorted by start
 * @returns {Array<{year: number, month: number, items: Array<object>}>} month is 0 to 11
 */
export function groupByMonth(occurrences) {
  const groups = [];
  for (const occ of Array.isArray(occurrences) ? occurrences : []) {
    const start = new Date(occ.start);
    const year = start.getFullYear();
    const month = start.getMonth();
    const last = groups[groups.length - 1];
    if (last && last.year === year && last.month === month) last.items.push(occ);
    else groups.push({ year, month, items: [occ] });
  }
  return groups;
}
