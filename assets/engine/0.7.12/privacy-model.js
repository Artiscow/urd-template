/**
 * The facts the privacy page is written from, read from site.json and the page files: who is responsible, what forms and checkouts send, and to whom.
 * Notes: docs/engine-notes/privacy-model.md (Urd repository).
 */
import { siteContact, contactDesign } from './contact-model.js';
import { providerOf, embedUrl } from './embed-cover.js';
import { parseLocation } from './osm.js';
import { CALENDAR_FEED_MINUTES, PREFETCH_MINUTES } from './keep-minutes.js';

/** How long a calendar block keeps a feed's events and a page fetched ahead of a press is kept in the browser (keep-minutes.js). */
export { CALENDAR_FEED_MINUTES, PREFETCH_MINUTES };

/**
 * What the site keeps in the visitor's browser (ADR-0029), each with the modules that keep it and how long (`until`); the privacy page names each that applies.
 */
export const BROWSER_KEEPS = [
  { id: 'pages', modules: ['prefetch.js'], until: 'minutes', minutes: PREFETCH_MINUTES },
  { id: 'theme', modules: ['theme.js', 'theme-init.js'], until: 'changed' },
  { id: 'announcement', modules: ['nav.js'], until: 'renewed' },
  { id: 'cart', modules: ['shop.js'], until: 'ordered' },
  { id: 'order', modules: ['shop.js'], until: 'tab' },
  { id: 'payment', modules: ['blocks/checkout.js'], until: 'paid' },
  { id: 'calendar', modules: ['blocks/calendar-load.js'], until: 'minutes', minutes: CALENDAR_FEED_MINUTES },
  { id: 'calendarHeight', modules: ['blocks/calendar.js'], until: 'tab' },
  { id: 'embeds', modules: ['embed-cover.js'], until: 'taken' },
];

/** The periods a kind may be kept for, each with its words in the site dictionaries. */
export const BROWSER_UNTIL = ['tab', 'changed', 'taken', 'renewed', 'ordered', 'emptied', 'paid', 'minutes'];

/**
 * Where each company the privacy page names says how long it keeps what it gets: the most precise section of its published terms, read on `checked`.
 */
export const KEEP_TERMS = {
  youtube: { company: 'Google', url: 'https://policies.google.com/technologies/retention', section: 'How Google retains data we collect', checked: '2026-11-06' },
  vimeo: { company: 'Vimeo', url: 'https://vimeo.com/legal/privacy/policy', section: 'Privacy Policy, 7. Data Retention', checked: '2026-11-06' },
  openstreetmap: { company: 'OpenStreetMap', url: 'https://osmfoundation.org/wiki/Privacy_Policy#Personal_data_we_receive_automatically', section: 'Privacy Policy, personal data we receive automatically', checked: '2026-11-06' },
  cloudflare: { company: 'Cloudflare', url: 'https://www.cloudflare.com/privacypolicy/#11-data-retention', section: 'Privacy Policy, 11. Data retention', checked: '2026-11-06' },
  vipps: { company: 'Vipps MobilePay', url: 'https://vipps.no/personvern/', section: 'Personvernerklæring, 2.7 Lagringstid', checked: '2026-11-06' },
  stripe: { company: 'Stripe', url: 'https://stripe.com/privacy#5-security-and-retention', section: 'Privacy Policy, 5. Security and retention', checked: '2026-11-06' },
  paypal: { company: 'PayPal', url: 'https://www.paypal.com/legalhub/privacy-full', section: 'Privacy Statement, How long does PayPal store your Personal Data?', checked: '2026-11-06' },
};

/**
 * Where the «how long» of each kind the privacy page tells comes from: `owner` (RETENTION_KINDS), `code` (BROWSER_KEEPS) or `terms` (KEEP_TERMS).
 */
export const KEEP_SOURCES = {
  owner: ['forms', 'newsletter', 'orders'],
  code: ['pages', 'theme', 'announcement', 'cart', 'order', 'payment', 'calendar', 'calendarHeight', 'embeds'],
  terms: ['youtube', 'vimeo', 'openstreetmap', 'cloudflare', 'vipps', 'stripe', 'paypal'],
};

/** The hosts the counting of visits reaches (Cloudflare Web Analytics): its script and its beacon. */
export const ANALYTICS_HOSTS = ['static.cloudflareinsights.com', 'cloudflareinsights.com'];

/**
 * Whether one of a page's scripts is Cloudflare Web Analytics' beacon, added by Urd or by Cloudflare itself; each address is parsed, its host compared exactly.
 * @param {Iterable<string>} srcs The scripts' addresses
 * @returns {boolean}
 */
export function cloudflareBeacon(srcs) {
  for (const src of srcs ?? []) {
    try {
      const url = new URL(String(src));
      if (url.protocol === 'https:' && url.host === ANALYTICS_HOSTS[0] && url.pathname.startsWith('/beacon')) return true;
    } catch { /* not an address */ }
  }
  return false;
}

/**
 * What the privacy page names an outside host by (ADR-0029): the counting of visits, a frame's provider, or null for a host the page does not name.
 * @param {string} host
 * @returns {string|null}
 */
export function privacyNameOfHost(host) {
  const name = String(host ?? '').toLowerCase();
  if (ANALYTICS_HOSTS.includes(name)) return 'analytics';
  return providerOf(`https://${name}/`)?.id ?? null;
}

/** The payment providers a checkout can hold, in the order the page names them. */
export const PAYMENT_PROVIDERS = ['vipps', 'stripe', 'paypal', 'manual'];

/** The providers a checkout's `payments` names: Vipps MobilePay, Stripe or PayPal, also behind the card button, and the manual ways (invoice, transfer). */
export function paymentProviders(payments) {
  const pay = payments ?? {};
  const on = {
    vipps: pay.vipps === true || pay.card === 'vipps',
    stripe: pay.card === 'stripe',
    paypal: pay.paypal === true,
    manual: Array.isArray(pay.manual) && pay.manual.length > 0,
  };
  return PAYMENT_PROVIDERS.filter((id) => on[id]);
}

/**
 * The host of an address a form or the checkout sends to, or '' for an address that is not one.
 * @param {string} url
 */
export function endpointHost(url) {
  try {
    const u = new URL(String(url ?? ''));
    return u.protocol === 'https:' || u.protocol === 'http:' ? u.hostname : '';
  } catch {
    return '';
  }
}

/** The texts of a form's fields, as the page names what the form sends. */
function fieldNames(fields) {
  return (Array.isArray(fields) ? fields : [])
    .map((f) => String(f?.label ?? f?.name ?? '').trim())
    .filter(Boolean);
}

/** A point written into a map block's props by the address search. */
const validPoint = (p) => Number.isFinite(p.lat) && Number.isFinite(p.lon);

/**
 * The footer's newsletter sign-up, where the footer has one: an email address sent to a service or by email, on every page.
 * @param {object} site
 * @returns {object|null} A form like a page's, placed in the footer
 */
export function footerForm(site) {
  const cta = site?.footer?.cta;
  if (cta?.kind !== 'newsletter') return null;
  const host = endpointHost(cta.endpoint);
  return { page: '', path: '', footer: true, fields: [], mode: host ? 'endpoint' : 'mailto', recipient: host ? '' : String(cta.recipient ?? '').trim(), host };
}

/** A page's name, as the forms on it are placed by it. */
function pageTitle(entry, page) {
  return String(page?.meta?.title ?? entry?.title ?? entry?.id ?? '').trim();
}

/**
 * The facts of one page: its forms, its checkout and the third parties' frames it holds.
 * @param {{id?: string, title?: string, path?: string}} entry The page registry's entry
 * @param {{meta?: object, sections?: object[]}} page The page file
 * @param {{siteGeo?: boolean}} [options] siteGeo: the site's contact details hold a point on the map, which the contact block's map design needs to draw one
 */
export function pageFacts(entry, page, { siteGeo = false } = {}) {
  const title = pageTitle(entry, page);
  const path = String(entry?.path ?? '');
  const forms = [];
  let checkout = null;
  let shop = false;
  let calendar = false;
  const embeds = new Set();
  const atOnce = new Set();
  const frame = (id, props) => {
    embeds.add(id);
    if (props.askFirst === false) atOnce.add(id);
  };
  for (const section of page?.sections ?? []) {
    for (const block of section.blocks ?? []) {
      const p = block.props ?? {};
      if (block.type === 'form') {
        const byEndpoint = p.mode === 'endpoint' && endpointHost(p.endpoint);
        forms.push({ page: title, path, fields: fieldNames(p.fields), mode: byEndpoint ? 'endpoint' : 'mailto', recipient: byEndpoint ? '' : String(p.recipient ?? '').trim(), host: byEndpoint || '' });
      } else if (block.type === 'product' || block.type === 'cart') {
        shop = true;
      } else if (block.type === 'calendar') {
        calendar = true;
      } else if (block.type === 'checkout' && !checkout) {
        shop = true;
        checkout = { page: title, path, providers: paymentProviders(p.payments), recipient: String(p.recipient ?? '').trim(), host: endpointHost(p.endpoint) };
      } else if (block.type === 'video' && p.source !== 'file') {
        const provider = providerOf(embedUrl(p.url) || '');
        if (provider) frame(provider.id, p);
      } else if (block.type === 'map' && (validPoint(p) || parseLocation(p.location))) {
        // A map draws its frame only where its place is a point (blocks/map.js); the contact block's map design only with the site's point.
        frame('openstreetmap', p);
      } else if (block.type === 'contact' && contactDesign(p.design).geo && siteGeo) {
        frame('openstreetmap', p);
      }
    }
  }
  return { forms, checkout, shop, calendar, embeds: [...embeds], atOnce: [...atOnce] };
}

/**
 * The kinds whose period the owner sets in the Legal panel (`site.retention`, ADR-0029), each with the choices it takes beside a set period.
 */
export const RETENTION_KINDS = { forms: ['period', 'closed'], newsletter: ['unsubscribe', 'period'], orders: ['bookkeeping', 'nif', 'period'] };

/** The countries whose bookkeeping duties the orders' choices name; elsewhere an order is kept for the owner's own period or is not decided. */
export const ORDER_LAW_COUNTRIES = ['NO'];

/**
 * The choices the Legal panel offers for orders in a country: the duties where they are researched, a period of the owner's own everywhere.
 * @param {string} country The association's country code (contact-model.js)
 * @returns {string[]}
 */
export function orderKeepChoices(country) {
  return ORDER_LAW_COUNTRIES.includes(country) ? RETENTION_KINDS.orders : ['period'];
}

/** The units a set period is counted in, and its bounds. */
export const RETENTION_UNITS = ['months', 'years'];
export const RETENTION_MAX = 99;

/**
 * A kind's period as stored, read safely: a set period, `closed`, `unsubscribe`, `bookkeeping` or `nif`; null for not decided or any other value.
 * @param {object} site site.json
 * @param {'forms'|'newsletter'|'orders'} kind
 * @returns {{until: string, count?: number, unit?: string}|null}
 */
export function retentionOf(site, kind) {
  const value = site?.site?.retention?.[kind];
  const choices = RETENTION_KINDS[kind];
  if (!choices || !value || !choices.includes(value.until)) return null;
  if (value.until !== 'period') return { until: value.until };
  const count = Number(value.count);
  if (!Number.isInteger(count) || count < 1 || count > RETENTION_MAX || !RETENTION_UNITS.includes(value.unit)) return null;
  return { until: 'period', count, unit: value.unit };
}

/**
 * The facts of the whole site.
 * @param {object} site site.json
 * @param {Array<{entry: object, page: object}>} pages Every page in the registry with its file; one that could not be read is left out
 * @returns {{controller: object, forms: object[], checkout: object|null, analytics: boolean, embeds: string[], atOnce: string[], host: 'cloudflare', retention: {forms: object|null, newsletter: object|null, orders: object|null}, browser: {theme: boolean, shop: boolean, calendar: boolean, announcement: boolean}}}
 *   The facts by part: retention (retentionOf), embeds and atOnce (the frames' providers), browser (BROWSER_KEEPS) and forms, the footer's sign-up first
 */
export function privacyModel(site, pages) {
  const contact = siteContact(site);
  const controller = {
    name: contact.legalName || String(site?.site?.title ?? '').trim(),
    org: contact.ids?.org ?? '',
    address: [contact.street, [contact.postalCode, contact.city].filter(Boolean).join(' ')].filter(Boolean).join(', '),
    email: contact.email,
    phone: contact.phone,
    representative: contact.representative,
    country: contact.country,
  };
  const forms = [];
  const newsletter = footerForm(site);
  if (newsletter) forms.push(newsletter);
  let checkout = null;
  const embeds = new Set();
  const atOnce = new Set();
  let shop = false;
  let calendar = false;
  const siteGeo = Boolean(contact.geo);
  for (const { entry, page } of pages ?? []) {
    const facts = pageFacts(entry, page, { siteGeo });
    forms.push(...facts.forms);
    if (facts.checkout && !checkout) checkout = facts.checkout;
    if (facts.shop) shop = true;
    if (facts.calendar) calendar = true;
    for (const id of facts.embeds) embeds.add(id);
    for (const id of facts.atOnce) atOnce.add(id);
  }
  return {
    controller,
    forms,
    checkout,
    analytics: Boolean(String(site?.analytics?.token ?? '').trim()),
    embeds: [...embeds],
    atOnce: [...atOnce],
    host: 'cloudflare',
    retention: { forms: retentionOf(site, 'forms'), newsletter: retentionOf(site, 'newsletter'), orders: retentionOf(site, 'orders') },
    browser: { theme: Boolean(site?.theme?.alt?.tokens), shop, calendar, announcement: site?.nav?.announcement?.show === true && Boolean(String(site.nav.announcement.text ?? '').trim()) },
  };
}
