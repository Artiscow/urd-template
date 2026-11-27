/**
 * Sets the site icon in the admin tab from site.json before the editor bundle loads; the editor keeps it in sync after.
 */
fetch('/content/site.json')
  .then((response) => response.json())
  .then((site) => {
    const icon = site?.site?.icon;
    // Same guard as in the editor: only data:image (base64) or a site-relative path, as an anchored regex (CodeQL recognises RegExp.test as a barrier).
    if (typeof icon !== 'string') return;
    if (!/^(?:data:image\/[\w.+-]+;base64,[A-Za-z0-9+/=]+|\/(?!\/)[\w%./-]*)$/.test(icon)) return;
    document.querySelector('link[rel="icon"]').href = icon;
  })
  .catch(() => {});
