/**
 * Plugin loading per docs/SCHEMA.md: a failing plugin never stops the site, one for another engine version is refused, and only a whole register() is adopted.
 * Notes: docs/engine-notes/plugins.md (Urd repository).
 */

import { siteLang, adminLang, addSiteDict, addAdminDict, validateLanguages } from './i18n.js';

/** Parses «x.y.z» into [x, y, z], or null when the string is not semver. */
export function parseSemver(text) {
  const m = /^(\d+)\.(\d+)\.(\d+)$/.exec(String(text).trim());
  return m ? [Number(m[1]), Number(m[2]), Number(m[3])] : null;
}

/**
 * Parses an engine version into its numbers, or null: three or more without leading zeros, and when more than three, the last is not 0, so no two rank equal.
 */
export function parseEngineVersion(text) {
  const s = String(text).trim();
  return /^(?:0|[1-9]\d*)(?:\.(?:0|[1-9]\d*)){2}(?:(?:\.(?:0|[1-9]\d*))*\.[1-9]\d*)?$/.test(s) ? s.split('.').map(Number) : null;
}

/** Compares two versions number by number, a missing number counting as 0, so 1.2 < 1.2.1 < 1.2.1.1 < 1.3. */
function cmp(a, b) {
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    const d = (a[i] ?? 0) - (b[i] ?? 0);
    if (d) return d;
  }
  return 0;
}

/**
 * Whether a version meets requiresEngine: every space-separated part, >=, >, <=, <, = or bare, ^ (same major; same minor at 0.x) or ~ (same minor), holds.
 */
export function satisfiesEngine(version, range) {
  const v = parseEngineVersion(version);
  if (!v || typeof range !== 'string' || !range.trim()) return false;
  for (const part of range.trim().split(/\s+/)) {
    const m = /^(>=|<=|>|<|=|\^|~)?([\d.]+)$/.exec(part);
    const t = m && parseEngineVersion(m[2]);
    if (!t) return false;
    const op = m[1] ?? '=';
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
 * Mirrors the requirements in schema/plugin.schema.json (the schema cannot run in the browser without dependencies).
 * @returns {string[]} Error messages; empty list = valid.
 */
export function validateManifest(manifest) {
  const errors = [];
  if (!manifest || typeof manifest !== 'object') return ['the manifest is not an object'];
  if (!ID_RE.test(manifest.id ?? '')) errors.push('id is missing or invalid');
  if (typeof manifest.name !== 'string' || !manifest.name) errors.push('name is missing');
  if (!parseSemver(manifest.version ?? '')) errors.push('version is not semver');
  if (typeof manifest.requiresEngine !== 'string' || !manifest.requiresEngine) errors.push('requiresEngine is missing');
  // A pure LANGUAGE PACK has no code: entry and provides are then optional.
  // If they are given anyway, the usual requirements apply.
  const isLanguagePack = Array.isArray(manifest.languages) && manifest.languages.length > 0;
  if (manifest.entry !== undefined || !isLanguagePack) {
    if (typeof manifest.entry !== 'string' || !manifest.entry.endsWith('.js')) errors.push('entry is missing or is not a .js file');
  }
  if (manifest.provides !== undefined || !isLanguagePack) {
    if (!manifest.provides || typeof manifest.provides !== 'object') errors.push('provides is missing');
  }
  if (manifest.languages !== undefined) errors.push(...validateLanguages(manifest.languages));
  // Optional multilingual fields: locales promises locales/<lang>.js files, names is the display name per admin language.
  if (manifest.locales !== undefined && typeof manifest.locales !== 'boolean') errors.push('locales must be a boolean');
  if (manifest.names !== undefined && (typeof manifest.names !== 'object' || manifest.names === null || Array.isArray(manifest.names)
    || Object.values(manifest.names).some((v) => typeof v !== 'string' || !v))) errors.push('names must be an object mapping language code to name');
  return errors;
}

/** The registry kinds a plugin can define in, and the manifest key that promises them. */
const KINDS = [
  ['blocks', 'blocks'],
  ['sections', 'sectionPresets'],
  ['backgrounds', 'backgrounds'],
  ['animations', 'animations'],
  ['templates', 'templates'],
  ['commands', 'commands'],
];

/**
 * A staging layer over the registries: `staged` collects register()'s definitions, marked def.fromPlugin = pluginName; commit() adopts those with free ids.
 * @returns {{staged: object, commit: () => string[], defined: () => Record<string, string[]>}}
 */
export function createStagedUrd(Urd, pluginName = null) {
  const captured = new Map(KINDS.map(([kind]) => [kind, []]));
  const staged = {};
  for (const [kind] of KINDS) {
    staged[kind] = {
      define(id, def) {
        if (!ID_RE.test(id ?? '')) throw new Error(`Urd.${kind}: invalid id '${id}'`);
        captured.get(kind).push([id, pluginName ? { ...def, fromPlugin: pluginName } : def]);
      },
      get: (id) => Urd[kind].get(id),
      ids: () => Urd[kind].ids(),
    };
  }
  // Legacy alias (ADR-0021): plugins written before the rename register their templates through urd.maler.
  staged.maler = staged.templates;
  return {
    staged,
    /** @returns {string[]} Warnings (e.g. id collisions that were skipped) */
    commit() {
      const warnings = [];
      for (const [kind] of KINDS) {
        for (const [id, def] of captured.get(kind)) {
          if (Urd[kind].isReserved?.(id)) {
            warnings.push(`${kind}/${id}: '${id}' is the engine's own`);
            continue;
          }
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
 * Compares the manifest's `provides` with what register() defined, and returns each mismatch for the log; a mismatch is never fatal.
 * @returns {string[]} Mismatch descriptions
 */
export function checkProvides(provides, defined) {
  const diffs = [];
  for (const [, provideKey] of KINDS) {
    // Dual-read (ADR-0021): the manifest key was 'maler' before the rename.
    const promised = provides?.[provideKey]
      ?? (provideKey === 'templates' ? provides?.maler : undefined)
      ?? [];
    const actual = defined[provideKey] ?? [];
    for (const id of promised) {
      if (!actual.includes(id)) diffs.push(`promises ${provideKey}/${id} but never defined it`);
    }
    for (const id of actual) {
      if (!promised.includes(id)) diffs.push(`defined ${provideKey}/${id} without promising it in provides`);
    }
  }
  return diffs;
}

/** A picture a plugin names for a design: a picture file on the site itself (a path from its root, never a protocol-relative address). */
const DESIGN_PICTURE = /^\/(?!\/)[A-Za-z0-9._~/-]+\.(?:webp|png|jpe?g|avif|svg)$/;

/**
 * Design picker items from a plugin block's def.designs, `{ prop, items: [{ id, label | labelKey, about | aboutKey, picture? }] }`; null under two valid ones.
 * @param {object} def the block's definition
 * @param {(key: string) => string} translate
 * @returns {{prop: string, items: Array<{id: string, label: string, about: string, picture: string}>}|null}
 */
export function pluginBlockDesigns(def, translate) {
  const designs = def?.designs;
  if (!designs || typeof designs.prop !== 'string' || !/^[A-Za-z][A-Za-z0-9]{0,39}$/.test(designs.prop) || !Array.isArray(designs.items)) return null;
  const seen = new Set();
  const items = [];
  for (const item of designs.items) {
    if (typeof item?.id !== 'string' || !/^[A-Za-z0-9][A-Za-z0-9-]{0,39}$/.test(item.id) || seen.has(item.id)) continue;
    seen.add(item.id);
    const picture = typeof item.picture === 'string' && DESIGN_PICTURE.test(item.picture) && !item.picture.includes('..') ? item.picture : '';
    items.push({
      id: item.id,
      label: item.labelKey ? translate(item.labelKey) : String(item.label ?? item.id),
      about: item.aboutKey ? translate(item.aboutKey) : String(item.about ?? ''),
      picture,
    });
  }
  return items.length >= 2 ? { prop: designs.prop, items } : null;
}

/** Plugins already loaded in this page: an import cannot be undone, so each id is loaded at most once. */
const loadedPlugins = new Set();

/**
 * Network seam: everything the loader fetches or imports goes through here, so tests in node can replace it.
 */
export const io = {
  fetchJson: async (url) => (await fetch(url)).json(),
  importModule: (url) => import(/* @vite-ignore */ url),
};

/* ---------- Plugin-locales (ADR-0012) ---------- */

/** Loaded plugin ids with locales: true - used on language switches in the preview. */
const localePlugins = new Set();

/** Is this the editor's preview? Same detection as boot. */
const isPreview = () => new URLSearchParams(location.search).get('preview') === '1';

/**
 * Loads one plugin dictionary: its locales/nb.js with the language's file on top, the language left out silently when its file is missing.
 * @returns {Promise<Record<string, string>|null>} null when even the base is missing
 */
async function loadPluginLocale(id, lang) {
  const load = async (code) => (await io.importModule(`/plugins/${id}/locales/${code}.js`)).default.strings;
  try {
    const [base, extra] = await Promise.all([
      load('nb'),
      lang !== 'nb' ? load(lang).catch(() => null) : null,
    ]);
    return { ...base, ...(extra ?? {}) };
  } catch {
    console.warn(`Urd: plugin '${id}' promises locales, but locales/nb.js could not be loaded`);
    return null;
  }
}

/**
 * Loads a plugin's strings: the site language's, and in the preview the admin language's too.
 *  @returns {Promise<{site: object, admin: object|null}|null>} */
async function loadPluginLocales(id) {
  const site = await loadPluginLocale(id, siteLang());
  if (!site) return null;
  let admin = null;
  if (isPreview()) admin = adminLang() === siteLang() ? site : await loadPluginLocale(id, adminLang());
  return { site, admin };
}

/** Puts loaded plugin strings into the registries. */
function applyPluginLocales(id, loaded) {
  if (!loaded) return;
  addSiteDict(loaded.site);
  localePlugins.add(id);
  if (loaded.admin) addAdminDict(loaded.admin);
}

/**
 * Adds the visitor strings of the plugins with locales again in the current site language, after initSiteLocale has rebuilt the dictionary from the bokmål base.
 */
export async function applyPluginSiteLocales() {
  for (const id of localePlugins) {
    const strings = await loadPluginLocale(id, siteLang());
    if (strings) addSiteDict(strings);
  }
}

/**
 * Prepares one plugin without registering it: manifest and checks, then at once its dictionary, entry module and, with `packs`, pack languages; null on failure.
 * @returns {Promise<{manifest: object, mod: object|null, locales: object|null}|null>}
 */
async function preparePlugin(engineVersion, id, packs = true) {
  try {
    const manifest = await io.fetchJson(`/plugins/${id}/plugin.json`);
    const errors = validateManifest(manifest);
    if (errors.length) {
      console.warn(`Urd: plugin '${id}' has an invalid manifest: ${errors.join('; ')}`);
      return null;
    }
    if (!satisfiesEngine(engineVersion, manifest.requiresEngine)) {
      console.warn(`Urd: plugin '${id}' requires engine '${manifest.requiresEngine}', this is ${engineVersion} - skipped`);
      return null;
    }
    // The dictionary, the language pack and the entry module need only the manifest, so they load at once; commitPlugin applies the dictionary before register().
    const [locales, , mod] = await Promise.all([
      manifest.locales === true ? loadPluginLocales(id) : null,
      // Registers the plugin's pack languages through language-packs.js, imported only for a plugin with languages and only when `packs` is on.
      packs && manifest.languages?.length
        ? io.importModule('/assets/urd/language-packs.js').then(({ registerPackLanguages }) => registerPackLanguages(id, manifest.languages))
        : null,
      // Pure language pack: no entry, nothing to run.
      manifest.entry ? io.importModule(`/plugins/${id}/${manifest.entry}`) : null,
    ]);
    return { manifest, mod, locales };
  } catch (err) {
    console.warn(`Urd: plugin '${id}' could not be loaded`, err);
    return null;
  }
}

/**
 * Registers one prepared plugin: dictionary, register(staging), commit, provides check; called in list order, so id collisions always resolve the same way.
 */
function commitPlugin(Urd, id, prepared) {
  const { manifest, mod, locales } = prepared;
  applyPluginLocales(id, locales);
  if (!mod) {
    loadedPlugins.add(id);
    return;
  }
  if (typeof mod.register !== 'function') {
    console.warn(`Urd: plugin '${id}' is missing a register() export`);
    return;
  }
  // fromPlugin carries the DISPLAY NAME (manifest.names for the admin language when it exists): the field is used only in the editor chrome (tip.blocks.fromPlugin).
  const displayName = manifest.names?.[adminLang()] ?? manifest.name ?? id;
  const staging = createStagedUrd(Urd, displayName);
  try {
    mod.register(staging.staged);
  } catch (err) {
    console.warn(`Urd: plugin '${id}' could not be loaded`, err);
    return;
  }
  for (const warning of staging.commit()) {
    console.warn(`Urd: plugin '${id}': ${warning}`);
  }
  for (const diff of checkProvides(manifest.provides, staging.defined())) {
    console.warn(`Urd: plugin '${id}' breaks the provides contract: ${diff}`);
  }
  loadedPlugins.add(id);
}

/** List loads run one after another, so two overlapping lists (a draft toggled while a load is in flight) commit in the order they were asked for. */
let listQueue = Promise.resolve();

/**
 * Loads a list of plugin ids: all fetched in parallel, then registered one by one in list order; an id already loaded is not fetched again.
 * @param {{packs?: boolean}} [options] `packs: false` on a visitor's page (preparePlugin)
 */
export function loadPluginList(Urd, engineVersion, ids, { packs = true } = {}) {
  const run = listQueue.then(async () => {
    const wanted = [...new Set(ids ?? [])].filter((id) => !loadedPlugins.has(id));
    const prepared = await Promise.all(wanted.map((id) => preparePlugin(engineVersion, id, packs)));
    wanted.forEach((id, i) => {
      if (prepared[i] && !loadedPlugins.has(id)) commitPlugin(Urd, id, prepared[i]);
    });
  });
  listQueue = run.catch(() => {});
  return run;
}

/**
 * The block, background and animation types a page, nav and footer use: the types in `blocks` and `layers` lists, and of `animation`, `hover` and `blocksHover`.
 * @param {...unknown} parts The page, the site's nav, its footer
 * @returns {{blocks: Set<string>, backgrounds: Set<string>, animations: Set<string>}}
 */
export function pageTypes(...parts) {
  const types = { blocks: new Set(), backgrounds: new Set(), animations: new Set() };
  const seen = new Set();
  const walk = (value, depth) => {
    if (!value || typeof value !== 'object' || depth > 40 || seen.has(value)) return;
    seen.add(value);
    if (Array.isArray(value)) { for (const item of value) walk(item, depth + 1); return; }
    for (const [key, child] of Object.entries(value)) {
      if (key === 'blocks' && Array.isArray(child)) for (const b of child) if (typeof b?.type === 'string') types.blocks.add(b.type);
      if (key === 'layers' && Array.isArray(child)) for (const l of child) if (typeof l?.type === 'string') types.backgrounds.add(l.type);
      if ((key === 'animation' || key === 'hover' || key === 'blocksHover') && typeof child?.type === 'string' && child.type) types.animations.add(child.type);
      walk(child, depth + 1);
    }
  };
  for (const part of parts) walk(part, 0);
  return types;
}

/**
 * Whether a page needs a plugin: a type it uses that is neither defined nor reserved as the engine's own (core-types.js), a type known only by an alias included.
 * @param {{blocks: Set<string>, backgrounds: Set<string>, animations: Set<string>}} types pageTypes
 * @param {typeof window.Urd} Urd
 */
export function needsPlugins(types, Urd) {
  return ['blocks', 'backgrounds', 'animations'].some((kind) => {
    const own = new Set(Urd[kind].ids());
    return [...types[kind]].some((type) => !own.has(type) && !Urd[kind].isReserved?.(type));
  });
}

/**
 * The engine version a module's address names by its folder, `/assets/engine/<version>/`, or null where it names no valid one.
 * @param {string} url A module's import.meta.url
 * @returns {string|null}
 */
export function engineVersionOf(url) {
  let path = '';
  try { path = new URL(url).pathname; } catch { return null; }
  const folder = /\/assets\/engine\/([^/]+)\/[^/]+\.js$/.exec(path)?.[1] ?? '';
  return folder && parseEngineVersion(folder) ? folder : null;
}

/**
 * Loads the enabled plugins from plugins/plugins.json against a given engine version, on a visitor's page.
 * @param {typeof window.Urd} Urd
 * @param {string} engineVersion The engine version (urd.js engineVersion)
 */
export async function loadPlugins(Urd, engineVersion) {
  let index;
  try {
    index = await io.fetchJson('/plugins/plugins.json');
  } catch {
    return; // no plugin index is perfectly fine
  }
  await loadPluginList(Urd, engineVersion, index.enabled, { packs: false });
}
