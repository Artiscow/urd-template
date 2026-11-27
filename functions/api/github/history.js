/**
 * GET /api/github/history: the most recent publishes, the commits on the publishing branch that touch the site's content/, for a signed-in user.
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
    const path = config.rootDir ? `${config.rootDir}/content` : 'content';
    const commits = await gh(
      token,
      `/repos/${config.repo}/commits?sha=${config.branch}&per_page=15&path=${encodeURIComponent(path)}`,
    );
    return json({
      commits: commits.map((c) => ({
        sha: c.sha,
        // First line only: the rest is detail for git, not for the panel.
        message: c.commit.message.split('\n')[0],
        author: c.author?.login ?? c.commit.author?.name ?? 'unknown',
        date: c.commit.author?.date ?? null,
      })),
    });
  } catch (err) {
    if (err.status === 401) return json({ error: 'Invalid or expired sign-in', code: 'loginExpired' }, 401);
    // 409 = a completely empty repo: no history is a normal state, not an error.
    if (err.status === 409) return json({ commits: [] });
    console.error('Urd history:', err.message);
    return json({ error: 'Could not read the history from GitHub', code: 'historyFailed' }, 502);
  }
}
