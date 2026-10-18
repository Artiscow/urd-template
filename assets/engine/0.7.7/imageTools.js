/**
 * Image tools for the editor: compression to webp in the browser before
 * the image even enters the draft. Publishing materializes the data URLs
 * into files in media/.
 */

const MAX_DIMENSION = 1600;
const TARGET_QUALITY = 0.82;
const FALLBACK_QUALITY = 0.6;
/** Above this the user is warned (git and static hosts like small files). */
export const WARN_BYTES = 400_000;
/* The media limits, set as one whole: images are compressed to webp (max
   1600px, warning above WARN_BYTES), audio is published unchanged (warning
   above WARN_BYTES), video warns above VIDEO_WARN_BYTES and is rejected
   hard above VIDEO_MAX_BYTES - well below the host's file limit
   (Cloudflare Pages 25 MiB), and with margin for the base64 draft in
   localStorage blowing the quota (the draft then lives only in memory
   until it is published, and the editor warns). */
export const VIDEO_WARN_BYTES = 4_000_000;
export const VIDEO_MAX_BYTES = 15_000_000;
/* An animated image (GIF, animated WebP, APNG) is kept as the file it is: a
   canvas holds one frame, so compressing it would freeze it. It is warned
   about above ANIMATED_WARN_BYTES and rejected above ANIMATED_MAX_BYTES,
   where a video does the same job at a fraction of the size. */
export const ANIMATED_WARN_BYTES = 1_000_000;
export const ANIMATED_MAX_BYTES = 4_000_000;
/** How much of a larger file is read to tell whether it moves: the flag of a WebP, the chunk of a PNG and the loop block of a GIF come before the first frame's picture. */
const ANIMATED_HEAD_BYTES = 256_000;

/** True when the bytes hold a GIF's loop block (NETSCAPE2.0 or ANIMEXTS1.0), which an animated GIF carries before its first frame. */
function gifLoops(bytes) {
  if (!ascii(bytes, 0, 'GIF8')) return false;
  for (let at = 13; at < bytes.length - 11; at++) {
    if (bytes[at] === 0x21 && bytes[at + 1] === 0xff && bytes[at + 2] === 11 && (ascii(bytes, at + 3, 'NETSCAPE2.0') || ascii(bytes, at + 3, 'ANIMEXTS1.0'))) return true;
  }
  return false;
}

/** Thrown when an animated image is larger than ANIMATED_MAX_BYTES. */
export class AnimatedTooLargeError extends Error {
  /** @param {number} bytes The file's size */
  constructor(bytes) {
    super('The animated image is too large');
    this.code = 'animatedTooLarge';
    this.bytes = bytes;
  }
}

const ascii = (bytes, at, text) => {
  if (at + text.length > bytes.length) return false;
  for (let i = 0; i < text.length; i += 1) if (bytes[at + i] !== text.charCodeAt(i)) return false;
  return true;
};

/** Whether a GIF holds more than one frame: the blocks are walked, never guessed at. */
function gifAnimated(bytes) {
  if (!ascii(bytes, 0, 'GIF87a') && !ascii(bytes, 0, 'GIF89a')) return false;
  if (bytes.length < 13) return false;
  let at = 13;
  // The global colour table, when the screen descriptor says there is one.
  if (bytes[10] & 0x80) at += 3 * (2 ** ((bytes[10] & 0x07) + 1));
  const skipSubBlocks = () => {
    while (at < bytes.length) {
      const size = bytes[at];
      at += 1;
      if (size === 0) return;
      at += size;
    }
  };
  let frames = 0;
  while (at < bytes.length) {
    const block = bytes[at];
    at += 1;
    if (block === 0x2c) {
      // An image descriptor: one frame, with an optional colour table of its own.
      frames += 1;
      if (frames > 1) return true;
      if (at + 9 > bytes.length) return false;
      const packed = bytes[at + 8];
      at += 9;
      if (packed & 0x80) at += 3 * (2 ** ((packed & 0x07) + 1));
      at += 1;
      skipSubBlocks();
    } else if (block === 0x21) {
      at += 1;
      skipSubBlocks();
    } else {
      // The trailer, or bytes that are not a GIF block: the walk ends here.
      return false;
    }
  }
  return false;
}

/** Whether a WebP is the animated kind: the extended header's animation flag. */
function webpAnimated(bytes) {
  if (!ascii(bytes, 0, 'RIFF') || !ascii(bytes, 8, 'WEBP')) return false;
  return ascii(bytes, 12, 'VP8X') && bytes.length > 20 && (bytes[20] & 0x02) !== 0;
}

/** Whether a PNG is an APNG: an animation control chunk before the first image data. */
function pngAnimated(bytes) {
  const signature = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
  if (bytes.length < 16 || signature.some((byte, i) => bytes[i] !== byte)) return false;
  let at = 8;
  while (at + 8 <= bytes.length) {
    const length = ((bytes[at] << 24) | (bytes[at + 1] << 16) | (bytes[at + 2] << 8) | bytes[at + 3]) >>> 0;
    if (ascii(bytes, at + 4, 'acTL')) return true;
    if (ascii(bytes, at + 4, 'IDAT') || ascii(bytes, at + 4, 'IEND')) return false;
    at += 12 + length;
  }
  return false;
}

/**
 * The kind of animated image a file is, from its own bytes: `gif`, `webp` or
 * `png` (an APNG), or null for a still image and for anything else. Pure.
 * @param {Uint8Array} bytes The file's content
 * @returns {'gif'|'webp'|'png'|null}
 */
export function animatedImageKind(bytes) {
  if (!(bytes instanceof Uint8Array)) return null;
  if (gifAnimated(bytes)) return 'gif';
  if (webpAnimated(bytes)) return 'webp';
  if (pngAnimated(bytes)) return 'png';
  return null;
}

/**
 * Whether a file is an animated image (GIF, animated WebP or APNG). Pure.
 * @param {Uint8Array} bytes The file's content
 * @returns {boolean}
 */
export function isAnimatedImage(bytes) {
  return animatedImageKind(bytes) !== null;
}

/**
 * An animated image as it is: the original bytes as a data URL, with the
 * first frame's size. null for a file that is not an animation; throws
 * AnimatedTooLargeError above the cap. Only the three formats that can
 * animate are read into memory.
 * @param {File} file
 * @returns {Promise<{dataUrl: string, bytes: number, width: number, height: number, animated: true}|null>}
 */
async function keepAnimated(file) {
  if (!/^image\/(?:gif|webp|png|apng)$/i.test(file.type || '') && !/\.(?:gif|webp|a?png)$/i.test(file.name || '')) return null;
  // A file larger than an animated image may be is read only as far as its beginning, which tells whether it moves.
  if (file.size > ANIMATED_MAX_BYTES) {
    const head = new Uint8Array(await file.slice(0, ANIMATED_HEAD_BYTES).arrayBuffer());
    if (animatedImageKind(head) || gifLoops(head)) throw new AnimatedTooLargeError(file.size);
    return null;
  }
  const bytes = new Uint8Array(await file.arrayBuffer());
  const kind = animatedImageKind(bytes);
  if (!kind) return null;
  const dataUrl = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(new Blob([bytes], { type: `image/${kind}` }));
  });
  let width = 0;
  let height = 0;
  try {
    const bitmap = await createImageBitmap(file);
    width = bitmap.width;
    height = bitmap.height;
    bitmap.close();
  } catch { /* the size is a hint for the caller; the file itself is what is kept */ }
  return { dataUrl, bytes: bytes.length, width, height, animated: true };
}

/**
 * Compresses an image file to webp, max 1600px on the longest side.
 * SVG is not rasterized: the vector is kept (after sanitizing), because a
 * logo must be sharp at every size. An animated image is kept as the file
 * it is (keepAnimated), marked `animated`, unless `still` asks for a still
 * picture at the size given (an icon). The file name at publish time gets
 * the right extension via mediaExtension.
 * @param {File} file
 * @param {number} [maxDim]
 * @param {{still?: boolean}} [opts]
 * @returns {Promise<{dataUrl: string, bytes: number, width: number, height: number, animated?: boolean}>}
 */
export async function compressToWebp(file, maxDim = MAX_DIMENSION, { still = false } = {}) {
  if (isSvgFile(file)) return svgToDataUrl(await file.text());
  const kept = still ? null : await keepAnimated(file);
  if (kept) return kept;
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
 * Validates an SVG and packs it as a base64 data URL. The text is NEVER
 * reinterpreted as markup in the live DOM (no DOMParser/innerHTML) - it
 * only goes into a data URL and renders via <img>/CSS (secure static mode,
 * no scripts). The published /media file can still be opened directly, so
 * an SVG with script vectors is REJECTED (not stripped: rejecting is
 * robust, stripping can be bypassed). Logo SVGs never contain
 * scripts/event handlers, so this does not hit real use.
 * @returns {{dataUrl: string, bytes: number, width: number, height: number}}
 */
export function svgToDataUrl(text) {
  const raw = String(text ?? '');
  // Anchored regex barriers (CodeQL recognizes them): it must look like an
  // SVG, and none of the script vectors may be present.
  if (!/<svg[\s>]/i.test(raw)) throw new Error('Invalid SVG');
  if (/<\s*script[\s>]/i.test(raw)
    || /<\s*foreignObject[\s>]/i.test(raw)
    || /\son[a-z]+\s*=/i.test(raw)
    || /javascript:/i.test(raw)) {
    throw new Error('The SVG contains scripts or event handlers and cannot be used');
  }
  const bytes = new Blob([raw]).size;
  // The encodeURIComponent detour lets btoa handle non-ASCII (æøå in title/desc).
  const dataUrl = `data:${SVG_MIME};base64,${btoa(unescape(encodeURIComponent(raw)))}`;
  // Dimensions are read from the OPENING tag (not child elements): viewBox preferred.
  const svgTag = raw.match(/<svg\b[^>]*>/i)?.[0] ?? '';
  const box = svgTag.match(/viewBox\s*=\s*["']\s*([-\d.]+(?:[\s,]+[-\d.]+){3})\s*["']/i)?.[1]?.split(/[\s,]+/).map(Number);
  const width = box?.length === 4 ? box[2] : Number.parseFloat(svgTag.match(/\bwidth\s*=\s*["']?([\d.]+)/i)?.[1]) || 0;
  const height = box?.length === 4 ? box[3] : Number.parseFloat(svgTag.match(/\bheight\s*=\s*["']?([\d.]+)/i)?.[1]) || 0;
  return { dataUrl, bytes, width, height };
}

/**
 * Tightens an SVG's `viewBox` (and width/height) to the motif's actual
 * extent, so dead space around a logo is removed and the image box follows
 * the content. The bounding box (in the SVG's user coordinates) is
 * measured outside this function (canvas pixels in the editor); only the
 * pure text rewrite happens here. A small padding fraction is added.
 * Invalid/empty box -> the text is returned unchanged. Pure function
 * (node-tested).
 * @param {string} svgText
 * @param {{x: number, y: number, width: number, height: number}} bbox
 * @param {number} [padFrac] Padding as a fraction of the longest side (default 0.04)
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

/** The viewBox numbers [minX, minY, w, h] from an SVG text, otherwise null. */
export function svgViewBox(svgText) {
  const tag = String(svgText ?? '').match(/<svg\b[^>]*>/i)?.[0] ?? '';
  const vb = tag.match(/viewBox\s*=\s*["']\s*([-\d.]+(?:[\s,]+[-\d.]+){3})\s*["']/i)?.[1]?.split(/[\s,]+/).map(Number);
  if (vb?.length === 4 && vb.every(Number.isFinite)) return vb;
  const w = Number.parseFloat(tag.match(/\bwidth\s*=\s*["']?([\d.]+)/i)?.[1]);
  const h = Number.parseFloat(tag.match(/\bheight\s*=\s*["']?([\d.]+)/i)?.[1]);
  return w > 0 && h > 0 ? [0, 0, w, h] : null;
}

/** Media file extension from a data URL: SVG keeps the vector, a GIF and a
 *  PNG keep their own (the animations that were kept as they are), the rest
 *  is webp. */
export function mediaExtension(dataUrl) {
  const url = dataUrl || '';
  if (/^data:image\/svg\+xml[;,]/.test(url)) return 'svg';
  if (/^data:image\/gif[;,]/.test(url)) return 'gif';
  if (/^data:image\/(?:png|apng)[;,]/.test(url)) return 'png';
  // Audio files are published unchanged (no canvas path to compress
  // through), so the extension is derived from the MIME type.
  const audio = url.match(/^data:audio\/([a-z0-9.+-]+)[;,]/i)?.[1]?.toLowerCase();
  if (audio) {
    return { mpeg: 'mp3', mp3: 'mp3', mp4: 'm4a', 'x-m4a': 'm4a', aac: 'aac', wav: 'wav', 'x-wav': 'wav', ogg: 'ogg', webm: 'webm', flac: 'flac' }[audio] ?? 'mp3';
  }
  // Video is also published unchanged; the upload only lets mp4/webm in.
  const video = url.match(/^data:video\/([a-z0-9.+-]+)[;,]/i)?.[1]?.toLowerCase();
  if (video) return video === 'webm' ? 'webm' : 'mp4';
  return 'webp';
}

/** File name → safe slug for media/ paths. */
export function slugify(name, fallback = 'image') {
  return name
    .replace(/\.[^.]+$/, '')
    .toLowerCase()
    .replaceAll('æ', 'ae').replaceAll('ø', 'o').replaceAll('å', 'a')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40) || fallback;
}

/** Short, deterministic hash of the content (same image → same file name). */
export function contentHash(text) {
  let hash = 5381;
  for (let i = 0; i < text.length; i++) hash = ((hash << 5) + hash + text.charCodeAt(i)) >>> 0;
  return hash.toString(16).padStart(8, '0');
}
