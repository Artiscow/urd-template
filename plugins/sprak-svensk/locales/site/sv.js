/**
 * Svenska besökartexter: motorns egen chrome (navigation, sidfot, ljusbox,
 * galleri, video). Filen har samma form som motorns locales/site/<kod>.js,
 * och nycklarna är desamma - bokmålsbasen ligger under, så en nyckel som
 * saknas här visas på bokmål i stället för att försvinna.
 */
export default {
  lang: 'sv',
  strings: {
    'nav.toFront': 'Till startsidan',
    'nav.toLightTheme': 'Byt till ljust tema',
    'nav.toDarkTheme': 'Byt till mörkt tema',
    'nav.menu': 'Meny',
    'nav.submenuFor': 'Undermeny för {label}',
    'nav.toTop': 'Till toppen',
    'nav.toTopFull': 'Till sidans topp',
    'lightbox.prev': 'Föregående bild',
    'lightbox.next': 'Nästa bild',
    'lightbox.close': 'Stäng',
    'footer.readMore': 'Läs mer',
    'footer.newsletter.subscribe': 'Prenumerera',
    'footer.newsletter.success': 'Tack, du är anmäld!',
    'footer.newsletter.emailPlaceholder': 'din@epost.se',
    'footer.newsletter.emailLabel': 'E-postadress',
    'footer.newsletter.invalidEmail': 'Ange en giltig e-postadress.',
    'footer.newsletter.sendFailed': 'Det gick inte att skicka just nu. Försök igen senare.',
    'footer.newsletter.missingTarget': 'Nyhetsbrevet saknar mottagare eller slutpunkt.',
    'footer.newsletter.mailtoSubject': 'Anmälan till nyhetsbrev',
    'footer.newsletter.mailtoBody': 'Anmäl till nyhetsbrevet: {email}',
    'gallery.prevImages': 'Föregående bilder',
    'gallery.nextImages': 'Nästa bilder',
    'gallery.prevImage': 'Föregående bild',
    'gallery.nextImage': 'Nästa bild',
    'gallery.imageN': 'Bild {n}',
    'video.unknownUrl': 'Okänd videolänk (YouTube och Vimeo stöds)',
    'video.emptyHint': 'Klistra in en YouTube- eller Vimeo-länk i Egenskaper',
    'render.missingPlugin': "Blocktypen '{type}' är inte tillgänglig (saknas en plugin, eller krävs en nyare Urd?)",
  },
};
