/**
 * Setter nettstedsikonet i admin-fanen så tidlig som mulig.
 * Uten dette vises standard Urd-merket til editor-bunten er lastet og har lest site.json, som synes som et ikonblink ved hver innlasting.
 * Kjøres som egen liten fil (CSP-en tillater ikke inline-skript) før editor-bunten; editoren tar over synkroniseringen etterpå.
 */
fetch('/content/site.json')
  .then((response) => response.json())
  .then((site) => {
    const icon = site?.site?.icon;
    // Samme vokter som i editoren: kun data:image (base64) eller site-relativ sti, som anket regex (CodeQL gjenkjenner RegExp.test som barriere).
    if (typeof icon !== 'string') return;
    if (!/^(?:data:image\/[\w.+-]+;base64,[A-Za-z0-9+/=]+|\/(?!\/)[\w%./-]*)$/.test(icon)) return;
    document.querySelector('link[rel="icon"]').href = icon;
  })
  .catch(() => {});
