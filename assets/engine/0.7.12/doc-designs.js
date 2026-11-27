/**
 * The designs a document is drawn in (the privacy page, the terms of sale, a text), the design a stored value reads as, and the text a document stores.
 * Notes: docs/engine-notes/doc-designs.md (Urd repository).
 */

/** The privacy page's designs, in the picker's order; the first is the one a block without a choice is drawn in. */
export const PRIVACY_DESIGNS = ['long', 'contents', 'glance', 'questions', 'ledger', 'ledger-cards'];

/** The designs a text is drawn in: plain text, the way every text block is drawn, and the document designs the terms of sale take. */
export const TEXT_DESIGNS = ['plain', 'long', 'contents', 'glance', 'questions', 'clauses'];

/** The terms of sale's designs, in the picker's order; the first is the one a block without a choice is drawn in. */
export const TERMS_DESIGNS = ['long', 'contents', 'glance', 'questions', 'clauses'];

/** The privacy page's design a stored value reads as. */
export function privacyDesign(value) {
  return PRIVACY_DESIGNS.includes(value) ? value : 'long';
}

/** A text's design a stored value reads as. */
export function textDesign(value) {
  return TEXT_DESIGNS.includes(value) ? value : 'plain';
}

/** The terms of sale's design a stored value reads as. */
export function termsDesign(value) {
  return TERMS_DESIGNS.includes(value) ? value : 'long';
}

/**
 * A text's HTML as it is stored: what the drawing added to it (the contents' ids on its headings) taken off a copy, so the stored text is the owner's alone.
 * @param {HTMLElement} content
 * @returns {string}
 */
export function storedDocHtml(content) {
  if (!content.querySelector('[data-urd-doc-id]')) return content.innerHTML;
  const copy = content.cloneNode(true);
  for (const h of copy.querySelectorAll('[data-urd-doc-id]')) {
    h.removeAttribute('id');
    h.removeAttribute('data-urd-doc-id');
  }
  return copy.innerHTML;
}
