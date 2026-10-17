/**
 * One picture from a shared folder, served from this site's own origin.
 *
 * The bytes go through here rather than straight from the folder host for
 * three reasons: the site's CSP allows `img-src 'self' data:` and stays
 * untouched, an API key or a share token never reaches the browser, and
 * Google says plainly that hotlinking a Drive picture may stop working
 * without warning, so the address it is fetched from is ours to change.
 *
 * Only the routes /api/photos built are answered: every address is checked
 * against the same host rules again here, so a folder listing can never point
 * this route at something new.
 */
import {
  json, imageWidth, hostAllowed, safeTarget, fetchWithTimeout, refuseCrossSite, edgeCached, RedirectRefused,
  MAX_IMAGE_BYTES, GOOGLE_ID, SHARE_TOKEN, SHARE_FILE, PUBLIC_HOST, GOOGLE_PHOTO_HOST, RASTER_TYPE,
} from '../_lib/photos.js';

/** Where the bytes are fetched from, or a Response saying why not. */
function upstreamFor(q, env) {
  const provider = q.get('p') ?? '';
  const width = imageWidth(q.get('w'));

  if (provider === 'drive') {
    const id = q.get('id') ?? '';
    if (!GOOGLE_ID.test(id)) return json({ error: 'Invalid picture address', code: 'photoBadAddress' }, 400);
    // The sized variant, so an original of many megabytes is never proxied
    // raw. Google's picture host is the one that resizes: a Nextcloud share
    // and a listed address answer with the file as it is stored.
    return { url: `https://${GOOGLE_PHOTO_HOST}/d/${id}=w${width}` };
  }

  if (provider === 'g') {
    const base = safeTarget(q.get('u'), env, [GOOGLE_PHOTO_HOST]);
    if (!base) return json({ error: 'Invalid picture address', code: 'photoBadAddress' }, 400);
    return { url: `${base.origin}${base.pathname}=w${width}` };
  }

  if (provider === 'nextcloud') {
    const host = String(q.get('host') ?? '').toLowerCase();
    const token = q.get('id') ?? '';
    const file = q.get('file') ?? '';
    if (!PUBLIC_HOST.test(host) || !SHARE_TOKEN.test(token) || !SHARE_FILE.test(file)) {
      return json({ error: 'Invalid picture address', code: 'photoBadAddress' }, 400);
    }
    if (!hostAllowed(env, host)) {
      return json({ error: `The picture host «${host}» is not allowed`, code: 'photoHostNotAllowed', host }, 403);
    }
    return {
      url: `https://${host}/public.php/webdav/${encodeURIComponent(file)}`,
      init: { headers: { authorization: `Basic ${btoa(`${token}:`)}` } },
    };
  }

  if (provider === 'u') {
    const target = safeTarget(q.get('u'), env);
    if (!target) return json({ error: 'The picture host is not allowed', code: 'photoHostNotAllowed' }, 403);
    return { url: target.href };
  }

  return json({ error: 'Unknown picture source', code: 'photoBadAddress' }, 400);
}

/** Counts the bytes on their way through and cuts the stream at the cap. */
function capped(body, max) {
  let seen = 0;
  return body.pipeThrough(new TransformStream({
    transform(chunk, controller) {
      seen += chunk.byteLength;
      if (seen > max) controller.error(new Error('too large'));
      else controller.enqueue(chunk);
    },
  }));
}

export async function onRequestGet(context) {
  const { request, env } = context;
  const refused = refuseCrossSite(request);
  if (refused) return refused;
  return edgeCached(context, () => picture(new URL(request.url).searchParams, env));
}

/** The picture itself, or the reason it could not be had. */
async function picture(q, env) {
  const plan = upstreamFor(q, env);
  if (plan instanceof Response) return plan;

  let res;
  try {
    // A redirect may stay on the host that was asked, or go to Google's
    // picture host or the allowlist; anywhere else is refused before the
    // request goes out.
    res = await fetchWithTimeout(plan.url, { ...(plan.init ?? {}), headers: { accept: 'image/*', ...(plan.init?.headers ?? {}) } }, 12000,
      (host) => hostAllowed(env, host, [GOOGLE_PHOTO_HOST]));
  } catch (err) {
    if (err instanceof RedirectRefused) {
      return json({ error: 'The picture source redirected to a host that is not allowed', code: 'photoRedirectBlocked' }, 502);
    }
    return json({ error: 'Could not reach the picture', code: 'photoUnreachable' }, 502);
  }
  if (!res.ok) return json({ error: `The picture source answered ${res.status}`, code: 'photoUpstreamStatus', status: res.status }, 502);

  // Raster pictures only, and the type is written out from the allowlist
  // rather than echoed.
  const raster = RASTER_TYPE.exec(res.headers.get('content-type') ?? '');
  if (!raster) return json({ error: 'The address did not answer with a picture', code: 'photoNotImage' }, 502);

  const declared = Number(res.headers.get('content-length'));
  if (Number.isFinite(declared) && declared > MAX_IMAGE_BYTES) {
    return json({ error: 'The picture is too large', code: 'photoTooLarge' }, 502);
  }

  return new Response(res.body ? capped(res.body, MAX_IMAGE_BYTES) : null, {
    status: 200,
    headers: {
      'content-type': `image/${raster[1].toLowerCase()}`,
      // An hour in the visitor's cache and a day at the edge (edgeCached), so
      // the folder host is left alone meanwhile.
      'cache-control': 'public, max-age=3600, s-maxage=86400',
      'x-content-type-options': 'nosniff',
      // The answer is a picture and nothing else: opened as a document it
      // runs nothing, and no other site may embed it.
      'content-security-policy': "default-src 'none'; sandbox",
      'cross-origin-resource-policy': 'same-origin',
    },
  });
}
