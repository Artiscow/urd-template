/**
 * Named spots on a page: the sections and blocks an owner names so a link can point at them (`/kaker#priser`).
 * The naming rule's reasons, the ids a page already uses, suggestions from the spot's own words, the clean-up when content is copied in, and the links that point at a spot.
 * Pure: the editor, the schema check and the tests import it, and visitors never load it.
 * The rule itself is isAnchorName in nav-model.js, which the renderer reads.
 */

import { isAnchorName } from './nav-model.js';
import { slugText } from './imageTools.js';

/** The longest name. */
export const ANCHOR_MAX = 40;

/** The prefixes of the engine's own ids, which a name can never start with. */
const RESERVED_RE = /^(?:urd|sec|blk)-/;

/**
 * Why a name cannot be used, or null when it can: 'form' (only lower-case letters, digits and inner hyphens, at most 40), 'reserved' (one of the engine's own prefixes) or 'taken' (another spot on the page has it).
 * @param {unknown} name
 * @param {Set<string>} [taken] The ids in use on the page (takenAnchors)
 * @returns {'form'|'reserved'|'taken'|null}
 */
export function anchorError(name, taken = new Set()) {
  if (typeof name === 'string' && RESERVED_RE.test(name)) return 'reserved';
  if (!isAnchorName(name)) return 'form';
  return taken.has(name) ? 'taken' : null;
}

/** A form's fields, each of which gives its input an id on the page (blocks/form.js). */
function formFields(block) {
  return block?.type === 'form' && Array.isArray(block.props?.fields) ? block.props.fields : [];
}

/**
 * The ids a page already uses for its spots: its sections' and blocks' ids and names, and the ids of its form fields' inputs.
 * The spot being named (`own`, a section or block id) is left out, so its own name stays free for it.
 * @param {{sections?: Array<object>}} page
 * @param {string|null} [own]
 * @returns {Set<string>}
 */
export function takenAnchors(page, own = null) {
  const taken = new Set();
  const add = (id) => {
    if (typeof id === 'string' && id) taken.add(id);
  };
  for (const section of page?.sections ?? []) {
    if (section.id !== own) {
      add(section.id);
      add(section.anchor);
    }
    for (const block of section.blocks ?? []) {
      if (block.id !== own) {
        add(block.id);
        add(block.anchor);
      }
      for (const field of formFields(block)) add(`${field.id}-in`);
    }
  }
  return taken;
}

/**
 * The names on a page that another spot already holds: a name given twice, or a name equal to a section's or block's id or a form input's id.
 * Empty when every name is the only spot of its kind.
 * @param {{sections?: Array<object>}} page
 * @returns {string[]}
 */
export function duplicateAnchors(page) {
  const seen = new Map();
  const count = (id) => {
    if (typeof id === 'string' && id) seen.set(id, (seen.get(id) ?? 0) + 1);
  };
  const names = [];
  for (const section of page?.sections ?? []) {
    count(section.id);
    count(section.anchor);
    if (typeof section.anchor === 'string') names.push(section.anchor);
    for (const block of section.blocks ?? []) {
      count(block.id);
      count(block.anchor);
      if (typeof block.anchor === 'string') names.push(block.anchor);
      for (const field of formFields(block)) count(`${field.id}-in`);
    }
  }
  return [...new Set(names.filter((name) => seen.get(name) > 1))];
}

/**
 * A free name built on `name`: the name itself, or with -2, -3 and so on while it is taken, shortened so it stays within the limit.
 * A name that is one of the reserved words alone (`urd`, `sec`, `blk`) takes its number without the hyphen (`urd2`), since `urd-2` would start with a reserved prefix.
 * @param {string} name A valid name
 * @param {Set<string>} taken
 * @returns {string}
 */
export function uniqueAnchor(name, taken) {
  if (!taken.has(name)) return name;
  for (let n = 2; ; n++) {
    const tail = `-${n}`;
    const base = name.slice(0, ANCHOR_MAX - tail.length).replace(/-+$/, '');
    const candidate = RESERVED_RE.test(`${base}${tail}`) ? `${base}${n}` : `${base}${tail}`;
    if (!taken.has(candidate)) return candidate;
  }
}

/**
 * A name made from words, free on the page: their slug, cut at the last whole word that fits, without a reserved prefix.
 * Empty when the words give no letters or digits.
 * @param {string} words
 * @param {Set<string>} [taken]
 * @returns {string}
 */
export function suggestAnchor(words, taken = new Set()) {
  let slug = slugText(words).replace(RESERVED_RE, '');
  if (slug.length > ANCHOR_MAX) {
    const cut = slug.slice(0, ANCHOR_MAX + 1).lastIndexOf('-');
    slug = slug.slice(0, cut > 0 ? cut : ANCHOR_MAX).replace(/-+$/, '');
  }
  return isAnchorName(slug) ? uniqueAnchor(slug, taken) : '';
}

const HEADING_RE = /<h[1-6]\b[^>]*>([\s\S]*?)<\/h[1-6]>/i;

/** Rich text as plain words: tags and entities become spaces. */
function plainWords(html) {
  return String(html).replace(/<[^>]*>/g, ' ').replace(/&[a-z0-9#]+;/gi, ' ').replace(/\s+/g, ' ').trim();
}

/** The props a block's own words stand in, in the order they name it best. */
const WORD_PROPS = ['title', 'heading', 'label', 'name', 'text', 'quote'];

/**
 * The words that name a block: a text block's first heading, else its first words; another block's title, label or text.
 * @param {object} block
 * @returns {string}
 */
export function blockWords(block) {
  const props = block?.props ?? {};
  if (typeof props.html === 'string') {
    const heading = props.html.match(HEADING_RE);
    return plainWords(heading ? heading[1] : props.html).split(' ').slice(0, 6).join(' ');
  }
  for (const key of WORD_PROPS) {
    if (typeof props[key] === 'string' && props[key].trim()) return plainWords(props[key]);
  }
  return '';
}

/**
 * The words that name a section: the first heading from the top of the section, else the first block with words.
 * @param {object} section
 * @returns {string}
 */
export function sectionWords(section) {
  const blocks = [...(section?.blocks ?? [])]
    .sort((a, b) => (a.frames?.desktop?.y ?? 0) - (b.frames?.desktop?.y ?? 0));
  for (const block of blocks) {
    const heading = typeof block.props?.html === 'string' ? block.props.html.match(HEADING_RE) : null;
    if (heading && plainWords(heading[1])) return plainWords(heading[1]);
  }
  for (const block of blocks) {
    const words = blockWords(block);
    if (words) return words;
  }
  return '';
}

/**
 * The spots a link can land on in a page, in page order: each section, numbered from 1, and each named block, under its section from the top.
 * Each spot carries its id (what a link stores), its name ('' when it has none) and its first words, which the link editor shows.
 * @param {{sections?: Array<object>}} page
 * @returns {Array<{id: string, kind: 'section'|'block', n: number, name: string, words: string}>} `n` is the section's number, for a block the number of its section
 */
export function pageSpots(page) {
  const spots = [];
  (page?.sections ?? []).forEach((section, index) => {
    if (typeof section?.id !== 'string' || !section.id) return;
    const n = index + 1;
    spots.push({ id: section.id, kind: 'section', n, name: isAnchorName(section.anchor) ? section.anchor : '', words: sectionWords(section) });
    const blocks = [...(section.blocks ?? [])].sort((a, b) => (a.frames?.desktop?.y ?? 0) - (b.frames?.desktop?.y ?? 0));
    for (const block of blocks) {
      if (typeof block?.id === 'string' && isAnchorName(block.anchor)) spots.push({ id: block.id, kind: 'block', n, name: block.anchor, words: blockWords(block) });
    }
  });
  return spots;
}

/**
 * Gives sections and blocks copied onto a page names that are free there: a name the page already uses gets -2, -3 and so on, two copies with the same name get different ones, and a name that breaks the rule is dropped.
 * The items are changed in place and returned.
 * @param {Array<object>} items Sections with their blocks, or blocks
 * @param {{sections?: Array<object>}} page The page they are added to, as it is without them
 * @returns {Array<object>}
 */
export function claimAnchors(items, page) {
  const taken = takenAnchors(page);
  const claim = (item) => {
    if (item.anchor === undefined) return;
    if (!isAnchorName(item.anchor)) {
      delete item.anchor;
      return;
    }
    item.anchor = uniqueAnchor(item.anchor, taken);
    taken.add(item.anchor);
  };
  for (const item of items) {
    if (typeof item.id === 'string') taken.add(item.id);
    claim(item);
    for (const block of item.blocks ?? []) {
      if (typeof block.id === 'string') taken.add(block.id);
      claim(block);
    }
  }
  return items;
}

/** The keys whose value is one address (a link kept as an address, or one typed before the link shape). */
const ADDRESS_KEYS = new Set(['href', 'url']);

/** The props whose words name the item a link stands in (a menu item, a footer link). */
const HOLDER_WORDS = ['label', 'text', 'title'];

const A_TAG_RE = /<a\b[^>]*>/gi;
const TARGET_ATTR_RE = /\sdata-urd-target="([^"]*)"/i;
const PAGE_ATTR_RE = /\sdata-urd-page="([^"]*)"/i;
const HREF_ATTR_RE = /\shref="([^"]*)"/i;

/**
 * An address within the site as the page path it names and the spot after #; the path is '' for a bare fragment, which stands for the page the link is on.
 * Null for an address without a spot or outside the site.
 * @param {string} href
 * @returns {{path: string, target: string}|null}
 */
function addressRef(href) {
  const text = String(href).trim();
  const at = text.indexOf('#');
  if (at < 0) return null;
  const path = text.slice(0, at).replace(/\?.*$/, '');
  if (path && (!path.startsWith('/') || path.startsWith('//'))) return null;
  return { path: path.length > 1 ? path.replace(/\/$/, '') : path, target: text.slice(at + 1) };
}

/** The links in rich text: by the spot they carry (`data-urd-target`, with `data-urd-page` for another page), else by their address. */
function textRefs(html) {
  const refs = [];
  for (const [tag] of html.matchAll(A_TAG_RE)) {
    const target = tag.match(TARGET_ATTR_RE)?.[1];
    if (target) {
      refs.push({ page: tag.match(PAGE_ATTR_RE)?.[1] ?? '', target });
      continue;
    }
    const ref = addressRef(tag.match(HREF_ATTR_RE)?.[1] ?? '');
    if (ref) refs.push(ref);
  }
  return refs;
}

/**
 * Calls `visit(ref, holder)` for every link to a spot in a value: a link object's `target`, an address under `href` or `url`, and the links in rich text.
 * A ref names its page (`page`, '' for none) or the path of its address (`path`); `holder` is the nearest object with words of its own.
 * @param {unknown} value
 * @param {(ref: {page?: string, path?: string, target: string}, holder: object|null) => void} visit
 * @param {object|null} [holder]
 */
function walkRefs(value, visit, holder = null) {
  if (Array.isArray(value)) {
    for (const item of value) walkRefs(item, visit, holder);
    return;
  }
  if (!value || typeof value !== 'object') return;
  const own = HOLDER_WORDS.some((key) => typeof value[key] === 'string' && value[key].trim()) ? value : holder;
  if (typeof value.target === 'string' && value.target) visit({ page: typeof value.page === 'string' ? value.page : '', target: value.target }, own);
  for (const [key, item] of Object.entries(value)) {
    if (typeof item !== 'string') walkRefs(item, visit, own);
    else if (ADDRESS_KEYS.has(key)) {
      const ref = addressRef(item);
      if (ref) visit(ref, own);
    } else if (item.includes('<a')) {
      for (const ref of textRefs(item)) visit(ref, own);
    }
  }
}

/** The words of the item a link stands in. */
function holderWords(holder) {
  const key = HOLDER_WORDS.find((k) => typeof holder?.[k] === 'string' && holder[k].trim());
  return key ? plainWords(holder[key]) : '';
}

/**
 * The links that point at a spot from its own page, the menu and the footer: by the spot's id, or by its name for a link typed as an address.
 * A link on the page that names no page points at a spot there; a link in the menu or the footer counts when it names the page, by its id or its address.
 * Each block with such a link is listed once, with its type and words; each menu or footer item once, with its words.
 * @param {{id: string, name?: string}} spot
 * @param {{page?: {sections?: Array<object>}, pageId?: string, path?: string, site?: {nav?: object, footer?: object}|null}} context The page, its id and path, and the site with its menu and footer
 * @returns {Array<{area: 'page'|'menu'|'footer', words: string, sectionId?: string, blockId?: string, type?: string}>}
 */
export function spotLinks(spot, { page = null, pageId = '', path = '/', site = null } = {}) {
  const named = (target) => target === spot.id || (Boolean(spot.name) && target === spot.name);
  const lands = (ref, onPage) => {
    if (!named(ref.target)) return false;
    if (ref.page) return ref.page === pageId;
    if (ref.path === undefined || ref.path === '') return onPage;
    return ref.path === path;
  };
  const uses = [];
  for (const section of page?.sections ?? []) {
    for (const block of section?.blocks ?? []) {
      let found = false;
      walkRefs(block?.props, (ref) => {
        if (lands(ref, true)) found = true;
      });
      if (found) uses.push({ area: 'page', sectionId: section.id, blockId: block.id, type: block.type, words: blockWords(block) });
    }
  }
  for (const [area, value] of [['menu', site?.nav], ['footer', site?.footer]]) {
    const seen = new Set();
    walkRefs(value, (ref, holder) => {
      if (!lands(ref, false) || seen.has(holder)) return;
      seen.add(holder);
      uses.push({ area, words: holderWords(holder) });
    });
  }
  return uses;
}
