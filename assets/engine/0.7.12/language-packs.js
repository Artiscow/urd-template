/**
 * Language packs (ADR-0012): plugins with only translations, in plugins/<id>/locales/, over the bokmål base.
 * A pack never overrides a built-in language.
 */
import { LANG_CODE_RE, isBuiltinLang, validateLanguages } from './i18n.js';

/** Code to { code, name, site, admin, plugin } for the packs known so far. */
const registry = new Map();

/**
 * Registers one plugin's languages, skipping an invalid entry alone.
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

/* The manifest scan runs at most once per page. */
let scan = null;

async function scanEnabledPlugins() {
  let index;
  try {
    index = await (await fetch('/plugins/plugins.json')).json();
  } catch {
    return; // no plugin index at all is perfectly fine
  }
  await Promise.all((index.enabled ?? []).map(async (id) => {
    try {
      const manifest = await (await fetch(`/plugins/${id}/plugin.json`)).json();
      registerPackLanguages(id, manifest.languages);
    } catch { /* unreadable manifest: the plugin loader warns about the same thing */ }
  }));
}

/** The languages the enabled packs offer (the manifests are read on the first call). */
export async function packLanguages() {
  scan ??= scanEnabledPlugins();
  await scan;
  return [...registry.values()];
}

/**
 * Finds the pack that owns a language code: the registry first, then the manifests.
 */
async function findPack(code) {
  if (registry.has(code)) return registry.get(code);
  await packLanguages();
  return registry.get(code) ?? null;
}

/**
 * Fetches the strings a pack offers for one register.
 * @param {string} code The language code (never a builtin language)
 * @param {'site'|'admin'} kind
 * @returns {Promise<Record<string, string>|null>} null when no pack covers it
 */
export async function loadPackStrings(code, kind) {
  if (!LANG_CODE_RE.test(String(code ?? '')) || isBuiltinLang(code)) return null;
  const pack = await findPack(code);
  if (!pack || pack[kind] !== true) return null;
  try {
    const mod = await import(`/plugins/${pack.plugin}/locales/${kind}/${code}.js`);
    return mod.default?.strings ?? null;
  } catch {
    console.warn(`Urd: language pack '${pack.plugin}' promises ${kind} strings for '${code}', but locales/${kind}/${code}.js could not be loaded`);
    return null;
  }
}
