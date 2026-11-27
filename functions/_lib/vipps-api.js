/**
 * The Vipps MobilePay network side (ADR-0020): the sales unit's access token, cached in the isolate, and one call shape with the common headers and a timeout.
 */
import { fetchWithin, tokenFromAnswer, tokenFresh } from './net.js';

/** The cached token per client id; an isolate serves one site, so the map holds one entry. */
const tokens = new Map();

/** The headers every call carries: the subscription key, the sales unit and the system name. */
function baseHeaders(config) {
  return {
    'Ocp-Apim-Subscription-Key': config.subscriptionKey,
    'Merchant-Serial-Number': config.msn,
    'Vipps-System-Name': 'urd',
  };
}

/**
 * The access token for the sales unit, from the cache or from POST {apiBase}/accesstoken/get with the client id and secret.
 * @returns {Promise<string|null>} null when Vipps could not be reached or refused the keys
 */
export async function accessToken(config) {
  const now = Math.floor(Date.now() / 1000);
  const cached = tokens.get(config.clientId);
  if (tokenFresh(cached, now)) return cached.token;
  const upstream = await fetchWithin(`${config.apiBase}/accesstoken/get`, {
    method: 'POST',
    headers: { ...baseHeaders(config), client_id: config.clientId, client_secret: config.clientSecret },
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
 * One call against the Vipps MobilePay API with the bearer token and the common headers, its failure sorted into the error codes the endpoints hand the client.
 * @param {object} config From vippsConfig
 * @param {string} path The path under the API base, such as /epayment/v1/payments
 * @param {{method?: string, body?: object, headers?: object}} [init]
 * @returns {Promise<{ok: true, data: any}|{ok: false, status: number, code: string, error: string, upstream?: number}>}
 */
export async function callVipps(config, path, init = {}) {
  const token = await accessToken(config);
  if (!token) return { ok: false, status: 502, code: 'vippsUnreachable', error: 'Could not reach Vipps' };
  const headers = { ...baseHeaders(config), Authorization: `Bearer ${token}`, ...(init.headers ?? {}) };
  let body;
  if (init.body !== undefined) {
    headers['content-type'] = 'application/json';
    body = JSON.stringify(init.body);
  }
  const upstream = await fetchWithin(`${config.apiBase}${path}`, { method: init.method ?? 'GET', headers, body });
  if (!upstream) return { ok: false, status: 502, code: 'vippsUnreachable', error: 'Could not reach Vipps' };
  if (!upstream.ok) {
    return { ok: false, status: 502, code: 'vippsUpstreamStatus', error: `Vipps responded ${upstream.status}`, upstream: upstream.status };
  }
  try {
    return { ok: true, data: await upstream.json() };
  } catch {
    return { ok: false, status: 502, code: 'vippsUnexpected', error: 'Unexpected response from Vipps' };
  }
}
