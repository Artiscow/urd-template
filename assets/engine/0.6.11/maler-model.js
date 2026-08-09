/**
 * Mal-modellen (0.6.7): rene hjelpere for brukermaler i content/maler/.
 *
 * Kontrakten (docs/SKJEMA.md, Maler): malfilen lagrer opphavs-id-ene urørt;
 * HVER innsetting dypkloner og tildeler nye id-er FØR posting, så samme mal
 * kan settes inn flere ganger uten kollisjon. Blokkgrupper lagres med frames
 * som de står; normalisering (anker + klem innenfor seksjonen) skjer her ved
 * innsetting, aldri ved lagring. Ingen DOM - node-testbart.
 */
import { slugify } from './imageTools.js';
import { groupDelta } from './selection.js';

/** Gjeldende versjon av malfil-formatet (content/maler/*.json). */
export const MAL_SCHEMA_VERSION = 1;

/** Gyldige mal-slag; nyttelast-nøkkelen i filen er lik slaget. */
export const MAL_KINDS = ['section', 'blocks', 'page'];

/** Mal-id fra visningsnavnet (samme id-regime som samlinger); tom streng
 *  betyr ugyldig navn og skal avvises av kalleren. */
export function malId(name) {
  return slugify(String(name ?? ''), '');
}

const r2 = (v) => Math.round(v * 100) / 100;

/**
 * Klargjør en seksjons-mal for innsetting: dyp klone med ny seksjons-id og
 * nye blokk-id-er. Geometri og props røres ikke.
 * @param {object} section Seksjonen fra malfilen (muteres ikke)
 * @param {(prefix: string) => string} makeId Id-fabrikken (sections/presets.js)
 */
export function cloneSectionForInsert(section, makeId) {
  const out = structuredClone(section);
  out.id = makeId('sec');
  for (const block of out.blocks ?? []) block.id = makeId('blk');
  return out;
}

/**
 * Klargjør en side-mal for innsetting: dyp klone der meta peker på den NYE
 * siden (id er sidens slug, validert av kalleren mot reserverte navn og
 * eksisterende sider - aldri en makeId-streng), og alle seksjoner og blokker
 * får nye id-er. Geometri, props og schemaVersion røres ikke.
 * @param {object} page Sidefilen fra malen (muteres ikke)
 * @param {(prefix: string) => string} makeId Id-fabrikken (sections/presets.js)
 * @param {{id: string, title: string}} meta Den nye sidens slug og tittel
 */
export function clonePageForInsert(page, makeId, { id, title }) {
  const out = structuredClone(page);
  out.meta = { ...out.meta, id, title };
  for (const section of out.sections ?? []) {
    section.id = makeId('sec');
    for (const block of section.blocks ?? []) block.id = makeId('blk');
  }
  return out;
}

/**
 * Klargjør en blokkgruppe-mal for innsetting: dyp klone med nye id-er, hele
 * gruppen flyttet så øvre venstre hjørne treffer ankeret (klemt innenfor
 * seksjonen av groupDelta), og minBottom for seksjonsvekst (urd-add-blocks).
 * Uten anker beholdes de lagrede posisjonene (kun klem). Innbyrdes oppsett
 * bevares alltid; frames.mobile følger med urørt (som lim inn).
 * @param {Array<object>} blocks Blokkene fra malfilen (muteres ikke)
 * @param {(prefix: string) => string} makeId Id-fabrikken
 * @param {{anchor?: {x: number, y: number}|null}} [opts] Anker i seksjonskoordinater (x i %, y i px)
 * @returns {{blocks: Array<object>, minBottom: number}}
 */
export function cloneBlocksForInsert(blocks, makeId, { anchor = null } = {}) {
  const out = structuredClone(blocks);
  for (const block of out) block.id = makeId('blk');
  const frames = out.map((b) => b.frames.desktop);
  const minX = Math.min(...frames.map((f) => f.x));
  const minY = Math.min(...frames.map((f) => f.y));
  const { dx, dy } = anchor
    ? groupDelta(frames, anchor.x - minX, anchor.y - minY)
    : groupDelta(frames, 0, 0);
  for (const f of frames) {
    f.x = r2(f.x + dx);
    f.y = Math.round(f.y + dy);
  }
  const minBottom = Math.max(...frames.map((f) => f.y + f.h));
  return { blocks: out, minBottom };
}
