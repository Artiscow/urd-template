/**
 * GitHub API helpers for the publishing layer.
 * GITHUB_ROOT_DIR is the repo's subfolder that is the site root, where the site is not at the root.
 */

/** The configuration from env, validated. A missing or bad variable throws an Error with a `code` (and its parameters) the admin translates as an api.* key. */
export function cfg(env) {
  for (const key of ['GITHUB_REPO', 'GITHUB_CLIENT_ID', 'GITHUB_CLIENT_SECRET']) {
    if (!env[key]) {
      throw Object.assign(
        new Error(`Publishing is not configured: the environment variable ${key} is missing`),
        { code: 'setupMissingEnv', key },
      );
    }
  }
  const rootDir = (env.GITHUB_ROOT_DIR || '').replace(/^\/+|\/+$/g, '');
  if (rootDir.split('/').includes('..')) {
    throw Object.assign(new Error('GITHUB_ROOT_DIR cannot contain ..'), { code: 'setupBadRootDir' });
  }
  return {
    repo: env.GITHUB_REPO,
    clientId: env.GITHUB_CLIENT_ID,
    clientSecret: env.GITHUB_CLIENT_SECRET,
    branch: env.GITHUB_BRANCH || 'main',
    scope: env.GITHUB_SCOPE || 'public_repo',
    rootDir,
    // The template repo the updater fetches new Urd versions from (ADR-0014).
    // Override with URD_TEMPLATE_REPO for fork-based upstreams.
    templateRepo: env.URD_TEMPLATE_REPO || 'Artiscow/urd-template',
  };
}

/**
 * A call to api.github.com, retried twice on a 5xx or 429.
 * A failure throws an Error with .status and at most 300 characters of a JSON answer, never an HTML page.
 */
export async function gh(token, path, init = {}, attempt = 1) {
  const res = await fetch(`https://api.github.com${path}`, {
    ...init,
    headers: {
      accept: 'application/vnd.github+json',
      // token null = anonymous reads (public repos, lower rate limit); used only by read-only endpoints.
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
    const detail = isJson ? (await res.text()).slice(0, 300) : '(HTML error page from GitHub)';
    const error = new Error(`GitHub ${init.method ?? 'GET'} ${path} responded ${res.status}: ${detail}`);
    error.status = res.status;
    throw error;
  }
  return res.json();
}

/** The signed-in GitHub user for the token. */
export function currentUser(token) {
  return gh(token, '/user');
}

/**
 * A GraphQL call to GitHub, retried as gh() is.
 * With `partial`, the data comes back beside errors for single fields, and only a reply without data throws.
 */
export async function ghGraphql(token, query, attempt = 1, { partial = false } = {}) {
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
      return ghGraphql(token, query, attempt + 1, { partial });
    }
    const error = new Error(`GitHub GraphQL responded ${res.status}`);
    error.status = res.status;
    throw error;
  }
  const payload = await res.json();
  if (payload.errors?.length && !(partial && payload.data)) {
    throw new Error(`GitHub GraphQL: ${payload.errors[0].message}`.slice(0, 300));
  }
  return payload.data;
}

/** Base64 from the blobs API (arrives with embedded line breaks). */
export function cleanBase64(b64) {
  return String(b64 ?? '').replace(/\s/g, '');
}

/** Posts to DEPLOY_HOOK_URL, where set, beside the git webhook; a failure is only logged. */
export async function triggerDeploy(env) {
  if (!env.DEPLOY_HOOK_URL) return;
  try {
    await fetch(env.DEPLOY_HOOK_URL, { method: 'POST' });
  } catch (err) {
    console.warn('Urd: deploy hook failed', err.message);
  }
}

/**
 * Commits files as one commit by the Git Data API, without force.
 * A deletion the base tree lacks is skipped; with `expect`, a HEAD elsewhere throws 409.
 *
 * @param {string} token
 * @param {{repo: string, branch: string}} config From cfg(env)
 * @param {{message: string, files: Array<{path: string, content?: string, encoding?: 'utf-8'|'base64', delete?: boolean, from?: string}>, expect?: string}} payload
 *   A file with `from` takes the source's blob in the base tree and deletes the source; a source the tree lacks throws 404 `moveMissing`.
 * @returns {Promise<{sha: string}>} The new commit SHA
 */
export async function commitFiles(token, config, { message, files, expect }) {
  const { repo, branch } = config;

  const ref = await gh(token, `/repos/${repo}/git/ref/heads/${branch}`);
  const baseSha = ref.object.sha;
  if (expect && expect !== baseSha) {
    const error = new Error('HEAD has moved since the conflict check');
    error.status = 409;
    throw error;
  }
  const baseCommit = await gh(token, `/repos/${repo}/git/commits/${baseSha}`);

  // Deletions, moves and copies (copyOf: a page's copy of index.html) read their paths and blob shas from the base tree.
  let existing = null;
  let blobs = null;
  if (files.some((f) => f.delete || f.from || f.copyOf)) {
    const baseTree = await gh(token, `/repos/${repo}/git/trees/${baseCommit.tree.sha}?recursive=1`);
    const items = baseTree.tree.filter((t) => t.type === 'blob');
    existing = items.map((t) => t.path);
    blobs = new Map(items.map((t) => [t.path, t.sha]));
  }

  const tree = [];
  const gone = new Set();
  for (const file of files) {
    if (file.copyOf) {
      const sha = blobs?.get(file.copyOf);
      if (!sha) throw new Error(`The file '${file.copyOf}' is not in the repository`);
      tree.push({ path: file.path, mode: '100644', type: 'blob', sha });
      continue;
    }
    if (file.from) {
      const sha = blobs?.get(file.from);
      if (!sha) {
        const error = new Error(`The file '${file.from}' is not in the repository`);
        error.status = 404;
        error.code = 'moveMissing';
        throw error;
      }
      tree.push({ path: file.path, mode: '100644', type: 'blob', sha });
      if (!gone.has(file.from)) {
        gone.add(file.from);
        tree.push({ path: file.from, mode: '100644', type: 'blob', sha: null });
      }
      continue;
    }
    if (file.delete) {
      const under = `${file.path}/`;
      for (const path of existing ?? []) {
        if ((path === file.path || path.startsWith(under)) && !gone.has(path)) {
          gone.add(path);
          tree.push({ path, mode: '100644', type: 'blob', sha: null });
        }
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
    // Everything to do was deletions of paths that are already gone.
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
 * The updater's commit (ADR-0014): inline `content` or blob `sha` entries in chained trees, as one commit; `orphan` creates the branch, 409 where it exists.
 *
 * @param {string} token
 * @param {{repo: string, branch: string}} config
 * @param {{message: string, entries: Array<{path: string, content?: string, sha?: string|null}>, expect?: string, orphan?: boolean}} payload
 *   `content` for text files, `sha` for pre-made blobs (binary/truncated),
 *   `sha: null` for deletion. Deletions must target paths that exist.
 * @param {(entries: Array<object>) => Array<Array<object>>} chunk Pure chunking (from update-plan.js)
 * @returns {Promise<{sha: string}>}
 */
export async function commitTree(token, config, { message, entries, expect, orphan = false }, chunk) {
  const { repo, branch } = config;

  let baseSha = null;
  let treeSha = null;
  if (!orphan) {
    const ref = await gh(token, `/repos/${repo}/git/ref/heads/${branch}`);
    baseSha = ref.object.sha;
    if (expect && expect !== baseSha) {
      const error = new Error('HEAD has moved since the update check');
      error.status = 409;
      throw error;
    }
    const baseCommit = await gh(token, `/repos/${repo}/git/commits/${baseSha}`);
    treeSha = baseCommit.tree.sha;
  }

  for (const group of chunk(entries.map((e) => ({
    path: e.path,
    mode: '100644',
    type: 'blob',
    ...(e.sha !== undefined ? { sha: e.sha } : { content: e.content }),
  })))) {
    const tree = await gh(token, `/repos/${repo}/git/trees`, {
      method: 'POST',
      body: JSON.stringify({ ...(treeSha ? { base_tree: treeSha } : {}), tree: group }),
    });
    treeSha = tree.sha;
  }

  const commit = await gh(token, `/repos/${repo}/git/commits`, {
    method: 'POST',
    body: JSON.stringify({ message, tree: treeSha, parents: baseSha ? [baseSha] : [] }),
  });

  if (orphan) {
    try {
      await gh(token, `/repos/${repo}/git/refs`, {
        method: 'POST',
        body: JSON.stringify({ ref: `refs/heads/${branch}`, sha: commit.sha }),
      });
    } catch (err) {
      // GitHub answers 422 «Reference already exists» where another save made the branch first.
      if (err.status === 422 && /already exists/i.test(err.message)) {
        const error = new Error('The branch exists already');
        error.status = 409;
        throw error;
      }
      throw err;
    }
  } else {
    await gh(token, `/repos/${repo}/git/refs/heads/${branch}`, {
      method: 'PATCH',
      body: JSON.stringify({ sha: commit.sha, force: false }),
    });
  }

  return { sha: commit.sha };
}
