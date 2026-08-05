/**
 * Samlinger (datablokk-mønsteret, ADR-0007): datahenting og rene hjelpere.
 * Hjelperne er uten DOM og testes i tests/samlinger.test.mjs; samling-blokken (blocks/samling.js) bruker dem.
 */
import { dates } from './i18n.js';

/** Gjeldende versjon av samlingsfil-formatet (content/samlinger/<id>.json). */
export const COLLECTION_SCHEMA_VERSION = 1;

/**
 * Sorterer innslag: nyeste dato først (eller eldste når newestFirst er false).
 * Innslag uten dato beholder innbyrdes rekkefølge og havner sist.
 * Muterer aldri input.
 */
export function sortEntries(entries, newestFirst = true) {
  const dated = entries.filter((e) => e.date);
  const undated = entries.filter((e) => !e.date);
  dated.sort((a, b) => (newestFirst ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date)));
  return [...dated, ...undated];
}

/**
 * Grupperer innslag per år (fra dato), nyeste år først; innslag uten dato havner
 * sist i gruppen med year null. Innslagene i hver gruppe er sortert nyeste først.
 * @returns {Array<{year: string|null, entries: object[]}>}
 */
export function groupByYear(entries) {
  const groups = new Map();
  for (const entry of sortEntries(entries, true)) {
    const year = entry.date ? entry.date.slice(0, 4) : null;
    if (!groups.has(year)) groups.set(year, []);
    groups.get(year).push(entry);
  }
  return [...groups.entries()].map(([year, list]) => ({ year, entries: list }));
}

/**
 * Dato-badge-deler fra en ISO-dato: {day: '19', month: 'jul', year: '2026'}.
 * Månedsnavnet følger besøkende-språket (Intl via i18n.js, nb uten init).
 * Ugyldig/manglende dato gir null (visningen dropper badgen).
 */
export function dateBadge(date) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date ?? '');
  if (!m) return null;
  const monthIndex = Number(m[2]) - 1;
  if (monthIndex < 0 || monthIndex > 11) return null;
  return { day: String(Number(m[3])), month: dates().monthsShort[monthIndex], year: m[1] };
}

/** Utkast-overstyring fra editoren (urd-collections-meldingen): id → samlingsdata. */
let draftCollections = null;

export function setCollectionsDraft(collections) {
  draftCollections = collections;
  fetched.clear();
}

/** Hentede samlinger bufres per sidelast (id → Promise<data|null>). */
const fetched = new Map();

/**
 * Henter en samling: utkastet fra editoren vinner (preview), ellers serverfilen.
 * null ved manglende/ugyldig fil - blokken viser tomtilstand, aldri krasj.
 */
export function getCollection(id) {
  if (draftCollections && Object.hasOwn(draftCollections, id)) {
    return Promise.resolve(draftCollections[id]);
  }
  if (!fetched.has(id)) {
    fetched.set(id, fetch(`/content/samlinger/${encodeURIComponent(id)}.json`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => (data && Array.isArray(data.entries) ? data : null))
      .catch(() => null));
  }
  return fetched.get(id);
}
