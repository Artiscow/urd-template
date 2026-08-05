/**
 * Delt footer: redigeres ETT sted (site.footer) og vises nederst på alle
 * sider. Additivt felt fra v0.5. To former: den gamle enkle (kun text-linjer,
 * rendres byte-likt som før) og den rike (merkevare, kolonner, sosiale lenker,
 * handlingsoppfordring, bunnlinje med lenker, bakgrunnslag). Ren logikk i
 * footer-model.js og footer-cta.js.
 */

import { resolveColor } from './theme.js';
import { iconSvg, ICON_LIBRARY } from './icons.js';
import { t } from './i18n.js';
import { renderBackgroundLayers } from './render.js';
import {
  footerBrand,
  footerColumns,
  footerSocial,
  footerBaseline,
  footerBaselineLinks,
  footerLinkRow,
  footerCta,
  hasRichFooter,
} from './footer-model.js';
import {
  isEmail,
  isSpam,
  buildNewsletterPayload,
  buildNewsletterMailto,
} from './footer-cta.js';

/**
 * Full lagbasert bakgrunn (additivt fra v0.6, delt med seksjoner og nav): en
 * backdrop bak footer-innholdet med samme lagstakk som seksjonene. Prepend-es
 * i .urd-footer-inneren så den ligger bak wrap/bunnlinje. Returnerer true når
 * lag ble tegnet (da hopper rik-formen over den gamle footer.bg-fargen).
 */
function mountFooterBg(footer, inner) {
  const bg = footer.background;
  if (!Array.isArray(bg?.layers) || !bg.layers.length) return false;
  const backdrop = document.createElement('div');
  backdrop.className = 'urd-footer-bg';
  renderBackgroundLayers(backdrop, bg);
  inner.prepend(backdrop);
  return true;
}

/** Sosial-raden: ett anker per lenke, ikonet er motorens egen tegnede SVG. */
function buildSocial(social) {
  const row = document.createElement('div');
  row.className = 'urd-footer-social';
  for (const s of social) {
    const svg = iconSvg(s.icon);
    if (!svg) continue; // ukjent ikon-id droppes stille
    const a = document.createElement('a');
    a.className = 'urd-footer-soc';
    a.href = s.url;
    a.rel = 'noopener noreferrer';
    // Ikonets visningsnavn (merkenavn, språknøytralt) som tilgjengelig navn,
    // aldri den rå ikon-id-en.
    a.setAttribute('aria-label', ICON_LIBRARY[s.icon]?.label ?? s.icon);
    // iconSvg er motorens egen, selvforfattede SVG (samme mønster som
    // blocks/icon.js) - ikke brukerinnhold, trygt å sette som innerHTML.
    a.innerHTML = svg;
    row.appendChild(a);
  }
  return row;
}

/** En rad med lenker (bunnlinje-lenker eller doormat-raden). */
function buildLinks(links, className) {
  const el = document.createElement('nav');
  el.className = className;
  for (const link of links) {
    const a = document.createElement('a');
    a.textContent = link.label;
    a.href = link.href;
    if (link.external) a.rel = 'noopener noreferrer';
    el.appendChild(a);
  }
  return el;
}

/**
 * Nyhetsbrev-skjemaet: e-postfelt + skjult honeypot + knapp, sendt med fetch
 * til et konfigurert endepunkt (moderne innsending, inline bekreftelse, ingen
 * sidelast). Uten endepunkt faller det tilbake til mailto. Speiler skjema-
 * pluginens innsending, men gjenbruker den rene footer-cta.js (motoren skal
 * aldri avhenge av en plugin). I preview sendes ingenting - kun bekreftelsen.
 */
function buildNewsletterForm(cta) {
  const form = document.createElement('form');
  form.className = 'urd-footer-nl';
  form.noValidate = true;

  // Honeypot: skjult felt som kun bots fyller ut (CSS holder det ute av syne).
  const honeypot = document.createElement('input');
  honeypot.type = 'text';
  honeypot.name = 'nettside';
  honeypot.tabIndex = -1;
  honeypot.autocomplete = 'off';
  honeypot.className = 'urd-footer-hp';
  honeypot.setAttribute('aria-hidden', 'true');

  const email = document.createElement('input');
  email.type = 'email';
  email.required = true;
  email.placeholder = t('footer.newsletter.emailPlaceholder');
  email.className = 'urd-footer-nl-email';
  email.setAttribute('aria-label', t('footer.newsletter.emailLabel'));

  const submit = document.createElement('button');
  submit.type = 'submit';
  submit.className = 'urd-footer-cta-btn';
  submit.textContent = cta.label || t('footer.newsletter.subscribe');

  const status = document.createElement('p');
  status.className = 'urd-footer-nl-status';
  status.setAttribute('role', 'status');

  const row = document.createElement('div');
  row.className = 'urd-footer-nl-row';
  row.append(email, submit);
  form.append(honeypot, row, status);

  const done = () => {
    status.className = 'urd-footer-nl-status ok';
    status.textContent = cta.success || t('footer.newsletter.success');
    form.reset();
  };
  const fail = (msg) => {
    status.className = 'urd-footer-nl-status feil';
    status.textContent = msg;
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    status.className = 'urd-footer-nl-status';
    status.textContent = '';
    // Honeypot utfylt: lat som det gikk bra, send ingenting (ikke tips boten).
    if (isSpam(honeypot.value)) { done(); return; }
    const value = email.value.trim();
    if (!isEmail(value)) { fail(t('footer.newsletter.invalidEmail')); return; }
    // I editorens preview sendes aldri noe på ekte - vis bekreftelsen.
    if (document.body.classList.contains('urd-preview')) { done(); return; }

    if (cta.endpoint) {
      submit.disabled = true;
      try {
        const res = await fetch(cta.endpoint, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(buildNewsletterPayload(value, { side: location.pathname })),
        });
        if (!res.ok) throw new Error(String(res.status));
        done();
      } catch {
        fail(t('footer.newsletter.sendFailed'));
      } finally {
        submit.disabled = false;
      }
    } else {
      const url = buildNewsletterMailto(cta.recipient, value);
      if (!url) { fail(t('footer.newsletter.missingTarget')); return; }
      window.location.href = url;
      done();
    }
  });

  return form;
}

/** Handlingsoppfordringen: overskrift + undertekst + knapp/nyhetsbrev-skjema. */
function buildCta(cta) {
  const block = document.createElement('div');
  block.className = cta.big ? 'urd-footer-bigcta' : 'urd-footer-cta';
  if (cta.heading) {
    const h = document.createElement('div');
    h.className = 'urd-footer-cta-h';
    h.textContent = cta.heading;
    block.appendChild(h);
  }
  if (cta.sub) {
    const p = document.createElement('p');
    p.className = 'urd-footer-cta-sub';
    p.textContent = cta.sub;
    block.appendChild(p);
  }
  if (cta.kind === 'newsletter') {
    block.appendChild(buildNewsletterForm(cta));
  } else {
    const a = document.createElement('a');
    a.className = 'urd-footer-cta-btn';
    a.href = cta.target?.href ?? '#';
    a.textContent = cta.label || t('footer.readMore');
    if (cta.target?.external) a.rel = 'noopener noreferrer';
    block.appendChild(a);
  }
  return block;
}

/**
 * Merket: tekst, opplastet logo (bilde) eller begge (speiler nav-logoen).
 * Uten logo i image/both-modus faller det tilbake til tittelen.
 */
function buildBrandIdentity(brand) {
  const el = document.createElement('div');
  el.className = 'urd-footer-brand-id';
  const hasLogo = (brand.mode === 'image' || brand.mode === 'both') && brand.logo;
  const showTitle = brand.mode !== 'image' || !hasLogo;
  if (hasLogo) {
    const img = document.createElement('img');
    img.className = 'urd-footer-logo';
    img.src = brand.logo;
    img.alt = brand.title || '';
    img.loading = 'lazy';
    img.decoding = 'async';
    const h = Number(brand.logoHeight);
    img.style.setProperty('--urd-footer-logo-h', `${Number.isFinite(h) ? Math.min(160, Math.max(16, h)) : 40}px`);
    el.appendChild(img);
  }
  if (showTitle && brand.title) {
    const t = document.createElement('span');
    t.className = 'urd-footer-brand-title';
    t.textContent = brand.title;
    el.appendChild(t);
  }
  return el;
}

/**
 * @param {object} site site.json, allerede parset
 * @param {HTMLElement} host Elementet footeren bygges inn i
 * @param {string} [pageId] Gjeldende sides id - footeren skjules på sider i
 *   footer.hideOn (per-side-unntak; standard er synlig på alle sider).
 */
export function renderFooter(site, host, pageId) {
  host.replaceChildren();
  host.style.removeProperty('background');
  const footer = site.footer;
  // Skjult globalt (show av), eller skrudd av på nettopp denne siden.
  if (!footer?.show || (pageId && Array.isArray(footer.hideOn) && footer.hideOn.includes(pageId))) {
    host.style.display = 'none';
    return;
  }

  const rich = hasRichFooter(site);
  const baseline = footerBaseline(site);

  // Påskrudd, men uten innhold: en synlig, men HELT tom footer. Ingen tekst,
  // ingen plassholder, ingen sidetittel - den fylles først når noe legges inn i
  // Footer-panelet. (show av gir ingen footer i det hele tatt, over.)
  if (!rich && !baseline.length) {
    host.style.display = '';
    const inner = document.createElement('div');
    inner.className = 'urd-footer urd-footer-empty';
    mountFooterBg(footer, inner);
    host.appendChild(inner);
    return;
  }

  // Gammel form: kun text-linjer. Byte-likt som før, uten kolonner/social.
  if (!rich) {
    host.style.display = '';
    const inner = document.createElement('div');
    inner.className = `urd-footer urd-footer-${footer.align ?? 'center'}`;
    for (const line of String(footer.text ?? '').split('\n')) {
      if (!line.trim()) continue;
      const p = document.createElement('p');
      p.textContent = line;
      inner.appendChild(p);
    }
    mountFooterBg(footer, inner);
    host.appendChild(inner);
    return;
  }

  // Rik form.
  const brand = footerBrand(site);
  const columns = footerColumns(site);
  const social = footerSocial(site);
  const baselineLinks = footerBaselineLinks(site);
  const linkRow = footerLinkRow(site);
  const cta = footerCta(site);
  host.style.display = '';

  const inner = document.createElement('div');
  // Stor CTA sentrerer alltid; ellers følger justeringsvalget.
  const alignClass = cta && cta.big ? 'center' : footer.align ?? 'left';
  inner.className = `urd-footer urd-footer-rich urd-footer-${alignClass}`;
  // Full lagbasert bakgrunn overtar flaten når den finnes; ellers den gamle
  // enkle bakgrunnsfargen (default = temaets surface fra base.css).
  const hasFooterBgLayers = mountFooterBg(footer, inner);
  if (!hasFooterBgLayers && footer.bg) inner.style.background = resolveColor(footer.bg);

  const wrap = document.createElement('div');
  wrap.className = 'urd-footer-wrap';

  if (cta && cta.big) {
    // Stor sentrert handlingsoppfordring, med valgfritt merke over.
    if (brand) {
      const bt = document.createElement('div');
      bt.className = 'urd-footer-brand-top';
      bt.appendChild(buildBrandIdentity(brand));
      wrap.appendChild(bt);
    }
    wrap.appendChild(buildCta(cta));
    if (social.length) {
      const sr = buildSocial(social);
      sr.classList.add('urd-footer-social-center');
      wrap.appendChild(sr);
    }
  } else if (brand || columns.length || social.length || cta) {
    const top = document.createElement('div');
    top.className = 'urd-footer-top';
    // Justering av en bred (todelt) kolonnes overskrift: venstre eller sentrert.
    if (footer.columnsAlign === 'center') top.classList.add('urd-footer-cols-center');

    if (brand || social.length || cta) {
      const brandCol = document.createElement('div');
      brandCol.className = 'urd-footer-brand';
      if (brand) {
        brandCol.appendChild(buildBrandIdentity(brand));
        if (brand.tagline) {
          const tagline = document.createElement('p');
          tagline.className = 'urd-footer-tagline';
          tagline.textContent = brand.tagline;
          brandCol.appendChild(tagline);
        }
      }
      if (cta) brandCol.appendChild(buildCta(cta));
      if (social.length) brandCol.appendChild(buildSocial(social));
      top.appendChild(brandCol);
    }

    // Kolonnene i et rutenett: --n er antall spor (bred kolonne teller to), så
    // kolonnene blir like brede og avstanden lik uansett antall lenker.
    let n = 0;
    for (const col of columns) {
      const c = document.createElement('div');
      c.className = 'urd-footer-col';
      if (col.wide) { c.classList.add('urd-footer-col-wide'); n += 2; } else { n += 1; }
      if (col.title) {
        const h = document.createElement('h4');
        h.textContent = col.title;
        c.appendChild(h);
      }
      const ul = document.createElement('ul');
      for (const link of col.links) {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.textContent = link.label;
        a.href = link.href;
        if (link.external) a.rel = 'noopener noreferrer';
        li.appendChild(a);
        ul.appendChild(li);
      }
      c.appendChild(ul);
      top.appendChild(c);
    }
    if (n) top.style.setProperty('--n', String(n));
    wrap.appendChild(top);
  }

  // Doormat-lenkeraden (Sentrert / Stor CTA): én sentrert rad.
  if (linkRow.length) wrap.appendChild(buildLinks(linkRow, 'urd-footer-linkrow'));

  // Bunnlinja: copyright/tekst til venstre, valgfrie lenker til høyre.
  if (baseline.length || baselineLinks.length) {
    const base = document.createElement('div');
    base.className = 'urd-footer-baseline';
    const left = document.createElement('div');
    left.className = 'urd-footer-baseline-text';
    for (const line of baseline) {
      const span = document.createElement('span');
      span.textContent = line;
      left.appendChild(span);
    }
    base.appendChild(left);
    if (baselineLinks.length) base.appendChild(buildLinks(baselineLinks, 'urd-footer-baseline-links'));
    wrap.appendChild(base);
  }

  inner.appendChild(wrap);
  host.appendChild(inner);
}
