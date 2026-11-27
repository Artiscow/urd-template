/**
 * Cookie helpers for the GitHub sign-in: the token ('urd_gh'), its renewal ('urd_ghr') and the sign-in's 'urd_state', all HttpOnly, Secure and SameSite=Lax.
 */

/**
 * @param {string} name
 * @param {string} value
 * @param {{maxAge?: number, path?: string}} [opts] maxAge in seconds (default 30 days); path (default /)
 * @returns {string} Value for a Set-Cookie header
 */
export function serializeCookie(name, value, opts = {}) {
  const maxAge = opts.maxAge ?? 60 * 60 * 24 * 30;
  return `${name}=${value}; Max-Age=${maxAge}; Path=${opts.path ?? '/'}; HttpOnly; Secure; SameSite=Lax`;
}

/** Set-Cookie value that deletes the cookie set at `path`. */
export function expireCookie(name, path = '/') {
  return `${name}=; Max-Age=0; Path=${path}; HttpOnly; Secure; SameSite=Lax`;
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
