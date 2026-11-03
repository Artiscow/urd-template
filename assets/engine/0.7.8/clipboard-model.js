/**
 * The editing clipboard (Ctrl+C, Ctrl+X and Ctrl+V on the page): blocks with the section they came from, or one whole section.
 * The preview (preview-edit.js) copies into it and pastes from it; the editor keeps the last copy and hands it to every page the preview loads, so a copy pastes on another page too.
 * Pure, node-tested (tests/clipboard-model.test.mjs).
 */

import { cloneSectionForInsert } from './templates-model.js';

const isObject = (value) => Boolean(value) && typeof value === 'object' && !Array.isArray(value);

/** A block the clipboard can carry: an id, a type and a desktop frame. */
function isBlock(block) {
  const f = block?.frames?.desktop;
  return isObject(block) && typeof block.id === 'string' && typeof block.type === 'string'
    && isObject(f) && ['x', 'y', 'w', 'h'].every((k) => Number.isFinite(f[k]));
}

/** A deep plain copy, so the clipboard never shares an object with the page. */
const plain = (value) => JSON.parse(JSON.stringify(value));

/**
 * The chosen blocks of a section, as the clipboard holds them.
 * @param {{id: string, blocks?: Array<object>}} section The section they stand in
 * @param {Iterable<string>} ids The ids of the blocks to copy
 * @returns {{kind: 'blocks', sectionId: string, blocks: Array<object>}|null} null when none of the ids is in the section
 */
export function blocksClipboard(section, ids) {
  const wanted = new Set(ids);
  const blocks = (section?.blocks ?? []).filter((b) => wanted.has(b.id));
  return blocks.length ? { kind: 'blocks', sectionId: section.id, blocks: plain(blocks) } : null;
}

/** A whole section, as the clipboard holds it; null for something that is not a section. */
export function sectionClipboard(section) {
  return isObject(section) && typeof section.id === 'string' && Array.isArray(section.blocks)
    ? { kind: 'section', section: plain(section) }
    : null;
}

/**
 * A clipboard as it arrives from the editor, checked: blocks with a desktop frame each, or a section with its blocks.
 * @returns {{kind: 'blocks', sectionId: string|null, blocks: Array<object>}|{kind: 'section', section: object}|null}
 */
export function readClipboard(value) {
  if (!isObject(value)) return null;
  if (value.kind === 'section') return sectionClipboard(value.section);
  if (value.kind !== 'blocks') return null;
  if (!Array.isArray(value.blocks) || !value.blocks.length || !value.blocks.every(isBlock)) return null;
  return { kind: 'blocks', sectionId: typeof value.sectionId === 'string' ? value.sectionId : null, blocks: plain(value.blocks) };
}

/**
 * The section on the clipboard, ready to land on a page: fresh ids for the section and its blocks (the template insertion's re-id).
 * The anchor names are made free by the editor, which knows the page (anchor-model.js claimAnchors).
 * @param {{kind: string, section?: object}} clip The clipboard
 * @param {(prefix: string) => string} makeId The id factory
 * @returns {object|null}
 */
export function pastedSection(clip, makeId) {
  return clip?.kind === 'section' && isObject(clip.section) ? cloneSectionForInsert(clip.section, makeId) : null;
}

/**
 * Where a pasted section lands: directly below the section named, or last on the page when it names none the page has.
 * @param {Array<{id: string}>} sections The page's sections in order
 * @param {string|null} afterId The section to land below
 */
export function pasteIndex(sections, afterId) {
  const list = sections ?? [];
  const at = afterId ? list.findIndex((s) => s.id === afterId) : -1;
  return at < 0 ? list.length : at + 1;
}
