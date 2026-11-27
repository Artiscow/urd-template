/**
 * Core block: collection (ADR-0007). Draws a collection's entries from content/samlinger/ as cards, a list or a yearly archive, once they are loaded.
 * Notes: docs/engine-notes/blocks/collection.md (Urd repository).
 */
import { getCollection, sortEntries, groupByYear, dateBadge } from '../collections.js';
import { setRichHtml } from '../sanitize.js';
import { resolveLink, linkAttrs } from '../nav-model.js';
// Only called in preview (after the admin dictionary is loaded): never at module level.
import { ta, adminLocaleReady } from '../i18n.js';
import { drawPicture } from '../picture.js';

/** Editing context while a collection renders in preview: {collection}, or null (visitors). */
let editCtx = null;

/** The page register of the render running now, for an entry that links a page. */
let pagesNow = [];

const post = (msg) => window.parent?.postMessage(msg, location.origin);

/**
 * Click-and-type on an entry's title or text in the preview, each change posted to the editor, which owns the collection draft.
 */
function editable(node, entryId, field, html = false) {
  if (!editCtx) return node;
  node.contentEditable = 'true';
  node.classList.add('urd-collection-editable');
  const collection = editCtx.collection;
  node.addEventListener('input', () => {
    post({ type: 'urd-collection-edit', collection, entryId, field, value: html ? node.innerHTML : node.textContent });
  });
  return node;
}

/** A click on an entry's picture in the preview opens the admin's image editor on it, with the picture's box as drawn here. */
function wireImageEdit(target, entry) {
  if (!editCtx) return;
  const collection = editCtx.collection;
  target.classList.add('urd-collection-image-edit');
  target.title = ta('canvas.editImage');
  target.addEventListener('click', () => {
    post({ type: 'urd-picture-edit', kind: 'entry', collection, entryId: entry.id, frameRatio: target.offsetHeight ? target.offsetWidth / target.offsetHeight : 0, frameWidth: target.offsetWidth, frameHeight: target.offsetHeight });
  });
}

/**
 * An entry's text as rich HTML, sanitized as a text block's, with the floating text editor in preview; an empty one shows as a placeholder.
 */
function textOrPlaceholder(entry) {
  if (!entry.text && !editCtx) return null;
  const node = el2('div', 'urd-text urd-collection-text');
  if (entry.text) {
    setRichHtml(node, entry.text, pagesNow);
  } else {
    node.classList.add('urd-collection-placeholder');
    node.dataset.placeholder = ta('canvas.textPlaceholder');
  }
  return editable(node, entry.id, 'text', true);
}

function imageOrAdder(entry, className) {
  const img = imageNode(entry, className);
  if (img) {
    wireImageEdit(img, entry);
    return img;
  }
  if (!editCtx) return null;
  const adder = el2('button', 'urd-collection-image-adder', ta('ui.addImages'));
  adder.type = 'button';
  wireImageEdit(adder, entry);
  return adder;
}

const el2 = (tag, className, textContent) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (textContent != null) node.textContent = textContent;
  return node;
};

/**
 * An entry's title as rich text, edited in preview with the floating bar; with a link it is an anchor for visitors.
 */
function titleNode(entry) {
  // One link (resolveLink): a page, a spot on it, or an address through the shared safe-URL gate; one that goes nowhere gives a title without a link.
  const link = entry.page || entry.href || entry.target ? resolveLink(entry, pagesNow) : null;
  const tag = link && !link.missing && !editCtx ? 'a' : 'strong';
  const node = el2(tag, 'urd-collection-title');
  setRichHtml(node, entry.title, pagesNow);
  if (tag === 'a') {
    Object.assign(node, linkAttrs(link));
    return node;
  }
  node.classList.add('urd-text');
  return editable(node, entry.id, 'title', true);
}

/** The shapes: the frame's aspect ratio. Circle is 1:1 with full rounding. */
const SHAPE_ASPECTS = { wide: '16 / 9', square: '1 / 1', portrait: '3 / 4', circle: '1 / 1' };

/**
 * Keeps each node to a number of lines, 1 to 10, ending in an ellipsis (base.css .urd-lines); any other number leaves them whole.
 * @param {Iterable<HTMLElement>} nodes
 * @param {number|undefined} lines
 */
export function clampLines(nodes, lines) {
  const count = Math.round(Number(lines));
  if (!(count >= 1 && count <= 10)) return;
  for (const node of nodes) {
    node.classList.add('urd-lines');
    node.style.setProperty('--urd-lines', String(count));
  }
}

/**
 * Draws an entry's picture with its settings (picture.js), its description, and the frame's shape and rounding; `node` is the frame or the img in it.
 */
export function applyEntryImageStyle(node, entry) {
  const img = node instanceof HTMLImageElement ? node : node.querySelector?.('img');
  if (!img) return;
  const frame = node instanceof HTMLImageElement ? (node.closest('.urd-collection-imgwrap') ?? node.parentElement) : node;
  const style = entry.imageStyle ?? {};
  img.alt = entry.imageAlt ?? '';
  if (frame) drawPicture(frame, img, style);
  node.style.borderRadius = style.shape === 'circle' ? '50%'
    : style.radius ? `var(--urd-radius-${style.radius})` : '';
  node.style.aspectRatio = SHAPE_ASPECTS[style.shape] ?? '';
  node.style.height = style.shape ? 'auto' : '';
}

function imageNode(entry, className = 'urd-collection-image') {
  if (!entry.image) return null;
  const img = document.createElement('img');
  img.src = entry.image;
  img.loading = 'lazy';
  img.draggable = false;
  const wrap = el2('span', `urd-collection-imgwrap ${className}`);
  wrap.appendChild(img);
  applyEntryImageStyle(wrap, entry);
  return wrap;
}

function badgeNode(entry) {
  const badge = dateBadge(entry.date);
  if (!badge) return null;
  const box = el2('div', 'urd-collection-badge');
  box.append(el2('strong', null, badge.day), el2('span', null, badge.month));
  return box;
}

/** Card grid: image, date, title and text per entry. */
function renderCards(host, entries) {
  const grid = el2('div', 'urd-collection-cards');
  for (const entry of entries) {
    const card = el2('article', 'urd-collection-card');
    const img = imageOrAdder(entry, 'urd-collection-image');
    if (img) card.appendChild(img);
    const badge = dateBadge(entry.date);
    if (badge) card.appendChild(el2('span', 'urd-collection-date', `${badge.day}. ${badge.month} ${badge.year}`));
    card.appendChild(titleNode(entry));
    const text = textOrPlaceholder(entry);
    if (text) card.appendChild(text);
    grid.appendChild(card);
  }
  host.appendChild(grid);
}

/** List: a row with a date badge plus title and text (the ApeironLF style). */
function renderList(host, entries) {
  const list = el2('div', 'urd-collection-list');
  for (const entry of entries) {
    const row = el2('article', 'urd-collection-row');
    const badge = badgeNode(entry);
    if (badge) row.appendChild(badge);
    const thumb = imageOrAdder(entry, 'urd-collection-thumb');
    if (thumb) row.appendChild(thumb);
    const body = el2('div', 'urd-collection-body');
    body.appendChild(titleNode(entry));
    const text = textOrPlaceholder(entry);
    if (text) body.appendChild(text);
    row.appendChild(body);
    list.appendChild(row);
  }
  host.appendChild(list);
}

/** Archive: year headings with the entries below (publications and issues). */
function renderArchive(host, entries) {
  const wrap = el2('div', 'urd-collection-archive');
  for (const group of groupByYear(entries)) {
    wrap.appendChild(el2('h3', 'urd-collection-year', group.year ?? ta('ui.noDate')));
    const list = el2('div', 'urd-collection-list');
    for (const entry of group.entries) {
      const row = el2('article', 'urd-collection-row');
      const thumb = imageOrAdder(entry, 'urd-collection-thumb');
      if (thumb) row.appendChild(thumb);
      const body = el2('div', 'urd-collection-body');
      body.appendChild(titleNode(entry));
      const text = textOrPlaceholder(entry);
      if (text) body.appendChild(text);
      row.appendChild(body);
      list.appendChild(row);
    }
    wrap.appendChild(list);
  }
  host.appendChild(wrap);
}

const VIEWS = { cards: renderCards, list: renderList, archive: renderArchive };

function emptyState(el, ctx, message) {
  if (!ctx.preview) return;
  el.appendChild(el2('div', 'urd-collection-empty', message));
}

export const collectionBlock = {
  version: 1,
  autoGrow: true,
  // Collection consumer: the urd-collections message re-renders only sections with blocks carrying this flag (the scroll position is preserved).
  usesCollections: true,
  label: 'Collection',
  labelKey: 'blocks.collection',
  defaults: () => ({ collection: null, view: 'cards', limit: 6, newestFirst: true }),
  migrations: {},
  /**
   * @param {HTMLElement} el
   * @param {{collection: string|null, view: string, limit: number, newestFirst: boolean, titleLines?: number, textLines?: number}} props
   * @param {object} ctx
   */
  render(el, props, ctx) {
    const host = el2('div', 'urd-collection');
    el.appendChild(host);

    if (!props.collection) {
      emptyState(el, ctx, ta('canvas.collectionEmpty'));
      return;
    }

    // Busy while the entries are fetched: the block holds its height (base.css) and the editor's fit waits for it.
    host.setAttribute('aria-busy', 'true');
    getCollection(props.collection).then((data) => {
      // The block may have been re-rendered or removed while the data was fetched.
      if (!host.isConnected) return;
      host.removeAttribute('aria-busy');
      if (!data) {
        emptyState(el, ctx, ta('canvas.collectionMissing', { name: props.collection }));
        return;
      }
      let entries = sortEntries(data.entries, props.newestFirst !== false);
      if (props.limit > 0) entries = entries.slice(0, props.limit);
      if (!entries.length) {
        emptyState(el, ctx, ta('canvas.collectionNoEntries', { name: data.name }));
        return;
      }
      const view = VIEWS[props.view] ?? renderCards;
      editCtx = ctx.preview && ctx.viewport !== 'mobile' ? { collection: props.collection } : null;
      pagesNow = ctx.site?.pages ?? [];
      // finally: the module globals are reset even when the view throws, so this collection's context never reaches the next block rendered.
      try {
        view(host, entries);
        clampLines(host.querySelectorAll('.urd-collection-title'), props.titleLines);
        clampLines(host.querySelectorAll('.urd-collection-text'), props.textLines);
      } finally {
        editCtx = null;
        pagesNow = [];
      }

      // The help chip (ADR-0008): the block has special functions and explains itself.
      if (ctx.preview && ctx.viewport !== 'mobile') {
        // adminLocaleReady: the first render can happen before boot has loaded the dictionary.
        Promise.all([import('../hint.js'), adminLocaleReady]).then(([{ attachHint }]) => {
          if (!el.isConnected || el.querySelector('.urd-hint-chip')) return;
          attachHint(el, {
            title: ta('hintCollection.title'),
            lines: [
              ta('hintCollection.l1'),
              ta('hintCollection.l2'),
              ta('hintCollection.l3'),
              ta('hintCollection.l4'),
            ],
          });
        });
      }
    });
  },
};
