/**
 * Maps the theme's tokens to `--urd-<group>-<name>` on :root; a theme with `alt` has a light and a dark mode, a stored toggle choice winning over the OS's.
 * Notes: docs/engine-notes/theme.md (Urd repository).
 */

/** localStorage key for the visitor's active choice ('light'/'dark'). */
const MODE_KEY = 'urd-theme-mode';

/** Current mode in this session (null before the first applyTheme). */
let activeMode = null;

/**
 * Pure mode resolution: a stored choice wins, otherwise the OS preference.
 * @param {string|undefined} scheme theme.scheme ('light'/'dark', default light)
 * @param {string|null} stored Stored choice ('light'/'dark') or null
 * @param {boolean} prefersDark The visitor's prefers-color-scheme
 * @returns {'light'|'dark'}
 */
export function resolveThemeMode(scheme, stored, prefersDark) {
  if (stored === 'light' || stored === 'dark') return stored;
  // Else the OS preference, with an alt theme or without; `scheme` is not read here.
  return prefersDark ? 'dark' : 'light';
}

/**
 * A mode's tokens: the main ones, overridden group by group by the alt tokens when the mode is opposite the main scheme; without alt, the main ones.
 * @param {{tokens: object, scheme?: string, alt?: {tokens: object}}} theme
 * @param {'light'|'dark'} mode
 * @returns {Record<string, Record<string, string>>}
 */
export function activeTokens(theme, mode) {
  const main = theme.tokens || {};
  const mainScheme = theme.scheme === 'dark' ? 'dark' : 'light';
  if (!theme.alt?.tokens || mode === mainScheme) return main;
  const merged = {};
  for (const group of new Set([...Object.keys(main), ...Object.keys(theme.alt.tokens)])) {
    merged[group] = { ...main[group], ...theme.alt.tokens[group] };
  }
  return merged;
}

function readStoredMode() {
  // localStorage may be disabled (private mode); then the OS preference is followed.
  try { return localStorage.getItem(MODE_KEY); } catch { return null; }
}

/**
 * The theme's «Long words» (`theme.words`, ADR-0034) as CSS variables: kept whole, the standard, or hyphenated and broken where a word still does not fit.
 * @param {{words?: string}|null|undefined} theme
 * @returns {Record<string, string>}
 */
export function wordsVars(theme) {
  return theme?.words === 'hyphenate'
    ? { '--urd-text-hyphens': 'auto', '--urd-text-wrap': 'break-word' }
    : { '--urd-text-hyphens': 'manual', '--urd-text-wrap': 'normal' };
}

function applyTokens(tokens, root) {
  for (const [group, values] of Object.entries(tokens)) {
    for (const [name, value] of Object.entries(values)) {
      root.style.setProperty(`--urd-${group}-${name}`, value);
      // A base copy of each colour token (--urd-base-*) for the section role sets to read, so a role that swaps bg and text makes no var() cycle.
      if (group === 'color') root.style.setProperty(`--urd-base-${name}`, value);
    }
  }
}

/* Anchored allowlist (a CodeQL barrier) of colour, length and font stack characters, never ; { } < > : @; safeCssValue refuses url(), comments and expression too. */
const SAFE_CSS_VALUE = /^[a-zA-Z0-9#%.,()'"\s+\-*/]+$/;
/** A theme group's or token's name as it may stand in a custom property's name. */
const SAFE_CSS_NAME = /^[a-z0-9-]+$/i;
export function safeCssValue(value) {
  return typeof value === 'string'
    && SAFE_CSS_VALUE.test(value)
    && !/url\(|\/\*|\*\/|expression/i.test(value);
}

/**
 * The theme as static CSS (content/theme.css at publish), including the main tokens as single values and the colours that differ by mode as light-dark().
 * @param {{tokens: object, scheme?: string, alt?: {tokens: object}}} theme
 * @returns {string}
 */
export function buildThemeCss(theme) {
  const main = theme.tokens || {};
  const light = activeTokens(theme, 'light');
  const dark = activeTokens(theme, 'dark');
  const mainScheme = theme.scheme === 'dark' ? 'dark' : 'light';

  const fallback = [];     // the main theme as single values (all tokens)
  const dualColor = [];    // colors that differ light/dark -> light-dark()
  const altNonColor = [];  // non-color differing per mode (rare)

  const groups = new Set([...Object.keys(main), ...Object.keys(light), ...Object.keys(dark)]);
  for (const group of groups) {
    // A group's and a token's name become part of a property name in the CSS text, so only letters, digits and dashes pass.
    if (!SAFE_CSS_NAME.test(group)) continue;
    const isColor = group === 'color';
    const names = new Set([
      ...Object.keys(main[group] || {}),
      ...Object.keys(light[group] || {}),
      ...Object.keys(dark[group] || {}),
    ]);
    for (const name of names) {
      if (!SAFE_CSS_NAME.test(name)) continue;
      const mv = main[group]?.[name];
      const lv = light[group]?.[name];
      const dv = dark[group]?.[name];
      if (safeCssValue(mv)) {
        fallback.push(`  --urd-${group}-${name}: ${mv};`);
        if (isColor) fallback.push(`  --urd-base-${name}: ${mv};`);
      }
      if (lv === dv) continue; // equal in both modes: the single value suffices
      if (isColor && safeCssValue(lv) && safeCssValue(dv)) {
        dualColor.push({ name, lv, dv });
      } else if (!isColor && safeCssValue(lv) && safeCssValue(dv)) {
        altNonColor.push({ group, name, lv, dv });
      }
    }
  }

  // Tokens that differ by mode give color-scheme 'light dark', which a manual choice overrides via [data-urd-theme]; else it is locked to the main scheme.
  const hasDual = dualColor.length > 0 || altNonColor.length > 0;
  // With an accent and no accent-text token, the bg colour stands as accent-text for the role sets, and contrast-color() replaces it where supported.
  const hasAccentText = [main, light, dark].some((t) => safeCssValue(t.color?.['accent-text']));
  const wantsContrast = !hasAccentText && safeCssValue(main.color?.accent);
  if (wantsContrast && safeCssValue(main.color?.bg)) {
    fallback.push(`  --urd-color-accent-text: ${main.color.bg};`);
    fallback.push(`  --urd-base-accent-text: ${main.color.bg};`);
  }
  for (const [name, value] of Object.entries(wordsVars(theme))) fallback.push(`  ${name}: ${value};`);
  let css = `:root {\n  color-scheme: ${hasDual ? 'light dark' : mainScheme};\n${fallback.join('\n')}\n}\n`;
  if (wantsContrast) {
    css += '@supports (color: contrast-color(#000)) {\n  :root {\n'
      + '    --urd-color-accent-text: contrast-color(var(--urd-color-accent));\n'
      + '    --urd-base-accent-text: contrast-color(var(--urd-base-accent));\n  }\n}\n';
  }
  if (!hasDual) return css;

  const ld = [];
  for (const c of dualColor) {
    const v = `light-dark(${c.lv}, ${c.dv})`;
    ld.push(`    --urd-color-${c.name}: ${v};`);
    ld.push(`    --urd-base-${c.name}: ${v};`);
  }
  css += '@supports (color: light-dark(#000, #fff)) {\n';
  if (ld.length) css += `  :root {\n${ld.join('\n')}\n  }\n`;
  // Manual choice: color-scheme decides which side light-dark() picks.
  css += '  :root[data-urd-theme="light"] { color-scheme: light; }\n';
  css += '  :root[data-urd-theme="dark"] { color-scheme: dark; }\n';
  if (altNonColor.length) {
    // Non-color cannot use light-dark(): steer per mode via media + attribute.
    const rows = (pick) => altNonColor.map((t) => `    --urd-${t.group}-${t.name}: ${pick(t)};`).join('\n');
    css += `  @media (prefers-color-scheme: dark) {\n    :root {\n${altNonColor.map((t) => `      --urd-${t.group}-${t.name}: ${t.dv};`).join('\n')}\n    }\n  }\n`;
    css += `  :root[data-urd-theme="light"] {\n${rows((t) => t.lv)}\n  }\n`;
    css += `  :root[data-urd-theme="dark"] {\n${rows((t) => t.dv)}\n  }\n`;
  }
  css += '}\n';
  return css;
}

/** Does the browser support native light-dark()? (Baseline 2024; otherwise the JS fallback.) */
function supportsLightDark() {
  return typeof window !== 'undefined' && !!window.CSS?.supports?.('color', 'light-dark(#000, #fff)');
}

/**
 * @param {{tokens: Record<string, Record<string, string>>}} theme The `theme` object from site.json
 * @param {HTMLElement} [root] Element the variables are set on (default: document.documentElement)
 */
export function applyTheme(theme, root = document.documentElement) {
  const stored = readStoredMode();
  activeMode = resolveThemeMode(
    theme.scheme,
    stored,
    window.matchMedia('(prefers-color-scheme: dark)').matches,
  );
  if (supportsLightDark()) {
    // With light-dark(), the theme's CSS goes into <style id="urd-theme">, and a stored choice overrides the OS via data-urd-theme; no inline --urd-color-*.
    const doc = root.ownerDocument || document;
    let style = doc.getElementById('urd-theme');
    if (!style) {
      style = doc.createElement('style');
      style.id = 'urd-theme';
      doc.head.appendChild(style);
    }
    style.textContent = buildThemeCss(theme);
    if (stored === 'light' || stored === 'dark') root.setAttribute('data-urd-theme', stored);
    else root.removeAttribute('data-urd-theme');
  } else {
    // Fallback (no light-dark()): JS sets the tokens inline for the resolved mode, and the long words' variables.
    applyTokens(activeTokens(theme, activeMode), root);
    root.style.removeProperty('--urd-text-hyphens');
    root.style.removeProperty('--urd-text-wrap');
    for (const [name, value] of Object.entries(wordsVars(theme))) root.style.setProperty(name, value);
  }
}

/** Current mode ('light'/'dark'); set by applyTheme at boot. */
export function themeMode() {
  return activeMode ?? 'light';
}

/**
 * Switches mode (the nav toggle), remembers the choice and reapplies tokens.
 * @param {{tokens: object, scheme?: string, alt?: object}} theme
 * @returns {'light'|'dark'} The new mode
 */
export function toggleThemeMode(theme) {
  activeMode = themeMode() === 'dark' ? 'light' : 'dark';
  try { localStorage.setItem(MODE_KEY, activeMode); } catch { /* private mode */ }
  const root = document.documentElement;
  if (supportsLightDark()) {
    // color-scheme (via data-urd-theme) decides which side light-dark() picks.
    root.setAttribute('data-urd-theme', activeMode);
  } else {
    applyTokens(activeTokens(theme, activeMode), root);
  }
  return activeMode;
}

/** Whether two pieces of the drafts' plain data are the same: a walk that stops at the first difference, never writing the data out as text. */
export function sameData(a, b) {
  if (a === b) return true;
  if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null || Array.isArray(a) !== Array.isArray(b)) return false;
  const keys = Object.keys(a);
  if (keys.length !== Object.keys(b).length) return false;
  return keys.every((key) => Object.hasOwn(b, key) && sameData(a[key], b[key]));
}

/** Whether two objects are the same in every key but the ones named, compared as sameData does. */
function sameBeside(a, b, skip) {
  const keys = new Set([...Object.keys(a ?? {}), ...Object.keys(b ?? {})]);
  for (const key of keys) if (!skip.includes(key) && !sameData(a?.[key], b?.[key])) return false;
  return true;
}

/**
 * Whether a site differs from the one before only in theme colours (colour tokens, alt's too, colour sets, scheme); false if unchanged or `alt` comes or goes.
 * @param {object|null} before
 * @param {object|null} after
 */
export function onlyColoursChanged(before, after) {
  if (!before || !after || !sameBeside(before, after, ['theme'])) return false;
  const a = before.theme ?? {};
  const b = after.theme ?? {};
  if (!sameBeside(a, b, ['colorSets', 'scheme', 'tokens', 'alt'])) return false;
  if (!sameBeside(a.tokens, b.tokens, ['color'])) return false;
  if (Boolean(a.alt?.tokens) !== Boolean(b.alt?.tokens)) return false;
  if (!sameBeside(a.alt, b.alt, ['tokens']) || !sameBeside(a.alt?.tokens, b.alt?.tokens, ['color'])) return false;
  return !sameData(a, b);
}

/**
 * A colour from content as CSS: a simple name ('accent', 'bg') becomes var(--urd-color-<name>), anything else ('#7c5cff', 'rgb(...)') stays raw.
 * @param {string} value
 * @returns {string}
 */
export function resolveColor(value) {
  return /^[a-z][a-z0-9-]*$/.test(value) ? `var(--urd-color-${value})` : value;
}

/**
 * The section role sets, overriding a section's colour tokens with values that read --urd-base-*, so a role that swaps bg and text makes no var() cycle.
 */
export const SECTION_THEMES = {
  surface: {
    '--urd-color-bg': 'var(--urd-base-surface)',
    '--urd-color-surface': 'color-mix(in srgb, var(--urd-base-text) 7%, var(--urd-base-surface))',
  },
  accent: {
    '--urd-color-bg': 'var(--urd-base-accent)',
    '--urd-color-surface': 'color-mix(in srgb, var(--urd-base-accent) 82%, #000)',
    '--urd-color-text': 'var(--urd-base-accent-text)',
    '--urd-color-accent': 'var(--urd-base-accent-text)',
    '--urd-color-accent-text': 'var(--urd-base-accent)',
  },
  inverse: {
    '--urd-color-bg': 'var(--urd-base-text)',
    // 78/22 (not 88/12): the cards (surface) need enough separation from the inverted background, or they turn muddy.
    '--urd-color-surface': 'color-mix(in srgb, var(--urd-base-text) 78%, var(--urd-base-bg))',
    '--urd-color-text': 'var(--urd-base-bg)',
  },
  // Soft: the accent as a faint pastel tint across the whole section.
  soft: {
    '--urd-color-bg': 'color-mix(in srgb, var(--urd-base-accent) 12%, var(--urd-base-bg))',
    '--urd-color-surface': 'color-mix(in srgb, var(--urd-base-accent) 8%, var(--urd-base-surface))',
  },
  // Muted: a low-key gray-toned zone with softer text for secondary content.
  muted: {
    '--urd-color-bg': 'color-mix(in srgb, var(--urd-base-text) 5%, var(--urd-base-bg))',
    '--urd-color-surface': 'color-mix(in srgb, var(--urd-base-text) 10%, var(--urd-base-bg))',
    '--urd-color-text': 'color-mix(in srgb, var(--urd-base-text) 82%, var(--urd-base-bg))',
  },
  // Deep: inverse with an accent tint - the contrast zone takes on the brand color.
  deep: {
    '--urd-color-bg': 'color-mix(in srgb, var(--urd-base-accent) 30%, var(--urd-base-text))',
    '--urd-color-surface': 'color-mix(in srgb, var(--urd-base-accent) 40%, var(--urd-base-text))',
    '--urd-color-text': 'var(--urd-base-bg)',
  },
  // Highlighted cards: the section stays Standard, only the surface (the cards) is tinted.
  highlighted: {
    '--urd-color-surface': 'color-mix(in srgb, var(--urd-base-accent) 14%, var(--urd-base-surface))',
  },
};

/**
 * Translation keys for the section-theme picker's names (Standard is no role), looked up with ta() where they are shown, never at module level.
 */
export const SECTION_THEME_LABELS = {
  surface: 'sectionTheme.surface',
  accent: 'sectionTheme.accent',
  inverse: 'sectionTheme.inverse',
  soft: 'sectionTheme.soft',
  muted: 'sectionTheme.muted',
  deep: 'sectionTheme.deep',
  highlighted: 'sectionTheme.highlighted',
};

/** Every token key any role can set, reset before a new role is applied. */
const SECTION_THEME_KEYS = [...new Set(Object.values(SECTION_THEMES).flatMap(Object.keys))];

/**
 * The token overrides for a role (pure function, node-tested).
 * Standard, absence and an unknown role yield no overrides ({}).
 * @param {string|undefined} role
 * @returns {Record<string, string>}
 */
export function sectionThemeVars(role) {
  return SECTION_THEMES[role] ?? {};
}

/**
 * Applies a section's role set on an element, removing every role key the role does not set, so a switch of role never leaves the last one's overrides.
 * @param {HTMLElement} host
 * @param {string|undefined} role
 */
export function applySectionTheme(host, role) {
  const vars = sectionThemeVars(role);
  for (const key of SECTION_THEME_KEYS) {
    if (key in vars) host.style.setProperty(key, vars[key]);
    else host.style.removeProperty(key);
  }
}

/**
 * WCAG relative luminance (0..1) of a #rrggbb/#rgb color, or null for a value that is not a hex (token names/color-mix cannot be measured statically).
 * @param {string} hex
 * @returns {number|null}
 */
export function relativeLuminance(hex) {
  const m = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(typeof hex === 'string' ? hex.trim() : '');
  if (!m) return null;
  let h = m[1];
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const chan = (v) => {
    const s = parseInt(v, 16) / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * chan(h.slice(0, 2)) + 0.7152 * chan(h.slice(2, 4)) + 0.0722 * chan(h.slice(4, 6));
}

/** The theme colour a text on each theme colour is drawn in. */
const INK_ON_TOKEN = { accent: 'var(--urd-color-accent-text)', text: 'var(--urd-color-bg)', bg: 'var(--urd-color-text)', surface: 'var(--urd-color-text)' };
/** The dark ink, the default theme's text colour. */
const INK_DARK = '#14161c';

/**
 * A text colour that reads on a picked colour: the theme's pair for accent, text, bg or surface, else the dark ink or white; null where it is not a hex colour.
 * @param {string} value A hex colour or a theme colour name
 * @returns {string|null}
 */
export function inkOn(value) {
  const colour = String(value ?? '').trim();
  if (Object.hasOwn(INK_ON_TOKEN, colour)) return INK_ON_TOKEN[colour];
  const lum = relativeLuminance(colour);
  if (lum == null) return null;
  // The dark ink or white, whichever stands out more against the colour.
  const ratio = (ink) => (Math.max(lum, ink) + 0.05) / (Math.min(lum, ink) + 0.05);
  return ratio(relativeLuminance(INK_DARK)) >= ratio(1) ? INK_DARK : '#ffffff';
}

/**
 * WCAG contrast ratio (1..21) between two hex colors, or null when one of them is not a measurable hex (token names/color-mix).
 * Pure function, node-tested.
 * @param {string} a @param {string} b
 * @returns {number|null}
 */
export function contrastRatio(a, b) {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  if (la == null || lb == null) return null;
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}
