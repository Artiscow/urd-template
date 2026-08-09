/**
 * Kjerneblokk: bilde. Viser en fil fra media/ (eller en data-URL for
 * upubliserte opplastinger i utkast). Med href blir bildet en lenke,
 * som også dekker logo-bruk.
 *
 * Bildet ligger i en ramme (.urd-image-frame) som klipper: da vises
 * avrunding ALLTID (også med «Vis hele bildet»/contain), og zoom beskjærer
 * inn mot fokuspunktet. Én felles applyImageStyle brukes av render OG den
 * flytende bildeeditoren, så de aldri kan drifte fra hverandre.
 */

import { isSafeHref } from '../nav-model.js';

/** Anvender den ikke-destruktive bildestilen på rammen + bildet.
 *  @param {HTMLElement} frame Rammeelementet (.urd-image-frame) med <img> inni */
export function applyImageStyle(frame, props) {
  const img = frame.querySelector('img');
  if (!img) return;
  const focus = `${(props.x ?? 0.5) * 100}% ${(props.y ?? 0.5) * 100}%`;
  img.alt = props.alt ?? '';
  img.style.objectFit = props.fit ?? 'cover';
  img.style.objectPosition = focus;
  // Zoom beskjærer inn mot fokuspunktet; rammen klipper resten.
  const zoom = Number(props.zoom) || 1;
  img.style.transform = zoom !== 1 ? `scale(${zoom})` : '';
  img.style.transformOrigin = focus;
  const filters = [];
  if (props.brightness != null && props.brightness !== 1) filters.push(`brightness(${props.brightness})`);
  if (props.contrast != null && props.contrast !== 1) filters.push(`contrast(${props.contrast})`);
  if (props.saturate != null && props.saturate !== 1) filters.push(`saturate(${props.saturate})`);
  img.style.filter = filters.join(' ');
  // Avrunding på RAMMEN (som klipper), så den vises uansett tilpasning.
  frame.style.borderRadius = props.radius ? `var(--urd-radius-${props.radius})` : '';
}

export const imageBlock = {
  version: 1,
  label: 'Bilde',
  labelKey: 'blocks.image',
  defaults: () => ({
    src: '', alt: '', fit: 'cover', radius: 'md', href: null,
    // Additive felt: fokuspunkt (0..1), zoom (1 = ingen) og ikke-destruktive
    // CSS-justeringer (1 = nøytral). lightbox åpner bildet i fullskjerm ved
    // klikk hos besøkende (fravær = false, så gamle data trenger ingen migrering).
    x: 0.5, y: 0.5, zoom: 1, brightness: 1, contrast: 1, saturate: 1,
    lightbox: false,
  }),
  migrations: {},
  /**
   * @param {HTMLElement} el
   * @param {{src: string, alt: string, fit: 'cover'|'contain', radius: string|null, href: string|null}} props
   * @param {object} ctx
   */
  render(el, props, ctx) {
    // Uten bilde: rolig plassholder i editoren; besøkende ser ingenting.
    if (!props.src) {
      if (ctx.preview) {
        const empty = document.createElement('div');
        empty.className = 'urd-image-empty';
        empty.textContent = 'Velg bilde i Egenskaper';
        el.appendChild(empty);
      }
      return;
    }
    const frame = document.createElement('span');
    frame.className = 'urd-image-frame';
    const img = document.createElement('img');
    // Innholdsbilder hentes først når de nærmer seg viewporten: sparer bilder
    // under folden på tunge sider. loading/decoding settes FØR src, ellers kan
    // nettleseren ha startet hentingen allerede. (Samling/galleri/video gjør likt.)
    img.loading = 'lazy';
    img.decoding = 'async';
    img.src = props.src;
    img.draggable = false;
    // Store bilder dekodes stripevis mens de laster (ser ut som en
    // gradvis «inntoning» ovenfra): hold bildet usynlig til det er
    // FERDIG, og vis det komplett med en gang. Cachede bilder berøres ikke.
    if (!img.complete) {
      img.style.visibility = 'hidden';
      img.addEventListener('load', () => { img.style.visibility = ''; }, { once: true });
      img.addEventListener('error', () => { img.style.visibility = ''; }, { once: true });
    }
    frame.appendChild(img);
    applyImageStyle(frame, props);

    // Delt vokter (nav/footer + interne stier/anker): en utrygg href behandles som om lenken ikke fantes.
    const safeHref = props.href && isSafeHref(props.href) ? props.href : null;
    if (safeHref && !ctx.preview) {
      const a = document.createElement('a');
      a.href = safeHref;
      a.appendChild(frame);
      el.appendChild(a);
    } else {
      el.appendChild(frame);
    }

    // Fullskjerm ved klikk: hos besøkende alltid når feltet er på; i preview
    // kun i Ren visning (ellers eier redigeringen klikket). Lenke vinner.
    if (props.lightbox && !safeHref) {
      frame.classList.add('urd-lightbox-able');
      frame.addEventListener('click', async () => {
        if (ctx.preview && !document.body.classList.contains('urd-chrome-off')) return;
        const { openLightbox } = await import('../lightbox.js');
        openLightbox([{ src: props.src, alt: props.alt, style: props }], 0);
      });
    }
  },
};
