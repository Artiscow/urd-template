/**
 * Card styles: shadow, border and glass for box surfaces (the text box, the FAQ cards), built as style properties.
 * Without its fields a box keeps the plain look.
 * Notes: docs/engine-notes/box-style.md (Urd repository).
 */
import { resolveColor } from './theme.js';

// The shadow geometry (offset/blur) per strength; the color is optional (shadowColor), otherwise black at a typical transparency.
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
 * @returns {Record<string, string>} Style properties (camelCase) to lay on top of the base style.
 *   An empty object is the plain base style, and border undefined the theme's thin border.
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
  // Custom background color (block color).
  if (s.bg) css.background = resolveColor(s.bg);
  if (s.glass) {
    // Frosted glass: a translucent surface, tinted by the block colour where set, over a blurred backdrop; without backdrop-filter the surface remains.
    const base = s.bg ? resolveColor(s.bg) : 'var(--urd-color-surface)';
    css.background = `color-mix(in srgb, ${base} 55%, transparent)`;
    css.backdropFilter = 'blur(12px) saturate(1.4)';
    css.webkitBackdropFilter = css.backdropFilter;
  }
  return css;
}
