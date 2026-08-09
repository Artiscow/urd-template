/**
 * Ren logikk for toppkant-draget på seksjoner: seksjonen vokser/krymper
 * i TOPPEN, og alle blokkene forskyves tilsvarende slik at innholdet
 * står visuelt stille (blokkenes y måles fra seksjonstoppen). Naboene
 * røres aldri. DOM-fri så klemmene kan kontraktstestes
 * (tests/section-size.test.mjs); preview-edit.js eier selve draget.
 */

/**
 * @param {{
 *   dyPointer: number,       // px pekeren er dratt: > 0 = NED (krymp), < 0 = OPP (voks)
 *   minHeightPx: number,     // seksjonens målte høyde ved dra-start
 *   blockYs: number[],       // alle blokkenes desktop-y ved dra-start
 *   grid: { size: number, snap?: boolean },
 *   free?: boolean           // Shift holdes: piksel-presist, ingen snapping
 * }} p
 * @returns {{ dy: number, minHeightPx: number }}
 *   dy = px alle blokker skal flyttes (y += dy); minHeightPx = ny høyde.
 */
export function topDrag(p) {
  const size = p.grid?.size || 8;
  const snapFree = p.free || p.grid?.snap === false;
  let grow = -p.dyPointer;
  grow = snapFree ? Math.round(grow) : Math.round(grow / size) * size;

  if (grow < 0) {
    // Krymping tar luft OVENFRA: aldri mer enn at laveste blokk lander
    // på y=0, og aldri under minstehøyden. En blokk som allerede henger
    // over toppen (negativ y) stopper krymping via toppkanten helt -
    // den skal ikke skyves videre; bunnhåndtaket finnes fortsatt.
    const minY = p.blockYs.length ? Math.min(...p.blockYs) : Infinity;
    const room = Math.min(Math.max(0, minY), Math.max(0, p.minHeightPx - size * 3));
    // || 0 normaliserer -0 (klemt til stillstand) til 0.
    grow = Math.max(grow, -room) || 0;
  }

  return { dy: grow, minHeightPx: p.minHeightPx + grow };
}
