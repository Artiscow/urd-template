/**
 * Felles registerfabrikk. Alle utvidbare typer i Urd (blokker, seksjons-
 * presets, bakgrunnslag, animasjoner) bruker samme register-mønster, og
 * plugins bruker de identiske define-API-ene som kjernen.
 */

/**
 * @param {string} kind Navn på registeret, kun til feilmeldinger ('blocks', 'backgrounds', …)
 * @returns {{define: (id: string, def: object) => void, get: (id: string) => object|undefined, ids: () => string[]}}
 */
export function createRegistry(kind) {
  const defs = new Map();
  return {
    define(id, def) {
      if (defs.has(id)) throw new Error(`Urd.${kind}: '${id}' er allerede definert`);
      defs.set(id, def);
    },
    get(id) {
      return defs.get(id);
    },
    ids() {
      return [...defs.keys()];
    },
  };
}
