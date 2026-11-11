/**
 * The draft view (0.7.28.7): a public page opened with `?draft=1` renders the drafts this browser's editor keeps, through the visitor's path and not the preview's, so the owner tries what only the published page does (a payment) on changes not yet published.
 * The drafts are the editor's own storage (editor/src/lib/draftStore.js): the site under `urd-draft-site`, a page under `urd-draft-<page id>` and a collection under `urd-draft-collection-<id>`.
 * A browser without drafts reads nothing and shows the published page; nothing leaves the browser.
 * Loaded on demand by urd.js, so visitors never fetch it.
 */

const COLLECTION_PREFIX = 'urd-draft-collection-';

/** One stored draft as an object, or null when there is none or it is not JSON. */
function readDraft(storage, key) {
  try {
    const raw = storage.getItem(key);
    if (raw === null) return null;
    const data = JSON.parse(raw);
    return data && typeof data === 'object' && !Array.isArray(data) ? data : null;
  } catch {
    return null;
  }
}

/**
 * The drafts in a storage: the site's, a page's by its id, and every collection's.
 * A storage that cannot be read gives no drafts.
 * @param {Storage} storage
 * @returns {{site: object|null, page: (id: string) => object|null, collections: Record<string, object>}}
 */
export function readDrafts(storage) {
  const collections = {};
  try {
    for (let i = 0; i < storage.length; i++) {
      const key = storage.key(i);
      if (!key?.startsWith(COLLECTION_PREFIX)) continue;
      const data = readDraft(storage, key);
      if (Array.isArray(data?.entries)) collections[key.slice(COLLECTION_PREFIX.length)] = data;
    }
  } catch {
    return { site: null, page: () => null, collections: {} };
  }
  return {
    site: readDraft(storage, 'urd-draft-site'),
    page: (id) => readDraft(storage, `urd-draft-${id}`),
    collections,
  };
}
