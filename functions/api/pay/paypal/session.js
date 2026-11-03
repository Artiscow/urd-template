/**
 * Optional payment layer (ADR-0028): completes and reads a PayPal order on
 * the buyer's return. The checkout page posts here with the reference and
 * the order's id it kept when it sent the buyer to PayPal; an order the
 * buyer approved is captured now (PayPal takes the money at the order,
 * ADR-0028 decision 4), and the page empties the basket only for a
 * completed capture. The order must be the one made for the reference, so
 * another order's id confirms nothing. A POST only, since it may capture;
 * the reference as PayPal's request id makes a repeated ask capture nothing
 * twice. The site stores no order; the answer is read from PayPal each time.
 */
import { isReference, json } from '../../../_lib/order.js';
import { paypalConfig, isOrderId, orderSummary } from '../../../_lib/paypal.js';
import { callPaypal } from '../../../_lib/paypal-api.js';

export async function onRequestPost({ request, env }) {
  const config = paypalConfig(env);
  if (!config) return json({ error: 'PayPal is not configured', code: 'payNotConfigured', provider: 'PayPal' }, 503);
  const params = new URL(request.url).searchParams;
  const reference = params.get('reference');
  const pid = params.get('pid');
  if (!isReference(reference) || !isOrderId(pid)) return json({ error: 'Invalid reference', code: 'orderInvalid' }, 400);

  const read = await callPaypal(config, `/v2/checkout/orders/${pid}`);
  if (!read.ok) return json({ error: read.error, code: read.code, provider: 'PayPal', status: read.upstream }, read.status);
  let summary = orderSummary(read.data);
  if (!summary) return json({ error: 'Unexpected response from PayPal', code: 'payUnexpected', provider: 'PayPal' }, 502);
  if (summary.reference !== reference) return json({ error: 'Invalid reference', code: 'orderInvalid' }, 400);
  if (summary.approved) {
    const captured = await callPaypal(config, `/v2/checkout/orders/${pid}/capture`, { method: 'POST', raw: '{}', headers: { 'PayPal-Request-Id': `${reference}-capture` } });
    // A declined capture leaves the order approved and the basket kept; the buyer may try again.
    if (captured.ok) summary = orderSummary(captured.data) ?? summary;
  }
  return json({ paid: summary.paid, open: summary.open, state: summary.state, buyer: summary.buyer });
}
