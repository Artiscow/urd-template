import { svgProblem } from './svg-check.js';

/**
 * The publishing guard (ADR-0003): publishing writes content only, never code or configuration, and no file type that can run under `script-src 'self'`.
 */

/** Paths publishing may NEVER write (prefix or exact match). */
const DENY_PREFIXES = ['functions/', '.github/', 'admin/', 'assets/engine/', 'assets/urd/'];
const DENY_EXACT = ['_headers', 'urd.json', 'index.html', '404.html', '.gitignore', 'wrangler.toml'];

/** Paths publishing may write, with an extension allowlist per prefix. */
const ALLOW_PREFIX_EXTENSIONS = {
  'content/': ['json', 'css', 'xml'],
  // Audio, video and pdf are published unchanged from data URLs; none can run as a script, and a PDF's content is checked (isAllowedContent).
  'media/': ['webp', 'svg', 'png', 'jpg', 'jpeg', 'gif', 'avif', 'ico',
    'mp3', 'm4a', 'aac', 'wav', 'ogg', 'flac', 'mp4', 'webm', 'pdf'],
};

/** The largest PDF publishing writes to media/, in bytes: the editor's PDF_MAX_BYTES (imageTools.js). */
export const MEDIA_PDF_MAX_BYTES = 15_000_000;

/** The start of a PDF (%PDF-) in base64. */
const PDF_BASE64_HEAD = 'JVBERi0';
// The root files publishing writes: the plugin list, the SEO pack's files and `_redirects`, which isAllowedContent checks line by line.
const ALLOW_EXACT = ['plugins/plugins.json', 'sitemap.xml', 'robots.txt', '_redirects'];

/** Page routing: publishing may write `<slug>/index.html`, a copy of the root index.html per page, never the root's own and never in a reserved folder. */
const PAGE_INDEX_RE = /^[a-z0-9][a-z0-9-]*\/index\.html$/;
const RESERVED_SLUGS = ['admin', 'api', 'assets', 'content', 'media', 'plugins', 'functions', 'readme'];

/** Shared normalisation: slashes, and reject absolute paths and `..`. */
function normalizePath(path) {
  if (typeof path !== 'string' || path.length === 0) return null;
  const normalized = path.replaceAll('\\', '/');
  if (normalized.startsWith('/') || normalized.split('/').includes('..')) return null;
  return normalized;
}

/**
 * @param {string} path Repo-relative file path from a commit request
 * @returns {boolean} true if the path is safe to write via publishing
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
  if (dot <= 0) return false; // a file without an extension (or a bare dotfile) is rejected
  const extension = filename.slice(dot + 1).toLowerCase();
  return Object.entries(ALLOW_PREFIX_EXTENSIONS).some(
    ([prefix, extensions]) => normalized.startsWith(prefix) && extensions.includes(extension)
  );
}

/**
 * Whether a file's content fits its path: PDFs and SVGs in media/, XML in content/, `sitemap.xml` and `_redirects` are checked, and every other path passes.
 * @param {string} path Repo-relative file path from a commit request
 * @param {unknown} content The file's content as sent
 * @param {unknown} encoding 'base64' or 'utf-8'
 * @returns {boolean}
 */
export function isAllowedContent(path, content, encoding) {
  const normalized = normalizePath(path);
  if (normalized === '_redirects') return encoding !== 'base64' && isAllowedRedirects(content);
  if (normalized === 'sitemap.xml' || (normalized?.startsWith('content/') && normalized.toLowerCase().endsWith('.xml'))) {
    return encoding !== 'base64' && isAllowedXml(content);
  }
  if (normalized?.startsWith('media/') && normalized.toLowerCase().endsWith('.svg')) {
    const text = encoding === 'base64' ? base64Text(content) : content;
    return typeof text === 'string' && svgProblem(text) === null;
  }
  if (!normalized || !normalized.startsWith('media/') || !normalized.toLowerCase().endsWith('.pdf')) return true;
  if (encoding !== 'base64' || typeof content !== 'string') return false;
  return content.startsWith(PDF_BASE64_HEAD) && Math.floor((content.length * 3) / 4) <= MEDIA_PDF_MAX_BYTES;
}

/** The namespaces whose elements a browser runs or draws as a page: XHTML, SVG and MathML. */
const ACTIVE_NAMESPACES = ['http://www.w3.org/1999/xhtml', 'http://www.w3.org/2000/svg', 'http://www.w3.org/1998/Math/MathML'];

/**
 * Whether an XML file is a feed or a sitemap that can run nothing: an rss, feed or urlset root, no DOCTYPE, entity or stylesheet, and none of ACTIVE_NAMESPACES.
 * @param {unknown} content
 * @returns {boolean}
 */
export function isAllowedXml(content) {
  if (typeof content !== 'string' || content.length > 20_000_000) return false;
  if (/<!DOCTYPE|<!ENTITY|<\?xml-stylesheet/i.test(content)) return false;
  if (!/^\uFEFF?\s*(?:<\?xml\b[^?>]*\?>\s*)?<(?:rss|feed|urlset)[\s>]/.test(content)) return false;
  // Each xmlns declaration, of any prefix, has its value read from where it starts, within 2048 characters, with its references decoded.
  for (const match of content.matchAll(/\bxmlns(?::[^\s=>]*)?\s*=\s*(["'])/g)) {
    const start = match.index + match[0].length;
    const window = content.slice(start, start + 2048);
    const end = window.indexOf(match[1]);
    const value = (end < 0 ? window : window.slice(0, end)).replace(/&#x([0-9a-f]+);?/gi, (m, hex) => String.fromCodePoint(Math.min(parseInt(hex, 16), 0x10ffff)))
      .replace(/&#(\d+);?/g, (m, dec) => String.fromCodePoint(Math.min(Number(dec), 0x10ffff)))
      .replace(/&(lt|gt|quot|apos|amp);/g, (m, name) => ({ lt: '<', gt: '>', quot: '"', apos: "'", amp: '&' })[name])
      .replace(/[\u0000-\u0020\u007f]/g, '');
    if (ACTIVE_NAMESPACES.some((ns) => value.toLowerCase() === ns.toLowerCase())) return false;
  }
  return true;
}

/** A base64 file's text as UTF-8, or null where it is not base64. */
function base64Text(content) {
  if (typeof content !== 'string') return null;
  try {
    return new TextDecoder().decode(Uint8Array.from(atob(content), (c) => c.charCodeAt(0)));
  } catch {
    return null;
  }
}

/** The largest `_redirects` publishing writes: the host's 2,100 rules, each old address twice, at a generous line length. */
export const REDIRECTS_MAX_BYTES = 512_000;

/** Urd's own folders and root files, which no redirect may take (the editor's redirects-model.js isReservedSource holds the same). */
const REDIRECT_RESERVED_FOLDERS = ['admin', 'api', 'assets', 'content', 'plugins', 'functions', 'readme'];
const REDIRECT_RESERVED_FILES = ['/index.html', '/404.html', '/urd.json', '/speculation-rules.json', '/sitemap.xml', '/robots.txt'];

/** One redirect line: an old address from the root (a * only as its last segment, no placeholder), a path or an http(s) address, and 301 or 302. */
const REDIRECT_LINE_RE = /^\/(?:[A-Za-z0-9._~%!$&'()+,;=@-]+\/)*(?:[A-Za-z0-9._~%!$&'()+,;=@-]+\/?|\*)? (?:\/\S*|https?:\/\/\S+) 30[12]$/;

/**
 * Whether a `_redirects` file holds only comments and 301 or 302 lines, none from `/*` or Urd's own addresses, within REDIRECTS_MAX_BYTES (ADR-0015).
 * @param {unknown} content
 * @returns {boolean}
 */
export function isAllowedRedirects(content) {
  if (typeof content !== 'string' || content.length > REDIRECTS_MAX_BYTES) return false;
  for (const line of content.split('\n')) {
    const text = line.replace(/\r$/, '');
    if (text === '' || text.startsWith('#')) continue;
    if (!REDIRECT_LINE_RE.test(text)) return false;
    const from = text.split(' ')[0].replace(/\/$/, '') || '/';
    // `/*` would take every address, Urd's own among them.
    if (from === '/*' || REDIRECT_RESERVED_FILES.includes(from) || REDIRECT_RESERVED_FOLDERS.includes(from.split('/')[1] ?? '')) return false;
  }
  return true;
}

/**
 * Whether publishing may move a file in media/: both paths in media/ and writable, with the same extension, and not the same path.
 * @param {string} from Repo-relative path of the file as it stands
 * @param {string} to Repo-relative path it moves to
 * @returns {boolean}
 */
export function isAllowedMove(from, to) {
  const a = normalizePath(from);
  const b = normalizePath(to);
  if (!a || !b || a === b) return false;
  if (!a.startsWith('media/') || !b.startsWith('media/')) return false;
  if (!isAllowedPath(a) || !isAllowedPath(b)) return false;
  const ext = (p) => p.slice(p.lastIndexOf('.') + 1).toLowerCase();
  return ext(a) === ext(b);
}

/** A plugin's folder (`plugins/<id>`, the id as a manifest has it): publishing may delete it whole, never write in it (ADR-0003). */
const PLUGIN_FOLDER_RE = /^plugins\/[a-z0-9][a-z0-9-]*$/;

/**
 * @param {string} path Repo-relative path from a commit request's deletion
 * @returns {boolean} true if publishing may delete it: a path it may write, or a plugin's whole folder
 */
export function isDeletablePath(path) {
  const normalized = normalizePath(path);
  if (!normalized) return false;
  return isAllowedPath(normalized) || PLUGIN_FOLDER_RE.test(normalized);
}

/**
 * @param {string} path Repo-relative path
 * @returns {boolean} true for a file inside a plugin's folder, which publishing deletes with the whole folder and the undo of that publish brings back
 */
export function isPluginFile(path) {
  const normalized = normalizePath(path);
  if (!normalized) return false;
  const parts = normalized.split('/');
  return parts.length > 2 && PLUGIN_FOLDER_RE.test(parts.slice(0, 2).join('/'));
}

/** The ownership map for the updater, the same as ownedPaths and userPaths in urd.json; a pattern is an exact path or `prefix/**`. */
export const OWNED_PATTERNS = [
  'index.html',
  '404.html',
  'urd.json',
  '_headers',
  'speculation-rules.json',
  'dev-server.py',
  'README.md',
  'URD-LICENSE.md',
  'readme/**',
  'admin/**',
  'assets/engine/**',
  'assets/urd/**',
  'assets/styles/base.css',
  'functions/**',
];
export const USER_PATTERNS = ['content/**', 'media/**', 'plugins/**', 'sitemap.xml', 'robots.txt', '_redirects'];

/** @param {string} pattern Exact path or `prefix/**` */
export function matchesPattern(pattern, path) {
  if (pattern.endsWith('/**')) return path.startsWith(pattern.slice(0, -2));
  return path === pattern;
}

/** Urd-owned path (the updater's domain; publishing rejects all of these). */
export function isOwnedPath(path) {
  const normalized = normalizePath(path);
  return normalized !== null && OWNED_PATTERNS.some((p) => matchesPattern(p, normalized));
}

/** User-owned path (content/media/plugins; the updater never touches these). */
export function isUserPath(path) {
  const normalized = normalizePath(path);
  return normalized !== null && USER_PATTERNS.some((p) => matchesPattern(p, normalized));
}

/**
 * Page-routing copy (`<slug>/index.html`): written by publishing, and refreshed by the updater in the same commit as an engine swap (ADR-0013).
 */
export function isPageIndexCopy(path) {
  const normalized = normalizePath(path);
  return normalized !== null
    && PAGE_INDEX_RE.test(normalized)
    && !RESERVED_SLUGS.includes(normalized.split('/')[0]);
}

/**
 * Checks that a GitHub username is in ALLOWED_LOGINS (a comma-separated environment variable).
 * Enforced in ALL mutating endpoints (defence in depth).
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
