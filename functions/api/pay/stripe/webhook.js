/**
 * The Stripe webhook (ADR-0028): takes the events of a destination the owner
 * registers in the Stripe dashboard, checks that the delivery is signed with
 * the destination's secret and recent, and acknowledges. The site is static
 * and has no order database, so nothing is stored; the orders are read in
 * the Stripe dashboard. The shop of v1.1 forwards the completed session as a
 * notice (ADR-0027). Without the secret in the environment the endpoint
 * takes nothing, and Stripe retries until a secret is set.
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
