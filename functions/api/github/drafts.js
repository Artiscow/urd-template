/**
 * /api/github/drafts: the saved drafts (ADR-0032), on their own branch `urd-drafts`, for an owner who may publish.
 *
 * GET                 { head, index }: the branch's head and its index, or head null and an empty index where nothing is saved yet.
 * GET ?parts=a,b      { head, parts: { a: text|null } }: the parts' file texts at the head, in one GraphQL call (a text GitHub cuts short is read as a blob).
 * POST { expect, writes: [{ name, keys, hash?, base?, title?, later?, note?, device? }], removes: [name], all? }
 *                     { head, index }: one commit on the branch with the index, each written part and each removed one (`all` removes every part).
 *                     `expect` is the head the editor last read (null for none); a head that moved since gives 409 `draftsRace` with the head as it stands.
 *
 * Every commit's message begins with the host's skip marker, so the branch is never built or deployed, and nothing here ever writes the site's branch.
 * The branch's paths are its own (the index and parts/), never under GITHUB_ROOT_DIR.
 */
import { gh, ghGraphql, cleanBase64, commitTree } from '../../_lib/github.js';
import { requirePublisher } from '../../_lib/auth.js';
import { chunkEntries } from '../../_lib/update-plan.js';
import {
  DRAFTS_BRANCH, INDEX_PATH, partPath, isPartName, partProblem, partText, emptyIndex, mergeIndex, saveMessage,
  MAX_REQUEST, BLOB_FROM, MAX_BLOBS,
} from '../../_lib/drafts.js';

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });

/** GitHub's own words in an error from gh(), without the request's path, which holds the repository's name. */
const detailOf = (err) => String(err?.message ?? '').replace(/^.*?responded \d+: /, '');

const decodeBlob = (b64) =>
  new TextDecoder().decode(Uint8Array.from(atob(cleanBase64(b64)), (c) => c.charCodeAt(0)));

/** The branch's head, or null where nothing has been saved yet. */
async function headOf(token, repo) {
  try {
    return (await gh(token, `/repos/${repo}/git/ref/heads/${DRAFTS_BRANCH}`)).object.sha;
  } catch (err) {
    if (err.status === 404) return null;
    throw err;
  }
}

/** The index at a head. */
async function indexAt(token, repo, head) {
  if (!head) return emptyIndex();
  try {
    const file = await gh(token, `/repos/${repo}/contents/${INDEX_PATH}?ref=${head}`);
    const index = JSON.parse(decodeBlob(file.content));
    return index && typeof index.parts === 'object' ? index : emptyIndex();
  } catch (err) {
    if (err.status === 404) return emptyIndex();
    throw err;
  }
}

/** The site's own branch may never be the drafts' branch: a save would then be published. */
function refused(config) {
  return config.branch === DRAFTS_BRANCH
    ? json({ error: `The site's branch is ${DRAFTS_BRANCH}, which saved drafts need for themselves`, code: 'draftsBranchRefused' }, 409)
    : null;
}

export async function onRequestGet({ request, env }) {
  const auth = await requirePublisher(request, env);
  if (auth.response) return auth.response;
  const { config, token } = auth;
  const clash = refused(config);
  if (clash) return clash;

  try {
    const head = await headOf(token, config.repo);
    const asked = new URL(request.url).searchParams.get('parts');
    if (asked === null) return json({ head, index: await indexAt(token, config.repo, head) });

    const names = asked.split(',').filter(Boolean);
    if (!names.length || names.length > 200 || !names.every(isPartName)) {
      return json({ error: 'parts must name saved parts', code: 'draftsBadPart' }, 400);
    }
    const parts = Object.fromEntries(names.map((name) => [name, null]));
    if (!head) return json({ head, parts });

    const [owner, name] = config.repo.split('/');
    const fields = names.map((part, i) => `p${i}: object(expression: ${JSON.stringify(`${head}:${partPath(part)}`)}) { ... on Blob { text isTruncated oid } }`).join('\n');
    // A path the branch does not hold reads as null; any other error fails the whole read, so a saved part never reads as absent.
    const data = await ghGraphql(token, `query { repository(owner: ${JSON.stringify(owner)}, name: ${JSON.stringify(name)}) { ${fields} } }`);
    let blobs = 0;
    for (const [i, part] of names.entries()) {
      const blob = data?.repository?.[`p${i}`];
      if (!blob) continue;
      if (!blob.isTruncated) {
        parts[part] = blob.text;
        continue;
      }
      // A text GitHub cut short is read whole as a blob, a few per request.
      if (++blobs > MAX_BLOBS) return json({ error: 'Too many large parts in one request', code: 'draftsTooLarge' }, 413);
      parts[part] = decodeBlob((await gh(token, `/repos/${config.repo}/git/blobs/${blob.oid}`)).content);
    }
    return json({ head, parts });
  } catch (err) {
    console.error('Urd drafts:', err.message);
    return json({ error: `Could not read the saved drafts: ${err.message}`, code: 'draftsFailed', detail: err.message }, 502);
  }
}

export async function onRequestPost({ request, env }) {
  const auth = await requirePublisher(request, env);
  if (auth.response) return auth.response;
  const { config, token, user } = auth;
  const clash = refused(config);
  if (clash) return clash;

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON in the request', code: 'badJson' }, 400);
  }
  const { expect = null, writes = [], removes = [], all = false } = body ?? {};
  if (expect !== null && (typeof expect !== 'string' || !/^[0-9a-f]{40}$/.test(expect))) {
    return json({ error: 'expect must be a commit sha or null', code: 'badExpect' }, 400);
  }
  if (!Array.isArray(writes) || !Array.isArray(removes) || writes.length > 200 || removes.length > 200 || typeof all !== 'boolean') {
    return json({ error: 'writes and removes must be lists of at most 200 parts', code: 'draftsBadPart' }, 400);
  }
  let size = 0;
  let large = 0;
  for (const write of writes) {
    const problem = partProblem(write);
    if (problem) return json({ error: `The part '${String(write?.name)}' cannot be saved (${problem})`, code: 'draftsBadPart', name: String(write?.name ?? ''), reason: problem }, 400);
    const text = partText(write.keys);
    write.text = text;
    size += text.length;
    if (text.length > BLOB_FROM) large++;
  }
  if (size > MAX_REQUEST || large > MAX_BLOBS) {
    return json({ error: 'The drafts are too large to save in one go', code: 'draftsTooLarge' }, 413);
  }
  if (!removes.every(isPartName)) return json({ error: 'removes must name saved parts', code: 'draftsBadPart' }, 400);
  const names = writes.map((w) => w.name);
  if (new Set(names).size !== names.length || new Set(removes).size !== removes.length) {
    return json({ error: 'A part is named twice', code: 'draftsBadPart' }, 400);
  }

  try {
    const head = await headOf(token, config.repo);
    if (expect !== head) return json({ error: 'The saved drafts changed on another device', code: 'draftsRace', head }, 409);
    const index = await indexAt(token, config.repo, head);
    const written = new Set(writes.map((w) => w.name));
    // Only parts the index lists are removed, so every deletion names a file the branch holds.
    const gone = (all ? Object.keys(index.parts ?? {}) : removes).filter((name) => isPartName(name) && index.parts?.[name] && !written.has(name));
    if (!writes.length && !gone.length) return json({ head, index });

    const next = mergeIndex(index, writes, gone, { login: user.login, now: new Date().toISOString() });
    const entries = [{ path: INDEX_PATH, content: JSON.stringify(next, null, 2) }];
    for (const write of writes) {
      if (write.text.length > BLOB_FROM) {
        const blob = await gh(token, `/repos/${config.repo}/git/blobs`, { method: 'POST', body: JSON.stringify({ content: write.text, encoding: 'utf-8' }) });
        entries.push({ path: partPath(write.name), sha: blob.sha });
      } else {
        entries.push({ path: partPath(write.name), content: write.text });
      }
    }
    for (const name of gone) entries.push({ path: partPath(name), sha: null });

    const { sha } = await commitTree(token, { ...config, branch: DRAFTS_BRANCH }, {
      message: saveMessage(writes.length, gone.length), entries, expect: head ?? undefined, orphan: !head,
    }, chunkEntries);
    return json({ head: sha, index: next });
  } catch (err) {
    if (err.status === 409 || (err.status === 422 && /fast.?forward/i.test(detailOf(err)))) {
      // The head as it stands, so the editor reads the drafts again from there, as for the race found before the commit.
      const head = await headOf(token, config.repo).catch(() => undefined);
      return json({ error: 'The saved drafts changed on another device', code: 'draftsRace', head }, 409);
    }
    // A ruleset or a protection that refuses the branch, read from GitHub's own words.
    if ((err.status === 422 || err.status === 403) && /rule|protect/i.test(detailOf(err))) {
      return json({ error: `GitHub refused the branch ${DRAFTS_BRANCH}: ${err.message}`, code: 'draftsBranchRefused', detail: err.message }, 409);
    }
    console.error('Urd drafts:', err.message);
    return json({ error: `Could not save the drafts: ${err.message}`, code: 'draftsFailed', detail: err.message }, 502);
  }
}
