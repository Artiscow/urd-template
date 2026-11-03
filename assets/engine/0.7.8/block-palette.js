/**
 * The block palette (0.7.10.11): the kinds a new block can be, in the groups and the order the Blocks panel and the canvas's «+ New block» menu share, each with its label key, its tooltip key and a drawn picture.
 * The groups gather the kinds by what the owner adds a block for, as the builders' insert panels do (comparison/ELEMENTS.md, Insertion).
 * Both lists hold the same entries and run them the same way: an image and a gallery with pictures open the file picker, and «All calendar designs …» opens the design picker; the panel adds the block in the view, the canvas menu in its own section at the point clicked.
 * An entry with `files` adds its block from pictures on the computer (one or many), and `action: 'designs'` opens the calendar's design picker instead of adding a block.
 * Read by the editor (bundled) and by preview-edit.js, so it stays outside the visitors' import closure.
 */

/** A drawn picture: a 24 px line drawing in the current colour (ADR-0009: drawn SVG, never characters). */
const draw = (body) => `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;

/** Every kind with its label, its tooltip where it has one, and its picture. */
export const PALETTE_KINDS = {
  'text': { labelKey: 'blocks.text', picture: draw('<path d="M5 6h14M5 10h14M5 14h10M5 18h12"/>') },
  'text-box': { labelKey: 'ui.textBox', tipKey: 'tip.blocks.textBox', picture: draw('<rect x="3" y="4" width="18" height="16" rx="2.5"/><path d="M7 9h10M7 13h10M7 16h6"/>') },
  'button': { labelKey: 'blocks.button', picture: draw('<rect x="3" y="8" width="18" height="8" rx="4"/><path d="M9 12h6"/>') },
  'quote': { labelKey: 'blocks.quote', tipKey: 'tip.blocks.quote', picture: draw('<path d="M10 7c-3 1-4 3-4 6v4h4v-4H7M18 7c-3 1-4 3-4 6v4h4v-4h-3"/>') },
  'icon': { labelKey: 'blocks.icon', tipKey: 'tip.blocks.icon', picture: draw('<path d="M12 4l2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 16.4l-4.8 2.5.9-5.4-3.9-3.8 5.4-.8z"/>') },
  'image': { labelKey: 'blocks.image', tipKey: 'tip.webpAuto', files: 'one', picture: draw('<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="10" r="1.6"/><path d="M4 18l5-5 4 4 3-3 4 4"/>') },
  'gallery': { labelKey: 'blocks.gallery', tipKey: 'tip.blocks.gallery', picture: draw('<rect x="3" y="4" width="8" height="7" rx="1.5"/><rect x="13" y="4" width="8" height="7" rx="1.5"/><rect x="3" y="13" width="8" height="7" rx="1.5"/><rect x="13" y="13" width="8" height="7" rx="1.5"/>') },
  'gallery-images': { labelKey: 'ui.galleryWithImages', tipKey: 'tip.blocks.galleryImages', files: 'many', block: 'gallery', picture: draw('<rect x="3" y="4" width="8" height="7" rx="1.5"/><rect x="13" y="4" width="8" height="7" rx="1.5"/><rect x="3" y="13" width="8" height="7" rx="1.5"/><path d="M17 20v-6M14.5 16.5L17 14l2.5 2.5"/>') },
  'video': { labelKey: 'blocks.video', tipKey: 'tip.blocks.video', picture: draw('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M10 9v6l5-3z"/>') },
  'audio': { labelKey: 'blocks.audio', tipKey: 'tip.blocks.audio', picture: draw('<path d="M4 11v2M7 9v6M10 6v12M13 9v6M16 7v10M19 11v2"/>') },
  'faq': { labelKey: 'blocks.faq', tipKey: 'tip.blocks.faq', picture: draw('<rect x="3" y="4" width="18" height="6" rx="1.5"/><rect x="3" y="14" width="18" height="6" rx="1.5"/><path d="M15 6.5l1.5 1.5 1.5-1.5M15 16.5l1.5 1.5 1.5-1.5"/>') },
  'timeline': { labelKey: 'blocks.timeline', tipKey: 'tip.blocks.timeline', picture: draw('<path d="M7 3v18"/><circle cx="7" cy="7" r="2"/><circle cx="7" cy="17" r="2"/><path d="M11 7h9M11 17h7"/>') },
  'stats': { labelKey: 'blocks.stats', tipKey: 'tip.blocks.stats', picture: draw('<path d="M5 20v-8M10 20V6M15 20v-10M20 20V4"/>') },
  'table': { labelKey: 'blocks.table', tipKey: 'tip.blocks.table', picture: draw('<rect x="3" y="5" width="18" height="14" rx="1.5"/><path d="M3 10h18M3 15h18M9 5v14M15 5v14"/>') },
  'collection': { labelKey: 'blocks.collection', tipKey: 'tip.blocks.collection', picture: draw('<rect x="3" y="4" width="8" height="7" rx="1.5"/><path d="M14 5h7M14 9h5"/><rect x="3" y="13" width="8" height="7" rx="1.5"/><path d="M14 14h7M14 18h5"/>') },
  'calendar': { labelKey: 'blocks.calendar', tipKey: 'tip.blocks.calendar', picture: draw('<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>') },
  'calendar-designs': { labelKey: 'ui.calendarDesigns', tipKey: 'tip.calendar.picker.open', action: 'designs', picture: draw('<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4M7 14h3v3H7zM14 14h3v3h-3z"/>') },
  'map': { labelKey: 'blocks.map', tipKey: 'tip.blocks.map', picture: draw('<path d="M12 21s-6-5.3-6-11a6 6 0 0 1 12 0c0 5.7-6 11-6 11z"/><circle cx="12" cy="10" r="2.2"/>') },
  'countdown': { labelKey: 'blocks.countdown', tipKey: 'tip.blocks.countdown', picture: draw('<circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2M9 2h6"/>') },
  'form': { labelKey: 'blocks.form', tipKey: 'tip.blocks.form', picture: draw('<rect x="3" y="4" width="18" height="4" rx="1"/><rect x="3" y="10" width="18" height="4" rx="1"/><rect x="3" y="17" width="8" height="4" rx="2"/>') },
  'contact': { labelKey: 'blocks.contact', tipKey: 'tip.blocks.contact', picture: draw('<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="11" r="2.2"/><path d="M5.5 17c.8-2 2-3 3.5-3s2.7 1 3.5 3M14 10h5M14 13h4"/>') },
  'share': { labelKey: 'blocks.share', tipKey: 'tip.blocks.share', picture: draw('<circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="M8.2 10.8l7.6-4.6M8.2 13.2l7.6 4.6"/>') },
  'product': { labelKey: 'blocks.product', tipKey: 'tip.blocks.product', picture: draw('<path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8.5" r="1.5"/>') },
  'cart': { labelKey: 'blocks.cart', tipKey: 'tip.blocks.cart', picture: draw('<circle cx="9" cy="20" r="1.4"/><circle cx="17" cy="20" r="1.4"/><path d="M3 4h2.5l2.2 11h10.6L20.5 8H7"/>') },
  'checkout': { labelKey: 'blocks.checkout', tipKey: 'tip.blocks.checkout', picture: draw('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18M7 15h4"/>') },
  'ribbon': { labelKey: 'blocks.ribbon', tipKey: 'tip.blocks.ribbon', picture: draw('<path d="M2 9h20v6H2z"/><path d="M5 12h4M15 12h4"/><circle cx="12" cy="12" r=".7"/>') },
  'shape-line': { labelKey: 'shape.line', picture: draw('<path d="M4 20L20 4"/>') },
  'shape-arrow': { labelKey: 'shape.arrow', picture: draw('<path d="M4 20L20 4M11 4h9v9"/>') },
  'shape-circle': { labelKey: 'shape.circle', picture: draw('<circle cx="12" cy="12" r="8"/>') },
  'shape-rect': { labelKey: 'shape.rect', picture: draw('<rect x="4" y="6" width="16" height="12" rx="1"/>') },
  'shape-triangle': { labelKey: 'shape.triangle', picture: draw('<path d="M12 4l9 16H3z"/>') },
};

/** The groups in their order, each with its kinds in theirs: what the owner adds a block for. A group's picture in the canvas menu's list is the picture of its `icon` kind. */
export const PALETTE_GROUPS = [
  { id: 'text', labelKey: 'blockGroup.text', icon: 'text', kinds: ['text', 'text-box', 'button', 'quote', 'icon'] },
  { id: 'media', labelKey: 'blockGroup.media', icon: 'image', kinds: ['image', 'gallery', 'gallery-images', 'video', 'audio'] },
  { id: 'facts', labelKey: 'blockGroup.facts', icon: 'stats', kinds: ['faq', 'timeline', 'stats', 'table', 'collection'] },
  { id: 'events', labelKey: 'blockGroup.events', icon: 'calendar', kinds: ['calendar', 'calendar-designs', 'map', 'countdown'] },
  { id: 'contact', labelKey: 'blockGroup.contact', icon: 'form', kinds: ['form', 'contact', 'share'] },
  { id: 'shop', labelKey: 'blockGroup.shop', icon: 'cart', kinds: ['product', 'cart', 'checkout'] },
  { id: 'decor', labelKey: 'blockGroup.decor', icon: 'shape-circle', kinds: ['ribbon', 'shape-line', 'shape-arrow', 'shape-circle', 'shape-rect', 'shape-triangle'] },
];

/**
 * Whether the shop's blocks (product cards, basket, checkout) are offered in the
 * block lists: the site's own choice (site.commerce.shop) when it is set, else
 * on while the site has a product catalogue, so a site without a shop keeps a
 * shorter palette and a site that sells sees its blocks without a setting.
 * @param {{commerce?: {shop?: boolean}}|undefined} siteSettings The `site` part of site.json
 * @param {boolean} hasProducts Whether a collection of kind products exists
 * @returns {boolean}
 */
export function shopOn(siteSettings, hasProducts) {
  const own = siteSettings?.commerce?.shop;
  return typeof own === 'boolean' ? own : Boolean(hasProducts);
}

/**
 * The palette's groups as a block list shows them: every group, the shop's only while the shop is on.
 * @param {boolean} shop
 * @returns {typeof PALETTE_GROUPS}
 */
export function paletteGroupsFor(shop) {
  return shop ? PALETTE_GROUPS : PALETTE_GROUPS.filter((g) => g.id !== 'shop');
}

/** The pictures of the two groups the canvas menu adds after the palette's own: the plugins' blocks and the owner's saved block groups. */
export const EXTRA_GROUP_PICTURES = {
  plugins: draw('<path d="M9 3v5M15 3v5"/><path d="M6 8h12v3a6 6 0 0 1-12 0z"/><path d="M12 17v4"/>'),
  templates: draw('<rect x="3" y="3" width="8" height="8" rx="1.5"/><rect x="13" y="3" width="8" height="8" rx="1.5"/><rect x="3" y="13" width="8" height="8" rx="1.5"/><path d="M17 14v6M14 17h6"/>'),
};

/**
 * The kinds added last, newest first, as the slim canvas menu lists them: the kinds of `list` the palette holds, each once, at most `max`.
 * @param {unknown} list The list as stored, which may be anything
 * @param {number} [max]
 * @returns {string[]}
 */
export function recentKinds(list, max = 3) {
  if (!Array.isArray(list)) return [];
  return list.filter((kind, i) => typeof kind === 'string' && Object.hasOwn(PALETTE_KINDS, kind) && list.indexOf(kind) === i).slice(0, max);
}

/** The recent list after `kind` was added: the kind first, then the others. */
export function rememberKind(list, kind, max = 3) {
  return recentKinds([kind, ...(Array.isArray(list) ? list : [])], max);
}

/** A kind's picture, or an empty string for a kind the palette does not hold. */
export function palettePicture(kind) {
  return PALETTE_KINDS[kind]?.picture ?? '';
}
