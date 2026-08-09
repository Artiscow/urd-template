/**
 * Kjernens seksjonspresets: datafabrikker som produserer en startseksjon.
 * En preset er IKKE en kodevei - etter opprettelse er alle seksjoner
 * likestilte generiske containere (se docs/SKJEMA.md). Plugins kan
 * definere flere presets med samme API.
 *
 * Biblioteket er bygget mot mønstrene fra sidekartleggingen 18. juli 2026 (inspirasjonssidene + ApeironLF, se docs/BACKLOG.md).
 * Alt er komposisjoner av eksisterende blokktyper med temafarge-tokens, så presetene følger brukerens palett.
 * `group` og `hint` er valgfrie felter som «+ Ny seksjon»-menyen bruker til gruppering og beskrivelse.
 * `item`/`itemLabel` er valgfrie fabrikker for gjentakende elementer: seksjonsverktøylinjen viser da en «+ kort/rad»-knapp.
 */

/** Kort, kollisjonstrygg id for seksjoner/blokker laget i editoren.
 *  crypto.randomUUID finnes kun i sikre kontekster (https/localhost); på f.eks. http://0.0.0.0
 *  (lokal testserver) brukes crypto.getRandomValues (som virker overalt), ellers ville alt
 *  som lager nye id-er dødd stille der. */
export function makeId(prefix) {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
  }
  const bytes = crypto.getRandomValues(new Uint8Array(4));
  const hex = [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('');
  return `${prefix}-${hex}`;
}

// Seed-regelen (ADR-0012): ta() kalles KUN inne i fabrikkfunksjonene
// (create/item/blokkfabrikkene), i innsettingsøyeblikket - aldri på
// modulnivå. Modulen er i besøkende-lukningen og bundles; hos besøkende
// kjører fabrikkene aldri.
import { ta } from '../i18n.js';

const autoMobile = () => ({ mobile: { mode: 'auto', attention: null } });

/* Blokkfabrikker: hver retur er et ferskt objekt, for presets kalles flere ganger og seksjoner må aldri dele delobjekter. */

const frame = (x, y, w, h, z = 1) => ({ desktop: { x, y, w, h, z, rot: 0 }, mobile: null });

const text = (fr, html, props = {}) => ({
  id: makeId('blk'),
  type: 'text',
  version: 1,
  props: { html, align: 'left', box: false, ...props },
  animation: null,
  frames: fr,
});

const image = (fr, props = {}) => ({
  id: makeId('blk'),
  type: 'image',
  version: 1,
  // Tomt src: bildeblokken viser rammen, og eieren bytter bilde i Egenskaper.
  // Bevisst ingen eksterne plassholder-URL-er (CSP).
  props: { src: '', alt: ta('seed.imageAlt'), fit: 'cover', radius: 'md', href: null, ...props },
  animation: null,
  frames: fr,
});

const button = (fr, label, props = {}) => ({
  id: makeId('blk'),
  type: 'button',
  version: 1,
  props: { label, page: null, href: '#', style: 'primary', ...props },
  animation: null,
  frames: fr,
});

const icon = (fr, glyph, size = 40) => ({
  id: makeId('blk'),
  type: 'icon',
  version: 1,
  props: { glyph, color: 'accent', size },
  animation: null,
  frames: fr,
});

const hoverLift = () => ({ type: 'hover-lift', version: 1, props: {} });

/* Samling-blokk (ADR-0007): collection settes av eieren i Egenskaper; null gir veiledende tomtilstand. */
const samling = (fr, view, props = {}) => ({
  id: makeId('blk'),
  type: 'samling',
  version: 1,
  props: { collection: null, view, limit: 6, newestFirst: true, ...props },
  animation: null,
  frames: fr,
});

/* Galleri-blokk: bildene legges til av eieren i Egenskaper (flervalg). */
const galleri = (fr, props = {}) => ({
  id: makeId('blk'),
  type: 'galleri',
  version: 1,
  props: { images: [], view: 'grid', columns: 3, gap: 12, radius: 'md', lightbox: true, interval: 5, ...props },
  animation: null,
  frames: fr,
});

/* FAQ-blokk: spørsmålslisten redigeres i Egenskaper og rett i previewen. */
const faq = (fr, items) => ({
  id: makeId('blk'),
  type: 'faq',
  version: 1,
  props: { items, multi: false },
  animation: null,
  frames: fr,
});

/* Sitat-blokk (0.6.7.11): semantisk figure/blockquote med attribusjon. */
const sitat = (fr, props = {}) => ({
  id: makeId('blk'),
  type: 'sitat',
  version: 1,
  props: { text: '', attribution: '', role: '', variant: 'stor', image: '', accent: null, ...props },
  animation: null,
  frames: fr,
});

/* Tidslinje-blokk (0.6.7.11): hendelser langs en tegnet linje. */
const tidslinje = (fr, items) => ({
  id: makeId('blk'),
  type: 'tidslinje',
  version: 1,
  props: { items, variant: 'venstre', marker: 'fylt', accent: null },
  animation: null,
  frames: fr,
});

/* Statistikk-blokk (0.6.7.11): ett nøkkeltall med etikett og tell-opp. */
const statistikk = (fr, props = {}) => ({
  id: makeId('blk'),
  type: 'statistikk',
  version: 1,
  props: { value: '4800', prefix: '', suffix: '', label: '', countUp: true, ...props },
  animation: null,
  frames: fr,
});

const bg = (...layers) => ({ version: 1, layers });
const colorLayer = (value) => ({ type: 'color', version: 1, props: { value } });
const glowLayer = (x, y, opacity, radius = 0.5) => ({
  type: 'glow', version: 1, props: { x, y, color: 'accent', radius, opacity },
});

/* Utvidbare presets: item(section) lager NESTE element (kort/rad/logo) ferdig plassert i første LEDIGE rute (freeSlot under), så knappen virker også etter at eieren har slettet eller flyttet elementer.
   item kan i tillegg returnere moves ([{blockId, dy}]) som flytter eksisterende blokker, f.eks. FAQ som skyver avslutningslinjen ned.
   Plasseringen antar preset-utlegget; har eieren bygget om seksjonen helt, er det nye elementet fortsatt vanlige blokker som kan dras på plass. */
const maxBottom = (sec) => Math.max(0, ...sec.blocks.map((b) => b.frames.desktop.y + b.frames.desktop.h));
const gridSlot = (n, per, x0, dx, y0, dy) => ({ x: x0 + (n % per) * dx, y: y0 + Math.floor(n / per) * dy });

/* Ledig-rute-sok: PROVER rutene i rekkefolge i stedet for aa telle elementer.
   Da fylles hullet igjen naar eieren har slettet et element i midten, i stedet for at telleren synker og neste element legges oppaa et eksisterende.
   yOff/h beskriver hele kortets fotavtrykk rundt ruten (f.eks. ikonet som ligger over boksen). */
const freeSlot = (sec, per, x0, dx, y0, dy, w, h, yOff = 0) => {
  const hits = (r) => sec.blocks.some((b) => {
    const d = b.frames.desktop;
    return d.x < r.x + r.w - 0.01 && r.x < d.x + d.w - 0.01 && d.y < r.y + r.h - 0.01 && r.y < d.y + d.h - 0.01;
  });
  for (let i = 0; i < 60; i++) {
    const slot = gridSlot(i, per, x0, dx, y0, dy);
    if (!hits({ x: slot.x, y: slot.y + yOff, w, h })) return { ...slot, n: i };
  }
  return { x: x0, y: maxBottom(sec) + 16, n: 0 };
};

/* Mobil-stablingsnokkel: holder et korts blokker samlet i auto-stablingen (se stackOrder i render.js).
   Nokkelen tolkes paa samme skala som desktop-y: kolonne 0 sorterer forst, og elementene i kortet holder innbyrdes rekkefolge. */
const cardOrder = (baseY, col, idx) => baseY + col * 0.1 + idx * 0.01;

const section = (preset, minHeight, background, blocks, grid = null) => ({
  id: makeId('sec'),
  version: 1,
  preset,
  size: { minHeight },
  grid,
  background,
  blocks,
  responsive: autoMobile(),
});

export function registerSectionPresets(Urd) {
  /* ---------- Grunnleggende ---------- */

  Urd.sections.define('tom', {
    label: 'Tom seksjon',
    labelKey: 'preset.tom.label',
    group: 'Grunnleggende',
    groupKey: 'presetGroup.basic',
    hint: 'Blankt lerret å bygge fritt på',
    hintKey: 'preset.tom.hint',
    create: () => section('tom', '40vh', bg(colorLayer('bg')), []),
  });

  Urd.sections.define('hero', {
    label: 'Hero',
    labelKey: 'preset.hero.label',
    group: 'Grunnleggende',
    groupKey: 'presetGroup.basic',
    hint: 'Stor åpning med gradient og glød, venstrestilt',
    hintKey: 'preset.hero.hint',
    create: () => section('hero', '70vh', {
      version: 1,
      layers: [
        { type: 'gradient', version: 1, props: { stops: ['#0b0e14', '#1a1030'], angle: 160, animate: false } },
        glowLayer(0.7, 0.2, 0.35),
        { type: 'grain', version: 1, props: { opacity: 0.06 } },
      ],
    }, [
      text(frame(8.33, 40, 50, 38), ta('seed.hero.title')),
      text(frame(8.33, 84, 41.67, 26), ta('seed.hero.intro')),
      button(frame(8.33, 118, 20, 32), ta('seed.readMore')),
    ]),
  });

  Urd.sections.define('hero-sentrert', {
    label: 'Hero, sentrert',
    labelKey: 'preset.hero-sentrert.label',
    group: 'Grunnleggende',
    groupKey: 'presetGroup.basic',
    hint: 'Sentrert åpning med to knapper',
    hintKey: 'preset.hero-sentrert.hint',
    create: () => section('hero-sentrert', '60vh', bg(colorLayer('bg')), [
      text(frame(15, 64, 70, 44), ta('seed.heroCenter.title'), { align: 'center' }),
      text(frame(25, 116, 50, 26), ta('seed.heroCenter.intro'), { align: 'center' }),
      button(frame(31.5, 160, 17, 40), ta('seed.join')),
      button(frame(51.5, 160, 17, 40), ta('seed.readMore'), { style: 'secondary' }),
    ]),
  });

  Urd.sections.define('bilder', {
    label: 'Bilder',
    labelKey: 'preset.bilder.label',
    group: 'Grunnleggende',
    groupKey: 'presetGroup.basic',
    hint: 'Tittel og tre bilderammer',
    hintKey: 'preset.bilder.hint',
    create: () => section('bilder', '360px', bg(colorLayer('bg')), [
      text(frame(4, 24, 50, 32), ta('seed.images.title')),
      image(frame(4, 72, 28, 220)),
      image(frame(36, 72, 28, 220)),
      image(frame(68, 72, 28, 220)),
    ]),
    itemLabel: 'bilde',
    itemLabelKey: 'item.image',
    item: (sec) => {
      const { x, y } = freeSlot(sec, 3, 4, 32, 72, 244, 28, 220);
      return { blocks: [image(frame(x, y, 28, 220))], bottom: y + 244 };
    },
  });

  Urd.sections.define('galleri', {
    label: 'Galleri',
    labelKey: 'preset.galleri.label',
    group: 'Grunnleggende',
    groupKey: 'presetGroup.basic',
    hint: 'Bildegalleri i rutenett med fullskjermvisning (lightbox)',
    hintKey: 'preset.galleri.hint',
    create: () => section('galleri', '440px', bg(colorLayer('bg')), [
      text(frame(4, 24, 50, 32), ta('seed.gallery.title')),
      galleri(frame(4, 72, 92, 320)),
    ]),
  });

  Urd.sections.define('kontakt', {
    label: 'Kontakt',
    labelKey: 'preset.kontakt.label',
    group: 'Grunnleggende',
    groupKey: 'presetGroup.basic',
    hint: 'Kontaktinfo i kort med e-postknapp',
    hintKey: 'preset.kontakt.hint',
    create: () => section('kontakt', '320px', bg(colorLayer('surface'), glowLayer(0.2, 0.8, 0.2)), [
      text(frame(10, 32, 40, 36), ta('seed.contact.title')),
      text(frame(10, 84, 36, 130),
        ta('seed.contact.info'),
        { box: true }),
      button(frame(60, 100, 22, 40), ta('seed.contact.button'), { href: 'mailto:post@dinforening.no' }),
    ]),
  });

  /* Ingen «Footer»-seksjonspreset: den delte footeren bor i Footer-panelet
     (site.footer), ikke som en seksjon per side. */

  /* ---------- Kort og lister ---------- */

  Urd.sections.define('funksjonskort', {
    label: 'Funksjonskort',
    labelKey: 'preset.funksjonskort.label',
    group: 'Kort og lister',
    groupKey: 'presetGroup.cards',
    hint: 'Tre kort med ikon, tittel og tekst',
    hintKey: 'preset.funksjonskort.hint',
    create: () => {
      const card = (x, col, glyph, title) => {
        const ic = icon(frame(x + 10.5, 88, 4, 52), glyph);
        const box = text(frame(x, 152, 25, 200),
          ta('seed.features.card', { title }),
          { align: 'center', box: true });
        box.animation = hoverLift();
        ic.mobileOrder = cardOrder(88, col, 0);
        box.mobileOrder = cardOrder(88, col, 1);
        return [ic, box];
      };
      return section('funksjonskort', '420px', bg(colorLayer('bg')), [
        text(frame(6, 28, 60, 38), ta('seed.features.title')),
        ...card(6, 0, '✦', ta('seed.features.card1')),
        ...card(37.5, 1, '★', ta('seed.features.card2')),
        ...card(69, 2, '✓', ta('seed.features.card3')),
      ]);
    },
    itemLabel: 'kort',
    itemLabelKey: 'item.card',
    item: (sec) => {
      const { x, y, n } = freeSlot(sec, 3, 6, 31.5, 152, 296, 25, 264, -64);
      const ic = icon(frame(x + 10.5, y - 64, 4, 52), '✦');
      const box = text(frame(x, y, 25, 200),
        ta('seed.features.card', { title: ta('seed.features.newTitle') }),
        { align: 'center', box: true });
      box.animation = hoverLift();
      ic.mobileOrder = cardOrder(88, n, 0);
      box.mobileOrder = cardOrder(88, n, 1);
      return { blocks: [ic, box], bottom: y + 228 };
    },
  });

  Urd.sections.define('funksjonskort-enkel', {
    label: 'Funksjonskort uten ikoner',
    labelKey: 'preset.funksjonskort-enkel.label',
    group: 'Kort og lister',
    groupKey: 'presetGroup.cards',
    hint: 'Tre kort med tittel og tekst (uten ikonene over)',
    hintKey: 'preset.funksjonskort-enkel.hint',
    create: () => {
      const card = (x, col, title) => {
        const box = text(frame(x, 88, 25, 200),
          ta('seed.features.card', { title }),
          { align: 'center', box: true });
        box.animation = hoverLift();
        box.mobileOrder = cardOrder(88, col, 0);
        return box;
      };
      return section('funksjonskort-enkel', '360px', bg(colorLayer('bg')), [
        text(frame(6, 28, 60, 38), ta('seed.features.title')),
        card(6, 0, ta('seed.features.card1')),
        card(37.5, 1, ta('seed.features.card2')),
        card(69, 2, ta('seed.features.card3')),
      ]);
    },
    itemLabel: 'kort',
    itemLabelKey: 'item.card',
    item: (sec) => {
      const { x, y, n } = freeSlot(sec, 3, 6, 31.5, 88, 232, 25, 200);
      const box = text(frame(x, y, 25, 200),
        ta('seed.features.card', { title: ta('seed.features.newTitle') }),
        { align: 'center', box: true });
      box.animation = hoverLift();
      box.mobileOrder = cardOrder(88, n, 0);
      return { blocks: [box], bottom: y + 228 };
    },
  });

  Urd.sections.define('nyheter', {
    label: 'Nyheter',
    labelKey: 'preset.nyheter.label',
    group: 'Kort og lister',
    groupKey: 'presetGroup.cards',
    hint: 'Tre nyhetskort med bilde, tag og dato',
    hintKey: 'preset.nyheter.hint',
    create: () => {
      const card = (x, col) => {
        const img = image(frame(x, 88, 25, 160));
        const txt = text(frame(x, 256, 25, 160),
          ta('seed.news.card'));
        img.mobileOrder = cardOrder(88, col, 0);
        txt.mobileOrder = cardOrder(88, col, 1);
        return [img, txt];
      };
      return section('nyheter', '460px', bg(colorLayer('bg')), [
        text(frame(6, 28, 50, 38), ta('seed.news.title')),
        button(frame(78, 30, 16, 36), ta('seed.news.seeAll'), { style: 'secondary' }),
        ...card(6, 0), ...card(37.5, 1), ...card(69, 2),
      ]);
    },
    itemLabel: 'sak',
    itemLabelKey: 'item.story',
    item: (sec) => {
      const { x, y, n } = freeSlot(sec, 3, 6, 31.5, 88, 344, 25, 328);
      const img = image(frame(x, y, 25, 160));
      const txt = text(frame(x, y + 168, 25, 160),
        ta('seed.news.card'));
      img.mobileOrder = cardOrder(88, n, 0);
      txt.mobileOrder = cardOrder(88, n, 1);
      return { blocks: [img, txt], bottom: y + 352 };
    },
  });

  Urd.sections.define('nyheter-samling', {
    label: 'Nyheter (samling)',
    labelKey: 'preset.nyheter-samling.label',
    group: 'Kort og lister',
    groupKey: 'presetGroup.cards',
    hint: 'Nyhetskort fra en samling: skriv innslag, kortene følger med',
    hintKey: 'preset.nyheter-samling.hint',
    create: () => section('nyheter-samling', '300px', bg(colorLayer('bg')), [
      text(frame(6, 28, 50, 38), ta('seed.news.title')),
      samling(frame(6, 88, 88, 180), 'cards'),
    ]),
  });

  Urd.sections.define('oppslagstavle', {
    label: 'Oppslagstavle',
    labelKey: 'preset.oppslagstavle.label',
    group: 'Kort og lister',
    groupKey: 'presetGroup.cards',
    hint: 'Datert liste fra en samling (oppslag/kunngjøringer)',
    hintKey: 'preset.oppslagstavle.hint',
    create: () => section('oppslagstavle', '300px', bg(colorLayer('surface')), [
      text(frame(6, 28, 50, 38), ta('seed.noticeboard.title')),
      samling(frame(6, 88, 88, 180), 'list', { limit: 8 }),
    ]),
  });

  Urd.sections.define('publikasjonsarkiv', {
    label: 'Publikasjonsarkiv',
    labelKey: 'preset.publikasjonsarkiv.label',
    group: 'Kort og lister',
    groupKey: 'presetGroup.cards',
    hint: 'År-gruppert arkiv fra en samling (utgaver, referater, rapporter)',
    hintKey: 'preset.publikasjonsarkiv.hint',
    create: () => section('publikasjonsarkiv', '300px', bg(colorLayer('bg')), [
      text(frame(6, 28, 60, 38), ta('seed.archive.title')),
      samling(frame(6, 88, 88, 180), 'archive', { limit: 0 }),
    ]),
  });

  Urd.sections.define('arrangementer', {
    label: 'Arrangementer',
    labelKey: 'preset.arrangementer.label',
    group: 'Kort og lister',
    groupKey: 'presetGroup.cards',
    hint: 'Tre rader med dato-badge og påmeldingsknapp',
    hintKey: 'preset.arrangementer.hint',
    create: () => {
      const row = (y, day, month, title) => [
        text(frame(6, y, 8, 88), ta('seed.events.dateBadge', { day, month }), { align: 'center', box: true }),
        text(frame(16, y, 58, 88), ta('seed.events.row', { title })),
        button(frame(78, y + 24, 16, 40), ta('seed.events.signup'), { style: 'secondary' }),
      ];
      return section('arrangementer', '440px', bg(colorLayer('surface')), [
        text(frame(6, 28, 50, 38), ta('seed.events.title')),
        ...row(88, '11', ta('seed.events.monthAug'), ta('seed.events.row1')),
        ...row(196, '25', ta('seed.events.monthAug'), ta('seed.events.row2')),
        ...row(304, '8', ta('seed.events.monthSep'), ta('seed.events.row3')),
      ]);
    },
    itemLabel: 'rad',
    itemLabelKey: 'item.row',
    item: (sec) => {
      const y = maxBottom(sec) + 16;
      return {
        blocks: [
          text(frame(6, y, 8, 88), ta('seed.events.newBadge'), { align: 'center', box: true }),
          text(frame(16, y, 58, 88), ta('seed.events.row', { title: ta('seed.events.newTitle') })),
          button(frame(78, y + 24, 16, 40), ta('seed.events.signup'), { style: 'secondary' }),
        ],
        bottom: y + 116,
      };
    },
  });

  Urd.sections.define('team', {
    label: 'Team/styret',
    labelKey: 'preset.team.label',
    group: 'Kort og lister',
    groupKey: 'presetGroup.cards',
    hint: 'Portretter med navn, verv og e-post',
    hintKey: 'preset.team.hint',
    create: () => {
      const member = (x, col, role) => {
        const img = image(frame(x, 80, 22, 180), { alt: ta('seed.team.alt') });
        const txt = text(frame(x, 268, 22, 84),
          ta('seed.team.member', { role }),
          { align: 'center' });
        img.mobileOrder = cardOrder(80, col, 0);
        txt.mobileOrder = cardOrder(80, col, 1);
        return [img, txt];
      };
      return section('team', '420px', bg(colorLayer('surface')), [
        text(frame(6, 24, 50, 32), ta('seed.team.title')),
        ...member(7.5, 0, ta('seed.team.role1')), ...member(39, 1, ta('seed.team.role2')), ...member(70.5, 2, ta('seed.team.role3')),
      ]);
    },
    itemLabel: 'person',
    itemLabelKey: 'item.person',
    item: (sec) => {
      const { x, y, n } = freeSlot(sec, 3, 7.5, 31.5, 80, 288, 22, 272);
      const img = image(frame(x, y, 22, 180), { alt: ta('seed.team.alt') });
      const txt = text(frame(x, y + 188, 22, 84),
        ta('seed.team.member', { role: ta('seed.team.roleNew') }),
        { align: 'center' });
      img.mobileOrder = cardOrder(80, n, 0);
      txt.mobileOrder = cardOrder(80, n, 1);
      return { blocks: [img, txt], bottom: y + 296 };
    },
  });

  Urd.sections.define('faq', {
    label: 'FAQ',
    labelKey: 'preset.faq.label',
    group: 'Kort og lister',
    groupKey: 'presetGroup.cards',
    hint: 'Spørsmål og svar i kort',
    hintKey: 'preset.faq.hint',
    // Modernisert i 0.6.7.11: bruker faq-blokken (levert 0.6.6.4) i stedet
    // for tekstboks-etterligningen. Nye spørsmål legges til i Egenskaper
    // eller rett i previewen, så preset-item-knappen trengs ikke lenger.
    create: () => section('faq', '520px', bg(colorLayer('bg')), [
      text(frame(25, 24, 50, 36), ta('seed.faq.title'), { align: 'center' }),
      faq(frame(20, 80, 60, 320), [
        { q: ta('seed.faq.q1'), a: ta('seed.faq.answer') },
        { q: ta('seed.faq.q2'), a: ta('seed.faq.answer') },
        { q: ta('seed.faq.q3'), a: ta('seed.faq.answer') },
      ]),
      text(frame(20, 416, 60, 32),
        ta('seed.faq.more'),
        { align: 'center' }),
    ]),
  });

  Urd.sections.define('tidslinje', {
    label: 'Tidslinje',
    labelKey: 'preset.tidslinje.label',
    group: 'Kort og lister',
    groupKey: 'presetGroup.cards',
    hint: 'Historien som hendelser langs en linje',
    hintKey: 'preset.tidslinje.hint',
    create: () => section('tidslinje', '480px', bg(colorLayer('bg')), [
      text(frame(25, 24, 50, 36), ta('seed.tidslinje.title'), { align: 'center' }),
      tidslinje(frame(25, 88, 50, 330), [
        { year: '2019', title: ta('seed.tidslinje.t1'), text: ta('seed.tidslinje.text') },
        { year: '2022', title: ta('seed.tidslinje.t2'), text: ta('seed.tidslinje.text') },
        { year: '2026', title: ta('seed.tidslinje.t3'), text: ta('seed.tidslinje.text') },
      ]),
    ]),
  });

  Urd.sections.define('steg', {
    label: 'Steg for steg',
    labelKey: 'preset.steg.label',
    group: 'Kort og lister',
    groupKey: 'presetGroup.cards',
    hint: 'Tre nummererte kort',
    hintKey: 'preset.steg.hint',
    create: () => {
      const step = (x, col, title) => {
        const num = text(frame(x, 88, 25, 72), `<h3>${col + 1}</h3>`, { align: 'center', size: 44 });
        const box = text(frame(x, 168, 25, 160),
          ta('seed.steps.card', { title }),
          { align: 'center', box: true });
        num.mobileOrder = cardOrder(88, col, 0);
        box.mobileOrder = cardOrder(88, col, 1);
        return [num, box];
      };
      return section('steg', '400px', bg(colorLayer('bg')), [
        text(frame(6, 28, 60, 38), ta('seed.steps.title')),
        ...step(6, 0, ta('seed.steps.s1')),
        ...step(37.5, 1, ta('seed.steps.s2')),
        ...step(69, 2, ta('seed.steps.s3')),
      ]);
    },
    itemLabel: 'steg',
    itemLabelKey: 'item.step',
    item: (sec) => {
      const { x, y, n } = freeSlot(sec, 3, 6, 31.5, 88, 272, 25, 240);
      const num = text(frame(x, y, 25, 72), `<h3>${n + 1}</h3>`, { align: 'center', size: 44 });
      const box = text(frame(x, y + 80, 25, 160),
        ta('seed.steps.card', { title: ta('seed.steps.newTitle') }),
        { align: 'center', box: true });
      num.mobileOrder = cardOrder(88, n, 0);
      box.mobileOrder = cardOrder(88, n, 1);
      return { blocks: [num, box], bottom: y + 268 };
    },
  });

  Urd.sections.define('hovedoppslag', {
    label: 'Hovedoppslag',
    labelKey: 'preset.hovedoppslag.label',
    group: 'Kort og lister',
    groupKey: 'presetGroup.cards',
    hint: 'Én stor sak og to små ved siden',
    hintKey: 'preset.hovedoppslag.hint',
    create: () => {
      // mobileOrder holder hovedsaken samlet (bilde, ingress, knapp) foran småsakene i mobil-stablingen.
      const blocks = [
        image(frame(6, 40, 55, 300)),
        text(frame(6, 348, 55, 108), ta('seed.feature.main')),
        button(frame(6, 464, 14, 38), ta('seed.readMore'), { style: 'secondary' }),
        image(frame(66, 40, 28, 120)),
        text(frame(66, 164, 28, 60), ta('seed.feature.small1')),
        image(frame(66, 244, 28, 120)),
        text(frame(66, 368, 28, 60), ta('seed.feature.small2')),
      ];
      blocks.forEach((block, i) => { block.mobileOrder = cardOrder(40, i < 3 ? 0 : 1, i); });
      return section('hovedoppslag', '540px', bg(colorLayer('bg')), blocks);
    },
  });

  Urd.sections.define('produkter', {
    label: 'Produkter',
    labelKey: 'preset.produkter.label',
    group: 'Kort og lister',
    groupKey: 'presetGroup.cards',
    hint: 'Tre produktkort; pek Kjøp-knappen på en betalingslenke (f.eks. Vipps)',
    hintKey: 'preset.produkter.hint',
    create: () => {
      const product = (x, col, name, price) => {
        const blocks = [
          image(frame(x, 88, 25, 200)),
          text(frame(x, 296, 25, 76), ta('seed.products.card', { name, price }), { align: 'center' }),
          button(frame(x + 5, 380, 15, 40), ta('seed.products.buy')),
        ];
        blocks.forEach((block, i) => { block.mobileOrder = cardOrder(88, col, i); });
        return blocks;
      };
      return section('produkter', '470px', bg(colorLayer('bg')), [
        text(frame(6, 28, 50, 38), ta('seed.products.title')),
        ...product(6, 0, ta('seed.products.name'), ta('seed.products.price1')),
        ...product(37.5, 1, ta('seed.products.name'), ta('seed.products.price2')),
        ...product(69, 2, ta('seed.products.name'), ta('seed.products.price3')),
      ]);
    },
    itemLabel: 'produkt',
    itemLabelKey: 'item.product',
    item: (sec) => {
      const { x, y, n } = freeSlot(sec, 3, 6, 31.5, 88, 348, 25, 332);
      const blocks = [
        image(frame(x, y, 25, 200)),
        text(frame(x, y + 208, 25, 76), ta('seed.products.card', { name: ta('seed.products.name'), price: ta('seed.products.price1') }), { align: 'center' }),
        button(frame(x + 5, y + 292, 15, 40), ta('seed.products.buy')),
      ];
      blocks.forEach((block, i) => { block.mobileOrder = cardOrder(88, n, i); });
      return { blocks, bottom: y + 356 };
    },
  });

  /* ---------- Fremheving ---------- */

  Urd.sections.define('cta', {
    label: 'CTA-banner',
    labelKey: 'preset.cta.label',
    group: 'Fremheving',
    groupKey: 'presetGroup.highlight',
    hint: 'Full bredde med én tydelig handling',
    hintKey: 'preset.cta.hint',
    create: () => section('cta', '280px', bg(colorLayer('surface'), glowLayer(0.5, 0.5, 0.3, 0.7)), [
      text(frame(20, 56, 60, 40), ta('seed.cta.title'), { align: 'center' }),
      text(frame(25, 104, 50, 26), ta('seed.cta.sub'), { align: 'center' }),
      button(frame(42, 148, 16, 42), ta('seed.join')),
    ]),
  });

  Urd.sections.define('sitat', {
    label: 'Sitat',
    labelKey: 'preset.sitat.label',
    group: 'Fremheving',
    groupKey: 'presetGroup.highlight',
    hint: 'Stort sitat med attribusjon',
    hintKey: 'preset.sitat.hint',
    // Modernisert i 0.6.7.11: bruker sitat-blokken (semantisk blockquote)
    // i stedet for to løse tekstblokker.
    create: () => section('sitat', '300px', bg(colorLayer('bg')), [
      sitat(frame(20, 56, 60, 190), {
        text: ta('seed.sitat.text'),
        attribution: ta('seed.sitat.name'),
        role: ta('seed.sitat.role'),
      }),
    ]),
  });

  Urd.sections.define('statistikk', {
    label: 'Statistikk',
    labelKey: 'preset.statistikk.label',
    group: 'Fremheving',
    groupKey: 'presetGroup.highlight',
    hint: 'Tre store tall med etikett',
    hintKey: 'preset.statistikk.hint',
    // Modernisert i 0.6.7.12: bruker statistikk-blokken (tell-opp ved entré)
    // i stedet for to tekstblokker per tall.
    create: () => {
      const stat = (x, col, value, suffix, label) => {
        const s = statistikk(frame(x, 76, 25, 120), { value, suffix, label });
        s.mobileOrder = cardOrder(76, col, 0);
        return s;
      };
      return section('statistikk', '260px', bg(colorLayer('surface')), [
        stat(6, 0, '120', '+', ta('seed.stats.l1')),
        stat(37.5, 1, '25', '', ta('seed.stats.l2')),
        stat(69, 2, '1981', '', ta('seed.stats.l3')),
      ]);
    },
    itemLabel: 'tall',
    itemLabelKey: 'item.number',
    item: (sec) => {
      const { x, y, n } = freeSlot(sec, 3, 6, 31.5, 76, 140, 25, 120);
      const s = statistikk(frame(x, y, 25, 120), { value: '42', label: ta('seed.stats.newLabel') });
      s.mobileOrder = cardOrder(76, n, 0);
      return { blocks: [s], bottom: y + 148 };
    },
  });

  Urd.sections.define('sponsorer', {
    label: 'Sponsorer',
    labelKey: 'preset.sponsorer.label',
    group: 'Fremheving',
    groupKey: 'presetGroup.highlight',
    hint: 'Logorad i gråtone med lenker',
    hintKey: 'preset.sponsorer.hint',
    create: () => {
      // saturate 0 gir gråtonede logoer (klassisk sponsorband).
      // Logoen vises hel (contain) uten avrunding.
      const logo = (x) => image(frame(x, 108, 18.5, 100),
        { alt: ta('seed.sponsors.alt'), fit: 'contain', radius: null, saturate: 0 });
      return section('sponsorer', '280px', bg(colorLayer('bg')), [
        text(frame(6, 28, 60, 36), ta('seed.sponsors.title')),
        logo(5.5), logo(29), logo(52.5), logo(76),
      ]);
    },
    itemLabel: 'logo',
    itemLabelKey: 'item.logo',
    item: (sec) => {
      const { x, y } = freeSlot(sec, 4, 5.5, 23.5, 108, 124, 18.5, 100);
      return {
        blocks: [image(frame(x, y, 18.5, 100),
          { alt: ta('seed.sponsors.alt'), fit: 'contain', radius: null, saturate: 0 })],
        bottom: y + 124,
      };
    },
  });

  Urd.sections.define('medlemskap', {
    label: 'Medlemskap',
    labelKey: 'preset.medlemskap.label',
    group: 'Fremheving',
    groupKey: 'presetGroup.highlight',
    hint: 'Prisnivåer med fordeler og Vipps-linje',
    hintKey: 'preset.medlemskap.hint',
    create: () => section('medlemskap', '500px', bg(colorLayer('surface')), [
      text(frame(6, 28, 50, 38), ta('seed.membership.title')),
      text(frame(14, 88, 32, 250),
        ta('seed.membership.tier1'),
        { align: 'center', box: true }),
      text(frame(54, 88, 32, 250),
        ta('seed.membership.tier2'),
        { align: 'center', box: true }),
      button(frame(42, 358, 16, 42), ta('seed.join')),
      text(frame(25, 414, 50, 30), ta('seed.membership.vipps'), { align: 'center' }),
    ]),
  });
}
