/**
 * The font choices of the admin panels and the text bar's typography row: system-safe stacks only.
 */

/**
 * Each face's name key, its CSS stack, and `'decorative'` for a face hard to read as a name; comparison and storage use the stack.
 * @type {Array<[string, string, ('decorative')?]>}
 */
export const FONT_STACKS = [
  ['font.system', 'system-ui, sans-serif'],
  ['font.arial', 'Arial, Helvetica, sans-serif'],
  ['font.verdana', 'Verdana, Geneva, sans-serif'],
  ['font.trebuchet', "'Trebuchet MS', sans-serif"],
  ['font.georgia', "Georgia, 'Times New Roman', serif"],
  ['font.palatino', "'Palatino Linotype', Palatino, serif"],
  ['font.courier', "'Courier New', monospace"],
];

/**
 * The font list for the themed dropdowns after the caller's first entries, each face as `[stack, name, null, face]`, a decorative one with a sample.
 * @param {(key: string) => string} ta The caller's admin dictionary lookup
 * @param {Array<Array>} [first] The entries before the faces
 * @param {typeof FONT_STACKS} [stacks]
 * @returns {Array<[string, string, null, {font: string, sample?: string}]>}
 */
export function fontChoices(ta, first = [], stacks = FONT_STACKS) {
  return [
    ...first,
    ...stacks.map(([key, stack, kind]) => [stack, ta(key), null, kind === 'decorative' ? { font: stack, sample: ta('font.sample') } : { font: stack }]),
  ];
}
