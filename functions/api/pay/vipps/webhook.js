/**
 * POST /api/pay/vipps/webhook: checks that a delivery is signed with the registration's secret, and acknowledges it. Nothing is stored.
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
