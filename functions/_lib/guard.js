/**
 * Vern for publiseringslaget (se ADR-0003).
 *
 * Sti-allowlisten er implementert for ekte allerede i skjelettet: den er
 * liten, testbar og sikkerhetskritisk. En kapret redaktørsesjon skal aldri
 * kunne skrive kode eller konfigurasjon, kun innhold. Invarianten gjelder
 * også filtype: under innholdsprefiksene tillates kun data- og bildeendelser,
 * aldri noe som kan kjøre under `script-src 'self'` (js/html o.l.).
 */

/** Stier publisering ALDRI får skrive (prefiks- eller eksaktmatch). */
const DENY_PREFIXES = ['functions/', '.github/', 'admin/', 'assets/engine/', 'assets/urd/'];
const DENY_EXACT = ['_headers', '_redirects', 'urd.json', 'index.html', '.gitignore', 'wrangler.toml'];

/**
 * Stier publisering FÅR skrive, med endelse-allowlist per prefiks.
 * Editoren skriver i praksis kun .json/.css (content/) og .webp/.svg (media/);
 * vanlige rasterformater tas med som romslighet for manuelt git-lagt media.
 */
const ALLOW_PREFIX_EXTENSIONS = {
  'content/': ['json', 'css'],
  'media/': ['webp', 'svg', 'png', 'jpg', 'jpeg', 'gif', 'avif', 'ico'],
};
const ALLOW_EXACT = ['plugins/plugins.json'];

/**
 * Sideruting: publisering får skrive `<slug>/index.html` (kopi av
 * rot-index.html per side, så ruting virker på alle statiske hoster) -
 * men ALDRI rot-index.html, og aldri under reserverte mapper.
 */
const PAGE_INDEX_RE = /^[a-z0-9][a-z0-9-]*\/index\.html$/;
const RESERVED_SLUGS = ['admin', 'api', 'assets', 'content', 'media', 'plugins', 'functions'];

/** Felles normalisering: skråstreker, og avvis absolutte stier og `..`. */
function normalizePath(path) {
  if (typeof path !== 'string' || path.length === 0) return null;
  const normalized = path.replaceAll('\\', '/');
  if (normalized.startsWith('/') || normalized.split('/').includes('..')) return null;
  return normalized;
}

/**
 * @param {string} path Repo-relativ filsti fra en commit-forespørsel
 * @returns {boolean} true hvis stien er trygg å skrive via publisering
 */
export function isAllowedPath(path) {
  const normalized = normalizePath(path);
  if (!normalized) return false;
  if (DENY_EXACT.includes(normalized)) return false;
  if (DENY_PREFIXES.some((p) => normalized.startsWith(p))) return false;
  if (ALLOW_EXACT.includes(normalized)) return true;
  if (PAGE_INDEX_RE.test(normalized) && !RESERVED_SLUGS.includes(normalized.split('/')[0])) return true;
  const filename = normalized.split('/').pop();
  const dot = filename.lastIndexOf('.');
  if (dot <= 0) return false; // fil uten endelse (eller ren dotfil) avvises
  const extension = filename.slice(dot + 1).toLowerCase();
  return Object.entries(ALLOW_PREFIX_EXTENSIONS).some(
    ([prefix, extensions]) => normalized.startsWith(prefix) && extensions.includes(extension)
  );
}

/**
 * Eierskapskartet for oppdatereren (0.6.9): speiler ownedPaths/userPaths i
 * urd.json, fordi functions ikke kan lese repoets urd.json ved kjøring.
 * Kontraktstesten i tests/guard.test.mjs krever at listene er identiske med
 * urd.json, så de aldri driver. Mønsterformene er kun eksakt sti og
 * `prefiks/**` - hold det slik.
 */
export const OWNED_PATTERNS = [
  'index.html',
  'urd.json',
  '_headers',
  'speculation-rules.json',
  'README.md',
  'README-en.md',
  'README-tr.md',
  'admin/**',
  'assets/engine/**',
  'assets/urd/**',
  'assets/styles/base.css',
  'functions/**',
];
export const USER_PATTERNS = ['content/**', 'media/**', 'plugins/**'];

/** @param {string} pattern Eksakt sti eller `prefiks/**` */
export function matchesPattern(pattern, path) {
  if (pattern.endsWith('/**')) return path.startsWith(pattern.slice(0, -2));
  return path === pattern;
}

/** Urd-eid sti (oppdatererens domene; publisering avviser alle disse). */
export function isOwnedPath(path) {
  const normalized = normalizePath(path);
  return normalized !== null && OWNED_PATTERNS.some((p) => matchesPattern(p, normalized));
}

/** Brukereid sti (innhold/media/plugins; oppdatereren rører aldri disse). */
export function isUserPath(path) {
  const normalized = normalizePath(path);
  return normalized !== null && USER_PATTERNS.some((p) => matchesPattern(p, normalized));
}

/** Sideruting-kopi (`<slug>/index.html`): skrives av publisering, og friskes
 *  opp av oppdatereren i samme commit som et motorbytte (ADR-0013). */
export function isPageIndexCopy(path) {
  const normalized = normalizePath(path);
  return normalized !== null
    && PAGE_INDEX_RE.test(normalized)
    && !RESERVED_SLUGS.includes(normalized.split('/')[0]);
}

/**
 * Sjekker at et GitHub-brukernavn står i ALLOWED_LOGINS (kommaseparert
 * miljøvariabel). Håndheves i ALLE muterende endepunkter (forsvar i dybden).
 * @param {string} login
 * @param {{ALLOWED_LOGINS?: string}} env
 */
export function isAllowedLogin(login, env) {
  const allowed = (env.ALLOWED_LOGINS || '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  return allowed.includes(String(login).toLowerCase());
}
