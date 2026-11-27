/**
 * GET and POST /api/pay/vipps/session: whether the reference's Vipps MobilePay payment is reserved, read from Vipps on the buyer's return.
 */
import { isReference, hasBuyerKey, sessionAnswer, majorAmount, json } from '../../../_lib/order.js';
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
  const amount = majorAmount(answer.data?.amount?.value, answer.data?.amount?.currency);
  return json(sessionAnswer({ ...summary, amount }, await hasBuyerKey(request, config.clientSecret, reference)));
}

/** The checkout page asks every provider with a POST (PayPal's ask may capture); the answer is the same read. */
export const onRequestPost = onRequestGet;
