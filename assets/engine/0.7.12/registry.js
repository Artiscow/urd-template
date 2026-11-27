/**
 * Shared registry factory for Urd's extensible types (blocks, section presets, backgrounds, animations, templates, commands); plugins use the core's define APIs.
 * Notes: docs/engine-notes/registry.md (Urd repository).
 */

/**
 * @param {string} kind Registry name, used only in error messages ('blocks', 'backgrounds', …)
 * @returns {{define: (id: string, def: object) => void, alias: (oldId: string, id: string) => void, reserve: (ids: Iterable<string>) => (id: string, def: object) => void, isReserved: (id: string) => boolean, get: (id: string) => object|undefined, ids: () => string[]}}
 */
export function createRegistry(kind) {
  const defs = new Map();
  const aliases = new Map();
  const reserved = new Set();
  return {
    define(id, def) {
      if (reserved.has(id)) throw new Error(`Urd.${kind}: '${id}' is the engine's own`);
      if (defs.has(id)) throw new Error(`Urd.${kind}: '${id}' is already defined`);
      defs.set(id, def);
    },
    // Maps an old contract id to its current one (ADR-0021); get() follows it only when the old id itself is not defined.
    alias(oldId, id) {
      aliases.set(oldId, id);
    },
    // Marks ids as the engine's own (core-types.js, ADR-0036): define() refuses them, and the definer returned here defines them.
    reserve(ids) {
      for (const id of ids) reserved.add(id);
      return (id, def) => {
        if (!reserved.has(id)) throw new Error(`Urd.${kind}: '${id}' is not the engine's own`);
        if (defs.has(id)) throw new Error(`Urd.${kind}: '${id}' is already defined`);
        defs.set(id, def);
      };
    },
    isReserved(id) {
      return reserved.has(id);
    },
    get(id) {
      return defs.get(id) ?? (aliases.has(id) ? defs.get(aliases.get(id)) : undefined);
    },
    ids() {
      return [...defs.keys()];
    },
  };
}
