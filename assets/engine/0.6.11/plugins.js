/**
 * Plugin-lasting for alvor (v0.6 M1). Kontrakten er beskrevet i docs/SKJEMA.md og schema/plugin.schema.json.
 *
 * Løftene her er de samme som for alt annet i Urd: en plugin som feiler stopper aldri siden,
 * og en plugin som er skrevet for en annen motorversjon avvises FØR den får definere noe.
 * register(Urd) kjøres mot et staging-lag: definisjonene tas i bruk kun hvis hele register() fullfører,
 * så en plugin som kaster halvveis etterlater aldri halvferdige registreringer.
 */

import { siteLang, adminLang, addSiteDict, addAdminDict, validateLanguages } from './i18n.js';

/** Tolker «x.y.z» til [x, y, z], eller null når strengen ikke er semver. */
export function parseSemver(text) {
  const m = /^(\d+)\.(\d+)\.(\d+)$/.exec(String(text).trim());
  return m ? [Number(m[1]), Number(m[2]), Number(m[3])] : null;
}

const cmp = (a, b) => (a[0] - b[0]) || (a[1] - b[1]) || (a[2] - b[2]);

/**
 * Minimal, avhengighetsfri semver-intervallsjekk for requiresEngine.
 * Støtter mellomromsseparerte krav som ALLE må holde: >=x.y.z, >x.y.z, <=x.y.z, <x.y.z,
 * =x.y.z / x.y.z (eksakt), ^x.y.z (samme major; for 0.y: samme minor) og ~x.y.z (samme major.minor).
 * Ukjente/uparserbare krav gir false: en plugin med uforståelig krav skal ikke lastes i blinde.
 */
export function satisfiesEngine(version, range) {
  const v = parseSemver(version);
  if (!v || typeof range !== 'string' || !range.trim()) return false;
  for (const part of range.trim().split(/\s+/)) {
    const m = /^(>=|<=|>|<|=|\^|~)?(\d+\.\d+\.\d+)$/.exec(part);
    if (!m) return false;
    const op = m[1] ?? '=';
    const t = parseSemver(m[2]);
    const d = cmp(v, t);
    const ok = op === '>=' ? d >= 0
      : op === '>' ? d > 0
      : op === '<=' ? d <= 0
      : op === '<' ? d < 0
      : op === '^' ? (t[0] === 0
        ? (v[0] === 0 && v[1] === t[1] && d >= 0)
        : (v[0] === t[0] && d >= 0))
      : op === '~' ? (v[0] === t[0] && v[1] === t[1] && d >= 0)
      : d === 0;
    if (!ok) return false;
  }
  return true;
}

const ID_RE = /^[a-z0-9][a-z0-9-]*$/;

/**
 * Speiler kravene i schema/plugin.schema.json (skjemaet kan ikke kjøres i nettleseren uten avhengigheter).
 * @returns {string[]} Feilmeldinger; tom liste = gyldig.
 */
export function validateManifest(manifest) {
  const errors = [];
  if (!manifest || typeof manifest !== 'object') return ['manifestet er ikke et objekt'];
  if (!ID_RE.test(manifest.id ?? '')) errors.push('id mangler eller er ugyldig');
  if (typeof manifest.name !== 'string' || !manifest.name) errors.push('name mangler');
  if (!parseSemver(manifest.version ?? '')) errors.push('version er ikke semver');
  if (typeof manifest.requiresEngine !== 'string' || !manifest.requiresEngine) errors.push('requiresEngine mangler');
  // En ren SPRÅKPAKKE har ingen kode: da er entry og provides valgfrie.
  // Er de likevel oppgitt, gjelder de vanlige kravene.
  const isLanguagePack = Array.isArray(manifest.languages) && manifest.languages.length > 0;
  if (manifest.entry !== undefined || !isLanguagePack) {
    if (typeof manifest.entry !== 'string' || !manifest.entry.endsWith('.js')) errors.push('entry mangler eller er ikke en .js-fil');
  }
  if (manifest.provides !== undefined || !isLanguagePack) {
    if (!manifest.provides || typeof manifest.provides !== 'object') errors.push('provides mangler');
  }
  if (manifest.languages !== undefined) errors.push(...validateLanguages(manifest.languages));
  // Valgfrie flerspråk-felt (additive fra 0.6.8): locales lover locales/<lang>.js-filer,
  // names er visningsnavn per admin-språk.
  if (manifest.locales !== undefined && typeof manifest.locales !== 'boolean') errors.push('locales må være boolsk');
  if (manifest.names !== undefined && (typeof manifest.names !== 'object' || manifest.names === null || Array.isArray(manifest.names)
    || Object.values(manifest.names).some((v) => typeof v !== 'string' || !v))) errors.push('names må være et objekt med språkkode til navn');
  return errors;
}

/** Registerslagene en plugin kan definere i, og manifest-nøkkelen som lover dem. */
const KINDS = [
  ['blocks', 'blocks'],
  ['sections', 'sectionPresets'],
  ['backgrounds', 'backgrounds'],
  ['animations', 'animations'],
  ['maler', 'maler'],
];

/**
 * Staging-lag rundt Urd-registrene: register(Urd) definerer mot dette,
 * og commit() tar definisjonene i bruk først når hele register() har fullført.
 * pluginName merker definisjonene (def.fromPlugin), så menyene kan vise
 * plugin-innhold i egne «Fra plugins»-seksjoner.
 * @returns {{staged: object, commit: () => string[], defined: () => Record<string, string[]>}}
 */
export function createStagedUrd(Urd, pluginName = null) {
  const captured = new Map(KINDS.map(([kind]) => [kind, []]));
  const staged = {};
  for (const [kind] of KINDS) {
    staged[kind] = {
      define(id, def) {
        if (!ID_RE.test(id ?? '')) throw new Error(`Urd.${kind}: ugyldig id '${id}'`);
        captured.get(kind).push([id, pluginName ? { ...def, fromPlugin: pluginName } : def]);
      },
      get: (id) => Urd[kind].get(id),
      ids: () => Urd[kind].ids(),
    };
  }
  return {
    staged,
    /** @returns {string[]} Advarsler (f.eks. id-kollisjoner som ble hoppet over) */
    commit() {
      const warnings = [];
      for (const [kind] of KINDS) {
        for (const [id, def] of captured.get(kind)) {
          try {
            Urd[kind].define(id, def);
          } catch (err) {
            warnings.push(`${kind}/${id}: ${err.message}`);
          }
        }
      }
      return warnings;
    },
    defined() {
      const out = {};
      for (const [kind, provideKey] of KINDS) {
        out[provideKey] = captured.get(kind).map(([id]) => id);
      }
      return out;
    },
  };
}

/**
 * Sammenlikner hva manifestet LOVER (provides) med hva register() faktisk definerte.
 * Avvik er aldri fatalt (pluginen virker), men logges så plugin-forfatteren ser kontraktsbruddet.
 * @returns {string[]} Avviksbeskrivelser
 */
export function checkProvides(provides, defined) {
  const diffs = [];
  for (const [, provideKey] of KINDS) {
    const promised = provides?.[provideKey] ?? [];
    const actual = defined[provideKey] ?? [];
    for (const id of promised) {
      if (!actual.includes(id)) diffs.push(`lover ${provideKey}/${id} men definerte den ikke`);
    }
    for (const id of actual) {
      if (!promised.includes(id)) diffs.push(`definerte ${provideKey}/${id} uten å love den i provides`);
    }
  }
  return diffs;
}

/** Plugins som alt er lastet i denne siden: import kan ikke angres, så hver id lastes maks én gang. */
const loadedPlugins = new Set();

/* ---------- Plugin-locales (ADR-0012) ---------- */

/** Plugin-ider med locales: true som er lastet - brukes ved språkbytte i preview. */
const localePlugins = new Set();

/** Er dette editorens forhåndsvisning? Samme deteksjon som boot. */
const isPreview = () => new URLSearchParams(location.search).get('preview') === '1';

/**
 * Laster én plugin-ordbok: nb-basen i bunn, valgt språk oppå (manglende
 * språkfil faller stille til nb, samme modell som admin-ordboka).
 * @returns {Promise<Record<string, string>|null>} null når selv basen mangler
 */
async function loadPluginLocale(id, lang) {
  const load = async (code) => (await import(/* @vite-ignore */ `/plugins/${id}/locales/${code}.js`)).default.strings;
  try {
    const base = await load('nb');
    const extra = lang !== 'nb' ? await load(lang).catch(() => null) : null;
    return { ...base, ...(extra ?? {}) };
  } catch {
    console.warn(`Urd: plugin '${id}' lover locales, men locales/nb.js kunne ikke lastes`);
    return null;
  }
}

/** Legger pluginens tekster i registrene: besøkende-register med SITE-språket,
 *  og i preview I TILLEGG admin-registret med ADMIN-språket (canvas-chromen). */
async function applyPluginLocale(id) {
  const strings = await loadPluginLocale(id, siteLang());
  if (!strings) return;
  addSiteDict(strings);
  localePlugins.add(id);
  if (isPreview()) {
    const adminStrings = adminLang() === siteLang() ? strings : await loadPluginLocale(id, adminLang());
    if (adminStrings) addAdminDict(adminStrings);
  }
}

/**
 * Legger plugin-tekstene inn i besøkende-registret på nytt. Kalles etter
 * initSiteLocale ved språkbytte i preview: initSiteLocale bygger ordboka
 * fra motorens nb-base, så plugin-nøklene må legges oppå igjen.
 */
export async function applyPluginSiteLocales() {
  for (const id of localePlugins) {
    const strings = await loadPluginLocale(id, siteLang());
    if (strings) addSiteDict(strings);
  }
}

/**
 * Laster ÉN plugin: manifest-fetch → validering → requiresEngine-sjekk →
 * import → register(staging) → commit → provides-kontroll. Feil på ett steg
 * hopper over pluginen med tydelig logg; siden lever alltid videre.
 */
export async function loadPluginById(Urd, engineVersion, id) {
  if (loadedPlugins.has(id)) return;
  try {
    const manifest = await (await fetch(`/plugins/${id}/plugin.json`)).json();
    const errors = validateManifest(manifest);
    if (errors.length) {
      console.warn(`Urd: plugin '${id}' har ugyldig manifest: ${errors.join('; ')}`);
      return;
    }
    if (!satisfiesEngine(engineVersion, manifest.requiresEngine)) {
      console.warn(`Urd: plugin '${id}' krever motor '${manifest.requiresEngine}', denne er ${engineVersion} - hoppes over`);
      return;
    }
    // Ordboka lastes FØR register()/render, så pluginens t()/ta()-oppslag
    // treffer fra første rendering. Besøkende: loadPlugins kjører etter
    // initSiteLocale i boot. Preview: urd-plugins-meldingen kommer etter
    // initAdminLocale, så begge registrene er klare.
    if (manifest.locales === true) await applyPluginLocale(id);
    // Språkpakkens språk meldes inn før noe rendres, så previewen kjenner
    // et utkast-aktivert pakkespråk uten å lese manifestene på nytt.
    // Pakkemodulen hentes kun her, aldri for en plugin uten languages.
    if (manifest.languages?.length) {
      const { registerPackLanguages } = await import(/* @vite-ignore */ '/assets/urd/language-packs.js');
      registerPackLanguages(id, manifest.languages);
    }
    // Ren språkpakke: ingen entry, ingenting å kjøre.
    if (!manifest.entry) {
      loadedPlugins.add(id);
      return;
    }
    const mod = await import(/* @vite-ignore */ `/plugins/${id}/${manifest.entry}`);
    if (typeof mod.register !== 'function') {
      console.warn(`Urd: plugin '${id}' mangler register()-eksport`);
      return;
    }
    // fromPlugin bærer VISNINGSNAVNET (manifest.names for admin-språket når
    // det finnes): feltet brukes kun i editor-chromen («Fra pluginen …»).
    const displayName = manifest.names?.[adminLang()] ?? manifest.name ?? id;
    const staging = createStagedUrd(Urd, displayName);
    mod.register(staging.staged);
    for (const warning of staging.commit()) {
      console.warn(`Urd: plugin '${id}': ${warning}`);
    }
    for (const diff of checkProvides(manifest.provides, staging.defined())) {
      console.warn(`Urd: plugin '${id}' bryter provides-kontrakten: ${diff}`);
    }
    loadedPlugins.add(id);
  } catch (err) {
    console.warn(`Urd: plugin '${id}' kunne ikke lastes`, err);
  }
}

/** Laster en eksplisitt liste plugin-ider (editorens utkast i preview). */
export async function loadPluginList(Urd, engineVersion, ids) {
  for (const id of ids ?? []) await loadPluginById(Urd, engineVersion, id);
}

/**
 * Laster aktive plugins fra plugins/plugins.json mot en gitt motorversjon.
 * @param {typeof window.Urd} Urd
 * @param {string} engineVersion Motorversjonen (fra urd.json)
 */
export async function loadPlugins(Urd, engineVersion) {
  let index;
  try {
    index = await (await fetch('/plugins/plugins.json')).json();
  } catch {
    return; // ingen plugin-indeks er helt greit
  }
  await loadPluginList(Urd, engineVersion, index.enabled);
}
