/**
 * POST /api/github/revert: undoes the publish named by { expect }, the latest one, as a new commit on HEAD that sets back only the paths it changed.
 */
import { gh, triggerDeploy } from '../../_lib/github.js';
import { requirePublisher } from '../../_lib/auth.js';
import { revertEntries, treeMap } from '../../_lib/revert-plan.js';

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });

/** The most pages of a commit's changed files read, a hundred files each. */
const MAX_FILE_PAGES = 10;

/** The files a commit changed, a page at a time; more than MAX_FILE_PAGES full pages throws, so a publish is never undone in part. */
async function changedFiles(token, repo, sha) {
  const files = [];
  for (let page = 1; page <= MAX_FILE_PAGES; page += 1) {
    const commit = await gh(token, `/repos/${repo}/commits/${sha}?per_page=100&page=${page}`);
    const batch = commit.files ?? [];
    files.push(...batch);
    if (batch.length < 100) return files;
  }
  throw new Error(`the publish changed more than ${MAX_FILE_PAGES * 100} files`);
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
  if (typeof body?.expect !== 'string' || !/^[0-9a-f]{7,64}$/i.test(body.expect)) {
    return json({ error: 'expect (the publish to revert) is missing or invalid', code: 'badRevertTarget' }, 400);
  }

  try {
    const { repo, branch, rootDir } = config;

    // expect must still be the latest publish (same filter as history.js).
    const contentPath = rootDir ? `${rootDir}/content` : 'content';
    const latest = await gh(
      token,
      `/repos/${repo}/commits?sha=${branch}&per_page=1&path=${encodeURIComponent(contentPath)}`,
    );
    if (latest[0]?.sha !== body.expect) {
      return json({ error: 'Someone has published in the meantime - reload the history', code: 'revertRace' }, 409);
    }

    const target = await gh(token, `/repos/${repo}/git/commits/${body.expect}`);
    // A merge commit is undone against its first parent.
    const targetParentSha = target.parents?.[0]?.sha;
    if (!targetParentSha) return json({ error: 'Nothing to revert: this is the first publish', code: 'nothingToRevert' }, 400);
    const targetParent = await gh(token, `/repos/${repo}/git/commits/${targetParentSha}`);

    const ref = await gh(token, `/repos/${repo}/git/ref/heads/${branch}`);
    const headSha = ref.object.sha;
    const headCommit = await gh(token, `/repos/${repo}/git/commits/${headSha}`);

    // The tree for the new commit: HEAD's, with each path the publish changed set back to how the commit before it held it.
    const files = await changedFiles(token, repo, body.expect);
    const [beforeTree, nowTree] = await Promise.all([
      gh(token, `/repos/${repo}/git/trees/${targetParent.tree.sha}?recursive=1`),
      gh(token, `/repos/${repo}/git/trees/${headCommit.tree.sha}?recursive=1`),
    ]);
    if (beforeTree.truncated || nowTree.truncated) {
      return json({ error: 'The repository tree is too large to undo safely', code: 'revertFailed', detail: 'the git tree is truncated by GitHub' }, 502);
    }
    const { entries } = revertEntries(files, treeMap(beforeTree.tree), treeMap(nowTree.tree), rootDir);
    if (!entries.length) return json({ error: 'Nothing to revert: what this publish changed already stands as it was before it', code: 'revertNothingChanged' }, 400);
    const newTree = await gh(token, `/repos/${repo}/git/trees`, {
      method: 'POST',
      body: JSON.stringify({ base_tree: headCommit.tree.sha, tree: entries }),
    });
    const treeSha = newTree.sha;

    const firstLine = target.message.split('\n')[0];
    const commit = await gh(token, `/repos/${repo}/git/commits`, {
      method: 'POST',
      body: JSON.stringify({
        message: `Revert "${firstLine}" via Urd admin`,
        tree: treeSha,
        parents: [headSha],
      }),
    });
    await gh(token, `/repos/${repo}/git/refs/heads/${branch}`, {
      method: 'PATCH',
      body: JSON.stringify({ sha: commit.sha, force: false }),
    });

    await triggerDeploy(env);
    return json({ sha: commit.sha });
  } catch (err) {
    // 422 non-fast-forward: someone committed inside the revert window itself.
    if (err.status === 422 && /fast.?forward/i.test(err.message)) {
      return json({ error: 'Someone has published in the meantime - reload the history', code: 'revertRace' }, 409);
    }
    console.error('Urd revert:', err.message);
    return json({ error: `Could not revert: ${err.message}`, code: 'revertFailed', detail: err.message }, 502);
  }
}
