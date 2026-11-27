/**
 * A shape (ADR-0035): one closed outline in a 100 by 100 box, from its values or from a list of points, and the place of the mark on it; pure.
 * Notes: docs/engine-notes/shape-model.md (Urd repository).
 */

const TAU = Math.PI * 2;
const TOP = -Math.PI / 2;
const rad = (deg) => (deg * Math.PI) / 180;
const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

/** The values of a shape that sets nothing: a circle. */
export const SHAPE_BLANK = { sides: 0, square: 0, corners: 40, cornerStyle: 'round', bulge: 0, turn: 0, stretch: 0, waves: 0, count: 8, sharp: 30, waveStyle: 'round', alt: 0, swirl: 0, point: 0, dir: 0, wobble: 0, seed: 1 };

/** The sides a polygon can have; 0 is the round outline. */
export const SHAPE_SIDES = [0, 3, 4, 5, 6, 8, 10, 12];
/** A corner's styles, of a polygon's corners and of a drawn point's. */
export const SHAPE_CORNERS = ['round', 'cut', 'scoop'];
/** The waves' styles: a wave, a flat-topped cog, or scooped inward between points. */
export const SHAPE_WAVES = ['round', 'cog', 'scoop'];
/** Each value's range. */
export const SHAPE_RANGES = { square: [0, 100], corners: [0, 100], bulge: [-100, 100], turn: [0, 60], stretch: [-60, 60], waves: [0, 100], count: [3, 18], sharp: [0, 100], alt: [0, 100], swirl: [-100, 100], point: [0, 100], dir: [0, 3], wobble: [0, 100], seed: [1, 9999] };
/** The fewest and the most points a drawn shape has. */
export const SHAPE_POINTS = { min: 3, max: 40 };

/**
 * How far the waves, the point and the turn go: waves end earlier on a polygon of few sides, the point on deep waves, and a turn at half a side.
 * @param {{sides: number, waves: number}} values
 * @returns {{waves: number, point: number, turn: number}}
 */
export function shapeLimits(values) {
  const sides = values.sides || 0;
  return {
    waves: sides === 0 ? 100 : sides >= 8 ? 70 : sides >= 5 ? 50 : 35,
    point: values.waves > 50 ? 40 : 100,
    turn: sides ? Math.round(180 / sides) : 0,
  };
}

/**
 * A shape as it applies: every value within its range and its limits, the points and the mark's place where they are valid.
 * @param {object|null|undefined} raw
 * @returns {typeof SHAPE_BLANK & {points: Array<{x: number, y: number, size: number, style: string}>|null, icon: [number, number]|null}}
 */
export function shapeOf(raw) {
  const src = raw && typeof raw === 'object' ? raw : {};
  const out = { ...SHAPE_BLANK };
  out.sides = SHAPE_SIDES.includes(src.sides) ? src.sides : 0;
  out.cornerStyle = SHAPE_CORNERS.includes(src.cornerStyle) ? src.cornerStyle : 'round';
  out.waveStyle = SHAPE_WAVES.includes(src.waveStyle) ? src.waveStyle : 'round';
  for (const [key, [min, max]] of Object.entries(SHAPE_RANGES)) {
    const n = Number(src[key]);
    if (src[key] != null && src[key] !== '' && Number.isFinite(n)) out[key] = clamp(Math.round(n), min, max);
  }
  const limits = shapeLimits(out);
  out.waves = Math.min(out.waves, limits.waves);
  out.point = Math.min(out.point, limits.point);
  out.turn = Math.min(out.turn, limits.turn);
  const points = Array.isArray(src.points) ? src.points.filter((p) => Array.isArray(p) && Number.isFinite(Number(p[0])) && Number.isFinite(Number(p[1]))).slice(0, SHAPE_POINTS.max) : [];
  out.points = points.length >= SHAPE_POINTS.min
    ? points.map((p) => ({ x: clamp(Number(p[0]), 0, 100), y: clamp(Number(p[1]), 0, 100), size: clamp(Math.round(Number(p[2]) || 0), 0, 100), style: SHAPE_CORNERS.includes(p[3]) ? p[3] : 'round' }))
    : null;
  out.icon = Array.isArray(src.icon) && Number.isFinite(Number(src.icon[0])) && Number.isFinite(Number(src.icon[1])) ? [clamp(Number(src.icon[0]), 0, 100), clamp(Number(src.icon[1]), 0, 100)] : null;
  return out;
}

/**
 * A shape as stored: only what differs from the blank shape, the points as `[x, y, size, style]` and the mark's place rounded; an empty object is the circle.
 * @param {ReturnType<typeof shapeOf>} shape
 * @returns {object}
 */
export function shapeStored(shape) {
  const out = {};
  for (const key of Object.keys(SHAPE_BLANK)) if (shape[key] !== SHAPE_BLANK[key]) out[key] = shape[key];
  // What only shows with another value is not kept without it.
  if (!out.sides) { delete out.corners; delete out.cornerStyle; delete out.bulge; delete out.turn; } else delete out.square;
  if (!out.waves) { delete out.count; delete out.sharp; delete out.waveStyle; delete out.alt; delete out.swirl; }
  if (!out.point) delete out.dir;
  if (!out.wobble) delete out.seed;
  if (shape.points) out.points = shape.points.map((p) => [Math.round(p.x * 10) / 10, Math.round(p.y * 10) / 10, p.size, p.style]);
  if (shape.icon) out.icon = [Math.round(shape.icon[0]), Math.round(shape.icon[1])];
  return out;
}

/** The outline through points, each with its own corner: its size as a share of the edges it meets, and round, cut or scooped. */
function cornered(points) {
  const out = [];
  const n = points.length;
  const at = (a, b, t) => [a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t];
  for (let i = 0; i < n; i++) {
    const p = points[(i - 1 + n) % n], q = points[i], r = points[(i + 1) % n];
    const k = ((q.size ?? 0) / 100) * 0.5;
    if (k <= 0) { out.push([q.x, q.y]); continue; }
    const a = at(q, p, k), b = at(q, r, k);
    if (q.style === 'cut') { out.push(a, b); continue; }
    // A round corner curves towards the point, a scooped one away from it.
    const c = q.style === 'scoop' ? [a[0] + b[0] - q.x, a[1] + b[1] - q.y] : [q.x, q.y];
    for (let s = 0; s <= 12; s++) {
      const t = s / 12;
      out.push([(1 - t) * (1 - t) * a[0] + 2 * (1 - t) * t * c[0] + t * t * b[0], (1 - t) * (1 - t) * a[1] + 2 * (1 - t) * t * c[1] + t * t * b[1]]);
    }
  }
  return out;
}

/** A round outline of radius 1, from a circle to nearly a square as its squareness goes. */
function superellipse(square) {
  const n = 2 + (square / 100) * 6;
  return Array.from({ length: 240 }, (_, i) => {
    const t = (i / 240) * TAU, c = Math.cos(t), s = Math.sin(t);
    return [Math.sign(c) * Math.abs(c) ** (2 / n), Math.sign(s) * Math.abs(s) ** (2 / n)];
  });
}

/** Points evenly along an outline, so the edge's waves have enough of them on a straight side. */
function resample(pts, count) {
  const seg = [];
  let total = 0;
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i], b = pts[(i + 1) % pts.length];
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    seg.push(len);
    total += len;
  }
  const out = [];
  let i = 0, acc = 0;
  for (let k = 0; k < count; k++) {
    const want = (k / count) * total;
    while (acc + seg[i] < want && i < seg.length - 1) { acc += seg[i]; i++; }
    const a = pts[i], b = pts[(i + 1) % pts.length], t = seg[i] ? (want - acc) / seg[i] : 0;
    out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
  }
  return out;
}

const radial = (pts, factor) => pts.map(([x, y]) => { const k = factor(Math.atan2(y, x)); return [x * k, y * k]; });

/** An outline scaled into the box, its larger side filling it but for the margin, in the box's middle. */
function fit(pts, margin) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const [x, y] of pts) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); }
  const s = (100 - 2 * margin) / Math.max(x1 - x0, y1 - y0), cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
  return pts.map(([x, y]) => [50 + (x - cx) * s, 50 + (y - cy) * s]);
}

/** A seeded run of numbers from 0 to 1 (mulberry32): the same seed gives the same wobble. */
function seeded(seed) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** The outline of a shape's values: the round or polygon outline, then its sides' bulge, its waves, its point, its wobble and its stretch, fitted to the box. */
function valuesOutline(p, margin) {
  const sides = p.sides;
  const ref = TOP + (sides ? rad(p.turn) : 0);
  let pts = sides
    ? cornered(Array.from({ length: sides }, (_, i) => { const a = ref + (i * TAU) / sides; return { x: Math.cos(a), y: Math.sin(a), size: p.corners, style: p.cornerStyle }; }))
    : superellipse(p.square);
  pts = resample(pts, 360);
  if (sides && p.bulge) pts = radial(pts, (th) => 1 + ((p.bulge / 100) * 0.22 * (1 - Math.cos(sides * (th - ref)))) / 2);
  if (p.waves) {
    const depth = (p.waves / 100) * 0.5;
    pts = radial(pts, (th) => {
      const a = ((th - ref) / TAU) * p.count;
      const wave = Math.floor(a + 0.5);
      // The place within one wave, 0 at its crest; a swirl leans it to one side.
      let ph = a - wave;
      ph += ((p.swirl / 100) * 0.9 * Math.sin(TAU * ph)) / TAU;
      const u = Math.cos(TAU * ph);
      let crest = p.waveStyle === 'cog' ? clamp(0.5 + u * (1 + (p.sharp / 100) * 7), 0, 1)
        : p.waveStyle === 'scoop' ? 1 - Math.abs(Math.sin(Math.PI * ph)) ** (1 / (1 + (p.sharp / 100) * 1.5))
          : ((1 + u) / 2) ** (1 + (p.sharp / 100) * 7);
      // Every other wave is the shorter one.
      if ((((wave % p.count) + p.count) % p.count) % 2 === 1) crest *= 1 - (p.alt / 100) * 0.65;
      return 1 - depth * (1 - crest);
    });
  }
  if (p.point) {
    const at = TOP + (p.dir * Math.PI) / 2, pull = (p.point / 100) * 0.95;
    pts = radial(pts, (th) => {
      let d = Math.abs(th - at) % TAU;
      if (d > Math.PI) d = TAU - d;
      const fall = Math.max(0, 1 - d / (Math.PI * 0.55));
      return 1 + pull * fall * fall;
    });
  }
  if (p.wobble) {
    const next = seeded(p.seed * 7919);
    const parts = [2, 3, 4, 5].map((k) => [k, 0.4 + next(), next() * TAU]);
    const sum = parts.reduce((n, [, amp]) => n + amp, 0);
    pts = radial(pts, (th) => 1 + ((p.wobble / 100) * 0.3 * parts.reduce((n, [k, amp, phase]) => n + amp * Math.sin(k * th + phase), 0)) / sum);
  }
  if (p.stretch) {
    const sx = 1 + (Math.max(0, p.stretch) / 100) * 0.9, sy = 1 + (Math.max(0, -p.stretch) / 100) * 0.9;
    pts = pts.map(([x, y]) => [x * sx, y * sy]);
  }
  return fit(pts, margin);
}

/**
 * A shape's outline as points in the 100 by 100 box, from its points where it has them, else from its values; `margin` keeps it that far inside the box.
 * @param {ReturnType<typeof shapeOf>} shape
 * @param {number} [margin]
 * @returns {Array<[number, number]>}
 */
export function shapeOutline(shape, margin = 0) {
  if (!shape.points) return valuesOutline(shape, margin);
  const s = (100 - 2 * margin) / 100;
  return cornered(shape.points).map(([x, y]) => [50 + (x - 50) * s, 50 + (y - 50) * s]);
}

/**
 * An outline as an SVG path.
 * @param {Array<[number, number]>} pts
 * @returns {string}
 */
export function outlinePath(pts) {
  return `M ${pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(' L ')} Z`;
}

/**
 * An outline's middle by its area, where a mark on the shape stands; one of little area takes its bounding box's middle, and the middle stays inside that box.
 * @param {Array<[number, number]>} pts
 * @returns {[number, number]}
 */
export function outlineMiddle(pts) {
  let area = 0, cx = 0, cy = 0;
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (let i = 0; i < pts.length; i++) {
    const [ax, ay] = pts[i], [bx, by] = pts[(i + 1) % pts.length];
    const f = ax * by - bx * ay;
    area += f; cx += (ax + bx) * f; cy += (ay + by) * f;
    x0 = Math.min(x0, ax); y0 = Math.min(y0, ay); x1 = Math.max(x1, ax); y1 = Math.max(y1, ay);
  }
  const room = (x1 - x0) * (y1 - y0);
  if (!(room > 0) || Math.abs(area / 2) < room * 0.15) return room > 0 ? [(x0 + x1) / 2, (y0 + y1) / 2] : [50, 50];
  return [clamp(cx / (3 * area), x0, x1), clamp(cy / (3 * area), y0, y1)];
}

/**
 * A shape's values as points to shape by hand: one on each crest and dip of a waved edge, else a polygon's corners, or eight round ones, a drawn point's sharper.
 * @param {ReturnType<typeof shapeOf>} shape
 * @returns {Array<{x: number, y: number, size: number, style: string}>}
 */
export function shapeToPoints(shape) {
  const p = { ...shape, points: null };
  const ref = TOP + (p.sides ? rad(p.turn) : 0);
  const pick = (pts, angle) => {
    let best = pts[0], far = Infinity;
    for (const q of pts) {
      let d = Math.abs(Math.atan2(q[1] - 50, q[0] - 50) - angle) % TAU;
      if (d > Math.PI) d = TAU - d;
      if (d < far) { far = d; best = q; }
    }
    return best;
  };
  const point = (q, size, style = 'round') => ({ x: Math.round(q[0] * 10) / 10, y: Math.round(q[1] * 10) / 10, size, style });
  if (p.waves) {
    const out = valuesOutline(p, 0), scoop = p.waveStyle === 'scoop';
    return Array.from({ length: p.count * 2 }, (_, i) => point(pick(out, ref + (i * TAU) / (p.count * 2)), i % 2 === 0 ? (scoop ? 0 : Math.round(clamp(100 - p.sharp * 1.3, 0, 100))) : 100));
  }
  if (p.sides) {
    const out = valuesOutline({ ...p, corners: 0 }, 0);
    return Array.from({ length: p.sides }, (_, i) => point(pick(out, ref + (i * TAU) / p.sides), p.corners, p.cornerStyle));
  }
  const out = valuesOutline(p, 0), at = TOP + (p.dir * Math.PI) / 2;
  return Array.from({ length: 8 }, (_, i) => point(pick(out, at + (i * TAU) / 8), i === 0 && p.point ? Math.round(100 - p.point) : 100));
}

/** The shapes Urd ships with, each a set of values; the first is the circle. */
export const SHAPES = [
  ['circle', {}],
  ['squircle', { square: 70 }],
  ['roundedSquare', { sides: 4, corners: 55, turn: 45 }],
  ['square', { sides: 4, corners: 14, turn: 45 }],
  ['diamond', { sides: 4, corners: 28 }],
  ['oval', { stretch: 45 }],
  ['pillow', { sides: 4, corners: 40, turn: 45, bulge: 80 }],
  ['pinched', { sides: 4, corners: 12, turn: 45, bulge: -85 }],
  ['triangle', { sides: 3, corners: 42 }],
  ['pentagon', { sides: 5, corners: 30 }],
  ['hexagon', { sides: 6, corners: 28, turn: 30 }],
  ['octagon', { sides: 8, corners: 18, turn: 22 }],
  ['bevel', { sides: 4, corners: 40, turn: 45, cornerStyle: 'cut' }],
  ['ticket', { sides: 4, corners: 36, turn: 45, cornerStyle: 'scoop' }],
  ['cookie', { waves: 14, count: 6, sharp: 0 }],
  ['scallop', { waves: 9, count: 14, sharp: 0 }],
  ['flower', { waves: 40, count: 8, sharp: 0 }],
  ['sunburst', { waves: 26, count: 16, sharp: 75 }],
  ['star', { waves: 100, count: 5, sharp: 100 }],
  ['cog', { waves: 20, count: 10, waveStyle: 'cog', sharp: 45 }],
  ['stamp', { waves: 10, count: 18, waveStyle: 'scoop', sharp: 0 }],
  ['compass', { waves: 88, count: 8, sharp: 100, alt: 75 }],
  ['pinwheel', { waves: 42, count: 8, sharp: 25, swirl: 85 }],
  ['saw', { waves: 24, count: 14, sharp: 60, swirl: 95 }],
  ['drop', { point: 70 }],
  ['spire', { square: 55, point: 55 }],
  ['house', { sides: 5, corners: 22, point: 20 }],
  ['peak', { sides: 3, corners: 70, point: 30 }],
  ['pebble', { wobble: 45, seed: 7 }],
  ['blob', { wobble: 95, seed: 23 }],
  ['splat', { waves: 22, count: 7, sharp: 0, wobble: 70, seed: 5 }],
];

/**
 * The shipped shape a shape's values are, by its id, or null for values of the owner's own or a drawn shape.
 * @param {ReturnType<typeof shapeOf>} shape
 * @returns {string|null}
 */
export function shapeId(shape) {
  if (shape.points) return null;
  const mine = JSON.stringify(shapeStored({ ...shape, icon: null }));
  const hit = SHAPES.find(([, values]) => JSON.stringify(shapeStored(shapeOf(values))) === mine);
  return hit ? hit[0] : null;
}
