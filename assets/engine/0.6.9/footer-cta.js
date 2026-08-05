/**
 * Ren logikk for footer-CTA-ens nyhetsbrev-innsending: e-postvalidering,
 * honeypot-sjekk, endepunkt-payload og mailto-fallback. Ingen DOM, ingen fetch
 * (DOM-en og selve fetch-en bor i footer.js). Motoren skal aldri avhenge av en
 * plugin, så disse hjelperne speiler - men importerer IKKE - skjema-pluginens
 * form.js. Dekket av tests/footer-cta.test.mjs.
 */
import { t } from './i18n.js';

// Enkel e-postform (ikke RFC-komplett, samme som skjema-pluginen): noe før @,
// noe etter, og et punktum i domenet.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** @param {unknown} value @returns {boolean} */
export function isEmail(value) {
  return typeof value === 'string' && EMAIL_RE.test(value.trim());
}

/** Honeypot: et skjult felt som kun bots fyller ut. Ikke-tomt = spam. */
export function isSpam(honeypot) {
  return typeof honeypot === 'string' && honeypot.trim() !== '';
}

/**
 * JSON-payload til nyhetsbrev-endepunktet (Formspree/Mailchimp/egen function).
 * `extra` (f.eks. { side: location.pathname }) legges først, e-posten sist.
 * @param {string} email
 * @param {Record<string, string>} [extra]
 * @returns {Record<string, string>}
 */
export function buildNewsletterPayload(email, extra = {}) {
  return { ...extra, email: (email ?? '').trim() };
}

/**
 * Mailto-fallback når det ikke finnes et endepunkt. Null når mottaker mangler.
 * Mellomrom kodes som %20 (URLSearchParams gir +), slik at e-postklienter
 * tolker emne/tekst riktig - samme knep som skjema-pluginens buildMailto.
 * @param {string} recipient
 * @param {string} email
 * @returns {string|null}
 */
export function buildNewsletterMailto(recipient, email) {
  const to = (recipient ?? '').trim();
  if (!to) return null;
  const params = new URLSearchParams({
    subject: t('footer.newsletter.mailtoSubject'),
    body: t('footer.newsletter.mailtoBody', { email: (email ?? '').trim() }),
  });
  return `mailto:${to}?${params.toString().replace(/\+/g, '%20')}`;
}

/**
 * Origin for et endepunkt (til _headers connect-src-instruksen i editoren).
 * Null ved ugyldig URL.
 * @param {string} url
 * @returns {string|null}
 */
export function endpointOrigin(url) {
  try {
    return new URL(url).origin;
  } catch {
    return null;
  }
}
