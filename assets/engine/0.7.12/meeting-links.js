/**
 * Which address leads to a video meeting: the services known by their host, and a site's own (`site.meetingHosts`).
 * A host matches exactly or as a subdomain.
 * Notes: docs/engine-notes/meeting-links.md (Urd repository).
 */

/** The services with a host of their own. */
export const MEETING_HOSTS = [
  'zoom.us', 'teams.microsoft.com', 'teams.live.com', 'meet.google.com', 'whereby.com', 'meet.jit.si', 'webex.com',
  'meet.proton.me', 'kmeet.infomaniak.com', 'call.element.io',
];

const HOST = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+$/;

/**
 * A site's own meeting hosts as a clean list of lower-case host names, read from a host or a whole address, without repeats or anything without a dot.
 * @param {unknown} value an array of strings, or one string divided by commas, spaces or lines
 * @returns {string[]}
 */
export function meetingHostList(value) {
  const entries = Array.isArray(value) ? value : String(value ?? '').split(/[\s,;]+/);
  const hosts = [];
  for (const entry of entries) {
    const text = String(entry ?? '').trim().toLowerCase();
    if (!text) continue;
    let host = '';
    try { host = new URL(/^[a-z][a-z0-9+.-]*:\/\//.test(text) ? text : `https://${text}`).hostname; } catch { /* not a host */ }
    if (HOST.test(host) && !hosts.includes(host)) hosts.push(host);
  }
  return hosts;
}

/** True when a host is a meeting service's, or one of the site's own, or a subdomain of either. */
export function isMeetingHost(hostname, own = []) {
  const host = String(hostname ?? '').toLowerCase();
  return [...MEETING_HOSTS, ...own].some((known) => host === known || host.endsWith(`.${known}`));
}

/** The host an address leads to («meet.proton.me»), for a button to show before it is pressed; '' for anything that is not an http address. */
export function linkHost(address) {
  try {
    const url = new URL(String(address ?? ''));
    return /^https?:$/.test(url.protocol) ? url.hostname : '';
  } catch {
    return '';
  }
}

/** True when an address is a meeting's, by its host. */
export function isMeetingLink(address, own = []) {
  const host = linkHost(address);
  return host !== '' && isMeetingHost(host, own);
}

/**
 * The first address in the texts that leads to a video meeting, or null.
 * @param {Array<string|null|undefined>} texts The event's address, place and description
 * @param {string[]} [own] The site's own meeting hosts
 */
export function meetingLinkIn(texts, own = []) {
  for (const text of texts) {
    for (const m of String(text ?? '').matchAll(/https?:\/\/[^\s<>"')\]]+/gi)) {
      const address = m[0].replace(/[.,;:!?]+$/, '');
      if (isMeetingLink(address, own)) return new URL(address).href;
    }
  }
  return null;
}
