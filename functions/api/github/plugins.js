/**
 * GET /api/github/plugins: the plugin folders in the repository's plugins/, read with the sign-in where there is one and anonymously where there is none.
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

  // Signed out: anonymous read (works for public repos). Rate limits are handled below.
  const token = readCookie(request, 'urd_gh') || null;

  try {
    const path = config.rootDir ? `${config.rootDir}/plugins` : 'plugins';
    const entries = await gh(
      token,
      `/repos/${config.repo}/contents/${encodeURIComponent(path).replaceAll('%2F', '/')}?ref=${config.branch}`,
    );
    const plugins = (Array.isArray(entries) ? entries : [])
      .filter((e) => e.type === 'dir')
      .map((e) => e.name)
      .filter((name) => /^[a-z0-9][a-z0-9-]*$/.test(name));
    return json({ plugins });
  } catch (err) {
    if (err.status === 404) return json({ plugins: [] });
    // Anonymous rate limiting (403/429): the editor falls back to the last cached list.
    if (!token && (err.status === 403 || err.status === 429)) {
      return json({ error: 'GitHub rate limit for anonymous reads - sign in or try again later', code: 'rateLimited' }, 503);
    }
    console.error('Urd plugins:', err.message);
    return json({ error: 'Could not read the plugin list from GitHub', code: 'pluginListFailed' }, 502);
  }
}
