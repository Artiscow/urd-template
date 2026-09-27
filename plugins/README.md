# Plugins

En Urd-plugin er en mappe her med et manifest (`plugin.json`) og en ES-modul
(`index.js`) som eksporterer `register(Urd)`. Plugins bruker de samme
define-API-ene som kjernen (blokker, seksjonspresets, bakgrunner, animasjoner,
maler) og er underlagt samme migreringskontrakt: en plugin-oppdatering kan
aldri knuse eksisterende innhold.

Aktive plugins listes i [`plugins.json`](plugins.json) (statiske hoster kan
ikke liste mapper, derfor en indeksfil). Admin håndterer listen for deg:
Plugins-panelet viser mappene her automatisk (via publiseringslaget, eller
sist kjente liste), og av/på-valget publiseres som en vanlig endring.

Urd sender med én plugin: den svenske språkpakken [`lang-sv/`](lang-sv/),
som er eksempelet på en språkpakke (se under). Kalender, skjema, kart og
besøksmåling var referanseplugins til og med 0.7.3 og er kjerneblokker og
en nettstedsinnstilling fra milepæl 0.7.18 (24. september 2026); mønstrene
de viste står beskrevet under, med kjernens kode som lesestoff.

## Utvikle en plugin lokalt

1. Start en lokal server fra `template/` (f.eks. `python3 -m http.server`)
   og åpne `http://localhost:8000/admin/`.
2. Legg mappen din her (`plugins/<din-id>/` med `plugin.json` + `index.js`).
3. Aktiver den i Plugins-panelet (skriv mappenavnet hvis panelet ikke kan
   liste mapper lokalt). Forhåndsvisningen laster pluginen fra UTKASTET,
   så du ser blokkene dine live uten å publisere.
4. Manifestfeil, motorversjonskrav og provides-avvik logges i nettleser-
   konsollen og vises i panelet.

Manifestkrav: `requiresEngine` (semver-intervall mot motorversjonen i
urd.json), `provides` (hva pluginen definerer), og valgfritt `csp`
(eksterne opprinnelser pluginen trenger; se ADR-0006 - `_headers` endres
aldri automatisk, admin viser eieren hva som må legges inn). `entry` og
`provides` er valgfrie for rene språkpakker, som ikke har kode (se under).

**Dele pluginen:** legg den i et eget offentlig GitHub-repo og sett
GitHub-topicen `urd-plugin`, så den kan finnes med topic-søk (maler delt
som repo bruker `urd-template`). Brukere installerer ved å kopiere mappen inn
i `plugins/` og aktivere den i Plugins-panelet.

## Flerspråk (ADR-0012)

Sett `"locales": true` i manifestet og legg `locales/{nb,nn,en-GB,se,tr}.js`
i pluginmappen, samme form som motorens locale-filer:

```js
// plugins/<id>/locales/nb.js
export default { lang: 'nb', strings: { '<id>.nokkel': 'Tekst', '<id>.edit.nokkel': 'Panel-tekst' } };
```

- **Nøklene prefikses med plugin-id-en** (`calendar.*`); editor-/config-
  panel-nøkler ligger under `<id>.edit.*`. Én strings-flate per fil.
- **nb er basen**: lasteren legger nb i bunn og valgt språk oppå, så en
  manglende nøkkel faller til bokmål. Paritetstesten (`node --test
  tests/i18n.test.mjs`) finner `locales/`-mappen automatisk og krever
  komplette nøkkelsett i kjernespråkene nb/en-GB/tr, ingen tomme verdier,
  ingen tankestrek og samme `{var}`-tokens; nn/se kan ha etterslep (fylles
  i oversettelsesrunder), men aldri ukjente nøkler.
- **Oppslag**: `import { t, ta } from '/assets/urd/i18n.js'` - `t()` for
  besøkende-tekster (site-språket), `ta()` for editor-chromen (admin-
  språket). `/assets/urd/` er det STABILE plugin-API-et (ADR-0013):
  motoren selv bor i en versjonert mappe (`/assets/engine/<versjon>/`)
  som byttes ved hver Urd-utgivelse - hardkod aldri den versjonerte
  stien i en plugin. Kall dem KUN i render-/fabrikkfunksjoner, aldri på modulnivå
  (modulen kan evalueres før ordboka er lastet); tabeller på modulnivå
  holder nøkkelNAVN, og blokk-/preset-defs bruker de additive feltene
  `labelKey`/`hintKey` (behold `label`/`hint` som fallback).
- **Seed-regelen**: tekst som SKRIVES INN i brukerdata (felt-defaults,
  preset-innhold) oversettes ÉN gang ved innsetting med admin-språket -
  `ta()` inne i `defaults()`/`create()`-kroppen, aldri ved rendering av
  eksisterende data.
- `"names": {"nb": "Kalender", "en-GB": "Calendar", …}` i manifestet gir
  Plugins-panelet og «Fra pluginen …»-tekstene et visningsnavn per
  admin-språk (`name` er fallback).

## Språkpakker: en plugin som KUN er et språk

Trenger du et språk Urd ikke har innebygd, lages det som en plugin uten
kode. `lang-sv` er referansen (svensk for både besøkende- og admin-siden):

```json
// plugins/lang-sv/plugin.json - ingen entry, ingen provides
{
  "id": "lang-sv",
  "name": "Svensk språkpakke",
  "version": "1.0.0",
  "requiresEngine": ">=0.6.8 <1.0.0",
  "languages": [{ "code": "sv", "name": "Svenska", "site": true, "admin": true }]
}
```

```
plugins/lang-sv/locales/site/sv.js     besøkende-tekstene (t())
plugins/lang-sv/locales/admin/sv.js    admin-chromen (ta())
```

- **Filene har samme form og nøkler som motorens egne** locale-filer:
  kopier motorens `locales/site/nb.js` (28 nøkler) eller
  `.../admin/nb.js` (984 nøkler) og oversett verdiene. Nøklene endres
  aldri.
- **`site` og `admin` er uavhengige.** En pakke kan dekke besøkende-siden,
  admin-chromen eller begge; feltene sier hva du faktisk leverer, og bare
  det som er lovet blir etterspurt.
- **Bokmålsbasen ligger under**, så en delvis pakke virker: nøkler du ikke
  har oversatt vises på bokmål i stedet for å forsvinne. Paritetstesten
  krever derfor ikke fullt sett for pakker, men slår ned på nøkler som
  ikke finnes i basen (skrivefeil som aldri ville vist seg).
- **Innebygde språk kan ikke overstyres** (`nb`, `nn`, `en-GB`, `se`,
  `tr`): en plugin skal ikke kunne kapre bokmål. Vil du forbedre et av
  dem, rediger motorens egen locale-fil (se [CONTRIBUTING.md](../../CONTRIBUTING.md)).
- **Språket blir tilgjengelig når pakken er aktivert** i Plugins-panelet.
  Besøkende-språket (Nettsted-panelet) følger utkastet med én gang;
  admin-språkvelgeren tilbyr pakken etter publisering, siden admin leser
  den publiserte plugin-lista ved oppstart.
- **Datoer, flertall og relativ tid trenger ingen oversettelse**: de går
  via `Intl` med språkkoden din, så lenge nettleseren har CLDR-data for
  den.

**Hjelpechip-regelen (ADR-0008)**: har blokken din spesialfunksjoner
(egne paneler, konvensjoner i innholdet, automatikk), SKAL den ha en
«?»-chip som forklarer dem. Bruk den felles hjelperen, kun i preview:

```js
if (ctx.preview) {
  import('/assets/urd/hint.js').then(({ attachHint }) => {
    attachHint(host, { title: 'Blokken min', lines: ['Funksjon 1 …', 'Funksjon 2 …'] });
  });
}
```

Plugin-blokker og -seksjonsmaler vises automatisk i egne «Plugins»-
seksjoner i «+ Ny blokk», «+ Ny seksjon» og Blokker-panelet. En blokk-def
kan i tillegg ha `variants: [{ label, props }, …]`: da blir den en
foldemeny i blokkmenyene (kjernens kalenderblokk bruker det til
visningene sine).

Blokker der innholdet selv bestemmer høyden (som kalender, skjema og kart
i kjernen) skal sette `autoGrow: true` på blokk-defen: da får blokken
naturlig høyde i mobilvisningens autostabling i stedet for den faste
desktophøyden, så høyere mobilinnhold aldri klippes. På desktop eier
motorens dytt-pass boksens høyde (ADR-0024): en plugin-blokk trenger ikke
måle seg selv, og skal aldri skrive målt høyde inn i rammen.

**Innstillinger i Egenskaper (felt-kontrakten)**: har blokken din enkle
innstillinger (tekst, tall, av/på, valg, sted), deklarer dem som `fields`
på blokk-defen i stedet for å bygge et eget config-panel - admin rendrer
dem rett i Egenskaper-panelet når blokken er markert:

```js
Urd.blocks.define('venue', {
  // …
  fields: [
    { key: 'location', type: 'place', labelKey: 'venue.edit.location', placeholderKey: 'venue.edit.locationPh' },
    { key: 'zoom', type: 'number', labelKey: 'venue.edit.zoom', min: 1, max: 19 },
  ],
});
```

Typene er `text`, `number` (`min`/`max`/`step`), `toggle`, `select`
(`options: [{ value, labelKey }]`) og `place` (stedssøk: teksten skrives
til `key`, koordinater til props `lat`/`lon`; kjernens kartblokk bruker
samme felt). Etikettnøklene løses av motoren før de sendes til admin, så
bruk `labelKey` fra pluginens egen ordbok. Uten `fields` viser Egenskaper
en «Innstillinger …»-knapp som åpner pluginens eget config-panel i
forhåndsvisningen (referansepluginene kalender og skjema viste det
mønsteret til og med v0.7.3, riktig for innstillinger som er mer enn en
flat felt-liste, som kildelister). Kontrakten er beskrevet i
[docs/SCHEMA.md](../../docs/SCHEMA.md#plugins).

**Temastyrt UI-regelen (ADR-0009)**: aldri native `<select>` i
redigerings-UI - popupen følger OS-temaet og blir uleselig. Bruk
`createDropdown` fra `/assets/urd/dropdown.js`, eller segmentknapper
for små valgsett.

## Mønstrene, med kjernens kode som lesestoff

Kontrakten er beskrevet i [docs/SCHEMA.md](../../docs/SCHEMA.md#plugins).
Hele formen (manifest med provides, blokk med versjon og migrering,
seksjonspreset, egen CSS via én style-tag, redigering i forhåndsvisningen
via urd-edit, ren logikk i egen modul med kontraktstester) sto i
referansepluginene kalender, skjema og kart til og med Urd 0.7.3; koden
deres ligger i git-historikken (taggen v0.7.3, `template/plugins/`). Fra
0.7.18 er de kjerneblokker, og motorens filer viser de samme mønstrene:

- **Kalender** (`assets/engine/<versjon>/blocks/calendar.js` og `ics.js`):
  `variants` for visningene, henting via sidens egen proxy `/api/ics` (så
  ingen CSP-unntak), ren parser i egen modul med tester, og eksempeldata i
  forhåndsvisningen når kilder mangler. Innstillingene (kildeliste,
  visning, antall) redigeres i Egenskaper-panelet; som plugin (til og med
  v0.7.3) hadde den et eget config-panel i forhåndsvisningen, mønsteret
  for innstillinger som er mer enn en flat felt-liste.
- **Skjema** (`blocks/form.js` og `form-model.js`): ekte skjemarendering,
  besøkende-input som aldri blir HTML, `mailto` som nulloppsett med et
  valgfritt endepunkt via `fetch` (som krever `connect-src` i `_headers`),
  honeypot mot bots, og rolig degradering når endepunktet er blokkert.
- **Kart** (`blocks/map.js` og `osm.js`): felt-kontrakten (`fields`) for
  enkle innstillinger rett i Egenskaper, en iframe mot OpenStreetMap, og
  en CSP-vaktpost som forklarer hvilken `frame-src`-linje som mangler om
  en host blokkerer kartet (Urds egen `_headers` tillater den).

Én forskjell gjelder for en plugin: kjernens blokker importerer
`../i18n.js`, `../hint.js` og `../dropdown.js` direkte, mens en plugin
ALLTID importerer fra `/assets/urd/` (motorkatalogen byttes ved hver
utgivelse, ADR-0013). Besøksmåling (Cloudflare Web Analytics) var også en
referanseplugin; den er nå nettstedsinnstillingen «Besøksmåling» bak
tannhjulet i admin.
