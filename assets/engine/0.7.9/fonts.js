/**
 * Shared typography constants: the font choices shown both by the admin
 * panels and by the typography row of the text editor bar. System-safe
 * stacks only (Urd never loads external fonts, see _headers/CSP).
 */

/**
 * @type {Array<[string, string, ('decorative')?]>} Display-name KEY (looked up with ta() by the consumer, since ta() is never called at module level, ADR-0012) + CSS font stack, and `'decorative'` for a face whose letters are hard to read as a name.
 * Comparison and storage always use the stack (element 1), never the key.
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
 * The font list as the themed dropdowns take it, after the caller's own first entries (the inherited font, a custom stack): each face as `[stack, name, null, face]`, where the face draws its name in the typeface it names.
 * A decorative face keeps the UI font for its name and shows a short sample in its own beside it, so the name stays readable.
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
