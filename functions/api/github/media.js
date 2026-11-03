/**
 * GET /api/github/media
 * The files in media/ as the repository holds them, each with its path (relative to the site), its size and its blob sha: the listing the Site panel's
 * «Tidy the media folder» works from, and the media library to come reads. The tree is read recursively; a tree GitHub truncates says so (`truncated`).
 */
import { cfg, gh } from '../../_lib/github.js';
import { readCookie } from '../../_lib/cookies.js';

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });

export async function onRequestGet({ request, env }) {
  let config;
  try {
    config = cfg(env);
  } catch (err) {
    return json({ error: err.message, code: err.code, key: err.key }, 503);
  }

  const token = readCookie(request, 'urd_gh');
  if (!token) return json({ error: 'Not signed in', code: 'notLoggedIn' }, 401);

  try {
    const ref = await gh(token, `/repos/${config.repo}/git/ref/heads/${config.branch}`);
    const head = ref.object.sha;
    const commit = await gh(token, `/repos/${config.repo}/git/commits/${head}`);
    const tree = await gh(token, `/repos/${config.repo}/git/trees/${commit.tree.sha}?recursive=1`);
    const prefix = `${config.rootDir ? `${config.rootDir}/` : ''}media/`;
    const files = (tree.tree ?? [])
      .filter((entry) => entry.type === 'blob' && entry.path.startsWith(prefix))
      .map((entry) => ({ path: entry.path.slice(prefix.length - 'media/'.length), size: entry.size ?? 0, sha: entry.sha }));
    return json({ head, truncated: tree.truncated === true, files });
  } catch (err) {
    console.error('Urd media:', err.message);
    return json({ error: `Could not list the media files: ${err.message}`, code: 'mediaListFailed' }, 502);
  }
}
