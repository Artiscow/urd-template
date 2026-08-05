/**
 * Flerspråk-kjernen (ADR-0012): to registre - t() for besøkende-tekster
 * (følger site.lang) og ta() for admin-chromen (følger admin-språket i
 * localStorage 'urd-admin-lang'). Norsk bokmål er alltid statisk base;
 * andre språk legges oppå med Object.assign, så en manglende nøkkel gir
 * bokmålsteksten og en helt ukjent nøkkel gir nøkkelen selv (synlig feil,
 * aldri krasj). Datonavn, flertall og relativ tid går via native Intl
 * (ADR-0011: plattformens CLDR-data framfor egne tabeller), med
 * bokmålstabellene i locales/site/nb.js som fallback der ICU mangler
 * språket. Oversettelsesfilene er rene ES-moduler uten bygging.
 */
import nb from './locales/site/nb.js';

/** Språkene som følger med Urd; paritetstesten holder filene i synk.
 *  Flere språk kan legges til som språkpakke-plugins (language-packs.js). */
export const SUPPORTED_LANGS = ['nb', 'nn', 'en-GB', 'se', 'tr'];

/**
 * Formen på en språkkode: BCP-47-lignende, med små bokstaver i hovedtaggen
 * (nb, se, sv, en-GB). Brukes til å skille en mulig SPRÅKPAKKE-kode fra
 * søppel: en kode motoren ikke kjenner slås opp blant språkpakkene, mens
 * en verdi som ikke engang ser ut som en språkkode faller rett til bokmål.
 */
export const LANG_CODE_RE = /^[a-z]{2,3}(?:-[A-Za-z0-9]{2,8})*$/;

/* Tagene som betyr hvert innebygde språk. Både to- og trebokstavskodene
   (ISO 639-1 og -3) står her: sender et system 'nob', skal det bli bokmål,
   og koden skal samtidig være opptatt så en språkpakke ikke kan kapre
   bokmål gjennom den. Sør- og lulesamisk (sma/smj) er en TILNÆRMING til
   nordsamisk, ikke identitet; de er derfor også opptatte, og et ekte
   sørsamisk språk må inn i motoren, ikke som pakke. */
const LANG_TAGS = {
  nb: ['no', 'nor', 'nb', 'nob'],
  nn: ['nn', 'nno'],
  se: ['se', 'sme', 'smj', 'sma'],
  tr: ['tr', 'tur'],
  'en-GB': ['en', 'eng'],
};

/**
 * Matcher en språktag (site.lang, navigator.language) mot de INNEBYGDE
 * språkene, eller null når ingenting passer. Tagen må være hele koden
 * eller koden pluss undertagger ('nb-NO' er bokmål, 'nbx' er det ikke):
 * ellers ville en språkpakke med en kode som tilfeldigvis begynner likt
 * ('ses', 'trv') blitt omdirigert til et innebygd språk og aldri lastet.
 * Null er meningsbærende: auto-deteksjonen skal da prøve NESTE tag i
 * navigator.languages, og en site.lang uten treff kan tilhøre en
 * språkpakke (se requestedLang).
 * @param {unknown} raw
 * @returns {string|null}
 */
export function matchLang(raw) {
  const v = String(raw ?? '').trim().toLowerCase();
  for (const [lang, tags] of Object.entries(LANG_TAGS)) {
    if (tags.some((tag) => v === tag || v.startsWith(`${tag}-`))) return lang;
  }
  return null;
}

/** Er koden et av språkene Urd har innebygd? Språkpakker (language-packs.js)
 *  kan aldri overstyre dem: en plugin skal ikke kunne kapre bokmål. */
export function isBuiltinLang(code) {
  return SUPPORTED_LANGS.includes(String(code ?? ''));
}

/**
 * Validerer languages-lista i et plugin-manifest (speiler
 * schema/plugin.schema.json, som ikke kan kjøres i nettleseren uten
 * avhengigheter). Bor her, ikke i language-packs.js, fordi plugin-lasteren
 * validerer manifestet SYNKRONT for alle plugins - pakkemodulen selv
 * hentes kun når et pakkespråk faktisk er i bruk.
 * @param {unknown} list
 * @returns {string[]} Feilmeldinger; tom liste = gyldig.
 */
export function validateLanguages(list) {
  const errors = [];
  if (!Array.isArray(list)) return ['languages må være en liste'];
  for (const entry of list) {
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
      errors.push('languages: hvert innslag må være et objekt');
      continue;
    }
    const code = String(entry.code ?? '');
    if (!LANG_CODE_RE.test(code)) errors.push(`languages: '${code}' er ikke en gyldig språkkode`);
    else if (isBuiltinLang(code)) errors.push(`languages: '${code}' er innebygd i Urd og kan ikke overstyres`);
    if (typeof entry.name !== 'string' || !entry.name.trim()) errors.push(`languages/${code}: name mangler (språkets eget navn)`);
    for (const kind of ['site', 'admin']) {
      if (entry[kind] !== undefined && typeof entry[kind] !== 'boolean') errors.push(`languages/${code}: ${kind} må være boolsk`);
    }
    if (entry.site !== true && entry.admin !== true) errors.push(`languages/${code}: må dekke site, admin eller begge`);
  }
  return errors;
}

/**
 * Språket en verdi BER om: innebygd treff først, ellers en kode som kan
 * tilhøre en språkpakke (beholdes som den er), ellers bokmål.
 * @param {unknown} raw
 * @returns {string}
 */
export function requestedLang(raw) {
  const hit = matchLang(raw);
  if (hit) return hit;
  const v = String(raw ?? '').trim();
  return LANG_CODE_RE.test(v) ? v : 'nb';
}

/**
 * Henter tekstene til en språkpakke (plugin). Modulen lastes KUN her, så en
 * side på et innebygd språk aldri betaler for pakkestøtten. Kjøretids-import
 * fra absolutt sti, samme mønster som admin-ordbøkene: da virker koden både
 * i motoren og i admin-bundelen, uten at bygget lager egne chunk-filer.
 * (I admin gir det en egen modulinstans av i18n.js bak pakkemodulen; den
 * brukes kun til rene funksjoner, aldri til ordbok-tilstand.)
 * @param {string} code
 * @param {'site'|'admin'} kind
 * @returns {Promise<Record<string, string>|null>}
 */
async function loadPack(code, kind) {
  try {
    const mod = await import(/* @vite-ignore */ '/assets/urd/language-packs.js');
    return await mod.loadPackStrings(code, kind);
  } catch {
    return null;
  }
}

const site = { lang: 'nb', dict: { ...nb.strings }, dates: null };
const admin = { lang: 'nb', dict: {} };

/** {var}-interpolasjon: enkel og forutsigbar, ingen ICU-syntaks. */
function format(str, params) {
  if (!params) return str;
  let out = str;
  for (const [k, v] of Object.entries(params)) out = out.replaceAll(`{${k}}`, String(v));
  return out;
}

/** Besøkende-tekst (følger site.lang). */
export function t(key, params) {
  return format(site.dict[key] ?? key, params);
}

/** Admin-tekst (følger admin-språket). */
export function ta(key, params) {
  return format(admin.dict[key] ?? key, params);
}

/**
 * Flertallsoppslag: nøkkelen suffikses med Intl.PluralRules-kategorien
 * ('one'/'two'/'few'/'many'/'other'; nordsamisk har totallsform), med
 * .other som fallback. Antallet er alltid tilgjengelig som {n}.
 */
export function tp(baseKey, n, params) {
  let cat = 'other';
  try { cat = new Intl.PluralRules(site.lang).select(n); } catch { /* ukjent språk: other */ }
  const chosen = site.dict[`${baseKey}.${cat}`] ?? site.dict[`${baseKey}.other`];
  return format(chosen ?? `${baseKey}.${cat}`, { ...params, n });
}

/**
 * Feilsvar fra publiseringslaget (functions): den maskinlesbare `code`-en
 * slås opp som api.<code> og interpoleres med svarets egne felter ({key},
 * {login}, {host} ...). Ukjent kode faller til backend-teksten (`error`),
 * som alltid finnes; null når svaret mangler helt, så kalleren kan `??`
 * sin egen fallback.
 */
export function taApiError(data) {
  const key = `api.${data?.code}`;
  if (data?.code && admin.dict[key] !== undefined) return format(admin.dict[key], data);
  return data?.error ?? null;
}

export function siteLang() { return site.lang; }
export function adminLang() { return admin.lang; }

/** Plugins legger sine besøkende-tekster inn her (nøkler prefikset med plugin-id). */
export function addSiteDict(strings) { Object.assign(site.dict, strings ?? {}); }
/** Plugins og admin-locale-filene legger admin-tekster inn her. */
export function addAdminDict(strings) { Object.assign(admin.dict, strings ?? {}); }

/**
 * Laster besøkende-språket (kalles av boot() når site.json er lest).
 * Dynamisk import med vilje: usynlig for modulepreload-lista, og norske
 * sider (basen) betaler ingenting. En kode motoren ikke har innebygd slås
 * opp blant språkpakkene (plugins). Feiler lastingen står nb-basen igjen.
 */
export async function initSiteLocale(rawLang) {
  const lang = requestedLang(rawLang);
  let strings = null;
  if (lang !== 'nb') {
    if (isBuiltinLang(lang)) {
      try {
        strings = (await import(/* @vite-ignore */ `./locales/site/${lang}.js`)).default.strings;
      } catch { /* manglende språkfil: bokmålsbasen står igjen */ }
    } else {
      strings = await loadPack(lang, 'site');
    }
  }
  // Ordboka byttes FØRST når tekstene er i hånden, i ett jafs: en render
  // som skjer mens lastingen pågår skal se forrige språk, aldri et halvbygd
  // (i previewen kan et nytt utkast komme midt i et språkbytte). Alltid
  // fersk kopi av basen, så overlayen ikke muterer nb-ordboka og et bytte
  // ikke arver forrige språk.
  site.lang = lang === 'nb' || strings ? lang : 'nb';
  site.dict = { ...nb.strings, ...(strings ?? {}) };
  site.dates = null;
  return site.lang;
}

/**
 * Admin-språkdeteksjonen (delt av editorens main.js og preview-chromen):
 * eksplisitt valg i localStorage 'urd-admin-lang' vinner; ellers matches
 * enhetens språk strengt mot de støttede (neste tag prøves ved ikke-treff);
 * ingen treff gir engelsk. Et lagret valg kan være en språkpakke-kode
 * motoren ikke kjenner: den beholdes, og initAdminLocale slår den opp.
 * Auto-deteksjonen dekker kun de innebygde språkene (den er synkron, og
 * pakkelista krever nettverk).
 */
export function detectAdminLang() {
  let stored = null;
  try { stored = localStorage.getItem('urd-admin-lang'); } catch { /* privat modus */ }
  if (stored) return requestedLang(stored);
  for (const cand of navigator.languages ?? [navigator.language]) {
    const hit = matchLang(cand);
    if (hit) return hit;
  }
  return 'en-GB';
}

/**
 * Løses når admin-ordboka er lastet. Preview-chrome som kan rendres FØR
 * initAdminLocale er ferdig (hjelpechipene i kjerneblokkene: første
 * side-render skjer før preview-grenen i boot) venter på denne før ta()
 * kalles, så nøkkelnavn aldri fryses inn i chrome fra første render.
 * Besøkende-løypa løser den aldri - chipene finnes kun i preview.
 */
let adminLocaleReadyResolve;
export const adminLocaleReady = new Promise((resolve) => { adminLocaleReadyResolve = resolve; });

/**
 * Laster admin-ordboka: nb-basen i bunn, valgt språk oppå. Kjøretids-import
 * fra absolutt sti, så samme kode virker i admin-bundelen OG i preview-
 * iframen, og ordbøkene bundles aldri. Et språk som ikke er innebygd hentes
 * fra en språkpakke; finnes den ikke, står bokmålsbasen igjen. Feiler
 * lastingen helt (vite dev uten template-serveren) vises nøklene.
 */
export async function initAdminLocale(lang = detectAdminLang()) {
  const load = async (code) => (await import(/* @vite-ignore */ `/assets/urd/locales/admin/${code}.js`)).default.strings;
  admin.lang = requestedLang(lang);
  const builtin = isBuiltinLang(admin.lang);
  try {
    Object.assign(admin.dict, await load('nb'));
    if (builtin && admin.lang !== 'nb') Object.assign(admin.dict, await load(admin.lang));
  } catch { /* uten ordbok vises nøklene; appen skal aldri dø av dette */ }
  if (!builtin) {
    const strings = await loadPack(admin.lang, 'admin');
    if (strings) Object.assign(admin.dict, strings);
    else admin.lang = 'nb';
  }
  adminLocaleReadyResolve(admin.lang);
  return admin.lang;
}

/* Datonavn: bygges fra Intl for gjeldende site-språk og caches per språk.
   Ukedagene starter på mandag (norsk konvensjon, samme som tabellene).
   Korte månedsnavn normaliseres uten punktum ('jan.' -> 'jan'), som dagens
   badge-format. Mangler ICU språket, brukes bokmålstabellene fra basen. */
function buildDates(lang) {
  try {
    if (!Intl.DateTimeFormat.supportedLocalesOf([lang]).length) return nb.dates;
    const fmt = (opts) => new Intl.DateTimeFormat(lang, opts);
    const strip = (s) => s.replace(/\.$/, '');
    const months = [];
    const monthsShort = [];
    for (let m = 0; m < 12; m++) {
      const d = new Date(Date.UTC(2026, m, 15, 12));
      months.push(fmt({ month: 'long', timeZone: 'UTC' }).format(d));
      monthsShort.push(strip(fmt({ month: 'short', timeZone: 'UTC' }).format(d)));
    }
    const weekdays = [];
    const weekdaysShort = [];
    for (let i = 0; i < 7; i++) {
      // 5. januar 2026 er en mandag.
      const d = new Date(Date.UTC(2026, 0, 5 + i, 12));
      weekdays.push(fmt({ weekday: 'long', timeZone: 'UTC' }).format(d));
      weekdaysShort.push(strip(fmt({ weekday: 'short', timeZone: 'UTC' }).format(d)));
    }
    return { months, monthsShort, weekdays, weekdaysShort };
  } catch {
    return nb.dates;
  }
}

/** @returns {{months: string[], monthsShort: string[], weekdays: string[], weekdaysShort: string[]}} */
export function dates() {
  site.dates ??= buildDates(site.lang);
  return site.dates;
}

/** Relativ dagtelling («om 3 døgn»/«3 jándora maŋŋilit»); fallback = rå tall. */
export function relativeDays(days) {
  try {
    return new Intl.RelativeTimeFormat(site.lang, { numeric: 'auto' }).format(days, 'day');
  } catch {
    return String(days);
  }
}
