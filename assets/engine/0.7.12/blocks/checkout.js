/**
 * Core block: checkout, the basket's order with the buyer's contact fields, sent as an email draft, to an endpoint or through the payment layer (ADR-0028).
 * Notes: docs/engine-notes/blocks/checkout.md (Urd repository).
 */
import {
  readCart, writeCart, cartTotal, formatPrice, orderLines, orderSummary,
  buildOrderBody, buildOrderMailto, buildOrderPayload, isEmail, onCartChange,
  paymentsOf, anyProvider, currencyWord, PAY_PROVIDERS, methodText, shownMethods,
  orderRecord, saveOrder, readOrder, cartRelimit, cartReprice, cartDrop,
} from '../shop.js';
// Only called in preview (after the admin dictionary has loaded): never at module level.
import { ta, adminLocaleReady, t, siteLang } from '../i18n.js';
import { sellerParts, legalText } from '../contact-model.js';
import { sitePageLink } from '../footer-model.js';

/**
 * What a provider's function says of itself: `{configured, test}`, or null where the site has no functions (a local server, a host without them).
 * @param {'vipps'|'stripe'|'paypal'} provider
 * @returns {Promise<{configured: boolean, test: boolean}|null>}
 */
async function providerState(provider) {
  try {
    const res = await fetch(`/api/pay/${provider}/checkout`, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json().catch(() => null);
    return typeof data?.configured === 'boolean' ? { configured: data.configured, test: data.test === true } : null;
  } catch {
    return null;
  }
}

/** Names as a list in the site's language («Vipps and PayPal» in English), through Intl; a browser without ListFormat joins them with commas. */
function listText(names) {
  try {
    return new Intl.ListFormat(siteLang(), { type: 'conjunction' }).format(names);
  } catch {
    return names.join(', ');
  }
}

const el2 = (tag, className, textContent) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (textContent != null) node.textContent = textContent;
  return node;
};

/** The order summary: the lines plus the total, or the empty text. Rebuilt on basket change. */
function renderSummary(box, currency) {
  box.textContent = '';
  const items = readCart();
  if (!items.length) {
    box.appendChild(el2('p', 'urd-checkout-empty', t('shop.cartEmpty')));
    return;
  }
  const list = el2('ul', 'urd-checkout-lines');
  for (const line of orderLines(items, currency)) list.appendChild(el2('li', null, line));
  box.appendChild(list);
  const sum = el2('div', 'urd-checkout-total');
  sum.append(el2('span', null, t('shop.total')), el2('strong', null, formatPrice(cartTotal(items), currency)));
  box.appendChild(sum);
}

/** The summary right above the order buttons: the order in one line and the total; hidden with an empty basket. */
function renderRecap(box, currency) {
  box.textContent = '';
  const items = readCart();
  box.hidden = !items.length;
  if (!items.length) return;
  const sum = el2('div', 'urd-checkout-total');
  sum.append(el2('span', null, t('shop.total')), el2('strong', null, formatPrice(cartTotal(items), currency)));
  box.append(el2('p', 'urd-checkout-recap-lines', orderSummary(items)), sum);
}

/** Numbers the summaries above the buttons, so two checkouts on a page keep their descriptions apart. */
let recapCount = 0;

/** A date as the site's language writes it, from the record's ISO stamp. */
function dateText(iso) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  try {
    return new Intl.DateTimeFormat(siteLang(), { dateStyle: 'long' }).format(date);
  } catch {
    return date.toISOString().slice(0, 10);
  }
}

/** The texts of the seller for the confirmation and the withdrawal form: the name, the legal line, the address, the phone and the email. */
function sellerLines(seller) {
  if (!seller) return [];
  return [
    seller.name,
    seller.legal.length ? legalText(seller.legal) : '',
    seller.address,
    seller.phone?.label ?? '',
    seller.email?.label ?? '',
  ].filter(Boolean);
}

/**
 * The printable confirmation of an order: its lines and total, the buyer, the payment, the seller, the right of withdrawal and its form, and a Print button.
 */
function buildConfirmation(record, seller, currency) {
  const box = el2('section', 'urd-checkout-confirmation');
  box.setAttribute('aria-label', t('shop.confirmation'));
  const head = el2('div', 'urd-checkout-confirmation-head');
  head.appendChild(el2('h2', null, t('shop.confirmation')));
  const print = el2('button', 'urd-checkout-print', t('shop.print'));
  print.type = 'button';
  print.addEventListener('click', () => {
    document.documentElement.classList.add('urd-print-order');
    const done = () => document.documentElement.classList.remove('urd-print-order');
    window.addEventListener('afterprint', done, { once: true });
    window.print();
  });
  head.appendChild(print);
  box.appendChild(head);
  const meta = el2('p', 'urd-checkout-confirmation-meta');
  const when = dateText(record.at);
  meta.append(el2('span', null, when ? t('shop.orderedOn', { date: when }) : ''));
  if (record.reference) meta.append(el2('span', null, `${t('shop.reference')}: ${record.reference}`));
  box.appendChild(meta);
  const list = el2('ul', 'urd-checkout-lines');
  for (const line of record.lines) {
    const name = line.variant ? `${line.title} (${line.variant})` : line.title;
    list.appendChild(el2('li', null, `${line.qty} × ${name} - ${formatPrice(line.price * line.qty, currency)}`));
  }
  box.appendChild(list);
  const sum = el2('div', 'urd-checkout-total');
  sum.append(el2('span', null, t('shop.total')), el2('strong', null, formatPrice(record.total, currency)));
  box.appendChild(sum);
  const facts = el2('dl', 'urd-checkout-facts');
  const fact = (label, text) => {
    if (!text) return;
    facts.append(el2('dt', null, label), el2('dd', null, text));
  };
  fact(t('shop.buyer'), [record.contact.name, record.contact.email, record.contact.phone].filter(Boolean).join(' · '));
  if (record.provider) fact(t('shop.payMethod'), t(`shop.paidVia.${record.provider}`));
  else if (record.payment) fact(t('shop.payMethod'), record.payment);
  const sellerText = sellerLines(seller);
  if (sellerText.length) fact(t('shop.seller'), sellerText.join(' · '));
  box.appendChild(facts);
  // The right of withdrawal and the model form, the seller's details filled in as the form asks.
  const withdrawal = el2('div', 'urd-checkout-withdrawal');
  withdrawal.appendChild(el2('h3', null, t('shop.withdrawalHeading')));
  withdrawal.appendChild(el2('p', null, t('shop.withdrawalNote')));
  const form = el2('div', 'urd-checkout-wform');
  form.appendChild(el2('h4', null, t('shop.wfTitle')));
  form.appendChild(el2('p', 'urd-checkout-wform-note', t('shop.wfInstruction')));
  const rows = [
    [t('shop.wfTo'), sellerText.length ? sellerText.join(', ') : '______'],
    [t('shop.wfDeclaration'), ''],
    [t('shop.wfOrdered'), when ? `${when} / ______` : '______ / ______'],
    [t('shop.wfName'), record.contact.name || '______'],
    [t('shop.wfAddress'), '______'],
    [t('shop.wfSignature'), '______'],
    [t('shop.wfDate'), '______'],
  ];
  for (const [label, value] of rows) {
    const row = el2('p', 'urd-checkout-wform-row');
    row.appendChild(el2('span', null, label));
    if (value) row.appendChild(el2('span', 'urd-checkout-wform-value', value));
    form.appendChild(row);
  }
  form.appendChild(el2('p', 'urd-checkout-wform-note', t('shop.wfDelete')));
  withdrawal.appendChild(form);
  box.appendChild(withdrawal);
  return box;
}

/** The seller under the order buttons, as an <address>: «Seller: Apeiron Linjeforening · Org.nr. … · Street 1, 7034 Town», the phone and the email as links. */
function buildSeller(seller) {
  const box = el2('address', 'urd-checkout-seller');
  box.appendChild(el2('span', 'urd-checkout-seller-label', `${t('shop.seller')}:`));
  const text = [seller.name, seller.legal.length ? legalText(seller.legal) : '', seller.address].filter(Boolean).join(' · ');
  if (text) box.appendChild(el2('span', null, text));
  for (const item of [seller.phone, seller.email]) {
    if (!item) continue;
    const node = el2(item.href ? 'a' : 'span', null, item.label);
    if (item.href) node.href = item.href;
    box.appendChild(node);
  }
  return box;
}

export const checkoutBlock = {
  version: 2,
  autoGrow: true,
  label: 'Checkout',
  labelKey: 'blocks.checkout',
  defaults: () => ({ recipient: '', endpoint: '', currency: 'kr', seller: true, payments: { vipps: false, card: 'none', paypal: false, capture: 'ship', manual: [] } }),
  migrations: {
    // 1 -> 2: the Vipps button flag becomes the Vipps provider, and the Vipps number the first payment instruction (ADR-0028).
    1: ({ vippsCheckout, vipps, ...rest }) => ({
      ...rest,
      payments: {
        vipps: vippsCheckout === true,
        card: 'none',
        paypal: false,
        capture: 'ship',
        manual: typeof vipps === 'string' && vipps.trim() ? [{ id: 'vipps', label: 'Vipps', text: vipps.trim() }] : [],
      },
    }),
  },
  /**
   * @param {HTMLElement} el
   * @param {{recipient?: string, endpoint?: string, currency?: string, seller?: boolean, payments?: object}} props
   * @param {object} ctx Render context
   */
  render(el, props, ctx) {
    const host = el2('div', 'urd-checkout');
    el.appendChild(host);
    const editable = Boolean(ctx.preview) && ctx.viewport !== 'mobile';
    // The payment layer charges in the site's currency, so with a provider on the prices show that currency's word whatever word the block holds.
    const pays = paymentsOf(props);
    const currency = anyProvider(pays) ? currencyWord(ctx.site?.site?.commerce?.currency) : (props.currency || 'kr');

    // The last order's confirmation stands first, kept across a refresh of this tab; a new order replaces it.
    const seller = props.seller === false ? null : sellerParts(ctx.site);
    let confirmation = null;
    const showConfirmation = (record) => {
      if (ctx.preview) return;
      saveOrder(record);
      const next = buildConfirmation(record, seller, record.currency || currency);
      if (confirmation) confirmation.replaceWith(next);
      else host.prepend(next);
      confirmation = next;
      // The buyer stands at the form's foot when the order goes: the confirmation is brought into view.
      next.scrollIntoView({ block: 'start' });
    };
    const kept = ctx.preview ? null : readOrder();
    if (kept) {
      confirmation = buildConfirmation(kept, seller, kept.currency || currency);
      host.appendChild(confirmation);
    }
    const summary = el2('div', 'urd-checkout-summary');
    renderSummary(summary, currency);
    host.appendChild(summary);
    const recap = el2('div', 'urd-checkout-recap');
    recapCount += 1;
    recap.id = `urd-checkout-recap-${recapCount}`;
    renderRecap(recap, currency);
    onCartChange(el, () => {
      renderSummary(summary, currency);
      renderRecap(recap, currency);
    });

    const form = el2('form', 'urd-checkout-form');
    form.noValidate = true;
    const field = (labelKey, tag, type) => {
      const label = el2('label', 'urd-checkout-field');
      label.appendChild(el2('span', null, t(labelKey)));
      const input = document.createElement(tag);
      if (type) input.type = type;
      if (tag === 'textarea') input.rows = 3;
      input.className = 'urd-checkout-input';
      label.appendChild(input);
      form.appendChild(label);
      return input;
    };
    const nameInput = field('shop.name', 'input', 'text');
    const emailInput = field('shop.email', 'input', 'email');
    const phoneInput = field('shop.phone', 'input', 'tel');
    const commentInput = field('shop.comment', 'textarea');

    // Honeypot: a hidden field bots fill in; humans never see or hit it.
    const hpWrap = el2('label', 'urd-checkout-hp');
    hpWrap.setAttribute('aria-hidden', 'true');
    const hp = document.createElement('input');
    hp.type = 'text';
    hp.name = 'website';
    hp.tabIndex = -1;
    hp.autocomplete = 'off';
    hpWrap.appendChild(hp);
    form.appendChild(hpWrap);

    // The payment instructions above the order summary: one stands as a line; two or more are a radio group the buyer chooses in before ordering.
    const methods = shownMethods(pays);
    const methodRadios = [];
    if (methods.length === 1) {
      form.appendChild(el2('p', 'urd-checkout-vipps', methodText(methods[0])));
    } else if (methods.length > 1) {
      const group = el2('fieldset', 'urd-form-fieldset urd-checkout-paychoice');
      group.appendChild(el2('legend', null, t('shop.payMethod')));
      methods.forEach((method, i) => {
        const option = el2('label', 'urd-form-check');
        const radio = el2('input');
        radio.type = 'radio';
        radio.name = `${recap.id}-pay`;
        radio.value = String(i);
        const words = el2('span');
        words.appendChild(el2('span', null, method.label || method.text));
        if (method.label && method.text) words.appendChild(el2('span', 'urd-checkout-paychoice-text', method.text));
        option.append(radio, words);
        group.appendChild(option);
        methodRadios.push(radio);
      });
      form.appendChild(group);
    }
    /** The way to pay this order names: the only instruction, the buyer's choice among several, or none. */
    const chosenMethod = () => (methods.length === 1 ? methods[0] : methods[methodRadios.findIndex((radio) => radio.checked)] ?? null);

    form.appendChild(recap);
    const buttons = el2('div', 'urd-checkout-buttons');
    const submit = el2('button', 'urd-checkout-send', t('shop.sendOrder'));
    submit.type = 'submit';
    submit.setAttribute('aria-describedby', recap.id);
    buttons.appendChild(submit);
    form.appendChild(buttons);

    const status = el2('p', 'urd-checkout-status');
    status.setAttribute('aria-live', 'polite');
    status.hidden = true;
    form.appendChild(status);
    if (seller) form.appendChild(buildSeller(seller));
    // The shop's terms of sale, where the site names a page for them (site.commerce.termsPage).
    const terms = sitePageLink(ctx.site, ctx.site?.site?.commerce?.termsPage);
    if (terms) {
      const line = el2('p', 'urd-checkout-terms');
      const a = el2('a', null, t('shop.terms'));
      a.href = terms.href;
      line.appendChild(a);
      form.appendChild(line);
    }
    const setStatus = (text, isError) => {
      status.textContent = text;
      status.hidden = false;
      status.classList.toggle('urd-checkout-error', Boolean(isError));
    };

    // The optional payment layer (ADR-0028): a button per provider sends the basket to the site's function, which answers with the address at the provider.
    const providerName = { vipps: 'Vipps', stripe: 'Stripe', paypal: 'PayPal' };
    const payButton = (labelKey, provider, method) => {
      const pay = el2('button', 'urd-checkout-vippspay urd-checkout-pay', t(labelKey));
      pay.type = 'button';
      pay.setAttribute('aria-describedby', recap.id);
      pay.addEventListener('click', async () => {
        // Same send guard as the form: never in preview, whatever the viewport. There the click tells the owner whether the provider is set up.
        if (ctx.preview) {
          pay.disabled = true;
          const state = await providerState(provider);
          pay.disabled = false;
          const name = providerName[provider];
          const key = !state ? 'canvas.payPreviewNoFunctions' : !state.configured ? 'canvas.payPreviewNotSetUp' : state.test ? 'canvas.payPreviewReadyTest' : 'canvas.payPreviewReady';
          setStatus(ta(key, { provider: name }), state?.configured === false);
          return;
        }
        const items = readCart();
        if (!items.length) {
          setStatus(t('shop.cartEmpty'), true);
          return;
        }
        pay.disabled = true;
        try {
          const res = await fetch(`/api/pay/${provider}/checkout`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              // Each line's price as the basket shows it, which the checkout compares with the catalogue's before the payment is made.
              order: items.map(({ id, qty, variant, price }) => ({ id, qty, price, ...(variant ? { variant } : {}) })),
              contact: {
                name: nameInput.value.trim(),
                email: emailInput.value.trim(),
                phone: phoneInput.value.trim(),
                comment: commentInput.value.trim(),
              },
              returnPath: location.pathname,
              // The draft view's order returns to the draft view (drafts.js), where the return is read with the settings it started from.
              ...(new URLSearchParams(location.search).get('draft') === '1' ? { draft: true } : {}),
              method,
            }),
          });
          const data = await res.json().catch(() => null);
          if (res.ok && data?.url) {
            // The provider, the reference, the provider's id and the buyer key are kept in this tab for the return, so a shared link confirms nothing.
            try { sessionStorage.setItem('urd-pay-reference', [provider, String(data.reference ?? ''), String(data.pid ?? ''), /^[0-9a-f]{32}$/.test(data.key ?? '') ? data.key : ''].join(':')); } catch { /* no storage: the basket then stays after the payment */ }
            location.href = data.url;
            return;
          }
          // A quantity outside a product's limits: the basket takes the limits the catalogue holds now, and the buyer checks it and pays again.
          if (res.status === 400 && data?.code === 'orderQuantity') {
            writeCart(cartRelimit(readCart(), data.lines));
            setStatus(t('shop.qtyChanged'), true);
            pay.disabled = false;
            return;
          }
          // A price changed since the line went into the basket: the basket takes the price that holds, so the total shown is the one charged, and the buyer pays again.
          if (res.status === 409 && data?.code === 'orderPrices') {
            writeCart(cartReprice(readCart(), data.lines));
            setStatus(t('shop.pricesChanged'), true);
            pay.disabled = false;
            return;
          }
          // A line whose size or colour does not fit its product: it leaves the basket, and the buyer adds it again with a choice.
          if (res.status === 400 && data?.code === 'orderChoice') {
            writeCart(cartDrop(readCart(), data.lines));
            setStatus(t('shop.choiceNeeded'), true);
            pay.disabled = false;
            return;
          }
          // The published page offers no such way to pay: the page as shown is not yet the published one, which the draft view tells the owner testing it.
          if (res.status === 400 && data?.code === 'payNotOffered') {
            setStatus(t(new URLSearchParams(location.search).get('draft') === '1' ? 'shop.payNotOfferedDraft' : 'shop.payNotOffered'), true);
            pay.disabled = false;
            return;
          }
          // 503 or 404: the payment is not set up; 400: this provider cannot take the order; else a failure that may pass.
          setStatus(t(res.status === 503 || res.status === 404 ? 'shop.vippsUnavailable' : res.status === 400 ? 'shop.payRefused' : 'shop.sendFailed'), true);
        } catch {
          setStatus(t('shop.sendFailed'), true);
        }
        pay.disabled = false;
      });
      buttons.appendChild(pay);
    };
    if (pays.vipps) payButton('shop.payWithVipps', 'vipps', 'wallet');
    if (pays.card === 'vipps') payButton('shop.payWithCard', 'vipps', 'card');
    else if (pays.card === 'stripe') payButton('shop.payWithCard', 'stripe', 'card');
    if (pays.paypal) payButton('shop.payWithPaypal', 'paypal', 'paypal');

    // On the published page a provider on its test keys shows a line at the top of the form, so test keys are never left in by mistake.
    if (!ctx.preview) {
      const providers = [...new Set([pays.vipps || pays.card === 'vipps' ? 'vipps' : null, pays.card === 'stripe' ? 'stripe' : null, pays.paypal ? 'paypal' : null].filter(Boolean))];
      Promise.all(providers.map(async (p) => ((await providerState(p))?.test ? providerName[p] : null))).then((names) => {
        const testing = names.filter(Boolean);
        if (!testing.length || !form.isConnected) return;
        const line = el2('p', 'urd-checkout-testmode', t('shop.testMode', { providers: listText(testing) }));
        line.setAttribute('role', 'note');
        form.prepend(line);
      });
    }

    // Return from payment (?ordered=&via=): the basket empties only when the reference is this browser's and the provider's endpoint says it is paid.
    const params = new URLSearchParams(location.search);
    const ordered = params.get('ordered');
    const via = params.get('via') ?? 'vipps';
    if (anyProvider(pays) && !ctx.preview && ordered !== null) {
      const settle = () => {
        const url = new URL(location.href);
        url.searchParams.delete('ordered');
        url.searchParams.delete('via');
        // PayPal adds its own order token and payer id to the return.
        url.searchParams.delete('token');
        url.searchParams.delete('PayerID');
        history.replaceState(null, '', url);
      };
      let started = '';
      try { started = sessionStorage.getItem('urd-pay-reference') ?? ''; } catch { /* no storage */ }
      const [startedVia = '', startedRef = '', pid = '', key = ''] = started.split(':');
      if (PAY_PROVIDERS.includes(via) && startedVia === via && startedRef === ordered && /^urd-[0-9a-f]{24}$/.test(ordered)) {
        // The page asks a few times while the answer is open, since the buyer may return before the payment is settled.
        const ask = async (left) => {
          const query = `reference=${encodeURIComponent(ordered)}${pid ? `&pid=${encodeURIComponent(pid)}` : ''}`;
          // A POST, since PayPal's endpoint captures the approved order on this ask.
          // The buyer key lets this page alone read the buyer's details and the amount.
          const data = await fetch(`/api/pay/${via}/session?${query}`, { method: 'POST', headers: key ? { 'x-urd-key': key } : {} }).then((res) => (res.ok ? res.json() : null)).catch(() => null);
          if (data?.paid) {
            // The confirmation is drawn from the basket before it empties, with the buyer the provider named and the amount it confirms.
            showConfirmation(orderRecord(readCart(), data.buyer ?? {}, { currency, provider: via, reference: ordered, total: data.amount }));
            writeCart([]);
            // The buyer the provider named is thanked by name; the receipt with the order lines sits with the provider.
            const name = String(data.buyer?.name ?? '').trim();
            setStatus(name ? t('shop.paidThanks', { name }) : t('shop.orderSent'), false);
            try { sessionStorage.removeItem('urd-pay-reference'); } catch { /* no storage */ }
            settle();
            return;
          }
          const open = !data || data.open === true;
          if (!open) {
            try { sessionStorage.removeItem('urd-pay-reference'); } catch { /* no storage */ }
            settle();
          }
          else if (left > 0) setTimeout(() => ask(left - 1), 2000);
        };
        ask(5);
      } else {
        settle();
      }
    }

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      // Nothing is ever sent from the editor, not even in the mobile view (ctx.preview, never editable: that one is false in the mobile viewport); the click says so.
      if (ctx.preview) {
        setStatus(ta('canvas.orderPreview'), false);
        return;
      }
      // Honeypot filled in: discard silently, show success so the bot gives up.
      if (hp.value.trim()) {
        setStatus(t('shop.orderSent'), false);
        return;
      }
      const items = readCart();
      if (!items.length) {
        setStatus(t('shop.cartEmpty'), true);
        return;
      }
      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      if (!name || !isEmail(email)) {
        setStatus(t('shop.fillRequired'), true);
        return;
      }
      const method = chosenMethod();
      if (methods.length > 1 && !method) {
        setStatus(t('shop.choosePayment'), true);
        return;
      }
      // The status after sending repeats how to pay, so the instruction stands where the buyer looks next.
      const withPayment = (text) => (method ? `${text} ${t('shop.payBy', { method: methodText(method) })}` : text);
      const contact = { name, email, phone: phoneInput.value.trim(), comment: commentInput.value.trim() };
      if (props.endpoint) {
        try {
          const res = await fetch(props.endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(buildOrderPayload(items, contact, method)),
          });
          if (!res.ok) throw new Error(String(res.status));
          // The endpoint has confirmed: the basket is delivered, so it is emptied, and the confirmation drawn.
          showConfirmation(orderRecord(items, contact, { currency, payment: method ? methodText(method) : '' }));
          writeCart([]);
          form.reset();
          setStatus(withPayment(t('shop.orderSent')), false);
        } catch {
          setStatus(t('shop.sendFailed'), true);
        }
        return;
      }
      if (props.recipient) {
        // The draft carries the seller's details too, so the buyer's sent mail holds the confirmation (angrerettloven § 18).
        const body = buildOrderBody(items, {
          [t('shop.name')]: name,
          [t('shop.email')]: email,
          [t('shop.phone')]: contact.phone,
          [t('shop.comment')]: contact.comment,
          [t('shop.payMethod')]: method ? methodText(method) : '',
          [t('shop.seller')]: sellerLines(seller).join(' · '),
        }, currency, t('shop.total'));
        location.href = buildOrderMailto(props.recipient, t('shop.orderSubject', { site: document.title }), body);
        // mailto opens a draft: the basket survives until the email is actually sent; the confirmation shows meanwhile.
        showConfirmation(orderRecord(items, contact, { currency, payment: method ? methodText(method) : '' }));
        setStatus(withPayment(t('shop.orderDraft')), false);
        return;
      }
      setStatus(t('shop.missingTarget'), true);
    });
    host.appendChild(form);

    if (editable) {
      // The help chip (ADR-0008): the send methods and the honeypot explain themselves.
      Promise.all([import('../hint.js'), adminLocaleReady]).then(([{ attachHint }]) => {
        if (!el.isConnected || el.querySelector('.urd-hint-chip')) return;
        attachHint(el, {
          title: ta('hintCheckout.title'),
          lines: [ta('hintCheckout.l1'), ta('hintCheckout.l2'), ta('hintCheckout.l3'), ta('hintCheckout.l4')],
        });
      });
    }
  },
};
