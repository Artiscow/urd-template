/**
 * The provider-neutral part of the payment layer (ADR-0020, ADR-0028): the order's checks, its total from the catalogue, the reference and the currency.
 */
import { isJsonRequest } from './auth.js';

/** Entry ids follow the same regime as the collections (anchored, the CodeQL lesson). */
const ID_RE = /^[a-z0-9][a-z0-9-]*$/;

/**
 * The client's order payload cleaned to its shape, or null: lines with a valid id and 1 to 99 of it, short contact fields, and a price kept only to compare.
 * @returns {{order: Array<{id: string, qty: number, variant?: string, price?: number}>, returnPath: string, draft: boolean, method: 'wallet'|'card', contact: {name: string, email: string, phone: string, comment: string}}|null}
 */
export function validOrderPayload(payload) {
  if (!payload || typeof payload !== 'object') return null;
  const rawOrder = Array.isArray(payload.order) ? payload.order : [];
  if (!rawOrder.length || rawOrder.length > 50) return null;
  const order = [];
  for (const line of rawOrder) {
    if (!line || typeof line !== 'object') return null;
    const id = String(line.id ?? '');
    if (!ID_RE.test(id) || id.length > 80) return null;
    const qty = Math.trunc(Number(line.qty));
    if (!Number.isFinite(qty) || qty < 1 || qty > 99) return null;
    const clean = { id, qty };
    if (line.variant != null) {
      // The variant is a size and a colour of the product; a text past any such label is no basket line.
      const variant = String(line.variant);
      if (variant.length > 200) return null;
      if (variant) clean.variant = variant;
    }
    if (line.price != null) {
      const price = Number(line.price);
      if (!Number.isFinite(price) || price < 0 || price > 1e9) return null;
      clean.price = price;
    }
    order.push(clean);
  }
  const field = (value) => String(value ?? '').slice(0, 200).trim();
  // Return path: an internal path on our own site (anchored; never a full URL from the client).
  const rawPath = String(payload.returnPath ?? '/');
  const returnPath = /^\/[a-z0-9\-/]*$/.test(rawPath) && rawPath.length <= 200 ? rawPath : '/';
  return {
    order,
    returnPath,
    // An order from the draft view (?draft=1) returns to it, so the return is read with the settings the payment started from.
    draft: payload.draft === true,
    // Vipps takes a payment in the app (wallet) or on its card page (card); the other providers have one way.
    method: payload.method === 'card' ? 'card' : 'wallet',
    contact: {
      name: field(payload.contact?.name),
      email: field(payload.contact?.email),
      phone: field(payload.contact?.phone),
      comment: field(payload.contact?.comment),
    },
  };
}

/** The products by id across the catalogues of kind products; the first catalogue that names an id wins. */
export function productMap(catalogs) {
  const products = new Map();
  for (const catalog of catalogs) {
    if (catalog?.kind !== 'products') continue;
    for (const entry of catalog.entries ?? []) {
      if (entry?.id && !products.has(entry.id)) products.set(entry.id, entry);
    }
  }
  return products;
}

/** The currencies the providers count in whole units (ISO 4217 exponent 0 at Stripe). */
const ZERO_DECIMAL = new Set(['BIF', 'CLP', 'DJF', 'GNF', 'JPY', 'KMF', 'KRW', 'MGA', 'PYG', 'RWF', 'UGX', 'VND', 'VUV', 'XAF', 'XOF', 'XPF']);

/** The currencies Stripe counts in thousandths (ISO 4217 exponent 3); Vipps and PayPal take none of them. */
export const THREE_DECIMAL = new Set(['BHD', 'JOD', 'KWD', 'OMR', 'TND']);

/** How many decimals a currency's minor unit has: 0 for the zero-decimal currencies, 3 for the three-decimal ones, else 2. */
export function currencyExponent(code) {
  const upper = String(code ?? '').toUpperCase();
  return ZERO_DECIMAL.has(upper) ? 0 : THREE_DECIMAL.has(upper) ? 3 : 2;
}

/** A product's price in the currency's minor unit (øre, cents; yen for JPY), or null when it has none. */
export function priceMinor(entry, currency = 'NOK') {
  const price = Number(entry?.price);
  return Number.isFinite(price) && price >= 0 ? Math.round(price * 10 ** currencyExponent(currency)) : null;
}

/**
 * The order total in the minor unit from the catalogues, or null for an unknown id or a product without a price; a member price is never charged (ADR-0020).
 * @param {Array<{id: string, qty: number}>} order Cleaned order (validOrderPayload)
 * @param {Array<{kind?: string, entries?: Array}>} catalogs The collection files
 * @param {string} [currency] The ISO code, for its minor unit
 * @returns {number|null}
 */
export function orderAmountMinor(order, catalogs, currency = 'NOK') {
  const products = productMap(catalogs);
  let sum = 0;
  for (const line of order) {
    const price = priceMinor(products.get(line.id), currency);
    if (price == null) return null;
    sum += price * line.qty;
  }
  return sum;
}

/**
 * Whether every line's variant is a label the basket makes for its product, compared whole, and names the size and colour the product requires.
 * @param {Array<{id: string, qty: number, variant?: string}>} order Cleaned order (validOrderPayload)
 * @param {Array<{kind?: string, entries?: Array}>} catalogs The collection files
 * @returns {boolean}
 */
export function validVariants(order, catalogs) {
  return variantProblems(order, catalogs).length === 0;
}

/**
 * The order lines whose variant does not fit their product now (validVariants), each by its product and variant; a product without sizes or colours takes none.
 * @param {Array<{id: string, qty: number, variant?: string}>} order Cleaned order (validOrderPayload)
 * @param {Array<{kind?: string, entries?: Array}>} catalogs The collection files
 * @returns {Array<{id: string, variant?: string}>}
 */
export function variantProblems(order, catalogs) {
  const products = productMap(catalogs);
  const problems = [];
  const refuse = (line) => problems.push({ id: line.id, ...(line.variant ? { variant: line.variant } : {}) });
  for (const line of order) {
    const entry = products.get(line.id);
    if (!entry) {
      refuse(line);
      continue;
    }
    const sizes = (Array.isArray(entry.sizes) ? entry.sizes : []).filter(Boolean).map(String);
    const colors = (Array.isArray(entry.colors) ? entry.colors : []).map((c) => String(c?.name ?? '')).filter(Boolean);
    let size = false;
    let color = false;
    if (line.variant) {
      if (sizes.some((s) => colors.some((c) => `${s} · ${c}` === line.variant))) size = color = true;
      else if (sizes.includes(line.variant)) size = true;
      else if (colors.includes(line.variant)) color = true;
      else {
        refuse(line);
        continue;
      }
    }
    if ((entry.requireSize === true && sizes.length && !size) || (entry.requireColor === true && colors.length && !color)) refuse(line);
  }
  return problems;
}

/**
 * The lines whose basket price is not the catalogue's now, compared in the minor unit, each with the catalogue's price; empty when all agree or carry none.
 * @param {Array<{id: string, variant?: string, price?: number}>} order Cleaned order (validOrderPayload)
 * @param {Array<{kind?: string, entries?: Array}>} catalogs The collection files
 * @param {string} [currency]
 * @returns {Array<{id: string, variant?: string, price: number}>}
 */
export function priceChanges(order, catalogs, currency = 'NOK') {
  const products = productMap(catalogs);
  const factor = 10 ** currencyExponent(currency);
  const changed = [];
  for (const line of order) {
    if (line.price == null) continue;
    const entry = products.get(line.id);
    const now = priceMinor(entry, currency);
    if (now == null || now === Math.round(line.price * factor)) continue;
    changed.push({ id: line.id, ...(line.variant ? { variant: line.variant } : {}), price: Number(entry.price) });
  }
  return changed;
}

/** A product's quantity limits, as shop.js quantityLimits reads them: each from 1 to 99, the most never under the least; null without them. */
export function quantityLimits(entry) {
  const q = entry?.quantity;
  if (!q || typeof q !== 'object' || Array.isArray(q)) return null;
  const limit = (value, fallback) => {
    if (value == null || value === '') return fallback;
    const n = Number(value);
    return Number.isInteger(n) && n >= 1 && n <= 99 ? n : fallback;
  };
  const min = limit(q.min, 1);
  return { min, max: Math.max(min, limit(q.max, 99)) };
}

/**
 * The lines whose quantity lies outside their product's limits now, each with those limits.
 * A line is a product and its variant, repeats added together first.
 * @param {Array<{id: string, qty: number, variant?: string}>} order Cleaned order (validOrderPayload)
 * @param {Array<{kind?: string, entries?: Array}>} catalogs The collection files
 * @returns {Array<{id: string, variant?: string, min: number, max: number}>}
 */
export function quantityProblems(order, catalogs) {
  const products = productMap(catalogs);
  const lines = new Map();
  for (const line of order) {
    const key = `${line.id}\u0000${line.variant ?? ''}`;
    const held = lines.get(key);
    if (held) held.qty += line.qty;
    else lines.set(key, { id: line.id, variant: line.variant, qty: line.qty });
  }
  const problems = [];
  for (const line of lines.values()) {
    const limits = quantityLimits(products.get(line.id));
    if (limits && (line.qty < limits.min || line.qty > limits.max)) {
      problems.push({ id: line.id, ...(line.variant ? { variant: line.variant } : {}), ...limits });
    }
  }
  return problems;
}

/** Whether every basket line's quantity is within its product's limits (quantityProblems). */
export function validQuantities(order, catalogs) {
  return quantityProblems(order, catalogs).length === 0;
}

/**
 * The order lines with the product's title, the variant and the prices in the minor unit, for a provider's receipt or line items.
 * @returns {Array<{id: string, name: string, qty: number, unit: number, total: number}>|null} null when a line has no priced product
 */
export function orderLineItems(order, catalogs, currency = 'NOK') {
  const products = productMap(catalogs);
  const lines = [];
  for (const line of order) {
    const entry = products.get(line.id);
    const unit = priceMinor(entry, currency);
    if (unit == null) return null;
    const title = String(entry.title ?? line.id).trim() || line.id;
    lines.push({ id: line.id, name: line.variant ? `${title} (${line.variant})` : title, qty: line.qty, unit, total: unit * line.qty });
  }
  return lines;
}

/** The order in one line for a payment's description, read in the provider's portal: the lines and the typed contact fields. */
export function orderDescription(order, contact, max = 100) {
  const lines = order
    .map((line) => `${line.qty} x ${line.id}${line.variant ? ` (${line.variant})` : ''}`)
    .join(', ');
  const who = [contact?.name, contact?.email, contact?.phone].filter(Boolean).join(' / ');
  return `${lines}${who ? ` - ${who}` : ''}`.slice(0, max);
}

/** Payment reference in the form every provider takes ([a-zA-Z0-9-], 8 to 64 characters), unique per site. */
export function makeReference() {
  const bytes = crypto.getRandomValues(new Uint8Array(12));
  const hex = [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('');
  return `urd-${hex}`;
}

/** Whether a value is a reference makeReference made (anchored, the CodeQL lesson). */
export function isReference(value) {
  return typeof value === 'string' && /^urd-[0-9a-f]{24}$/.test(value);
}

/** The currency the layer charges in, from `site.commerce.currency` (ISO 4217), else NOK. */
export function orderCurrency(site) {
  const code = String(site?.commerce?.currency ?? '').toUpperCase();
  return /^[A-Z]{3}$/.test(code) ? code : 'NOK';
}

/** Whether the seller is registered for VAT (site.contact.vat.registered); a receipt without tax lines is sent only when not. */
export function vatRegistered(site) {
  return site?.contact?.vat?.registered === true;
}

/** The providers the layer knows, as the `via` of a return address and the folder of the endpoints. */
export const PROVIDERS = ['vipps', 'stripe', 'paypal'];

/** The return address of the checkout page with the payment's reference and the provider that answers for it, in the draft view when the order came from it. */
export function returnUrl(origin, returnPath, reference, provider, draft = false) {
  return `${origin}${returnPath ?? '/'}?${draft ? 'draft=1&' : ''}ordered=${reference}&via=${provider}`;
}

/** The checkout page a cancelled payment goes back to, the draft view when the order came from it. */
export function cancelUrl(origin, returnPath, draft = false) {
  return `${origin}${returnPath ?? '/'}${draft ? '?draft=1' : ''}`;
}

/** A JSON file from our own deploy, or null. */
export async function ownJson(origin, path) {
  try {
    const res = await fetch(`${origin}${path}`);
    return res.ok ? await res.json() : null;
  } catch {
    return null;
  }
}

/**
 * Reads the site file and the product catalogues from our own deploy: the settings under `site`, the page register under `pages`, and the prices.
 * @returns {Promise<{site: object|null, pages: Array<{id: string, path: string}>, catalogs: Array<object>}|null>} null when the catalogue index cannot be read
 */
export async function readShop(origin) {
  const index = await ownJson(origin, '/content/samlinger.json');
  if (!index) return null;
  const [file, ...catalogs] = await Promise.all([
    ownJson(origin, '/content/site.json'),
    ...(index.samlinger ?? []).slice(0, 50).map((id) => ownJson(origin, `/content/samlinger/${encodeURIComponent(id)}.json`)),
  ]);
  return { site: file?.site ?? null, pages: Array.isArray(file?.pages) ? file.pages : [], catalogs: catalogs.filter(Boolean) };
}

/**
 * Whether a checkout block's payments offer a provider: Vipps in the app (`vipps`) or by card (`card: 'vipps'`), Stripe by card, PayPal by its button.
 * @param {object} pays The block's `payments`
 * @param {'vipps'|'stripe'|'paypal'} provider
 * @param {'wallet'|'card'} [method] Vipps's way
 */
function offersPayment(pays, provider, method = 'wallet') {
  if (provider === 'stripe') return pays?.card === 'stripe';
  if (provider === 'paypal') return pays?.paypal === true;
  if (provider === 'vipps') return method === 'card' ? pays?.card === 'vipps' : pays?.vipps === true;
  return false;
}

/**
 * The payments of the first checkout block that offers the way to pay, on the published page at the return path (ADR-0028); null where there is none.
 * @param {string} origin
 * @param {Array<{id: string, path: string}>} pages The page register (the site file's `pages`)
 * @param {string} returnPath The validated return path
 * @param {'vipps'|'stripe'|'paypal'} provider
 * @param {'wallet'|'card'} [method]
 * @returns {Promise<object|null>} The block's `payments`, as stored
 */
export async function pageCheckout(origin, pages, returnPath, provider, method = 'wallet') {
  const wanted = returnPath.length > 1 ? returnPath.replace(/\/+$/, '') : '/';
  const page = (Array.isArray(pages) ? pages : []).find((p) => typeof p?.path === 'string' && (p.path.length > 1 ? p.path.replace(/\/+$/, '') : '/') === wanted);
  if (!page?.id || !/^[a-z0-9][a-z0-9-]*$/.test(page.id)) return null;
  const file = await ownJson(origin, `/content/pages/${page.id}.json`);
  const blocks = [];
  for (const section of file?.sections ?? []) for (const block of section?.blocks ?? []) if (block?.type === 'checkout' && block.props?.payments && typeof block.props.payments === 'object') blocks.push(block.props.payments);
  return blocks.find((pays) => offersPayment(pays, provider, method)) ?? null;
}

const encoder = new TextEncoder();

/**
 * The key that lets the page that started a payment read the buyer's details: an HMAC of the reference with the provider's secret, made again, never stored.
 * @param {string} secret The provider's secret key
 * @param {string} reference
 * @returns {Promise<string>} 32 hex characters
 */
export async function buyerKey(secret, reference) {
  const key = await crypto.subtle.importKey('raw', encoder.encode(String(secret)), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const mac = new Uint8Array(await crypto.subtle.sign('HMAC', key, encoder.encode(`urd-buyer:${reference}`)));
  return [...mac.slice(0, 16)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Whether a session ask carries the buyer key of its reference (the `x-urd-key` header), compared in constant time.
 * @param {Request} request
 * @param {string} secret
 * @param {string} reference
 */
export async function hasBuyerKey(request, secret, reference) {
  const given = String(request.headers.get('x-urd-key') ?? '');
  const want = await buyerKey(secret, reference);
  if (given.length !== want.length) return false;
  let diff = 0;
  for (let i = 0; i < want.length; i += 1) diff |= given.charCodeAt(i) ^ want.charCodeAt(i);
  return diff === 0;
}

/**
 * An amount in the currency's minor unit as the currency writes it (350 øre as 3.5), or null where it is not a number.
 * @param {unknown} minor
 * @param {string} currency
 */
export function majorAmount(minor, currency) {
  const n = Number(minor);
  return minor != null && Number.isFinite(n) ? n / 10 ** currencyExponent(currency) : null;
}

/**
 * A session endpoint's answer: paid, open and state for anyone with the reference; the buyer's details and the confirmed amount only with the buyer key.
 * @param {{paid: boolean, open: boolean, state: string, buyer?: object, amount?: number|null}} summary
 * @param {boolean} keyed
 */
export function sessionAnswer(summary, keyed) {
  return {
    paid: summary.paid,
    open: summary.open,
    state: summary.state,
    ...(keyed ? { buyer: summary.buyer ?? {}, ...(Number.isFinite(summary.amount) ? { amount: summary.amount } : {}) } : {}),
  };
}

/** The JSON answer the endpoints give, never cached. */
export const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });

/**
 * The checks each checkout endpoint runs before it calls a provider: the payload, the shop files, the total, variants, quantities, prices and the checkout block.
 * @param {Request} request
 * @param {'vipps'|'stripe'|'paypal'} provider
 * @returns {Promise<{clean: object, payload: object, origin: string, site: object|null, catalogs: Array<object>, amountMinor: number, currency: string, settings: object}|{error: Response}>}
 */
export async function prepareOrder(request, provider) {
  // An order is sent as JSON by the checkout block; a form posted from another site cannot send that type, so it creates no payment.
  if (!isJsonRequest(request)) return { error: json({ error: 'The order must be sent as JSON', code: 'orderInvalid' }, 415) };
  let payload = null;
  try {
    payload = await request.json();
  } catch {
    return { error: json({ error: 'Invalid request body', code: 'orderInvalid' }, 400) };
  }
  const clean = validOrderPayload(payload);
  if (!clean) return { error: json({ error: 'Invalid order', code: 'orderInvalid' }, 400) };
  const origin = new URL(request.url).origin;
  const shop = await readShop(origin);
  if (!shop) return { error: json({ error: 'Could not read the catalogue', code: 'catalogUnreachable' }, 502) };
  const currency = orderCurrency(shop.site);
  const amountMinor = orderAmountMinor(clean.order, shop.catalogs, currency);
  if (amountMinor == null || amountMinor <= 0) {
    return { error: json({ error: 'Unknown product in the order', code: 'orderInvalid' }, 400) };
  }
  // Lines whose variant is not a choice the product has now, or lacks a size or colour it requires, go back to the basket.
  const choices = variantProblems(clean.order, shop.catalogs);
  if (choices.length) {
    return { error: json({ error: 'A product in the order needs its size or colour chosen again', code: 'orderChoice', lines: choices }, 400) };
  }
  // Lines whose quantity lies outside the product's limits go back with the limits that hold.
  const problems = quantityProblems(clean.order, shop.catalogs);
  if (problems.length) {
    return { error: json({ error: 'A quantity outside the product\'s limits', code: 'orderQuantity', lines: problems }, 400) };
  }
  // Lines whose price changed since they went into the basket go back with the prices that hold, before the buyer pays.
  const changed = priceChanges(clean.order, shop.catalogs, currency);
  if (changed.length) {
    return { error: json({ error: 'A price changed since the basket was filled', code: 'orderPrices', lines: changed }, 409) };
  }
  // The way to pay must be one the page's own checkout block offers, as published.
  const settings = await pageCheckout(origin, shop.pages, clean.returnPath, provider, clean.method);
  if (!settings) {
    return { error: json({ error: 'The published checkout page does not offer this way to pay', code: 'payNotOffered' }, 400) };
  }
  return { clean, payload, origin, site: shop.site, catalogs: shop.catalogs, amountMinor, currency, settings };
}
