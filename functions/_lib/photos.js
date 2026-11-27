/**
 * Shared guards for the picture routes (/api/photos, /api/photo): the id, host and token shapes, the owner's host allowlist (PHOTO_HOSTS) and the size caps.
 */

/**
 * The most pictures one folder call may answer with: the pool the layers cut their own count from, and draw from at random.
 */
export const MAX_PHOTOS = 200;

/** What a listing may be sorted by; the random draw happens in the browser. */
export const SORTS = ['name', 'newest'];

/** The sort asked for, with the name order for anything unknown. */
export function photoSort(value) {
  return SORTS.includes(value) ? value : 'name';
}

/** Natural name order, so 'bilde 2' comes before 'bilde 10'. */
export const byName = (a, b) => String(a.name ?? '').localeCompare(String(b.name ?? ''), undefined, { numeric: true, sensitivity: 'base' });

/** The largest picture the byte route will pass through. */
export const MAX_IMAGE_BYTES = 12_000_000;

/** The largest folder listing or album page the list route will read. */
export const MAX_LIST_BYTES = 4_000_000;

/** The width the pictures are asked for, so an original is never proxied raw. */
export const IMAGE_WIDTHS = [480, 800, 1200, 1600, 2000];

/** Google file, folder and album ids. */
export const GOOGLE_ID = /^[A-Za-z0-9_-]{10,256}$/;

/** A short album link's code, marked with the s: prefix by the parser. */
export const SHORT_CODE = /^s:[A-Za-z0-9_-]{6,128}$/;

/** A Nextcloud or ownCloud public share token. */
export const SHARE_TOKEN = /^[A-Za-z0-9]{8,64}$/;

/** A public hostname: dotted, never an address literal. */
export const PUBLIC_HOST = /^(?!\d+(?:\.\d+)*$)[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+$/;

/** A file name inside a public share: one segment, never a dot segment. */
export const SHARE_FILE = /^(?!\.{1,2}$)[^/\\?#]{1,200}$/;

/**
 * The picture types the byte route passes on: raster only.
 * SVG is a document that can carry script, and it would run on this site's own origin.
 */
export const RASTER_TYPE = /^image\/(jpeg|png|webp|gif|avif)\s*(?:;|$)/i;

/** Google's own picture host, which needs no allowlist entry. */
export const GOOGLE_PHOTO_HOST = 'lh3.googleusercontent.com';

export const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });

/** The hosts the owner has allowed, lower-cased. */
export function allowedHosts(env) {
  return new Set(String(env?.PHOTO_HOSTS ?? '')
    .split(',').map((host) => host.trim().toLowerCase()).filter(Boolean));
}

/** Whether a host may be reached: on the owner's allowlist, or one of the hosts the route itself chose (`extra`). */
export function hostAllowed(env, host, extra = []) {
  const name = String(host ?? '').toLowerCase();
  return extra.includes(name) || allowedHosts(env).has(name);
}

/** The picture width to ask upstream for, snapped to the ladder; an absent width means the full one. */
export function imageWidth(value) {
  if (value === undefined || value === null || value === '') return 1600;
  const n = Number(value);
  if (!Number.isFinite(n)) return 1600;
  return IMAGE_WIDTHS.reduce((best, w) => (Math.abs(w - n) < Math.abs(best - n) ? w : best), IMAGE_WIDTHS[0]);
}

/** How many pictures to answer with, inside the cap. */
export function photoLimit(value) {
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) return 24;
  return Math.min(MAX_PHOTOS, Math.max(1, Math.round(n)));
}

/**
 * An https URL on an allowed host, or null: on one of the `only` hosts when given, otherwise on the owner's allowlist.
 * @param {unknown} raw
 * @param {object} env
 * @param {string[]} [only]
 * @returns {URL|null}
 */
export function safeTarget(raw, env, only) {
  let url;
  try {
    url = new URL(String(raw));
  } catch {
    return null;
  }
  if (url.protocol !== 'https:' || url.username || url.password || url.port) return null;
  const host = url.hostname.toLowerCase();
  if (!PUBLIC_HOST.test(host)) return null;
  if (only ? !only.includes(host) : !hostAllowed(env, host)) return null;
  return url;
}

/**
 * Whether a call comes from the site's own pages: by its fetch metadata (same-origin, a picture as an image or a fetch), or else by its Origin or Referer.
 * @param {Request} request
 * @param {{image?: boolean}} [options] `image`: the route answers pictures
 * @returns {boolean}
 */
function fromOwnPages(request, { image = false } = {}) {
  const site = request.headers.get('sec-fetch-site');
  if (site) {
    const dest = request.headers.get('sec-fetch-dest');
    return site === 'same-origin' && (!image || !dest || dest === 'image' || dest === 'empty');
  }
  const from = request.headers.get('origin') ?? request.headers.get('referer');
  try {
    return Boolean(from) && new URL(from).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}

/**
 * The refusal for a call that does not come from the site's own pages (fromOwnPages), or null.
 * @param {Request} request
 * @param {{image?: boolean}} [options]
 * @returns {Response|null}
 */
export function refuseCrossSite(request, options = {}) {
  return fromOwnPages(request, options) ? null : json({ error: 'The picture routes answer this site only', code: 'photoCrossSite' }, 403);
}

/**
 * Reads a response body with a byte cap, without buffering it first.
 * @param {Response} res
 * @param {number} max
 * @returns {Promise<string|null>} null when the cap is passed
 */
export async function readCapped(res, max) {
  const declared = Number(res.headers.get('content-length'));
  if (Number.isFinite(declared) && declared > max) return null;
  const reader = res.body?.getReader();
  const decoder = new TextDecoder('utf-8');
  let text = '';
  let bytes = 0;
  while (reader) {
    const { done, value } = await reader.read();
    if (done) break;
    bytes += value.byteLength;
    if (bytes > max) {
      await reader.cancel();
      return null;
    }
    text += decoder.decode(value, { stream: true });
  }
  return text + decoder.decode();
}

/**
 * The answer from the platform's edge cache when it holds one, otherwise built and kept there when it is a 200 with an s-maxage, under the address alone.
 * @param {{request: Request, waitUntil?: (p: Promise<unknown>) => void}} context
 * @param {() => Promise<Response>} build
 * @returns {Promise<Response>}
 */
export async function edgeCached(context, build) {
  const cache = globalThis.caches?.default;
  if (!cache) return build();
  const key = new Request(context.request.url, { method: 'GET' });
  try {
    const hit = await cache.match(key);
    if (hit) return hit;
  } catch { /* a cache that cannot be read is no cache */ }
  const res = await build();
  if (res.status === 200 && /s-maxage=/.test(res.headers.get('cache-control') ?? '')) {
    try {
      context.waitUntil?.(cache.put(key, res.clone()).catch(() => {}));
    } catch { /* the answer goes out whether or not it could be kept */ }
  }
  return res;
}

/** Thrown when a redirect leads somewhere the route may not follow. */
export class RedirectRefused extends Error {}

/** How many redirects one call follows. */
const MAX_REDIRECTS = 4;

/** How long a body may take once the headers are in. */
const BODY_MS = 20000;

/**
 * One fetch with deadlines for the headers and the body; a redirect is followed by hand, only to plain https on its own host or one `allow` accepts.
 * @param {string|URL} target
 * @param {RequestInit} [init]
 * @param {number} [ms] The deadline for the headers
 * @param {(host: string) => boolean} [allow] Hosts a redirect may lead to, besides its own
 * @returns {Promise<Response>}
 */
export async function fetchWithTimeout(target, init = {}, ms = 8000, allow) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  let url = new URL(String(target));
  let headers = init.headers ?? {};
  try {
    for (let hop = 0; ; hop += 1) {
      const res = await fetch(url, { ...init, headers, signal: controller.signal, redirect: 'manual' });
      if (res.status < 300 || res.status >= 400 || res.status === 304) {
        const bodyTimer = setTimeout(() => controller.abort(), BODY_MS);
        bodyTimer.unref?.();
        return res;
      }
      const location = res.headers.get('location');
      if (!location || hop >= MAX_REDIRECTS) throw new RedirectRefused('redirect');
      const next = new URL(location, url);
      const host = next.hostname.toLowerCase();
      const same = host === url.hostname.toLowerCase();
      if (next.protocol !== 'https:' || next.username || next.password || next.port
        || !PUBLIC_HOST.test(host) || !(same || allow?.(host))) {
        throw new RedirectRefused('redirect');
      }
      if (!same) {
        headers = Object.fromEntries(Object.entries(headers).filter(([name]) => name.toLowerCase() !== 'authorization'));
      }
      url = next;
    }
  } finally {
    clearTimeout(timer);
  }
}
