/**
 * A site's `_headers` against the template's releases (ADR-0014 decision 5): written where unedited, its added hosts carried over, by hand otherwise.
 */

/** A header line under a path rule: its indent, its name and its value. */
const HEADER_LINE = /^([ \t]+)([A-Za-z0-9-]+)[ \t]*:[ \t]*(.*)$/;

/**
 * Whether the updater writes the site's `_headers` in this state: unedited, or only added to.
 * @param {string|null|undefined} state
 * @returns {boolean}
 */
export const writesHeaders = (state) => state === 'unedited' || state === 'added';

/**
 * A `_headers` text read into its lines, each header line keyed by its path rule and its name; blank lines at the end are left out.
 * @param {string} text
 */
function readLines(text) {
  const raw = text.split('\n');
  const lines = [];
  let rule = null;
  raw.forEach((source, at) => {
    const line = source.replace(/[ \t\r]+$/, '');
    const words = line.trim();
    if (!words || words.startsWith('#')) {
      lines.push({ at, line });
      return;
    }
    if (!/^[ \t]/.test(line)) {
      rule = words;
      lines.push({ at, line });
      return;
    }
    const m = HEADER_LINE.exec(line);
    lines.push(m ? { at, line, indent: m[1], name: m[2], key: `${rule}\n${m[2].toLowerCase()}`, value: m[3] } : { at, line });
  });
  while (lines.length && !lines[lines.length - 1].line) lines.pop();
  return { raw, lines };
}

/** A header's value as its directives, each a list of words with the directive's name first. */
const directivesOf = (value) => value.split(';').map((part) => part.trim().split(/\s+/).filter(Boolean)).filter((words) => words.length);

const sameName = (a, b) => a.toLowerCase() === b.toLowerCase();

/** A CSP source that changes which other sources in its directive count: a hash, a nonce or `'strict-dynamic'`. */
const GATE = /^'(?:sha(?:256|384|512)-|nonce-|strict-dynamic')/i;

/** A security policy's header, whose directives fall back on one another. */
const POLICY = /^content-security-policy(?:-report-only)?$/i;

/**
 * A site's header value's additions to a released one, or null where it takes away, names a directive twice or adds beside a gate source.
 * @returns {Array<{name: string, words: string[], own: boolean}>|null}
 */
function addedTo(released, site) {
  const ours = directivesOf(released);
  const theirs = directivesOf(site);
  if (new Set(theirs.map((d) => d[0].toLowerCase())).size !== theirs.length) return null;
  for (const directive of ours) {
    const match = theirs.find((d) => sameName(d[0], directive[0]));
    if (!match || directive.slice(1).some((word) => !match.slice(1).includes(word))) return null;
  }
  const added = [];
  for (const directive of theirs) {
    const match = ours.find((d) => sameName(d[0], directive[0]));
    const words = [...new Set(directive.slice(1).filter((word) => !match?.slice(1).includes(word)))];
    if (words.length && directive.some((word) => GATE.test(word))) return null;
    if (!match || words.length) added.push({ name: directive[0], words, own: !match });
  }
  return added;
}

/**
 * The additions that make a site's file out of a released one, by header line, or null where the site's file differs in any other way.
 * @returns {Array<{key: string, added: Array<{name: string, words: string[], own: boolean}>}>|null}
 */
function additionsOver(released, site) {
  const ours = readLines(released).lines;
  const theirs = readLines(site).lines;
  if (ours.length !== theirs.length) return null;
  const out = [];
  for (let i = 0; i < ours.length; i++) {
    const a = ours[i];
    const b = theirs[i];
    if (a.line === b.line) continue;
    if (!a.key || a.key !== b.key || a.indent !== b.indent) return null;
    const added = addedTo(a.value, b.value);
    if (!added) return null;
    if (added.length) out.push({ key: a.key, added });
  }
  return out;
}

/** The names of a header value's directives, in lower case and sorted. */
const namesOf = (value) => directivesOf(value).map((d) => d[0].toLowerCase()).sort().join(' ');

/** The target's text with the additions in its lines, or null where they would act otherwise: a line twice, a policy's directives changed, a gate source. */
function withAdditions(target, released, additions) {
  const { raw, lines } = readLines(target);
  const before = readLines(released).lines;
  const out = [...raw];
  for (const { key, added } of additions) {
    const ours = before.filter((l) => l.key === key);
    const theirs = lines.filter((l) => l.key === key);
    if (ours.length !== 1 || theirs.length !== 1) return null;
    const line = theirs[0];
    if (POLICY.test(line.name) && namesOf(line.value) !== namesOf(ours[0].value)) return null;
    const directives = directivesOf(line.value);
    for (const { name, words, own } of added) {
      const match = directives.find((d) => sameName(d[0], name));
      if (match && words.length && match.some((word) => GATE.test(word))) return null;
      if (match) match.push(...words.filter((word) => !match.slice(1).includes(word)));
      else if (own) directives.push([name, ...words]);
      else return null;
    }
    out[line.at] = `${line.indent}${line.name}: ${directives.map((d) => d.join(' ')).join('; ')}`;
  }
  return out.join('\n');
}

/** An addition as the panel lists it: the directive and the words added to it. */
const additionLabel = ({ name, words }) => [name, ...words].join(' ');

/** A text's lines as compared: line ends, trailing spaces and blank lines at the end left out. */
const linesOf = (text) => readLines(text).lines.map((l) => l.line).join('\n');

/**
 * What the updater does with a site's `_headers`: nothing, write the target's, write it with the additions of the closest release read, or leave it.
 * @param {{site: string|null, target: string|null, released: string[], complete?: boolean}} files The site's text, the target's, the releases' texts, and whether every release was read
 * @returns {{state: 'current'|'unedited'|'added'|'edited', text: string|null, added: string[]}} `text` is the file to write, or the one to copy by hand
 */
export function planHeaders({ site, target, released, complete = true }) {
  const current = { state: 'current', text: null, added: [] };
  const edited = { state: 'edited', text: target, added: [] };
  if (typeof target !== 'string') return current;
  if (typeof site !== 'string') return edited;
  if (additionsOver(target, site)?.length === 0) return current;
  const own = linesOf(site);
  if (released.some((text) => linesOf(text) === own)) return { state: 'unedited', text: target, added: [] };
  if (!complete) return edited;
  let closest = null;
  let tied = false;
  for (const text of released) {
    const additions = additionsOver(text, site);
    if (!additions) continue;
    const size = additions.reduce((n, a) => n + a.added.reduce((m, d) => m + d.words.length + (d.own ? 1 : 0), 0), 0);
    const labels = JSON.stringify(additions.flatMap((a) => a.added.map(additionLabel)).sort());
    if (closest && size === closest.size) tied ||= labels !== closest.labels;
    else if (!closest || size < closest.size) [closest, tied] = [{ text, additions, size, labels }, false];
  }
  if (!closest || tied) return edited;
  const merged = withAdditions(target, closest.text, closest.additions);
  if (merged === null) return edited;
  if (additionsOver(merged, site)?.length === 0) return current;
  const added = [...new Set(closest.additions.flatMap((a) => a.added.map(additionLabel)))];
  return { state: added.length ? 'added' : 'unedited', text: merged, added };
}
