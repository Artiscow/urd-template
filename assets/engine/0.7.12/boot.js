/**
 * Startup for the visitor page.
 * A separate file (not inline in index.html) so Content-Security-Policy can require script-src 'self' with no exceptions.
 * Notes: docs/engine-notes/boot.md (Urd repository).
 */
import { boot, endArrivalHold } from './urd.js';

// Loaded render-blocking by the shell, so the page transition listener (the arrival hold in urd.js) is in place by the first rendering opportunity.
boot({
  root: document.getElementById('urd-root'),
  nav: document.getElementById('urd-nav'),
}).catch((err) => {
  // A failed boot ends a held page transition, so the shell shows at once instead of after the hold's ceiling.
  endArrivalHold();
  console.error('Urd: boot failed', err);
});
