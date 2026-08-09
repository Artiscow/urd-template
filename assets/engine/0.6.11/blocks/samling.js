/**
 * Kjerneblokk: samling (datablokk-mønsteret, ADR-0007). Rendrer innslagene i en
 * samling fra content/samlinger/ med en av tre visninger: kort (responsivt grid),
 * liste (rader med dato-badge) eller arkiv (år-gruppert).
 *
 * Innholdet er strukturert DATA og rendres med textContent, aldri innerHTML.
 * Datahentingen er asynkron: render tegner skallet synkront og fyller når
 * samlingen er lastet; manglende samling gir rolig tomtilstand, aldri krasj.
 */
import { getCollection, sortEntries, groupByYear, dateBadge } from '../samlinger.js';
import { stripActiveContent } from '../sanitize.js';
import { isSafeHref } from '../nav-model.js';
// Kun kallt i preview (etter at admin-ordboka er lastet): aldri på modulnivå.
import { ta, adminLocaleReady } from '../i18n.js';

/** Redigeringskontekst mens en samling rendres i preview: {collection} eller null (besøkende). */
let editCtx = null;

const post = (msg) => window.parent?.postMessage(msg, location.origin);

/** Klikk-og-skriv på tittel/tekst rett i blokken: endringen meldes til editoren, som eier samlingsutkastet.
 *  Tittel lagres som ren tekst; innslagsteksten er rik (html: true) og lagrer sikker HTML (ADR-0007). */
function editable(node, entryId, field, html = false) {
  if (!editCtx) return node;
  node.contentEditable = 'true';
  node.classList.add('urd-samling-editable');
  const collection = editCtx.collection;
  node.addEventListener('input', () => {
    post({ type: 'urd-collection-edit', collection, entryId, field, value: html ? node.innerHTML : node.textContent });
  });
  return node;
}

/** Bilde-redigering i preview: klikk åpner den FELLES bildeeditoren med HELE paletten
 *  (dynamisk import: besøkende laster den aldri). Stilfeltene bor i entry.imageStyle (additivt). */
function wireImageEdit(target, entry) {
  if (!editCtx) return;
  const collection = editCtx.collection;
  target.classList.add('urd-samling-image-edit');
  target.title = 'Klikk for å redigere bildet';
  target.addEventListener('click', async () => {
    const { openImageEditor } = await import('../image-editor.js');
    openImageEditor(target, {
      fields: ['image', 'remove', 'alt', 'fit', 'shape', 'zoom', 'radius', 'focus', 'filters'],
      get: (field) => {
        if (field === 'image') return entry.image ?? null;
        if (field === 'alt') return entry.imageAlt ?? '';
        return (entry.imageStyle ?? {})[field];
      },
      set: (field, value) => {
        if (field === 'image') {
          post({ type: 'urd-collection-edit', collection, entryId: entry.id, field, value });
          return;
        }
        if (field === 'alt') {
          entry.imageAlt = value;
        } else {
          entry.imageStyle = { ...(entry.imageStyle ?? {}), [field]: value };
        }
        applyEntryImageStyle(target, entry);
        post({
          type: 'urd-collection-edit',
          collection,
          entryId: entry.id,
          field: field === 'alt' ? 'imageAlt' : 'imageStyle',
          value: field === 'alt' ? value : entry.imageStyle,
        });
      },
    });
  });
}

/** Innslagstekst: rik (sikker HTML-delmengde, samme vern som tekstblokker). Klassen urd-text
 *  gir den flytende teksteditoren gratis i preview. Tomme felter vises som redigerbare plassholdere. */
function textOrPlaceholder(entry) {
  if (!entry.text && !editCtx) return null;
  const node = el2('div', 'urd-text urd-samling-text');
  if (entry.text) {
    node.innerHTML = entry.text;
    stripActiveContent(node);
  } else {
    node.classList.add('urd-samling-placeholder');
    node.dataset.placeholder = 'Skriv tekst …';
  }
  return editable(node, entry.id, 'text', true);
}

function imageOrAdder(entry, className) {
  const img = imageNode(entry, className);
  if (img) {
    wireImageEdit(img, entry);
    return img;
  }
  if (!editCtx) return null;
  const adder = el2('button', 'urd-samling-image-adder', '+ Bilde');
  adder.type = 'button';
  wireImageEdit(adder, entry);
  return adder;
}

const el2 = (tag, className, textContent) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (textContent != null) node.textContent = textContent;
  return node;
};

/** Tittel: rik tekst (sikker HTML-delmengde) med full teksteditor i preview (klassen urd-text
 *  gir den flytende linjen). Med lenke rendres den som anker hos besøkende; i editoren redigeres teksten. */
function titleNode(entry) {
  // Delt vokter (nav/footer + interne stier/anker): utrygg href gir tittel uten lenke.
  const tag = entry.href && isSafeHref(entry.href) && !editCtx ? 'a' : 'strong';
  const node = el2(tag, 'urd-samling-title');
  node.innerHTML = entry.title;
  stripActiveContent(node);
  if (tag === 'a') {
    node.href = entry.href;
    return node;
  }
  node.classList.add('urd-text');
  return editable(node, entry.id, 'title', true);
}

/** Formene: rammens sideforhold. Sirkel er 1:1 med full avrunding. */
const SHAPE_ASPECTS = { wide: '16 / 9', square: '1 / 1', portrait: '3 / 4', circle: '1 / 1' };

/** Innslagsbilde med den additive stilen (imageStyle) og beskrivelsen anvendt.
 *  node er innpakningen (span med img inni) eller en frittstående img: bildet får
 *  fokus/filtre/zoom, rammen får form og avrunding og klipper zoomen (overflow). */
export function applyEntryImageStyle(node, entry) {
  const img = node instanceof HTMLImageElement ? node : node.querySelector?.('img');
  if (!img) return;
  const style = entry.imageStyle ?? {};
  const focus = `${(style.x ?? 0.5) * 100}% ${(style.y ?? 0.5) * 100}%`;
  img.alt = entry.imageAlt ?? '';
  img.style.objectFit = style.fit ?? 'cover';
  img.style.objectPosition = focus;
  const zoom = Number(style.zoom) || 1;
  img.style.transform = zoom !== 1 ? `scale(${zoom})` : '';
  img.style.transformOrigin = focus;
  const filters = [];
  if (style.brightness != null && style.brightness !== 1) filters.push(`brightness(${style.brightness})`);
  if (style.contrast != null && style.contrast !== 1) filters.push(`contrast(${style.contrast})`);
  if (style.saturate != null && style.saturate !== 1) filters.push(`saturate(${style.saturate})`);
  img.style.filter = filters.join(' ');
  node.style.borderRadius = style.shape === 'circle' ? '50%'
    : style.radius ? `var(--urd-radius-${style.radius})` : '';
  node.style.aspectRatio = SHAPE_ASPECTS[style.shape] ?? '';
  node.style.height = style.shape ? 'auto' : '';
}

function imageNode(entry, className = 'urd-samling-image') {
  if (!entry.image) return null;
  const img = document.createElement('img');
  img.src = entry.image;
  img.loading = 'lazy';
  img.draggable = false;
  const wrap = el2('span', `urd-samling-imgwrap ${className}`);
  wrap.appendChild(img);
  applyEntryImageStyle(wrap, entry);
  return wrap;
}

function badgeNode(entry) {
  const badge = dateBadge(entry.date);
  if (!badge) return null;
  const box = el2('div', 'urd-samling-badge');
  box.append(el2('strong', null, badge.day), el2('span', null, badge.month));
  return box;
}

/** Kortgrid: bilde + dato + tittel + tekst per innslag. */
function renderCards(host, entries) {
  const grid = el2('div', 'urd-samling-cards');
  for (const entry of entries) {
    const card = el2('article', 'urd-samling-card');
    const img = imageOrAdder(entry, 'urd-samling-image');
    if (img) card.appendChild(img);
    const badge = dateBadge(entry.date);
    if (badge) card.appendChild(el2('span', 'urd-samling-date', `${badge.day}. ${badge.month} ${badge.year}`));
    card.appendChild(titleNode(entry));
    const text = textOrPlaceholder(entry);
    if (text) card.appendChild(text);
    grid.appendChild(card);
  }
  host.appendChild(grid);
}

/** Liste: rad med dato-badge + tittel/tekst (ApeironLF-stilen). */
function renderList(host, entries) {
  const list = el2('div', 'urd-samling-list');
  for (const entry of entries) {
    const row = el2('article', 'urd-samling-row');
    const badge = badgeNode(entry);
    if (badge) row.appendChild(badge);
    const thumb = imageOrAdder(entry, 'urd-samling-thumb');
    if (thumb) row.appendChild(thumb);
    const body = el2('div', 'urd-samling-body');
    body.appendChild(titleNode(entry));
    const text = textOrPlaceholder(entry);
    if (text) body.appendChild(text);
    row.appendChild(body);
    list.appendChild(row);
  }
  host.appendChild(list);
}

/** Arkiv: år-overskrifter med innslagene under (publikasjoner/utgaver). */
function renderArchive(host, entries) {
  const wrap = el2('div', 'urd-samling-archive');
  for (const group of groupByYear(entries)) {
    wrap.appendChild(el2('h3', 'urd-samling-year', group.year ?? 'Uten dato'));
    const list = el2('div', 'urd-samling-list');
    for (const entry of group.entries) {
      const row = el2('article', 'urd-samling-row');
      const thumb = imageOrAdder(entry, 'urd-samling-thumb');
      if (thumb) row.appendChild(thumb);
      const body = el2('div', 'urd-samling-body');
      body.appendChild(titleNode(entry));
      const text = textOrPlaceholder(entry);
      if (text) body.appendChild(text);
      row.appendChild(body);
      list.appendChild(row);
    }
    wrap.appendChild(list);
  }
  host.appendChild(wrap);
}

const VIEWS = { cards: renderCards, list: renderList, archive: renderArchive };

function emptyState(el, ctx, message) {
  if (!ctx.preview) return;
  el.appendChild(el2('div', 'urd-samling-empty', message));
}

export const samlingBlock = {
  version: 1,
  autoGrow: true,
  label: 'Samling',
  labelKey: 'blocks.samling',
  defaults: () => ({ collection: null, view: 'cards', limit: 6, newestFirst: true }),
  migrations: {},
  /**
   * @param {HTMLElement} el
   * @param {{collection: string|null, view: string, limit: number, newestFirst: boolean}} props
   * @param {object} ctx
   */
  render(el, props, ctx) {
    const host = el2('div', 'urd-samling');
    el.appendChild(host);

    if (!props.collection) {
      emptyState(el, ctx, 'Velg samling i Egenskaper (samlinger opprettes i Samlinger-panelet)');
      return;
    }

    getCollection(props.collection).then((data) => {
      // Blokken kan være rerendret/fjernet mens dataene ble hentet.
      if (!host.isConnected) return;
      if (!data) {
        emptyState(el, ctx, `Fant ikke samlingen «${props.collection}» - sjekk Samlinger-panelet`);
        return;
      }
      let entries = sortEntries(data.entries, props.newestFirst !== false);
      if (props.limit > 0) entries = entries.slice(0, props.limit);
      if (!entries.length) {
        emptyState(el, ctx, `Samlingen «${data.name}» er tom - legg inn innslag i Samlinger-panelet`);
        return;
      }
      const view = VIEWS[props.view] ?? renderCards;
      editCtx = ctx.preview && ctx.viewport !== 'mobile' ? { collection: props.collection } : null;
      view(host, entries);
      editCtx = null;

      // Hjelpechipen (ADR-0008): blokken har spesialfunksjoner og forklarer seg selv.
      if (ctx.preview && ctx.viewport !== 'mobile') {
        // adminLocaleReady: første render kan skje før ordboka er lastet i boot.
        Promise.all([import('../hint.js'), adminLocaleReady]).then(([{ attachHint }]) => {
          if (!el.isConnected || el.querySelector('.urd-hint-chip')) return;
          attachHint(el, {
            title: ta('hintSamling.title'),
            lines: [
              ta('hintSamling.l1'),
              ta('hintSamling.l2'),
              ta('hintSamling.l3'),
              ta('hintSamling.l4'),
            ],
          });
        });
      }

      // Autovekst: samlingsinnhold er dynamisk, så rammen følger innholdet i stedet for at
      // malene gjetter en stor fast høyde. Seksjonen løftes ved behov (kun visuelt hos
      // besøkende; i editoren bokføres høyden i utkastet, som tekstblokkene gjør).
      const needed = host.scrollHeight;
      if (Math.abs(needed - el.clientHeight) > 8 && ctx.viewport !== 'mobile') {
        el.style.height = `${needed}px`;
        const sectionEl = el.closest('.urd-section');
        if (sectionEl) {
          const bottom = el.offsetTop + needed + 24;
          const current = Number.parseFloat(sectionEl.style.minHeight) || 0;
          if (bottom > current) sectionEl.style.minHeight = `${bottom}px`;
        }
        if (ctx.preview) {
          const block = ctx.section?.blocks?.find((b) => b.id === el.dataset.blockId);
          if (block && block.frames.desktop.h !== needed) {
            block.frames.desktop = { ...block.frames.desktop, h: needed };
            // KUN høyden meldes (urd-grow), aldri hele framen: ellers ville en
            // dratt blokk teleporteres tilbake til snapshotets gamle x/y.
            post({ type: 'urd-grow', sectionId: ctx.section.id, blockId: el.dataset.blockId, h: needed });
          }
        }
      }
    });
  },
};
