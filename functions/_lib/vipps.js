/**
 * Vipps MobilePay in the payment layer (ADR-0028): the configuration, the epayment/v1 body, the receipt lines, a payment's state and the webhook signature check.
 */
import { orderLineItems, orderDescription, returnUrl } from './order.js';
import { sameText, hostOf } from './net.js';

/** Reads the configuration from env; null when the payment layer is not set up. */
export function vippsConfig(env) {
  const clientId = env?.VIPPS_CLIENT_ID;
  const clientSecret = env?.VIPPS_CLIENT_SECRET;
  const subscriptionKey = env?.VIPPS_SUBSCRIPTION_KEY;
  const msn = env?.VIPPS_MSN;
  if (!clientId || !clientSecret || !subscriptionKey || !msn) return null;
  return {
    clientId,
    clientSecret,
    subscriptionKey,
    msn,
    apiBase: env.VIPPS_API_BASE || 'https://api.vipps.no',
    // The test environment is its own host; the checkout page shows a line while it is in use.
    test: hostOf(env.VIPPS_API_BASE) === 'apitest.vipps.no',
    // The secret the webhook registration answered with; without it the webhook endpoint takes nothing.
    webhookSecret: env.VIPPS_WEBHOOK_SECRET || '',
  };
}

/** The profile the payment asks the buyer to share in the app: what the order form asks for, so the fields can be left empty. */
export const PROFILE_SCOPE = 'name email phoneNumber';

/** The two ways to pay at Vipps: the app (Vipps or MobilePay), or a card on Vipps's own card page. */
export const VIPPS_METHODS = ['wallet', 'card'];

/**
 * The order lines for the receipt in the buyer's app, in the minor unit, with the tax fields at zero.
 * @param {Array<{id: string, qty: number, variant?: string}>} order Cleaned order
 * @param {Array<{kind?: string, entries?: Array}>} catalogs The collection files
 * @returns {Array<object>|null} null when a line has no priced product
 */
export function receiptLines(order, catalogs) {
  const items = orderLineItems(order, catalogs);
  if (!items) return null;
  return items.map((item) => ({
    name: item.name.slice(0, 2048),
    id: item.id,
    totalAmount: item.total,
    totalAmountExcludingTax: item.total,
    totalTaxAmount: 0,
    taxRate: 0,
    unitInfo: { unitPrice: item.unit, quantity: String(item.qty), quantityUnit: 'PCS' },
  }));
}

/**
 * The body for POST {apiBase}/epayment/v1/payments: a web-redirect payment in the app (WALLET) or on Vipps's card page (CARD), captured at shipping.
 * @param {object} args
 * @param {'wallet'|'card'} [args.method]
 * @param {Array<object>|null} [args.receipt] The lines from receiptLines, or null for no receipt
 */
export function buildPayment({ amountMinor, currency = 'NOK', reference, order, contact, origin, returnPath, draft = false, method = 'wallet', receipt = null }) {
  const body = {
    amount: { currency, value: amountMinor },
    paymentMethod: { type: method === 'card' ? 'CARD' : 'WALLET' },
    reference,
    userFlow: 'WEB_REDIRECT',
    // The reference travels with the return, so the page can ask the session endpoint whether this payment went through.
    returnUrl: returnUrl(origin, returnPath, reference, 'vipps', draft),
    // The description holds at most 100 characters; an order line alone is past its minimum of 3.
    paymentDescription: orderDescription(order, contact, 100),
  };
  if (method !== 'card') body.profile = { scope: PROFILE_SCOPE };
  if (receipt?.length) body.receipt = { orderLines: receipt, bottomLine: { currency } };
  return body;
}

/** The payment states of epayment/v1 in which the buyer may still be paying. */
export const OPEN_STATES = ['CREATED'];

/**
 * Reads what the checkout page needs from an epayment/v1 payment: whether the money is reserved, its state and the buyer's shared contact details.
 * @returns {{paid: boolean, open: boolean, state: string, buyer: {name: string, email: string, phone: string}}|null} null for an answer without a state
 */
export function paymentSummary(payment) {
  const raw = Array.isArray(payment?.state) ? payment.state[0] : payment?.state;
  const state = typeof raw === 'string' ? raw : '';
  if (!state) return null;
  const details = payment.userDetails && typeof payment.userDetails === 'object' ? payment.userDetails : {};
  const field = (value) => String(value ?? '').slice(0, 200).trim();
  const name = [field(details.firstName), field(details.lastName)].filter(Boolean).join(' ');
  return {
    paid: state === 'AUTHORIZED',
    open: OPEN_STATES.includes(state),
    state,
    buyer: { name, email: field(details.email), phone: field(details.mobileNumber) },
  };
}

const encoder = new TextEncoder();

/** Base64 of a byte buffer. */
function base64(bytes) {
  let binary = '';
  for (const byte of new Uint8Array(bytes)) binary += String.fromCharCode(byte);
  return btoa(binary);
}

/**
 * The signature a webhook delivery must carry: base64 of HMAC-SHA256 over the method, path, date, host and body hash, keyed with the registration's secret.
 * @param {{method?: string, pathAndQuery: string, date: string, host: string, body: string}} delivery
 * @param {string} secret
 * @returns {Promise<{contentHash: string, signature: string}>}
 */
export async function webhookSignature({ method = 'POST', pathAndQuery, date, host, body }, secret) {
  const contentHash = base64(await crypto.subtle.digest('SHA-256', encoder.encode(body)));
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const toSign = `${method}\n${pathAndQuery}\n${date};${host};${contentHash}`;
  const signature = base64(await crypto.subtle.sign('HMAC', key, encoder.encode(toSign)));
  return { contentHash, signature };
}

/** The signature in an Authorization header of the webhook form, or '' for any other header. */
export function signatureOf(authorization) {
  const match = /^HMAC-SHA256 SignedHeaders=x-ms-date;host;x-ms-content-sha256&Signature=([A-Za-z0-9+/=]+)$/.exec(String(authorization ?? ''));
  return match ? match[1] : '';
}

/** How far a delivery's date may stand from the clock, in seconds, so a captured delivery cannot be replayed later. */
export const DATE_TOLERANCE = 300;

/**
 * Whether a webhook delivery is signed by the registration's secret and recent: its body hash and signature match, and its date is within the tolerance.
 * @param {{method: string, pathAndQuery: string, host: string, headers: {get(name: string): string|null}, body: string, now?: number}} delivery now in Unix seconds
 * @param {string} secret
 * @returns {Promise<boolean>}
 */
export async function verifyWebhook({ method, pathAndQuery, host, headers, body, now = Math.floor(Date.now() / 1000) }, secret) {
  if (!secret) return false;
  const date = headers.get('x-ms-date') ?? '';
  const claimedHash = headers.get('x-ms-content-sha256') ?? '';
  const claimed = signatureOf(headers.get('authorization'));
  if (!date || !claimedHash || !claimed) return false;
  const sent = Date.parse(date) / 1000;
  if (!Number.isFinite(sent) || Math.abs(now - sent) > DATE_TOLERANCE) return false;
  const { contentHash, signature } = await webhookSignature({ method, pathAndQuery, date, host, body }, secret);
  return sameText(contentHash, claimedHash) && sameText(signature, claimed);
}
