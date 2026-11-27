/**
 * The link from a place written as text to a map: the map services a site can choose between (`site.mapService`) and the search each is given.
 * Notes: docs/engine-notes/map-links.md (Urd repository).
 */

/** The services in the order they are offered, the default first; the search is appended to `url`, and `names` keeps a venue's name in the search. */
const SERVICES = {
  osm: { url: 'https://www.openstreetmap.org/search?query=', names: false },
  duckduckgo: { url: 'https://duckduckgo.com/?iaxm=maps&q=', names: true },
  brave: { url: 'https://search.brave.com/maps?q=', names: true },
  here: { url: 'https://wego.here.com/search/', names: true },
  google: { url: 'https://www.google.com/maps/search/?api=1&query=', names: true },
  apple: { url: 'https://maps.apple.com/search?query=', names: true },
  norgeskart: { url: 'https://norgeskart.no/?sok=', names: false },
  finn: { url: 'https://kart.finn.no/?q=', names: true },
};

export const MAP_SERVICES = Object.keys(SERVICES);

/** The site's map service: the stored id when it is one of the services, else OpenStreetMap. */
export function mapService(site) {
  const id = site?.site?.mapService;
  return Object.hasOwn(SERVICES, id) ? id : 'osm';
}

const COUNTRY = /^(norge|noreg|norway|norga)$/i;

/**
 * What a service is asked for: the place as written where it knows venues, else without the venue's name before the address, and never the country for Norgeskart.
 */
export function mapQuery(place, service = 'osm') {
  let parts = String(place ?? '').split(',').map((part) => part.trim()).filter(Boolean);
  if (SERVICES[service]?.names) return parts.join(', ');
  const rest = parts.slice(1);
  if (parts.length > 1 && !/\d/.test(parts[0]) && rest.some((part) => /\d/.test(part))) parts = rest;
  if (service === 'norgeskart' && parts.length > 1 && COUNTRY.test(parts[parts.length - 1])) parts = parts.slice(0, -1);
  return parts.join(', ');
}

/** A point on the map, for the services with a documented address for one. Apple Maps keeps the place's words as the label. */
const POINTS = {
  osm: ({ lat, lon }) => `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=17/${lat}/${lon}`,
  google: ({ lat, lon }) => `https://www.google.com/maps/search/?api=1&query=${lat}%2C${lon}`,
  apple: ({ lat, lon }, place) => `https://maps.apple.com/?ll=${lat},${lon}&q=${encodeURIComponent(place || `${lat},${lon}`)}`,
};

const validPoint = (geo) => Number.isFinite(geo?.lat) && Number.isFinite(geo?.lon) && Math.abs(geo.lat) <= 90 && Math.abs(geo.lon) <= 180;

/**
 * The address that opens a place in a map service (OpenStreetMap when unknown), opening the point itself where the service and the place's `geo` allow.
 */
export function mapSearchUrl(place, service = 'osm', geo = null) {
  const id = Object.hasOwn(SERVICES, service) ? service : 'osm';
  const words = mapQuery(place, id);
  if (validPoint(geo)) {
    if (id === 'osm' || id === 'apple' || (id === 'google' && !words)) return POINTS[id](geo, words);
    if (!words) return POINTS.osm(geo);
  }
  return SERVICES[id].url + encodeURIComponent(words);
}
