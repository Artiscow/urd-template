/**
 * A block's style as something to copy and paste (0.7.20.8, the right-click
 * menu's «Copy style» and «Paste style»): the look without the content. Pure
 * and node-tested; the clipboard itself lives in preview-edit.js.
 */

/** The props that are a block's content (its words, pictures, addresses and sources), kept out of a copied style, per type. */
export const CONTENT_KEYS = {
  text: ['html', 'text'],
  button: ['label', 'href', 'page', 'target', 'newTab', 'rel'],
  image: ['src', 'alt', 'href', 'page', 'target', 'newTab', 'rel', 'lightbox', 'caption'],
  video: ['url', 'src', 'poster', 'file', 'title'],
  icon: ['glyph', 'icon', 'image', 'href', 'page', 'label'],
  gallery: ['images'],
  ribbon: ['items', 'sepText'],
  table: ['rows'],
  quote: ['text', 'attribution', 'role', 'image'],
  stats: ['value', 'prefix', 'suffix', 'label'],
  faq: ['items'],
  timeline: ['items'],
  form: ['mode', 'recipient', 'subject', 'endpoint', 'fields', 'submitLabel', 'successText'],
  collection: ['collection'],
  product: ['collection'],
  cart: ['href', 'page'],
  checkout: ['recipient', 'endpoint', 'payments'],
  share: ['links', 'hidden'],
  countdown: ['target', 'doneText'],
  audio: ['src', 'title'],
  map: ['location', 'lat', 'lon'],
  calendar: ['sources', 'texts', 'notice', 'emptyText'],
};

/** The block-level fields that are look rather than place or content, and travel with a style to any block type. */
const SHARED_FIELDS = ['animation', 'hover', 'size', 'sizeMin', 'sizeMax', 'height', 'fit', 'fitMin'];

/**
 * The style of a block: its type, its props without the content, and the
 * shared fields.
 * @param {object} block
 * @returns {{type: string, props: object, shared: object}}
 */
export function styleOf(block) {
  const content = new Set(CONTENT_KEYS[block.type] ?? []);
  const props = {};
  for (const [k, v] of Object.entries(block.props ?? {})) if (!content.has(k)) props[k] = structuredClone(v);
  const shared = {};
  for (const k of SHARED_FIELDS) if (block[k] !== undefined) shared[k] = structuredClone(block[k]);
  return { type: block.type, props, shared };
}

/**
 * The fields a paste writes onto a block: the whole look when the types
 * match (the block's content stays), only the shared fields otherwise.
 * @param {object} block The target as it stands
 * @param {{type: string, props: object, shared: object}} style
 * @returns {{props?: object, shared: object}}
 */
export function pasteStyle(block, style) {
  const shared = {};
  for (const k of SHARED_FIELDS) shared[k] = style.shared[k] === undefined ? null : structuredClone(style.shared[k]);
  if (block.type !== style.type) return { shared };
  const content = new Set(CONTENT_KEYS[block.type] ?? []);
  const props = {};
  for (const [k, v] of Object.entries(block.props ?? {})) if (content.has(k)) props[k] = v;
  for (const [k, v] of Object.entries(style.props)) props[k] = structuredClone(v);
  return { props, shared };
}
