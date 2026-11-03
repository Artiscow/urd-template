/**
 * The Stripe part of the optional payment layer (ADR-0028): reading the
 * configuration, the form fields of a Checkout Session on Stripe's hosted
 * page, the reading of a finished session, and the webhook signature check.
 * The order logic every provider shares is in order.js; no fetch here, the
 * endpoints under api/pay/stripe/ handle the network. Tested in
 * tests/stripe.test.mjs.
 *
 * The buyer pays on checkout.stripe.com with the methods the owner switches
 * on in the Stripe dashboard (card, Apple Pay, Google Pay, Klarna, MobilePay
 * and the rest), so the site needs no script, frame or connect-src of its own.
 */
import { orderLineItems, orderDescription, returnUrl, cancelUrl } from './order.js';
import { sameText } from './net.js';

/** Reads the configuration from env; null when Stripe is not set up. */
export function stripeConfig(env) {
  const secretKey = env?.STRIPE_SECRET_KEY;
  if (!secretKey || !/^(sk|rk)_(test|live)_[A-Za-z0-9]+$/.test(secretKey)) return null;
  return {
    secretKey,
    apiBase: env.STRIPE_API_BASE || 'https://api.stripe.com',
    // A sandbox key runs in Stripe's test mode; the checkout page shows a line while it is in use.
    test: /^(sk|rk)_test_/.test(secretKey),
    // The signing secret of the webhook destination; without it the webhook endpoint takes nothing.
    webhookSecret: env.STRIPE_WEBHOOK_SECRET || '',
  };
}

/** The page languages Stripe's hosted page knows, among those an Urd site may be written in. */
const STRIPE_LOCALES = ['bg', 'cs', 'da', 'de', 'el', 'en', 'en-GB', 'es', 'et', 'fi', 'fr', 'hr', 'hu', 'it', 'ja', 'ko', 'lt', 'lv', 'mt', 'nb', 'nl', 'pl', 'pt', 'ro', 'ru', 'sk', 'sl', 'sv', 'tr', 'zh'];

/**
 * The language of Stripe's page from the site's language: bokmål for the
 * Norwegian and Sami codes Stripe lacks, the site's own code when Stripe
 * has it, its base language next, and the buyer's browser otherwise.
 */
export function stripeLocale(lang) {
  const code = String(lang ?? '');
  if (/^(no|nb|nn|se|smj|sma)(-|$)/i.test(code)) return 'nb';
  if (STRIPE_LOCALES.includes(code)) return code;
  const base = code.split('-')[0].toLowerCase();
  return STRIPE_LOCALES.includes(base) ? base : 'auto';
}

/** Whether a value looks like an email address worth prefilling (anchored, the CodeQL lesson). */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * The form fields for POST {apiBase}/v1/checkout/sessions, in order, as
 * [name, value] pairs (the API takes application/x-www-form-urlencoded):
 * one-off payment mode, the order lines as price data in the site's
 * currency, the return to the checkout page with the reference and the
 * provider, the cancel back to the plain checkout page, the reference on the
 * session and the payment, and a hold when the block captures at shipping.
 * @param {object} args
 * @param {'ship'|'now'} [args.capture] When the money is taken
 * @param {string} [args.lang] The site's language, for Stripe's page
 * @returns {Array<[string, string]>|null} null when a line has no priced product
 */
export function sessionForm({ order, catalogs, currency = 'NOK', reference, contact, origin, returnPath, draft = false, capture = 'ship', lang }) {
  const items = orderLineItems(order, catalogs, currency);
  if (!items) return null;
  const fields = [
    ['mode', 'payment'],
    ['submit_type', 'pay'],
    ['client_reference_id', reference],
    ['success_url', returnUrl(origin, returnPath, reference, 'stripe', draft)],
    ['cancel_url', cancelUrl(origin, returnPath, draft)],
    ['locale', stripeLocale(lang)],
    ['metadata[reference]', reference],
    ['payment_intent_data[description]', orderDescription(order, contact, 500)],
    ['payment_intent_data[metadata][reference]', reference],
  ];
  if (capture !== 'now') fields.push(['payment_intent_data[capture_method]', 'manual']);
  if (contact?.email && EMAIL_RE.test(contact.email)) fields.push(['customer_email', contact.email]);
  items.forEach((item, i) => {
    fields.push(
      [`line_items[${i}][quantity]`, String(item.qty)],
      [`line_items[${i}][price_data][currency]`, currency.toLowerCase()],
      [`line_items[${i}][price_data][unit_amount]`, String(item.unit)],
      [`line_items[${i}][price_data][product_data][name]`, item.name.slice(0, 250)],
    );
  });
  return fields;
}

/** The Checkout Session ids Stripe makes (anchored, the CodeQL lesson). */
export function isSessionId(value) {
  return typeof value === 'string' && /^cs_(test|live)_[A-Za-z0-9]{10,200}$/.test(value);
}

/**
 * Reads what the checkout page needs from GET {apiBase}/v1/checkout/sessions/{id}
 * with the PaymentIntent expanded: whether the money is taken or held, whether
 * the buyer may still be paying, and the details Stripe collected. A held
 * payment's PaymentIntent waits in `requires_capture`, a captured one is
 * `succeeded`; a method that settles over days stays `processing` and is not
 * confirmed here.
 * @returns {{paid: boolean, open: boolean, state: string, buyer: {name: string, email: string, phone: string}, reference: string}|null} null for an answer without a status
 */
export function sessionSummary(session) {
  const status = typeof session?.status === 'string' ? session.status : '';
  if (!status) return null;
  const intent = session.payment_intent && typeof session.payment_intent === 'object' ? session.payment_intent : {};
  const intentStatus = typeof intent.status === 'string' ? intent.status : '';
  const paid = status === 'complete' && (session.payment_status === 'paid' || ['requires_capture', 'succeeded'].includes(intentStatus));
  const details = session.customer_details && typeof session.customer_details === 'object' ? session.customer_details : {};
  const field = (value) => String(value ?? '').slice(0, 200).trim();
  return {
    paid,
    open: status === 'open',
    state: intentStatus ? `${status}:${intentStatus}` : status,
    buyer: { name: field(details.name), email: field(details.email), phone: field(details.phone) },
    reference: field(session.client_reference_id),
  };
}

/**
 * The parts of a Stripe-Signature header: the timestamp and every v1
 * signature (several while a signing secret is being rolled); other schemes
 * are ignored, as Stripe asks, so a v0 test signature never passes.
 * @returns {{t: number, v1: string[]}|null}
 */
export function parseStripeSignature(header) {
  let t = NaN;
  const v1 = [];
  for (const part of String(header ?? '').split(',')) {
    const at = part.indexOf('=');
    if (at < 0) continue;
    const key = part.slice(0, at).trim();
    const value = part.slice(at + 1).trim();
    if (key === 't' && /^[0-9]{1,12}$/.test(value)) t = Number(value);
    else if (key === 'v1' && /^[0-9a-f]{64}$/.test(value)) v1.push(value);
  }
  return Number.isFinite(t) && v1.length ? { t, v1 } : null;
}

const encoder = new TextEncoder();

/** The hex HMAC-SHA256 of «<timestamp>.<body>» keyed with the signing secret, as Stripe signs a delivery. */
export async function stripeSignature(t, body, secret) {
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const mac = await crypto.subtle.sign('HMAC', key, encoder.encode(`${t}.${body}`));
  return [...new Uint8Array(mac)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

/** How far a delivery's timestamp may stand from the clock, in seconds (Stripe's libraries use five minutes). */
export const SIGNATURE_TOLERANCE = 300;

/**
 * Whether a webhook delivery is signed with the destination's secret and
 * recent: one of the header's v1 signatures must be the one stripeSignature
 * computes, and its timestamp within the tolerance of now, so a captured
 * delivery cannot be replayed later.
 * @param {{header: string|null, body: string, now?: number}} delivery now in Unix seconds
 * @param {string} secret
 * @returns {Promise<boolean>}
 */
export async function verifyStripeWebhook({ header, body, now = Math.floor(Date.now() / 1000) }, secret) {
  if (!secret) return false;
  const parts = parseStripeSignature(header);
  if (!parts || Math.abs(now - parts.t) > SIGNATURE_TOLERANCE) return false;
  const expected = await stripeSignature(parts.t, body, secret);
  return parts.v1.some((given) => sameText(given, expected));
}
