/**
 * GET /api/github/latest[?base=<sha>]
 * Returnerer HEAD-commit på publiseringsgrenen; med ?base listes i tillegg
 * filene endret i base..HEAD. Editoren bruker dette til konfliktdeteksjon:
 * har noen andre publisert siden innlasting, varsles redaktøren.
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

    const base = new URL(request.url).searchParams.get('base');
    if (!base || base === head) return json({ head, changedFiles: [] });
    // base går inn i GitHub-API-stien og må være en ekte commit-sha, ikke vilkårlig tekst.
    if (!/^[0-9a-f]{7,64}$/i.test(base)) return json({ error: 'Invalid base', code: 'badBase' }, 400);

    const diff = await gh(token, `/repos/${config.repo}/compare/${base}...${head}`);
    // Rapporter stier relative til nettsiden (samme rom som editoren bruker).
    const prefix = config.rootDir ? `${config.rootDir}/` : '';
    const allFiles = diff.files ?? [];
    const changedFiles = allFiles
      .map((f) => f.filename)
      .filter((name) => name.startsWith(prefix))
      .map((name) => name.slice(prefix.length));
    // GitHub avkorter fillisten ved 300: da KAN nettside-filer mangle, og
    // konfliktsjekken må behandle diffen som «kan overlappe». Flagget
    // settes på hele diffens lengde (avkortingen skjer før vårt filter),
    // men først når grensen faktisk er nådd.
    return json({ head, changedFiles, truncated: allFiles.length >= 300 });
  } catch (err) {
    console.error('Urd latest:', err.message);
    return json({ error: 'Could not read repository status from GitHub', code: 'statusFailed' }, 502);
  }
}
