/**
 * Core block: map. Privacy-friendly OpenStreetMap embedding: the owner
 * types an address (looked up through /api/geocode in admin), coordinates
 * or an OSM link, and the block embeds OSM's official iframe (no tracking,
 * no third-party tiles). The settings live in the Properties panel; the
 * help chip explains them (ADR-0008). Urd's own _headers allows the host;
 * on a host that blocks it the block says which frame-src line is missing.
 */
import { parseLocation, buildEmbedUrl, buildLargerMapUrl, OSM_HOST } from '../osm.js';
// Called only at render (t) and in preview after the admin dictionary has
// loaded (ta): never at module level.
import { t, ta, adminLocaleReady } from '../i18n.js';

const el2 = (tag, className, textContent) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (textContent != null) node.textContent = textContent;
  return node;
};

/**
 * Catches a CSP violation on the iframe (a host without OpenStreetMap in
 * frame-src) and replaces the broken iframe with something calm: the
 * missing line in the editor, a link that opens the map for visitors.
 * Urd's own _headers allows OSM, so this normally never fires.
 */
function watchCspBlock(host, frame, ctx, largerUrl) {
  // The blocked host is compared EXACTLY (a parsed URL), never as a
  // substring: a substring check would also match openstreetmap.org.example.com.
  const blockedHost = new URL(OSM_HOST).hostname;
  const onViolation = (event) => {
    let violatedHost = null;
    try { violatedHost = new URL(event.blockedURI).hostname; } catch { /* blockedURI can be "inline", "eval" and the like */ }
    if (!(event.violatedDirective?.startsWith('frame-src') && violatedHost === blockedHost)) return;
    document.removeEventListener('securitypolicyviolation', onViolation);
    frame.remove();
    const note = el2('div', 'urd-map-empty');
    if (ctx.preview) {
      adminLocaleReady.then(() => {
        note.append(
          el2('strong', null, ta('canvas.mapCspBlocked')),
          el2('p', 'urd-map-note', ta('canvas.mapCspFix')),
          el2('code', 'urd-map-code', `frame-src ${OSM_HOST}`),
        );
      });
    } else {
      const a = el2('a', 'urd-map-fallback', t('map.openOsm'));
      a.href = largerUrl;
      a.target = '_blank';
      a.rel = 'noopener';
      note.append(a);
    }
    host.appendChild(note);
  };
  document.addEventListener('securitypolicyviolation', onViolation);
  setTimeout(() => document.removeEventListener('securitypolicyviolation', onViolation), 4000);
}

export const mapBlock = {
  version: 1,
  // Natural height in the mobile row grid (the iframe's height is the block's own).
  autoGrow: true,
  label: 'Map',
  labelKey: 'blocks.map',
  defaults: () => ({ location: '', zoom: 15, height: 320 }),
  migrations: {},
  /**
   * @param {HTMLElement} el
   * @param {{location?: string, lat?: number, lon?: number, zoom?: number, height?: number}} props
   *   `lat`/`lon` are written by the address search in admin; `location` is
   *   parsed at render when they are missing (coordinates or an OSM link).
   * @param {object} ctx Render context
   */
  render(el, props, ctx) {
    const host = el2('div', 'urd-map');
    el.appendChild(host);

    const loc = (Number.isFinite(props.lat) && Number.isFinite(props.lon))
      ? { lat: props.lat, lon: props.lon, zoom: props.zoom }
      : parseLocation(props.location);
    if (loc) {
      const zoom = props.zoom ?? loc.zoom ?? 15;
      const largerUrl = buildLargerMapUrl({ lat: loc.lat, lon: loc.lon, zoom });
      const frame = el2('iframe', 'urd-map-frame');
      frame.src = buildEmbedUrl({ lat: loc.lat, lon: loc.lon, zoom });
      frame.style.height = `${props.height ?? 320}px`;
      frame.loading = 'lazy';
      frame.title = t('map.mapTitle');
      frame.setAttribute('referrerpolicy', 'no-referrer');
      host.appendChild(frame);
      watchCspBlock(host, frame, ctx, largerUrl);

      const link = el2('div', 'urd-map-link');
      const a = el2('a', null, t('map.larger'));
      a.href = largerUrl;
      a.target = '_blank';
      a.rel = 'noopener';
      link.appendChild(a);
      host.appendChild(link);
    } else if (ctx.preview) {
      // Without a place: a quiet placeholder in the editor; visitors see nothing.
      const empty = el2('div', 'urd-map-empty');
      adminLocaleReady.then(() => {
        if (empty.isConnected) empty.textContent = ta('canvas.mapEmpty');
      });
      host.appendChild(empty);
    }

    if (ctx.preview && ctx.viewport !== 'mobile') {
      // Help chip (ADR-0008): the three ways to give a place, and the CSP line.
      Promise.all([import('../hint.js'), adminLocaleReady]).then(([{ attachHint }]) => {
        if (!el.isConnected || el.querySelector('.urd-hint-chip')) return;
        attachHint(el, {
          title: ta('hintMap.title'),
          lines: [ta('hintMap.l1'), ta('hintMap.l2'), ta('hintMap.l3'), ta('hintMap.l4'), ta('hintMap.l5')],
        });
      });
    }
  },
};
