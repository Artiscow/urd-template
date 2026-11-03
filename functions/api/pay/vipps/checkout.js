/**
 * Optional payment layer (ADR-0020, ADR-0028): creates a payment on the
 * Vipps MobilePay ePayment API for the cart, in the app or on Vipps's card
 * page, and answers with the address the buyer is sent to; the client
 * redirects there, and the money is reserved until the seller captures it
 * in the Vipps portal when the goods ship. The amount is recomputed from
 * the git-owned catalogue (never the client's numbers), and the secrets
 * live in the Cloudflare environment. Without configuration the answer is
 * 503, and the checkout block shows a calm unavailable message (the form
 * checkout works unchanged).
 */
import { prepareOrder, makeReference, vatRegistered, json } from '../../../_lib/order.js';
import { vippsConfig, receiptLines, buildPayment, VIPPS_METHODS } from '../../../_lib/vipps.js';
import { callVipps } from '../../../_lib/vipps-api.js';

export async function onRequestPost({ request, env }) {
  const config = vippsConfig(env);
  if (!config) return json({ error: 'Payment is not configured', code: 'vippsNotConfigured' }, 503);
  const prepared = await prepareOrder(request);
  if (prepared.error) return prepared.error;
  const { clean, payload, origin, site, catalogs, amountMinor, currency } = prepared;
  const method = VIPPS_METHODS.includes(payload.method) ? payload.method : 'wallet';
  // The receipt in the buyer's app carries the lines without tax, so only a seller outside the VAT register sends one (the VAT lines come with the shop of v1.1, ADR-0027).
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
  // The reference goes to the client too, which keeps it for the return (blocks/checkout.js).
  return json({ url: answer.data.redirectUrl, reference });
}

/** Whether the provider is set up, and on its test keys: the editor's checkout block asks on a click, and the published checkout shows a line while test keys are in use. No secret leaves; the answer is never cached. */
export function onRequestGet({ env }) {
  const config = vippsConfig(env);
  return new Response(JSON.stringify({ configured: Boolean(config), test: Boolean(config?.test) }), { status: 200, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });
}
