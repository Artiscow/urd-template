/**
 * Optional payment layer (ADR-0020, ADR-0028): whether a payment on the
 * Vipps MobilePay ePayment API is reserved. The checkout page asks here on
 * its return from Vipps, with the reference the return address carries,
 * and empties the basket only for a reserved payment; the buyer's shared
 * contact details come along for the receipt on the page. The site stores
 * no order; the answer is read from Vipps each time.
 */
import { isReference, json } from '../../../_lib/order.js';
import { vippsConfig, paymentSummary } from '../../../_lib/vipps.js';
import { callVipps } from '../../../_lib/vipps-api.js';

export async function onRequestGet({ request, env }) {
  const config = vippsConfig(env);
  if (!config) return json({ error: 'Payment is not configured', code: 'vippsNotConfigured' }, 503);
  const reference = new URL(request.url).searchParams.get('reference');
  if (!isReference(reference)) return json({ error: 'Invalid reference', code: 'orderInvalid' }, 400);

  const answer = await callVipps(config, `/epayment/v1/payments/${reference}`);
  if (!answer.ok) return json({ error: answer.error, code: answer.code, status: answer.upstream }, answer.status);
  const summary = paymentSummary(answer.data);
  if (!summary) return json({ error: 'Unexpected response from Vipps', code: 'vippsUnexpected' }, 502);
  return json(summary);
}

/** The checkout page asks every provider with a POST (PayPal's ask may capture); the answer is the same read. */
export const onRequestPost = onRequestGet;
