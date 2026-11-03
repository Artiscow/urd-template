/**
 * POST /api/github/commit
 * The core of publishing. Body: { message, files: [{path, content, encoding?} | {path, delete: true} | {path, from}] }.
 * Commits all the files as ONE commit through the Git Data API; a move (`from`) takes the file's blob as it stands, so the bytes never travel.
 *
 * Protection (defence in depth, see ADR-0003):
 *  - requires a signed-in token AND that the user is in ALLOWED_LOGINS
 *  - every file path is validated against the path allowlist (content only, never code)
 *  - at most 200 files per commit
 */
import { commitFiles, triggerDeploy } from '../../_lib/github.js';
import { requirePublisher } from '../../_lib/auth.js';
import { isAllowedPath, isAllowedContent, isDeletablePath, isAllowedMove } from '../../_lib/guard.js';

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });

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
  const { message, files, expect } = body ?? {};
  if (typeof message !== 'string' || !message.trim()) {
    return json({ error: 'Commit message is missing', code: 'missingMessage' }, 400);
  }
  if (expect !== undefined && typeof expect !== 'string') {
    return json({ error: 'expect must be a commit sha', code: 'badExpect' }, 400);
  }
  if (!Array.isArray(files) || files.length === 0 || files.length > 200) {
    return json({ error: 'files must be a list of 1 to 200 files', code: 'badFiles' }, 400);
  }
  for (const file of files) {
    // A move (from) is checked on its own: a file in media/ to another path in media/ with the same extension. A sha from the client is never read.
    if (typeof file?.from === 'string') {
      if (typeof file.path !== 'string' || !isAllowedMove(file.from, file.path)) {
        return json({ error: `The file '${file.from}' cannot be moved to '${file.path}'`, code: 'moveNotAllowed', path: file.path }, 400);
      }
      continue;
    }
    // A deletion (delete: true) needs no content; ordinary files do.
    if (typeof file?.path !== 'string' || (file.delete !== true && typeof file?.content !== 'string')) {
      return json({ error: 'Each file needs path, and content (or delete: true, or from)', code: 'badFileEntry' }, 400);
    }
    // A deletion may also take a plugin's whole folder; a write never goes there.
    if (!(file.delete === true ? isDeletablePath(file.path) : isAllowedPath(file.path))) {
      return json({ error: `The path '${file.path}' cannot be published from here`, code: 'pathNotAllowed', path: file.path }, 400);
    }
    // A file whose content is checked (a PDF in media/) must be what its name says, and within its size.
    if (file.delete !== true && !isAllowedContent(file.path, file.content, file.encoding)) {
      return json({ error: `The file '${file.path}' is not a PDF, or is too large`, code: 'fileNotAllowed', path: file.path }, 400);
    }
  }

  // The paths from the editor are relative to the SITE. When the site lives
  // in a subfolder of the repo (GITHUB_ROOT_DIR, e.g. "template"), the paths
  // are prefixed here - AFTER the validation above, which covers site paths.
  const repoFiles = config.rootDir
    ? files.map((f) => ({ ...f, path: `${config.rootDir}/${f.path}`, ...(typeof f.from === 'string' ? { from: `${config.rootDir}/${f.from}` } : {}) }))
    : files;

  try {
    // expect (optional): the HEAD the editor's conflict check saw. If it has
    // moved in the meantime, the commit is rejected with 409 instead of
    // overwriting someone else's fresh publish.
    const { sha } = await commitFiles(token, config, { message, files: repoFiles, expect });
    await triggerDeploy(env);
    return json({ sha });
  } catch (err) {
    // 409 from the expect check, or 422 non-fast-forward from the ref
    // update (someone managed to publish inside the commit window itself).
    if (err.status === 409 || (err.status === 422 && /fast.?forward/i.test(err.message))) {
      return json({ error: 'Someone just published - try publishing again', code: 'publishRace' }, 409);
    }
    // A move of a file the repository does not hold: the editor's listing is stale.
    if (err.code === 'moveMissing') {
      return json({ error: err.message, code: 'moveMissing' }, 400);
    }
    console.error('Urd publish:', err.message);
    // GitHub's actual response is shown to the signed-in editor - without it
    // debugging is impossible. The token is never part of the message.
    return json({ error: `Could not commit to GitHub: ${err.message}`, code: 'commitFailed', detail: err.message }, 502);
  }
}
