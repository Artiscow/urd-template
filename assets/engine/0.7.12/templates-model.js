/**
 * User templates in content/maler/: a file keeps its source ids, and each insertion deep-clones it with new ids and places its frames.
 * Pure.
 */
import { slugify } from './imageTools.js';
import { groupDelta } from './selection.js';
import { liftMobileFrame, liftContractTokens, liftMapHeights, liftCalendarScale, liftGalleryBands, liftTermsBlocks } from './migrate.js';

/** Current version of the template file format (content/maler/*.json). */
export const TEMPLATE_SCHEMA_VERSION = 1;

/** Valid template kinds; the payload key in the file equals the kind. */
export const TEMPLATE_KINDS = ['section', 'blocks', 'page'];

/** Template id from the display name; an empty string is an invalid name, for the caller to refuse. */
export function templateId(name) {
  return slugify(String(name ?? ''), '');
}

const r2 = (v) => Math.round(v * 100) / 100;

/** Lifts a block's frames.mobile to the row grid form (ADR-0019), as template payloads bypass the page lift. */
function liftBlockMobile(block) {
  if (block.frames?.mobile) {
    block.frames.mobile = liftMobileFrame(block.frames.mobile, block.frames.desktop);
  }
}

/**
 * A rich text's links to a spot on its own page (data-urd-target without data-urd-page) pointed at the spots' new ids, the address included.
 * @param {string} html
 * @param {Map<string, string>} ids The old ids to the new
 * @returns {string}
 */
function followSpotsInText(html, ids) {
  return html.replace(/<a\b[^>]*>/g, (tag) => {
    if (tag.includes('data-urd-page=')) return tag;
    const old = tag.match(/data-urd-target="([^"]*)"/)?.[1];
    if (!old || !ids.has(old)) return tag;
    return tag.replace(`data-urd-target="${old}"`, `data-urd-target="${ids.get(old)}"`).replace(`href="#${old}"`, `href="#${ids.get(old)}"`);
  });
}

/**
 * Points the links inside copied blocks at the copies: a link to a spot on its own page whose spot was copied along follows its new id.
 * Changed in place.
 * @param {Array<object>} blocks
 * @param {Map<string, string>} ids The old ids to the new
 */
function followCopiedSpots(blocks, ids) {
  const visit = (value) => {
    if (Array.isArray(value)) {
      value.forEach(visit);
      return;
    }
    if (!value || typeof value !== 'object') return;
    if (typeof value.target === 'string' && !value.page && ids.has(value.target)) value.target = ids.get(value.target);
    for (const [key, inner] of Object.entries(value)) {
      if (typeof inner === 'string' && inner.includes('data-urd-target=')) value[key] = followSpotsInText(inner, ids);
      else visit(inner);
    }
  };
  // The phone's own words (phoneProps, ADR-0033) hold their links as the desktop's do.
  for (const block of blocks) {
    visit(block.props);
    visit(block.phoneProps);
  }
}

/**
 * A copied block's `phonePlace` follows the block it names to its new id, and is dropped when that block was left out of the copy.
 * @param {object[]} blocks The copied blocks, with their new ids
 * @param {Map<string, string>} ids Old id to new id
 */
function followCopiedPlaces(blocks, ids) {
  for (const block of blocks) {
    const place = block.phonePlace;
    const side = typeof place?.before === 'string' ? 'before' : typeof place?.after === 'string' ? 'after' : null;
    if (!place) continue;
    if (side && ids.has(place[side])) block.phonePlace = { [side]: ids.get(place[side]) };
    else delete block.phonePlace;
  }
}

/**
 * A copied section's `phoneList`, `phoneStacks` and `phoneLoose` follow its blocks to their new ids; a block left out leaves them.
 * @param {object} section The copied section
 * @param {Map<string, string>} ids Old id to new id
 */
function followCopiedOrder(section, ids) {
  const follow = (list) => (Array.isArray(list) ? list.filter((id) => ids.has(id)).map((id) => ids.get(id)) : []);
  for (const key of ['phoneList', 'phoneLoose']) {
    if (section[key] === undefined) continue;
    const list = follow(section[key]);
    if (list.length) section[key] = list; else delete section[key];
  }
  if (section.phoneStacks !== undefined) {
    const stacks = (Array.isArray(section.phoneStacks) ? section.phoneStacks : []).map(follow).filter((stack) => stack.length > 1);
    if (stacks.length) section.phoneStacks = stacks; else delete section.phoneStacks;
  }
}

/**
 * Prepares a section template for insertion: a deep clone with new ids, its links to its own spots following them.
 * @param {object} section The section from the template file (not mutated)
 * @param {(prefix: string) => string} makeId The id factory (sections/presets.js)
 */
export function cloneSectionForInsert(section, makeId) {
  const out = structuredClone(section);
  const ids = new Map();
  ids.set(out.id, (out.id = makeId('sec')));
  for (const block of out.blocks ?? []) {
    ids.set(block.id, (block.id = makeId('blk')));
    liftBlockMobile(block);
  }
  followCopiedSpots(out.blocks ?? [], ids);
  followCopiedPlaces(out.blocks ?? [], ids);
  followCopiedOrder(out, ids);
  // A phone review flag that names a block (responsive.mobile.attention.blockId) names the copy's.
  const attention = out.responsive?.mobile?.attention;
  if (attention?.blockId) {
    if (ids.has(attention.blockId)) attention.blockId = ids.get(attention.blockId);
    else delete attention.blockId;
  }
  // Template payloads bypass the page lift, so their contract tokens, map heights, calendar size, gallery bands and terms blocks are lifted here.
  liftContractTokens(out);
  liftMapHeights(out);
  liftCalendarScale(out);
  liftGalleryBands(out);
  liftTermsBlocks(out);
  return out;
}

/**
 * Prepares a page template for insertion: a deep clone whose meta names the new page, the caller checking its slug, and every section and block with new ids.
 * @param {object} page The page file from the template (not mutated)
 * @param {(prefix: string) => string} makeId The id factory (sections/presets.js)
 * @param {{id: string, title: string}} meta The new page's slug and title
 */
export function clonePageForInsert(page, makeId, { id, title }) {
  const out = structuredClone(page);
  out.meta = { ...out.meta, id, title };
  const ids = new Map();
  for (const section of out.sections ?? []) {
    ids.set(section.id, (section.id = makeId('sec')));
    for (const block of section.blocks ?? []) ids.set(block.id, (block.id = makeId('blk')));
    liftMapHeights(section);
    liftCalendarScale(section);
    liftGalleryBands(section);
  }
  followCopiedSpots((out.sections ?? []).flatMap((section) => section.blocks ?? []), ids);
  followCopiedPlaces((out.sections ?? []).flatMap((section) => section.blocks ?? []), ids);
  for (const section of out.sections ?? []) followCopiedOrder(section, ids);
  return out;
}

/**
 * Prepares a block group template for insertion: a deep clone with new ids, its top left moved to the anchor within the section, and its lowest bottom.
 * @param {Array<object>} blocks The blocks from the template file (not mutated)
 * @param {(prefix: string) => string} makeId The id factory
 * @param {{anchor?: {x: number, y: number}|null}} [opts] Anchor in section coordinates (x in %, y in px)
 * @returns {{blocks: Array<object>, minBottom: number}}
 */
export function cloneBlocksForInsert(blocks, makeId, { anchor = null } = {}) {
  const out = structuredClone(blocks);
  const ids = new Map();
  for (const block of out) {
    ids.set(block.id, (block.id = makeId('blk')));
    liftBlockMobile(block);
  }
  followCopiedSpots(out, ids);
  followCopiedPlaces(out, ids);
  liftContractTokens(out);
  liftMapHeights({ blocks: out });
  liftCalendarScale({ blocks: out });
  liftGalleryBands({ blocks: out });
  liftTermsBlocks(out);
  const frames = out.map((b) => b.frames.desktop);
  const minX = Math.min(...frames.map((f) => f.x));
  const minY = Math.min(...frames.map((f) => f.y));
  const { dx, dy } = anchor
    ? groupDelta(frames, anchor.x - minX, anchor.y - minY)
    : groupDelta(frames, 0, 0);
  for (const f of frames) {
    f.x = r2(f.x + dx);
    f.y = Math.round(f.y + dy);
  }
  const minBottom = Math.max(...frames.map((f) => f.y + f.h));
  return { blocks: out, minBottom };
}
