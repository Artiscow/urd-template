/**
 * Core block: basket, a button with a count badge opening a native `<dialog>` drawer of the basket in localStorage (shop.js), following urd-cart-change.
 * Notes: docs/engine-notes/blocks/cart.md (Urd repository).
 */
import { readCart, writeCart, cartSetQty, cartRemove, cartCount, cartTotal, formatPrice, onCartChange, lineLimits, limitNote } from '../shop.js';
import { iconSvg } from '../icons.js';
import { isSafeHref, resolveLink } from '../nav-model.js';
// Only called in preview (after the admin dictionary has loaded): never at module level.
import { ta, adminLocaleReady, t } from '../i18n.js';

const el2 = (tag, className, textContent) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (textContent != null) node.textContent = textContent;
  return node;
};

/** The drawer content is rebuilt when it opens and on every basket change. */
function renderDrawer(body, props, currency) {
  body.textContent = '';
  const items = readCart();
  if (!items.length) {
    body.appendChild(el2('p', 'urd-cart-empty', t('shop.cartEmpty')));
    return;
  }
  const list = el2('div', 'urd-cart-lines');
  for (const item of items) {
    const row = el2('div', 'urd-cart-line');
    if (item.image) {
      const img = document.createElement('img');
      img.src = item.image;
      img.alt = '';
      img.className = 'urd-cart-thumb';
      row.appendChild(img);
    }
    const info = el2('div', 'urd-cart-info');
    info.appendChild(el2('strong', null, item.title));
    if (item.variant) info.appendChild(el2('span', 'urd-cart-variant', item.variant));
    // A line with its product's limits tells them, and its steps stop there.
    const limits = lineLimits(item);
    const words = limitNote(limits);
    if (words) info.appendChild(el2('span', 'urd-cart-limit', t(words.key, words.vars)));
    row.appendChild(info);

    const qty = el2('div', 'urd-cart-count');
    const minus = el2('button', 'urd-cart-step', '−');
    minus.type = 'button';
    minus.setAttribute('aria-label', t('shop.decrease'));
    minus.addEventListener('click', () => writeCart(cartSetQty(readCart(), item.key, item.qty - 1)));
    const count = el2('span', 'urd-cart-number', String(item.qty));
    const plus = el2('button', 'urd-cart-step', '+');
    plus.type = 'button';
    plus.setAttribute('aria-label', t('shop.increase'));
    plus.addEventListener('click', () => writeCart(cartSetQty(readCart(), item.key, item.qty + 1)));
    // The minus at the least waits, where a line without one would leave the basket; the remove button still takes it out.
    minus.disabled = limits.min > 1 && item.qty <= limits.min;
    plus.disabled = item.qty >= limits.max;
    qty.append(minus, count, plus);
    row.appendChild(qty);

    row.appendChild(el2('span', 'urd-cart-linetotal', formatPrice(item.price * item.qty, currency)));
    const remove = el2('button', 'urd-cart-remove', '');
    remove.type = 'button';
    remove.innerHTML = iconSvg('cross') ?? '';
    remove.setAttribute('aria-label', t('shop.remove'));
    remove.addEventListener('click', () => writeCart(cartRemove(readCart(), item.key)));
    row.appendChild(remove);
    list.appendChild(row);
  }
  body.appendChild(list);
  body.appendChild(emptyRow(body));

  const foot = el2('div', 'urd-cart-total');
  foot.appendChild(el2('span', null, t('shop.total')));
  foot.appendChild(el2('strong', null, formatPrice(cartTotal(items), currency)));
  body.appendChild(foot);

  // The checkout link only through the shared safe-URL gate.
  if (isSafeHref(props.href)) {
    const checkout = el2('a', 'urd-cart-checkout', t('shop.checkout'));
    checkout.href = props.href.trim();
    body.appendChild(checkout);
  }
}

/**
 * «Empty the basket» under the lines, asking once in its own place: «Empty it» empties the basket, «Keep it» puts the button back with the focus on it.
 * @param {HTMLElement} body The drawer's body, rebuilt on every basket change
 */
function emptyRow(body) {
  const row = el2('div', 'urd-cart-emptyrow');
  const ask = () => {
    row.textContent = '';
    row.appendChild(el2('span', 'urd-cart-emptyask', t('shop.emptyCartAsk')));
    const yes = el2('button', 'urd-cart-emptybtn urd-cart-emptyyes', t('shop.emptyCartYes'));
    yes.type = 'button';
    yes.addEventListener('click', () => {
      const closer = body.closest('dialog')?.querySelector('.urd-cart-close');
      writeCart([]);
      closer?.focus();
    });
    const no = el2('button', 'urd-cart-emptybtn', t('shop.emptyCartNo'));
    no.type = 'button';
    no.addEventListener('click', () => {
      offer();
      row.querySelector('button')?.focus();
    });
    row.append(yes, no);
    no.focus();
  };
  const offer = () => {
    row.textContent = '';
    const btn = el2('button', 'urd-cart-emptybtn', t('shop.emptyCart'));
    btn.type = 'button';
    btn.addEventListener('click', ask);
    row.appendChild(btn);
  };
  offer();
  return row;
}

/**
 * The checkout page a basket block's drawer links to: the block's own page or path, else the menu basket's.
 * @param {{page?: string, href?: string}} props The block's props
 * @param {{pages?: Array<{id: string, path: string}>, nav?: {cart?: object}}} site
 * @returns {string} The address, or '' when neither is set
 */
export function cartCheckoutHref(props, site) {
  const pages = site?.pages ?? [];
  const own = resolveLink(props ?? {}, pages);
  if (!own.missing) return own.href;
  const menu = resolveLink(site?.nav?.cart ?? {}, pages);
  return menu.missing ? '' : menu.href;
}

/** The basket drawer the block and the nav basket share; the caller attaches the dialog and calls open() and refresh(). */
export function createCartDrawer({ href = '', currency = 'kr' } = {}) {
  const dialog = document.createElement('dialog');
  dialog.className = 'urd-cart-dialog';
  const head = el2('div', 'urd-cart-head');
  head.appendChild(el2('strong', null, t('shop.cart')));
  const close = el2('button', 'urd-cart-close');
  close.type = 'button';
  close.innerHTML = iconSvg('cross') ?? '';
  close.setAttribute('aria-label', t('shop.close'));
  close.addEventListener('click', () => dialog.close());
  head.appendChild(close);
  dialog.appendChild(head);
  const body = el2('div', 'urd-cart-body');
  dialog.appendChild(body);
  // Light dismiss: a click on the ::backdrop hits the dialog element itself.
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
  return {
    dialog,
    open() {
      renderDrawer(body, { href }, currency);
      dialog.showModal();
    },
    refresh() {
      if (dialog.open) renderDrawer(body, { href }, currency);
    },
  };
}

export const cartBlock = {
  version: 1,
  autoGrow: true,
  label: 'Basket',
  labelKey: 'blocks.cart',
  defaults: () => ({ variant: 'button', href: '', currency: 'kr' }),
  migrations: {},
  /**
   * @param {HTMLElement} el
   * @param {{variant?: string, href?: string, currency?: string}} props
   * @param {object} ctx Render context
   */
  render(el, props, ctx) {
    const editable = Boolean(ctx.preview) && ctx.viewport !== 'mobile';
    const currency = props.currency || 'kr';

    const btn = el2('button', `urd-cart-button${props.variant === 'icon' ? ' urd-cart-iconbutton' : ''}`);
    btn.type = 'button';
    const icon = el2('span', 'urd-cart-icon');
    icon.innerHTML = iconSvg('cart') ?? '';
    btn.appendChild(icon);
    const label = el2('span', 'urd-cart-label', t('shop.cart'));
    if (props.variant !== 'icon') btn.appendChild(label);
    btn.setAttribute('aria-label', t('shop.cart'));
    const badge = el2('span', 'urd-cart-badge', '0');
    badge.hidden = true;
    btn.appendChild(badge);
    el.appendChild(btn);

    // The checkout page: the block's own (props.page or props.href), else the menu basket's.
    const drawer = createCartDrawer({ href: cartCheckoutHref(props, ctx.site), currency });
    el.appendChild(drawer.dialog);

    const updateBadge = () => {
      const count = cartCount(readCart());
      badge.textContent = String(count);
      badge.hidden = count === 0;
    };
    updateBadge();
    // While editing, the drawer opens only when the block was already selected at the press; in the Clean view it opens at once, as on the published page.
    let openArmed = !ctx.preview;
    if (ctx.preview) {
      btn.addEventListener('pointerdown', () => {
        openArmed = document.body.classList.contains('urd-chrome-off') || (el.closest('.urd-block')?.classList.contains('urd-selected') ?? false);
      });
    }
    btn.addEventListener('click', () => {
      if (!openArmed) return;
      drawer.open();
    });

    // Basket changes from product cards or the drawer itself: badge always, drawer when open.
    onCartChange(el, () => {
      updateBadge();
      drawer.refresh();
    });

    if (editable) {
      // The help chip (ADR-0008): the basket works in the preview too.
      Promise.all([import('../hint.js'), adminLocaleReady]).then(([{ attachHint }]) => {
        if (!el.isConnected || el.querySelector('.urd-hint-chip')) return;
        attachHint(el, {
          title: ta('hintCart.title'),
          lines: [ta('hintCart.l1'), ta('hintCart.l2'), ta('hintCart.l3')],
        });
      });
    }
  },
};
