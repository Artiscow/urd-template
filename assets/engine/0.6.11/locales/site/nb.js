/**
 * Besøkende-tekster, norsk bokmål. Dette er BASEN: alle andre språk
 * legges oppå denne, så en nøkkel som mangler i et annet språk faller
 * tilbake hit. Nøklene er engelske identifikatorer (datakontrakt-regelen);
 * paritetstesten (tests/i18n.test.mjs) holder språkfilene i synk.
 * Datotabellene under er fallback når ICU mangler språket; til vanlig
 * hentes datonavn fra Intl (se i18n.js).
 */
export default {
  lang: 'nb',
  strings: {
    'nav.toFront': 'Til forsiden',
    'nav.toLightTheme': 'Bytt til lyst tema',
    'nav.toDarkTheme': 'Bytt til mørkt tema',
    'nav.menu': 'Meny',
    'nav.submenuFor': 'Undermeny for {label}',
    'nav.toTop': 'Til toppen',
    'nav.toTopFull': 'Til toppen av siden',
    'lightbox.prev': 'Forrige bilde',
    'lightbox.next': 'Neste bilde',
    'lightbox.close': 'Lukk',
    'footer.readMore': 'Les mer',
    'footer.newsletter.subscribe': 'Meld på',
    'footer.newsletter.success': 'Takk, du er påmeldt!',
    'footer.newsletter.emailPlaceholder': 'din@epost.no',
    'footer.newsletter.emailLabel': 'E-postadresse',
    'footer.newsletter.invalidEmail': 'Skriv inn en gyldig e-postadresse.',
    'footer.newsletter.sendFailed': 'Kunne ikke sende akkurat nå. Prøv igjen senere.',
    'footer.newsletter.missingTarget': 'Nyhetsbrevet mangler mottaker eller endepunkt.',
    'footer.newsletter.mailtoSubject': 'Nyhetsbrev-påmelding',
    'footer.newsletter.mailtoBody': 'Meld på nyhetsbrevet: {email}',
    'gallery.prevImages': 'Forrige bilder',
    'gallery.nextImages': 'Neste bilder',
    'gallery.prevImage': 'Forrige bilde',
    'gallery.nextImage': 'Neste bilde',
    'gallery.imageN': 'Bilde {n}',
    'video.unknownUrl': 'Ukjent videolenke (YouTube og Vimeo støttes)',
    'video.emptyHint': 'Lim inn en YouTube- eller Vimeo-lenke i Egenskaper',
    'render.missingPlugin': "Blokktypen '{type}' er ikke tilgjengelig (mangler plugin eller nyere Urd?)",
  },
  dates: {
    months: ['januar', 'februar', 'mars', 'april', 'mai', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'desember'],
    monthsShort: ['jan', 'feb', 'mar', 'apr', 'mai', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'des'],
    weekdays: ['mandag', 'tirsdag', 'onsdag', 'torsdag', 'fredag', 'lørdag', 'søndag'],
    weekdaysShort: ['man', 'tir', 'ons', 'tor', 'fre', 'lør', 'søn'],
  },
};
