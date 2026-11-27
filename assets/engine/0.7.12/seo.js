/**
 * The SEO tags and the site's JSON-LD in the document head, among them the description, canonical and Open Graph; applyHeadMeta writes them for visitors.
 * Notes: docs/engine-notes/seo.md (Urd repository).
 */


/** Absolute address from a page-relative path (media images, pages). */
function absolute(origin, path) {
  try {
    return new URL(path, origin.replace(/\/+$/, '') + '/').href;
  } catch {
    return null;
  }
}

/** The title formats a site can choose (site.titleFormat): the page then the site title, the site title then the page, or the page alone. */
export const TITLE_FORMATS = ['page-site', 'site-page', 'page'];

/** The stored title format, the default for anything else. */
export function titleFormatOf(raw) {
  return TITLE_FORMATS.includes(raw) ? raw : 'page-site';
}

/** The page's own part of the title: its search title, else its name, else the registry's name. */
export function pageTitleOwn(page, entry) {
  const meta = page?.meta ?? {};
  return String(meta.searchTitle || meta.title || entry?.title || '').trim();
}

/**
 * A page's document title: its own part and the site title in the site's format, an empty part left out with its hyphen.
 * @param {object} site the site.json content (migrated)
 * @param {{meta?: {title?: string, searchTitle?: string}}} page
 * @param {{title?: string}} [entry] The page's entry in the page registry
 */
export function pageTitle(site, page, entry) {
  const own = pageTitleOwn(page, entry);
  const siteTitle = String(site?.site?.title ?? '').trim();
  const format = titleFormatOf(site?.site?.titleFormat);
  if (format === 'page' || !siteTitle) return own || siteTitle;
  if (!own) return siteTitle;
  return format === 'site-page' ? `${siteTitle} - ${own}` : `${own} - ${siteTitle}`;
}

/**
 * A page's meta tags as [{tag, attrs}] in insertion order, the og fields with stepwise fallbacks; a noindex page gets robots-noindex and no canonical link.
 * @param {object} site the site.json content (migrated)
 * @param {{meta?: {title?: string, description?: string, og?: {title?: string, description?: string, image?: string}}}} page
 * @param {string} origin The page's origin (https://...)
 * @param {string} path The page's path (/, /om-oss)
 * @param {{noindex?: boolean}} [entry] The page's entry in the page registry
 * @returns {{tag: string, attrs: Record<string, string>}[]}
 */
export function pageMetaTags(site, page, origin, path, entry = {}) {
  const meta = page?.meta ?? {};
  const og = meta.og ?? {};
  const siteTitle = site?.site?.title ?? '';
  const ownTitle = pageTitleOwn(page, entry);
  const description = meta.description;
  const ogDescription = og.description ?? description ?? site?.site?.description ?? '';
  const image = og.image ?? site?.site?.icon ?? null;
  const canonical = absolute(origin, path === '/' ? '/' : path);

  const tags = [];
  if (entry?.noindex) tags.push({ tag: 'meta', attrs: { name: 'robots', content: 'noindex' } });
  if (description) tags.push({ tag: 'meta', attrs: { name: 'description', content: description } });
  if (canonical && !entry?.noindex) tags.push({ tag: 'link', attrs: { rel: 'canonical', href: canonical } });
  tags.push({ tag: 'meta', attrs: { property: 'og:type', content: 'website' } });
  tags.push({ tag: 'meta', attrs: { property: 'og:site_name', content: siteTitle } });
  tags.push({ tag: 'meta', attrs: { property: 'og:title', content: og.title || ownTitle || siteTitle } });
  if (ogDescription) tags.push({ tag: 'meta', attrs: { property: 'og:description', content: ogDescription } });
  if (canonical) tags.push({ tag: 'meta', attrs: { property: 'og:url', content: canonical } });
  const imageUrl = image ? absolute(origin, image) : null;
  if (imageUrl) tags.push({ tag: 'meta', attrs: { property: 'og:image', content: imageUrl } });
  tags.push({ tag: 'meta', attrs: { name: 'twitter:card', content: imageUrl ? 'summary_large_image' : 'summary' } });
  return tags;
}

/**
 * The site's JSON-LD Organization: its name and, among other fields where set, the description, the logo and the contact details (contact-model.js).
 * @param {object} site the site.json content (migrated)
 * @param {string} origin
 * @returns {object}
 */
export function siteJsonLd(site, origin, contact = null) {
  const base = String(origin ?? '').replace(/\/+$/, '');
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site?.site?.title ?? '',
    url: base + '/',
  };
  if (site?.site?.description) data.description = site.site.description;
  const logo = site?.site?.icon ? absolute(base, site.site.icon) : null;
  if (logo) data.logo = logo;
  return contact ? { ...data, ...contact.organizationContact(contact.siteContact(site)) } : data;
}

/**
 * Visitor measurement (`site.analytics`): appends Cloudflare Web Analytics' beacon once, when a token is set; neither the preview nor the draft view calls this.
 * @param {object} site site.json (lifted)
 */
export function mountAnalytics(site) {
  const token = site.analytics?.token;
  if (typeof token !== 'string' || !token.trim() || document.head.querySelector('script[data-cf-beacon]')) return;
  const beacon = document.createElement('script');
  beacon.defer = true;
  beacon.src = 'https://static.cloudflareinsights.com/beacon.min.js';
  beacon.dataset.cfBeacon = JSON.stringify({ token: token.trim() });
  document.head.appendChild(beacon);
}

/**
 * Writes the meta tags and the JSON-LD into <head>, marked with data-urd-seo, in place of those an earlier call wrote.
 */
export function applyHeadMeta(site, page, origin, path, entry, contact = null) {
  for (const el of document.head.querySelectorAll('[data-urd-seo]')) el.remove();
  for (const { tag, attrs } of pageMetaTags(site, page, origin, path, entry)) {
    const el = document.createElement(tag);
    for (const [key, value] of Object.entries(attrs)) el.setAttribute(key, value);
    el.setAttribute('data-urd-seo', '1');
    document.head.appendChild(el);
  }
  const jsonLd = document.createElement('script');
  jsonLd.type = 'application/ld+json';
  jsonLd.setAttribute('data-urd-seo', '1');
  jsonLd.textContent = JSON.stringify(siteJsonLd(site, origin, contact));
  document.head.appendChild(jsonLd);
}
