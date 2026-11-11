/**
 * Core block: privacy (0.7.24.2). The site's privacy page, written from the
 * site's settings and its pages (privacy-model.js) each time it is drawn, so
 * it follows what the owner switches on: who is responsible, what each form
 * sends and to whom, the shop and its payment providers, the measuring, the
 * videos and maps from other companies, the host, the visitor's rights, and
 * the visitor's own choices on this site (the providers they have let load
 * at once, each taken back with one press). Its settings are whether it opens
 * with the page's heading, its design and its look (doc-look.js); the owner
 * changes what it says by changing the site.
 * The page files are read over the network as published; in the editor's
 * preview the other pages' drafts are not seen until they are published.
 */
import { t, ta, adminLocaleReady, siteTextLang } from '../i18n.js';
import { privacyModel, cloudflareBeacon, BROWSER_KEEPS, KEEP_TERMS } from '../privacy-model.js';
import { allowedProviders, setProviderAllowed, providerName, providerPrivacyUrl } from '../embed-cover.js';
import { privacyDesign, applyDocLook, buildContents } from '../doc-look.js';

const el2 = (tag, className, textContent) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (textContent !== undefined) node.textContent = textContent;
  return node;
};

/** How long a page file read for the page is kept, so the editor's many redraws do not read every page again each time. */
const PAGE_CACHE_MS = 60_000;
const pageCache = new Map();

/** A page file, read once a minute at most; null for one that cannot be read. */
function readPage(file, fetchFn) {
  const kept = pageCache.get(file);
  if (kept && Date.now() - kept.at < PAGE_CACHE_MS) return kept.page;
  const page = fetchFn(`/${file}`).then((res) => (res.ok ? res.json() : null)).catch(() => null);
  pageCache.set(file, { at: Date.now(), page });
  return page;
}

/** The pages' files; one that cannot be read is left out, so the page says what it can. */
async function loadPages(site, fetchFn = fetch) {
  const entries = (Array.isArray(site?.pages) ? site.pages : []).filter((entry) => entry?.file);
  const pages = await Promise.all(entries.map((entry) => readPage(entry.file, fetchFn)));
  return entries.map((entry, i) => ({ entry, page: pages[i] })).filter(({ page }) => page);
}

/* The third parties beside the frames' providers (which embed-cover.js names, with their privacy terms): the payment providers and the host, each with its name and its own privacy terms. */
const OTHER_PARTIES = {
  cloudflare: ['Cloudflare', 'https://www.cloudflare.com/privacypolicy/'],
  vipps: ['Vipps MobilePay', 'https://vipps.no/personvern/'],
  stripe: ['Stripe', 'https://stripe.com/privacy'],
  paypal: ['PayPal', 'https://www.paypal.com/legalhub/privacy-full'],
};

/** A name as a link to that company's own privacy terms, so the visitor reads them there: a frame's provider by the covers' list, the others by their own. */
function nameLink(id, name) {
  const url = providerPrivacyUrl(id) || OTHER_PARTIES[id]?.[1] || '';
  if (!url) return el2('span', null, name);
  const a = el2('a', null, name);
  a.href = url;
  a.target = '_blank';
  a.rel = 'noopener';
  return a;
}

/** The part of a company's own terms that says how long it keeps what it gets (KEEP_TERMS), as a link named by that part. */
function termsLink(id) {
  const terms = KEEP_TERMS[id];
  if (!terms) return el2('span', null, String(id));
  const a = el2('a', null, terms.section);
  a.href = terms.url;
  a.target = '_blank';
  a.rel = 'noopener';
  return a;
}

/** The day a company's terms were read, in the language of the sentence it stands in. */
function checkedText(id, key) {
  const day = KEEP_TERMS[id]?.checked ?? '';
  try {
    return new Intl.DateTimeFormat(siteTextLang(key), { dateStyle: 'long' }).format(new Date(`${day}T00:00:00`));
  } catch {
    return day;
  }
}

/** How long a company keeps what it gets, as a sentence: set out in the part of its own terms the link names, read on the day named. */
function keepTermsNode(id) {
  const company = KEEP_TERMS[id]?.company ?? OTHER_PARTIES[id]?.[0] ?? providerName(id);
  return paragraphWith(t('privacy.keep.company', { company, date: checkedText(id, 'privacy.keep.company') }), [termsLink(id)]);
}

/** A paragraph from a text with «{names}» in it, the names set in as links, the text around them as it is. */
function paragraphWith(text, names) {
  return withNames(el2('p'), text, names);
}

/** An element filled from a text with «{names}» in it, the names set in as links, the text around them as it is. */
function withNames(p, text, names) {
  const parts = text.split('{names}');
  parts.forEach((part, i) => {
    if (part) p.append(part);
    if (i < parts.length - 1) names.forEach((node, k) => {
      if (k) p.append(k === names.length - 1 ? ` ${t('privacy.and')} ` : ', ');
      p.append(node);
    });
  });
  return p;
}

const joinNames = (names) => (names.length <= 1 ? names.join('') : `${names.slice(0, -1).join(', ')} ${t('privacy.and')} ${names.at(-1)}`);

/** The designs that set out what is collected row by row: the table and the cards. */
const LEDGERS = new Set(['ledger', 'ledger-cards']);

/** The page's heading in the site's language, where the block carries it (`heading`, the template's), so it reads in the same language as the page under it. */
function heading(props) {
  return props?.heading === true ? [el2('h1', 'urd-privacy-title', t('privacy.title'))] : [];
}

/** A list of lines as one paragraph, a line break between them. */
function linesParagraph(lines) {
  const p = el2('p');
  lines.forEach((line, i) => { if (i) p.append(el2('br')); p.append(line); });
  return p;
}

/** Where a form or the checkout sends what it holds, in words. */
const sentTo = (item) => (item.mode === 'endpoint' || item.host ? t('privacy.forms.toService', { host: item.host }) : item.recipient ? t('privacy.forms.byEmail', { email: item.recipient }) : t('privacy.forms.toOwner'));

/** The names of the other parties that get something: the payment providers, the frames' providers and the host. */
function otherNames(model) {
  const pay = (model.checkout?.providers ?? []).filter((id) => id !== 'manual').map((id) => OTHER_PARTIES[id]?.[0] ?? id);
  return [...pay, ...model.embeds.map(providerName), OTHER_PARTIES.cloudflare[0]];
}

/** A set period in the browser's own words for the unit («12 months», «12 måneder»), in the language of the sentence it stands in (`key`), so a site whose language lacks the sentence reads it whole in bokmål. */
function periodText(r, key) {
  try {
    return new Intl.NumberFormat(siteTextLang(key), { style: 'unit', unit: r.unit === 'years' ? 'year' : 'month', unitDisplay: 'long' }).format(r.count);
  } catch {
    return `${r.count} ${r.unit}`;
  }
}

/** The words for how long the association keeps each kind it sets a period for (privacy-model.js retentionOf): a sentence in the prose, a cell in the ledger. */
const KEEP_LINE = {
  forms: { period: 'privacy.keep.forms.period', closed: 'privacy.keep.forms.closed', ask: 'privacy.keep.forms.ask', askUs: 'privacy.keep.forms.askUs' },
  newsletter: { period: 'privacy.keep.newsletter.period', unsubscribe: 'privacy.keep.newsletter', ask: 'privacy.keep.newsletter.ask', askUs: 'privacy.keep.newsletter.askUs' },
  orders: { period: 'privacy.keep.orders.period', bookkeeping: 'privacy.keep.orders.bookkeeping', nif: 'privacy.keep.orders.nif', ask: 'privacy.keep.orders.ask', askUs: 'privacy.keep.orders.askUs' },
};
const KEEP_CELL = {
  forms: { period: 'privacy.ledger.keep.formPeriod', closed: 'privacy.ledger.keep.form' },
  newsletter: { period: 'privacy.ledger.keep.newsletterPeriod', unsubscribe: 'privacy.ledger.keep.newsletter' },
  orders: { period: 'privacy.ledger.keep.orderPeriod', bookkeeping: 'privacy.ledger.keep.orderBookkeeping', nif: 'privacy.ledger.keep.orderNif' },
};

/** The acts that keep an order: each choice's name and where it is read, set into the sentence and the cell as a link («{names}»). */
const KEEP_LAWS = {
  bookkeeping: ['bokføringsloven § 13', 'https://lovdata.no/lov/2004-11-19-73/§13'],
  nif: ['NIFs lov § 2-11', 'https://www.idrettsforbundet.no/tema/juss/nifs-lov/'],
};

/** A law as a link in a sentence. */
function lawLink([name, url]) {
  const a = el2('a', null, name);
  a.href = url;
  a.target = '_blank';
  a.rel = 'noopener';
  return a;
}

/** How long the association keeps a kind, as a sentence: the period or the criterion the owner chose, or, not decided, that it is not and where to ask (the association's email where it has one). */
function keepLine(model, kind) {
  const r = model.retention?.[kind];
  if (r) return t(KEEP_LINE[kind][r.until], r.until === 'period' ? { period: periodText(r, KEEP_LINE[kind][r.until]) } : undefined);
  const email = model.controller.email;
  return email ? t(KEEP_LINE[kind].ask, { email }) : t(KEEP_LINE[kind].askUs);
}

/** The sentence as a paragraph, the act that keeps an order set in as a link. */
function keepNode(model, kind) {
  const law = KEEP_LAWS[model.retention?.[kind]?.until];
  return law ? paragraphWith(keepLine(model, kind), [lawLink(law)]) : el2('p', null, keepLine(model, kind));
}

/** The same as the ledger's «How long» cell, which stands under the association's details: words, or an element where the act is linked. */
function keepCell(model, kind) {
  const r = model.retention?.[kind];
  if (!r) return t('privacy.ledger.keep.ask');
  const law = KEEP_LAWS[r.until];
  if (law) return withNames(el2('span'), t(KEEP_CELL[kind][r.until]), [lawLink(law)]);
  return t(KEEP_CELL[kind][r.until], r.until === 'period' ? { period: periodText(r, KEEP_CELL[kind][r.until]) } : undefined);
}

/** What the site collects, as the forms', the shop's, the measuring's and the frames' parts. */
function collectedNodes(model) {
  const nodes = [];
  const nothing = !model.forms.length && !model.checkout && !model.analytics && !model.embeds.length;
  if (nothing) nodes.push(el2('p', null, t('privacy.nothing')));
  if (model.forms.length) {
    nodes.push(el2('h3', null, t('privacy.forms.heading')));
    const list = el2('ul');
    for (const form of model.forms) {
      const fields = form.fields.length ? t('privacy.forms.fields', { fields: form.fields.join(', ') }) : t('privacy.forms.whatYouFill');
      list.append(el2('li', null, form.footer ? t('privacy.forms.footer', { to: sentTo(form) }) : t('privacy.forms.line', { page: form.page, what: fields, to: sentTo(form) })));
    }
    nodes.push(list, el2('p', null, t('privacy.forms.basis')));
    if (model.forms.some((f) => !f.footer)) nodes.push(keepNode(model, 'forms'));
    if (model.forms.some((f) => f.footer)) nodes.push(keepNode(model, 'newsletter'));
  }
  if (model.checkout) {
    const s = model.checkout;
    nodes.push(el2('h3', null, t('privacy.shop.heading')));
    nodes.push(el2('p', null, t('privacy.shop.sends', { page: s.page, to: sentTo(s) })));
    nodes.push(...paymentNodes(s), el2('p', null, t('privacy.shop.basis')), keepNode(model, 'orders'));
  }
  if (model.analytics) {
    nodes.push(el2('h3', null, t('privacy.analytics.heading')));
    nodes.push(...analyticsNodes());
  }
  if (model.embeds.length) {
    nodes.push(el2('h3', null, t('privacy.embeds.heading')));
    nodes.push(...embedNodes(model));
  }
  return nodes;
}

/** The counting of visits: what it reads, on what basis, and how long Cloudflare keeps it (`keep`; the ledger's table says that in its own column). */
const analyticsNodes = ({ keep = true } = {}) => [paragraphWith(t('privacy.analytics.text'), [nameLink('cloudflare', 'Cloudflare Web Analytics')]), ...(keep ? [keepTermsNode('cloudflare')] : [])];

/** The host: what it keeps, where it may process it, and how long (`keep`: where the counting of visits stands, its line has told Cloudflare's terms already, and the ledger's table says it in its own column). */
const hostNodes = ({ keep = true } = {}) => [paragraphWith(t('privacy.host.text'), [nameLink('cloudflare', 'Cloudflare Pages')]), ...(keep ? [keepTermsNode('cloudflare')] : [])];

/** The checkout's payment providers, how long each keeps what it gets (`keep`; the ledger's table says that in its own column), and its manual ways to pay. */
function paymentNodes(s, { keep = true } = {}) {
  const nodes = [];
  const providers = s.providers.filter((id) => id !== 'manual');
  if (providers.length) nodes.push(paragraphWith(t('privacy.shop.payment'), providers.map((id) => nameLink(id, OTHER_PARTIES[id]?.[0] ?? id))));
  if (keep) nodes.push(...providers.map(keepTermsNode));
  if (s.providers.includes('manual')) nodes.push(el2('p', null, t('privacy.shop.manual')));
  return nodes;
}

/** The frames from other companies: behind a cover until a press, or with the page, and how long the companies keep what they learn (`keep`; the ledger's table says that in its own column). */
function embedNodes(model, { keep = true } = {}) {
  const asking = model.embeds.filter((id) => !model.atOnce.includes(id));
  const links = model.embeds.map((id) => nameLink(id, providerName(id)));
  if (!asking.length) return [paragraphWith(t('privacy.embeds.allAtOnce'), links), ...(keep ? model.embeds.map(keepTermsNode) : [])];
  const nodes = [paragraphWith(t('privacy.embeds.text'), links)];
  if (model.atOnce.length) nodes.push(el2('p', null, t('privacy.embeds.atOnce', { names: joinNames(model.atOnce.map(providerName)) })));
  if (keep) nodes.push(...model.embeds.map(keepTermsNode));
  nodes.push(el2('p', null, t('privacy.embeds.choice')));
  return nodes;
}

/**
 * The ledgers (the designs that set out what is collected): a row for each thing the site or another party gets, with why, who gets it and how long it is kept (GDPR article 13: the purposes, the recipients and the period).
 * Rows that differ only in who gets them (the frames' companies) are one row with every company named.
 * `ledger` draws them as a table of three columns, who gets it under the why; `ledger-cards` as a card each, its lines named.
 */
function ledgerNodes(model, design) {
  const owner = model.controller.name || t('privacy.controller.owner');
  // Who gets what a form or the checkout sends: the service it goes to, the address it is emailed to, or the one responsible.
  const who = (item) => item.host || item.recipient || owner;
  const rows = [];
  /* A row's recipients are names, or [id, name] for another company, whose own terms tell how long it keeps it (`keep` null: the row links them, one company to a row). */
  const add = (what, why, recipients, keep) => {
    const names = [recipients].flat().map((r) => (Array.isArray(r) ? { id: r[0], name: r[1] } : { name: r }));
    const same = keep === null ? null : rows.find((r) => r.what === what && r.why === why && r.keep === keep);
    if (same) same.who.push(...names.filter((n) => !same.who.some((w) => w.name === n.name)));
    else rows.push({ what, why, who: names, keep });
  };
  for (const form of model.forms) {
    if (form.footer) add(t('privacy.ledger.emailAddress'), t('privacy.ledger.why.newsletter'), who(form), keepCell(model, 'newsletter'));
    else add(form.fields.length ? form.fields.join(', ') : t('privacy.ledger.whatYouFill'), t('privacy.ledger.why.form', { page: form.page }), who(form), keepCell(model, 'forms'));
  }
  if (model.checkout) {
    const pay = model.checkout.providers.filter((id) => id !== 'manual');
    add(t('privacy.ledger.order'), t('privacy.ledger.why.order'), [who(model.checkout), ...pay.map((id) => OTHER_PARTIES[id]?.[0] ?? id)], keepCell(model, 'orders'));
    for (const id of pay) add(t('privacy.ledger.paymentDetails'), t('privacy.ledger.why.payment'), [[id, OTHER_PARTIES[id]?.[0] ?? id]], null);
  }
  if (model.analytics) add(t('privacy.ledger.visits'), t('privacy.ledger.why.analytics'), [['cloudflare', 'Cloudflare']], null);
  for (const id of model.embeds) {
    add(t('privacy.ledger.ip'), t(model.atOnce.includes(id) ? 'privacy.ledger.why.embedAtOnce' : 'privacy.ledger.why.embed'), [[id, providerName(id)]], null);
  }
  add(t('privacy.ledger.ipLogs'), t('privacy.ledger.why.host'), [['cloudflare', 'Cloudflare']], null);
  const nodes = [design === 'ledger-cards' ? ledgerCards(rows) : ledgerTable(rows)];
  // What the rows cannot hold, said as the other designs say it, so every design tells the same.
  const nothing = !model.forms.length && !model.checkout && !model.analytics && !model.embeds.length;
  if (nothing) nodes.push(el2('p', null, t('privacy.nothing')));
  if (model.forms.length) nodes.push(el2('p', null, t('privacy.forms.basis')));
  if (model.checkout) nodes.push(...paymentNodes(model.checkout, { keep: false }), el2('p', null, t('privacy.shop.basis')));
  if (model.analytics) nodes.push(...analyticsNodes({ keep: false }));
  if (model.embeds.length) nodes.push(...embedNodes(model, { keep: false }));
  nodes.push(...hostNodes({ keep: false }));
  return nodes;
}

/** A row's keeping into an element: its own words, or the company's own terms, named and linked, where that company decides. */
function keepInto(cell, row) {
  if (row.keep instanceof Node) cell.append(row.keep);
  else if (row.keep !== null) cell.textContent = row.keep;
  else {
    const id = row.who.find((w) => w.id)?.id;
    withNames(cell, t('privacy.ledger.keep.theirs', { company: KEEP_TERMS[id]?.company ?? row.who[0]?.name ?? '' }), [termsLink(id)]);
  }
  return cell;
}

/** The ledger's rows as a table: what, why with who gets it under it, and how long. */
function ledgerTable(rows) {
  const table = el2('table', 'urd-doc-ledger');
  const head = el2('tr');
  for (const key of ['privacy.ledger.what', 'privacy.ledger.whyWho', 'privacy.ledger.keep']) {
    const th = el2('th', null, t(key));
    th.scope = 'col';
    head.append(th);
  }
  table.append(el2('thead'), el2('tbody'));
  table.tHead.append(head);
  for (const row of rows) {
    const why = el2('td', null, row.why);
    why.append(el2('span', 'urd-doc-who', joinNames(row.who.map((w) => w.name))));
    const tr = el2('tr');
    tr.append(el2('td', null, row.what), why, keepInto(el2('td'), row));
    table.tBodies[0].append(tr);
  }
  const wrap = el2('div', 'urd-doc-ledger-wrap');
  wrap.append(table);
  return wrap;
}

/** The ledger's rows as cards: what as the card's title, then why, who gets it and how long, each named. */
function ledgerCards(rows) {
  const list = el2('ul', 'urd-doc-ledger-cards');
  for (const row of rows) {
    const dl = el2('dl');
    dl.append(el2('dt', null, t('privacy.ledger.why')), el2('dd', null, row.why), el2('dt', null, t('privacy.ledger.who')), el2('dd', null, joinNames(row.who.map((w) => w.name))), el2('dt', null, t('privacy.ledger.keep')), keepInto(el2('dd'), row));
    const li = el2('li');
    li.append(el2('b', null, row.what), dl);
    list.append(li);
  }
  return list;
}

/** The four answers most visitors look for, as cards above the page: who is responsible, what is collected, who else gets something, and the cookies. */
function glanceNodes(model) {
  const c = model.controller;
  const collects = [];
  if (model.forms.length) collects.push(t('privacy.glance.forms'));
  if (model.checkout) collects.push(t('privacy.glance.orders'));
  if (model.analytics) collects.push(t('privacy.glance.visits'));
  const facts = [
    [t('privacy.glance.controller'), c.name || t('privacy.controller.owner')],
    [t('privacy.glance.collects'), collects.length ? capitalise(joinNames(collects)) : t('privacy.glance.nothing')],
    [t('privacy.glance.others'), joinNames(otherNames(model))],
    [t('privacy.glance.cookies'), model.atOnce.length ? t('privacy.glance.cookiesOthers', { names: joinNames(model.atOnce.map(providerName)) }) : t('privacy.glance.cookiesNone')],
  ];
  const grid = el2('div', 'urd-doc-glance');
  for (const [label, value] of facts) {
    const fact = el2('div', 'urd-doc-fact');
    fact.append(el2('b', null, label), el2('span', null, value));
    grid.append(fact);
  }
  return [grid];
}

const capitalise = (text) => (text ? text[0].toLocaleUpperCase() + text.slice(1) : text);

/**
 * The page's parts, each a key (its heading's and its question's), what it holds, and what stands above it (`lead`).
 * The ledgers set out what is collected under who is responsible, and the host's row stands among them, so the controller's and the host's parts are left out there.
 */
function pageParts(model, design) {
  const c = model.controller;
  const parts = [];
  const lines = [];
  if (c.org) lines.push(t('privacy.controller.org', { org: c.org }));
  if (c.representative) lines.push(t('privacy.controller.representative', { name: c.representative }));
  if (c.address) lines.push(c.address);
  if (c.email) lines.push(c.email);
  if (c.phone) lines.push(c.phone);
  const controller = [el2('p', null, t('privacy.controller.line', { name: c.name || t('privacy.controller.owner') })), ...(lines.length ? [linesParagraph(lines)] : [])];
  // The ledger names who is responsible above its table, as the table's lead; the other designs give it a part of its own.
  if (LEDGERS.has(design)) parts.push({ key: 'what', lead: controller, nodes: ledgerNodes(model, design) });
  else parts.push({ key: 'controller', nodes: controller }, { key: 'what', nodes: collectedNodes(model) });

  // What the site keeps in the visitor's own browser.
  // The cart is emptied by an order only through a checkout that sends it itself; one that opens an email draft leaves it, as does a shop without a checkout. A payment's reference is kept only where a provider takes the payment.
  const shop = model.browser.shop;
  const pays = (model.checkout?.providers ?? []).some((id) => id !== 'manual');
  const empties = Boolean(model.checkout?.host) || pays;
  const applies = { pages: true, theme: model.browser.theme, announcement: model.browser.announcement, cart: shop, order: Boolean(model.checkout), payment: pays, calendar: model.browser.calendar, calendarHeight: model.browser.calendar, embeds: model.embeds.some((id) => !model.atOnce.includes(id)) };
  const untilOf = (keep) => (keep.id === 'cart' && !empties ? 'emptied' : keep.until);
  const kept = BROWSER_KEEPS.filter((keep) => applies[keep.id]).map((keep) => t('privacy.browser.line', { what: t(`privacy.browser.${keep.id}`), until: t(`privacy.browser.until.${untilOf(keep)}`, { n: keep.minutes }) }));
  const list = el2('ul');
  for (const line of kept) list.append(el2('li', null, line));
  parts.push({ key: 'browser', nodes: [el2('p', null, t('privacy.browser.text')), list] });

  if (!LEDGERS.has(design)) parts.push({ key: 'host', nodes: hostNodes({ keep: !model.analytics }) });

  // The visitor's rights, and the authority for the country.
  const authority = el2('p');
  if (c.country === 'NO') {
    const a = el2('a', null, 'Datatilsynet');
    a.href = 'https://www.datatilsynet.no/';
    a.target = '_blank';
    a.rel = 'noopener';
    const words = t('privacy.rights.authority', { authority: '{authority}' }).split('{authority}');
    authority.append(words[0], a, words[1] ?? '');
  } else {
    authority.textContent = t('privacy.rights.authority', { authority: t('privacy.rights.authorityOther') });
  }
  parts.push({ key: 'rights', nodes: [el2('p', null, t('privacy.rights.text', { name: c.name || t('privacy.controller.owner'), email: c.email || t('privacy.rights.theSite') })), authority] });

  // The visitor's own choices on this site.
  const choices = el2('div', 'urd-privacy-choices');
  drawChoices(choices);
  parts.push({ key: 'choices', nodes: [choices] });
  return parts;
}

/** The page drawn in its design from the facts. */
function draw(host, model, props, blockId) {
  const design = privacyDesign(props?.design);
  host.replaceChildren(...heading(props), el2('p', 'urd-privacy-intro urd-doc-lead', t('privacy.intro')));
  if (design === 'glance') host.append(...glanceNodes(model));
  const parts = pageParts(model, design);
  const prefix = `urd-privacy-${blockId ?? 'page'}`;
  if (design === 'questions') {
    // Each part as the question a visitor would ask, one open at a time, the first open.
    parts.forEach((part, i) => {
      const item = el2('details', 'urd-doc-part');
      item.name = prefix;
      if (i === 0) item.open = true;
      const summary = el2('summary');
      summary.append(el2('h2', null, t(`privacy.q.${part.key}`)));
      const answer = el2('div', 'urd-doc-answer');
      answer.append(...part.nodes);
      item.append(summary, answer);
      host.append(item);
    });
    return;
  }
  const sections = parts.map((part) => {
    const section = el2('section', 'urd-doc-part');
    section.append(el2('h2', null, t(`privacy.${part.key}.heading`)), ...part.nodes);
    return section;
  });
  // A part's lead stands above it, outside the part.
  const leads = parts.flatMap((part) => part.lead ?? []);
  if (design === 'contents') {
    // The heading and the introduction stand in the text's column, the folded contents of a narrow page under them.
    const { nav, fold } = buildContents(sections.map((s) => s.firstElementChild), prefix);
    const cols = el2('div', 'urd-doc-cols');
    const body = el2('div', 'urd-doc-body');
    body.append(...host.childNodes, fold, ...sections);
    cols.append(nav, body);
    host.replaceChildren(cols);
    return;
  }
  host.append(...leads, ...sections);
}

/** The providers this browser lets load at once, each with the press that takes the choice back. */
function drawChoices(box) {
  box.replaceChildren();
  const allowed = allowedProviders();
  if (!allowed.length) {
    box.append(el2('p', null, t('privacy.choices.none')));
    return;
  }
  box.append(el2('p', null, t('privacy.choices.intro')));
  const list = el2('ul', 'urd-privacy-list');
  for (const id of allowed) {
    const row = el2('li');
    row.append(el2('span', null, t('privacy.choices.row', { name: providerName(id) })));
    const btn = el2('button', 'urd-privacy-takeback', t('privacy.choices.takeBack'));
    btn.type = 'button';
    btn.addEventListener('click', () => {
      setProviderAllowed(id, false);
      drawChoices(box);
      const said = el2('p', 'urd-privacy-said', t('privacy.choices.taken', { name: providerName(id) }));
      said.setAttribute('role', 'status');
      box.append(said);
    });
    row.append(btn);
    list.append(row);
  }
  box.append(list);
}

export const privacyBlock = {
  version: 1,
  label: 'Privacy',
  labelKey: 'blocks.privacy',
  defaults: () => ({}),
  migrations: {},
  /**
   * @param {HTMLElement} el
   * @param {{heading?: boolean, design?: string, accent?: string, headingColor?: string, cardColor?: string, rules?: boolean, corners?: string, headingFont?: string, font?: string}} props heading: the block opens with the page's heading in the site's language (additive from 0.7.24.2.2; the template's block carries it); design and the look beside it (additive from 0.7.24.2.4, doc-look.js): the layout the page is drawn in and how it is dressed; the words are the site's
   * @param {object} ctx Render context
   */
  render(el, props, ctx) {
    const host = el2('div', 'urd-privacy urd-doc');
    applyDocLook(host, privacyDesign(props?.design), props);
    host.append(...heading(props), el2('p', 'urd-privacy-intro urd-doc-lead', t('privacy.intro')));
    el.appendChild(host);
    // The facts need the pages: drawn once they are read, and with the site alone where none can be.
    // The counting of visits is told where the site switches it on, and where Cloudflare has put its beacon on the page itself.
    loadPages(ctx.site).then((pages) => {
      if (!host.isConnected) return;
      const model = privacyModel(ctx.site, pages);
      if (!model.analytics && cloudflareBeacon([...document.scripts].map((s) => s.src))) model.analytics = true;
      draw(host, model, props, el.dataset.blockId);
    });
    if (Boolean(ctx.preview) && ctx.viewport !== 'mobile') {
      // The help chip (ADR-0008): where the page's facts come from, and when another page's change shows.
      Promise.all([import('../hint.js'), adminLocaleReady]).then(([{ attachHint }]) => {
        if (!el.isConnected || el.querySelector('.urd-hint-chip')) return;
        attachHint(el, {
          title: ta('hintPrivacy.title'),
          lines: [ta('hintPrivacy.l1'), ta('hintPrivacy.l2'), ta('hintPrivacy.l3')],
        });
      });
    }
  },
  autoGrow: true,
};
