/* Setter det lagrede lys/mørk-valget som data-urd-theme FØR første paint, så et
   manuelt valg ikke blinker. «Følg system» trenger ikke dette (CSS light-dark()
   følger OS selv). Klassisk, parser-blokkerende skript (CSP: script-src 'self',
   ingen 'unsafe-inline'), IKKE en modul - importeres ikke, står derfor utenom
   modulepreload-lista. Nøkkelen speiler MODE_KEY i theme.js. */
try {
  var m = localStorage.getItem('urd-theme-mode');
  if (m === 'light' || m === 'dark') {
    document.documentElement.setAttribute('data-urd-theme', m);
  }
} catch (e) {
  /* localStorage avslått (privat modus): følg systemet. */
}
