/**
 * Ren typografilogikk for tekst-verktøylinjen («Office-linjen»):
 * størrelsessteg med klemming, innrykkssteg og fontstack-gjenkjenning.
 * Ingen DOM her; DOM-kirurgien (markør-normalisering) bor i
 * preview-edit.js og verifiseres i headless-nettleser.
 */
import { FONT_STACKS } from './fonts.js';

/** Grensene for skriftstørrelse på markering, i px. */
export const SIZE_MIN = 8;
export const SIZE_MAX = 120;

/** Rund av og klem til [SIZE_MIN, SIZE_MAX]; ugyldig tall gir null. */
export function clampSize(px) {
  const n = Math.round(Number(px));
  if (!Number.isFinite(n)) return null;
  return Math.min(SIZE_MAX, Math.max(SIZE_MIN, n));
}

/** Ett steg opp/ned fra en effektiv størrelse (delta i px, finjustering). */
export function stepSize(px, delta) {
  return clampSize(Number(px) + Number(delta));
}

/**
 * Størrelses-stigen A-opp/A-ned hopper gjennom, slik Word/LibreOffice gjør:
 * små steg nede, større steg oppe. Verdier utenfor stigen runder til
 * nærmeste trinn i steppretningen.
 */
export const SIZE_LADDER = [8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 32, 40, 48, 64, 80, 96, 120];

/** Neste trinn opp (dir 1) eller ned (dir -1) på størrelses-stigen. */
export function ladderStep(px, dir) {
  const cur = Number(px);
  if (!Number.isFinite(cur)) return clampSize(px);
  if (dir > 0) {
    const next = SIZE_LADDER.find((s) => s > cur);
    return next ?? SIZE_MAX;
  }
  const below = SIZE_LADDER.filter((s) => s < cur);
  return below.length ? below[below.length - 1] : SIZE_MIN;
}

/**
 * Linjeavstand-presetene i avstandsmenyen: [CSS-verdi, visningsnavn].
 * Tom verdi = Arv (fjerner overstyringen fra avsnittet).
 * @type {Array<[string, string]>}
 */
export const LINE_HEIGHTS = [
  ['', 'Arv'],
  ['1', '1,0'],
  ['1.15', '1,15'],
  ['1.5', '1,5'],
  ['2', '2,0'],
];

/** Innrykkssteget og taket, i em (relative steg følger skriftstørrelsen). */
export const INDENT_STEP_EM = 2;
export const INDENT_MAX_EM = 16;

/**
 * Ett innrykkssteg fra en marginLeft-verdi. Tom streng ved null innrykk
 * (style-attributtet kan droppes). Verdier i andre enheter enn em (f.eks.
 * gammel px-margin fra limt innhold) nullstilles og steppes fra 0.
 */
export function stepIndent(marginLeft, dir) {
  const m = /^(\d+(?:\.\d+)?)em$/.exec(String(marginLeft || '').trim());
  const cur = m ? Number(m[1]) : 0;
  const next = Math.min(INDENT_MAX_EM, Math.max(0, cur + dir * INDENT_STEP_EM));
  return next === 0 ? '' : `${next}em`;
}

/** Første fontnavn i en CSS-fontstack, normalisert (uten fnutter, små bokstaver). */
export function firstFamily(css) {
  const first = String(css || '').split(',')[0].trim().replace(/^['"]|['"]$/g, '');
  return first.toLowerCase();
}

/**
 * Finn FONT_STACKS-verdien hvis stack matcher en beregnet font-family
 * (sammenlignet på første fontnavn), ellers tom streng (vises som Arv).
 */
export function matchFontStack(css) {
  const wanted = firstFamily(css);
  if (!wanted) return '';
  const hit = FONT_STACKS.find(([, stack]) => firstFamily(stack) === wanted);
  return hit ? hit[1] : '';
}
