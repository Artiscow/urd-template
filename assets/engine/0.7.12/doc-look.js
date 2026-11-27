/**
 * Documents: the designs a long text is drawn in (the privacy page, the terms of sale) and the look the owner sets on them; the stored text is never restructured.
 * Notes: docs/engine-notes/doc-look.md (Urd repository).
 */
import { t } from './i18n.js';

/** The corners a document's boxes take: none, the theme's small and medium radius, and round. */
export const DOC_CORNERS = ['none', 'sm', 'md', 'round'];

const SAFE_HEX = /^#[0-9a-fA-F]{3,8}$/;
const SAFE_TOKEN = /^[a-z][a-z0-9-]*$/;
/* A font stack as the font lists write them: names, quotes, commas and spaces. */
const SAFE_FONT = /^[A-Za-z0-9 ,'"-]{1,200}$/;

/** A colour prop as CSS: a hex value or a theme token, else null. */
export function docColor(value) {
  if (typeof value !== 'string') return null;
  if (SAFE_HEX.test(value)) return value;
  if (SAFE_TOKEN.test(value)) return `var(--urd-color-${value})`;
  return null;
}

/** A corner choice as CSS: the radius a document's cards take; null for the theme's medium radius. */
export function docRadius(value) {
  if (value === 'none') return '0px';
  if (value === 'sm') return 'var(--urd-radius-sm)';
  if (value === 'round') return 'calc(var(--urd-radius-md) * 2.2)';
  return null;
}

/**
 * The look of a document as CSS custom properties: only what the owner has set, so the rest follows the theme (doc-look.css gives each its fallback).
 * @param {{accent?: string, headingColor?: string, cardColor?: string, corners?: string, headingFont?: string, font?: string}} props
 * @returns {Record<string, string>}
 */
export function docLookVars(props) {
  const p = props ?? {};
  const vars = {};
  const accent = docColor(p.accent);
  if (accent) vars['--urd-doc-accent'] = accent;
  const heading = docColor(p.headingColor);
  if (heading) vars['--urd-doc-heading'] = heading;
  const card = docColor(p.cardColor);
  if (card) vars['--urd-doc-card'] = card;
  const radius = docRadius(p.corners);
  if (radius) vars['--urd-doc-radius'] = radius;
  if (typeof p.headingFont === 'string' && SAFE_FONT.test(p.headingFont)) vars['--urd-doc-heading-font'] = p.headingFont;
  if (typeof p.font === 'string' && SAFE_FONT.test(p.font)) vars['--urd-doc-font'] = p.font;
  return vars;
}

/**
 * Which look settings a design draws, for the menu: accent, heading colour and font in each; the side with contents, the placement with contents and on privacy.
 * @param {'privacy'|'terms'|'text'} type
 * @param {string} design
 * @param {{html?: string}} [props]
 * @returns {{side: boolean, align: boolean, accent: boolean, headingColor: boolean, cardColor: boolean, rules: boolean, corners: boolean, headingFont: boolean, font: boolean}}
 */
export function docLookSettings(type, design, props = {}) {
  const none = { side: false, align: false, accent: false, headingColor: false, cardColor: false, rules: false, corners: false, headingFont: false, font: false };
  if (design === 'plain') return none;
  const cards = type === 'privacy' || ['contents', 'glance'].includes(design) || /data-urd-form/.test(String(props.html ?? ''));
  return {
    side: design === 'contents',
    align: type === 'privacy' || design === 'contents',
    accent: true,
    headingColor: true,
    cardColor: cards,
    rules: design !== 'clauses',
    corners: cards || design === 'clauses',
    headingFont: true,
    font: type === 'privacy',
  };
}

/**
 * Writes onto a document's root its design, lines, contents side and placement (centred unless set to the left) as data attributes, its look as custom properties.
 * @param {HTMLElement} root
 * @param {string} design
 * @param {object} props
 */
export function applyDocLook(root, design, props) {
  root.dataset.design = design;
  if (props?.rules === false) root.dataset.rules = 'off';
  else delete root.dataset.rules;
  if (design === 'contents' && props?.contentsSide === 'right') root.dataset.side = 'right';
  else delete root.dataset.side;
  // Centred unless the owner has set the document to its block's left edge (`placement: 'start'`).
  if (props?.placement !== 'start') root.dataset.align = 'center';
  else delete root.dataset.align;
  for (const [name, value] of Object.entries(docLookVars(props))) root.style.setProperty(name, value);
}

/**
 * The contents of a document from its headings: a list beside the text and the same list folded into one row, each heading given an id its links jump to.
 * @param {HTMLElement[]} headings The parts' headings, in order
 * @param {string} prefix The ids' prefix, unique on the page (the block's id)
 * @returns {{nav: HTMLElement, fold: HTMLElement}}
 */
export function buildContents(headings, prefix) {
  const nav = document.createElement('nav');
  nav.className = 'urd-doc-toc';
  nav.setAttribute('aria-label', t('doc.contents'));
  const label = document.createElement('p');
  label.className = 'urd-doc-toc-label';
  label.textContent = t('doc.contents');
  const fold = document.createElement('details');
  fold.className = 'urd-doc-fold';
  const summary = document.createElement('summary');
  summary.textContent = t('doc.contents');
  fold.appendChild(summary);
  const lists = [document.createElement('ol'), document.createElement('ol')];
  headings.forEach((h, i) => {
    h.id = `${prefix}-part-${i + 1}`;
    h.dataset.urdDocId = '';
    for (const list of lists) {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = `#${h.id}`;
      a.textContent = h.textContent.trim();
      li.appendChild(a);
      list.appendChild(li);
    }
  });
  nav.append(label, lists[0]);
  fold.appendChild(lists[1]);
  // A jump from the folded row closes it again, so the text is not pushed down under it.
  fold.addEventListener('click', (event) => {
    if (event.target instanceof Element && event.target.closest('a')) fold.open = false;
  });
  watchCurrent(nav, headings);
  return { nav, fold };
}

/**
 * Marks the part the reader is in: the last heading that has reached the upper third of the window, by an IntersectionObserver; without one, no mark.
 * @param {HTMLElement} nav
 * @param {HTMLElement[]} headings
 */
function watchCurrent(nav, headings) {
  if (typeof IntersectionObserver !== 'function' || !headings.length) return;
  const links = [...nav.querySelectorAll('a')];
  const passed = new Set();
  const mark = () => {
    let current = 0;
    headings.forEach((h, i) => { if (passed.has(h)) current = i; });
    links.forEach((a, i) => {
      if (i === current) a.setAttribute('aria-current', 'location');
      else a.removeAttribute('aria-current');
    });
  };
  // A list drawn again leaves the old one out of the page: its watch ends then.
  let shown = false;
  const observer = new IntersectionObserver((entries) => {
    if (!nav.isConnected) {
      if (shown) observer.disconnect();
      return;
    }
    shown = true;
    for (const entry of entries) {
      // A heading above the window's upper third has been passed; one below it not yet.
      if (entry.isIntersecting || entry.boundingClientRect.top < 0) passed.add(entry.target);
      else passed.delete(entry.target);
    }
    mark();
  }, { rootMargin: '0px 0px -66% 0px' });
  for (const h of headings) observer.observe(h);
  mark();
}

/**
 * A text's parts as questions that fold out: each `h2` and what follows it up to the next, in `<details>` sharing one name so one opens at a time, the first open.
 * @param {HTMLElement} content The text's element
 * @param {string} name The group's name, unique on the page
 */
export function foldParts(content, name) {
  const children = [...content.children];
  let part = null;
  let first = true;
  for (const child of children) {
    if (child.tagName === 'H2') {
      part = document.createElement('details');
      part.className = 'urd-doc-part';
      part.name = name;
      if (first) part.open = true;
      first = false;
      const summary = document.createElement('summary');
      content.insertBefore(part, child);
      summary.appendChild(child);
      const answer = document.createElement('div');
      answer.className = 'urd-doc-answer';
      part.append(summary, answer);
      continue;
    }
    if (part) part.querySelector(':scope > .urd-doc-answer').appendChild(child);
  }
}

/**
 * Adds under each withdrawal form in a text (`data-urd-form`) a button that prints the form alone (base.css, html.urd-print-form).
 * @param {HTMLElement} content
 */
export function addFormPrint(content) {
  for (const form of content.querySelectorAll('[data-urd-form]')) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'urd-doc-print';
    button.textContent = t('doc.printForm');
    button.addEventListener('click', () => {
      form.dataset.urdPrinting = '';
      document.documentElement.classList.add('urd-print-form');
      const done = () => {
        document.documentElement.classList.remove('urd-print-form');
        delete form.dataset.urdPrinting;
      };
      window.addEventListener('afterprint', done, { once: true });
      window.print();
    });
    form.after(button);
  }
}
