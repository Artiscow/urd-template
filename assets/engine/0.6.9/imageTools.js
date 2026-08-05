/**
 * Bildeverktøy for editoren: komprimering til webp i nettleseren før
 * bildet i det hele tatt legges i utkastet (mønster fra ApeironLF).
 * Publiseringen materialiserer data-URL-ene til filer i media/.
 */

const MAX_DIMENSION = 1600;
const TARGET_QUALITY = 0.82;
const FALLBACK_QUALITY = 0.6;
/** Over dette varsles brukeren (git og statiske hoster liker små filer). */
export const WARN_BYTES = 400_000;

/**
 * Komprimerer en bildefil til webp, maks 1600px på lengste side.
 * SVG rasteriseres ikke: vektoren beholdes (etter sanitering), for en logo
 * skal være skarp i alle størrelser. Filnavnet ved publisering får riktig
 * endelse via mediaExtension.
 * @param {File} file
 * @returns {Promise<{dataUrl: string, bytes: number, width: number, height: number}>}
 */
export async function compressToWebp(file, maxDim = MAX_DIMENSION) {
  if (isSvgFile(file)) return svgToDataUrl(await file.text());
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  canvas.getContext('2d').drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const toBlob = (quality) => new Promise((resolve) => canvas.toBlob(resolve, 'image/webp', quality));
  let blob = await toBlob(TARGET_QUALITY);
  if (blob.size > WARN_BYTES) blob = await toBlob(FALLBACK_QUALITY);

  const dataUrl = await new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
  return { dataUrl, bytes: blob.size, width, height };
}

const SVG_MIME = 'image/svg+xml';

function isSvgFile(file) {
  return file.type === SVG_MIME || /\.svg$/i.test(file.name || '');
}

/**
 * Validerer en SVG og pakker den som en base64 data-URL. Teksten reinterpreteres
 * ALDRI som markup i live-DOM (ingen DOMParser/innerHTML) - den går kun til en
 * data-URL og rendres via <img>/CSS (secure static mode, ingen skript). Den
 * publiserte /media-filen kan likevel åpnes direkte, så en SVG med skript-
 * vektorer AVVISES (ikke strippes: reject er robust, stripping kan omgås).
 * Logo-SVG-er inneholder aldri skript/hendelser, så dette rammer ikke ekte bruk.
 * @returns {{dataUrl: string, bytes: number, width: number, height: number}}
 */
export function svgToDataUrl(text) {
  const raw = String(text ?? '');
  // Ankrede regex-barrierer (CodeQL gjenkjenner dem): må se ut som en SVG, og
  // ingen av skript-vektorene får finnes.
  if (!/<svg[\s>]/i.test(raw)) throw new Error('Ugyldig SVG');
  if (/<\s*script[\s>]/i.test(raw)
    || /<\s*foreignObject[\s>]/i.test(raw)
    || /\son[a-z]+\s*=/i.test(raw)
    || /javascript:/i.test(raw)) {
    throw new Error('SVG-en inneholder skript eller hendelser og kan ikke brukes');
  }
  const bytes = new Blob([raw]).size;
  // encodeURIComponent-omveien lar btoa takle ikke-ASCII (æøå i tittel/desc).
  const dataUrl = `data:${SVG_MIME};base64,${btoa(unescape(encodeURIComponent(raw)))}`;
  // Mål leses fra ÅPNINGS-taggen (ikke barneelementer): viewBox foretrukket.
  const svgTag = raw.match(/<svg\b[^>]*>/i)?.[0] ?? '';
  const box = svgTag.match(/viewBox\s*=\s*["']\s*([-\d.]+(?:[\s,]+[-\d.]+){3})\s*["']/i)?.[1]?.split(/[\s,]+/).map(Number);
  const width = box?.length === 4 ? box[2] : Number.parseFloat(svgTag.match(/\bwidth\s*=\s*["']?([\d.]+)/i)?.[1]) || 0;
  const height = box?.length === 4 ? box[3] : Number.parseFloat(svgTag.match(/\bheight\s*=\s*["']?([\d.]+)/i)?.[1]) || 0;
  return { dataUrl, bytes, width, height };
}

/**
 * Strammer en SVGs `viewBox` (og width/height) til motivets faktiske omfang, så
 * død plass rundt en logo fjernes og «bildeboksen» følger innholdet. Bounding-
 * boksen (i SVG-ens brukerkoordinater) måles utenfor denne funksjonen (canvas-
 * piksler i editoren); her gjøres kun den rene tekst-omskrivingen. En liten
 * luft-andel legges til. Ugyldig/tom boks -> teksten returneres uendret.
 * Ren funksjon (node-testet).
 * @param {string} svgText
 * @param {{x: number, y: number, width: number, height: number}} bbox
 * @param {number} [padFrac] Luft som andel av største side (standard 0.04)
 * @returns {string}
 */
export function tightSvgViewBox(svgText, bbox, padFrac = 0.04) {
  const raw = String(svgText ?? '');
  if (!bbox || !(bbox.width > 0) || !(bbox.height > 0)) return raw;
  const tag = raw.match(/<svg\b[^>]*>/i)?.[0];
  if (!tag) return raw;
  const r = (n) => Math.round(n * 1000) / 1000;
  const pad = Math.max(bbox.width, bbox.height) * Math.max(0, padFrac);
  const x = r(bbox.x - pad);
  const y = r(bbox.y - pad);
  const w = r(bbox.width + 2 * pad);
  const h = r(bbox.height + 2 * pad);
  const cleaned = tag
    .replace(/\sviewBox\s*=\s*["'][^"']*["']/i, '')
    .replace(/\swidth\s*=\s*["'][^"']*["']/i, '')
    .replace(/\sheight\s*=\s*["'][^"']*["']/i, '');
  const newTag = cleaned.replace(/<svg\b/i, `<svg viewBox="${x} ${y} ${w} ${h}" width="${w}" height="${h}"`);
  return raw.replace(tag, newTag);
}

/** viewBox-tallene [minX, minY, w, h] fra en SVG-tekst, ellers null. */
export function svgViewBox(svgText) {
  const tag = String(svgText ?? '').match(/<svg\b[^>]*>/i)?.[0] ?? '';
  const vb = tag.match(/viewBox\s*=\s*["']\s*([-\d.]+(?:[\s,]+[-\d.]+){3})\s*["']/i)?.[1]?.split(/[\s,]+/).map(Number);
  if (vb?.length === 4 && vb.every(Number.isFinite)) return vb;
  const w = Number.parseFloat(tag.match(/\bwidth\s*=\s*["']?([\d.]+)/i)?.[1]);
  const h = Number.parseFloat(tag.match(/\bheight\s*=\s*["']?([\d.]+)/i)?.[1]);
  return w > 0 && h > 0 ? [0, 0, w, h] : null;
}

/** Media-filendelse fra en data-URL: SVG beholder vektoren, resten er webp. */
export function mediaExtension(dataUrl) {
  return /^data:image\/svg\+xml[;,]/.test(dataUrl || '') ? 'svg' : 'webp';
}

/** Filnavn → trygg slug for media/-stier. */
export function slugify(name) {
  return name
    .replace(/\.[^.]+$/, '')
    .toLowerCase()
    .replaceAll('æ', 'ae').replaceAll('ø', 'o').replaceAll('å', 'a')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40) || 'bilde';
}

/** Kort, deterministisk hash av innholdet (samme bilde → samme filnavn). */
export function contentHash(text) {
  let hash = 5381;
  for (let i = 0; i < text.length; i++) hash = ((hash << 5) + hash + text.charCodeAt(i)) >>> 0;
  return hash.toString(16).padStart(8, '0');
}
