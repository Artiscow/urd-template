/**
 * Built-in page templates («starter packs»): whole pages composed of core
 * section presets, shown in the «New page from template» grid in the Pages
 * panel under the Built-in group. Defined in code (not as content/maler/
 * files) so they follow the engine version, always exist on fresh clones and
 * keep the user's own template list clean.
 *
 * Only core presets are referenced (plugins can be switched off). create() runs
 * at build time, so the seed texts are translated then (ADR-0012) and makeId
 * gives fresh ids; no re-id is needed on insertion. EDITOR-ONLY: imported only
 * by admin (the $engine bundle), never by the visitor closure (the modulepreload
 * test guards it).
 */
import { registerSectionPresets } from './sections/presets.js';
import { PAGE_SCHEMA_VERSION } from './migrate.js';

/* Section defs are collected with the validate.mjs trick: registration needs
   only a define hook, not the whole Urd object. */
const defs = new Map();
registerSectionPresets({ sections: { define: (id, def) => defs.set(id, def) } });

/** The starter packs in display order; sections holds core preset ids. */
export const PAGE_PRESETS = [
  { id: 'landing', labelKey: 'pageTemplate.landing', sections: ['hero', 'feature-cards', 'stats', 'quote', 'cta'] },
  { id: 'about', labelKey: 'pageTemplate.about', sections: ['hero-centered', 'team', 'timeline', 'sponsors', 'cta'] },
  { id: 'contact', labelKey: 'pageTemplate.contact', sections: ['hero-centered', 'contact', 'faq'] },
  { id: 'portfolio', labelKey: 'pageTemplate.portfolio', sections: ['hero-centered', 'gallery', 'quote', 'cta'] },
  { id: 'event', labelKey: 'pageTemplate.event', sections: ['lead-story', 'events', 'steps', 'faq', 'cta'] },
  // The shop pattern: the shop is a page of its own and the checkout another -
  // the owner points the cart's Checkout page setting at the checkout page
  // afterwards. shop-front is the full storefront (the Shopify pattern):
  // campaign hero, product band, category tiles, statement band, trust and CTA.
  { id: 'shop', labelKey: 'pageTemplate.shop', sections: ['shop-hero', 'shop', 'faq', 'cta'] },
  { id: 'shop-front', labelKey: 'pageTemplate.shopFront', sections: ['shop-hero', 'shop', 'shop-categories', 'shop-showcase', 'shop-trust', 'cta'] },
  { id: 'checkout', labelKey: 'pageTemplate.checkout', sections: ['checkout', 'contact'] },
  // The privacy page: its one section holds the block that writes the page from the site's settings.
  { id: 'privacy', labelKey: 'pageTemplate.privacy', sections: ['privacy'] },
  // The shop's terms of sale: one text in the site's language, filled in by the owner (sections/presets.js termsHtml).
  { id: 'terms', labelKey: 'pageTemplate.terms', sections: ['terms'] },
];

/**
 * Builds a complete, valid page file from a starter pack.
 * @param {string} id Starter pack id from PAGE_PRESETS
 * @param {{pageId: string, title: string, seed?: object}} meta The new page's slug and title, and what a section made from the site's language takes (sections/presets.js termsHtml)
 * @returns {object|null} Page file, or null for an unknown id
 */
export function buildPagePreset(id, { pageId, title, seed }) {
  const preset = PAGE_PRESETS.find((p) => p.id === id);
  if (!preset) return null;
  return {
    schemaVersion: PAGE_SCHEMA_VERSION,
    meta: { id: pageId, title },
    // `seed` reaches a section that is made from the site's language and facts (the terms of sale); the others take nothing.
    sections: preset.sections.map((sid) => defs.get(sid).create(seed)),
  };
}
