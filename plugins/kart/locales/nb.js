/**
 * Kart-pluginens tekster, norsk bokmål (basen: lastes alltid først,
 * valgt språk legges oppå). Kjøretids-lastes av plugin-lasteren (ADR-0012);
 * paritetstesten (tests/i18n.test.mjs) holder språkfilene i synk.
 * Besøkende-nøkler under kart.*, editor-chrome under kart.edit.*.
 */
export default {
  lang: 'nb',
  strings: {
    'kart.larger': 'Vis større kart',
    'kart.mapTitle': 'Kart',
    'kart.openOsm': 'Åpne kartet på OpenStreetMap',
    'kart.edit.blockLabel': 'Kart',
    'kart.edit.cspBlocked': 'Kartet er blokkert av nettstedets CSP.',
    'kart.edit.cspFix': 'Legg denne verten i frame-src i _headers, så vises kartet:',
    'kart.edit.empty': 'Velg blokken og legg inn en adresse, koordinater eller en OSM-lenke i Egenskaper.',
    'kart.edit.height': 'Høyde (piksler)',
    'kart.edit.hint1': 'Velg blokken og skriv en adresse (f.eks. «Storgata 1, Oslo»), koordinater («59.913, 10.739») eller lim inn en OSM-lenke i Egenskaper',
    'kart.edit.hint2': 'Adressesøket slår opp stedet via OpenStreetMap når du klikker «Søk» (virker på den publiserte siden; koordinater og lenker virker også lokalt)',
    'kart.edit.hint3': 'Still zoom (1 er verden, 19 er gatenivå) og høyden på kartet',
    'kart.edit.hint4': 'Kartet er OpenStreetMaps egen innbygging: ingen sporing, ingen informasjonskapsler',
    'kart.edit.hint5': 'Urds standard _headers tillater kartet. På andre hoster må «frame-src https://www.openstreetmap.org» ligge i _headers (blokken sier fra om det er blokkert)',
    'kart.edit.hintTitle': 'Kartblokken',
    'kart.edit.location': 'Sted',
    'kart.edit.locationPh': 'Adresse, koordinater eller OSM-lenke',
    'kart.edit.presetHint': 'Kart med adressen deres (personvennlig OpenStreetMap)',
    'kart.edit.presetLabel': 'Finn oss',
    'kart.edit.seedTitle': '<h2>Finn oss</h2>',
    'kart.edit.zoom': 'Zoom (1 til 19)',
  },
};
