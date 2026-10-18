/**
 * Pictures from a shared folder somewhere else: parsing the address the owner
 * pastes, and building the calls to the site's own proxy.
 *
 * Fetching ALWAYS goes through the site's own routes (/api/photos for the
 * list, /api/photo for the bytes), the calendar block's model: the folder
 * hosts send no CORS, the site's CSP allows `connect-src 'self'` only, and an
 * API key must never reach the browser. Serving the pictures from the site's
 * own origin also keeps `img-src 'self' data:` untouched, so a deployed site
 * needs no CSP change to use this.
 *
 * The parsing is pure and node-tested (tests/photo-source.test.mjs). Hosts are
 * compared exactly against a parsed URL, never with a substring test, and every
 * id is matched with an anchored regex.
 */

/** The folder kinds an address can resolve to. */
export const PHOTO_PROVIDERS = ['drive', 'gphotos', 'nextcloud', 'json'];

/** How many pictures are shown from a folder. */
export const FOLDER_MAX = { min: 1, max: 60, dflt: 24 };

/**
 * How many pictures the folder is asked for, whatever is shown: the pool a
 * random draw and a newest-first cut are taken from. One size for everyone,
 * so the edge cache holds one answer per folder rather than one per setting.
 */
export const FOLDER_POOL = 200;

/**
 * Which pictures are shown: the first by name, the newest first, or a fresh
 * random draw on every visit. `name` and `newest` are sorted by the proxy;
 * `random` is drawn here, with one seed per page load, so the proxy's answer
 * stays cacheable and the set does not reshuffle on every re-render.
 */
export const FOLDER_ORDERS = ['name', 'newest', 'random'];

/**
 * The widths the byte route serves, the same ladder as functions/_lib/photos.js
 * (a test holds the two equal). A layer asks for the step its use needs: a
 * full-width background the width of the window, a small floating frame the
 * width of that frame, so a hero is never a blur and a thumbnail never a
 * download of two thousand pixels.
 */
export const PHOTO_WIDTHS = [480, 800, 1200, 1600, 2000];

/** Google's own ids: file and folder ids, and the share codes. */
const GOOGLE_ID = /^[A-Za-z0-9_-]{10,128}$/;
/** A public hostname: dotted, no address literal, no port, no sign-in. */
const PUBLIC_HOST = /^(?!\d+(?:\.\d+)*$)[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+$/;

/** The number of pictures to take, inside its bounds. */
export function clampFolderMax(max) {
  const n = Number(max);
  if (!Number.isFinite(n) || n <= 0) return FOLDER_MAX.dflt;
  return Math.min(FOLDER_MAX.max, Math.max(FOLDER_MAX.min, Math.round(n)));
}

/**
 * What the pasted address points at, or null when nothing recognisable does.
 *
 * Recognised: a Google Drive folder (the sharing link or the bare id), a
 * Google Photos shared album (the full link and the short one), a Nextcloud or
 * ownCloud public share, and any https address ending in .json that answers
 * with a list of pictures.
 *
 * @param {unknown} address
 * @returns {{provider: string, id?: string, host?: string, url?: string}|null}
 */
export function parsePhotoSource(address) {
  const raw = typeof address === 'string' ? address.trim() : '';
  if (!raw) return null;
  // A folder id pasted on its own, which is what the Drive interface offers.
  if (GOOGLE_ID.test(raw) && !raw.includes('.')) return { provider: 'drive', id: raw };

  let url;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }
  if (url.protocol !== 'https:' || url.username || url.password || url.port) return null;
  const host = url.hostname.toLowerCase();

  if (host === 'drive.google.com') {
    const folder = /^\/drive\/(?:u\/\d+\/)?folders\/([A-Za-z0-9_-]{10,128})\/?$/.exec(url.pathname);
    if (folder) return { provider: 'drive', id: folder[1] };
    const open = url.searchParams.get('id') ?? '';
    if (GOOGLE_ID.test(open)) return { provider: 'drive', id: open };
    return null;
  }

  if (host === 'photos.google.com') {
    const share = /^\/share\/([A-Za-z0-9_-]{10,256})\/?$/.exec(url.pathname);
    // The album key rides along in the link and is part of the address.
    const key = url.searchParams.get('key') ?? '';
    if (share) return { provider: 'gphotos', id: share[1], ...(GOOGLE_ID.test(key) ? { host: key } : {}) };
    return null;
  }

  if (host === 'photos.app.goo.gl') {
    const code = /^\/([A-Za-z0-9_-]{6,128})\/?$/.exec(url.pathname);
    // The short link is followed by the proxy, which lands on the album page.
    if (code) return { provider: 'gphotos', id: `s:${code[1]}` };
    return null;
  }

  const share = /^(?:\/index\.php)?\/s\/([A-Za-z0-9]{8,64})\/?$/.exec(url.pathname);
  if (share && PUBLIC_HOST.test(host)) return { provider: 'nextcloud', id: share[1], host };

  if (/\.json$/i.test(url.pathname) && PUBLIC_HOST.test(host)) return { provider: 'json', url: url.href };

  return null;
}

/** The order, with the first-by-name for anything unknown. */
export function folderOrder(order) {
  return FOLDER_ORDERS.includes(order) ? order : 'name';
}

/** What the proxy is asked to sort by: the random draw takes the name order as its pool. */
const proxySort = (order) => (folderOrder(order) === 'newest' ? 'newest' : 'name');

/**
 * The call to the site's own list route for a parsed address.
 * @param {{provider: string, id?: string, host?: string, url?: string}|null} source
 * @param {unknown} [order]
 * @returns {string|null}
 */
export function photosApiUrl(source, order) {
  if (!source || !PHOTO_PROVIDERS.includes(source.provider)) return null;
  const q = new URLSearchParams({ p: source.provider, sort: proxySort(order), max: String(FOLDER_POOL) });
  if (source.id) q.set('id', source.id);
  if (source.host) q.set('host', source.host);
  if (source.url) q.set('url', source.url);
  return `/api/photos?${q.toString()}`;
}

/**
 * The pictures a folder answered with, in the layers' own image shape. The
 * proxy has already built each `src` as a path on this site, and anything else
 * is dropped rather than trusted.
 * @param {unknown} data The body from /api/photos
 * @param {unknown} [max]
 * @returns {Array<{src: string, name: string}>}
 */
export function folderPhotos(data, max = FOLDER_POOL) {
  const list = Array.isArray(data?.photos) ? data.photos : [];
  return list
    .filter((photo) => typeof photo?.src === 'string' && photo.src.startsWith('/api/photo?'))
    .slice(0, Math.max(1, Math.min(FOLDER_POOL, Number(max) || FOLDER_POOL)))
    .map((photo) => ({ src: photo.src, name: typeof photo.name === 'string' ? photo.name : '' }));
}

/* ---------- The order ---------- */

/** mulberry32: a small, well-mixed generator for one seed. */
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * A Fisher-Yates shuffle from a seed: the same seed gives the same order, so
 * a page keeps its draw across re-renders. Pure, returns a new list.
 * @template T
 * @param {T[]} list
 * @param {unknown} seed
 * @returns {T[]}
 */
export function seededShuffle(list, seed) {
  const out = [...list];
  const next = rng(Number(seed) || 0);
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(next() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * The pictures in the order asked for: as the proxy sorted them for `name`
 * and `newest`, a seeded draw for `random`. Pure.
 * @template T
 * @param {T[]} photos
 * @param {unknown} order
 * @param {unknown} seed
 * @returns {T[]}
 */
export function orderPhotos(photos, order, seed) {
  return folderOrder(order) === 'random' ? seededShuffle(photos, seed) : [...photos];
}

/**
 * One seed per page load, so the random draw and the random scatter hold
 * still while the page is open and come out new on the next visit. Shared
 * with the layer's layout, so the two are one throw.
 */
let visitSeed = 0;
export function seedForVisit() {
  if (!visitSeed) {
    visitSeed = typeof crypto !== 'undefined' && crypto.getRandomValues
      ? crypto.getRandomValues(new Uint32Array(1))[0] || 1
      : (Date.now() >>> 0) || 1;
  }
  return visitSeed;
}

/**
 * The ladder step for a picture drawn `cssPx` wide on a screen with `dpr`
 * device pixels per CSS pixel: the first step that is not smaller, so the
 * picture is never scaled up, capped at the top of the ladder.
 * @param {unknown} cssPx
 * @param {unknown} [dpr]
 * @returns {number}
 */
export function photoWidth(cssPx, dpr = 1) {
  const px = (Number(cssPx) || 0) * Math.min(3, Math.max(1, Number(dpr) || 1));
  return PHOTO_WIDTHS.find((w) => w >= px) ?? PHOTO_WIDTHS[PHOTO_WIDTHS.length - 1];
}

/**
 * A picture path that asks the byte route for a width. Only the site's own
 * route takes a width; an uploaded picture or a data URL is returned as it is.
 * @param {string} src
 * @param {number} width A step from PHOTO_WIDTHS
 * @returns {string}
 */
export function photoSrcAt(src, width) {
  if (typeof src !== 'string' || !src.startsWith('/api/photo?')) return src;
  const q = new URLSearchParams(src.slice('/api/photo?'.length));
  q.set('w', String(width));
  return `/api/photo?${q.toString()}`;
}

/* ---------- Fetching (the proxy plus a short-lived cache) ---------- */

/**
 * The preview re-renders on every draft message, so the answer is kept: a
 * folder that answered for ten minutes, a folder that could not be read for
 * half a minute (long enough that a slider does not fire a call per tick,
 * short enough that a share the owner just opened is seen soon). A call that
 * is still out is kept too, so a render while it is pending joins it rather
 * than starting another.
 */
const CACHE_TTL = 10 * 60 * 1000;
const FAIL_TTL = 30 * 1000;
const memory = new Map();
const pending = new Map();

/**
 * The address a layer should read its pictures from, or '' when it holds its
 * own uploads. Pure.
 * @param {{source?: string, folder?: string}} props
 * @returns {string}
 */
export function folderAddress(props) {
  return props?.source === 'folder' && typeof props.folder === 'string' ? props.folder.trim() : '';
}

/**
 * What is already known about a folder, without going out for it. The preview
 * re-renders on every draft message, so a layer that had to wait for a promise
 * each time would flash its example pictures on every keystroke.
 * @param {string} address
 * @param {unknown} [max]
 * @returns {{photos: Array<{src: string, name: string}>, error: string|null, code: string|null}|null}
 */
export function peekFolderPhotos(address, order) {
  const api = photosApiUrl(parsePhotoSource(address), order);
  return api ? fresh(memory.get(api)) : null;
}

/** A kept answer that is still inside its time, or null. */
function fresh(hit) {
  if (!hit) return null;
  const ttl = hit.value.photos.length ? CACHE_TTL : FAIL_TTL;
  return Date.now() - hit.at < ttl ? hit.value : null;
}

/**
 * The pictures in a shared folder. Never throws: a folder that cannot be read
 * answers with an empty list and the reason, and the layer keeps its example
 * pictures. Without functions (local development) that is the quiet path too.
 * @param {string} address The address the owner pasted
 * @param {unknown} [order] name, newest or random (the last is drawn from the name pool)
 * @param {{force?: boolean}} [opts] `force` goes out again whatever is kept (the panel's Check button)
 * @returns {Promise<{photos: Array<{src: string, name: string}>, error: string|null, code: string|null}>}
 */
export function loadFolderPhotos(address, order, { force = false } = {}) {
  const api = photosApiUrl(parsePhotoSource(address), order);
  if (!api) return Promise.resolve({ photos: [], error: 'badAddress', code: 'photoFolderUnknown' });
  if (!force) {
    const kept = fresh(memory.get(api));
    if (kept) return Promise.resolve(kept);
    if (pending.has(api)) return pending.get(api);
  }
  const call = (async () => {
    let value;
    try {
      const res = await fetch(api);
      const data = await res.json().catch(() => null);
      value = res.ok
        ? { photos: folderPhotos(data), error: null, code: null }
        // The host and the status ride along: the translated messages name them.
        : { photos: [], error: data?.error ?? `status ${res.status}`, code: data?.code ?? 'photoFolderFailed', host: data?.host ?? '', status: data?.status ?? res.status };
    } catch {
      value = { photos: [], error: 'unreachable', code: 'photoFolderFailed' };
    }
    memory.set(api, { at: Date.now(), value });
    pending.delete(api);
    return value;
  })();
  pending.set(api, call);
  return call;
}

/* ---------- The layers' shared render shape ---------- */

/**
 * The pictures a layer should draw right now: the folder's, in the order
 * asked for and cut to `folderMax`, when it has answered; otherwise the
 * layer's own uploads.
 * @param {{source?: string, folder?: string, order?: string, folderMax?: unknown, images?: Array<object>}} props
 * @returns {Array<{src: string, x?: number, y?: number}>}
 */
export function picturesFor(props) {
  const address = folderAddress(props);
  const folder = address ? peekFolderPhotos(address, props.order) : null;
  // A folder that has not answered, or answered with nothing, leaves the
  // layer with its own uploads.
  if (!folder?.photos.length) return props.images ?? [];
  return orderPhotos(folder.photos, props.order, seedForVisit()).slice(0, clampFolderMax(props.folderMax));
}

/**
 * Draws a layer now from what is in hand, and again when its folder answers.
 * The proxy cannot answer in the same tick as render, and renderBackgroundLayers
 * appends the element after render returns, so the redraw waits for the
 * element to be connected and gives up quietly when it has been replaced.
 * @param {HTMLElement} el The layer element
 * @param {object} props
 * @param {(el: HTMLElement, props: object) => void} draw The layer's own drawing
 */
export function drawWithFolder(el, props, draw) {
  const address = folderAddress(props);
  if (address && !peekFolderPhotos(address, props.order)) {
    loadFolderPhotos(address, props.order).then((answer) => {
      if (!el.isConnected || !answer.photos.length) return;
      el.textContent = '';
      el.removeAttribute('style');
      el.className = 'urd-bg-layer';
      draw(el, props);
    });
  }
  draw(el, props);
}
