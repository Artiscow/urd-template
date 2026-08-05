/**
 * Ren skjemalogikk for skjema-pluginen (ingen DOM, ingen fetch): validering,
 * honeypot, mailto-bygging og payload-forming. Alt her enhetstestes i node;
 * index.js står for rendering og innsending.
 *
 * Besøkende-input håndteres ALDRI som HTML: verdiene URL-encodes for mailto
 * og sendes som JSON til et valgfritt endepunkt. Honeypot er et skjult felt
 * bots fyller ut; er det utfylt, er innsendingen forkastet.
 */

/** Praktisk e-postsjekk (ikke RFC-fullstendig, men fanger vanlige feil). */
export function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value ?? '').trim());
}

/**
 * Honeypot: bots fyller ut alle felt, også det skjulte. Er honeypot-feltet
 * utfylt, behandles innsendingen som spam.
 * @param {string} honeypotValue
 * @returns {boolean} true = spam (skal forkastes)
 */
export function isSpam(honeypotValue) {
  return String(honeypotValue ?? '').trim() !== '';
}

/**
 * Validerer innsamlede verdier mot feltdefinisjonene.
 * @param {Array<{id, label, type, required}>} fields
 * @param {Record<string,string>} values
 * @param {{required?: string, email?: string}} [messages] Meldingsmaler ({label} byttes inn)
 * @returns {{ ok: boolean, errors: Record<string,string> }}
 */
export function validate(fields, values, messages = {}) {
  // Meldingsmalene kan overstyres (index.js sender besøkende-språkets
  // tekster via t()); standardene er bokmål så node-testene er selvbærende.
  const requiredMsg = messages.required ?? '{label} må fylles ut';
  const emailMsg = messages.email ?? 'Skriv en gyldig e-postadresse';
  const errors = {};
  for (const field of fields) {
    const value = String(values[field.id] ?? '').trim();
    if (field.required && !value) {
      errors[field.id] = requiredMsg.replaceAll('{label}', field.label);
      continue;
    }
    if (value && field.type === 'email' && !isEmail(value)) {
      errors[field.id] = emailMsg;
    }
  }
  return { ok: Object.keys(errors).length === 0, errors };
}

/** «Felt: verdi»-linjer, én per felt med verdi (ren tekst, til e-postkropp). */
function bodyLines(fields, values) {
  return fields
    .map((field) => [field.label, String(values[field.id] ?? '').trim()])
    .filter(([, value]) => value)
    .map(([label, value]) => `${label}: ${value}`)
    .join('\n');
}

/**
 * Bygger en mailto-URL med emne og kropp fra feltene (alt URL-encodet).
 * @param {string} recipient mottakeradresse
 * @param {string} subject
 * @param {Array} fields
 * @param {Record<string,string>} values
 * @returns {string|null} null hvis mottakeren mangler
 */
export function buildMailto(recipient, subject, fields, values) {
  const to = String(recipient ?? '').trim();
  if (!to) return null;
  const params = new URLSearchParams();
  if (subject) params.set('subject', subject);
  const body = bodyLines(fields, values);
  if (body) params.set('body', body);
  const query = params.toString().replace(/\+/g, '%20');
  return query ? `mailto:${to}?${query}` : `mailto:${to}`;
}

/**
 * Payload til et eksternt endepunkt: feltverdiene pluss avsenderkontekst.
 * Honeypot utelates bevisst (den er kun en klientvakt).
 * @returns {Record<string, string>}
 */
export function buildPayload(fields, values, extra = {}) {
  const out = { ...extra };
  for (const field of fields) {
    out[field.id] = String(values[field.id] ?? '').trim();
  }
  return out;
}

/** Endepunktets opprinnelse (til CSP-instruksen ved blokkert innsending). */
export function endpointOrigin(url) {
  try {
    return new URL(String(url).trim()).origin;
  } catch {
    return null;
  }
}
