/**
 * Delt auth-prolog for muterende endepunkter (v0.6 M1, teknisk opprydding).
 * Samler det som før var duplisert i commit.js og revert.js: konfig, CSRF-origin-sjekk,
 * cookie-token, GitHub-brukeroppslag og ALLOWED_LOGINS-håndhevelse.
 */
import { cfg, currentUser } from './github.js';
import { readCookie } from './cookies.js';
import { isAllowedLogin } from './guard.js';

const json = (body, status) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });

/**
 * Kjører hele prologen. Returnerer {config, token, user} ved suksess,
 * eller {response} som endepunktet skal returnere direkte ved avvisning.
 *
 * @param {Request} request
 * @param {object} env
 * @returns {Promise<{config?: object, token?: string, user?: object, response?: Response}>}
 */
export async function requirePublisher(request, env) {
  let config;
  try {
    config = cfg(env);
  } catch (err) {
    return { response: json({ error: err.message, code: err.code, key: err.key }, 503) };
  }

  // Forsvar i dybden mot CSRF (i tillegg til SameSite=Lax på cookien):
  // muterende kall skal komme fra vår egen side, aldri fra et fremmed nettsted.
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) {
    return { response: json({ error: 'The request comes from the wrong site', code: 'wrongOrigin' }, 403) };
  }

  const token = readCookie(request, 'urd_gh');
  if (!token) return { response: json({ error: 'Not signed in', code: 'notLoggedIn' }, 401) };

  let user;
  try {
    user = await currentUser(token);
  } catch (err) {
    if (err.status === 401) return { response: json({ error: 'Invalid or expired sign-in', code: 'loginExpired' }, 401) };
    return { response: json({ error: 'GitHub is unavailable right now - try again shortly', code: 'githubUnavailable' }, 503) };
  }
  if (!isAllowedLogin(user.login, env)) {
    return { response: json({ error: `The GitHub user '${user.login}' does not have publishing access`, code: 'notAllowed', login: user.login }, 403) };
  }

  return { config, token, user };
}
