/**
 * Kortstiler: skygge, kantlinje og glass-effekt for boks-flater
 * (tekstboksen og FAQ-kortene). Ren funksjon som bygger style-egenskaper;
 * DOM-renderne bruker Object.assign(el.style, boxStyleCss(props.boxStyle)).
 *
 * Alle felt er additive med standardverdier som gir dagens utseende
 * (basisstilen i .urd-text-box), så eldre data rendres uendret.
 */
import { resolveColor } from './theme.js';

// Skygge-geometrien (forskyvning/uskarphet) per styrke; fargen er valgfri
// (shadowColor), ellers svart med typisk gjennomsiktighet.
const SHADOW_GEOM = {
  soft: '0 6px 20px',
  strong: '0 14px 40px',
};
const SHADOW_DEFAULT_COLOR = {
  soft: 'rgb(0 0 0 / 14%)',
  strong: 'rgb(0 0 0 / 30%)',
};

/**
 * @param {{shadow?: string, shadowColor?: string, border?: 'none'|{color?: string, width?: number}, bg?: string, glass?: boolean}|undefined} style
 * @returns {Record<string, string>} Style-egenskaper (camelCase) å legge PÅ basisstilen.
 *   Tomt objekt = ren basisstil. border: undefined = temaets tynne kantlinje (CSS-en).
 */
export function boxStyleCss(style) {
  const s = style ?? {};
  const css = {};
  if (SHADOW_GEOM[s.shadow]) {
    const color = s.shadowColor ? resolveColor(s.shadowColor) : SHADOW_DEFAULT_COLOR[s.shadow];
    css.boxShadow = `${SHADOW_GEOM[s.shadow]} ${color}`;
  }
  if (s.border === 'none') {
    css.border = 'none';
  } else if (s.border && typeof s.border === 'object') {
    css.border = `${s.border.width ?? 1}px solid ${resolveColor(s.border.color ?? 'accent')}`;
  }
  // Egen bakgrunnsfarge (blokkfarge).
  if (s.bg) css.background = resolveColor(s.bg);
  if (s.glass) {
    // Frostet glass: gjennomskinnelig flatefarge + uskarp bakgrunn. Er en
    // blokkfarge satt, tones glasset med DEN i stedet for temaets flate.
    // Uten backdrop-filter-støtte står den gjennomskinnelige flaten igjen
    // (gradvis degradering).
    const base = s.bg ? resolveColor(s.bg) : 'var(--urd-color-surface)';
    css.background = `color-mix(in srgb, ${base} 55%, transparent)`;
    css.backdropFilter = 'blur(12px) saturate(1.4)';
    css.webkitBackdropFilter = css.backdropFilter;
  }
  return css;
}
