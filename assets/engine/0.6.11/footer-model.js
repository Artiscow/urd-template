/**
 * Ren footer-logikk: merkevare, kolonner, sosiale lenker og bunnlinje bygges
 * fra site.footer og sideregisteret. Ingen DOM - modulen er node-importerbar
 * og dekkes av tests/footer.test.mjs; DOM-byggingen bor i footer.js.
 */

import { resolveItem, isSafeUrl } from './nav-model.js';

// Trygg-URL-vokteren bor i nav-model (delt med resolveItem); re-eksporteres her
// for footer.js og testene som importerer den herfra.
export { isSafeUrl };

// Trygt til streng: håndredigert site.json kan ha tall/bool der modellen venter
// tekst. Da gir vi tom streng i stedet for å la .trim()/.split() kaste og velte
// hele footer-renderen (siden dør aldri av dårlig data).
const str = (v) => (typeof v === 'string' ? v : '');

/**
 * Merkevare-kolonnen: eksplisitt tittel + valgfri tagline. Ingen fallback til
 * sidetittelen - en footer som nettopp er skrudd på skal være tom, ikke fylles
 * med sidenavnet. Null når det ikke finnes noe å vise.
 * @param {object} site
 * @returns {{title: string, tagline: string}|null}
 */
export function footerBrand(site) {
  const brand = site.footer?.brand ?? {};
  const title = str(brand.title).trim();
  const tagline = str(brand.tagline).trim();
  // Merket kan være tekst, opplastet logo (bilde) eller begge (additivt fra
  // v0.6, speiler nav-logoen). mode styrer hva som vises.
  const logo = str(brand.logo).trim();
  const mode = brand.mode === 'image' || brand.mode === 'both' ? brand.mode : 'text';
  const hasLogo = logo && mode !== 'text';
  if (!title && !tagline && !hasLogo) return null;
  return { title, tagline, logo, mode, logoHeight: brand.logoHeight };
}

/**
 * Kolonnene med resolverte lenker (page → sti, href → ekstern). Lenker uten
 * etikett hoppes over, og en kolonne uten gyldige lenker rendres ikke (en
 * ensom tittel er ikke verdt en kolonne i den ferdige footeren).
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
        // Lang kolonne (mange lenker, eller eksplisitt col.wide): rendres over
        // to spor og deles i to underkolonner, så footeren holder seg symmetrisk.
        wide: col.wide === true || links.length > 6,
      };
    })
    .filter((col) => col.links.length);
}

/**
 * Bunnlinjas valgfrie høyre-lenker (personvern/vilkår/«Laget med Urd»),
 * resolvert som kolonne-lenkene. Additivt fra v0.6.
 * @param {object} site
 * @returns {Array<{label: string, href: string, external: boolean, missing: boolean}>}
 */
export function footerBaselineLinks(site) {
  const pages = site.pages ?? [];
  const links = Array.isArray(site.footer?.baseline) ? site.footer.baseline : [];
  return links.filter((l) => str(l.label).trim()).map((l) => resolveItem(l, pages));
}

/**
 * Doormat-lenkeraden: én sentrert rad med lenker (Sentrert- og Stor CTA-malen).
 * Additivt fra v0.6.
 * @param {object} site
 * @returns {Array<{label: string, href: string, external: boolean, missing: boolean}>}
 */
export function footerLinkRow(site) {
  const pages = site.pages ?? [];
  const row = Array.isArray(site.footer?.linkRow) ? site.footer.linkRow : [];
  return row.filter((l) => str(l.label).trim()).map((l) => resolveItem(l, pages));
}

/**
 * Handlingsoppfordringen (CTA, additivt fra v0.6): normalisert eller null.
 * `kind` er 'button' (knapp som lenke) eller 'newsletter' (e-postfelt). `big`
 * gir den store sentrerte varianten. Knapp-CTA krever knappetekst; nyhetsbrev
 * krever minst en overskrift - ellers er CTA-en tom (null).
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
    // Tom label/success fylles av render-laget med besøkende-språkets
    // standardtekst (footer.js + t()); modellen er språkfri (ADR-0012).
    label: rawLabel,
    big: cta.big === true,
    target: kind === 'button' ? resolveItem({ label: rawLabel, page: cta.page, href: cta.href }, pages) : null,
    endpoint: str(cta.endpoint).trim(),
    recipient: str(cta.recipient).trim(),
    success: str(cta.success).trim(),
  };
}

/**
 * Sosiale lenker: kun trygge URL-er slippes gjennom (footer.js verifiserer
 * i tillegg ikon-id-en via iconSvg og dropper ukjente).
 * @param {object} site
 * @returns {Array<{icon: string, url: string}>}
 */
export function footerSocial(site) {
  const social = Array.isArray(site.footer?.social) ? site.footer.social : [];
  return social
    .filter((s) => s && typeof s.icon === 'string' && s.icon.trim() && isSafeUrl(s.url))
    .map((s) => ({ icon: s.icon.trim(), url: s.url.trim() }));
}

/**
 * Bunnlinja: eksplisitt copyright om satt, ellers de gamle text-linjene
 * (bakoverkompatibelt - en footer med kun text rendres som før).
 * @param {object} site
 * @returns {Array<string>}
 */
export function footerBaseline(site) {
  const footer = site.footer ?? {};
  const copyright = str(footer.copyright).trim();
  if (copyright) return [copyright];
  return str(footer.text).split('\n').map((l) => l.trim()).filter(Boolean);
}

/**
 * Har footeren noe av det NYE innholdet (merkevare/kolonner/sosiale/copyright)?
 * Nei → footer.js beholder den gamle, byte-like tekst-rendringen.
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
