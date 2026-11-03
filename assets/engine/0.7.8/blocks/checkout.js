/**
 * Core block: checkout (the shop).
 * The order summary is read from the basket (shop.js), the contact fields (name, email, phone, comment) are validated, and the order is sent as an email draft (mailto, zero setup), as JSON to an optional endpoint, or to the optional payment layer (ADR-0020, ADR-0028: Vipps, a card at Vipps or Stripe, PayPal).
 * The order lines and the total are repeated right above the order buttons, and the buttons' texts say that ordering is a purchase or a payment: angrerettloven § 16 asks for both, and without the wording the buyer is not bound.
 * The buttons are described by the summary, so a screen reader that tabs to them hears the order and the total.
 * Under the buttons the seller is named from the Site panel's contact details (angrerettloven § 8 d), unless the block leaves it out (`seller: false`).
 * After an order, by any path, the page shows a printable confirmation with the order lines, the total, the buyer, how it is paid, the seller with the organisation number, and the standard withdrawal form (angrerettloven § 18 and § 20); it is kept in this tab's sessionStorage, so a refresh keeps it.
 * The honeypot field stops simple bots (filled in = discarded silently).
 * Payment instructions (a Vipps number, a bank account, pay at pickup) are shown in the form above the order summary: one as a line, two or more as a choice the buyer makes before ordering, and the chosen one is named in the order and repeated after it is sent.
 * An external endpoint requires connect-src in _headers (ADR-0006).
 */
import {
  readCart, writeCart, cartTotal, formatPrice, orderLines, orderSummary,
  buildOrderBody, buildOrderMailto, buildOrderPayload, isEmail, onCartChange,
  paymentsOf, anyProvider, currencyWord, PAY_PROVIDERS, methodText, shownMethods,
  orderRecord, saveOrder, readOrder, cartRelimit,
} from '../shop.js';
// Only called in preview (after the admin dictionary has loaded): never at module level.
import { ta, adminLocaleReady, t, siteLang } from '../i18n.js';
import { sellerParts } from '../contact-model.js';
import { legalText } from '../footer.js';

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
 * The printable confirmation of an order: a heading with the date and the
 * reference, the lines and the total, the buyer, how it is paid, the seller
 * (angrerettloven § 8 d, ehandelsloven § 8), the right of withdrawal and the
 * standard withdrawal form with the seller filled in (directive 2011/83/EU
 * annex I B, forskrift 2014-06-20-777 § 1), and a Print button. Printing
 * shows this section alone (base.css).
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
    // 1 -> 2: the Vipps button flag and the Vipps number became the payments
    // settings (ADR-0028): the flag is the Vipps provider, the number the
    // first payment instruction.
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
    const currency = anyProvider(pays) ? currencyWord(ctx.site?.commerce?.currency) : (props.currency || 'kr');

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

    // The payment instructions above the order summary: one stands as a line; two or more are a radio group, as the form block draws one, and the buyer chooses before ordering.
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
    const setStatus = (text, isError) => {
      status.textContent = text;
      status.hidden = false;
      status.classList.toggle('urd-checkout-error', Boolean(isError));
    };

    // The optional payment layer (ADR-0020, ADR-0028): a button per provider
    // sends the basket to the site's own function, which recomputes the total
    // from the catalogue and answers with the address at the provider; the
    // payment happens there, and the contact fields may stay empty, since
    // the provider's page asks for them.
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
              order: items.map(({ id, qty, variant }) => ({ id, qty, ...(variant ? { variant } : {}) })),
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
            // The provider, the payment's reference and the provider's own id are kept for the return, which asks whether this payment went through; the id never comes from the address, so a shared link confirms nothing.
            try { sessionStorage.setItem('urd-pay-reference', [provider, String(data.reference ?? ''), String(data.pid ?? '')].join(':')); } catch { /* no storage: the basket then stays after the payment */ }
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
          // 503: the provider is not set up; 404: the site has no functions, so the payment is not set up either; 400: this provider cannot take the order (the currency, a product); else a failure that may pass.
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

    // Return from payment (?ordered=<reference>&via=<provider>): the basket is emptied and the buyer thanked only when the reference is the one this browser started and the provider's session endpoint says the payment went through, so neither a shared address nor a cancelled payment empties a basket.
    // The parameters are cleaned away once the payment is settled, so a refresh does not ask again; while the answer is still open they stay, so a refresh asks once more.
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
      const [startedVia = '', startedRef = '', pid = ''] = started.split(':');
      if (PAY_PROVIDERS.includes(via) && startedVia === via && startedRef === ordered && /^urd-[0-9a-f]{24}$/.test(ordered)) {
        // The provider may send the buyer back before the payment is settled, and the site's function may not answer at the first try, so the page asks a few times while the answer is open.
        const ask = async (left) => {
          const query = `reference=${encodeURIComponent(ordered)}${pid ? `&pid=${encodeURIComponent(pid)}` : ''}`;
          // A POST, since PayPal's endpoint captures the approved order on this ask.
          const data = await fetch(`/api/pay/${via}/session?${query}`, { method: 'POST' }).then((res) => (res.ok ? res.json() : null)).catch(() => null);
          if (data?.paid) {
            // The confirmation is drawn from the basket before it empties, with the buyer the provider named.
            showConfirmation(orderRecord(readCart(), data.buyer ?? {}, { currency, provider: via, reference: ordered }));
            writeCart([]);
            // The buyer the provider named is thanked by name; the receipt with the order lines sits with the provider.
            const name = String(data.buyer?.name ?? '').trim();
            setStatus(name ? t('shop.paidThanks', { name }) : t('shop.orderSent'), false);
            try { sessionStorage.removeItem('urd-pay-reference'); } catch { /* no storage */ }
            settle();
            return;
          }
          const open = !data || data.open === true;
          if (!open) settle();
          else if (left > 0) setTimeout(() => ask(left - 1), 2000);
        };
        ask(5);
      } else {
        settle();
      }
    }

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      // Nothing is ever sent from the editor, not even in the mobile view
      // (ctx.preview, never editable: that one is false in the mobile viewport); the click says so.
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
