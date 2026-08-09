/**
 * Mapper theme.tokens fra site.json til CSS-variabler på :root.
 * tokens.color.bg → --urd-color-bg, tokens.font.heading → --urd-font-heading, osv.
 *
 * Lys/mørk-bryteren (additivt fra v0.6): har temaet et `alt`-felt, finnes
 * siden i to moduser. `theme.scheme` sier hva HOVEDTEMAET er (light/dark,
 * standard light); alt-tokens overstyrer hovedtokens i motsatt modus.
 * Første besøk følger prefers-color-scheme; et aktivt valg med bryteren
 * (i nav-en) huskes i localStorage og vinner ved neste besøk.
 */

/** localStorage-nøkkel for besøkendes aktive valg ('light'/'dark'). */
const MODE_KEY = 'urd-theme-mode';

/** Gjeldende modus i denne økten (null før første applyTheme). */
let activeMode = null;

/**
 * Ren modusoppløsning: et lagret valg vinner, ellers OS-preferansen.
 * @param {string|undefined} scheme theme.scheme ('light'/'dark', standard light)
 * @param {string|null} stored Lagret valg ('light'/'dark') eller null
 * @param {boolean} prefersDark Besøkendes prefers-color-scheme
 * @returns {'light'|'dark'}
 */
export function resolveThemeMode(scheme, stored, prefersDark) {
  if (stored === 'light' || stored === 'dark') return stored;
  // Uten alt-tema finnes bare hovedmodusen; scheme brukes da kun som svar.
  return prefersDark ? 'dark' : 'light';
}

/**
 * Ren token-utvelgelse for en modus: hovedtokens, overstyrt gruppevis av
 * alt-tokens når modusen er motsatt av hovedtemaets scheme. Uten alt-tema
 * returneres hovedtokens uansett modus.
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
  // localStorage kan være avslått (privat modus); da følges OS-preferansen.
  try { return localStorage.getItem(MODE_KEY); } catch { return null; }
}

function applyTokens(tokens, root) {
  for (const [group, values] of Object.entries(tokens)) {
    for (const [name, value] of Object.entries(values)) {
      root.style.setProperty(`--urd-${group}-${name}`, value);
      // Basis-kopi av fargetokenene: seksjonenes rollesett refererer disse
      // (--urd-base-*) i stedet for de levende --urd-color-*, så en rolle som
      // bytter bg<->text ikke lager en var()-sykel (se SECTION_THEMES).
      if (group === 'color') root.style.setProperty(`--urd-base-${name}`, value);
    }
  }
}

/* Ankret allowlist for en CSS-tokenverdi (CodeQL-vennlig barriere): kun tegn som
   forekommer i farger/lengder/fontstacker. Char-klassen utelukker ; { } < > : @,
   og vi avviser eksplisitt url()/kommentar/expression. Ugyldige tokens droppes, så
   en innlogget publiser ikke kan injisere vilkårlig CSS gjennom temaet (buildThemeCss
   skriver rå tekst, ikke via style.setProperty som stille avviser). */
const SAFE_CSS_VALUE = /^[a-zA-Z0-9#%.,()'"\s+\-*/]+$/;
export function safeCssValue(value) {
  return typeof value === 'string'
    && SAFE_CSS_VALUE.test(value)
    && !/url\(|\/\*|\*\/|expression/i.test(value);
}

/**
 * Bygger en statisk CSS-streng som setter temaets fargetokens som
 * light-dark(lys, mørk) bak @supports, med enkeltverdi-fallback (hovedtemaet) for
 * eldre nettlesere. Materialiseres til content/theme.css ved publisering og lastes
 * render-blokkerende, så første paint har sidens faktiske farger uten FOUC.
 * color-scheme følger OS; et manuelt valg overstyrer via [data-urd-theme] (light-dark()
 * velger side etter beregnet color-scheme). Ren funksjon, gjenbruker activeTokens.
 * @param {{tokens: object, scheme?: string, alt?: {tokens: object}}} theme
 * @returns {string}
 */
export function buildThemeCss(theme) {
  const main = theme.tokens || {};
  const light = activeTokens(theme, 'light');
  const dark = activeTokens(theme, 'dark');
  const mainScheme = theme.scheme === 'dark' ? 'dark' : 'light';

  const fallback = [];     // hovedtemaet som enkeltverdier (alle tokens)
  const dualColor = [];    // farger ulike lys/mørk -> light-dark()
  const altNonColor = [];  // ikke-farge ulik per modus (sjelden)

  const groups = new Set([...Object.keys(main), ...Object.keys(light), ...Object.keys(dark)]);
  for (const group of groups) {
    const isColor = group === 'color';
    const names = new Set([
      ...Object.keys(main[group] || {}),
      ...Object.keys(light[group] || {}),
      ...Object.keys(dark[group] || {}),
    ]);
    for (const name of names) {
      const mv = main[group]?.[name];
      const lv = light[group]?.[name];
      const dv = dark[group]?.[name];
      if (safeCssValue(mv)) {
        fallback.push(`  --urd-${group}-${name}: ${mv};`);
        if (isColor) fallback.push(`  --urd-base-${name}: ${mv};`);
      }
      if (lv === dv) continue; // like i begge moduser: enkeltverdien holder
      if (isColor && safeCssValue(lv) && safeCssValue(dv)) {
        dualColor.push({ name, lv, dv });
      } else if (!isColor && safeCssValue(lv) && safeCssValue(dv)) {
        altNonColor.push({ group, name, lv, dv });
      }
    }
  }

  // Uten en mørk variant (alt) er siden ett tema: lås color-scheme til det, ingen
  // light-dark() og ingen bryter. Med variant følger color-scheme OS og light-dark()
  // bærer begge sett; et manuelt valg overstyrer via [data-urd-theme].
  const hasDual = dualColor.length > 0 || altNonColor.length > 0;
  let css = `:root {\n  color-scheme: ${hasDual ? 'light dark' : mainScheme};\n${fallback.join('\n')}\n}\n`;
  if (!hasDual) return css;

  const ld = [];
  for (const c of dualColor) {
    const v = `light-dark(${c.lv}, ${c.dv})`;
    ld.push(`    --urd-color-${c.name}: ${v};`);
    ld.push(`    --urd-base-${c.name}: ${v};`);
  }
  css += '@supports (color: light-dark(#000, #fff)) {\n';
  if (ld.length) css += `  :root {\n${ld.join('\n')}\n  }\n`;
  // Manuelt valg: color-scheme bestemmer hvilken side light-dark() velger.
  css += '  :root[data-urd-theme="light"] { color-scheme: light; }\n';
  css += '  :root[data-urd-theme="dark"] { color-scheme: dark; }\n';
  if (altNonColor.length) {
    // Ikke-farge kan ikke bruke light-dark(): styr per modus via media + attributt.
    const rows = (pick) => altNonColor.map((t) => `    --urd-${t.group}-${t.name}: ${pick(t)};`).join('\n');
    css += `  @media (prefers-color-scheme: dark) {\n    :root {\n${altNonColor.map((t) => `      --urd-${t.group}-${t.name}: ${t.dv};`).join('\n')}\n    }\n  }\n`;
    css += `  :root[data-urd-theme="light"] {\n${rows((t) => t.lv)}\n  }\n`;
    css += `  :root[data-urd-theme="dark"] {\n${rows((t) => t.dv)}\n  }\n`;
  }
  css += '}\n';
  return css;
}

/** Støtter nettleseren native light-dark()? (Baseline 2024; ellers JS-fallback.) */
function supportsLightDark() {
  return typeof window !== 'undefined' && !!window.CSS?.supports?.('color', 'light-dark(#000, #fff)');
}

/**
 * @param {{tokens: Record<string, Record<string, string>>}} theme `theme`-objektet fra site.json
 * @param {HTMLElement} [root] Element variablene settes på (standard: document.documentElement)
 */
export function applyTheme(theme, root = document.documentElement) {
  const stored = readStoredMode();
  activeMode = resolveThemeMode(
    theme.scheme,
    stored,
    window.matchMedia('(prefers-color-scheme: dark)').matches,
  );
  if (supportsLightDark()) {
    // Moderne: CSS-en bærer light-dark(). Injiser utkastets/sidens tokens som en
    // <style> (så preview og live-endring virker), og la et lagret valg overstyre
    // OS via data-urd-theme. Ingen inline --urd-color-* (ville klobbet light-dark()).
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
    // Fallback (ingen light-dark()): JS setter tokenene inline for løst modus.
    applyTokens(activeTokens(theme, activeMode), root);
  }
}

/** Gjeldende modus ('light'/'dark'); satt av applyTheme ved boot. */
export function themeMode() {
  return activeMode ?? 'light';
}

/**
 * Bytter modus (nav-bryteren), husker valget og re-applikerer tokens.
 * @param {{tokens: object, scheme?: string, alt?: object}} theme
 * @returns {'light'|'dark'} Ny modus
 */
export function toggleThemeMode(theme) {
  activeMode = themeMode() === 'dark' ? 'light' : 'dark';
  try { localStorage.setItem(MODE_KEY, activeMode); } catch { /* privat modus */ }
  const root = document.documentElement;
  if (supportsLightDark()) {
    // color-scheme (via data-urd-theme) bestemmer hvilken side light-dark() velger.
    root.setAttribute('data-urd-theme', activeMode);
  } else {
    applyTokens(activeTokens(theme, activeMode), root);
  }
  return activeMode;
}

/**
 * Løser en fargeverdi fra innhold til CSS. Enkle navn ('accent', 'bg')
 * tolkes som theme-tokens og blir var(--urd-color-<navn>); alt annet
 * ('#7c5cff', 'rgb(...)') brukes rått.
 * @param {string} value
 * @returns {string}
 */
export function resolveColor(value) {
  return /^[a-z][a-z0-9-]*$/.test(value) ? `var(--urd-color-${value})` : value;
}

/**
 * Ferdige seksjonstemaer (rollesett, additivt fra v0.6): en rolle overstyrer
 * seksjonens fargetokens. Verdiene refererer BASIS-kopiene (--urd-base-*, satt
 * av applyTokens), ikke de levende --urd-color-*, så en rolle som bytter
 * bg<->text (invers) ikke lager en var()-sykel, og lys/mørk følger med av seg
 * selv. Blokkene arver overstyringene via resolveColor -> var(--urd-color-*).
 */
export const SECTION_THEMES = {
  flate: {
    '--urd-color-bg': 'var(--urd-base-surface)',
    '--urd-color-surface': 'color-mix(in srgb, var(--urd-base-text) 7%, var(--urd-base-surface))',
  },
  aksent: {
    '--urd-color-bg': 'var(--urd-base-accent)',
    '--urd-color-surface': 'color-mix(in srgb, var(--urd-base-accent) 82%, #000)',
    '--urd-color-text': 'var(--urd-base-accent-text)',
    '--urd-color-accent': 'var(--urd-base-accent-text)',
    '--urd-color-accent-text': 'var(--urd-base-accent)',
  },
  invers: {
    '--urd-color-bg': 'var(--urd-base-text)',
    // 78/22 (ikke 88/12): kortene (surface) må ha nok separasjon fra den
    // inverterte bakgrunnen, ellers blir de grumsete (testfunn).
    '--urd-color-surface': 'color-mix(in srgb, var(--urd-base-text) 78%, var(--urd-base-bg))',
    '--urd-color-text': 'var(--urd-base-bg)',
  },
  // De fire under kom i 0.6.6.4.6 (eiervalg 9. august 2026, alle fire skissene).
  // Dus: aksenten som svakt pastell-skjær over hele seksjonen.
  dus: {
    '--urd-color-bg': 'color-mix(in srgb, var(--urd-base-accent) 12%, var(--urd-base-bg))',
    '--urd-color-surface': 'color-mix(in srgb, var(--urd-base-accent) 8%, var(--urd-base-surface))',
  },
  // Dempet: lavmælt gråtonet sone med mykere tekst for sekundært innhold.
  dempet: {
    '--urd-color-bg': 'color-mix(in srgb, var(--urd-base-text) 5%, var(--urd-base-bg))',
    '--urd-color-surface': 'color-mix(in srgb, var(--urd-base-text) 10%, var(--urd-base-bg))',
    '--urd-color-text': 'color-mix(in srgb, var(--urd-base-text) 82%, var(--urd-base-bg))',
  },
  // Dyp: invers med aksentskjær - kontrastsonen tar merkevarefargen i seg.
  dyp: {
    '--urd-color-bg': 'color-mix(in srgb, var(--urd-base-accent) 30%, var(--urd-base-text))',
    '--urd-color-surface': 'color-mix(in srgb, var(--urd-base-accent) 40%, var(--urd-base-text))',
    '--urd-color-text': 'var(--urd-base-bg)',
  },
  // Uthevede kort: seksjonen står som Standard, kun flaten (kortene) tones.
  uthevet: {
    '--urd-color-surface': 'color-mix(in srgb, var(--urd-base-accent) 14%, var(--urd-base-surface))',
  },
};

/** Etiketter til seksjonstema-velgeren (Standard er «ingen rolle»). */
/** Visningsnavn-NØKLER (ta-oppslag hos konsumenten; modulen ligger i
 *  besøkende-lukningen og kan aldri kalle ta() på modulnivå). */
export const SECTION_THEME_LABELS = {
  flate: 'sectionTheme.flate',
  aksent: 'sectionTheme.aksent',
  invers: 'sectionTheme.invers',
  dus: 'sectionTheme.dus',
  dempet: 'sectionTheme.dempet',
  dyp: 'sectionTheme.dyp',
  uthevet: 'sectionTheme.uthevet',
};

/** Alle token-nøkler noen rolle kan sette - brukes til å nullstille før ny rolle. */
const SECTION_THEME_KEYS = [...new Set(Object.values(SECTION_THEMES).flatMap(Object.keys))];

/**
 * Token-overstyringene for en rolle (ren funksjon, node-testet). Standard,
 * fravær og ukjent rolle gir ingen overstyring ({}).
 * @param {string|undefined} role
 * @returns {Record<string, string>}
 */
export function sectionThemeVars(role) {
  return SECTION_THEMES[role] ?? {};
}

/**
 * Setter (eller nullstiller) en seksjons rollesett på et element. Nullstiller
 * ALLE mulige rolle-nøkler først, så et bytte av rolle (eller til Standard) ved
 * inkrementell rerender aldri etterlater forrige rolles overstyringer.
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
 * WCAG relativ luminans (0..1) av en #rrggbb/#rgb-farge, eller null for en
 * verdi som ikke er en hex (token-navn/color-mix kan ikke måles statisk).
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

/**
 * WCAG-kontrastforhold (1..21) mellom to hex-farger, eller null når en av dem
 * ikke er en målbar hex (token-navn/color-mix). Ren funksjon, node-testet.
 * @param {string} a @param {string} b
 * @returns {number|null}
 */
export function contrastRatio(a, b) {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  if (la == null || lb == null) return null;
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}
