/**
 * A caret's place in an editable field as a path of child positions, found again in the field drawn anew with the same markup (keepTyping in preview-edit.js).
 */

/**
 * The child positions from `root` down to `node`.
 * @param {{childNodes: ArrayLike<object>}} root
 * @param {{parentNode?: object|null}} node
 * @returns {number[]|null} null when the node is not inside the root
 */
export function pathTo(root, node) {
  const path = [];
  let at = node;
  while (at && at !== root) {
    const parent = at.parentNode;
    if (!parent) return null;
    path.unshift(Array.prototype.indexOf.call(parent.childNodes, at));
    at = parent;
  }
  return at === root ? path : null;
}

/**
 * The node a path leads to from `root`.
 * @param {{childNodes: ArrayLike<object>}} root
 * @param {number[]} path
 * @returns {object|null} null when the markup has no such place
 */
export function nodeAt(root, path) {
  let at = root;
  for (const index of path ?? []) {
    at = at?.childNodes?.[index];
    if (!at) return null;
  }
  return at;
}
