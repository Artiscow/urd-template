/**
 * Adressesøk for kart-pluginen: gjør en vanlig adresse om til koordinater
 * via OpenStreetMaps geokoder (Nominatim). Går gjennom sidens egen funksjon
 * (samme origin), så nettleseren trenger ingen connect-src-utvidelse, og vi
 * kan sette en identifiserende User-Agent slik Nominatims bruksvilkår krever.
 *
 * Brukes kun i editoren (når eieren klikker «Bruk»), ikke ved hver sidelasting:
 * koordinatene lagres i blokken, så besøkende laster kartet direkte fra OSM.
 */

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json',
      // Delt cache i en time: samme adresse slår ikke opp på nytt.
      'cache-control': status === 200 ? 'public, max-age=300, s-maxage=3600' : 'no-store',
    },
  });

export async function onRequestGet({ request }) {
  const q = (new URL(request.url).searchParams.get('q') ?? '').trim();
  if (q.length < 3) return json({ error: 'Skriv en adresse eller et sted', code: 'queryTooShort' }, 400);

  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&addressdetails=0&q=${encodeURIComponent(q)}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  let upstream;
  try {
    upstream = await fetch(url, {
      signal: controller.signal,
      headers: {
        // Nominatim krever en identifiserende User-Agent.
        'User-Agent': 'Urd-nettsidebygger kart-plugin (https://urd.dev)',
        'Accept-Language': 'nb,no,en',
      },
    });
  } catch {
    clearTimeout(timer);
    return json({ error: 'Fikk ikke kontakt med adressesøket', code: 'geocodeUnreachable' }, 502);
  }
  clearTimeout(timer);
  if (!upstream.ok) return json({ error: `Adressesøket svarte ${upstream.status}`, code: 'geocodeUpstreamStatus', status: upstream.status }, 502);

  let data = null;
  try {
    data = await upstream.json();
  } catch {
    return json({ error: 'Uventet svar fra adressesøket', code: 'geocodeUnexpected' }, 502);
  }
  const hit = Array.isArray(data) ? data[0] : null;
  const lat = Number(hit?.lat);
  const lon = Number(hit?.lon);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return json({ error: 'Fant ikke stedet. Prøv en mer nøyaktig adresse.', code: 'placeNotFound' }, 404);
  }
  return json({ lat, lon, label: hit.display_name ?? q });
}
