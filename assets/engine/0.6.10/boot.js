/**
 * Oppstart for besøkersiden. Egen fil (ikke inline i index.html) slik at
 * Content-Security-Policy kan kreve script-src 'self' uten unntak.
 */
import { boot } from './urd.js';

boot({
  root: document.getElementById('urd-root'),
  nav: document.getElementById('urd-nav'),
});
