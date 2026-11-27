/**
 * A font or a size for a whole text, written on each leaf paragraph and list item and taken off the runs inside, in the preview or the editor.
 */

/** The block elements of a text: paragraphs, headings, list items, quotes and divisions. */
export const TEXT_BLOCKS = 'p,h1,h2,h3,h4,h5,h6,li,blockquote,div';

/** Lifts an element's children into its place and removes it. */
export function unwrap(el) {
  const parent = el.parentNode;
  if (!parent) return;
  while (el.firstChild) parent.insertBefore(el.firstChild, el);
  parent.removeChild(el);
}

/** Takes a style property off every element inside `root`, so the outermost one holds it, and unwraps a span left with no attributes. */
export function stripDescendantProp(root, prop) {
  for (const el of [...root.querySelectorAll('[style]')]) {
    if (!el.style[prop]) continue;
    el.style[prop] = '';
    if (el.getAttribute('style') === '') el.removeAttribute('style');
    if (el.tagName === 'SPAN' && !el.attributes.length) unwrap(el);
  }
}

/**
 * Writes `style` ({ fontFamily?, fontSize? }) on the leaf paragraphs and list items, wrapping loose top-level words first; a non-string value clears it.
 */
export function applyWholeStyle(field, style) {
  const loose = [...field.childNodes].filter((n) => (n.nodeType === 3 ? n.textContent.trim() !== '' : n.nodeType === 1 && !n.matches(TEXT_BLOCKS) && !n.querySelector(TEXT_BLOCKS)));
  if (loose.length) {
    const p = field.ownerDocument.createElement('p');
    field.insertBefore(p, loose[0]);
    p.append(...loose);
  }
  const all = [...field.querySelectorAll(TEXT_BLOCKS)];
  const paragraphs = all.filter((el) => !all.some((o) => o !== el && el.contains(o)));
  for (const prop of ['fontFamily', 'fontSize']) {
    if (!(prop in style)) continue;
    const value = typeof style[prop] === 'string' ? style[prop] : '';
    for (const el of paragraphs) {
      el.style[prop] = value;
      if (el.getAttribute('style') === '') el.removeAttribute('style');
      stripDescendantProp(el, prop);
    }
  }
}

/** The same on a text's HTML, parsed in a document of its own, which runs and loads nothing; the text comes back as HTML. */
export function wholeStyleHtml(html, style) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  applyWholeStyle(doc.body, style);
  return doc.body.innerHTML;
}
