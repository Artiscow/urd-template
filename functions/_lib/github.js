/**
 * GitHub-API-hjelpere for publiseringslaget.
 *
 * Grensen her holdes bevisst leverandørformet slik at GitLab/Gitea-adaptere
 * kan skrives etter v1 uten å røre endepunktene.
 *
 * Konfigurasjon (miljøvariabler hos hosten):
 *   GITHUB_REPO ("eier/navn"), GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET,
 *   GITHUB_BRANCH (standard "main"), GITHUB_SCOPE (standard "public_repo"),
 *   ALLOWED_LOGINS (kommaseparert),
 *   GITHUB_ROOT_DIR (valgfri: undermappen i repoet som er nettsidens rot,
 *   f.eks. "template" i Urd-monorepoet; utelatt når nettsiden ligger i roten).
 */

/** Leser og validerer konfigurasjonen fra env. Kaster ved manglende variabler.
 *  Feilene bærer en maskinlesbar `code` (og ev. parametre) som endepunktene
 *  sender videre i feilsvaret, så admin kan oversette dem (api.*-nøklene). */
export function cfg(env) {
  for (const key of ['GITHUB_REPO', 'GITHUB_CLIENT_ID', 'GITHUB_CLIENT_SECRET']) {
    if (!env[key]) {
      throw Object.assign(
        new Error(`Publisering er ikke konfigurert: miljøvariabelen ${key} mangler`),
        { code: 'setupMissingEnv', key },
      );
    }
  }
  const rootDir = (env.GITHUB_ROOT_DIR || '').replace(/^\/+|\/+$/g, '');
  if (rootDir.split('/').includes('..')) {
    throw Object.assign(new Error('GITHUB_ROOT_DIR kan ikke inneholde ..'), { code: 'setupBadRootDir' });
  }
  return {
    repo: env.GITHUB_REPO,
    clientId: env.GITHUB_CLIENT_ID,
    clientSecret: env.GITHUB_CLIENT_SECRET,
    branch: env.GITHUB_BRANCH || 'main',
    scope: env.GITHUB_SCOPE || 'public_repo',
    rootDir,
    // Malrepoet oppdatereren henter nye Urd-versjoner fra (ADR-0014).
    // Overstyres med URD_TEMPLATE_REPO for fork-baserte oppstrøms.
    templateRepo: env.URD_TEMPLATE_REPO || 'Artiscow/urd-template',
  };
}

/**
 * Autentisert kall mot api.github.com. Forbigående feil (5xx/429, som
 * GitHubs «Unicorn»-side) prøves automatisk på nytt et par ganger.
 * Kaster Error med .status, slik at endepunktene kan skille «GitHub er
 * nede» fra «ugyldig token». Feiltekst kortes ned (aldri hele HTML-sider).
 */
export async function gh(token, path, init = {}, attempt = 1) {
  const res = await fetch(`https://api.github.com${path}`, {
    ...init,
    headers: {
      accept: 'application/vnd.github+json',
      // token null = anonym lesing (offentlige repo, lavere rategrense); brukes kun av lesende endepunkter.
      ...(token ? { authorization: `Bearer ${token}` } : {}),
      'user-agent': 'urd-publisher',
      ...(init.body ? { 'content-type': 'application/json' } : {}),
      ...init.headers,
    },
  });
  if (!res.ok) {
    if ((res.status >= 500 || res.status === 429) && attempt < 3) {
      await new Promise((resolve) => setTimeout(resolve, attempt * 500));
      return gh(token, path, init, attempt + 1);
    }
    const isJson = res.headers.get('content-type')?.includes('json');
    const detail = isJson ? (await res.text()).slice(0, 300) : '(HTML-feilside fra GitHub)';
    const error = new Error(`GitHub ${init.method ?? 'GET'} ${path} svarte ${res.status}: ${detail}`);
    error.status = res.status;
    throw error;
  }
  return res.json();
}

/** Innlogget GitHub-bruker for tokenet. */
export function currentUser(token) {
  return gh(token, '/user');
}

/**
 * GraphQL-kall mot GitHub: brukes av oppdatereren til å hente MANGE
 * fil-innhold i ETT subrequest (Blob.text via aliaser), som REST ville
 * trengt ett kall per fil for. Samme retry-regel som gh().
 */
export async function ghGraphql(token, query, attempt = 1) {
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${token}`,
      'content-type': 'application/json',
      'user-agent': 'urd-publisher',
    },
    body: JSON.stringify({ query }),
  });
  if (!res.ok) {
    if ((res.status >= 500 || res.status === 429) && attempt < 3) {
      await new Promise((resolve) => setTimeout(resolve, attempt * 500));
      return ghGraphql(token, query, attempt + 1);
    }
    const error = new Error(`GitHub GraphQL svarte ${res.status}`);
    error.status = res.status;
    throw error;
  }
  const payload = await res.json();
  if (payload.errors?.length) {
    throw new Error(`GitHub GraphQL: ${payload.errors[0].message}`.slice(0, 300));
  }
  return payload.data;
}

/** Base64 fra blobs-API-et (kommer med innskutte linjeskift). */
export function cleanBase64(b64) {
  return String(b64 ?? '').replace(/\s/g, '');
}

/**
 * Valgfri eksplisitt deploy-trigger (DEPLOY_HOOK_URL) i tillegg til
 * git-webhooken, som kan glippe hos hosten. Feil her velter aldri
 * kallet - commiten ligger allerede trygt i repoet.
 */
export async function triggerDeploy(env) {
  if (!env.DEPLOY_HOOK_URL) return;
  try {
    await fetch(env.DEPLOY_HOOK_URL, { method: 'POST' });
  } catch (err) {
    console.warn('Urd: deploy-hook feilet', err.message);
  }
}

/**
 * Committer flere filer som ÉN commit via Git Data API:
 *   1. Hent branch-ref og basecommit
 *   2. Opprett en blob per fil (sletting: tre-innslag med sha: null)
 *   3. Opprett tre med base_tree = basecommitens tre
 *   4. Opprett commit med basecommit som forelder
 *   5. Oppdater ref (force: false - feiler trygt hvis HEAD har flyttet seg)
 *
 * Filer med `delete: true` fjernes fra repoet. Stier som ikke finnes i
 * basetreet hoppes over i stillhet (GitHub avviser hele treet ellers),
 * så en sletting aldri kan velte publiseringen av resten.
 *
 * Med `expect` satt kreves det at HEAD står nøyaktig der (Error med
 * status 409 ellers): editorens konfliktsjekk-til-commit-vindu lukkes.
 *
 * @param {string} token
 * @param {{repo: string, branch: string}} config Fra cfg(env)
 * @param {{message: string, files: Array<{path: string, content?: string, encoding?: 'utf-8'|'base64', delete?: boolean}>, expect?: string}} payload
 * @returns {Promise<{sha: string}>} Den nye commit-SHA-en
 */
export async function commitFiles(token, config, { message, files, expect }) {
  const { repo, branch } = config;

  const ref = await gh(token, `/repos/${repo}/git/ref/heads/${branch}`);
  const baseSha = ref.object.sha;
  if (expect && expect !== baseSha) {
    const error = new Error('HEAD har flyttet seg siden konfliktsjekken');
    error.status = 409;
    throw error;
  }
  const baseCommit = await gh(token, `/repos/${repo}/git/commits/${baseSha}`);

  // Slettinger valideres mot basetreet: sha:null for en ukjent sti gir
  // 422 fra GitHub. (recursive kan trunkeres i enorme repoer; da uteblir
  // slettingen, som er den ufarlige retningen.)
  let existing = null;
  if (files.some((f) => f.delete)) {
    const baseTree = await gh(token, `/repos/${repo}/git/trees/${baseCommit.tree.sha}?recursive=1`);
    existing = new Set(baseTree.tree.map((t) => t.path));
  }

  const tree = [];
  for (const file of files) {
    if (file.delete) {
      if (existing?.has(file.path)) {
        tree.push({ path: file.path, mode: '100644', type: 'blob', sha: null });
      }
      continue;
    }
    const blob = await gh(token, `/repos/${repo}/git/blobs`, {
      method: 'POST',
      body: JSON.stringify({
        content: file.content,
        encoding: file.encoding === 'base64' ? 'base64' : 'utf-8',
      }),
    });
    tree.push({ path: file.path, mode: '100644', type: 'blob', sha: blob.sha });
  }
  if (tree.length === 0) {
    // Alt som skulle skje var slettinger av stier som alt er borte.
    return { sha: baseSha };
  }

  const newTree = await gh(token, `/repos/${repo}/git/trees`, {
    method: 'POST',
    body: JSON.stringify({ base_tree: baseCommit.tree.sha, tree }),
  });

  const commit = await gh(token, `/repos/${repo}/git/commits`, {
    method: 'POST',
    body: JSON.stringify({ message, tree: newTree.sha, parents: [baseSha] }),
  });

  await gh(token, `/repos/${repo}/git/refs/heads/${branch}`, {
    method: 'PATCH',
    body: JSON.stringify({ sha: commit.sha, force: false }),
  });

  return { sha: commit.sha };
}

/**
 * Oppdaterens commit-vei (ADR-0014): som commitFiles, men tre-innslagene
 * bygges med INLINE `content` (eller ferdig blob-`sha`) i stedet for én
 * blob-POST per fil - det er dét som holder en ~90-filers motoroppdatering
 * under Cloudflares subrequest-tak. Store innslagsmengder deles i KJEDEDE
 * trær (base_tree = forrige tre), fortsatt som ÉN commit.
 *
 * @param {string} token
 * @param {{repo: string, branch: string}} config
 * @param {{message: string, entries: Array<{path: string, content?: string, sha?: string|null}>, expect?: string}} payload
 *   `content` for tekstfiler, `sha` for ferdiglagde blober (binær/avkortet),
 *   `sha: null` for sletting. Slettinger må gjelde stier som finnes.
 * @param {(entries: Array<object>) => Array<Array<object>>} chunk Ren chunking (fra update-plan.js)
 * @returns {Promise<{sha: string}>}
 */
export async function commitTree(token, config, { message, entries, expect }, chunk) {
  const { repo, branch } = config;

  const ref = await gh(token, `/repos/${repo}/git/ref/heads/${branch}`);
  const baseSha = ref.object.sha;
  if (expect && expect !== baseSha) {
    const error = new Error('HEAD har flyttet seg siden oppdaterings-sjekken');
    error.status = 409;
    throw error;
  }
  const baseCommit = await gh(token, `/repos/${repo}/git/commits/${baseSha}`);

  let treeSha = baseCommit.tree.sha;
  for (const group of chunk(entries.map((e) => ({
    path: e.path,
    mode: '100644',
    type: 'blob',
    ...(e.sha !== undefined ? { sha: e.sha } : { content: e.content }),
  })))) {
    const tree = await gh(token, `/repos/${repo}/git/trees`, {
      method: 'POST',
      body: JSON.stringify({ base_tree: treeSha, tree: group }),
    });
    treeSha = tree.sha;
  }

  const commit = await gh(token, `/repos/${repo}/git/commits`, {
    method: 'POST',
    body: JSON.stringify({ message, tree: treeSha, parents: [baseSha] }),
  });

  await gh(token, `/repos/${repo}/git/refs/heads/${branch}`, {
    method: 'PATCH',
    body: JSON.stringify({ sha: commit.sha, force: false }),
  });

  return { sha: commit.sha };
}
