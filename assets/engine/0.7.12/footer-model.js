/**
 * Builds the footer's parts from the site file and the page registry, among them the brand, columns, social links and baseline; footer.js builds the DOM.
 * Notes: docs/engine-notes/footer-model.md (Urd repository).
 */

import { resolveItem, isSafeUrl } from './nav-model.js';
import { siteLinks } from './links-model.js';

// The safe-URL guard lives in nav-model (shared with resolveItem); re-exported here for the tests that import it from here.
export { isSafeUrl };

// Text or an empty string, so a number or boolean hand-edited into site.json never makes .trim() or .split() throw.
const str = (v) => (typeof v === 'string' ? v : '');

/**
 * The brand column from footer.brand, with no fallback to the site title, so a footer just switched on stays empty; null when there is nothing to show.
 * @param {object} site
 * @returns {{title: string, tagline: string}|null}
 */
export function footerBrand(site) {
  const brand = site.footer?.brand ?? {};
  const title = str(brand.title).trim();
  const tagline = str(brand.tagline).trim();
  // The brand can be text, an uploaded logo (image) or both (mirroring the nav logo). mode controls what is shown.
  const logo = str(brand.logo).trim();
  const mode = brand.mode === 'image' || brand.mode === 'both' ? brand.mode : 'text';
  const hasLogo = logo && mode !== 'text';
  if (!title && !tagline && !hasLogo) return null;
  return { title, tagline, logo, mode, logoHeight: brand.logoHeight };
}

/**
 * The columns with resolved links: links without a label are skipped, and a column with no labelled links is left out.
 * @param {object} site
 * @returns {Array<{title: string, links: Array<{label: string, href: string, external: boolean, missing: boolean}>}>}
 */
export function footerColumns(site) {
  const pages = site.pages ?? [];
  const columns = Array.isArray(site.footer?.columns) ? site.footer.columns : [];
  return columns
    .map((col) => {
      const links = (Array.isArray(col.links) ? col.links : [])
        .filter((l) => str(l.label).trim())
        .map((l) => resolveItem(l, pages));
      return {
        title: str(col.title).trim(),
        links,
        // Long column (many links, or an explicit col.wide): rendered across two tracks and split into two sub-columns, so the footer stays symmetric.
        wide: col.wide === true || links.length > 6,
      };
    })
    .filter((col) => col.links.length);
}

/**
 * The baseline's optional right-hand links (privacy/terms/«Made with Urd»), resolved like the column links.
 * @param {object} site
 * @returns {Array<{label: string, href: string, external: boolean, missing: boolean}>}
 */
export function footerBaselineLinks(site) {
  const pages = site.pages ?? [];
  const links = Array.isArray(site.footer?.baseline) ? site.footer.baseline : [];
  return links.filter((l) => str(l.label).trim()).map((l) => resolveItem(l, pages));
}

/**
 * The link to the privacy page chosen in `footer.privacyPage`, with the page's title; null when no page is chosen or the chosen page is gone or hidden.
 * @param {object} site
 * @returns {{label: string, href: string}|null}
 */
export function footerPrivacyLink(site) {
  return sitePageLink(site, site?.footer?.privacyPage);
}

/**
 * A link to one of the site's own pages by its id, named by the page's title: null for no id, a page that is gone or one that is hidden.
 * @param {object} site
 * @param {string} id
 * @returns {{label: string, href: string}|null}
 */
export function sitePageLink(site, id) {
  const pageId = str(id).trim();
  if (!pageId) return null;
  const pages = site?.pages ?? [];
  const page = pages.find((p) => p?.id === pageId);
  if (!page || page.hidden === true) return null;
  // The page link as every footer link resolves it, so a path edited by hand can never lead off the site.
  const link = resolveItem({ label: str(page.title).trim() || pageId, page: pageId }, pages);
  return link.missing || !link.href ? null : { label: link.label, href: link.href };
}

/**
 * The doormat link row: one centered row of links (the Centered and Big CTA templates).
 * @param {object} site
 * @returns {Array<{label: string, href: string, external: boolean, missing: boolean}>}
 */
export function footerLinkRow(site) {
  const pages = site.pages ?? [];
  const row = Array.isArray(site.footer?.linkRow) ? site.footer.linkRow : [];
  return row.filter((l) => str(l.label).trim()).map((l) => resolveItem(l, pages));
}

/**
 * The call to action, normalized, or null: a button needs its button text, a newsletter a heading or button text; `big` is the large centred variant.
 * @param {object} site
 * @returns {{kind: string, heading: string, sub: string, label: string, big: boolean, target: object|null, endpoint: string, recipient: string, success: string}|null}
 */
export function footerCta(site) {
  const cta = site.footer?.cta;
  if (!cta || typeof cta !== 'object') return null;
  const heading = str(cta.heading).trim();
  const rawLabel = str(cta.label).trim();
  const kind = cta.kind === 'newsletter' ? 'newsletter' : 'button';
  if (kind === 'button' && !rawLabel) return null;
  if (kind === 'newsletter' && !heading && !rawLabel) return null;
  const pages = site.pages ?? [];
  return {
    kind,
    heading,
    sub: str(cta.sub).trim(),
    // An empty label/success is filled in by the render layer with the visitor language's default text (footer.js + t()); the model is language-free (ADR-0012).
    label: rawLabel,
    big: cta.big === true,
    target: kind === 'button' ? resolveItem({ label: rawLabel, page: cta.page, target: cta.target, href: cta.href, newTab: cta.newTab, rel: cta.rel, download: cta.download }, pages) : null,
    endpoint: str(cta.endpoint).trim(),
    recipient: str(cta.recipient).trim(),
    success: str(cta.success).trim(),
  };
}

/**
 * The site's links (site.links) for the footer's row, unless the footer leaves them out (`footer.links: false`).
 * @param {object} site
 * @returns {Array<{id: string, icon: string, image: string, label: string, url: string}>}
 */
export function footerSocial(site) {
  return site.footer?.links === false ? [] : siteLinks(site);
}

/**
 * The site's address, phone and email (site.site.contact, contact-model.js), unless the footer leaves them out (`footer.contact: false`).
 * @param {object} site
 * @param {typeof import('./contact-model.js')|null} contact The contact model, null where the site holds no contact details
 * @returns {ReturnType<typeof import('./contact-model.js').contactParts>}
 */
export function footerContact(site, contact) {
  return site.footer?.contact === false || !contact ? null : contact.contactParts(contact.siteContact(site));
}

/**
 * The legal line's parts (legal name, organisation numbers, VAT and representative), unless the footer leaves them out (`footer.legal: false`).
 * @param {object} site
 * @param {typeof import('./contact-model.js')|null} contact The contact model, null where the site holds no contact details
 * @returns {ReturnType<typeof import('./contact-model.js').legalParts> | null} null when there is nothing to show
 */
export function footerLegal(site, contact) {
  if (site.footer?.legal === false || !contact) return null;
  const parts = contact.legalParts(contact.siteContact(site));
  return parts.length ? parts : null;
}

/**
 * The baseline: explicit copyright when set, otherwise the plain text lines (backwards compatible: a footer with only text renders unchanged).
 * @param {object} site
 * @returns {Array<string>}
 */
export function footerBaseline(site) {
  const footer = site.footer ?? {};
  const copyright = str(footer.copyright).trim();
  if (copyright) return [copyright];
  return str(footer.text).split('\n').map((l) => l.trim()).filter(Boolean);
}

/** The footer designs that dress the rich footer differently; anything else is the standard one. */
export const FOOTER_DESIGNS = ['chapters', 'split'];

/**
 * The design: `chapters` numbers the columns under a rule each, `split` puts the brand on a tinted half-width panel; '' for the standard or an unknown one.
 * @param {object} site
 * @returns {string}
 */
export function footerDesign(site) {
  const design = site.footer?.design;
  return FOOTER_DESIGNS.includes(design) ? design : '';
}

/**
 * Does the footer have rich content (brand, columns, social or baseline links, link row, call to action, copyright)?
 * No → footer.js draws the simple shape.
 * @param {object} site
 * @returns {boolean}
 */
export function hasRichFooter(site) {
  return !!(
    footerBrand(site) ||
    footerColumns(site).length ||
    footerSocial(site).length ||
    footerBaselineLinks(site).length ||
    footerLinkRow(site).length ||
    footerCta(site) ||
    str(site.footer?.copyright).trim()
  );
}

/** The longest a visitor's footer waits for the page's blocks to fetch their content. */
export const FOOTER_WAIT_MS = 3000;

/**
 * Resolves once no element under `root` is busy (`aria-busy="true"`, set by the collection, product, calendar and privacy blocks while they load), or after `ms`.
 * @param {Element} root
 * @param {number} ms
 * @returns {Promise<void>}
 */
export function whenSettled(root, ms) {
  return new Promise((resolve) => {
    const busy = () => root.querySelector('[aria-busy="true"]');
    if (!busy()) {
      resolve();
      return;
    }
    let timer = 0;
    const observer = new MutationObserver(() => { if (!busy()) done(); });
    function done() {
      observer.disconnect();
      clearTimeout(timer);
      resolve();
    }
    timer = setTimeout(done, ms);
    observer.observe(root, { subtree: true, childList: true, attributes: true, attributeFilter: ['aria-busy'] });
  });
}
