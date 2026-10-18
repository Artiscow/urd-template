/**
 * Which address leads to a video meeting: the services known by their host, and the hosts a site adds for a server of its own (`site.meetingHosts`, for Jitsi, Nextcloud Talk, BigBlueButton and the like, which have no host in common).
 * A host is always compared exactly, or as a subdomain of a listed host, never by a substring.
 * Pure and DOM-free; ics.js builds on it, and the editor bundles it for the list a site stores.
 */

/** The services with a host of their own. */
export const MEETING_HOSTS = [
  'zoom.us', 'teams.microsoft.com', 'teams.live.com', 'meet.google.com', 'whereby.com', 'meet.jit.si', 'webex.com',
  'meet.proton.me', 'kmeet.infomaniak.com', 'call.element.io',
];

const HOST = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+$/;

/**
 * A site's own meeting hosts as a clean list: each entry a host name («meet.example.org»), read from a host or a whole address, in lower case, without repeats.
 * Anything that is not a host with a dot in it is left out.
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
