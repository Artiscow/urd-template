/**
 * The PayPal network side of the payment layer (ADR-0028): the OAuth access
 * token for the app, kept in the isolate until shortly before it expires,
 * and one call shape against PayPal's REST API with the bearer token, a JSON
 * body and a timeout. The pure logic is in paypal.js.
 */
import { fetchWithin, tokenFromAnswer, tokenFresh } from './net.js';

/** The cached token per client id; an isolate serves one site, so the map holds one entry. */
const tokens = new Map();

/**
 * The access token for the app, from the cache or from
 * POST {apiBase}/v1/oauth2/token with the client id and secret.
 * @returns {Promise<string|null>} null when PayPal could not be reached or refused the keys
 */
export async function paypalToken(config) {
  const now = Math.floor(Date.now() / 1000);
  const cached = tokens.get(config.clientId);
  if (tokenFresh(cached, now)) return cached.token;
  const upstream = await fetchWithin(`${config.apiBase}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${btoa(`${config.clientId}:${config.clientSecret}`)}`,
      'content-type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });
  if (!upstream?.ok) return null;
  let answer = null;
  try {
    answer = await upstream.json();
  } catch {
    return null;
  }
  const token = tokenFromAnswer(answer, now);
  if (!token) return null;
  tokens.set(config.clientId, token);
  return token.token;
}

/**
 * One call against PayPal's REST API. The answer is sorted into the error
 * codes the endpoints hand the client (the admin dictionaries hold an
 * api.<code> text for each); the whole order comes back on a write
 * (Prefer: return=representation).
 * @param {object} config From paypalConfig
 * @param {string} path The path under the API base, such as /v2/checkout/orders
 * @param {{method?: string, body?: object, raw?: string, headers?: object}} [init] raw is a JSON body sent as given
 * @returns {Promise<{ok: true, data: any}|{ok: false, status: number, code: string, error: string, upstream?: number}>}
 */
export async function callPaypal(config, path, init = {}) {
  const token = await paypalToken(config);
  if (!token) return { ok: false, status: 502, code: 'payUnreachable', error: 'Could not reach PayPal' };
  const headers = { Authorization: `Bearer ${token}`, Prefer: 'return=representation', ...(init.headers ?? {}) };
  let body;
  if (init.raw !== undefined || init.body !== undefined) {
    headers['content-type'] = 'application/json';
    body = init.raw ?? JSON.stringify(init.body);
  }
  const upstream = await fetchWithin(`${config.apiBase}${path}`, { method: init.method ?? 'GET', headers, body });
  if (!upstream) return { ok: false, status: 502, code: 'payUnreachable', error: 'Could not reach PayPal' };
  if (!upstream.ok) {
    return { ok: false, status: 502, code: 'payUpstreamStatus', error: `PayPal responded ${upstream.status}`, upstream: upstream.status };
  }
  try {
    return { ok: true, data: await upstream.json() };
  } catch {
    return { ok: false, status: 502, code: 'payUnexpected', error: 'Unexpected response from PayPal' };
  }
}
