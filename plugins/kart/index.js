/**
 * Kart-referansepluginen (v0.6 M4): personvennlig OpenStreetMap-innbygging.
 * Eieren limer inn koordinater eller en OSM-lenke; blokken bygger inn OSMs
 * offisielle iframe (ingen sporing, ingen tredjeparts-tiles). Følger kalender-
 * referansen: egen CSS via én style-tag og hjelpechip (ADR-0008). Innstillingene
 * rendres i Egenskaper-panelet via felt-kontrakten (`fields` på blokk-defen).
 *
 * CSP (ADR-0006): iframe mot openstreetmap.org krever frame-src-unntak.
 * Manifestet deklarerer det, Plugins-panelet viser eieren linjen, og blir
 * kartet blokkert av CSP viser blokken den nøyaktige _headers-linjen.
 */
import { parseLocation, buildEmbedUrl, buildLargerMapUrl, OSM_HOST } from './osm.js';
// Flerspråk (ADR-0012): t() for besøkende-tekster (site-språket), ta() for
// editor-chromen og seed (admin-språket). Ordboka (locales/) lastes av
// plugin-lasteren FØR register() - t/ta kalles aldri på modulnivå.
import { t, ta } from '/assets/urd/i18n.js';

const el2 = (tag, className, textContent) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (textContent != null) node.textContent = textContent;
  return node;
};

const post = (msg) => window.parent?.postMessage(msg, location.origin);

/* ---------- Tomtilstand og CSP-degradering ---------- */

function emptyState(host, ctx) {
  if (!ctx.preview) return;
  host.appendChild(el2('div', 'urd-kart-empty', ta('kart.edit.empty')));
}

/**
 * Fanger et CSP-brudd på iframe-en (hvis en host IKKE har OpenStreetMap i
 * frame-src) og bytter den brukne iframen med noe rolig: en forklaring i
 * editoren, en «åpne kartet»-lenke hos besøkende. Urds standard _headers har
 * OSM alt godkjent, så dette slår normalt aldri til.
 */
function watchCspBlock(host, frame, ctx, largerUrl) {
  // Sammenlign den blokkerte verten EKSAKT (parset URL), aldri en delstreng:
  // en delstreng-sjekk ville også slått til på f.eks. openstreetmap.org.example.com.
  let blockedHost = null;
  try { blockedHost = new URL(OSM_HOST).hostname; } catch { /* OSM_HOST er en konstant, dette skjer ikke */ }
  const onViolation = (event) => {
    let violatedHost = null;
    try { violatedHost = new URL(event.blockedURI).hostname; } catch { /* blockedURI kan være «inline»/«eval» m.m. */ }
    if (!(event.violatedDirective?.startsWith('frame-src') && violatedHost && violatedHost === blockedHost)) return;
    document.removeEventListener('securitypolicyviolation', onViolation);
    frame.remove();
    const note = el2('div', 'urd-kart-empty');
    if (ctx.preview) {
      note.append(
        el2('strong', null, ta('kart.edit.cspBlocked')),
        el2('p', 'urd-kart-note', ta('kart.edit.cspFix')),
        el2('code', 'urd-kart-code', `frame-src ${OSM_HOST}`),
      );
    } else {
      // Besøkende får en rolig lenke i stedet for en brukket iframe.
      const a = el2('a', 'urd-kart-fallback', t('kart.openOsm'));
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

/* ---------- CSS ---------- */

const KART_CSS = `
.urd-kart { width: 100%; position: relative; display: grid; gap: 6px; }
.urd-kart-frame { width: 100%; border: 1px solid color-mix(in srgb, var(--urd-color-text) 15%, transparent);
  border-radius: var(--urd-radius-md); display: block; }
.urd-kart-link { font-size: 0.82em; opacity: 0.75; }
.urd-kart-link a { color: var(--urd-color-accent); }
.urd-kart-empty { padding: 24px; text-align: center; border: 1px dashed color-mix(in srgb, var(--urd-color-text) 30%, transparent);
  border-radius: var(--urd-radius-md); opacity: 0.85; display: grid; gap: 8px; justify-items: center; }
.urd-kart-code { font: 12px/1.4 ui-monospace, monospace; padding: 4px 8px; border-radius: 5px;
  background: color-mix(in srgb, var(--urd-color-text) 10%, transparent); }
.urd-kart-fallback { color: var(--urd-color-accent); font-weight: 600; }
.urd-kart-note { font-size: 11px; opacity: 0.6; margin: 0; }
.urd-kart-tools { position: absolute; top: -32px; right: -6px; z-index: 5;
  display: flex; gap: 4px; align-items: center;
  /* Usynlig bro ned til blokk-kanten, så hover overlever veien opp */
  padding-bottom: 8px; }
.urd-kart-tools .urd-hint-chip { position: static; }
`;

function injectCss() {
  if (document.getElementById('urd-kart-css')) return;
  const style = document.createElement('style');
  style.id = 'urd-kart-css';
  style.textContent = KART_CSS;
  document.head.appendChild(style);
}

/* ---------- Autovekst ---------- */

function autoGrow(el, host, ctx) {
  const needed = host.scrollHeight;
  if (Math.abs(needed - el.clientHeight) > 8 && ctx.viewport !== 'mobile') {
    el.style.height = `${needed}px`;
    const sectionEl = el.closest('.urd-section');
    if (sectionEl) {
      const bottom = el.offsetTop + needed + 24;
      const current = Number.parseFloat(sectionEl.style.minHeight) || 0;
      if (bottom > current) sectionEl.style.minHeight = `${bottom}px`;
    }
    if (ctx.preview) {
      const block = ctx.section?.blocks?.find((b) => b.id === el.dataset.blockId);
      if (block && block.frames.desktop.h !== needed) {
        block.frames.desktop = { ...block.frames.desktop, h: needed };
        // KUN høyden meldes (urd-grow), aldri hele framen: ellers ville en
        // dratt blokk teleporteres tilbake til snapshotets gamle x/y.
        post({ type: 'urd-grow', sectionId: ctx.section.id, blockId: el.dataset.blockId, h: needed });
      }
    }
  }
}

/* ---------- Blokken ---------- */

function renderKart(el, props, ctx) {
  injectCss();
  const host = el2('div', 'urd-kart');
  el.appendChild(host);

  // Lagrede koordinater (fra adressesøk eller forrige tolking) foretrekkes;
  // ellers tolkes location-strengen (koordinater/OSM-lenke) direkte.
  const loc = (Number.isFinite(props.lat) && Number.isFinite(props.lon))
    ? { lat: props.lat, lon: props.lon, zoom: props.zoom }
    : parseLocation(props.location);
  if (loc) {
    const zoom = props.zoom ?? loc.zoom ?? 15;
    const largerUrl = buildLargerMapUrl({ lat: loc.lat, lon: loc.lon, zoom });
    const frame = el2('iframe', 'urd-kart-frame');
    frame.src = buildEmbedUrl({ lat: loc.lat, lon: loc.lon, zoom });
    frame.style.height = `${props.height ?? 320}px`;
    frame.loading = 'lazy';
    frame.title = t('kart.mapTitle');
    frame.setAttribute('referrerpolicy', 'no-referrer');
    host.appendChild(frame);
    watchCspBlock(host, frame, ctx, largerUrl);

    const link = el2('div', 'urd-kart-link');
    const a = el2('a', null, t('kart.larger'));
    a.href = largerUrl;
    a.target = '_blank';
    a.rel = 'noopener';
    link.appendChild(a);
    host.appendChild(link);
  } else {
    emptyState(host, ctx);
  }

  if (ctx.preview && ctx.viewport !== 'mobile') {
    // Innstillingene (sted, zoom, høyde) bor i Egenskaper-panelet via
    // felt-kontrakten (`fields` på blokk-defen); her gjenstår kun «?»-chipen.
    const tools = el2('div', 'urd-kart-tools');
    host.append(tools);
    import('/assets/urd/hint.js').then(({ attachHint }) => {
      if (!host.isConnected || host.querySelector('.urd-hint-chip')) return;
      const chip = attachHint(tools, {
        title: ta('kart.edit.hintTitle'),
        lines: [
          ta('kart.edit.hint1'),
          ta('kart.edit.hint2'),
          ta('kart.edit.hint3'),
          ta('kart.edit.hint4'),
          ta('kart.edit.hint5'),
        ],
      });
      tools.insertBefore(chip, tools.firstChild);
    });
  }

  autoGrow(el, host, ctx);
}

/* ---------- «Finn oss»-preset ---------- */

const blockId = () => {
  const bytes = crypto.getRandomValues(new Uint8Array(4));
  return 'blk-' + [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('');
};

function finnOssSection() {
  return {
    id: 'sec-' + blockId().slice(4),
    version: 1,
    preset: 'finn-oss',
    size: { minHeight: '480px' },
    grid: null,
    background: { version: 1, layers: [{ type: 'color', version: 1, props: { color: 'bg', opacity: 1 } }] },
    blocks: [
      {
        id: blockId(),
        type: 'text',
        version: 1,
        props: { html: ta('kart.edit.seedTitle'), align: 'left', box: false },
        animation: null,
        frames: { desktop: { x: 6, y: 40, w: 60, h: 70, z: 1, rot: 0 }, mobile: null },
      },
      {
        id: blockId(),
        type: 'kart',
        version: 1,
        props: { location: '', zoom: 15, height: 320 },
        animation: null,
        frames: { desktop: { x: 6, y: 120, w: 88, h: 360, z: 2, rot: 0 }, mobile: null },
      },
    ],
    responsive: { mobile: { mode: 'auto', attention: null } },
  };
}

/* ---------- Registrering ---------- */

/** @param {typeof window.Urd} Urd */
export function register(Urd) {
  Urd.blocks.define('kart', {
    version: 1,
    autoGrow: true,
    label: 'Kart',
    labelKey: 'kart.edit.blockLabel',
    defaults: () => ({ location: '', zoom: 15, height: 320 }),
    // Felt-kontrakten: innstillingene rendres i adminens Egenskaper-panel.
    // `place` skriver {location, lat, lon} (adressesøk via /api/geocode i
    // admin; koordinater og OSM-lenker tolkes av parseLocation ved rendring).
    fields: [
      { key: 'location', type: 'place', labelKey: 'kart.edit.location', placeholderKey: 'kart.edit.locationPh' },
      { key: 'zoom', type: 'number', labelKey: 'kart.edit.zoom', min: 1, max: 19 },
      { key: 'height', type: 'number', labelKey: 'kart.edit.height', min: 120, max: 900, step: 10 },
    ],
    migrations: {},
    render: renderKart,
  });

  Urd.sections.define('finn-oss', {
    label: 'Finn oss',
    labelKey: 'kart.edit.presetLabel',
    group: 'Kort og lister',
    hint: 'Kart med adressen deres (personvennlig OpenStreetMap)',
    hintKey: 'kart.edit.presetHint',
    create: finnOssSection,
  });
}
