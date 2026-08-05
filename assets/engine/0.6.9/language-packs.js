/**
 * Språkpakker (ADR-0012): plugins som KUN leverer oversettelser. En pakke
 * deklarerer språkene sine i manifestet:
 *
 *   "languages": [{ "code": "sv", "name": "Svenska", "site": true, "admin": false }]
 *
 * og legger filene i plugins/<id>/locales/site/<kode>.js og
 * plugins/<id>/locales/admin/<kode>.js - samme form som motorens egne
 * locale-filer, og samme overlay-regel: bokmålsbasen ligger i bunn, så en
 * pakke kan dekke alt eller bare deler. En pakke kan ikke overstyre et
 * innebygd språk (da ville en plugin kunne kapre nb), og trenger verken
 * entry eller provides: den har ingen kode å kjøre.
 *
 * Modulen er BEVISST utenfor motorens statiske import-lukning (ingen
 * modulepreload): den hentes kun når noen faktisk ber om et språk kjernen
 * ikke har, eller når en plugin med languages lastes. Den rene valideringen
 * av manifest-feltet bor derfor i i18n.js, som alt er lastet.
 */
import { LANG_CODE_RE, isBuiltinLang, validateLanguages } from './i18n.js';

/** Kode til { code, name, site, admin, plugin } for pakkene som er kjent nå. */
const registry = new Map();

/**
 * Melder inn språkene til én plugin. Kalles av plugin-lasteren, så pakker i
 * editorens UTKASTLISTE er kjent i previewen før de er publisert. Ugyldige
 * innslag hoppes over enkeltvis: resten av pakken skal fortsatt virke.
 */
export function registerPackLanguages(pluginId, list) {
  for (const entry of Array.isArray(list) ? list : []) {
    if (validateLanguages([entry]).length) continue;
    registry.set(entry.code, {
      code: entry.code,
      name: entry.name,
      site: entry.site === true,
      admin: entry.admin === true,
      plugin: pluginId,
    });
  }
}

/* Manifest-gjennomgangen kjøres maks én gang per side: den er kun nødvendig
   når noen ber om et språk kjernen ikke har, og svaret endrer seg ikke. */
let scan = null;

async function scanEnabledPlugins() {
  let index;
  try {
    index = await (await fetch('/plugins/plugins.json')).json();
  } catch {
    return; // ingen plugin-indeks er helt greit
  }
  // Manifestene hentes parallelt: de gjelder ikke hverandre, og dette står
  // foran første rendering når siden bruker et pakkespråk.
  await Promise.all((index.enabled ?? []).map(async (id) => {
    try {
      const manifest = await (await fetch(`/plugins/${id}/plugin.json`)).json();
      registerPackLanguages(id, manifest.languages);
    } catch { /* uleselig manifest: plugin-lasteren advarer om det samme */ }
  }));
}

/** Språkene de aktiverte pakkene tilbyr (manifestene leses ved første kall). */
export async function packLanguages() {
  scan ??= scanEnabledPlugins();
  await scan;
  return [...registry.values()];
}

/**
 * Finner pakken som eier en språkkode. Registeret sjekkes først (plugins
 * som alt er lastet), deretter leses manifestene.
 */
async function findPack(code) {
  if (registry.has(code)) return registry.get(code);
  await packLanguages();
  return registry.get(code) ?? null;
}

/**
 * Henter tekstene en pakke tilbyr for ett register.
 * @param {string} code Språkkoden (aldri et innebygd språk)
 * @param {'site'|'admin'} kind
 * @returns {Promise<Record<string, string>|null>} null når ingen pakke dekker det
 */
export async function loadPackStrings(code, kind) {
  if (!LANG_CODE_RE.test(String(code ?? '')) || isBuiltinLang(code)) return null;
  const pack = await findPack(code);
  if (!pack || pack[kind] !== true) return null;
  try {
    const mod = await import(`/plugins/${pack.plugin}/locales/${kind}/${code}.js`);
    return mod.default?.strings ?? null;
  } catch {
    console.warn(`Urd: språkpakken '${pack.plugin}' lover ${kind}-tekster for '${code}', men locales/${kind}/${code}.js kunne ikke lastes`);
    return null;
  }
}
