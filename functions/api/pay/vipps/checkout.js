/**
 * POST /api/pay/vipps/checkout: a Vipps MobilePay payment for the cart, in the app or on the card page, priced from the catalogue, answered with its address.
 */
import { prepareOrder, makeReference, vatRegistered, buyerKey, json } from '../../../_lib/order.js';
import { vippsConfig, receiptLines, buildPayment } from '../../../_lib/vipps.js';
import { callVipps } from '../../../_lib/vipps-api.js';

export async function onRequestPost({ request, env }) {
  const config = vippsConfig(env);
  if (!config) return json({ error: 'Payment is not configured', code: 'vippsNotConfigured' }, 503);
  const prepared = await prepareOrder(request, 'vipps');
  if (prepared.error) return prepared.error;
  const { clean, origin, site, catalogs, amountMinor, currency } = prepared;
  // The way to pay is one the page's checkout block offers (prepareOrder).
  const method = clean.method;
  // Only a seller outside the VAT register sends the receipt, whose lines carry no tax.
  const receipt = vatRegistered(site) ? null : receiptLines(clean.order, catalogs);

  const reference = makeReference();
  const body = buildPayment({
    amountMinor,
    currency,
    reference,
    order: clean.order,
    contact: clean.contact,
    origin,
    returnPath: clean.returnPath,
    draft: clean.draft,
    method,
    receipt,
  });
  // The reference doubles as the idempotency key: a retried create of the same payment makes no second one.
  const answer = await callVipps(config, '/epayment/v1/payments', { method: 'POST', body, headers: { 'Idempotency-Key': reference } });
  if (!answer.ok) return json({ error: answer.error, code: answer.code, status: answer.upstream }, answer.status);
  if (typeof answer.data?.redirectUrl !== 'string' || !/^https:\/\//.test(answer.data.redirectUrl)) {
    return json({ error: 'Unexpected response from Vipps', code: 'vippsUnexpected' }, 502);
  }
  // The reference and the buyer key go to the client too, which keeps them for the return (blocks/checkout.js).
  return json({ url: answer.data.redirectUrl, reference, key: await buyerKey(config.clientSecret, reference) });
}

/** GET: whether the provider is set up, and on its test keys, without a secret and never cached. */
export function onRequestGet({ env }) {
  const config = vippsConfig(env);
  return new Response(JSON.stringify({ configured: Boolean(config), test: Boolean(config?.test) }), { status: 200, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });
}
