/**
 * The Stripe network side of the payment layer (ADR-0028): one call shape
 * against the Stripe API with the secret key, a form-encoded body and a
 * timeout. The pure logic is in stripe.js.
 */
import { fetchWithin } from './net.js';

/**
 * One call against the Stripe API. The answer is sorted into the error
 * codes the endpoints hand the client (the admin dictionaries hold an
 * api.<code> text for each).
 * @param {object} config From stripeConfig
 * @param {string} path The path under the API base, such as /v1/checkout/sessions
 * @param {{method?: string, form?: Array<[string, string]>, headers?: object}} [init]
 * @returns {Promise<{ok: true, data: any}|{ok: false, status: number, code: string, error: string, upstream?: number}>}
 */
export async function callStripe(config, path, init = {}) {
  const headers = { Authorization: `Bearer ${config.secretKey}`, ...(init.headers ?? {}) };
  let body;
  if (init.form) {
    headers['content-type'] = 'application/x-www-form-urlencoded';
    body = new URLSearchParams(init.form).toString();
  }
  const upstream = await fetchWithin(`${config.apiBase}${path}`, { method: init.method ?? 'GET', headers, body });
  if (!upstream) return { ok: false, status: 502, code: 'payUnreachable', error: 'Could not reach Stripe' };
  if (!upstream.ok) {
    return { ok: false, status: 502, code: 'payUpstreamStatus', error: `Stripe responded ${upstream.status}`, upstream: upstream.status };
  }
  try {
    return { ok: true, data: await upstream.json() };
  } catch {
    return { ok: false, status: 502, code: 'payUnexpected', error: 'Unexpected response from Stripe' };
  }
}
