/**
 * Saved drafts (ADR-0032): the rules for the branch they live on, pure and node-tested (tests/drafts-branch.test.mjs).
 * The branch holds `index.json` and one file per part under `parts/`, written only by the drafts function (api/github/drafts.js) for an owner who may publish.
 * A part file holds the browser's stored draft texts as they are, keyed by the localStorage key the editor keeps them under, so a part taken in elsewhere is written where a reload reads it.
 * Every commit on the branch begins with the host's skip marker, so it is never built or deployed.
 */

/** The branch the saved drafts live on. */
export const DRAFTS_BRANCH = 'urd-drafts';

/** Cloudflare Pages skips the build of a commit whose message begins with this, on any branch. */
export const SKIP = '[CF-Pages-Skip]';

export const INDEX_PATH = 'index.json';

/** The file a part lives in on the branch. */
export const partPath = (name) => `parts/${name}.json`;

/** The largest part, in characters of its stored texts, and the most a request's part files may hold in all: a browser keeps about 5 MB of drafts, so these leave room without straining the function's memory. */
export const MAX_PART = 6 * 1024 * 1024;
export const MAX_REQUEST = 10 * 1024 * 1024;

/** A part larger than this goes up as a blob of its own before the tree is made. */
export const BLOB_FROM = 1024 * 1024;

/** The most parts sent as blobs in one request, which keeps a save within a free host's calls per request. */
export const MAX_BLOBS = 30;

const ID = '[a-z0-9][a-z0-9-]{0,79}';
const PART = new RegExp(`^(?:site|collections|templates|plugins|redirects|page-${ID}|collection-${ID})$`);

/** Page ids whose draft key would be another part's: such a page cannot be saved as a page. */
const PAGE_ID_TAKEN = /^(?:(?:site|templates|plugins|redirects|media-moves|collections|maler|samlinger)$|collection-|template-|samling-|mal-)/;

/** Whether a name is a part's. */
export function isPartName(name) {
  if (typeof name !== 'string' || !PART.test(name)) return false;
  return !(name.startsWith('page-') && PAGE_ID_TAKEN.test(name.slice(5)));
}

const ONE_KEY = {
  site: 'urd-draft-site',
  plugins: 'urd-draft-plugins',
  redirects: 'urd-draft-redirects',
};
const COLLECTIONS_KEYS = new Set(['urd-draft-collections:index', 'urd-draft-collections:legacy-deleted']);
const TEMPLATE_KEY = /^urd-draft-template-[A-Za-z0-9_-]{1,80}$/;

/** Whether a stored draft key belongs to a part: each part holds its own keys and no other part's. */
export function keyOfPart(name, key) {
  if (typeof key !== 'string') return false;
  if (ONE_KEY[name]) return key === ONE_KEY[name];
  if (name === 'collections') return COLLECTIONS_KEYS.has(key);
  if (name === 'templates') return key === 'urd-draft-templates' || TEMPLATE_KEY.test(key);
  if (name.startsWith('page-')) return key === `urd-draft-${name.slice(5)}`;
  if (name.startsWith('collection-')) return key === `urd-draft-${name}`;
  return false;
}

/**
 * Checks one part a save writes: its name, its keys (each the part's own, each a text), and its size.
 * @param {{name: unknown, keys: unknown, hash?: unknown, base?: unknown, title?: unknown, later?: unknown, note?: unknown, device?: unknown}} write
 * @returns {string|null} null when it may be written, else why not
 */
export function partProblem(write) {
  if (!isPartName(write?.name)) return 'name';
  const keys = write.keys;
  if (!keys || typeof keys !== 'object' || Array.isArray(keys)) return 'keys';
  const entries = Object.entries(keys);
  if (!entries.length) return 'keys';
  let size = 0;
  for (const [key, text] of entries) {
    if (!keyOfPart(write.name, key) || typeof text !== 'string') return 'keys';
    size += key.length + text.length;
  }
  if (size > MAX_PART) return 'size';
  if (write.hash !== undefined && (typeof write.hash !== 'string' || write.hash.length > 64)) return 'hash';
  if (write.base != null && (typeof write.base !== 'string' || !/^[0-9a-f]{40}$/.test(write.base))) return 'base';
  if (write.title !== undefined && (typeof write.title !== 'string' || write.title.length > 200)) return 'title';
  if (write.later !== undefined && typeof write.later !== 'boolean') return 'later';
  if (write.note !== undefined && (typeof write.note !== 'string' || write.note.length > 200)) return 'note';
  if (write.device !== undefined && (typeof write.device !== 'string' || write.device.length > 40)) return 'device';
  return null;
}

/** The text of a part's file. */
export const partText = (keys) => JSON.stringify({ v: 1, keys });

/** An index with nothing saved. */
export const emptyIndex = () => ({ version: 1, parts: {} });

/**
 * The index after a save: each written part with when and by whom it was saved (the server's own, never the request's), its hash, the live base it was made from, its title, whether it is kept for later, the owner's note on the save and the name of the browser it was saved from; each removed part gone.
 * @param {{version?: number, parts?: Record<string, object>}|null} index
 * @param {Array<{name: string, hash?: string, base?: string|null, title?: string, later?: boolean, note?: string, device?: string}>} writes
 * @param {string[]} removes
 * @param {{login: string, now: string}} by
 */
export function mergeIndex(index, writes, removes, { login, now }) {
  const parts = { ...(index?.parts ?? {}) };
  for (const name of removes) delete parts[name];
  for (const write of writes) {
    parts[write.name] = {
      savedAt: now,
      saver: login,
      hash: write.hash ?? '',
      base: write.base ?? null,
      ...(write.title ? { title: write.title } : {}),
      ...(write.later ? { later: true } : {}),
      ...(write.note ? { note: write.note } : {}),
      ...(write.device ? { device: write.device } : {}),
    };
  }
  return { version: 1, parts };
}

/** The commit message of a save: the skip marker first, then what it did. */
export function saveMessage(written, removed) {
  const said = [written ? `${written} saved` : '', removed ? `${removed} removed` : ''].filter(Boolean).join(', ');
  return `${SKIP} Urd: saved drafts (${said || 'index'})`;
}
