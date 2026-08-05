/**
 * Ren tilstandslogikk for sticky blokker («fest ved scrolling»): gitt
 * scrollposisjon og dokumentmål avgjøres om blokken skal stå i sin
 * vanlige absolutte posisjon (static), festes ved vindustoppen (fixed)
 * eller parkeres ved slippgrensen (parked). DOM-arbeidet bor i
 * sticky.js; denne modulen er DOM-fri og kontraktstestes i
 * tests/sticky.test.mjs.
 *
 * Festing er posisjonering, ikke animasjon (ingen transitions), så
 * prefers-reduced-motion krever ingen særbehandling her.
 */

/**
 * @param {number} scrollY
 * @param {{
 *   sectionTop: number,   // seksjonens topp i dokument-px
 *   blockY: number,       // blokkens desktop-y (seksjonsrelativ px)
 *   blockH: number,       // blokkens høyde i px
 *   limitBottom: number,  // slippgrensen i dokument-px: bunnen av until-
 *                         // seksjonen, eller egen seksjons bunn uten until
 *   offset: number        // ønsket avstand fra vindustoppen
 * }} m
 * @returns {{ mode: 'static' } | { mode: 'fixed', top: number } | { mode: 'parked', y: number }}
 *   parked.y er seksjonsrelativ px (kan overstige seksjonshøyden når
 *   until peker på en senere seksjon; seksjoner klipper aldri).
 */
export function stickyState(scrollY, m) {
  // Ugyldig eller for tidlig grense (over blokkens naturlige plass):
  // festing gir ikke mening, blokken står alltid der den står.
  const parkY = m.limitBottom - m.sectionTop - m.blockH;
  if (parkY < m.blockY) return { mode: 'static' };

  // Blokken har ikke nådd festepunktet ennå.
  if (m.sectionTop + m.blockY - scrollY >= m.offset) return { mode: 'static' };

  // Festet, så lenge det er plass mellom vindustoppen og slippgrensen.
  if (m.offset + m.blockH <= m.limitBottom - scrollY) return { mode: 'fixed', top: m.offset };

  // Slippgrensen er passert: blokken legges igjen ved grensen.
  return { mode: 'parked', y: parkY };
}
