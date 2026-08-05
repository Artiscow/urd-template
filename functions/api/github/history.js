/**
 * GET /api/github/history
 * Siste publiseringer: commits på publiseringsgrenen som rører nettsidens
 * innhold (content/ under GITHUB_ROOT_DIR). Dermed vises PUBLISERINGER,
 * ikke alle repo-commits - i et monorepo (som Urds eget) ville lista
 * ellers vært full av utviklingscommits. Lesende endepunkt: krever kun
 * innlogging (samme nivå som latest.js).
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
  if (!token) return json({ error: 'Ikke innlogget', code: 'notLoggedIn' }, 401);

  try {
    const path = config.rootDir ? `${config.rootDir}/content` : 'content';
    const commits = await gh(
      token,
      `/repos/${config.repo}/commits?sha=${config.branch}&per_page=15&path=${encodeURIComponent(path)}`,
    );
    return json({
      commits: commits.map((c) => ({
        sha: c.sha,
        // Kun første linje: resten er detaljer for git, ikke for panelet.
        message: c.commit.message.split('\n')[0],
        author: c.author?.login ?? c.commit.author?.name ?? 'ukjent',
        date: c.commit.author?.date ?? null,
      })),
    });
  } catch (err) {
    if (err.status === 401) return json({ error: 'Ugyldig eller utløpt innlogging', code: 'loginExpired' }, 401);
    // 409 = helt tomt repo: ingen historikk er en normal tilstand, ikke feil.
    if (err.status === 409) return json({ commits: [] });
    console.error('Urd history:', err.message);
    return json({ error: 'Kunne ikke lese historikken fra GitHub', code: 'historyFailed' }, 502);
  }
}
