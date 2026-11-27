/**
 * Pure planning for the updater (ADR-0014): the git blob SHAs of the user's tree, the baseline tag v<engine> and the target version in, the change set out.
 */
import { isUserPath, isPageIndexCopy } from './guard.js';

/** A version tag: v and three numbers or more, none with a leading zero, and a last number after the third that is not 0, so no two tags rank equal. */
export const VERSION_TAG_RE = /^v(?:0|[1-9]\d*)(?:\.(?:0|[1-9]\d*)){2}(?:(?:\.(?:0|[1-9]\d*))*\.[1-9]\d*)?$/;

/** The numbers of a version tag, or null for any other name. */
export function versionTagParts(name) {
  return typeof name === 'string' && VERSION_TAG_RE.test(name) ? name.slice(1).split('.').map(Number) : null;
}

/**
 * Whether version tag `a` is older than version tag `b` (v0.7.10 before v0.7.11, v0.7.11 before v0.7.11.1); false where either is no version tag.
 * @param {string} a
 * @param {string} b
 * @returns {boolean}
 */
export function isOlderTag(a, b) {
  const pa = versionTagParts(a);
  const pb = versionTagParts(b);
  return Boolean(pa && pb) && compareParts(pa, pb) < 0;
}

/** Compares two lists of version numbers number by number, a missing number counting as 0. */
function compareParts(a, b) {
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    const d = (a[i] ?? 0) - (b[i] ?? 0);
    if (d) return d;
  }
  return 0;
}

/** The highest version tag in a list of tag names, or null. */
export function highestVersionTag(names) {
  let best = null;
  let bestParts = null;
  for (const name of names ?? []) {
    const parts = versionTagParts(name);
    if (!parts) continue;
    if (!bestParts || compareParts(parts, bestParts) > 0) {
      best = name;
      bestParts = parts;
    }
  }
  return best;
}

/** The engine atom group (ADR-0014): the files an update swaps together. Only functions/** and loose root files can be withheld one by one. */
export function isAtomPath(path) {
  return path === 'index.html'
    || path === 'urd.json'
    || path.startsWith('admin/')
    || path.startsWith('assets/')
    || isPageIndexCopy(path);
}

/**
 * Computes the change set for an update, with a conflict on each file the user has edited; user-owned paths stay outside it, and `_headers` has a plan of its own.
 * @param {Record<string, string>} baselineTree The template's tree at v<engine>: path → blob SHA
 * @param {Record<string, string>} targetTree The template's tree at the target version: path → blob SHA
 * @param {Record<string, string>} userTree The user's tree (rootDir stripped): path → blob SHA
 * @returns {{changes: Array<{path: string, action: 'write'|'delete', atom: boolean, conflict: 'edited'|'created'|'editedDelete'|null}>, upToDate: boolean}}
 */
export function planUpdate(baselineTree, targetTree, userTree) {
  const changes = [];
  const paths = new Set([...Object.keys(baselineTree), ...Object.keys(targetTree)]);
  for (const path of [...paths].sort()) {
    if (isUserPath(path) || path === '_headers') continue;
    const base = baselineTree[path];
    const target = targetTree[path];
    const user = userTree[path];
    const atom = isAtomPath(path);

    if (target !== undefined) {
      if (user === target) continue; // already at the target content
      if (base === undefined) {
        // New file upstream; a local file at the same path is the user's own.
        changes.push({ path, action: 'write', atom, conflict: user !== undefined ? 'created' : null });
      } else if (base === target) {
        // Unchanged upstream: never touched, except when it is missing locally (deleted by accident); then it is restored.
        if (user === undefined) changes.push({ path, action: 'write', atom, conflict: null });
      } else {
        changes.push({
          path,
          action: 'write',
          atom,
          conflict: user !== undefined && user !== base ? 'edited' : null,
        });
      }
    } else if (user !== undefined) {
      // Removed upstream (e.g. the previous engine folder on a version swap).
      changes.push({ path, action: 'delete', atom, conflict: user !== base ? 'editedDelete' : null });
    }
  }
  return { changes, upToDate: changes.length === 0 };
}

/**
 * Splits tree entries into groups for chained base_tree calls (one commit either way).
 * The limit is entries per call, well under GitHub's payload cap.
 */
export function chunkEntries(entries, size = 300) {
  const chunks = [];
  for (let i = 0; i < entries.length; i += size) chunks.push(entries.slice(i, i + size));
  return chunks;
}

/** The template files one update call copies at most as blobs of their own, two subrequests each, under the free plan's cap of 50 (ADR-0014 decision 6). */
export const BLOB_BATCH = 18;

/** The files a call copies and still commits in: two subrequests each beside the committing call's own (about 16). */
export const BLOB_ROOM = 10;

/**
 * Whether a target file travels as a blob of its own rather than inline in the tree: all but a blob GraphQL calls text (`isBinary` false) and gives whole.
 * @param {{isBinary?: boolean|null, isTruncated?: boolean}|null|undefined} blob
 * @returns {boolean}
 */
export function travelsAsBlob(blob) {
  return !blob || blob.isBinary !== false || Boolean(blob.isTruncated);
}

/**
 * The next files to copy as blobs of their own, those the site's repository lacks in plan order: all of them with the commit once at most `room` are left.
 * @param {string[]} paths The paths written as blobs of their own
 * @param {Set<string>} present The paths whose blob the site's repository already holds
 * @param {number} [size]
 * @param {number} [room]
 * @returns {{batch: string[], copied: number, total: number, commit: boolean}} `copied` counts what the repository holds once the batch is copied, out of `total`
 */
export function blobBatch(paths, present, size = BLOB_BATCH, room = BLOB_ROOM) {
  const missing = paths.filter((path) => !present.has(path));
  const commit = missing.length <= room;
  const batch = commit ? missing : missing.slice(0, size);
  return { batch, copied: paths.length - missing.length + batch.length, total: paths.length, commit };
}
