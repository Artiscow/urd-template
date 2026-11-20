/**
 * The link from a place written as text («The hall, Storgata 1, 7011 Trondheim») to a map: the map services a site can choose between (`site.mapService`), and the search each of them is given.
 * A link only: nothing is loaded from a service until the visitor follows it.
 * Pure and DOM-free, loaded by the blocks that draw a place and bundled by the editor for the list of services.
 */

/** The services in the order they are offered, the default first. The search is appended to `url`, as a query value or, for HERE WeGo, as the last part of the path. `names` marks a service that knows venues by name, so the name is kept in its search. */
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
 * What a service is asked for.
 * A service with a register of venues gets the place as it is written.
 * One that knows addresses only gets it without a venue's name in front of its address («The hall, Storgata 1, 7011 Trondheim» is searched as «Storgata 1, 7011 Trondheim»); a place without a number in it is asked for as it is.
 * Norgeskart searches Norway alone and finds nothing with the country's name in the search.
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
 * The address that opens a place in a map service; an unknown service is OpenStreetMap.
 * With coordinates (`geo`, a feed's own point for the place) OpenStreetMap and Apple Maps open the point itself, which no search can miss; Google Maps keeps the search by words, where it knows the venue, and takes the point for a place without words.
 * A service without an address for a point searches by the words, and without words the point opens in OpenStreetMap.
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
