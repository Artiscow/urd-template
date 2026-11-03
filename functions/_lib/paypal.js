/**
 * The PayPal part of the optional payment layer (ADR-0028): reading the
 * configuration, the amount in PayPal's decimal form, the body of an order
 * on the Orders v2 API with PayPal's own approval page, the approval
 * address in the answer, the reading of a finished order, and the body of
 * the webhook check PayPal performs for the site. The order logic every
 * provider shares is in order.js; no fetch here, the endpoints under
 * api/pay/paypal/ handle the network. Tested in tests/paypal.test.mjs.
 *
 * PayPal takes the money when the buyer returns from approving (intent
 * CAPTURE): an authorisation is honoured for 3 days only, and PayPal
 * documents capturing one later through the merchant's own server code,
 * which the static site does not run (ADR-0028 decision 4).
 */
import { orderLineItems, orderDescription, returnUrl, cancelUrl, currencyExponent } from './order.js';
import { hostOf } from './net.js';

/** Reads the configuration from env; null when PayPal is not set up. */
export function paypalConfig(env) {
  const clientId = env?.PAYPAL_CLIENT_ID;
  const clientSecret = env?.PAYPAL_CLIENT_SECRET;
  if (!clientId || !clientSecret) return null;
  return {
    clientId,
    clientSecret,
    apiBase: env.PAYPAL_API_BASE || 'https://api-m.paypal.com',
    // The sandbox is its own host, by its current name or its older one; the checkout page shows a line while it is in use.
    test: ['api-m.sandbox.paypal.com', 'api.sandbox.paypal.com'].includes(hostOf(env.PAYPAL_API_BASE)),
    // The id of the webhook in the PayPal app; without it the webhook endpoint takes nothing.
    webhookId: env.PAYPAL_WEBHOOK_ID || '',
  };
}

/** The currencies PayPal's REST API takes. */
export const PAYPAL_CURRENCIES = ['AUD', 'BRL', 'CAD', 'CNY', 'CZK', 'DKK', 'EUR', 'HKD', 'HUF', 'ILS', 'JPY', 'MYR', 'MXN', 'TWD', 'NZD', 'NOK', 'PHP', 'PLN', 'GBP', 'RUB', 'SGD', 'SEK', 'CHF', 'THB', 'USD'];

/** The currencies PayPal refuses decimals in. */
const NO_DECIMALS = new Set(['HUF', 'JPY', 'TWD']);

/**
 * An amount in the currency's minor unit as PayPal's decimal string
 * («700.00», «350» for yen), or null when PayPal cannot take it: a currency
 * it lacks, or a fraction in a currency it takes whole only.
 */
export function paypalValue(minor, currency) {
  const code = String(currency ?? '').toUpperCase();
  if (!PAYPAL_CURRENCIES.includes(code) || !Number.isInteger(minor) || minor < 0) return null;
  const exponent = currencyExponent(code);
  if (NO_DECIMALS.has(code)) {
    if (exponent === 0) return String(minor);
    return minor % 100 === 0 ? String(minor / 100) : null;
  }
  return (minor / 10 ** exponent).toFixed(exponent);
}

/**
 * The body for POST {apiBase}/v2/checkout/orders: one purchase unit with the
 * order lines as items in the site's currency, the reference as the unit's
 * reference, custom id and invoice id (unique per order, so the order is
 * found by it in PayPal), the order in one line as the description, and
 * PayPal's own page with «Pay now», no shipping address asked, the return to
 * the checkout page with the reference and the provider, and the cancel back
 * to the plain checkout page.
 * @param {object} args
 * @param {string} [args.brand] The site's name on PayPal's page
 * @returns {object|null} null when a line has no priced product or PayPal cannot take an amount
 */
export function buildOrder({ order, catalogs, currency = 'NOK', reference, contact, origin, returnPath, draft = false, brand }) {
  const items = orderLineItems(order, catalogs, currency);
  if (!items) return null;
  const code = currency.toUpperCase();
  const lines = [];
  let total = 0;
  for (const item of items) {
    const unit = paypalValue(item.unit, code);
    if (unit == null) return null;
    lines.push({ name: item.name.slice(0, 127), sku: item.id.slice(0, 127), quantity: String(item.qty), unit_amount: { currency_code: code, value: unit } });
    total += item.total;
  }
  const value = paypalValue(total, code);
  if (value == null) return null;
  const experience = {
    return_url: returnUrl(origin, returnPath, reference, 'paypal', draft),
    cancel_url: cancelUrl(origin, returnPath, draft),
    user_action: 'PAY_NOW',
    shipping_preference: 'NO_SHIPPING',
  };
  const name = String(brand ?? '').trim();
  if (name) experience.brand_name = name.slice(0, 127);
  return {
    intent: 'CAPTURE',
    purchase_units: [{
      reference_id: reference,
      custom_id: reference,
      invoice_id: reference,
      description: orderDescription(order, contact, 127),
      amount: { currency_code: code, value, breakdown: { item_total: { currency_code: code, value } } },
      items: lines,
    }],
    payment_source: { paypal: { experience_context: experience } },
  };
}

/** The address the buyer approves the order at: the answer's payer-action link (or approve, its earlier name). */
export function approvalUrl(answer) {
  const links = Array.isArray(answer?.links) ? answer.links : [];
  const link = links.find((l) => l?.rel === 'payer-action') ?? links.find((l) => l?.rel === 'approve');
  const href = typeof link?.href === 'string' ? link.href : '';
  return /^https:\/\//.test(href) ? href : null;
}

/** The order ids PayPal makes (anchored, the CodeQL lesson). */
export function isOrderId(value) {
  return typeof value === 'string' && /^[A-Z0-9]{8,40}$/.test(value);
}

/**
 * Reads what the checkout page needs from an order (GET {apiBase}/v2/checkout/orders/{id},
 * or the answer of its capture): whether it is captured, whether the buyer may
 * still be approving, whether it waits to be captured, and who paid. A
 * capture that PayPal holds for review (PENDING) is not confirmed here.
 * @returns {{paid: boolean, open: boolean, approved: boolean, state: string, buyer: {name: string, email: string, phone: string}, reference: string}|null} null for an answer without a status
 */
export function orderSummary(order) {
  const status = typeof order?.status === 'string' ? order.status : '';
  if (!status) return null;
  const unit = Array.isArray(order.purchase_units) ? order.purchase_units[0] ?? {} : {};
  const captures = Array.isArray(unit.payments?.captures) ? unit.payments.captures : [];
  const field = (value) => String(value ?? '').slice(0, 200).trim();
  const payer = order.payer && typeof order.payer === 'object' ? order.payer : {};
  const name = [field(payer.name?.given_name), field(payer.name?.surname)].filter(Boolean).join(' ');
  return {
    paid: status === 'COMPLETED' && captures.some((c) => c?.status === 'COMPLETED'),
    open: ['CREATED', 'SAVED', 'PAYER_ACTION_REQUIRED'].includes(status),
    approved: status === 'APPROVED',
    state: captures[0]?.status ? `${status}:${captures[0].status}` : status,
    buyer: { name, email: field(payer.email_address), phone: field(payer.phone?.phone_number?.national_number) },
    reference: field(unit.reference_id),
  };
}

/** The delivery headers PayPal's verification asks for, by the body field each fills. */
export const WEBHOOK_HEADERS = {
  auth_algo: 'paypal-auth-algo',
  cert_url: 'paypal-cert-url',
  transmission_id: 'paypal-transmission-id',
  transmission_sig: 'paypal-transmission-sig',
  transmission_time: 'paypal-transmission-time',
};

/**
 * The body for POST {apiBase}/v1/notifications/verify-webhook-signature,
 * written as text so the event goes back to PayPal exactly as it arrived
 * (PayPal asks for the event unchanged; a parsed and re-serialised event may
 * differ). Null when a header is missing or the body is no JSON object.
 * @param {{get(name: string): string|null}} headers
 * @param {string} rawBody The delivery's body as received
 * @param {string} webhookId
 * @returns {string|null}
 */
export function verificationBody(headers, rawBody, webhookId) {
  if (!webhookId) return null;
  const fields = {};
  for (const [field, header] of Object.entries(WEBHOOK_HEADERS)) {
    const value = headers.get(header);
    if (!value) return null;
    fields[field] = value;
  }
  try {
    const event = JSON.parse(rawBody);
    if (!event || typeof event !== 'object' || Array.isArray(event)) return null;
  } catch {
    return null;
  }
  const head = JSON.stringify({ ...fields, webhook_id: webhookId });
  return `${head.slice(0, -1)},"webhook_event":${rawBody.trim()}}`;
}
