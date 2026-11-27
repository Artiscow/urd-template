/* Sets the stored light or dark choice as data-urd-theme before the first paint, read under theme.js's MODE_KEY. */
try {
  var m = localStorage.getItem('urd-theme-mode');
  if (m === 'light' || m === 'dark') {
    document.documentElement.setAttribute('data-urd-theme', m);
  }
} catch (e) {
  /* localStorage denied (private mode): follow the system. */
}
