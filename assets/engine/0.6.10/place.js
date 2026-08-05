/**
 * Ren plasseringslogikk for nye blokker: «+ Ny blokk» skal legge blokken
 * DER eieren klikket i seksjonen, ikke på en fast plass. Holdes DOM-fri
 * så matematikken kan kontraktstestes (tests/place.test.mjs).
 */

/**
 * Sentrerer en w×h-frame på et klikkpunkt, klemt innenfor seksjonen og
 * snappet til gridet. x/w er i prosent av seksjonsbredden, y/h/grid i px
 * (samme fysiske enheter som frames ellers, se docs/SKJEMA.md).
 *
 * @param {{ x: number, y: number, w: number, h: number, grid: { size: number, snap?: boolean }, snap?: boolean }} p
 *   x/y er klikkpunktet (seksjonsrelativt); p.snap === false gir fri plassering.
 * @returns {{ x: number, y: number }}
 */
export function frameAtPoint(p) {
  const r2 = (v) => Math.round(v * 100) / 100;
  const maxX = Math.max(0, r2(100 - p.w));
  const x = Math.min(maxX, Math.max(0, r2(p.x - p.w / 2)));
  let y = Math.max(0, p.y - p.h / 2);
  const free = p.snap === false || p.grid?.snap === false;
  const size = p.grid?.size || 8;
  y = free ? Math.round(y) : Math.round(y / size) * size;
  return { x, y: Math.max(0, y) };
}
