/**
 * Pure footer logic: brand, columns, social links and baseline are built from
 * site.footer and the page registry. No DOM - the module is importable in node
 * and covered by tests/footer.test.mjs; the DOM building lives in footer.js.
 */

import { resolveItem, isSafeUrl } from './nav-model.js';
import { siteLinks } from './links-model.js';
import { siteContact, legalParts, contactParts } from './contact-model.js';

// The safe-URL guard lives in nav-model (shared with resolveItem); re-exported
// here for footer.js and the tests that import it from here.
export { isSafeUrl };

// Safe to string: hand-edited site.json can hold numbers/booleans where the
// model expects text. An empty string keeps .trim()/.split() from throwing and
// toppling the whole footer render (the page never dies of bad data).
const str = (v) => (typeof v === 'string' ? v : '');

/**
 * The brand column: explicit title plus optional tagline. No fallback to the
 * site title - a footer that was just switched on should be empty, not filled
 * with the site name. Null when there is nothing to show.
 * @param {object} site
 * @returns {{title: string, tagline: string}|null}
 */
export function footerBrand(site) {
  const brand = site.footer?.brand ?? {};
  const title = str(brand.title).trim();
  const tagline = str(brand.tagline).trim();
  // The brand can be text, an uploaded logo (image) or both (additive since
  // v0.6, mirroring the nav logo). mode controls what is shown.
  const logo = str(brand.logo).trim();
  const mode = brand.mode === 'image' || brand.mode === 'both' ? brand.mode : 'text';
  const hasLogo = logo && mode !== 'text';
  if (!title && !tagline && !hasLogo) return null;
  return { title, tagline, logo, mode, logoHeight: brand.logoHeight };
}

/**
 * The columns with resolved links (page → path, href → external). Links without
 * a label are skipped, and a column with no valid links is not rendered (a lone
 * title is not worth a column in the finished footer).
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
        // Long column (many links, or an explicit col.wide): rendered across two
        // tracks and split into two sub-columns, so the footer stays symmetric.
        wide: col.wide === true || links.length > 6,
      };
    })
    .filter((col) => col.links.length);
}

/**
 * The baseline's optional right-hand links (privacy/terms/«Made with Urd»),
 * resolved like the column links. Additive since v0.6.
 * @param {object} site
 * @returns {Array<{label: string, href: string, external: boolean, missing: boolean}>}
 */
export function footerBaselineLinks(site) {
  const pages = site.pages ?? [];
  const links = Array.isArray(site.footer?.baseline) ? site.footer.baseline : [];
  return links.filter((l) => str(l.label).trim()).map((l) => resolveItem(l, pages));
}

/**
 * The doormat link row: one centered row of links (the Centered and Big CTA
 * templates). Additive since v0.6.
 * @param {object} site
 * @returns {Array<{label: string, href: string, external: boolean, missing: boolean}>}
 */
export function footerLinkRow(site) {
  const pages = site.pages ?? [];
  const row = Array.isArray(site.footer?.linkRow) ? site.footer.linkRow : [];
  return row.filter((l) => str(l.label).trim()).map((l) => resolveItem(l, pages));
}

/**
 * The call to action (CTA, additive since v0.6): normalized or null.
 * `kind` is 'button' (button as a link) or 'newsletter' (email field). `big`
 * gives the large centered variant. A button CTA requires button text; a
 * newsletter requires at least a heading - otherwise the CTA is empty (null).
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
    // An empty label/success is filled in by the render layer with the visitor
    // language's default text (footer.js + t()); the model is language-free (ADR-0012).
    label: rawLabel,
    big: cta.big === true,
    target: kind === 'button' ? resolveItem({ label: rawLabel, page: cta.page, target: cta.target, href: cta.href, newTab: cta.newTab, rel: cta.rel, download: cta.download }, pages) : null,
    endpoint: str(cta.endpoint).trim(),
    recipient: str(cta.recipient).trim(),
    success: str(cta.success).trim(),
  };
}

/**
 * The footer's row of the site's links (site.links, links-model.js; before
 * 0.7.0.52 the footer's own `social`, lifted by the site migration 4 -> 5),
 * unless the footer leaves them out (`footer.links: false`).
 * @param {object} site
 * @returns {Array<{id: string, icon: string, image: string, label: string, url: string}>}
 */
export function footerSocial(site) {
  return site.footer?.links === false ? [] : siteLinks(site);
}

/**
 * The site's address, phone and email (site.site.contact, contact-model.js), unless the footer leaves them out (`footer.contact: false`, additive from 0.7.24.5).
 * @param {object} site
 * @returns {ReturnType<typeof contactParts>}
 */
export function footerContact(site) {
  return site.footer?.contact === false ? null : contactParts(siteContact(site));
}

/**
 * The legal line's parts (the legal name, the organisation numbers, the VAT number and the representative), unless the footer leaves them out (`footer.legal: false`).
 * On by default once filled, since most countries ask for them to be easy to find.
 * @param {object} site
 * @returns {ReturnType<typeof legalParts> | null} null when there is nothing to show
 */
export function footerLegal(site) {
  if (site.footer?.legal === false) return null;
  const parts = legalParts(siteContact(site));
  return parts.length ? parts : null;
}

/**
 * The baseline: explicit copyright when set, otherwise the plain text lines
 * (backwards compatible: a footer with only text renders unchanged).
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
 * The design (footer.design, additive from v0.7): `chapters` numbers the
 * link columns under a rule each, `split` gives the brand half the width on
 * a tinted panel. '' for the standard footer and for anything unknown.
 * @param {object} site
 * @returns {string}
 */
export function footerDesign(site) {
  const design = site.footer?.design;
  return FOOTER_DESIGNS.includes(design) ? design : '';
}

/**
 * Does the footer have any rich content (brand/columns/social/copyright)?
 * No → footer.js keeps the byte-identical plain text rendering.
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
