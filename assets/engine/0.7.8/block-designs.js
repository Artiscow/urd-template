/**
 * The designs the blocks offer beside the calendar's (calendar-designs.js): the pure catalogue behind the editor's design picker and the pictures scripts/design-pictures.mjs draws of each.
 * A block's entry names the prop that holds its design, the designs in the order the picker shows them (in families where a block has many), how a stored value reads as a design, the frame a design is drawn in, and the sample content a picture is drawn with.
 * The labels are the menus' own option keys (`labelPrefix` + id); each design's description is `design.<type>.<id>` and a family's name `design.family.<family>` in the admin dictionaries.
 * The module is bundled by the editor and imported by the pictures script; the blocks never load it, so it stays outside the visitor closure, and it never calls ta(): the samples take the translating function as an argument.
 * tests/block-designs.test.mjs holds the entries, the dictionary keys and the pictures against each other.
 */
import { CONTACT_DESIGNS, contactDesign } from './contact-model.js';
import { GALLERY_VIEWS, galleryView } from './gallery-model.js';

/** A drawn sample picture: a landscape in one hue, at a ratio of its own, as an inline SVG the preview may load from itself. */
function samplePicture(hue, w, h) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}"><rect width="${w}" height="${h}" fill="hsl(${hue} 45% 82%)"/><circle cx="${Math.round(w * 0.75)}" cy="${Math.round(h * 0.3)}" r="${Math.round(Math.min(w, h) * 0.12)}" fill="hsl(${(hue + 40) % 360} 80% 75%)"/><path d="M0 ${Math.round(h * 0.75)} L${Math.round(w * 0.25)} ${Math.round(h * 0.45)} L${Math.round(w * 0.45)} ${Math.round(h * 0.65)} L${Math.round(w * 0.7)} ${Math.round(h * 0.4)} L${w} ${Math.round(h * 0.7)} L${w} ${h} L0 ${h}Z" fill="hsl(${hue} 40% 48%)"/></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

/** The sample association the contact designs are drawn with: the proper names stay as they are, the roles come from the dictionary. */
function sampleContact(text) {
  return {
    country: 'NO', legalName: 'Apeiron Linjeforening', ids: { org: '974760673' }, registers: { org: 'Frivillighetsregisteret' }, vat: { registered: true },
    address: { street: 'Høgskoleringen 5', postalCode: '7034', city: 'Trondheim' }, phone: '+47 400 00 000', email: 'post@apeiron.no',
    geo: { lat: 63.4155, lon: 10.4042 },
    points: [
      { role: text('seed.design.board'), email: 'styret@apeiron.no', phone: '+47 400 00 001' },
      { role: text('seed.design.treasurer'), email: 'kasserer@apeiron.no', note: text('seed.design.invoices') },
      { role: text('seed.design.press'), email: 'presse@apeiron.no', phone: '+47 400 00 002' },
    ],
  };
}

const hasContact = (site) => {
  const c = site?.site?.contact;
  return Boolean(c && (c.legalName || c.phone || c.email || c.address?.street || c.address?.city || c.points?.length));
};

/**
 * Every block with designs, by its type.
 * `read` gives the design a stored props object shows (a missing or unknown value is the block's default); `frame` is the width in percent and the height in px a design is drawn at; `sample(text)` gives the props (and for the contact block the site's contact details) a picture is drawn with, merged over the block's defaults; `empty` says when a block has nothing of its own to show, so the picker's preview draws it with the sample instead.
 */
export const BLOCK_DESIGNS = {
  contact: {
    prop: 'design',
    ids: CONTACT_DESIGNS.map((d) => d.id),
    labelPrefix: 'opt.contact.',
    read: (props) => contactDesign(props?.design).id,
    families: [
      { family: 'lists', ids: ['lines', 'icons', 'facts'] },
      { family: 'boxes', ids: ['card', 'tiles', 'roles'] },
      { family: 'actions', ids: ['buttons', 'map', 'qr'] },
      { family: 'bold', ids: ['strip', 'poster'] },
    ],
    frame: { w: 70, h: 200 },
    sample: (text) => ({ props: { parts: ['name', 'address', 'phone', 'email', 'legal'] }, contact: sampleContact(text) }),
    empty: (props, site) => !hasContact(site),
  },
  gallery: {
    prop: 'view',
    ids: GALLERY_VIEWS,
    labelPrefix: 'opt.galleryView.',
    read: (props) => galleryView(props?.view),
    frame: { w: 90, h: 420 },
    sample: () => ({ props: { images: [[150, 4, 3], [200, 3, 4], [30, 4, 3], [260, 1, 1], [100, 16, 9], [340, 3, 2]].map(([hue, w, h]) => ({ src: samplePicture(hue, w * 100, h * 100), alt: '' })) } }),
    empty: (props) => !props?.images?.length,
  },
  stats: {
    prop: 'variant',
    ids: ['plain', 'cards', 'band'],
    labelPrefix: 'opt.statVariant.',
    read: (props) => (['plain', 'cards', 'band'].includes(props?.variant) ? props.variant : 'plain'),
    frame: { w: 30, h: 180 },
  },
  collection: {
    prop: 'view',
    ids: ['cards', 'list', 'archive'],
    labelPrefix: 'opt.collectionView.',
    read: (props) => (['cards', 'list', 'archive'].includes(props?.view) ? props.view : 'cards'),
    frame: { w: 90, h: 400 },
    sample: () => ({ props: { collection: 'nyheter', limit: 3 } }),
    empty: (props) => !props?.collection,
  },
  countdown: {
    prop: 'variant',
    ids: ['boxes', 'plain'],
    labelPrefix: 'opt.countdown.',
    read: (props) => (props?.variant === 'plain' ? 'plain' : 'boxes'),
    frame: { w: 60, h: 160 },
  },
  ribbon: {
    prop: 'variant',
    ids: ['band', 'plain'],
    labelPrefix: 'opt.ribbonVariant.',
    read: (props) => (props?.variant === 'plain' ? 'plain' : 'band'),
    frame: { w: 94, h: 100 },
  },
  faq: {
    prop: 'variant',
    ids: ['cards', 'list'],
    labelPrefix: 'opt.faqVariant.',
    read: (props) => (props?.variant === 'list' ? 'list' : 'cards'),
    frame: { w: 70, h: 300 },
  },
  timeline: {
    prop: 'variant',
    ids: ['left', 'alternating'],
    labelPrefix: 'opt.timeline.',
    read: (props) => (props?.variant === 'alternating' ? 'alternating' : 'left'),
    frame: { w: 70, h: 360 },
  },
  quote: {
    prop: 'variant',
    ids: ['large', 'short'],
    labelPrefix: 'opt.quote.',
    read: (props) => (props?.variant === 'short' ? 'short' : 'large'),
    frame: { w: 70, h: 280 },
  },
  share: {
    prop: 'variant',
    ids: ['icons', 'labels'],
    labelPrefix: 'opt.share.',
    read: (props) => (props?.variant === 'labels' ? 'labels' : 'icons'),
    frame: { w: 50, h: 60 },
    sample: () => ({ props: { useSite: false, links: [{ icon: 'facebook', url: 'https://www.facebook.com/' }, { icon: 'instagram', url: 'https://www.instagram.com/' }, { icon: 'mail', url: 'mailto:post@apeiron.no' }] } }),
    empty: (props, site) => (props?.useSite !== false ? !site?.site?.links?.length : !props?.links?.length),
  },
  cart: {
    prop: 'variant',
    ids: ['button', 'icon'],
    labelPrefix: 'opt.cart.',
    read: (props) => (props?.variant === 'icon' ? 'icon' : 'button'),
    frame: { w: 20, h: 50 },
  },
  button: {
    prop: 'style',
    ids: ['primary', 'secondary'],
    labelPrefix: 'opt.btn.',
    read: (props) => (props?.style === 'secondary' ? 'secondary' : 'primary'),
    frame: { w: 20, h: 50 },
  },
  shape: {
    prop: 'kind',
    ids: ['line', 'arrow', 'circle', 'rect', 'triangle'],
    labelPrefix: 'shape.',
    read: (props) => (['line', 'arrow', 'circle', 'rect', 'triangle'].includes(props?.kind) ? props.kind : 'line'),
    frame: { w: 20, h: 200 },
  },
};

/** The block types with designs, in the catalogue's order. */
export const DESIGN_BLOCK_TYPES = Object.keys(BLOCK_DESIGNS);

/** The design a block's props show, or null for a type without designs. */
export function blockDesignOf(type, props) {
  return BLOCK_DESIGNS[type]?.read(props ?? {}) ?? null;
}

/** The label key of a design: the menu's own option key. */
export function designLabelKey(type, id) {
  return `${BLOCK_DESIGNS[type].labelPrefix}${id}`;
}

/** The description key of a design. */
export function designAboutKey(type, id) {
  return `design.${type}.${id}`;
}

/** The picture of a design, under template/admin/designs/ beside the calendar's. */
export function designPicture(type, id) {
  return `block-${type}-${id}.webp`;
}

/**
 * The designs in the families the picker shows them in: a block's own families, or one family named for the block.
 * @returns {Array<{family: string, labelKey: string, ids: string[]}>}
 */
export function blockDesignFamilies(type) {
  const entry = BLOCK_DESIGNS[type];
  if (!entry) return [];
  if (!entry.families) return [{ family: type, labelKey: `blocks.${type}`, ids: entry.ids }];
  return entry.families.map((f) => ({ family: f.family, labelKey: `design.family.${f.family}`, ids: f.ids }));
}

/**
 * The sample a design is drawn with: props merged over the block's own, and for the contact block the site's contact details.
 * @param {string} type
 * @param {(key: string) => string} text the translating function the samples' words come from
 * @returns {{props: object, contact?: object}}
 */
export function blockDesignSample(type, text) {
  return BLOCK_DESIGNS[type]?.sample?.(text) ?? { props: {} };
}

/** Whether a block has nothing of its own a design could show (no pictures, no collection, no contact details), so a preview draws it with the sample. */
export function blockDesignEmpty(type, props, site) {
  return Boolean(BLOCK_DESIGNS[type]?.empty?.(props, site));
}

/** The narrowest preview page in CSS px: the site's phone rules never apply to it. */
const PREVIEW_MIN = 640;

/**
 * The preview page for a block: as wide as the block's own width on a 1440 px screen needs with the site's gutters around it, so the block keeps its real size and fills the pane, and never narrower than PREVIEW_MIN.
 * The canvas is the viewport less two gutters (a share of the viewport) up to the content width (render.js, applySiteLayout), or up to the section's own width where it has one (`size.maxWidth`); the block is centred in the preview's canvas at its real width.
 * @param {object|null} site
 * @param {number} frameW The block's frame width in percent of its section's canvas
 * @param {string} [sectionWidth] The section's `size.maxWidth`
 * @returns {{width: number, x: number, w: number}} the page's width in px and the block's frame in percent of the canvas
 */
export function designPreviewFrame(site, frameW, sectionWidth) {
  const gutter = Number(site?.layout?.gutter ?? 6) || 0;
  const room = Math.max(0.5, 1 - (2 * gutter) / 100);
  const contentWidth = site?.layout?.contentWidth ?? 1440;
  const canvasAt = (viewport, width = contentWidth) => (width === 'full' ? viewport * room : Math.min(width, viewport * room));
  const own = sectionWidth === 'full' ? 'full' : /^\d+(\.\d+)?px$/.test(sectionWidth ?? '') ? parseFloat(sectionWidth) : contentWidth;
  const real = (frameW / 100) * canvasAt(1440, own);
  const width = Math.max(PREVIEW_MIN, Math.ceil(real / room));
  const w = Math.min(100, (real / canvasAt(width)) * 100);
  return { width, x: (100 - w) / 2, w };
}
