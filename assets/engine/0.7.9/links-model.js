/**
 * The site's links (site.links, from 0.7.0.52): the owner's own addresses
 * with an icon, registered once in the admin's Site panel and drawn by the
 * footer, the menu's tools and the links block. Pure and node-tested; the
 * DOM is built where each is drawn.
 */
import { isSafeHref, isSafeImage } from './nav-model.js';
import { ICON_LIBRARY, iconSvg } from './icons.js';

/**
 * One link, validated: an icon from the library or an own image, a label
 * and a safe address (http(s), mailto, tel, or a path or anchor of the site,
 * the block href's rule). Null when it cannot be drawn. The label falls back to
 * the icon's brand name, then to the address, so every link has an
 * accessible name.
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
 * The links a links block draws: the site's (unless the block leaves them
 * all out with `useSite: false`, or some of them by id in `hidden`) followed
 * by the block's own, so an extra link that belongs to one block alone never
 * shuts the site's out.
 */
export function blockLinks(props, file) {
  const own = (Array.isArray(props?.links) ? props.links : []).map(linkEntry).filter(Boolean);
  const hidden = new Set(Array.isArray(props?.hidden) ? props.hidden : []);
  const site = props?.useSite === false ? [] : siteLinks(file).filter((link) => !hidden.has(link.id));
  return [...site, ...own];
}

/**
 * The link's picture as markup: the library's drawn SVG, or the own image
 * (a safe source, quoted for the attribute) with an empty alt, since the
 * link carries the name.
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
 * The site migration 4 -> 5: the footer's social links (footer.social, the
 * icon and the address) become the site's links with the icon's brand name
 * as the label, and the footer field is dropped. Pure: the file is cloned.
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
