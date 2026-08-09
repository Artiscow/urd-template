/**
 * Stegvis versjonsløfting - Urds kjerne-invariant (se docs/adr/0005).
 *
 * All data (blokker, bakgrunnslag, animasjoner, seksjoner) bærer `version`,
 * og hver typedefinisjon oppgir `version` + `migrations` der migrations[n]
 * løfter nøyaktig v(n) → v(n+1) som en ren funksjon (props inn, props ut).
 *
 * Løfting skjer i minnet ved lasting - filene på disk skrives først ved
 * neste publisering. Ved ukjent type eller manglende migrering droppes
 * ALDRI data: innslaget markeres som plassholder og originalen beholdes.
 */

/**
 * Løfter ett datainnslag til definisjonens nåværende versjon.
 *
 * @param {{type?: string, version: number, props: object}} data
 *   Innslag fra innholdsfil (muteres ikke).
 * @param {{version: number, migrations?: Record<number, (props: object) => object>}|undefined} def
 *   Typedefinisjon fra registeret, eller undefined om typen er ukjent.
 * @returns {{ok: boolean, version: number, props: object, placeholder?: string}}
 *   ok=true med løftede props, eller ok=false med `placeholder`-årsak og
 *   originale props urørt ('unknown-type' | 'missing-migration' | 'newer-than-engine').
 */
export function lift(data, def) {
  if (!def) {
    return { ok: false, version: data.version, props: data.props, placeholder: 'unknown-type' };
  }
  // Manglende/ugyldig version (håndredigert eller amputert data) behandles
  // som v1, aldri som gjeldende: uten dette hopper while-løkken over alle
  // migreringene (undefined < n er falsk) og gammelt format leses som nytt.
  const from = Number.isInteger(data.version) ? data.version : 1;
  if (from > def.version) {
    // Innholdet er skrevet av en nyere motor - rendres som plassholder,
    // aldri feiltolket eller nedgradert.
    return { ok: false, version: from, props: data.props, placeholder: 'newer-than-engine' };
  }

  let version = from;
  let props = data.props;
  while (version < def.version) {
    const step = def.migrations && def.migrations[version];
    if (typeof step !== 'function') {
      return { ok: false, version: from, props: data.props, placeholder: 'missing-migration' };
    }
    props = step(structuredClone(props));
    version++;
  }
  return { ok: true, version, props };
}

/** Gjeldende versjon av sidefil-formatet (content/pages/*.json). */
export const PAGE_SCHEMA_VERSION = 1;

/** Gjeldende versjon av site.json-formatet. */
export const SITE_SCHEMA_VERSION = 1;

/**
 * Migreringer på filnivå. Hver funksjon løfter nøyaktig én versjon og
 * får hele sidefilen (klonet) + site.json som kontekst.
 *
 * Tomme siden pre-v1-innbakingen (fase-slippet av v0.6): utviklingsformatene
 * ble versjon 1 igjen, og pre-v1-stegene ble slettet (se ADR-0005).
 * Fra v1.0 fylles de ved hver formatendring.
 */
const pageMigrations = {};

const siteMigrations = {};

/**
 * Løfter site.json til gjeldende schemaVersion. Samme regler som
 * liftPageFile: stegvis, aldri destruktivt, original muteres aldri.
 */
export function liftSiteFile(site) {
  let lifted = structuredClone(site);
  let version = lifted.schemaVersion ?? 1;
  while (version < SITE_SCHEMA_VERSION) {
    const step = siteMigrations[version];
    if (typeof step !== 'function') return site;
    lifted = step(lifted) ?? lifted;
    version++;
    lifted.schemaVersion = version;
  }
  return lifted;
}

/**
 * Løfter en sidefil til gjeldende schemaVersion. Stegvis og aldri
 * destruktivt: mangler et migreringssteg (eller er filen NYERE enn
 * motoren), returneres den urørt i stedet for å feiltolkes.
 *
 * @param {object} page Sidefil, allerede parset
 * @param {object} site site.json (kontekst for omregninger)
 * @returns {object} Løftet kopi (originalen muteres aldri)
 */
export function liftPageFile(page, site) {
  let lifted = structuredClone(page);
  let version = lifted.schemaVersion ?? 1;
  while (version < PAGE_SCHEMA_VERSION) {
    const step = pageMigrations[version];
    if (typeof step !== 'function') return page;
    lifted = step(lifted, site) ?? lifted;
    version++;
    lifted.schemaVersion = version;
  }
  return lifted;
}
