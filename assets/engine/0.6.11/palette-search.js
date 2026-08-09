/**
 * Blokk-søket (0.6.7): ren tekstmatching for innsettingsmenyene. Matcher
 * mot de SYNLIGE (ta-oversatte) etikettene menyene alt viser, aldri mot
 * nøkler eller re-oversettelser. Diakritikk og store/små bokstaver
 * spiller ingen rolle (NFD-stripp). Ingen DOM - node-testbart.
 */

/** Sammenlignbar form: små bokstaver uten diakritiske tegn. */
export function normalize(str) {
  return String(str ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

/**
 * Rangering for trefflisten: 0 = etiketten starter med søket, 1 = et ord i
 * etiketten starter med søket, 2 = søket finnes i etiketten, -1 = bom.
 * Tomt søk matcher alt (rang 2), så kalleren kan vise hele listen.
 */
export function rankLabel(label, query) {
  const q = normalize(query).trim();
  const l = normalize(label);
  if (!q) return 2;
  if (l.startsWith(q)) return 0;
  if (l.split(/[^a-z0-9]+/).some((word) => word.startsWith(q))) return 1;
  if (l.includes(q)) return 2;
  return -1;
}

/** Sant når etiketten matcher søket (tomt søk matcher alt). */
export function matchLabel(label, query) {
  return rankLabel(label, query) >= 0;
}

/**
 * Filtrer og rangér en liste av innslag mot søket: beste rang først,
 * lik rang beholder listens rekkefølge (stabil sort).
 * @param {Array<object>} items
 * @param {string} query
 * @param {(item: object) => string} getLabel
 */
export function searchItems(items, query, getLabel) {
  return items
    .map((item, i) => ({ item, i, rank: rankLabel(getLabel(item), query) }))
    .filter((x) => x.rank >= 0)
    .sort((a, b) => (a.rank - b.rank) || (a.i - b.i))
    .map((x) => x.item);
}
