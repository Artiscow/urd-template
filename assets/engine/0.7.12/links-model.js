/**
 * The site's links (site.links): the owner's own addresses, drawn by the footer, the menu's tools and the links block; pure, no DOM.
 * Notes: docs/engine-notes/links-model.md (Urd repository).
 */
import { isSafeHref, isSafeImage } from './nav-model.js';
import { ICON_LIBRARY, iconSvg } from './icons.js';

/**
 * One validated link, or null when it cannot be drawn: a library icon or own image, a safe address (isSafeHref) and a label (else the icon's, else the address).
 * @param {object} raw
 * @returns {{id: string, icon: string, image: string, label: string, url: string}|null}
 */
export function linkEntry(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const url = typeof raw.url === 'string' ? raw.url.trim() : '';
  if (!isSafeHref(url)) return null;
  const iconId = typeof raw.icon === 'string' ? raw.icon.trim() : '';
  const icon = ICON_LIBRARY[iconId] ? iconId : '';
  const image = typeof raw.image === 'string' && isSafeImage(raw.image) ? raw.image : '';
  if (!icon && !image) return null;
  const label = typeof raw.label === 'string' && raw.label.trim() ? raw.label.trim() : (icon ? ICON_LIBRARY[icon].label : url);
  return { id: typeof raw.id === 'string' ? raw.id : '', icon, image, label, url };
}

/** The site's links that can be drawn, in the owner's order. */
export function siteLinks(file) {
  return (Array.isArray(file?.site?.links) ? file.site.links : []).map(linkEntry).filter(Boolean);
}

/**
 * The links a links block draws: the site's (none with `useSite: false`, else all but those `hidden` lists by id), then the block's own.
 */
export function blockLinks(props, file) {
  const own = (Array.isArray(props?.links) ? props.links : []).map(linkEntry).filter(Boolean);
  const hidden = new Set(Array.isArray(props?.hidden) ? props.hidden : []);
  const site = props?.useSite === false ? [] : siteLinks(file).filter((link) => !hidden.has(link.id));
  return [...site, ...own];
}

/**
 * The link's picture as markup: the library's SVG, or the own image, its source quoted, with an empty alt since the link carries the name.
 */
export function linkIconHtml(link) {
  if (link.icon) return iconSvg(link.icon) ?? '';
  return `<img src="${String(link.image).replace(/&/g, '&amp;').replace(/"/g, '&quot;')}" alt="" loading="lazy">`;
}

/** Whether the address leaves the site, so the link opens in a new tab. */
export function leavesSite(url) {
  return /^https?:\/\//i.test(String(url ?? ''));
}

/**
 * Site migration 4 -> 5 on a clone: footer.social's entries with an icon join the site's links, labelled by the icon's label or id; footer.social is dropped.
 */
export function liftFooterSocial(file) {
  const social = Array.isArray(file?.footer?.social) ? file.footer.social : null;
  if (!social) return file;
  const lifted = structuredClone(file);
  lifted.site ??= {};
  const existing = Array.isArray(lifted.site.links) ? lifted.site.links : [];
  const moved = social
    .filter((s) => s && typeof s.icon === 'string' && s.icon.trim())
    .map((s, i) => ({ id: `link-${existing.length + i + 1}`, icon: s.icon.trim(), label: ICON_LIBRARY[s.icon.trim()]?.label ?? s.icon.trim(), url: typeof s.url === 'string' ? s.url.trim() : '' }));
  lifted.site.links = [...existing, ...moved];
  delete lifted.footer.social;
  return lifted;
}
