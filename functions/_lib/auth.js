/**
 * The auth prologue of the signed-in endpoints: the config, the cross-site check, the cookie token, the GitHub user and ALLOWED_LOGINS.
 */
import { cfg, currentUser } from './github.js';
import { readCookie } from './cookies.js';
import { isAllowedLogin } from './guard.js';

const json = (body, status) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });

/**
 * Whether a call of any method comes from a foreign site: by Sec-Fetch-Site, where only same-origin and none pass, else by Origin, else it passes.
 * @param {{secFetchSite: string|null, origin: string|null, url: string}} req
 * @returns {boolean}
 */
export function isCrossOrigin({ secFetchSite, origin, url }) {
  if (secFetchSite) return secFetchSite !== 'same-origin' && secFetchSite !== 'none';
  if (origin) return origin !== new URL(url).origin;
  return false;
}

/**
 * Whether a request's Content-Type is application/json, a type no form can send.
 * @param {Request} request
 * @returns {boolean}
 */
export function isJsonRequest(request) {
  return /^application\/json\s*(?:;|$)/i.test(request.headers.get('content-type') ?? '');
}

/**
 * Runs the whole prologue.
 * Returns {config, token, user} on success, or {response}, which the endpoint should return directly on a rejection.
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

  // Defence in depth against CSRF (on top of SameSite=Lax on the cookie):
  // signed-in calls must come from our own site, never from a foreign one.
  const crossOrigin = isCrossOrigin({
    secFetchSite: request.headers.get('sec-fetch-site'),
    origin: request.headers.get('origin'),
    url: request.url,
  });
  if (crossOrigin) {
    return { response: json({ error: 'The request comes from the wrong site', code: 'wrongOrigin' }, 403) };
  }
  // A call that changes something carries JSON: a form, which passes the check above when it stands on the site's own pages, cannot send it.
  if (request.method !== 'GET' && request.method !== 'HEAD' && !isJsonRequest(request)) {
    return { response: json({ error: 'The request must be sent as JSON', code: 'notJson' }, 415) };
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
