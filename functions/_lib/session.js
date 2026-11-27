/**
 * The renewal of an expiring GitHub sign-in: its refresh token and end kept in the cookie 'urd_ghr', and the rule for when the sign-in status renews it.
 */
import { serializeCookie, expireCookie, readCookie } from './cookies.js';

/** The cookie holding the sign-in itself. */
export const SESSION_COOKIE = 'urd_gh';
/** The cookie holding the time the sign-in ends and its refresh token, as `<seconds>.<token>`. */
export const RENEW_COOKIE = 'urd_ghr';
/** The path the renewal cookie is sent to: the site's functions under /api/github, never its pages. */
export const RENEW_PATH = '/api/github';
/** How long before its end a sign-in is renewed, in seconds. */
export const RENEW_BEFORE = 15 * 60;
/** How much earlier a sign-in is renewed where the editor asks before a publish or a save (`?soon=1`), in seconds: the editor's RENEW_LEAD. */
export const RENEW_SOON = 5 * 60;
/** The shortest wait the editor is told before it asks again, in seconds. */
export const RENEW_LEAST = 60;

const RENEW_VALUE = /^(\d{9,11})\.([A-Za-z0-9_]{20,255})$/;
const REFRESH_TOKEN = /^[A-Za-z0-9_]{20,255}$/;

/**
 * The scope the login asks for: the site's GITHUB_SCOPE, split on spaces or commas, each value once, and `offline_access` for a refresh token.
 * @param {string} scope
 * @returns {string}
 */
export function loginScope(scope) {
  return [...new Set([...String(scope ?? '').split(/[\s,]+/).filter(Boolean), 'offline_access'])].join(' ');
}

/** Seconds since 1970, the unit the renewal cookie keeps the end in. */
export const nowSeconds = () => Math.floor(Date.now() / 1000);

/**
 * The renewal a request carries, or null where it carries none or one not in the shape this file writes.
 * @param {Request} request
 * @returns {{expiresAt: number, refreshToken: string}|null}
 */
export function readRenewal(request) {
  const match = RENEW_VALUE.exec(readCookie(request, RENEW_COOKIE) ?? '');
  return match ? { expiresAt: Number(match[1]), refreshToken: match[2] } : null;
}

/** Whether a sign-in ending at `expiresAt` is renewed now, `lead` seconds earlier than RENEW_BEFORE where asked. */
export function renewDue(expiresAt, now, lead = 0) {
  return now >= expiresAt - RENEW_BEFORE - lead;
}

/** The seconds until the editor asks again: when the sign-in falls due, a few seconds after so the status call finds it due, and never sooner than RENEW_LEAST. */
export function renewIn(expiresAt, now) {
  return Math.max(RENEW_LEAST, expiresAt - RENEW_BEFORE - now + 5);
}

/**
 * The Set-Cookie values for GitHub's answer to a sign-in or a renewal: the sign-in, and the renewal cookie where the answer carries one, else its removal.
 * @param {{access_token: string, expires_in?: number|string, refresh_token?: string}} answer
 * @param {number} now Seconds since 1970
 * @returns {string[]}
 */
export function sessionCookies(answer, now) {
  const cookies = [serializeCookie(SESSION_COOKIE, answer.access_token)];
  const expiresIn = Number(answer.expires_in);
  if (typeof answer.refresh_token === 'string' && REFRESH_TOKEN.test(answer.refresh_token) && Number.isInteger(expiresIn) && expiresIn > 0) {
    cookies.push(serializeCookie(RENEW_COOKIE, `${now + expiresIn}.${answer.refresh_token}`, { path: RENEW_PATH }));
  } else {
    cookies.push(expireCookie(RENEW_COOKIE, RENEW_PATH));
  }
  return cookies;
}

/** The Set-Cookie values that end the sign-in in this browser. */
export function endSessionCookies() {
  return [expireCookie(SESSION_COOKIE), expireCookie(RENEW_COOKIE, RENEW_PATH)];
}

/**
 * Renews a sign-in at GitHub with its refresh token: the new sign-in, or null for any answer without one, a refused renewal included.
 * @param {{clientId: string, clientSecret: string}} config
 * @param {string} refreshToken
 * @returns {Promise<{access_token: string, expires_in?: number, refresh_token?: string}|null>}
 */
export async function renewToken(config, refreshToken) {
  try {
    const res = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { accept: 'application/json', 'content-type': 'application/json' },
      body: JSON.stringify({
        client_id: config.clientId,
        client_secret: config.clientSecret,
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }),
    });
    if (!res.ok) return null;
    const answer = await res.json();
    return typeof answer?.access_token === 'string' && answer.access_token ? answer : null;
  } catch {
    return null;
  }
}
