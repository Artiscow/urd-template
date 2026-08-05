/**
 * Cookie-hjelpere for OAuth-tokenet.
 *
 * Tokenet lagres i en httpOnly + Secure + SameSite=Lax-cookie ('urd_gh')
 * og når ALDRI nettleser-JS. En kortlevd 'urd_state'-cookie beskytter
 * OAuth-flyten mot CSRF. (Mønster validert i ApeironLF.)
 */

/**
 * @param {string} name
 * @param {string} value
 * @param {{maxAge?: number}} [opts] maxAge i sekunder (standard 30 dager)
 * @returns {string} Verdi for en Set-Cookie-header
 */
export function serializeCookie(name, value, opts = {}) {
  const maxAge = opts.maxAge ?? 60 * 60 * 24 * 30;
  return `${name}=${value}; Max-Age=${maxAge}; Path=/; HttpOnly; Secure; SameSite=Lax`;
}

/** Set-Cookie-verdi som sletter cookien. */
export function expireCookie(name) {
  return `${name}=; Max-Age=0; Path=/; HttpOnly; Secure; SameSite=Lax`;
}

/**
 * @param {Request} request
 * @param {string} name
 * @returns {string|null}
 */
export function readCookie(request, name) {
  const header = request.headers.get('cookie') ?? '';
  for (const part of header.split(/;\s*/)) {
    const eq = part.indexOf('=');
    if (eq > 0 && part.slice(0, eq).trim() === name) return part.slice(eq + 1);
  }
  return null;
}
