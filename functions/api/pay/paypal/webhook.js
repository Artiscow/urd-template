/**
 * POST /api/pay/paypal/webhook: asks PayPal to verify a delivery for PAYPAL_WEBHOOK_ID, the event sent back as it came, and acknowledges it. Nothing is stored.
 */
import { json } from '../../../_lib/order.js';
import { paypalConfig, verificationBody } from '../../../_lib/paypal.js';
import { callPaypal } from '../../../_lib/paypal-api.js';

export async function onRequestPost({ request, env }) {
  const config = paypalConfig(env);
  if (!config?.webhookId) return json({ error: 'The webhook is not configured', code: 'payNotConfigured', provider: 'PayPal' }, 503);
  const raw = await request.text();
  const body = verificationBody(request.headers, raw, config.webhookId);
  if (!body) return json({ error: 'The delivery is not signed by the webhook', code: 'webhookRejected' }, 401);
  const answer = await callPaypal(config, '/v1/notifications/verify-webhook-signature', { method: 'POST', raw: body });
  if (!answer.ok) return json({ error: answer.error, code: answer.code, provider: 'PayPal', status: answer.upstream }, answer.status);
  if (answer.data?.verification_status !== 'SUCCESS') return json({ error: 'The delivery is not signed by the webhook', code: 'webhookRejected' }, 401);
  return new Response(null, { status: 200 });
}
