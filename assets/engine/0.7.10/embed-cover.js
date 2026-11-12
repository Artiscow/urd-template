/**
 * The cover a third-party frame stands behind until the visitor presses it (0.7.24.1): nothing reaches the provider before the press, since its player stores in the browser as it loads, which needs consent first (ekomloven § 3-15).
 * A card in the site's own colours: the provider named in a corner, the owner's own image under it where there is one, a play button in the accent, a line saying what loading does, and a box that lets the visitor have that provider's frames load at once on this site from now on, kept in their browser per provider.
 * The video block, the map block and the contact block's map use it; the choice is stored only when the visitor ticks the box, which is the storage they asked for.
 */
import { t } from './i18n.js';
import { isSafeImage } from './nav-model.js';
import { drawPicture } from './picture.js';

/* The providers a cover names: the end of the frame's host, the id the visitor's choice is kept under, the name on the cover, and the provider's own privacy terms the privacy page links to. A new provider goes here, in `_headers`' frame-src and in the block that embeds it. */
const PROVIDERS = [
  ['youtube-nocookie.com', 'youtube', 'YouTube', 'https://policies.google.com/privacy'],
  ['youtube.com', 'youtube', 'YouTube', 'https://policies.google.com/privacy'],
  ['vimeo.com', 'vimeo', 'Vimeo', 'https://vimeo.com/privacy'],
  ['openstreetmap.org', 'openstreetmap', 'OpenStreetMap', 'https://osmfoundation.org/wiki/Privacy_Policy'],
];

/** A provider's name by its id, or the id itself for one the covers do not name. */
export function providerName(id) {
  return PROVIDERS.find(([, pid]) => pid === id)?.[2] ?? String(id);
}

/** The address of a provider's own privacy terms by its id, '' for one the covers do not name. */
export function providerPrivacyUrl(id) {
  return PROVIDERS.find(([, pid]) => pid === id)?.[3] ?? '';
}

/** Where the visitor's choice is kept: the ids of the providers whose frames load at once on this site. */
export const ALLOWED_KEY = 'urd-embeds';

/** The window's storage, or null where it cannot be had (a private window, blocked site data). */
function siteStorage() {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

/**
 * The provider of a frame's address, or null for a host no cover names.
 * @param {string} src
 * @returns {{id: string, name: string}|null}
 */
export function providerOf(src) {
  let host;
  try {
    host = new URL(src).hostname.toLowerCase();
  } catch {
    return null;
  }
  const hit = PROVIDERS.find(([end]) => host === end || host.endsWith(`.${end}`));
  return hit ? { id: hit[1], name: hit[2] } : null;
}

/**
 * The providers the visitor has let load at once, as their browser keeps them; none where nothing is kept or it cannot be read.
 * @param {Storage|null} [storage]
 * @returns {string[]}
 */
export function allowedProviders(storage = siteStorage()) {
  try {
    const list = JSON.parse(storage?.getItem(ALLOWED_KEY) ?? '[]');
    return Array.isArray(list) ? list.filter((id) => typeof id === 'string') : [];
  } catch {
    return [];
  }
}

/**
 * Lets a provider's frames load at once, or asks for the press again; the key goes when no provider is left.
 * @param {string} id
 * @param {boolean} allowed
 * @param {Storage|null} [storage]
 */
export function setProviderAllowed(id, allowed, storage = siteStorage()) {
  if (!storage) return;
  const list = new Set(allowedProviders(storage));
  if (allowed) list.add(id);
  else list.delete(id);
  try {
    if (list.size) storage.setItem(ALLOWED_KEY, JSON.stringify([...list]));
    else storage.removeItem(ALLOWED_KEY);
  } catch { /* storage refused: the next page asks again */ }
}

/** The event a cover sends when its box let a provider in, so the other covers of that provider on the page load too. */
const ALLOWED_EVENT = 'urd-embeds-allowed';

/** The play triangle, or a map pin for a map, drawn in the button's own colour. */
const MARKS = {
  video: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5l11 7-11 7z" fill="currentColor"/></svg>',
  map: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z M12 12.2a2.6 2.6 0 1 0 0-5.2 2.6 2.6 0 0 0 0 5.2z" fill="currentColor" fill-rule="evenodd"/></svg>',
};

/** How dark the owner's picture is drawn under the cover's words, so the light words read on any picture. */
export const COVER_DIM = 0.7;

/**
 * Draws the cover's picture with the owner's settings from the image editor (picture.js: the focus point, zoom, turn, look and adjustments), darkened under the cover's words.
 * @param {HTMLElement} frame The cover's picture frame (`.urd-cover-frame`) with the img inside
 * @param {object} [style] The video's `coverStyle`
 */
export function coverImageStyle(frame, style) {
  const img = frame.querySelector('img');
  if (img) drawPicture(frame, img, style ?? {}, { dim: COVER_DIM });
}

/** Numbers the covers' lines, so each button can name its own line as its description. */
let coverCount = 0;

/**
 * A frame behind its cover: the frame at once where the visitor has let its provider load or the owner chose to load it with the page (`ask: false`, the block's `askFirst`), else the cover, which makes the frame on a press.
 * The editor's preview shows the cover whenever the owner asks first, as a visitor first sees it.
 * @param {HTMLElement} host Where the cover or the frame goes (appended)
 * @param {{src: string, makeFrame: (how: {pressed: boolean}) => HTMLIFrameElement, kind?: 'video'|'map', image?: string, imageStyle?: object, preview?: boolean, ask?: boolean, extraClass?: string}} options
 *   makeFrame builds the frame when it is wanted, told whether the visitor pressed this cover (a video may start then); image is the owner's own picture for the cover, imageStyle its framing and adjustments (coverImageStyle)
 * @returns {HTMLElement} What was appended: the cover or the frame
 */
export function coverFrame(host, { src, makeFrame, kind = 'video', image, imageStyle, preview = false, ask = true, extraClass }) {
  const provider = providerOf(src);
  if (!provider || !ask || (!preview && allowedProviders().includes(provider.id))) {
    const frame = makeFrame({ pressed: false });
    host.append(frame);
    return frame;
  }
  const pictured = isSafeImage(image);
  const cover = document.createElement('div');
  cover.className = ['urd-cover', extraClass, pictured ? 'urd-cover-pic' : ''].filter(Boolean).join(' ');
  if (pictured) {
    const frame = document.createElement('span');
    frame.className = 'urd-cover-frame';
    const picture = document.createElement('img');
    picture.className = 'urd-cover-img';
    picture.src = image;
    picture.alt = '';
    picture.loading = 'lazy';
    frame.append(picture);
    coverImageStyle(frame, imageStyle);
    cover.append(frame);
  }
  const name = document.createElement('span');
  name.className = 'urd-cover-provider';
  name.textContent = provider.name;
  const play = document.createElement('button');
  play.type = 'button';
  play.className = 'urd-cover-play';
  play.setAttribute('aria-label', t(`cover.play.${kind}`, { provider: provider.name }));
  play.innerHTML = MARKS[kind] ?? MARKS.video;
  const note = document.createElement('p');
  note.className = 'urd-cover-note';
  note.textContent = t(`cover.note.${kind}`, { provider: provider.name });
  // The line describes the button, also where a small cover leaves it out (base.css).
  note.id = `urd-cover-note-${++coverCount}`;
  play.setAttribute('aria-describedby', note.id);
  const always = document.createElement('label');
  always.className = 'urd-cover-always';
  const box = document.createElement('input');
  box.type = 'checkbox';
  const words = document.createElement('span');
  words.textContent = t('cover.always', { provider: provider.name });
  always.append(box, words);
  // The words and the box come before the button in reading and keyboard order, since the press takes the cover away; base.css draws the button above them.
  cover.append(name, note, always, play);

  const controller = new AbortController();
  const load = (pressed) => {
    controller.abort();
    if (!cover.isConnected) return;
    const frame = makeFrame({ pressed });
    // The focus on the cover's button goes on to the player, never down to the page's start.
    const focused = cover.contains(document.activeElement);
    cover.replaceWith(frame);
    if (focused) frame.focus();
  };
  play.addEventListener('click', () => {
    // This cover loads as pressed first, which also stops it hearing its own word to the others.
    // In the editor's preview the press loads the frame for the owner, and the box keeps nothing: the admin shares the site's origin, so a choice kept there would load the provider at once on the owner's own visits.
    const allow = box.checked && !preview;
    load(true);
    if (allow) {
      setProviderAllowed(provider.id, true);
      window.dispatchEvent(new CustomEvent(ALLOWED_EVENT, { detail: provider.id }));
    }
  }, { signal: controller.signal });
  // The visitor let this provider in on another cover: this one loads too. Never in the preview, where every cover stays as a visitor first sees it.
  if (!preview && typeof window !== 'undefined') {
    window.addEventListener(ALLOWED_EVENT, (e) => {
      if (e.detail === provider.id) load(false);
    }, { signal: controller.signal });
  }
  host.append(cover);
  return cover;
}
