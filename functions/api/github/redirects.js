/**
 * GET /api/github/redirects
 * The `_redirects` file as the repository holds it ({ text }, or { text: null } when there is none), so the editor can read a file written by hand into its list of redirects before publishing first writes the file (ADR-0015). Signed in only, as the media listing is.
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
    const path = config.rootDir ? `${config.rootDir}/_redirects` : '_redirects';
    const file = await gh(token, `/repos/${config.repo}/contents/${encodeURIComponent(path).replaceAll('%2F', '/')}?ref=${config.branch}`);
    const bytes = Uint8Array.from(atob(String(file.content ?? '').replace(/\s/g, '')), (c) => c.charCodeAt(0));
    return json({ text: new TextDecoder().decode(bytes) });
  } catch (err) {
    if (err.status === 404) return json({ text: null });
    console.error('Urd redirects:', err.message);
    return json({ error: `Could not read the redirect file: ${err.message}`, code: 'redirectsReadFailed' }, 502);
  }
}
