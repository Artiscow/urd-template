/**
 * What the payment providers' helpers share: a fetch with a timeout, an access token's cache rule, a constant-time comparison and an address's host.
 */

/** The host of an address, or '' when it is no address: the test environment is told by its host, never by a substring. */
export function hostOf(url) {
  try { return new URL(String(url ?? '')).host; } catch { return ''; }
}

/** A provider answers within this, or the call is given up. */
export const TIMEOUT_MS = 10000;

/** fetch with a timeout; a network failure or a timeout gives null. */
export async function fetchWithin(url, init = {}, ms = TIMEOUT_MS) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/** How long before its expiry a cached access token is dropped, in seconds. */
const TOKEN_MARGIN = 60;

/**
 * The access token to keep from a provider's token answer and the time it may be used until: expires_on where given, else expires_in seconds from now.
 * @param {{access_token?: string, expires_on?: string|number, expires_in?: string|number}} answer
 * @param {number} now Unix seconds
 * @returns {{token: string, until: number}|null}
 */
export function tokenFromAnswer(answer, now) {
  const token = typeof answer?.access_token === 'string' ? answer.access_token : '';
  if (!token) return null;
  const on = Number(answer.expires_on);
  const within = Number(answer.expires_in);
  const until = Number.isFinite(on) && on > now ? on : Number.isFinite(within) && within > 0 ? now + within : now + 300;
  return { token, until: until - TOKEN_MARGIN };
}

/** Whether a cached token may still be sent. */
export function tokenFresh(cached, now) {
  return Boolean(cached?.token) && cached.until > now;
}

/** Constant-time comparison of two short strings. */
export function sameText(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
