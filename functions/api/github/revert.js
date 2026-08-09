/**
 * POST /api/github/revert
 * «Angre siste publisering» som FORWARD-revert (ADR-0003): en ny commit
 * med dagens HEAD som forelder - historikk slettes aldri, og angringen
 * kan selv angres.
 *
 * Angringen gjelder NETTSIDEN, ikke repoet: den nye commiten tar HEADs
 * tre, men bytter nettsidens undertre (GITHUB_ROOT_DIR, hele repoet uten
 * rootDir) til slik det var FØR publiseringen som angres. I et monorepo
 * røres altså aldri kode utenfor nettsiden.
 *
 * Body {expect: <sha>}: publiseringen som skal angres. Den må fortsatt
 * være den SISTE innholds-commiten (samme filter som history.js), ellers
 * 409 - to redaktører angrer aldri i beina på hverandre.
 *
 * Kjent begrensning: er publiseringen en merge-commit, gjenopprettes
 * første forelders innholdstilstand.
 */
import { gh, triggerDeploy } from '../../_lib/github.js';
import { requirePublisher } from '../../_lib/auth.js';

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });

/** Sha for undertreet på en sti (f.eks. "template") i et gitt tre. */
async function subtreeSha(token, repo, treeSha, pathSegments) {
  let sha = treeSha;
  for (const segment of pathSegments) {
    const tree = await gh(token, `/repos/${repo}/git/trees/${sha}`);
    const entry = tree.tree.find((t) => t.path === segment && t.type === 'tree');
    if (!entry) return null;
    sha = entry.sha;
  }
  return sha;
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

    // expect må fortsatt være siste publisering (samme filter som history.js).
    const contentPath = rootDir ? `${rootDir}/content` : 'content';
    const latest = await gh(
      token,
      `/repos/${repo}/commits?sha=${branch}&per_page=1&path=${encodeURIComponent(contentPath)}`,
    );
    if (latest[0]?.sha !== body.expect) {
      return json({ error: 'Someone has published in the meantime - reload the history', code: 'revertRace' }, 409);
    }

    const target = await gh(token, `/repos/${repo}/git/commits/${body.expect}`);
    const targetParentSha = target.parents?.[0]?.sha;
    if (!targetParentSha) return json({ error: 'Nothing to revert: this is the first publish', code: 'nothingToRevert' }, 400);
    const targetParent = await gh(token, `/repos/${repo}/git/commits/${targetParentSha}`);

    const ref = await gh(token, `/repos/${repo}/git/ref/heads/${branch}`);
    const headSha = ref.object.sha;

    // Treet for den nye commiten: nettsidens undertre fra før publiseringen,
    // alt annet uendret fra HEAD.
    let treeSha;
    if (rootDir) {
      const before = await subtreeSha(token, repo, targetParent.tree.sha, rootDir.split('/'));
      const headCommit = await gh(token, `/repos/${repo}/git/commits/${headSha}`);
      const newTree = await gh(token, `/repos/${repo}/git/trees`, {
        method: 'POST',
        body: JSON.stringify({
          base_tree: headCommit.tree.sha,
          // sha null sletter undertreet (nettsiden fantes ikke i forelderen).
          tree: [{ path: rootDir, mode: '040000', type: 'tree', sha: before }],
        }),
      });
      treeSha = newTree.sha;
    } else {
      treeSha = targetParent.tree.sha;
    }

    const firstLine = target.message.split('\n')[0];
    const commit = await gh(token, `/repos/${repo}/git/commits`, {
      method: 'POST',
      body: JSON.stringify({
        message: `Angre «${firstLine}» via Urd-admin`,
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
    // 422 non-fast-forward: noen committet i selve angre-vinduet.
    if (err.status === 422 && /fast.?forward/i.test(err.message)) {
      return json({ error: 'Someone has published in the meantime - reload the history', code: 'revertRace' }, 409);
    }
    console.error('Urd revert:', err.message);
    return json({ error: `Could not revert: ${err.message}`, code: 'revertFailed', detail: err.message }, 502);
  }
}
