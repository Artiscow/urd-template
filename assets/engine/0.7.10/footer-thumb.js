/**
 * Schematic SVG thumbnail of a footer layout, for the visual template picker in
 * admin. Pure string building (no DOM), analogous to preset-thumb.js. Takes a
 * small description (not the whole footer config): layout flags plus counts.
 *
 * @param {{center?: boolean, row?: boolean, mega?: boolean, fat?: boolean,
 *   bigcta?: boolean, tag?: boolean, cta?: boolean, cols?: number,
 *   social?: number, baselineLinks?: number, chapters?: boolean, split?: boolean}} [d]
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

  // Big CTA: centered heading bar + underline + button, with its own baseline.
  if (d.bigcta) {
    s += `<rect x="45" y="18" width="70" height="8" rx="3" fill="${mut}" opacity="0.85"/>`;
    s += `<rect x="56" y="32" width="48" height="4" rx="2" fill="${mut}" opacity="0.5"/>`;
    s += `<rect x="62" y="43" width="36" height="10" rx="3" fill="${acc}"/>`;
    s += baseline(mut, d.baselineLinks);
    return s + '</svg>';
  }

  // Chapters: the brand on a row of its own, then numbered columns under a rule each.
  if (d.chapters) {
    s += `<rect x="12" y="10" width="20" height="6" rx="2" fill="${acc}"/>`;
    s += `<rect x="12" y="20" width="46" height="3" rx="1.5" fill="${mut}" opacity="0.6"/>`;
    const n = cols || 3;
    const w = (136 - (n - 1) * 8) / n;
    for (let c = 0; c < n; c++) {
      const x = 12 + c * (w + 8);
      s += `<line x1="${x}" y1="30" x2="${x + w}" y2="30" stroke="${mut}" stroke-width="0.8" opacity="0.7"/>`;
      s += `<rect x="${x}" y="34" width="9" height="6" rx="1.5" fill="${acc}"/>`;
      for (let r = 0; r < 3; r++) {
        s += `<rect x="${x}" y="${44 + r * 6}" width="${w * 0.7}" height="3" rx="1.5" fill="${mut}" opacity="0.6"/>`;
      }
    }
    s += baseline(mut, d.baselineLinks);
    return s + '</svg>';
  }

  // Split: the brand on a tinted panel over half the width, the columns in the other half.
  if (d.split) {
    s += `<rect x="8" y="8" width="70" height="52" rx="4" fill="${acc}" opacity="0.16"/>`;
    s += `<rect x="16" y="16" width="20" height="6" rx="2" fill="${acc}"/>`;
    s += `<rect x="16" y="26" width="46" height="3" rx="1.5" fill="${mut}" opacity="0.6"/>`;
    s += `<rect x="16" y="36" width="26" height="9" rx="3" fill="${acc}"/>`;
    const n = cols || 2;
    for (let c = 0; c < n; c++) {
      const x = 90 + c * 32;
      s += `<rect x="${x}" y="14" width="16" height="3" rx="1.5" fill="${acc}" opacity="0.8"/>`;
      for (let r = 0; r < 4; r++) {
        s += `<rect x="${x}" y="${22 + r * 7}" width="22" height="3" rx="1.5" fill="${mut}" opacity="0.6"/>`;
      }
    }
    s += baseline(mut, d.baselineLinks);
    return s + '</svg>';
  }

  // Brand (left, or centered at the top).
  const cx = d.center ? 80 : 16;
  s += `<rect x="${cx - (d.center ? 9 : 0)}" y="14" width="18" height="6" rx="2" fill="${acc}"/>`;
  if (d.tag) s += `<rect x="${d.center ? cx - 22 : 16}" y="24" width="44" height="3" rx="1.5" fill="${mut}" opacity="0.6"/>`;

  // Newsletter CTA: email field bar + button.
  if (d.cta) {
    s += `<rect x="16" y="31" width="40" height="8" rx="2" fill="none" stroke="${mut}" stroke-width="1" opacity="0.7"/>`;
    s += `<rect x="58" y="31" width="16" height="8" rx="2" fill="${acc}"/>`;
  }

  if (d.row) {
    // Doormat: one centered link row.
    s += `<g fill="${mut}" opacity="0.7">` +
      [0, 1, 2, 3].map((i) => `<rect x="${44 + i * 20}" y="40" width="14" height="4" rx="2"/>`).join('') + '</g>';
  } else if (cols) {
    // Link columns, right-aligned cluster.
    const startX = 160 - cols * 30 - 6;
    for (let c = 0; c < cols; c++) {
      const x = startX + c * 30;
      s += `<rect x="${x}" y="16" width="16" height="3" rx="1.5" fill="${acc}" opacity="0.8"/>`;
      for (let r = 0; r < 3; r++) {
        s += `<rect x="${x}" y="${24 + r * 7}" width="22" height="3" rx="1.5" fill="${mut}" opacity="0.6"/>`;
      }
    }
  }

  // Social icons (small frames).
  const sx = d.center ? 80 - (social * 9) / 2 : 16;
  for (let i = 0; i < social; i++) {
    s += `<rect x="${sx + i * 9}" y="52" width="6.5" height="6.5" rx="2" fill="none" stroke="${mut}" stroke-width="1"/>`;
  }

  s += baseline(mut, d.baselineLinks);
  return s + '</svg>';
}

/** Baseline: divider, copyright bar on the left, optional right-hand links. */
function baseline(mut, rt = 0) {
  let s = `<line x1="8" y1="66" x2="152" y2="66" stroke="${mut}" stroke-width="0.6" opacity="0.5"/>`;
  s += `<rect x="8" y="70" width="40" height="3" rx="1.5" fill="${mut}" opacity="0.6"/>`;
  if (rt) {
    s += `<g fill="${mut}" opacity="0.6">` +
      Array.from({ length: rt }, (_, i) => `<rect x="${120 - i * 16}" y="70" width="12" height="3" rx="1.5"/>`).join('') + '</g>';
  }
  return s;
}
