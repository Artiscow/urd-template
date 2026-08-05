/**
 * Ren OSM-logikk for kart-pluginen (ingen DOM): tolke en posisjon eieren
 * limer inn (koordinater eller en OpenStreetMap-lenke), bygge innbyggings-URL
 * og «større kart»-lenke. Alt her enhetstestes i node.
 *
 * Personvern: kartet bygges inn som en ren OSM-iframe (ingen sporing, ingen
 * tredjeparts-tiles), så eieren trenger kun å åpne frame-src for openstreetmap.org.
 */

const clampLat = (n) => Math.max(-85, Math.min(85, n));
const clampLon = (n) => Math.max(-180, Math.min(180, n));
const clampZoom = (n) => Math.max(1, Math.min(19, Math.round(n)));

/**
 * Tolker eierens posisjonsinnskriving:
 *   - «59.913, 10.739» (breddegrad, lengdegrad)
 *   - en OSM-lenke: .../#map=15/59.913/10.739  eller  ...?mlat=59.913&mlon=10.739
 * @param {string} input
 * @returns {{ lat: number, lon: number, zoom: number|null }|null}
 */
export function parseLocation(input) {
  const raw = String(input ?? '').trim();
  if (!raw) return null;

  // Zoom hentes fra #map=zoom/lat/lon når lenken har det.
  const mapHash = /#map=(\d+)\/(-?\d+(?:\.\d+)?)\/(-?\d+(?:\.\d+)?)/.exec(raw);
  const zoom = mapHash ? clampZoom(+mapHash[1]) : null;

  // Punktet: markøren (mlat/mlon) foretrekkes, ellers #map-sentrum.
  const mlat = /[?&]mlat=(-?\d+(?:\.\d+)?)/.exec(raw);
  const mlon = /[?&]mlon=(-?\d+(?:\.\d+)?)/.exec(raw);
  if (mlat && mlon) {
    return { lat: clampLat(+mlat[1]), lon: clampLon(+mlon[1]), zoom };
  }
  if (mapHash) {
    return { lat: clampLat(+mapHash[2]), lon: clampLon(+mapHash[3]), zoom };
  }
  // Rene koordinater «lat, lon» (komma eller mellomrom)
  const pair = /^(-?\d+(?:\.\d+)?)\s*[,\s]\s*(-?\d+(?:\.\d+)?)$/.exec(raw);
  if (pair) {
    return { lat: clampLat(+pair[1]), lon: clampLon(+pair[2]), zoom: null };
  }
  return null;
}

/** Grovt gradspenn rundt sentrum ut fra zoom (til iframe-ens bbox). */
function span(zoom) {
  // Dobles per zoom-nivå nedover; verdien er valgt så et typisk bynivå (15) gir et par kvartaler.
  return 360 / 2 ** clampZoom(zoom);
}

/**
 * Innbyggings-URL til OpenStreetMaps offisielle iframe (export/embed.html).
 * Bygger en bbox rundt sentrum og setter en markør i punktet.
 * @param {{ lat: number, lon: number, zoom?: number }} loc
 * @returns {string}
 */
export function buildEmbedUrl({ lat, lon, zoom = 15 }) {
  const la = clampLat(lat);
  const lo = clampLon(lon);
  const d = span(zoom);
  // Breddegrader komprimeres mot polene; juster bbox-høyden med cos(lat).
  const latPad = d * Math.max(0.2, Math.cos((la * Math.PI) / 180));
  const bbox = [clampLon(lo - d), clampLat(la - latPad), clampLon(lo + d), clampLat(la + latPad)];
  const params = new URLSearchParams({
    bbox: bbox.map((n) => n.toFixed(5)).join(','),
    layer: 'mapnik',
    marker: `${la.toFixed(5)},${lo.toFixed(5)}`,
  });
  return `https://www.openstreetmap.org/export/embed.html?${params.toString()}`;
}

/** «Vis større kart»-lenke til openstreetmap.org for punktet. */
export function buildLargerMapUrl({ lat, lon, zoom = 15 }) {
  const la = clampLat(lat).toFixed(5);
  const lo = clampLon(lon).toFixed(5);
  return `https://www.openstreetmap.org/?mlat=${la}&mlon=${lo}#map=${clampZoom(zoom)}/${la}/${lo}`;
}

/** Verten kart-pluginen trenger i frame-src (til CSP-instruksen). */
export const OSM_HOST = 'https://www.openstreetmap.org';
