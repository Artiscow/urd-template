/**
 * GET /api/geocode: the map block's address lookup, which turns an address into coordinates through OpenStreetMap's Nominatim, for a signed-in publisher.
 */
import { requirePublisher } from '../_lib/auth.js';

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json',
      // Kept by the browser for an hour: the same address is not looked up again.
      'cache-control': status === 200 ? 'private, max-age=3600' : 'no-store',
    },
  });

export async function onRequestGet({ request, env }) {
  const auth = await requirePublisher(request, env);
  if (auth.response) return auth.response;
  const q = (new URL(request.url).searchParams.get('q') ?? '').trim();
  if (q.length < 3) return json({ error: 'Enter an address or a place', code: 'queryTooShort' }, 400);

  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&addressdetails=0&q=${encodeURIComponent(q)}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  let upstream;
  try {
    upstream = await fetch(url, {
      signal: controller.signal,
      headers: {
        // Nominatim requires an identifying User-Agent.
        'User-Agent': 'Urd site builder map block (https://urd.dev)',
        'Accept-Language': 'nb,no,en',
      },
    });
  } catch {
    clearTimeout(timer);
    return json({ error: 'Could not reach the address lookup', code: 'geocodeUnreachable' }, 502);
  }
  clearTimeout(timer);
  if (!upstream.ok) return json({ error: `The address lookup responded ${upstream.status}`, code: 'geocodeUpstreamStatus', status: upstream.status }, 502);

  let data = null;
  try {
    data = await upstream.json();
  } catch {
    return json({ error: 'Unexpected response from the address lookup', code: 'geocodeUnexpected' }, 502);
  }
  const hit = Array.isArray(data) ? data[0] : null;
  const lat = Number(hit?.lat);
  const lon = Number(hit?.lon);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return json({ error: 'Could not find the place. Try a more precise address.', code: 'placeNotFound' }, 404);
  }
  return json({ lat, lon, label: hit.display_name ?? q });
}
