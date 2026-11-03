/**
 * The Vipps MobilePay webhook (ADR-0020, ADR-0028): takes the payment events a
 * registration sends here, checks that the delivery is signed with the
 * registration's secret, and acknowledges. The site is static and has no
 * order database, so nothing is stored; the orders are read in the Vipps
 * portal. The shop of v1.1 forwards the authorised event as a notice
 * (ADR-0027). Without the secret in the environment the endpoint takes
 * nothing, and Vipps retries until a secret is set or the registration lapses.
 */
import { json } from '../../../_lib/order.js';
import { vippsConfig, verifyWebhook } from '../../../_lib/vipps.js';

export async function onRequestPost({ request, env }) {
  const config = vippsConfig(env);
  if (!config?.webhookSecret) return json({ error: 'The webhook is not configured', code: 'vippsNotConfigured' }, 503);
  const url = new URL(request.url);
  const body = await request.text();
  const signed = await verifyWebhook({
    method: 'POST',
    pathAndQuery: `${url.pathname}${url.search}`,
    host: url.host,
    headers: request.headers,
    body,
  }, config.webhookSecret);
  if (!signed) return json({ error: 'The delivery is not signed by the registration', code: 'webhookRejected' }, 401);
  return new Response(null, { status: 200 });
}
