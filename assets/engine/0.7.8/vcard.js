/**
 * The site's contact details as a vCard 3.0 (RFC 2426), for the contact block's «Add to contacts» button and its QR design.
 * The card is the organisation's own: its name as FN and ORG with an empty person name, the address, the phone, the email and the site's address.
 * Pure and DOM-free (tests/vcard.test.mjs); loaded by the block only when a design or the button needs it, so it stays outside the visitor closure.
 */
import { siteContact, telHref } from './contact-model.js';

/** A text value escaped as the format asks: a backslash, a comma and a semicolon get a backslash, a line break becomes \n. */
const esc = (v) => String(v).replace(/[\\,;]/g, (c) => `\\${c}`).replace(/\r?\n/g, '\\n');

/** The octets a character takes in UTF-8. */
const octets = (ch) => {
  const code = ch.codePointAt(0);
  return code < 0x80 ? 1 : code < 0x800 ? 2 : code < 0x10000 ? 3 : 4;
};

/** A content line folded at 75 octets, each continuation starting with a space, never inside a character. */
function fold(line) {
  const out = [];
  let current = '';
  let size = 0;
  for (const ch of line) {
    const n = octets(ch);
    if (size + n > 75) {
      out.push(current);
      current = ' ';
      size = 1;
    }
    current += ch;
    size += n;
  }
  out.push(current);
  return out.join('\r\n');
}

/** The country's name in the site's language, or the code when the platform has no name for it. */
function countryName(code, lang) {
  if (!code || code === 'XX') return '';
  try {
    return new Intl.DisplayNames([lang || 'en'], { type: 'region' }).of(code) ?? code;
  } catch {
    return code;
  }
}

/**
 * The vCard for the site, or null when it holds nothing beyond a name.
 * A file folds its long lines and types its address, phone and email as the work ones; `compact`, for a QR code, keeps the lines whole and leaves the types out, which every reader takes and which makes the code smaller.
 * @param {object} site
 * @param {{url?: string, compact?: boolean, parts?: string[]|null}} [opts] `url` is the site's own address; `parts` the parts the card carries (address, phone, email), all when omitted
 * @returns {string|null}
 */
export function contactVcard(site, { url = '', compact = false, parts = null } = {}) {
  const contact = siteContact(site);
  // `parts` names what the card carries (address, phone, email), as a contact block shows it; without it the card carries everything the site has.
  const shown = (part) => !Array.isArray(parts) || parts.includes(part);
  const name = contact.legalName || String(site?.site?.title ?? '').trim();
  const tel = shown('phone') ? (telHref(contact.phone)?.slice(4) ?? '') : '';
  const email = shown('email') ? contact.email : '';
  const hasAddress = shown('address') && (contact.street || contact.postalCode || contact.city);
  if (!tel && !email && !hasAddress) return null;
  const lines = ['BEGIN:VCARD', 'VERSION:3.0', 'N:;;;;'];
  if (name) lines.push(`FN:${esc(name)}`, `ORG:${esc(name)}`);
  if (hasAddress) {
    const country = countryName(contact.country, site?.site?.lang);
    lines.push(`ADR${compact ? '' : ';TYPE=WORK'}:;;${esc(contact.street)};${esc(contact.city)};;${esc(contact.postalCode)};${esc(country)}`);
  }
  if (tel) lines.push(`TEL${compact ? '' : ';TYPE=WORK,VOICE'}:${tel}`);
  if (email) lines.push(`EMAIL${compact ? '' : ';TYPE=INTERNET,WORK'}:${esc(email)}`);
  if (/^https?:\/\//.test(url)) lines.push(`URL:${url}`);
  lines.push('END:VCARD');
  return `${lines.map((line) => (compact ? line : fold(line))).join('\r\n')}\r\n`;
}

/** The file name for the card: the name's letters and digits joined by hyphens, «contact» when none is left. */
export function vcardFileName(name) {
  const base = String(name ?? '').normalize('NFC').replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '').slice(0, 60);
  return `${base || 'contact'}.vcf`;
}
