/**
 * POST /api/pay/stripe/webhook: checks that a delivery is recent and signed with the destination's secret, and acknowledges it. Nothing is stored.
 */
import { json } from '../../../_lib/order.js';
import { stripeConfig, verifyStripeWebhook } from '../../../_lib/stripe.js';

export async function onRequestPost({ request, env }) {
  const config = stripeConfig(env);
  if (!config?.webhookSecret) return json({ error: 'The webhook is not configured', code: 'payNotConfigured', provider: 'Stripe' }, 503);
  const body = await request.text();
  const signed = await verifyStripeWebhook({ header: request.headers.get('stripe-signature'), body }, config.webhookSecret);
  if (!signed) return json({ error: 'The delivery is not signed by the destination', code: 'webhookRejected' }, 401);
  return new Response(null, { status: 200 });
}
