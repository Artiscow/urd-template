/**
 * Core block: the association's contact details (type id `contact`, 0.7.24.5).
 * It draws what the Site panel holds under Contact details (site.contact, contact-model.js), so a changed phone number shows on every page at once.
 * The details are an <address> in one of the designs of CONTACT_DESIGNS: the plain lines, icon rows, a card, three tiles, a fact list, action buttons, beside a map that loads on a tap, a strip, a poster, the contact points by role, or beside a QR code that saves the contact.
 * Two options work with the designs: a button that saves the details as a contact card (vCard), and a bar docked to the bottom of a phone's screen with the call, email and map actions.
 * Each design has its narrow layout in base.css by the block's own width (a container query), so a phone and a narrow frame both get it.
 */
// ta() is only called in preview (after the admin dictionary has loaded), t() only at render: never at module level.
import { t, ta, adminLocaleReady } from '../i18n.js';
import { CONTACT_PARTS, contactDesign, siteContact, contactParts, legalParts, pointParts } from '../contact-model.js';
import { legalText } from '../footer.js';
import { iconSvg } from '../icons.js';
import { buildEmbedUrl, buildLargerMapUrl } from '../osm.js';
import { watchCspBlock } from './map.js';

const SVG_NS = 'http://www.w3.org/2000/svg';

/**
 * The block's content from the site's details: the name (the legal name, else the site's title), the address lines, the phone and email links and the legal line's parts, each only when the block shows it and the site has it; the contact points by role and the point on the map, which the roles and map designs draw.
 * The site's title stands in for the name only beside another detail, so a site without contact details shows nothing.
 * Pure; the render draws it.
 * @param {object} site
 * @param {{parts?: string[], design?: string}} props
 * @returns {{name: string, address: string[], phone: object|null, email: object|null, legal: Array<object>, points: Array<object>, geo: {lat: number, lon: number}|null, shown: string[]}|null} null when nothing would show
 */
export function contactBlockModel(site, props) {
  const shown = new Set(Array.isArray(props?.parts) ? props.parts : CONTACT_PARTS.slice(0, 4));
  const contact = siteContact(site);
  const parts = contactParts(contact) ?? { address: [], phone: null, email: null };
  const name = shown.has('name') ? contact.legalName : '';
  // The name stands once: a legal line under a shown name starts from the numbers.
  const legal = shown.has('legal') ? legalParts(contact).filter((p) => !(name && p.kind === 'name')) : [];
  const out = {
    name,
    address: shown.has('address') ? parts.address : [],
    phone: shown.has('phone') ? parts.phone : null,
    email: shown.has('email') ? parts.email : null,
    legal,
    points: contactDesign(props?.design).points ? pointParts(contact) : [],
    // The map point goes with the address; the parts the block shows travel with the model for the card and the code.
    geo: shown.has('address') ? contact.geo : null,
    shown: [...shown],
  };
  if (!out.name && !out.address.length && !out.phone && !out.email && !out.legal.length && !out.points.length) return null;
  if (!out.name && shown.has('name')) out.name = String(site?.site?.title ?? '').trim();
  return out;
}

/** An element with its class and text. */
function node(tag, className, text) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text != null) el.textContent = text;
  return el;
}

/** A link for a phone or an email, or its text when the value makes no usable link. */
function linkFor(item, className) {
  const el = node(item.href ? 'a' : 'span', className, item.label);
  if (item.href) el.href = item.href;
  return el;
}

/** One of the library's drawn icons (icons.js), hidden from assistive technology. */
function icon(id) {
  const el = node('span', 'urd-contact-icon');
  el.innerHTML = iconSvg(id) ?? '';
  return el;
}

/** An icon beside its content, the whole row a link when it has one. */
function iconRow(id, content, href) {
  const row = node(href ? 'a' : 'span', 'urd-contact-row');
  if (href) row.href = href;
  row.append(icon(id), typeof content === 'string' ? node('span', null, content) : content);
  return row;
}

/** The address as its lines kept together, or on one line. */
function addressEl(model, inline = false) {
  return node('span', 'urd-contact-address', model.address.join(inline ? ', ' : '\n'));
}

/** A small capital label over a part (the card, the tiles, the roles). */
const label = (text) => node('span', 'urd-contact-label', text);

/** The address in a map service: OpenStreetMap's search at once, and the site's own service once map-links.js is loaded (it stays outside the visitor closure). */
function directions(model, site, className, content) {
  const link = node('a', className);
  link.append(...content);
  link.target = '_blank';
  link.rel = 'noopener';
  const words = model.address.join(', ');
  link.href = `https://www.openstreetmap.org/search?query=${encodeURIComponent(words)}`;
  import('../map-links.js').then(({ mapService, mapSearchUrl }) => {
    link.href = mapSearchUrl(words, mapService(site), model.geo);
  }, () => {});
  return link;
}

/** The legal line and, before it, the extras the options add (the save button). */
function tail(target, model, extras) {
  target.append(...extras);
  if (model.legal.length) target.append(node('span', 'urd-contact-legal', legalText(model.legal)));
}

/** The plain design: the name, the address lines, the phone and the email, the legal line. */
function drawLines(box, model, extras) {
  if (model.name) box.append(node('strong', 'urd-contact-name', model.name));
  if (model.address.length) box.append(addressEl(model));
  for (const item of [model.phone, model.email]) if (item) box.append(linkFor(item, 'urd-contact-link'));
  tail(box, model, extras);
}

/** Icon rows: each detail after a drawn icon in a tinted circle. */
function drawIcons(box, model, extras) {
  if (model.name) box.append(node('strong', 'urd-contact-name', model.name));
  if (model.address.length) box.append(iconRow('map-pin', addressEl(model)));
  if (model.phone) box.append(iconRow('phone', model.phone.label, model.phone.href));
  if (model.email) box.append(iconRow('mail', model.email.label, model.email.href));
  tail(box, model, extras);
}

/** A card: a kicker and the name, the address and the ways to reach the association side by side, the legal line along the bottom. */
function drawCard(box, model, extras) {
  const head = node('span', 'urd-contact-head');
  head.append(label(t('contact.kicker')));
  if (model.name) head.append(node('strong', 'urd-contact-name', model.name));
  box.append(head);
  const cols = node('span', 'urd-contact-cols');
  if (model.address.length) {
    const visit = node('span', 'urd-contact-col');
    visit.append(label(t('contact.visit')), addressEl(model));
    cols.append(visit);
  }
  if (model.phone || model.email) {
    const reach = node('span', 'urd-contact-col');
    reach.append(label(t('contact.reach')));
    for (const item of [model.phone, model.email]) if (item) reach.append(linkFor(item, 'urd-contact-link'));
    cols.append(reach);
  }
  if (cols.children.length) box.append(cols);
  box.append(...extras);
  if (model.legal.length) box.append(node('span', 'urd-contact-foot', legalText(model.legal)));
}

/** Three tiles: visit, call and write, each a whole tile and the last two links. */
function drawTiles(box, model, extras) {
  if (model.name) box.append(node('strong', 'urd-contact-name', model.name));
  const tiles = node('span', 'urd-contact-tilegrid');
  const tile = (id, caption, content, href) => {
    const el = node(href ? 'a' : 'span', 'urd-contact-tile');
    if (href) el.href = href;
    const text = node('span', 'urd-contact-tiletext');
    text.append(label(caption), typeof content === 'string' ? node('span', 'urd-contact-value', content) : content);
    el.append(icon(id), text);
    return el;
  };
  if (model.address.length) tiles.append(tile('map-pin', t('contact.visit'), addressEl(model)));
  if (model.phone) tiles.append(tile('phone', t('contact.callUs'), model.phone.label, model.phone.href));
  if (model.email) tiles.append(tile('mail', t('contact.writeUs'), model.email.label, model.email.href));
  box.append(tiles);
  tail(box, model, extras);
}

/** A fact list: a named row for each detail between thin rules. */
function drawFacts(box, model, extras) {
  if (model.name) box.append(node('strong', 'urd-contact-name', model.name));
  const list = node('dl', 'urd-contact-factlist');
  const row = (term, content) => {
    const dd = node('dd');
    dd.append(content);
    list.append(node('dt', null, term), dd);
  };
  if (model.address.length) row(t('contact.address'), addressEl(model));
  if (model.phone) row(t('contact.phone'), linkFor(model.phone, 'urd-contact-link'));
  if (model.email) row(t('contact.email'), linkFor(model.email, 'urd-contact-link'));
  if (model.legal.length) row(t('contact.registered'), node('span', null, legalText(model.legal)));
  box.append(list);
  box.append(...extras);
}

/** Action buttons: the details as text, then call, email and directions as buttons, the first filled. */
function drawButtons(box, model, extras, site) {
  if (model.name) box.append(node('strong', 'urd-contact-name', model.name));
  if (model.address.length) box.append(addressEl(model, true));
  const numbers = [model.phone, model.email].filter(Boolean).map((item) => item.label);
  if (numbers.length) box.append(node('span', 'urd-contact-quiet', numbers.join(' · ')));
  const actions = node('span', 'urd-contact-actions');
  if (model.phone?.href) {
    const call = node('a', 'urd-contact-btn');
    call.href = model.phone.href;
    call.append(icon('phone'), node('span', null, t('contact.callUs')));
    actions.append(call);
  }
  if (model.email?.href) {
    const mail = node('a', 'urd-contact-btn');
    mail.href = model.email.href;
    mail.append(icon('mail'), node('span', null, t('contact.email')));
    actions.append(mail);
  }
  if (model.address.length) actions.append(directions(model, site, 'urd-contact-btn', [icon('map-pin'), node('span', null, t('contact.directions'))]));
  actions.append(...extras);
  box.append(actions);
  if (model.legal.length) box.append(node('span', 'urd-contact-legal', legalText(model.legal)));
}

/** Beside a map: the details with a directions link, and OpenStreetMap's map behind a cover that loads it only on a tap. */
function drawMap(box, model, extras, site, ctx) {
  const details = node('span', 'urd-contact-side');
  details.append(label(t('contact.findUs')));
  if (model.name) details.append(node('strong', 'urd-contact-name', model.name));
  if (model.address.length) details.append(addressEl(model));
  for (const item of [model.phone, model.email]) if (item) details.append(linkFor(item, 'urd-contact-link'));
  if (model.address.length) details.append(directions(model, site, 'urd-contact-go', [node('span', null, t('contact.directions')), icon('arrow-right')]));
  tail(details, model, extras);
  box.append(details);

  const figure = node('div', 'urd-contact-mapbox');
  if (model.geo) {
    const cover = node('span', 'urd-contact-mapcover');
    const show = node('button', 'urd-contact-mapbtn');
    show.type = 'button';
    show.append(icon('map-pin'), node('span', null, t('contact.showMap')));
    cover.append(show, node('span', 'urd-contact-mapnote', t('contact.mapNote')));
    show.addEventListener('click', () => {
      const frame = node('iframe', 'urd-contact-mapframe');
      frame.src = buildEmbedUrl({ ...model.geo, zoom: 16 });
      frame.title = t('map.mapTitle');
      frame.setAttribute('referrerpolicy', 'no-referrer');
      cover.replaceWith(frame);
      watchCspBlock(figure, frame, ctx, buildLargerMapUrl({ ...model.geo, zoom: 16 }));
    });
    figure.append(cover);
    box.append(figure);
  } else if (ctx.preview) {
    // Without a point the published page shows the details alone; the editor says where the point is found.
    const empty = node('span', 'urd-contact-mapcover urd-contact-mapempty');
    adminLocaleReady.then(() => { empty.textContent = ta('canvas.contactMapEmpty'); });
    figure.append(empty);
    box.append(figure);
  }
}

/** A strip: the name and every detail on one row, each after its icon, on a coloured band unless it is switched off. */
function drawStrip(box, model) {
  if (model.name) box.append(node('strong', 'urd-contact-name', model.name));
  if (model.address.length) box.append(iconRow('map-pin', model.address.join(', ')));
  if (model.phone) box.append(iconRow('phone', model.phone.label, model.phone.href));
  if (model.email) box.append(iconRow('mail', model.email.label, model.email.href));
  if (model.legal.length) box.append(node('span', 'urd-contact-legal', legalText(model.legal)));
}

/** A poster: the email and the phone in large type on the accent colour, the address and the legal line small below. */
function drawPoster(box, model, extras) {
  box.append(label(model.name ? t('contact.sayHello', { name: model.name }) : t('contact.kicker')));
  const big = node('span', 'urd-contact-big');
  for (const item of [model.email, model.phone]) if (item) big.append(linkFor(item, 'urd-contact-link'));
  box.append(big);
  const foot = node('span', 'urd-contact-foot');
  if (model.address.length) foot.append(addressEl(model, true));
  tail(foot, model, extras);
  box.append(foot);
}

/** By role: the name and the address, then each contact point with its role, its links and its note, the site's own phone and email last as the general one. */
function drawRoles(box, model, extras, site, ctx) {
  const head = node('span', 'urd-contact-head');
  if (model.name) head.append(node('strong', 'urd-contact-name', model.name));
  if (model.address.length) head.append(addressEl(model, true));
  box.append(head);
  const list = node('dl', 'urd-contact-rolelist');
  const role = (name, links, note) => {
    const item = node('div', 'urd-contact-role');
    const dd = node('dd');
    for (const link of links) if (link) dd.append(linkFor(link, 'urd-contact-link'));
    if (note) dd.append(node('span', 'urd-contact-quiet', note));
    item.append(node('dt', 'urd-contact-label', name), dd);
    list.append(item);
  };
  for (const point of model.points) role(point.role, [point.email, point.phone], point.note);
  if (model.phone || model.email) role(t('contact.general'), [model.email, model.phone], '');
  if (!model.points.length && ctx.preview) {
    const empty = node('span', 'urd-contact-empty');
    adminLocaleReady.then(() => { empty.textContent = ta('canvas.contactPointsEmpty'); });
    box.append(empty);
  }
  box.append(list);
  tail(box, model, extras);
}

/** Beside a QR code: the code holds the details as a contact card, drawn once qr.js and vcard.js are loaded (outside the visitor closure). */
function drawQr(box, model, extras, site) {
  const figure = node('figure', 'urd-contact-qrfig');
  const code = node('span', 'urd-contact-qrcode');
  figure.append(code, node('figcaption', 'urd-contact-quiet', t('contact.scan')));
  box.append(figure);
  const details = node('span', 'urd-contact-side');
  drawLines(details, model, extras);
  box.append(details);
  Promise.all([import('../qr.js'), import('../vcard.js')]).then(([qr, card]) => {
    const text = card.contactVcard(site, { url: `${location.origin}/`, compact: true, parts: model.shown });
    const matrix = text ? qr.qrMatrix(text) : null;
    if (!matrix) {
      figure.remove();
      return;
    }
    // Dark modules on white with a quiet zone of four, whatever the theme, so every camera reads it.
    const n = matrix.length + 8;
    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('viewBox', `-4 -4 ${n} ${n}`);
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', t('contact.qr'));
    svg.setAttribute('shape-rendering', 'crispEdges');
    const ground = document.createElementNS(SVG_NS, 'rect');
    for (const [k, v] of [['x', -4], ['y', -4], ['width', n], ['height', n], ['fill', '#fff']]) ground.setAttribute(k, v);
    const dots = document.createElementNS(SVG_NS, 'path');
    dots.setAttribute('d', qr.qrSvgPath(matrix));
    dots.setAttribute('fill', '#000');
    svg.append(ground, dots);
    code.append(svg);
  }).catch(() => {});
}

const DRAW = {
  lines: drawLines,
  icons: drawIcons,
  card: drawCard,
  tiles: drawTiles,
  facts: drawFacts,
  buttons: drawButtons,
  map: drawMap,
  strip: drawStrip,
  poster: drawPoster,
  roles: drawRoles,
  qr: drawQr,
};

/** The button that saves the details as a contact card, with the parts the block shows: vcard.js is fetched with the block, so a click downloads at once. */
function saveButton(site, name, model) {
  const button = node('button', 'urd-contact-save');
  button.type = 'button';
  button.append(icon('user'), node('span', null, t('contact.addContact')));
  let card = null;
  // A card that cannot be loaded takes its button with it.
  const ready = import('../vcard.js').then((mod) => { card = mod; return mod; }, () => null);
  ready.then((mod) => { if (!mod) button.remove(); });
  button.addEventListener('click', async () => {
    const mod = card ?? await ready;
    if (!mod) return;
    const text = mod.contactVcard(site, { url: `${location.origin}/`, parts: model.shown });
    if (!text) return;
    const href = URL.createObjectURL(new Blob([text], { type: 'text/vcard' }));
    const a = node('a');
    a.href = href;
    a.download = mod.vcardFileName(name);
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(href), 1000);
  });
  return button;
}

/**
 * The bar docked to the bottom of a phone's screen: call, email and the map, each when the site has it.
 * It is a manual popover, so the top layer places it over the page whatever the block's ancestors are transformed by; without the Popover API it stays fixed by its rules in base.css.
 * One bar per page: a block whose bar finds another one open leaves its own out.
 */
function dockBar(model, site) {
  const bar = node('nav', 'urd-contact-dock');
  bar.setAttribute('aria-label', t('contact.kicker'));
  bar.setAttribute('popover', 'manual');
  const action = (id, text, href) => {
    const a = node('a', 'urd-contact-dockbtn');
    a.href = href;
    a.append(icon(id), node('span', null, text));
    return a;
  };
  if (model.phone?.href) bar.append(action('phone', t('contact.call'), model.phone.href));
  if (model.email?.href) bar.append(action('mail', t('contact.email'), model.email.href));
  if (model.address.length) bar.append(directions(model, site, 'urd-contact-dockbtn', [icon('map-pin'), node('span', null, t('contact.map'))]));
  if (!bar.children.length) return null;
  requestAnimationFrame(() => {
    if (!bar.isConnected) return;
    const other = [...document.querySelectorAll('.urd-contact-dock')].find((el) => el !== bar);
    if (other) {
      bar.remove();
      return;
    }
    if (typeof bar.showPopover === 'function') bar.showPopover();
  });
  return bar;
}

export const contactBlock = {
  version: 1,
  // The height follows the content (push-model.js).
  autoGrow: true,
  label: 'Contact details',
  labelKey: 'blocks.contact',
  defaults: () => ({ parts: ['name', 'address', 'phone', 'email'], design: 'lines' }),
  migrations: {},
  /**
   * @param {HTMLElement} el
   * @param {{parts?: string[], design?: string, band?: boolean, vcard?: boolean, dock?: boolean}} props
   *   `band` (on unless false) lays the strip on a coloured band; `vcard` adds the save button to any design but the strip; `dock` adds the phone bar.
   * @param {object} ctx Render context
   */
  render(el, props, ctx) {
    const design = contactDesign(props.design).id;
    const host = node('address', `urd-contact urd-contact-${design}`);
    if (design === 'strip' && props.band !== false) host.classList.add('urd-contact-band');
    el.appendChild(host);
    const model = contactBlockModel(ctx.site, props);
    if (model) {
      const box = node('div', 'urd-contact-in');
      host.append(box);
      const name = model.name || String(ctx.site?.site?.title ?? '');
      const extras = props.vcard && design !== 'strip' ? [saveButton(ctx.site, name, model)] : [];
      DRAW[design](box, model, extras, ctx.site, ctx);
      if (props.dock && ctx.viewport === 'mobile') {
        const bar = dockBar(model, ctx.site);
        // The bar stands beside the <address>, which may not hold navigation.
        if (bar) el.appendChild(bar);
      }
    } else if (ctx.preview) {
      // Nothing to draw: the editor says where the details are typed; the published page shows nothing.
      const empty = node('span', 'urd-contact-empty');
      adminLocaleReady.then(() => { empty.textContent = ta('canvas.contactEmpty'); });
      host.append(empty);
    }

    if (Boolean(ctx.preview) && ctx.viewport !== 'mobile') {
      // The help chip (ADR-0008): where the details come from, and that they are the same everywhere.
      Promise.all([import('../hint.js'), adminLocaleReady]).then(([{ attachHint }]) => {
        if (!el.isConnected || el.querySelector('.urd-hint-chip')) return;
        attachHint(el, {
          title: ta('hintContact.title'),
          lines: [ta('hintContact.l1'), ta('hintContact.l2'), ta('hintContact.l3'), ta('hintContact.l4')],
        });
      });
    }
  },
};
