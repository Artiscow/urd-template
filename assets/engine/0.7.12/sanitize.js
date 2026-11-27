/**
 * Rich text kept to an allowlist: the HTML a text, a paste or a feed may hold, rebuilt from an inert document, and the plain text read out of it.
 * Notes: docs/engine-notes/sanitize.md (Urd repository).
 */
import { resolveLink, isSafeHref, isSafeImage } from './nav-model.js';

/**
 * The HTML a rich text may hold (SCHEMA.md «Rich text»), shared by drawing a text and pasting into one: its elements, attributes and styles.
 */
export const RICH_TEXT = {
  elements: {
    p: [], div: [], h1: [], h2: [], h3: [], h4: [], h5: [], h6: [], pre: [], hr: [], br: [],
    blockquote: ['data-urd-form'], ul: [], ol: ['start', 'reversed', 'type'], li: ['value'], dl: [], dt: [], dd: [],
    figure: [], figcaption: [], table: [], caption: [], thead: [], tbody: [], tfoot: [], tr: [], th: ['colspan', 'rowspan'], td: ['colspan', 'rowspan'],
    a: ['href', 'target', 'rel', 'download', 'data-urd-page', 'data-urd-target'], img: ['src', 'alt', 'width', 'height'],
    b: [], strong: [], i: [], em: [], u: [], s: [], strike: [], del: [], ins: [], sub: [], sup: [], mark: [], small: [],
    code: [], kbd: [], abbr: [], q: [], cite: [], span: ['data-urd-fill'], font: ['face', 'color', 'size'],
  },
  shared: ['style', 'title', 'dir', 'lang', 'align'],
  styles: ['color', 'background-color', 'font-family', 'font-size', 'font-weight', 'font-style', 'text-decoration', 'text-decoration-line', 'text-align', 'line-height', 'letter-spacing', 'margin-left', 'vertical-align'],
  pasted: ['font-weight', 'font-style', 'text-decoration', 'text-decoration-line', 'text-align', 'vertical-align'],
  dropped: ['script', 'style', 'template', 'noscript', 'iframe', 'frame', 'frameset', 'object', 'embed', 'applet', 'portal', 'svg', 'math', 'canvas', 'video', 'audio', 'picture', 'source', 'track', 'select', 'textarea', 'button', 'input', 'option', 'optgroup', 'datalist', 'head', 'title', 'meta', 'base', 'link'],
};

const HTML_NS = 'http://www.w3.org/1999/xhtml';
const DROPPED = new Set(RICH_TEXT.dropped);
/** How deep a text's elements are rebuilt; anything deeper is kept as its words. */
const MAX_DEPTH = 64;
/** A style value of colours, lengths, numbers and font names, with no address, escape or second declaration in it. */
const STYLE_VALUE = /^[a-zA-Z0-9#%.,()'"\s+-]{1,300}$/;
const REL_WORDS = new Set(['noopener', 'noreferrer', 'nofollow', 'ugc', 'sponsored', 'external']);

/** Each attribute's own check, by name: a value that fails it is left out. */
const VALUE_CHECKS = {
  href: (v) => isSafeHref(v),
  src: (v) => isSafeImage(v) || /^https:\/\/[^\s"'<>\\]{1,2048}$/.test(v),
  target: (v) => v === '_blank',
  download: (v) => /^[\w .-]{0,100}$/.test(v),
  'data-urd-page': (v) => /^[\w.:-]{1,200}$/.test(v),
  'data-urd-target': (v) => /^[\w.:-]{1,200}$/.test(v),
  'data-urd-form': (v) => /^[\w-]{0,40}$/.test(v),
  'data-urd-fill': (v) => /^\w{0,40}$/.test(v),
  width: (v) => /^\d{1,4}$/.test(v),
  height: (v) => /^\d{1,4}$/.test(v),
  colspan: (v) => /^\d{1,3}$/.test(v),
  rowspan: (v) => /^\d{1,3}$/.test(v),
  start: (v) => /^-?\d{1,6}$/.test(v),
  value: (v) => /^-?\d{1,6}$/.test(v),
  reversed: (v) => v === '' || v === 'reversed',
  type: (v) => /^[1aAiI]$/.test(v),
  size: (v) => /^[+-]?\d$/.test(v),
  face: (v) => /^[\w\s,'"-]{1,200}$/.test(v),
  color: (v) => /^(?:#[0-9a-f]{3,8}|[a-z]{3,30}|rgba?\([\d\s.,%]+\))$/i.test(v),
  dir: (v) => /^(?:ltr|rtl|auto)$/i.test(v),
  align: (v) => /^(?:left|right|center|justify)$/i.test(v),
  lang: (v) => /^[a-z]{2,3}(?:-[a-z0-9]{2,8})*$/i.test(v),
  alt: (v) => v.length <= 1000,
  title: (v) => v.length <= 1000,
};

/**
 * A `style` attribute kept to RICH_TEXT.styles with plain values, a paste keeping its own value only for RICH_TEXT.pasted; empty when none is left.
 * @param {string} value
 * @param {boolean} [pasted]
 */
export function richStyle(value, pasted = false) {
  const kept = [];
  for (const declaration of String(value ?? '').split(';')) {
    const colon = declaration.indexOf(':');
    if (colon < 0) continue;
    const name = declaration.slice(0, colon).trim().toLowerCase();
    const v = declaration.slice(colon + 1).trim();
    if (!RICH_TEXT.styles.includes(name) || !STYLE_VALUE.test(v) || /url\(|expression|image-set|\/\*/i.test(v)) continue;
    if (pasted && !RICH_TEXT.pasted.includes(name) && !/^var\(--urd-[a-z0-9-]+\)$/i.test(v)) continue;
    kept.push(`${name}: ${v}`);
  }
  return kept.join('; ');
}

/**
 * Rebuilds a rich text from the allowlist (RICH_TEXT): each child of `source` becomes a new element made with `doc`, with only its allowed, checked attributes.
 * @param {Node} source
 * @param {Document} doc
 * A paste (`pasted`) keeps its own words' look in part only (richStyle), and a `font` element's face, colour and size not at all.
 * @param {{pages?: Array<{id: string, path: string}>|null, dropClasses?: string[], pasted?: boolean}} [options]
 * @returns {DocumentFragment}
 */
export function buildRich(source, doc, { pages = null, dropClasses = [], pasted = false } = {}) {
  const copy = (from, to, depth) => {
    for (const node of from.childNodes) {
      if (node.nodeType === 3) {
        to.appendChild(doc.createTextNode(node.nodeValue));
        continue;
      }
      if (node.nodeType !== 1) continue;
      if (node.namespaceURI !== HTML_NS) continue;
      const tag = String(node.localName).toLowerCase();
      if (DROPPED.has(tag)) continue;
      if (dropClasses.length && String(node.getAttribute('class') ?? '').split(/\s+/).some((c) => dropClasses.includes(c))) continue;
      if (depth >= MAX_DEPTH) {
        to.appendChild(doc.createTextNode(node.textContent ?? ''));
        continue;
      }
      const own = RICH_TEXT.elements[tag];
      if (!own) {
        copy(node, to, depth + 1);
        continue;
      }
      const el = doc.createElement(tag);
      for (const attr of node.attributes) {
        const name = attr.name.toLowerCase();
        if (!own.includes(name) && !RICH_TEXT.shared.includes(name)) continue;
        if (pasted && tag === 'font') continue;
        if (name === 'style') {
          const style = richStyle(attr.value, pasted);
          if (style) el.setAttribute('style', style);
          continue;
        }
        if (name === 'rel') {
          const words = attr.value.split(/\s+/).filter((w) => REL_WORDS.has(w.toLowerCase()));
          if (words.length) el.setAttribute('rel', words.join(' '));
          continue;
        }
        const value = name === 'href' || name === 'src' ? attr.value.trim() : attr.value;
        if (VALUE_CHECKS[name]?.(value) ?? true) el.setAttribute(name, value);
      }
      if (tag === 'a') {
        if (pages && (el.hasAttribute('data-urd-page') || el.hasAttribute('data-urd-target'))) {
          el.setAttribute('href', resolveLink({ page: el.getAttribute('data-urd-page') ?? undefined, target: el.getAttribute('data-urd-target') ?? undefined }, pages).href);
        }
        if (el.getAttribute('target') === '_blank') {
          const rel = new Set(String(el.getAttribute('rel') ?? '').split(/\s+/).filter(Boolean));
          rel.add('noopener');
          el.setAttribute('rel', [...rel].join(' '));
        }
      }
      copy(node, el, depth + 1);
      to.appendChild(el);
    }
  };
  const fragment = doc.createDocumentFragment();
  copy(source, fragment, 0);
  return fragment;
}

/**
 * A rich text as the page draws it: parsed in an inert document, where nothing loads or runs, and rebuilt from the allowlist (buildRich).
 * @param {string} html
 * @param {{pages?: Array<{id: string, path: string}>|null, dropClasses?: string[]}} [options]
 * @returns {DocumentFragment}
 */
function richFragment(html, options) {
  const parsed = new DOMParser().parseFromString(String(html ?? ''), 'text/html');
  return buildRich(parsed.body, document, options);
}

/**
 * Fills `node` with a rich text (richFragment), in place of what it held.
 * @param {Element} node
 * @param {string} html
 * @param {Array<{id: string, path: string}>|null} [pages]
 * @param {{dropClasses?: string[]}} [options]
 */
export function setRichHtml(node, html, pages = null, options = {}) {
  node.replaceChildren(richFragment(html, { ...options, pages }));
}

/** The editing handles a text stored by an older Urd can hold, left out when it is drawn. */
export const EDIT_HANDLES = ['urd-edit-toolbar', 'urd-edit-resize', 'urd-edit-rotate'];

/** A rich text cleaned by the allowlist as a paste is, as HTML text: what a paste or a drop into a text inserts. */
export function cleanRichHtml(html) {
  const holder = document.createElement('div');
  holder.appendChild(richFragment(html, { pasted: true }));
  return holder.innerHTML;
}

/**
 * What a paste or a drop into an editable text inserts, or null to leave it to the browser: plain words, or HTML cleaned by cleanRichHtml.
 * @param {string|null} editable The field's contenteditable value
 * @param {boolean} plain
 * @param {string} html The clipboard's or the drop's text/html
 * @param {string} text Its text/plain
 * @returns {{command: 'insertHTML'|'insertText', value: string}|null}
 */
export function pasteCommand(editable, plain, html, text) {
  if (editable !== 'true') return null;
  if (plain) return text ? { command: 'insertText', value: text } : null;
  if (!html) return null;
  const clean = cleanRichHtml(html);
  if (clean.trim()) return { command: 'insertHTML', value: clean };
  return text ? { command: 'insertText', value: text } : null;
}

const KEPT_TAGS = new Set(['P', 'BR', 'UL', 'OL', 'LI', 'B', 'STRONG', 'I', 'EM', 'U', 'BLOCKQUOTE', 'A']);
const DROPPED_TAGS = new Set(['SCRIPT', 'STYLE', 'HEAD', 'TITLE', 'IFRAME', 'OBJECT', 'EMBED', 'FORM', 'INPUT', 'BUTTON', 'SELECT', 'TEXTAREA', 'SVG', 'MATH', 'IMG', 'PICTURE', 'VIDEO', 'AUDIO', 'CANVAS', 'LINK', 'META', 'BASE', 'TEMPLATE', 'NOSCRIPT']);

/**
 * HTML from a source nobody on the site wrote (a calendar feed), parsed in an inert document and rebuilt from a small allowlist with safe links.
 */
export function safeHtmlFragment(html) {
  const doc = new DOMParser().parseFromString(String(html ?? ''), 'text/html');
  const copy = (from, to) => {
    for (const node of from.childNodes) {
      if (node.nodeType === 3) {
        to.appendChild(document.createTextNode(node.nodeValue));
        continue;
      }
      if (node.nodeType !== 1) continue;
      const tag = node.tagName.toUpperCase();
      if (DROPPED_TAGS.has(tag)) continue;
      if (/^H[1-6]$/.test(tag)) {
        const strong = document.createElement('strong');
        copy(node, strong);
        to.appendChild(document.createElement('p')).appendChild(strong);
      } else if (tag === 'DIV') {
        copy(node, to.appendChild(document.createElement('p')));
      } else if (!KEPT_TAGS.has(tag)) {
        copy(node, to);
      } else {
        const el = document.createElement(tag.toLowerCase());
        if (tag === 'A') {
          let address = null;
          try { address = new URL(node.getAttribute('href') ?? '', 'https://invalid.invalid/'); } catch { /* no address */ }
          if (address && ['http:', 'https:', 'mailto:'].includes(address.protocol) && address.hostname !== 'invalid.invalid') {
            el.href = address.href;
            el.target = '_blank';
            el.rel = 'noopener';
          }
        }
        copy(node, el);
        to.appendChild(el);
      }
    }
  };
  const fragment = document.createDocumentFragment();
  copy(doc.body, fragment);
  return fragment;
}

/**
 * Plain text from rich text, read from the text content of the markup parsed in an inert document, so no tag remnants survive.
 */
export function plainText(html) {
  const doc = new DOMParser().parseFromString(String(html ?? ''), 'text/html');
  return (doc.body.textContent ?? '').trim();
}

/**
 * The lines of a text that may hold markup, such as a feed's description, parsed in an inert document with breaks and block ends as new lines.
 */
export function plainLines(text) {
  const source = String(text ?? '');
  if (!/<[a-z!/][^>]*>|&#?\w+;/i.test(source)) return source;
  const doc = new DOMParser().parseFromString(source, 'text/html');
  for (const br of doc.body.querySelectorAll('br')) br.replaceWith('\n');
  for (const block of doc.body.querySelectorAll('p, div, li, h1, h2, h3, h4, h5, h6, blockquote, tr')) block.append('\n');
  return doc.body.textContent ?? '';
}
