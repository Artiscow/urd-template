/**
 * Image tools for the editor: pictures compressed to webp in the browser before they enter the draft; publishing writes the data URLs to media/ by kind.
 */

const MAX_DIMENSION = 1600;
const TARGET_QUALITY = 0.82;
const FALLBACK_QUALITY = 0.6;
/** Above this the user is warned (git and static hosts like small files). */
export const WARN_BYTES = 400_000;
/* The media limits: audio publishes unchanged, and a video warns above VIDEO_WARN_BYTES and is refused above VIDEO_MAX_BYTES. */
export const VIDEO_WARN_BYTES = 4_000_000;
export const VIDEO_MAX_BYTES = 15_000_000;
/* A PDF publishes unchanged under a video's two limits; the publishing guard holds the same maximum (MEDIA_PDF_MAX_BYTES). */
export const PDF_WARN_BYTES = VIDEO_WARN_BYTES;
export const PDF_MAX_BYTES = VIDEO_MAX_BYTES;
/* An animated image is kept as the file it is; above its use's budget the owner is asked, and above ANIMATED_MAX_BYTES it is refused. */
export const ANIMATED_MAX_BYTES = 4_000_000;

/**
 * The most a picture should weigh for each use, in bytes: a picture is compressed into its budget, and one that cannot be is asked about before it is kept.
 */
export const PICTURE_BUDGETS = Object.freeze({
  image: 400_000,
  gallery: 400_000,
  entry: 300_000,
  cover: 300_000,
  share: 300_000,
  portrait: 150_000,
  logo: 100_000,
  icon: 50_000,
  background: 600_000,
});

/** The qualities a picture over its budget is tried at, then the step it shrinks by at the last, never below BUDGET_MIN_DIMENSION on its longest side. */
const BUDGET_QUALITIES = [0.72, 0.62];
const BUDGET_SHRINK = 0.85;
const BUDGET_MIN_DIMENSION = 640;
/** How much of a larger file is read to tell whether it moves, each format's mark of animation standing before its first frame. */
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
 * The kind of animated image a file is, from its own bytes: `gif`, `webp` or `png` (an APNG), or null. Pure.
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
 * An animated image as it is: its bytes as a data URL with the first frame's size; null for a still file, AnimatedTooLargeError above the cap.
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
 * Compresses an image to webp, at most maxDim on its longest side and within `budget` where given.
 * An SVG keeps its vector, an animation its file unless `still`.
 * @param {Blob} file
 * @param {number} [maxDim]
 * @param {{still?: boolean, budget?: number}} [opts]
 * @returns {Promise<{dataUrl: string, bytes: number, width: number, height: number, animated?: boolean}>}
 */
export async function compressToWebp(file, maxDim = MAX_DIMENSION, { still = false, budget = 0 } = {}) {
  if (isSvgFile(file)) return svgToDataUrl(await file.text());
  const kept = still ? null : await keepAnimated(file);
  if (kept) return kept;
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement('canvas');
  const draw = (longest) => {
    const scale = Math.min(1, longest / Math.max(bitmap.width, bitmap.height));
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  };
  draw(maxDim);

  const toBlob = (quality) => new Promise((resolve) => canvas.toBlob(resolve, 'image/webp', quality));
  let blob = await toBlob(TARGET_QUALITY);
  // A canvas that cannot write WebP gives PNG, which has no quality to lower: the picture is kept whole, and its size is the caller's to ask about.
  if (budget > 0 && blob.type === 'image/webp') {
    for (const quality of BUDGET_QUALITIES) {
      if (blob.size <= budget) break;
      blob = await toBlob(quality);
    }
    while (blob.size > budget && Math.max(canvas.width, canvas.height) * BUDGET_SHRINK >= BUDGET_MIN_DIMENSION) {
      draw(Math.floor(Math.max(canvas.width, canvas.height) * BUDGET_SHRINK));
      blob = await toBlob(BUDGET_QUALITIES.at(-1));
    }
  } else if (blob.size > WARN_BYTES) blob = await toBlob(FALLBACK_QUALITY);
  bitmap.close();
  const { width, height } = canvas;

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
 * Why an SVG may not be used, or null: each value decoded, it refuses scripts, handlers, script addresses and a data address that is not a raster picture.
 * @param {string} text
 * @returns {null|'notSvg'|'declaration'|'element'|'handler'|'animation'|'scriptAddress'|'dataAddress'}
 */
export function svgProblem(text) {
  const BANNED = ['script', 'foreignobject', 'iframe', 'embed', 'object', 'handler', 'listener'];
  const LINKS = ['href', 'src', 'from', 'to', 'values', 'by'];
  const RASTER = /^data:image\/(?:png|jpe?g|gif|webp|avif)[;,]/;
  const SCRIPT = /(?:javascript|vbscript|livescript):/;
  const TAG = /<([^\s/<>!?]+)((?:\s(?:[^<>"']|"[^"<]*"|'[^'<]*')*)?)\/?>/y;
  const ATTR = /([^\s=/"'<>]+)\s*(?:=\s*(?:"([^"<]*)"|'([^'<]*)'|([^\s"'<>]+)))?/g;
  const ENTITY = /\s*<!ENTITY\s+([A-Za-z_][\w.-]*)\s+(?:"([^"<&%]*)"|'([^'<&%]*)')\s*>/y;
  const SUBSET_END = /\s*\]\s*>/y;
  const named = { lt: '<', gt: '>', quot: '"', apos: "'", amp: '&' };
  let unknown = false;
  const decode = (value) => value.replace(/&(?:#x([0-9a-f]+);?|#(\d+);?|([A-Za-z_][\w.-]*);)/gi, (m, hex, dec, name) => {
    if (name) {
      if (!Object.hasOwn(named, name)) unknown = true;
      return named[name] ?? '';
    }
    return String.fromCodePoint(Math.min(hex ? parseInt(hex, 16) : Number(dec), 0x10ffff));
  });
  const plain = (value) => decode(value).replace(/[\u0000-\u0020\u007f]/g, '').toLowerCase();
  const raw = String(text ?? '');
  if (!/<svg[\s>]/i.test(raw)) return 'notSvg';
  const texts = [];
  let last = 0;
  let i = 0;
  while ((i = raw.indexOf('<', i)) !== -1) {
    const take = (end) => { texts.push(raw.slice(last, i)); last = end; i = end; };
    if (raw.startsWith('<!--', i)) {
      const end = raw.indexOf('-->', i + 4);
      if (end < 0) return 'declaration';
      take(end + 3);
      continue;
    }
    if (raw.startsWith('<![CDATA[', i)) {
      const end = raw.indexOf(']]>', i + 9);
      if (end < 0) return 'declaration';
      texts.push(raw.slice(i + 9, end));
      take(end + 3);
      continue;
    }
    if (raw.startsWith('<?', i)) {
      const end = raw.indexOf('?>', i + 2);
      if (end < 0 || /^xml-stylesheet\b/i.test(raw.slice(i + 2, end))) return 'declaration';
      take(end + 2);
      continue;
    }
    if (raw.startsWith('<!', i)) {
      if (!/^<!DOCTYPE\s/i.test(raw.slice(i, i + 10))) return 'declaration';
      let j = i + 9;
      let quote = '';
      for (; j < raw.length; j += 1) {
        const c = raw[j];
        if (quote) { if (c === quote) quote = ''; } else if (c === '"' || c === "'") quote = c;
        else if (c === '[' || c === '>') break;
      }
      if (j >= raw.length) return 'declaration';
      if (raw[j] === '[') {
        let at = j + 1;
        for (;;) {
          ENTITY.lastIndex = at;
          const entity = ENTITY.exec(raw);
          if (!entity) break;
          const value = entity[2] ?? entity[3];
          if (SCRIPT.test(plain(value))) return 'scriptAddress';
          named[entity[1]] = value;
          at = ENTITY.lastIndex;
        }
        SUBSET_END.lastIndex = at;
        if (!SUBSET_END.exec(raw)) return 'declaration';
        j = SUBSET_END.lastIndex - 1;
      }
      take(j + 1);
      continue;
    }
    if (raw[i + 1] === '/') {
      const end = raw.indexOf('>', i);
      take(end < 0 ? raw.length : end + 1);
      continue;
    }
    TAG.lastIndex = i;
    const tag = TAG.exec(raw);
    if (!tag) {
      i += 1;
      continue;
    }
    if (BANNED.includes(tag[1].split(':').pop().toLowerCase())) return 'element';
    for (const attr of tag[2].matchAll(ATTR)) {
      const name = attr[1].split(':').pop().toLowerCase();
      const value = plain(attr[2] ?? attr[3] ?? attr[4] ?? '');
      if (name.startsWith('on')) return 'handler';
      if (name === 'attributename' && value.includes('href')) return 'animation';
      if (SCRIPT.test(value)) return 'scriptAddress';
      if (LINKS.includes(name) && value.startsWith('data:') && !RASTER.test(value)) return 'dataAddress';
    }
    take(TAG.lastIndex);
  }
  texts.push(raw.slice(last));
  if (SCRIPT.test(plain(texts.join(' ')))) return 'scriptAddress';
  return unknown ? 'declaration' : null;
}

/**
 * An SVG's text from a data URL (base64, or percent-encoded), or null where the URL is no SVG or cannot be read.
 * @param {string} url
 * @returns {string|null}
 */
export function svgDataText(url) {
  const match = /^data:image\/svg\+xml(;[^,]*)?,(.*)$/s.exec(String(url ?? ''));
  if (!match) return null;
  try {
    if (/;base64/i.test(match[1] ?? '')) return new TextDecoder().decode(Uint8Array.from(atob(match[2]), (c) => c.charCodeAt(0)));
    return decodeURIComponent(match[2]);
  } catch {
    return null;
  }
}

/**
 * Validates an SVG and packs it as a base64 data URL; one that holds anything that can run is refused (`svgUnsafe`), never stripped.
 * @returns {{dataUrl: string, bytes: number, width: number, height: number}}
 */
export function svgToDataUrl(text) {
  const raw = String(text ?? '');
  const problem = svgProblem(raw);
  if (problem === 'notSvg') throw new Error('Invalid SVG');
  if (problem) throw Object.assign(new Error('The SVG contains scripts or event handlers and cannot be used'), { code: 'svgUnsafe', problem });
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
 * Tightens an SVG's `viewBox`, width and height to a measured bounding box with a padding.
 * An empty box leaves the text as it is.
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

/** Media file extension from a data URL: an SVG, GIF, PNG or PDF keeps its own, audio and video take their type's, and the rest is webp. */
export function mediaExtension(dataUrl) {
  const url = dataUrl || '';
  if (/^data:application\/pdf[;,]/i.test(url)) return 'pdf';
  if (/^data:image\/svg\+xml[;,]/.test(url)) return 'svg';
  if (/^data:image\/gif[;,]/.test(url)) return 'gif';
  if (/^data:image\/(?:png|apng)[;,]/.test(url)) return 'png';
  // Audio is published unchanged, so its extension comes from its MIME type.
  const audio = url.match(/^data:audio\/([a-z0-9.+-]+)[;,]/i)?.[1]?.toLowerCase();
  if (audio) {
    return { mpeg: 'mp3', mp3: 'mp3', mp4: 'm4a', 'x-m4a': 'm4a', aac: 'aac', wav: 'wav', 'x-wav': 'wav', ogg: 'ogg', webm: 'webm', flac: 'flac' }[audio] ?? 'mp3';
  }
  // Video is also published unchanged; the upload only lets mp4/webm in.
  const video = url.match(/^data:video\/([a-z0-9.+-]+)[;,]/i)?.[1]?.toLowerCase();
  if (video) return video === 'webm' ? 'webm' : 'mp4';
  return 'webp';
}

/** Letters an accent cannot be split from, spelt with the plain letters they stand for (Norwegian, Sámi, German, Turkish, Icelandic and Polish among them). */
const SPELT_OUT = { æ: 'ae', ø: 'o', ß: 'ss', ı: 'i', đ: 'd', ŋ: 'n', ŧ: 't', ł: 'l', ð: 'd', þ: 'th', œ: 'oe' };

/**
 * Words → lower-case letters and digits joined by single hyphens: SPELT_OUT's letters spelt out, accents dropped, and the rest a hyphen, never at either end.
 * @param {unknown} text
 * @returns {string}
 */
export function slugText(text) {
  return String(text ?? '')
    .toLowerCase()
    .replace(/[æøßıđŋŧłðþœ]/g, (letter) => SPELT_OUT[letter])
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** File name → safe slug for media/ paths. */
export function slugify(name, fallback = 'image') {
  return slugText(name.replace(/\.[^.]+$/, '')).slice(0, 40) || fallback;
}

/** Short, deterministic hash of the content (same image → same file name). */
export function contentHash(text) {
  let hash = 5381;
  for (let i = 0; i < text.length; i++) hash = ((hash << 5) + hash + text.charCodeAt(i)) >>> 0;
  return hash.toString(16).padStart(8, '0');
}

/** The folders of media/, by the kind of file each holds: a video's poster is a picture, so it stands with the images. */
export const MEDIA_FOLDERS = {
  images: ['webp', 'svg', 'png', 'jpg', 'jpeg', 'gif', 'avif', 'ico'],
  files: ['pdf'],
  audio: ['mp3', 'm4a', 'aac', 'wav', 'ogg', 'flac'],
  video: ['mp4', 'webm'],
};

/** The folder of media/ a file goes in by its extension, or null for an extension media/ does not hold. */
export function mediaFolder(extension) {
  const ext = String(extension ?? '').toLowerCase();
  return Object.keys(MEDIA_FOLDERS).find((folder) => MEDIA_FOLDERS[folder].includes(ext)) ?? null;
}

/**
 * The path publishing writes a file to: its folder by kind, its slug and its content's hash, so the same content gives the same path.
 * @param {string} slug The file's slug (slugify)
 * @param {string} base64 The content, base64
 * @param {string} dataUrl The data URL, for the extension (mediaExtension)
 * @returns {string} `media/<folder>/<slug>-<hash>.<ext>`, without a leading slash
 */
export function mediaPath(slug, base64, dataUrl) {
  const ext = mediaExtension(dataUrl);
  return `media/${mediaFolder(ext) ?? 'files'}/${slug}-${contentHash(base64)}.${ext}`;
}

/** A path at the root of media/, outside the kind folders. */
const ROOT_MEDIA_RE = /^\/media\/([a-z0-9][a-z0-9._-]*)\.([a-z0-9]+)$/i;

/**
 * The path a file at the root of media/ takes in its folder: `/media/x.webp` gives `/media/images/x.webp`.
 * Null for a path in a folder or not a media path.
 * @param {string} path
 * @returns {string|null}
 */
export function tidiedMediaPath(path) {
  const m = String(path ?? '').match(ROOT_MEDIA_RE);
  if (!m) return null;
  const folder = mediaFolder(m[2]);
  return folder ? `/media/${folder}/${m[1]}.${m[2]}` : null;
}
