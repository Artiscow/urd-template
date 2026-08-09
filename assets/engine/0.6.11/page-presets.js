/**
 * Innebygde side-maler («startpakker», 0.6.7.12): hele sider komponert av
 * kjerne-seksjonspresets, vist i «Ny side fra mal»-rutenettet i Sider-panelet
 * under gruppen Innebygde. Kode-definerte (ikke content/maler/-filer) så de
 * følger motorversjonen, alltid finnes på ferske kloner og holder brukerens
 * egen mal-liste ren.
 *
 * Kun kjerne-presets refereres (plugins kan være avslått). create() kjøres
 * ved bygging, så seed-tekstene oversettes da (ADR-0012) og makeId gir ferske
 * id-er; ingen re-id trengs ved innsetting. EDITOR-ONLY: importeres kun av
 * admin ($engine-bundelen), aldri av besøkende-lukningen (modulepreload-
 * testen vokter).
 */
import { registerSectionPresets } from './sections/presets.js';
import { PAGE_SCHEMA_VERSION } from './migrate.js';

/* Seksjons-defs samles med validate.mjs-trikset: registreringen trenger kun
   en define-krok, ikke hele Urd-objektet. */
const defs = new Map();
registerSectionPresets({ sections: { define: (id, def) => defs.set(id, def) } });

/** Startpakkene i visningsrekkefølge; sections er kjerne-preset-id-er. */
export const PAGE_PRESETS = [
  { id: 'landing', labelKey: 'pageTemplate.landing', sections: ['hero', 'funksjonskort', 'statistikk', 'sitat', 'cta'] },
  { id: 'om-oss', labelKey: 'pageTemplate.about', sections: ['hero-sentrert', 'team', 'tidslinje', 'sponsorer', 'cta'] },
  { id: 'kontakt', labelKey: 'pageTemplate.contact', sections: ['hero-sentrert', 'kontakt', 'faq'] },
  { id: 'portefolje', labelKey: 'pageTemplate.portfolio', sections: ['hero-sentrert', 'galleri', 'sitat', 'cta'] },
  { id: 'arrangement', labelKey: 'pageTemplate.event', sections: ['hovedoppslag', 'arrangementer', 'steg', 'faq', 'cta'] },
];

/**
 * Bygger en komplett, gyldig sidefil fra en startpakke.
 * @param {string} id Startpakke-id fra PAGE_PRESETS
 * @param {{pageId: string, title: string}} meta Den nye sidens slug og tittel
 * @returns {object|null} Sidefil, eller null ved ukjent id
 */
export function buildPagePreset(id, { pageId, title }) {
  const preset = PAGE_PRESETS.find((p) => p.id === id);
  if (!preset) return null;
  return {
    schemaVersion: PAGE_SCHEMA_VERSION,
    meta: { id: pageId, title },
    sections: preset.sections.map((sid) => defs.get(sid).create()),
  };
}
