/**
 * The undo of one publish (ADR-0003): each path it changed goes back to the tree before it, a page's copy to HEAD's root index.html; other paths keep HEAD's.
 */
import { isAllowedPath, isDeletablePath, isPluginFile, isPageIndexCopy } from './guard.js';

/**
 * A git tree's entries by path (GET git/trees/<sha>?recursive=1).
 * @param {Array<{path: string, sha: string, mode: string, type: string}>} tree
 * @returns {Map<string, {sha: string, mode: string, type: string}>}
 */
export function treeMap(tree) {
  return new Map((tree ?? []).map((entry) => [entry.path, entry]));
}

/**
 * The entries that undo a publish: each changed path's blob before it (a rename at both names), a deletion where none, HEAD's root index.html for a page copy.
 * @param {Array<{filename: string, status: string, previous_filename?: string}>} files The publish's changed files, as GitHub lists a commit's
 * @param {Map<string, {sha: string, mode: string, type: string}>} before The tree before the publish, by path (repo paths)
 * @param {Map<string, {sha: string, mode: string, type: string}>} now HEAD's tree, by path
 * @param {string} [rootDir] The site's folder in the repo ('' for the repo's root)
 * @returns {{entries: Array<{path: string, mode: '100644', type: 'blob', sha: string|null}>, skipped: string[]}} `skipped`: the paths outside the guard or the site's folder, and anything but a plain file
 */
export function revertEntries(files, before, now, rootDir = '') {
  const prefix = rootDir ? `${rootDir.replace(/\/+$/, '')}/` : '';
  const entries = new Map();
  const skipped = [];
  const plain = (entry) => entry?.type === 'blob' && (entry.mode === '100644' || entry.mode === '100755');
  const undo = (path) => {
    if (entries.has(path)) return;
    const own = prefix ? (path.startsWith(prefix) ? path.slice(prefix.length) : null) : path;
    if (own === null || !(isAllowedPath(own) || isDeletablePath(own) || isPluginFile(own))) {
      skipped.push(path);
      return;
    }
    const was = before.get(path);
    const is = now.get(path);
    if ((was && !plain(was)) || (is && !plain(is))) {
      skipped.push(path);
      return;
    }
    const root = now.get(`${prefix}index.html`);
    const target = was ? (isPageIndexCopy(own) && plain(root) ? root.sha : was.sha) : null;
    const current = is?.sha ?? null;
    if (target === current) return;
    entries.set(path, { path, mode: '100644', type: 'blob', sha: target });
  };
  for (const file of files ?? []) {
    if (typeof file?.filename !== 'string') continue;
    if (file.status === 'renamed' && typeof file.previous_filename === 'string') undo(file.previous_filename);
    undo(file.filename);
  }
  return { entries: [...entries.values()], skipped };
}
