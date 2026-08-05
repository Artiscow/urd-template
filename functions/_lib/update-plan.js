/**
 * Ren planlegging for oppdatereren (0.6.9, ADR-0014): tre-lister inn,
 * endringssett ut. Ingen nettverk og ingen sideeffekter, så logikken kan
 * enhetstestes uttømmende i tests/update-plan.test.mjs.
 *
 * Sjekksum-modellen: git blob-SHA-er sammenlignes mellom brukerens tre,
 * malrepoets tre ved BASISLINJEN (taggen v<engine> for versjonen brukeren
 * har) og malrepoets tre ved MÅLVERSJONEN. Lik SHA = identisk innhold, så
 * «håndredigert» kan avgjøres uten å laste ned en eneste fil.
 */
import { isUserPath, isPageIndexCopy } from './guard.js';

/** Høyeste treparts versjonstagg (vX.Y.Z) i en liste tagg-navn, eller null. */
export function highestVersionTag(names) {
  let best = null;
  let bestParts = null;
  for (const name of names ?? []) {
    const m = /^v(\d+)\.(\d+)\.(\d+)$/.exec(name);
    if (!m) continue;
    const parts = [Number(m[1]), Number(m[2]), Number(m[3])];
    const cmp = bestParts
      ? parts[0] - bestParts[0] || parts[1] - bestParts[1] || parts[2] - bestParts[2]
      : 1;
    if (cmp > 0) {
      best = name;
      bestParts = parts;
    }
  }
  return best;
}

/**
 * Motor-atomgruppen (ADR-0014): filer som MÅ byttes samlet, ellers
 * foreldreløses siden. HTML-skallene peker på den versjonerte motormappa,
 * admin-bundelen bunter motormoduler, skallene i assets/urd/ peker inn i
 * versjonen, base.css refereres med innholdsstempel fra skallene, og
 * urd.json.engine ER mappenavn-invarianten. Slug-kopiene hører også til
 * (kopi-oppfriskningsplikten, ADR-0013): en tilbakeholdt kopi ville pekt
 * på slettet motormappe. Kun functions/** og løse rotfiler (f.eks.
 * speculation-rules.json) kan holdes tilbake per fil.
 */
export function isAtomPath(path) {
  return path === 'index.html'
    || path === 'urd.json'
    || path.startsWith('admin/')
    || path.startsWith('assets/')
    || isPageIndexCopy(path);
}

/**
 * Regner ut endringssettet for en oppdatering.
 *
 * @param {Record<string, string>} baselineTree Malens tre ved v<engine>: sti → blob-SHA
 * @param {Record<string, string>} targetTree Malens tre ved målversjonen: sti → blob-SHA
 * @param {Record<string, string>} userTree Brukerens tre (rootDir-strippet): sti → blob-SHA
 * @returns {{changes: Array<{path: string, action: 'write'|'delete', atom: boolean, conflict: 'edited'|'created'|'editedDelete'|null}>, upToDate: boolean}}
 *
 * Reglene per sti i malens trær (brukereide stier og `_headers` er utenfor,
 * jf. ADR-0006: den vises som diff-instruks og skrives aldri):
 *  - endret oppstrøms + urørt lokalt         → write
 *  - endret oppstrøms + håndredigert lokalt  → write med conflict: 'edited'
 *  - uendret oppstrøms                       → aldri rørt (lokale endringer består i stillhet)
 *  - ny oppstrøms + finnes ikke lokalt       → write
 *  - ny oppstrøms + finnes lokalt            → write med conflict: 'created'
 *  - fjernet oppstrøms + urørt lokalt        → delete
 *  - fjernet oppstrøms + håndredigert lokalt → delete med conflict: 'editedDelete'
 *  - fjernet oppstrøms + alt borte lokalt    → ingenting
 *  - mangler lokalt men uendret oppstrøms    → write (gjenopprettes)
 */
export function planUpdate(baselineTree, targetTree, userTree) {
  const changes = [];
  const paths = new Set([...Object.keys(baselineTree), ...Object.keys(targetTree)]);
  for (const path of [...paths].sort()) {
    if (isUserPath(path) || path === '_headers') continue;
    const base = baselineTree[path];
    const target = targetTree[path];
    const user = userTree[path];
    const atom = isAtomPath(path);

    if (target !== undefined) {
      if (user === target) continue; // allerede på mål-innholdet
      if (base === undefined) {
        // Ny fil oppstrøms; en lokal fil på samme sti er brukerens egen.
        changes.push({ path, action: 'write', atom, conflict: user !== undefined ? 'created' : null });
      } else if (base === target) {
        // Uendret oppstrøms: røres aldri - unntatt når den mangler lokalt
        // (slettet ved et uhell); da gjenopprettes den.
        if (user === undefined) changes.push({ path, action: 'write', atom, conflict: null });
      } else {
        changes.push({
          path,
          action: 'write',
          atom,
          conflict: user !== undefined && user !== base ? 'edited' : null,
        });
      }
    } else if (user !== undefined) {
      // Fjernet oppstrøms (f.eks. forrige motormappe ved versjonsbytte).
      changes.push({ path, action: 'delete', atom, conflict: user !== base ? 'editedDelete' : null });
    }
  }
  return { changes, upToDate: changes.length === 0 };
}

/** Deler tre-innslag i grupper for kjedede base_tree-kall (én commit uansett).
 *  Grensen er innslag per kall, godt under GitHubs payload-tak. */
export function chunkEntries(entries, size = 300) {
  const chunks = [];
  for (let i = 0; i < entries.length; i += size) chunks.push(entries.slice(i, i + size));
  return chunks;
}
