/**
 * Oppdatereren (0.6.9, ADR-0014): henter en ny Urd-versjon fra malrepoet
 * (URD_TEMPLATE_REPO) og skriver de Urd-eide filene i brukerens repo som
 * ÉN atomisk commit. All GitHub-trafikk går her (CSP-en hos besøkende har
 * connect-src 'self', og tokenet bor i cookien).
 *
 * GET  /api/github/update[?to=vX.Y.Z]  sjekk: klassifiserer hver fil via
 *      blob-SHA-er (uendret/håndredigert/ny/slettet) uten å laste innhold.
 * POST /api/github/update              utfør: { to, expect, skip? }.
 *
 * Sjekksum-modellen: brukerens tre sammenlignes med malens tre ved
 * BASISLINJEN v<engine> (engine leses fra brukerens urd.json i repoet,
 * aldri fra klienten) og ved målversjonen. `_headers` skrives ALDRI
 * (ADR-0006); sjekken leverer oppstrøms-teksten så admin kan vise
 * diff-instruksen. Slug-kopiene (<slug>/index.html) friskes opp i samme
 * commit som motorbyttet (kopi-oppfriskningsplikten, ADR-0013).
 */
import { gh, ghGraphql, cleanBase64, commitTree, triggerDeploy } from '../../_lib/github.js';
import { requirePublisher } from '../../_lib/auth.js';
import { isPageIndexCopy } from '../../_lib/guard.js';
import { planUpdate, highestVersionTag, chunkEntries } from '../../_lib/update-plan.js';

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });

const TAG_RE = /^v\d+\.\d+\.\d+$/;

const decodeBlob = (b64) =>
  new TextDecoder().decode(Uint8Array.from(atob(cleanBase64(b64)), (c) => c.charCodeAt(0)));

/** Brukerens tre som sti → blob-SHA, avgrenset til nettsidens rot
 *  (GITHUB_ROOT_DIR-strippet, så stiene matcher malrepoets). */
function siteTree(tree, rootDir) {
  const prefix = rootDir ? `${rootDir}/` : '';
  const map = {};
  for (const entry of tree) {
    if (entry.type !== 'blob') continue;
    if (prefix && !entry.path.startsWith(prefix)) continue;
    map[entry.path.slice(prefix.length)] = entry.sha;
  }
  return map;
}

function treeAsMap(tree) {
  const map = {};
  for (const entry of tree) {
    if (entry.type === 'blob') map[entry.path] = entry.sha;
  }
  return map;
}

/** Henter felles grunnlag for sjekk og utføring: brukerens HEAD + tre,
 *  installert versjon, målversjon og malens to trær. Kaster med .code. */
async function loadState(token, config, toParam) {
  const { repo, branch, rootDir, templateRepo } = config;

  const ref = await gh(token, `/repos/${repo}/git/ref/heads/${branch}`);
  const head = ref.object.sha;
  const rawTree = await gh(token, `/repos/${repo}/git/trees/${head}?recursive=1`);
  if (rawTree.truncated) {
    // Et avkortet tre ville feilklassifisert filer utenfor utsnittet som
    // «mangler lokalt» og skrevet dem om uten varsel: stopp heller trygt.
    throw Object.assign(
      new Error('The repository tree is too large to compare safely'),
      { code: 'updateFailed', detail: 'the git tree is truncated by GitHub' },
    );
  }
  const userTree = siteTree(rawTree.tree, rootDir);

  if (!userTree['urd.json']) {
    throw Object.assign(new Error('Could not find urd.json in the repository'), { code: 'updateFailed', detail: 'urd.json is missing' });
  }
  const urdBlob = await gh(token, `/repos/${repo}/git/blobs/${userTree['urd.json']}`);
  const engine = JSON.parse(decodeBlob(urdBlob.content)).engine;

  let target = toParam ?? null;
  let templateTags;
  try {
    if (!target) {
      templateTags = await gh(token, `/repos/${templateRepo}/tags?per_page=100`);
      target = highestVersionTag(templateTags.map((t) => t.name));
    }
    if (!target) {
      throw Object.assign(new Error('The template repository has no version tags'), { code: 'updateNoBaseline', tag: '(none)' });
    }
    if (target === `v${engine}`) {
      return { head, engine, target, userTree, upToDate: true };
    }

    let baselineTree;
    try {
      baselineTree = await gh(token, `/repos/${templateRepo}/git/trees/v${engine}?recursive=1`);
    } catch (err) {
      if (err.status === 404 || err.status === 422) {
        throw Object.assign(
          new Error(`Could not find the baseline tag v${engine} in the template repository`),
          { code: 'updateNoBaseline', tag: `v${engine}` },
        );
      }
      throw err;
    }
    let targetTree;
    try {
      targetTree = await gh(token, `/repos/${templateRepo}/git/trees/${target}?recursive=1`);
    } catch (err) {
      if (err.status === 404 || err.status === 422) {
        // Formgyldig, men ikke-eksisterende måltagg skal diagnostiseres som
        // nettopp det, ikke som «malrepoet utilgjengelig».
        throw Object.assign(new Error(`The target version ${target} does not exist in the template repository`), { code: 'updateBadTarget', target });
      }
      throw err;
    }
    return {
      head,
      engine,
      target,
      userTree,
      upToDate: false,
      baselineTree: treeAsMap(baselineTree.tree),
      targetTree: treeAsMap(targetTree.tree),
    };
  } catch (err) {
    if (err.code) throw err;
    throw Object.assign(
      new Error(`Could not read the template repository ${templateRepo}: ${err.message}`),
      { code: 'updateTemplateUnreachable', repo: templateRepo, detail: err.message.slice(0, 200) },
    );
  }
}

export async function onRequestGet({ request, env }) {
  const auth = await requirePublisher(request, env);
  if (auth.response) return auth.response;
  const { config, token } = auth;

  const to = new URL(request.url).searchParams.get('to');
  if (to !== null && !TAG_RE.test(to)) {
    return json({ error: `Invalid target version '${to}'`, code: 'updateBadTarget', target: to }, 400);
  }

  try {
    const state = await loadState(token, config, to);
    if (state.upToDate) {
      return json({ current: state.engine, target: state.target, head: state.head, upToDate: true, changes: [] });
    }
    const { changes, upToDate } = planUpdate(state.baselineTree, state.targetTree, state.userTree);

    // _headers-instruksen (ADR-0006): aldri i skrivesettet; oppstrøms tekst
    // sendes med når brukerens fil avviker fra målet, så admin kan vise
    // nøyaktig hva som bør legges inn for hånd.
    const headers = {
      changed: state.baselineTree['_headers'] !== state.targetTree['_headers'],
      edited: state.userTree['_headers'] !== state.baselineTree['_headers'],
      upstream: null,
    };
    if (state.targetTree['_headers'] && state.userTree['_headers'] !== state.targetTree['_headers']) {
      const blob = await gh(token, `/repos/${config.templateRepo}/git/blobs/${state.targetTree['_headers']}`);
      headers.upstream = decodeBlob(blob.content);
    }

    // Utgivelsesnotatene (valgfritt): release-Action-en publiserer monorepo-
    // releasens notater videre til malrepoet. 404 er normalt for eldre
    // versjoner; feil her skal aldri velte sjekken.
    let notes = null;
    try {
      const release = await gh(token, `/repos/${config.templateRepo}/releases/tags/${state.target}`);
      notes = typeof release.body === 'string' && release.body.trim() ? release.body.slice(0, 4000) : null;
    } catch { /* ingen release med notater: feltet forblir null */ }

    return json({ current: state.engine, target: state.target, head: state.head, upToDate, changes, headers, notes });
  } catch (err) {
    if (err.code) return json({ error: err.message, code: err.code, tag: err.tag, repo: err.repo, target: err.target, detail: err.detail }, 502);
    console.error('Urd update check:', err.message);
    return json({ error: `The update check failed: ${err.message}`, code: 'updateFailed', detail: err.message.slice(0, 200) }, 502);
  }
}

export async function onRequestPost({ request, env }) {
  const auth = await requirePublisher(request, env);
  if (auth.response) return auth.response;
  const { config, token } = auth;

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON in the request', code: 'badJson' }, 400);
  }
  const { to, expect, skip } = body ?? {};
  if (typeof to !== 'string' || !TAG_RE.test(to)) {
    return json({ error: `Invalid target version '${to}'`, code: 'updateBadTarget', target: String(to) }, 400);
  }
  if (typeof expect !== 'string' || !expect) {
    return json({ error: 'expect must be a commit sha', code: 'badExpect' }, 400);
  }
  if (skip !== undefined && (!Array.isArray(skip) || skip.length > 500 || skip.some((p) => typeof p !== 'string'))) {
    // api.updateFailed interpolerer detail, så teksten blir riktig for
    // DENNE brukeren av koden (api.badFiles beskriver commit-endepunktet).
    return json({ error: 'skip must be a list of paths', code: 'updateFailed', detail: 'skip must be a list of paths (max 500)' }, 400);
  }

  try {
    const state = await loadState(token, config, to);
    if (state.head !== expect) {
      return json({ error: 'The repository changed after the update check', code: 'updateRace' }, 409);
    }
    if (state.upToDate) {
      return json({ current: state.engine, target: state.target, upToDate: true });
    }

    // Planen regnes ut på nytt server-side; klienten får kun velge bort
    // filer UTENFOR motor-atomgruppen (ADR-0014).
    const plan = planUpdate(state.baselineTree, state.targetTree, state.userTree);
    const planned = new Map(plan.changes.map((c) => [c.path, c]));
    for (const path of skip ?? []) {
      const change = planned.get(path);
      if (!change || change.atom) {
        return json({ error: `The file '${path}' cannot be held back from the update`, code: 'updateBadSkip', path }, 400);
      }
      planned.delete(path);
    }

    const writes = [...planned.values()].filter((c) => c.action === 'write');
    const deletes = [...planned.values()].filter((c) => c.action === 'delete');

    // Kopi-oppfriskningsplikten (ADR-0013): hver <slug>/index.html i
    // brukerens tre skal være byte-lik malens rot-index.html etter byttet.
    // Blob-SHA-sammenligning avgjør hvem som faktisk trenger skriving.
    // Malens EGNE slug-kopier ligger alt i planen (de finnes i maltrærne);
    // uten planned-filteret ville de blitt duplikate tre-innslag.
    const rootIndexSha = state.targetTree['index.html'];
    const copyPaths = Object.keys(state.userTree)
      .filter((p) => isPageIndexCopy(p) && state.userTree[p] !== rootIndexSha && !planned.has(p));
    const needsRootText = copyPaths.length > 0 && !writes.some((c) => c.path === 'index.html');

    // ETT GraphQL-kall henter alle måltekstene; binære/avkortede blober tar
    // REST-omveien (les base64 fra malrepoet, skriv blob i brukerens repo).
    const fetchPaths = [...writes.map((c) => c.path), ...(needsRootText ? ['index.html'] : [])];
    const texts = {};
    const blobEntries = {};
    if (fetchPaths.length > 0) {
      const [owner, name] = config.templateRepo.split('/');
      const fields = fetchPaths.map((p, i) =>
        `f${i}: object(expression: ${JSON.stringify(`${to}:${p}`)}) { ... on Blob { text isBinary isTruncated } }`);
      const data = await ghGraphql(token, `{ repository(owner: ${JSON.stringify(owner)}, name: ${JSON.stringify(name)}) { ${fields.join(' ')} } }`);
      for (let i = 0; i < fetchPaths.length; i++) {
        const path = fetchPaths[i];
        const blob = data.repository[`f${i}`];
        if (blob && typeof blob.text === 'string' && !blob.isTruncated && !blob.isBinary) {
          texts[path] = blob.text;
        } else {
          const raw = await gh(token, `/repos/${config.templateRepo}/git/blobs/${state.targetTree[path]}`);
          const made = await gh(token, `/repos/${config.repo}/git/blobs`, {
            method: 'POST',
            body: JSON.stringify({ content: cleanBase64(raw.content), encoding: 'base64' }),
          });
          blobEntries[path] = made.sha;
        }
      }
    }

    const prefix = config.rootDir ? `${config.rootDir}/` : '';
    const entries = [
      ...writes.map((c) => (blobEntries[c.path] !== undefined
        ? { path: `${prefix}${c.path}`, sha: blobEntries[c.path] }
        : { path: `${prefix}${c.path}`, content: texts[c.path] })),
      ...copyPaths.map((p) => (blobEntries['index.html'] !== undefined
        ? { path: `${prefix}${p}`, sha: blobEntries['index.html'] }
        : { path: `${prefix}${p}`, content: texts['index.html'] })),
      ...deletes.map((c) => ({ path: `${prefix}${c.path}`, sha: null })),
    ];

    const { sha } = await commitTree(token, config, {
      message: `Oppdater Urd til ${to} via admin`,
      entries,
      expect,
    }, chunkEntries);
    await triggerDeploy(env);
    return json({ sha, current: state.engine, target: to, written: writes.length + copyPaths.length, deleted: deletes.length });
  } catch (err) {
    if (err.status === 409 || (err.status === 422 && /fast.?forward/i.test(err.message))) {
      return json({ error: 'The repository changed while the update was running', code: 'updateRace' }, 409);
    }
    if (err.code) return json({ error: err.message, code: err.code, tag: err.tag, repo: err.repo, target: err.target, detail: err.detail }, 502);
    console.error('Urd update:', err.message);
    return json({ error: `The update failed: ${err.message}`, code: 'updateFailed', detail: err.message.slice(0, 200) }, 502);
  }
}
