/**
 * The menu's link launcher (nav.launcher): its button with the shortcut grid on the desktop, and its section in the phone menu, loaded where the site shows it.
 * Notes: docs/engine-notes/nav-launcher.md (Urd repository).
 */
import { launcherVars, linkAttrs } from './nav-model.js';
import { iconSvg } from './icons.js';
import { t } from './i18n.js';

const svg = (path) =>
  `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${path}</svg>`;
const GRID = svg('<g fill="currentColor" stroke="none"><circle cx="6" cy="6" r="1.6"/><circle cx="12" cy="6" r="1.6"/><circle cx="18" cy="6" r="1.6"/><circle cx="6" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="18" cy="12" r="1.6"/><circle cx="6" cy="18" r="1.6"/><circle cx="12" cy="18" r="1.6"/><circle cx="18" cy="18" r="1.6"/></g>');
/** The launcher button's anchor name; one launcher per page, so one name. */
const LAUNCHER_ANCHOR = '--urd-nav-launcher';

/**
 * The launcher's shortcuts as one list of tiles, the same markup for each design (`view`); a long name is cut with an ellipsis or folded (`longNames`).
 * @param {Array<{label: string, href: string, external: boolean, icon: string, image: string}>} links
 * @param {string} view One of LAUNCHER_VIEWS
 * @param {'cut'|'wrap'} [longNames]
 * @returns {HTMLUListElement}
 */
function launcherTiles(links, view, longNames = 'cut') {
  const ul = document.createElement('ul');
  ul.className = `urd-nav-launcher-grid urd-nav-launcher-view-${view} urd-nav-launcher-names-${longNames}`;
  for (const link of links) {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.className = 'urd-nav-launcher-link';
    Object.assign(a, linkAttrs(link));
    // A target that is not a usable link points at '#': the tile is there, drawn as the unfinished row it is.
    if (link.missing) a.classList.add('urd-nav-launcher-missing');
    const drawn = link.image ? '' : iconSvg(link.icon);
    if (link.image || drawn) {
      const mark = document.createElement('span');
      mark.className = 'urd-nav-launcher-icon';
      if (link.image) {
        a.classList.add('urd-nav-launcher-photo');
        const img = document.createElement('img');
        img.src = link.image;
        img.alt = '';
        mark.appendChild(img);
      } else {
        mark.innerHTML = drawn;
      }
      a.appendChild(mark);
    } else {
      a.classList.add('urd-nav-launcher-bare');
    }
    const label = document.createElement('span');
    label.className = 'urd-nav-launcher-name';
    label.textContent = link.label;
    if (longNames === 'cut' && link.label) a.title = link.label;
    a.appendChild(label);
    li.appendChild(a);
    ul.appendChild(li);
  }
  return ul;
}

/**
 * The heading above the tiles: the owner's own words, or the translated default.
 * Off with showTitle false.
 * @param {{titleShow: boolean, title: string}} model
 * @returns {HTMLSpanElement|null}
 */
function launcherTitle(model) {
  if (!model.titleShow) return null;
  const title = document.createElement('span');
  title.className = 'urd-nav-launcher-title';
  title.textContent = model.title || t('nav.launcher');
  return title;
}

/**
 * The link launcher's opener: a button (the owner's mark, an icon or the grid) with the link grid, an anchored popover where supported, else a disclosure.
 * @param {object} model The model from launcherModel
 * @param {AbortSignal} signal
 * @returns {{el: HTMLElement, btn: HTMLButtonElement, isOpen: () => boolean, close: () => void}}
 */
export function buildLauncher(model, signal) {
  const wrap = document.createElement('span');
  wrap.className = 'urd-nav-launcher-wrap';
  const btn = document.createElement('button');
  btn.className = 'urd-nav-launcher-btn';
  btn.type = 'button';
  const name = model.title || t('nav.launcher');
  btn.setAttribute('aria-label', name);
  // The owner's own mark comes first, then a chosen icon, and the nine dots are what stands there until one of them is set.
  btn.innerHTML = model.image ? '' : (iconSvg(model.icon) || GRID);
  const label = document.createElement('span');
  label.className = 'urd-nav-tool-label';
  label.textContent = name;
  btn.appendChild(label);
  if (model.image) {
    const img = document.createElement('img');
    img.className = 'urd-nav-launcher-btn-img';
    img.src = model.image;
    img.alt = '';
    btn.prepend(img);
  }
  const grid = document.createElement('div');
  grid.className = 'urd-nav-launcher';
  grid.id = 'urd-nav-launcher';
  for (const [name, value] of Object.entries(launcherVars(model))) grid.style.setProperty(name, value);
  const title = launcherTitle(model);
  if (title) grid.appendChild(title);
  grid.appendChild(launcherTiles(model.links, model.view, model.longNames));
  btn.setAttribute('aria-controls', grid.id);
  btn.setAttribute('aria-expanded', 'false');
  wrap.append(btn, grid);

  const native = 'popover' in HTMLElement.prototype
    && CSS.supports('anchor-name: --urd')
    && CSS.supports('position-try-fallbacks: flip-block');
  if (native) {
    btn.style.setProperty('anchor-name', LAUNCHER_ANCHOR);
    btn.setAttribute('popovertarget', grid.id);
    grid.popover = 'auto';
    grid.style.setProperty('position-anchor', LAUNCHER_ANCHOR);
    // Light dismiss, Escape and the focus return are the browser's; the expanded state is the one thing the popover does not tell assistive technology by itself.
    grid.addEventListener('toggle', (event) => {
      btn.setAttribute('aria-expanded', String(event.newState === 'open'));
    }, { signal });
    // Escape belongs to the browser here, so the grid reports itself closed to the nav's own Escape handling.
    const hide = () => { if (grid.matches(':popover-open')) grid.hidePopover(); };
    closeOnLink(grid, hide, signal);
    return { el: wrap, btn, isOpen: () => false, close: hide };
  }

  const close = () => {
    wrap.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
  };
  btn.addEventListener('click', () => {
    const open = !wrap.classList.contains('open');
    wrap.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
  }, { signal });
  // Tabbing out of the grid closes it, while a press inside, which can move focus to the body, is let through.
  let pressing = false;
  wrap.addEventListener('pointerdown', () => { pressing = true; }, { signal });
  for (const type of ['pointerup', 'pointercancel']) {
    document.addEventListener(type, () => { pressing = false; }, { signal });
  }
  wrap.addEventListener('focusout', (event) => {
    if (pressing) return;
    if (!wrap.contains(event.relatedTarget)) close();
  }, { signal });
  closeOnLink(grid, close, signal);
  return { el: wrap, btn, isOpen: () => wrap.classList.contains('open'), close };
}

/** A shortcut followed from the launcher's grid closes it, so a shortcut to a spot on this page shows the spot. */
function closeOnLink(grid, close, signal) {
  grid.addEventListener('click', (event) => {
    if (!event.defaultPrevented && event.target.closest('a[href]')) close();
  }, { signal });
}

/**
 * The launcher's shortcuts as a section at the foot of the phone menu list: the first `mobileMax`, the rest in a native <details> that opens in place.
 * @param {object} launcher The model from launcherModel
 * @returns {HTMLLIElement}
 */
export function launcherRow(launcher) {
  const row = document.createElement('li');
  row.className = 'urd-nav-launcher-row';
  for (const [name, value] of Object.entries(launcherVars(launcher))) row.style.setProperty(name, value);
  const title = launcherTitle(launcher);
  if (title) row.appendChild(title);
  const max = launcher.mobileMax;
  row.appendChild(launcherTiles(launcher.links.slice(0, max), launcher.mobileView, launcher.longNames));
  if (launcher.links.length > max) {
    const more = document.createElement('details');
    more.className = 'urd-nav-launcher-more';
    const summary = document.createElement('summary');
    summary.innerHTML = `<span class="urd-nav-launcher-more-open">${t('nav.launcherMore')}</span>`
      + `<span class="urd-nav-launcher-more-shut">${t('nav.launcherLess')}</span>`;
    more.append(summary, launcherTiles(launcher.links.slice(max), launcher.mobileView, launcher.longNames));
    row.appendChild(more);
  }
  return row;
}
