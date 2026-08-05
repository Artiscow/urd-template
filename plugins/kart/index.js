/**
 * Kart-referansepluginen (v0.6 M4): personvennlig OpenStreetMap-innbygging.
 * Eieren limer inn koordinater eller en OSM-lenke; blokken bygger inn OSMs
 * offisielle iframe (ingen sporing, ingen tredjeparts-tiles). Følger kalender-
 * referansen: egen CSS via én style-tag, hover-konfigpanel, hjelpechip
 * (ADR-0008), temastyrte nedtrekk (ADR-0009).
 *
 * CSP (ADR-0006): iframe mot openstreetmap.org krever frame-src-unntak.
 * Manifestet deklarerer det, Plugins-panelet viser eieren linjen, og blir
 * kartet blokkert av CSP viser blokken den nøyaktige _headers-linjen.
 */
import { parseLocation, buildEmbedUrl, buildLargerMapUrl, OSM_HOST } from './osm.js';
// Flerspråk (ADR-0012): t() for besøkende-tekster (site-språket), ta() for
// editor-chromen og seed (admin-språket). Ordboka (locales/) lastes av
// plugin-lasteren FØR register() - t/ta kalles aldri på modulnivå.
import { t, ta, taApiError } from '/assets/urd/i18n.js';

const el2 = (tag, className, textContent) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (textContent != null) node.textContent = textContent;
  return node;
};

const post = (msg) => window.parent?.postMessage(msg, location.origin);

/* ---------- Konfigpanel ---------- */

function configPanel(el, props, ctx) {
  const gear = el2('button', 'urd-kart-gear urd-cfg-toggle', `⚙ ${ta('kart.edit.location')}`);
  gear.type = 'button';
  gear.title = ta('kart.edit.gearTitle');
  const panel = el2('div', 'urd-kart-config');

  const label = (text) => el2('div', 'urd-kart-config-label', text);
  const location = el2('input', 'urd-kart-config-input');
  location.value = props.location ?? '';
  location.placeholder = ta('kart.edit.locationPh');

  const zoom = el2('input', 'urd-kart-config-input');
  zoom.type = 'number';
  zoom.min = '1';
  zoom.max = '19';
  zoom.value = String(props.zoom ?? 15);

  const height = el2('input', 'urd-kart-config-input');
  height.type = 'number';
  height.min = '120';
  height.max = '900';
  height.value = String(props.height ?? 320);

  const status = el2('p', 'urd-kart-config-note urd-kart-status');

  const apply = el2('button', 'urd-kart-apply', ta('common.apply'));
  apply.type = 'button';
  apply.addEventListener('click', async () => {
    const raw = location.value.trim();
    const z = Math.max(1, Math.min(19, Number(zoom.value) || 15));
    const h = Math.max(120, Math.min(900, Number(height.value) || 320));
    status.textContent = '';
    status.classList.remove('feil');

    // Koordinater/OSM-lenke tolkes lokalt; en vanlig adresse geokodes.
    const parsed = parseLocation(raw);
    let lat = null;
    let lon = null;
    let resolvedZoom = z;
    if (parsed) {
      lat = parsed.lat;
      lon = parsed.lon;
      if (parsed.zoom) resolvedZoom = parsed.zoom;
    } else if (raw) {
      apply.disabled = true;
      status.textContent = ta('kart.edit.searching');
      try {
        const res = await fetch(`/api/geocode?q=${encodeURIComponent(raw)}`);
        const data = await res.json().catch(() => null);
        if (res.ok && Number.isFinite(data?.lat)) {
          lat = data.lat;
          lon = data.lon;
        } else {
          status.textContent = taApiError(data) ?? ta('kart.edit.notFound');
          status.classList.add('feil');
          apply.disabled = false;
          return;
        }
      } catch {
        status.textContent = ta('kart.edit.searchFailed');
        status.classList.add('feil');
        apply.disabled = false;
        return;
      }
      apply.disabled = false;
    }

    post({
      type: 'urd-edit',
      sectionId: ctx.section.id,
      blockId: el.dataset.blockId,
      props: { location: raw, lat, lon, zoom: resolvedZoom, height: h },
      rerender: true,
    });
    close();
  });

  panel.append(
    label(ta('kart.edit.location')), location,
    el2('p', 'urd-kart-config-note', ta('kart.edit.locationNote')),
    status,
    label(ta('kart.edit.zoom')), zoom,
    label(ta('kart.edit.height')), height,
    apply,
  );

  const onOutside = (event) => {
    if (!panel.isConnected) { close(); return; }
    if (panel.contains(event.target) || event.target === gear) return;
    close();
  };
  function close() {
    panel.classList.remove('vis');
    document.removeEventListener('pointerdown', onOutside, true);
  }
  gear.addEventListener('click', (event) => {
    event.stopPropagation();
    if (panel.classList.toggle('vis')) {
      setTimeout(() => document.addEventListener('pointerdown', onOutside, true), 0);
    } else {
      close();
    }
  });
  return [gear, panel];
}

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
        el2('p', 'urd-kart-config-note', ta('kart.edit.cspFix')),
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
.urd-kart-status:empty { display: none; }
.urd-kart-status.feil { color: #e05252; opacity: 1; }
.urd-kart-tools { position: absolute; top: -32px; right: -6px; z-index: 5;
  display: flex; gap: 4px; align-items: center;
  /* Usynlig bro ned til blokk-kanten, så hover overlever veien opp */
  padding-bottom: 8px; }
.urd-kart-tools .urd-hint-chip { position: static; }
/* Config-bryteren er skjult: innstillingene åpnes fra blokkens Egenskaper. */
.urd-kart-gear { display: none; }
.urd-block:hover .urd-kart-gear, .urd-kart-gear:focus-visible,
.urd-kart:has(.urd-kart-config.vis) .urd-kart-gear { opacity: 0.92; pointer-events: auto; }
.urd-kart-config { position: absolute; top: -6px; right: 0; z-index: 6; width: min(340px, 92vw);
  display: none; gap: 6px; padding: 12px; border-radius: 10px;
  background: #151a23; color: #e8eaf0; border: 1px solid rgb(255 255 255 / 18%);
  box-shadow: 0 12px 36px rgb(0 0 0 / 55%); font: 12px/1.4 system-ui, sans-serif; }
.urd-kart-config.vis { display: grid; }
.urd-kart-config-label { font-size: 10px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; opacity: 0.55; }
.urd-kart-config-note { font-size: 11px; opacity: 0.6; margin: 0; }
.urd-kart-config-input { font: 12px/1.4 system-ui, sans-serif; color: inherit; background: rgb(255 255 255 / 6%);
  border: 1px solid rgb(255 255 255 / 20%); border-radius: 6px; padding: 5px 7px; width: 100%; }
.urd-kart-apply { font: 600 12px/1 system-ui, sans-serif; cursor: pointer; border-radius: 6px;
  padding: 7px 10px; border: 0; background: #7c5cff; color: #fff; }
body.urd-chrome-off .urd-kart-gear, body.urd-chrome-off .urd-kart-config { display: none !important; }
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
    const [gear, panel] = configPanel(el, props, ctx);
    // «?» og «⚙ Sted» i samme rad øverst til høyre, med hover-bro (klar av rotasjonshåndtaket).
    const tools = el2('div', 'urd-kart-tools');
    tools.appendChild(gear);
    host.append(tools, panel);
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
    label: 'Kart',
    labelKey: 'kart.edit.blockLabel',
    defaults: () => ({ location: '', zoom: 15, height: 320 }),
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
