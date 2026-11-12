/**
 * The footer's presets (the Footer panel's «Presets», chosen in the design picker): ten arrangements of the footer, each a look (the alignment, the design, the background) and the parts it shows (the brand, link columns or a link row, a call to action, the bottom line).
 * A preset meets the footer's own content (applyPreset): a part the preset shows keeps the owner's content and takes the preset's sample only where the footer has none of its own, and a part the preset does not show is taken away. Link columns and a link row stand in for each other, so the owner's links move between them.
 * A sample is built from the site's own pages and a neutral name, never the site's title, with its words through `ta` (the admin dictionary), so seed text is written once, as it goes in (ADR-0012).
 * Loaded by the editor and the design pictures alone, never by a visitor's page. Node-tested (tests/footer-presets.test.mjs).
 */
import { glowLayer } from './backgrounds/glow.js';
import { grainLayer } from './backgrounds/grain.js';

/** The presets, in the order the picker lists them. */
export const FOOTER_PRESETS = ['minimal', 'centered', 'columns', 'sitemap', 'newsletter', 'bigcta', 'contact', 'mega', 'chapters', 'split'];

/** The look a preset sets whole. */
const LOOK = ['align', 'design', 'columnsAlign', 'background'];

/** The parts a footer shows by holding content, as a preset meets them. */
const PARTS = ['brand', 'columns', 'linkRow', 'cta', 'copyright', 'baseline'];

const clone = (v) => (v === undefined ? undefined : JSON.parse(JSON.stringify(v)));

/**
 * A preset's own footer: its look and every part it shows, with sample content.
 * @param {string} id One of FOOTER_PRESETS
 * @param {{ta: (key: string) => string, pages?: Array<{id: string, title?: string}>, privacyPage?: string|null}} ctx The words, the site's pages, and the site's privacy page where the footer links one
 * @returns {object}
 */
export function presetSample(id, { ta, pages = [], privacyPage = null }) {
  const title = ta('seed.orgName');
  const pageLinks = (n) => pages.slice(0, n).map((p) => ({ label: p.title || p.id, page: p.id }));
  const ext = (label, href) => ({ label, href });
  // The site's privacy page, where the footer has one: the columns link it, and the bottom row leaves its placeholder out, since the footer draws the real link there.
  const privacyId = pages.some((p) => p.id === privacyPage) ? privacyPage : null;
  const privacy = () => (privacyId ? { label: ta('seed.footer.privacy'), page: privacyId } : ext(ta('seed.footer.privacy'), '#'));
  const bottomPrivacy = () => (privacyId ? [] : [ext(ta('seed.footer.privacy'), '#')]);
  const copyright = `© ${title}`;
  if (id === 'minimal') {
    return { align: 'center', brand: { title }, copyright, baseline: bottomPrivacy() };
  }
  if (id === 'centered') {
    return { align: 'center', brand: { title }, linkRow: pageLinks(5), copyright: `${copyright} · ${ta('seed.footer.madeWith')}` };
  }
  if (id === 'columns') {
    return { align: 'left', brand: { title, tagline: ta('seed.footer.tagline1') },
      columns: [
        { title: ta('seed.footer.colPages'), links: pageLinks(4) },
        { title: ta('seed.footer.colCompany'), links: [ext(ta('seed.footer.about'), '#'), ext(ta('seed.join'), '#'), ext(ta('seed.footer.press'), '#')] },
        { title: ta('seed.footer.colResources'), links: [ext(ta('seed.footer.bylaws'), '#'), privacy(), ext(ta('seed.footer.contact'), '#')] },
      ],
      copyright,
      baseline: [...bottomPrivacy(), ext(ta('seed.footer.terms'), '#')] };
  }
  if (id === 'sitemap') {
    return { align: 'left', brand: { title, tagline: ta('seed.footer.tagline2') },
      columns: [
        { title: ta('seed.footer.colExplore'), links: [ext(ta('seed.footer.home'), '#'), ext(ta('seed.footer.events'), '#'), ext(ta('seed.footer.gallery'), '#'), ext(ta('seed.footer.blog'), '#')] },
        { title: ta('seed.footer.colCompany'), links: [ext(ta('seed.footer.about'), '#'), ext(ta('seed.footer.history'), '#'), ext(ta('seed.footer.press'), '#'), ext(ta('seed.footer.contact'), '#')] },
        { title: ta('seed.footer.colSupport'), links: [ext(ta('seed.join'), '#'), ext(ta('seed.footer.faq'), '#'), ext(ta('seed.footer.help'), '#')] },
        { title: ta('seed.footer.colLegal'), links: [privacy(), ext(ta('seed.footer.terms'), '#'), ext(ta('seed.footer.bylaws'), '#')] },
      ],
      copyright,
      baseline: [...bottomPrivacy(), ext(ta('seed.footer.terms'), '#'), ext(ta('seed.footer.cookies'), '#')] };
  }
  if (id === 'newsletter') {
    return { align: 'left', brand: { title, tagline: ta('seed.footer.tagline3') },
      cta: { kind: 'newsletter', heading: ta('seed.footer.newsletterHeading'), label: ta('seed.footer.newsletterButton'), recipient: ta('seed.email'), success: ta('seed.footer.newsletterSuccess') },
      columns: [
        { title: ta('seed.footer.colPages'), links: pageLinks(4) },
        { title: ta('seed.footer.colMore'), links: [ext(ta('seed.footer.about'), '#'), ext(ta('seed.footer.contact'), '#'), privacy()] },
      ],
      copyright, baseline: bottomPrivacy() };
  }
  if (id === 'bigcta') {
    return { align: 'center',
      cta: { kind: 'button', big: true, heading: ta('seed.footer.ctaHeading'), sub: ta('seed.footer.ctaSub'), label: ta('seed.join'), href: '#' },
      linkRow: pageLinks(4), copyright,
      baseline: [...bottomPrivacy(), ext(ta('seed.footer.terms'), '#')] };
  }
  if (id === 'contact') {
    // The contact column after the pages is the site's own contact details (the Legal panel), never sample text; the preset shows them.
    return { align: 'left', contact: true, brand: { title, tagline: ta('seed.footer.tagline4') },
      columns: [{ title: ta('seed.footer.colPages'), links: pageLinks(4) }],
      copyright, baseline: bottomPrivacy() };
  }
  if (id === 'chapters') {
    // The link columns as numbered chapters under a rule each (footer.design).
    return { align: 'left', design: 'chapters', brand: { title, tagline: ta('seed.footer.tagline2') },
      columns: [
        { title: ta('seed.footer.colExplore'), links: pageLinks(4) },
        { title: ta('seed.footer.colCompany'), links: [ext(ta('seed.footer.about'), '#'), ext(ta('seed.footer.history'), '#'), ext(ta('seed.footer.contact'), '#')] },
        { title: ta('seed.footer.colSupport'), links: [ext(ta('seed.join'), '#'), ext(ta('seed.footer.faq'), '#'), ext(ta('seed.footer.help'), '#')] },
      ],
      copyright, baseline: [...bottomPrivacy(), ext(ta('seed.footer.terms'), '#')] };
  }
  if (id === 'split') {
    // The brand with a call to action on a tinted half, the columns in the other half (footer.design).
    return { align: 'left', design: 'split', brand: { title, tagline: ta('seed.footer.tagline1') },
      cta: { kind: 'button', heading: ta('seed.footer.ctaHeading'), label: ta('seed.join'), href: '#' },
      columns: [
        { title: ta('seed.footer.colPages'), links: pageLinks(4) },
        { title: ta('seed.footer.colMore'), links: [ext(ta('seed.footer.about'), '#'), ext(ta('seed.footer.contact'), '#'), privacy()] },
      ],
      copyright, baseline: bottomPrivacy() };
  }
  // mega: columns over background layers, a glow and grain.
  return { align: 'left', brand: { title, tagline: ta('seed.footer.tagline5') },
    columns: [
      { title: ta('seed.footer.colExplore'), links: pageLinks(4) },
      { title: ta('seed.footer.colFollow'), links: [ext(ta('seed.footer.newsletter'), '#'), ext(ta('seed.email'), `mailto:${ta('seed.email')}`)] },
    ],
    copyright,
    baseline: [...bottomPrivacy(), ext(ta('seed.footer.madeWith'), '#')],
    background: { version: 1, layers: [
      { type: 'glow', version: glowLayer.version ?? 1, props: { ...glowLayer.defaults(), color: 'accent', x: 0.12, y: 0, radius: 0.6, opacity: 0.45 } },
      { type: 'grain', version: grainLayer.version ?? 1, props: { ...grainLayer.defaults(), opacity: 0.08 } },
    ] } };
}

/** Whether the footer holds content of its own in a part. */
function holds(footer, part) {
  const v = footer?.[part];
  if (v == null) return false;
  if (Array.isArray(v)) return v.length > 0;
  if (typeof v === 'string') return v.trim() !== '';
  if (part === 'brand') return Boolean(v.title || v.tagline || v.logo);
  return true;
}

/** A call to action as the preset shows it: the owner's own where it is of the preset's kind, else the preset's with the owner's heading; the preset says whether it is big. */
function meetCta(own, sample) {
  if (!own) return clone(sample);
  const kind = (c) => c.kind ?? 'button';
  const met = kind(own) === kind(sample) ? clone(own) : { ...clone(sample), ...(own.heading ? { heading: own.heading } : {}) };
  if (sample.big) met.big = true;
  else delete met.big;
  return met;
}

/**
 * The footer with a preset applied: the preset's look, and each part it shows with the owner's content where the footer holds some, else the preset's sample; the parts it does not show are taken away. The footer is turned on, and its old plain text form gives way.
 * @param {object|null|undefined} footer The footer as it stands
 * @param {object} sample presetSample's result
 * @returns {object} a new footer; the one given is left as it is
 */
export function applyPreset(footer, sample) {
  const out = { ...(clone(footer) ?? { version: 1 }), show: true };
  delete out.text;
  for (const key of LOOK) {
    if (sample[key] !== undefined) out[key] = clone(sample[key]);
    else delete out[key];
  }
  // A preset that shows the site's contact details shows them whatever the footer was set to; shown is the field's standard.
  if (sample.contact === true) delete out.contact;
  // The owner's links move between link columns and a link row where the preset shows the other.
  const ownColumns = holds(footer, 'columns') ? footer.columns : null;
  const ownRow = holds(footer, 'linkRow') ? footer.linkRow : null;
  for (const part of PARTS) {
    if (sample[part] === undefined) {
      delete out[part];
    } else if (part === 'columns') {
      out.columns = ownColumns ? clone(ownColumns) : ownRow ? [{ ...clone(sample.columns[0]), links: clone(ownRow) }] : clone(sample.columns);
    } else if (part === 'linkRow') {
      out.linkRow = ownRow ? clone(ownRow) : ownColumns ? ownColumns.flatMap((c) => clone(c.links ?? [])) : clone(sample.linkRow);
    } else if (part === 'cta') {
      out.cta = meetCta(footer?.cta, sample.cta);
    } else {
      out[part] = holds(footer, part) ? clone(footer[part]) : clone(sample[part]);
    }
  }
  return out;
}
