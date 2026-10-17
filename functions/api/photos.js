/**
 * The picture list from a shared folder: the background layers (image gallery
 * and floating photos) ask this route what a folder holds, and get back paths
 * on this site's own origin, never the folder host's.
 *
 * Four kinds of folder:
 * - drive: a publicly shared Google Drive folder, read with the Drive API and
 *   the owner's DRIVE_API_KEY (an API key reaches public folders only, which
 *   is exactly the access this needs).
 * - gphotos: a Google Photos shared album. The Library API no longer serves
 *   shared albums to a key, so the album's own public page is read and the
 *   picture addresses are taken from it.
 * - nextcloud: a public share on Nextcloud or ownCloud, listed over WebDAV
 *   with the share token as the user name (the way a public share works).
 * - json: any other address that answers with a list of pictures, for the
 *   services the four above do not cover.
 *
 * The last two reach hosts the owner names, so they require the host to be in
 * the PHOTO_HOSTS environment variable (the calendar's ICS_HOSTS model).
 */
import {
  json, photoLimit, photoSort, byName, hostAllowed, safeTarget, readCapped, fetchWithTimeout, refuseCrossSite, edgeCached, RedirectRefused,
  MAX_LIST_BYTES, GOOGLE_ID, SHORT_CODE, SHARE_TOKEN, PUBLIC_HOST,
} from '../_lib/photos.js';

const IMAGE_NAME = /\.(?:jpe?g|png|webp|gif|avif|heic)$/i;

/** The picture routes on this site, built here so the client never guesses one. */
const drivePhoto = (id) => `/api/photo?p=drive&id=${encodeURIComponent(id)}`;
const googlePhoto = (url) => `/api/photo?p=g&u=${encodeURIComponent(url)}`;
const sharePhoto = (host, token, file) =>
  `/api/photo?p=nextcloud&host=${encodeURIComponent(host)}&id=${encodeURIComponent(token)}&file=${encodeURIComponent(file)}`;
const plainPhoto = (url) => `/api/photo?p=u&u=${encodeURIComponent(url)}`;

/** The answer when a folder host redirects somewhere it may not. */
const redirectRefused = () =>
  json({ error: 'The folder host redirected to a host that is not allowed', code: 'photoRedirectBlocked' }, 502);

/**
 * A publicly shared Drive folder. Drive sorts for us: by natural name, or by
 * the time last modified with the newest first (Google advises modifiedTime
 * over createdTime for large folders).
 */
async function fromDrive(id, limit, sort, env) {
  if (!env.DRIVE_API_KEY) {
    return json({ error: 'Google Drive is not set up: the DRIVE_API_KEY environment variable is missing in the hosting setup', code: 'photoKeyMissing' }, 403);
  }
  const api = new URL('https://www.googleapis.com/drive/v3/files');
  api.searchParams.set('q', `'${id}' in parents and mimeType contains 'image/' and trashed = false`);
  api.searchParams.set('fields', 'files(id,name,imageMediaMetadata(width,height))');
  api.searchParams.set('orderBy', sort === 'newest' ? 'modifiedTime desc' : 'name_natural');
  api.searchParams.set('pageSize', String(limit));
  api.searchParams.set('key', env.DRIVE_API_KEY);
  let res;
  try {
    res = await fetchWithTimeout(api);
  } catch {
    return json({ error: 'Could not reach Google Drive', code: 'photoFolderUnreachable' }, 502);
  }
  const text = await readCapped(res, MAX_LIST_BYTES);
  if (text === null) return json({ error: 'The folder listing is too large', code: 'photoFolderTooLarge' }, 502);
  if (!res.ok) {
    return json({ error: `Google Drive answered ${res.status}. Check that the folder is shared with anyone who has the link`, code: 'photoFolderStatus', status: res.status }, 502);
  }
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    return json({ error: 'Google Drive answered with something other than a folder listing', code: 'photoFolderBadAnswer' }, 502);
  }
  const photos = (data.files ?? [])
    .filter((file) => GOOGLE_ID.test(String(file?.id ?? '')))
    .map((file) => ({
      src: drivePhoto(file.id),
      name: String(file.name ?? ''),
      w: Number(file.imageMediaMetadata?.width) || undefined,
      h: Number(file.imageMediaMetadata?.height) || undefined,
    }));
  return photos;
}

/** A Google Photos shared album, read from the album's own public page. */
async function fromGooglePhotos(id, key, limit) {
  const short = SHORT_CODE.test(id);
  // The album key is part of the address: without it the page is a sign-in.
  const target = short
    ? `https://photos.app.goo.gl/${id.slice(2)}`
    : `https://photos.google.com/share/${id}${key ? `?key=${encodeURIComponent(key)}` : ''}`;
  let res;
  try {
    res = await fetchWithTimeout(target, { headers: { accept: 'text/html' } }, 8000, (host) => host === 'photos.google.com');
  } catch (err) {
    if (err instanceof RedirectRefused) {
      return json({ error: 'The album link does not lead to a shared album', code: 'photoFolderBadAnswer' }, 502);
    }
    return json({ error: 'Could not reach the shared album', code: 'photoFolderUnreachable' }, 502);
  }
  // A short link lands on the album page; anywhere else and the album is gone.
  try {
    const landed = new URL(res.url).hostname.toLowerCase();
    if (landed !== 'photos.google.com') {
      return json({ error: 'The album link does not lead to a shared album', code: 'photoFolderBadAnswer' }, 502);
    }
  } catch { /* an unreadable final address is judged by the body below */ }
  if (!res.ok) return json({ error: `The shared album answered ${res.status}`, code: 'photoFolderStatus', status: res.status }, 502);
  const html = await readCapped(res, MAX_LIST_BYTES);
  if (html === null) return json({ error: 'The album page is too large', code: 'photoFolderTooLarge' }, 502);
  // The page carries every picture as a base address on Google's picture host.
  const found = new Set();
  for (const match of html.matchAll(/https:\/\/lh3\.googleusercontent\.com\/(?:pw|p)\/[A-Za-z0-9_-]{20,512}/g)) {
    found.add(match[0]);
    if (found.size > limit * 2) break;
  }
  // The album's cover is one of the same pictures, so the set already holds
  // each address once, in the order the page lists them.
  const photos = [...found].slice(0, limit).map((url) => ({ src: googlePhoto(url), name: '' }));
  return photos;
}

/**
 * A public share on Nextcloud or ownCloud, listed over WebDAV. The listing
 * comes with each file's last-modified time, so both orders are sorted here.
 */
async function fromNextcloud(host, token, limit, sort, env) {
  if (!hostAllowed(env, host)) {
    return json({ error: `The picture host «${host}» is not allowed. Add it to the PHOTO_HOSTS environment variable (comma-separated) in the hosting setup.`, code: 'photoHostNotAllowed', host }, 403);
  }
  const target = `https://${host}/public.php/webdav/`;
  let res;
  try {
    res = await fetchWithTimeout(target, {
      method: 'PROPFIND',
      headers: {
        depth: '1',
        authorization: `Basic ${btoa(`${token}:`)}`,
        'content-type': 'application/xml',
      },
      body: '<?xml version="1.0"?><d:propfind xmlns:d="DAV:"><d:prop><d:getlastmodified/></d:prop></d:propfind>',
    }, 8000, (next) => hostAllowed(env, next));
  } catch (err) {
    if (err instanceof RedirectRefused) return redirectRefused();
    return json({ error: 'Could not reach the shared folder', code: 'photoFolderUnreachable' }, 502);
  }
  if (!res.ok && res.status !== 207) {
    return json({ error: `The shared folder answered ${res.status}. Check that the share is open to anyone with the link`, code: 'photoFolderStatus', status: res.status }, 502);
  }
  const xml = await readCapped(res, MAX_LIST_BYTES);
  if (xml === null) return json({ error: 'The folder listing is too large', code: 'photoFolderTooLarge' }, 502);
  const found = [];
  // One <response> per file, each with its href and its last-modified time.
  // Split on the opening tag, so the cost stays linear whatever the listing holds.
  for (const block of xml.split(/<(?:[a-z0-9]+:)?response>/i).slice(1)) {
    const href = /<(?:[a-z0-9]+:)?href>([^<]+)</i.exec(block);
    if (!href) continue;
    let name;
    try {
      name = decodeURIComponent(href[1].split('/').filter(Boolean).pop() ?? '');
    } catch {
      continue;
    }
    if (!IMAGE_NAME.test(name)) continue;
    const modified = /<(?:[a-z0-9]+:)?getlastmodified>([^<]+)</i.exec(block);
    const time = modified ? Date.parse(modified[1]) : NaN;
    found.push({ src: sharePhoto(host, token, name), name, time: Number.isFinite(time) ? time : 0 });
  }
  found.sort(sort === 'newest' ? (a, b) => b.time - a.time || byName(a, b) : byName);
  return found.slice(0, limit).map(({ src, name }) => ({ src, name }));
}

/** Any other address that answers with a list of pictures. */
async function fromJson(raw, limit, env) {
  const target = safeTarget(raw, env);
  if (!target) {
    // The host is named when the address has one, so the message can say what to add.
    let host = '';
    try { host = new URL(String(raw)).hostname.toLowerCase(); } catch { host = ''; }
    return json({ error: `The picture list address is not allowed. Add its host${host ? ` «${host}»` : ''} to the PHOTO_HOSTS environment variable (comma-separated) in the hosting setup.`, code: 'photoHostNotAllowed', host }, 403);
  }
  let res;
  try {
    res = await fetchWithTimeout(target, { headers: { accept: 'application/json' } }, 8000, (next) => hostAllowed(env, next));
  } catch (err) {
    if (err instanceof RedirectRefused) return redirectRefused();
    return json({ error: 'Could not reach the picture list', code: 'photoFolderUnreachable' }, 502);
  }
  const text = await readCapped(res, MAX_LIST_BYTES);
  if (text === null) return json({ error: 'The picture list is too large', code: 'photoFolderTooLarge' }, 502);
  if (!res.ok) return json({ error: `The picture list answered ${res.status}`, code: 'photoFolderStatus', status: res.status }, 502);
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    return json({ error: 'The address did not answer with a picture list', code: 'photoFolderBadAnswer' }, 502);
  }
  // Both shapes are accepted: a bare list, and an object with `photos`.
  const list = Array.isArray(data) ? data : Array.isArray(data?.photos) ? data.photos : [];
  const photos = [];
  for (const item of list) {
    const url = typeof item === 'string' ? item : item?.src ?? item?.url;
    // Every picture host has to be allowed in its own right: the list itself
    // must not be able to point the byte route somewhere new.
    if (!safeTarget(url, env)) continue;
    photos.push({ src: plainPhoto(url), name: typeof item?.name === 'string' ? item.name : '' });
    if (photos.length >= limit) break;
  }
  return photos;
}

export async function onRequestGet(context) {
  const { request, env } = context;
  const refused = refuseCrossSite(request);
  if (refused) return refused;
  return edgeCached(context, () => listing(new URL(request.url).searchParams, env));
}

/** The folder's pictures as paths on this site, or the reason they could not be listed. */
async function listing(q, env) {
  const provider = q.get('p') ?? '';
  const id = q.get('id') ?? '';
  // `host` is the share host for Nextcloud and the album key for Google Photos.
  const host = String(q.get('host') ?? '').toLowerCase();
  const limit = photoLimit(q.get('max'));
  // The Google Photos page and a JSON list come in their own order; the
  // random draw is the browser's, from this pool.
  const sort = photoSort(q.get('sort'));

  let result;
  if (provider === 'drive') {
    if (!GOOGLE_ID.test(id)) return json({ error: 'Invalid folder address', code: 'photoFolderUnknown' }, 400);
    result = await fromDrive(id, limit, sort, env);
  } else if (provider === 'gphotos') {
    if (!GOOGLE_ID.test(id) && !SHORT_CODE.test(id)) return json({ error: 'Invalid album address', code: 'photoFolderUnknown' }, 400);
    const key = q.get('host') ?? '';
    result = await fromGooglePhotos(id, GOOGLE_ID.test(key) ? key : '', limit);
  } else if (provider === 'nextcloud') {
    if (!SHARE_TOKEN.test(id) || !PUBLIC_HOST.test(host)) return json({ error: 'Invalid share address', code: 'photoFolderUnknown' }, 400);
    result = await fromNextcloud(host, id, limit, sort, env);
  } else if (provider === 'json') {
    result = await fromJson(q.get('url'), limit, env);
  } else {
    return json({ error: 'Unknown picture source', code: 'photoFolderUnknown' }, 400);
  }

  // A provider answers either with the pictures or with the reason it could not.
  if (result instanceof Response) return result;
  if (!result.length) {
    return json({ error: 'The folder holds no pictures', code: 'photoFolderEmpty', photos: [] }, 200);
  }
  return new Response(JSON.stringify({ photos: result }), {
    status: 200,
    headers: {
      'content-type': 'application/json',
      // Five minutes at the edge (edgeCached): a busy page never hammers the folder host.
      'cache-control': 'public, max-age=60, s-maxage=300',
    },
  });
}
