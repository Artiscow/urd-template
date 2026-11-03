/**
 * Optional payment layer (ADR-0028): creates a PayPal order for the cart and
 * answers with the address of PayPal's approval page; the client redirects
 * there and the buyer approves with the PayPal account, or a card where
 * PayPal offers that. The amount is recomputed from the git-owned catalogue
 * in the site's currency (never the client's numbers), and the app's keys
 * live in the Cloudflare environment. Without them the answer is 503, and
 * the checkout block shows a calm unavailable message.
 */
import { prepareOrder, makeReference, json } from '../../../_lib/order.js';
import { paypalConfig, buildOrder, approvalUrl, PAYPAL_CURRENCIES } from '../../../_lib/paypal.js';
import { callPaypal } from '../../../_lib/paypal-api.js';

export async function onRequestPost({ request, env }) {
  const config = paypalConfig(env);
  if (!config) return json({ error: 'PayPal is not configured', code: 'payNotConfigured', provider: 'PayPal' }, 503);
  const prepared = await prepareOrder(request);
  if (prepared.error) return prepared.error;
  const { clean, origin, site, catalogs, currency } = prepared;
  if (!PAYPAL_CURRENCIES.includes(currency)) {
    return json({ error: `PayPal does not take ${currency}`, code: 'payCurrency', provider: 'PayPal', currency }, 400);
  }
  const reference = makeReference();
  const body = buildOrder({
    order: clean.order,
    catalogs,
    currency,
    reference,
    contact: clean.contact,
    origin,
    returnPath: clean.returnPath,
    draft: clean.draft,
    brand: site?.title,
  });
  if (!body) return json({ error: `PayPal cannot take this amount in ${currency}`, code: 'payCurrency', provider: 'PayPal', currency }, 400);
  // The reference doubles as the idempotency key: a retried create of the same order makes no second one.
  const answer = await callPaypal(config, '/v2/checkout/orders', { method: 'POST', body, headers: { 'PayPal-Request-Id': reference } });
  if (!answer.ok) return json({ error: answer.error, code: answer.code, provider: 'PayPal', status: answer.upstream }, answer.status);
  const url = approvalUrl(answer.data);
  const id = answer.data?.id;
  if (!url || typeof id !== 'string') return json({ error: 'Unexpected response from PayPal', code: 'payUnexpected', provider: 'PayPal' }, 502);
  // The reference and the order's id go to the client, which keeps them for the return (blocks/checkout.js).
  return json({ url, reference, pid: id });
}

/** Whether the provider is set up, and on its test keys: the editor's checkout block asks on a click, and the published checkout shows a line while test keys are in use. No secret leaves; the answer is never cached. */
export function onRequestGet({ env }) {
  const config = paypalConfig(env);
  return new Response(JSON.stringify({ configured: Boolean(config), test: Boolean(config?.test) }), { status: 200, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });
}
