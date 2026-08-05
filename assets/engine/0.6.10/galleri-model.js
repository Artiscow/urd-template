/**
 * Ren logikk for galleri-blokken, lightboxen og bildegalleri-bakgrunnslaget:
 * indeks-stepping, autoplay-vilkår og kolonneberegning. DOM-fri, så alt
 * testes med node --test (tests/galleri.test.mjs); DOM-rendering testes manuelt.
 */

/** Neste/forrige indeks med rundgang begge veier. Tom liste gir alltid 0. */
export function stepIndex(current, delta, count) {
  if (!Number.isFinite(count) || count < 1) return 0;
  const base = Number.isFinite(current) ? current : 0;
  return ((((base + delta) % count) + count) % count);
}

/** Om automatisk fremrykk er lov: aldri med under to bilder, aldri ved redusert bevegelse. */
export function canAutoplay({ count = 0, reducedMotion = false } = {}) {
  return count >= 2 && !reducedMotion;
}

/** Sekunder mellom bytter, med gulv og trygg standard for søppelverdier. */
export function normalizeInterval(seconds, { min = 2, fallback = 5 } = {}) {
  const n = Number(seconds);
  if (!Number.isFinite(n) || n <= 0) return fallback;
  return Math.max(min, n);
}

/** Effektivt kolonnetall for rutenettet: 1..6, aldri flere enn bildene, maks 2 på mobil. */
export function gridColumns(columns, count, viewport) {
  const n = Number(columns);
  let cols = Number.isFinite(n) && n >= 1 ? Math.min(6, Math.round(n)) : 3;
  if (count > 0) cols = Math.min(cols, count);
  if (viewport === 'mobile') cols = Math.min(cols, 2);
  return Math.max(1, cols);
}
