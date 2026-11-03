/**
 * Core block: product cards (the shop, the data-block pattern in ADR-0007).
 * Renders the entries of a product collection (kind "products") as cards with
 * image, badge, price (and an optional member price), size and color choices,
 * the quantity the buyer types where the product has one, and an add-to-cart button. A color choice with its own image swaps the card
 * image. The catalog is git-owned data; the cart lives with the visitor (shop.js).
 *
 * For visitors, clicking the image or title opens a quick view: the product
 * details in a native <dialog> (ADR-0011) with an image gallery, full text,
 * variant choices and a buy button - the product page without a page change
 * (the Squarespace pattern). In the editor clicks belong to editing: a
 * "+ Product" card at the end of the grid adds a new product to the collection
 * (urd-collection-add), a click on a card of the selected block opens its
 * product in the Collections panel (urd-open-entry), and a block with no
 * catalogue offers «Choose the catalogue» (urd-block-menu at its Catalogue
 * group).
 *
 * The content is structured DATA: title and text are rich text through the same
 * sanitizing as the collection block, everything else renders with textContent.
 */
import { getCollection } from '../collections.js';
import { applyEntryImageStyle } from './collection.js';
import { renderCardAnimations } from '../render.js';
import { stripActiveContent, plainText } from '../sanitize.js';
import { iconSvg } from '../icons.js';
import { readCart, writeCart, cartAdd, itemKey, variantLabel, formatPrice, quantityLimits, limitNote } from '../shop.js';
// Only called in preview (after the admin dictionary is loaded): never at module level.
import { ta, adminLocaleReady, t } from '../i18n.js';

const el2 = (tag, className, textContent) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (textContent != null) node.textContent = textContent;
  return node;
};

const post = (msg) => window.parent?.postMessage(msg, location.origin);

/** The site's page register, for a link in a product's text to a page (set by every render; the register is the site's, the same for every block). */
let pagesNow = [];

/** Rich text node (title/text) with click-and-type in preview (urd-collection-edit). */
function richNode(tag, className, entry, field, collection, editable) {
  const value = entry[field];
  if (!value && !editable) return null;
  const node = el2(tag, className);
  if (value) {
    node.innerHTML = value;
    stripActiveContent(node, pagesNow);
  } else {
    node.classList.add('urd-collection-placeholder');
    node.dataset.placeholder = ta('canvas.textPlaceholder');
  }
  if (editable) {
    node.contentEditable = 'true';
    node.classList.add('urd-collection-editable', 'urd-text');
    node.addEventListener('input', () => {
      post({ type: 'urd-collection-edit', collection, entryId: entry.id, field, value: node.innerHTML });
    });
  }
  return node;
}

/**
 * A row of choice chips (the sizes, the colours). A chip is its own choice by its place in the row, so two choices
 * that read the same stay two: the picture, the pressed chip and the preview follow the chip, never its words.
 * @param {string} className
 * @param {string[]} labels
 * @param {(index: number|null) => void} onPick The chosen chip's place, or null when the choice is cleared
 * @param {((index: number|null) => void)|null} [onPreview] The chip under the mouse, or null when the mouse leaves
 */
function choiceRow(className, labels, onPick, onPreview = null) {
  const row = el2('div', `urd-product-options ${className}`);
  let active = null;
  labels.forEach((label, index) => {
    const btn = el2('button', 'urd-product-chip', label);
    btn.type = 'button';
    btn.setAttribute('aria-pressed', 'false');
    btn.addEventListener('click', () => {
      // Clicking the active choice clears it.
      const next = active === index ? null : index;
      active = next;
      for (const other of row.querySelectorAll('.urd-product-chip')) other.setAttribute('aria-pressed', String(other === btn && next !== null));
      // A choice made answers a request for it (needChoice).
      markNeed(row, null);
      onPick(next);
    });
    // A mouse resting on a choice previews it (a colour's picture), and leaving gives the chosen one back.
    // The pointerType guard keeps a tap on a touch screen from previewing and choosing in one press.
    if (onPreview) {
      btn.addEventListener('pointerenter', (event) => { if (event.pointerType === 'mouse') onPreview(index); });
      btn.addEventListener('pointerleave', (event) => { if (event.pointerType === 'mouse') onPreview(null); });
    }
    row.appendChild(btn);
  });
  return row;
}

/** The first choice the product asks for that is still open, as the words that ask for it; null when none is. */
function openChoice(entry, rows, choice) {
  if (rows.sizes && entry.requireSize === true && choice.size == null) return t('shop.chooseSize');
  if (rows.colors && entry.requireColor === true && choice.color == null) return t('shop.chooseColor');
  return null;
}

/**
 * The buy button of a product that greys it out until its choices are made (its disableUntilChosen): unavailable
 * with the missing choice in its tooltip, and available again once none is open. aria-disabled rather than
 * disabled, so the keyboard and a screen reader still reach the button and hear why it waits.
 */
function holdBuy(buy, entry, rows, choice) {
  const open = entry.disableUntilChosen === true ? openChoice(entry, rows, choice) : null;
  buy.classList.toggle('urd-product-buy-wait', Boolean(open));
  if (open) {
    buy.setAttribute('aria-disabled', 'true');
    buy.title = open;
  } else {
    buy.removeAttribute('aria-disabled');
    buy.removeAttribute('title');
  }
}

/** A row's request for a choice: the words under its chips (read out once, role alert), or none. */
function markNeed(row, text) {
  row.classList.toggle('urd-product-missing', Boolean(text));
  let note = row.querySelector('.urd-product-need');
  if (!text) { note?.remove(); return; }
  if (!note) {
    note = el2('span', 'urd-product-need');
    note.setAttribute('role', 'alert');
    row.appendChild(note);
  }
  note.textContent = text;
}

/**
 * Whether every choice the product asks for is made (its own requireSize and requireColor, for the
 * options it has). An open one is asked for under its row, and the first takes the focus.
 * @param {{ requireSize?: boolean, requireColor?: boolean }} entry
 * @param {{ sizes: HTMLElement|null, colors: HTMLElement|null }} rows
 * @param {{ size: unknown, color: unknown }} choice
 */
function choicesMade(entry, rows, choice) {
  const asks = [
    [rows.sizes, entry.requireSize === true && choice.size == null, 'shop.chooseSize'],
    [rows.colors, entry.requireColor === true && choice.color == null, 'shop.chooseColor'],
  ];
  let first = null;
  for (const [row, open, key] of asks) {
    if (!row) continue;
    markNeed(row, open ? t(key) : null);
    if (open && !first) first = row;
  }
  first?.querySelector('.urd-product-chip')?.focus();
  return !first;
}

/** Price row: shown only when a price is set (a new product must not show "0 kr"). */
function priceRow(entry, currency) {
  if (entry.price == null) return null;
  const row = el2('div', 'urd-product-price');
  row.appendChild(el2('strong', null, formatPrice(entry.price, currency)));
  if (entry.memberPrice != null) {
    row.appendChild(el2('span', 'urd-product-member',
      t('shop.memberPrice', { price: formatPrice(entry.memberPrice, currency) })));
  }
  return row;
}

/**
 * The quantity the buyer types, for a product that has limits (its `quantity`, shop.js quantityLimits): «Quantity» with minus and plus around a number
 * field held between the least and the most, the limits told beside it, and the line's sum under it once more than one is chosen.
 * The steps use the basket's own buttons (blocks/cart.js), so the two read alike.
 * @returns {{row: HTMLElement, get: () => number}}
 */
function quantityRow(limits, price, currency) {
  const row = el2('div', 'urd-product-qty');
  const id = `urd-qty-${Math.random().toString(36).slice(2, 10)}`;
  const label = el2('label', 'urd-product-qty-label', t('shop.quantity'));
  label.htmlFor = id;
  const stepper = el2('span', 'urd-product-stepper');
  const minus = el2('button', 'urd-cart-step', '−');
  minus.type = 'button';
  minus.setAttribute('aria-label', t('shop.decrease'));
  const input = document.createElement('input');
  Object.assign(input, { id, type: 'number', inputMode: 'numeric', min: String(limits.min), max: String(limits.max), step: '1', className: 'urd-product-qty-input' });
  const plus = el2('button', 'urd-cart-step', '+');
  plus.type = 'button';
  plus.setAttribute('aria-label', t('shop.increase'));
  stepper.append(minus, input, plus);
  row.append(label, stepper);
  const words = limitNote(limits);
  if (words) row.appendChild(el2('span', 'urd-product-qty-note', t(words.key, words.vars)));
  const sum = el2('span', 'urd-product-qty-sum');
  sum.setAttribute('aria-live', 'polite');
  row.appendChild(sum);
  let qty = limits.min;
  const show = () => {
    input.value = String(qty);
    minus.disabled = qty <= limits.min;
    plus.disabled = qty >= limits.max;
    const unit = Number(price);
    sum.textContent = qty > 1 && Number.isFinite(unit) ? `${qty} × ${formatPrice(unit, currency)} = ${formatPrice(unit * qty, currency)}` : '';
  };
  const set = (value) => {
    const n = Math.trunc(Number(value));
    qty = Number.isFinite(n) ? Math.min(limits.max, Math.max(limits.min, n)) : limits.min;
    show();
  };
  minus.addEventListener('click', () => set(qty - 1));
  plus.addEventListener('click', () => set(qty + 1));
  input.addEventListener('change', () => set(input.value));
  show();
  return { row, get: () => qty };
}

/**
 * The buy button, with an «added» receipt on the press. getChoice gives the chosen size's words and the chosen colour ({name, image}) or null;
 * ready says whether the choices the product asks for are made, and asks for the open ones when not.
 * A product with quantity limits puts the quantity typed (getQty) in the basket, with the limits on its line; any other puts one.
 * A button held by holdBuy does nothing.
 */
function buyButton(entry, getChoice, ready, getQty = () => 1) {
  const buy = el2('button', 'urd-product-buy', t('shop.addToCart'));
  buy.type = 'button';
  buy.addEventListener('click', () => {
    if (buy.getAttribute('aria-disabled') === 'true') return;
    if (!ready()) return;
    const { size, color: chosen } = getChoice();
    const variant = variantLabel(size, chosen?.name ?? null);
    const limits = quantityLimits(entry);
    writeCart(cartAdd(readCart(), {
      qty: getQty(),
      min: limits?.min,
      max: limits?.max,
      key: itemKey(entry.id, variant),
      id: entry.id,
      // The title is rich text; the cart line needs plain text.
      title: plainText(entry.title),
      price: Number(entry.price) || 0,
      variant: variant || undefined,
      image: chosen?.image || entry.image || undefined,
    }));
    buy.textContent = t('shop.added');
    buy.classList.add('urd-product-added');
    setTimeout(() => {
      buy.textContent = t('shop.addToCart');
      buy.classList.remove('urd-product-added');
    }, 1400);
  });
  return buy;
}

/**
 * Quick view (visitors only): the product details in a native <dialog> with a
 * gallery (main image plus color images), rich text and its own variant choices.
 * Built on first open and reused.
 */
function openQuickView(card, entry, props) {
  let dialog = card.querySelector('.urd-product-dialog');
  if (!dialog) {
    dialog = document.createElement('dialog');
    dialog.className = 'urd-product-dialog';
    const colors = Array.isArray(entry.colors) ? entry.colors.filter((c) => c?.name) : [];
    let size = null;
    let color = null;

    const close = el2('button', 'urd-product-close');
    close.type = 'button';
    close.innerHTML = iconSvg('cross') ?? '';
    close.setAttribute('aria-label', t('shop.close'));
    close.addEventListener('click', () => dialog.close());
    dialog.appendChild(close);

    const body = el2('div', 'urd-product-dialogbody');
    const images = [entry.image, ...colors.map((c) => c.image)].filter(Boolean)
      .filter((src, i, all) => all.indexOf(src) === i);
    let mainImg = null;
    if (images.length) {
      const gallery = el2('div', 'urd-product-gallery');
      mainImg = document.createElement('img');
      mainImg.src = images[0];
      mainImg.alt = entry.imageAlt ?? '';
      gallery.appendChild(mainImg);
      if (images.length > 1) {
        const thumbs = el2('div', 'urd-product-thumbs');
        for (const src of images) {
          const thumb = document.createElement('img');
          thumb.src = src;
          thumb.alt = '';
          thumb.addEventListener('click', () => { mainImg.src = src; });
          thumbs.appendChild(thumb);
        }
        gallery.appendChild(thumbs);
      }
      body.appendChild(gallery);
    }

    const info = el2('div', 'urd-product-dialoginfo');
    if (entry.badge) info.appendChild(el2('span', 'urd-product-badge', entry.badge));
    const title = richNode('strong', 'urd-product-title', entry, 'title', props.collection, false);
    if (title) info.appendChild(title);
    const text = richNode('div', 'urd-product-text', entry, 'text', props.collection, false);
    if (text) info.appendChild(text);
    const price = priceRow(entry, props.currency);
    if (price) info.appendChild(price);
    const sizes = Array.isArray(entry.sizes) ? entry.sizes.filter(Boolean) : [];
    const rows = { sizes: null, colors: null };
    // The buy button follows every choice (holdBuy); it is set once the button stands.
    let sync = () => {};
    if (sizes.length) {
      rows.sizes = choiceRow('urd-product-sizes', sizes, (i) => { size = i; sync(); });
      info.appendChild(rows.sizes);
    }
    if (colors.length) {
      // The picture shown: the colour previewed, else the colour chosen, else the entry's own.
      const show = (i) => { if (mainImg) mainImg.src = (i == null ? null : colors[i]?.image) || images[0]; };
      rows.colors = choiceRow('urd-product-colors', colors.map((c) => c.name), (i) => {
        color = i;
        show(i);
        sync();
      }, (i) => show(i ?? color));
      info.appendChild(rows.colors);
    }
    const limits = quantityLimits(entry);
    const amount = limits ? quantityRow(limits, entry.price, props.currency) : null;
    const buy = buyButton(entry,
      () => ({ size: size == null ? null : sizes[size], color: color == null ? null : colors[color] }),
      () => choicesMade(entry, rows, { size, color }),
      () => amount?.get() ?? 1);
    sync = () => holdBuy(buy, entry, rows, { size, color });
    sync();
    info.appendChild(buyRow(amount, buy));
    body.appendChild(info);
    dialog.appendChild(body);

    // Light dismiss: a click on ::backdrop hits the dialog element itself.
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) dialog.close();
    });
    card.appendChild(dialog);
  }
  dialog.showModal();
}

function renderCard(entry, props, editable, preview) {
  const card = el2('article', 'urd-product-card');
  let chosenSize = null;
  let chosenColor = null;

  // The image: the same non-destructive styling as collection entries. A color
  // choice with its own image swaps src; with no choice the entry's main image shows.
  const baseImage = entry.image ?? '';
  let img = null;
  let wrap = null;
  if (baseImage) {
    img = document.createElement('img');
    img.src = baseImage;
    img.loading = 'lazy';
    img.draggable = false;
    wrap = el2('span', 'urd-collection-imgwrap urd-product-image');
    wrap.appendChild(img);
    applyEntryImageStyle(wrap, entry);
    card.appendChild(wrap);
  }
  if (entry.badge) {
    card.appendChild(el2('span', `urd-product-badge${img ? ' urd-product-badge-over' : ''}`, entry.badge));
  }

  const title = richNode('h3', 'urd-product-title', entry, 'title', props.collection, editable);
  if (title) card.appendChild(title);
  const text = richNode('div', 'urd-product-text', entry, 'text', props.collection, editable);
  if (text) card.appendChild(text);
  const price = priceRow(entry, props.currency);
  if (price) card.appendChild(price);

  // The choices are kept by the chip's place (choiceRow), so a picture belongs to its own chip.
  const rows = { sizes: null, colors: null };
  // The buy button follows every choice (holdBuy); it is set once the button stands.
  let sync = () => {};
  const sizes = Array.isArray(entry.sizes) ? entry.sizes.filter(Boolean) : [];
  if (sizes.length) {
    rows.sizes = choiceRow('urd-product-sizes', sizes, (i) => { chosenSize = i; sync(); });
    card.appendChild(rows.sizes);
  }

  const colors = Array.isArray(entry.colors) ? entry.colors.filter((c) => c?.name) : [];
  if (colors.length) {
    // The card's picture: the colour previewed under the mouse, else the colour chosen, else the entry's own.
    const show = (i) => { if (img) img.src = (i == null ? null : colors[i]?.image) || baseImage; };
    rows.colors = choiceRow('urd-product-colors', colors.map((c) => c.name), (i) => {
      chosenColor = i;
      show(i);
      sync();
    }, (i) => show(i ?? chosenColor));
    card.appendChild(rows.colors);
  }

  const limits = quantityLimits(entry);
  const amount = limits ? quantityRow(limits, entry.price, props.currency) : null;
  const buy = buyButton(entry,
    () => ({ size: chosenSize == null ? null : sizes[chosenSize], color: chosenColor == null ? null : colors[chosenColor] }),
    () => choicesMade(entry, rows, { size: chosenSize, color: chosenColor }),
    () => amount?.get() ?? 1);
  sync = () => holdBuy(buy, entry, rows, { size: chosenSize, color: chosenColor });
  sync();
  card.appendChild(buyRow(amount, buy));

  // Quick view for visitors: the image and the title open the detail view.
  // In the editor clicks belong to editing (click-and-type), so nothing is wired
  // there - nor in the mobile view (the preview flag, never editable).
  if (!preview) {
    // The title keeps its heading role: its words go into a button inside it, which is the opener there.
    let titleButton = null;
    if (title) {
      titleButton = el2('button', 'urd-product-titlebtn');
      titleButton.type = 'button';
      titleButton.append(...title.childNodes);
      title.append(titleButton);
    }
    for (const target of [wrap, titleButton].filter(Boolean)) {
      target.classList.add('urd-product-opener');
      if (target.tagName !== 'BUTTON') {
        target.setAttribute('role', 'button');
        target.tabIndex = 0;
      }
      // The control is named by the product, so a screen reader hears which product opens.
      target.setAttribute('aria-label', t('shop.quickViewNamed', { name: plainText(entry.title) || t('shop.quickView') }));
      const open = () => openQuickView(card, entry, props);
      target.addEventListener('click', open);
      target.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          open();
        }
      });
    }
  }
  return card;
}

/** The buy button alone, or with the quantity above it in one row of the card, so the card list's shared rows (base.css) stay as many with or without it. */
function buyRow(amount, buy) {
  if (!amount) return buy;
  const row = el2('div', 'urd-product-buyrow');
  row.append(amount.row, buy);
  return row;
}

/** The "+ Product" adder (editor only): asks the editor to add a new product to the collection. */
function adderCard(collection) {
  const btn = el2('button', 'urd-product-adder', ta('canvas.addProduct'));
  btn.type = 'button';
  btn.addEventListener('click', () => {
    post({ type: 'urd-collection-add', collection });
  });
  return btn;
}

/**
 * The editor's way from a card to its entry: once the block is selected alone, a click on a card part that is not written on the card itself (the price, the badge, the choices, the picture, the card around them) opens the product's entry in the Collections panel (urd-open-entry), with the price, the badge or the sizes focused, and else the title.
 * The title and the text keep click-and-type, the buy button keeps filling the basket, and a Shift-click, a selected set and the Clean view open nothing.
 */
function wireEntryOpening(card, el, collection, entryId) {
  let armed = false;
  card.addEventListener('pointerdown', (event) => {
    const host = el.closest('.urd-block');
    armed = Boolean(host?.classList.contains('urd-selected')) && !host.classList.contains('urd-multi-selected')
      && !document.body.classList.contains('urd-chrome-off') && !event.shiftKey;
  });
  card.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target : null;
    if (!armed || event.shiftKey || !target || target.closest('.urd-collection-editable, .urd-product-buy, .urd-product-adder')) return;
    const field = target.closest('.urd-product-price') ? 'price'
      : target.closest('.urd-product-badge') ? 'badge'
        : target.closest('.urd-product-sizes') ? 'sizes'
          : target.closest('.urd-product-colors') ? 'colors'
            : target.closest('.urd-product-qty') ? 'quantity'
              : 'title';
    post({ type: 'urd-open-entry', collection, entryId, field });
  });
}

/** The «Choose the catalogue» button of a block with none: the element menu opens at the block with its Catalogue group open. */
function chooseCatalogButton(el, ctx) {
  const btn = el2('button', 'urd-product-adder urd-product-choose', ta('canvas.productChoose'));
  btn.type = 'button';
  btn.addEventListener('click', () => {
    const r = el.getBoundingClientRect();
    post({ type: 'urd-block-menu', sectionId: ctx.section?.id, blockId: el.dataset.blockId, rect: { left: r.left, top: r.top, right: r.right, bottom: r.bottom }, group: 'product-catalog' });
  });
  return btn;
}

function emptyState(el, ctx, message, action) {
  if (!ctx.preview) return;
  const box = el2('div', 'urd-collection-empty', message);
  if (action) box.appendChild(action);
  el.appendChild(box);
}

export const productBlock = {
  version: 1,
  autoGrow: true,
  // Collection consumer: the urd-collections message re-renders only sections
  // with blocks carrying this flag (the scroll position is preserved).
  usesCollections: true,
  // Per-card animation: the block's entrance and pointer effect play per card,
  // not on the block element (render.js skips it; the cards are animated in render).
  animPerCard: true,
  label: 'Product cards',
  labelKey: 'blocks.product',
  defaults: () => ({ collection: null, limit: 0, columns: 0, currency: 'kr' }),
  migrations: {},
  /**
   * @param {HTMLElement} el
   * @param {{collection: string|null, limit?: number, columns?: number, currency?: string}} props
   * @param {object} ctx Render context
   */
  render(el, props, ctx) {
    pagesNow = ctx.site?.pages ?? [];
    const host = el2('div', 'urd-product');
    el.appendChild(host);
    const editable = Boolean(ctx.preview) && ctx.viewport !== 'mobile';
    // The block's own data: shared by the auto-grow and the animations.
    const block = ctx.section?.blocks?.find((b) => b.id === el.dataset.blockId);

    if (!props.collection) {
      // With no cards the animation fields play on the block element, as on
      // other blocks, so the choice in Properties is never inert.
      if (block) renderCardAnimations(el, [el], block, ctx);
      adminLocaleReady.then(() => {
        if (host.isConnected) emptyState(el, ctx, ta('canvas.productEmpty'), editable ? chooseCatalogButton(el, ctx) : null);
      });
      return;
    }

    // Busy while the entries are fetched: the block holds its frame's height
    // on the desktop and the height measured for the phone there (base.css),
    // and the editor's fit waits for it.
    host.setAttribute('aria-busy', 'true');
    getCollection(props.collection).then((data) => {
      // The block may have been re-rendered or removed while the data was fetched.
      if (!host.isConnected) return;
      host.removeAttribute('aria-busy');

      const all = Array.isArray(data?.entries) ? data.entries : [];
      let entries = all;
      if (props.limit > 0) entries = entries.slice(0, props.limit);
      if (!entries.length) {
        if (block) renderCardAnimations(el, [el], block, ctx);
        adminLocaleReady.then(() => {
          if (!host.isConnected) return;
          emptyState(el, ctx, ta('canvas.productNoEntries', { name: data?.name ?? props.collection }),
            editable ? adderCard(props.collection) : null);
        });
        return;
      }
      const grid = el2('div', 'urd-product-cardlist');
      // The owner's column count, which a narrow block holds to two and then one (base.css).
      const columns = Math.min(6, Math.max(0, Number(props.columns) || 0));
      if (columns) {
        grid.classList.add('urd-product-cols');
        grid.style.setProperty('--urd-product-cols', String(columns));
        grid.style.setProperty('--urd-product-cols-narrow', String(Math.min(columns, 2)));
      }
      const cards = entries.map((entry) => renderCard(entry, props, editable, Boolean(ctx.preview)));
      if (editable) cards.forEach((card, i) => wireEntryOpening(card, el, props.collection, entries[i].id));
      // The cards share their rows (base.css, subgrid); the picture's row exists only while a card has a picture.
      grid.classList.toggle('urd-product-pictures', entries.some((entry) => entry.image));
      grid.append(...cards);
      host.appendChild(grid);

      // Per-card animation (animPerCard): the block's entrance animation plays
      // per card with a staggered start, and the pointer effect lifts card by card.
      if (block) renderCardAnimations(el, cards, block, ctx);

      if (editable) {
        Promise.all([import('../hint.js'), adminLocaleReady]).then(([{ attachHint }]) => {
          if (!el.isConnected) return;
          // The adder only when the grid is not truncated by limit: a new entry
          // would otherwise fall outside the view and the click would look dead.
          if (!(props.limit > 0 && all.length >= props.limit)) {
            grid.appendChild(adderCard(props.collection));
          }
          // The help chip (ADR-0008): the catalog lives in the Collections panel.
          if (el.querySelector('.urd-hint-chip')) return;
          attachHint(el, {
            title: ta('hintProduct.title'),
            lines: [ta('hintProduct.l1'), ta('hintProduct.l2'), ta('hintProduct.l3'), ta('hintProduct.l4')],
          });
        });
      }
    });
  },
};
