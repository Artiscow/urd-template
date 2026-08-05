/**
 * Auto-genererte preset-miniatyrer: en skjematisk SVG-skisse av seksjonen
 * en preset lager, tegnet fra de faktiske blokkene og bakgrunnen. Alltid i
 * synk med preseten, og følger sidens tema via CSS-variabler. Ren
 * strengbygging uten DOM, så generatoren testes med node --test.
 *
 * Ingen brukerstrenger interpoleres inn i SVG-en: farger slippes kun
 * gjennom som validert hex eller tematoken (ankrede regexer), alt annet
 * er tall vi selv har regnet ut. Trygg for insertAdjacentHTML.
 */

const HEX_RE = /^#[0-9a-fA-F]{3,8}$/;
const TOKEN_RE = /^[a-z][a-z0-9-]*$/;

/* Nøytrale reservefarger når tema-variablene ikke finnes (f.eks. i tester). */
const FALLBACK_BG = '#171c26';
const FALLBACK_SURFACE = '#232a38';
const FALLBACK_TEXT = '#98a1b3';
const FALLBACK_ACCENT = '#7c5cff';

const token = (name, fallback) => `var(--urd-color-${name}, ${fallback})`;

/** Tematoken eller hex → trygg SVG-fyllverdi; alt annet gir reserven. */
function safeColor(value, fallback) {
  if (typeof value !== 'string') return fallback;
  if (HEX_RE.test(value)) return value;
  if (TOKEN_RE.test(value)) return token(value, fallback);
  return fallback;
}

/** Seksjonens minstehøyde i px: '360px' → 360, '70vh' → 560 (vh-basis 800), søppel → 400. */
export function parseMinHeightPx(minHeight, vhBase = 800) {
  const n = Number.parseFloat(minHeight);
  if (!Number.isFinite(n) || n <= 0) return 400;
  if (typeof minHeight === 'string' && minHeight.trim().endsWith('vh')) return (n / 100) * vhBase;
  return n;
}

const r1 = (v) => Math.round(v * 10) / 10;
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

const rect = (x, y, w, h, fill, extra = '') =>
  `<rect x="${r1(x)}" y="${r1(y)}" width="${r1(Math.max(w, 1))}" height="${r1(Math.max(h, 1))}" fill="${fill}"${extra}/>`;

/** Bakgrunnsfyllet: første farge-/gradientlag bestemmer tonen. */
function bgFill(section) {
  for (const layer of section?.background?.layers ?? []) {
    if (layer.type === 'color') return safeColor(layer.props?.value, FALLBACK_BG);
    if (layer.type === 'gradient') {
      const stop = Array.isArray(layer.props?.stops) ? layer.props.stops[0] : null;
      return safeColor(stop, FALLBACK_BG);
    }
  }
  return token('bg', FALLBACK_BG);
}

/** Tekstblokk: 1-3 linjer; overskrifter gir en tykkere førstelinje. */
function textShapes(x, y, w, h, props) {
  const heading = /<h[1-3]/.test(String(props?.html ?? ''));
  const centered = props?.align === 'center';
  const textFill = token('text', FALLBACK_TEXT);
  const parts = [];
  const widths = [0.72, 0.9, 0.5];
  let ly = y + 1;
  for (let i = 0; i < 3; i++) {
    const lh = i === 0 && heading ? 4 : 2.2;
    if (ly + lh > y + h) break;
    const lw = w * widths[i];
    const lx = centered ? x + (w - lw) / 2 : x;
    parts.push(rect(lx, ly, lw, lh, textFill, ` opacity="${i === 0 ? 0.8 : 0.4}" rx="1"`));
    ly += lh + 2.4;
  }
  return parts.join('');
}

/** Bilderamme med fjell og sol (den klassiske plassholder-glyfen). */
function imageShapes(x, y, w, h) {
  const textFill = token('text', FALLBACK_TEXT);
  const parts = [rect(x, y, w, h, token('surface', FALLBACK_SURFACE), ' rx="1.5"')];
  const px = (f) => r1(x + w * f);
  const py = (f) => r1(y + h * f);
  parts.push(`<polygon points="${px(0.08)},${py(0.9)} ${px(0.42)},${py(0.38)} ${px(0.62)},${py(0.68)} ${px(0.75)},${py(0.5)} ${px(0.92)},${py(0.9)}" fill="${textFill}" opacity="0.4"/>`);
  parts.push(`<circle cx="${px(0.28)}" cy="${py(0.26)}" r="${r1(Math.max(1, Math.min(w, h) * 0.1))}" fill="${textFill}" opacity="0.5"/>`);
  return parts.join('');
}

/** Galleri: tre fliser side om side inne i rammen. */
function galleriShapes(x, y, w, h) {
  const gap = Math.max(1, w * 0.03);
  const tw = (w - gap * 2) / 3;
  const parts = [];
  for (let i = 0; i < 3; i++) parts.push(imageShapes(x + i * (tw + gap), y, tw, h));
  return parts.join('');
}

/** Samling: tre små kort med tekstlinje under. */
function samlingShapes(x, y, w, h) {
  const gap = Math.max(1, w * 0.03);
  const tw = (w - gap * 2) / 3;
  const parts = [];
  for (let i = 0; i < 3; i++) {
    const tx = x + i * (tw + gap);
    parts.push(rect(tx, y, tw, h * 0.55, token('surface', FALLBACK_SURFACE), ' rx="1.5"'));
    parts.push(rect(tx, y + h * 0.62, tw * 0.8, 2, token('text', FALLBACK_TEXT), ' opacity="0.5" rx="1"'));
  }
  return parts.join('');
}

function shapeShapes(x, y, w, h, props) {
  const fill = safeColor(props?.color, FALLBACK_ACCENT);
  const kind = props?.kind;
  if (kind === 'circle') {
    return `<ellipse cx="${r1(x + w / 2)}" cy="${r1(y + h / 2)}" rx="${r1(Math.max(w / 2, 1))}" ry="${r1(Math.max(h / 2, 1))}" fill="${fill}" opacity="0.8"/>`;
  }
  if (kind === 'triangle') {
    return `<polygon points="${r1(x)},${r1(y + h)} ${r1(x + w / 2)},${r1(y)} ${r1(x + w)},${r1(y + h)}" fill="${fill}" opacity="0.8"/>`;
  }
  if (kind === 'line' || kind === 'arrow') {
    return rect(x, y + h / 2 - 0.75, w, 1.5, fill, ' opacity="0.85" rx="0.75"');
  }
  return rect(x, y, w, h, fill, ' opacity="0.8" rx="1"');
}

function blockShapes(type, x, y, w, h, props) {
  if (type === 'text') return textShapes(x, y, w, h, props);
  if (type === 'image') return imageShapes(x, y, w, h);
  if (type === 'galleri') return galleriShapes(x, y, w, h);
  if (type === 'samling') return samlingShapes(x, y, w, h);
  if (type === 'shape') return shapeShapes(x, y, w, h, props);
  if (type === 'button') {
    return rect(x, y, w, h, token('accent', FALLBACK_ACCENT), ` rx="${r1(Math.min(h / 2, 4))}"`);
  }
  if (type === 'icon') {
    const r = Math.max(1.2, Math.min(w, h) / 2);
    return `<circle cx="${r1(x + w / 2)}" cy="${r1(y + h / 2)}" r="${r1(r)}" fill="${token('accent', FALLBACK_ACCENT)}" opacity="0.85"/>`;
  }
  if (type === 'video') {
    const parts = [rect(x, y, w, h, token('surface', FALLBACK_SURFACE), ' rx="1.5"')];
    const cx = x + w / 2;
    const cy = y + h / 2;
    const s = Math.max(1.5, Math.min(w, h) * 0.22);
    parts.push(`<polygon points="${r1(cx - s / 2)},${r1(cy - s)} ${r1(cx - s / 2)},${r1(cy + s)} ${r1(cx + s)},${r1(cy)}" fill="${token('text', FALLBACK_TEXT)}" opacity="0.6"/>`);
    return parts.join('');
  }
  // Ukjent type (f.eks. fra plugin): rolig kortomriss.
  return rect(x, y, w, h, token('surface', FALLBACK_SURFACE), ' rx="1.5"');
}

/**
 * @param {object} section En fersk seksjon fra en presets create() (dataene forkastes etterpå)
 * @returns {string} Skjematisk SVG-miniatyr av seksjonen
 */
export function presetThumb(section, { w = 120, h = 68 } = {}) {
  const blocks = Array.isArray(section?.blocks) ? section.blocks : [];
  const bottoms = blocks.map((b) => (b.frames?.desktop?.y ?? 0) + (b.frames?.desktop?.h ?? 0));
  const contentH = Math.max(
    parseMinHeightPx(section?.size?.minHeight),
    bottoms.length ? Math.max(...bottoms) + 16 : 0,
  );
  const sy = h / contentH;
  const parts = [rect(0, 0, w, h, bgFill(section))];

  // Glød-lag som myk sirkel, så hero-aktige presets beholder karakteren sin.
  for (const layer of section?.background?.layers ?? []) {
    if (layer.type !== 'glow') continue;
    const p = layer.props ?? {};
    parts.push(`<circle cx="${r1(clamp(p.x ?? 0.5, 0, 1) * w)}" cy="${r1(clamp(p.y ?? 0.3, 0, 1) * h)}" r="${r1(w * clamp(p.radius ?? 0.5, 0.1, 1) * 0.5)}" fill="${safeColor(p.color, FALLBACK_ACCENT)}" opacity="${r1(clamp(p.opacity ?? 0.3, 0, 0.5))}"/>`);
  }

  for (const block of blocks) {
    const d = block.frames?.desktop;
    if (!d) continue;
    const x = clamp((d.x ?? 0) * (w / 100), 0, w - 2);
    const y = clamp((d.y ?? 0) * sy, 0, h - 2);
    const bw = clamp((d.w ?? 10) * (w / 100), 2, w - x);
    const bh = clamp((d.h ?? 20) * sy, 2, h - y);
    parts.push(blockShapes(block.type, x, y, bw, bh, block.props));
  }

  return `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${parts.join('')}</svg>`;
}
