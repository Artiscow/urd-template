/**
 * A QR code encoder of Urd's own (ISO/IEC 18004), for the contact block's QR design: text in byte mode (UTF-8), error correction level M by default, the smallest version that holds it, and the mask with the lowest penalty.
 * Pure and DOM-free (tests/qr.test.mjs): `qrMatrix` gives the modules as rows of booleans (true is dark), `qrSvgPath` one SVG path for the dark ones.
 * Loaded by the block only for the QR design, so it stays outside the visitor closure.
 */

const LEVELS = { L: 0, M: 1, Q: 2, H: 3 };
/** The two format bits of each level, in the order of LEVELS. */
const FORMAT_LEVEL = [1, 0, 3, 2];

/** Error correction codewords per block, by level and version (index 0 unused). */
const ECC_PER_BLOCK = [
  [-1, 7, 10, 15, 20, 26, 18, 20, 24, 30, 18, 20, 24, 26, 30, 22, 24, 28, 30, 28, 28, 28, 28, 30, 30, 26, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
  [-1, 10, 16, 26, 18, 24, 16, 18, 22, 22, 26, 30, 22, 22, 24, 24, 28, 28, 26, 26, 26, 26, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28],
  [-1, 13, 22, 18, 26, 18, 24, 18, 22, 20, 24, 28, 26, 24, 20, 30, 24, 28, 28, 26, 30, 28, 30, 30, 30, 30, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
  [-1, 17, 28, 22, 16, 22, 28, 26, 26, 24, 28, 24, 28, 22, 24, 24, 30, 28, 28, 26, 28, 30, 24, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
];

/** Error correction blocks, by level and version (index 0 unused). */
const BLOCKS = [
  [-1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 4, 4, 4, 4, 4, 6, 6, 6, 6, 7, 8, 8, 9, 9, 10, 12, 12, 12, 13, 14, 15, 16, 17, 18, 19, 19, 20, 21, 22, 24, 25],
  [-1, 1, 1, 1, 2, 2, 4, 4, 4, 5, 5, 5, 8, 9, 9, 10, 10, 11, 13, 14, 16, 17, 17, 18, 20, 21, 23, 25, 26, 28, 29, 31, 33, 35, 37, 38, 40, 43, 45, 47, 49],
  [-1, 1, 1, 2, 2, 4, 4, 6, 6, 8, 8, 8, 10, 12, 16, 12, 17, 16, 18, 21, 20, 23, 23, 25, 27, 29, 34, 34, 35, 38, 40, 43, 45, 48, 51, 53, 56, 59, 62, 65, 68],
  [-1, 1, 1, 2, 4, 4, 4, 5, 6, 8, 8, 11, 11, 16, 16, 18, 16, 19, 21, 25, 25, 25, 34, 30, 32, 35, 37, 40, 42, 45, 48, 51, 54, 57, 60, 63, 66, 70, 74, 77, 81],
];

/** The modules a version has for data and error correction: the whole square less the function patterns. */
function rawModules(ver) {
  let n = (16 * ver + 128) * ver + 64;
  if (ver >= 2) {
    const align = Math.floor(ver / 7) + 2;
    n -= (25 * align - 10) * align - 55;
    if (ver >= 7) n -= 36;
  }
  return n;
}

/** The data codewords a version holds at a level. */
function dataCodewords(ver, level) {
  return Math.floor(rawModules(ver) / 8) - ECC_PER_BLOCK[level][ver] * BLOCKS[level][ver];
}

/** The centres of the alignment patterns along each axis. */
function alignmentPositions(ver) {
  if (ver === 1) return [];
  const count = Math.floor(ver / 7) + 2;
  const size = ver * 4 + 17;
  const step = ver === 32 ? 26 : Math.ceil((ver * 4 + 4) / (count * 2 - 2)) * 2;
  const out = [6];
  for (let pos = size - 7; out.length < count; pos -= step) out.splice(1, 0, pos);
  return out;
}

/** Multiplication in GF(2^8) over the QR polynomial 0x11D. */
function gfMul(x, y) {
  let z = 0;
  for (let i = 7; i >= 0; i--) {
    z = (z << 1) ^ ((z >>> 7) * 0x11d);
    z ^= ((y >>> i) & 1) * x;
  }
  return z;
}

/** The Reed-Solomon generator polynomial of a degree, highest term left out. */
function rsDivisor(degree) {
  const result = new Array(degree).fill(0);
  result[degree - 1] = 1;
  let root = 1;
  for (let i = 0; i < degree; i++) {
    for (let j = 0; j < degree; j++) {
      result[j] = gfMul(result[j], root);
      if (j + 1 < degree) result[j] ^= result[j + 1];
    }
    root = gfMul(root, 0x02);
  }
  return result;
}

/** The error correction codewords of a block. */
function rsRemainder(data, divisor) {
  const result = new Array(divisor.length).fill(0);
  for (const byte of data) {
    const factor = byte ^ result.shift();
    result.push(0);
    divisor.forEach((coef, i) => { result[i] ^= gfMul(coef, factor); });
  }
  return result;
}

/** The data codewords: the byte mode indicator, the length, the bytes, the terminator and the padding. */
function encodeData(bytes, ver, level) {
  const bits = [];
  const put = (value, length) => {
    for (let i = length - 1; i >= 0; i--) bits.push((value >>> i) & 1);
  };
  put(0b0100, 4);
  put(bytes.length, ver < 10 ? 8 : 16);
  for (const byte of bytes) put(byte, 8);
  const capacity = dataCodewords(ver, level) * 8;
  put(0, Math.min(4, capacity - bits.length));
  put(0, (8 - (bits.length % 8)) % 8);
  for (let pad = 0xec; bits.length < capacity; pad ^= 0xec ^ 0x11) put(pad, 8);
  const out = [];
  for (let i = 0; i < bits.length; i += 8) out.push(bits.slice(i, i + 8).reduce((acc, bit) => (acc << 1) | bit, 0));
  return out;
}

/** The codewords split into blocks, each given its error correction, and interleaved. */
function withEcc(data, ver, level) {
  const count = BLOCKS[level][ver];
  const eccLen = ECC_PER_BLOCK[level][ver];
  const raw = Math.floor(rawModules(ver) / 8);
  const short = count - (raw % count);
  const shortLen = Math.floor(raw / count);
  const divisor = rsDivisor(eccLen);
  const blocks = [];
  for (let i = 0, k = 0; i < count; i++) {
    const block = data.slice(k, k + shortLen - eccLen + (i < short ? 0 : 1));
    k += block.length;
    const ecc = rsRemainder(block, divisor);
    if (i < short) block.push(0);
    blocks.push(block.concat(ecc));
  }
  const out = [];
  for (let i = 0; i < blocks[0].length; i++) {
    blocks.forEach((block, j) => {
      // The short blocks' padding position is skipped.
      if (i !== shortLen - eccLen || j >= short) out.push(block[i]);
    });
  }
  return out;
}

/** The 15 format bits: the level and the mask with their BCH code, masked by 0x5412. */
function formatBits(level, mask) {
  const data = (FORMAT_LEVEL[level] << 3) | mask;
  let rem = data;
  for (let i = 0; i < 10; i++) rem = (rem << 1) ^ ((rem >>> 9) * 0x537);
  return ((data << 10) | rem) ^ 0x5412;
}

/** Both copies of the format bits, and the dark module beside the lower one. */
function drawFormat(set, size, level, mask) {
  const bits = formatBits(level, mask);
  const bit = (i) => ((bits >>> i) & 1) === 1;
  for (let i = 0; i <= 5; i++) set(8, i, bit(i));
  set(8, 7, bit(6));
  set(8, 8, bit(7));
  set(7, 8, bit(8));
  for (let i = 9; i < 15; i++) set(14 - i, 8, bit(i));
  for (let i = 0; i < 8; i++) set(size - 1 - i, 8, bit(i));
  for (let i = 8; i < 15; i++) set(8, size - 15 + i, bit(i));
  set(8, size - 8, true);
}

/** Both copies of the version bits, from version 7. */
function drawVersion(set, size, ver) {
  let rem = ver;
  for (let i = 0; i < 12; i++) rem = (rem << 1) ^ ((rem >>> 11) * 0x1f25);
  const bits = (ver << 12) | rem;
  for (let i = 0; i < 18; i++) {
    const dark = ((bits >>> i) & 1) === 1;
    const a = size - 11 + (i % 3);
    const b = Math.floor(i / 3);
    set(a, b, dark);
    set(b, a, dark);
  }
}

/** The eight masks, by column x and row y. */
const MASKS = [
  (x, y) => (x + y) % 2 === 0,
  (x, y) => y % 2 === 0,
  (x) => x % 3 === 0,
  (x, y) => (x + y) % 3 === 0,
  (x, y) => (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0,
  (x, y) => ((x * y) % 2) + ((x * y) % 3) === 0,
  (x, y) => (((x * y) % 2) + ((x * y) % 3)) % 2 === 0,
  (x, y) => (((x + y) % 2) + ((x * y) % 3)) % 2 === 0,
];

/** One row or column's penalty: runs of five or more of one colour, and patterns like a finder's with four light modules on a side (the quiet zone counts as light). */
function linePenalty(get, size) {
  let score = 0;
  let run = 1;
  for (let i = 1; i <= size; i++) {
    if (i < size && get(i) === get(i - 1)) run++;
    else {
      if (run >= 5) score += run - 2;
      run = 1;
    }
  }
  const light = (i) => i < 0 || i >= size || !get(i);
  for (let i = 0; i + 7 <= size; i++) {
    if (get(i) && !get(i + 1) && get(i + 2) && get(i + 3) && get(i + 4) && !get(i + 5) && get(i + 6)) {
      if ([1, 2, 3, 4].every((k) => light(i - k))) score += 40;
      if ([7, 8, 9, 10].every((k) => light(i + k))) score += 40;
    }
  }
  return score;
}

/** The standard's penalty for a masked symbol: runs, finder-like patterns, 2x2 blocks and the balance of dark and light. */
function penalty(m) {
  const size = m.length;
  let score = 0;
  let dark = 0;
  for (let y = 0; y < size; y++) {
    score += linePenalty((i) => m[y][i], size);
    score += linePenalty((i) => m[i][y], size);
    for (let x = 0; x < size; x++) {
      if (m[y][x]) dark++;
      if (x + 1 < size && y + 1 < size && m[y][x] === m[y][x + 1] && m[y][x] === m[y + 1][x] && m[y][x] === m[y + 1][x + 1]) score += 3;
    }
  }
  return score + 10 * Math.floor(Math.abs((dark * 100) / (size * size) - 50) / 5);
}

/**
 * The QR code for a text: rows of modules, true for dark, without the quiet zone; null when the text is longer than version 40 holds.
 * @param {string} text
 * @param {'L'|'M'|'Q'|'H'} [levelName] the error correction level, M by default
 * @returns {boolean[][]|null}
 */
export function qrMatrix(text, levelName = 'M') {
  const level = LEVELS[levelName] ?? LEVELS.M;
  const bytes = Array.from(new TextEncoder().encode(String(text ?? '')));
  let ver = 1;
  while (ver <= 40 && 4 + (ver < 10 ? 8 : 16) + bytes.length * 8 > dataCodewords(ver, level) * 8) ver++;
  if (ver > 40) return null;
  const size = ver * 4 + 17;
  const modules = Array.from({ length: size }, () => new Array(size).fill(false));
  const fixed = Array.from({ length: size }, () => new Array(size).fill(false));
  const set = (x, y, isDark) => {
    modules[y][x] = isDark;
    fixed[y][x] = true;
  };
  for (let i = 0; i < size; i++) {
    set(6, i, i % 2 === 0);
    set(i, 6, i % 2 === 0);
  }
  for (const [cx, cy] of [[3, 3], [size - 4, 3], [3, size - 4]]) {
    for (let dy = -4; dy <= 4; dy++) {
      for (let dx = -4; dx <= 4; dx++) {
        const x = cx + dx;
        const y = cy + dy;
        if (x < 0 || y < 0 || x >= size || y >= size) continue;
        const ring = Math.max(Math.abs(dx), Math.abs(dy));
        set(x, y, ring !== 2 && ring !== 4);
      }
    }
  }
  const align = alignmentPositions(ver);
  const last = align.length - 1;
  for (let i = 0; i <= last; i++) {
    for (let j = 0; j <= last; j++) {
      // The three corners with a finder pattern have none.
      if ((i === 0 && j === 0) || (i === 0 && j === last) || (i === last && j === 0)) continue;
      for (let dy = -2; dy <= 2; dy++) {
        for (let dx = -2; dx <= 2; dx++) set(align[i] + dx, align[j] + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
      }
    }
  }
  // The format area is reserved now and written with the chosen mask below.
  drawFormat(set, size, level, 0);
  if (ver >= 7) drawVersion(set, size, ver);

  const codewords = withEcc(encodeData(bytes, ver, level), ver, level);
  let bit = 0;
  for (let right = size - 1; right >= 1; right -= 2) {
    // The vertical timing pattern's column is skipped.
    if (right === 6) right = 5;
    for (let vert = 0; vert < size; vert++) {
      for (let j = 0; j < 2; j++) {
        const x = right - j;
        const upward = ((right + 1) & 2) === 0;
        const y = upward ? size - 1 - vert : vert;
        if (fixed[y][x] || bit >= codewords.length * 8) continue;
        modules[y][x] = ((codewords[bit >>> 3] >>> (7 - (bit & 7))) & 1) === 1;
        bit++;
      }
    }
  }

  let best = null;
  let bestScore = Infinity;
  for (let mask = 0; mask < 8; mask++) {
    const trial = modules.map((row) => row.slice());
    const flip = MASKS[mask];
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) if (!fixed[y][x] && flip(x, y)) trial[y][x] = !trial[y][x];
    }
    drawFormat((x, y, isDark) => { trial[y][x] = isDark; }, size, level, mask);
    const score = penalty(trial);
    if (score < bestScore) {
      best = trial;
      bestScore = score;
    }
  }
  return best;
}

/**
 * The dark modules as one SVG path in module units, each horizontal run one rectangle, for a viewBox of the matrix's size (plus the quiet zone the drawing adds around it).
 * @param {boolean[][]} matrix
 * @returns {string}
 */
export function qrSvgPath(matrix) {
  let d = '';
  matrix.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      if (!row[x]) continue;
      let end = x;
      while (end + 1 < row.length && row[end + 1]) end++;
      const run = end - x + 1;
      d += `M${x} ${y}h${run}v1h-${run}z`;
      x = end;
    }
  });
  return d;
}
