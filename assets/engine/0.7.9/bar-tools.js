/**
 * The bar of tools on a selected block (Urd settings «Toolbar»: Tools with small panels): every group of the block's element menu is a tool, which opens that group alone in a small panel beside the block, so every setting is one press from the bar.
 * Each block type lists its tools in the menu's order, Content then Style: a group (`fold`, the id its fold carries in menu/families/*.svelte, with that fold's title key), or the rows of an area that stand in no group (`loose`, named by the area or by what they hold).
 * Every block adds its design first in Style where it has designs (the design picker, drawn by preview-edit.js), its motion last in Style, and its Placement, the area drawn alone; a block type not listed (a plugin's, the field contract's) has its Content and Style as tools.
 * Each tool carries a drawing's name (BAR_ICONS); one without a drawing of its own takes its area's. The bar draws them (preview-edit.js), and the small window a tool opens names it with the same drawing (the editor's menu/FloatingMenu.svelte).
 * A group the menu draws only in some states carries the same condition (`when`), so the bar never offers a tool that opens nothing.
 * A section's bar has the groups of its own menu as tools (SECTION_TOOLS).
 * The bar's choices in Urd settings, as the engine reads them, stand here too (BAR_CHOICES).
 * Pure, node-tested (tests/bar-tools.test.mjs holds every fold to its family and to the section's menu).
 */

import { calDesign, calOptionDefs, calOptionShown, calOptions } from './calendar-designs.js';

/**
 * The bar's choices in Urd settings, each kept in the shared localStorage under its key, with its options and the default first: the form, the look, the gear, the phone button, the size, and what the design button opens.
 * The editor writes them as parts of the admin designs (editor/src/lib/admin-designs.js), and tests/bar-tools.test.mjs holds the two lists equal.
 */
export const BAR_CHOICES = {
  form: { key: 'urd-block-toolbar', options: ['groups', 'full', 'panels', 'short'] },
  look: { key: 'urd-toolbar-look', options: ['glass-accent', 'squares', 'strip', 'areas', 'captions', 'glass', 'large', 'capsule', 'white', 'glass-capsule', 'capsule-areas', 'large-capsule', 'soft'] },
  gear: { key: 'urd-toolbar-gear', options: ['on', 'off'] },
  phone: { key: 'urd-toolbar-phone', options: ['on', 'off'] },
  size: { key: 'urd-toolbar-size', options: ['regular', 'small', 'medium', 'large'] },
  design: { key: 'urd-toolbar-design', options: ['small', 'full'] },
};

/** The forms whose tools belong to the menu's areas, which the area looks set apart. */
export const TOOL_FORMS = ['panels', 'groups'];

/** The looks that set the tools apart by area, each with the plain look a form without tools takes in its place. */
export const AREA_LOOKS = { areas: 'squares', 'capsule-areas': 'capsule' };

/** The drawings of the bar's tools, each at the bar's size, by the names the tools carry. */
const svg = (inner) => `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;
export const BAR_ICONS = {
  pencil: svg('<path d="M17 3l4 4L8 20l-5 1 1-5L17 3z"/>'),
  brush: svg('<path d="M14 4l6 6-8 8-6-6z"/><path d="M6 12l-3 7 7-3"/>'),
  link: svg('<path d="M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1-1"/>'),
  picture: svg('<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="1.8"/><path d="M21 16l-5-5-9 9"/>'),
  type: svg('<path d="M4 19l5-14 5 14M6 14h6"/><path d="M15 19v-6.5a2.5 2.5 0 015 0V19M15 15.5h5"/>'),
  palette: svg('<path d="M12 3a9 9 0 100 18c1.2 0 2-.9 2-2 0-1.3-1-1.6-1-2.8 0-1 .8-1.7 1.8-1.7H17a4 4 0 004-4c0-4.1-4-7.5-9-7.5z"/><circle cx="7.5" cy="11" r="1"/><circle cx="10" cy="7" r="1"/><circle cx="14.5" cy="7" r="1"/>'),
  list: svg('<path d="M9 6h12M9 12h12M9 18h12"/><circle cx="4.5" cy="6" r="1"/><circle cx="4.5" cy="12" r="1"/><circle cx="4.5" cy="18" r="1"/>'),
  calendar: svg('<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>'),
  filter: svg('<path d="M3 5h18l-7 8v6l-4 2v-8z"/>'),
  box: svg('<rect x="4" y="5" width="16" height="14" rx="3"/><path d="M8 10h8M8 14h5"/>'),
  mail: svg('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>'),
  cart: svg('<circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2 3h3l2.5 12h11.5l2-8H6"/>'),
  card: svg('<rect x="2.5" y="5" width="19" height="14" rx="2"/><path d="M2.5 10h19M6 15h4"/>'),
  person: svg('<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0116 0"/>'),
  shape: svg('<circle cx="8" cy="8" r="5"/><rect x="11" y="11" width="10" height="10" rx="1.5"/>'),
  number: svg('<path d="M9 3L7 21M17 3l-2 18M4 8h17M3 16h17"/>'),
  play: svg('<path d="M7 4l13 8-13 8z"/>'),
  quote: svg('<path d="M10 7H6a2 2 0 00-2 2v3h5v5H4M20 7h-4a2 2 0 00-2 2v3h5v5h-5"/>'),
  place: svg('<path d="M12 21s-7-6.5-7-12a7 7 0 0114 0c0 5.5-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/>'),
  clock: svg('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
  file: svg('<path d="M6 3h8l5 5v13H6z"/><path d="M14 3v5h5"/>'),
  motion: svg('<path d="M3 7h7M3 12h11M3 17h7"/><path d="M16 8l4 4-4 4"/>'),
  arrange: svg('<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>'),
  empty: svg('<path d="M3 13l3-8h12l3 8v6H3z"/><path d="M3 13h5l1.5 2.5h5L16 13h5"/>'),
  notice: svg('<path d="M3 10v4h3l8 5V5l-8 5z"/><path d="M18 9a4 4 0 010 6"/>'),
  options: svg('<path d="M4 6h9M17 6h3M4 12h3M11 12h9M4 18h11M19 18h1"/><circle cx="15" cy="6" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="17" cy="18" r="2"/>'),
  receipt: svg('<path d="M6 3h12v18l-3-2-3 2-3-2-3 2z"/><path d="M9 8h6M9 12h6M9 16h3"/>'),
  columns: svg('<rect x="3" y="4" width="4.5" height="16" rx="1"/><rect x="9.75" y="4" width="4.5" height="16" rx="1"/><rect x="16.5" y="4" width="4.5" height="16" rx="1"/>'),
  stripes: svg('<rect x="3" y="6" width="18" height="12" rx="1.5"/><path d="M7 18l5-12M12.5 18l5-12"/>'),
  roll: svg('<path d="M4 12a8 8 0 0113.7-5.7L20 8.5"/><path d="M20 4v4.5h-4.5"/><path d="M20 12a8 8 0 01-13.7 5.7L4 15.5"/><path d="M4 20v-4.5h4.5"/>'),
  table: svg('<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M3 15h18M10 4v16"/>'),
  film: svg('<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7.5 4v16M16.5 4v16M3 9h4.5M3 15h4.5M16.5 9H21M16.5 15H21"/>'),
  design: svg('<rect x="3" y="3" width="8" height="8" rx="1.5"/><rect x="13" y="3" width="8" height="8" rx="1.5"/><rect x="3" y="13" width="8" height="8" rx="1.5"/><rect x="13" y="13" width="8" height="8" rx="4"/>'),
};

const fold = (id, labelKey, area, icon, when = null) => ({ only: `fold:${id}`, labelKey, area, icon, ...(when ? { when } : {}) });
const loose = (area, labelKey, icon, when = null) => ({ only: `loose:${area}`, labelKey, area, icon, ...(when ? { when } : {}) });
const CONTENT = 'props.tabContent';
const STYLE = 'props.tabStyle';

/** The groups and loose rows of each block type's Content and Style. */
export const BAR_GROUPS = {
  audio: [fold('audio-file', 'blocks.audio', 'content', 'file')],
  button: [fold('btn-link', 'group.textLink', 'content', 'link'), fold('btn-colours', 'group.btnColours', 'style', 'palette')],
  calendar: [
    fold('cal-sources', 'calendar.sources', 'content', 'calendar'),
    fold('cal-view', 'calendar.group.view', 'content', 'list'),
    fold('cal-buttons', 'calendar.group.buttons', 'content', 'box'),
    fold('cal-empty', 'calendar.group.empty', 'content', 'empty'),
    // The announcement belongs to the designs that draw one, the design's settings to those with an option shown now, as menu/families/Calendar.svelte draws them.
    fold('cal-notice', 'calendar.group.notice', 'content', 'notice', (b) => Boolean(calDesign(b.props?.design).notice)),
    loose('style', STYLE, 'brush'),
    fold('cal-opts', 'calendar.section.options', 'style', 'options', (b) => calOptionDefs(b.props?.design).some((def) => calOptionShown(def, calOptions(b.props)))),
    fold('cal-colors', 'calendar.colors', 'style', 'palette'),
    fold('cal-fields', 'calendar.fieldStyle', 'style', 'type'),
  ],
  cart: [fold('cart-checkout', 'group.checkout', 'content', 'cart')],
  checkout: [
    fold('checkout-order', 'group.order', 'content', 'cart'),
    fold('checkout-payment', 'group.payment', 'content', 'card'),
    fold('checkout-seller', 'lbl.checkoutSeller', 'content', 'person'),
  ],
  collection: [fold('collection-source', 'group.source', 'content', 'list')],
  contact: [fold('contact-parts', 'group.siteContact', 'content', 'person'), fold('contact-look', 'group.appearance', 'style', 'palette')],
  countdown: [fold('countdown-target', 'group.target', 'content', 'clock'), fold('countdown-look', 'group.appearance', 'style', 'palette')],
  // The card style belongs to the cards; the list's rows are bare (menu/families/Faq.svelte).
  faq: [fold('faq-questions', 'lbl.questions', 'content', 'list'), fold('faq-card', 'lbl.cardStyle', 'style', 'palette', (b) => b.props?.variant !== 'list')],
  form: [
    fold('form-sending', 'group.sending', 'content', 'mail'),
    fold('form-fields', 'form.fields', 'content', 'list'),
    fold('form-receipt', 'group.buttonReceipt', 'content', 'receipt'),
  ],
  gallery: [fold('gallery-images', 'group.images', 'content', 'picture'), fold('gallery-look', 'group.appearance', 'style', 'palette')],
  icon: [fold('icon-icon', 'blocks.icon', 'content', 'shape'), fold('icon-look', 'group.appearance', 'style', 'palette')],
  image: [fold('img-image', 'blocks.image', 'content', 'picture'), fold('img-link', 'group.linkClick', 'content', 'link'), fold('img-look', 'group.appearance', 'style', 'palette')],
  map: [loose('content', CONTENT, 'pencil'), fold('map-place', 'group.place', 'content', 'place')],
  privacy: [loose('content', CONTENT, 'pencil'), fold('privacy-look', 'group.appearance', 'style', 'palette')],
  product: [fold('product-catalog', 'group.catalog', 'content', 'list'), fold('product-shop', 'group.siteShop', 'content', 'cart'), fold('product-grid', 'group.grid', 'style', 'columns')],
  quote: [fold('quote-words', 'group.quote', 'content', 'quote'), fold('quote-look', 'group.appearance', 'style', 'palette')],
  ribbon: [
    fold('ribbon-words', 'lbl.ribbonItems', 'content', 'list'),
    fold('ribbon-motion', 'lbl.ribbonMotion', 'style', 'roll'),
    fold('ribbon-stripes', 'lbl.ribbonStripes', 'style', 'stripes'),
    fold('ribbon-shape', 'lbl.ribbonShape', 'style', 'shape'),
    fold('ribbon-text', 'lbl.ribbonText', 'style', 'type'),
  ],
  // A line carries words of its own, the one row of a shape's Content.
  shape: [loose('content', CONTENT, 'pencil', (b) => b.props?.kind === 'line'), fold('shape-look', 'group.appearance', 'style', 'palette')],
  share: [fold('share-services', 'group.siteLinks', 'content', 'link'), fold('share-look', 'group.appearance', 'style', 'palette')],
  stats: [fold('stat-number', 'group.number', 'content', 'number'), fold('stat-look', 'group.appearance', 'style', 'palette')],
  table: [fold('table-shape', 'group.rowsColumns', 'content', 'table'), fold('table-lines', 'lbl.tableLines', 'style', 'list')],
  terms: [fold('terms-design', 'group.appearance', 'style', 'palette'), fold('terms-type', 'group.typography', 'style', 'type')],
  text: [loose('style', 'group.typography', 'type'), fold('text-box', 'group.textBox', 'style', 'box')],
  timeline: [fold('tl-events', 'lbl.timelineItems', 'content', 'list'), fold('tl-look', 'group.appearance', 'style', 'palette')],
  video: [loose('content', CONTENT, 'pencil'), fold('video-what', 'blocks.video', 'content', 'film'), fold('video-play', 'group.playback', 'content', 'play'), loose('style', STYLE, 'brush')],
};

/** The groups a block type not listed has: its Content and Style, each drawn whole. */
const AREAS = [
  { only: 'area:content', labelKey: CONTENT, area: 'content', icon: 'pencil' },
  { only: 'area:style', labelKey: STYLE, area: 'style', icon: 'brush' },
];

/**
 * A block's tools on the bar, in order: its groups drawn now, its design first in Style where it has designs, its motion, and its Placement.
 * @param {string} type The block's type
 * @param {{ designs?: boolean, block?: object }} [opts] Whether the block has designs, which opens the design picker, and the block, whose state decides the groups drawn in some states only
 * @returns {Array<{ only: string|null, labelKey: string, area: string, icon: string, design?: boolean }>}
 */
export function barTools(type, { designs = false, block = null } = {}) {
  const groups = (BAR_GROUPS[type] ?? AREAS).filter((g) => !g.when || g.when(block ?? { props: {} }));
  const content = groups.filter((g) => g.area === 'content');
  const style = groups.filter((g) => g.area === 'style');
  return [
    ...content,
    ...(designs ? [{ only: null, labelKey: 'lbl.design', area: 'style', icon: 'design', design: true }] : []),
    ...style,
    { only: 'fold:motion', labelKey: 'group.motion', area: 'style', icon: 'motion' },
    { only: 'area:placement', labelKey: 'props.tabPlacement', area: 'placement', icon: 'arrange' },
  ];
}

/** A section's tools on the bar, in its menu's order: its theme, background, edges and motion (Style), then its size and its name for links (Placement), each a group of section/SectionMenu.svelte. */
export const SECTION_TOOLS = [
  fold('sec-theme', 'lbl.sectionTheme', 'style', 'palette'),
  fold('sec-bg', 'lbl.background', 'style', 'picture'),
  fold('sec-edges', 'lbl.sectionDividers', 'style', 'shape'),
  fold('sec-motion', 'group.motion', 'style', 'motion'),
  fold('sec-size', 'group.sectionSize', 'placement', 'arrange'),
  fold('sec-link', 'group.linkTarget', 'placement', 'link'),
];

/** Whether a tool's `only` is one the editor opens: a group, an area's loose rows, an area drawn whole, or the block's design (`look:design`). */
export const isBarOnly = (only) => typeof only === 'string' && /^(fold:[a-z0-9-]+|loose:(content|style)|area:(content|style|placement)|look:design)$/.test(only);
