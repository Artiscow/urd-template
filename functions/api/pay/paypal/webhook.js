/**
 * The PayPal webhook (ADR-0028): takes the events of a webhook the owner adds
 * to the PayPal app, asks PayPal whether the delivery carries its signature
 * for that webhook (the verify-webhook-signature call, with the event sent
 * back exactly as it arrived), and acknowledges. The site is static and has
 * no order database, so nothing is stored; the orders are read in the
 * PayPal account. Without the webhook's id in the environment the endpoint
 * takes nothing.
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
