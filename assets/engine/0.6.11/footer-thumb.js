/**
 * Schematisk SVG-miniatyr av et footer-oppsett, til den visuelle mal-velgeren
 * i admin. Ren streng-bygging (ingen DOM), analog til preset-thumb.js. Tar en
 * liten beskrivelse (ikke hele footer-konfigen): layout-flagg + antall.
 *
 * @param {{center?: boolean, row?: boolean, mega?: boolean, fat?: boolean,
 *   bigcta?: boolean, tag?: boolean, cta?: boolean, cols?: number,
 *   social?: number, baselineLinks?: number}} [d]
 * @returns {string} inline <svg>
 */
export function footerThumb(d = {}) {
  const acc = '#2fd6b6';
  const mut = '#5c6b64';
  const bg = d.mega ? '#16221d' : '#0e1512';
  const cols = d.cols ?? 0;
  const social = d.social ?? 0;
  let s = `<svg viewBox="0 0 160 80" preserveAspectRatio="none" aria-hidden="true"><rect width="160" height="80" fill="${bg}"/>`;
  if (d.mega) s += `<circle cx="20" cy="6" r="34" fill="${acc}" opacity="0.18"/>`;

  // Stor CTA: sentrert overskrift-strek + underlinje + knapp, egen bunnlinje.
  if (d.bigcta) {
    s += `<rect x="45" y="18" width="70" height="8" rx="3" fill="${mut}" opacity="0.85"/>`;
    s += `<rect x="56" y="32" width="48" height="4" rx="2" fill="${mut}" opacity="0.5"/>`;
    s += `<rect x="62" y="43" width="36" height="10" rx="3" fill="${acc}"/>`;
    s += baseline(mut, d.baselineLinks);
    return s + '</svg>';
  }

  // Merke (venstre, eller sentrert øverst).
  const cx = d.center ? 80 : 16;
  s += `<rect x="${cx - (d.center ? 9 : 0)}" y="14" width="18" height="6" rx="2" fill="${acc}"/>`;
  if (d.tag) s += `<rect x="${d.center ? cx - 22 : 16}" y="24" width="44" height="3" rx="1.5" fill="${mut}" opacity="0.6"/>`;

  // Nyhetsbrev-CTA: e-postfelt-strek + knapp.
  if (d.cta) {
    s += `<rect x="16" y="31" width="40" height="8" rx="2" fill="none" stroke="${mut}" stroke-width="1" opacity="0.7"/>`;
    s += `<rect x="58" y="31" width="16" height="8" rx="2" fill="${acc}"/>`;
  }

  if (d.row) {
    // Doormat: én sentrert lenkerad.
    s += `<g fill="${mut}" opacity="0.7">` +
      [0, 1, 2, 3].map((i) => `<rect x="${44 + i * 20}" y="40" width="14" height="4" rx="2"/>`).join('') + '</g>';
  } else if (cols) {
    // Lenkekolonner, høyrejustert bunt.
    const startX = 160 - cols * 30 - 6;
    for (let c = 0; c < cols; c++) {
      const x = startX + c * 30;
      s += `<rect x="${x}" y="16" width="16" height="3" rx="1.5" fill="${acc}" opacity="0.8"/>`;
      for (let r = 0; r < 3; r++) {
        s += `<rect x="${x}" y="${24 + r * 7}" width="22" height="3" rx="1.5" fill="${mut}" opacity="0.6"/>`;
      }
    }
  }

  // Sosiale ikoner (små rammer).
  const sx = d.center ? 80 - (social * 9) / 2 : 16;
  for (let i = 0; i < social; i++) {
    s += `<rect x="${sx + i * 9}" y="52" width="6.5" height="6.5" rx="2" fill="none" stroke="${mut}" stroke-width="1"/>`;
  }

  s += baseline(mut, d.baselineLinks);
  return s + '</svg>';
}

/** Bunnlinje: skillestrek, copyright-strek til venstre, valgfrie høyre-lenker. */
function baseline(mut, rt = 0) {
  let s = `<line x1="8" y1="66" x2="152" y2="66" stroke="${mut}" stroke-width="0.6" opacity="0.5"/>`;
  s += `<rect x="8" y="70" width="40" height="3" rx="1.5" fill="${mut}" opacity="0.6"/>`;
  if (rt) {
    s += `<g fill="${mut}" opacity="0.6">` +
      Array.from({ length: rt }, (_, i) => `<rect x="${120 - i * 16}" y="70" width="12" height="3" rx="1.5"/>`).join('') + '</g>';
  }
  return s;
}
