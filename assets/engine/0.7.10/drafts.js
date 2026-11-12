/**
 * The draft view (0.7.28.7): a public page opened with `?draft=1` renders the drafts this browser's editor keeps, through the visitor's path and not the preview's, so the owner tries what only the published page does (a payment) on changes not yet published.
 * The drafts are the editor's own storage (editor/src/lib/draftStore.js): the site under `urd-draft-site`, a page under `urd-draft-<page id>` and a collection under `urd-draft-collection-<id>`.
 * A saved draft looked at in a tab of its own (`?draft=look&look=<id>`) is handed over by the editor under `urd-look-<id>`, which the tab moves into its own session storage at its first load (receiveLook), so a reload draws it again; there it stands over this browser's drafts (overlayDrafts).
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

/**
 * The drafts of `top` standing over those of `under`: the site, each page and each collection taken from `top` where it holds one.
 * @param {ReturnType<typeof readDrafts>} top
 * @param {ReturnType<typeof readDrafts>} under
 */
export function overlayDrafts(top, under) {
  return {
    site: top.site ?? under.site,
    page: (id) => top.page(id) ?? under.page(id),
    collections: { ...under.collections, ...top.collections },
  };
}

/** The id a hand-over of a saved draft goes by. */
const LOOK_ID = /^[a-z0-9]{6,24}$/;

/**
 * A saved draft handed over to this tab (`urd-look-<id>` in the shared storage, `{at, texts: {key: text}}`), moved into the tab's own storage, the draft keys alone, and only then taken away; a hand-over that is not there, not of that shape, or cannot be written whole stays where it is and moves nothing.
 * @param {string|null} id
 * @param {Storage} shared The storage every tab of the site reads (localStorage)
 * @param {Storage} own The tab's own storage (sessionStorage)
 */
export function receiveLook(id, shared, own) {
  if (!id || !LOOK_ID.test(id)) return;
  try {
    const raw = shared.getItem(`urd-look-${id}`);
    if (raw === null) return;
    const texts = JSON.parse(raw)?.texts;
    if (!texts || typeof texts !== 'object') return;
    for (const [key, text] of Object.entries(texts)) {
      if (key.startsWith('urd-draft-') && typeof text === 'string') own.setItem(key, text);
    }
    shared.removeItem(`urd-look-${id}`);
  } catch { /* a storage that cannot be read or written hands nothing over */ }
}
