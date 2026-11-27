/**
 * The calendar block's event card: an event or the announcement in full, in a dialog laid over its calendar, loaded when idle or at the first press.
 * Notes: docs/engine-notes/blocks/calendar-card.md (Urd repository).
 */
import { t } from '../i18n.js';
import { iconSvg } from '../icons.js';
import { safeHtmlFragment } from '../sanitize.js';

/** An element with its class and its content. */
const el2 = (tag, className, content) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (content instanceof Node) node.appendChild(content);
  else if (content != null) node.textContent = content;
  return node;
};

/** The feed's description: markup from the feed with everything active stripped, or plain text with its links. */
function descriptionNode(description, ui) {
  const box = ui.field('div', 'description', '', 'urd-cal-dialog-text');
  if (/<[a-z][^>]*>/i.test(description)) {
    // A feed's HTML is somebody else's markup: only what the allowlist keeps is drawn.
    box.appendChild(safeHtmlFragment(description));
  } else {
    ui.linkedText(box, description);
  }
  return box;
}

/**
 * The card wears the card design the block names (calCardDress): its set, its card classes, and the owner's colour slots copied from the block where they apply.
 */
function dressDialog(dialog, from) {
  const host = from?.closest?.('.urd-cal');
  if (!host) return;
  const set = host.dataset.cardSet ?? [...host.classList].find((name) => name.startsWith('urd-cal-set-'))?.slice('urd-cal-set-'.length);
  if (set) dialog.classList.add(`urd-cal-set-${set}`);
  for (const name of (host.dataset.cardClasses ?? '').split(' ').filter(Boolean)) dialog.classList.add(name);
  if (host.dataset.cardColours === 'off') return;
  for (const name of host.style) if (name.startsWith('--urd-cal-s-') || name === '--urd-cal-accent-text') dialog.style.setProperty(name, host.style.getPropertyValue(name));
}

/** The open cards, each with the event or announcement it was opened from. */
const OPEN_CARDS = new Map();

/** Closes a card whose event has left the page: its calendar has been drawn again under it. */
export function closeOrphanCards() {
  for (const [dialog, from] of OPEN_CARDS) {
    if (!from?.isConnected) dialog.close();
  }
}

/** A card's close button. */
function closeButton(dialog) {
  const close = el2('button', 'urd-cal-dialog-close');
  close.type = 'button';
  close.setAttribute('aria-label', t('calendar.close'));
  close.innerHTML = iconSvg('cross') || '';
  if (!close.firstChild) close.textContent = '×';
  close.addEventListener('click', () => dialog.close('escape'));
  return close;
}

export function showEventDialog(occ, from, ics, ui, props) {
  const dialog = el2('dialog', 'urd-cal-dialog');
  dressDialog(dialog, from);
  const close = closeButton(dialog);
  const start = new Date(occ.start);
  const when = ui.field('span', 'date', ui.dateLine(start, true), 'urd-cal-dialog-date', start);
  const title = ui.field('h3', 'title', occ.title, 'urd-cal-dialog-title');
  title.id = `urd-cal-dlg-${Math.random().toString(36).slice(2, 10)}`;
  dialog.setAttribute('aria-labelledby', title.id);
  if (occ.cancelled) title.classList.add('urd-cal-cancelled');
  dialog.append(close, when, title);
  const facts = el2('dl', 'urd-cal-dialog-facts');
  const fact = (key, value) => {
    const term = el2('dt');
    term.appendChild(ui.tx(key));
    const def = el2('dd');
    def.appendChild(value);
    facts.append(term, def);
  };
  fact('when', ui.field('span', 'time', ui.timeText(occ)));
  if (!occ.location && occ.geo) {
    // Coordinates without a place in words: the map itself is the place.
    const onMap = ui.link('urd-cal-place-link', 'onMap', ui.mapUrl('', occ.geo), '');
    onMap.target = '_blank';
    onMap.rel = 'noopener';
    fact('where', onMap);
  }
  if (occ.location) {
    fact('where', ui.field('span', 'place', occ.location));
  }
  // The calendar's organizer from the site's registry.
  if (occ.calendarOrganizer) fact('organizer', el2('span', 'urd-cal-dialog-organizer', occ.calendarOrganizer));
  dialog.appendChild(facts);
  const meta = el2('div', 'urd-cal-dialog-meta');
  const chip = ui.chip(occ);
  if (chip) meta.appendChild(chip);
  const rec = ui.recurring(occ);
  if (rec) meta.appendChild(rec);
  if (meta.children.length) dialog.appendChild(meta);
  const src = ui.image(occ, 1000);
  if (src) {
    const img = document.createElement('img');
    img.className = 'urd-cal-dialog-img';
    img.alt = '';
    img.addEventListener('error', () => img.remove());
    img.src = src;
    dialog.appendChild(img);
  }
  // The feed's HTML description when it has one, else the plain one.
  if (occ.descriptionHtml || occ.description) dialog.appendChild(descriptionNode(occ.descriptionHtml || occ.description, ui));
  // The calendar's own words and page, from the site's registry.
  if (occ.calendarDescription || occ.calendarLink) {
    const about = el2('div', 'urd-cal-dialog-source');
    if (occ.calendarDescription) about.appendChild(el2('p', 'urd-cal-dialog-source-text', occ.calendarDescription));
    if (occ.calendarLink) {
      const more = el2('a', 'urd-cal-dialog-link');
      more.href = occ.calendarLink;
      more.target = '_blank';
      more.rel = 'noopener';
      more.appendChild(ui.tx('moreAbout', null, { name: occ.calendar || occ.calendarOrganizer || '' }));
      about.appendChild(ui.editLink(more));
    }
    dialog.appendChild(about);
  }
  const actions = el2('div', 'urd-cal-dialog-actions');
  // The card shows the sign-up when the block does («Show sign-up button»).
  if (occ.signup && !occ.cancelled && props.showSignup === true) {
    const signup = ui.link('urd-cal-dialog-primary', 'signup', occ.signup, ui.hosted(t('calendar.signupTitle'), occ.signup));
    signup.target = '_blank';
    signup.rel = 'noopener';
    actions.appendChild(signup);
  }
  const meeting = occ.cancelled ? null : ics.meetingLinkOf(occ, ui.meetingHosts);
  if (meeting) {
    const join = ui.link('urd-cal-dialog-primary', 'join', meeting, ui.hosted('', meeting));
    join.target = '_blank';
    join.rel = 'noopener';
    actions.appendChild(join);
  }
  // «Add to calendar» is left out of a cancelled event's card, and of every card when the owner switched it off (showAdd).
  if (!occ.cancelled && props.showAdd !== false) {
    // The moment itself, when the times are shown on the site's own clock.
    const shift = occ.real != null ? occ.start - occ.real : 0;
    const real = { ...occ, start: occ.start - shift, end: Number.isFinite(occ.end) ? occ.end - shift : occ.end };
    // «Add to calendar» opens the ways to do it: this one event (to Google, or as a file), or the whole calendar (a subscription and its iCal address).
    const add = el2('details', 'urd-cal-dialog-add');
    const summary = el2('summary', 'urd-cal-dialog-link');
    summary.appendChild(ui.tx('addEvent'));
    const choices = el2('div', 'urd-cal-dialog-choices');
    const one = el2('span', 'urd-cal-dialog-choice-label');
    one.appendChild(ui.tx('addOne'));
    const google = ui.link('urd-cal-dialog-link', 'addGoogle', ics.googleEventUrl(real), '');
    google.target = '_blank';
    google.rel = 'noopener';
    const file = ui.link('urd-cal-dialog-link', 'addFile', URL.createObjectURL(new Blob([ics.eventIcs(real)], { type: 'text/calendar' })), '');
    file.download = `${String(occ.title || 'event').replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '').slice(0, 60) || 'event'}.ics`;
    choices.append(one, google, file);
    // The whole calendar is offered with the block's subscribe button on, as on the calendar itself.
    const feeds = props.showSubscribe === false ? [] : ui.sources.filter((source) => source.subscribable).map((source) => ics.subscribeLinks(source.url)).filter(Boolean);
    if (feeds.length) {
      const whole = el2('span', 'urd-cal-dialog-choice-label');
      whole.appendChild(ui.tx('addWhole'));
      choices.appendChild(whole);
      for (const links of feeds) {
        choices.appendChild(ui.link('urd-cal-dialog-link', 'subscribe', links.webcal, t('calendar.subscribeTitle')));
        // The calendar's own address, to paste into a calendar app by hand.
        const row = el2('label', 'urd-cal-dialog-address');
        row.appendChild(ui.tx('icalAddress'));
        const field = el2('input');
        field.type = 'text';
        field.readOnly = true;
        field.value = links.webcal.replace(/^webcal:/, 'https:');
        field.addEventListener('focus', () => field.select());
        row.appendChild(field);
        choices.appendChild(row);
      }
    }
    add.append(summary, choices);
    actions.appendChild(add);
    dialog.addEventListener('close', () => URL.revokeObjectURL(file.href));
  }
  dialog.appendChild(actions);
  // The card design the block wears, when a module lends it (calCardDesign): its decorator adds its own parts to the card.
  ui.dressCard?.(dialog, occ);
  openCard(dialog, from);
}

/** The announcement in full: its label, title and whole text, and the link to its address, in a card like an event's. */
export function showNoticeDialog(from, ui, href) {
  const dialog = el2('dialog', 'urd-cal-dialog urd-cal-dialog-notice');
  dressDialog(dialog, from);
  dialog.appendChild(closeButton(dialog));
  const label = ui.line(el2('span', 'urd-cal-dialog-date'), 'noticeLabel');
  const title = ui.line(el2('h3', 'urd-cal-dialog-title'), 'noticeTitle');
  const text = ui.line(el2('div', 'urd-cal-dialog-text'), 'noticeText');
  for (const part of [label, title, text]) if (part) dialog.appendChild(part);
  if (title) {
    title.id = `urd-cal-dlg-${Math.random().toString(36).slice(2, 10)}`;
    dialog.setAttribute('aria-labelledby', title.id);
  } else {
    dialog.setAttribute('aria-label', t('calendar.noticeLabel'));
  }
  if (href) {
    const actions = el2('div', 'urd-cal-dialog-actions');
    actions.appendChild(ui.noticeOn(ui.link('urd-cal-dialog-primary', 'moreInfo', href, '')));
    dialog.appendChild(actions);
  }
  openCard(dialog, from);
}

/**
 * Opens a card over the calendar it was opened from (`from`, the event or the announcement), and gives the focus back to it when the card closes.
 */
function openCard(dialog, from) {
  // The card is a dialog that is not modal: the page scrolls under it, and Escape or a press outside it closes it.
  // One card is open at a time.
  for (const other of document.querySelectorAll('dialog.urd-cal-dialog[open]')) other.close();
  const watch = new AbortController();
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    event.preventDefault();
    dialog.close('escape');
  }, { signal: watch.signal });
  // A press outside the card closes it, except in the canvas's colour picker and menus, which work on its words.
  document.addEventListener('pointerdown', (event) => {
    if (dialog.contains(event.target) || event.target.closest?.('.urd-cp, .urd-dd-menu')) return;
    dialog.close();
  }, { capture: true, signal: watch.signal });
  OPEN_CARDS.set(dialog, from);
  dialog.addEventListener('close', () => {
    OPEN_CARDS.delete(dialog);
    watch.abort();
    // The focus goes back to what opened the card when the card held it or Escape closed it; a press elsewhere keeps what it pressed.
    const back = dialog.returnValue === 'escape' || dialog.contains(document.activeElement);
    dialog.remove();
    if (back && from?.isConnected) from.focus({ preventScroll: true });
  });
  // The card opens in the part of the page in view, below the room a menu that stays on screen keeps (scroll-padding-top), so opening it never scrolls the page.
  const clear = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
  dialog.style.left = `${window.scrollX + 8}px`;
  dialog.style.top = `${window.scrollY + clear + 8}px`;
  document.body.appendChild(dialog);
  dialog.show();
  placeOverCalendar(dialog, from);
}

/** The card's widest width in px. */
const CARD_MAX_W = 460;

/** Moves a positioned element so its box lands at (left, top) in the window: written, measured, and set right by what it missed, a few times at most. */
function placeAt(node, left, top, scale) {
  for (let i = 0; i < 3; i++) {
    const rect = node.getBoundingClientRect();
    const dx = left - rect.left;
    const dy = top - rect.top;
    if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) return;
    node.style.left = `${(parseFloat(node.style.left) || 0) + dx / scale}px`;
    node.style.top = `${(parseFloat(node.style.top) || 0) + dy / scale}px`;
  }
}

/** Lays the card over the part of its calendar in view, at the calendar's zoom, never wider than the window nor over the navigation bar. */
function placeOverCalendar(dialog, from) {
  const host = from?.closest?.('.urd-cal');
  if (!host) return;
  const place = () => {
    const box = host.getBoundingClientRect();
    const zoom = parseFloat(host.style.zoom) || 1;
    dialog.style.zoom = zoom === 1 ? '' : String(zoom);
    // The navigation bar's height, when it stays at the top of the window.
    const nav = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--urd-nav-h')) || 0;
    const roof = nav + 8;
    const floor = window.innerHeight - 8;
    // The card's own width at the calendar's size, never wider than the window.
    const cssWidth = Math.min(CARD_MAX_W, (window.innerWidth - 16) / zoom);
    dialog.style.width = `${cssWidth}px`;
    const rect = dialog.getBoundingClientRect();
    // How far the card moves on the screen for one CSS pixel of its place.
    const scale = rect.width / cssWidth || zoom;
    // The centre of the part of the calendar in view, or of the whole calendar when none of it is.
    const shownTop = Math.max(roof, box.top);
    const shownBottom = Math.min(floor, box.bottom);
    const centreY = shownBottom > shownTop ? (shownTop + shownBottom) / 2 : box.top + box.height / 2;
    const left = Math.max(8, Math.min(window.innerWidth - rect.width - 8, box.left + (box.width - rect.width) / 2));
    const top = rect.height > floor - roof ? roof : Math.max(roof, Math.min(floor - rect.height, centreY - rect.height / 2));
    placeAt(dialog, left, top, scale);
  };
  const watch = new AbortController();
  window.addEventListener('resize', place, { signal: watch.signal });
  dialog.addEventListener('toggle', place, { capture: true, signal: watch.signal });
  dialog.addEventListener('close', () => watch.abort());
  place();
}
