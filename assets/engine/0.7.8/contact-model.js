/**
 * The association's legal and contact details (site.site.contact, additive from 0.7.24.5): the country, the legal name, the organisation numbers the country's profile knows (contact-profiles.js), the VAT status, the representative, the address with its point on the map, the phone, the email and the contact points by role.
 * They are typed once in the Site panel and read by the footer, the contact block and the Organization JSON-LD.
 * Pure functions with no DOM and no language: the render layer adds the words through t() (ADR-0012), and tests/contact.test.mjs covers them.
 */

import { profileOf, countryForLanguage } from './contact-profiles.js';
import { runCheck } from './contact-checks.js';

const str = (v) => (typeof v === 'string' ? v.trim() : '');

/** The parts a contact block can show, in the order they stand (blocks/contact.js). */
export const CONTACT_PARTS = ['name', 'address', 'phone', 'email', 'legal'];

/**
 * The contact block's designs, the plain lines first: each id is a class `urd-contact-<id>` in base.css and a label `opt.contact.<id>` in the admin dictionaries.
 * `points` marks the design that lists the contact points by role, `geo` the one that shows the site's point on a map, and `band` the one that may stand on a coloured band.
 */
export const CONTACT_DESIGNS = [
  { id: 'lines' },
  { id: 'icons' },
  { id: 'card' },
  { id: 'tiles' },
  { id: 'facts' },
  { id: 'buttons' },
  { id: 'map', geo: true },
  { id: 'strip', band: true },
  { id: 'poster' },
  { id: 'roles', points: true },
  { id: 'qr' },
];

/** A design's entry; an unknown id is the plain lines. */
export function contactDesign(id) {
  return CONTACT_DESIGNS.find((d) => d.id === id) ?? CONTACT_DESIGNS[0];
}

/** The stored form of a value for an id: free text trimmed with single spaces (in a register entry the letters set apart from the number, and the prefix added when the number is typed alone), or the characters of a number uppercased with the separators removed and the prefix in place. */
export function normaliseId(def, value) {
  const text = str(value);
  if (def.raw) {
    let out = text.replace(/\s+/g, ' ');
    if (!def.entry) return out;
    out = out.toUpperCase();
    if (def.prefix && out && /^[0-9]/.test(out)) out = `${def.prefix} ${out}`;
    if (def.prefix) out = out.replace(new RegExp(`^${def.prefix}`, 'i'), def.prefix);
    return out.replace(/^([A-Za-z]+) ?([0-9])/, '$1 $2');
  }
  let out = text.toUpperCase().replace(/[\s./-]/g, '');
  if (def.key === 'fn') out = out.toLowerCase();
  if (def.prefix && out && !out.startsWith(def.prefix.toUpperCase())) out = def.prefix.toUpperCase() + out;
  return out;
}

/**
 * Whether a normalised value fits its id: the form (regex) and the check digit.
 * @returns {'ok' | 'warn' | 'form' | 'bad'} form when the number is not shaped as the country writes it; bad when the check digit fails; warn when the check fails but the profile only warns, since some registers issue numbers that fail it
 */
export function validateId(def, value) {
  if (!value) return 'ok';
  if (def.regex && !def.regex.test(value)) return 'form';
  if (!def.check) return 'ok';
  const subject = def.checkWhole || !def.prefix ? value : value.slice(def.prefix.length);
  if (runCheck(def.check, subject)) return 'ok';
  return def.warn ? 'warn' : 'bad';
}

/** A number in its usual grouping (the profile's display, # per character), or as stored. */
export function formatId(def, value) {
  if (!def.display || !value) return value;
  const chars = [...(def.prefix && value.startsWith(def.prefix.toUpperCase()) ? value.slice(def.prefix.length) : value)];
  let out = '';
  for (const c of def.display) {
    if (c === '#') { if (!chars.length) return value; out += chars.shift(); } else out += c;
  }
  return chars.length ? value : out;
}

/**
 * The contact details, cleaned: the country resolved to its profile, every id normalised, every text trimmed, the wrong type counted as empty.
 * @param {object} site
 */
export function siteContact(site) {
  const raw = site?.site?.contact;
  const contact = raw && typeof raw === 'object' ? raw : {};
  const country = /^[A-Z]{2}$/.test(contact.country ?? '') ? contact.country : (countryForLanguage(site?.site?.lang) ?? 'XX');
  const profile = profileOf(country);
  const ids = {};
  const extras = {};
  const registers = {};
  const rawIds = contact.ids && typeof contact.ids === 'object' ? contact.ids : {};
  const rawExtras = contact.extras && typeof contact.extras === 'object' ? contact.extras : {};
  const rawRegisters = contact.registers && typeof contact.registers === 'object' ? contact.registers : {};
  for (const def of profile.ids) {
    if (def.status) { if (rawIds[def.key] === true) ids[def.key] = true; continue; }
    const value = normaliseId(def, rawIds[def.key]);
    if (value) ids[def.key] = value;
    if (def.extra && str(rawExtras[def.key])) extras[def.key] = str(rawExtras[def.key]);
    if (def.registers?.includes(rawRegisters[def.key])) registers[def.key] = rawRegisters[def.key];
  }
  const address = contact.address && typeof contact.address === 'object' ? contact.address : {};
  const vat = contact.vat && typeof contact.vat === 'object' ? contact.vat : {};
  const geo = contact.geo && typeof contact.geo === 'object' ? contact.geo : {};
  const points = (Array.isArray(contact.points) ? contact.points : [])
    .filter((p) => p && typeof p === 'object')
    .map((p) => ({ role: str(p.role), email: str(p.email), phone: str(p.phone), note: str(p.note) }))
    .filter((p) => p.role && (p.email || p.phone || p.note));
  return {
    country,
    profile,
    legalName: str(contact.legalName),
    representative: str(contact.representative),
    ownLabel: str(contact.label),
    ids,
    extras,
    registers,
    vat: { registered: vat.registered === true, number: profile.vat.kind === 'separate' ? normaliseId(profile.vat, vat.number) : '' },
    street: str(address.street),
    postalCode: str(address.postalCode),
    city: str(address.city),
    phone: str(contact.phone),
    email: str(contact.email),
    geo: validGeo(geo) ? { lat: geo.lat, lon: geo.lon } : null,
    points,
  };
}

/** A point on the map: a latitude and a longitude within their ranges. */
function validGeo(geo) {
  return Number.isFinite(geo?.lat) && Number.isFinite(geo?.lon) && Math.abs(geo.lat) <= 90 && Math.abs(geo.lon) <= 180;
}

/** The VAT number as the data carries it (with its country prefix), or null when the association is not registered or the number is unknown. */
export function vatNumber(contact) {
  const { vat } = contact.profile;
  if (!contact.vat.registered) return null;
  const of = vat.of ? contact.ids[vat.of] : '';
  switch (vat.kind) {
    case 'same': return of || null;
    case 'mark': return of ? `${of}${vat.mark}` : null;
    case 'wrap': return of ? `${vat.prefix ?? ''}${vat.take ? of.slice(0, vat.take) : of}${vat.suffix ?? ''}` : null;
    case 'separate': return contact.vat.number || null;
    default: return null;
  }
}

/** A line's tokens filled in; when the court, city, tax office or register it names is empty, the id's bare line stands instead. */
function fill(def, values) {
  const pattern = def.line ?? '{label} {value} · {register}';
  const missing = ['extra', 'register'].some((k) => pattern.includes(`{${k}}`) && !values[k]);
  const used = missing ? def.lineBare ?? '{label} {value}' : pattern;
  return used.replace(/\{(\w+)\}/g, (_, k) => values[k] ?? '').replace(/\s{2,}/g, ' ').trim();
}

/**
 * The legal line's parts, in order: the legal name, each number as the profile writes it, the VAT number or status, and the representative.
 * The words a language adds (the representative's title) come from the render layer, so a part names its kind.
 * @returns {Array<{kind: 'name' | 'id' | 'vat' | 'representative', text: string}>}
 */
export function legalParts(contact) {
  const { profile } = contact;
  const parts = [];
  if (contact.legalName) parts.push({ kind: 'name', text: contact.legalName });
  for (const def of profile.ids) {
    const value = contact.ids[def.key];
    if (!value) continue;
    if (def.status) { parts.push({ kind: 'id', text: def.label }); continue; }
    let shown = formatId(def, value);
    let register = contact.registers[def.key] ?? '';
    if (profile.vat.kind === 'mark' && profile.vat.of === def.key && contact.vat.registered) {
      // Switzerland joins the register's and the VAT suffix: «CHE-123.456.789 HR/MWST».
      if (profile.vat.withRegister && register) { shown = `${shown} ${register}/${profile.vat.mark}`; register = ''; } else shown = `${shown} ${profile.vat.mark}`;
    }
    const label = def.ownLabel ? contact.ownLabel : def.label;
    const values = { label, value: shown, extra: contact.extras[def.key] ?? '', register };
    const text = fill(profile.vat.withRegister && !register ? { ...def, line: def.lineBare ?? '{label} {value}' } : def, values);
    if (text) parts.push({ kind: 'id', text });
  }
  const { vat } = profile;
  if (contact.vat.registered) {
    if (vat.kind === 'status') parts.push({ kind: 'vat', text: vat.label });
    else if ((vat.kind === 'wrap' || vat.kind === 'separate') && vat.show !== false) {
      // Without a label of the country's own, the render layer names it in the visitor's language.
      const number = vatNumber(contact);
      if (number) parts.push(vat.label ? { kind: 'vat', text: `${vat.label} ${number}` } : { kind: 'vat', text: number, labelKey: 'contact.vat' });
    }
  }
  if (contact.representative) parts.push({ kind: 'representative', text: contact.representative });
  return parts;
}

/** A phone number as a tel: address (the digits, with a leading + kept), or null when it holds fewer than three digits. */
export function telHref(phone) {
  const compact = str(phone).replace(/[^\d+]/g, '').replace(/(?!^)\+/g, '');
  return /\d{3,}/.test(compact) ? `tel:${compact}` : null;
}

/** A plausible email address: the mailto: link is only made for one. */
function emailLike(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

/**
 * The address and the ways to reach the association, for the footer.
 * The address is its lines (the street, then the postcode and the town); a phone or an email gets its link only when it is usable.
 * @returns {{address: string[], phone: {label: string, href: string|null}|null, email: {label: string, href: string|null}|null}|null} null when none is set
 */
export function contactParts(contact) {
  const address = [contact.street, [contact.postalCode, contact.city].filter(Boolean).join(' ')].filter(Boolean);
  const phone = contact.phone ? { label: contact.phone, href: telHref(contact.phone) } : null;
  const email = contact.email ? { label: contact.email, href: emailLike(contact.email) ? `mailto:${contact.email}` : null } : null;
  if (!address.length && !phone && !email) return null;
  return { address, phone, email };
}

/**
 * The contact points by role, for the block's roles design: each with its role, its phone and email as contactParts makes them, and its note.
 * @returns {Array<{role: string, phone: {label: string, href: string|null}|null, email: {label: string, href: string|null}|null, note: string}>}
 */
export function pointParts(contact) {
  return contact.points.map((p) => ({
    role: p.role,
    phone: p.phone ? { label: p.phone, href: telHref(p.phone) } : null,
    email: p.email ? { label: p.email, href: emailLike(p.email) ? `mailto:${p.email}` : null } : null,
    note: p.note,
  }));
}

/**
 * The seller as the checkout names it under its order buttons (angrerettloven § 8 d: the name, the address and the contact details before the order): the name, the organisation numbers and the VAT number, the address on one line, the phone and the email.
 * The name is the legal name, else the site's title; the representative stays in the footer.
 * @param {object} site
 * @returns {{name: string, legal: Array<object>, address: string, phone: object|null, email: object|null}|null} null when the site has no details beyond its title
 */
export function sellerParts(site) {
  const contact = siteContact(site);
  const legal = legalParts(contact).filter((p) => p.kind !== 'name' && p.kind !== 'representative');
  const parts = contactParts(contact);
  if (!contact.legalName && !legal.length && !parts) return null;
  return {
    name: contact.legalName || str(site?.site?.title),
    legal,
    address: parts?.address.join(', ') ?? '',
    phone: parts?.phone ?? null,
    email: parts?.email ?? null,
  };
}

/**
 * The legal and contact details as schema.org Organization properties, with every empty field left out.
 * The contact points by role become ContactPoint entries.
 * The first number with an ISO 6523 code goes into iso6523Code, the VAT number into vatID, the other numbers into identifier, a status with a schema.org type into nonprofitStatus; a number that fails a refusing check is left out.
 * @returns {object}
 */
export function organizationContact(contact) {
  const out = {};
  const { profile } = contact;
  if (contact.legalName) out.legalName = contact.legalName;
  const identifiers = [];
  for (const def of profile.ids) {
    const value = contact.ids[def.key];
    if (!value) continue;
    if (def.status) { if (def.nonprofit) out.nonprofitStatus = def.nonprofit; continue; }
    const state = validateId(def, value);
    if (state === 'bad' || state === 'form') continue;
    // The ISO 6523 value has no spaces or dots; Switzerland's scheme keeps «CHE», Italy's VAT scheme adds «IT».
    const bare = (def.prefix && !def.icdKeep && value.startsWith(def.prefix.toUpperCase()) ? value.slice(def.prefix.length) : value).replace(/[\s.]/g, '');
    if (def.icd && !out.iso6523Code) { out.iso6523Code = `${def.icd}:${def.icdPrefix ?? ''}${bare}`; continue; }
    identifiers.push({ '@type': 'PropertyValue', propertyID: def.ownLabel ? contact.ownLabel || 'id' : def.label, value: formatId(def, value) });
  }
  if (identifiers.length) out.identifier = identifiers.length === 1 ? identifiers[0] : identifiers;
  // A derived VAT number is only as good as the number it comes from; a separate one is checked on its own.
  const number = vatNumber(contact);
  const source = profile.ids.find((def) => def.key === profile.vat.of);
  const fits = (state) => state !== 'bad' && state !== 'form';
  const sound = profile.vat.kind === 'separate' ? fits(validateId(profile.vat, number ?? '')) : !source || fits(validateId(source, contact.ids[source.key]));
  if (number && sound) out.vatID = number;
  const address = { streetAddress: contact.street, postalCode: contact.postalCode, addressLocality: contact.city, addressCountry: contact.country === 'XX' ? '' : contact.country };
  for (const key of Object.keys(address)) if (!address[key]) delete address[key];
  if (Object.keys(address).length > (address.addressCountry ? 1 : 0)) out.address = { '@type': 'PostalAddress', ...address };
  if (contact.phone) out.telephone = contact.phone;
  if (contact.email) out.email = contact.email;
  // A contact point with a way to reach it; a point with a note alone has nothing for a machine to use.
  const points = contact.points.filter((p) => p.phone || (p.email && emailLike(p.email))).map((p) => {
    const point = { '@type': 'ContactPoint', contactType: p.role };
    if (p.phone) point.telephone = p.phone;
    if (p.email && emailLike(p.email)) point.email = p.email;
    return point;
  });
  if (points.length) out.contactPoint = points;
  return out;
}
